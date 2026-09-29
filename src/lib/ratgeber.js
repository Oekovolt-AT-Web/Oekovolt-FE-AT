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
    veroeffentlicht: "2026-09-28",
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

/* ------------------------------------------------------------------
   Anzeige-Helfer (Übersicht, Filter, Artikel-Layout)
   ------------------------------------------------------------------ */

/** URL-taugliche Kennung eines Themenbereichs, z. B. "Technik & Planung" -> "technik-planung". */
export function kategorieSlug(kategorie = "") {
  return kategorie
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Link auf die gefilterte Übersicht eines Themenbereichs. */
export function kategoriePfad(kategorie) {
  return `${RATGEBER_BASE}?thema=${kategorieSlug(kategorie)}#alle-artikel`;
}

/**
 * Slugs der Artikel, die als „Neu“ markiert werden: veröffentlicht in den
 * letzten `tage` Tagen, höchstens `max` Stück (neueste zuerst). So bleibt das
 * Abzeichen aussagekräftig, auch wenn viele Artikel am selben Tag erscheinen.
 */
export function neueSlugs(liste = alleArtikel(), { tage = 21, max = 6, heute = new Date() } = {}) {
  const grenze = heute.getTime() - tage * 86400000;
  return new Set(
    [...liste]
      .filter((a) => new Date(a.veroeffentlicht).getTime() >= grenze)
      .sort((a, b) => new Date(b.veroeffentlicht) - new Date(a.veroeffentlicht) || (b.woerter || 0) - (a.woerter || 0))
      .slice(0, max)
      .map((a) => a.slug)
  );
}

/** Rechner & Tools, die zu Ratgeber-Themen passen (Ziele siehe NAVIGATION „Rechner“). */
export const RECHNER = {
  "gewerbe-pv": { href: "/rechner/gewerbe-pv", titel: "Gewerbe-PV-Rechner", text: "Ertrag, Eigenverbrauch und Amortisation für Ihr Hallen- oder Bürodach – mit österreichischen Netz- und Energiepreisen.", label: "Gewerbe-PV berechnen", icon: "Warehouse" },
  "peak-shaving": { href: "/rechner/peak-shaving", titel: "Peak-Shaving-Rechner", text: "Wie viel Leistungspreis spart ein Speicher, der Ihre Lastspitzen kappt? Mit Netzentgelten 2026 je Netzbereich.", label: "Lastspitzen berechnen", icon: "Gauge" },
  stromspeicher: { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Die passende Speichergröße für Ihren Verbrauch – Eigenverbrauch, Autarkie und Wirtschaftlichkeit auf einen Blick.", label: "Speicher dimensionieren", icon: "BatteryCharging" },
  energiegemeinschaft: { href: "/rechner/energiegemeinschaft", titel: "Energiegemeinschaft-Rechner", text: "Was bringen reduzierte Netzentgelte und ein fairer Innenpreis für Erzeuger und Mitglieder einer EEG?", label: "EEG durchrechnen", icon: "Share2" },
  blackout: { href: "/rechner/blackout", titel: "Blackout-Rechner", text: "Ausfallkosten Ihres Betriebs gegen Ersatzstrom aus PV, Speicher und Aggregat – als Grundlage für die Entscheidung.", label: "Ausfallrisiko berechnen", icon: "ShieldAlert" },
  "co2-esg": { href: "/rechner/co2-esg", titel: "CO₂- & ESG-Rechner", text: "Scope-2-Einsparung Ihrer PV-Anlage in Tonnen CO₂ – nachvollziehbar für Nachhaltigkeitsbericht und Kunden.", label: "CO₂ berechnen", icon: "Leaf" },
  "freiflaeche-pacht": { href: "/rechner/freiflaeche-pacht", titel: "Freiflächen- & Pachtrechner", text: "Was bringt Ihre Fläche als Solarpark – Pacht, Beteiligung oder eigene Anlage im Vergleich?", label: "Fläche bewerten", icon: "Sun" },
  "e-flotte": { href: "/rechner/e-flotte", titel: "E-Flotte-Rechner", text: "Was kostet Ihre Firmenflotte elektrisch – geladen mit Solarstrom vom eigenen Dach statt an der Tankstelle?", label: "Flotte berechnen", icon: "Car" },
  wallbox: { href: "/rechner/wallbox", titel: "Wallbox-Rechner", text: "Ladeleistung, Kosten und PV-Überschussladen – was Ihre Wallbox im Alltag leisten muss.", label: "Wallbox berechnen", icon: "PlugZap" },
  "dynamischer-stromtarif": { href: "/rechner/dynamischer-stromtarif", titel: "Spotpreis-Rechner", text: "Börsenpreise Österreich mit Ihrem Verbrauch durchrechnen – lohnt sich ein dynamischer Tarif?", label: "Tarif vergleichen", icon: "Activity" },
  waermepumpe: { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizlast, Stromverbrauch und Solaranteil Ihrer Wärmepumpe – als erste Orientierung.", label: "Wärmepumpe berechnen", icon: "Thermometer" },
  standort: { href: "/standort-check", titel: "Standort-Check (eHORA)", text: "Schneelast, Wind, Hagel und Ertrag für Ihre Adresse in Österreich – auf Basis von HORA und PVGIS.", label: "Standort prüfen", icon: "Mountain" },
  foerdercheck: { href: "/foerdercheck", titel: "Förder-Check", text: "EAG-Investitionszuschuss, Investitionsfreibetrag und Landesförderungen – die passenden Programme in 30 Sekunden.", label: "Förderung prüfen", icon: "BadgeEuro" },
  solarrechner: { href: "/solarrechner", titel: "Solarrechner", text: "Anlagengröße, Ertrag und Amortisation für Ihr Dach – für Gewerbe, Landwirtschaft und Eigenheim.", label: "Solarrechner starten", icon: "Calculator" },
};

const RECHNER_REGELN = [
  [/peak-shaving|leistungspreis|regelenergie|energiemanagement/, "peak-shaving"],
  [/blackout|notstrom/, "blackout"],
  [/csrd|esg/, "co2-esg"],
  [/freiflaech|agri-pv|floating|ppa/, "freiflaeche-pacht"],
  [/energiegemeinschaft|gemeinschaftliche|smart-meter/, "energiegemeinschaft"],
  [/e-flotte|bidirektional|ueberschussladen|solarcarport/, "e-flotte"],
  [/wallbox/, "wallbox"],
  [/dynamischer|negative-strompreise/, "dynamischer-stromtarif"],
  [/waermepumpe/, "waermepumpe"],
  [/speicher|eigenverbrauch/, "stromspeicher"],
  [/schneelast|hagel|winter|verschattung|ost-west|ertrag|flachdach|fassade/, "standort"],
  [/eag|investitionsfreibetrag|steuern|foerder|solarpflicht|leasing/, "foerdercheck"],
  [/groesse-berechnen|lohnt-sich|amortisation|kosten|angebot/, "gewerbe-pv"],
];

const RECHNER_JE_KATEGORIE = {
  "Kosten & Wirtschaftlichkeit": "gewerbe-pv",
  "Förderung, Steuern & Recht": "foerdercheck",
  "Netz, Energiegemeinschaften & Markt": "energiegemeinschaft",
  "Technik & Planung": "standort",
  "Speicher & Eigenverbrauch": "stromspeicher",
  "E-Mobilität & Sektorkopplung": "e-flotte",
};

/** Passender Rechner zu einem Artikel – erst nach Thema (Slug), dann nach Themenbereich. */
export function passenderRechner(artikel) {
  if (!artikel) return null;
  const treffer = RECHNER_REGELN.find(([re]) => re.test(artikel.slug));
  const id = treffer ? treffer[1] : RECHNER_JE_KATEGORIE[artikel.kategorie] || "gewerbe-pv";
  return { id, ...RECHNER[id] };
}
