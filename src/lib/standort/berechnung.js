// src/lib/standort/berechnung.js
//
// Rechenkern des Standort-Checks (/standort-check). Reine Funktionen ohne Netzwerk –
// läuft im Browser und auf dem Server. Alle Werte sind ORIENTIERUNG und ersetzen keine
// Tragwerksplanung (Statik) durch eine befugte Person.
//
// Normen und Quellen (Stand 09/2026):
//  - ÖNORM B 1991-1-3:2022-05-15 – charakteristische Schneelast s_k am Boden. Seit dieser
//    Ausgabe gibt es KEINE Schneelastzonen und keine Zonenformel mehr: s_k wird direkt aus
//    der Schneelastkarte (Raster 50 m × 50 m, gültig bis 2.000 m Seehöhe) abgelesen, die
//    auf hora.gv.at veröffentlicht ist. Quellen: HORA-Legende „Schneelast“ (hora.gv.at);
//    Holzbau Austria, „Neue Schneelastnorm veröffentlicht“ (29.07.2022),
//    https://www.holzbauaustria.at/technik/2022/07/neue-schneelastnorm-veroeffentlicht.html
//  - ÖNORM EN 1991-1-3 – Dachschneelast s = μ1 · Ce · Ct · s_k (Abschnitt 5.2),
//    Formbeiwert μ1 für Pult-/Satteldächer (Tabelle 5.2), Kräfte auf Schneefänge
//    F_s = s · b · sin α (Abschnitt 6.4). Wo Schneefänge das Abrutschen verhindern, darf
//    μ1 nicht unter 0,8 abgemindert werden.
//  - ÖNORM EN 1990 / ÖNORM B 1990-1 – Teilsicherheitsbeiwert veränderliche Einwirkung γQ = 1,5.
//  - IEC 61215-2:2021, Prüfung MQT 16 (statische mechanische Belastung): Prüflast =
//    Bemessungslast × γm mit γm ≥ 1,5. Ein Modul mit „5400 Pa Prüflast“ hat also eine
//    Bemessungslast von 3600 Pa.
//  - ÖNORM B 1991-1-4 / ÖNORM EN 1991-1-4 – Basisgeschwindigkeitsdruck q_b,0 = ½ · ρ · v_b,0²
//    mit ρ = 1,25 kg/m³ (v_b,0 je Standort in HORA „Basiswindgeschwindigkeit“).
//  - Hagelregister (hagelregister.at, Elementarschaden Präventionszentrum): Hagelwiderstands-
//    klassen HW 1–5, geprüft nach VKF-Prüfbestimmungen mit Eiskugeln von 1–5 cm Durchmesser.
//  - Historisch (nur Grobschätzung, NICHT mehr normgültig): ÖNORM B 1991-1-3:2006/2018,
//    s_k = (0,642 · Z + 0,009) · [1 + (A/728)²] mit Zonenwert Z (2* = 1,6; 2 = 2; 3 = 3; 4 = 4,5),
//    anwendbar bis 1.500 m. Quelle: Wikipedia „Schneelasten in Österreich“ nach Holzbau Austria,
//    „Im Schnitt 80 Kilo weniger“ (11/2021). Laut Holzbau Austria (Schellander u. a. 2021) lagen
//    diese Werte im Mittel rund 1,16 kN/m² über den tatsächlichen Schneelasten – die Formel
//    liefert also meist konservative (zu hohe) Werte.

/** Teilsicherheitsbeiwert für veränderliche Einwirkungen (Schnee), ÖNORM EN 1990. */
export const GAMMA_Q = 1.5;
/** Mindest-Sicherheitsfaktor zwischen Prüf- und Bemessungslast, IEC 61215-2 MQT 16. */
export const GAMMA_M_MODUL = 1.5;
/** Luftdichte für den Basisgeschwindigkeitsdruck, ÖNORM EN 1991-1-4. */
export const LUFTDICHTE = 1.25;
/** Obergrenze der HORA-Schneelastkarte nach ÖNORM B 1991-1-3:2022. */
export const HORA_MAX_SEEHOEHE = 2000;
/** Anwendungsgrenze der alten Zonenformel (ÖNORM B 1991-1-3:2006/2018). */
export const ALTFORMEL_MAX_SEEHOEHE = 1500;
/** Auslastung, bis zu der wir ein Modul als „mit Reserve“ einstufen (Schneeanhäufung am Modulrand). */
export const RESERVE_GRENZE = 0.8;

/** Typische Prüflasten (Druck) von PV-Modulen laut Datenblatt, in Pa. */
export const MODULKLASSEN = [
  { id: "2400", pruef: 2400, name: "Standardmodul", text: "Übliche Prüflast vieler Standardmodule" },
  { id: "5400", pruef: 5400, name: "Schneelastmodul", text: "Verbreitete Prüflast für schneereiche Lagen" },
  { id: "8100", pruef: 8100, name: "Hochlastmodul", text: "Verstärkte Rahmen oder Glas-Glas, nur einzelne Modelle" },
].map((k) => ({ ...k, bemessung: Math.round(k.pruef / GAMMA_M_MODUL) }));

/** Zonenwerte der alten Norm (nur für die Grobschätzung). */
export const ALTZONEN = [
  { id: "2*", z: 1.6 },
  { id: "2", z: 2 },
  { id: "3", z: 3 },
  { id: "4", z: 4.5 },
];

/** Hagelkorngrößen wie in HORA ausgewiesen (Wiederkehrperiode wählbar) → empfohlene HW-Klasse. */
export const HAGELSTUFEN = [
  { id: "1", label: "≤ 1 cm", maxCm: 1 },
  { id: "2", label: "> 1 – ≤ 2 cm", maxCm: 2 },
  { id: "3", label: "> 2 – ≤ 3 cm", maxCm: 3 },
  { id: "4", label: "> 3 – ≤ 4 cm", maxCm: 4 },
  { id: "5", label: "> 4 – ≤ 5 cm", maxCm: 5 },
  { id: "6", label: "> 5 cm", maxCm: 6 },
];

const rad = (grad) => (grad * Math.PI) / 180;
const runden = (x, stellen = 2) => {
  const f = 10 ** stellen;
  return Math.round(x * f) / f;
};

/**
 * Formbeiwert μ1 nach ÖNORM EN 1991-1-3, Tabelle 5.2 (Pult- und Satteldach, je Dachseite).
 * Mit Schneefang (Abrutschen verhindert) wird μ1 nicht unter 0,8 abgemindert.
 */
export function formbeiwertMu1(neigung, schneefang = false) {
  const a = Math.max(0, Math.min(90, Number(neigung) || 0));
  let mu;
  if (a <= 30) mu = 0.8;
  else if (a < 60) mu = (0.8 * (60 - a)) / 30;
  else mu = 0;
  return schneefang ? Math.max(mu, 0.8) : mu;
}

/**
 * Dachschneelast s = μ1 · Ce · Ct · s_k (kN/m², bezogen auf die Grundrissprojektion).
 * Ce = 1,0 (normale Topografie) und Ct = 1,0 (keine Abminderung durch Wärmeverlust) als Standard.
 */
export function dachSchneelast({ sk, neigung, schneefang = false, ce = 1, ct = 1 }) {
  const mu1 = formbeiwertMu1(neigung, schneefang);
  return { mu1, ce, ct, s: mu1 * ce * ct * sk };
}

/**
 * Belastung eines Moduls aus der Dachschneelast.
 *  - proModulflaeche: vertikale Last je m² geneigter Modulfläche = s · cos α
 *  - senkrecht: Anteil senkrecht zur Moduloberfläche = s · cos² α
 *  - hangabtrieb: Anteil parallel zur Moduloberfläche = s · cos α · sin α
 * Für die Bewertung verwenden wir bewusst die volle Last je Modulfläche (s · cos α), weil sich
 * Schnee am unteren Modulrand – besonders hinter Schneefängen und Modulrahmen – anhäuft.
 */
export function modulLast(s, neigung) {
  const a = rad(Math.max(0, Math.min(90, Number(neigung) || 0)));
  return {
    proModulflaeche: s * Math.cos(a),
    senkrecht: s * Math.cos(a) ** 2,
    hangabtrieb: s * Math.cos(a) * Math.sin(a),
  };
}

/** Kraft auf einen Schneefang je Meter Traufe: F_s = s · b · sin α (kN/m), b = Grundrisstiefe bis First/nächstem Schneefang. */
export function schneefangKraft(s, neigung, tiefe) {
  return s * Math.max(0, Number(tiefe) || 0) * Math.sin(rad(Math.max(0, Math.min(90, Number(neigung) || 0))));
}

/** Basisgeschwindigkeitsdruck q_b,0 = ½ · ρ · v² in kN/m². */
export function basisGeschwindigkeitsdruck(vb0) {
  const v = Number(vb0);
  if (!Number.isFinite(v) || v <= 0) return null;
  return (0.5 * LUFTDICHTE * v * v) / 1000;
}

/** Historische Zonenformel (ÖNORM B 1991-1-3:2006/2018) – nur Grobschätzung. */
export function skAltformel(zoneId, seehoehe) {
  const zone = ALTZONEN.find((z) => z.id === zoneId);
  const a = Number(seehoehe);
  if (!zone || !Number.isFinite(a) || a < 0) return null;
  return (0.642 * zone.z + 0.009) * (1 + (a / 728) ** 2);
}

/** Empfohlene Hagelwiderstandsklasse aus der Hagelkorngröße (HW n ≙ Eiskugel n cm). */
export function hagelEmpfehlung(stufeId) {
  const stufe = HAGELSTUFEN.find((h) => h.id === stufeId);
  if (!stufe) return null;
  const hw = Math.min(5, Math.max(1, Math.ceil(stufe.maxCm)));
  return { stufe, hw, ueberHw5: stufe.maxCm > 5 };
}

/**
 * Gesamtbewertung Schnee gegen Modulklassen und Empfehlung zur Unterkonstruktion.
 * Rückgabe in kN/m² und Pa; alles gerundet für die Anzeige.
 */
export function bewerteSchnee({ sk, neigung, schneefang = false, seehoehe = null, dachtiefe = 6 }) {
  const skWert = Number(sk);
  if (!Number.isFinite(skWert) || skWert <= 0) return null;

  const { mu1, ce, ct, s } = dachSchneelast({ sk: skWert, neigung, schneefang });
  const last = modulLast(s, neigung);
  const bemessungKn = GAMMA_Q * last.proModulflaeche; // kN/m²
  const bemessungPa = bemessungKn * 1000;

  const modulListe = MODULKLASSEN.map((k) => {
    const auslastung = bemessungPa / k.bemessung;
    const status = auslastung <= RESERVE_GRENZE ? "reserve" : auslastung <= 1 ? "knapp" : "nein";
    return { ...k, auslastung, status };
  });
  const empfohlen = modulListe.find((m) => m.status === "reserve") || modulListe.find((m) => m.status === "knapp") || null;

  let unterkonstruktion;
  if (bemessungKn <= 1.6) {
    unterkonstruktion = {
      stufe: "standard",
      titel: "Standard-Unterkonstruktion mit Nachweis",
      text: "Übliche Schienensysteme reichen meist, wenn Dachhaken- und Schienenabstände nach Herstellerstatik für diese Schneelast gewählt werden.",
    };
  } else if (bemessungKn <= 3.6) {
    unterkonstruktion = {
      stufe: "verstaerkt",
      titel: "Verstärkte Unterkonstruktion",
      text: "Engere Dachhaken- bzw. Stockschraubenabstände, Hochlast-Dachhaken, gegebenenfalls Kreuzschienen oder eine dritte Schiene je Modulreihe. Modulklemmung nur in den vom Hersteller freigegebenen Klemmbereichen.",
    };
  } else {
    unterkonstruktion = {
      stufe: "hochlast",
      titel: "Hochlastsystem mit Einzelnachweis",
      text: "Hochlast-Unterkonstruktion mit statischem Einzelnachweis, Modulstützen oder zusätzliche Auflager in Modulmitte, steilere Neigung prüfen. Die Tragfähigkeit des Dachstuhls muss eine befugte Tragwerksplanung bestätigen.",
    };
  }

  const hinweise = [];
  if (seehoehe != null && seehoehe > HORA_MAX_SEEHOEHE) {
    hinweise.push("Der Standort liegt über 2.000 m. Die Schneelastkarte der ÖNORM B 1991-1-3:2022 gilt nur bis 2.000 m – darüber ist ein Schneelastgutachten sinnvoll.");
  }
  if (!empfohlen) {
    hinweise.push("Selbst Module mit 8100 Pa Prüflast reichen rechnerisch nicht aus. Nötig sind eine Sonderlösung (steilere Neigung, zusätzliche Modulauflager, Glas-Glas-Hochlastmodule) und ein statischer Einzelnachweis.");
  }
  if (!schneefang && Number(neigung) > 30) {
    hinweise.push("Ab rund 30° rutscht Schnee von glatten Moduloberflächen leicht ab. Über Wegen, Eingängen, Terrassen und Stellplätzen ist ein Schneefang praktisch Pflicht (siehe § 93 Abs. 2 StVO für Dächer an der Straße).");
  }

  return {
    sk: skWert,
    mu1,
    ce,
    ct,
    s: runden(s, 2),
    sPa: Math.round(s * 1000),
    modulFlaeche: runden(last.proModulflaeche, 2),
    senkrecht: runden(last.senkrecht, 2),
    hangabtrieb: runden(last.hangabtrieb, 2),
    bemessungKn: runden(bemessungKn, 2),
    bemessungPa: Math.round(bemessungPa),
    module: modulListe,
    empfohlen,
    unterkonstruktion,
    schneefangKraft: schneefang ? runden(schneefangKraft(s, neigung, dachtiefe), 2) : null,
    dachtiefe,
    hinweise,
  };
}
