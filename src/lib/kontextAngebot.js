// Kontextbezogenes Angebot: Je nach Seite öffnet „Angebot anfragen“ den Konfigurator gleich mit dem
// passenden Objekt (?objekt=…). Genutzt von der mobilen Handlungsleiste (MobileCta) und dem Seitenkopf
// (navbar.js). Die Objekt-Kennungen entsprechen OBJEKTE bzw. OBJEKT_ALIAS im Konfigurator
// (src/components/Angebot/Konfigurator.js; „agri“ wird dort zu „freiflaeche“).

/** Reihenfolge = Priorität: der erste passende Eintrag gewinnt. */
export const KONTEXT_OBJEKTE = [
  { praefix: "/gewerbespeicher", objekt: "gewerbe" },
  { praefix: "/gewerbe", objekt: "gewerbe", auchVarianten: true }, // /gewerbe, /gewerbe/…, /gewerbe-…
  { praefix: "/ladeinfrastruktur", objekt: "gewerbe" },
  { praefix: "/landwirtschaft", objekt: "landwirtschaft" },
  { praefix: "/agri-pv", objekt: "agri" },
  { praefix: "/freiflaechen-photovoltaik", objekt: "agri" },
  { praefix: "/kommunen", objekt: "gemeinde" },
  { praefix: "/hotellerie-tourismus", objekt: "hotellerie" },
  { praefix: "/chalets", objekt: "chalet" },
];

const ANGEBOT = "/angebot";

function passt(pfad, e) {
  if (pfad === e.praefix || pfad.startsWith(`${e.praefix}/`)) return true;
  // „/gewerbe*“: auch Geschwister wie /gewerbe-photovoltaik
  return Boolean(e.auchVarianten) && pfad.startsWith(`${e.praefix}-`);
}

/** Objekt-Kennung zur Seite oder null (z. B. Startseite, Ratgeber). */
export function objektFuerPfad(pfad) {
  if (typeof pfad !== "string" || !pfad) return null;
  const sauber = pfad.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const treffer = KONTEXT_OBJEKTE.find((e) => passt(sauber, e));
  return treffer ? treffer.objekt : null;
}

/** Link zum Konfigurator, auf Branchenseiten mit vorgewähltem Objekt. */
export function angebotHref(pfad) {
  const objekt = objektFuerPfad(pfad);
  return objekt ? `${ANGEBOT}?objekt=${objekt}` : ANGEBOT;
}
