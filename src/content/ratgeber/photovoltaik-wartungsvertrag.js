// Ratgeber: Wartungsvertrag für Photovoltaikanlagen (O&M) – Österreich, Gewerbe/Gemeinden
// Quellen: IEC 61724-1:2021 (Monitoring, Performance Ratio), IEA-PVPS T13-25 (O&M-Leitfaden),
// ESV 2012 (Prüfpflichten), OVE E 8101:2025, IEC TS 62446-3, TOR Stromerzeugungsanlagen Typ A V1.4.
// Kostenspannen werden bewusst nicht beziffert (keine belastbare österreichische Marktquelle);
// das Rechenbeispiel zum Ertragsausfall ist als Annahme gekennzeichnet.

const KWP = 500; // Beispielanlage
const ERTRAG_KWP = 1050; // kWh/kWp und Jahr, Annahme
const WERT = 0.15; // €/kWh Mischwert Eigenverbrauch/Einspeisung, Annahme
const tagesErtragJuni = (KWP * ERTRAG_KWP * 0.13) / 30; // Juni ≈ 13 % des Jahresertrags (Annahme)
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const ausfall = (anteil, tage) => eur(tagesErtragJuni * anteil * tage * WERT);

const artikel = {
  slug: "photovoltaik-wartungsvertrag",
  title: "Wartungsvertrag für PV-Anlagen: Leistungen, SLA und Kennzahlen",
  seoTitle: "PV-Wartungsvertrag: Leistungen, SLA & KPIs | Ökovolt",
  kurzTitel: "PV-Wartungsvertrag",
  description:
    "PV-Wartungsvertrag für Gewerbe und Gemeinden: Leistungsbausteine, SLA-Begriffe, Verfügbarkeit, Performance Ratio, Vertragsmodelle und Checkliste für Österreich.",
  excerpt:
    "Was ein Wartungsvertrag (O&M) für eine Gewerbe-PV-Anlage enthalten sollte, wie Reaktionszeit, Verfügbarkeit und Performance Ratio definiert werden und woran Sie ein belastbares Angebot erkennen.",
  hauptKeyword: "photovoltaik wartungsvertrag",
  keywords: [
    "Photovoltaik Wartungsvertrag",
    "PV Wartungsvertrag Gewerbe",
    "O&M Vertrag Photovoltaik",
    "PV-Anlage Wartung Kosten Österreich",
    "Verfügbarkeitsgarantie PV",
    "Performance Ratio Wartung",
    "Service Level Agreement Photovoltaik",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg",
  bildAlt: "Techniker arbeitet an der Unterkonstruktion einer Photovoltaikanlage",
  badge: { wert: "8 Bausteine", text: "vom Monitoring bis zum Reporting – was ein O&M-Vertrag regeln sollte" },

  kurzFazit: [
    "**Ein PV-Wartungsvertrag (O&M-Vertrag) regelt, wer die Anlage überwacht, wie schnell Störungen behoben werden und welche Prüfungen in welchem Intervall stattfinden.** Für Betriebe ab etwa 100 kWp ist er meist die wirtschaftlichere Lösung als Einzelaufträge.",
    `**Ausfälle kosten schnell mehr als Wartung:** Fällt bei einer ${KWP}-kWp-Anlage im Juni ein Viertel der Leistung zwei Wochen lang aus, gehen in unserem Beispiel rund ${ausfall(0.25, 14)} verloren – bei vollständigem Ausfall rund ${ausfall(1, 14)}.`,
    "**Vergleichbar werden Angebote nur mit klaren Definitionen:** Reaktionszeit, Wiederherstellungszeit, technische oder energiebasierte Verfügbarkeit, Performance Ratio nach IEC 61724-1 und Ausschlüsse gehören schriftlich in den Vertrag.",
    "**In Arbeitsstätten sind wiederkehrende Prüfungen nach ESV 2012 ohnehin Pflicht** – ein guter Vertrag bündelt Prüfbefund, Thermografie und Dokumentation, sodass Arbeitsinspektorat, Versicherung und Hersteller die Nachweise bekommen.",
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist ein Wartungsvertrag für eine PV-Anlage?",
      tocLabel: "Definition",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Wartungsvertrag – in der Branche O&M-Vertrag (Operation & Maintenance) genannt – ist eine Dienstleistungsvereinbarung, in der ein Fachbetrieb Überwachung, Instandhaltung und Prüfung einer PV-Anlage über mehrere Jahre übernimmt.** Er legt fest, welche Leistungen pauschal enthalten sind, was gesondert abgerechnet wird und welche Fristen gelten. Der Begriff [O&M](/wissen/lexikon#o-und-m) umfasst dabei zwei Seiten: den technischen Betrieb (Monitoring, Störungsmanagement, Kommunikation mit dem Netzbetreiber) und die Instandhaltung (vorbeugend, korrigierend, zustandsorientiert).",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Vorbeugend", text: "Geplante Arbeiten nach Kalender: Sichtprüfung, Wechselrichter-Service, Messungen, Prüfbefund, Thermografie." },
            { titel: "Korrigierend", text: "Störungsbehebung nach Alarm: Fehlersuche, Tausch von Sicherungen, Steckern, Modulen oder Wechselrichtern." },
            { titel: "Zustandsorientiert", text: "Eingriffe auf Basis von Daten: sinkende Performance Ratio, Temperaturtrends, Isolationswarnungen." },
          ],
        },
        {
          typ: "p",
          text: "Die Internationale Energieagentur (IEA-PVPS Task 13) beschreibt in ihrem O&M-Leitfaden, dass Umfang und Intervalle je nach Klima und Standort angepasst werden sollten – in Österreich betrifft das vor allem Schnee, Hagel, Temperaturwechsel und landwirtschaftliche Emissionen. Die Grundlagen der laufenden Pflege finden Sie im Ratgeber [Reinigung und Wartung](/ratgeber/photovoltaik-reinigung-wartung).",
        },
      ],
    },
    {
      id: "bausteine",
      titel: "Welche Leistungen gehören in einen PV-Wartungsvertrag?",
      tocLabel: "Leistungsbausteine",
      bloecke: [
        {
          typ: "p",
          text: "**Ein vollständiger Wartungsvertrag besteht aus acht Bausteinen: Monitoring, Störungsmanagement, vorbeugende Wartung, Prüfungen, Thermografie, Reinigung, Ersatzteil- und Garantiemanagement sowie Reporting.** Nicht jede Anlage braucht alle in gleicher Tiefe – aber jeder Baustein sollte bewusst geregelt sein, auch wenn er ausgeschlossen wird.",
        },
        {
          typ: "tabelle",
          caption: "Leistungsbausteine eines PV-Wartungsvertrags (O&M) und typische Regelung",
          kopf: ["Baustein", "Inhalt", "Typisch enthalten?"],
          zeilen: [
            ["1. Monitoring / Fernüberwachung", "24/7-Datenerfassung, Alarmierung, Soll-Ist-Vergleich je Wechselrichter oder String", "ja (Kern jedes Vertrags)"],
            ["2. Störungsmanagement", "Alarmbewertung, Ferndiagnose, Einsatzplanung, Behebung vor Ort", "Diagnose ja, Material oft gesondert"],
            ["3. Vorbeugende Wartung", "Sichtprüfung, Wechselrichter-Service, Klemmen, Kabelführung, Schutzorgane", "ja, Intervall festlegen"],
            ["4. Prüfungen", "Wiederkehrende Prüfung nach ESV 2012 mit Messungen und Prüfbefund", "Option oder enthalten"],
            ["5. Thermografie", "Drohnen- oder Handthermografie nach IEC TS 62446-3", "meist Option"],
            ["6. Reinigung", "Modulreinigung bei Bedarf, Vegetationspflege bei Freiflächen", "meist nach Aufwand"],
            ["7. Ersatzteil- & Garantiemanagement", "Lagerhaltung kritischer Teile, Abwicklung von Herstellergarantien", "unterschiedlich"],
            ["8. Reporting & Netzbetreiber", "Monats-/Jahresbericht, KPI, Kommunikation mit Netzbetreiber, Parkregler-Einstellungen", "ja, Umfang prüfen"],
          ],
          minBreite: 700,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Größere Anlagen: Netzbetreiber-Anforderungen mitdenken",
          text: "Ab bestimmten Leistungen verlangt der Netzbetreiber Blindleistungsregelung, Wirkleistungsbegrenzung und Fernsteuerbarkeit nach den TOR Stromerzeugungsanlagen. Wer den [Parkregler](/technik/parkregler) betreut, Sollwerte dokumentiert und Änderungen mit dem Netzbetreiber abstimmt, sollte im Vertrag klar geregelt sein – mehr im Ratgeber [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler).",
        },
      ],
    },
    {
      id: "sla",
      titel: "SLA-Begriffe: Reaktionszeit, Wiederherstellung, Verfügbarkeit",
      tocLabel: "SLA-Begriffe",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Service Level Agreement (SLA) übersetzt „schnelle Hilfe“ in messbare Fristen und Kennzahlen.** Entscheidend ist, ab wann eine Frist läuft, wie sie gemessen wird und was bei Nichteinhaltung passiert. Unklare Formulierungen wie „zeitnah“ oder „schnellstmöglich“ sind im Streitfall wertlos.",
        },
        {
          typ: "tabelle",
          caption: "Die wichtigsten SLA-Begriffe im PV-Wartungsvertrag",
          kopf: ["Begriff", "Bedeutung", "Worauf achten"],
          zeilen: [
            ["Reaktionszeit", "Zeit von der Alarmmeldung bis zur qualifizierten Rückmeldung bzw. Ferndiagnose", "Gilt sie 24/7 oder nur werktags? Ab Alarm oder ab Kundenmeldung?"],
            ["Interventionszeit", "Zeit bis zum Eintreffen vor Ort", "Nach Störungsklassen staffeln (Totalausfall vs. Teilausfall)"],
            ["Wiederherstellungszeit (MTTR)", "Zeit bis die Anlage wieder voll produziert", "Ausnahmen für Lieferzeiten von Wechselrichtern und Modulen"],
            ["Technische Verfügbarkeit", "Anteil der Zeit, in der die Anlage betriebsbereit war (bei ausreichender Einstrahlung)", "Definition von Ausschlusszeiten (Netzabschaltung, höhere Gewalt)"],
            ["Energiebasierte Verfügbarkeit", "Anteil der tatsächlich erzeugten an der möglichen Energie", "Gewichtet Ausfälle im Sommer stärker – aussagekräftiger für den Ertrag"],
            ["Eskalation", "Wer wird wann informiert, wenn Fristen nicht halten?", "Namentliche Ansprechpartner, Eskalationsstufen"],
            ["Bonus / Pönale", "Finanzielle Folgen bei Über- oder Unterschreiten der Zielwerte", "Deckelung, Berechnungsbasis, Nachweis"],
          ],
          minBreite: 720,
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Ausschlüsse genau lesen",
          text: "Übliche Ausschlüsse sind Netzabschaltungen durch den Netzbetreiber, Schnee- und Eisbedeckung, Brand, Hagel, Vandalismus, Lieferengpässe und Wartungsfenster. Sie sind legitim – müssen aber abschließend aufgezählt sein. Sonst lässt sich jede Verfügbarkeitsquote „schönrechnen“.",
        },
      ],
    },
    {
      id: "kpi",
      titel: "Welche Kennzahlen (KPIs) sollte der Bericht enthalten?",
      tocLabel: "O&M-Kennzahlen",
      bloecke: [
        {
          typ: "p",
          text: "**Die zentrale Kennzahl ist die Performance Ratio (PR) nach IEC 61724-1: das Verhältnis des tatsächlichen Ertrags zum theoretisch möglichen Ertrag bei der gemessenen Einstrahlung.** Sie macht Anlagen, Monate und Jahre vergleichbar, weil sie das Wetter herausrechnet. Voraussetzung ist eine verlässliche Einstrahlungsmessung – bei Anlagen ab einigen hundert kWp idealerweise mit einem Referenzsensor in Modulebene.",
        },
        {
          typ: "tabelle",
          caption: "O&M-Kennzahlen im Monats- und Jahresbericht",
          kopf: ["Kennzahl", "Aussage", "Hinweis"],
          zeilen: [
            ["Spezifischer Ertrag (kWh/kWp)", "Ertrag bezogen auf die installierte Leistung", "wetterabhängig, nur mit Einstrahlung vergleichbar"],
            ["Performance Ratio (PR)", "Qualität der Anlage unabhängig vom Wetter", "Temperaturkorrektur und Messpunkt festlegen"],
            ["Technische / energiebasierte Verfügbarkeit", "Wie viel Zeit bzw. Energie ging durch Störungen verloren?", "Ausschlüsse transparent ausweisen"],
            ["Soll-Ist-Abweichung", "Abweichung zur Ertragsprognose", "Prognosebasis offenlegen (z. B. PVGIS, Gutachten)"],
            ["MTTR / Anzahl Störungen", "Wie schnell und wie oft wird eingegriffen?", "nach Störungsklassen trennen"],
            ["Degradation", "Langfristiger Leistungsrückgang der Module", "über mehrere Jahre bewerten, nicht aus einem Jahr"],
          ],
          minBreite: 680,
        },
        {
          typ: "p",
          text: "Ein guter Bericht erklärt Abweichungen, statt nur Zahlen zu liefern: Welcher String war betroffen, was war die Ursache, was wurde getan? Die Kennzahlen [Performance Ratio](/wissen/lexikon#performance-ratio) und [Degradation](/wissen/lexikon#degradation) sind im Lexikon erklärt. Ökovolt setzt für die Datenerfassung eigene [SCADA-Systeme](/technik/scada) und [Fernwartung](/technik/fernwartung) ein.",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Lohnt sich ein Wartungsvertrag? Beispielrechnung Ertragsausfall",
      tocLabel: "Lohnt es sich?",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Wartungsvertrag lohnt sich, wenn die vermiedenen Ertragsausfälle und Folgeschäden höher sind als die Vertragskosten – bei Gewerbeanlagen ist das häufig der Fall, weil unentdeckte Störungen im Sommer schnell vierstellige Beträge kosten.** Die folgende Rechnung zeigt die Größenordnung für eine Beispielanlage.",
        },
        {
          typ: "tabelle",
          caption: `Wert entgangener Energie bei einer ${KWP}-kWp-Anlage im Juni (Beispielrechnung)`,
          kopf: ["Störung", "3 Tage", "14 Tage", "30 Tage"],
          zeilen: [
            ["ein Wechselrichter von vier (25 %)", ausfall(0.25, 3), ausfall(0.25, 14), ausfall(0.25, 30)],
            ["halbe Anlage (50 %)", ausfall(0.5, 3), ausfall(0.5, 14), ausfall(0.5, 30)],
            ["Totalausfall (100 %)", ausfall(1, 3), ausfall(1, 14), ausfall(1, 30)],
          ],
          hervorheben: 2,
          minBreite: 560,
          fussnote: `Annahmen: ${ERTRAG_KWP.toLocaleString("de-DE")} kWh/kWp und Jahr, Juni mit rund 13 % des Jahresertrags, Wert der Kilowattstunde 15 ct als Mischwert aus Eigenverbrauch und Überschusseinspeisung. Ohne Folgeschäden, Leistungspreiseffekte und Förderauflagen.`,
        },
        {
          typ: "p",
          text: "Die Zahlen erklären, warum die Reaktionszeit wichtiger ist als der Grundpreis: Ohne Monitoring fällt ein Teilausfall oft erst bei der Jahresabrechnung auf. Bei hohem Eigenverbrauch steigt der Wert jeder Kilowattstunde zusätzlich – dann zählt auch der Einfluss auf die Lastspitze, wie im Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis) beschrieben.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Zu den Kosten",
          text: "Für Österreich gibt es keine veröffentlichte, belastbare Marktstatistik zu O&M-Preisen. Seriöse Angebote kalkulieren nach Anlagengröße, Anzahl der Wechselrichter, Zugänglichkeit (Dach, Freifläche, Höhe), Anfahrt, Monitoringtechnik und gewünschten Reaktionszeiten. Lassen Sie sich die acht Bausteine einzeln bepreisen – so werden Angebote vergleichbar.",
        },
      ],
    },
    {
      id: "modelle",
      titel: "Vertragsmodelle: Basis, Full-Service, Verfügbarkeitsgarantie",
      tocLabel: "Vertragsmodelle",
      bloecke: [
        {
          typ: "p",
          text: "**In der Praxis haben sich drei Vertragsmodelle etabliert, die sich darin unterscheiden, wer das Risiko für Material und Ertragsausfall trägt.** Welches passt, hängt von Anlagengröße, Eigenverbrauch und Finanzierung ab – finanzierende Banken und Leasinggeber verlangen häufig einen Vertrag mit definierten Kennzahlen.",
        },
        {
          typ: "tabelle",
          caption: "Vertragsmodelle im Vergleich",
          kopf: ["Modell", "Leistung", "Risiko Material", "Geeignet für"],
          zeilen: [
            ["Basis", "Monitoring, jährliche Wartung, Störungsbehebung nach Aufwand", "Betreiber", "kleinere Gewerbeanlagen, Gemeindegebäude"],
            ["Full-Service", "alle Bausteine inkl. Arbeitszeit, Material teilweise pauschaliert", "geteilt", "Gewerbe ab ca. 100 kWp, Landwirtschaft"],
            ["Verfügbarkeitsgarantie", "Full-Service plus garantierte Verfügbarkeit mit Pönale", "überwiegend Dienstleister", "große Dach- und Freiflächenanlagen, fremdfinanzierte Projekte"],
          ],
          minBreite: 640,
        },
        {
          typ: "p",
          text: "Wer seine Anlage über Leasing oder Contracting finanziert, sollte Wartung und Versicherung gemeinsam mit dem Finanzierungsvertrag planen – Hintergründe im Ratgeber [Photovoltaik-Leasing](/ratgeber/photovoltaik-leasing) und unter [Finanzierung](/service/finanzierung).",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: So prüfen Sie ein Wartungsangebot",
      tocLabel: "Checkliste Angebot",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Sind alle acht Leistungsbausteine genannt – und ist bei jedem klar, ob er enthalten, optional oder ausgeschlossen ist?",
            "Sind Reaktions-, Interventions- und Wiederherstellungszeiten nach Störungsklassen definiert, inklusive Wochenende und Feiertagen?",
            "Wie ist die Verfügbarkeit definiert (technisch oder energiebasiert) und welche Ausschlüsse gelten?",
            "Wie wird die Performance Ratio berechnet (Norm, Einstrahlungssensor, Temperaturkorrektur)?",
            "Enthält der Vertrag die wiederkehrende Prüfung nach ESV 2012 mit Prüfbefund – und wer überwacht die Fristen?",
            "Wie werden Herstellergarantien abgewickelt, wer lagert Ersatzteile, wer trägt Transport- und Montagekosten?",
            "Wer hat Zugriff auf Monitoringdaten, und bleiben diese bei Vertragsende beim Betreiber?",
            "Wie sind IT-Sicherheit und Fernzugriff geregelt (Zugänge, Updates, Protokollierung)?",
            "Laufzeit, Kündigung, Preisanpassung (Index) und Haftungsgrenzen – passen sie zu Finanzierung und Versicherung?",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Bestandsaufnahme vor Vertragsbeginn",
          text: "Vereinbaren Sie zum Start eine Übernahmeprüfung mit Messungen und [Thermografie](/wissen/lexikon#thermografie). Sie dokumentiert den Ausgangszustand, trennt Altmängel von neuen Schäden und ist die Basis für Garantie- und Versicherungsansprüche. Mehr dazu im Ratgeber [PV-Thermografie mit Drohne](/ratgeber/pv-thermografie-drohne).",
        },
      ],
    },
    {
      id: "betreiberpflichten",
      titel: "Was bleibt beim Betreiber – auch mit Wartungsvertrag?",
      tocLabel: "Betreiberpflichten",
      bloecke: [
        {
          typ: "p",
          text: "**Die rechtliche Verantwortung als Anlagenbetreiber und Arbeitgeber lässt sich nicht vollständig auslagern – delegieren lässt sich die Ausführung, nicht die Organisationspflicht.** Der Wartungsvertrag muss deshalb klar regeln, wer welche Aufgabe übernimmt und wie der Betreiber davon erfährt.",
        },
        {
          typ: "liste",
          punkte: [
            "**Arbeitnehmerschutz:** Die Pflicht, elektrische Anlagen in Arbeitsstätten nach ESV 2012 prüfen zu lassen und die Prüfbefunde aufzubewahren, bleibt beim Arbeitgeber. Der Dienstleister erledigt die Prüfung, der Betreiber muss sie veranlassen und die Mängelbehebung beauftragen.",
            "**Zutritt und Sicherheit:** Der Betreiber stellt Zugänge, Anschlagpunkte, Schlüssel und Einweisungen für Fremdfirmen bereit und koordiniert die Arbeiten mit laufendem Betrieb.",
            "**Meldungen an Dritte:** Änderungen an der Anlage (Leistung, Wechselrichtertausch, Speicher) sind mit Netzbetreiber, Versicherung und gegebenenfalls Förderstelle abzustimmen.",
            "**Dokumentation:** Anlagendokumentation, Feuerwehrplan und Prüfbefunde müssen aktuell und im Ernstfall auffindbar sein – idealerweise digital und in Papierform beim Hauptverteiler.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Gemeinden: Vergabe beachten",
          text: "Für Gemeinden und ausgegliederte Gesellschaften sind Wartungsleistungen Dienstleistungsaufträge im Sinne des Bundesvergabegesetzes. Leistungsbeschreibung, Laufzeit und Schwellenwerte sollten vor der Ausschreibung geklärt werden – mehr im Ratgeber [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde).",
        },
      ],
    },
    {
      id: "oekovolt",
      titel: "Wartung durch Ökovolt",
      tocLabel: "Wartung durch Ökovolt",
      bloecke: [
        {
          typ: "p",
          text: "**Ökovolt betreut Photovoltaikanlagen von Gewerbe, Landwirtschaft, Hotellerie und Gemeinden in ganz Österreich – mit eigenem Parkregler, eigenen Fernwartungs- und SCADA-Systemen.** Den Leistungsumfang stimmen wir auf Ihre Anlage ab; ein Angebot erhalten Sie über die Seite [Wartung & Service](/service/wartung). Ergänzend bieten wir den [E-Check mit Prüfbefund](/service/e-check), die Drohnen-Thermografie und die Reinigung an.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was kostet ein Wartungsvertrag für eine PV-Anlage?",
      a: "Der Preis hängt von Anlagengröße, Zugänglichkeit, Anzahl der Wechselrichter, Monitoringtechnik und den vereinbarten Reaktionszeiten ab. Eine belastbare öffentliche Preisstatistik für Österreich gibt es nicht. Vergleichen Sie Angebote, indem Sie die Leistungsbausteine einzeln bepreisen lassen.",
    },
    {
      q: "Ab welcher Anlagengröße lohnt sich ein Wartungsvertrag?",
      a: "Als Faustregel ab etwa 100 kWp, weil Ertragsausfälle dann schnell teurer werden als die Wartung. Bei Anlagen mit hohem Eigenverbrauch, auf kritischen Gebäuden oder mit Finanzierung kann er auch darunter sinnvoll sein.",
    },
    {
      q: "Was ist der Unterschied zwischen technischer und energiebasierter Verfügbarkeit?",
      a: "Die technische Verfügbarkeit misst die Zeit, in der die Anlage betriebsbereit war. Die energiebasierte Verfügbarkeit misst, wie viel der möglichen Energie tatsächlich erzeugt wurde. Letztere gewichtet einen Ausfall zu Mittag im Juni stärker als einen in der Nacht und ist daher aussagekräftiger.",
    },
    {
      q: "Welche Performance Ratio ist gut?",
      a: "Das hängt von Modultechnik, Ausrichtung, Temperaturkorrektur und Messmethode ab. Wichtiger als ein absoluter Zielwert ist die Entwicklung über die Zeit: Eine sinkende PR ohne Wettergrund deutet auf Störungen, Verschmutzung oder Degradation hin.",
    },
    {
      q: "Ist die wiederkehrende Prüfung im Wartungsvertrag enthalten?",
      a: "Nicht automatisch. Vereinbaren Sie ausdrücklich, dass die Prüfung nach ESV 2012 inklusive Prüfbefund enthalten ist und der Dienstleister die Fristen überwacht. Details im Ratgeber [E-Check für PV-Anlagen](/ratgeber/e-check-photovoltaik).",
    },
    {
      q: "Wie lange sollte ein PV-Wartungsvertrag laufen?",
      a: "Üblich sind mehrjährige Laufzeiten mit Verlängerungsoption. Wichtig sind eine Preisanpassungsklausel, faire Kündigungsrechte und die Regelung, dass Monitoringdaten und Dokumentation bei Vertragsende beim Betreiber bleiben.",
    },
  ],

  passend: [
    { href: "/service/wartung", titel: "Wartung & Service", text: "Wartungsverträge für Gewerbe, Landwirtschaft und Gemeinden." },
    { href: "/technik/fernwartung", titel: "Fernwartung", text: "Überwachung und Alarmierung rund um die Uhr." },
    { href: "/ratgeber/photovoltaik-reinigung-wartung", titel: "Reinigung & Wartung", text: "Was Betreiber selbst kontrollieren können." },
    { href: "/ratgeber/e-check-photovoltaik", titel: "E-Check für PV-Anlagen", text: "Prüfpflichten und Prüfbefund." },
  ],

  quellen: [
    { titel: "IEC – IEC 61724-1:2021, Photovoltaic system performance – Monitoring", url: "https://webstore.iec.ch/en/publication/65561", stand: "09/2026" },
    { titel: "IEA-PVPS Task 13 – Guidelines for Operation and Maintenance of PV Power Plants in Different Climates (T13-25)", url: "https://iea-pvps.org/key-topics/guidelines-for-operation-and-maintenance-of-photovoltaic-power-plants-in-different-climates/", stand: "2022" },
    { titel: "RIS – Elektroschutzverordnung 2012 (ESV 2012)", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007835", stand: "09/2026" },
    { titel: "OVE – OVE E 8101:2025, Errichtungsbestimmungen für Niederspannungsanlagen", url: "https://www.ove.at/ove-standardization/normen-produkte/ove-e-8101/", stand: "09/2026" },
    { titel: "IEC – IEC TS 62446-3:2017, Outdoor infrared thermography of PV modules and plants", url: "https://webstore.iec.ch/en/publication/28628", stand: "09/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen und Verteilernetzanschluss", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wartungsvertrag gesucht?", text: "Leistungsumfang passend zu Ihrer Anlage.", href: "/service/wartung", label: "Angebot anfordern" },
  cta: {
    title: "Ein Wartungsvertrag, der Ausfälle kurz hält.",
    text: "Monitoring, Störungsbehebung, Prüfung und Thermografie – Ökovolt aus Ostermiething (OÖ) betreut PV-Anlagen in ganz Österreich.",
    primary: { label: "Wartung anfragen", href: "/service/wartung" },
    secondary: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
};

export default artikel;
