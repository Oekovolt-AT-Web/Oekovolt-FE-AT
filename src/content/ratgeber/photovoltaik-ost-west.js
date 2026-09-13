// Ratgeber: Photovoltaik Ost-West – Ertrag, Eigenverbrauch, Flachdach, Beispiel
// Ertrags- und Profilwerte: eigene Auswertung von PVGIS 5.3 (JRC), Standort Kassel,
// Stundenreihen 2019–2023 bzw. Mittel 2005–2023, 14 % Systemverluste, abgerufen 09/2026.
// Eigenverbrauch: eigene Stundensimulation mit dem Haushaltslastprofil der Website-Rechner.
// Wirtschaftlichkeit: Rechenkern des Solarrechners (berechne).

import { ANNAHMEN, AUSRICHTUNGEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { berechne } from "@/lib/solarrechner";

const n0 = (v) => Math.round(v).toLocaleString("de-DE");
const eur = (v) => `${n0(v)} €`;
const pct = (v) => `${Math.round(v * 100)} %`;
const jahre = (r) => (r.amortisationJahre ? `${r.amortisationJahre.toFixed(1).replace(".", ",")} Jahre` : "über 20 Jahre");
const OW_FAKTOR = AUSRICHTUNGEN.find((a) => a.id === "ost-west")?.faktor ?? 0.85;

// Wirtschaftlichkeit (Solarrechner): 4.500 kWh Haushalt bzw. 9.000 kWh mit Wärmepumpe/E-Auto
const S10 = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const OW10 = berechne({ kwp: 10, ausrichtung: "ost-west", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const OW10S = berechne({ kwp: 10, ausrichtung: "ost-west", neigung: "mittel", verbrauch: 4500, speicherKwh: 8 });
const OW15G = berechne({ kwp: 15, ausrichtung: "ost-west", neigung: "mittel", verbrauch: 9000, speicherKwh: 0 });
const S8G = berechne({ kwp: 8, ausrichtung: "sued", neigung: "mittel", verbrauch: 9000, speicherKwh: 0 });

// PVGIS 5.3, Kassel, Juni-Mittel 2019–2023, Leistung in Watt je kWp zur vollen Stunde (MESZ)
const PROFIL = [
  ["6 Uhr", 14, 43],
  ["8 Uhr", 159, 210],
  ["10 Uhr", 414, 355],
  ["12 Uhr", 508, 432],
  ["14 Uhr", 535, 456],
  ["16 Uhr", 394, 340],
  ["18 Uhr", 195, 219],
  ["19 Uhr", 82, 165],
  ["20 Uhr", 26, 82],
];

const artikel = {
  slug: "photovoltaik-ost-west",
  title: "Photovoltaik Ost-West: Ertrag, Eigenverbrauch und Wirtschaftlichkeit",
  seoTitle: "Photovoltaik Ost-West: Ertrag & Eigenverbrauch | Ökovolt",
  kurzTitel: "Photovoltaik Ost-West",
  description:
    "Photovoltaik Ost-West: rund 80–85 % des Süd-Ertrags, flacheres Tagesprofil, kaum Verluste durch die 60-%-Regel. Ertragsdaten, Flachdach-Aufständerung und Rechenbeispiel.",
  excerpt:
    "Ost-West-Dächer liefern weniger Strom als Süddächer – aber zu besseren Zeiten und oft auf doppelter Fläche. Was das in Kilowattstunden und Euro bedeutet, mit eigenen Simulationsdaten.",
  hauptKeyword: "photovoltaik ost west",
  keywords: [
    "Photovoltaik Ost-West",
    "PV-Anlage Ost-West-Ausrichtung",
    "Ost-West oder Süd Photovoltaik",
    "Ost-West Aufständerung Flachdach",
    "Ost-West Ertrag",
    "Lohnt sich Photovoltaik Ost-West",
    "Ost-West Eigenverbrauch",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Home/download-2.jpg",
  bildAlt: "Aufgeständerte Modulreihen einer Photovoltaikanlage auf einem Flachdach",
  badge: { wert: "80–85 %", text: "des Süd-Ertrags je kWp bei Ost-West-Ausrichtung (PVGIS)" },

  kurzFazit: [
    "**Eine Ost-West-Anlage erzeugt je kWp rund 80 bis 85 % des Ertrags eines optimalen Süddachs** – bei 30° Dachneigung etwa 81 %, flach aufgeständert mit 10 bis 15° etwa 84 %.",
    "**Der Solarstrom verteilt sich breiter über den Tag:** In unserer Simulation erzeugt Ost-West morgens und abends deutlich mehr, die Spitzenleistung liegt rund ein Viertel niedriger.",
    "**Der Eigenverbrauch in Kilowattstunden bleibt fast gleich.** Der Minderertrag trifft vor allem die gering vergütete Einspeisung.",
    "**Die 60-%-Einspeisegrenze kostet Ost-West kaum Ertrag** (HTW Berlin: 1,1 % statt 9,0 % bei Süd, Volleinspeisung ohne Speicher).",
    "Da sich beide Dachseiten belegen lassen, passt oft **deutlich mehr Leistung aufs Dach** – ideal für Wärmepumpe und E-Auto.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich Photovoltaik mit Ost-West-Ausrichtung?",
      tocLabel: "Kurzantwort",
      bloecke: [
        {
          typ: "p",
          text: `**Ja – eine Ost-West-Anlage lohnt sich in den meisten Fällen, obwohl sie je kWp etwa 15 bis 20 % weniger Strom erzeugt als ein ideales Süddach.** Sie liefert morgens und abends mehr Strom, wenn im Haushalt tatsächlich verbraucht wird, hat eine niedrigere Mittagsspitze und kann beide Dachseiten nutzen. Unser [Solarrechner](/solarrechner) rechnet für Ost-West mit ${pct(OW_FAKTOR)} des Süd-Ertrags.`,
        },
        {
          typ: "p",
          text: `In unserem Beispiel mit 10 kWp und 4.500 kWh Verbrauch amortisiert sich die Ost-West-Anlage nach rund ${jahre(OW10)}, das Süddach nach ${jahre(S10)}. Beides liegt deutlich unter der Lebensdauer von 25 bis 30 Jahren. Für Hausbesitzer mit Ost-West-Dach lautet die Frage in der Praxis ohnehin nicht „Ost-West oder Süd“, sondern „Ost-West oder gar keine Anlage“ – und dann spricht fast alles für die Anlage.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Was „Ost-West“ bedeutet",
          text: "Bei einer [Ost-West-Ausrichtung](/wissen/lexikon#ost-west-ausrichtung) zeigen die Module zur Hälfte nach Osten und zur Hälfte nach Westen – entweder auf den beiden Seiten eines Satteldachs oder als dachförmige Aufständerung auf einem Flachdach. Maßgeblich ist der [Azimut](/wissen/lexikon#azimut): Abweichungen von 20 bis 30° Richtung Süden verbessern den Ertrag spürbar.",
        },
      ],
    },
    {
      id: "ertrag",
      titel: "Wie viel Ertrag bringt eine Ost-West-Anlage?",
      tocLabel: "Ertrag",
      bloecke: [
        {
          typ: "p",
          text: "**Je flacher die Module, desto kleiner der Unterschied zum Süddach.** Bei 10 bis 15° Neigung – typisch für Ost-West-Aufständerungen auf Flachdächern – erreicht Ost-West rund 84 bis 85 % des Optimums. Auf einem 45° steilen Satteldach sind es nur noch etwa 77 %. Fraunhofer ISE nennt für ein Westdach mit 45° Neigung rund 26 % weniger Ertrag als ein Süddach gleicher Neigung.",
        },
        {
          typ: "tabelle",
          caption: "Spezifischer Jahresertrag Ost-West im Vergleich zum Süddach, Standort Kassel (Mitte Deutschlands)",
          kopf: ["Ausrichtung & Neigung", "Ertrag (kWh/kWp)", "Relativ zum Optimum", "Typische Anwendung"],
          zeilen: [
            ["Süd, 35–40°", "ca. 980", "100 %", "Süddach (Referenz)"],
            ["Ost-West, 10°", "ca. 830", "85 %", "Flachdach, aerodynamische Aufständerung"],
            ["Ost-West, 15°", "ca. 820", "84 %", "Flachdach, Aufständerung"],
            ["Ost-West, 20°", "ca. 820", "83 %", "flach geneigtes Satteldach, Bungalow"],
            ["Ost-West, 30°", "ca. 800", "81 %", "übliches Satteldach"],
            ["Ost-West, 45°", "ca. 760", "77 %", "steiles Satteldach"],
            ["Nur Ost oder nur West, 30°", "ca. 800", "81–82 %", "Pultdach, einseitige Belegung"],
          ],
          hervorheben: 2,
          markierteZeile: 4,
          minBreite: 620,
          fussnote: "Quelle: eigene Berechnung mit PVGIS 5.3 (JRC), Mittel 2005–2023, 14 % Systemverluste, unverschattet. An der Küste liegen alle Werte rund 3 % niedriger, im Voralpenland rund 10 bis 13 % höher – das Verhältnis bleibt gleich.",
        },
        {
          typ: "p",
          text: "Über das Jahr verteilt sich der Unterschied ungleich: Im Juni erzeugt ein Ost-West-Dach mit 30° fast so viel wie ein Süddach (in unserer Auswertung rund 95 %), im Dezember nur etwa die Hälfte. Wer eine [Wärmepumpe](/ratgeber/waermepumpe-mit-photovoltaik) plant, sollte das berücksichtigen: Im Winter fehlt Ost-West-Anlagen mehr Ertrag als im Sommer. Regionale Werte für alle Ausrichtungen finden Sie im Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
      ],
    },
    {
      id: "tagesprofil",
      titel: "Tagesprofil: Strom dann, wenn Sie ihn brauchen",
      tocLabel: "Tagesprofil",
      bloecke: [
        {
          typ: "p",
          text: "**Ost-West-Anlagen erzeugen früher am Morgen und länger am Abend Strom, dafür ist die Mittagsspitze niedriger.** Die Tabelle zeigt die mittlere Leistung an Junitagen für eine Anlage in der Mitte Deutschlands. Um 7 Uhr liefert Ost-West fast dreimal, um 19 Uhr doppelt so viel wie ein Süddach.",
        },
        {
          typ: "tabelle",
          caption: "Mittlere Leistung im Juni je kWp: Süd 35° und Ost-West 30° im Vergleich (Kassel, 2019–2023)",
          kopf: ["Uhrzeit (MESZ)", "Süd 35° (W je kWp)", "Ost-West 30° (W je kWp)", "Ost-West im Verhältnis"],
          zeilen: [
            ["7 Uhr", "48", "130", "271 %"],
            ...PROFIL.filter(([u]) => u !== "6 Uhr").map(([uhr, sued, ow]) => [uhr, n0(sued), n0(ow), `${Math.round((ow / sued) * 100)} %`]),
          ],
          hervorheben: 2,
          minBreite: 560,
          fussnote: "Quelle: eigene Auswertung stündlicher PVGIS-5.3-Reihen (Monatsmittel inklusive bewölkter Tage). An klaren Tagen liegen die Spitzen höher. Ost-West: je halbe Leistung nach Osten und Westen.",
        },
        {
          typ: "kennzahl",
          wert: "−25 %",
          titel: "niedrigere Spitzenleistung bei Ost-West 30°",
          text: "In den Stundenwerten 2019–2023 erreichte die Süd-Anlage höchstens 0,85 kW je kWp, die Ost-West-Anlage 0,64 kW. Das entlastet Wechselrichter, Netzanschluss und die 60-%-Grenze.",
        },
        {
          typ: "p",
          text: `**Was bringt das beim Eigenverbrauch?** Wir haben einen Haushalt mit 4.500 kWh und dem Lastprofil unserer Rechner stündlich mit beiden Ausrichtungen simuliert (10 kWp, ohne Speicher). Ergebnis: Die Süd-Anlage erzeugt rund 10.000 kWh, die Ost-West-Anlage rund 8.100 kWh – der **selbst genutzte Solarstrom ist aber praktisch gleich** (etwa 1.740 bzw. 1.770 kWh). Die Eigenverbrauchsquote steigt dadurch von rund 17 auf 22 %. Die fehlenden Kilowattstunden wären fast vollständig ins Netz geflossen – zu ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct statt rund ${Math.round(ANNAHMEN.strompreis * 100)} ct Ersparnis je kWh.`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Verbrauch an die Sonne anpassen",
          text: "Mit Ost-West lohnt es sich besonders, Spülmaschine, Waschmaschine oder Warmwasser-Wärmepumpe morgens bzw. am späten Nachmittag laufen zu lassen. Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) kann das automatisch übernehmen – weitere Hebel im Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "solarspitzen",
      titel: "Vorteil bei 60-%-Regel und negativen Strompreisen",
      tocLabel: "60-%-Regel",
      bloecke: [
        {
          typ: "p",
          text: "**Weil Ost-West-Anlagen mittags weniger Spitzenleistung erreichen, verlieren sie durch die 60-%-Einspeisegrenze kaum Ertrag.** Seit dem [Solarspitzengesetz](/ratgeber/solarspitzengesetz) dürfen Neuanlagen unter 25 kW ohne intelligentes Messsystem höchstens 60 % ihrer Leistung ins Netz einspeisen (§ 9 Abs. 2 EEG). Nach Berechnungen der HTW Berlin, zitiert von der Verbraucherzentrale Hamburg, liegen die Abregelungsverluste bei Volleinspeisung ohne Speicher bei **1,1 % für West-Ost- und 9,0 % für Südausrichtung**. Mit Eigenverbrauch und Speicher sinken beide Werte.",
        },
        {
          typ: "p",
          text: "Ähnlich wirkt sich das bei [negativen Strompreisen](/ratgeber/negative-strompreise) aus. Die HTW Berlin hat ermittelt, dass 2024 rund 18 % des Ertrags einer Süd-Anlage auf Stunden mit negativen Börsenstrompreisen entfielen – typischerweise sonnige Mittagsstunden. Neuanlagen erhalten nach § 51 EEG für solche Zeiträume keine Vergütung, sobald ein intelligentes Messsystem eingebaut ist; die Zeiten werden am Ende des Förderzeitraums angehängt. Ost-West verlagert einen Teil des Ertrags aus diesen Stunden heraus.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Wechselrichter kleiner, Einspeisung dynamisch begrenzen",
          text: "Wegen der niedrigeren Spitzen kann der Wechselrichter bei Ost-West meist kleiner ausfallen, etwa 7 bis 8 kW für 10 kWp. Jede Dachseite braucht einen eigenen MPP-Tracker. Die 60-%-Grenze sollte dynamisch am Netzanschlusspunkt umgesetzt werden – mehr im Ratgeber [Wechselrichter für Photovoltaik](/ratgeber/wechselrichter-photovoltaik).",
        },
      ],
    },
    {
      id: "flachdach",
      titel: "Ost-West-Aufständerung auf dem Flachdach",
      tocLabel: "Flachdach",
      bloecke: [
        {
          typ: "p",
          text: "**Auf Flachdächern ist die Ost-West-Aufständerung mit 10 bis 15° Neigung heute der Standard, weil sie deutlich mehr Leistung auf dieselbe Fläche bringt.** Die Module stehen paarweise Rücken an Rücken wie ein flaches Zeltdach. Zwischen den Reihen ist kaum Abstand nötig, weil sich die niedrigen Module kaum gegenseitig verschatten. Nach Süden aufgeständerte Reihen brauchen dagegen große Abstände, damit die tief stehende Wintersonne die nächste Reihe nicht verschattet.",
        },
        {
          typ: "tabelle",
          caption: "Flachdach: Süd-Aufständerung und Ost-West-Aufständerung im Vergleich (Orientierung)",
          kopf: ["", "Süd-Aufständerung (ca. 20–30°)", "Ost-West-Aufständerung (ca. 10–15°)"],
          zeilen: [
            ["Leistung auf 100 m² nutzbarer Fläche", "ca. 10–12 kWp", "ca. 15–18 kWp"],
            ["Ertrag je kWp (Mitte Deutschlands)", "ca. 950–980 kWh", "ca. 820–830 kWh"],
            ["Jahresertrag auf 100 m²", "ca. 9.500–11.800 kWh", "ca. 12.300–14.900 kWh"],
            ["Windlast und Ballast", "höher (größere Angriffsfläche)", "geringer, aerodynamisch geschlossen"],
            ["Tagesprofil", "Mittagsspitze", "breit, morgens und abends mehr"],
            ["Selbstreinigung durch Regen", "gut", "etwas schlechter bei 10°"],
          ],
          hervorheben: 2,
          minBreite: 620,
          fussnote: "Belegungsdichte nach Herstellerangaben und Fachportalen, stark abhängig von System, Randabständen und Aufbauten. Erträge: PVGIS 5.3; Verschattungsverluste zwischen Süd-Reihen sind nicht eingerechnet.",
        },
        {
          typ: "p",
          text: "Wichtig sind Statik und Befestigung: Ballastierte Systeme belasten die Dachkonstruktion zusätzlich, Durchdringungen der Dachhaut müssen dauerhaft dicht sein. Mindestabstände zum Dachrand, Blitzschutz und Brandschutz bestimmen, wie viel Fläche tatsächlich nutzbar ist. Alle Details dazu erklärt der Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: Süd, Ost-West und Ost-West mit Speicher",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: "**Das folgende Beispiel zeigt, was Ost-West in Euro bedeutet.** Gerechnet mit dem Rechenkern unseres Solarrechners, Anlagenpreise und Strompreis wie dort hinterlegt. Die Varianten A bis C gelten für einen Haushalt mit 4.500 kWh, die Varianten D und E für ein Haus mit Wärmepumpe und E-Auto (9.000 kWh).",
        },
        {
          typ: "tabelle",
          caption: "Wirtschaftlichkeit Süd und Ost-West im Vergleich, Stand September 2026",
          kopf: ["Variante", "Investition", "Jahresertrag", "Autarkie", "Vorteil pro Jahr", "Amortisation"],
          zeilen: [
            ["A: Süd, 10 kWp", eur(S10.investition), `${n0(S10.jahresertrag)} kWh`, pct(S10.autarkie), eur(S10.nutzenProJahr), jahre(S10)],
            ["B: Ost-West, 10 kWp", eur(OW10.investition), `${n0(OW10.jahresertrag)} kWh`, pct(OW10.autarkie), eur(OW10.nutzenProJahr), jahre(OW10)],
            ["C: Ost-West, 10 kWp + 8 kWh Speicher", eur(OW10S.investition), `${n0(OW10S.jahresertrag)} kWh`, pct(OW10S.autarkie), eur(OW10S.nutzenProJahr), jahre(OW10S)],
            ["D: Süddach, nur 8 kWp Platz (9.000 kWh)", eur(S8G.investition), `${n0(S8G.jahresertrag)} kWh`, pct(S8G.autarkie), eur(S8G.nutzenProJahr), jahre(S8G)],
            ["E: Ost-West beidseitig, 15 kWp (9.000 kWh)", eur(OW15G.investition), `${n0(OW15G.jahresertrag)} kWh`, pct(OW15G.autarkie), eur(OW15G.nutzenProJahr), jahre(OW15G)],
          ],
          hervorheben: 4,
          minBreite: 720,
          fussnote: "Orientierungswerte, keine Angebote. Vorteil pro Jahr = Stromersparnis + Einspeiseerlös − Betriebskosten im ersten Jahr. Der Solarrechner bildet die bessere zeitliche Verteilung von Ost-West nicht gesondert ab und rechnet damit eher vorsichtig.",
        },
        {
          typ: "p",
          text: `Die Ost-West-Anlage (B) bringt im Jahr rund ${eur(S10.nutzenProJahr - OW10.nutzenProJahr)} weniger als das gleich große Süddach (A) – fast ausschließlich entgangene Einspeisevergütung. Mit Speicher (C) steigt die Autarkie auf ${pct(OW10S.autarkie)}. Interessant wird Ost-West, wenn der Verbrauch hoch ist: Ein Haus, dessen Süddach nur 8 kWp fasst (D), deckt ${pct(S8G.autarkie)} seines Bedarfs; ein Ost-West-Haus mit beidseitig 15 kWp (E) ${pct(OW15G.autarkie)} – bei einem jährlichen Vorteil von ${eur(OW15G.nutzenProJahr)} statt ${eur(S8G.nutzenProJahr)}.`,
        },
        { typ: "tool", href: "/solarrechner", titel: "Ost-West für Ihr Dach berechnen", text: "Ausrichtung „Ost / West“ wählen, Größe und Verbrauch eingeben – mit Speicher-Vergleich und 20-Jahres-Cashflow.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "planung",
      titel: "Planungstipps für Ost-West-Anlagen",
      tocLabel: "Planungstipps",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Beide Dachseiten belegen,** wenn Verbrauch oder Zukunftspläne (Wärmepumpe, E-Auto) das hergeben – Gerüst und Anmeldung fallen nur einmal an.",
            "**Je Dachseite ein eigener MPP-Tracker** – Ost- und West-Module nicht im selben String mischen.",
            "**Wechselrichter moderat kleiner wählen** (DC/AC-Verhältnis etwa 1,25 bis 1,4), weil beide Seiten nie gleichzeitig ihre Spitze erreichen.",
            "**Verschattung am Morgen und Abend prüfen:** Bäume, Nachbarhäuser und Gauben werfen bei tief stehender Sonne lange Schatten – genau in den ertragsstarken Stunden von Ost-West. Mehr im Ratgeber [Verschattung](/ratgeber/photovoltaik-verschattung).",
            "**Speicher auf den Abend- und Nachtverbrauch auslegen,** nicht auf die Anlagengröße – als Obergrenze nennt die HTW Berlin rund 1,5 kWh nutzbare Kapazität je 1.000 kWh Jahresverbrauch.",
            "**Flachdach: Statik und Ballast prüfen lassen,** Dachabdichtung und Randabstände einplanen.",
          ],
        },
        {
          typ: "p",
          text: "Wie groß die Anlage insgesamt sein sollte, erklärt der Ratgeber [PV-Anlage: Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen). Für Hausbesitzer mit Ost-West-Dach planen wir Module, Wechselrichter und Speicher als Gesamtsystem – mehr zur [Photovoltaikanlage](/produkte/photovoltaikanlage) und zum [Stromspeicher](/produkte/stromspeicher).",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viel weniger Ertrag bringt eine Ost-West-Anlage?", a: "Je nach Neigung etwa 15 bis 23 % weniger als ein optimal ausgerichtetes Süddach. Flach aufgeständert mit 10 bis 15° erreicht Ost-West rund 84 bis 85 %, auf einem 30° geneigten Satteldach rund 81 %." },
    { q: "Ist Ost-West besser als Süd?", a: "Beim Jahresertrag je kWp nein, beim Tagesprofil ja: Ost-West liefert morgens und abends mehr, hat eine niedrigere Mittagsspitze und verliert kaum Ertrag durch die 60-%-Einspeisegrenze. Den selbst genutzten Strom erzielt eine gleich große Ost-West-Anlage in unserer Simulation praktisch genauso." },
    { q: "Lohnt sich eine Ost-West-Anlage mit Speicher?", a: "Oft ja. Ein Speicher verschiebt den Überschuss vom Tag in die Nacht – das funktioniert bei Ost-West genauso wie bei Süd. Im Beispiel mit 10 kWp und 8 kWh steigt die Autarkie auf rund 70 %. Ob sich das rechnet, zeigt der [Stromspeicher-Rechner](/rechner/stromspeicher)." },
    { q: "Welche Neigung ist bei Ost-West optimal?", a: "Je flacher, desto höher der Jahresertrag: 10 bis 15° sind auf Flachdächern üblich. Unter 10° verschmutzen Module stärker und Regen reinigt sie schlechter." },
    { q: "Brauche ich für Ost-West einen besonderen Wechselrichter?", a: "Der Wechselrichter braucht mindestens zwei MPP-Tracker, damit Ost- und Westseite getrennt geregelt werden. Wegen der niedrigeren Spitzenleistung kann er etwas kleiner ausgelegt werden als bei einem Süddach." },
    { q: "Wie viel kWp passen bei Ost-West auf ein Flachdach?", a: "Auf 100 m² nutzbarer Fläche je nach System etwa 15 bis 18 kWp, bei Süd-Aufständerung eher 10 bis 12 kWp. Randabstände, Aufbauten und die Statik bestimmen die tatsächliche Belegung." },
    { q: "Lohnt sich Photovoltaik nur auf dem Westdach?", a: "Ja, oft sogar gut: Ein Westdach mit 30° Neigung erreicht rund 80 % des Süd-Optimums und erzeugt am Nachmittag und frühen Abend viel Strom – passend zum typischen Verbrauch nach Feierabend." },
  ],

  passend: [
    { href: "/ratgeber/photovoltaik-flachdach", titel: "Photovoltaik auf dem Flachdach", text: "Aufständerung, Ballast, Statik und Abstände." },
    { href: "/ratgeber/photovoltaik-ertrag-pro-kwp", titel: "Ertrag pro kWp", text: "Ertragstabellen nach Region, Monat und Ausrichtung." },
    { href: "/ratgeber/wechselrichter-photovoltaik", titel: "Wechselrichter für Photovoltaik", text: "Auslegung mit zwei MPP-Trackern und Überbelegung." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Ost-West-Anlage für Ihr Dach planen lassen." },
  ],

  quellen: [
    { titel: "European Commission JRC – PVGIS 5.3 (Photovoltaic Geographical Information System)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland (Fassung 20.08.2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "08/2026" },
    { titel: "Verbraucherzentrale Hamburg – Solarspitzen und Fördergelder: Neue Regeln für Photovoltaikanlagen", url: "https://www.vzhh.de/themen/bauen-immobilien-energie/erneuerbare-energien/solarspitzen-foerdergelder-neue-regeln-fuer-photovoltaikanlagen", stand: "09/2025" },
    { titel: "HTW Berlin – Nullvergütung bei negativen Börsenstrompreisen und weitere Konstruktionsfehler des Solarspitzen-Gesetzes", url: "https://solar.htw-berlin.de/publikationen/nullverguetung-solarspitzen-gesetz/", stand: "04/2025" },
    { titel: "§ 9 EEG 2023 – Technische Vorgaben", url: "https://www.gesetze-im-internet.de/eeg_2014/__9.html", stand: "09/2026" },
    { titel: "§ 51 EEG 2023 – Verringerung des Zahlungsanspruchs bei negativen Preisen", url: "https://www.gesetze-im-internet.de/eeg_2014/__51.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Ost-West-Dach?", text: "Wir berechnen, wie viel Leistung und Eigenverbrauch Ihr Dach bringt.", href: "/angebot", label: "Anlage planen lassen" },
  cta: {
    title: "Ost-West-Dach? Oft mehr Potenzial als gedacht.",
    text: "Wir prüfen beide Dachseiten, Verschattung und Statik vor Ort und rechnen Varianten mit und ohne Speicher – ehrlich, auch wenn eine Seite sich nicht lohnt.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
