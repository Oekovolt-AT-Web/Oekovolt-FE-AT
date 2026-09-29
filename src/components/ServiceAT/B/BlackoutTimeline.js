"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Building,
  Calculator,
  Droplets,
  Factory,
  Fuel,
  Lightbulb,
  Pause,
  Play,
  PlugZap,
  RotateCcw,
  ServerCog,
  Snowflake,
  Sun,
  Thermometer,
  Zap,
} from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Blackout-Zeitleiste (Stunde 0 → 48) mit Umschalter „ohne/mit Ersatzstrom“.
 * Vereinfachte Simulation in Viertelstunden: kritische Last, schwarzstartfähiger
 * Speicher (Reserve), PV-Nachladung an einem Frühjahrstag, Aggregat mit
 * Start bei 20 % / Stopp bei 60 % Ladestand. Beispielszenario – keine Auslegung.
 */

const START_UHR = 16; // Blackout beginnt um 16:00
const DAUER = 48;
const SCHRITT = 0.25;
const SONNE = { auf: 6.5, unter: 19, spitze: 0.62 }; // kW je kWp, klarer Frühjahrstag (vereinfacht)

const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });
const uhrzeit = (h) => {
  const t = (START_UHR + h) % 24;
  const std = Math.floor(t);
  const min = Math.round((t - std) * 60);
  return `${String(std).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};
const tagNr = (h) => Math.floor((START_UHR + h) / 24) + 1;

function pvLeistung(h, kwp) {
  const t = (START_UHR + h) % 24;
  if (t <= SONNE.auf || t >= SONNE.unter) return 0;
  const x = (t - SONNE.auf) / (SONNE.unter - SONNE.auf);
  return kwp * SONNE.spitze * Math.pow(Math.sin(Math.PI * x), 1.4);
}

function lastProfil(h, last) {
  const t = (START_UHR + h) % 24;
  // nachts etwas weniger (Beleuchtung, Heizung reduziert)
  return t >= 22 || t < 6 ? last * 0.8 : last;
}

function simuliere({ last, speicher, kwp, aggregat }) {
  const reihe = [];
  let soc = speicher;
  let gen = false;
  let versorgt = 0;
  let genStunden = 0;
  let socMin = speicher;
  let pvKwh = 0;
  for (let h = 0; h <= DAUER + 1e-9; h += SCHRITT) {
    const pv = pvLeistung(h, kwp);
    const l = lastProfil(h, last);
    if (aggregat && soc <= speicher * 0.2) gen = true;
    if (gen && soc >= speicher * 0.6) gen = false;
    const genLeistung = gen ? l * 1.35 : 0;
    const bilanz = pv + genLeistung - l;
    const vorher = soc;
    soc = Math.min(speicher, Math.max(0, soc + bilanz * SCHRITT));
    const ok = vorher > 0.01 || pv + genLeistung >= l;
    if (h < DAUER) {
      if (ok) versorgt += SCHRITT;
      if (gen) genStunden += SCHRITT;
      pvKwh += Math.min(pv, l + Math.max(0, speicher - vorher) / SCHRITT) * SCHRITT;
    }
    socMin = Math.min(socMin, soc);
    reihe.push({ h, pv, last: l, soc, gen, ok });
  }
  return { reihe, versorgt, genStunden, socMin, pvKwh };
}

const VERBRAUCHER = [
  { icon: ServerCog, name: "IT, Server & Kommunikation", kritisch: true },
  { icon: Snowflake, name: "Kühlung & Kühlkette", kritisch: true },
  { icon: Thermometer, name: "Heizung & Umwälzpumpen", kritisch: true },
  { icon: Droplets, name: "Wasser- & Abwasserpumpen", kritisch: true },
  { icon: Building, name: "Tore, Zutritt, Alarmanlage", kritisch: true },
  { icon: Lightbulb, name: "Beleuchtung (Arbeitsbereiche)", kritisch: true },
  { icon: Factory, name: "Produktion, Nebenverbraucher", kritisch: false },
];

// Ereignisse im Szenario (Stunde, Text) – bewusst als Größenordnung formuliert
const EREIGNISSE_OHNE = [
  { h: 0, t: "Netz fällt aus. Der Netz- und Anlagenschutz trennt die PV-Wechselrichter sofort – das Dach liefert nichts." },
  { h: 0.25, t: "Licht, IT, Kühlung, Heizung und Tore sind ohne Strom. Server ohne USV fallen hart aus." },
  { h: 3, t: "Kühlräume erwärmen sich, Pumpen stehen. Produktion kann nicht geordnet heruntergefahren werden." },
  { h: 15, t: "Sonne ist da – eine normale netzgekoppelte PV-Anlage bleibt trotzdem abgeschaltet." },
  { h: 24, t: "Geübte Konzepte zielen auf Wiederversorgung binnen rund 24 Stunden – bei europaweiten Störungen kann es länger dauern." },
  { h: 40, t: "Mobilfunk, Internet und Zahlungsverkehr bleiben eingeschränkt; Telekom-Notstrom ist oft nur auf 48–72 Stunden ausgelegt." },
];

const EREIGNISSE_MIT = [
  { h: 0, t: "Netz fällt aus. Die Umschalteinrichtung trennt allpolig vom Netz, der schwarzstartfähige Speicher bildet das Inselnetz." },
  { h: 0.25, t: "Lastmanagement: kritische Verbraucher laufen weiter, Nebenverbraucher werden automatisch abgeworfen." },
  { h: 3, t: "Speicher versorgt IT, Kühlung, Heizung und Pumpen – leise und ohne Abgase." },
  { h: 14.5, t: "Sonnenaufgang: Die PV-Wechselrichter synchronisieren sich am Inselnetz und laden den Speicher nach." },
  { h: 24, t: "Tag 2: Der Betrieb bleibt handlungsfähig – Krisenplan, Kommunikation und Kühlketten gesichert." },
  { h: 40, t: "Für lange Ausfälle und den Winter lädt bei Bedarf das Aggregat nach; der Speicher glättet Lastspitzen." },
];

export default function BlackoutTimeline() {
  const id = useId();
  const [mit, setMit] = useState(true);
  const [stunde, setStunde] = useState(0);
  const [laeuft, setLaeuft] = useState(false);
  const [last, setLast] = useState(40);
  const [speicher, setSpeicher] = useState(300);
  const [kwp, setKwp] = useState(150);
  const [aggregat, setAggregat] = useState(true);
  const wurzel = useRef(null);
  const gestartet = useRef(false);

  const sim = useMemo(() => simuliere({ last, speicher, kwp, aggregat }), [last, speicher, kwp, aggregat]);
  const idx = Math.min(sim.reihe.length - 1, Math.round(stunde / SCHRITT));
  const p = sim.reihe[idx];
  const versorgtJetzt = mit && p.ok;

  // Einmal automatisch abspielen, sobald die Grafik sichtbar ist (nicht bei reduzierter Bewegung)
  useEffect(() => {
    const el = wurzel.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStunde(20);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !gestartet.current) {
          gestartet.current = true;
          setLaeuft(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!laeuft) return;
    const t = setInterval(() => {
      setStunde((s) => {
        if (s >= DAUER) {
          setLaeuft(false);
          return DAUER;
        }
        return Math.min(DAUER, s + SCHRITT);
      });
    }, 70);
    return () => clearInterval(t);
  }, [laeuft]);

  const abspielen = () => {
    if (stunde >= DAUER) setStunde(0);
    setLaeuft((l) => !l);
  };

  const ereignisse = mit ? EREIGNISSE_MIT : EREIGNISSE_OHNE;
  const aktuell = [...ereignisse].reverse().find((e) => e.h <= stunde) || ereignisse[0];

  // Diagramm-Geometrie (viewBox 0..480 × 0..160, preserveAspectRatio none)
  const W = 480;
  const H = 160;
  const x = (h) => (h / DAUER) * W;
  const pvMax = Math.max(kwp * SONNE.spitze, last * 1.4, 1);
  const yP = (kw) => H - (kw / pvMax) * (H * 0.9);
  const ySoc = (kwh) => H - (kwh / speicher) * (H * 0.9);
  const pfad = (werte, yf) => werte.map((r, i) => `${i ? "L" : "M"}${x(r.h).toFixed(1)},${yf(r).toFixed(1)}`).join("");
  const pvPfad = pfad(sim.reihe, (r) => yP(r.pv));
  const socPfad = pfad(sim.reihe, (r) => ySoc(r.soc));
  const nachtBaender = [];
  for (let h = 0; h < DAUER; h += SCHRITT) {
    const t = (START_UHR + h) % 24;
    const nacht = t < SONNE.auf || t >= SONNE.unter;
    const letzte = nachtBaender[nachtBaender.length - 1];
    if (nacht) {
      if (letzte && Math.abs(letzte.bis - h) < 1e-6) letzte.bis = h + SCHRITT;
      else nachtBaender.push({ von: h, bis: h + SCHRITT });
    }
  }
  const genBaender = [];
  const ausBaender = [];
  sim.reihe.forEach((r) => {
    if (r.h >= DAUER) return;
    const add = (liste) => {
      const l = liste[liste.length - 1];
      if (l && Math.abs(l.bis - r.h) < 1e-6) l.bis = r.h + SCHRITT;
      else liste.push({ von: r.h, bis: r.h + SCHRITT });
    };
    if (r.gen) add(genBaender);
    if (!r.ok) add(ausBaender);
  });

  return (
    <div ref={wurzel} className="overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl ring-1 ring-white/10">
      {/* Kopf */}
      <div className="flex flex-col gap-5 border-b border-ink-100 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Blackout-Szenario 48 Stunden</p>
          <h3 className="ov-h3 mt-1.5 text-ink-900">Was passiert in Ihrem Betrieb, wenn das Netz ausfällt?</h3>
        </div>
        <div role="group" aria-label="Szenario wählen" className="grid grid-cols-2 rounded-full bg-ink-100 p-1">
          {[
            { v: false, l: "Ohne Ersatzstrom" },
            { v: true, l: "Mit Ersatzstrom" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              aria-pressed={mit === o.v}
              onClick={() => setMit(o.v)}
              className={cn(
                "h-11 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 sm:px-6",
                mit === o.v ? (o.v ? "bg-ov-600 text-white shadow-md" : "bg-navy-950 text-white shadow-md") : "text-ink-600 hover:text-ink-900"
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Zeitleiste */}
        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div aria-live="polite">
              <p className="text-[13px] text-ink-500">Stunde nach Ausfall</p>
              <p className="ov-num font-display text-[44px] font-extrabold leading-none tracking-tight text-ink-900 sm:text-[56px]">
                {zahl(Math.floor(stunde))}
                <span className="ml-1 text-[20px] font-bold text-ink-400">h</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-ink-500">Uhrzeit (Beispiel, Tag {tagNr(stunde)})</p>
              <p className="ov-num font-display text-[26px] font-extrabold tracking-tight text-ink-800">{uhrzeit(stunde)} Uhr</p>
            </div>
          </div>

          {/* Diagramm */}
          <div className={cn("relative mt-5 overflow-hidden rounded-2xl ring-1 transition-colors duration-500", mit ? "bg-ov-50/60 ring-ov-200/70" : "bg-navy-950 ring-navy-900")}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[190px] w-full sm:h-[230px]" aria-hidden="true">
              {nachtBaender.map((b) => (
                <rect key={b.von} x={x(b.von)} y="0" width={x(b.bis) - x(b.von)} height={H} fill={mit ? "rgba(3,18,43,0.07)" : "rgba(255,255,255,0.04)"} />
              ))}
              {mit && genBaender.map((b) => <rect key={`g${b.von}`} x={x(b.von)} y={H - 6} width={x(b.bis) - x(b.von)} height="6" fill="#f5a70f" />)}
              {mit && ausBaender.map((b) => <rect key={`a${b.von}`} x={x(b.von)} y="0" width={x(b.bis) - x(b.von)} height={H} fill="rgba(220,38,38,0.14)" />)}
              {/* PV */}
              <path d={`${pvPfad}L${W},${H}L0,${H}Z`} fill={mit ? "rgba(255,197,61,0.35)" : "rgba(255,197,61,0.08)"} />
              <path d={pvPfad} fill="none" stroke={mit ? "#f5a70f" : "rgba(255,197,61,0.35)"} strokeWidth="1.5" strokeDasharray={mit ? undefined : "4 4"} vectorEffect="non-scaling-stroke" />
              {/* Last */}
              <line x1="0" x2={W} y1={yP(last)} y2={yP(last)} stroke={mit ? "#394050" : "rgba(255,255,255,0.35)"} strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
              {/* Speicher */}
              {mit && (
                <>
                  <path d={`${socPfad}L${W},${H}L0,${H}Z`} fill="rgba(102,153,51,0.18)" />
                  <path d={socPfad} fill="none" stroke="#558227" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </>
              )}
              {!mit && <rect x="0" y="0" width={x(stunde)} height={H} fill="rgba(220,38,38,0.16)" />}
              {/* Jetzt */}
              <line x1={x(stunde)} x2={x(stunde)} y1="0" y2={H} stroke={mit ? "#151a24" : "#ffc53d"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-[11.5px] font-semibold">
              <span className={mit ? "text-ink-600" : "text-white/60"}>{mit ? "Speicher-Ladestand · PV · Last" : "Kein Strom im Betrieb"}</span>
              <span className={cn("rounded-full px-2.5 py-0.5", versorgtJetzt ? "bg-ov-600 text-white" : "bg-red-600 text-white")}>{versorgtJetzt ? "versorgt" : "Stillstand"}</span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[11.5px] text-ink-500">
            <span>0 h · {uhrzeit(0)}</span>
            <span>24 h</span>
            <span>48 h</span>
          </div>

          {/* Steuerung */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={abspielen}
              aria-label={laeuft ? "Zeitleiste anhalten" : "Zeitleiste abspielen"}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-950 text-white shadow-lg transition-transform hover:scale-105"
            >
              {laeuft ? <Pause aria-hidden="true" className="h-5 w-5" /> : stunde >= DAUER ? <RotateCcw aria-hidden="true" className="h-5 w-5" /> : <Play aria-hidden="true" className="ml-0.5 h-5 w-5" />}
            </button>
            <label htmlFor={`${id}-h`} className="sr-only">
              Stunde nach dem Stromausfall
            </label>
            <input
              id={`${id}-h`}
              type="range"
              min={0}
              max={DAUER}
              step={SCHRITT}
              value={stunde}
              onChange={(e) => {
                setLaeuft(false);
                setStunde(Number(e.target.value));
              }}
              aria-valuetext={`Stunde ${zahl(Math.floor(stunde))}, ${uhrzeit(stunde)} Uhr`}
              className="ov-range block min-w-0 flex-1 cursor-pointer"
              style={{ "--ov-fill": `${(stunde / DAUER) * 100}%` }}
            />
          </div>

          {/* Ereignis */}
          <div key={`${mit}-${aktuell.h}`} className={cn("sb-ein mt-5 flex gap-3 rounded-2xl p-4 text-[15px] leading-relaxed", mit ? "bg-ov-50 text-ink-800 ring-1 ring-ov-200/70" : "bg-red-50 text-red-900 ring-1 ring-red-200")}>
            <Zap aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", mit ? "text-ov-600" : "text-red-600")} />
            <p>
              <strong className="font-semibold">Stunde {zahl(Math.floor(aktuell.h))}:</strong> {aktuell.t}
            </p>
          </div>

          {/* Szenario anpassen */}
          <details className={cn("group mt-5 rounded-2xl bg-sand-50 ring-1 ring-ink-200/60", !mit && "opacity-60")}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] font-semibold text-ink-700 [&::-webkit-details-marker]:hidden">
              Szenario anpassen: Last, Speicher, PV, Aggregat
              <span aria-hidden="true" className="text-[18px] text-ink-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="grid gap-5 px-4 pb-5 sm:grid-cols-2">
              <Regler id={`${id}-l`} label="Kritische Last" wert={last} anzeige={`${zahl(last)} kW`} min={5} max={300} step={5} onChange={setLast} />
              <Regler id={`${id}-s`} label="Speicher-Reserve" wert={speicher} anzeige={`${zahl(speicher)} kWh`} min={20} max={2000} step={10} onChange={setSpeicher} />
              <Regler id={`${id}-p`} label="PV-Leistung" wert={kwp} anzeige={`${zahl(kwp)} kWp`} min={0} max={1000} step={10} onChange={setKwp} />
              <label className="flex cursor-pointer items-center gap-3 self-center text-[14px] font-medium text-ink-700">
                <input type="checkbox" checked={aggregat} onChange={(e) => setAggregat(e.target.checked)} className="h-5 w-5 cursor-pointer accent-ov-600" />
                Aggregat lädt bei 20 % nach
              </label>
            </div>
          </details>
        </div>

        {/* Status */}
        <div className={cn("flex min-w-0 flex-col border-t p-5 transition-colors duration-500 sm:p-7 lg:border-l lg:border-t-0", mit ? "border-ink-100 bg-white" : "border-navy-900 bg-navy-950 text-white")}>
          <p className={cn("text-[12.5px] font-semibold uppercase tracking-[0.16em]", mit ? "text-ov-600" : "text-ov-300")}>Status im Betrieb</p>
          <ul className="mt-4 space-y-2">
            {VERBRAUCHER.map((v) => {
              const an = mit ? v.kritisch && p.ok : false;
              return (
                <li key={v.name} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] transition-colors duration-300", mit ? "bg-sand-50" : "bg-white/[0.05]")}>
                  <v.icon aria-hidden="true" className={cn("h-4.5 w-4.5 shrink-0", an ? "text-ov-600" : mit ? "text-ink-400" : "text-white/40")} />
                  <span className={cn("min-w-0 flex-1", mit ? "text-ink-800" : "text-white/80")}>{v.name}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                      an ? "bg-ov-100 text-ov-800" : mit && !v.kritisch ? "bg-ink-100 text-ink-600" : "bg-red-100 text-red-800"
                    )}
                  >
                    {an ? "läuft" : mit && !v.kritisch ? "abgeworfen" : "aus"}
                  </span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <Kachel dunkel={!mit} icon={PlugZap} label="Versorgt in 48 h" wert={mit ? `${zahl(sim.versorgt)} h` : "0 h"} />
            <Kachel dunkel={!mit} icon={BatteryCharging} label="Speicher minimal" wert={mit ? `${zahl((sim.socMin / speicher) * 100)} %` : "–"} />
            <Kachel dunkel={!mit} icon={Sun} label="PV im Inselbetrieb" wert={mit ? `${zahl(sim.pvKwh)} kWh` : "0 kWh"} />
            <Kachel dunkel={!mit} icon={Fuel} label="Aggregat-Laufzeit" wert={mit ? `${zahl(sim.genStunden, sim.genStunden % 1 ? 1 : 0)} h` : "–"} />
          </dl>

          <Link
            href="/rechner/blackout"
            className={cn(
              "group mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors lg:mt-auto",
              mit ? "bg-navy-950 text-white hover:bg-navy-800" : "bg-ov-600 text-white hover:bg-ov-700"
            )}
          >
            <Calculator aria-hidden="true" className="h-4 w-4" />
            Eigenen Bedarf im Blackout-Rechner prüfen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <p className="border-t border-ink-100 px-5 py-4 text-[12.5px] leading-relaxed text-ink-500 sm:px-7">
        Vereinfachtes Beispielszenario, keine Auslegung: Ausfall ab {START_UHR}:00 Uhr über 48 Stunden, klarer Frühjahrstag (Sonne ca. 6:30–19:00 Uhr), nachts 80 % der kritischen Last,
        Aggregat startet bei 20 % und stoppt bei 60 % Ladestand. Im Winter liefert PV deutlich weniger. Die tatsächliche Auslegung ergibt sich aus Messung, Anlaufströmen und
        Netzbetreiber-Vorgaben.
      </p>
    </div>
  );
}

function Kachel({ icon: Icon, label, wert, dunkel }) {
  return (
    <div className={cn("rounded-2xl p-3.5", dunkel ? "bg-white/[0.05] ring-1 ring-white/10" : "bg-sand-50 ring-1 ring-ink-200/60")}>
      <dt className={cn("flex items-center gap-1.5 text-[12px]", dunkel ? "text-white/55" : "text-ink-500")}>
        <Icon aria-hidden="true" className={cn("h-3.5 w-3.5", dunkel ? "text-white/50" : "text-ov-600")} />
        {label}
      </dt>
      <dd className={cn("ov-num mt-1 font-display text-[20px] font-extrabold tracking-tight", dunkel ? "text-white" : "text-ink-900")}>{wert}</dd>
    </div>
  );
}

function Regler({ id, label, wert, anzeige, min, max, step, onChange }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-medium text-ink-700">
          {label}
        </label>
        <output htmlFor={id} className="ov-num font-display text-[16px] font-extrabold text-ink-900">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range mt-3 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
    </div>
  );
}
