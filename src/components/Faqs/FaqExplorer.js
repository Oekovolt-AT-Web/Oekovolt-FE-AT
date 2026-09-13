"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Mail, Phone, Search, X } from "lucide-react";

import Faq from "@/components/ui/Faq";

const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9% ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * FAQ-Übersicht mit Live-Suche und Themen-Chips.
 * Alle Fragen werden serverseitig gerendert; das FAQPage-Schema setzt die
 * Seite einmal gesammelt (daher schema={false} am Faq-Baustein).
 *
 * props: gruppen [{ id, label, items: [{ q, a }] }]
 */
export default function FaqExplorer({ gruppen }) {
  const [suche, setSuche] = useState("");
  const [thema, setThema] = useState("alle");
  const q = useDeferredValue(suche);

  const gefiltert = useMemo(() => {
    const woerter = norm(q).split(" ").filter(Boolean);
    return gruppen
      .filter((g) => thema === "alle" || g.id === thema)
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => {
          if (!woerter.length) return true;
          const t = norm(`${it.q} ${it.a}`);
          return woerter.every((w) => t.includes(w));
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [gruppen, q, thema]);

  const gesamt = gruppen.reduce((a, g) => a + g.items.length, 0);
  const anzahl = gefiltert.reduce((a, g) => a + g.items.length, 0);
  const aktiv = q.trim() !== "" || thema !== "alle";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div className="min-w-0">
        {/* Suche + Themen, klebend */}
        <div className="sticky top-[68px] z-30 -mx-5 border-b border-ink-200/80 bg-sand-50/90 px-5 pb-4 pt-4 backdrop-blur-xl md:-mx-8 md:px-8 lg:mx-0 lg:rounded-3xl lg:border lg:bg-white/90 lg:p-4 lg:shadow-[0_10px_30px_-18px_rgba(21,26,36,0.25)]">
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <label htmlFor="faq-suche" className="sr-only">
              Fragen durchsuchen
            </label>
            <input
              id="faq-suche"
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Frage suchen, z. B. Speicher"
              autoComplete="off"
              className="h-14 w-full rounded-full bg-white pl-14 pr-14 text-[16px] text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ov-500 lg:bg-ink-50 [&::-webkit-search-cancel-button]:hidden"
            />
            {suche && (
              <button
                type="button"
                onClick={() => setSuche("")}
                aria-label="Suche leeren"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="ov-no-scrollbar -mx-5 mt-3 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:mx-0 lg:px-0" role="group" aria-label="Nach Thema filtern">
            <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap">
              {[{ id: "alle", label: "Alle", n: gesamt }, ...gruppen.map((g) => ({ id: g.id, label: g.label, n: g.items.length }))].map((c) => {
                const ist = thema === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={ist}
                    onClick={() => setThema(c.id)}
                    className={`inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-all ${
                      ist ? "bg-ink-900 text-white shadow-md" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900 hover:ring-ink-300"
                    }`}
                  >
                    {c.label}
                    <span className={`ov-num rounded-full px-1.5 text-[11.5px] ${ist ? "bg-white/15 text-white" : "bg-ink-100 text-ink-600"}`}>{c.n}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[14px] text-ink-500" aria-live="polite">
          <span className="ov-num font-semibold text-ink-900">{anzahl}</span> {anzahl === 1 ? "Antwort" : "Antworten"}
          {aktiv && (
            <button
              type="button"
              onClick={() => {
                setSuche("");
                setThema("alle");
              }}
              className="ml-3 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current"
            >
              Filter zurücksetzen
            </button>
          )}
        </p>

        {gefiltert.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center ring-1 ring-ink-200/70">
            <p className="font-display text-[20px] font-extrabold text-ink-900">Dazu haben wir noch keine Antwort</p>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-600">
              Probieren Sie ein anderes Stichwort, schauen Sie ins Photovoltaik-Lexikon – oder fragen Sie uns einfach direkt.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/wissen/lexikon" className="inline-flex h-11 items-center rounded-full bg-ink-900 px-5 text-[14px] font-semibold text-white hover:bg-ink-800">
                Zum Lexikon
              </Link>
              <a href="tel:+498245967880" className="inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200 hover:bg-ink-50">
                08245 96 788 0
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {gefiltert.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-titel`} className="scroll-mt-[220px] rounded-3xl bg-white px-6 pb-3 pt-6 ring-1 ring-ink-200/70 md:px-8 md:pt-8">
                <h2 id={`${g.id}-titel`} className="flex items-baseline justify-between gap-4 font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">
                  {g.label}
                  <span className="ov-num text-[13px] font-semibold text-ink-500">{g.items.length}</span>
                </h2>
                <Faq items={g.items} schema={false} className="mt-2" />
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Seitenleiste */}
      <aside className="lg:pt-0">
        <div className="space-y-5 lg:sticky lg:top-[92px]">
          <div className="ov-noise relative overflow-hidden rounded-3xl bg-navy-950 p-7 text-white">
            <div aria-hidden="true" className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-ov-500/35 blur-3xl" />
            <p className="relative font-display text-[20px] font-extrabold leading-snug">Ihre Frage ist nicht dabei?</p>
            <p className="relative mt-2 text-[14.5px] leading-relaxed text-white/65">Wir beraten herstellerunabhängig – persönlich, telefonisch oder per E-Mail.</p>
            <a href="tel:+498245967880" className="group relative mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:scale-110">
                <Phone aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
              <span className="font-display text-[20px] font-extrabold tracking-tight">08245 96 788 0</span>
            </a>
            <p className="relative mt-2 text-[13px] text-white/55">Mo–Do 8–16 Uhr · Fr 8–13 Uhr</p>
            <a href="mailto:office@oekovolt.de" className="relative mt-5 flex items-center gap-2.5 border-t border-white/10 pt-5 text-[14.5px] text-white/80 hover:text-white">
              <Mail aria-hidden="true" className="h-4 w-4 text-ov-300" />
              office@oekovolt.de
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { href: "/wissen/lexikon", icon: BookOpen, t: "Photovoltaik-Lexikon", s: "Fachbegriffe von A bis Z" },
              { href: "/solarrechner", icon: Calculator, t: "Solarrechner", s: "Ertrag & Amortisation berechnen" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="group ov-card-hover flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 hover:ring-ov-200">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                  <l.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-[15.5px] font-bold text-ink-900">{l.t}</span>
                  <span className="block text-[13px] text-ink-500">{l.s}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
