import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CellHookData } from "jspdf-autotable";
import { PARTY_CHIPS } from "./party-colors";

// Bygger PDF:en direkt i webbläsaren — inget samtalsinnehåll skickas någonstans.
// Appens typsnitt (Geist) bäddas in när det går att ladda; annars Helvetica.
// De inbäddade fonterna klarar åäö m.m. men inte emoji, så ⚠️ och pilar
// ersätts med textmotsvarigheter.

type ChatMessage = { role: "user" | "assistant"; content: string };

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const MAX_W = PAGE_W - 2 * MARGIN;

const INK: [number, number, number] = [17, 24, 39]; // gray-900
const BODY: [number, number, number] = [31, 41, 55]; // gray-800
const MUTED: [number, number, number] = [107, 114, 128]; // gray-500
const RULE: [number, number, number] = [229, 231, 235]; // gray-200
const WHITE: [number, number, number] = [255, 255, 255];

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// Rensar bort det fonterna inte klarar — men behåller **fetstil** åt
// radbrytningslayouten. stripBold används där fetstil ändå inte renderas.
function sanitize(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/⚠️?/gu, "(!)")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, "")
    .trim();
}

function stripBold(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
}

type Run = { text: string; bold: boolean };

function parseRuns(s: string): Run[] {
  const runs: Run[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) runs.push({ text: s.slice(last, m.index), bold: false });
    runs.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < s.length) runs.push({ text: s.slice(last), bold: false });
  return runs;
}

type Block =
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "heading"; text: string }
  | { kind: "listItem"; text: string; marker: string }
  | { kind: "quote"; text: string }
  | { kind: "paragraph"; text: string };

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => stripBold(sanitize(c)));
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    const joined = sanitize(paragraph.join(" "));
    paragraph = [];
    if (joined) blocks.push({ kind: "paragraph", text: joined });
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith("|")) {
      flushParagraph();
      const head = parseTableRow(trimmed);
      const rows: string[][] = [];
      let j = i + 1;
      // Hoppa över separatorraden (|---|---|)
      if (j < lines.length && /^\|?[\s|:-]+\|?$/.test(lines[j].trim())) j++;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push(parseTableRow(lines[j].trim()));
        j++;
      }
      blocks.push({ kind: "table", head, rows });
      i = j - 1;
      continue;
    }

    const heading = trimmed.match(/^#{1,4}\s+(.*)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "heading", text: stripBold(sanitize(heading[1])) });
      continue;
    }

    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      const text = stripBold(sanitize(quote[1]));
      if (text) blocks.push({ kind: "quote", text });
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (bullet || numbered) {
      flushParagraph();
      blocks.push({
        kind: "listItem",
        text: sanitize(bullet ? bullet[1] : numbered![2]),
        marker: bullet ? "•" : `${numbered![1]}.`,
      });
      continue;
    }

    if (trimmed === "") {
      flushParagraph();
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

// Chips och närhetsomdömen ritas som pluttar precis som i chatten:
// partibokstäver i partifärg, omdömen i monokrom intensitet (medvetet
// inte grönt/gult/rött).
type Pill = {
  label: string;
  fill?: [number, number, number];
  stroke?: [number, number, number];
  textColor: [number, number, number];
};

function pillFor(section: string, text: string): Pill | null {
  if (section === "head") {
    const chip = PARTY_CHIPS[text];
    if (!chip) return null;
    return {
      label: text,
      fill: hexToRgb(chip.bg),
      textColor: hexToRgb(chip.fg),
    };
  }
  const m = text.match(/^(NÄRA|DELVIS|SKAVER)(\s*\(!\))?$/);
  if (!m) return null;
  const label = m[1].toLowerCase() + (m[2] ? " (!)" : "");
  if (m[1] === "NÄRA") return { label, fill: INK, textColor: WHITE };
  if (m[1] === "DELVIS")
    return { label, fill: [229, 231, 235], textColor: BODY };
  return { label, stroke: [209, 213, 219], textColor: MUTED };
}

type FontData = { regular: string; bold: string }; // base64-kodade TTF:er

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

async function loadGeist(): Promise<FontData | null> {
  try {
    const { geistRegularUrl, geistBoldUrl } = await import("./geist-fonts");
    const [regular, bold] = await Promise.all(
      [geistRegularUrl, geistBoldUrl].map(async (url) =>
        toBase64(await (await fetch(url)).arrayBuffer()),
      ),
    );
    return { regular, bold };
  } catch {
    return null;
  }
}

class PdfWriter {
  doc = new jsPDF({ unit: "mm", format: "a4" });
  y = MARGIN;
  family: string;

  constructor(fonts: FontData | null) {
    if (fonts) {
      this.doc.addFileToVFS("Geist-Regular.ttf", fonts.regular);
      this.doc.addFont("Geist-Regular.ttf", "Geist", "normal");
      this.doc.addFileToVFS("Geist-Bold.ttf", fonts.bold);
      this.doc.addFont("Geist-Bold.ttf", "Geist", "bold");
      this.family = "Geist";
    } else {
      this.family = "helvetica";
    }
  }

  setFont(bold: boolean, size: number, color: [number, number, number]) {
    this.doc.setFont(this.family, bold ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
  }

  ensure(height: number) {
    if (this.y + height > PAGE_H - MARGIN) {
      this.doc.addPage();
      this.y = MARGIN;
    }
  }

  gap(mm: number) {
    this.y += mm;
  }

  rule() {
    this.doc.setDrawColor(...RULE);
    this.doc.setLineWidth(0.25);
    this.doc.line(MARGIN, this.y, PAGE_W - MARGIN, this.y);
  }

  // Radbrytande text med inslag av fetstil (**...**), ordvis layout.
  text(
    content: string,
    opts: {
      bold?: boolean;
      size?: number;
      color?: [number, number, number];
      indent?: number;
      hangingMarker?: string;
      lineFactor?: number;
      plain?: boolean; // hoppa över **fetstils**-tolkningen
    } = {},
  ) {
    const { bold = false, size = 10, color = BODY, indent = 0 } = opts;
    const lineHeight = size * 0.3528 * (opts.lineFactor ?? 1.45);
    const maxW = MAX_W - indent;

    const runs: Run[] = opts.plain
      ? [{ text: content, bold: false }]
      : parseRuns(content);
    const words: Run[] = runs.flatMap((run) =>
      run.text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((w) => ({ text: w, bold: bold || run.bold })),
    );

    const measure = (w: Run) => {
      this.setFont(w.bold, size, color);
      return this.doc.getTextWidth(w.text);
    };

    let line: Run[] = [];
    let width = 0;
    let firstLine = true;

    const flushLine = () => {
      // Släpp inledande/avslutande blanksteg så raderna kantställs rent.
      while (line.length > 0 && /^\s+$/.test(line[0].text)) line.shift();
      while (line.length > 0 && /^\s+$/.test(line[line.length - 1].text))
        line.pop();
      this.ensure(lineHeight);
      if (firstLine && opts.hangingMarker) {
        this.setFont(false, size, MUTED);
        this.doc.text(opts.hangingMarker, MARGIN + indent - 5, this.y);
      }
      let x = MARGIN + indent;
      for (const w of line) {
        this.setFont(w.bold, size, color);
        this.doc.text(w.text, x, this.y);
        x += this.doc.getTextWidth(w.text);
      }
      this.y += lineHeight;
      firstLine = false;
      line = [];
      width = 0;
    };

    for (const w of words) {
      const wWidth = measure(w);
      if (width + wWidth > maxW && line.length > 0) flushLine();
      line.push(w);
      width += wWidth;
    }
    if (line.length > 0 || firstLine) flushLine();
  }

  table(head: string[], rows: string[][]) {
    const pills = new WeakMap<object, Pill>();
    autoTable(this.doc, {
      startY: this.y,
      head: [head],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      theme: "grid",
      styles: {
        font: this.family,
        fontSize: 8,
        cellPadding: { top: 1.7, bottom: 1.7, left: 1.7, right: 1.7 },
        textColor: BODY,
        lineColor: RULE,
        lineWidth: 0.15,
        valign: "middle",
      },
      headStyles: {
        fillColor: [249, 250, 251], // gray-50
        textColor: INK,
        fontStyle: "bold",
      },
      didParseCell: (data: CellHookData) => {
        const pill = pillFor(data.section, data.cell.text.join(" ").trim());
        if (!pill) return;
        pills.set(data.cell, pill);
        // Låt kolumnbreddsmätningen utgå från pluttens text plus lite luft.
        data.cell.text = [` ${pill.label} `];
        data.cell.styles.halign = "center";
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 7;
        data.cell.styles.minCellHeight = 6.5;
      },
      willDrawCell: (data: CellHookData) => {
        // Bakgrund och kantlinjer ritas som vanligt — bara texten tas bort,
        // så att plutten kan ritas ovanpå i didDrawCell.
        if (pills.has(data.cell)) data.cell.text = [];
      },
      didDrawCell: (data: CellHookData) => {
        const pill = pills.get(data.cell);
        if (!pill) return;
        this.setFont(true, 7, pill.textColor);
        const textWidth = this.doc.getTextWidth(pill.label);
        const pillW = textWidth + 3.4;
        const pillH = 4.4;
        const cx = data.cell.x + data.cell.width / 2;
        const cy = data.cell.y + data.cell.height / 2;
        if (pill.fill) {
          this.doc.setFillColor(...pill.fill);
          this.doc.roundedRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH, 1.1, 1.1, "F");
        }
        if (pill.stroke) {
          this.doc.setDrawColor(...pill.stroke);
          this.doc.setLineWidth(0.25);
          this.doc.roundedRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH, 1.1, 1.1, "S");
        }
        this.doc.text(pill.label, cx, cy, {
          align: "center",
          baseline: "middle",
        });
      },
    });
    this.y =
      (this.doc as unknown as { lastAutoTable: { finalY: number } })
        .lastAutoTable.finalY + 3;
  }

  footers() {
    const pages = this.doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      this.doc.setPage(i);
      this.setFont(false, 7.5, MUTED);
      this.doc.text(`valsnack.se · sida ${i} av ${pages}`, PAGE_W / 2, PAGE_H - 10, {
        align: "center",
      });
    }
  }
}

function renderBlocks(w: PdfWriter, blocks: Block[]) {
  for (const block of blocks) {
    switch (block.kind) {
      case "heading":
        w.gap(2);
        w.text(block.text, { bold: true, size: 11.5, color: INK });
        w.gap(1);
        break;
      case "paragraph":
        w.text(block.text);
        w.gap(2);
        break;
      case "listItem":
        w.text(block.text, { indent: 6, hangingMarker: block.marker });
        w.gap(1);
        break;
      case "quote":
        w.text(block.text, { indent: 5, color: MUTED });
        w.gap(1.5);
        break;
      case "table":
        w.gap(1.5);
        w.table(block.head, block.rows);
        w.gap(2);
        break;
    }
  }
}

export async function buildConversationPdf(
  messages: ChatMessage[],
  fonts?: FontData | null,
): Promise<{ blob: Blob; filename: string }> {
  const w = new PdfWriter(fonts === undefined ? await loadGeist() : fonts);
  const date = new Date();

  w.text("Valsnack — mitt samtal", { bold: true, size: 17, color: INK });
  w.gap(1.5);
  w.text(`${date.toLocaleDateString("sv-SE")} · valsnack.se`, {
    size: 9,
    color: MUTED,
  });
  w.gap(1.5);
  w.rule();
  w.gap(7);

  for (const m of messages) {
    if (m.role === "user") {
      w.text("DU", { bold: true, size: 8, color: MUTED, lineFactor: 1.2 });
      w.gap(1.2);
      // Användarens text är ren text — behåll radbrytningarna, rendera
      // utan markdowntolkning (fetstilsmarkörer m.m. lämnas orörda).
      for (const line of sanitize(m.content).split("\n")) {
        w.text(line || " ", { plain: true });
      }
    } else {
      w.text("KOMPASSEN", { bold: true, size: 8, color: MUTED, lineFactor: 1.2 });
      w.gap(1.2);
      renderBlocks(w, parseBlocks(m.content));
    }
    w.gap(4.5);
  }

  w.gap(1);
  w.text(
    "PDF:en skapades lokalt i din webbläsare — samtalet har inte lagrats på någon server.",
    { size: 8, color: MUTED },
  );
  w.footers();

  return {
    blob: w.doc.output("blob"),
    filename: `valsnack-samtal-${date.toISOString().slice(0, 10)}.pdf`,
  };
}

// På mobil: öppna delningsarket direkt (där "Spara i Filer" finns ett tryck
// bort) i stället för utskriftsdialogen. Annars: ladda ner filen direkt.
export async function saveConversationPdf(
  messages: ChatMessage[],
): Promise<void> {
  const { blob, filename } = await buildConversationPdf(messages);
  const file = new File([blob], filename, { type: "application/pdf" });

  const isTouch = navigator.maxTouchPoints > 0;
  if (isTouch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      // Stängde delningsarket utan att välja något — inget fel.
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Annat fel (t.ex. förlorad user activation) — falla tillbaka på nedladdning.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
