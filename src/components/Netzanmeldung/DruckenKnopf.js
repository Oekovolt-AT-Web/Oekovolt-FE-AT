"use client";

import { Printer } from "lucide-react";

/** Öffnet den Druckdialog des Browsers (auch „Als PDF speichern“). */
export default function DruckenKnopf({ label = "Drucken oder als PDF speichern" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700 print:hidden"
    >
      <Printer aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}
