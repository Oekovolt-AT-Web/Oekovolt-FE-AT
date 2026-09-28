// Ratgeber: E-Flotte mit Photovoltaik laden – Firmenflotte in Österreich
// Quellen: BMF-Erlass 24.10.2025 (Strompreis 2026 Kostenersatz 32,806 ct/kWh; 2025: 35,889) via EY;
// ÖGK (Laden beim Arbeitgeber kein Sachbezug; Pauschale 30 €/Monat bis 31.12.2025; Wallbox beim DN bis 2.000 €);
// WKO/LBG (Sachbezug E-Kfz ab 2027: 0,375 %, max. 180 €/Monat, AK-Grenze 48.000 €; 2028: 0,625 %, max. 300 €;
// Kundmachung Stand 03.09.2026 ausstehend); WKO (Vorsteuer E-Pkw: ≤ 40.000 € voll, bis 80.000 € anteilig);
// TOR Verteilernetzanschluss NS V1.3.1 (Ladeeinrichtungen); OVE R 37 (Prüfbericht ab 15.12.2026), OVE R 30;
// umweltfoerderung.at (eRide Betriebe 2025 beendet, max. 30 % der umweltrelevanten Kosten); OeMAG-Marktpreis 2026.

const FZG = 10;
const KM = 25000;
const VERBRAUCH = 20; // kWh/100 km inkl. Ladeverluste, Annahme
const BEDARF = (FZG * KM * VERBRAUCH) / 100; // kWh/Jahr
const BEZUG = 0.2; // €/kWh netto, Annahme
const MARKT = 0.068; // €/kWh, OeMAG-Sommermarktpreis PV 2026 gerundet
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const zeile = (q) => [`${Math.round(q * 100)} %`, kwh(BEDARF * q), eur(BEDARF * (1 - q) * BEZUG + BEDARF * q * MARKT), eur(BEDARF * q * (BEZUG - MARKT))];

const artikel = {
  slug: "e-flotte-laden-photovoltaik",
  title: "E-Flotte mit Photovoltaik laden: Lastmanagement, Sachbezug, Abrechnung",
  seoTitle: "E-Flotte laden mit PV: Sachbezug & Lastmanagement | Ökovolt",
  kurzTitel: "E-Flotte laden",
  description:
    "E-Flotte mit PV laden: Sachbezug 2026 und ab 2027, Kostenersatz Heimladen 32,806 ct/kWh, Lastmanagement nach TOR, Abrechnung und Förderung für Betriebe.",
  excerpt:
    "Dienstwagen und Transporter mit eigenem Solarstrom zu laden, ist einer der stärksten Hebel für Eigenverbrauch und Kosten. Was steuerlich 2026 gilt, was sich 2027 ändert und wie Ladepunkte im Betrieb technisch und organisatorisch richtig aufgesetzt werden.",
  hauptKeyword: "e-flotte laden photovoltaik",
  keywords: [
    "E-Flotte laden Photovoltaik",
    "Firmenflotte Elektro Österreich",
    "Sachbezug E-Auto 2026",
    "Sachbezug E-Auto 2027",
    "Kostenersatz Laden daheim 2026",
    "Lastmanagement Ladepunkte Betrieb",
    "Laden am Arbeitsplatz",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Dienstleistungen/Smartphone/wallbox-scaled.jpg",
  bildAlt: "Wallbox an einer Außenwand mit angeschlossenem Ladekabel",
  badge: { wert: "0 %", text: "Sachbezug für E-Dienstwagen 2026 – ab 2027 sind 0,375 % beschlossen" },

  kurzFazit: [
    "**2026 gilt für Firmen-E-Autos mit 0 g/km CO₂ noch ein Sachbezug von 0 %.** Ab 1. Jänner 2027 sind laut Budgetbegleitgesetz 0,375 % der Anschaffungskosten (höchstens 180 € im Monat) vorgesehen, ab 2028 0,625 % (höchstens 300 €); die Kundmachung stand Anfang September 2026 noch aus.",
    "**Kostenloses Laden beim Arbeitgeber ist kein Sachbezug; Laden zu Hause kann 2026 mit 32,806 ct/kWh steuerfrei ersetzt werden** – aber nur mit Nachweis der Lademenge je Fahrzeug. Die 30-€-Monatspauschale ist mit Ende 2025 ausgelaufen.",
    `**Solarstrom macht die Flotte günstiger:** ${FZG} Fahrzeuge mit je ${KM.toLocaleString("de-DE")} km brauchen rund ${kwh(BEDARF)} im Jahr. Kommen 40 % davon aus der eigenen PV, bringt das in unserem Beispiel rund ${eur(BEDARF * 0.4 * (BEZUG - MARKT))} pro Jahr gegenüber Netzbezug (Annahmen im Rechenbeispiel).`,
    "**Ohne Lastmanagement geht es nicht:** Die TOR verlangen für Ladeeinrichtungen über 3,68 kVA eine offene, steuerbare Schnittstelle; ab 10 kVA Summenleistung kann der Netzbetreiber den Anschluss zur Prüfung aussetzen, wenn kein Energiemanagement die vereinbarte Leistung sicherstellt.",
  ],

  abschnitte: [
    {
      id: "warum",
      titel: "Warum E-Flotte und Photovoltaik zusammenpassen",
      tocLabel: "Warum PV + Flotte?",
      bloecke: [
        {
          typ: "p",
          text: "**Dienst- und Poolfahrzeuge stehen oft genau dann am Betriebsgelände, wenn die PV-Anlage am meisten erzeugt – das macht die Flotte zum idealen, flexiblen Verbraucher für Solarstrom.** Jede Kilowattstunde, die statt ins Netz in ein Fahrzeug fließt, ersetzt teuren Netzbezug oder öffentliches Laden. Zugleich ist der Fuhrpark in vielen Betrieben ein großer Posten in der CO₂-Bilanz.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Poolfahrzeuge & Transporter", text: "Stehen tagsüber zwischen Einsätzen oder kommen mittags zurück – gut planbar, hoher PV-Anteil möglich." },
            { titel: "Dienstwagen der Mitarbeitenden", text: "Stehen während der Arbeitszeit am Parkplatz – ideales Überschussladen mit niedriger Leistung über viele Stunden." },
            { titel: "Kunden- und Gästeparkplatz", text: "Handel, Hotellerie, Gemeinden: Ladepunkte als Service, Solarstrom als Argument – Abrechnung beachten." },
          ],
        },
        {
          typ: "p",
          text: "Wie das Laden mit Überschuss technisch funktioniert, beschreibt der Ratgeber [PV-Überschussladen](/ratgeber/pv-ueberschussladen); die Grundlagen zur Installation einzelner Ladepunkte finden Sie unter [Wallbox Installation](/ratgeber/wallbox-installation).",
        },
      ],
    },
    {
      id: "steuer",
      titel: "Sachbezug, Vorsteuer und Kostenersatz: Was steuerlich gilt",
      tocLabel: "Sachbezug & Steuer",
      bloecke: [
        {
          typ: "p",
          text: "**Für Elektro-Dienstwagen mit einem CO₂-Emissionswert von 0 g/km ist 2026 kein Sachbezug anzusetzen; ab 2027 wird ein reduzierter Sachbezug eingeführt.** Im Zuge des Doppelbudgets 2027/2028 wurde eine Änderung der Sachbezugswerteverordnung beschlossen; laut Steuerberatungskanzleien stand die Kundmachung Anfang September 2026 noch aus. Eine Übergangsregel für bereits angeschaffte Fahrzeuge ist nicht vorgesehen.",
        },
        {
          typ: "tabelle",
          caption: "Steuerliche Eckpunkte für E-Dienstwagen in Österreich, Stand September 2026",
          kopf: ["Thema", "Regel", "Hinweis"],
          zeilen: [
            ["Sachbezug 2026", "0 % für Kfz mit 0 g/km CO₂", "Verbrenner: 1,5 % bzw. 2 % (max. 720 € bzw. 960 € im Monat)"],
            ["Sachbezug ab 2027", "0,375 % der Anschaffungskosten, max. 180 €/Monat; Anschaffungskosten-Obergrenze 48.000 € brutto", "beschlossen, Kundmachung ausstehend (Stand 03.09.2026)"],
            ["Sachbezug ab 2028", "0,625 %, max. 300 €/Monat", "Evaluierung 2030 angekündigt"],
            ["Vorsteuerabzug E-Pkw", "bis 40.000 € brutto voll; 40.000–80.000 € anteilige Korrektur über Eigenverbrauch; über 80.000 € kein Vorsteuerabzug", "gilt für Fahrzeuge mit 0 g/km CO₂"],
            ["Laden beim Arbeitgeber", "kostenloses Laden firmeneigener und privater E-Autos ist kein Sachbezug", "Ladepunkte am Betriebsgelände"],
            ["Kostenersatz Laden daheim", "2026 bis 32,806 ct/kWh steuerfrei (2025: 35,889 ct/kWh)", "nur mit fahrzeugbezogenem Nachweis der Lademenge"],
            ["Wallbox beim Dienstnehmer", "Kostenübernahme bzw. Zurverfügungstellung bis 2.000 € ohne Sachbezug", "bei Leasing anteilig"],
          ],
          minBreite: 740,
          fussnote: "Quellen: BMF-Erlass vom 24.10.2025 (über EY Österreich), ÖGK, WKO, LBG Österreich. Vereinfachte Darstellung, keine Steuerberatung – Details mit Ihrer Steuerberatung und Lohnverrechnung klären.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Seit 2026: Nachweis statt Pauschale",
          text: "Die steuerfreie Pauschale von 30 € pro Monat für das Laden zu Hause galt für die Jahre 2023 bis 2025 und ist ausgelaufen. Seit 1. Jänner 2026 ist der Kostenersatz nur steuerfrei, wenn die geladene Strommenge eindeutig dem Firmenfahrzeug zugeordnet werden kann – etwa über eine Wallbox mit Fahrzeug- oder RFID-Zuordnung, Fahrzeugdaten oder ein Abrechnungssystem. Planen Sie die Messtechnik bei der Wallbox für Mitarbeitende gleich mit.",
        },
        {
          typ: "p",
          text: "Für die Fuhrparkstrategie heißt das: Der Vorteil von E-Dienstwagen gegenüber Verbrennern bleibt ab 2027 groß, schrumpft aber. Umso wichtiger wird es, die Energiekosten niedrig zu halten – mit Solarstrom vom eigenen Dach und Laden am Betriebsgelände, das ohne Sachbezug möglich ist. Allgemeine steuerliche Fragen zur PV-Anlage behandelt der Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: `Rechenbeispiel: ${FZG} Dienstfahrzeuge mit Solarstrom`,
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Wie viel Solarstrom der Flotte bringt, hängt vom PV-Anteil an der Ladeenergie ab.** Beispiel: ${FZG} Fahrzeuge mit je ${KM.toLocaleString("de-DE")} km im Jahr und ${VERBRAUCH} kWh/100 km inklusive Ladeverlusten brauchen rund ${kwh(BEDARF)} Strom.`,
        },
        {
          typ: "tabelle",
          caption: `Ladekosten einer Flotte mit ${FZG} Fahrzeugen nach PV-Anteil (Beispielrechnung, Stand September 2026)`,
          kopf: ["PV-Anteil", "Solarstrom", "Energiekosten pro Jahr", "Vorteil ggü. reinem Netzbezug"],
          zeilen: [zeile(0), zeile(0.25), zeile(0.4), zeile(0.6)],
          hervorheben: 3,
          markierteZeile: 2,
          minBreite: 620,
          fussnote: "Annahmen: Netzbezug 20 ct/kWh netto (Energie, Netz, Abgaben – eigenen Wert einsetzen); Solarstrom bewertet mit der entgangenen Einspeisung von 6,8 ct/kWh (gerundeter OeMAG-Sommermarktpreis PV 2026). Ohne Kosten für Ladeinfrastruktur, ohne Leistungspreiseffekte.",
        },
        {
          typ: "p",
          text: "Ein PV-Anteil von 40 % ist bei Fahrzeugen, die tagsüber stehen, realistisch erreichbar – im Sommer mehr, im Winter weniger. Fahrzeuge, die nur nachts am Betrieb sind, profitieren eher von einem Speicher oder einem günstigen Nachttarif. Wie der Speicher die Lastspitze senkt, erklärt [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
      ],
    },
    {
      id: "lastmanagement",
      titel: "Lastmanagement: Ladepunkte, Anschlussleistung und TOR",
      tocLabel: "Lastmanagement & TOR",
      bloecke: [
        {
          typ: "p",
          text: "**Mehrere Ladepunkte ohne Lastmanagement überschreiten schnell die vereinbarte Anschlussleistung – ein dynamisches Lastmanagement verteilt die verfügbare Leistung in Echtzeit auf die Fahrzeuge und nutzt PV-Überschüsse bevorzugt.** Beim [Lastmanagement](/wissen/lexikon#lastmanagement) unterscheidet man statische Begrenzung (fixe Obergrenze für alle Ladepunkte) und dynamische Regelung (Messung am Netzanschlusspunkt, Anpassung an Gebäudelast und PV).",
        },
        {
          typ: "tabelle",
          caption: "TOR-Anforderungen an Ladeeinrichtungen im Betrieb (TOR Verteilernetzanschluss NS V1.3.1)",
          kopf: ["Anforderung", "Inhalt"],
          zeilen: [
            ["Meldung", "Ladeeinrichtungen über 3,68 kVA sind dem Netzbetreiber zu melden (Datenblatt oder Online-Portal)"],
            ["Summenleistung ≥ 10 kVA", "Netzbetreiber kann den Anschluss vorübergehend aussetzen und binnen 4 Wochen Gründe und Alternativen nennen – nicht, wenn ein EMS die vereinbarte Leistung sicher einhält"],
            ["Kommunikation", "bidirektionale digitale Schnittstelle, offenes Protokoll (z. B. OCPP, EEBUS), externe Leistungsbegrenzung"],
            ["Symmetrie", "Anschluss über Drehstrom, Unsymmetrie höchstens 16 A je Leiter; bei mehreren Ladepunkten Phasen zyklisch tauschen"],
            ["Ladeprogramme", "reduzierte Leistung und Zeitsteuerung; zufällige Startverzögerung 0–300 Sekunden"],
            ["Über 250 kW Ladeleistung", "Vereinbarung über Wirkleistungsvorgaben mit dem Netzbetreiber möglich"],
            ["Konformität", "Prüfbericht nach OVE-Richtlinie R 37; laut Netzbetreibern und Prüfstellen ab 15.12.2026 verpflichtend, bis dahin Herstellererklärung"],
          ],
          minBreite: 680,
          fussnote: "Quelle: E-Control, TOR Verteilernetzanschluss Niederspannung V1.3.1; OVE; LINZ NETZ. Maßgeblich sind der Originaltext und die Vorgaben Ihres Netzbetreibers.",
        },
        {
          typ: "p",
          text: "Das Lastmanagement sollte Prioritäten kennen: Welches Fahrzeug muss wann mit welchem Ladestand bereitstehen? Poolfahrzeuge für den Nachmittag gehen vor Dienstwagen, die erst abends gebraucht werden. Ein übergeordnetes [Energiemanagementsystem](/ratgeber/energiemanagementsystem) koordiniert Ladepunkte zusätzlich mit Speicher, Wärmepumpe und Produktion. Planung und Errichtung von Ladeparks übernimmt Ökovolt über den Bereich [Ladeinfrastruktur](/ladeinfrastruktur).",
        },
      ],
    },
    {
      id: "ladeleistung",
      titel: "Welche Ladeleistung braucht die Flotte?",
      tocLabel: "Ladeleistung",
      bloecke: [
        {
          typ: "p",
          text: "**Für Fahrzeuge, die mehrere Stunden am Betrieb stehen, reicht in der Regel AC-Laden mit 11 kW je Punkt – oft sogar weniger, wenn das Lastmanagement die Leistung auf viele Fahrzeuge verteilt.** Schnellladen mit Gleichstrom (DC) ist teuer in Anschaffung und Anschluss und nur dort sinnvoll, wo Fahrzeuge zwischen Einsätzen kurz nachladen müssen.",
        },
        {
          typ: "tabelle",
          caption: "Ladeleistung nach Einsatzprofil (Orientierung)",
          kopf: ["Einsatzprofil", "Typische Standzeit am Betrieb", "Empfehlung"],
          zeilen: [
            ["Dienstwagen, Pendelstrecke", "8–9 Stunden", "AC 11 kW, Überschussladen mit niedriger Mindestleistung"],
            ["Servicefahrzeuge, Rückkehr mittags", "1–3 Stunden", "AC 11–22 kW, Priorität im Lastmanagement"],
            ["Transporter mit hoher Tagesleistung", "über Nacht", "AC 11 kW nachts, ggf. Speicher oder günstiger Tarif"],
            ["Fahrzeuge im Mehrschichtbetrieb", "kurz zwischen Schichten", "einzelne DC-Ladepunkte, Anschlussleistung prüfen"],
          ],
          minBreite: 620,
        },
      ],
    },
    {
      id: "abrechnung",
      titel: "Abrechnung: Dienstwagen, Mitarbeitende, Gäste",
      tocLabel: "Abrechnung",
      bloecke: [
        {
          typ: "p",
          text: "**Wer Ladestrom verrechnen oder steuerlich nachweisen muss, braucht ein Backend, das Ladevorgänge Fahrzeugen oder Personen zuordnet – meist über OCPP-fähige Ladepunkte und RFID-Karten.** Die Anforderungen unterscheiden sich je nach Nutzergruppe.",
        },
        {
          typ: "tabelle",
          caption: "Abrechnungsfälle bei betrieblicher Ladeinfrastruktur",
          kopf: ["Fall", "Was zu klären ist"],
          zeilen: [
            ["Firmenfahrzeug lädt am Betrieb", "kein Sachbezug; interne Kostenstellen-Zuordnung, Kennzahlen je Fahrzeug"],
            ["Privates Auto von Mitarbeitenden lädt am Betrieb", "kostenloses Laden ist kein Sachbezug; bei Verrechnung Preis und Messung regeln"],
            ["Firmenfahrzeug lädt zu Hause", "Kostenersatz bis 32,806 ct/kWh (2026) nur mit fahrzeugbezogenem Nachweis; Wallbox beim Dienstnehmer bis 2.000 € ohne Sachbezug"],
            ["Gäste und Kunden", "öffentlich zugängliche Ladepunkte: Ad-hoc-Laden nach EU-Verordnung AFIR, Preisangabe, Zahlungsmöglichkeit; bei kWh-Abrechnung eichrechtskonforme Messung klären"],
          ],
          minBreite: 620,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Messung bei Verrechnung an Dritte",
          text: "Wird Strom nach Kilowattstunden an Dritte verrechnet, muss die Messung den Anforderungen des Maß- und Eichgesetzes entsprechen. Klären Sie mit Hersteller und Backend-Anbieter, ob die gewählten Ladepunkte dafür zugelassen sind – das ist bei der Auswahl leichter als bei der Nachrüstung.",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung für betriebliche Ladeinfrastruktur 2026",
      tocLabel: "Förderung 2026",
      bloecke: [
        {
          typ: "p",
          text: "**Die Bundesförderung für betriebliche Ladeinfrastruktur (eRide 2025) ist wegen ausgeschöpften Budgets vorzeitig beendet; neue Registrierungen sind nicht möglich, bereits registrierte Projekte können noch eingereicht werden.** Das Programm förderte Ladeinfrastruktur mit höchstens 30 % der umweltrelevanten Investitionskosten, verlangte Strom aus erneuerbaren Quellen und einen Betrieb von mindestens vier Jahren. Eine Neuauflage wurde vom Mobilitätsministerium im April 2026 angekündigt, ein Startdatum war im August 2026 nicht bekannt.",
        },
        {
          typ: "liste",
          punkte: [
            "**Vor Bestellung prüfen:** Bei Neuauflagen gilt meist Registrierung vor Umsetzung – sonst kein Anspruch.",
            "**Ökostrom-Nachweis:** Förderprogramme verlangten bisher Strom aus erneuerbaren Quellen – eigener PV-Strom plus Ökostromvertrag erfüllt das.",
            "**Landesförderungen:** Mehrere Bundesländer fördern Ladeinfrastruktur, vor allem in Wohngebäuden; für Betriebe laufend prüfen.",
            "**Steuerliche Wirkung:** Ladeinfrastruktur ist ein abschreibbares Wirtschaftsgut – Investitionsfreibetrag und AfA mit der Steuerberatung klären.",
          ],
        },
        {
          typ: "p",
          text: "Den aktuellen Stand prüfen Sie am besten mit dem [Förder-Check](/foerdercheck) oder auf der Seite [Bundesförderung](/forderungen/bundesfoerderung).",
        },
      ],
    },
    {
      id: "einfuehrung",
      titel: "Checkliste: E-Flotte mit PV einführen",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Fahrprofile erfassen: Kilometer pro Tag, Standzeiten am Betrieb, Bedarf am Morgen und Nachmittag.",
            "Anschlussleistung und Lastgang prüfen; mit dem Netzbetreiber klären, ob die Leistung reicht.",
            "Ladeleistung pro Punkt festlegen: für lange Standzeiten genügt oft 11 kW AC, für Schnelleinsätze einzelne DC-Punkte.",
            "Dynamisches Lastmanagement mit PV-Überschussregelung und Prioritäten einplanen (OCPP/EEBUS).",
            "Leerrohre und Reserven für spätere Erweiterung vorsehen – Nachrüsten ist teurer.",
            "Ladepunkte mit OVE-R-37-Prüfbericht wählen (ab 15.12.2026 verpflichtend) und beim Netzbetreiber melden.",
            "Abrechnung und Nachweise für Heimladen und Dienstwagen-Sachbezug ab 2027 organisieren.",
            "Wiederkehrende Prüfung der Ladeeinrichtungen nach OVE-Richtlinie R 30 in den Wartungsplan aufnehmen.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt plant PV-Anlage, [Gewerbespeicher](/gewerbespeicher), Ladepunkte und [Wallboxen](/produkte/wallbox) als Gesamtsystem – vom Lastgang bis zur Meldung beim Netzbetreiber, in ganz Österreich.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie hoch ist der Sachbezug für ein E-Auto 2026?",
      a: "Für Firmenfahrzeuge mit einem CO₂-Emissionswert von 0 g/km ist 2026 kein Sachbezug anzusetzen. Ab 2027 sind 0,375 % der Anschaffungskosten (höchstens 180 € im Monat) und ab 2028 0,625 % (höchstens 300 €) beschlossen; die Kundmachung stand Anfang September 2026 noch aus.",
    },
    {
      q: "Wie viel darf der Arbeitgeber für das Laden zu Hause ersetzen?",
      a: "2026 bis zu 32,806 ct/kWh steuerfrei, wenn die Lademenge nachweislich dem Firmenfahrzeug zugeordnet werden kann. Die frühere Pauschale von 30 € pro Monat ist mit Ende 2025 ausgelaufen.",
    },
    {
      q: "Ist kostenloses Laden am Arbeitsplatz ein Sachbezug?",
      a: "Nein. Unentgeltliches Laden beim Arbeitgeber ist weder für Firmenfahrzeuge noch für private E-Autos der Mitarbeitenden ein Sachbezug.",
    },
    {
      q: "Darf der Arbeitgeber eine Wallbox beim Mitarbeiter bezahlen?",
      a: "Ja. Die Kostenübernahme bzw. Zurverfügungstellung einer Ladeeinrichtung beim Dienstnehmer ist bis 2.000 € kein Sachbezug; bei Leasing gilt der Betrag anteilig.",
    },
    {
      q: "Brauche ich für mehrere Ladepunkte ein Lastmanagement?",
      a: "In der Praxis ja. Ladeeinrichtungen über 3,68 kVA sind meldepflichtig und müssen laut TOR über ein offenes Protokoll steuerbar sein. Ab 10 kVA Summenleistung kann der Netzbetreiber den Anschluss zur Prüfung aussetzen – ein Energiemanagement, das die vereinbarte Leistung einhält, verhindert das.",
    },
    {
      q: "Gibt es 2026 eine Förderung für betriebliche Ladestationen?",
      a: "Die Bundesförderung eRide 2025 für Betriebe ist ausgeschöpft und beendet; eine Neuauflage ist angekündigt, der Start war im August 2026 noch offen. Prüfen Sie Landesförderungen und den aktuellen Stand vor der Bestellung.",
    },
    {
      q: "Wie viel Solarstrom kann eine E-Flotte nutzen?",
      a: "Bei Fahrzeugen, die tagsüber am Betrieb stehen, sind 40 % und mehr der Ladeenergie aus PV realistisch – im Sommer deutlich mehr, im Winter weniger. Fahrzeuge, die nur nachts laden, profitieren eher von einem Speicher oder günstigen Nachttarifen.",
    },
  ],

  passend: [
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur", text: "Ladeparks für Betriebe, Hotels und Gemeinden." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, Meldung und TOR in Österreich." },
    { href: "/ratgeber/pv-ueberschussladen", titel: "PV-Überschussladen", text: "Laden mit Solarstrom-Überschuss." },
    { href: "/ratgeber/bidirektionales-laden", titel: "Bidirektionales Laden", text: "Flotte als Speicher (V2B/V2G)." },
  ],

  quellen: [
    { titel: "EY Österreich – BMF: Strompreis 2026 für das Laden emissionsfreier Kfz", url: "https://www.ey.com/de_at/technical/steuernachrichten/bmf-strompreis-2026-laden", stand: "10/2025" },
    { titel: "ÖGK – Aufladen von Elektrofahrzeugen: Neuregelungen", url: "https://www.oegk.at/cdscontent/?contentid=10007.905973&portal=oegkdgportal", stand: "09/2026" },
    { titel: "WKO – Sachbezug für E-Autos ab 2027: Auswirkungen auf die Umsatzsteuer", url: "https://www.wko.at/lohnverrechnung/sachbezug-e-autos-auswirkungen-umsatzsteuer", stand: "09/2026" },
    { titel: "LBG Österreich – Sachbezug für E-Kfz ab 1.1.2027", url: "https://www.lbg.at/servicecenter/lbg_steuertipps_praxis/sachbezug_f%C3%BCr_e_kfz_ab_1_1_2027/index_ger.html", stand: "09/2026" },
    { titel: "WKO – Vorsteuerabzug bei Fahrzeugen", url: "https://www.wko.at/steuern/vorsteuerabzug-bei-pkw-und-kombi", stand: "09/2026" },
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "Umweltförderung (KPC) – E-Ladeinfrastruktur für Betriebe 2025 (eRide)", url: "https://www.umweltfoerderung.at/betriebe/e-ladeinfrastruktur-betriebe-2025-eride", stand: "09/2026" },
    { titel: "LINZ NETZ – E-Ladeeinrichtung (Meldung, Netzbereitstellungsentgelt, OVE R 37)", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/e_ladeeinrichtung", stand: "09/2026" },
  ],

  seitenCta: { titel: "Flotte elektrifizieren?", text: "PV, Ladepunkte und Lastmanagement aus einer Hand.", href: "/ladeinfrastruktur", label: "Ladeinfrastruktur planen" },
  cta: {
    title: "Ihre Flotte fährt mit Solarstrom vom eigenen Dach.",
    text: "Ökovolt plant PV, Speicher und Ladepunkte mit Lastmanagement für Betriebe, Hotels und Gemeinden in ganz Österreich – inklusive Meldung beim Netzbetreiber.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Ladeinfrastruktur", href: "/ladeinfrastruktur" },
  },
};

export default artikel;
