// src/components/GewerbeUnikat/K6Modell.js
//
// K6 · Netzanschluss – REINES Modell (ohne React, ohne "use client"): Server-Hülle und Client-Bühne
// rechnen damit denselben Zustand. Enthält
//  - die logarithmische Abbildung der beiden Lineale (d3-scale scaleLog, 20 → 5.000),
//  - die Tore (EAG-Kategorien, OeMAG-Grenze, EAG-Höchstleistung, TOR Typ B, Fernwirkschnittstelle),
//  - die Netzebenen-Bänder (Richtwerte – die Netzebene legt der Netzbetreiber fest),
//  - ansichtModell(): AC-Summe und TOR-Typ ausschließlich über acVorschlag/acSumme/torTyp aus
//    src/components/Technik/torTypen.js (eine Staffel für die ganze Website),
//  - einlinie() + layoutQuer()/layoutHoch(): das mitwachsende Einlinienschaltbild (Koordinaten).

import { scaleLog } from "d3-scale";
import { DECKEL, FOERDERCALL, KATEGORIEN, MAX_KWP } from "@/lib/foerdercall";
import { OEMAG_REGELN, STAND as OEMAG_STAND } from "@/data/oemag";
import { DC_AC_VORSCHLAG, KNAPP_HINWEIS, TOR_GRENZEN, TYPEN, acSumme, acVorschlag, torTyp } from "@/components/Technik/torTypen";
import { zahl } from "./_tokens";

// ---------------------------------------------------------------------------------------------------
// Lineale
// ---------------------------------------------------------------------------------------------------

/** Wertebereich beider Lineale (kWp bzw. kW). */
export const LINEAL = { min: 20, max: 5000 };

const SKALA = scaleLog().domain([LINEAL.min, LINEAL.max]).range([0, 100]).clamp(true);

/** Wert → Position in Prozent der Linealbreite (log). */
export const pos = (v) => SKALA(Math.max(LINEAL.min, Number(v) || LINEAL.min));
/** Position in Prozent → Wert. */
export const ausPos = (p) => SKALA.invert(Math.max(0, Math.min(100, p)));

/** Beschriftete Hauptstriche und feine Zwischenstriche (d3 log-ticks 20, 30 … 90, 100, 200 … 5.000). */
export const HAUPTSTRICHE = [20, 50, 100, 200, 500, 1000, 2000, 5000];
export const STRICHE = SKALA.ticks(40).filter((t) => t >= LINEAL.min && t <= LINEAL.max);
export const strichText = (v) => (v >= 1000 ? `${zahl(v / 1000)}.000` : zahl(v));

/** Rasterwerte des kWp-Schiebers: fein bei kleinen, gröber bei großen Anlagen (Tastatur und Ziehen). */
export const LEITER = (() => {
  const l = [];
  for (let v = 20; v <= 100; v += 1) l.push(v);
  for (let v = 105; v <= 500; v += 5) l.push(v);
  for (let v = 510; v <= 1000; v += 10) l.push(v);
  for (let v = 1025; v <= 2000; v += 25) l.push(v);
  for (let v = 2050; v <= 5000; v += 50) l.push(v);
  return l;
})();

/** Index des nächstgelegenen Rasterwerts. */
export function leiterIndex(kwp) {
  const k = Number(kwp) || LINEAL.min;
  let lo = 0;
  let hi = LEITER.length - 1;
  while (hi - lo > 1) {
    const mitte = (lo + hi) >> 1;
    if (LEITER[mitte] <= k) lo = mitte;
    else hi = mitte;
  }
  return Math.abs(LEITER[hi] - k) < Math.abs(k - LEITER[lo]) ? hi : lo;
}

/** Schieberposition (0 … 1.000, Promille der Linealbreite) → gerasterte kWp. */
export const kwpAusSchieber = (promille) => LEITER[leiterIndex(ausPos(promille / 10))];
/** kWp → Schieberposition (0 … 1.000). */
export const schieberAusKwp = (kwp) => Math.round(pos(kwp) * 10 * 100) / 100;

// ---------------------------------------------------------------------------------------------------
// Tore
// ---------------------------------------------------------------------------------------------------

const KAT = Object.fromEntries(KATEGORIEN.map((k) => [k.id, k]));
const QUELLE_EAG = `EAG-Investitionszuschüsseverordnung-Strom, ${FOERDERCALL.nr}. Fördercall ${FOERDERCALL.jahr} (${FOERDERCALL.zeitraum}) · Stand ${FOERDERCALL.stand.label}`;

/**
 * Tore des DC-Lineals (kWp). `ueber`: das Tor gilt erst oberhalb des Werts (> statt ≥).
 * ausrichtung: wo die Fahne am Pfosten hängt („mitte“, „links“ = Fahne endet am Pfosten, „rechts“).
 */
export const DC_TORE = [
  {
    id: "kat-c",
    lineal: "dc",
    wert: KAT.B.bis,
    ueber: true,
    kurz: "Kat. C",
    mini: "C",
    ausrichtung: "rechts",
    titel: `Über ${zahl(KAT.B.bis)} kWp: EAG-Kategorie C`,
    text: `Investitionszuschuss höchstens ${zahl(KAT.C.satz)} €/kWp. Gereiht wird ${KAT.C.reihung} – nicht nach dem Zeitpunkt der Einreichung.`,
    quelle: QUELLE_EAG,
    link: { href: "/ratgeber/eag-investitionszuschuss", label: "EAG-Investitionszuschuss erklärt" },
  },
  {
    id: "kat-d",
    lineal: "dc",
    wert: KAT.C.bis,
    ueber: true,
    kurz: "Kat. D",
    mini: "D",
    ausrichtung: "mitte",
    titel: `Über ${zahl(KAT.C.bis)} kWp: EAG-Kategorie D`,
    text: `Höchstens ${zahl(KAT.D.satz)} €/kWp, ebenfalls ${KAT.D.reihung}. Gefördert wird anteilig bis ${zahl(MAX_KWP)} kWp und höchstens ${zahl(DECKEL * 100)} % der Investition.`,
    quelle: QUELLE_EAG,
    link: { href: "/ratgeber/eag-investitionszuschuss", label: "EAG-Investitionszuschuss erklärt" },
  },
  {
    id: "oemag",
    lineal: "dc",
    wert: OEMAG_REGELN.grenzeKwp,
    ueber: false,
    kurz: "OeMAG",
    mini: "OeMAG",
    ausrichtung: "links",
    titel: `Ab ${zahl(OEMAG_REGELN.grenzeKwp)} kW Engpassleistung: keine Abnahmepflicht der OeMAG`,
    text: `Überschuss nimmt die OeMAG zum Marktpreis nur von Anlagen unter ${zahl(OEMAG_REGELN.grenzeKwp)} kW Engpassleistung ab (§ 13 ÖSG 2012, Vertrag bis ${OEMAG_REGELN.vertragBis}). Darüber verkaufen Sie ihn über einen Stromhändler oder Direktvermarkter.`,
    quelle: `OeMAG – Marktpreis und Abnahmeregeln · Stand ${OEMAG_STAND.label}`,
    link: { href: "/service/direktvermarktung", label: "Direktvermarktung des Überschusses" },
  },
  {
    id: "eag-max",
    lineal: "dc",
    wert: MAX_KWP,
    ueber: true,
    kurz: "EAG ≤ 1 MWp",
    mini: "1 MWp",
    ausrichtung: "rechts",
    titel: `Über ${zahl(MAX_KWP)} kWp: Zuschuss nur bis ${zahl(MAX_KWP)} kWp`,
    text: `Der EAG-Investitionszuschuss gilt anteilig bis ${zahl(MAX_KWP)} kWp – die Leistung darüber wird nicht bezuschusst.`,
    quelle: QUELLE_EAG,
    link: { href: "/ratgeber/eag-investitionszuschuss", label: "EAG-Investitionszuschuss erklärt" },
  },
];

/** Tore des AC-Lineals (kW am Netzanschlusspunkt). */
export const AC_TORE = [
  {
    id: "typ-b",
    lineal: "ac",
    wert: TOR_GRENZEN.B,
    ueber: false,
    kurz: "TOR Typ B",
    mini: "Typ B",
    ausrichtung: "mitte",
    titel: `Ab ${zahl(TOR_GRENZEN.B)} kW AC: TOR Typ B`,
    text: "Es zählt die Summe am Netzanschlusspunkt – Wechselrichter, Speicher-Wechselrichter und bestehende Erzeugung. Typ B verlangt unter anderem Blindleistung bis cos φ 0,925 und eine Wirkleistungsvorgabe in Stufen; geregelt wird das meist über einen Parkregler.",
    quelle: `E-Control: ${TYPEN.B.regelwerk}`,
    link: { href: "/ratgeber/tor-erzeuger-netzanschluss", label: "TOR Erzeuger und Netzanschluss" },
  },
  {
    id: "fernwirk",
    lineal: "ac",
    wert: 1000,
    ueber: false,
    kurz: "Fernwirk · 1 MW",
    mini: "1 MW",
    ausrichtung: "mitte",
    titel: "Ab 1 MW AC: Fernwirkschnittstelle",
    text: "Ab 1 MW verlangt TOR Typ B eine Fernwirkschnittstelle nach Wahl des Netzbetreibers – mit Online-Sollwerten und Umschaltung des Blindleistungsverfahrens.",
    quelle: `E-Control: ${TYPEN.B.regelwerk}`,
    link: { href: "/technik/parkregler", label: "Parkregler und Leittechnik" },
  },
];

export const ALLE_TORE = [...DC_TORE, ...AC_TORE];
export const torMitId = (id) => ALLE_TORE.find((t) => t.id === id) || null;

/** Ist das Tor beim Wert durchschritten? */
export const torOffen = (tor, wert) => (tor.ueber ? wert > tor.wert : wert >= tor.wert);

// ---------------------------------------------------------------------------------------------------
// Netzebenen-Bänder (Richtwerte aus der bisherigen Tabelle: NE 7 bis etwa 100–250 kWp, NE 6 etwa
// 150 kWp – 1 MWp, NE 5 etwa 0,5 – 10 MWp). Trapez in log-Achse: a (beginnt) · b (voll) · c (voll) · d (endet).
// ---------------------------------------------------------------------------------------------------

export const NE_BAENDER = [
  { ne: 7, a: 20, b: 20, c: 100, d: 250, name: "NE 7", lang: "Niederspannung" },
  { ne: 6, a: 150, b: 250, c: 700, d: 1000, name: "NE 6", lang: "Trafostation des Netzbetreibers" },
  { ne: 5, a: 500, b: 800, c: 10000, d: 10000, name: "NE 5", lang: "Mittelspannung" },
];

/** Gewicht 0 … 1 eines Bands bei kWp (log-Trapez). */
export function bandGewicht(band, kwp) {
  const k = Math.max(LINEAL.min, kwp);
  const l = Math.log;
  if (k < band.a || k > band.d) return 0;
  if (k < band.b) return (l(k) - l(band.a)) / (l(band.b) - l(band.a));
  if (k <= band.c) return 1;
  return band.d > band.c ? (l(band.d) - l(k)) / (l(band.d) - l(band.c)) : 1;
}

/** Typische Netzebenen bei kWp (Richtwert), stärkste zuerst. */
export function typischeNe(kwp) {
  return NE_BAENDER.map((b) => ({ ne: b.ne, w: bandGewicht(b, kwp) }))
    .filter((x) => x.w >= 0.12)
    .sort((x, y) => y.w - x.w)
    .map((x) => x.ne);
}

/** CSS-Verlauf eines Bands über die Linealbreite (weiche Kanten). */
export function bandVerlauf(band, farbe) {
  const [pa, pb, pc, pd] = [band.a, band.b, band.c, band.d].map((v) => Math.min(100, pos(v)).toFixed(2));
  const leer = "rgba(255,255,255,0)";
  return `linear-gradient(to right, ${band.a <= LINEAL.min ? farbe : leer} ${pa}%, ${farbe} ${pb}%, ${farbe} ${pc}%, ${band.d >= LINEAL.max ? farbe : leer} ${pd}%)`;
}

export const NETZEBENE_TEXT = {
  7: { kurz: "Niederspannungsnetz", lang: "Netzebene 7: Anschluss am Niederspannungsnetz (0,4 kV) – Hausanschluss oder eigener Anschlusskasten." },
  6: { kurz: "Trafostation des Netzbetreibers", lang: "Netzebene 6: eigener Abgang an der Niederspannungsseite der Trafostation des Netzbetreibers." },
  5: { kurz: "kundeneigene Trafostation mit MS-Schaltanlage", lang: "Netzebene 5: Anschluss an der Mittelspannung über eine kundeneigene Trafostation mit Mittelspannungs-Schaltanlage." },
};

export const NE_OPTIONEN = [
  { id: 7, label: "NE 7" },
  { id: 6, label: "NE 6" },
  { id: 5, label: "NE 5" },
];

// ---------------------------------------------------------------------------------------------------
// Ansicht
// ---------------------------------------------------------------------------------------------------

/** Startzustand des Kapitels (Konzept: 280 kWp, NE 6, ohne Speicher). */
export const START = { kwp: 280, ne: 6, speicherKw: 0, bestandKw: 0 };

/** Kleinste kWp, ab der die Summe bei Wechselrichter-Vorschlag (kWp ÷ 1,15) Typ B erreicht. */
export function typBAbKwp(speicherKw = 0, bestandKw = 0) {
  const rest = TOR_GRENZEN.B - Math.max(0, speicherKw) - Math.max(0, bestandKw);
  if (rest <= 0) return LINEAL.min;
  let k = Math.max(1, Math.ceil((rest - 0.5) * DC_AC_VORSCHLAG - 1e-9));
  while (acVorschlag(k) < rest) k += 1;
  while (k > 1 && acVorschlag(k - 1) >= rest) k -= 1;
  return k;
}

/**
 * Ansichtsmodell aus dem Bedienzustand.
 * @param {{kwp:number, wrEigen:number|null, speicherKw:number, bestandKw:number, ne:number, aktivesTor?:string, beruehrt?:boolean}} z
 */
export function ansichtModell(z) {
  const kwp = Math.max(LINEAL.min, Math.min(LINEAL.max, Number(z.kwp) || START.kwp));
  const vorschlag = acVorschlag(kwp);
  const wr = z.wrEigen != null && Number.isFinite(z.wrEigen) ? Math.max(0, z.wrEigen) : vorschlag;
  const sp = Math.max(0, Number(z.speicherKw) || 0);
  const bestand = Math.max(0, Number(z.bestandKw) || 0);
  const ac = acSumme({ wrKva: wr, speicherKva: sp, bestandKw: bestand });
  const tor = torTyp(ac);
  const typB = tor.typ === "B" || tor.typ === "C" || tor.typ === "D";
  const ne = [5, 6, 7].includes(Number(z.ne)) ? Number(z.ne) : START.ne;
  const folgtVorschlag = z.wrEigen == null || wr === vorschlag;
  const bAb = folgtVorschlag ? typBAbKwp(sp, bestand) : null;
  const speicherMachtB = typB && sp > 0 && wr + bestand < TOR_GRENZEN.B;
  const typisch = typischeNe(kwp);

  const dcTore = DC_TORE.map((t) => ({ ...t, x: pos(t.wert), offen: torOffen(t, kwp) }));
  const acTore = AC_TORE.map((t) => ({ ...t, x: pos(t.wert), offen: torOffen(t, ac) }));
  // ohne Wahl: das höchste durchschrittene AC-Tor (TOR-Typ ist das Thema), sonst das höchste DC-Tor
  const aktivesTor = torMitId(z.aktivesTor) ? z.aktivesTor : letztesOffenes(acTore) || letztesOffenes(dcTore) || "kat-c";

  return {
    kwp,
    vorschlag,
    wr,
    wrEigen: !folgtVorschlag,
    sp,
    bestand,
    ac,
    tor,
    typB,
    typText: tor.typ === "–" ? "kein TOR-Typ" : `TOR Typ ${tor.typ}`,
    knapp: tor.knapp,
    knappHinweis: tor.knapp ? KNAPP_HINWEIS : null,
    luftBisB: typB ? 0 : Math.max(0, TOR_GRENZEN.B - ac),
    ratio: wr > 0 ? kwp / wr : DC_AC_VORSCHLAG,
    bAb,
    speicherMachtB,
    fernwirk: ac >= 1000,
    ne,
    typisch,
    typischText: typischText(typisch),
    neUntypisch: typisch.length > 0 && !typisch.includes(ne),
    anforderungen: (TYPEN[tor.typ] || TYPEN.A).anforderungen,
    regelwerk: (TYPEN[tor.typ] || TYPEN.A).regelwerk,
    x: {
      kwp: pos(kwp),
      wr: pos(wr),
      sp: pos(wr + sp),
      ac: pos(ac),
      bAb: bAb != null ? pos(bAb) : null,
      knappVon: pos(230),
      knappBis: pos(270),
    },
    dcTore,
    acTore,
    aktivesTor,
    beruehrt: !!z.beruehrt,
    erkenntnisArt: speicherMachtB ? "speicher" : "ac",
  };
}

function letztesOffenes(tore) {
  let id = null;
  for (const t of tore) if (t.offen) id = t.id;
  return id;
}

function typischText(liste) {
  if (!liste.length) return "";
  const n = liste.map((x) => `NE ${x}`);
  return n.length === 1 ? `typisch ${n[0]}` : `typisch ${n[0]}, auch ${n.slice(1).join(" oder ")}`;
}

/** Satz zur Typ-B-Schwelle in kWp (Ablesung). */
export function schwellenSatz(v) {
  if (v.bAb == null) {
    return v.typB
      ? "Mit Ihrer Wechselrichterleistung zählt allein die AC-Seite – sie liegt über 250 kW."
      : `Mit Ihrer Wechselrichterleistung zählt allein die AC-Seite: noch ${zahl(v.luftBisB)} kW bis Typ B.`;
  }
  const zusatz = v.sp > 0 || v.bestand > 0;
  if (v.bAb <= LINEAL.min) return "Speicher und Bestand erreichen allein schon 250 kW – jede PV-Anlage wird damit Typ B.";
  if (!zusatz) return `Ohne Speicher wird Ihre PV ab ${zahl(v.bAb)} kWp zu Typ B (Wechselrichter = kWp ÷ ${zahl(DC_AC_VORSCHLAG, 2)}).`;
  const teile = [v.sp > 0 ? `${zahl(v.sp)} kW Speicher-WR` : null, v.bestand > 0 ? `${zahl(v.bestand)} kW Bestand` : null].filter(Boolean).join(" und ");
  return `Mit ${teile} beginnt Typ B schon bei ${zahl(v.bAb)} kWp statt bei ${zahl(typBAbKwp(0, 0))} kWp.`;
}

/**
 * Hinweis vor der ersten Bedienung – folgt der aktuellen Lage (Start 280 kWp, aber auch 655 kWp aus
 * Kapitel 03 oder ein eigener Wechselrichter), damit er nie etwas verlangt, das schon erfüllt ist.
 */
export function hinweisSatz(v) {
  if (v.typB) {
    if (v.bAb != null && v.bAb > LINEAL.min && v.kwp >= v.bAb) {
      return `Ihre Anlage liegt mit ${zahl(v.ac)} kW über 250 kW. Ziehen Sie den Läufer unter ${zahl(v.bAb)} kWp – und sehen Sie, was im Schaltbild wegfällt.`;
    }
    if (v.sp > 0 || v.bestand > 0) return `Ihre Anlage liegt mit ${zahl(v.ac)} kW über 250 kW. Nehmen Sie den Speicher-Wechselrichter heraus – und sehen Sie, was wegfällt.`;
    return `Ihre Anlage liegt mit ${zahl(v.ac)} kW über 250 kW. Ändern Sie Wechselrichter oder Speicher-WR – es zählt allein die AC-Summe.`;
  }
  if (v.bAb != null) return `Ziehen Sie den Läufer über ${zahl(v.bAb)} kWp – oder nehmen Sie den Speicher-Wechselrichter aus Kapitel 05 dazu.`;
  return `Noch ${zahl(v.luftBisB)} kW bis Typ B – erhöhen Sie Wechselrichter oder Speicher-WR. Es zählt allein die AC-Summe.`;
}

/** Erkenntnis-Sätze (beide stehen im HTML, sichtbar ist der zum Zustand passende – feste Höhe, kein Springen). */
export const ERKENNTNIS_K6 = {
  speicher: "Erst der Speicher-Wechselrichter macht Ihre Anlage zu Typ B.",
  ac: "Maßgeblich ist die AC-Leistung am Netzanschlusspunkt – nicht die kWp.",
};

// ---------------------------------------------------------------------------------------------------
// Einlinienschaltbild
// ---------------------------------------------------------------------------------------------------

/**
 * Knotenfolge vom PV-Generator bis zum Netz. Der Trafo behält bei NE 6 und NE 5 dieselbe Kennung –
 * er wandert beim Wechsel über den Netzanschlusspunkt in Ihre Anlage (kundeneigene Station).
 */
export function einlinie(v) {
  const k = [
    { id: "pv", art: "pv", name: ["PV-Generator"], wert: `${zahl(v.kwp)} kWp` },
    { id: "wr", art: "wr", name: ["Wechselrichter"], wert: `${zahl(v.wr)} kVA` },
  ];
  // Abzweige (T am AC-Bus): Speicher mit eigenem Wechselrichter, bestehende Erzeugung am selben Anschluss
  if (v.sp > 0) k.push({ id: "abzweig", art: "abzweig", ast: "speicher", name: [], wert: "", astText: ["Speicher-WR", `${zahl(v.sp)} kW`] });
  if (v.bestand > 0) k.push({ id: "bestand", art: "abzweig", ast: "bestand", name: [], wert: "", astText: ["Bestand", `${zahl(v.bestand)} kW`] });
  let nap;
  if (v.ne === 5) {
    k.push({ id: "trafo", art: "trafo", name: ["Kundeneigene", "Trafostation"], wert: "0,4 kV / MS" });
    k.push({ id: "ms-anlage", art: "ms-anlage", name: ["MS-Schaltanlage mit", "Übergabe und Zähler"], wert: "" });
    nap = k.length - 1;
    k.push({ id: "netz-ms", art: "ms-netz", name: ["Mittelspannungs-", "netz"], wert: "Netzebene 5" });
  } else if (v.ne === 6) {
    k.push({ id: "zaehler", art: "zaehler", name: ["Zähler und", "Übergabe"], wert: "" });
    nap = k.length - 1;
    k.push({ id: "trafo", art: "trafo", name: ["Trafostation des", "Netzbetreibers"], wert: "Netzebene 6" });
    k.push({ id: "netz-ms", art: "ms-netz", name: ["Mittelspannungs-", "netz"], wert: "" });
  } else {
    k.push({ id: "zaehler", art: "zaehler", name: ["Zähler und", "Übergabe"], wert: "" });
    nap = k.length - 1;
    k.push({ id: "netz-ns", art: "ns-netz", name: ["Niederspannungs-", "netz"], wert: "0,4 kV · Netzebene 7" });
  }
  return { knoten: k, nap, speicher: v.sp > 0, spText: `${zahl(v.sp)} kW`, parkregler: v.typB, fernwirk: v.fernwirk, ne: v.ne };
}

const r1 = (n) => Math.round(n * 10) / 10;

/** Querformat (≥ 1.024 px): Bus waagrecht, Regelung darüber, Speicher darunter. */
export const QUER = { w: 1000, h: 330, bus: 182, sym: 48, links: 78, rechts: 922, kopf: { y: 14, h: 50 } };

export function layoutQuer(e) {
  const L = QUER;
  const n = e.knoten.length;
  const dx = (L.rechts - L.links) / Math.max(1, n - 1);
  const knoten = e.knoten.map((kn, i) => ({ ...kn, x: r1(L.links + i * dx), y: L.bus }));
  const xNap = r1((knoten[e.nap].x + knoten[e.nap + 1].x) / 2);
  const xWr = knoten.find((kn) => kn.id === "wr").x;
  const abz = knoten.find((kn) => kn.id === "abzweig");
  const kopfY = L.kopf.y;
  const kopfU = kopfY + L.kopf.h;
  const pW = 176;
  const pX = r1(Math.max(pW / 2 + 12, Math.min(xNap - pW / 2 - 18, (xWr + xNap) / 2)));
  const nbW = 160;
  const nbX = r1(Math.min(L.w - nbW / 2 - 8, Math.max(xNap + 20, (xNap + L.w) / 2 + 20)));
  const p = { x: pX - pW / 2, y: kopfY, w: pW, h: L.kopf.h };
  const nb = { x: nbX - nbW / 2, y: kopfY, w: nbW, h: L.kopf.h };
  const luecke = nb.x - (p.x + p.w);
  const fwW = Math.max(110, Math.min(150, luecke - 24));
  const fw = { x: r1(p.x + p.w + (luecke - fwW) / 2), y: kopfY, w: fwW, h: L.kopf.h };
  const symOben = L.bus - L.sym / 2;
  const klemme = (x) => Math.max(p.x + 14, Math.min(p.x + p.w - 14, x));

  const steuerWr = `M${klemme(xWr)} ${kopfU} V${kopfU + 40} H${xWr} V${symOben}`;
  const bwr = abz ? { x: abz.x, y: L.bus + 74 } : null;
  const steuerSp = bwr ? `M${klemme(bwr.x - 44)} ${kopfU} V${kopfU + 40} H${bwr.x - 44} V${bwr.y} H${bwr.x - 20}` : null;
  const messX = p.x + p.w - 14;
  const messung = `M${messX} ${kopfU} V${kopfU + 50} H${xNap} V${L.bus}`;
  const sollwert = `M${nb.x} ${kopfY + L.kopf.h / 2} H${p.x + p.w + 6}`;

  return {
    w: L.w,
    h: L.h,
    sym: L.sym,
    richtung: "quer",
    knoten,
    xNap,
    bus: { x1: knoten[0].x, y1: L.bus, x2: knoten[n - 1].x, y2: L.bus },
    zone: { x: xNap, y: L.bus - 58, w: L.w - xNap, h: L.h - (L.bus - 58) - 4 },
    zoneText: { anlage: { x: 8, y: L.bus - 44 }, netz: { x: xNap + 12, y: L.bus - 44 } },
    // Beschriftung rechts neben der gestrichelten Linie (nicht mittig darauf – sonst wird sie durchgestrichen)
    nap: { x1: xNap, y1: L.bus - 58, x2: xNap, y2: L.h - 8, tx: xNap + 8, ty: L.h - 14, anker: "start" },
    bwr,
    batt: bwr ? { x: bwr.x + 58, y: bwr.y } : null,
    battText: bwr ? { x: bwr.x + 29, y: bwr.y + 40 } : null,
    p,
    nb,
    fw,
    steuerWr,
    steuerSp,
    messung,
    messPunkt: { x: xNap, y: L.bus },
    sollwert,
    sollText: { x: r1(fw.x + fw.w / 2), y: kopfU + 19, zeilen: ["Sollwerte des Netzbetreibers:", "Wirkleistung, Q(U) / cos φ"] },
    tags: tagsFuer(knoten, (a, b) => ({ x: r1((a.x + b.x) / 2), y: L.bus - 12, anker: "middle" })),
  };
}

/**
 * Hochformat (alle Breiten – auf dem Desktop steht es rechts neben den Linealen, damit Ursache und Wirkung
 * in einem Blickfeld liegen): Bus senkrecht links, Beschriftung rechts, Regelung als Leiste oben.
 */
export const HOCH = { w: 360, h: 448, busX: 60, sym: 36, oben: 124, unten: 418 };

export function layoutHoch(e) {
  const L = HOCH;
  // Abstand VOR einem Knoten (Einheiten): alle gleich – der Speicher-Abzweig braucht so viel Luft wie ein
  // Hauptknoten, sonst klemmen „DC“ und „AC“ zwischen den Symbolen (QA 12.10.)
  const gewicht = e.knoten.map(() => 1);
  const napLuecke = 0.45;
  const summe = gewicht.slice(1).reduce((s, g) => s + g, 0) + napLuecke;
  // Mindestens 54 Einheiten je Knoten: mit Speicher UND Bestand (7 Knoten) wächst das Bild nach unten,
  // statt die Beschriftungen zusammenzuschieben. Bis 6 Knoten bleibt die Höhe fest (448).
  const einheit = Math.max(54, (L.unten - L.oben) / Math.max(1, summe));
  const h = Math.max(L.h, Math.round(L.oben + einheit * summe + (L.h - L.unten)));
  let y = L.oben;
  const knoten = e.knoten.map((kn, i) => {
    if (i > 0) y += einheit * gewicht[i] + (i === e.nap + 1 ? einheit * napLuecke : 0);
    return { ...kn, x: L.busX, y: r1(y) };
  });
  const yNap = r1(knoten[e.nap].y + (knoten[e.nap + 1].y - knoten[e.nap].y) * 0.5);
  const wr = knoten.find((kn) => kn.id === "wr");
  const abz = knoten.find((kn) => kn.id === "abzweig");
  const kopf = { y: 6, h: 44 };
  const p = { x: 6, y: kopf.y, w: 112, h: kopf.h };
  const fw = { x: 128, y: kopf.y, w: 104, h: kopf.h };
  const nb = { x: 242, y: kopf.y, w: 112, h: kopf.h };
  const lane = 16;
  const symL = L.busX - L.sym / 2;
  const bwr = abz ? { x: 140, y: abz.y } : null;
  return {
    w: L.w,
    h,
    sym: L.sym,
    richtung: "hoch",
    knoten,
    yNap,
    bus: { x1: L.busX, y1: knoten[0].y, x2: L.busX, y2: knoten[knoten.length - 1].y },
    zone: { x: 0, y: yNap, w: L.w, h: h - yNap },
    zoneText: { anlage: { x: L.w - 6, y: L.oben - 22 }, netz: { x: L.w - 6, y: yNap + 18 } },
    nap: { x1: 0, y1: yNap, x2: L.w, y2: yNap, tx: L.w - 8, ty: yNap - 7, anker: "end" },
    bwr,
    batt: bwr ? { x: bwr.x + 56, y: bwr.y } : null,
    battText: bwr ? { x: bwr.x + 56 + 26, y: bwr.y - 3, anker: "start" } : null,
    p,
    nb,
    fw,
    steuerWr: `M${lane} ${kopf.y + kopf.h} V${wr.y} H${symL}`,
    // Steuerleitung zum Speicher von OBEN (über dem Abzweig) – unten liefe sie durch das Etikett „AC“
    steuerSp: bwr ? `M${lane} ${kopf.y + kopf.h} V${bwr.y - 25} H${bwr.x} V${bwr.y - 17}` : null,
    messung: `M${lane} ${kopf.y + kopf.h} V${yNap} H${L.busX}`,
    messPunkt: { x: L.busX, y: yNap },
    sollwert: `M${nb.x} ${kopf.y + kopf.h / 2} H${p.x + p.w + 6}`,
    sollText: { x: 26, y: kopf.y + kopf.h + 19, zeilen: ["Sollwerte des Netzbetreibers:", "Wirkleistung, Q(U) / cos φ"], anker: "start" },
    tags: tagsFuer(knoten, (a, b) => ({ x: L.busX - 9, y: r1((a.y + b.y) / 2 + 4), anker: "end" }), true),
  };
}

/**
 * Kurze Leitungs-Etiketten (DC, AC 0,4 kV, MS) zwischen benachbarten Knoten. Im Hochformat (kurz) sitzt
 * „AC“ auf dem Abschnitt NACH den Abzweigen – direkt unter dem Wechselrichter stieße es an dessen Symbol.
 */
function tagsFuer(knoten, lage, kurz = false) {
  const t = [];
  const i = (id) => knoten.findIndex((kn) => kn.id === id);
  const iPv = i("pv");
  const iWr = i("wr");
  if (iPv >= 0 && iWr === iPv + 1) t.push({ id: "dc", text: "DC", ...lage(knoten[iPv], knoten[iWr]) });
  if (iWr >= 0 && knoten[iWr + 1]) {
    let a = iWr;
    if (kurz) while (knoten[a + 1]?.art === "abzweig" && knoten[a + 2]) a += 1;
    t.push({ id: "ac", text: kurz ? "AC" : "AC 0,4 kV", ...lage(knoten[a], knoten[a + 1]) });
  }
  const iTr = i("trafo");
  if (iTr >= 0 && knoten[iTr + 1]) t.push({ id: "ms", text: "MS", ...lage(knoten[iTr], knoten[iTr + 1]) });
  return t;
}
