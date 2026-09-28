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
import { FIRMA } from "@/lib/site";

/**
 * Prozess-Timeline „Photovoltaik aus einer Hand“ – Gewerbeprojekt in Österreich.
 *
 * Sechs Phasen von der Lastganganalyse bis zum Betrieb – jede mit typischer
 * Dauer (als Orientierung) und klarer Aufteilung „Was Sie tun / Was wir tun“.
 * Netzanschluss nach österreichischem Ablauf: Netzzugangsantrag beim
 * Netzbetreiber, TOR Stromerzeugungsanlagen, Fertigstellungsmeldung durch den
 * Elektrotechniker, Stromabnehmer (Händler oder OeMAG), Herkunftsnachweise.
 * Die frühere Anbindung an Backoffice-Schritte (Prop `schritte`) bleibt als
 * Schnittstelle erhalten, wird aber nicht mehr befüllt.
 *
 * Links (ab lg) eine mitlaufende Übersicht mit aktueller Phase, rechts die
 * Timeline mit einer Fortschrittslinie, die sich beim Scrollen füllt.
 * Bei prefers-reduced-motion ist die Linie von Anfang an gefüllt.
 */

const PHASEN = [
  {
    icon: MessageSquareText,
    kurz: "Analyse",
    titel: "Lastganganalyse & Standortbegehung",
    dauer: "ca. 1–3 Wochen",
    api: [],
    lead: "Wir werten Ihren Lastgang aus, besichtigen Dach, Tragwerk und Elektroverteilung und klären das Ziel: Eigenverbrauch, Peak Shaving, Volleinspeisung oder Nachhaltigkeitsbericht.",
    sie: ["Lastgang (Viertelstundenwerte) aus dem Netzbetreiber-Portal bereitstellen", "Dachpläne und Statikunterlagen, falls vorhanden", "Ansprechpartner für Technik und Einkauf benennen"],
    wir: ["Lastgang und Stromrechnungen auswerten", "Dach, Tragwerksreserve, Brandabschnitte und Verteilung prüfen", "Schneelast- und Windzone für den Standort bestimmen"],
  },
  {
    icon: PencilRuler,
    kurz: "Planung",
    titel: "Planung, Statik & Wirtschaftlichkeit",
    dauer: "ca. 2–4 Wochen",
    api: [],
    lead: "Belegungsplan, Stringplanung, Statik-Nachweis und eine Wirtschaftlichkeitsrechnung, die Geschäftsführung und Einkauf nachvollziehen können.",
    sie: ["Varianten prüfen und entscheiden", "Förderstrategie und Finanzierung festlegen", "Auftrag erteilen"],
    wir: ["Modulbelegung, Unterkonstruktion und Wechselrichter-Topologie planen", "Ertragsprognose, Eigenverbrauch und Amortisation rechnen", "Brandschutzkonzept nach OVE R 11-1 vorbereiten"],
    hinweis: "Förderungen wie der EAG-Investitionszuschuss müssen vor der Bestellung beantragt werden – wir planen die Fördercalls in den Zeitplan ein.",
  },
  {
    icon: UtilityPole,
    kurz: "Netz",
    titel: "Netzzugangsantrag & Genehmigungen",
    dauer: "wenige Wochen bis Monate, je nach Netzbetreiber und Größe",
    api: [],
    lead: "Wir stellen den Netzzugangsantrag beim zuständigen Netzbetreiber, klären Anschlusspunkt und -leistung und – wo nötig – Bauanzeige oder Baubewilligung nach der Bauordnung des Bundeslandes.",
    sie: ["Vollmacht unterschreiben", "Netzzugangsvertrag gegenzeichnen"],
    wir: ["Netzzugangsantrag mit Datenblättern und Schaltplan einreichen", "Anforderungen nach TOR Stromerzeugungsanlagen (Typ A/B) klären", "Bau- bzw. elektrizitätsrechtliche Verfahren vorbereiten"],
    hinweis: "Ab 250 kW (Typ B) oder mit Mittelspannungsanschluss sind Netzprüfung und Parkregler-Nachweise der größte Zeitfaktor im Projekt.",
  },
  {
    icon: HardHat,
    kurz: "Montage",
    titel: "Montage & Elektroinstallation",
    dauer: "wenige Tage bis mehrere Wochen, je nach Größe",
    api: [],
    lead: "Unterkonstruktion, Module, Wechselrichter, Verkabelung und auf Wunsch Speicher und Parkregler – mit Absturzsicherung und abgestimmt auf Ihren Betriebsablauf.",
    sie: ["Zugang zu Dach, Technikräumen und Verteilung ermöglichen", "Sicherheitsunterweisung und Betriebszeiten abstimmen"],
    wir: ["Montage nach Belegungsplan und Statik", "Elektroinstallation nach ÖVE/ÖNORM E 8101", "Kennzeichnung und Feuerwehrplan-Unterlagen"],
  },
  {
    icon: PlugZap,
    kurz: "Inbetriebnahme",
    titel: "Prüfung, Fertigstellungsmeldung & Inbetriebnahme",
    dauer: "direkt nach Montage",
    api: [],
    lead: "Wir prüfen die Anlage, melden sie über das Partnerportal des Netzbetreibers fertig und nehmen sie mit Parkregler und Monitoring in Betrieb.",
    sie: ["Stromabnehmer für den Überschuss wählen (Händler, OeMAG oder PPA)", "Einweisung wahrnehmen"],
    wir: ["Erstprüfung und Dokumentation nach ÖVE/ÖNORM EN 62446", "Fertigstellungsmeldung durch unseren Elektrotechniker", "Registrierung in der Herkunftsnachweisdatenbank der E-Control"],
    hinweis: "Die Einspeisung wird freigegeben, sobald Fertigstellungsmeldung und Stromabnehmer beim Netzbetreiber vorliegen.",
  },
  {
    icon: Activity,
    kurz: "Betrieb",
    titel: "Monitoring, Wartung & Service",
    dauer: "über die gesamte Laufzeit",
    api: [],
    lead: "Wir überwachen die Anlage mit eigenen Fernwartungs- und SCADA-Systemen, erkennen Leistungsabfälle früh und bieten Wartungsverträge nach Anlagengröße.",
    sie: ["Erträge im Portal verfolgen", "Wartungsvertrag wählen"],
    wir: ["Monitoring, Fernwartung und Störungsbehebung", "Wiederkehrende Prüfung und Wartung", "Erweiterung um Speicher, Ladeinfrastruktur oder Energiegemeinschaft"],
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
            Sechs Phasen, ein Ansprechpartner. Sie treffen die Entscheidungen – Planung, Netzanschluss, Montage und Betrieb
            übernehmen wir. Bei Dachanlagen bis rund 250 kWp vergehen meist drei bis sechs Monate.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
            {[
              ["6", "Phasen"],
              ["1", "Ansprechpartner"],
              ["3–6", "Monate bis 250 kWp*"],
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
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700"
            >
              Phase 1 jetzt starten
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={FIRMA.telefonHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {FIRMA.telefon}
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
          * Alle Zeitangaben sind Orientierungswerte (Stand 2026). Die tatsächliche Dauer hängt von Anlagengröße,
          Lieferzeiten, Förderfristen und der Bearbeitungszeit des Netzbetreibers ab.
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
