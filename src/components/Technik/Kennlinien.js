import Reveal from "@/components/ui/Reveal";

/**
 * Zwei Standard-Kennlinien aus den TOR Stromerzeugungsanlagen als SVG:
 *  - Q(U): empfohlene Stützpunkte im Niederspannungsnetz (TOR Typ A V1.4 / Typ B V1.3, Kap. 5.3.4.2)
 *  - LFSM-O: Wirkleistungsreduktion bei Überfrequenz, 50,2 Hz / Statik 5 % (Kap. 5.1.3)
 * Die Werte sind Normvorgaben (Standardeinstellungen ohne abweichende Vorgabe
 * des Netzbetreibers), keine Produktdaten.
 */

const W = 440;
const H = 290;
const P = { l: 58, r: 18, t: 22, b: 48 };
const pw = W - P.l - P.r;
const ph = H - P.t - P.b;

function Achsen({ xTicks, yTicks, xLabel, yLabel, x, y }) {
  return (
    <g>
      {yTicks.map((t) => (
        <g key={`y${t.v}`}>
          <line x1={P.l} x2={P.l + pw} y1={y(t.v)} y2={y(t.v)} stroke={t.v === 0 ? "#97a0b0" : "#eef0f4"} strokeWidth="1" />
          <text x={P.l - 8} y={y(t.v) + 4.5} textAnchor="end" fontSize="13" fill="#6b7486">
            {t.l}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t.v}`}>
          <line x1={x(t.v)} x2={x(t.v)} y1={P.t} y2={P.t + ph} stroke="#eef0f4" strokeWidth="1" />
          <text x={x(t.v)} y={P.t + ph + 18} textAnchor="middle" fontSize="13" fill="#6b7486">
            {t.l}
          </text>
        </g>
      ))}
      <text x={P.l + pw} y={H - 6} textAnchor="end" fontSize="13" fill="#151a24" fontWeight="600">
        {xLabel}
      </text>
      <text x={8} y={P.t - 6} fontSize="13" fill="#151a24" fontWeight="600">
        {yLabel}
      </text>
    </g>
  );
}

function KennlinieQU() {
  const x = (u) => P.l + ((u - 0.9) / 0.2) * pw;
  const y = (q) => P.t + (1 - (q + 1) / 2) * ph;
  const punkte = [
    [0.9, 1],
    [0.92, 1],
    [0.96, 0],
    [1.05, 0],
    [1.08, -1],
    [1.1, -1],
  ];
  const stuetz = [
    { n: "a", u: 0.92, q: 1 },
    { n: "b", u: 0.96, q: 0 },
    { n: "c", u: 1.05, q: 0 },
    { n: "d", u: 1.08, q: -1 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="qu-titel qu-desc">
      <title id="qu-titel">Blindleistungs-Spannungs-Kennlinie Q(U)</title>
      <desc id="qu-desc">
        Bis 0,92 Un volle übererregte Blindleistung, zwischen 0,96 und 1,05 Un keine Blindleistung, ab 1,08 Un volle untererregte Blindleistung,
        dazwischen linear.
      </desc>
      <Achsen
        x={x}
        y={y}
        xTicks={[0.9, 0.92, 0.96, 1, 1.05, 1.08, 1.1].map((v) => ({ v, l: v.toFixed(2).replace(".", ",") }))}
        yTicks={[
          { v: 1, l: "+Qmax" },
          { v: 0, l: "0" },
          { v: -1, l: "−Qmax" },
        ]}
        xLabel="U / Un"
        yLabel="Q"
      />
      <rect x={x(0.96)} y={P.t} width={x(1.05) - x(0.96)} height={ph} fill="rgba(102,153,51,0.08)" />
      <text x={(x(0.96) + x(1.05)) / 2} y={y(0) - 10} textAnchor="middle" fontSize="12.5" fill="#436621">
        Totband: cos φ = 1
      </text>
      <polyline points={punkte.map(([u, q]) => `${x(u)},${y(q)}`).join(" ")} fill="none" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
      <polyline points={punkte.map(([u, q]) => `${x(u)},${y(q)}`).join(" ")} fill="none" stroke="#1f5aa1" strokeWidth="3" strokeLinejoin="round" />
      {stuetz.map((s) => (
        <g key={s.n}>
          <circle cx={x(s.u)} cy={y(s.q)} r="6" fill="#1f5aa1" stroke="#fff" strokeWidth="2" />
          <text x={x(s.u) + (s.n === "a" || s.n === "c" ? 10 : -10)} y={y(s.q) + (s.q === 1 ? 18 : s.q === -1 ? -10 : 18)} textAnchor={s.n === "a" || s.n === "c" ? "start" : "end"} fontSize="13" fontWeight="700" fill="#151a24">
            {s.n}
          </text>
        </g>
      ))}
      <text x={x(0.905)} y={y(1) - 8} fontSize="12" fill="#6b7486">
        übererregt (spannungsstützend)
      </text>
      <text x={x(1.095)} y={y(-1) + 18} textAnchor="end" fontSize="12" fill="#6b7486">
        untererregt (spannungssenkend)
      </text>
    </svg>
  );
}

function KennlinieLFSMO() {
  const x = (f) => P.l + ((f - 49.8) / 1.8) * pw;
  const y = (p) => P.t + (1 - p) * ph;
  const pBei = (f) => (f <= 50.2 ? 1 : 1 - ((f - 50.2) / 50) / 0.05);
  const pts = [49.8, 50.2, 51.5].map((f) => [f, pBei(f)]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="lf-titel lf-desc">
      <title id="lf-titel">Wirkleistungsreduktion bei Überfrequenz (LFSM-O)</title>
      <desc id="lf-desc">Ab 50,2 Hz sinkt die Wirkleistung mit einer Statik von 5 %, das entspricht 40 % der Referenzleistung je Hertz; bei 51,5 Hz liegt sie bei 48 %.</desc>
      <Achsen
        x={x}
        y={y}
        xTicks={[49.8, 50, 50.2, 50.6, 51, 51.5].map((v) => ({ v, l: v.toFixed(1).replace(".", ",") }))}
        yTicks={[1, 0.75, 0.5, 0.25, 0].map((v) => ({ v, l: `${Math.round(v * 100)} %` }))}
        xLabel="f in Hz"
        yLabel="P / Pref"
      />
      <line x1={x(51.5)} x2={x(51.5)} y1={P.t} y2={P.t + ph} stroke="#c4cad5" strokeDasharray="4 4" />
      <text x={x(51.5) - 6} y={P.t + ph - 8} textAnchor="end" fontSize="12" fill="#6b7486">
        Grenze Frequenzband 51,5 Hz
      </text>
      <polyline points={pts.map(([f, p]) => `${x(f)},${y(p)}`).join(" ")} fill="none" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
      <polyline points={pts.map(([f, p]) => `${x(f)},${y(p)}`).join(" ")} fill="none" stroke="#669933" strokeWidth="3" strokeLinejoin="round" />
      <circle cx={x(50.2)} cy={y(1)} r="6" fill="#669933" stroke="#fff" strokeWidth="2" />
      <text x={x(50.2) + 10} y={y(1) + 20} fontSize="13" fill="#151a24" fontWeight="600">
        Schwelle 50,2 Hz
      </text>
      <circle cx={x(51.5)} cy={y(pBei(51.5))} r="6" fill="#669933" stroke="#fff" strokeWidth="2" />
      <text x={x(51.5) - 10} y={y(pBei(51.5)) - 12} textAnchor="end" fontSize="13" fill="#151a24" fontWeight="600">
        48 % bei 51,5 Hz
      </text>
      <text x={x(50.85)} y={y(0.78) + 26} textAnchor="middle" fontSize="12" fill="#6b7486">
        Statik 5 % ≙ −40 % je Hz
      </text>
    </svg>
  );
}

export default function Kennlinien() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Reveal as="figure" className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-7">
        <figcaption className="mb-4">
          <span className="block font-display text-[17px] font-bold text-ink-900">Q(U)-Kennlinie – empfohlene Standard-Stützpunkte</span>
          <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-600">
            a = 0,92 Un · b = 0,96 Un · c = 1,05 Un · d = 1,08 Un; Dynamik PT1 mit τ = 5 s (einstellbar 3–60 s), 95 % des Sollwerts innerhalb 3 τ.
            Qmax/Pmax bei Typ A: 0,436.
          </span>
        </figcaption>
        <KennlinieQU />
      </Reveal>
      <Reveal as="figure" delay={100} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-7">
        <figcaption className="mb-4">
          <span className="block font-display text-[17px] font-bold text-ink-900">P(f) im LFSM-O – Standard ohne Netzbetreiber-Vorgabe</span>
          <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-600">
            Schwelle einstellbar 50,2–50,5 Hz, Statik 2–12 %; Standard 50,2 Hz und 5 %. Pref ist bei Umrichtern die Wirkleistung beim Erreichen der
            Schwelle. Messauflösung ≤ 10 mHz.
          </span>
        </figcaption>
        <KennlinieLFSMO />
      </Reveal>
    </div>
  );
}
