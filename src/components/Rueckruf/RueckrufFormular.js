"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarClock, Check, Loader2, Lock, Phone, PhoneCall, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { THEMEN, telefonNormalisieren } from "@/data/erreichbarkeit";
import KalenderLinks from "./KalenderLinks";
import { herkunft } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";

const FEHLER = {
  telefon: "Bitte eine gültige deutsche, österreichische oder Schweizer Rufnummer angeben.",
  einwilligung: "Bitte bestätigen Sie, dass wir Sie anrufen dürfen.",
  zeit: "Diese Zeit ist nicht mehr verfügbar – bitte eine andere wählen.",
  geschlossen: "Wir sind gerade nicht erreichbar – bitte eine Wunschzeit wählen.",
  zu_viele: "Für diese Nummer liegen bereits Rückrufwünsche vor. Wir melden uns – versprochen.",
  nicht_konfiguriert: "Der Rückruf-Service ist gerade nicht verfügbar. Rufen Sie uns gern direkt an.",
  backend: "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.",
};

const datumText = (iso) =>
  new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/**
 * Rückruf anfordern – sofort (CloudTalk / Team) oder zur Wunschzeit.
 * dunkel: Darstellung auf Navy-Hintergrund
 */
export default function RueckrufFormular({ dunkel = false, autoFokus = false, className }) {
  const [status, setStatus] = useState(null);
  const [modus, setModus] = useState("sofort");
  const [tag, setTag] = useState(0);
  const [wunschzeit, setWunschzeit] = useState("");
  const [telefon, setTelefon] = useState("");
  const [name, setName] = useState("");
  const [thema, setThema] = useState("");
  const [einwilligung, setEinwilligung] = useState(false);
  const [zustand, setZustand] = useState("form"); // form | sendet | fertig
  const [fehler, setFehler] = useState("");
  const [ergebnis, setErgebnis] = useState(null);
  const [telefonBeruehrt, setTelefonBeruehrt] = useState(false);
  const start = useRef(Date.now());
  const website = useRef(null);
  const telefonFeld = useRef(null);
  const telefonFehlerId = useId();

  useEffect(() => {
    let aktiv = true;
    fetch("/api/rueckruf", { cache: "no-store" })
      .then((r) => r.json())
      .then((s) => {
        if (!aktiv) return;
        setStatus(s);
        if (!s.offen) setModus("wunsch");
      })
      .catch(() => aktiv && setStatus({ verfuegbar: false, wunschzeiten: [] }));
    return () => {
      aktiv = false;
    };
  }, []);

  useEffect(() => {
    if (autoFokus && status) telefonFeld.current?.focus();
  }, [autoFokus, status]);

  const telefonOk = Boolean(telefonNormalisieren(telefon));
  // Sichtbarer Feldfehler nach Verlassen des Feldes (oder nach Absenden ohne Nummer)
  const telefonFehler = telefonBeruehrt && !telefonOk && (telefon !== "" || fehler === FEHLER.telefon);
  const tage = status?.wunschzeiten || [];

  async function absenden(e) {
    e.preventDefault();
    setTelefonBeruehrt(true);
    if (!telefonOk) return setFehler(FEHLER.telefon);
    if (modus === "wunsch" && !wunschzeit) return setFehler("Bitte wählen Sie eine Wunschzeit.");
    if (!einwilligung) return setFehler(FEHLER.einwilligung);

    setFehler("");
    setZustand("sendet");
    try {
      const r = await fetch("/api/rueckruf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefon,
          name,
          thema,
          wunschzeit: modus === "wunsch" ? wunschzeit : null,
          einwilligung,
          website: website.current?.value || "",
          dauer: Date.now() - start.current,
          seite: typeof window !== "undefined" ? window.location.pathname : "",
          herkunft: herkunft(),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.fehler || "backend");
      setErgebnis(d);
      setZustand("fertig");
      ereignis("rueckruf_angefordert", { modus: d.modus === "Wunschzeit" ? "wunschzeit" : "sofort" });
    } catch (err) {
      setFehler(FEHLER[err.message] || FEHLER.backend);
      setZustand("form");
    }
  }

  const t = dunkel
    ? { text: "text-white", leise: "text-white/65", feld: "bg-white/10 text-white placeholder:text-white/40 ring-white/15 focus-visible:ring-ov-400", chip: "bg-white/10 text-white ring-white/15 hover:ring-white/40", karte: "bg-white/5 ring-white/10" }
    : { text: "text-ink-900", leise: "text-ink-600", feld: "bg-white text-ink-900 placeholder:text-ink-500 ring-ink-200 focus-visible:ring-ov-500", chip: "bg-white text-ink-700 ring-ink-200 hover:ring-ov-300", karte: "bg-sand-50 ring-ink-200/70" };

  // ------------------------------------------------ Bestätigung
  if (zustand === "fertig" && ergebnis) {
    const automatisch = ergebnis.modus === "CloudTalk automatisch";
    return (
      <div className={cn("text-center", className)} role="status" aria-live="polite">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          {automatisch && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-ov-400/40 motion-reduce:hidden" />}
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-[0_12px_30px_-10px_rgba(102,153,51,0.8)]">
            {automatisch ? <PhoneCall aria-hidden="true" className="h-9 w-9" /> : ergebnis.wunschzeit ? <CalendarClock aria-hidden="true" className="h-9 w-9" /> : <Check aria-hidden="true" className="h-9 w-9" />}
          </span>
        </div>
        <p className={cn("mt-6 font-display text-[22px] font-extrabold leading-tight", t.text)}>
          {automatisch ? "Ihr Telefon klingelt gleich." : ergebnis.wunschzeit ? "Rückruf ist eingeplant." : "Wir rufen Sie zurück."}
        </p>
        <p className={cn("mx-auto mt-2 max-w-sm text-[15px] leading-relaxed", t.leise)}>
          {automatisch
            ? "Eine Beraterin oder ein Berater wird gerade mit Ihnen verbunden – bitte halten Sie Ihr Telefon bereit."
            : ergebnis.wunschzeit
              ? `Wir rufen Sie am ${datumText(ergebnis.wunschzeit)} Uhr an.`
              : "Ihre Anfrage ist bei unserem Team eingegangen – in der Regel melden wir uns innerhalb von 15 Minuten."}
        </p>
        {ergebnis.wunschzeit && (
          <KalenderLinks
            className="mt-6 justify-center"
            dunkel={dunkel}
            titel="Rückruf von Ökovolt"
            beschreibung="Ökovolt ruft Sie zu Ihrer Anfrage zurück. Fragen vorab: 08245 96 788 0"
            start={ergebnis.wunschzeit}
            minuten={15}
          />
        )}
      </div>
    );
  }

  // ------------------------------------------------ Formular
  return (
    <form onSubmit={absenden} noValidate className={cn("space-y-5", className)}>
      {/* Status */}
      <div className={cn("flex items-start gap-3 rounded-2xl p-3.5 ring-1", t.karte)} aria-live="polite">
        <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          {status?.offen && <span className="absolute inset-0 animate-ping rounded-full bg-ov-400 opacity-70 motion-reduce:hidden" />}
          <span className={cn("relative h-2.5 w-2.5 rounded-full", !status ? "bg-ink-300" : status.offen ? "bg-ov-500" : "bg-sun-500")} />
        </span>
        <div className="min-w-0 text-[14px] leading-snug">
          {!status ? (
            <p className={t.leise}>Verfügbarkeit wird geprüft …</p>
          ) : status.offen ? (
            <>
              <p className={cn("font-semibold", t.text)}>
                {status.sofort ? "Berater gerade frei" : "Jetzt erreichbar"}
                <span className={cn("font-normal", t.leise)}> · {status.detail}</span>
              </p>
              <p className={t.leise}>Rückruf {status.zusage}.</p>
            </>
          ) : (
            <>
              <p className={cn("font-semibold", t.text)}>
                {status.titel} <span className={cn("font-normal", t.leise)}>· {status.detail}</span>
              </p>
              <p className={t.leise}>Wählen Sie eine Wunschzeit – wir rufen Sie pünktlich an.</p>
            </>
          )}
        </div>
      </div>

      {/* Sofort oder Wunschzeit */}
      {status?.offen && (
        <div role="group" aria-label="Wann sollen wir anrufen?" className={cn("grid grid-cols-2 gap-1 rounded-full p-1 ring-1", t.karte)}>
          {[
            { id: "sofort", label: status.sofort ? "Sofort" : "So schnell wie möglich", icon: Zap },
            { id: "wunsch", label: "Wunschzeit", icon: CalendarClock },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={modus === o.id}
              onClick={() => setModus(o.id)}
              className={cn(
                "flex h-10 items-center justify-center gap-1.5 rounded-full px-2 text-[13.5px] font-semibold transition",
                modus === o.id ? "bg-ov-600 text-white shadow-sm" : dunkel ? "text-white/75 hover:text-white" : "text-ink-600 hover:text-ink-900"
              )}
            >
              <o.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">{o.label}</span>
            </button>
          ))}
        </div>
      )}

      {modus === "wunsch" && (
        <fieldset>
          <legend className={cn("mb-2 text-[13px] font-semibold", t.text)}>Wunschzeit</legend>
          {tage.length === 0 ? (
            <p className={cn("text-[14px]", t.leise)}>{status ? "Gerade sind keine Zeiten verfügbar." : "Lädt …"}</p>
          ) : (
            <>
              <div className="ov-no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {tage.map((d, i) => (
                  <button
                    key={d.ymd}
                    type="button"
                    aria-pressed={tag === i}
                    onClick={() => {
                      setTag(i);
                      setWunschzeit("");
                    }}
                    className={cn("h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-inset transition", tag === i ? "bg-navy-950 text-white ring-navy-950" : t.chip)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 grid max-h-[132px] grid-cols-4 gap-1.5 overflow-y-auto pr-0.5">
                {(tage[tag]?.slots || []).map((s) => (
                  <button
                    key={s.start}
                    type="button"
                    aria-pressed={wunschzeit === s.start}
                    onClick={() => setWunschzeit(s.start)}
                    className={cn("ov-num h-9 rounded-xl text-[13.5px] font-semibold ring-1 ring-inset transition", wunschzeit === s.start ? "bg-ov-600 text-white ring-ov-600" : t.chip)}
                  >
                    {s.zeit}
                  </button>
                ))}
              </div>
            </>
          )}
        </fieldset>
      )}

      {/* Telefon & Name */}
      <div className="grid gap-3">
        <label className="block">
          <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>Ihre Telefonnummer</span>
          <span className="relative block">
            <Phone aria-hidden="true" className={cn("pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2", dunkel ? "text-white/50" : "text-ink-400")} />
            <input
              ref={telefonFeld}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              onBlur={() => setTelefonBeruehrt(true)}
              placeholder="z. B. 0171 1234567"
              aria-invalid={telefonFehler}
              aria-describedby={telefonFehler ? telefonFehlerId : undefined}
              className={cn("h-12 w-full rounded-2xl pl-11 pr-11 text-[16px] ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2", t.feld, telefonFehler && "ring-red-400")}
            />
            {telefonOk && <Check aria-hidden="true" className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ov-500" />}
          </span>
          {telefonFehler && (
            <span id={telefonFehlerId} className={cn("mt-1.5 flex items-start gap-1.5 text-[12.5px]", dunkel ? "text-red-300" : "text-red-700")}>
              <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {FEHLER.telefon}
            </span>
          )}
        </label>
        <label className="block">
          <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>
            Name <span className={cn("font-normal", t.leise)}>(optional)</span>
          </span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wie dürfen wir Sie ansprechen?"
            className={cn("h-12 w-full rounded-2xl px-4 text-[16px] ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2", t.feld)}
          />
        </label>
      </div>

      <fieldset>
        <legend className={cn("mb-2 text-[13px] font-semibold", t.text)}>
          Worum geht es? <span className={cn("font-normal", t.leise)}>(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {THEMEN.slice(0, 6).map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={thema === x}
              onClick={() => setThema(thema === x ? "" : x)}
              className={cn("h-8 rounded-full px-3 text-[12.5px] font-semibold ring-1 ring-inset transition", thema === x ? "bg-navy-950 text-white ring-navy-950" : t.chip)}
            >
              {x}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Honeypot */}
      <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-ov-600" />
        <span className={cn("text-[13px] leading-relaxed", t.leise)}>
          Ökovolt darf mich unter dieser Nummer zu meiner Anfrage anrufen. Die Angaben werden nur dafür genutzt, Details in der{" "}
          <Link href="/datenschutz#rueckruf" className={cn("font-semibold underline underline-offset-2", dunkel ? "text-white" : "text-ov-700")}>
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>

      {fehler && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[13.5px] text-red-700 ring-1 ring-red-200">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {fehler}
        </p>
      )}

      <button
        type="submit"
        disabled={zustand === "sendet" || (status && !status.verfuegbar)}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ov-600 py-3.5 text-[16px] font-semibold text-white shadow-[0_10px_26px_-10px_rgba(102,153,51,0.8)] transition hover:bg-ov-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {zustand === "sendet" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <PhoneCall aria-hidden="true" className="h-5 w-5" />}
        {zustand === "sendet" ? "Wird gesendet …" : modus === "wunsch" ? "Rückruf einplanen" : status?.sofort ? "Jetzt zurückrufen lassen" : "Rückruf anfordern"}
      </button>

      <p className={cn("flex items-center justify-center gap-1.5 text-[12.5px]", t.leise)}>
        <Lock aria-hidden="true" className="h-3.5 w-3.5" />
        Kostenlos · keine Werbeanrufe · SSL-verschlüsselt
      </p>
    </form>
  );
}
