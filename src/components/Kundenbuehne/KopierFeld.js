"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/components/ui/cn";

/** Text oder Code mit „Kopieren“-Knopf (Zwischenablage, mit Rückfall für ältere Browser). */
export default function KopierFeld({ text, label = "Kopieren", code = false, zeilen, className }) {
  const [kopiert, setKopiert] = useState(false);

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const feld = document.createElement("textarea");
      feld.value = text;
      document.body.appendChild(feld);
      feld.select();
      document.execCommand("copy");
      feld.remove();
    }
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2200);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {code ? (
        <pre
          tabIndex={0}
          className="max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-2xl bg-navy-950 p-4 font-mono text-[12.5px] leading-relaxed text-ov-100 ring-1 ring-navy-800"
          style={zeilen ? { minHeight: `${zeilen * 1.6}em` } : undefined}
        >
          {text}
        </pre>
      ) : (
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-700">{text}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={kopieren}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14.5px] font-semibold transition-colors",
            kopiert ? "bg-ov-100 text-ov-800 ring-1 ring-inset ring-ov-300" : "bg-ov-600 text-white hover:bg-ov-700"
          )}
        >
          {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          {kopiert ? "Kopiert" : label}
        </button>
        <span aria-live="polite" className="sr-only">
          {kopiert ? "In die Zwischenablage kopiert" : ""}
        </span>
      </div>
    </div>
  );
}
