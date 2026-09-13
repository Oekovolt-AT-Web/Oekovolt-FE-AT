// Themen für Push-Benachrichtigungen (Browser und Server). Muss zu „Push Nachricht.thema“ in Frappe passen.
export const PUSH_THEMEN = [
  { id: "news", label: "Unternehmensnews & Presse" },
  { id: "ratgeber", label: "Neue Ratgeber-Artikel" },
  { id: "foerderung", label: "Förderungen & Gesetzesänderungen" },
  { id: "aktionen", label: "Aktionen & Veranstaltungen" },
  { id: "jobs", label: "Neue Stellenangebote" },
];

export const PUSH_THEMEN_IDS = PUSH_THEMEN.map((t) => t.id);

// Nur echte Push-Dienste der Browserhersteller zulassen (Schutz vor Missbrauch des Servers als Proxy)
const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/, /^web\.push\.apple\.com$/, /\.push\.apple\.com$/, /^android\.googleapis\.com$/];

export function pushEndpointErlaubt(endpoint) {
  try {
    const u = new URL(endpoint);
    return u.protocol === "https:" && PUSH_HOSTS.some((r) => r.test(u.hostname));
  } catch {
    return false;
  }
}
