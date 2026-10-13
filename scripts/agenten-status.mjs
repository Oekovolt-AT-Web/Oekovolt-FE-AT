// scripts/agenten-status.mjs
//
// Zeigt, welche Agenten im neuesten Claude-Workflow laufen bzw. fertig sind –
// Ersatz für /workflows, das in der VS-Code-Erweiterung fehlt.
//
//   node scripts/agenten-status.mjs          einmal anzeigen
//   node scripts/agenten-status.mjs --live   alle 10 s neu anzeigen (Strg+C beendet)

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const PROJEKTE = path.join(os.homedir(), ".claude", "projects");

function neuesterWorkflow() {
  let best = null;
  for (const projekt of existsSync(PROJEKTE) ? readdirSync(PROJEKTE) : []) {
    if (!projekt.toLowerCase().includes("oekovolt-fe-at")) continue;
    const pDir = path.join(PROJEKTE, projekt);
    for (const sitzung of readdirSync(pDir)) {
      const wDir = path.join(pDir, sitzung, "subagents", "workflows");
      if (!existsSync(wDir)) continue;
      for (const wf of readdirSync(wDir)) {
        const d = path.join(wDir, wf);
        const t = statSync(d).mtimeMs;
        if (!best || t > best.t) best = { d, t, wf };
      }
    }
  }
  return best;
}

const minuten = (ms) => (ms < 60_000 ? `${Math.round(ms / 1000)} s` : `${Math.round(ms / 60_000)} min`);

function anzeigen() {
  const wf = neuesterWorkflow();
  if (!wf) return console.log("Kein Workflow gefunden.");
  const journal = path.join(wf.d, "journal.jsonl");
  // Eine gerade halb geschriebene letzte Zeile ist kein gültiges JSON → überspringen statt abbrechen
  const zeilen = (existsSync(journal) ? readFileSync(journal, "utf8").trim().split("\n").filter(Boolean) : []).flatMap((l) => {
    try {
      return [JSON.parse(l)];
    } catch {
      return [];
    }
  });
  const agenten = new Map();
  for (const z of zeilen) {
    if (z.type === "started") agenten.set(z.agentId, { label: String(z.label || z.agentId || "?"), phase: z.phase, fertig: false });
    if (z.type === "result" && agenten.has(z.agentId)) agenten.get(z.agentId).fertig = true;
  }
  const jetzt = Date.now();
  console.log(`\nWorkflow ${wf.wf}  ·  Stand ${new Date().toLocaleTimeString("de-AT")}`);
  let laufend = 0;
  for (const [id, a] of agenten) {
    const datei = path.join(wf.d, `agent-${id}.jsonl`);
    const st = existsSync(datei) ? statSync(datei) : null;
    const zuletzt = st ? minuten(jetzt - st.mtimeMs) : "–";
    if (!a.fertig) laufend += 1;
    const status = a.fertig ? "fertig  " : "arbeitet";
    console.log(`  ${status}  ${a.label.padEnd(34)} ${String(a.phase || "").padEnd(16)} letzte Aktivität vor ${zuletzt}${st ? `, ${Math.round(st.size / 1024)} KB Protokoll` : ""}`);
  }
  console.log(`  → ${laufend} arbeiten, ${agenten.size - laufend} fertig, ${agenten.size} gesamt`);
}

anzeigen();
if (process.argv.includes("--live")) setInterval(() => { console.clear(); anzeigen(); }, 10_000);
