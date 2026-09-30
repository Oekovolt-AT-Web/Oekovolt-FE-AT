import { cn } from "@/components/ui/cn";
import { GRUNDLAGE_TEXT, OEMAG_MONATE, REFERENZMARKTWERT_PV } from "@/data/oemag";
import { ctText, korridorFuer, monatLabel } from "@/lib/einspeisung";

/**
 * Verlauf OeMAG-Marktpreis PV seit Jänner 2024 (Server-Komponente, reines HTML/CSS – skaliert
 * ohne Schriftverkleinerung auch auf 390 px). Je Monat: Korridor (Fläche), vergüteter Monatswert
 * (Balken, Farbe nach Grundlage laut OeMAG) und Referenzmarktwert PV (Strich).
 * Die vollständigen Zahlen stehen zusätzlich als Tabelle (WerteTabelle) im DOM.
 */

const MAX = 15; // ct/kWh – Skala
const pct = (ct) => `${Math.max(0, Math.min(100, (ct / MAX) * 100))}%`;

const FARBE = {
  "day-ahead": "bg-ov-500",
  untergrenze: "bg-sun-400",
  obergrenze: "bg-navy-400",
};

export default function Verlauf({ className, tabelleId }) {
  const rmw = Object.fromEntries(REFERENZMARKTWERT_PV.map((r) => [r.monat, r.ct]));
  const erster = OEMAG_MONATE[0].monat;
  const letzter = OEMAG_MONATE[OEMAG_MONATE.length - 1].monat;

  return (
    <figure className={cn("rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 sm:p-7 md:p-9", className)}>
      <figcaption className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[18px] font-bold text-ink-900 md:text-[20px]">OeMAG-Marktpreis Photovoltaik je Monat</p>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {monatLabel(erster)} bis {monatLabel(letzter)}, ct/kWh netto
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[12.5px] text-ink-600" aria-label="Legende">
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-sm bg-ov-500" />{GRUNDLAGE_TEXT["day-ahead"]}</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-sm bg-sun-400" />{GRUNDLAGE_TEXT.untergrenze}</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-sm bg-navy-400" />{GRUNDLAGE_TEXT.obergrenze}</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-4 rounded-sm bg-ov-100 ring-1 ring-ov-200" />Korridor 60–100 %</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-navy-950" />Referenzmarktwert PV</li>
        </ul>
      </figcaption>

      <div
        role="img"
        aria-label={`Säulendiagramm: OeMAG-Marktpreis PV von ${monatLabel(erster)} bis ${monatLabel(letzter)} zwischen 4,655 und 9,730 ct/kWh; die vollständigen Werte stehen in der Tabelle darunter.`}
        aria-describedby={tabelleId}
        className="relative mt-8 h-[240px] pl-8 sm:h-[300px] md:h-[340px] md:pl-10"
      >
        {/* Raster */}
        {[0, 5, 10, 15].map((v) => (
          <div key={v} aria-hidden="true" className="absolute left-0 right-0 flex items-center" style={{ bottom: pct(v) }}>
            <span className="ov-num w-7 -translate-y-1/2 pr-1.5 text-right text-[11px] text-ink-400 md:w-9">{v}</span>
            <span className="h-px flex-1 -translate-y-1/2 bg-ink-100" />
          </div>
        ))}

        <ol className="absolute inset-y-0 left-8 right-0 flex gap-[2px] md:left-10 md:gap-[5px]">
          {OEMAG_MONATE.map((m, i) => {
            const k = korridorFuer(m.monat);
            const r = rmw[m.monat];
            return (
              <li key={m.monat} className="group relative h-full flex-1">
                {k && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bg-ov-100/80"
                    style={{ bottom: pct(k.unter), height: `calc(${pct(k.ober)} - ${pct(k.unter)})` }}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-x-[12%] bottom-0 rounded-t-[3px] transition-opacity group-hover:opacity-80", FARBE[m.grundlage])}
                  style={{ height: pct(m.ct) }}
                />
                {Number.isFinite(r) && (
                  <span aria-hidden="true" className="absolute -inset-x-px h-[3px] rounded-full bg-navy-950" style={{ bottom: pct(r) }} />
                )}
                {/* Tooltip nur für Maus – dieselben Werte stehen in der Tabelle */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute bottom-[calc(100%+6px)] z-10 hidden w-48 rounded-xl bg-ink-900 px-3 py-2 text-[12px] leading-relaxed text-white shadow-xl group-hover:block",
                    i >= OEMAG_MONATE.length / 2 ? "right-0" : "left-0"
                  )}
                >
                  <strong className="block">{monatLabel(m.monat)}</strong>
                  OeMAG: {ctText(m.ct)} ct
                  <br />
                  {GRUNDLAGE_TEXT[m.grundlage]}
                  {Number.isFinite(r) && (
                    <>
                      <br />
                      Referenzmarktwert: {ctText(r, 2)} ct
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Zeitachse */}
      <div aria-hidden="true" className="ml-8 mt-2 flex gap-[2px] md:ml-10 md:gap-[5px]">
        {OEMAG_MONATE.map((m) => {
          const mon = m.monat.slice(5, 7);
          return (
            <span key={m.monat} className="relative h-5 flex-1">
              {mon === "01" && <span className="absolute left-0 whitespace-nowrap text-[11.5px] font-semibold text-ink-700">{m.monat.slice(0, 4)}</span>}
              {(mon === "04" || mon === "07" || mon === "10") && (
                <span className="absolute left-0 hidden whitespace-nowrap text-[11px] text-ink-400 md:inline">{monatLabel(m.monat, true).slice(0, 3)}</span>
              )}
            </span>
          );
        })}
      </div>
    </figure>
  );
}
