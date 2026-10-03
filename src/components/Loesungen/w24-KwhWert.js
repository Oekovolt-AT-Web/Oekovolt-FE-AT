// src/components/Loesungen/w24-KwhWert.js
//
// „Was eine kWh vom Dach wert ist“ – Wirtschaftlichkeit in einer Grafik (Gewerbe).
// Links die Hebel als nummerierte Liste, rechts eine gezeichnete Rechnung: der Arbeitspreis,
// den eine selbst genutzte kWh vermeidet, baut sich Baustein für Baustein auf und steht dem
// Überschusserlös gegenüber. Darunter das Ergebnis der offengelegten Beispielrechnung.
//
// Server-Komponente; Aufbau-Animation über <S04Buehne/> (Klassen aus s04-stil, nur transform/opacity).
// Alle Zahlen kommen als Props aus der Seite (Beispielrechnung) – hier wird nichts erfunden.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import S04Buehne from "@/components/Startseite/s04-Buehne";
import { S04_BASIS, d } from "@/components/Startseite/s04-stil";

const CSS = `
${S04_BASIS}
.w24kw-zeile{transition:background-color .3s}
.w24kw-zeile::before{content:"";position:absolute;left:0;top:14px;bottom:14px;width:2px;border-radius:2px;background:var(--color-ov-500);transform:scaleY(0);transform-origin:50% 0;transition:transform .45s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){.w24kw-zeile:hover::before{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){.w24kw-zeile::before{transition:none}}
`;

const zahl = (s) => Number(String(s).replace(",", "."));

/**
 * eyebrow, titel, text, hebel: [{ titel, text }]
 * posten: [{ label, wert: "11,00", farbe }]  (Bestandteile in ct/kWh, Summe = summe)
 * summe: "14,64", einspeisung: { label, wert: "6,0" }, faktor: "2,4"
 * ergebnis: [{ wert, label }], kopf: { titel, chip }, fuss, fussLink: { label, href }
 * aktionen: [{ label, href }]
 */
export default function W24KwhWert({
  eyebrow,
  titel,
  text,
  hebel = [],
  posten = [],
  summe,
  einspeisung,
  faktor,
  ergebnis = [],
  kopf = {},
  fuss,
  fussLink,
  aktionen = [],
}) {
  const gesamt = zahl(summe);
  const anteilEin = einspeisung
    ? Math.round((zahl(einspeisung.wert) / gesamt) * 1000) / 10
    : 0;
  let lauf = 300;

  return (
    <div data-blk="kwh-wert">
      <style>{CSS}</style>
      <div className="mb-10 grid gap-5 md:mb-14 lg:grid-cols-12 lg:items-end lg:gap-10">
        <Reveal className="lg:col-span-7">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <h2 className="ov-h2 max-w-[44rem] text-ink-900">{titel}</h2>
        </Reveal>
        {text && (
          <Reveal delay={120} className="lg:col-span-5">
            <p className="max-w-[34rem] text-[16px] leading-relaxed text-ink-600 md:text-[17px]">
              {text}
            </p>
          </Reveal>
        )}
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        {/* ---------- Hebel ---------- */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <ol className="divide-y divide-ink-100 border-y border-ink-100">
            {hebel.map((h, i) => (
              <Reveal
                as="li"
                key={h.titel}
                delay={i * 60}
                className="w24kw-zeile relative flex gap-4 py-3.5 pl-4"
              >
                <span className="ov-num w-6 shrink-0 pt-px font-display text-[13px] font-bold text-ov-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-ink-600">
                  <strong className="font-semibold text-ink-900">
                    {h.titel}
                  </strong>{" "}
                  – {h.text}
                </p>
              </Reveal>
            ))}
          </ol>
          {aktionen.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {aktionen.map((a, i) => (
                <Button
                  key={a.href}
                  href={a.href}
                  variant={i === 0 ? "primary" : "secondary"}
                  pfeil={i === 0}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Gezeichnete Rechnung ---------- */}
        <S04Buehne className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_40px_90px_-48px_rgba(15,23,42,0.45)] ring-1 ring-ink-900/[0.06] sm:p-8 md:p-10">
            <div
              aria-hidden="true"
              className="ov-grid-bg-light pointer-events-none absolute inset-x-0 top-0 h-56"
            />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-display text-[19px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[21px]">
                  {kopf.titel}
                </p>
                {kopf.chip && (
                  <span className="rounded-full bg-ink-50 px-3 py-1 text-[12px] font-semibold text-ink-600 ring-1 ring-ink-900/[0.06]">
                    {kopf.chip}
                  </span>
                )}
              </div>

              {/* Balken 1: vermiedene Kosten je kWh */}
              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <p className="text-[14px] font-semibold text-ink-700">
                    Selbst verbraucht – das entfällt
                  </p>
                  <p
                    className="s04-hoch shrink-0 font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] text-ink-900 ov-num sm:text-[38px]"
                    style={d(1500)}
                  >
                    {summe}{" "}
                    <span className="text-[0.5em] font-bold text-ink-500">
                      ct/kWh
                    </span>
                  </p>
                </div>
                <div className="mt-3 flex h-12 gap-[3px] overflow-hidden rounded-xl bg-ink-50 sm:h-14">
                  {posten.map((p) => {
                    const breite = (zahl(p.wert) / gesamt) * 100;
                    const verz = lauf;
                    lauf += 260;
                    return (
                      <span
                        key={p.label}
                        aria-hidden="true"
                        className="s04-skx relative h-full first:rounded-l-xl last:rounded-r-xl"
                        style={d(verz, {
                          width: `${Math.round(breite * 10) / 10}%`,
                          minWidth: 6,
                          background: p.farbe,
                          "--s04-t": ".9s",
                        })}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px bg-white/40"
                        />
                      </span>
                    );
                  })}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
                  {posten.map((p, i) => (
                    <div
                      key={p.label}
                      className="s04-auf min-w-0"
                      style={d(380 + i * 260)}
                    >
                      <dt className="flex items-center gap-2 text-[12.5px] leading-snug text-ink-500">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                          style={{ background: p.farbe }}
                        />
                        {p.label}
                      </dt>
                      <dd className="ov-num mt-1 pl-[18px] font-display text-[16px] font-bold text-ink-900">
                        {p.wert} ct
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Balken 2: Überschusserlös */}
              {einspeisung && (
                <div className="mt-8 border-t border-dashed border-ink-200 pt-7">
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-[14px] font-semibold text-ink-700">
                      {einspeisung.label}
                    </p>
                    <p
                      className="s04-hoch shrink-0 font-display text-[22px] font-extrabold leading-none tracking-[-0.02em] text-ink-500 ov-num sm:text-[26px]"
                      style={d(1700)}
                    >
                      {einspeisung.wert}{" "}
                      <span className="text-[0.55em] font-bold">ct/kWh</span>
                    </p>
                  </div>
                  <div className="mt-3 h-12 overflow-hidden rounded-xl bg-ink-50 sm:h-14">
                    <span
                      aria-hidden="true"
                      className="s04-skx block h-full rounded-xl bg-[repeating-linear-gradient(135deg,#ffd873_0_8px,#ffcf5c_8px_16px)]"
                      style={d(1350, {
                        width: `${anteilEin}%`,
                        "--s04-t": "1s",
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Faktor */}
              {faktor && (
                <div
                  className="s04-hoch mt-7 flex items-center gap-4 rounded-2xl bg-navy-950 p-4 text-white sm:gap-5 sm:p-5"
                  style={d(2000)}
                >
                  <span className="shrink-0 font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] sm:text-[42px]">
                    <span className="ov-text-gradient-light">≈ {faktor}×</span>
                  </span>
                  <p className="text-[14px] leading-snug text-white/75 sm:text-[15px]">
                    So viel mehr ist eine selbst genutzte Kilowattstunde im
                    Beispiel wert als eine eingespeiste.
                  </p>
                </div>
              )}

              {/* Ergebnis */}
              {ergebnis.length > 0 && (
                <dl className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {ergebnis.map((e, i) => (
                    <div
                      key={e.label}
                      className="s04-hoch flex flex-row-reverse items-center justify-between gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-900/[0.05] sm:block"
                      style={d(2200 + i * 120)}
                    >
                      <dd className="ov-num font-display text-[24px] font-extrabold leading-none tracking-tight text-ink-900">
                        {e.wert}
                      </dd>
                      <dt className="text-[12.5px] sm:mt-2 leading-snug text-ink-500">
                        {e.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              )}

              {(fuss || fussLink) && (
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] leading-relaxed text-ink-500">
                  {fuss}
                  {fussLink && (
                    <Link
                      href={fussLink.href}
                      className="group inline-flex min-h-[44px] items-center gap-1 font-semibold text-ov-700 hover:text-ov-800"
                    >
                      {fussLink.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                      />
                    </Link>
                  )}
                </p>
              )}
            </div>
          </div>
        </S04Buehne>
      </div>
    </div>
  );
}
