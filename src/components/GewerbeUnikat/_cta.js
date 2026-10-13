// src/components/GewerbeUnikat/_cta.js
//
// EIN Haupt-CTA für die ganze Unikat-Seite /gewerbe (Jury 13.10.2026: gleiches Label, gleiches Ziel in
// Seitenkopf, Daumenleiste, Kapiteln und Abschluss-Band). Der Termin ist der klar benannte Zweitweg.
// Rein (ohne Hooks, ohne "use client") – in Server- und Client-Komponenten verwendbar.
//
// thema: nur Werte, die der Angebots-Konfigurator kennt (THEMA_WERTE in src/lib/api/anfrage/create_anfrage.js),
// z. B. "lastgang", "speicher", "netzanmeldung". Die Netzebene (ne=) liest der Konfigurator heute nicht.

/** Beschriftung des Haupt-CTA – überall gleich. */
export const HAUPT_CTA = "Ersteinschätzung anfragen";
/** Zusatz unter bzw. neben dem Haupt-CTA (der Lastgang ist keine Voraussetzung). */
export const HAUPT_ZUSATZ = "mit oder ohne Lastgang";
/** Ziel des Haupt-CTA ohne Steckbrief-Werte. */
export const HAUPT_HREF = "/angebot?objekt=gewerbe";
/** Zweitweg: Erstgespräch per Video. */
export const TERMIN_CTA = { label: "Lieber erst ein Videogespräch", href: "/termin?art=video&thema=gewerbe" };

/** Hängt ?thema=… an einen Anfrage-Link an (ersetzt ein vorhandenes thema). */
export function mitThema(href, thema) {
  if (!thema) return href;
  const [pfad, query = ""] = String(href).split("?");
  const q = new URLSearchParams(query);
  q.set("thema", thema);
  return `${pfad}?${q.toString()}`;
}
