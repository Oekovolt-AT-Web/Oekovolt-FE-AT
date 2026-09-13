"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Fliesstext from "@/components/Reusable/Fliesstext";

const schluessel = (t) => t?.title?.toLowerCase().replace(/\s+/g, "") || "";

/**
 * Zielgruppen-Tabs (Privathaushalte, Mehrfamilienhäuser, Landwirtschaft).
 *
 * Vorher: Der Inhalt startete per Keyframe-Animation bei opacity 0 und blieb
 * in Screenshots und bei unterbrochener Animation sichtbar ausgewaschen. Die
 * Buttons hatten keine Tab-Semantik, Screenreader hörten eine lose Liste.
 *
 * Jetzt: echtes WAI-ARIA-Tab-Muster (tablist/tab/tabpanel), Pfeiltasten zum
 * Wechseln, Inhalt immer voll deckend. Ein Wechsel blendet nur weich über –
 * und nur, wenn keine reduzierte Bewegung eingestellt ist.
 */
export default function Tabs({
  data,
  dachzeile = "Für wen wir bauen",
  titel = "Die passende Anlage für jedes Gebäude",
  ariaLabel = "Zielgruppen",
  // Optional: { [Tab-Titel]: { href, label } } – Weiterführender Link im Panel.
  links = {},
}) {
  const tabs = data?.first_card_table ?? [];
  const [aktiv, setAktiv] = useState(schluessel(tabs[0]));
  const basis = useId();
  const refs = useRef([]);

  if (tabs.length === 0) return null;

  const onKey = (e, i) => {
    let ziel = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") ziel = (i + 1) % tabs.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") ziel = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") ziel = 0;
    if (e.key === "End") ziel = tabs.length - 1;
    if (ziel === null) return;
    e.preventDefault();
    setAktiv(schluessel(tabs[ziel]));
    refs.current[ziel]?.focus();
  };

  const aktuellerTab = tabs.find((t) => schluessel(t) === aktiv) ?? tabs[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
          {dachzeile}
        </p>
        <h2 className="text-balance text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
          {titel}
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        {/* Tab-Leiste: mobil horizontal scrollbar, ab lg als Spalte */}
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation="vertical"
          /* Ab lg mitlaufend: das Panel ist deutlich höher als die Leiste,
             so bleibt der Wechsel zum nächsten Baustein immer in Reichweite. */
          className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:sticky lg:top-28 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
        >
          {tabs.map((tab, i) => {
            const k = schluessel(tab);
            const ist = k === aktiv;
            return (
              <button
                key={k}
                ref={(el) => (refs.current[i] = el)}
                id={`${basis}-tab-${k}`}
                role="tab"
                type="button"
                aria-selected={ist}
                aria-controls={`${basis}-panel`}
                tabIndex={ist ? 0 : -1}
                onClick={() => setAktiv(k)}
                onKeyDown={(e) => onKey(e, i)}
                className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[16px] transition-colors lg:w-full ${
                  ist
                    ? "border-[#669933] bg-[#f0f7e6] font-semibold text-[#3f6b1a]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`relative h-9 w-9 shrink-0 rounded-lg p-1.5 ${ist ? "bg-white" : "bg-gray-50"}`}
                >
                  <span className="relative block h-full w-full">
                    <Image
                      src={tab?.icon ? `/api/image?path=${tab.icon}` : "/Images/Jobs/jobs3.jpg"}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </span>
                </span>
                <span className="whitespace-nowrap">{tab?.title}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          id={`${basis}-panel`}
          role="tabpanel"
          aria-labelledby={`${basis}-tab-${aktiv}`}
          tabIndex={0}
          key={aktiv}
          className="ov-tab-panel overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[16/8] w-full bg-gray-100">
            <Image
              src={aktuellerTab?.card_image ? `/api/image?path=${aktuellerTab.card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={aktuellerTab?.card_alt_text || aktuellerTab?.card_title || ""}
              fill
              sizes="(min-width: 1024px) 860px, 100vw"
              quality={80}
              className="object-cover object-center"
            />
          </div>
          <div className="p-6 md:p-9">
            <h3 className="mb-4 text-pretty text-[22px] sm:text-balance font-semibold leading-snug text-gray-900 md:text-[26px]">
              {aktuellerTab?.card_title}
            </h3>
            {/* Fliesstext gliedert den Backoffice-Text an Satzgrenzen – er kam
                als ein ungegliederter Block von über 500 Zeichen. */}
            <Fliesstext
              text={aktuellerTab?.card_description}
              absatzClassName="text-[16px] leading-relaxed text-gray-600 md:text-[17px]"
            />
            {links[aktuellerTab?.title] && (
              <Link
                href={links[aktuellerTab.title].href}
                className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[#669933] hover:text-[#558822]"
              >
                {links[aktuellerTab.title].label}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
