import Reveal from "@/components/ui/Reveal";

/**
 * Temperaturniveaus als Skala (Server-Komponente): je Anwendung ein Balken
 * zwischen typischer Mindest- und Höchsttemperatur, eingefärbt von kühl
 * (effizient) nach warm (weniger effizient). Balken wachsen beim Scrollen.
 * items: [{ anwendung, von, bis, temp, hinweis }]
 */
const MIN = 20;
const MAX = 95;
const pos = (t) => ((t - MIN) / (MAX - MIN)) * 100;

export default function TemperaturSkala({ items = [] }) {
  return (
    <Reveal className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-ink-200/70 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-[0.12em]">
        <span className="text-navy-600">← effizienter</span>
        <span className="text-sun-500">höhere Vorlauftemperatur →</span>
      </div>
      <ol className="space-y-5">
        {items.map((it, i) => (
          <li key={it.anwendung} className="grid gap-2 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:items-center md:gap-6">
            <div>
              <p className="text-[15px] font-semibold leading-snug text-ink-900">{it.anwendung}</p>
              <p className="text-[12.5px] leading-snug text-ink-500">{it.hinweis}</p>
            </div>
            <div className="relative h-10 rounded-full bg-ink-100/70">
              {[40, 60, 80].map((t) => (
                <span key={t} aria-hidden="true" className="absolute inset-y-1 w-px bg-white" style={{ left: `${pos(t)}%` }} />
              ))}
              <span
                className="absolute inset-y-1.5 flex origin-left items-center justify-end rounded-full pr-3 text-[12.5px] font-bold text-white shadow-md transition-transform duration-[1200ms] ease-out motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:scale-x-0"
                style={{
                  left: `${pos(it.von)}%`,
                  width: `${Math.max(pos(it.bis) - pos(it.von), 11)}%`,
                  background: `linear-gradient(90deg, hsl(${215 - (it.von - MIN) * 2.6} 70% 45%), hsl(${215 - (it.bis - MIN) * 2.6} 80% 50%))`,
                  transitionDelay: `${i * 110}ms`,
                }}
              >
                <span className="ov-num whitespace-nowrap">{it.temp}</span>
              </span>
            </div>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="mt-4 hidden text-[11.5px] text-ink-400 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-6">
        <span />
        <span className="relative h-4">
          {[20, 40, 60, 80].map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: `${pos(t)}%` }}>
              {t} °C
            </span>
          ))}
        </span>
      </div>
    </Reveal>
  );
}
