import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Komponenten einer PV-Anlage – im Design-System 2026.
 * Logik aus Slider.js übernommen: dedupliziert, in Flussrichtung des Stroms
 * sortiert, jede Komponente mit einem erklärenden Satz. Bilder und Titel aus
 * dem Backoffice (third_card_component_table), sonst statische Fallbacks.
 */

const schluessel = (t) => (t || "").toLowerCase().replace(/\s+/g, "");

const WISSEN = {
  photovoltaikmodule: {
    gruppe: "Erzeugung",
    text: "Wandeln Sonnenlicht in Gleichstrom. Entscheidend sind Wirkungsgrad, Leistungsgarantie und das Verhalten bei Hitze und diffusem Licht.",
    href: "/produkte/photovoltaikanlage",
    link: "Zur PV-Anlage",
    bild: "/Images/Dienstleistungen/Photovoltaik/photovoltaikmodule.png",
  },
  wechselrichter: {
    gruppe: "Erzeugung",
    text: "Macht aus dem Gleichstrom der Module nutzbaren Wechselstrom fürs Haus. Hybrid-Geräte binden zusätzlich den Speicher an.",
    href: "/produkte/hersteller",
    link: "Hersteller ansehen",
    bild: "/Images/Dienstleistungen/Photovoltaik/welschelrichter.webp",
  },
  montagegestell: {
    gruppe: "Erzeugung",
    text: "Trägt die Module sicher auf dem Dach – abgestimmt auf Eindeckung, Statik sowie Wind- und Schneelast am Standort.",
    href: "/forderungen/baurecht",
    link: "Baurecht & Dach",
    bild: "/Images/Dienstleistungen/Photovoltaik/Montagegestell.png",
  },
  byd: {
    gruppe: "Speicher",
    text: "Modularer Batteriespeicher mit langlebigen LFP-Zellen, der sich in Stufen erweitern lässt, wenn der Verbrauch wächst.",
    href: "/produkte/stromspeicher/byd",
    link: "BYD im Detail",
    bild: "/Images/Dienstleistungen/Photovoltaik/BYD.png",
  },
  huaweiluna: {
    gruppe: "Speicher",
    text: "Modularer Heimspeicher, der eng mit Huawei-Wechselrichtern zusammenarbeitet und sich bequem per App steuern lässt.",
    href: "/produkte/stromspeicher/huawei",
    link: "LUNA im Detail",
    bild: "/Images/Dienstleistungen/Photovoltaik/HUAWEI-LUNA.jpg",
  },
};
const REIHENFOLGE = Object.keys(WISSEN);

const FALLBACK = [
  { title: "Photovoltaikmodule" },
  { title: "Wechselrichter" },
  { title: "Montagegestell" },
  { title: "BYD" },
  { title: "HUAWEI LUNA" },
];

export default function KomponentenUebersicht({ komponenten: roh }) {
  const quelle = roh?.length ? roh : FALLBACK;
  const gesehen = new Set();
  const liste = quelle
    .filter((k) => {
      const s = schluessel(k?.title);
      if (!s || gesehen.has(s)) return false;
      gesehen.add(s);
      return true;
    })
    .sort((a, b) => {
      const ia = REIHENFOLGE.indexOf(schluessel(a.title));
      const ib = REIHENFOLGE.indexOf(schluessel(b.title));
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  if (liste.length === 0) return null;

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
      {liste.map((k, i) => {
        const w = WISSEN[schluessel(k.title)];
        const src = k.image ? `/api/image?path=${k.image}` : w?.bild || "/Images/Dienstleistungen/Photovoltaik/photovoltaikmodule.png";
        return (
          <Reveal as="li" key={schluessel(k.title)} delay={i * 80} className="relative flex">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="absolute -left-[18px] top-[92px] z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-white text-ov-600 shadow ring-1 ring-ink-200 lg:flex xl:-left-5"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            )}
            <article className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
              <div className="relative h-52 border-b border-ink-100 bg-white">
                <span className="ov-num absolute left-4 top-4 z-10 font-display text-[13px] font-bold text-ink-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {w?.gruppe && (
                  <span
                    className={`absolute right-4 top-4 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                      w.gruppe === "Speicher" ? "bg-navy-50 text-navy-700" : "bg-ov-50 text-ov-700"
                    }`}
                  >
                    {w.gruppe}
                  </span>
                )}
                <div className="absolute inset-x-6 bottom-4 top-12">
                  <Image
                    src={src}
                    alt={k.alt_text || k.title}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 xl:p-6">
                <h3 className="font-display text-[18px] font-bold leading-snug text-ink-900">{k.title}</h3>
                {w?.text && <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-600">{w.text}</p>}
                {w?.href && (
                  <Link
                    href={w.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 after:absolute after:inset-0 after:content-[''] hover:text-ov-800"
                  >
                    {w.link}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}
    </ol>
  );
}
