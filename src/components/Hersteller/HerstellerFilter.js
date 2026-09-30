"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, MonitorCog } from "lucide-react";
import { herstellerId } from "./ids";

/**
 * Filterbare Herstellerübersicht.
 * Alle Karten werden serverseitig gerendert (SEO); der Filter blendet nur aus.
 * props: kategorien [{ name, hersteller: [{ title, slug, main_description, kontexte?, bild?, banner_image?, logo_image?, tag?, fakten? }] }]
 *   kontexte – „wechselrichter“ / „stromspeicher“: Link auf die Detailseite der (belegten) Marke
 *   bild   – lokaler Bildpfad (hat Vorrang vor banner_image aus dem Backoffice)
 *   tag    – kurze Hervorhebung, z. B. „Hersteller aus Österreich“
 *   fakten – [["Sitz", "Pettenbach, OÖ"], …] für eine kompakte Kerndatenliste
 */

const img = (p) => (p ? `/api/image?path=${p}` : "/Images/Dienstleistungen/Photovoltaik/photovoltaikmodule.png");

function Karte({ h, kategorie, index }) {
  const [offen, setOffen] = useState(false);
  const lang = (h.main_description || "").length > 220;
  return (
    <article id={herstellerId(h.title)} className="group ov-card-hover flex h-full w-full scroll-mt-28 flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
        <Image
          src={h.bild || img(h.banner_image)}
          alt={h.alt_banner_image?.trim() || `${h.title} – Produktbild`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index < 3}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
        <span className="absolute right-4 top-4 rounded-full bg-navy-950/70 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {kategorie}
        </span>
        {h.logo_image && (
          <span className="absolute bottom-4 left-4 flex h-14 min-w-28 items-center justify-center rounded-2xl bg-white px-4 shadow-lg">
            <Image src={img(h.logo_image)} alt={h.alt_logo_image?.trim() || `${h.title} Logo`} width={110} height={36} className="h-8 w-auto max-w-[110px] object-contain" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        {h.tag && <p className="mb-2 inline-flex self-start rounded-full bg-ov-50 px-3 py-1 text-[12px] font-semibold text-ov-700 ring-1 ring-ov-200">{h.tag}</p>}
        <h4 className="ov-h3 text-ink-900">{h.title}</h4>
        <p className={`mt-3 text-[15px] leading-relaxed text-ink-600 ${!offen && lang ? "line-clamp-4" : ""}`}>{h.main_description}</p>
        {Array.isArray(h.fakten) && h.fakten.length > 0 && (
          <dl className="mt-4 divide-y divide-ink-100 rounded-2xl text-[13.5px] ring-1 ring-ink-200/70">
            {h.fakten.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 px-4 py-2">
                <dt className="text-ink-500">{k}</dt>
                <dd className="text-right font-semibold text-ink-800">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {(h.kontexte?.includes("wechselrichter") || h.kontexte?.includes("stromspeicher")) && (
          <div className="mt-4 flex flex-col items-start">
            {h.kontexte.includes("wechselrichter") && (
              <Link href={`/produkte/wechselrichter/${h.slug}`} className="group/l inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                {h.title}-Wechselrichter im Detail
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/l:translate-x-1" />
              </Link>
            )}
            {h.kontexte.includes("stromspeicher") && (
              <Link href={`/produkte/stromspeicher/${h.slug}`} className="group/l inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                {h.title}-Speicher im Detail
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/l:translate-x-1" />
              </Link>
            )}
          </div>
        )}
        {lang && (
          <button
            type="button"
            onClick={() => setOffen((o) => !o)}
            aria-expanded={offen}
            className="mt-auto inline-flex h-11 items-center gap-1.5 self-start pt-3 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800"
          >
            {offen ? "Weniger anzeigen" : "Mehr erfahren"}
            <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${offen ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </article>
  );
}

export default function HerstellerFilter({ kategorien = [] }) {
  const [aktiv, setAktiv] = useState("alle");
  const gesamt = kategorien.reduce((a, k) => a + k.hersteller.length, 0);
  const sichtbar = kategorien.filter((k) => aktiv === "alle" || k.name === aktiv);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Kategorie filtern" className="ov-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {[{ name: "alle", label: "Alle Hersteller", n: gesamt }, ...kategorien.map((k) => ({ name: k.name, label: k.name, n: k.hersteller.length }))].map((c) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={aktiv === c.name}
              onClick={() => setAktiv(c.name)}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold transition-all duration-300 ${
                aktiv === c.name ? "bg-navy-950 text-white shadow-lg" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300"
              }`}
            >
              {c.label}
              <span className={`ov-num rounded-full px-2 py-0.5 text-[12px] ${aktiv === c.name ? "bg-white/15 text-white" : "bg-ink-100 text-ink-600"}`}>{c.n}</span>
            </button>
          ))}
        </div>
        <p className="text-[14px] text-ink-500" aria-live="polite">
          {sichtbar.reduce((a, k) => a + k.hersteller.length, 0)} Marken angezeigt
        </p>
      </div>

      <div className="mt-10 space-y-16">
        {sichtbar.map((k) => (
          <section key={k.name} aria-labelledby={`kat-${herstellerId(k.name)}`} className="ov-tab-panel">
            <div className="mb-6 flex items-baseline gap-3 border-b border-ink-200 pb-4">
              <h3 id={`kat-${herstellerId(k.name)}`} className="font-display text-[24px] font-extrabold tracking-tight text-ink-900 md:text-[28px]">
                {k.name}
              </h3>
              <span className="ov-num text-[14px] text-ink-500">{k.hersteller.length} Marken</span>
            </div>
            <ul className={`grid gap-5 md:grid-cols-2 ${k.hersteller.length >= 3 ? "xl:grid-cols-3" : ""}`}>
              {k.hersteller.map((h, i) => (
                <li key={h.title} className="flex">
                  <Karte h={h} kategorie={k.name} index={i} />
                </li>
              ))}
              {k.hersteller.length === 1 && (
                <li className="flex">
                  <div className="ov-noise relative isolate flex w-full flex-col justify-end overflow-hidden rounded-3xl bg-navy-950 p-7 text-white md:p-9">
                    <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
                    <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-ov-500/25 blur-[100px]" />
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500/20 text-ov-300">
                      <MonitorCog aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <p className="mt-6 font-display text-[22px] font-extrabold leading-tight">Plus eigene Fernwartung und SCADA</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                      Herstellerübergreifend überwachen wir Anlagen zusätzlich mit eigenen Fernwartungs- und SCADA-Systemen – und regeln sie am Netzanschlusspunkt mit unserem Parkregler.
                    </p>
                    <Link href="/technik" className="group/l mt-6 inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-ov-300 hover:text-ov-200">
                      Unsere Technik
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/l:translate-x-1" />
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
