"use client";

import { useState } from "react";
import { Info, Mail } from "lucide-react";

/**
 * Kurzbewerbung: bereitet eine E-Mail an office@oekovolt.de vor (Betreff,
 * Name, Kontakt, Nachricht). Es wird nichts an einen Server gesendet – den
 * Lebenslauf hängen Bewerbende in ihrem E-Mail-Programm an.
 */
export default function KurzBewerbung({ titel, email = "office@oekovolt.de" }) {
  const [f, setF] = useState({ name: "", telefon: "", nachricht: "" });
  const [fehler, setFehler] = useState("");
  const aendern = (e) => setF((x) => ({ ...x, [e.target.name]: e.target.value }));

  const senden = (e) => {
    e.preventDefault();
    if (!f.name.trim()) {
      setFehler("Bitte geben Sie Ihren Namen an.");
      return;
    }
    setFehler("");
    const text = [
      "Guten Tag,",
      "",
      `hiermit bewerbe ich mich auf die Stelle „${titel}“.`,
      "",
      f.nachricht.trim(),
      "",
      "Meinen Lebenslauf finden Sie im Anhang.",
      "",
      "Viele Grüße",
      f.name.trim(),
      f.telefon.trim() ? `Telefon: ${f.telefon.trim()}` : "",
    ]
      .filter((z, i, a) => !(z === "" && a[i - 1] === ""))
      .join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Bewerbung: ${titel}`)}&body=${encodeURIComponent(text)}`;
  };

  const feld = "h-12 w-full rounded-2xl bg-white px-4 text-[15.5px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500";

  return (
    <form onSubmit={senden} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[13.5px] font-semibold text-ink-700">Name *</span>
          <input name="name" value={f.name} onChange={aendern} autoComplete="name" className={feld} placeholder="Vor- und Nachname" required />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13.5px] font-semibold text-ink-700">Telefon (optional)</span>
          <input name="telefon" type="tel" value={f.telefon} onChange={aendern} autoComplete="tel" className={feld} placeholder="Für einen schnellen Rückruf" />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-[13.5px] font-semibold text-ink-700">Ein paar Sätze zu Ihnen (optional)</span>
        <textarea name="nachricht" value={f.nachricht} onChange={aendern} rows={4} className={`${feld} h-auto resize-y py-3 leading-relaxed`} placeholder="Was reizt Sie an der Stelle? Welche Erfahrung bringen Sie mit?" />
      </label>
      {fehler && (
        <p role="alert" className="text-[14px] font-medium text-red-700">
          {fehler}
        </p>
      )}
      <button type="submit" className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-500 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition hover:bg-ov-600">
        <Mail aria-hidden="true" className="h-5 w-5" />
        E-Mail-Bewerbung vorbereiten
      </button>
      <p className="flex items-start gap-2 text-[13.5px] leading-snug text-ink-500">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        Ihr E-Mail-Programm öffnet sich mit vorausgefüllter Nachricht an {email}. Bitte hängen Sie dort Ihren Lebenslauf (PDF) an.
      </p>
    </form>
  );
}
