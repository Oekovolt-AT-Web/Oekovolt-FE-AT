"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Gift, Mail, MessageCircle, UserPlus, Users } from "lucide-react";

/**
 * Prämienrechner & Textvorschlag zum Teilen.
 * Grundlage (laut Backoffice): 250 € für Empfehlende und 250 € für die
 * empfohlene Person je erfolgreicher Empfehlung, wenn ein Vertrag entsteht.
 */

const PRAEMIE = 250;
const ANGEBOT_URL = "https://www.oekovolt.com/angebot";

const TEXTE = {
  du: `Hallo! Ich habe meine Solaranlage mit Ökovolt umgesetzt – Beratung, Montage und Anmeldung kamen aus einer Hand. Falls du auch über Photovoltaik, einen Stromspeicher oder eine Wallbox nachdenkst: Hier bekommst du ein kostenloses, unverbindliches Angebot. Und wenn daraus ein Vertrag mit Ökovolt entsteht, erhältst du über das Empfehlungsprogramm 250 € Prämie. ${ANGEBOT_URL}`,
  sie: `Guten Tag! Ich habe meine Solaranlage mit Ökovolt umgesetzt – Beratung, Montage und Anmeldung kamen aus einer Hand. Falls Sie auch über Photovoltaik, einen Stromspeicher oder eine Wallbox nachdenken: Hier erhalten Sie ein kostenloses, unverbindliches Angebot. Entsteht daraus ein Vertrag mit Ökovolt, erhalten Sie über das Empfehlungsprogramm 250 € Prämie. ${ANGEBOT_URL}`,
};

const euro = (n) => `${n.toLocaleString("de-DE")} €`;

export default function PraemienRechner() {
  const [anzahl, setAnzahl] = useState(3);
  const [anrede, setAnrede] = useState("du");
  const [kopiert, setKopiert] = useState(false);
  const textRef = useRef(null);

  const text = TEXTE[anrede];
  const fuerSie = anzahl * PRAEMIE;
  const fuerFreunde = anzahl * PRAEMIE;
  const fill = ((anzahl - 1) / 9) * 100;

  const kopieren = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok && textRef.current) {
      // Fallback für ältere Browser / unsichere Kontexte
      try {
        textRef.current.select();
        ok = document.execCommand("copy");
        window.getSelection()?.removeAllRanges();
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setKopiert(true);
      window.setTimeout(() => setKopiert(false), 2500);
    }
  };

  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl ring-1 ring-white/10 lg:grid-cols-[1.1fr_1fr]">
      {/* Rechner */}
      <div className="p-6 md:p-10">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Prämienrechner</p>
        <h3 className="ov-h3 mt-2">Wie viel bringt Ihre Empfehlung?</h3>

        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <label htmlFor="empfehlungen" className="text-[15px] font-medium text-ink-700">
              Erfolgreiche Empfehlungen
            </label>
            <output htmlFor="empfehlungen" className="ov-num font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-900">
              {anzahl}
            </output>
          </div>
          <input
            id="empfehlungen"
            type="range"
            min={1}
            max={10}
            step={1}
            value={anzahl}
            onChange={(e) => setAnzahl(Number(e.target.value))}
            className="ov-range mt-5"
            style={{ "--ov-fill": `${fill}%` }}
            aria-valuetext={`${anzahl} erfolgreiche ${anzahl === 1 ? "Empfehlung" : "Empfehlungen"}`}
          />
          <div className="mt-2 flex justify-between text-[12.5px] text-ink-500" aria-hidden="true">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Münzreihen */}
        <div className="mt-8 space-y-5">
          <Muenzreihe label="Ihre Prämie" icon={Gift} anzahl={anzahl} farbe="sun" />
          <Muenzreihe label="Vorteil für Ihre Freunde" icon={Users} anzahl={anzahl} farbe="ov" />
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3" aria-live="polite">
          <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/70 md:p-5">
            <dt className="text-[13px] text-ink-500">Für Sie</dt>
            <dd className="ov-num mt-1 font-display text-[28px] font-extrabold leading-none tracking-tight text-ink-900 md:text-[34px]">{euro(fuerSie)}</dd>
          </div>
          <div className="rounded-2xl bg-ov-50 p-4 ring-1 ring-ov-200 md:p-5">
            <dt className="text-[13px] text-ov-800">Für Ihre Freunde</dt>
            <dd className="ov-num mt-1 font-display text-[28px] font-extrabold leading-none tracking-tight text-ov-700 md:text-[34px]">{euro(fuerFreunde)}</dd>
            <dd className="mt-1.5 text-[12.5px] text-ov-800/80">je 250 € pro Person</dd>
          </div>
        </dl>
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
          Je erfolgreicher Empfehlung, also wenn daraus ein Vertrag mit Ökovolt entsteht. Details zu den Teilnahmebedingungen erhalten Sie bei der Registrierung.
        </p>
      </div>

      {/* Teilen */}
      <div className="flex flex-col border-t border-ink-100 bg-navy-950 p-6 text-white md:p-10 lg:border-l lg:border-t-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Textvorschlag</p>
            <h3 className="ov-h3 mt-2 text-white">Einfach teilen</h3>
          </div>
          <div role="group" aria-label="Anrede" className="inline-flex rounded-full bg-white/10 p-1">
            {[
              ["du", "Du"],
              ["sie", "Sie"],
            ].map(([v, l]) => (
              <button
                key={v}
                type="button"
                aria-pressed={anrede === v}
                onClick={() => setAnrede(v)}
                className={`h-10 min-w-[56px] rounded-full px-4 text-[14px] font-semibold transition-all ${anrede === v ? "bg-white text-navy-950 shadow" : "text-white/70 hover:text-white"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="teiltext" className="sr-only">
          Textvorschlag zum Teilen
        </label>
        <textarea
          id="teiltext"
          ref={textRef}
          readOnly
          value={text}
          rows={7}
          className="mt-6 min-h-[17rem] w-full resize-none sm:min-h-0 rounded-2xl bg-white/[0.06] p-4 text-[15px] leading-relaxed text-white/85 ring-1 ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-400 md:p-5"
        />

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <button
            type="button"
            onClick={kopieren}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[14.5px] font-semibold transition-all ${
              kopiert ? "bg-ov-600 text-white" : "bg-white text-navy-950 hover:bg-ov-50"
            }`}
          >
            {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            {kopiert ? "Kopiert" : "Kopieren"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[14.5px] font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent("Tipp: Solaranlage mit Ökovolt")}&body=${encodeURIComponent(text)}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[14.5px] font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            E-Mail
          </a>
        </div>
        <p className="sr-only" aria-live="polite">
          {kopiert ? "Text in die Zwischenablage kopiert" : ""}
        </p>

        <div className="mt-8 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 lg:mt-auto">
          <p className="text-[14.5px] leading-relaxed text-white/75">
            <strong className="font-semibold text-white">Wichtig:</strong> Ihren persönlichen Empfehlungslink erhalten Sie nach der Registrierung. Ersetzen Sie damit den Link im Text – nur so kann eine Anfrage Ihrer Empfehlung zugeordnet werden.
          </p>
          <Link
            href="/kontakt"
            className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700 sm:w-auto"
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Jetzt als Empfehlungsgeber melden
          </Link>
        </div>
      </div>
    </div>
  );
}

function Muenzreihe({ label, icon: Icon, anzahl, farbe }) {
  const voll = farbe === "sun" ? "bg-sun-400 text-navy-950 ring-sun-500/40" : "bg-ov-600 text-white ring-ov-700/40";
  return (
    <div>
      <p className="flex items-center gap-2 text-[13px] font-medium text-ink-600">
        <Icon aria-hidden="true" className={`h-4 w-4 ${farbe === "sun" ? "text-sun-500" : "text-ov-600"}`} />
        {label}
      </p>
      <ul className="mt-2.5 grid grid-cols-10 gap-1 sm:gap-1.5" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => {
          const an = i < anzahl;
          return (
            <li
              key={i}
              className={`flex aspect-square items-center justify-center rounded-full text-[9px] font-extrabold ring-2 transition-all duration-500 sm:text-[11px] ${
                an ? `${voll} scale-100 shadow-md` : "scale-[0.82] bg-ink-100 text-transparent ring-transparent"
              }`}
              style={{ transitionDelay: an ? `${i * 35}ms` : "0ms" }}
            >
              250
            </li>
          );
        })}
      </ul>
    </div>
  );
}
