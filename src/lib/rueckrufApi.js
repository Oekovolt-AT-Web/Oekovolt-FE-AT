// src/lib/rueckrufApi.js
//
// Serverseitige Anbindung von Rückruf und Terminbuchung:
//  - Frappe-Backend (DocTypes „Rueckruf" und „Beratungstermin", siehe
//    docs/frappe-rueckruf-termin/) für Speicherung, Benachrichtigung, Kalender
//  - CloudTalk (optional) für den automatischen Sofort-Rückruf: CloudTalk ruft
//    zuerst eine freie Beraterin / einen freien Berater an und verbindet nach
//    Annahme automatisch mit der Kundennummer.
//
// Umgebungsvariablen (.env.local / Vercel):
//   SERVER, API_KEY, API_SECRET            Frappe (bestehend)
//   KONTAKT_API_KEY, KONTAKT_API_SECRET    optional: eingeschränkter API-User nur für diese Methoden
//   CLOUDTALK_KEY_ID, CLOUDTALK_KEY_SECRET CloudTalk API-Schlüssel (Account → Settings → API Keys)
//   CLOUDTALK_AGENT_IDS                    Komma-Liste der Agent-IDs, die Rückrufe annehmen (Reihenfolge = Priorität)

const SERVER = process.env.SERVER;
const KEY = process.env.KONTAKT_API_KEY || process.env.API_KEY;
const SECRET = process.env.KONTAKT_API_SECRET || process.env.API_SECRET;
const FRAPPE_BASIS = `${SERVER}/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.`;

const CT_ID = process.env.CLOUDTALK_KEY_ID;
const CT_SECRET = process.env.CLOUDTALK_KEY_SECRET;
const CT_AGENTEN = String(process.env.CLOUDTALK_AGENT_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const CT_BASIS = "https://my.cloudtalk.io/api/";

export const frappeKonfiguriert = () => Boolean(SERVER && KEY && SECRET);
export const cloudtalkKonfiguriert = () => Boolean(CT_ID && CT_SECRET && CT_AGENTEN.length);

export const HEADERS_PRIVAT = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/** Whitelisted Frappe-Methode, z. B. frappeKontakt("rueckruf", "create_rueckruf", {...}). */
export async function frappeKontakt(doctype, methode, daten) {
  const res = await fetch(`${FRAPPE_BASIS}${doctype}.api.${methode}`, {
    method: "POST",
    headers: { Authorization: `token ${KEY}:${SECRET}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(daten || {}),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* keine JSON-Antwort */
  }
  if (!res.ok) {
    // Keine personenbezogenen Inhalte loggen – nur Status und Methode.
    console.error(`Kontakt-API ${doctype}.${methode}: HTTP ${res.status}`);
    const fehler = new Error(json?.exc_type || "backend");
    fehler.status = res.status;
    fehler.exc = json?.exc_type;
    fehler.frappeMeldung = json?._server_messages;
    throw fehler;
  }
  return json?.message ?? null;
}

/**
 * Übergangslösung, solange die DocTypes „Rueckruf"/„Beratungstermin" noch nicht
 * installiert sind: Anfrage landet als Kontaktanfrage (bestehender DocType „Kontakt").
 */
export async function alsKontaktanfrage({ name = "", email, telefon, plzOrt = "", strasse = "", nachricht }) {
  const [vorname, ...rest] = String(name || "Rückruf").trim().split(/\s+/);
  const res = await fetch(`${FRAPPE_BASIS}kontakt.api.create_contact`, {
    method: "POST",
    headers: { Authorization: `token ${process.env.API_KEY}:${process.env.API_SECRET}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      vorname: vorname || "Rückruf",
      nachname: rest.join(" ") || "(Website)",
      e_mail_adressee: email || "office@oekovolt.com",
      telefonnummer: telefon,
      ihre_nachricht: nachricht,
      strasse_und_hausnummer: strasse,
      plz_und_ort: plzOrt,
      allgemeine_geschaeftsbedingungen: 1,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    console.error(`Kontakt-Fallback: HTTP ${res.status}`);
    throw new Error("backend");
  }
  return true;
}

const berlinFormat = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const berlinText = (iso) => (iso ? `${berlinFormat.format(new Date(iso))} Uhr` : "");

// ---------------------------------------------------------------- CloudTalk

async function cloudtalk(pfad, { method = "GET", body } = {}) {
  const res = await fetch(CT_BASIS + pfad, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${CT_ID}:${CT_SECRET}`).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "oekovolt-website/1.0",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* HTML-Fehlerseite o. Ä. */
  }
  if (!res.ok) {
    console.error(`CloudTalk ${pfad}: HTTP ${res.status}`);
    throw new Error("cloudtalk");
  }
  return json?.responseData ?? null;
}

let agentenCache = { zeit: 0, frei: [] };

/** IDs der konfigurierten Agenten, die gerade verfügbar sind (30 s Cache). */
export async function freieAgenten() {
  if (!cloudtalkKonfiguriert()) return [];
  if (Date.now() - agentenCache.zeit < 30000) return agentenCache.frei;
  try {
    const daten = await cloudtalk("agents/index.json?limit=1000");
    const liste = (daten?.data || []).map((x) => x.Agent || x);
    const verfuegbar = new Set(
      liste
        .filter((a) => ["online", "available"].includes(String(a.availability_status || "").toLowerCase()))
        .map((a) => String(a.id))
    );
    const frei = CT_AGENTEN.filter((id) => verfuegbar.has(id));
    agentenCache = { zeit: Date.now(), frei };
    return frei;
  } catch {
    agentenCache = { zeit: Date.now(), frei: [] };
    return [];
  }
}

/** Startet den Rückruf: Agent klingelt zuerst (max. 20 s), dann wird die Kundennummer gewählt. */
export async function cloudtalkRueckruf(agentId, nummerE164) {
  await cloudtalk("calls/create.json", { method: "POST", body: { agent_id: Number(agentId), callee_number: nummerE164 } });
  // Nach dem Anruf nicht erneut sofort vergeben
  agentenCache = { zeit: Date.now(), frei: agentenCache.frei.filter((id) => id !== String(agentId)) };
}

// ---------------------------------------------------------------- Missbrauchsschutz

const fenster = new Map();
/** Gleitendes Fenster im Speicher je Schlüssel (z. B. Rufnummer oder global). */
export function gedrosselt(schluessel, max, ms) {
  const jetzt = Date.now();
  const liste = (fenster.get(schluessel) || []).filter((t) => jetzt - t < ms);
  if (liste.length >= max) {
    fenster.set(schluessel, liste);
    return true;
  }
  liste.push(jetzt);
  fenster.set(schluessel, liste);
  if (fenster.size > 5000) fenster.delete(fenster.keys().next().value);
  return false;
}

/** Text kürzen, Steuerzeichen entfernen. */
export function sauber(wert, max) {
  if (wert == null) return "";
  let aus = "";
  for (const z of String(wert)) {
    const c = z.codePointAt(0);
    if (!((c < 32 && c !== 9 && c !== 10 && c !== 13) || c === 127)) aus += z;
  }
  return aus.trim().slice(0, max);
}

export const emailGueltig = (e) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(String(e || ""));
