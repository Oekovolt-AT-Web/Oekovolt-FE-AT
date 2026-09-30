"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Calculator, Coins, Info, LandPlot, Scale } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Regler } from "@/components/Rechner/bausteine";
import { AMPEL, AUSRICHTUNGEN, STUFEN, WIDMUNGEN, pruefeFlaeche } from "@/lib/flaeche/check";
import { LAENDER, widmungsPfad } from "@/lib/flaeche/laender";
import { euro, hektar, zahl } from "@/lib/flaeche/format";

const AMPEL_FARBE = {
  gruen: { punkt: "bg-ov-500", glow: "shadow-[0_0_28px_4px_rgba(102,153,51,0.65)]", text: "text-ov-300" },
  gelb: { punkt: "bg-sun-400", glow: "shadow-[0_0_28px_4px_rgba(255,197,61,0.6)]", text: "text-sun-300" },
  rot: { punkt: "bg-red-500", glow: "shadow-[0_0_28px_4px_rgba(239,68,68,0.6)]", text: "text-red-300" },
};

const STUFE_CHIP = {
  gut: "bg-ov-100 text-ov-800 ring-ov-200",
  pruefen: "bg-sun-300/40 text-ink-900 ring-sun-400/50",
  erschwert: "bg-orange-100 text-orange-900 ring-orange-200",
  kritisch: "bg-red-50 text-red-800 ring-red-200",
};

const leistungText = (kwp) => (kwp >= 1000 ? `${zahl(kwp / 1000, kwp < 10000 ? 1 : 0)} MWp` : `${zahl(Math.round(kwp / 10) * 10)} kWp`);

/** Ampel mit drei Lichtern; das aktive leuchtet. */
function Ampel({ wert }) {
  return (
    <div aria-hidden="true" className="flex shrink-0 flex-col gap-2 rounded-full bg-navy-900 p-2 ring-1 ring-white/10">
      {["rot", "gelb", "gruen"].map((a) => (
        <span
          key={a}
          className={cn(
            "h-6 w-6 rounded-full transition-all duration-500 md:h-7 md:w-7",
            a === wert ? cn(AMPEL_FARBE[a].punkt, AMPEL_FARBE[a].glow) : "bg-white/10"
          )}
        />
      ))}
    </div>
  );
}

export default function FlaechenCheck({ startLand = "oberoesterreich" }) {
  const landId = useId();
  const [bundesland, setBundesland] = useState(LAENDER.some((l) => l.slug === startLand) ? startLand : "oberoesterreich");
  const [ha, setHa] = useState(3);
  const [widmung, setWidmung] = useState("acker");
  const [netzKm, setNetzKm] = useState(1);
  const [ausrichtung, setAusrichtung] = useState("sued");
  const [neigung, setNeigung] = useState(5);

  const r = useMemo(
    () => pruefeFlaeche({ hektar: ha, widmung, netzKm, neigung, ausrichtung, bundesland }),
    [ha, widmung, netzKm, neigung, ausrichtung, bundesland]
  );
  const ampel = AMPEL[r.ampel];
  const p = r.pacht;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(10,20,40,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* Eingaben */}
        <div className="space-y-8 p-5 sm:p-7 md:p-9">
          <Gruppe titel="Lage und Widmung">
            <div>
              <label htmlFor={landId} className="mb-2.5 block text-[14.5px] font-semibold text-ink-800">
                Bundesland
              </label>
              <select
                id={landId}
                value={bundesland}
                onChange={(e) => setBundesland(e.target.value)}
                className="block h-12 w-full cursor-pointer rounded-2xl bg-ink-100/80 px-4 text-[15px] font-semibold text-ink-900 outline-none ring-1 ring-transparent transition focus-visible:ring-2 focus-visible:ring-ov-500"
              >
                {LAENDER.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <Auswahl legende="Aktuelle Widmung bzw. Nutzung" optionen={WIDMUNGEN} wert={widmung} onChange={setWidmung} spalten={3} klein />
          </Gruppe>

          <Gruppe titel="Fläche und Netz">
            <Regler label="Größe der Fläche" wert={ha} min={0.2} max={30} step={0.1} onChange={setHa} format={hektar} hinweis="Zusammenhängende, nutzbare Fläche ohne Wald, Gewässer und Wege." />
            <Regler
              label="Entfernung zum Netzanschluss"
              wert={netzKm}
              min={0}
              max={10}
              step={0.1}
              onChange={setNetzKm}
              format={(v) => `${zahl(v, 1)} km`}
              hinweis="Luftlinie zur nächsten Mittelspannungsleitung oder zum Umspannwerk – grob geschätzt reicht."
            />
          </Gruppe>

          <Gruppe titel="Gelände">
            <Auswahl legende="Ausrichtung des Hangs" optionen={AUSRICHTUNGEN} wert={ausrichtung} onChange={setAusrichtung} klein />
            {ausrichtung !== "eben" && (
              <Regler label="Hangneigung" wert={neigung} min={0} max={35} step={1} onChange={setNeigung} format={(v) => `${zahl(v)}°`} hinweis="10° entsprechen rund 18 % Steigung." />
            )}
          </Gruppe>
        </div>

        {/* Ergebnis */}
        <div className="flex flex-col border-t border-ink-200/70 bg-sand-50 lg:border-l lg:border-t-0">
          <div className="ov-noise relative overflow-hidden bg-navy-950 p-5 text-white sm:p-7 md:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ov-500/25 blur-[90px]" />
            <div className="relative flex items-start gap-5">
              <Ampel wert={r.ampel} />
              <div className="min-w-0" role="status" aria-live="polite">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Eignungsampel · {r.land.name}</p>
                <p className={cn("mt-1.5 font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.2rem)] font-extrabold leading-tight tracking-tight", AMPEL_FARBE[r.ampel].text)}>{ampel.label}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{ampel.text}</p>
              </div>
            </div>
            <dl className="relative mt-7 grid grid-cols-2 gap-3">
              <div className="ov-glass rounded-2xl p-4">
                <dt className="flex items-center gap-1.5 text-[12.5px] text-white/65">
                  <LandPlot aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
                  mögliche Leistung
                </dt>
                <dd className="ov-num mt-1 font-display text-[22px] font-extrabold tracking-tight">≈ {leistungText(r.kwp)}</dd>
                <dd className="text-[12px] text-white/55">Richtwert {zahl(r.kwpProHa)} kWp/ha (eNu)</dd>
              </div>
              <div className="ov-glass rounded-2xl p-4">
                <dt className="flex items-center gap-1.5 text-[12.5px] text-white/65">
                  <Coins aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" />
                  Pacht je Jahr
                </dt>
                {p.belegt ? (
                  <>
                    <dd className="ov-num mt-1 font-display text-[22px] font-extrabold leading-tight tracking-tight">
                      {euro(p.jahrVon)} – {euro(p.jahrBis)}
                    </dd>
                    <dd className="text-[12px] text-white/55">Angebotsspanne laut LK ({zahl(p.jeHaVon)}–{zahl(p.jeHaBis)} €/ha)</dd>
                  </>
                ) : (
                  <>
                    <dd className="mt-1 font-display text-[17px] font-extrabold leading-tight">Richtwert – Quelle offen</dd>
                    <dd className="text-[12px] text-white/55">für diese Flächenart keine belegte Spanne</dd>
                  </>
                )}
              </div>
            </dl>
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-7 md:p-9">
            <h3 className="font-display text-[17px] font-bold text-ink-900">Die vier Prüfpunkte</h3>
            <ul className="mt-4 space-y-3">
              {r.kriterien.map((k) => (
                <li key={k.id} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14.5px] font-semibold text-ink-900">{k.label}</p>
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1", STUFE_CHIP[k.stufe])}>{STUFEN[k.stufe].label}</span>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{k.text}</p>
                  {k.id === "widmung" && (
                    <Link
                      href={widmungsPfad(r.land.slug)}
                      className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800"
                    >
                      <Scale aria-hidden="true" className="h-3.5 w-3.5" />
                      Rechtslage {r.land.im} im Detail
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl bg-white p-4 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
              <p className="flex items-center gap-1.5 font-semibold text-ink-900">
                <Coins aria-hidden="true" className="h-4 w-4 text-sun-500" />
                Zur Pacht
              </p>
              {p.belegt ? (
                <p className="mt-1.5">
                  {p.hinweis} Zum Vergleich: Die durchschnittliche Pacht für {p.agrarLabel} lag 2024 bei {zahl(p.agrar)} €/ha und Jahr (Statistik Austria) – ein PV-Angebot entspricht also etwa dem {zahl(p.faktorVon)}- bis {zahl(p.faktorBis)}-Fachen.
                </p>
              ) : (
                <p className="mt-1.5">{p.hinweis}</p>
              )}
              {r.eagAbschlag && (
                <p className="mt-2">
                  Gut zu wissen: Auf Agrar- und Grünland kürzt das EAG den Investitionszuschuss bzw. die Marktprämie um 25 % – außer bei Agri-PV. Das drückt die Zahlungsbereitschaft von Betreibern.
                </p>
              )}
              {p.quellen.length > 0 && (
                <p className="mt-2 text-[12.5px] text-ink-500">
                  Quellen:{" "}
                  {p.quellen.map((q, i) => (
                    <span key={q.url}>
                      {i > 0 && " · "}
                      <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                        {q.label.split(" – ")[0]}
                        <span className="sr-only"> (externer Link, neues Fenster)</span>
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/rechner/freiflaeche-pacht" icon={Calculator} className="w-full sm:w-auto">
                Pacht &amp; Ertrag berechnen
              </Button>
              <Button href="/kontakt" variant="secondary" pfeil className="w-full sm:w-auto">
                Fläche prüfen lassen
              </Button>
            </div>
            <p className="mt-5 flex gap-2 text-[12.5px] leading-relaxed text-ink-500">
              <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Ersteinschätzung, keine Rechts- oder Steuerberatung. Rechtslage laut RIS, Stand 30.09.2026; Netz und Gelände sind Faustregeln von Ökovolt, keine Norm.{" "}
                <Link href="#methodik" className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:text-ov-700">
                  So bewerten wir
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
