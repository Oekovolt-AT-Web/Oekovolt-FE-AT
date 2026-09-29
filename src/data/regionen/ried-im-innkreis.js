// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 4910.

const riedImInnkreis = {
  name: "Ried im Innkreis",
  kurzname: "Ried",
  bundesland: "Oberösterreich",
  land: "oberoesterreich",
  bezirk: "Bezirk Ried im Innkreis",
  plz: "4910",
  alpin: false,
  // Anzeige: Foto im Seitenkopf (Nachweis in public/Images/AT/QUELLEN-produkte-regionen.md)
  bild: { src: "/Images/AT/produkte-regionen/region-innviertel.jpg", alt: "Hügellandschaft im Innviertel mit Einzelhöfen und Wiesen", position: "50% 60%" },
  beschreibung:
    "Photovoltaik in Ried im Innkreis: PV für Luftfahrt-Zulieferer, Sportartikel-, Möbel- und Anlagenbau – Netzanschluss bei Energie Ried, OÖ-Baurecht, PVGIS-Ertrag.",
  titel: "Photovoltaik für Ried –",
  akzent: "Innviertler Industrie mit Weltmarkt.",
  lead: "Ried ist Bezirkshauptstadt, Messestadt und Industriestandort zugleich. Hier werden Flugzeugkomponenten, Skier, Naturholzmöbel und Anlagen für die Agrar- und Holzindustrie gebaut – in Hallen, deren Dächer oft noch ungenutzt sind.",
  einleitungTitel: "Messestadt mit eigenem Stromnetz",
  einleitung: [
    "Ried im Innkreis zählt rund 13.000 Einwohnerinnen und Einwohner, aber täglich pendeln etwa 10.000 Arbeitnehmerinnen und Arbeitnehmer in die Stadt ein. Das produzierende Gewerbe ist der größte Beschäftigungszweig, größter Einzelarbeitgeber ist das Krankenhaus der Barmherzigen Schwestern.",
    "Eine Rieder Besonderheit ist das eigene Stromnetz: Im Stadtgebiet ist die Energie Ried GmbH Verteilnetzbetreiberin, im Umland die Netz Oberösterreich GmbH. Für die Anmeldung einer Anlage ist deshalb zuerst zu klären, in wessen Netz der Betrieb liegt.",
    "Von Ostermiething sind es rund 70 km nach Ried. Für Betriebe im Bezirk sind Begehung, Montage und Wartung damit Teil unserer Heimatregion.",
  ],
  schwerpunkte: [
    {
      titel: "Hochtechnologie-Fertigung",
      text: "Luftfahrtzulieferer und Anlagenbauer brauchen stabile Spannung und saubere Schutzkonzepte. Wir planen Einspeisung, Blindleistungsregelung und Überspannungsschutz mit dem Netzbetreiber und Ihrer Instandhaltung.",
    },
    {
      titel: "Holz- und Möbelbetriebe",
      text: "Bei Holzverarbeitung sind Staub und Brandlast Thema. Leitungsführung, Brandabschnitte und Feuerwehrplan stimmen wir nach OVE-Richtlinie R 11-1 ab.",
    },
    {
      titel: "Gesundheit und Verwaltung",
      text: "Krankenhäuser, Schulen und Behörden haben planbaren Tagesverbrauch. Für öffentliche Auftraggeber liefern wir Unterlagen, die sich in Vergabeverfahren einfügen.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsstandort Ried",
    text: "Rund 860 Betriebe sind in Ried ansässig; mit 22 % der Beschäftigten ist das produzierende Gewerbe der größte Bereich.",
    punkte: [
      { titel: "Luftfahrt und Anlagenbau", text: "Ein Hersteller von Flugzeugkomponenten und ein Spezialist für hochtechnische Anlagen haben in Ried ihre Werke." },
      { titel: "Sport und Möbel", text: "Ein Skihersteller mit weltweitem Ruf und eine Bio-Möbelfabrik stehen für Innviertler Qualitätsfertigung." },
      { titel: "Brauerei-Tradition", text: "Die Brauerei Ried wurde 1536 gegründet und produziert neben Bier auch Limonade – Kühlung und Abfüllung laufen tagsüber." },
    ],
    url: "https://de.wikipedia.org/wiki/Ried_im_Innkreis",
    quelle: "Wikipedia: Ried im Innkreis – Wirtschaft",
  },
  anfahrt: "Über Mattighofen quer durch das Innviertel.",
  faq: [
    {
      q: "Wer ist in Ried im Innkreis Netzbetreiber?",
      a: "Im Stadtgebiet betreibt die Energie Ried GmbH das Stromverteilnetz. Für die Postleitzahl 4910 nennt der E-Control-Tarifkalkulator außerdem die Netz Oberösterreich GmbH, die das Umland versorgt. Ihre Stromrechnung zeigt beim Zählpunkt, welche Gesellschaft zuständig ist.",
    },
    {
      q: "Wie läuft die Anmeldung einer Gewerbeanlage in Ried ab?",
      a: "Zuerst stellen wir die Netzanfrage beim zuständigen Netzbetreiber, danach folgen Netzzugangsantrag, Errichtung, Fertigstellungsmeldung und Inbetriebnahme. Das OeMAG-Förderansuchen muss vor der Inbetriebnahme eingebracht werden.",
    },
    {
      q: "Eignet sich ein Innviertler Vierkanthof für eine große PV-Anlage?",
      a: "Oft ja: Vierkanthöfe haben große Dachflächen in mehreren Ausrichtungen. Wichtig sind Zustand der Dachhaut und Tragwerk – bei Altbeständen prüfen wir die Statik, bevor wir planen.",
    },
  ],
  cta: {
    titel: "Betrieb in Ried? Wir klären zuerst das Netz.",
    text: "Energie Ried oder Netz Oberösterreich – wir stellen die Netzanfrage und legen die Anlage auf Ihren Verbrauch aus.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Energie Ried GmbH",
      kurz: "Energie Ried",
      hinweis: "Stadtgebiet Ried; im Umland (PLZ 4910) laut E-Control auch Netz Oberösterreich GmbH.",
      url: "https://www.energie-ried.at/index.php/geschaeftskunden/photovoltaik-biz",
    },
  },
};

export default riedImInnkreis;
