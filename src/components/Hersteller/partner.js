// Hersteller – EINZIGE Datenquelle für Herstellerseite, Wortmarken-Laufband, Produktseiten,
// Wechselrichter- und Speicher-Detailseiten, Sitemap und llms.txt (Maßnahme M17, Stand 30.09.2026).
//
// Feld `belegt`: true nur für Marken, deren Einsatz bei Ökovolt nachgewiesen ist (Entscheidung E3
// des Auftraggebers vom 30.09.2026: Fronius, Huawei, BYD, Sigenergy, Solis, meteocontrol). Nur diese
// Marken bekommen eigene Seiten und die Aussage „bei Ökovolt verbaut“. Weitere Marken erscheinen
// ausschließlich neutral in den Ratgeber-Vergleichstabellen (nach Datenblatt, ohne Verbau-Aussage).
// Keine Markenlogos Dritter (keine Freigabe) – die Marken erscheinen als Text. Kein „Partner“-Status
// ohne Urkunde: Ob Ökovolt z. B. Fronius System Partner ist, ist offen (E3) und wird nicht behauptet.
//
// Quellen der Kennwerte: jeweils `datenblatt` (Herstellerdokument, Version, Abrufdatum).
// Fronius: Firmensitz Pettenbach (OÖ), gegründet 1945, Produktion u. a. Sattledt (OÖ)
// – Quelle: https://de.wikipedia.org/wiki/Fronius_International

/** Abrufdatum aller Datenblätter in dieser Datei */
export const DATENBLATT_ABRUF = "30.09.2026";

export const PARTNER = [
  {
    title: "Fronius",
    slug: "fronius",
    belegt: true,
    stand: "2026-09-30",
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
    kontexte: ["wechselrichter"],
    website: "https://www.fronius.com/de-at/austria",
    sameAs: ["https://www.fronius.com/de-at/austria", "https://de.wikipedia.org/wiki/Fronius_International"],
    datenblatt: {
      modell: "Fronius Tauro ECO 100-3-D und Tauro 50-3-D",
      titel: "Fronius Tauro – Datenblatt (Direct version)",
      url: "https://www.fronius.com/en/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Tauro_D_EN.pdf",
      version: "EN V08 Sep 2026",
      // Referenzgerät für Übersicht und Vergleich: Tauro ECO 100-3-D
      referenz: {
        modell: "Tauro ECO 100-3-D",
        ac: "100 kW",
        wirkungsgrad: "98,5 % / 98,2 %",
        mpp: "1",
        dcMax: "1.000 V",
        schutzart: "IP65",
        gewicht: "103 kg",
      },
    },
  },
  {
    title: "Huawei",
    slug: "huawei",
    belegt: true,
    stand: "2026-09-30",
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
    kontexte: ["wechselrichter", "stromspeicher"],
    website: "https://solar.huawei.com/",
    sameAs: ["https://solar.huawei.com/", "https://de.wikipedia.org/wiki/Huawei"],
    datenblatt: {
      modell: "Huawei SUN2000-100KTL-M2",
      titel: "Huawei SUN2000-100KTL-M2 – Datenblatt",
      url: "https://solar.huawei.com/admin/asset/v1/pro/view/c5056ea20b95424fad3c62f0a5e64a84.pdf",
      version: "ohne Versionsangabe, PDF vom 26.06.2025",
      referenz: {
        modell: "SUN2000-100KTL-M2",
        ac: "100 kW",
        wirkungsgrad: "98,6 % / 98,4 % (bei 400 V)",
        mpp: "10",
        dcMax: "1.100 V",
        schutzart: "IP66",
        gewicht: "93 kg",
      },
    },
    speicher: {
      serie: "LUNA2000",
      seoTitel: "Huawei LUNA2000 Stromspeicher: Planung & Einbau | Ökovolt",
      description:
        "Huawei LUNA2000 in Österreich: modularer LFP-Speicher mit 5 bis 20,7 kWh nutzbar (S1), passend zu SUN2000-Wechselrichtern – Planung und Einbau durch Ökovolt.",
      beschreibung:
        "Die Speicherfamilie LUNA2000 von Huawei ist modular aufgebaut: Ein Leistungsmodul trägt bis zu drei Batteriemodule mit Lithium-Eisenphosphat-Zellen. In der Serie S1 ergibt das laut Datenblatt 5 bis 20,7 kWh nutzbare Energie – abgestimmt auf die Hybrid-Wechselrichter der Serie SUN2000.",
      kennwerte: [
        ["Serie", "LUNA2000-5 … 21-S1"],
        ["Nutzbare Energie", "5 bis 20,7 kWh (Batteriemodule mit 5 oder 6,9 kWh, bis zu drei je Leistungsmodul)"],
        ["Zellchemie", "Lithium-Eisenphosphat (LiFePO4)"],
        ["Betriebsspannung", "350–560 V (einphasig), 600–980 V (dreiphasig)"],
        ["Schutzart", "IP66, Betrieb −20 bis +55 °C"],
      ],
      datenblatt: {
        titel: "Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 – Datenblatt",
        url: "https://solar.huawei.com/admin/asset/v1/pro/view/36414e3c762a4e508d6fde579866c4c0.pdf",
        version: "Version No. 01-202509",
      },
    },
  },
  {
    title: "Solis",
    slug: "solis",
    belegt: true,
    stand: "2026-09-30",
    rolle: "Wechselrichter",
    kategorie: "Wechselrichter",
    bild: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg",
    alt_banner_image: "Photovoltaikanlage auf einem Gewerbe-Flachdach",
    main_description:
      "Solis (Ginlong Technologies) liefert String-Wechselrichter mit breitem Leistungsspektrum, darunter dreiphasige Geräte für Gewerbe- und Hallendächer. Gut geeignet, wenn viele Dachflächen mit unterschiedlicher Ausrichtung zusammenkommen.",
    fakten: [["Einsatz", "Gewerbe- und Hallendächer"]],
    kontexte: ["wechselrichter"],
    website: "https://www.solisinverters.com/",
    sameAs: ["https://www.solisinverters.com/"],
    datenblatt: {
      modell: "Solis-100K-5G-PRO",
      titel: "Solis Three Phase Inverter (75–110)K-5G-PRO – Installations- und Betriebsanleitung, Kapitel 10 Specifications",
      url: "https://www.solisinverters.com/uploads/file/Solis_Manual_3P%2875-110%29K-40A-5G-PRO_EUR_V1,2%2820240311%29.pdf",
      version: "EUR V1.2 vom 11.03.2024",
      referenz: {
        modell: "Solis-100K-5G-PRO",
        ac: "100 kW",
        wirkungsgrad: "98,5 % / 98,0 %",
        mpp: "8",
        dcMax: "1.100 V",
        schutzart: "IP66",
        gewicht: "98 kg",
      },
    },
  },
  {
    title: "BYD",
    slug: "byd",
    belegt: true,
    stand: "2026-09-30",
    rolle: "Batteriespeicher",
    kategorie: "Stromspeicher",
    bild: "/Images/Dienstleistungen/Photovoltaik/BYD.png",
    alt_banner_image: "BYD-Batteriespeicher",
    main_description:
      "BYD fertigt Batteriespeicher mit Lithium-Eisenphosphat-Zellen (LFP). Die modularen Hochvoltspeicher der Battery-Box lassen sich mit zahlreichen Hybrid-Wechselrichtern kombinieren und später erweitern.",
    fakten: [["Zellchemie", "Lithium-Eisenphosphat (LFP)"]],
    kontexte: ["stromspeicher"],
    website: "https://www.bydbatterybox.com/",
    sameAs: ["https://www.bydbatterybox.com/", "https://de.wikipedia.org/wiki/BYD"],
    speicher: {
      serie: "Battery-Box Premium",
      seoTitel: "BYD Battery-Box Stromspeicher: Planung & Einbau | Ökovolt",
      description:
        "BYD Battery-Box Premium HVS/HVM in Österreich: kobaltfreier LFP-Hochvoltspeicher mit 5,1 bis 22,1 kWh nutzbar – Planung und Einbau durch Ökovolt.",
      beschreibung:
        "Die Battery-Box Premium von BYD ist ein Hochvoltspeicher aus in Reihe geschalteten Modulen mit kobaltfreien Lithium-Eisenphosphat-Zellen. Laut Datenblatt reicht die nutzbare Energie von 5,12 kWh (HVS, zwei Module) bis 22,08 kWh (HVM, acht Module) je Turm.",
      kennwerte: [
        ["Serie", "Battery-Box Premium HVS / HVM"],
        ["Nutzbare Energie", "HVS 5,12–12,8 kWh (2–5 Module à 2,56 kWh), HVM 8,28–22,08 kWh (3–8 Module à 2,76 kWh)"],
        ["Zellchemie", "Lithium-Eisenphosphat, kobaltfrei"],
        ["Nennspannung HVS", "204,8–512 V"],
        ["Schutzart", "IP55"],
        ["Garantie laut Datenblatt", "10 Jahre, Bedingungen laut Garantieerklärung von BYD"],
      ],
      datenblatt: {
        titel: "BYD Battery-Box Premium HVS / HVM – Datenblatt",
        url: "https://www.bydbatterybox.com/uploads/downloads/230530_BYD_Battery-Box_Premium_HVS&HVM_Datasheet_V1.7_EN-647eedf90f9c3.pdf",
        version: "V1.7 EN",
      },
    },
  },
  {
    title: "Sigenergy",
    slug: "sigenergy",
    belegt: true,
    stand: "2026-09-30",
    rolle: "Speicher & Hybrid-Wechselrichter",
    kategorie: "Stromspeicher",
    bild: "/Images/Dienstleistungen/Photovoltaik/welschelrichter.webp",
    alt_banner_image: "Sigenergy-Speichersystem mit integriertem Wechselrichter",
    main_description:
      "Sigenergy baut modulare Speichersysteme mit integriertem Hybrid-Wechselrichter und Energiemanagement – vom Wohnhaus bis zu Gewerbeanwendungen. Das System lässt sich stapelbar erweitern und bindet Ladeinfrastruktur mit ein.",
    fakten: [["Aufbau", "Speicher und Wechselrichter integriert"]],
    kontexte: ["stromspeicher"],
    website: "https://www.sigenergy.com/",
    sameAs: ["https://www.sigenergy.com/"],
    speicher: {
      serie: "SigenStor",
      seoTitel: "Sigenergy SigenStor Speicher: Planung & Einbau | Ökovolt",
      description:
        "Sigenergy SigenStor in Österreich: stapelbare LFP-Batteriemodule mit 5,2 oder 7,8 kWh nutzbar, bis sechs Module je Stapel – Planung und Einbau durch Ökovolt.",
      beschreibung:
        "SigenStor von Sigenergy stapelt Batteriemodule mit Lithium-Eisenphosphat-Zellen über einer Einheit mit Hybrid-Wechselrichter. Je Modul sind laut Datenblatt 5,2 kWh (BAT 5.0) oder 7,8 kWh (BAT 8.0) nutzbar, gestapelt werden ein bis sechs Module.",
      kennwerte: [
        ["Serie", "SigenStor BAT 5.0 / BAT 8.0"],
        ["Nutzbare Energie je Modul", "5,2 kWh (BAT 5.0) bzw. 7,8 kWh (BAT 8.0)"],
        ["Module je Stapel", "1 bis 6 (Beispiel BAT 8.0: 8,06 bis 48,36 kWh Gesamtenergie)"],
        ["Zellchemie", "Lithium-Eisenphosphat (LiFePO4)"],
        ["Spannungsbereich", "300–600 V (einphasig), 600–900 V (dreiphasig)"],
        ["Schutzart", "IP66, Betrieb −20 bis +55 °C"],
      ],
      datenblatt: {
        titel: "Sigenergy Sigen Battery 5.0 / 8.0 (SigenStor BAT) – Datenblatt",
        url: "https://www.sigenergy.com/uploads/en_download/1693548782125366.pdf",
        version: "ohne Versionsangabe, PDF vom 03.07.2024",
      },
    },
  },
  {
    title: "meteocontrol",
    slug: "meteocontrol",
    belegt: true,
    stand: "2026-09-30",
    rolle: "Monitoring",
    kategorie: "Monitoring",
    bild: "/Images/Ratgeber/energiemanagementsystem.jpg",
    alt_banner_image: "Monitoring-Oberfläche einer Photovoltaikanlage",
    main_description:
      "meteocontrol liefert Datenlogger und Monitoring-Portale für gewerbliche PV-Anlagen und Solarparks. Wir nutzen die Systeme zur herstellerübergreifenden Überwachung – ergänzend zu unseren eigenen Fernwartungs- und SCADA-Systemen.",
    fakten: [["Einsatz", "Gewerbe, Freifläche, Portfolio"]],
    kontexte: [],
    website: "https://www.meteocontrol.com/",
    sameAs: ["https://www.meteocontrol.com/"],
  },
];

/** Nur Marken mit belegtem Einsatz (E3) */
export const BELEGT = PARTNER.filter((p) => p.belegt === true);

/** Namen der belegten Marken – abgeleitet, nicht mehr von Hand gepflegt */
export const BELEGTE_PARTNER = BELEGT.map((p) => p.title);

/** Enthält der (Backoffice-)Titel eine belegte Marke? */
export const istBelegterPartner = (titel = "") => BELEGTE_PARTNER.some((p) => String(titel).toLowerCase().includes(p.toLowerCase()));

/** Felder, die die Übersichtskarten brauchen (schlank, weil sie an eine Client-Komponente gehen) */
const karte = ({ title, slug, rolle, tag, bild, alt_banner_image, main_description, fakten, kontexte }) => ({
  title,
  slug,
  rolle,
  tag,
  bild,
  alt_banner_image,
  main_description,
  fakten,
  kontexte,
});

/** Kategorien in fester Reihenfolge (Herstellerseite) – nur belegte Marken */
export const PARTNER_KATEGORIEN = ["Wechselrichter", "Stromspeicher", "Monitoring"].map((name) => ({
  name,
  hersteller: BELEGT.filter((p) => p.kategorie === name).map(karte),
}));

/** Belegte Partner für einen Produktbereich, z. B. „stromspeicher“ oder „wechselrichter“ */
export const partnerFuer = (kontext) => BELEGT.filter((p) => p.kontexte.includes(kontext));

/** Statischer, belegter Partner zu einem Slug innerhalb eines Produktbereichs – oder null */
export const partnerZuSlug = (kontext, slug) => partnerFuer(kontext).find((p) => p.slug === slug) || null;

/** Eigene Detailseite der Marke (Wechselrichter vor Speicher) – oder null */
export function detailPfad(p) {
  if (!p?.belegt) return null;
  if (p.kontexte.includes("wechselrichter")) return `/produkte/wechselrichter/${p.slug}`;
  if (p.kontexte.includes("stromspeicher")) return `/produkte/stromspeicher/${p.slug}`;
  return null;
}

/**
 * Service (Wartung, Tausch, Reparatur) für Wechselrichter anderer Hersteller – Entscheidung E4 ist OFFEN.
 * Solange `freigegeben` false ist, erscheint der Abschnitt auf /service/repowering und /service/e-check
 * nicht. Erst nach schriftlicher Bestätigung durch die Geschäftsführung auf true setzen und den Text
 * prüfen (UWG: nur zusagen, was tatsächlich geleistet wird).
 */
export const SERVICE_FREMDMARKEN = {
  freigegeben: false,
  entscheidung: "E4 (offen, Stand 30.09.2026)",
  titel: "Service auch für Wechselrichter anderer Hersteller",
  text: "Wir prüfen, warten und tauschen Wechselrichter auch in Anlagen, die nicht von uns errichtet wurden – unabhängig vom Hersteller. Ersatzgeräte wählen wir nach Netzkonformität (TOR Erzeuger), Leistung und Kommunikation mit der bestehenden Regelung.",
};
