import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Projektablauf.
 *
 * Vorher: sechs gleichwertige Karten ohne Nummer – ein Ablauf, dessen
 * Reihenfolge man sich selbst zusammenreimen musste, und am Ende kein
 * Hinweis, wie man anfängt.
 *
 * Jetzt: nummerierte Schritte als geordnete Liste (auch für Screenreader als
 * Reihenfolge erkennbar), eine Verbindungslinie auf schmalen Displays und ein
 * klarer Einstieg in Schritt 1. Texte und Icons bleiben aus dem Backoffice.
 */
export default function ProcessSteps({ data }) {
  const schritte = data?.fourth_card_information_table ?? [];
  if (schritte.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
          {data?.fourth_card_title || "Projektablauf"}
        </p>
        <h2 className="text-balance text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
          {data?.fourth_card_subtitle || "In sechs Schritten zur eigenen PV-Anlage"}
        </h2>
      </div>

      <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {schritte.map((schritt, i) => (
          <li key={schritt.title || i} className="relative flex gap-5">
            {/* Nummer + Icon; die senkrechte Linie verbindet die Schritte
                auf schmalen Displays, wo sie untereinander stehen. */}
            <div className="flex flex-col items-center">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#669933] shadow-md ring-4 ring-white">
                <Image
                  src={schritt.image ? `/api/image?path=${schritt.image}` : "/Images/Jobs/jobs3.jpg"}
                  alt=""
                  width={26}
                  height={26}
                  className="object-contain"
                />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#003473] text-[11px] font-bold tabular-nums text-white ring-2 ring-white">
                  {i + 1}
                </span>
              </span>
              {i < schritte.length - 1 && (
                <span aria-hidden="true" className="mt-3 w-px flex-1 bg-gradient-to-b from-[#669933]/40 to-transparent sm:hidden" />
              )}
            </div>

            <div className="pb-2">
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
                Schritt {i + 1}
              </p>
              <h3 className="mb-2 text-[19px] font-semibold text-gray-900">{schritt.title}</h3>
              <p className="text-[15px] leading-relaxed text-gray-600">{schritt.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left md:p-8">
        <div>
          <p className="text-[18px] font-semibold text-gray-900">
            Schritt 1 liegt bei Ihnen
          </p>
          <p className="mt-1 text-[15px] text-gray-600">
            Schicken Sie uns Ihre Anfrage – alles Weitere übernehmen wir.
          </p>
        </div>
        <Link
          href="/kontakt"
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#558822]"
          style={{ backgroundColor: "#669933" }}
        >
          Anfrage starten
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
