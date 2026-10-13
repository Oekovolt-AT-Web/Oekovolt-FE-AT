// src/data/hero.js
//
// Kernbotschaften der Startseite (Österreich) – getrennt vom Markup, damit
// Texte ohne Eingriff in die Komponenten geändert werden können.
//
// Nur belegte Aussagen (Stand 10/2026, Welle A02 – Belegakte src/data/werbeaussagen.js):
// seit 2012 in Österreich, Gründer betreiben eigene Solarparks, eigene Montageteams und Leittechnik.
// NICHT mehr im Hero: die Top-Drei-Rangaussage (EPC-Errichter 2021) (kein Beleg, Schalter AUS) und die Salzburg AG
// (Gesellschafterin, aber kein Werbeargument – Inhaber-Entscheidung 05.10.2026).
// Unternehmenskennzahlen (5.000 Anlagen, 510.000 kWp) laut Geschäftsführung Ökovolt Österreich
// (bestätigt 30.09.2026) – zentral in src/data/kennzahlen.js, immer mit Hinweis und Stand.

import { KENNZAHLEN, zahlText } from "./kennzahlen.js";
import { LEAD, PARKREGLER_KURZ } from "./marke.js";
import { werbeaussageAktiv } from "./werbeaussagen.js";

export const HOME_HERO = {
  kicker: "Ökovolt Österreich · seit 2012",
  kickerZusatz: "Planung · Bau · Betrieb",
  lead: LEAD,
  punkte: ["Planung, Bau & Betrieb aus einer Hand", PARKREGLER_KURZ, "Gründer betreiben seit 2012 eigene Solarparks"],
  // Standbild aus dem Ökovolt-Imagevideo (Hallendach eines Industriekunden während der Montage),
  // oben beschnitten – ohne Kundenlogo. Trägt das LCP.
  bild: "/Images/AT/home/hero-gewerbedach-luftbild.jpg",
  alt: "Luftaufnahme: Photovoltaik-Montage auf dem Flachdach einer Industriehalle, im Hintergrund Lkw-Rampen und Werksgelände",
  // Hintergrundvideo (nur Desktop): zeigt das Werk eines Industriekunden mit dessen Logo. Bis zur
  // Logo-/Veröffentlichungsfreigabe (Belegakte „kundenlogo-hero-video“, Referenz Freigabe A07) AUS –
  // `null` schaltet das Video ab, das Standbild bleibt.
  video: werbeaussageAktiv("kundenlogo-hero-video") ? "/Images/Navbar/intro.mp4" : null,
};

/**
 * Kennzahlenleiste unter dem Hero. `zahl` zählt beim Einblenden hoch (CountUp),
 * `wert` ist der Klartext (SEO, Screenreader). Jahreszahlen zählen bewusst nicht hoch.
 * Nur Gesamtzahlen aus src/data/kennzahlen.js; der Rang-Eintrag ist entfernt (kein Beleg).
 */
export const KERNFAKTEN = KENNZAHLEN.map((k) => ({ wert: `${zahlText(k.zahl)}${k.suffix}`, zahl: k.zahl, suffix: k.suffix, label: k.label }));

/**
 * Referenzen: öffentlich auf oekovolt.com gelistete Projekte (Stand 09/2026).
 * Kundennamen erscheinen erst mit freigabe.name === true (Referenz Freigabe, Welle A07 – Einmal-Link
 * aus dem Backoffice). Bis dahin zeigt die Website nur Branche und Bundesland (`anonym`, aus den
 * öffentlichen Unternehmensangaben in src/data/kunden.js). Entscheidung des Inhabers steht aus.
 * Reine Namensliste – keine Logos, keine Leistungsangaben.
 */
export const REFERENZ_KUNDEN = [
  { name: "ALPLA Werke Alwin Lehner", branche: "Industrie", slug: "alpla-werke-alwin-lehner-gmbh-co-kg", anonym: "Kunststoffverpackungen, Vorarlberg", freigabe: { name: false } },
  { name: "Andritz Fabrics and Rolls", branche: "Industrie", slug: "andritz-fabrics-and-rolls-gmbh", anonym: "Maschinenbau, Niederösterreich", freigabe: { name: false } },
  { name: "Hammerer Aluminium Industries", branche: "Industrie", slug: "hammerer-aluminium-industries-holding-gmbh", anonym: "Aluminiumverarbeitung, Oberösterreich", freigabe: { name: false } },
  { name: "B&R Industrial Automation", branche: "Industrie", slug: "br-industrial-automation-gmbh", anonym: "Industrieautomation, Oberösterreich", freigabe: { name: false } },
  { name: "Steinbacher Dämmstoff", branche: "Industrie", slug: "steinbacher-daemmstoff-gmbh", anonym: "Dämmstoffe, Tirol", freigabe: { name: false } },
  { name: "Sunpor Kunststoff", branche: "Industrie", slug: "sunpor-kunststoff-gmbh", anonym: "Kunststoffhersteller, Niederösterreich", freigabe: { name: false } },
  { name: "Austria Card", branche: "Industrie", slug: "austria-card-plastikkarten-und-ausweissysteme-gmbh", anonym: "Kartenhersteller, Wien", freigabe: { name: false } },
  { name: "Ziegler Stahlbau", branche: "Industrie", slug: "ziegler-stahlbau-gmbh", anonym: "Stahl- und Metallbau, Salzburg", freigabe: { name: false } },
  { name: "Fischer Parkett", branche: "Holz", slug: "fischer-parkett-gmbh-co-kg", anonym: "Parkettwerk, Salzburg", freigabe: { name: false } },
  { name: "Neuschmied Holz", branche: "Holz", slug: "neuschmied-holz-gmbh", anonym: "Sägewerk, Tirol", freigabe: { name: false } },
  { name: "Wieser Holz", branche: "Holz", slug: "wieser-holz-gmbh", anonym: "Holzverpackungen, Niederösterreich", freigabe: { name: false } },
  { name: "Würth Handelsges.m.b.H.", branche: "Handel", slug: "wuerth-handelsgesmbh", anonym: "Fachhandel, Niederösterreich", freigabe: { name: false } },
  { name: "Herba Chemosan Apotheker-AG", branche: "Handel", slug: "herba-chemosan-apotheker-ag", anonym: "Pharmagroßhandel, Wien", freigabe: { name: false } },
  { name: "Transdanubia Spedition, Pasching", branche: "Logistik", slug: "transdanubia-speditionsgesellschaft-mbh-pasching", anonym: "Spedition, Oberösterreich", freigabe: { name: false } },
  { name: "Sporthotel Brixen", branche: "Tourismus", slug: "sporthotel-brixen-gmbh-co-kg", anonym: "Sporthotel, Tirol", freigabe: { name: false } },
  { name: "FS Agrar", branche: "Landwirtschaft", slug: "fs-agrar-gmbh", anonym: "Agrarbetrieb", freigabe: { name: false } },
];

/**
 * Öffentliche Sicht auf die Referenzliste (Startseite, Referenzseiten, TV): ohne Namensfreigabe
 * steht in `name` die anonyme Bezeichnung und `slug` ist null (kein Link auf die Projektseite,
 * die den Namen zeigt). `freigegeben` sagt den Komponenten, ob ein echter Name vorliegt.
 */
export const REFERENZ_UNTERNEHMEN = REFERENZ_KUNDEN.map((r) => {
  const freigegeben = r.freigabe?.name === true;
  return { name: freigegeben ? r.name : r.anonym, branche: r.branche, slug: freigegeben ? r.slug : null, freigegeben };
});

/** Branchen der Referenzliste in Reihenfolge des ersten Auftretens (für „Auswahl aus 6 Branchen“). */
export const REFERENZ_BRANCHEN = [...new Set(REFERENZ_KUNDEN.map((r) => r.branche))];

// Slider-Inhalte für die (derzeit nicht eingebundene) Komponente Home/HeroSlider.
export const HERO_SLIDES = [
  {
    id: "gewerbe",
    kicker: HOME_HERO.kicker,
    titel: "Photovoltaik für Gewerbe & Industrie in ganz Österreich",
    text: "Planung, Bau und Betrieb aus einer Hand – vom Elektrotechnik-Fachbetrieb aus Ostermiething.",
    bild: HOME_HERO.bild,
    alt: HOME_HERO.alt,
    primaer: { href: "/angebot", label: "Ersteinschätzung anfordern" },
    sekundaer: { href: "/kontakt", label: "Kontakt" },
  },
  {
    id: "technik",
    kicker: "Regelung und Leittechnik",
    titel: "Parkregler, Fernwartung und SCADA – betreut von uns",
    text: "Netzkonform nach TOR Erzeuger – und im Betrieb jederzeit im Blick.",
    bild: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg",
    alt: "Photovoltaikanlage mit Technik zur Anlagenüberwachung (Symbolbild)",
    primaer: { href: "/technik", label: "Technik ansehen" },
    sekundaer: { href: "/technik/parkregler", label: "Parkregler" },
  },
  {
    id: "referenzen",
    kicker: "Referenzen",
    titel: "Industrie, Holz, Handel, Logistik und Tourismus",
    text: "Unternehmen in ganz Österreich erzeugen mit Ökovolt ihren eigenen Strom.",
    bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
    alt: "Photovoltaikanlagen auf Gewerbedächern, Luftaufnahme",
    primaer: { href: "/referenzen/projekte", label: "Projekte ansehen" },
    sekundaer: { href: "/uber-uns", label: "Über uns" },
  },
];

/** Wie lange ein Slide steht, bevor automatisch gewechselt wird (ms). */
export const HERO_INTERVALL = 7000;
