// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 6330.

const kufstein = {
  name: "Kufstein",
  bundesland: "Tirol",
  land: "tirol",
  bezirk: "Bezirk Kufstein",
  plz: "6330",
  alpin: true,
  beschreibung:
    "Photovoltaik in Kufstein: PV für Gewerbeparks, Handel und Präzisionstechnik an der Grenze zu Bayern – Netz der Stadtwerke Kufstein, TBO 2022, Schneelast.",
  titel: "Photovoltaik für Kufstein –",
  akzent: "Gewerbeparks an der Grenze.",
  lead: "Kufstein ist baulandarm, aber wirtschaftsstark: Am Stadtrand entstehen laufend neue Gewerbe- und Handelsgebiete, und viele Betriebe haben große Flachdächer. Das Stromnetz betreiben hier die Stadtwerke Kufstein – seit 1898.",
  einleitungTitel: "Sechs Gewerbeparks und ein eigenes Netz",
  einleitung: [
    "Die Bezirkshauptstadt mit rund 20.100 Einwohnerinnen und Einwohnern liegt im Tiroler Unterland direkt an der Grenze zu Bayern. Weil Bauland knapp ist, wachsen Gewerbe und Handel an den Stadträndern: in den Gewerbeparks Weissach, Kufstein Süd, Kufstein Nord, Münchner Straße, Innpark und Grissemann.",
    "Kufstein ist Gründungsstadt einer großen österreichischen Handelskette und Sitz eines Herstellers von Präzisionstechnik. Größere Industriebetriebe sind teils in die Nachbargemeinden ausgewichen – der Wirtschaftsraum reicht damit über die Stadtgrenze hinaus.",
    "Netzbetreiberin ist die Stadtwerke Kufstein GmbH, die neben Kufstein auch Thiersee, Ebbs, Langkampfen und Schwoich versorgt. Sie prüft vorab, ob die gewünschte Einspeiseleistung ins Netz passt, und vergibt den Einspeisezählpunkt.",
  ],
  schwerpunkte: [
    {
      titel: "Flachdächer in den Gewerbeparks",
      text: "Handels- und Gewerbehallen am Stadtrand haben meist Flachdächer mit Foliendeckung. Wir planen ballastierte Ost-West-Systeme mit Rücksicht auf Dachabdichtung, Schneelast und Windsog.",
    },
    {
      titel: "Tiroler Bauordnung",
      text: "Bis 100 m² gebäudeanliegend ist eine Anlage anzeige- und bewilligungsfrei, darüber genügt eine Bauanzeige. Die Fertigstellungsmeldung an die Stadt übernehmen wir.",
    },
    {
      titel: "Präzisionsfertigung",
      text: "Werkzeug- und Präzisionsbetriebe brauchen stabile Netzqualität. Wir planen Wechselrichter, Blindleistung und Schutztechnik mit dem Netzbetreiber und der Instandhaltung.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaft in Kufstein",
    text: "An den Stadträndern entstehen laufend neue Gewerbe- und Handelsgebiete; wegen hoher Grundstückskosten sind einige Industriebetriebe in Nachbargemeinden abgewandert.",
    punkte: [
      { titel: "Gewerbeparks", text: "Weissach, Kufstein Süd, Kufstein Nord, Münchner Straße, Innpark Kufstein und Grissemann." },
      { titel: "Handel", text: "Kufstein ist Gründungsstadt eines der größten österreichischen Handelsunternehmen; die erste Filiale am Unteren Stadtplatz besteht bis heute." },
      { titel: "Präzisionstechnik", text: "Ein Hersteller von Präzisionskomponenten für Elektro-, Anlagen- und Maschinenbau hat seinen Sitz in der Stadt." },
    ],
    url: "https://de.wikipedia.org/wiki/Kufstein",
    quelle: "Wikipedia: Kufstein – Wirtschaft",
  },
  anfahrt: "Über das Deutsche Eck (A8/A93) direkt ins Unterinntal.",
  faq: [
    {
      q: "Wer ist in Kufstein für den Netzanschluss zuständig?",
      a: "Die Stadtwerke Kufstein GmbH – für die Postleitzahl 6330 nennt der E-Control-Tarifkalkulator nur sie. Die Stadtwerke versorgen außerdem Thiersee, Ebbs, Langkampfen und Schwoich.",
    },
    {
      q: "Wie groß darf eine PV-Anlage in Kufstein ohne Bauanzeige sein?",
      a: "Gebäudeanliegende Anlagen bis 100 m², integriert oder mit höchstens 30 cm Abstand zur Dachfläche, sind nach § 28 Abs. 3 TBO 2022 anzeige- und bewilligungsfrei. Für größere Gewerbeanlagen reicht eine Bauanzeige.",
    },
    {
      q: "Welche Schneelast gilt in Kufstein?",
      a: "Sie hängt von Lastzone und Seehöhe ab und wird nach ÖNORM B 1991-1-3 für die genaue Adresse bestimmt. Im Unterinntal liegen die Werte über denen des Alpenvorlands; wir prüfen sie vor der Planung, etwa über HORA.",
    },
  ],
  cta: {
    titel: "Halle in einem Kufsteiner Gewerbepark?",
    text: "Wir prüfen Dachaufbau und Statik, stellen die Netzanfrage bei den Stadtwerken und rechnen mit Ihrem Lastgang.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Stadtwerke Kufstein GmbH",
      kurz: "Stadtwerke Kufstein",
      hinweis: "Laut E-Control einziger Verteilnetzbetreiber für PLZ 6330; versorgt auch Thiersee, Ebbs, Langkampfen und Schwoich.",
      url: "https://www.stwk.at/photovoltaik/",
    },
  },
};

export default kufstein;
