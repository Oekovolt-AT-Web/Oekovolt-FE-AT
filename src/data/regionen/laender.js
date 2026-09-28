// Landesweite Angaben für die Regionalseiten /photovoltaik/[ort].
// Recherche: 29.09.2026. Baurecht aus dem jeweils geltenden Landesrecht (Fassung laut RIS/JUSLINE
// bzw. Leitfaden des Landes), Energieberatung = Einrichtung des Landes.
// Förderdetails stehen auf den Länderseiten /forderungen/landesforderungen/landesfoerderungen-in-<slug>.

export const LAENDER = {
  wien: {
    name: "Wien",
    hauptstadt: "wien",
    bauordnung: {
      text: "Photovoltaikanlagen sind nach § 62a Abs. 1 Z 24a Bauordnung für Wien bewilligungsfrei, solange keine Genehmigungspflicht nach § 60 Abs. 1 lit. j besteht – also außerhalb von Schutzzonen, Grünland-Schutzgebiet und Gebieten mit Bausperre. Für Neu- und Zubauten von Nicht-Wohngebäuden verlangt § 118e Abs. 3 mindestens 1 kWp Solarleistung je 100 m² konditionierter Brutto-Grundfläche.",
      url: "https://www.jusline.at/gesetz/bo_fuer_wien/paragraf/118e",
    },
    energieberatung: { name: "ÖkoBusiness Wien – Umweltserviceprogramm der Stadt Wien für Betriebe", url: "https://unternehmen.oekobusiness.wien.at/" },
  },
  niederoesterreich: {
    name: "Niederösterreich",
    hauptstadt: "st-poelten",
    bauordnung: {
      text: "Die Aufstellung von Photovoltaikanlagen und ihre Anbringung auf Bauwerken ist nach § 17 Z 14 NÖ Bauordnung 2014 grundsätzlich bewilligungs-, anzeige- und meldefrei. Ausgenommen sind einsehbare Flächen in Schutzzonen und erhaltungswürdigen Altortgebieten (§ 15 Abs. 1 Z 13 lit. b) sowie Freiflächenanlagen über 100 kW im Grünland (§ 15 Abs. 1 Z 8); für größere Freiflächen gelten zusätzlich die Photovoltaik-Regeln der NÖ Raumordnung.",
      url: "https://www.jusline.at/gesetz/noe__bo_2014/paragraf/17",
    },
    energieberatung: { name: "Energie- und Umweltagentur des Landes NÖ (eNu)", url: "https://www.energie-noe.at/" },
  },
  oberoesterreich: {
    name: "Oberösterreich",
    hauptstadt: "linz",
    bauordnung: {
      text: "Photovoltaikanlagen sind in Oberösterreich baurechtlich bewilligungs- und anzeigefrei (§ 26 Z 15 Oö. BauO 1994), müssen aber Orts- und Landschaftsbild, Statik sowie Flächenwidmungs- und Bebauungsplan einhalten. Elektrizitätsrechtlich sind Anlagen bis 1.000 kW und Anlagen auf Dächern oder Parkplätzen bewilligungsfrei (§ 6 Abs. 2 Z 1a Oö. ElWOG 2006). Freistehende Anlagen über 50 m² Modulfläche brauchen im Grünland eine Sonderausweisung (§ 30a Oö. ROG 1994).",
      url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf",
    },
    energieberatung: { name: "OÖ Energiesparverband – Energieberatung für Betriebe und Gemeinden", url: "https://www.energiesparverband.at/" },
  },
  salzburg: {
    name: "Salzburg",
    hauptstadt: "salzburg",
    bauordnung: {
      text: "Nach § 2 Abs. 4 Salzburger Baupolizeigesetz 1997 brauchen Solaranlagen keine Baubewilligung, wenn sie in Dach- oder Wandflächen eingefügt oder auf geneigten Dächern höchstens 30 cm über der Dachfläche ohne Überschreitung des Firsts montiert werden; auf Flachdächern müssen sie mindestens 1 m vom aufgehenden Mauerwerk zurückversetzt und höchstens 1 m hoch sein. Freistehend gilt die Freistellung bis 200 m² Kollektorfläche. Im Schutzgebiet des Salzburger Altstadterhaltungsgesetzes gilt sie nicht.",
      url: "https://www.jusline.at/gesetz/s-baupolg/paragraf/2",
    },
    energieberatung: { name: "Energieberatung des Landes Salzburg", url: "https://www.salzburg.gv.at/themen/energie" },
  },
  tirol: {
    name: "Tirol",
    hauptstadt: "innsbruck",
    bauordnung: {
      text: "Nach § 28 Abs. 3 Tiroler Bauordnung 2022 sind gebäudeanliegende PV-Anlagen – in die Dachfläche integriert oder mit höchstens 30 cm Abstand – bis 100 m² weder anzeige- noch bewilligungspflichtig; darüber genügt eine Bauanzeige. Die Fertigstellung ist der Baubehörde mit Standort und Leistung zu melden (§ 44 Abs. 8 TBO 2022). Freiflächenanlagen bis 100 m² brauchen keine eigene Widmung.",
      url: "https://www.tirol.gv.at/meldungen/meldung/erleichterung-fuer-pv-anlagen-in-kraft/",
    },
    energieberatung: { name: "Energieagentur Tirol", url: "https://www.energieagentur.tirol/" },
  },
  vorarlberg: {
    name: "Vorarlberg",
    hauptstadt: "bregenz",
    bauordnung: {
      text: "Die Anbringung von Solar- und PV-Anlagen an bestehenden Bauwerken ist nach § 20 Abs. 2 Vorarlberger Baugesetz frei, wenn Abstandsflächen eingehalten werden und die Module in Dach- oder Wandfläche eingefügt oder höchstens 0,30 m parallel dazu montiert sind. Auf Flachdächern darf die Anlage höchstens 1,2 m überstehen, der Abstand zum Dachrand muss mindestens dieser Höhe entsprechen. Gemeinden können per Verordnung Abweichendes festlegen.",
      url: "https://www.jusline.at/gesetz/baug/paragraf/20",
    },
    energieberatung: { name: "Energieinstitut Vorarlberg", url: "https://www.energieinstitut.at/" },
  },
  kaernten: {
    name: "Kärnten",
    hauptstadt: "klagenfurt",
    bauordnung: {
      text: "Bauliche Anlagen, die erneuerbare Energie erzeugen oder elektrische Energie speichern, sind nach § 7 Abs. 1 lit. a Z 20 Kärntner Bauordnung 1996 mitteilungspflichtig – für Dachanlagen genügt also eine Mitteilung an die Baubehörde. Für Freiflächenanlagen gelten Widmung und die Kärntner Photovoltaikanlagen-Verordnung.",
      url: "https://www.jusline.at/gesetz/k-bo_1996/paragraf/7",
    },
    energieberatung: null,
  },
  steiermark: {
    name: "Steiermark",
    hauptstadt: "graz",
    bauordnung: {
      text: "Photovoltaikanlagen auf Dach- oder Fassadenflächen sowie Freiflächenanlagen bis 100 kWp sind nach § 21 Abs. 1 Z 2 lit. o Steiermärkisches Baugesetz meldepflichtig; Anlagen und ihre Teile dürfen dabei 3,50 m Höhe nicht überschreiten. Größere Freiflächenanlagen brauchen eine Baubewilligung und eine passende Widmung.",
      url: "https://www.jusline.at/gesetz/stmk_baug/paragraf/21",
    },
    energieberatung: { name: "Energie Agentur Steiermark", url: "https://www.ea-stmk.at/" },
  },
  burgenland: {
    name: "Burgenland",
    hauptstadt: "eisenstadt",
    bauordnung: {
      text: "Vom Burgenländischen Baugesetz ausgenommen sind nur PV-Anlagen bis 20 kW auf Gebäuden der Gebäudeklassen 1 bis 3, die dachparallel oder bis 15° aufgeständert höchstens 30 cm über der Eindeckung liegen (§ 1 Abs. 2 Z 7 Bgld. BauG). Größere Dachanlagen – also praktisch jede Gewerbeanlage – und freistehende Anlagen brauchen eine Baubewilligung mit Nachweis der Netzanschlusskapazität (§ 18d Bgld. BauG).",
      url: "https://www.jusline.at/gesetz/bgld_baug/paragraf/18d",
    },
    energieberatung: null,
  },
};

/** Reihenfolge auf der Übersichtsseite */
export const LAENDER_REIHENFOLGE = ["oberoesterreich", "salzburg", "tirol", "vorarlberg", "kaernten", "steiermark", "burgenland", "niederoesterreich", "wien"];

export const foerderLink = (land) => `/forderungen/landesforderungen/landesfoerderungen-in-${land}`;
