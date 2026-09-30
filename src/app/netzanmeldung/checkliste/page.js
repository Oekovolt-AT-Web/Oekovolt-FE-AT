// src/app/netzanmeldung/checkliste/page.js
//
// Druckversion der Checkliste Netzanmeldung (auch „Als PDF speichern“).
// Bewusst schlicht; Kopf, Fuß und Widgets werden beim Drucken ausgeblendet.
// noindex: Inhalt steht indexierbar auf /netzanmeldung.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DruckenKnopf from "@/components/Netzanmeldung/DruckenKnopf";
import { CHECKLISTE, DRUCK_PFAD, EAG_BEZUG, HINWEIS_GEWAEHR, NETZBETREIBER, PFAD, Q, STAND, ZAEHLPUNKT, betreiberPfad } from "@/data/netzbetreiber";
import { BASE_URL, FIRMA } from "@/lib/site";

const PAGE_URL = `${BASE_URL}${DRUCK_PFAD}`;

export const metadata = {
  title: "Checkliste Netzanmeldung PV zum Ausdrucken | Ökovolt",
  description: "Druckbare Checkliste für die Netzanmeldung einer PV-Anlage in Österreich: Unterlagen, Einspeisezählpunkt, Fertigmeldung und EAG-Fördercall.",
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
};

const DRUCK_CSS = `
@media print {
  header, footer, aside, [role="dialog"], .ov-druck-aus { display: none !important; }
  html, body { background: #fff !important; }
  .ov-druck-seite { padding: 0 !important; max-width: none !important; }
  .ov-druck-gruppe { break-inside: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
  @page { margin: 14mm 14mm 16mm; }
}
`;

export default function ChecklisteDruck() {
  return (
    <div className="bg-white">
      <style dangerouslySetInnerHTML={{ __html: DRUCK_CSS }} />
      <div className="ov-druck-seite mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <div className="ov-druck-aus mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href={PFAD} className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Zurück zur Netzanmeldung
          </Link>
          <DruckenKnopf />
        </div>

        <div className="border-b-2 border-ink-900 pb-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">Checkliste · Stand {STAND.label}</p>
          <h1 className="mt-2 font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.3rem)] font-extrabold leading-tight text-ink-900">PV-Anlage beim Netzbetreiber anmelden</h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-600">Für Photovoltaikanlagen in Österreich – von der Vorbereitung bis zur Freigabe. {HINWEIS_GEWAEHR}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-300 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Mein Netzbetreiber</p>
            <p className="mt-6 border-b border-dotted border-ink-400" aria-hidden="true" />
          </div>
          <div className="rounded-xl border border-ink-300 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Zusage gültig bis</p>
            <p className="mt-6 border-b border-dotted border-ink-400" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-ink-300 p-4">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Einspeisezählpunkt (33 Stellen)</p>
          <div className="mt-3 flex flex-wrap gap-[3px]" aria-hidden="true">
            {Array.from({ length: 33 }, (_, i) => (
              <span key={i} className={`flex h-7 w-[1.15rem] items-end justify-center border border-ink-300 text-[10px] text-ink-400 ${[2, 8, 13].includes(i) ? "ml-2" : ""}`}>
                {i === 0 ? "A" : i === 1 ? "T" : ""}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-500">
            {ZAEHLPUNKT.aufbau.map((a) => `${a.teil} (${a.stellen})`).join(" · ")} – nicht der Bezugszählpunkt.
          </p>
        </div>

        {CHECKLISTE.map((g, gi) => (
          <section key={g.titel} className="ov-druck-gruppe mt-8">
            <h2 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-[13px] text-white">{gi + 1}</span>
              {g.titel}
            </h2>
            <ul className="mt-3 divide-y divide-ink-200 border-y border-ink-200">
              {g.punkte.map((p) => (
                <li key={p.id} className="flex gap-3 py-2.5">
                  <span aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-ink-400" />
                  <span>
                    <span className="block text-[14.5px] font-semibold text-ink-900">{p.titel}</span>
                    <span className="block text-[13px] leading-relaxed text-ink-600">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="ov-druck-gruppe mt-8 rounded-xl bg-sand-50 p-5 ring-1 ring-ink-200">
          <h2 className="font-display text-[16px] font-bold text-ink-900">EAG-Fördercall 08.–22.10.2026</h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-700">{EAG_BEZUG.text}</p>
        </section>

        <section className="ov-druck-gruppe mt-8">
          <h2 className="font-display text-[16px] font-bold text-ink-900">Netzbetreiber-Seiten</h2>
          <ul className="mt-2 grid gap-1 text-[13px] text-ink-700 sm:grid-cols-2">
            {NETZBETREIBER.map((b) => (
              <li key={b.slug}>
                {b.kurz}: {b.portal.name} – oekovolt.com{betreiberPfad(b.slug)}
              </li>
            ))}
            <li className="sm:col-span-2">Andere Netzbetreiber: {Q.econtrolSuche.url}</li>
          </ul>
        </section>

        <p className="mt-10 border-t border-ink-200 pt-4 text-[11.5px] leading-relaxed text-ink-500">
          {FIRMA.name} · oekovolt.com{PFAD} · Stand {STAND.label}. {HINWEIS_GEWAEHR} Keine Rechtsberatung.
        </p>
      </div>
    </div>
  );
}
