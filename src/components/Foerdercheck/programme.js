// src/components/Foerdercheck/programme.js
//
// Datenbasis und Logik des Förder-Checks (/foerdercheck), Österreich.
// BUND: EAG, KPC, Klima- und Energiefonds, Steuer – aus
// @/components/Forderungen/Shared/bund. LAND: aus @/data/bundeslaender,
// damit Karte, Landesseiten und Förder-Check dieselbe Quelle nutzen.

import { EAG_IZ, KPC_PROGRAMME, MARKTPRAEMIE, STEUER } from "@/components/Forderungen/Shared/bund";
import { alleBundeslaender, STAND, VORHABEN, ZIELGRUPPEN } from "@/data/bundeslaender";

export { STAND, VORHABEN, ZIELGRUPPEN };

// Art -> Darstellung im Ergebnis
export const ARTEN = {
  zuschuss: "Zuschuss",
  praemie: "Marktprämie",
  steuer: "Steuervorteil",
  entlastung: "Entlastung",
  beratung: "Beratung",
};

// Zeitpunkt des Antrags
export const ANTRAG = {
  vorIbn: { label: "Antrag vor der Inbetriebnahme", warn: true },
  vorher: { label: "Antrag vor der Bestellung", warn: true },
  nachher: { label: "Antrag nach Fertigstellung", warn: false },
  gebot: { label: "Gebot zum Gebotstermin", warn: true },
  automatisch: { label: "Ohne Antrag – steuerlich", warn: false },
  anzeige: { label: "Anzeige beim Finanzamt", warn: false },
  frist: { label: "Einreichfrist beachten", warn: true },
};

const ALLE_ZG = ZIELGRUPPEN.map((z) => z.id);
const PV = ["pv-dach", "freiflaeche", "agri-pv"];

export const BUND = [
  {
    id: "eag-iz",
    name: "EAG-Investitionszuschuss Photovoltaik",
    traeger: "OeMAG / EAG-Förderabwicklungsstelle",
    art: "zuschuss",
    themen: PV,
    zielgruppen: ALLE_ZG,
    hoehe: "150 €/kWp (A) bis max. 120 €/kWp (D)",
    kurz: `Zuschuss für neue oder erweiterte PV bis 1.000 kWp; max. 30 % der Nettokosten. Nächster Fördercall: ${EAG_IZ.naechsterCall.zeitraum}.`,
    bedingungen: ["Kategorie C und D: Gebot in €/kWp, Reihung nach niedrigstem Förderbedarf", "Freifläche und Grünland: 25 % Abschlag", "Agri-PV mit Hauptnutzung Landwirtschaft ohne Abschlag, vertikal bzw. ab 2 m Unterkante +30 %", "Genehmigungen und Netzbestätigung müssen beim Antrag vorliegen"],
    antrag: "vorIbn",
    extern: { href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/", label: "EAG-Abwicklungsstelle" },
    intern: { href: "/forderungen/bundesfoerderung", label: "EAG-Zuschuss im Detail" },
  },
  {
    id: "eag-speicher",
    name: "EAG-Investitionszuschuss Stromspeicher",
    traeger: "OeMAG / EAG-Förderabwicklungsstelle",
    art: "zuschuss",
    themen: ["speicher"],
    zielgruppen: ALLE_ZG,
    hoehe: "150 €/kWh",
    kurz: "Speicherzuschuss gemeinsam mit einer neuen oder erweiterten PV-Anlage im selben Förderantrag.",
    bedingungen: ["mindestens 0,5 kWh je kWp", "gefördert werden max. 50 kWh je Anlage", "Speicher allein oder Erweiterung eines bestehenden Speichers nicht förderfähig"],
    antrag: "vorIbn",
    extern: { href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/", label: "EAG-Abwicklungsstelle" },
    intern: { href: "/forderungen/bundesfoerderung#kategorien", label: "Speicherförderung" },
  },
  {
    id: "marktpraemie",
    name: "EAG-Marktprämie Photovoltaik",
    traeger: "OeMAG – Ausschreibung",
    art: "praemie",
    themen: PV,
    zielgruppen: ["unternehmen", "landwirtschaft", "gemeinde", "energiegemeinschaft"],
    hoehe: "bis 7,77 ct/kWh anzulegender Wert",
    kurz: `Alternative zum Investitionszuschuss für Anlagen über 10 kWp: Prämie über 20 Jahre. Nächster Gebotstermin: ${MARKTPRAEMIE.termine[3].datum}.`,
    bedingungen: ["175.000 kWp Volumen je Gebotstermin", "Freifläche im Grünland: 25 % Abschlag auf den Zuschlagswert", "nicht zusammen mit dem Investitionszuschuss"],
    antrag: "gebot",
    extern: { href: "https://www.eag-abwicklungsstelle.at", label: "EAG-Abwicklungsstelle" },
    intern: { href: "/forderungen/bundesfoerderung#marktpraemie", label: "Marktprämie" },
  },
  {
    id: "ifb",
    name: `Investitionsfreibetrag ${STEUER.ifb.satzOekoTemp} %`,
    traeger: "§ 11 EStG",
    art: "steuer",
    themen: [...PV, "speicher", "laden"],
    zielgruppen: ["unternehmen", "landwirtschaft"],
    hoehe: `${STEUER.ifb.satzOekoTemp} % der Anschaffungskosten`,
    kurz: `Zusätzliche Betriebsausgabe für PV, Speicher und Ladestationen bei Anschaffung ${STEUER.ifb.zeitraum}; ab 2027 wieder 15 %.`,
    bedingungen: ["Bemessungsgrundlage max. 1 Mio. € je Wirtschaftsjahr", "Behaltefrist 4 Jahre", "nicht bei pauschaler Gewinnermittlung"],
    antrag: "automatisch",
    intern: { href: "/forderungen/steuerlich#ifb-rechner", label: "IFB-Rechner" },
  },
  {
    id: "elab",
    name: "Befreiung von der Elektrizitätsabgabe",
    traeger: "§ 2 Abs. 1 Z 4 ElAbgG",
    art: "entlastung",
    themen: PV,
    zielgruppen: ALLE_ZG,
    hoehe: "0 € Abgabe auf Eigenverbrauch",
    kurz: "Selbst erzeugter und verbrauchter Strom aus Erneuerbaren ist ohne Mengengrenze befreit – auch innerhalb einer Erneuerbare-Energie-Gemeinschaft.",
    bedingungen: ["Anzeige beim Finanzamt", "Aufzeichnung von Erzeugung und Eigenverbrauch"],
    antrag: "anzeige",
    intern: { href: "/forderungen/steuerlich", label: "Steuervorteile" },
  },
  {
    id: "eg-netzentgelt",
    name: "Reduzierte Netzentgelte für Energiegemeinschaften",
    traeger: "Netzbetreiber / E-Control",
    art: "entlastung",
    themen: [...PV, "speicher"],
    zielgruppen: ["energiegemeinschaft", "gemeinde"],
    hoehe: "−57 % lokal, −28 % regional (NE 6/7)",
    kurz: "Reduktion auf den Arbeitspreis des Netznutzungsentgelts für Strom innerhalb einer Erneuerbare-Energie-Gemeinschaft, Sätze bis 31.12.2026.",
    bedingungen: ["ab 01.10.2026 Regeln des ElWG", "Sätze ab 2027 legt die E-Control neu fest", "Bürgerenergiegemeinschaften ohne Reduktion"],
    antrag: "automatisch",
    intern: { href: "/energiegemeinschaften", label: "Energiegemeinschaften" },
  },
  ...KPC_PROGRAMME.map((p) => ({
    id: `kpc-${p.id}`,
    name: p.name,
    traeger: p.traeger,
    art: "zuschuss",
    themen: p.themen,
    zielgruppen: p.zielgruppen,
    hoehe: p.hoehe,
    kurz: p.was,
    bedingungen: [p.status, p.pruefen ? `Stand ${STAND.label}, bitte bei der Förderstelle prüfen` : null].filter(Boolean),
    antrag: p.id === "insel" ? "vorher" : "frist",
    extern: { href: p.url, label: "Zum Programm" },
  })),
];

// Hinweise, wenn es für ein Vorhaben keine laufende Bundesförderung gibt
export const LUECKEN = {
  laden: "Die Bundesförderungen für Ladeinfrastruktur (eRide für Betriebe und Private) sind wegen ausgeschöpfter Budgets beendet. Für Betriebe bleibt der Investitionsfreibetrag; einzelne Länder und Gemeinden fördern regional.",
  waermepumpe: "Kesseltausch und Sanierungsbonus 2026 für Private sind ausgeschöpft. Für Betriebe fördert die KPC Wärmepumpen weiterhin; einkommensschwache Haushalte erhalten „Sauber Heizen für Alle“ über das Land.",
  "agri-pv": "Ein eigenes Agri-PV-Programm gibt es 2026 weder beim Bund noch bei den Ländern – gefördert wird über den EAG-Zuschuss (kein Abschlag bzw. +30 %) und die Marktprämie.",
};

/** Schlanke Länderliste für den Client. */
export function laenderFuerCheck() {
  return alleBundeslaender().map((l) => ({
    key: l.key,
    name: l.name,
    kuerzel: l.kuerzel,
    slug: l.slug,
    foerderart: l.foerderart,
    kurz: l.kurz,
    gemeinden: l.gemeinden,
    eg: { stelle: l.energiegemeinschaften.stelle, url: l.energiegemeinschaften.url },
    programme: l.programme.map((p) => ({ name: p.name, traeger: p.traeger, zielgruppen: p.zielgruppen, themen: p.themen, hoehe: p.hoehe, was: p.was, status: p.status, pruefen: Boolean(p.pruefen), url: p.url, quelle: p.quelle })),
  }));
}

/**
 * Ergebnis berechnen.
 * land: Eintrag aus laenderFuerCheck(); vorhaben: string[]; zielgruppe: string
 */
export function ermittleProgramme({ land, vorhaben, zielgruppe }) {
  const passt = (themen) => themen.some((t) => vorhaben.includes(t));

  const bund = BUND.filter((p) => passt(p.themen) && p.zielgruppen.includes(zielgruppe)).map((p) => ({
    ...p,
    ebene: "bund",
    fuer: p.themen.filter((t) => vorhaben.includes(t)),
  }));

  const landProgramme = (land?.programme || [])
    .filter((p) => passt(p.themen) && p.zielgruppen.includes(zielgruppe))
    .map((p, i) => ({
      id: `land-${land.key}-${i}`,
      name: p.name,
      traeger: p.traeger,
      art: "zuschuss",
      ebene: "land",
      fuer: p.themen.filter((t) => vorhaben.includes(t)),
      hoehe: p.hoehe,
      kurz: p.was,
      bedingungen: [p.status, p.pruefen ? `Stand ${STAND.label}, bitte bei der Förderstelle prüfen` : null].filter(Boolean),
      antrag: /nach (Fertigstellung|Inbetriebnahme)|nach Rechnung/i.test(p.status) ? "nachher" : "vorher",
      extern: { href: p.url, label: p.quelle },
      intern: { href: `/forderungen/landesforderungen/${land.slug}`, label: `Förderung in ${land.name}` },
    }));

  const hinweise = vorhaben.filter((v) => LUECKEN[v]).map((v) => LUECKEN[v]);
  const kombinationD = zielgruppe !== "privat" && vorhaben.some((v) => PV.includes(v)) && landProgramme.length > 0;

  return { bund, land: landProgramme, hinweise, kombinationD };
}
