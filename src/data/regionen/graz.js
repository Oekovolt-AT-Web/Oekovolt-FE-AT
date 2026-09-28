// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 8010/8020/8041/8053.

const graz = {
  name: "Graz",
  bundesland: "Steiermark",
  land: "steiermark",
  bezirk: "Statutarstadt",
  plz: "8010",
  alpin: false,
  beschreibung:
    "Photovoltaik in Graz: PV für Fahrzeug- und Anlagenbau, Messtechnik und Gewerbe – Stromnetz Graz oder Energienetze Steiermark, Meldepflicht, Welterbe-Altstadt.",
  titel: "Photovoltaik für Graz –",
  akzent: "Technologiefabrik im Süden Österreichs.",
  lead: "Graz ist die zweitgrößte Stadt Österreichs und wichtigster Wirtschaftsstandort im Süden – mit Fahrzeugbau, Anlagenbau, Antriebs- und Messtechnik. Dazu kommt ein PVGIS-Ertrag, der rund 7 % über unserem Firmensitz liegt.",
  einleitungTitel: "Industrie, Forschung und Welterbe",
  einleitung: [
    "Graz hat rund 307.000 Einwohnerinnen und Einwohner. Die Stadt und die Steiermark gelten als Innovationszentrum Österreichs: Jede dritte Hightech-Innovation des Landes kommt aus dieser Region. Große Arbeitgeber sind Anlagenbau, Fahrzeugfertigung in Thondorf, Antriebsentwicklung und Messtechnik, dazu zahlreiche Klein- und Mittelbetriebe aus Maschinenbau und Umwelttechnik.",
    "Beim Stromnetz ist Graz geteilt: Im Großteil des Stadtgebiets ist die Stromnetz Graz GmbH zuständig, in Randlagen die Energienetze Steiermark, in Gösting zusätzlich ein kleines E-Werk. Die Stromnetz Graz empfiehlt, PV-Anlagen schon in der Planungsphase anzumelden, weil die technische Prüfung je nach Leistung mehrere Wochen dauert.",
    "Die Altstadt und Schloss Eggenberg sind UNESCO-Welterbe und nach dem Grazer Altstadterhaltungsgesetz geschützt. Dort ist Photovoltaik nur mit Abstimmung möglich; die großen Gewerbedächer liegen ohnehin im Süden und Westen der Stadt.",
  ],
  schwerpunkte: [
    {
      titel: "Meldepflicht in der Steiermark",
      text: "Dach- und Fassadenanlagen sowie Freiflächenanlagen bis 100 kWp sind nach § 21 Steiermärkisches Baugesetz meldepflichtig; Anlagenteile dürfen 3,50 m Höhe nicht überschreiten. Die Meldung an die Baubehörde übernehmen wir.",
    },
    {
      titel: "Frühe Netzanmeldung",
      text: "Die Stromnetz Graz prüft Einspeisepunkte je nach Leistung mehrere Wochen. Wir stellen die Anfrage parallel zur Vorplanung, damit der Zeitplan hält.",
    },
    {
      titel: "Industrie und Automotive",
      text: "Fertigungs- und Prüfhallen haben große Dächer und Dauerlast. Wir planen Anlagen, Speicher und Ladeinfrastruktur mit Rücksicht auf Produktionsabläufe und Werksnormen.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsstandort Graz",
    text: "Graz ist Sitz bedeutender, global wie national tätiger Unternehmen und wichtigster Wirtschaftsstandort Südösterreichs.",
    punkte: [
      { titel: "Fahrzeug- und Anlagenbau", text: "Fahrzeugfertigung auf dem früheren Puch-Gelände in Thondorf und ein international tätiger Anlagenbauer gehören zu den größten Arbeitgebern." },
      { titel: "Antriebs- und Messtechnik", text: "Entwickler von Antriebssystemen und Hersteller von Messgeräten haben ihren Sitz in Graz." },
      { titel: "Maschinenbau und Umwelttechnik", text: "Hochspezialisierte Klein- und Mittelbetriebe machen Graz weltweit bekannt." },
      { titel: "Geschäftsreisen", text: "Rund 40 % der Nächtigungen entfallen auf Geschäftsreisende, weitere 10 % auf Kongresse (2023)." },
    ],
    url: "https://de.wikipedia.org/wiki/Graz",
    quelle: "Wikipedia: Graz – Wirtschaft",
  },
  faq: [
    {
      q: "Welcher Netzbetreiber ist in Graz zuständig?",
      a: "Im Großteil des Stadtgebiets die Stromnetz Graz GmbH. Für die Grazer Postleitzahlen nennt der E-Control-Tarifkalkulator zusätzlich die Energienetze Steiermark GmbH, für 8020 auch das E-Werk Gösting. Maßgeblich ist die Zählpunktnummer auf Ihrer Rechnung.",
    },
    {
      q: "Brauche ich in Graz eine Baubewilligung für eine PV-Anlage?",
      a: "Für Dach- und Fassadenanlagen nicht; sie sind nach § 21 Abs. 1 Z 2 lit. o Steiermärkisches Baugesetz meldepflichtig. In der Altstadt-Schutzzone gilt zusätzlich das Grazer Altstadterhaltungsgesetz, bei Denkmälern das Denkmalschutzgesetz.",
    },
    {
      q: "Wann muss ich die PV-Anlage bei Stromnetz Graz anmelden?",
      a: "Schon in der Planungsphase. Die Stromnetz Graz weist darauf hin, dass die technische Prüfung je nach Leistung mehrere Wochen dauert und der Einspeisepunkt vor der Errichtung feststehen muss. Die Fertigstellung ist spätestens zwei Wochen vor Inbetriebnahme zu melden.",
    },
  ],
  cta: {
    titel: "Industriedach in Graz?",
    text: "Wir klären den Netzbetreiber, stellen die Anfrage früh und liefern eine Auslegung mit Wirtschaftlichkeitsrechnung für Ihren Lastgang.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Stromnetz Graz GmbH & Co KG",
      kurz: "Stromnetz Graz",
      hinweis: "Großteil des Stadtgebiets; laut E-Control für Grazer PLZ auch Energienetze Steiermark GmbH, für 8020 zusätzlich E-Werk Gösting.",
      url: "https://www.stromnetz-graz.at/sgg/netzanschluss/erzeugungsanlagen",
    },
    ortsbild: [
      {
        text: "„Stadt Graz – Historisches Zentrum und Schloss Eggenberg“ ist UNESCO-Welterbe. In der Schutzzone nach dem Grazer Altstadterhaltungsgesetz ist jede sichtbare Dachänderung mit der Altstadt-Sachverständigenkommission abzustimmen.",
        url: "https://whc.unesco.org/en/list/931",
      },
    ],
  },
};

export default graz;
