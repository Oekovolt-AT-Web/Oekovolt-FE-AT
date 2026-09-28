// Ratgeber: PV-Thermografie mit Drohne (Österreich)
// Quellen: IEC TS 62446-3:2017 (Anforderungen an Thermografie von PV-Anlagen), IEA-PVPS Task 13
// „Review on IR and EL Imaging for PV Field Applications“ (Zeitbedarf: ca. 5–10 h für 4 MWp),
// Austro Control / dronespace.at (Registrierung 46,80 € für 3 Jahre, Kompetenznachweis, 120 m, Strafen
// bis 22.000 €), Durchführungsverordnung (EU) 2019/947, ESV 2012 § 10 (thermischer Zustand).
// Die Werte 600 W/m² Mindesteinstrahlung und max. 2/8 Bewölkung entsprechen IEC TS 62446-3.

const artikel = {
  slug: "pv-thermografie-drohne",
  title: "PV-Thermografie mit Drohne: Fehler finden, bevor sie Ertrag kosten",
  seoTitle: "PV-Thermografie mit Drohne in Österreich | Ökovolt",
  kurzTitel: "PV-Thermografie Drohne",
  description:
    "PV-Thermografie mit Drohne: was Wärmebilder finden, Anforderungen nach IEC TS 62446-3, Drohnenrecht in Österreich (Austro Control), Ablauf, Bericht und Nutzen.",
  excerpt:
    "Hotspots, defekte Bypassdioden, ausgefallene Strings: Wie eine Drohnen-Thermografie Fehler auf großen Dach- und Freiflächenanlagen in Stunden statt Tagen findet – und was dabei rechtlich und fachlich zu beachten ist.",
  hauptKeyword: "pv thermografie drohne",
  keywords: [
    "PV Thermografie Drohne",
    "Photovoltaik Wärmebild",
    "Drohneninspektion Photovoltaik Österreich",
    "IEC TS 62446-3",
    "Hotspot Solarmodul",
    "Thermografie Solaranlage Kosten",
    "Drohne Austro Control Photovoltaik",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  bildAlt: "Luftaufnahme eines Gewerbegebiets mit großen Photovoltaikanlagen auf Hallendächern",
  badge: { wert: "600 W/m²", text: "Mindesteinstrahlung für aussagekräftige Wärmebilder (IEC TS 62446-3)" },

  kurzFazit: [
    "**Eine Thermografie macht Temperaturunterschiede auf Modulen sichtbar – und damit Fehler wie Hotspots, defekte Bypassdioden, ausgefallene Strings oder überhitzte Steckverbinder, die im Monitoring oft nur als diffuse Mindererträge auftauchen.**",
    "**Die Drohne ist ab mittleren Dachanlagen die effizienteste Methode:** Laut IEA-PVPS dauert die Infrarot-Befliegung einer 4-MWp-Anlage unter guten Bedingungen etwa 5 bis 10 Stunden – ohne Dachbegehung und ohne Abschaltung.",
    "**Aussagekräftig sind Wärmebilder nur unter Last:** Die IEC TS 62446-3 verlangt unter anderem mindestens 600 W/m² Einstrahlung in Modulebene und stabile, weitgehend wolkenfreie Bedingungen.",
    "**In Österreich gilt das EU-Drohnenrecht:** Betreiber müssen sich bei Austro Control registrieren (46,80 € für drei Jahre), Piloten brauchen einen Kompetenznachweis, eine Haftpflichtversicherung ist Pflicht, Flugbeschränkungsgebiete sind zu beachten.",
  ],

  abschnitte: [
    {
      id: "was-findet",
      titel: "Was findet eine Thermografie auf PV-Anlagen?",
      tocLabel: "Was sie findet",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Thermografie findet alle Fehler, bei denen elektrische Energie in Wärme statt in Strom umgewandelt wird.** Eine verschattete oder beschädigte Zelle arbeitet nicht mehr als Erzeuger, sondern als Verbraucher und erwärmt sich; ein schlechter Kontakt im Stecker erzeugt Übergangswärme. Die Infrarotkamera zeigt diese Stellen als helle Flecken, Streifen oder ganze warme Module.",
        },
        {
          typ: "tabelle",
          caption: "Typische Befunde im Wärmebild und ihre Bedeutung",
          kopf: ["Muster im Wärmebild", "Mögliche Ursache", "Dringlichkeit"],
          zeilen: [
            ["einzelne heiße Zelle (Hotspot)", "Zellbruch, Mikroriss, lokale Verschmutzung, Vogelkot", "je nach Temperaturdifferenz beobachten bis tauschen"],
            ["ein Drittel des Moduls wärmer", "Bypassdiode hat ausgelöst oder ist defekt (kurzgeschlossen)", "mittel – Ertragsverlust, Folgeschäden möglich"],
            ["ganzes Modul wärmer", "Modul offen (nicht angeschlossen), interner Defekt", "mittel bis hoch"],
            ["ganzer String wärmer", "Stringsicherung, Stecker oder Leitung unterbrochen, Wechselrichtereingang aus", "hoch – kompletter Ertragsausfall des Strings"],
            ["Schachbrett- oder Randmuster", "potentialinduzierte Degradation (PID)", "mittel – schleichender Leistungsverlust"],
            ["warmer Steckverbinder / Anschlussdose", "Übergangswiderstand, Mischverbindung, Korrosion", "hoch – Brand- und Lichtbogengefahr"],
          ],
          minBreite: 680,
        },
        {
          typ: "p",
          text: "Besonders wertvoll ist die Thermografie bei [potentialinduzierter Degradation](/wissen/lexikon#pid) und defekten Bypassdioden: Beide verursachen über Jahre Ertragsverluste, ohne dass der Wechselrichter einen Fehler meldet. Zellrisse unterhalb der Hotspot-Schwelle sieht dagegen nur die [Elektrolumineszenz-Prüfung](/wissen/lexikon#el-pruefung) – sie ist das Werkzeug, wenn nach Hagel oder Transportschäden Mikrorisse vermutet werden. Mehr zu Hagelschäden im Ratgeber [Hagel und Photovoltaik](/ratgeber/hagel-photovoltaik).",
        },
      ],
    },
    {
      id: "norm",
      titel: "Welche Anforderungen stellt die IEC TS 62446-3?",
      tocLabel: "IEC TS 62446-3",
      bloecke: [
        {
          typ: "p",
          text: "**Die technische Spezifikation IEC TS 62446-3 regelt die Thermografie von PV-Modulen und -Anlagen im Betrieb: Messtechnik, Umgebungsbedingungen, Vorgehen, Bewertung der Auffälligkeiten, Dokumentation und Qualifikation des Personals.** Sie unterscheidet zwischen einer vereinfachten Inspektion (Übersicht, Fehler erkennen) und einer detaillierten Inspektion (Fehler bewerten und klassifizieren).",
        },
        {
          typ: "tabelle",
          caption: "Wesentliche Bedingungen für eine normgerechte PV-Thermografie",
          kopf: ["Kriterium", "Anforderung / Praxis", "Warum"],
          zeilen: [
            ["Einstrahlung", "mindestens 600 W/m² in Modulebene, stabil", "nur unter Last werden Fehler thermisch sichtbar"],
            ["Bewölkung", "höchstens 2/8, keine schnell ziehenden Wolken", "wechselnde Einstrahlung verfälscht Temperaturen"],
            ["Wind", "gering", "Wind kühlt Module und verwischt Unterschiede"],
            ["Betriebszustand", "Anlage im MPP-Betrieb, keine Abregelung", "abgeregelte Anlagen zeigen Fehler schwächer"],
            ["Auflösung", "je Zelle ausreichend Bildpunkte (Flughöhe und Objektiv danach wählen)", "Hotspots müssen einer Zelle zuordenbar sein"],
            ["Blickwinkel", "möglichst senkrecht, Spiegelungen von Sonne und Himmel vermeiden", "Glas reflektiert Infrarotstrahlung"],
            ["Dokumentation", "Wärmebild + Echtbild, Position, Temperaturdifferenz, Klassifizierung", "Grundlage für Reparatur, Garantie, Versicherung"],
          ],
          minBreite: 680,
          fussnote: "Zusammenfassung wesentlicher Punkte; maßgeblich ist der Normtext. In Österreich eignen sich für Messflüge vor allem klare Tage von April bis September um die Mittagszeit.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Thermischer Zustand ist Teil der Pflichtprüfung",
          text: "§ 10 ESV 2012 nennt für die Prüfung elektrischer Anlagen ausdrücklich die „Erfassung des thermischen Zustands“, wo erforderlich. Die Thermografie ergänzt daher die wiederkehrende Prüfung sinnvoll – Details im Ratgeber [E-Check für PV-Anlagen](/ratgeber/e-check-photovoltaik).",
        },
      ],
    },
    {
      id: "drohne-vs-hand",
      titel: "Drohne oder Handkamera – was ist besser?",
      tocLabel: "Drohne vs. Handkamera",
      bloecke: [
        {
          typ: "p",
          text: "**Für große Dachflächen, Freiflächenanlagen und schwer zugängliche Dächer ist die Drohne überlegen; für Verteiler, Wechselrichter und kleine Anlagen reicht die Handkamera.** In der Praxis werden beide kombiniert: Die Drohne liefert die Übersicht über das Modulfeld, die Handkamera die Detailaufnahme von auffälligen Modulen und Anschlüssen.",
        },
        {
          typ: "tabelle",
          caption: "Drohnen- und Handthermografie im Vergleich",
          kopf: ["Kriterium", "Drohne", "Handkamera"],
          zeilen: [
            ["Flächenleistung", "sehr hoch – ganze Hallendächer in einem Flug", "gering, Modul für Modul"],
            ["Dachbegehung", "nicht nötig", "nötig (Absturzsicherung)"],
            ["Blickwinkel auf Module", "senkrecht von oben, gleichmäßig", "schräg, Spiegelungen schwerer vermeidbar"],
            ["Detailtiefe", "gut, abhängig von Flughöhe und Kamera", "sehr gut aus kurzer Distanz"],
            ["Verteiler, Wechselrichter, Stecker", "nicht geeignet", "Standardmethode"],
            ["Rechtliches", "Drohnenrecht, Registrierung, Versicherung", "keine Zusatzauflagen"],
          ],
          hervorheben: 1,
          minBreite: 600,
        },
        {
          typ: "p",
          text: "Moderne Drohnen mit radiometrischer Wärmebildkamera speichern Temperaturwerte je Bildpunkt und GPS-Position. Daraus entsteht eine georeferenzierte Karte, in der jeder Befund einem Modul im Belegungsplan zugeordnet wird. Das spart beim Tausch vor Ort viel Zeit – gerade auf Hallendächern mit mehreren tausend Modulen.",
        },
      ],
    },
    {
      id: "recht",
      titel: "Welche Drohnenregeln gelten in Österreich?",
      tocLabel: "Drohnenrecht",
      bloecke: [
        {
          typ: "p",
          text: "**In Österreich gilt seit 31. Dezember 2020 das EU-Drohnenrecht (Durchführungsverordnung (EU) 2019/947); zuständig ist Austro Control mit der Plattform dronespace.at.** Für PV-Inspektionen im gewerblichen Einsatz sind vor allem Registrierung, Kompetenznachweis, Versicherung und Flugbeschränkungsgebiete relevant.",
        },
        {
          typ: "tabelle",
          caption: "Drohnenregeln in Österreich im Überblick, Stand September 2026",
          kopf: ["Thema", "Regel", "Bedeutung für PV-Inspektionen"],
          zeilen: [
            ["Registrierung", "Betreiber von Drohnen ab 250 g oder mit Kamera; 46,80 € für 3 Jahre, Registrierungsnummer an der Drohne", "jede Inspektionsdrohne ist registrierungspflichtig"],
            ["Kompetenznachweis", "Online-Kurs und Test für Drohnen ab 250 g; A2-Zertifikat mit Präsenzprüfung für Flüge näher an Personen", "Pilot muss Nachweis mitführen"],
            ["Kategorien", "„Open“ (A1–A3) ohne Bewilligung; „Specific“ mit Betriebsgenehmigung bei höherem Risiko", "Einsätze über Betriebsgelände meist Open A2/A3, sonst Specific"],
            ["Flughöhe / Sicht", "max. 120 m, Sichtflug", "für PV-Thermografie ausreichend (typisch deutlich niedriger)"],
            ["Versicherung", "Haftpflichtversicherung verpflichtend", "Nachweis vom Dienstleister verlangen"],
            ["Flugbeschränkungen", "Flughäfen, militärische Einrichtungen, weitere Geozonen (Karte in der Dronespace-App)", "Nähe Flughafen Salzburg, Linz, Wien, Graz, Klagenfurt, Innsbruck prüfen"],
            ["Sanktionen", "Verwaltungsübertretung nach § 169 Luftfahrtgesetz, bis 22.000 €", "Verantwortung liegt beim Drohnenbetreiber"],
          ],
          minBreite: 720,
          fussnote: "Quelle: Austro Control / dronespace.at. Zusätzlich sind Datenschutz (Aufnahmen von Nachbargrundstücken und Personen) und Hausrecht zu beachten. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Datenschutz und Werksgelände",
          text: "Wärmebild- und Echtbildaufnahmen können Personen, Kennzeichen oder Betriebsgeheimnisse zeigen. Klären Sie vorab, welche Bereiche aufgenommen werden, wer die Daten speichert und wann sie gelöscht werden. Bei sicherheitsrelevanten Standorten – Kraftwerke, Umspannwerke, Chemie – sind interne Genehmigungen und Abstimmungen mit dem Werkschutz üblich.",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Ablauf einer Drohnen-Thermografie",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Vorbereitung", "Belegungsplan, Stringplan und Monitoring-Daten übermitteln, Flugzone prüfen, Termin an einem klaren Tag mit hoher Einstrahlung planen."],
            ["Vor-Ort-Check", "Einstrahlung und Wetter messen, Anlage im Normalbetrieb bestätigen (keine Abregelung), Sicherheitsbereich festlegen."],
            ["Befliegung", "Automatisierte Flugbahn in konstanter Höhe mit senkrechtem Blickwinkel, radiometrische Wärmebilder plus Echtbilder."],
            ["Detailprüfung", "Auffällige Module, Stecker und Verteiler mit Handkamera nachmessen, bei Bedarf Kennlinienmessung."],
            ["Auswertung", "Befunde georeferenzieren, klassifizieren (Temperaturdifferenz, Muster, Ursache) und dem Modul im Plan zuordnen."],
            ["Bericht", "Übersichtskarte, Befundliste nach Dringlichkeit, Handlungsempfehlungen, Rohdaten für Garantie und Versicherung."],
          ],
        },
        {
          typ: "p",
          text: "Ökovolt führt [Drohneninspektionen mit Thermografie](/service/drohneninspektion) an PV-Anlagen in ganz Österreich durch und verknüpft die Befunde mit den Daten aus dem [Monitoring und der Fernwartung](/technik/fernwartung). So lässt sich prüfen, ob ein Wärmebild-Befund tatsächlich Ertrag kostet.",
        },
      ],
    },
    {
      id: "bericht",
      titel: "Was ein guter Thermografiebericht enthält",
      tocLabel: "Der Bericht",
      bloecke: [
        {
          typ: "p",
          text: "**Ein guter Thermografiebericht ist so aufgebaut, dass ein Techniker ohne Rückfrage das richtige Modul findet und ein Versicherer oder Hersteller den Befund nachvollziehen kann.** Hübsche Übersichtsbilder allein genügen dafür nicht. Achten Sie bei Angeboten darauf, dass die folgenden Inhalte zugesagt werden:",
        },
        {
          typ: "checkliste",
          punkte: [
            "Messbedingungen: Datum, Uhrzeit, Einstrahlung in Modulebene, Umgebungs- und Modultemperatur, Wind, Bewölkung, Betriebszustand der Anlage.",
            "Kameradaten: Modell, Auflösung, Objektiv, Kalibrierung, Emissionsgrad, Flughöhe bzw. Abstand.",
            "Übersichtskarte (Orthofoto) mit allen Befunden, verknüpft mit Belegungs- und Stringplan.",
            "Befundliste je Modul: Position, Wärmebild und Echtbild, Temperaturdifferenz, Fehlerbild, vermutete Ursache, Klassifizierung und Dringlichkeit.",
            "Handlungsempfehlung: sofort beheben, beobachten, bei nächster Wartung, Garantiefall prüfen.",
            "Rohdaten (radiometrische Bilder) zur späteren Nachbewertung und für Vergleiche mit Folgemessungen.",
          ],
        },
        {
          typ: "p",
          text: "Wiederholte Befliegungen mit gleicher Methode zeigen die Entwicklung: Ein Hotspot, der von Jahr zu Jahr wärmer wird, ist ein Kandidat für den Tausch; ein stabiler Befund kann beobachtet werden. Bei Freiflächen- und [Agri-PV-Anlagen](/agri-pv) kommen Vegetation, Zaun und Wegeführung hinzu – hier lohnt es sich, Thermografie und Sichtkontrolle der Unterkonstruktion in einem Termin zu kombinieren.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Beispiel: Was ein unentdeckter String kostet",
          text: "Angenommen, auf einer 300-kWp-Hallendachanlage mit Strings zu je rund 10 kWp ist ein String durch einen defekten Stecker unterbrochen. Bei rund 1.000 kWh/kWp gehen etwa 10.000 kWh im Jahr verloren – bewertet mit dem OeMAG-Sommermarktpreis 2026 von rund 6,8 ct/kWh knapp 700 €, bei Eigenverbrauch mit 20 ct/kWh rund 2.000 €. Wenn der Wechselrichter den Ausfall nicht meldet, bleibt er ohne Thermografie oft über Jahre unbemerkt. (Beispielrechnung mit Annahmen.)",
        },
      ],
    },
    {
      id: "wann",
      titel: "Wann lohnt sich eine Thermografie?",
      tocLabel: "Wann sinnvoll?",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Thermografie lohnt sich zu fünf Anlässen: bei der Abnahme, vor Ablauf der Gewährleistung, nach Unwettern, bei unerklärlichen Mindererträgen und regelmäßig im Rahmen der Wartung.** Bei großen Anlagen ist sie auch vor einem Eigentümerwechsel oder einer Refinanzierung Standard.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Abnahme:** Transport- und Montageschäden dokumentieren, solange der Errichter in der Pflicht ist.",
            "**Vor Ablauf der Gewährleistung:** Mängel melden, bevor Fristen verstreichen – oft zwei Jahre nach Übergabe, Modul- und Leistungsgarantien laufen länger.",
            "**Nach Hagel, Sturm oder Blitzschlag:** Schäden für die Versicherung belegen – siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
            "**Bei Mindererträgen:** Wenn die Performance Ratio sinkt oder ein Wechselrichter weniger liefert als die anderen.",
            "**Regelmäßig:** alle zwei bis vier Jahre im [Wartungsvertrag](/ratgeber/photovoltaik-wartungsvertrag), bei Ammoniak- oder Salzbelastung öfter.",
            "**Vor Kauf, Verkauf oder Weiterbetrieb nach 20 Jahren:** Zustand objektiv bewerten – siehe [Photovoltaik nach 20 Jahren](/ratgeber/photovoltaik-nach-20-jahren).",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Befunde richtig nutzen",
          text: "Ein Wärmebild allein begründet noch keinen Garantieanspruch. Hersteller verlangen meist Seriennummer, Messwerte (z. B. Kennlinie) und Fotos. Lassen Sie auffällige Module deshalb gezielt nachmessen und dokumentieren – und bewahren Sie die radiometrischen Rohdaten auf.",
        },
      ],
    },
    {
      id: "grenzen",
      titel: "Grenzen der Thermografie",
      tocLabel: "Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Die Thermografie zeigt Symptome, nicht immer die Ursache – und sie sieht nur, was unter Last warm wird.** Ein Wärmebild bei 400 W/m² unterschätzt Fehler, ein Bild mit Sonnenspiegelung zeigt Scheinbefunde. Deshalb gehören Bedingungen, Kameradaten und Auswertungsmethode in jeden Bericht.",
        },
        {
          typ: "liste",
          punkte: [
            "Mikrorisse ohne Stromfluss-Behinderung sind thermisch unsichtbar – hier hilft nur die EL-Prüfung.",
            "Degradation, die alle Module gleichmäßig betrifft, erzeugt keine Temperaturunterschiede; sie zeigt sich im Monitoring und in der Kennlinie.",
            "Isolationsfehler auf der DC-Seite erkennt die Isolationsmessung, nicht die Kamera.",
            "Bei Glas-Glas-Modulen und bifazialen Modulen ist die Bewertung anspruchsvoller (Rückseite, Reflexion).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was kostet eine Drohnen-Thermografie einer PV-Anlage?",
      a: "Die Kosten hängen von Anlagengröße, Anfahrt, Flugzone, gewünschter Detailtiefe und Berichtsumfang ab. Große Anlagen sind je kWp deutlich günstiger zu befliegen als kleine. Lassen Sie sich Befliegung, Auswertung und Nachmessungen getrennt ausweisen.",
    },
    {
      q: "Bei welchem Wetter kann man PV-Anlagen thermografieren?",
      a: "An klaren, windarmen Tagen mit mindestens 600 W/m² Einstrahlung in Modulebene und höchstens 2/8 Bewölkung, wie es die IEC TS 62446-3 vorsieht. In Österreich sind das vor allem die Mittagsstunden von April bis September.",
    },
    {
      q: "Braucht der Drohnenpilot eine Genehmigung?",
      a: "Der Betreiber muss bei Austro Control registriert sein, der Pilot einen Kompetenznachweis haben und eine Haftpflichtversicherung ist Pflicht. Je nach Einsatzort und Risiko genügt die Kategorie „Open“ oder es braucht eine Betriebsgenehmigung in der Kategorie „Specific“. Flugbeschränkungsgebiete sind zu beachten.",
    },
    {
      q: "Muss die PV-Anlage für die Thermografie abgeschaltet werden?",
      a: "Nein, im Gegenteil: Die Anlage muss unter Last im normalen Betrieb laufen, sonst werden Fehler nicht sichtbar. Eine Abregelung durch den Netzbetreiber oder ein volles Speichersystem mit Nulleinspeisung sollte während der Messung vermieden werden.",
    },
    {
      q: "Wie oft sollte eine PV-Anlage thermografiert werden?",
      a: "Bei Gewerbeanlagen alle zwei bis vier Jahre sowie nach Unwettern und bei Mindererträgen. Sinnvoll ist außerdem eine Aufnahme zur Abnahme und vor Ablauf der Gewährleistung.",
    },
    {
      q: "Was ist der Unterschied zwischen Thermografie und EL-Prüfung?",
      a: "Die Thermografie misst Wärme im laufenden Betrieb und findet Fehler, die Energie in Wärme umwandeln – etwa Hotspots, Diodenfehler oder heiße Stecker. Die Elektrolumineszenz-Prüfung bestromt die Module, meist nachts, und macht Zellrisse und inaktive Zellbereiche sichtbar, auch wenn sie noch nicht warm werden. Beide Verfahren ergänzen sich.",
    },
    {
      q: "Erkennt die Thermografie auch Hagelschäden?",
      a: "Teilweise: Gebrochene Zellen, die heiß werden, und zerstörte Module sind sichtbar. Feine Mikrorisse ohne Temperaturunterschied erkennt dagegen nur die Elektrolumineszenz-Prüfung. Nach größeren Hagelereignissen ist die Kombination beider Verfahren sinnvoll.",
    },
  ],

  howTo: {
    name: "Drohnen-Thermografie einer PV-Anlage durchführen lassen",
    schritte: [
      { name: "Unterlagen übermitteln", text: "Belegungs- und Stringplan sowie Monitoring-Daten an den Dienstleister geben und Flugzone prüfen lassen." },
      { name: "Termin bei hoher Einstrahlung planen", text: "Einen klaren, windarmen Tag mit mindestens 600 W/m² Einstrahlung wählen und die Anlage im Normalbetrieb lassen." },
      { name: "Befliegung", text: "Automatisierte Flugbahn mit senkrechtem Blickwinkel, radiometrische Wärmebilder und Echtbilder aufnehmen." },
      { name: "Nachmessen", text: "Auffällige Module und Anschlüsse mit Handkamera und Kennlinienmessung verifizieren." },
      { name: "Bericht auswerten", text: "Befunde nach Dringlichkeit abarbeiten, Garantie- und Versicherungsfälle mit Rohdaten dokumentieren." },
    ],
  },

  passend: [
    { href: "/service/drohneninspektion", titel: "Drohneninspektion", text: "Thermografie für Dach- und Freiflächenanlagen." },
    { href: "/ratgeber/e-check-photovoltaik", titel: "E-Check für PV-Anlagen", text: "Prüfpflichten und Prüfbefund." },
    { href: "/ratgeber/photovoltaik-wartungsvertrag", titel: "Wartungsvertrag", text: "Thermografie als Vertragsbaustein." },
  ],

  quellen: [
    { titel: "IEC – IEC TS 62446-3:2017, Outdoor infrared thermography of PV modules and plants", url: "https://webstore.iec.ch/en/publication/28628", stand: "09/2026" },
    { titel: "IEA-PVPS Task 13 – Review on IR and EL Imaging for PV Field Applications", url: "https://iea-pvps.org/key-topics/review-on-ir-and-el-imaging-for-pv-field-applications/", stand: "09/2026" },
    { titel: "Austro Control / dronespace.at – Drohnenregeln in Österreich", url: "https://www.dronespace.at/drohnenregeln/", stand: "09/2026" },
    { titel: "Austro Control – Drohnen", url: "https://www.austrocontrol.at/drohnen", stand: "09/2026" },
    { titel: "EUR-Lex – Durchführungsverordnung (EU) 2019/947 über Vorschriften und Verfahren für den Betrieb unbemannter Luftfahrzeuge", url: "https://eur-lex.europa.eu/eli/reg_impl/2019/947/oj", stand: "09/2026" },
    { titel: "JUSLINE – § 10 ESV 2012, Mindestinhalt der Prüfungen", url: "https://www.jusline.at/gesetz/esv_2012/paragraf/10", stand: "09/2026" },
  ],

  seitenCta: { titel: "Hotspots finden?", text: "Drohnen-Thermografie für Ihre Anlage.", href: "/service/drohneninspektion", label: "Inspektion anfragen" },
  cta: {
    title: "Wärmebilder, die Fehler zeigen – bevor sie Ertrag kosten.",
    text: "Drohnen-Thermografie mit georeferenziertem Bericht für Gewerbe-, Landwirtschafts- und Freiflächenanlagen in ganz Österreich.",
    primary: { label: "Inspektion anfragen", href: "/service/drohneninspektion" },
    secondary: { label: "Wartung & Service", href: "/service/wartung" },
  },
};

export default artikel;
