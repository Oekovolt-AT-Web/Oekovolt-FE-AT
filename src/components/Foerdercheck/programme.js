// src/components/Foerdercheck/programme.js
//
// Datenbasis des Förder-Checks (/foerdercheck).
//
// BUND: hier gepflegt. LAND/KOMMUNE: kommt aus src/data/bundeslaender.js,
// damit Karte, Landesseiten und Förder-Check dieselbe Quelle nutzen.
//
// PFLEGE: Konditionen ändern sich – insbesondere BEG/KfW (zuletzt 21.07.2026)
// und die geplante EEG-Novelle 2027. Bei jeder Änderung STAND anpassen.

import { alleBundeslaender, REGIONALSEITEN, themenFuerProgramm } from "@/data/bundeslaender";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

export const STAND = { iso: "2026-09-13", label: "13. September 2026" };

export const VORHABEN = [
  { id: "pv", label: "Photovoltaik", text: "Dach- oder Fassadenanlage" },
  { id: "speicher", label: "Stromspeicher", text: "neu oder nachgerüstet" },
  { id: "wallbox", label: "Wallbox", text: "Laden am Haus" },
  { id: "waermepumpe", label: "Wärmepumpe", text: "Heizungstausch" },
  { id: "sanierung", label: "Sanierung", text: "Dämmung, Fenster, Effizienzhaus" },
];

export const ROLLEN = [
  { id: "eigen", label: "Ich nutze das Haus selbst", text: "Eigenheim, selbst genutzte Wohnung" },
  { id: "vermieter", label: "Ich vermiete / WEG", text: "Mehrfamilienhaus, Eigentümergemeinschaft" },
  { id: "gewerbe", label: "Unternehmen", text: "Gewerbe, Landwirtschaft, Verein" },
];

// Art -> Darstellung im Ergebnis
export const ARTEN = {
  zuschuss: "Zuschuss",
  kredit: "Kredit",
  steuer: "Steuervorteil",
  verguetung: "Vergütung",
  entlastung: "Entlastung",
  beratung: "Beratung",
};

// Zeitpunkt des Antrags
export const ANTRAG = {
  vorher: { label: "Antrag vor Vertragsabschluss", warn: true },
  automatisch: { label: "Automatisch – kein Antrag", warn: false },
  nachher: { label: "Nach Inbetriebnahme", warn: false },
  steuer: { label: "Mit der Steuererklärung", warn: false },
};

const alle = ["eigen", "vermieter", "gewerbe"];

export const BUND = [
  {
    id: "ust",
    name: "0 % Umsatzsteuer",
    traeger: "§ 12 Abs. 3 UStG",
    art: "steuer",
    themen: ["pv", "speicher"],
    rollen: alle,
    hoehe: "19 % günstiger",
    kurz: "Kauf und Montage von Anlage und Speicher ohne Mehrwertsteuer.",
    bedingungen: ["Wohngebäude, öffentliches oder gemeinwohlorientiertes Gebäude", "bis 30 kWp gilt die Voraussetzung ohne Nachweis", "gilt nicht für Wallbox und Wärmepumpe"],
    antrag: "automatisch",
    intern: { href: "/forderungen/steuerlich", label: "Steuervorteile im Detail" },
  },
  {
    id: "est",
    name: "Einkommensteuerbefreiung",
    traeger: "§ 3 Nr. 72 EStG",
    art: "steuer",
    themen: ["pv"],
    rollen: alle,
    hoehe: "steuerfreie Erträge",
    kurz: "Einspeisevergütung und Stromverkauf bleiben steuerfrei – ohne Gewinnermittlung.",
    bedingungen: ["bis 30 kWp je Wohn- oder Gewerbeeinheit", "höchstens 100 kWp je Betreiber (Freigrenze)"],
    antrag: "automatisch",
    intern: { href: "/forderungen/steuerlich#steuer-check", label: "Zum Steuer-Check" },
  },
  {
    id: "eeg",
    name: "EEG-Einspeisevergütung",
    traeger: "Netzbetreiber / EEG 2023",
    art: "verguetung",
    themen: ["pv"],
    rollen: alle,
    hoehe: `${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct/kWh`,
    kurz: `Feste Vergütung für eingespeisten Strom über ${VERGUETUNG.garantieJahre} Jahre (bis 10 kWp, Teileinspeisung, Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}).`,
    bedingungen: ["Registrierung im Marktstammdatenregister binnen 1 Monat", "ohne Steuerbox max. 60 % Einspeiseleistung", "geplant: keine feste Vergütung für Neuanlagen < 25 kW ab 2027 (Entwurf)"],
    antrag: "nachher",
    extern: { href: VERGUETUNG.quelle.url, label: "Bundesnetzagentur" },
    intern: { href: "/ratgeber/einspeiseverguetung-2026", label: "Einspeisevergütung 2026" },
  },
  {
    id: "kfw270",
    name: "KfW-Kredit 270 – Erneuerbare Energien",
    traeger: "KfW über Ihre Bank",
    art: "kredit",
    themen: ["pv", "speicher"],
    rollen: alle,
    hoehe: "bis 100 % der Kosten",
    kurz: "Zinsgünstige Finanzierung von Photovoltaikanlage und Batteriespeicher, Laufzeit bis 30 Jahre.",
    bedingungen: ["ein Teil des Stroms wird eingespeist", "nicht für Balkonkraftwerke", "kombinierbar mit Zuschüssen"],
    antrag: "vorher",
    extern: { href: "https://www.kfw.de/270", label: "KfW 270" },
    intern: { href: "/service/finanzierung", label: "Finanzierung" },
  },
  {
    id: "kfw458",
    name: "BEG-Heizungsförderung (KfW 458)",
    traeger: "KfW – Bundesförderung für effiziente Gebäude",
    art: "zuschuss",
    themen: ["waermepumpe"],
    rollen: ["eigen"],
    hoehe: "30 % bis 70 %",
    kurz: "Zuschuss zum Heizungstausch: 30 % Grundförderung plus Klimageschwindigkeits- und Einkommensbonus für Selbstnutzer.",
    bedingungen: ["Boni für selbst genutztes Wohneigentum; bis 80 % bei zu versteuerndem Einkommen bis 30.000 €", "förderfähige Kosten max. 28.000 € für die erste Wohneinheit", "Sätze seit 21.07.2026 geändert – aktuellen Stand bei der KfW prüfen"],
    antrag: "vorher",
    extern: { href: "https://www.kfw.de/458", label: "KfW 458" },
    intern: { href: "/produkte/warmepumpe", label: "Wärmepumpe" },
  },
  {
    id: "kfw458v",
    name: "BEG-Heizungsförderung (KfW 458)",
    traeger: "KfW – Bundesförderung für effiziente Gebäude",
    art: "zuschuss",
    themen: ["waermepumpe"],
    rollen: ["vermieter"],
    hoehe: "30 % Grundförderung",
    kurz: "Zuschuss zum Heizungstausch in vermieteten Wohngebäuden und Eigentümergemeinschaften.",
    bedingungen: ["Einkommens- und Klimageschwindigkeitsbonus nur für Selbstnutzer", "förderfähige Kosten gestaffelt nach Wohneinheiten", "Sätze seit 21.07.2026 geändert – bei der KfW prüfen"],
    antrag: "vorher",
    extern: { href: "https://www.kfw.de/458", label: "KfW 458" },
    intern: { href: "/produkte/warmepumpe", label: "Wärmepumpe" },
  },
  {
    id: "kfw522",
    name: "BEG-Heizungsförderung für Unternehmen",
    traeger: "KfW 459 (Wohngebäude) / KfW 522 (Nichtwohngebäude)",
    art: "zuschuss",
    themen: ["waermepumpe"],
    rollen: ["gewerbe"],
    hoehe: "30 % Grundförderung",
    kurz: "Zuschuss für Wärmepumpen in Betriebs- und vermieteten Gebäuden von Unternehmen.",
    bedingungen: ["Antrag vor Vorhabenbeginn im KfW-Zuschussportal", "Mindesteffizienz der Wärmepumpe", "Sätze seit 21.07.2026 geändert – bei der KfW prüfen"],
    antrag: "vorher",
    extern: { href: "https://www.kfw.de/522", label: "KfW 522" },
  },
  {
    id: "kfw358",
    name: "KfW-Ergänzungskredit (358/359)",
    traeger: "KfW über Ihre Bank",
    art: "kredit",
    themen: ["waermepumpe", "sanierung"],
    rollen: alle,
    hoehe: "bis 120.000 € je WE",
    kurz: "Kredit für den Eigenanteil, wenn Sie einen BEG-Zuschuss für Heizung oder Einzelmaßnahmen zugesagt bekommen haben.",
    bedingungen: ["Zusage eines BEG-Zuschusses nötig", "358 zinsverbilligt für Selbstnutzer bis 90.000 € Haushaltseinkommen"],
    antrag: "vorher",
    extern: { href: "https://www.kfw.de/358", label: "KfW 358" },
  },
  {
    id: "bafa",
    name: "BEG-Einzelmaßnahmen (BAFA)",
    traeger: "Bundesamt für Wirtschaft und Ausfuhrkontrolle",
    art: "zuschuss",
    themen: ["sanierung"],
    rollen: alle,
    hoehe: "15 % + ggf. 5 % iSFP-Bonus",
    kurz: "Zuschuss für Dämmung, Fenster, Türen, Anlagentechnik und Heizungsoptimierung.",
    bedingungen: ["förderfähige Kosten bis 30.000 € je Wohneinheit, mit Sanierungsfahrplan 60.000 €", "iSFP-Bonus seit 21.07.2026 erst ab 30.000 € förderfähigen Kosten", "Energieeffizienz-Experte erforderlich"],
    antrag: "vorher",
    extern: { href: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/effiziente_gebaeude_node.html", label: "BAFA BEG EM" },
  },
  {
    id: "kfw261",
    name: "KfW 261 – Wohngebäude-Kredit",
    traeger: "KfW über Ihre Bank",
    art: "kredit",
    themen: ["sanierung"],
    rollen: ["eigen", "vermieter"],
    hoehe: "bis 150.000 € je WE",
    kurz: "Kredit mit Tilgungszuschuss für die Sanierung zum Effizienzhaus.",
    bedingungen: ["Sanierung auf Effizienzhaus-Standard", "Tilgungszuschüsse seit 21.07.2026 reduziert", "Energieeffizienz-Experte erforderlich"],
    antrag: "vorher",
    extern: { href: "https://www.kfw.de/261", label: "KfW 261" },
  },
  {
    id: "35c",
    name: "Steuerbonus energetische Sanierung",
    traeger: "§ 35c EStG",
    art: "steuer",
    themen: ["sanierung", "waermepumpe"],
    rollen: ["eigen"],
    hoehe: "20 % über 3 Jahre",
    kurz: "Alternative zur BEG: 20 % der Kosten werden über drei Jahre von der Steuerschuld abgezogen, max. 40.000 € je Objekt.",
    bedingungen: ["selbst genutztes Wohneigentum, Gebäude älter als 10 Jahre", "nicht mit BEG-Zuschuss für dieselbe Maßnahme kombinierbar", "Bescheinigung des Fachunternehmens"],
    antrag: "steuer",
  },
  {
    id: "14a",
    name: "Reduzierte Netzentgelte nach § 14a EnWG",
    traeger: "Ihr Netzbetreiber",
    art: "entlastung",
    themen: ["waermepumpe", "wallbox", "speicher"],
    rollen: alle,
    hoehe: "jährlich weniger Netzentgelt",
    kurz: "Steuerbare Verbrauchseinrichtungen über 4,2 kW erhalten ein pauschal oder prozentual reduziertes Netzentgelt – optional zeitvariabel.",
    bedingungen: ["Anmeldung als steuerbare Verbrauchseinrichtung", "Netzbetreiber darf bei Engpässen kurzzeitig dimmen", "Smart Meter bzw. Steuerbox erforderlich"],
    antrag: "nachher",
    intern: { href: "/produkte/smartmeter", label: "Smart Meter" },
  },
  {
    id: "35a",
    name: "Steuerermäßigung für Handwerkerleistungen",
    traeger: "§ 35a EStG",
    art: "steuer",
    themen: ["wallbox"],
    rollen: ["eigen"],
    hoehe: "20 % der Arbeitskosten",
    kurz: "Für die Installation der Wallbox am selbst genutzten Haushalt: 20 % der Lohnkosten, max. 1.200 € Steuerermäßigung pro Jahr.",
    bedingungen: ["nur Arbeits- und Fahrtkosten, nicht das Gerät", "Zahlung per Überweisung", "nicht zusätzlich zu anderer Förderung derselben Kosten"],
    antrag: "steuer",
    intern: { href: "/ratgeber/wallbox-installation", label: "Wallbox-Installation" },
  },
  {
    id: "lademph",
    name: "Laden im Mehrparteienhaus",
    traeger: "Bundesprogramm (seit 04/2026)",
    art: "zuschuss",
    themen: ["wallbox"],
    rollen: ["vermieter"],
    hoehe: "1.300–2.000 € je Stellplatz",
    kurz: "Zuschuss für Ladeinfrastruktur in Mehrparteienhäusern und Eigentümergemeinschaften.",
    bedingungen: ["mindestens 6 Stellplätze", "Antragsfristen beachten (für WEG laut Programmstand bis 10.11.2026)", "Budget begrenzt"],
    antrag: "vorher",
    intern: { href: "/produkte/wallbox", label: "Wallbox" },
  },
];

// Hinweise, wenn es für ein Vorhaben keine eigene Förderung gibt
export const LUECKEN = {
  wallbox: "Für private Wallboxen an Einfamilienhäusern gibt es 2026 keine bundesweite Förderung mehr (KfW 440 ist beendet). Einzelne Kommunen und Energieversorger fördern regional.",
  speicher: "Eine bundesweite Speicherförderung gibt es nicht – Speicher profitieren aber von 0 % Umsatzsteuer und dem KfW-Kredit 270.",
};

// PLZ-Leitregion -> Bundesland (Näherung: Leitregionen überschneiden Landesgrenzen)
const PLZ_LAND = {
  "01": "sachsen", "02": "sachsen", "03": "brandenburg", "04": "sachsen", "06": "sachsen-anhalt", "07": "thueringen", "08": "sachsen", "09": "sachsen",
  "10": "berlin", "12": "berlin", "13": "berlin", "14": "brandenburg", "15": "brandenburg", "16": "brandenburg", "17": "mecklenburg-vorpommern", "18": "mecklenburg-vorpommern", "19": "mecklenburg-vorpommern",
  "20": "hamburg", "21": "niedersachsen", "22": "hamburg", "23": "schleswig-holstein", "24": "schleswig-holstein", "25": "schleswig-holstein", "26": "niedersachsen", "27": "niedersachsen", "28": "bremen", "29": "niedersachsen",
  "30": "niedersachsen", "31": "niedersachsen", "32": "nordrhein-westfalen", "33": "nordrhein-westfalen", "34": "hessen", "35": "hessen", "36": "hessen", "37": "niedersachsen", "38": "niedersachsen", "39": "sachsen-anhalt",
  "40": "nordrhein-westfalen", "41": "nordrhein-westfalen", "42": "nordrhein-westfalen", "44": "nordrhein-westfalen", "45": "nordrhein-westfalen", "46": "nordrhein-westfalen", "47": "nordrhein-westfalen", "48": "nordrhein-westfalen", "49": "niedersachsen",
  "50": "nordrhein-westfalen", "51": "nordrhein-westfalen", "52": "nordrhein-westfalen", "53": "nordrhein-westfalen", "54": "rheinland-pfalz", "55": "rheinland-pfalz", "56": "rheinland-pfalz", "57": "nordrhein-westfalen", "58": "nordrhein-westfalen", "59": "nordrhein-westfalen",
  "60": "hessen", "61": "hessen", "63": "hessen", "64": "hessen", "65": "hessen", "66": "saarland", "67": "rheinland-pfalz", "68": "baden-wuerttemberg", "69": "baden-wuerttemberg",
  "70": "baden-wuerttemberg", "71": "baden-wuerttemberg", "72": "baden-wuerttemberg", "73": "baden-wuerttemberg", "74": "baden-wuerttemberg", "75": "baden-wuerttemberg", "76": "baden-wuerttemberg", "77": "baden-wuerttemberg", "78": "baden-wuerttemberg", "79": "baden-wuerttemberg",
  "80": "bayern", "81": "bayern", "82": "bayern", "83": "bayern", "84": "bayern", "85": "bayern", "86": "bayern", "87": "bayern", "88": "baden-wuerttemberg", "89": "baden-wuerttemberg",
  "90": "bayern", "91": "bayern", "92": "bayern", "93": "bayern", "94": "bayern", "95": "bayern", "96": "bayern", "97": "bayern", "98": "thueringen", "99": "thueringen",
};

/** Bundesland aus Postleitzahl ableiten (Näherung) – null bei unbekannter Leitregion. */
export function landFuerPlz(plz) {
  if (!/^\d{5}$/.test(plz || "")) return null;
  return PLZ_LAND[plz.slice(0, 2)] || null;
}

/** Regionale Förderseite zu einer PLZ (exakter Treffer). */
export function regionFuerPlz(plz) {
  if (!/^\d{5}$/.test(plz || "")) return null;
  const treffer = Object.entries(REGIONALSEITEN).find(([, r]) => r.plz?.includes(plz));
  return treffer ? { slug: treffer[0], ...treffer[1] } : null;
}

/** Schlanke Länderliste für den Client. */
export function laenderFuerCheck() {
  return alleBundeslaender().map((l) => ({
    key: l.key,
    name: l.name,
    kuerzel: l.kuerzel,
    slug: l.slug,
    foerderart: l.foerderart,
    stand: l.stand,
    kurz: l.landesprogramm.kurz,
    programm: l.programm,
    portal: l.portal?.name || null,
    kommunal: (l.kommunal || []).map((k) => ({ ort: k.ort, programm: k.programm, hoehe: k.hoehe, was: k.was, hinweis: k.hinweis || null, themen: themenFuerProgramm(k) })),
    ausgelaufen: (l.ausgelaufen || []).map((a) => ({ ort: a.ort, programm: a.programm })),
  }));
}

/**
 * Ergebnis berechnen.
 * land: Eintrag aus laenderFuerCheck(); vorhaben: string[]; rolle: string
 */
export function ermittleProgramme({ land, vorhaben, rolle }) {
  const passt = (themen) => themen.some((t) => vorhaben.includes(t));

  const bund = BUND.filter((p) => passt(p.themen) && p.rollen.includes(rolle)).map((p) => ({
    ...p,
    ebene: "bund",
    fuer: p.themen.filter((t) => vorhaben.includes(t)),
  }));

  const landProgramme = [];
  if (land?.programm && passt(land.programm.themen) && land.programm.zielgruppen.includes(rolle)) {
    landProgramme.push({
      id: `land-${land.key}`,
      name: land.programm.name,
      traeger: `Land ${land.name}`,
      art: land.programm.art === "Darlehen" ? "kredit" : "zuschuss",
      ebene: "land",
      fuer: land.programm.themen.filter((t) => vorhaben.includes(t)),
      hoehe: land.programm.art === "Darlehen" ? "zinsverbilligt" : "Zuschuss",
      kurz: land.kurz,
      bedingungen: [land.portal ? `Abwicklung: ${land.portal}` : null, "Konditionen und Budget vor Antrag prüfen"].filter(Boolean),
      antrag: "vorher",
      intern: { href: `/forderungen/landesforderungen/${land.slug}`, label: `Förderung in ${land.name}` },
    });
  }

  const kommunal = (land?.kommunal || [])
    .filter((k) => passt(k.themen.filter((t) => t !== "balkon")) || (vorhaben.includes("pv") && k.themen.includes("balkon")))
    .map((k, i) => ({
      id: `kommunal-${land.key}-${i}`,
      name: k.programm,
      traeger: k.ort,
      art: "zuschuss",
      ebene: "kommunal",
      fuer: k.themen.filter((t) => vorhaben.includes(t)),
      nurBalkon: k.themen.length === 1 && k.themen[0] === "balkon",
      hoehe: k.hoehe,
      kurz: k.was,
      bedingungen: [`gilt nur in ${k.ort}`, k.hinweis].filter(Boolean),
      antrag: "vorher",
      intern: { href: `/forderungen/landesforderungen/${land.slug}`, label: `Alle Programme in ${land.name}` },
    }));

  const hinweise = vorhaben.filter((v) => LUECKEN[v] && (v !== "wallbox" || rolle !== "vermieter")).map((v) => LUECKEN[v]);
  const ohneLandesdaten = vorhaben.filter((v) => ["wallbox", "waermepumpe", "sanierung"].includes(v));

  return { bund, land: landProgramme, kommunal, hinweise, ohneLandesdaten };
}
