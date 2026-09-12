// src/lib/ratgeber.js
//
// Zentrales Register aller Ratgeber-Artikel. Eine neue Seite wird HIER
// eingetragen - Uebersichtsseite, Sitemap, interne Verlinkung und die
// "Weitere Artikel"-Boxen ziehen sich alles aus diesem Array.
//
// WICHTIG: Nur Artikel eintragen, die es auch wirklich gibt
// (src/app/ratgeber/<slug>/page.js), sonst landen 404er in der Sitemap.
//
// Ratgeber-Inhalte sind deutschlandspezifisch und existieren NICHT auf
// oekovolt.com -> sie bekommen bewusst kein hreflang (siehe @/lib/hreflang).

export const RATGEBER_BASE = "/ratgeber";

export const ARTIKEL = [
  {
    slug: "wallbox-installation",
    title: "Wallbox Installation: Kosten, Voraussetzungen & Ablauf",
    kurzTitel: "Wallbox Installation",
    description:
      "Wallbox installieren lassen: Kosten ab 1.000 €, 11 oder 22 kW, technische Voraussetzungen, Meldepflicht und Förderung 2026 – vom Elektrofachbetrieb erklärt.",
    excerpt:
      "Eine 11-kW-Wallbox kostet mit Installation 1.000–2.700 €. Warum die Montage meist mehr ausmacht als das Gerät, wann 22 kW sinnvoll sind und was Sie melden müssen.",
    veroeffentlicht: "2026-09-12",
    aktualisiert: "2026-09-12",
    lesezeit: 10,
    kategorie: "Technik & Installation",
    bild: "/Images/Home/contactImage.jpg",
    bildAlt: "Wallbox-Installation durch einen Elektrofachbetrieb",
    keywords: [
      "Wallbox Installation",
      "Wallbox Installation Kosten",
      "Wallbox installieren lassen",
      "Wallbox Voraussetzungen",
      "Wallbox anmelden",
      "11 kW oder 22 kW Wallbox",
    ],
  },
  {
    slug: "solaranlage-kosten",
    title: "Was kostet eine Solaranlage 2026?",
    kurzTitel: "Solaranlage Kosten",
    description:
      "Was eine PV-Anlage 2026 kostet: Preise nach Anlagengröße, was im Komplettpreis steckt, Speicherkosten und laufende Ausgaben – transparent erklärt.",
    excerpt:
      "Rund 980 bis 1.450 Euro je kWp – aber woraus setzt sich der Preis zusammen, und was kommt an laufenden Kosten dazu? Mit Preistabelle nach Anlagengröße.",
    veroeffentlicht: "2026-09-12",
    aktualisiert: "2026-09-12",
    lesezeit: 9,
    kategorie: "Kosten & Wirtschaftlichkeit",
    bild: "/Images/Home/contactImage.jpg",
    bildAlt: "Montage einer Photovoltaikanlage auf einem Satteldach",
    keywords: [
      "Solaranlage Kosten",
      "Photovoltaik Kosten",
      "PV-Anlage Preis",
      "Solaranlage mit Speicher Kosten",
      "Photovoltaik Komplettpaket Preis",
      "Kosten pro kWp",
    ],
  },
  {
    slug: "einspeiseverguetung-2026",
    title: "Einspeisevergütung 2026: aktuelle Sätze in ct/kWh",
    // Kurzform fuer Karten und Breadcrumbs
    kurzTitel: "Einspeisevergütung 2026",
    description:
      "Wie hoch ist die Einspeisevergütung 2026? Alle aktuellen Sätze für Teil- und Volleinspeisung, wie lange sie gelten und was sich 2027 ändert – verständlich erklärt.",
    excerpt:
      "Seit dem 1. August 2026 gelten neue Sätze. Was Sie pro eingespeister Kilowattstunde bekommen, wie lange die Vergütung garantiert ist und warum 2027 alles anders werden könnte.",
    veroeffentlicht: "2026-09-11",
    aktualisiert: "2026-09-11",
    lesezeit: 8,
    kategorie: "Förderung & Vergütung",
    // Bild aus /public
    bild: "/Images/Home/contactImage.jpg",
    bildAlt: "Photovoltaikanlage auf einem Wohnhausdach",
    keywords: [
      "Einspeisevergütung 2026",
      "Einspeisevergütung",
      "EEG Vergütung 2026",
      "Einspeisevergütung Photovoltaik",
      "Volleinspeisung",
      "Überschusseinspeisung",
      "ct pro kWh Einspeisung",
    ],
  },
];

/** Alle Artikel, neueste zuerst */
export function alleArtikel() {
  return [...ARTIKEL].sort(
    (a, b) => new Date(b.veroeffentlicht) - new Date(a.veroeffentlicht)
  );
}

export function artikelNachSlug(slug) {
  return ARTIKEL.find((a) => a.slug === slug) ?? null;
}

/** Andere Artikel fuer die "Das könnte Sie auch interessieren"-Box */
export function weitereArtikel(slug, limit = 3) {
  return alleArtikel()
    .filter((a) => a.slug !== slug)
    .slice(0, limit);
}

export function artikelPfad(slug) {
  return `${RATGEBER_BASE}/${slug}`;
}

/** Deutsches Datum: "2026-09-11" -> "11. September 2026" */
export function datumLang(iso) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
