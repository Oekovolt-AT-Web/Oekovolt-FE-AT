"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { BatteryCharging, CalendarClock, Gauge, Hourglass, RefreshCw, Store, Sun, Zap } from "lucide-react";
import { Kennzahl, Regler } from "@/components/Rechner/bausteine";
import { cn } from "@/components/ui/cn";
import { JETZT, QUELLEN, TARIF_JAHRE, monatName, restText, tarifAuslauf } from "./tarifRechnung";

/**
 * Tarifauslauf-Radar: Inbetriebnahmejahr und kWp → Restlaufzeit des 13-jährigen OeMAG-Tarifs
 * (ÖSG 2012) und die passenden Optionen Repowering, Speicher, Eigenverbrauch, Direktvermarktung.
 * Richtwert zur Orientierung – der Tarifvertrag selbst ist maßgeblich.
 */

const ICONS = { repowering: RefreshCw, speicher: BatteryCharging, eigenverbrauch: Zap, direktvermarktung: Store };
const LINKS = { repowering: "#vergleich", speicher: "/gewerbespeicher", eigenverbrauch: "/ratgeber/eigenverbrauch-erhoehen", direktvermarktung: "/service/direktvermarktung" };
const PASST = {
  empfohlen: { label: "Jetzt sinnvoll", klasse: "bg-ov-600 text-white" },
  moeglich: { label: "Möglich", klasse: "bg-ov-50 text-ov-700" },
  bedingt: { label: "Später", klasse: "bg-ink-100 text-ink-600" },
};
const PHASE = {
  laeuft: { label: "Tarif läuft", klasse: "bg-ov-50 text-ov-700" },
  bald: { label: "Tarifende in Sicht", klasse: "bg-sun-300/40 text-navy-950" },
  abgelaufen: { label: "Tarif abgelaufen", klasse: "bg-navy-700 text-white" },
};

const zahl = (n, s = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

export default function TarifAuslauf() {
  const [jahr, setJahr] = useState(2013);
  const [monat, setMonat] = useState(7);
  const [kwp, setKwp] = useState(50);
  const monatId = useId();

  const r = useMemo(() => tarifAuslauf({ jahr, monat, kwp }), [jahr, monat, kwp]);
  const phase = PHASE[r.phase];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
      {/* Eingaben */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Ihre Anlage</p>
        <div className="mt-6 space-y-7">
          <Regler label="Inbetriebnahme" wert={jahr} min={2004} max={JETZT.jahr} step={1} onChange={setJahr} format={(v) => String(v)} />
          <div>
            <label htmlFor={monatId} className="mb-2 block text-[14.5px] font-semibold text-ink-800">
              Monat der Inbetriebnahme <span className="font-normal text-ink-500">(optional)</span>
            </label>
            <select
              id={monatId}
              value={monat}
              onChange={(e) => setMonat(Number(e.target.value))}
              className="h-12 w-full cursor-pointer rounded-2xl bg-white px-4 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 hover:ring-ink-300 focus:ring-2 focus:ring-ov-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {monatName(i + 1)}
                </option>
              ))}
            </select>
          </div>
          <Regler label="Anlagenleistung" wert={kwp} min={5} max={1000} step={5} einheit="kWp" onChange={setKwp} />
        </div>
        <p className="mt-6 text-[13px] leading-relaxed text-ink-500">
          Rechnung: Tarifverträge nach dem Ökostromgesetz 2012 liefen für Photovoltaik {TARIF_JAHRE} Jahre ab Inbetriebnahme. Ältere Verträge (Ökostromverordnungen vor 2012) können abweichen – maßgeblich ist Ihr Vertrag mit der OeMAG.
        </p>
      </div>

      {/* Ergebnis */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex h-9 items-center rounded-full px-4 text-[13.5px] font-semibold", phase.klasse)}>{phase.label}</span>
          <span className="text-[14px] text-ink-600" aria-live="polite">
            Rechnerisches Tarifende: <strong className="text-ink-900">{monatName(r.ende.monat)} {r.ende.jahr}</strong>
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Kennzahl label="Restlaufzeit" icon={Hourglass} ton={r.phase === "abgelaufen" ? "navy" : "gruen"} zusatz={r.phase === "abgelaufen" ? "Strom geht zum OeMAG-Marktpreis oder an den Händler" : "bis zum Ende des Tarifvertrags"}>
            {restText(r.restMonate)}
          </Kennzahl>
          <Kennzahl label="Anlagenalter" icon={CalendarClock} zusatz={r.wrAlt ? "Wechselrichter im typischen Tauschalter (10–15 Jahre)" : "Wechselrichter meist noch innerhalb der Lebensdauer"}>
            {zahl(r.alterJahre, 1)} Jahre
          </Kennzahl>
          <Kennzahl label="Ertrag heute (Richtwert)" icon={Sun} zusatz="1.000 kWh/kWp abzüglich 0,5 % Alterung je Jahr – Annahme">
            {zahl(r.ertragRichtwert / 1000, 1)} MWh/a
          </Kennzahl>
          <Kennzahl label="Tarifdauer" icon={Gauge} zusatz="§ 16 ÖSG 2012, Photovoltaik">
            {TARIF_JAHRE} Jahre
          </Kennzahl>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {r.optionen.map((o) => {
            const Icon = ICONS[o.id];
            const p = PASST[o.passt];
            return (
              <li key={o.id} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className={cn("inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold", p.klasse)}>{p.label}</span>
                </div>
                <h3 className="mt-4 font-display text-[17px] font-bold text-ink-900">{o.titel}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{o.grund}</p>
                <Link href={LINKS[o.id]} className="mt-auto pt-4 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  Mehr dazu
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
          Richtwert zur Orientierung, kein Angebot. Stand {String(JETZT.monat).padStart(2, "0")}/{JETZT.jahr}. Quellen:{" "}
          {QUELLEN.map((q, i) => (
            <span key={q.href}>
              <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                {q.titel}
              </a>
              {i < QUELLEN.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
