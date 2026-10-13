"use client";

// Antwortblock der Landesförderungs-Seiten: Tabelle Programm · Zielgruppe · Höhe · Frist · Quelle.
// Der Status wird nach dem Mounten im Browser neu berechnet (Muster HinweisLeiste.js), damit ein
// Fristablauf ohne Deploy greift; der Startzustand kommt vom Server (hydrationssicher).
// Status aus src/lib/programmStatus.js (Paket C01).

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { programmStatus } from "@/lib/programmStatus";
import { STATUS_TEXT } from "./antwort";

const TON = {
  offen: "bg-ov-50 text-ov-800 ring-ov-200",
  bald: "bg-sun-300/35 text-ink-800 ring-sun-400/50",
  abgelaufen: "bg-ink-100 text-ink-700 ring-ink-200",
  wartet: "bg-sun-300/35 text-ink-800 ring-sun-400/50",
};

function StatusChip({ status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1", TON[status] || TON.wartet)}>
      <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", status === "offen" ? "bg-ov-500" : status === "abgelaufen" ? "bg-ink-400" : "bg-sun-400")} />
      {STATUS_TEXT[status] || status}
    </span>
  );
}

/**
 * zeilen: Ergebnis von antwortZeilen(land) – inkl. der Rohdaten für die Neuberechnung
 * (programme: Original-Programme in gleicher Reihenfolge).
 */
export default function Antwortblock({ landName, zeilen = [], programme = [], stand }) {
  const [status, setStatus] = useState(() => zeilen.map((z) => z.status));

  useEffect(() => {
    const pruefen = () => setStatus(programme.map((p) => programmStatus(p, Date.now())));
    pruefen();
    const t = setInterval(pruefen, 60_000);
    return () => clearInterval(t);
  }, [programme]);

  if (!zeilen.length) {
    return (
      <p className="rounded-3xl bg-white p-6 text-[15.5px] leading-relaxed text-ink-700 ring-1 ring-ink-200/70">
        Zum Prüfdatum {stand} ist in {landName} kein Landesprogramm für Betriebe, Landwirtschaft oder Gemeinden offen. Es gilt der EAG-Investitionszuschuss des Bundes – Antrag vor der Inbetriebnahme.
      </p>
    );
  }

  const spalten = [
    { key: "programm", label: "Programm" },
    { key: "zielgruppe", label: "Zielgruppe" },
    { key: "hoehe", label: "Höhe" },
    { key: "frist", label: "Frist / Status" },
    { key: "quelle", label: "Quelle" },
  ];

  const zelle = (z, i, key) => {
    if (key === "programm")
      return (
        <>
          <span className="block">{z.programm}</span>
          <span className="mt-0.5 block text-[12.5px] font-normal text-ink-500">{z.traeger}</span>
        </>
      );
    if (key === "frist")
      return (
        <>
          <StatusChip status={status[i] || z.status} />
          <span className="mt-1.5 block text-[13.5px] leading-snug text-ink-600">{z.frist}</span>
          {z.pruefen && <span className="mt-1 block text-[12.5px] text-ink-500">Stand {stand}, bei der Förderstelle prüfen</span>}
        </>
      );
    if (key === "quelle")
      return z.url ? (
        <a href={z.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
          {z.quelle}
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="sr-only">(externer Link, neues Fenster)</span>
        </a>
      ) : (
        z.quelle
      );
    return z[key];
  };

  return (
    <div>
      <div className="hidden overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 md:block">
        <table className="w-full border-collapse text-left text-[14.5px]">
          <caption className="sr-only">Landesprogramme {landName} für Betriebe, Landwirtschaft und Gemeinden – Stand {stand}</caption>
          <thead>
            <tr className="bg-navy-950 text-white">
              {spalten.map((s) => (
                <th key={s.key} scope="col" className="px-5 py-3.5 text-[12.5px] font-semibold uppercase tracking-wider">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {zeilen.map((z, i) => (
              <tr key={z.id} className="align-top">
                <th scope="row" className="px-5 py-4 font-semibold text-ink-900">{zelle(z, i, "programm")}</th>
                {spalten.slice(1).map((s) => (
                  <td key={s.key} className="px-5 py-4 leading-relaxed text-ink-700">{zelle(z, i, s.key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden">
        {zeilen.map((z, i) => (
          <li key={z.id} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
            <p className="font-display text-[17px] font-bold leading-snug text-ink-900">{z.programm}</p>
            <p className="mt-0.5 text-[12.5px] text-ink-500">{z.traeger}</p>
            <dl className="mt-3 space-y-2.5">
              {spalten.slice(1).map((s) => (
                <div key={s.key}>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{s.label}</dt>
                  <dd className="mt-0.5 text-[14.5px] leading-relaxed text-ink-700">{zelle(z, i, s.key)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
        <CalendarClock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ov-600" />
        Status wird beim Aufruf aus den hinterlegten Fristen berechnet (Stand {stand}). Richtwerte zur Orientierung – verbindlich sind die Richtlinien der Förderstellen; Landesbudgets können ohne Vorankündigung ausgeschöpft sein.
      </p>
    </div>
  );
}
