// Zielgruppen-Seiten (Lösungen): Überschriften-Varianten je Kampagne.
//
// Kommt ein Besucher über einen Link mit utm_term, utm_campaign oder utm_content,
// wird die erste Variante gewählt, deren Schlüsselwort darin vorkommt – so passt die
// Überschrift zur Anzeige („Message Match“). Ohne Parameter gilt die Standardvariante.
// Die Canonical-URL bleibt immer ohne Parameter, Suchmaschinen sehen nur den Standard.
//
// Beispiel: /gewerbe?utm_source=linkedin&utm_medium=paid_social&utm_campaign=gewerbe_q4&utm_term=speicher
//
// Österreich: Begriffe und Rechtslage AT (Leistungspreis = Mittel der Monatsspitzen,
// EAG, IFB, Energiegemeinschaften nach ElWG). Keine Zusagen zu Preisen oder Fristen.

export const ZIELGRUPPEN = {
  landwirtschaft: {
    standard: {
      eyebrow: "Für land- und forstwirtschaftliche Betriebe",
      titel: "Solarstrom vom Hof –",
      akzent: "für Stall, Scheune und Maschinenhalle.",
      lead: "Photovoltaik auf Stall-, Scheunen- und Hallendächern, Speicher für Melk- und Kühltechnik, Überschuss in die Energiegemeinschaft der Gemeinde: Wir planen Anlagen, die zum Betrieb passen – steuerlich sauber abgestimmt und mit Blick auf die Förderung.",
      cta: "Hofdach bewerten lassen",
    },
    varianten: [
      {
        schluessel: ["agri", "freiflaeche", "acker", "sonderkultur", "obst", "beeren", "weide", "wein"],
        eyebrow: "Agri-PV in Österreich",
        titel: "Ernten Sie doppelt –",
        akzent: "Strom und Ertrag auf derselben Fläche.",
        lead: "Vertikal zwischen Grünland- und Ackerstreifen, hoch aufgeständert über Obst, Wein und Beeren: Agri-PV bekommt in Österreich einen Förderzuschlag von 30 % – wenn Konzept, Widmung und landwirtschaftliche Nutzung von Anfang an stimmen.",
        cta: "Agri-PV-Fläche prüfen lassen",
      },
      {
        schluessel: ["stall", "scheune", "hofdach", "halle", "maschinenhalle", "dach"],
        eyebrow: "Photovoltaik auf Stall & Scheune",
        titel: "Ihr Stalldach kann mehr",
        akzent: "als nur Regen abhalten.",
        lead: "Große, meist unverschattete Dachflächen auf Ställen, Scheunen und Maschinenhallen sind ideal für Photovoltaik. Wir prüfen Statik, Schneelast und Dachzustand, planen Eigenverbrauch und Einspeisung – und koordinieren auf Wunsch die Dachsanierung gleich mit.",
        cta: "Stalldach bewerten lassen",
      },
      {
        schluessel: ["milch", "melk", "kuehl", "milchvieh"],
        eyebrow: "Für Milchvieh- und Veredelungsbetriebe",
        titel: "Melken, kühlen, lüften –",
        akzent: "mit Strom vom eigenen Dach.",
        lead: "Melkroboter, Milchkühlung, Lüftung und Fütterung laufen jeden Tag, oft rund um die Uhr. Photovoltaik mit Speicher deckt einen großen Teil dieses Bedarfs direkt – und macht den Hof unabhängiger von Strompreisen.",
        cta: "Eigenverbrauch berechnen lassen",
      },
    ],
  },

  gewerbe: {
    standard: {
      eyebrow: "Für Gewerbe, Industrie & Handel in Österreich",
      titel: "Solarstrom, der zum",
      akzent: "Lastgang Ihres Betriebs passt.",
      lead: "Photovoltaik auf Hallen- und Bürodächern, Gewerbespeicher gegen Lastspitzen, Ladeinfrastruktur für die E-Flotte und eigene Regelungstechnik: Wir legen Anlagen nach Ihren Viertelstundenwerten aus – nicht nach der Dachfläche.",
      cta: "Lastgang auswerten lassen",
    },
    varianten: [
      {
        schluessel: ["speicher", "peak", "lastspitze", "leistungspreis"],
        eyebrow: "Gewerbespeicher & Peak Shaving",
        titel: "Lastspitzen kappen,",
        akzent: "Leistungspreis senken.",
        lead: "Bei gemessener Leistung verrechnet der Netzbetreiber in Österreich den Mittelwert der höchsten Viertelstunde jedes Monats. Ein Gewerbespeicher mit Lastmanagement glättet diese Spitzen – und verschiebt Solarüberschüsse in Abend- und Nachtschicht.",
        cta: "Lastgang auswerten lassen",
      },
      {
        schluessel: ["flotte", "laden", "ladepark", "eflotte", "fuhrpark"],
        eyebrow: "E-Flotte & Ladeinfrastruktur",
        titel: "Laden Sie Ihre Flotte",
        akzent: "mit Strom vom eigenen Dach.",
        lead: "Dienstwagen und Transporter tagsüber mit Solarstrom laden ist einer der wirksamsten Hebel für den Eigenverbrauch. Wir planen Photovoltaik, Ladepunkte und Lastmanagement als ein System – passend zu Netzanschluss und Schichtplan.",
        cta: "Flotten-Konzept anfragen",
      },
      {
        schluessel: ["halle", "logistik", "lager", "produktion", "industrie", "kuehlhaus"],
        eyebrow: "Hallendächer, Produktion & Logistik",
        titel: "Ihr Hallendach ist",
        akzent: "ungenutztes Kapital.",
        lead: "Produktions-, Logistik- und Kühlhallen verbinden große Dachflächen mit hohem Tagverbrauch. Wir prüfen Statik, Schneelast und Brandschutz, legen die Anlage nach dem Lastgang aus und planen Netzanschluss, Reststromvermarktung und Monitoring.",
        cta: "Hallendach prüfen lassen",
      },
      {
        schluessel: ["handwerk", "werkstatt", "betrieb", "kmu"],
        eyebrow: "Für Handwerk & Mittelstand",
        titel: "Energiekosten runter,",
        akzent: "Planbarkeit rauf.",
        lead: "Werkstatt, Büro und Maschinen laufen tagsüber – genau dann, wenn die Sonne scheint. Eine eigene PV-Anlage senkt die Stromkosten dauerhaft, ist über den Investitionsfreibetrag steuerlich begünstigt und zeigt Kunden, dass Ihr Betrieb vorausdenkt.",
        cta: "Kostenlos beraten lassen",
      },
    ],
  },

  freiflaeche: {
    standard: {
      eyebrow: "Freiflächen-Photovoltaik in Österreich",
      titel: "Solarparks ab 500 kWp –",
      akzent: "geplant und gebaut, wie wir selbst betreiben würden.",
      lead: "Von der Flächenprüfung über Widmung, Netzanschluss auf Netzebene 5 oder 4 und Umspannwerk bis zu Parkregler, SCADA und Vermarktung: Die Gründer von Ökovolt betreiben seit 2012 eigene Solarparks – so planen wir auch Ihren.",
      cta: "Fläche prüfen lassen",
    },
    varianten: [
      {
        schluessel: ["pacht", "grundeigentuemer", "flaeche", "grund"],
        eyebrow: "Für Grundeigentümer",
        titel: "Ihre Fläche als",
        akzent: "Solarpark verpachten.",
        lead: "Deponien, Schottergruben, Gewerbebrachen oder Flächen entlang von Autobahn und Bahn können als Solarpark eine langfristig planbare Pacht bringen. Wir prüfen Widmungschancen, Netzanschluss und Ökologie – bevor Sie sich binden.",
        cta: "Fläche kostenlos bewerten",
      },
    ],
  },

  agripv: {
    standard: {
      eyebrow: "Agri-PV in Österreich",
      titel: "Ernten Sie doppelt –",
      akzent: "Strom und Ertrag auf derselben Fläche.",
      lead: "Vertikal bifazial zwischen Grünland- und Ackerstreifen, hoch aufgeständert über Obst, Wein und Beeren oder nachgeführt: Agri-PV erhält im EAG einen Zuschlag von 30 % auf den Investitionszuschuss – wenn die landwirtschaftliche Nutzung nachweislich im Vordergrund bleibt.",
      cta: "Agri-PV-Fläche prüfen lassen",
    },
    varianten: [
      {
        schluessel: ["obst", "wein", "beeren", "sonderkultur", "hagel"],
        eyebrow: "Agri-PV für Sonderkulturen",
        titel: "Dach über der Kultur –",
        akzent: "Strom unter freiem Himmel.",
        lead: "Hoch aufgeständerte Modulreihen über Apfel, Beeren oder Wein können Sonnenbrand und Starkregen abmildern und liefern Strom für Kühlung und Bewässerung. Was sie beim Hagel leisten – und was nicht –, sagen wir Ihnen offen.",
        cta: "Kultur und Fläche besprechen",
      },
    ],
  },

  tourismus: {
    standard: {
      eyebrow: "Hotellerie, Thermen & Bergbahnen",
      titel: "Gäste kommen wegen der Natur –",
      akzent: "Ihr Strom kann von dort kommen.",
      lead: "Photovoltaik für Hotels, Thermen, Bergbahnen und Skigebiete: Küche, Kühlung, Wellness, Lifte und Beschneiung brauchen viel Strom. Wir planen alpin – mit Schneelast, Speicher, Gäste-Ladestationen und einer Geschichte, die Sie erzählen können.",
      cta: "Betrieb bewerten lassen",
    },
    varianten: [
      {
        schluessel: ["seilbahn", "bergbahn", "lift", "skigebiet", "beschneiung"],
        eyebrow: "Für Bergbahnen & Skigebiete",
        titel: "Photovoltaik am Berg –",
        akzent: "wo die Sonne am längsten scheint.",
        lead: "Tal- und Bergstationen, Garagen, Fassaden und Hangflächen bieten Platz für Photovoltaik mit hoher Einstrahlung und Schneereflexion. Wir planen für Schneelastzonen, Netzanschluss am Berg und den Lastgang von Liften und Beschneiung.",
        cta: "Standort am Berg prüfen",
      },
    ],
  },

  speicher: {
    standard: {
      eyebrow: "Gewerbespeicher in Österreich",
      titel: "Speicher, die sich",
      akzent: "mehrfach bezahlt machen.",
      lead: "Peak Shaving gegen den Leistungspreis, mehr Eigenverbrauch, Ersatzstrom bei Netzausfall und Handel mit dem Spotpreis der Gebotszone Österreich: Wir dimensionieren Gewerbespeicher aus Ihrem Lastgang – und rechnen jeden Nutzen einzeln aus.",
      cta: "Lastgang auswerten lassen",
    },
    varianten: [],
  },

  laden: {
    standard: {
      eyebrow: "Ladeinfrastruktur für Unternehmen",
      titel: "Laden, wo geparkt wird –",
      akzent: "mit Strom vom eigenen Dach.",
      lead: "Firmenflotte, Mitarbeiter- und Kundenparkplatz, Lkw-Depot: Wir planen AC- und DC-Ladepunkte mit Lastmanagement, PV-Überschussladen und eichrechtskonformer Abrechnung – dimensioniert für Ihren Netzanschluss und vorbereitet auf die nächste Ausbaustufe.",
      cta: "Ladekonzept anfragen",
    },
    varianten: [],
  },

  energiegemeinschaften: {
    standard: {
      eyebrow: "Energiegemeinschaften nach EAG & ElWG",
      titel: "Strom teilen –",
      akzent: "mit Nachbarn, Betrieben und der Gemeinde.",
      lead: "Erneuerbare-Energie-Gemeinschaft, Bürgerenergiegemeinschaft oder gemeinschaftliche Erzeugungsanlage: Wir planen und bauen die Anlage, klären das passende Modell mit Ihnen und dem Netzbetreiber und binden ein Abrechnungssystem an – für Gemeinden, Betriebe und Private.",
      cta: "Energiegemeinschaft besprechen",
    },
    varianten: [],
  },

  gemeinden: {
    standard: {
      eyebrow: "Für Gemeinden, Länder & Stadtwerke",
      titel: "Die Energiewende vor Ort –",
      akzent: "planbar und vergabesicher umgesetzt.",
      lead: "Photovoltaik auf Schulen, Bauhöfen, Kläranlagen und Freibädern, Energiegemeinschaften der Gemeinde, Ladeinfrastruktur und Freiflächen: Wir planen, bauen und betreuen Anlagen, die Gemeindebudgets entlasten – als bevorzugter PV-Errichter des Salzburg AG Konzerns.",
      cta: "Beratungstermin vereinbaren",
    },
    varianten: [],
  },
};

const normal = (v) =>
  String(Array.isArray(v) ? v[0] : v || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 120);

/** Variante für eine Zielgruppe anhand der (awaited) searchParams. */
export function zielgruppenVariante(gruppe, params = {}) {
  const g = ZIELGRUPPEN[gruppe];
  const suche = ["utm_term", "utm_content", "utm_campaign"].map((k) => normal(params?.[k])).filter(Boolean);
  if (!suche.length) return { ...g.standard, id: "standard" };
  for (const text of suche) {
    const v = g.varianten.find((x) => x.schluessel.some((s) => text.includes(s)));
    if (v) return { ...v, id: v.schluessel[0] };
  }
  return { ...g.standard, id: "standard" };
}
