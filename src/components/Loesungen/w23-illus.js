// src/components/Loesungen/w23-illus.js
//
// Kleine, gezeichnete Strich-Illustrationen für die Schritte der AblaufLeiste (Server-Komponente).
// Raster je 240 × 150 (sichtbar 8 12 224 132). Linien mit `w23-zug` (pathLength = 1) zeichnen sich,
// sobald der Schritt aufleuchtet; Flächen mit `w23-flaeche` blenden ein. Verzögerung über --d (ms).
// Farben kommen als Palette (hell/dunkel). Rein dekorativ (aria-hidden), ohne Werte.
//
// Zuordnung zum Schritt: `illu` am Item (optional) oder per Stichwort im Titel (siehe illuFuer).

const zug = (ms, extra = {}) => ({ pathLength: 1, className: "w23-zug", style: { "--d": `${ms}ms` }, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", ...extra });
const fl = (ms) => ({ className: "w23-flaeche", style: { "--d": `${ms}ms` } });
const rd = (v) => Math.round(v * 10) / 10;

export const PALETTE = {
  hell: { ink: "#03285a", leise: "rgba(3,40,90,0.14)", gruen: "#669933", gruenHell: "#aed083", sonne: "#ffc53d", flaeche: "#e6f1d8", papier: "#ffffff", modul: "#12408a", modulLinie: "rgba(255,255,255,0.4)", haken: "#ffffff" },
  dunkel: { ink: "rgba(255,255,255,0.86)", leise: "rgba(255,255,255,0.14)", gruen: "#8cba58", gruenHell: "#aed083", sonne: "#ffc53d", flaeche: "rgba(174,208,131,0.2)", papier: "rgba(255,255,255,0.06)", modul: "rgba(174,208,131,0.32)", modulLinie: "rgba(255,255,255,0.35)", haken: "#03122b" },
};

function Rahmen({ children }) {
  return (
    <svg viewBox="8 12 224 132" className="h-full w-full" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function Haken({ x, y, p, ms, r = 14 }) {
  return (
    <g {...fl(ms)}>
      <circle cx={x} cy={y} r={r} fill={p.gruen} />
      <path d={`M${x - 6} ${y + 0.5}L${x - 1.5} ${y + 5}L${x + 7} ${y - 4.5}`} stroke={p.haken} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Analyse: Viertelstundenwerte als Säulen, PV-Glocke darüber, Lupe auf der Spitze. */
function Analyse({ p }) {
  const saeulen = [30, 34, 38, 52, 64, 72, 70, 78, 86, 80, 74, 70, 62, 50, 40, 34, 30];
  return (
    <Rahmen>
      <path d="M28 18V124H216" stroke={p.ink} strokeWidth="2" {...zug(0)} />
      <g {...fl(250)}>
        {saeulen.map((h, i) => (
          <rect key={i} x={rd(36 + i * 10.6)} y={124 - h} width="6.4" height={h} rx="2" fill={p.gruen} fillOpacity={i === 8 ? 0.95 : 0.38} />
        ))}
      </g>
      <path d="M44 124C84 124 96 50 124 50C152 50 164 124 204 124Z" fill={p.sonne} fillOpacity="0.2" {...fl(700)} />
      <path d="M44 124C84 124 96 50 124 50C152 50 164 124 204 124" stroke={p.sonne} strokeWidth="2.4" {...zug(500)} />
      <g {...fl(1100)}>
        <circle cx="128" cy="34" r="15" fill={p.papier} fillOpacity="0.6" stroke={p.ink} strokeWidth="2" />
        <path d="M139 45L151 57" stroke={p.ink} strokeWidth="4" strokeLinecap="round" />
        <circle cx="128" cy="34" r="3.5" fill={p.gruen} />
      </g>
    </Rahmen>
  );
}

/** Feld/Screening: Flurkarte von oben, eine Fläche markiert, Pin und Weg zum Netz. */
function Feld({ p }) {
  return (
    <Rahmen>
      <path d="M20 46L92 30L120 74L36 98Z M92 30L176 22L190 70L120 74 M36 98L120 74L134 132L44 140 M120 74L190 70L214 124L134 132" stroke={p.ink} strokeOpacity="0.55" strokeWidth="1.6" {...zug(0)} />
      <path d="M92 30L176 22L190 70L120 74Z" fill={p.flaeche} stroke={p.gruen} strokeWidth="2.2" {...fl(450)} />
      <g {...fl(600)}>
        {[0, 1, 2, 3].map((r) => (
          <path key={r} d={`M${rd(104 + r * 2.4)} ${rd(38 + r * 9)}L${rd(176 + r * 3)} ${rd(32 + r * 9)}`} stroke={p.gruen} strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>
      <path d="M190 70C204 82 208 96 214 104" stroke={p.sonne} strokeWidth="2.2" strokeDasharray="3 5" {...zug(900)} />
      <g {...fl(1000)}>
        <path d="M214 92V122M206 98H222M208 104H220" stroke={p.ink} strokeWidth="2" strokeLinecap="round" />
      </g>
      <g {...fl(800)}>
        <path d="M142 14C133 14 127 20 127 28C127 39 142 52 142 52C142 52 157 39 157 28C157 20 151 14 142 14Z" fill={p.gruen} />
        <circle cx="142" cy="28" r="5" fill={p.haken} />
      </g>
    </Rahmen>
  );
}

/** Wirtschaftlichkeit/Förderung: kumulierter Verlauf von Minus ins Plus, Münzstapel. */
function Rechnung({ p }) {
  const balken = [-34, -28, -21, -13, -5, 4, 13, 22, 31, 40];
  const null_ = 88;
  return (
    <Rahmen>
      <path d="M26 20V132" stroke={p.ink} strokeWidth="2" {...zug(0)} />
      <path d={`M26 ${null_}H186`} stroke={p.ink} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="3 4" {...zug(150)} />
      <g {...fl(350)}>
        {balken.map((b, i) => (
          <rect key={i} x={34 + i * 15} y={b < 0 ? null_ : null_ - b} width="9" height={Math.abs(b)} rx="2" fill={b < 0 ? p.ink : p.gruen} fillOpacity={b < 0 ? 0.2 : 0.75} />
        ))}
      </g>
      <path d="M38 126L53 120L68 113L83 105L98 97L113 88L128 79L143 70L158 61L173 52" stroke={p.gruen} strokeWidth="2.4" {...zug(600)} />
      <g {...fl(1000)}>
        {[0, 1, 2].map((n) => (
          <g key={n}>
            <ellipse cx="208" cy={124 - n * 9} rx="16" ry="5.5" fill={p.sonne} stroke={p.ink} strokeOpacity="0.5" strokeWidth="1.2" />
          </g>
        ))}
        <ellipse cx="208" cy="97" rx="16" ry="5.5" fill={p.sonne} stroke={p.ink} strokeOpacity="0.5" strokeWidth="1.2" />
        <path d="M204 97H212" stroke={p.ink} strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </Rahmen>
  );
}

/** Netz & Genehmigung: Antrag mit Stempel, daneben Mast mit Leitung. */
function Antrag({ p }) {
  return (
    <Rahmen>
      <path d="M30 22H98L116 40V134H30Z" fill={p.papier} stroke={p.ink} strokeWidth="2" {...zug(0)} />
      <path d="M98 22V40H116" stroke={p.ink} strokeWidth="2" {...zug(350)} />
      <path d="M42 54H104M42 66H104M42 78H92M42 90H100M42 102H80" stroke={p.ink} strokeOpacity="0.35" strokeWidth="2" {...zug(450)} />
      <path d="M176 134V34M160 48H192M164 62H188M168 134L176 100L184 134" stroke={p.ink} strokeWidth="2" {...zug(300)} />
      <path d="M160 48C140 56 132 60 116 70M192 48C206 54 212 58 226 66" stroke={p.ink} strokeOpacity="0.4" strokeWidth="1.5" {...zug(800)} />
      <Haken x={104} y={118} p={p} ms={1100} r={15} />
    </Rahmen>
  );
}

/** Sicherung: Vertrag mit Unterschrift und Stift, Flurstück im Hintergrund. */
function Vertrag({ p }) {
  return (
    <Rahmen>
      <path d="M150 34L212 26L220 96L160 104Z" fill={p.flaeche} stroke={p.gruen} strokeWidth="1.8" {...fl(300)} />
      <path d="M44 28H128V134H44Z" fill={p.papier} stroke={p.ink} strokeWidth="2" {...zug(0)} />
      <path d="M56 46H116M56 58H116M56 70H104" stroke={p.ink} strokeOpacity="0.35" strokeWidth="2" {...zug(350)} />
      <path d="M56 114H116" stroke={p.ink} strokeOpacity="0.5" strokeWidth="1.5" {...zug(500)} />
      <path d="M60 108C66 94 70 112 76 100C80 92 82 108 88 104C92 101 96 98 104 102" stroke={p.gruen} strokeWidth="2.4" {...zug(800)} />
      <g {...fl(1050)}>
        <path d="M108 104L150 62L158 70L116 112L104 116Z" fill={p.sonne} stroke={p.ink} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M146 66L154 74" stroke={p.ink} strokeWidth="1.6" />
      </g>
    </Rahmen>
  );
}

/** Nutzungskonzept: Querschnitt – vertikale Modulreihen, Traktor dazwischen, Bemaßung. */
function Konzept({ p }) {
  return (
    <Rahmen>
      <path d="M14 122H226" stroke={p.ink} strokeWidth="2" {...zug(0)} />
      {[40, 200].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 122V40`} stroke={p.ink} strokeWidth="2" {...zug(150 + i * 120)} />
          <rect x={x - 4} y="44" width="8" height="52" rx="1.5" fill={p.modul} stroke={p.ink} strokeWidth="1.4" {...fl(450 + i * 120)} />
        </g>
      ))}
      <g {...fl(750)}>
        <path d="M84 104V84H112L118 70H136V104" fill={p.flaeche} stroke={p.gruen} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="96" cy="108" r="12" fill={p.papier} stroke={p.ink} strokeWidth="2.2" />
        <circle cx="96" cy="108" r="4" fill={p.ink} />
        <circle cx="134" cy="112" r="8" fill={p.papier} stroke={p.ink} strokeWidth="2.2" />
        <path d="M122 70V84H136" stroke={p.ink} strokeOpacity="0.5" strokeWidth="1.4" fill="none" />
      </g>
      <path d="M48 26H192M48 21V31M192 21V31" stroke={p.gruen} strokeWidth="1.8" {...zug(1000)} />
      {[60, 74, 160, 174].map((x) => (
        <path key={x} d={`M${x} 122V114M${x} 118Q${x - 3} 116 ${x - 4} 112M${x} 117Q${x + 3} 115 ${x + 4} 111`} stroke={p.gruen} strokeWidth="1.5" fill="none" strokeLinecap="round" {...fl(600)} />
      ))}
    </Rahmen>
  );
}

/** Bau & Montage: Modultische im Profil, ein Modul wird eingesetzt, Inbetriebnahme-Haken. */
function Bau({ p }) {
  return (
    <Rahmen>
      <path d="M14 124H226" stroke={p.ink} strokeWidth="2" {...zug(0)} />
      {[0, 92].map((dx, i) => (
        <g key={dx}>
          <path d={`M${dx + 46} 96V124M${dx + 86} 74V124M${dx + 46} 108L${dx + 86} 86`} stroke={p.ink} strokeWidth="2" {...zug(150 + i * 200)} />
          <path d={`M${dx + 30} 100L${dx + 102} 61L${dx + 106} 68L${dx + 34} 107Z`} fill={p.modul} stroke={p.ink} strokeWidth="1.5" {...fl(450 + i * 200)} />
          <path d={`M${dx + 54} 87L${dx + 58} 94M${dx + 78} 74L${dx + 82} 81`} stroke={p.modulLinie} strokeWidth="1" {...fl(500 + i * 200)} />
        </g>
      ))}
      <path d="M136 26L162 15L164 20L138 31Z" fill={p.modul} stroke={p.ink} strokeWidth="1.4" strokeLinejoin="round" {...fl(800)} />
      <path d="M150 34V52M144 46L150 52L156 46" stroke={p.gruen} strokeWidth="2" {...zug(900)} />
      <Haken x={34} y={36} p={p} ms={1150} />
    </Rahmen>
  );
}

/** Betrieb & Monitoring: Bildschirm mit Tagesgang, Status-Punkt, Wartung. */
function Betrieb({ p }) {
  return (
    <Rahmen>
      <rect x="26" y="20" width="150" height="92" rx="9" fill={p.papier} stroke={p.ink} strokeWidth="2" {...zug(0)} />
      <path d="M101 112V124M80 126H122" stroke={p.ink} strokeWidth="2" {...zug(300)} />
      <path d="M40 96C70 96 78 46 101 46C124 46 132 96 162 96Z" fill={p.flaeche} {...fl(700)} />
      <path d="M40 96C70 96 78 46 101 46C124 46 132 96 162 96" stroke={p.gruen} strokeWidth="2.6" {...zug(400)} />
      <path d="M40 96H162" stroke={p.ink} strokeOpacity="0.25" strokeWidth="1.5" {...zug(350)} />
      <g {...fl(900)}>
        <circle cx="160" cy="33" r="8" fill={p.gruenHell} fillOpacity="0.45" />
        <circle cx="160" cy="33" r="4" fill={p.gruen} />
        <rect x="38" y="30" width="34" height="5" rx="2.5" fill={p.ink} fillOpacity="0.2" />
      </g>
      <g {...fl(1150)}>
        <circle cx="202" cy="96" r="21" fill={p.gruen} />
        <path d="M209 85a7 7 0 0 0-9 9l-9 9a2.5 2.5 0 0 0 3.5 3.5l9-9a7 7 0 0 0 9-9l-4.2 4.2-3.3-0.9-0.9-3.3z" fill="none" stroke={p.haken} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </Rahmen>
  );
}

/** Ausbau: Anlage mit Sammelleitung, später ergänzt um Speicher, Ladepunkt und Wärmepumpe. */
function Ausbau({ p }) {
  return (
    <Rahmen>
      <path d="M22 48L70 30L74 37L26 55Z" fill={p.modul} stroke={p.ink} strokeWidth="1.5" {...fl(200)} />
      <path d="M48 46V72H206" stroke={p.ink} strokeWidth="2" {...zug(0)} />
      {[
        { x: 88, ms: 500 },
        { x: 142, ms: 700 },
        { x: 196, ms: 900 },
      ].map((a) => (
        <path key={a.x} d={`M${a.x} 72V88`} stroke={p.ink} strokeWidth="2" {...zug(a.ms)} />
      ))}
      <g {...fl(600)}>
        <rect x="74" y="88" width="28" height="40" rx="5" fill={p.papier} stroke={p.ink} strokeWidth="2" />
        <rect x="80" y="112" width="16" height="10" rx="1.5" fill={p.gruen} />
        <rect x="80" y="100" width="16" height="9" rx="1.5" fill={p.gruen} fillOpacity="0.45" />
        <path d="M84 85H92" stroke={p.ink} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g {...fl(800)}>
        <rect x="130" y="88" width="24" height="40" rx="5" fill={p.papier} stroke={p.ink} strokeWidth="2" />
        <path d="M144 96L138 106H146L140 116" stroke={p.sonne} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M154 112C164 112 166 124 172 128" stroke={p.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g {...fl(1000)}>
        <rect x="178" y="88" width="36" height="32" rx="5" fill={p.papier} stroke={p.ink} strokeWidth="2" />
        <circle cx="196" cy="104" r="9" fill="none" stroke={p.ink} strokeOpacity="0.6" strokeWidth="1.6" />
        <path d="M196 95V113M187 104H205" stroke={p.ink} strokeOpacity="0.45" strokeWidth="1.4" />
      </g>
      {[88, 142, 196].map((x, i) => (
        <g key={x} {...fl(1100 + i * 100)}>
          <circle cx={x + 16} cy="58" r="8" fill={p.gruen} />
          <path d={`M${x + 12} 58H${x + 20}M${x + 16} 54V62`} stroke={p.haken} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </Rahmen>
  );
}

export const ILLUS = { analyse: Analyse, feld: Feld, rechnung: Rechnung, antrag: Antrag, vertrag: Vertrag, konzept: Konzept, bau: Bau, betrieb: Betrieb, ausbau: Ausbau };
const REIHE = ["analyse", "rechnung", "antrag", "bau", "betrieb", "ausbau"];

/** Passende Illustration zum Schritt: explizit (item.illu) oder per Stichwort im Titel. */
export function illuFuer(item, i) {
  if (item?.illu && ILLUS[item.illu]) return item.illu;
  const t = String(item?.title || "").toLowerCase();
  if (/ausbau|erweiter/.test(t)) return "ausbau";
  if (/(^|\s)bau\b|montage|umsetzung|errichtung/.test(t)) return "bau";
  if (/screening|feldbesuch|flächen/.test(t)) return "feld";
  if (/lastgang|analyse|potenzial|hofbesuch|erhebung/.test(t)) return "analyse";
  if (/konzept/.test(t)) return "konzept";
  if (/sicherung|vertrag|pacht/.test(t)) return "vertrag";
  if (/genehmigung|widmung|vergabe|netz/.test(t)) return "antrag";
  if (/wirtschaft|finanz|förder|steuer|vermarktung/.test(t)) return "rechnung";
  if (/betrieb|monitoring|service|bericht|wartung/.test(t)) return "betrieb";
  return REIHE[i % REIHE.length];
}
