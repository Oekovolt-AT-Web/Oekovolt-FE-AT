// Ratgeber: Wechselrichter für Photovoltaik – Arten, Auslegung, Lebensdauer, Kosten
// Recherchestand September 2026. Rechtsgrundlagen: § 9 EEG (Steuerbarkeit, 60-%-Begrenzung),
// VDE-AR-N 4105 (Netzanschluss). Wirkungsgrad-/Effizienzwerte: Fraunhofer ISE, HTW Berlin.

import { ANNAHMEN } from "@/data/solarrechner";

const artikel = {
  slug: "wechselrichter-photovoltaik",
  title: "Wechselrichter für Photovoltaik: Arten, Auslegung und Kosten 2026",
  seoTitle: "Wechselrichter Photovoltaik 2026: Arten & Kosten | Ökovolt",
  kurzTitel: "Wechselrichter",
  description:
    "Wechselrichter für Photovoltaik: String, Hybrid oder Mikro? Auslegung, DC/AC-Verhältnis, 60-%-Regel, Lebensdauer und Kosten 2026 – verständlich erklärt.",
  excerpt:
    "Der Wechselrichter ist das Herz jeder PV-Anlage – und das Bauteil, das am ehesten getauscht werden muss. Welche Bauart zu Ihrem Dach passt, wie groß er sein sollte und womit Sie bei Kosten und Lebensdauer rechnen können.",
  hauptKeyword: "wechselrichter photovoltaik",
  keywords: [
    "Wechselrichter Photovoltaik",
    "Hybridwechselrichter",
    "Wechselrichter Größe berechnen",
    "Wechselrichter Kosten",
    "Wechselrichter Lebensdauer",
    "Mikrowechselrichter oder Stringwechselrichter",
    "Wechselrichter tauschen",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg",
  bildAlt: "Wandmontierter Wechselrichter über einem Batteriespeicher in einem Technikraum",
  badge: { wert: "~98 %", text: "Wirkungsgrad neuer PV-Wechselrichter (Fraunhofer ISE)" },

  kurzFazit: [
    "**Der Wechselrichter wandelt den Gleichstrom der Module in netzfähigen Wechselstrom** – und steuert dabei Ertrag, Netzsicherheit, Speicher und Einspeisebegrenzung.",
    "Für die meisten Einfamilienhäuser passt ein **dreiphasiger String- oder Hybridwechselrichter**. Mikrowechselrichter oder Optimierer lohnen sich vor allem bei Teilverschattung und vielen kleinen Dachflächen.",
    "Üblich ist ein Wechselrichter mit **etwas weniger AC-Leistung als Modulleistung** (DC/AC-Verhältnis rund 1,0 bis 1,3). Die Verluste durch Kappung sind dabei meist gering.",
    "Rechnen Sie mit **10 bis 15 Jahren Lebensdauer** und einem Austausch während der Betriebszeit. Ein Ersatzgerät für ein Einfamilienhaus kostet inklusive Montage meist zwischen 1.500 und 3.000 Euro.",
    "Seit dem Solarspitzengesetz muss der Wechselrichter die **60-%-Begrenzung am Netzanschlusspunkt** umsetzen können, solange kein Smart Meter mit Steuerbox eingebaut ist.",
  ],

  abschnitte: [
    {
      id: "aufgabe",
      titel: "Was macht ein Wechselrichter in der PV-Anlage?",
      tocLabel: "Aufgaben",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Wechselrichter wandelt den Gleichstrom (DC) der Solarmodule in Wechselstrom (AC) mit 230 bzw. 400 Volt und 50 Hertz um, damit Sie ihn im Haus nutzen oder ins Netz einspeisen können.** Neue Geräte schaffen das laut Fraunhofer ISE mit einem Wirkungsgrad um 98 Prozent. Die Umwandlung ist aber nur eine von mehreren Aufgaben – der [Wechselrichter](/wissen/lexikon#wechselrichter) ist die Steuerzentrale Ihrer [Photovoltaikanlage](/produkte/photovoltaikanlage).",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "MPP-Tracking", text: "Module liefern nur bei einer bestimmten Kombination aus Spannung und Strom ihre maximale Leistung. Der [MPP-Tracker](/wissen/lexikon#mpp-tracker) sucht diesen Punkt ständig neu – bei Wolken, Wärme und Verschattung." },
            { titel: "Netz- und Anlagenschutz", text: "Der Wechselrichter überwacht Spannung und Frequenz und trennt die Anlage bei Störungen vom Netz. Die Anforderungen regelt die [VDE-AR-N 4105](/wissen/lexikon#vde-ar-n-4105)." },
            { titel: "Steuerung & Begrenzung", text: "Er setzt Einspeisebegrenzungen um, reagiert auf Steuersignale des Netzbetreibers (§ 9 EEG) und lädt beim Hybridgerät die Batterie." },
            { titel: "Monitoring", text: "Über App oder Portal sehen Sie Erzeugung, Verbrauch und Fehlermeldungen. Ein Ertragseinbruch fällt so nach Tagen auf – nicht erst bei der Jahresabrechnung." },
          ],
        },
        {
          typ: "p",
          text: "Viele Geräte bringen zusätzlich eine **Lichtbogenerkennung** mit, die den Gleichstrom bei fehlerhaften Steckverbindungen unterbricht, sowie Schnittstellen für Energiemanagement, Wallbox und Wärmepumpe. Welche Funktionen Sie brauchen, hängt davon ab, was in den nächsten Jahren im Haus dazukommen soll.",
        },
      ],
    },
    {
      id: "arten",
      titel: "Welche Wechselrichter-Arten gibt es?",
      tocLabel: "Arten im Vergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Für Hausdächer sind vier Bauarten relevant: String-, Hybrid- und Mikrowechselrichter sowie Stringwechselrichter mit Leistungsoptimierern.** Dazu kommen Batteriewechselrichter, mit denen sich ein Speicher an eine bestehende Anlage anschließen lässt. Die Tabelle zeigt die Unterschiede.",
        },
        {
          typ: "tabelle",
          caption: "Wechselrichter-Arten für Einfamilienhäuser im Vergleich, Stand September 2026",
          kopf: ["Bauart", "Prinzip", "Passt gut, wenn …", "Grenzen"],
          zeilen: [
            ["**Stringwechselrichter**", "Ein zentrales Gerät, Module in Reihe (Strings) an 1–3 MPP-Trackern", "Dachflächen unverschattet, kein Speicher geplant", "Speicher nur über zusätzlichen Batteriewechselrichter"],
            ["**Hybridwechselrichter**", "Stringwechselrichter mit Batterieanschluss auf der DC-Seite", "Speicher jetzt oder in wenigen Jahren", "Nur mit freigegebenen Batterien kombinierbar"],
            ["**String + Optimierer**", "Zentrales Gerät, an jedem Modul ein DC/DC-Wandler", "Teilverschattung, Module in mehreren Richtungen", "Mehr Bauteile auf dem Dach, höhere Kosten"],
            ["**Mikrowechselrichter**", "Ein kleiner Wechselrichter je Modul (oder je 2–4 Module)", "Kleine, verwinkelte Dächer, starke Teilverschattung, Balkonkraftwerk", "Teurer je kWp, Speicher meist AC-gekoppelt"],
            ["**Batteriewechselrichter**", "Eigenes Gerät nur für den Speicher, AC-seitig angeschlossen", "Speicher-Nachrüstung an einer bestehenden Anlage", "Doppelte Umwandlung, zusätzliche Verluste"],
          ],
          minBreite: 720,
          fussnote: "Mischformen sind üblich, z. B. Hybridwechselrichter mit Optimierern nur an den verschatteten Modulen.",
        },
        { typ: "h3", text: "Stringwechselrichter: der Standard für freie Dächer" },
        {
          typ: "p",
          text: "Beim Stringwechselrichter werden mehrere Module in Reihe geschaltet. Jeder String hängt an einem MPP-Tracker. Hat Ihr Dach eine Ost- und eine Westseite, gehört jede Seite an einen eigenen Tracker. Das Prinzip ist bewährt, günstig und effizient – solange nicht einzelne Module im Schatten liegen, denn das schwächste Modul bremst den ganzen String. Wie stark, erklärt der Ratgeber zur [Verschattung](/ratgeber/photovoltaik-verschattung).",
        },
        { typ: "h3", text: "Hybridwechselrichter: ein Gerät für Module und Speicher" },
        {
          typ: "p",
          text: "Ein [Hybridwechselrichter](/wissen/lexikon#hybridwechselrichter) hat zusätzlich einen Batterieeingang. Der Solarstrom lädt den [Stromspeicher](/produkte/stromspeicher) direkt als Gleichstrom (DC-Kopplung) – ohne Umweg über Wechselstrom. Das spart eine Umwandlungsstufe und ein zweites Gerät. Wer einen Speicher auch nur in Erwägung zieht, sollte deshalb von Anfang an einen Hybridwechselrichter wählen; der Aufpreis gegenüber einem reinen Stringgerät ist meist deutlich kleiner als die spätere Nachrüstung.",
        },
        { typ: "h3", text: "Mikrowechselrichter und Optimierer: bei Schatten und vielen Dachflächen" },
        {
          typ: "p",
          text: "Mikrowechselrichter sitzen direkt unter den Modulen und arbeiten für jedes Modul einzeln. Ein verschattetes Modul beeinflusst die anderen nicht, und das Monitoring zeigt jedes Modul separat. [Leistungsoptimierer](/wissen/lexikon#leistungsoptimierer) erreichen einen ähnlichen Effekt, speisen aber in einen zentralen Wechselrichter. Beide Lösungen kosten mehr und bringen mehr Elektronik aufs Dach. Auf einem unverschatteten Satteldach mit zwei Seiten bringen sie kaum Mehrertrag.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Notstrom ist keine Standardfunktion",
          text: "Fällt das Netz aus, schaltet sich jeder netzgekoppelte Wechselrichter aus Sicherheitsgründen ab – auch bei Sonnenschein. Weiterversorgung gibt es nur mit einem Hybridwechselrichter mit Notstrom- oder Ersatzstromfunktion, Speicher und Umschalteinrichtung. Die Unterschiede erklärt der Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik).",
        },
      ],
    },
    {
      id: "auslegung",
      titel: "Wie groß muss der Wechselrichter sein?",
      tocLabel: "Auslegung",
      bloecke: [
        {
          typ: "p",
          text: "**Die AC-Nennleistung des Wechselrichters liegt bei Hausdächern meist bei 80 bis 100 Prozent der Modulleistung – das entspricht einem DC/AC-Verhältnis von etwa 1,0 bis 1,3.** Module erreichen ihre Nennleistung in Deutschland nur an wenigen Stunden im Jahr, weil Einstrahlung, Einfallswinkel und Modultemperatur fast nie den Testbedingungen entsprechen. Laut Fraunhofer ISE liegt die DC-Nennleistung bundesweit im Mittel knapp 10 Prozent über der AC-Nennleistung.",
        },
        {
          typ: "tabelle",
          caption: "Typische Wechselrichter-Auslegung für Hausdächer (Orientierung)",
          kopf: ["Dach & Anlage", "Modulleistung", "Wechselrichter (AC)", "DC/AC", "Hinweis"],
          zeilen: [
            ["Süddach, 30–40° geneigt", "10 kWp", "8–10 kW", "1,0–1,25", "Höchste Spitzen, eher vorsichtig überbelegen"],
            ["Ost-West-Dach", "10 kWp", "7–8 kW", "1,25–1,4", "Seiten erreichen nie gleichzeitig ihre Spitze"],
            ["Flachdach Ost-West, 10–15°", "15 kWp", "10–12 kW", "1,25–1,5", "Geringe Spitzenleistung, breites Tagesprofil"],
            ["Süddach mit Hybrid + Speicher", "10 kWp", "8–10 kW", "1,0–1,25", "Speicher nimmt Mittagsspitzen teilweise auf"],
            ["Kleines Dach", "4–5 kWp", "4–5 kW", "1,0–1,2", "Dreiphasig oder einphasig bis 4,6 kVA"],
          ],
          hervorheben: 3,
          minBreite: 680,
          fussnote: "Orientierungswerte. Maßgeblich sind die Herstellervorgaben zu maximaler DC-Leistung, Spannungsfenster und Strom je MPP-Tracker sowie die Anforderungen des Netzbetreibers.",
        },
        { typ: "h3", text: "Worauf es bei der Auslegung wirklich ankommt" },
        {
          typ: "liste",
          punkte: [
            "**Spannungsfenster:** Die Stringspannung muss im MPP-Bereich des Geräts liegen. Kritisch ist der kalte, sonnige Wintermorgen: Kalte Module liefern die höchste Spannung, die die maximale Eingangsspannung nie überschreiten darf.",
            "**Anzahl der MPP-Tracker:** Jede Dachfläche mit eigener Ausrichtung oder Neigung braucht einen eigenen Tracker. Zwei Tracker sind bei Einfamilienhäusern üblich, drei geben Reserve für eine Garage oder Gaube.",
            "**Strom je Tracker:** Moderne großflächige Module liefern hohe Ströme. Der zulässige Eingangsstrom des Wechselrichters muss dazu passen, sonst geht Ertrag verloren.",
            "**Ein- oder dreiphasig:** Im Netz der allgemeinen Versorgung darf die Schieflast zwischen den Phasen 4,6 kVA nicht überschreiten. Größere Anlagen speisen deshalb dreiphasig ein.",
            "**Ab 30 kVA** Gesamtleistung verlangt die VDE-AR-N 4105 einen zentralen Netz- und Anlagenschutz (NA-Schutz) am Zählerplatz. Für typische Einfamilienhäuser ist das nicht relevant.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Überbelegung: kleiner Verlust, oft großer Nutzen",
          text: "Ein etwas kleinerer Wechselrichter kappt an wenigen klaren Mittagsstunden die Spitze. Dafür arbeitet er morgens, abends und im Winter öfter in einem günstigen Lastbereich und kostet weniger. Bei Ost-West-Dächern ist die Überbelegung besonders unkritisch – mehr dazu im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
      ],
    },
    {
      id: "solarspitzen",
      titel: "Was bedeutet die 60-%-Regel für den Wechselrichter?",
      tocLabel: "60-%-Regel",
      bloecke: [
        {
          typ: "p",
          text: "**Neue Anlagen unter 25 kW, die noch kein intelligentes Messsystem mit Steuerungseinrichtung haben, dürfen nach § 9 Abs. 2 EEG höchstens 60 Prozent ihrer installierten Leistung ins Netz einspeisen.** Gemessen wird am Netzverknüpfungspunkt – also nach dem Eigenverbrauch im Haus. Eingeführt hat die Regel das [Solarspitzengesetz](/ratgeber/solarspitzengesetz) für Anlagen ab Inbetriebnahme 25. Februar 2025; Steckersolargeräte bis 2 kW und 800 VA sind ausgenommen.",
        },
        {
          typ: "p",
          text: "Für den Wechselrichter heißt das: Er sollte die Einspeisung **dynamisch** begrenzen, gesteuert über einen Energiezähler am Hausanschluss. Dann laufen Waschmaschine, Wärmepumpe oder Wallbox mittags mit vollem Solarstrom, und nur der Überschuss oberhalb der 60-%-Grenze wird abgeregelt. Eine starre Begrenzung der Wechselrichterleistung auf 60 Prozent kostet dagegen unnötig Ertrag.",
        },
        {
          typ: "kennzahl",
          wert: "1,1–9,0 %",
          titel: "Abregelungsverlust durch die 60-%-Grenze",
          text: "Laut HTW Berlin bei Volleinspeisung ohne Speicher: 1,1 % bei West-Ost-, 9,0 % bei Südausrichtung. Mit Eigenverbrauch, Speicher und prognosebasiertem Laden sinkt der Verlust deutlich.",
        },
        {
          typ: "p",
          text: "Sobald der Messstellenbetreiber ein intelligentes Messsystem mit Steuerbox eingebaut hat, entfällt die feste Grenze; der Netzbetreiber kann dann bei Bedarf gezielt steuern. Achten Sie daher auf einen Wechselrichter mit offener Schnittstelle zur Steuerbox und zu einem [Energiemanagementsystem](/ratgeber/energiemanagementsystem).",
        },
      ],
    },
    {
      id: "effizienz",
      titel: "Wirkungsgrad und Effizienz: Worin sich Geräte unterscheiden",
      tocLabel: "Effizienz",
      bloecke: [
        {
          typ: "p",
          text: "**Der Spitzenwirkungsgrad im Datenblatt sagt wenig über den Jahresertrag – aussagekräftiger sind der europäische Wirkungsgrad, der Eigenverbrauch im Stand-by und bei Speichersystemen die gesamte Systemeffizienz.** Der europäische Wirkungsgrad gewichtet Teillastbereiche so, wie sie im mitteleuropäischen Klima tatsächlich vorkommen.",
        },
        {
          typ: "p",
          text: "Wie groß die Unterschiede in der Praxis sind, zeigt die **Stromspeicher-Inspektion 2026** der HTW Berlin: Die getesteten Speichersysteme erreichten einen System Performance Index zwischen 89,3 und 97 Prozent. Der Stand-by-Verbrauch reichte von 4 bis 64 Watt. Zwischen dem effizientesten und dem ineffizientesten System lagen rund 200 Euro Kostenvorteil pro Jahr – über 15 Jahre ein spürbarer Betrag.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Europäischer Wirkungsgrad** von 97 % oder mehr (Datenblatt, Angabe „Euro-Eta“)",
            "**Geringer Stand-by-Verbrauch**, besonders bei Hybridgeräten, die nachts aktiv bleiben",
            "Teilnahme oder gute Einstufung bei **unabhängigen Effizienztests** wie der HTW-Stromspeicher-Inspektion",
            "**Leise, passive Kühlung** oder temperaturgesteuerter Lüfter, wenn der Aufstellort in Wohnraumnähe liegt",
          ],
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet ein Wechselrichter?",
      tocLabel: "Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Stringwechselrichter für ein Einfamilienhaus kostet als Gerät je nach Leistung und Hersteller etwa 800 bis 2.500 Euro, ein Hybridwechselrichter rund 1.500 bis 3.500 Euro.** Beim Kauf einer kompletten Anlage ist das Gerät im Preis je kWp enthalten; wie sich der Gesamtpreis zusammensetzt, zeigt der Ratgeber [Solaranlage Kosten](/ratgeber/solaranlage-kosten).",
        },
        {
          typ: "tabelle",
          caption: "Gerätepreise für Wechselrichter, Orientierung Stand September 2026",
          kopf: ["Bauart", "Leistung", "Gerätepreis ca.", "Anmerkung"],
          zeilen: [
            ["Stringwechselrichter", "5–6 kW", "800–1.600 €", "dreiphasig, 2 MPP-Tracker"],
            ["Stringwechselrichter", "10 kW", "1.200–2.500 €", "je nach Marke und Funktionsumfang"],
            ["Hybridwechselrichter", "8–10 kW", "1.500–3.500 €", "ohne Batterie; Notstromfunktion teils Aufpreis"],
            ["Mikrowechselrichter", "je Modul", "ca. 100–250 €", "zzgl. Gateway/Kommunikation"],
            ["Leistungsoptimierer", "je Modul", "ca. 50–100 €", "nur mit passendem Wechselrichter"],
            ["Austausch inkl. Montage", "8–12 kWp", "1.500–3.000 €", "Gerät plus ca. 150–600 € Elektroarbeiten"],
          ],
          minBreite: 620,
          fussnote: "Endkundenpreise bei 0 % Umsatzsteuer nach § 12 Abs. 3 UStG. Marktübliche Spannen aus Fachportalen, keine Angebote; Preise schwanken stark nach Hersteller und Bezugsweg.",
        },
        {
          typ: "p",
          text: `Den späteren Tausch sollten Sie in der Wirtschaftlichkeitsrechnung einplanen. Unser [Solarrechner](/solarrechner) setzt dafür pauschal ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Betrieb, Versicherung, Wartung und eine Rücklage für den Wechselrichtertausch an – bei 10 kWp also ${ANNAHMEN.betriebskostenProKwp * 10} € im Jahr. Wie sich das auf die Rendite auswirkt, lesen Sie im Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).`,
        },
      ],
    },
    {
      id: "lebensdauer",
      titel: "Wie lange hält ein Wechselrichter?",
      tocLabel: "Lebensdauer & Garantie",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Wechselrichter hält im Durchschnitt 10 bis 15 Jahre, gute Geräte an einem kühlen Standort auch deutlich länger.** Module sind auf 25 bis 30 Jahre ausgelegt – bei einer typischen Betriebszeit müssen Sie also mit mindestens einem Austausch rechnen. Die Verbraucherzentrale weist darauf hin, dass Wechselrichter zu den am stärksten beanspruchten Bauteilen gehören und Garantiebedingungen deshalb genau geprüft werden sollten.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Garantie prüfen", text: "Standard sind oft 5 bis 10 Jahre Herstellergarantie, Verlängerungen auf 15 oder 20 Jahre sind gegen Aufpreis oder Registrierung möglich. Wichtig: Wer trägt Montage- und Versandkosten?" },
            { titel: "Standort wählen", text: "Kühl, trocken, gut belüftet – etwa Keller oder Technikraum. Ein heißer Dachboden verkürzt die Lebensdauer. Nicht im Schlafzimmer montieren: Geräte können hörbar summen." },
            { titel: "Monitoring nutzen", text: "Fehlermeldungen und sinkende Tageserträge früh erkennen. Ein Ausfall im Juni kostet bei 10 kWp schnell über 100 kWh pro Woche." },
          ],
        },
        {
          typ: "p",
          text: "Anzeichen für einen Defekt sind wiederkehrende Fehlercodes, ein dunkles Display, Isolationsfehler bei Feuchtigkeit oder ein Tagesertrag deutlich unter vergleichbaren Sonnentagen. Eine Reparatur lohnt sich meist nur bei jungen Geräten innerhalb der Garantie; bei älteren Wechselrichtern ist der Tausch gegen ein aktuelles Hybridgerät oft die bessere Wahl, weil sich damit gleich ein Speicher nachrüsten lässt.",
        },
      ],
    },
    {
      id: "tausch",
      titel: "Wechselrichter tauschen: So läuft es ab",
      tocLabel: "Tausch",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Fehler eingrenzen", "Fehlerprotokoll im Portal sichern, Garantiestatus prüfen und klären, ob Hersteller oder Installateur zuständig ist."],
            ["Ersatzgerät auslegen", "Spannungsfenster, MPP-Tracker und Leistung zum vorhandenen Modulfeld prüfen. Speicher, Wallbox oder Wärmepumpe gleich mitdenken."],
            ["Montage durch Elektrofachbetrieb", "Gerät tauschen, DC- und AC-Seite prüfen, Einspeisebegrenzung und Netzparameter nach VDE-AR-N 4105 einstellen, Monitoring einrichten."],
            ["Meldungen erledigen", "Netzbetreiber informieren und die Angaben im [Marktstammdatenregister](/wissen/lexikon#marktstammdatenregister) aktualisieren, wenn sich die Wechselrichterleistung ändert. Das EEG-Inbetriebnahmedatum der Anlage bleibt erhalten."],
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Vergütung bleibt beim Tausch bestehen",
          text: "Der Austausch des Wechselrichters ändert nichts am Inbetriebnahmedatum und damit nichts an Ihrem Vergütungssatz. Bei älteren Anlagen kann ein Tausch aber Anlass sein, die Anlage insgesamt zu modernisieren – siehe [Repowering](/service/repowering).",
        },
      ],
    },
    {
      id: "auswahl",
      titel: "Checkliste: Den passenden Wechselrichter auswählen",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Speicher geplant?** Dann Hybridwechselrichter mit freigegebenen Batteriemodellen wählen.",
            "**Dachflächen zählen:** Für jede Ausrichtung einen eigenen MPP-Tracker einplanen.",
            "**Verschattung prüfen:** Nur bei echter Teilverschattung Optimierer oder Mikrowechselrichter.",
            "**Dynamische Einspeisebegrenzung** mit Energiezähler für die 60-%-Regel.",
            "**Offene Schnittstellen** für Energiemanagement, Wallbox, Wärmepumpe und Steuerbox (§ 14a EnWG, § 9 EEG).",
            "**Notstrom oder Ersatzstrom** gewünscht? Funktion und benötigtes Zubehör vorab klären.",
            "**Garantie und Service:** Laufzeit, Verlängerung, Übernahme der Montagekosten, Ersatzgeräteversorgung in Deutschland.",
            "**Aufstellort** kühl, trocken, zugänglich – nicht im Wohn- oder Schlafraum.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Herstellerneutral planen",
          text: "Ökovolt ist Partner von Fronius, Huawei, Solis und Sigenergy und kennt deren Geräte aus der Praxis. Die Auswahl richtet sich trotzdem nach Ihrem Dach, Ihrem Speicherwunsch und den Schnittstellen, die Sie künftig brauchen – nicht nach dem Logo. Welche Kombination für Ihr Haus passt, klären wir bei der Vor-Ort-Prüfung.",
        },
        { typ: "tool", href: "/rechner/stromspeicher", titel: "Hybrid oder nicht? Erst den Speicher rechnen", text: "Der Stromspeicher-Rechner zeigt, ob sich ein Speicher für Ihren Verbrauch lohnt – und damit, ob ein Hybridwechselrichter sinnvoll ist.", label: "Zum Stromspeicher-Rechner" },
      ],
    },
  ],

  faq: [
    { q: "Welcher Wechselrichter ist der beste für eine PV-Anlage?", a: "Den einen besten gibt es nicht. Für ein unverschattetes Einfamilienhaus mit geplantem Speicher ist ein effizienter dreiphasiger Hybridwechselrichter meist die sinnvollste Wahl. Bei starker Teilverschattung oder vielen kleinen Dachflächen können Optimierer oder Mikrowechselrichter besser sein." },
    { q: "Wie groß sollte der Wechselrichter bei 10 kWp sein?", a: "Bei einem Süddach meist 8 bis 10 kW, bei einem Ost-West-Dach genügen oft 7 bis 8 kW. Entscheidend sind Spannungsfenster, Strom je MPP-Tracker und die Herstellerfreigabe für die Überbelegung." },
    { q: "Wie lange hält ein Wechselrichter?", a: "Im Schnitt 10 bis 15 Jahre, hochwertige Geräte an einem kühlen, trockenen Standort auch länger. Planen Sie über die Lebensdauer der Module mindestens einen Austausch ein." },
    { q: "Was kostet ein neuer Wechselrichter inklusive Einbau?", a: "Für eine typische Anlage mit 8 bis 12 kWp liegen Gerät und Montage meist zwischen 1.500 und 3.000 Euro. Hybridgeräte und Zusatzfunktionen wie Notstrom erhöhen den Preis." },
    { q: "Kann ich später einen Speicher nachrüsten, wenn ich keinen Hybridwechselrichter habe?", a: "Ja, über einen AC-gekoppelten Speicher mit eigenem Batteriewechselrichter. Das ist technisch problemlos, kostet aber ein zweites Gerät und bringt etwas mehr Umwandlungsverluste. Details im [Stromspeicher-Ratgeber](/ratgeber/stromspeicher-groesse)." },
    { q: "Muss der Wechselrichter auf 60 Prozent begrenzt werden?", a: "Für Neuanlagen unter 25 kW ohne intelligentes Messsystem mit Steuerbox gilt die 60-%-Grenze für die Einspeisung am Netzanschlusspunkt, nicht für die Erzeugung. Mit dynamischer Begrenzung über einen Energiezähler können Sie mehr Solarstrom selbst nutzen." },
    { q: "Wo sollte der Wechselrichter montiert werden?", a: "Kühl, trocken, staubarm und gut zugänglich – etwa im Keller, Hauswirtschafts- oder Technikraum. Hohe Temperaturen auf dem Dachboden verkürzen die Lebensdauer und können zu Leistungsreduzierung führen." },
  ],

  passend: [
    { href: "/ratgeber/solarmodule-vergleich", titel: "Solarmodule im Vergleich", text: "TOPCon, Heterojunction, Back Contact – was die Zelltechnik bringt." },
    { href: "/ratgeber/pv-anlage-groesse-berechnen", titel: "PV-Anlage: Größe berechnen", text: "Wie viel kWp Sie für Haushalt, Wärmepumpe und E-Auto brauchen." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Speicherlösungen passend zum Hybridwechselrichter." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Anlage mit passendem Wechselrichter planen lassen." },
  ],

  quellen: [
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland (Fassung 20.08.2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "08/2026" },
    { titel: "§ 9 EEG 2023 – Technische Vorgaben (Steuerbarkeit, 60-%-Begrenzung)", url: "https://www.gesetze-im-internet.de/eeg_2014/__9.html", stand: "09/2026" },
    { titel: "HTW Berlin / aquu – Stromspeicher-Inspektion 2026", url: "https://solar.htw-berlin.de/studien/stromspeicher-inspektion-2026/", stand: "2026" },
    { titel: "Verbraucherzentrale Hamburg – Solarspitzen und Fördergelder: Neue Regeln für Photovoltaikanlagen", url: "https://www.vzhh.de/themen/bauen-immobilien-energie/erneuerbare-energien/solarspitzen-foerdergelder-neue-regeln-fuer-photovoltaikanlagen", stand: "09/2025" },
    { titel: "Verbraucherzentrale – Photovoltaik: Was bei der Planung einer Solaranlage wichtig ist", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-bei-der-planung-einer-solaranlage-wichtig-ist-5574", stand: "09/2026" },
    { titel: "energie-experten.org – Wechselrichter-Kosten: Preise, Hersteller & Wartung", url: "https://www.energie-experten.org/erneuerbare-energien/photovoltaik/wechselrichter/kosten", stand: "2026" },
  ],

  seitenCta: { titel: "Welcher Wechselrichter passt?", text: "Wir legen Wechselrichter, Module und Speicher passend zu Ihrem Dach aus.", href: "/angebot", label: "Anlage planen lassen" },
  cta: {
    title: "Der richtige Wechselrichter entscheidet über 15 Jahre Ertrag.",
    text: "Wir prüfen Dachflächen, Verschattung und Zählerschrank vor Ort und legen Wechselrichter und Speicher so aus, dass spätere Erweiterungen möglich bleiben.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
