// src/app/photovoltaik/[stadt]/weiter.js
//
// „Weiter für <Stadt>“ – reine Auswahl der nächsten Schritte je Standortseite (kein React):
//  1. passender Netzanmeldungs-Leitfaden /netzanmeldung/<betreiber> (nur wenn der Slug in
//     src/data/netzbetreiber.js existiert; sonst Hub /netzanmeldung. Seit C06 liegen alle zehn
//     Leitfäden vor (inkl. KNG-Kärnten Netz, LINZ NETZ, TINETZ, Netz Burgenland, Vorarlberg Netz)),
//  2. in alpinen Lagen /schneelast und der Schneelast-Ratgeber,
//  3. zwei thematische Ratgeber aus den Schwerpunkten des Orts.
// Die Texte tragen Ortsname, Netzbetreiber und PLZ in fast jedem Satz, damit sich die Blöcke der
// 37 Orte unterscheiden (Jaccard der 5-Wort-Folgen < 0,35; Test scripts/regionen-seo.test.mjs).

import { BETREIBER_SLUGS } from "@/data/netzbetreiber";

export const NETZ_HUB = "/netzanmeldung";
export const SCHNEELAST_PFAD = "/schneelast";
export const SCHNEELAST_RATGEBER = "schneelast-photovoltaik";

/** Kurzname/Name eines Netzbetreibers → Slug des Leitfadens (Slugs wie in src/data/netzbetreiber.js). */
const NETZ_SLUGS = [
  [/wiener netze/i, "wiener-netze"],
  [/netz n(ö|iederösterreich)/i, "netz-niederoesterreich"],
  [/netz o(ö|berösterreich)/i, "netz-oberoesterreich"],
  [/energienetze steiermark/i, "energienetze-steiermark"],
  [/salzburg netz/i, "salzburg-netz"],
  [/k(ng|ärnten netz)/i, "kng-kaernten-netz"],
  [/linz netz/i, "linz-netz"],
  [/tinetz/i, "tinetz"],
  [/netz burgenland/i, "netz-burgenland"],
  [/vorarlberger energienetze|vorarlberg netz/i, "vorarlberg-netz"],
];

/** Alle Leitfaden-Slugs, die zum Netzbetreiber-Text passen (Doppelnennungen wie „Netz NÖ / Wiener Netze“). */
export function netzSlugsFuer(netz) {
  const text = `${netz?.kurz || ""} ${netz?.name || ""}`;
  return NETZ_SLUGS.filter(([re]) => re.test(text)).map(([, slug]) => slug);
}

/** Themenregeln: Stichwort in Schwerpunkt-Titel/-Text → Ratgeber-Slug (Reihenfolge = Priorität). */
const THEMEN = [
  [/hotel|tourismus|bergbahn|chalet|saison|g[äa]ste/i, "photovoltaik-hotel"],
  [/parkpl|carport/i, "solarcarport"],
  [/gemeinschaftliche erzeugung/i, "gemeinschaftliche-erzeugungsanlage"],
  [/solarpflicht/i, "solarpflicht-bundeslaender"],
  [/landwirtschaft|weinbau|weing|kellerei|gärtnerei|glash|agrar|hof/i, "agri-pv-oesterreich"],
  [/lebensmittel|kühl|kälte|molkerei/i, "stromspeicher-groesse"],
  [/logistik|großhandel|fachm|outlet|einkaufsz|handel/i, "photovoltaik-flachdach"],
  [/dauerlast|schicht|energieintensiv|grundlast|hoher eigenverbrauch|hohe last/i, "peak-shaving-leistungspreis"],
  [/einspeise|netzkapazit|mittelspannung|netzqualit|netzebene|größenklasse|netzbetreiber|netzgebiet|netzanschluss|netzanmeldung/i, "tor-erzeuger-netzanschluss"],
  [/öffentlich|verwaltung|schule|institution|gemeinde|amt/i, "photovoltaik-gemeinde"],
  [/flachd|aufständer/i, "photovoltaik-flachdach"],
  [/altstadt|schutzzone|welterbe|ortsbild|bauordnung|meldepflicht|mitteilung|baubewilligung|bauanzeige|bewilligung|m² frei/i, "photovoltaik-genehmigung"],
  [/hochwasser|föhn|sturm|hagel/i, "photovoltaik-versicherung"],
  [/faserzement|asbest|neubau/i, "photovoltaik-ablauf"],
  [/industrie|produktion|fertigung|metall|stahl|chemie|pharma|maschinenbau|elektronik|hightech|hochtechnologie|automotive|zulieferer|holz|papier|werksh|eigenstrom/i, "photovoltaik-gewerbe"],
  [/wartung|service|fern/i, "photovoltaik-wartungsvertrag"],
];
const STANDARD = ["photovoltaik-gewerbe", "photovoltaik-amortisation", "eigenverbrauch-erhoehen"];

/**
 * Thematische Ratgeber mit dem auslösenden Schwerpunkt: [{ slug, schwerpunkt }] (schwerpunkt =
 * Titel des Schwerpunkts, der die Regel getroffen hat; null bei Standard-Ratgebern). Reihenfolge der
 * Schwerpunkte zählt – so steht „Passend zu …“ immer beim Schwerpunkt, der den Ratgeber ausgelöst hat.
 */
export function themenRatgeberMitAnlass(region, anzahl = 2) {
  const treffer = [];
  const merke = (slug, schwerpunkt = null) => {
    if (slug && slug !== SCHNEELAST_RATGEBER && !treffer.some((t) => t.slug === slug)) treffer.push({ slug, schwerpunkt });
  };
  for (const s of region.schwerpunkte || []) {
    const text = `${s.titel} ${s.text}`;
    const regel = THEMEN.find(([re]) => re.test(text));
    if (regel) merke(regel[1], s.titel);
  }
  for (const s of region.schwerpunkte || []) {
    for (const [re, slug] of THEMEN) if (re.test(`${s.titel} ${s.text}`)) merke(slug, s.titel);
  }
  for (const slug of STANDARD) merke(slug);
  return treffer.slice(0, anzahl);
}

/** Zwei thematische Ratgeber-Slugs aus den Schwerpunkten (Reihenfolge der Schwerpunkte zählt). */
export function themenRatgeber(region, anzahl = 2) {
  return themenRatgeberMitAnlass(region, anzahl).map((t) => t.slug);
}

/**
 * Block „Weiter für <Stadt>“. region: Ergebnis von regionFuer(slug). titelFuer: slug → Titel des
 * Ratgebers (z. B. artikelNachSlug(slug)?.title); ohne Titel bleibt der Slug als Beschriftung.
 * vorhandeneSlugs: existierende Netzanmeldungs-Leitfäden (Standard: BETREIBER_SLUGS).
 */
export function weiterFuerStadt(region, { titelFuer = () => null, vorhandeneSlugs = BETREIBER_SLUGS } = {}) {
  const name = region.kurzname || region.name;
  const netz = region.fakten?.netzbetreiber || {};
  const netzName = netz.kurz || netz.name || "den Verteilnetzbetreiber";
  const plz = region.plz ? `PLZ ${region.plz}` : region.bezirk;
  const slugs = netzSlugsFuer(netz);
  const leitfaden = slugs.find((s) => vorhandeneSlugs.includes(s)) || null;
  const fehlend = slugs.filter((s) => !vorhandeneSlugs.includes(s));

  const schritte = [];

  schritte.push({
    id: "netz",
    icon: "netz",
    titel: leitfaden ? `Netzanmeldung bei ${netzName} für ${name}` : `Netzanmeldung in ${name} (${netzName})`,
    text: leitfaden
      ? `${netzName} ist laut E-Control-Tarifkalkulator für ${plz} in ${name} zuständig. Unser Leitfaden zeigt Netzanfrage, Netzzugang und Fertigmeldung bei ${netzName} Schritt für Schritt.`
      : `Für ${plz} in ${name} nennt der E-Control-Tarifkalkulator ${netzName}. Die Netzanfrage bei ${netzName} übernehmen wir; der allgemeine Ablauf steht im Netzanmeldungs-Hub.`,
    href: leitfaden ? `${NETZ_HUB}/${leitfaden}` : NETZ_HUB,
    label: leitfaden ? `Leitfaden ${netzName}` : "Netzanmeldung: Ablauf und Unterlagen",
    extern: !leitfaden && netz.url ? { href: netz.url, label: `Website ${netzName}` } : null,
  });

  if (region.alpin) {
    schritte.push({
      id: "schnee",
      icon: "schnee",
      titel: `Schneelast in ${name} auf ${region.pvgis?.hoehe_m ?? "–"} m Seehöhe`,
      text: region.schnee
        ? // Einleitender Satz vorweg: übernommene Sätze wie „Zusätzlich prüfen wir …“ brauchen einen Bezug.
          `Die charakteristische Schneelast für Ihre Adresse in ${name} prüfen wir vor jedem Angebot. ${region.schnee} Richtwerte für ${name} und die Bezirkshauptorte stehen im Schneelast-Hub.`
        : `${name} liegt in alpiner Lage; die charakteristische Schneelast für Ihre Adresse in ${name} prüfen wir vor jedem Angebot. Richtwerte stehen im Schneelast-Hub.`,
      href: SCHNEELAST_PFAD,
      label: `Schneelast-Richtwerte ${region.bundesland}`,
      ratgeber: { slug: SCHNEELAST_RATGEBER, titel: titelFuer(SCHNEELAST_RATGEBER) || "Schneelast und Photovoltaik", href: `/ratgeber/${SCHNEELAST_RATGEBER}` },
    });
  }

  const themen = themenRatgeberMitAnlass(region, 2).map(({ slug, schwerpunkt }, i) => ({
    id: `ratgeber-${i + 1}`,
    icon: "ratgeber",
    slug,
    titel: titelFuer(slug) || slug,
    text: schwerpunkt ? `Passend zu ${schwerpunkt}: Ratgeber für Projekte in ${name}.` : `Ratgeber für Betriebe in ${name}, unabhängig vom Schwerpunkt des Orts.`,
    href: `/ratgeber/${slug}`,
    label: "Ratgeber lesen",
  }));

  return {
    name,
    ueberschrift: `Weiter für ${name}`,
    lead: `Die nächsten Schritte für ein PV-Projekt in ${name}: Netzbetreiber ${netzName} für ${plz}${region.alpin ? ", Schneelast in alpiner Lage" : ""} und Ratgeber zu ${region.schwerpunkte?.[0]?.titel || "Ihren Schwerpunkten"}.`,
    schritte,
    themen,
    leitfaden,
    fehlendeLeitfaeden: fehlend,
  };
}

/** Gesamter Text des Blocks (für die Ähnlichkeitsmessung im Test). */
export function blockText(block) {
  const teile = [block.ueberschrift, block.lead];
  for (const s of block.schritte) teile.push(s.titel, s.text, s.label, s.ratgeber?.titel);
  for (const t of block.themen) teile.push(t.titel, t.text);
  return teile.filter(Boolean).join(" ");
}

/** Jaccard-Ähnlichkeit der 5-Wort-Folgen zweier Texte (0 … 1). */
export function jaccard5(a, b) {
  const folgen = (t) => {
    const w = String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(/\s+/);
    const s = new Set();
    for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(" "));
    return s;
  };
  const A = folgen(a);
  const B = folgen(b);
  if (!A.size && !B.size) return 0;
  let schnitt = 0;
  for (const x of A) if (B.has(x)) schnitt++;
  return schnitt / (A.size + B.size - schnitt);
}
