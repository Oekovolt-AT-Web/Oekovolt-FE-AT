"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, FileDown, FileText, Loader2, Lock, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { herkunft } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";

const FEHLER = {
  name: "Bitte geben Sie Ihren Namen an.",
  email: "Bitte eine gültige E-Mail-Adresse angeben.",
  telefon: "Bitte eine Telefonnummer angeben.",
  plz: "Bitte eine gültige Postleitzahl angeben (4 Ziffern, z. B. 5121).",
  einwilligung: "Bitte stimmen Sie der Verarbeitung zu.",
  zu_viele: "Sie haben heute bereits mehrere Analysen erstellt. Wir melden uns gern persönlich.",
  pdf: "Das PDF konnte gerade nicht erstellt werden. Bitte versuchen Sie es erneut.",
};

/**
 * „Persönliche PV-Analyse als PDF“: fragt Kontaktdaten ab, lässt das PDF auf dem Server erzeugen
 * (inkl. Ablage im Backoffice) und startet den Download.
 * eingaben: { kwp, ausrichtung, neigung, verbrauch, speicherKwh, preissteigerung }
 */
export default function PdfAnalyse({ eingaben, dunkel = false, className }) {
  const [offen, setOffen] = useState(false);
  const [werte, setWerte] = useState({ name: "", email: "", plz: "", telefon: "" });
  const [einwilligung, setEinwilligung] = useState(false);
  const [status, setStatus] = useState("bereit"); // bereit | laeuft | fertig
  const [fehler, setFehler] = useState("");
  const [referenz, setReferenz] = useState("");
  const start = useRef(0);
  const website = useRef(null);
  const dialog = useRef(null);
  const ausloeser = useRef(null);

  useEffect(() => {
    if (!offen) return undefined;
    start.current = Date.now();
    const vorher = document.activeElement;
    const knopf = ausloeser.current;
    dialog.current?.querySelector("input")?.focus();
    const taste = (e) => {
      if (e.key === "Escape") setOffen(false);
      if (e.key === "Tab" && dialog.current) {
        const f = [...dialog.current.querySelectorAll("button, input, a[href]")].filter((x) => !x.disabled);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", taste);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", taste);
      document.documentElement.style.overflow = "";
      (vorher instanceof HTMLElement ? vorher : knopf)?.focus();
    };
  }, [offen]);

  async function erstellen(e) {
    e.preventDefault();
    if (werte.name.trim().length < 2) return setFehler(FEHLER.name);
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(werte.email.trim())) return setFehler(FEHLER.email);
    if (werte.telefon.replace(/\D/g, "").length < 6) return setFehler(FEHLER.telefon);
    if (!/^\d{4,5}$/.test(werte.plz.trim())) return setFehler(FEHLER.plz);
    if (!einwilligung) return setFehler(FEHLER.einwilligung);

    setFehler("");
    setStatus("laeuft");
    try {
      const r = await fetch("/api/analyse/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eingaben, ...werte, einwilligung, website: website.current?.value || "", dauer: Date.now() - start.current, seite: window.location.pathname, herkunft: herkunft() }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.fehler || "pdf");
      }
      const ref = r.headers.get("x-analyse-referenz") || "";
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Oekovolt-PV-Analyse-${ref || "2026"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setReferenz(ref);
      setStatus("fertig");
      import("@/lib/konfetti").then((m) => m.konfetti()).catch(() => {});
      ereignis("pdf_analyse_erstellt", { kwp: eingaben?.kwp });
    } catch (err) {
      setFehler(FEHLER[err.message] || FEHLER.pdf);
      setStatus("bereit");
    }
  }

  const feld =
    "h-12 w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500";

  return (
    <>
      <button
        ref={ausloeser}
        type="button"
        onClick={() => {
          setOffen(true);
          setStatus("bereit");
        }}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition",
          dunkel ? "bg-white text-navy-950 hover:bg-sand-50" : "bg-navy-950 text-white hover:bg-navy-800",
          className
        )}
      >
        <FileDown aria-hidden="true" className="h-5 w-5" />
        <span className="whitespace-nowrap">PDF-Analyse</span>
      </button>

      {offen && (
        <div className="fixed inset-0 z-[9700] flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && setOffen(false)}>
          <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="pdf-analyse-titel" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700">
                <FileText aria-hidden="true" className="h-6 w-6" />
              </span>
              <button type="button" onClick={() => setOffen(false)} aria-label="Schließen" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-50 text-ink-700 hover:bg-ink-100">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {status === "fertig" ? (
              <div role="status" className="mt-4">
                <h2 id="pdf-analyse-titel" className="font-display text-[24px] font-extrabold tracking-tight text-ink-900">
                  Ihre Analyse ist fertig.
                </h2>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">
                  Der Download hat begonnen{referenz ? ` (Referenz ${referenz})` : ""}. Möchten Sie die Zahlen mit einem Fachberater durchgehen? Der Termin ist kostenlos.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/termin" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white hover:bg-ov-700">
                    <Check aria-hidden="true" className="h-4 w-4" />
                    Beratungstermin buchen
                  </Link>
                  <button type="button" onClick={() => setOffen(false)} className="inline-flex h-12 items-center justify-center rounded-full px-5 text-[15px] font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300">
                    Schließen
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={erstellen} noValidate className="mt-4">
                <h2 id="pdf-analyse-titel" className="font-display text-[24px] font-extrabold tracking-tight text-ink-900">
                  Ihre Analyse als PDF
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                  4 Seiten mit Ertrag, Energiefluss, 20-Jahres-Wirtschaftlichkeit, Speicher-Vergleich und Strompreis-Szenarien – berechnet mit Ihren Angaben. Kostenlos und unverbindlich.
                </p>
                <div className="mt-6 grid gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">Name *</span>
                    <input className={feld} autoComplete="name" value={werte.name} onChange={(e) => setWerte({ ...werte, name: e.target.value })} aria-required="true" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">E-Mail *</span>
                    <input className={feld} type="email" inputMode="email" autoComplete="email" value={werte.email} onChange={(e) => setWerte({ ...werte, email: e.target.value })} aria-required="true" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">PLZ *</span>
                      <input className={feld} inputMode="numeric" autoComplete="postal-code" value={werte.plz} onChange={(e) => setWerte({ ...werte, plz: e.target.value })} aria-required="true" maxLength={5} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">Telefon *</span>
                      <input className={feld} type="tel" inputMode="tel" autoComplete="tel" value={werte.telefon} onChange={(e) => setWerte({ ...werte, telefon: e.target.value })} aria-required="true" />
                    </label>
                  </div>
                </div>
                <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <label className="mt-5 flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-ov-600" />
                  <span className="text-[13.5px] leading-relaxed text-ink-600">
                    Ökovolt darf die Analyse speichern und mich dazu per E-Mail oder Telefon kontaktieren. Details in der{" "}
                    <Link href="/datenschutz#analyse" className="font-semibold text-ov-700 underline underline-offset-2">
                      Datenschutzerklärung
                    </Link>
                    . * Pflichtfeld
                  </span>
                </label>
                {fehler && (
                  <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[14px] text-red-700 ring-1 ring-red-200">
                    <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    {fehler}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "laeuft"}
                  className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ov-600 py-3.5 text-[16px] font-semibold text-white transition hover:bg-ov-700 disabled:opacity-60"
                >
                  {status === "laeuft" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <FileDown aria-hidden="true" className="h-5 w-5" />}
                  {status === "laeuft" ? "PDF wird erstellt …" : "PDF erstellen & herunterladen"}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-ink-600">
                  <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                  Keine Weitergabe an Dritte · unverbindliche Ersteinschätzung
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
