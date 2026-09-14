// Standortgenauer Solarertrag aus PVGIS (EU JRC) – Server-Komponente, reines SVG.

const MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function RegionErtrag({ name, ort, referenz, quelle, abgerufen, kwp = 10 }) {
  const monate = ort.monate_sued35.map((m) => m * kwp);
  const max = Math.max(...monate, ...referenz.monate_sued35.map((m) => m * kwp));
  const diff = (ort.sued35_kwh_kwp / referenz.sued35_kwh_kwp - 1) * 100;
  const winter = [0, 1, 10, 11].reduce((s, i) => s + ort.monate_sued35[i], 0);
  const winterAnteil = (winter / ort.sued35_kwh_kwp) * 100;
  const staerksterWinter = [0, 1, 10, 11].reduce((a, i) => (ort.monate_sued35[i] > ort.monate_sued35[a] ? i : a), 0);

  const B = 640;
  const H = 220;
  const breite = B / 12;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <figure className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-7">
        <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[15px] font-semibold text-ink-900">Monatlicher Ertrag einer {kwp}-kWp-Anlage in {name}</span>
          <span className="flex items-center gap-3 text-[12.5px] text-ink-600">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-ov-500" />
              {name}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-3 bg-navy-900" />
              Türkheim (Firmensitz)
            </span>
          </span>
        </figcaption>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${B} ${H + 28}`} className="h-auto w-full min-w-[480px]" role="img" aria-label={`Monatserträge in kWh: ${MONATE.map((m, i) => `${m} ${de(monate[i])}`).join(", ")}`}>
            {monate.map((w, i) => {
              const h = (w / max) * H;
              const r = (referenz.monate_sued35[i] * kwp * H) / max;
              return (
                <g key={MONATE[i]}>
                  <rect x={i * breite + 6} y={H - h} width={breite - 12} height={h} rx="5" className="fill-ov-500" />
                  <line x1={i * breite + 3} x2={(i + 1) * breite - 3} y1={H - r} y2={H - r} className="stroke-navy-900" strokeWidth="2" />
                  <text x={i * breite + breite / 2} y={H + 18} textAnchor="middle" className="fill-ink-600 text-[12px]">
                    {MONATE[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-600">
          Simulation für Süddach mit 35° Neigung inklusive Geländehorizont. Quelle: {quelle}, abgerufen {new Date(abgerufen).toLocaleDateString("de-DE")}. Die Werte sind
          physikalische Simulationen und liegen erfahrungsgemäß über dem, was wir in Angeboten vorsichtig ansetzen.
        </p>
      </figure>

      <div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl bg-ov-50 p-5 ring-1 ring-ov-200">
            <dt className="text-[13px] font-medium text-ov-800">Simulierter Jahresertrag je kWp (Süd, 35°)</dt>
            <dd className="mt-1 font-display text-[34px] font-extrabold leading-none text-ink-900">
              {de(ort.sued35_kwh_kwp)} <span className="text-[16px] font-bold text-ink-600">kWh</span>
            </dd>
            <dd className="mt-2 text-[13.5px] text-ink-700">
              {Math.abs(diff) < 0.5 ? "gleichauf mit" : `${de(Math.abs(diff), 1)} % ${diff > 0 ? "mehr als" : "weniger als"}`} am Firmensitz Türkheim
            </dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <dt className="text-[12.5px] text-ink-600">Ost/West, 15°</dt>
            <dd className="mt-1 font-display text-[22px] font-extrabold text-ink-900">{de(ort.ostwest15_kwh_kwp)} kWh</dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <dt className="text-[12.5px] text-ink-600">Flachdach, 10°</dt>
            <dd className="mt-1 font-display text-[22px] font-extrabold text-ink-900">{de(ort.flach10_kwh_kwp)} kWh</dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <dt className="text-[12.5px] text-ink-600">Winteranteil (Nov–Feb)</dt>
            <dd className="mt-1 font-display text-[22px] font-extrabold text-ink-900">{de(winterAnteil)} %</dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <dt className="text-[12.5px] text-ink-600">Schwankung von Jahr zu Jahr</dt>
            <dd className="mt-1 font-display text-[22px] font-extrabold text-ink-900">± {de(ort.schwankung_jahr_kwh)} kWh</dd>
          </div>
        </dl>
        <p className="mt-5 text-[14.5px] leading-relaxed text-ink-700">
          Eine {kwp}-kWp-Anlage auf einem Süddach in {name} kommt rechnerisch auf rund {de(Math.round((ort.sued35_kwh_kwp * kwp) / 100) * 100)} kWh im Jahr. Der ertragsstärkste
          Wintermonat ist der {["Januar", "Februar", "", "", "", "", "", "", "", "", "November", "Dezember"][staerksterWinter]} mit etwa {de(ort.monate_sued35[staerksterWinter] * kwp)} kWh.
          Standort auf {de(ort.hoehe_m)} m über Normalnull.
        </p>
      </div>
    </div>
  );
}
