// Ratgeber: Smart-Meter-Pflicht 2026 – Pflichtfälle, Kosten, freiwilliger Einbau, PV
// Recherchestand 13.09.2026: MsbG §§ 29, 30, 32, 34, 35, 36, 37, 38, 45 im Wortlaut
// (gesetze-im-internet.de), Verbraucherzentralen, BSW.

const artikel = {
  slug: "smart-meter-pflicht",
  title: "Smart-Meter-Pflicht 2026: Wer muss, was kostet es?",
  seoTitle: "Smart Meter Pflicht 2026: Wer muss, was kostet es? | Ökovolt",
  kurzTitel: "Smart-Meter-Pflicht",
  description:
    "Smart Meter Pflicht 2026: Wer ein intelligentes Messsystem bekommt, welche Kosten § 30 MsbG deckelt, was der Einbau auf Wunsch kostet und was für PV gilt.",
  excerpt:
    "Über 6.000 kWh Verbrauch, Wärmepumpe oder Wallbox nach § 14a, PV-Anlage über 7 kW: Dann kommt der Smart Meter verpflichtend. Alle Pflichtfälle, Preisobergrenzen und Fristen im Überblick.",
  hauptKeyword: "smart meter pflicht",
  keywords: ["Smart Meter Pflicht", "Smart Meter Kosten", "intelligentes Messsystem Pflicht", "Smart Meter Photovoltaik", "Smart Meter Preisobergrenze", "Smart Meter auf Wunsch", "Smart-Meter-Rollout 2026"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Smartphone/smart-home-3920905_1280.jpg",
  bildAlt: "Hände halten ein Tablet mit Energie-App vor einem Einfamilienhaus in der Dämmerung",
  badge: { wert: "über 7 kW", text: "PV-Leistung: Smart Meter und Steuerbox sind Pflicht" },

  kurzFazit: [
    "**Ein Smart Meter (intelligentes Messsystem) ist Pflicht bei mehr als 6.000 kWh Jahresverbrauch, bei steuerbaren Verbrauchseinrichtungen nach § 14a EnWG und bei PV- oder anderen Erzeugungsanlagen über 7 kW** (§ 29 MsbG).",
    "Die Kosten sind gedeckelt: Haushalte zahlen im Pflichtfall **40 bis 140 € im Jahr**, bei PV über 7 bis 15 kW oder § 14a höchstens 50 €. Für die Steuerbox kommen bis zu 50 € hinzu.",
    "Alle anderen Haushalte bekommen mindestens einen digitalen Zähler (höchstens 25 € im Jahr). Einen Smart Meter können Sie seit 2025 **auf Wunsch** verlangen – für einmalig höchstens 100 € und 30 € im Jahr.",
    "Den Pflichteinbau können Sie nicht ablehnen, aber einen anderen Messstellenbetreiber wählen. Für PV-Anlagen ist der Smart Meter mit Steuerbox Voraussetzung, um die **60-%-Einspeisegrenze** aufzuheben.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wer muss einen Smart Meter einbauen lassen?",
      tocLabel: "Pflichtfälle",
      bloecke: [
        {
          typ: "p",
          text: "**Einen Smart Meter bekommen Sie verpflichtend, wenn mindestens einer von drei Fällen zutrifft: Ihr Jahresverbrauch liegt über 6.000 kWh, Sie haben eine steuerbare Verbrauchseinrichtung mit Vereinbarung nach § 14a EnWG, oder Sie betreiben eine Erzeugungsanlage – etwa eine PV-Anlage – mit mehr als 7 kW installierter Leistung.** So regelt es § 29 des Messstellenbetriebsgesetzes (MsbG). Den Einbau organisiert der grundzuständige Messstellenbetreiber, meist die Netztochter Ihres örtlichen Versorgers.",
        },
        {
          typ: "p",
          text: "Ein Smart Meter im Sinne des Gesetzes ist ein [intelligentes Messsystem](/wissen/lexikon#imsys): ein digitaler Zähler plus [Smart-Meter-Gateway](/wissen/lexikon#smart-meter-gateway), das Messwerte BSI-zertifiziert verschlüsselt überträgt. Bei § 14a-Geräten und Erzeugungsanlagen kommt eine Steuerungseinrichtung (Steuerbox) hinzu. Davon zu unterscheiden ist die [moderne Messeinrichtung](/wissen/lexikon#moderne-messeinrichtung) – ein digitaler Zähler ohne Kommunikationsmodul, den alle übrigen Haushalte bis spätestens 2032 erhalten.",
        },
        {
          typ: "tabelle",
          caption: "Einbaufälle nach § 29 MsbG, Stand September 2026",
          kopf: ["Situation", "Was eingebaut wird", "Pflicht?"],
          zeilen: [
            ["Jahresverbrauch über 6.000 kWh", "intelligentes Messsystem", "**ja**"],
            ["Wärmepumpe, Wallbox, Speicher oder Klimaanlage mit Vereinbarung nach § 14a EnWG", "intelligentes Messsystem + Steuerbox", "**ja**"],
            ["PV-Anlage oder andere Erzeugungsanlage über 7 kW", "intelligentes Messsystem + Steuerbox", "**ja**"],
            ["PV-Anlage bis 7 kW, Verbrauch bis 6.000 kWh", "moderne Messeinrichtung; Smart Meter optional", "nein (optionaler Einbaufall)"],
            ["Balkonkraftwerk", "digitaler Zähler mit Rücklaufsperre bzw. Zweirichtungszähler", "nein"],
            ["Neubau oder größere Renovierung", "mindestens moderne Messeinrichtung bis zur Fertigstellung", "ja (mME)"],
          ],
          minBreite: 680,
          fussnote: "Der Jahresverbrauch wird als Durchschnitt der letzten drei Jahre bestimmt (§ 30 Abs. 4 MsbG). Messstellenbetreiber dürfen auch in optionalen Fällen einen Smart Meter einbauen, sofern die Preisobergrenzen eingehalten werden.",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet ein Smart Meter? Die Preisobergrenzen nach § 30 MsbG",
      tocLabel: "Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Die jährlichen Kosten für den Smart Meter sind gesetzlich gedeckelt und liegen für Haushalte je nach Fall zwischen 30 und 140 € brutto.** Seit dem 1. Januar 2025 teilen sich Anschlussnutzer und Netzbetreiber die Kosten: Der Netzbetreiber trägt bis zu 80 € pro Jahr, Ihr Anteil ist nach Verbrauch oder Anlagenleistung gestaffelt. Die Beträge enthalten Einbau, Betrieb und Datenübertragung.",
        },
        {
          typ: "tabelle",
          caption: "Preisobergrenzen für intelligente Messsysteme pro Zählpunkt und Jahr (brutto) nach § 30 MsbG",
          kopf: ["Fall", "Ihr Anteil (Anschlussnutzer)", "Anteil Netzbetreiber", "Summe höchstens"],
          zeilen: [
            ["Verbrauch über 6.000 bis 10.000 kWh", "40 €", "80 €", "120 €"],
            ["Verbrauch über 10.000 bis 20.000 kWh, **§ 14a-Gerät** oder **PV über 7 bis 15 kW**", "**50 €**", "80 €", "130 €"],
            ["Verbrauch über 20.000 bis 50.000 kWh oder PV über 15 bis 25 kW", "110 €", "80 €", "190 €"],
            ["Verbrauch über 50.000 bis 100.000 kWh oder PV über 25 bis 100 kW", "140 €", "80 €", "220 €"],
            ["Verbrauch über 100.000 kWh oder Anlage über 100 kW", "angemessenes Entgelt", "80 €", "–"],
            ["Zusätzlich: Steuerbox (bei § 14a und Anlagen über 7 kW)", "bis 50 €", "bis 50 €", "–"],
            ["Optionaler Einbau durch den Messstellenbetreiber", "30 €", "30 €", "60 €"],
            ["Moderne Messeinrichtung (ohne Gateway)", "25 €", "–", "25 €"],
          ],
          markierteZeile: 1,
          minBreite: 760,
          fussnote: "Wortlaut §§ 30, 32 MsbG, Stand 13.09.2026. Trifft mehr als ein Fall zu – etwa PV-Anlage und Wärmepumpe –, darf nur die höchste einschlägige Preisobergrenze berechnet werden, nicht die Summe (§ 30 Abs. 5). Die Bundesnetzagentur kann abweichende Obergrenzen festlegen. Einige Verbraucherzentralen nennen für die moderne Messeinrichtung noch 20 €; das Gesetz sieht 25 € vor.",
        },
        {
          typ: "kennzahl",
          wert: "100 €",
          titel: "im Jahr höchstens für eine typische PV-Anlage mit 10 kWp",
          text: "50 € für das intelligente Messsystem plus bis zu 50 € für die Steuerbox – vorausgesetzt, der Messstellenbetreiber schöpft die Obergrenzen voll aus.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Nicht enthalten: Umbau am Zählerschrank",
          text: "Die Preisobergrenzen gelten für den Messstellenbetrieb. Ist Ihr [Zählerschrank](/wissen/lexikon#zaehlerschrank) zu alt oder zu klein für Zähler, Gateway und Steuerbox, müssen Sie den Umbau selbst beauftragen und bezahlen. Das kann je nach Zustand einige Hundert bis mehrere Tausend Euro kosten – bei einer neuen PV-Anlage wird das idealerweise gleich mitgeplant.",
        },
      ],
    },
    {
      id: "rollout",
      titel: "Bis wann kommt der Smart Meter? Fristen des Rollouts",
      tocLabel: "Rollout-Fristen",
      bloecke: [
        {
          typ: "p",
          text: "**Einen festen Stichtag für Ihren Haushalt gibt es nicht – das Gesetz verpflichtet die Messstellenbetreiber zu Quoten, die bis Ende 2032 auf 90 % steigen.** Der verpflichtende Rollout läuft seit dem 1. Januar 2025. Wann genau bei Ihnen eingebaut wird, entscheidet der Messstellenbetreiber; er muss Sie **spätestens drei Monate vorher** informieren (§ 37 MsbG) und einen Termin mindestens zwei Wochen im Voraus ankündigen (§ 38 MsbG).",
        },
        {
          typ: "tabelle",
          caption: "Ausstattungsquoten der Messstellenbetreiber nach § 45 MsbG",
          kopf: ["Bis Ende", "Verbraucher 6.000–100.000 kWh und § 14a", "Erzeugungsanlagen über 7 bis 100 kW"],
          zeilen: [
            ["2025", "mindestens 20 % der auszustattenden Messstellen", "Beginn der Ausstattung"],
            ["2026", "90 % der seit 25.2.2025 neu auszustattenden Messstellen", "90 % der Leistung, die vom 25.2.2025 bis 30.9.2026 neu in Betrieb ging"],
            ["2028", "90 % der 2027/2028 neu auszustattenden Messstellen", "90 % der Neuanlagen bis 30.9.2028 und **50 % der Anlagen aus 2018 bis Februar 2025**"],
            ["2030", "90 % der 2029/2030 neu auszustattenden Messstellen", "90 % der Neuanlagen bis 30.9.2030"],
            ["2032", "**90 % aller** auszustattenden Messstellen", "**90 % der insgesamt installierten Leistung**"],
          ],
          minBreite: 760,
          fussnote: "Für Verbraucher über 100.000 kWh und Anlagen über 100 kW beginnt der Pflicht-Rollout spätestens 2028. Die Bundesnetzagentur veröffentlicht den Fortschritt je Messstellenbetreiber.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Ablehnen geht nicht – wechseln schon",
          text: "Weder Eigentümer noch Mieter dürfen den Pflichteinbau verhindern (§ 36 Abs. 3 MsbG), und dem Messstellenbetreiber ist nach Ankündigung Zutritt zu gewähren. Sie können aber einen wettbewerblichen Messstellenbetreiber beauftragen. Erfüllt dieser die Ausstattungsvorgaben innerhalb von vier Monaten nach der Ankündigung, entfällt der Einbau durch den grundzuständigen Betreiber.",
        },
      ],
    },
    {
      id: "auf-wunsch",
      titel: "Smart Meter auf Wunsch: Anspruch, Frist und Kosten",
      tocLabel: "Einbau auf Wunsch",
      bloecke: [
        {
          typ: "p",
          text: "**Seit dem 1. Januar 2025 können Sie einen Smart Meter auch dann verlangen, wenn Sie kein Pflichtfall sind – der Messstellenbetreiber muss ihn innerhalb von vier Monaten einbauen.** So regelt es § 34 Abs. 2 MsbG. Als angemessen gilt dafür ein einmaliges Entgelt von höchstens 100 € sowie bei optionalen Einbaufällen ein laufendes Zusatzentgelt von höchstens 30 € im Jahr (§ 35 MsbG) – zusätzlich zur regulären Preisobergrenze.",
        },
        {
          typ: "p",
          text: "Der Messstellenbetreiber darf einen Auftrag nur ablehnen, wenn der Einbau technisch nicht möglich ist, oder vorübergehend zurückstellen, solange seine gesetzlichen Rollout-Ziele sonst gefährdet wären. Beides muss er in Textform begründen und im Fall der Zurückstellung einen verbindlichen Zeitplan nennen.",
        },
        {
          typ: "h3",
          text: "Für wen sich der freiwillige Einbau lohnt",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Dynamischer Stromtarif:** Ohne intelligentes Messsystem können Sie keinen Tarif mit stündlich oder viertelstündlich wechselnden Preisen nutzen – mehr im Ratgeber [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
            "**Neue PV-Anlage bis 7 kW:** Mit Smart Meter und Steuerbox lässt sich die 60-%-Einspeisebegrenzung aufheben.",
            "**Transparenz:** Viertelstundenwerte zeigen, wann Grundlast und Verbrauchsspitzen entstehen – eine gute Basis, um den Eigenverbrauch zu steigern.",
            "**Weniger sinnvoll** ist der Wunscheinbau bei niedrigem Verbrauch ohne verschiebbare Lasten: Dann stehen 100 € Einbau und laufende Kosten kaum Einsparungen gegenüber.",
          ],
        },
      ],
    },
    {
      id: "photovoltaik",
      titel: "Smart Meter und Photovoltaik: Was Anlagenbetreiber wissen müssen",
      tocLabel: "PV-Anlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Für PV-Anlagen ist der Smart Meter seit dem Solarspitzengesetz mehr als ein Zähler: Er entscheidet mit darüber, wie viel Sie einspeisen dürfen und wann Sie Vergütung erhalten.** Neue Anlagen, die seit dem 25. Februar 2025 in Betrieb gehen, dürfen ohne intelligentes Messsystem und Steuerbox nur 60 % ihrer Modulleistung ins Netz einspeisen. Erst nach Einbau und erfolgreicher Prüfung durch den Netzbetreiber fällt die Begrenzung weg.",
        },
        {
          typ: "karten",
          items: [
            { titel: "60-%-Begrenzung", text: "Gilt für neue Anlagen bis 25 kW ohne Steuerbox. Mit Eigenverbrauch und Speicher sind die Ertragsverluste meist klein – Details im Ratgeber [Solarspitzengesetz](/ratgeber/solarspitzengesetz)." },
            { titel: "Negative Preise", text: "Neue Anlagen mit Smart Meter erhalten bei negativen Börsenpreisen keine Vergütung; die Zeit wird am Ende angehängt. Wie oft das vorkommt, zeigt [Negative Strompreise](/ratgeber/negative-strompreise)." },
            { titel: "§ 14a EnWG", text: "Wärmepumpe oder Wallbox mit § 14a-Vereinbarung bringen reduzierte Netzentgelte – setzen aber Smart Meter und Steuerbox voraus. Mehr unter [§ 14a EnWG](/ratgeber/paragraf-14a-enwg)." },
            { titel: "Ü20-Anlagen", text: "Mit Smart Meter halbiert sich die Vermarktungspauschale der Anschlussvergütung – siehe [Photovoltaik nach 20 Jahren](/ratgeber/photovoltaik-nach-20-jahren)." },
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Nulleinspeisung als Ausnahme von der Steuerbox",
          text: "Wer die Einspeisung seiner Anlage dauerhaft auf 0 % begrenzt und das dem Messstellenbetreiber in Textform erklärt, braucht keine Steuerbox (§ 29 Abs. 5 MsbG). Die Erklärung bindet mindestens vier Jahre. Wirtschaftlich lohnt sich eine [Nulleinspeisung](/wissen/lexikon#nulleinspeisung) nur in Sonderfällen, etwa bei knapper Netzkapazität.",
        },
        {
          typ: "p",
          text: "Laufen bei Ihnen mehrere Fälle zusammen – PV-Anlage, Wärmepumpe und Wallbox –, bleibt es bei einem Smart Meter am Netzanschluss, und berechnet werden darf nur die höchste einschlägige Preisobergrenze. Wie Messkonzept, Steuerbox und [Energiemanagementsystem](/ratgeber/energiemanagementsystem) zusammenspielen, sollte schon bei der Planung der Anlage feststehen. Einen Überblick über Zähler und Gateways finden Sie auf unserer Seite [Smart Meter](/produkte/smartmeter).",
        },
        {
          typ: "tool",
          href: "/rechner/dynamischer-stromtarif",
          titel: "Lohnt sich ein dynamischer Tarif mit Ihrem Smart Meter?",
          text: "Mit echten Börsenpreisen berechnen, was Haushalt, Wärmepumpe oder E-Auto mit dynamischem Tarif kosten.",
          label: "Zum Tarif-Rechner",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Was sich ab 2027 ändern könnte",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Die Bundesregierung plant, den Smart-Meter-Rollout für PV-Anlagen deutlich auszuweiten.** Nach Berichten zum EEG-Entwurf, den das Kabinett am 29. Juli 2026 beschlossen hat, soll die Schwelle für den Pflichteinbau bei Erzeugungsanlagen von mehr als 7 kW auf mehr als 2 kW sinken. Das Gesetzgebungsverfahren läuft noch; Details und Stichtage können sich ändern. Für neue Anlagen heißt das: Wer heute plant, sollte Platz im Zählerschrank für Gateway und Steuerbox vorsehen.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Pflichtfall prüfen", "Verbrauch der letzten drei Jahre, § 14a-Geräte und installierte PV-Leistung zusammentragen."],
            ["Preisblatt ansehen", "Grundzuständige Messstellenbetreiber müssen ihre Preise jährlich zum 31. Oktober veröffentlichen – prüfen Sie, ob die Obergrenzen eingehalten sind."],
            ["Zählerschrank checken", "Platz für Zähler, Gateway und Steuerbox klären lassen, am besten zusammen mit PV-, Wärmepumpen- oder Wallbox-Planung."],
            ["Nutzen realisieren", "Dynamischen Tarif, § 14a-Modul und Energiemanagement so kombinieren, dass die laufenden Kosten wieder hereinkommen."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Ab wann ist ein Smart Meter Pflicht?", a: "Der Pflicht-Rollout läuft seit dem 1. Januar 2025. Pflicht ist ein intelligentes Messsystem bei mehr als 6.000 kWh Jahresverbrauch, bei steuerbaren Verbrauchseinrichtungen nach § 14a EnWG und bei Erzeugungsanlagen über 7 kW. Bis Ende 2032 sollen 90 % der Pflichtfälle ausgestattet sein." },
    { q: "Was kostet ein Smart Meter im Jahr?", a: "Im Pflichtfall zahlen Haushalte je nach Verbrauch oder Anlagenleistung höchstens 40 bis 140 € brutto im Jahr, für § 14a-Geräte und PV über 7 bis 15 kW höchstens 50 €. Für die Steuerbox können zusätzlich bis zu 50 € anfallen. Eine moderne Messeinrichtung ohne Gateway kostet höchstens 25 €." },
    { q: "Kann ich den Einbau eines Smart Meters verweigern?", a: "Nein. Nach § 36 Abs. 3 MsbG dürfen weder Eigentümer noch Mieter den Pflichteinbau verhindern. Sie können aber einen anderen, wettbewerblichen Messstellenbetreiber beauftragen." },
    { q: "Brauche ich für meine PV-Anlage einen Smart Meter?", a: "Bei mehr als 7 kW installierter Leistung ja, zusammen mit einer Steuerbox. Bei kleineren neuen Anlagen ist er freiwillig, hebt aber die 60-%-Einspeisebegrenzung auf. Geplant ist, die Schwelle mit der EEG-Novelle auf 2 kW zu senken." },
    { q: "Was kostet ein Smart Meter auf Wunsch?", a: "Der Messstellenbetreiber darf für den vorzeitigen Einbau einmalig höchstens 100 € verlangen, bei optionalen Einbaufällen zusätzlich bis zu 30 € im Jahr neben der regulären Preisobergrenze. Er muss innerhalb von vier Monaten einbauen." },
    { q: "Braucht ein Balkonkraftwerk einen Smart Meter?", a: "Nein. Für Steckersolargeräte genügt ein digitaler Zähler; ein intelligentes Messsystem ist nicht vorgeschrieben, solange Verbrauch und sonstige Anlagen keinen Pflichtfall auslösen." },
    { q: "Wer zahlt den Smart Meter als Mieter?", a: "Die jährlichen Kosten trägt der Anschlussnutzer – als Mieter also in der Regel Sie, sofern Sie einen eigenen Stromzähler haben. Den Pflichteinbau dürfen weder Mieter noch Vermieter verhindern." },
  ],

  passend: [
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Zähler, Gateway und Steuerbox im Überblick." },
    { href: "/ratgeber/paragraf-14a-enwg", titel: "§ 14a EnWG", text: "Reduzierte Netzentgelte für Wärmepumpe und Wallbox." },
    { href: "/ratgeber/solarspitzengesetz", titel: "Solarspitzengesetz", text: "60-%-Regel und negative Preise." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Tarif-Rechner", text: "Dynamischer Tarif oder Festpreis?" },
  ],

  quellen: [
    { titel: "§ 29 MsbG – Ausstattung von Messstellen mit intelligenten Messsystemen", url: "https://www.gesetze-im-internet.de/messbg/__29.html", stand: "09/2026" },
    { titel: "§ 30 MsbG – Preisobergrenzen für intelligente Messsysteme", url: "https://www.gesetze-im-internet.de/messbg/__30.html", stand: "09/2026" },
    { titel: "§ 35 MsbG – Entgelt für Zusatzleistungen (Einbau auf Wunsch)", url: "https://www.gesetze-im-internet.de/messbg/__35.html", stand: "09/2026" },
    { titel: "§ 45 MsbG – Ausstattungsverpflichtungen des Messstellenbetreibers", url: "https://www.gesetze-im-internet.de/messbg/__45.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Messeinrichtungen und intelligente Messsysteme", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/Metering/start.html", stand: "09/2026" },
    { titel: "Verbraucherzentrale Schleswig-Holstein – Smart Meter: Pflichteinbau und Kosten", url: "https://www.verbraucherzentrale.sh/wissen/energie/smart-meter-pflichteinbau-und-kosten", stand: "07/2026" },
    { titel: "Bundesverband Solarwirtschaft – FAQ Solarspitzen-Gesetz", url: "https://www.solarwirtschaft.de/unsere-themen/photovoltaik/standpunkte/faq-solarspitzengesetz/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Smart Meter sinnvoll nutzen", text: "Dynamischen Tarif mit echten Börsenpreisen durchrechnen.", href: "/rechner/dynamischer-stromtarif", label: "Zum Tarif-Rechner" },
  cta: {
    title: "PV, Smart Meter und Steuerbox aus einer Hand.",
    text: "Wir planen Anlage und Zählerschrank so, dass Messkonzept, Steuerbox und Energiemanagement von Anfang an zusammenpassen – inklusive Anmeldung beim Netzbetreiber.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Smart Meter ansehen", href: "/produkte/smartmeter" },
  },
};

export default artikel;
