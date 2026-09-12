// src/data/hero.js
//
// Inhalte des Startseiten-Sliders. Getrennt vom Markup, damit Texte und
// Reihenfolge ohne Eingriff in die Komponente geändert werden können.
//
// Reihenfolge ist bewusst: Der erste Slide trägt die Hauptbotschaft und wird
// als einziger sofort geladen (LCP). Slides 2 und 3 laden nach.

export const HERO_SLIDES = [
  {
    id: "pv",
    kicker: "Ökovolt Solartechnik · Allgäu & Bayern",
    titel: "Photovoltaik mit Speicher für Ihr Zuhause",
    text: "Planung, Montage und Anmeldung aus einer Hand – vom Fachbetrieb aus Türkheim.",
    // Video nur auf großen Displays; mobil trägt das Standbild.
    video: "/Images/Navbar/intro.mp4",
    bild: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
    alt: "Photovoltaikanlage auf einem Wohnhaus im Allgäu",
    primaer: { href: "/solarrechner", label: "Ertrag berechnen" },
    sekundaer: { href: "/kontakt", label: "Kostenlose Beratung" },
  },
  {
    id: "speicher",
    kicker: "Mehr Eigenverbrauch",
    titel: "Der Speicher macht aus Solarstrom echte Ersparnis",
    text: "Eine selbst genutzte Kilowattstunde ersetzt rund 33 Cent Netzstrom – eingespeist bringt sie nur 7,70 Cent.",
    bild: "/Images/Jobs/jobs1.jpg",
    alt: "Stromspeicher in einem Technikraum",
    primaer: { href: "/produkte/stromspeicher", label: "Speicher ansehen" },
    sekundaer: { href: "/ratgeber/einspeiseverguetung-2026", label: "Vergütung 2026" },
  },
  {
    id: "referenzen",
    kicker: "Über 5.000 Anlagen",
    titel: "Gebaut im Allgäu, in Schwaben und darüber hinaus",
    text: "Vom Einfamilienhaus bis zur Gewerbehalle – sehen Sie, was wir umgesetzt haben.",
    bild: "/Images/Referenzen/Projekte-2.jpg",
    alt: "Photovoltaikanlage auf einem Gewerbedach",
    primaer: { href: "/referenzen/projekte", label: "Projekte ansehen" },
    sekundaer: { href: "/uber-uns/team", label: "Das Team" },
  },
];

/** Wie lange ein Slide steht, bevor automatisch gewechselt wird (ms). */
export const HERO_INTERVALL = 7000;
