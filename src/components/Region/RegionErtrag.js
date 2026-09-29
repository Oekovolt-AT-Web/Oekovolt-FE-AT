// Standortgenauer Solarertrag aus PVGIS (EU JRC) – Server-Komponente, reines SVG.
// Die Monatsbalken wachsen beim Scrollen (Reveal), bei reduzierter Bewegung stehen sie sofort.

import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function RegionErtrag({ name, ort, referenz, referenzName = "Ostermiething", istReferenz = false, quelle, abgerufen, kwp = 100, dunkel = false }) {
  const monate = ort.monate_sued35.map((m) => m * kwp);
  const max = Math.max(...monate, ...referenz.monate_sued35.map((m) => m * kwp));
  const diff = (ort.sued35_kwh_kwp / referenz.sued35_kwh_kwp - 1) * 100;
  const winter = [0, 1, 10, 11].reduce((s, i) => s + ort.monate_sued35[i], 0);
  const winterAnteil = (winter / ort.sued35_kwh_kwp) * 100;
  const staerksterWinter = [0, 1, 10, 11].reduce((a, i) => (ort.monate_sued35[i] > ort.monate_sued35[a] ? i : a), 0);
  const spitze = monate.indexOf(Math.max(...monate));

  const B = 640;
  const H = 220;
  const O = 22; // Platz über den Balken für die Beschriftung
  const breite = B / 12;
  const kachel = dunkel ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-ink-200/70";
  const verlauf = `re-balken-${String(ort.lat).replace(".", "-")}`;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
      <Reveal as="figure" className="min-w-0 rounded-3xl bg-white p-5 text-ink-900 shadow-2xl ring-1 ring-ink-200/70 md:p-7">
        <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[15px] font-semibold text-ink-900">Monatlicher Ertrag einer {kwp}-kWp-Anlage in {name}</span>
          <span className="flex items-center gap-3 text-[12.5px] text-ink-600">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-ov-500" />
              {name}
            </span>
            {!istReferenz && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-0.5 w-3 bg-navy-900" />
                {referenzName} (Firmensitz)
              </span>
            )}
          </span>
        </figcaption>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${B} ${H + O + 28}`} className="h-auto w-full min-w-[420px]" role="img" aria-label={`Monatserträge in kWh: ${MONATE.map((m, i) => `${m} ${de(monate[i])}`).join(", ")}`}>
            <defs>
              <linearGradient id={verlauf} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8cba58" />
                <stop offset="1" stopColor="#558227" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1="0" x2={B} y1={O + H - H * f} y2={O + H - H * f} stroke="#eef0f4" />
            ))}
            {monate.map((w, i) => {
              const h = (w / max) * H;
              const r = (referenz.monate_sued35[i] * kwp * H) / max;
              return (
                <g key={MONATE[i]}>
                  <rect
                    x={i * breite + 7}
                    y={O + H - h}
                    width={breite - 14}
                    height={h}
                    rx="6"
                    fill={i === spitze ? "#ffc53d" : `url(#${verlauf})`}
                    className="origin-bottom transition-transform duration-[1100ms] ease-out motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:scale-y-0"
                    style={{ transformBox: "fill-box", transitionDelay: `${i * 70}ms` }}
                  />
                  {i === spitze && (
                    <text x={i * breite + breite / 2} y={O + H - h - 8} textAnchor="middle" className="fill-ink-900 text-[12px] font-bold">
                      {de(w)}
                    </text>
                  )}
                  {!istReferenz && <line x1={i * breite + 3} x2={(i + 1) * breite - 3} y1={O + H - r} y2={O + H - r} className="stroke-navy-900" strokeWidth="2.5" strokeLinecap="round" />}
                  <text x={i * breite + breite / 2} y={O + H + 20} textAnchor="middle" className="fill-ink-600 text-[12px]">
                    {MONATE[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-600">
          Simulation für Süddach mit 35° Neigung inklusive Geländehorizont; stärkster Monat hervorgehoben (kWh). Quelle: {quelle}, abgerufen {new Date(abgerufen).toLocaleDateString("de-AT")}. Die Werte sind
          physikalische Simulationen; in Angeboten rechnen wir mit Ihrem Dach, Ihrer Verschattung und vorsichtigeren Annahmen.
        </p>
      </Reveal>

      <div>
        <dl className="grid grid-cols-2 gap-3">
          <Reveal className={cn("col-span-2 rounded-2xl p-5", dunkel ? "bg-gradient-to-br from-ov-600 to-ov-800 text-white shadow-xl" : "bg-ov-50 ring-1 ring-ov-200")}>
            <dt className={cn("text-[13px] font-medium", dunkel ? "text-white/80" : "text-ov-800")}>Simulierter Jahresertrag je kWp (Süd, 35°)</dt>
            <dd className={cn("mt-1 font-display text-[40px] font-extrabold leading-none", dunkel ? "text-white" : "text-ink-900")}>
              {de(ort.sued35_kwh_kwp)} <span className={cn("text-[16px] font-bold", dunkel ? "text-white/70" : "text-ink-600")}>kWh</span>
            </dd>
            <dd className={cn("mt-2 text-[13.5px]", dunkel ? "text-white/85" : "text-ink-700")}>
              {istReferenz
                ? "Bezugswert für alle Regionalseiten – hier liegt unser Firmensitz"
                : `${Math.abs(diff) < 0.5 ? "gleichauf mit dem Wert" : `${de(Math.abs(diff), 1)} % ${diff > 0 ? "mehr als" : "weniger als"}`} am Firmensitz ${referenzName}`}
            </dd>
          </Reveal>
          {[
            ["Ost/West, 15°", `${de(ort.ostwest15_kwh_kwp)} kWh`],
            ["Flachdach, 10°", `${de(ort.flach10_kwh_kwp)} kWh`],
            ["Winteranteil (Nov–Feb)", `${de(winterAnteil)} %`],
            ["Schwankung von Jahr zu Jahr", `± ${de(ort.schwankung_jahr_kwh)} kWh`],
          ].map(([l, w], i) => (
            <Reveal key={l} delay={80 + i * 60} className={cn("rounded-2xl p-4", kachel)}>
              <dt className={cn("text-[12.5px]", dunkel ? "text-white/60" : "text-ink-600")}>{l}</dt>
              <dd className={cn("mt-1 font-display text-[22px] font-extrabold", dunkel ? "text-white" : "text-ink-900")}>{w}</dd>
            </Reveal>
          ))}
        </dl>
        <p className={cn("mt-5 text-[14.5px] leading-relaxed", dunkel ? "text-white/70" : "text-ink-700")}>
          Eine Gewerbeanlage mit {kwp} kWp auf einem Süddach in {name} kommt rechnerisch auf rund {de(Math.round((ort.sued35_kwh_kwp * kwp) / 1000) * 1000)} kWh im Jahr. Der ertragsstärkste
          Wintermonat ist der {["Jänner", "Februar", "", "", "", "", "", "", "", "", "November", "Dezember"][staerksterWinter]} mit etwa {de(ort.monate_sued35[staerksterWinter] * kwp)} kWh.
          Referenzpunkt Ortszentrum auf rund {de(ort.hoehe_m)} m Seehöhe.
        </p>
      </div>
    </div>
  );
}
