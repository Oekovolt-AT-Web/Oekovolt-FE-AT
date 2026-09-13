"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Check, House, Tractor } from "lucide-react";
import Fliesstext from "@/components/Reusable/Fliesstext";

/**
 * Zielgruppen-Umschalter (Privathaushalte, Mehrfamilienhäuser, Landwirtschaft).
 * Texte und Bilder aus dem Backoffice (first_card_table), ergänzt um kurze,
 * fachlich belastbare Eckpunkte je Zielgruppe. WAI-ARIA-Tabmuster mit
 * Pfeiltasten. Ohne API-Daten greifen statische Inhalte.
 */

const ERGAENZUNG = {
  privathaushalte: {
    icon: House,
    kurz: "Einfamilienhaus",
    mobil: "Privat",
    punkte: [
      "Speicher, Wallbox und Wärmepumpe von Anfang an mitdenken",
      "0 % Umsatzsteuer auf Anlage und Montage (§ 12 Abs. 3 UStG)",
      "Montage meist in 1–2 Tagen",
    ],
    link: { href: "/produkte/stromspeicher", label: "Mit Stromspeicher kombinieren" },
  },
  mehrfamilienhäuser: {
    icon: Building2,
    kurz: "Vermieter & WEG",
    mobil: "Mehrfamilien",
    punkte: [
      "Mieterstrom oder gemeinschaftliche Gebäudeversorgung möglich",
      "Basis für Ladeinfrastruktur an den Stellplätzen",
      "Steigert die Attraktivität und den Wert der Immobilie",
    ],
    link: { href: "/produkte/mieterstrom", label: "Mehr zu Mieterstrom" },
  },
  landwirtschaft: {
    icon: Tractor,
    kurz: "Höfe & Hallen",
    punkte: [
      "Große Hallendächer, hoher Tagesverbrauch für Kühlung, Lüftung, Technik",
      "Ab 100 kWp ist Direktvermarktung vorgeschrieben – wir planen sie mit",
      "Referenz: Landwirtschaftsbetrieb in Betzigau",
    ],
    link: { href: "/service/direktvermarktung", label: "Direktvermarktung erklärt" },
  },
};

const FALLBACK = [
  {
    title: "Privathaushalte",
    card_title: "Warum eine PV-Anlage für Ihr Zuhause?",
    card_image: null,
    bild: "/Images/Dienstleistungen/Photovoltaik/house.png",
    card_alt_text: "Dach mit Photovoltaik-Modulen",
    card_description:
      "Mit einer eigenen Photovoltaikanlage erzeugen Sie Strom direkt auf Ihrem Dach, senken Ihre Stromkosten dauerhaft und machen sich unabhängiger von steigenden Strompreisen.",
  },
  {
    title: "Mehrfamilienhäuser",
    card_title: "Maßgeschneiderte Photovoltaik für Ihr Gebäude",
    bild: "/Images/Dienstleistungen/Photovoltaik/Bild1.png",
    card_alt_text: "Gebäude mit Photovoltaik-Modulen",
    card_description:
      "Als Eigentümer eines Mehrfamilienhauses profitieren Sie von reduzierten Energiekosten, eigener Stromproduktion und der Basis für E-Mobilität – und steigern den Wert Ihrer Immobilie.",
  },
  {
    title: "Landwirtschaft",
    card_title: "Die Kraft der Sonne nutzen",
    bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
    card_alt_text: "Photovoltaik auf landwirtschaftlichem Gebäude",
    card_description:
      "Solarstrom für Hallen, Maschinen und Kühlung senkt die laufenden Betriebskosten und macht Ihren Hof unabhängiger.",
  },
];

const schluessel = (t) => (t?.title || "").toLowerCase().replace(/\s+/g, "");

export default function ZielgruppenWahl({ gruppen }) {
  const tabs = gruppen?.length ? gruppen : FALLBACK;
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
  const bild = tab.card_image ? `/api/image?path=${tab.card_image}` : tab.bild || "/Images/Dienstleistungen/Photovoltaik/house.png";

  return (
    <div>
      <div
        role="tablist"
        aria-label="Zielgruppen"
        className="mx-auto grid max-w-3xl grid-cols-3 gap-1.5 rounded-[1.4rem] bg-white p-1.5 shadow-sm ring-1 ring-ink-200/70"
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
                  <span className={`hidden text-[12.5px] leading-tight sm:block ${ist ? "text-white/60" : "text-ink-400"}`}>
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
