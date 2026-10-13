// scripts/agenten-dashboard.mjs  –  PROVISORISCH, kann jederzeit gelöscht werden.
//
// Lokales Live-Dashboard für die Claude-Agenten-Teams (Ersatz für /workflows in VS Code).
// Liest nur die Protokolle unter ~/.claude/projects/…/subagents/workflows und zeigt
// Teams (Phasen), Agenten, Fortschritt und die letzten Arbeitsschritte.
//
//   node scripts/agenten-dashboard.mjs   →  http://localhost:4599

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const PORT = 4599;
const ERLAUBTE_HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);
const PROJEKTE = path.join(os.homedir(), ".claude", "projects");
const WURZEL = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

/* ---------------------------------------------------------------- Daten lesen */

function workflows() {
  const liste = [];
  for (const projekt of existsSync(PROJEKTE) ? readdirSync(PROJEKTE) : []) {
    if (!projekt.toLowerCase().includes("oekovolt-fe-at")) continue;
    const pDir = path.join(PROJEKTE, projekt);
    for (const sitzung of readdirSync(pDir)) {
      const wDir = path.join(pDir, sitzung, "subagents", "workflows");
      if (!existsSync(wDir)) continue;
      for (const wf of readdirSync(wDir)) {
        const d = path.join(wDir, wf);
        liste.push({ id: wf, d, t: statSync(d).mtimeMs });
      }
    }
  }
  return liste.sort((a, b) => b.t - a.t);
}

const kuerzen = (s, n = 140) => {
  const t = String(s ?? "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};
const kurzPfad = (p) => String(p || "").replace(/\\/g, "/").replace(/^.*Oekovolt-FE-AT\//i, "");

function schrittText(name, e = {}) {
  switch (name) {
    case "Read": return `liest ${kurzPfad(e.file_path)}`;
    case "Write": return `schreibt ${kurzPfad(e.file_path)}`;
    case "Edit": return `ändert ${kurzPfad(e.file_path)}`;
    case "Bash": case "PowerShell": return e.description ? kuerzen(e.description) : `Befehl: ${kuerzen(e.command, 100)}`;
    case "Grep": return `sucht „${kuerzen(e.pattern, 60)}“`;
    case "Glob": return `sucht Dateien ${kuerzen(e.pattern, 60)}`;
    case "WebSearch": return `Websuche: ${kuerzen(e.query, 100)}`;
    case "WebFetch": return `liest Webseite ${kuerzen(e.url, 90)}`;
    case "StructuredOutput": return "liefert Ergebnis ab";
    case "ToolSearch": return "lädt Werkzeuge";
    default: return `${name.replace(/^mcp__[^_]+__/, "")}`;
  }
}

const cache = new Map();
function agentLesen(datei) {
  const st = statSync(datei);
  const c = cache.get(datei);
  if (c && c.mtime === st.mtimeMs) return c.wert;
  const schritte = [];
  const dateien = new Set();
  let start = null, ende = null, werkzeuge = 0;
  for (const zeile of readFileSync(datei, "utf8").split("\n")) {
    if (!zeile) continue;
    let j;
    try { j = JSON.parse(zeile); } catch { continue; }
    if (j.timestamp) { start ??= j.timestamp; ende = j.timestamp; }
    if (j.type !== "assistant" || !Array.isArray(j.message?.content)) continue;
    for (const b of j.message.content) {
      if (b.type === "tool_use") {
        werkzeuge += 1;
        if ((b.name === "Write" || b.name === "Edit") && b.input?.file_path) dateien.add(kurzPfad(b.input.file_path));
        schritte.push({ zeit: j.timestamp, art: "werkzeug", text: schrittText(b.name, b.input) });
      } else if (b.type === "text" && b.text?.trim()) {
        schritte.push({ zeit: j.timestamp, art: "text", text: kuerzen(b.text, 220) });
      }
    }
  }
  const wert = { start, ende, werkzeuge, dateien: [...dateien], schritte: schritte.slice(-8).reverse(), groesse: st.size };
  cache.set(datei, { mtime: st.mtimeMs, wert });
  return wert;
}

// Ohne Auswahl: alle Workflows mit Aktivität in den letzten 6 Stunden zusammen ("alle aktiven").
function stand(wfId) {
  const alle = workflows();
  const jetzt = Date.now();
  const gewaehlt = wfId && wfId !== "aktiv" ? alle.filter((w) => w.id === wfId) : alle.filter((w) => jetzt - w.t < 6 * 3600_000);
  const auswahl = gewaehlt.length ? gewaehlt : alle.slice(0, 1);
  if (!auswahl.length) return { workflows: [], agenten: [], waechter: [] };
  const agenten = new Map();
  let workflowFertig = false;
  for (const wf of auswahl) {
    const journal = path.join(wf.d, "journal.jsonl");
    const eintraege = existsSync(journal) ? readFileSync(journal, "utf8").trim().split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return {}; } }) : [];
    for (const z of eintraege) {
      if (z.type === "started") agenten.set(z.agentId, { id: z.agentId, dir: wf.d, label: z.label, phase: z.phase || "Allgemein", fertig: false });
      if (z.type === "result" && agenten.has(z.agentId)) agenten.get(z.agentId).fertig = true;
      if (z.type === "failed" && agenten.has(z.agentId)) agenten.get(z.agentId).abgebrochen = true;
      if (z.type === "completed" || z.type === "finished" || z.type === "done") workflowFertig = true;
    }
  }
  const wf = { id: wfId && wfId !== "aktiv" ? auswahl[0].id : "aktiv" };
  let liste = [...agenten.values()].map(({ dir, ...a }) => {
    const datei = path.join(dir, `agent-${a.id}.jsonl`);
    const info = existsSync(datei) ? agentLesen(datei) : { schritte: [], dateien: [], werkzeuge: 0 };
    const ruhe = info.ende ? jetzt - Date.parse(info.ende) : null;
    const zustand = a.fertig ? "fertig" : a.abgebrochen ? "abgebrochen" : ruhe != null && ruhe > 10 * 60_000 ? "still" : "arbeitet";
    return { ...a, ...info, zustand, ruheSek: ruhe != null ? Math.round(ruhe / 1000) : null };
  });
  // Nach einer Fortsetzung (resume) laufen dieselben Agenten erneut: alte abgebrochene Einträge dann ausblenden
  const neuGestartet = new Set(liste.filter((a) => a.zustand !== "abgebrochen").map((a) => a.label));
  for (let i = liste.length - 1; i >= 0; i--) if (liste[i].zustand === "abgebrochen" && neuGestartet.has(liste[i].label)) liste.splice(i, 1);
  let waechter = [];
  const wlog = path.join(WURZEL, ".dev-waechter.log");
  if (existsSync(wlog)) waechter = readFileSync(wlog, "utf8").trim().split("\n").slice(-5).reverse();
  return {
    ...schaetzung(liste, jetzt),
    fahrplan: FAHRPLAN,
    workflow: wf.id,
    workflowFertig,
    workflows: alle.slice(0, 12).map((w) => ({ id: w.id, t: w.t })),
    agenten: liste,
    waechter,
    zeit: new Date().toISOString(),
  };
}

/* ---------------------------------------------------------------- Zeitschätzung */

// Grobe Richtwerte je Agenten-Art (Minuten), bis genug fertige Agenten echte Werte liefern.
const RICHTWERT_MIN = { leadgate: 60, recherche: 35, experte: 35, strategie: 35, qa: 30, fix: 20, nachpruefung: 15, einbau: 25, pruefung: 30 };
const art = (label) => String(label || "").split(":")[0];
const median = (z) => { const s = [...z].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };

function schaetzung(liste, jetzt) {
  const dauerJeArt = {};
  for (const a of liste) {
    if (a.zustand !== "fertig" || !a.start || !a.ende) continue;
    (dauerJeArt[art(a.label)] ||= []).push((Date.parse(a.ende) - Date.parse(a.start)) / 60_000);
  }
  const alleDauern = Object.values(dauerJeArt).flat();
  let welleRestMin = 0;
  for (const a of liste) {
    if (a.zustand === "fertig" || a.zustand === "abgebrochen" || !a.start) continue;
    const gemessen = dauerJeArt[art(a.label)] || [];
    const typ = (gemessen.length >= 3 ? median(gemessen) : null) ?? RICHTWERT_MIN[art(a.label)] ?? median(alleDauern) ?? 30;
    const lauf = (jetzt - Date.parse(a.start)) / 60_000;
    const rest = Math.max(typ - lauf, lauf > typ ? 5 : 2);
    a.restMin = Math.round(rest);
    a.ueberzogen = lauf > typ * 1.3;
    a.laufMin = Math.round(lauf);
    welleRestMin = Math.max(welleRestMin, rest);
  }
  for (const a of liste) if (a.zustand === "fertig" && a.start && a.ende) a.laufMin = Math.round((Date.parse(a.ende) - Date.parse(a.start)) / 60_000);
  // Nachfolge-Stufen (Einbau, Nachbessern, Nachprüfen) starten erst später – grob +40 min, solange noch Erst-Stufen laufen
  const erstStufen = liste.some((a) => a.zustand === "arbeitet" && ["leadgate", "qa"].includes(art(a.label)));
  return {
    eta: {
      welleRestMin: Math.round(welleRestMin + (erstStufen ? 40 : 0)),
      durchschnittMin: alleDauern.length ? Math.round(alleDauern.reduce((s, x) => s + x, 0) / alleDauern.length) : null,
      basis: alleDauern.length,
    },
  };
}

// Gesamtfahrplan (grobe Schätzung, wird von Claude bei Bedarf angepasst)
const FAHRPLAN = [
  { schritt: "Jetzt parallel (3 Workflows, 18 Agenten): Welle A neu (A02–A12) + Welle C vorgezogen (C01–C08, B06) + Welle B vorgezogen (B04–B10)", stunden: "5–7" },
  { schritt: "Gemeinsame Integration: Übergaben, Tests, Sitemap/llms, Produktions-Build, Code-Review, lokaler Commit", stunden: "1–2" },
  { schritt: "Rest B/C (B01–B03, B11, C09–C12) + Welle D (Marketing-Maschine) parallel", stunden: "4–6" },
  { schritt: "Welle E (Leistung, Härtung, Barrierefreiheit, Beweise live)", stunden: "3–4" },
  { schritt: "Abschlusswelle Perfektion: alle Seiten × 18 Geräte, optisch + Code, Schleife bis 2 Runden ohne Befund", stunden: "4–8" },
];

/* ---------------------------------------------------------------- Seite */

const SEITE = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agenten-Leitstand</title>
<style>
:root{--navy:#03122b;--navy2:#0a1e35;--gruen:#669933;--gruen2:#8fc25a;--sand:#fbfaf6;--ink:#151a24;--grau:#5b6475;--linie:#e3e6ec;--gelb:#e8b100;--rot:#d64545}
*{box-sizing:border-box}body{margin:0;font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--sand);color:var(--ink)}
header{background:var(--navy);color:#fff;padding:20px 24px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between}
h1{margin:0;font-size:20px;letter-spacing:-.01em}h1 span{color:var(--gruen2)}
.unter{color:#9fb0c8;font-size:12.5px}
select{font:inherit;padding:6px 10px;border-radius:10px;border:0;background:#13294a;color:#fff}
main{max-width:1400px;margin:0 auto;padding:20px 16px 60px}
.kopf{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:20px}
.kachel{background:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 1px 2px rgba(15,23,42,.05)}
.kachel b{display:block;font-size:26px;letter-spacing:-.02em}.kachel small{color:var(--grau)}
.balken{height:10px;border-radius:99px;background:#e9ecf1;overflow:hidden;margin-top:8px}.balken i{display:block;height:100%;background:linear-gradient(90deg,var(--gruen),var(--gruen2));transition:width .6s}
.team{margin:26px 0 10px;display:flex;align-items:baseline;gap:10px}.team h2{margin:0;font-size:16px}.team small{color:var(--grau)}
.gitter{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px}
.karte{background:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 1px 2px rgba(15,23,42,.05),0 12px 32px -24px rgba(15,23,42,.35);border-left:4px solid var(--linie)}
.karte.arbeitet{border-left-color:var(--gruen)}.karte.fertig{border-left-color:var(--navy)}.karte.still{border-left-color:var(--gelb)}.karte.abgebrochen{border-left-color:#c0392b;opacity:.75}.abgebrochen .pille{background:#fde8e6;color:#9b2c20}
.zeile{display:flex;justify-content:space-between;gap:8px;align-items:center}
.name{font-weight:650}.pille{font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:99px;white-space:nowrap}
.arbeitet .pille{background:#eef6e4;color:#3d6b12}.fertig .pille{background:#e6ebf3;color:var(--navy)}.still .pille{background:#fff4d6;color:#7a5a00}
.punkt{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--gruen);margin-right:6px;animation:p 1.4s infinite}@keyframes p{50%{opacity:.25}}
.meta{color:var(--grau);font-size:12px;margin:6px 0 8px}
ol{list-style:none;margin:0;padding:0;border-top:1px solid var(--linie)}li{padding:5px 0;border-bottom:1px solid #f1f3f6;font-size:12.5px;display:flex;gap:8px}
li time{color:#9aa3b2;font-variant-numeric:tabular-nums;flex:none}li.text{color:#3c4556;font-style:italic}
li:first-child{font-weight:600}
details{margin-top:8px;font-size:12px;color:var(--grau)}summary{cursor:pointer}
.waechter{margin-top:30px;background:var(--navy2);color:#cfd8e6;border-radius:16px;padding:14px 16px;font:12px/1.6 ui-monospace,Consolas,monospace}
.waechter b{color:#fff;font-family:system-ui}
.leer{color:var(--grau);padding:30px;text-align:center}
.zeit{font-size:12px;font-weight:600;color:#3d6b12;margin:-4px 0 8px}
.kachel.eta{background:var(--navy);color:#fff}.kachel.eta small{color:#9fb0c8;display:block}.kachel.eta b{color:var(--gruen2)}
.fahrplan{margin-top:30px;background:#fff;border-radius:16px;padding:16px 18px}.fahrplan h2{margin:0 0 8px;font-size:16px}.fahrplan h2 small{font-weight:400;color:var(--grau);font-size:12px}
.fahrplan li{justify-content:space-between;font-weight:400}.fahrplan li b{white-space:nowrap;color:var(--navy)}
</style></head><body>
<header><div><h1>Ökovolt · <span>Agenten-Leitstand</span></h1><div class="unter" id="unter">lädt …</div></div>
<label class="unter">Workflow <select id="wahl"></select></label></header>
<main><div class="kopf" id="kopf"></div><div id="teams"></div><div class="fahrplan" id="fahrplan"></div><div class="waechter" id="waechter"></div></main>
<script>
const $=s=>document.querySelector(s);let gewaehlt="";
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uhr=t=>t?new Date(t).toLocaleTimeString("de-AT",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"";
const dauer=s=>s==null?"–":s<60?s+" s":s<3600?Math.round(s/60)+" min":(s/3600).toFixed(1)+" h";
async function laden(){
  let d;try{d=await (await fetch("/api"+(gewaehlt?"?wf="+encodeURIComponent(gewaehlt):""))).json()}catch{ $("#unter").textContent="Dashboard-Server nicht erreichbar";return}
  $("#wahl").innerHTML='<option value="aktiv"'+(d.workflow==="aktiv"?" selected":"")+'>alle aktiven Workflows</option>'+d.workflows.map(w=>'<option value="'+esc(w.id)+'"'+(w.id===d.workflow?" selected":"")+'>'+esc(w.id)+" · "+new Date(w.t).toLocaleString("de-AT")+"</option>").join("");
  const a=d.agenten,fertig=a.filter(x=>x.zustand==="fertig").length,lauf=a.filter(x=>x.zustand==="arbeitet").length,still=a.filter(x=>x.zustand==="still").length,abgebr=a.filter(x=>x.zustand==="abgebrochen").length;
  const proz=a.length?Math.round(fertig/a.length*100):0;
  $("#unter").textContent=(d.workflow==="aktiv"?"alle aktiven Workflows":"Workflow "+d.workflow)+" · aktualisiert "+uhr(d.zeit)+" · alle 5 s";
  $("#kopf").innerHTML=
   '<div class="kachel"><small>Fortschritt (gestartete Agenten)</small><b>'+proz+' %</b><div class="balken"><i style="width:'+proz+'%"></i></div></div>'+
   '<div class="kachel"><small>arbeiten gerade</small><b>'+lauf+'</b></div>'+
   '<div class="kachel"><small>fertig</small><b>'+fertig+'</b></div>'+
   '<div class="kachel"><small>still (&gt;10 min keine Aktivität)</small><b>'+still+'</b></div>'+'<div class="kachel"><small>abgebrochen (z. B. Nutzungslimit) – wird fortgesetzt</small><b>'+abgebr+'</b></div>'+
   '<div class="kachel"><small>Arbeitsschritte gesamt</small><b>'+a.reduce((s,x)=>s+(x.werkzeuge||0),0)+'</b></div>'+
   '<div class="kachel eta"><small>laufende Wellen fertig in ca.</small><b>'+(lauf?dauer(d.eta.welleRestMin*60):"–")+'</b><small>'+(lauf?"ca. "+new Date(Date.now()+d.eta.welleRestMin*60000).toLocaleTimeString("de-AT",{hour:"2-digit",minute:"2-digit"})+" Uhr · ":"")+(d.eta.basis?"Ø "+d.eta.durchschnittMin+" min je Agent ("+d.eta.basis+" fertig)":"Richtwerte, noch wenige Messungen")+'</small></div>';
  $("#fahrplan").innerHTML='<h2>Gesamtfahrplan <small>grobe Schätzung</small></h2><ol>'+d.fahrplan.map(f=>'<li><span>'+esc(f.schritt)+'</span><b>'+esc(f.stunden)+' h</b></li>').join("")+'</ol>';
  if(!a.length){$("#teams").innerHTML='<div class="leer">Noch keine Agenten gestartet.</div>'}
  else{
   const teams={};a.forEach(x=>(teams[x.phase]=teams[x.phase]||[]).push(x));
   $("#teams").innerHTML=Object.entries(teams).map(([t,l])=>{
     const f=l.filter(x=>x.zustand==="fertig").length;
     return '<div class="team"><h2>Team '+esc(t)+'</h2><small>'+f+' von '+l.length+' fertig</small></div><div class="gitter">'+l.map(x=>
      '<div class="karte '+x.zustand+'"><div class="zeile"><span class="name">'+(x.zustand==="arbeitet"?'<span class="punkt"></span>':"")+esc(x.label)+'</span><span class="pille">'+({arbeitet:"arbeitet",fertig:"fertig",still:"still",abgebrochen:"abgebrochen"}[x.zustand])+'</span></div>'+
      '<div class="meta">seit '+uhr(x.start)+' · letzte Aktivität vor '+dauer(x.ruheSek)+' · '+(x.werkzeuge||0)+' Schritte</div>'+
      '<div class="zeit">'+(x.zustand==="fertig"?"Dauer "+dauer((x.laufMin||0)*60):(x.ueberzogen?"läuft länger als üblich ("+dauer((x.laufMin||0)*60)+") · noch ca. "+dauer((x.restMin||0)*60):"läuft "+dauer((x.laufMin||0)*60)+" · noch ca. "+dauer((x.restMin||0)*60)))+'</div>'+
      '<ol>'+(x.schritte||[]).map(s=>'<li class="'+s.art+'"><time>'+uhr(s.zeit)+'</time><span>'+esc(s.text)+'</span></li>').join("")+'</ol>'+
      (x.dateien&&x.dateien.length?'<details><summary>'+x.dateien.length+' Dateien geändert</summary>'+x.dateien.map(esc).join("<br>")+'</details>':"")+
      '</div>').join("")+'</div>'}).join("");
  }
  $("#waechter").innerHTML='<b>Dev-Server-Wächter (Port 3001)</b><br>'+(d.waechter.length?d.waechter.map(esc).join("<br>"):"kein Protokoll");
}
$("#wahl").addEventListener("change",e=>{gewaehlt=e.target.value;laden()});
laden();setInterval(laden,5000);
</script></body></html>`;

http
  .createServer((req, res) => {
    // Schutz gegen DNS-Rebinding: Eine fremde Domain, die auf 127.0.0.1 umbindet, schickt ihren
    // eigenen Host-Header mit – nur localhost/127.0.0.1 auf diesem Port zulassen.
    if (!ERLAUBTE_HOSTS.has(String(req.headers.host || "").toLowerCase())) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Verboten");
    }
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname === "/api") {
      let daten;
      try { daten = stand(url.searchParams.get("wf")); } catch (e) { daten = { fehler: String(e), workflows: [], agenten: [], waechter: [] }; }
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(JSON.stringify(daten));
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(SEITE);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`Agenten-Leitstand: http://localhost:${PORT}`));
