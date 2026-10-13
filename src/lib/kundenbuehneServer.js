// src/lib/kundenbuehneServer.js
//
// Serverseitiges Laden für die Kundenbühne (Projekt-Plakette, Social-Kit, ESG-Bericht, Bildrouten)
// und die Referenz-Freigabe per Einmal-Link (Welle A07).
// Projekt: wie die Detailseite aus dem Backoffice (get_projekte/get_projekt), sonst
// src/data/projekte.js. Kundendaten: Backoffice-Felder am Projekt gewinnen, sonst
// src/data/kunden.js (Schlüssel = Projekt-Slug). Fehlt die Datei oder der Eintrag,
// bleibt der Kunde null – Plakette/Kit/ESG funktionieren dann mit dem Projektnamen.
// Freigaben: DocType „Referenz Freigabe“ (get_freigaben) gewinnt über kunden.js; schlägt das
// Laden fehl, gilt NICHTS als freigegeben (FREIGABE_LEER).
import { cache } from "react";
import { ladeProjekteRoh, ladeProjektRoh } from "@/components/Project/ladeProjekte";
import { normalisiereApiProjekt, projektSlug } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { backendFehler } from "@/lib/backendFehler";
import { FREIGABE_LEER, kundeZusammenfuehren, nameFrei, neutralerProjektName, projektNeutralisieren, schaetzung } from "@/lib/kundenbuehne";
import { BASE_URL } from "@/lib/site";
import { generateSlug } from "@/lib/slugify";

// src/data/kunden.js wird parallel gepflegt und kann (noch) fehlen: optional laden.
// Ein fehlendes Modul innerhalb von try/catch meldet der Bundler nur als Warnung.
let KUNDEN = {};
try {
  const modul = require("@/data/kunden");
  KUNDEN = modul?.KUNDEN || modul?.default?.KUNDEN || {};
} catch {
  KUNDEN = {};
}

const FREIGABE_API = `${API_BASE_URL}oekovolt_app.website_api.freigabe`;
const TIMEOUT_MS = 12_000;

/** Eintrag aus src/data/kunden.js (über den URL-Slug, sonst über projekt_website_name) */
export function kundenEintrag(...schluessel) {
  for (const s of schluessel) if (s && KUNDEN && typeof KUNDEN[s] === "object") return KUNDEN[s];
  return null;
}

// ---------------------------------------------------------------- Freigaben (get_freigaben)

/**
 * Gültige, nicht widerrufene Referenz-Freigaben aus dem Backoffice, ohne E-Mail-Adressen.
 * Rückgabe: Objekt { [projekt_website_name]: freigabe }. Bei Fehlern oder ohne Backoffice: {}.
 * 10 Minuten zwischengespeichert (wie die Projekt-API).
 */
export const ladeFreigaben = cache(async () => {
  if (!isApiConfigured() || !process.env.SERVER) return {};
  try {
    const res = await fetch(`${FREIGABE_API}.get_freigaben`, {
      method: "GET",
      headers: getApiHeaders(),
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`Referenz-Freigaben: Backoffice antwortete ${res.status}`);
      return {};
    }
    const msg = (await res.json())?.message;
    const liste = Array.isArray(msg) ? msg : Array.isArray(msg?.freigaben) ? msg.freigaben : [];
    const nachProjekt = {};
    for (const f of liste) {
      const schluessel = String(f?.projekt_website_name || "").trim().toLowerCase();
      if (schluessel && f && typeof f === "object" && !("email" in f)) nachProjekt[schluessel] = f;
    }
    return nachProjekt;
  } catch (error) {
    console.error("Referenz-Freigaben konnten nicht geladen werden:", error?.message || error);
    return {};
  }
});

/** Freigabe-Datensatz für ein Rohprojekt (projekt_website_name, ersatzweise Slug) oder null */
export function freigabeFuer(freigaben, roh, slug) {
  if (!freigaben || typeof freigaben !== "object") return null;
  for (const s of [roh?.projekt_website_name, slug]) {
    const k = String(s || "").trim().toLowerCase();
    if (k && freigaben[k]) return freigaben[k];
  }
  return null;
}

/**
 * Kundendaten für ein Rohprojekt der API (bzw. aus src/data/projekte.js).
 * Ohne `freigaben` (dritter Parameter) zählt nur kunden.js – dort ist nichts freigegeben.
 * Für Seiten mit Backoffice-Freigaben: ladeKundeFuerProjekt (async) verwenden.
 */
export function kundeFuerProjekt(roh, slug, freigaben = null) {
  return kundeZusammenfuehren({
    api: roh,
    eintrag: kundenEintrag(slug, roh?.projekt_website_name),
    freigabe: freigabeFuer(freigaben, roh, slug),
  });
}

/** Wie kundeFuerProjekt, lädt die Backoffice-Freigaben selbst (Übergabe an die Projektseite). */
export async function ladeKundeFuerProjekt(roh, slug) {
  return kundeFuerProjekt(roh, slug, await ladeFreigaben());
}

/**
 * Projektliste ohne Kundennamen (Aufruf aus ladeProjekte.js, Rohdaten in API-Form).
 * Ohne Freigabe „Name“ (Backoffice-Freigabe bzw. kunden.js) bekommt das Projekt einen neutralen
 * projekt_name – damit sind H1, <title>, Karten, Alt-Texte und der URL-Slug ohne Firmennamen.
 * - quelle "statisch": src/data/projekte.js führt Firmennamen → alle Einträge ohne Namensfreigabe.
 * - quelle "api": Laut Vertrag liefert das Backoffice neutrale Projektnamen („Mindelheim 2“); neutralisiert
 *   wird nur, wenn der Projektname erkennbar der Kunde ist (Slug = Schlüssel in kunden.js oder = Firmenwortlaut).
 * Gleiche neutrale Namen werden durchnummeriert („…, Hard (2)“), damit die Slugs eindeutig bleiben.
 * Schlägt das Laden der Freigaben fehl, gilt nichts als freigegeben (fail closed).
 */
export async function projekteNeutralisieren(liste, { quelle = "api" } = {}) {
  if (!Array.isArray(liste) || !liste.length) return Array.isArray(liste) ? liste : [];
  let freigaben = {};
  try {
    freigaben = await ladeFreigaben();
  } catch {
    freigaben = {};
  }
  const vorschlag = liste.map((roh) => {
    if (!roh || typeof roh !== "object") return { roh, name: null };
    const slugAlt = projektSlug(roh);
    const eintragDirekt = slugAlt && typeof KUNDEN?.[slugAlt] === "object" ? KUNDEN[slugAlt] : null;
    const kunde = kundeFuerProjekt(roh, slugAlt, freigaben);
    if (nameFrei(kunde)) return { roh, name: null };
    if (quelle !== "statisch") {
      const firma = String(kunde?.firma || "").trim().toLowerCase();
      const projektName = String(roh.projekt_name || "").trim().toLowerCase();
      if (!eintragDirekt && !(firma && firma === projektName)) return { roh, name: null };
    }
    return { roh, name: neutralerProjektName(kunde, roh) };
  });
  // Eindeutige Slugs: freigegebene/unveränderte Projekte belegen ihren Slug zuerst
  const belegt = new Set(vorschlag.filter((v) => !v.name).map((v) => projektSlug(v.roh)).filter(Boolean));
  return vorschlag.map(({ roh, name }) => {
    if (!name) return roh;
    let kandidat = name;
    for (let n = 2; belegt.has(generateSlug(kandidat)); n += 1) kandidat = `${name} (${n})`;
    belegt.add(generateSlug(kandidat));
    return projektNeutralisieren(roh, kandidat);
  });
}

/** Welche Kit-Teile dürfen für dieses Projekt ausgeliefert werden? */
export function kitFreigabe(kunde) {
  const f = kunde?.freigabe || FREIGABE_LEER;
  return {
    plakette: !!f.plakette,
    // Social-Kit und ESG-Bericht nennen den Kunden – nur mit Namensfreigabe
    social: !!f.name,
    esg: !!f.name,
    fotos: !!f.fotos,
    messwerte: !!f.messwerte,
    livedaten: !!f.livedaten,
  };
}

/**
 * Alles, was die Kundenbühne für ein Projekt braucht.
 * @returns {Promise<null | {projekt, kunde, firma, ort, jahr, zahlen, freigabe, kit, nameFrei, veraltet}>}
 *   veraltet = true, wenn die URL noch den alten Slug (projekt_website_name) nutzt
 *   firma = Firmenname nur mit Namensfreigabe, sonst der Projekttitel
 */
export const ladeKundenbuehne = cache(async (title) => {
  const [liste, freigaben] = await Promise.all([ladeProjekteRoh(), ladeFreigaben()]);
  const treffer = liste.find((p) => projektSlug(p) === title) || liste.find((p) => p?.projekt_website_name === title);
  if (!treffer) return null;
  const roh = (await ladeProjektRoh(treffer.projekt_website_name)) || treffer;
  const projekt = normalisiereApiProjekt(roh);
  if (!projekt.slug) return null;
  const kunde = kundeFuerProjekt(roh, projekt.slug, freigaben);
  const freigabe = kunde?.freigabe || { ...FREIGABE_LEER };
  // Messwerte der Anlage (Feld „ertrag“, optional „ertrag_zeitraum“) nur mit Freigabe „Messwerte“ – sonst Richtwert
  const ertragApi = freigabe.messwerte ? Number(roh?.ertrag) || null : null;
  const zahlen = schaetzung({ kwp: projekt.kwp, ertragKwh: ertragApi, zeitraum: ertragApi ? roh?.ertrag_zeitraum || null : null });
  const frei = nameFrei(kunde);
  return {
    projekt,
    kunde,
    firma: frei && kunde?.firma ? kunde.firma : projekt.titel,
    ort: projekt.ort || kunde?.ort || "",
    jahr: projekt.jahr || kunde?.jahr || null,
    zahlen,
    freigabe,
    kit: kitFreigabe(kunde),
    nameFrei: frei,
    veraltet: projekt.slug !== title,
  };
});

/**
 * Metadaten der Kit-Unterseiten (Plakette, Social-Kit, ESG): noindex,follow und Canonical auf
 * die Projektseite – die Unterseiten sind Werkzeuge, kein eigener Inhalt für Suchmaschinen.
 */
export function kitMetadata(daten, { titel, beschreibung }) {
  if (!daten) return { title: "Projekt nicht gefunden | Ökovolt", robots: { index: false, follow: true } };
  const canonical = `${BASE_URL}/referenzen/projekte/${daten.projekt.slug}`;
  return {
    title: `${titel} – ${daten.firma} | Ökovolt`.slice(0, 70),
    description: beschreibung.slice(0, 160),
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

// ---------------------------------------------------------------- Referenz-Freigabe per Einmal-Link
//
// Token: 32 Byte base64url (43 Zeichen), nur im Link; das Backoffice speichert den SHA-256-Hash.
// Die Gast-Methoden in website_api/freigabe.py werden OHNE API-Token aufgerufen (wie buche_termin);
// die Besucher-IP geht als ip_adresse mit, damit das Backoffice je Besucher drosseln kann.

/** Version des Erklärungstexts auf der Freigabeseite – bei Textänderung hochzählen (wird mitgespeichert). */
export const FREIGABE_TEXT_VERSION = "2026-10-11-v1";

export const tokenGueltig = (t) => /^[A-Za-z0-9_-]{43}$/.test(String(t || ""));

/** Test-Token der QA-Seite /referenzen/freigabe/test-token: zeigt die Seite mit Beispieldaten, speichert nichts. */
export const TEST_TOKEN = "test-token";

const TEST_FREIGABE = {
  test: true,
  status: "offen",
  kunde_firma: "Muster Metallbau GmbH",
  ansprechperson: "Maria Muster",
  funktion: "Geschäftsführung",
  gueltig_bis: null,
  projekt: { titel: "Hallendach Muster Metallbau", ort: "Ostermiething", jahr: 2025, kwp: 248, slug: "" },
  text_version: FREIGABE_TEXT_VERSION,
};

function frappeAntwort(daten) {
  const m = daten?.message;
  return m && typeof m === "object" ? m : null;
}

/** Fehler aus dem Backoffice in eine kurze Meldung übersetzen (Statuscode + Text) */
async function freigabeFehler(response, kontext) {
  const { status, body } = await backendFehler(response, kontext);
  return { ok: false, status, fehler: body?.error || "Die Anfrage konnte nicht verarbeitet werden." };
}

async function freigabeAufruf(methode, body, ip) {
  if (!process.env.SERVER) {
    return { ok: false, status: 503, fehler: "Die Freigabe ist derzeit nicht mit unserem System verbunden. Bitte antworten Sie uns per E-Mail." };
  }
  try {
    const res = await fetch(`${FREIGABE_API}.${methode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...body, ip_adresse: ip || "" }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return freigabeFehler(res, `Referenz-Freigabe ${methode}`);
    return { ok: true, status: 200, daten: frappeAntwort(await res.json()) };
  } catch (error) {
    console.error(`Referenz-Freigabe ${methode}: Backoffice nicht erreichbar`, error?.message || error);
    return { ok: false, status: 502, fehler: "Der Server ist vorübergehend nicht erreichbar. Bitte versuchen Sie es später erneut." };
  }
}

/**
 * Freigabe zum Token lesen (für die Seite). Rückgabe:
 *   { status: "offen"|"freigegeben"|"widerrufen"|"abgelaufen"|"ungueltig", kunde_firma, ansprechperson,
 *     funktion, gueltig_bis, projekt:{titel, ort, jahr, kwp, slug}, text_version } oder null (ungültig/Fehler).
 * Keine E-Mail-Adresse, kein Token-Hash.
 */
export async function freigabeLesen(token, ip = "") {
  if (token === TEST_TOKEN) return { ...TEST_FREIGABE };
  if (!tokenGueltig(token)) return null;
  const r = await freigabeAufruf("freigabe_lesen", { token }, ip);
  if (!r.ok || !r.daten) return r.status === 503 ? { status: "offline" } : null;
  const d = r.daten;
  if ("email" in d) delete d.email;
  return d;
}

/**
 * Auswahl speichern (Einmal-Token wird dabei verbraucht).
 * auswahl: { name, logo, zitat, zitat_text, zitat_person_funktion, fotos_anlage, plakette, livedaten,
 *            messwerte, vertretungsbefugnis_bestaetigt, text_version }
 */
export async function freigabeSpeichern(token, auswahl, ip = "") {
  if (token === TEST_TOKEN) return { ok: true, status: 200, daten: { test: true, status: "freigegeben" } };
  if (!tokenGueltig(token)) return { ok: false, status: 404, fehler: "Dieser Link ist nicht gültig." };
  return freigabeAufruf("freigabe_speichern", { token, auswahl: JSON.stringify(auswahl) }, ip);
}

/** Widerruf über den Widerrufs-Token aus der Bestätigungsmail. */
export async function freigabeWiderrufen(token, ip = "") {
  if (token === TEST_TOKEN) return { ok: true, status: 200, daten: { test: true, status: "widerrufen" } };
  if (!tokenGueltig(token)) return { ok: false, status: 404, fehler: "Dieser Link ist nicht gültig." };
  return freigabeAufruf("widerrufen", { token }, ip);
}
