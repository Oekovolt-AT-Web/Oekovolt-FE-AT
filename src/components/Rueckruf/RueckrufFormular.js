"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarClock, Check, Loader2, Lock, Phone, PhoneCall } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { THEMEN, berlin, hhmm, oeffnungsStatus, slotsFuerArt, telefonNormalisieren } from "@/data/erreichbarkeit";
import KalenderLinks from "./KalenderLinks";
import { ereignis } from "@/lib/statistik";
import { tageAusApi } from "@/lib/terminSlots";

// Gleiche Terminart wie auf /termin („Telefon“) – so zeigen beide dieselben belegten Zeiten
const TERMINART = "Telefonische Beratung";

/** Rückfall ohne Kalender-API: lokale Zeiten (nicht mit Buchungen abgeglichen) */
const tageLokal = () =>
  slotsFuerArt("telefon").map((d) => ({ ...d, buchbar: d.slots.length > 0, slots: d.slots.map((s) => ({ ...s, frei: true })) }));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLZ_REGEX = /^\d{4,5}$/;

const datumText = (iso) =>
  new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/**
 * Rückruf anfordern – bucht einen kurzen Rückruf-Termin ("Telefonische
 * Beratung") über /api/rueckruf -> Frappe termin.buche_termin. Felder:
 * terminart, datum, uhrzeit, name_komplett, email, telefon, plz, thema,
 * nachricht, einwilligung, quelle, website (Honeypot). Öffnungsstatus und
 * Wunschzeiten werden rein lokal berechnet (@/data/erreichbarkeit) – kein
 * Netzwerkaufruf mehr nötig, um sie anzuzeigen.
 * dunkel: Darstellung auf Navy-Hintergrund
 */
export default function RueckrufFormular({ dunkel = false, autoFokus = false, className }) {
  const [tag, setTag] = useState(0);
  const [wunschzeit, setWunschzeit] = useState("");
  const [telefon, setTelefon] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plz, setPlz] = useState("");
  const [thema, setThema] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [einwilligung, setEinwilligung] = useState(false);
  const [zustand, setZustand] = useState("form"); // form | sendet | fertig
  const [fehler, setFehler] = useState("");
  const [ergebnis, setErgebnis] = useState(null);
  const [beruehrt, setBeruehrt] = useState({});
  const website = useRef(null);
  const telefonFeld = useRef(null);
  const telefonFehlerId = useId();

  const status = useMemo(() => oeffnungsStatus(), []);
  // null = Kalender lädt noch; danach Tage mit Slots { start, zeit, frei } wie auf /termin
  const [tage, setTage] = useState(null);

  // Freie und belegte Zeiten aus Frappe (gleiche Terminart wie beim Buchen) – sonst lokale Zeiten als Rückfall
  const kalenderLaden = useCallback(async () => {
    try {
      const r = await fetch(`/api/termin/kalender?terminart=${encodeURIComponent(TERMINART)}&tage=7`, { cache: "no-store" });
      const d = await r.json();
      if (r.ok && Array.isArray(d.kalender) && d.kalender.length) {
        setTage(tageAusApi(d.kalender).filter((t) => t.slots.length));
        return;
      }
    } catch {
      /* Rückfall unten */
    }
    setTage(tageLokal());
  }, []);

  useEffect(() => {
    kalenderLaden();
  }, [kalenderLaden]);

  // Beim ersten Laden auf den ersten buchbaren Tag springen
  useEffect(() => {
    if (!tage) return;
    setTag((i) => (tage[i]?.buchbar ? i : Math.max(0, tage.findIndex((t) => t.buchbar))));
  }, [tage]);

  useEffect(() => {
    if (autoFokus) telefonFeld.current?.focus();
  }, [autoFokus]);

  const telefonOk = Boolean(telefonNormalisieren(telefon));
  const emailOk = EMAIL_REGEX.test(email.trim());
  const plzOk = PLZ_REGEX.test(plz.trim());
  const telefonFehler = beruehrt.telefon && !telefonOk;
  const emailFehler = beruehrt.email && !emailOk;
  const plzFehler = beruehrt.plz && !plzOk;
  const nameFehler = beruehrt.name && !name.trim();

  async function absenden(e) {
    e.preventDefault();
    setBeruehrt({ telefon: true, email: true, plz: true, name: true });
    if (!name.trim()) return setFehler("Bitte geben Sie Ihren Namen an.");
    if (!telefonOk) return setFehler("Bitte eine gültige deutsche, österreichische oder Schweizer Rufnummer angeben.");
    if (!emailOk) return setFehler("Bitte eine gültige E-Mail-Adresse angeben.");
    if (!plzOk) return setFehler("Bitte eine gültige Postleitzahl angeben.");
    if (!wunschzeit) return setFehler("Bitte wählen Sie eine Wunschzeit.");
    if (!einwilligung) return setFehler("Bitte bestätigen Sie, dass wir Sie anrufen dürfen.");

    setFehler("");
    setZustand("sendet");
    const b = berlin(new Date(wunschzeit));
    try {
      const r = await fetch("/api/rueckruf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terminart: TERMINART,
          datum: b.ymd,
          uhrzeit: hhmm(b.minuten),
          name_komplett: name.trim(),
          email: email.trim(),
          telefon: telefonNormalisieren(telefon),
          plz: plz.trim(),
          thema,
          nachricht: nachricht.trim(),
          einwilligung: einwilligung ? 1 : 0,
          quelle: typeof window !== "undefined" ? window.location.pathname : "",
          website: website.current?.value || "",
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        const err = new Error(d.error || "backend");
        err.status = r.status;
        throw err;
      }
      setErgebnis({ wunschzeit });
      setZustand("fertig");
      ereignis("rueckruf_angefordert", { modus: "wunschzeit" });
    } catch (err) {
      if (err.status === 409) {
        // Zeit wurde inzwischen vergeben → Kalender neu laden, andere Zeit wählen lassen
        setWunschzeit("");
        kalenderLaden();
        setFehler("Diese Zeit wurde gerade vergeben. Bitte wählen Sie eine andere Uhrzeit.");
      } else {
        setFehler("Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: 08245 96 788 0.");
      }
      setZustand("form");
    }
  }

  const t = dunkel
    ? { text: "text-white", leise: "text-white/65", feld: "bg-white/10 text-white placeholder:text-white/40 ring-white/15 focus-visible:ring-ov-400", chip: "bg-white/10 text-white ring-white/15 hover:ring-white/40", karte: "bg-white/5 ring-white/10", belegt: "bg-white/[0.03] ring-white/10", belegtText: "text-white/30" }
    : { text: "text-ink-900", leise: "text-ink-600", feld: "bg-white text-ink-900 placeholder:text-ink-500 ring-ink-200 focus-visible:ring-ov-500", chip: "bg-white text-ink-700 ring-ink-200 hover:ring-ov-300", karte: "bg-sand-50 ring-ink-200/70", belegt: "bg-ink-50 ring-ink-100", belegtText: "text-ink-400" };

  // ------------------------------------------------ Bestätigung
  if (zustand === "fertig" && ergebnis) {
    return (
      <div className={cn("text-center", className)} role="status" aria-live="polite">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-[0_12px_30px_-10px_rgba(102,153,51,0.8)]">
            <CalendarClock aria-hidden="true" className="h-9 w-9" />
          </span>
        </div>
        <p className={cn("mt-6 font-display text-[22px] font-extrabold leading-tight", t.text)}>Rückruf ist eingeplant.</p>
        <p className={cn("mx-auto mt-2 max-w-sm text-[15px] leading-relaxed", t.leise)}>Wir rufen Sie am {datumText(ergebnis.wunschzeit)} Uhr an.</p>
        <KalenderLinks
          className="mt-6 justify-center"
          dunkel={dunkel}
          titel="Rückruf von Ökovolt"
          beschreibung="Ökovolt ruft Sie zu Ihrer Anfrage zurück. Fragen vorab: 08245 96 788 0"
          start={ergebnis.wunschzeit}
          minuten={15}
        />
      </div>
    );
  }

  // ------------------------------------------------ Formular
  return (
    <form onSubmit={absenden} noValidate className={cn("space-y-5", className)}>
      {/* Status */}
      <div className={cn("flex items-start gap-3 rounded-2xl p-3.5 ring-1", t.karte)} aria-live="polite">
        <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          {status.offen && <span className="absolute inset-0 animate-ping rounded-full bg-ov-400 opacity-70 motion-reduce:hidden" />}
          <span className={cn("relative h-2.5 w-2.5 rounded-full", status.offen ? "bg-ov-500" : "bg-sun-500")} />
        </span>
        <div className="min-w-0 text-[14px] leading-snug">
          <p className={cn("font-semibold", t.text)}>
            {status.titel} <span className={cn("font-normal", t.leise)}>· {status.detail}</span>
          </p>
          <p className={t.leise}>Wählen Sie eine Wunschzeit – wir rufen Sie pünktlich an.</p>
        </div>
      </div>

      {/* Wunschzeit */}
      <fieldset>
        <legend className={cn("mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold", t.text)}>
          Wunschzeit
          {tage?.[tag]?.slots.some((s) => !s.frei) && (
            <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-normal", t.leise)}>
              <span aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-sm ring-1", t.belegt)} />
              bereits vergeben
            </span>
          )}
        </legend>
        {tage === null ? (
          <p className={cn("flex items-center gap-2 text-[14px]", t.leise)}>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            Freie Zeiten werden geladen …
          </p>
        ) : !tage.some((d) => d.buchbar) ? (
          <p className={cn("text-[14px]", t.leise)}>Gerade sind keine Zeiten verfügbar. Rufen Sie uns gern direkt an: 08245 96 788 0.</p>
        ) : (
          <>
            <div className="ov-no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {tage.map((d, i) => (
                <button
                  key={d.ymd}
                  type="button"
                  disabled={!d.buchbar}
                  aria-pressed={tag === i}
                  aria-label={d.buchbar ? undefined : `${d.label} – ausgebucht`}
                  onClick={() => {
                    setTag(i);
                    setWunschzeit("");
                  }}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-inset transition",
                    !d.buchbar ? cn("cursor-not-allowed line-through", t.belegt, t.belegtText) : tag === i ? "bg-navy-950 text-white ring-navy-950" : t.chip
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid max-h-[132px] grid-cols-4 gap-1.5 overflow-y-auto pr-0.5">
              {(tage[tag]?.slots || []).map((s) =>
                s.frei ? (
                  <button
                    key={s.start}
                    type="button"
                    aria-pressed={wunschzeit === s.start}
                    onClick={() => {
                      setWunschzeit(s.start);
                      setFehler("");
                    }}
                    className={cn("ov-num h-9 rounded-xl text-[13.5px] font-semibold ring-1 ring-inset transition", wunschzeit === s.start ? "bg-ov-600 text-white ring-ov-600" : t.chip)}
                  >
                    {s.zeit}
                  </button>
                ) : (
                  <button
                    key={s.start}
                    type="button"
                    disabled
                    aria-label={`${s.zeit} Uhr – bereits vergeben`}
                    className={cn("ov-num h-9 cursor-not-allowed rounded-xl text-[13.5px] font-semibold line-through ring-1 ring-inset", t.belegt, t.belegtText)}
                  >
                    {s.zeit}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </fieldset>

      {/* Name, Telefon, E-Mail, PLZ */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>Name</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setBeruehrt((b) => ({ ...b, name: true }))}
            placeholder="Wie dürfen wir Sie ansprechen?"
            aria-invalid={nameFehler}
            className={cn("h-12 w-full rounded-2xl px-4 text-[16px] ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2", t.feld, nameFehler && "ring-red-400")}
          />
        </label>
        <label className="block">
          <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>Telefonnummer</span>
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
              onBlur={() => setBeruehrt((b) => ({ ...b, telefon: true }))}
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
              Bitte eine gültige Rufnummer angeben.
            </span>
          )}
        </label>
        <label className="block">
          <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>E-Mail-Adresse</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setBeruehrt((b) => ({ ...b, email: true }))}
            placeholder="name@beispiel.de"
            aria-invalid={emailFehler}
            className={cn("h-12 w-full rounded-2xl px-4 text-[16px] ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2", t.feld, emailFehler && "ring-red-400")}
          />
          {emailFehler && (
            <span className={cn("mt-1.5 flex items-start gap-1.5 text-[12.5px]", dunkel ? "text-red-300" : "text-red-700")}>
              <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Bitte eine gültige E-Mail-Adresse angeben.
            </span>
          )}
        </label>
        <label className="block">
          <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>PLZ</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            required
            value={plz}
            onChange={(e) => setPlz(e.target.value)}
            onBlur={() => setBeruehrt((b) => ({ ...b, plz: true }))}
            placeholder="86842"
            aria-invalid={plzFehler}
            className={cn("h-12 w-full rounded-2xl px-4 text-[16px] ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2", t.feld, plzFehler && "ring-red-400")}
          />
          {plzFehler && (
            <span className={cn("mt-1.5 flex items-start gap-1.5 text-[12.5px]", dunkel ? "text-red-300" : "text-red-700")}>
              <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Bitte eine gültige Postleitzahl angeben.
            </span>
          )}
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

      <label className="block">
        <span className={cn("mb-1.5 block text-[13px] font-semibold", t.text)}>
          Nachricht <span className={cn("font-normal", t.leise)}>(optional)</span>
        </span>
        <textarea
          rows={2}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          placeholder="z. B. Dachart, Jahresverbrauch, Wunsch nach Speicher"
          className={cn("w-full resize-y rounded-2xl px-4 py-3 text-[15px] leading-relaxed ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2", t.feld)}
        />
      </label>

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
        disabled={zustand === "sendet"}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ov-600 py-3.5 text-[16px] font-semibold text-white shadow-[0_10px_26px_-10px_rgba(102,153,51,0.8)] transition hover:bg-ov-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {zustand === "sendet" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <PhoneCall aria-hidden="true" className="h-5 w-5" />}
        {zustand === "sendet" ? "Wird gesendet …" : "Rückruf einplanen"}
      </button>

      <p className={cn("flex items-center justify-center gap-1.5 text-[12.5px]", t.leise)}>
        <Lock aria-hidden="true" className="h-3.5 w-3.5" />
        Kostenlos · keine Werbeanrufe · SSL-verschlüsselt
      </p>
    </form>
  );
}
