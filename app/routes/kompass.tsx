import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/kompass";
import { Markdown } from "../components/Markdown";
import { Logo } from "../components/Logo";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Valsnack" }];
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const KICKOFF = "Starta kompassen.";
const STEP_LABELS: Record<number, string> = {
  1: "Väljarprofil",
  2: "Principfrågor",
  3: "Sakfrågor 2026",
  4: "Analys",
  5: "Partimatchning",
};

export default function Kompass() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionStartRef = useRef<number>(Date.now());
  const lapStartRef = useRef<number>(Date.now());
  const stepRef = useRef(1);
  const step5LoggedRef = useRef(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [comment, setComment] = useState("");
  const [commentSent, setCommentSent] = useState(false);
  const feedbackAutoOpenedRef = useRef(false);

  function logStepTiming(completedStep: number, lapMs: number) {
    const totalElapsedMs = Date.now() - sessionStartRef.current;
    fetch("/api/timing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        step: completedStep,
        lapMs,
        totalElapsedMs,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  async function send(history: ChatMessage[]) {
    setPending(true);
    setError(null);
    setStreamingText("");
    setWaitSeconds(0);
    let text = "";
    let reachedStep5 = false;
    let streamError = false;

    const waitTimer = setInterval(() => {
      setWaitSeconds((s) => s + 1);
    }, 1000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history,
          sessionId: sessionIdRef.current,
        }),
      });
      if (!res.body) throw new Error("Inget svar från servern");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const eventMatch = rawEvent.match(/^event: (.+)$/m);
          const dataMatch = rawEvent.match(/^data: (.+)$/m);
          if (!eventMatch || !dataMatch) continue;
          const data = JSON.parse(dataMatch[1]);

          if (eventMatch[1] === "step") {
            const newStep: number = data.step;
            if (newStep > stepRef.current) {
              const now = Date.now();
              logStepTiming(stepRef.current, now - lapStartRef.current);
              lapStartRef.current = now;
              stepRef.current = newStep;
              if (newStep === 5) reachedStep5 = true;
            }
            setCurrentStep(stepRef.current);
          } else if (eventMatch[1] === "delta") {
            if (!text) clearInterval(waitTimer);
            text += data.text;
            setStreamingText(text);
          } else if (eventMatch[1] === "error") {
            streamError = true;
            setError(data.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      clearInterval(waitTimer);
      if (text) {
        setMessages([...history, { role: "assistant", content: text }]);
      }
      // Steg 5 är sista steget — ingen nästa stegmarkör stänger dess varv.
      // Logga varvet när matchningssvaret är färdigproducerat: det mäter
      // genereringstiden (inte lästiden), men garanterar att steget syns i
      // statistiken för varje producerad matchning.
      if (reachedStep5 && text && !streamError && !step5LoggedRef.current) {
        const now = Date.now();
        logStepTiming(5, now - lapStartRef.current);
        lapStartRef.current = now;
        step5LoggedRef.current = true;
      }
      setStreamingText(null);
      setPending(false);
    }
  }

  function waitingLabel(seconds: number, step: number): string {
    // Steg 4 (analys) och steg 5 (matchning) genereras medan currentStep
    // fortfarande visar föregående steg (markören kommer först i nästa svar),
    // så vi räknar redan från steg 3 som "kan bli en lång analys".
    const longStep = step >= 3;
    if (seconds < 6) return "Tänker …";
    if (longStep) {
      if (seconds < 30) {
        return "Sammanställer analysen — det här steget brukar ta ungefär en minut …";
      }
      return "Nästan klart — en fullständig analys kan ibland ta upp till två minuter …";
    }
    if (seconds < 20) return "Tänker fortfarande …";
    return "Tar lite längre tid än vanligt, men jobbar på det …";
  }

  async function submitFeedback(score: number) {
    setFeedbackPending(true);
    // Stäng pågående varv — utom om steg 5 redan loggats vid produktion,
    // då skulle det bli en dubbelräkning av steget.
    if (!(stepRef.current === 5 && step5LoggedRef.current)) {
      const now = Date.now();
      logStepTiming(stepRef.current, now - lapStartRef.current);
      lapStartRef.current = now;
    }
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, score }),
      });
      setFeedbackSent(true);
    } finally {
      setFeedbackPending(false);
    }
  }

  async function submitComment() {
    const text = comment.trim();
    if (!text) return;
    setFeedbackPending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, comment: text }),
      });
      setCommentSent(true);
    } finally {
      setFeedbackPending(false);
    }
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const history: ChatMessage[] = [{ role: "user", content: KICKOFF }];
    setMessages(history);
    send(history);
  }, []);

  // Scrolla till botten även när feedbackpanelen öppnas/stängs — den ändrar
  // chattens höjd, vilket annars lämnar historiken halvt urscrollad.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, feedbackOpen, feedbackSent, commentSent]);

  // När analysen (steg 4) är klar: öppna feedbackpanelen en gång automatiskt —
  // headerlänken är lätt att missa i just det ögonblick då folk vill tycka till.
  useEffect(() => {
    if (
      currentStep >= 4 &&
      !pending &&
      messages.some((m) => m.role === "assistant") &&
      !feedbackSent &&
      !feedbackAutoOpenedRef.current
    ) {
      feedbackAutoOpenedRef.current = true;
      setFeedbackOpen(true);
    }
  }, [currentStep, pending, messages, feedbackSent]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const shown = messages.filter((m) => m.content !== KICKOFF);

  function submitCurrentInput() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    const history: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(history);
    send(history);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitCurrentInput();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitCurrentInput();
    }
  }

  function downloadConversation() {
    // Skriv ut den dolda utskriftsvyn — "Spara som PDF" i utskriftsdialogen.
    // PDF:en skapas helt lokalt i webbläsaren; inget skickas någonstans.
    const previousTitle = document.title;
    document.title = `valsnack-samtal-${new Date().toISOString().slice(0, 10)}`;
    window.print();
    document.title = previousTitle;
  }

  return (
    <main className="mx-auto flex h-screen max-w-2xl flex-col px-4 py-6 print:block print:h-auto">
      {/* contents = osynlig för layouten; print:hidden döljer hela appvyn vid utskrift */}
      <div className="contents print:hidden">
      <header className="mb-6 flex items-start justify-between border-b border-gray-200 pb-5 pt-2 dark:border-gray-800">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <Link to="/" className="hover:underline">
              ← Startsidan
            </Link>
          </p>
          <div className="mt-1 flex items-center gap-2.5">
            <Logo size={26} />
            <h1 className="text-xl font-bold">Valsnack</h1>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            En valkompass som inte bara frågar vad du tycker — den visar vad
            dina svar kostar, och vem som får betala.
          </p>
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentStep <= 4
                ? `Steg ${currentStep} av 4 — ${STEP_LABELS[currentStep]}`
                : `Tillval — ${STEP_LABELS[currentStep]}`}
            </p>
            <div className="mt-1.5 flex max-w-xs gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${
                    currentStep >= s
                      ? "bg-gray-900 dark:bg-white"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {shown.length > 0 && (
            <button
              type="button"
              onClick={downloadConversation}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Spara som PDF
            </button>
          )}
          {!feedbackSent && (
            <button
              type="button"
              onClick={() => setFeedbackOpen((v) => !v)}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Ge feedback
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {shown.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="ml-auto max-w-[80%] whitespace-pre-wrap rounded-2xl bg-gray-900 px-4 py-2 text-white dark:bg-white dark:text-gray-900"
            >
              {m.content}
            </div>
          ) : (
            <div
              key={i}
              className="max-w-[80%] rounded-2xl border border-gray-200 px-4 py-2 dark:border-gray-800"
            >
              <Markdown compact>{m.content}</Markdown>
            </div>
          ),
        )}
        {streamingText !== null &&
          (streamingText ? (
            <div className="max-w-[80%] rounded-2xl border border-gray-200 px-4 py-2 dark:border-gray-800">
              <Markdown compact>{streamingText}</Markdown>
            </div>
          ) : (
            <div className="max-w-[80%] rounded-2xl border border-gray-200 px-4 py-2 text-gray-400 dark:border-gray-800">
              {waitingLabel(waitSeconds, currentStep)}
            </div>
          ))}
        {error && (
          <div className="max-w-[80%] rounded-2xl bg-red-100 px-4 py-2 text-red-800 dark:bg-red-950 dark:text-red-200">
            Fel: {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-gray-200 pt-3 dark:border-gray-800"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv ditt svar... (Enter för att skicka, Shift+Enter för ny rad)"
          disabled={pending}
          autoFocus
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
        />
        <button
          type="submit"
          disabled={pending}
          className="self-end rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-gray-900"
        >
          Skicka
        </button>
      </form>
      {feedbackOpen && !feedbackSent && (
        <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <p className="mb-2 text-sm">
            Hur användbart var detta, på en skala 0–10?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 11 }, (_, score) => (
              <button
                key={score}
                type="button"
                disabled={feedbackPending}
                onClick={() => submitFeedback(score)}
                className="h-8 w-8 rounded-md border border-gray-300 text-sm hover:bg-gray-900 hover:text-white disabled:opacity-50 dark:border-gray-700 dark:hover:bg-white dark:hover:text-gray-900"
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      )}
      {feedbackSent && !commentSent && (
        <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Tack! Något du vill tillägga? (Frivilligt — kommentaren sparas, så
            skriv inget du inte vill dela.)
          </p>
          <div className="flex gap-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={feedbackPending}
              rows={2}
              maxLength={2000}
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
            />
            <button
              type="button"
              onClick={submitComment}
              disabled={feedbackPending || !comment.trim()}
              className="self-end rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-gray-700"
            >
              Skicka
            </button>
          </div>
        </div>
      )}
      {commentSent && (
        <div className="mt-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Tack för din feedback!
        </div>
      )}
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Dina svar lagras inte på servern och kopplas inte till vem du är.
        Frågan om yrke/ort är frivillig.{" "}
        <Link to="/integritet" className="underline underline-offset-2">
          Så hanteras dina uppgifter
        </Link>
      </p>
      </div>

      {/* Utskriftsvy — enbart synlig vid utskrift/Spara som PDF */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">Valsnack — mitt samtal</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">
          {new Date().toLocaleDateString("sv-SE")} · valsnack.se
        </p>
        <div className="space-y-4">
          {shown.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="whitespace-pre-wrap">
                <span className="font-bold">Du: </span>
                {m.content}
              </div>
            ) : (
              <div key={i}>
                <span className="font-bold">Kompassen:</span>
                <Markdown compact>{m.content}</Markdown>
              </div>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
