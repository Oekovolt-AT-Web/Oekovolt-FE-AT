// Ereignisse für die Statistik:
// - Google Analytics nur, wenn der Besucher der Statistik zugestimmt hat
//   (window.gtag existiert erst nach Einwilligung, siehe components/Statistik/GoogleAnalytics.js).
// - Umami (cookielos, selbst gehostet, siehe components/Statistik/Umami.js) – nur wenn das Skript
//   geladen ist (UMAMI_SCRIPT_URL/UMAMI_WEBSITE_ID gesetzt). Keine Cookies, kein Browserspeicher.
// Niemals personenbezogene Daten übergeben (keine Namen, E-Mails, Telefonnummern, Tokens).

const ERLAUBT = /^[a-z0-9_]{2,40}$/;

/** Nur einfache Werte übernehmen, Schlüssel und Texte kürzen. */
function bereinigen(daten) {
  if (!daten) return undefined;
  return Object.fromEntries(
    Object.entries(daten)
      .filter(([, v]) => ["string", "number", "boolean"].includes(typeof v))
      .map(([k, v]) => [k.slice(0, 40), typeof v === "string" ? v.slice(0, 80) : v])
  );
}

export function ereignis(name, daten) {
  if (typeof window === "undefined" || !ERLAUBT.test(name)) return;
  let sauber;
  try {
    sauber = bereinigen(daten);
    if (window.ovGaGeladen) window.gtag?.("event", name, sauber);
  } catch {
    /* Statistik darf nie stören */
  }
  try {
    if (typeof window.umami?.track === "function") window.umami.track(name, sauber);
  } catch {
    /* Statistik darf nie stören */
  }
}
