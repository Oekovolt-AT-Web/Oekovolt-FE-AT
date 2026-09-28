// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 5500.

const bischofshofen = {
  name: "Bischofshofen",
  bundesland: "Salzburg",
  land: "salzburg",
  bezirk: "Bezirk St. Johann im Pongau",
  plz: "5500",
  alpin: true,
  beschreibung:
    "Photovoltaik in Bischofshofen und im Pongau: PV für Maschinenbau, Glas, Logistik und Tourismus – Schneelast im Salzachtal, Salzburg Netz, Baurecht, Ertrag.",
  titel: "Photovoltaik für Bischofshofen –",
  akzent: "Industrie und Tourismus im Pongau.",
  lead: "Bischofshofen ist der Industriestandort des Pongaus: Ein Werk für Baumaschinen mit über 1.100 Beschäftigten, eine Glas-Österreichzentrale und ein Logistikzentrum sitzen hier – mitten in einer Tourismusregion mit hohen Schneelasten.",
  einleitungTitel: "Bahnknoten, Baumaschinen, Sprungschanze",
  einleitung: [
    "Die Stadt mit rund 10.800 Einwohnerinnen und Einwohnern liegt etwa 50 km südlich von Salzburg an der Salzach. Nach dem Zweiten Weltkrieg haben Betriebs- und Industrieansiedlungen Bischofshofen geprägt; heute ist ein Baumaschinenwerk der größte Arbeitgeber.",
    "Ein Logistikzentrum bündelt die Warenströme der Region, und ein international tätiger Glaserzeuger hat hier seine Österreichzentrale. Daneben spielen Tourismus und Sport eine große Rolle – Bischofshofen ist Station der Vierschanzentournee.",
    "Mit rund 550 m Seehöhe im Ortszentrum und steilen Hanglagen rundherum ist die Schneelast in Bischofshofen ein zentrales Planungsthema. Umgekehrt liefert der inneralpine Standort laut PVGIS einen höheren Jahresertrag als das Innviertel.",
  ],
  schwerpunkte: [
    {
      titel: "Große Werkshallen",
      text: "Montagehallen für Maschinenbau haben weite Spannweiten und oft knappe Tragreserven. Wir prüfen die Statik vor der Belegung und planen bei Bedarf mit leichten Unterkonstruktionen.",
    },
    {
      titel: "Logistik mit Kühlung",
      text: "Lager- und Umschlagbetriebe verbrauchen tagsüber viel Strom für Förder- und Kühltechnik – ein guter Partner für eine Dachanlage mit hohem Eigenverbrauch.",
    },
    {
      titel: "Hotels und Bergbahnen im Pongau",
      text: "In Tourismusbetrieben fällt der Verbrauch saisonal an. Speicher, Ladepunkte und Lastmanagement verschieben Solarstrom in die Abendstunden.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaft in Bischofshofen",
    text: "Größter Arbeitgeber der Stadt ist ein Baumaschinenwerk mit mehr als 1.100 Mitarbeitenden.",
    punkte: [
      { titel: "Baumaschinen", text: "Ein international tätiges Baumaschinenwerk prägt Arbeitsmarkt und Zulieferbetriebe im Pongau." },
      { titel: "Logistikzentrum", text: "Ein Logistikzentrum bietet Unternehmen der Region Bündelung der Warenströme und Lagerung." },
      { titel: "Glas", text: "Ein international renommierter Glaserzeuger hat seine Österreichzentrale in Bischofshofen." },
    ],
    url: "https://de.wikipedia.org/wiki/Bischofshofen",
    quelle: "Wikipedia: Bischofshofen – ansässige Unternehmen",
  },
  schnee: "Neben der Seehöhe zählt die Lage: Gebäude an den Hängen um Bischofshofen haben höhere Lasten als der Talboden.",
  faq: [
    {
      q: "Welche Schneelast gilt in Bischofshofen?",
      a: "Die charakteristische Schneelast bestimmt sich nach ÖNORM B 1991-1-3 aus Lastzone und Seehöhe des Gebäudes. Im Pongau liegen die Werte deutlich über dem Flachland. Wir ermitteln sie für die genaue Adresse, etwa über HORA, und legen Unterkonstruktion und Befestigung danach aus.",
    },
    {
      q: "Wer ist in Bischofshofen Netzbetreiber?",
      a: "Für die Postleitzahl 5500 nennt der E-Control-Tarifkalkulator die Salzburg Netz GmbH.",
    },
    {
      q: "Warum ist der Solarertrag im Pongau höher als im Flachland?",
      a: "Inneralpine Täler haben oft weniger Hochnebel als das Alpenvorland, und Schnee reflektiert im Winter zusätzliches Licht. PVGIS berücksichtigt den Geländehorizont; beschattete Talflanken können den Ertrag aber im Einzelfall wieder senken.",
    },
  ],
  cta: {
    titel: "Pongauer Betrieb? Wir rechnen mit Schnee und Horizont.",
    text: "Statikcheck, standortgenaue Ertragsprognose und ein Angebot, das auch den Winter ehrlich abbildet.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Salzburg Netz GmbH",
      kurz: "Salzburg Netz",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiber für PLZ 5500.",
      url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger/anschluss-erzeugungsanlage.html",
    },
  },
};

export default bischofshofen;
