import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Komponenten einer PV-Anlage.
 *
 * Vorher: ein Karussell mit 13 Slides, die aber nur 5 verschiedene
 * Komponenten zeigten (für die Endlosschleife verdoppelt) – mit Markennamen
 * ohne ein Wort Erklärung. Ausgerechnet Module und Montagegestell lagen
 * hinter dem Weiterklicken.
 *
 * Jetzt: alle Komponenten gleichzeitig sichtbar, dedupliziert, in der
 * Reihenfolge, in der der Strom fließt – und jede mit einem Satz, wozu sie
 * da ist. Bilder und Titel kommen weiter aus dem Backoffice.
 */

const schluessel = (t) => (t || "").toLowerCase().replace(/\s+/g, "");

// Reihenfolge und Erläuterung je Komponente. Unbekannte Einträge aus dem
// Backoffice werden trotzdem angezeigt – nur ohne Zusatztext, am Ende.
const WISSEN = {
  photovoltaikmodule: {
    gruppe: "Erzeugung",
    text: "Wandeln Sonnenlicht in Gleichstrom. Entscheidend sind Wirkungsgrad, Leistungsgarantie und das Verhalten bei Hitze und diffusem Licht.",
    href: "/produkte/photovoltaikanlage",
    link: "Zur PV-Anlage",
  },
  wechselrichter: {
    gruppe: "Erzeugung",
    text: "Macht aus dem Gleichstrom der Module nutzbaren Wechselstrom fürs Haus. Hybrid-Geräte binden zusätzlich den Speicher an.",
    href: "/produkte/hersteller",
    link: "Hersteller ansehen",
  },
  montagegestell: {
    gruppe: "Erzeugung",
    text: "Trägt die Module sicher auf dem Dach – abgestimmt auf Eindeckung, Statik sowie Wind- und Schneelast am Standort.",
    href: "/forderungen/baurecht",
    link: "Baurecht & Dach",
  },
  byd: {
    gruppe: "Speicher",
    text: "Modularer Batteriespeicher mit langlebigen LFP-Zellen, der sich in Stufen erweitern lässt, wenn der Verbrauch wächst.",
    href: "/produkte/stromspeicher/byd",
    link: "BYD im Detail",
  },
  huaweiluna: {
    gruppe: "Speicher",
    text: "Modularer Heimspeicher, der eng mit Huawei-Wechselrichtern zusammenarbeitet und sich bequem per App steuern lässt.",
    href: "/produkte/stromspeicher/huawei",
    link: "LUNA im Detail",
  },
};
const REIHENFOLGE = Object.keys(WISSEN);

export default function KomponentenSlider({ data }) {
  const roh = data?.third_card_component_table ?? [];

  // Dubletten der früheren Endlosschleife entfernen
  const gesehen = new Set();
  const komponenten = roh
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

  if (komponenten.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
          {data?.third_card_title || "Komponenten"}
        </p>
        <h2 className="text-balance text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
          {data?.third_card_subtitle || "Woraus eine PV-Anlage besteht"}
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-gray-600">
          Vom Dach bis in die Steckdose – in der Reihenfolge, in der der Strom fließt.
        </p>
      </div>

      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {komponenten.map((k, i) => {
          const w = WISSEN[schluessel(k.title)];
          return (
            <li
              key={schluessel(k.title)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#669933] hover:shadow-lg"
            >
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-5 pb-4 pt-12">
                <span className="absolute left-4 top-4 z-10 text-[13px] font-semibold tabular-nums text-gray-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {w?.gruppe && (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-[#f0f7e6] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f6b1a]">
                    {w.gruppe}
                  </span>
                )}
                <div className="relative h-full w-full">
                  <Image
                    src={k.image ? `/api/image?path=${k.image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={k.alt_text || k.title}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
                    quality={80}
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-[17px] font-semibold text-gray-900">{k.title}</h3>
                {w?.text && (
                  <p className="mb-4 flex-1 text-[14px] leading-relaxed text-gray-600">{w.text}</p>
                )}
                {w?.href && (
                  <Link
                    href={w.href}
                    className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#669933] hover:text-[#558822]"
                  >
                    {w.link}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
