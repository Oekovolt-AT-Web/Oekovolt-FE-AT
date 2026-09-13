"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BadgeEuro, Banknote, BatteryCharging, Building2, Check, CircleAlert, Copy,
  Factory, Hammer, Home, Info, MapPin, Percent, PlugZap, RotateCcw, Sun, Thermometer, Zap,
} from "lucide-react";
import { ANTRAG, ARTEN, ROLLEN, STAND, VORHABEN, ermittleProgramme, landFuerPlz, regionFuerPlz } from "./programme";

/**
 * Förder-Check-Wizard: Bundesland → Vorhaben → Eigentümerrolle → passende Programme.
 * Ergebnis als teilbarer Link (?land=…&v=pv,speicher&r=eigen).
 * laender: Ausgabe von laenderFuerCheck() (serverseitig vorbereitet).
 */

const VORHABEN_ICON = { pv: Sun, speicher: BatteryCharging, wallbox: PlugZap, waermepumpe: Thermometer, sanierung: Hammer };
const ROLLEN_ICON = { eigen: Home, vermieter: Building2, gewerbe: Factory };
const ART_ICON = { zuschuss: BadgeEuro, kredit: Banknote, steuer: Percent, verguetung: Sun, entlastung: Zap, beratung: Info };
const ART_TON = {
  zuschuss: "bg-ov-500 text-white",
  kredit: "bg-navy-600 text-white",
  steuer: "bg-ov-100 text-ov-800",
  verguetung: "bg-sun-300 text-ink-900",
  entlastung: "bg-navy-100 text-navy-800",
  beratung: "bg-ink-100 text-ink-700",
};
const VORHABEN_LABEL = Object.fromEntries(VORHABEN.map((v) => [v.id, v.label]));

const SCHRITTE = ["Standort", "Vorhaben", "Eigentümer"];

export default function FoerderWizard({ laender = [] }) {
  const [schritt, setSchritt] = useState(0);
  const [land, setLand] = useState(null);
  const [plz, setPlz] = useState("");
  const [vorhaben, setVorhaben] = useState([]);
  const [rolle, setRolle] = useState(null);
  const [kopiert, setKopiert] = useState(false);
  const kopfRef = useRef(null);
  const ersterRender = useRef(true);

  const nachKey = useMemo(() => Object.fromEntries(laender.map((l) => [l.key, l])), [laender]);

  // Zustand aus der URL übernehmen (teilbare Ergebnisse, Links von Landesseiten)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const l = q.get("land");
    const v = (q.get("v") || "").split(",").filter((x) => VORHABEN_LABEL[x]);
    const r = q.get("r");
    const p = q.get("plz");
    if (p && /^\d{5}$/.test(p)) setPlz(p);
    if (l && nachKey[l]) {
      setLand(l);
      if (v.length) setVorhaben(v);
      if (v.length && ROLLEN_ICON[r]) {
        setRolle(r);
        setSchritt(3);
      } else {
        setSchritt(v.length ? 2 : 1);
      }
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
    const q = new URLSearchParams({ land, v: vorhaben.join(","), r: rolle });
    if (plz) q.set("plz", plz);
    window.history.replaceState(null, "", `${window.location.pathname}?${q.toString()}`);
  }, [schritt, land, vorhaben, rolle, plz]);

  function plzEingabe(wert) {
    const sauber = wert.replace(/\D/g, "").slice(0, 5);
    setPlz(sauber);
    const vorschlag = landFuerPlz(sauber);
    if (vorschlag) setLand(vorschlag);
  }

  const region = regionFuerPlz(plz);
  const plzLand = landFuerPlz(plz);
  const weiterOk = [Boolean(land), vorhaben.length > 0, Boolean(rolle)][schritt];
  const aktivesLand = nachKey[land];

  const ergebnis = useMemo(
    () => (schritt === 3 && aktivesLand ? ermittleProgramme({ land: aktivesLand, vorhaben, rolle }) : null),
    [schritt, aktivesLand, vorhaben, rolle]
  );

  function neuStarten() {
    setSchritt(0);
    setVorhaben([]);
    setRolle(null);
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
                <button
                  type="button"
                  disabled={i > schritt || (i === 3 && schritt !== 3)}
                  onClick={() => setSchritt(i)}
                  className="flex min-w-0 items-center gap-2 rounded-full text-left disabled:cursor-default"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${fertig ? "bg-ov-500 text-white" : aktiv ? "bg-navy-950 text-white" : "bg-white text-ink-400 ring-1 ring-ink-200"}`}
                  >
                    {fertig ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`hidden truncate text-[14px] font-semibold sm:block ${aktiv ? "text-ink-900" : fertig ? "text-ink-700" : "text-ink-400"}`}>{s}</span>
                </button>
                {i < 3 && <span aria-hidden="true" className={`h-px flex-1 ${fertig ? "bg-ov-400" : "bg-ink-200"}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="p-5 sm:p-8 md:p-10">
        {/* Schritt 1: Standort */}
        {schritt === 0 && (
          <fieldset>
            <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold tracking-tight text-ink-900">Wo steht das Gebäude?</legend>
            <p className="mt-2 text-[15.5px] text-ink-600">Postleitzahl eingeben oder Bundesland wählen.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block sm:w-60">
                <span className="sr-only">Postleitzahl (optional)</span>
                <MapPin aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="PLZ (optional)"
                  value={plz}
                  onChange={(e) => plzEingabe(e.target.value)}
                  className="ov-num h-13 w-full rounded-full bg-sand-50 pl-11 pr-4 text-[16px] font-semibold text-ink-900 ring-1 ring-ink-200 placeholder:font-normal placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500"
                />
              </label>
              <p className="text-[13.5px] leading-snug text-ink-500" aria-live="polite">
                {plz.length === 5 && plzLand && `PLZ ${plz} liegt meist in ${nachKey[plzLand]?.name} – bitte unten prüfen.`}
                {plz.length === 5 && !plzLand && "Diese Postleitzahl kennen wir nicht – bitte Bundesland wählen."}
                {plz.length < 5 && "Die PLZ dient nur der Vorauswahl und wird nicht gespeichert."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {laender.map((l) => {
                const an = land === l.key;
                return (
                  <label
                    key={l.key}
                    className={`flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-ov-500 ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white hover:ring-ink-300"}`}
                  >
                    <input type="radio" name="land" value={l.key} checked={an} onChange={() => setLand(l.key)} className="sr-only" />
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-[12px] font-extrabold ${an ? "bg-ov-500 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200"}`}>{l.kuerzel}</span>
                    <span className={`text-[14px] font-semibold leading-tight ${an ? "text-ov-800" : "text-ink-800"}`}>{l.name}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Schritt 2: Vorhaben */}
        {schritt === 1 && (
          <fieldset>
            <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold tracking-tight text-ink-900">Was planen Sie?</legend>
            <p className="mt-2 text-[15.5px] text-ink-600">Mehrfachauswahl möglich – Kombinationen werden gemeinsam geprüft.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {VORHABEN.map((v) => {
                const an = vorhaben.includes(v.id);
                const Icon = VORHABEN_ICON[v.id];
                return (
                  <label
                    key={v.id}
                    className={`relative flex cursor-pointer items-center gap-4 rounded-3xl p-4 transition-all focus-within:ring-2 focus-within:ring-ov-500 sm:p-5 lg:flex-col lg:items-start lg:gap-5 ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white hover:ring-ink-300"}`}
                  >
                    <input
                      type="checkbox"
                      checked={an}
                      onChange={() => setVorhaben((alt) => (alt.includes(v.id) ? alt.filter((x) => x !== v.id) : [...alt, v.id]))}
                      className="sr-only"
                    />
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${an ? "bg-ov-500 text-white" : "bg-white text-ov-600 ring-1 ring-ink-200"}`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
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

        {/* Schritt 3: Rolle */}
        {schritt === 2 && (
          <fieldset>
            <legend className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold tracking-tight text-ink-900">Wer investiert?</legend>
            <p className="mt-2 text-[15.5px] text-ink-600">Viele Boni gelten nur für selbst genutztes Wohneigentum.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {ROLLEN.map((r) => {
                const an = rolle === r.id;
                const Icon = ROLLEN_ICON[r.id];
                return (
                  <label
                    key={r.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-3xl p-5 transition-all focus-within:ring-2 focus-within:ring-ov-500 ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white hover:ring-ink-300"}`}
                  >
                    <input type="radio" name="rolle" value={r.id} checked={an} onChange={() => setRolle(r.id)} className="sr-only" />
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${an ? "bg-ov-500 text-white" : "bg-white text-ov-600 ring-1 ring-ink-200"}`}>
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="block font-display text-[17px] font-bold leading-snug text-ink-900">{r.label}</span>
                      <span className="block text-[13.5px] leading-snug text-ink-500">{r.text}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Navigation */}
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
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-500 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-600 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500 disabled:shadow-none"
            >
              {schritt === 2 ? "Förderung anzeigen" : "Weiter"}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* Ergebnis */}
        {schritt === 3 && ergebnis && (
          <Ergebnis
            ergebnis={ergebnis}
            land={aktivesLand}
            vorhaben={vorhaben}
            rolle={rolle}
            region={region}
            onNeu={neuStarten}
            onKopieren={linkKopieren}
            kopiert={kopiert}
            onAendern={setSchritt}
          />
        )}
      </div>
    </div>
  );
}

function Ergebnis({ ergebnis, land, vorhaben, rolle, region, onNeu, onKopieren, kopiert, onAendern }) {
  const gesamt = ergebnis.bund.length + ergebnis.land.length + ergebnis.kommunal.length;
  const vorher = [...ergebnis.bund, ...ergebnis.land, ...ergebnis.kommunal].filter((p) => p.antrag === "vorher").length;
  const rollenLabel = ROLLEN.find((r) => r.id === rolle)?.label;

  const gruppen = [
    { id: "zuschuesse", titel: "Zuschüsse & Kredite des Bundes", items: ergebnis.bund.filter((p) => ["zuschuss", "kredit"].includes(p.art)) },
    { id: "steuer", titel: "Steuern, Vergütung & Entlastungen", items: ergebnis.bund.filter((p) => !["zuschuss", "kredit"].includes(p.art)) },
    { id: "land", titel: `Landesprogramm ${land.name}`, items: ergebnis.land },
    { id: "kommunal", titel: `Kommunale Programme in ${land.name}`, items: ergebnis.kommunal },
  ].filter((g) => g.items.length);

  return (
    <div>
      {/* Zusammenfassung */}
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
              {[land.name, ...vorhaben.map((v) => VORHABEN_LABEL[v]), rollenLabel].map((c, i) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => onAendern(i === 0 ? 0 : i === vorhaben.length + 1 ? 2 : 1)}
                    className="ov-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white/90 hover:bg-white/15"
                    aria-label={`${c} ändern`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href="/angebot" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] hover:bg-ov-600">
              <span className="sm:hidden">Angebot anfragen</span>
              <span className="hidden sm:inline">Angebot mit Förderprüfung</span>
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
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sun-400" />
            <span><strong className="text-white">{vorher} Programm{vorher === 1 ? "" : "e"}</strong> müssen Sie beantragen, <strong className="text-white">bevor</strong> Sie einen Liefer- oder Montagevertrag unterschreiben.</span>
          </p>
        )}
      </div>

      {region && (
        <Link href={`/forderungen/landesforderungen/${region.slug}`} className="group mt-4 flex items-center justify-between gap-4 rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-200 hover:bg-ov-100/60">
          <span className="flex items-center gap-3">
            <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600" />
            <span className="text-[15px] text-ink-700">
              <strong className="text-ink-900">Regionale Förderseite für {region.name}</strong> – aufbereitet von unserem Fachbetrieb in Türkheim.
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-700 transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      {/* Programmgruppen */}
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
              {land.kurz} {land.programm && !land.programm.zielgruppen.includes(rolle) ? `Das Landesprogramm „${land.programm.name}“ richtet sich an eine andere Zielgruppe.` : ""}
            </p>
            <Link href={`/forderungen/landesforderungen/${land.slug}`} className="group mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              Förderlage in {land.name} ansehen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {(ergebnis.hinweise.length > 0 || ergebnis.ohneLandesdaten.length > 0) && (
          <div className="grid gap-3 md:grid-cols-2">
            {ergebnis.hinweise.map((h) => (
              <p key={h} className="flex gap-3 rounded-3xl bg-sun-300/20 p-5 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-sun-400/40">
                <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" />
                {h}
              </p>
            ))}
            {ergebnis.ohneLandesdaten.length > 0 && (
              <p className="flex gap-3 rounded-3xl bg-sand-50 p-5 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ink-200/70">
                <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
                <span>
                  Landes- und Kommunalprogramme für {ergebnis.ohneLandesdaten.map((v) => VORHABEN_LABEL[v]).join(", ")} erfassen wir nicht vollständig. Die{" "}
                  <a href="https://www.foerderdatenbank.de" target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                    Förderdatenbank des Bundes
                  </a>{" "}
                  listet sie nach Standort.
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reihenfolge */}
      <div className="mt-12 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
        <h3 className="font-display text-[20px] font-extrabold tracking-tight text-ink-900">In dieser Reihenfolge vorgehen</h3>
        <ol className="mt-6 grid gap-5 md:grid-cols-4">
          {[
            { t: "Angebot einholen", x: "Planung und Angebot sind förderunschädlich." },
            { t: "Förderung beantragen", x: "Zuschüsse und Kredite vor der Unterschrift." },
            { t: "Vertrag & Umsetzung", x: "Erst nach Antrag bzw. Zusage beauftragen." },
            { t: "Anmelden & abrechnen", x: "Netzbetreiber, Marktstammdatenregister, Verwendungsnachweis." },
          ].map((s, i) => (
            <li key={s.t} className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-[14px] font-extrabold text-ov-600 ring-1 ring-ov-200">{i + 1}</span>
              <p className="mt-3 font-semibold text-ink-900">{s.t}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{s.x}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-[13px] leading-relaxed text-ink-500">
          Orientierung ohne Gewähr, Stand {STAND.label}. Förderprogramme ändern sich häufig, Budgets sind begrenzt – maßgeblich sind die Richtlinien der Fördergeber. Wir prüfen die Förderung im Rahmen Ihres Angebots.
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
  const antrag = ANTRAG[p.antrag];
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
        <span className="font-display text-[19px] font-extrabold tracking-tight text-ov-700">{p.hoehe}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${ART_TON[p.art]}`}>{ARTEN[p.art]}</span>
        {p.nurBalkon && <span className="rounded-full bg-sun-300/40 px-2.5 py-0.5 text-[12px] font-semibold text-ink-800">nur Balkonkraftwerk</span>}
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
