// Ratgeber: Solarspitzengesetz – was es für PV-Anlagen bedeutet
// Rechtsstand September 2026. Geprüft an gesetze-im-internet.de: § 9, § 19 Abs. 3c,
// § 51, § 51a, § 52, § 100 Abs. 3b und 47 EEG; § 29, § 30, § 35, § 45 MsbG.
// Abregelungsverluste: HTW Berlin (zitiert nach Verbraucherzentrale Hamburg, 09/2025).
// EEG-Novelle 2027: Kabinettsbeschluss vom 29.07.2026, noch kein Gesetz.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const kwhFmt = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

// Orientierung: 10-kWp-Anlage, Süd, Jahresertrag aus den Solarrechner-Annahmen
const ERTRAG_10 = ANNAHMEN.ertragProKwpSued * 10;
const SATZ_VOLL = VERGUETUNG.saetze[0].volleinspeisung / 100;
const verlust = (pct) => ERTRAG_10 * pct;

const artikel = {
  slug: "solarspitzengesetz",
  title: "Solarspitzengesetz: 60-%-Regel und negative Preise erklärt",
  seoTitle: "Solarspitzengesetz 2026: 60-%-Regel erklärt | Ökovolt",
  kurzTitel: "Solarspitzengesetz",
  description:
    "Solarspitzengesetz einfach erklärt: 60-%-Einspeisegrenze, keine Vergütung bei negativen Preisen, Smart-Meter-Kosten, Bestandsanlagen und was 2027 geplant ist.",
  excerpt:
    "Seit dem 25. Februar 2025 gelten für neue PV-Anlagen strengere Regeln. Was die 60-%-Grenze wirklich kostet, wann die Vergütung bei negativen Preisen entfällt und wie Sie gegensteuern.",
  hauptKeyword: "solarspitzengesetz",
  keywords: [
    "Solarspitzengesetz",
    "Solarspitzengesetz 60 Prozent",
    "Einspeisebegrenzung 60 Prozent PV",
    "negative Strompreise Einspeisevergütung",
    "Solarspitzengesetz Bestandsanlagen",
    "Solarspitzengesetz Smart Meter",
    "Solarspitzengesetz Speicher",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Kontakt/faqs.jpg",
  bildAlt: "Solarmodule in der Mittagssonne vor blauem Himmel",
  badge: { wert: "60 %", text: "maximale Einspeiseleistung für Neuanlagen ohne Smart Meter" },

  kurzFazit: [
    "**Das Solarspitzengesetz gilt seit dem 25. Februar 2025 für neu in Betrieb genommene PV-Anlagen.** Bestandsanlagen behalten ihre bisherigen Regeln.",
    "**60-%-Regel:** Bis Smart Meter und Steuerbox eingebaut und getestet sind, dürfen Neuanlagen mit Einspeisevergütung höchstens 60 % ihrer Modulleistung ins Netz einspeisen (§ 9 Abs. 2 EEG). Eigenverbrauch und Speicher sind nicht begrenzt.",
    "**Negative Börsenpreise:** Für diese Viertelstunden gibt es keine Vergütung (§ 51 EEG) – bei Anlagen unter 100 kW aber erst ab dem Jahr nach dem Smart-Meter-Einbau. Die Zeit wird am Ende der 20 Jahre anteilig angehängt.",
    "**Die realen Verluste sind klein:** Laut HTW Berlin kostet die 60-%-Grenze ohne Speicher 1,1 bis 9 % des Ertrags, mit prognosebasiert geladenem Speicher nur etwa 1 bis 2 %.",
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist das Solarspitzengesetz?",
      bloecke: [
        {
          typ: "p",
          text: "**Das Solarspitzengesetz ist eine Änderung von EEG, Energiewirtschafts- und Messstellenbetriebsgesetz, die seit dem 25. Februar 2025 gilt und Stromnetze an sonnigen Mittagen entlasten soll.** Es setzt an zwei Stellen an: Neue PV-Anlagen speisen bis zum Einbau eines Smart Meters mit Steuerbox gedrosselt ein, und für Strom, der bei negativen Börsenpreisen ins Netz fließt, entfällt die Vergütung. Im Gegenzug wird die Förderdauer verlängert, und Speicher werden flexibler nutzbar.",
        },
        {
          typ: "p",
          text: "Hintergrund sind die Solarspitzen: Wenn Millionen Anlagen gleichzeitig ihr Maximum erreichen und wenig Strom verbraucht wird, fallen die Börsenpreise unter null. Laut HTW Berlin gab es schon 2024 an 80 Tagen [negative Strompreise](/ratgeber/negative-strompreise), fast ausschließlich im Sommerhalbjahr. Wie die Preise aktuell aussehen, zeigt unsere Seite [Energie live](/energie-live).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Rechtsstand und Hinweis",
          text: "Stand September 2026. Dieser Ratgeber fasst die gesetzlichen Regeln verständlich zusammen und ersetzt keine Rechtsberatung. Maßgeblich sind die jeweils geltende Fassung des EEG und die Vorgaben Ihres Netzbetreibers.",
        },
      ],
    },
    {
      id: "welche-regel",
      titel: "Welche Regeln gelten für meine Anlage?",
      tocLabel: "Regeln nach Anlagengröße",
      bloecke: [
        {
          typ: "p",
          text: "**Entscheidend sind zwei Fragen: Wann ging die Anlage in Betrieb, und wie groß ist sie?** Für Anlagen ab dem 25. Februar 2025 gilt die folgende Übersicht. Die Leistungsangaben beziehen sich auf die installierte Leistung, also die Modulleistung in kWp – nicht auf den Wechselrichter.",
        },
        {
          typ: "tabelle",
          caption: "Solarspitzengesetz: Pflichten für Neuanlagen ab 25.02.2025 nach Größe (Stand September 2026)",
          kopf: ["Anlagengröße", "Einspeisegrenze bis Smart Meter + Steuerbox", "Keine Vergütung bei negativen Preisen", "Smart Meter mit Steuerbox"],
          zeilen: [
            ["Steckersolar bis 2 kW / 800 VA", "keine", "nein, bis zu einer Festlegung der BNetzA", "nicht vorgesehen"],
            ["über 2 bis 7 kWp", "60 % (bei Einspeisevergütung)", "ab dem Jahr nach Smart-Meter-Einbau", "optional, auf Wunsch"],
            ["über 7 bis unter 25 kWp", "60 % (bei Einspeisevergütung)", "ab dem Jahr nach Smart-Meter-Einbau", "Pflichteinbaufall"],
            ["25 bis unter 100 kWp", "fernsteuerbar und 60 % (bei Einspeisevergütung)", "ab dem Jahr nach Smart-Meter-Einbau", "Pflichteinbaufall"],
            ["ab 100 kWp", "fernsteuerbar, Direktvermarktung", "sofort", "Pflichteinbaufall"],
          ],
          minBreite: 700,
          fussnote: "Grundlage: § 9 Abs. 2, § 51 Abs. 2 EEG, § 29 MsbG. „Ab dem Jahr nach Smart-Meter-Einbau“ heißt: ab dem 1. Januar, der auf den Einbau des intelligenten Messsystems folgt. Die 60-%-Grenze entfällt erst nach erfolgreichem Test der Ansteuerbarkeit durch den Netzbetreiber.",
        },
        {
          typ: "h3",
          text: "Bestandsanlagen: Nichts ändert sich – außer Sie wollen es",
        },
        {
          typ: "p",
          text: "Anlagen, die vor dem 25. Februar 2025 in Betrieb gingen, fallen nicht unter die 60-%-Regel (für Anlagen ab 2023 stellt das § 100 Abs. 3b EEG ausdrücklich klar), und für sie gelten die alten Regeln zu negativen Preisen weiter (§ 100 Abs. 46 EEG), die kleine Hausdachanlagen nicht betreffen. Wer freiwillig in die neue Regel wechselt, erhält 0,6 ct je kWh mehr Vergütung (§ 100 Abs. 47 EEG). Der Wechsel wirkt aber frühestens zum Ende des Jahres, in dem ein Smart Meter eingebaut wurde, und rechnet sich vor allem, wenn ein Speicher die Einspeisung aus negativen Preisphasen herausverschiebt.",
        },
      ],
    },
    {
      id: "60-prozent",
      titel: "Die 60-%-Regel: Was sie bedeutet und was sie kostet",
      tocLabel: "60-%-Regel",
      bloecke: [
        {
          typ: "p",
          text: "**Die 60-%-Regel begrenzt nur die Leistung, die am Netzanschlusspunkt ins öffentliche Netz fließt – nicht die Erzeugung.** Eine 10-kWp-Anlage darf also höchstens 6 kW einspeisen. Was im Haus verbraucht, in den Speicher geladen oder in Wallbox und Wärmepumpe genutzt wird, zählt nicht mit. Die Anlage wird deshalb nur dann tatsächlich abgeregelt, wenn sie mehr als 60 % erzeugt und gleichzeitig wenig verbraucht wird – typischerweise an klaren Mittagen zwischen April und August.",
        },
        {
          typ: "p",
          text: "Die [Einspeisebegrenzung](/wissen/lexikon#einspeisebegrenzung) stellt der Elektrofachbetrieb bei der Inbetriebnahme im Wechselrichter oder Energiemanagement ein. Sie gilt nach § 9 Abs. 2 Satz 1 Nr. 3 EEG für Anlagen unter 25 kW, die Einspeisevergütung oder Mieterstromzuschlag erhalten. Sie fällt weg, sobald ein intelligentes Messsystem mit [Steuerbox](/wissen/lexikon#steuerbox) eingebaut ist und der Netzbetreiber die Ansteuerung erfolgreich getestet hat.",
        },
        {
          typ: "tabelle",
          caption: `Abregelungsverluste durch die 60-%-Grenze – Orientierung für eine 10-kWp-Anlage mit ${kwhFmt(ERTRAG_10)} Jahresertrag`,
          kopf: ["Szenario (HTW Berlin)", "Verlust am Ertrag", "entspricht etwa", "Wert bei Volleinspeisung"],
          zeilen: [
            ["Volleinspeisung, Süd, ohne Speicher", "9,0 %", kwhFmt(verlust(0.09)), eur(verlust(0.09) * SATZ_VOLL)],
            ["Volleinspeisung, Ost-West, ohne Speicher", "1,1 %", kwhFmt(verlust(0.011)), eur(verlust(0.011) * SATZ_VOLL)],
            ["Mit Eigenverbrauch und prognosebasiert geladenem Speicher", "ca. 1–2 %", `${kwhFmt(verlust(0.01))}–${kwhFmt(verlust(0.02))}`, "–"],
          ],
          hervorheben: 1,
          minBreite: 640,
          fussnote: `Prozentwerte: Simulation der HTW Berlin, zitiert nach Verbraucherzentrale Hamburg (Stand 09/2025). Euro-Werte: eigene Umrechnung mit ${ct(VERGUETUNG.saetze[0].volleinspeisung)} ct je kWh (Volleinspeisung bis 10 kWp, Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}) und ${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp. Bei Teileinspeisung liegt der Verlust in Euro deutlich niedriger, weil Eigenverbrauch die Spitzen kappt.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum Ost-West kaum betroffen ist",
          text: "Eine Ost-West-Anlage erreicht selten mehr als 60 % ihrer Nennleistung, weil beide Dachseiten ihre Spitze zu unterschiedlichen Zeiten haben. Mehr dazu im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
      ],
    },
    {
      id: "negative-preise",
      titel: "Keine Vergütung bei negativen Strompreisen",
      tocLabel: "Negative Preise",
      bloecke: [
        {
          typ: "p",
          text: "**Für Zeiträume mit negativem Spotmarktpreis verringert sich der anzulegende Wert auf null (§ 51 Abs. 1 EEG).** Das gilt seit dem Solarspitzengesetz viertelstundengenau und unabhängig davon, wie lange die Negativphase dauert. Betroffen sind Neuanlagen in der Einspeisevergütung und in der Direktvermarktung.",
        },
        {
          typ: "p",
          text: "Für kleinere Anlagen gibt es eine wichtige Übergangsregel: Bei Anlagen unter 100 kW greift die Nullvergütung erst nach Ablauf des Kalenderjahres, in dem ein intelligentes Messsystem eingebaut wurde (§ 51 Abs. 2 Nr. 1 EEG). Ohne Smart Meter kann der Netzbetreiber gar nicht viertelstündlich messen. Solange keines verbaut ist, gilt stattdessen die 60-%-Grenze.",
        },
        { typ: "h3", text: "Die ausgefallene Vergütung wird hinten angehängt" },
        {
          typ: "p",
          text: "Die Förderung ist nicht verloren. § 51a EEG verlängert den 20-jährigen Vergütungszeitraum: Die Viertelstunden ohne Vergütung werden gezählt, für Solaranlagen mit dem Faktor 0,5 gewichtet und in sogenannte Volllastviertelstunden umgerechnet. Diese werden nach Ende der regulären Laufzeit angehängt – bewertet nach dem Ertragspotenzial des jeweiligen Monats, im Juni etwa 508, im Dezember 73 Volllastviertelstunden. Weil die Nachholung erst in rund 20 Jahren kommt und nur anteilig erfolgt, ist sie heute weniger wert als die entgangene Vergütung.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Speicher mittags laden", text: "Ein Speicher, der erst in der Mittagsspitze statt am Morgen lädt, nimmt genau den Strom auf, der sonst gekappt oder unvergütet eingespeist würde." },
            { titel: "Verbrauch verschieben", text: "Waschmaschine, Spülmaschine, Wärmepumpe und E-Auto in die Mittagsstunden legen – per Zeitschaltung oder [Energiemanagement](/ratgeber/energiemanagementsystem)." },
            { titel: "Dynamischer Tarif", text: "Wer Netzstrom bezieht, profitiert von denselben niedrigen Preisen. Wann sich das lohnt, zeigt der Ratgeber [dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich)." },
          ],
        },
      ],
    },
    {
      id: "smart-meter",
      titel: "Smart Meter und Steuerbox: Pflicht, Kosten und Zeitplan",
      tocLabel: "Smart Meter & Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Anlagen über 7 kW gehören zu den Pflichteinbaufällen für ein intelligentes Messsystem mit Steuerungseinrichtung (§ 29 MsbG).** Den Einbau übernimmt der grundzuständige Messstellenbetreiber. Das Gesetz setzt ihm ein Ziel: Bis Ende 2026 sollen mindestens 90 % der zwischen dem 25. Februar 2025 und dem 30. September 2026 neu installierten PV-Leistung ausgestattet sein (§ 45 MsbG). In der Praxis hinkt der Rollout vielerorts hinterher – mehr im Ratgeber [Smart-Meter-Pflicht](/ratgeber/smart-meter-pflicht).",
        },
        {
          typ: "tabelle",
          caption: "Preisobergrenzen für Smart Meter bei PV-Anlagen nach § 30 MsbG (brutto pro Jahr, ab 2025)",
          kopf: ["Installierte Leistung", "Anlagenbetreiber zahlt höchstens", "plus Steuerbox (Anschlussnehmer)", "Anteil Netzbetreiber"],
          zeilen: [
            ["bis 7 kW (optionaler Einbau)", "30 €", "–", "30 €"],
            ["über 7 bis 15 kW", "50 €", "50 €", "80 € + 50 €"],
            ["über 15 bis 25 kW", "110 €", "50 €", "80 € + 50 €"],
            ["über 25 bis 100 kW", "140 €", "50 €", "80 € + 50 €"],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Quelle: § 30 Abs. 1 bis 3 MsbG. Liegt zusätzlich ein Pflichteinbaufall wegen des Verbrauchs oder einer steuerbaren Verbrauchseinrichtung vor, gilt die jeweils höchste einschlägige Preisobergrenze (§ 30 Abs. 5 MsbG). Auf Wunsch vorzeitig eingebaut werden darf das Messsystem gegen ein einmaliges Entgelt von höchstens 100 € (§ 35 MsbG).",
        },
        {
          typ: "p",
          text: "Wenn der Messstellenbetreiber das Messsystem einbaut, der Netzbetreiber die Steuerbarkeit aber nicht testet, bleibt die 60-%-Grenze bestehen. Für diesen Fall zahlt der Netzbetreiber ab dem 1. Januar 2028 für jedes angefangene Jahr 100 € brutto an den Anlagenbetreiber, sofern er die fehlende Testung zu vertreten hat (§ 9 Abs. 2a EEG).",
        },
      ],
    },
    {
      id: "speicher",
      titel: "Speicher, Direktvermarktung und Energiemanagement",
      tocLabel: "Speicher & EMS",
      bloecke: [
        {
          typ: "p",
          text: "**Der wirksamste Hebel gegen beide Regeln ist ein Stromspeicher, der nicht einfach „so früh wie möglich“ lädt, sondern die Mittagsspitze abfängt.** Simulationen der HTW Berlin zeigen, dass ein Speicher mit prognosebasierter Ladestrategie die Abregelungsverluste auf rund 1 bis 2 % des Ertrags drücken kann – ein Speicher, der morgens bereits voll ist, hilft dagegen kaum. Passende Systeme finden Sie unter [Stromspeicher](/produkte/stromspeicher); wie groß der Speicher sein sollte, erklärt der Ratgeber [Stromspeicher-Größe](/ratgeber/stromspeicher-groesse).",
        },
        {
          typ: "p",
          text: "Neu ist außerdem, dass Speicher Netz- und Solarstrom mischen dürfen, ohne die Förderung zu verlieren. Für PV-Anlagen bis 30 kW sieht § 19 Abs. 3c EEG eine Pauschaloption vor: Gefördert werden bis zu 500 kWh eingespeister Strom je kW Solarleistung pro Jahr. Sie gilt für die Marktprämie, setzt also eine [Direktvermarktung](/service/direktvermarktung) voraus, und die Details regelt eine Festlegung der Bundesnetzagentur. Für die meisten Einfamilienhäuser bleibt die klassische Einspeisevergütung vorerst einfacher.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Herstellerneutral konfigurieren",
          text: "Ob ein System prognosebasiert lädt, die 60-%-Grenze dynamisch unter Einbeziehung des Hausverbrauchs regelt und später die Steuerbox einbindet, hängt von Wechselrichter, Energiemanagement und Einstellungen ab. Ökovolt arbeitet als Partner unter anderem mit Fronius, Huawei, Sigenergy, Solis, BYD und meteocontrol – entscheidend ist aber die passende Konfiguration für Ihr Verbrauchsprofil, nicht die Marke.",
        },
        {
          typ: "tool",
          href: "/rechner/stromspeicher",
          titel: "Wie viel Speicher braucht Ihre Anlage?",
          text: "Speichergröße, Autarkie und Wirtschaftlichkeit für Ihren Verbrauch berechnen.",
          label: "Zum Stromspeicher-Rechner",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Ausblick: Was die EEG-Novelle 2027 plant",
      tocLabel: "Ausblick 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Das Bundeskabinett hat am 29. Juli 2026 eine EEG-Novelle beschlossen, die die Regeln für Neuanlagen ab 2027 weiter verschärfen soll.** Laut Bundesregierung soll die Einspeiseleistung kleiner und mittlerer PV-Dachanlagen auf 50 % begrenzt werden, und Anlagen unter 25 kW sollen statt dauerhafter Einspeisevergütung einen vierjährigen Direktvermarktungsbonus erhalten. Fachmedien berichten zusätzlich von einer befristeten Übergangsvergütung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Noch kein geltendes Recht",
          text: "Der Entwurf muss Bundestag und Bundesrat passieren und braucht eine beihilferechtliche Genehmigung der EU-Kommission. Details können sich im Verfahren ändern. Für Anlagen, die nach bisherigem Stand bis Ende 2026 in Betrieb gehen, gelten die heutigen Regeln einschließlich 20 Jahren Vergütung. Die aktuellen Sätze stehen im Ratgeber [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026).",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Anlage auf Eigenverbrauch auslegen** – je mehr Solarstrom im Haus bleibt, desto weniger berühren Einspeisegrenzen und Negativpreise die Rechnung.",
            "**Speicher mit intelligenter Ladestrategie einplanen** statt maximaler Einspeisung.",
            "**Smart Meter frühzeitig beim Messstellenbetreiber anfragen,** wenn die 60-%-Grenze spürbar Ertrag kostet.",
            "**Wärmepumpe, Wallbox und Haushaltsgeräte** über ein Energiemanagement auf die Mittagsstunden legen.",
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Gilt das Solarspitzengesetz auch für meine bestehende PV-Anlage?", a: "Nein. Die 60-%-Grenze und die Nullvergütung bei negativen Preisen gelten nur für Anlagen, die ab dem 25. Februar 2025 in Betrieb genommen wurden. Bestandsanlagen können freiwillig wechseln und erhalten dann 0,6 ct je kWh mehr Vergütung (§ 100 Abs. 47 EEG)." },
    { q: "Bezieht sich die 60-%-Regel auf die Modul- oder die Wechselrichterleistung?", a: "Auf die installierte Leistung, also die Modulleistung in kWp. Bei 10 kWp dürfen am Netzanschlusspunkt höchstens 6 kW eingespeist werden. Was im Haus verbraucht oder gespeichert wird, zählt nicht mit." },
    { q: "Wann fällt die 60-%-Begrenzung weg?", a: "Sobald ein intelligentes Messsystem mit Steuerungseinrichtung eingebaut ist und der Netzbetreiber die Ansteuerbarkeit erfolgreich getestet hat (§ 9 Abs. 2 EEG). Bis dahin bleibt die Grenze bestehen." },
    { q: "Bekomme ich bei negativen Strompreisen gar keine Einspeisevergütung mehr?", a: "Für Neuanlagen entfällt die Vergütung in Viertelstunden mit negativem Börsenpreis. Bei Anlagen unter 100 kW gilt das aber erst ab dem Jahr nach dem Smart-Meter-Einbau. Die ausgefallenen Zeiten werden anteilig an das Ende der 20-jährigen Förderdauer angehängt." },
    { q: "Wie viel Ertrag kostet die 60-%-Regel?", a: "Laut HTW Berlin zwischen 1,1 % (Ost-West) und 9 % (Süd) bei Volleinspeisung ohne Speicher. Mit Eigenverbrauch und einem Speicher, der gezielt die Mittagsspitze aufnimmt, sind es meist nur 1 bis 2 %." },
    { q: "Gilt das Solarspitzengesetz auch für Balkonkraftwerke?", a: "Nein. Steckersolargeräte bis 2 kW Modulleistung und 800 VA Wechselrichterleistung sind von der Einspeisegrenze ausgenommen, und die Nullvergütung gilt für Anlagen unter 2 kW erst nach einer Festlegung der Bundesnetzagentur." },
    { q: "Was kostet der Smart Meter für meine PV-Anlage?", a: "Für Anlagen über 7 bis 15 kW darf der Messstellenbetreiber dem Betreiber höchstens 50 € im Jahr berechnen, plus höchstens 50 € für die Steuerbox (§ 30 MsbG). Bis 7 kW sind es beim optionalen Einbau höchstens 30 € im Jahr." },
    { q: "Lohnt sich ein Stromspeicher wegen des Solarspitzengesetzes?", a: "Er ist der wirksamste Ausgleich, rechnet sich aber vor allem über den höheren Eigenverbrauch. Die vermiedenen Abregelungsverluste sind ein Zusatznutzen. Ob sich ein Speicher für Sie lohnt, zeigt der [Stromspeicher-Rechner](/rechner/stromspeicher)." },
  ],

  passend: [
    { href: "/ratgeber/negative-strompreise", titel: "Negative Strompreise", text: "Ursachen, Häufigkeit und Chancen für PV-Betreiber." },
    { href: "/ratgeber/smart-meter-pflicht", titel: "Smart-Meter-Pflicht", text: "Wer ein intelligentes Messsystem bekommt und was es kostet." },
    { href: "/ratgeber/paragraf-14a-enwg", titel: "§ 14a EnWG", text: "Steuerbare Verbraucher und reduzierte Netzentgelte." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Die passende Speichergröße berechnen." },
  ],

  quellen: [
    { titel: "§ 9 EEG – Technische Vorgaben und 60-%-Begrenzung", url: "https://www.gesetze-im-internet.de/eeg_2014/__9.html", stand: "09/2026" },
    { titel: "§ 51 EEG – Verhalten bei negativen Preisen", url: "https://www.gesetze-im-internet.de/eeg_2014/__51.html", stand: "09/2026" },
    { titel: "§ 51a EEG – Verlängerung des Vergütungszeitraums", url: "https://www.gesetze-im-internet.de/eeg_2014/__51a.html", stand: "09/2026" },
    { titel: "§ 100 EEG – Übergangsbestimmungen (Abs. 3b, Abs. 47)", url: "https://www.gesetze-im-internet.de/eeg_2014/__100.html", stand: "09/2026" },
    { titel: "§ 30 MsbG – Preisobergrenzen für intelligente Messsysteme", url: "https://www.gesetze-im-internet.de/messbg/__30.html", stand: "09/2026" },
    { titel: "Verbraucherzentrale Hamburg – Solarspitzen und Fördergelder: Neue Regeln für Photovoltaikanlagen", url: "https://www.vzhh.de/themen/bauen-immobilien-energie/erneuerbare-energien/solarspitzen-foerdergelder-neue-regeln-fuer-photovoltaikanlagen", stand: "09/2025" },
    { titel: "HTW Berlin – Nullvergütung bei negativen Börsenstrompreisen und weitere Konstruktionsfehler des Solarspitzen-Gesetzes", url: "https://solar.htw-berlin.de/publikationen/nullverguetung-solarspitzen-gesetz/", stand: "04/2025" },
    { titel: "Bundesregierung – Kabinett beschließt EEG-Novelle und Netzpaket", url: "https://www.bundesregierung.de/breg-de/aktuelles/kabinett-eeg-novelle-netzpaket-strom-2448636", stand: "07/2026" },
  ],

  seitenCta: { titel: "60-%-Grenze clever umgehen", text: "Speicher und Energiemanagement richtig auslegen.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Wir planen Ihre Anlage für die neuen Regeln.",
    text: "Mit Eigenverbrauch statt Einspeisespitzen, passend dimensioniertem Speicher und korrekt eingestellter Einspeisebegrenzung – geplant und montiert vom Fachbetrieb aus Türkheim.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
