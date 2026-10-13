// src/components/GewerbeUnikat/K6Einlinie.js
//
// K6 · Einlinienschaltbild – REINE Komponente (ohne Hooks, ohne "use client"). Zeichnet die Kette
// PV-Generator → Wechselrichter → (Speicher-Abzweig) → Zähler/Übergabe → Netzebene → Netz als SVG,
// im Querformat (≥ 1.024 px) oder Hochformat. Ab TOR Typ B kommen Parkregler (EZA-Regler), die
// gestrichelten Sollwert- und Steuerleitungen und ab 1 MW die Fernwirkschnittstelle dazu; vorher stehen
// sie als blasse „Schatten“ da (was ab 250 kW dazukäme).
//  - Server: statisch mit k = STATISCH_E (Platzhalter = Startzustand, keine Bibliothek).
//  - Client (K6Lineal): dieselbe Zeichnung mit motion-Elementen (k.G, k.Path …) und AnimatePresence
//    (k.Praesenz): Bauteile blenden mit opacity + 8 px ein, Leitungen zeichnen sich per pathLength –
//    LINEAR über k.zeichnen (≈ 450 ms), damit man den Strich wirklich laufen sieht. Ab Typ B in Folge:
//    Parkregler-Kasten → Sollwert vom Netzbetreiber (sofort) → Steuer- und Messleitungen (+ 0,22 s).
// Schematisch – keine Planungsunterlage (Kennzeichnung in der Hülle).

import { FARBE } from "./_tokens";

function Durch({ children }) {
  return children;
}

/** Statischer Komponentensatz (Server und Rückfall). */
export const STATISCH_E = { bewegt: false, G: "g", Path: "path", Line: "line", Rect: "rect", Circle: "circle", Praesenz: Durch };

const TINTE = FARBE.ink900;
const SIGNAL = FARBE.ink600;
const SPEICHER = FARBE.ov700;
const NETZ = FARBE.navy700;

/** Lage eines Bauteils: statisch als transform-Attribut, bewegt als motion-Ziel (Einblenden + 8 px). */
function lage(k, x, y, { neu = true } = {}) {
  if (!k.bewegt) return { transform: `translate(${x} ${y})` };
  return {
    initial: neu ? { opacity: 0, x, y: y + 8 } : false,
    animate: { opacity: 1, x, y },
    exit: { opacity: 0, transition: { duration: k.ruhig ? 0 : 0.18 } },
    transition: k.feder,
  };
}

/** Einblenden ohne Ortswechsel (Schatten, Texte). */
function blende(k, sichtbar = 1) {
  if (!k.bewegt) return { opacity: sichtbar };
  return { initial: { opacity: 0 }, animate: { opacity: sichtbar }, exit: { opacity: 0, transition: { duration: k.ruhig ? 0 : 0.18 } }, transition: { duration: k.ruhig ? 0 : 0.32 } };
}

/** Leitung, die sich beim Erscheinen zeichnet (pathLength, linear) und bei Lageänderung mitgleitet (d). */
function Leitung({ k, d, id, gestrichelt = false, farbe = TINTE, breite = 1.5, w, h, pfeil, verzoegerung = 0 }) {
  const basis = { fill: "none", stroke: farbe, strokeWidth: breite, strokeLinecap: "round", strokeLinejoin: "round" };
  const marker = pfeil ? { markerEnd: `url(#${pfeil})` } : {};
  if (!k.bewegt) return <path d={d} {...basis} strokeDasharray={gestrichelt ? "4 4" : undefined} {...marker} />;
  const zeichnen = k.ruhig ? { duration: 0 } : { ...k.zeichnen, delay: verzoegerung };
  if (!gestrichelt) {
    return (
      <k.Path
        d={d}
        {...basis}
        {...marker}
        initial={{ pathLength: 0, d, opacity: 1 }}
        animate={{ pathLength: 1, d, opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: k.ruhig ? 0 : 0.18 } }}
        transition={{ pathLength: zeichnen, d: k.feder, opacity: { duration: 0 } }}
      />
    );
  }
  // Gestrichelt: Strichmuster bleibt, gezeichnet wird über eine Maske (pathLength auf der Maske)
  return (
    <k.G initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: k.ruhig ? 0 : 0.18 } }}>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
        <k.Path d={d} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="butt" initial={{ pathLength: 0, d }} animate={{ pathLength: 1, d }} transition={{ pathLength: zeichnen, d: k.feder }} />
      </mask>
      <k.Path d={d} {...basis} {...marker} strokeDasharray="4 4" mask={`url(#${id})`} initial={{ d }} animate={{ d }} transition={{ d: k.feder }} />
    </k.G>
  );
}

// ---------------------------------------------------------------------------------------------------
// Symbole (zentriert auf 0,0; Größe s) – angelehnt an die Schaltzeichen nach IEC 60617, vereinfacht
// ---------------------------------------------------------------------------------------------------

function Symbol({ art, s, quer, farbe = TINTE }) {
  const h = s / 2;
  const rahmen = { fill: FARBE.weiss, stroke: farbe, strokeWidth: 1.5 };
  const linie = { stroke: farbe, strokeWidth: 1.25, fill: "none", strokeLinecap: "round" };
  switch (art) {
    case "pv":
      return (
        <g>
          <rect x={-h} y={-h} width={s} height={s} rx={3} {...rahmen} />
          {[-1, 1].map((c) => (
            <line key={`v${c}`} x1={(c * s) / 6} y1={-h} x2={(c * s) / 6} y2={h} {...linie} strokeWidth={0.9} />
          ))}
          <line x1={-h} y1={0} x2={h} y2={0} {...linie} strokeWidth={0.9} />
          <path d={`M${-h + 4} ${h - 4} L${h - 4} ${-h + 4}`} {...linie} strokeWidth={0.9} opacity={0.45} />
        </g>
      );
    case "wr":
      return (
        <g>
          <rect x={-h} y={-h} width={s} height={s} rx={3} {...rahmen} />
          <line x1={-h} y1={h} x2={h} y2={-h} {...linie} />
          <line x1={-h + s * 0.14} y1={-h + s * 0.2} x2={-h + s * 0.4} y2={-h + s * 0.2} {...linie} />
          <line x1={-h + s * 0.14} y1={-h + s * 0.3} x2={-h + s * 0.4} y2={-h + s * 0.3} {...linie} />
          <path
            d={`M${h - s * 0.42} ${h - s * 0.24} q${s * 0.07} ${-s * 0.1} ${s * 0.14} 0 t${s * 0.14} 0`}
            {...linie}
          />
        </g>
      );
    case "batterie":
      return (
        <g>
          <rect x={-h} y={-h} width={s} height={s} rx={3} {...rahmen} />
          <line x1={-s * 0.08} y1={-s * 0.26} x2={-s * 0.08} y2={s * 0.26} {...linie} strokeWidth={1.4} />
          <line x1={s * 0.08} y1={-s * 0.14} x2={s * 0.08} y2={s * 0.14} {...linie} strokeWidth={3} />
          <line x1={-h} y1={0} x2={-s * 0.08} y2={0} {...linie} />
          <line x1={s * 0.08} y1={0} x2={h} y2={0} {...linie} />
        </g>
      );
    case "zaehler":
      return (
        <g>
          <rect x={-h} y={-h} width={s} height={s} rx={3} {...rahmen} />
          <text y={4} textAnchor="middle" fontSize={s * 0.24} fontWeight={700} fill={farbe} style={{ fontVariantNumeric: "tabular-nums" }}>
            kWh
          </text>
        </g>
      );
    case "trafo": {
      const r = s * 0.3;
      const d = s * 0.17;
      const [ax, ay, bx, by] = quer ? [-d, 0, d, 0] : [0, -d, 0, d];
      return (
        <g>
          <circle cx={ax} cy={ay} r={r} fill={FARBE.weiss} stroke={farbe} strokeWidth={1.5} />
          <circle cx={bx} cy={by} r={r} fill={FARBE.weiss} stroke={farbe} strokeWidth={1.5} />
          <circle cx={ax} cy={ay} r={r} fill="none" stroke={farbe} strokeWidth={1.5} />
        </g>
      );
    }
    case "ms-anlage":
      return (
        <g>
          <rect x={-h} y={-h} width={s} height={s} rx={3} {...rahmen} />
          <rect x={-s * 0.2} y={-s * 0.2} width={s * 0.4} height={s * 0.4} fill="none" stroke={farbe} strokeWidth={1.25} />
          <line x1={-s * 0.2} y1={-s * 0.2} x2={s * 0.2} y2={s * 0.2} {...linie} />
          <line x1={-s * 0.2} y1={s * 0.2} x2={s * 0.2} y2={-s * 0.2} {...linie} />
        </g>
      );
    case "ns-netz":
    case "ms-netz": {
      const breite = art === "ms-netz" ? 5 : 3.5;
      return quer ? (
        <g>
          <line x1={0} y1={-h} x2={0} y2={h} stroke={NETZ} strokeWidth={breite} strokeLinecap="round" />
          {[-0.3, 0, 0.3].map((f) => (
            <line key={f} x1={0} y1={f * s} x2={s * 0.22} y2={f * s} stroke={NETZ} strokeWidth={1.25} strokeLinecap="round" />
          ))}
        </g>
      ) : (
        <g>
          <line x1={-h} y1={0} x2={h} y2={0} stroke={NETZ} strokeWidth={breite} strokeLinecap="round" />
          {[-0.3, 0, 0.3].map((f) => (
            <line key={f} x1={f * s} y1={0} x2={f * s} y2={s * 0.22} stroke={NETZ} strokeWidth={1.25} strokeLinecap="round" />
          ))}
        </g>
      );
    }
    case "generator":
      return (
        <g>
          <circle r={h} fill={FARBE.weiss} stroke={farbe} strokeWidth={1.5} />
          <text y={4.5} textAnchor="middle" fontSize={s * 0.32} fontWeight={700} fill={farbe}>
            G
          </text>
        </g>
      );
    case "abzweig":
      return <circle r={4} fill={TINTE} />;
    default:
      return null;
  }
}

/** Beschriftung eines Hauptknotens (Name fett, Wert tabellarisch). */
function Beschriftung({ kn, quer, s }) {
  const zeilen = [...kn.name.map((t) => ({ t, wert: false })), ...(kn.wert ? [{ t: kn.wert, wert: true }] : [])];
  if (!zeilen.length) return null;
  const zh = 16;
  if (quer) {
    return (
      <text textAnchor="middle" y={s / 2 + 20}>
        {zeilen.map((z, i) => (
          <tspan
            key={i}
            x={0}
            dy={i === 0 ? 0 : zh}
            fontSize={z.wert ? 12.5 : 13.5}
            fontWeight={z.wert ? 500 : 650}
            fill={z.wert ? FARBE.ink600 : FARBE.ink900}
            style={z.wert ? { fontVariantNumeric: "tabular-nums" } : undefined}
          >
            {z.t}
          </tspan>
        ))}
      </text>
    );
  }
  const y0 = -((zeilen.length - 1) * zh) / 2 + 4.5;
  return (
    <text x={s / 2 + 20} y={y0}>
      {zeilen.map((z, i) => (
        <tspan
          key={i}
          x={s / 2 + 20}
          dy={i === 0 ? 0 : zh}
          fontSize={z.wert ? 13 : 14}
          fontWeight={z.wert ? 500 : 650}
          fill={z.wert ? FARBE.ink600 : FARBE.ink900}
          style={z.wert ? { fontVariantNumeric: "tabular-nums" } : undefined}
        >
          {z.t}
        </tspan>
      ))}
    </text>
  );
}

/** Kasten der Regelung (Parkregler, Fernwirkschnittstelle, Netzbetreiber) – fest oder als Schatten; Ursprung oben links. */
function Kasten({ w, h, zeilen, art, schatten }) {
  const fest = {
    parkregler: { fill: FARBE.navy950, stroke: "none", t1: FARBE.weiss, t2: "rgba(255,255,255,0.72)" },
    fernwirk: { fill: FARBE.weiss, stroke: FARBE.navy950, t1: FARBE.ink900, t2: FARBE.ink600 },
    netzbetreiber: { fill: FARBE.navy100, stroke: "none", t1: FARBE.navy800, t2: FARBE.navy700 },
  }[art];
  const f = schatten ? { fill: FARBE.weiss, stroke: FARBE.ink300, t1: FARBE.ink500, t2: FARBE.ink500 } : fest;
  const mx = w / 2;
  return (
    <g>
      <rect width={w} height={h} rx={10} fill={f.fill} stroke={f.stroke} strokeWidth={f.stroke === "none" ? 0 : 1.25} strokeDasharray={schatten ? "4 4" : undefined} />
      <text textAnchor="middle" x={mx} y={h / 2 - 3}>
        <tspan x={mx} fontSize={13.5} fontWeight={700} fill={f.t1}>
          {zeilen[0]}
        </tspan>
        <tspan x={mx} dy={15} fontSize={12} fontWeight={500} fill={f.t2}>
          {zeilen[1]}
        </tspan>
      </text>
    </g>
  );
}

/**
 * @param {object} p
 * @param {ReturnType<import("./K6Modell").layoutQuer>} p.lay  Layout (quer oder hoch) aus K6Modell
 * @param {object} p.e     einlinie()-Modell
 * @param {object} [p.k]   Komponentensatz (STATISCH_E oder motion)
 * @param {string} p.id    eindeutiges Präfix für Marker/Masken
 */
export default function K6Einlinie({ lay, e, k = STATISCH_E, id, className, titel }) {
  const quer = lay.richtung === "quer";
  const s = lay.sym;
  const P = k.Praesenz;
  const pfeil = `${id}-pfeil`;
  const ast = (kn) => (quer ? { x: kn.x, y: lay.bus.y1 + 74 } : { x: 140, y: kn.y });
  const astLinie = (kn) => {
    const a = ast(kn);
    return quer ? `M${kn.x} ${kn.y} V${a.y - s * 0.43}` : `M${kn.x} ${kn.y} H${a.x - s * 0.43}`;
  };
  const astS = s * 0.86;

  return (
    <svg
      viewBox={`0 0 ${lay.w} ${lay.h}`}
      className={className}
      role="img"
      aria-label={titel}
      style={{ touchAction: "pan-y", fontFamily: "inherit" }}
      data-richtung={lay.richtung}
    >
      <defs>
        <marker id={pfeil} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0.8 L7.2 4 L0 7.2 z" fill={SIGNAL} />
        </marker>
      </defs>

      {/* Zonen: rechts bzw. unten des Netzanschlusspunkts liegt das Netz des Netzbetreibers */}
      {k.bewegt ? (
        <k.Rect initial={false} animate={{ x: lay.zone.x, y: lay.zone.y, width: lay.zone.w, height: lay.zone.h }} transition={k.feder} rx={16} fill={FARBE.navy50} />
      ) : (
        <rect x={lay.zone.x} y={lay.zone.y} width={lay.zone.w} height={lay.zone.h} rx={16} fill={FARBE.navy50} />
      )}
      <ZonenText k={k} lay={lay} quer={quer} />

      {/* Netzanschlusspunkt */}
      {k.bewegt ? (
        <k.Line initial={false} animate={{ x1: lay.nap.x1, y1: lay.nap.y1, x2: lay.nap.x2, y2: lay.nap.y2 }} transition={k.feder} stroke={FARBE.navy500} strokeWidth={1.25} strokeDasharray="2 4" strokeLinecap="round" />
      ) : (
        <line x1={lay.nap.x1} y1={lay.nap.y1} x2={lay.nap.x2} y2={lay.nap.y2} stroke={FARBE.navy500} strokeWidth={1.25} strokeDasharray="2 4" strokeLinecap="round" />
      )}

      {/* Bus */}
      {k.bewegt ? (
        <k.Line initial={false} animate={{ x1: lay.bus.x1, y1: lay.bus.y1, x2: lay.bus.x2, y2: lay.bus.y2 }} transition={k.feder} stroke={TINTE} strokeWidth={2} strokeLinecap="round" />
      ) : (
        <line x1={lay.bus.x1} y1={lay.bus.y1} x2={lay.bus.x2} y2={lay.bus.y2} stroke={TINTE} strokeWidth={2} strokeLinecap="round" />
      )}

      {/* Abzweige (Speicher, Bestand): Stichleitung zeichnet sich */}
      <P initial={false}>
        {e.knoten
          .filter((kn) => kn.art === "abzweig")
          .map((kn) => {
            const posKn = lay.knoten.find((x) => x.id === kn.id);
            return <Leitung key={`ast-${kn.id}`} k={k} d={astLinie(posKn)} farbe={kn.ast === "speicher" ? SPEICHER : TINTE} />;
          })}
        {e.speicher && lay.bwr && lay.batt && (
          <Leitung
            key="dc-batt"
            k={k}
            farbe={SPEICHER}
            d={quer ? `M${lay.bwr.x + astS / 2} ${lay.bwr.y} H${lay.batt.x - astS / 2}` : `M${lay.bwr.x + astS / 2} ${lay.bwr.y} H${lay.batt.x - astS / 2}`}
          />
        )}
      </P>

      {/* Regelung ab Typ B: Signalleitungen */}
      <P initial={false}>
        {e.parkregler && <Leitung key="soll" k={k} id={`${id}-m-soll`} d={lay.sollwert} gestrichelt farbe={SIGNAL} w={lay.w} h={lay.h} pfeil={pfeil} />}
        {e.parkregler && <Leitung key="st-wr" k={k} id={`${id}-m-wr`} d={lay.steuerWr} gestrichelt farbe={SIGNAL} w={lay.w} h={lay.h} pfeil={pfeil} verzoegerung={0.22} />}
        {e.parkregler && e.speicher && lay.steuerSp && (
          <Leitung key="st-sp" k={k} id={`${id}-m-sp`} d={lay.steuerSp} gestrichelt farbe={SIGNAL} w={lay.w} h={lay.h} pfeil={pfeil} verzoegerung={0.22} />
        )}
        {e.parkregler && <Leitung key="mess" k={k} id={`${id}-m-mess`} d={lay.messung} gestrichelt farbe={SIGNAL} w={lay.w} h={lay.h} verzoegerung={0.22} />}
        {e.parkregler && (
          <k.G key="messpunkt" {...lage(k, lay.messPunkt.x, lay.messPunkt.y)}>
            <circle r={4.5} fill={FARBE.weiss} stroke={SIGNAL} strokeWidth={1.5} />
          </k.G>
        )}
      </P>

      {/* Hauptknoten */}
      <P initial={false}>
        {lay.knoten.map((kn) => (
          <k.G key={kn.id} {...lage(k, kn.x, kn.y)}>
            <Symbol art={kn.art} s={s} quer={quer} />
            <Beschriftung kn={kn} quer={quer} s={s} />
          </k.G>
        ))}
      </P>

      {/* Abzweig-Bauteile */}
      <P initial={false}>
        {lay.knoten
          .filter((kn) => kn.art === "abzweig")
          .map((kn) => {
            const a = ast(kn);
            if (kn.ast === "speicher") {
              const b = { x: lay.batt.x - lay.bwr.x, y: lay.batt.y - lay.bwr.y };
              const tx = { x: lay.battText.x - lay.bwr.x, y: lay.battText.y - lay.bwr.y };
              return (
                <k.G key={`teil-${kn.id}`} {...lage(k, a.x, a.y)}>
                  <Symbol art="wr" s={astS} quer={quer} farbe={SPEICHER} />
                  <g transform={`translate(${b.x} ${b.y})`}>
                    <Symbol art="batterie" s={astS} quer={quer} farbe={SPEICHER} />
                  </g>
                  <text textAnchor={lay.battText.anker === "start" ? "start" : "middle"} x={tx.x} y={tx.y}>
                    <tspan x={tx.x} fontSize={13.5} fontWeight={650} fill={FARBE.ink900}>
                      {quer ? "Speicher-WR + Batterie" : "Speicher"}
                    </tspan>
                    <tspan x={tx.x} dy={16} fontSize={13} fontWeight={500} fill={FARBE.ink600} style={{ fontVariantNumeric: "tabular-nums" }}>
                      {kn.astText[1]}
                    </tspan>
                  </text>
                </k.G>
              );
            }
            return (
              <k.G key={`teil-${kn.id}`} {...lage(k, a.x, a.y)}>
                <Symbol art="generator" s={astS} quer={quer} farbe={FARBE.ink600} />
                <text textAnchor={quer ? "middle" : "start"} x={quer ? 0 : astS / 2 + 12} y={quer ? astS / 2 + 18 : -2}>
                  <tspan x={quer ? 0 : astS / 2 + 12} fontSize={13.5} fontWeight={650} fill={FARBE.ink900}>
                    {kn.astText[0]}
                  </tspan>
                  <tspan x={quer ? 0 : astS / 2 + 12} dy={16} fontSize={13} fontWeight={500} fill={FARBE.ink600} style={{ fontVariantNumeric: "tabular-nums" }}>
                    {kn.astText[1]}
                  </tspan>
                </text>
              </k.G>
            );
          })}
      </P>

      {/* Leitungs-Etiketten */}
      <P initial={false}>
        {lay.tags.map((t) => (
          <k.G key={`tag-${t.id}`} {...lage(k, t.x, t.y)}>
            <text textAnchor={t.anker} fontSize={12} fontWeight={600} fill={FARBE.ink500} letterSpacing="0.04em">
              {t.text}
            </text>
          </k.G>
        ))}
      </P>

      {/* Regelung: Kästen (fest ab Typ B bzw. 1 MW, sonst Schatten) */}
      <Regelung k={k} lay={lay} e={e} />
    </svg>
  );
}

function ZonenText({ k, lay, quer }) {
  const st = { fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em" };
  const anker = quer ? "start" : "end";
  return (
    <>
      <text x={lay.zoneText.anlage.x} y={lay.zoneText.anlage.y} textAnchor={anker} fill={FARBE.ink500} {...st}>
        IHRE ANLAGE
      </text>
      {k.bewegt ? (
        <k.G initial={false} animate={{ x: lay.zoneText.netz.x, y: lay.zoneText.netz.y }} transition={k.feder}>
          <text textAnchor={anker} fill={FARBE.navy700} {...st}>
            NETZBETREIBER
          </text>
        </k.G>
      ) : (
        <text x={lay.zoneText.netz.x} y={lay.zoneText.netz.y} textAnchor={anker} fill={FARBE.navy700} {...st}>
          NETZBETREIBER
        </text>
      )}
      {k.bewegt ? (
        <k.G initial={false} animate={{ x: lay.nap.tx, y: lay.nap.ty }} transition={k.feder}>
          <text textAnchor={lay.nap.anker} fontSize={12} fontWeight={600} fill={FARBE.navy500}>
            Netzanschlusspunkt
          </text>
        </k.G>
      ) : (
        <text x={lay.nap.tx} y={lay.nap.ty} textAnchor={lay.nap.anker} fontSize={12} fontWeight={600} fill={FARBE.navy500}>
          Netzanschlusspunkt
        </text>
      )}
    </>
  );
}

function Regelung({ k, lay, e }) {
  const P = k.Praesenz;
  const typB = e.parkregler;
  const fw = e.fernwirk;
  const kaesten = [
    { key: "nb", b: lay.nb, art: "netzbetreiber", fest: typB, zeilen: ["Netzbetreiber", "Leitstelle"], schatten: ["Netzbetreiber", "ab Typ B"] },
    { key: "fw", b: lay.fw, art: "fernwirk", fest: fw, zeilen: ["Fernwirk-", "schnittstelle"], schatten: ["Fernwirk", "ab 1 MW AC"] },
    { key: "p", b: lay.p, art: "parkregler", fest: typB, zeilen: ["Parkregler", "EZA-Regler"], schatten: ["Parkregler", "meist ab Typ B"] },
  ];
  return (
    <>
      {kaesten.map((c) => (
        <P key={c.key} initial={false}>
          {c.fest ? (
            <k.G key={`${c.key}-fest`} {...lage(k, c.b.x, c.b.y)}>
              <Kasten w={c.b.w} h={c.b.h} zeilen={c.zeilen} art={c.art} />
            </k.G>
          ) : (
            <k.G key={`${c.key}-schatten`} {...lage(k, c.b.x, c.b.y, { neu: false })} {...(k.bewegt ? { initial: { opacity: 0, x: c.b.x, y: c.b.y } } : {})}>
              <Kasten w={c.b.w} h={c.b.h} zeilen={c.schatten} art={c.art} schatten />
            </k.G>
          )}
        </P>
      ))}
      <P initial={false}>
        {typB && (
          <k.G key="soll-text" {...blende(k, 1)}>
            <text textAnchor={lay.sollText.anker === "start" ? "start" : "middle"} x={lay.sollText.x} y={lay.sollText.y}>
              {lay.sollText.zeilen.map((z, i) => (
                <tspan key={i} x={lay.sollText.x} dy={i === 0 ? 0 : 15} fontSize={12} fontWeight={600} fill={FARBE.ink600}>
                  {z}
                </tspan>
              ))}
            </text>
          </k.G>
        )}
      </P>
    </>
  );
}
