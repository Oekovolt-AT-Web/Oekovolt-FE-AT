// src/data/faqs.js
//
// FAQ für /faqs (Österreich). Redaktionell gepflegt – bewusst OHNE die
// Backoffice-Fragen der deutschen Website (andere Rechtslage).
// Fachlicher Stand: September 2026. Jede Antwort beginnt mit der direkten
// Antwort (zitierfähig); Zahlen tragen Stand bzw. Quelle.
//
// PRINZIP „ANTWORT ZUERST“ (SEO-Plan M21): Wo es eine belegte Zahl gibt, steht sie
// im ERSTEN Satz – mit Einheit und „(Stand: …)“. Keine Zahl ohne Quelle unten.
// Bei Änderungen der Rechtslage FAQ_STAND und die betroffenen ersten Sätze anpassen.
//
// Quellen (Auswahl, abgerufen 09/2026):
// - EAG-Abwicklungsstelle/OeMAG: Investitionszuschuss PV & Speicher, Kategorien A–D,
//   Fördersätze 2026, max. 30 % der förderfähigen Kosten, Inbetriebnahmefristen
// - OeMAG: Marktpreis nach § 41 ÖSG 2012 (monatlich, Anlagen < 500 kWp, Verträge bis 31.12.2030)
// - USP.gv.at / Steuerberatung: Investitionsfreibetrag § 11 EStG, befristet 20 % / 22 %
//   (Anschaffungen 1.11.2025 – 31.12.2026), Bemessungsgrundlage max. 1 Mio. € je Wirtschaftsjahr
// - ElWG (BGBl., in Kraft seit 24.12.2025): Spitzenkappung, Netzanschluss, Einspeiserbeitrag ab 2027
// - energiegemeinschaften.gv.at: EEG/BEG, Entfall Elektrizitätsabgabe & Erneuerbaren-Förderbeitrag,
//   Mehrfachteilnahme seit 2024
// - EY Österreich: Elektrizitätsabgabe bei PV (Eigenverbrauch ohne Mengengrenze befreit)
// - PVGIS (EU-Kommission, JRC): spezifische Erträge Österreich
// - EAG-Abwicklungsstelle, FAQs Investitionszuschuss PV 2026 (Fragen 19/20, 26, 27, 32) – Werte
//   identisch mit src/lib/foerdercall.js (geprüft 30.09.2026)
// - ElWG (BGBl. I Nr. 91/2025) § 101 und BMWET „Spitzenkappung – Infos zum ElWG“: bis 70 %,
//   ausgenommen bis 7 kW netzwirksam (wie /technik/parkregler)
// - PV&B Austria „ElWG: Das Wichtigste im Überblick“, WKO „Information zum finalen ElWG“:
//   Beitrag der Einspeiser ab 1.1.2027 höchstens 0,05 Cent/kWh, befreit bis 20 kW netzwirksam
// - SNE-V 2018 idF 2026 (Netzentgeltreduktion EEG bis 31.12.2026, wie src/lib/rechner/energiegemeinschaft.js)
// - E-Control TOR Erzeuger Typ A–D (wie src/components/Technik/torTypen.js)
// - ESV 2012 § 9 (wiederkehrende Prüfung, wie src/content/ratgeber/e-check-photovoltaik.js)
// - Leistungsmessung ab > 100.000 kWh/Jahr oder > 50 kW (wie src/lib/rechner/peakshaving.js)

export const FAQ_STAND = "September 2026";
const STAND = `Stand: ${FAQ_STAND}`;

export const FAQ_KATEGORIEN = [
  {
    id: "gewerbe",
    label: "Gewerbe & Wirtschaftlichkeit",
    items: [
      {
        q: "Lohnt sich Photovoltaik für Gewerbe und Industrie in Österreich?",
        a: "In den meisten Fällen ja – entscheidend ist der Eigenverbrauchsanteil. Jede selbst genutzte Kilowattstunde ersetzt Energiepreis, Netzentgelte und Abgaben, während eingespeister Strom nur den Marktwert erlöst. Betriebe mit Tagesverbrauch (Produktion, Kühlung, Handel, Logistik) nutzen typischerweise einen großen Teil des Solarstroms selbst. Die belastbare Antwort liefert eine Simulation mit Ihrem Lastgang in 15-Minuten-Werten.",
      },
      {
        q: "Wie viel Strom erzeugt eine Photovoltaikanlage in Österreich?",
        a: `Rund 1.000 bis 1.200 kWh je kWp und Jahr erzeugen gut ausgerichtete PV-Anlagen in Österreich (${STAND}, Quelle: PVGIS der EU-Kommission). Ost-West-Belegungen auf Flachdächern liegen etwas darunter, alpine Lagen durch Höhe und Schneereflexion teils darüber. Eine 500-kWp-Hallendachanlage liefert damit grob 500.000 bis 600.000 kWh pro Jahr. Den Wert für Ihre Adresse zeigt unser Standort-Check.`,
      },
      {
        q: "Was kostet eine Photovoltaikanlage für einen Betrieb?",
        a: "Der Preis je kWp sinkt mit der Anlagengröße deutlich und hängt vor allem von Dach bzw. Unterkonstruktion, Netzanschluss (Trafo, Netzebene), Kabelwegen und Regelungstechnik ab. Seriös lässt er sich erst nach Sichtung von Dachplänen, Statik und Anschlusssituation beziffern. Wir erstellen dazu ein Angebot mit Wirtschaftlichkeitsrechnung, Förderprüfung und transparenter Aufstellung der Positionen.",
      },
      {
        q: "Welche Anlagengröße passt zu unserem Betrieb?",
        a: "Die wirtschaftlich beste Größe ergibt sich aus Lastgang, Dachfläche und Netzanschluss – nicht aus dem Jahresverbrauch allein. Ziel ist meist ein hoher Eigenverbrauch bei gleichzeitig guter Flächennutzung; Überschüsse werden vermarktet oder über Speicher, Ladepunkte bzw. eine Energiegemeinschaft genutzt. Pro kWp werden auf Schrägdächern rund 5 m², auf Flachdächern mit Aufständerung mehr Dachfläche benötigt.",
      },
      {
        q: "Warum ist der Lastgang so wichtig?",
        a: "Der Lastgang zeigt Ihren Stromverbrauch in 15-Minuten-Auflösung und damit, wie viel Solarstrom Sie zeitgleich selbst nutzen können. Er ist die Grundlage für Anlagengröße, Speicherauslegung (z. B. Lastspitzenkappung) und die Wirtschaftlichkeitsrechnung. Betriebe mit Lastprofilzähler oder Smart Meter erhalten ihn beim Netzbetreiber bzw. im Netzbetreiber-Webportal.",
      },
      {
        q: "Können wir die Anlage auch mieten, leasen oder per Contracting beziehen?",
        a: "Ja. Neben dem Kauf organisieren bzw. vermitteln wir Leasing und Finanzierung; über unsere Beteiligung an der ÖkoInvest GmbH sind auch Contracting- und PPA-Modelle möglich, bei denen Sie nur den erzeugten Strom bezahlen. Welches Modell sich rechnet, hängt von Bilanz, Steuersituation und Laufzeit ab – das stimmen wir mit Ihrer Steuerberatung ab.",
      },
      {
        q: "Wie lange dauert ein Gewerbeprojekt von der Anfrage bis zur Inbetriebnahme?",
        a: "Bei Dachanlagen im Gewerbe sind wenige Monate üblich; der Zeitplan hängt vor allem vom Netzbetreiber (Netzzugang, gegebenenfalls Netzausbau), von Lieferzeiten und von Genehmigungen ab. Freiflächen- und Agri-PV-Projekte brauchen wegen Widmung und Bewilligung meist deutlich länger. Den realistischen Terminplan legen wir nach der Netzanfrage schriftlich fest.",
      },
    ],
  },
  {
    id: "foerderung",
    label: "Förderung & Steuern",
    items: [
      {
        q: "Welche Förderung gibt es 2026 für Photovoltaik in Österreich?",
        a: `Bis zu 30 % der förderfähigen Investitionskosten deckt der EAG-Investitionszuschuss der OeMAG (EAG-Abwicklungsstelle), die wichtigste Bundesförderung für Photovoltaik (${STAND}). Er wird 2026 in mehreren Fördercalls von jeweils rund zwei Wochen vergeben, die Reihung erfolgt über ein Ticketsystem. Dazu kommen je nach Bundesland Landesförderungen sowie für Betriebe steuerliche Vorteile wie der Investitionsfreibetrag. Unser Förder-Check zeigt die passenden Programme für Ihr Vorhaben.`,
      },
      {
        q: "Wie hoch ist der EAG-Investitionszuschuss für Photovoltaik 2026?",
        a: `150 €/kWp in Kategorie A (bis 10 kWp), 140 €/kWp in Kategorie B (über 10 bis 20 kWp), höchstens 130 €/kWp in Kategorie C (über 20 bis 100 kWp) und höchstens 120 €/kWp in Kategorie D (über 100 kWp) – so lauten die Fördersätze 2026 laut EAG-Abwicklungsstelle (${STAND}). In den Kategorien C und D wird im Wettbewerb nach dem niedrigsten Förderbedarf gereiht. Gefördert werden höchstens 30 % der förderfähigen Investitionskosten.`,
      },
      {
        q: "Wird ein Stromspeicher in Österreich gefördert?",
        a: `Ja, mit 150 €/kWh nutzbarer Kapazität für höchstens 50 kWh – gemeinsam mit einer PV-Anlage im EAG-Investitionszuschuss (${STAND}). Laut EAG-Abwicklungsstelle muss der Speicher mindestens 0,5 kWh je kWp Modulleistung haben; auch hier gilt die Grenze von 30 % der förderfähigen Kosten. Einzelne Bundesländer fördern Speicher zusätzlich.`,
      },
      {
        q: "Was ist beim Förderansuchen zu beachten?",
        a: `6 Monate (bis 100 kWp) bzw. 12 Monate (über 100 kWp) ab Abschluss des Fördervertrags bleiben laut EAG-Abwicklungsstelle für die Inbetriebnahme (${STAND}). Das Förderansuchen muss im offenen Fördercall über das EAG-Portal gestellt werden, bevor die Anlage verbindlich umgesetzt wird. Eine Fristverlängerung gibt es nur, wenn die Verzögerung nachweislich nicht in Ihrem Einflussbereich liegt. Wir planen Angebot, Bestellung und Montage so, dass diese Fristen halten.`,
      },
      {
        q: "Was bringt der Investitionsfreibetrag (IFB) für eine PV-Anlage?",
        a: `22 % der Anschaffungskosten zusätzlich als Betriebsausgabe – so hoch ist der Investitionsfreibetrag nach § 11 EStG für Photovoltaik bei Anschaffungen vom 1. November 2025 bis 31. Dezember 2026 (${STAND}). Er kommt neben der Abschreibung dazu; für nicht ökologische Investitionen gelten befristet 20 % (sonst 10 % bzw. 15 %). Die Bemessungsgrundlage ist mit 1 Mio. € je Wirtschaftsjahr gedeckelt. Details und die Kombination mit Förderungen klären Sie bitte mit Ihrer Steuerberatung.`,
      },
      {
        q: "Können IFB und Gewinnfreibetrag gemeinsam genutzt werden?",
        a: "Nicht für dasselbe Wirtschaftsgut: Für eine Investition, für die der investitionsbedingte Gewinnfreibetrag geltend gemacht wird, steht kein Investitionsfreibetrag zu. Welche Variante im Einzelfall günstiger ist, hängt von Gewinnhöhe und Investitionsvolumen ab und sollte mit der Steuerberatung entschieden werden.",
      },
      {
        q: "Muss auf selbst verbrauchten Solarstrom Elektrizitätsabgabe bezahlt werden?",
        a: `Nein – für selbst erzeugten und selbst verbrauchten Photovoltaik-Strom fallen 0 Cent Elektrizitätsabgabe je kWh an, ohne die früher geltende Grenze von 25.000 kWh pro Jahr (${STAND}). Das gilt für Private und Unternehmen. Eingespeister, an einen Stromhändler verkaufter Strom unterliegt beim Erzeuger ebenfalls nicht der Abgabe.`,
      },
      {
        q: "Gibt es Förderungen für landwirtschaftliche Betriebe und Gemeinden?",
        a: "Ja. Landwirtschaftliche Betriebe können den EAG-Investitionszuschuss und als Betrieb den Investitionsfreibetrag nutzen; für Gemeinden kommen neben dem EAG-Zuschuss Programme des Klima- und Energiefonds, der betrieblichen Umweltförderung (KPC) und der Länder in Frage. Welche Kombination zulässig ist, prüfen wir im Förder-Check und im Beratungsgespräch.",
      },
    ],
  },
  {
    id: "netz",
    label: "Netz & Recht",
    items: [
      {
        q: "Wie läuft der Netzanschluss einer PV-Anlage in Österreich ab?",
        a: "Vor der Bestellung stellen wir beim zuständigen Netzbetreiber den Antrag auf Netzzugang für die Erzeugungsanlage. Der Netzbetreiber teilt Anschlusspunkt, Netzebene, gegebenenfalls eine Einspeisebegrenzung und die technischen Bedingungen mit; danach folgen Netzzugangsvertrag, Errichtung, Fertigstellungsmeldung und Inbetriebnahme mit Zählertausch. Den gesamten Ablauf übernehmen wir für Sie.",
      },
      {
        q: "Was ändert das neue Elektrizitätswirtschaftsgesetz (ElWG) für Photovoltaik?",
        a: `Seit 24. Dezember 2025 gilt das ElWG, und ab 1. Jänner 2027 zahlen Einspeiser höchstens 0,05 Cent je eingespeister kWh für die Netzinfrastruktur (${STAND}). Das ElWG ersetzt das ElWOG; einzelne Teile gelten gestaffelt ab 2026 und 2027. Für PV relevant sind außerdem die Spitzenkappung auf bis zu 70 % der Modulspitzenleistung, Anforderungen an die Steuerbarkeit neuer Anlagen, erleichterte Netzanschlüsse für kleine Anlagen und neue Formen der gemeinsamen Energienutzung.`,
      },
      {
        q: "Was bedeutet die Spitzenkappung nach ElWG?",
        a: `Auf bis zu 70 % der Modulspitzenleistung darf der Netzbetreiber die Einspeiseleistung neu angeschlossener oder erweiterter PV-Anlagen begrenzen; Anlagen bis 7 kW netzwirksamer Leistung sind ausgenommen (§ 101 ElWG, ${STAND}). Laut Wirtschaftsministerium gilt die Begrenzung zunächst statisch, ab 2028 ist eine dynamische Variante nach Netzzustand vorgesehen. Weil die Mittagsspitze nur wenige Stunden im Jahr erreicht wird, betrifft das meist nur einen kleinen Teil des Jahresertrags. Mit Eigenverbrauch, Speicher und passender Wechselrichterauslegung lässt sich der Verlust weiter senken.`,
      },
      {
        q: "Müssen Einspeiser künftig Netzentgelte bezahlen?",
        a: `Ja, höchstens 0,05 Cent je eingespeister kWh ab 1. Jänner 2027; Anlagen bis 20 kW netzwirksamer Leistung sind befreit (ElWG, ${STAND}). Der Beitrag zur Versorgungsinfrastruktur wird jährlich per Verordnung festgelegt und gilt auch für bestehende Anlagen.`,
      },
      {
        q: "Was sind Netzebene 7, 6 und 5?",
        a: "Netzebene 7 ist das Niederspannungsnetz, Netzebene 6 die Umspannung von Mittel- auf Niederspannung (Anschluss direkt an der Trafostation), Netzebene 5 das Mittelspannungsnetz. Größere Gewerbe- und Freiflächenanlagen werden häufig auf Netzebene 6 oder 5 angeschlossen, oft mit eigener Trafostation. Die Netzebene bestimmt Anschlusskosten, Netzentgelte und die technischen Anforderungen.",
      },
      {
        q: "Was regeln die TOR Erzeuger und welcher Anlagentyp betrifft uns?",
        a: `Vier Anlagentypen nach Maximalkapazität: Typ A ab 0,8 kW bis unter 250 kW, Typ B 250 kW bis unter 35 MW, Typ C 35 bis unter 50 MW und Typ D ab 50 MW oder mit Anschluss ab 110 kV (TOR Erzeuger der E-Control, ${STAND}). Die Technischen und Organisatorischen Regeln (TOR) legen fest, welche Anforderungen Erzeugungsanlagen am Netz erfüllen müssen. Ab Typ B steigen die Anforderungen an Blindleistung, Wirkleistungsregelung und Fernsteuerbarkeit deutlich – hier setzen wir unseren eigenen Parkregler ein.`,
      },
      {
        q: "Braucht eine PV-Anlage eine Baubewilligung?",
        a: "Das regeln die Bauordnungen der neun Bundesländer unterschiedlich. Dachanlagen sind vielfach bewilligungs- oder anzeigefrei, solange bestimmte Grenzen eingehalten werden; bei Ortsbildschutz, denkmalgeschützten Gebäuden oder aufgeständerten Anlagen kann eine Bauanzeige oder Baubewilligung nötig sein. Freiflächenanlagen brauchen in der Regel eine passende Flächenwidmung nach dem Raumordnungsrecht des Landes. Wir klären das vorab mit Gemeinde und Behörde.",
      },
      {
        q: "Welche Normen und Richtlinien gelten für PV-Anlagen in Österreich?",
        a: "Maßgeblich sind unter anderem das Elektrotechnikgesetz mit der Elektrotechnikverordnung, die ÖVE/ÖNORM E 8101 für Niederspannungsanlagen, die ÖVE/ÖNORM EN 62446 für Prüfung und Dokumentation von PV-Anlagen, die OVE-Richtlinie R 11-1 zu Sicherheits- und Brandschutzanforderungen, die ÖNORM B 1991-1-3 (Schneelast) und B 1991-1-4 (Wind) sowie die TOR Erzeuger. Errichten dürfen PV-Anlagen nur befugte Elektrotechnik-Unternehmen.",
      },
    ],
  },
  {
    id: "technik",
    label: "Technik & Planung",
    items: [
      {
        q: "Was ist ein Parkregler (EZA-Regler) und wann wird er gebraucht?",
        a: "Ein Parkregler – in Österreich oft EZA-Regler genannt – regelt eine Erzeugungsanlage am Netzanschlusspunkt als Ganzes: Wirkleistungsbegrenzung, Blindleistungsvorgaben, Vorgaben des Netzbetreibers per Fernwirktechnik und Nulleinspeisung. Netzbetreiber verlangen ihn typischerweise bei größeren Anlagen bzw. Anschlüssen in der Mittelspannung. Ökovolt setzt dafür einen selbst entwickelten Parkregler ein.",
      },
      {
        q: "Wie werden große PV-Anlagen überwacht?",
        a: "Über ein Monitoring- bzw. SCADA-System, das Wechselrichter, Zähler, Parkregler und Wetterdaten zusammenführt und Abweichungen meldet. Ökovolt betreibt eigene Fernwartungs- und SCADA-Systeme; die Digitalisierung und IT-Sicherheit entwickeln wir gemeinsam mit der Solensa GmbH. So erkennen wir Ertragsverluste früh und können viele Störungen aus der Ferne beheben.",
      },
      {
        q: "Welche Dächer eignen sich für Photovoltaik im Gewerbe?",
        a: "Geeignet sind grundsätzlich Trapezblech-, Sandwich-, Foliendächer und Schrägdächer, wenn Statik und Restlebensdauer der Dachhaut passen. Entscheidend sind die zusätzliche Last (Module, Unterkonstruktion, Ballast), Schnee- und Windlasten am Standort sowie Brandabschnitte und Wartungswege. Ist die Dachsanierung ohnehin fällig, sollte sie vor der PV-Montage erfolgen.",
      },
      {
        q: "Welche Rolle spielen Schneelast und Hagel in Österreich?",
        a: "Eine große: Die charakteristische Schneelast nach ÖNORM B 1991-1-3 reicht in Österreich von geringen Werten im Flachland bis zu sehr hohen Werten in alpinen Lagen und bestimmt Modulwahl, Unterkonstruktion und Befestigungsabstände. Den Wert für Ihre Adresse liefert die Naturgefahrenplattform eHORA (hora.gv.at). Für Hagel empfehlen wir Module mit hoher Hagelwiderstandsklasse und eine passende Versicherung.",
      },
      {
        q: "Was ist Agri-PV und was unterscheidet sie von einer Freiflächenanlage?",
        a: "Agri-PV nutzt dieselbe Fläche gleichzeitig für Landwirtschaft und Stromerzeugung – etwa mit hoch aufgeständerten oder vertikalen, bifazialen Modulreihen, zwischen denen bewirtschaftet wird. Eine klassische Freiflächenanlage nutzt die Fläche vorrangig energetisch. Für Agri-PV gelten in Förderung und Raumordnung teils günstigere Bedingungen; die Details hängen vom Bundesland ab.",
      },
      {
        q: "Welche Module und Wechselrichter verbaut Ökovolt?",
        a: "Wir arbeiten herstellerunabhängig mit Markenkomponenten, die wir nach Standort und Anforderung auswählen – etwa Glas-Glas-Module für hohe Schnee- und Hagellasten oder bifaziale Module für Agri-PV. Kriterien sind Zertifizierung, Garantiebedingungen, Service in Österreich und die Einbindung in unseren Parkregler und unser Monitoring.",
      },
    ],
  },
  {
    id: "energiegemeinschaften",
    label: "Energiegemeinschaften",
    items: [
      {
        q: "Was ist eine Erneuerbare-Energie-Gemeinschaft (EEG)?",
        a: "Eine Erneuerbare-Energie-Gemeinschaft nach § 79 EAG ist ein Zusammenschluss, der erneuerbaren Strom erzeugt und ihn über das öffentliche Netz innerhalb eines Netzbetreiber-Gebiets unter den Mitgliedern teilt. Mitglieder können natürliche Personen, Gemeinden, Behörden sowie kleine und mittlere Unternehmen sein. Die Gemeinschaft braucht eine eigene Rechtsform, etwa Verein oder Genossenschaft.",
      },
      {
        q: "Welche finanziellen Vorteile hat eine EEG?",
        a: `Um 57 % (lokal) bzw. 28 % (regional) ist das arbeitsbezogene Netznutzungsentgelt auf den Netzebenen 6 und 7 für Strom aus einer EEG reduziert, gültig bis 31. Dezember 2026 (${STAND}). Zusätzlich entfallen für diesen Strom die Elektrizitätsabgabe und der Erneuerbaren-Förderbeitrag. Ab 2027 gilt eine neue Netzentgeltstruktur; die Abschläge dafür legt die Tarifverordnung fest.`,
      },
      {
        q: "Was ist der Unterschied zwischen EEG, BEG und GEA?",
        a: "Eine EEG ist regional begrenzt (lokal oder regional im Netz eines Netzbetreibers) und erhält reduzierte Netzentgelte. Eine Bürgerenergiegemeinschaft (BEG) darf österreichweit über mehrere Netzgebiete agieren, erhält aber keine Netzentgeltreduktion. Eine gemeinschaftliche Erzeugungsanlage (GEA) teilt Strom innerhalb eines Gebäudes bzw. einer Liegenschaft, ohne das öffentliche Netz zu nutzen.",
      },
      {
        q: "Kann ein Unternehmen Mitglied einer Energiegemeinschaft sein?",
        a: "Kleine und mittlere Unternehmen können einer EEG beitreten, sofern die Teilnahme nicht ihre gewerbliche Haupttätigkeit ist; große Unternehmen sind von EEGs ausgeschlossen, können aber an einer BEG teilnehmen. Seit 2024 ist die Teilnahme an mehreren Gemeinschaften gleichzeitig möglich.",
      },
      {
        q: "Lohnt sich eine Energiegemeinschaft für Gemeinden?",
        a: "Häufig ja: Gemeinden verfügen über viele Dächer (Schulen, Bauhof, Kläranlage) und über Verbraucher mit Tageslast. Überschüsse aus einer Anlage können in einer EEG anderen Gemeindegebäuden, Betrieben oder Bürgerinnen und Bürgern zugutekommen. Wir planen Anlagen, Messkonzept und Abrechnung so, dass die Gemeinschaft von Beginn an sauber funktioniert.",
      },
      {
        q: "Was ändert sich durch das ElWG bei der gemeinsamen Energienutzung?",
        a: "Das ElWG erweitert die gemeinsame Energienutzung: Unter anderem werden direkte Stromlieferungen zwischen Teilnehmenden (Peer-to-Peer) möglich, die Umsetzung erfolgt gestaffelt ab Herbst 2026 (Stand: September 2026). Bestehende EEGs, BEGs und GEAs bleiben bestehen; für neue Projekte prüfen wir, welches Modell am besten passt.",
      },
    ],
  },
  {
    id: "speicher",
    label: "Speicher & Laden",
    items: [
      {
        q: "Wann rechnet sich ein Gewerbespeicher?",
        a: "Ein Gewerbespeicher rechnet sich vor allem, wenn er mehrere Aufgaben gleichzeitig erfüllt: Lastspitzen kappen und damit den Leistungspreis senken, Solarüberschüsse verschieben, Einspeisebegrenzungen abfangen und Notstrom liefern. Allein für die Eigenverbrauchserhöhung ist er im Gewerbe oft zu teuer. Grundlage der Auslegung ist Ihr 15-Minuten-Lastgang.",
      },
      {
        q: "Was ist Peak Shaving?",
        a: `Peak Shaving kappt kurze Lastspitzen mit einem Speicher, damit die gemessene Höchstleistung in kW sinkt – relevant für Betriebe mit Leistungsmessung, in der Regel ab mehr als 100.000 kWh Jahresverbrauch oder mehr als 50 kW (${STAND}). Diese Betriebe zahlen einen Leistungspreis für ihre Spitze. Wie viel sich sparen lässt, zeigt eine Auswertung Ihres Lastgangs.`,
      },
      {
        q: "Funktioniert eine PV-Anlage bei Stromausfall?",
        a: "Eine netzgekoppelte PV-Anlage schaltet bei Netzausfall aus Sicherheitsgründen automatisch ab. Für Notstrom bzw. Ersatzstrom braucht es einen Speicher mit inselnetzfähigem Wechselrichter und eine normgerechte Umschalteinrichtung, die das Objekt vom Netz trennt. Welche Verbraucher im Blackout versorgt werden sollen, legen wir gemeinsam in einem Notstromkonzept fest.",
      },
      {
        q: "Wie kombiniert man Photovoltaik mit Ladeinfrastruktur für die E-Flotte?",
        a: "Über ein Lastmanagement, das Ladepunkte nach verfügbarer PV-Leistung, Netzanschluss und Priorität steuert. So laden Firmenfahrzeuge tagsüber mit Solarstrom, ohne neue Lastspitzen zu erzeugen oder den Netzanschluss zu überlasten. Bei Lkw- oder Schnellladeinfrastruktur prüfen wir zusätzlich Speicher und Anschlussleistung.",
      },
      {
        q: "Was passiert mit dem Überschussstrom?",
        a: `Bei Anlagen unter 500 kWp nimmt die OeMAG den Überschuss zum monatlich im Nachhinein ermittelten Marktpreis ab, mit Verträgen bis längstens 31.12.2030 (${STAND}). Alternativ wird Überschuss über einen Stromhändler bzw. Direktvermarkter oder eine Energiegemeinschaft vermarktet. Größere Anlagen vermarkten wir über Direktvermarktung oder PPA.`,
      },
    ],
  },
  {
    id: "service",
    label: "Service & Wartung",
    items: [
      {
        q: "Muss eine gewerbliche PV-Anlage gewartet werden?",
        a: "Ja. Eine gewerbliche Anlage ist ein Betriebsmittel mit Verantwortung für Personen- und Brandschutz; dazu kommen Auflagen von Versicherung und Netzbetreiber. Regelmäßige Sichtprüfung, Messungen, Thermografie und die Auswertung der Monitoringdaten sichern Ertrag und Garantie. Wir bieten dafür Wartungsverträge mit einem Service-Level passend zur Anlagengröße an.",
      },
      {
        q: "Wie oft muss eine PV-Anlage elektrisch geprüft werden?",
        a: `Längstens alle 5 Jahre verlangt die Elektroschutzverordnung (§ 9 ESV 2012) in Arbeitsstätten eine wiederkehrende Prüfung elektrischer Anlagen (${STAND}). Davor steht nach der Errichtung eine Erstprüfung nach ÖVE/ÖNORM E 8101 und ÖVE/ÖNORM EN 62446 mit Prüfbefund. Versicherer fordern oft kürzere Intervalle. Unser E-Check dokumentiert alles prüffähig.`,
      },
      {
        q: "Was bringt eine Drohnen-Thermografie?",
        a: "Eine Thermografie per Drohne zeigt Hotspots, defekte Zellen, Bypass-Dioden und fehlerhafte Steckverbindungen, die im Monitoring nicht eindeutig sichtbar sind. Bei großen Dach- und Freiflächenanlagen ist sie deutlich schneller als eine Begehung und liefert eine georeferenzierte Fehlerliste. Sinnvoll ist sie vor Ablauf von Garantien und nach Hagel- oder Sturmereignissen.",
      },
      {
        q: "Wann sollte eine PV-Anlage gereinigt werden?",
        a: "Wenn sich sichtbare Verschmutzung bildet, die nicht vom Regen abgewaschen wird – typisch in der Nähe von Landwirtschaft, Tierhaltung, Holzverarbeitung, Straßen oder bei flach geneigten Modulen. Gereinigt wird mit geeigneten Verfahren nach Herstellervorgaben, damit Beschichtung und Garantie erhalten bleiben. Ob sich eine Reinigung rechnet, zeigt der Ertragsvergleich im Monitoring.",
      },
      {
        q: "Brauchen Gewerbeanlagen eine eigene PV-Versicherung?",
        a: "Empfehlenswert ist eine Photovoltaik- bzw. Allgefahrenversicherung, die Sachschäden etwa durch Hagel, Sturm, Überspannung oder Tierverbiss abdeckt, ergänzt um eine Ertragsausfall- und die Betriebshaftpflichtversicherung. Wir beraten zu den Anforderungen aus Technik und Wartung und vermitteln auf Wunsch Kontakte – Versicherungsprodukte selbst bieten wir nicht an.",
      },
      {
        q: "Übernehmen Sie auch Anlagen anderer Errichter in die Wartung?",
        a: "Ja. Nach einer Bestandsprüfung mit Dokumentationssichtung, Messung und gegebenenfalls Thermografie übernehmen wir auch Fremdanlagen in Wartung und Monitoring. Auf Wunsch binden wir sie in unsere Fernwartung und unser SCADA-System ein oder modernisieren sie im Zuge eines Repowerings.",
      },
    ],
  },
  {
    id: "privat",
    label: "Privat & Chalets",
    items: [
      {
        q: "Plant Ökovolt auch Anlagen für Privathäuser?",
        a: "Ja, nachgeordnet und mit Schwerpunkt auf anspruchsvolle Objekte: Premium-Wohngebäude und Luxus-Chalets in alpinen Lagen, bei denen Schneelast, Architektur und Wartung besondere Lösungen verlangen. Für Standard-Einfamilienhäuser beraten wir gerne, unser Fokus liegt aber auf Gewerbe, Landwirtschaft und öffentlicher Hand.",
      },
      {
        q: "Was ist bei Photovoltaik auf alpinen Chalets zu beachten?",
        a: "Vor allem hohe Schneelasten, Schneerutsch und Wind: Module, Unterkonstruktion und Befestigung müssen für die Schneelast des Standorts nach ÖNORM B 1991-1-3 (Wert laut eHORA-Rasterkarte) ausgelegt sein. Häufig gewünscht sind Indach-Lösungen, die sich architektonisch einfügen, sowie Notstrom für abgelegene Lagen. Für Eigentümer, die selten vor Ort sind, bieten wir eine Concierge-Wartung mit Fernüberwachung an.",
      },
      {
        q: "Gibt es für private PV-Anlagen noch den Nullsteuersatz?",
        a: `Nein – der Umsatzsteuersatz von 0 % für private PV-Anlagen bis 35 kWp galt nur vom 1. Jänner 2024 bis 31. März 2025 (${STAND}). Seither gilt wieder der Normalsteuersatz; im Gegenzug wurde der EAG-Investitionszuschuss auch für kleine Anlagen wieder geöffnet.`,
      },
      {
        q: "Müssen Private Einnahmen aus der Einspeisung versteuern?",
        a: `Bis 12.500 kWh eingespeisten Stroms pro Jahr sind für natürliche Personen steuerfrei, wenn die Anlage höchstens 35 kWp Engpassleistung hat (§ 3 EStG, ${STAND}). Bei größeren Anlagen oder Vermietung sprechen Sie bitte mit Ihrer Steuerberatung.`,
      },
      {
        q: "Welche Förderung bekommen Private für PV und Speicher?",
        a: `150 €/kWp (Kategorie A, bis 10 kWp) bzw. 140 €/kWp (Kategorie B, über 10 bis 20 kWp) aus dem EAG-Investitionszuschuss, dazu 150 €/kWh für einen Speicher (${STAND}). Private nutzen damit dieselbe Bundesförderung wie Betriebe. Viele Bundesländer und Gemeinden fördern zusätzlich. Den Überblick liefert unser Förder-Check.`,
      },
    ],
  },
];

/** Alle Fragen flach – z. B. für Schema oder Suche. */
export const FAQ_ALLE = FAQ_KATEGORIEN.flatMap((k) => k.items);

// Kompatibilität: frühere Struktur { [kategorieId]: items }
export const FAQ_ERGAENZUNG = Object.fromEntries(FAQ_KATEGORIEN.map((k) => [k.id, k.items]));
