// Ratgeber: Photovoltaik-Angebote vergleichen – Checkliste, Preis je kWp,
// Warnsignale. Preisorientierung aus @/data/solarrechner (wie Solarrechner).

import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eurKwp = (n) => Math.round(n / 10) * 10;
const jahre = (x) => (x ? x.toFixed(1).replace(".", ",") : "über 20");

const GROESSEN = [5, 8, 10, 15, 20, 30];
const REF10 = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });

// Fiktives Beispiel: drei Angebote für dasselbe Haus
const SPEICHER_KWH = ANNAHMEN.speicherPreisProKwh; // €/kWh Orientierung
const A = { kwp: 9.6, preis: 11900, speicher: 0 };
const B = { kwp: 10.0, preis: 14100, speicherKwh: 5 };
const C = { kwp: 10.8, preis: 21500, speicherKwh: 10, speicherPreis: 4900 };
const proKwp = (preisOhneSpeicher, kwp) => eur(preisOhneSpeicher / kwp);

const artikel = {
  slug: "photovoltaik-angebot-vergleichen",
  title: "Photovoltaik-Angebot vergleichen: Checkliste und Warnsignale 2026",
  seoTitle: "PV-Angebot vergleichen: Checkliste & Preis je kWp | Ökovolt",
  kurzTitel: "PV-Angebote vergleichen",
  description:
    "Photovoltaik-Angebote vergleichen: Checkliste aller Positionen, Preis je kWp richtig berechnen, faire Preisspannen 2026 und 9 Warnsignale unseriöser Angebote.",
  excerpt:
    "Drei Angebote, drei Preise, drei verschiedene Leistungsumfänge? So machen Sie PV-Angebote vergleichbar – mit Checkliste, Beispielrechnung und den häufigsten Fallen.",
  hauptKeyword: "photovoltaik angebot vergleichen",
  keywords: ["PV-Angebot prüfen", "Photovoltaik Angebot Checkliste", "Preis pro kWp Photovoltaik", "Solaranlage Angebot vergleichen", "PV-Anlage Angebot Warnsignale", "Photovoltaik Angebot was muss drin sein"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Jobs/jobs4.jpg",
  bildAlt: "Fachplaner prüft auf einem Tablet die Daten einer Photovoltaikanlage",
  badge: { wert: `~${eurKwp(preisProKwp(10)).toLocaleString("de-DE")} €`, text: "je kWp als Orientierung für 10 kWp ohne Speicher" },

  kurzFazit: [
    "**Holen Sie mindestens drei Angebote mit Vor-Ort-Termin ein** und vergleichen Sie nicht den Endpreis, sondern den Preis je kWp ohne Speicher und den genauen Leistungsumfang.",
    `Als Orientierung liegt eine schlüsselfertige 10-kWp-Anlage 2026 bei rund **${eurKwp(preisProKwp(10)).toLocaleString("de-DE")} € je kWp**, kleine Anlagen deutlich darüber, große darunter.`,
    "Ein gutes Angebot nennt **Hersteller, Modell und Stückzahl** jeder Komponente und schließt Gerüst, Zählerschrank, Netzanmeldung und Inbetriebnahme ausdrücklich ein – oder schließt sie nachvollziehbar aus.",
    "**Warnsignale** sind Zeitdruck, hohe Vorkasse, „Module nach Verfügbarkeit“ und Wirtschaftlichkeitsrechnungen mit mehr als 3 % Strompreissteigerung pro Jahr.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "So vergleichen Sie Photovoltaik-Angebote richtig",
      tocLabel: "Kurz erklärt",
      bloecke: [
        {
          typ: "p",
          text: "**PV-Angebote vergleichen Sie richtig, indem Sie sie zuerst auf dieselbe Basis bringen: gleiche Leistung in kWp, gleicher Leistungsumfang, Speicher getrennt bewertet.** Erst dann sagt der Preis etwas aus. Die Verbraucherzentrale NRW beobachtet, dass sich Angebote für dasselbe Dach teils stark unterscheiden – nicht nur beim Preis, sondern vor allem bei den enthaltenen Leistungen und Komponenten.",
        },
        {
          typ: "p",
          text: "Gehen Sie in vier Schritten vor: Vollständigkeit prüfen, Preis je kWp ausrechnen, Komponenten und Garantien vergleichen und zuletzt die beigelegte Wirtschaftlichkeitsrechnung kritisch gegenrechnen. Ein günstiger Endpreis ohne Gerüst, Zählerschrank und Anmeldung kann am Ende teurer sein als ein vollständiges Angebot.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Vollständigkeit prüfen", "Sind Montage, Gerüst, Elektroarbeiten, Zählerschrank, Netzanmeldung, Marktstammdatenregister und Inbetriebnahme enthalten?"],
            ["Preis je kWp berechnen", "Gesamtpreis minus Speicher und Wallbox, geteilt durch die Modulleistung in kWp."],
            ["Komponenten vergleichen", "Hersteller, Modell, Leistung und Garantien von Modulen, Wechselrichter und Speicher."],
            ["Wirtschaftlichkeit gegenrechnen", "Strompreis, Preissteigerung, Ertrag und Eigenverbrauch mit einem neutralen Rechner prüfen."],
          ],
        },
      ],
    },
    {
      id: "preis-je-kwp",
      titel: "Preis je kWp: Welcher Preis ist 2026 fair?",
      tocLabel: "Preis je kWp",
      bloecke: [
        {
          typ: "p",
          text: `**Der Preis je kWp ist die wichtigste Vergleichszahl – gerechnet ohne Speicher und ohne Wallbox.** Die Formel: (Angebotspreis − Speicher − Wallbox) ÷ Modulleistung in kWp. Für eine schlüsselfertige 10-kWp-Anlage auf einem Einfamilienhaus liegen marktübliche Preise 2026 bei etwa 1.000 bis 1.300 Euro je kWp. Fraunhofer ISE nennt im Marktschnitt rund 1.015 Euro je kWp (Stand März 2026). Mehr Hintergrund liefert unser Ratgeber [Was kostet eine Solaranlage?](/ratgeber/solaranlage-kosten).`,
        },
        {
          typ: "tabelle",
          caption: "Orientierungspreise für schlüsselfertige Aufdachanlagen ohne Speicher, 0 % USt, Stand September 2026",
          kopf: ["Anlagengröße", "Preis je kWp (Orientierung)", "Gesamtpreis (Orientierung)"],
          zeilen: GROESSEN.map((k) => [`${k} kWp`, `ca. ${eurKwp(preisProKwp(k)).toLocaleString("de-DE")} €`, `ca. ${eur(Math.round((k * preisProKwp(k)) / 100) * 100)}`]),
          hervorheben: 1,
          markierteZeile: 2,
          fussnote: "Richtwerte aus dem Ökovolt-Solarrechner, abgeleitet aus Marktdaten (u. a. Fraunhofer ISE). Aufpreise sind z. B. bei Zählerschrank-Erneuerung, Denkmalschutz, Flachdach-Aufständerung oder schwierigem Dachzugang üblich. Keine Angebote.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum kleine Anlagen je kWp teurer sind",
          text: "Gerüst, Anfahrt, Elektroinstallation und Anmeldung kosten fast gleich viel – egal ob 5 oder 15 kWp auf dem Dach liegen. Diese Fixkosten verteilen sich bei großen Anlagen auf mehr Leistung. Die Verbraucherzentrale NRW nennt in ihrer Checkliste für Anlagen über 6 kWp eine Spanne von 1.200 bis 2.000 Euro je kWp; diese Angabe stammt allerdings aus 2024, seitdem sind die Preise weiter gesunken.",
        },
        { typ: "h3", text: "Speicher separat bewerten: Preis je kWh" },
        {
          typ: "p",
          text: `Den Speicher bewerten Sie über den Preis je nutzbarer Kilowattstunde. Ist er im Angebot nicht einzeln ausgewiesen, fragen Sie nach dem Preis ohne Speicher – die Differenz ist der Speicherpreis, oft inklusive Hybridwechselrichter. Gemeinsam mit der Anlage installiert rechnen wir im Solarrechner mit rund ${ANNAHMEN.speicherPreisProKwh} € je kWh. Als grobe Größenregel empfiehlt die Verbraucherzentrale etwa 1 kWh Speicher je 1.000 kWh Jahresverbrauch und nicht deutlich mehr kWh als kWp. Welche Größe sich rechnet, zeigt der [Stromspeicher-Rechner](/rechner/stromspeicher).`,
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispiel: Drei Angebote für dasselbe Dach",
      tocLabel: "Beispielvergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Erst der Preis je kWp macht unterschiedlich zusammengestellte Angebote vergleichbar.** Das folgende fiktive Beispiel zeigt einen typischen Fall: ein Einfamilienhaus mit 4.500 kWh Jahresverbrauch und Süddach, drei Anbieter.",
        },
        {
          typ: "tabelle",
          caption: "Fiktives Beispiel: drei PV-Angebote auf gleiche Basis gebracht",
          kopf: ["", "Angebot A", "Angebot B", "Angebot C"],
          zeilen: [
            ["Modulleistung", "9,6 kWp", "10,0 kWp", "10,8 kWp"],
            ["Speicher", "–", "5 kWh (nicht einzeln ausgewiesen)", "10 kWh (4.900 €)"],
            ["Angebotspreis", eur(A.preis), eur(B.preis), eur(C.preis)],
            ["Komponenten benannt", "ja, mit Datenblättern", "„Tier-1-Module nach Verfügbarkeit“", "ja"],
            ["Gerüst, Zählerschrank, Anmeldung", "enthalten", "Zählerschrank „nach Aufwand“", "enthalten"],
            ["Preis je kWp ohne Speicher", proKwp(A.preis, A.kwp), `ca. ${proKwp(B.preis - B.speicherKwh * SPEICHER_KWH, B.kwp)}*`, proKwp(C.preis - C.speicherPreis, C.kwp)],
            ["Amortisation laut Anbieter", "12 Jahre", "nicht angegeben", "6 Jahre"],
          ],
          hervorheben: 1,
          minBreite: 680,
          fussnote: `* Speicheranteil mit ${SPEICHER_KWH} €/kWh geschätzt – beim Anbieter nachfragen. Zum Vergleich: Der Solarrechner kommt für 10 kWp ohne Speicher auf rund ${jahre(REF10.amortisationJahre)} Jahre Amortisation.`,
        },
        {
          typ: "p",
          text: `Angebot A ist nicht das billigste, aber vollständig und transparent. Angebot B wirkt günstig, lässt aber offen, welche Module kommen und was der Zählerschrank kostet – bei älteren Häusern schnell ein vierstelliger Betrag. Angebot C liegt je kWp klar über dem Marktniveau und verspricht eine Amortisation, die mit realistischen Annahmen nicht erreichbar ist: Unser Rechenkern kommt schon für eine günstigere Anlage ohne Speicher auf rund ${jahre(REF10.amortisationJahre)} Jahre.`,
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Was muss in einem PV-Angebot stehen?",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "p",
          text: "**Ein vollständiges PV-Angebot enthält alle Leistungen bis zur betriebsbereiten, angemeldeten Anlage – mit Einzelpositionen.** Haken Sie diese Punkte in jedem Angebot ab. Was fehlt, fragen Sie schriftlich nach.",
        },
        { typ: "h3", text: "Leistungsumfang" },
        {
          typ: "checkliste",
          punkte: [
            "**Montage** inklusive Unterkonstruktion, Kleinmaterial und DC-Verkabelung",
            "**Gerüst bzw. Absturzsicherung** für die gesamte Bauzeit",
            "**Elektroinstallation**: AC-Anschluss, Überspannungsschutz, Potenzialausgleich",
            "**Zählerschrank**: geprüft und – falls nötig – Erneuerung nach [VDE-AR-N 4100](/wissen/lexikon#vde-ar-n-4100) mit Preis",
            "**Netzanmeldung** beim Netzbetreiber und Eintrag im [Marktstammdatenregister](/wissen/lexikon#marktstammdatenregister)",
            "**Inbetriebnahme** mit Protokoll, Einweisung und Dokumentation (Stringplan, Datenblätter)",
            "**Monitoring** bzw. Ertragsüberwachung per App oder Portal",
            "**0 % Umsatzsteuer** ausgewiesen (§ 12 Abs. 3 UStG) – Wallboxen fallen nicht darunter",
          ],
        },
        { typ: "h3", text: "Komponenten" },
        {
          typ: "tabelle",
          caption: "Komponenten im Angebot: Was angegeben sein sollte",
          kopf: ["Komponente", "Pflichtangaben im Angebot", "Worauf achten"],
          zeilen: [
            ["Solarmodule", "Hersteller, Modell, Wp je Modul, Stückzahl", "Glas-Glas oder Glas-Folie, Produkt- und Leistungsgarantie (Jahre, Restleistung)"],
            ["Wechselrichter", "Hersteller, Modell, Nennleistung in kW", "Hybridfähigkeit für späteren Speicher, Anzahl MPP-Tracker bei mehreren Dachflächen"],
            ["Speicher", "Hersteller, Modell, nutzbare Kapazität in kWh", "Zellchemie (meist LFP), Garantie auf Jahre und Zyklen, Not- oder Ersatzstrom"],
            ["Unterkonstruktion", "System, Dachhaken, Befestigung", "passend zur Dacheindeckung, Statik bei Flachdach"],
            ["Steuerung & Messung", "Energiemanager, Smart Meter bzw. Steuerbox", "Umsetzung der 60-%-Regel ohne unnötige Ertragsverluste"],
          ],
          minBreite: 640,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Hersteller: Qualität statt Marketingbegriffe",
          text: "Begriffe wie „Premium-Module“ oder „Tier 1“ sagen wenig über Ihr konkretes Produkt. Entscheidend sind Datenblatt, Garantiebedingungen und ein Hersteller mit Service in Deutschland. Ökovolt arbeitet unter anderem mit Sigenergy, Fronius, Huawei, Solis, BYD und meteocontrol zusammen – für Ihren Vergleich zählt aber allein, dass jedes Angebot seine Komponenten offenlegt.",
        },
        { typ: "h3", text: "Technik plausibel?" },
        {
          typ: "p",
          text: "Die Nennleistung des Wechselrichters sollte zur Modulleistung passen; die Verbraucherzentrale NRW nennt als Richtwert etwa 90 bis 110 % der kWp. Bei Ost-West-Dächern ist ein etwas kleinerer Wechselrichter oft sinnvoll, weil nie alle Module gleichzeitig volle Leistung bringen. Seit dem [Solarspitzengesetz](/wissen/lexikon#solarspitzengesetz) dürfen neue Anlagen ohne Steuerbox höchstens 60 % ihrer Leistung einspeisen – ein gutes Angebot erklärt, wie das umgesetzt wird.",
        },
      ],
    },
    {
      id: "warnsignale",
      titel: "9 Warnsignale für unseriöse PV-Angebote",
      tocLabel: "Warnsignale",
      bloecke: [
        {
          typ: "p",
          text: "**Das deutlichste Warnsignal ist Zeitdruck ohne Vor-Ort-Termin.** Nur bei einer Besichtigung lassen sich Verschattung, Dachzustand, Statik und Zählerschrank verlässlich beurteilen. Seien Sie außerdem vorsichtig bei:",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Kein Vor-Ort-Termin", text: "Angebote nur nach Satellitenbild übersehen Zählerschrank, Dachzustand und Kabelwege." },
            { titel: "„Nur heute gültig“", text: "Rabatte mit Frist von Stunden oder Tagen setzen unter Druck. Seriöse Angebote gelten mehrere Wochen." },
            { titel: "Hohe Vorkasse", text: "Die Verbraucherzentrale rät, Vorkasse zu vermeiden. Üblich sind Abschläge nach Lieferung und Fertigstellung." },
            { titel: "Vage Komponenten", text: "„Module nach Verfügbarkeit“ oder „gleichwertig“ ohne Liste erlaubt einen späteren Tausch gegen Günstigeres." },
            { titel: "Pauschale ohne Positionen", text: "Ohne Einzelpreise können Sie Speicher, Zählerschrank und Montage nicht vergleichen." },
            { titel: "Traum-Amortisation", text: "Mehr als 3 % Strompreissteigerung pro Jahr hält die Verbraucherzentrale NRW für unrealistisch." },
            { titel: "Überdimensionierter Speicher", text: "Deutlich mehr kWh als kWp oder als 1 kWh je 1.000 kWh Verbrauch rechnet sich selten." },
            { titel: "Umsatzsteuer ausgewiesen", text: "Für Wohngebäude gilt der Nullsteuersatz. 19 % im Angebot sind ein Fehler oder ein Hinweis auf Unkenntnis." },
            { titel: "Anschluss „durch den Kunden“", text: "Arbeiten an der Kundenanlage am Netz darf nur ein im Installateurverzeichnis eines Netzbetreibers eingetragener Betrieb ausführen (§ 13 NAV)." },
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Widerrufsrecht und Gewährleistung",
          text: "Verträge, die außerhalb von Geschäftsräumen – etwa bei Ihnen zu Hause – oder ausschließlich per Telefon, E-Mail bzw. online geschlossen werden, können Verbraucher in der Regel 14 Tage lang widerrufen. Mängelansprüche verjähren je nach Einbausituation nach zwei oder – wenn die Anlage als Arbeit an einem Bauwerk gilt – nach fünf Jahren. Herstellergarantien kommen zusätzlich und gelten nach den jeweiligen Bedingungen.",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Die Wirtschaftlichkeitsrechnung im Angebot prüfen",
      tocLabel: "Wirtschaftlichkeit prüfen",
      bloecke: [
        {
          typ: "p",
          text: "**Prüfen Sie in jeder Wirtschaftlichkeitsrechnung vier Annahmen: Strompreis, jährliche Preissteigerung, spezifischer Ertrag und Eigenverbrauchsanteil.** Laut Verbraucherzentrale NRW werden gerade hier häufig zu optimistische Werte angesetzt, um ein Angebot schönzurechnen.",
        },
        {
          typ: "tabelle",
          caption: "Realistische Annahmen für eine Wirtschaftlichkeitsrechnung, Stand September 2026",
          kopf: ["Annahme", "Realistisch", "Kritisch, wenn …"],
          zeilen: [
            ["Strompreis (Arbeitspreis)", `ca. ${String(Math.round(ANNAHMEN.strompreis * 100)).replace(".", ",")}–37 ct/kWh`, "deutlich über Ihrem tatsächlichen Arbeitspreis"],
            ["Strompreissteigerung", `${Math.round(ANNAHMEN.strompreisSteigerung * 100)}–3 % pro Jahr`, "über 3 % pro Jahr über 20 Jahre"],
            ["Ertrag Süddach", `ca. 900–${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp`, "über 1.100 kWh/kWp ohne Begründung"],
            ["Autarkie ohne Speicher", "ca. 25–40 %", "über 45 % ohne Speicher"],
            ["Autarkie mit Speicher", "ca. 55–75 %", "über 80 %"],
            ["Betriebskosten", `ca. ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr`, "gar nicht berücksichtigt"],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Werte angelehnt an die Annahmen des Ökovolt-Solarrechners, die Checkliste der Verbraucherzentrale NRW und die Autarkie-Richtwerte im [Lexikon](/wissen/lexikon#autarkiegrad). Norddeutschland erreicht eher 900 kWh/kWp.",
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Angebot mit neutralen Annahmen gegenrechnen",
          text: "Anlagengröße, Preis und Verbrauch eingeben – der Solarrechner zeigt Ertrag, Autarkie und Amortisation mit vorsichtigen Werten.",
          label: "Zum Solarrechner",
        },
        {
          typ: "p",
          text: `Achten Sie auch auf den Betrachtungszeitraum. Die Einspeisevergütung ist für 20 Jahre fest; idealerweise sollte sich die Anlage innerhalb dieses Zeitraums bezahlt machen. Rechnungen über 30 Jahre sind legitim, müssen dann aber den Tausch von Wechselrichter und gegebenenfalls Speicher enthalten. Wie sich Photovoltaik realistisch rechnet, zeigt der Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).`,
        },
      ],
    },
    {
      id: "vertrag",
      titel: "Vor der Unterschrift: Vertrag, Zahlung und Förderung",
      tocLabel: "Vor der Unterschrift",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Zahlungsplan** schriftlich: möglichst keine oder nur geringe Anzahlung, Rest nach Montage und Inbetriebnahme.",
            "**Liefer- und Montagetermin** verbindlich festhalten, besonders wenn doch eine Anzahlung vereinbart wird.",
            "**Förderung vor Auftrag klären:** Kommunale Zuschüsse und der [KfW-Kredit 270](/wissen/lexikon#kfw-270) müssen meist vor Vertragsabschluss beantragt werden. Überblick im [Förder-Check](/foerdercheck).",
            "**Finanzierung des Anbieters** mit Hausbank und KfW-Konditionen vergleichen – mehr unter [Finanzierung](/service/finanzierung).",
            "**Firmencheck:** Handwerksrolle, Referenzen in der Region und ein Blick in insolvenzbekanntmachungen.de.",
            "**Service nach der Montage:** Wer ist bei Störungen erreichbar, und was kostet eine Wartung?",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Kostenlose Hilfe beim Vergleich",
          text: "Die Verbraucherzentrale NRW bietet Privathaushalten in Nordrhein-Westfalen einen kostenlosen Vergleich von bis zu drei PV-Angeboten an, die Bearbeitung dauert laut eigener Angabe zwei bis drei Wochen. In anderen Bundesländern hilft die Energieberatung der Verbraucherzentrale.",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viele Angebote sollte ich für eine PV-Anlage einholen?", a: "Mindestens drei, jeweils mit Vor-Ort-Termin. So erkennen Sie, welche Preisspanne für Ihr Dach realistisch ist und welcher Anbieter den Leistungsumfang am transparentesten beschreibt." },
    { q: "Was kostet eine PV-Anlage pro kWp 2026?", a: `Als Orientierung liegen schlüsselfertige Anlagen mit 10 kWp bei rund ${eurKwp(preisProKwp(10)).toLocaleString("de-DE")} € je kWp ohne Speicher, kleine Anlagen um 5 kWp eher bei ${eurKwp(preisProKwp(5)).toLocaleString("de-DE")} €. Details im Ratgeber [Solaranlage Kosten](/ratgeber/solaranlage-kosten).` },
    { q: "Wie berechne ich den Preis pro kWp?", a: "Ziehen Sie vom Angebotspreis die Kosten für Speicher und Wallbox ab und teilen Sie den Rest durch die Modulleistung in kWp. Ist der Speicher nicht einzeln ausgewiesen, fragen Sie nach dem Preis ohne Speicher." },
    { q: "Ist eine Anzahlung bei Photovoltaik üblich?", a: "Viele Betriebe verlangen Abschläge, etwa bei Materiallieferung. Die Verbraucherzentrale rät, Vorkasse ganz oder weitgehend zu vermeiden und bei einer Anzahlung feste Liefer- und Montagetermine schriftlich zu vereinbaren." },
    { q: "Muss im PV-Angebot Mehrwertsteuer stehen?", a: "Für Anlagen auf oder an Wohngebäuden inklusive Speicher und Montage gilt seit 2023 der Nullsteuersatz nach § 12 Abs. 3 UStG. Wallboxen sind davon ausgenommen und werden mit 19 % berechnet." },
    { q: "Woran erkenne ich ein unseriöses Solarangebot?", a: "Typisch sind Zeitdruck, fehlender Vor-Ort-Termin, hohe Vorkasse, unbenannte Komponenten und eine Amortisation, die nur mit überhöhter Strompreissteigerung aufgeht. Lassen Sie sich im Zweifel von der Verbraucherzentrale beraten." },
    { q: "Was ist, wenn der Zählerschrank im Angebot fehlt?", a: "Fragen Sie nach, ob er geprüft wurde. Ältere Zählerschränke müssen für eine PV-Anlage oft erneuert werden, was je nach Aufwand mehrere hundert bis einige tausend Euro kosten kann. Ein gutes Angebot nennt dafür einen Preis oder bestätigt, dass keine Erneuerung nötig ist." },
  ],

  passend: [
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage 2026?", text: "Preise je kWp und was im Komplettpreis steckt." },
    { href: "/ratgeber/photovoltaik-ablauf", titel: "Ablauf der PV-Installation", text: "Von der Anfrage bis zur Inbetriebnahme." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Welche Speichergröße sich für Sie lohnt." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Transparentes Angebot mit Vor-Ort-Prüfung." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale NRW – Checkliste Vergleich von Photovoltaik-Angeboten", url: "https://www.verbraucherzentrale.nrw/sites/default/files/2024-07/checkliste_photovoltaik_edit_final.pdf", stand: "07/2024" },
    { titel: "Verbraucherzentrale NRW – Photovoltaik-Angebotsvergleich", url: "https://www.verbraucherzentrale.nrw/photovoltaikangebotsvergleich-123188", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "03/2026" },
    { titel: "§ 12 Abs. 3 UStG – Nullsteuersatz für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html", stand: "09/2026" },
    { titel: "DBZ – BGH (VII ZR 348/13): Fünfjährige Gewährleistung bei Photovoltaikanlagen möglich", url: "https://www.dbz.de/artikel/dbz_Fuer_die_Errichtung_einer_Photovoltaikanlage_kann_eine_fuenfjaehrige_Gew-3333379.html", stand: "09/2026" },
    { titel: "§ 13 NAV – Installateurverzeichnis", url: "https://www.gesetze-im-internet.de/nav/__13.html", stand: "09/2026" },
    { titel: "Insolvenzbekanntmachungen der Justiz von Bund und Ländern", url: "https://www.insolvenzbekanntmachungen.de/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Angebot gegenrechnen", text: "Prüfen Sie Ertrag und Amortisation mit neutralen Annahmen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Ein Angebot, das jeden Vergleich aushält.",
    text: "Wir kommen vor Ort, prüfen Dach, Verschattung und Zählerschrank und legen alle Komponenten und Positionen offen – damit Sie in Ruhe vergleichen können.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
