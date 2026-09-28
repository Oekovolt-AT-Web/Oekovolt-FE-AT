// Ratgeber: Photovoltaik reinigen und warten (Österreich, Gewerbe-Schwerpunkt)
// Quellen: Elektroschutzverordnung 2012 (§§ 7–11, Prüffristen), OVE E 8101:2025 (Prüfung Teil 6),
// OVE-Richtlinie R 11-1:2022 (Feuerwehr), IEC TS 62446-3 (Thermografie), IEC 61724-1 (Monitoring),
// IEA-PVPS T13-25 (O&M), OeMAG-Marktpreis PV 2026 (monatlich). Keine Ökovolt-Preise.
// Rechenbeispiele sind als Annahmen gekennzeichnet.

const KWP = 200; // Beispielanlage Gewerbedach
const ERTRAG_KWP = 1050; // kWh/kWp, Annahme für ein Hallendach in Österreich
const ERTRAG = KWP * ERTRAG_KWP;
const MARKT_PV_SOMMER = 0.0677; // €/kWh, OeMAG-Marktpreis PV April–Juni 2026 (6,772 ct/kWh)
const BEZUG = 0.2; // €/kWh netto, Annahme Bezugspreis inkl. Netz und Abgaben (KMU)
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const zeile = (p) => [`${p} %`, kwh((ERTRAG * p) / 100), eur(((ERTRAG * p) / 100) * MARKT_PV_SOMMER), eur(((ERTRAG * p) / 100) * BEZUG)];

const artikel = {
  slug: "photovoltaik-reinigung-wartung",
  title: "Photovoltaik reinigen und warten: Was Betriebe wirklich brauchen",
  seoTitle: "PV Reinigung & Wartung Österreich: Pflichten | Ökovolt",
  kurzTitel: "PV-Reinigung & Wartung",
  description:
    "Photovoltaik Reinigung und Wartung in Österreich: wann Reinigen lohnt, Prüfpflichten nach ESV 2012, Intervalle, Monitoring, Schnee und Checkliste für Betriebe.",
  excerpt:
    "Reinigung nur bei Bedarf, Kontrolle regelmäßig: Was Gewerbe, Landwirtschaft und Gemeinden bei der Pflege ihrer PV-Anlage beachten müssen – mit Prüffristen, Rechenbeispiel und Checkliste.",
  hauptKeyword: "photovoltaik reinigung wartung",
  keywords: [
    "Photovoltaik Reinigung Österreich",
    "PV-Anlage Wartung",
    "Photovoltaik Wartung Pflicht",
    "Solaranlage reinigen Landwirtschaft",
    "PV-Anlage Prüfung ESV",
    "PV Monitoring Gewerbe",
    "Photovoltaik Schnee räumen",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/photovoltaik-reinigung-wartung.jpg",
  bildAlt: "Zwei Prüfer untersuchen Solarmodule auf einem Dach mit einer Wärmebildkamera",
  badge: { wert: "≤ 5 Jahre", text: "Prüffrist für elektrische Anlagen in Arbeitsstätten (ESV 2012)" },

  kurzFazit: [
    "**Eine PV-Anlage muss nur gereinigt werden, wenn sie deutlich und dauerhaft verschmutzt ist – kontrolliert werden muss sie dagegen regelmäßig.** Reinigungsbedarf entsteht vor allem neben Ställen, Futtermittel- und Getreidelagern, Straßen und Bahnlinien sowie bei flach aufgeständerten Modulen.",
    "**In Arbeitsstätten ist die Prüfung Pflicht:** Die Elektroschutzverordnung 2012 verlangt für elektrische Anlagen wiederkehrende Prüfungen in Abständen von längstens fünf Jahren; in Büro- und Handelsbetrieben mit geringer Belastung bis zehn Jahre, auf Baustellen jährlich.",
    `**Rechenbeispiel:** Bei einer ${KWP}-kWp-Anlage kosten 3 % Verschmutzungsverlust rund ${kwh(ERTRAG * 0.03)} im Jahr – bewertet mit dem OeMAG-Sommermarktpreis 2026 etwa ${eur(ERTRAG * 0.03 * MARKT_PV_SOMMER)}, bei Eigenverbrauch (Annahme 20 ct/kWh) rund ${eur(ERTRAG * 0.03 * BEZUG)}.`,
    "**Das wichtigste Wartungswerkzeug ist das Monitoring:** Wer Soll- und Ist-Ertrag je Wechselrichter oder String vergleicht, erkennt Defekte, Verschattung und Verschmutzung innerhalb von Tagen statt nach der Jahresabrechnung.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Muss eine PV-Anlage gereinigt und gewartet werden?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Reinigen ist bei den meisten Anlagen die Ausnahme, Warten und Prüfen die Regel.** Module mit mehr als etwa 15 Grad Neigung werden vom Regen weitgehend sauber gehalten. Was altert, sind die anderen Komponenten: Wechselrichter und Lüfter, DC-Steckverbinder, Kabelbinder und Leitungen, Klemmen der Unterkonstruktion, Überspannungsschutz und Dachdurchführungen. Dazu kommen äußere Einflüsse wie Hagel, Sturm, Schneelast, Marderbiss und Vogelnester.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Reinigung", text: "Bei Bedarf. Anlass ist ein messbarer Ertragsrückgang oder sichtbare, festsitzende Verschmutzung – nicht der Kalender." },
            { titel: "Wartung", text: "Jährlich Sichtkontrolle, Monitoring laufend, Wechselrichter und Schutzorgane nach Herstellervorgabe, nach Unwettern zusätzlich." },
            { titel: "Prüfung", text: "Erstprüfung vor Inbetriebnahme, dann wiederkehrend mit Messungen und Prüfbefund – in Arbeitsstätten gesetzlich vorgeschrieben." },
          ],
        },
        {
          typ: "p",
          text: "Für Gewerbebetriebe, landwirtschaftliche Betriebe und Gemeinden ist die Frage deshalb weniger „ob“, sondern „wie organisiert“: als Einzelbeauftragung oder über einen [Wartungsvertrag für die PV-Anlage](/ratgeber/photovoltaik-wartungsvertrag), der Monitoring, Störungsbehebung und Prüfungen bündelt.",
        },
      ],
    },
    {
      id: "verschmutzung",
      titel: "Wie viel Ertrag kostet Verschmutzung?",
      tocLabel: "Ertragsverlust durch Schmutz",
      bloecke: [
        {
          typ: "p",
          text: "**Verschmutzung kostet in Mitteleuropa meist wenige Prozent Ertrag pro Jahr, an ungünstigen Standorten deutlich mehr.** Entscheidend ist nicht die gleichmäßige Staubschicht, sondern lokale Verschattung: Vogelkot, Laub oder ein Schmutzrand an der unteren Modulkante verschatten einzelne Zellen. Weil Zellen in Serie geschaltet sind, bremst eine verschattete Zelle den ganzen Zellstrang – im Extremfall entstehen Hotspots, die eine [Thermografie](/wissen/lexikon#thermografie) sichtbar macht.",
        },
        {
          typ: "tabelle",
          caption: "Wann Verschmutzung ein Thema ist – typische Standorte in Österreich",
          kopf: ["Situation", "Typische Verschmutzung", "Reinigungsbedarf"],
          zeilen: [
            ["Hallendach, Neigung ab ca. 15°, Gewerbegebiet", "Staub, Pollen – vom Regen weitgehend abgewaschen", "selten, nach Sichtprüfung"],
            ["Flachdach, Aufständerung 10° oder flacher", "Schmutzränder an der Unterkante, Moos, Flechten", "alle 2–4 Jahre prüfen"],
            ["Stall, Mischfutter- oder Getreidelager", "Ammoniak-, Staub- und Fettfilm, Vogelkot", "häufig jährlich"],
            ["Nähe Autobahn, Bahnlinie, Schotterwerk", "Ruß, Bremsabrieb, mineralischer Staub", "jährlich prüfen"],
            ["Hotel, Bergbahn, alpine Lage", "Pollen, Nadeln, Schneeränder", "nach Schneeschmelze prüfen"],
          ],
          minBreite: 640,
          fussnote: "Orientierungswerte aus der Praxis; maßgeblich sind Monitoring-Daten und Herstellervorgaben.",
        },
        {
          typ: "tabelle",
          caption: `Was Verschmutzung eine ${KWP}-kWp-Gewerbeanlage kostet (Beispielrechnung, Stand September 2026)`,
          kopf: ["Ertragsverlust", "Menge pro Jahr", "Wert bei Überschusseinspeisung", "Wert bei Eigenverbrauch"],
          zeilen: [zeile(1), zeile(3), zeile(5), zeile(10)],
          hervorheben: 3,
          markierteZeile: 1,
          minBreite: 620,
          fussnote: `Annahmen: ${ERTRAG_KWP.toLocaleString("de-DE")} kWh/kWp, Einspeisung bewertet mit dem OeMAG-Marktpreis PV April–Juni 2026 (6,772 ct/kWh), Eigenverbrauch mit 20 ct/kWh netto (Energie, Netz, Abgaben – bitte Ihren eigenen Wert einsetzen).`,
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt: Bei hohem Eigenverbrauch lohnt sich eine Reinigung früher, weil jede verlorene Kilowattstunde teuren Netzbezug ersetzt. Bei überwiegender Einspeisung zum Marktpreis rechnet sie sich erst bei stärkerer Verschmutzung. Wie viel Sie selbst nutzen, erklärt der Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "reinigung",
      titel: "Wie reinigt man Photovoltaikmodule richtig?",
      tocLabel: "Richtig reinigen",
      bloecke: [
        {
          typ: "p",
          text: "**Fachgerecht gereinigt wird mit entmineralisiertem (osmotisiertem) Wasser und weichen, rotierenden Bürsten – ohne Hochdruck, Chemie oder Scheuermittel.** Die Antireflexbeschichtung des Modulglases ist empfindlich; Kalkflecken aus Leitungswasser und Kratzer mindern den Ertrag dauerhaft. Viele Hersteller schreiben die zulässigen Methoden in ihrer Montage- und Wartungsanleitung vor – Abweichungen können die Produktgarantie gefährden.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Herstellervorgaben** zu Reinigungsmittel, Wasserdruck, Bürsten und Begehbarkeit prüfen – Module sind in der Regel nicht begehbar.",
            "**Absturzsicherung:** Arbeiten auf Hallendächern nur mit Anschlagpunkten, Seitenschutz oder Hubarbeitsbühne; Lichtkuppeln und Trapezblechdächer sind Absturzkanten.",
            "**Tageszeit:** früh morgens oder bei bedecktem Himmel reinigen – kaltes Wasser auf heißem Glas erzeugt Spannungen.",
            "**Elektrische Sicherheit:** beschädigte Module, Kabel oder Stecker vor dem Nassreinigen melden, nicht besprühen.",
            "**Dokumentation:** Datum, Methode und Ertrag vorher/nachher festhalten – das zeigt, ob sich die Reinigung gelohnt hat.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Landwirtschaft: Ammoniak ist der Sonderfall",
          text: "Über Ställen bilden Staub, Ammoniak und Fett einen Film, den Regen kaum löst. Hier ist eine regelmäßige Reinigung oft wirtschaftlich – und wichtig für die Materialbeständigkeit. Achten Sie bei der Modulwahl auf eine Ammoniakbeständigkeit nach IEC 62716 und lassen Sie Unterkonstruktion und Stecker bei der Wartung gezielt auf Korrosion prüfen. Mehr zu Anlagen im Betrieb unter [Photovoltaik für die Landwirtschaft](/landwirtschaft).",
        },
        {
          typ: "p",
          text: "Die Reinigung großer Dachflächen ist Arbeit für Fachbetriebe mit Hubsteiger, Wasseraufbereitung und Sicherungstechnik. Ökovolt bietet die [Reinigung von PV-Anlagen](/service/reinigung) für Gewerbe, Landwirtschaft und Gemeinden in ganz Österreich an.",
        },
      ],
    },
    {
      id: "pruefpflicht",
      titel: "Welche Prüfpflichten gelten für PV-Anlagen in Österreich?",
      tocLabel: "Prüfpflichten",
      bloecke: [
        {
          typ: "p",
          text: "**Wer Arbeitnehmer beschäftigt, muss seine elektrischen Anlagen – auch die PV-Anlage auf dem Betriebsgebäude – nach der Elektroschutzverordnung 2012 (ESV 2012) vor Inbetriebnahme und danach wiederkehrend prüfen lassen.** Die Prüfung erfolgt durch Elektrofachkräfte mit Erfahrung in der Prüfung vergleichbarer Anlagen; das Ergebnis wird in einem Prüfbefund dokumentiert und aufbewahrt.",
        },
        {
          typ: "tabelle",
          caption: "Höchstabstände wiederkehrender Prüfungen nach § 9 ESV 2012",
          kopf: ["Bereich", "Höchstabstand", "Typische PV-Beispiele"],
          zeilen: [
            ["Regelfall", "5 Jahre", "Produktionshalle, Werkstatt, landwirtschaftliches Betriebsgebäude"],
            ["geringe Belastung (Büro, Handel, Dienstleistung)", "10 Jahre", "Bürogebäude, Geschäftslokal – sofern keine Feuchte, Staub oder Korrosion"],
            ["explosionsgefährdete Bereiche", "3 Jahre (bei außergewöhnlicher Beanspruchung 1 Jahr)", "Biogasanlage, Lackiererei, Getreidelager mit Staub-Ex-Zone"],
            ["Baustellen", "1 Jahr", "PV-Baustrom, temporäre Anlagen"],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Die Behörde kann kürzere Fristen vorschreiben (z. B. bei Feuchtigkeit, Staub, korrosiven Stoffen). Versicherungsbedingungen und Bescheide können strengere Intervalle verlangen. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Welche Messungen dazugehören, wie der Prüfbefund nach OVE E 8101 aussieht und warum der Begriff „E-Check“ in Österreich kein Rechtsbegriff ist, erklärt der Ratgeber [E-Check für PV-Anlagen](/ratgeber/e-check-photovoltaik). Für die Brandbekämpfung verlangt die OVE-Richtlinie R 11-1 unter anderem Kennzeichnung und Feuerwehrpläne – Details im Ratgeber [Brandschutz bei Photovoltaik](/ratgeber/photovoltaik-brandschutz).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Privat ohne Arbeitnehmer: keine ESV-Pflicht, aber Sorgfalt",
          text: "Für private Betreiber ohne Arbeitnehmer gilt die ESV 2012 nicht. Die Pflicht, die Anlage in sicherem Zustand zu halten, bleibt trotzdem – und Versicherer verlangen im Schadenfall oft Nachweise über fachgerechte Errichtung und Instandhaltung. Details unter [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
        },
      ],
    },
    {
      id: "wartung",
      titel: "Was gehört zu einer fachgerechten Wartung?",
      tocLabel: "Wartungsumfang",
      bloecke: [
        {
          typ: "p",
          text: "**Eine fachgerechte Wartung kombiniert Datenanalyse, Sichtprüfung und Messungen – in dieser Reihenfolge.** Zuerst zeigt das Monitoring, wo die Anlage vom Soll abweicht. Dann wird vor Ort gezielt nachgesehen. Messungen und Thermografie bestätigen den Befund und liefern die Grundlage für Reparatur oder Garantieanspruch.",
        },
        {
          typ: "tabelle",
          caption: "Wartungsbausteine für Gewerbe-PV-Anlagen und sinnvolle Intervalle",
          kopf: ["Baustein", "Inhalt", "Intervall (Richtwert)"],
          zeilen: [
            ["Monitoring-Auswertung", "Soll-Ist-Vergleich je Wechselrichter/String, Fehlermeldungen, Performance Ratio", "laufend, Bericht monatlich"],
            ["Sichtprüfung", "Module (Glasbruch, Delamination), Klemmen, Kabelführung, Dachdurchführungen, Vogel- und Marderschäden", "jährlich und nach Unwettern"],
            ["Wechselrichter", "Lüfter, Filter, Temperaturen, Fehlerspeicher, Firmware", "jährlich bzw. nach Hersteller"],
            ["Schutzorgane", "Überspannungsschutz, Fehlerstromschutzschalter (Prüftaste), Trennschalter", "halbjährlich bis jährlich"],
            ["Elektrische Messungen", "Isolationswiderstand, Leerlaufspannung, Kurzschlussstrom, ggf. I-U-Kennlinie", "mit der wiederkehrenden Prüfung"],
            ["Thermografie", "Hotspots, defekte Bypassdioden, Steckerübergänge, Verteiler", "alle 2–4 Jahre, nach Hagel"],
          ],
          minBreite: 680,
          fussnote: "Fehlerstromschutzschalter sind nach § 7 ESV 2012 mittels Prüftaste in den vom Hersteller angegebenen Abständen zu kontrollieren, ohne Angabe mindestens halbjährlich.",
        },
        {
          typ: "p",
          text: "Die [Performance Ratio](/wissen/lexikon#performance-ratio) ist die wichtigste Kennzahl: Sie setzt den tatsächlichen Ertrag ins Verhältnis zur Einstrahlung und macht Anlagen und Jahre vergleichbar. Sinkt sie ohne erkennbaren Grund, steckt oft ein Stringausfall, ein defekter Wechselrichter oder Verschmutzung dahinter. Bei größeren Anlagen läuft die Auswertung über ein SCADA- oder [Fernwartungssystem](/technik/fernwartung), das Alarme automatisch an den Servicepartner meldet.",
        },
      ],
    },
    {
      id: "schnee",
      titel: "Schnee auf der PV-Anlage: räumen oder abwarten?",
      tocLabel: "Schnee & Winter",
      bloecke: [
        {
          typ: "p",
          text: "**Schnee sollten Sie in der Regel nicht vom Modulfeld räumen – entscheidend ist, dass Dach und Unterkonstruktion die Last tragen.** Die Module rutschen bei ausreichender Neigung meist von selbst frei, und der Ertragsgewinn im Winter ist gering. Riskant ist das Räumen selbst: Kratzer, Glasbruch und Absturzgefahr stehen in keinem Verhältnis zum Nutzen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Schneelast prüfen:** Maßgeblich ist die Bemessung nach ÖNORM B 1991-1-3 für die Schneelastzone des Standorts – mehr im Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
            "**Flachdächer:** Aufgeständerte Reihen bilden Schneewechten und Schmutzränder – nach der Schneeschmelze Unterkante und Entwässerung kontrollieren.",
            "**Schneefang und Abrutschen:** Bei Pultdächern über Wegen, Parkplätzen oder Eingängen ist ein Schneefang Pflicht der Verkehrssicherung.",
            "**Nach extremen Wintern** Klemmen, Schienen und Module auf Verformung prüfen lassen – idealerweise mit Thermografie im Frühjahr.",
          ],
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Was Sie selbst kontrollieren können",
      tocLabel: "Checkliste Betreiber",
      bloecke: [
        {
          typ: "p",
          text: "**Viele Störungen erkennen Betreiber selbst – ohne das Dach zu betreten.** Diese Punkte eignen sich für eine monatliche Routine durch Haustechnik oder Facility Management:",
        },
        {
          typ: "checkliste",
          punkte: [
            "Monitoring-Portal: Tagesertrag plausibel? Alle Wechselrichter online? Offene Fehlermeldungen?",
            "Vergleich mit dem Vorjahresmonat und mit der Einstrahlung (z. B. Wetterstation oder Referenzanlage).",
            "Wechselrichterraum: Lüfter hörbar, Filter frei, keine ungewöhnliche Wärme oder Geruch?",
            "Vom Boden aus: gebrochene Module, lose Kabel, Vogelnester unter den Modulen?",
            "Nach Hagel, Sturm oder starkem Schneefall: Sichtkontrolle und Ertragsvergleich innerhalb weniger Tage.",
            "Prüfbefund und Anlagendokumentation aktuell? Nächste wiederkehrende Prüfung terminiert?",
            "Feuerwehrplan und Kennzeichnung nach OVE R 11-1 vorhanden und lesbar?",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Monitoring bei Bestandsanlagen nachrüsten",
          text: "Ältere Anlagen haben oft nur ein Wechselrichter-Display. Ein nachgerüsteter Datenlogger mit Alarmierung kostet wenig im Vergleich zu einem unentdeckten Wechselrichterausfall über mehrere Sommerwochen. Wie Fernüberwachung funktioniert, zeigt die Seite [Fernwartung](/technik/fernwartung).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Wartung beauftragen: Einzelauftrag oder Vertrag?",
      tocLabel: "Beauftragen",
      bloecke: [
        {
          typ: "p",
          text: "**Für kleine Anlagen genügt oft eine jährliche Einzelbeauftragung; ab mittleren Gewerbeanlagen ist ein Wartungsvertrag mit definierten Leistungen und Reaktionszeiten meist wirtschaftlicher.** Der Grund: Ertragsausfälle werden bei Anlagen ab etwa 100 kWp schnell teurer als die Wartung selbst, und die Verantwortung für Prüffristen liegt klar beim Dienstleister.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Bestand aufnehmen", "Anlagendokumentation, letzter Prüfbefund, Monitoring-Zugang, Garantieunterlagen und Versicherungsauflagen zusammentragen."],
            ["Risiken bewerten", "Standort (Stall, Straße, Schnee), Anlagengröße, Eigenverbrauchsanteil und Kritikalität für den Betrieb bestimmen."],
            ["Leistungsumfang festlegen", "Monitoring, Wartungsintervalle, Prüfungen, Thermografie, Reinigung bei Bedarf und Störungsbehebung definieren."],
            ["Nachweise sichern", "Prüfbefunde, Berichte und Fotos zentral ablegen – für Arbeitsinspektorat, Versicherung und Garantie."],
          ],
        },
        {
          typ: "p",
          text: "Ökovolt übernimmt [Wartung und Service](/service/wartung) sowie die [Drohnen-Thermografie](/service/drohneninspektion) für PV-Anlagen in ganz Österreich. Wie Wärmebilder aus der Luft ausgewertet werden, erklärt der Ratgeber [PV-Thermografie mit Drohne](/ratgeber/pv-thermografie-drohne).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Muss man eine Photovoltaikanlage reinigen?",
      a: "Nur bei deutlicher, festsitzender Verschmutzung. Geneigte Module werden vom Regen weitgehend sauber gehalten. Häufiger Reinigungsbedarf besteht bei flach aufgeständerten Anlagen und in der Nähe von Ställen, Lagern, Straßen oder Bahnlinien.",
    },
    {
      q: "Wie oft muss eine PV-Anlage im Betrieb geprüft werden?",
      a: "Nach § 9 ESV 2012 sind elektrische Anlagen in Arbeitsstätten in Abständen von längstens fünf Jahren wiederkehrend zu prüfen. Bei geringer Belastung wie in Büros sind bis zu zehn Jahre zulässig, in explosionsgefährdeten Bereichen drei Jahre, auf Baustellen ein Jahr. Versicherer können kürzere Intervalle verlangen.",
    },
    {
      q: "Womit reinigt man Solarmodule?",
      a: "Mit entmineralisiertem Wasser und weichen Bürsten, ohne Hochdruckreiniger, Chemie oder Scheuermittel. Leitungswasser hinterlässt Kalkflecken. Beachten Sie die Reinigungsvorgaben des Modulherstellers, sonst riskieren Sie die Garantie.",
    },
    {
      q: "Soll man Schnee von der PV-Anlage entfernen?",
      a: "In der Regel nicht. Der Ertragsgewinn im Winter ist gering, das Risiko für Module und Personen hoch. Wichtig ist, dass Dach und Unterkonstruktion für die Schneelast nach ÖNORM B 1991-1-3 bemessen sind.",
    },
    {
      q: "Woran erkenne ich, dass meine Anlage gewartet werden muss?",
      a: "Am Monitoring: sinkende Performance Ratio, ein Wechselrichter mit deutlich weniger Ertrag als die anderen oder wiederkehrende Fehlermeldungen. Vor Ort sind gebrochene Module, lose Kabel und Vogelnester typische Anzeichen.",
    },
    {
      q: "Was kostet die Wartung einer Gewerbe-PV-Anlage?",
      a: "Das hängt von Anlagengröße, Standort, Zugänglichkeit und Leistungsumfang ab – Monitoring, Prüfung, Thermografie und Reinigung werden unterschiedlich kombiniert. Seriöse Angebote weisen die Bausteine einzeln aus. Welche Bausteine sinnvoll sind, erklärt der Ratgeber [Wartungsvertrag](/ratgeber/photovoltaik-wartungsvertrag).",
    },
  ],

  passend: [
    { href: "/service/wartung", titel: "Wartung & Service", text: "Monitoring, Prüfung und Störungsbehebung für Gewerbeanlagen." },
    { href: "/service/reinigung", titel: "PV-Reinigung", text: "Reinigung mit osmotisiertem Wasser und Sicherungstechnik." },
    { href: "/ratgeber/e-check-photovoltaik", titel: "E-Check für PV-Anlagen", text: "Prüfpflichten, Messungen und Prüfbefund." },
    { href: "/ratgeber/photovoltaik-wartungsvertrag", titel: "Wartungsvertrag", text: "Leistungen, SLA und Kennzahlen." },
  ],

  quellen: [
    { titel: "RIS – Elektroschutzverordnung 2012 (ESV 2012), geltende Fassung", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007835", stand: "09/2026" },
    { titel: "JUSLINE – § 9 ESV 2012, Wiederkehrende Prüfungen", url: "https://www.jusline.at/gesetz/esv_2012/paragraf/9", stand: "09/2026" },
    { titel: "OVE – OVE E 8101:2025, Errichtungsbestimmungen für Niederspannungsanlagen", url: "https://www.ove.at/ove-standardization/normen-produkte/ove-e-8101/", stand: "09/2026" },
    { titel: "OVE – Richtlinien (u. a. R 11-1:2022 Feuerwehr, R 6-2 Blitzschutz PV)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
    { titel: "IEA-PVPS – Guidelines for Operation and Maintenance of PV Power Plants in Different Climates (T13-25)", url: "https://iea-pvps.org/key-topics/guidelines-for-operation-and-maintenance-of-photovoltaic-power-plants-in-different-climates/", stand: "2022" },
    { titel: "IEC – IEC TS 62446-3:2017, Outdoor infrared thermography of PV modules and plants", url: "https://webstore.iec.ch/en/publication/28628", stand: "09/2026" },
    { titel: "OeMAG – Marktpreise 2026 (monatlich)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wartung für Ihre Anlage?", text: "Monitoring, Prüfung und Reinigung aus einer Hand.", href: "/service/wartung", label: "Wartung anfragen" },
  cta: {
    title: "Ihre PV-Anlage in guten Händen – geprüft, gereinigt, überwacht.",
    text: "Ökovolt aus Ostermiething (OÖ) betreut Photovoltaikanlagen von Gewerbe, Landwirtschaft und Gemeinden in ganz Österreich.",
    primary: { label: "Wartung anfragen", href: "/service/wartung" },
    secondary: { label: "Reinigung anfragen", href: "/service/reinigung" },
  },
};

export default artikel;
