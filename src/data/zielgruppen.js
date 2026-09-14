// Zielgruppen-Seiten (/landwirtschaft, /gewerbe): Überschriften-Varianten je Kampagne.
//
// Kommt ein Besucher über einen Link mit utm_term, utm_campaign oder utm_content,
// wird die erste Variante gewählt, deren Schlüsselwort darin vorkommt – so passt die
// Überschrift zur Anzeige („Message Match“). Ohne Parameter gilt die Standardvariante.
// Die Canonical-URL bleibt immer ohne Parameter, Suchmaschinen sehen nur den Standard.
//
// Beispiel: /gewerbe?utm_source=linkedin&utm_medium=paid_social&utm_campaign=gewerbe_q4&utm_term=speicher

export const ZIELGRUPPEN = {
  landwirtschaft: {
    standard: {
      eyebrow: "Für landwirtschaftliche Betriebe",
      titel: "Solarstrom vom Hof –",
      akzent: "für Stall, Scheune und Acker.",
      lead: "Photovoltaik auf Hof- und Hallendächern, Agri-PV über Sonderkulturen und Weideflächen, Speicher für Melk- und Kühltechnik: Wir planen Anlagen, die zum Betrieb passen – und die Fläche landwirtschaftlich nutzbar lassen.",
      cta: "Hofdach bewerten lassen",
    },
    varianten: [
      {
        schluessel: ["agri", "freiflaeche", "acker", "sonderkultur", "obst", "beeren", "weide"],
        eyebrow: "Agri-PV nach DIN SPEC 91434",
        titel: "Ernten Sie doppelt –",
        akzent: "Strom und Ertrag auf derselben Fläche.",
        lead: "Hoch aufgeständert über Obst, Beeren oder Gemüse, bodennah zwischen Reihen auf Acker und Weide: Agri-PV schützt Kulturen vor Hagel und Hitze und bringt ein zweites Standbein – wenn Planung, Genehmigung und Förderfähigkeit von Anfang an stimmen.",
        cta: "Agri-PV-Fläche prüfen lassen",
      },
      {
        schluessel: ["stall", "scheune", "hofdach", "halle", "maschinenhalle", "dach"],
        eyebrow: "Photovoltaik auf Stall & Scheune",
        titel: "Ihr Stalldach kann mehr",
        akzent: "als nur Regen abhalten.",
        lead: "Große, meist unverschattete Dachflächen auf Ställen, Scheunen und Maschinenhallen sind ideal für Photovoltaik. Wir prüfen Statik und Dachzustand, planen Eigenverbrauch und Einspeisung – und koordinieren auf Wunsch die Dachsanierung gleich mit.",
        cta: "Stalldach bewerten lassen",
      },
      {
        schluessel: ["milch", "melk", "kuehl", "milchvieh"],
        eyebrow: "Für Milchvieh- und Veredelungsbetriebe",
        titel: "Melken, kühlen, lüften –",
        akzent: "mit Strom vom eigenen Dach.",
        lead: "Melkroboter, Milchkühlung, Lüftung und Fütterung laufen jeden Tag, oft rund um die Uhr. Photovoltaik mit Speicher deckt einen großen Teil dieses Bedarfs direkt – und macht den Betrieb unabhängiger von Strompreisen.",
        cta: "Eigenverbrauch berechnen lassen",
      },
    ],
  },

  gewerbe: {
    standard: {
      eyebrow: "Für Gewerbe, Handwerk & Industrie",
      titel: "Solarstrom, der zum",
      akzent: "Lastgang Ihres Betriebs passt.",
      lead: "Photovoltaik auf Hallen- und Bürodächern, Gewerbespeicher gegen Lastspitzen, Ladeinfrastruktur für die E-Flotte und Energiemanagement: Wir legen Anlagen nach Ihrem tatsächlichen Verbrauch aus – nicht nach der Dachfläche.",
      cta: "Betrieb bewerten lassen",
    },
    varianten: [
      {
        schluessel: ["speicher", "peak", "lastspitze", "leistungspreis"],
        eyebrow: "Gewerbespeicher & Peak Shaving",
        titel: "Lastspitzen kappen,",
        akzent: "Leistungspreis senken.",
        lead: "Eine einzige Viertelstunde mit hoher Last bestimmt bei RLM-Kunden den Leistungspreis für das ganze Jahr. Ein Gewerbespeicher mit Lastmanagement fängt diese Spitzen ab – und verschiebt Solarüberschüsse in die Abend- und Nachtschicht.",
        cta: "Lastgang auswerten lassen",
      },
      {
        schluessel: ["flotte", "laden", "ladepark", "eflotte", "fuhrpark"],
        eyebrow: "E-Flotte & Ladeinfrastruktur",
        titel: "Tanken Sie Ihre Flotte",
        akzent: "auf dem eigenen Dach.",
        lead: "Dienstwagen und Transporter tagsüber mit Solarstrom laden ist einer der wirksamsten Hebel für den Eigenverbrauch. Wir planen Photovoltaik, Ladepunkte und Lastmanagement als ein System – passend zu Netzanschluss und Schichtplan.",
        cta: "Flotten-Konzept anfragen",
      },
      {
        schluessel: ["halle", "logistik", "lager", "produktion", "industrie"],
        eyebrow: "Hallendächer & Produktion",
        titel: "Ihr Hallendach ist",
        akzent: "ungenutztes Kapital.",
        lead: "Produktions- und Logistikhallen verbinden große Dachflächen mit hohem Tagverbrauch. Wir prüfen Statik und Brandschutz, legen die Anlage nach dem Lastgang aus und planen Netzanschluss, Direktvermarktung und Monitoring.",
        cta: "Hallendach prüfen lassen",
      },
      {
        schluessel: ["handwerk", "werkstatt", "betrieb", "kmu"],
        eyebrow: "Für Handwerk & Mittelstand",
        titel: "Energiekosten runter,",
        akzent: "Planbarkeit rauf.",
        lead: "Werkstatt, Büro und Maschinen laufen tagsüber – genau dann, wenn die Sonne scheint. Eine eigene PV-Anlage senkt die Stromkosten dauerhaft, ist steuerlich abschreibbar und zeigt Kunden, dass Ihr Betrieb vorausdenkt.",
        cta: "Kostenlos beraten lassen",
      },
    ],
  },
};

const normal = (v) =>
  String(Array.isArray(v) ? v[0] : v || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
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
