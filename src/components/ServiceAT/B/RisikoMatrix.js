"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bird, Check, CircleDashed, CloudHail, FileCheck2, Flame, Lock, MapPin, Minus, ShieldCheck, Snowflake, Wind, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Risiko-Matrix PV-Versicherung: Risiko wählen → welche Sparte typischerweise
 * greift, wie man technisch vorbeugt und welche Nachweise zählen.
 * Orientierung ohne Versicherungsberatung – maßgeblich sind die Bedingungen.
 *
 * Status: "ja" typischer Anwendungsbereich · "bedingt" je nach Vertrag/Bedingungen · "nein" nicht Zweck der Sparte
 */

const SPARTEN = [
  { k: "allgefahren", name: "Allgefahren / Elektronik", kurz: "Sachschaden an der Anlage" },
  { k: "ertrag", name: "Ertragsausfall", kurz: "entgangene Erlöse nach Sachschaden" },
  { k: "haftpflicht", name: "Betreiberhaftpflicht", kurz: "Schäden Dritter" },
  { k: "gebaeude", name: "Gebäude / Feuer", kurz: "das Gebäude, PV teils mitversicherbar" },
  { k: "montage", name: "Montage", kurz: "bis zur Abnahme" },
];

const ERTRAG = { s: "bedingt", t: "Nach einem versicherten Sachschaden – Haftzeit und zeitlicher Selbstbehalt entscheiden." };
const MONTAGE = { s: "bedingt", t: "Nur während der Errichtung bis zur Abnahme; Zuständigkeit im Vertrag klären." };

const RISIKEN = [
  {
    k: "hagel",
    name: "Hagel",
    icon: CloudHail,
    bild: { src: "/Images/AT/service-b/hagelkoerner.jpg", alt: "Hagelkörner nach einem Unwetter im Gras" },
    kurz: "Glasbruch und verdeckte Zellbrüche",
    deckung: {
      allgefahren: { s: "ja", t: "Hagel ist ein typischer Allgefahren-Schaden an Modulen und Unterkonstruktion." },
      ertrag: ERTRAG,
      haftpflicht: { s: "nein", t: "Betrifft die eigene Anlage, nicht Dritte." },
      gebaeude: { s: "bedingt", t: "Manche Gebäudeversicherungen schließen PV für Feuer, Sturm und Hagel ein – oft bis zu einer Summe." },
      montage: MONTAGE,
    },
    vorbeugen: "Module mit geprüfter Hagelwiderstandsklasse (HW 1–5 im Hagelregister) und dickerem Frontglas halten mehr aus. Nach Hagel zeigt die EL-Aufnahme verdeckte Zellbrüche.",
    nachweise: ["Datenblätter mit Hagelwiderstandsklasse", "Fotodokumentation im Neuzustand", "Monitoring-Daten zum Schadenzeitpunkt"],
  },
  {
    k: "schnee",
    name: "Schneedruck",
    icon: Snowflake,
    bild: { src: "/Images/AT/chalets/pv-module-schnee.jpg", alt: "Schneebedeckte Photovoltaikmodule" },
    kurz: "Verformte Rahmen, gebrochene Klemmen",
    deckung: {
      allgefahren: { s: "ja", t: "Schneedruck zählt zu den typischen Gefahren der PV-Allgefahrendeckung." },
      ertrag: ERTRAG,
      haftpflicht: { s: "bedingt", t: "Nur wenn Dritte geschädigt werden, etwa durch abrutschende Teile." },
      gebaeude: { s: "bedingt", t: "Je nach Vertrag; das Dach selbst ist Sache der Gebäudeversicherung." },
      montage: MONTAGE,
    },
    vorbeugen: "Modul und Unterkonstruktion müssen für die Schneelastzone nach ÖNORM B 1991-1-3 ausgelegt sein – besonders im alpinen Raum. eHORA zeigt die Zone Ihres Standorts.",
    nachweise: ["Statiknachweis für Schnee- und Windlast (eHORA-Zone)", "Prüflasten der Module laut Datenblatt", "Wartungsprotokoll"],
  },
  {
    k: "blitz",
    name: "Blitz & Überspannung",
    icon: Zap,
    bild: { src: "/Images/AT/service-b/blitz-gewitter.jpg", alt: "Blitzeinschlag bei Nacht über einem bewaldeten Hügel" },
    kurz: "Folgeschäden an Wechselrichtern",
    deckung: {
      allgefahren: { s: "ja", t: "Blitz und Überspannung sind typische Allgefahren-Risiken, Kurzschluss ebenso." },
      ertrag: ERTRAG,
      haftpflicht: { s: "nein", t: "Betrifft die eigene Anlage." },
      gebaeude: { s: "bedingt", t: "Blitzschlag ist oft Teil der Feuerdeckung; Überspannung je nach Vertrag." },
      montage: MONTAGE,
    },
    vorbeugen: "Überspannungsschutz auf DC- und AC-Seite und Trennungsabstände zum Blitzschutz verhindern Folgeschäden an Wechselrichtern.",
    nachweise: ["Blitz- und Überspannungsschutzkonzept", "Prüfbefund nach OVE E 8101", "Messprotokolle nach OVE EN 62446-1"],
  },
  {
    k: "sturm",
    name: "Sturm",
    icon: Wind,
    bild: { src: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg", alt: "Photovoltaik auf einem Flachdach" },
    kurz: "Abgehobene Module, Randbereiche",
    deckung: {
      allgefahren: { s: "ja", t: "Sturm ist eine typische Gefahr der PV-Allgefahrendeckung." },
      ertrag: ERTRAG,
      haftpflicht: { s: "ja", t: "Wenn herabfallende oder verwehte Teile Dritte schädigen." },
      gebaeude: { s: "bedingt", t: "PV teils als Gebäudebestandteil für Sturm mitversichert – bis zu einer Summe." },
      montage: MONTAGE,
    },
    vorbeugen: "Ballast und Befestigung nach Windlast (ÖNORM B 1991-1-4), besonders an Rand- und Eckbereichen von Flachdächern.",
    nachweise: ["Ballast- und Befestigungsplan nach Windlast", "Statiknachweis", "Fotodokumentation"],
  },
  {
    k: "brand",
    name: "Brand",
    icon: Flame,
    bild: { src: "/Images/AT/ratgeber/photovoltaik-brandschutz.jpg", alt: "Photovoltaikanlage mit Brandschutzmaßnahmen" },
    kurz: "Anlage, Gebäude und Nachbarn",
    deckung: {
      allgefahren: { s: "ja", t: "Brand und Kurzschluss an der Anlage sind typische Sachschäden." },
      ertrag: ERTRAG,
      haftpflicht: { s: "ja", t: "Ein übergreifender Brand auf Dritte ist ein klassischer Haftpflichtfall." },
      gebaeude: { s: "ja", t: "Das Gebäude selbst sichert die Gebäude- bzw. Feuerversicherung ab." },
      montage: MONTAGE,
    },
    vorbeugen: "Brandschutz nach OVE R 11-1: Kennzeichnung, Feuerwehrplan und Abschaltkonzept, saubere Steckverbinder und Leitungsführung.",
    nachweise: ["Brandschutz nach OVE R 11-1 (Kennzeichnung, Feuerwehrplan, Abschaltkonzept)", "Prüfbefund nach OVE E 8101", "Thermografie-Bericht"],
  },
  {
    k: "diebstahl",
    name: "Diebstahl & Vandalismus",
    icon: Lock,
    bild: { src: "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg", alt: "Freiflächen-Photovoltaikanlage" },
    kurz: "Vor allem Freiflächen",
    deckung: {
      allgefahren: { s: "ja", t: "Diebstahl und Vandalismus sind je nach Bedingungen eingeschlossen – oft mit Sicherungsauflagen." },
      ertrag: ERTRAG,
      haftpflicht: { s: "nein", t: "Betrifft die eigene Anlage." },
      gebaeude: { s: "nein", t: "In der Regel nicht Zweck der Gebäudeversicherung – prüfen." },
      montage: { s: "bedingt", t: "Während der Errichtung besonders relevant (Material auf der Baustelle)." },
    },
    vorbeugen: "Freiflächen brauchen Zaun, Beleuchtung oder Videoüberwachung und diebstahlhemmende Schrauben – Versicherer fragen danach.",
    nachweise: ["Sicherungskonzept (Zaun, Video, Schrauben)", "Seriennummernliste der Module und Wechselrichter", "Fotodokumentation"],
  },
  {
    k: "marder",
    name: "Marder & Tierbiss",
    icon: Bird,
    bild: { src: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Techniker bei Arbeiten an einer PV-Anlage" },
    kurz: "Angebissene Kabel, Kurzschluss",
    deckung: {
      allgefahren: { s: "bedingt", t: "Viele Allgefahrendeckungen schließen Tierbiss ein, teils mit Folgeschäden wie Kurzschluss – Bedingungen prüfen." },
      ertrag: ERTRAG,
      haftpflicht: { s: "nein", t: "Betrifft die eigene Anlage." },
      gebaeude: { s: "nein", t: "In der Regel nicht Zweck der Gebäudeversicherung." },
      montage: { s: "nein", t: "Tritt meist erst im Betrieb auf." },
    },
    vorbeugen: "Geschützte Kabelführung in Rohren und geschlossenen Kanälen, saubere Leitungsführung ohne lose Schlaufen.",
    nachweise: ["Fotos der Kabelführung", "Wartungsprotokoll mit Sichtprüfung", "Messprotokolle"],
  },
];

const STATUS = {
  ja: { icon: Check, label: "typisch", klasse: "bg-ov-500 text-white", zeile: "ring-ov-300/60 bg-ov-50" },
  bedingt: { icon: CircleDashed, label: "je nach Vertrag", klasse: "bg-sun-400 text-navy-950", zeile: "ring-sun-300/70 bg-sun-300/10" },
  nein: { icon: Minus, label: "nicht Zweck", klasse: "bg-ink-200 text-ink-600", zeile: "ring-ink-200/70 bg-white" },
};

export default function RisikoMatrix() {
  const [wahl, setWahl] = useState("hagel");
  const r = RISIKEN.find((x) => x.k === wahl) || RISIKEN[0];
  const Icon = r.icon;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl ring-1 ring-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.6fr)]">
        {/* Risiken */}
        <div className="min-w-0 border-b border-ink-100 bg-sand-50 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="px-1 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Risiko wählen</p>
          <div role="group" aria-label="Risiko wählen" className="ov-no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0">
            {RISIKEN.map((x) => {
              const an = x.k === wahl;
              const XI = x.icon;
              return (
                <button
                  key={x.k}
                  type="button"
                  aria-pressed={an}
                  onClick={() => setWahl(x.k)}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all duration-300 lg:w-full",
                    an ? "bg-navy-950 text-white shadow-lg" : "bg-white text-ink-800 ring-1 ring-ink-200/70 hover:ring-ov-300"
                  )}
                >
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors", an ? "bg-ov-500 text-white" : "bg-ov-50 text-ov-600")}>
                    <XI aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap font-display text-[15.5px] font-bold leading-tight">{x.name}</span>
                    <span className={cn("hidden text-[12.5px] leading-snug lg:block", an ? "text-white/60" : "text-ink-500")}>{x.kurz}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div key={r.k} className="sb-ein min-w-0">
          <div className="relative h-40 overflow-hidden sm:h-48">
            <Image src={r.bild.src} alt={r.bild.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5 sm:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Risiko</p>
                <h3 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">{r.name}</h3>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Welche Deckung greift typischerweise?</p>
            <ul className="mt-4 grid gap-2">
              {SPARTEN.map((s) => {
                const d = r.deckung[s.k];
                const st = STATUS[d.s];
                const SI = st.icon;
                return (
                  <li key={s.k} className={cn("grid items-start gap-x-4 gap-y-1 rounded-2xl p-3.5 ring-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] sm:items-center", st.zeile)}>
                    <div className="flex items-center gap-3">
                      <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", st.klasse)} title={st.label}>
                        <SI aria-hidden="true" className="h-4 w-4" strokeWidth={2.6} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[15px] font-bold leading-tight text-ink-900">{s.name}</span>
                        <span className="block text-[12px] text-ink-500">
                          {s.kurz} · <span className="font-semibold">{st.label}</span>
                        </span>
                      </span>
                    </div>
                    <p className="pl-10 text-[14px] leading-snug text-ink-700 sm:pl-0">{d.t}</p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-navy-950 p-5 text-white">
                <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  Technisch vorbeugen
                </p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/80">{r.vorbeugen}</p>
              </div>
              <div className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
                  <FileCheck2 aria-hidden="true" className="h-4 w-4" />
                  Nachweise, die zählen
                </p>
                <ul className="mt-2 space-y-1.5">
                  {r.nachweise.map((n) => (
                    <li key={n} className="flex gap-2 text-[14px] leading-snug text-ink-700">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-500" aria-label="Legende">
                {Object.entries(STATUS).map(([k, s]) => (
                  <li key={k} className="flex items-center gap-1.5">
                    <span className={cn("flex h-4 w-4 items-center justify-center rounded-full", s.klasse)}>
                      <s.icon aria-hidden="true" className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {s.label}
                  </li>
                ))}
              </ul>
              <Link href="/standort-check" className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 py-2 text-center text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700 sm:shrink-0">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                Standort-Check: Schnee, Wind, Hagel
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-ink-100 px-5 py-4 text-[12.5px] leading-relaxed text-ink-500 sm:px-7">
        Orientierung, keine Versicherungsberatung: Umfang, Ausschlüsse und Selbstbehalte regeln ausschließlich die Bedingungen Ihres Vertrags. Ökovolt ist kein Versicherungsvermittler –
        wir liefern Technik, Unterlagen und Begutachtung.
      </p>
    </div>
  );
}
