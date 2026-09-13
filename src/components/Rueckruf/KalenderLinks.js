"use client";

import { CalendarPlus } from "lucide-react";
import { cn } from "@/components/ui/cn";

const utcKompakt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** „Zum Kalender hinzufügen": .ics (Apple, Outlook), Google Kalender, Outlook.com */
export default function KalenderLinks({ titel, beschreibung = "", ort = "", start, minuten = 30, dunkel = false, className }) {
  const beginn = new Date(start);
  const ende = new Date(beginn.getTime() + minuten * 60000);

  const ics = () => {
    const inhalt = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Oekovolt//Termin//DE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${utcKompakt(beginn)}-${Math.random().toString(36).slice(2)}@oekovolt.de`,
      `DTSTAMP:${utcKompakt(new Date())}`,
      `DTSTART:${utcKompakt(beginn)}`,
      `DTEND:${utcKompakt(ende)}`,
      `SUMMARY:${icsText(titel)}`,
      `DESCRIPTION:${icsText(beschreibung)}`,
      ort && `LOCATION:${icsText(ort)}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsText(titel)}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([inhalt], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "oekovolt-termin.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titel)}&dates=${utcKompakt(beginn)}/${utcKompakt(ende)}&details=${encodeURIComponent(beschreibung)}&location=${encodeURIComponent(ort)}`;
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(titel)}&startdt=${beginn.toISOString()}&enddt=${ende.toISOString()}&body=${encodeURIComponent(beschreibung)}&location=${encodeURIComponent(ort)}`;

  const knopf = cn(
    "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-inset transition",
    dunkel ? "bg-white/10 text-white ring-white/20 hover:bg-white/20" : "bg-white text-ink-800 ring-ink-200 hover:ring-ov-300"
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button type="button" onClick={ics} className={knopf}>
        <CalendarPlus aria-hidden="true" className="h-4 w-4" />
        Kalender (.ics)
      </button>
      <a href={google} target="_blank" rel="noopener noreferrer" className={knopf}>
        Google Kalender
      </a>
      <a href={outlook} target="_blank" rel="noopener noreferrer" className={knopf}>
        Outlook
      </a>
    </div>
  );
}
