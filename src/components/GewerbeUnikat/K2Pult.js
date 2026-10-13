// src/components/GewerbeUnikat/K2Pult.js
//
// K2 · Dach-Labor: Komposition des Instruments – REINE Komponente ohne Hooks.
//  - Server: SSR-Platzhalter mit Startwerten (statisch: native Felder mit defaultValue, Iso-SVG als Szene).
//    Die Felder sind dort `inert`: Bis die Bühne geladen ist, nimmt nichts Eingaben an, die danach verloren gingen.
//  - Client (K2DachLabor): dieselbe Komposition mit Live-Werten, Handlern, 3D-Szene und gleitenden Zahlen
// So sind Platzhalter und Bühne gleich groß (kein CLS) und die Zahlen stehen als SSR-HTML im Dokument.
//
// Ein Prinzip auf allen Geräten: Die BÜHNE – Szene plus Ablese-Leiste (Nutzfläche · max. Leistung ·
// Jahresertrag und Rechenweg) – klebt beim Bedienen unter dem Seitenkopf (sticky), die Bedienung scrollt:
// Dachart · (Erkenntnis) · Sonne · Maß · Abzüge · (Rechenweg ab lg) · Ort. So sieht man bei jedem Regler,
// was er bewirkt: Schatten wandern, Module ordnen sich um, aus 460 werden 655 kWp.
// Mobil/Tablet steht die Bühne oben (≈ 40 % der Höhe), ab lg links (7 bzw. ab xl 8 von 12 Spalten) neben der
// rechten Bedienspalte. Die Reihenfolge im Dokument ist überall die sichtbare (Fokusreihenfolge).
// Pillen und Kacheln sind gefüllt wie Segment (_gestaltung.js) – nie umrahmt. Eigene Variante, weil
// Segment ein Client-Baustein ist (Server-Platzhalter) und data-testid an den Optionen braucht.

import { Kennzeichnung, QuellePille } from "./_bausteine";
import { KENNZEICHNUNG, STAND, zahl } from "./_tokens";
import { ABZUG, ANSICHT, DACH_INFO, HALLEN_PRESETS, MASS, MODUL, SONNEN_TAGE, ZEIT, himmelsrichtung, nordRichtung, uhrzeit } from "./K2Modell";
import { sonnenTag } from "./K2Sonne";
import K2Tageskurve from "./K2Tageskurve";

/** Ertragsbasis je Dachart als Kurven der Tageskurve (Trapezblech: Mittel aus Süd 10° und Ost-West 15°). */
const AUSRICHTUNG_KURVE = { "ost-west": ["ostwest"], sued: ["flach"], trapez: ["flach", "ostwest"], shed: ["sued"] };

const REGLER =
  "block h-11 w-full cursor-pointer appearance-none bg-transparent max-md:h-12 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-600 rounded-full " +
  "[&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:rounded-full " +
  "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-navy-950)_var(--k2-fuell),var(--color-ink-200)_var(--k2-fuell))] " +
  "[&::-webkit-slider-thumb]:mt-[-11.5px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white " +
  "[&::-webkit-slider-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_2px_10px_rgba(21,26,36,0.22)] " +
  "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 active:[&::-webkit-slider-thumb]:scale-110 " +
  "[&::-moz-range-track]:h-[5px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-200 " +
  "[&::-moz-range-progress]:h-[5px] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-navy-950 " +
  "[&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white " +
  "[&::-moz-range-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_2px_10px_rgba(21,26,36,0.22)]";

const ABZUG_STAND = ABZUG.stand.split("-").reverse().join("/");

/** Sichtbare Höhe des Seitenkopfs nach dem Scrollen (Navbar: 84 px − 16 px eingeklappt) – darunter klebt die Bühne. */
const KOPF_PX = 68;

const fuell = (wert, min, max) => ({ "--k2-fuell": `${((wert - min) / (max - min)) * 100}%` });

/** Natives Range-Feld mit Beschriftung und <output>. */
function Regler({ id, label, zusatz, wert, min, max, schritt, anzeige, valuetext, testid, onWert }) {
  const feld = onWert ? { value: wert, onChange: (e) => onWert(Number(e.target.value)) } : { defaultValue: wert };
  return (
    <div className="flex min-w-0 flex-col justify-between">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="min-w-0 text-[13.5px] font-semibold leading-snug text-ink-700 max-[359px]:text-[12.5px]">
          {label}
          {zusatz && <span className="hidden text-[12px] font-normal text-ink-500 md:block">{zusatz}</span>}
        </label>
        <output htmlFor={id} className="ov-num shrink-0 whitespace-nowrap font-display text-[15px] font-bold text-ink-900">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={schritt}
        aria-valuetext={valuetext}
        data-testid={testid}
        className={REGLER}
        style={fuell(wert, min, max)}
        {...feld}
      />
    </div>
  );
}

/** Gefüllte Pillen als Radiogruppe (wie Segment). */
function Pillen({ name, legende, wert, optionen, onWahl, klein = false, className }) {
  return (
    <fieldset className={["min-w-0", className].filter(Boolean).join(" ")}>
      <legend className="sr-only">{legende}</legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-ink-100 p-1">
        {optionen.map((o) => {
          const aktiv = o.id === wert;
          const feld = onWahl ? { checked: aktiv, onChange: () => onWahl(o.id) } : { defaultChecked: aktiv };
          return (
            <label
              key={o.id}
              data-testid={o.testid}
              className={[
                "relative flex cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-colors duration-200",
                klein ? "min-h-11 px-3 text-[13px] lg:px-2.5 xl:px-3" : "min-h-11 px-4 text-[14px]",
                aktiv ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-white",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-600",
              ].join(" ")}
            >
              <input type="radio" name={name} value={o.id} className="sr-only" {...feld} />
              {o.label}
              {o.sub && <span className={["ov-num text-[11.5px] font-medium", aktiv ? "text-white/65" : "text-ink-500"].join(" ")}>{o.sub}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Kleines Profil-Piktogramm je Dachart (currentColor). */
function Profil({ id }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 48 20" className="h-5 w-12 shrink-0" aria-hidden="true">
      <path d="M2 18H46" {...p} strokeOpacity="0.45" />
      {id === "ost-west" && <path d="M5 16L11 11L17 16M17 16L23 11L29 16M29 16L35 11L41 16" {...p} />}
      {id === "sued" && <path d="M6 16L13 11M19 16L26 11M32 16L39 11" {...p} />}
      {id === "trapez" && (
        <>
          <path d="M3 15L24 9L45 15" {...p} />
          <path d="M8 12.6L22 8.6M26 8.6L40 12.6" {...p} strokeWidth="2.6" />
        </>
      )}
      {id === "shed" && (
        <>
          <path d="M4 16V7L16 16V7L28 16V7L40 16" {...p} />
          <path d="M6 9.6L13 14.8M18 9.6L25 14.8M30 9.6L37 14.8" {...p} strokeWidth="2.6" />
        </>
      )}
    </svg>
  );
}

/**
 * Windrose in der Bodenebene der Ansicht (dieselbe Projektion wie Modell und Iso-SVG): Ellipse, Nordpfeil
 * und „N“ zeigen, wo auf dem Bildschirm Norden liegt – auch wenn das N der Platte hinter der Halle steht.
 * dreh = aktuelle Drehung der Ansicht in Grad (3D: folgt beim Ziehen).
 */
export function KompassBild({ dreh = 0 }) {
  const se = Math.sin((ANSICHT.hoehe * Math.PI) / 180);
  const r = 14;
  const c = 24;
  const { u, v } = nordRichtung(dreh);
  const n = Math.hypot(u, v) || 1;
  const spitze = [c + r * u, c + r * v];
  const quer = [(-v / n) * 3.2, (u / n) * 3.2];
  const ost = nordRichtung(dreh - 90);
  const pkt = (k) => `${Math.round(k[0] * 10) / 10} ${Math.round(k[1] * 10) / 10}`;
  const marke = (d, f) => [c + d.u * r * f, c + d.v * r * f];
  const sued = { u: -u, v: -v };
  const west = { u: -ost.u, v: -ost.v };
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <ellipse cx={c} cy={c} rx={r} ry={r * se} fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
      {[ost, sued, west].map((d, i) => (
        <circle key={i} cx={marke(d, 1)[0]} cy={marke(d, 1)[1]} r="1.1" fill="currentColor" fillOpacity="0.45" />
      ))}
      <path d={`M${pkt(spitze)}L${pkt([c + quer[0], c + quer[1]])}L${pkt([c - quer[0], c - quer[1]])}Z`} fill="currentColor" />
      <path d={`M${pkt([c + quer[0], c + quer[1]])}L${pkt([c - quer[0], c - quer[1]])}L${pkt(marke(sued, 1))}Z`} fill="currentColor" fillOpacity="0.25" />
      <text
        x={c + (u / n) * 20.5}
        y={c + (v / n) * 20.5}
        fontSize="9.5"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
      >
        N
      </text>
    </svg>
  );
}

/**
 * Knopf „Sonnenlauf abspielen“ (Aufgang → Untergang) links neben der Zeit-Pille. Rein: Server rendert ihn
 * gesperrt (gleiche Fläche, kein Springen), der Client mit Handler. Bei reduzierter Bewegung ausgeblendet.
 */
export function SpielKnopf({ spielt = false, onClick, kurz = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-pressed={onClick ? spielt : undefined}
      aria-label={spielt ? "Sonnenlauf anhalten" : `Sonnenlauf ${kurz} vom Aufgang bis zum Untergang abspielen`}
      title={spielt ? "Anhalten" : "Sonnenlauf abspielen"}
      data-testid="sonne-spielen"
      className="pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-950 text-white shadow-[0_2px_10px_rgba(21,26,36,0.22)] transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-600 disabled:cursor-default disabled:hover:scale-100 motion-reduce:hidden max-md:h-11 max-md:w-11"
    >
      {spielt ? (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
          <rect x="3.5" y="3" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="9.5" y="3" width="3" height="10" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5" aria-hidden="true">
          <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

/** Ertrags-Leiste: alle Orte als Striche nach spezifischem Ertrag der gewählten Dachart. */
function ErtragsLeiste({ orte, dachart, ortId, onOrt }) {
  const alle = orte.flatMap((g) => g.orte).map((o) => ({ slug: o.slug, name: o.name, wert: o.ertrag[dachart] }));
  alle.sort((a, b) => a.wert - b.wert || a.name.localeCompare(b.name, "de"));
  const min = alle[0]?.wert ?? 0;
  const max = alle[alle.length - 1]?.wert ?? 1;
  const pos = (w) => (max > min ? ((w - min) / (max - min)) * 100 : 50);
  const gewaehlt = alle.find((o) => o.slug === ortId) || alle[0];
  const rang = alle.length - alle.findIndex((o) => o.slug === gewaehlt.slug);
  const p = pos(gewaehlt.wert);
  const waehle = onOrt
    ? (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const ziel = min + ((e.clientX - r.left) / r.width) * (max - min);
        let best = alle[0];
        for (const o of alle) if (Math.abs(o.wert - ziel) < Math.abs(best.wert - ziel)) best = o;
        onOrt(best.slug);
      }
    : undefined;
  return (
    <div className="mt-3 md:mt-4">
      <p className="text-[13px] leading-snug text-ink-700">
        <span className="font-semibold text-ink-900">{gewaehlt.name}</span> · <span className="ov-num font-semibold text-ink-900">{zahl(gewaehlt.wert)} kWh/kWp</span> ·{" "}
        {DACH_INFO[dachart].leiste}
      </p>
      <div className="relative mt-2 h-8 cursor-pointer touch-pan-y md:mt-3 md:h-9" onClick={waehle} aria-hidden="true">
        <span className="absolute inset-x-0 bottom-2 h-px bg-ink-900/[0.12]" />
        {alle.map((o) => (
          <span key={o.slug} className="absolute bottom-2 h-3 w-px -translate-x-1/2 bg-ink-400" style={{ left: `${pos(o.wert)}%` }} />
        ))}
        <span
          className="absolute bottom-2 h-7 w-[3px] -translate-x-1/2 rounded-full bg-navy-950 transition-[left] duration-300 motion-reduce:transition-none"
          style={{ left: `${p}%` }}
        />
      </div>
      <div className="ov-num mt-1 flex justify-between gap-2 whitespace-nowrap text-[11.5px] text-ink-500">
        <span>{zahl(min)} kWh/kWp</span>
        <span>
          Rang {rang} von {alle.length}
        </span>
        <span>{zahl(max)} kWh/kWp</span>
      </div>
    </div>
  );
}

/** Zahl: im Client gleitend (Z = Zahl aus _gestaltung), im SSR statisch. */
function zahlKnoten(Z, wert, stellen = 0, vor = "") {
  if (Z) return <Z wert={wert} stellen={stellen} vor={vor} />;
  return (
    <span className="ov-num">
      {vor}
      {zahl(wert, stellen)}
    </span>
  );
}

/** Zeile des Rechenstreifens (ab lg): Bezeichnung links, Wert rechts – Werte brechen nie um. */
function Zeile({ links, rechts, className = "", wert = "ov-num shrink-0 whitespace-nowrap text-ink-700" }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-1.5 text-[13.5px] text-ink-600 ${className}`}>
      <span className="min-w-0">{links}</span>
      <span className={wert}>{rechts}</span>
    </div>
  );
}

/** Rechte Spalte ab lg (unter lg: volle Breite in der Reihenfolge des Dokuments). */
const RECHTS = "lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9";
/** Karten der Bedienung (ab md gefüllt, nie umrahmt; mobil nur eine Haarlinie darüber). */
const KARTE = "border-t border-ink-900/[0.08] pt-4 md:rounded-[22px] md:border-0 md:bg-white md:p-5";

/** Eine Zahl der Ablese-Leiste. */
function Ablesung({ label, gross = false, testid, children }) {
  return (
    <div className="min-w-0">
      <span className="block text-[11.5px] leading-tight text-ink-600 lg:text-[12.5px]">{label}</span>
      <output
        data-testid={testid}
        className={[
          "mt-1 block whitespace-nowrap font-display font-extrabold leading-none text-ink-900",
          gross ? "text-[22px] tracking-[-0.03em] md:text-[24px] lg:text-[30px] xl:text-[34px]" : "text-[18px] tracking-[-0.02em] md:text-[20px] lg:text-[24px] xl:text-[26px]",
        ].join(" ")}
      >
        {children}
      </output>
    </div>
  );
}

/**
 * @param {{
 *   z: { dachart:string, laengeM:number, breiteM:number, randPct:number, hindernisPct:number, ortId:string, tag:string, zeitMin:number },
 *   w: ReturnType<import("./K2Modell.js").kennwerte>,
 *   proDachart: Record<string, { kwp:number, mwh:number }>,
 *   dacharten: { id:string, label:string, sub:string, qmProKwp:number }[],
 *   orte: { land:string, name:string, orte:{ slug:string, name:string, ertrag:Record<string,number> }[] }[],
 *   ort: { slug:string, name:string },
 *   sonne: { zenit:number, azimut:number, hoehe:number, ueber:boolean },
 *   kurve: object,
 *   szene: import("react").ReactNode,
 *   szeneHinweis?: import("react").ReactNode,
 *   szeneTasten?: object,
 *   kompass?: import("react").ReactNode,
 *   erkenntnis?: import("react").ReactNode,
 *   caption: string,
 *   a?: object | null,
 *   Z?: import("react").ComponentType<any>,
 *   pvgis: { name:string, url:string },
 *   erkenntnisAn?: boolean,
 *   spielKnopf?: import("react").ReactNode,
 *   spielt?: boolean,
 * }} props  erkenntnisAn: mobil hält der Erkenntnis-Platz vor der Interaktion keine Fläche frei (kein leerer Rasterabstand).
 *   spielKnopf: „Sonnenlauf abspielen“ (Client); ohne: gesperrter Platzhalter gleicher Größe.
 */
export default function K2Pult({ z, w, proDachart, dacharten, orte, ort, sonne, kurve, szene, szeneHinweis, szeneTasten, kompass, erkenntnis, caption, a = null, Z, pvgis, erkenntnisAn = false, spielKnopf, spielt = false }) {
  const dachart = dacharten.find((d) => d.id === z.dachart) || dacharten[0];
  const info = DACH_INFO[dachart.id];
  const tag = sonnenTag(z.tag);
  const richtung = himmelsrichtung(sonne.azimut);
  const preset = HALLEN_PRESETS.find((h) => h.laengeM === z.laengeM && h.breiteM === z.breiteM)?.id ?? null;
  const sonnenZeile = sonne.ueber ? `Sonne ${zahl(sonne.hoehe)}° hoch, aus ${richtung.lang}` : "Sonne unter dem Horizont";
  const zeitText = `${uhrzeit(z.zeitMin)} Uhr`;
  // Bis die Bühne geladen ist, nehmen die Felder des Platzhalters keine Eingaben an (sonst gingen sie verloren)
  const steuer = a ? {} : { inert: true };

  return (
    <figure className="mt-7 md:mt-14">
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 md:gap-y-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-5">
        {/* 1 · BÜHNE: Szene + Ablese-Leiste. Klebt beim Bedienen unter dem Seitenkopf – mobil/Tablet oben über der
            Bedienung, ab lg links neben der rechten Bedienspalte. */}
        <div
          data-k2-buehne=""
          className="sticky top-[68px] z-20 -mx-5 bg-sand-50 px-5 pb-1 pt-2 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-4 after:bg-gradient-to-b after:from-sand-50 after:to-transparent md:col-span-2 md:-mx-8 md:px-8 lg:top-[88px] lg:z-10 lg:col-span-7 lg:col-start-1 lg:row-span-7 lg:row-start-1 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:after:hidden xl:col-span-8"
        >
          <div className="relative aspect-[16/9.4] overflow-hidden rounded-[20px] bg-[radial-gradient(120%_95%_at_50%_0%,#fffdf8_0%,#f5f3ea_58%,#ece6d6_100%)] md:aspect-[16/9] md:rounded-[24px] lg:aspect-[16/10.4] lg:rounded-[26px]">
            {/* Bild bzw. 3D-Modell (Tastatur: Drehen); die Bedien- und Lese-Elemente liegen als Geschwister darüber */}
            <div
              className="absolute inset-0 rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ov-600"
              role={szeneTasten?.tabIndex != null ? "group" : "img"}
              aria-roledescription={szeneTasten?.tabIndex != null ? "3D-Modell" : undefined}
              aria-label={caption}
              {...(szeneTasten || {})}
            >
              {szene}
            </div>
            <div className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-4.5rem)] items-center gap-1.5 md:left-3 md:top-3">
              {spielKnopf ?? <SpielKnopf kurz={tag.label} />}
              <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-white/75 px-3 py-1.5 text-[12px] font-medium leading-none text-ink-700 shadow-[0_1px_8px_rgba(21,26,36,0.06)] backdrop-blur-sm">
                <span className="ov-num font-semibold text-ink-900">
                  {tag.label} · {uhrzeit(z.zeitMin)}
                </span>
                <span aria-hidden="true" className="h-3 w-px bg-ink-900/15" />
                <span className="ov-num">{sonne.ueber ? `${zahl(sonne.hoehe)}° · ${richtung.kurz}` : "Nacht"}</span>
              </p>
            </div>
            <span
              aria-hidden="true"
              title="Norden"
              className="pointer-events-none absolute right-2 top-2 h-12 w-12 rounded-full bg-white/75 text-navy-950 shadow-[0_1px_8px_rgba(21,26,36,0.06)] backdrop-blur-sm md:right-3 md:top-3"
            >
              {kompass ?? <KompassBild />}
            </span>
            <p className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/75 px-3 py-1.5 text-[11.5px] font-medium leading-none text-ink-600 backdrop-blur-sm md:bottom-4 md:left-4">
              <span className="md:hidden">Schematisch</span>
              <span className="hidden md:inline">Modell und Modulraster schematisch</span>
            </p>
            {szeneHinweis}
            {!sonne.ueber && (
              <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-950 px-4 py-2 text-[13px] font-semibold text-white shadow-lg">
                Sonne unter dem Horizont
              </p>
            )}
          </div>

          {/* Ablese-Leiste: die Zahlen, die jeder Regler bewegt – immer im Blick */}
          <div className="grid grid-cols-[1fr_1.15fr_1fr] gap-x-3 px-1 pt-2.5 lg:gap-x-6 lg:px-2 lg:pt-4">
            <Ablesung label="Nutzfläche">
              {zahlKnoten(Z, w.netto)}
              <span className="ml-0.5 text-[0.62em] font-bold text-ink-500">m²</span>
            </Ablesung>
            <Ablesung label="max. Leistung" gross testid="dach-kwp">
              {zahlKnoten(Z, w.kwp, 0, "≈ ")}
              <span className="ml-1 text-[0.55em] font-bold text-ink-500">kWp</span>
            </Ablesung>
            <Ablesung label="Jahresertrag">
              {zahlKnoten(Z, w.mwh, 0, "≈ ")}
              <span className="ml-0.5 text-[0.62em] font-bold text-ink-500">MWh</span>
            </Ablesung>
          </div>
          <p className="ov-num px-1 pt-1.5 text-[11.5px] leading-snug text-ink-500 lg:px-2 lg:pt-2 lg:text-[12.5px]">
            {zahl(w.netto)} m² Nutzfläche ÷ {zahl(dachart.qmProKwp)} m²/kWp × {zahl(w.spez)} kWh/kWp ({ort.name})
            <span className="hidden lg:inline">
              {" "}
              · ≈ {zahl(w.module)} Module à {MODUL.wp} Wp (Annahme) · {KENNZEICHNUNG.richtwert}
            </span>
          </p>
        </div>

        {/* 2 · Dachart (mobil 2 × 2, Tablet 4 nebeneinander, ab lg 2 × 2) */}
        <div className={`md:col-span-2 ${RECHTS}`} {...steuer}>
          <fieldset>
            <legend className="mb-2 text-[12.5px] font-semibold text-ink-500">
              Dachart<span className="font-normal"> · Ost-West und Süd vergleichen</span>
            </legend>
            <div className="grid grid-cols-2 gap-1 rounded-[22px] bg-ink-100 p-1 md:grid-cols-4 lg:grid-cols-2">
              {dacharten.map((d) => {
                const aktiv = d.id === z.dachart;
                const feld = a ? { checked: aktiv, onChange: () => a.setDachart(d.id) } : { defaultChecked: aktiv };
                const werte = proDachart[d.id];
                return (
                  <label
                    key={d.id}
                    data-testid={`dachart-${d.id}`}
                    data-aktiv={aktiv ? "1" : "0"}
                    className={[
                      "relative flex min-h-[62px] min-w-0 cursor-pointer select-none flex-col justify-between gap-1.5 rounded-[18px] px-3 py-2.5 transition-colors duration-200 md:min-h-[72px]",
                      aktiv ? "bg-navy-950 text-white" : "text-ink-800 hover:bg-white",
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-600",
                    ].join(" ")}
                  >
                    <input type="radio" name="k2-dachart" value={d.id} className="sr-only" {...feld} />
                    <span className="flex items-center justify-between gap-2">
                      <span className="whitespace-nowrap font-display text-[14.5px] font-bold leading-tight max-[359px]:text-[13.5px]">{DACH_INFO[d.id].kurz}</span>
                      <span className={["max-[359px]:hidden", aktiv ? "text-white/80" : "text-ink-500"].join(" ")}>
                        <Profil id={d.id} />
                      </span>
                    </span>
                    <span className="flex items-baseline justify-between gap-2 whitespace-nowrap text-[11.5px] leading-tight">
                      <span className={aktiv ? "text-white/65" : "text-ink-500"}>{zahl(d.qmProKwp)} m²/kWp</span>
                      <span className={["ov-num font-semibold", aktiv ? "text-white" : "text-ink-700"].join(" ")}>{werte ? `${zahl(werte.kwp)} kWp` : ""}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-2.5 text-[13px] leading-snug text-ink-600">
              <span className="font-semibold text-ink-800">{info.montage}.</span> <span className="hidden md:inline">{info.lesart}</span>
            </p>
          </fieldset>
        </div>

        {/* 3 · Erkenntnis (direkt unter der Dachart – dort, wo der Blick beim Wechsel ist) */}
        <div className={[`md:col-span-2 ${RECHTS}`, erkenntnisAn ? "" : "max-md:-mt-4"].join(" ")}>{erkenntnis}</div>

        {/* 4 · Sonne: Tag, Tageskurve, Uhrzeit */}
        <div className={`md:col-span-2 lg:rounded-[22px] lg:bg-white lg:p-5 ${RECHTS}`} {...steuer}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-[12.5px] font-semibold text-ink-500 max-[359px]:sr-only">
              Sonnenstand<span className="hidden sm:inline lg:hidden"> und Lichtform am Tag</span>
            </p>
            <Pillen
              name="k2-tag"
              legende="Tag"
              wert={z.tag}
              klein
              onWahl={a ? (id) => a.setTag(id) : null}
              optionen={SONNEN_TAGE.map((t) => ({ id: t.id, label: t.label, testid: `sonne-tag-${t.id}` }))}
            />
          </div>
          <div className="mt-3">
            <K2Tageskurve kurve={kurve} aktiv={AUSRICHTUNG_KURVE[dachart.id]} zeitMin={z.zeitMin} ueber={sonne.ueber} />
            <label htmlFor="k2-zeit" className="sr-only">
              Uhrzeit am {tag.label}
            </label>
            <input
              id="k2-zeit"
              type="range"
              min={ZEIT.min}
              max={ZEIT.max}
              step={ZEIT.schritt}
              aria-valuetext={`${zeitText}, ${sonnenZeile}`}
              data-testid="sonne-zeit"
              className={REGLER + " -mt-1"}
              style={fuell(z.zeitMin, ZEIT.min, ZEIT.max)}
              {...(a ? { value: z.zeitMin, onChange: (e) => a.setZeit(Number(e.target.value)) } : { defaultValue: z.zeitMin })}
            />
          </div>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <output htmlFor="k2-zeit" aria-live={spielt ? "off" : undefined} className="text-[13.5px] text-ink-700">
              <span className="ov-num font-display text-[17px] font-bold text-ink-900">{uhrzeit(z.zeitMin)}</span> Uhr · {sonnenZeile}
            </output>
            {kurve.auf != null && kurve.unter != null && (
              <span className="ov-num hidden text-[12px] text-ink-500 sm:inline">
                über dem Horizont {uhrzeit(kurve.auf)}–{uhrzeit(kurve.unter)} (geometrisch)
              </span>
            )}
          </div>
          <Kennzeichnung className="mt-2">
            {KENNZEICHNUNG.klarhimmel}
            <span className="hidden md:inline"> · normiert auf das Maximum von Süd 35°.</span>
          </Kennzeichnung>
        </div>

        {/* 5 · Hallenmaß */}
        <div className={`${KARTE} ${RECHTS}`} {...steuer}>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <p className="text-[12.5px] font-semibold text-ink-500 max-[359px]:sr-only">Hallenmaß</p>
            <Pillen
              name="k2-halle"
              legende="Hallengröße"
              wert={preset}
              klein
              onWahl={a ? (id) => a.setPreset(id) : null}
              optionen={HALLEN_PRESETS.map((h) => ({ id: h.id, label: h.label, testid: `halle-${h.id.slice(1)}` }))}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            <Regler
              id="k2-laenge"
              label={<span className="whitespace-nowrap">Länge (N–S)</span>}
              wert={z.laengeM}
              {...MASS.laenge}
              anzeige={`${zahl(z.laengeM)} m`}
              valuetext={`${z.laengeM} Meter Länge von Nord nach Süd`}
              testid="halle-laenge"
              onWert={a?.setLaenge}
            />
            <Regler
              id="k2-breite"
              label={<span className="whitespace-nowrap">Breite (O–W)</span>}
              wert={z.breiteM}
              {...MASS.breite}
              anzeige={`${zahl(z.breiteM)} m`}
              valuetext={`${z.breiteM} Meter Breite von Ost nach West`}
              testid="halle-breite"
              onWert={a?.setBreite}
            />
          </div>
        </div>

        {/* 6 · Abzüge */}
        <div className={`${KARTE} ${RECHTS}`} {...steuer}>
          <p className="text-[12.5px] font-semibold text-ink-500">Abzüge vom Bruttodach (Richtwerte)</p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
            <Regler
              id="k2-rand"
              label="Randabstand"
              zusatz="Brandschutz, Wartung, Attika-Schatten"
              wert={z.randPct}
              min={ABZUG.rand.min}
              max={ABZUG.rand.max}
              schritt={ABZUG.rand.schritt}
              anzeige={`${zahl(z.randPct)} %`}
              valuetext={`Randabstand ${z.randPct} Prozent, ${zahl(w.rand)} Quadratmeter`}
              testid="abzug-rand"
              onWert={a?.setRand}
            />
            <Regler
              id="k2-hindernis"
              label={
                <>
                  <span className="md:hidden">Kuppeln, Technik</span>
                  <span className="hidden md:inline">
                    Lichtkuppeln, Technik und Brandschutz-Freihaltezonen <span className="whitespace-nowrap">(OVE R 11-1)</span>
                  </span>
                </>
              }
              wert={z.hindernisPct}
              min={ABZUG.hindernisse.min}
              max={ABZUG.hindernisse.max}
              schritt={ABZUG.hindernisse.schritt}
              anzeige={`${zahl(z.hindernisPct)} %`}
              valuetext={`Kuppeln, Technik und Freihaltezonen ${z.hindernisPct} Prozent, ${zahl(w.hindernisse)} Quadratmeter`}
              testid="abzug-hindernis"
              onWert={a?.setHindernis}
            />
          </div>
        </div>

        {/* 7 · Rechenweg (ab lg; mobil/Tablet steht er als Zeile unter der Ablese-Leiste) */}
        <div
          className={`hidden rounded-[22px] bg-white p-5 shadow-[0_1px_0_rgba(21,26,36,0.03),0_14px_34px_-18px_rgba(21,26,36,0.22)] lg:block ${RECHTS}`}
        >
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Rechenweg</p>
          <Zeile
            className="mt-2"
            links={
              <>
                Dachfläche brutto{" "}
                <span className="ov-num whitespace-nowrap text-ink-500">
                  · {zahl(z.breiteM)} × {zahl(z.laengeM)} m
                </span>
              </>
            }
            rechts={`${zahl(w.brutto)} m²`}
            wert="ov-num shrink-0 whitespace-nowrap font-semibold text-ink-900"
          />
          <Zeile links={`− Randabstand ${zahl(z.randPct)} %`} rechts={`−${zahl(w.rand)} m²`} />
          <Zeile
            links={
              <>
                − Kuppeln, Technik, Freihaltezonen <span className="whitespace-nowrap">{zahl(z.hindernisPct)} %</span>
              </>
            }
            rechts={`−${zahl(w.hindernisse)} m²`}
          />
          <Zeile
            className="mt-1 border-t border-ink-900/[0.08]"
            links={<span className="font-semibold text-ink-800">= Nutzfläche</span>}
            rechts={`${zahl(w.netto)} m²`}
            wert="ov-num shrink-0 whitespace-nowrap font-semibold text-ink-900"
          />
          <Zeile links={`÷ Flächenbedarf ${info.kurz}`} rechts={`${zahl(dachart.qmProKwp)} m²/kWp`} />
          <Zeile
            className="border-t border-ink-900/[0.08]"
            links={<span className="font-semibold text-ink-800">= max. Leistung</span>}
            rechts={`≈ ${zahl(w.kwp)} kWp`}
            wert="ov-num shrink-0 whitespace-nowrap font-semibold text-ink-900"
          />
          <Zeile
            links={
              <>
                × spez. Ertrag {ort.name}
                <span className="block text-[12px] text-ink-500">{info.basis}</span>
              </>
            }
            rechts={`${zahl(w.spez)} kWh/kWp`}
          />
          <Zeile
            className="border-t border-ink-900/[0.08]"
            links={<span className="font-semibold text-ink-800">= Jahresertrag</span>}
            rechts={`≈ ${zahl(w.mwh)} MWh`}
            wert="ov-num shrink-0 whitespace-nowrap font-semibold text-ink-900"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <QuellePille>
              <a href={pvgis.url} className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900" target="_blank" rel="noopener noreferrer">
                Ertrag: {pvgis.name}
              </a>
            </QuellePille>
            <QuellePille>
              Flächenbedarf ({STAND.kurz}) und Abzüge ({ABZUG_STAND}): Annahmen Ökovolt · {KENNZEICHNUNG.richtwert}
            </QuellePille>
          </div>
        </div>

        {/* 8 · Ort */}
        <div className={`${KARTE} md:col-span-2 ${RECHTS}`} {...steuer}>
          <label htmlFor="k2-ort" className="text-[12.5px] font-semibold text-ink-500">
            Standort (PVGIS, {orte.reduce((s, g) => s + g.orte.length, 0)} Orte)
          </label>
          <div className="relative mt-2">
            <select
              id="k2-ort"
              data-testid="dach-ort"
              className="h-12 w-full cursor-pointer appearance-none rounded-full bg-ink-100 pl-4 pr-10 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-ink-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-600"
              {...(a ? { value: z.ortId, onChange: (e) => a.setOrt(e.target.value) } : { defaultValue: z.ortId })}
            >
              {orte.map((g) => (
                <optgroup key={g.land} label={g.name}>
                  {g.orte.map((o) => (
                    <option key={o.slug} value={o.slug}>
                      {o.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" aria-hidden="true">
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <ErtragsLeiste orte={orte} dachart={dachart.id} ortId={z.ortId} onOrt={a?.setOrt} />
        </div>
      </div>

      <figcaption className="mt-5 grid gap-1.5 md:mt-8 md:gap-2">
        <p className="sr-only max-w-3xl text-[14px] leading-relaxed text-ink-700 md:not-sr-only" aria-live={a ? "polite" : undefined}>
          {caption}
        </p>
        <Kennzeichnung>
          {KENNZEICHNUNG.schematisch}
          <span className="md:hidden">
            ; Abzüge sind Richtwerte. Ertrag:{" "}
            <a href={pvgis.url} className="underline decoration-ink-300 underline-offset-2" target="_blank" rel="noopener noreferrer">
              {pvgis.name}
            </a>
            ; Flächenbedarf ({STAND.kurz}) und Abzüge ({ABZUG_STAND}): Annahmen Ökovolt · {KENNZEICHNUNG.richtwert}
          </span>
          <span className="hidden md:inline">
            : Hallenmodell und Modulraster zeigen das typische Muster der Dachart (1 Feld = 1 Modul à {MODUL.wp} Wp, über 2.400 Modulen 1 Feld = mehrere Module in Reihe).
            Abzüge sind Richtwerte, keine Normwerte – Statik, Brandschutz und Belegung prüfen wir am Objekt.
          </span>
        </Kennzeichnung>
        <p className="hidden text-[12px] leading-snug text-ink-500 md:block lg:hidden">
          ≈ {zahl(w.module)} Module à {MODUL.wp} Wp (Annahme) · Ertrag:{" "}
          <a href={pvgis.url} className="underline decoration-ink-300 underline-offset-2" target="_blank" rel="noopener noreferrer">
            {pvgis.name}
          </a>{" "}
          · Flächenbedarf ({STAND.kurz}) und Abzüge ({ABZUG_STAND}): Annahmen Ökovolt · {KENNZEICHNUNG.richtwert}
        </p>
      </figcaption>
    </figure>
  );
}

/** Platz der Erkenntnis vor der ersten Interaktion: lädt zum Vergleich ein und hält ab md die Fläche frei. */
export function ErkenntnisPlatz() {
  return (
    <div className="hidden min-h-[68px] items-center gap-3 rounded-[22px] bg-sand-100 px-5 py-4 text-[14.5px] leading-snug text-ink-600 md:flex md:px-7 lg:px-5">
      <span aria-hidden="true" className="h-[1.1em] w-[3px] shrink-0 rounded-full bg-ink-300" />
      <span>
        Wechseln Sie zwischen <strong className="font-semibold text-ink-900">Ost-West</strong> und <strong className="font-semibold text-ink-900">Süd</strong> – und
        vergleichen Sie, was dieselbe Halle trägt.
      </span>
    </div>
  );
}
