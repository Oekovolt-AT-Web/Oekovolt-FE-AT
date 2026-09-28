// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 7000.

const eisenstadt = {
  name: "Eisenstadt",
  bundesland: "Burgenland",
  land: "burgenland",
  bezirk: "Freistadt",
  plz: "7000",
  alpin: false,
  beschreibung:
    "Photovoltaik in Eisenstadt: PV für Gewerbe, Verwaltung und Handel in der Landeshauptstadt – Netz Burgenland, Baubewilligung ab 20 kW, PVGIS-Ertrag.",
  titel: "Photovoltaik für Eisenstadt –",
  akzent: "Landeshauptstadt am Leithagebirge.",
  lead: "Eisenstadt ist die kleinste Landeshauptstadt Österreichs, aber Verwaltungs-, Gerichts- und Handelszentrum des Burgenlands. Für Gewerbeanlagen gilt hier eine Besonderheit: Das Burgenländische Baugesetz verlangt schon ab 20 kW eine Baubewilligung.",
  einleitungTitel: "Freistadt mit strengem Baurecht für PV",
  einleitung: [
    "Eisenstadt hat rund 16.400 Einwohnerinnen und Einwohner und liegt auf einer Terrasse am Südfuß des Leithagebirges. Als Freistadt ist der Bürgermeister zugleich Bezirksverwaltungsbehörde; Landesregierung, Landes- und Bezirksgericht haben hier ihren Sitz. Einkaufszentren und Gewerbegebiete liegen vor allem im Süden der Stadt.",
    "Anders als in den meisten Bundesländern sind im Burgenland nur kleine Dachanlagen baurechtlich frei: bis 20 kW auf Gebäuden der Gebäudeklassen 1 bis 3, dachparallel oder bis 15° aufgeständert. Jede größere Dachanlage – also praktisch jede Gewerbeanlage – braucht nach § 18d Bgld. BauG eine Baubewilligung mit Nachweis, dass die Netzanschlusskapazität reicht.",
    "Umgekehrt ist der Standort ertragsstark: Laut PVGIS liefert ein Süddach in Eisenstadt rund 5 % mehr als an unserem Firmensitz. Mit Verwaltung, Handel und Dienstleistern mit Tagesverbrauch lässt sich der Solarstrom gut nutzen.",
  ],
  schwerpunkte: [
    {
      titel: "Baubewilligung ab 20 kW",
      text: "Wir erstellen die Einreichunterlagen für die Baubewilligung inklusive Nachweis der Netzanschlusskapazität von Netz Burgenland und melden die Fertigstellung an Behörde und Feuerwehr.",
    },
    {
      titel: "Verwaltung und öffentliche Hand",
      text: "Landes- und Bundesbehörden, Schulen und Gerichte haben planbaren Tagesverbrauch. Für öffentliche Auftraggeber liefern wir Unterlagen für Vergabeverfahren.",
    },
    {
      titel: "Handel im Süden der Stadt",
      text: "Fachmärkte und Einkaufszentren haben große Flachdächer und Parkflächen. Solarcarports mit Ladepunkten ergänzen die Dachanlage.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaft in Eisenstadt",
    text: "2001 beschäftigten 1.089 Unternehmen in Eisenstadt 13.581 Menschen; acht davon hatten jeweils mehr als 200 Mitarbeitende.",
    punkte: [
      { titel: "Verwaltung und Justiz", text: "Landesregierung, Bezirkshauptmannschaft Eisenstadt-Umgebung, Landes- und Bezirksgericht." },
      { titel: "Produktion", text: "Unternehmen für Verbundbauteile und für Steuerungstechnik haben ihren Hauptsitz in Eisenstadt." },
      { titel: "Handel und Gewerbe", text: "Einkaufszentren und Gewerbegebiete im Süden der Stadt, angebunden über Stadtbus und Bahnhof." },
    ],
    url: "https://de.wikipedia.org/wiki/Eisenstadt",
    quelle: "Wikipedia: Eisenstadt – ansässige Unternehmen",
  },
  anfahrt: "Überwiegend über die Westautobahn A1 und den Wiener Raum.",
  faq: [
    {
      q: "Brauche ich in Eisenstadt eine Baubewilligung für eine PV-Anlage?",
      a: "Für Gewerbeanlagen in der Regel ja. Vom Burgenländischen Baugesetz ausgenommen sind nur Anlagen bis 20 kW auf Gebäuden der Gebäudeklassen 1 bis 3, dachparallel oder bis 15° aufgeständert, höchstens 30 cm über der Eindeckung (§ 1 Abs. 2 Z 7). Größere Anlagen brauchen nach § 18d eine Baubewilligung mit Nachweis der Netzanschlusskapazität.",
    },
    {
      q: "Wer ist in Eisenstadt Netzbetreiber?",
      a: "Für die Postleitzahl 7000 nennt der E-Control-Tarifkalkulator die Netz Burgenland GmbH. Deren Bestätigung zur Anschlusskapazität brauchen Sie im Burgenland schon für den Bauantrag.",
    },
    {
      q: "Muss die Feuerwehr über die PV-Anlage informiert werden?",
      a: "Ja. Nach § 18d Abs. 3 Bgld. BauG ist die Fertigstellungsanzeige der Behörde unverzüglich mitzuteilen und vom Bauwerber an den örtlich zuständigen Feuerwehrkommandanten weiterzuleiten – mit Angaben zu Lage und Leistung der Anlage.",
    },
  ],
  cta: {
    titel: "Gewerbedach in Eisenstadt?",
    text: "Wir kümmern uns um Netzkapazität, Baubewilligung und Fertigstellungsanzeige – und rechnen Ihren Eigenverbrauch.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Netz Burgenland GmbH",
      kurz: "Netz Burgenland",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiber für PLZ 7000.",
      url: "https://www.netzburgenland.at/strom/photovoltaik",
    },
    besonderheiten: [
      {
        text: "Die Fertigstellungsanzeige von PV-Anlagen ist im Burgenland unverzüglich der Behörde mitzuteilen und an den örtlichen Feuerwehrkommandanten weiterzuleiten (§ 18d Abs. 3 Bgld. BauG).",
        url: "https://www.jusline.at/gesetz/bgld_baug/paragraf/18d",
      },
    ],
  },
};

export default eisenstadt;
