// src/components/Startseite/S05Warum.js
//
// Startseite – Abschnitt: Warum Ökovolt (Markengeschichte).
// 1) Kopf: Überschrift + Einordnung.
// 2) Gezeichnete Zeitleiste 2012 → heute: maßstäblich (ein Strich je Jahr), die Linie läuft
//    einmal von links nach rechts, Meilensteine leuchten auf, „heute“ mündet in die Kennzahlen.
// 3) Foto mit „seit 2012“-Karte + drei Gründe, jeweils mit eigener kleiner Grafik
//    (Leistungskette, Regelung und Leittechnik, eigene Leute und Maschinen).
// Alle Fakten aus src/data/marke.js, src/data/unternehmen.js, src/data/kennzahlen.js, src/lib/site.js.
// Welle A02: ohne Rangaussage und ohne Salzburg AG (Belegakte src/data/werbeaussagen.js); die doppelte
// Kennzahlen-Karte ist ein Verweis auf das Kennzahlenband im Hero und /presse.
// Eingebunden in src/app/page.js.

import { Cpu, HardHat, MapPin, MonitorDot, RadioTower, Ruler, SlidersHorizontal, Tractor, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FIRMA, SCHWESTER } from "@/lib/site";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { KENNZAHLEN_HINWEIS_STAND, KENNZAHLEN_STAND, kz } from "@/data/kennzahlen";
import { AUSSTATTUNG_BESTAETIGT, PARKREGLER_SATZ } from "@/data/marke";
import S04Buehne from "./s04-Buehne";
import { S04_BASIS, d } from "./s04-stil";

const JAHR_START = 2012;
const JAHR_HEUTE = Number(KENNZAHLEN_STAND.slice(0, 4));
const SPANNE = JAHR_HEUTE - JAHR_START;
const pos = (jahr) => Math.round(((jahr - JAHR_START) / SPANNE) * 1000) / 10; // Prozent
const LINIE_MS = 2400;
const LINIE_START = 300;
const ankunft = (jahr) => Math.round(LINIE_START + (pos(jahr) / 100) * LINIE_MS);

const MEILENSTEINE = [
  { jahr: 2012, text: `Eintrag ins Firmenbuch, Sitz in ${FIRMA.ort}. Im selben Jahr starten die Gründer mit eigenen Solarparks – gebaut und selbst betrieben.` },
  { jahr: 2021, text: "Rund 30 MWp PV-Leistung in einem Jahr – Planung, Beschaffung und Bau aus einer Hand (Angabe Ökovolt Österreich)." },
];

const KETTE = ["Lastganganalyse", "Netzantrag", "Statik", "Montage", "Inbetriebnahme", "Wartung"];
const TECHNIK = [
  { icon: SlidersHorizontal, l: "Parkregler" },
  { icon: RadioTower, l: "Fernwartung" },
  { icon: MonitorDot, l: "SCADA" },
];
// Vom Auftraggeber bestätigt (src/data/mannschaft.js [AG]) – Säule „Eigene Leute und Maschinen“ (src/data/marke.js)
const AUSSTATTUNG = [
  { icon: HardHat, l: "Eigene Montageteams" },
  { icon: Truck, l: "Eigener Lkw" },
  { icon: Tractor, l: "Eigene Traktoren" },
];

const CSS = `
${S04_BASIS}
.s04w-grund{transition:background-color .4s}
.s04w-grund::before{content:"";position:absolute;left:0;top:1.75rem;bottom:1.75rem;width:2px;border-radius:2px;background:var(--color-ov-500);transform:scaleY(0);transform-origin:50% 0;transition:transform .5s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){.s04w-grund:hover::before{transform:scaleY(1)}}
.s04w-ping{transform-origin:50% 50%;opacity:0}
.s04-an .s04w-ping{animation:s04w-ping 1.8s cubic-bezier(.22,1,.36,1) var(--s04-d,0ms) 2}
@keyframes s04w-ping{0%{opacity:.55;transform:scale(1)}100%{opacity:0;transform:scale(2.6)}}
@media (prefers-reduced-motion:reduce){.s04-an .s04w-ping{animation:none}.s04w-grund::before{transition:none}}
`;

function Punkt({ gross, className, style }) {
  return gross ? (
    <span aria-hidden="true" className={`s04-pop absolute flex h-5 w-5 items-center justify-center ${className}`} style={style}>
      <span className="s04w-ping absolute inset-0 rounded-full bg-ov-400" style={style} />
      <span className="relative h-5 w-5 rounded-full bg-ov-500 shadow-[0_0_0_4px_rgba(102,153,51,0.18),0_6px_16px_-4px_rgba(102,153,51,0.7)]" />
    </span>
  ) : (
    <span aria-hidden="true" className={`s04-pop absolute h-4 w-4 rounded-full border-[3px] border-ov-500 bg-white shadow-[0_0_0_4px_#fff] ${className}`} style={style} />
  );
}

export default function StartWarum() {
  return (
    <>
      {/* ================= WARUM ÖKOVOLT ================= */}
      <Section data-start="warum" tone="white" space="lg" className="overflow-hidden">
        <style>{CSS}</style>

        {/* ---------- Kopf ---------- */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHeading className="lg:col-span-7" eyebrow="Warum Ökovolt" title="Betreiber aus Überzeugung – Errichter mit System." />
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-[16px] leading-relaxed text-ink-600 md:text-[17px]">
              Seit 2012 baut Ökovolt Photovoltaik in Österreich – bisher {kz("anlagen")} PV-Anlagen mit zusammen {kz("leistung")} kWp ({KENNZAHLEN_HINWEIS_STAND}). 2021 errichteten wir allein rund 30 MWp. Standards und Prozesse teilen wir mit unserer deutschen Schwestergesellschaft in {SCHWESTER.ort}, die seit 2010 PV-Anlagen errichtet.
            </p>
          </Reveal>
        </div>

        {/* ---------- Zeitleiste 2012 → heute ---------- */}
        <S04Buehne className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-14">
          <div className="relative">
            {/* Linie mobil (senkrecht) */}
            <span aria-hidden="true" className="s04-sky absolute bottom-3 left-[7px] top-4 w-0.5 rounded-full bg-gradient-to-b from-ov-200 via-ov-400 to-ov-600 md:hidden" style={d(LINIE_START, { "--s04-t": `${LINIE_MS}ms` })} />
            {/* Linie Desktop (waagrecht) mit Jahresstrichen */}
            <div aria-hidden="true" className="absolute inset-x-0 top-[77px] hidden md:block">
              <span className="absolute inset-x-0 -top-px h-0.5 rounded-full bg-ink-100" />
              <span className="s04-skx absolute inset-x-0 -top-px h-0.5 rounded-full bg-gradient-to-r from-ov-200 via-ov-400 to-ov-600" style={d(LINIE_START, { "--s04-t": `${LINIE_MS}ms` })} />
              {Array.from({ length: SPANNE + 1 }, (_, i) => (
                <span
                  key={i}
                  className="s04-auf absolute top-[7px] h-1.5 w-px bg-ink-300"
                  style={d(ankunft(JAHR_START + i), { left: `${pos(JAHR_START + i)}%` })}
                />
              ))}
            </div>

            <ol className="relative grid gap-9 pl-9 md:grid-cols-[var(--s04w-a)_var(--s04w-b)] md:gap-0 md:pl-0" style={{ "--s04w-a": `${pos(2021)}fr`, "--s04w-b": `${100 - pos(2021)}fr` }}>
              {MEILENSTEINE.map((m) => (
                <li key={m.jahr} className="relative md:pr-8">
                  <p className="s04-hoch font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] text-ink-900 ov-num md:h-[52px] md:text-[46px]" style={d(ankunft(m.jahr) - 150)}>
                    {m.jahr}
                  </p>
                  <Punkt className="-left-9 top-2.5 md:left-0 md:top-[69px]" style={d(ankunft(m.jahr))} />
                  <p className="s04-hoch mt-3 max-w-[20rem] text-[15px] leading-relaxed text-ink-600 md:mt-[54px]" style={d(ankunft(m.jahr) + 120)}>
                    {m.text}
                  </p>
                </li>
              ))}
              <li className="relative md:absolute md:right-0 md:top-0 md:text-right">
                <p className="s04-hoch font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] md:h-[52px] md:text-[46px]" style={d(ankunft(JAHR_HEUTE) - 150)}>
                  <span className="ov-text-gradient">heute</span>
                </p>
                <Punkt gross className="-left-[38px] top-2 md:left-auto md:-right-0.5 md:top-[67px]" style={d(ankunft(JAHR_HEUTE))} />
              </li>
            </ol>
          </div>

          {/* „heute“ – Verweis auf das Kennzahlenband im Hero (keine doppelte Kennzahlen-Karte) */}
          <div className="s04-hoch relative rounded-[1.75rem] bg-navy-950 p-6 text-white shadow-[0_30px_60px_-30px_rgba(3,18,43,0.6)] md:p-7" style={d(ankunft(JAHR_HEUTE) + 100)}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ov-500/25 blur-3xl" />
            <p className="relative text-[13px] text-white/70">Heute</p>
            <p className="relative mt-1.5 font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.7rem)] font-extrabold leading-tight tracking-[-0.02em]">
              Betriebe, Höfe und Gemeinden in allen neun Bundesländern
            </p>
            <p className="relative mt-3 text-[14px] leading-relaxed text-white/70">
              Die Gesamtzahlen – {kz("anlagen")} PV-Anlagen, {kz("leistung")} kWp – stehen im Kennzahlenband oben und auf der Presseseite.
            </p>
            <Link href="/presse" className="relative mt-4 inline-flex min-h-11 items-center text-[14px] font-semibold text-ov-300 underline-offset-4 hover:underline">
              Zahlen für Redaktionen
            </Link>
            <p className="relative mt-4 text-[11.5px] text-white/70">{KENNZAHLEN_HINWEIS_STAND}</p>
          </div>
        </S04Buehne>

        {/* ---------- Foto + drei Gründe ---------- */}
        <S04Buehne className="mt-20 grid gap-16 md:mt-24 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="relative pb-12 sm:pb-8 lg:col-span-5 lg:pb-0">
            <div className="s04-auf relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-100 shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]" style={d(0)}>
              <div className="s04-zoom absolute inset-0">
                <Image
                  src="/Images/AT/service/pv-wartung-techniker.jpg"
                  alt="Monteur mit Absturzsicherung trägt ein Photovoltaikmodul über ein Blechdach (Symbolbild)"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-[62%_50%]"
                />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
              <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
              {/* Stock-Foto (Commons, keine Ökovolt-Mitarbeiter) – sichtbar als Symbolbild gekennzeichnet (Welle A02).
                  Oben links; die Ortskarte rückt bis xl darunter, damit weder sie noch die „seit 2012“-Karte (unten) das Label verdeckt. */}
              <span className="absolute left-3 top-3 rounded-full bg-navy-950/70 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm md:left-5 md:top-5">Symbolbild</span>
            </div>
            <div className="s04-hoch absolute right-3 top-12 rounded-2xl bg-navy-950/85 px-4 py-3 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md md:right-5 md:top-14 xl:top-5" style={d(650)}>
              <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/85">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" /> {FIRMA.ort}, {FIRMA.bundesland}
              </p>
              <p className="mt-1 text-[13px] text-white/70">Einsatzgebiet: alle neun Bundesländer</p>
            </div>
            <div className="s04-hoch absolute bottom-0 left-4 max-w-[290px] rounded-3xl bg-white p-5 shadow-[0_30px_60px_-20px_rgba(3,18,43,0.35)] ring-1 ring-ink-100 sm:left-6 md:p-6 lg:-bottom-8 lg:-left-6" style={d(450)}>
              <p className="font-display text-[38px] font-extrabold leading-none tracking-[-0.035em] text-ink-900">
                seit <span className="ov-text-gradient">2012</span>
              </p>
              <p className="mt-2.5 text-[14px] leading-snug text-ink-600">betreiben die Gründer eigene Solarparks – wir bauen, was wir selbst betreiben würden.</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="border-b border-ink-100">
              {/* 01 – aus einer Hand */}
              <li className="s04w-grund s04-hoch relative grid gap-4 border-t border-ink-100 py-7 pl-0 sm:grid-cols-[3.25rem_minmax(0,1fr)] md:py-8 md:pl-5" style={d(150)}>
                <Nummer n="01" icon={Ruler} />
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] font-bold leading-snug text-ink-900 md:text-[20px]">Planung, Bau und Betrieb aus einer Hand</h3>
                  <ol className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Leistungen aus einer Hand">
                    {KETTE.map((k, i) => (
                      <li key={k} className="s04-pop flex min-h-[44px] items-center gap-2.5 rounded-xl bg-sand-50 px-3 py-2 ring-1 ring-ink-200/70" style={d(450 + i * 110)}>
                        <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-600 text-[10.5px] font-bold text-white ov-num">{i + 1}</span>
                        <span className="text-[13.5px] font-medium leading-tight text-ink-800">{k}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-ink-600">Montage durch den eigenen Elektrotechnik-Fachbetrieb – ein Ansprechpartner über die gesamte Lebensdauer.</p>
                </div>
              </li>

              {/* 02 – Regelung und Leittechnik (Formulierung aus src/data/marke.js PARKREGLER_SATZ – Rechteklärung offen) */}
              <li className="s04w-grund s04-hoch relative grid gap-4 border-t border-ink-100 py-7 pl-0 sm:grid-cols-[3.25rem_minmax(0,1fr)] md:py-8 md:pl-5" style={d(260)}>
                <Nummer n="02" icon={Cpu} />
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] font-bold leading-snug text-ink-900 md:text-[20px]">Regelung und Leittechnik</h3>
                  <ul className="mt-3.5 flex flex-wrap gap-2" aria-label="Regelung und Leittechnik">
                    {TECHNIK.map((t, i) => (
                      <li key={t.l} className="s04-pop inline-flex min-h-[34px] items-center gap-2 rounded-xl bg-navy-950 px-3 text-[13px] font-semibold text-white" style={d(700 + i * 120)}>
                        <t.icon aria-hidden="true" className="h-4 w-4 text-ov-300" strokeWidth={2} />
                        {t.l}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-ink-600">{PARKREGLER_SATZ} Abgestimmt auf TOR Erzeuger und österreichische Netzbetreiber.</p>
                </div>
              </li>

              {/* 03 – Eigene Leute und Maschinen (vom Auftraggeber bestätigt; sonst ausgeblendet) */}
              {AUSSTATTUNG_BESTAETIGT && (
                <li className="s04w-grund s04-hoch relative grid gap-4 border-t border-ink-100 py-7 pl-0 sm:grid-cols-[3.25rem_minmax(0,1fr)] md:py-8 md:pl-5" style={d(370)}>
                  <Nummer n="03" icon={Users} />
                  <div className="min-w-0">
                    <h3 className="font-display text-[19px] font-bold leading-snug text-ink-900 md:text-[20px]">Eigene Leute und Maschinen</h3>
                    <ul className="mt-3.5 flex flex-wrap gap-2" aria-label="Eigene Ausstattung">
                      {AUSSTATTUNG.map((a, i) => (
                        <li key={a.l} className="s04-pop inline-flex min-h-[34px] items-center gap-2 rounded-xl bg-sand-50 px-3 text-[13px] font-semibold text-ink-800 ring-1 ring-ink-200/70" style={d(900 + i * 120)}>
                          <a.icon aria-hidden="true" className="h-4 w-4 text-ov-600" strokeWidth={2} />
                          {a.l}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3.5 text-[15px] leading-relaxed text-ink-600">
                      Material kommt mit dem eigenen Lkw, auf Freiflächen arbeiten eigene Traktoren – und montiert wird vom eigenen Elektrotechnik-Fachbetrieb.{" "}
                      <Link href="/uber-uns#mannschaft" className="font-semibold text-ov-700 underline-offset-4 hover:underline">
                        Mannschaft und Maschinen
                      </Link>
                    </p>
                  </div>
                </li>
              )}
            </ol>
            <div className="s04-hoch mt-9" style={d(500)}>
              <Button href="/uber-uns" variant="secondary" pfeil>
                Über Ökovolt Österreich
              </Button>
            </div>
          </div>
        </S04Buehne>
      </Section>
    </>
  );
}

function Nummer({ n, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 sm:block">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-600 text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)]">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="font-display text-[12px] font-bold tracking-[0.16em] text-ov-700 sm:mt-2.5 sm:block sm:pl-1">{n}</span>
    </div>
  );
}
