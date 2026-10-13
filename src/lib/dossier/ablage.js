// src/lib/dossier/ablage.js
//
// Dossier-Ablage: gemeinsames Ergebnisformat aller Rechner und Checks, abgelegt im
// sessionStorage des Browsers (bleibt im Browser, verlässt den Rechner nicht, endet mit dem Tab).
// Höchstens 10 Einträge, jeder Zugriff in try/catch – ohne Speicher läuft die Seite weiter.
//
// Ergebnisformat (eintragErzeugen):
//   { id, quelle: "/standort-check", titel: "Standort-Check Ostermiething",
//     kennzahlen: [{ label, wert, einheit? }], annahmen: [string | [label, wert]],
//     stand: "11.10.2026", art?: "standort" | "foerderung" | "gewerbe-pv" | "lastgang" | "modellvergleich" | …,
//     eingaben?: {} (nur Zahlen/Schalter für die Dossier-Rechnung, keine Personendaten), zeit }
//
// Ohne React und ohne Pfad-Aliase – in Node testbar (scripts/investition.test.mjs mit Speicher-Attrappe).

export const DOSSIER_SCHLUESSEL = "ov-dossier";
export const DOSSIER_MAX = 10;
export const DOSSIER_EREIGNIS = "ov-dossier-geaendert";

const MAX_TEXT = 160;
const MAX_KENNZAHLEN = 12;
const MAX_ANNAHMEN = 16;

const text = (v, max = MAX_TEXT) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
const pfad = (v) => (/^\/[\w\-/.%~]*$/.test(String(v || "")) ? String(v).slice(0, 120) : "");

function speicherHolen(speicher) {
  if (speicher) return speicher;
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

/** Nur einfache Werte in `eingaben` übernehmen (Zahlen, Schalter, kurze Kennungen). */
function eingabenSauber(e) {
  if (!e || typeof e !== "object") return undefined;
  const aus = {};
  for (const [k, v] of Object.entries(e).slice(0, 40)) {
    if (typeof v === "number" && Number.isFinite(v)) aus[k.slice(0, 40)] = v;
    else if (typeof v === "boolean") aus[k.slice(0, 40)] = v;
    else if (typeof v === "string" && v.length <= 40) aus[k.slice(0, 40)] = v;
    else if (v && typeof v === "object" && !Array.isArray(v)) {
      const inner = eingabenSauber(v);
      if (inner && Object.keys(inner).length) aus[k.slice(0, 40)] = inner;
    }
  }
  return Object.keys(aus).length ? aus : undefined;
}

/** Normalisiert einen Eintrag; wirft nie, gibt bei unbrauchbarer Eingabe null zurück. */
export function eintragErzeugen({ id, quelle, titel, kennzahlen = [], annahmen = [], stand, art, eingaben, zeit } = {}) {
  const q = pfad(quelle);
  const t = text(titel, 120);
  if (!q || !t) return null;
  const kz = (Array.isArray(kennzahlen) ? kennzahlen : [])
    .map((k) => (k && typeof k === "object" ? { label: text(k.label, 80), wert: text(k.wert, 60), einheit: text(k.einheit, 20) || undefined } : null))
    .filter((k) => k && k.label && k.wert)
    .slice(0, MAX_KENNZAHLEN);
  const an = (Array.isArray(annahmen) ? annahmen : [])
    .map((a) => (Array.isArray(a) ? [text(a[0], 80), text(a[1], 120)] : text(a, 240)))
    .filter((a) => (Array.isArray(a) ? a[0] && a[1] : a))
    .slice(0, MAX_ANNAHMEN);
  return {
    id: text(id, 60) || `${q}#${t}`.toLowerCase().replace(/[^a-z0-9äöüß/#-]+/g, "-").slice(0, 80),
    quelle: q,
    titel: t,
    kennzahlen: kz,
    annahmen: an,
    stand: text(stand, 40) || "",
    art: text(art, 40) || undefined,
    eingaben: eingabenSauber(eingaben),
    zeit: Number.isFinite(zeit) ? zeit : Date.now(),
  };
}

export const eintragGueltig = (e) => !!(e && typeof e === "object" && pfad(e.quelle) && text(e.titel) && Array.isArray(e.kennzahlen));

/** Alle Einträge (neueste zuerst). */
export function dossierLesen(speicher) {
  const s = speicherHolen(speicher);
  if (!s) return [];
  try {
    const roh = s.getItem(DOSSIER_SCHLUESSEL);
    const liste = roh ? JSON.parse(roh) : [];
    return (Array.isArray(liste) ? liste : []).filter(eintragGueltig).slice(0, DOSSIER_MAX);
  } catch {
    return [];
  }
}

function schreiben(liste, speicher) {
  const s = speicherHolen(speicher);
  if (!s) return false;
  try {
    s.setItem(DOSSIER_SCHLUESSEL, JSON.stringify(liste));
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") window.dispatchEvent(new CustomEvent(DOSSIER_EREIGNIS, { detail: { anzahl: liste.length } }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Eintrag ablegen: gleiche id ersetzt den alten Eintrag, sonst vorne einfügen; älteste fallen
 * über DOSSIER_MAX hinaus weg. Rückgabe: { ok, liste, ersetzt }.
 */
export function dossierHinzufuegen(roh, speicher) {
  const eintrag = eintragGueltig(roh) && roh.zeit ? roh : eintragErzeugen(roh || {});
  if (!eintrag) return { ok: false, liste: dossierLesen(speicher), ersetzt: false };
  const alt = dossierLesen(speicher);
  const ersetzt = alt.some((e) => e.id === eintrag.id);
  const liste = [eintrag, ...alt.filter((e) => e.id !== eintrag.id)].slice(0, DOSSIER_MAX);
  return { ok: schreiben(liste, speicher), liste, ersetzt };
}

export function dossierEntfernen(id, speicher) {
  const liste = dossierLesen(speicher).filter((e) => e.id !== id);
  schreiben(liste, speicher);
  return liste;
}

export function dossierLeeren(speicher) {
  schreiben([], speicher);
  return [];
}

export const dossierEnthaelt = (id, speicher) => dossierLesen(speicher).some((e) => e.id === id);
