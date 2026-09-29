"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Kopier-Knopf für Pressetexte (Boilerplate, Kurzprofil). */
export default function Kopieren({ text, label = "Text kopieren", className = "" }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 2200);
        } catch {
          /* Zwischenablage nicht verfügbar – Text bleibt markierbar */
        }
      }}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-colors ${ok ? "bg-ov-500 text-white" : "bg-white text-ink-800 ring-1 ring-ink-200 hover:ring-ov-300"} ${className}`}
    >
      {ok ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
      <span aria-live="polite">{ok ? "Kopiert" : label}</span>
    </button>
  );
}
