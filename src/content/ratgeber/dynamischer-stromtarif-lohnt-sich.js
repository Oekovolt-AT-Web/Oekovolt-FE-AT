// Ratgeber: Dynamischer Stromtarif in Österreich – lohnt er sich 2026?
// Marktdaten: eigene Auswertung der Day-Ahead-Preise Gebotszone AT auf Basis Energy-Charts
// (Fraunhofer ISE; Daten Bundesnetzagentur | SMARD.de, CC BY 4.0), Abruf 28.09.2026,
// Zeitraum 1.1.–27.9.2026 in Ortszeit; Vorjahre laut Faktenbasis R3.
// Netzentgelte: SNE-V 2018 idF BGBl. II Nr. 305/2025 (SNAP), Reform 2027: ElWG + SNE-G-V-Entwurf.
// Endkundenpreise (Fixpreis, Aufschlag) sind ANNAHMEN und in den Fußnoten offengelegt.

const zahl = (n, st = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: st, maximumFractionDigits: st });
const eur = (n) => zahl(Math.round(n)) + " €";
const ctKwh = (eurMwh) => zahl(eurMwh / 10, 1); // €/MWh -> ct/kWh

// Day-Ahead AT, €/MWh
const JAHR = { 2023: 102.2, 2024: 81.9, 2025: 99.0, 2026: 121.3 };
const MITTAG = { 2024: 57, 2025: 61, 2026: 62 }; // 11–15 Uhr
const ABEND = { 2024: 114, 2025: 139, 2026: 172 }; // 18–21 Uhr
const SPREIZUNG = { 2024: 102, 2025: 119, 2026: 149 }; // teuerste minus billigste Stunde, Tagesmittel
const NEGATIV = { 2023: 111, 2024: 307, 2025: 378, 2026: 259 }; // Stunden < 0 (2026 bis 27.9.)
const TIEF = { 2023: -500, 2024: -126, 2025: -253, 2026: -497 };
const MONAT_2025 = [134, 141, 104, 81, 71, 67, 88, 74, 92, 109, 116, 114];
const MONAT_2026 = [141, 109, 112, 87, 100, 107, 117, 148, 174];
const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const SPITZE_STUNDE = { wert: 592.8, wann: "14. September 2026, 19–20 Uhr" };
const SPITZE_VIERTEL = { wert: 645.2, wann: "24. Juni 2026, 20:45 Uhr" };

// Tagesverlauf 2026 (eigene Auswertung, €/MWh): Blöcke in Ortszeit
const BLOECKE = ["0–6 Uhr", "6–10 Uhr", "10–16 Uhr", "16–18 Uhr", "18–22 Uhr", "22–24 Uhr"];
const VERLAUF_WINTER = [105.6, 134.6, 103.3, 150.4, 147.6, 115.1]; // Jän–Mär 2026
const VERLAUF_SOMMER = [136.6, 130.8, 51.2, 106.8, 181.5, 160.1]; // Apr–Sep 2026 (bis 27.9.)
const PROFILPREIS_HAUSHALT = 129.0; // mit typischem Haushaltsprofil gewichtet, ohne PV
const PROFILPREIS_BETRIEB = 120.3; // Einschichtbetrieb Mo–Fr, gewichtet

// Ladefenster E-Auto 2026 (eigene Auswertung, €/MWh)
const LADEN = {
  abend: 171.7, // Mittel 18–21 Uhr
  nachtGesteuert: 117.2, // günstigste 3 Stunden je Nacht zwischen 18 und 7 Uhr
  tagGesteuert: 46.8, // günstigste 3 Stunden des Tages (meist mittags)
  tagWinter: 69.6, // dto. Jän–Mär
};

// Annahmen Beispielrechnung
const EAUTO_KWH = 3000; // 15.000 km × 20 kWh/100 km inkl. Ladeverluste
const FIX_CT = 15.0; // Energiepreis Fixpreistarif netto, Annahme
const AUFSCHLAG_CT = 1.5; // Aufschlag dynamischer Tarif netto, Annahme
const UST = 0.2;
const SNAP_OOE_CT = 6.29 * 0.2; // 20 % von 6,29 ct (NE 7 nicht gemessen, Netz OÖ 2026)
const kosten = (ctNetto) => (EAUTO_KWH * ctNetto * (1 + UST)) / 100;
const FALL = [
  { name: "Fixpreis (Annahme)", ct: FIX_CT, hinweis: "unabhängig von der Uhrzeit" },
  { name: "Dynamisch, Laden nach Ankunft 18–21 Uhr", ct: LADEN.abend / 10 + AUFSCHLAG_CT, hinweis: "keine Steuerung" },
  { name: "Dynamisch, gesteuert nachts", ct: LADEN.nachtGesteuert / 10 + AUFSCHLAG_CT, hinweis: "günstigste 3 h zwischen 18 und 7 Uhr" },
  { name: "Dynamisch, gesteuert tagsüber", ct: LADEN.tagGesteuert / 10 + AUFSCHLAG_CT, hinweis: "günstigste 3 h des Tages, Auto steht mittags" },
].map((f) => ({ ...f, kosten: kosten(f.ct) }));
const FIX = FALL[0].kosten;
const SNAP_VORTEIL = ((EAUTO_KWH / 2) * SNAP_OOE_CT * (1 + UST)) / 100; // halbes Jahr Sommerfenster

// Leistungspreis-Effekt: gleichzeitiges Laden in der billigsten Viertelstunde
const LP_NE7_OOE = 52.56; // €/kW/Jahr, NE 7 gemessen, Netz OÖ 2026 (Größenordnung, Werte 2027 offen)
const SPITZE_GLEICHZEITIG = 11 + 3 + 2; // Wallbox + Wärmepumpe + Grundlast, kW
const SPITZE_GESTAFFELT = 11 + 2; // Wallbox + Grundlast, Wärmepumpe zeitversetzt
const LP_MEHR = (SPITZE_GLEICHZEITIG - SPITZE_GESTAFFELT) * LP_NE7_OOE;

const artikel = {
  slug: "dynamischer-stromtarif-lohnt-sich",
  title: "Dynamischer Stromtarif in Österreich: Wann lohnt er sich 2026?",
  seoTitle: "Dynamischer Stromtarif Österreich 2026 | Ökovolt",
  kurzTitel: "Dynamischer Stromtarif",
  description:
    "Dynamischer Stromtarif in Österreich 2026: Spotpreise AT, Viertelstunden, Smart Meter, Risiken, SNAP und Leistungspreis 2027 – mit Rechenbeispiel E-Auto.",
  excerpt:
    "Spotpreis statt Fixpreis: Wie dynamische Tarife in Österreich funktionieren, was echte Day-Ahead-Preise 2026 zeigen und warum sich der Tarif nur mit Flexibilität rechnet – für Betriebe und Private mit PV, Speicher, E-Auto oder Wärmepumpe.",
  hauptKeyword: "dynamischer stromtarif",
  keywords: [
    "Dynamischer Stromtarif Österreich",
    "Spotpreis Stromtarif",
    "Dynamischer Stromtarif lohnt sich",
    "Stundentarif Strom Österreich",
    "Dynamischer Stromtarif E-Auto",
    "Spotmarkt Strom Gewerbe",
    "Day-Ahead-Preis Österreich",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Dienstleistungen/Smartphone/smart-home-3920905_1280.jpg",
  bildAlt: "Tablet mit Energiemanagement-App vor einem Einfamilienhaus",
  badge: { wert: `${ctKwh(MITTAG[2026])} vs. ${ctKwh(ABEND[2026])} ct`, text: "Börsenpreis mittags vs. abends, Ø 2026" },

  kurzFazit: [
    `**Ein dynamischer Stromtarif lohnt sich nur, wenn Sie Verbrauch in günstige Stunden verschieben können.** 2026 kostete Strom an der Börse (Gebotszone AT) mittags 11–15 Uhr im Mittel ${ctKwh(MITTAG[2026])} ct/kWh, abends 18–21 Uhr ${ctKwh(ABEND[2026])} ct/kWh.`,
    `**2026 ist teurer als 2025:** Der Day-Ahead-Durchschnitt lag von Jänner bis 27. September bei ${zahl(JAHR[2026], 1)} €/MWh (2025: ${zahl(JAHR[2025], 1)} €/MWh), im September bisher bei ${MONAT_2026[8]} €/MWh.`,
    `**Ohne Flexibilität zahlen Sie eher mehr:** Mit einem angenommenen Haushaltsprofil (Morgen- und Abendspitze) gewichtet lag der Börsenpreis 2026 bei ${zahl(PROFILPREIS_HAUSHALT, 1)} €/MWh – über dem Jahresmittel, weil der Verbrauch in die teuren Morgen- und Abendstunden fällt.`,
    `**Im Beispiel mit E-Auto (${zahl(EAUTO_KWH)} kWh)** kostet das Laden gesteuert tagsüber rund ${eur(FALL[3].kosten)} im Jahr, ungesteuert abends ${eur(FALL[1].kosten)} – mit dem angenommenen Fixpreis ${eur(FIX)}.`,
    "**Ab 2027 zählt auch die Leistung:** Mit dem Leistungspreis auf Netzebene 7 kann gleichzeitiges Laden in der billigsten Viertelstunde den Spotvorteil wieder aufzehren.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich ein dynamischer Stromtarif?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein dynamischer Stromtarif lohnt sich, wenn ein relevanter Teil Ihres Verbrauchs zeitlich verschiebbar ist – E-Auto, Wärmepumpe mit Speicher, Batteriespeicher oder betriebliche Prozesse.** Ohne diese Flexibilität tragen Sie das Preisrisiko, ohne systematisch billiger einzukaufen. Mit PV-Anlage kommt hinzu: Die günstigsten Stunden sind genau jene, in denen Ihre Anlage ohnehin Strom liefert.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Eher ja", text: "E-Auto oder Flotte, die tagsüber oder gesteuert lädt; Wärmepumpe mit Puffer; Speicher mit Energiemanagement; Kühlung, Pumpen oder Chargenprozesse im Betrieb." },
            { titel: "Mit Planung", text: "Haushalte und Betriebe mit PV, die den Reststrombezug steuern können; Betriebe mit Leistungsmessung, die Lastspitzen im Blick haben." },
            { titel: "Eher nein", text: "Verbrauch fällt fest morgens und abends an; keine Steuerung; geringe Risikobereitschaft oder knappe Budgetplanung." },
          ],
        },
      ],
    },
    {
      id: "funktion",
      titel: "So funktioniert ein dynamischer Tarif in Österreich",
      tocLabel: "Funktionsweise",
      bloecke: [
        {
          typ: "p",
          text: "**Der Energiepreis folgt dem Day-Ahead-Preis der [Gebotszone Österreich](/wissen/lexikon#gebotszone-at), der am Vortag für jede Viertelstunde festgelegt wird.** Das unterscheidet den [dynamischen Stromtarif](/wissen/lexikon#dynamischer-stromtarif) vom Fixpreis und vom monatlich angepassten Floater. Seit 1. Oktober 2025 handelt der europäisch gekoppelte Day-Ahead-Markt in 15-Minuten-Produkten; die Ergebnisse für den Folgetag stehen gegen 13 Uhr fest. Österreich ist seit 1. Oktober 2018 eine eigene Gebotszone, die Preise weichen daher zeitweise von Deutschland ab. Manche Tarife beziehen sich stattdessen auf die Auktionen der Energiebörse EXAA in Wien.",
        },
        {
          typ: "tabelle",
          caption: "Bestandteile der Stromrechnung bei einem dynamischen Tarif, Stand September 2026",
          kopf: ["Bestandteil", "Dynamisch?", "Anmerkung"],
          zeilen: [
            ["Energiepreis", "ja, je Viertelstunde bzw. Stunde", "Day-Ahead-Preis AT, je nach Tarif mit Aufschlag in ct/kWh"],
            ["Aufschlag / Grundgebühr des Lieferanten", "nein", "deckt Beschaffung, Ausgleichsenergie, Marge; unbedingt vergleichen"],
            ["Netznutzungs- und Netzverlustentgelt", "nein (außer SNAP-Zeitfenster)", "von der E-Control festgelegt, je Netzbereich unterschiedlich"],
            ["Abgaben (Elektrizitätsabgabe, Erneuerbaren-Förderbeitrag u. a.)", "nein", "gesetzlich festgelegt"],
            ["Umsatzsteuer", "nein (Satz)", "20 % auf die Summe"],
          ],
          minBreite: 620,
          fussnote: "Welcher Anteil der Rechnung schwankt, hängt von Netzbereich, Verbrauch und Tarif ab. Nur der Energieanteil folgt dem Börsenpreis; Netzentgelte und Abgaben bleiben auch bei negativen Börsenpreisen fällig.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Recht auf einen dynamischen Tarif",
          text: "Österreich geht über die EU-Vorgabe hinaus: Nach § 22 ElWG müssen seit 1. April 2026 alle Stromlieferanten mit mehr als 25.000 Zählpunkten Kundinnen und Kunden mit Smart Meter einen dynamischen Stromtarif anbieten. Die EU-Strombinnenmarktrichtlinie (EU) 2019/944 verlangt dies in Art. 11 erst ab 200.000 Endkunden. Lieferanten müssen über Chancen, Kosten und Risiken solcher Verträge informieren.",
        },
      ],
    },
    {
      id: "marktdaten",
      titel: "Was die Day-Ahead-Preise 2024 bis 2026 zeigen",
      tocLabel: "Marktdaten AT",
      bloecke: [
        {
          typ: "p",
          text: `**Die Preisschere zwischen Mittag und Abend ist seit 2024 deutlich gewachsen – und 2026 liegt das Preisniveau insgesamt höher.** Mittags drückt der Solarstrom die Preise, abends treiben Nachfrage und Gaskraftwerke sie hoch. Die mittlere Tagesspreizung zwischen teuerster und billigster Stunde stieg von ${SPREIZUNG[2024]} €/MWh (2024) auf ${SPREIZUNG[2026]} €/MWh (2026 bis Ende September).`,
        },
        {
          typ: "tabelle",
          caption: "Day-Ahead-Preise Gebotszone AT im Jahresvergleich (eigene Auswertung Energy-Charts), Stand September 2026",
          kopf: ["Kennzahl", "2023", "2024", "2025", "2026 (bis 27.9.)"],
          zeilen: [
            ["Durchschnitt (Base), €/MWh", zahl(JAHR[2023], 1), zahl(JAHR[2024], 1), zahl(JAHR[2025], 1), zahl(JAHR[2026], 1)],
            ["Mittag 11–15 Uhr, €/MWh", "–", zahl(MITTAG[2024]), zahl(MITTAG[2025]), zahl(MITTAG[2026])],
            ["Abend 18–21 Uhr, €/MWh", "–", zahl(ABEND[2024]), zahl(ABEND[2025]), zahl(ABEND[2026])],
            ["Tagesspreizung max.–min. Stunde, €/MWh", "–", zahl(SPREIZUNG[2024]), zahl(SPREIZUNG[2025]), zahl(SPREIZUNG[2026])],
            ["Stunden mit negativem Preis", zahl(NEGATIV[2023]), zahl(NEGATIV[2024]), zahl(NEGATIV[2025]), zahl(NEGATIV[2026])],
            ["Tiefstpreis, €/MWh", zahl(TIEF[2023]), zahl(TIEF[2024]), zahl(TIEF[2025]), zahl(TIEF[2026])],
          ],
          hervorheben: 4,
          minBreite: 620,
          fussnote: "Eigene Auswertung auf Basis Energy-Charts (Fraunhofer ISE; Daten: Bundesnetzagentur | SMARD.de, CC BY 4.0). Seit 1.10.2025 Viertelstundenpreise; Stundenwerte als Mittel der Viertelstunden. 100 €/MWh = 10 ct/kWh, netto ohne Aufschläge, Netzentgelte, Abgaben und USt.",
        },
        {
          typ: "tabelle",
          caption: "Monatsmittel Day-Ahead AT in €/MWh, 2025 und 2026, Stand September 2026",
          kopf: ["Jahr", ...MONATE],
          zeilen: [
            ["2025", ...MONAT_2025.map((v) => zahl(v))],
            ["2026", ...MONATE.map((_, i) => (MONAT_2026[i] != null ? zahl(MONAT_2026[i]) + (i === 8 ? "*" : "") : "–"))],
          ],
          markierteZeile: 1,
          minBreite: 680,
          fussnote: "* September 2026 bis 27.9. Eigene Auswertung auf Basis Energy-Charts.",
        },
        {
          typ: "tabelle",
          caption: "Tagesverlauf 2026: mittlerer Day-Ahead-Preis AT nach Uhrzeit in €/MWh, Stand September 2026",
          kopf: ["Zeitraum", ...BLOECKE],
          zeilen: [
            ["Jän–Mär 2026", ...VERLAUF_WINTER.map((v) => zahl(v))],
            ["Apr–Sep 2026", ...VERLAUF_SOMMER.map((v) => zahl(v))],
          ],
          minBreite: 620,
          fussnote: "Ortszeit (MEZ/MESZ), Zeitraum bis 27.9.2026. Eigene Auswertung auf Basis Energy-Charts. Oktober bis Dezember 2026 fehlen noch.",
        },
        {
          typ: "p",
          text: `Zwei Folgerungen: Erstens ist die Nacht 2026 kein Billigtarif mehr – im Sommerhalbjahr lag der Preis zwischen 0 und 6 Uhr bei ${zahl(VERLAUF_SOMMER[0])} €/MWh, mehr als doppelt so hoch wie zwischen 10 und 16 Uhr. Zweitens ist der Mittagsvorteil im Winter klein: Von Jänner bis März lag das Mittagsfenster mit ${zahl(VERLAUF_WINTER[2])} €/MWh nur knapp unter der Nacht. Aktuelle Preise sehen Sie unter [Energie live](/energie-live); wie negative Preise entstehen, erklärt der Ratgeber [Negative Strompreise](/ratgeber/negative-strompreise).`,
        },
      ],
    },
    {
      id: "risiken",
      titel: "Risiken: Preisspitzen, Winter und Krisenjahre",
      tocLabel: "Risiken",
      bloecke: [
        {
          typ: "p",
          text: `**Das größte Risiko eines dynamischen Tarifs sind längere Hochpreisphasen – einzelne Spitzen lassen sich verschieben, ein teurer Monat nicht.** 2026 erreichte der Stundenpreis am ${SPITZE_STUNDE.wann} ${zahl(SPITZE_STUNDE.wert, 1)} €/MWh, die teuerste Viertelstunde am ${SPITZE_VIERTEL.wann} ${zahl(SPITZE_VIERTEL.wert, 1)} €/MWh – das sind ohne Aufschläge und Steuern bereits rund ${ctKwh(SPITZE_VIERTEL.wert)} ct/kWh.`,
        },
        {
          typ: "liste",
          punkte: [
            `**Steigendes Preisniveau:** August und September 2026 lagen mit ${MONAT_2026[7]} und ${MONAT_2026[8]} €/MWh deutlich über den Vorjahresmonaten (${MONAT_2025[7]} bzw. ${MONAT_2025[8]} €/MWh). Wer im Frühjahr gewechselt hat, erlebt jetzt die Kehrseite.`,
            "**Winter:** Der Heizstrom der Wärmepumpe fällt in Monate mit hohem Preisniveau und kleinem Mittagsvorteil; flexibel ist er nur mit Puffer- oder Gebäudespeicher.",
            "**Krisenjahre:** 2022 lagen die von der E-Control veröffentlichten Quartalsmarktpreise zeitweise über 30 ct/kWh (Q4/2022: 51,45 ct/kWh). Ein dynamischer Tarif gibt solche Phasen unmittelbar weiter.",
            "**Vertragsdetails:** Aufschlag, Grundgebühr, Preisdeckel (falls vorhanden), Abrechnungsbasis (Viertelstunde, Stunde, Monatsmittel) und Kündigungsfristen entscheiden über das Ergebnis.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Monatliche Floater sind etwas anderes",
          text: "Viele Tarife sind an einen Monats-Index gekoppelt. Sie folgen dem Preisniveau, belohnen aber kein Verschieben innerhalb des Tages. Für E-Auto, Speicher und Wärmepumpe zählt nur ein Tarif mit Viertelstunden- oder Stundenpreisen.",
        },
      ],
    },
    {
      id: "smart-meter",
      titel: "Voraussetzung: Smart Meter mit Viertelstundenwerten",
      tocLabel: "Smart Meter",
      bloecke: [
        {
          typ: "p",
          text: "**Ein viertelstundengenauer Tarif setzt voraus, dass Ihr Smart Meter Viertelstundenwerte erfasst und an den Lieferanten übermittelt.** In Österreich übermittelt ein Smart Meter standardmäßig einen Tagesverbrauchswert; Viertelstundenwerte werden nur mit Ihrer Zustimmung (Opt-in) oder wenn Ihr gewählter Vertrag sie erfordert ausgelesen. Ob Ihr Zähler das kann und wie Sie die Viertelstundenwerte freischalten, erklärt der Ratgeber [Smart-Meter-Pflicht](/ratgeber/smart-meter-pflicht).",
        },
        {
          typ: "p",
          text: "Betriebe mit Leistungsmessung (Lastprofilzähler, Pflicht über 100.000 kWh Jahresverbrauch oder 50 kW Anschlussleistung) haben die Viertelstundenwerte ohnehin. Sie nutzen meist keine Haushaltstarife, sondern Beschaffungsmodelle mit Spotanteil.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: E-Auto mit Fixpreis und dynamischem Tarif",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Wie stark das Ergebnis von der Ladezeit abhängt, zeigt ein E-Auto mit ${zahl(EAUTO_KWH)} kWh Ladestrom im Jahr (rund 15.000 km).** Verglichen wird nur der Energieanteil; Netzentgelte und Abgaben sind in allen Varianten gleich. Grundlage sind die tatsächlichen Day-Ahead-Preise AT von Jänner bis September 2026.`,
        },
        {
          typ: "tabelle",
          caption: `E-Auto mit ${zahl(EAUTO_KWH)} kWh/Jahr: Energiekosten je nach Tarif und Ladezeit (Basis Day-Ahead AT 2026), Stand September 2026`,
          kopf: ["Variante", "Ladezeit", "Energiepreis netto", "Kosten/Jahr brutto", "vs. Fixpreis"],
          zeilen: FALL.map((f, i) => [
            f.name,
            f.hinweis,
            `${zahl(f.ct, 1)} ct/kWh`,
            eur(f.kosten),
            i === 0 ? "–" : (f.kosten - FIX > 0 ? "+" : "−") + eur(Math.abs(f.kosten - FIX)),
          ]),
          markierteZeile: 3,
          hervorheben: 3,
          minBreite: 680,
          fussnote: `Annahmen: ${zahl(FIX_CT, 1)} ct/kWh netto Energiepreis im Fixpreistarif und ${zahl(AUFSCHLAG_CT, 1)} ct/kWh netto Aufschlag im dynamischen Tarif sind Rechenannahmen, keine Angebote; keine unterschiedlichen Grundgebühren; 20 % USt. Börsenpreise: Mittel 18–21 Uhr ${zahl(LADEN.abend, 1)} €/MWh; günstigste 3 Stunden je Nacht (18–7 Uhr) ${zahl(LADEN.nachtGesteuert, 1)} €/MWh; günstigste 3 Stunden je Tag ${zahl(LADEN.tagGesteuert, 1)} €/MWh (Jän–Mär nur ${zahl(LADEN.tagWinter, 1)} €/MWh). Zeitraum 1.1.–27.9.2026 mit Übergewicht der Sommermonate; ein volles Jahr fällt für die Tagesladung ungünstiger aus.`,
        },
        {
          typ: "p",
          text: `Das Ergebnis ist eindeutig: Wer nach der Heimkehr sofort lädt, zahlt mit dem dynamischen Tarif rund ${eur(FALL[1].kosten - FIX)} mehr als im angenommenen Fixpreis. Gesteuertes Nachtladen bringt nur ${eur(FIX - FALL[2].kosten)} im Jahr. Erst Laden in den Mittagsstunden – Firmenfahrzeuge am Betriebsparkplatz, Homeoffice, Zweitwagen – spart spürbar, rund ${eur(FIX - FALL[3].kosten)}. Dann liegt allerdings auch [PV-Überschussladen](/ratgeber/pv-ueberschussladen) nahe, das mit eigenem Solarstrom noch günstiger ist.`,
        },
        { typ: "tool", href: "/rechner/dynamischer-stromtarif", titel: "Eigenen Verbrauch durchrechnen", text: "Aktuelle Börsenpreise AT und Ihr Verbrauchsprofil – der Rechner zeigt, ob ein dynamischer Tarif für Sie passt.", label: "Zum Tarif-Rechner" },
      ],
    },
    {
      id: "netztarife",
      titel: "SNAP und Leistungspreis 2027: Netzentgelte richtig mitdenken",
      tocLabel: "SNAP & Leistungspreis",
      bloecke: [
        {
          typ: "p",
          text: `**Der Sommer-Nieder-Arbeitspreis (SNAP) verstärkt den Mittagsvorteil, der Leistungspreis ab 2027 bestraft gleichzeitiges Laden.** Seit 1. April 2026 ist auf Netzebene 7 der Netz-Arbeitspreis von 1. April bis 30. September zwischen 10 und 16 Uhr um 20 % niedriger. Im Netz Oberösterreich (nicht leistungsgemessen, ${zahl(6.29, 2)} ct/kWh) sind das ${zahl(SNAP_OOE_CT, 2)} ct/kWh netto. Lädt das Beispielauto die Hälfte des Jahres mittags, spart der SNAP zusätzlich rund ${eur(SNAP_VORTEIL)} – voll nutzbar nur, wenn Ihr Verbrauch viertelstündlich erfasst wird.`,
        },
        {
          typ: "p",
          text: `Ab 1. Jänner 2027 soll laut ElWG und Verordnungsentwurf der E-Control auch auf Netzebene 7 ein Leistungspreis gelten, berechnet aus der höchsten Viertelstunde im Monat. Starten Wallbox (11 kW), Wärmepumpe (3 kW) und Haushalt (2 kW) gemeinsam in der billigsten Viertelstunde, entstehen ${SPITZE_GLEICHZEITIG} kW; gestaffelt wären es ${SPITZE_GESTAFFELT} kW. Mit dem heutigen Leistungspreis für gemessene Kunden auf NE 7 in Oberösterreich (${zahl(LP_NE7_OOE, 2)} €/kW und Jahr) als Größenordnung kosten die ${SPITZE_GLEICHZEITIG - SPITZE_GESTAFFELT} kW Unterschied rund ${eur(LP_MEHR)} im Jahr – mehr als der Spotvorteil des Nachtladens.`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Preis- und Lastsignal gemeinsam steuern",
          text: "Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) sollte nicht nur die billigsten Viertelstunden suchen, sondern auch eine Leistungsgrenze einhalten. Die Tarifwerte 2027 legt die E-Control erst mit der Tarifverordnung Ende 2026 fest; im Betrieb gilt der Leistungspreis schon heute – mehr dazu unter [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
      ],
    },
    {
      id: "pv-speicher",
      titel: "Dynamischer Tarif mit PV-Anlage und Speicher",
      tocLabel: "Mit PV & Speicher",
      bloecke: [
        {
          typ: "p",
          text: `**Mit einer PV-Anlage bleibt vor allem der teure Reststrom am Morgen, Abend und im Winter – genau dort ist der dynamische Tarif am schwächsten.** Ein typisches Haushaltsprofil kam 2026 auf einen gewichteten Börsenpreis von ${zahl(PROFILPREIS_HAUSHALT, 1)} €/MWh, ein Einschichtbetrieb auf ${zahl(PROFILPREIS_BETRIEB, 1)} €/MWh; mit PV verschiebt sich der Reststrom noch stärker in teure Stunden.`,
        },
        {
          typ: "liste",
          punkte: [
            "**Speicher:** Er kann im Winter in günstigen Stunden aus dem Netz nachladen und abends entladen. Bis Ende 2026 fallen beim Netzbezug in den Speicher aber Netzentgelte und Abgaben an; nach Wirkungsgradverlusten bleibt nur bei großer Spreizung ein Vorteil.",
            "**Wärmepumpe:** Mit Pufferspeicher oder Estrich als Wärmespeicher lassen sich einige Stunden überbrücken – im Winter ist die Spreizung aber kleiner.",
            "**Einspeisung:** Die günstigen Mittagsstunden sind zugleich die Stunden mit dem niedrigsten Wert für eingespeisten Solarstrom. Wie Sie Überschüsse vermarkten, beschreibt der Ratgeber [Negative Strompreise](/ratgeber/negative-strompreise).",
          ],
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Gewerbe: Spotbeschaffung und Tranchen statt Endkundentarif",
      tocLabel: "Gewerbe",
      bloecke: [
        {
          typ: "p",
          text: "**Betriebe mit größerem Verbrauch kaufen selten über einen Haushalts-Spottarif ein, sondern über strukturierte Beschaffung: Ein Teil wird in Tranchen am Terminmarkt fixiert, der Rest zum Spotpreis bezogen.** So lässt sich das Preisrisiko begrenzen und trotzdem vom günstigen Mittag profitieren. Grundlage für Terminpreise sind unter anderem die Base-Futures für Österreich an der EEX.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Lastgang auswerten:** Welcher Anteil fällt in teure Stunden, welcher ist verschiebbar (Kühlung, Druckluft, Ladeinfrastruktur, Chargen)?",
            "**Spotanteil festlegen:** Nur so viel Spotrisiko wie verschiebbare Last oder Speicher vorhanden ist.",
            "**Tranchenstrategie:** Zeitpunkte und Anteile der Fixierung festlegen, Verantwortung im Einkauf klären.",
            "**Leistungspreis und Spot gemeinsam optimieren:** Günstige Viertelstunden dürfen keine neue Monatsspitze erzeugen.",
            "**PV und Reststrom abstimmen:** Eigenverbrauch, Überschusseinspeisung und Reststrombezug aus einer Hand planen – siehe [Stromtarif](/service/stromtarif).",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So entscheiden Sie in fünf Schritten",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Viertelstundenwerte freischalten", "Beim Netzbetreiber das Opt-in für Viertelstundenwerte setzen und einige Monate Daten sammeln."],
            ["Flexibilität bestimmen", "Welche Verbraucher lassen sich wie viele Stunden verschieben – und sind tagsüber verfügbar?"],
            ["Fixpreis vergleichen", "Fixpreis-Angebote im Tarifkalkulator der E-Control prüfen; dynamische Angebote mit Aufschlag und Grundgebühr gegenrechnen."],
            ["Mit echten Preisen rechnen", "Den eigenen Lastgang mit den Day-Ahead-Preisen AT durchrechnen, z. B. mit dem [Tarif-Rechner](/rechner/dynamischer-stromtarif)."],
            ["Steuerung einrichten", "Wallbox, Wärmepumpe und Speicher über ein Energiemanagement mit Preis- und Leistungsgrenze steuern; Preisrisiko regelmäßig überprüfen."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist ein dynamischer Stromtarif?",
      a: "Ein Tarif, dessen Energiepreis dem Day-Ahead-Börsenpreis der Gebotszone Österreich folgt – je Viertelstunde oder Stunde, plus Aufschlag des Lieferanten. Netzentgelte, Abgaben und Umsatzsteuer werden wie beim Fixpreis verrechnet. Mehr im Lexikon unter [dynamischer Stromtarif](/wissen/lexikon#dynamischer-stromtarif).",
    },
    {
      q: "Lohnt sich ein dynamischer Stromtarif ohne E-Auto oder Wärmepumpe?",
      a: `Meist nicht. Mit einem typischen Haushaltsprofil lag der gewichtete Börsenpreis 2026 bei ${zahl(PROFILPREIS_HAUSHALT, 1)} €/MWh und damit über dem Durchschnitt von ${zahl(JAHR[2026], 1)} €/MWh, weil der Verbrauch in teure Morgen- und Abendstunden fällt.`,
    },
    {
      q: "Wann ist Strom 2026 am günstigsten?",
      a: `Im Sommerhalbjahr klar mittags: Zwischen 10 und 16 Uhr lag der Day-Ahead-Preis von April bis September 2026 im Mittel bei ${zahl(VERLAUF_SOMMER[2])} €/MWh, abends 18–22 Uhr bei ${zahl(VERLAUF_SOMMER[4])} €/MWh. Nachts war Strom 2026 nicht mehr billig; im Winter sind die Unterschiede kleiner.`,
    },
    {
      q: "Brauche ich für einen dynamischen Tarif einen Smart Meter?",
      a: "Ja, und zwar mit Viertelstundenwerten. Standardmäßig übermittelt der Smart Meter in Österreich nur einen Tageswert; für viertelstündliche Abrechnung ist Ihre Zustimmung (Opt-in) nötig. Details im Ratgeber [Smart-Meter-Pflicht](/ratgeber/smart-meter-pflicht).",
    },
    {
      q: "Wie hoch können die Preise steigen?",
      a: `2026 erreichte der höchste Stundenpreis ${zahl(SPITZE_STUNDE.wert, 1)} €/MWh, die teuerste Viertelstunde ${zahl(SPITZE_VIERTEL.wert, 1)} €/MWh, also rund ${ctKwh(SPITZE_VIERTEL.wert)} ct/kWh vor Aufschlägen und Steuern. Gefährlicher als Einzelspitzen sind längere Hochpreisphasen wie 2022.`,
    },
    {
      q: "Was ändert sich 2027 durch die Netzentgeltreform?",
      a: "Laut ElWG und Verordnungsentwurf kommt ein Leistungspreis auf allen Netzebenen, auch für Haushalte, berechnet aus der höchsten Viertelstunde im Monat. Wer alle Verbraucher gleichzeitig in der billigsten Viertelstunde startet, riskiert höhere Netzkosten. Die Tarifwerte stehen erst Ende 2026 fest.",
    },
    {
      q: "Ist ein dynamischer Tarif für Betriebe sinnvoll?",
      a: "Für Betriebe mit Leistungsmessung ist meist eine strukturierte Beschaffung mit Terminmarkt-Tranchen und Spotanteil passender als ein Haushaltstarif. Der Spotanteil sollte zur verschiebbaren Last passen. Unterstützung bietet unser [Stromtarif-Service](/service/stromtarif).",
    },
  ],

  passend: [
    { href: "/rechner/dynamischer-stromtarif", titel: "Tarif-Rechner", text: "Börsenpreise AT und eigenes Profil durchrechnen." },
    { href: "/energie-live", titel: "Energie live", text: "Aktuelle Preise und Erzeugung in Österreich." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving und Leistungspreis", text: "Lastspitzen kappen, Netzentgelte senken." },
    { href: "/service/stromtarif", titel: "Stromtarif", text: "Reststrom und Beschaffung für Betriebe." },
  ],

  quellen: [
    { titel: "Energy-Charts (Fraunhofer ISE) – Day-Ahead-Preise Gebotszone AT, eigene Auswertung", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=AT", stand: "09/2026" },
    { titel: "EUR-Lex – Richtlinie (EU) 2019/944, Art. 11 Verträge mit dynamischen Stromtarifen", url: "https://eur-lex.europa.eu/eli/dir/2019/944/oj", stand: "09/2026" },
    { titel: "RIS – SNE-V 2018, Novelle 2026 (BGBl. II Nr. 305/2025)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "12/2025" },
    { titel: "RIS – Elektrizitätswirtschaftsgesetz ElWG (BGBl. I Nr. 91/2025)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "12/2025" },
    { titel: "E-Control – SNE-G-V Begutachtungsentwurf samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "E-Control – Marktpreis-Archiv (Quartalsmarktpreise)", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv", stand: "09/2026" },
    { titel: "E-Control – Tarifkalkulator", url: "https://www.e-control.at/unsere-services/tarifkalkulator", stand: "09/2026" },
  ],

  seitenCta: { titel: "Lohnt sich Spotpreis für Sie?", text: "Börsenpreise AT mit Ihrem Verbrauch durchrechnen – inklusive E-Auto und Wärmepumpe.", href: "/rechner/dynamischer-stromtarif", label: "Tarif berechnen" },
  cta: {
    title: "Spotpreis, PV und Leistungspreis gemeinsam planen.",
    text: "Wir prüfen Lastgang, Flexibilität und Speicheroptionen – damit günstige Viertelstunden nicht zu teuren Spitzen werden.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Stromtarif-Service", href: "/service/stromtarif" },
  },
};

export default artikel;
