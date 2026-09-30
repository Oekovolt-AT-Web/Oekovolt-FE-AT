// src/lib/flaeche/laender.js
//
// Rechtslage für Freiflächen-Photovoltaik je Bundesland – Grundlage für den
// Flächen-Check (/flaechen-check) und die Landesseiten
// /freiflaechen-photovoltaik/widmung/<bundesland>.
//
// Recherche: konsolidiertes Landesrecht im RIS (Open Government Data,
// ogd.ris.bka.gv.at bzw. data.bka.gv.at/ris/api, Lizenz CC BY 4.0), Fassung
// vom 30.09.2026, ergänzt um Landesquellen (Landesregierung, Energieagentur).
// Was sich nicht an einer Primärquelle belegen ließ, steht unter `offen`
// und wird auf den Seiten ausdrücklich als „noch offen“ markiert.
//
// Reine Daten ohne React/Pfad-Aliase – per Node testbar (scripts/flaeche.test.mjs).
// PFLEGE: Raumordnungsrecht ändert sich laufend (EABG-Umsetzung 2026/27).
// Mindestens vierteljährlich prüfen und STAND anpassen.

export const STAND = { iso: "2026-09-30", label: "30.09.2026", monat: "September 2026" };

const RIS = (id) => `https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/${id}/${id}.html`;

/** Bundesweite Quellen, die auf allen Landesseiten gelten. */
export const BUND_QUELLEN = [
  { label: "RIS – Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG), BGBl. I Nr. 47/2026", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40278868/NOR40278868.html" },
];

/**
 * check.art steuert die Ampel im Flächen-Check:
 *  - "widmung":  Widmung/Sonderausweisung der Gemeinde nötig (Normalfall)
 *  - "zonen":    nur in Zonen/Eignungszonen des Landes
 *  - "staffel":  Größenstaffel (grossHa: darüber nur in Zonen; vorbelastetHa: Sonderregel)
 *  - "deckel":   Obergrenze je Widmungsfläche (maxHa, maxHaVorbelastet)
 *  - "keine":    keine eigene PV-Widmung im Grünland vorgesehen
 */
export const LAENDER = [
  {
    slug: "burgenland",
    name: "Burgenland",
    im: "im Burgenland",
    gesetz: "Burgenländisches Raumplanungsgesetz 2019 (Bgld. RPG 2019)",
    kurz: "Freiflächen-PV über 35 m² Modulfläche ist nur in Eignungszonen zulässig, die die Landesregierung per Verordnung festlegt.",
    schwelle: "über 35 m² Modulfläche (auf Betriebs- und Industriegebietsflächen über 200 m²)",
    instrument: "Eignungszonen per Landesverordnung",
    regeln: [
      {
        titel: "Bagatellgrenze",
        norm: "§ 22d Abs. 2 Z 3 Bgld. RPG 2019",
        text: "Ohne Eignungszone ist nur eine kleine Anlage beim Gebäude zulässig: höchstens 35 m² Modulfläche, auf Betriebs- und Industriegebietsflächen höchstens 200 m².",
      },
      {
        titel: "Eignungszonen des Landes",
        norm: "§ 22d Abs. 3 Bgld. RPG 2019",
        text: "Größere Photovoltaik- und Solaranlagen sind nur in Eignungszonen zulässig, die die Landesregierung durch Verordnung festlegt. Maßgeblich sind raumplanerische Ausschluss- und Konfliktkriterien, die meteorologischen Gegebenheiten und die Möglichkeiten der Netzeinspeisung.",
      },
      {
        titel: "Photovoltaikabgabe",
        norm: "§ 22e Bgld. RPG 2019; Bemessungsgrundlagen-Verordnung § 2",
        text: "Für Anlagen in Eignungszonen erhebt das Land eine jährliche Abgabe von 1.400 € je Megawatt (Grundbetrag, jährlich angepasst); 700 € je MW fließen der Standortgemeinde zu. Schuldner ist der Inhaber der Genehmigung – also meist der Betreiber, nicht der Verpächter.",
      },
    ],
    zonen: "Eignungszonen per Verordnung der Landesregierung",
    beschleunigung: "Ob und wo das Burgenland Beschleunigungsgebiete nach dem EABG ausweist, war zum Prüfdatum nicht veröffentlicht.",
    offen: [
      "Lage der einzelnen Eignungszonen – bitte in der aktuellen Eignungszonenverordnung bzw. beim Land prüfen.",
      "Beschleunigungsgebiete nach dem EABG: noch offen.",
    ],
    quellen: [
      { label: "RIS – Bgld. Raumplanungsgesetz 2019, § 22d Photovoltaikanlagen", url: RIS("LBG40027528") },
      { label: "RIS – Bgld. Raumplanungsgesetz 2019, § 22e Windkraft- und Photovoltaikabgabe", url: RIS("LBG40027529") },
      { label: "RIS – Bemessungsgrundlage Windkraft- und Photovoltaikabgabe, § 2", url: RIS("LBG40029567") },
    ],
    check: { art: "zonen", text: "Über 35 m² Modulfläche nur in einer Eignungszone des Landes – liegt Ihre Fläche nicht in einer Zone, ist ein Solarpark derzeit nicht genehmigungsfähig." },
  },
  {
    slug: "kaernten",
    name: "Kärnten",
    im: "in Kärnten",
    gesetz: "Kärntner Photovoltaikanlagen-Verordnung 2024 (K-PhV 2024) zum K-ROG 2021",
    kurz: "Freiflächen-PV braucht die Widmung „Grünland – Photovoltaikanlage“; eine zusammenhängende Widmungsfläche darf grundsätzlich höchstens 4 ha groß sein.",
    schwelle: "jede Freiflächenanlage (eigene PV-Widmung)",
    instrument: "Widmung „Grünland – Photovoltaikanlage“ bzw. „Grünland – Agri-Photovoltaikanlage“",
    regeln: [
      {
        titel: "Eigene Widmungskategorie",
        norm: "§ 5 Abs. 1 K-PhV 2024",
        text: "Photovoltaikanlagen dürfen nur auf Grundflächen errichtet werden, die als „Grünland – Photovoltaikanlage“ gewidmet sind; Agri-PV-Anlagen brauchen die Widmung „Grünland – Agri-Photovoltaikanlage“.",
      },
      {
        titel: "Höchstens 4 ha je Widmungsfläche",
        norm: "§ 5 Abs. 2 K-PhV 2024",
        text: "Die zusammenhängende Widmungsfläche darf 4 ha nicht überschreiten. Pilot- und Forschungsanlagen sowie Anlagen auf bereits vorbelasteten oder versiegelten Flächen dürfen bis 10 ha groß sein, in besonders begründeten Einzelfällen auch darüber.",
      },
      {
        titel: "1.000 m Abstand",
        norm: "§ 5 K-PhV 2024",
        text: "Zwischen zwei Widmungsflächen ist ein Mindestabstand von 1.000 m einzuhalten; nur in besonders begründeten Einzelfällen darf er unterschritten werden.",
      },
    ],
    zonen: "keine landesweiten PV-Zonen; Größen- und Abstandsregeln der K-PhV 2024",
    beschleunigung: "Beschleunigungsgebiete nach dem EABG: zum Prüfdatum keine Veröffentlichung gefunden.",
    offen: [
      "Was als „vorbelastet“ gilt, entscheidet sich im Widmungsverfahren – bitte früh mit Gemeinde und Land klären.",
      "Beschleunigungsgebiete nach dem EABG: noch offen.",
    ],
    quellen: [
      { label: "RIS – Kärntner Photovoltaikanlagen-Verordnung 2024, § 5", url: RIS("LKT40019770") },
    ],
    check: { art: "deckel", maxHa: 4, maxHaVorbelastet: 10, text: "Widmung „Grünland – Photovoltaikanlage“ nötig; je Widmungsfläche höchstens 4 ha." },
  },
  {
    slug: "niederoesterreich",
    name: "Niederösterreich",
    im: "in Niederösterreich",
    gesetz: "NÖ Raumordnungsgesetz 2014 (NÖ ROG 2014) und Sektorales Raumordnungsprogramm über Photovoltaikanlagen im Grünland",
    kurz: "Ab 50 kW Engpassleistung braucht es die Widmung „Grünland – Photovoltaikanlagen“; über 2 ha ist sie nur in den Zonen des Landes zulässig.",
    schwelle: "über 50 kW Engpassleistung",
    instrument: "Widmung „Grünland – Photovoltaikanlagen“; Zonen des Sektoralen Raumordnungsprogramms",
    regeln: [
      {
        titel: "Widmung ab 50 kW",
        norm: "§ 20 Abs. 2 Z 21 NÖ ROG 2014",
        text: "Flächen für Photovoltaikanlagen (ausgenommen auf Bauwerken) mit mehr als 50 kW Engpassleistung brauchen die Widmung „Grünland – Photovoltaikanlagen“. Anlagen in räumlichem Zusammenhang werden zusammengerechnet.",
      },
      {
        titel: "Über 2 ha nur in Zonen",
        norm: "§ 20 Abs. 3c NÖ ROG 2014",
        text: "Mehr als 2 ha Widmungsfläche sind nur in Zonen zulässig, die das Land in einem überörtlichen Raumordnungsprogramm festlegt. Flächen mit weniger als 200 m Abstand werden zusammengerechnet (§ 20 Abs. 3d).",
      },
      {
        titel: "Ausnahme Eigenversorgung von Betrieben",
        norm: "§ 20 Abs. 3e NÖ ROG 2014",
        text: "Außerhalb der Zonen sind größere Widmungen nahe einem Betriebsstandort möglich, wenn Dächer und Parkplätze überwiegend für PV genutzt werden und die Anlage höchstens den Jahresverbrauch des Betriebs deckt.",
      },
    ],
    zonen: "116 Zonen im Sektoralen Raumordnungsprogramm über Photovoltaikanlagen im Grünland",
    beschleunigung: "Beschleunigungsgebiete nach dem EABG: zum Prüfdatum keine Veröffentlichung gefunden.",
    offen: [
      "Die Zahl von 116 Zonen stammt aus Landes- und Branchenunterlagen (FAQ Land NÖ, PV Austria); Änderungen des Programms bitte vor Projektstart prüfen.",
    ],
    quellen: [
      { label: "RIS – NÖ Raumordnungsgesetz 2014, § 20 (Grünland-Photovoltaikanlagen)", url: RIS("LNO40086867") },
      { label: "Land NÖ – FAQ Photovoltaik Raumordnung (05/2025)", url: "https://www.raumordnung-noe.at/fileadmin/root_raumordnung/land/ueberoertliche_raumordnung/FAQs_Photovoltaik_20250523.pdf" },
      { label: "eNu – Freiflächen-Photovoltaik-Anlagen in Niederösterreich", url: "https://www.energie-noe.at/freiflaechen-pv-anlagen" },
      { label: "PV Austria – Schwerer Stand für große PV-Anlagen (19.05.2026)", url: "https://pvaustria.at/schwerer-stand-fuer-grosse-pv-anlagen/" },
    ],
    check: { art: "staffel", grossHa: 2, text: "Widmung „Grünland – Photovoltaikanlagen“ ab 50 kW; über 2 ha nur in einer Landeszone." },
  },
  {
    slug: "oberoesterreich",
    name: "Oberösterreich",
    im: "in Oberösterreich",
    gesetz: "Oö. Raumordnungsgesetz 1994 (Oö. ROG 1994), Fassung LGBl. Nr. 62/2026",
    kurz: "Jede frei stehende PV-Anlage im Grünland über 50 m² Modulfläche braucht eine Sonderausweisung im Flächenwidmungsplan der Gemeinde.",
    schwelle: "über 50 m² Modulfläche",
    instrument: "Sonderausweisung für Photovoltaikanlagen im Flächenwidmungsplan",
    regeln: [
      {
        titel: "Sonderausweisung ab 50 m²",
        norm: "§ 30a Oö. ROG 1994",
        text: "Frei stehende Photovoltaikanlagen dürfen im Grünland nur errichtet werden, wenn eine Sonderausweisung im Flächenwidmungsplan dies zulässt. Ausgenommen sind frei stehende Anlagen mit höchstens 50 m² Modulfläche.",
      },
      {
        titel: "Kriterienkatalog des Landes",
        norm: "Land Oberösterreich, Kriterienkatalog PV-Freiflächen",
        text: "Für die Beurteilung im Widmungsverfahren hat das Land einen Kriterienkatalog für PV-Freiflächenanlagen veröffentlicht. Die Gemeinde entscheidet, die Landesregierung genehmigt die Planänderung aufsichtsbehördlich.",
      },
    ],
    zonen: "keine landesweit verordneten PV-Zonen; Beurteilung im Widmungsverfahren der Gemeinde",
    beschleunigung: "Ausschluss- und Beschleunigungsgebiete nach dem EABG waren zum Prüfdatum in Ausarbeitung – noch offen.",
    offen: [
      "Inhalt und Zeitplan der oberösterreichischen Beschleunigungsgebiete: noch offen.",
    ],
    quellen: [
      { label: "RIS – Oö. Raumordnungsgesetz 1994, § 30a Sonderausweisung für PV- und Windkraftanlagen", url: RIS("LOO40027118") },
      { label: "Land Oberösterreich – Kriterienkatalog PV-Freiflächen", url: "https://www.land-oberoesterreich.gv.at/259165.htm" },
    ],
    check: { art: "widmung", text: "Sonderausweisung im Flächenwidmungsplan nötig (über 50 m² Modulfläche)." },
  },
  {
    slug: "salzburg",
    name: "Salzburg",
    titelName: "Land Salzburg", // Abgrenzung zur Stadt Salzburg im Seitentitel (SEO-Plan M26)
    im: "im Land Salzburg",
    gesetz: "Salzburger Raumordnungsgesetz 2009 (ROG 2009) und Photovoltaik-Kennzeichnungsverordnung (LGBl. Nr. 73/2023)",
    kurz: "Frei stehende Solaranlagen über 200 m² Kollektorfläche sind im Grünland nur mit einer Kennzeichnung im Flächenwidmungsplan zulässig – vergeben nach einem Punkteschema.",
    schwelle: "über 200 m² Kollektorfläche",
    instrument: "Kennzeichnung nach § 39b ROG 2009, Punkteschema der Kennzeichnungsverordnung",
    regeln: [
      {
        titel: "Kennzeichnung ab 200 m²",
        norm: "§ 36 Abs. 7 ROG 2009",
        text: "Frei stehende Solaranlagen mit mehr als 200 m² Kollektorfläche sind im Grünland nur zulässig, wenn für den Standort eine Kennzeichnung nach § 39b vorliegt. Anlagen in räumlichem Naheverhältnis werden zusammengerechnet.",
      },
      {
        titel: "Punkte für Lage, Art und Flächeneffizienz",
        norm: "§§ 2 und 3 Photovoltaik-Kennzeichnungsverordnung",
        text: "Lagepunkte gibt es für Standorte im Übergangsbereich zu bestimmten Gebieten (§ 2), Konfigurationspunkte u. a. für Agri-PV (Modulunterkante mindestens 80 cm, mindestens 75 % landwirtschaftliche Nutzung), innovative Agri-PV und hohe Flächeneffizienz (§ 3). Die nötige Punktzahl hängt von der Bodenqualität ab.",
      },
    ],
    zonen: "keine landesweiten Zonen; Kennzeichnung je Standort nach Punkteschema",
    beschleunigung: "Salzburg bereitet Beschleunigungsgebiete entlang der Autobahnen A1 und A10 vor (laut Medienberichten 2026) – Verordnung zum Prüfdatum noch offen.",
    offen: [
      "Beschleunigungsgebiete entlang A1/A10: Stand der Verordnung noch offen.",
    ],
    quellen: [
      { label: "RIS – Salzburger Raumordnungsgesetz 2009, § 36", url: RIS("LSB40029635") },
      { label: "RIS – Salzburger Raumordnungsgesetz 2009, § 39b", url: RIS("LSB40026699") },
      { label: "RIS – Photovoltaik-Kennzeichnungsverordnung, § 2 Lagepunkte", url: RIS("LSB40027445") },
      { label: "RIS – Photovoltaik-Kennzeichnungsverordnung, § 3 Konfigurationspunkte", url: RIS("LSB40027446") },
    ],
    check: { art: "widmung", text: "Kennzeichnung im Flächenwidmungsplan nötig (über 200 m² Kollektorfläche), vergeben nach Punkteschema." },
  },
  {
    slug: "steiermark",
    name: "Steiermark",
    im: "in der Steiermark",
    gesetz: "Entwicklungsprogramm für den Sachbereich Erneuerbare Energie – Solarenergie (LGBl. Nr. 52/2023 i. d. F. LGBl. Nr. 12/2026) zum StROG 2010",
    kurz: "Gemeinden dürfen bis 2 ha zur lokalen Versorgung und bis 10 ha an bestimmten vorbelasteten Standorten widmen; über 10 ha nur in den 36 Vorrangzonen des Landes.",
    schwelle: "jede Freiflächenanlage (Sondernutzung im Freiland)",
    instrument: "Sondernutzung im Freiland (§ 33 Abs. 3 Z 1 StROG), Vorrangzonen des Landes",
    regeln: [
      {
        titel: "Bis 2 ha: lokale Versorgung",
        norm: "§ 6 Abs. 2 Entwicklungsprogramm Solarenergie",
        text: "Zur vorrangigen Versorgung von Siedlungsbereichen dürfen Gemeinden Eignungszonen und Sondernutzungen im Freiland außerhalb von Ausschlusszonen bis zu einer Gesamtfläche von 2 ha festlegen.",
      },
      {
        titel: "Bis 10 ha: vorbelastete Standorte",
        norm: "§ 6 Abs. 3 Entwicklungsprogramm Solarenergie",
        text: "Bis 10 ha sind Widmungen im Anschluss an hochrangige Straßen und Bahnen, an Kläranlagen, Energieerzeugungsanlagen oder Umspannwerke, an bestehende Gewerbe- und Industrieflächen sowie auf oder neben Materialgewinnungsstätten und Deponien zulässig. Die Gestaltungsgrundsätze der Vorrangzonen gelten sinngemäß; ökologische Korridore sind grundsätzlich tabu.",
      },
      {
        titel: "Über 10 ha: nur Vorrangzonen",
        norm: "§ 6 Abs. 1 und § 3 Entwicklungsprogramm Solarenergie",
        text: "Örtliche Widmungen über 10 ha sind unzulässig (Agri-PV ausgenommen). Größere Freiflächenanlagen sind in den Vorrangzonen der Anlagen 2.01 bis 2.36 zulässig – mit Gestaltungs- und Pflegekonzept, Hecken und Wildtierdurchlässigkeit.",
      },
      {
        titel: "Ausschlusszonen",
        norm: "§ 5 Entwicklungsprogramm Solarenergie",
        text: "Unzulässig sind örtliche Widmungen u. a. in landwirtschaftlichen Vorrangzonen und Grünzonen der Regionalen Entwicklungsprogramme (Agri-PV in landwirtschaftlichen Vorrangzonen ausgenommen), über der Waldgrenze, in Nationalparks, Naturschutzgebieten und auf Grünland in Europaschutzgebieten.",
      },
    ],
    zonen: "36 Vorrangzonen (Anlagen 2.01 bis 2.36); Ausschlusszonen u. a. landwirtschaftliche Vorrang- und Grünzonen (außer Agri-PV), Nationalparks und Naturschutzgebiete",
    beschleunigung: "Beschleunigungsgebiete nach dem EABG waren zum Prüfdatum in Begutachtung – noch offen.",
    offen: [
      "Beschleunigungsgebiete nach dem EABG: Begutachtungsstand, noch offen.",
    ],
    quellen: [
      { label: "RIS – Steiermark: Entwicklungsprogramm Solarenergie, § 3 Vorrangzonen", url: RIS("LST40035653") },
      { label: "RIS – Steiermark: Entwicklungsprogramm Solarenergie, § 5 Ausschlusszonen", url: RIS("LST40035654") },
      { label: "RIS – Steiermark: Entwicklungsprogramm Solarenergie, § 6 Vorgaben für die örtliche Raumplanung", url: RIS("LST40035655") },
    ],
    check: { art: "staffel", grossHa: 2, vorbelastetHa: 10, zoneHa: 10, text: "Sondernutzung im Freiland nötig; bis 2 ha lokal, bis 10 ha an vorbelasteten Standorten, darüber nur in Vorrangzonen." },
  },
  {
    slug: "tirol",
    name: "Tirol",
    im: "in Tirol",
    gesetz: "Tiroler Raumordnungsgesetz 2022 (TROG 2022) und Tiroler Elektrizitätsgesetz 2012 (TEG 2012)",
    kurz: "Im Freiland sind frei stehende Solaranlagen nur bis 100 m² Fläche zulässig; größere Anlagen brauchen eine Sonderflächenwidmung mit genau festgelegtem Verwendungszweck.",
    schwelle: "über 100 m² Fläche",
    instrument: "Sonderfläche mit Verwendungszweck Photovoltaik (§ 43 TROG 2022)",
    regeln: [
      {
        titel: "Freiland: bis 100 m²",
        norm: "§ 41 Abs. 2 lit. l TROG 2022",
        text: "Im Freiland dürfen frei stehende Solarenergieanlagen mit höchstens 100 m² Fläche errichtet werden, dazu bauliche Anlagen für Energiespeicher.",
      },
      {
        titel: "Größere Anlagen: Sonderfläche",
        norm: "§ 43 TROG 2022",
        text: "Als Sonderflächen können Grundflächen für Anlagen gewidmet werden, die an einen Standort gebunden sind oder für die er sich besonders eignet. Der Verwendungszweck ist genau festzulegen; in Gefahrenzonen braucht es Gutachten. Wird nicht binnen fünf Jahren bewilligt bzw. begonnen, tritt die Widmung außer Kraft.",
      },
      {
        titel: "Beschleunigungsgebiete per Verordnung",
        norm: "§ 5b TEG 2012",
        text: "Die Landesregierung hat Beschleunigungsgebiete für erneuerbare Energie per Verordnung auszuweisen – vorrangig auf künstlichen, versiegelten und vorbelasteten Flächen; Natura-2000- und Schutzgebiete sind ausgeschlossen.",
      },
    ],
    zonen: "keine landesweiten PV-Zonen; Sonderflächenwidmung je Standort",
    beschleunigung: "Die gesetzliche Grundlage besteht (§ 5b TEG 2012); ob eine Verordnung mit konkreten Gebieten erlassen ist, war zum Prüfdatum nicht festzustellen – noch offen.",
    offen: [
      "Verordnung über Beschleunigungsgebiete nach § 5b TEG 2012: noch offen.",
      "Naturschutzrechtliche Schwellen für Freiflächenanlagen (Tiroler Naturschutzgesetz 2005) bitte im Einzelfall mit der Bezirkshauptmannschaft klären.",
    ],
    quellen: [
      { label: "RIS – Tiroler Raumordnungsgesetz 2022, § 41 Freiland", url: RIS("LTI40053261") },
      { label: "RIS – Tiroler Raumordnungsgesetz 2022, § 43 Sonderflächen", url: RIS("LTI40055139") },
      { label: "RIS – Tiroler Elektrizitätsgesetz 2012, § 5b Beschleunigungsgebiete", url: RIS("LTI40053211") },
    ],
    check: { art: "widmung", text: "Sonderflächenwidmung mit Verwendungszweck Photovoltaik nötig (über 100 m²)." },
  },
  {
    slug: "vorarlberg",
    name: "Vorarlberg",
    im: "in Vorarlberg",
    gesetz: "Vorarlberger Raumplanungsgesetz (RPG)",
    kurz: "Freiflächenanlagen brauchen die Widmung als Sondergebiet für Anlagen zur Erzeugung erneuerbarer Energie; Beschleunigungsgebiete legt das Land in einem Landesraumplan fest.",
    schwelle: "jede Freiflächenanlage (Sondergebiet)",
    instrument: "Freifläche-Sondergebiet (§ 18 Abs. 4 lit. c RPG)",
    regeln: [
      {
        titel: "Sondergebiet für erneuerbare Energie",
        norm: "§ 18 Abs. 4 lit. c RPG",
        text: "Als Sondergebiete können Flächen für Anlagen der Ver- und Entsorgungsinfrastruktur festgelegt werden – ausdrücklich auch für Anlagen zur Erzeugung von Energie aus erneuerbaren Quellen. Der Verwendungszweck ist in der Widmung anzuführen.",
      },
      {
        titel: "Landwirtschaftsgebiet und Freihaltegebiet",
        norm: "§ 18 Abs. 3 und 5 RPG",
        text: "Im Landwirtschaftsgebiet sind nur Anlagen für die land- und forstwirtschaftliche Nutzung zulässig; Freihaltegebiete sind von Bebauung freizuhalten. Ein Solarpark braucht daher eine Umwidmung.",
      },
      {
        titel: "Beschleunigungsgebiete im Landesraumplan",
        norm: "§ 9 RPG",
        text: "Die Landesregierung hat Beschleunigungsgebiete für erneuerbare Energie in einem Landesraumplan auszuweisen – vorrangig künstliche, versiegelte und vorbelastete Flächen; Schutzgebiete und Vogelzugrouten sind ausgeschlossen.",
      },
    ],
    zonen: "keine landesweiten PV-Zonen; Beschleunigungsgebiete per Landesraumplan vorgesehen",
    beschleunigung: "Rechtsgrundlage seit 03.04.2025 in Kraft (§ 9 RPG); ein Landesraumplan mit konkreten Gebieten war zum Prüfdatum nicht festzustellen – noch offen.",
    offen: [
      "Landesraumplan mit Beschleunigungsgebieten: noch offen.",
      "Wechselwirkung mit den Landesgrünzonen im Rheintal und Walgau bitte im Einzelfall mit dem Land klären.",
    ],
    quellen: [
      { label: "RIS – Vorarlberger Raumplanungsgesetz, § 18 Freiflächen", url: RIS("LVB40043688") },
      { label: "RIS – Vorarlberger Raumplanungsgesetz, § 9 Beschleunigungsgebiete", url: RIS("LVB40045013") },
    ],
    check: { art: "widmung", text: "Umwidmung in ein Sondergebiet für erneuerbare Energie nötig." },
  },
  {
    slug: "wien",
    name: "Wien",
    im: "in Wien",
    gesetz: "Bauordnung für Wien (BO) und Wiener Energie- und Klimarechts-Umsetzungsgesetz 2020 (WERUG 2020)",
    kurz: "Die Bauordnung kennt keine eigene Grünland-Widmung für Photovoltaik: In ländlichen Gebieten sind nur land- und forstwirtschaftliche, gärtnerische und öffentliche Bauwerke zulässig.",
    schwelle: "keine eigene PV-Widmung im Grünland",
    instrument: "Flächenwidmungs- und Bebauungsplan (Einzelfall)",
    regeln: [
      {
        titel: "Ländliche Gebiete",
        norm: "§ 6 Abs. 1 BO für Wien",
        text: "Ländliche Gebiete sind für land- und forstwirtschaftliche oder berufsgärtnerische Nutzung bestimmt. Zulässig sind nur Bauwerke für diese Zwecke im betriebsnotwendigen Ausmaß sowie Bauwerke für öffentliche Zwecke.",
      },
      {
        titel: "Schnellere Verfahren auf künstlichen Strukturen",
        norm: "§ 16a WERUG 2020",
        text: "Für Solaranlagen auf bestehenden oder künftigen künstlichen Strukturen – etwa Dächern, Parkplätzen oder Infrastruktur – muss die Behörde binnen drei Monaten entscheiden, bis 15 kW binnen eines Monats.",
      },
    ],
    zonen: "keine PV-Zonen; Schwerpunkt Dächer und künstliche Strukturen",
    beschleunigung: "Beschleunigte Verfahren gelten nach § 16a WERUG 2020 für Solaranlagen auf künstlichen Strukturen; Beschleunigungsgebiete für Freiflächen: noch offen.",
    offen: [
      "Welche Widmung eine Freiflächenanlage im Einzelfall ermöglichen würde, ist mit der Stadtplanung (MA 21) zu klären – noch offen.",
    ],
    quellen: [
      { label: "RIS – Bauordnung für Wien, § 6 Zulässige Nutzungen", url: RIS("LWI40016432") },
      { label: "RIS – WERUG 2020, § 16a Verfahrensbeschleunigung", url: RIS("LWI40018296") },
    ],
    check: { art: "keine", text: "Im Wiener Grünland ist keine eigene PV-Widmung vorgesehen – eine Freiflächenanlage wäre ein Einzelfall für die Stadtplanung." },
  },
];

/** Datensatz zu einem Slug; null, wenn unbekannt. */
export function landFuerSlug(slug) {
  return LAENDER.find((l) => l.slug === slug) ?? null;
}

/** Pfad der Widmungsseite eines Landes. */
export const widmungsPfad = (slug) => `/freiflaechen-photovoltaik/widmung/${slug}`;
