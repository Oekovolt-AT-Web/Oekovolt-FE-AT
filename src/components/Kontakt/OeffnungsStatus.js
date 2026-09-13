"use client";

import { useEffect, useState } from "react";

import { OEFFNUNGSZEITEN, OEFFNUNGSZEITEN_KURZ, oeffnungsStatus } from "@/data/erreichbarkeit";

// Weiterhin hier exportiert, damit bestehende Importe funktionieren.
export { OEFFNUNGSZEITEN, oeffnungsStatus };

function useStatus() {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const aktualisieren = () => setStatus(oeffnungsStatus());
    aktualisieren();
    const t = setInterval(aktualisieren, 30000);
    return () => clearInterval(t);
  }, []);
  return status;
}

/**
 * Live-Status „Jetzt geöffnet / geschlossen" nach deutscher Zeit.
 * Server-HTML zeigt die Zeiten neutral, der Browser ergänzt den Status (keine Hydration-Abweichung).
 */
export default function OeffnungsStatus({ dark = false, gross = false, className = "" }) {
  const status = useStatus();
  const farbeText = dark ? "text-white/80" : "text-ink-700";

  if (gross) {
    return (
      <div className={`flex items-center gap-3 ${className}`} aria-live="polite">
        <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
          {status?.offen && <span className="absolute inset-0 animate-ping rounded-full bg-ov-400 opacity-60 motion-reduce:hidden" />}
          <span className={`relative h-3 w-3 rounded-full ${status == null ? "bg-ink-300" : status.offen ? "bg-ov-500" : "bg-sun-500"}`} />
        </span>
        <div className="leading-tight">
          <p className={`font-display text-[18px] font-bold ${dark ? "text-white" : "text-ink-900"}`}>{status ? status.titel : "Telefonisch erreichbar"}</p>
          <p className={`mt-0.5 text-[13px] ${dark ? "text-white/60" : "text-ink-500"}`}>{status ? status.detail : OEFFNUNGSZEITEN_KURZ}</p>
        </div>
      </div>
    );
  }

  return (
    <p className={`inline-flex items-center gap-2 text-[13.5px] font-medium ${farbeText} ${className}`} aria-live="polite">
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        {status?.offen && <span className="absolute inset-0 animate-ping rounded-full bg-ov-400 opacity-60 motion-reduce:hidden" />}
        <span className={`relative h-2.5 w-2.5 rounded-full ${status == null ? "bg-ink-300" : status.offen ? "bg-ov-500" : "bg-sun-500"}`} />
      </span>
      {status ? `${status.titel}${status.detail ? ` · ${status.detail}` : ""}` : OEFFNUNGSZEITEN_KURZ}
    </p>
  );
}

/** Öffnungszeiten-Liste mit hervorgehobenem heutigen Tag */
export function OeffnungszeitenListe({ className = "" }) {
  const status = useStatus();
  return (
    <dl className={`divide-y divide-ink-200/70 ${className}`}>
      {OEFFNUNGSZEITEN.map((z) => {
        const heute = status && z.tage.includes(status.wochentag);
        return (
          <div key={z.label} className={`flex items-center justify-between gap-4 py-3 text-[15px] ${heute ? "font-semibold text-ink-900" : "text-ink-600"}`}>
            <dt className="flex items-center gap-2">
              <span className="sm:hidden">{z.kurz}</span>
              <span className="hidden sm:inline">{z.label}</span>
              {heute && <span className="rounded-full bg-ov-100 px-2 py-0.5 text-[11.5px] font-semibold uppercase tracking-wider text-ov-700">heute</span>}
            </dt>
            <dd className="ov-num whitespace-nowrap">{z.text}</dd>
          </div>
        );
      })}
    </dl>
  );
}
