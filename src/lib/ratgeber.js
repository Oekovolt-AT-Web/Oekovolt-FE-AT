// src/lib/ratgeber.js
//
// Zentrales Register aller Ratgeber-Artikel. Eine neue Seite wird HIER
// eingetragen - Uebersichtsseite, Sitemap, interne Verlinkung und die
// "Weitere Artikel"-Boxen ziehen sich alles aus diesem Array.
//
// WICHTIG: Nur Artikel eintragen, die es auch wirklich gibt
// (src/app/ratgeber/<slug>/page.js), sonst landen 404er in der Sitemap.
//
// Ratgeber-Inhalte sind österreichspezifisch (Rechtslage, Förderung, Steuern AT)
// und haben kein inhaltsgleiches Gegenstück auf oekovolt.de -> sie bekommen
// bewusst kein hreflang, nur ein Canonical auf oekovolt.com (siehe @/lib/hreflang).

import { INHALTE } from "@/content/ratgeber";

export const RATGEBER_BASE = "/ratgeber";

// Feste Themenbereiche – für Filter auf der Übersicht und thematische Cluster.
export const KATEGORIEN = [
  "Kosten & Wirtschaftlichkeit",
  "Förderung, Steuern & Recht",
  "Netz, Energiegemeinschaften & Markt",
  "Technik & Planung",
  "Speicher & Eigenverbrauch",
  "E-Mobilität & Sektorkopplung",
];

// Handgebaute Artikel mit eigener Seite unter src/app/ratgeber/<slug>/page.js
const STATISCHE_ARTIKEL = [
  {
    slug: "wallbox-installation",
    title: "Wallbox Installation in Österreich: Kosten, Anmeldung, Ablauf",
    kurzTitel: "Wallbox Installation",
    description:
      "Wallbox installieren lassen in Österreich: 11 oder 22 kW, Voraussetzungen, Meldung beim Netzbetreiber, Lastmanagement und Förderung – für Betrieb und Eigenheim.",
    excerpt:
      "Was eine Wallbox mit Installation kostet, wann 22 kW sinnvoll sind, was Sie dem Netzbetreiber melden müssen und wie Lastmanagement und PV-Überschussladen zusammenspielen.",
    veroeffentlicht: "2026-09-12",
    aktualisiert: "2026-09-28",
    lesezeit: 10,
    kategorie: "E-Mobilität & Sektorkopplung",
    bild: "/Images/Dienstleistungen/Smartphone/wallbox-scaled.jpg",
    bildAlt: "Wallbox an der Außenwand eines modernen Einfamilienhauses",
    keywords: [
      "Wallbox Installation",
      "Wallbox Installation Kosten",
      "Wallbox installieren lassen Österreich",
      "Wallbox Voraussetzungen",
      "Wallbox Netzbetreiber melden",
      "11 kW oder 22 kW Wallbox",
    ],
  },
  {
    slug: "solaranlage-kosten",
    title: "Photovoltaik Kosten Österreich 2026: Preise je kWp",
    kurzTitel: "Photovoltaik Kosten",
    description:
      "Photovoltaik Kosten in Österreich 2026: €/kWp von 10 kWp bis Megawatt, Speicher, Netzanschluss, laufende Kosten und Förderung – für Betriebe und Private.",
    excerpt:
      "Von rund 1.300 €/kWp netto beim Einfamilienhaus bis 500–650 €/kWp bei Megawatt-Freiflächen: Was eine PV-Anlage in Österreich 2026 kostet, was im Preis steckt und was laufend dazukommt.",
    veroeffentlicht: "2026-09-12",
    aktualisiert: "2026-09-28",
    lesezeit: 12,
    kategorie: "Kosten & Wirtschaftlichkeit",
    bild: "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg",
    bildAlt: "Monteur befestigt ein Solarmodul an der Unterkonstruktion",
    keywords: [
      "Photovoltaik Kosten Österreich",
      "PV-Anlage Kosten pro kWp",
      "Photovoltaik Gewerbe Kosten",
      "PV-Anlage 100 kWp Kosten",
      "Photovoltaik mit Speicher Kosten",
      "Photovoltaik laufende Kosten",
    ],
  },
  {
    slug: "einspeiseverguetung-2026",
    title: "Einspeisetarif Österreich 2026: OeMAG, Versorger & Direktvermarktung",
    // Kurzform fuer Karten und Breadcrumbs
    kurzTitel: "Einspeisetarif 2026",
    description:
      "Einspeisetarif Österreich 2026: OeMAG-Marktpreis je Monat und Quartal, Tarife der Energieversorger, Überschusseinspeisung, Direktvermarktung und PPA im Gewerbe.",
    excerpt:
      "Was bringt eingespeister Solarstrom 2026 in Österreich? OeMAG-Marktpreis mit allen Monats- und Quartalswerten, Modelle der Energieversorger und was für Gewerbeanlagen gilt.",
    veroeffentlicht: "2026-09-28",
    aktualisiert: "2026-09-28",
    lesezeit: 12,
    kategorie: "Netz, Energiegemeinschaften & Markt",
    // Bild aus /public
    bild: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
    bildAlt: "Photovoltaikanlage auf mehreren Dachflächen – Luftaufnahme",
    keywords: [
      "Einspeisetarif Österreich 2026",
      "OeMAG Marktpreis 2026",
      "Einspeisevergütung Österreich",
      "Überschusseinspeisung",
      "Einspeisetarif Photovoltaik",
      "Direktvermarktung Photovoltaik Österreich",
      "Marktpreis § 41 ÖSG",
    ],
  },
];

// Inhaltsgetriebene Artikel (src/content/ratgeber/*.js) – gerendert über
// src/app/ratgeber/[slug]/page.js. Lesezeit wird aus der Wortzahl berechnet.
function zaehleWoerter(x) {
  if (typeof x === "string") return x.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").split(/\s+/).filter(Boolean).length;
  if (Array.isArray(x)) return x.reduce((s, y) => s + zaehleWoerter(y), 0);
  if (x && typeof x === "object") {
    return Object.entries(x).reduce((s, [k, v]) => (["id", "typ", "variant", "href", "url"].includes(k) ? s : s + zaehleWoerter(v)), 0);
  }
  return 0;
}

export const INHALTS_ARTIKEL = INHALTE.map((a) => ({
  ...a,
  inhaltsgetrieben: true,
  woerter: zaehleWoerter([a.kurzFazit, a.abschnitte, a.faq]),
  lesezeit: Math.max(3, Math.round(zaehleWoerter([a.kurzFazit, a.abschnitte, a.faq]) / 200)),
}));

export const ARTIKEL = [...STATISCHE_ARTIKEL, ...INHALTS_ARTIKEL];

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
  // Zuerst Artikel aus demselben Themenbereich (thematisches Cluster), dann die neuesten.
  const eigener = artikelNachSlug(slug);
  const andere = alleArtikel().filter((a) => a.slug !== slug);
  const gleich = eigener ? andere.filter((a) => a.kategorie === eigener.kategorie) : [];
  const rest = andere.filter((a) => !gleich.includes(a));
  return [...gleich, ...rest].slice(0, limit);
}

/** Artikel eines Themenbereichs (für Cluster-Seiten und Übersicht). */
export function artikelNachKategorie(kategorie) {
  return alleArtikel().filter((a) => a.kategorie === kategorie);
}

export function artikelPfad(slug) {
  return `${RATGEBER_BASE}/${slug}`;
}

/** Österreichisches Datum: "2026-01-11" -> "11. Jänner 2026" */
export function datumLang(iso) {
  return new Date(iso).toLocaleDateString("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
