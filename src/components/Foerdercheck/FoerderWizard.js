"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BadgeEuro, BatteryCharging, Building2, Check, CircleAlert, Copy, Fence, Home,
  Info, Landmark, Percent, PlugZap, RotateCcw, Sprout, Sun, Thermometer, Tractor, Users, Zap,
} from "lucide-react";
import { ANTRAG, ARTEN, STAND, VORHABEN, ZIELGRUPPEN, ermittleProgramme } from "./programme";

/**
 * Förder-Check Österreich: Bundesland → Zielgruppe → Vorhaben → Programme.
 * Ergebnis als teilbarer Link (?land=…&zg=…&v=pv-dach,speicher).
 * laender: Ausgabe von laenderFuerCheck() (serverseitig vorbereitet).
 */

const VORHABEN_ICON = { "pv-dach": Sun, freiflaeche: Fence, "agri-pv": Sprout, speicher: BatteryCharging, laden: PlugZap, waermepumpe: Thermometer };
const ZG_ICON = { unternehmen: Building2, landwirtschaft: Tractor, gemeinde: Landmark, privat: Home, energiegemeinschaft: Users };
const ART_ICON = { zuschuss: BadgeEuro, praemie: Sun, steuer: Percent, entlastung: Zap, beratung: Info };
const ART_TON = {
  zuschuss: "bg-ov-600 text-white",
  praemie: "bg-sun-300 text-ink-900",
  steuer: "bg-ov-100 text-ov-800",
  entlastung: "bg-navy-100 text-navy-800",
  beratung: "bg-ink-100 text-ink-700",
};
const VORHABEN_LABEL = Object.fromEntries(VORHABEN.map((v) => [v.id, v.label]));
const ZG_LABEL = Object.fromEntries(ZIELGRUPPEN.map((z) => [z.id, z.label]));

const SCHRITTE = ["Bundesland", "Wer investiert", "Vorhaben"];

export default function FoerderWizard({ laender = [] }) {
  const [schritt, setSchritt] = useState(0);
  const [land, setLand] = useState(null);
  const [zielgruppe, setZielgruppe] = useState(null);
  const [vorhaben, setVorhaben] = useState([]);
  const [kopiert, setKopiert] = useState(false);
  const kopfRef = useRef(null);
  const ersterRender = useRef(true);

  const nachKey = useMemo(() => Object.fromEntries(laender.map((l) => [l.key, l])), [laender]);

  // Zustand aus der URL übernehmen (teilbare Ergebnisse, Links von Landesseiten)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const l = q.get("land");
    const zg = q.get("zg");
    const v = (q.get("v") || "").split(",").filter((x) => VORHABEN_LABEL[x]);
    if (l && nachKey[l]) {
      setLand(l);
      if (zg && ZG_LABEL[zg]) {
        setZielgruppe(zg);
        if (v.length) {
          setVorhaben(v);
          setSchritt(3);
        } else setSchritt(2);
      } else setSchritt(1);
    }
  }, [nachKey]);

  // Beim Schrittwechsel an den Kopf des Wizards scrollen und fokussieren
  useEffect(() => {
    if (ersterRender.current) {
      ersterRender.current = false;
      return;
    }
    const el = kopfRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    if (Math.abs(window.scrollY - top) > 120) window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  }, [schritt]);

  // URL aktuell halten
  useEffect(() => {
    if (schritt !== 3) return;
    const q = new URLSearchParams({ land, zg: zielgruppe, v: vorhaben.join(",") });
    window.history.replaceState(null, "", `${window.location.pathname}?${q.toString()}`);
  }, [schritt, land, zielgruppe, vorhaben]);

  const weiterOk = [Boolean(land), Boolean(zielgruppe), vorhaben.length > 0][schritt];
  const aktivesLand = nachKey[land];

  const ergebnis = useMemo(
    () => (schritt === 3 && aktivesLand ? ermittleProgramme({ land: aktivesLand, vorhaben, zielgruppe }) : null),
    [schritt, aktivesLand, vorhaben, zielgruppe]
  );

  function neuStarten() {
    setSchritt(0);
    setZielgruppe(null);
    setVorhaben([]);
    window.history.replaceState(null, "", window.location.pathname);
  }

  async function linkKopieren() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2200);
    } catch {
      setKopiert(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-50px_rgba(3,18,43,0.55)] ring-1 ring-ink-200/70">
      {/* Fortschritt */}
      <div ref={kopfRef} tabIndex={-1} className="border-b border-ink-100 bg-sand-50/70 px-5 py-5 outline-none sm:px-8 md:px-10">
        <ol className="flex items-center gap-2 sm:gap-3" aria-label="Fortschritt">
          {[...SCHRITTE, "Ergebnis"].map((s, i) => {
            const fertig = i < schritt;
            const aktiv = i === schritt;
            return (
              <li key={s} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-current={aktiv ? "step" : undefined}>
                <button type="button" disabled={i > schritt || (i === 3 && schritt !== 3)} onClick={() => setSchritt(i)} className="flex min-w-0 items-center gap-2 rounded-full text-left disabled:cursor-default">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${fertig ? "bg-ov-600 text-white" : aktiv ? "bg-navy-950 text-white" : "bg-white text-ink-500 ring-1 ring-ink-200"}`}>
                    {fertig ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`hidden truncate text-[14px] font-semibold sm:block ${aktiv ? "text-ink-900" : fertig ? "text-ink-700" : "text-ink-500"}`}>{s}</span>
                </button>
                {i < 3 && <span aria-hidden="true" className={`h-px flex-1 ${fertig ? "bg-ov-400" : "bg-ink-200"}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="p-5 sm:p-8 md:p-10">
        {schritt === 0 && (
          <fieldset>
            <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold tracking-tight text-ink-900">Wo entsteht die Anlage?</legend>
            <p className="mt-2 text-[15.5px] text-ink-600">Bundesland des Standorts wählen – maßgeblich ist der Ort der Anlage, nicht der Firmensitz.</p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {laender.map((l) => {
                const an = land === l.key;
                return (
                  <label key={l.key} className={`flex min-h-[56px] cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-ov-500 ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white hover:ring-ink-300"}`}>
                    <input type="radio" name="land" value={l.key} checked={an} onChange={() => setLand(l.key)} className="sr-only" />
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-[12px] font-extrabold ${an ? "bg-ov-600 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200"}`}>{l.kuerzel}</span>
                    <span className={`text-[14.5px] font-semibold leading-tight ${an ? "text-ov-800" : "text-ink-800"}`}>{l.name}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {schritt === 1 && (
          <fieldset>
            <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold tracking-tight text-ink-900">Wer investiert?</legend>
            <p className="mt-2 text-[15.5px] text-ink-600">Viele Programme gelten nur für bestimmte Zielgruppen.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {ZIELGRUPPEN.map((z) => {
                const an = zielgruppe === z.id;
                const Icon = ZG_ICON[z.id];
                return (
                  <label key={z.id} className={`flex cursor-pointer items-center gap-4 rounded-3xl p-4 transition-all focus-within:ring-2 focus-within:ring-ov-500 lg:flex-col lg:items-start ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white hover:ring-ink-300"}`}>
                    <input type="radio" name="zielgruppe" value={z.id} checked={an} onChange={() => setZielgruppe(z.id)} className="sr-only" />
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${an ? "bg-ov-500 text-white" : "bg-white text-ov-600 ring-1 ring-ink-200"}`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="block font-display text-[17px] font-bold leading-snug text-ink-900">{z.label}</span>
                      <span className="block text-[13.5px] leading-snug text-ink-500">{z.text}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {schritt === 2 && (
          <fieldset>
            <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold tracking-tight text-ink-900">Was planen Sie?</legend>
            <p className="mt-2 text-[15.5px] text-ink-600">Mehrfachauswahl möglich – Kombinationen werden gemeinsam geprüft.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {VORHABEN.map((v) => {
                const an = vorhaben.includes(v.id);
                const Icon = VORHABEN_ICON[v.id];
                return (
                  <label key={v.id} className={`relative flex cursor-pointer items-center gap-4 rounded-3xl p-4 transition-all focus-within:ring-2 focus-within:ring-ov-500 sm:p-5 ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white hover:ring-ink-300"}`}>
                    <input type="checkbox" checked={an} onChange={() => setVorhaben((alt) => (alt.includes(v.id) ? alt.filter((x) => x !== v.id) : [...alt, v.id]))} className="sr-only" />
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${an ? "bg-ov-500 text-white" : "bg-white text-ov-600 ring-1 ring-ink-200"}`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 pr-6">
                      <span className="block font-display text-[17px] font-bold text-ink-900">{v.label}</span>
                      <span className="block text-[13.5px] leading-snug text-ink-500">{v.text}</span>
                    </span>
                    <span aria-hidden="true" className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full transition-all ${an ? "bg-ov-500 text-white" : "bg-white ring-1 ring-ink-300"}`}>
                      {an && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {schritt < 3 && (
          <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center">
            {schritt > 0 ? (
              <button type="button" onClick={() => setSchritt(schritt - 1)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-ink-700 hover:bg-ink-100">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Zurück
              </button>
            ) : (
              <p className="text-[13px] text-ink-500">Schritt 1 von 3 · dauert ca. 30 Sekunden</p>
            )}
            <button
              type="button"
              disabled={!weiterOk}
              onClick={() => setSchritt(schritt + 1)}
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-600 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500 disabled:shadow-none"
            >
              {schritt === 2 ? "Förderung anzeigen" : "Weiter"}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {schritt === 3 && ergebnis && (
          <Ergebnis ergebnis={ergebnis} land={aktivesLand} vorhaben={vorhaben} zielgruppe={zielgruppe} onNeu={neuStarten} onKopieren={linkKopieren} kopiert={kopiert} onAendern={setSchritt} />
        )}
      </div>
    </div>
  );
}

function Ergebnis({ ergebnis, land, vorhaben, zielgruppe, onNeu, onKopieren, kopiert, onAendern }) {
  const alle = [...ergebnis.bund, ...ergebnis.land];
  const gesamt = alle.length;
  const vorher = alle.filter((p) => ANTRAG[p.antrag]?.warn).length;

  const gruppen = [
    { id: "bund-geld", titel: "Bund: Zuschüsse und Prämien", items: ergebnis.bund.filter((p) => ["zuschuss", "praemie"].includes(p.art)) },
    { id: "bund-steuer", titel: "Steuern und Entlastungen", items: ergebnis.bund.filter((p) => !["zuschuss", "praemie"].includes(p.art)) },
    { id: "land", titel: `Landesprogramme ${land.name}`, items: ergebnis.land },
  ].filter((g) => g.items.length);

  const chips = [
    { text: land.name, schritt: 0 },
    { text: ZG_LABEL[zielgruppe], schritt: 1 },
    ...vorhaben.map((v) => ({ text: VORHABEN_LABEL[v], schritt: 2 })),
  ];

  return (
    <div>
      <div className="ov-noise relative overflow-hidden rounded-3xl bg-navy-950 p-6 text-white md:p-8">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-ov-500/30 blur-[90px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ihr Förder-Check · Stand {STAND.label}</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-extrabold leading-tight tracking-tight" aria-live="polite">
              <span className="ov-num text-ov-300">{gesamt}</span> passende Programme
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-[13px]">
              {chips.map((c) => (
                <li key={c.text}>
                  <button type="button" onClick={() => onAendern(c.schritt)} className="ov-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white/90 hover:bg-white/15" aria-label={`${c.text} ändern`}>
                    {c.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href="/angebot" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] hover:bg-ov-700">
              Projekt anfragen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button type="button" onClick={onKopieren} className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/35 hover:bg-white/10">
              {kopiert ? <Check aria-hidden="true" className="h-4 w-4 text-ov-300" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
              {kopiert ? "Link kopiert" : "Link teilen"}
            </button>
          </div>
        </div>
        {vorher > 0 && (
          <p className="relative mt-6 flex items-start gap-2.5 border-t border-white/10 pt-5 text-[14.5px] leading-relaxed text-white/75">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" />
            <span>Bei <strong className="text-white">{vorher} Programm{vorher === 1 ? "" : "en"}</strong> entscheidet der Zeitpunkt: vor Bestellung, vor Inbetriebnahme oder zu einem festen Termin.</span>
          </p>
        )}
      </div>

      <div className="mt-10 space-y-10">
        {gruppen.map((g) => (
          <section key={g.id} aria-labelledby={`gruppe-${g.id}`}>
            <h3 id={`gruppe-${g.id}`} className="flex items-center gap-3 font-display text-[20px] font-extrabold tracking-tight text-ink-900">
              {g.titel}
              <span className="ov-num rounded-full bg-ink-100 px-2 py-0.5 text-[13px] font-semibold text-ink-600">{g.items.length}</span>
            </h3>
            <ul className="mt-5 grid gap-4 lg:grid-cols-2">
              {g.items.map((p) => (
                <ProgrammKarte key={p.id} p={p} />
              ))}
            </ul>
          </section>
        ))}

        {ergebnis.land.length === 0 && (
          <div className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6">
            <p className="font-display text-[17px] font-bold text-ink-900">Landesebene {land.name}</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">
              Für diese Kombination ist zum Prüfdatum kein Landesprogramm offen. {land.kurz}
            </p>
            <Link href={`/forderungen/landesforderungen/${land.slug}`} className="group mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              Förderlage in {land.name} ansehen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {ergebnis.kombinationD && (
            <p className="flex gap-3 rounded-3xl bg-sun-300/20 p-5 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-sun-400/40">
              <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" />
              Kombination: In EAG-Kategorie A–C darf die Landesförderung zusätzlich genutzt werden, in Kategorie D (über 100 kWp) nicht. Wir rechnen beide Wege durch.
            </p>
          )}
          {ergebnis.hinweise.map((h) => (
            <p key={h} className="flex gap-3 rounded-3xl bg-sand-50 p-5 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ink-200/70">
              <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
              {h}
            </p>
          ))}
          {zielgruppe === "energiegemeinschaft" && (
            <p className="flex gap-3 rounded-3xl bg-ov-50 p-5 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ov-100">
              <Users aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              <span>
                Anlaufstelle in {land.name}:{" "}
                <a href={land.eg.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">{land.eg.stelle}</a>
              </span>
            </p>
          )}
          <p className="flex gap-3 rounded-3xl bg-sand-50 p-5 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ink-200/70">
            <Landmark aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
            {land.gemeinden}
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
        <h3 className="font-display text-[20px] font-extrabold tracking-tight text-ink-900">In dieser Reihenfolge vorgehen</h3>
        <ol className="mt-6 grid gap-5 md:grid-cols-4">
          {[
            { t: "Planen und Angebot", x: "Lastgang, Anlagengröße, Speicher – Angebot eines befugten Unternehmens." },
            { t: "Netz und Genehmigung", x: "Netzzugang beantragen, Anzeigen bzw. Bewilligungen einholen." },
            { t: "Förderanträge", x: "Land je nach Programm vor Bestellung; EAG im Call vor Inbetriebnahme." },
            { t: "Errichten und abrechnen", x: "Fertigstellungsmeldung, Inbetriebnahme, Endabrechnung in der Frist." },
          ].map((s, i) => (
            <li key={s.t}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-[14px] font-extrabold text-ov-600 ring-1 ring-ov-200">{i + 1}</span>
              <p className="mt-3 font-semibold text-ink-900">{s.t}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{s.x}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-[13px] leading-relaxed text-ink-500">
          Orientierung ohne Gewähr, Stand {STAND.label}. Förderprogramme ändern sich häufig, Budgets sind begrenzt – maßgeblich sind die Richtlinien der Förderstellen. Keine Rechts- oder Steuerberatung. Wir prüfen die Förderung im Rahmen Ihres Projekts.
        </p>
        <button type="button" onClick={onNeu} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14.5px] font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50">
          <RotateCcw aria-hidden="true" className="h-4 w-4" /> Neu starten
        </button>
      </div>
    </div>
  );
}

function ProgrammKarte({ p }) {
  const Icon = ART_ICON[p.art] || BadgeEuro;
  const antrag = ANTRAG[p.antrag] || ANTRAG.frist;
  return (
    <li className="flex flex-col rounded-3xl bg-white p-5 ring-1 ring-ink-200/80 transition-shadow hover:shadow-[0_24px_48px_-32px_rgba(3,18,43,0.45)] md:p-6">
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${ART_TON[p.art]}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-medium text-ink-500">{p.traeger}</p>
          <h4 className="font-display text-[17.5px] font-bold leading-snug text-ink-900">{p.name}</h4>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-display text-[18px] font-extrabold tracking-tight text-ov-700">{p.hoehe}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${ART_TON[p.art]}`}>{ARTEN[p.art]}</span>
      </div>

      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{p.kurz}</p>

      {p.bedingungen?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {p.bedingungen.map((b) => (
            <li key={b} className="flex gap-2 text-[13.5px] leading-snug text-ink-600">
              <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ov-500" strokeWidth={3} />
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${antrag.warn ? "bg-sun-300/40 text-ink-900" : "bg-ov-50 text-ov-800"}`}>
          {antrag.warn ? <CircleAlert aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" /> : <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />}
          {antrag.label}
        </span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {p.intern && (
            <Link href={p.intern.href} className="inline-flex min-h-[44px] items-center gap-1 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
              {p.intern.label}
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          )}
          {p.extern && (
            <a href={p.extern.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1 text-[14px] font-semibold text-navy-700 hover:text-navy-800">
              {p.extern.label}
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(externer Link, neues Fenster)</span>
            </a>
          )}
        </span>
      </div>
    </li>
  );
}
