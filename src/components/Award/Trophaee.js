// src/components/Award/Trophaee.js
//
// Trophäen-Visual für den Ökovolt PV Award – reines SVG mit den Farbtokens
// der Website (ov-*, sun-*, navy-*). Keine Bilddatei, keine Marke.
// Pokal mit Sonnenscheibe und angedeutetem PV-Modulraster.
//
// animiert: Strahlenkranz dreht sich langsam, Glanzlicht wandert über den
// Kelch, Funken blinken – nur ohne prefers-reduced-motion.

export default function Trophaee({ jahr, animiert = false, className = "" }) {
  return (
    <div className={`relative mx-auto aspect-[4/5] w-full max-w-sm ${className}`}>
      <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-sun-400/30 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-x-[20%] bottom-[6%] h-[18%] rounded-full bg-ov-500/25 blur-2xl" />
      <svg
        viewBox="0 0 320 400"
        role="img"
        aria-labelledby="trophaee-titel"
        className={`relative h-full w-full drop-shadow-[0_30px_40px_rgba(3,18,43,0.35)] ${animiert ? "ov-trophaee" : ""}`}
      >
        <title id="trophaee-titel">Illustration der Trophäe des Ökovolt PV Award</title>
        <defs>
          <linearGradient id="tr-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-sun-300)" }} />
            <stop offset="0.55" style={{ stopColor: "var(--color-sun-400)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-sun-500)" }} />
          </linearGradient>
          <linearGradient id="tr-glanz" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tr-modul" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-navy-600)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-navy-900)" }} />
          </linearGradient>
          <linearGradient id="tr-sockel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-ov-500)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-ov-800)" }} />
          </linearGradient>
          <clipPath id="tr-kelch">
            <path d="M92 70h136c0 70-18 118-68 132C110 188 92 140 92 70z" />
          </clipPath>
        </defs>

        {/* Strahlen */}
        <g className="ov-tr-strahlen" style={{ stroke: "var(--color-sun-400)" }} strokeWidth="4" strokeLinecap="round" opacity="0.8">
          {[...Array(12)].map((_, i) => {
            const w = (i * Math.PI) / 6;
            const x1 = 160 + Math.cos(w) * 118;
            const y1 = 120 + Math.sin(w) * 118;
            const x2 = 160 + Math.cos(w) * 140;
            const y2 = 120 + Math.sin(w) * 140;
            return <line key={i} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} />;
          })}
        </g>

        {/* Funken */}
        {animiert &&
          [
            [58, 44, 0],
            [266, 60, 0.8],
            [40, 190, 1.6],
            [282, 210, 2.2],
            [230, 20, 1.2],
          ].map(([x, y, d]) => (
            <path
              key={`${x}-${y}`}
              className="ov-tr-funke"
              style={{ animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px`, fill: "var(--color-sun-300)" }}
              d={`M${x} ${y - 7}L${x + 1.6} ${y - 1.6}L${x + 7} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 7}L${x - 1.6} ${y + 1.6}L${x - 7} ${y}L${x - 1.6} ${y - 1.6}Z`}
            />
          ))}

        {/* Henkel */}
        <path d="M92 86c-34 0-46 18-46 38 0 26 22 44 58 50" fill="none" stroke="url(#tr-gold)" strokeWidth="12" strokeLinecap="round" />
        <path d="M228 86c34 0 46 18 46 38 0 26-22 44-58 50" fill="none" stroke="url(#tr-gold)" strokeWidth="12" strokeLinecap="round" />

        {/* Kelch */}
        <path d="M92 70h136c0 70-18 118-68 132C110 188 92 140 92 70z" fill="url(#tr-gold)" />
        {/* PV-Modulraster im Kelch */}
        <g clipPath="url(#tr-kelch)">
          <rect x="118" y="92" width="84" height="56" rx="4" fill="url(#tr-modul)" />
          <g stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5">
            <line x1="139" y1="92" x2="139" y2="148" />
            <line x1="160" y1="92" x2="160" y2="148" />
            <line x1="181" y1="92" x2="181" y2="148" />
            <line x1="118" y1="111" x2="202" y2="111" />
            <line x1="118" y1="129" x2="202" y2="129" />
          </g>
          <g className="ov-tr-glanz">
            <rect x="70" y="40" width="40" height="200" fill="url(#tr-glanz)" transform="rotate(18 90 140)" />
          </g>
        </g>
        <ellipse cx="160" cy="70" rx="68" ry="9" style={{ fill: "var(--color-sun-300)" }} />

        {/* Sonnenscheibe über dem Kelch */}
        <circle cx="160" cy="42" r="20" fill="url(#tr-gold)" />
        <circle cx="160" cy="42" r="11" style={{ fill: "var(--color-sun-300)" }} />

        {/* Schaft & Sockel */}
        <path d="M148 200h24l6 44h-36z" fill="url(#tr-gold)" />
        <rect x="112" y="244" width="96" height="16" rx="6" fill="url(#tr-gold)" />
        <path d="M90 260h140l12 86H78z" fill="url(#tr-sockel)" />
        <rect x="70" y="346" width="180" height="20" rx="8" style={{ fill: "var(--color-navy-950)" }} />

        {/* Plakette */}
        <rect x="112" y="280" width="96" height="46" rx="8" fill="#fff" fillOpacity="0.14" stroke="#fff" strokeOpacity="0.35" />
        <text x="160" y="299" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="#fff">
          PV AWARD
        </text>
        <text x="160" y="316" textAnchor="middle" fontSize="13" fontWeight="800" style={{ fill: "var(--color-sun-300)" }}>
          {jahr}
        </text>
      </svg>
      {animiert && (
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .ov-trophaee .ov-tr-strahlen { transform-origin: 160px 120px; animation: ov-tr-drehen 48s linear infinite; }
            .ov-trophaee .ov-tr-glanz { animation: ov-tr-glanz 5.5s cubic-bezier(0.22,1,0.36,1) infinite; }
            .ov-trophaee .ov-tr-funke { animation: ov-tr-funke 3.2s ease-in-out infinite; opacity: 0; }
          }
          @keyframes ov-tr-drehen { to { transform: rotate(360deg); } }
          @keyframes ov-tr-glanz { 0%, 55% { transform: translateX(-70px); } 100% { transform: translateX(200px); } }
          @keyframes ov-tr-funke { 0%, 100% { opacity: 0; transform: scale(0.4); } 50% { opacity: 1; transform: scale(1); } }
        `}</style>
      )}
    </div>
  );
}
