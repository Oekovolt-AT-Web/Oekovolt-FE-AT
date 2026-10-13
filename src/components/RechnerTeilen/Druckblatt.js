"use client";

import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { FIRMA } from "@/lib/site";
import { ARGUMENTARIEN_STAND, MAPPE_FUSS, mappeKapitel } from "@/data/argumentarien";

// Druckbericht eines Gewerbe-Rechners („Als PDF für Geschäftsführung/Bank“).
// Wird nur nach Klick als Portal direkt in <body> gehängt. Am Bildschirm unsichtbar;
// beim Drucken blendet DRUCK_CSS alles andere aus – solange <html> die Klasse
// DRUCK_KLASSE trägt. Normales Drucken der Seite (Strg+P) bleibt unverändert.
//
// Entscheider-Mappe (Welle A, Paket A09): Für jede im Lead-Gate gewählte Rolle (Geschäftsführung, Finanzen/CFO,
// Technik/Facility, Bank, ESG/Betriebsrat, Gemeinderat) folgt ein eigenes A4-Kapitel aus src/data/argumentarien.js.
// Die Kapitel nutzen nur Zahlen aus bericht().mappe des Rechners; fehlt ein Wert, entfällt die Zeile.

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
  .${BLATT_KLASSE} .ov-rt-kapitel { break-before: page; }
  .${BLATT_KLASSE} .ov-rt-kapitel tr { break-inside: avoid; }
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

function KleineTabelle({ tabelle, titel }) {
  if (!tabelle?.reihen?.length) return null;
  return (
    <div className="mt-4">
      {titel && <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{titel}</p>}
      <table className="w-full border-collapse text-[10.5px] leading-snug">
        <thead>
          <tr className="border-b border-ink-300 text-left text-ink-600">
            {tabelle.kopf.map((k, i) => (
              <th key={k} scope="col" className={i === 0 ? "py-1 pr-2 font-semibold" : "py-1 pl-2 text-right font-semibold"}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabelle.reihen.map((reihe, ri) => (
            <tr key={`${reihe[0]}-${ri}`} className="border-b border-ink-100">
              {reihe.map((zelle, i) => (
                <td key={i} className={i === 0 ? "py-[3px] pr-2 text-ink-700" : "ov-num py-[3px] pl-2 text-right font-semibold text-ink-900"}>
                  {zelle}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Ein Kapitel der Entscheider-Mappe (eigene A4-Seite). */
function Kapitel({ k, name, zeitpunkt }) {
  return (
    <section className="ov-rt-kapitel pt-1" aria-labelledby={`rt-kap-${k.id}`}>
      <header className="flex items-end justify-between gap-6 border-b-2 border-ov-600 pb-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Entscheider-Mappe · {name}</p>
          <h2 id={`rt-kap-${k.id}`} className="mt-1 font-display text-[19px] font-extrabold leading-tight text-ink-900">
            {k.titel}
          </h2>
        </div>
        <Image src="/logo-oekovolt.png" alt="" width={110} height={24} unoptimized loading="eager" className="h-auto w-[110px] shrink-0" />
      </header>
      {k.absaetze?.map((a) => (
        <p key={a} className="mt-3 text-[12px] leading-relaxed text-ink-800">
          {a}
        </p>
      ))}
      {k.zeilen?.length > 0 && (
        <dl className="mt-4 divide-y divide-ink-100 border-y border-ink-100">
          {k.zeilen.map(([l, w, z]) => (
            <div key={l} className="flex items-baseline justify-between gap-4 py-[5px] text-[11.5px] leading-snug">
              <dt className="min-w-0 text-ink-600">
                {l}
                {z && <span className="block text-[10px] leading-snug text-ink-500">{z}</span>}
              </dt>
              <dd className="ov-num text-right font-semibold text-ink-900">{w}</dd>
            </div>
          ))}
        </dl>
      )}
      <KleineTabelle tabelle={k.stresstest} titel="Stresstest" />
      <KleineTabelle tabelle={k.tabelle} titel="Cashflow je Jahr (netto, vor Steuern)" />
      {k.punkte?.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-ink-700">
          {k.punkte.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <footer className="mt-5 border-t border-ink-200 pt-2 text-[9.5px] leading-relaxed text-ink-500">
        Stand {zeitpunkt} · Argumentarium {ARGUMENTARIEN_STAND} · Annahmen und Quellen im Ergebnisbericht vorne · {MAPPE_FUSS.join(" · ")}
      </footer>
    </section>
  );
}

export default function Druckblatt({ bericht, url, zeitpunkt, rollen = [], mappe = {} }) {
  const b = bericht;
  const kapitel = mappeKapitel(rollen, { mappe, name: b.titel });
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
            <p className="mt-1.5 text-[11px] text-ink-500">Erstellt am {zeitpunkt} ·{" "}
              {kapitel.length > 0 ? `mit Kapiteln für ${kapitel.map((k) => k.titel.replace(/^Für (die |den )?/, "")).join(", ")}` : "für Geschäftsführung, Bank und Beratung"}
            </p>
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

        {/* Entscheider-Mappe: je gewählter Rolle ein A4-Kapitel */}
        {kapitel.map((k) => (
          <Kapitel key={k.id} k={k} name={b.titel} zeitpunkt={zeitpunkt} />
        ))}
      </article>
    </div>
  );
}
