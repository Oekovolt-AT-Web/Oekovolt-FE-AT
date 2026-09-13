/**
 * „Heizen mit Sonne“ – Jahresverlauf: Solarertrag einer 10-kWp-Anlage und
 * Strombedarf einer Wärmepumpe je Monat. Zeigt ehrlich, wann PV und
 * Wärmepumpe zusammenpassen (Übergangszeit, Warmwasser) und wann nicht (Winter).
 * Typische Monatsverteilungen Süddeutschland, gerundet – Veranschaulichung.
 * Server-Komponente, reines SVG.
 */

const MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
// Anteil am Jahreswert in %
const PV_VERTEILUNG = [3, 5, 8.5, 11.5, 13, 13.5, 13.5, 12, 9, 6, 3, 2];
const WAERME_VERTEILUNG = [16, 14, 12, 8, 4.5, 2.5, 2.2, 2.2, 3.5, 7.5, 12, 15.6];

const PV_JAHR = 10000; // kWh, 10 kWp
const WP_JAHR = 5500; // kWh Strom, z. B. 18.000 kWh Wärme / JAZ 3,3

export default function SonnenJahr() {
  const pv = PV_VERTEILUNG.map((p) => (PV_JAHR * p) / 100);
  const wp = WAERME_VERTEILUNG.map((p) => (WP_JAHR * p) / 100);
  const W = 640, H = 340, L = 44, B = 34, T = 16;
  const maxY = 1400;
  const y = (v) => T + (H - T - B) * (1 - v / maxY);
  const gw = (W - L) / 12;
  const bw = gw * 0.34;
  const deckung = pv.reduce((a, v, i) => a + Math.min(v, wp[i]), 0) / WP_JAHR;

  return (
    <figure className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink-100 p-6 md:p-7">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Jahresverlauf · Beispielhaus</p>
          <p className="mt-1.5 font-display text-[19px] font-bold text-ink-900">Solarertrag vs. Wärmepumpenstrom</p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-600">
          <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-sun-400" />PV-Ertrag 10 kWp</li>
          <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-navy-700" />Wärmepumpe</li>
        </ul>
      </div>
      <div className="px-3 pt-4 md:px-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Balkendiagramm: Solarertrag ist im Sommer hoch, der Strombedarf der Wärmepumpe im Winter. Überschneidung vor allem in Frühjahr und Herbst.">
          {[0, 400, 800, 1200].map((v) => (
            <g key={v}>
              <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="#eef0f4" />
              <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#97a0b0">{v.toLocaleString("de-DE")}</text>
            </g>
          ))}
          <text x="2" y={T + 2} fontSize="10.5" fill="#97a0b0">kWh</text>
          {MONATE.map((m, i) => {
            const x = L + i * gw + gw / 2;
            return (
              <g key={m}>
                <rect x={x - bw - 1.5} y={y(pv[i])} width={bw} height={y(0) - y(pv[i])} rx="3" fill="#ffc53d" />
                <rect x={x + 1.5} y={y(wp[i])} width={bw} height={y(0) - y(wp[i])} rx="3" fill="#003473" />
                <text x={x} y={H - 12} textAnchor="middle" fontSize="11.5" fill="#6b7486">{m}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="grid gap-4 border-t border-ink-100 bg-sand-50 p-6 sm:grid-cols-[auto_1fr] sm:items-center md:p-7">
        <div>
          <p className="ov-num font-display text-[34px] font-extrabold leading-none tracking-tight text-ink-900">20–35 %</p>
          <p className="mt-1 text-[12.5px] text-ink-500">realistischer Solaranteil</p>
        </div>
        <p className="text-[13.5px] leading-relaxed text-ink-600">
          Im Monatsmittel überschneiden sich Ertrag und Bedarf rechnerisch zu bis zu {Math.round(deckung * 100)} %. Weil die Wärmepumpe aber auch abends und nachts läuft, deckt
          die Anlage im Tagesverlauf meist 20–35 % – mit Speicher und intelligenter Steuerung mehr. Beispiel: 18.000 kWh Wärme, JAZ 3,3, Süddeutschland.
        </p>
      </figcaption>
    </figure>
  );
}
