"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  HardHat,
  Info,
  MessageSquareText,
  PencilRuler,
  Phone,
  PlugZap,
  UserRound,
  UtilityPole,
} from "lucide-react";

/**
 * Prozess-Timeline „Photovoltaik aus einer Hand".
 *
 * Sechs Phasen von der Beratung bis zum Service – jede mit typischer Dauer
 * (als Orientierung), klarer Aufteilung „Was Sie tun / Was wir tun" und den
 * passenden Schritten aus dem Backoffice (fourth_card_information_table).
 *
 * Links (ab lg) eine mitlaufende Übersicht mit aktueller Phase, rechts die
 * Timeline mit einer Fortschrittslinie, die sich beim Scrollen füllt.
 * Bei prefers-reduced-motion ist die Linie von Anfang an gefüllt und es gibt
 * keine Übergänge – die Phasen-Anzeige aktualisiert sich trotzdem.
 */

const PHASEN = [
  {
    icon: MessageSquareText,
    kurz: "Beratung",
    titel: "Beratung & Vor-Ort-Termin",
    dauer: "wenige Tage bis ca. 2 Wochen",
    api: ["anfrage", "erstkontakt"],
    leadVon: "erstkontakt",
    lead: "Ein Fachberater meldet sich, klärt Ihren Bedarf und schaut sich Dach, Zählerschrank und Leitungswege bei Ihnen vor Ort an.",
    sie: ["Anfrage online oder telefonisch stellen", "Stromverbrauch der letzten Jahre bereithalten", "Vor-Ort-Termin wahrnehmen"],
    wir: ["Bedarf und Ziele klären (Speicher, Wallbox, Wärmepumpe)", "Dach, Statik-Hinweise und Zählerschrank prüfen", "Offene Fragen ehrlich beantworten"],
  },
  {
    icon: PencilRuler,
    kurz: "Planung",
    titel: "Planung & Angebot inkl. Ertragsprognose",
    dauer: "ca. 1–2 Wochen",
    api: ["projektierung", "angebot"],
    leadVon: "projektierung",
    lead: "Wir vermessen Ihr Dach, planen die Modulbelegung im Detail und rechnen transparent vor, was die Anlage erzeugt und spart.",
    sie: ["Angebot in Ruhe prüfen", "Varianten vergleichen, Fragen stellen", "Auftrag erteilen"],
    wir: ["Modulbelegung und Anlagengröße planen", "Ertragsprognose und Wirtschaftlichkeit erstellen", "Individuelles Angebot inkl. Förderhinweisen"],
  },
  {
    icon: UtilityPole,
    kurz: "Anmeldung",
    titel: "Netzanfrage & Anmeldung beim Netzbetreiber",
    dauer: "meist wenige Wochen, je nach Netzbetreiber",
    api: [],
    lead: "Bevor montiert wird, stellen wir die Netzanfrage mit allen technischen Unterlagen und stimmen uns mit Ihrem Netzbetreiber ab.",
    sie: ["Vollmacht unterschreiben – mehr nicht"],
    wir: ["Netzanschlussbegehren mit Datenblättern und Schaltplan stellen", "Rückfragen des Netzbetreibers klären", "Montagetermin mit Ihnen koordinieren"],
    hinweis: "Die Bearbeitungszeit hängt vom Netzbetreiber ab – sie ist oft der größte Zeitfaktor im ganzen Projekt.",
  },
  {
    icon: HardHat,
    kurz: "Montage",
    titel: "Montage durch unser eigenes Team",
    dauer: "meist 1–2 Tage beim Einfamilienhaus",
    api: ["montage"],
    leadVon: "montage",
    lead: "Unterkonstruktion, Module, Wechselrichter und auf Wunsch Speicher – sauber montiert und verkabelt von unserem eigenen Montageteam.",
    sie: ["Zugang zu Dach und Technikraum ermöglichen"],
    wir: ["Unterkonstruktion passend zur Dacheindeckung setzen", "Module, Wechselrichter und Speicher installieren", "DC- und AC-Verkabelung, Baustelle besenrein übergeben"],
  },
  {
    icon: PlugZap,
    kurz: "Übergabe",
    titel: "Inbetriebnahme & Marktstammdatenregister",
    dauer: "direkt nach Montage · MaStR binnen 1 Monat",
    api: ["übergabe", "uebergabe"],
    leadVon: "übergabe",
    lead: "Wir nehmen die Anlage in Betrieb, dokumentieren alles im Inbetriebnahmeprotokoll und erklären Ihnen Anlage und App.",
    sie: ["Einweisung mitnehmen", "Solarstrom ab dem ersten Tag nutzen"],
    wir: ["Inbetriebnahme und Protokoll", "Fertigmeldung an den Netzbetreiber", "Eintrag ins Marktstammdatenregister"],
    hinweis: "Die Registrierung im Marktstammdatenregister ist innerhalb eines Monats nach Inbetriebnahme Pflicht. Den Zählertausch terminiert der Messstellenbetreiber.",
  },
  {
    icon: Activity,
    kurz: "Service",
    titel: "Monitoring & Service",
    dauer: "über die gesamte Laufzeit",
    api: [],
    lead: "Ihre Anlage wird laufend überwacht. Fällt die Leistung ab, merken wir es – und unser eigenes Serviceteam kümmert sich.",
    sie: ["Erträge in der App verfolgen", "Bei Fragen einfach anrufen"],
    wir: ["Monitoring und Leistungskontrolle", "Wartung und Störungsbehebung durch eigenes Serviceteam", "Erweiterungen wie Speicher oder Wallbox"],
  },
];

const norm = (t = "") => t.toLowerCase().replace(/^ihre?\s+/, "").trim();

export default function ProzessTimeline({ schritte = [] }) {
  const listeRef = useRef(null);
  const fuellungRef = useRef(null);
  const knotenRefs = useRef([]);
  const [aktiv, setAktiv] = useState(0);
  const [ruhig, setRuhig] = useState(false);

  // API-Schritte mit Position (1-basiert) nachschlagen
  const apiIndex = new Map(schritte.map((s, i) => [norm(s?.title), { ...s, nr: i + 1 }]));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRuhig(mq.matches);
    let raf = 0;

    const messen = () => {
      raf = 0;
      const liste = listeRef.current;
      if (!liste) return;
      const anker = window.innerHeight * 0.55;
      const r = liste.getBoundingClientRect();
      const p = Math.min(Math.max((anker - r.top) / r.height, 0), 1);
      if (fuellungRef.current) fuellungRef.current.style.transform = `scaleY(${mq.matches ? 1 : p})`;
      let idx = 0;
      knotenRefs.current.forEach((k, i) => {
        if (k && k.getBoundingClientRect().top < anker) idx = i;
      });
      setAktiv(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(messen);
    };
    messen();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const phase = PHASEN[aktiv];
  const uebergang = ruhig ? "" : "transition-all duration-500";

  return (
    <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
      {/* Linke Spalte: Überschrift + mitlaufende Übersicht */}
      <div>
        <div className="lg:sticky lg:top-28">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-300" />
            Projektablauf
          </p>
          <h2 className="ov-h2 mt-4 text-white">
            Von der ersten Frage bis zum <span className="ov-text-gradient-light">eigenen Solarstrom</span>
          </h2>
          <p className="ov-lead mt-5 text-white/70">
            Sechs Phasen, ein Ansprechpartner. Sie treffen die Entscheidungen – Planung, Montage, Anmeldung und Service
            übernehmen wir. Vom Erstgespräch bis zur Inbetriebnahme vergehen meist einige Wochen.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
            {[
              ["6", "Phasen"],
              ["1", "Ansprechpartner"],
              ["1–2", "Montagetage*"],
            ].map(([w, l]) => (
              <div key={l} className="rounded-2xl bg-white/[0.05] px-4 py-4 ring-1 ring-white/10">
                <dt className="sr-only">{l}</dt>
                <dd className="ov-num font-display text-[26px] font-extrabold leading-none text-white md:text-[30px]">{w}</dd>
                <dd className="mt-1.5 text-[12.5px] leading-snug text-white/55">{l}</dd>
              </div>
            ))}
          </dl>

          {/* Fortschritt – nur ab lg, wo die Spalte mitläuft */}
          <div className="mt-6 hidden rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 lg:block" aria-hidden="true">
            <div className="flex items-center justify-between text-[13px] text-white/55">
              <span>Sie sind hier</span>
              <span className="ov-num">
                Phase {String(aktiv + 1).padStart(2, "0")} / {String(PHASEN.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 font-display text-[20px] font-bold leading-snug text-white">{phase.titel}</p>
            <div className="mt-5 grid grid-cols-6 gap-1.5">
              {PHASEN.map((p, i) => (
                <span key={p.kurz} className={`h-1.5 rounded-full ${uebergang} ${i <= aktiv ? "bg-ov-400" : "bg-white/15"}`} />
              ))}
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {PHASEN.map((p, i) => (
                <span key={p.kurz} className={`truncate text-[10.5px] ${i === aktiv ? "text-white" : "text-white/40"}`}>
                  {p.kurz}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/angebot"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-600"
            >
              Phase 1 jetzt starten
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+498245967880"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              08245 96 788 0
            </a>
          </div>
        </div>
      </div>

      {/* Rechte Spalte: Timeline */}
      <div>
      <ol ref={listeRef} className="relative">
        {/* Schiene + Füllung */}
        <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-0.5 rounded-full bg-white/10 md:left-[27px]" />
        <span
          ref={fuellungRef}
          aria-hidden="true"
          className="absolute bottom-6 left-[21px] top-6 w-0.5 origin-top rounded-full bg-gradient-to-b from-ov-300 via-ov-400 to-sun-300 md:left-[27px]"
          style={{ transform: "scaleY(0)" }}
        />

        {PHASEN.map((p, i) => {
          const Icon = p.icon;
          const erreicht = i <= aktiv;
          const aktuell = i === aktiv;
          const apiSchritte = p.api.map((k) => apiIndex.get(k)).filter(Boolean);
          const lead = (p.leadVon && apiIndex.get(p.leadVon)?.description?.trim()) || p.lead;

          return (
            <li key={p.titel} className="relative pb-8 pl-14 last:pb-0 md:pb-10 md:pl-20">
              <span
                ref={(el) => (knotenRefs.current[i] = el)}
                aria-hidden="true"
                className={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-2xl ring-1 md:h-14 md:w-14 ${uebergang} ${
                  erreicht
                    ? "bg-ov-500 text-white shadow-[0_0_0_6px_rgba(102,153,51,0.18),0_12px_30px_-8px_rgba(102,153,51,0.6)] ring-ov-300/50"
                    : "bg-navy-900 text-white/55 ring-white/15"
                }`}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.9} />
              </span>

              <article
                className={`rounded-3xl p-5 ring-1 sm:p-6 md:p-8 ${uebergang} ${
                  aktuell ? "bg-white/[0.08] ring-ov-300/35" : "bg-white/[0.035] ring-white/10"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="ov-num font-display text-[13px] font-bold tracking-wide text-ov-300">
                    Phase {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1 text-[12.5px] text-white/75 ring-1 ring-white/10">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" />
                    <span className="sr-only">Typische Dauer (Orientierung): </span>
                    {p.dauer}
                  </span>
                </div>

                <h3 className="ov-h3 mt-3 text-white">{p.titel}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">{lead}</p>

                {apiSchritte.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Enthaltene Schritte">
                    {apiSchritte.map((s) => (
                      <li key={s.nr} className="inline-flex items-center gap-1.5 rounded-full bg-ov-500/15 px-2.5 py-1 text-[12.5px] font-medium text-ov-200">
                        <span className="ov-num text-ov-300">{String(s.nr).padStart(2, "0")}</span>
                        {s.title}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Spalte titel="Was Sie tun" icon={UserRound} punkte={p.sie} />
                  <Spalte titel="Was wir tun" icon={BadgeCheck} punkte={p.wir} marke />
                </div>

                {p.hinweis && (
                  <p className="mt-4 flex gap-2.5 rounded-2xl bg-sun-300/10 px-4 py-3 text-[13.5px] leading-relaxed text-white/75 ring-1 ring-sun-300/20">
                    <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
                    {p.hinweis}
                  </p>
                )}
              </article>
            </li>
          );
        })}
      </ol>
      <p className="pl-14 pt-6 text-[12.5px] leading-relaxed text-white/45 md:pl-20">
          * Alle Zeitangaben sind Orientierungswerte aus typischen Projekten (Stand 2026). Die tatsächliche Dauer hängt von
          Anlagengröße, Wetter und der Bearbeitungszeit des Netzbetreibers ab.
      </p>
      </div>
    </div>
  );
}

function Spalte({ titel, icon: Icon, punkte, marke = false }) {
  return (
    <div className={`rounded-2xl p-4 ${marke ? "bg-ov-500/[0.12] ring-1 ring-ov-400/20" : "bg-white/[0.04] ring-1 ring-white/10"}`}>
      <p className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] ${marke ? "text-ov-300" : "text-white/60"}`}>
<Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {titel}
      </p>
      <ul className="mt-3 space-y-2">
        {punkte.map((t) => (
          <li key={t} className="flex gap-2 text-[14px] leading-snug text-white/80">
            <Check aria-hidden="true" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${marke ? "text-ov-300" : "text-white/40"}`} strokeWidth={3} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
