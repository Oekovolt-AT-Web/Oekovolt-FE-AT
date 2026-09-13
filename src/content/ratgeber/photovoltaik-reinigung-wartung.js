// Ratgeber: Photovoltaik reinigen und warten
// Wirtschaftlichkeit der Reinigung mit Strompreis und Einspeisevergütung aus den
// zentralen Datendateien; Prüfintervalle nach VdS 3145 (Ausgabe 2025-06) und DGUV V3.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const KWP = 10;
const ERTRAG = KWP * ANNAHMEN.ertragProKwpSued;
const FLAECHE = KWP * ANNAHMEN.qmProKwp;
const EINSPEISUNG = VERGUETUNG.saetze[0].teileinspeisung / 100; // €/kWh
const STROM = ANNAHMEN.strompreis; // €/kWh
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const ctStr = (n) => String(Math.round(n * 1000) / 10).replace(".", ",");
const verlust = (p) => [`${p} %`, kwh(ERTRAG * p / 100), eur(ERTRAG * p / 100 * EINSPEISUNG), eur(ERTRAG * p / 100 * STROM)];

const artikel = {
  slug: "photovoltaik-reinigung-wartung",
  title: "Photovoltaik reinigen und warten: Was nötig ist, was es kostet",
  seoTitle: "Photovoltaik Reinigung & Wartung: Pflicht, Kosten | Ökovolt",
  kurzTitel: "PV-Reinigung & Wartung",
  description:
    "Photovoltaik reinigen: Wann lohnt es sich, wie geht es richtig? Plus Wartung ohne Mythen – Pflichten, Prüfintervalle, Kosten, Checkliste und Monitoring für Ihre PV-Anlage.",
  excerpt:
    "Muss eine Solaranlage gereinigt und gewartet werden? Die ehrliche Antwort: Reinigung selten, Kontrolle regelmäßig. Mit Rechenbeispiel, Prüfintervallen, Kosten und einer Checkliste zum Selbst-Prüfen.",
  hauptKeyword: "photovoltaik reinigung",
  keywords: ["Photovoltaik Reinigung", "Solaranlage reinigen", "PV-Anlage Wartung", "Photovoltaik Wartung Pflicht", "PV-Anlage Wartung Kosten", "Solarmodule reinigen Kosten", "Photovoltaik Prüfung alle 4 Jahre", "PV Monitoring"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/photovoltaik-reinigung-wartung.jpg",
  bildAlt: "Zwei Prüfer von meteocontrol untersuchen Solarmodule mit einer Wärmebildkamera",
  badge: { wert: "4 Jahre", text: "empfohlenes Intervall für die wiederkehrende Prüfung" },

  kurzFazit: [
    "**Eine regelmäßige Reinigung ist bei den meisten Anlagen auf geneigten Wohnhausdächern nicht nötig.** Sie lohnt sich bei starker, festsitzender Verschmutzung – etwa neben Ställen, Feldern, Bahnlinien oder bei flacher Neigung unter 15 Grad.",
    "**Eine gesetzliche Wartungspflicht gibt es für private Betreiber nicht.** Versicherer und Hersteller verlangen aber oft Nachweise; empfohlen werden eine jährliche Sichtkontrolle und eine fachliche Prüfung etwa alle vier Jahre.",
    `**Rechenbeispiel:** Bei einer ${KWP}-kWp-Anlage kosten 3 % Verschmutzungsverlust rund ${kwh(ERTRAG * 0.03)} im Jahr – je nach Nutzung ${eur(ERTRAG * 0.03 * EINSPEISUNG)} bis ${eur(ERTRAG * 0.03 * STROM)}. Eine professionelle Reinigung kostet oft ähnlich viel oder mehr.`,
    "**Das wichtigste Wartungswerkzeug ist das Monitoring:** Wer die Erträge regelmäßig vergleicht, erkennt Defekte und Verschmutzung früh.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Muss eine PV-Anlage gereinigt und gewartet werden?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Reinigen müssen Sie eine Photovoltaikanlage nur, wenn sie deutlich und dauerhaft verschmutzt ist; kontrollieren sollten Sie sie dagegen regelmäßig.** Moderne Module sind wartungsarm, aber nicht wartungsfrei: Wechselrichter, Steckverbinder, Kabel und Befestigungen altern, Marder und Tauben richten Schäden an, Stürme lockern Klemmen.",
        },
        {
          typ: "karten",
          items: [
            { titel: "Reinigung", text: "Bei Bedarf. Anlass sind sichtbare Verkrustungen, Vogelkot, Flechten an Rahmenkanten oder ein messbarer Ertragsrückgang – nicht der Kalender." },
            { titel: "Wartung und Prüfung", text: "Regelmäßig. Jährlicher Blick auf Anlage und Monitoring, fachliche Prüfung mit Messungen etwa alle vier Jahre, nach Unwettern zusätzlich." },
          ],
        },
        {
          typ: "p",
          text: `Die laufenden Kosten sind in jeder seriösen Kalkulation eingeplant: Unser [Solarrechner](/solarrechner) setzt ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Versicherung, Wartung, Zählermiete, Reinigung und die Rücklage für einen Wechselrichtertausch an – bei ${KWP} kWp also rund ${eur(KWP * ANNAHMEN.betriebskostenProKwp)} im Jahr.`,
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
          text: "**Unter mitteleuropäischen Bedingungen liegen die Verluste durch Verschmutzung meist im niedrigen einstelligen Prozentbereich, in ungünstigen Lagen auch darüber.** Eine im April 2026 vom Bundesverband Solarwirtschaft veröffentlichte Auswertung internationaler Studien nennt für Mitteleuropa durchschnittlich 3 bis 4 % Ertragsverlust pro Jahr und dokumentierte Einzelfälle mit über 10 %. Die Auswertung wurde von einem Anbieter aus dem Bereich Anlagenpflege beauftragt – die Größenordnung deckt sich aber mit anderen Fachquellen.",
        },
        {
          typ: "tabelle",
          caption: "Wann Verschmutzung ein Thema ist",
          kopf: ["Situation", "Typische Verschmutzung", "Reinigungsbedarf"],
          zeilen: [
            ["Wohnhaus, Schrägdach ab ca. 15°, Wohngebiet", "Staub, Pollen – vom Regen weitgehend abgewaschen", "selten, nur bei sichtbaren Flecken"],
            ["Flach geneigte Module unter ca. 15°", "Schmutzränder an der unteren Rahmenkante, Moos", "gelegentlich prüfen"],
            ["Nähe zu Bäumen", "Laub, Harz, Pollen, Vogelkot", "nach Bedarf"],
            ["Landwirtschaft, Tierhaltung", "Staub, Ammoniak-Ablagerungen, Futtermittelstaub", "häufig, oft jährlich"],
            ["Straße, Bahnlinie, Industrie", "Ruß, Bremsabrieb, Feinstaub", "häufig"],
          ],
          minBreite: 620,
          fussnote: "Orientierung aus Fachveröffentlichungen. Maßgeblich ist der tatsächliche Zustand – ein Blick mit dem Fernglas und der Ertragsvergleich im Monitoring zeigen, ob gehandelt werden muss.",
        },
        {
          typ: "p",
          text: "Wichtig ist die Art des Schmutzes: **Loser Staub** wird von Regen und Schnee großteils abgespült. **Festsitzende Verschmutzung** wie Vogelkot, Flechten, verkrustete Pollen oder Ruß bleibt dagegen haften. Punktuelle Flecken wie Vogelkot wirken wie ein kleiner Schatten – sie können ganze Zellgruppen ausbremsen, wie der Ratgeber [Photovoltaik und Verschattung](/ratgeber/photovoltaik-verschattung) erklärt.",
        },
      ],
    },
    {
      id: "lohnt-reinigung",
      titel: "Lohnt sich eine professionelle Reinigung?",
      tocLabel: "Lohnt sich Reinigung?",
      bloecke: [
        {
          typ: "p",
          text: `**Bei einer typischen Eigenheimanlage rechnet sich eine Reinigung erst ab deutlich messbaren Verlusten.** Der Grund: Der verlorene Strom fehlt vor allem in sonnigen Stunden, in denen ohnehin Überschuss eingespeist wird. Er ist dann nur die Einspeisevergütung von ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct wert, nicht den Strompreis von rund ${ctStr(STROM)} ct.`,
        },
        {
          typ: "tabelle",
          caption: `Wert des Verschmutzungsverlusts einer ${KWP}-kWp-Anlage (${kwh(ERTRAG)} Jahresertrag)`,
          kopf: ["Verlust", "Fehlender Strom pro Jahr", `Wert bei Einspeisung (${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct)`, `Wert bei Eigenverbrauch (${ctStr(STROM)} ct)`],
          zeilen: [verlust(2), verlust(5), verlust(10)],
          hervorheben: 2,
          minBreite: 600,
          fussnote: `Jahresertrag nach Solarrechner (${ANNAHMEN.ertragProKwpSued} kWh/kWp, Süd). In der Praxis liegt der Wert meist nahe an der Einspeisespalte, weil Verschmutzung vor allem Überschussstrom kostet. Einspeisevergütung für Anlagen bis 10 kWp mit Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}.`,
        },
        {
          typ: "p",
          text: `Dem stehen die Kosten gegenüber: Fachbetriebe verlangen für die professionelle Reinigung etwa 1 bis 3 € je Quadratmeter netto, kleine Anlagen werden oft pauschal abgerechnet. Eine ${KWP}-kWp-Anlage hat rund ${FLAECHE} m² Modulfläche – dazu kommen bei Bedarf Hubsteiger oder Absturzsicherung. Eine jährliche Reinigung lohnt sich damit vor allem dort, wo Verluste von 5 % und mehr regelmäßig auftreten, etwa in landwirtschaftlicher Umgebung oder bei großen Gewerbeanlagen mit hohem Eigenverbrauch.`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Erst messen, dann reinigen",
          text: "Vergleichen Sie den Monatsertrag mit dem Vorjahr oder mit einer Nachbaranlage gleicher Ausrichtung. Liegt er bei ähnlichem Wetter mehrere Prozent darunter und sehen die Module verschmutzt aus, ist eine Reinigung sinnvoll – und im Anschluss lässt sich der Effekt direkt ablesen.",
        },
      ],
    },
    {
      id: "richtig-reinigen",
      titel: "So werden Solarmodule richtig gereinigt",
      tocLabel: "Richtig reinigen",
      bloecke: [
        {
          typ: "p",
          text: "**Solarmodule werden mit weichem, möglichst entmineralisiertem Wasser und weichen Bürsten gereinigt – ohne Hochdruck, ohne Scheuermittel und ohne das Dach zu betreten, wenn keine Absturzsicherung vorhanden ist.** Maßgeblich ist immer die Reinigungsanleitung des Modulherstellers, denn unsachgemäße Reinigung kann Garantieansprüche gefährden.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Entmineralisiertes oder Osmosewasser** verwenden – hartes Leitungswasser hinterlässt Kalkflecken.",
            "**Weiche Bürsten oder Schwämme**, bei Fachbetrieben meist wasserführende Teleskopbürsten.",
            "**Keine Hochdruckreiniger, keine Scheuermittel, keine Lösungsmittel** – sie beschädigen die Antireflexbeschichtung und Dichtungen.",
            "**Nicht bei heißen Modulen reinigen:** Kaltes Wasser auf sonnenheißem Glas erzeugt Spannungen. Besser früh morgens, abends oder bei bedecktem Himmel.",
            "**Nicht auf Modulen laufen oder knien** – das kann Mikrorisse in den Zellen verursachen.",
            "**Absturzsicherung ist Pflicht:** Arbeiten auf dem Dach nur mit Gerüst, Seitenschutz oder Anschlagpunkten. Im Zweifel einen Fachbetrieb beauftragen.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Selbst reinigen – nur vom Boden aus",
          text: "Ein Hausdach ist kein Arbeitsplatz für Laien. Wenn Sie selbst reinigen möchten, dann nur von sicherem Stand am Boden oder von einem gesicherten Flachdach mit Seitenschutz. Nasse Module und Dachflächen sind extrem rutschig.",
        },
      ],
    },
    {
      id: "wartung-pflicht",
      titel: "Gibt es eine Wartungspflicht für Photovoltaikanlagen?",
      tocLabel: "Pflichten & Intervalle",
      bloecke: [
        {
          typ: "p",
          text: "**Für private Betreiber gibt es keine gesetzliche Pflicht zur Wartung oder wiederkehrenden Prüfung.** Sie haften aber als Eigentümer für Schäden, die von der Anlage ausgehen (§ 823 BGB), und viele Versicherungsverträge und Herstellergarantien knüpfen Leistungen an eine ordnungsgemäße Instandhaltung. Für gewerblich genutzte Anlagen gelten dagegen verbindliche Prüfpflichten aus Arbeitsschutzrecht und DGUV Vorschrift 3.",
        },
        {
          typ: "tabelle",
          caption: "Prüfintervalle für Photovoltaikanlagen im Überblick",
          kopf: ["Betreiber / Grundlage", "Verbindlich?", "Intervall", "Umfang"],
          zeilen: [
            ["Privat, Eigenheim", "keine gesetzliche Pflicht", "Empfehlung: Sichtkontrolle jährlich, Prüfung etwa alle 4 Jahre", "nach Versicherungs- und Garantiebedingungen"],
            ["Versicherer (VdS 3145, Ausgabe 2025-06)", "wenn im Vertrag vereinbart", "Sichtprüfung jährlich, wiederkehrende Prüfung spätestens alle 4 Jahre", "Prüfung nach DIN EN 62446-1, bei Ü20-Anlagen ergänzend Thermografie"],
            ["Gewerbe (DGUV Vorschrift 3, BetrSichV)", "ja, für Arbeitgeber und Unternehmen", "in der Regel alle 4 Jahre, festgelegt per Gefährdungsbeurteilung", "Elektrofachkraft, dokumentierte Messungen"],
            ["Aggressive Umgebung (Landwirtschaft, Küste, Industrie)", "Empfehlung", "alle 1–2 Jahre", "zusätzlich Korrosion, Kabel, Verschmutzung"],
          ],
          minBreite: 720,
          fussnote: "Zusammenfassung nach Fachveröffentlichungen zu VdS 3145 und DGUV Vorschrift 3, Stand September 2026. Maßgeblich sind Ihr Versicherungsvertrag, die Garantiebedingungen und bei Unternehmen die Gefährdungsbeurteilung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Versicherungsbedingungen prüfen",
          text: "Lesen Sie in Ihrer Police nach, ob Prüfungen oder Wartungsnachweise als Obliegenheit vereinbart sind. Fehlen sie im Schadenfall, kann der Versicherer die Leistung kürzen. Mehr im Ratgeber [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Was bei einer Wartung geprüft wird",
      tocLabel: "Wartungs-Checkliste",
      bloecke: [
        {
          typ: "p",
          text: "**Eine fachgerechte Wartung kombiniert Sichtprüfung, elektrische Messungen und die Auswertung der Betriebsdaten.** Grundlage für Prüfung und Dokumentation ist die DIN EN 62446-1 (VDE 0126-23-1).",
        },
        {
          typ: "tabelle",
          caption: "Prüfpunkte einer PV-Wartung",
          kopf: ["Bereich", "Was geprüft wird"],
          zeilen: [
            ["Module", "Glasbruch, Verfärbungen, Delamination, Schneckenspuren, Verschmutzung, Hotspots (Thermografie)"],
            ["Unterkonstruktion", "festen Sitz von Klemmen und Schienen, Korrosion, Dachhaken, Ballast auf Flachdächern"],
            ["Verkabelung", "Steckverbinder, UV-Schäden, Scheuerstellen, Marderbiss, Kabelführung"],
            ["Elektrische Messungen", "Isolationswiderstand, Leerlaufspannung und Strom je String, ggf. Kennlinienmessung"],
            ["Wechselrichter", "Fehlerspeicher, Lüfter und Kühlkörper, Anschlüsse, Firmware, Kommunikation"],
            ["Schutzeinrichtungen", "Überspannungsschutz, Fehlerstromschutzschalter, Freischaltstellen, Erdung und Potenzialausgleich"],
            ["Speicher", "Fehlermeldungen, Ladezustand, Umgebungstemperatur, Belüftung"],
            ["Dokumentation", "Prüfprotokoll, Messwerte, Ertragsvergleich, festgestellte Mängel"],
          ],
          minBreite: 560,
        },
        {
          typ: "p",
          text: "Die meisten Defekte betreffen nicht die Module, sondern Steckverbinder, Wechselrichter und Tierschäden. Wechselrichter sind das Bauteil mit der kürzesten Lebensdauer und werden typischerweise nach 12 bis 15 Jahren getauscht – Hintergründe im Ratgeber [Wechselrichter für Photovoltaik](/ratgeber/wechselrichter-photovoltaik). Wichtige Schutzbauteile erklärt unser Lexikon: [Überspannungsschutz](/wissen/lexikon#ueberspannungsschutz) und [Fehlerstromschutzschalter](/wissen/lexikon#fehlerstromschutzschalter).",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kosten Wartung und Reinigung?",
      tocLabel: "Kosten",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Richtpreise für Wartung, Prüfung und Reinigung, Stand 2026",
          kopf: ["Leistung", "Richtpreis", "Hinweis"],
          zeilen: [
            ["Prüfung/Wartung Eigenheimanlage bis 10 kWp", "ca. 150–400 €", "je Termin, inkl. Messungen und Protokoll"],
            ["Prüfung Gewerbeanlage bis 100 kWp", "ca. 400–1.200 €", "je nach Umfang und Zugänglichkeit"],
            ["Thermografie", "ca. 200–800 € zusätzlich", "Drohne oder Handkamera, bei Sonne"],
            ["Professionelle Reinigung", "ca. 1–3 € je m² netto", "kleine Anlagen oft pauschal, zzgl. Hubsteiger"],
            [`Laufende Kosten gesamt (Solarrechner)`, `${ANNAHMEN.betriebskostenProKwp} € je kWp/Jahr`, "Versicherung, Wartung, Zähler, Rücklage Wechselrichter"],
          ],
          minBreite: 600,
          fussnote: "Marktübliche Spannen aus Fachveröffentlichungen (u. a. Deutsche Prüfservice 06/2026, solaranlage-ratgeber.de 09/2026). Keine Angebote; regionale Unterschiede sind groß.",
        },
        {
          typ: "p",
          text: "**Wartungsverträge** bündeln Prüfung, Monitoring-Überwachung und bevorzugte Termine gegen eine Jahresgebühr. Bei kleinen Eigenheimanlagen ist ein langfristiger Vertrag nicht zwingend – eine Prüfung im empfohlenen Intervall plus aufmerksames Monitoring genügt oft. Achten Sie im Vertrag darauf, was enthalten ist (Messungen, Protokoll, Anfahrt, Reinigung) und wie lange er läuft. Wer eine neue Anlage vergleicht, findet Hinweise im Ratgeber [Photovoltaik-Angebot vergleichen](/ratgeber/photovoltaik-angebot-vergleichen).",
        },
      ],
    },
    {
      id: "monitoring",
      titel: "Monitoring: die beste Wartung ist ein wacher Blick auf die Daten",
      tocLabel: "Monitoring",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Monitoring-Portal zeigt Ihnen täglich, ob die Anlage so viel liefert, wie sie soll – und meldet Störungen oft, bevor Sie sie auf der Stromrechnung bemerken.** Nahezu alle Wechselrichter bringen eine App oder ein Webportal mit. Für Gewerbe- und Großanlagen gibt es herstellerunabhängige Systeme, die Einstrahlungssensoren, Zähler und mehrere Wechselrichter zusammenführen und die [Performance Ratio](/wissen/lexikon#performance-ratio) berechnen.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Erwartung kennen", "Aus der Planung oder PVGIS die typischen Monatserträge notieren. Wie stark sie schwanken, zeigt der Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter)."],
            ["Monatlich vergleichen", "Ertrag mit Vorjahresmonat und Erwartung vergleichen; bei mehreren Strings die Strings untereinander."],
            ["Warnungen aktivieren", "Push- oder E-Mail-Benachrichtigung bei Fehlern und Kommunikationsausfall einschalten."],
            ["Abweichung klären", "Liegt ein String dauerhaft unter den anderen oder der Ertrag deutlich unter dem Vorjahr, Fachbetrieb einschalten."],
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Herstellerneutral überwachen",
          text: "Ökovolt ist Partner von meteocontrol, Huawei (FusionSolar), Fronius, Solis und Sigenergy. Welche Überwachung sinnvoll ist, hängt von Anlagengröße und Technik ab: Für Eigenheime reicht meist das Portal des Wechselrichterherstellers, für Gewerbeanlagen mit mehreren Wechselrichtern und Direktvermarktung lohnt sich ein unabhängiges Monitoring.",
        },
      ],
    },
    {
      id: "selbst-pruefen",
      titel: "Was Sie selbst prüfen können – ohne aufs Dach zu steigen",
      tocLabel: "Selbst prüfen",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Monitoring-App** regelmäßig öffnen, Fehlermeldungen ernst nehmen.",
            "**Zählerstände** von Erzeugungs- und Zweirichtungszähler monatlich notieren – das ist Ihr Backup, falls das Portal ausfällt.",
            "**Sichtprüfung vom Boden** mit Fernglas: Glasbruch, verrutschte Module, lose Kabel, starke Verschmutzung, Vogelnester.",
            "**Nach Sturm und Hagel** gezielt kontrollieren und Schäden fotografieren – wichtig für die Versicherung.",
            "**Wechselrichter und Speicher** auf Warnleuchten, ungewöhnliche Geräusche, Geruch und freie Lüftungsöffnungen prüfen.",
            "**Tierspuren** beachten: Taubenkot unter den Modulen oder angenagte Kabel sind ein Fall für den Fachbetrieb, gegebenenfalls mit Vogelschutzgitter.",
          ],
        },
        { typ: "tool", href: "/solarrechner", titel: "Soll-Ertrag Ihrer Anlage abschätzen", text: "Der Solarrechner zeigt, welcher Jahresertrag bei Ihrer Größe und Ausrichtung zu erwarten ist – eine gute Referenz fürs Monitoring.", label: "Zum Solarrechner" },
      ],
    },
  ],

  faq: [
    { q: "Muss man eine Photovoltaikanlage reinigen?", a: "Meist nicht. Auf geneigten Dächern in Wohngebieten spülen Regen und Schnee losen Staub weitgehend ab. Eine Reinigung lohnt sich bei festsitzender Verschmutzung, flacher Neigung unter etwa 15 Grad oder in der Nähe von Landwirtschaft, Straßen und Bahnlinien." },
    { q: "Was kostet es, eine Solaranlage reinigen zu lassen?", a: `Fachbetriebe verlangen etwa 1 bis 3 € je Quadratmeter netto, kleine Anlagen oft als Pauschale. Eine ${KWP}-kWp-Anlage hat rund ${FLAECHE} m² Modulfläche; Hubsteiger oder Absturzsicherung kommen gegebenenfalls hinzu.` },
    { q: "Womit reinigt man Solarmodule?", a: "Mit entmineralisiertem oder weichem Wasser und weichen Bürsten. Hochdruckreiniger, Scheuermittel, Lösungsmittel und heißes Wasser sind tabu. Die Reinigungsanleitung des Modulherstellers hat Vorrang." },
    { q: "Ist eine Wartung der PV-Anlage Pflicht?", a: "Für private Betreiber nicht. Versicherer und Hersteller setzen aber oft eine ordnungsgemäße Instandhaltung voraus. Gewerbliche Anlagen unterliegen der DGUV Vorschrift 3 und müssen regelmäßig von einer Elektrofachkraft geprüft werden." },
    { q: "Wie oft sollte eine PV-Anlage gewartet werden?", a: "Empfohlen sind eine jährliche Sichtkontrolle und eine fachliche Prüfung mit Messungen spätestens alle vier Jahre, wie es auch die Versicherer-Richtlinie VdS 3145 vorsieht. In landwirtschaftlicher oder küstennaher Umgebung sind kürzere Intervalle sinnvoll." },
    { q: "Was kostet die Wartung einer PV-Anlage?", a: "Für eine Eigenheimanlage bis 10 kWp werden je Prüftermin etwa 150 bis 400 € genannt, Thermografie kostet zusätzlich. Übers Jahr gerechnet sind Wartung und Prüfung ein Teil der laufenden Kosten, die unser Solarrechner mit 25 € je kWp und Jahr ansetzt." },
    { q: "Woran erkenne ich, dass meine PV-Anlage nicht richtig funktioniert?", a: "An Fehlermeldungen im Wechselrichter oder Portal, an einem Ertrag deutlich unter Vorjahr und Erwartung trotz ähnlichen Wetters oder an einem String, der dauerhaft weniger liefert als die anderen. Dann sollte ein Fachbetrieb prüfen." },
  ],

  howTo: {
    name: "PV-Anlage selbst kontrollieren, ohne aufs Dach zu steigen",
    schritte: [
      { name: "Monitoring prüfen", text: "App oder Portal öffnen, Fehlermeldungen lesen und Warnungen aktivieren." },
      { name: "Erträge vergleichen", text: "Monatsertrag mit Vorjahr und Erwartung vergleichen, bei mehreren Strings auch untereinander." },
      { name: "Zählerstände notieren", text: "Erzeugungs- und Zweirichtungszähler monatlich ablesen." },
      { name: "Sichtprüfung vom Boden", text: "Mit Fernglas auf Glasbruch, verrutschte Module, lose Kabel, Verschmutzung und Tierspuren achten." },
      { name: "Fachbetrieb einschalten", text: "Bei Auffälligkeiten oder spätestens alle vier Jahre eine Prüfung mit Messungen beauftragen." },
    ],
  },

  passend: [
    { href: "/ratgeber/photovoltaik-versicherung", titel: "Photovoltaik-Versicherung", text: "Welche Police welche Schäden abdeckt." },
    { href: "/ratgeber/photovoltaik-nach-20-jahren", titel: "Photovoltaik nach 20 Jahren", text: "Weiterbetrieb, Prüfung und Repowering." },
    { href: "/ratgeber/photovoltaik-verschattung", titel: "Photovoltaik und Verschattung", text: "Wie Schatten und Flecken den Ertrag bremsen." },
    { href: "/service/repowering", titel: "Repowering", text: "Ältere Anlagen modernisieren." },
  ],

  quellen: [
    { titel: "Deutsche Prüfservice – Prüfung von Photovoltaikanlagen: Pflichten, Intervalle, Kosten", url: "https://deutsche-pruefservice.de/dps-klaert-auf/pruefung-photovoltaikanlagen-pflichten-intervalle-kosten/", stand: "06/2026" },
    { titel: "VdS Schadenverhütung / GDV – VdS 3145 Photovoltaikanlagen (Ausgabe 2025-06)", url: "https://shop.vds.de/download/vds-3145", stand: "06/2025" },
    { titel: "Bundesverband Solarwirtschaft – Verschmutzung verursacht relevante Ertrags- und Wertverluste bei PV-Anlagen", url: "https://www.solarwirtschaft.de/2026/04/15/studien-belegen-verschmutzung-verursacht-relevante-ertrags-und-wertverluste-bei-pv-anlagen/", stand: "04/2026" },
    { titel: "solaranlage-ratgeber.de – Reinigung von Photovoltaikanlagen", url: "https://www.solaranlage-ratgeber.de/photovoltaik/photovoltaik-wartung/photovoltaik-reinigung", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Photovoltaik: Garantie- und Versicherungsbedingungen genau lesen", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-garantie-und-versicherungsbedingungen-genau-lesen-6700", stand: "11/2024" },
    { titel: "meteocontrol – Technische Inspektion von PV-Anlagen", url: "https://www.meteocontrol.com/produkte/technische-beratung/technische-inspektion", stand: "09/2026" },
  ],

  seitenCta: { titel: "Stimmt Ihr Ertrag?", text: "Soll-Ertrag für Größe und Ausrichtung berechnen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Fragen zu Ihrer Anlage?",
    text: "Ökovolt plant, montiert und meldet Photovoltaikanlagen aus einer Hand. Sprechen Sie uns an, wenn Sie Fragen zu Betrieb, Ertrag oder Modernisierung Ihrer Anlage haben.",
    primary: { label: "Kontakt aufnehmen", href: "/kontakt" },
    secondary: { label: "Repowering ansehen", href: "/service/repowering" },
  },
};

export default artikel;
