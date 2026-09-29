"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Mountain } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Regler, Zahl } from "@/components/Rechner/bausteine";
import { bewerteSchnee } from "@/lib/standort/berechnung";

/**
 * Schneelast-Mini: Bodenschneelast sₖ, Dachneigung und Schneefang wählen → Dachschneelast,
 * Bemessungswert je Modulfläche und Auslastung der Modulklassen 2400/5400/8100 Pa.
 * Rechenkern identisch mit dem Standort-Check (src/lib/standort/berechnung.js).
 * Für den dunklen Hintergrund gestaltet.
 */
const fmt = (n, s = 2) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

const STATUS = {
  reserve: { text: "mit Reserve", farbe: "bg-ov-400", ton: "text-ov-300" },
  knapp: { text: "knapp", farbe: "bg-sun-400", ton: "text-sun-300" },
  nein: { text: "reicht nicht", farbe: "bg-[#e0664f]", ton: "text-[#f0a090]" },
};

export default function SchneelastMini() {
  const [sk, setSk] = useState(4);
  const [neigung, setNeigung] = useState(30);
  const [schneefang, setSchneefang] = useState(true);

  const r = useMemo(() => bewerteSchnee({ sk, neigung, schneefang }), [sk, neigung, schneefang]);

  // Dachquerschnitt: Satteldach mit gewählter Neigung, Schneeschicht proportional zur Dachschneelast
  const a = (neigung * Math.PI) / 180;
  const hoehe = Math.min(Math.tan(a) * 150, 95);
  const halbe = a > 0.01 ? Math.min(150, hoehe / Math.tan(a)) : 150;
  const li = 200 - halbe, re = 200 + halbe;
  const first = { x: 200, y: 175 - hoehe };
  const schnee = Math.min(4 + (r?.s || 0) * 5, 40);
  const nx = Math.sin(a), ny = Math.cos(a);

  return (
    <div className="grid overflow-hidden rounded-[2rem] ring-1 ring-white/10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="bg-white/[0.04] p-6 md:p-9">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ov-300">Schneelast · interaktiv</p>
        <p className="mt-3 font-display text-[22px] font-light leading-snug tracking-tight text-white md:text-[26px]">Wie viel Schnee trägt Ihr Dach – und welches Modul hält ihn aus?</p>
        <div className="mt-8 space-y-7">
          <Regler dunkel label="Bodenschneelast sₖ (eHORA)" wert={sk} min={1} max={8} step={0.1} stellen={1} einheit="kN/m²" onChange={setSk} />
          <Regler dunkel label="Dachneigung" wert={neigung} min={0} max={60} step={1} einheit="°" onChange={setNeigung} />
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white/[0.05] px-4 py-3 ring-1 ring-white/10">
            <span className="text-[14.5px] font-semibold text-white">Schneefang vorhanden</span>
            <span className="relative inline-flex">
              <input type="checkbox" checked={schneefang} onChange={(e) => setSchneefang(e.target.checked)} className="peer sr-only" />
              <span className="h-7 w-12 rounded-full bg-white/15 transition-colors peer-checked:bg-ov-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ov-300" />
              <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5" />
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col bg-navy-900/60 p-6 md:p-9">
        <svg viewBox="0 0 400 200" className="h-auto w-full" role="img" aria-label={`Dachquerschnitt mit ${neigung} Grad Neigung und ${r ? fmt(r.s) : "–"} Kilonewton je Quadratmeter Dachschneelast`}>
          <defs>
            <linearGradient id="sm-schnee" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d9e6f5" />
            </linearGradient>
          </defs>
          {/* Hauswände */}
          <path d={`M${li + 22},${175 - Math.tan(a) * 22} L${li + 22},200 M${re - 22},${175 - Math.tan(a) * 22} L${re - 22},200`} stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          {/* Schnee auf beiden Dachseiten (senkrecht zur Dachfläche aufgetragen) */}
          <path
            d={`M${li},175 L${first.x},${first.y} L${re},175 L${re + nx * schnee},${175 - ny * schnee} L${first.x},${first.y - schnee / ny} L${li - nx * schnee},${175 - ny * schnee} Z`}
            fill="url(#sm-schnee)"
            opacity="0.95"
          />
          {/* Dachfläche mit Modulen */}
          <path d={`M${li},175 L${first.x},${first.y} L${re},175`} fill="none" stroke="#1f5aa1" strokeWidth="7" strokeLinejoin="round" />
          <path d={`M${li},175 L${first.x},${first.y} L${re},175`} fill="none" stroke="#03122b" strokeWidth="3" strokeDasharray="22 3" strokeLinejoin="round" />
          {schneefang && <line x1={li + halbe * 0.2} y1={175 - Math.tan(a) * halbe * 0.2 - 2} x2={li + halbe * 0.2} y2={175 - Math.tan(a) * halbe * 0.2 - 14} stroke="#aed083" strokeWidth="3" strokeLinecap="round" />}
          <text x="200" y="196" textAnchor="middle" className="fill-white/45 text-[10px]">{`${neigung}° · μ₁ = ${r ? fmt(r.mu1, 2) : "–"}`}</text>
        </svg>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
          <div>
            <dt className="text-[12.5px] text-white/55">Dachschneelast s</dt>
            <dd className="mt-1 font-display text-[24px] font-extrabold text-white"><Zahl wert={r?.s ?? 0} stellen={2} suffix=" kN/m²" /></dd>
          </div>
          <div>
            <dt className="text-[12.5px] text-white/55">Bemessungswert je Modul</dt>
            <dd className="mt-1 font-display text-[24px] font-extrabold text-white"><Zahl wert={r?.bemessungPa ?? 0} suffix=" Pa" /></dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-4">
          {(r?.module || []).map((m) => {
            const s = STATUS[m.status];
            return (
              <li key={m.id}>
                <div className="flex items-baseline justify-between text-[13.5px]">
                  <span className="font-semibold text-white">{m.pruef.toLocaleString("de-DE")} Pa <span className="font-normal text-white/50">· {m.name}</span></span>
                  <span className={cn("font-semibold", s.ton)}>{Math.round(m.auslastung * 100)} % · {s.text}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <span className={cn("block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500", s.farbe)} style={{ width: `${Math.min(100, m.auslastung * 100)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        {r?.unterkonstruktion && <p className="mt-6 text-[14px] leading-relaxed text-white/70"><strong className="text-white">{r.unterkonstruktion.titel}.</strong> {r.empfohlen ? `Empfohlen: Module ab ${r.empfohlen.pruef.toLocaleString("de-DE")} Pa Prüflast.` : "Sonderlösung mit statischem Einzelnachweis nötig."}</p>}

        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
          <Button href="/standort-check" variant="white" icon={Mountain}>sₖ für Ihre Adresse ermitteln</Button>
          <a href="#statik-rechnung" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/70 hover:text-white">
            So rechnen wir <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
