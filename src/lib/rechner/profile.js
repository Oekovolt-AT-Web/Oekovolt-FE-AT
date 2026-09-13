// src/lib/rechner/profile.js
//
// Gemeinsames Energiemodell aller Rechner: ein komplettes Jahr in
// Stundenschritten (8.760 h) aus typischen Tagesprofilen je Monat.
//
// Warum nicht ein "Durchschnittstag"? Ein mittlerer Tag überschätzt den
// Speichernutzen deutlich – real wechseln sonnige und trübe Tage. Deshalb
// bekommt jeder Tag einen deterministischen Bewölkungsfaktor (gleiche
// Eingabe = gleiches Ergebnis), der je Monat auf die Ertragssumme normiert ist.
//
// Kalibriert gegen die Größenordnungen des Unabhängigkeitsrechners der
// HTW Berlin (Autarkie ohne/mit Speicher für Einfamilienhäuser).
// Alles bewusst ohne React/Next-Abhängigkeiten, damit es per Node prüfbar ist.

export const MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
export const MONATE_LANG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
export const TAGE_MONAT = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Monatsanteile des PV-Jahresertrags (Süddeutschland, Summe 1)
export const PV_MONAT = [0.03, 0.05, 0.085, 0.115, 0.13, 0.13, 0.135, 0.115, 0.085, 0.06, 0.035, 0.025];

// Monatsanteile Haushaltsstrom (Standardlastprofil-Charakter, Summe 1)
export const HAUSHALT_MONAT = [0.096, 0.088, 0.089, 0.081, 0.078, 0.073, 0.074, 0.075, 0.076, 0.084, 0.089, 0.097];

// Monatsanteile Raumwärme nach Gradtagzahlen (Summe 1)
export const HEIZ_MONAT = [0.175, 0.15, 0.13, 0.085, 0.04, 0.01, 0.005, 0.005, 0.03, 0.075, 0.13, 0.165];

// Sonnenauf-/-untergang in lokaler Uhrzeit (inkl. Sommerzeit), ca. 48° N
const SONNE = [
  [8.0, 16.7], [7.4, 17.5], [6.6, 18.3], [6.6, 20.1], [5.7, 20.9], [5.3, 21.4],
  [5.5, 21.3], [6.2, 20.6], [7.0, 19.5], [7.8, 18.4], [7.4, 16.8], [8.0, 16.4],
];

// Haushalt: relative Stundenlast (Werktag/Wochenende gemittelt)
const H_HAUSHALT = [0.55, 0.45, 0.4, 0.38, 0.38, 0.42, 0.6, 0.85, 0.95, 0.9, 0.88, 0.95, 1.05, 0.98, 0.88, 0.85, 0.9, 1.1, 1.35, 1.45, 1.4, 1.25, 1.0, 0.75];
// Wärmepumpe: nachts/morgens kälter -> etwas mehr Laufzeit
const H_WP = [1.15, 1.15, 1.2, 1.2, 1.2, 1.15, 1.2, 1.15, 1.0, 0.9, 0.85, 0.8, 0.75, 0.75, 0.75, 0.8, 0.9, 1.0, 1.05, 1.05, 1.05, 1.05, 1.1, 1.1];
// E-Auto: überwiegend abends an der Wallbox, ein Teil tagsüber (Wochenende, Homeoffice)
const H_EAUTO = [0.2, 0.1, 0.05, 0, 0, 0, 0, 0, 0, 0, 0.6, 0.8, 0.8, 0.8, 0.6, 0.4, 0.6, 1.8, 2.8, 3.0, 2.8, 2.4, 1.6, 0.8];

const norm = (arr) => {
  const s = arr.reduce((a, b) => a + b, 0);
  return arr.map((v) => v / s);
};
// E-Auto: im Winter ca. 12 % mehr Verbrauch (Heizung, Akku), im Sommer weniger
export const EAUTO_MONAT = norm([1.12, 1.12, 1, 1, 1, 0.9, 0.9, 0.9, 1, 1, 1.12, 1.12]);
export const PROFIL_HAUSHALT = norm(H_HAUSHALT);
export const PROFIL_WP = norm(H_WP);
export const PROFIL_EAUTO = norm(H_EAUTO);

/** PV-Tagesform eines Monats (24 Werte, Summe 1) */
export function pvTagesform(monat) {
  const [auf, unter] = SONNE[monat];
  const form = Array.from({ length: 24 }, (_, h) => {
    let s = 0;
    // vier Stützstellen je Stunde für glatte Ränder
    for (let q = 0; q < 4; q++) {
      const t = h + (q + 0.5) / 4;
      if (t > auf && t < unter) s += Math.pow(Math.sin((Math.PI * (t - auf)) / (unter - auf)), 1.35);
    }
    return s;
  });
  return norm(form);
}
const PV_FORM = MONATE.map((_, m) => pvTagesform(m));

// Deterministischer Zufall (mulberry32)
function zufall(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bewölkungsfaktor je Tag, je Monat auf Mittelwert 1 normiert
const WETTER = (() => {
  const r = zufall(2026);
  return TAGE_MONAT.map((tage, m) => {
    const sommer = (PV_MONAT[m] - 0.025) / (0.135 - 0.025); // 0 = Winter, 1 = Hochsommer
    const pSonne = 0.22 + 0.25 * sommer;
    const pTrueb = 0.45 - 0.22 * sommer;
    const werte = Array.from({ length: tage }, () => {
      const u = r();
      const streu = 0.85 + 0.3 * r();
      // Klare Wintertage liefern ein Vielfaches des Monatsmittels, Nebel-/Schneetage fast nichts
      if (u < pSonne) return (2.6 - 1.05 * sommer) * streu;
      if (u < pSonne + pTrueb) return (0.08 + 0.27 * sommer) * streu;
      return 0.9 * streu;
    });
    const mittel = werte.reduce((a, b) => a + b, 0) / tage;
    return werte.map((w) => w / mittel);
  });
})();

// Tag-zu-Tag-Schwankung des Verbrauchs (Abwesenheit, Wochenende, Wäschetag)
const LASTTAG = (() => {
  const r = zufall(4711);
  return TAGE_MONAT.map((tage) => {
    const w = Array.from({ length: tage }, () => 0.7 + 0.6 * r());
    const mittel = w.reduce((a, b) => a + b, 0) / tage;
    return w.map((x) => x / mittel);
  });
})();
// E-Auto: nicht jeden Tag geladen – an etwa der Hälfte der Tage
const EV_TAG = (() => {
  const r = zufall(99);
  return TAGE_MONAT.map((tage) => {
    const w = Array.from({ length: tage }, () => (r() < 0.5 ? 0 : 1));
    const mittel = w.reduce((a, b) => a + b, 0) / tage || 1;
    return w.map((x) => x / mittel);
  });
})();

/**
 * Jahresreihen (8.760 Stunden) für Erzeugung und Lasten.
 * @param {object} p
 * @param {number} p.kwp            Anlagengröße
 * @param {number} p.ertragProKwp   spezifischer Ertrag kWh/kWp
 * @param {number} p.haushaltKwh    Haushaltsstrom pro Jahr
 * @param {number} p.eAutoKwh       Ladestrom E-Auto pro Jahr (0 = keins)
 * @param {number} p.wpKwh          Strom Wärmepumpe pro Jahr (0 = keine)
 * @param {number} p.wpWarmwasser   Anteil Warmwasser am WP-Strom (ganzjährig gleich)
 */
export function jahresreihen({ kwp, ertragProKwp = 1000, haushaltKwh = 0, eAutoKwh = 0, wpKwh = 0, wpWarmwasser = 0.18 }) {
  const n = 8760;
  const pv = new Float64Array(n);
  const haushalt = new Float64Array(n);
  const eauto = new Float64Array(n);
  const wp = new Float64Array(n);
  const monat = new Uint8Array(n);
  const wechselhaft = new Uint8Array(n);
  const jahresPv = kwp * ertragProKwp;
  let i = 0;
  for (let m = 0; m < 12; m++) {
    const tage = TAGE_MONAT[m];
    const pvTag = (jahresPv * PV_MONAT[m]) / tage;
    const hhTag = (haushaltKwh * HAUSHALT_MONAT[m]) / tage;
    const evTag = (eAutoKwh * EAUTO_MONAT[m]) / tage;
    const wpTag = (wpKwh * ((1 - wpWarmwasser) * HEIZ_MONAT[m] + wpWarmwasser / 12)) / tage;
    for (let d = 0; d < tage; d++) {
      const k = WETTER[m][d];
      const lastTag = LASTTAG[m][d];
      // Wärmepumpe folgt dem Wetter: trübe Tage sind kältere Tage
      const wpFaktor = 1 + 0.25 * (1 - Math.min(k, 1.6)) ;
      for (let h = 0; h < 24; h++, i++) {
        pv[i] = pvTag * k * PV_FORM[m][h];
        haushalt[i] = hhTag * lastTag * PROFIL_HAUSHALT[h];
        eauto[i] = evTag * EV_TAG[m][d] * PROFIL_EAUTO[h];
        wp[i] = wpTag * wpFaktor * PROFIL_WP[h];
        monat[i] = m;
        wechselhaft[i] = k < 1.25 ? 1 : 0;
      }
    }
  }
  // Wetterabhängigen WP-Faktor wieder auf die Jahressumme normieren
  if (wpKwh > 0) {
    const s = wp.reduce((a, b) => a + b, 0);
    for (let j = 0; j < n; j++) wp[j] *= wpKwh / s;
  }
  return { pv, haushalt, eauto, wp, monat, wechselhaft };
}

// Innerhalb einer Stunde schwankt die Last stark (Wasserkocher, Herd, Waschmaschine).
// Drei Teilzustände bilden das nach: Grundlast, mittlere Last, Spitze.
const TEIL = [
  { anteil: 0.6, faktor: 0.4 },
  { anteil: 0.28, faktor: 1.0 },
  { anteil: 0.12, faktor: (1 - 0.6 * 0.4 - 0.28) / 0.12 },
];
// Wechselhafte Tage: Wolkenzüge lassen die PV-Leistung innerhalb der Stunde springen.
const PV_TEIL_WECHSELHAFT = [
  { anteil: 0.5, faktor: 1.55 },
  { anteil: 0.5, faktor: 0.45 },
];
const PV_TEIL_KLAR = [{ anteil: 1, faktor: 1 }];
// Eigenverbrauch des Speichersystems (BMS, Standby) in kWh je Stunde
const STANDBY_KWH = 0.012;

/** Stundenbilanz ohne Speicher – unabhängig von der Speichergröße, daher einmal je Eingabe. */
function bilanz(reihen) {
  if (reihen._bilanz) return reihen._bilanz;
  const { pv, haushalt, eauto, wp, wechselhaft } = reihen;
  const n = pv.length;
  const last = new Float64Array(n);
  const direkt = new Float64Array(n);
  const ueberschuss = new Float64Array(n);
  const bedarf = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const l0 = haushalt[i] + eauto[i] + wp[i];
    const p = pv[i];
    const pvTeile = wechselhaft[i] ? PV_TEIL_WECHSELHAFT : PV_TEIL_KLAR;
    let d = 0, u = 0, b = 0;
    for (const t of TEIL) {
      const l = l0 * t.faktor;
      for (const q of pvTeile) {
        const pp = p * q.faktor;
        const w = t.anteil * q.anteil;
        if (pp > l) { d += w * l; u += w * (pp - l); } else { d += w * pp; b += w * (l - pp); }
      }
    }
    last[i] = l0; direkt[i] = d; ueberschuss[i] = u; bedarf[i] = b;
  }
  reihen._bilanz = { last, direkt, ueberschuss, bedarf };
  return reihen._bilanz;
}

/**
 * Stündliche Energiebilanz mit optionalem Speicher.
 * @param {object} reihen     Ergebnis von jahresreihen()
 * @param {number} kapazitaet Nennkapazität des Speichers in kWh (0 = ohne)
 * @param {object} opt        { wirkungsgrad (je Richtung), leistungKw, nutzbarAnteil }
 */
export function simuliere(reihen, kapazitaet = 0, opt = {}) {
  const eta = opt.wirkungsgrad ?? 0.94;
  // Nennkapazität -> nutzbar (Entladetiefe, Notstromreserve)
  const nutzbar = kapazitaet * (opt.nutzbarAnteil ?? 0.92);
  const leistung = opt.leistungKw ?? Math.max(2.5, kapazitaet * 0.5);
  const { pv, haushalt, eauto, wp, monat } = reihen;
  const B = bilanz(reihen);
  const n = pv.length;

  let soc = 0;
  let sPv = 0, sLast = 0, sDirekt = 0, sLaden = 0, sEntladen = 0, sEinspeisung = 0, sNetz = 0;
  let deckungWp = 0, deckungEv = 0, deckungHh = 0;
  const mPv = new Array(12).fill(0);
  const mLast = new Array(12).fill(0);
  const mWp = new Array(12).fill(0);
  const mWpSolar = new Array(12).fill(0);
  const mDeckung = new Array(12).fill(0);

  for (let i = 0; i < n; i++) {
    const last = B.last[i];
    const p = pv[i];
    const direkt = B.direkt[i];
    const ueberschuss = B.ueberschuss[i];
    const bedarf = B.bedarf[i];

    let laden = 0, entladen = 0;
    if (kapazitaet > 0) {
      // Laden (Energie aus PV) – begrenzt durch Leistung und freie Kapazität
      laden = Math.min(ueberschuss, leistung, (nutzbar - soc) / eta);
      soc += laden * eta;
      // Entladen (Energie an den Verbraucher)
      entladen = Math.min(bedarf, leistung, soc * eta);
      soc -= entladen / eta;
      // Standby-Verbrauch des Systems
      soc = Math.max(soc - STANDBY_KWH, 0);
    }
    const einspeisung = ueberschuss - laden;
    const netz = bedarf - entladen;
    const deckung = direkt + entladen;

    sPv += p; sLast += last; sDirekt += direkt; sLaden += laden; sEntladen += entladen;
    sEinspeisung += einspeisung; sNetz += netz;

    // Solare Deckung anteilig auf die Verbraucher verteilen
    const m = monat[i];
    if (last > 0) {
      const dWp = (deckung * wp[i]) / last;
      deckungWp += dWp;
      deckungEv += (deckung * eauto[i]) / last;
      deckungHh += (deckung * haushalt[i]) / last;
      mWpSolar[m] += dWp;
    }
    mPv[m] += p; mLast[m] += last; mWp[m] += wp[i]; mDeckung[m] += deckung;
  }

  const eigenverbrauch = sDirekt + sLaden; // selbst genutzte Erzeugung (inkl. Speicherladung)
  const autark = sDirekt + sEntladen; // aus eigener Anlage gedeckte Last
  return {
    pv: sPv,
    last: sLast,
    direkt: sDirekt,
    laden: sLaden,
    entladen: sEntladen,
    einspeisung: sEinspeisung,
    netz: sNetz,
    eigenverbrauch,
    autark,
    eigenverbrauchsquote: sPv > 0 ? eigenverbrauch / sPv : 0,
    autarkie: sLast > 0 ? autark / sLast : 0,
    vollzyklen: kapazitaet > 0 ? sEntladen / kapazitaet : 0,
    deckung: { wp: deckungWp, eauto: deckungEv, haushalt: deckungHh },
    monate: MONATE.map((name, m) => ({ name, pv: mPv[m], last: mLast[m], wp: mWp[m], wpSolar: mWpSolar[m], deckung: mDeckung[m] })),
  };
}
