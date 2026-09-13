// Ratgeber: Negative Strompreise – Ursachen, Häufigkeit, Folgen für PV, Chancen
// Häufigkeiten selbst ausgewertet aus den Day-Ahead-Preisen DE-LU der Energy-Charts-API
// (Fraunhofer ISE, Daten: Bundesnetzagentur | SMARD.de, CC BY 4.0), Abruf 13.09.2026.
// Bis 30.09.2025 Stundenwerte, ab 01.10.2025 Viertelstundenwerte (zeitgewichtet gezählt).
// Endkundenpreis-Umrechnung nutzt TARIF_ANNAHMEN wie der Tarif-Rechner.

import { TARIF_ANNAHMEN } from "@/lib/energy";

const brutto = (eurMwh) => (eurMwh / 10 + TARIF_ANNAHMEN.aufschlagCt) * (1 + TARIF_ANNAHMEN.mwst);
const ctStr = (n) => String(Math.round(n * 10) / 10).replace(".", ",");

const STUNDEN = { 2021: 139, 2022: 68, 2023: 301, 2024: 457, 2025: 575 };
const STUNDEN_2026_BIS_SEPT = 446;
const STUNDEN_2025_BIS_SEPT = 492;

const artikel = {
  slug: "negative-strompreise",
  title: "Negative Strompreise: Ursachen, Häufigkeit und Folgen für PV",
  seoTitle: "Negative Strompreise 2026: Ursachen & Folgen | Ökovolt",
  kurzTitel: "Negative Strompreise",
  description:
    "Negative Strompreise: Warum sie entstehen, wie oft sie auftreten (Energy-Charts-Daten bis 2026), was sie für PV bedeuten und wann ein dynamischer Tarif hilft.",
  excerpt:
    "575 Stunden mit negativen Börsenpreisen gab es 2025 – so viele wie nie. Was dahintersteckt, warum neue PV-Anlagen dann keine Vergütung bekommen und warum Strom für Haushalte trotzdem nicht gratis wird.",
  hauptKeyword: "negative strompreise",
  keywords: ["negative Strompreise", "negative Strompreise 2026", "negative Strompreise Photovoltaik", "negative Strompreise Einspeisevergütung", "Strompreis negativ warum", "negative Strompreise dynamischer Stromtarif"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Kontakt/download-2.jpg",
  bildAlt: "Solarmodule im Vordergrund, Windräder im Abendlicht dahinter",
  badge: { wert: `${STUNDEN[2025]} h`, text: "negative Börsenpreise 2025 (Day-Ahead, DE-LU)" },

  kurzFazit: [
    `**Negative Strompreise entstehen an der Börse, wenn mehr Strom angeboten als nachgefragt wird** – vor allem an sonnigen, windigen Wochenenden und Feiertagen zur Mittagszeit.`,
    `Sie werden häufiger: ${STUNDEN[2023]} Stunden 2023, ${STUNDEN[2024]} Stunden 2024 und **${STUNDEN[2025]} Stunden 2025**. Bis zum 13. September 2026 waren es ${STUNDEN_2026_BIS_SEPT} Stunden – etwas weniger als im Vorjahreszeitraum.`,
    "Neue PV-Anlagen seit dem 25. Februar 2025 erhalten in diesen Zeiten **keine Einspeisevergütung**, sobald ein Smart Meter verbaut ist. Die ausgefallene Zeit wird am Ende der Förderdauer anteilig angehängt.",
    `Haushalte zahlen auch bei negativen Börsenpreisen Netzentgelte, Abgaben und Steuern. Mit dynamischem Tarif kostet eine Kilowattstunde dann grob ${ctStr(brutto(-50))} bis ${ctStr(brutto(0))} ct – günstig, aber nicht gratis.`,
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was sind negative Strompreise?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein negativer Strompreis bedeutet, dass Stromerzeuger an der Börse Geld dafür bezahlen, dass ihnen jemand den Strom abnimmt.** Gemeint ist der Großhandelspreis am Day-Ahead-Markt, an dem Strom für den Folgetag gehandelt wird. Er fällt unter null, wenn in einer Stunde oder Viertelstunde mehr Strom ins Netz drängt, als verbraucht, gespeichert oder ins Ausland exportiert werden kann.",
        },
        {
          typ: "p",
          text: "Für Verbraucher ist das keine Gutschrift auf der Stromrechnung: Der Börsenpreis macht nur einen Teil des Endkundenpreises aus. Für Betreiber von Solaranlagen hat er dagegen direkte Folgen – für neue Anlagen entfällt in diesen Zeiten die [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026), und der Marktwert von Solarstrom sinkt insgesamt.",
        },
        {
          typ: "kennzahl",
          wert: `${ctStr((STUNDEN[2025] / 8760) * 100)} %`,
          titel: "aller Stunden des Jahres 2025 hatten einen negativen Day-Ahead-Preis",
          text: `Das entspricht ${STUNDEN[2025]} Stunden an 103 Tagen. 2026 lag der Anteil bis Mitte September bei rund 7 %.`,
        },
      ],
    },
    {
      id: "ursachen",
      titel: "Warum wird der Strompreis negativ?",
      tocLabel: "Ursachen",
      bloecke: [
        {
          typ: "p",
          text: "**Negative Preise sind die Folge eines kurzfristigen Überangebots, das sich nicht schnell genug abregelt.** Mehrere Faktoren kommen dabei zusammen:",
        },
        {
          typ: "karten",
          items: [
            { titel: "Viel Sonne und Wind gleichzeitig", text: "Zur Mittagszeit liefern Zehntausende Megawatt Photovoltaik fast gleichzeitig. Weht zusätzlich Wind, übersteigt die Erzeugung schnell den Bedarf." },
            { titel: "Wenig Nachfrage", text: "An Wochenenden und Feiertagen ruhen Industrie und Gewerbe. Deshalb fallen besonders viele negative Stunden auf Sonntage, Ostern, Pfingsten und den 1. Mai." },
            { titel: "Unflexible Kraftwerke", text: "Manche Anlagen laufen weiter, weil Abschalten und Wiederanfahren teurer ist oder sie Wärme und Systemdienstleistungen liefern müssen." },
            { titel: "Fehlendes Preissignal", text: "Viele kleinere PV-Anlagen mit fester Einspeisevergütung speisen unabhängig vom Börsenpreis ein – für ihre Betreiber gibt es keinen Anreiz, bei Überschuss abzuregeln." },
          ],
        },
        {
          typ: "p",
          text: "Speicher, flexible Verbraucher und Exporte gleichen einen Teil davon aus, reichen aber noch nicht, um die Spitzen vollständig aufzufangen. Genau hier setzen das [Solarspitzengesetz](/ratgeber/solarspitzengesetz), dynamische Tarife und der Ausbau von Batteriespeichern an.",
        },
      ],
    },
    {
      id: "haeufigkeit",
      titel: "Wie oft gibt es negative Strompreise? Die Zahlen seit 2021",
      tocLabel: "Häufigkeit",
      bloecke: [
        {
          typ: "p",
          text: `**Die Zahl der Stunden mit negativen Day-Ahead-Preisen hat sich von ${STUNDEN[2022]} im Jahr 2022 auf ${STUNDEN[2025]} im Jahr 2025 mehr als verachtfacht.** 2026 verläuft bislang etwas ruhiger: Bis zum 13. September zählten wir ${STUNDEN_2026_BIS_SEPT} Stunden, im gleichen Zeitraum 2025 waren es ${STUNDEN_2025_BIS_SEPT}. Grundlage ist unsere Auswertung der Börsenpreise für die Gebotszone Deutschland/Luxemburg aus den Energy-Charts des Fraunhofer ISE.`,
        },
        {
          typ: "tabelle",
          caption: "Negative Day-Ahead-Strompreise in Deutschland/Luxemburg nach Jahr",
          kopf: ["Jahr", "Stunden mit negativem Preis", "Anteil am Jahr", "Tiefster Preis"],
          zeilen: [
            ["2021", `${STUNDEN[2021]} h`, "1,6 %", "–"],
            ["2022", `${STUNDEN[2022]} h`, "0,8 %", "–"],
            ["2023", `${STUNDEN[2023]} h`, "3,4 %", "−500 €/MWh (2. Juli)"],
            ["2024", `${STUNDEN[2024]} h`, "5,2 %", "−135 €/MWh (12. Mai)"],
            ["**2025**", `**${STUNDEN[2025]} h**`, "**6,6 %**", "−250 €/MWh (11. Mai)"],
            ["2026 (bis 13.9.)", `${STUNDEN_2026_BIS_SEPT} h`, "7,2 %", "−500 €/MWh (1. Mai)"],
          ],
          markierteZeile: 4,
          fussnote: "Eigene Auswertung der Day-Ahead-Preise DE-LU (Energy-Charts / Fraunhofer ISE; Daten Bundesnetzagentur, SMARD.de, CC BY 4.0), Abruf 13.09.2026. Bis September 2025 Stundenpreise, seit 1. Oktober 2025 Viertelstundenpreise – negative Viertelstunden sind zeitanteilig als Stunden gezählt. Andere Auswertungen können wegen Rundung oder Zählweise leicht abweichen.",
        },
        {
          typ: "h3",
          text: "Wann negative Preise auftreten",
        },
        {
          typ: "p",
          text: "Das Muster ist eindeutig: 2025 entfielen **rund 83 % der negativen Stunden auf die Zeit zwischen 11 und 17 Uhr**, und mehr als die Hälfte lag auf Samstagen und Sonntagen, obwohl diese nur knapp 30 % der Tage ausmachen. Die meisten negativen Stunden hatten die Monate Mai und Juni. Längere Phasen über Nacht gibt es fast nur bei Starkwind im Winterhalbjahr – 2023 etwa über Weihnachten.",
        },
        {
          typ: "tabelle",
          caption: "Negative Stunden je Monat 2025 und 2026 (Day-Ahead, DE-LU)",
          kopf: ["Monat", "2025", "2026"],
          zeilen: [
            ["Januar", "14 h", "3 h"],
            ["Februar", "0 h", "6 h"],
            ["März", "30 h", "35 h"],
            ["April", "75 h", "123 h"],
            ["Mai", "129 h", "79 h"],
            ["Juni", "141 h", "50 h"],
            ["Juli", "12 h", "77 h"],
            ["August", "64 h", "57 h"],
            ["September", "60 h", "19 h (bis 13.9.)"],
            ["Oktober", "50 h", "–"],
            ["November / Dezember", "0 h", "–"],
          ],
          fussnote: "Gerundete Werte, gleiche Datenbasis wie oben. Das Wetter bestimmt die Verteilung stark: Ein sonniger, windiger April 2026 brachte mehr negative Stunden als der gesamte Frühsommer.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Aktuelle Preise live verfolgen",
          text: "Wie sich der Börsenstrompreis heute und morgen entwickelt und ob negative Viertelstunden anstehen, zeigt unsere Seite [Energie live](/energie-live) auf Basis der Energy-Charts-Daten.",
        },
      ],
    },
    {
      id: "folgen-pv",
      titel: "Was negative Preise für Ihre PV-Anlage bedeuten",
      tocLabel: "Folgen für PV-Anlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Ob negative Preise Ihre Einnahmen betreffen, hängt vom Inbetriebnahmedatum, der Anlagengröße und der Messtechnik ab.** Für die meisten bestehenden Einfamilienhaus-Anlagen ändert sich nichts. Seit dem Solarspitzengesetz gilt für neue Anlagen aber eine strengere Regel.",
        },
        {
          typ: "tabelle",
          caption: "Vergütung bei negativen Börsenpreisen nach Anlagentyp, Stand September 2026",
          kopf: ["Anlage", "Vergütung bei negativem Preis", "Ausgleich"],
          zeilen: [
            ["Neu ab 25.2.2025, mit intelligentem Messsystem", "**keine** (anzulegender Wert sinkt auf null, § 51 EEG)", "Förderzeitraum wird am Ende anteilig verlängert (§ 51a EEG)"],
            ["Neu ab 25.2.2025, unter 100 kW, noch ohne Smart Meter", "weiter Vergütung, bis das Messsystem eingebaut ist", "nach Einbau gilt die neue Regel (laut BSW ab dem Folgejahr)"],
            ["Neu ab 25.2.2025, unter 2 kW", "ausgenommen, solange die Bundesnetzagentur nichts anderes festlegt", "–"],
            ["Bestandsanlage vor 25.2.2025", "Vergütung wie bisher; ältere große Anlagen nach früheren Stundenregeln", "freiwilliger Wechsel in die neue Regel mit 0,6 ct/kWh Aufschlag möglich"],
            ["Direktvermarktung", "keine Marktprämie; Erlös am Markt negativ", "Direktvermarkter regeln in solchen Zeiten meist ab"],
            ["Ü20-Anlage", "Anschlussvergütung zum Jahresmarktwert, der durch negative Preise sinkt", "–"],
          ],
          minBreite: 760,
          fussnote: "Quellen: §§ 51, 51a EEG 2023; Bundesverband Solarwirtschaft, FAQ Solarspitzengesetz. Neue Anlagen ohne Steuerbox dürfen zusätzlich nur 60 % ihrer Modulleistung einspeisen.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "So funktioniert die Verlängerung nach § 51a EEG",
          text: "Die Viertelstunden ohne Vergütung werden über die gesamte Förderdauer gezählt und bei Solaranlagen mit dem Faktor 0,5 multipliziert. Das Ergebnis wird nach Ende der 20 Jahre in sogenannten Volllastviertelstunden nachgeholt – mit festen Monatswerten, etwa 490 im Mai und 73 im Dezember. Weil negative Preise vor allem in ertragsstarken Stunden auftreten, gleicht die Verlängerung den Ausfall nur teilweise aus.",
        },
        {
          typ: "p",
          text: `Der Effekt ist größer, als die Stundenzahl vermuten lässt: Negative Preise fallen genau in die ertragsstärksten Stunden. Nach unserer Auswertung der Energy-Charts-Daten wurde 2025 **rund ein Viertel (24 %) des öffentlich erzeugten Solarstroms** in Stunden mit negativem Day-Ahead-Preis produziert. Für eine einzelne Anlage hängt der Anteil von Ausrichtung und Standort ab. Wer diesen Strom **selbst verbraucht oder speichert**, statt ihn einzuspeisen, ist davon nicht betroffen – der Eigenverbrauch bleibt unabhängig vom Börsenpreis wertvoll.`,
        },
        {
          typ: "liste",
          punkte: [
            "**Eigenverbrauch statt Einspeisung:** Waschmaschine, Warmwasser, Wärmepumpe und E-Auto in die Mittagsstunden legen – siehe [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
            "**Speicher intelligent laden:** Nicht schon morgens volladen, sondern die Mittagsspitze abfangen. Das mindert auch die Wirkung der 60-%-Begrenzung – Grundlagen im Ratgeber [Stromspeicher-Größe](/ratgeber/stromspeicher-groesse).",
            "**Energiemanagement nutzen:** Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) kann Preis- und Wetterprognosen verbinden und Verbraucher automatisch steuern.",
            "**Ost-West-Ausrichtung prüfen:** Sie verteilt die Erzeugung über den Tag und speist weniger in die Mittagsspitze ein – mehr dazu in [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
          ],
        },
      ],
    },
    {
      id: "dynamischer-tarif",
      titel: "Chance für Verbraucher: Profitiert man mit dynamischem Stromtarif?",
      tocLabel: "Dynamischer Tarif",
      bloecke: [
        {
          typ: "p",
          text: "**Mit einem dynamischen Stromtarif zahlen Sie in Stunden mit negativen Börsenpreisen deutlich weniger – kostenlos wird der Strom aber in aller Regel nicht.** Der Arbeitspreis setzt sich aus dem Börsenpreis und festen Bestandteilen zusammen: Netzentgelte, Umlagen, Stromsteuer, Konzessionsabgabe, Marge und Umsatzsteuer. Diese Aufschläge liegen unabhängig vom Börsenpreis bei rund 20 ct je Kilowattstunde netto.",
        },
        {
          typ: "tabelle",
          caption: "Endkundenpreis mit dynamischem Tarif bei verschiedenen Börsenpreisen (Orientierung 2026)",
          kopf: ["Börsenpreis", "entspricht", "Arbeitspreis brutto ca."],
          zeilen: [
            ["+100 €/MWh", "10 ct/kWh", `${ctStr(brutto(100))} ct/kWh`],
            ["0 €/MWh", "0 ct/kWh", `${ctStr(brutto(0))} ct/kWh`],
            ["−50 €/MWh", "−5 ct/kWh", `${ctStr(brutto(-50))} ct/kWh`],
            ["−250 €/MWh", "−25 ct/kWh", `${ctStr(brutto(-250))} ct/kWh`],
          ],
          hervorheben: 2,
          fussnote: `Annahme wie in unserem Tarif-Rechner: ${ctStr(TARIF_ANNAHMEN.aufschlagCt)} ct/kWh netto Aufschlag für Netzentgelte, Abgaben, Umlagen und Marge, zzgl. ${Math.round(TARIF_ANNAHMEN.mwst * 100)} % Umsatzsteuer. Zum Vergleich: Festpreistarif rund ${TARIF_ANNAHMEN.festpreisCt} ct/kWh. Einzelne Anbieter rechnen abweichend. Rechnerisch negativ wird der Endpreis erst unter etwa −195 €/MWh – das kam 2025 in rund 3 Stunden und 2026 bis September in knapp 8 Stunden vor; ob ein Anbieter dann tatsächlich eine Gutschrift gewährt, regelt der Vertrag.`,
        },
        {
          typ: "p",
          text: "Wirtschaftlich interessant wird ein dynamischer Tarif, wenn Sie **große, verschiebbare Lasten** haben: ein E-Auto, das mittags oder nachts lädt, eine Wärmepumpe mit Pufferspeicher oder einen Batteriespeicher, der im Winter günstigen Netzstrom zwischenspeichern darf. Voraussetzung ist ein intelligentes Messsystem. Ob sich das für Ihr Profil rechnet, zeigen der Ratgeber [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich) und unser Rechner.",
        },
        {
          typ: "tool",
          href: "/rechner/dynamischer-stromtarif",
          titel: "Dynamischer Tarif oder Festpreis?",
          text: "Mit echten Börsenpreisen von Energy-Charts berechnen, was Haushalt, E-Auto oder Wärmepumpe mit dynamischem Tarif kosten.",
          label: "Zum Tarif-Rechner",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "PV-Besitzer profitieren meist weniger als gedacht",
          text: "Negative Preise treten fast immer dann auf, wenn auch Ihre eigene Anlage viel Strom erzeugt. In diesen Stunden brauchen Sie ohnehin kaum Netzstrom. Den größten Nutzen hat ein dynamischer Tarif für PV-Haushalte in den Wintermonaten und in Nächten mit viel Windstrom – und nur, wenn Verbraucher oder Speicher gezielt gesteuert werden.",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Ausblick: Werden negative Strompreise noch häufiger?",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Solange der Solarausbau schneller wächst als Speicher und flexible Nachfrage, bleiben negative Preise ein regelmäßiges Phänomen.** Gleichzeitig wirken mehrere Gegenkräfte: Große Batteriespeicher gehen in hoher Zahl ans Netz, neue PV-Anlagen reagieren durch das Solarspitzengesetz auf Preissignale, Direktvermarkter regeln ab, und dynamische Tarife verschieben Verbrauch in günstige Stunden. Dass 2026 bis September etwas weniger negative Stunden brachte als 2025, liegt vor allem am Wetter, zeigt aber auch, dass die Flexibilität im System zunimmt.",
        },
        {
          typ: "p",
          text: "Für Ihre Planung heißt das: Eine PV-Anlage sollte heute auf **Eigenverbrauch** ausgelegt sein, nicht auf maximale Einspeisung. Ein passend dimensionierter Speicher, steuerbare Verbraucher und ein intelligentes Messsystem machen die Anlage unabhängig von Börsenspitzen. Die aktuelle Wirtschaftlichkeit rechnet der Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich) durch.",
        },
      ],
    },
  ],

  faq: [
    { q: "Warum gibt es negative Strompreise?", a: "Weil zeitweise mehr Strom erzeugt wird, als verbraucht, gespeichert oder exportiert werden kann. Vor allem an sonnigen, windigen Wochenenden und Feiertagen zur Mittagszeit übersteigt das Angebot die Nachfrage, und unflexible Kraftwerke sowie fest vergütete Anlagen speisen weiter ein." },
    { q: "Wie oft gab es 2025 negative Strompreise?", a: `Nach unserer Auswertung der Energy-Charts-Daten ${STUNDEN[2025]} Stunden an 103 Tagen – so viele wie nie zuvor. 2024 waren es ${STUNDEN[2024]}, 2023 ${STUNDEN[2023]} Stunden. Bis zum 13. September 2026 wurden ${STUNDEN_2026_BIS_SEPT} Stunden gezählt.` },
    { q: "Bekomme ich bei negativen Strompreisen Geld für meinen Stromverbrauch?", a: "In der Regel nein. Auch mit dynamischem Tarif zahlen Sie Netzentgelte, Abgaben und Steuern, die zusammen rund 20 ct je Kilowattstunde netto ausmachen. Die Kilowattstunde wird bei negativen Börsenpreisen deutlich günstiger, bleibt aber meist im positiven Bereich." },
    { q: "Bekommt meine PV-Anlage bei negativen Preisen keine Einspeisevergütung?", a: "Das gilt für Anlagen, die seit dem 25. Februar 2025 in Betrieb gingen und ein intelligentes Messsystem haben (Anlagen unter 2 kW ausgenommen). Die Zeiten werden am Ende der Förderdauer anteilig nachgeholt. Ältere Einfamilienhaus-Anlagen erhalten ihre Vergütung weiterhin." },
    { q: "Muss ich meine PV-Anlage bei negativen Strompreisen abschalten?", a: "Nein, eine Pflicht zum Abschalten gibt es für kleine Anlagen nicht. Neue Anlagen erhalten in diesen Zeiten aber keine Vergütung. Sinnvoll ist, den Strom dann selbst zu verbrauchen oder zu speichern; ein Energiemanagementsystem kann das automatisieren." },
    { q: "Wann treten negative Strompreise am häufigsten auf?", a: "Zwischen etwa 11 und 17 Uhr, besonders an Sonntagen und Feiertagen im Frühjahr und Frühsommer. 2025 lagen die meisten negativen Stunden im Mai und Juni, 2026 im April." },
    { q: "Wo kann ich sehen, ob der Strompreis gerade negativ ist?", a: "Die Energy-Charts des Fraunhofer ISE und die Plattform SMARD der Bundesnetzagentur veröffentlichen die Börsenpreise. Eine kompakte Ansicht für heute und morgen bietet unsere Seite [Energie live](/energie-live)." },
  ],

  passend: [
    { href: "/ratgeber/solarspitzengesetz", titel: "Solarspitzengesetz", text: "60-%-Regel und Vergütung bei negativen Preisen." },
    { href: "/ratgeber/dynamischer-stromtarif-lohnt-sich", titel: "Dynamischer Stromtarif", text: "Für wen er sich lohnt – mit Rechenbeispielen." },
    { href: "/energie-live", titel: "Energie live", text: "Börsenstrompreis heute und morgen." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Mittagsspitzen speichern statt einspeisen." },
  ],

  quellen: [
    { titel: "Fraunhofer ISE – Energy-Charts: Day-Ahead-Börsenstrompreise Deutschland/Luxemburg (API, eigene Auswertung)", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=DE", stand: "09/2026" },
    { titel: "Bundesnetzagentur – SMARD Strommarktdaten", url: "https://www.smard.de/home", stand: "09/2026" },
    { titel: "§ 51 EEG 2023 – Verringerung des Zahlungsanspruchs bei negativen Preisen", url: "https://www.gesetze-im-internet.de/eeg_2014/__51.html", stand: "09/2026" },
    { titel: "§ 51a EEG 2023 – Verlängerung des Vergütungszeitraums bei negativen Preisen", url: "https://www.gesetze-im-internet.de/eeg_2014/__51a.html", stand: "09/2026" },
    { titel: "Bundesverband Solarwirtschaft – FAQ Solarspitzen-Gesetz", url: "https://www.solarwirtschaft.de/unsere-themen/photovoltaik/standpunkte/faq-solarspitzengesetz/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Negative Preise nutzen?", text: "Dynamischen Tarif mit echten Börsenpreisen durchrechnen.", href: "/rechner/dynamischer-stromtarif", label: "Zum Tarif-Rechner" },
  cta: {
    title: "Solarstrom selbst nutzen statt in die Mittagsspitze einspeisen.",
    text: "Wir planen Anlage, Speicher und Energiemanagement so, dass negative Börsenpreise Ihre Rechnung kaum berühren.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
