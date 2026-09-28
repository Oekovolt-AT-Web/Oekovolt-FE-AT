import Link from "next/link";
import { ArrowRight, Building2, Factory, Hotel, Landmark, Mountain, Phone, Sprout, Sun, Tractor } from "lucide-react";

import { FIRMA } from "@/lib/site";

/**
 * Projekt-Einstieg im Startseiten-Hero (Österreich, Gewerbe-Fokus).
 * Server-Komponente ohne JavaScript: Jede Kachel führt direkt in den
 * Angebots-Konfigurator und belegt dort die Objektart vor (?objekt=…).
 */
export const OBJEKTE = [
  { id: "gewerbe", label: "Gewerbe & Industrie", icon: Factory },
  { id: "freiflaeche", label: "Freifläche", icon: Sun },
  { id: "agri", label: "Agri-PV", icon: Sprout },
  { id: "landwirtschaft", label: "Landwirtschaft", icon: Tractor },
  { id: "hotellerie", label: "Hotellerie & Tourismus", icon: Hotel },
  { id: "gemeinde", label: "Gemeinde & öffentl. Hand", icon: Landmark },
  { id: "chalet", label: "Chalet & Premium", icon: Mountain },
  { id: "sonstiges", label: "Anderes Objekt", icon: Building2 },
];

export default function HeroProjektStart() {
  return (
    <div className="ov-glass relative overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] md:p-8">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ov-400/30 blur-3xl" />
      <div className="relative">
        <p className="font-display text-[19px] font-bold">Wofür planen Sie Photovoltaik?</p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/65">
          Objektart wählen – im Konfigurator erfassen Sie Fläche, Verbrauch, Lastgang und Netzebene in rund zwei Minuten.
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-2">
          {OBJEKTE.map((o) => (
            <li key={o.id}>
              <Link
                href={`/angebot?objekt=${o.id}`}
                className="group flex h-full min-h-[3.25rem] items-center gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5 text-[13.5px] font-semibold leading-snug text-white/90 transition-all hover:bg-white hover:text-navy-950"
              >
                <o.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300 transition-colors group-hover:text-ov-600" />
                <span className="min-w-0">{o.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/angebot?objekt=gewerbe"
          className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-ov-600 py-3.5 text-[15.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(102,153,51,0.9)] transition-all hover:bg-ov-400"
        >
          Ersteinschätzung anfordern
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <a href={FIRMA.telefonHref} className="mt-4 flex items-center justify-center gap-2 text-[13.5px] text-white/70 hover:text-white">
          <Phone aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
          Lieber direkt sprechen: <span className="font-semibold text-white">{FIRMA.telefon}</span>
        </a>
      </div>
    </div>
  );
}
