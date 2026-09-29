"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Rows3, Search, StretchHorizontal, X } from "lucide-react";
import { KONTAKT } from "@/data/navigation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Kleinschreibung, Umlaute/ß vereinheitlicht, Sonderzeichen entfernt – für tolerante Suche. */
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9% ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Photovoltaik-Lexikon mit Live-Suche, Themenfilter und klebender A–Z-Leiste.
 * Alle Begriffe werden serverseitig vollständig gerendert (SEO, Anker-IDs);
 * Filter blenden nur aus. Die ausführliche Erklärung steht in einem
 * aufklappbaren Bereich (im HTML enthalten) – „Alle aufklappen“ zeigt alles.
 *
 * props:
 *  gruppen    [[buchstabe, [begriff, ...]], ...]
 *  kategorien [{ id, label }]
 *  namen      { id: begriff } – für Beschriftung verwandter Begriffe
 */
export default function LexikonExplorer({ gruppen, kategorien, namen }) {
  const [suche, setSuche] = useState("");
  const [kategorie, setKategorie] = useState("alle");
  const [ausfuehrlich, setAusfuehrlich] = useState(false);
  const [ziel, setZiel] = useState("");
  const q = useDeferredValue(suche);

  // Sprungziel (#begriff) aufklappen – beim Laden und bei Klicks auf verwandte Begriffe
  useEffect(() => {
    const lies = () => setZiel(decodeURIComponent(window.location.hash.slice(1)));
    lies();
    window.addEventListener("hashchange", lies);
    return () => window.removeEventListener("hashchange", lies);
  }, []);

  const index = useMemo(
    () =>
      new Map(
        gruppen.flatMap(([, liste]) =>
          liste.map((b) => [
            b.id,
            { titel: norm(`${b.begriff} ${(b.synonyme || []).join(" ")}`), kurz: norm(b.kurz), text: norm(b.text) },
          ])
        )
      ),
    [gruppen]
  );

  const zaehler = useMemo(() => {
    // Eindeutig zählen: ein Begriff kann unter mehreren Buchstaben stehen
    const einzeln = new Map(gruppen.flatMap(([, liste]) => liste.map((b) => [b.id, b])));
    const z = { alle: einzeln.size };
    for (const b of einzeln.values()) z[b.kategorie] = (z[b.kategorie] || 0) + 1;
    return z;
  }, [gruppen]);

  const { gefiltert, imText } = useMemo(() => {
    const nq = norm(q);
    const woerter = nq ? nq.split(" ") : [];
    const nurText = new Set();
    const liste = gruppen
      .map(([l, begriffe]) => {
        const treffer = begriffe
          .filter((b) => kategorie === "alle" || b.kategorie === kategorie)
          .map((b) => {
            if (!woerter.length) return { b, score: 0 };
            const i = index.get(b.id);
            let score = 0;
            let text = false;
            for (const w of woerter) {
              if (i.titel.startsWith(w)) score += 5;
              else if (i.titel.includes(w)) score += 3;
              else if (i.kurz.includes(w)) score += 1;
              else if (i.text.includes(w)) {
                score += 1;
                text = true;
              } else return null;
            }
            if (text) nurText.add(b.id);
            return { b, score };
          })
          .filter(Boolean)
          .sort((x, y) => y.score - x.score)
          .map((x) => x.b);
        return [l, treffer];
      })
      .filter(([, t]) => t.length > 0);
    return { gefiltert: liste, imText: nurText };
  }, [gruppen, index, q, kategorie]);

  const anzahl = gefiltert.reduce((a, [, t]) => a + t.length, 0);
  const vorhanden = new Set(gefiltert.map(([l]) => l));
  const aktivFilter = q.trim() !== "" || kategorie !== "alle";

  const springe = (l) => {
    const el = document.getElementById(`buchstabe-${l}`);
    if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  return (
    <div>
      {/* ---------- Themen ---------- */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Nach Thema filtern">
        {[{ id: "alle", label: "Alle Themen" }, ...kategorien].map((k) => {
          const aktiv = kategorie === k.id;
          return (
            <button
              key={k.id}
              type="button"
              aria-pressed={aktiv}
              onClick={() => setKategorie(k.id)}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 ${
                aktiv ? "bg-ink-900 text-white shadow-[0_8px_20px_-10px_rgba(21,26,36,0.8)]" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900 hover:ring-ink-300"
              }`}
            >
              {k.label}
              <span className={`ov-num rounded-full px-1.5 text-[11.5px] ${aktiv ? "bg-white/15 text-white" : "bg-ink-100 text-ink-500"}`}>{zaehler[k.id] || 0}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Klebende Leiste: Suche + A–Z ---------- */}
      <div className="sticky top-[68px] z-30 -mx-5 mt-6 border-y border-ink-200/80 bg-sand-50/90 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8 lg:mx-0 lg:rounded-2xl lg:border lg:bg-white/90 lg:px-3 lg:py-3 lg:shadow-[0_10px_30px_-18px_rgba(21,26,36,0.25)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="relative lg:w-[300px] lg:shrink-0">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
            <label htmlFor="lexikon-suche" className="sr-only">
              Begriff suchen
            </label>
            <input
              id="lexikon-suche"
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Begriff suchen, z. B. Autarkie"
              autoComplete="off"
              className="h-12 w-full rounded-full bg-white pl-11 pr-11 text-[15px] text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ov-500 lg:bg-ink-50 [&::-webkit-search-cancel-button]:hidden"
            />
            {suche && (
              <button
                type="button"
                onClick={() => setSuche("")}
                aria-label="Suche leeren"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav aria-label="Alphabetische Sprungleiste" className="ov-no-scrollbar -mx-5 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:mx-0 lg:flex-1 lg:px-0">
            <ul className="flex min-w-max gap-0.5 lg:min-w-0 lg:justify-between">
              {ALPHABET.map((l) => {
                const ok = vorhanden.has(l);
                return (
                  <li key={l}>
                    <button
                      type="button"
                      disabled={!ok}
                      onClick={() => springe(l)}
                      aria-label={ok ? `Zu Buchstabe ${l}` : `Buchstabe ${l} – keine Begriffe`}
                      className="flex h-10 w-9 items-center justify-center rounded-lg font-display text-[14.5px] font-bold text-ink-800 transition-colors hover:bg-ov-500 hover:text-white disabled:cursor-default disabled:text-ink-300 disabled:hover:bg-transparent lg:h-9 lg:w-8"
                    >
                      {l}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-500" aria-live="polite">
          {aktivFilter ? (
            <>
              <span className="ov-num font-semibold text-ink-900">{anzahl}</span> {anzahl === 1 ? "Begriff" : "Begriffe"} gefunden
              <button
                type="button"
                onClick={() => {
                  setSuche("");
                  setKategorie("alle");
                }}
                className="ml-3 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current"
              >
                Filter zurücksetzen
              </button>
            </>
          ) : (
            <>
              <span className="ov-num font-semibold text-ink-900">{anzahl}</span> Fachbegriffe von A bis Z
            </>
          )}
        </p>
        <div role="group" aria-label="Darstellung" className="flex rounded-full bg-white p-1 ring-1 ring-ink-200">
          {[
            { an: false, icon: Rows3, label: "Kompakt" },
            { an: true, icon: StretchHorizontal, label: "Alle aufklappen" },
          ].map((v) => (
            <button
              key={v.label}
              type="button"
              aria-pressed={ausfuehrlich === v.an}
              onClick={() => setAusfuehrlich(v.an)}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${ausfuehrlich === v.an ? "bg-ink-900 text-white" : "text-ink-600 hover:text-ink-900"}`}
            >
              <v.icon aria-hidden="true" className="h-4 w-4" />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Begriffe ---------- */}
      {gefiltert.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center ring-1 ring-ink-200/70">
          <p className="font-display text-[20px] font-extrabold text-ink-900">Kein Begriff gefunden</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-600">
            Versuchen Sie ein anderes Stichwort – oder fragen Sie uns direkt. Wir ergänzen das Lexikon laufend.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/faqs" className="inline-flex h-11 items-center rounded-full bg-ink-900 px-5 text-[14px] font-semibold text-white hover:bg-ink-800">
              Häufige Fragen
            </Link>
            <a href={KONTAKT.telefonHref} className="inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200 hover:bg-ink-50">
              {KONTAKT.telefon}
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {gefiltert.map(([l, liste]) => (
            <section key={l} id={`buchstabe-${l}`} aria-labelledby={`buchstabe-${l}-titel`} className="scroll-mt-[220px] border-t border-ink-200 pt-8 first:border-t-0 lg:scroll-mt-[160px]">
              <div className="grid gap-5 pb-10 lg:grid-cols-[80px_minmax(0,1fr)] lg:gap-10">
                <h2
                  id={`buchstabe-${l}-titel`}
                  className="flex items-baseline gap-3 font-display text-[44px] font-extrabold leading-none tracking-tight text-ov-500 lg:sticky lg:top-[170px] lg:block lg:self-start lg:text-[64px]"
                >
                  {l}
                  <span className="ov-num text-[13px] font-semibold tracking-normal text-ink-400 lg:mt-2 lg:block">{liste.length} {liste.length === 1 ? "Begriff" : "Begriffe"}</span>
                </h2>
                <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {liste.map((b) => (
                    <Eintrag key={b.id} b={b} namen={namen} kategorien={kategorien} offen={ausfuehrlich || imText.has(b.id) || ziel === b.id || b.alias?.includes(ziel)} />
                  ))}
                </dl>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Eintrag({ b, namen, kategorien, offen }) {
  const kat = kategorien.find((k) => k.id === b.kategorie)?.label;
  return (
    <div
      id={b.id}
      className="group relative flex scroll-mt-[220px] flex-col rounded-3xl bg-white p-5 md:p-6 ring-1 ring-ink-200/70 transition-shadow duration-300 target:ring-2 target:ring-ov-500 target:shadow-[0_0_0_6px_rgba(102,153,51,0.15)] hover:shadow-[0_18px_40px_-26px_rgba(15,23,42,0.35)] hover:ring-ov-200 lg:scroll-mt-[170px]"
    >
      {/* dl-Gruppe enthält nur dt/dd – Themen-Chip steckt mit im dt */}
      <dt className="flex flex-col-reverse items-start gap-2">
        {/* Alias-Anker (z. B. IDs der deutschen Fassung) – landen auf diesem Eintrag */}
        {b.alias?.map((a) => (
          <span key={a} id={a} aria-hidden="true" className="absolute left-0 top-0 scroll-mt-[220px] lg:scroll-mt-[170px]" />
        ))}
        <a href={`#${b.id}`} className="font-display text-[19px] font-extrabold leading-snug tracking-tight text-ink-900 hover:text-ov-700">
          {b.begriff}
        </a>
        {kat && (
          <span className="hidden rounded-full bg-sand-100 md:inline-block px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-ink-600">
            <span className="sr-only">Thema: </span>
            {kat}
          </span>
        )}
      </dt>
      <dd className="mt-3 flex flex-1 flex-col">
        <p className="text-[15px] font-medium leading-relaxed text-ink-800 max-md:line-clamp-3 max-md:group-has-[details[open]]:line-clamp-none md:text-[15.5px]">{b.kurz}</p>
        {/* key: bei Wechsel der Darstellung neu aufbauen, damit „open“ sicher übernommen wird */}
        <div className="mt-auto pt-4">
        <details key={offen ? "auf" : "zu"} open={offen} className="group/d border-t border-ink-100 pt-3">
          <summary className="flex min-h-[36px] cursor-pointer list-none items-center justify-between gap-2 text-[13.5px] font-semibold text-ov-700 hover:text-ov-800 [&::-webkit-details-marker]:hidden">
            <span className="group-open/d:hidden">Erklärung & verwandte Begriffe</span>
            <span className="hidden group-open/d:inline">Weniger anzeigen</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform group-open/d:rotate-180" />
          </summary>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{b.text}</p>
          {b.synonyme?.length > 0 && (
            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-600">Auch:</span> {b.synonyme.join(", ")}
            </p>
          )}
          {b.verwandt?.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {b.verwandt.map((v) => (
                <a key={v} href={`#${v}`} className="inline-flex min-h-[32px] items-center rounded-full bg-ink-50 px-3 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-100 transition-colors hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-200">
                  {namen[v] || v}
                </a>
              ))}
            </div>
          )}
        </details>
        {b.link && (
          <Link href={b.link.href} className="inline-flex min-h-[36px] items-center gap-1 pt-2 text-[13.5px] font-semibold text-ink-800 hover:text-ov-700">
            {b.link.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        )}
        </div>
      </dd>
    </div>
  );
}
