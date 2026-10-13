// src/components/GewerbeUnikat/K7Ansicht.js
//
// K7 · ANSICHT des Pults „Rechenweg live“ und des 25-Jahre-Fächers – REINE Komponenten (keine Hooks, kein
// "use client"). Die Server-Hülle rendert sie im Startzustand als Platzhalter (SSR, ohne JS lesbar, gleiche
// Höhen wie die Bühne → kein CLS), die Bühne (K7Pult/K7Stresstest) rendert DIESELBEN Bausteine mit
// Live-Werten und Handlern.
//
// Komposition (eigene des Kapitels): Desktop links die Werkbank (Rechenblatt mit Regler-Zeile, darunter
// Einwand-Prüfstand und Warte-Regler), rechts der Saldo als mitlaufendes Instrument (sticky): Zahlen und
// die Saldo-Kurve (kumulierter Cashflow mit Geisterlinie des Rechenbeispiels) – jede Eingabe und jeder
// geprüfte Einwand ist dort sofort als Linie sichtbar. Darunter der Fächer mit Ableseleiste und Lesespalte,
// darunter die Entscheider-Mappe. Tablet: Saldo oben, darunter die Werkbank. Mobil (≤ 2.600 px): Tabs
// „Rechenweg | Stresstest“; Rechenweg = Tabelle → Regler-Dock (Daumenzone, ein Feld auf einmal) → Fußtext →
// Prüfstand (Antwort mit Kurve) → Warten (eingeklappt); Stresstest = Fächer.

import { ChevronDown, Lock, Share2 } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { QuellePille } from "./_bausteine.js";
import { STAND, zahl } from "./_tokens.js";
import { ABGABE, GRENZEN, IFB_SATZ, PRUEFUNGEN, euro10, euro100, jahre1, netzKurz, pz, tsd } from "./K7Rechnen.js";
import { MonatsLeiste, Regler, Wahl } from "./K7Regler.js";

/** Satz zur Abweichung zwischen Rechenweg und Stundenmodell (wörtlich, Konzept K7). */
export const SATZ_ABWEICHUNG =
  "Stundenmodell mit Degradation, Preissteigerung und Investition laut Marktstatistik-Richtwert – deshalb weicht es vom Rechenweg oben ab. Der IFB-Satz im Modell ist 22 %.";

const EAG_SATZ = "Wer weniger beantragt, wird besser gereiht – und erhält weniger.";

/** Statischer Wert (Server); die Bühne reicht eine gleitende Zahl herein. */
export function WertStatisch({ wert, format }) {
  return <span className="ov-num">{format(wert)}</span>;
}

// ---------------------------------------------------------------------------------------------------
// Gerüst
// ---------------------------------------------------------------------------------------------------

/**
 * Desktop: links Werkbank (Rechenblatt → Prüfstand → Warten), rechts der Saldo mitlaufend (sticky).
 * Tablet: Saldo oben, darunter die Werkbank. Darunter jeweils Fächer und Mappe.
 * Mobil: zwei Ansichten (Tabs „Rechenweg | Stresstest“), Saldo entfällt (die Tabelle trägt die Ergebnisse),
 * Regler im Dock unter der Tabelle (Daumenzone).
 */
export default function K7Ansicht({ tabs, ansicht = "rechenweg", saldo, tabelle, unterTabelle, dock, pruefstand, warte, weiter, faecher, mappe }) {
  return (
    <div>
      {tabs && <div className="mb-5 md:hidden">{tabs}</div>}
      <div className={cn(ansicht !== "rechenweg" && "max-md:hidden")} data-ansicht="rechenweg">
        <div className="flex flex-col gap-5 md:gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,352px)] lg:gap-x-12 xl:gap-x-16">
          <div className="max-lg:contents lg:flex lg:min-w-0 lg:flex-col lg:gap-12">
            <div id="beispielrechnung" className="order-2 min-w-0 scroll-mt-28">
              {tabelle}
              {dock && <div className="mt-4 md:hidden">{dock}</div>}
              {unterTabelle}
            </div>
            <div className="order-3 min-w-0">{pruefstand}</div>
            <div className="order-4 min-w-0">{warte}</div>
            {weiter && <div className="order-5 md:hidden">{weiter}</div>}
          </div>
          {/* Grid-Zelle läuft über die ganze Werkbank-Höhe – darin bleibt der Saldo im Bild */}
          <div className="order-1 min-w-0 max-md:hidden">
            <div className="lg:sticky lg:top-[92px]">{saldo}</div>
          </div>
        </div>
      </div>
      <div className={cn(ansicht !== "stresstest" && "max-md:hidden")} data-ansicht="stresstest">
        {faecher}
      </div>
      {mappe && <div className={cn(ansicht !== "stresstest" && "max-md:hidden")}>{mappe}</div>}
    </div>
  );
}

/** Mobile Ansicht-Wahl (Tabs als gefüllte Segmente). */
export function AnsichtTabs({ ansicht, onAnsicht }) {
  return (
    <Wahl
      name="k7-ansicht"
      legende="Ansicht wählen"
      legendeVersteckt
      voll
      wert={ansicht}
      optionen={[
        { id: "rechenweg", label: "Rechenweg" },
        { id: "stresstest", label: "Stresstest" },
      ]}
      onWahl={onAnsicht}
      testid="ansicht-tabs"
      klein={false}
    />
  );
}

/** Unter der Tabelle: Hinweis auf Markierung, Fußtext (wörtlich; mobil gekürzt mit „ganz lesen“), Quellen. */
export function UnterTabelle({ fuss, geaendert, quelleNetz, fussOffen = false, onFuss }) {
  return (
    <div className="mt-4 space-y-2.5 md:space-y-3">
      <p
        className={cn("text-[12.5px] font-semibold leading-snug text-ov-800 transition-opacity duration-300", geaendert ? "opacity-100" : "opacity-0 max-md:hidden")}
        aria-hidden={!geaendert}
      >
        <span aria-hidden="true" className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px] bg-ov-100 align-[-1px]" />
        Grün hinterlegt: Ihre Abweichungen vom Rechenbeispiel.
      </p>
      <div>
        <p id="k7-fuss" className={cn("max-w-[78ch] text-[12.5px] leading-relaxed text-ink-500", !fussOffen && "max-md:line-clamp-2")}>
          {fuss}
        </p>
        {!fussOffen &&
          (onFuss ? (
            <button
              type="button"
              onClick={onFuss}
              aria-expanded={false}
              aria-controls="k7-fuss"
              className="min-h-10 text-[12.5px] font-semibold text-ink-700 underline decoration-ink-300 underline-offset-2 md:hidden"
            >
              Annahmen des Beispiels ganz lesen
            </button>
          ) : (
            <span className="inline-flex min-h-10 items-center text-[12.5px] font-semibold text-ink-700 underline decoration-ink-300 underline-offset-2 md:hidden">
              Annahmen des Beispiels ganz lesen
            </span>
          ))}
      </div>
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {/* mobil EINE Pille in Kurzform (eine Zeile auch bei 360 px – Kapitelhöhe ≤ 2.600 px), ab md zwei */}
        <QuellePille className="md:hidden">
          Beispiel · {STAND.kurz} · Richtwert ·
          <a href={quelleNetz.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
            Netzentgelte
          </a>
        </QuellePille>
        <QuellePille className="max-md:hidden">Beispiel, kein Angebot · {STAND.werte} · Richtwert</QuellePille>
        <QuellePille className="max-md:hidden">
          Netzentgelte:{" "}
          <a href={quelleNetz.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
            SNE-V-Novelle 2026
          </a>
        </QuellePille>
      </div>
    </div>
  );
}
// ---------------------------------------------------------------------------------------------------
// Saldo (rechte Spalte, Desktop mitlaufend): Jahresüberschuss, Amortisation, IFB-Wirkung, Saldo-Kurve
// ---------------------------------------------------------------------------------------------------

const GROSS = "ov-num mt-1 font-display text-[20px] font-extrabold leading-none tracking-[-0.02em] text-ink-900 md:text-[28px]";

/**
 * Saldo des Rechenwegs. r = aktuelles Ergebnis, r0 = Rechenbeispiel (für den Vergleich).
 * aktionen: { zuruecksetzen, uebernehmen } (nur Bühne); uebernehmenText: Beschriftung oder null.
 * kurve: Saldo-Kurve (Server: KurveStatisch, Bühne: K7SaldoKurve) – kumulierter Cashflow, statisch.
 */
export function Saldo({ r, r0, Wert = WertStatisch, geaendert, aktionen, uebernehmenText, kurve }) {
  const live = Boolean(aktionen);
  const delta = Math.round((r.jahr - r0.jahr) / 10) * 10;
  return (
    <section aria-label="Saldo des Rechenwegs" className="rounded-3xl bg-sand-100/70 p-5 md:p-6" data-testid={live ? "saldo" : undefined}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">Saldo des Rechenwegs</p>

      <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-4 lg:grid-cols-2 lg:gap-x-3">
        <div className="min-w-0 lg:col-span-2">
          <dt className="text-[12px] leading-snug text-ink-600 md:text-[13px]">
            Jährlicher Überschuss<span className="max-lg:hidden"> vor Steuern</span>
          </dt>
          <dd className={cn(GROSS, "lg:text-[34px]")}>
            <Wert wert={r.jahr} format={(v) => euro10(v)} />
            <span className="ml-1 text-[0.55em] font-bold text-ink-500">€/J.</span>
          </dd>
          <dd className={cn("ov-num mt-1.5 text-[11.5px] leading-snug md:text-[12.5px]", geaendert && delta !== 0 ? (delta > 0 ? "text-ov-800" : "text-ink-700") : "text-ink-500")}>
            {!geaendert ? (
              "wie im Rechenbeispiel"
            ) : delta === 0 ? (
              "unverändert ggü. Rechenbeispiel"
            ) : (
              <>
                {delta > 0 ? "+" : "−"}
                {euro10(Math.abs(delta))} € ggü. Rechenbeispiel
              </>
            )}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[12px] leading-snug text-ink-600 md:text-[13px]">Statische Amortisation</dt>
          <dd className={cn(GROSS, "lg:text-[26px]")}>
            {r.amortisation == null ? (
              "–"
            ) : (
              <>
                <Wert wert={r.amortisation} format={(v) => jahre1(v)} />
                <span className="ml-1 text-[0.55em] font-bold text-ink-500">Jahre</span>
              </>
            )}
          </dd>
          <dd className="ov-num mt-1.5 text-[11.5px] leading-snug text-ink-500 md:text-[12.5px]">
            {geaendert && Math.abs((r.amortisation ?? 99) - (r0.amortisation ?? 99)) > 0.05 ? `statt ${jahre1(r0.amortisation)} J.` : "Investition ÷ Überschuss"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[12px] leading-snug text-ink-600 md:text-[13px]">
            <span className="lg:hidden">Steuerwirkung </span>Öko-IFB {pz(r.eingaben.ifbSatz)} %
          </dt>
          <dd className={cn(GROSS, "lg:text-[26px]")}>
            <Wert wert={r.ifbWirkung} format={(v) => euro100(v)} />
            <span className="ml-1 text-[0.55em] font-bold text-ink-500">€</span>
          </dd>
          <dd className="mt-1.5 text-[11.5px] leading-snug text-ink-500 md:text-[12.5px]">
            <span className="max-lg:hidden">Steuerwirkung, </span>einmalig<span className="lg:hidden">, KöSt 23 %</span>
          </dd>
        </div>
      </dl>

      {kurve && (
        <figure className="mt-5 border-t border-ink-900/[0.08] pt-4">
          <figcaption className="flex items-baseline justify-between gap-3 text-[12.5px] leading-snug">
            <span className="font-semibold text-ink-800">Kumuliert über 15 Jahre</span>
            <span className="text-ink-500">statisch, wie die Tabelle</span>
          </figcaption>
          <div className="mt-2">{kurve}</div>
          <p className="mt-2 text-[12px] leading-snug text-ink-500">
            Jedes Jahr derselbe Überschuss – ohne Alterung und Preissteigerung.{" "}
            <a href="#k7-faecher" className="whitespace-nowrap font-semibold text-ink-800 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-800">
              25 Jahre im Stresstest ↓
            </a>
          </p>
        </figure>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {live ? (
          <button
            type="button"
            onClick={aktionen.zuruecksetzen}
            disabled={!geaendert}
            data-testid="pult-reset"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-navy-950 px-4 text-[13.5px] font-semibold text-white transition-[background-color,opacity] duration-200 hover:bg-navy-800 disabled:cursor-default disabled:bg-ink-200 disabled:text-ink-500 lg:w-full"
          >
            <span aria-hidden="true">↺</span> Zurück zum Rechenbeispiel
          </button>
        ) : (
          <span className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-ink-200 px-4 text-[13.5px] font-semibold text-ink-500 lg:w-full">
            <span aria-hidden="true">↺</span> Zurück zum Rechenbeispiel
          </span>
        )}
        {uebernehmenText &&
          (live ? (
            <button
              type="button"
              onClick={aktionen.uebernehmen}
              data-testid="pult-uebernehmen"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-900 transition-colors duration-200 hover:bg-ink-50 lg:w-full"
            >
              <span aria-hidden="true">↧</span> {uebernehmenText}
            </button>
          ) : (
            <span className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-900 lg:w-full">
              <span aria-hidden="true">↧</span> {uebernehmenText}
            </span>
          ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------------
// Regler je Feld (Desktop: Regler-Zeile unter der Tabellenzeile, mobil: Dock unter der Tabelle)
// ---------------------------------------------------------------------------------------------------

/** Verstellbare Felder in Tabellen-Reihenfolge (Dock: vor/zurück). */
export const FELDER = ["kwp", "ertragKwhKwp", "evQuote", "energieCt", "abgabeCt", "ueberschussCt", "investKwp", "eagKwp", "ifbSatz"];

/** Regler-Gruppen der Tabellenzeilen und ihre Felder. */
const GRUPPEN_FELDER = { anlage: ["kwp", "ertragKwhKwp"], eigen: ["evQuote"], preis: ["energieCt", "abgabeCt"], erloes: ["ueberschussCt"], invest: ["investKwp"], eag: ["eagKwp"], ifb: ["ifbSatz"] };

/**
 * Ein Feld als Bedienelement.
 * @param {object} o
 * @param {string} o.feld   kwp | ertragKwhKwp | evQuote | energieCt | abgabeCt | ueberschussCt | investKwp | eagKwp | ifbSatz
 * @param {object} o.p Pult-Annahmen · o.r Ergebnis · o.start Annahmen des Rechenbeispiels
 * @param {object} o.quellen Werte aus anderen Kapiteln { k3Kwp, k3Ev, k2Ertrag, k2Label, k4Energie, k4Netz }
 * @param {number} o.richtwert Richtwert Marktstatistik €/kWp
 * @param {string} o.eagText Kategorie-Text
 * @param {{ setze:(feld:string, wert:any)=>void, k4:()=>void }} [o.aktionen] nur Bühne
 * @param {boolean} [o.kompakt] im mobilen Dock (gestapelt, ohne Zusatzzeilen)
 */
export function FeldRegler({ feld, p, r, start, quellen, richtwert, eagText, aktionen, kompakt = false }) {
  const live = Boolean(aktionen);
  const setze = (f) => (live ? (v) => aktionen.setze(f, v) : undefined);
  const nah = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

  switch (feld) {
    case "kwp":
      return (
        <Regler
          id="k7-r-kwp"
          label="Anlagengröße"
          wert={p.kwp}
          min={GRENZEN.kwp.min}
          max={GRENZEN.kwp.max}
          schritt={GRENZEN.kwp.schritt}
          anzeige={`${zahl(p.kwp)} kWp`}
          valuetext={`${zahl(p.kwp)} Kilowatt peak`}
          testid="regler-kwp"
          onWert={setze("kwp")}
          marken={[{ wert: start.kwp, label: "Rechenbeispiel" }]}
          chips={quellen.k3Kwp ? [{ label: `aus Kapitel 03: ${zahl(quellen.k3Kwp)} kWp`, wert: quellen.k3Kwp, aktiv: nah(p.kwp, quellen.k3Kwp) }] : []}
        />
      );
    case "ertragKwhKwp":
      return (
        <Regler
          id="k7-r-ertrag"
          label="Spezifischer Ertrag"
          wert={p.ertragKwhKwp}
          min={GRENZEN.ertragKwhKwp.min}
          max={GRENZEN.ertragKwhKwp.max}
          schritt={GRENZEN.ertragKwhKwp.schritt}
          anzeige={`${zahl(p.ertragKwhKwp)} kWh/kWp`}
          valuetext={`${zahl(p.ertragKwhKwp)} Kilowattstunden je Kilowatt peak`}
          testid="regler-ertrag"
          onWert={setze("ertragKwhKwp")}
          marken={[{ wert: start.ertragKwhKwp, label: "Innviertel" }]}
          chips={
            quellen.k2Ertrag
              ? [{ label: `Ort aus Kapitel 02: ${quellen.k2Label} · ${zahl(quellen.k2Ertrag)}`, wert: quellen.k2Ertrag, aktiv: nah(p.ertragKwhKwp, quellen.k2Ertrag) }]
              : []
          }
        />
      );
    case "evQuote":
      return (
        <Regler
          id="k7-r-ev"
          label="Eigenverbrauch"
          zusatz={kompakt ? undefined : "Anteil des Ertrags, den der Betrieb selbst nutzt – folgt dem Lastgang"}
          wert={p.evQuote}
          min={GRENZEN.evQuote.min}
          max={GRENZEN.evQuote.max}
          schritt={GRENZEN.evQuote.schritt}
          anzeige={`${pz(p.evQuote)} %`}
          valuetext={`${pz(p.evQuote)} Prozent Eigenverbrauch`}
          testid="regler-ev"
          onWert={setze("evQuote")}
          marken={[{ wert: start.evQuote, label: "Rechenbeispiel" }]}
          chips={quellen.k3Ev ? [{ label: `aus Kapitel 03: ${pz(quellen.k3Ev)} %`, wert: quellen.k3Ev, aktiv: nah(p.evQuote, quellen.k3Ev, 0.005) }] : []}
        />
      );
    case "energieCt":
      return (
        <div className="min-w-0">
          <Regler
            id="k7-r-energie"
            label="Energiepreis Liefervertrag (netto)"
            wert={p.energieCt}
            min={GRENZEN.energieCt.min}
            max={GRENZEN.energieCt.max}
            schritt={GRENZEN.energieCt.schritt}
            anzeige={`${zahl(p.energieCt, 2)} ct`}
            valuetext={`${zahl(p.energieCt, 2)} Cent je Kilowattstunde`}
            testid="regler-energie"
            onWert={setze("energieCt")}
            marken={[{ wert: start.energieCt, label: "Rechenbeispiel" }]}
            chips={
              quellen.k4Energie != null
                ? [{ label: `aus Kapitel 04: ${zahl(quellen.k4Energie, 2)} ct`, wert: quellen.k4Energie, aktiv: nah(p.energieCt, quellen.k4Energie, 0.005) }]
                : []
            }
          />
          <div className="mt-3 rounded-2xl bg-white/70 px-3.5 py-2.5 text-[12.5px] leading-snug text-ink-600">
            <p>
              <span className="ov-num font-semibold text-ink-800">
                Netznutzung {zahl(r.netz.ap, 2)} + Netzverlust {zahl(r.netz.nv, 3)} ct
              </span>{" "}
              · {r.netz.label}, NE {p.ne} · nur lesbar, Netzbereich und Netzebene in{" "}
              <a href="#kwh-wert" className="font-semibold text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900">
                Kapitel 04
              </a>
            </p>
            {quellen.k4Netz && live && (
              <button
                type="button"
                onClick={aktionen.k4}
                className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink-100 px-3 text-[12.5px] font-semibold text-ink-700 transition-colors hover:bg-ink-200"
              >
                <span aria-hidden="true">↧</span> aus Kapitel 04: {quellen.k4Netz}
              </button>
            )}
          </div>
        </div>
      );
    case "abgabeCt":
      return (
        <div className="min-w-0">
          <Wahl
            name="k7-abgabe"
            legende="Elektrizitätsabgabe"
            wert={nah(p.abgabeCt, ABGABE.regulaer) ? "regulaer" : "befristet"}
            optionen={[
              { id: "befristet", label: "0,82 ct · 2026 befristet" },
              { id: "regulaer", label: "1,5 ct · regulär" },
            ]}
            onWahl={live ? (id) => aktionen.setze("abgabeCt", id === "regulaer" ? ABGABE.regulaer : ABGABE.befristet) : undefined}
            testid="regler-abgabe"
          />
          <p className="mt-2 text-[12.5px] leading-snug text-ink-500">Selbst erzeugter und verbrauchter Solarstrom ist von der Abgabe befreit (§ 2 ElAbgG).</p>
        </div>
      );
    case "ueberschussCt":
      return (
        <Regler
          id="k7-r-ueberschuss"
          label="Überschusserlös je eingespeister kWh"
          zusatz={kompakt ? undefined : "Marktpreis bzw. Vermarktungserlös – im Rechenbeispiel konstant"}
          wert={p.ueberschussCt}
          min={GRENZEN.ueberschussCt.min}
          max={GRENZEN.ueberschussCt.max}
          schritt={GRENZEN.ueberschussCt.schritt}
          anzeige={`${zahl(p.ueberschussCt, 2)} ct`}
          valuetext={`${zahl(p.ueberschussCt, 2)} Cent je Kilowattstunde`}
          testid="regler-ueberschuss"
          onWert={setze("ueberschussCt")}
          marken={[{ wert: start.ueberschussCt, label: "Rechenbeispiel" }]}
        />
      );
    case "investKwp":
      return (
        <Regler
          id="k7-r-invest"
          label={kompakt ? "Investition je kWp (netto)" : "Investition je kWp (netto, schlüsselfertig)"}
          wert={p.investKwp}
          min={GRENZEN.investKwp.min}
          max={GRENZEN.investKwp.max}
          schritt={GRENZEN.investKwp.schritt}
          anzeige={`${zahl(p.investKwp)} €/kWp`}
          valuetext={`${zahl(p.investKwp)} Euro je Kilowatt peak`}
          testid="regler-invest"
          onWert={setze("investKwp")}
          marken={[
            { wert: start.investKwp, label: "Beispiel", kurz: `Beispiel ${zahl(start.investKwp)}` },
            { wert: richtwert, label: `Marktstatistik ${zahl(richtwert)}`, kurz: `Markt ${zahl(richtwert)}` },
          ]}
          hinweis={`Richtwert Marktstatistik für ${zahl(p.kwp)} kWp: ${zahl(richtwert)} €/kWp netto (Marktentwicklung 2024, IEA PVPS Austria) – kein Ökovolt-Preis.`}
        />
      );
    case "eagKwp":
      return (
        <Regler
          id="k7-r-eag"
          label="EAG-Investitionszuschuss je kWp"
          zusatz={eagText}
          wert={p.eagKwp}
          min={GRENZEN.eagKwp.min}
          max={GRENZEN.eagKwp.max}
          schritt={GRENZEN.eagKwp.schritt}
          anzeige={p.eagKwp > 0 ? `${zahl(p.eagKwp)} €/kWp` : "ohne"}
          valuetext={p.eagKwp > 0 ? `${zahl(p.eagKwp)} Euro je Kilowatt peak beantragt` : "ohne Zuschuss"}
          testid="regler-eag"
          onWert={setze("eagKwp")}
          marken={[
            { wert: 0, label: "ohne" },
            { wert: start.eagKwp, label: "Beispiel" },
          ]}
          hinweis={`${EAG_SATZ} Vergabe nur im Fördercall nach Budget, kein Rechtsanspruch.`}
        />
      );
    case "ifbSatz":
      return (
        <div className={cn("grid gap-x-8 gap-y-3", !kompakt && "sm:grid-cols-2 sm:items-end")}>
          <Wahl
            name="k7-ifb"
            legende="Öko-Investitionsfreibetrag – maßgeblich ist die Übergabe"
            wert={nah(p.ifbSatz, IFB_SATZ.ab2027) ? "ab2027" : "bis2026"}
            optionen={[
              { id: "bis2026", label: "Übergabe bis 31.12.2026 (22 %)" },
              { id: "ab2027", label: "ab 2027 (15 %)" },
            ]}
            onWahl={live ? (id) => aktionen.setze("ifbSatz", id === "ab2027" ? IFB_SATZ.ab2027 : IFB_SATZ.bis2026) : undefined}
            testid="regler-ifb"
          />
          <p className="text-[13px] leading-snug text-ink-600" data-testid={live ? "ifb-rechenfakt" : undefined}>
            <span className="font-semibold text-ink-800">Rechenfakt:</span> 22 % statt 15 % ergeben bei{" "}
            <span className="ov-num whitespace-nowrap">{euro100(Math.min(r.investition, 1_000_000))} €</span> Bemessungsgrundlage{" "}
            <span className="ov-num whitespace-nowrap font-semibold text-ink-900">≈ {euro10(r.ifbFakt)} €</span> mehr Steuerwirkung (KöSt 23 %, gerundet).
          </p>
        </div>
      );
    default:
      return null;
  }
}

/** Inhalt der Regler-Zeile einer Tabellengruppe (Desktop/Tablet). */
export function ReglerInhalt({ gruppe, ...o }) {
  const felder = GRUPPEN_FELDER[gruppe] || [];
  return (
    <div className={felder.length > 1 ? "grid gap-x-8 gap-y-5 sm:grid-cols-2" : gruppe === "ifb" ? "" : "sm:max-w-[calc(50%-1rem)]"}>
      {felder.map((f) => (
        <FeldRegler key={f} feld={f} {...o} />
      ))}
    </div>
  );
}

/**
 * Mobiles Dock unter der Tabelle (Daumenzone): ein Feld auf einmal, vor/zurück, darunter das Ergebnis und
 * „Zurück zum Rechenbeispiel“. Werte in der Tabelle anzutippen wählt das Feld.
 */
export function Dock({ feld, onFeld, inhalt, r, Wert = WertStatisch, onReset, geaendert = false }) {
  const live = Boolean(onFeld);
  const i = Math.max(0, FELDER.indexOf(feld));
  const geh = (d) => onFeld(FELDER[(i + d + FELDER.length) % FELDER.length]);
  const pfeil = "flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-900 transition-colors duration-200";
  return (
    <section aria-label="Annahmen verstellen" className="rounded-3xl bg-sand-100/70 p-4" data-testid={live ? "pult-dock" : undefined}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-700">
          Annahme <span className="ov-num">{i + 1}</span> von <span className="ov-num">{FELDER.length}</span>
        </p>
        <div className="flex gap-1.5">
          {[
            [-1, "Vorige Annahme", "M10 3 5 8l5 5"],
            [1, "Nächste Annahme", "M6 3l5 5-5 5"],
          ].map(([d, label, pfad]) => {
            const svg = (
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                <path d={pfad} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            );
            return live ? (
              <button key={d} type="button" onClick={() => geh(d)} aria-label={label} className={cn(pfeil, "hover:bg-ink-50")}>
                {svg}
              </button>
            ) : (
              <span key={d} className={pfeil}>
                {svg}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mt-2 min-h-[118px]">{inhalt}</div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink-900/[0.08] pt-3">
        <p className="ov-num min-w-0 text-[12.5px] leading-snug text-ink-600">
          <strong className="block font-display text-[16px] font-extrabold text-ink-900">
            ≈ <Wert wert={r.jahr} format={(v) => euro10(v)} /> €/Jahr
          </strong>
          {r.amortisation == null ? (
            "keine Amortisation"
          ) : (
            <>
              ≈ <Wert wert={r.amortisation} format={(v) => jahre1(v)} /> Jahre
            </>
          )}{" "}
          · IFB ≈ <Wert wert={r.ifbWirkung} format={(v) => euro100(v)} /> €
        </p>
        {live ? (
          <button
            type="button"
            onClick={onReset}
            disabled={!geaendert}
            data-testid="pult-reset"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-navy-950 px-3.5 text-[12.5px] font-semibold text-white transition-colors duration-200 disabled:bg-ink-200 disabled:text-ink-500"
          >
            <span aria-hidden="true">↺</span> Rechenbeispiel
          </button>
        ) : (
          <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink-200 px-3.5 text-[12.5px] font-semibold text-ink-500">
            <span aria-hidden="true">↺</span> Rechenbeispiel
          </span>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------------
// Einwand-Prüfstand und Warte-Regler
// ---------------------------------------------------------------------------------------------------

/** Chips des Prüfstands; panel = Live-Antwort (nur Bühne). */
export function Pruefstand({ aktiv = null, onPruefen, panel }) {
  const live = Boolean(onPruefen);
  return (
    <section aria-labelledby="k7-pruefstand-titel">
      <h3 id="k7-pruefstand-titel" className="font-display text-[17px] font-bold leading-snug text-ink-900 md:text-[18px]">
        Einwand-Prüfstand
      </h3>
      <p className="mt-1 text-[13.5px] leading-snug text-ink-600 md:text-[14px]">
        <span className="max-md:hidden">Was Betriebe uns entgegnen – ein</span>
        <span className="md:hidden">Ein</span> Klick rechnet den Einwand durch.
      </p>
      {/* Mobil eine wischbare Zeile (nur der Streifen scrollt, nie die Seite), ab md umbrechend */}
      <div
        role="group"
        aria-label="Einwände durchrechnen"
        className="ov-no-scrollbar mt-3 flex gap-1.5 max-md:-mx-5 max-md:snap-x max-md:overflow-x-auto max-md:px-5 max-md:pb-1 max-md:[mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-28px),transparent)] md:flex-wrap"
      >
        {PRUEFUNGEN.map((e) => {
          const an = aktiv === e.id;
          const klasse = cn(
            "inline-flex min-h-10 shrink-0 snap-start items-center whitespace-nowrap rounded-full px-3.5 text-left text-[13px] font-semibold leading-tight transition-colors duration-200 md:min-h-11 md:whitespace-normal md:text-[13.5px]",
            an ? "bg-navy-950 text-white" : "bg-ink-100 text-ink-800 hover:bg-ink-200"
          );
          return live ? (
            <button key={e.id} type="button" aria-pressed={an} onClick={() => onPruefen(e.id)} data-testid={`einwand-${e.id}`} className={klasse}>
              „{e.chip}“
            </button>
          ) : (
            <span key={e.id} className={klasse}>
              „{e.chip}“
            </span>
          );
        })}
      </div>
      {panel}
    </section>
  );
}

/**
 * Warte-Regler: „Wir entscheiden in … Monaten“ – Rechenfakt, kein Countdown.
 * mobilZu: mobil eingeklappt (Kopfzeile als Knopf), am Desktop immer offen.
 * eigen: Das Pult weicht vom Rechenbeispiel ab – das Ergebnis gilt dann für Ihre Annahmen.
 */
export function Warte({ monate, jahr, onWert, hervor = false, mobilZu = false, onOeffnen, eigen = false }) {
  const live = Boolean(onWert);
  const entgeht = (monate * jahr) / 12;
  const text = monate === 0 ? "Heute entschieden: Es entgeht kein Überschuss." : `≈ ${euro10(entgeht)} € Überschuss entgehen (${eigen ? "mit Ihren Annahmen" : "Rechenbeispiel"})`;
  const kopfKlasse = "flex min-h-11 w-full items-center justify-between gap-3 text-left text-[14px] font-semibold text-ink-800 md:hidden";
  const plus = (
    <span aria-hidden="true" className="text-[18px] text-ov-700">
      +
    </span>
  );
  return (
    <section
      aria-labelledby="k7-warte-titel"
      className={cn("rounded-3xl transition-colors duration-300", mobilZu ? "px-4 py-1.5 md:p-5" : "p-4 md:p-5 lg:px-6", hervor ? "bg-ov-50" : "bg-ink-50")}
    >
      {mobilZu &&
        (live ? (
          <button type="button" onClick={onOeffnen} aria-expanded={false} aria-controls="k7-warte-koerper" className={kopfKlasse}>
            Was kostet es, später zu entscheiden?
            {plus}
          </button>
        ) : (
          <span className={kopfKlasse}>
            Was kostet es, später zu entscheiden?
            {plus}
          </span>
        ))}
      <div id="k7-warte-koerper" className={cn("lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-x-10", mobilZu && "max-md:hidden")}>
        <div className="min-w-0">
          <h3 id="k7-warte-titel" className="text-[14px] font-semibold leading-snug text-ink-800">
            {live ? <label htmlFor="k7-warte">Wir entscheiden in </label> : "Wir entscheiden in "}
            <span className="ov-num font-display text-[17px] font-extrabold text-ink-900">{monate}</span> {monate === 1 ? "Monat" : "Monaten"}
          </h3>
          <div className="mt-2">
            <MonatsLeiste
              id="k7-warte"
              monate={monate}
              max={GRENZEN.warte.max}
              onWert={onWert}
              valuetext={monate === 0 ? "heute" : `${monate} Monate: rund ${euro10(entgeht)} Euro Überschuss entgehen`}
              testid="regler-warten"
            />
          </div>
        </div>
        <div className="min-w-0">
          {live ? (
            <output htmlFor="k7-warte" data-testid="warte-ergebnis" className="ov-num mt-5 block font-display text-[15.5px] font-bold leading-snug text-ink-900 lg:mt-0">
              {text}
            </output>
          ) : (
            <p className="ov-num mt-5 font-display text-[15.5px] font-bold leading-snug text-ink-900 lg:mt-0">{text}</p>
          )}
          <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Jahresüberschuss ÷ 12 × Monate – ohne Annahme zur Projektdauer.</p>
        </div>
      </div>
    </section>
  );
}
// ---------------------------------------------------------------------------------------------------
// Fächer: Rahmen, Lesespalte, Tabelle
// ---------------------------------------------------------------------------------------------------

/** Unterzeile: womit das Stundenmodell rechnet. */
export function modellUnterzeile(mod, info) {
  return `Stundenmodell: ${zahl(mod.kwp)} kWp · ${info.ortName}, ${info.dachart} (${zahl(mod.spezifischerErtrag)} kWh/kWp) · ${zahl(Math.round(info.verbrauchKwh / 1000))} MWh Verbrauch, ${info.schichten} ${info.schichten === 1 ? "Schicht" : "Schichten"}`;
}

const LAUF_NAMEN = { konservativ: "Konservativ", erwartet: "Erwartet", guenstig: "Günstig" };
const LAUF_KURZ = { konservativ: "k", erwartet: "e", guenstig: "g" };

/**
 * Satz des Stresstests (stresstestSatz, Gewerbe-PV-Rechner) für den offen synthetischen Beispielbetrieb:
 * Konjunktiv und „im Beispiel“ statt „Ihre Amortisation“ – sonst klänge das Modell wie ein persönliches
 * Ergebnis. Mit eigenem Lastgang bleibt der Wortlaut der Bibliothek. Unbekannter Wortlaut bleibt unverändert.
 */
export function satzImBeispiel(text, beispiel = true) {
  if (!beispiel || !/liegt Ihr(e)? (Amortisation|Überschuss)/.test(text)) return text;
  return text
    .replace("fällt und die Sonne", "fiele und die Sonne")
    .replace("weniger liefert,", "weniger lieferte,")
    .replace("liegt Ihre Amortisation bei", "läge die Amortisation im Beispiel bei")
    .replace("liegt Ihr Überschuss nach", "läge der Überschuss im Beispiel nach");
}

/** Lesespalte: abgelesenes Jahr, drei Läufe, Satz, Break-even, Abweichung. beispiel = synthetischer Betrieb. */
export function Lesespalte({ mod, jahr, Wert = WertStatisch, erkenntnis, live = false, beispiel = true }) {
  const j = jahr ?? 25;
  const reihen = ["guenstig", "erwartet", "konservativ"];
  const Aus = live ? "output" : "div";
  return (
    <div className="min-w-0">
      <Aus {...(live ? { "aria-live": "off", "data-testid": "faecher-ablesung" } : {})} className="block rounded-3xl bg-sand-100/70 p-5">
        <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">
          Kumuliert nach <span className="ov-num">{j}</span> {j === 1 ? "Jahr" : "Jahren"}
        </span>
        <span className="mt-3 block space-y-2.5">
          {reihen.map((id) => {
            const v = mod.reihen[LAUF_KURZ[id]][j];
            const a = mod.amort[LAUF_KURZ[id]];
            const e = id === "erwartet";
            return (
              <span key={id} className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-2 text-[13.5px] font-semibold text-ink-700">
                  <span aria-hidden="true" className={cn("inline-block h-[3px] w-4 rounded-full", e ? "bg-ov-600" : "bg-ov-300")} />
                  {LAUF_NAMEN[id]}
                  <span className="ov-num text-[12px] font-normal text-ink-500">{a != null ? `· ${jahre1(a)} J.` : "· > 25 J."}</span>
                </span>
                <span className={cn("ov-num font-display font-extrabold tracking-[-0.01em]", e ? "text-[19px] text-ov-700" : "text-[16px] text-ink-900")}>
                  <Wert wert={v} format={(x) => `${x < 0 ? "−" : ""}${tsd(Math.abs(x))} Tsd. €`} />
                </span>
              </span>
            );
          })}
        </span>
      </Aus>
      <p className="mt-5 font-display text-[16px] font-bold leading-snug text-ink-900 md:text-[17px]" data-testid={live ? "faecher-satz" : undefined}>
        {satzImBeispiel(mod.st.satz.text, beispiel).replace(/(\d) %/g, "$1 %")}
      </p>
      <p className="mt-3 text-[14px] leading-snug text-ink-700">
        <strong className="font-semibold text-ink-900">{mod.st.breakEven.frage}</strong> {mod.st.breakEven.antwort.replace(/(\d) (ct|%)/g, "$1 $2")}
      </p>
      {erkenntnis}
    </div>
  );
}

/** Tabelle der drei Läufe (Textalternative zum Fächer). */
export function FaecherTabelle({ mod }) {
  const jahre = [0, 5, 10, 15, 20, 25];
  const fmt = (v) => `${v < 0 ? "−" : ""}${zahl(Math.round(Math.abs(v) / 1000) * 1000)} €`;
  const irr = (x) => (x == null || !Number.isFinite(x) ? "–" : x < 0 ? "< 0 %" : `ca. ${Math.round(x * 100)} %`);
  const l = Object.fromEntries(mod.laeufe.map((x) => [x.id, x]));
  return (
    <details className="group mt-4 rounded-2xl bg-ink-50">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 text-[13.5px] font-semibold text-ink-800 hover:bg-ink-100 [&::-webkit-details-marker]:hidden">
        Fächer als Tabelle
        <span aria-hidden="true" className="text-ov-700 transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full min-w-[420px] border-collapse text-left text-[13px] text-ink-700">
          <caption className="mb-2 text-left text-[12.5px] font-semibold text-ink-600">Kumulierter Cashflow (netto, vor Steuern) – drei Fälle über 25 Jahre</caption>
          <thead>
            <tr>
              <th scope="col" className="py-1.5 pr-3 font-semibold text-ink-900">
                Jahr
              </th>
              <th scope="col" className="py-1.5 pr-3 text-right font-semibold text-ink-900">
                Konservativ
              </th>
              <th scope="col" className="py-1.5 pr-3 text-right font-semibold text-ink-900">
                Erwartet
              </th>
              <th scope="col" className="py-1.5 text-right font-semibold text-ink-900">
                Günstig
              </th>
            </tr>
          </thead>
          <tbody>
            {jahre.map((j) => (
              <tr key={j} className="border-t border-ink-900/[0.07]">
                <th scope="row" className="ov-num py-1.5 pr-3 font-medium">
                  {j}
                </th>
                <td className="ov-num py-1.5 pr-3 text-right">{fmt(mod.reihen.k[j])}</td>
                <td className="ov-num py-1.5 pr-3 text-right font-semibold text-ink-900">{fmt(mod.reihen.e[j])}</td>
                <td className="ov-num py-1.5 text-right">{fmt(mod.reihen.g[j])}</td>
              </tr>
            ))}
            <tr className="border-t border-ink-900/20">
              <th scope="row" className="py-1.5 pr-3 font-medium">
                Amortisation
              </th>
              <td className="ov-num py-1.5 pr-3 text-right">{l.konservativ?.amortisation != null ? `${jahre1(l.konservativ.amortisation)} J.` : "> 25 J."}</td>
              <td className="ov-num py-1.5 pr-3 text-right font-semibold text-ink-900">{l.erwartet?.amortisation != null ? `${jahre1(l.erwartet.amortisation)} J.` : "> 25 J."}</td>
              <td className="ov-num py-1.5 text-right">{l.guenstig?.amortisation != null ? `${jahre1(l.guenstig.amortisation)} J.` : "> 25 J."}</td>
            </tr>
            <tr className="border-t border-ink-900/[0.07]">
              <th scope="row" className="py-1.5 pr-3 font-medium">
                Rendite (IRR)
              </th>
              <td className="ov-num py-1.5 pr-3 text-right">{irr(l.konservativ?.irr)}</td>
              <td className="ov-num py-1.5 pr-3 text-right font-semibold text-ink-900">{irr(l.erwartet?.irr)}</td>
              <td className="ov-num py-1.5 text-right">{irr(l.guenstig?.irr)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  );
}

/**
 * Rahmen des Fächer-Bereichs. grafik = SVG-Bereich (feste Seitenverhältnisse), leiste = Ableseregler,
 * lese = Lesespalte, unten = Tabelle/Annahmen.
 */
export function FaecherBereich({ unterzeile, grafik, leiste, lese, unten, annahmen }) {
  return (
    <section id="k7-faecher" aria-labelledby="k7-faecher-titel" className="scroll-mt-28 md:mt-20 md:border-t md:border-ink-900/[0.08] md:pt-14">
      {/* Mobil: Grafik → Ablesung/Sätze → Annahmen; ab lg links Grafik + Annahmen, rechts die Lesespalte */}
      <figure
        className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,352px)] lg:grid-rows-[auto_1fr] lg:items-start xl:gap-x-16"
        data-testid="faecher"
      >
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <h3 id="k7-faecher-titel" className="ov-h3 text-ink-900">
            Der Stresstest: 25 Jahre, drei Fälle
          </h3>
          <p className="mt-1.5 max-w-[68ch] text-[13.5px] leading-snug text-ink-600">{unterzeile}</p>
          <div className="mt-5">{grafik}</div>
          {leiste}
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">{lese}</div>
        <figcaption className="min-w-0 space-y-2 lg:col-start-1 lg:row-start-2">
          <p className="max-w-[68ch] text-[12.5px] leading-snug text-ink-500">{annahmen}</p>
          <p className="max-w-[68ch] text-[12.5px] leading-snug text-ink-500">{SATZ_ABWEICHUNG}</p>
          <QuellePille>Modell: Gewerbe-PV-Rechner · PVGIS · Marktstatistik-Richtwert · {STAND.werte} · Richtwert</QuellePille>
          {unten}
        </figcaption>
      </figure>
    </section>
  );
}

/** Annahmen-Zeile unter dem Fächer. */
export function faecherAnnahmen(ma) {
  return `Konservativ: Strompreis und Einspeiseerlös −30 %, Ertrag −10 %, keine Preissteigerung. Erwartet: Preissteigerung ${zahl(ma.preissteigerung * 100)} % pro Jahr, Modulalterung ${zahl(ma.degradation * 100, 1)} % pro Jahr, Betriebskosten +${zahl(ma.betriebskostenSteigerung * 100)} % pro Jahr. Günstig: Preissteigerung +1 Prozentpunkt. Kauf, vor Steuern, IFB-Steuerwirkung im ersten Jahr.`;
}

// ---------------------------------------------------------------------------------------------------
// Entscheider-Mappe
// ---------------------------------------------------------------------------------------------------

/** Text links, RechnerTeilen (Bühne) bzw. gleich hoher Platzhalter (Server) rechts. */
export function MappeRahmen({ kinder }) {
  return (
    <section aria-labelledby="k7-mappe-titel" className="mt-8 grid gap-4 rounded-3xl bg-sand-100/70 p-4 md:mt-14 md:gap-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
      <div>
        <h3 id="k7-mappe-titel" className="font-display text-[17px] font-bold leading-snug text-ink-900 md:text-[19px]">
          Entscheider-Mappe für Geschäftsführung, Finanzen und Bank
        </h3>
        <p className="mt-1.5 text-[13.5px] leading-snug text-ink-600 md:text-[14px]">
          Rechenweg, Stresstest und je ein Kapitel pro Rolle – als PDF.<span className="max-md:hidden"> Am Bildschirm bleibt alles frei; PDF, Link und Teilen nach bestätigter E-Mail.</span>
        </p>
      </div>
      <div data-testid="mappe" className="min-w-0">
        {kinder}
      </div>
    </section>
  );
}

/** Platzhalter in Größe und Aufbau von RechnerTeilen (Server, bis die Bühne lädt). */
export function MappePlatzhalter() {
  const knopf = "inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold";
  return (
    <div aria-hidden="true" className="rounded-2xl bg-white ring-1 ring-ink-200/70">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 p-2 pl-4">
        <p className="order-1 flex min-w-0 items-center gap-2 text-[14px] font-semibold text-ink-800">
          <Share2 aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
          <span>Ergebnis teilen</span>
        </p>
        <div className="order-3 grid w-full grid-cols-2 gap-1.5 sm:order-2 sm:ml-auto sm:flex sm:w-auto sm:items-center">
          <span className={cn(knopf, "bg-ink-100 text-ink-800")}>
            <Lock aria-hidden="true" className="h-4 w-4" />
            Link kopieren
          </span>
          <span className={cn(knopf, "bg-navy-950 text-white")}>
            <Lock aria-hidden="true" className="h-4 w-4" />
            <span>
              Als PDF<span className="hidden sm:inline"> für Geschäftsführung/Bank</span>
            </span>
          </span>
        </div>
        <span className={cn(knopf, "order-2 ml-auto px-3 text-ov-700 sm:order-3 sm:ml-0")}>
          Mehr
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <p className="border-t border-ink-100 px-4 py-2 text-[12.5px] leading-snug text-ink-500">
        Link mit Ihren Eingaben, ohne persönliche Daten – Freischaltung einmalig mit Name und E-Mail.
      </p>
    </div>
  );
}

/** Link-Stil für Fließtext im Kapitel. */
export const LINK = "font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900";
