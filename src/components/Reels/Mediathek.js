"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Search, X } from "lucide-react";

import { cn } from "@/components/ui/cn";
import { datumText, dauerText, reelPfad, vorhandeneKategorien } from "@/data/reels";
import LinkKopieren from "./LinkKopieren";
import ReelDialog from "./ReelDialog";
import ReelKachel from "./ReelKachel";
import ReelPlayer from "./ReelPlayer";

const normal = (t) =>
  String(t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Mediathek (Client): „Aktuell“-Video oben, Kategorie-Filter, Suche, Raster aller Videos, Player-Dialog.
 * reels: bereits sortiert (neueste zuerst).
 */
export default function Mediathek({ reels }) {
  const [kategorie, setKategorie] = useState("");
  const [suche, setSuche] = useState("");
  const [offen, setOffen] = useState(null);
  const [vorschau, setVorschau] = useState(null);

  const aktuell = reels[0];
  const kategorien = useMemo(() => vorhandeneKategorien(reels), [reels]);

  const treffer = useMemo(() => {
    const q = normal(suche.trim());
    return reels.filter(
      (r) => (!kategorie || r.kategorie === kategorie) && (!q || normal(`${r.titel} ${r.beschreibung || ""} ${r.kategorie || ""}`).includes(q))
    );
  }, [reels, kategorie, suche]);

  const zuruecksetzen = () => {
    setKategorie("");
    setSuche("");
  };

  return (
    <div>
      {/* ---------- Aktuell ---------- */}
      <section aria-labelledby="ov-mediathek-aktuell" className="grid items-center gap-8 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
        <ReelPlayer reel={aktuell} className="mx-auto w-full max-w-[380px] rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgba(3,18,43,0.55)] ring-1 ring-ink-200/60" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-ov-600 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" aria-hidden="true" />
              Aktuell
            </span>
            {aktuell.kategorie && (
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-700 ring-1 ring-ink-200">{aktuell.kategorie}</span>
            )}
          </div>
          <h2 id="ov-mediathek-aktuell" className="ov-h2 mt-5 text-ink-900">
            {aktuell.titel}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14.5px] text-ink-500">
            {aktuell.datum && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                <time dateTime={aktuell.datum}>{datumText(aktuell.datum)}</time>
              </span>
            )}
            {aktuell.dauerSek ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="h-4 w-4" />
                <span className="ov-num">{dauerText(aktuell.dauerSek)} min</span>
              </span>
            ) : null}
          </p>
          {aktuell.beschreibung && <p className="ov-lead mt-5 max-w-xl text-ink-600">{aktuell.beschreibung}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={reelPfad(aktuell.slug)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700"
            >
              Zur Videoseite
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <LinkKopieren pfad={reelPfad(aktuell.slug)} className="h-12 px-5" />
          </div>
        </div>
      </section>

      {/* ---------- Filter & Suche ---------- */}
      <section aria-labelledby="ov-mediathek-alle" className="mt-16 md:mt-24">
        <div className="flex flex-col gap-5 border-b border-ink-200/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="ov-mediathek-alle" className="ov-h3 text-ink-900">
              Alle Videos
            </h2>
            <p className="mt-1 text-[14.5px] text-ink-500" role="status" aria-live="polite">
              {treffer.length === reels.length ? `${reels.length} ${reels.length === 1 ? "Video" : "Videos"}` : `${treffer.length} von ${reels.length} Videos`}
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {kategorien.length > 1 && (
              <div role="group" aria-label="Nach Kategorie filtern" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 ov-no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
                {["", ...kategorien].map((k) => (
                  <button
                    key={k || "alle"}
                    type="button"
                    onClick={() => setKategorie(k)}
                    aria-pressed={kategorie === k}
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-semibold transition-colors",
                      kategorie === k ? "bg-navy-950 text-white" : "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
                    )}
                  >
                    {k || "Alle"}
                  </button>
                ))}
              </div>
            )}
            <label className="relative block w-full lg:w-[260px]">
              <span className="sr-only">Videos durchsuchen</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={suche}
                onChange={(e) => setSuche(e.target.value)}
                placeholder="Videos durchsuchen …"
                className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-[15px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ov-500"
              />
            </label>
          </div>
        </div>

        {treffer.length === 0 ? (
          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15.5px] text-ink-700">Kein Video passt zu Ihrer Auswahl.</p>
            <button
              type="button"
              onClick={zuruecksetzen}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 px-5 text-[14px] font-semibold text-white hover:bg-navy-800"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
            {treffer.map((r, i) => (
              <li key={r.slug}>
                <ReelKachel
                  reel={r}
                  abspielen={offen === null && vorschau === r.slug}
                  onVorschau={(an) => setVorschau(an ? r.slug : null)}
                  onOeffnen={() => setOffen(i)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {offen !== null && treffer[offen] && <ReelDialog liste={treffer} index={offen} onIndex={setOffen} onSchliessen={() => setOffen(null)} />}
    </div>
  );
}
