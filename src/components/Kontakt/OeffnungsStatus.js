"use client";

import { useEffect, useState } from "react";

// Öffnungszeiten (Europe/Berlin). Wochentag: 1 = Montag … 7 = Sonntag
export const OEFFNUNGSZEITEN = [
  { tage: [1, 2, 3, 4], label: "Montag – Donnerstag", kurz: "Mo–Do", von: 8 * 60, bis: 16 * 60, text: "08:00 – 16:00 Uhr" },
  { tage: [5], label: "Freitag", kurz: "Fr", von: 8 * 60, bis: 13 * 60, text: "08:00 – 13:00 Uhr" },
  { tage: [6, 7], label: "Samstag & Sonntag", kurz: "Sa–So", von: null, bis: null, text: "geschlossen" },
];

const WOCHENTAGE = ["", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

function berlinJetzt(d = new Date()) {
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(d)
      .map((p) => [p.type, p.value])
  );
  const tag = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[teile.weekday];
  return { tag, minuten: Number(teile.hour) * 60 + Number(teile.minute) };
}

const zeitFuer = (tag) => OEFFNUNGSZEITEN.find((z) => z.tage.includes(tag));
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Status jetzt: { offen, tag, titel, detail } */
export function oeffnungsStatus(d = new Date()) {
  const { tag, minuten } = berlinJetzt(d);
  const heute = zeitFuer(tag);
  if (heute?.von != null && minuten >= heute.von && minuten < heute.bis) {
    const rest = heute.bis - minuten;
    return { offen: true, tag, titel: "Jetzt geöffnet", detail: rest <= 60 ? `noch ${rest} Min.` : `bis ${hhmm(heute.bis)} Uhr` };
  }
  // Nächste Öffnung suchen
  if (heute?.von != null && minuten < heute.von) return { offen: false, tag, titel: "Geschlossen", detail: `öffnet heute um ${hhmm(heute.von)} Uhr` };
  for (let i = 1; i <= 7; i++) {
    const t = ((tag - 1 + i) % 7) + 1;
    const z = zeitFuer(t);
    if (z?.von != null) {
      return { offen: false, tag, titel: "Geschlossen", detail: `öffnet ${i === 1 ? "morgen" : WOCHENTAGE[t]} um ${hhmm(z.von)} Uhr` };
    }
  }
  return { offen: false, tag, titel: "Geschlossen", detail: "" };
}

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
          <p className={`mt-0.5 text-[13px] ${dark ? "text-white/60" : "text-ink-500"}`}>{status ? status.detail : "Mo–Do 8–16 Uhr · Fr 8–13 Uhr"}</p>
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
      {status ? `${status.titel}${status.detail ? ` · ${status.detail}` : ""}` : "Mo–Do 8–16 Uhr · Fr 8–13 Uhr"}
    </p>
  );
}

/** Öffnungszeiten-Liste mit hervorgehobenem heutigen Tag */
export function OeffnungszeitenListe({ className = "" }) {
  const status = useStatus();
  return (
    <dl className={`divide-y divide-ink-200/70 ${className}`}>
      {OEFFNUNGSZEITEN.map((z) => {
        const heute = status && z.tage.includes(status.tag);
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
