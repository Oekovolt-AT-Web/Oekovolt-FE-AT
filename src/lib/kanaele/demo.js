// Nur für die lokale Entwicklung (KANAL_DEMO=1 und NODE_ENV !== "production"):
// Beispiel-Einträge, damit Newsroom, Feeds und Info-Bildschirm ohne Backoffice getestet werden können.
// Wird im Produktivbetrieb niemals verwendet.

export const demoAktiv = () => process.env.KANAL_DEMO === "1" && process.env.NODE_ENV !== "production";

const heute = new Date();
const tage = (n) => new Date(heute.getTime() - n * 86400000).toISOString();

export const DEMO = [
  {
    slug: "demo-beispielmeldung-speicher",
    titel: "[DEMO] Beispielmeldung: Neues Speicherangebot für Gewerbekunden",
    kategorie: "Produkt & Technik",
    veroeffentlicht_am: tage(1),
    teaser: "Dies ist ein Platzhaltertext für die lokale Vorschau des Newsrooms und des Info-Bildschirms – keine echte Meldung.",
    inhalt: "<p>Platzhalter für die Entwicklung. Echte Inhalte werden im Backoffice unter <strong>Veröffentlichung</strong> gepflegt.</p><h2>Zwischenüberschrift</h2><ul><li>Punkt eins</li><li>Punkt zwei</li></ul>",
    bild: "/Images/Ratgeber/stromspeicher-groesse.jpg",
    bild_alt: "Stromspeicher an einer Hauswand",
    auf_website: 1, im_rss_feed: 1, auf_tv: 1, im_fediverse: 1,
    tv_dauer_sekunden: 12, tv_hervorhebung: "Neu", hashtags: "Stromspeicher Gewerbe",
  },
  {
    slug: "demo-beispielmeldung-kommunen",
    titel: "[DEMO] Beispielmeldung: Leitfaden Photovoltaik für Kommunen",
    kategorie: "Kommunen & Stadtwerke",
    veroeffentlicht_am: tage(4),
    teaser: "Platzhalter: So könnte ein Leitfaden für Kommunen, Stadtwerke und Klimaschutzmanager angekündigt werden.",
    inhalt: "<p>Platzhalter für die Entwicklung.</p>",
    bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
    bild_alt: "Photovoltaik auf Reihenhausdächern",
    auf_website: 1, im_rss_feed: 1, auf_tv: 1, im_fediverse: 1,
    tv_dauer_sekunden: 12, hashtags: "Kommunen Stadtwerke Energiewende",
  },
  {
    slug: "demo-beispielmeldung-presse",
    titel: "[DEMO] Beispiel-Pressemitteilung mit längerem Titel zur Prüfung des Zeilenumbruchs",
    kategorie: "Pressemitteilung",
    veroeffentlicht_am: tage(9),
    teaser: "Platzhalter-Teaser einer Pressemitteilung.",
    inhalt: "<p>Platzhalter für die Entwicklung.</p>",
    bild: "/Images/Ratgeber/photovoltaik-im-winter.jpg",
    bild_alt: "Solarmodule mit Schnee",
    auf_website: 1, im_rss_feed: 1, auf_tv: 0, im_fediverse: 1,
  },
];
