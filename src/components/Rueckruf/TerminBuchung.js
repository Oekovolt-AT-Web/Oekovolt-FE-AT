"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle, ArrowLeft, ArrowRight, CalendarCheck2, CalendarDays, Check, Clock, Loader2, Lock, MapPin, Phone, RefreshCw, Video,
} from "lucide-react";
import { cn } from "@/components/ui/cn";
import { TERMIN_ARTEN, THEMEN, telefonNormalisieren } from "@/data/erreichbarkeit";
import KalenderLinks from "./KalenderLinks";
import { oeffneRueckruf } from "./oeffnen";

const ICONS = { Phone, Video, MapPin };
const SCHRITTE = ["Art", "Termin", "Kontakt"];

const langDatum = (iso) =>
  new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));
const uhrzeit = (iso) => new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

const FEHLERTEXT = {
  belegt: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie eine andere Zeit.",
  einwilligung: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
  zu_viele: "Sie haben bereits mehrere Termine angefragt – wir melden uns bei Ihnen.",
  nicht_konfiguriert: "Die Online-Buchung ist gerade nicht verfügbar. Rufen Sie uns gern an: 08245 96 788 0.",
  backend: "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
};

export default function TerminBuchung() {
  const params = useSearchParams();
  const startArt = TERMIN_ARTEN.some((a) => a.id === params.get("art")) ? params.get("art") : null;

  const [schritt, setSchritt] = useState(startArt ? 1 : 0);
  const [artId, setArtId] = useState(startArt || "video");
  const [daten, setDaten] = useState({ laden: false, tage: [], verfuegbar: true, live: true });
  const [tagIndex, setTagIndex] = useState(0);
  const [slot, setSlot] = useState("");
  const [werte, setWerte] = useState({ name: "", email: "", telefon: "", plz: "", adresse: "", thema: "", nachricht: "" });
  const [einwilligung, setEinwilligung] = useState(false);
  const [beruehrt, setBeruehrt] = useState({});
  const [senden, setSenden] = useState(false);
  const [fehler, setFehler] = useState("");
  const [ergebnis, setErgebnis] = useState(null);
  const start = useRef(Date.now());
  const website = useRef(null);
  const kopf = useRef(null);

  const art = TERMIN_ARTEN.find((a) => a.id === artId);

  const laden = async (id = artId) => {
    setDaten((d) => ({ ...d, laden: true }));
    try {
      const r = await fetch(`/api/termin?art=${id}`, { cache: "no-store" });
      const d = await r.json();
      setDaten({ laden: false, tage: d.tage || [], verfuegbar: d.verfuegbar !== false, live: d.live !== false });
    } catch {
      setDaten({ laden: false, tage: [], verfuegbar: false, live: false });
    }
  };

  useEffect(() => {
    laden(artId);
    setTagIndex(0);
    setSlot("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artId]);

  const zu = (n) => {
    setSchritt(n);
    setFehler("");
    requestAnimationFrame(() => kopf.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const feldFehler = useMemo(() => {
    const f = {};
    if (werte.name.trim().length < 2) f.name = "Bitte Ihren Namen angeben.";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(werte.email.trim())) f.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (!telefonNormalisieren(werte.telefon)) f.telefon = "Bitte eine gültige Telefonnummer (DE, AT, CH) angeben.";
    if (!/^\d{4,5}$/.test(werte.plz.trim())) f.plz = "Bitte eine gültige Postleitzahl angeben.";
    if (art?.mitAdresse && werte.adresse.trim().length < 5) f.adresse = "Für den Vor-Ort-Termin brauchen wir Straße und Ort.";
    return f;
  }, [werte, art]);

  const setze = (k) => (e) => setWerte((w) => ({ ...w, [k]: e.target.value }));
  const verlasse = (k) => () => setBeruehrt((b) => ({ ...b, [k]: true }));

  async function buchen(e) {
    e.preventDefault();
    setBeruehrt({ name: true, email: true, telefon: true, plz: true, adresse: true });
    if (Object.keys(feldFehler).length) return setFehler("Bitte prüfen Sie die markierten Felder.");
    if (!einwilligung) return setFehler(FEHLERTEXT.einwilligung);

    setSenden(true);
    setFehler("");
    try {
      const r = await fetch("/api/termin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          art: artId,
          start: slot,
          ...werte,
          einwilligung,
          website: website.current?.value || "",
          dauer: Date.now() - start.current,
          seite: window.location.pathname,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (d.fehler === "belegt") {
          setSlot("");
          await laden();
          zu(1);
        }
        throw new Error(d.fehler || "backend");
      }
      setErgebnis(d);
      zu(3);
    } catch (err) {
      setFehler(FEHLERTEXT[err.message] || FEHLERTEXT.backend);
    } finally {
      setSenden(false);
    }
  }

  const tag = daten.tage[tagIndex];

  // ------------------------------------------------ Bestätigung
  if (schritt === 3 && ergebnis) {
    const ort = art.id === "vor-ort" ? werte.adresse : art.id === "video" ? "Video-Link folgt per E-Mail" : "Telefon – wir rufen Sie an";
    return (
      <div ref={kopf} className="scroll-mt-28 rounded-[2rem] bg-white p-6 text-center shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70 sm:p-10 md:p-14" role="status" aria-live="polite">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-[0_14px_34px_-12px_rgba(102,153,51,0.8)]">
          <CalendarCheck2 aria-hidden="true" className="h-9 w-9" />
        </span>
        <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.16em] text-ov-600">{ergebnis.bestaetigt ? "Termin gebucht" : "Terminwunsch eingegangen"}</p>
        <h2 className="ov-h2 mt-2 text-ink-900">
          {langDatum(ergebnis.start)}, {uhrzeit(ergebnis.start)} Uhr
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-ink-600">
          {art.titel} ({art.dauer} Min.) –{" "}
          {ergebnis.bestaetigt
            ? `die Bestätigung ist unterwegs an ${werte.email}.`
            : `wir bestätigen Ihren Wunschtermin in Kürze per E-Mail an ${werte.email}.`}
          {art.id === "video" && " Den Link zur Video-Beratung erhalten Sie mit der Bestätigung."}
        </p>
        {ergebnis.referenz && <p className="mt-3 text-[14px] text-ink-500">Buchungsnummer: <span className="ov-num font-semibold text-ink-900">{ergebnis.referenz}</span></p>}
        <KalenderLinks
          className="mt-8 justify-center"
          titel={`Ökovolt: ${art.titel}`}
          beschreibung={`${art.titel} mit Ökovolt (${art.dauer} Min.). Fragen oder Terminänderung: 08245 96 788 0 · office@oekovolt.de`}
          ort={ort}
          start={ergebnis.start}
          minuten={art.dauer}
        />
        <div className="mx-auto mt-10 grid max-w-2xl gap-3 border-t border-ink-100 pt-8 text-left sm:grid-cols-3">
          {[
            { t: "Vorbereiten", x: "Stromrechnung und – falls vorhanden – Fotos von Dach und Zählerschrank bereitlegen." },
            { t: "Ändern", x: "Termin passt nicht mehr? Kurze Nachricht an office@oekovolt.de genügt." },
            { t: "Vorab rechnen", x: <>Mit dem <Link href="/solarrechner" className="font-semibold text-ov-700 underline underline-offset-2">Solarrechner</Link> schon Ertrag und Ersparnis prüfen.</> },
          ].map((k) => (
            <div key={k.t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <p className="text-[14px] font-semibold text-ink-900">{k.t}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{k.x}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={kopf} className="grid scroll-mt-28 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 rounded-[2rem] bg-white p-5 shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70 sm:p-8 md:p-10">
        {/* Fortschritt */}
        <ol className="mb-8 flex items-center gap-2" aria-label="Fortschritt">
          {SCHRITTE.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={i > schritt || (i === 2 && !slot)}
                onClick={() => zu(i)}
                aria-current={i === schritt ? "step" : undefined}
                className="flex items-center gap-2 disabled:cursor-default"
              >
                <span className={cn("ov-num flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition", i < schritt ? "bg-ov-500 text-white" : i === schritt ? "bg-navy-950 text-white" : "bg-ink-100 text-ink-500")}>
                  {i < schritt ? <Check aria-hidden="true" className="h-4 w-4" /> : i + 1}
                </span>
                <span className={cn("hidden text-[14px] font-semibold sm:inline", i === schritt ? "text-ink-900" : "text-ink-500")}>{s}</span>
              </button>
              {i < SCHRITTE.length - 1 && <span aria-hidden="true" className={cn("h-0.5 flex-1 rounded-full", i < schritt ? "bg-ov-400" : "bg-ink-100")} />}
            </li>
          ))}
        </ol>

        {/* Schritt 1: Art */}
        {schritt === 0 && (
          <div>
            <h2 className="font-display text-[24px] font-extrabold tracking-tight text-ink-900 md:text-[28px]">Wie möchten Sie beraten werden?</h2>
            <p className="mt-2 text-[15.5px] text-ink-600">Alle Termine sind kostenlos und unverbindlich.</p>
            <div role="radiogroup" aria-label="Terminart" className="mt-7 grid gap-3 md:grid-cols-3">
              {TERMIN_ARTEN.map((a) => {
                const Icon = ICONS[a.icon];
                const aktiv = artId === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={aktiv}
                    onClick={() => setArtId(a.id)}
                    className={cn(
                      "relative flex h-full flex-col rounded-3xl p-5 text-left ring-1 transition",
                      aktiv ? "bg-ov-50/70 ring-2 ring-ov-500" : "bg-white ring-ink-200 hover:ring-ov-300"
                    )}
                  >
                    {a.empfohlen && <span className="absolute right-4 top-4 rounded-full bg-ov-500 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-white">Beliebt</span>}
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", aktiv ? "bg-ov-500 text-white" : "bg-sand-100 text-ov-600")}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="mt-4 text-[17px] font-bold text-ink-900">{a.titel}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {a.dauer} Minuten
                    </span>
                    <span className="mt-3 text-[14px] leading-relaxed text-ink-600">{a.text}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={() => zu(1)} className="inline-flex h-13 items-center gap-2 rounded-full bg-ov-500 px-7 py-3.5 text-[16px] font-semibold text-white transition hover:bg-ov-600">
                Freie Termine ansehen
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Schritt 2: Datum & Zeit */}
        {schritt === 1 && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-[24px] font-extrabold tracking-tight text-ink-900 md:text-[28px]">Wann passt es Ihnen?</h2>
                <p className="mt-2 text-[15.5px] text-ink-600">
                  {art.titel} · {art.dauer} Minuten · deutsche Zeit
                </p>
              </div>
              <button type="button" onClick={() => laden()} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-500 hover:text-ov-700">
                <RefreshCw aria-hidden="true" className={cn("h-3.5 w-3.5", daten.laden && "animate-spin")} />
                Aktualisieren
              </button>
            </div>

            {daten.laden && daten.tage.length === 0 ? (
              <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-hidden="true">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-ink-100" />
                ))}
              </div>
            ) : !daten.verfuegbar || daten.tage.length === 0 ? (
              <div className="mt-7 rounded-3xl bg-sand-50 p-6 text-center ring-1 ring-ink-200/60">
                <CalendarDays aria-hidden="true" className="mx-auto h-8 w-8 text-ink-400" />
                <p className="mt-3 font-semibold text-ink-900">Gerade können wir keine freien Zeiten anzeigen.</p>
                <p className="mt-1 text-[14.5px] text-ink-600">Wir rufen Sie gern zurück und finden gemeinsam einen Termin.</p>
                <button type="button" onClick={() => oeffneRueckruf()} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 px-5 text-[14.5px] font-semibold text-white">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Rückruf anfordern
                </button>
              </div>
            ) : (
              <>
                <div className="ov-no-scrollbar -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 pb-2" role="listbox" aria-label="Tag wählen">
                  {daten.tage.map((d, i) => {
                    const [, mo, ta] = d.ymd.split("-");
                    const aktiv = i === tagIndex;
                    return (
                      <button
                        key={d.ymd}
                        type="button"
                        role="option"
                        aria-selected={aktiv}
                        onClick={() => {
                          setTagIndex(i);
                          setSlot("");
                        }}
                        className={cn(
                          "flex w-[68px] shrink-0 flex-col items-center rounded-2xl py-2.5 ring-1 ring-inset transition",
                          aktiv ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-ink-800 ring-ink-200 hover:ring-ov-300"
                        )}
                      >
                        <span className={cn("text-[12px] font-semibold uppercase", aktiv ? "text-white/70" : "text-ink-500")}>{d.label.slice(0, 2)}</span>
                        <span className="ov-num font-display text-[21px] font-extrabold leading-tight">{Number(ta)}</span>
                        <span className={cn("text-[11.5px]", aktiv ? "text-white/70" : "text-ink-500")}>
                          {new Intl.DateTimeFormat("de-DE", { month: "short" }).format(new Date(Date.UTC(2026, Number(mo) - 1, 1)))}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {tag && (
                  <fieldset className="mt-5">
                    <legend className="mb-3 text-[14px] font-semibold text-ink-900">{langDatum(tag.slots[0].start)}</legend>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {tag.slots.map((s) => (
                        <button
                          key={s.start}
                          type="button"
                          aria-pressed={slot === s.start}
                          onClick={() => setSlot(s.start)}
                          className={cn(
                            "ov-num h-11 rounded-xl text-[15px] font-semibold ring-1 ring-inset transition",
                            slot === s.start ? "bg-ov-500 text-white ring-ov-500 shadow-[0_8px_20px_-8px_rgba(102,153,51,0.8)]" : "bg-white text-ink-800 ring-ink-200 hover:ring-ov-400"
                          )}
                        >
                          {s.zeit}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
              </>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => zu(0)} className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink-600 hover:text-ink-900">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Zurück
              </button>
              <button type="button" disabled={!slot} onClick={() => zu(2)} className="inline-flex h-13 items-center gap-2 rounded-full bg-ov-500 px-7 py-3.5 text-[16px] font-semibold text-white transition hover:bg-ov-600 disabled:cursor-not-allowed disabled:opacity-50">
                Weiter
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Schritt 3: Kontaktdaten */}
        {schritt === 2 && (
          <form onSubmit={buchen} noValidate>
            <h2 className="font-display text-[24px] font-extrabold tracking-tight text-ink-900 md:text-[28px]">Fast geschafft</h2>
            <p className="mt-2 text-[15.5px] text-ink-600">Wohin dürfen wir die Bestätigung schicken?</p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Feld label="Vor- und Nachname" name="name" autoComplete="name" wert={werte.name} setze={setze} verlasse={verlasse} fehler={beruehrt.name && feldFehler.name} className="sm:col-span-2" />
              <Feld label="E-Mail" name="email" type="email" inputMode="email" autoComplete="email" wert={werte.email} setze={setze} verlasse={verlasse} fehler={beruehrt.email && feldFehler.email} />
              <Feld label="Telefon" name="telefon" type="tel" inputMode="tel" autoComplete="tel" wert={werte.telefon} setze={setze} verlasse={verlasse} fehler={beruehrt.telefon && feldFehler.telefon} />
              <Feld label="PLZ" name="plz" inputMode="numeric" autoComplete="postal-code" wert={werte.plz} setze={setze} verlasse={verlasse} fehler={beruehrt.plz && feldFehler.plz} />
              {art.mitAdresse && (
                <Feld label="Straße, Hausnummer, Ort" name="adresse" autoComplete="street-address" wert={werte.adresse} setze={setze} verlasse={verlasse} fehler={beruehrt.adresse && feldFehler.adresse} />
              )}
            </div>

            <fieldset className="mt-6">
              <legend className="mb-2 text-[14px] font-semibold text-ink-900">
                Thema <span className="font-normal text-ink-500">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {THEMEN.map((x) => (
                  <button
                    key={x}
                    type="button"
                    aria-pressed={werte.thema === x}
                    onClick={() => setWerte((w) => ({ ...w, thema: w.thema === x ? "" : x }))}
                    className={cn("h-9 rounded-full px-3.5 text-[13.5px] font-semibold ring-1 ring-inset transition", werte.thema === x ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-ink-700 ring-ink-200 hover:ring-ov-300")}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block">
              <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">
                Nachricht <span className="font-normal text-ink-500">(optional)</span>
              </span>
              <textarea
                rows={3}
                value={werte.nachricht}
                onChange={setze("nachricht")}
                placeholder="z. B. Dachart, Jahresverbrauch, Wunsch nach Speicher oder Wallbox"
                className="w-full rounded-2xl bg-white px-4 py-3 text-[16px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
              />
            </label>

            <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-ov-600" />
              <span className="text-[13.5px] leading-relaxed text-ink-600">
                Ich bin einverstanden, dass Ökovolt meine Angaben zur Terminvereinbarung und Beratung verarbeitet und mich dazu per E-Mail oder Telefon kontaktiert. Einzelheiten in der{" "}
                <Link href="/datenschutz#rueckruf" className="font-semibold text-ov-700 underline underline-offset-2">
                  Datenschutzerklärung
                </Link>
                .
              </span>
            </label>

            {fehler && (
              <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[14px] text-red-700 ring-1 ring-red-200">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {fehler}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => zu(1)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink-600 hover:text-ink-900">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Zurück
              </button>
              <button type="submit" disabled={senden} className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ov-500 px-8 py-3.5 text-[16px] font-semibold text-white shadow-[0_10px_26px_-10px_rgba(102,153,51,0.8)] transition hover:bg-ov-600 disabled:opacity-60">
                {senden ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <CalendarCheck2 aria-hidden="true" className="h-5 w-5" />}
                {senden ? "Wird gebucht …" : "Termin verbindlich anfragen"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Zusammenfassung */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[1.75rem] bg-navy-950 p-6 text-white">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ihr Termin</p>
          <dl className="mt-4 space-y-4">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                {(() => {
                  const Icon = ICONS[art.icon];
                  return <Icon aria-hidden="true" className="h-4 w-4" />;
                })()}
              </span>
              <div>
                <dt className="text-[12.5px] text-white/55">Art</dt>
                <dd className="text-[15px] font-semibold">{art.titel}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <dt className="text-[12.5px] text-white/55">Datum & Uhrzeit</dt>
                <dd className="text-[15px] font-semibold">{slot ? `${langDatum(slot)}, ${uhrzeit(slot)} Uhr` : "noch nicht gewählt"}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                <Clock aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <dt className="text-[12.5px] text-white/55">Dauer</dt>
                <dd className="text-[15px] font-semibold">{art.dauer} Minuten · kostenlos</dd>
              </div>
            </div>
          </dl>
          <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-[13.5px] text-white/70">
            {["Persönlicher Fachberater, kein Callcenter", "Bestätigung & Kalendereintrag per E-Mail", "Jederzeit kostenfrei verschieben"].map((x) => (
              <li key={x} className="flex gap-2">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-ink-500">
          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
          Verschlüsselte Übertragung · keine Weitergabe an Dritte
        </p>
      </aside>
    </div>
  );
}

function Feld({ label, name, type = "text", wert, setze, verlasse, fehler, className, ...rest }) {
  const id = `termin-${name}`;
  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">{label}</span>
      <input
        id={id}
        type={type}
        value={wert}
        onChange={setze(name)}
        onBlur={verlasse(name)}
        aria-invalid={Boolean(fehler)}
        aria-describedby={fehler ? `${id}-fehler` : undefined}
        className={cn(
          "h-12 w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 ring-1 ring-inset transition placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
          fehler ? "ring-red-400" : "ring-ink-200"
        )}
        {...rest}
      />
      {fehler && (
        <span id={`${id}-fehler`} className="mt-1 block text-[13px] text-red-600">
          {fehler}
        </span>
      )}
    </label>
  );
}
