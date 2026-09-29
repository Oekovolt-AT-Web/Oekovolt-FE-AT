// Stadt- und Landschaftsbilder je Bundesland für Regionalseiten und Standortübersicht.
// Freie Bilder von Wikimedia Commons, Nachweis: public/Images/AT/QUELLEN-produkte-regionen.md
// (erscheint automatisch auf /bildnachweis). Einzelne Orte können in src/data/regionen/<ort>.js
// über das Feld `bild` ein eigenes Motiv setzen.

const P = "/Images/AT/produkte-regionen";

export const LANDES_BILDER = {
  oberoesterreich: { src: `${P}/region-oberoesterreich-linz.jpg`, alt: "Blick vom Pöstlingberg über Linz und das Donautal", position: "50% 55%" },
  salzburg: { src: `${P}/region-salzburg.jpg`, alt: "Festung Hohensalzburg über den Kirchtürmen der Salzburger Altstadt", position: "50% 35%" },
  tirol: { src: `${P}/region-tirol-innsbruck.jpg`, alt: "Innsbruck im Inntal vor der verschneiten Nordkette", position: "50% 40%" },
  vorarlberg: { src: `${P}/region-vorarlberg-bregenz.jpg`, alt: "Blick vom Pfänder auf Bregenz, den Hafen und den Bodensee", position: "50% 45%" },
  kaernten: { src: `${P}/region-kaernten-woerthersee.jpg`, alt: "Seeblick über den Wörthersee bei Pörtschach", position: "50% 45%" },
  steiermark: { src: `${P}/region-steiermark-graz.jpg`, alt: "Dächer der Grazer Altstadt vom Schloßberg aus gesehen", position: "50% 45%" },
  burgenland: { src: `${P}/region-burgenland-neusiedler-see.jpg`, alt: "Leuchtturm am Neusiedler See in Podersdorf", position: "50% 50%" },
  niederoesterreich: { src: `${P}/region-niederoesterreich-wachau.jpg`, alt: "Donau und Weinterrassen in der Wachau", position: "50% 50%" },
  wien: { src: `${P}/region-wien.jpg`, alt: "Wien im Morgenlicht, Blick über die Dächer der Stadt", position: "50% 60%" },
};

/** Innviertel (Firmensitz-Region) */
export const INNVIERTEL_BILD = { src: `${P}/region-innviertel.jpg`, alt: "Hügellandschaft im Innviertel mit Einzelhöfen und Wiesen", position: "50% 60%" };
/** Alpines Tirol (Kitzbüheler Alpen, Wilder Kaiser) */
export const TIROL_ALPIN_BILD = { src: `${P}/region-tirol-wilder-kaiser.jpg`, alt: "Wilder Kaiser im Winter über Going", position: "50% 45%" };

export const landesBild = (land) => LANDES_BILDER[land] || LANDES_BILDER.oberoesterreich;
