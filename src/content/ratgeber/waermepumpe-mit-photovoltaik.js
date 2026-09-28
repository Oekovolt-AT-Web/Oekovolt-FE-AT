// Ratgeber: Wärmepumpe mit Photovoltaik – Gewerbe, Landwirtschaft, Hotellerie, Prozesswärme (Österreich)
// Quellen: KPC/Umweltförderung „Wärmepumpe ≥ 100 kW“ (ab 01.01.2026: JAZ ≥ 3,8, Kältemittel GWP < 750, Antrag
// vor Bestellung) und „Wärmepumpe < 100 kW“ (Antrag nach Umsetzung, bis 6 Monate nach Rechnung), Sanierungsoffensive
// 2026 (Kesseltausch/Sanierungsbonus ausgeschöpft), TOR Verteilernetzanschluss NS V1.3.1 (Meldung > 3,68 kVA),
// Verordnung (EU) 2024/573 (F-Gase), OeMAG-Marktpreis PV 2026. Rechenbeispiel mit offengelegten Annahmen.

const WAERME = 150000; // kWh Wärmebedarf/Jahr (Beispiel Hotel/Betrieb)
const JAZ = 3.5;
const STROM = WAERME / JAZ;
const PV_DECKUNG = 0.3; // Annahme: Anteil des WP-Stroms aus eigener PV
const BEZUG = 0.2; // €/kWh netto, Annahme
const MARKT = 0.068; // €/kWh, OeMAG-Sommermarktpreis PV 2026 gerundet
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";

const artikel = {
  slug: "waermepumpe-mit-photovoltaik",
  title: "Wärmepumpe mit Photovoltaik: Was im Betrieb realistisch ist",
  seoTitle: "Wärmepumpe mit Photovoltaik im Betrieb | Ökovolt",
  kurzTitel: "Wärmepumpe mit PV",
  description:
    "Wärmepumpe mit Photovoltaik: realistische PV-Deckung, SG-Ready und EEBUS, thermische Speicher, Großwärmepumpen, Prozesswärme und Förderung 2026 in Österreich.",
  excerpt:
    "PV und Wärmepumpe ergänzen sich – aber nicht so, wie viele glauben: Im Winter liefert die PV wenig, im Sommer braucht die Heizung nichts. Wie Betriebe, Hotels und Landwirte die Kombination trotzdem wirtschaftlich machen.",
  hauptKeyword: "wärmepumpe mit photovoltaik",
  keywords: [
    "Wärmepumpe mit Photovoltaik",
    "Wärmepumpe PV Gewerbe",
    "Großwärmepumpe Photovoltaik",
    "Prozesswärme Wärmepumpe",
    "SG-Ready PV-Überschuss",
    "Wärmepumpe Hotel Photovoltaik",
    "Wärmepumpe Förderung Betriebe 2026",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Ratgeber/waermepumpe-mit-photovoltaik.jpg",
  bildAlt: "Außeneinheit einer Luft-Wasser-Wärmepumpe an einer Gebäudewand mit Pflanzen",
  badge: { wert: "JAZ ≥ 3,8", text: "Mindest-Jahresarbeitszahl für die Förderung von Wärmepumpen ab 100 kW (KPC, ab 2026)" },

  kurzFazit: [
    "**PV und Wärmepumpe passen zusammen, aber nicht zeitgleich:** Der Heizbedarf fällt im Winter an, wenn die PV-Anlage wenig erzeugt. Hoch ist die Deckung bei Warmwasser, Pool, Kühlung und Prozesswärme, die auch im Sommer gebraucht werden.",
    `**Rechenbeispiel:** Ein Betrieb mit ${kwh(WAERME)} Wärmebedarf und einer Wärmepumpe mit JAZ ${String(JAZ).replace(".", ",")} braucht rund ${kwh(STROM)} Strom. Deckt die PV 30 % davon, spart das gegenüber Netzbezug abzüglich entgangener Einspeisung rund ${eur(STROM * PV_DECKUNG * (BEZUG - MARKT))} im Jahr (Annahmen siehe Rechenbeispiel).`,
    "**Thermische Speicher sind die günstigste Batterie:** Pufferspeicher, Warmwasserspeicher, Bauteilaktivierung und Kühlzellen nehmen Mittagsüberschüsse auf – gesteuert über SG-Ready oder EEBUS.",
    "**Förderung 2026:** Die Bundesförderung für private Heizungstausche (Kesseltausch, Sanierungsbonus) ist ausgeschöpft. Betriebe und Gemeinden können über die Umweltförderung im Inland ansuchen – bei Anlagen ab 100 kW mit JAZ ≥ 3,8 und Kältemittel mit GWP unter 750.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie viel Wärmepumpenstrom kann die PV-Anlage decken?",
      tocLabel: "Realistische Deckung",
      bloecke: [
        {
          typ: "p",
          text: "**Wie viel Wärmepumpenstrom aus der eigenen PV kommt, hängt davon ab, wann die Wärme gebraucht wird: Für reine Raumheizung ist der Anteil gering, für Warmwasser, Poolheizung, Kühlung und Prozesswärme deutlich höher.** Der Grund ist der jahreszeitliche Versatz: In Österreich erzeugt eine PV-Anlage den Großteil ihres Ertrags von April bis September, während Heizgebäude den Großteil ihrer Wärme von November bis März brauchen. Im Dezember und Jänner kommt zudem Schneebedeckung hinzu.",
        },
        {
          typ: "tabelle",
          caption: "PV-Deckung des Wärmepumpenstroms nach Anwendung (qualitative Einordnung)",
          kopf: ["Anwendung", "Bedarf im Jahresverlauf", "Passung zur PV", "Hebel"],
          zeilen: [
            ["Raumheizung Büro/Halle", "Winter, früh morgens", "gering", "Puffer, Bauteilaktivierung, Vorheizen zu Mittag"],
            ["Warmwasser Hotel/Gastronomie", "ganzjährig, Spitzen morgens und abends", "mittel bis hoch", "große Warmwasserspeicher mittags laden"],
            ["Pool, Wellness", "ganzjährig, im Sommer hoch", "hoch", "Beckenwasser als Wärmespeicher"],
            ["Kühlung/Klimatisierung (reversibel)", "Sommer, mittags", "sehr hoch", "Kälte speichern, Gebäude vorkühlen"],
            ["Prozesswärme (Reinigung, Trocknung, Lebensmittel)", "ganzjährig, oft tagsüber", "hoch", "Prozesse in die Mittagsstunden legen"],
            ["Landwirtschaft (Warmwasser Melkstand, Stallheizung)", "ganzjährig bzw. Winter", "mittel", "Abwärme der Milchkühlung nutzen, Warmwasser mittags"],
          ],
          minBreite: 700,
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Nicht nach Jahressummen rechnen",
          text: "Eine PV-Anlage, die übers Jahr so viel Strom erzeugt wie die Wärmepumpe verbraucht, deckt deren Bedarf nicht zu 100 %. Entscheidend ist die Gleichzeitigkeit – und die zeigt nur eine Simulation mit Stunden- oder Viertelstundenwerten für Erzeugung und Wärmebedarf.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: Betrieb mit 150.000 kWh Wärmebedarf",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Das folgende Beispiel zeigt die Größenordnung für ein Hotel oder einen Gewerbebetrieb mit ${kwh(WAERME)} Wärmebedarf im Jahr.** Die Wärmepumpe arbeitet mit einer Jahresarbeitszahl (JAZ) von ${String(JAZ).replace(".", ",")} und braucht damit rund ${kwh(STROM)} Strom.`,
        },
        {
          typ: "tabelle",
          caption: "Wert des PV-Stroms für die Wärmepumpe (Beispielrechnung, Stand September 2026)",
          kopf: ["PV-Anteil am WP-Strom", "Strom aus PV", "Ersparnis Netzbezug", "entgangene Einspeisung", "Vorteil pro Jahr"],
          zeilen: [0.2, 0.3, 0.45].map((q) => [
            `${Math.round(q * 100)} %`,
            kwh(STROM * q),
            eur(STROM * q * BEZUG),
            eur(STROM * q * MARKT),
            eur(STROM * q * (BEZUG - MARKT)),
          ]),
          hervorheben: 4,
          markierteZeile: 1,
          minBreite: 680,
          fussnote: "Annahmen: Bezugspreis 20 ct/kWh netto (Energie, Netz, Abgaben – eigenen Wert einsetzen), entgangene Einspeisung 6,8 ct/kWh (gerundeter OeMAG-Sommermarktpreis PV 2026). 20 % entsprechen eher reiner Raumheizung, 45 % einem hohen Warmwasser- und Prozessanteil.",
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt: Der größte Hebel liegt nicht in der PV, sondern in der Effizienz der Wärmepumpe. Jede Verbesserung der JAZ senkt den Strombedarf ganzjährig – auch im Winter, wenn die PV wenig hilft. Deshalb lohnt es sich, Vorlauftemperaturen zu senken, hydraulisch abzugleichen und Abwärmequellen zu nutzen, bevor über Speichergrößen diskutiert wird. Den Begriff [Jahresarbeitszahl](/wissen/lexikon#jaz) erklärt das Lexikon.",
        },
      ],
    },
    {
      id: "steuerung",
      titel: "Wie die Wärmepumpe den PV-Überschuss nutzt",
      tocLabel: "Steuerung",
      bloecke: [
        {
          typ: "p",
          text: "**Damit die Wärmepumpe bevorzugt mit Solarstrom läuft, braucht sie ein Signal vom Energiemanagement – über SG-Ready, EEBUS oder eine herstellerspezifische Schnittstelle.** Bei Überschuss erhöht sie die Solltemperatur von Puffer- und Warmwasserspeicher oder heizt das Gebäude leicht vor; bei Mangel fährt sie zurück.",
        },
        {
          typ: "tabelle",
          caption: "Steuerungsarten für Wärmepumpen",
          kopf: ["Schnittstelle", "Funktion", "Bewertung"],
          zeilen: [
            ["SG-Ready", "vier Betriebszustände über zwei Kontakte (Sperre, Normal, verstärkter Betrieb, Zwangsanlauf)", "robust und verbreitet, aber grob"],
            ["EEBUS", "Leistungsvorgaben und Informationsaustausch zwischen EMS und Wärmepumpe", "feiner steuerbar, in den TOR als offenes Protokoll genannt"],
            ["Modbus / Hersteller-API", "direkte Sollwertvorgabe (Temperatur, Leistung)", "sehr flexibel, abhängig vom Hersteller"],
            ["Gebäudeleittechnik (BACnet, KNX)", "Integration in bestehende Leittechnik", "typisch in größeren Gebäuden"],
          ],
          minBreite: 600,
        },
        {
          typ: "p",
          text: "Die Steuerung sollte in ein übergeordnetes [Energiemanagementsystem](/ratgeber/energiemanagementsystem) eingebunden sein, das Wärmepumpe, Speicher und Ladepunkte gemeinsam betrachtet – sonst konkurrieren die Verbraucher um denselben Überschuss oder treiben die Lastspitze. Heizstäbe sollten nur nachrangig laufen: Sie nutzen die Kilowattstunde einfach, die Wärmepumpe drei- bis viermal.",
        },
      ],
    },
    {
      id: "speicher",
      titel: "Thermische Speicher: die günstigste Batterie",
      tocLabel: "Thermische Speicher",
      bloecke: [
        {
          typ: "p",
          text: "**Wärme lässt sich deutlich günstiger speichern als Strom – deshalb sind Puffer, Warmwasserspeicher und die Gebäudemasse die ersten Speicher für PV-Überschüsse.** Ein Batteriespeicher bleibt sinnvoll für Abendlasten und Peak Shaving, aber für die Wärmepumpe ist der thermische Speicher meist die wirtschaftlichere Wahl.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Pufferspeicher", text: "Entkoppelt Wärmeerzeugung und -verbrauch; mittags auf höhere Temperatur laden, abends entnehmen. Größer dimensioniert als für den reinen Taktbetrieb nötig." },
            { titel: "Warmwasserspeicher", text: "In Hotels, Küchen und Melkständen oft der größte Hebel – Warmwasser wird ganzjährig gebraucht und lässt sich gut vorhalten." },
            { titel: "Bauteilaktivierung", text: "Betondecken speichern Wärme und Kälte über Stunden. Die Umweltförderung unterstützt Bauteilaktivierung im betrieblichen Bereich eigens." },
            { titel: "Kältespeicher", text: "Eisspeicher oder Vorkühlung von Kühlzellen verschieben Kälteerzeugung in die Mittagszeit – ideal für Lebensmittelhandel und Landwirtschaft." },
          ],
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Großwärmepumpen und Prozesswärme im Gewerbe",
      tocLabel: "Prozesswärme",
      bloecke: [
        {
          typ: "p",
          text: "**Im Gewerbe sind Wärmepumpen besonders wirtschaftlich, wenn eine Abwärmequelle vorhanden ist und das benötigte Temperaturniveau moderat bleibt.** Abwärme aus Kälteanlagen, Druckluftkompressoren, Abwasser oder Prozesskühlung liefert eine warme Quelle – das verbessert die Jahresarbeitszahl erheblich gegenüber Außenluft im Winter.",
        },
        {
          typ: "tabelle",
          caption: "Temperaturniveaus und Eignung von Wärmepumpen",
          kopf: ["Temperaturniveau", "Typische Anwendungen", "Eignung"],
          zeilen: [
            ["bis ca. 45 °C", "Fußboden- und Flächenheizung, Bauteilaktivierung, Vorwärmung", "sehr gut, hohe JAZ"],
            ["ca. 45–65 °C", "Radiatoren, Warmwasser, Reinigung, Hallenheizung", "gut, JAZ abhängig von Quelle"],
            ["ca. 65–90 °C", "Prozesswärme in Lebensmittel- und Getränkeindustrie, Trocknung", "mit Hochtemperatur-Wärmepumpen möglich, Abwärmequelle wichtig"],
            ["über 90 °C", "Dampf, industrielle Prozesse", "Spezialanlagen, Einzelfallprüfung"],
          ],
          minBreite: 620,
          fussnote: "Grobe Orientierung; die tatsächliche Eignung hängt von Quelle, Kältemittel, Hersteller und Betriebsweise ab.",
        },
        {
          typ: "p",
          text: "In der Landwirtschaft ist die Abwärme der Milchkühlung eine klassische Quelle für Warmwasser im Melkstand. In Hotels lassen sich Kühlung, Wellness und Warmwasser koppeln, in Gemeinden etwa Abwasser-Wärme bei Kläranlagen. Mehr zur Energieversorgung dieser Branchen unter [Landwirtschaft](/landwirtschaft), [Hotellerie & Tourismus](/hotellerie-tourismus) und im Ratgeber [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde).",
        },
      ],
    },
    {
      id: "kaeltemittel",
      titel: "Kältemittel und F-Gase-Verordnung",
      tocLabel: "Kältemittel",
      bloecke: [
        {
          typ: "p",
          text: "**Die EU-F-Gase-Verordnung (EU) 2024/573 schränkt fluorierte Kältemittel mit hohem Treibhauspotenzial schrittweise ein; neue Wärmepumpen setzen daher zunehmend auf natürliche Kältemittel wie Propan (R290), CO₂ (R744) oder Ammoniak.** Für die betriebliche Förderung von Wärmepumpen ab 100 kW verlangt die KPC seit 1. Jänner 2026 ein Kältemittel mit einem GWP unter 750.",
        },
        {
          typ: "liste",
          punkte: [
            "Bei Neuanschaffung auf zukunftssichere Kältemittel achten – Service und Ersatzteile müssen über die gesamte Lebensdauer verfügbar sein.",
            "Brennbare Kältemittel wie Propan erfordern Aufstellungsregeln (Abstände, Belüftung) – bei der Planung berücksichtigen.",
            "Dichtheitskontrollen und Aufzeichnungspflichten für F-Gas-Anlagen im Wartungsplan verankern.",
          ],
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung und Netzanschluss 2026",
      tocLabel: "Förderung & Netz",
      bloecke: [
        {
          typ: "p",
          text: "**Für Betriebe, Gemeinden und Vereine fördert die Umweltförderung im Inland (KPC) Wärmepumpen; für private Haushalte sind die Bundesprogramme Kesseltausch und Sanierungsbonus 2026 ausgeschöpft.** Landesförderungen ergänzen das Angebot – Bedingungen und Budgets ändern sich häufig.",
        },
        {
          typ: "tabelle",
          caption: "Förderstand Wärmepumpen in Österreich, Stand September 2026",
          kopf: ["Programm", "Zielgruppe", "Wesentliche Bedingungen"],
          zeilen: [
            ["Umweltförderung – Wärmepumpe ab 100 kW", "Betriebe, Gemeinden, Vereine, konfessionelle Einrichtungen", "JAZ ≥ 3,8, Kältemittel GWP < 750 (ab 01.01.2026); Antrag vor der ersten verbindlichen Bestellung"],
            ["Umweltförderung – Wärmepumpe unter 100 kW", "Betriebe (überwiegend betriebliche Nutzung)", "Ersatz fossiler Heizung; Antrag nach Umsetzung, spätestens 6 Monate nach Rechnungslegung"],
            ["Kesseltausch / Sanierungsbonus (Sanierungsoffensive)", "Private", "Budget 2026 ausgeschöpft, keine neuen Registrierungen"],
            ["Landesförderungen", "je nach Bundesland", "Programme und Budgets laufend prüfen"],
          ],
          minBreite: 680,
          fussnote: "Quellen: umweltfoerderung.at, sanierungsoffensive.gv.at. Keine Förderzusage; Konditionen vor Bestellung prüfen.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Meldepflicht beim Netzbetreiber",
          text: "Wärmepumpen und Klimageräte mit einer Bemessungsleistung über 3,68 kVA sind laut TOR Verteilernetzanschluss dem Netzbetreiber zu melden. Liegt die Summe aller Heiz- und Klimageräte bei 10 kVA oder mehr, kann der Netzbetreiber den Anschluss bei mangelnder Netzkapazität vorübergehend zur Prüfung aussetzen – ein Energiemanagement, das die vereinbarte Leistung einhält, vermeidet das.",
        },
        {
          typ: "p",
          text: "Die aktuellen Förderprogramme für Ihr Projekt zeigt der [Förder-Check](/foerdercheck); einen Überblick bieten die Seiten [Bundesförderung](/forderungen/bundesfoerderung) und [Landesförderungen](/forderungen/landesforderungen). Was eine Wärmepumpe kostet, beschreibt der Ratgeber [Wärmepumpe: Kosten](/ratgeber/waermepumpe-kosten).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Planungsfehler – und alpine Sonderfälle",
      tocLabel: "Fehler & Alpin",
      bloecke: [
        {
          typ: "p",
          text: "**Die häufigsten Fehler entstehen, wenn PV und Wärmepumpe getrennt geplant werden: zu kleine Speicher, zu hohe Vorlauftemperaturen und eine Steuerung, die den Überschuss mit anderen Verbrauchern nicht teilt.** Das Ergebnis sind schlechte Jahresarbeitszahlen, taktende Geräte und unnötige Lastspitzen im Winter.",
        },
        {
          typ: "liste",
          punkte: [
            "**Wärmepumpe überdimensioniert:** taktet in der Übergangszeit, verschleißt schneller und nutzt PV-Überschüsse schlecht. Die Heizlast sauber berechnen lassen.",
            "**Kein Energiemanagement:** Wärmepumpe, Wallboxen und Speicher laufen jeweils nach eigener Logik – und starten an kalten Morgen gleichzeitig.",
            "**Winterlast unterschätzt:** An kalten, trüben Tagen bezieht die Wärmepumpe ihre volle Leistung aus dem Netz. Das bestimmt die Anschlussleistung und bei Lastprofilmessung den Leistungspreis.",
            "**Alpine Lagen:** In Hotels, Bergbahnen und [Chalets](/chalets) liegen die Module oft wochenlang unter Schnee, dafür scheint an klaren Wintertagen viel Sonne. Steile Modulneigung, Fassaden-PV und hohe Schneelastreserven verbessern den Winterertrag – mehr im Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).",
          ],
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Wärmepumpe und PV gemeinsam planen",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Wärmebedarf nach Monaten und Temperaturniveaus erfassen (Heizung, Warmwasser, Prozess, Kühlung).",
            "Abwärmequellen prüfen: Kälteanlagen, Druckluft, Abwasser, Prozesskühlung.",
            "Vorlauftemperaturen senken, hydraulischen Abgleich durchführen – das verbessert die JAZ ganzjährig.",
            "Thermische Speicher großzügig planen und über SG-Ready oder EEBUS ansteuern.",
            "PV-Anlage und Wärmepumpe mit gemeinsamer Simulation auf Viertelstundenbasis dimensionieren.",
            "Kältemittel mit niedrigem GWP wählen, Förderbedingungen vor Bestellung prüfen.",
            "Meldung beim Netzbetreiber und Energiemanagement für die Leistungsbegrenzung vorsehen.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt plant PV und Wärmepumpe als gemeinsames System und stimmt es mit Speicher und Ladeinfrastruktur ab – mehr auf der Seite [Wärmepumpe](/produkte/warmepumpe) und im Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Kann eine PV-Anlage eine Wärmepumpe im Winter versorgen?",
      a: "Nur zu einem kleinen Teil. Im Winter erzeugt die PV-Anlage wenig, und Schnee kann die Module bedecken. Den Großteil des Winterstroms bezieht die Wärmepumpe aus dem Netz – umso wichtiger ist eine hohe Jahresarbeitszahl.",
    },
    {
      q: "Wie viel Wärmepumpenstrom deckt die PV-Anlage?",
      a: "Das hängt von der Anwendung ab: Bei reiner Raumheizung ist der Anteil gering, bei Warmwasser, Pool, Kühlung und Prozesswärme deutlich höher. Belastbar ist nur eine Simulation mit Erzeugungs- und Wärmebedarfsprofil.",
    },
    {
      q: "Was ist SG-Ready?",
      a: "Eine Schnittstelle, über die ein Energiemanagement die Wärmepumpe mit zwei Schaltkontakten in vier Betriebszustände versetzt – etwa „verstärkter Betrieb“ bei PV-Überschuss. Feiner lässt sich über EEBUS oder Herstellerschnittstellen steuern.",
    },
    {
      q: "Gibt es 2026 eine Förderung für Wärmepumpen?",
      a: "Für Betriebe, Gemeinden und Vereine ja, über die Umweltförderung im Inland – bei Anlagen ab 100 kW mit JAZ von mindestens 3,8 und Kältemittel mit GWP unter 750. Die Bundesprogramme für Private (Kesseltausch, Sanierungsbonus) sind 2026 ausgeschöpft; Landesförderungen prüfen.",
    },
    {
      q: "Muss ich eine Wärmepumpe beim Netzbetreiber melden?",
      a: "Ja, wenn ihre Bemessungsleistung über 3,68 kVA liegt. Die Meldung übernimmt der Elektrotechniker. Ab 10 kVA Summenleistung kann der Netzbetreiber den Anschluss zur Prüfung aussetzen, sofern kein Lastmanagement die vereinbarte Leistung sicherstellt.",
    },
    {
      q: "Heizstab oder Wärmepumpe für den PV-Überschuss?",
      a: "Die Wärmepumpe macht aus einer Kilowattstunde Strom drei bis vier Kilowattstunden Wärme, der Heizstab nur eine. Heizstäbe sind daher nur als Ergänzung sinnvoll, wenn die Wärmepumpe das benötigte Temperaturniveau nicht erreicht oder bereits voll läuft.",
    },
    {
      q: "Brauche ich zusätzlich einen Batteriespeicher?",
      a: "Nicht zwingend. Für die Wärmepumpe sind thermische Speicher meist günstiger als eine Batterie. Ein Batteriespeicher lohnt sich eher, wenn er zusätzlich Abendlasten deckt, Lastspitzen kappt oder Notstrom liefern soll.",
    },
    {
      q: "Welche Jahresarbeitszahl ist im Betrieb realistisch?",
      a: "Das hängt von Wärmequelle und Temperaturniveau ab. Mit Abwärme oder Erdreich und niedrigen Vorlauftemperaturen sind hohe Werte erreichbar, mit Außenluft und hohen Temperaturen niedrigere. Für die betriebliche Förderung ab 100 kW verlangt die KPC seit 2026 eine JAZ von mindestens 3,8.",
    },
  ],

  passend: [
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe", text: "Wärmepumpen für Gewerbe und Gebäude." },
    { href: "/ratgeber/waermepumpe-kosten", titel: "Wärmepumpe: Kosten", text: "Investition, Betrieb und Förderung." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Wärmepumpe, Speicher und PV steuern." },
    { href: "/ratgeber/eigenverbrauch-erhoehen", titel: "Eigenverbrauch erhöhen", text: "Mehr Solarstrom selbst nutzen." },
  ],

  quellen: [
    { titel: "Umweltförderung (KPC) – Wärmepumpe ab 100 kW (Anforderungen ab 01.01.2026)", url: "https://www.umweltfoerderung.at/betriebe/waermepumpe-100-kw-1/unterkategorie-waerme-aus-erneuerbaren-ressourcen", stand: "09/2026" },
    { titel: "Umweltförderung (KPC) – Wärmepumpe unter 100 kW", url: "https://www.umweltfoerderung.at/betriebe/waermepumpe-100-kw/unterkategorie-waerme-aus-erneuerbaren-ressourcen", stand: "09/2026" },
    { titel: "Sanierungsoffensive – Kesseltausch und Sanierungsbonus 2026 (Status)", url: "https://www.sanierungsoffensive.gv.at/", stand: "09/2026" },
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "EUR-Lex – Verordnung (EU) 2024/573 über fluorierte Treibhausgase", url: "https://eur-lex.europa.eu/eli/reg/2024/573/oj", stand: "09/2026" },
    { titel: "OeMAG – Marktpreise 2026", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wärme und Solarstrom kombinieren?", text: "Wärmepumpe, PV und Speicher als System planen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Wärmepumpe und PV als ein System – geplant nach Ihrem Bedarf.",
    text: "Ökovolt aus Ostermiething (OÖ) plant Photovoltaik, Wärmepumpe, Speicher und Energiemanagement für Betriebe, Hotels, Landwirtschaft und Gemeinden in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Wärmepumpe", href: "/produkte/warmepumpe" },
  },
};

export default artikel;
