// src/data/hero.js
//
// Kernbotschaften der Startseite (Österreich) – getrennt vom Markup, damit
// Texte ohne Eingriff in die Komponenten geändert werden können.
//
// Nur belegte Aussagen (Stand 09/2026, siehe docs/AT-BRIEFING.md):
// seit 2012 in Österreich, 2021 rund 30 MWp errichtet und TOP 3 der
// IPC-Errichter Österreichs, Salzburg AG als Gesellschafterin (49 %),
// eigene Regelungs-/Leittechnik, Gründer betreiben eigene Solarparks.
// KEINE Gruppen-Kennzahlen der deutschen Website übernehmen.

export const HOME_HERO = {
  kicker: "Ökovolt Österreich · seit 2012",
  kickerZusatz: "Planung · Bau · Betrieb",
  lead:
    "Photovoltaik für Gewerbe, Industrie, Landwirtschaft und Gemeinden in ganz Österreich – geplant nach Ihrem Lastgang, gebaut vom eigenen Elektrotechnik-Fachbetrieb und betrieben mit eigener Regelungs- und Leittechnik.",
  punkte: ["Planung, Bau & Betrieb aus einer Hand", "Eigener Parkregler, Fernwartung & SCADA", "Gesellschafterin: Salzburg AG (49 %)"],
  bild: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
  alt: "Photovoltaikanlage auf den Dächern einer Freizeit- und Badeanlage am Fuschlsee (Salzburg), Luftaufnahme",
};

/** Kennzahlenleiste unter dem Hero – bewusst als Text (keine hochzählenden Jahreszahlen). */
export const KERNFAKTEN = [
  { wert: "2012", label: "in Österreich tätig – aus Ostermiething (OÖ)" },
  { wert: "30 MWp", label: "PV-Leistung errichtet allein im Jahr 2021" },
  { wert: "TOP 3", label: "der IPC-Errichter Österreichs 2021" },
  { wert: "49 %", label: "hält die Salzburg AG an Ökovolt Österreich" },
];

/**
 * Referenzen: öffentlich auf oekovolt.com gelistete Projekte (Stand 09/2026).
 * Reine Namensliste – keine Logos, keine Leistungsangaben.
 */
export const REFERENZ_UNTERNEHMEN = [
  { name: "ALPLA Werke Alwin Lehner", branche: "Industrie", slug: "alpla-werke-alwin-lehner-gmbh-co-kg" },
  { name: "Andritz Fabrics and Rolls", branche: "Industrie", slug: "andritz-fabrics-and-rolls-gmbh" },
  { name: "Hammerer Aluminium Industries", branche: "Industrie", slug: "hammerer-aluminium-industries-holding-gmbh" },
  { name: "B&R Industrial Automation", branche: "Industrie", slug: "br-industrial-automation-gmbh" },
  { name: "Steinbacher Dämmstoff", branche: "Industrie", slug: "steinbacher-daemmstoff-gmbh" },
  { name: "Sunpor Kunststoff", branche: "Industrie", slug: "sunpor-kunststoff-gmbh" },
  { name: "Austria Card", branche: "Industrie", slug: "austria-card-plastikkarten-und-ausweissysteme-gmbh" },
  { name: "Ziegler Stahlbau", branche: "Industrie", slug: "ziegler-stahlbau-gmbh" },
  { name: "Fischer Parkett", branche: "Holz", slug: "fischer-parkett-gmbh-co-kg" },
  { name: "Neuschmied Holz", branche: "Holz", slug: "neuschmied-holz-gmbh" },
  { name: "Wieser Holz", branche: "Holz", slug: "wieser-holz-gmbh" },
  { name: "Würth Handelsges.m.b.H.", branche: "Handel", slug: "wuerth-handelsgesmbh" },
  { name: "Herba Chemosan Apotheker-AG", branche: "Handel", slug: "herba-chemosan-apotheker-ag" },
  { name: "Transdanubia Spedition, Pasching", branche: "Logistik", slug: "transdanubia-speditionsgesellschaft-mbh-pasching" },
  { name: "Sporthotel Brixen", branche: "Tourismus", slug: "sporthotel-brixen-gmbh-co-kg" },
  { name: "FS Agrar", branche: "Landwirtschaft", slug: "fs-agrar-gmbh" },
];

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
    kicker: "Eigene Technik",
    titel: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung",
    text: "Netzkonform nach TOR Erzeuger – und im Betrieb jederzeit im Blick.",
    bild: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg",
    alt: "Photovoltaikanlage mit Technik zur Anlagenüberwachung",
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
