// src/data/faqs.js
//
// FAQ für /faqs (Österreich). Redaktionell gepflegt – bewusst OHNE die
// Backoffice-Fragen der deutschen Website (andere Rechtslage).
// Fachlicher Stand: September 2026. Jede Antwort beginnt mit der direkten
// Antwort (zitierfähig); Zahlen tragen Stand bzw. Quelle.
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

export const FAQ_STAND = "September 2026";

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
        a: "Gut ausgerichtete Anlagen erzeugen in Österreich rund 1.000 bis 1.200 kWh je kWp und Jahr; Ost-West-Belegungen auf Flachdächern liegen etwas darunter, alpine Lagen durch Höhe und Schneereflexion teils darüber (Quelle: PVGIS der EU-Kommission). Eine 500-kWp-Hallendachanlage liefert damit grob 500.000 bis 550.000 kWh pro Jahr. Den Wert für Ihre Adresse zeigt unser Standort-Check.",
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
        a: "Die wichtigste Bundesförderung ist der EAG-Investitionszuschuss der OeMAG (EAG-Abwicklungsstelle). Er wird 2026 in mehreren Fördercalls von jeweils rund zwei Wochen vergeben, die Reihung erfolgt über ein Ticketsystem. Dazu kommen je nach Bundesland Landesförderungen sowie für Betriebe steuerliche Vorteile wie der Investitionsfreibetrag. Unser Förder-Check zeigt die passenden Programme für Ihr Vorhaben.",
      },
      {
        q: "Wie hoch ist der EAG-Investitionszuschuss für Photovoltaik 2026?",
        a: "Die Fördersätze 2026 betragen laut EAG-Abwicklungsstelle: Kategorie A (bis 10 kWp) 150 €/kWp, Kategorie B (über 10 bis 20 kWp) 140 €/kWp, Kategorie C (über 20 bis 100 kWp) höchstens 130 €/kWp und Kategorie D (über 100 kWp) höchstens 120 €/kWp. In den Kategorien C und D wird im Wettbewerb gereiht. Gefördert werden höchstens 30 % der förderfähigen Investitionskosten (Stand: September 2026).",
      },
      {
        q: "Wird ein Stromspeicher in Österreich gefördert?",
        a: "Ja, gemeinsam mit einer PV-Anlage kann im EAG-Investitionszuschuss auch ein Stromspeicher gefördert werden. Laut EAG-Abwicklungsstelle beträgt der Satz 150 €/kWh bei mindestens 0,5 kWh Speicherkapazität je kWp und höchstens 50 kWh geförderter Kapazität; auch hier gilt die Grenze von 30 % der förderfähigen Kosten (Stand: September 2026). Einzelne Bundesländer fördern Speicher zusätzlich.",
      },
      {
        q: "Was ist beim Förderansuchen zu beachten?",
        a: "Das Förderansuchen muss im offenen Fördercall über das EAG-Portal gestellt werden, bevor die Anlage verbindlich umgesetzt wird. Nach Vertragsabschluss mit der OeMAG gilt eine Frist für die Inbetriebnahme: laut EAG-Abwicklungsstelle 6 Monate für Anlagen bis 100 kWp und 12 Monate für größere Anlagen. Wir planen Angebot, Bestellung und Montage so, dass diese Fristen halten.",
      },
      {
        q: "Was bringt der Investitionsfreibetrag (IFB) für eine PV-Anlage?",
        a: "Der Investitionsfreibetrag nach § 11 EStG ist ein zusätzlicher Betriebsausgabenabzug neben der Abschreibung. Für Anschaffungen vom 1. November 2025 bis 31. Dezember 2026 beträgt er befristet 20 %, für ökologische Investitionen wie Photovoltaik 22 % der Anschaffungskosten (sonst 10 % bzw. 15 %). Die Bemessungsgrundlage ist mit 1 Mio. € je Wirtschaftsjahr gedeckelt. Details und die Kombination mit Förderungen klären Sie bitte mit Ihrer Steuerberatung.",
      },
      {
        q: "Können IFB und Gewinnfreibetrag gemeinsam genutzt werden?",
        a: "Nicht für dasselbe Wirtschaftsgut: Für eine Investition, für die der investitionsbedingte Gewinnfreibetrag geltend gemacht wird, steht kein Investitionsfreibetrag zu. Welche Variante im Einzelfall günstiger ist, hängt von Gewinnhöhe und Investitionsvolumen ab und sollte mit der Steuerberatung entschieden werden.",
      },
      {
        q: "Muss auf selbst verbrauchten Solarstrom Elektrizitätsabgabe bezahlt werden?",
        a: "Nein. Selbst erzeugter und selbst verbrauchter Strom aus Photovoltaik ist von der Elektrizitätsabgabe befreit – für Private und Unternehmen und ohne die früher geltende Grenze von 25.000 kWh pro Jahr. Eingespeister, an einen Stromhändler verkaufter Strom unterliegt beim Erzeuger ebenfalls nicht der Abgabe.",
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
        a: "Das ElWG ersetzt das ElWOG und ist seit 24. Dezember 2025 in Kraft; einzelne Teile gelten gestaffelt ab 2026 und 2027. Für PV relevant sind unter anderem die Spitzenkappung durch den Netzbetreiber, Anforderungen an die Steuerbarkeit neuer Anlagen, erleichterte Netzanschlüsse für kleine Anlagen, neue Formen der gemeinsamen Energienutzung sowie ab 1. Jänner 2027 eine neue Netzentgeltstruktur mit einem Beitrag für Einspeiser (Stand: September 2026).",
      },
      {
        q: "Was bedeutet die Spitzenkappung nach ElWG?",
        a: "Netzbetreiber dürfen die Einspeiseleistung neuer PV-Anlagen bei drohender Netzüberlastung begrenzen – auf nicht weniger als 70 % der Modulspitzenleistung; sehr kleine Anlagen sind laut klimaaktiv ausgenommen. Weil die Mittagsspitze nur wenige Stunden im Jahr erreicht wird, kostet das typischerweise nur wenige Prozent des Jahresertrags. Mit Eigenverbrauch, Speicher und passender Wechselrichterauslegung lässt sich der Verlust weiter senken.",
      },
      {
        q: "Müssen Einspeiser künftig Netzentgelte bezahlen?",
        a: "Ab 1. Jänner 2027 sieht das ElWG für Einspeiser einen Beitrag zur Netzinfrastruktur von höchstens 0,05 Cent je eingespeister kWh vor; kleine Anlagen bis 20 kW bleiben laut aktueller Rechtslage beitragsfrei (Stand: September 2026). Die genaue Ausgestaltung legt die Regulierungsbehörde E-Control in den Systemnutzungsentgelten fest.",
      },
      {
        q: "Was sind Netzebene 7, 6 und 5?",
        a: "Netzebene 7 ist das Niederspannungsnetz, Netzebene 6 die Umspannung von Mittel- auf Niederspannung (Anschluss direkt an der Trafostation), Netzebene 5 das Mittelspannungsnetz. Größere Gewerbe- und Freiflächenanlagen werden häufig auf Netzebene 6 oder 5 angeschlossen, oft mit eigener Trafostation. Die Netzebene bestimmt Anschlusskosten, Netzentgelte und die technischen Anforderungen.",
      },
      {
        q: "Was regeln die TOR Erzeuger und welcher Anlagentyp betrifft uns?",
        a: "Die Technischen und Organisatorischen Regeln (TOR) Erzeuger der E-Control legen fest, welche Anforderungen Erzeugungsanlagen am Netz erfüllen müssen. Sie unterscheiden Typ A (ab 0,8 kW bis unter 250 kW), Typ B (250 kW bis unter 35 MW), Typ C (35 bis unter 50 MW) und Typ D (ab 50 MW oder Anschluss ab 110 kV). Ab Typ B steigen die Anforderungen an Blindleistung, Wirkleistungsregelung und Fernsteuerbarkeit deutlich – hier setzen wir unseren eigenen Parkregler ein.",
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
        a: "Für Strom, den Mitglieder aus der EEG beziehen, entfallen die Elektrizitätsabgabe und der Erneuerbaren-Förderbeitrag; zusätzlich ist das arbeitsbezogene Netznutzungsentgelt reduziert – im Lokalbereich um 57 %, im Regionalbereich um 28 % (Netzebenen 6 und 7, Stand 2026). Mit der neuen Netzentgeltstruktur ab 2027 können sich diese Werte ändern.",
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
        a: "Peak Shaving bedeutet, kurze Lastspitzen mit einem Speicher abzufangen, damit die gemessene Höchstleistung sinkt. Betriebe, die leistungsgemessen abgerechnet werden – in der Regel ab 100.000 kWh Jahresverbrauch oder 50 kW Anschlussleistung –, zahlen einen Leistungspreis für diese Spitze. Wie viel sich sparen lässt, zeigt eine Auswertung Ihres Lastgangs.",
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
        a: "Überschuss wird ins Netz eingespeist und vermarktet: über einen Stromhändler bzw. Direktvermarkter, über die OeMAG zum Marktpreis oder über eine Energiegemeinschaft. Die OeMAG nimmt Strom aus Anlagen unter 500 kWp zum monatlich im Nachhinein ermittelten Marktpreis ab (Verträge laut OeMAG bis längstens 31.12.2030). Größere Anlagen vermarkten wir über Direktvermarktung oder PPA.",
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
        a: "Nach der Errichtung ist eine Erstprüfung nach ÖVE/ÖNORM E 8101 und ÖVE/ÖNORM EN 62446 mit Prüfbefund vorgeschrieben. In Arbeitsstätten verlangt die Elektroschutzverordnung (ESV 2012) wiederkehrende Prüfungen elektrischer Anlagen, als Richtwert längstens alle fünf Jahre; Versicherer fordern oft kürzere Intervalle. Unser E-Check dokumentiert alles prüffähig.",
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
        a: "Vor allem hohe Schneelasten, Schneerutsch und Wind: Module, Unterkonstruktion und Befestigung müssen für die Schneelastzone des Standorts nach ÖNORM B 1991-1-3 ausgelegt sein. Häufig gewünscht sind Indach-Lösungen, die sich architektonisch einfügen, sowie Notstrom für abgelegene Lagen. Für Eigentümer, die selten vor Ort sind, bieten wir eine Concierge-Wartung mit Fernüberwachung an.",
      },
      {
        q: "Gibt es für private PV-Anlagen noch den Nullsteuersatz?",
        a: "Nein. Der Umsatzsteuer-Nullsteuersatz für private PV-Anlagen bis 35 kWp galt vom 1. Jänner 2024 bis 31. März 2025 und ist ausgelaufen. Seither gilt wieder der Normalsteuersatz; im Gegenzug wurde der EAG-Investitionszuschuss auch für kleine Anlagen wieder geöffnet.",
      },
      {
        q: "Müssen Private Einnahmen aus der Einspeisung versteuern?",
        a: "In vielen Fällen nicht: Einkünfte natürlicher Personen aus der Einspeisung sind nach § 3 EStG bis zu 12.500 kWh pro Jahr steuerfrei, wenn die Anlage die gesetzliche Leistungsgrenze (derzeit 35 kWp Engpassleistung) nicht überschreitet (Stand: September 2026). Bei größeren Anlagen oder Vermietung sprechen Sie bitte mit Ihrer Steuerberatung.",
      },
      {
        q: "Welche Förderung bekommen Private für PV und Speicher?",
        a: "Private nutzen denselben EAG-Investitionszuschuss wie Betriebe, meist in Kategorie A (bis 10 kWp, 150 €/kWp) oder B (bis 20 kWp, 140 €/kWp), dazu die Speicherförderung (Stand 2026). Viele Bundesländer und Gemeinden fördern zusätzlich. Den Überblick liefert unser Förder-Check.",
      },
    ],
  },
];

/** Alle Fragen flach – z. B. für Schema oder Suche. */
export const FAQ_ALLE = FAQ_KATEGORIEN.flatMap((k) => k.items);

// Kompatibilität: frühere Struktur { [kategorieId]: items }
export const FAQ_ERGAENZUNG = Object.fromEntries(FAQ_KATEGORIEN.map((k) => [k.id, k.items]));
