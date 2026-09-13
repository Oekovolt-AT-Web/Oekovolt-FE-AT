// Ratgeber: Solarmodule im Vergleich – Zelltechnik, Aufbau, Garantien
// Recherchestand September 2026. Wirkungsgrad-, Degradations- und Kostenanteile: Fraunhofer ISE
// (Fassung 20.08.2026); Technologietrend: ITRPV 17. Ausgabe; Großhandelspreise: pvXchange.

import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const ANLAGE_10 = 10 * preisProKwp(10);
// Fläche für 10 kWp bei gegebenem Modulwirkungsgrad (1.000 W/m² STC), nur Modulfläche
const flaeche = (eta) => Math.round(10000 / (1000 * eta));

const artikel = {
  slug: "solarmodule-vergleich",
  title: "Solarmodule im Vergleich 2026: TOPCon, HJT, Back Contact & Co.",
  seoTitle: "Solarmodule Vergleich 2026: Technik & Garantien | Ökovolt",
  kurzTitel: "Solarmodule im Vergleich",
  description:
    "Solarmodule im Vergleich: TOPCon, Heterojunction, Back Contact, Glas-Glas und bifazial – Wirkungsgrad, Temperaturverhalten, Garantien und Qualitätsmerkmale 2026.",
  excerpt:
    "Welche Zelltechnik lohnt sich, was bringt Glas-Glas, und warum der höchste Wirkungsgrad nicht automatisch den besten Ertrag bedeutet. Der Vergleich mit Tabellen und Checkliste.",
  hauptKeyword: "solarmodule vergleich",
  keywords: [
    "Solarmodule Vergleich",
    "PV-Module Vergleich 2026",
    "TOPCon oder Heterojunction",
    "Glas-Glas-Module",
    "Bifaziale Solarmodule",
    "Solarmodul Wirkungsgrad",
    "Solarmodule Garantie",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Jobs/jobs2.jpg",
  bildAlt: "Techniker prüft ein monokristallines Solarmodul auf einem Dach",
  badge: { wert: "knapp 23 %", text: "mittlerer Wirkungsgrad neuer Module 2025 (Fraunhofer ISE)" },

  kurzFazit: [
    "**Standard 2026 sind monokristalline n-Typ-Module mit TOPCon-Zellen** und Wirkungsgraden um 22 bis 23,5 %. PERC verschwindet vom Markt, Heterojunction (HJT) und Back Contact (BC) sind die Premiumklasse.",
    "**Ein höherer Wirkungsgrad bringt mehr kWp auf dieselbe Fläche – aber kaum mehr kWh je kWp.** Er lohnt sich vor allem, wenn das Dach knapp ist.",
    "**Glas-Glas-Module** sind robuster, altern langsamer und haben oft 30 Jahre Garantie. Bifaziale Module bringen auf dem geneigten Hausdach nur wenig Zusatzertrag.",
    "Module machen laut Fraunhofer ISE nur noch **rund ein Fünftel der Investition** aus. Qualität, Garantiebedingungen und saubere Montage sind wichtiger als ein paar Watt mehr.",
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Welche Solarmodule sind 2026 die richtigen?",
      tocLabel: "Kurzantwort",
      bloecke: [
        {
          typ: "p",
          text: "**Für die meisten Hausdächer sind monokristalline n-Typ-Module mit TOPCon-Zellen, Halbzellen-Aufbau und 25 bis 30 Jahren Garantie die ausgewogenste Wahl.** Sie sind effizient, bewährt und am Markt breit verfügbar. Heterojunction- und Back-Contact-Module holen auf kleinen oder heißen Dächern noch etwas mehr heraus, kosten aber mehr. Ältere Technik wie polykristalline oder PERC-Module spielt bei Neuanlagen kaum noch eine Rolle.",
        },
        {
          typ: "p",
          text: "Der mittlere Wirkungsgrad neu produzierter Siliziummodule ist laut Fraunhofer ISE um etwa 0,5 Prozentpunkte pro Jahr gestiegen und lag 2025 bei knapp 23 %. Ein Quadratmeter Modul liefert damit rund 230 Watt Nennleistung, Spitzenmodule etwa 10 % mehr. Die 17. Ausgabe der Technologie-Roadmap ITRPV bestätigt: TOPCon dominiert und verdrängt PERC, rund 82 % der Wafer sind inzwischen n-Typ.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Monokristallin ist heute Standard",
          text: "Die Unterscheidung „monokristallin oder polykristallin“ stammt aus früheren Jahren. Praktisch alle aktuellen Hausdachmodule sind [monokristallin](/wissen/lexikon#monokristallin). Entscheidend ist heute die Zellarchitektur – also PERC, TOPCon, Heterojunction oder Back Contact.",
        },
      ],
    },
    {
      id: "zelltechnik",
      titel: "Zelltechnologien im Vergleich: PERC, TOPCon, HJT und Back Contact",
      tocLabel: "Zelltechnologien",
      bloecke: [
        {
          typ: "p",
          text: "**Die vier Zelltechnologien unterscheiden sich vor allem in Wirkungsgrad, Temperaturverhalten und Rückseitennutzung.** Die Tabelle zeigt typische Datenblattwerte aktueller Serienmodule. Einzelne Produkte können abweichen – maßgeblich ist immer das Datenblatt des konkreten Moduls.",
        },
        {
          typ: "tabelle",
          caption: "Solarzellen-Technologien im Vergleich, typische Werte von Serienmodulen, Stand September 2026",
          kopf: ["", "PERC (p-Typ)", "TOPCon (n-Typ)", "Heterojunction (HJT)", "Back Contact (BC)"],
          zeilen: [
            ["Modulwirkungsgrad", "ca. 20–21,5 %", "ca. 22–23,8 %", "ca. 22,5–24 %", "ca. 23–25 %"],
            ["Temperaturkoeffizient Pmax", "ca. −0,34 bis −0,37 %/°C", "ca. −0,29 bis −0,32 %/°C", "ca. −0,24 bis −0,26 %/°C", "ca. −0,26 bis −0,29 %/°C"],
            ["Bifazialität (Rückseite)", "ca. 70 %", "ca. 80–85 %", "ca. 85–95 %", "meist gering bis mittel"],
            ["Lichtinduzierte Degradation", "ausgeprägter", "gering", "sehr gering", "gering"],
            ["Marktbedeutung", "auslaufend", "**Standard**", "Premium, wachsend", "Premium, wachsend"],
            ["Besonders geeignet für", "Bestandsergänzung", "fast alle Dächer", "heiße Standorte, Flachdach bifazial", "kleine Dächer, Optik (keine Kontaktfinger)"],
          ],
          hervorheben: 2,
          minBreite: 760,
          fussnote: "Spannen aus Herstellerdatenblättern und Fachportalen; Rekordwerte einzelner Hersteller liegen darüber. Der Temperaturkoeffizient gibt an, wie viel Leistung je Grad über 25 °C Zelltemperatur verloren geht.",
        },
        { typ: "h3", text: "TOPCon: der neue Standard" },
        {
          typ: "p",
          text: "[TOPCon](/wissen/lexikon#topcon) (Tunnel Oxide Passivated Contact) ergänzt die Zelle um eine hauchdünne Oxidschicht, die Ladungsverluste an den Kontakten verringert. Die Technik lässt sich in bestehenden Fabriken umrüsten und ist deshalb schnell zum Massenprodukt geworden. Gegenüber PERC gewinnen Sie rund einen bis zwei Prozentpunkte Wirkungsgrad, ein besseres Temperaturverhalten und eine geringere Anfangsdegradation.",
        },
        { typ: "h3", text: "Heterojunction: stark bei Hitze" },
        {
          typ: "p",
          text: "[Heterojunction-Zellen](/wissen/lexikon#heterojunction) kombinieren kristallines Silizium mit dünnen amorphen Schichten. Ihr Vorteil ist der sehr niedrige Temperaturkoeffizient: An einem heißen Sommertag mit 65 °C Zelltemperatur verliert ein HJT-Modul rund 10 % Leistung, ein PERC-Modul etwa 14 %. Auf gut hinterlüfteten Schrägdächern in Deutschland macht das übers Jahr meist nur wenige Prozent aus, bei Indach-Lösungen oder flach aufgelegten Modulen etwas mehr.",
        },
        { typ: "h3", text: "Back Contact: alle Kontakte auf der Rückseite" },
        {
          typ: "p",
          text: "Bei Back-Contact-Zellen liegen alle elektrischen Kontakte auf der Rückseite. Die Vorderseite bleibt frei von Kontaktfingern – das steigert den Wirkungsgrad und sorgt für eine besonders gleichmäßige, dunkle Optik. BC-Module sind die Wahl, wenn auf wenig Fläche möglichst viel Leistung unterkommen soll oder die Optik eine große Rolle spielt.",
        },
      ],
    },
    {
      id: "wirkungsgrad",
      titel: "Wie wichtig ist der Wirkungsgrad wirklich?",
      tocLabel: "Wirkungsgrad",
      bloecke: [
        {
          typ: "p",
          text: "**Der Modulwirkungsgrad bestimmt, wie viel Leistung auf einen Quadratmeter passt – nicht, wie viele Kilowattstunden ein Kilowatt-Peak erzeugt.** Ein 10-kWp-Generator aus 21-%-Modulen liefert an derselben Stelle nahezu den gleichen Jahresertrag wie einer aus 24-%-Modulen; er braucht nur mehr Fläche. Unterschiede im [spezifischen Ertrag](/wissen/lexikon#spezifischer-ertrag) entstehen vor allem durch Temperaturverhalten, Schwachlichtverhalten und Degradation – und liegen meist im niedrigen einstelligen Prozentbereich.",
        },
        {
          typ: "tabelle",
          caption: "Benötigte Modulfläche für 10 kWp nach Wirkungsgrad",
          kopf: ["Modulwirkungsgrad", "Modulfläche für 10 kWp", "Leistung je m²", "Typische Technik"],
          zeilen: [
            ["20 %", `ca. ${flaeche(0.2)} m²`, "200 W", "ältere PERC-Module"],
            ["22 %", `ca. ${flaeche(0.22)} m²`, "220 W", "TOPCon Einstieg"],
            ["23 %", `ca. ${flaeche(0.23)} m²`, "230 W", "TOPCon aktuell (Marktmittel)"],
            ["24 %", `ca. ${flaeche(0.24)} m²`, "240 W", "HJT / Back Contact"],
            ["25 %", `ca. ${flaeche(0.25)} m²`, "250 W", "Spitzenmodule"],
          ],
          markierteZeile: 2,
          fussnote: `Reine Modulfläche bei Standard-Testbedingungen. Auf dem Dach kommen Randabstände, Klemmbereiche und Fugen hinzu; unser Solarrechner rechnet deshalb mit rund ${ANNAHMEN.qmProKwp} m² Dachfläche je kWp.`,
        },
        {
          typ: "p",
          text: "Die Faustregel daraus: Ist Ihr Dach groß genug für die geplante Leistung, wählen Sie das Modul mit dem besten Verhältnis aus Preis, Garantie und Qualität. Ist das Dach der Engpass – etwa bei einem Reihenhaus, vielen Dachfenstern oder wenn später eine [Wärmepumpe](/produkte/warmepumpe) und ein E-Auto dazukommen – zahlt sich ein Hochleistungsmodul aus. Wie viel Leistung Sie brauchen, zeigt der Ratgeber [PV-Anlage: Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "aufbau",
      titel: "Glas-Folie oder Glas-Glas, bifazial oder Full Black?",
      tocLabel: "Aufbau & Bauform",
      bloecke: [
        {
          typ: "p",
          text: "**Glas-Glas-Module schützen die Zellen beidseitig mit Glas und gelten als besonders langlebig; Glas-Folie-Module sind leichter und etwas günstiger.** Die Wahl hängt vom Dach, von der Statik und von Ihren Prioritäten ab.",
        },
        {
          typ: "tabelle",
          caption: "Modulbauformen im Vergleich",
          kopf: ["Bauform", "Vorteile", "Nachteile", "Sinnvoll für"],
          zeilen: [
            ["**Glas-Folie**", "Leichter, günstiger, große Auswahl", "Rückseitenfolie altert, Mikrorisse eher möglich", "Standard-Schrägdach mit knapper Statik"],
            ["**Glas-Glas**", "Robust gegen Feuchte und mechanische Last, geringere Degradation, oft 30 Jahre Garantie", "Schwerer, etwas teurer", "Die meisten Neuanlagen, Landwirtschaft, schneereiche Regionen"],
            ["**Bifazial (Glas-Glas)**", "Nutzt Licht von der Rückseite", "Mehrertrag auf dem Schrägdach gering", "Aufgeständertes Flachdach, Carport, Freifläche, Fassade"],
            ["**Full Black**", "Einheitliche, dunkle Optik", "Etwas wärmer, meist minimal weniger Leistung, Aufpreis", "Sichtbare Dachflächen, Neubau, Gestaltungssatzungen"],
          ],
          minBreite: 700,
        },
        {
          typ: "p",
          text: "Ein [Glas-Glas-Modul](/wissen/lexikon#glas-glas-modul) altert laut Fraunhofer ISE langsamer und schneidet in der Ökobilanz besser ab, weil oft auf den Aluminiumrahmen verzichtet werden kann. [Bifaziale Module](/wissen/lexikon#bifazial) entfalten ihren Vorteil nur, wenn Licht die Rückseite erreicht – auf einem dicht belegten Satteldach mit wenigen Zentimetern Abstand zur Dachhaut ist das kaum der Fall. Auf einem aufgeständerten [Flachdach](/ratgeber/photovoltaik-flachdach) mit hellem Untergrund oder unter einem [Solarcarport](/ratgeber/solarcarport) sieht das anders aus.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Nicht zu groß wählen",
          text: "Moderne Hausdachmodule haben meist 1,7 bis 2,0 m² Fläche und rund 430 bis 500 Wp. Noch größere Formate für Solarparks sind schwer zu handhaben, belasten die Unterkonstruktion stärker und passen oft schlecht in Dachflächen mit Fenstern und Gauben.",
        },
      ],
    },
    {
      id: "garantie",
      titel: "Welche Garantien sollten Solarmodule haben?",
      tocLabel: "Garantien & Lebensdauer",
      bloecke: [
        {
          typ: "p",
          text: "**Achten Sie auf zwei getrennte Zusagen: eine Produktgarantie gegen Material- und Verarbeitungsfehler und eine Leistungsgarantie, die eine Mindestleistung nach 25 bis 30 Jahren zusichert.** Üblich sind laut Fraunhofer ISE Garantien für einen maximalen Leistungsverlust von 10 bis 15 % über 25 bis 30 Jahre. Bei qualitätsgesicherten Anlagen hat das ISE eine mittlere Degradation der Modulleistung von nur rund 0,15 % pro Jahr gemessen.",
        },
        {
          typ: "tabelle",
          caption: "Typische Garantiebedingungen für Solarmodule, Stand 2026",
          kopf: ["Garantieart", "Glas-Folie", "Glas-Glas", "Worauf achten"],
          zeilen: [
            ["Produktgarantie", "12–25 Jahre", "25–30 Jahre", "Deckt sie Demontage, Transport und Neumontage ab?"],
            ["Leistungsgarantie", "25–30 Jahre", "30 Jahre", "Mindestleistung am Ende, z. B. 85–89 %"],
            ["Degradation 1. Jahr", "ca. 1–2 %", "ca. 1 %", "Angabe im Datenblatt prüfen"],
            ["Degradation danach", "ca. 0,4–0,55 %/Jahr", "ca. 0,35–0,4 %/Jahr", "linear garantiert?"],
          ],
          minBreite: 640,
          fussnote: "Typische Werte aus Herstellerdatenblättern. Garantien sind nur so viel wert wie der Hersteller, der sie gibt – eine europäische Niederlassung oder eine Garantieversicherung erleichtern die Durchsetzung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Kleingedrucktes lesen",
          text: "Die Verbraucherzentrale rät, Garantiebedingungen genau zu prüfen: Teilweise müssen Komponenten beim Hersteller registriert werden, und viele Garantien ersetzen nur das Modul, nicht aber die Arbeitskosten für Gerüst und Montage. Unser Solarrechner rechnet konservativ mit 0,5 % Leistungsverlust pro Jahr.",
        },
        {
          typ: "p",
          text: "Die tatsächliche Lebensdauer guter Module liegt bei 25 bis 30 Jahren und oft darüber. Wie sich [Degradation](/wissen/lexikon#degradation) und Lebensdauer auf die Wirtschaftlichkeit auswirken, rechnet der Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich) durch.",
        },
      ],
    },
    {
      id: "qualitaet",
      titel: "Woran erkennen Sie gute Solarmodule?",
      tocLabel: "Qualitätsmerkmale",
      bloecke: [
        {
          typ: "p",
          text: "**Gute Module erkennen Sie an geprüften Zertifikaten, hohen Lastwerten, transparenten Datenblättern und einem Hersteller, der seine Garantie auch in 20 Jahren noch erfüllen kann.** Die folgende Checkliste hilft beim Vergleich von Angeboten.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Zertifizierung nach IEC 61215 und IEC 61730** (Bauarteignung und Sicherheit) durch ein unabhängiges Prüfinstitut.",
            "**Mechanische Belastbarkeit:** Drucklast (Schnee) meist 5.400 Pa, Soglast (Wind) mindestens 2.400 Pa – in Schneelastzone 3 und im Voralpenland besonders wichtig.",
            "**Hagelwiderstand:** Der IEC-Grundtest nutzt 25-mm-Hagelkörner. Für hagelgefährdete Regionen geben die Hagelwiderstandsklassen HW 1–5 des Hagelregisters zusätzliche Sicherheit.",
            "**PID-Resistenz** (potenzialinduzierte Degradation) und bei landwirtschaftlichen Gebäuden **Ammoniakbeständigkeit** nach IEC 62716.",
            "**Positive Leistungstoleranz** (z. B. 0/+5 W): Das Modul liefert mindestens die angegebene Leistung.",
            "**Vollständige Datenblätter** mit Temperaturkoeffizient, Degradation und Garantiebedingungen in deutscher Sprache.",
            "**Kompatibilität** mit Wechselrichter, Montagesystem und Klemmbereichen – freigegeben vom Hersteller des Montagesystems.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "„Tier 1“ ist kein Qualitätssiegel",
          text: "Die oft genannte Tier-1-Liste von BloombergNEF bewertet, ob Hersteller bei großen Projekten von Banken finanziert werden. Sie sagt nichts direkt über die Qualität eines einzelnen Moduls aus. Zertifikate, Datenblatt und Garantiebedingungen sind aussagekräftiger.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Herkunft und Lieferkette",
          text: "Ab dem 14. Dezember 2027 gilt die EU-Zwangsarbeitsverordnung (EU) 2024/3015: Produkte, die ganz oder teilweise in Zwangsarbeit hergestellt wurden, dürfen dann nicht mehr in der EU in Verkehr gebracht werden. Seriöse Hersteller legen ihre Lieferkette schon heute offen – fragen Sie danach.",
        },
      ],
    },
    {
      id: "preis",
      titel: "Was kosten Solarmodule – und wie viel macht die Modulwahl aus?",
      tocLabel: "Preise",
      bloecke: [
        {
          typ: "p",
          text: `**Solarmodule kosteten im Großhandel laut pvXchange-Index im Juli 2026 rund 13,5 Cent je Watt (Mainstream) bis 15 Cent je Watt (Hochleistungsmodule).** Nach mehr als einem Jahrzehnt sinkender Preise stiegen sie im ersten Halbjahr 2026 um gut ein Viertel, im Sommer kam die Entwicklung weitgehend zum Stillstand. Für 10 kWp entspricht das einem Großhandelswert von grob 1.350 bis 1.500 Euro – bei einer schlüsselfertigen Anlage für rund ${eur(ANLAGE_10)} (Orientierungswert unseres Solarrechners).`,
        },
        {
          typ: "kennzahl",
          wert: "≈ 1/5",
          titel: "Anteil der Module an der Investition",
          text: "Laut Fraunhofer ISE sind die PV-Module nur noch für etwa ein Fünftel der Investitionskosten verantwortlich; bei kleinen Dachanlagen ist der Anteil eher geringer.",
        },
        {
          typ: "p",
          text: "Das relativiert den Aufpreis für Premiumtechnik: 2 Cent mehr je Watt kosten bei 10 kWp rund 200 Euro. Gerüst, Montage, Wechselrichter, Zählerschrank und Anmeldung bestimmen den Endpreis stärker. Welche Positionen ein Angebot enthalten sollte, zeigen die Ratgeber [Solaranlage Kosten](/ratgeber/solaranlage-kosten) und [Photovoltaik-Angebot vergleichen](/ratgeber/photovoltaik-angebot-vergleichen).",
        },
      ],
    },
    {
      id: "empfehlung",
      titel: "Welches Modul passt zu welchem Dach?",
      tocLabel: "Empfehlung",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Normales Schrägdach, genug Fläche", text: "TOPCon-Module mit Halbzellen, gern als Glas-Glas-Variante mit 30 Jahren Garantie. Das beste Verhältnis aus Preis und Langlebigkeit." },
            { titel: "Kleines Dach oder viele Aufbauten", text: "Back-Contact- oder HJT-Module mit 23,5 % Wirkungsgrad und mehr. Jeder Quadratmeter zählt – mehr kWp auf gleicher Fläche." },
            { titel: "Flachdach, Carport, Fassade", text: "Bifaziale Glas-Glas-Module. Aufgeständert oder mit Abstand zum Untergrund nutzen sie Licht von der Rückseite." },
            { titel: "Stall, Scheune, Schneeregion", text: "Glas-Glas mit hoher Last- und Hagelklasse, Ammoniakbeständigkeit nach IEC 62716 und passender Statik." },
          ],
        },
        {
          typ: "p",
          text: "Genauso wichtig wie das Modul ist die Planung drumherum: ein passender [Wechselrichter](/ratgeber/wechselrichter-photovoltaik), ein geprüftes Montagesystem und die Berücksichtigung von [Verschattung](/wissen/lexikon#verschattung). Eine Übersicht über komplette Anlagen finden Sie auf der Seite [Photovoltaikanlage](/produkte/photovoltaikanlage).",
        },
        { typ: "tool", href: "/solarrechner", titel: "Was bringt Ihr Dach?", text: "Ertrag, Autarkie und Amortisation mit Ihrer Anlagengröße und Ausrichtung berechnen.", label: "Zum Solarrechner" },
      ],
    },
  ],

  faq: [
    { q: "Welche Solarmodule sind 2026 die besten?", a: "Das beste Modul hängt vom Dach ab. Für die meisten Häuser sind TOPCon-Glas-Glas-Module mit 30 Jahren Garantie die ausgewogenste Wahl. Bei wenig Dachfläche lohnen sich Back-Contact- oder HJT-Module mit höherem Wirkungsgrad." },
    { q: "Was ist besser: TOPCon oder Heterojunction?", a: "HJT-Module haben einen etwas niedrigeren Temperaturkoeffizienten und eine höhere Bifazialität, TOPCon-Module sind günstiger und breiter verfügbar. Auf einem gut hinterlüfteten Schrägdach in Deutschland liegt der Ertragsunterschied meist nur bei wenigen Prozent." },
    { q: "Lohnen sich Glas-Glas-Module?", a: "Meist ja. Sie sind robuster, altern langsamer und haben häufig 30 Jahre Produkt- und Leistungsgarantie. Nachteil ist das höhere Gewicht, das die Statik des Dachs tragen muss." },
    { q: "Bringen bifaziale Module auf dem Schrägdach mehr Ertrag?", a: "Nur wenig. Auf einem Schrägdach erreicht kaum Licht die Rückseite. Bifaziale Module lohnen sich vor allem auf aufgeständerten Flachdächern, Carports oder Freiflächen." },
    { q: "Wie lange halten Solarmodule?", a: "Hochwertige Module sind auf 25 bis 30 Jahre und mehr ausgelegt. Hersteller garantieren meist, dass nach 25 bis 30 Jahren noch 85 bis 90 % der Nennleistung erreicht werden; gemessene Degradationsraten liegen oft darunter." },
    { q: "Liefern schwarze Module (Full Black) weniger Strom?", a: "Geringfügig. Full-Black-Module erwärmen sich etwas stärker und haben je nach Bauart minimal weniger Leistung. Der Unterschied ist klein und oft eine Frage der Optik und des Preises." },
    { q: "Was bedeutet Tier 1 bei Solarmodulen?", a: "Die Tier-1-Liste von BloombergNEF zeigt, welche Hersteller bei großen Projekten bankfinanziert wurden. Sie ist ein Hinweis auf Marktgröße, aber kein Qualitätsprüfsiegel für einzelne Module." },
  ],

  passend: [
    { href: "/ratgeber/wechselrichter-photovoltaik", titel: "Wechselrichter für Photovoltaik", text: "String, Hybrid oder Mikro – und wie groß er sein muss." },
    { href: "/ratgeber/photovoltaik-ertrag-pro-kwp", titel: "Photovoltaik-Ertrag pro kWp", text: "Wie viel Strom ein kWp in Ihrer Region erzeugt." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und was im Komplettpreis steckt." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Module und Anlage passend zum Dach planen lassen." },
  ],

  quellen: [
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland (Fassung 20.08.2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "08/2026" },
    { titel: "Solarserver – ITRPV-Roadmap (17. Ausgabe): TOPCon marktführende Technologie", url: "https://www.solarserver.de/2026/06/24/itrpv-roadmap-topcon-marktfuehrende-photovoltaik-technologie", stand: "06/2026" },
    { titel: "pv magazine – pvXchange-Modulpreisindex", url: "https://www.pv-magazine.de/modulpreisindex/", stand: "08/2026" },
    { titel: "Verbraucherzentrale – Photovoltaik: Garantie- und Versicherungsbedingungen genau lesen", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-garantie-und-versicherungsbedingungen-genau-lesen-6700", stand: "09/2026" },
    { titel: "Hagelregister – Neuregelung für den Eintrag von PV-Modulen", url: "https://www.hagelregister.ch/neuregelung-eintrag-pv-module.html", stand: "10/2025" },
    { titel: "EUR-Lex – Verordnung (EU) 2024/3015 über das Verbot von Produkten aus Zwangsarbeit", url: "https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX%3A32024R3015", stand: "12/2024" },
  ],

  seitenCta: { titel: "Welches Modul passt aufs Dach?", text: "Wir planen Module, Wechselrichter und Montage passend zu Fläche, Statik und Budget.", href: "/angebot", label: "Anlage planen lassen" },
  cta: {
    title: "Gute Module brauchen eine gute Planung.",
    text: "Wir prüfen Dachfläche, Statik und Verschattung vor Ort und empfehlen Module, die zu Ihrem Dach und Ihrem Budget passen – mit nachvollziehbaren Datenblättern und Garantiebedingungen.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Ertrag berechnen", href: "/solarrechner" },
  },
};

export default artikel;
