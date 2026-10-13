// src/components/GewerbeUnikat/K4Pult.js
//
// K4 · Pult – REINE Bausteine (ohne Hooks): Netzbereich (select), Netzebene
// (Radiogruppe), Elektrizitätsabgabe (Radiogruppe), Energiepreis (Regler + Textfeld mit Dezimalkomma), dazu
// Kartenrahmen mit Stadtnetz-Pillen und Legende.
// Ohne Handler (SSR-Platzhalter) sind die Felder deaktiviert, sehen aber gleich aus und sind gleich hoch.
//
// Containerbreiten: Pult höchstens ≈ 550 px (lg-Spalte), Handy 335–358 px, Tablet ≈ 345 px. Lange Texte
// deshalb ab @md/pult (28rem = 448 px) – nicht @xl (36rem), das nie erreicht wird.

import { ChevronDown } from "lucide-react";
import { AT_KARTE_QUELLE } from "@/components/Region/oesterreichKarte";
import { cn } from "@/components/ui/cn";
import { hexZuRgb, mische } from "./_farbe.js";
import { FARBE, zahl } from "./_tokens.js";
import { ABGABE, ENERGIE, NETZEBENEN_K4 } from "./K4Rechnung.js";

// ---------------------------------------------------------------------------------------------------
// Farbrampe der Karte: Netz-ct (Arbeitspreis + Netzverlust) der gewählten Netzebene, ov-100 → ov-600
// ---------------------------------------------------------------------------------------------------

const RAMPE = [FARBE.ov100, FARBE.ov300, FARBE.ov600].map(hexZuRgb);

/** Farbe für Anteil t (0 … 1) auf der Rampe ov-100 → ov-300 → ov-600. */
export function netzFarbe(t) {
  const p = Math.max(0, Math.min(1, t)) * (RAMPE.length - 1);
  const j = Math.min(RAMPE.length - 2, Math.floor(p));
  const [r, g, b] = mische(RAMPE[j], RAMPE[j + 1], p - j);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Netz-ct je Bereich für eine Netzebene, dazu Spannweite. */
export function netzSkala(netz, ne) {
  const werte = netz.map((b) => ({ id: b.id, label: b.label, ct: b.ne[ne].ap + b.ne[ne].nv }));
  let min = werte[0];
  let max = werte[0];
  for (const w of werte) {
    if (w.ct < min.ct) min = w;
    if (w.ct > max.ct) max = w;
  }
  const t = (ct) => (max.ct > min.ct ? (ct - min.ct) / (max.ct - min.ct) : 0.5);
  return { werte, min, max, t };
}

/** Bereiche für das select: Bundesländer und Stadtnetze, alphabetisch. */
export function netzGruppen(netz) {
  const sortiert = [...netz].sort((a, b) => a.label.localeCompare(b.label, "de"));
  return [
    { label: "Bundesländer", bereiche: sortiert.filter((b) => !b.stadt) },
    { label: "Stadtnetze", bereiche: sortiert.filter((b) => b.stadt) },
  ];
}

/** Energiepreis als Text mit Dezimalkomma (Textfeld). */
export const energieText = (ct) => zahl(ct, 1);

// ---------------------------------------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------------------------------------

/**
 * Gefüllte Radiogruppe (wie Segment aus _gestaltung, aber ohne Hooks – auch im SSR).
 * legendeVersteckt: Legende nur für Screenreader · voll: volle Breite, gleich breite Felder (Etiketten dürfen umbrechen).
 */
export function K4Auswahl({ name, wert, optionen, onWahl, label, zusatz, testid, legendeVersteckt = false, voll = false }) {
  return (
    <fieldset className="min-w-0" data-testid={testid}>
      <legend className={legendeVersteckt ? "sr-only" : "mb-2 text-[12.5px] font-semibold text-ink-500"}>
        {label}
        {zusatz}
      </legend>
      <div
        className={cn("gap-1 rounded-[22px] bg-ink-100 p-1", voll ? "grid w-full" : "inline-flex max-w-full flex-wrap")}
        style={voll ? { gridTemplateColumns: `repeat(${optionen.length}, minmax(0, 1fr))` } : undefined}
      >
        {optionen.map((o) => {
          const aktiv = o.id === wert;
          return (
            <label
              key={o.id}
              className={cn(
                "relative flex min-h-11 select-none items-center justify-center rounded-full font-semibold transition-colors duration-200",
                voll ? "px-2 text-center text-[13px] leading-tight" : "whitespace-nowrap px-3 text-[13.5px] @md/pult:px-4 @md/pult:text-[14px]",
                onWahl ? "cursor-pointer" : "cursor-default",
                aktiv ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-white",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-500"
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={aktiv}
                disabled={!onWahl}
                onChange={onWahl ? () => onWahl(o.id) : undefined}
                className="sr-only"
              />
              {o.label}
              {o.sr && <span className="sr-only">{o.sr}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Kurze Etiketten MIT Bedeutung (auch auf dem Handy); der Screenreader hört dasselbe plus Erklärung.
const ABGABE_OPTIONEN = [
  { id: "befristet", label: `${zahl(ABGABE.befristet, 2)} ct · 2026`, sr: " – befristet gesenkter Satz" },
  { id: "regulaer", label: `${zahl(ABGABE.regulaer, 1)} ct · regulär`, sr: " – regulärer Satz" },
];

function QuelleLink({ hinweis }) {
  if (!hinweis?.quelle?.url) return null;
  return (
    <>
      {" ("}
      <a href={hinweis.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
        Quelle
      </a>
      {")"}
    </>
  );
}

/**
 * Pult. Ohne `aendern` (SSR) sind alle Felder deaktiviert.
 * aendern: { bereich(id), ne(n), energieText(text), energieRegler(zahl), energieFertig(), abgabe(id) }
 * (Die Wahl der Anlage steht beim Röntgenbild bzw. im Film – Ursache neben Wirkung.)
 * energieEingabe: Text im Zahlenfeld (Client: freie Eingabe); sonst aus energieCt mit Komma
 */
export function K4Pult({ netz, werte, bereich, ne, energieCt, energieEingabe, abgabeCt, abgabeHinweis, aendern }) {
  const aus = !aendern;
  const fuell = ((energieCt - ENERGIE.min) / (ENERGIE.max - ENERGIE.min)) * 100;
  const startT = (ENERGIE.start - ENERGIE.min) / (ENERGIE.max - ENERGIE.min);
  const nichtEnergie = werte.summe - werte.teile[0].wert;
  const ebene = NETZEBENEN_K4.find((n) => n.id === ne) || NETZEBENEN_K4[1];

  return (
    <div className="@container/pult">
      <div className="grid gap-y-3 @md/pult:gap-y-6">
        <div>
          <label htmlFor="k4-netzbereich" className="block text-[12.5px] font-semibold text-ink-500">
            Netzbereich (Netzbetreiber)
          </label>
          <div className="relative mt-2">
            <select
              id="k4-netzbereich"
              data-testid="netzbereich"
              value={bereich}
              disabled={aus}
              onChange={aus ? undefined : (e) => aendern.bereich(e.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-ink-100 pl-4 pr-11 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-ink-200/70 focus:bg-white disabled:cursor-default"
            >
              {netzGruppen(netz).map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.bereiche.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label} – {b.betreiber}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          </div>
        </div>

        <div className="grid gap-y-4 @md/pult:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @md/pult:gap-x-6">
          <div className="min-w-0">
            <K4Auswahl
              name="k4-ne"
              label="Netzebene"
              zusatz={<span className="font-normal text-ink-600 @md/pult:hidden"> · {ebene.kurz}</span>}
              testid="netzebene"
              wert={ne}
              optionen={NETZEBENEN_K4}
              onWahl={aus ? undefined : (id) => aendern.ne(Number(id))}
            />
            <p className="mt-2 hidden min-h-[2.6em] text-[13px] leading-snug text-ink-600 @md/pult:block">
              {ebene.text}. Die Netzebene legt der Netzbetreiber fest.
            </p>
          </div>

          <div className="min-w-0">
            <K4Auswahl
              name="k4-abgabe"
              label="Elektrizitätsabgabe"
              testid="abgabe"
              wert={abgabeCt < ABGABE.regulaer ? "befristet" : "regulaer"}
              optionen={ABGABE_OPTIONEN}
              onWahl={aus ? undefined : (id) => aendern.abgabe(id)}
            />
            <p className="mt-2 text-[12.5px] leading-snug text-ink-600 @md/pult:text-[13px]">
              <span className="@md/pult:hidden">Verlängerung offen</span>
              <span className="hidden @md/pult:inline">{abgabeHinweis?.text}</span>
              <QuelleLink hinweis={abgabeHinweis} />. Für Eigenverbrauch fällt sie nicht an (§ 2 ElAbgG).
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="k4-energie" className="block text-[12.5px] font-semibold text-ink-500">
            Energiepreis aus Ihrem Liefervertrag (netto)
          </label>
          <div className="mt-1 flex items-start gap-3">
            <div className="relative min-w-0 flex-1">
              <input
                id="k4-energie"
                type="range"
                min={ENERGIE.min}
                max={ENERGIE.max}
                step={ENERGIE.schritt}
                value={energieCt}
                disabled={aus}
                onChange={aus ? undefined : (e) => aendern.energieRegler(Number(e.target.value))}
                onPointerUp={aus ? undefined : () => aendern.energieFertig()}
                onKeyUp={aus ? undefined : () => aendern.energieFertig()}
                aria-valuetext={`${zahl(energieCt, 1)} Cent je Kilowattstunde`}
                data-testid="energiepreis"
                className="ov-range block cursor-pointer disabled:cursor-default"
                // Trefferfläche 44 px, sichtbare Spur 8 px (Inline-Stil, weil .ov-range Höhe/Hintergrund global setzt)
                style={{ "--ov-fill": `${fuell}%`, height: 44, paddingTop: 18, paddingBottom: 18, backgroundClip: "content-box" }}
              />
              <div aria-hidden="true" className="ov-num relative h-5 text-[11px] leading-none text-ink-500">
                <span className="absolute left-0 top-1.5">{ENERGIE.min} ct</span>
                <span className="absolute right-0 top-1.5">{ENERGIE.max} ct</span>
                <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap" style={{ left: `calc(13px + (100% - 26px) * ${startT})` }}>
                  <span className="mx-auto mb-0.5 block h-1.5 w-px bg-ink-900/40" />
                  <span className="@sm/pult:hidden">Beispiel</span>
                  <span className="hidden @sm/pult:inline">Rechenbeispiel {zahl(ENERGIE.start)} ct</span>
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={energieEingabe ?? energieText(energieCt)}
                disabled={aus}
                onChange={aus ? undefined : (e) => aendern.energieText(e.target.value)}
                onBlur={aus ? undefined : () => aendern.energieFertig()}
                onKeyDown={aus ? undefined : (e) => e.key === "Enter" && aendern.energieFertig()}
                aria-label={`Energiepreis in Cent je Kilowattstunde, ${zahl(ENERGIE.min)} bis ${zahl(ENERGIE.max)}`}
                data-testid="energiepreis-zahl"
                className="ov-num h-11 w-[4.6rem] rounded-xl bg-ink-100 px-3 text-right font-display text-[16px] font-bold text-ink-900 focus:bg-white"
              />
              <span className="text-[13px] font-semibold text-ink-500">
                ct<span className="hidden @md/pult:inline">/kWh</span>
              </span>
            </div>
          </div>
          <p className="mt-2 text-[12.5px] leading-snug text-ink-600 @md/pult:text-[13px]">
            Netz und Abgabe (<span className="ov-num font-semibold text-ink-900">{zahl(nichtEnergie, 2)} ct</span>) entfallen für Eigenverbrauch bei jedem
            Energiepreis.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Stadtnetze als gefüllte Pillen unter der Karte (Trefferfläche 44 px, auf Touch 48 px) – der große, eindeutige
 * Weg zu Linz, Graz, Klagenfurt und Innsbruck; auf der Karte haben die Landesflächen Vorrang.
 * Ohne onWahl (SSR) deaktiviert.
 */
export function K4StadtPillen({ netz, bereich, onWahl }) {
  const staedte = netz.filter((b) => b.stadt).sort((a, b) => a.label.localeCompare(b.label, "de"));
  return (
    <div role="group" aria-label="Stadtnetze" className="flex flex-wrap items-center gap-1.5">
      <span aria-hidden="true" className="mr-1 hidden text-[12px] font-semibold text-ink-500 @md/karte:inline">
        Stadtnetz
      </span>
      {staedte.map((b) => {
        const aktiv = b.id === bereich;
        return (
          <button
            key={b.id}
            type="button"
            data-testid={`stadtnetz-${b.id}`}
            aria-pressed={aktiv}
            disabled={!onWahl}
            onClick={onWahl ? () => onWahl(b.id) : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-3 text-[13px] font-semibold transition-colors duration-200 [@media(pointer:coarse)]:min-h-12",
              aktiv ? "bg-navy-700 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200/70",
              !onWahl && "cursor-default"
            )}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}

/** Rahmen der Karte (SSR: leere Fläche gleicher Größe; Client: Karte als children). */
export function K4KarteRahmen({ children, legende, pillen }) {
  return (
    <div className="@container/karte">
      <div className="hidden items-baseline justify-between gap-3 sm:flex">
        <p className="shrink-0 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Netzbereich</p>
        <p className="text-right text-[12.5px] text-ink-500">Land antippen oder Stadtnetz wählen</p>
      </div>
      <div className="relative aspect-[1000/535] w-full sm:mt-3">{children}</div>
      {pillen && <div className="mt-2">{pillen}</div>}
      {/* Handy: die gewählte Fläche trägt ihr Etikett mit ct – die Legende entfällt */}
      <div className="mt-3 hidden h-[38px] sm:block @md/karte:h-[62px]">{legende}</div>
      <p className="mt-1.5 text-[11px] leading-snug text-ink-500">{AT_KARTE_QUELLE}</p>
    </div>
  );
}

/** Legende der Karte: Verlauf mit allen 13 Bereichen als Strich, der gewählte hervorgehoben. */
export function K4Legende({ netz, ne, bereich }) {
  const skala = netzSkala(netz, ne);
  const gewaehlt = skala.werte.find((w) => w.id === bereich) || skala.werte[0];
  const pos = (ct) => `${skala.t(ct) * 100}%`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[11.5px] leading-tight text-ink-500">
        <span className="min-w-0">
          <span className="@md/karte:hidden">Netzentgelt je kWh · NE {ne}</span>
          <span className="hidden @md/karte:inline">Netzentgelt je kWh (Arbeitspreis + Netzverlust) · NE {ne}</span>
        </span>
        <span className="ov-num shrink-0 whitespace-nowrap font-semibold text-navy-700">
          {gewaehlt.label} {zahl(gewaehlt.ct, 2)} ct
        </span>
      </div>
      <div
        aria-hidden="true"
        className="relative mt-2.5 h-2.5 rounded-full"
        style={{ background: `linear-gradient(to right, ${netzFarbe(0)}, ${netzFarbe(0.5)}, ${netzFarbe(1)})` }}
      >
        {skala.werte.map((w) => (
          <span key={w.id} className="absolute top-full mt-0.5 h-1.5 w-px bg-ink-900/35" style={{ left: pos(w.ct) }} />
        ))}
        <span
          className="absolute -top-[4px] h-[18px] w-[4px] -translate-x-1/2 rounded-full bg-navy-700 ring-2 ring-white transition-[left] duration-300"
          style={{ left: pos(gewaehlt.ct) }}
        />
      </div>
      <div aria-hidden="true" className="ov-num mt-3 hidden justify-between gap-3 text-[11px] leading-none text-ink-500 @md/karte:flex">
        <span>
          {zahl(skala.min.ct, 2)} ct · {skala.min.label}
        </span>
        <span className="text-right">
          {zahl(skala.max.ct, 2)} ct · {skala.max.label}
        </span>
      </div>
    </div>
  );
}
