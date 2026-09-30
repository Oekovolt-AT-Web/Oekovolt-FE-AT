// Ratgeber: Photovoltaik nach Tarifende bzw. nach 20 Jahren – Weiterbetrieb, Marktpreis, Eigenverbrauch, Repowering (Österreich)
// Quellen: OeMAG – Marktpreise 2026 (monatlich, ab 2024 im Nachhinein ermittelt; Jänner 8,842 bis Juli 6,146,
// August 8,997 ct/kWh PV; Ausgleichsenergie-Abzug 0,408 ct/kWh), OeMAG-FAQ (Tarifverzicht/Umstellung auf Marktpreis),
// TOR Stromerzeugungsanlagen Typ A V1.4 (gültig ab 01.06.2026) für getauschte Wechselrichter,
// IEC TS 62446-3 / ESV 2012 (Zustandsprüfung), Richtlinie 2012/19/EU (WEEE, PV-Module als Elektroaltgeräte).
// Tariflaufzeiten nach Ökostromgesetz im jeweiligen OeMAG-Vertrag prüfen (typisch 13 Jahre, ÖSG 2012).

const MP = { jan: 8.842, feb: 8.457, mar: 5.72, apr: 6.772, mai: 6.772, jun: 6.772, jul: 6.146, aug: 8.997 }; // ct/kWh, OeMAG PV 2026
const ct = (x) => x.toFixed(2).replace(".", ",");

const artikel = {
  slug: "photovoltaik-nach-20-jahren",
  title: "Photovoltaik nach Tarifende und 20 Jahren: Weiterbetrieb oder Repowering?",
  seoTitle: "PV nach 20 Jahren: Weiterbetrieb & Repowering | Ökovolt",
  kurzTitel: "PV nach 20 Jahren",
  description:
    "Photovoltaik nach Ende des Einspeisetarifs und nach 20 Jahren: Marktpreis, Stromhändler, Eigenverbrauch, Zustandsprüfung, Repowering und Rückbau in Österreich.",
  excerpt:
    "Wenn der geförderte Einspeisetarif ausläuft oder die Anlage 20 Jahre alt wird, stellen sich drei Fragen: Wohin mit dem Strom, wie gut ist die Anlage noch – und lohnt sich ein Repowering? Mit Marktpreisen 2026 und Entscheidungshilfe.",
  hauptKeyword: "photovoltaik nach 20 jahren",
  keywords: [
    "Photovoltaik nach 20 Jahren",
    "PV Tarifende Österreich",
    "OeMAG Marktpreis nach Tarifende",
    "PV-Anlage Weiterbetrieb",
    "Repowering Photovoltaik",
    "Photovoltaik alte Anlage Wechselrichter tauschen",
    "PV-Module entsorgen Österreich",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Team/solar-power-6860359_1280.jpg",
  bildAlt: "Ältere Photovoltaikanlage auf einem Dach vor blauem Himmel",
  badge: { wert: `${ct(MP.aug)} ct`, text: "OeMAG-Marktpreis PV im August 2026 je kWh" },

  kurzFazit: [
    "**Eine PV-Anlage hört nach Ende des geförderten Einspeisetarifs nicht auf zu arbeiten – sie verliert nur die Tarifförderung.** Gut gewartete Module liefern oft 25 bis 30 Jahre und länger Strom; getauscht werden müssen meist nur Wechselrichter und einzelne Komponenten.",
    `**Für den Überschuss gibt es nach Tarifende drei Wege:** Marktpreis über die OeMAG (2026 monatlich zwischen ${ct(MP.mar)} und ${ct(MP.aug)} ct/kWh für PV), einen Vertrag mit einem Stromhändler oder die Teilnahme an einer Energiegemeinschaft.`,
    "**Wirtschaftlich zählt nach Tarifende vor allem der Eigenverbrauch:** Jede selbst genutzte Kilowattstunde spart Energiepreis, Netzentgelte und Abgaben – im Betrieb ein Vielfaches des Marktpreises.",
    "**Vor der Entscheidung steht die Zustandsprüfung:** Prüfbefund, I-U-Kennlinien und Thermografie zeigen, ob Weiterbetrieb, Teilsanierung oder Repowering mit neuen, leistungsstärkeren Modulen sinnvoll ist.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was passiert mit einer PV-Anlage nach Tarifende?",
      tocLabel: "Nach Tarifende",
      bloecke: [
        {
          typ: "p",
          text: "**Nach Ende des Fördervertrags mit der OeMAG läuft die Anlage technisch unverändert weiter; es endet nur die Abnahme zum geförderten Tarif.** In Österreich wurden Einspeisetarife nach dem Ökostromgesetz für eine begrenzte Laufzeit vergeben – nach dem Ökostromgesetz 2012 typischerweise 13 Jahre. Viele Verträge aus den Jahren ab 2013 laufen deshalb ab 2026 aus. Die genaue Laufzeit steht in Ihrem OeMAG-Vertrag.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Weiter einspeisen", text: "Zum Marktpreis über die OeMAG-Marktpreis-Bilanzgruppe oder über einen Stromhändler – Vertrag rechtzeitig vor Tarifende abschließen." },
            { titel: "Eigenverbrauch steigern", text: "Anlage auf Eigenverbrauch umstellen, Speicher, Wärmepumpe oder Ladepunkte einbinden – der wirtschaftlich stärkste Hebel." },
            { titel: "Repowering", text: "Alte Module durch neue, leistungsstärkere ersetzen, Wechselrichter erneuern – oft mit deutlich mehr Leistung auf gleicher Fläche." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Keine Lücke entstehen lassen",
          text: "Speist eine Anlage nach Tarifende ohne gültigen Abnahmevertrag ein, erhält der Betreiber für diesen Strom unter Umständen keine Vergütung. Klären Sie spätestens drei Monate vor Vertragsende, wer den Überschuss abnimmt – und ob Messung und Zählpunkt angepasst werden müssen.",
        },
      ],
    },
    {
      id: "vermarktung",
      titel: "Wohin mit dem Überschuss: Marktpreis, Stromhändler, Energiegemeinschaft",
      tocLabel: "Überschuss vermarkten",
      bloecke: [
        {
          typ: "p",
          text: "**Der einfachste Weg nach Tarifende ist der Marktpreis der OeMAG: Seit 2024 wird er monatlich im Nachhinein ermittelt und orientiert sich an den mengengewichteten Day-Ahead-Preisen der Strombörse, abzüglich der Kosten für Ausgleichsenergie.** Für 2026 beträgt dieser Abzug bei Photovoltaik 0,408 ct/kWh. In einzelnen Monaten wird ein Anteil von 60 % des Marktpreises nach § 41 Abs. 1 ÖSG herangezogen.",
        },
        {
          typ: "tabelle",
          caption: "OeMAG-Marktpreis für Photovoltaik 2026 in ct/kWh, Stand September 2026",
          kopf: ["Monat", "Marktpreis PV", "Monat", "Marktpreis PV"],
          zeilen: [
            ["Jänner", ct(MP.jan), "Mai", ct(MP.mai)],
            ["Februar", ct(MP.feb), "Juni", ct(MP.jun)],
            ["März", ct(MP.mar), "Juli", ct(MP.jul)],
            ["April", ct(MP.apr), "August", ct(MP.aug)],
          ],
          minBreite: 480,
          fussnote: "Quelle: OeMAG, Marktpreise 2026 (Photovoltaik und andere Energieträger außer Windkraft). Werte werden monatlich im Nachhinein veröffentlicht.",
        },
        {
          typ: "p",
          text: "Auffällig ist das Sommerloch: In den ertragsstarken Monaten April bis Juli lag der Marktpreis 2026 zwischen rund 6,1 und 6,8 ct/kWh, weil zur Mittagszeit viel Solarstrom am Markt ist. Genau dann liefert die Anlage die meiste Energie. Stromhändler bieten teils Festpreise oder Spotpreis-Modelle; Energiegemeinschaften ermöglichen den Verkauf an Mitglieder in der Nähe mit reduzierten Netzentgelten. Die Details vergleichen die Ratgeber [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis) und [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden) sowie die Übersicht [Einspeisung für Betriebe](/einspeisung-gewerbe).",
        },
        {
          typ: "tabelle",
          caption: "Vermarktungswege nach Tarifende im Vergleich",
          kopf: ["Weg", "Erlös", "Aufwand", "Geeignet für"],
          zeilen: [
            ["OeMAG-Marktpreis", "monatlicher Marktpreis minus Ausgleichsenergie", "gering, Antrag bzw. Tarifverzicht bei der OeMAG", "Standardlösung für kleine und mittlere Anlagen"],
            ["Stromhändler", "Fix- oder Spotpreis, je nach Vertrag", "Vertragsvergleich, ggf. Viertelstundenmessung", "Anlagen mit größeren Überschüssen"],
            ["Energiegemeinschaft (EEG/BEG)", "vereinbarter Preis mit Mitgliedern, reduzierte Netzentgelte im Nahbereich", "Gründung oder Beitritt, Abrechnung", "Betriebe und Gemeinden mit Partnern in der Nähe"],
            ["Direktvermarktung", "Marktpreis abzüglich Dienstleistungsentgelt", "Fernsteuerbarkeit, Fahrpläne", "große Anlagen, Parks"],
          ],
          minBreite: 660,
        },
      ],
    },
    {
      id: "eigenverbrauch",
      titel: "Eigenverbrauch statt Einspeisung: der stärkste Hebel",
      tocLabel: "Eigenverbrauch",
      bloecke: [
        {
          typ: "p",
          text: "**Nach Tarifende ist jede selbst genutzte Kilowattstunde mehrfach so viel wert wie eine eingespeiste.** Wer selbst verbraucht, spart nicht nur den Energiepreis, sondern auch Netznutzungs- und Netzverlustentgelt, Elektrizitätsabgabe (2026 für Unternehmen 0,82 ct/kWh) und Erneuerbaren-Förderkosten. Für Betriebe mit Tagverbrauch liegt der Wert einer eigenen Kilowattstunde deshalb meist deutlich über 15 ct netto, während der Sommer-Marktpreis bei rund 6 bis 7 ct lag.",
        },
        {
          typ: "liste",
          punkte: [
            "**Volleinspeiser umbauen:** Ältere Anlagen speisen oft über einen eigenen Zählpunkt voll ein. Ein Umbau auf Überschusseinspeisung macht den Strom im Gebäude nutzbar – der Netzbetreiber muss eingebunden werden.",
            "**Verbraucher verschieben:** Kühlung, Druckluft, Warmwasser, Ladepunkte und Wärmepumpen in die Mittagsstunden legen – siehe [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
            "**Speicher nachrüsten:** Ein Speicher verschiebt Mittagsstrom in Abend und Nacht und kann Lastspitzen kappen. Wichtig ist die Verträglichkeit mit dem bestehenden Wechselrichter (AC-Kopplung) – mehr unter [Stromspeicher](/produkte/stromspeicher).",
            "**Energiemanagement:** Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) steuert Verbraucher nach Erzeugung und Tarif.",
          ],
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: Was eine 50-kWp-Anlage nach Tarifende bringt",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: "**Wie stark der Eigenverbrauch nach Tarifende zählt, zeigt eine typische landwirtschaftliche oder gewerbliche Anlage mit 50 kWp aus dem Jahr 2013.** Wir nehmen an, dass sie heute noch rund 47.000 kWh im Jahr erzeugt (ca. 940 kWh/kWp inklusive Alterung) und bisher voll eingespeist hat.",
        },
        {
          typ: "tabelle",
          caption: "50-kWp-Bestandsanlage nach Tarifende: Wert des Stroms pro Jahr (Beispielrechnung)",
          kopf: ["Szenario", "Eigenverbrauch", "Einspeisung zum Marktpreis", "Wert pro Jahr (ca.)"],
          zeilen: [
            ["Volleinspeisung zum Marktpreis", "0 kWh", "47.000 kWh × 6,8 ct", "3.200 €"],
            ["Umbau, 30 % Eigenverbrauch", "14.100 kWh × 18 ct", "32.900 kWh × 6,8 ct", "4.800 €"],
            ["Umbau + Lastverschiebung, 50 % Eigenverbrauch", "23.500 kWh × 18 ct", "23.500 kWh × 6,8 ct", "5.800 €"],
            ["Umbau + Speicher, 70 % Eigenverbrauch", "32.900 kWh × 18 ct", "14.100 kWh × 6,8 ct", "6.900 €"],
          ],
          hervorheben: 3,
          markierteZeile: 2,
          minBreite: 680,
          fussnote: "Annahmen: Marktpreis rund 6,8 ct/kWh (Sommermonate 2026 laut OeMAG gerundet), Wert der selbst genutzten Kilowattstunde 18 ct netto (Energiepreis, Netzentgelte, Abgaben – betriebsindividuell sehr unterschiedlich). Ohne Kosten für Umbau, Speicher und Wartung.",
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt die Richtung, nicht Ihr Ergebnis: Ob sich Umbau und Speicher lohnen, hängt von Ihrem Lastgang ab. Betriebe mit hohem Tagverbrauch – Milchviehbetriebe mit Kühlung, Werkstätten, Hotels im Sommer – profitieren am meisten. Für Gemeinden kommen Energiegemeinschaften mit Schulen, Kläranlagen oder Bauhöfen in Frage, um Überschüsse vor Ort zu nutzen.",
        },
      ],
    },
    {
      id: "zustand",
      titel: "Wie gut ist die Anlage noch? Zustandsprüfung vor der Entscheidung",
      tocLabel: "Zustandsprüfung",
      bloecke: [
        {
          typ: "p",
          text: "**Bevor Sie über Weiterbetrieb oder Repowering entscheiden, sollte der technische Zustand gemessen – nicht geschätzt – werden.** Module altern langsam, aber unterschiedlich: Neben der normalen [Degradation](/wissen/lexikon#degradation) treten mit den Jahren Delamination, Rückseitenfolienrisse, verfärbte Einbettung, defekte Bypassdioden oder [PID](/wissen/lexikon#pid) auf. Wechselrichter haben meist eine kürzere Lebensdauer als Module.",
        },
        {
          typ: "tabelle",
          caption: "Zustandsprüfung einer älteren PV-Anlage",
          kopf: ["Prüfung", "Was sie zeigt", "Hinweis"],
          zeilen: [
            ["Monitoring-Auswertung", "Ertragsentwicklung über Jahre, Performance Ratio, Ausfälle", "Vergleich mit Einstrahlungsdaten"],
            ["Sichtprüfung", "Glasbruch, Delamination, Folienrisse, Korrosion, Kabel und Stecker", "besonders Stecker und Kabelbinder altern"],
            ["Isolationsmessung", "Feuchte oder beschädigte Leitungen und Module", "sicherheitsrelevant"],
            ["I-U-Kennlinie", "tatsächliche Leistung je String im Vergleich zum Datenblatt", "Grundlage für Repowering-Entscheidung"],
            ["Thermografie", "Hotspots, Diodenfehler, Stringausfälle", "am effizientesten per Drohne"],
            ["Unterkonstruktion & Dach", "Tragfähigkeit, Korrosion, Dachhaut unter den Modulen", "Dachsanierung ggf. mit Repowering kombinieren"],
          ],
          minBreite: 640,
        },
        {
          typ: "p",
          text: "Für Betriebe ist die wiederkehrende Prüfung nach ESV 2012 ohnehin Pflicht – sie lässt sich mit der Zustandsbewertung verbinden, siehe [E-Check für PV-Anlagen](/ratgeber/e-check-photovoltaik). Wie Wärmebilder aus der Luft ausgewertet werden, erklärt der Ratgeber [PV-Thermografie mit Drohne](/ratgeber/pv-thermografie-drohne).",
        },
      ],
    },
    {
      id: "sicherheit",
      titel: "Sicherheit alter Anlagen: Was heute nachgerüstet werden sollte",
      tocLabel: "Sicherheit nachrüsten",
      bloecke: [
        {
          typ: "p",
          text: "**Anlagen aus den 2000er- und frühen 2010er-Jahren wurden nach damaligem Stand errichtet – bei Brandschutz, Überspannungsschutz und Kennzeichnung hat sich seither viel getan.** Ein Bestandsschutz entbindet nicht davon, erkannte Gefahren zu beseitigen, und Versicherer bewerten alte Anlagen zunehmend kritisch.",
        },
        {
          typ: "liste",
          punkte: [
            "**Feuerwehr-Kennzeichnung und Plan** nach aktueller OVE-Richtlinie R 11-1 (Ausgabe 2022) ergänzen, DC-Leitungswege im Gebäude dokumentieren – siehe [Brandschutz bei Photovoltaik](/ratgeber/photovoltaik-brandschutz).",
            "**Steckverbinder und Kabelbinder** tauschen, wenn sie spröde sind; Mischverbindungen unterschiedlicher Hersteller beseitigen.",
            "**Überspannungsschutz** prüfen und nach OVE-Richtlinie R 6-2-2 ergänzen; alte Ableiter sind häufig verbraucht.",
            "**Wechselrichterstandort** kontrollieren: Brandlast, Belüftung, Abstand zu brennbaren Materialien – besonders in landwirtschaftlichen Gebäuden.",
            "**Monitoring nachrüsten**, wenn nur ein Display vorhanden ist – Ausfälle werden sonst erst spät bemerkt.",
          ],
        },
      ],
    },
    {
      id: "repowering",
      titel: "Repowering: Wann lohnt sich der Tausch?",
      tocLabel: "Repowering",
      bloecke: [
        {
          typ: "p",
          text: "**Repowering lohnt sich vor allem dann, wenn die Dachfläche knapp, der Eigenverbrauch hoch und die alte Anlage deutlich unter ihrer Nennleistung ist.** Moderne Module leisten auf gleicher Fläche ein Vielfaches älterer Generationen, und neue Wechselrichter erfüllen die aktuellen Netzanschlussregeln inklusive Blindleistungs- und Wirkleistungssteuerung.",
        },
        {
          typ: "tabelle",
          caption: "Entscheidungshilfe: Weiterbetrieb, Teilsanierung oder Repowering",
          kopf: ["Situation", "Empfehlung"],
          zeilen: [
            ["Module in gutem Zustand, Wechselrichter läuft", "weiterbetreiben, Monitoring und Prüfintervalle beibehalten"],
            ["Module gut, Wechselrichter defekt oder am Lebensende", "Wechselrichter tauschen (neues Gerät muss aktuelle TOR erfüllen), ggf. Speicher mitplanen"],
            ["einzelne Module defekt, keine Ersatzmodule verfügbar", "Teil-Repowering: betroffene Strings mit neuen Modulen und passender Elektronik neu aufbauen"],
            ["starke Degradation, Sicherheitsmängel, Dachsanierung ansteht", "Repowering der gesamten Anlage, Dach und Unterkonstruktion gleich mit erneuern"],
            ["hoher Strombedarf, wenig Fläche", "Repowering mit Leistungserhöhung – Netzanschluss und Förderung neu prüfen"],
          ],
          minBreite: 620,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Netzbetreiber und Förderung einbinden",
          text: "Ein Wechselrichtertausch oder eine Leistungserhöhung ist eine Änderung der Erzeugungsanlage und beim Netzbetreiber zu melden; neue Geräte müssen die aktuelle TOR Stromerzeugungsanlagen erfüllen (Typ A, Version 1.4, seit 1. Juni 2026). Erweiterungen können über den EAG-Investitionszuschuss förderfähig sein – Details im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Ökovolt bietet [Repowering](/service/repowering) inklusive Netzbetreiber-Abstimmung an.",
        },
      ],
    },
    {
      id: "rueckbau",
      titel: "Rückbau und Entsorgung alter Module",
      tocLabel: "Rückbau & Entsorgung",
      bloecke: [
        {
          typ: "p",
          text: "**PV-Module sind Elektroaltgeräte und dürfen nicht über den Bauschutt entsorgt werden; sie werden über die Sammel- und Verwertungssysteme für Elektroaltgeräte zurückgenommen.** Die EU-Richtlinie 2012/19/EU (WEEE) bezieht Photovoltaikmodule ausdrücklich ein; in Österreich ist sie in der Elektroaltgeräteverordnung umgesetzt. Glas, Aluminium und Kupfer lassen sich weitgehend recyceln.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Rückbau nur durch Fachbetrieb: Module stehen bei Licht unter Spannung, DC-Leitungen sicher trennen.",
            "Rücknahme über Hersteller, Importeur oder Sammelsystem klären – bei gewerblichen Mengen vorab anmelden.",
            "Funktionsfähige Module können als Gebrauchtware weiterverwendet werden, wenn Prüfprotokolle vorliegen.",
            "Wechselrichter, Speicher und Kabel getrennt entsorgen; Batterien nach den Vorgaben für Altbatterien.",
            "Abmeldung beim Netzbetreiber und bei der OeMAG, Anpassung der Versicherung – siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie lange bekomme ich den Einspeisetarif der OeMAG?",
      a: "Die Laufzeit steht in Ihrem Fördervertrag. Nach dem Ökostromgesetz 2012 wurden PV-Tarife typischerweise für 13 Jahre vergeben. Nach Ende der Laufzeit können Sie zum Marktpreis weiter einspeisen oder zu einem Stromhändler wechseln.",
    },
    {
      q: "Was bekomme ich nach Tarifende für meinen Solarstrom?",
      a: `Bei der OeMAG den monatlichen Marktpreis für Photovoltaik – 2026 lag er zwischen ${ct(MP.mar)} ct/kWh (März) und ${ct(MP.aug)} ct/kWh (August). Stromhändler und Energiegemeinschaften bieten eigene Modelle. Wirtschaftlich attraktiver ist meist der Eigenverbrauch.`,
    },
    {
      q: "Wie lange halten Solarmodule?",
      a: "Gut gewartete Module liefern oft 25 bis 30 Jahre und länger Strom, mit langsam sinkender Leistung. Wechselrichter werden in dieser Zeit meist mindestens einmal getauscht. Ob eine Anlage noch gut ist, zeigen Kennlinienmessung und Thermografie.",
    },
    {
      q: "Lohnt sich ein Repowering alter PV-Anlagen?",
      a: "Oft ja, wenn die Fläche knapp ist, der Eigenverbrauch hoch und die alte Anlage stark degradiert. Neue Module leisten auf gleicher Fläche ein Vielfaches. Netzanschluss und mögliche Förderung für die Erweiterung sind vorab zu klären.",
    },
    {
      q: "Muss ich einen Wechselrichtertausch melden?",
      a: "Ja, eine Änderung der Erzeugungsanlage ist dem Netzbetreiber zu melden. Neue Wechselrichter müssen die aktuellen TOR Stromerzeugungsanlagen erfüllen. Die Meldung übernimmt in der Regel der ausführende Elektrotechniker.",
    },
    {
      q: "Wie entsorge ich alte Solarmodule?",
      a: "Über die Rücknahme- und Sammelsysteme für Elektroaltgeräte, nicht über den Bauschutt. Hersteller und Importeure sind in die Rücknahme eingebunden. Den Rückbau sollte ein Fachbetrieb übernehmen, weil Module bei Licht Spannung erzeugen.",
    },
    {
      q: "Kann ich eine alte Volleinspeise-Anlage auf Eigenverbrauch umstellen?",
      a: "Ja, in der Regel durch einen Umbau der Zählung auf Überschusseinspeisung. Der Netzbetreiber muss eingebunden werden, und die Anlage muss die geltenden Anschlussbedingungen erfüllen. Das lohnt sich besonders bei hohem Tagverbrauch im Betrieb.",
    },
    {
      q: "Soll ich bei einer alten Anlage gleich einen Speicher nachrüsten?",
      a: "Wenn Sie nach Tarifende auf Eigenverbrauch umstellen, kann ein Speicher den Anteil deutlich erhöhen. Bei bestehenden Wechselrichtern ist meist ein AC-gekoppelter Speicher die einfachste Lösung. Steht ohnehin ein Wechselrichtertausch an, kann ein Hybridwechselrichter PV und Speicher gemeinsam versorgen – rechnen Sie beide Varianten anhand Ihres Lastgangs durch.",
    },
  ],

  passend: [
    { href: "/service/repowering", titel: "Repowering", text: "Alte Anlagen modernisieren und erweitern." },
    { href: "/einspeisung-gewerbe", titel: "PV-Überschuss verkaufen", text: "Überschuss nach Tarifende verkaufen." },
    { href: "/ratgeber/oemag-marktpreis", titel: "OeMAG-Marktpreis", text: "Berechnung und Historie." },
    { href: "/ratgeber/eigenverbrauch-erhoehen", titel: "Eigenverbrauch erhöhen", text: "Mehr Solarstrom selbst nutzen." },
  ],

  quellen: [
    { titel: "OeMAG – Marktpreise 2026 und Marktpreis-Antrag", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "OeMAG – FAQ (Umstellung vom Tarif auf den Marktpreis)", url: "https://www.oem-ag.at/service/faqs", stand: "09/2026" },
    { titel: "E-Control – Steuern und Abgaben auf Strom (Elektrizitätsabgabe 2026)", url: "https://www.e-control.at/industrie/strom/strompreis/steuern", stand: "09/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.4", url: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+%287%29.pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", stand: "06/2026" },
    { titel: "IEC – IEC TS 62446-3:2017, Outdoor infrared thermography of PV modules and plants", url: "https://webstore.iec.ch/en/publication/28628", stand: "09/2026" },
    { titel: "EUR-Lex – Richtlinie 2012/19/EU über Elektro- und Elektronik-Altgeräte (WEEE)", url: "https://eur-lex.europa.eu/eli/dir/2012/19/oj", stand: "09/2026" },
  ],

  seitenCta: { titel: "Anlage in die Jahre gekommen?", text: "Zustandsprüfung und Repowering-Konzept.", href: "/service/repowering", label: "Repowering anfragen" },
  cta: {
    title: "Alte Anlage, neue Chancen – prüfen, weiterbetreiben oder repowern.",
    text: "Ökovolt bewertet den Zustand Ihrer PV-Anlage mit Messung und Thermografie und plant Weiterbetrieb oder Repowering – für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich.",
    primary: { label: "Repowering anfragen", href: "/service/repowering" },
    secondary: { label: "E-Check anfragen", href: "/service/e-check" },
  },
};

export default artikel;
