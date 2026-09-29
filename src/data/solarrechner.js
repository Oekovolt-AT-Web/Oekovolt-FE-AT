// src/data/solarrechner.js
//
// Alle Annahmen des Solarrechners (Österreich) an EINER Stelle. Wenn sich Preise
// oder Erfahrungswerte ändern, nur hier anpassen – Rechner, Ergebnisse und die
// ausgewiesenen Hinweistexte ziehen sich alles hieraus.
//
// WICHTIG: Richtwerte für eine erste Orientierung, keine Angebote und keine
// Ökovolt-Preise. Stand: 29.09.2026. Jede Zahl mit Quelle und Stand im Kommentar.
//
// Exportnamen und Signaturen (ANNAHMEN, AUSRICHTUNGEN, NEIGUNGEN, preisProKwp …)
// werden von vielen Seiten importiert – nur ERGÄNZEN, nichts umbenennen.
// Neu (AT): ZIELGRUPPEN, zielgruppeGrenzen, preisProKwp(kwp, zielgruppe),
// speicherPreisProKwh, strompreisGewerbe, betriebskostenProKwp, PREISQUELLEN.
//
// Preislogik: Stützstellen sind NETTO. Für „privat“ rechnet preisProKwp() mit
// 20 % USt. brutto – der befristete 0-%-Satz (§ 28 Abs. 62 UStG) galt nur vom
// 01.01.2024 bis 31.03.2025 (bei Vertrag vor 07.03.2025 bis 31.12.2025);
// 2026 gilt der Normalsteuersatz (RIS, UStG § 28, Fassung 30.07.2026).
// Für Gewerbe/Landwirtschaft wird netto gerechnet (Vorsteuerabzug).

export const ANNAHMEN = {
  // --- Ertrag ---------------------------------------------------------
  // Spezifischer Jahresertrag in kWh je kWp bei Süd, 35° Neigung.
  // PVGIS 5.2 (SARAH2, 14 % Systemverluste, abgefragt 28.09.2026) für die neun
  // Landeshauptstädte: Wien 1.176 · Linz 1.123 · Salzburg 1.055 · Graz 1.206 ·
  // Innsbruck 1.242 · Klagenfurt 1.222 · St. Pölten 1.103 · Eisenstadt 1.181 ·
  // Bregenz 1.121 → Mittel ≈ 1.159 kWh/kWp. Wir rechnen rund 5 % vorsichtiger
  // (Schnee, Verschmutzung, Horizont) mit 1.100 kWh/kWp. Zum Vergleich: IEA PVPS
  // National Survey Report Austria 2024 nennt 1.050 kWh/kWp als Mittel ALLER
  // Anlagen (inkl. ungünstiger Ausrichtung); die Marktstatistik 2024 rechnet mit
  // 1.000 Volllaststunden.
  ertragProKwpSued: 1100,

  // Modulfläche: Schrägdach rund 5 m² je kWp; aufgeständertes Flachdach (Ost-West,
  // Reihenabstände, Randabstände) rund 7 m² je kWp (Richtwert).
  qmProKwp: 5,
  qmProKwpFlachdach: 7,

  // Umsatzsteuer Österreich (Normalsteuersatz, 2026)
  ust: 0.2,

  // --- Anlagenpreise NETTO (€/kWp, schlüsselfertig) ---------------------
  // Stützstellen, dazwischen linear interpoliert (siehe preisProKwp()).
  // Quellen:
  //  - Biermayr et al., „Innovative Energietechnologien in Österreich –
  //    Marktentwicklung 2024“, Schriftenreihe 23/2025 (BMIMI, Juni 2025), S. 90–92:
  //    5 kWp 1.551 €/kWp · 10 kWp 1.336 €/kWp · 30–50 kWp 806 €/kWp (netto).
  //    https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf
  //  - IEA PVPS National Survey Report Austria 2024, Tab. 8 (Schätzwerte, netto):
  //    Gewerbedach 10–100 kWp 1.000 · 100–250 kWp 900 · Industrie > 250 kWp 800 ·
  //    Freifläche 1–20 MW 600–800 €/kWp.
  //    https://iea-pvps.org/wp-content/uploads/2025/10/IEA-PVPS-Task-1-NSR-Austria-2024.pdf
  //  Eine Ausgabe „Marktentwicklung 2025“ war Ende 09/2026 nicht veröffentlicht.
  //  Zwischen 20 und 100 kWp liegen wir bewusst über dem Marktstatistik-Wert für
  //  30–50 kWp (806 €/kWp), weil Gewerbeanlagen Zusatzkosten tragen (Statik,
  //  Kran, Trafo-/Zählerumbau, Brandschutz nach OVE R 11-1).
  preisProKwp: [
    { kwp: 5, eur: 1550 },
    { kwp: 10, eur: 1340 },
    { kwp: 20, eur: 1100 },
    { kwp: 50, eur: 950 },
    { kwp: 100, eur: 900 },
    { kwp: 250, eur: 850 },
    { kwp: 500, eur: 800 },
    { kwp: 1000, eur: 750 },
  ],

  // --- Speicherpreise NETTO (€/kWh nutzbar, gemeinsam mit PV installiert) ---
  // BMWET / FH Technikum Wien, „PV-Batteriespeichersysteme – Marktentwicklung 2024“
  // (Stand 16.06.2025): mittlerer Systempreis schlüsselfertig 2024 ≈ 706 €/kWh
  // nutzbar exkl. USt. (2023: 840 €/kWh, −16 %). Fortgeschrieben mit dem
  // Preisrückgang auf 2026 rechnen wir für Heimspeicher mit 550 €/kWh netto.
  // Gewerbespeicher (ab ca. 50 kWh) sind in der Statistik nur teilweise erfasst –
  // die größeren Stützstellen sind Richtwerte (fallende Packpreise lt. BloombergNEF
  // 12/2025), NICHT statistisch belegt; im Angebot konkret prüfen.
  speicherPreise: [
    { kwh: 5, eur: 650 },
    { kwh: 10, eur: 550 },
    { kwh: 50, eur: 480 },
    { kwh: 100, eur: 450 },
    { kwh: 500, eur: 380 },
    { kwh: 1000, eur: 340 },
  ],
  // Privater Heimspeicher BRUTTO je kWh (10-kWh-Klasse × 1,2) – Feld aus der
  // DE-Fassung, wird von Ratgebern und Rechnern gelesen.
  speicherPreisProKwh: 660,
  // Gewerbespeicher: Lade-/Entladeleistung je kWh Kapazität in der Simulation
  gewerbeSpeicherCRate: 0.5,

  // --- Verbrauch & Eigenverbrauch (Haushalt) ----------------------------
  // Haushalte: Autarkie über Sättigungskurven in Abhängigkeit vom Verhältnis
  // Erzeugung/Verbrauch sowie Speicher/Verbrauch (angelehnt an die
  // Simulationsergebnisse des HTW-Berlin-Unabhängigkeitsrechners; Lastprofile
  // von Haushalten in AT und DE sind vergleichbar):
  //   ohne Speicher:  a0   = autarkieOhneSpeicherMax * (1 - e^(-k * Erzeugung/Verbrauch))
  //   Obergrenze:     amax = autarkieMitSpeicherMax  * (1 - e^(-k * Erzeugung/Verbrauch))
  //   mit Speicher:   a    = a0 + (amax - a0) * (1 - e^(-k * kWh Speicher je MWh Verbrauch))
  // Betriebe (Gewerbe/Landwirtschaft) werden stündlich simuliert
  // (src/lib/rechner/profile.js, betriebsLast()).
  autarkieOhneSpeicherMax: 0.38,
  autarkieOhneSpeicherK: 1.3,
  autarkieMitSpeicherMax: 0.8,
  autarkieMitSpeicherK: 1.4,
  speicherK: 1.2,
  autarkieMax: 0.8,
  // Mit Speicher geht ein Teil der Energie als Lade-/Entladeverlust verloren.
  eigenverbrauchMaxAnteil: 0.92,

  // --- Strompreis Haushalt (€/kWh, brutto) -------------------------------
  // Vermeidbarer Arbeitspreis = Energie + Netz-Arbeitspreis + Netzverlust +
  // Abgaben je kWh inkl. 20 % USt., OHNE fixe Pauschalen (die spart PV nicht).
  //  - E-Control Preismonitor 01.09.2026, 3.500 kWh, lokale Versorger:
  //    890,91 € (TIWAG) bis 1.218,11 € (Energie Klagenfurt) Jahresgesamtpreis
  //    ≈ 25,5–34,8 ct/kWh; z. B. Wien Energie 1.141,14 € ≈ 32,6 ct/kWh.
  //    https://www.e-control.at/preismonitor
  //  - Eurostat nrg_pc_204, AT, Band DC, 2. Hj. 2025: 32,72 ct/kWh inkl. Steuern.
  //  - Fixanteile (Netz-Leistungspauschale 54 €/a lt. SNE-V 2026, Erneuerbaren-
  //    Förderpauschale 19,02 €/a, Grundpreis Energie) ≈ 3–4 ct/kWh bei 3.500 kWh;
  //    Elektrizitätsabgabe 2026 für Haushalte 0,1 statt 1,5 ct/kWh (ElAbgG § 4).
  //  → 28 ct/kWh als vorsichtiger vermeidbarer Mittelwert.
  strompreis: 0.28,

  // --- Strompreis Gewerbe/Landwirtschaft (ct/kWh, NETTO) ------------------
  // Vermeidbarer Arbeitspreis nach Jahresverbrauch (log-linear interpoliert).
  // Basis Eurostat nrg_pc_205, AT, 2. Hj. 2025, ohne USt. (X_VAT):
  //   IA < 20 MWh 28,06 · IB 20–499 MWh 23,20 · IC 500–1.999 MWh 19,86 ·
  //   ID 2–20 GWh 17,99 ct/kWh.
  // Abzüge: Leistungspreis (≈ 10 % der Kosten leistungsgemessener Kunden; SNE-V
  // 2026 z. B. OÖ NE 7 gemessen 52,56 €/kW/a) spart PV kaum; Elektrizitätsabgabe
  // 2026 für Nicht-Haushalte 0,82 statt 1,5 ct/kWh (ElAbgG § 4, befristet 2026).
  strompreisGewerbe: [
    { kwh: 10000, ct: 26 },
    { kwh: 100000, ct: 20 },
    { kwh: 1000000, ct: 17 },
    { kwh: 5000000, ct: 15.5 },
  ],

  // --- Betriebskosten (€/kWp und Jahr) ------------------------------------
  // Versicherung, Wartung/Prüfung, Monitoring, Messentgelt, Rücklage für den
  // Wechselrichtertausch. Richtwerte (keine österreichische Erhebung verfügbar):
  // Privat 25 €/kWp brutto; Betriebe netto von 18 €/kWp (10 kWp) bis 10 €/kWp (1 MWp).
  betriebskostenProKwp: 25,
  betriebskostenGewerbe: [
    { kwp: 10, eur: 18 },
    { kwp: 100, eur: 14 },
    { kwp: 250, eur: 12 },
    { kwp: 1000, eur: 10 },
  ],

  // --- Entwicklung über 20 Jahre (Cashflow) ---------------------------
  // Leistungsverlust der Module pro Jahr (Herstellergarantien typ. 0,4–0,5 %).
  degradationProJahr: 0.005,
  // Jährliche Steigerung des ersetzten Strompreises (wählbar im Rechner).
  // Keine offizielle Prognose von E-Control/Energieagentur verfügbar. Kontext:
  // Day-Ahead-Mittel AT 2024 81,9 · 2025 99,0 · 2026 (bis 27.09.) 121,3 €/MWh
  // (eigene Auswertung Energy-Charts). 2 % ≈ Inflationsniveau, bewusst vorsichtig.
  strompreisSteigerungOptionen: [0, 0.02, 0.04],
  strompreisSteigerung: 0.02,
  // Kostensteigerung Betrieb (Inflation) pro Jahr
  betriebskostenSteigerung: 0.02,

  // --- CO₂ --------------------------------------------------------------
  // Emissionskoeffizient der durch PV substituierten Strommenge in Österreich:
  // 258,2 g CO₂äqu/kWh (Marktentwicklung 2024, Kap. 7.4, Tab. 34 – Berechnung
  // Technikum Wien 2025, Basis E-Control-Betriebsstatistik).
  co2KgProKwh: 0.2582,

  // --- EAG-Investitionszuschuss 2026 (optional im Rechner) ----------------
  // EAG-Investitionszuschüsseverordnung-Strom, BGBl. II Nr. 12/2026, § 5 (RIS,
  // abgerufen 28.09.2026): Kategorie A bis 10 kWp 150 €/kWp · B > 10–20 kWp
  // 140 €/kWp · C > 20–100 kWp höchstens 130 €/kWp · D > 100–1.000 kWp höchstens
  // 120 €/kWp · Stromspeicher 150 €/kWh (nur mit PV, förderfähig bis 50 kWh).
  // Zu-/Abschläge (§ 6: Made in Europe, innovativ, −25 % Grünland) nicht berücksichtigt.
  // Vergabe nur in Fördercalls (2026: 23.04.–11.05., 16.06.–30.06., 08.10.–22.10.)
  // nach Budget – kein Rechtsanspruch; C und D sind Höchstsätze (Gebotsverfahren).
  eagInvestitionszuschuss: {
    kategorien: [
      { id: "A", bisKwp: 10, eurProKwp: 150 },
      { id: "B", bisKwp: 20, eurProKwp: 140 },
      { id: "C", bisKwp: 100, eurProKwp: 130 },
      { id: "D", bisKwp: 1000, eurProKwp: 120 },
    ],
    speicherEurProKwh: 150,
    speicherMaxKwh: 50,
    quelle: "EAG-IZV, BGBl. II Nr. 12/2026, § 5",
    naechsterCall: "8. bis 22. Oktober 2026",
  },

  // --- Investitionsfreibetrag (nur Betriebe, Hinweis) --------------------
  // § 11 EStG: 10 % bzw. 15 % für Öko-Investitionen; für Anschaffungen vom
  // 01.11.2025 bis 31.12.2026 erhöht auf 20 % bzw. 22 % (§ 124b Z 480 EStG).
  // Bemessungsgrundlage max. 1 Mio. € je Wirtschaftsjahr. PV gilt als
  // Öko-Investition, wenn sie in der Herkunftsnachweisdatenbank der E-Control
  // registriert ist (BGBl. II Nr. 155/2023, § 1 Abs. 2 Z 5). Steuereffekt
  // beispielhaft mit 23 % Körperschaftsteuer.
  ifb: {
    satzOeko: 0.22,
    satzOekoAb2027: 0.15,
    gueltigBis: "2026-12-31",
    bemessungsgrundlageMax: 1000000,
    koest: 0.23,
    hinweis:
      "Investitionsfreibetrag 22 % für Öko-Investitionen bei Anschaffung bis 31.12.2026 (§ 11 i. V. m. § 124b Z 480 EStG), danach 15 %. Voraussetzung u. a.: Registrierung der Anlage in der Herkunftsnachweisdatenbank der E-Control. Nicht im Cashflow enthalten – bitte mit der Steuerberatung abstimmen.",
  },
};

// Zielgruppen des Solarrechners inkl. Eingabegrenzen
export const ZIELGRUPPEN = [
  {
    id: "privat",
    label: "Privat",
    kwp: { min: 3, max: 35, raster: 0.5, standard: 10 },
    verbrauch: { min: 1500, max: 25000, raster: 250, standard: 4500 },
    speicher: { max: 30, raster: 1, standard: 8 },
    neigungStandard: "mittel",
  },
  {
    id: "gewerbe",
    label: "Gewerbe",
    kwp: { min: 10, max: 1000, raster: 5, standard: 100 },
    verbrauch: { min: 20000, max: 5000000, raster: 1000, standard: 250000 },
    speicher: { max: 2000, raster: 10, standard: 0 },
    neigungStandard: "flach",
  },
  {
    id: "landwirtschaft",
    label: "Landwirtschaft",
    kwp: { min: 10, max: 1000, raster: 5, standard: 50 },
    verbrauch: { min: 10000, max: 2000000, raster: 1000, standard: 60000 },
    speicher: { max: 2000, raster: 10, standard: 0 },
    neigungStandard: "mittel",
  },
];

/** Grenzen/Standardwerte einer Zielgruppe (Fallback privat). */
export function zielgruppeGrenzen(id) {
  return ZIELGRUPPEN.find((z) => z.id === id) || ZIELGRUPPEN[0];
}

// Betriebstage und Schichtmodelle (nur Gewerbe) – wirken auf das Lastprofil
export const BETRIEBSTAGE = [
  { id: 5, label: "Mo–Fr" },
  { id: 6, label: "Mo–Sa" },
  { id: 7, label: "täglich" },
];
export const SCHICHTEN = [
  { id: 1, label: "1 Schicht", zeit: "ca. 7–16 Uhr" },
  { id: 2, label: "2 Schichten", zeit: "ca. 6–22 Uhr" },
  { id: 3, label: "3 Schichten", zeit: "rund um die Uhr" },
];

// Ausrichtung: Faktor auf den Süd-Ertrag.
// PVGIS 5.2, Wien, 35°, 14 % Verluste (28.09.2026): Süd 1.176 · Südwest 1.102
// (0,94) · Ost bzw. West 920 (0,78) · Nord 598 (0,51) kWh/kWp. Ost-West bei 15°
// Neigung (typisch aufgeständert) 968 kWh/kWp = 0,82 des Süd-35°-Werts → 0,80.
export const AUSRICHTUNGEN = [
  { id: "sued", label: "Süd", faktor: 1.0 },
  { id: "suedost", label: "Südost / Südwest", faktor: 0.94 },
  { id: "ost-west", label: "Ost / West", faktor: 0.8 },
  { id: "nord", label: "Nord", faktor: 0.55 },
];

// Dachneigung: Faktor auf den Ertrag.
// PVGIS 5.2, Wien, Süd: 10° 1.070 (0,91) · 35° 1.176 (1,00) · 50° 1.160 (0,99).
// Steildächer über 40° vorsichtig 0,96 (Alpenraum oft 45–60°).
export const NEIGUNGEN = [
  { id: "flach", label: "Flachdach (0–15°)", faktor: 0.91 },
  { id: "mittel", label: "Schrägdach (15–40°)", faktor: 1.0 },
  { id: "steil", label: "Steiles Dach (über 40°)", faktor: 0.96 },
];

/** Lineare Interpolation über Stützstellen [{ [x]: …, [y]: … }]. */
function interpoliere(punkte, x, xKey, yKey) {
  if (x <= punkte[0][xKey]) return punkte[0][yKey];
  const letzte = punkte[punkte.length - 1];
  if (x >= letzte[xKey]) return letzte[yKey];
  for (let i = 0; i < punkte.length - 1; i++) {
    const a = punkte[i];
    const b = punkte[i + 1];
    if (x >= a[xKey] && x <= b[xKey]) {
      const t = (x - a[xKey]) / (b[xKey] - a[xKey]);
      return a[yKey] + t * (b[yKey] - a[yKey]);
    }
  }
  return letzte[yKey];
}

/**
 * Anlagenpreis je kWp (schlüsselfertig), linear zwischen den Stützstellen.
 * @param {number} kwp
 * @param {"privat"|"gewerbe"|"landwirtschaft"} [zielgruppe="privat"]
 *   privat = BRUTTO inkl. 20 % USt. (Standard, wie bisher „Endpreis“),
 *   gewerbe/landwirtschaft = NETTO.
 */
export function preisProKwp(kwp, zielgruppe = "privat") {
  const netto = interpoliere(ANNAHMEN.preisProKwp, kwp, "kwp", "eur");
  return zielgruppe === "privat" ? netto * (1 + ANNAHMEN.ust) : netto;
}

/** Netto-Anlagenpreis je kWp (für Gewerbe-Texte und Tabellen). */
export const preisProKwpNetto = (kwp) => preisProKwp(kwp, "gewerbe");

/** Speicherpreis je kWh (privat brutto, Betriebe netto). */
export function speicherPreisProKwh(kwh, zielgruppe = "privat") {
  const netto = interpoliere(ANNAHMEN.speicherPreise, kwh, "kwh", "eur");
  return zielgruppe === "privat" ? netto * (1 + ANNAHMEN.ust) : netto;
}

/** Vermeidbarer Netto-Arbeitspreis für Betriebe in €/kWh (log-linear nach Jahresverbrauch). */
export function strompreisGewerbe(kwh) {
  const p = ANNAHMEN.strompreisGewerbe;
  const lx = Math.log10(Math.max(kwh, 1));
  const punkte = p.map((x) => ({ l: Math.log10(x.kwh), ct: x.ct }));
  return interpoliere(punkte, lx, "l", "ct") / 100;
}

/** Betriebskosten je kWp und Jahr (privat brutto, Betriebe netto). */
export function betriebskostenProKwp(kwp, zielgruppe = "privat") {
  if (zielgruppe === "privat") return ANNAHMEN.betriebskostenProKwp;
  return interpoliere(ANNAHMEN.betriebskostenGewerbe, kwp, "kwp", "eur");
}

/**
 * EAG-Investitionszuschuss (Höchstsätze 2026) für PV und Speicher in Euro.
 * Kategorie nach Anlagengröße; über 1.000 kWp keine Investitionsförderung.
 */
export function eagZuschuss(kwp, speicherKwh = 0) {
  const z = ANNAHMEN.eagInvestitionszuschuss;
  // Über 1.000 kWp: Kategorie D, gefördert anteilig bis 1.000 kWp (EAG-AS, FAQ 2026 Fragen 19 und 20)
  const kat = z.kategorien.find((k) => kwp <= k.bisKwp) ?? z.kategorien.find((k) => k.id === "D");
  if (!kat || !(kwp > 0)) return { kategorie: null, pv: 0, speicher: 0, summe: 0 };
  const pv = Math.min(kwp, 1000) * kat.eurProKwp;
  const speicher = Math.min(Math.max(speicherKwh, 0), z.speicherMaxKwh) * z.speicherEurProKwh;
  return { kategorie: kat.id, pv, speicher, summe: pv + speicher };
}

/** Quellen für Annahmen-Boxen und Ratgeber (Name, URL, Stand). */
export const PREISQUELLEN = [
  { name: "Marktentwicklung 2024 – Innovative Energietechnologien in Österreich (BMIMI, 06/2025)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf" },
  { name: "IEA PVPS National Survey Report Austria 2024", url: "https://iea-pvps.org/wp-content/uploads/2025/10/IEA-PVPS-Task-1-NSR-Austria-2024.pdf" },
  { name: "PVGIS (EU JRC)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/" },
  { name: "E-Control Preismonitor", url: "https://www.e-control.at/preismonitor" },
  { name: "Eurostat Strompreise Nicht-Haushalte (nrg_pc_205)", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table" },
  { name: "OeMAG Marktpreis", url: "https://www.oem-ag.at/marktpreis" },
];
