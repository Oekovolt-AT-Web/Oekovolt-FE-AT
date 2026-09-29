import { Car, Clock, MapPin, Navigation } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { AT_KARTE, AT_KARTE_QUELLE, BUNDESLAND_PFADE, projiziereAT } from "./oesterreichKarte";

const de = (n) => Number(n).toLocaleString("de-DE");
const fahrzeit = (min) => [Math.floor(min / 60) && `${Math.floor(min / 60)} h`, min % 60 && `${min % 60} min`].filter(Boolean).join(" ");

/**
 * Lage des Orts in Österreich und Anfahrt ab Firmensitz – Server-Komponente (SVG).
 * Bundesland hervorgehoben, Luftlinie als animierte Linie (zeichnet sich beim Scrollen),
 * daneben Straßen-km und Fahrzeit laut OSRM (pvgis-Daten).
 */
export default function RegionLageKarte({ region, firmensitz, routeQuelle }) {
  const p = region.pvgis;
  const ort = projiziereAT(p.lat, p.lon);
  const sitz = projiziereAT(firmensitz[0], firmensitz[1]);
  const name = region.kurzname || region.name;
  // leicht gebogene Linie (Anfahrt), Kontrollpunkt senkrecht zur Verbindung versetzt
  const mx = (ort.x + sitz.x) / 2;
  const my = (ort.y + sitz.y) / 2;
  const dx = ort.x - sitz.x;
  const dy = ort.y - sitz.y;
  const laenge = Math.hypot(dx, dy) || 1;
  const bogen = Math.min(60, laenge * 0.18);
  const cx = mx - (dy / laenge) * bogen;
  const cy = my + (dx / laenge) * bogen;
  const pfad = `M${sitz.x.toFixed(1)} ${sitz.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ort.x.toFixed(1)} ${ort.y.toFixed(1)}`;
  const labelLinks = ort.x > AT_KARTE.breite * 0.78;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-2xl ring-1 ring-white/10">
      <Reveal className="relative p-4 md:p-6">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-50" />
        <svg viewBox={`0 0 ${AT_KARTE.breite} ${AT_KARTE.hoehe}`} className="relative block h-auto w-full" role="img" aria-label={`Lage von ${name} in ${region.bundesland}; ${region.heimat ? "Firmensitz" : `${p.luftlinie_km} km Luftlinie ab Ostermiething`}`}>
          {Object.entries(BUNDESLAND_PFADE).map(([id, d]) => (
            <path
              key={id}
              d={d}
              fill={id === region.land ? "rgba(102,153,51,0.28)" : "rgba(255,255,255,0.05)"}
              stroke={id === region.land ? "rgba(174,208,131,0.95)" : "rgba(255,255,255,0.2)"}
              strokeWidth={id === region.land ? 2 : 1}
              strokeLinejoin="round"
            />
          ))}
          {!region.heimat && (
            <>
              <path d={pfad} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="4 7" />
              <path
                d={pfad}
                fill="none"
                stroke="#ffc53d"
                strokeWidth="3.5"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                className="transition-[stroke-dashoffset] delay-300 duration-[1800ms] ease-out motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:[stroke-dashoffset:1]"
              />
            </>
          )}
          {/* Firmensitz */}
          <g>
            <circle cx={sitz.x} cy={sitz.y} r="9" fill="none" stroke="#fff" strokeOpacity="0.8">
              <animate attributeName="r" values="8;22;8" dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx={sitz.x} cy={sitz.y} r="8" fill="#fff" stroke="#669933" strokeWidth="3" />
            {!region.heimat && (
              <text x={sitz.x - 12} y={sitz.y - 14} textAnchor="end" fill="rgba(255,255,255,0.85)" fontSize="16" fontWeight="700" paintOrder="stroke" stroke="rgba(3,18,43,0.85)" strokeWidth="4">
                Ostermiething
              </text>
            )}
          </g>
          {/* Ort */}
          <g>
            {!region.heimat && <circle cx={ort.x} cy={ort.y} r="18" fill="#ffc53d" fillOpacity="0.25" />}
            <circle cx={ort.x} cy={ort.y} r={region.heimat ? 10 : 8} fill="#ffc53d" stroke="#03122b" strokeWidth="2.5" />
            <text x={labelLinks ? ort.x - 16 : ort.x + 16} y={ort.y + 6} textAnchor={labelLinks ? "end" : "start"} fill="#fff" fontSize="20" fontWeight="800" paintOrder="stroke" stroke="rgba(3,18,43,0.85)" strokeWidth="5">
              {name}
            </text>
          </g>
        </svg>
      </Reveal>
      <dl className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
        {[
          { icon: MapPin, label: "Bundesland", wert: region.bundesland },
          { icon: Navigation, label: "Luftlinie", wert: region.heimat ? "Firmensitz" : `${de(p.luftlinie_km)} km` },
          { icon: Car, label: "Straße", wert: region.heimat ? "–" : p.strasse_km ? `${de(p.strasse_km)} km` : "–" },
          { icon: Clock, label: "Fahrzeit", wert: region.heimat ? "–" : p.fahrzeit_min ? `ca. ${fahrzeit(p.fahrzeit_min)}` : "–" },
        ].map(({ icon: Icon, label, wert }, i) => (
          <div key={label} className={`p-4 md:p-5 ${i % 2 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
            <dt className="flex items-center gap-1.5 text-[12px] text-white/55">
              <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
              {label}
            </dt>
            <dd className="mt-1 font-display text-[18px] font-extrabold leading-tight md:text-[20px]">{wert}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-white/10 px-5 py-3 text-[11.5px] leading-relaxed text-white/45">
        {region.anfahrt ? `${region.anfahrt} ` : ""}Straße und Fahrzeit: {routeQuelle}. {AT_KARTE_QUELLE}.
      </p>
    </div>
  );
}
