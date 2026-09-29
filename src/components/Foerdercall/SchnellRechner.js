"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, CircleAlert, Info, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { FOERDERCALL, KATEGORIEN, SPEICHER, euro, schaetzeFoerderung } from "@/lib/foerdercall";

/**
 * Förder-Schnellrechner für den 3. EAG-Fördercall 2026: kWp + Speicher-kWh →
 * geschätzter Investitionszuschuss nach den offiziellen Sätzen
 * (Rechenkern: schaetzeFoerderung in @/lib/foerdercall).
 */

// Dezimalkomma und -punkt zulassen („8,5“ wie „8.5“)
const zahl = (s) => {
  const m = String(s).replace(/,/g, ".").match(/\d+(\.\d+)?/);
  const n = m ? Number(m[0]) : 0;
  return Number.isFinite(n) ? n : 0;
};
const anzeige = (n) => (n ? String(n).replace(".", ",") : "");

const VORLAGEN = [
  { l: "Einfamilienhaus 8 kWp + 10 kWh", kwp: 8, kwh: 10 },
  { l: "Bauernhof 30 kWp + 15 kWh", kwp: 30, kwh: 15 },
  { l: "Betrieb 80 kWp + 40 kWh", kwp: 80, kwh: 40 },
  { l: "Halle 250 kWp", kwp: 250, kwh: 0 },
];

export default function SchnellRechner() {
  const [kwpText, setKwpText] = useState("8");
  const [kwhText, setKwhText] = useState("10");
  const [gebotText, setGebotText] = useState("");
  const [kostenPvText, setKostenPvText] = useState("");
  const [kostenSpText, setKostenSpText] = useState("");
  const [vorsteuer, setVorsteuer] = useState(false);

  const kwp = Math.min(5000, zahl(kwpText));
  const kwh = Math.min(5000, zahl(kwhText));
  const e = useMemo(
    () => schaetzeFoerderung({ kwp, speicherKwh: kwh, gebot: zahl(gebotText) || null, kostenPv: zahl(kostenPvText) || null, kostenSpeicher: zahl(kostenSpText) || null }),
    [kwp, kwh, gebotText, kostenPvText, kostenSpText]
  );
  const kat = e.kategorie;
  const anfrage = `/angebot?kwp=${encodeURIComponent(kwp || "")}${kwh ? `&speicher=${encodeURIComponent(kwh)}` : ""}`;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* Eingaben */}
        <div className="space-y-7 p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Beispiele</span>
            {VORLAGEN.map((v) => (
              <button
                key={v.l}
                type="button"
                onClick={() => {
                  setKwpText(String(v.kwp));
                  setKwhText(v.kwh ? String(v.kwh) : "");
                  setGebotText("");
                }}
                className="inline-flex h-8 items-center rounded-full bg-sand-50 px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-200"
              >
                {v.l}
              </button>
            ))}
          </div>

          <Feld id="sr-kwp" icon={<Sun aria-hidden="true" className="h-4 w-4 text-sun-500" />} label="PV-Leistung (Modulspitzenleistung)" einheit="kWp" wert={kwpText} setWert={setKwpText} hilfe="Bei einer Erweiterung nur die neu dazukommende Leistung." />
          <input
            type="range"
            min={1}
            max={200}
            step={0.5}
            value={Math.min(200, Math.max(1, kwp || 1))}
            onChange={(ev) => setKwpText(anzeige(Number(ev.target.value)))}
            aria-label="PV-Leistung in kWp einstellen"
            aria-valuetext={`${(kwp || 0).toLocaleString("de-DE")} kWp`}
            className="-mt-4 w-full accent-ov-600"
          />
          {/* Kategorie-Skala */}
          <ol className="-mt-3 grid grid-cols-4 gap-1.5" aria-label="Kategorien nach Leistung">
            {KATEGORIEN.map((k) => (
              <li key={k.id} className={cn("rounded-xl px-2 py-2 text-center ring-1 transition-colors", kat?.id === k.id ? "bg-navy-950 text-white ring-navy-950" : "bg-sand-50 text-ink-600 ring-ink-200")}>
                <span className="block font-display text-[15px] font-extrabold">Kat. {k.id}</span>
                <span className={cn("block text-[11px] leading-tight", kat?.id === k.id ? "text-white/65" : "text-ink-500")}>{k.id === "D" ? "über 100 kWp" : k.leistung.replace("über ", "> ")}</span>
              </li>
            ))}
          </ol>

          <Feld
            id="sr-kwh"
            icon={<BatteryCharging aria-hidden="true" className="h-4 w-4 text-ov-600" />}
            label="Neuer Stromspeicher (nutzbare Kapazität)"
            einheit="kWh"
            wert={kwhText}
            setWert={setKwhText}
            hilfe={`Mindestens ${(e.speicher.minKwh || 0).toLocaleString("de-DE")} kWh (0,5 kWh je kWp), gefördert höchstens ${SPEICHER.maxKwh} kWh. Leer lassen ohne Speicher.`}
          />

          {kat && !kat.fix && (
            <Feld
              id="sr-gebot"
              label={`Ihr Förderbedarf (Gebot) in Kategorie ${kat.id}`}
              einheit="€/kWp"
              wert={gebotText}
              setWert={setGebotText}
              platzhalter={String(kat.satz)}
              hilfe={`Höchstens ${kat.satz} €/kWp. Gereiht wird vom niedrigsten Förderbedarf an – leer lassen rechnet mit dem Höchstsatz.`}
            />
          )}

          <details className="group rounded-2xl ring-1 ring-ink-200/70 open:bg-sand-50/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[14.5px] font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
              30-%-Deckel mit Ihren Kosten prüfen
              <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="space-y-3 px-4 pb-4">
              <div className="inline-flex rounded-full bg-ink-100 p-1" role="radiogroup" aria-label="Vorsteuerabzug">
                {[
                  { v: false, l: "Privat / ohne Vorsteuerabzug" },
                  { v: true, l: "Mit Vorsteuerabzug" },
                ].map((o) => (
                  <button key={o.l} type="button" role="radio" aria-checked={vorsteuer === o.v} onClick={() => setVorsteuer(o.v)} className={cn("inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold transition-all", vorsteuer === o.v ? "bg-white text-ink-900 shadow-sm" : "text-ink-600")}>
                    {o.l}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <KostenFeld id="sr-kpv" label={`Kosten PV (${vorsteuer ? "netto" : "brutto"})`} wert={kostenPvText} setWert={setKostenPvText} platzhalter="z. B. 14000" />
                <KostenFeld id="sr-ksp" label={`Kosten Speicher (${vorsteuer ? "netto" : "brutto"})`} wert={kostenSpText} setWert={setKostenSpText} platzhalter="optional" />
              </div>
              <p className="text-[12.5px] leading-relaxed text-ink-500">
                Laut Abwicklungsstelle zählen ohne Vorsteuerabzug die Brutto-, mit Vorsteuerabzug die Nettokosten. Nicht förderfähig sind u. a. Eigenleistungen, Dacheindeckung, Finanzierungskosten und reine Materialrechnungen ohne Montage.
              </p>
            </div>
          </details>
        </div>

        {/* Ergebnis */}
        <div className="ov-noise relative isolate flex flex-col overflow-hidden bg-navy-950 p-6 text-white sm:p-8 md:p-10" aria-live="polite">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-ov-500/30 blur-[100px]" />

          {kat ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Geschätzter Zuschuss</p>
                <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Kat.</span>
                  <span className="font-display text-[22px] font-extrabold leading-none">{kat.id}</span>
                </span>
              </div>
              <p className="ov-num -mt-2 font-display text-[clamp(2.4rem,1.8rem+2.6vw,3.6rem)] font-extrabold leading-none tracking-tight">
                {kat.fix || e.gedeckelt ? "" : "bis "}
                {euro(e.summe)}
              </p>
              <p className="mt-3 text-[14.5px] text-white/65">
                {kat.leistung} · {kat.fix ? `Fixsatz ${kat.satz} €/kWp` : `${e.satz} €/kWp (Höchstsatz ${kat.satz} €/kWp)`} · Reihung {kat.reihung}
              </p>

              <dl className="mt-7 space-y-2.5 text-[14.5px]">
                <Zeile farbe="bg-ov-500" label={`PV ${e.kwpFoerderfaehig.toLocaleString("de-DE")} kWp × ${e.satz} €/kWp`} wert={euro(e.pv)} />
                <Zeile farbe="bg-sun-400" label={e.speicher.ok ? `Speicher ${e.speicher.kwhFoerderfaehig.toLocaleString("de-DE")} kWh × ${SPEICHER.satz} €/kWh` : "Speicher"} wert={e.speicher.ok ? euro(e.speicher.betrag) : "–"} />
                <div className="border-t border-white/10 pt-2.5">
                  <Zeile farbe="bg-white" label="Summe (Schätzung)" wert={euro(e.summe)} stark />
                </div>
              </dl>

              <div className="mt-6 space-y-2.5">
                {e.hinweise.map((h) => (
                  <Warnung key={h}>{h}</Warnung>
                ))}
                {!e.gedeckelt && e.summe > 0 && (
                  <Hinweis>
                    Voller Betrag nur, wenn der Zuschuss höchstens 30 % der Investition ausmacht – also bei Kosten ab {euro(e.mindestKostenPv)} (PV){e.mindestKostenSpeicher ? ` bzw. ${euro(e.mindestKostenSpeicher)} (Speicher)` : ""}.
                  </Hinweis>
                )}
                <Hinweis>
                  Budget Kategorie {kat.id} im 3. Call: {euro(FOERDERCALL.budgetJeKategorie).replace(".000.000 €", " Mio. €")}. {kat.id === "D" ? "Keine Kombination mit Landes- oder Gemeindeförderung." : "Kombinierbar mit Landes- und Gemeindeförderung bis zu den beihilferechtlichen Grenzen."}
                </Hinweis>
              </div>
            </>
          ) : (
            <div className="my-auto">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Kein Zuschuss ohne PV</p>
              <p className="mt-3 font-display text-[26px] font-extrabold leading-tight">Geben Sie die PV-Leistung ein.</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">Ein Speicher wird nur gemeinsam mit einer neuen oder erweiterten PV-Anlage gefördert; die Erweiterung eines bestehenden Speichers ist nicht förderfähig.</p>
            </div>
          )}

          <div className="mt-auto pt-8">
            <Link href={anfrage} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700">
              Einreichung mit Ökovolt vorbereiten
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-[12px] leading-relaxed text-white/45">
              Schätzung ohne Zu- und Abschläge (Grünland −25 %, innovative PV +30 %, Made in Europe). Diese rechnet der{" "}
              <Link href="/forderungen/bundesfoerderung#rechner" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                ausführliche EAG-Rechner
              </Link>
              . Verbindlich ist allein der Fördervertrag der EAG-Förderabwicklungsstelle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feld({ id, icon, label, einheit, wert, setWert, hilfe, platzhalter }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-semibold text-ink-900">
          {icon && <span className="mr-1.5 inline-block -translate-y-px align-middle">{icon}</span>}
          {label}
        </label>
        <span className="flex shrink-0 items-baseline gap-1.5">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            value={wert}
            placeholder={platzhalter}
            onChange={(e) => setWert(e.target.value.replace(/[^\d,.]/g, "").slice(0, 7))}
            aria-describedby={hilfe ? `${id}-hilfe` : undefined}
            className="ov-num w-24 rounded-xl bg-sand-50 px-2 py-1 text-right font-display text-[22px] font-extrabold text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500"
          />
          <span className="w-12 text-[14px] font-semibold text-ink-500">{einheit}</span>
        </span>
      </div>
      {hilfe && (
        <p id={`${id}-hilfe`} className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
          {hilfe}
        </p>
      )}
    </div>
  );
}

function KostenFeld({ id, label, wert, setWert, platzhalter }) {
  return (
    <label htmlFor={id} className="block text-[13.5px] font-semibold text-ink-700">
      {label}
      <span className="mt-1.5 flex items-center rounded-xl bg-white ring-1 ring-ink-200 focus-within:ring-2 focus-within:ring-ov-500">
        <input id={id} inputMode="numeric" placeholder={platzhalter} value={wert} onChange={(e) => setWert(e.target.value.replace(/\D/g, "").slice(0, 9))} className="ov-num h-11 w-full rounded-xl bg-transparent px-3 text-[15px] font-semibold text-ink-900 focus:outline-none" />
        <span className="pr-3 text-ink-400">€</span>
      </span>
    </label>
  );
}

function Zeile({ farbe, label, wert, stark = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={cn("flex min-w-0 items-center gap-2.5", stark ? "font-semibold text-white" : "text-white/70")}>
        <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", farbe)} />
        <span className="min-w-0">{label}</span>
      </dt>
      <dd className={cn("ov-num shrink-0 font-semibold text-white", stark && "font-display text-[17px] font-extrabold")}>{wert}</dd>
    </div>
  );
}

function Warnung({ children }) {
  return (
    <p className="flex gap-2.5 rounded-2xl bg-sun-400/15 p-3 text-[13.5px] leading-relaxed text-white/85 ring-1 ring-sun-400/30">
      <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" />
      <span>{children}</span>
    </p>
  );
}

function Hinweis({ children }) {
  return (
    <p className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/65">
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
      <span>{children}</span>
    </p>
  );
}
