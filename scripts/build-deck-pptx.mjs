import pptxgen from "pptxgenjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCREENS = path.join(ROOT, "pitch-deck/assets/screens");
const OUT = path.join(ROOT, "pitch-deck/kinora-seed-2026.pptx");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pptx.author = "Diar Begisbayev";
pptx.company = "Kinora";
pptx.subject = "Kinora — Seed 2026";
pptx.title = "Kinora — Seed 2026";
pptx.lang = "en-US";
pptx.theme = { headFontFace: "Georgia", bodyFontFace: "Arial", lang: "en-US" };

const W = 13.333;
const H = 7.5;
const M = 0.6;
const INK = "0A0A0B";
const MUTED = "6D6D76";
const FAINT = "9B9BA4";
const LAV = "C9B8FF";
const PURPLE = "8B5CF6";
const PALE = "F2EDFF";
const LINE = "E7E3EE";
const GRAY = "F5F4F7";
const SOFT = "F4F0FC";
const SERIF = "Georgia";
const SANS = "Arial";

const screen = (name) => path.join(SCREENS, name);

function addTop(slide, section, page, opts = {}) {
  slide.background = { color: "FFFFFF" };
  slide.addText(page, {
    x: W - 1.65, y: H - 1.2, w: 1.4, h: 1.0,
    fontFace: SERIF, fontSize: 80, color: SOFT, align: "right", valign: "bottom", margin: 0,
  });
  slide.addShape(pptx.ShapeType.ellipse, { x: M, y: 0.27, w: 0.15, h: 0.15, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: M + 0.027, y: 0.297, w: 0.06, h: 0.06, fill: { color: "D6C7FE" }, line: { color: "D6C7FE", width: 0 } });
  slide.addShape(pptx.ShapeType.ellipse, { x: M + 0.048, y: 0.308, w: 0.024, h: 0.024, fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 0 } });
  slide.addText("KINORA", { x: M + 0.21, y: 0.21, w: 1.5, h: 0.25, fontFace: SANS, fontSize: 9, bold: true, charSpacing: 2.2, color: INK, margin: 0, valign: "middle" });
  slide.addShape(pptx.ShapeType.line, { x: M, y: 0.57, w: W - 2 * M, h: 0.001, line: { color: LINE, width: 0.75 } });
  slide.addText(section, { x: W - 3.3, y: 0.2, w: 2.4, h: 0.26, fontFace: SANS, fontSize: 8.5, bold: true, color: INK, align: "right", charSpacing: 1.2, margin: 0, valign: "middle" });
  slide.addText(page, { x: W - 0.88, y: 0.2, w: 0.33, h: 0.26, fontFace: SANS, fontSize: 8.5, color: FAINT, align: "right", margin: 0, valign: "middle" });
  if (opts.source) {
    slide.addText(opts.source, { x: M, y: 7.05, w: 11.4, h: 0.28, fontFace: SANS, fontSize: 7.8, color: MUTED, margin: 0, valign: "top", fit: "shrink", lineSpacingMultiple: 1.05 });
  }
}

function headline(slide, runs, opts = {}) {
  const { x = M, y = 0.98, w = W - 2 * M, h = 1.55, size = 46, color = INK, align = "left" } = opts;
  slide.addText(runs, {
    x, y, w, h, fontFace: SERIF, fontSize: size, color, align, valign: "top",
    margin: 0, lineSpacingMultiple: 0.94, fit: "shrink",
  });
}

function body(slide, text, opts = {}) {
  const { x = M, y, w = 6, h = 0.6, size = 14, color = "3F3F47", bold = false, italic = false, align = "left", line = 1.18 } = opts;
  slide.addText(text, { x, y, w, h, fontFace: SANS, fontSize: size, color, bold, italic, align, valign: "top", margin: 0, fit: "shrink", lineSpacingMultiple: line });
}

function tag(slide, text, x, y, w = 2.2, opts = {}) {
  slide.addText(text, { x, y, w, h: 0.22, fontFace: SANS, fontSize: 8.5, bold: true, color: opts.color || PURPLE, charSpacing: 1.3, margin: 0, valign: "middle" });
}

function pill(slide, text, x, y, w, opts = {}) {
  const lav = Boolean(opts.lav);
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.32, rectRadius: 0.16,
    fill: { color: lav ? PALE : "FFFFFF" },
    line: { color: lav ? "DED2FF" : LINE, width: 0.75 },
  });
  slide.addText(text, {
    x: x + 0.08, y: y + 0.01, w: w - 0.16, h: 0.3,
    fontFace: SANS, fontSize: 8.5, bold: true, color: lav ? "4C22B8" : "3D3D45",
    align: "center", valign: "middle", margin: 0, fit: "shrink",
  });
}

function rule(slide, x, y, w, color = LINE, width = 0.75) {
  slide.addShape(pptx.ShapeType.line, { x, y, w, h: 0.001, line: { color, width } });
}

function segment(slide, x1, y1, x2, y2, color, width = 2) {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1) || 0.001;
  const h = Math.abs(y2 - y1) || 0.001;
  const flipV = (x2 - x1) * (y2 - y1) < 0;
  slide.addShape(pptx.ShapeType.line, { x, y, w, h, flipV, line: { color, width } });
}

function phone(slide, img, x, y, w) {
  const h = w * 932 / 430;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: w * 0.15,
    fill: { color: "0B0B0C" }, line: { color: "0B0B0C", width: 0 },
  });
  const inset = w * 0.035;
  slide.addImage({ path: screen(img), x: x + inset, y: y + inset, w: w - 2 * inset, h: h - 2 * inset });
}

function metric(slide, value, label, sub, x, y, w, opts = {}) {
  const { vsize = 36 } = opts;
  rule(slide, x, y, w);
  slide.addText(value, { x, y: y + 0.07, w, h: 0.52, fontFace: SANS, fontSize: vsize, bold: true, color: INK, margin: 0, valign: "top", fit: "shrink" });
  slide.addText(label, { x, y: y + 0.1 + vsize / 72, w, h: 0.24, fontFace: SANS, fontSize: 9, bold: true, color: MUTED, charSpacing: 1, margin: 0, valign: "top" });
  if (sub) slide.addText(sub, { x, y: y + 0.1 + vsize / 72 + 0.23, w, h: 0.32, fontFace: SANS, fontSize: 10.5, color: MUTED, margin: 0, valign: "top", fit: "shrink", lineSpacingMultiple: 1.08 });
}

function notes(slide, text) {
  slide.addNotes(text);
}

// ============================================================ 01 COVER
{
  const s = pptx.addSlide();
  addTop(s, "SEED · 2026 · CONFIDENTIAL", "01", {
    source: "The family copilot for the parent team. Built on family-systems research. Coaching, not therapy.",
  });
  s.addShape(pptx.ShapeType.ellipse, { x: 6.9, y: 1.0, w: 5.9, h: 5.9, fill: { color: PALE }, line: { color: PALE, width: 0 } });
  s.addText("THE FAMILY COPILOT  ·  FOR THE PARENT TEAM", { x: M, y: 1.12, w: 6.8, h: 0.26, fontFace: SANS, fontSize: 9, bold: true, color: PURPLE, charSpacing: 1.4, margin: 0 });
  headline(s, [
    { text: "Parenting is a\n", options: {} },
    { text: "team sport.", options: { highlight: LAV } },
  ], { y: 1.42, w: 6.5, h: 2.2, size: 58 });
  body(s, "Kinora makes sure you play it together. Five minutes a day. Both parents. One shared plan.", { y: 3.65, w: 5.6, h: 0.95, size: 17, line: 1.28 });
  pill(s, "Seed · $2.5M", M, 4.75, 1.65, { lav: true });
  pill(s, "Working product", M + 1.78, 4.75, 1.8);
  pill(s, "US · parents 25–45", M + 3.72, 4.75, 2.0);
  s.addShape(pptx.ShapeType.ellipse, { x: M, y: 5.75, w: 0.46, h: 0.46, fill: { color: PALE }, line: { color: "DED2FF", width: 0.75 } });
  s.addText("DB", { x: M, y: 5.75, w: 0.46, h: 0.46, fontFace: SANS, fontSize: 10, bold: true, color: INK, align: "center", valign: "middle", margin: 0 });
  s.addText("Diar Begisbayev", { x: M + 0.62, y: 5.72, w: 3.4, h: 0.22, fontFace: SANS, fontSize: 11, bold: true, color: INK, margin: 0 });
  s.addText("Founder & CEO · designed and shipped Kinora end-to-end", { x: M + 0.62, y: 5.95, w: 4.6, h: 0.24, fontFace: SANS, fontSize: 8.5, color: MUTED, margin: 0 });
  phone(s, "home-moods.png", 8.4, 1.2, 2.6);
  notes(s, "Parenting is a team sport — but nobody gives parents a shared operating system. Kinora is the AI copilot for the parent team. Five minutes a day, both parents, one shared plan. We have a working product and we're raising a $2.5M seed.");
}

// ============================================================ 02 PROBLEM
{
  const s = pptx.addSlide();
  addTop(s, "THE PROBLEM", "02", {
    source: "Sources: U.S. Surgeon General, Parents Under Pressure (2024), citing APA Stress in America 2023; Pew Research Center (2023); Gottman; European Sociological Review (2025). General stress, not parenting-only. Full citations in the long-form deck.",
  });
  headline(s, [
    { text: "Parents are running a two-person job\n", options: {} },
    { text: "with no shared operating system.", options: { highlight: LAV } },
  ], { y: 0.98, w: 12.1, h: 1.55, size: 40 });
  const base = 5.3;
  rule(s, 0.85, base, 6.9, INK, 1.2);
  const bar1h = 1.9, bar2h = 1.0;
  s.addShape(pptx.ShapeType.rect, { x: 1.1, y: base - bar1h, w: 1.25, h: bar1h, fill: { color: LAV }, line: { color: LAV, width: 0 } });
  s.addShape(pptx.ShapeType.rect, { x: 2.95, y: base - bar2h, w: 1.25, h: bar2h, fill: { color: "E8E4EE" }, line: { color: "E8E4EE", width: 0 } });
  s.addText("48%", { x: 1.0, y: base - bar1h - 0.5, w: 1.5, h: 0.5, fontFace: SANS, fontSize: 36, bold: true, color: INK, margin: 0 });
  s.addText("26%", { x: 2.85, y: base - bar2h - 0.45, w: 1.5, h: 0.45, fontFace: SANS, fontSize: 36, bold: true, color: MUTED, margin: 0 });
  s.addText("Parents", { x: 1.05, y: base + 0.12, w: 1.5, h: 0.24, fontFace: SANS, fontSize: 11, bold: true, color: INK, margin: 0 });
  s.addText("say stress is completely overwhelming most days", { x: 1.05, y: base + 0.36, w: 1.75, h: 0.55, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.12 });
  s.addText("Other adults", { x: 2.9, y: base + 0.12, w: 1.5, h: 0.24, fontFace: SANS, fontSize: 11, bold: true, color: INK, margin: 0 });
  s.addText("same question, no kids at home", { x: 2.9, y: base + 0.36, w: 1.75, h: 0.5, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.12 });
  s.addText("~1.8×", { x: 4.6, y: 3.45, w: 1.6, h: 0.62, fontFace: SERIF, italic: true, fontSize: 36, color: INK, margin: 0 });
  s.addText("more likely to be\noverwhelmed", { x: 4.6, y: 4.1, w: 1.5, h: 0.5, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.12 });
  const rx = 8.0, rw = 4.75;
  metric(s, "29%", "PARENTING STRESS", "say parenting itself is stressful all or most of the time. Mothers 33%; fathers 24%. Pew, 2023.", rx, 2.3, rw, { vsize: 34 });
  metric(s, "~6 yrs", "TIME TO HELP", "is how long couples typically wait before seeking help. Gottman.", rx, 3.5, rw, { vsize: 34 });
  metric(s, "71%", "MENTAL LOAD", "of household mental-load tasks are carried by mothers, vs 45% reported by fathers.", rx, 4.7, rw, { vsize: 34 });
  body(s, "The help exists — but it arrives late, costs $100–300 per session, and was never built for the 9pm kitchen table.", { y: 6.25, w: 12.0, h: 0.5, size: 16 });
  notes(s, "Parents are running a two-person job with no shared operating system. 48% of parents say stress is completely overwhelming most days, versus 26% of other adults. 29% say parenting itself is stressful all or most of the time. Couples wait about six years before seeking help, and 71% of mothers carry most of the mental load. The help exists, but it costs $100–300 a session and was never built for the 9pm kitchen table.");
}

// ============================================================ 03 SOLUTION
{
  const s = pptx.addSlide();
  addTop(s, "THE SOLUTION", "03", {
    source: "Screenshots from the working Kinora app, 430×932 mobile viewport. Demo family: Michael & Lucy Bennett, Sophie (6).",
  });
  headline(s, [
    { text: "One calm place for the ", options: {} },
    { text: "parent team.", options: { highlight: LAV } },
  ], { y: 0.98, w: 8.0, h: 0.85, size: 46 });
  body(s, "Not another content library. A five-minute daily operating system for both parents.", { y: 1.72, w: 8.2, h: 0.4, size: 16 });
  s.addText("5 min", { x: 10.6, y: 1.0, w: 2.1, h: 0.5, fontFace: SANS, fontSize: 34, bold: true, color: INK, align: "right", margin: 0 });
  s.addText("a day", { x: 10.6, y: 1.48, w: 2.1, h: 0.22, fontFace: SANS, fontSize: 10, bold: true, color: MUTED, align: "right", charSpacing: 1, margin: 0 });
  phone(s, "home-moods.png", 0.6, 2.05, 1.95);
  phone(s, "session-room.png", 2.9, 2.05, 1.95);
  phone(s, "session-summary.png", 5.2, 2.05, 1.95);
  const caps = [
    ["Check in.", "Ten seconds each. Private.", 0.6],
    ["Talk.", "Both sides. One agreement.", 2.9],
    ["Agree.", "One next step, remembered.", 5.2],
  ];
  caps.forEach(([h, p, x]) => {
    s.addText(h, { x, y: 6.38, w: 1.95, h: 0.25, fontFace: SANS, fontSize: 15, bold: true, color: INK, margin: 0 });
    s.addText(p, { x, y: 6.62, w: 1.95, h: 0.25, fontFace: SANS, fontSize: 10, color: MUTED, margin: 0, lineSpacingMultiple: 1.05, fit: "shrink" });
  });
  // right rail
  const rx = 7.95, rw = 4.8;
  tag(s, "THE DAILY LOOP", rx, 2.25, 2.2);
  const steps = [
    ["01", "Check in", "Mood and context, in ten seconds."],
    ["02", "Talk", "A two-sided session that ends with one agreement."],
    ["03", "Agree", "The next step is saved and remembered."],
  ];
  steps.forEach(([n, h, p], i) => {
    const y = 2.55 + i * 0.98;
    rule(s, rx, y, rw);
    s.addText(n, { x: rx, y: y + 0.08, w: 0.45, h: 0.22, fontFace: SANS, fontSize: 9, bold: true, color: PURPLE, margin: 0 });
    s.addText(h, { x: rx + 0.5, y: y + 0.06, w: 1.2, h: 0.25, fontFace: SANS, fontSize: 13, bold: true, color: INK, margin: 0 });
    s.addText(p, { x: rx + 0.5, y: y + 0.32, w: rw - 0.5, h: 0.42, fontFace: SANS, fontSize: 10.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.1, fit: "shrink" });
  });
  pill(s, "Coaching, not therapy", rx, 5.55, 1.85, { lav: true });
  pill(s, "Crisis routing before coaching", rx + 1.97, 5.55, 2.55);
  s.addText("Ask, Understand, and Practice sit inside the same loop: family memory, age-banded child strengths, and five-minute courses.", { x: rx, y: 6.05, w: rw, h: 0.55, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.12, fit: "shrink" });
  notes(s, "Kinora is one calm place for the parent team. Check in: ten seconds each, private by default. Talk: a structured session that hears both sides and ends with one agreement. Agree: the next step is saved to a shared family memory. Five minutes a day, both parents. Ask, Understand, and Practice sit inside the same loop: family memory, age-banded child strengths, and five-minute courses. This is coaching, not therapy; crisis language routes to 988, 911, and the DV hotline before coaching.");
}

// ============================================================ 04 WHY KINORA WINS
{
  const s = pptx.addSlide();
  addTop(s, "WHY KINORA WINS", "04", {
    source: "Market positioning based on public product positioning and pricing, November 2026. Competitor names are trademarks of their owners; no affiliation or endorsement is implied.",
  });
  headline(s, [
    { text: "The market sells content. ", options: {} },
    { text: "Kinora runs the relationship.", options: { highlight: LAV } },
  ], { y: 0.98, w: 12.0, h: 0.85, size: 46 });
  body(s, "Online parenting programs work without a clinician. The workflow did not exist — until now.", { y: 1.78, w: 11.8, h: 0.35, size: 15 });
  const rows = [
    ["Job to be done", "Market today", "Kinora"],
    ["Daily check-in", "Mood apps, no family context", "10-second check-in for both parents"],
    ["Conflict repair", "Content, or a $100–300 session", "Two-sided AI session, one agreement"],
    ["Shared memory", "Nothing carries over", "Cited family memory across sessions"],
    ["Child development", "Generic advice", "Age-banded strengths map, not a label"],
    ["Safety", "A crisis line, or nothing", "988 / 911 / DV routing before coaching"],
    ["Price", "$279/yr per person (Good Inside)", "$149/yr per household"],
  ];
  s.addTable(rows.map((r, i) => r.map((c, j) => ({
    text: c,
    options: {
      bold: i === 0 || j === 0,
      color: i === 0 ? (j === 2 ? PURPLE : MUTED) : INK,
      fontSize: i === 0 ? 9 : 12.5,
      fill: { color: i === 0 ? "FFFFFF" : (j === 2 ? "FBFAFF" : "FFFFFF") },
    },
  }))), {
    x: M, y: 2.25, w: 12.1, colW: [3.0, 4.1, 5.0], rowH: 0.57,
    fontFace: SANS, fontSize: 12.5, color: INK, valign: "middle", margin: 0.06,
    border: { type: "solid", color: LINE, pt: 0.5 },
  });
  s.addText("ChatGPT has no partner seat and no shared family memory. Kinora is the two-person workflow.", { x: M, y: 6.35, w: 12.0, h: 0.35, fontFace: SANS, fontSize: 14, bold: true, color: INK, margin: 0 });
  notes(s, "The category is fragmented: content, crisis care, logistics, or a generic chatbot. Good Inside is a library. BetterHelp is a crisis. Paired is a couple without kids. Cozi is logistics. Kinora is the only two-person daily workflow. The table compares the job to be done, what the market sells today, and what Kinora does. ChatGPT has no partner seat and no shared family memory. That is the wedge.");
}

// ============================================================ 05 MARKET
{
  const s = pptx.addSlide();
  addTop(s, "MARKET", "05", {
    source: "Sources: U.S. Census Bureau (2024); HHS Surgeon General (2024); Pew Research Center (2023); CDC/NCHS births (2024); Fortune (2026). TAM/SAM/SOM are our estimates, assumptions shown.",
  });
  headline(s, [
    { text: "A $1.2B entry market", options: { highlight: LAV } },
    { text: "\nhiding in the 9pm kitchen table.", options: {} },
  ], { y: 0.98, w: 8.3, h: 1.65, size: 44 });
  const rows = [
    ["92.0M", "U.S. adults aged 25–44", "POPULATION", 1.0, "E4D9FF"],
    ["~63M", "Parents living with children", "PARENTS", 0.68, "E4D9FF"],
    ["17M", "Partnered households, kids under 12", "TAM · ~$2.5B", 0.18, LAV],
    ["8.2M", "Households overwhelmed most days · 48% filter", "SAM · ~$1.2B", 0.09, PURPLE],
    ["18K–45K", "Paying households by Year 3", "SOM · $2.7–6.7M", 0.012, PURPLE],
  ];
  rows.forEach(([num, label, tagText, barW, barColor], i) => {
    const y = 2.4 + i * 0.7;
    s.addText(num, { x: M, y: y - 0.04, w: 1.45, h: 0.45, fontFace: SANS, fontSize: i === 4 ? 22 : 26, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(label, { x: M + 1.55, y: y - 0.02, w: 4.15, h: 0.32, fontFace: SANS, fontSize: 11.5, color: INK, margin: 0, valign: "middle", fit: "shrink" });
    s.addShape(pptx.ShapeType.rect, { x: M + 1.55, y: y + 0.34, w: barW, h: 0.05, fill: { color: barColor }, line: { color: barColor, width: 0 } });
    s.addText(tagText, { x: M + 5.7, y: y - 0.02, w: 1.75, h: 0.3, fontFace: SANS, fontSize: 7.5, bold: true, color: MUTED, align: "right", charSpacing: 0.7, margin: 0, valign: "middle" });
    if (i < rows.length - 1) rule(s, M, y + 0.62, 7.45);
  });
  s.addText("17M × $149 = $2.5B TAM · 8.2M × $149 = $1.2B SAM · 18K–45K = $2.7–6.7M SOM.", { x: M, y: 6.0, w: 7.5, h: 0.3, fontFace: SANS, fontSize: 11.5, color: MUTED, margin: 0 });
  // right proof
  const rx = 8.45, rw = 4.3;
  s.addShape(pptx.ShapeType.rect, { x: rx, y: 2.25, w: 0.04, h: 1.25, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });
  tag(s, "PROOF PARENTS PAY", rx + 0.2, 2.25, 2.5);
  s.addText("$34M", { x: rx + 0.2, y: 2.5, w: 2.2, h: 0.55, fontFace: SANS, fontSize: 40, bold: true, color: INK, margin: 0 });
  s.addText("Good Inside revenue in 2025. 100K+ subscribers. Only ~$10.5M raised.", { x: rx + 0.2, y: 3.05, w: 4.0, h: 0.45, fontFace: SANS, fontSize: 12, color: MUTED, margin: 0, lineSpacingMultiple: 1.12, fit: "shrink" });
  rule(s, rx, 3.85, rw);
  tag(s, "START HERE", rx, 4.0, 1.8);
  s.addText("9–11M partnered households with $100K+ income — broader than the SAM.", { x: rx, y: 4.25, w: rw, h: 0.55, fontFace: SANS, fontSize: 13, bold: true, color: INK, margin: 0, lineSpacingMultiple: 1.12, fit: "shrink" });
  s.addText("$149/yr is ~0.1% of median household income.", { x: rx, y: 4.85, w: rw, h: 0.3, fontFace: SANS, fontSize: 10.5, color: MUTED, margin: 0 });
  rule(s, rx, 5.35, rw);
  tag(s, "EXPAND", rx, 5.48, 1.2);
  s.addText("Expecting · single parents · co-parents across two homes.", { x: rx, y: 5.72, w: rw, h: 0.5, fontFace: SANS, fontSize: 12.5, color: INK, margin: 0, lineSpacingMultiple: 1.12, fit: "shrink" });
  notes(s, "17M partnered households with kids under 12 at $149 = $2.5B TAM. 48% overwhelmed = 8.2M households = $1.2B SAM. 18K–45K paying households = $2.7–6.7M SOM by Year 3. Good Inside did $34M in 2025 with 100K+ subscribers and only ~$10.5M raised. Our entry pool is 9–11M partnered households with $100K+ income. Expecting parents, single parents, and co-parents across two homes are the expansion.");
}

// ============================================================ 06 BUSINESS MODEL
{
  const s = pptx.addSlide();
  addTop(s, "BUSINESS MODEL", "06", {
    source: "Kinora cohort model, 2026. Annual anchor at 80% gross margin: $149 upfront, 30% year-1 renewal, $67 CAC, $155 LTV, 2.3×, 7-month payback. Monthly floor: $52 CAC, $72 LTV, 1.4×.",
  });
  headline(s, [
    { text: "One household price. Two parents.\n", options: {} },
    { text: "Less than one therapy session.", options: { highlight: LAV } },
  ], { y: 0.98, w: 11.8, h: 1.5, size: 44 });
  s.addShape(pptx.ShapeType.rect, { x: M, y: 2.55, w: 4.85, h: 2.95, fill: { color: PALE }, line: { color: "DED2FF", width: 0.75 } });
  tag(s, "FAMILY LICENSE", M + 0.25, 2.72, 2.2, { color: "4C22B8" });
  s.addText("$149", { x: M + 0.22, y: 3.0, w: 2.5, h: 0.85, fontFace: SANS, fontSize: 50, bold: true, color: INK, margin: 0 });
  s.addText("/ year", { x: M + 1.8, y: 3.42, w: 1.0, h: 0.3, fontFace: SANS, fontSize: 12, color: MUTED, margin: 0 });
  s.addText("Both partners. All courses. Unlimited sessions. One shared family memory.", { x: M + 0.25, y: 3.95, w: 4.35, h: 0.65, fontFace: SANS, fontSize: 13, color: "3F3F47", margin: 0, lineSpacingMultiple: 1.15, fit: "shrink" });
  s.addText("Also $24.99 / 4 weeks after a $9.99 intro. Cancel in one click.", { x: M + 0.25, y: 4.72, w: 4.3, h: 0.4, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.1 });
  const mx = 5.9, mw = 3.35;
  metric(s, "$67", "BLENDED CAC", "annual plan", mx, 2.55, mw, { vsize: 38 });
  metric(s, "$155", "24-MONTH LTV", "80% gross margin", mx + 3.75, 2.55, mw, { vsize: 38 });
  metric(s, "2.3×", "LTV / CAC", "1.4× monthly floor", mx, 3.95, mw, { vsize: 38 });
  metric(s, "7 mo", "CAC PAYBACK", "annual plan", mx + 3.75, 3.95, mw, { vsize: 38 });
  s.addShape(pptx.ShapeType.rect, { x: mx, y: 5.35, w: 7.1, h: 0.6, fill: { color: GRAY }, line: { color: GRAY, width: 0 } });
  s.addShape(pptx.ShapeType.rect, { x: mx, y: 5.35, w: 0.04, h: 0.6, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });
  s.addText("80% gross margin. AI + hosting ~8%. Acquisition and retention are the business.", { x: mx + 0.18, y: 5.45, w: 6.8, h: 0.4, fontFace: SANS, fontSize: 12.5, bold: true, color: INK, margin: 0, lineSpacingMultiple: 1.1, fit: "shrink" });
  body(s, "AI is not the risk. A two-person habit is the moat.", { y: 6.2, w: 12.0, h: 0.35, size: 15, color: MUTED });
  notes(s, "One household price: $149 a year for both partners. Less than one therapy session. $67 CAC, $155 24-month LTV, 2.3× LTV/CAC, seven-month payback at 80% gross margin. The monthly floor is 1.4×. AI and hosting are about 8% of revenue. AI is not the business risk. Acquisition and retention are. That is why the product is built as a two-person habit, not a one-person content library.");
}

// ============================================================ 07 PATH
{
  const s = pptx.addSlide();
  addTop(s, "THE PATH", "07", {
    source: "Kinora five-year cohort model, 2026. Base case uses market-median CAC and retention; optimistic uses top-quartile retention. This is a model, not a forecast.",
  });
  headline(s, [
    { text: "A $29.4M base case.\n", options: {} },
    { text: "A $106.9M optimistic case.", options: { highlight: LAV } },
  ], { y: 0.98, w: 11.4, h: 1.45, size: 44 });
  const x0 = 1.0, y0 = 2.55, cw = 6.9, ch = 3.2;
  const yOf = (v) => y0 + ch * (1 - v / 120);
  const xOf = (i) => x0 + cw * (i / 4);
  const base = [0.3, 2.0, 6.9, 16.1, 29.4];
  const opt = [1.2, 7.7, 25.9, 60.9, 106.9];
  [0, 30, 60, 90, 120].forEach((v) => {
    const y = yOf(v);
    rule(s, x0, y, cw, v === 0 ? INK : LINE, v === 0 ? 1.1 : 0.7);
    s.addText(String(v), { x: x0 - 0.5, y: y - 0.1, w: 0.4, h: 0.22, fontFace: SANS, fontSize: 8.5, color: MUTED, align: "right", margin: 0 });
  });
  s.addShape(pptx.ShapeType.line, { x: x0, y: yOf(100), w: cw, h: 0.001, line: { color: LAV, width: 1.1, dashType: "dash" } });
  s.addText("$100M ARR", { x: x0 + 0.05, y: yOf(100) - 0.24, w: 1.2, h: 0.22, fontFace: SANS, fontSize: 8.5, bold: true, color: PURPLE, margin: 0 });
  for (let i = 0; i < 4; i++) {
    segment(s, xOf(i), yOf(opt[i]), xOf(i + 1), yOf(opt[i + 1]), LAV, 3);
    segment(s, xOf(i), yOf(base[i]), xOf(i + 1), yOf(base[i + 1]), INK, 2.6);
  }
  s.addShape(pptx.ShapeType.ellipse, { x: xOf(4) - 0.07, y: yOf(106.9) - 0.07, w: 0.14, h: 0.14, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });
  s.addShape(pptx.ShapeType.ellipse, { x: xOf(4) - 0.07, y: yOf(29.4) - 0.07, w: 0.14, h: 0.14, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText("$106.9M", { x: xOf(4) - 1.4, y: yOf(106.9) - 0.4, w: 1.25, h: 0.26, fontFace: SANS, fontSize: 13, bold: true, color: INK, align: "right", margin: 0 });
  s.addText("$29.4M", { x: xOf(4) - 1.35, y: yOf(29.4) - 0.36, w: 1.2, h: 0.26, fontFace: SANS, fontSize: 13, bold: true, color: INK, align: "right", margin: 0 });
  for (let i = 0; i < 5; i++) {
    s.addText(`Y${i + 1}`, { x: xOf(i) - 0.25, y: yOf(0) + 0.1, w: 0.5, h: 0.22, fontFace: SANS, fontSize: 8.5, color: MUTED, align: "center", margin: 0 });
  }
  s.addText("Base: Y1 $0.3M · Y3 $6.9M · Y5 $29.4M", { x: x0, y: 6.02, w: 3.3, h: 0.22, fontFace: SANS, fontSize: 8.5, color: MUTED, margin: 0 });
  s.addText("Optimistic: Y1 $1.2M · Y3 $25.9M · Y5 $106.9M", { x: x0 + 3.45, y: 6.02, w: 3.5, h: 0.22, fontFace: SANS, fontSize: 8.5, color: MUTED, margin: 0 });
  s.addText("Base needs ~$9.5M cumulative capital; this seed funds the first $2.5M.", { x: x0, y: 6.38, w: 7.0, h: 0.25, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0 });
  const rx = 8.55, rw = 4.2;
  metric(s, "460K", "PAYING HOUSEHOLDS", "to reach $100M ARR at ~$219 net/yr", rx, 2.55, rw, { vsize: 38 });
  metric(s, "5.6%", "OF SAM", "8.2M overwhelmed households", rx, 3.75, rw, { vsize: 38 });
  metric(s, "1.3×", "EXPANSION", "English-speaking, not in the model", rx, 4.95, rw, { vsize: 38 });
  s.addText("Levers: free partner seat, gifting, life-stage continuity, Canada / UK / Australia.", { x: rx, y: 6.15, w: rw, h: 0.4, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.1, fit: "shrink" });
  notes(s, "The base case is $29.4 million ARR in Year 5. The optimistic case, with top-quartile retention, is $106.9 million. The $100 million path needs 460,000 paying households at about $219 net per year — 5.6% of the overwhelmed SAM. English-speaking expansion is a 1.3× lever not in either case. The base needs about $9.5 million of cumulative capital; this seed funds the first $2.5 million.");
}

// ============================================================ 08 GO-TO-MARKET
{
  const s = pptx.addSlide();
  addTop(s, "GO-TO-MARKET", "08", {
    source: "CAC estimates are planning assumptions, not measured results. Benchmarks: Adapty Q3 2026 median cost per paying user $43–82; RevenueCat 2026.",
  });
  headline(s, [
    { text: "Every customer brings a second seat —\n", options: {} },
    { text: "and a third family.", options: { highlight: LAV } },
  ], { y: 0.98, w: 7.55, h: 1.6, size: 38 });
  const steps = [
    ["01", "One parent starts", "A three-minute family profile, then one useful next step."],
    ["02", "Invite the partner", "A free second seat. Shared memory, shared streak."],
    ["03", "Use it together", "Check in → talk → practice becomes the retention loop."],
    ["04", "Gift or refer", "Baby showers, communities, daycare codes. A new family enters."],
  ];
  steps.forEach(([n, h, p], i) => {
    const x = M + i * 1.85;
    rule(s, x, 2.5, 1.7, INK, 1.1);
    s.addText(n, { x, y: 2.6, w: 0.4, h: 0.22, fontFace: SANS, fontSize: 9, bold: true, color: PURPLE, margin: 0 });
    s.addText(h, { x, y: 2.84, w: 1.7, h: 0.45, fontFace: SANS, fontSize: 13, bold: true, color: INK, margin: 0, lineSpacingMultiple: 1.02 });
    s.addText(p, { x, y: 3.33, w: 1.7, h: 0.8, fontFace: SANS, fontSize: 10.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.12, fit: "shrink" });
  });
  s.addShape(pptx.ShapeType.rect, { x: M, y: 4.35, w: 7.0, h: 1.05, fill: { color: PALE }, line: { color: PALE, width: 0 } });
  s.addShape(pptx.ShapeType.rect, { x: M, y: 4.35, w: 0.04, h: 1.05, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });
  s.addText("The US has no parent committee. We built one into the app: the parent team. First channels are partner invite, gift, daycare, and OB-GYN — not paid social first.", { x: M + 0.2, y: 4.46, w: 6.6, h: 0.8, fontFace: SANS, fontSize: 12.5, color: INK, margin: 0, lineSpacingMultiple: 1.15, fit: "shrink" });
  // CAC panel
  const rx = 8.05, rw = 4.7;
  s.addText("$52", { x: rx, y: 2.2, w: 2.0, h: 0.7, fontFace: SANS, fontSize: 44, bold: true, color: INK, margin: 0 });
  s.addText("blended monthly CAC", { x: rx, y: 2.9, w: 3.2, h: 0.25, fontFace: SANS, fontSize: 10, bold: true, color: MUTED, charSpacing: 0.8, margin: 0 });
  const bars = [["Meta", 1.4, "$65"], ["Pinterest / YouTube", 1.2, "$55"], ["Referrals", 0.55, "$25"], ["Daycare codes", 0.3, "$15"]];
  bars.forEach(([label, bw, val], i) => {
    const y = 3.35 + i * 0.35;
    s.addText(label, { x: rx, y, w: 1.35, h: 0.22, fontFace: SANS, fontSize: 9.5, color: INK, margin: 0, valign: "middle" });
    s.addShape(pptx.ShapeType.rect, { x: rx + 1.4, y: y + 0.055, w: bw, h: 0.12, fill: { color: i < 2 ? "D9D5E0" : LAV }, line: { color: i < 2 ? "D9D5E0" : LAV, width: 0 } });
    s.addText(val, { x: rx + 2.85, y, w: 0.45, h: 0.22, fontFace: SANS, fontSize: 9, color: MUTED, margin: 0, valign: "middle" });
  });
  s.addText("15% organic today → 30–45% by Year 3. Paid social only while payback stays under 12 months.", { x: rx, y: 4.9, w: rw, h: 0.55, fontFace: SANS, fontSize: 10, color: MUTED, margin: 0, lineSpacingMultiple: 1.12, fit: "shrink" });
  rule(s, M, 5.65, 12.2);
  s.addText("A 1,000-family pilot starts in the first 90 days. Both-partner activation is the metric that decides whether paid scale turns on.", { x: M, y: 5.8, w: 12.0, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: INK, margin: 0 });
  notes(s, "Every customer brings a second seat and a third family. One parent starts; the app invites the partner free; the daily loop becomes the retention loop; gifting and referrals restart it. The US has no parent committee, so we built one into the app. First channels are partner invite, gift, daycare, and OB-GYN — not paid social first. Blended monthly CAC is $52. Base case assumes 15% organic, moving to 30–45% by Year 3. Paid social only scales while payback stays under 12 months. A 1,000-family pilot starts in the first 90 days.");
}

// ============================================================ 09 PROOF & PILOT
{
  const s = pptx.addSlide();
  addTop(s, "PROOF & PLAN", "09", {
    source: "Screenshots and test counts from the working repository, November 2026: 73 Vitest tests and 29 Playwright tests. The pilot and milestones are a plan, not results.",
  });
  headline(s, [
    { text: "The product is real.\n", options: {} },
    { text: "The next 24 months", options: { highlight: LAV } },
    { text: " prove the loop.", options: {} },
  ], { y: 0.98, w: 11.0, h: 1.45, size: 42 });
  const mx = M, mw = 3.0;
  metric(s, "6", "MODULES", "moods, sessions, child, courses", mx, 2.35, mw, { vsize: 42 });
  metric(s, "73", "UNIT TESTS", "green in the repository", mx + 3.3, 2.35, mw, { vsize: 42 });
  metric(s, "29", "E2E TESTS", "Playwright, green", mx + 6.6, 2.35, mw, { vsize: 42 });
  s.addText("PRE-REVENUE · SHIPPED", { x: 10.5, y: 2.4, w: 2.3, h: 0.22, fontFace: SANS, fontSize: 8.5, bold: true, color: PURPLE, align: "right", charSpacing: 0.8, margin: 0 });
  s.addText("Live voice · crisis routing · 430px–desktop · Docker + health check.", { x: 10.5, y: 2.65, w: 2.3, h: 0.5, fontFace: SANS, fontSize: 8, color: MUTED, align: "right", margin: 0, lineSpacingMultiple: 1.1, fit: "shrink" });
  // pilot box
  s.addShape(pptx.ShapeType.rect, { x: M, y: 3.45, w: 12.15, h: 2.35, fill: { color: PALE }, line: { color: "DED2FF", width: 0.75 } });
  s.addShape(pptx.ShapeType.rect, { x: M, y: 3.45, w: 0.05, h: 2.35, fill: { color: PURPLE }, line: { color: PURPLE, width: 0 } });
  tag(s, "THE NEXT MILESTONE", M + 0.25, 3.6, 2.6);
  s.addText("A 1,000-family pilot.", { x: M + 0.25, y: 3.82, w: 5.5, h: 0.4, fontFace: SANS, fontSize: 22, bold: true, color: INK, margin: 0 });
  s.addText("Measure the loop before paid scale.", { x: M + 0.25, y: 4.23, w: 4.0, h: 0.3, fontFace: SANS, fontSize: 12, color: MUTED, margin: 0 });
  const pm = [
    ["Partner-invite conversion", "does the second seat get claimed?"],
    ["14-day activation ≥ 60%", "both partners in the loop"],
    ["D30 retention ≥ 45%", "does the habit hold?"],
    ["Willingness to pay", "does $149 clear?"],
  ];
  pm.forEach(([h, p], i) => {
    const x = M + 4.6 + (i % 2) * 3.8;
    const y = 3.75 + Math.floor(i / 2) * 0.9;
    s.addText(h, { x, y, w: 3.6, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color: INK, margin: 0, fit: "shrink" });
    s.addText(p, { x, y: y + 0.28, w: 3.6, h: 0.3, fontFace: SANS, fontSize: 10, color: MUTED, margin: 0, fit: "shrink" });
  });
  s.addText("If activation < 40%: launch solo-parent mode at $79/yr; keep team mode as the upsell.", { x: M + 0.25, y: 5.42, w: 11.6, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: INK, margin: 0 });
  // milestones
  s.addText("24-month milestones", { x: M, y: 6.05, w: 3.0, h: 0.25, fontFace: SANS, fontSize: 11, bold: true, color: MUTED, margin: 0 });
  s.addText("6,000 households · $900K ARR · 45% D30 · 60% both-partner activation", { x: M + 2.5, y: 6.05, w: 9.7, h: 0.3, fontFace: SANS, fontSize: 14, bold: true, color: INK, margin: 0 });
  notes(s, "The product is real: six modules, 73 unit tests, 29 end-to-end tests, live voice rooms, and a working crisis path. We are pre-revenue. The next 24 months start with a 1,000-family pilot that measures partner-invite conversion, 14-day both-partner activation, D30, and willingness to pay. If activation lands below 40%, we launch a solo-parent mode at $79 a year and keep team mode as the upsell. The 24-month milestones are 6,000 paying households, ~$900K ARR, 45% D30, and 60% both-partner activation.");
}

// ============================================================ 10 TEAM & ASK
{
  const s = pptx.addSlide();
  addTop(s, "TEAM & ASK", "10", {
    source: "The round is priced as a seed on a post-money SAFE. Use of funds and milestones are a plan, not a promise. Clinical advisory board in formation; counsel opinion before launch.",
  });
  headline(s, "Built by a team that ships.", { y: 0.98, w: 11.5, h: 0.75, size: 46 });
  const founders = [
    ["DB", "Diar Begisbayev", "Co-founder & CEO", "Designed, built, and shipped the product end-to-end."],
    ["DL", "Danila Lissovoy", "Co-founder · Marketing Strategist, Chief Financial Executor", "Owns growth, pricing, and the financial model."],
    ["DS", "Daniyar Sagandykov", "Co-founder · Chief Product Executor, Customer Satisfaction Manager", "Owns product execution and customer outcomes."],
  ];
  founders.forEach(([initials, name, role, line], i) => {
    const x = M + i * 4.12;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.75, w: 3.9, h: 1.85, fill: { color: "FFFFFF" }, line: { color: LINE, width: 0.75 } });
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.2, y: 1.93, w: 0.5, h: 0.5, fill: { color: PALE }, line: { color: "DED2FF", width: 0.5 } });
    s.addText(initials, { x: x + 0.2, y: 1.93, w: 0.5, h: 0.5, fontFace: SANS, fontSize: 10, bold: true, color: INK, align: "center", valign: "middle", margin: 0 });
    s.addText(name, { x: x + 0.82, y: 1.93, w: 2.9, h: 0.26, fontFace: SANS, fontSize: 14, bold: true, color: INK, margin: 0, fit: "shrink" });
    s.addText(role, { x: x + 0.2, y: 2.5, w: 3.5, h: 0.58, fontFace: SANS, fontSize: 8.8, bold: true, color: PURPLE, margin: 0, lineSpacingMultiple: 1.05, fit: "shrink" });
    s.addText(line, { x: x + 0.2, y: 3.12, w: 3.5, h: 0.35, fontFace: SANS, fontSize: 10.2, color: MUTED, margin: 0, lineSpacingMultiple: 1.1, fit: "shrink" });
  });
  // ask + funds
  s.addText("$2.5M", { x: M, y: 3.95, w: 2.6, h: 0.75, fontFace: SANS, fontSize: 48, bold: true, color: INK, margin: 0, charSpacing: -1.8 });
  s.addText("seed · 24 months", { x: M + 2.55, y: 4.35, w: 2.3, h: 0.25, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0 });
  const funds = [[35, INK], [30, PURPLE], [25, LAV], [10, "CFC9DB"]];
  let fx = M;
  funds.forEach(([pct, color]) => {
    const w = 5.8 * pct / 100;
    s.addShape(pptx.ShapeType.rect, { x: fx, y: 4.78, w: w - 0.02, h: 0.15, fill: { color }, line: { color, width: 0 } });
    fx += w;
  });
  s.addText("Growth 35% · Product & AI 30% · Clinical & content 25% · Ops 10%", { x: M, y: 5.0, w: 5.9, h: 0.25, fontFace: SANS, fontSize: 9, color: MUTED, margin: 0, fit: "shrink" });
  // milestones right
  const rx = 6.9;
  s.addText("24-month milestones", { x: rx, y: 3.95, w: 3.0, h: 0.25, fontFace: SANS, fontSize: 10, bold: true, color: MUTED, margin: 0 });
  const stats = [["6,000", "paying households"], ["$900K", "ARR at ~$150 ARPU"], ["45%", "D30 retention"], ["60%", "both-partner activation"]];
  stats.forEach(([v, l], i) => {
    const x = rx + (i % 2) * 3.0;
    const y = 4.25 + Math.floor(i / 2) * 0.85;
    s.addText(v, { x, y, w: 2.7, h: 0.42, fontFace: SANS, fontSize: 28, bold: true, color: INK, margin: 0, fit: "shrink" });
    s.addText(l, { x, y: y + 0.42, w: 2.7, h: 0.22, fontFace: SANS, fontSize: 8.5, bold: true, color: MUTED, charSpacing: 0.7, margin: 0, fit: "shrink" });
  });
  s.addText("First: the 1,000-family pilot.", { x: rx, y: 5.95, w: 5.8, h: 0.28, fontFace: SANS, fontSize: 12, bold: true, color: INK, margin: 0 });
  // close
  rule(s, M, 6.4, 12.15);
  s.addText([{ text: "Every parent deserves a ", options: {} }, { text: "teammate.", options: { highlight: LAV } }], { x: M, y: 6.5, w: 8.0, h: 0.55, fontFace: SERIF, fontSize: 26, color: INK, margin: 0 });
  notes(s, "I'm a technical founder. I designed, built, tested, and shipped Kinora end-to-end. Danila owns growth, pricing, and the financial model. Daniyar owns product execution and customer satisfaction. We're raising $2.5M for 24 months: 35% growth, 30% product and AI, 25% clinical and content, 10% operations. The 24-month milestones are 6,000 paying households, ~$900K ARR, 45% D30, and 60% both-partner activation. First: the 1,000-family pilot. Every parent deserves a teammate.");
}

await pptx.writeFile({ fileName: OUT });
console.log(`wrote ${OUT}`);
