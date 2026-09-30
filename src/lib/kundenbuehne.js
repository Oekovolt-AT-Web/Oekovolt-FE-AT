// src/lib/kundenbuehne.js
//
// „Kundenbühne“ der Referenzprojekte: Kundenporträt, Solar-Siegel, Social-Media-Kit
// und ESG-Kurzbericht. Reine Funktionen ohne React und ohne Pfad-Aliase – per Node
// prüfbar und in Server- wie Client-Komponenten nutzbar.
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
 * Schätzung für Siegel, Social-Kit und ESG-Bericht.
 * @param {object} e
 * @param {number|null} e.kwp         Nennleistung
 * @param {number|null} [e.ertragKwh] Jahresertrag aus dem Backoffice (hat Vorrang)
 * @returns {null | {kwp, ertragKwh, ertragJeKwp, mwh, co2Kg, co2T, quelleErtrag, texte:{kwp, mwh, co2}}}
 */
export function schaetzung({ kwp, ertragKwh = null } = {}) {
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

/**
 * Führt Backoffice-Felder am Projekt und den Eintrag aus src/data/kunden.js zusammen.
 * API-Felder gewinnen, sonst kunden.js. Liefert null, wenn es keinerlei Kundendaten gibt.
 *
 * API (get_projekt, oekovolt_app): website_url, linkedin, instagram, facebook, youtube, xing, tiktok, x
 *      (absolute https-URL oder null), branche, portraet (String oder null), portraet_quellen
 *      (Array von URL-Strings, Linktext = Hostname), zitat, zitat_person, logo_url (nur bei Freigabe,
 *      sonst null), jahr (Zahl oder null). get_projekte liefert website_url und branche.
 *      Optional ausgewertet: freigabe_zitat/freigabe_logo (ausdrückliches Nein), firma.
 * kunden.js: { firma, website, social:{…}, branche, ort, portraet, quellen:[{titel,url}],
 *      geprueftAm, freigabe:{zitat,logo}, zitat }
 */
export function kundeZusammenfuehren({ api = null, eintrag = null } = {}) {
  const a = api && typeof api === "object" ? api : {};
  const k = eintrag && typeof eintrag === "object" ? eintrag : {};
  const ks = k.social && typeof k.social === "object" ? k.social : {};

  const social = {};
  for (const { key } of SOCIAL) {
    const url = normUrl(ersterWert(a[key], ks[key]));
    if (url) social[key] = url;
  }

  // Das Backoffice liefert zitat/zitat_person und logo_url NUR bei Freigabe des Kunden (sonst null) –
  // ein Wert aus der API gilt daher als freigegeben (außer ein Feld freigabe_* sagt ausdrücklich nein).
  // Aus kunden.js nur, wenn dort freigabe.zitat bzw. freigabe.logo === true.
  const apiZitat = zitatVon(a.zitat, a.zitat_person);
  const apiLogo = normUrl(a.logo_url);
  const kZitatFrei = wahr(k.freigabe?.zitat) === true;
  const kLogoFrei = wahr(k.freigabe?.logo) === true;
  const zitatApiFrei = !!apiZitat && wahr(a.freigabe_zitat) !== false;
  const logoApiFrei = !!apiLogo && wahr(a.freigabe_logo) !== false;
  const kZitat = kZitatFrei ? zitatVon(k.zitat, ersterWert(k.zitat_person, k.zitatPerson)) : null;
  const kLogo = kLogoFrei ? normUrl(ersterWert(k.logo, k.logoUrl, k.logo_url)) : "";
  const zitat = zitatApiFrei ? apiZitat : kZitat;
  const logoUrl = logoApiFrei ? apiLogo : kLogo;

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
    freigabe: { zitat: !!zitat, logo: !!logoUrl },
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

/** Organisation des Kunden für JSON-LD – nur belegte Werte, sonst null */
export function kundeSchema(kunde) {
  if (!kunde?.firma) return null;
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

// ---------------------------------------------------------------- Solar-Siegel (SVG)

export const SIEGEL_FORMATE = {
  klein: { breite: 340, hoehe: 176, hoeheOhne: 118, label: "Kompakt" },
  breit: { breite: 728, hoehe: 112, hoeheOhne: 112, label: "Breit" },
};
export const SIEGEL_STILE = { hell: "Hell", dunkel: "Dunkel" };

/** Maße eines Siegels – ohne Kennzahlen (keine Leistung bekannt) ist das kompakte Siegel niedriger */
export function siegelMasse(format = "klein", zahlen = null) {
  const f = SIEGEL_FORMATE[format] || SIEGEL_FORMATE.klein;
  return { breite: f.breite, hoehe: zahlen?.kwp ? f.hoehe : f.hoeheOhne };
}

const FARBEN = {
  hell: { grund: "#ffffff", rand: "#dfe3ea", text: "#151a24", leise: "#4e5667", akzent: "#558227", trenn: "#eef0f4", sonne: "#f5a70f", flaeche: "#f4f9ee" },
  dunkel: { grund: "#03122b", rand: "#12305a", text: "#ffffff", leise: "#b8c2d3", akzent: "#aed083", trenn: "#15345f", sonne: "#ffc53d", flaeche: "#0b2446" },
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

export const siegelAlt = (firma, zahlen) =>
  `${firma} erzeugt Sonnenstrom${zahlen?.kwp ? ` – ${zahlen.texte.kwp}, ${zahlen.texte.mwh} pro Jahr, ${zahlen.texte.co2} pro Jahr weniger (Schätzung)` : ""}. Solaranlage: Ökovolt`;

const SCHRIFT = "Manrope, Inter, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

function sonne(x, y, r, f) {
  const strahlen = Array.from({ length: 8 }, (_, i) => {
    const w = (i * Math.PI) / 4;
    const px = (fak) => (x + Math.cos(w) * r * fak).toFixed(1);
    const py = (fak) => (y + Math.sin(w) * r * fak).toFixed(1);
    return `<line x1="${px(1.45)}" y1="${py(1.45)}" x2="${px(1.95)}" y2="${py(1.95)}"/>`;
  }).join("");
  return `<g stroke="${f.sonne}" stroke-width="${(r * 0.32).toFixed(1)}" stroke-linecap="round">${strahlen}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${f.sonne}"/>`;
}

/** Kennzahl: Wert fett, Einheit in Akzentfarbe, darunter die Bedeutung */
const kennzahl = (x, y, [wert, einheit, label], f, gross) =>
  `<text x="${x}" y="${y}" font-size="${gross ? 16 : 13.5}" font-weight="800" fill="${f.text}">${esc(wert)}<tspan dx="3" font-size="${gross ? 12 : 10.5}" font-weight="700" fill="${f.akzent}">${esc(einheit)}</tspan></text>` +
  `<text x="${x}" y="${y + (gross ? 17 : 15)}" font-size="${gross ? 10.5 : 10}" fill="${f.leise}">${esc(label)}</text>`;

/**
 * Solar-Siegel als eigenständiges SVG (ohne externe Schriften/Bilder, für <img> geeignet).
 * @param {object} e  { firma, zahlen (aus schaetzung), stil: hell|dunkel, format: klein|breit }
 */
export function siegelSvg({ firma, zahlen = null, stil = "hell", format = "klein" }) {
  const f = FARBEN[stil] || FARBEN.hell;
  const fmt = SIEGEL_FORMATE[format] ? format : "klein";
  const { breite: B, hoehe: H } = siegelMasse(fmt, zahlen);
  const werte = zahlen?.kwp
    ? [
        [fmtKwp(zahlen.kwp), "kWp", "Leistung"],
        [`ca. ${fmtCa(zahlen.mwh)}`, "MWh", "Solarstrom pro Jahr"],
        [`ca. ${fmtCa(zahlen.co2T)}`, "t CO₂", "weniger pro Jahr"],
      ]
    : [];
  const titel = esc(siegelAlt(firma, zahlen));
  const kopf = `<svg xmlns="http://www.w3.org/2000/svg" width="${B}" height="${H}" viewBox="0 0 ${B} ${H}" role="img" aria-label="${titel}"><title>${titel}</title>`;
  const rahmen = `<rect x="0.5" y="0.5" width="${B - 1}" height="${H - 1}" rx="14" fill="${f.grund}" stroke="${f.rand}"/>`;
  const fussY = H - 11;
  const fuss =
    `<line x1="18" y1="${H - 29}" x2="${B - 18}" y2="${H - 29}" stroke="${f.trenn}"/>` +
    `<text x="18" y="${fussY}" font-size="10.5" fill="${f.leise}">Solaranlage: <tspan font-weight="800" fill="${f.text}">Ökovolt</tspan></text>` +
    (werte.length
      ? `<text x="${B - 18}" y="${fussY}" font-size="9.5" text-anchor="end" fill="${f.leise}">${fmt === "breit" ? `Schätzung · ${de(ERTRAG_JE_KWP)} kWh/kWp · ${de(CO2_G_PRO_KWH, 1)} g CO₂/kWh` : "Schätzung"}</text>`
      : "");

  if (fmt === "breit") {
    // Feld links (Sonne), Name, rechts drei Kennzahlen
    const feld = H - 29 - 12 - 12;
    const maxZ = werte.length ? 29 : 60;
    const zeilen = umbrechen(firma, maxZ, 2);
    const fs = zeilen.length > 1 ? 15 : 17;
    const y0 = zeilen.length > 1 ? 45 : 52;
    const name = zeilen.map((z, i) => `<text x="${24 + feld}" y="${y0 + i * (fs + 3)}" font-size="${fs}" font-weight="800" fill="${f.text}">${esc(z)}</text>`).join("");
    const spalteB = 124;
    const start = B - 18 - werte.length * spalteB + 12;
    const spalten = werte
      .map((w, i) => (i ? `<line x1="${start + i * spalteB - 12}" y1="18" x2="${start + i * spalteB - 12}" y2="${H - 41}" stroke="${f.trenn}"/>` : "") + kennzahl(start + i * spalteB, 46, w, f, true))
      .join("");
    return `${kopf}${rahmen}<g font-family="${SCHRIFT}"><rect x="12" y="12" width="${feld}" height="${feld}" rx="12" fill="${f.flaeche}"/>${sonne(12 + feld / 2, 12 + feld / 2, 8, f)}<text x="${24 + feld}" y="${y0 - fs - 4}" font-size="9.5" font-weight="700" letter-spacing="1.4" fill="${f.akzent}">ERZEUGT SONNENSTROM</text>${name}${spalten}${fuss}</g></svg>`;
  }

  // kompakt
  const zeilen = umbrechen(firma, 29, 2);
  const fs = zeilen.length > 1 ? 15.5 : 18;
  const name = zeilen.map((z, i) => `<text x="18" y="${57 + i * (fs + 3)}" font-size="${fs}" font-weight="800" fill="${f.text}">${esc(z)}</text>`).join("");
  const spalteB = (B - 36) / 3;
  const wy = H - 58;
  const spalten = werte
    .map(
      (w, i) =>
        (i ? `<line x1="${18 + i * spalteB - 8}" y1="${wy - 14}" x2="${18 + i * spalteB - 8}" y2="${wy + 18}" stroke="${f.trenn}"/>` : "") +
        kennzahl(18 + i * spalteB, wy, [w[0], w[1], w[2].replace("Solarstrom pro Jahr", "pro Jahr")], f, false)
    )
    .join("");
  return `${kopf}${rahmen}<g font-family="${SCHRIFT}">${sonne(27, 27, 6, f)}<text x="44" y="31" font-size="9.5" font-weight="700" letter-spacing="1.4" fill="${f.akzent}">ERZEUGT SONNENSTROM</text>${name}${spalten}${fuss}</g></svg>`;
}

/** Adresse des Siegel-Bildes (Standard: hell, kompakt – ohne Parameter) */
export function siegelBildUrl({ basis = "", slug, stil = "hell", format = "klein" }) {
  const q = [stil !== "hell" && `stil=${stil}`, format !== "klein" && `format=${format}`].filter(Boolean).join("&");
  return `${basis}/siegel/${slug}.svg${q ? `?${q}` : ""}`;
}

/**
 * Einbau-Code für fremde Websites: Bild-Link, bewusst rel="nofollow" (Google-Richtlinie
 * zu Widget-/Badge-Links), sichtbarer Markenname im Siegel, kein Keyword-Anker.
 */
export function einbauCode({ basis, slug, firma, zahlen, stil = "hell", format = "klein" }) {
  const { breite, hoehe } = siegelMasse(format, zahlen);
  const bild = siegelBildUrl({ basis, slug, stil, format }).replace(/&/g, "&amp;");
  return `<a href="${basis}/referenzen/projekte/${slug}" rel="nofollow noopener" target="_blank"><img src="${bild}" alt="${esc(siegelAlt(firma, zahlen))}" width="${breite}" height="${hoehe}" loading="lazy" style="max-width:100%;height:auto;border:0"></a>`;
}
