// Ratgeber: Photovoltaik-Genehmigung – Baurecht, Denkmalschutz, Abstände, Brandschutz
// Recherchestand 13.09.2026 (MBO, BauGB, EEG § 2, OVG NRW 27.11.2024, Leitfaden Hessen).

const artikel = {
  slug: "photovoltaik-genehmigung",
  title: "Photovoltaik-Genehmigung: Wann Sie einen Antrag brauchen",
  seoTitle: "Photovoltaik Genehmigung 2026: Wann nötig? | Ökovolt",
  kurzTitel: "Photovoltaik-Genehmigung",
  description:
    "Photovoltaik Genehmigung: Dachanlagen sind verfahrensfrei. Wann Denkmalschutz, Bebauungsplan, Brandschutz oder Abstände doch eine Erlaubnis verlangen.",
  excerpt:
    "Für die typische Dachanlage brauchen Sie keinen Bauantrag – regelfrei ist sie trotzdem nicht. Was bei Denkmalschutz, Reihenhaus-Brandwänden, Gartenanlagen und Nachbarn gilt.",
  hauptKeyword: "photovoltaik genehmigung",
  keywords: ["Photovoltaik Genehmigung", "PV-Anlage Baugenehmigung", "Solaranlage genehmigungspflichtig", "Photovoltaik Denkmalschutz", "PV-Anlage Abstand Brandwand", "Solaranlage Abstand Nachbar", "Photovoltaik verfahrensfrei"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Team/download-1.jpg",
  bildAlt: "Fachkräfte mit Schutzhelm prüfen eine Photovoltaikanlage auf einem Flachdach",
  badge: { wert: "Kein Bauantrag", text: "für übliche Dachanlagen auf Wohnhäusern" },

  kurzFazit: [
    "**Photovoltaikanlagen auf oder an Dach und Fassade sind in allen Bundesländern grundsätzlich verfahrensfrei** – ein Bauantrag ist nicht nötig.",
    "Verfahrensfrei heißt nicht regelfrei: **Denkmalschutz, Bebauungsplan, Statik und Brandschutz** gelten weiter und können eine Erlaubnis oder Abweichung erfordern.",
    "Bei Baudenkmälern brauchen Sie eine denkmalrechtliche Erlaubnis. Seit § 2 EEG haben Solaranlagen dabei **regelmäßig Vorrang** – das OVG NRW hat das im November 2024 bestätigt.",
    "Freistehende Anlagen im Garten sind meist bis **3 m Höhe und 9 m Länge** verfahrensfrei; größere Freiflächenanlagen brauchen eine Baugenehmigung und oft einen Bebauungsplan.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Braucht eine PV-Anlage eine Baugenehmigung?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Nein, für eine übliche Photovoltaikanlage auf dem Dach eines Wohnhauses brauchen Sie keine Baugenehmigung.** Die Musterbauordnung (§ 61 MBO) und alle Landesbauordnungen stellen Solaranlagen in, an und auf Dach- und Außenwandflächen verfahrensfrei. Sie müssen also weder einen Bauantrag stellen noch eine Genehmigung abwarten – das gilt für Aufdach- und Indach-Anlagen ebenso wie für Module an der Fassade.",
        },
        {
          typ: "p",
          text: "Verfahrensfrei bedeutet aber nur, dass das Bauamt die Anlage nicht vorab prüft. Alle öffentlich-rechtlichen Vorschriften gelten trotzdem, und für ihre Einhaltung sind Sie als Bauherr verantwortlich. In der Praxis kommt es auf vier Punkte an: **Denkmalschutz, Bebauungsplan oder Gestaltungssatzung, Brandschutz und Statik.** Wer hier etwas übersieht, riskiert im schlimmsten Fall eine Rückbauanordnung.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Genehmigung ist nicht gleich Anmeldung",
          text: "Unabhängig vom Baurecht muss jede netzgekoppelte Anlage beim Netzbetreiber angemeldet und innerhalb eines Monats nach Inbetriebnahme im [Marktstammdatenregister](/wissen/lexikon#marktstammdatenregister) eingetragen werden. Das ist keine Genehmigung, sondern eine Meldepflicht – alle Schritte erklärt der Ratgeber [Photovoltaik anmelden](/ratgeber/photovoltaik-anmelden).",
        },
      ],
    },
    {
      id: "anlagentypen",
      titel: "Genehmigung nach Anlagentyp: die Übersicht",
      tocLabel: "Übersicht Anlagentypen",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Baurechtliche Einordnung von Solaranlagen nach Anlagentyp, Stand September 2026",
          kopf: ["Anlagentyp", "Bauantrag nötig?", "Worauf Sie trotzdem achten müssen"],
          zeilen: [
            ["Aufdach- oder Indach-Anlage auf Wohnhaus", "**nein**, verfahrensfrei", "Denkmalschutz, Gestaltungssatzung, Brandwand-Abstand bei Reihen- und Doppelhäusern, Statik"],
            ["Aufgeständerte Anlage auf Flachdach", "**nein**, verfahrensfrei", "Ballast und Windlast, Abstand zum Dachrand, Gebäudehöhe bei hoher Aufständerung"],
            ["Fassadenanlage", "**nein**, verfahrensfrei", "Brandschutzanforderungen an Außenwände, besonders bei höheren Gebäuden"],
            ["Freistehende Anlage im Garten", "bis 3 m Höhe und 9 m Gesamtlänge **nein**", "Grenzabstände, Bebauungsplan; im Außenbereich meist unzulässig"],
            ["Solarcarport", "**je nach Land und Größe**", "Grenzbebauung, Stellplatzsatzung, Bebauungsplan – Details im [Solarcarport-Ratgeber](/ratgeber/solarcarport)"],
            ["Freiflächenanlage (Solarpark)", "**ja**", "Bebauungsplan nötig; privilegiert nur bis 200 m an Autobahnen und zweigleisigen Schienenwegen"],
            ["Balkonkraftwerk", "**nein**", "Anmeldung im Marktstammdatenregister; Mieter und Wohnungseigentümer brauchen die Zustimmung, haben aber Anspruch darauf"],
            ["Anlage auf Baudenkmal oder im Ensemble", "**denkmalrechtliche Erlaubnis**", "Antrag vor der Montage bei der Unteren Denkmalschutzbehörde"],
          ],
          minBreite: 760,
          fussnote: "Grundlage sind § 61 MBO und die Landesbauordnungen, die im Detail abweichen – etwa bei Gebäudeklassen oder den Maßen freistehender Anlagen. Maßgeblich ist die Bauordnung Ihres Landes.",
        },
        {
          typ: "p",
          text: "Einige Länder schränken die Verfahrensfreiheit an Details ein. Bei großen oder hohen Gebäuden lohnt deshalb ein Blick in die Vorschrift, und beim Maß für freistehende Anlagen nennen einzelne Länder abweichende Längen. Einen interaktiven Schnell-Check nach Anlagentyp finden Sie auf unserer Seite [Baurecht für Photovoltaik](/forderungen/baurecht).",
        },
      ],
    },
    {
      id: "denkmalschutz",
      titel: "Photovoltaik und Denkmalschutz: Erlaubnis ja, Verbot selten",
      tocLabel: "Denkmalschutz",
      bloecke: [
        {
          typ: "p",
          text: "**Auf einem Baudenkmal, in einem geschützten Ensemble und oft auch in der Umgebung eines Denkmals brauchen Sie vor der Montage eine denkmalrechtliche Erlaubnis.** Diese Pflicht gilt unabhängig von der baurechtlichen Verfahrensfreiheit und auch für kleine Anlagen. Zuständig ist die Untere Denkmalschutzbehörde, meist beim Landratsamt oder bei der Stadt. Ob Ihr Haus betroffen ist, zeigt die Denkmalliste oder der Denkmal-Atlas Ihres Landes.",
        },
        {
          typ: "p",
          text: "Die Chancen auf eine Erlaubnis sind in den vergangenen Jahren deutlich gestiegen. Seit dem 1. Januar 2023 bestimmt **§ 2 EEG**, dass die Errichtung und der Betrieb von Anlagen für erneuerbare Energien im überragenden öffentlichen Interesse liegen. In behördlichen Abwägungen – auch im Denkmalrecht der Länder – haben Solaranlagen damit regelmäßig Vorrang; die Behörde muss begründen, warum im Einzelfall der Denkmalschutz ausnahmsweise überwiegt.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "OVG NRW: Solaranlagen auf Denkmälern regelmäßig zu genehmigen",
          text: "Das Oberverwaltungsgericht Nordrhein-Westfalen hat am 27. November 2024 in zwei Grundsatzurteilen (Az. 10 A 2281/23 und 10 A 1477/23) entschieden, dass das öffentliche Interesse am Ausbau erneuerbarer Energien die Belange des Denkmalschutzes bei Solaranlagen in der Regel überwiegt. Geklagt hatten der Eigentümer eines Einfamilienhauses in einer denkmalgeschützten Siedlung in Düsseldorf – mit einer von der Straße aus teilweise sichtbaren Dachfläche – und der Träger einer denkmalgeschützten Schule in Siegen. Nur besondere denkmalfachliche Gründe können eine Anlage verhindern.",
        },
        {
          typ: "p",
          text: "Auch die Länder haben reagiert. Nordrhein-Westfalen berücksichtigt Klimaschutz und erneuerbare Energien seit 2022 ausdrücklich im Denkmalschutzgesetz, Baden-Württemberg hat Leitlinien veröffentlicht, nach denen Photovoltaik auf Kulturdenkmalen in der Regel zu genehmigen ist, wenn sie reversibel und gestalterisch angepasst ausgeführt wird. So verbessern Sie Ihre Chancen:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Dachflächen wählen, die vom öffentlichen Raum wenig einsehbar sind** – etwa die straßenabgewandte Seite.",
            "**Vollschwarze Module** mit schwarzem Rahmen oder rahmenlose Glas-Glas-Module verwenden, die sich ruhig in die Dachfläche einfügen.",
            "**Geschlossene, rechteckige Modulfelder** mit gleichmäßigem Abstand zu First, Traufe und Ortgang planen.",
            "**Reversible Montage** ohne Eingriff in historische Substanz beschreiben; Indach-Lösungen oder Solardachziegel prüfen, wenn die Behörde darauf Wert legt.",
            "**Antrag mit Fotos, Modulbelegungsplan und Datenblatt** einreichen und das Gespräch mit der Behörde vorab suchen.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          text: "Die Erlaubnis muss vor Beginn der Montage vorliegen. Eine ohne Erlaubnis errichtete Anlage auf einem Denkmal kann eine Rückbauanordnung und ein Bußgeld nach sich ziehen – auch wenn sie nachträglich genehmigungsfähig gewesen wäre.",
        },
      ],
    },
    {
      id: "bebauungsplan",
      titel: "Bebauungsplan und Gestaltungssatzung",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Bebauungsplan oder eine örtliche Gestaltungssatzung kann Vorgaben zu Dachform, Farbe oder Aufbauten enthalten, die auch eine verfahrensfreie PV-Anlage einhalten muss.** Das betrifft vor allem historische Ortskerne und Neubaugebiete mit strengen Gestaltungsregeln. Manche neuere Bebauungspläne schreiben Solaranlagen umgekehrt sogar vor.",
        },
        {
          typ: "p",
          text: "Hilfreich ist **§ 248 BauGB**: In Gebieten mit Bebauungsplan sind bei Solaranlagen in, an und auf Dach- und Außenwandflächen geringfügige Abweichungen vom festgesetzten Maß der baulichen Nutzung, der Bauweise und der überbaubaren Grundstücksfläche zulässig, soweit nachbarliche Interessen und baukulturelle Belange nicht entgegenstehen. Eine leicht über die Firsthöhe ragende Aufständerung scheitert daran also nicht automatisch. Weicht die Anlage stärker ab, beantragen Sie beim Bauamt eine Abweichung oder Befreiung.",
        },
        {
          typ: "p",
          text: "Im **Außenbereich** – etwa bei Hofstellen und Aussiedlerhöfen – sind Anlagen auf Dächern und Außenwänden zulässig genutzter Gebäude nach § 35 Abs. 1 Nr. 8 BauGB privilegiert, wenn sie dem Gebäude baulich untergeordnet sind. Für land- und forstwirtschaftliche Betriebe sind zusätzlich besondere Solaranlagen wie Agri-PV bis 25.000 m² Grundfläche je Hofstelle privilegiert (§ 35 Abs. 1 Nr. 9 BauGB).",
        },
      ],
    },
    {
      id: "brandschutz",
      titel: "Brandschutz: Abstand zur Brandwand bei Reihen- und Doppelhäusern",
      tocLabel: "Brandschutz",
      bloecke: [
        {
          typ: "p",
          text: "**Bei Reihen- und Doppelhäusern darf eine PV-Anlage die Brand- oder Gebäudeabschlusswand zum Nachbarhaus nicht überbrücken – je nach Ausführung ist ein Abstand von 0 bis 1,25 m einzuhalten.** Die Bauministerkonferenz hat die Regel in der Musterbauordnung im September 2022 gelockert und dabei nicht mehr zwischen Glas-Glas- und Glas-Folien-Modulen unterschieden.",
        },
        {
          typ: "tabelle",
          caption: "Abstand von Solaranlagen zu Brandwänden nach der geänderten Musterbauordnung",
          kopf: ["Abstand", "Voraussetzung", "Typischer Fall"],
          zeilen: [
            ["**0 m**", "Brandwand ist mindestens 30 cm über die Bedachung geführt und schützt die Anlage vor Brandübertragung", "Mehrfamilienhäuser, Gewerbe mit hochgezogener Brandwand"],
            ["**0,50 m**", "Anlage ist dachintegriert oder höchstens 30 cm über der Dachhaut montiert", "Reihen- und Doppelhäuser der Gebäudeklassen 1 bis 3, Brandwand endet unter der Dachhaut"],
            ["**1,25 m**", "alle übrigen Anlagen, zum Beispiel hoch aufgeständerte Module", "Flachdach mit steiler Aufständerung nahe der Brandwand"],
          ],
          minBreite: 640,
          fussnote: "Die Musterbauordnung ist eine Vorlage; bindend wird die Regel erst mit Übernahme ins Landesrecht. Einige Länder haben abweichende Maße festgelegt oder die Abstände für Gebäude geringer Höhe gestrichen. Maßgeblich ist die Bauordnung Ihres Landes.",
        },
        {
          typ: "p",
          text: "Auf einem Reihenmittelhaus mit 5 bis 6 m Breite kostet ein halber Meter Abstand auf beiden Seiten spürbar Fläche – oft eine Modulspalte je Seite. Bei der Planung sollte der Fachbetrieb deshalb die Landesregel kennen und Modulformat sowie Belegung darauf abstimmen. Zusätzlich gilt: DC-Leitungen dürfen Brandwände nur mit geeigneten Abschottungen durchqueren, und die Feuerwehr sollte über die Anlage informiert werden können – etwa über ein Hinweisschild am Hausanschluss.",
        },
      ],
    },
    {
      id: "abstaende",
      titel: "Abstandsflächen und Nachbarrecht",
      tocLabel: "Abstände & Nachbarn",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Dachanlage löst in der Regel keine eigenen Abstandsflächen aus, weil sie Teil des bestehenden Gebäudes ist.** Anders kann es bei hoch aufgeständerten Anlagen am Rand eines Flachdachs aussehen, wenn sich dadurch die maßgebliche Wandhöhe erhöht – das sollte vorab geklärt werden.",
        },
        {
          typ: "p",
          text: "Freistehende Solaranlagen im Garten dürfen nach dem Muster der Bauordnungen **bis 3 m Höhe und 9 m Länge je Grundstücksgrenze** (insgesamt 18 m auf dem Grundstück) in den Abstandsflächen stehen, also auch nah an der Grenze. Größere Anlagen müssen die regulären Abstandsflächen einhalten und brauchen meist eine Genehmigung.",
        },
        {
          typ: "h3",
          text: "Blendung: Wann Nachbarn sich wehren können",
        },
        {
          typ: "p",
          text: "Moderne Module sind entspiegelt, reflektieren aber je nach Sonnenstand dennoch Licht. Nachbarn müssen unwesentliche Beeinträchtigungen nach § 906 BGB dulden. Als Orientierung für eine erhebliche Blendung ziehen Gerichte häufig die Hinweise der Bund/Länder-Arbeitsgemeinschaft Immissionsschutz (LAI) heran: **mehr als 30 Minuten am Tag oder 30 Stunden im Jahr** an einem schutzwürdigen Raum wie Wohnzimmer oder Terrasse. Kritisch sind vor allem flach geneigte Ost- oder Westdächer gegenüber höher gelegenen Fenstern. Ein Blendgutachten oder eine angepasste Belegung räumt das Problem vor der Montage aus.",
        },
      ],
    },
    {
      id: "sonderfaelle",
      titel: "Weitere Hürden: Statik, Asbest, WEG und Mietrecht",
      tocLabel: "Sonderfälle",
      bloecke: [
        {
          typ: "karten",
          items: [
            { titel: "Statik", text: "Eine Anlage wiegt aufgeständert mit Ballast deutlich mehr als eine Aufdach-Anlage auf dem Steildach. Die Standsicherheit muss auch ohne Bauantrag nachgewiesen sein – bei Flachdächern und älteren Dachstühlen empfiehlt sich ein Statiker. Mehr dazu im Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach)." },
            { titel: "Asbestzementdach", text: "Das Überbauen und Bearbeiten von Asbestzementplatten ist nach Gefahrstoffrecht grundsätzlich verboten. Vor der Montage muss das Dach fachgerecht saniert werden – das gehört in die Kostenplanung." },
            { titel: "Eigentümergemeinschaft", text: "Eine Dachanlage auf einem Mehrfamilienhaus ist eine bauliche Veränderung und braucht einen Beschluss der Eigentümerversammlung. Welche Modelle es für die Stromverteilung gibt, erklärt der Ratgeber [Photovoltaik im Mehrfamilienhaus](/ratgeber/photovoltaik-mehrfamilienhaus)." },
            { titel: "Mieter", text: "Mieter brauchen für Anlagen am Gebäude die Zustimmung des Vermieters. Für Steckersolargeräte besteht seit Oktober 2024 ein Anspruch darauf; Einzelheiten stehen im [Balkonkraftwerk-Ratgeber](/ratgeber/balkonkraftwerk)." },
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Schritt für Schritt zur rechtssicheren Anlage",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Schutzstatus prüfen", "In der Denkmalliste und im Geoportal der Gemeinde nachsehen, ob Denkmal- oder Ensembleschutz, ein Bebauungsplan oder eine Gestaltungssatzung gelten."],
            ["Solarpflicht klären", "Bei Neubau oder Dachsanierung prüfen, ob Ihr Land eine Mindestanlage vorschreibt – Übersicht im Ratgeber [Solarpflicht nach Bundesland](/ratgeber/solarpflicht-bundeslaender)."],
            ["Dach technisch bewerten", "Statik, Dacheindeckung, Brandwand-Abstände und Verschattung vor Ort prüfen lassen und die Modulbelegung darauf abstimmen."],
            ["Erlaubnis beantragen, falls nötig", "Denkmalrechtliche Erlaubnis oder Abweichung vom Bebauungsplan mit Belegungsplan, Fotos und Datenblättern beantragen – und erst nach Bescheid bestellen."],
            ["Montieren und anmelden", "Nach der Montage meldet der Elektrofachbetrieb die Anlage beim Netzbetreiber an; Sie tragen sie im Marktstammdatenregister ein."],
          ],
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Lohnt sich die Anlage auf Ihrem Dach?",
          text: "Wenn die Genehmigungsfrage geklärt ist: Ertrag, Autarkie und Amortisation mit Ihren Werten berechnen.",
          label: "Zum Solarrechner",
        },
      ],
    },
  ],

  faq: [
    { q: "Brauche ich eine Baugenehmigung für eine Photovoltaikanlage auf dem Dach?", a: "In der Regel nein. Solaranlagen in, an und auf Dach- und Außenwandflächen sind nach allen Landesbauordnungen verfahrensfrei. Trotzdem müssen Sie Denkmalschutz, Bebauungsplan, Brandschutz und Statik beachten." },
    { q: "Wie groß darf eine PV-Anlage ohne Genehmigung sein?", a: "Für Dachanlagen gibt es keine Größengrenze, sie sind unabhängig von der Leistung verfahrensfrei. Bei freistehenden Anlagen im Garten gilt meist eine Grenze von 3 m Höhe und 9 m Gesamtlänge; darüber ist in der Regel eine Baugenehmigung nötig." },
    { q: "Darf ich auf einem denkmalgeschützten Haus eine Solaranlage bauen?", a: "Meist ja, aber nur mit denkmalrechtlicher Erlaubnis. Wegen des überragenden öffentlichen Interesses nach § 2 EEG ist sie regelmäßig zu erteilen, wie das OVG NRW 2024 entschieden hat. Unauffällige, schwarze Module auf wenig einsehbaren Dachflächen erhöhen die Chancen." },
    { q: "Welchen Abstand muss eine PV-Anlage zur Brandwand haben?", a: "Nach der Musterbauordnung 0,50 m bei dachintegrierten oder flach montierten Anlagen, 1,25 m bei allen übrigen und keinen Abstand, wenn die Brandwand mindestens 30 cm über das Dach geführt ist. Die Länder haben das teils abweichend übernommen." },
    { q: "Kann der Nachbar gegen meine Solaranlage vorgehen?", a: "Baurechtlich kaum, solange die Anlage verfahrensfrei und vorschriftsgemäß ist. Zivilrechtlich kann er sich bei erheblicher Blendung wehren; als Orientierung gelten mehr als 30 Minuten pro Tag oder 30 Stunden pro Jahr an schutzwürdigen Räumen." },
    { q: "Brauche ich für einen Solarcarport eine Genehmigung?", a: "Das hängt von Land und Größe ab. Kleine Carports sind in vielen Ländern verfahrensfrei, größere oder grenznahe brauchen eine Genehmigung. Die Solarmodule auf dem Dach ändern daran grundsätzlich nichts." },
    { q: "Muss ich die PV-Anlage beim Bauamt anzeigen?", a: "Für verfahrensfreie Dachanlagen nein. Pflicht sind dagegen die Anmeldung beim Netzbetreiber und die Registrierung im Marktstammdatenregister innerhalb eines Monats nach Inbetriebnahme." },
  ],

  passend: [
    { href: "/forderungen/baurecht", titel: "Baurecht für Photovoltaik", text: "Genehmigungs-Check in 30 Sekunden." },
    { href: "/ratgeber/solarpflicht-bundeslaender", titel: "Solarpflicht nach Bundesland", text: "Welche Länder eine Anlage vorschreiben." },
    { href: "/ratgeber/photovoltaik-anmelden", titel: "Photovoltaik anmelden", text: "Netzbetreiber, Marktstammdatenregister, Finanzamt." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Planung inklusive Prüfung von Dach und Vorgaben." },
  ],

  quellen: [
    { titel: "BauGB § 35 – Bauen im Außenbereich (gesetze-im-internet.de)", url: "https://www.gesetze-im-internet.de/bbaug/__35.html", stand: "09/2026" },
    { titel: "BauGB § 248 – Sonderregelung zur sparsamen und effizienten Nutzung von Energie", url: "https://www.gesetze-im-internet.de/bbaug/__248.html", stand: "09/2026" },
    { titel: "EEG § 2 – Besondere Bedeutung der erneuerbaren Energien", url: "https://www.gesetze-im-internet.de/eeg_2014/__2.html", stand: "09/2026" },
    { titel: "Hessisches Wirtschaftsministerium – Leitfaden Solaranlagen: einzuhaltende Abstände auf Dächern", url: "https://wirtschaft.hessen.de/sites/wirtschaft.hessen.de/files/2023-04/leitfaden_solaranlagen_final.pdf", stand: "04/2023" },
    { titel: "Energie-Atlas Bayern – Genehmigungspflicht von Photovoltaikanlagen", url: "https://www.energieatlas.bayern.de/erneuerbare-energien/photovoltaik/themenplattform-planen-genehmigen/genehmigungspflicht", stand: "09/2026" },
    { titel: "Ministerium für Landesentwicklung und Wohnen Baden-Württemberg – PV und Denkmalschutz", url: "https://mlw.baden-wuerttemberg.de/de/denkmalschutz/pv-und-denkmalschutz", stand: "09/2026" },
    { titel: "Legal Tribune Online – OVG NRW, Urteile vom 27.11.2024, 10 A 2281/23 und 10 A 1477/23", url: "https://www.lto.de/recht/nachrichten/n/ovg-nrw-10a228123-10a147723-denkmalschutz-solar-photovoltaik-baurecht", stand: "11/2024" },
    { titel: "Stiftung Umweltenergierecht – Das überragende öffentliche Interesse: § 2 EEG 2023 in der Praxis", url: "https://stiftung-umweltenergierecht.de/blog/das-ueberragende-oeffentliche-interesse-%C2%A7-2-eeg-2023-in-der-praxis/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Genehmigung in 30 Sekunden prüfen", text: "Anlagentyp wählen, drei Fragen beantworten.", href: "/forderungen/baurecht", label: "Zum Genehmigungs-Check" },
  cta: {
    title: "Wir klären Baurecht und Denkmalschutz vor der Bestellung.",
    text: "Vor-Ort-Prüfung von Dach, Brandwand-Abständen und Vorgaben – und Anmeldung beim Netzbetreiber aus einer Hand.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Baurecht im Überblick", href: "/forderungen/baurecht" },
  },
};

export default artikel;
