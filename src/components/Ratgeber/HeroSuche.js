"use client";

import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import { filterSetzen } from "./filterEvent";

/**
 * Suchfeld im Ratgeber-Hero. Übergibt den Begriff an den Artikel-Katalog und
 * scrollt dorthin; ohne JavaScript funktioniert es als GET-Formular (?q=).
 * vorschlaege: ["EAG-Förderung", …] – Schnellzugriffe unter dem Feld.
 */
export default function HeroSuche({ vorschlaege = [] }) {
  const [wert, setWert] = useState("");
  const suchen = (q) => filterSetzen({ q, thema: "alle" });

  return (
    <div>
      <form
        action="/ratgeber#alle-artikel"
        method="get"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          suchen(wert.trim());
        }}
        className="group relative flex items-center rounded-full bg-white/[0.07] p-1.5 ring-1 ring-white/15 backdrop-blur-xl transition-all focus-within:bg-white/[0.11] focus-within:ring-ov-400/70"
      >
        <Search aria-hidden="true" className="pointer-events-none absolute left-5 h-5 w-5 text-white/50" />
        <label htmlFor="ratgeber-hero-suche" className="sr-only">
          Ratgeber durchsuchen
        </label>
        <input
          id="ratgeber-hero-suche"
          name="q"
          type="search"
          value={wert}
          onChange={(e) => setWert(e.target.value)}
          placeholder="Wonach suchen Sie? z. B. Leistungspreis"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 bg-transparent pl-11 pr-3 text-[16px] text-white outline-none placeholder:text-white/45 [&::-webkit-search-cancel-button]:hidden"
        />
        <button type="submit" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ov-500 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ov-600">
          <span className="hidden sm:inline">Suchen</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
      {vorschlaege.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-white/50">Oft gesucht:</span>
          {vorschlaege.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => suchen(v)}
              className="inline-flex h-9 items-center rounded-full bg-white/[0.06] px-3.5 text-[13px] font-medium text-white/80 ring-1 ring-white/12 transition-colors hover:bg-white/15 hover:text-white"
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
