"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, FileDown, Link2, Share2 } from "lucide-react";
import Teilen from "@/components/ui/Teilen";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { berichtBereinigen, dokumentTitel, teilenLink, wegAus, zeitpunktText } from "./kodierung";
import Druckblatt, { BLATT_KLASSE, DRUCK_KLASSE } from "./Druckblatt";

// Geteilte Links zeigen immer auf die Live-Domain (wie Solarrechner und bisherige Teilen-Leisten).
const basisUrl = () => (process.env.NODE_ENV === "production" ? "https://www.oekovolt.com" : window.location.origin);

async function inZwischenablage(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const feld = document.createElement("textarea");
      feld.value = text;
      feld.setAttribute("readonly", "");
      feld.style.position = "fixed";
      feld.style.opacity = "0";
      document.body.appendChild(feld);
      feld.select();
      const ok = document.execCommand("copy");
      feld.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * „Ergebnis teilen“ und „Als PDF für Geschäftsführung/Bank“ für die Gewerbe-Rechner.
 *
 * props:
 *  rechner    Kennung wie in components/Rechner/tools.js (z. B. "gewerbe-pv") – für die Statistik
 *  name       Name des Rechners für Bericht und Dateiname (z. B. "Gewerbe-PV-Rechner")
 *  pfad       Seite des Rechners (z. B. "/rechner/gewerbe-pv")
 *  query      kodierte Eingaben (ohne „?“); leer = Startwerte
 *  titel/text Texte für Netzwerke und E-Mail
 *  kampagne   utm_campaign
 *  bericht    () => { untertitel, kennzahlen, eingaben, ergebnisse, annahmen, hinweise } – erst beim Klick berechnet
 */
export default function RechnerTeilen({ rechner, name, pfad, query, titel, text, kampagne, bericht, className }) {
  const [basis, setBasis] = useState("");
  const [offen, setOffen] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const [meldung, setMeldung] = useState("");
  const [druck, setDruck] = useState(null);
  const panelId = useId();
  const linkId = useId();

  const url = basis ? teilenLink(basis, pfad, query) : "";

  const kopieren = async () => {
    const b = basis || basisUrl();
    if (!basis) setBasis(b);
    const u = teilenLink(b, pfad, query);
    const ok = await inZwischenablage(u);
    if (ok) {
      setKopiert(true);
      setMeldung("Link in die Zwischenablage kopiert");
      setTimeout(() => setKopiert(false), 2200);
    } else {
      // Kopieren nicht erlaubt: Link zum Markieren anzeigen
      setOffen(true);
      setMeldung("Link unten markieren und kopieren");
    }
    ereignis("rechner_geteilt", { rechner, weg: "link" });
  };

  const umschalten = () => {
    if (!basis) setBasis(basisUrl());
    setOffen((o) => !o);
  };

  // Klicks in der Netzwerk-Leiste messen (LinkedIn, WhatsApp, E-Mail …)
  const netzwerkKlick = (e) => {
    const el = e.target.closest?.("a,button");
    if (!el) return;
    ereignis("rechner_geteilt", { rechner, weg: wegAus(el.getAttribute("aria-label") || el.textContent) });
  };

  const drucken = () => {
    const jetzt = new Date();
    let daten = {};
    try {
      daten = bericht ? bericht() : {};
    } catch {
      daten = {};
    }
    setDruck({
      bericht: berichtBereinigen({ ...daten, rechner, titel: name }),
      url: teilenLink(basis || basisUrl(), pfad, query),
      zeitpunkt: zeitpunktText(jetzt),
      dokument: dokumentTitel(name, jetzt),
    });
    ereignis("rechner_pdf", { rechner });
  };

  // Druck starten, sobald das Blatt im DOM steht; danach aufräumen
  useEffect(() => {
    if (!druck) return undefined;
    const html = document.documentElement;
    const alterTitel = document.title;
    let aktiv = true;
    let timer;
    const aufraeumen = () => {
      if (!aktiv) return;
      aktiv = false;
      html.classList.remove(DRUCK_KLASSE);
      document.title = alterTitel;
    };
    const nachDruck = () => {
      // kurz warten: mobile Browser erzeugen die Vorschau teils nach „afterprint“
      timer = setTimeout(() => {
        aufraeumen();
        setDruck(null);
      }, 400);
    };
    html.classList.add(DRUCK_KLASSE);
    document.title = druck.dokument;
    window.addEventListener("afterprint", nachDruck);

    const bilder = Array.from(document.querySelectorAll(`.${BLATT_KLASSE} img`));
    const geladen = Promise.all(bilder.map((b) => (b.decode ? b.decode().catch(() => {}) : Promise.resolve())));
    Promise.race([geladen, new Promise((r) => setTimeout(r, 900))]).then(() => {
      if (!aktiv) return;
      requestAnimationFrame(() => {
        if (aktiv) window.print();
      });
    });

    return () => {
      window.removeEventListener("afterprint", nachDruck);
      clearTimeout(timer);
      aufraeumen();
    };
  }, [druck]);

  const knopf = "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2";

  return (
    <div className={cn("rounded-2xl bg-white ring-1 ring-ink-200/70", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 p-2 pl-4">
        <p className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-ink-800">
          <Share2 aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
          <span>Ergebnis teilen</span>
          <span className="hidden text-[12.5px] font-normal text-ink-500 2xl:inline">· Link mit Ihren Eingaben, ohne persönliche Daten</span>
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={kopieren} className={cn(knopf, kopiert ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-800 hover:bg-ink-200")}>
            {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}
            {kopiert ? "Kopiert" : "Link kopieren"}
          </button>
          <button type="button" onClick={drucken} className={cn(knopf, "bg-navy-950 text-white hover:bg-ov-600")}>
            <FileDown aria-hidden="true" className="h-4 w-4" />
            <span>
              Als PDF<span className="hidden sm:inline"> für Geschäftsführung/Bank</span>
            </span>
          </button>
          <button
            type="button"
            onClick={umschalten}
            aria-expanded={offen}
            aria-controls={panelId}
            className={cn(knopf, "px-3 text-ov-700 hover:bg-ov-50")}
          >
            Mehr
            <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform duration-200", offen && "rotate-180")} />
          </button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {meldung}
      </p>
      {offen && url && (
        <div id={panelId} className="space-y-3 border-t border-ink-100 px-4 py-3">
          <div>
            <label htmlFor={linkId} className="block text-[12.5px] font-semibold text-ink-600">
              Link zu dieser Berechnung
            </label>
            <input
              id={linkId}
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
              className="mt-1 h-10 w-full min-w-0 rounded-xl bg-sand-50 px-3 font-mono text-[12px] text-ink-700 ring-1 ring-ink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
            />
            <p className="mt-1 text-[12px] leading-snug text-ink-500">Enthält nur Ihre Eingaben – keine Namen, keine Firmendaten. Beim Öffnen rechnet die Seite neu.</p>
          </div>
          <div onClickCapture={netzwerkKlick}>
            <Teilen url={url} titel={titel} text={text} kampagne={kampagne} netze={["linkedin", "whatsapp", "xing", "x"]} kompakt />
          </div>
        </div>
      )}
      {druck && typeof document !== "undefined" && createPortal(<Druckblatt bericht={druck.bericht} url={druck.url} zeitpunkt={druck.zeitpunkt} />, document.body)}
    </div>
  );
}
