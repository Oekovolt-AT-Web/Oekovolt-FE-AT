"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Clock, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";

import { FILTER_EVENT } from "./filterEvent";

/** Kleinschreibung, Umlaute vereinheitlicht – für tolerante Suche. */
const norm = (s) =>
  String(s)
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

const SORTIERUNG = [
  { id: "relevanz", label: "Empfohlen" },
  { id: "az", label: "A–Z" },
  { id: "kurz", label: "Kürzeste zuerst" },
];

const SCHRITT = 12;

/**
 * Filterbarer Artikel-Katalog der Ratgeber-Übersicht (Magazin-Explorer).
 * Bekommt nur schlanke Metadaten. Alle Karten stehen im Server-HTML – Filter,
 * Suche und „Mehr laden“ blenden nur aus, Links bleiben für Suchmaschinen
 * auffindbar. Filter lassen sich per URL (?thema=…&q=…) und per Ereignis
 * FILTER_EVENT (aus Hero-Suche und Themenkarten) setzen.
 *
 * props:
 *  artikel    [{ slug, title, excerpt, kategorie, katSlug, bild, bildAlt, lesezeit, keywords, neu }]
 *  kategorien [{ slug, label, kurz }]
 */
export default function RatgeberListe({ artikel, kategorien }) {
  const [thema, setThema] = useState("alle");
  const [suche, setSuche] = useState("");
  const [sortierung, setSortierung] = useState("relevanz");
  const [ansicht, setAnsicht] = useState("raster");
  const [limit, setLimit] = useState(SCHRITT);
  const [lauf, setLauf] = useState(0); // löst die Einblend-Animation bei Filterwechsel aus
  const q = useDeferredValue(suche);
  const eingabe = useRef(null);

  const setzeFilter = useCallback((next = {}) => {
    if (next.thema !== undefined) setThema(next.thema || "alle");
    if (next.q !== undefined) setSuche(next.q);
    setLimit(SCHRITT);
    setLauf((n) => n + 1);
  }, []);

  // Start-Filter aus der URL und Ereignisse aus Hero/Themenkarten; mobil kompakte Liste
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setAnsicht("liste");
    const p = new URLSearchParams(window.location.search);
    const t = p.get("thema");
    const s = p.get("q");
    if ((t && kategorien.some((k) => k.slug === t)) || s) setzeFilter({ thema: t || undefined, q: s || undefined });
    const hoere = (e) => setzeFilter(e.detail || {});
    window.addEventListener(FILTER_EVENT, hoere);
    return () => window.removeEventListener(FILTER_EVENT, hoere);
  }, [kategorien, setzeFilter]);

  // Filter in der URL spiegeln (teilbar), ohne neu zu laden
  useEffect(() => {
    const url = new URL(window.location.href);
    const vorher = url.search;
    if (thema !== "alle") url.searchParams.set("thema", thema);
    else url.searchParams.delete("thema");
    if (q.trim()) url.searchParams.set("q", q.trim());
    else url.searchParams.delete("q");
    if (url.search !== vorher) window.history.replaceState(window.history.state, "", url);
  }, [thema, q]);

  const index = useMemo(
    () => new Map(artikel.map((a) => [a.slug, { titel: norm(a.title), voll: norm(`${a.excerpt} ${a.keywords.join(" ")} ${a.kategorie}`) }])),
    [artikel]
  );

  const zaehler = useMemo(() => {
    const z = { alle: artikel.length };
    for (const a of artikel) z[a.katSlug] = (z[a.katSlug] || 0) + 1;
    return z;
  }, [artikel]);

  const woerter = useMemo(() => norm(q).split(" ").filter(Boolean), [q]);

  const treffer = useMemo(() => {
    const liste = artikel
      .map((a, i) => ({ a, i }))
      .filter(({ a }) => thema === "alle" || a.katSlug === thema)
      .map(({ a, i }) => {
        if (!woerter.length) return { a, score: 0, i };
        const ix = index.get(a.slug);
        let score = 0;
        for (const w of woerter) {
          if (ix.titel.includes(w)) score += ix.titel.startsWith(w) ? 6 : 4;
          else if (ix.voll.includes(w)) score += 1;
          else return null;
        }
        return { a, score, i };
      })
      .filter(Boolean);
    liste.sort((x, y) => {
      if (woerter.length && y.score !== x.score) return y.score - x.score;
      if (sortierung === "az") return x.a.title.localeCompare(y.a.title, "de");
      if (sortierung === "kurz") return x.a.lesezeit - y.a.lesezeit || x.i - y.i;
      return x.i - y.i;
    });
    return liste.map((x) => x.a);
  }, [artikel, thema, woerter, index, sortierung]);

  const sichtbar = new Set(treffer.slice(0, limit).map((a) => a.slug));
  const trefferSet = new Set(treffer);
  const reihenfolge = [...treffer, ...artikel.filter((a) => !trefferSet.has(a))];
  const aktivFilter = thema !== "alle" || q.trim() !== "";
  const themaLabel = kategorien.find((k) => k.slug === thema)?.label;
  const gezeigt = Math.min(limit, treffer.length);
  const rest = treffer.length - gezeigt;

  const zuruecksetzen = () => {
    setSuche("");
    setThema("alle");
    setLimit(SCHRITT);
    setLauf((n) => n + 1);
  };

  return (
    <div>
      {/* ---------- Bedienleiste (klebt beim Scrollen) ---------- */}
      <div className="sticky top-[68px] z-30 -mx-5 border-y border-ink-200/80 bg-white/90 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8 lg:mx-0 lg:rounded-[1.75rem] lg:border lg:p-3 lg:shadow-[0_14px_40px_-22px_rgba(21,26,36,0.35)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative block xl:w-[260px] xl:shrink-0">
            <span className="sr-only">Ratgeber durchsuchen</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
            <input
              ref={eingabe}
              type="search"
              value={suche}
              onChange={(e) => {
                setSuche(e.target.value);
                setLimit(SCHRITT);
              }}
              placeholder="Thema suchen, z. B. Leistungspreis"
              autoComplete="off"
              className="h-12 w-full rounded-full bg-ink-50 pl-11 pr-11 text-[15px] text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500 [&::-webkit-search-cancel-button]:hidden"
            />
            {suche && (
              <button
                type="button"
                onClick={() => {
                  setSuche("");
                  eingabe.current?.focus();
                }}
                aria-label="Suche leeren"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </label>

          <div role="group" aria-label="Nach Themenbereich filtern" className="ov-no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:mx-0 lg:flex-wrap lg:px-0 xl:flex-1">
            {[{ slug: "alle", label: "Alle" }, ...kategorien].map((k) => {
              const aktiv = thema === k.slug;
              return (
                <button
                  key={k.slug}
                  type="button"
                  aria-pressed={aktiv}
                  onClick={() => setzeFilter({ thema: k.slug })}
                  className={`inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13.5px] font-semibold transition-all duration-300 ${
                    aktiv ? "bg-ink-900 text-white shadow-[0_8px_20px_-10px_rgba(21,26,36,0.8)]" : "text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:text-ink-900"
                  }`}
                >
                  {k.kurz || k.label}
                  <span className={`ov-num rounded-full px-1.5 text-[11.5px] transition-colors ${aktiv ? "bg-white/15 text-white" : "bg-ink-100 text-ink-500"}`}>{zaehler[k.slug] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Ergebniszeile ---------- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-[14.5px] text-ink-600">
          <span className="ov-num font-bold text-ink-900">{treffer.length}</span> Artikel
          {themaLabel && (
            <>
              {" "}
              in <span className="font-semibold text-ink-900">{themaLabel}</span>
            </>
          )}
          {q.trim() && (
            <>
              {" "}
              zu <span className="font-semibold text-ink-900">„{q.trim()}“</span>
            </>
          )}
          {aktivFilter && (
            <button type="button" onClick={zuruecksetzen} className="ml-3 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
              Filter zurücksetzen
            </button>
          )}
        </p>
        <div className="flex items-center gap-2">
          <label className="relative flex items-center">
            <span className="sr-only">Sortierung</span>
            <SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-500" />
            <select
              value={sortierung}
              onChange={(e) => {
                setSortierung(e.target.value);
                setLauf((n) => n + 1);
              }}
              className="h-10 appearance-none rounded-full bg-white pl-10 pr-9 text-[13.5px] font-semibold text-ink-800 ring-1 ring-ink-200 hover:ring-ink-300 focus:outline-none focus:ring-2 focus:ring-ov-500"
            >
              {SORTIERUNG.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 h-4 w-4 text-ink-500" />
          </label>
          <div role="group" aria-label="Ansicht" className="flex rounded-full bg-white p-1 ring-1 ring-ink-200">
            {[
              { id: "raster", icon: LayoutGrid, label: "Kartenansicht" },
              { id: "liste", icon: List, label: "Listenansicht" },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={ansicht === v.id}
                aria-label={v.label}
                title={v.label}
                onClick={() => {
                  setAnsicht(v.id);
                  setLauf((n) => n + 1);
                }}
                className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${ansicht === v.id ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-900"}`}
              >
                <v.icon aria-hidden="true" className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Artikel ---------- */}
      <ul key={`${lauf}-${ansicht}`} className={ansicht === "raster" ? "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "mt-6 grid gap-3 lg:grid-cols-2"}>
        {reihenfolge.map((a) => {
          const an = sichtbar.has(a.slug);
          const pos = an ? treffer.indexOf(a) : 0;
          return (
            <li key={a.slug} hidden={!an} className="ov-tab-panel flex" style={{ animationDelay: `${Math.min(pos % SCHRITT, 8) * 40}ms` }}>
              {ansicht === "raster" ? <Karte a={a} woerter={woerter} /> : <Zeile a={a} woerter={woerter} />}
            </li>
          );
        })}
      </ul>

      {treffer.length === 0 && (
        <div className="mt-6 rounded-3xl bg-white p-10 text-center ring-1 ring-ink-200/70">
          <p className="font-display text-[20px] font-extrabold text-ink-900">Kein Artikel gefunden.</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-600">
            Versuchen Sie einen anderen Begriff – oder schauen Sie ins{" "}
            <Link href="/wissen/lexikon" className="font-semibold text-ov-700 underline">
              Photovoltaik-Lexikon
            </Link>{" "}
            und in die{" "}
            <Link href="/faqs" className="font-semibold text-ov-700 underline">
              häufigen Fragen
            </Link>
            .
          </p>
          <button type="button" onClick={zuruecksetzen} className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-900 px-5 text-[14px] font-semibold text-white hover:bg-ink-800">
            Alle Artikel zeigen
          </button>
        </div>
      )}

      {rest > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div aria-hidden="true" className="h-1 w-48 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-ov-500 transition-[width] duration-500" style={{ width: `${(gezeigt / treffer.length) * 100}%` }} />
          </div>
          <p className="text-[13.5px] text-ink-500">
            <span className="ov-num">{gezeigt}</span> von <span className="ov-num">{treffer.length}</span> Artikeln
          </p>
          <button
            type="button"
            onClick={() => setLimit((l) => l + SCHRITT)}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 px-6 text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(21,26,36,0.7)] transition-all hover:bg-ink-800"
          >
            {rest > SCHRITT ? `${SCHRITT} weitere Artikel laden` : `Letzte ${rest} Artikel laden`}
            <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Suchbegriffe im Titel hervorheben (ohne HTML-Injektion). */
function Markiert({ text, woerter }) {
  if (!woerter.length) return text;
  // Normalisierten Text zeichenweise aufbauen und Positionen auf das Original zurückrechnen
  // (Umlaute werden zu zwei Zeichen, Satzzeichen zu Leerzeichen)
  let n = "";
  const pos = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i].toLowerCase();
    const ersatz = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] ?? (/[a-z0-9%]/.test(c) ? c : " ");
    for (const e of ersatz) {
      n += e;
      pos.push(i);
    }
  }
  const bereiche = [];
  for (const w of woerter) {
    if (w.length < 2) continue;
    let i = n.indexOf(w);
    while (i !== -1) {
      bereiche.push([pos[i], pos[i + w.length - 1] + 1]);
      i = n.indexOf(w, i + w.length);
    }
  }
  if (!bereiche.length) return text;
  bereiche.sort((a, b) => a[0] - b[0]);
  const teile = [];
  let p = 0;
  for (const [s, e] of bereiche) {
    if (s < p) continue;
    teile.push(text.slice(p, s));
    teile.push(
      <mark key={s} className="rounded bg-sun-300/60 px-0.5 text-inherit">
        {text.slice(s, e)}
      </mark>
    );
    p = e;
  }
  teile.push(text.slice(p));
  return teile;
}

function NeuBadge({ className = "" }) {
  return <span className={`inline-flex items-center rounded-full bg-ov-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-sm ${className}`}>Neu</span>;
}

function Karte({ a, woerter }) {
  return (
    <article className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 focus-within:ring-2 focus-within:ring-ov-500 hover:ring-ov-200">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <Image src={a.bild} alt={a.bildAlt || ""} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-ink-800 shadow-sm backdrop-blur">{a.kategorie}</span>
          {a.neu && <NeuBadge />}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[18.5px] font-extrabold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-ov-700">
          <Link href={`/ratgeber/${a.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            <Markiert text={a.title} woerter={woerter} />
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-600">{a.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-[13px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {a.lesezeit} Min. Lesezeit
          </span>
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition-all group-hover:bg-ov-500 group-hover:text-white">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

function Zeile({ a, woerter }) {
  return (
    <article className="group relative flex w-full items-center gap-4 rounded-2xl bg-white p-3 pr-4 ring-1 ring-ink-200/70 transition-all focus-within:ring-2 focus-within:ring-ov-500 hover:shadow-[0_16px_36px_-24px_rgba(15,23,42,0.35)] hover:ring-ov-200 sm:gap-5">
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100 sm:w-32">
        <Image src={a.bild} alt="" fill sizes="128px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ov-700">
          {a.kategorie}
          {a.neu && <NeuBadge className="!px-2 !py-0.5 !text-[10px]" />}
        </p>
        <h3 className="mt-1 font-display text-[16px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">
          <Link href={`/ratgeber/${a.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            <Markiert text={a.title} woerter={woerter} />
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-500">
          <Clock aria-hidden="true" className="h-3.5 w-3.5" />
          {a.lesezeit} Min.
        </p>
      </div>
      <ArrowRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-ov-600 sm:block" />
    </article>
  );
}
