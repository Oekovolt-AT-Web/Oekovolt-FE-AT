// Ratgeber: Gemeinschaftliche Erzeugungsanlage (GEA) – PV im Mehrparteienhaus und Gewerbeobjekt
// Ersetzt den DE-Artikel „photovoltaik-mehrfamilienhaus“ (Redirect vorgeschlagen).
// Recherchestand 28.09.2026: E-Control „Gemeinschaftliche Erzeugungsanlagen (§ 16a-Anlagen)“, Koordinationsstelle
// für Energiegemeinschaften („Was sind GEAs“, FAQs zum ElWG, Empfehlung für bestehende EG v2 08/2026, Downloads
// Musterverträge), SNE-G-V-Begutachtungsentwurf 07/2026 (§ 9 und Erläuterungen), Ratgeber Steuern & Abgaben 2026.

const PV_KWP = 60; // Beispielanlage
const ERTRAG = 1050; // kWh/kWp, Rechenannahme für Österreich (Süd, Flachdach aufgeständert)
const QUOTE = 0.55; // Anteil der Erzeugung, der zeitgleich im Objekt verbraucht wird (Annahme)
const INTERN = 12; // ct/kWh, interner Preis (Annahme)
const ENERGIE = 15; // ct/kWh, Energiepreis der Teilnehmer beim Lieferanten (Annahme)
const NETZ = 5; // ct/kWh, Arbeitspreis Netznutzung (Rechenannahme)

const kwh = (n) => Math.round(n / 100) * 100;
const eur = (n) => Math.round(n / 10) * 10;
const fmt = (n) => n.toLocaleString("de-DE");

const ERZEUGUNG = PV_KWP * ERTRAG;
const GETEILT = kwh(ERZEUGUNG * QUOTE);
const VORTEIL_ENERGIE = eur((GETEILT * (ENERGIE - INTERN)) / 100);
const VORTEIL_NETZ = eur((GETEILT * NETZ) / 100);

const artikel = {
  slug: "gemeinschaftliche-erzeugungsanlage",
  title: "Gemeinschaftliche Erzeugungsanlage: PV für Mehrparteienhaus & Gewerbe",
  seoTitle: "Gemeinschaftliche Erzeugungsanlage (GEA) | Ökovolt",
  kurzTitel: "Gemeinschaftliche Erzeugungsanlage",
  description:
    "Gemeinschaftliche Erzeugungsanlage (GEA): PV-Strom im Mehrparteienhaus oder Gewerbeobjekt teilen – Voraussetzungen, ElWG-Neuerungen 2026, Verträge und Kosten.",
  excerpt:
    "Mit einer gemeinschaftlichen Erzeugungsanlage nutzen mehrere Parteien den Strom einer PV-Anlage im selben Gebäude – ohne Verein und ohne öffentliches Netz. Seit dem ElWG auch über mehrere Stiegen und Hauptleitungen.",
  hauptKeyword: "gemeinschaftliche erzeugungsanlage",
  keywords: [
    "Gemeinschaftliche Erzeugungsanlage",
    "GEA Photovoltaik",
    "PV Mehrparteienhaus Österreich",
    "Photovoltaik Wohnungseigentum",
    "PV Gewerbeobjekt Mieter",
    "§ 16a ElWOG",
    "Standortbereich ElWG",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/gemeinschaftliche-erzeugungsanlage.jpg",
  bildAlt: "Wiener Gemeindebau mit Photovoltaik-Elementen an der Fassade",
  badge: { wert: "ab 2", text: "Teilnehmern möglich – ohne Vereinsgründung" },

  kurzFazit: [
    "**Eine gemeinschaftliche Erzeugungsanlage (GEA) ist eine Erzeugungsanlage – meist PV –, deren Strom mehrere Parteien am selben Standort direkt nutzen, ohne dass er durch das öffentliche Netz fließt.** Jede Partei behält ihren Netzanschluss und ihren Stromlieferanten für den Reststrom.",
    "Seit **1. Oktober 2026** erlaubt das ElWG die Durchleitung über gemeinschaftliche Hauptleitungen und die **Sammelschiene im Hausanschlusskasten** – Häuser mit mehreren Stiegen brauchen keine zweite GEA oder EEG mehr. Praktisch umsetzbar ist der erweiterte Standortbereich voraussichtlich ab **April 2027**.",
    "Für den GEA-Strom entfällt die **Elektrizitätsabgabe**; ab 2027 wird im Standortbereich die Leistung saldiert und der Netznutzungs-Arbeitspreis laut Verordnungsentwurf um bis zu **90–100 %** reduziert.",
    "Voraussetzungen: **Smart Meter** mit Viertelstundenwerten bei allen Teilnehmern, ein **Vertrag** zwischen den Teilnehmern und eine Vereinbarung mit dem Netzbetreiber – eine Vereinsgründung ist nicht nötig.",
  ],

  abschnitte: [
    {
      id: "was",
      titel: "Was ist eine gemeinschaftliche Erzeugungsanlage?",
      tocLabel: "Was ist eine GEA?",
      bloecke: [
        {
          typ: "p",
          text: "**Eine gemeinschaftliche Erzeugungsanlage ist nach § 6 Abs. 1 Z 58 ElWG eine Stromerzeugungsanlage im Nahebereich, die Strom zur Deckung des Verbrauchs der teilnehmenden Netzbenutzer erzeugt.** Das Modell gibt es seit 2017 als „§ 16a-Anlage“ nach dem ElWOG 2010; es wurde für Mehrparteienhäuser geschaffen, in denen der PV-Strom vom Dach bis dahin nur für Allgemeinflächen wie Stiegenhausbeleuchtung nutzbar war. Seit 1. Oktober 2026 ist die GEA Teil der „gemeinsamen Energienutzung“ im ElWG – neben [Energiegemeinschaften](/ratgeber/energiegemeinschaft-gruenden) und Peer-to-Peer-Verträgen.",
        },
        {
          typ: "p",
          text: "Die E-Control beschreibt das Prinzip so: Der Netzbetreiber misst je Viertelstunde, wie viel die Anlage erzeugt und wie viel jeder Teilnehmer verbraucht, und ordnet den PV-Strom rechnerisch zu. Einem Teilnehmer kann in einer Viertelstunde nie mehr GEA-Strom zugeteilt werden, als sein Zähler in dieser Viertelstunde an Verbrauch misst. Was übrig bleibt, wird ins öffentliche Netz eingespeist und vom Stromhändler des Anlagenbetreibers abgenommen.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Mehrparteienhaus", text: "Eigentümer oder Wohnungseigentümergemeinschaft errichtet PV am Dach, Mieter bzw. Eigentümer nutzen den Strom in ihren Wohnungen." },
            { titel: "Gewerbeobjekt", text: "Ein Gewerbehof, Einkaufszentrum oder Bürohaus mit mehreren Mietern hinter einem Hausanschluss – der Eigentümer bietet PV-Strom als Zusatzleistung an." },
            { titel: "Gemischte Nutzung", text: "Geschäftslokale im Erdgeschoß, Wohnungen darüber: Tagesverbrauch des Gewerbes und Abendverbrauch der Haushalte ergänzen sich gut." },
          ],
        },
      ],
    },
    {
      id: "neu",
      titel: "Was ändert das ElWG für gemeinschaftliche Erzeugungsanlagen?",
      tocLabel: "Neu seit ElWG",
      bloecke: [
        {
          typ: "p",
          text: "**Die wichtigste Neuerung: Strom der GEA darf seit 1. Oktober 2026 über gemeinschaftliche Leitungsanlagen (Hauptleitungen) und über die Sammelschiene im Hausanschlusskasten fließen.** Bisher mussten Erzeugungs- und Verbrauchsanlagen an derselben Hauptleitung hängen; die Durchleitung durch Anlagen des Netzbetreibers war verboten.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Beispiel: Wohnhausanlage mit zwei Stiegen",
          text: "Ein Haus hat zwei Stiegen mit je einer Hauptleitung, die im Hausanschlusskasten über eine Sammelschiene verbunden sind. Bisher musste die PV-Anlage auf zwei GEA aufgeteilt oder eine Energiegemeinschaft gegründet werden. Ab 1. 10. 2026 ist eine einzige gemeinsame Energienutzung im Standortbereich möglich; bestehende Konstruktionen können zusammengelegt werden. Quelle: Koordinationsstelle für Energiegemeinschaften.",
        },
        {
          typ: "liste",
          punkte: [
            "**Standortbereich:** Alle teilnehmenden Zählpunkte eines Gebäudes hängen an derselben Sammelschiene im selben Hausanschlusskasten bzw. Verteilerkasten. Die Netzbetreiber klären derzeit die Anwendungsfälle; die Umsetzung ist laut Koordinationsstelle voraussichtlich ab April 2027 möglich.",
            "**Lieferantenpflichten:** Bringt ein Haushalt über 30 kW oder ein sonstiger Teilnehmer – etwa eine Wohnungseigentümergemeinschaft oder ein Unternehmen – über 100 kW ein, gelten Allgemeine Lieferbedingungen, Informationsblatt und Rechnungsvorgaben nach § 69 ElWG.",
            "**Organisator:** Ein Dienstleister oder der Anlagenbetreiber kann als Organisator An- und Abmeldungen und Abrechnung übernehmen.",
            "**Teilnahmegrenze:** Große Unternehmen und andere Dritte dürfen höchstens 6 MW einbringen – für Gebäude-GEA praktisch ohne Bedeutung.",
          ],
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Voraussetzungen und Verträge",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Für eine GEA braucht es mindestens zwei Teilnehmer, Smart Meter an allen Zählpunkten, einen zivilrechtlichen Vertrag zwischen den Teilnehmern und eine Vereinbarung mit dem Netzbetreiber.** Eine eigene Rechtsperson wie ein Verein ist nicht erforderlich. Jede teilnehmende Anlage braucht einen [Smart Meter](/ratgeber/smart-meter-pflicht), der Viertelstundenwerte misst und – nach Zustimmung – überträgt.",
        },
        {
          typ: "tabelle",
          caption: "Vertragsmodelle für gemeinschaftliche Erzeugungsanlagen (Mustervorlagen der Koordinationsstelle)",
          kopf: ["Situation", "Modell", "Wer betreibt die Anlage?"],
          zeilen: [
            ["Zinshaus oder Gewerbeobjekt mit einem Eigentümer", "Gebäudeeigentümer – Mieter", "Eigentümer; Mieter nehmen per Vertrag teil"],
            ["Wohnungseigentum, Anlage gehört allen", "WEG-Gemeinschaftsanlage (Umlaufbeschluss)", "Eigentümergemeinschaft"],
            ["Wohnungseigentum, Anlage gehört einem Eigentümer", "WEG-Einzelanlage", "einzelner Wohnungseigentümer mit Zustimmung der Gemeinschaft"],
            ["Anlage eines Dritten", "Pachtvertrag Erzeugungsanlage", "Contractor oder Errichter, Betrieb für die Teilnehmer"],
          ],
          minBreite: 640,
          fussnote: "Die Koordinationsstelle für Energiegemeinschaften bietet Musterverträge, Vorlagen für Umlaufbeschlüsse und einen Errichtungs- und Betriebsvertrag an. Beschlusserfordernisse nach Wohnungseigentumsgesetz und Fragen des Mietrechts im Einzelfall rechtlich prüfen lassen.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Aufteilung:** statisch (fixer Prozentsatz je Teilnehmer) oder dynamisch (nach tatsächlichem Verbrauch je Viertelstunde) – dynamisch erhöht den Eigenverbrauch",
            "**Preis:** interner Preis je kWh GEA-Strom, Anpassungsregel und gegebenenfalls Grundgebühr für Messung und Abrechnung",
            "**Ein- und Austritt:** was bei Mieterwechsel, Verkauf einer Wohnung oder Kündigung gilt",
            "**Betrieb und Wartung:** wer für Wartung, Versicherung, Reparaturen und Erneuerung aufkommt",
            "**Abrechnung:** durch den Betreiber selbst oder einen Dienstleister; Rechnungsinhalte nach § 69 ElWG, wenn die Schwellen überschritten sind",
            "**Datenschutz:** Zugriff auf Viertelstundenwerte nur für die Abrechnung",
          ],
        },
      ],
    },
    {
      id: "kosten",
      titel: "Welche Vorteile bringt die GEA bei Netzentgelten und Abgaben?",
      tocLabel: "Netzentgelte & Abgaben",
      bloecke: [
        {
          typ: "p",
          text: "**Der Vorteil der GEA liegt darin, dass für den selbst erzeugten und im Haus verbrauchten Strom im Wesentlichen nur die Erzeugungskosten anfallen – Netzentgelte und Abgaben entfallen weitgehend.** Für die Elektrizitätsabgabe ist das ausdrücklich geregelt: Strom aus erneuerbaren Quellen, der in einer GEA selbst erzeugt und verbraucht wird, ist nach § 2 Abs. 1 Z 4 Elektrizitätsabgabegesetz befreit; dafür sind eine Anzeige an das Finanzamt und Aufzeichnungen nötig.",
        },
        {
          typ: "p",
          text: "Bei den Netzentgelten bringt die neue Systematik ab 1. Jänner 2027 zwei Effekte: Bei gemeinsamer Energienutzung über Hauptleitung oder Standortbereich wird die Leistung je Viertelstunde saldiert – verrechnet wird nur die „Fernbezugsleistung“ aus dem öffentlichen Netz. Und der Arbeitspreis für den zugeordneten GEA-Strom wird laut Erläuterungen zum Entwurf der Systemnutzungsentgelte-Grundsatzverordnung um 90 bis 100 % reduziert. Die endgültigen Prozentsätze legt die Tarifverordnung fest.",
        },
        {
          typ: "tabelle",
          caption: `Beispielrechnung: ${PV_KWP} kWp auf einem Gewerbe- und Wohnobjekt, ${fmt(GETEILT)} kWh im Haus geteilt`,
          kopf: ["Position", "Annahme / Rechnung", "Vorteil pro Jahr"],
          zeilen: [
            ["Erzeugung", `${PV_KWP} kWp × ${fmt(ERTRAG)} kWh/kWp`, `${fmt(ERZEUGUNG)} kWh`],
            ["im Haus zeitgleich verbraucht", `${Math.round(QUOTE * 100)} % bei dynamischer Aufteilung`, `${fmt(GETEILT)} kWh`],
            ["Energiepreis-Vorteil der Teilnehmer", `(${ENERGIE} − ${INTERN} ct) × ${fmt(GETEILT)} kWh`, `rund ${fmt(VORTEIL_ENERGIE)} €`],
            ["vermiedenes Netznutzungsentgelt (Arbeitspreis)", `bis zu ${NETZ} ct × ${fmt(GETEILT)} kWh`, `bis zu ${fmt(VORTEIL_NETZ)} €`],
            ["Erlös des Betreibers aus GEA-Strom", `${INTERN} ct × ${fmt(GETEILT)} kWh`, `rund ${fmt(eur((GETEILT * INTERN) / 100))} €`],
          ],
          minBreite: 680,
          fussnote: `Alle Werte sind Rechenannahmen, keine Tarife: spezifischer Ertrag ${fmt(ERTRAG)} kWh/kWp, Energiepreis ${ENERGIE} ct und Arbeitspreis Netznutzung ${NETZ} ct je kWh netto, interner Preis ${INTERN} ct. Zusätzlich entfällt die Elektrizitätsabgabe auf den GEA-Strom; Leistungspreisvorteile durch Saldierung sind nicht eingerechnet. Kosten für Messung und Abrechnung sind abzuziehen.`,
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "GEA im Gewerbeobjekt: Chancen für Eigentümer und Mieter",
      tocLabel: "Gewerbeobjekte",
      bloecke: [
        {
          typ: "p",
          text: "**Für Eigentümer von Gewerbeimmobilien ist die GEA der rechtlich vorgesehene Weg, PV-Strom an mehrere Mieter mit eigenen Zählpunkten zu verkaufen, ohne selbst Stromlieferant im klassischen Sinn zu werden.** Die Mieter behalten ihre freie Lieferantenwahl für den Reststrom; der Eigentümer erhält Erlöse für den geteilten Strom und steigert die Attraktivität des Objekts. Voraussetzung ist, dass alle Teilnehmer über dieselbe Hauptleitung bzw. Sammelschiene versorgt werden. Besonders gut passt das Modell zu Objekten mit Tagverbrauch – Handel, Büros, Praxen, Werkstätten –, weil die Erzeugung dann großteils im Haus bleibt und nur wenig ins Netz eingespeist wird.",
        },
        {
          typ: "tabelle",
          caption: "GEA, Energiegemeinschaft und Eigenversorgung im Vergleich",
          kopf: ["Kriterium", "GEA", "Lokale EEG / BEG", "Eigenverbrauch eines Betriebs"],
          zeilen: [
            ["Teilnehmer", "mehrere Parteien am selben Standort", "mehrere Parteien im Nahebereich", "ein Netzbenutzer"],
            ["Rechtsform", "keine", "Verein, Genossenschaft o. Ä.", "keine"],
            ["öffentliches Netz", "nein (Hauptleitung, Sammelschiene)", "ja (Netzebene 6/7 bzw. 4/5)", "nein"],
            ["Netzentgelt auf geteilten Strom", "weitgehend entfallend, Leistung saldiert", "reduzierter Arbeitspreis", "keines"],
            ["Elektrizitätsabgabe", "entfällt", "entfällt nur bei EEG", "entfällt für Eigenerzeugung"],
            ["Aufwand", "gering bis mittel", "mittel bis hoch", "gering"],
          ],
          minBreite: 760,
        },
        {
          typ: "p",
          text: "Liegen die Partner auf verschiedenen Grundstücken, führt der Weg über eine [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe). Für Hotels, Tourismusbetriebe und Chalet-Anlagen mit mehreren Einheiten lesen Sie auch [Photovoltaik im Hotel](/ratgeber/photovoltaik-hotel).",
        },
      ],
    },
    {
      id: "stolpersteine",
      titel: "Typische Stolpersteine in der Praxis",
      tocLabel: "Stolpersteine",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten GEA-Projekte scheitern nicht an der Technik, sondern an Organisation und Beschlüssen.** Wer die folgenden Punkte vorab klärt, kommt deutlich schneller zur laufenden Anlage:",
        },
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Nicht alle machen mit.** Eine GEA funktioniert auch, wenn nur ein Teil der Parteien teilnimmt. Die Anlage sollte dann nicht größer als der Verbrauch der Teilnehmer geplant werden, sonst steigt der eingespeiste Anteil.",
            "**Mieterwechsel.** Der Vertrag muss regeln, ob neue Mieter automatisch eingeladen werden und wie die Aufteilung angepasst wird; jede Änderung ist dem Netzbetreiber zu melden.",
            "**Wohnungseigentum.** Für Gemeinschaftsanlagen braucht es einen Beschluss der Eigentümergemeinschaft; Mustervorlagen für Umlaufbeschlüsse erleichtern das. Die Hausverwaltung sollte früh eingebunden werden.",
            "**Platz im Zählerschrank.** Erzeugungszählpunkt, Überspannungsschutz und gegebenenfalls Kommunikationstechnik brauchen Platz; ältere Hausanschlüsse müssen oft erneuert werden.",
            "**Fehlende Viertelstundenwerte.** Ohne Smart Meter mit Datenfreigabe kann der Netzbetreiber keinen GEA-Strom zuordnen. Fehlende Geräte rechtzeitig anfordern.",
            "**Abrechnungsaufwand unterschätzt.** Ab 30 bzw. 100 kW gelten Lieferantenpflichten; ein Abrechnungsdienstleister oder Organisator spart der Hausverwaltung Arbeit.",
          ],
        },
        {
          typ: "p",
          text: "Wichtige Begriffe wie [gemeinschaftliche Erzeugungsanlage](/wissen/lexikon#gea) und [Zählpunkt](/wissen/lexikon#zaehlpunkt) erklärt unser Lexikon. Wer eine GEA bereits nach altem Recht betreibt, muss laut Koordinationsstelle nichts neu gründen – die Netzbetreiber überführen bestehende Anlagen automatisch in die neuen Regeln.",
        },
      ],
    },
    {
      id: "technik",
      titel: "Technik: Messung, Speicher und E-Mobilität",
      tocLabel: "Technik",
      bloecke: [
        {
          typ: "p",
          text: "**Technisch unterscheidet sich eine GEA kaum von einer normalen PV-Anlage – entscheidend sind Messkonzept und Anschluss an die richtige Stelle der Hausinstallation.** Die Anlage bekommt einen eigenen Erzeugungszählpunkt; jeder Teilnehmer behält seinen Bezugszählpunkt mit Smart Meter. Der Anschluss erfolgt an der Hauptleitung bzw. im Hausanschlusskasten, abgestimmt mit dem Netzbetreiber.",
        },
        {
          typ: "liste",
          punkte: [
            "**Speicher:** Ein Speicher, der nur mit PV-Strom der GEA geladen wird, kann eingebunden werden. Für Speicher mit Netzbezug sind Messkonzepte nach § 111 ElWG und den TOR Messwesen nötig; die Anwendung ist laut Koordinationsstelle noch mit Rechtsunsicherheit verbunden.",
            "**E-Mobilität:** Ladepunkte in der Tiefgarage können als Teilnehmer eingebunden werden und erhöhen die Nutzung des Mittagsstroms – siehe [Ladeinfrastruktur](/ladeinfrastruktur).",
            "**Brandschutz:** Bei Gebäuden ab Gebäudeklasse 3 gelten die PV-Anforderungen der OIB-Richtlinie 2 – siehe [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz).",
            "**Netzanschluss:** Die Anlage wird wie jede Erzeugungsanlage beim Netzbetreiber angemeldet – siehe [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist eine gemeinschaftliche Erzeugungsanlage?",
      a: "Eine Erzeugungsanlage – meist PV –, deren Strom mehrere Parteien am selben Standort nutzen, ohne dass er durch das öffentliche Netz fließt. Der Netzbetreiber ordnet die Erzeugung je Viertelstunde den Verbrauchern zu; jeder Teilnehmer behält seinen eigenen Stromlieferanten für den Reststrom.",
    },
    {
      q: "Braucht eine GEA einen Verein?",
      a: "Nein. Anders als Erneuerbare-Energie- und Bürgerenergiegemeinschaften braucht eine GEA keine eigene Rechtsperson. Es genügt ein zivilrechtlicher Vertrag zwischen den Teilnehmern und eine Vereinbarung mit dem Netzbetreiber.",
    },
    {
      q: "Was ändert sich für GEA ab 1. Oktober 2026?",
      a: "Die GEA ist Teil der gemeinsamen Energienutzung im ElWG. Strom darf nun auch über Hauptleitungen und die Sammelschiene im Hausanschlusskasten fließen – etwa zwischen mehreren Stiegen. Neu sind außerdem Lieferantenpflichten ab 30 bzw. 100 kW. Der erweiterte Standortbereich ist voraussichtlich ab April 2027 umsetzbar.",
    },
    {
      q: "Können Mieter an einer GEA teilnehmen?",
      a: "Ja. Der Gebäudeeigentümer betreibt die Anlage, Mieter nehmen per Vertrag teil und behalten ihre freie Lieferantenwahl. Für Wohnungseigentum gibt es eigene Modelle mit Beschluss der Eigentümergemeinschaft.",
    },
    {
      q: "Wird der GEA-Strom statisch oder dynamisch aufgeteilt?",
      a: "Beides ist möglich. Bei statischer Aufteilung erhält jeder Teilnehmer einen fixen Anteil; was er nicht verbraucht, wird eingespeist. Bei dynamischer Aufteilung wird nach dem tatsächlichen Verbrauch je Viertelstunde verteilt – das erhöht den Eigenverbrauch im Haus.",
    },
    {
      q: "Welche Kosten spart eine GEA?",
      a: "Für den im Haus geteilten Strom entfällt die Elektrizitätsabgabe, und ab 2027 werden Leistung saldiert und der Netznutzungs-Arbeitspreis laut Verordnungsentwurf um 90 bis 100 % reduziert. Dazu kommt die Differenz zwischen internem Preis und Lieferantenpreis.",
    },
  ],

  howTo: {
    name: "Gemeinschaftliche Erzeugungsanlage umsetzen",
    schritte: [
      { name: "Standort prüfen", text: "Klären, ob alle Teilnehmer an derselben Hauptleitung bzw. Sammelschiene hängen, und den Netzbetreiber einbinden." },
      { name: "Modell wählen", text: "Betreibermodell festlegen: Gebäudeeigentümer, Wohnungseigentümergemeinschaft, einzelner Eigentümer oder Contractor." },
      { name: "Verträge abschließen", text: "Teilnehmervertrag mit Aufteilung, Preis, Ein- und Austritt sowie Wartung; bei Wohnungseigentum Beschluss fassen." },
      { name: "Anlage anmelden und errichten", text: "Netzzugangsantrag, Montage, Erstprüfung und Fertigstellungsmeldung." },
      { name: "Teilnehmer anmelden", text: "Smart Meter mit Viertelstundenwerten sicherstellen und die Teilnehmer beim Netzbetreiber registrieren." },
      { name: "Abrechnung organisieren", text: "Interne Abrechnung einrichten und Anzeige an das Finanzamt für die Elektrizitätsabgabe erstatten." },
    ],
  },

  passend: [
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "GEA, EEG und BEG mit Ökovolt umsetzen." },
    { href: "/ratgeber/energiegemeinschaft-gruenden", titel: "Energiegemeinschaft gründen", text: "Wenn das öffentliche Netz genutzt wird." },
    { href: "/ratgeber/energiegemeinschaft-gewerbe", titel: "Energiegemeinschaft für Unternehmen", text: "Überschuss an Nachbarbetriebe liefern." },
    { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Auch für Gewerbeimmobilien mit mehreren Mietern." },
  ],

  quellen: [
    { titel: "E-Control – Gemeinschaftliche Erzeugungsanlagen (§ 16a-Anlagen)", url: "https://www.e-control.at/gemeinschaftliche-erzeugungsanlagen", stand: "09/2026" },
    { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – Was sind GEAs?", url: "https://energiegemeinschaften.gv.at/was-sind-geas/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Empfehlungen für bestehende Energiegemeinschaften (v2), Kap. 5 GEA", url: "https://energiegemeinschaften.gv.at/wp-content/uploads/sites/19/2026/08/Empfehlung-fuer-bestehende-Energiegemeinschaften_v2.pdf", stand: "08/2026" },
    { titel: "Koordinationsstelle – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Downloadbereich (GEA-Musterverträge, Umlaufbeschlüsse)", url: "https://energiegemeinschaften.gv.at/downloadbereich/", stand: "09/2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf (§ 9 samt Erläuterungen)", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "Koordinationsstelle – Ratgeber Steuern & Abgaben (Elektrizitätsabgabe)", url: "https://energiegemeinschaften.gv.at/downloads/erneuerbare-energie-gemeinschaften-steuern-abgaben/", stand: "2026" },
  ],

  seitenCta: { titel: "PV für ein Mehrparteienobjekt?", text: "Wir planen GEA-Anlagen für Wohn- und Gewerbeobjekte.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Ein Dach, viele Nutzer – PV-Strom im ganzen Objekt teilen.",
    text: "Ökovolt Solartechnik plant und errichtet gemeinschaftliche Erzeugungsanlagen für Wohnhausanlagen, Gewerbehöfe und Tourismusbetriebe in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Energiegemeinschaften", href: "/energiegemeinschaften" },
  },
};

export default artikel;
