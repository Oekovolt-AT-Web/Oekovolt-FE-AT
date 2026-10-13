// scripts/foerder-monitor.mjs – Quellen-Monitor für den Förder-Ticker (C01).
//
// Ruft die amtlichen Förderseiten (Bund, Klimafonds, OeMAG, E-Control, BMF-Rechtsnews und die
// neun Länder) sequenziell ab, bildet einen Text-Hash des sichtbaren Inhalts und vergleicht ihn
// mit dem letzten Lauf. Ausgabe ist eine Änderungsliste als Ticker-ENTWURF (Markdown) – nie eine
// automatische Veröffentlichung: Jede Änderung wird redaktionell geprüft und erst dann in
// src/data/foerderTicker.js bzw. die Programmdaten übernommen.
//
// Aufruf (wöchentlich, z. B. Aufgabenplanung Montag 07:00):
//   node scripts/foerder-monitor.mjs                 alle Quellen, Stand in data/foerder-monitor/stand.json
//   node scripts/foerder-monitor.mjs --trocken       nichts schreiben, nur vergleichen und ausgeben
//   node scripts/foerder-monitor.mjs --nur oemag,ktn nur Quellen, deren Schlüssel die Teile enthält
//   node scripts/foerder-monitor.mjs --liste         Quellen auflisten
//
// Verhalten: eigener User-Agent, robots.txt wird beachtet (Disallow für * und unseren Agenten),
// 2 s Pause zwischen Abrufen, 25 s Timeout, keine Wiederholungen, keine Cookies, kein JavaScript.
// Node ≥ 20 (fetch, crypto). Keine Abhängigkeiten.

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUSGABE_ORDNER = path.join(ROOT, "data", "foerder-monitor");
const STAND_DATEI = path.join(AUSGABE_ORDNER, "stand.json");
const USER_AGENT = "OekovoltFoerderMonitor/1.0 (+https://www.oekovolt.com/forderungen/aktuell; office@oekovolt.at)";
const PAUSE_MS = 2000;
const TIMEOUT_MS = 25_000;

/** Amtliche Quellen. schluessel stabil halten – er ist der Schlüssel im Stand. */
export const QUELLEN = [
  { schluessel: "eag-foerderkalender", label: "EAG-Förderabwicklungsstelle – Förderkalender", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/", bundesland: "bund" },
  { schluessel: "eag-investitionszuschuss", label: "EAG-Förderabwicklungsstelle – Investitionszuschuss PV & Speicher", url: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/", bundesland: "bund" },
  { schluessel: "oemag-marktpreis", label: "OeMAG – Marktpreis", url: "https://www.oem-ag.at/marktpreis", bundesland: "bund" },
  { schluessel: "klimafonds-foerderungen", label: "Klima- und Energiefonds – Förderungen", url: "https://www.klimafonds.gv.at/foerderungen/", bundesland: "bund" },
  { schluessel: "umweltfoerderung-betriebe", label: "Umweltförderung – Betriebe", url: "https://www.umweltfoerderung.at/betriebe", bundesland: "bund" },
  { schluessel: "e-control-netzentgelte", label: "E-Control – Netzentgelte", url: "https://www.e-control.at/marktteilnehmer/strom/netzentgelte", bundesland: "bund" },
  { schluessel: "bmf-rechtsnews", label: "BMF – Rechtsnews Steuern", url: "https://www.bmf.gv.at/rechtsnews/steuern-rechtsnews.html", bundesland: "bund" },
  { schluessel: "bmwet-presse", label: "BMWET – Aktuelle Pressemeldungen", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen.html", bundesland: "bund" },
  { schluessel: "wien", label: "Stadt Wien – Photovoltaik-Förderpaket", url: "https://www.wien.gv.at/umwelt/photovoltaik-foerderpaket-ab-mai-2026", bundesland: "wien" },
  { schluessel: "niederoesterreich", label: "Land NÖ – PV-Überdachung von Parkplätzen", url: "https://www.noe.gv.at/noe/Energie/PV-Ueberdachung_Parkplaetze.html", bundesland: "niederoesterreich" },
  { schluessel: "oberoesterreich", label: "Land OÖ – Stromspeicher-Nachrüstung", url: "https://www.land-oberoesterreich.gv.at/554598.htm", bundesland: "oberoesterreich" },
  { schluessel: "salzburg", label: "Land Salzburg – Energieförderung PV und Speicher", url: "https://www.salzburg.gv.at/energiefoerderung/photovoltaikanlagen-und-stromspeicher", bundesland: "salzburg" },
  { schluessel: "tirol", label: "Energieagentur Tirol – Förderübersicht Private", url: "https://www.energieagentur.tirol/fuer-private/foerderuebersicht/", bundesland: "tirol" },
  { schluessel: "vorarlberg", label: "Energieinstitut Vorarlberg – Förderkompass", url: "https://www.energieinstitut.at/privatpersonen/foerderkompass", bundesland: "vorarlberg" },
  { schluessel: "kaernten", label: "LK Kärnten – Photovoltaik (Förderung)", url: "https://ktn.lko.at/photovoltaik-neuer-f%C3%B6rdercall-gestartet+2400+4411646", bundesland: "kaernten" },
  { schluessel: "steiermark", label: "Land Steiermark – Energieförderungen / Ökofonds", url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/", bundesland: "steiermark" },
  { schluessel: "burgenland", label: "Land Burgenland – Energie und Förderungen", url: "https://www.burgenland.at/themen/bauen/wohnen/energie-neu/", bundesland: "burgenland" },
];

const args = process.argv.slice(2);
const trocken = args.includes("--trocken");
const liste = args.includes("--liste");
const nurIdx = args.indexOf("--nur");
const nur = nurIdx >= 0 ? (args[nurIdx + 1] || "").split(",").map((s) => s.trim()).filter(Boolean) : [];

const schlafen = (ms) => new Promise((r) => setTimeout(r, ms));

/** HTML → sichtbarer Text (Skripte, Styles, Kommentare, Navigation entfernt, Whitespace normalisiert). */
export function sichtbarerText(html) {
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|nav|header|footer)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|tr|h[1-6]|td|th|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

export const hashVon = (text) => createHash("sha256").update(text, "utf8").digest("hex");

/** Erste Zeilen, die sich zwischen alt und neu unterscheiden – für den Entwurf. */
export function unterschiede(alt = "", neu = "", max = 12) {
  const a = new Set(alt.split("\n"));
  const b = new Set(neu.split("\n"));
  const neuZeilen = [...b].filter((z) => !a.has(z) && z.length > 12).slice(0, max);
  const wegZeilen = [...a].filter((z) => !b.has(z) && z.length > 12).slice(0, max);
  return { neu: neuZeilen, weg: wegZeilen };
}

/** robots.txt der Quelle lesen und prüfen, ob der Pfad für * oder unseren Agenten gesperrt ist. */
async function robotsErlaubt(url, cache) {
  const u = new URL(url);
  const basis = `${u.protocol}//${u.host}`;
  if (!cache.has(basis)) {
    try {
      const r = await fetch(`${basis}/robots.txt`, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      cache.set(basis, r.ok ? await r.text() : "");
    } catch {
      cache.set(basis, "");
    }
  }
  const regeln = parseRobots(cache.get(basis));
  const pfad = u.pathname + u.search;
  const eigene = regeln.find((g) => g.agents.some((a) => USER_AGENT.toLowerCase().startsWith(a)));
  const alle = regeln.find((g) => g.agents.includes("*"));
  const gruppe = eigene || alle;
  if (!gruppe) return true;
  // längste passende Regel gewinnt (Allow vor Disallow bei gleicher Länge)
  let treffer = null;
  for (const r of gruppe.regeln) {
    if (!r.pfad) continue;
    if (pfad.startsWith(r.pfad) && (!treffer || r.pfad.length > treffer.pfad.length || (r.pfad.length === treffer.pfad.length && r.art === "allow"))) treffer = r;
  }
  return !treffer || treffer.art === "allow";
}

export function parseRobots(text) {
  const gruppen = [];
  let aktuell = null;
  for (const roh of String(text).split(/\r?\n/)) {
    const zeile = roh.replace(/#.*$/, "").trim();
    if (!zeile) continue;
    const [k, ...rest] = zeile.split(":");
    const wert = rest.join(":").trim();
    const key = k.trim().toLowerCase();
    if (key === "user-agent") {
      if (!aktuell || aktuell.regeln.length) {
        aktuell = { agents: [], regeln: [] };
        gruppen.push(aktuell);
      }
      aktuell.agents.push(wert.toLowerCase());
    } else if ((key === "disallow" || key === "allow") && aktuell) {
      aktuell.regeln.push({ art: key, pfad: wert });
    }
  }
  return gruppen;
}

async function abrufen(url) {
  const r = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml", "Accept-Language": "de-AT,de;q=0.9" }, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
  const text = await r.text();
  return { status: r.status, text };
}

function ladeStand() {
  try {
    return JSON.parse(fs.readFileSync(STAND_DATEI, "utf8"));
  } catch {
    return { quellen: {} };
  }
}

function heuteIso() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Vienna", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Markdown-Entwurf für den Ticker – zum Prüfen, nicht zum Veröffentlichen. */
export function entwurf(aenderungen, datum) {
  const zeilen = [`# Förder-Monitor – Änderungsliste vom ${datum}`, "", "ENTWURF. Jede Änderung an der Primärquelle prüfen, erst dann in src/data/foerderTicker.js und die Programmdaten übernehmen. Nichts wird automatisch veröffentlicht.", ""];
  if (!aenderungen.length) zeilen.push("Keine Änderungen an den überwachten Seiten.");
  for (const a of aenderungen) {
    zeilen.push(`## ${a.label}`, "", `- Quelle: ${a.url}`, `- Bundesland: ${a.bundesland}`, `- Befund: ${a.befund}`, "");
    if (a.diff?.neu?.length) zeilen.push("Neue Zeilen:", "", ...a.diff.neu.map((z) => `> ${z}`), "");
    if (a.diff?.weg?.length) zeilen.push("Entfallene Zeilen:", "", ...a.diff.weg.map((z) => `> ~~${z}~~`), "");
    zeilen.push("Ticker-Entwurf (zu prüfen):", "", "```js", "{", `  id: "${a.schluessel}-${datum}",`, `  datum: "${datum}",`, `  titel: "ZU PRÜFEN: Änderung auf ${a.label}",`, '  kurz: "…",', `  zielgruppen: [],`, `  bundesland: "${a.bundesland}",`, '  typ: "korrektur",', '  status: "zu-pruefen",', `  quelle: { label: "${a.label}", url: "${a.url}" },`, "  seiten: [],", `  geprueftAm: "${datum}",`, "}", "```", "");
  }
  return zeilen.join("\n");
}

async function main() {
  if (liste) {
    for (const q of QUELLEN) console.log(`${q.schluessel.padEnd(28)} ${q.url}`);
    return;
  }
  const auswahl = QUELLEN.filter((q) => !nur.length || nur.some((n) => q.schluessel.includes(n)));
  const stand = ladeStand();
  const datum = heuteIso();
  const robotsCache = new Map();
  const aenderungen = [];
  const neuerStand = { geprueft: datum, quellen: { ...stand.quellen } };

  console.log(`Förder-Monitor ${datum} · ${auswahl.length} Quellen · ${trocken ? "trocken" : "schreibt " + path.relative(ROOT, STAND_DATEI)}`);
  for (const q of auswahl) {
    const alt = stand.quellen?.[q.schluessel];
    let befund = "";
    let text = "";
    try {
      if (!(await robotsErlaubt(q.url, robotsCache))) {
        befund = "robots.txt sperrt den Pfad – nicht abgerufen";
        console.log(`  GESPERRT  ${q.schluessel}`);
        neuerStand.quellen[q.schluessel] = { ...(alt || {}), url: q.url, zuletzt: datum, befund };
        aenderungen.push({ ...q, befund });
        continue;
      }
      const r = await abrufen(q.url);
      if (r.status !== 200) {
        befund = `HTTP ${r.status}`;
        console.log(`  FEHLER    ${q.schluessel} – ${befund}`);
        neuerStand.quellen[q.schluessel] = { ...(alt || {}), url: q.url, zuletzt: datum, befund };
        aenderungen.push({ ...q, befund });
        continue;
      }
      text = sichtbarerText(r.text);
      const hash = hashVon(text);
      const geaendert = alt?.hash && alt.hash !== hash;
      const diff = geaendert ? unterschiede(alt.text || "", text) : null;
      neuerStand.quellen[q.schluessel] = { url: q.url, hash, zuletzt: datum, geaendertAm: geaendert ? datum : alt?.geaendertAm || datum, text, zeichen: text.length };
      if (!alt?.hash) {
        console.log(`  NEU       ${q.schluessel} (${text.length} Zeichen) – erster Lauf, kein Vergleich`);
      } else if (geaendert) {
        console.log(`  GEÄNDERT  ${q.schluessel} (+${diff.neu.length} / −${diff.weg.length} Zeilen)`);
        aenderungen.push({ ...q, befund: `Inhalt geändert seit ${alt.zuletzt}`, diff });
      } else {
        console.log(`  gleich    ${q.schluessel}`);
      }
    } catch (e) {
      befund = `Abruf fehlgeschlagen: ${e?.name === "TimeoutError" ? "Timeout" : e?.message || e}`;
      console.log(`  FEHLER    ${q.schluessel} – ${befund}`);
      neuerStand.quellen[q.schluessel] = { ...(alt || {}), url: q.url, zuletzt: datum, befund };
      aenderungen.push({ ...q, befund });
    }
    await schlafen(PAUSE_MS);
  }

  const md = entwurf(aenderungen, datum);
  console.log("\n" + md);
  if (!trocken) {
    fs.mkdirSync(AUSGABE_ORDNER, { recursive: true });
    fs.writeFileSync(STAND_DATEI, JSON.stringify(neuerStand, null, 2));
    const entwurfDatei = path.join(AUSGABE_ORDNER, `entwurf-${datum}.md`);
    fs.writeFileSync(entwurfDatei, md);
    console.log(`\nEntwurf gespeichert: ${path.relative(ROOT, entwurfDatei)}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
