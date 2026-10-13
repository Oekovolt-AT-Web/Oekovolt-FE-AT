// src/components/GewerbeUnikat/K7Kurve.js
//
// K7 · Saldo-Kurve: kumulierter Cashflow des STATISCHEN Rechenwegs über 15 Jahre – REINE Komponente
// (keine Hooks, kein "use client"). Die Server-Hülle zeichnet sie im Startzustand (Saldo-Platzhalter), die
// Bühne (K7SaldoKurve) misst die Breite und lässt die Werte gleiten.
//
//  - Linie „Ihre Werte“ (ov-600): fällt beim Kauf um die Investition nach EAG-Zuschuss, steigt danach jedes
//    Jahr um denselben Jahresüberschuss – genau die Tabelle, keine Alterung, keine Preissteigerung.
//  - Geisterlinie „Rechenbeispiel“ (ink, gestrichelt) mit Amortisationspunkt: zeigt, wohin der Einwand oder
//    die eigene Annahme die Rechnung schiebt. Im Startzustand liegen beide aufeinander.
//  - Warten verschiebt den Kauf nach rechts: Der senkrechte Abstand zur Geisterlinie ist genau
//    Jahresüberschuss ÷ 12 × Monate (Rechenfakt des Warte-Reglers, kein Countdown).
//  - Amortisation als Punkt auf der Nulllinie mit Lot auf die Jahresachse; die Achse wird zur Ablesung.
//  - Fläche „zurückverdient“ (ov-100) zwischen Linie und Nulllinie, Minus-Zone wie im Fächer.
//
// Farben wie im Fächer (eine Farbe = eine Bedeutung): ov = Wert/Ersparnis, Raster 8 %, Nulllinie ink 45 %.

import { FARBE, zahl } from "./_tokens.js";

/** Geometrie-Grundwerte (px). Höhe fest → kein CLS; Breite wird gemessen. */
export const KURVE = { jahre: 15, l: 36, r: 78, t: 18, b: 24, schrift: 10.5 };
/** Höhe der Kurve im Saldo (px). */
export const KURVE_HOEHE = 156;

const K = {
  linie: FARBE.ov600,
  text: FARBE.ov700,
  geist: FARBE.ink400,
  geistText: FARBE.ink500,
  achse: FARBE.ink500,
  null: "rgba(21,26,36,0.45)",
  minus: "rgba(21,26,36,0.035)",
  plus: FARBE.ov100,
};

/** Tausend Euro mit echtem Minus („−210“). */
const tsd = (v) => zahl(Math.round(v / 1000));

/**
 * Zielwerte der Kurve aus Rechenweg (r) und Rechenbeispiel (r0): Investition nach Zuschuss, Jahresüberschuss,
 * Verzögerung in Jahren und die y-Domäne (gleitet mit, damit die Geisterlinie nie springt).
 * @returns {{ I:number, J:number, d:number, lo:number, hi:number }}
 */
export function kurveZiel(r, r0, monate = 0) {
  const T = KURVE.jahre;
  const I = Math.max(0, r.investition);
  const J = r.jahr;
  const d = Math.min(2, Math.max(0, monate / 12));
  const ende = -I + (T - d) * J;
  const ende0 = -r0.investition + T * r0.jahr;
  const min = Math.min(0, -I, -r0.investition, ende, ende0);
  const max = Math.max(0, ende, ende0);
  const spanne = max - min || 1;
  return { I, J, d, lo: min - spanne * 0.05, hi: max + spanne * 0.1 };
}

/**
 * Pixel-Geometrie.
 * @param {{I:number, J:number, d:number, lo:number, hi:number}} v aktuelle (ggf. gleitende) Werte
 * @param {{investition:number, jahr:number}} r0 Rechenbeispiel
 * @param {number} w Breite (px) · @param {number} h Höhe (px)
 */
export function kurveGeo(v, r0, w, h) {
  const g = KURVE;
  const T = g.jahre;
  const x0 = g.l;
  const x1 = Math.max(x0 + 40, w - g.r);
  const yo = g.t;
  const yu = h - g.b;
  const x = (t) => x0 + (Math.min(T, Math.max(0, t)) / T) * (x1 - x0);
  const y = (e) => yo + ((v.hi - e) / (v.hi - v.lo || 1)) * (yu - yo);

  const ende = -v.I + (T - v.d) * v.J;
  const ende0 = -r0.investition + T * r0.jahr;
  const yNull = y(0);

  // Linie: Warten (auf der Nulllinie) → Kauf (senkrecht) → Jahresüberschüsse
  const pts = v.d > 0.001 ? [[x(0), yNull], [x(v.d), yNull], [x(v.d), y(-v.I)], [x1, y(ende)]] : [[x(0), yNull], [x(0), y(-v.I)], [x1, y(ende)]];
  const geist = [[x(0), yNull], [x(0), y(-r0.investition)], [x1, y(ende0)]];

  const a = v.J > 0 ? v.d + v.I / v.J : null; // Amortisation (Jahre ab heute)
  const a0 = r0.jahr > 0 ? r0.investition / r0.jahr : null;
  const imBild = a != null && a <= T;

  // Fläche „zurückverdient“: Dreieck zwischen Linie und Nulllinie ab der Amortisation
  const plus = imBild && ende > 0 ? `M${x(a)},${yNull}L${x1},${y(ende)}L${x1},${yNull}Z` : "";

  // Direktbeschriftung am rechten Ende (zwei Zeilen je Linie): erst auseinanderschieben, dann in den
  // Zeichenbereich holen – dabei bleibt der Mindestabstand erhalten (sonst überdrucken sich die Zeilen)
  const zeile = g.schrift * 1.25;
  const gap = zeile * 2 + 3;
  const obenMin = yo + zeile * 0.4;
  const untenMax = yu - zeile * 1.1;
  const eOben = y(ende) <= y(ende0);
  let oben = Math.min(y(ende), y(ende0));
  let unten = Math.max(y(ende), y(ende0));
  if (unten - oben < gap) {
    const mitte = (oben + unten) / 2;
    oben = mitte - gap / 2;
    unten = mitte + gap / 2;
  }
  if (oben < obenMin) {
    unten += obenMin - oben;
    oben = obenMin;
  }
  if (unten > untenMax) {
    oben -= unten - untenMax;
    unten = untenMax;
  }
  const yE = eOben ? oben : unten;
  const yG = eOben ? unten : oben;
  const yAllein = Math.min(untenMax, Math.max(obenMin, y(ende)));

  return {
    w,
    h,
    x0,
    x1,
    yo,
    yu,
    yNull,
    linie: pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""),
    geist: geist.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""),
    plus,
    I: v.I,
    yKauf: y(-v.I),
    xKauf: x(v.d),
    a,
    a0,
    xA: imBild ? x(a) : null,
    xA0: a0 != null && a0 <= T ? x(a0) : null,
    ende,
    ende0,
    yEnde: y(ende),
    yE,
    yG,
    yAllein,
    ticks: [0, 5, 10, 15].map((j) => ({ j, x: x(j) })),
  };
}

/**
 * Die Kurve als SVG (Breite = viewBox-Breite in px, Schrift wird nicht skaliert).
 * @param {object} p
 * @param {ReturnType<typeof kurveGeo>} p.geo
 * @param {boolean} p.gleich  Ihre Werte = Rechenbeispiel (Geisterlinie und zweite Beschriftung aus)
 * @param {string} [p.label]  Textalternative (role="img")
 */
export function KurveSvg({ geo, gleich, label, className }) {
  const s = KURVE.schrift;
  const zeigeGeist = !gleich;
  const aText = geo.a == null ? "keine" : geo.xA == null ? `> ${KURVE.jahre} J.` : `${zahl(geo.a, 1)} J.`;
  const geistLabel = zeigeGeist && geo.xA0 != null && (geo.xA == null || Math.abs(geo.xA0 - geo.xA) > 34);
  // Achsbeschriftungen, die eine Amortisations-Ablesung verdecken würde, treten zurück
  const sperre = [geo.xA, geistLabel ? geo.xA0 : null].filter((q) => q != null);
  const frei = (x) => sperre.every((q) => Math.abs(x - q) > 24);
  return (
    <svg
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      width="100%"
      height="100%"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{ display: "block", overflow: "visible", touchAction: "pan-y" }}
    >
      {/* Minus-Zone unter der Nulllinie */}
      <rect x={geo.x0} y={geo.yNull} width={Math.max(0, geo.x1 - geo.x0)} height={Math.max(0, geo.yu - geo.yNull)} fill={K.minus} />
      {/* zurückverdient */}
      {geo.plus && <path d={geo.plus} fill={K.plus} />}

      {/* Achsen */}
      <g fontSize={s} fill={K.achse} className="ov-num">
        <text x={geo.x0 - 7} y={geo.yNull} dy="0.32em" textAnchor="end">
          0
        </text>
        {geo.yKauf - geo.yNull > s * 1.4 && (
          <text x={geo.x0 - 7} y={geo.yKauf} dy="0.32em" textAnchor="end">
            {tsd(-geo.I)}
          </text>
        )}
        <text x={geo.x0 - 7} y={geo.yo - 7} textAnchor="end" fontWeight={600} fill={FARBE.ink700}>
          Tsd. €
        </text>
        {geo.ticks.map((t) =>
          frei(t.x) ? (
            <text key={t.j} x={t.x} y={geo.yu + s + 7} textAnchor={t.j === KURVE.jahre ? "end" : t.j === 0 ? "start" : "middle"}>
              {t.j === KURVE.jahre ? `${t.j} J.` : t.j}
            </text>
          ) : null
        )}
      </g>

      {/* Geisterlinie: Rechenbeispiel */}
      <g style={{ opacity: zeigeGeist ? 1 : 0, transition: "opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <path d={geo.geist} fill="none" stroke={K.geist} strokeWidth={1.25} strokeDasharray="3 3" strokeLinejoin="round" />
        {geo.xA0 != null && <circle cx={geo.xA0} cy={geo.yNull} r={3.25} fill="#fff" stroke={K.geist} strokeWidth={1.5} />}
        {geistLabel && (
          <text x={geo.xA0} y={geo.yu + s + 7} textAnchor="middle" fontSize={s} fill={K.geistText} className="ov-num">
            {zahl(geo.a0, 1)}
          </text>
        )}
      </g>

      {/* Nulllinie */}
      <line x1={geo.x0} x2={geo.x1} y1={geo.yNull} y2={geo.yNull} stroke={K.null} strokeWidth={1} shapeRendering="crispEdges" />

      {/* Ihre Werte (Endpunkt markiert, dort setzt die Direktbeschriftung an) */}
      <path d={geo.linie} fill="none" stroke={K.linie} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={geo.x1} cy={geo.yEnde} r={3} fill={K.linie} />

      {/* Amortisation: Punkt, Lot, Ablesung auf der Jahresachse */}
      {geo.xA != null ? (
        <g>
          <line x1={geo.xA} x2={geo.xA} y1={geo.yNull} y2={geo.yu} stroke={K.linie} strokeWidth={1} strokeDasharray="2 3" />
          <circle cx={geo.xA} cy={geo.yNull} r={4.5} fill={K.linie} stroke="#fff" strokeWidth={2} />
          <text x={geo.xA} y={geo.yu + s + 7} textAnchor={geo.xA > geo.x1 - 14 ? "end" : "middle"} fontSize={s} fontWeight={800} fill={K.text} className="ov-num">
            {aText}
          </text>
        </g>
      ) : (
        <text x={geo.x1} y={geo.yu + s + 7} textAnchor="end" fontSize={s} fontWeight={800} fill={K.text} className="ov-num">
          {aText === "keine" ? "keine Amortisation" : aText}
        </text>
      )}

      {/* Direktbeschriftung am rechten Ende */}
      <g fontSize={s}>
        <g transform={`translate(${geo.x1 + 7} ${gleich ? geo.yAllein : geo.yE})`}>
          <text dy="-0.15em" fontWeight={800} fill={K.text}>
            {gleich ? "Rechenbeispiel" : "Ihre Werte"}
          </text>
          <text dy="1.05em" fill={K.text} className="ov-num">
            {tsd(geo.ende)} Tsd. €
          </text>
        </g>
        {zeigeGeist && (
          <g transform={`translate(${geo.x1 + 7} ${geo.yG})`}>
            <text dy="-0.15em" fontWeight={700} fill={K.geistText}>
              Beispiel
            </text>
            <text dy="1.05em" fill={K.geistText} className="ov-num">
              {tsd(geo.ende0)} Tsd. €
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

/** Textalternative der Kurve (ein Satz, deutsch). */
export function kurveLabel(geo, gleich) {
  const amort = geo.a == null ? "ohne Amortisation" : geo.xA == null ? `Amortisation nach mehr als ${KURVE.jahre} Jahren` : `Amortisation nach ${zahl(geo.a, 1)} Jahren`;
  const ihre = `${amort}, nach ${KURVE.jahre} Jahren kumuliert ${tsd(geo.ende)} Tausend Euro`;
  return gleich
    ? `Kumulierter Cashflow des Rechenbeispiels, statisch über ${KURVE.jahre} Jahre: ${ihre}.`
    : `Kumulierter Cashflow, statisch über ${KURVE.jahre} Jahre – Ihre Werte: ${ihre}; Rechenbeispiel: Amortisation nach ${zahl(geo.a0, 1)} Jahren, ${tsd(geo.ende0)} Tausend Euro.`;
}

/** Gleichheit (für Geisterlinie und Beschriftung) – auf Anzeige-Genauigkeit. */
export const kurveGleich = (v, r0) => Math.abs(v.I - r0.investition) < 50 && Math.abs(v.J - r0.jahr) < 5 && v.d < 0.001;

/**
 * Startzustand für die Server-Hülle: zwei feste Breiten (Tablet: volle Saldo-Breite, Desktop: Saldo-Spalte),
 * per CSS umgeschaltet – gleiche Höhe wie in der Bühne (kein CLS).
 */
export function KurveStatisch({ r, r0, hoehe = KURVE_HOEHE }) {
  const v = kurveZiel(r, r0, 0);
  return (
    <>
      {[
        { w: 640, klasse: "hidden md:block lg:hidden" },
        { w: 304, klasse: "hidden lg:block" },
      ].map(({ w, klasse }) => {
        const geo = kurveGeo(v, r0, w, hoehe);
        return (
          <div key={w} className={klasse} style={{ height: hoehe }}>
            <KurveSvg geo={geo} gleich label={kurveLabel(geo, true)} />
          </div>
        );
      })}
    </>
  );
}
