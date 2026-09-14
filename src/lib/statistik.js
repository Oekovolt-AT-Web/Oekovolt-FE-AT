// Anonyme Ereignisse für die cookielose Statistik (Umami).
// Niemals personenbezogene Daten übergeben (keine Namen, E-Mails, Telefonnummern, Tokens).

const ERLAUBT = /^[a-z0-9_]{2,40}$/;

export function ereignis(name, daten) {
  if (typeof window === "undefined" || !ERLAUBT.test(name)) return;
  try {
    const sauber = daten
      ? Object.fromEntries(
          Object.entries(daten)
            .filter(([, v]) => ["string", "number", "boolean"].includes(typeof v))
            .map(([k, v]) => [k.slice(0, 40), typeof v === "string" ? v.slice(0, 80) : v])
        )
      : undefined;
    window.umami?.track(name, sauber);
  } catch {
    /* Statistik darf nie stören */
  }
}
