"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BatteryCharging,
  BookOpen,
  Briefcase,
  Calculator,
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  Cpu,
  Home,
  Link2,
  Mail,
  Network,
  Phone,
  Plus,
  Scale,
  Search,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { OEFFNUNGSZEITEN_KURZ } from "@/data/erreichbarkeit";
import { FIRMA } from "@/lib/site";

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

/** Anker-ID einer Frage (stabil aus dem Fragetext). */
const frageId = (q) =>
  "frage-" +
  q
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

const ICONS = { gewerbe: Briefcase, foerderung: Scale, netz: Network, technik: Cpu, energiegemeinschaften: Users, speicher: BatteryCharging, service: Wrench, privat: Home };

const VORSCHLAEGE = ["Investitionsfreibetrag", "Netzebene", "Energiegemeinschaft", "Speicher", "Wartung"];

/**
 * FAQ-Explorer: Live-Suche mit Hervorhebung, Themen-Chips, „Alle aufklappen“
 * und Direktlinks je Frage. Alle Fragen und Antworten stehen im Server-HTML
 * (<details>, funktioniert ohne JavaScript). Das FAQPage-Schema setzt die
 * Seite einmal gesammelt – mit exakt diesen Texten.
 *
 * props: gruppen [{ id, label, items: [{ q, a }] }]
 */
export default function FaqExplorer({ gruppen }) {
  const [suche, setSuche] = useState("");
  const [thema, setThema] = useState("alle");
  const [alleOffen, setAlleOffen] = useState(false);
  const [ziel, setZiel] = useState("");
  const [kopiert, setKopiert] = useState("");
  const q = useDeferredValue(suche);

  useEffect(() => {
    const lies = () => setZiel(decodeURIComponent(window.location.hash.slice(1)));
    lies();
    window.addEventListener("hashchange", lies);
    return () => window.removeEventListener("hashchange", lies);
  }, []);

  const woerter = useMemo(() => norm(q).split(" ").filter(Boolean), [q]);

  const gefiltert = useMemo(() => {
    return gruppen
      .filter((g) => thema === "alle" || g.id === thema)
      .map((g) => ({
        ...g,
        items: g.items
          .map((it) => {
            if (!woerter.length) return { ...it, imText: false };
            const nq = norm(it.q);
            const na = norm(it.a);
            if (!woerter.every((w) => nq.includes(w) || na.includes(w))) return null;
            return { ...it, imText: woerter.some((w) => !nq.includes(w)) };
          })
          .filter(Boolean),
      }))
      .filter((g) => g.items.length > 0);
  }, [gruppen, woerter, thema]);

  const gesamt = gruppen.reduce((a, g) => a + g.items.length, 0);
  const anzahl = gefiltert.reduce((a, g) => a + g.items.length, 0);
  const aktiv = q.trim() !== "" || thema !== "alle";

  const kopiereLink = async (id) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
    window.history.replaceState(window.history.state, "", `#${id}`);
    setKopiert(id);
    setTimeout(() => setKopiert(""), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div className="min-w-0">
        {/* Suche + Themen, klebend */}
        <div className="sticky top-[68px] z-30 -mx-5 border-b border-ink-200/80 bg-sand-50/90 px-5 pb-3 pt-3 backdrop-blur-xl md:-mx-8 md:px-8 lg:mx-0 lg:rounded-[1.75rem] lg:border lg:bg-white/90 lg:p-3 lg:shadow-[0_14px_40px_-22px_rgba(21,26,36,0.35)]">
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
              placeholder="Frage suchen, z. B. Förderung, Netzebene, EEG"
              autoComplete="off"
              className="h-[52px] w-full rounded-full bg-white pl-14 pr-14 text-[16px] text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ov-500 lg:bg-ink-50 [&::-webkit-search-cancel-button]:hidden"
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
            <div className="flex min-w-max gap-1.5">
              {[{ id: "alle", label: "Alle", n: gesamt }, ...gruppen.map((g) => ({ id: g.id, label: g.label, n: g.items.length }))].map((c) => {
                const ist = thema === c.id;
                const Icon = ICONS[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={ist}
                    onClick={() => setThema(c.id)}
                    className={`inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-[13.5px] font-semibold transition-all duration-300 ${
                      ist ? "bg-ink-900 text-white shadow-[0_8px_20px_-10px_rgba(21,26,36,0.8)]" : "bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:text-ink-900 hover:ring-ink-300"
                    }`}
                  >
                    {Icon && <Icon aria-hidden="true" className={`h-4 w-4 ${ist ? "text-ov-300" : "text-ov-600"}`} />}
                    {c.label}
                    <span className={`ov-num rounded-full px-1.5 text-[11.5px] ${ist ? "bg-white/15 text-white" : "bg-ink-100 text-ink-600"}`}>{c.n}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-ink-500" aria-live="polite">
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
          <button
            type="button"
            onClick={() => setAlleOffen((x) => !x)}
            aria-pressed={alleOffen}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:text-ink-900 hover:ring-ink-300"
          >
            {alleOffen ? <ChevronsDownUp aria-hidden="true" className="h-4 w-4" /> : <ChevronsUpDown aria-hidden="true" className="h-4 w-4" />}
            {alleOffen ? "Alle zuklappen" : "Alle aufklappen"}
          </button>
        </div>

        {!aktiv && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-ink-500">Oft gesucht:</span>
            {VORSCHLAEGE.map((v) => (
              <button key={v} type="button" onClick={() => setSuche(v)} className="inline-flex h-8 items-center rounded-full bg-white px-3 text-[13px] font-medium text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-200">
                {v}
              </button>
            ))}
          </div>
        )}

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
              <a href={FIRMA.telefonHref} className="inline-flex h-11 items-center rounded-full px-5 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200 hover:bg-ink-50">
                {FIRMA.telefon}
              </a>
            </div>
          </div>
        ) : (
          <div key={`${thema}-${woerter.join("-")}`} className="ov-tab-panel mt-6 space-y-6">
            {gefiltert.map((g) => {
              const Icon = ICONS[g.id] || BookOpen;
              return (
                <section key={g.id} id={g.id} aria-labelledby={`${g.id}-titel`} className="scroll-mt-[200px] rounded-[1.75rem] bg-white px-5 pb-2 pt-6 ring-1 ring-ink-200/70 md:px-8 md:pt-8">
                  <h2 id={`${g.id}-titel`} className="flex items-center gap-3 font-display text-[21px] font-extrabold tracking-tight text-ink-900 md:text-[25px]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600 ring-1 ring-ov-100">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="flex-1">{g.label}</span>
                    <span className="ov-num rounded-full bg-sand-100 px-2.5 py-1 text-[12px] font-semibold text-ink-600">{g.items.length}</span>
                  </h2>
                  <div className="mt-3 divide-y divide-ink-100">
                    {g.items.map((it) => {
                      const id = frageId(it.q);
                      const offen = alleOffen || it.imText || ziel === id;
                      return (
                        <details key={`${it.q}-${offen ? 1 : 0}`} id={id} open={offen} className="group scroll-mt-[220px] py-1">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-display text-[16.5px] font-bold leading-snug text-ink-900 transition-colors hover:text-ov-700 md:py-5 md:text-[18px] [&::-webkit-details-marker]:hidden">
                            <span>
                              <Markiert text={it.q} woerter={woerter} />
                            </span>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition-all duration-300 group-open:rotate-45 group-open:bg-ov-500 group-open:text-white">
                              <Plus aria-hidden="true" className="h-4 w-4" />
                            </span>
                          </summary>
                          <div className="-mt-1 pb-5 pr-2 md:pr-12">
                            <p className="text-[16px] leading-relaxed text-ink-600">
                              <Markiert text={it.a} woerter={woerter} />
                            </p>
                            <button
                              type="button"
                              onClick={() => kopiereLink(id)}
                              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-semibold text-ink-500 ring-1 ring-ink-200 transition-colors hover:text-ov-700 hover:ring-ov-200"
                            >
                              {kopiert === id ? <Check aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" /> : <Link2 aria-hidden="true" className="h-3.5 w-3.5" />}
                              {kopiert === id ? "Link kopiert" : "Link zu dieser Antwort"}
                            </button>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Seitenleiste */}
      <aside className="lg:pt-0">
        <div className="space-y-5 lg:sticky lg:top-[92px]">
          <div className="ov-noise relative overflow-hidden rounded-3xl bg-navy-950 p-7 text-white">
            <div aria-hidden="true" className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-ov-500/35 blur-3xl" />
            <p className="relative font-display text-[20px] font-extrabold leading-snug">Ihre Frage ist nicht dabei?</p>
            <p className="relative mt-2 text-[14.5px] leading-relaxed text-white/65">Unser Team in Ostermiething berät herstellerunabhängig – persönlich, telefonisch oder per E-Mail.</p>
            <a href={FIRMA.telefonHref} className="group relative mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:scale-110">
                <Phone aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
              <span className="font-display text-[20px] font-extrabold tracking-tight">{FIRMA.telefon}</span>
            </a>
            <p className="relative mt-2 text-[13px] text-white/55">{OEFFNUNGSZEITEN_KURZ}</p>
            <a href={`mailto:${FIRMA.email}`} className="relative mt-5 flex items-center gap-2.5 border-t border-white/10 pt-5 text-[14.5px] text-white/80 hover:text-white">
              <Mail aria-hidden="true" className="h-4 w-4 text-ov-300" />
              {FIRMA.email}
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { href: "/ratgeber", icon: BookOpen, t: "Photovoltaik-Ratgeber", s: "Ausführlich, mit Zahlen & Quellen" },
              { href: "/wissen/lexikon", icon: BookOpen, t: "Photovoltaik-Lexikon", s: "Fachbegriffe von A bis Z" },
              { href: "/foerdercheck", icon: Calculator, t: "Förder-Check", s: "EAG, IFB & Länder in 30 Sekunden" },
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

/**
 * Suchbegriffe hervorheben. Vergleich auf normalisiertem Text; Positionen
 * werden über eine Zuordnungstabelle auf den Originaltext zurückgerechnet
 * (Umlaute werden beim Normalisieren zu zwei Zeichen).
 */
function Markiert({ text, woerter }) {
  if (!woerter.length) return text;
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
