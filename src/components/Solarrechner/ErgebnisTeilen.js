"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import Teilen from "@/components/ui/Teilen";
import { teilenQuery } from "@/lib/rechnerTeilen";
import { ereignis } from "@/lib/statistik";

/**
 * „Ergebnis teilen“: Link mit den Rechner-Eingaben (keine persönlichen Daten).
 * Messenger und Netzwerke zeigen dazu ein Vorschaubild mit dem Ergebnis
 * (/solarrechner/ergebnis/bild).
 */
export default function ErgebnisTeilen({ eingaben, titel }) {
  const [url, setUrl] = useState("");

  const oeffnen = () => {
    if (url) return setUrl("");
    const basis = process.env.NODE_ENV === "production" ? "https://www.oekovolt.de" : window.location.origin;
    setUrl(`${basis}/solarrechner/ergebnis?${teilenQuery(eingaben)}`);
    ereignis("rechner_teilen_geoeffnet", { kwp: eingaben.kwp });
  };

  return (
    <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
      <button type="button" onClick={oeffnen} aria-expanded={Boolean(url)} className="flex min-h-[44px] w-full items-center justify-between gap-3 text-left">
        <span className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-800">
          <Share2 aria-hidden="true" className="h-4 w-4 text-ov-600" />
          Ergebnis teilen
        </span>
        <span className="text-[13px] text-ink-500">mit Vorschaubild · ohne persönliche Daten</span>
      </button>
      {url && <Teilen url={url} titel={titel} text="Das hat der Ökovolt-Solarrechner für diese Anlage ausgerechnet – was bringt Ihr Dach?" kampagne="solarrechner_ergebnis" netze={["whatsapp", "facebook", "linkedin", "x", "telegram"]} kompakt className="mt-3" />}
    </div>
  );
}
