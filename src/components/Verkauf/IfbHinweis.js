"use client";

// src/components/Verkauf/IfbHinweis.js
//
// Schmale Hinweisleiste zum Öko-Investitionsfreibetrag 22 % (Welle A, Paket A03), Muster wie
// src/components/Foerdercall/HinweisLeiste.js: Der Startzustand ist „sichtbar“ (hydrationssicher),
// nach dem Mounten prüft die Leiste das Datum selbst und blendet sich nach dem 31.12.2026 aus.
// Kein Countdown, kein Blinken. Prop `zusatz` (optional) hängt einen Satz an, z. B.
// „nicht bei pauschalierter Gewinnermittlung“. Auf dem Handy linksbündig, ab sm zentriert.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FRISTEN, IFB, datumText, istIfbAktiv } from "@/data/fristen";
import { cn } from "@/components/ui/cn";

export const IFB_HINWEIS_TEXT =
  "Öko-Investitionsfreibetrag 22 % für Anschaffungen bis 31.12.2026 – danach 15 %. Ob Ihr Projekt das noch schafft, sagen wir Ihnen im Erstgespräch; die steuerliche Zuordnung klären Sie mit Ihrer Steuerberatung.";

export default function IfbHinweis({ zusatz, className }) {
  const [aktiv, setAktiv] = useState(true);

  useEffect(() => {
    const pruefen = () => setAktiv(istIfbAktiv(Date.now()));
    pruefen();
    const t = setInterval(pruefen, 60_000);
    return () => clearInterval(t);
  }, []);

  const f = FRISTEN.find((x) => x.id === "ifb");
  if (!aktiv || !f) return null;
  const z = String(zusatz || "").trim().replace(/[.\s]+$/, "");

  return (
    <aside aria-label="Hinweis zum Öko-Investitionsfreibetrag" className={cn("relative border-y border-ov-200/70 bg-ov-50 text-ink-900", className)}>
      <div className="ov-container relative flex min-h-11 items-center justify-start py-2.5 sm:justify-center">
        <Link href="/forderungen/steuerlich" className="group inline-flex max-w-4xl items-start gap-2.5 text-left text-[13.5px] sm:text-center leading-snug text-ink-700 hover:text-ink-900 sm:items-center">
          <span className="min-w-0">
            <strong className="font-semibold text-ink-900">Öko-Investitionsfreibetrag {IFB.satzBis} %</strong> für Anschaffungen bis {datumText(f.ende)} – danach {f.danach}. Ob Ihr Projekt das noch
            schafft, sagen wir Ihnen im Erstgespräch; die steuerliche Zuordnung klären Sie mit Ihrer Steuerberatung.{z ? ` ${z[0].toUpperCase()}${z.slice(1)}.` : ""}
          </span>
          <ArrowRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-700 transition-transform group-hover:translate-x-1 sm:mt-0" />
        </Link>
      </div>
    </aside>
  );
}
