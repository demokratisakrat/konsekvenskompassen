import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Partibokstavs-chips: samma åtta färger som i logotypen. Bokstaven bär
// informationen (fyra partier är blå, två röda — och färgblinda ska inte
// behöva gissa); färgen är igenkänningshjälp, inte informationsbärare.
const PARTY_CHIPS: Record<string, { bg: string; fg: string }> = {
  S: { bg: "#ED1B34", fg: "#ffffff" },
  V: { bg: "#AF0D0D", fg: "#ffffff" },
  MP: { bg: "#53A045", fg: "#ffffff" },
  C: { bg: "#01683A", fg: "#ffffff" },
  L: { bg: "#0069B4", fg: "#ffffff" },
  M: { bg: "#52BDEC", fg: "#111827" },
  KD: { bg: "#2B2E83", fg: "#ffffff" },
  SD: { bg: "#DDCC00", fg: "#111827" },
};

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
