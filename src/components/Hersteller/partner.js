// Hersteller mit belegter Zusammenarbeit in Österreich (Stand 09/2026) – eine Quelle
// für Herstellerseite, Wortmarken-Laufband, Produktseiten und die statischen
// Hersteller-Detailseiten, wenn das Backoffice keine Daten liefert.
// Keine Markenlogos Dritter (keine Freigabe) – die Marken erscheinen als Text.
//
// Fronius: Firmensitz Pettenbach (OÖ), gegründet 1945, Produktion u. a. Sattledt (OÖ)
// – Quelle: https://de.wikipedia.org/wiki/Fronius_International

export const PARTNER = [
  {
    title: "Fronius",
    slug: "fronius",
    rolle: "Wechselrichter",
    kategorie: "Wechselrichter",
    tag: "Hersteller aus Österreich",
    bild: "/Images/Dienstleistungen/Smartphone/Fronius-Primo-5.0-1-208-240.webp",
    alt_banner_image: "Fronius-Wechselrichter",
    main_description:
      "Fronius entwickelt und fertigt Wechselrichter in Oberösterreich – vom Hybrid-Wechselrichter für Wohnhaus und Kleinbetrieb bis zu Geräten für Gewerbedächer und Freiflächen. Für uns zählen kurze Wege zum Hersteller, Service in Österreich und eine lange Ersatzteilversorgung.",
    fakten: [
      ["Sitz", "Pettenbach, Oberösterreich"],
      ["Gegründet", "1945"],
      ["Produktion", "u. a. Sattledt, Oberösterreich"],
    ],
    kontexte: [],
  },
  {
    title: "Huawei",
    slug: "huawei",
    rolle: "Wechselrichter & Speicher",
    kategorie: "Wechselrichter",
    bild: "/Images/Dienstleistungen/Smartphone/huawei.webp",
    alt_banner_image: "Huawei-Wechselrichter und Speicher",
    main_description:
      "Huawei bietet String-Wechselrichter der Serie SUN2000 vom Wohnhaus bis zum Gewerbe- und Freiflächenbereich sowie die Speicherfamilie LUNA2000. Stark bei großen Dachflächen mit vielen MPP-Trackern und bei integrierter Überwachung.",
    fakten: [
      ["Einsatz", "Wohnhaus bis Freifläche"],
      ["Speicher", "LUNA2000"],
    ],
    kontexte: ["stromspeicher"],
  },
  {
    title: "Solis",
    slug: "solis",
    rolle: "Wechselrichter",
    kategorie: "Wechselrichter",
    bild: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg",
    alt_banner_image: "Photovoltaikanlage auf einem Gewerbe-Flachdach",
    main_description:
      "Solis (Ginlong Technologies) liefert String-Wechselrichter mit breitem Leistungsspektrum, darunter dreiphasige Geräte für Gewerbe- und Hallendächer. Gut geeignet, wenn viele Dachflächen mit unterschiedlicher Ausrichtung zusammenkommen.",
    fakten: [["Einsatz", "Gewerbe- und Hallendächer"]],
    kontexte: [],
  },
  {
    title: "BYD",
    slug: "byd",
    rolle: "Batteriespeicher",
    kategorie: "Stromspeicher",
    bild: "/Images/Dienstleistungen/Photovoltaik/BYD.png",
    alt_banner_image: "BYD-Batteriespeicher",
    main_description:
      "BYD fertigt Batteriespeicher mit Lithium-Eisenphosphat-Zellen (LFP). Die modularen Hochvoltspeicher der Battery-Box lassen sich mit zahlreichen Hybrid-Wechselrichtern kombinieren und später erweitern.",
    fakten: [["Zellchemie", "Lithium-Eisenphosphat (LFP)"]],
    kontexte: ["stromspeicher"],
  },
  {
    title: "Sigenergy",
    slug: "sigenergy",
    rolle: "Speicher & Hybrid-Wechselrichter",
    kategorie: "Stromspeicher",
    bild: "/Images/Dienstleistungen/Photovoltaik/welschelrichter.webp",
    alt_banner_image: "Sigenergy-Speichersystem mit integriertem Wechselrichter",
    main_description:
      "Sigenergy baut modulare Speichersysteme mit integriertem Hybrid-Wechselrichter und Energiemanagement – vom Wohnhaus bis zu Gewerbeanwendungen. Das System lässt sich stapelbar erweitern und bindet Ladeinfrastruktur mit ein.",
    fakten: [["Aufbau", "Speicher und Wechselrichter integriert"]],
    kontexte: ["stromspeicher"],
  },
  {
    title: "meteocontrol",
    slug: "meteocontrol",
    rolle: "Monitoring",
    kategorie: "Monitoring",
    bild: "/Images/Ratgeber/energiemanagementsystem.jpg",
    alt_banner_image: "Monitoring-Oberfläche einer Photovoltaikanlage",
    main_description:
      "meteocontrol liefert Datenlogger und Monitoring-Portale für gewerbliche PV-Anlagen und Solarparks. Wir nutzen die Systeme zur herstellerübergreifenden Überwachung – ergänzend zu unseren eigenen Fernwartungs- und SCADA-Systemen.",
    fakten: [["Einsatz", "Gewerbe, Freifläche, Portfolio"]],
    kontexte: [],
  },
];

/** Kategorien in fester Reihenfolge (Herstellerseite) */
export const PARTNER_KATEGORIEN = ["Wechselrichter", "Stromspeicher", "Monitoring"].map((name) => ({
  name,
  hersteller: PARTNER.filter((p) => p.kategorie === name),
}));

/** Partner für einen Produktbereich, z. B. „stromspeicher“ */
export const partnerFuer = (kontext) => PARTNER.filter((p) => p.kontexte.includes(kontext));

/** Statischer Partner zu einem Slug innerhalb eines Produktbereichs – oder null */
export const partnerZuSlug = (kontext, slug) => partnerFuer(kontext).find((p) => p.slug === slug) || null;
