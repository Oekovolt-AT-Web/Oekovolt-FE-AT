"use client";

import { useRef, useState } from "react";
import { Check, Copy, Linkedin, Mail, MessageCircle, UserPlus } from "lucide-react";
import { BASE_URL } from "@/lib/site";

/**
 * Empfehlungs-Baukasten (Österreich): Textvorschlag je Zielgruppe und Anrede,
 * zum Kopieren oder Teilen per WhatsApp, E-Mail und LinkedIn.
 *
 * Bewusst OHNE Prämienbetrag: Höhe und Bedingungen der Empfehlungsprämie für
 * Österreich stehen in den Teilnahmebedingungen, nicht im Code.
 * Dateiname bleibt aus Kompatibilitätsgründen PraemienRechner.js.
 */

const ZIEL_URL = `${BASE_URL}/angebot`;

const ZIELGRUPPEN = {
  unternehmen: {
    label: "Unternehmen",
    sie: `Guten Tag! Wir haben unsere Photovoltaikanlage mit Ökovolt umgesetzt – ausgelegt nach unserem Lastgang, mit sauberer Abwicklung beim Netzbetreiber und laufender Betreuung. Falls Sie für Ihren Betrieb über PV, einen Gewerbespeicher oder Ladeinfrastruktur nachdenken, lohnt sich ein Gespräch: ${ZIEL_URL}`,
    du: `Hallo! Wir haben unsere PV-Anlage im Betrieb mit Ökovolt umgesetzt – geplant nach unserem Lastgang, sauber abgewickelt und gut betreut. Falls ihr über PV, Speicher oder Ladepunkte nachdenkt, meldet euch dort: ${ZIEL_URL}`,
  },
  landwirtschaft: {
    label: "Landwirtschaft",
    sie: `Guten Tag! Wir haben auf Stall- und Hallendach eine PV-Anlage mit Ökovolt errichtet. Die Planung hat Statik, Schneelast und unseren Verbrauch im Betrieb genau berücksichtigt. Falls Sie Ähnliches vorhaben: ${ZIEL_URL}`,
    du: `Servus! Wir haben aufs Stalldach eine PV-Anlage mit Ökovolt gebaut – Statik, Schneelast und Verbrauch wurden genau durchgerechnet. Falls du auch überlegst: ${ZIEL_URL}`,
  },
  gemeinde: {
    label: "Gemeinde",
    sie: `Guten Tag! Unsere Gemeinde hat mit Ökovolt Photovoltaik auf öffentlichen Gebäuden umgesetzt – von der Planung bis zur Abstimmung mit dem Netzbetreiber. Falls Ihre Gemeinde Ähnliches plant, empfehlen wir ein Gespräch: ${ZIEL_URL}`,
    du: `Hallo! Wir haben in der Gemeinde mit Ökovolt PV auf mehreren Gebäuden umgesetzt – gut geplant und sauber abgewickelt. Falls ihr Ähnliches vorhabt: ${ZIEL_URL}`,
  },
  privat: {
    label: "Privat",
    sie: `Guten Tag! Ich habe meine Photovoltaikanlage mit Ökovolt umgesetzt – Beratung, Montage und Anmeldung aus einer Hand. Falls Sie auch darüber nachdenken, finden Sie hier eine unverbindliche Anfrage: ${ZIEL_URL}`,
    du: `Hallo! Ich habe meine PV-Anlage mit Ökovolt umgesetzt – Beratung, Montage und Anmeldung aus einer Hand. Falls du auch überlegst: ${ZIEL_URL}`,
  },
};

export default function PraemienRechner() {
  const [ziel, setZiel] = useState("unternehmen");
  const [anrede, setAnrede] = useState("sie");
  const [kopiert, setKopiert] = useState(false);
  const textRef = useRef(null);

  const text = ZIELGRUPPEN[ziel][anrede];

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

  const knopf = "inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[14.5px] font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10";

  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl ring-1 ring-white/10 lg:grid-cols-[1fr_1.1fr]">
      <div className="p-6 md:p-10">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Empfehlungs-Baukasten</p>
        <h3 className="ov-h3 mt-2">Für wen ist Ihre Empfehlung?</h3>
        <div role="group" aria-label="Zielgruppe" className="mt-6 grid grid-cols-2 gap-2">
          {Object.entries(ZIELGRUPPEN).map(([k, v]) => (
            <button
              key={k}
              type="button"
              aria-pressed={ziel === k}
              onClick={() => setZiel(k)}
              className={`h-12 rounded-2xl px-4 text-[15px] font-semibold transition-all ${
                ziel === k ? "bg-ov-600 text-white shadow-[0_6px_16px_-6px_rgba(102,153,51,0.7)]" : "bg-sand-50 text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="mt-8 text-[14px] font-medium text-ink-700">Anrede</p>
        <div role="group" aria-label="Anrede" className="mt-2 inline-flex rounded-full bg-ink-100 p-1">
          {[
            ["sie", "Sie"],
            ["du", "Du"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              aria-pressed={anrede === v}
              onClick={() => setAnrede(v)}
              className={`h-10 min-w-[64px] rounded-full px-4 text-[14px] font-semibold transition-all ${anrede === v ? "bg-white text-navy-950 shadow" : "text-ink-600 hover:text-ink-900"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-8 text-[13.5px] leading-relaxed text-ink-500">
          Ersetzen Sie den Link im Text durch Ihren persönlichen Empfehlungslink – nur so kann eine Anfrage Ihrer Empfehlung zugeordnet werden. Link und Teilnahmebedingungen erhalten Sie
          nach der Registrierung.
        </p>
      </div>

      <div className="flex flex-col border-t border-ink-100 bg-navy-950 p-6 text-white md:p-10 lg:border-l lg:border-t-0">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Textvorschlag</p>
        <label htmlFor="teiltext" className="sr-only">
          Textvorschlag zum Teilen
        </label>
        <textarea
          id="teiltext"
          ref={textRef}
          readOnly
          value={text}
          rows={7}
          className="mt-4 min-h-[15rem] w-full resize-none rounded-2xl bg-white/[0.06] p-4 text-[15px] leading-relaxed text-white/85 ring-1 ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-400 sm:min-h-0 md:p-5"
        />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={kopieren}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[14.5px] font-semibold transition-all ${kopiert ? "bg-ov-600 text-white" : "bg-white text-navy-950 hover:bg-ov-50"}`}
          >
            {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            {kopiert ? "Kopiert" : "Kopieren"}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className={knopf}>
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp
          </a>
          <a href={`mailto:?subject=${encodeURIComponent("Empfehlung: Photovoltaik mit Ökovolt")}&body=${encodeURIComponent(text)}`} className={knopf}>
            <Mail aria-hidden="true" className="h-4 w-4" />
            E-Mail
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ZIEL_URL)}`} target="_blank" rel="noopener noreferrer" className={knopf}>
            <Linkedin aria-hidden="true" className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
        <p className="sr-only" aria-live="polite">
          {kopiert ? "Text in die Zwischenablage kopiert" : ""}
        </p>
        <a
          href="#anmelden"
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700 sm:w-auto lg:mt-auto"
        >
          <UserPlus aria-hidden="true" className="h-4 w-4" />
          Als Empfehlungsgeber registrieren
        </a>
      </div>
    </div>
  );
}
