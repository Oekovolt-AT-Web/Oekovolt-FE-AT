// src/app/freischalten/page.js – Bestätigungslink des Lead-Gates 2.0 (Welle A, Paket A09)
//
// Ziel des Links aus der Bestätigungsmail (/freischalten?token=…). Die Seite prüft den Token nur lesend
// (Signatur, Ablauf) und zeigt einen Knopf „E-Mail bestätigen“. Erst der Klick verbraucht den Token
// (POST /api/lead-gate/bestaetigen) – Virenscanner und Link-Vorschauen, die Links in Mails automatisch
// abrufen, schalten damit nichts frei. Kein Index, kein Referrer (Token in der Adresse).

import Link from "next/link";
import { Clock } from "lucide-react";
import Freischalten from "@/components/LeadGate/Freischalten";
import { leadRechner } from "@/data/leadRechner";
import { tokenPruefen } from "@/lib/leadGateServer";
import { FIRMA } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "E-Mail bestätigen | Ökovolt",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default async function FreischaltenSeite({ searchParams }) {
  const { token = "" } = (await searchParams) || {};
  const t = typeof token === "string" ? tokenPruefen(token) : { ok: false, grund: "format" };
  const werkzeug = t.ok ? leadRechner(t.kennung) : null;

  return (
    <div className="min-h-[70vh] bg-sand-50 px-4 py-14 md:py-24">
      <div className="mx-auto max-w-2xl">
        {t.ok ? (
          <Freischalten token={token} werkzeug={werkzeug?.name || "Ihr Ergebnis"} stufe={werkzeug?.stufe || 1} />
        ) : (
          <div className="rounded-4xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-200/70 md:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700">
              <Clock aria-hidden="true" className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-[26px] font-extrabold tracking-tight text-ink-900">
              {t.grund === "abgelaufen" ? "Dieser Link ist abgelaufen." : "Dieser Link ist nicht gültig."}
            </h1>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
              {t.grund === "abgelaufen"
                ? "Bestätigungslinks gelten 24 Stunden. Fordern Sie im Rechner bitte einfach einen neuen Link an."
                : "Bitte öffnen Sie den Link direkt aus der E-Mail oder kopieren Sie ihn vollständig in die Adresszeile. Sie können auch im Rechner einen neuen Link anfordern."}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/rechner" className="inline-flex h-12 items-center justify-center rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
                Zu den Rechnern
              </Link>
              <a href={FIRMA.telefonHref} className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200">
                {FIRMA.telefon}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
