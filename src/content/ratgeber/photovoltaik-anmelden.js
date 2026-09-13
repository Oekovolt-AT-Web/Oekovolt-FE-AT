// Ratgeber: PV-Anlage anmelden 2026
// Rechtsstand September 2026. Geprüft an gesetze-im-internet.de: § 8, § 9, § 48 Abs. 2a,
// § 52 EEG; § 5 und § 7 MaStRV; § 13 und § 19 NAV; § 29 MsbG. Finanzamt: BMF-Schreiben
// vom 12.06.2023 laut LfSt Bayern „Hilfe zu Photovoltaikanlagen“ (06/2025).

import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const artikel = {
  slug: "photovoltaik-anmelden",
  title: "PV-Anlage anmelden 2026: Netzbetreiber, Register und Fristen",
  seoTitle: "PV-Anlage anmelden 2026: Ablauf & Fristen | Ökovolt",
  kurzTitel: "PV-Anlage anmelden",
  description:
    "Photovoltaik anmelden 2026: Netzbetreiber, Marktstammdatenregister und Finanzamt – Reihenfolge, Fristen, Unterlagen und was bei versäumter Anmeldung droht.",
  excerpt:
    "Wo Sie eine Solaranlage anmelden müssen, in welcher Reihenfolge, mit welchen Fristen – und warum der Weg zum Finanzamt heute meist entfällt. Mit Checkliste und Sonderfällen.",
  hauptKeyword: "photovoltaik anmelden",
  keywords: [
    "Photovoltaik anmelden",
    "PV-Anlage anmelden",
    "Solaranlage anmelden Netzbetreiber",
    "Marktstammdatenregister PV-Anlage",
    "PV-Anlage anmelden Frist",
    "Stromspeicher anmelden",
    "PV-Anlage anmelden Finanzamt",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg",
  bildAlt: "Monteur mit Arbeitshandschuhen verschraubt ein Solarmodul auf dem Dach",
  badge: { wert: "1 Monat", text: "Frist für das Marktstammdatenregister nach Inbetriebnahme" },

  kurzFazit: [
    "**Zwei Anmeldungen sind Pflicht:** beim Netzbetreiber vor dem Anschluss und im Marktstammdatenregister der Bundesnetzagentur innerhalb eines Monats nach Inbetriebnahme (§ 5 MaStRV).",
    "**Die Netzanmeldung übernimmt der Elektrofachbetrieb** – nur eingetragene Installateure dürfen Anlagen ans Hausnetz anschließen (§ 13 NAV).",
    "**Für Anlagen bis 30 kW muss der Netzbetreiber binnen eines Monats antworten** (§ 8 Abs. 7 EEG). Tut er das nicht, darf angeschlossen werden.",
    "**Wer die Registrierung versäumt, zahlt:** 10 € je kW und Monat an den Netzbetreiber, nach dem Nachholen rückwirkend 2 € (§ 52 EEG). Das Finanzamt braucht meist keine Meldung mehr.",
  ],

  abschnitte: [
    {
      id: "wo-anmelden",
      titel: "Wo muss ich meine PV-Anlage anmelden?",
      tocLabel: "Wo anmelden?",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Photovoltaikanlage müssen Sie an zwei Stellen anmelden: beim örtlichen Netzbetreiber, bevor sie angeschlossen wird, und im Marktstammdatenregister der Bundesnetzagentur, spätestens einen Monat nach der Inbetriebnahme.** Beides gilt auch für den Stromspeicher. Eine Meldung beim Finanzamt ist für typische private Dachanlagen seit 2023 in der Regel nicht mehr nötig, eine Baugenehmigung für Dachanlagen meist ebenfalls nicht – Ausnahmen erklärt der Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
        },
        {
          typ: "tabelle",
          caption: "Anmeldungen für eine private PV-Anlage im Überblick, Stand September 2026",
          kopf: ["Stelle", "Wann", "Wer erledigt es", "Rechtsgrundlage"],
          zeilen: [
            ["Netzbetreiber: Netzanschlussbegehren", "vor der Montage", "Elektrofachbetrieb", "§ 8 EEG, § 19 Abs. 3 NAV"],
            ["Netzbetreiber: Inbetriebsetzung und Fertigmeldung", "nach der Montage", "Elektrofachbetrieb", "VDE-AR-N 4105, Vorgaben des Netzbetreibers"],
            ["Marktstammdatenregister", "bis 1 Monat nach Inbetriebnahme", "Betreiber (oft mit Vollmacht durch den Fachbetrieb)", "§ 5 MaStRV"],
            ["Messstellenbetreiber: Zählertausch", "nach der Anmeldung", "wird vom Netzbetreiber angestoßen", "§ 29 MsbG"],
            ["Finanzamt", "in der Regel nicht erforderlich", "–", "BMF-Schreiben vom 12.06.2023"],
          ],
          minBreite: 680,
          fussnote: "Genaue Formulare und Portale unterscheiden sich je nach Netzbetreiber. Für Balkonkraftwerke bis 2 kW und 800 VA genügt die Registrierung im Marktstammdatenregister.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Wer ist mein Netzbetreiber?",
          text: "Der [Netzbetreiber](/wissen/lexikon#netzbetreiber) betreibt das Stromnetz vor Ihrer Haustür und ist nicht zwingend Ihr Stromanbieter. Sie finden ihn auf der Stromrechnung oder am Zähler. Er schließt die Anlage an, zahlt die Einspeisevergütung und stößt den Zählertausch an.",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Schritt für Schritt: So läuft die Anmeldung ab",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "p",
          text: "**Die Reihenfolge ist entscheidend: erst Netzanschlussbegehren, dann Montage und Inbetriebnahme, dann Registrierung und Fertigmeldung.** Wer die Anlage vor der Zusage des Netzbetreibers anschließt, riskiert Ärger – umgekehrt darf der Netzbetreiber die Sache nicht beliebig verzögern.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Netzanschlussbegehren stellen", "Der Fachbetrieb reicht Anlagendaten beim Netzbetreiber ein: Modul- und Wechselrichterleistung, Datenblätter und Zertifikate nach [VDE-AR-N 4105](/wissen/lexikon#vde-ar-n-4105), Speicher, Lageplan und Übersichtsschaltplan. Seit 2025 müssen Netzbetreiber dafür ein Webportal anbieten (§ 8 Abs. 7 EEG)."],
            ["Antwort des Netzbetreibers abwarten", "Bei Anlagen bis 30 kW auf einem Grundstück mit bestehendem Netzanschluss muss der Netzbetreiber spätestens einen Monat nach Eingang das Ergebnis der Netzverträglichkeitsprüfung, einen Zeitplan und gegebenenfalls einen Kostenvoranschlag schicken. Meldet er sich nicht fristgerecht, darf die Anlage am bestehenden Hausanschluss angeschlossen werden."],
            ["Montage und Inbetriebnahme", "Nach der Montage nimmt der eingetragene Elektrofachbetrieb die Anlage in Betrieb, erstellt das Inbetriebsetzungsprotokoll und stellt – bei Neuanlagen ohne Smart Meter – die Einspeisebegrenzung auf 60 % ein. Hintergrund im Ratgeber [Solarspitzengesetz](/ratgeber/solarspitzengesetz)."],
            ["Im Marktstammdatenregister registrieren", "Anlage und Speicher innerhalb eines Monats nach Inbetriebnahme unter marktstammdatenregister.de eintragen. Die Registrierung ist kostenlos. Danach erhalten Sie die MaStR-Nummern."],
            ["Fertigmeldung an den Netzbetreiber", "Inbetriebsetzungsprotokoll, MaStR-Nummern, Bankverbindung und Angaben zur Umsatzsteuer (meist: Kleinunternehmer) übermitteln. Erst dann kann die Einspeisevergütung abgerechnet werden."],
            ["Zählertausch", "Der Messstellenbetreiber setzt einen Zweirichtungszähler oder ein intelligentes Messsystem. Anlagen über 7 kW gehören zu den Pflichteinbaufällen für Smart Meter mit Steuerungseinrichtung (§ 29 MsbG)."],
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Volleinspeisung vor der Inbetriebnahme mitteilen",
          text: `Wer den gesamten Strom einspeisen möchte, erhält eine höhere Vergütung – bei Anlagen bis 10 kWp derzeit ${ct(VERGUETUNG.saetze[0].volleinspeisung)} statt ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct je kWh. Dafür muss die Volleinspeisung dem Netzbetreiber im ersten Jahr vor der Inbetriebnahme und danach jeweils vor dem 1. Dezember für das Folgejahr in Textform mitgeteilt werden (§ 48 Abs. 2a EEG). Wer das vergisst, bekommt den Satz für Teileinspeisung. Details im Ratgeber [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026).`,
        },
      ],
    },
    {
      id: "marktstammdatenregister",
      titel: "Marktstammdatenregister: Was Sie eintragen müssen",
      tocLabel: "Marktstammdatenregister",
      bloecke: [
        {
          typ: "p",
          text: "**Das Marktstammdatenregister ist das amtliche Verzeichnis aller Stromerzeugungsanlagen und Speicher in Deutschland. Betreiber müssen ihre Anlage innerhalb eines Monats nach Inbetriebnahme dort registrieren** (§ 5 Abs. 5 MaStRV). Eine Kurzerklärung finden Sie im [Lexikon](/wissen/lexikon#marktstammdatenregister). Die Pflicht trifft den Betreiber persönlich – auch wenn der Fachbetrieb die Eingabe mit Vollmacht übernimmt. Änderungen wie ein Eigentümerwechsel, eine Erweiterung oder die Stilllegung sind ebenfalls binnen eines Monats nachzutragen (§ 7 MaStRV).",
        },
        { typ: "h3", text: "Diese Angaben brauchen Sie" },
        {
          typ: "checkliste",
          punkte: [
            "**Persönliche Daten** für das Benutzerkonto und die Anlage als Betreiber (natürliche Person).",
            "**Standort** mit Adresse, bei Freiflächen oder Nebengebäuden auch Flurstück.",
            "**Datum der Inbetriebnahme** laut Inbetriebsetzungsprotokoll.",
            "**Bruttoleistung** (Summe der Modulleistung in kWp) und **Nettonennleistung** (Wechselrichterleistung in kW).",
            "**Einspeiseart** (Teil- oder Volleinspeisung) und gegebenenfalls die Leistungsbegrenzung.",
            "**Speicher separat:** nutzbare Kapazität und Leistung des Batteriespeichers.",
            "**Netzbetreiber** und, falls schon vorhanden, Zählpunktbezeichnung.",
          ],
        },
        {
          typ: "p",
          text: "Nach dem Speichern prüft der Netzbetreiber die Angaben im Register. Die Bruttoleistung laut Marktstammdatenregister ist später auch steuerlich wichtig: Sie entscheidet, ob Nullsteuersatz und Einkommensteuerbefreiung automatisch greifen – mehr dazu im Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
      ],
    },
    {
      id: "fristen",
      titel: "Fristen und Folgen: Was passiert, wenn die Anmeldung fehlt?",
      tocLabel: "Fristen & Folgen",
      bloecke: [
        {
          typ: "p",
          text: "**Die teuerste Nachlässigkeit ist die fehlende Registrierung im Marktstammdatenregister.** Seit 2023 streicht das EEG in diesem Fall nicht mehr die Vergütung, sondern verlangt eine Zahlung an den Netzbetreiber: 10 € je Kilowatt installierter Leistung für jeden Kalendermonat mit Pflichtverstoß (§ 52 Abs. 2 EEG). Wird die Registrierung nachgeholt, sinkt der Betrag rückwirkend auf 2 € je kW und Monat (§ 52 Abs. 3 EEG). Der Netzbetreiber darf das mit Ihrer Einspeisevergütung verrechnen.",
        },
        {
          typ: "tabelle",
          caption: "Wichtige Fristen rund um die Anmeldung einer PV-Anlage",
          kopf: ["Pflicht", "Frist", "Folge bei Versäumnis"],
          zeilen: [
            ["Netzanschlussbegehren", "vor dem Anschluss", "Anschluss ohne Abstimmung verstößt gegen § 19 NAV; Netzbetreiber kann Nachbesserung verlangen"],
            ["Registrierung im Marktstammdatenregister", "1 Monat nach Inbetriebnahme", "10 € je kW und Monat, nach Nachholen rückwirkend 2 € (§ 52 EEG)"],
            ["Änderungen im Register (Erweiterung, Verkauf)", "1 Monat nach Eintritt", "Registerdaten falsch; Nachteile bei Vergütung und Steuer möglich"],
            ["60-%-Begrenzung bzw. Steuerbarkeit (Neuanlagen)", "ab Inbetriebnahme", "10 € je kW und Monat, nach Behebung 2 € (§ 52 EEG)"],
            ["Mitteilung Volleinspeisung", "vor Inbetriebnahme bzw. vor dem 1. Dezember", "nur Vergütung für Teileinspeisung"],
          ],
          minBreite: 640,
          fussnote: "Rechtsstand September 2026. Beispiel: Eine 10-kWp-Anlage wird drei Monate zu spät registriert. Nach dem Nachholen fallen 3 × 10 × 2 € = 60 € an, ohne Nachholen wären es 300 € für diese drei Monate – und es liefe weiter.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          text: "Lassen Sie sich die MaStR-Bestätigung vom Fachbetrieb schicken, auch wenn er die Registrierung übernimmt, und legen Sie sie zu Rechnung und Inbetriebsetzungsprotokoll. Diese drei Dokumente brauchen Sie später für Versicherung, Verkauf des Hauses oder eine Erweiterung.",
        },
      ],
    },
    {
      id: "sonderfaelle",
      titel: "Sonderfälle: Speicher, Erweiterung, Wallbox und Balkonkraftwerk",
      tocLabel: "Sonderfälle",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Speicher nachrüsten", text: "Der Netzbetreiber muss vorab informiert werden, und der Speicher ist binnen eines Monats im Marktstammdatenregister zu registrieren. Kann er mit mehr als 4,2 kW aus dem Netz laden, gilt er als steuerbare Verbrauchseinrichtung – siehe [§ 14a EnWG](/ratgeber/paragraf-14a-enwg)." },
            { titel: "Anlage erweitern", text: "Neue Module sind eine eigene Anlage im Register und ein neues Netzanschlussbegehren. Innerhalb von 12 Monaten in Betrieb genommene Anlagen auf demselben Gebäude werden für die Vergütung zusammengerechnet (§ 24 EEG)." },
            { titel: "Wallbox und Wärmepumpe", text: "Ladeeinrichtungen sind dem Netzbetreiber vor der Inbetriebnahme mitzuteilen, über 12 kVA braucht es seine Zustimmung (§ 19 Abs. 2 NAV). Wärmepumpen und Wallboxen über 4,2 kW fallen unter § 14a EnWG. Mehr im Ratgeber [Wallbox-Installation](/ratgeber/wallbox-installation)." },
            { titel: "Balkonkraftwerk", text: "Steckersolargeräte bis 2 kW Modulleistung und 800 VA Wechselrichterleistung benötigen keine Meldung beim Netzbetreiber (§ 8 Abs. 5a EEG), nur die Registrierung im Marktstammdatenregister. Mehr im Ratgeber [Balkonkraftwerk](/ratgeber/balkonkraftwerk)." },
          ],
        },
        {
          typ: "p",
          text: "Wird das Haus verkauft oder vererbt, wechselt der Anlagenbetreiber. Der neue Eigentümer muss den Betreiberwechsel im Register eintragen und mit dem Netzbetreiber die Abrechnung der Einspeisevergütung umstellen. Die Vergütungsdauer läuft dabei unverändert weiter.",
        },
      ],
    },
    {
      id: "finanzamt",
      titel: "Muss ich die PV-Anlage beim Finanzamt anmelden?",
      tocLabel: "Finanzamt",
      bloecke: [
        {
          typ: "p",
          text: "**In der Regel nein.** Laut BMF-Schreiben vom 12.06.2023 müssen Betreiber weder den Fragebogen zur steuerlichen Erfassung noch einen PV-Fragebogen abgeben, wenn drei Bedingungen erfüllt sind: Die Anlage ist nach § 3 Nr. 72 EStG einkommensteuerfrei, sie fällt unter den Nullsteuersatz nach § 12 Abs. 3 UStG, und Sie wenden die Kleinunternehmerregelung an. Das trifft auf die meisten Einfamilienhäuser zu. Der Netzbetreiber erhält dann statt einer Steuernummer Ihre MaStR-Nummer.",
        },
        {
          typ: "p",
          text: "Anders ist es, wenn Sie bewusst zur Regelbesteuerung optieren, die Anlage über den Grenzen der Steuerbefreiung liegt oder bereits ein Unternehmen besteht. Dann gelten die üblichen Meldepflichten innerhalb eines Monats nach Aufnahme der Tätigkeit. Das Finanzamt kann Angaben im Einzelfall auch anfordern. Dieser Ratgeber ersetzt keine Steuer- oder Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Versicherung informieren",
          text: "Gesetzlich nicht vorgeschrieben, aber wichtig: Melden Sie die neue Anlage Ihrer Wohngebäudeversicherung. Viele Verträge decken Solaranlagen nur nach Anzeige oder gegen Zuschlag ab.",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Diese Unterlagen sollten Sie am Ende haben",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Bestätigung des Netzbetreibers zum Netzanschlussbegehren",
            "Inbetriebsetzungsprotokoll des Elektrofachbetriebs mit Datum",
            "MaStR-Registrierungsbestätigung für Solaranlage und Speicher",
            "Datenblätter und Zertifikate von Modulen, Wechselrichter und Speicher",
            "Rechnung mit 0 % Umsatzsteuer für Anlage und Speicher",
            "Erste Abrechnung oder Abschlagsplan des Netzbetreibers",
            "Nachweis der Meldung an die Wohngebäudeversicherung",
          ],
        },
        {
          typ: "p",
          text: "Wie lange die einzelnen Schritte vom ersten Gespräch bis zum Zählertausch typischerweise dauern, zeigt der Ratgeber [Ablauf der PV-Installation](/ratgeber/photovoltaik-ablauf). Bei Ökovolt gehören Netzanmeldung, Inbetriebnahme und Registrierung zum [Photovoltaik-Komplettpaket](/dienstleistungen/photovoltaik).",
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Noch in der Planung?",
          text: "Ertrag, Eigenverbrauch und Amortisation für Ihr Dach berechnen – bevor es an die Anmeldung geht.",
          label: "Zum Solarrechner",
        },
      ],
    },
  ],

  faq: [
    { q: "Muss ich meine PV-Anlage anmelden?", a: "Ja. Jede netzgekoppelte Anlage muss beim Netzbetreiber angemeldet und innerhalb eines Monats nach Inbetriebnahme im Marktstammdatenregister registriert werden. Ausnahme sind nur Inselanlagen ohne jede Verbindung zum Stromnetz." },
    { q: "Wer meldet die PV-Anlage beim Netzbetreiber an?", a: "Das übernimmt der Elektrofachbetrieb, der die Anlage anschließt. Nach § 13 NAV dürfen nur Unternehmen, die im Installateurverzeichnis eines Netzbetreibers eingetragen sind, an der Hausinstallation arbeiten und Anlagen in Betrieb nehmen." },
    { q: "Wie lange dauert die Anmeldung beim Netzbetreiber?", a: "Für Anlagen bis 30 kW auf einem Grundstück mit bestehendem Netzanschluss muss der Netzbetreiber spätestens einen Monat nach Eingang des Netzanschlussbegehrens antworten (§ 8 Abs. 7 EEG). Größere Anlagen können länger dauern, im Regelfall gilt dann eine Frist von acht Wochen nach Eingang aller Informationen." },
    { q: "Was kostet die Anmeldung einer PV-Anlage?", a: "Die Registrierung im Marktstammdatenregister und das Netzanschlussbegehren sind kostenlos. Kosten entstehen durch den Zählertausch beziehungsweise das laufende Messentgelt und gegebenenfalls durch Arbeiten am Zählerschrank. Bei Fachbetrieben ist die Anmeldung meist im Angebot enthalten." },
    { q: "Was passiert, wenn ich die Frist im Marktstammdatenregister verpasse?", a: "Sie müssen an den Netzbetreiber 10 € je kW installierter Leistung pro Monat zahlen. Holen Sie die Registrierung nach, reduziert sich der Betrag rückwirkend auf 2 € je kW und Monat (§ 52 EEG). Registrieren Sie deshalb auch verspätet so schnell wie möglich." },
    { q: "Muss ich den Stromspeicher separat anmelden?", a: "Ja. Der Speicher ist beim Netzbetreiber anzugeben und im Marktstammdatenregister als eigene Einheit zu registrieren – auch wenn er gemeinsam mit der Anlage installiert wird oder später dazukommt." },
    { q: "Muss ich ein Balkonkraftwerk beim Netzbetreiber anmelden?", a: "Nein. Steckersolargeräte bis 2 kW und 800 VA brauchen seit 2024 keine Meldung beim Netzbetreiber mehr. Die vereinfachte Registrierung im Marktstammdatenregister bleibt aber Pflicht." },
    { q: "Muss ich die PV-Anlage beim Finanzamt anmelden?", a: "Meist nicht. Ist die Anlage einkommensteuerfrei, zum Nullsteuersatz gekauft und nutzen Sie die Kleinunternehmerregelung, entfällt der Fragebogen zur steuerlichen Erfassung. Einzelheiten im Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern)." },
  ],

  howTo: {
    name: "PV-Anlage anmelden",
    schritte: [
      { name: "Netzanschlussbegehren stellen", text: "Der Elektrofachbetrieb reicht die Anlagendaten über das Portal des Netzbetreibers ein." },
      { name: "Antwort abwarten", text: "Bei Anlagen bis 30 kW antwortet der Netzbetreiber innerhalb eines Monats mit Netzverträglichkeitsprüfung und Zeitplan." },
      { name: "Anlage in Betrieb nehmen", text: "Nach der Montage nimmt der Fachbetrieb die Anlage in Betrieb und erstellt das Inbetriebsetzungsprotokoll." },
      { name: "Im Marktstammdatenregister registrieren", text: "Solaranlage und Speicher innerhalb eines Monats nach Inbetriebnahme registrieren." },
      { name: "Fertigmeldung abschicken", text: "Protokoll, MaStR-Nummern, Bankverbindung und Steuerstatus an den Netzbetreiber übermitteln." },
    ],
  },

  passend: [
    { href: "/ratgeber/photovoltaik-steuern", titel: "Photovoltaik und Steuern", text: "Nullsteuersatz, Einkommensteuer und Kleinunternehmer." },
    { href: "/ratgeber/solarspitzengesetz", titel: "Solarspitzengesetz", text: "60-%-Regel und negative Strompreise für Neuanlagen." },
    { href: "/forderungen/richtlinien", titel: "Normen & Netzanschluss", text: "VDE-AR-N 4105, EEG und Anmelde-Fahrplan." },
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik aus einer Hand", text: "Planung, Montage, Anmeldung und Inbetriebnahme." },
  ],

  quellen: [
    { titel: "§ 8 EEG – Netzanschluss und Fristen", url: "https://www.gesetze-im-internet.de/eeg_2014/__8.html", stand: "09/2026" },
    { titel: "§ 52 EEG – Zahlungen bei Pflichtverstößen", url: "https://www.gesetze-im-internet.de/eeg_2014/__52.html", stand: "09/2026" },
    { titel: "§ 5 MaStRV – Registrierungspflichten im Marktstammdatenregister", url: "https://www.gesetze-im-internet.de/mastrv/__5.html", stand: "09/2026" },
    { titel: "§ 19 NAV – Mitteilungspflichten gegenüber dem Netzbetreiber", url: "https://www.gesetze-im-internet.de/nav/__19.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Marktstammdatenregister", url: "https://www.marktstammdatenregister.de/MaStR", stand: "09/2026" },
    { titel: "Bayerisches Landesamt für Steuern – Hilfe zu Photovoltaikanlagen (Erster Kontakt mit dem Finanzamt)", url: "https://www.lfst.bayern.de/fileadmin/RESSOURCEN/INFORMATIONEN/Steuerinfos/Weitere_Themen/Photovoltaikanlagen/Hilfe_zu_Photovoltaikanlagen_Juni_2025.pdf", stand: "06/2025" },
  ],

  seitenCta: { titel: "Anmeldung abgeben?", text: "Netzbetreiber und Register übernehmen wir für Sie.", href: "/angebot", label: "Angebot anfragen" },
  cta: {
    title: "Anmeldung inklusive – vom Antrag bis zum Zählertausch.",
    text: "Als Fachbetrieb aus Türkheim übernehmen wir Netzanschlussbegehren, Inbetriebnahme und Registrierung im Marktstammdatenregister für Ihre Anlage.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Leistungen ansehen", href: "/dienstleistungen/photovoltaik" },
  },
};

export default artikel;
