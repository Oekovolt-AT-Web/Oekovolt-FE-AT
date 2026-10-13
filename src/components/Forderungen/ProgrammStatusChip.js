"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";
import { datumKurzIso, naechsterTermin, programmStatus, pruefungVeraltet } from "@/lib/programmStatus";

/**
 * Status-Chip eines Förderprogramms, datumsgesteuert (Muster HinweisLeiste.js):
 * Der Startzustand kommt vom Server mit dem Prüfdatum (hydrationssicher), nach dem
 * Mounten rechnet der Chip mit der Uhr des Browsers – ein Programm springt also ohne
 * Deploy auf „abgelaufen“, wenn seine Frist verstrichen ist.
 *
 * programm: { startIso?, startVoraussichtlich?, fristIso?, gueltigBisIso?, geprueftAm?, anzeigeStatus?, pruefen? }
 * heuteIso: Prüfdatum als Startwert (z. B. STAND.iso)
 */

export const STATUS_TON = {
  offen: { label: "offen", punkt: "bg-ov-500", ring: "ring-ov-300/60", text: "text-ov-800", flaeche: "bg-ov-50", puls: true },
  bald: { label: "endet bald", punkt: "bg-sun-400", ring: "ring-sun-400/40", text: "text-ink-800", flaeche: "bg-sun-300/25", puls: true },
  wartet: { label: "noch nicht geöffnet", punkt: "bg-navy-400", ring: "ring-navy-200", text: "text-navy-800", flaeche: "bg-navy-50", puls: false },
  abgelaufen: { label: "abgelaufen", punkt: "bg-[#e5484d]", ring: "ring-[#e5484d]/25", text: "text-[#b42318]", flaeche: "bg-[#e5484d]/10", puls: false },
};

export default function ProgrammStatusChip({ programm, heuteIso, pruefenLabel = "bitte prüfen", className }) {
  const [jetzt, setJetzt] = useState(() => (heuteIso ? Date.parse(`${heuteIso}T12:00:00+02:00`) : Date.now()));

  useEffect(() => {
    const tick = () => setJetzt(Date.now());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  const code = programmStatus(programm, jetzt);
  const termin = naechsterTermin(programm, jetzt);
  const pruefung = pruefungVeraltet(programm, jetzt);
  // Nur angekündigter Start (z. B. „ab Mitte Oktober“), Tag erreicht, aber noch nicht bestätigt:
  // nicht als „offen“ ausgeben, sondern gelb „bitte prüfen“.
  const startUnbestaetigt = Boolean(programm?.startVoraussichtlich && programm?.startIso && (code === "offen" || code === "bald"));
  const ton = startUnbestaetigt ? STATUS_TON.bald : STATUS_TON[code];
  const text = startUnbestaetigt
    ? `Start erwartet ab ${datumKurzIso(programm.startIso)} – ${pruefenLabel}`
    : code === "abgelaufen" && termin
      ? `${ton.label} seit ${datumKurzIso(termin.iso)}`
      : code === "wartet" && termin?.art === "start"
        ? `${ton.label} – ${programm?.startVoraussichtlich ? "voraussichtlich " : ""}ab ${datumKurzIso(termin.iso)}`
        : termin && code !== "wartet"
          ? `${ton.label} – bis ${datumKurzIso(termin.iso)}`
          : programm?.pruefen && code === "offen"
            ? `läuft laut Sekundärquelle – ${pruefenLabel}`
            : ton.label;

  return (
    <span
      data-status={code}
      title={pruefung.ok ? `zuletzt geprüft am ${datumKurzIso(programm?.geprueftAm)}` : `Prüfung fällig: ${pruefung.grund}`}
      className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1", ton.flaeche, ton.ring, ton.text, className)}
    >
      <span className="relative flex h-2.5 w-2.5">
        {ton.puls && <span aria-hidden="true" className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 motion-reduce:hidden", ton.punkt)} />}
        <span aria-hidden="true" className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", ton.punkt)} />
      </span>
      {text}
    </span>
  );
}
