// Ratgeber: Energiegemeinschaften für Unternehmen – Teilnahme, Wirtschaftlichkeit, Abrechnung, Steuern
// Recherchestand 28.09.2026: Koordinationsstelle für Energiegemeinschaften (Detailwissen, Lieferantenverpflichtungen,
// Empfehlung für bestehende EG v2 08/2026, Ratgeber „EEG für Unternehmen“ 12/2022 mit Hinweis auf alte Rechtslage,
// Ratgeber Steuern & Abgaben 2026), SNE-V (Reduktion bis 31.12.2026), SNE-G-V-Entwurf 07/2026, OeMAG-Marktpreis 08/2026.
// Beispielrechnung mit ausdrücklich gekennzeichneten Rechenannahmen (keine Tarifwerte eines Netzbetreibers).

const UEBERSCHUSS = 60000; // kWh/Jahr, die Betrieb A zeitgleich an Betrieb B liefert (Annahme)
const MARKTPREIS = 8.997; // ct/kWh, OeMAG-Marktpreis PV August 2026
const EG_PREIS = 11; // ct/kWh, intern vereinbarter Preis (Annahme)
const ENERGIEPREIS_B = 14; // ct/kWh netto, bisheriger Energiepreis von Betrieb B (Annahme)
const NETZ_AP = 5; // ct/kWh, Arbeitspreis Netznutzung von Betrieb B (Rechenannahme)
const REDUKTION = 0.57; // lokale EEG bis 31.12.2026
const ELABG = 0.82; // ct/kWh, Elektrizitätsabgabe 2026 für Nicht-Haushalte (§ 7 Abs. 16 ElAbgG)

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const ct = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 3 }) + " ct";

const MEHR_A = (UEBERSCHUSS * (EG_PREIS - MARKTPREIS)) / 100;
const SPAR_ENERGIE_B = (UEBERSCHUSS * (ENERGIEPREIS_B - EG_PREIS)) / 100;
const SPAR_NETZ_B = (UEBERSCHUSS * NETZ_AP * REDUKTION) / 100;
const SPAR_ABG_B = (UEBERSCHUSS * ELABG) / 100;

const artikel = {
  slug: "energiegemeinschaft-gewerbe",
  title: "Energiegemeinschaft im Betrieb: Abrechnung, Steuern und Verträge",
  seoTitle: "EEG im Betrieb: Abrechnung, Steuern, Verträge | Ökovolt",
  kurzTitel: "Energiegemeinschaft Gewerbe",
  description:
    "Energiegemeinschaft im Betrieb: Abrechnung, Umsatzsteuer und Reverse Charge, Lieferantenpflichten über 100 kW, Vertragsinhalte und Checkliste für Unternehmen.",
  excerpt:
    "Betriebe mit PV-Überschuss können ihn in einer Energiegemeinschaft an Nachbarn, Mitarbeiter oder andere Unternehmen verkaufen. Wer teilnehmen darf, was sich rechnet und welche Pflichten das ElWG seit Oktober 2026 bringt.",
  hauptKeyword: "energiegemeinschaft abrechnung steuern betrieb",
  keywords: [
    "Energiegemeinschaft Unternehmen",
    "EEG Gewerbe Teilnahme",
    "Energiegemeinschaft KMU",
    "Bürgerenergiegemeinschaft große Unternehmen",
    "Energiegemeinschaft Abrechnung",
    "Energiegemeinschaft Umsatzsteuer Reverse Charge",
    "PV-Überschuss Energiegemeinschaft verkaufen",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  bildAlt: "Luftaufnahme eines Gewerbegebiets mit Photovoltaikanlagen auf mehreren Hallendächern",
  badge: { wert: "6 MW", text: "Teilnahmegrenze für große Unternehmen in BEG und P2P" },

  kurzFazit: [
    "**Kleine und mittlere Unternehmen dürfen an Erneuerbare-Energie-Gemeinschaften (EEG) teilnehmen, sofern das nicht ihre gewerbliche Haupttätigkeit ist; große Unternehmen nur an Bürgerenergiegemeinschaften (BEG) und Peer-to-Peer-Verträgen – mit höchstens 6 MW.**",
    `Ein Betrieb mit PV-Überschuss verkauft Strom in der Gemeinschaft typischerweise über dem Marktpreis (OeMAG August 2026: **${ct(MARKTPREIS)}/kWh**); der Abnehmer spart Energiepreis, Netzentgelt und – nur in der EEG – Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag.`,
    "Bringt ein Unternehmen Anlagen mit **über 100 kW** Engpassleistung ein, muss es seit 1. Oktober 2026 **Lieferantenpflichten** erfüllen: Allgemeine Lieferbedingungen, Informationsblatt, normgerechte Rechnungen – oder einen Organisator damit beauftragen.",
    "Steuerlich ist die Stromlieferung an die Gemeinschaft eine unternehmerische Leistung; bei Lieferungen an eine Gemeinschaft, die überwiegend weiterliefert, kann die **Reverse-Charge-Regel** greifen.",
    "Welche Modelle für Betriebe und Gemeinden passen und wie Ökovolt sie umsetzt, steht auf [Energiegemeinschaft für Betriebe und Gemeinden](/energiegemeinschaften/betriebe-gemeinden); dieser Ratgeber vertieft Abrechnung, Steuern und Verträge.",
  ],

  abschnitte: [
    {
      id: "teilnahme",
      titel: "Dürfen Unternehmen an Energiegemeinschaften teilnehmen?",
      tocLabel: "Wer darf teilnehmen?",
      bloecke: [
        {
          typ: "p",
          text: "**Ja: KMU dürfen an EEG und BEG teilnehmen, große Unternehmen nur an BEG und Peer-to-Peer-Modellen.** Die Teilnahme darf für private Unternehmen nicht die gewerbliche oder berufliche Haupttätigkeit sein – ein Tischler, ein Hotel oder ein Landwirt ist damit klar teilnahmeberechtigt, ein Stromhändler nicht. Das ElWG definiert den „aktiven Kunden“ genau so: als Endkunden, der eigenerzeugten Strom verbraucht, speichert, verkauft oder teilt, sofern das nicht seine Haupttätigkeit ist.",
        },
        {
          typ: "tabelle",
          caption: "Teilnahme von Unternehmen an der gemeinsamen Energienutzung, Stand September 2026",
          kopf: ["Unternehmen", "EEG", "BEG", "P2P / GEA"],
          zeilen: [
            ["Kleine und mittlere Unternehmen (unter 250 Beschäftigte oder Umsatz bis 50 Mio. € bzw. Bilanzsumme bis 43 Mio. €)", "ja", "ja", "ja"],
            ["Große Unternehmen (ab 250 Beschäftigte und über 50 Mio. € Umsatz oder über 43 Mio. € Bilanzsumme)", "nein", "ja, ohne Kontrollfunktion, max. 6 MW je Anlage", "ja, max. 6 MW"],
            ["Energieversorger, Stromhändler", "nein", "als andere Dritte je nach Modell", "als andere Dritte je nach Modell"],
            ["Gemeinden, öffentliche Stellen", "ja", "ja", "ja; 10 % der eingebrachten Energie für schutzbedürftige Haushalte vorsehen"],
          ],
          minBreite: 760,
          fussnote: "Größenkriterien laut Koordinationsstelle für Energiegemeinschaften (EU-KMU-Definition). Die 6-MW-Grenze gilt für Erzeugungs- und Speicheranlagen großer Unternehmen und anderer Dritter; über den Teilnahmefaktor kann auch eine größere Anlage anteilig eingebracht werden.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Große Unternehmen: Dach verpachten statt Mitglied werden",
          text: "Die Koordinationsstelle nennt eine praktikable Alternative: Große Unternehmen können ihre Dachflächen an eine EEG verpachten, die darauf eine Anlage betreibt. Seit dem ElWG dürfen Anlagen auch im Eigentum Dritter stehen und von ihnen gewartet werden, wenn die Gemeinschaft weisungsbefugt bleibt und den Erzeugungszählpunkt übernimmt.",
        },
      ],
    },
    {
      id: "rollen",
      titel: "Welche Rolle kann ein Betrieb übernehmen?",
      tocLabel: "Rollen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Betrieb kann in einer Energiegemeinschaft Erzeuger, Verbraucher oder beides sein – und zusätzlich als Initiator oder Organisator auftreten.** Welche Rolle sinnvoll ist, zeigt der Lastgang: Betriebe mit großem Dach und Wochenend- oder Mittagsüberschuss sind klassische Erzeuger; Betriebe mit hohem Tagverbrauch und wenig eigener Dachfläche profitieren als Abnehmer.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Überschusseinspeiser", text: "Der Betrieb nutzt seinen PV-Strom zuerst selbst; nur der Überschuss wird der Gemeinschaft zugeordnet. Was dort nicht verbraucht wird, geht an den eigenen Stromhändler." },
            { titel: "Volleinspeiser", text: "Die gesamte Erzeugung einer Anlage (etwa auf einem Lagerdach ohne Verbrauch) wird in die Gemeinschaft eingebracht. Dafür empfiehlt die Koordinationsstelle eine eigene Vereinbarung mit Weisungsrecht der Gemeinschaft." },
            { titel: "Verbraucher", text: "Der Betrieb bezieht Strom aus der Gemeinschaft, soweit in derselben Viertelstunde verfügbar; den Rest liefert weiterhin sein Stromlieferant." },
            { titel: "Organisator", text: "Seit dem ElWG eine eigene Marktrolle: wickelt Anmeldungen und Abrechnung ab und erfüllt die Lieferantenpflichten. Pro Gemeinschaft ist nur ein Organisator möglich." },
          ],
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Rechnet sich eine Energiegemeinschaft für Betriebe?",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Energiegemeinschaft lohnt sich, wenn Erzeugung und Verbrauch der Teilnehmer zeitgleich zusammenpassen – denn geteilt wird nur, was in derselben Viertelstunde verbraucht wird.** Der Vorteil entsteht auf beiden Seiten: Der Erzeuger erhält einen internen Preis über dem Marktpreis, der Abnehmer zahlt weniger als beim Lieferanten und spart zusätzlich Netzentgelt und Abgaben auf den Gemeinschaftsstrom.",
        },
        {
          typ: "tabelle",
          caption: `Beispielrechnung: Betrieb A liefert ${UEBERSCHUSS.toLocaleString("de-DE")} kWh Überschuss an Betrieb B in einer lokalen EEG (2026)`,
          kopf: ["Position", "Rechnung", "Vorteil pro Jahr"],
          zeilen: [
            ["Betrieb A: Mehrerlös gegenüber Marktpreis", `(${ct(EG_PREIS)} − ${ct(MARKTPREIS)}) × ${UEBERSCHUSS.toLocaleString("de-DE")} kWh`, eur(MEHR_A)],
            ["Betrieb B: günstigere Energie", `(${ct(ENERGIEPREIS_B)} − ${ct(EG_PREIS)}) × ${UEBERSCHUSS.toLocaleString("de-DE")} kWh`, eur(SPAR_ENERGIE_B)],
            ["Betrieb B: Netzentgeltreduktion", `${ct(NETZ_AP)} × 57 % × ${UEBERSCHUSS.toLocaleString("de-DE")} kWh`, eur(SPAR_NETZ_B)],
            ["Betrieb B: Elektrizitätsabgabe entfällt", `${ct(ELABG)} × ${UEBERSCHUSS.toLocaleString("de-DE")} kWh`, eur(SPAR_ABG_B)],
            ["Summe beider Betriebe", "vor Kosten für Organisation und Abrechnung", eur(MEHR_A + SPAR_ENERGIE_B + SPAR_NETZ_B + SPAR_ABG_B)],
          ],
          markierteZeile: 4,
          hervorheben: 2,
          minBreite: 700,
          fussnote: `Rechenannahmen, keine Tarifwerte: interner Preis ${ct(EG_PREIS)}, bisheriger Energiepreis von B ${ct(ENERGIEPREIS_B)} netto, Arbeitspreis Netznutzung von B ${ct(NETZ_AP)}/kWh. Marktpreis = OeMAG August 2026. Elektrizitätsabgabe 2026 für Nicht-Haushalte 0,82 ct/kWh (§ 7 Abs. 16 ElAbgG). Erneuerbaren-Förderbeitrag nicht berücksichtigt. Ab 2027 gelten neue Netzentgeltabschläge laut Tarifverordnung. Produktionsbetriebe mit Energieabgabenvergütung profitieren weniger von der Abgabenbefreiung.`,
        },
        {
          typ: "p",
          text: "Die Zahlen zeigen die Größenordnung, nicht das Ergebnis Ihres Projekts. Entscheidend ist, wie viel Überschuss tatsächlich zeitgleich abgenommen wird – bei Betrieben mit ähnlichen Arbeitszeiten oft weniger als gedacht, bei der Kombination Gewerbe plus Haushalte oder Gewerbe plus Kühlhaus oft mehr. Ab 2027 kommt der Leistungspreis hinzu, der bei lokalen und regionalen Modellen nicht saldiert wird. Wie Sie den Überschuss sonst verwerten, zeigen [Reststromvermarktung](/service/direktvermarktung) und [PPA in Österreich](/ratgeber/ppa-oesterreich).",
        },
      ],
    },
    {
      id: "abrechnung",
      titel: "Wie funktioniert die Abrechnung?",
      tocLabel: "Abrechnung",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Betrieb in einer Energiegemeinschaft erhält künftig drei Abrechnungen: vom Netzbetreiber (Netzentgelte, reduziert für den Gemeinschaftsstrom), vom Stromlieferanten (Reststrom) und von der Gemeinschaft (Gemeinschaftsstrom bzw. Gutschrift für eingebrachten Strom).** Grundlage sind die Viertelstundenwerte, die der Netzbetreiber täglich über den energiewirtschaftlichen Datenaustausch ([EDA](/wissen/lexikon#eda)) bereitstellt; die endgültige Zuordnung erfolgt spätestens am 16. Kalendertag des Folgemonats.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Messung", "Smart Meter bzw. Lastprofilzähler erfassen Erzeugung und Verbrauch je Viertelstunde; Opt-in ist Voraussetzung."],
            ["Zuordnung", "Der Netzbetreiber teilt die verfügbare Gemeinschaftsenergie dynamisch nach dem tatsächlichen Verbrauch auf und meldet die Werte über EDA."],
            ["Interne Abrechnung", "Die Gemeinschaft (oder ihr Organisator) rechnet Bezug und Einspeisung zu den vereinbarten Preisen ab – meist monatlich, mindestens jährlich."],
            ["Netz- und Lieferantenrechnung", "Netzbetreiber verrechnen den reduzierten Arbeitspreis für den Gemeinschaftsanteil; der Lieferant nur den Reststrom."],
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Lieferantenpflichten nach § 69 ElWG",
          text: "Seit 1. 10. 2026 gelten für aktive Kunden, die Anlagen mit mehr als 30 kW (Haushalte) bzw. mehr als 100 kW (Unternehmen, Gemeinden, Energiegemeinschaften) Engpassleistung einbringen, reduzierte Lieferantenpflichten: Allgemeine Lieferbedingungen, ein Informationsblatt vor Vertragsabschluss (für Haushalte und Kleinunternehmen), Änderungsmitteilungen mindestens einen Monat im Voraus, Rechnungen mit Betrag, Fälligkeit, Energiewerten, Vertragspartnern und Zählpunktbezeichnung, kostenlose Rechnungslegung mindestens jährlich mit Wahlrecht auf monatliche Rechnung. Maßgeblich ist die Summe der Anlagen je Teilnehmer. Die Pflichten können an die Gemeinschaft oder einen Organisator übertragen werden.",
        },
      ],
    },
    {
      id: "steuern",
      titel: "Steuern: Umsatzsteuer, Reverse Charge und Elektrizitätsabgabe",
      tocLabel: "Steuern",
      bloecke: [
        {
          typ: "p",
          text: "**Für Unternehmen ist die Lieferung von Strom an eine Energiegemeinschaft eine steuerbare Leistung; die Erlöse sind Betriebseinnahmen.** Die wichtigsten Punkte laut Steuer-Ratgeber der Koordinationsstelle:",
        },
        {
          typ: "liste",
          punkte: [
            "**Umsatzsteuer:** Stromlieferungen an Endverbraucher unterliegen 20 % Umsatzsteuer. Liefert ein Unternehmen an eine Gemeinschaft, deren Haupttätigkeit beim Stromerwerb die Weiterlieferung ist, kann die Steuerschuld auf den Empfänger übergehen (Reverse Charge nach § 19 Abs. 1d UStG iVm § 2 Z 2 UStBBKV).",
            "**Vorsteuer:** Unternehmen mit Vorsteuerabzug zahlen Gemeinschaftsstrom netto; bei einer Gemeinschaft in der Kleinunternehmerregelung (bis 55.000 € Umsatz) fällt keine Umsatzsteuer an.",
            "**Elektrizitätsabgabe:** Für selbst erzeugten und in der EEG verbrauchten erneuerbaren Strom besteht eine Befreiung nach § 2 Abs. 1 Z 4 ElAbgG; bei Überschusseinspeisern sind Aufzeichnungen über Eigenverbrauch und Einspeisung zu führen.",
            "**Pachtverträge:** Verpachtet ein Betrieb eine Anlage an die Gemeinschaft, kann Rechtsgeschäftsgebühr nach § 33 TP 5 Gebührengesetz anfallen.",
            "**Mitarbeiterstrom:** Wer Mitarbeitern über die Gemeinschaft günstigen Strom anbietet, sollte die lohnsteuerliche Behandlung mit der Steuerberatung klären.",
          ],
        },
        {
          typ: "p",
          text: "Die Abschreibung der eigenen Anlage und den [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik) behandelt der Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern). Keine Steuerberatung – lassen Sie die Konstruktion vor dem Start prüfen.",
        },
      ],
    },
    {
      id: "modelle",
      titel: "Gewerbepark, Nachbarbetrieb, Mitarbeiter: typische Modelle",
      tocLabel: "Modelle",
      bloecke: [
        {
          typ: "p",
          text: "**Welches Modell passt, hängt vor allem davon ab, ob die Teilnehmer hinter einem gemeinsamen Netzanschluss sitzen oder über das öffentliche Netz verbunden sind.**",
        },
        {
          typ: "tabelle",
          caption: "Modelle für Unternehmen im Vergleich",
          kopf: ["Situation", "Passendes Modell", "Hinweis"],
          zeilen: [
            ["Mehrere Mieter in einem Gewerbeobjekt mit gemeinsamer Hauptleitung", "Gemeinschaftliche Erzeugungsanlage (Standortbereich)", "keine Rechtsform nötig; Standortbereich praktisch ab April 2027"],
            ["Nachbarbetriebe an derselben Trafostation", "lokale EEG, BEG oder P2P", "höchster Netzentgeltvorteil im öffentlichen Netz"],
            ["Betriebe in einer Region (Mittelspannung)", "regionale EEG oder BEG", "geringerer Netzentgeltvorteil"],
            ["Filialbetrieb mit mehreren Standorten", "Eigenversorgungsanlage (EVA)", "Vorteil nur im Nahebereich; ab 2027"],
            ["Mitarbeiter und Kunden in der Umgebung", "lokale EEG", "Bindung und Nachhaltigkeitskommunikation"],
          ],
          minBreite: 680,
        },
        {
          typ: "p",
          text: "Details zum Gebäudemodell im Ratgeber [Gemeinschaftliche Erzeugungsanlage](/ratgeber/gemeinschaftliche-erzeugungsanlage); die Gründung Schritt für Schritt im Ratgeber [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden). Für die Nachhaltigkeitsberichterstattung zählt der Gemeinschaftsstrom als erneuerbarer Strombezug – siehe [CSRD, ESG und Photovoltaik](/ratgeber/csrd-esg-photovoltaik).",
        },
      ],
    },
    {
      id: "vertraege",
      titel: "Was gehört in die Verträge?",
      tocLabel: "Verträge",
      bloecke: [
        {
          typ: "p",
          text: "**Für Unternehmen sind klare Verträge wichtiger als für Haushalte, weil Mengen, Laufzeiten und Haftungsfragen größer sind.** Die Koordinationsstelle stellt Leitfäden für Bezugs- und Leistungsvereinbarungen, für Überschusseinspeiser und für Volleinspeiser bereit, seit dem ElWG ergänzt um Mustervorlagen für Peer-to-Peer-Verträge, Allgemeine Lieferbedingungen und Rechnungen. Folgende Punkte sollten Betriebe jedenfalls regeln:",
        },
        {
          typ: "checkliste",
          punkte: [
            "Preis für Bezug und Einspeisung – fix, indexiert (z. B. an den OeMAG-Marktpreis) oder mit Preisband – und Anpassungsmechanismus",
            "Laufzeit, Kündigungsfristen und Regeln für Ein- und Austritt, etwa bei Verkauf des Betriebs oder Umzug",
            "Teilnahmefaktor bzw. Anteil der eingebrachten Erzeugung, bei großen Unternehmen zur Einhaltung der 6-MW-Grenze",
            "Weisungsrecht der Gemeinschaft bei Volleinspeisung und Übertragung des Erzeugungszählpunkts",
            "Wartung, Versicherung und Haftung für die eingebrachte Anlage; Umgang mit Ausfällen und Abregelungen",
            "Datenschutz und Datenfreigabe für Viertelstundenwerte",
            "Zuständigkeit für Lieferantenpflichten und Abrechnung (Gemeinschaft, Organisator oder Teilnehmer)",
          ],
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste für Unternehmen vor dem Einstieg",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Unternehmensgröße prüfen: KMU (EEG und BEG) oder großes Unternehmen (nur BEG/P2P, max. 6 MW)",
            "Lastgang auswerten: Wann entsteht Überschuss, wann Bedarf? Passen die Profile der Partner?",
            "Nahebereich mit dem Netzbetreiber klären: Hängen die Partner an derselben Trafostation?",
            "Rolle festlegen: Überschuss- oder Volleinspeiser, Verbraucher, Organisator",
            "Lieferantenpflichten prüfen, wenn Anlagen über 100 kW eingebracht werden",
            "Steuerliche Behandlung (Umsatzsteuer, Reverse Charge, Elektrizitätsabgabe) mit der Steuerberatung abstimmen",
            "Verträge mit Mustervorlagen der Koordinationsstelle aufsetzen; Ausstiegs- und Preisanpassungsregeln festlegen",
            "Smart Meter mit Opt-in bzw. Lastprofilzähler und Datenfreigabe für alle Zählpunkte sicherstellen",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Darf mein Unternehmen Mitglied einer Erneuerbare-Energie-Gemeinschaft werden?",
      a: "Ja, wenn es ein KMU ist – also unter 250 Beschäftigte hat oder Umsatz bis 50 Mio. € bzw. Bilanzsumme bis 43 Mio. € – und die Teilnahme nicht seine gewerbliche Haupttätigkeit ist. Große Unternehmen und Energieversorger sind von EEG ausgeschlossen.",
    },
    {
      q: "Können große Unternehmen an Energiegemeinschaften teilnehmen?",
      a: "Ja, aber nur an Bürgerenergiegemeinschaften und Peer-to-Peer-Verträgen, ohne Kontrollfunktion und mit höchstens 6 MW je Anlage. Alternativ können sie Dachflächen an eine EEG verpachten.",
    },
    {
      q: "Was bekomme ich für meinen Überschuss in der Energiegemeinschaft?",
      a: "Den intern vereinbarten Preis, der meist über dem Marktpreis liegt (OeMAG-Marktpreis PV August 2026: 8,997 ct/kWh). Was die Gemeinschaft nicht zeitgleich verbraucht, nimmt weiterhin Ihr Stromhändler ab.",
    },
    {
      q: "Welche Pflichten habe ich als Unternehmen mit großer PV-Anlage?",
      a: "Bringen Sie Anlagen mit mehr als 100 kW Engpassleistung ein, gelten seit 1. Oktober 2026 reduzierte Lieferantenpflichten nach § 69 ElWG: Allgemeine Lieferbedingungen, Informationsblatt, normgerechte Rechnungen und Änderungsmitteilungen. Sie können diese Pflichten an die Gemeinschaft oder einen Organisator übertragen.",
    },
    {
      q: "Wie wird Strom an eine Energiegemeinschaft umsatzsteuerlich behandelt?",
      a: "Als steuerbare Lieferung. Ist die Gemeinschaft überwiegend Weiterlieferer, kann die Steuerschuld nach § 19 Abs. 1d UStG auf sie übergehen (Reverse Charge). Die konkrete Behandlung hängt von der Konstruktion ab – lassen Sie sie steuerlich prüfen.",
    },
    {
      q: "Lohnt sich eine Energiegemeinschaft zwischen zwei Betrieben?",
      a: "Wenn der Überschuss des einen zeitgleich vom anderen verbraucht wird, ja: Beide teilen sich die Differenz zwischen Marktpreis und Bezugspreis, dazu kommen Netzentgelt- und Abgabenvorteile. Bei ähnlichen Betriebszeiten ist der gemeinsame Anteil oft kleiner als erwartet – eine Lastganganalyse klärt das.",
    },
  ],

  passend: [
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "Umsetzung mit Ökovolt." },
    { href: "/ratgeber/energiegemeinschaft-gruenden", titel: "Energiegemeinschaft gründen", text: "Modelle, Netzentgelte, Ablauf." },
    { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Anlage passend zum Lastgang." },
    { href: "/energiegemeinschaften/betriebe-gemeinden", titel: "Energiegemeinschaft für Betriebe & Gemeinden", text: "Modelle, Rollen und Umsetzung mit Ökovolt." },
  ],

  quellen: [
    { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – Detailwissen (Teilnahme großer Unternehmen)", url: "https://energiegemeinschaften.gv.at/detailwissen/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Lieferantenverpflichtungen der gemeinsamen Energienutzung", url: "https://energiegemeinschaften.gv.at/lieferantenverpflichtungen-der-gemeinsamen-energienutzung/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Empfehlungen für bestehende Energiegemeinschaften (v2)", url: "https://energiegemeinschaften.gv.at/wp-content/uploads/sites/19/2026/08/Empfehlung-fuer-bestehende-Energiegemeinschaften_v2.pdf", stand: "08/2026" },
    { titel: "Koordinationsstelle – Ratgeber Erneuerbare-Energie-Gemeinschaften für Unternehmen (Rechtslage vor 1. 10. 2026)", url: "https://energiegemeinschaften.gv.at/downloads/erneuerbare-energie-gemeinschaften-fuer-unternehmen/", stand: "12/2022" },
    { titel: "Koordinationsstelle – Ratgeber Steuern & Abgaben für Erneuerbare-Energie-Gemeinschaften", url: "https://energiegemeinschaften.gv.at/downloads/erneuerbare-energie-gemeinschaften-steuern-abgaben/", stand: "2026" },
    { titel: "Smart Meter Portal – Netzentgelte Energiegemeinschaft 2026 (Reduktion 57 / 28 / 64 %)", url: "https://www.smartmeter-portal.at/energiegemeinschaften/netzentgelte/", stand: "09/2026" },
    { titel: "OeMAG – Marktpreis Photovoltaik", url: "https://www.oem-ag.at/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Überschuss teilen?", text: "Wir prüfen Ihren Lastgang und planen die Anlage für die Gemeinschaft.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Mehr aus dem Betriebsdach machen – gemeinsam mit Nachbarn.",
    text: "Ökovolt Solartechnik plant PV-Anlagen für Betriebe, die ihren Überschuss in Energiegemeinschaften teilen – von der Lastganganalyse bis zur Inbetriebnahme.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Energiegemeinschaften", href: "/energiegemeinschaften" },
  },
};

export default artikel;
