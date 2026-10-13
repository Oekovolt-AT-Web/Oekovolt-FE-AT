// src/components/GewerbeUnikat/K5Ansicht.js
//
// K5 · Leistungspreis – REINE Ansicht (ohne Hooks, ohne "use client"): Spitzen-Uhr mit Ring-Liste,
// Monatstürme mit Deckel und Batterie, Kennwerte, Grenznutzen und Staffelstart.
//  - Server: rendert sie mit dem Startzustand als Platzhalter (statisch, `inert`), beide Gerätevarianten.
//  - Client (K5SpitzenJagd): dieselbe Ansicht mit motion-Elementen (k), Handlern (aktionen) und Slots
//    (Erkenntnisse, Kappen-Flug, Ansage). So bleibt die Fläche beim Austausch exakt gleich (kein CLS).
//
// Mobil (< 768 px) bewusst kompakt (Kapitel ≤ 2.600 px): Unter-Eyebrows aus, Umschalter in einer Zeile,
// Grenznutzen und Staffelstart bis lg aufklappbar, leere Erkenntnis-Plätze ohne Abstand.

import { Kennzeichnung, QuellePille } from "./_bausteine";
import { FARBE, KENNZEICHNUNG, QUELLE, STAND, zahl } from "./_tokens";
import { NETZ_QUELLE } from "@/lib/rechner/peakshaving";
import { BATTERIE_BREITE, BatterieBild, GrenzBild, STATISCH, TUERME_BREITE_SSR, TUERME_HOEHE, TuermeBild, UhrBeschriftung, UhrBild, tuermeSkalen } from "./K5Grafik";
import { NB, euroWert } from "./K5Rechnen";
import K5Staffelstart from "./K5Staffelstart";

function ZahlStatisch({ wert, stellen = 0, vor = "", nach = "", format, className }) {
  return (
    <span className={["ov-num", className].filter(Boolean).join(" ")}>
      {vor}
      {format ? format(wert) : zahl(wert, stellen)}
      {nach}
    </span>
  );
}

/** Wie Segment aus ./_gestaltung (gefüllt, ohne Rahmen) – statisch für den Server-Platzhalter. */
function SegmentStatisch({ name, wert, optionen, klein = false, className, label }) {
  return (
    <fieldset className={["min-w-0", className].filter(Boolean).join(" ")}>
      {label && <legend className="mb-2 text-[12.5px] font-semibold text-white/60">{label}</legend>}
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-white/[0.07] p-1">
        {optionen.map((o) => (
          <label
            key={o.id}
            className={[
              "relative flex select-none items-center justify-center rounded-full font-semibold",
              klein ? "min-h-9 px-3 text-[13px]" : "min-h-11 px-4 text-[14px]",
              o.id === wert ? "bg-white text-navy-950" : "text-white/75",
            ].join(" ")}
          >
            <input type="radio" name={`${name}-ssr`} value={o.id} defaultChecked={o.id === wert} className="sr-only" tabIndex={-1} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Statischer Komponentensatz (Server). */
export const STATISCH_K = { ...STATISCH, Zahl: ZahlStatisch, Segment: SegmentStatisch };

export const MODUS_OPTIONEN = [
  {
    id: "2026",
    label: (
      <span>
        <span className="max-sm:hidden">bis </span>2026
      </span>
    ),
  },
  {
    id: "2027",
    label: (
      <span>
        <span className="max-sm:hidden">ab </span>2027 (Entwurf)
      </span>
    ),
  },
];

/** Euro auf 10 € (bzw. 100 €) – auch während die Zahl gleitet. */
const euroFormat = (x) => zahl(euroWert(x));

function Eyebrow({ children, className = "" }) {
  return <p className={`text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300 ${className}`}>{children}</p>;
}

function Wert({ label, wert, einheit, testid }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-[11.5px] leading-snug text-white/58 md:text-[12.5px]">{label}</dt>
      <dd className="mt-1 font-display text-[18px] font-extrabold leading-none tracking-[-0.02em] text-white md:text-[23px]" data-testid={testid}>
        {wert}
        {einheit && wert !== "–" && <span className="text-[0.55em] font-bold text-white/60"> {einheit}</span>}
      </dd>
    </div>
  );
}

/** Plus/Minus-Zeichen der Aufklapp-Knöpfe. */
function Plus({ offen }) {
  return (
    <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-ov-300">
      <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded bg-current" />
      <span className={["absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300 motion-reduce:transition-none", offen ? "scale-y-0" : ""].join(" ")} />
    </span>
  );
}

/**
 * Griff am Deckel: zweizeilig „230 kW / ≈ 4.050 €/a“ – Geste, Deckel und Geld in einem Blick (auch mobil,
 * wo die große Zahl beim Ziehen unter der Daumenleiste liegt).
 */
function Griff({ v, k, top, griff, hinweis }) {
  const aktiv = !!griff;
  const geld = v.euro != null && v.modus !== "2027";
  const text =
    `Deckel ${zahl(v.deckel)} kW` +
    (v.zeile?.moeglich ? ` – Speicher ${zahl(v.zeile.leistungKw)} kW, ${zahl(v.zeile.nennKwh)} kWh` : v.zeile ? " – zu nah an der Dauerlast" : "") +
    (geld ? ` – etwa ${zahl(euroWert(v.euro))} Euro pro Jahr weniger Leistungspreis` : "");
  return (
    <div
      role={aktiv ? "slider" : undefined}
      tabIndex={aktiv ? 0 : undefined}
      aria-label={aktiv ? "Deckel ziehen" : undefined}
      aria-orientation={aktiv ? "vertical" : undefined}
      aria-valuemin={aktiv ? v.bereichDeckel.min : undefined}
      aria-valuemax={aktiv ? v.bereichDeckel.max : undefined}
      aria-valuenow={aktiv ? v.deckel : undefined}
      aria-valuetext={aktiv ? text : undefined}
      data-testid={aktiv ? "deckel" : undefined}
      className="group absolute -right-2.5 z-2 flex h-12 min-w-12 -translate-y-1/2 cursor-ns-resize touch-none select-none items-center justify-end outline-none md:-right-1 md:min-w-[64px]"
      style={{ top }}
      {...griff}
    >
      <span className="flex min-w-[48px] flex-col items-center justify-center rounded-[14px] bg-white px-2 py-[5px] text-navy-950 shadow-[0_8px_22px_-8px_rgba(0,0,0,0.75)] outline-offset-2 transition-transform duration-200 group-focus-visible:outline-2 group-focus-visible:outline-ov-400 group-active:scale-105 motion-reduce:transition-none md:px-3 md:py-1.5">
        <span className="ov-num whitespace-nowrap font-display text-[13px] font-extrabold leading-none md:text-[14px]">
          {zahl(v.deckel)}
          <span className="ml-0.5 text-[0.75em] font-bold text-navy-950/60">kW</span>
        </span>
        {geld && (
          <span className="mt-[3px] whitespace-nowrap font-display text-[10px] font-bold leading-none text-navy-950/72 md:mt-1 md:text-[11.5px]">
            <k.Zahl wert={euroWert(v.euro)} format={euroFormat} vor={`≈${NB}`} nach={`${NB}€/a`} />
          </span>
        )}
      </span>
      {hinweis && (
        <span aria-hidden="true" className="pointer-events-none absolute -top-[18px] right-1 whitespace-nowrap text-[11px] font-semibold text-white/70">
          ↕ ziehen
        </span>
      )}
    </div>
  );
}

function TuermeFeld({ v, k, breite, hoehe, mobil, griff, plot, svgRef, hinweis, skalieren = false }) {
  const s = tuermeSkalen({ breite, hoehe, mobil, v });
  return (
    <>
      <TuermeBild v={v} k={k} breite={breite} hoehe={hoehe} mobil={mobil} plot={plot} svgRef={svgRef} skalieren={skalieren} />
      {/* skaliert (Server-Platzhalter): Griff steckt in der Grafik selbst */}
      {!skalieren && <Griff v={v} k={k} top={Math.round(s.y(v.deckel) * 10) / 10} griff={griff} hinweis={hinweis} />}
    </>
  );
}

/**
 * @param {object} p
 * @param {object} p.v Ansichts-Modell aus ansichtModell()
 * @param {object} [p.k] Komponentensatz (STATISCH_K oder motion)
 * @param {object} [p.aktionen] Handler (nur Client)
 * @param {object} [p.slots] { erkenntnisUhr, erkenntnisDeckel, kappen, ansage }
 * @param {object} [p.refs] { uhrSvg, tuermeSvg, tuermeBox, wrap }
 * @param {object} [p.mass] { breite, breiteLinks, mobil } (nur Client; ohne: beide Varianten, CSS schaltet)
 */
export default function K5Ansicht({ v, k = STATISCH_K, aktionen = null, slots = {}, refs = {}, mass = null, intro = "fertig", hinweis = false, offen = {} }) {
  const statisch = !aktionen;
  const a = aktionen || {};
  const S = k.Segment;
  const aktiv = v.monate[v.aktiv];
  const eigen = v.quelle === "eigen";
  const ab2027 = v.modus === "2027";
  const z = v.zeile;
  const fuellProzent = ((v.deckel - v.bereichDeckel.min) / Math.max(1, v.bereichDeckel.max - v.bereichDeckel.min)) * 100;
  const mittelSatz = (
    <>
      <span className="ov-num font-semibold text-white">{zahl(v.mittelOhne, 1)}</span> →{" "}
      <span className="ov-num whitespace-nowrap font-semibold text-white">
        {zahl(v.mittelNachher, 1)}
        {NB}kW
      </span>
    </>
  );

  return (
    <div className="grid gap-8 md:gap-14 lg:gap-20">
      {/* ───────────────────────── A · Spitzen-Uhr ───────────────────────── */}
      <div
        role="group"
        aria-labelledby="k5-uhr-titel"
        data-testid="spitzen-uhr"
        className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-6 lg:[grid-template-areas:'uhr_kopf'_'uhr_liste'] xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)] xl:gap-x-14"
      >
        <div className="max-md:absolute lg:[grid-area:kopf]">
          <Eyebrow className="max-md:hidden">Spitzen-Uhr</Eyebrow>
          {/* mobil nur für Screenreader – die H2 direkt darüber trägt die Frage, das Instrument folgt sofort */}
          <h3 id="k5-uhr-titel" className="font-display text-[21px] font-extrabold leading-snug tracking-[-0.02em] text-white max-md:sr-only md:mt-2 md:text-[25px]">
            Wann fällt die teuerste Viertelstunde?
          </h3>
          <p className="mt-2 max-w-[60ch] text-[15.5px] leading-relaxed text-white/68 max-md:hidden">
            Jeder Ring ist ein Monat – Jänner innen, Dezember außen. Der Punkt zeigt die Uhrzeit der Monatsspitze, der helle Bogen die Stunden mit Sonne über {v.ortName}.
          </p>
        </div>

        <div className="lg:[grid-area:uhr]" onPointerLeave={a.vorschauEnde}>
          <div className="relative mx-auto aspect-square w-full max-w-[340px] md:max-w-[400px] lg:max-w-[380px] xl:max-w-[500px]">
            <UhrBild v={v} k={k} intro={intro} zeiger={a.uhrZeiger} svgRef={refs.uhrSvg} />
            <UhrBeschriftung v={v} Zahl={k.Zahl} />
          </div>
          <ul aria-hidden="true" className="mx-auto mt-3 flex max-w-[500px] flex-wrap justify-center gap-1 text-[11.5px] text-white/70 md:mt-4 md:gap-1.5 md:text-[12px]">
            <li className="flex items-center gap-2 rounded-full bg-white/[0.06] px-2.5 py-1 md:px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-sun-500 ring-[1.5px] ring-white" />
              Monatsspitze
            </li>
            <li className="flex items-center gap-2 rounded-full bg-white/[0.06] px-2.5 py-1 md:px-3">
              <span className="h-2 w-4 rounded-sm" style={{ background: FARBE.sun300, opacity: 0.5 }} />
              <span>
                Sonne<span className="max-md:hidden"> über dem Horizont</span> am 15.
              </span>
            </li>
            <li className="flex items-center gap-2 rounded-full bg-white/[0.06] px-2.5 py-1 md:px-3">
              <span className="h-px w-4 border-t border-dashed border-white/60" />
              <span>
                06:00<span className="max-md:hidden"> Schichtbeginn</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="min-w-0 lg:[grid-area:liste]">
          <output aria-live="off" className="block min-h-[3.1em] font-display text-[15.5px] font-bold leading-snug text-white md:min-h-[2.6em] md:text-[18px]">
            {aktiv?.satz}
          </output>
          <div aria-hidden="true" className="mt-4 hidden grid-cols-[3.2rem_4.2rem_minmax(0,1fr)_7.6rem_4rem] gap-2 px-3 pb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/60 lg:grid">
            <span>Monat</span>
            <span className="text-right">Spitze</span>
            <span>Wann</span>
            <span>Sonne</span>
            <span className="text-right">PV</span>
          </div>
          <ul aria-label="Monatsspitzen – Monat wählen" className="mt-3 grid grid-cols-6 gap-1 md:gap-1.5 lg:mt-0 lg:grid-cols-1 lg:gap-0.5" onPointerLeave={a.vorschauEnde}>
            {v.monate.map((m) => {
              const gewaehlt = m.i === v.gewaehlt;
              const gezeigt = m.i === v.aktiv;
              return (
                <li key={m.i}>
                  <button
                    type="button"
                    disabled={m.leer || undefined}
                    tabIndex={statisch ? -1 : gewaehlt ? 0 : -1}
                    aria-pressed={gewaehlt}
                    aria-label={m.leer ? `${m.lang}: keine Daten` : m.satz}
                    data-monat={m.i}
                    onFocus={a.monat ? () => a.monat(m.i, "fokus") : undefined}
                    onClick={a.monat ? () => a.monat(m.i, "klick") : undefined}
                    onPointerMove={a.monatZeiger ? (e) => a.monatZeiger(e, m.i) : undefined}
                    onKeyDown={a.listeTaste ? (e) => a.listeTaste(e, m.i) : undefined}
                    className={[
                      "relative flex min-h-11 w-full flex-col items-center justify-center rounded-lg px-0.5 text-center text-[12.5px] leading-tight transition-colors duration-200 motion-reduce:transition-none md:min-h-12 md:text-[14px] lg:grid lg:min-h-[33px] lg:grid-cols-[3.2rem_4.2rem_minmax(0,1fr)_7.6rem_4rem] lg:items-center lg:gap-2 lg:px-3 lg:text-left",
                      gezeigt ? "bg-white/[0.12] text-white" : "bg-white/[0.04] text-white/80 hover:bg-white/[0.08] lg:bg-transparent",
                      m.leer ? "opacity-40" : "",
                    ].join(" ")}
                  >
                    {gewaehlt && <span aria-hidden="true" className="absolute bottom-0.5 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-sun-500 lg:bottom-auto lg:left-0 lg:top-1/2 lg:h-4 lg:w-[3px] lg:-translate-y-1/2 lg:translate-x-0" />}
                    <span className="font-semibold">{m.kurz}</span>
                    <span className="ov-num hidden text-right font-display font-bold lg:block">{m.leer ? "–" : `${zahl(m.kw)}${NB}kW`}</span>
                    <span className="ov-num hidden truncate text-white/70 lg:block">
                      {m.leer ? "keine Daten" : `${m.tag} · ${m.uhr}`}
                    </span>
                    <span className={["ov-num text-[11px] md:text-[12.5px] lg:hidden", m.hoehe > 0 ? "text-sun-300" : "text-white/60"].join(" ")}>{m.leer ? "–" : m.uhr}</span>
                    <span className="hidden min-w-0 items-center gap-2 text-white/70 lg:flex">
                      {!m.leer && <span aria-hidden="true" className={["h-2 w-2 shrink-0 rounded-full", m.hoehe > 0 ? "bg-sun-300" : "bg-white/20"].join(" ")} />}
                      <span className="ov-num truncate">{m.leer ? "" : m.sonneKurz}</span>
                    </span>
                    <span className={["ov-num hidden text-right font-semibold lg:block", m.pv > 0.5 ? "text-ov-300" : "text-white/70"].join(" ")}>{m.leer ? "" : m.pv == null ? "–" : `${zahl(m.pv)}${NB}kW`}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 max-lg:empty:hidden lg:min-h-[5.6rem]">{slots.erkenntnisUhr}</div>
          <Kennzeichnung dunkel className="mt-3">
            {eigen ? (
              "Ihr Lastgang – bleibt im Arbeitsspeicher dieses Browsers"
            ) : (
              <>
                <span className="md:hidden">{KENNZEICHNUNG.synthetischKurz}</span>
                <span className="max-md:hidden">{KENNZEICHNUNG.synthetisch}</span>
              </>
            )}{" "}
            · Sonne: NOAA-Näherung, {v.ortName}
            <span className="max-md:hidden"> · {KENNZEICHNUNG.pvModell}</span>
          </Kennzeichnung>
        </div>
      </div>

      {/* ───────────────────────── B · Deckel, Türme, Batterie ───────────────────────── */}
      <div role="group" aria-labelledby="k5-deckel-titel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-[62ch]">
            <Eyebrow className="max-md:hidden">Deckel und Speicher</Eyebrow>
            <h3 id="k5-deckel-titel" className="font-display text-[21px] font-extrabold leading-snug tracking-[-0.02em] text-white md:mt-2 md:text-[25px]">
              Ziehen Sie den Deckel über die zwölf Monatsspitzen
            </h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-white/68 max-md:hidden">
              Was über dem Deckel liegt, muss ein Speicher liefern. Bis Ende 2026 zählt das Mittel der zwölf Monatsspitzen – jedes gekappte Kilowatt in jedem Monat senkt die Rechnung.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={v.sonne}
              data-testid={statisch ? undefined : "sonne-an"}
              tabIndex={statisch ? -1 : undefined}
              onClick={a.sonne}
              className={[
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors duration-200 motion-reduce:transition-none sm:gap-2.5 md:px-4 md:text-[14px]",
                v.sonne ? "bg-ov-400 text-navy-950 hover:bg-ov-300" : "bg-white/[0.07] text-white hover:bg-white/[0.12]",
              ].join(" ")}
            >
              <span aria-hidden="true" className={["relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 max-sm:hidden", v.sonne ? "bg-navy-950/25" : "bg-white/15"].join(" ")}>
                <span className={["absolute top-0.5 h-4 w-4 rounded-full transition-[left] duration-300 motion-reduce:transition-none", v.sonne ? "left-[18px] bg-navy-950" : "left-0.5 bg-white/80"].join(" ")} />
              </span>
              <span aria-hidden="true" className={["h-3 w-3 shrink-0 rounded-full sm:hidden", v.sonne ? "bg-navy-950" : "bg-sun-300"].join(" ")} />
              <span>
                Sonne<span className="max-sm:sr-only"> einschalten</span>
              </span>
              <span className={["ov-num text-[12.5px] font-medium max-sm:hidden", v.sonne ? "text-navy-950/70" : "text-white/55"].join(" ")}>{zahl(v.kwp)} kWp</span>
            </button>
            <div data-testid={statisch ? undefined : "linse-2027"} className="min-w-0">
              <S name="k5-abrechnung" wert={v.modus} setWert={a.modus} optionen={MODUS_OPTIONEN} dunkel klein label="Abrechnung" className="[&>div]:flex-nowrap [&>legend]:sr-only" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-7 md:mt-8 md:gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12 lg:gap-y-10 lg:[grid-template-areas:'instr_kenn'_'grenz_kenn']">
          <div className="min-w-0 lg:[grid-area:instr]">
            <div ref={refs.wrap} className="relative flex h-[264px] gap-1.5 md:h-[360px] md:gap-4">
              <div ref={refs.tuermeBox} className="relative min-w-0 flex-1">
                {mass ? (
                  mass.breite > 0 && <TuermeFeld v={v} k={k} breite={mass.breite} hoehe={mass.mobil ? TUERME_HOEHE.mobil : TUERME_HOEHE.breit} mobil={mass.mobil} griff={a.griff} plot={a.plotZeiger} svgRef={refs.tuermeSvg} hinweis={hinweis} />
                ) : (
                  <div className="relative h-full">
                    <TuermeFeld v={v} k={k} breite={TUERME_BREITE_SSR.breit} hoehe={TUERME_HOEHE.breit} mobil={false} skalieren />
                  </div>
                )}
              </div>
              <div className="w-[50px] shrink-0 md:w-[96px]">
                {mass ? (
                  <BatterieBild v={v} k={k} breite={mass.mobil ? BATTERIE_BREITE.mobil : BATTERIE_BREITE.breit} hoehe={mass.mobil ? TUERME_HOEHE.mobil : TUERME_HOEHE.breit} mobil={mass.mobil} />
                ) : (
                  <BatterieBild v={v} k={k} breite={BATTERIE_BREITE.breit} hoehe={TUERME_HOEHE.breit} mobil={false} skalieren />
                )}
              </div>
              {slots.kappen}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label htmlFor={statisch ? undefined : "k5-deckel-range"} className="shrink-0 text-[13px] font-semibold text-white/70">
                Deckel
              </label>
              <input
                id={statisch ? undefined : "k5-deckel-range"}
                data-testid={statisch ? undefined : "deckel-range"}
                type="range"
                min={v.bereichDeckel.min}
                max={v.bereichDeckel.max}
                step={v.bereichDeckel.schritt}
                value={v.deckel}
                readOnly={statisch || undefined}
                tabIndex={statisch ? -1 : undefined}
                onChange={a.range}
                onPointerUp={a.loslassen}
                onKeyUp={a.loslassen}
                aria-valuetext={`${zahl(v.deckel)} kW`}
                className="ov-range min-w-0 flex-1 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${FARBE.navy300} 0%, ${FARBE.navy300} ${fuellProzent}%, ${FARBE.sun500} ${fuellProzent}%, ${FARBE.sun500} 100%)`,
                }}
              />
              <span className="ov-num w-[4.6rem] shrink-0 text-right font-display text-[15px] font-extrabold text-white">
                {zahl(v.deckel)}
                {NB}kW
              </span>
            </div>
            <div className="mt-2 flex justify-between text-[11.5px] text-white/60 max-md:hidden">
              <span className="ov-num">{zahl(v.bereichDeckel.min)} kW · tiefer Deckel</span>
              <span className="ov-num">Jahresspitze {zahl(v.bereichDeckel.max)} kW</span>
            </div>
          </div>

          {/* Kennwerte */}
          <div className="min-w-0 lg:[grid-area:kenn]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">{ab2027 ? "Abrechnung ab 2027 (Entwurf)" : "Weniger Leistungspreis"}</p>
            <output aria-live="off" data-testid={statisch ? undefined : "lp-euro"} className="mt-2 block font-display font-extrabold leading-none tracking-[-0.035em] text-white">
              {ab2027 ? (
                <span className="block text-[20px] leading-tight tracking-[-0.02em] md:text-[22px]">Monatsmaximum × Monatsleistungspreis – Beträge stehen aus</span>
              ) : v.euro != null ? (
                <span className="whitespace-nowrap text-[38px] md:text-[46px]">
                  <span className="text-[0.62em] text-white/70">≈{NB}</span>
                  <k.Zahl wert={euroWert(v.euro)} format={euroFormat} />
                  <span className="text-[0.42em] font-bold text-white/60"> € pro Jahr</span>
                </span>
              ) : (
                <span className="text-[22px] text-white/70">{z && !z.moeglich ? "–" : "wird berechnet"}</span>
              )}
            </output>
            <p className="mt-2 text-[13px] leading-snug text-white/60">
              {ab2027 ? (
                <>{KENNZEICHNUNG.entwurf2027}.</>
              ) : (
                <>
                  <span className="md:hidden">
                    Mittel der 12 Spitzen {mittelSatz} × <span className="ov-num whitespace-nowrap">{`${zahl(v.lp, 2)}${NB}€/kW`}</span> · NE{NB}{v.ne}, {v.bereich} (bis Ende 2026)
                  </span>
                  <span className="max-md:hidden">
                    bis Ende 2026: Mittel der 12 Monatsspitzen × <span className="ov-num">{zahl(v.lp, 2)}</span>
                    {NB}€/kW · Netzebene {v.ne}, {v.bereich}
                  </span>
                </>
              )}
            </p>

            {z && !z.moeglich ? (
              <p className="mt-5 rounded-2xl bg-white/[0.06] px-4 py-3 text-[14.5px] font-semibold leading-snug text-white">Zu nah an der Dauerlast – hier hilft kein Speicher allein.</p>
            ) : (
              <dl className="mt-3 grid grid-cols-4 gap-x-3 gap-y-4 md:mt-5 md:grid-cols-2 md:gap-x-5">
                <Wert label={<><span className="md:hidden">Leistung</span><span className="max-md:hidden">Speicher-Leistung</span></>} wert={z ? <k.Zahl wert={z.leistungKw} /> : "–"} einheit="kW" testid={statisch ? undefined : "speicher-kw"} />
                <Wert label={<><span className="md:hidden">Kapazität</span><span className="max-md:hidden">Nennkapazität</span></>} wert={z ? <k.Zahl wert={z.nennKwh} /> : "–"} einheit="kWh" testid={statisch ? undefined : "speicher-kwh"} />
                <Wert label={<><span className="md:hidden">Tage</span><span className="max-md:hidden">Tage mit Eingriff</span></>} wert={z ? <k.Zahl wert={z.tage} /> : "–"} />
                <Wert label={<><span className="md:hidden">Stunden</span><span className="max-md:hidden">Stunden über Deckel</span></>} wert={z && Number.isFinite(z.stundenUeber) ? <k.Zahl wert={z.stundenUeber} /> : "–"} einheit="h" />
              </dl>
            )}
            <p className={["mt-4 text-[13px] leading-snug text-white/65", ab2027 ? "" : "max-md:hidden"].join(" ")}>
              {ab2027 ? (
                <>
                  Jede Monatsrechnung sinkt um ihr eigenes Stück – zusammen <span className="ov-num whitespace-nowrap font-semibold text-white">{`${zahl(v.summe2027)}${NB}kW`}</span> in 12 Monaten.
                </>
              ) : (
                <>Mittel der Monatsspitzen {mittelSatz}</>
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ab2027 ? (
                <>
                  <QuellePille dunkel>
                    <span>
                      <a href={QUELLE.sneEntwurf.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white" tabIndex={statisch ? -1 : undefined}>
                        SNE-G-V-Entwurf
                      </a>{" "}
                      · {QUELLE.sneEntwurf.stand}
                    </span>
                  </QuellePille>
                  <QuellePille dunkel>
                    <a href={QUELLE.elwg.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white" tabIndex={statisch ? -1 : undefined}>
                      ElWG
                    </a>
                  </QuellePille>
                </>
              ) : (
                <QuellePille dunkel>
                  <span>
                    <a href={NETZ_QUELLE.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white" tabIndex={statisch ? -1 : undefined}>
                      SNE-V 2018<span className="max-md:hidden"> – Novelle</span>
                      <span className="md:hidden">/</span>
                      <span className="max-md:hidden"> </span>2026
                    </a>{" "}
                    · {STAND.werte} · {KENNZEICHNUNG.richtwert}
                  </span>
                </QuellePille>
              )}
            </div>
            <div className="mt-5 max-lg:empty:hidden lg:min-h-[6.5rem]">{slots.erkenntnisDeckel}</div>
          </div>

          {/* Grenznutzen – bis lg aufklappbar */}
          <div className="min-w-0 lg:[grid-area:grenz]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55 max-lg:hidden">
              Grenznutzen · €/Jahr über Nennkapazität <span className="font-medium normal-case tracking-normal text-white/60">(Wurzelskala)</span>
            </p>
            <button
              type="button"
              aria-expanded={!!offen.grenz}
              aria-controls="k5-grenz-kurve"
              onClick={a.umschalten ? () => a.umschalten("grenz") : undefined}
              tabIndex={statisch ? -1 : undefined}
              className="flex min-h-11 w-full items-center justify-between gap-4 rounded-2xl bg-white/[0.05] px-4 py-2 text-left lg:hidden"
            >
              <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">Grenznutzen · €/Jahr je kWh</span>
              <Plus offen={!!offen.grenz} />
            </button>
            <div id="k5-grenz-kurve" className={["mt-3", offen.grenz ? "" : "max-lg:hidden"].join(" ")}>
              {mass ? (
                mass.breiteLinks > 0 && <GrenzBild v={v} k={k} breite={mass.breiteLinks} hoehe={mass.mobil ? 116 : 140} />
              ) : (
                <GrenzBild v={v} k={k} breite={760} hoehe={140} idZusatz="-ssr" skalieren />
              )}
              <p className="mt-1 text-[11.5px] text-white/50 lg:hidden">Speichergröße auf Wurzelskala – der Bereich bis 100 kWh bekommt Platz.</p>
            </div>
            <p className="mt-2 min-h-[2.6em] max-w-[62ch] text-[13.5px] leading-snug text-white/70 md:min-h-0 md:text-[14.5px]">
              {v.grenz.satz ? v.grenz.satz.text : "Je tiefer der Deckel, desto mehr Kapazität kostet jedes weitere Kilowatt."}
            </p>
          </div>
        </div>
        <Kennzeichnung dunkel className="mt-5 max-md:hidden">
          Speicher je Deckel aus allen Viertelstunden simuliert (Reserve 1,25 · Restkapazität 0,8 · Wirkungsgrad 0,9) – {KENNZEICHNUNG.richtwert}, ohne Speicherpreise
        </Kennzeichnung>
      </div>

      {/* ───────────────────────── C · Staffelstart (schematisch) ───────────────────────── */}
      <div className="border-t border-white/[0.08] pt-5 md:pt-8 lg:pt-12">
        <button
          type="button"
          aria-expanded={!!offen.staffel}
          aria-controls="k5-staffel"
          onClick={a.umschalten ? () => a.umschalten("staffel") : undefined}
          tabIndex={statisch ? -1 : undefined}
          className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl bg-white/[0.05] px-4 py-2 text-left lg:hidden"
        >
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ohne Speicher · schematisch</span>
            <span className="block font-display text-[16px] font-extrabold text-white">Anläufe staffeln senkt die Spitze</span>
          </span>
          <Plus offen={!!offen.staffel} />
        </button>
        <div id="k5-staffel" className={offen.staffel ? "max-lg:mt-5" : "max-lg:hidden"}>
          <K5Staffelstart v={v} k={k} setModus={a.staffel} mobil={mass?.mobil} breite={mass?.mobil ? mass.breiteLinks : undefined} statisch={!mass} />
        </div>
      </div>

      {slots.ansage}
    </div>
  );
}
