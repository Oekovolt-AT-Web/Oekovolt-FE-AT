// src/data/foerderFristen.js
//
// Fristen-Kalender Förderung und Energierecht Österreich – Grundlage für
// /forderungen/fristen, das gleitende Fenster im Foerderkalender (−2 bis +10 Monate)
// und die Kalenderdatei /forderungen/fristen.ics?zielgruppe=….
//
// Jede Frist: { id (stabil, nie ändern – UID der ICS), datum (ISO, letzter Tag inklusive),
//   bis? (ISO, bei Zeitfenstern), titel, kurz, zielgruppen[], bundesland ("bund" | key),
//   art: einreichfrist | start | gebotstermin | rechtsaenderung | laufzeitende,
//   voraussichtlich (true = Termin nicht amtlich fixiert), pruefen (true = nur Sekundärquelle),
//   quelle { label, url }, seite (interne Seite), geprueftAm }
//
// Keine erfundenen Termine: Was nicht amtlich fixiert ist, trägt "voraussichtlich".

import { heuteWienIso } from "@/lib/programmStatus";

const BMWET_SYSTEM = { label: "BMWET – PV-Förderung wird Systemförderung (06.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-foerderung-wird-systemfoerderung.html" };
const EAG_KALENDER = { label: "EAG-Förderabwicklungsstelle – Förderkalender", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/" };
const LK_KTN = { label: "LK Kärnten – Letzter Fördercall 2026, Landesförderung ab Mitte Oktober (23.09.2026)", url: "https://ktn.lko.at/eag-investitionszuschuss-letzter-f%C3%B6rdercall-2026+2400+4457200" };
const STMK_SPEICHER = { label: "Land Steiermark – Ökofonds Innovative Energiespeicher 2026 (Kurzinformation 24.06.2026)", url: "https://www.technik.steiermark.at/cms/dokumente/13017115_161967760/8a73f732/2026-06-24_%C3%96kofonds_Kurzinformation_Energiespeicher%20v1.pdf" };
const KLIMAFONDS_GE = { label: "Klima- und Energiefonds – Gemeinsame Energienutzung 2026", url: "https://www.klimafonds.gv.at/foerderung/gemeinsame-energienutzung-2026/" };
const KLIMAFONDS_FLEX = { label: "Klima- und Energiefonds – Energiemanagement Flexibilisierung im Verteilnetz (Betriebe, Gemeinden, Vereine)", url: "https://www.klimafonds.gv.at/foerderung/energiemanagement-betriebe-2026/" };
const USP_IFB = { label: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html" };
const RIS_ELWG = { label: "RIS – BGBl. I Nr. 91/2025 (ElWG)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html" };
const PARLAMENT_ELABG = { label: "Parlamentskorrespondenz – Finanzausschuss vertagt Verlängerung der Elektrizitätsabgabe-Senkung (29.09.2026)", url: "https://www.ots.at/presseaussendung/OTS_20260929_OTS0144/finanzausschuss-diskutiert-forderungen-der-gruenen-zur-elektrizitaetsabgabe-energiekrisenbeitraege-und-dienstwaegen" };
const OOE_LEITFADEN = { label: "Land OÖ – Leitfaden 2026 Photovoltaik (Gebotstermine Marktprämie)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf" };
const BGLD = { label: "Land Burgenland – Energie und Förderungen", url: "https://www.burgenland.at/themen/bauen/wohnen/energie-neu/" };
const OOE_BETRIEBE = { label: "Land OÖ – Energiesparen in Betrieben", url: "https://www.land-oberoesterreich.gv.at/183291.htm" };
const VBG = { label: "Land Vorarlberg – Formulare (PV auf versiegelten Flächen)", url: "https://formulare.vorarlberg.gv.at/" };
const STMK_DOPPEL = { label: "Land Steiermark – Energieförderungen (Ökofonds)", url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/" };
const SALZBURG_NETZ = { label: "Salzburg Netz – Netzentgelte für Energiegemeinschaften", url: "https://www.salzburgnetz.at/stromnetz/energiegemeinschaften/erneuerbare-energie-gemeinschaften.html" };
const KLIMAFONDS_EG25 = { label: "Klima- und Energiefonds – Energiegemeinschaften 2025", url: "https://www.klimafonds.gv.at/foerderung/energiegemeinschaften-2025/" };

const ALLE = ["unternehmen", "landwirtschaft", "gemeinde", "privat", "energiegemeinschaft"];
const BETRIEB = ["unternehmen", "landwirtschaft", "gemeinde", "energiegemeinschaft"];
const GEPRUEFT = "2026-10-11";

export const FOERDER_FRISTEN = [
  // --- Rückblick (−2 Monate) ---
  { id: "marktpraemie-2026-09-24", datum: "2026-09-24", titel: "EAG-Marktprämie: 3. Gebotstermin 2026", kurz: "Gebotsfrist der Ausschreibung (175.000 kWp, Höchstpreis 7,77 ct/kWh) abgelaufen.", zielgruppen: BETRIEB, bundesland: "bund", art: "gebotstermin", quelle: OOE_LEITFADEN, seite: "/forderungen/bundesfoerderung#marktpraemie", geprueftAm: GEPRUEFT },
  { id: "klimafonds-eg-2025-ende", datum: "2026-09-30", titel: "Klimafonds „Energiegemeinschaften 2025“: Einreichfrist", kurz: "Verlängerte Frist 30.09.2026, 12 Uhr – abgelaufen. Nachfolger: Gemeinsame Energienutzung 2026.", zielgruppen: ["energiegemeinschaft"], bundesland: "bund", art: "einreichfrist", pruefen: true, quelle: KLIMAFONDS_EG25, seite: "/forderungen/bundesfoerderung#kpc", geprueftAm: GEPRUEFT },
  { id: "elwg-stufe-2026-10-01", datum: "2026-10-01", titel: "ElWG: Energiegemeinschaften neu, Peer-to-Peer-Verträge, Eigenversorgungsanlagen", kurz: "Stufe des Elektrizitätswirtschaftsgesetzes in Kraft (§§ 65–72 ElWG).", zielgruppen: ALLE, bundesland: "bund", art: "rechtsaenderung", quelle: RIS_ELWG, seite: "/energiegemeinschaften", geprueftAm: GEPRUEFT },
  { id: "klimafonds-ge-2026-start", datum: "2026-10-01", titel: "Klimafonds „Gemeinsame Energienutzung 2026“: Einreichung geöffnet", kurz: "01.10.2026, 12 Uhr bis 10.03.2027, 12 Uhr; Budget 6,9 Mio. €.", zielgruppen: ["energiegemeinschaft", "gemeinde", "unternehmen"], bundesland: "bund", art: "start", quelle: KLIMAFONDS_GE, seite: "/forderungen/bundesfoerderung#kpc", geprueftAm: GEPRUEFT },
  { id: "eag-call-2026-3-start", datum: "2026-10-08", bis: "2026-10-22", titel: "EAG-Fördercall 3/2026: Ticketziehung und Einreichung", kurz: "Ticketziehung 08.10., 17 Uhr; Anträge bis 22.10.2026 im EAG-Portal. Budget auf 38,5 Mio. € aufgestockt.", zielgruppen: ALLE, bundesland: "bund", art: "start", quelle: EAG_KALENDER, seite: "/forderungen/eag-foerdercall", geprueftAm: GEPRUEFT },
  // --- Ausblick ---
  { id: "kaernten-landesfoerderung-start-2026", datum: "2026-10-15", titel: "Kärnten: Landesförderung PV – Antragsportal voraussichtlich ab Mitte Oktober", kurz: "Laut LK Kärnten (23.09.2026) Anträge nach Fertigstellung voraussichtlich ab Mitte Oktober; genauer Tag nicht veröffentlicht.", zielgruppen: ["unternehmen", "privat"], bundesland: "kaernten", art: "start", voraussichtlich: true, quelle: LK_KTN, seite: "/forderungen/landesforderungen/landesfoerderungen-in-kaernten", geprueftAm: GEPRUEFT },
  { id: "eag-call-2026-3-ende", datum: "2026-10-22", titel: "EAG-Fördercall 3/2026: Einreichung endet", kurz: "Letzter Tag für den Förderantrag im EAG-Portal (23:59 Uhr) – sonst verfällt ein gezogenes Ticket.", zielgruppen: ALLE, bundesland: "bund", art: "einreichfrist", quelle: EAG_KALENDER, seite: "/forderungen/eag-foerdercall", geprueftAm: GEPRUEFT },
  { id: "steiermark-speicher-2026-modul1", datum: "2026-10-31", titel: "Steiermark Ökofonds „Innovative Energiespeicher 2026“: Modul 1 (Umsetzungskonzept)", kurz: "Einreichfrist Modul 1; Budget 100.000 €, Zuschuss 60–80 % der Planungskosten, max. 10.000 €.", zielgruppen: BETRIEB, bundesland: "steiermark", art: "einreichfrist", quelle: STMK_SPEICHER, seite: "/forderungen/landesforderungen/landesfoerderungen-in-steiermark", geprueftAm: GEPRUEFT },
  { id: "eag-2027-stichtag-2026-11-01", datum: "2026-11-01", titel: "Angekündigt: Projekte ab 01.11.2026 sollen 2027 im neuen EAG-System einreichen können", kurz: "BMWET-Eckpunkte vom 06.10.2026 – nicht beschlossen; Novelle braucht Zweidrittelmehrheit.", zielgruppen: ALLE, bundesland: "bund", art: "start", voraussichtlich: true, quelle: BMWET_SYSTEM, seite: "/forderungen/aktuell", geprueftAm: GEPRUEFT },
  { id: "marktpraemie-2026-12-10", datum: "2026-12-10", titel: "EAG-Marktprämie: 4. Gebotstermin 2026", kurz: "Laut Leitfaden Land OÖ (06/2026); im Förderkalender der Abwicklungsstelle am 11.10.2026 nicht eingetragen.", zielgruppen: BETRIEB, bundesland: "bund", art: "gebotstermin", voraussichtlich: true, pruefen: true, quelle: OOE_LEITFADEN, seite: "/forderungen/bundesfoerderung#marktpraemie", geprueftAm: GEPRUEFT },
  { id: "ifb-22-prozent-2026-12-31", datum: "2026-12-31", titel: "Investitionsfreibetrag 22 % (Öko-IFB): Anschaffung bis 31.12.2026", kurz: "Befristet erhöhter IFB (20 %/22 %) für Anschaffungen 01.11.2025–31.12.2026; danach wieder 10 %/15 %.", zielgruppen: ["unternehmen", "landwirtschaft"], bundesland: "bund", art: "laufzeitende", quelle: USP_IFB, seite: "/forderungen/steuerlich#ifb-rechner", geprueftAm: GEPRUEFT },
  { id: "elektrizitaetsabgabe-2026-12-31", datum: "2026-12-31", titel: "Gesenkte Elektrizitätsabgabe (0,82 ct/kWh) läuft aus – Verlängerung offen", kurz: "Finanzausschuss hat den Verlängerungsantrag am 29.09.2026 vertagt; Gespräche laufen.", zielgruppen: ALLE, bundesland: "bund", art: "laufzeitende", quelle: PARLAMENT_ELABG, seite: "/forderungen/steuerlich", geprueftAm: GEPRUEFT },
  { id: "eeg-netzentgelt-2026-12-31", datum: "2026-12-31", titel: "EEG-Netzentgelt-Reduktion (−57 %/−28 %/−64 %): Sätze gelten bis 31.12.2026", kurz: "Ab 2027 neue Sätze durch die E-Control (Systemnutzungsentgelte-Verordnung) – noch nicht verordnet.", zielgruppen: ["energiegemeinschaft", "gemeinde"], bundesland: "bund", art: "laufzeitende", quelle: SALZBURG_NETZ, seite: "/energiegemeinschaften", geprueftAm: GEPRUEFT },
  { id: "kaernten-landesfoerderung-2026-12-31", datum: "2026-12-31", titel: "Kärnten: Landesförderung PV (Betriebe, Gemeinden, Private) – Richtlinie bis Ende 2026", kurz: "„Aus heutiger Sicht noch bis Ende 2026“ (LK Kärnten 23.09.2026); Antrag nach Fertigstellung.", zielgruppen: ["unternehmen", "gemeinde", "privat"], bundesland: "kaernten", art: "laufzeitende", voraussichtlich: true, quelle: LK_KTN, seite: "/forderungen/landesforderungen/landesfoerderungen-in-kaernten", geprueftAm: GEPRUEFT },
  { id: "burgenland-speicher-2026-12-31", datum: "2026-12-31", titel: "Burgenland: Stromspeicher-Förderung für Private", kurz: "Laut Sekundärquellen bis 31.12.2026; Antrag bis 6 Monate nach Rechnung.", zielgruppen: ["privat"], bundesland: "burgenland", art: "laufzeitende", voraussichtlich: true, pruefen: true, quelle: BGLD, seite: "/forderungen/landesforderungen/landesfoerderungen-in-burgenland", geprueftAm: GEPRUEFT },
  { id: "ooe-betriebe-2026-12-31", datum: "2026-12-31", titel: "Oberösterreich: Energiesparen in Betrieben (Landesaufschlag) bis 31.12.2026", kurz: "25 % Aufschlag auf die Bundesförderung (Effizienz, Abwärme, Wärmepumpen – nicht PV).", zielgruppen: ["unternehmen"], bundesland: "oberoesterreich", art: "laufzeitende", quelle: OOE_BETRIEBE, seite: "/forderungen/landesforderungen/landesfoerderungen-in-oberoesterreich", geprueftAm: GEPRUEFT },
  { id: "vorarlberg-versiegelt-2026-12-31", datum: "2026-12-31", titel: "Vorarlberg: PV auf versiegelten Flächen", kurz: "Laut Sekundärquellen bis 31.12.2026.", zielgruppen: ["unternehmen", "gemeinde", "privat"], bundesland: "vorarlberg", art: "laufzeitende", voraussichtlich: true, pruefen: true, quelle: VBG, seite: "/forderungen/landesforderungen/landesfoerderungen-in-vorarlberg", geprueftAm: GEPRUEFT },
  { id: "steiermark-doppelnutzung-2026-12-31", datum: "2026-12-31", titel: "Steiermark Ökofonds: innovative PV-Doppelnutzung", kurz: "Laut Sekundärquellen bis 31.12.2026.", zielgruppen: BETRIEB, bundesland: "steiermark", art: "laufzeitende", voraussichtlich: true, pruefen: true, quelle: STMK_DOPPEL, seite: "/forderungen/landesforderungen/landesfoerderungen-in-steiermark", geprueftAm: GEPRUEFT },
  { id: "elwg-netzentgelte-2027-01-01", datum: "2027-01-01", titel: "ElWG: neue Systemnutzungsentgelte und Infrastrukturbeitrag für Einspeiser", kurz: "Infrastrukturbeitrag max. 0,05 ct/kWh, Anlagen bis 20 kW befreit; neue EEG-Reduktionssätze.", zielgruppen: ALLE, bundesland: "bund", art: "rechtsaenderung", quelle: RIS_ELWG, seite: "/forderungen/richtlinien", geprueftAm: GEPRUEFT },
  { id: "klimafonds-ge-2026-ende", datum: "2027-03-10", titel: "Klimafonds „Gemeinsame Energienutzung 2026“: Einreichfrist", kurz: "10.03.2027, 12 Uhr; Budget 6,9 Mio. €; Schwerpunkte 1–3 über KPC, Schwerpunkt 4 über FFG.", zielgruppen: ["energiegemeinschaft", "gemeinde", "unternehmen"], bundesland: "bund", art: "einreichfrist", quelle: KLIMAFONDS_GE, seite: "/forderungen/bundesfoerderung#kpc", geprueftAm: GEPRUEFT },
  { id: "klimafonds-flex-2027-04-15", datum: "2027-04-15", titel: "Klimafonds „Energiemanagement – Flexibilisierung im Verteilnetz“: Einreichfrist", kurz: "15.04.2027, 12 Uhr – für Betriebe, Gemeinden und Vereine an Netzebene 6/7.", zielgruppen: ["unternehmen", "gemeinde"], bundesland: "bund", art: "einreichfrist", quelle: KLIMAFONDS_FLEX, seite: "/forderungen/bundesfoerderung#kpc", geprueftAm: GEPRUEFT },
  { id: "steiermark-speicher-2026-modul2", datum: "2027-07-31", titel: "Steiermark Ökofonds „Innovative Energiespeicher 2026“: Modul 2 (Umsetzung)", kurz: "Einreichfrist Modul 2; Budget 900.000 €, Zuschuss 30–50 % der Mehrkosten, max. 200.000 €.", zielgruppen: BETRIEB, bundesland: "steiermark", art: "einreichfrist", quelle: STMK_SPEICHER, seite: "/forderungen/landesforderungen/landesfoerderungen-in-steiermark", geprueftAm: GEPRUEFT },
];

export const FRISTEN_ARTEN = {
  einreichfrist: "Einreichfrist",
  start: "Start",
  gebotstermin: "Gebotstermin",
  rechtsaenderung: "Rechtsänderung",
  laufzeitende: "Laufzeitende",
};

export const FRISTEN_ZIELGRUPPEN = [
  { id: "betrieb", label: "Betrieb", gruppen: ["unternehmen"] },
  { id: "landwirtschaft", label: "Landwirtschaft", gruppen: ["landwirtschaft"] },
  { id: "gemeinde", label: "Gemeinde", gruppen: ["gemeinde", "energiegemeinschaft"] },
  { id: "privat", label: "Privat", gruppen: ["privat"] },
];

/** Monate zu einem ISO-Datum addieren (Kalenderarithmetik, UTC). */
export function monateAb(iso, monate) {
  const [j, m, t] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1 + monate, t));
  return d.toISOString().slice(0, 10);
}

/**
 * Gleitendes Fenster: Fristen von `vor` Monaten vor bis `nach` Monaten nach `heuteIso`,
 * optional nach Zielgruppe (betrieb|landwirtschaft|gemeinde|privat) und Bundesland gefiltert.
 */
export function fristenImFenster({ heuteIso, vor = 2, nach = 10, zielgruppe, bundesland } = {}) {
  const heute = heuteIso || heuteWienIso();
  const von = monateAb(heute, -vor);
  const bis = monateAb(heute, nach);
  const zg = FRISTEN_ZIELGRUPPEN.find((z) => z.id === zielgruppe);
  return FOERDER_FRISTEN.filter((f) => f.datum >= von && f.datum <= bis)
    .filter((f) => !zg || f.zielgruppen.some((g) => zg.gruppen.includes(g)))
    .filter((f) => !bundesland || f.bundesland === "bund" || f.bundesland === bundesland)
    .sort((a, b) => (a.datum < b.datum ? -1 : a.datum > b.datum ? 1 : 0));
}

/** Termin ist noch relevant („kommend“): Tag bzw. Ende des Zeitraums heute oder später. */
export function istKommend(f, heuteIso) {
  return (f.bis || f.datum) >= heuteIso;
}
