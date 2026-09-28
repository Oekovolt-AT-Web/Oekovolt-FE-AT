"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, House, Landmark, Tractor, Warehouse } from "lucide-react";
import Fliesstext from "@/components/Reusable/Fliesstext";

/**
 * Zielgruppen-Umschalter Österreich: Gewerbe & Industrie, Landwirtschaft,
 * Gemeinden, Privat (nachgeordnet). Statische Inhalte – die früheren
 * Backoffice-Texte stammten von der deutschen Seite. WAI-ARIA-Tabmuster mit
 * Pfeiltasten.
 */

const ERGAENZUNG = {
  gewerbe: {
    icon: Warehouse,
    kurz: "Hallen, Produktion, Handel",
    mobil: "Gewerbe",
    punkte: [
      "Planung nach Lastgang in Viertelstundenwerten",
      "Hallendach mit Ballast, Trapezblech oder Ost-West",
      "Netzanschluss nach TOR mit eigenem Parkregler",
    ],
    link: { href: "/gewerbe", label: "Photovoltaik für Gewerbe & Industrie" },
  },
  landwirtschaft: {
    icon: Tractor,
    kurz: "Stall, Scheune, Freifläche",
    mobil: "Landwirtschaft",
    punkte: [
      "Glas-Glas-Module für Stallbereiche mit Ammoniak",
      "Große Dachflächen, hoher Tagverbrauch für Kühlung und Lüftung",
      "Agri-PV und Freifläche nach Widmung des Bundeslandes",
    ],
    link: { href: "/landwirtschaft", label: "Photovoltaik in der Landwirtschaft" },
  },
  gemeinden: {
    icon: Landmark,
    kurz: "Schulen, Bauhöfe, Kläranlagen",
    mobil: "Gemeinden",
    punkte: [
      "Anlagen für kommunale Gebäude und Infrastruktur",
      "Energiegemeinschaften mit Bürgerinnen und Bürgern",
      "Unterlagen für Vergabe und Gemeinderatsbeschluss",
    ],
    link: { href: "/kommunen", label: "Photovoltaik für Gemeinden & Länder" },
  },
  privat: {
    icon: House,
    kurz: "Premium-Wohnhaus & Chalet",
    mobil: "Privat",
    punkte: [
      "Speicher, Wallbox und Wärmepumpe von Anfang an mitdenken",
      "Schneelast und Optik bei alpinen Objekten",
      "Ersatzstrom für die Blackout-Vorsorge",
    ],
    link: { href: "/chalets", label: "Luxus-Chalets & Alpin" },
  },
};

const GRUPPEN = [
  {
    key: "gewerbe",
    title: "Gewerbe & Industrie",
    card_title: "Solarstrom dort, wo er tagsüber gebraucht wird",
    bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
    card_alt_text: "Gewerbegebäude mit Photovoltaikanlagen auf den Flachdächern",
    card_description:
      "Betriebe verbrauchen Strom vor allem tagsüber – genau dann, wenn die Anlage erzeugt. Jede selbst genutzte Kilowattstunde spart Energiepreis, Netzentgelte und Abgaben. Wir planen die Anlage nach Ihrem Lastgang, nicht nach der maximalen Dachfläche.",
  },
  {
    key: "landwirtschaft",
    title: "Landwirtschaft",
    card_title: "Dachflächen und Felder, die mitverdienen",
    bild: "/Images/Dienstleistungen/Photovoltaik/house.png",
    card_alt_text: "Holzscheune mit Photovoltaikmodulen auf dem Dach",
    card_description:
      "Ställe, Scheunen und Maschinenhallen bieten große Dachflächen, Kühlung und Lüftung einen hohen Tagverbrauch. Überschüsse verkaufen Sie an einen Stromhändler oder teilen sie in einer Energiegemeinschaft.",
  },
  {
    key: "gemeinden",
    title: "Gemeinden",
    card_title: "Öffentliche Gebäude als Kraftwerke",
    bild: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
    card_alt_text: "Luftaufnahme eines Gebäudes am Seeufer mit Photovoltaik auf mehreren Dachflächen",
    card_description:
      "Schulen, Bauhöfe, Freizeitanlagen und Kläranlagen haben große Dächer und einen gut planbaren Verbrauch. Mit einer Energiegemeinschaft profitieren auch Bürgerinnen und Bürger vom Gemeindestrom.",
  },
  {
    key: "privat",
    title: "Privat",
    card_title: "Premium-Wohnhaus und Chalet",
    bild: "/Images/Ratgeber/photovoltaik-im-winter.jpg",
    card_alt_text: "Photovoltaikanlage auf einem verschneiten Dach",
    card_description:
      "Für private Bauherren planen wir Anlagen dort, wo Optik, Schneelast und Systemintegration besondere Sorgfalt verlangen – mit Speicher, Wärmepumpe, Wallbox und Energiemanagement als ein System.",
  },
];

const schluessel = (t) => t?.key || "";

export default function ZielgruppenWahl() {
  const tabs = GRUPPEN;
  const [aktiv, setAktiv] = useState(0);
  const basis = useId();
  const refs = useRef([]);

  const onKey = (e, i) => {
    let ziel = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") ziel = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") ziel = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") ziel = 0;
    if (e.key === "End") ziel = tabs.length - 1;
    if (ziel === null) return;
    e.preventDefault();
    setAktiv(ziel);
    refs.current[ziel]?.focus();
  };

  const tab = tabs[aktiv] ?? tabs[0];
  const extra = ERGAENZUNG[schluessel(tab)];
  const bild = tab.bild;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Zielgruppen"
        className="mx-auto grid max-w-5xl grid-cols-2 gap-1.5 lg:grid-cols-4 rounded-[1.4rem] bg-white p-1.5 shadow-sm ring-1 ring-ink-200/70"
      >
        {tabs.map((t, i) => {
          const ist = i === aktiv;
          const Icon = ERGAENZUNG[schluessel(t)]?.icon || House;
          return (
            <button
              key={schluessel(t) || i}
              ref={(el) => (refs.current[i] = el)}
              id={`${basis}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={ist}
              aria-controls={`${basis}-panel`}
              tabIndex={ist ? 0 : -1}
              onClick={() => setAktiv(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-center transition-all duration-300 sm:flex-row sm:gap-3 sm:px-4 ${
                ist ? "bg-navy-950 text-white shadow-lg" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  ist ? "bg-ov-500 text-white" : "bg-ov-50 text-ov-600"
                }`}
              >
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 sm:text-left">
                <span className="block text-[12.5px] font-semibold leading-tight sm:hidden">{ERGAENZUNG[schluessel(t)]?.mobil || t.title}</span>
                <span className="hidden text-[15.5px] font-semibold leading-tight sm:block">{t.title}</span>
                {ERGAENZUNG[schluessel(t)]?.kurz && (
                  <span className={`hidden text-[12.5px] leading-tight sm:block ${ist ? "text-white/60" : "text-ink-500"}`}>
                    {ERGAENZUNG[schluessel(t)].kurz}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${basis}-panel`}
        role="tabpanel"
        aria-labelledby={`${basis}-tab-${aktiv}`}
        tabIndex={0}
        className="mt-8 grid overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70 lg:grid-cols-[1.05fr_1fr]"
      >
        <div className="relative aspect-[16/11] bg-ink-100 lg:aspect-auto lg:min-h-[520px]">
          <Image
            key={bild}
            src={bild}
            alt={tab.card_alt_text || tab.card_title || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover motion-safe:animate-[ov-hero-in_700ms_cubic-bezier(0.22,1,0.36,1)_both]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[13px] font-semibold text-ink-900 shadow-lg">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ov-500" />
            {tab.title}
          </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8 md:p-10 lg:p-12">
          <h3 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[30px]">
            {tab.card_title}
          </h3>
          <Fliesstext text={tab.card_description} className="mt-4" absatzClassName="text-[16px] leading-relaxed text-ink-600" />

          {extra && (
            <>
              <ul className="mt-7 space-y-3 border-t border-ink-100 pt-7">
                {extra.punkte.map((p) => (
                  <li key={p} className="flex gap-3 text-[15px] leading-snug text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                      <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href={extra.link.href}
                className="group mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold text-ov-700 hover:text-ov-800"
              >
                {extra.link.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
