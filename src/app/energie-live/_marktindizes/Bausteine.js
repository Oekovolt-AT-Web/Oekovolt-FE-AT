// src/app/energie-live/_marktindizes/Bausteine.js
//
// Server-Bausteine der Marktindex-Seiten: Monatsbalken (reines HTML/CSS, ohne Client-JS),
// Tabelle als Diagramm-Alternative, Kennzeichnungsband, Download-/Lizenzkarte.

import { Download, ExternalLink, FileSpreadsheet, Info, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { LIZENZ_URL, monatKurz } from "./daten";

/** Runde Achsen-Obergrenze (1 – 1,2 – 1,5 – 2 – 2,5 – 3 – 4 – 5 – 6 – 8 × 10^n), damit die Balken die Zeichenfläche gut füllen */
function rundeObergrenze(x) {
  if (!(x > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(x));
  for (const f of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (f * p >= x) return f * p;
  return 10 * p;
}

/**
 * Monatsbalken, auf Wunsch gruppiert (mehrere Reihen je Monat).
 *
 * props:
 *  monate   [{ monat, ... }] chronologisch
 *  reihen   [{ key, label, klasse }]  – klasse: Tailwind-Hintergrund der Balken
 *  format   (wert) => Text für Tooltip/Achse
 *  titel    Beschriftung für Screenreader (role="img")
 *  hoehe    Tailwind-Höhe der Zeichenfläche
 */
export function MonatsBalken({ monate, reihen, format, titel, hoehe = "h-56 md:h-72", markiereLetzten = true }) {
  const werte = monate.flatMap((m) => reihen.map((r) => m[r.key])).filter((w) => typeof w === "number");
  const oben = rundeObergrenze(Math.max(0, ...werte));
  const linien = [1, 0.5, 0];
  return (
    <figure className="min-w-0">
      {reihen.length > 1 && (
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-ink-600">
          {reihen.map((r) => (
            <li key={r.key} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className={cn("h-3 w-3 rounded-sm", r.klasse)} />
              {r.label}
            </li>
          ))}
        </ul>
      )}
      <div role="img" aria-label={`${titel}. Die Werte stehen in der Tabelle unter dem Diagramm.`} className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 md:gap-x-3">
        {/* Y-Achse */}
        <div aria-hidden="true" className={cn("relative w-12 md:w-14", hoehe)}>
          {linien.map((l) => (
            <span key={l} className="ov-num absolute right-0 -translate-y-1/2 whitespace-nowrap text-[11px] text-ink-500 md:text-[12px]" style={{ top: `${(1 - l) * 100}%` }}>
              {format(oben * l, true)}
            </span>
          ))}
        </div>
        <div className={cn("relative", hoehe)}>
          {linien.map((l) => (
            <span key={l} aria-hidden="true" className={cn("absolute inset-x-0 border-t", l === 0 ? "border-ink-300" : "border-dashed border-ink-200")} style={{ top: `${(1 - l) * 100}%` }} />
          ))}
          <ol className="absolute inset-0 flex items-end gap-[2px] md:gap-1">
            {monate.map((m, i) => {
              const letzter = markiereLetzten && i === monate.length - 1;
              const tip = `${monatKurz(m.monat)}: ${reihen.map((r) => `${reihen.length > 1 ? `${r.label} ` : ""}${format(m[r.key])}`).join(" · ")}`;
              return (
                <li key={m.monat} title={tip} className="flex h-full min-w-0 flex-1 items-end gap-px">
                  {reihen.map((r) => {
                    const w = m[r.key];
                    const anteil = typeof w === "number" && w > 0 ? w / oben : 0;
                    return (
                      <span
                        key={r.key}
                        className={cn("block min-w-0 flex-1 rounded-t-[3px]", r.klasse, letzter && reihen.length === 1 && "ring-2 ring-ov-300 ring-offset-1")}
                        style={{ height: `${Math.max(anteil * 100, w == null ? 0 : 0.8)}%` }}
                      />
                    );
                  })}
                </li>
              );
            })}
          </ol>
        </div>
        {/* X-Achse: Jahresanfang mit Jahr, Quartalsmonate nur ab md */}
        <span aria-hidden="true" />
        <ol aria-hidden="true" className="mt-2 flex gap-[2px] md:gap-1">
          {monate.map((m) => {
            const mm = m.monat.slice(5, 7);
            return (
              <li key={m.monat} className="relative h-5 min-w-0 flex-1">
                {mm === "01" ? (
                  <span className="ov-num absolute left-0 whitespace-nowrap text-[11.5px] font-semibold text-ink-700 md:text-[12px]">{m.monat.slice(0, 4)}</span>
                ) : ["04", "07", "10"].includes(mm) ? (
                  <span className="absolute left-0 hidden whitespace-nowrap text-[11px] text-ink-500 md:inline">{monatKurz(m.monat).replace(/\s?\d{2}$/, "")}</span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}

/**
 * Tabelle als Diagramm-Alternative (neueste Monate oben), scrollbar in fester Höhe.
 * spalten: [{ key, label, format?(wert, zeile), rechts? }]
 */
export function MonatsTabelle({ monate, spalten, beschriftung }) {
  const zeilen = [...monate].reverse();
  return (
    <div tabIndex={0} role="region" aria-label={beschriftung} className="max-h-[560px] overflow-auto rounded-2xl bg-white ring-1 ring-ink-200/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
        <caption className="sr-only">{beschriftung}</caption>
        <thead className="sticky top-0 z-10 bg-sand-50 text-[12.5px] uppercase tracking-wide text-ink-600">
          <tr>
            {spalten.map((s) => (
              <th key={s.key} scope="col" className={cn("px-3 py-3 font-semibold md:px-4", s.rechts && "text-right")}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {zeilen.map((z) => (
            <tr key={z.monat} className="hover:bg-sand-50/60">
              {spalten.map((s, i) => {
                const Tag = i === 0 ? "th" : "td";
                return (
                  <Tag key={s.key} scope={i === 0 ? "row" : undefined} className={cn("whitespace-nowrap px-3 py-2.5 md:px-4", i === 0 ? "font-semibold text-ink-900" : "ov-num text-ink-700", s.rechts && "text-right")}>
                    {s.format ? s.format(z[s.key], z) : z[s.key]}
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Kennzeichnung „nicht amtlich / Obergrenze / Richtwert“ – sichtbar unter dem Seitenkopf */
export function Kennzeichnung({ punkte }) {
  return (
    <div className="border-b border-ink-200/70 bg-sand-100">
      <div className="ov-container flex flex-col gap-2 py-4 text-[14px] leading-relaxed text-ink-800 md:flex-row md:items-center md:gap-4">
        <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-ink-900">
          <Scale aria-hidden="true" className="h-4 w-4 text-navy-700" />
          Bitte beachten
        </span>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {punkte.map((p) => (
            <li key={p} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sun-500" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Download-Karte mit Lizenz- und Zitierhinweis (statischer Inhalt, frei – kein Lead-Gate) */
export function DownloadKarte({ href, dateiname, stand, zitat, quellen }) {
  return (
    <div className="rounded-3xl bg-navy-950 p-6 text-white md:p-8">
      <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
        <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
        Offene Daten · CC BY 4.0
      </p>
      <h3 className="mt-3 font-display text-[22px] font-bold leading-snug">Alle Monatswerte als CSV</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-white/70">
        Semikolon-getrennt, Dezimalpunkt, UTF-8, mit Quellen-, Lizenz- und Standzeilen (#). Stand {stand}. Frei nutzbar – auch gewerblich – mit Namensnennung.
      </p>
      <a
        href={href}
        download={dateiname}
        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ov-600 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        CSV herunterladen
      </a>
      <p className="mt-2 break-all text-[12.5px] text-white/60">Datei: {dateiname}</p>
      <div className="mt-6 rounded-2xl bg-white/[0.06] p-4 text-[13.5px] leading-relaxed text-white/75">
        <p className="font-semibold text-white">So zitieren Sie richtig</p>
        <p className="mt-1">{zitat}</p>
        <p className="mt-2">
          Lizenz:{" "}
          <a href={LIZENZ_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">
            Creative Commons Namensnennung 4.0 International
            <ExternalLink aria-hidden="true" className="ml-1 inline h-3.5 w-3.5" />
          </a>
        </p>
      </div>
      <ul className="mt-5 space-y-2 text-[13.5px] leading-relaxed text-white/70">
        {quellen.map((q) => (
          <li key={q.url} className="flex gap-2">
            <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
            <span>
              <a href={q.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-current">
                {q.name}
              </a>{" "}
              – Lizenz {q.lizenz}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
