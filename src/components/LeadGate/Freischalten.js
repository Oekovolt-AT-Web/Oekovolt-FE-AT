"use client";

// src/components/LeadGate/Freischalten.js – Knopf „E-Mail bestätigen“ auf /freischalten (Welle A, Paket A09)
// POST /api/lead-gate/bestaetigen setzt das Freischalt-Cookie; danach zurück zur Werkzeugseite.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { ereignis } from "@/lib/statistik";
import { FIRMA } from "@/lib/site";

export default function Freischalten({ token, werkzeug, stufe = 1 }) {
  const router = useRouter();
  const [status, setStatus] = useState("bereit"); // bereit | sendet | ok | fehler
  const [meldung, setMeldung] = useState("");
  const [ziel, setZiel] = useState("");
  const knopfRef = useRef(null);

  useEffect(() => {
    knopfRef.current?.focus({ preventScroll: true });
  }, []);

  const bestaetigen = async () => {
    setStatus("sendet");
    try {
      const r = await fetch("/api/lead-gate/bestaetigen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) {
        setMeldung(j.error || "Die Bestätigung ist gerade nicht möglich. Bitte versuchen Sie es erneut.");
        setStatus("fehler");
        return;
      }
      ereignis("lead_gate_bestaetigt", { kennung: j.kennung, quelle: "link" });
      setZiel(j.ziel);
      setStatus("ok");
      router.replace(j.ziel);
    } catch {
      setMeldung("Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.");
      setStatus("fehler");
    }
  };

  return (
    <div className="rounded-4xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-200/70 md:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ov-50 text-ov-700">
        {status === "ok" ? <CheckCircle2 aria-hidden="true" className="h-7 w-7" /> : <MailCheck aria-hidden="true" className="h-7 w-7" />}
      </span>
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">{werkzeug}</p>
      <h1 className="mt-2 font-display text-[26px] font-extrabold tracking-tight text-ink-900">{status === "ok" ? "Bestätigt – Sie werden weitergeleitet" : "Bitte E-Mail bestätigen"}</h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600" aria-live="polite">
        {status === "ok" ? (
          <>
            Falls nichts passiert:{" "}
            <Link href={ziel || "/rechner"} className="font-semibold text-ov-800 underline underline-offset-2">
              zurück zum Werkzeug
            </Link>
            .
          </>
        ) : stufe === 2 ? (
          "Mit einem Klick bestätigen Sie Ihre Adresse. Danach startet Ihre Auswertung auf diesem Gerät."
        ) : (
          "Mit einem Klick bestätigen Sie Ihre Adresse. Danach sind Export, PDF und Link auf diesem Gerät 30 Tage freigeschaltet."
        )}
      </p>
      {status !== "ok" && (
        <button
          ref={knopfRef}
          type="button"
          onClick={bestaetigen}
          disabled={status === "sendet"}
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-7 text-[15.5px] font-semibold text-white transition-colors hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
        >
          {status === "sendet" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
          E-Mail bestätigen
        </button>
      )}
      {status === "fehler" && (
        <p role="alert" className="mx-auto mt-5 max-w-md rounded-xl bg-red-50 p-3 text-[14px] text-red-800">
          {meldung}
        </p>
      )}
      <p className="mx-auto mt-8 max-w-md text-[12.5px] leading-relaxed text-ink-500">
        Wir verwenden Ihre Adresse nur für Ihr Ergebnis und Rückfragen dazu – kein Newsletter. Sie haben den Link nicht angefordert? Dann ignorieren Sie ihn
        einfach oder schreiben Sie an {FIRMA.email}. Mehr unter{" "}
        <Link href="/datenschutz#rechner-export" className="underline underline-offset-2">
          Datenschutz
        </Link>
        .
      </p>
    </div>
  );
}
