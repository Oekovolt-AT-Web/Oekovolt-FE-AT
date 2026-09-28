// Ratgeber: Kauf, Leasing, Contracting oder PPA? PV-Modelle für Betriebe (Gruppe R1)
// 20-Jahres-Vergleich konsistent mit photovoltaik-leasing (gleiche Annahmen, gleiche Ergebnisse):
// 100 kWp, 75.000 € netto, 1.000 kWh/kWp, 0,4 % Degradation, 60 % EV zu 18 ct (+2 %/a), Überschuss 6 ct,
// Betriebskosten 15 €/kWp (+2 %/a); Summe der Vorteile 20 J. ≈ 261.800 € (pvcalc.mjs, jahre 20).
// Kredit 10 J./5 % Annuität 9.713 €; Leasing 10 J./6 % 10.190 € + Kaufoption 5 %; Contracting 12 ct fix ≈ 113.000 €.

const artikel = {
  slug: "photovoltaik-mieten-oder-kaufen",
  title: "Kauf, Leasing, Contracting oder PPA? PV-Modelle für Betriebe",
  seoTitle: "PV kaufen, leasen oder Contracting? Vergleich | Ökovolt",
  kurzTitel: "Kauf, Leasing oder PPA?",
  description:
    "Kauf, Kredit, Leasing, Contracting, PPA oder Dachpacht? PV-Modelle für Betriebe in Österreich im 20-Jahres-Vergleich für 100 kWp – mit Vertragsfallen.",
  excerpt:
    "Welches Modell passt zu Ihrem Betrieb? Kauf, Kredit, Leasing, Contracting, On-site-PPA und Dachpacht im Vergleich – Eigentum, Bilanz, Investitionsfreibetrag, Förderung, Risiko und das Ergebnis nach 20 Jahren für eine 100-kWp-Anlage.",
  hauptKeyword: "photovoltaik kaufen oder leasen",
  keywords: [
    "Photovoltaik kaufen oder leasen",
    "PV Contracting Österreich",
    "PPA Photovoltaik Betrieb",
    "Photovoltaik mieten Gewerbe",
    "Dachpacht Photovoltaik",
    "PV-Anlage Finanzierung Unternehmen",
    "Photovoltaik Betreibermodelle",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Kontakt/faqs.jpg",
  bildAlt: "Photovoltaikmodule vor blauem Himmel mit Wolken",
  badge: { wert: "+187.000 €", text: "Ergebnis nach 20 Jahren beim Kauf einer 100-kWp-Anlage, vor Steuern" },

  kurzFazit: [
    "**Über 20 Jahre bringt der Kauf das beste Ergebnis, Contracting und PPA sparen dafür jede Investition.** Für eine 100-kWp-Anlage mit 60 % Eigenverbrauch bleiben nach 20 Jahren vor Steuern rund 187.000 € (Kauf), 165.000 € (Kredit), 156.000 € (Leasing) und 113.000 € (Contracting zu 12 ct/kWh).",
    "Kredit- und Leasingraten werden im Beispiel von Anfang an aus der Ersparnis gedeckt: Der Vorteil im ersten Jahr liegt bei rund 11.700 €, die Raten bei 9.713 € bzw. 10.190 €.",
    "**Investitionsfreibetrag und AfA** nutzt nur der wirtschaftliche Eigentümer – beim Kauf der Betrieb, beim klassischen Leasing meist die Leasinggesellschaft, beim Contracting der Contractor.",
    "Dachpacht bringt bei 3 €/kWp und Jahr nur rund 6.000 € in 20 Jahren und keinen günstigen Eigenstrom – sinnvoll nur ohne eigenen Bedarf.",
    "Vertragsfallen liegen bei Laufzeit, Endschaft, Rückbau, Dachsanierung, Indexierung und einer möglichen Bestandvertragsgebühr von 1 %.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Welches PV-Modell ist für Betriebe das wirtschaftlichste?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Das wirtschaftlichste Modell ist für die meisten Betriebe der Kauf – mit Eigenkapital oder Kredit –, weil der gesamte Stromkostenvorteil beim Betrieb bleibt.** Leasing, Contracting und Power Purchase Agreements verschieben Kapitalbedarf, Aufwand und Risiko zu einem Dritten und kosten dafür einen Teil des Vorteils. Welche Variante passt, hängt von Liquidität, Bilanzzielen, Steuerlage, Dachsituation und Standortperspektive ab.",
        },
        {
          typ: "kennzahl",
          wert: "261.800 €",
          titel: "Summe der Vorteile einer 100-kWp-Anlage in 20 Jahren",
          text: "Stromersparnis plus Überschusserlös minus Betriebskosten, vor Steuern, ohne Zuschuss, nicht abgezinst. Wie viel davon beim Betrieb bleibt, entscheidet das Modell.",
        },
        {
          typ: "p",
          text: "Wie sich eine gekaufte Anlage im Detail rechnet, zeigt [Photovoltaik für Unternehmen](/ratgeber/photovoltaik-gewerbe). Die Rechenmethoden dahinter erklärt [Amortisation und Rendite berechnen](/ratgeber/photovoltaik-amortisation).",
        },
      ],
    },
    {
      id: "uebersicht",
      titel: "Die Modelle im Überblick: Eigentum, Bilanz, Steuer, Risiko",
      tocLabel: "Übersicht",
      bloecke: [
        {
          typ: "p",
          text: "**Die Modelle unterscheiden sich vor allem darin, wem die Anlage gehört – daraus folgen Bilanzierung, Steuervorteile, Förderberechtigung und Risikoverteilung.**",
        },
        {
          typ: "tabelle",
          caption: "PV-Betreibermodelle für Betriebe im Vergleich, Stand September 2026",
          kopf: ["Kriterium", "Kauf (Eigenkapital)", "Kauf mit Kredit", "Leasing", "Contracting / On-site-PPA", "Dachpacht"],
          zeilen: [
            ["Eigentum", "Betrieb", "Betrieb", "Leasinggesellschaft", "Contractor", "Investor"],
            ["Bilanz (UGB)", "Anlagevermögen", "Anlagevermögen + Verbindlichkeit", "meist nicht beim Betrieb", "nicht beim Betrieb", "nicht beim Betrieb"],
            ["IFB / AfA", "Betrieb", "Betrieb", "meist Leasinggeber", "Contractor", "Investor"],
            ["EAG-Förderwerber", "Betrieb", "Betrieb", "vorab festlegen", "Contractor", "Investor"],
            ["Ergebnis 20 J. (100 kWp)", "≈ +187.000 €", "≈ +165.000 €", "≈ +156.000 €", "≈ +113.000 €", "≈ +6.000 €"],
            ["Kapitalbedarf zu Beginn", "75.000 €", "gering", "gering", "keiner", "keiner"],
            ["Technisches Risiko", "Betrieb", "Betrieb", "meist Betrieb", "Contractor", "Investor"],
            ["Typische Laufzeit", "–", "10–15 Jahre", "10–15 Jahre", "15–25 Jahre", "20–25 Jahre"],
            ["Aufwand für den Betrieb", "hoch", "hoch", "mittel", "gering", "gering"],
          ],
          hervorheben: 1,
          minBreite: 820,
          fussnote: "Vereinfachte Gegenüberstellung; die Zurechnung beim Leasing hängt von Laufzeit und Kaufoption ab (siehe Photovoltaik-Leasing). Ergebnis nach 20 Jahren vor Steuern, ohne Zuschuss, nicht abgezinst; Annahmen im nächsten Abschnitt. Laufzeiten sind übliche Größenordnungen, keine Vorgaben.",
        },
      ],
    },
    {
      id: "vergleich",
      titel: "20-Jahres-Vergleich: 100 kWp in fünf Modellen",
      tocLabel: "20-Jahres-Vergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Mit denselben Annahmen gerechnet, bleiben nach 20 Jahren beim Kauf rund 187.000 €, beim Contracting rund 113.000 € und bei der Dachpacht rund 6.000 € beim Betrieb.** Die Anlage erzeugt in allen Modellen gleich viel; verschieden ist nur, wer investiert und wer den Vorteil erhält.",
        },
        {
          typ: "tabelle",
          caption: "100 kWp Gewerbedach: Ergebnis nach 20 Jahren je Modell, vor Steuern",
          kopf: ["Modell", "Zahlungen des Betriebs", "Vorteil beim Betrieb", "Ergebnis nach 20 Jahren"],
          zeilen: [
            ["Kauf mit Eigenkapital", "75.000 € zu Beginn", "261.800 €", "≈ +187.000 €"],
            ["Kauf mit Kredit (10 J., 5 %)", "10 × 9.713 € = 97.130 €", "261.800 €", "≈ +165.000 €"],
            ["Leasing (10 J., 6 %, Kaufoption 5 %)", "10 × 10.190 € + 3.750 € = 105.650 €", "261.800 €", "≈ +156.000 €"],
            ["Contracting / On-site-PPA (12 ct fix)", "Strompreis 12 ct/kWh für genutzten Solarstrom", "Ersparnis gegenüber 18 ct (+2 %/Jahr)", "≈ +113.000 €, ohne Investition"],
            ["Dachpacht (3 €/kWp und Jahr)", "keine", "Pacht 300 €/Jahr", "≈ +6.000 €, kein günstiger Eigenstrom"],
          ],
          markierteZeile: 0,
          hervorheben: 3,
          minBreite: 760,
          fussnote: "Annahmen: 100 kWp, 75.000 € netto, 1.000 kWh/kWp, 0,4 % Degradation, 60 % Eigenverbrauch zu 18 ct/kWh netto (+2 %/Jahr), Überschuss 6 ct/kWh, Betriebskosten 15 €/kWp (+2 %/Jahr) beim Betrieb in den Modellen Kauf, Kredit und Leasing. Kredit und Leasing als jährliche Annuität ohne Gebühren. Contracting: Contractor trägt Investition und Betriebskosten und erhält den Überschusserlös; Preis 12 ct/kWh fix als Annahme. Dachpacht 3 €/kWp und Jahr als Annahme. Ohne Steuerwirkung, ohne EAG-Zuschuss, nicht abgezinst.",
        },
        {
          typ: "p",
          text: "Zwei Punkte relativieren die Reihenfolge: Erstens fallen beim Kauf alle Vorteile, aber auch alle Risiken beim Betrieb an – Ertragsausfälle, Reparaturen, Wechselrichtertausch. Zweitens verschiebt die Steuer das Bild: Beim Kauf kann eine GmbH 2026 zusätzlich 22 % Investitionsfreibetrag nutzen, bei 75.000 € und 23 % KöSt rund 3.800 € Steuerersparnis; Leasingraten und Contracting-Entgelte sind dafür laufend als Betriebsausgabe absetzbar. Rechnen Sie die Modelle für Ihre Steuerlage mit der Steuerberatung nach.",
        },
      ],
    },
    {
      id: "kauf-kredit",
      titel: "Kauf und Kredit: höchster Ertrag, volle Verantwortung",
      tocLabel: "Kauf & Kredit",
      bloecke: [
        {
          typ: "p",
          text: "**Beim Kauf gehört die Anlage dem Betrieb: Er aktiviert sie, schreibt sie über 20 Jahre ab, nutzt den [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik) und ist Förderwerber beim EAG-Investitionszuschuss.** Eine Kreditfinanzierung ändert daran nichts; die Zinsen sind Betriebsausgabe, aber nicht förderfähig. Im Beispiel deckt die Ersparnis von rund 11.700 € im ersten Jahr die Annuität von 9.713 € bereits vollständig.",
        },
        {
          typ: "p",
          text: "Voraussetzung ist, dass der Betrieb Wartung, Monitoring und Versicherung selbst organisiert oder beauftragt. Finanzierungswege zeigt die Seite [Finanzierung](/service/finanzierung).",
        },
      ],
    },
    {
      id: "leasing",
      titel: "Leasing: Liquidität schonen, Steuervorteil beachten",
      tocLabel: "Leasing",
      bloecke: [
        {
          typ: "p",
          text: "**Leasing verteilt die Investition auf Raten, lässt Eigenkapital und Kreditrahmen frei – kostet im Beispiel aber rund 31.000 € mehr als der Barkauf.** Beim klassischen Leasing ist die Leasinggesellschaft wirtschaftliche Eigentümerin: Die Raten sind Betriebsausgaben, Abschreibung und Investitionsfreibetrag stehen dem Leasinggeber zu. Vor dem Förderansuchen muss feststehen, wer Förderwerber ist.",
        },
        {
          typ: "p",
          text: "Beispielraten, Zurechnungsregeln, Förderung und Vertragsprüfung behandelt ausführlich der Ratgeber [Photovoltaik-Leasing](/ratgeber/photovoltaik-leasing).",
        },
      ],
    },
    {
      id: "contracting-ppa",
      titel: "Contracting und PPA: Solarstrom ohne eigene Investition",
      tocLabel: "Contracting & PPA",
      bloecke: [
        {
          typ: "p",
          text: "**Beim Contracting oder On-site-PPA baut und betreibt ein Dritter die Anlage auf Ihrem Dach, und Ihr Betrieb kauft den erzeugten Strom zu einem vereinbarten Preis.** Sie investieren nichts und tragen kein technisches Risiko; dafür bleibt die Differenz zwischen Gestehungskosten und Vertragspreis beim Contractor. Im Beispiel spart der Betrieb bei 12 ct/kWh gegenüber 18 ct Netzstrom in 20 Jahren rund 113.000 €.",
        },
        {
          typ: "tabelle",
          caption: "Contracting / On-site-PPA für 100 kWp: Ersparnis des Betriebs in 20 Jahren je nach Vertragspreis",
          kopf: ["Vertragspreis", "Preisformel", "Genutzter Solarstrom", "Ersparnis in 20 Jahren"],
          zeilen: [
            ["10 ct/kWh", "fix", "60 % der Erzeugung", "≈ 136.000 €"],
            ["12 ct/kWh", "fix", "60 % der Erzeugung", "≈ 113.000 €"],
            ["14 ct/kWh", "fix", "60 % der Erzeugung", "≈ 90.000 €"],
            ["16 ct/kWh", "fix", "60 % der Erzeugung", "≈ 67.000 €"],
            ["12 ct/kWh", "+2 % pro Jahr indexiert", "60 % der Erzeugung", "≈ 84.000 €"],
            ["12 ct/kWh", "fix", "40 % der Erzeugung", "≈ 76.000 €"],
          ],
          markierteZeile: 1,
          hervorheben: 3,
          minBreite: 640,
          fussnote: "Ersparnis gegenüber einem vermeidbaren Netzstrompreis von 18 ct/kWh netto mit +2 %/Jahr; 100 kWp, 1.000 kWh/kWp, 0,4 % Degradation; bezahlt wird nur der im Betrieb genutzte Solarstrom. Vertragspreise sind Annahmen, keine Marktpreise. Nicht abgezinst, vor Steuern.",
        },
        {
          typ: "p",
          text: "Die Tabelle zeigt die zwei größten Stellschrauben: Jeder Cent Vertragspreis kostet den Betrieb über 20 Jahre rund 11.500 €, und eine Indexierung um 2 % pro Jahr frisst ein Viertel des Vorteils auf, weil der Abstand zum Netzstrompreis dann nicht mehr wächst. Genauso wichtig ist die Abnahmemenge: Nutzt der Betrieb nur 40 statt 60 % des Solarstroms, sinkt die Ersparnis auf rund 76.000 €.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Anlagen-Contracting", text: "Contractor errichtet, finanziert und betreibt; Sie zahlen ein Entgelt je kWh oder eine Pauschale. Am Laufzeitende oft Übernahme der Anlage." },
            { titel: "On-site-PPA", text: "Stromliefervertrag für den vor Ort erzeugten Strom, häufig „pay as produced“. Preis fix oder indexiert, Laufzeit meist 15 bis 25 Jahre." },
            { titel: "Off-site-PPA", text: "Strom aus einem entfernten Solarpark, physisch geliefert oder finanziell abgesichert. Für größere Verbraucher ohne geeignete Dachflächen." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Worauf es beim Contracting ankommt",
          text: "Entscheidend sind Preis und Preisformel (fix, gestaffelt oder an einen Index gebunden), Abnahmepflichten, Laufzeit, Übernahmepreis am Ende und die Frage, wer den Überschuss vermarktet. Prüfen Sie auch die Abgaben: Die Befreiung von der Elektrizitätsabgabe gilt für selbst erzeugten und selbst verbrauchten Strom – ob sie greift, wenn ein Dritter erzeugt und liefert, hängt von der Vertragsgestaltung ab und sollte steuerlich geklärt werden. Mehr unter [PPA in Österreich](/ratgeber/ppa-oesterreich) und im [Lexikon](/wissen/lexikon#ppa).",
        },
      ],
    },
    {
      id: "dachpacht",
      titel: "Dachpacht: nur ohne eigenen Strombedarf sinnvoll",
      tocLabel: "Dachpacht",
      bloecke: [
        {
          typ: "p",
          text: "**Bei der Dachpacht stellt der Betrieb nur die Fläche zur Verfügung; ein Investor baut, betreibt und vermarktet den Strom und zahlt dafür eine Pacht.** Mit angenommenen 3 €/kWp und Jahr kommen bei 100 kWp rund 6.000 € in 20 Jahren zusammen – ein Bruchteil dessen, was eigener Solarstrom spart. Sinnvoll ist das Modell bei großen Dächern ohne nennenswerten Eigenverbrauch, etwa Lagerhallen, oder als Ergänzung zu einem Liefervertrag.",
        },
        {
          typ: "p",
          text: "Wichtig sind Regelungen zu Dachzugang, Haftung für Dachschäden, Versicherung, Rückbau und zur Absicherung des Investors, etwa über eine Dienstbarkeit. Eine spätere Dachsanierung oder ein Verkauf der Liegenschaft muss im Vertrag mitgedacht sein.",
        },
      ],
    },
    {
      id: "energiegemeinschaft",
      titel: "Alternative: Energiegemeinschaft und gemeinschaftliche Erzeugung",
      tocLabel: "Energiegemeinschaft",
      bloecke: [
        {
          typ: "p",
          text: "**Statt Überschuss nur einzuspeisen oder das Dach zu verpachten, kann ein Betrieb Solarstrom über eine Energiegemeinschaft an Nachbarn, Gemeinde oder andere Unternehmen weitergeben.** Mitglieder einer [Erneuerbare-Energie-Gemeinschaft](/wissen/lexikon#eeg) können u. a. natürliche Personen, Gemeinden und KMU sein; für große Unternehmen steht die Bürgerenergiegemeinschaft offen. In EEG und gemeinschaftlichen Erzeugungsanlagen ist der gemeinschaftlich erzeugte und verbrauchte Strom von der Elektrizitätsabgabe befreit, in der Bürgerenergiegemeinschaft nicht.",
        },
        {
          typ: "p",
          text: "Für Gewerbeparks mit mehreren Mietern auf einer Liegenschaft passt oft eine [gemeinschaftliche Erzeugungsanlage](/ratgeber/gemeinschaftliche-erzeugungsanlage). Modelle für Betriebe erklärt [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe); Unterstützung beim Aufbau finden Sie unter [Energiegemeinschaften](/energiegemeinschaften).",
        },
      ],
    },
    {
      id: "entscheidung",
      titel: "Entscheidungskriterien: Welches Modell passt zu Ihrem Betrieb?",
      tocLabel: "Entscheidungshilfe",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Entscheidungshilfe für PV-Betreibermodelle",
          kopf: ["Ihre Situation", "Naheliegendes Modell"],
          zeilen: [
            ["Liquidität vorhanden, Gewinn im Unternehmen, langfristiger Standort", "Kauf – höchstes Ergebnis, IFB 22 % bis Ende 2026"],
            ["Gute Bonität, Kapital für das Kerngeschäft reserviert", "Kauf mit Kredit"],
            ["Kreditrahmen ausgeschöpft oder Bilanzkennzahlen wichtig", "Leasing, Vertrag steuerlich prüfen"],
            ["Keine Investition, kein technischer Aufwand gewünscht", "Contracting oder On-site-PPA"],
            ["Großes Dach, kaum eigener Verbrauch", "Dachpacht oder Anlage mit Überschussvermarktung, Energiegemeinschaft prüfen"],
            ["Gemietete Halle oder unsichere Standortperspektive", "Laufzeit an Mietvertrag koppeln, Übernahme- und Rückbauregeln klären"],
          ],
          hervorheben: 1,
          minBreite: 600,
        },
        {
          typ: "p",
          text: "Als Vergleichsbasis für jedes Leasing-, Contracting- oder PPA-Angebot sollten Sie ein Kaufangebot mit offener Wirtschaftlichkeitsrechnung haben – wie Sie Angebote prüfen, zeigt [PV-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen).",
        },
      ],
    },
    {
      id: "vertragsfallen",
      titel: "Vertragsfallen bei Leasing, Contracting, PPA und Dachpacht",
      tocLabel: "Vertragsfallen",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten Probleme entstehen nicht beim Preis, sondern bei Laufzeitende, Dachsanierung und Preisanpassung.** Prüfen Sie diese Punkte vor der Unterschrift:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Laufzeit:** passend zur Nutzungsdauer der Anlage, zur Restnutzungsdauer des Dachs und zu einem eventuellen Mietvertrag der Halle.",
            "**Endschaft:** Übernahme zu welchem Preis, Verlängerung oder Rückgabe – und in welchem Zustand?",
            "**Rückbau:** Wer demontiert, wer entsorgt, wer stellt die Dachhaut wieder her, und ist das finanziell abgesichert?",
            "**Dachsanierung:** Wer trägt Demontage, Zwischenlagerung, Wiedermontage und Ertragsausfall?",
            "**Indexierung:** Rate oder Strompreis an einen Index gebunden? Eine Preisgleitklausel kann den Vorteil deutlich schmälern.",
            "**Eigentumsübergang:** Wann und wie geht die Anlage über, und wie sind Anlage und Gebäude sachenrechtlich abgegrenzt?",
            "**Abnahmepflichten:** Mindestmengen oder Zahlungen auch bei Betriebsstillstand?",
            "**Bestandvertragsgebühr:** Bestand- und Nutzungsverträge können der Gebühr nach § 33 TP 5 Gebührengesetz (1 %) unterliegen – vorab prüfen lassen.",
            "**Insolvenz, Verkauf, Betriebsaufgabe:** Was passiert mit Vertrag, Anlage, Garantien und Service?",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ist Kaufen oder Leasen einer PV-Anlage für Unternehmen günstiger?",
      a: "Über 20 Jahre ist der Kauf günstiger: Im Beispiel mit 100 kWp bleiben beim Kauf rund 187.000 €, beim Leasing rund 156.000 € vor Steuern. Leasing lohnt sich, wenn Liquidität oder Kreditrahmen für andere Investitionen gebraucht werden.",
    },
    {
      q: "Was ist der Unterschied zwischen Contracting und PPA?",
      a: "Beim Contracting errichtet und betreibt ein Dritter die Anlage für Sie, meist auf Ihrem Dach, und Sie zahlen ein Entgelt. Ein PPA ist ein langfristiger Stromliefervertrag, der on-site oder off-site sein kann. In der Praxis überschneiden sich beide Begriffe beim On-site-Modell.",
    },
    {
      q: "Wer bekommt den Investitionsfreibetrag bei geleaster oder gepachteter Anlage?",
      a: "Der wirtschaftliche Eigentümer. Beim Kauf ist das der Betrieb, beim klassischen Leasing meist die Leasinggesellschaft, beim Contracting und bei der Dachpacht der Contractor bzw. Investor.",
    },
    {
      q: "Wer beantragt den EAG-Investitionszuschuss beim Contracting?",
      a: "In der Regel der Contractor als Investor und Anlagenbetreiber. Fragen Sie, ob und wie der Zuschuss in den Strompreis einfließt. Beim Leasing muss vor dem Antrag feststehen, wer als Förderwerber auftritt.",
    },
    {
      q: "Lohnt sich Dachpacht für ein Unternehmen?",
      a: "Nur, wenn der Betrieb den Strom nicht selbst nutzen kann. Mit angenommenen 3 €/kWp und Jahr bringt ein 100-kWp-Dach rund 6.000 € in 20 Jahren, während eigener Solarstrom im selben Zeitraum ein Vielfaches spart.",
    },
    {
      q: "Fällt bei Leasing- oder Contractingverträgen eine Gebühr an?",
      a: "Bestand- und Nutzungsverträge können der Bestandvertragsgebühr nach § 33 TP 5 Gebührengesetz von 1 % unterliegen. Ob und in welcher Höhe sie anfällt, hängt von der Vertragsgestaltung ab – lassen Sie das vor der Unterschrift klären.",
    },
    {
      q: "Kann ein Betrieb Solarstrom an Nachbarn weitergeben?",
      a: "Ja, zum Beispiel über eine Erneuerbare-Energie-Gemeinschaft, eine Bürgerenergiegemeinschaft oder eine gemeinschaftliche Erzeugungsanlage auf derselben Liegenschaft. Welche Form passt, hängt von Größe des Unternehmens, Standort und Teilnehmern ab.",
    },
  ],

  passend: [
    { href: "/ratgeber/photovoltaik-leasing", titel: "Photovoltaik-Leasing", text: "Raten, Zurechnung, Förderung und Vertragsprüfung." },
    { href: "/ratgeber/ppa-oesterreich", titel: "PPA in Österreich", text: "On-site- und Off-site-Stromlieferverträge." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Kauf, Kredit oder Leasing für Ihre Anlage." },
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "Solarstrom gemeinsam nutzen." },
  ],

  quellen: [
    { titel: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "09/2026" },
    { titel: "WKO – Ertragsteuerliche Behandlung von Leasing", url: "https://www.wko.at/steuern/ertragsteuer-leasing", stand: "09/2026" },
    { titel: "BMF – Erneuerbare-Energie-Gemeinschaften (u. a. Bestandvertragsgebühr § 33 TP 5 GebG)", url: "https://www.bmf.gv.at/themen/klimapolitik/steuerliche-aspekte-bei-photovoltaikanlagen-von-privatpersonen/erneuerbare-energie-gemeinschaften.html", stand: "09/2026" },
    { titel: "USP – Elektrizitätsabgabe", url: "https://www.usp.gv.at/themen/steuern-finanzen/weitere-steuern-und-abgaben/verbrauchsteuern_und_energieabgaben/elektrizitaetsabgabe.html", stand: "09/2026" },
    { titel: "OeMAG – EAG-Investitionszuschüsseverordnung-Strom, konsolidierte Fassung vom 19.01.2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "01/2026" },
    { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (PDF)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "2025" },
  ],

  seitenCta: { titel: "Kaufangebot als Vergleichsbasis?", text: "Anlage und Wirtschaftlichkeit für Ihren Betrieb durchrechnen lassen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Das passende Modell für Ihren Betrieb – mit offener Rechnung.",
    text: "Ökovolt plant, montiert und meldet PV-Anlagen in ganz Österreich aus einer Hand und unterstützt bei Finanzierung und Leasing.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Finanzierung", href: "/service/finanzierung" },
  },
};

export default artikel;
