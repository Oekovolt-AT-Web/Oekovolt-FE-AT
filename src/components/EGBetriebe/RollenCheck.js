"use client";

import { useMemo, useState } from "react";
import { Building2, Calculator, Check, CircleHelp, Factory, Landmark, Minus, TriangleAlert, X } from "lucide-react";

import { Auswahl, Regler } from "@/components/Rechner/bausteine";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { AKTEURE, LEISTUNGSSTUFEN, NAHEBEREICHE, ROLLEN, EGB_STAND, teilnahmeCheck } from "@/lib/egBetriebe";
import { zahlText } from "@/data/kennzahlen";

const STATUS = {
  ja: { label: "möglich", icon: Check, klasse: "bg-ov-50 text-ov-800 ring-ov-200", punkt: "bg-ov-500 text-white" },
  bedingt: { label: "mit Auflage", icon: TriangleAlert, klasse: "bg-sun-300/25 text-ink-800 ring-sun-400/50", punkt: "bg-sun-400 text-navy-950" },
  pruefen: { label: "im Einzelfall prüfen", icon: CircleHelp, klasse: "bg-navy-50 text-navy-800 ring-navy-100", punkt: "bg-navy-700 text-white" },
  nein: { label: "nicht möglich", icon: X, klasse: "bg-ink-50 text-ink-500 ring-ink-200", punkt: "bg-ink-300 text-white" },
};

const AKTEUR_ICON = { kmu: Factory, gross: Building2, gemeinde: Landmark };
const KURZ = { eeg: "EEG", beg: "BEG", p2p: "P2P", gea: "GEA" };

/**
 * Interaktiver Teilnahme-Check: Wer darf in welches Modell, welcher Netzentgeltvorteil,
 * welche Pflichten? Logik in src/lib/egBetriebe.js (per Node getestet).
 */
export default function RollenCheck() {
  const [akteur, setAkteur] = useState("kmu");
  const [rolle, setRolle] = useState("erzeuger");
  const [nahebereich, setNahebereich] = useState("lokal");
  const [stufe, setStufe] = useState(4); // 150 kW

  const leistungKw = LEISTUNGSSTUFEN[stufe];
  const r = useMemo(() => teilnahmeCheck({ akteur, rolle, nahebereich, leistungKw }), [akteur, rolle, nahebereich, leistungKw]);
  const AkteurIcon = AKTEUR_ICON[akteur];
  const moeglich = r.modelle.filter((m) => m.status !== "nein").map((m) => KURZ[m.id]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
      {/* Eingaben */}
      <form className="space-y-7 self-start rounded-[2rem] lg:sticky lg:top-28 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(21,26,36,0.35)] ring-1 ring-ink-200/70 md:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Angaben zum Teilnahme-Check">
        <Auswahl legende="Wer sind Sie?" optionen={AKTEURE} wert={akteur} onChange={setAkteur} />
        <Auswahl legende="Welche Rolle planen Sie?" optionen={ROLLEN} wert={rolle} onChange={setRolle} />
        <Auswahl legende="Wo sitzen die Partner?" optionen={NAHEBEREICHE} wert={nahebereich} onChange={setNahebereich} spalten={2} klein />
        {rolle !== "abnehmer" ? (
          <Regler
            label="Eingebrachte Anlagenleistung"
            wert={stufe}
            min={0}
            max={LEISTUNGSSTUFEN.length - 1}
            onChange={setStufe}
            format={(i) => `${zahlText(LEISTUNGSSTUFEN[i])} kW`}
            hinweis="Engpassleistung aller Anlagen, die Sie in die gemeinsame Nutzung einbringen."
          />
        ) : (
          <p className="rounded-2xl bg-sand-50 px-4 py-3 text-[14px] leading-relaxed text-ink-600 ring-1 ring-ink-200/60">
            Als reiner Abnehmer bringen Sie keine Anlage ein – Leistungsgrenzen und Lieferantenpflichten betreffen Sie nicht.
          </p>
        )}
        <p className="text-[12.5px] leading-relaxed text-ink-500">
          Orientierung nach Rechtsstand {EGB_STAND}, keine Rechtsberatung. Den Nahebereich Ihrer Zählpunkte bestätigt der Netzbetreiber.
        </p>
      </form>

      {/* Ergebnis */}
      <div className="min-w-0 space-y-5">
        <div className="ov-noise relative overflow-hidden rounded-[2rem] bg-navy-950 p-6 text-white md:p-8" aria-live="polite">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-ov-500/30 blur-[90px]" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500/20 text-ov-300 ring-1 ring-ov-400/30">
              <AkteurIcon aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Zuerst prüfen: {KURZ[r.empfehlung.modell]}</p>
              <p className="mt-2 text-[16px] leading-relaxed text-white/85">{r.empfehlung.text}</p>
              <p className="mt-3 text-[13px] text-white/55">Grundsätzlich möglich: {moeglich.join(", ") || "–"}</p>
            </div>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {r.modelle.map((m) => {
            const s = STATUS[m.status];
            return (
              <li key={m.id} className={cn("flex flex-col rounded-3xl p-5 ring-1 transition-colors duration-300", m.status === "nein" ? "bg-white/60 ring-ink-200/70" : "bg-white ring-ink-200")}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className={cn("font-display text-[16.5px] font-bold leading-snug", m.status === "nein" ? "text-ink-500" : "text-ink-900")}>{m.name}</h3>
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", s.punkt)} aria-hidden="true">
                    <s.icon className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </div>
                <p className={cn("mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1", s.klasse)}>{s.label}</p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-600">{m.text}</p>
                {m.status !== "nein" && (
                  <dl className="mt-auto space-y-1 border-t border-ink-100 pt-3 text-[12.5px] leading-snug text-ink-500">
                    <div className="flex gap-2">
                      <dt className="sr-only">Netzentgelt 2026</dt>
                      <Minus aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ov-600" />
                      <dd>{m.netz.bis2026}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="sr-only">Netzentgelt ab 2027</dt>
                      <Minus aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ov-600" />
                      <dd>{m.netz.ab2027}</dd>
                    </div>
                  </dl>
                )}
              </li>
            );
          })}
        </ul>

        <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-200 md:p-6">
          <h3 className="font-display text-[16.5px] font-bold text-ink-900">Was für Sie gilt</h3>
          <ul className="mt-3 space-y-3">
            {r.pflichten.map((p) => (
              <li key={p.id} className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                <p className="text-[14px] leading-relaxed text-ink-600">
                  <strong className="font-semibold text-ink-900">{p.titel}:</strong> {p.text}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-snug text-ink-500">Beispielszenario mit Partnern im Rechner öffnen – alle Annahmen dort änderbar.</p>
            <Button href={r.rechnerLink} variant="navy" size="md" icon={Calculator} className="shrink-0">
              Im Rechner durchspielen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
