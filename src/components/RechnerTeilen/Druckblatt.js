"use client";

import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { FIRMA } from "@/lib/site";

// Druckbericht eines Gewerbe-Rechners („Als PDF für Geschäftsführung/Bank“).
// Wird nur nach Klick als Portal direkt in <body> gehängt. Am Bildschirm unsichtbar;
// beim Drucken blendet DRUCK_CSS alles andere aus – solange <html> die Klasse
// DRUCK_KLASSE trägt. Normales Drucken der Seite (Strg+P) bleibt unverändert.

export const DRUCK_KLASSE = "ov-rt-drucken";
export const BLATT_KLASSE = "ov-rt-blatt";

const DRUCK_CSS = `
.${BLATT_KLASSE} { display: none; }
@media print {
  html.${DRUCK_KLASSE} body > *:not(.${BLATT_KLASSE}) { display: none !important; }
  html.${DRUCK_KLASSE} .${BLATT_KLASSE} { display: block !important; }
  html.${DRUCK_KLASSE}, html.${DRUCK_KLASSE} body { background: #fff !important; height: auto !important; min-height: 0 !important; overflow: visible !important; }
  .${BLATT_KLASSE} * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .${BLATT_KLASSE} .ov-rt-gruppe { break-inside: avoid; }
  .${BLATT_KLASSE} h2 { break-after: avoid; }
  @page { size: A4; margin: 14mm 14mm 16mm; }
}
`;

function Tabelle({ gruppen }) {
  return (
    <div className="space-y-3">
      {gruppen.map((g, gi) => (
        <div key={`${g.titel}-${gi}`} className="ov-rt-gruppe">
          {g.titel && <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{g.titel}</p>}
          <dl className="divide-y divide-ink-100 border-y border-ink-100">
            {g.zeilen.map(([l, w, z], i) => (
              <div key={`${l}-${i}`} className="flex items-baseline justify-between gap-4 py-[5px] text-[11.5px] leading-snug">
                <dt className="min-w-0 text-ink-600">
                  {l}
                  {z && <span className="block text-[10px] leading-snug text-ink-500">{z}</span>}
                </dt>
                <dd className="ov-num max-w-[58%] text-right font-semibold text-ink-900">{w}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export default function Druckblatt({ bericht, url, zeitpunkt }) {
  const b = bericht;
  return (
    <div className={BLATT_KLASSE}>
      <style dangerouslySetInnerHTML={{ __html: DRUCK_CSS }} />
      <article className="bg-white font-sans text-ink-800" lang="de-AT">
        {/* Kopf */}
        <header className="flex items-start justify-between gap-6 border-b-2 border-ov-600 pb-4">
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Ergebnisbericht · Richtwert</p>
            <h1 className="mt-1 font-display text-[22px] font-extrabold leading-tight text-ink-900">{b.titel}</h1>
            {b.untertitel && <p className="mt-0.5 text-[12.5px] text-ink-600">{b.untertitel}</p>}
            <p className="mt-1.5 text-[11px] text-ink-500">Erstellt am {zeitpunkt} · für Geschäftsführung, Bank und Beratung</p>
          </div>
          <Image src="/logo-oekovolt.png" alt="Ökovolt Solartechnik" width={150} height={33} unoptimized loading="eager" className="h-auto w-[150px] shrink-0" />
        </header>

        {/* Hinweis Richtwert – gut sichtbar oben */}
        <p className="ov-rt-gruppe mt-4 flex gap-2.5 rounded-xl border border-sun-400/70 bg-sun-300/15 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-ink-800">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          <span>
            <strong>Richtwert, kein Angebot.</strong> Die Zahlen stammen aus einem vereinfachten Rechenmodell mit den unten genannten Annahmen und Ihren Eingaben. Sie ersetzen weder ein verbindliches Angebot noch Steuer-, Rechts- oder Finanzierungsberatung. Förderungen gelten nur mit Zusage der Förderstelle.
          </span>
        </p>

        {/* Kennzahlen */}
        {b.kennzahlen.length > 0 && (
          <section className="ov-rt-gruppe mt-5" aria-label="Kennzahlen">
            <dl className="grid grid-cols-4 gap-2.5">
              {b.kennzahlen.map(([l, w, z]) => (
                <div key={l} className="rounded-xl bg-ov-50 px-3 py-2.5 ring-1 ring-ov-200/70">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">{l}</dt>
                  <dd className="ov-num mt-1 font-display text-[17px] font-extrabold leading-tight text-ink-900">{w}</dd>
                  {z && <dd className="mt-0.5 text-[10px] leading-snug text-ink-500">{z}</dd>}
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Eingaben und Ergebnisse */}
        <div className="mt-6 grid grid-cols-2 gap-7">
          <section aria-labelledby="rt-eingaben">
            <h2 id="rt-eingaben" className="mb-2 font-display text-[14px] font-bold text-ink-900">
              Ihre Eingaben
            </h2>
            <Tabelle gruppen={b.eingaben} />
          </section>
          <section aria-labelledby="rt-ergebnisse">
            <h2 id="rt-ergebnisse" className="mb-2 font-display text-[14px] font-bold text-ink-900">
              Ergebnisse
            </h2>
            <Tabelle gruppen={b.ergebnisse} />
          </section>
        </div>

        {b.hinweise.length > 0 && (
          <section className="ov-rt-gruppe mt-6" aria-labelledby="rt-hinweise">
            <h2 id="rt-hinweise" className="mb-1.5 font-display text-[14px] font-bold text-ink-900">
              Hinweise zu Ihrem Ergebnis
            </h2>
            <ul className="list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-ink-700">
              {b.hinweise.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {b.annahmen.length > 0 && (
          <section className="ov-rt-gruppe mt-6" aria-labelledby="rt-annahmen">
            <h2 id="rt-annahmen" className="mb-1.5 font-display text-[14px] font-bold text-ink-900">
              Annahmen und Quellen
            </h2>
            <ul className="list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-ink-700">
              {b.annahmen.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Link zur Berechnung */}
        <section className="ov-rt-gruppe mt-6 rounded-xl bg-sand-50 px-3.5 py-2.5 ring-1 ring-ink-200/70" aria-label="Berechnung online öffnen">
          <p className="text-[11px] font-semibold text-ink-800">Berechnung online nachvollziehen</p>
          <p className="mt-0.5 break-all font-mono text-[10px] leading-snug text-ink-600">{url}</p>
          <p className="mt-1 text-[10px] leading-snug text-ink-500">Der Link enthält nur die Eingaben (keine Namen oder Firmendaten); die Seite rechnet beim Öffnen mit dem dann gültigen Stand neu.</p>
        </section>

        {/* Fuß */}
        <footer className="ov-rt-gruppe mt-6 flex items-end justify-between gap-6 border-t border-ink-200 pt-3 text-[10px] leading-relaxed text-ink-500">
          <p>
            <strong className="text-ink-700">{FIRMA.name}</strong> · {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}, {FIRMA.land}
            <br />
            Tel. {FIRMA.telefon} · {FIRMA.email} · www.oekovolt.com
          </p>
          <p className="shrink-0 text-right">
            {FIRMA.firmenbuch} · UID {FIRMA.uid}
          </p>
        </footer>
      </article>
    </div>
  );
}
