/**
 * Import zones and monkeys from a CSV file (exported from Excel).
 *
 * Exactly 7 zones are output: Platform, Concourse, Exit 1, Exit 2, Exit 3, Exit 4, Exit 5.
 * CSV zone_id/zone_name can be multi-zone (e.g. "Exit 1, Exit 2") – that monkey appears in both
 * zones and collecting it in either zone counts as collected in both.
 *
 * Usage:
 *   node scripts/import-monkeys-from-csv.js [path-to.csv]
 *
 * Default path: ref/monkeys.csv
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const CSV_PATH = path.resolve(__dirname, "../ref/monkeys.csv");
const OUT_PATH = path.resolve(__dirname, "../lib/mockData.generated.ts");

/** Canonical zone ids (exactly 7). Order: platform, concourse, exit1–5. */
const CANONICAL_ZONE_IDS = ["platform", "concourse", "exit-1", "exit-2", "exit-3", "exit-4", "exit-5"];

const CANONICAL_ZONES = [
  { id: "platform", name: "Platform", description: "", icon: "🚇" },
  { id: "concourse", name: "Concourse", description: "", icon: "🏛️" },
  { id: "exit-1", name: "Exit 1", description: "", icon: "🚪" },
  { id: "exit-2", name: "Exit 2", description: "", icon: "🚪" },
  { id: "exit-3", name: "Exit 3", description: "", icon: "🚪" },
  { id: "exit-4", name: "Exit 4", description: "", icon: "🚪" },
  { id: "exit-5", name: "Exit 5", description: "", icon: "🚪" },
];

/** Map CSV zone_id and/or zone_name to an array of canonical zone ids (one or more). */
function mapToCanonicalZoneIds(zoneIdRaw, zoneNameRaw) {
  const combined = [zoneIdRaw, zoneNameRaw].filter(Boolean).join(" ");
  const lower = String(combined).toLowerCase().trim();
  const order = CANONICAL_ZONE_IDS.slice();
  const result = [];

  // Exit N: from "exit-1", "exit-2", "exit 1", "Exit 1, Exit 2", "upper-thomson-exit-1-exit-2"
  for (const n of [1, 2, 3, 4, 5]) {
    if (new RegExp(`exit-${n}|exit\\s*${n}\\b`).test(lower)) result.push("exit-" + n);
  }
  if (lower.includes("platform")) result.push("platform");
  if (lower.includes("concourse")) result.push("concourse");

  // Dedupe and sort by canonical order
  const seen = new Set();
  const out = [];
  for (const id of order) {
    if (result.includes(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  if (out.length === 0) out.push("concourse");
  return out;
}

function slug(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function escapeJs(s) {
  if (s == null || s === "") return '""';
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
}

function main() {
  const csvPath = process.argv[2] || CSV_PATH;
  if (!fs.existsSync(csvPath)) {
    console.error("CSV not found:", csvPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

  const normalizeKey = (k) => (k || "").trim().toLowerCase().replace(/\s+/g, "_");
  const headerMap = (row) => {
    const keys = Object.keys(row);
    const map = {};
    keys.forEach((k) => {
      map[normalizeKey(k)] = row[k];
    });
    return map;
  };

  const monkeys = [];
  for (let i = 0; i < rows.length; i++) {
    const r = headerMap(rows[i]);
    const zoneIdRaw = (r.zone_id || "").trim();
    const zoneNameRaw = (r.zone_name || "").trim();
    const zoneIds = mapToCanonicalZoneIds(zoneIdRaw, zoneNameRaw);
    const primaryZoneId = zoneIds[0];

    const num = parseInt(r.monkey_number, 10);
    const monkeyNumber = Number.isFinite(num) ? num : i + 1;
    const name = (r.monkey_name || "").trim() || `Monkey ${monkeyNumber}`;
    let monkeyId = (r.monkey_id || "").trim() || "monkey-" + monkeyNumber;
    if (!monkeyId || monkeyId.startsWith("-")) monkeyId = "monkey-" + monkeyNumber;

    let artworkFilename = (r.artwork_filename || "").trim();
    if (!artworkFilename) artworkFilename = `${String(monkeyNumber).padStart(2, "0")}-${slug(name)}.svg`;
    const artworkUrl = "/artwork/" + artworkFilename.replace(/^\/+/, "");

    const clue = (r.clue || "").trim() || "Find this monkey!";
    const question = (r.question || "").trim() || "Where did you see this monkey?";
    const optionA = (r.option_a || "").trim() || "Option A";
    const optionB = (r.option_b || "").trim() || "Option B";
    const optionC = (r.option_c || "").trim() || "Option C";
    const correctOption = String(r.correct_option || "A").trim().toUpperCase();
    const correctOptionIndex = correctOption === "B" ? 1 : correctOption === "C" ? 2 : 0;
    const icon = (r.emoji_icon || r.icon || "🐵").trim() || "🐵";

    const monkey = {
      id: monkeyId,
      zone_id: primaryZoneId,
      name,
      number: monkeyNumber,
      artworkUrl,
      clue,
      question,
      options: [optionA, optionB, optionC],
      correctOptionIndex,
      icon,
    };
    if (zoneIds.length > 1) monkey.zone_ids = zoneIds;
    monkeys.push(monkey);
  }

  const zoneLines = CANONICAL_ZONES.map(
    (z) =>
      `  { id: ${escapeJs(z.id)}, name: ${escapeJs(z.name)}, description: ${escapeJs(z.description)}, icon: ${escapeJs(z.icon)} }`
  );
  const monkeyLines = monkeys.map((m) => {
    const base = `  { id: ${escapeJs(m.id)}, zone_id: ${escapeJs(m.zone_id)}, name: ${escapeJs(m.name)}, number: ${m.number}, artworkUrl: ${escapeJs(m.artworkUrl)}, clue: ${escapeJs(m.clue)}, question: ${escapeJs(m.question)}, options: [${m.options.map(escapeJs).join(", ")}], correctOptionIndex: ${m.correctOptionIndex}, icon: ${escapeJs(m.icon)} }`;
    if (m.zone_ids && m.zone_ids.length > 1) {
      return base.replace(" }", `, zone_ids: [${m.zone_ids.map((z) => escapeJs(z)).join(", ")}] }`);
    }
    return base;
  });

  const out = `// Auto-generated by scripts/import-monkeys-from-csv.js – do not edit by hand.
import type { Monkey, Zone } from "./supabaseClient";

export const mockZones: Zone[] = [\n${zoneLines.join(",\n")}\n];

export const mockMonkeys: Monkey[] = [\n${monkeyLines.join(",\n")}\n];
`;

  fs.writeFileSync(OUT_PATH, out, "utf-8");
  console.log("Wrote", OUT_PATH);
  console.log("Zones: 7 (fixed) | Monkeys:", monkeys.length);
}

main();
