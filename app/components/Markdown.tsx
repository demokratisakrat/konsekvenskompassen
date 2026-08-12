import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PARTY_CHIPS } from "../lib/party-colors";

function plainText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map((c) => (typeof c === "string" ? c : "")).join("");
  }
  return "";
}

function PartyChip({ abbr }: { abbr: string }) {
  const c = PARTY_CHIPS[abbr];
  return (
    <span
      className="inline-block rounded-md px-1.5 py-0.5 text-xs font-bold leading-none"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {abbr}
    </span>
  );
}

// Närhetsomdömena får monokrom intensitet — medvetet inte grönt/gult/rött,
// som både är partifärger och skriker värdering. ⚠️-flaggan följer med.
function VerdictBadge({ text }: { text: string }) {
  const warn = text.includes("⚠️");
  const word = text.replace("⚠️", "").trim();
  const cls =
    word === "NÄRA"
      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
      : word === "DELVIS"
        ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
        : "text-gray-500 border border-gray-300 dark:border-gray-600 dark:text-gray-400";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-semibold leading-none ${cls}`}
    >
      {word.toLowerCase()}
      {warn ? " ⚠️" : ""}
    </span>
  );
}

const VERDICT_RE = /^(NÄRA|DELVIS|SKAVER)(\s*⚠️)?$/;

export function Markdown({
  children,
  compact,
}: {
  children: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "markdown markdown-chat" : "markdown"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: (props) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
          th: ({ children: cell, ...props }) => {
            const text = plainText(cell).trim();
            if (PARTY_CHIPS[text]) {
              return (
                <th {...props}>
                  <PartyChip abbr={text} />
                </th>
              );
            }
            return <th {...props}>{cell}</th>;
          },
          td: ({ children: cell, ...props }) => {
            const text = plainText(cell).trim();
            if (VERDICT_RE.test(text)) {
              return (
                <td {...props}>
                  <VerdictBadge text={text} />
                </td>
              );
            }
            if (PARTY_CHIPS[text]) {
              return (
                <td {...props}>
                  <PartyChip abbr={text} />
                </td>
              );
            }
            return <td {...props}>{cell}</td>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
