"use client";

import { Printer } from "lucide-react";

/** Öffnet den Druckdialog des Browsers – dort „Als PDF speichern“ wählen. */
export default function DruckenKnopf({ label = "Als PDF speichern" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700 print:hidden"
    >
      <Printer aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}
