import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BatteryCharging, Building2, CalendarClock, CircleX, Landmark, Map as MapIcon, MapPin, PlugZap, Sun, Tractor, Users } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MiniKarte from "@/components/Forderungen/Landes/MiniKarte";
import Umschalter from "@/components/Forderungen/Shared/Umschalter";
import { AmpelChip, PruefenMarke } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_IZ } from "@/components/Forderungen/Shared/bund";
import { datumLang } from "@/components/Forderungen/Shared/format";
import { AMPEL, BUNDESLAENDER, FOERDERARTEN, STAND, ZIELGRUPPEN, landesPfad } from "@/data/bundeslaender";

/**
 * Bausteine der Landesseiten /forderungen/landesforderungen/<slug>.
 * Alle Inhalte kommen aus src/data/bundeslaender.js und unterscheiden sich je
 * Bundesland – bewusst keine bundesweit identischen Textblöcke.
 */

const CHIP = {
  zuschuss: "bg-ov-600 text-white",
  gezielt: "bg-sun-400 text-navy-950",
  bund: "bg-ink-200 text-ink-800",
};
const PUNKT = { zuschuss: "bg-ov-500", gezielt: "bg-sun-400", bund: "bg-ink-400" };

const ZG_LABEL = Object.fromEntries(ZIELGRUPPEN.map((z) => [z.id, z.label]));
const kwh = (n) => n.toLocaleString("de-DE");

/** Ampel-Status eines Landesprogramms für die Anzeige (aus Status-Feldern abgeleitet). */
export function programmAmpel(p) {
  if (p.anzeigeStatus === "pausiert") return { ton: "rot", label: "derzeit keine Einreichung", punkt: "bg-[#e5484d]", ring: "ring-[#e5484d]/25", text: "text-[#b42318]", flaeche: "bg-[#e5484d]/10" };
  if (p.pruefen) return { ton: "gelb", label: "läuft laut Sekundärquelle – bitte prüfen", punkt: "bg-sun-400", ring: "ring-sun-400/40", text: "text-ink-800", flaeche: "bg-sun-300/25" };
  return { ton: "gruen", label: "läuft", punkt: "bg-ov-500", ring: "ring-ov-300/60", text: "text-ov-800", flaeche: "bg-ov-50" };
}

function Extern({ href, children, className = "" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800 ${className}`}>
      {children}
      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span className="sr-only">(externer Link, neues Fenster)</span>
    </a>
  );
}

/** Kurzantwort, Mini-Karte und Kennzahlen. */
export function LandAufEinenBlick({ keyName, land }) {
  const aktiv = land.programme.length;
  const fakten = [
    { icon: Landmark, label: "Landesprogramme", wert: `${aktiv} erfasst`, text: land.ausgelaufen.length ? `${land.ausgelaufen.length} zuletzt beendet oder ausgeschöpft` : "keine beendeten Programme erfasst" },
    { icon: BatteryCharging, label: "Speicher", wert: land.ueberblick.speicher.length > 26 ? "siehe unten" : land.ueberblick.speicher, text: land.ueberblick.speicher },
    { icon: Sun, label: "Solarertrag (PVGIS)", wert: `${kwh(land.ertrag[0])}–${kwh(land.ertrag[1])}`, text: `kWh je kWp – 100 kWp erzeugen rund ${kwh(land.ertrag[0] * 100)}–${kwh(land.ertrag[1] * 100)} kWh im Jahr` },
    { icon: CalendarClock, label: "Zuletzt geprüft", wert: STAND.label, text: `Stand ${datumLang(land.stand)} – Landesbudgets können kurzfristig enden` },
  ];

  return (
    <Section tone="white" space="md">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal dir="left" className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div aria-hidden="true" className="absolute inset-6 rounded-full bg-ov-100/70 blur-3xl" />
          <MiniKarte landKey={keyName} landName={land.name} className="relative drop-shadow-[0_20px_30px_rgba(3,18,43,0.12)]" />
          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-ink-500">
            <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
            {land.name === land.hauptstadt ? `${land.name} · Bundeshauptstadt` : `${land.name} · Landeshauptstadt ${land.hauptstadt}`}
          </p>
        </Reveal>

        <div>
          <SectionHeading eyebrow="Auf einen Blick" title={`Förderung in ${land.name}: die Kurzantwort`} />
          <Reveal delay={80}>
            <p className="mt-5">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold ${CHIP[land.foerderart]}`}>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current opacity-70" />
                {FOERDERARTEN[land.foerderart].label}
              </span>
            </p>
            <p className="mt-5 text-[18px] font-medium leading-relaxed text-ink-800">{land.kurz}</p>
            <p className="mt-3 max-w-[70ch] text-[16px] leading-relaxed text-ink-600">{land.text}</p>
          </Reveal>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {fakten.map((f, i) => (
              <Reveal key={f.label} delay={120 + i * 60} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <dt className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  <f.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                  {f.label}
                </dt>
                <dd className="ov-num mt-2 font-display text-[21px] font-extrabold leading-tight tracking-tight text-ink-900">{f.wert}</dd>
                <dd className="mt-1 text-[13.5px] leading-snug text-ink-500">{f.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

/** Landesprogramme mit Ampel-Status, Überblick nach Zielgruppe, beendete Programme, Bund & Gemeinden. */
export function LandesProgramme({ land }) {
  const zeilen = [
    { id: "unternehmen", icon: Building2 },
    { id: "landwirtschaft", icon: Tractor },
    { id: "gemeinde", icon: Landmark },
    { id: "privat", icon: Sun },
    { id: "speicher", icon: BatteryCharging, label: "Speicher" },
    { id: "energiegemeinschaft", icon: Users },
  ];

  const zielgruppenPanel = (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {zeilen.map((z) => (
        <div key={z.id} className="flex gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
            <z.icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <dt className="font-semibold text-ink-900">{z.label || ZG_LABEL[z.id]}</dt>
            <dd className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{land.ueberblick[z.id]}</dd>
          </div>
        </div>
      ))}
    </dl>
  );

  const beendetPanel = land.ausgelaufen.length ? (
    <div>
      <p className="text-[15.5px] leading-relaxed text-ink-600">Diese Programme werden noch häufig gesucht, sind aber zum Prüfdatum nicht mehr offen:</p>
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {land.ausgelaufen.map((a) => (
          <li key={a.programm} className="flex gap-4 rounded-2xl bg-white/70 p-5 ring-1 ring-ink-300">
            <CircleX aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
            <p className="text-[15px] leading-relaxed text-ink-600">
              <strong className="font-semibold text-ink-900">{a.programm}</strong>
              <span className="mt-1 block text-[14px] text-ink-500">{a.ende}</span>
              <Extern href={a.url} className="mt-1 text-[13.5px]">Quelle</Extern>
            </p>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  const bundPanel = (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="ov-noise relative overflow-hidden rounded-3xl bg-navy-950 p-6 text-white md:p-8">
        <div aria-hidden="true" className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-ov-500/25 blur-[80px]" />
        <p className="relative text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Immer zusätzlich: Bund</p>
        <p className="relative mt-3 font-display text-[21px] font-bold leading-snug">EAG-Investitionszuschuss – nächster Fördercall {EAG_IZ.naechsterCall.zeitraum}</p>
        <p className="relative mt-3 text-[15px] leading-relaxed text-white/70">
          Kategorie A 150 €/kWp, B 140 €/kWp, C bis 130 €/kWp, D bis 120 €/kWp; Speicher 150 €/kWh. Antrag vor der Inbetriebnahme. Gilt in {land.name} genauso wie in allen anderen Bundesländern.
        </p>
        <Link href="/forderungen/bundesfoerderung#rechner" className="group relative mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-300 hover:text-white">
          Zuschuss berechnen – EAG, Marktprämie und KPC im Detail
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Gemeindeförderungen</p>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-700">{land.gemeinden}</p>
      </div>
    </div>
  );

  const tabs = [
    { id: "zielgruppe", label: "Nach Zielgruppe", icon: <Users /> },
    { id: "bund", label: "Bund & Gemeinden", icon: <Landmark /> },
    ...(beendetPanel ? [{ id: "beendet", label: "Beendet", icon: <CircleX />, badge: land.ausgelaufen.length }] : []),
  ];
  const panels = [zielgruppenPanel, bundPanel, ...(beendetPanel ? [beendetPanel] : [])];

  return (
    <Section tone="sand" space="md" aria-labelledby="landesprogramme-titel">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
            Landesprogramme {STAND.label}
          </p>
          <h2 id="landesprogramme-titel" className="ov-h2 mt-4 text-ink-900">Welche Programme {land.name} aktuell anbietet</h2>
          <p className="ov-lead mt-5 text-ink-600">Landesförderungen kommen zum EAG-Investitionszuschuss des Bundes hinzu – mit Ausnahme der Kategorie D, die nicht kombiniert werden darf.</p>
        </div>
        <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Legende Programmstatus">
          {[
            { k: "bg-ov-500", l: "läuft" },
            { k: "bg-sun-400", l: "bitte prüfen" },
            { k: "bg-[#e5484d]", l: "pausiert" },
          ].map((x) => (
            <li key={x.l} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200">
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${x.k}`} />
              {x.l}
            </li>
          ))}
        </ul>
      </div>

      {land.programme.length > 0 ? (
        <ul className={`grid gap-4 ${land.programme.length === 1 ? "" : land.programme.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          {land.programme.map((p, i) => {
            const a = programmAmpel(p);
            return (
              <Reveal as="li" key={p.name} delay={i * 80} className="flex">
                <article className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 hover:ring-ov-200 md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[12.5px] font-medium text-ink-500">{p.traeger}</p>
                    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${a.flaeche} ${a.ring} ${a.text}`}>
                      <span className="relative flex h-2.5 w-2.5">
                        {a.ton === "gruen" && <span aria-hidden="true" className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 motion-reduce:hidden ${a.punkt}`} />}
                        <span aria-hidden="true" className={`relative inline-flex h-2.5 w-2.5 rounded-full ${a.punkt}`} />
                      </span>
                      {a.label}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-[20px] font-bold leading-snug text-ink-900">{p.name}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Zielgruppen">
                    {p.zielgruppen.map((z) => (
                      <li key={z} className="rounded-full bg-ov-50 px-2.5 py-0.5 text-[12px] font-semibold text-ov-800 ring-1 ring-ov-100">{ZG_LABEL[z]}</li>
                    ))}
                  </ul>
                  <p className="mt-5 rounded-2xl bg-sand-50 px-4 py-3 font-display text-[16.5px] font-bold leading-snug text-ov-700 ring-1 ring-ink-200/50">{p.hoehe}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-600">{p.was}</p>
                  {p.hinweis && <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{p.hinweis}</p>}
                  <div className="mt-auto pt-5">
                    <p className="border-t border-dashed border-ink-200 pt-4 text-[14px] text-ink-700">
                      <span className="font-semibold text-ink-900">Status: </span>
                      {p.status}
                    </p>
                    {p.pruefen && <PruefenMarke stand={STAND.label} />}
                    <p className="mt-3">
                      <Extern href={p.url} className="text-[14px]">Förderstelle: {p.quelle}</Extern>
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white p-6 text-[15.5px] text-ink-600 ring-1 ring-ink-200/70">Zum Prüfdatum ist kein Landesprogramm für PV oder Speicher offen.</p>
      )}

      <div className="mt-12">
        <Umschalter label={`Weitere Informationen zu ${land.name}`} tabs={tabs} panels={panels} />
      </div>
    </Section>
  );
}

/** Energiegemeinschaften, Beratung und Förderstellen. */
export function LandesAnlaufstellen({ land }) {
  const stellen = land.programme.filter((p, i, a) => a.findIndex((x) => x.url === p.url) === i);
  return (
    <Section tone="white" space="md">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow="Energiegemeinschaften" title={`Energiegemeinschaften in ${land.name}`} lead={land.energiegemeinschaften.text} />
          <Reveal delay={80} className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-100">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Anlaufstelle</p>
              <p className="mt-2 font-display text-[18px] font-bold text-ink-900">{land.energiegemeinschaften.stelle}</p>
              <Extern href={land.energiegemeinschaften.url} className="mt-2 text-[14.5px]">Zur Anlaufstelle</Extern>
            </div>
            <Users aria-hidden="true" className="hidden h-12 w-12 shrink-0 text-ov-300 sm:block" strokeWidth={1.4} />
          </Reveal>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-600">
            Wie EEG, BEG und die neuen ElWG-Modelle ab 01.10.2026 funktionieren und was Betriebe davon haben, erklären wir unter{" "}
            <Link href="/energiegemeinschaften" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Energiegemeinschaften für Unternehmen und Gemeinden</Link>.
          </p>
        </div>
        <div>
          <h3 className="ov-h3 text-ink-900">Beratung und Förderstellen in {land.name}</h3>
          <ul className="mt-6 grid gap-3">
            {land.beratung.map((b, i) => (
              <Reveal as="li" key={b.name} delay={i * 70} className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
                <p className="font-display text-[17px] font-bold text-ink-900">{b.name}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{b.text}</p>
                <Extern href={b.url} className="mt-2 text-[14px]">Website</Extern>
              </Reveal>
            ))}
            {stellen.map((p) => (
              <li key={p.url} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl px-5 py-3 ring-1 ring-ink-200/60">
                <span className="text-[14.5px] text-ink-700">{p.traeger}: {p.name}</span>
                <Extern href={p.url} className="shrink-0 text-[13.5px]">{p.quelle}</Extern>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

const AMPEL_KARTE = {
  frei: "from-ov-500 to-ov-600",
  anzeige: "from-sun-300 to-sun-500",
  bewilligung: "from-navy-500 to-navy-700",
};

/** Bauordnung-Kurzfassung und Netzbetreiber. */
export function LandesRecht({ land }) {
  const r = land.recht;
  const ampel = [
    { titel: "Dach & Fassade", wert: r.ampel.dach },
    { titel: "Freifläche", wert: r.ampel.freiflaeche },
    { titel: "Elektrizitätsrecht", wert: r.ampel.elektrizitaet },
  ];
  const zeilen = [
    { titel: "PV auf Dach und Fassade", text: r.dach, ampel: r.ampel.dach, pruefen: r.dachPruefen },
    { titel: "Freiflächen-PV (Baurecht)", text: r.freiflaeche, ampel: r.ampel.freiflaeche, pruefen: r.freiflaechePruefen },
    { titel: "Elektrizitätsrecht", text: r.elektrizitaet, ampel: r.ampel.elektrizitaet },
    { titel: "Raumordnung Freifläche", text: r.raumordnung },
    { titel: "Ortsbild und Denkmalschutz", text: r.ortsbild },
    { titel: "PV-Pflicht", text: r.pvPflicht, pruefen: r.pvPflichtPruefen },
  ];
  return (
    <Section tone="sand" space="md">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow={`Baurecht & Netz · ${r.bauordnung}`}
          title={`Genehmigung in ${land.name}: die Kurzfassung`}
          lead="Förderung und Genehmigung hängen zusammen: Für den EAG-Zuschuss müssen alle Anzeigen und Genehmigungen schon beim Antrag vorliegen."
        />
        <Link href="/forderungen/baurecht#genehmigungs-check" className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
          Genehmigungs-Check und alle neun Bauordnungen
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Ampel-Zusammenfassung */}
      <ul className="mb-4 grid gap-3 sm:grid-cols-3">
        {ampel.map((a, i) => (
          <Reveal as="li" key={a.titel} delay={i * 80} className="relative overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
            <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${AMPEL_KARTE[a.wert]}`} />
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{a.titel}</p>
            <p className="mt-2 font-display text-[20px] font-extrabold leading-tight text-ink-900">{AMPEL[a.wert].label}</p>
            <p className="mt-1 text-[13.5px] leading-snug text-ink-500">{AMPEL[a.wert].lang}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <dl className="divide-y divide-ink-100 overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
          {zeilen.map((z) => (
            <div key={z.titel} className="grid gap-2 px-6 py-4 md:grid-cols-[240px_1fr] md:gap-8">
              <dt className="flex flex-wrap items-center gap-2 font-semibold text-ink-900">
                {z.titel}
                {z.ampel && <AmpelChip wert={z.ampel} label={AMPEL[z.ampel].label} />}
              </dt>
              <dd className="text-[15px] leading-relaxed text-ink-700">
                {z.text}
                {z.pruefen && (
                  <span className="block">
                    <PruefenMarke stand={STAND.label} />
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
        Allgemeine Information, keine Rechtsauskunft. Rechtsgrundlagen:{" "}
        {r.quellen.map((q, i) => (
          <span key={q.url}>
            {i > 0 && " · "}
            <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">{q.label}</a>
          </span>
        ))}
      </p>

      <Reveal className="mt-10 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            <PlugZap aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Netzbetreiber in {land.name}
          </p>
          <ul className="mt-4 space-y-2.5">
            {land.netzbetreiber.map((n) => (
              <li key={n.name}>
                <Extern href={n.url} className="text-[15.5px]">{n.name}</Extern>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-600">Welcher Netzbetreiber zuständig ist, steht auf Ihrer Stromrechnung (Zählpunktnummer beginnt mit AT und der Netzbetreiberkennung).</p>
        </div>
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Netzanschluss in drei Sätzen</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
            Der Netzzugangsantrag geht vor der Bestellung an den Netzbetreiber; bis 20 kW genügt nach § 96 ElWG eine Anzeige. Größere Anlagen durchlaufen eine Netzverträglichkeitsprüfung nach TOR Erzeuger. Nach der Montage meldet die Elektrofachkraft die Fertigstellung, erst dann wird der Einspeisezählpunkt aktiviert.
          </p>
          <Link href="/forderungen/richtlinien#netzanschluss" className="group mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Normen und Netzanschluss im Detail
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}

/** Standortfaktor Sonne mit PVGIS-Werten der Orte. */
export function LandesStandort({ land }) {
  const pos = (v) => ((v - 1000) / 400) * 100;
  return (
    <Section tone="navy" space="md" className="ov-noise overflow-hidden">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full bg-sun-400/15 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full bg-ov-500/20 blur-[120px]" />
      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <SectionHeading dark eyebrow="Standortfaktor Sonne" title={land.standort.titel} lead={land.standort.text} />
        <Reveal dir="right" className="ov-glass rounded-3xl p-6 md:p-8">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
            <Sun aria-hidden="true" className="h-4 w-4 text-sun-400" />
            Jahresertrag je kWp nach PVGIS
          </p>
          <ul className="mt-6 space-y-4">
            {land.ertragOrte.map(([ort, wert]) => (
              <li key={ort}>
                <div className="flex items-baseline justify-between text-[14.5px]">
                  <span className="text-white/80">{ort}</span>
                  <span className="ov-num font-display font-bold text-white">{kwh(wert)} kWh</span>
                </div>
                <span aria-hidden="true" className="mt-1.5 block h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gradient-to-r from-sun-300 to-sun-500" style={{ width: `${Math.max(8, Math.min(100, pos(wert)))}%` }} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-white/10 pt-5 text-[13.5px] leading-relaxed text-white/60">
            PVGIS 5.3 (EU JRC), 1 kWp, optimale Neigung, Südausrichtung, 14 % Systemverluste, abgefragt am 28.09.2026. Skala 1.000–1.400 kWh. Ost-West-Dächer liegen typisch 10–20 % darunter – für Ihr Dach rechnen wir den Ertrag im{" "}
            <Link href="/standort-check" className="font-semibold text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">Standort-Check</Link> exakt.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

const NACHBAR_SPALTEN = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4", 5: "sm:grid-cols-3 lg:grid-cols-5", 6: "sm:grid-cols-3" };

/** Nachbarländer als Fotokarten plus Einstieg in die Übersichtskarte. */
export function LandesNachbarn({ keyName, nachbarn = [] }) {
  const n = nachbarn.length + 1;
  return (
    <Section tone="white" space="md">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <SectionHeading eyebrow="Nachbarländer" title="Förderung in den Nachbarländern" lead="Standort an der Landesgrenze oder mehrere Betriebsstätten? Maßgeblich ist das Bundesland, in dem die Anlage steht." />
      </div>
      <ul className={`grid gap-4 ${NACHBAR_SPALTEN[n] || "sm:grid-cols-3"}`}>
        {nachbarn.map((k, i) => {
          const l = BUNDESLAENDER[k];
          return (
            <Reveal as="li" key={k} delay={i * 70} className="flex">
              <Link href={landesPfad(k)} className="group relative flex min-h-[220px] w-full flex-col justify-end overflow-hidden rounded-[1.5rem] bg-navy-950 text-white outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2">
                {l.bild && <Image src={l.bild.src} alt={l.bild.alt} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" style={{ objectPosition: l.bild.position }} />}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
                <div className="relative flex items-end justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11.5px] font-semibold backdrop-blur">
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${PUNKT[l.foerderart]}`} />
                      {FOERDERARTEN[l.foerderart].kurz}
                    </span>
                    <p className="mt-2 font-display text-[18px] font-extrabold leading-tight">Förderung {l.name}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all group-hover:bg-ov-500">
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
        <Reveal as="li" delay={nachbarn.length * 70} className="flex">
          <Link href="/forderungen/landesforderungen#foerderkarte" className="group flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-sand-50 p-5 ring-1 ring-ink-200/70 transition-colors hover:bg-ov-50 hover:ring-ov-200">
            <MiniKarte landKey={keyName} className="mx-auto w-full max-w-[220px] opacity-90" />
            <span className="mt-4 flex items-center justify-between gap-3">
              <span className="font-display text-[17px] font-extrabold leading-tight text-ink-900">
                <MapIcon aria-hidden="true" className="mr-1.5 inline h-4 w-4 -translate-y-px text-ov-600" />
                Alle 9 Bundesländer auf der Förderkarte
              </span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </ul>
    </Section>
  );
}

/** Landesspezifische FAQ – aus den Daten erzeugt, damit jede Seite eigene Antworten hat. */
export function landesFaq(land) {
  const programme = land.programme;
  const betrieb = programme.filter((p) => p.zielgruppen.includes("unternehmen"));
  const speicher = programme.filter((p) => p.themen.includes("speicher"));
  const faq = [
    {
      q: `Welche Photovoltaik-Förderung gibt es 2026 in ${land.name}?`,
      a: `${land.kurz} Zusätzlich gilt in ${land.name} der EAG-Investitionszuschuss des Bundes (Kategorie A 150 €/kWp bis D max. 120 €/kWp, Speicher 150 €/kWh); der nächste Fördercall läuft von ${EAG_IZ.naechsterCall.zeitraum}. Stand: ${STAND.label}.`,
    },
    {
      q: `Gibt es in ${land.name} eine Landesförderung für Unternehmen?`,
      a: betrieb.length
        ? `Ja: ${betrieb.map((p) => `${p.name} (${p.hoehe})`).join("; ")}. Status zum Prüfdatum: ${betrieb.map((p) => p.status).join("; ")}.`
        : `Zum Prüfdatum ist in ${land.name} kein eigenes Landesprogramm für betriebliche PV offen. Unternehmen nutzen den EAG-Investitionszuschuss, bei Insellagen die KPC-Förderung, sowie steuerlich den Investitionsfreibetrag von 22 % für Anschaffungen bis 31.12.2026.`,
    },
    {
      q: `Wird ein Stromspeicher in ${land.name} gefördert?`,
      a: speicher.length
        ? `Auf Landesebene: ${speicher.map((p) => `${p.name} – ${p.hoehe}`).join("; ")}. Bundesweit gibt es 150 €/kWh über den EAG-Investitionszuschuss, wenn der Speicher gemeinsam mit einer neuen oder erweiterten PV-Anlage errichtet wird (mind. 0,5 kWh je kWp, max. 50 kWh).`
        : `Ein Landesprogramm für Speicher ist in ${land.name} zum Prüfdatum nicht offen (${land.ueberblick.speicher}). Bundesweit gibt es 150 €/kWh über den EAG-Investitionszuschuss, wenn der Speicher gemeinsam mit einer neuen oder erweiterten PV-Anlage errichtet wird.`,
    },
    {
      q: `Braucht eine PV-Anlage in ${land.name} eine Genehmigung?`,
      a: `Dachanlagen: ${land.recht.dach}. Elektrizitätsrecht: ${land.recht.elektrizitaet}. Freiflächen: ${land.recht.raumordnung}.`,
    },
    {
      q: `Wie viel Strom erzeugt eine PV-Anlage in ${land.name}?`,
      a: `Nach PVGIS (EU JRC) liegen optimal geneigte, nach Süden ausgerichtete Anlagen in ${land.name} bei rund ${kwh(land.ertrag[0])} bis ${kwh(land.ertrag[1])} kWh je kWp und Jahr (${land.ertragOrte.map(([o, w]) => `${o} ${kwh(w)} kWh`).join(", ")}). Eine 100-kWp-Anlage auf einem Betriebsdach erzeugt damit etwa ${kwh(land.ertrag[0] * 100)} bis ${kwh(land.ertrag[1] * 100)} kWh; Ost-West-Dächer liegen darunter.`,
    },
    {
      q: `Wer ist in ${land.name} der Netzbetreiber für PV-Anlagen?`,
      a: `In ${land.name} sind vor allem ${land.netzbetreiber.map((n) => n.name).join(" und ")} zuständig. Der Netzbetreiber vergibt den Einspeisezählpunkt und prüft größere Anlagen nach den TOR Erzeuger; bis 20 kW genügt nach § 96 ElWG eine Anzeige.`,
    },
  ];
  return faq;
}
