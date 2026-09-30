// src/lib/bundesland/auswertung.js
//
// Reine Rechen- und Zuordnungslogik für die Bundesland-Hubseiten /photovoltaik-bundesland/[land].
// Keine Imports mit Seiteneffekten, kein fs – läuft in Node-Tests, auf dem Server und im Browser.
// Die Daten kommen ausschließlich aus dem Repo (Regionalseiten, PVGIS-Werte, Förder- und
// Netzbetreiberdaten, Referenzkunden) und werden in src/lib/bundesland/daten.js zusammengeführt.

/** Die neun Bundesländer in amtlicher Reihenfolge – Slugs wie in src/data/bundeslaender.js. */
export const LAENDER = [
  { slug: "burgenland", name: "Burgenland", imLand: "im Burgenland", kuerzel: "Bgld." },
  { slug: "kaernten", name: "Kärnten", imLand: "in Kärnten", kuerzel: "Ktn." },
  { slug: "niederoesterreich", name: "Niederösterreich", imLand: "in Niederösterreich", kuerzel: "NÖ" },
  { slug: "oberoesterreich", name: "Oberösterreich", imLand: "in Oberösterreich", kuerzel: "OÖ" },
  { slug: "salzburg", name: "Salzburg", imLand: "im Land Salzburg", kuerzel: "Sbg." },
  { slug: "steiermark", name: "Steiermark", imLand: "in der Steiermark", kuerzel: "Stmk." },
  { slug: "tirol", name: "Tirol", imLand: "in Tirol", kuerzel: "T" },
  { slug: "vorarlberg", name: "Vorarlberg", imLand: "in Vorarlberg", kuerzel: "Vbg." },
  { slug: "wien", name: "Wien", imLand: "in Wien", kuerzel: "W" },
];

export const PFAD = "/photovoltaik-bundesland";
export const landPfad = (slug) => `${PFAD}/${slug}`;
export const landFuerSlug = (slug) => LAENDER.find((l) => l.slug === slug) ?? null;

/* ------------------------------------------------------------------ Zahlformat */

/**
 * Zahl im österreichischen Format ohne Intl (identisch auf Server und Client, keine
 * Hydration-Unterschiede): Tausenderpunkt, Dezimalkomma, feste Nachkommastellen.
 */
export function zahl(n, stellen = 0) {
  const w = n == null || n === "" ? NaN : Number(n);
  if (!Number.isFinite(w)) return "–";
  const text = Math.abs(w).toFixed(stellen);
  const [ganz, rest] = text.split(".");
  const negativ = w < 0 && Number(text) !== 0;
  return `${negativ ? "−" : ""}${ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${rest ? `,${rest}` : ""}`;
}

/** ISO-Datum (JJJJ-MM-TT) → TT.MM.JJJJ, ohne Date-Objekt (keine Zeitzonen-Effekte). */
export function datumText(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/* ------------------------------------------------------------------ Ertrag */

const mittel = (werte) => {
  const zahlen = werte.filter((w) => Number.isFinite(w));
  return zahlen.length ? zahlen.reduce((s, w) => s + w, 0) / zahlen.length : null;
};

/** Anteil November–Februar am Jahresertrag (Süd, 35°) in Prozent, gerundet. */
export function winteranteil(pvgis) {
  const monate = pvgis?.monate_sued35;
  if (!Array.isArray(monate) || monate.length !== 12 || !(pvgis.sued35_kwh_kwp > 0)) return null;
  const winter = [0, 1, 10, 11].reduce((s, i) => s + monate[i], 0);
  return Math.round((winter / pvgis.sued35_kwh_kwp) * 100);
}

export const AUSRICHTUNGEN = [
  { id: "sued35", feld: "sued35_kwh_kwp", label: "Süd, 35°", kurz: "Süddach" },
  { id: "ostwest15", feld: "ostwest15_kwh_kwp", label: "Ost/West, 15°", kurz: "Ost-West" },
  { id: "flach10", feld: "flach10_kwh_kwp", label: "Flachdach, 10°", kurz: "Flachdach" },
];

/**
 * Ertragsstatistik über die Orte eines Landes (ungewichtetes Mittel der Regionalseiten).
 * orte: [{ slug, name, pvgis: { sued35_kwh_kwp, ostwest15_kwh_kwp, flach10_kwh_kwp, monate_sued35 } }]
 * Rückgabe null bei leerer Liste, sonst { anzahl, mittel: {sued35, ostwest15, flach10},
 * min, max (je { slug, name, wert } für Süd 35°), spanneProzent, winteranteil, monate[12] }.
 */
export function ertragStatistik(orte) {
  const mit = (orte || []).filter((o) => Number.isFinite(o?.pvgis?.sued35_kwh_kwp));
  if (mit.length === 0) return null;
  const mittelwerte = {};
  for (const a of AUSRICHTUNGEN) {
    const m = mittel(mit.map((o) => o.pvgis[a.feld]));
    mittelwerte[a.id] = m == null ? null : Math.round(m);
  }
  const sortiert = [...mit].sort((a, b) => a.pvgis.sued35_kwh_kwp - b.pvgis.sued35_kwh_kwp);
  const kurz = (o) => ({ slug: o.slug, name: o.kurzname || o.name, wert: o.pvgis.sued35_kwh_kwp });
  const min = kurz(sortiert[0]);
  const max = kurz(sortiert[sortiert.length - 1]);
  const mitMonaten = mit.filter((o) => Array.isArray(o.pvgis.monate_sued35) && o.pvgis.monate_sued35.length === 12);
  const monate = mitMonaten.length
    ? Array.from({ length: 12 }, (_, i) => Math.round(mittel(mitMonaten.map((o) => o.pvgis.monate_sued35[i]))))
    : null;
  const winter = mittel(mit.map((o) => winteranteil(o.pvgis)));
  return {
    anzahl: mit.length,
    mittel: mittelwerte,
    min,
    max,
    spanneProzent: min.wert > 0 ? Math.round((max.wert / min.wert - 1) * 100) : 0,
    winteranteil: winter == null ? null : Math.round(winter),
    monate,
  };
}

/** Jahresertrag einer Anlage in kWh (auf 100 kWh gerundet). */
export function jahresertrag(kwhJeKwp, kwp) {
  const w = Number(kwhJeKwp) * Number(kwp);
  return Number.isFinite(w) && w > 0 ? Math.round(w / 100) * 100 : 0;
}

/* ------------------------------------------------------------------ Schneelast */

/**
 * Spanne der Schneelast-Richtwerte über Einträge mit Feld `sk` (kN/m²).
 * Rückgabe null, wenn kein Eintrag einen Wert hat; sonst { min, max, anzahl } mit den Einträgen.
 */
export function skSpanne(eintraege) {
  const mit = (eintraege || []).filter((e) => Number.isFinite(e?.sk));
  if (mit.length === 0) return null;
  const sortiert = [...mit].sort((a, b) => a.sk - b.sk);
  return { min: sortiert[0], max: sortiert[sortiert.length - 1], anzahl: mit.length };
}

/* ------------------------------------------------------------------ Netzbetreiber */

/**
 * Verteilnetzbetreiber der Orte eines Landes, gruppiert nach Name (so wie auf den Regionalseiten
 * recherchiert). verzeichnis: [{ slug, name, kurz }] aus src/data/netzbetreiber.js – ist ein
 * Betreiber dort beschrieben, steht er in `anmeldung` (Slug + Kurzname der /netzanmeldung-Seite),
 * bei Doppelangaben wie „Netz Niederösterreich GmbH / Wiener Netze GmbH“ in Nennungsreihenfolge.
 * Rückgabe: [{ name, kurz, url, orte: [{ slug, name }], anmeldung: [{ slug, kurz }] }] – meiste Orte zuerst.
 */
export function netzbetreiberGruppen(orte, verzeichnis = []) {
  const gruppen = new Map();
  for (const o of orte || []) {
    const n = o?.fakten?.netzbetreiber;
    if (!n?.name) continue;
    if (!gruppen.has(n.name)) gruppen.set(n.name, { name: n.name, kurz: n.kurz || null, url: n.url || null, orte: [], anmeldung: [] });
    gruppen.get(n.name).orte.push({ slug: o.slug, name: o.kurzname || o.name });
  }
  for (const g of gruppen.values()) {
    g.anmeldung = verzeichnis
      .filter((b) => b?.name && b?.slug && g.name.includes(b.name))
      .sort((a, b) => g.name.indexOf(a.name) - g.name.indexOf(b.name))
      .map((b) => ({ slug: b.slug, kurz: b.kurz || b.name }));
  }
  return [...gruppen.values()].sort((a, b) => b.orte.length - a.orte.length || a.name.localeCompare(b.name, "de"));
}

/* ------------------------------------------------------------------ Referenzen */

// Landesname als ganzes Wort (Buchstaben-Grenzen inkl. Umlaute), damit „Wiener Neustadt“ nicht
// als Wien zählt.
const LAND_MUSTER = LAENDER.map((l) => ({ slug: l.slug, re: new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${l.name}($|[^A-Za-zÄÖÜäöüß])`) }));

/**
 * Bundesland aus einer Ortsangabe wie „Steyregg, Oberösterreich“, „Hof bei Salzburg“ oder „Wien“.
 * Maßgeblich ist das zuerst genannte Bundesland (bei „Pasching, Oberösterreich (Standort);
 * Firmensitz Guntramsdorf“ also Oberösterreich). Ohne erkennbares Land → null (nicht raten).
 * „Wiener Neustadt“ ist NICHT Wien (Wortgrenze).
 */
export function landAusOrt(text) {
  const t = String(text || "");
  let bester = null;
  for (const m of LAND_MUSTER) {
    const treffer = m.re.exec(t);
    if (treffer && (bester == null || treffer.index < bester.index)) bester = { slug: m.slug, index: treffer.index };
  }
  return bester ? bester.slug : null;
}

/** Ortsname ohne Landesangabe und Klammerzusätze: „Tragwein, Oberösterreich (Firmensitz)“ → „Tragwein“. */
export function ortKurz(text) {
  return String(text || "")
    .split(/[;,]/)[0]
    .replace(/\(.*?\)/g, "")
    .trim();
}

/**
 * Referenzprojekte, die sich einem Bundesland belegbar zuordnen lassen.
 * 1. Ort des Projekts selbst (Backoffice-Feld „ort“), wenn daraus das Land hervorgeht oder der Ort
 *    eine Regionalseite hat (ortZuLand: Map Ortsname in Kleinbuchstaben → Landslug) → quelle "anlage".
 * 2. sonst Sitz des Kunden laut src/data/kunden.js (Impressum-Recherche) → quelle "kunde".
 * Nichts wird geschätzt: ohne Ort bzw. Kundeneintrag fällt das Projekt heraus.
 * Je Kunde (gleiche Firma) nur das größte Projekt; sortiert nach Leistung absteigend.
 */
export function referenzenFuerLand(land, projekte, kunden = {}, ortZuLand = new Map()) {
  const jeFirma = new Map();
  for (const p of projekte || []) {
    if (!p?.slug) continue;
    const ort = String(p.ort || "").trim();
    let zuordnung = null;
    if (ort) {
      const l = landAusOrt(ort) || ortZuLand.get(ort.toLowerCase()) || null;
      if (l) zuordnung = { land: l, ort: ortKurz(ort), quelle: "anlage" };
    }
    const kunde = kunden[p.slug] || (p.websiteName ? kunden[p.websiteName] : null) || null;
    if (!zuordnung && kunde?.ort) {
      const l = landAusOrt(kunde.ort);
      if (l) zuordnung = { land: l, ort: ortKurz(kunde.ort), quelle: "kunde" };
    }
    if (!zuordnung || zuordnung.land !== land) continue;
    const firma = kunde?.firma || p.titel || p.slug;
    const eintrag = { projekt: p, firma, branche: kunde?.branche || null, ort: zuordnung.ort, quelle: zuordnung.quelle };
    const alt = jeFirma.get(firma);
    if (!alt || (p.kwp || 0) > (alt.projekt.kwp || 0)) jeFirma.set(firma, eintrag);
  }
  return [...jeFirma.values()].sort((a, b) => (b.projekt.kwp || 0) - (a.projekt.kwp || 0) || a.firma.localeCompare(b.firma, "de"));
}

/* ------------------------------------------------------------------ SEO */

/** Seitentitel ≤ 60 Zeichen: längste passende Variante. */
export function seoTitel(name) {
  const varianten = [
    `Photovoltaik ${name}: Standorte, Ertrag & Förderung | Ökovolt`,
    `Photovoltaik ${name}: Ertrag, Förderung, Netz | Ökovolt`,
    `Photovoltaik ${name}: Ertrag & Förderung | Ökovolt`,
    `PV ${name}: Ertrag & Förderung | Ökovolt`,
  ];
  return varianten.find((t) => t.length <= 60) || varianten[varianten.length - 1];
}
