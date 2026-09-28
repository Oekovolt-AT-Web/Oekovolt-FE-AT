// Öffentliche Fediverse-Konten der Website (ActivityPub) – ohne Geheimnisse, auch im Browser nutzbar.
// Folgen möglich von Mastodon, Threads (mit aktivierter Fediverse-Freigabe), Pixelfed, Friendica, Misskey …

export const HANDLE_DOMAIN = "oekovolt.com";

export const FEDIVERSE_KONTEN = [
  {
    name: "oekovolt",
    titel: "Ökovolt – News & Presse",
    kurz: "News & Presse",
    text: "Pressemitteilungen, Projekte und Neuigkeiten aus dem Unternehmen – auch für Kommunen, Stadtwerke und Partner.",
    profilPfad: "/presse",
  },
  {
    name: "ratgeber",
    titel: "Ökovolt Ratgeber",
    kurz: "Fachartikel",
    text: "Neue Fachartikel zu Photovoltaik, Speicher, Wärmepumpe, Förderung und Recht.",
    profilPfad: "/ratgeber",
  },
];

export const handle = (name) => `@${name}@${HANDLE_DOMAIN}`;
