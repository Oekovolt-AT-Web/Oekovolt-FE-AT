// Ratgeber: Smart Meter in Österreich – Pflicht, Opt-out, Viertelstundenwerte, Gewerbe und PV
// Recherchestand 28.09.2026: E-Control Smart-Meter-Monitoringbericht 2025 (Berichtsjahr 2024), E-Control-Seiten
// „Rechtliche Grundlagen“ (IMA-V 2026, in Kraft 15.07.2026) und „Smart Meter 2.0“, VfGH V 178/2021, OGH 9 Ob 82/21f,
// OGH 6 Ob 36/22w, EuGH C-468/24 (Vorlage), Koordinationsstelle Energiegemeinschaften (Opt-in), SNE-G-V-Entwurf 07/2026.

const artikel = {
  slug: "smart-meter-pflicht",
  title: "Smart Meter in Österreich: Pflicht, Opt-out und Viertelstundenwerte",
  seoTitle: "Smart Meter Pflicht Österreich 2026 | Ökovolt",
  kurzTitel: "Smart Meter Pflicht",
  description:
    "Smart Meter in Österreich: 96,9 % Ausrollung, Opt-out, Viertelstundenwerte, neue IMA-V 2026 und was Betriebe, PV-Betreiber und Energiegemeinschaften brauchen.",
  excerpt:
    "Fast jeder Zählpunkt in Österreich hat inzwischen einen Smart Meter. Was die Pflicht bedeutet, was Opt-out und Opt-in ändern, wann Viertelstundenwerte nötig sind und was die zweite Smart-Meter-Generation ab 2028 bringt.",
  hauptKeyword: "smart meter pflicht österreich",
  keywords: [
    "Smart Meter Pflicht Österreich",
    "Smart Meter Opt-out",
    "Viertelstundenwerte Smart Meter",
    "IME-VO",
    "Smart Meter Photovoltaik",
    "Lastprofilzähler Gewerbe",
    "Smart Meter Energiegemeinschaft Opt-in",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/smart-meter-pflicht.jpg",
  bildAlt: "Digitaler Stromzähler (Smart Meter) mit Display",
  badge: { wert: "96,9 %", text: "Smart-Meter-Ausrollung Ende 2024 (E-Control)" },

  kurzFazit: [
    "**In Österreich müssen die Netzbetreiber nach der Intelligente-Messgeräte-Einführungsverordnung (IME-VO) mindestens 95 % der Zählpunkte mit Smart Metern ausstatten – Ende 2024 waren es laut E-Control 96,9 %.** Eine Pflicht für Kunden, selbst etwas zu tun, gibt es nicht; ablehnen können sie nur die intelligenten Funktionen (Opt-out).",
    "Im **Opt-out** arbeitet das Gerät wie ein digitaler Standardzähler; der Einbau selbst ist laut VfGH und OGH trotzdem zulässig.",
    "**Viertelstundenwerte** braucht, wer an einer **Energiegemeinschaft** teilnimmt (Opt-in verpflichtend), einen dynamischen Tarif nutzt oder seine Anlage nach **Lastgang** planen will. Betriebe über **100.000 kWh** oder **50 kW** werden ohnehin mit Lastprofilzähler gemessen.",
    "Die neue **IMA-V 2026** gilt seit 15. Juli 2026 und legt die Anforderungen an die zweite Smart-Meter-Generation fest; der Tausch beginnt laut E-Control frühestens 2028, bis Ende 2039 müssen alle Geräte ersetzt sein.",
  ],

  abschnitte: [
    {
      id: "pflicht",
      titel: "Gibt es in Österreich eine Smart-Meter-Pflicht?",
      tocLabel: "Pflicht",
      bloecke: [
        {
          typ: "p",
          text: "**Die Smart-Meter-Pflicht richtet sich an die Netzbetreiber, nicht an die Kunden: Sie müssen die Zählpunkte in ihrem Netz mit intelligenten Messgeräten ausstatten.** Grundlage waren das ElWOG 2010 und die IME-VO aus 2012, die mehrfach angepasst wurde und zuletzt 95 % bis Ende 2024 vorsah. Mit dem [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz) wurde der Rechtsrahmen ins neue Gesetz übernommen; die technischen Mindestanforderungen regelt seit 15. Juli 2026 die Intelligente-Messgeräte-Anforderungsverordnung (IMA-V 2026).",
        },
        {
          typ: "kennzahl",
          wert: "6,74 Mio.",
          titel: "Zählpunkte, die von der IME-VO erfasst sind",
          text: "Davon waren Ende 2024 rund 96,9 % mit Smart Metern ausgestattet (Vorjahr 85,2 %); 90 von 117 Verteilernetzbetreibern hatten das 95-%-Ziel erreicht. Quelle: E-Control, Monitoringbericht 2025.",
        },
        {
          typ: "p",
          text: "Kunden, die noch keinen Smart Meter haben, können den Einbau verlangen: Laut IME-VO-Novelle 2022 muss der Netzbetreiber innerhalb von höchstens zwei Monaten installieren. Für Teilnehmer an Energiegemeinschaften gilt dasselbe – fehlende Geräte werden laut Koordinationsstelle für Energiegemeinschaften kostenlos binnen zwei Monaten eingebaut.",
        },
      ],
    },
    {
      id: "optout",
      titel: "Opt-out und Opt-in: Was Kunden wählen können",
      tocLabel: "Opt-out & Opt-in",
      bloecke: [
        {
          typ: "p",
          text: "**Mit dem Opt-out lehnen Kunden die intelligenten Funktionen ab, nicht das Gerät.** In der Opt-out-Konfiguration nach § 1 Abs. 6 IME-VO arbeitet das Messgerät wie ein digitaler Standardzähler; Verbrauchsdaten werden nur im für die Abrechnung nötigen Umfang erfasst. Umgekehrt müssen Kunden, die Viertelstundenwerte nutzen wollen, aktiv zustimmen (Opt-in).",
        },
        {
          typ: "tabelle",
          caption: "Konfigurationen von Smart Metern in Österreich (vereinfacht), Stand September 2026",
          kopf: ["Konfiguration", "Daten an den Netzbetreiber", "Typische Nutzung"],
          zeilen: [
            ["Standard", "Tageswerte; Viertelstundenwerte werden im Gerät gespeichert, aber nicht ohne Zustimmung übertragen", "Haushalte und Kleinbetriebe mit Standardtarif"],
            ["Opt-in (Viertelstundenwerte)", "Viertelstundenwerte, täglich übertragen", "Energiegemeinschaft, dynamischer Tarif, Lastganganalyse, Energiemanagement"],
            ["Opt-out", "nur abrechnungsrelevante Werte, Funktionen wie Abschaltung deaktiviert", "Kunden mit Datenschutzbedenken"],
            ["Lastprofilzähler (RLM)", "Viertelstundenwerte als Abrechnungsgrundlage", "über 100.000 kWh Jahresverbrauch oder über 50 kW Anschlussleistung"],
          ],
          minBreite: 680,
          fussnote: "Vereinfachte Darstellung; Details regeln ElWG, IMA-V 2026 und die Datenverordnungen der E-Control. Die IMA-V 2026 legt den Funktionsumfang im Opt-out für Tarifierung und Netzmonitoring ausdrücklich fest.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Höchstgerichte: Einbau auch bei Opt-out zulässig",
          text: "Der Verfassungsgerichtshof hat 2021 entschieden, dass die Opt-out-Konfiguration nach § 1 Abs. 6 IME-VO den Datenschutz verhältnismäßig wahrt (VfGH 30. 9. 2021, V 178/2021). Der OGH hat sich angeschlossen (27. 1. 2022, 9 Ob 82/21f) und die Datenverarbeitung im Opt-out als zulässig beurteilt (6. 4. 2022, 6 Ob 36/22w). Netzbetreiber dürfen daher auch bei Opt-out ein elektronisches, fernausgelesenes Gerät einbauen. Ein Vorabentscheidungsersuchen an den EuGH (C-468/24) wurde 2024 eingebracht. Quelle: E-Control, Monitoringbericht 2025.",
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Smart Meter und Lastprofilzähler im Betrieb",
      tocLabel: "Betriebe",
      bloecke: [
        {
          typ: "p",
          text: "**Betriebe mit mehr als 100.000 kWh Jahresverbrauch oder über 50 kW Anschlussleistung werden in Österreich nicht über standardisierte Lastprofile, sondern mit Lastprofilzähler abgerechnet.** Die Landes-Elektrizitätsgesetze sehen standardisierte Lastprofile nur unterhalb dieser Grenzen vor. Für solche Betriebe liegen Viertelstundenwerte ohnehin vor – im Kundenportal des Netzbetreibers als Lastgang abrufbar. Laut E-Control waren Ende 2024 rund 75.000 Lastprofilzähler und rund 28.000 Viertelstunden-Maximumzähler im Einsatz.",
        },
        {
          typ: "p",
          text: "Für kleinere Betriebe ist der Smart Meter die Datenquelle: Mit Opt-in stehen Viertelstundenwerte zur Verfügung, die für die Planung einer PV-Anlage, eines Speichers oder für [Peak Shaving](/ratgeber/peak-shaving-leistungspreis) unverzichtbar sind. Ab 2027 gewinnt das an Bedeutung, weil die E-Control im Entwurf der Systemnutzungsentgelte-Grundsatzverordnung einen Leistungspreis auch auf Netzebene 7 vorsieht – bemessen am höchsten Viertelstundenwert je Kalendermonat, mit niedrigerem Tarif bis 10 kW.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Lastgang vor der PV-Planung sichern",
          text: "Laden Sie 12 Monate Viertelstundenwerte aus dem Portal Ihres Netzbetreibers herunter, bevor Sie Angebote einholen. Ohne Lastgang wird die Anlagengröße geschätzt – mit Lastgang wird sie berechnet. Siehe [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen) und [Ablauf eines PV-Projekts](/ratgeber/photovoltaik-ablauf).",
        },
      ],
    },
    {
      id: "pv",
      titel: "Was brauchen PV-Betreiber und Energiegemeinschaften?",
      tocLabel: "PV & Energiegemeinschaften",
      bloecke: [
        {
          typ: "p",
          text: "**Für eine PV-Anlage mit Überschusseinspeisung misst in der Regel der vorhandene Smart Meter Bezug und Einspeisung; der Netzbetreiber parametriert ihn bei der Inbetriebnahme auf Zweirichtung.** Ein zusätzlicher Zähler ist nur bei Volleinspeisung, mehreren Anlagen oder größeren Leistungen nötig. Den Ablauf beschreibt der Ratgeber [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
        },
        {
          typ: "p",
          text: "Für die Teilnahme an einer Energiegemeinschaft ist die Einstellung „Opt-in“ verpflichtend, weil die Aufteilung der Energie je Viertelstunde erfolgt. Die Freigabe der Viertelstundenwerte (CCM-Prozess) muss laut Koordinationsstelle jeder Teilnehmer selbst im Portal des Netzbetreibers erteilen – ein Organisator kann das nicht übernehmen. Die Netzbetreiber stellen täglich die Messwerte des Vortages über den energiewirtschaftlichen Datenaustausch ([EDA](/wissen/lexikon#eda)) bereit. Mehr im Ratgeber [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden).",
        },
        {
          typ: "liste",
          punkte: [
            "**Messwerte L1, L2, L3:** L1 sind gemessene Rohwerte, L2 validierte oder korrigierte Werte, L3 vorläufige Ersatzwerte.",
            "**Frist:** Spätestens am 16. Kalendertag des Folgemonats erfolgt die endgültige Energiezuordnung; danach fehlende Werte werden mit null berücksichtigt.",
            "**Steuerbarkeit:** Neue Erzeugungsanlagen ab 3,68 kW müssen laut ElWG steuerbar sein – das erfolgt über eine Steuereinrichtung oder Schnittstelle, nicht zwingend über den Zähler.",
          ],
        },
      ],
    },
    {
      id: "irrtuemer",
      titel: "Vier verbreitete Irrtümer rund um den Smart Meter",
      tocLabel: "Irrtümer",
      bloecke: [
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**„Mit Opt-out behalte ich den Ferraris-Zähler.“** Nein. Laut Spruchpraxis der Regulierungskommission und OGH darf der Netzbetreiber auch bei Opt-out ein elektronisches, fernausgelesenes Gerät einbauen. Laut E-Control betrafen 2024 rund 30 % der Smart-Meter-Anträge bei der Schlichtungsstelle genau diesen Wunsch – ohne Aussicht auf Erfolg.",
            "**„Der Smart Meter schaltet meine PV-Anlage ab.“** Die Steuerbarkeit neuer Erzeugungsanlagen und die Spitzenkappung laufen über Regler, Wechselrichter oder Steuereinrichtungen. Die neue Zählergeneration kann zwar Schaltsignale weitergeben, der Eingriff folgt aber den Regeln des ElWG und des Netzanschlussvertrags.",
            "**„Viertelstundenwerte sieht jeder Lieferant.“** Nur mit Zustimmung oder wenn der Vertrag sie erfordert, etwa bei dynamischen Tarifen oder Energiegemeinschaften.",
            "**„Für die PV-Anlage brauche ich einen zweiten Zähler.“** Bei Überschusseinspeisung genügt meist der vorhandene Smart Meter mit Zweirichtungsmessung.",
          ],
        },
      ],
    },
    {
      id: "generation2",
      titel: "Smart Meter 2.0: Was die IMA-V 2026 ändert",
      tocLabel: "Smart Meter 2.0",
      bloecke: [
        {
          typ: "p",
          text: "**Die erste Smart-Meter-Generation muss nach Eichfrist (10 Jahre) und Nacheichfrist (5 Jahre) bis Ende 2039 ersetzt werden; die Anforderungen an die Nachfolger regelt die IMA-V 2026, die am 15. Juli 2026 in Kraft getreten ist.** Laut E-Control beginnt der Austausch frühestens 2028, weil Ausschreibungen zwei bis drei Jahre Vorlauf brauchen. Ab 1. Jänner 2040 müssen alle intelligenten Messgeräte eines Netzbetreibers der IMA-V 2026 entsprechen.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Messdaten und Speicherung", text: "Klarer, strukturierter und detaillierter festgelegt als in der alten IMA-VO 2011 – Grundlage für Abrechnung, Flexibilität, Tarifierung und Bilanzierung." },
            { titel: "Kundenschnittstelle", text: "Definierte Anforderungen an die lokale Schnittstelle, über die Energiemanagementsysteme Echtzeitdaten auslesen können." },
            { titel: "Lastunterbrechung und -begrenzung", text: "Massentaugliche Funktionen mit geringen Mehrkosten je Gerät – relevant für Netzbetrieb und flexible Netzzugänge." },
            { titel: "Schaltsignale", text: "Übermittlung von Schaltsignalen in die Kundenanlage, etwa für steuerbare Verbraucher oder Erzeugungsanlagen." },
          ],
        },
        {
          typ: "p",
          text: "Nicht mehr verlangt wird eine Multi-Utility-Schnittstelle (für Gas-, Wasser- oder Wärmezähler) – eine Empfehlung des Rechnungshofs. Für Betriebe bedeutet die neue Generation vor allem: bessere Daten für [Energiemanagementsysteme](/ratgeber/energiemanagementsystem) und mehr Möglichkeiten für [dynamische Stromtarife](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
        },
      ],
    },
    {
      id: "daten",
      titel: "Wer sieht welche Daten – und wie kommen Betriebe an ihre Werte?",
      tocLabel: "Datenzugriff",
      bloecke: [
        {
          typ: "p",
          text: "**Die Messdaten gehören zum Vertragsverhältnis zwischen Kunde und Netzbetreiber; Dritte erhalten sie nur, wenn es für einen Vertrag nötig ist oder der Zählpunktinhaber zustimmt.** Der Netzbetreiber nutzt die Werte für Abrechnung, Bilanzierung und Netzbetrieb und übermittelt sie über den energiewirtschaftlichen Datenaustausch an Lieferanten und – bei Teilnahme – an Energiegemeinschaften. Der Kunde selbst sieht seine Werte im Webportal des Netzbetreibers und kann sie dort in der Regel als Datei exportieren.",
        },
        {
          typ: "p",
          text: "Für Betriebe mit mehreren Standorten ist das Portal oft der einfachste Weg zum Lastgang: Pro Zählpunkt lassen sich Viertelstundenwerte herunterladen und für die Planung zusammenführen. Soll ein Dienstleister – etwa ein Energieberater oder der PV-Errichter – die Daten auswerten, braucht es eine Vollmacht bzw. Datenfreigabe durch den Zählpunktinhaber. Bei gemieteten Flächen ist zu klären, wer Zählpunktinhaber ist: der Mieter mit eigenem Zählpunkt oder der Eigentümer mit Hauptzähler und Subzählern.",
        },
        {
          typ: "h3",
          text: "Checkliste: Messdaten im Betrieb nutzen",
        },
        {
          typ: "checkliste",
          punkte: [
            "Zählpunktbezeichnungen aller Standorte und Verbrauchsstellen erfassen (33-stellig, beginnend mit „AT“)",
            "Messart klären: Smart Meter (Standard, Opt-in, Opt-out) oder Lastprofilzähler",
            "Opt-in für Viertelstundenwerte erteilen, wenn PV, Speicher, Energiegemeinschaft oder dynamischer Tarif geplant sind",
            "12 Monate Lastgang exportieren und Lastspitzen sowie Grundlast auswerten",
            "Kundenschnittstelle des Zählers für Energiemanagement und Überschussregelung nutzen, sofern verfügbar",
            "Datenfreigaben für Dienstleister schriftlich regeln und bei Vertragsende widerrufen",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Viertelstundenwerte und die Netzentgelte ab 2027",
          text: "Laut Begutachtungsentwurf der E-Control soll ab 2027 über alle Netzebenen ein Verhältnis von etwa 50 % Arbeits- zu 50 % Leistungsanteil erreicht werden. Für Betriebe, die bisher ohne Leistungsmessung abgerechnet wurden, wird die monatliche Spitzenleistung damit zur Kostengröße – und Viertelstundenwerte zur Voraussetzung, um sie zu steuern. Die endgültigen Tarife legt die Tarifverordnung fest.",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet der Smart Meter?",
      tocLabel: "Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Für den Einbau des Smart Meters zahlen Kunden nichts extra; die Kosten der Messung sind im Messentgelt auf der Netzrechnung enthalten, dessen Höchstbeträge die E-Control verordnet.** Zusätzliche Kosten entstehen nur für optionale Geräte – etwa ein Auslesegerät für die Kundenschnittstelle oder ein Energiemanagementsystem. Lastprofilzähler bei größeren Betrieben werden ebenfalls über Messentgelte abgerechnet. Begriffe wie Lastprofil, Viertelstundenmaximum und Zählpunkt erklärt unser [Lexikon zum Smart Meter](/wissen/lexikon#smart-meter).",
        },
        {
          typ: "p",
          text: "Der wirtschaftliche Nutzen liegt in den Daten: Wer Viertelstundenwerte kennt, kann Lastspitzen erkennen, PV und Speicher richtig dimensionieren und von zeitvariablen Netzentgelten profitieren. Der Entwurf der E-Control sieht ab 2027 österreichweit einheitliche Niedertarif-Zeitfenster vor – im Sommer (April bis September) von 10 bis 16 Uhr und im Winter (Oktober bis März) von 22 bis 4 Uhr. Wie Sie diese mit PV und Speicher nutzen, erklärt unsere Seite [Smart Meter & Messung](/produkte/smartmeter).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Muss ich in Österreich einen Smart Meter akzeptieren?",
      a: "Die Pflicht zur Ausrollung trifft den Netzbetreiber. Kunden können die intelligenten Funktionen ablehnen (Opt-out); das Gerät selbst darf der Netzbetreiber laut VfGH und OGH trotzdem einbauen, weil es in der Opt-out-Konfiguration wie ein digitaler Standardzähler arbeitet.",
    },
    {
      q: "Was bedeutet Opt-out beim Smart Meter?",
      a: "Im Opt-out werden nur abrechnungsrelevante Werte erfasst und Funktionen wie die Fernabschaltung deaktiviert. Viertelstundenwerte stehen dann nicht zur Verfügung – eine Teilnahme an Energiegemeinschaften oder dynamische Tarife sind so nicht möglich.",
    },
    {
      q: "Wie bekomme ich meine Viertelstundenwerte?",
      a: "Stimmen Sie im Webportal Ihres Netzbetreibers der Übertragung von Viertelstundenwerten zu (Opt-in). Die Werte des Vortages stehen danach täglich im Portal zur Verfügung. Betriebe mit Lastprofilzähler finden den Lastgang dort ohnehin.",
    },
    {
      q: "Brauche ich für eine PV-Anlage einen neuen Zähler?",
      a: "Meist nicht. Der Smart Meter misst Bezug und Einspeisung; der Netzbetreiber stellt ihn bei der Inbetriebnahme auf Zweirichtung um. Eine eigene Messung kann bei Volleinspeisung oder größeren Anlagen nötig sein.",
    },
    {
      q: "Ist ein Smart Meter für Energiegemeinschaften Pflicht?",
      a: "Ja. Jede teilnehmende Erzeugungs- und Verbrauchsanlage braucht einen Smart Meter mit Opt-in, weil die Energie je Viertelstunde zugeordnet wird. Die Datenfreigabe erteilt jeder Teilnehmer selbst im Netzbetreiber-Portal.",
    },
    {
      q: "Wann kommt die zweite Smart-Meter-Generation?",
      a: "Die Anforderungen stehen seit der IMA-V 2026 (in Kraft 15. Juli 2026) fest. Laut E-Control kann der Austausch frühestens 2028 beginnen; bis Ende 2039 müssen die Geräte der ersten Generation ersetzt sein.",
    },
  ],

  passend: [
    { href: "/produkte/smartmeter", titel: "Smart Meter & Messung", text: "Daten nutzen für PV, Speicher und Tarife." },
    { href: "/ratgeber/energiegemeinschaft-gruenden", titel: "Energiegemeinschaft gründen", text: "EEG, BEG, GEA und EDA-Datenaustausch." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving & Leistungspreis", text: "Lastspitzen erkennen und senken." },
    { href: "/ratgeber/photovoltaik-anmelden", titel: "PV-Anlage anmelden", text: "Zählpunkt und Inbetriebnahme." },
  ],

  quellen: [
    { titel: "E-Control – Bericht zur Einführung von intelligenten Messgeräten in Österreich 2025 (Berichtsjahr 2024)", url: "https://www.e-control.at/documents/1785851/1811582/20251020-Monitoringbericht-SM-2025.pdf/4ce4b22f-8149-5162-770a-83f132511199?t=1763621630772", stand: "10/2025" },
    { titel: "E-Control – Smart Metering: Rechtliche Grundlagen (IMA-V 2026)", url: "https://www.e-control.at/marktteilnehmer/strom/smart-metering/rechtliche-grundlagen", stand: "09/2026" },
    { titel: "E-Control – Smart Meter 2.0", url: "https://www.e-control.at/strom/smart-meter-zwei-punkt-null", stand: "09/2026" },
    { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – Messung und Aufteilung", url: "https://energiegemeinschaften.gv.at/messung-und-aufteilung/", stand: "09/2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "Wiener Stadtwerke – SNE-G-V Begutachtung: neue Netzentgeltstruktur ab 2027", url: "https://positionen.wienerstadtwerke.at/aktuelles/systemnutzungsentgelte-grundsatz-verordnung-begutachtung", stand: "07/2026" },
    { titel: "NÖ Elektrizitätswesengesetz 2005 – standardisierte Lastprofile (jusline.at)", url: "https://www.jusline.at/gesetz/noe_elwg_2005/gesamt", stand: "09/2026" },
  ],

  seitenCta: { titel: "Lastgang auswerten lassen?", text: "Wir analysieren Ihre Viertelstundenwerte für PV und Speicher.", href: "/service/energieberatung", label: "Energieberatung" },
  cta: {
    title: "Aus Messdaten eine passende PV-Anlage machen.",
    text: "Ökovolt Solartechnik plant PV-Anlagen und Speicher auf Basis Ihres Lastgangs – für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Smart Meter & Messung", href: "/produkte/smartmeter" },
  },
};

export default artikel;
