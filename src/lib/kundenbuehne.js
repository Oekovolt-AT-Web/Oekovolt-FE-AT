// src/lib/kundenbuehne.js
//
// „Kundenbühne“ der Referenzprojekte: Kundenporträt, Projekt-Plakette, Social-Media-Kit
// und ESG-Kurzbericht. Reine Funktionen ohne React und ohne Pfad-Aliase – per Node
// prüfbar und in Server- wie Client-Komponenten nutzbar.
//
// FREIGABEN (Welle A07): Firmenname, Zitat, Logo, Fotos der Anlage, Projekt-Plakette,
// Live-Daten und Messwerte zeigen wir nur mit Freigabe des Kunden. Quelle der Freigabe ist
// der DocType „Referenz Freigabe“ im Backoffice (get_freigaben, Einmal-Link), ersatzweise
// src/data/kunden.js (dort überall false). Fehlt beides oder schlägt das Laden fehl, gilt
// alles als nicht freigegeben.
//
// PROJEKT-PLAKETTE statt „Solar-Siegel“: Die UWG-Novelle zur EmpCo-Richtlinie (EU) 2024/825
// (anwendbar seit 27.09.2026) verbietet Nachhaltigkeitssiegel ohne Zertifizierungssystem.
// Die Plakette ist deshalb eine sachliche Projektangabe („Photovoltaikanlage errichtet von
// Ökovolt Solartechnik GmbH · Jahr · kWp“) ohne Rosette, Prüfzeichen-Look, „zertifiziert“
// oder „grün“. CO₂ erscheint nur mit Messwert der Anlage (quelleErtrag === "anlage"),
// mit Zeitraum und Verweis auf den Rechenweg.
//
// RECHENWEG (auf allen Kundenbühnen-Seiten offengelegt, als Schätzung gekennzeichnet)
//  1. Jahresertrag [kWh] = Nennleistung [kWp] × spezifischer Ertrag [kWh/kWp].
//     Liefert das Backoffice einen Ertrag (Feld „ertrag“), wird dieser verwendet.
//     Sonst 1.050 kWh/kWp – identisch mit ERTRAG_JE_KWP in
//     src/components/Project/projektDaten.js (hier dupliziert, damit die Datei ohne
//     Pfad-Aliase per Node testbar bleibt). Einordnung: IEA PVPS National Survey
//     Report Austria 2024 nennt 1.050 kWh/kWp als Mittel aller österreichischen
//     Anlagen; PVGIS 5.2 liefert für Süd/35° in den Landeshauptstädten
//     1.055–1.242 kWh/kWp (src/data/solarrechner.js).
//  2. Vermiedene CO₂-Emissionen [kg] = Jahresertrag [kWh] × 0,2582 kg/kWh.
//     Substitutionsfaktor für PV-Strom in Österreich, 258,2 g CO₂äqu/kWh –
//     „Innovative Energietechnologien in Österreich – Marktentwicklung 2024“
//     (BMIMI 06/2025), Kap. 7.4, Tab. 34 (Berechnung FH Technikum Wien, Basis
//     E-Control-Betriebsstatistik). Derselbe Faktor wie im Solarrechner und im
//     Gewerbe-PV-Rechner (ANNAHMEN.co2KgProKwh, src/lib/rechner/gewerbepv.js).

import { ANNAHMEN } from "../data/solarrechner.js";

export const ERTRAG_JE_KWP = 1050; // kWh je kWp und Jahr (siehe oben)
export const CO2_KG_PRO_KWH = ANNAHMEN.co2KgProKwh; // 0,2582 kg CO₂äqu je kWh
export const CO2_G_PRO_KWH = Math.round(CO2_KG_PRO_KWH * 10000) / 10; // 258,2

export const QUELLEN = {
  ertrag: {
    titel: "IEA PVPS National Survey Report Austria 2024 (Ø 1.050 kWh/kWp) · PVGIS 5.2 der EU-Kommission (JRC)",
    url: "https://re.jrc.ec.europa.eu/pvg_tools/de/",
  },
  co2: {
    titel: "BMIMI: Innovative Energietechnologien in Österreich – Marktentwicklung 2024 (06/2025), Kap. 7.4, Tab. 34",
    url: "https://nachhaltigwirtschaften.at/de/iea/publikationen/marktstatistik.php",
  },
};

// ---------------------------------------------------------------- Zahlen

const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Leistung für Siegel und Bilder: ab 100 kWp ohne, darunter mit höchstens einer Nachkommastelle */
export function fmtKwp(kwp) {
  if (!(kwp > 0)) return "";
  if (kwp >= 100) return de(Math.round(kwp));
  return de(kwp, Number.isInteger(Math.round(kwp * 10) / 10) ? 0 : 1);
}

/** „ca.“-Werte: ab 1.000 auf Zehner, ab 100 auf Fünfer, ab 10 ganzzahlig, darunter eine Nachkommastelle */
export function fmtCa(wert) {
  if (!(wert > 0)) return "0";
  if (wert >= 1000) return de(Math.round(wert / 10) * 10);
  if (wert >= 100) return de(Math.round(wert / 5) * 5);
  if (wert >= 10) return de(Math.round(wert));
  const r = Math.round(wert * 10) / 10;
  return de(r, Number.isInteger(r) ? 0 : 1);
}

/**
 * Schätzung für Plakette, Social-Kit und ESG-Bericht.
 * @param {object} e
 * @param {number|null} e.kwp         Nennleistung
 * @param {number|null} [e.ertragKwh] Jahresertrag aus dem Backoffice (hat Vorrang; nur mit Freigabe „Messwerte“ übergeben)
 * @param {string|null} [e.zeitraum]  Zeitraum des gemessenen Ertrags, z. B. „2025“ – Pflicht für eine CO₂-Angabe auf der Plakette
 * @returns {null | {kwp, ertragKwh, ertragJeKwp, mwh, co2Kg, co2T, quelleErtrag, zeitraum, texte:{kwp, mwh, co2}}}
 */
export function schaetzung({ kwp, ertragKwh = null, zeitraum = null } = {}) {
  const k = Number(kwp);
  const api = Number(ertragKwh);
  const hatApi = Number.isFinite(api) && api > 0;
  if (!(k > 0) && !hatApi) return null;
  const ertrag = hatApi ? api : k * ERTRAG_JE_KWP;
  const co2Kg = ertrag * CO2_KG_PRO_KWH;
  return {
    kwp: k > 0 ? k : null,
    ertragKwh: ertrag,
    ertragJeKwp: hatApi ? (k > 0 ? ertrag / k : null) : ERTRAG_JE_KWP,
    mwh: ertrag / 1000,
    co2Kg,
    co2T: co2Kg / 1000,
    quelleErtrag: hatApi ? "anlage" : "richtwert",
    zeitraum: hatApi && !leer(zeitraum) ? String(zeitraum).trim().slice(0, 40) : null,
    texte: {
      kwp: k > 0 ? `${fmtKwp(k)} kWp` : "",
      mwh: `ca. ${fmtCa(ertrag / 1000)} MWh`,
      co2: `ca. ${fmtCa(co2Kg / 1000)} t CO₂`,
    },
  };
}

// ---------------------------------------------------------------- Kundendaten

const leer = (v) => v == null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);
const ersterWert = (...werte) => werte.find((v) => !leer(v));

/** 0/1, "1", "ja", true … → true; alles andere false; undefined/""/null → undefined (nicht gesetzt) */
function wahr(v) {
  if (v == null || v === "") return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  return ["1", "true", "ja", "yes"].includes(String(v).trim().toLowerCase());
}

/** Nur http(s)-Adressen; „www.firma.at“ wird zu https://www.firma.at. Alles andere → "" */
export function normUrl(v) {
  if (leer(v) || typeof v !== "string") return "";
  let s = v.trim();
  if (/^www\.|^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(\/|$)/i.test(s) && !/^https?:\/\//i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch {
    return "";
  }
}

/** Anzeigeform einer Website ohne Protokoll/„www.“/Schrägstrich am Ende */
export const urlKurz = (url) => String(url || "").replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

export const SOCIAL = [
  { key: "linkedin", name: "LinkedIn" },
  { key: "instagram", name: "Instagram" },
  { key: "facebook", name: "Facebook" },
  { key: "youtube", name: "YouTube" },
  { key: "xing", name: "XING" },
  { key: "tiktok", name: "TikTok" },
  { key: "x", name: "X" },
];

/**
 * Quellen: kunden.js [{titel,url}] oder Backoffice-Array von URL-Strings (Linktext = Hostname).
 * Zur Sicherheit auch Text/JSON (eine URL je Zeile, optional „Titel | URL“).
 */
function quellenListe(v) {
  if (leer(v)) return [];
  let roh = v;
  if (typeof roh === "string") {
    try {
      roh = JSON.parse(roh);
    } catch {
      roh = roh
        .split(/\r?\n|;/)
        .map((z) => z.trim())
        .filter(Boolean)
        .map((z) => {
          const [a, b] = z.split("|").map((s) => s.trim());
          return b ? { titel: a, url: b } : { titel: "", url: a };
        });
    }
  }
  if (!Array.isArray(roh)) return [];
  return roh
    .map((q) => (typeof q === "string" ? { titel: "", url: q } : q))
    .map((q) => ({ url: normUrl(q?.url), titel: String(q?.titel || q?.title || "").trim() }))
    .filter((q) => q.url)
    .map((q) => ({ ...q, titel: q.titel || urlKurz(q.url).split("/")[0] }));
}

function zitatVon(text, person) {
  if (leer(text)) return null;
  if (typeof text === "object") {
    const t = text.text || text.zitat;
    return leer(t) ? null : { text: String(t).trim(), person: String(text.person || text.name || person || "").trim() };
  }
  return { text: String(text).trim(), person: String(person || "").trim() };
}

// ---------------------------------------------------------------- Freigaben

/** Schalter einer Referenz-Freigabe – Reihenfolge wie auf der Freigabeseite */
export const FREIGABE_FELDER = ["name", "logo", "zitat", "fotos", "plakette", "livedaten", "messwerte"];

/** Nichts freigegeben (Standard, auch bei Ladefehlern) */
export const FREIGABE_LEER = Object.freeze({
  name: false,
  logo: false,
  zitat: false,
  fotos: false,
  plakette: false,
  livedaten: false,
  messwerte: false,
  freigegebenAm: null,
  beleg: null,
  quelle: "keine",
});

/**
 * Freigabe-Datensatz aus get_freigaben (Backoffice) oder aus kunden.js in die Website-Form bringen.
 * Backoffice-Schlüssel: freigabe_name, freigabe_logo, freigabe_zitat, freigabe_fotos_anlage,
 * freigabe_plakette, freigabe_livedaten, freigabe_messwerte, zitat_text, zitat_person_funktion,
 * freigegeben_am, widerrufen_am, text_version. kunden.js: {name, zitat, logo, plakette, livedaten,
 * messwerte, freigegebenAm, beleg}. Unbekannt/leer → alles false.
 */
export function freigabeNormalisieren(roh, quelle = "backoffice") {
  if (!roh || typeof roh !== "object") return { ...FREIGABE_LEER };
  // widerrufen → wie keine Freigabe
  if (!leer(roh.widerrufen_am) || !leer(roh.widerrufenAm)) return { ...FREIGABE_LEER, quelle };
  const flag = (...schluessel) => wahr(ersterWert(...schluessel.map((s) => roh[s]))) === true;
  const f = {
    name: flag("freigabe_name", "name"),
    logo: flag("freigabe_logo", "logo"),
    zitat: flag("freigabe_zitat", "zitat"),
    fotos: flag("freigabe_fotos_anlage", "fotos"),
    plakette: flag("freigabe_plakette", "plakette"),
    livedaten: flag("freigabe_livedaten", "livedaten"),
    messwerte: flag("freigabe_messwerte", "messwerte"),
    freigegebenAm: String(ersterWert(roh.freigegeben_am, roh.freigegebenAm) || "").trim() || null,
    beleg: String(ersterWert(roh.beleg, roh.text_version) || "").trim() || null,
    quelle,
  };
  // Zitattext gehört zur Freigabe (nur, wenn der Kunde das Zitat freigegeben hat)
  const zitatText = String(ersterWert(roh.zitat_text, roh.zitatText) || "").trim();
  if (f.zitat && zitatText) f.zitatText = zitatText;
  if (f.zitat) f.zitatPerson = String(ersterWert(roh.zitat_person_funktion, roh.zitatPerson) || "").trim();
  return f;
}

/** Darf der Firmenname des Kunden auf der Website erscheinen? */
export const nameFrei = (kunde) => !!kunde?.freigabe?.name;

/**
 * Neutraler Name für Seiten ohne Namensfreigabe, z. B. „Metallbau, Steyregg (Oberösterreich)“.
 * Fallback: der Projekttitel bzw. „Referenzprojekt“.
 */
export function neutralerName(kunde, projektTitel = "") {
  if (nameFrei(kunde)) return kunde.firma;
  const teile = [kunde?.branche, kunde?.ort].map((t) => String(t || "").trim()).filter(Boolean);
  if (teile.length) return teile.join(", ");
  return String(projektTitel || "").trim() || "Referenzprojekt";
}

// ---------------------------------------------------------------- Projektliste ohne Kundennamen
//
// Die statischen Projekte (src/data/projekte.js) tragen den Firmennamen als projekt_name – und damit
// in H1, <title>, Bild-Alt-Texten und URL. Ohne Freigabe „Name“ ersetzt ladeProjekte.js den Namen
// durch eine neutrale Bezeichnung (Branche und Bundesland laut kunden.js, sonst „Referenzanlage {kWp}“).
// projekt_website_name (alter Slug) bleibt als interner Schlüssel: Die Detailseite leitet alte URLs
// per 301 auf den neuen, neutralen Slug um (veraltet → permanentRedirect).

const BUNDESLAENDER = ["Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien"];

/** Neutrale Projektbezeichnung ohne Firmennamen, z. B. „Kunststoffverpackungen, Vorarlberg“ oder „Referenzanlage 409,2 kWp“. */
export function neutralerProjektName(kunde, roh = null) {
  const branche = String(kunde?.branche || "")
    .replace(/\s*\(.*?\)/g, "")
    .trim();
  // Nur das Bundesland (wie die anonymen Namen in src/data/hero.js), nicht der Firmensitz
  const ort = String(kunde?.ort || "").replace(/\s*\(.*?\)/g, "");
  const land = BUNDESLAENDER.find((b) => ort.includes(b)) || "";
  if (branche) return land ? `${branche}, ${land}` : branche;
  const kwp = Number(roh?.leistung);
  const label = String(roh?.leistung_label || "").trim() || (kwp > 0 ? `${fmtKwp(kwp)} kWp` : "");
  return label ? `Referenzanlage ${label}` : "Referenzanlage";
}

/**
 * Rohprojekt (API-Form) mit neutralem Namen: projekt_name, bild_alt und Alt-Texte der Bilder.
 * Markiert mit projekt_anonym = true (Seiten nehmen dann Branche/Ort nicht ein zweites Mal in den Title).
 */
export function projektNeutralisieren(roh, name) {
  if (!roh || typeof roh !== "object") return roh;
  const neutral = String(name || "").trim() || "Referenzanlage";
  const bilder = Array.isArray(roh.bilder)
    ? roh.bilder.map((b, i) => (b && typeof b === "object" ? { ...b, bild_alt: `${neutral} – Bild ${i + 1}` } : b))
    : roh.bilder;
  const aus = { ...roh, projekt_name: neutral, bild_alt: `${neutral} – Bild 1`, projekt_anonym: true };
  if (bilder !== undefined) aus.bilder = bilder;
  for (const feld of ["title", "name"]) if (feld in aus) aus[feld] = neutral;
  return aus;
}

/**
 * Führt Backoffice-Felder am Projekt, den Eintrag aus src/data/kunden.js und die Referenz-Freigabe
 * (get_freigaben) zusammen. API-Felder gewinnen, sonst kunden.js. Liefert null, wenn es keinerlei
 * Kundendaten gibt.
 *
 * API (get_projekt, oekovolt_app): website_url, linkedin, instagram, facebook, youtube, xing, tiktok, x
 *      (absolute https-URL oder null), branche, portraet (String oder null), portraet_quellen
 *      (Array von URL-Strings, Linktext = Hostname), zitat, zitat_person, logo_url (nur bei Freigabe,
 *      sonst null), jahr (Zahl oder null). get_projekte liefert website_url und branche.
 *      Optional ausgewertet: freigabe_zitat/freigabe_logo (ausdrückliches Nein), firma.
 * kunden.js: { firma, website, social:{…}, branche, ort, portraet, quellen:[{titel,url}],
 *      geprueftAm, freigabe:{name,zitat,logo,plakette,livedaten,messwerte,freigegebenAm,beleg}, zitat }
 * freigabe: Datensatz aus get_freigaben (Backoffice gewinnt über kunden.js; null = nicht vorhanden).
 *      Liegt ein Backoffice-Datensatz vor, entscheiden ausschließlich dessen Schalter – auch über
 *      Zitat und Logo aus den Projektfeldern.
 */
export function kundeZusammenfuehren({ api = null, eintrag = null, freigabe = null } = {}) {
  const a = api && typeof api === "object" ? api : {};
  const k = eintrag && typeof eintrag === "object" ? eintrag : {};
  const ks = k.social && typeof k.social === "object" ? k.social : {};

  const social = {};
  for (const { key } of SOCIAL) {
    const url = normUrl(ersterWert(a[key], ks[key]));
    if (url) social[key] = url;
  }

  const backoffice = freigabe && typeof freigabe === "object" ? freigabeNormalisieren(freigabe, "backoffice") : null;
  const kFrei = freigabeNormalisieren(k.freigabe, "kunden.js");
  const frei = backoffice || kFrei;

  // Zitat und Logo:
  // - Mit Backoffice-Freigabe (DocType „Referenz Freigabe“) zählen nur deren Schalter; der Zitattext kommt
  //   aus der Freigabe, ersatzweise aus den Projektfeldern bzw. kunden.js.
  // - Ohne Backoffice-Freigabe (Altbestand): Das Backoffice liefert zitat/zitat_person und logo_url NUR bei
  //   Freigabe am Projekt (sonst null) – ein Wert aus der API gilt daher als freigegeben (außer ein Feld
  //   freigabe_* sagt ausdrücklich nein). Aus kunden.js nur, wenn dort freigabe.zitat bzw. freigabe.logo === true.
  const apiZitat = zitatVon(a.zitat, a.zitat_person);
  const apiLogo = normUrl(a.logo_url);
  const kZitat = zitatVon(k.zitat, ersterWert(k.zitat_person, k.zitatPerson));
  const kLogo = normUrl(ersterWert(k.logo, k.logoUrl, k.logo_url));
  let zitat = null;
  let logoUrl = "";
  if (backoffice) {
    if (backoffice.zitat) {
      zitat = backoffice.zitatText ? { text: backoffice.zitatText, person: backoffice.zitatPerson || "" } : apiZitat || kZitat;
    }
    if (backoffice.logo) logoUrl = apiLogo || kLogo;
  } else {
    const zitatApiFrei = !!apiZitat && wahr(a.freigabe_zitat) !== false;
    const logoApiFrei = !!apiLogo && wahr(a.freigabe_logo) !== false;
    zitat = zitatApiFrei ? apiZitat : kFrei.zitat ? kZitat : null;
    logoUrl = logoApiFrei ? apiLogo : kFrei.logo ? kLogo : "";
  }

  const kunde = {
    firma: String(ersterWert(a.firma, k.firma) || "").trim(),
    website: normUrl(ersterWert(a.website_url, k.website)),
    social,
    branche: String(ersterWert(a.branche, k.branche) || "").trim(),
    ort: String(ersterWert(k.ort) || "").trim(),
    portraet: String(ersterWert(a.portraet, k.portraet) || "").trim(),
    quellen: quellenListe(ersterWert(a.portraet_quellen, k.quellen)),
    geprueftAm: String(ersterWert(k.geprueftAm) || "").trim(),
    jahr: Number(ersterWert(a.jahr, k.jahr)) || null,
    freigabe: {
      name: frei.name,
      logo: !!logoUrl,
      zitat: !!zitat,
      fotos: frei.fotos,
      plakette: frei.plakette,
      livedaten: frei.livedaten,
      messwerte: frei.messwerte,
      freigegebenAm: frei.freigegebenAm,
      beleg: frei.beleg,
      quelle: frei.quelle,
    },
    zitat,
    logoUrl,
  };

  const hatDaten = kunde.firma || kunde.website || kunde.portraet || kunde.branche || Object.keys(social).length;
  return hatDaten ? kunde : null;
}

/** Soll der Abschnitt „Über <Firma>“ erscheinen? (Porträt, Website oder Social-Profile vorhanden) */
export const hatPortraet = (kunde) => !!(kunde && (kunde.portraet || kunde.website || Object.keys(kunde.social || {}).length));

/** Social-Profile als Liste in fester Reihenfolge */
export const socialListe = (kunde) => SOCIAL.filter(({ key }) => kunde?.social?.[key]).map((s) => ({ ...s, url: kunde.social[s.key] }));

/** Organisation des Kunden für JSON-LD – nur mit Namensfreigabe und belegten Werten, sonst null */
export function kundeSchema(kunde) {
  if (!kunde?.firma || !nameFrei(kunde)) return null;
  const sameAs = socialListe(kunde).map((s) => s.url);
  if (!kunde.website && !sameAs.length) return null;
  return {
    "@type": "Organization",
    name: kunde.firma,
    ...(kunde.website && { url: kunde.website }),
    ...(sameAs.length && { sameAs }),
    ...(kunde.ort && { address: { "@type": "PostalAddress", addressLocality: kunde.ort } }),
    ...(kunde.freigabe?.logo && kunde.logoUrl && { logo: kunde.logoUrl }),
  };
}

/** geprueftAm „2026-09-30“ → „30.09.2026“ (andere Formate unverändert) */
export function datumAT(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso || "");
}

// ---------------------------------------------------------------- Social-Media-Texte

export const HASHTAGS = "#Photovoltaik #Nachhaltigkeit #Österreich #Solarstrom #Energiewende";

/**
 * 2–3 Vorschlagstexte aus Sicht des Kunden. Keine Superlative, alle Zahlen als Schätzung.
 * „@Ökovolt“ ist ein Platzhalter – beim Posten in LinkedIn/Instagram die Seite markieren.
 */
export function postVorschlaege({ firma, ort = "", jahr = null, zahlen = null, url = "" }) {
  const wo = ort ? ` in ${ort}` : "";
  const texte = [];
  if (zahlen?.kwp) {
    texte.push({
      titel: "Sachlich für LinkedIn",
      text:
        `Unser Strom kommt zu einem guten Teil von der Sonne: ${firma} betreibt${wo} eine Photovoltaikanlage mit ${zahlen.texte.kwp}${jahr ? ` (in Betrieb seit ${jahr})` : ""}. ` +
        `Sie erzeugt nach unserer Schätzung ${zahlen.texte.mwh} Solarstrom im Jahr und vermeidet damit ${zahlen.texte.co2} pro Jahr. ` +
        `Geplant und gebaut hat die Anlage @Ökovolt.\n\n${HASHTAGS}${url ? `\n\nMehr zum Projekt: ${url}` : ""}`,
    });
    texte.push({
      titel: "Kurz für Instagram",
      text:
        `Sonnenstrom vom eigenen Standort${wo}: ${zahlen.texte.kwp} Photovoltaik, ${zahlen.texte.mwh} Strom im Jahr, ${zahlen.texte.co2} weniger (Schätzung). ` +
        `Danke an @Ökovolt für Planung und Montage.\n\n${HASHTAGS} #Unternehmen`,
    });
    texte.push({
      titel: "Für Team und Partner",
      text:
        `Ein Schritt, auf den wir stolz sind: An unserem Standort${wo} arbeitet eine Solaranlage mit ${zahlen.texte.kwp}. ` +
        `Rechnerisch erzeugt sie ${zahlen.texte.mwh} im Jahr und spart ${zahlen.texte.co2} ein. ` +
        `Umgesetzt mit @Ökovolt.\n\n${HASHTAGS}`,
    });
  } else {
    texte.push({
      titel: "Sachlich für LinkedIn",
      text: `${firma} erzeugt${wo} eigenen Solarstrom. Geplant und gebaut hat die Photovoltaikanlage @Ökovolt.\n\n${HASHTAGS}${url ? `\n\nMehr zum Projekt: ${url}` : ""}`,
    });
    texte.push({
      titel: "Kurz für Instagram",
      text: `Sonnenstrom vom eigenen Standort${wo}. Danke an @Ökovolt für Planung und Montage.\n\n${HASHTAGS}`,
    });
  }
  return texte;
}

/** LinkedIn-Teilen ohne Skript: reiner Link auf den Share-Dialog */
export const linkedinShareUrl = (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

/// ---------------------------------------------------------------- Projekt-Plakette (SVG)
//
// Sachliche Projektangabe für die Website des Kunden – kein Siegel, keine Rosette, kein Prüfzeichen,
// keine Wörter wie „zertifiziert“, „klimaneutral“ oder „grün“ (UWG/EmpCo, siehe Dateikopf).
// Ausgeliefert wird sie nur mit Freigabe „Projekt-Plakette“ (src/app/siegel/[slug]/route.js).

export const PLAKETTE_FORMATE = {
  klein: { breite: 340, hoehe: 150, hoeheOhne: 112, label: "Kompakt" },
  breit: { breite: 728, hoehe: 96, hoeheOhne: 96, label: "Breit" },
};
export const PLAKETTE_STILE = { hell: "Hell", dunkel: "Dunkel" };

/** Wörter, die auf einer Plakette nicht vorkommen dürfen (Test: scripts/kundenbuehne.test.mjs) */
export const PLAKETTE_VERBOTEN = ["siegel", "zertifiziert", "zertifikat", "klimaneutral", "grün", "geprüft", "ausgezeichnet"];

export const PLAKETTE_ERRICHTER = "Ökovolt Solartechnik GmbH";

/** Maße einer Plakette – ohne Leistung (keine kWp bekannt) ist die kompakte Plakette niedriger */
export function plaketteMasse(format = "klein", zahlen = null) {
  const f = PLAKETTE_FORMATE[format] || PLAKETTE_FORMATE.klein;
  return { breite: f.breite, hoehe: zahlen?.kwp ? f.hoehe : f.hoeheOhne };
}

const FARBEN = {
  hell: { grund: "#ffffff", rand: "#dfe3ea", text: "#151a24", leise: "#4e5667", akzent: "#558227", trenn: "#eef0f4", flaeche: "#f4f9ee" },
  dunkel: { grund: "#03122b", rand: "#12305a", text: "#ffffff", leise: "#b8c2d3", akzent: "#aed083", trenn: "#15345f", flaeche: "#0b2446" },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Zeilenumbruch nach Zeichenzahl (SVG kennt keinen automatischen Umbruch) */
export function umbrechen(text, max, zeilenMax = 2) {
  const zeilen = [];
  let z = "";
  for (const wort of String(text).split(/\s+/).filter(Boolean)) {
    if (z && (z + " " + wort).length > max) {
      zeilen.push(z);
      z = wort;
    } else z = z ? `${z} ${wort}` : wort;
  }
  if (z) zeilen.push(z);
  if (zeilen.length > zeilenMax) {
    const rest = zeilen.slice(zeilenMax - 1).join(" ");
    return [...zeilen.slice(0, zeilenMax - 1), rest.length > max ? `${rest.slice(0, max - 1).trimEnd()}…` : rest];
  }
  return zeilen.map((x) => (x.length > max ? `${x.slice(0, max - 1)}…` : x));
}

/**
 * Kernsatz der Plakette: „Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH · 2024 · 250 kWp“
 * (Jahr und kWp nur, wenn bekannt).
 */
export function plaketteText({ jahr = null, zahlen = null } = {}) {
  const teile = [`Photovoltaikanlage errichtet von ${PLAKETTE_ERRICHTER}`];
  if (Number(jahr) > 0) teile.push(String(Number(jahr)));
  if (zahlen?.kwp) teile.push(zahlen.texte.kwp);
  return teile.join(" · ");
}

/**
 * CO₂-Zeile – nur mit Messwert der Anlage (quelleErtrag === "anlage") und Zeitraum, sonst "".
 * Der Rechenweg steht auf der ESG-Seite des Projekts (Link wird mit ausgegeben).
 */
export function plaketteCo2Text(zahlen) {
  if (!zahlen || zahlen.quelleErtrag !== "anlage" || !zahlen.zeitraum) return "";
  return `Ertrag ${zahlen.zeitraum}: ${de(Math.round(zahlen.ertragKwh))} kWh gemessen · vermiedene Emissionen ${zahlen.texte.co2} (${de(CO2_G_PRO_KWH, 1)} g CO₂/kWh)`;
}

/** Alternativtext/Titel der Plakette (Firmenname nur mit Namensfreigabe) */
export function plaketteAlt({ firma = "", jahr = null, zahlen = null, nameFrei: mitName = false } = {}) {
  const kern = plaketteText({ jahr, zahlen });
  return mitName && firma ? `${firma}: ${kern}` : kern;
}

const SCHRIFT = "Manrope, Inter, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/** Schlichtes Modul-Piktogramm (3 × 2 Zellen) – bewusst kein Rosetten- oder Prüfzeichen-Look */
function modul(x, y, b, f) {
  const z = b / 3;
  const zellen = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      zellen.push(`<rect x="${(x + c * z + 1).toFixed(1)}" y="${(y + r * z + 1).toFixed(1)}" width="${(z - 2).toFixed(1)}" height="${(z - 2).toFixed(1)}" rx="1.5" fill="${f.akzent}" opacity="${r === 0 ? 0.9 : 0.6}"/>`);
    }
  }
  return `<rect x="${x}" y="${y}" width="${b}" height="${(2 * z).toFixed(1)}" rx="3" fill="${f.flaeche}" stroke="${f.rand}"/>${zellen.join("")}`;
}

/**
 * Projekt-Plakette als eigenständiges SVG (ohne externe Schriften/Bilder, für <img> geeignet).
 * @param {object} e  { firma, zahlen (aus schaetzung), jahr, stil: hell|dunkel, format: klein|breit,
 *                      nameFrei (Firmenname nur mit Freigabe „Name“), rechenwegUrl (für die CO₂-Zeile) }
 */
export function plaketteSvg({ firma = "", zahlen = null, jahr = null, stil = "hell", format = "klein", nameFrei: mitName = false, rechenwegUrl = "" } = {}) {
  const f = FARBEN[stil] || FARBEN.hell;
  const fmt = PLAKETTE_FORMATE[format] ? format : "klein";
  const { breite: B, hoehe: H } = plaketteMasse(fmt, zahlen);
  const titel = esc(plaketteAlt({ firma, jahr, zahlen, nameFrei: mitName }));
  const name = mitName && firma ? firma : "";
  const co2 = plaketteCo2Text(zahlen);
  const kopf = `<svg xmlns="http://www.w3.org/2000/svg" width="${B}" height="${H}" viewBox="0 0 ${B} ${H}" role="img" aria-label="${titel}"><title>${titel}</title>`;
  const rahmen = `<rect x="0.5" y="0.5" width="${B - 1}" height="${H - 1}" rx="10" fill="${f.grund}" stroke="${f.rand}"/>`;
  const fakten = [Number(jahr) > 0 ? `Inbetriebnahme ${Number(jahr)}` : "", zahlen?.kwp ? `${zahlen.texte.kwp} Nennleistung` : ""].filter(Boolean).join(" · ");
  const rechenweg = co2 && rechenwegUrl ? ` · Rechenweg: ${urlKurz(rechenwegUrl)}` : "";
  const richtwert = zahlen?.kwp ? `Rechnerisch ca. ${fmtCa(zahlen.mwh)} MWh Solarstrom pro Jahr (Richtwert ${de(ERTRAG_JE_KWP)} kWh/kWp, Schätzung)` : "";

  if (fmt === "breit") {
    const zeilen = name ? umbrechen(name, 44, 1) : [];
    const y1 = name ? 34 : 40;
    const nameSvg = zeilen.map((z) => `<text x="76" y="${y1 + 22}" font-size="15" font-weight="800" fill="${f.text}">${esc(z)}</text>`).join("");
    const kern = `<text x="76" y="${y1}" font-size="${name ? 12.5 : 15}" font-weight="${name ? 600 : 800}" fill="${f.text}">${esc(`Photovoltaikanlage errichtet von ${PLAKETTE_ERRICHTER}`)}</text>`;
    const fakt = fakten ? `<text x="${B - 18}" y="${y1}" font-size="12.5" font-weight="700" text-anchor="end" fill="${f.akzent}">${esc(fakten)}</text>` : "";
    const fussText = co2 ? co2 + rechenweg : richtwert || "Planung, Montage und Netzanschluss aus einer Hand";
    const fuss = `<text x="76" y="${H - 14}" font-size="9.5" fill="${f.leise}">${esc(fussText)}</text>`;
    return `${kopf}${rahmen}<g font-family="${SCHRIFT}">${modul(18, 24, 42, f)}${kern}${nameSvg}${fakt}<line x1="76" y1="${H - 32}" x2="${B - 18}" y2="${H - 32}" stroke="${f.trenn}"/>${fuss}</g></svg>`;
  }

  // kompakt
  const zeilen = name ? umbrechen(name, 30, 1) : [];
  const nameSvg = zeilen.map((z) => `<text x="18" y="78" font-size="15" font-weight="800" fill="${f.text}">${esc(z)}</text>`).join("");
  const kern = umbrechen(`Photovoltaikanlage errichtet von ${PLAKETTE_ERRICHTER}`, 34, 2)
    .map((z, i) => `<text x="62" y="${34 + i * 16}" font-size="12.5" font-weight="700" fill="${f.text}">${esc(z)}</text>`)
    .join("");
  const faktY = name ? 100 : 78;
  const fakt = fakten ? `<text x="18" y="${faktY}" font-size="12" font-weight="700" fill="${f.akzent}">${esc(fakten)}</text>` : "";
  const fussText = co2 ? `${zahlen.texte.co2} vermieden (${zahlen.zeitraum}, Messwert)${rechenweg}` : richtwert.replace("Solarstrom pro Jahr (Richtwert", "Solarstrom/Jahr (Richtwert");
  const fuss = zahlen?.kwp ? `<text x="18" y="${H - 14}" font-size="9" fill="${f.leise}">${esc(fussText)}</text>` : "";
  const trenn = zahlen?.kwp ? `<line x1="18" y1="${H - 30}" x2="${B - 18}" y2="${H - 30}" stroke="${f.trenn}"/>` : "";
  return `${kopf}${rahmen}<g font-family="${SCHRIFT}">${modul(18, 20, 33, f)}${kern}${nameSvg}${fakt}${trenn}${fuss}</g></svg>`;
}

/** Adresse des Plaketten-Bildes (Standard: hell, kompakt – ohne Parameter). Pfad /siegel bleibt aus Kompatibilität. */
export function plaketteBildUrl({ basis = "", slug, stil = "hell", format = "klein" }) {
  const q = [stil !== "hell" && `stil=${stil}`, format !== "klein" && `format=${format}`].filter(Boolean).join("&");
  return `${basis}/siegel/${slug}.svg${q ? `?${q}` : ""}`;
}

/**
 * Einbau-Code für fremde Websites: Bild-Link, bewusst rel="nofollow" (Google-Richtlinie
 * zu Widget-/Badge-Links), sichtbarer Errichter in der Plakette, kein Keyword-Anker.
 */
export function einbauCode({ basis, slug, firma = "", zahlen = null, jahr = null, stil = "hell", format = "klein", nameFrei: mitName = false }) {
  const { breite, hoehe } = plaketteMasse(format, zahlen);
  const bild = plaketteBildUrl({ basis, slug, stil, format }).replace(/&/g, "&amp;");
  return `<a href="${basis}/referenzen/projekte/${slug}" rel="nofollow noopener" target="_blank"><img src="${bild}" alt="${esc(plaketteAlt({ firma, jahr, zahlen, nameFrei: mitName }))}" width="${breite}" height="${hoehe}" loading="lazy" style="max-width:100%;height:auto;border:0"></a>`;
}
