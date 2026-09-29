"use client";

import { FIRMA } from "@/lib/site";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle, ArrowLeft, ArrowRight, CalendarCheck2, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Loader2, Lock, MapPin, Phone, RefreshCw, Video,
} from "lucide-react";
import { cn } from "@/components/ui/cn";
import { TERMIN_ARTEN, THEMEN, berlin, hhmm, slotsFuerArt, telefonNormalisieren, themaAusParam } from "@/data/erreichbarkeit";
import { tageAusApi } from "@/lib/terminSlots";
import KalenderLinks from "./KalenderLinks";
import { oeffneRueckruf } from "./oeffnen";
import { ereignis } from "@/lib/statistik";
import { herkunft } from "@/lib/herkunft";

const ICONS = { Phone, Video, MapPin };
const SCHRITTE = ["Art", "Termin", "Kontakt"];

const langDatum = (iso) =>
  new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));
const uhrzeit = (iso) => new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

const FEHLERTEXT = {
  einwilligung: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
  backend: "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
  vergeben: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie eine andere Uhrzeit.",
};

/**
 * Horizontale Tagesleiste: Pfeile, Ziehen mit der Maus und Mausrad scrollen seitlich.
 * Touch/Trackpad scrollen wie gewohnt nativ.
 */
function TageLeiste({ aktivIndex, children }) {
  const leiste = useRef(null);
  const zug = useRef(null);
  const [rand, setRand] = useState({ links: false, rechts: false });

  const pruefeRand = () => {
    const el = leiste.current;
    if (!el) return;
    setRand({ links: el.scrollLeft > 4, rechts: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };

  useEffect(() => {
    const el = leiste.current;
    if (!el) return;
    pruefeRand();
    // Mausrad (vertikal) seitlich scrollen – am Ende scrollt wieder die Seite
    const rad = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", rad, { passive: false });
    window.addEventListener("resize", pruefeRand);
    return () => {
      el.removeEventListener("wheel", rad);
      window.removeEventListener("resize", pruefeRand);
    };
  }, []);

  // Gewählten Tag sichtbar halten
  useEffect(() => {
    const el = leiste.current;
    const knopf = el?.children[aktivIndex];
    if (!el || !knopf) return;
    const links = knopf.offsetLeft - el.offsetLeft;
    if (links < el.scrollLeft || links + knopf.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: links - el.clientWidth / 2 + knopf.offsetWidth / 2, behavior: "smooth" });
    }
  }, [aktivIndex]);

  const blaettern = (richtung) => {
    const el = leiste.current;
    el?.scrollBy({ left: richtung * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Klicken und Ziehen mit der Maus
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    zug.current = { x: e.clientX, start: leiste.current.scrollLeft, bewegt: false };
  };
  const onPointerMove = (e) => {
    const z = zug.current;
    if (!z) return;
    const dx = e.clientX - z.x;
    if (!z.bewegt && Math.abs(dx) > 5) {
      z.bewegt = true;
      leiste.current.setPointerCapture?.(e.pointerId);
    }
    if (z.bewegt) leiste.current.scrollLeft = z.start - dx;
  };
  const onPointerUp = (e) => {
    const z = zug.current;
    zug.current = null;
    if (z?.bewegt) {
      leiste.current.releasePointerCapture?.(e.pointerId);
      // Klick nach dem Ziehen nicht als Tagesauswahl werten
      const stopp = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      leiste.current.addEventListener("click", stopp, { capture: true, once: true });
      setTimeout(() => leiste.current?.removeEventListener("click", stopp, { capture: true }), 0);
    }
  };

  const pfeil =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink-800 shadow-sm ring-1 ring-ink-200 transition hover:bg-ov-50 hover:text-ov-700 hover:ring-ov-300 disabled:cursor-default disabled:bg-ink-50 disabled:text-ink-300 disabled:shadow-none disabled:ring-ink-100 sm:h-12 sm:w-12";

  // Weiche Kanten, solange es in die Richtung noch weitergeht
  const maske = `linear-gradient(to right, ${rand.links ? "transparent" : "#000"} 0, #000 ${rand.links ? "28px" : "0"}, #000 calc(100% - ${rand.rechts ? "28px" : "0px"}), ${rand.rechts ? "transparent" : "#000"} 100%)`;

  return (
    <div className="mt-7 flex items-center gap-2 sm:gap-3">
      <button type="button" onClick={() => blaettern(-1)} disabled={!rand.links} aria-label="Frühere Tage" className={pfeil}>
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <div
        ref={leiste}
        onScroll={pruefeRand}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
        style={{ maskImage: maske, WebkitMaskImage: maske }}
        className="ov-no-scrollbar flex min-w-0 flex-1 cursor-grab select-none gap-2 overflow-x-auto py-1 active:cursor-grabbing"
        role="group"
        aria-label="Tag wählen"
      >
        {children}
      </div>
      <button type="button" onClick={() => blaettern(1)} disabled={!rand.rechts} aria-label="Spätere Tage" className={pfeil}>
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}

/** Fallback without API: local times (not checked against bookings) */
function tageLokal(artId) {
  return slotsFuerArt(artId).map((d) => ({
    ...d,
    status: d.slots.length ? "frei" : "geschlossen",
    buchbar: d.slots.length > 0,
    slots: d.slots.map((s) => ({ ...s, frei: true })),
  }));
}

export default function TerminBuchung({ kalender = null }) {
  const params = useSearchParams();
  const router = useRouter();
  const [aktualisiert, startTransition] = useTransition();
  const startArt = TERMIN_ARTEN.some((a) => a.id === params.get("art")) ? params.get("art") : null;

  const [schritt, setSchritt] = useState(startArt ? 1 : 0);
  const [artId, setArtId] = useState(startArt || "video");
  const [daten, setDaten] = useState({ laden: false, tage: [], verfuegbar: true, live: true });
  const [tagIndex, setTagIndex] = useState(0);
  const [slot, setSlot] = useState("");
  // ?thema=gewerbe|freiflaeche|… (Links der Zielgruppenseiten) belegt das Thema vor
  const [werte, setWerte] = useState(() => ({ name: "", firma: "", email: "", telefon: "", plz: "", adresse: "", thema: themaAusParam(params.get("thema")), nachricht: "" }));
  const [einwilligung, setEinwilligung] = useState(false);
  const [beruehrt, setBeruehrt] = useState({});
  const [senden, setSenden] = useState(false);
  const [fehler, setFehler] = useState("");
  const [ergebnis, setErgebnis] = useState(null);
  const website = useRef(null);
  const kopf = useRef(null);

  const art = TERMIN_ARTEN.find((a) => a.id === artId);

  // Builds the days: API data if available, otherwise local fallback
  const aufbauen = (id, zuruecksetzen) => {
    const a = TERMIN_ARTEN.find((x) => x.id === id);
    const api = kalender?.[a?.titel];
    const live = Array.isArray(api) && api.length > 0;
    const tage = live ? tageAusApi(api) : tageLokal(id);

    setDaten({ laden: false, tage, verfuegbar: tage.some((d) => d.buchbar), live });

    if (zuruecksetzen) {
      const erster = tage.findIndex((d) => d.buchbar);
      setTagIndex(erster >= 0 ? erster : 0);
      setSlot("");
    } else {
      // after refresh: discard the chosen time if it is no longer free
      const nochFrei = (s) => tage.some((d) => d.slots.some((x) => x.start === s && x.frei));
      setSlot((s) => (s && !nochFrei(s) ? "" : s));
    }
  };

  // New Terminart → rebuild and reset selection
  useEffect(() => {
    aufbauen(artId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artId]);

  // New server data (after "Aktualisieren") → rebuild, keep selection if still free
  useEffect(() => {
    aufbauen(artId, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kalender]);

  // Reload calendar from the server (runs page.js again → new kalender prop)
  const laden = () => startTransition(() => router.refresh());

  const zu = (n) => {
    setSchritt(n);
    setFehler("");
    requestAnimationFrame(() => kopf.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const feldFehler = useMemo(() => {
    const f = {};
    if (werte.name.trim().length < 2) f.name = "Bitte Ihren Namen angeben.";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(werte.email.trim())) f.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (!telefonNormalisieren(werte.telefon)) f.telefon = "Bitte eine gültige Telefonnummer (AT, DE, CH) angeben.";
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
    const b = berlin(new Date(slot));
    // Unternehmen/Organisation kennt das Termin-Backend nicht als eigenes Feld -> in die Nachricht
    const nachricht = [werte.firma.trim() ? `Unternehmen/Organisation: ${werte.firma.trim()}` : "", werte.nachricht.trim(), art.mitAdresse && werte.adresse.trim() ? `Adresse: ${werte.adresse.trim()}` : ""].filter(Boolean).join("\n\n");
    try {
      const r = await fetch("/api/termin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terminart: art.titel,
          datum: b.ymd,
          uhrzeit: hhmm(b.minuten),
          name_komplett: werte.name.trim(),
          email: werte.email.trim(),
          telefon: telefonNormalisieren(werte.telefon),
          plz: werte.plz.trim(),
          thema: werte.thema,
          nachricht,
          einwilligung: einwilligung ? 1 : 0,
          quelle: window.location.pathname,
          website: website.current?.value || "",
          // Kampagnen-Zuordnung – /api/termin hängt sie als Textzeile an `nachricht` an (kein eigenes Frappe-Feld)
          herkunft: herkunft(),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        const err = new Error(d.error || "backend");
        err.status = r.status;
        throw err;
      }
      setErgebnis({ referenz: d?.data?.message?.referenz || null });
      ereignis("termin_gebucht", { art: artId });
      zu(3);
    } catch (err) {
      if (err.status === 409) {
        // slot was taken in the meantime → back to time selection with fresh data
        setSlot("");
        laden();
        zu(1);
        setFehler(FEHLERTEXT.vergeben);
      } else {
        setFehler(FEHLERTEXT.backend);
      }
    } finally {
      setSenden(false);
    }
  }

  const tag = daten.tage[tagIndex];
  const laedt = daten.laden || aktualisiert;

  // ------------------------------------------------ Bestätigung
  if (schritt === 3 && ergebnis) {
    const ort = art.id === "vor-ort" ? werte.adresse : art.id === "video" ? "Video-Link folgt per E-Mail" : "Telefon – wir rufen Sie an";
    return (
      <div ref={kopf} className="scroll-mt-28 rounded-[2rem] bg-white p-6 text-center shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70 sm:p-10 md:p-14" role="status" aria-live="polite">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-[0_14px_34px_-12px_rgba(102,153,51,0.8)]">
          <CalendarCheck2 aria-hidden="true" className="h-9 w-9" />
        </span>
        <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.16em] text-ov-600">Termin gebucht</p>
        <h2 className="ov-h2 mt-2 text-ink-900">
          {langDatum(slot)}, {uhrzeit(slot)} Uhr
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-ink-600">
          {art.titel} ({art.dauer} Min.) – die Bestätigung ist unterwegs an {werte.email}.
          {art.id === "video" && " Den Link zur Video-Beratung erhalten Sie mit der Bestätigung."}
        </p>
        {ergebnis.referenz && <p className="mt-3 text-[14px] text-ink-500">Buchungsnummer: <span className="ov-num font-semibold text-ink-900">{ergebnis.referenz}</span></p>}
        <KalenderLinks
          className="mt-8 justify-center"
          titel={`Ökovolt: ${art.titel}`}
          beschreibung={`${art.titel} mit Ökovolt (${art.dauer} Min.). Fragen oder Terminänderung: ${FIRMA.telefon} · ${FIRMA.email}`}
          ort={ort}
          start={slot}
          minuten={art.dauer}
        />
        <div className="mx-auto mt-10 grid max-w-2xl gap-3 border-t border-ink-100 pt-8 text-left sm:grid-cols-3">
          {[
            { t: "Vorbereiten", x: "Strom- bzw. Netzrechnung, falls vorhanden Lastgang (15-Minuten-Werte) sowie Fotos oder Pläne von Dach und Trafo/Zählerplatz bereitlegen." },
            { t: "Ändern", x: "Termin passt nicht mehr? Kurze Nachricht an office@oekovolt.com genügt." },
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
                <span className={cn("ov-num flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition", i < schritt ? "bg-ov-600 text-white" : i === schritt ? "bg-navy-950 text-white" : "bg-ink-100 text-ink-600")}>
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
            <div role="group" aria-label="Terminart" className="mt-7 grid gap-3 md:grid-cols-3">
              {TERMIN_ARTEN.map((a) => {
                const Icon = ICONS[a.icon];
                const aktiv = artId === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => setArtId(a.id)}
                    className={cn(
                      "relative flex h-full flex-col rounded-3xl p-5 text-left ring-1 transition",
                      aktiv ? "bg-ov-50/70 ring-2 ring-ov-500" : "bg-white ring-ink-200 hover:ring-ov-300"
                    )}
                  >
                    {a.empfohlen && <span className="absolute right-4 top-4 rounded-full bg-ov-600 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-white">Beliebt</span>}
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", aktiv ? "bg-ov-500 text-white" : "bg-sand-100 text-ov-600")}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="mt-4 text-[17px] font-bold text-ink-900">{a.titel}</span>
                    <span className={cn("mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium", aktiv ? "text-ink-600" : "text-ink-500")}>
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {a.dauer} Minuten
                    </span>
                    <span className="mt-3 text-[14px] leading-relaxed text-ink-600">{a.text}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={() => zu(1)} className="inline-flex h-13 items-center gap-2 rounded-full bg-ov-600 px-7 py-3.5 text-[16px] font-semibold text-white transition hover:bg-ov-700">
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
                  {art.titel} · {art.dauer} Minuten · österreichische Zeit
                </p>
                {!daten.live && <p className="mt-1 text-[13px] text-ink-500">Die Verfügbarkeit wird bei der Buchung geprüft.</p>}
              </div>
              <button type="button" onClick={laden} disabled={laedt} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-500 hover:text-ov-700 disabled:opacity-60">
                <RefreshCw aria-hidden="true" className={cn("h-3.5 w-3.5", laedt && "animate-spin")} />
                Aktualisieren
              </button>
            </div>

            {fehler && (
              <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[14px] text-red-700 ring-1 ring-red-200">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {fehler}
              </p>
            )}

            {laedt && daten.tage.length === 0 ? (
              <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-hidden="true">
                {Array.from({ length: 40 }).map((_, i) => (
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
                <TageLeiste aktivIndex={tagIndex}>
                  {daten.tage.map((d, i) => {
                    const [, mo, ta] = d.ymd.split("-");
                    const aktiv = i === tagIndex;
                    const zu_ = !d.buchbar;
                    const hinweis = d.status === "ausgebucht" ? "voll" : "zu";
                    return (
                      <button
                        key={d.ymd}
                        type="button"
                        aria-pressed={aktiv}
                        disabled={zu_}
                        aria-label={zu_ ? `${d.label} – ${d.status === "ausgebucht" ? "ausgebucht" : "geschlossen"}` : d.label}
                        onClick={() => {
                          setTagIndex(i);
                          setSlot("");
                        }}
                        className={cn(
                          "flex w-[68px] shrink-0 flex-col items-center rounded-2xl py-2.5 ring-1 ring-inset transition",
                          zu_
                            ? "cursor-not-allowed bg-ink-50 text-ink-400 ring-ink-100"
                            : aktiv
                              ? "bg-navy-950 text-white ring-navy-950"
                              : "bg-white text-ink-800 ring-ink-200 hover:ring-ov-300"
                        )}
                      >
                        <span className={cn("text-[12px] font-semibold uppercase", aktiv && !zu_ ? "text-white/70" : zu_ ? "text-ink-400" : "text-ink-500")}>{d.label.slice(0, 2)}</span>
                        <span className={cn("ov-num font-display text-[21px] font-extrabold leading-tight", zu_ && "line-through decoration-1")}>{Number(ta)}</span>
                        <span className={cn("text-[11.5px]", aktiv && !zu_ ? "text-white/70" : zu_ ? "text-ink-400" : "text-ink-500")}>
                          {zu_ ? hinweis : new Intl.DateTimeFormat("de-AT", { month: "short" }).format(new Date(Date.UTC(2026, Number(mo) - 1, 1)))}
                        </span>
                      </button>
                    );
                  })}
                </TageLeiste>

                {tag && tag.buchbar && (
                  <fieldset className="mt-5">
                    <legend className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-semibold text-ink-900">
                      {langDatum(`${tag.ymd}T12:00:00Z`)}
                      {tag.slots.some((s) => !s.frei) && (
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-normal text-ink-500">
                          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-ink-100 ring-1 ring-ink-200" />
                          bereits vergeben
                        </span>
                      )}
                    </legend>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {tag.slots.map((s) =>
                        s.frei ? (
                          <button
                            key={s.start}
                            type="button"
                            aria-pressed={slot === s.start}
                            onClick={() => {
                              setSlot(s.start);
                              setFehler("");
                            }}
                            className={cn(
                              "ov-num h-11 rounded-xl text-[15px] font-semibold ring-1 ring-inset transition",
                              slot === s.start ? "bg-ov-600 text-white ring-ov-600 shadow-[0_8px_20px_-8px_rgba(102,153,51,0.8)]" : "bg-white text-ink-800 ring-ink-200 hover:ring-ov-400"
                            )}
                          >
                            {s.zeit}
                          </button>
                        ) : (
                          <button
                            key={s.start}
                            type="button"
                            disabled
                            aria-label={`${s.zeit} Uhr – bereits vergeben`}
                            className="ov-num h-11 cursor-not-allowed rounded-xl bg-ink-50 text-[15px] font-semibold text-ink-400 line-through ring-1 ring-inset ring-ink-100"
                          >
                            {s.zeit}
                          </button>
                        )
                      )}
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
              <button type="button" disabled={!slot} onClick={() => zu(2)} className="inline-flex h-13 items-center gap-2 rounded-full bg-ov-600 px-7 py-3.5 text-[16px] font-semibold text-white transition hover:bg-ov-700 disabled:cursor-not-allowed disabled:opacity-50">
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
              <Feld label="Vor- und Nachname" name="name" autoComplete="name" wert={werte.name} setze={setze} verlasse={verlasse} fehler={beruehrt.name && feldFehler.name} />
              <Feld label="Unternehmen / Gemeinde (optional)" name="firma" autoComplete="organization" wert={werte.firma} setze={setze} verlasse={verlasse} />
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
                placeholder="z. B. Hallendach, Jahresverbrauch, Lastgang vorhanden, Netzebene, Speicher oder Ladepunkte gewünscht"
                className="w-full rounded-2xl bg-white px-4 py-3 text-[16px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
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
              <button type="submit" disabled={senden} className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ov-600 px-8 py-3.5 text-[16px] font-semibold text-white shadow-[0_10px_26px_-10px_rgba(102,153,51,0.8)] transition hover:bg-ov-700 disabled:opacity-60">
                {senden ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <CalendarCheck2 aria-hidden="true" className="h-5 w-5" />}
                {senden ? "Wird gebucht …" : "Kostenlosen Termin anfragen"}
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
            {/* dl-Gruppen enthalten nur dt/dd – Symbol steckt (dekorativ) im dt */}
            <div className="relative min-h-10 pl-13">
              <dt className="text-[12.5px] text-white/55">
                <span aria-hidden="true" className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                  {(() => {
                    const Icon = ICONS[art.icon];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </span>
                Art
              </dt>
              <dd className="text-[15px] font-semibold">{art.titel}</dd>
            </div>
            <div className="relative min-h-10 pl-13">
              <dt className="text-[12.5px] text-white/55">
                <span aria-hidden="true" className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                  <CalendarDays className="h-4 w-4" />
                </span>
                Datum & Uhrzeit
              </dt>
              <dd className="text-[15px] font-semibold">{slot ? `${langDatum(slot)}, ${uhrzeit(slot)} Uhr` : "noch nicht gewählt"}</dd>
            </div>
            <div className="relative min-h-10 pl-13">
              <dt className="text-[12.5px] text-white/55">
                <span aria-hidden="true" className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                  <Clock className="h-4 w-4" />
                </span>
                Dauer
              </dt>
              <dd className="text-[15px] font-semibold">{art.dauer} Minuten · kostenlos</dd>
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
          "h-12 w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 ring-1 ring-inset transition placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
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