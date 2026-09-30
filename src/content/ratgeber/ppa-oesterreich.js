// Ratgeber (AT): Power Purchase Agreements (PPA) in Österreich
// Zahlenbasis: E-Control (Quartalsmarktpreis Q3/2026 als Terminmarkt-Indikator, Stromkennzeichnung/HKN),
// Energy-Charts (eigene Auswertung Solar-Marktwert AT), ElWG (BGBl. I Nr. 91/2025). Stand 28.09.2026.
// PPA-Preis, Stromgestehungskosten und Ertrag im Beispiel sind offengelegte Annahmen. Keine Imports.

// ---------------------------------------------------------------- Formatierung
const n = (x) => Math.round(x).toLocaleString("de-DE");
const eur = (x) => n(x) + " €";
const kwhFmt = (x) => n(x) + " kWh";
const z3 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const z2 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const z1 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pct = (x) => Math.round(x * 100) + " %";
const vz = (x) => (x >= 0 ? "+" : "−") + eur(Math.abs(x));

// ---------------------------------------------------------------- Marktdaten
const TERMIN_Q3_2026 = 10.923; // ct/kWh, E-Control-Quartalsmarktpreis Q3/2026 (Mittel EEX-Base-Futures)
const SOLAR = [
  { jahr: "2024", base: 81.9, solar: 53.0 },
  { jahr: "2025", base: 99.0, solar: 49.3 },
  { jahr: "2026 (bis 27.9.)", base: 121.3, solar: 62.1 },
];
const CAPTURE_ANNAHME = 0.5; // Capture-Rate als Annahme (2025: 50 %, 2026 YTD: 51 %)
const NEG_STD = { 2024: 307, 2025: 378, 2026: 259 };
const PV_IN_NEG_2025 = 0.21;

// ---------------------------------------------------------------- Beispiel 1 MWp
const KWP = 1000;
const ERTRAEGE = [1050, 1100, 1150]; // kWh/kWp je Region – Annahme
const ERTRAG_MITTE = 1100;
const MENGE = KWP * ERTRAG_MITTE;
const PPA_PREIS = 6.5; // ct/kWh Pay-as-produced – Annahme, kein Marktangebot
const LCOE_ANNAHME = 6.0; // ct/kWh Stromgestehungskosten des Erzeugers – Annahme
const REFERENZEN = [
  { titel: "Solar-Marktwert 2024", ct: SOLAR[0].solar / 10 },
  { titel: "Solar-Marktwert 2025", ct: SOLAR[1].solar / 10 },
  { titel: "Solar-Marktwert 2026 (bis 27.9.)", ct: SOLAR[2].solar / 10 },
  { titel: `Terminmarkt-Base Q3/2026 × ${pct(CAPTURE_ANNAHME)} Capture-Rate`, ct: TERMIN_Q3_2026 * CAPTURE_ANNAHME },
  { titel: "Terminmarkt-Base Q3/2026 (Baseload-Referenz)", ct: TERMIN_Q3_2026 },
].map((r) => ({ ...r, wert: (MENGE * r.ct) / 100, diff: (MENGE * (PPA_PREIS - r.ct)) / 100 }));
const ZAHLUNG = (MENGE * PPA_PREIS) / 100;

const artikel = {
  slug: "ppa-oesterreich",
  title: "PPA in Österreich: Modelle, Preise und Risiken für Unternehmen",
  seoTitle: "PPA Österreich: Modelle, Preise & Risiken | Ökovolt",
  kurzTitel: "PPA in Österreich",
  description:
    "PPA in Österreich: On-site und Off-site, Pay-as-produced oder Baseload, Herkunftsnachweise, Risiken und wie sich ein fairer PPA-Preis errechnet – mit Beispiel.",
  excerpt:
    "Wie Power Purchase Agreements in Österreich funktionieren, welche Preismodelle es gibt, warum die Capture-Rate den fairen Preis bestimmt und was in den Vertrag gehört.",
  hauptKeyword: "ppa österreich",
  keywords: [
    "PPA Österreich",
    "Power Purchase Agreement",
    "PPA Photovoltaik",
    "Corporate PPA",
    "On-site PPA",
    "PPA Preis",
    "Stromabnahmevertrag Unternehmen",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg",
  bildAlt: "Photovoltaikanlagen auf Gewerbedächern und einer Freifläche in Dornbirn, Vorarlberg",
  badge: { wert: pct(SOLAR[1].solar / SOLAR[1].base), text: "Capture-Rate Solar 2025 in Österreich" },

  kurzFazit: [
    "**Ein PPA ist ein langfristiger Stromliefervertrag zwischen Erzeuger und Abnehmer mit vorab vereinbartem Preis und Mengenregeln** – on-site mit der Anlage am Standort des Abnehmers oder off-site über das Netz bzw. rein finanziell.",
    "**Übliche Laufzeiten liegen als Richtwert bei 5 bis 15 Jahren, bei On-site-Modellen oft 10 bis 20 Jahre.** Preismodelle reichen von Pay-as-produced über Baseload-Profile bis zu Fixpreisen mit Floor und Cap.",
    `**Der faire PPA-Preis für Solarstrom orientiert sich am erwarteten Solar-Marktwert, nicht am Base-Preis:** 2025 erreichte Solarstrom in Österreich nur ${pct(SOLAR[1].solar / SOLAR[1].base)} des Base-Preises (${z1(SOLAR[1].solar)} gegenüber ${z1(SOLAR[1].base)} €/MWh).`,
    `**Als Terminmarkt-Indikator dient der Quartalsmarktpreis der E-Control:** ${z3(TERMIN_Q3_2026)} ct/kWh für Q3/2026. Mit einer Capture-Rate von ${pct(CAPTURE_ANNAHME)} ergibt das rund ${z2(TERMIN_Q3_2026 * CAPTURE_ANNAHME)} ct/kWh als Solar-Referenz.`,
    "**Grünstrom zählt nur mit Herkunftsnachweisen:** In Österreich ist seit 2015 nur gekennzeichneter Strom erlaubt; die Nachweise werden in der Datenbank der E-Control verwaltet und müssen vertraglich übertragen werden.",
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist ein PPA und welche Formen gibt es?",
      tocLabel: "PPA-Formen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Power Purchase Agreement (PPA) ist ein langfristiger Vertrag, in dem ein Erzeuger Strom aus einer bestimmten Anlage zu vorab vereinbarten Konditionen an einen Abnehmer verkauft.** Der Abnehmer sichert sich Preis und Herkunft, der Erzeuger planbare Erlöse – oft die Grundlage für die Finanzierung einer Freiflächen- oder großen Dachanlage. Kurzdefinition im Lexikon: [PPA](/wissen/lexikon#ppa).",
        },
        {
          typ: "tabelle",
          caption: "PPA-Formen in Österreich im Vergleich, Stand September 2026",
          kopf: ["Form", "Lieferung", "Vertragskonstruktion", "Typisch für"],
          zeilen: [
            ["On-site-PPA", "Anlage am Standort des Abnehmers, Strom fließt hinter dem Zähler", "Contracting, Pacht oder Miete der Anlage plus Liefer- bzw. Nutzungsvertrag", "Gewerbedächer, Carports, Betriebsflächen"],
            ["Off-site-PPA physisch", "über das öffentliche Netz, Fahrplanlieferung zwischen Bilanzgruppen", "Liefervertrag, meist mit Händler oder Lieferant als Dienstleister (Sleeved PPA)", "Freiflächen, Agri-PV, mehrere Standorte"],
            ["Off-site-PPA finanziell (virtuell)", "keine physische Lieferung; Strom wird am Markt verkauft", "Differenzvertrag: Ausgleich zwischen Fixpreis und Marktpreis, Herkunftsnachweise separat übertragen", "große Abnehmer mit eigener Beschaffung"],
          ],
          minBreite: 760,
          fussnote: "Vereinfachte Darstellung. Bei On-site-Modellen wird die Anlage häufig an den Abnehmer verpachtet oder vermietet, sodass dieser selbst Betreiber ist; liefert ein Dritter Strom, sind energierechtliche Pflichten zu prüfen. Finanzielle PPA können finanzmarktrechtliche Fragen aufwerfen. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Beim On-site-Modell ist die Abgrenzung zu Miete, Leasing und Contracting fließend – die Unterschiede erklärt der Ratgeber [Photovoltaik mieten oder kaufen](/ratgeber/photovoltaik-mieten-oder-kaufen). Off-site-PPA betreffen vor allem [Freiflächen-Photovoltaik](/freiflaechen-photovoltaik), für die zuerst Widmung und Netzanschluss geklärt sein müssen – siehe [Freiflächen-PV und Widmung](/ratgeber/freiflaechen-photovoltaik-widmung).",
        },
      ],
    },
    {
      id: "preismodelle",
      titel: "Welche Preismodelle gibt es bei PPA?",
      tocLabel: "Preismodelle",
      bloecke: [
        {
          typ: "p",
          text: "**Die wichtigsten Preismodelle sind Pay-as-produced, Baseload bzw. Profil, Fixpreis und Mischformen mit Floor und Cap – sie unterscheiden sich vor allem darin, wer Profil- und Mengenrisiko trägt.** Dazu kommt die Frage, ob der Preis über die Laufzeit fix bleibt oder indexiert wird.",
        },
        {
          typ: "tabelle",
          caption: "PPA-Preismodelle und Risikoverteilung, Stand September 2026",
          kopf: ["Modell", "Funktionsweise", "Profil- und Mengenrisiko", "Für wen geeignet"],
          zeilen: [
            ["Pay-as-produced", "Abnehmer zahlt Fixpreis für die tatsächlich erzeugte Menge", "beim Abnehmer", "Abnehmer mit Tagverbrauch oder Portfolio-Beschaffung"],
            ["Baseload / Profil", "Erzeuger liefert ein festes Band oder Profil; Fehlmengen kauft er zu", "beim Erzeuger bzw. Händler (gegen Aufschlag)", "Abnehmer mit gleichmäßiger Last"],
            ["Fixpreis ohne Indexierung", "ein Preis über die ganze Laufzeit", "je nach Mengenmodell", "hohe Planbarkeit, Inflationsrisiko beim Erzeuger"],
            ["Indexiert", "Preis steigt nach vereinbartem Index (z. B. Verbraucherpreisindex)", "je nach Mengenmodell", "lange Laufzeiten"],
            ["Floor / Cap (Collar)", "Marktpreis mit Unter- und Obergrenze", "geteilt", "Parteien, die Chancen und Risiken teilen wollen"],
          ],
          minBreite: 760,
          fussnote: "Eigene Zusammenstellung. In der Praxis werden Modelle kombiniert, etwa Pay-as-produced mit Negativpreisklausel und Indexierung.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Laufzeiten als Richtwert",
          text: "Off-site-PPA laufen häufig 5 bis 15 Jahre, On-site-Modelle mit Contracting oder Pacht oft 10 bis 20 Jahre – orientiert an Finanzierung und Lebensdauer der Anlage. Kürzere Laufzeiten sind flexibler, bringen dem Erzeuger aber weniger Finanzierungssicherheit.",
        },
      ],
    },
    {
      id: "herkunftsnachweise",
      titel: "Herkunftsnachweise und Stromkennzeichnung",
      tocLabel: "Herkunftsnachweise",
      bloecke: [
        {
          typ: "p",
          text: "**Ohne Herkunftsnachweise (HKN) kann ein Abnehmer PPA-Strom weder in der Stromkennzeichnung noch in der Klimabilanz als erneuerbar ausweisen.** In Österreich müssen Stromlieferanten ihre gesamte Lieferung mit Nachweisen kennzeichnen; Strom unbekannter Herkunft („Graustrom“) ist seit Jänner 2015 verboten. Die Nachweise werden zentral in der Herkunftsnachweis-Datenbank der E-Control verwaltet, damit keiner doppelt verwendet wird.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Ausstellung:** HKN werden für die erzeugte Menge der Anlage in der Datenbank der E-Control ausgestellt – der Erzeuger muss die Anlage dort registrieren lassen.",
            "**Übertragung:** Im PPA regeln, dass die HKN der vertraglichen Menge an den Abnehmer oder dessen Lieferanten übertragen werden (gebündelter PPA).",
            "**Zeitgleichheit:** Klären, ob monatliche oder jährliche Zuordnung genügt – für Nachhaltigkeitsberichte zählt zunehmend die zeitliche Nähe.",
            "**Stromkennzeichnung:** Der Lieferant des Abnehmers weist den PPA-Strom über die HKN in seiner Kennzeichnung aus.",
          ],
        },
        {
          typ: "p",
          text: "Für die Berichterstattung nach CSRD ist vor allem Scope 2 relevant: Im marktbasierten Ansatz dürfen Unternehmen vertragliche Instrumente wie PPA mit Herkunftsnachweisen ansetzen, im standortbasierten Ansatz zählt der Netzmix. Wie Photovoltaik in die ESG-Berichterstattung einfließt, zeigt der Ratgeber [CSRD und ESG](/ratgeber/csrd-esg-photovoltaik); Begriffe: [Herkunftsnachweis](/wissen/lexikon#herkunftsnachweis) und [Scope 2](/wissen/lexikon#scope-2).",
        },
      ],
    },
    {
      id: "risiken",
      titel: "Welche Risiken hat ein PPA?",
      tocLabel: "Risiken",
      bloecke: [
        {
          typ: "p",
          text: `**Die größten Risiken eines Solar-PPA sind Profil- und Kannibalisierungsrisiko, Mengenrisiko, negative Preise, Bonität der Vertragspartner und Gesetzesänderungen.** Wie stark das Profil wirkt, zeigen die Marktdaten: 2025 fielen laut eigener Auswertung auf Basis Energy-Charts ${pct(PV_IN_NEG_2025)} des österreichischen PV-Stroms in Stunden mit negativem Preis; insgesamt gab es ${n(NEG_STD[2025])} solcher Stunden (2024: ${n(NEG_STD[2024])}, 2026 bis 27.9.: ${n(NEG_STD[2026])}).`,
        },
        {
          typ: "tabelle",
          caption: "Risiken eines PPA und übliche Absicherung, Stand September 2026",
          kopf: ["Risiko", "Was passiert", "Übliche Absicherung"],
          zeilen: [
            ["Profilrisiko / Kannibalisierung", `Solarstrom ist am Markt deutlich weniger wert als Base (Capture-Rate 2025: ${pct(SOLAR[1].solar / SOLAR[1].base)}); mit weiterem PV-Zubau kann sie sinken`, "Preisfindung auf Basis erwarteter Capture-Rate, Speicher, Profilprodukte"],
            ["Mengenrisiko", "Ertrag schwankt mit Wetter, Verfügbarkeit, Abregelung", "Mengenbänder, P50/P90-Gutachten, Verfügbarkeitsgarantie"],
            ["Negative Preise", "Einspeisung in negativen Stunden kostet Geld", "Negativpreisklausel: keine Zahlung oder Abregelung ab einem Schwellenwert"],
            ["Ausgleichsenergie", "Abweichungen von der Prognose verursachen Kosten in der Bilanzgruppe", "klare Zuordnung, wer Prognose und Ausgleichsenergie trägt"],
            ["Bonität", "Ausfall von Abnehmer oder Erzeuger über viele Jahre", "Garantien, Bankgarantie, Patronatserklärung, Kündigungsrechte"],
            ["Change in law", "neue Abgaben oder Regeln, z. B. ElWG mit Versorgungsinfrastrukturbeitrag ab 2027 und neuen Netzentgelten", "Klausel zur Kostenaufteilung und Neuverhandlung"],
            ["Curtailment", "Netzbetreiber begrenzt Einspeisung (laut ElWG nicht unter 70 % der Modulspitzenleistung)", "Regel, ob abgeregelte Mengen vergütet werden"],
          ],
          minBreite: 760,
          fussnote: "Marktdaten: eigene Auswertung auf Basis Energy-Charts (Gebotszone AT). Rechtslage ElWG: BGBl. I Nr. 91/2025, viele Bestimmungen gestaffelt in Kraft. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Die Mechanik negativer Preise und warum sie vor allem im Frühjahr zu Mittag auftreten, erklärt der Ratgeber [negative Strompreise](/ratgeber/negative-strompreise). Zu den neuen Regeln für Einspeiser siehe [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
      ],
    },
    {
      id: "fairer-preis",
      titel: "Wie errechnet sich ein fairer PPA-Preis?",
      tocLabel: "Fairer PPA-Preis",
      bloecke: [
        {
          typ: "p",
          text: "**Ein fairer PPA-Preis liegt zwischen den Stromgestehungskosten des Erzeugers und dem Wert, den der Strom mit seinem Profil für den Abnehmer hat – bei Solar also nahe am erwarteten Solar-Marktwert plus einem Aufschlag für Preissicherheit und Herkunftsnachweise.** Drei Ankerwerte helfen bei der Einordnung:",
        },
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Untergrenze des Erzeugers:** die [Stromgestehungskosten](/wissen/lexikon#stromgestehungskosten) der Anlage inklusive Kapitalkosten, Betrieb, Pacht und Risiko. Sie sind projektspezifisch und hängen stark von Investition, Ertrag und Finanzierung ab.",
            `**Erwarteter Marktwert des Profils:** Terminmarktpreis für Base mal erwartete Capture-Rate. Mit dem E-Control-Quartalsmarktpreis Q3/2026 von ${z3(TERMIN_Q3_2026)} ct/kWh als Indikator und einer Capture-Rate von ${pct(CAPTURE_ANNAHME)} ergeben sich rund ${z2(TERMIN_Q3_2026 * CAPTURE_ANNAHME)} ct/kWh.`,
            `**Obergrenze für Baseload-Bedarf:** Ein Abnehmer mit gleichmäßiger Last vergleicht mit Base-Beschaffung (Indikator ${z3(TERMIN_Q3_2026)} ct/kWh). Ein Pay-as-produced-Vertrag deckt aber nur die Sonnenstunden; den Rest muss er weiter beschaffen.`,
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Base-Preis ist nicht der Solar-Preis",
          text: `Der häufigste Denkfehler: Ein PPA-Preis wird mit dem Base-Terminpreis verglichen und wirkt dann günstig. Für ein Pay-as-produced-Profil zählt aber der Solar-Marktwert – 2025 lag er in Österreich bei ${z1(SOLAR[1].solar)} €/MWh, 2026 bis Ende September bei ${z1(SOLAR[2].solar)} €/MWh. Wer das übersieht, zahlt für das Profil unbewusst eine hohe Prämie.`,
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: 1 MWp mit Pay-as-produced-PPA",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Bei einem angenommenen PPA-Preis von ${z1(PPA_PREIS)} ct/kWh und ${kwhFmt(MENGE)} Jahreserzeugung zahlt der Abnehmer rund ${eur(ZAHLUNG)} im Jahr – ob das fair ist, zeigt erst der Vergleich mit dem Marktwert derselben Menge.** Annahmen: 1 MWp Freifläche oder Dach, spezifischer Ertrag je nach Region ${n(ERTRAEGE[0])} bis ${n(ERTRAEGE[2])} kWh/kWp, Stromgestehungskosten des Erzeugers ${z1(LCOE_ANNAHME)} ct/kWh. Alle drei Werte sind Rechenannahmen, keine Marktangebote.`,
        },
        {
          typ: "tabelle",
          caption: "1 MWp: Jahresmenge und PPA-Zahlung je nach Ertrag, Stand September 2026",
          kopf: ["Spezifischer Ertrag", "Jahresmenge", `PPA-Zahlung bei ${z1(PPA_PREIS)} ct`, `Marge über ${z1(LCOE_ANNAHME)} ct Gestehungskosten`],
          zeilen: ERTRAEGE.map((e) => {
            const m = KWP * e;
            return [`${n(e)} kWh/kWp`, kwhFmt(m), eur((m * PPA_PREIS) / 100), eur((m * (PPA_PREIS - LCOE_ANNAHME)) / 100)];
          }),
          markierteZeile: 1,
          hervorheben: 2,
          minBreite: 640,
          fussnote: `Annahmen offengelegt: ${n(KWP)} kWp, Ertrag als regionale Spanne, ohne Degradation, Abregelung und Ausgleichsenergie. Gestehungskosten projektspezifisch.`,
        },
        {
          typ: "tabelle",
          caption: `Vergleich: PPA-Preis ${z1(PPA_PREIS)} ct/kWh gegenüber Marktreferenzen für ${kwhFmt(MENGE)}, Stand September 2026`,
          kopf: ["Referenz", "ct/kWh", "Marktwert der Jahresmenge", "Differenz PPA − Referenz"],
          zeilen: REFERENZEN.map((r) => [r.titel, z2(r.ct), eur(r.wert), vz(r.diff)]),
          hervorheben: 3,
          markierteZeile: 3,
          minBreite: 720,
          fussnote: `Solar-Marktwert = erzeugungsgewichteter Day-Ahead-Preis AT (eigene Auswertung auf Basis Energy-Charts). Terminmarkt-Indikator = E-Control-Quartalsmarktpreis Q3/2026 (Mittel der EEX-Base-Quartalsfutures Österreich). Positive Differenz: Abnehmer zahlt mehr als den Marktwert (Prämie für Preissicherheit und HKN); negative Differenz: Abnehmer spart gegenüber der Referenz.`,
        },
        {
          typ: "p",
          text: `Lesart: Gegenüber dem Solar-Marktwert 2025 hätte der Abnehmer rund ${eur(REFERENZEN[1].diff)} im Jahr mehr bezahlt, gegenüber 2026 nur ${eur(REFERENZEN[2].diff)}. Diese Prämie kauft Preissicherheit über viele Jahre und Herkunftsnachweise. Gegenüber Base-Beschaffung wirkt der PPA mit ${vz(REFERENZEN[4].diff)} günstig – der Vergleich hinkt aber, weil Solarstrom kein Band liefert.`,
        },
      ],
    },
    {
      id: "rolle-speicher",
      titel: "Rolle von Händler, Aggregator und Speicher",
      tocLabel: "Händler & Speicher",
      bloecke: [
        {
          typ: "p",
          text: "**Zwischen Erzeuger und Abnehmer steht bei Off-site-PPA fast immer ein Händler oder Aggregator, der Bilanzgruppe, Prognose, Ausgleichsenergie und die Strukturierung des Profils übernimmt.** Beim Sleeved PPA liefert er den PPA-Strom an den Abnehmer durch und ergänzt die Restmenge. Seit dem ElWG sind Aggregatoren und Flexibilitätsleistungen ausdrücklich geregelt, aktive Kunden dürfen an allen Märkten teilnehmen.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Speicher glättet das Profil", text: "Ein Batteriespeicher verschiebt Mittagsstrom in die Abendstunden, in denen die Preise 2026 im Mittel deutlich höher lagen (11–15 Uhr: 62 €/MWh, 18–21 Uhr: 172 €/MWh; eigene Auswertung Energy-Charts). Das macht Profil- oder Baseload-nähere PPA möglich – mehr im Ratgeber [Großspeicher (BESS)](/ratgeber/grossspeicher-bess)." },
            { titel: "Direktvermarktung als Brücke", text: "Bis ein PPA unterschrieben ist oder für die Mengen außerhalb des Vertrags vermarktet ein Direktvermarkter den Strom am Spotmarkt – siehe [Direktvermarktung](/service/direktvermarktung) und [Einspeisung für Betriebe](/einspeisung-gewerbe)." },
          ],
        },
        {
          typ: "p",
          text: "Ökovolt ist an der ÖkoInvest GmbH beteiligt (22,60 %), die sich mit Freiflächenanlagen, Agri-PV, Contracting und PPA befasst. Die Gründer von Ökovolt betreiben seit 2012 eigene Solarparks.",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Vertrags-Checkliste: Was in einen PPA gehört",
      tocLabel: "Vertrags-Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Laufzeit und Beginn:** Lieferbeginn, Verzögerungsregeln bei Bau oder Netzanschluss, Verlängerungsoptionen.",
            "**Mengen:** Pay-as-produced, Band oder Profil; Mindest- und Höchstmengen, Umgang mit Mehr- und Mindermengen.",
            "**Preisformel:** Fixpreis, Indexierung, Floor/Cap; Umgang mit Steuern, Abgaben und Netzentgelten.",
            "**Negativpreisklausel:** keine Zahlung bzw. Abregelung ab welchem Preis und für welche Dauer.",
            "**Curtailment:** Vergütung abgeregelter Mengen – getrennt nach Netzbetreiber-, Markt- und Abnehmer-Abregelung.",
            "**Messung und Abrechnung:** Zählpunkt, Viertelstundenwerte, Datenzugang, Abrechnungsrhythmus.",
            "**Herkunftsnachweise:** Übertragung, Zeitraum, Zuordnung zur Stromkennzeichnung.",
            "**Bilanzgruppe und Ausgleichsenergie:** wer prognostiziert, wer trägt Abweichungen.",
            "**Change in law:** Kostenaufteilung und Neuverhandlung bei Gesetzesänderungen, etwa durch das ElWG.",
            "**Kündigung und Sicherheiten:** außerordentliche Kündigungsgründe, Garantien, Rechtsnachfolge bei Verkauf der Anlage oder des Betriebs.",
          ],
        },
        {
          typ: "ablauf",
          schritte: [
            ["Bedarf klären", "Lastgang, Standorte, Klimaziele und gewünschte Laufzeit festlegen."],
            ["Modell wählen", "On-site oder Off-site, Pay-as-produced oder Profil, physisch oder finanziell."],
            ["Preis bewerten", "Stromgestehungskosten, erwarteten Solar-Marktwert und Terminmarkt gegenüberstellen."],
            ["Vertrag verhandeln", "Checkliste abarbeiten, Rechts- und Steuerberatung einbinden."],
            ["Umsetzen und überwachen", "Messung, HKN-Übertragung und Abrechnung laufend prüfen."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist ein PPA?",
      a: "Ein Power Purchase Agreement ist ein langfristiger Stromliefervertrag zwischen einem Erzeuger und einem Abnehmer zu vorab vereinbarten Preisen und Mengenregeln. Er kann on-site am Standort des Abnehmers, off-site über das Netz oder rein finanziell gestaltet sein.",
    },
    {
      q: "Wie lange läuft ein PPA in Österreich?",
      a: "Als Richtwert laufen Off-site-PPA meist 5 bis 15 Jahre, On-site-Modelle mit Contracting oder Pacht oft 10 bis 20 Jahre. Die Laufzeit orientiert sich an Finanzierung und Lebensdauer der Anlage.",
    },
    {
      q: "Was kostet Strom aus einem PPA?",
      a: `Einen einheitlichen Marktpreis gibt es nicht; der Preis wird verhandelt. Als Orientierung dienen der erwartete Solar-Marktwert (2025: ${z1(SOLAR[1].solar)} €/MWh, 2026 bis Ende September: ${z1(SOLAR[2].solar)} €/MWh) und der Terminmarkt, etwa der E-Control-Quartalsmarktpreis Q3/2026 von ${z3(TERMIN_Q3_2026)} ct/kWh als Base-Indikator.`,
    },
    {
      q: "Was ist der Unterschied zwischen On-site- und Off-site-PPA?",
      a: "Beim On-site-PPA steht die Anlage am Standort des Abnehmers, der Strom fließt ohne öffentliches Netz. Beim Off-site-PPA liegt die Anlage anderswo; der Strom wird über das Netz und Bilanzgruppen geliefert oder beim virtuellen PPA nur finanziell ausgeglichen.",
    },
    {
      q: "Zählt PPA-Strom für die CSRD-Berichterstattung?",
      a: "Im marktbasierten Scope-2-Ansatz ja, wenn die Herkunftsnachweise der vertraglichen Menge an das Unternehmen bzw. dessen Lieferanten übertragen werden. Mehr im Ratgeber [CSRD und ESG](/ratgeber/csrd-esg-photovoltaik).",
    },
    {
      q: "Was passiert bei negativen Strompreisen?",
      a: "Das regelt die Negativpreisklausel: Häufig entfällt die Zahlung für Mengen in Viertelstunden mit negativem Preis, oder die Anlage wird abgeregelt. Ohne Klausel trägt meist der Abnehmer das Risiko.",
    },
    {
      q: "Ab welcher Anlagengröße ist ein PPA sinnvoll?",
      a: "PPA lohnen sich vor allem bei größeren Mengen, etwa Freiflächen, großen Dächern oder gebündelten Anlagen, weil Vertrag, Strukturierung und Absicherung Aufwand verursachen. Für kleinere Überschüsse sind OeMAG, Händlertarif oder Direktvermarktung meist einfacher – siehe [Einspeisung für Betriebe](/einspeisung-gewerbe).",
    },
  ],

  passend: [
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächen-Photovoltaik", text: "Planung und Bau von Solarparks." },
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Strom am Markt vermarkten lassen." },
    { href: "/einspeisung-gewerbe", titel: "PV-Überschuss verkaufen", text: "Alle Wege für PV-Überschuss im Vergleich." },
    { href: "/ratgeber/grossspeicher-bess", titel: "Großspeicher (BESS)", text: "Speicher für Profil und Flexibilität." },
  ],

  quellen: [
    { titel: "E-Control – Marktpreis-Archiv nach § 41 ÖSG 2012 (Q3/2026)", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv", stand: "09/2026" },
    { titel: "E-Control – Stromkennzeichnung und Herkunftsnachweise", url: "https://www.e-control.at/konsumenten/stromkennzeichnung-herkunftsnachweis", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Energy-Charts, Day-Ahead-Preise und PV-Erzeugung Österreich (eigene Auswertung)", url: "https://www.energy-charts.info", stand: "09/2026" },
    { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025 – RIS", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "09/2026" },
    { titel: "Schönherr – ElWG: Startpunkt für umfassende Strommarktreform", url: "https://www.schoenherr.eu/content/elektrizitatswirtschaftsgesetz-elwg-startpunkt-fur-umfassende-strommarktreform", stand: "09/2026" },
    { titel: "GHG Protocol – Scope 2 Guidance (marktbasierter Ansatz)", url: "https://ghgprotocol.org/scope-2-guidance", stand: "09/2026" },
  ],

  seitenCta: {
    titel: "PPA oder Direktvermarktung?",
    text: "Vermarktungsmodell für Ihre Anlage oder Ihren Strombedarf prüfen.",
    href: "/service/direktvermarktung",
    label: "Direktvermarktung ansehen",
  },
  cta: {
    title: "Solarstrom langfristig absichern.",
    text: "Ob On-site-Anlage am Betrieb oder Freifläche mit Abnahmevertrag – wir planen die Anlage und zeigen, welches Vermarktungsmodell zu Ihrem Bedarf passt.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Freiflächen-Photovoltaik", href: "/freiflaechen-photovoltaik" },
  },
};

export default artikel;
