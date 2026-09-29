"use client";

import { useState } from "react";
import { Banknote, Building2, Check, FileSignature, Handshake, Landmark, Minus, PiggyBank, Receipt, Scale, Sun, Wallet, Wrench } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Interaktiver Vergleich der Finanzierungswege (Kauf, Kredit, Leasing, Mietkauf,
 * Contracting, On-site-PPA). Inhalte aus der Vergleichstabelle der Seite; das
 * Zahlungsprofil ist schematisch (ohne Beträge). Keine Konditionen, keine Beratung.
 */

const MODELLE = [
  {
    k: "kauf",
    name: "Kauf",
    voll: "Kauf aus Eigenmitteln",
    icon: PiggyBank,
    kurz: "Höchste Rendite, volle Steuervorteile, volle Kontrolle – wenn die Liquidität es zulässt.",
    profil: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    merkmale: { invest: "hoch", eigentum: "ja", steuer: "ja", betrieb: "ja" },
    zeilen: {
      Eigentum: "Sofort bei Ihnen",
      "Bilanz (UGB)": "Anlagevermögen",
      Liquidität: "Hoher Mittelabfluss zu Beginn",
      Steuer: "AfA linear oder degressiv bis 30 %",
      Investitionsfreibetrag: "Ja – Öko-IFB, befristet 22 % bis Ende 2026",
      "EAG-Investitionszuschuss": "Sie als Förderwerber",
      "Betrieb & Wartung": "Ihre Verantwortung",
      "Passt, wenn …": "… Liquidität vorhanden ist und die Rendite zählt",
    },
  },
  {
    k: "kredit",
    name: "Kredit",
    voll: "Bankkredit",
    icon: Landmark,
    kurz: "Eigentum ab Tag eins, AfA und IFB bei Ihnen. Die Anlage trägt die Rate oft aus dem laufenden Vorteil.",
    profil: [0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
    merkmale: { invest: "mittel", eigentum: "ja", steuer: "ja", betrieb: "ja" },
    zeilen: {
      Eigentum: "Sofort bei Ihnen, ggf. Sicherungsübereignung",
      "Bilanz (UGB)": "Anlagevermögen und Verbindlichkeit",
      Liquidität: "Raten, ggf. Eigenmittelanteil",
      Steuer: "AfA plus Zinsaufwand",
      Investitionsfreibetrag: "Ja – Öko-IFB, befristet 22 % bis Ende 2026",
      "EAG-Investitionszuschuss": "Sie als Förderwerber",
      "Betrieb & Wartung": "Ihre Verantwortung",
      "Passt, wenn …": "… Eigentum und Steuervorteile gewünscht sind",
    },
  },
  {
    k: "leasing",
    name: "Leasing",
    voll: "Leasing",
    icon: FileSignature,
    kurz: "Planbare Raten, geringe Anfangsbelastung, Kreditrahmen bleibt frei. Ökovolt organisiert das Leasing mit Partnern.",
    profil: [0.05, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
    merkmale: { invest: "gering", eigentum: "option", steuer: "meist nein", betrieb: "ja" },
    zeilen: {
      Eigentum: "Beim Leasinggeber; Kauf- oder Verlängerungsoption am Ende",
      "Bilanz (UGB)": "In der Regel beim Leasinggeber, Raten als Aufwand; nach IFRS 16 Nutzungsrecht beim Leasingnehmer",
      Liquidität: "Laufende Raten, geringe Anfangsbelastung",
      Steuer: "Leasingraten als Betriebsausgabe",
      Investitionsfreibetrag: "Beim wirtschaftlichen Eigentümer, meist dem Leasinggeber",
      "EAG-Investitionszuschuss": "Je nach Vertragsgestaltung – vorab klären",
      "Betrieb & Wartung": "Meist bei Ihnen, oft mit Versicherungs- und Wartungspflicht",
      "Passt, wenn …": "… Kreditrahmen geschont und Raten planbar sein sollen",
    },
  },
  {
    k: "mietkauf",
    name: "Mietkauf",
    voll: "Mietkauf",
    icon: Wallet,
    kurz: "Raten wie beim Leasing, das Eigentum geht mit der letzten Rate auf Sie über.",
    profil: [0.05, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
    merkmale: { invest: "gering", eigentum: "am ende", steuer: "ja", betrieb: "ja" },
    zeilen: {
      Eigentum: "Geht mit der letzten Rate über",
      "Bilanz (UGB)": "Aktivierung beim Mietkäufer",
      Liquidität: "Laufende Raten",
      Steuer: "AfA beim Mietkäufer",
      Investitionsfreibetrag: "In der Regel beim Mietkäufer",
      "EAG-Investitionszuschuss": "In der Regel Sie",
      "Betrieb & Wartung": "Ihre Verantwortung",
      "Passt, wenn …": "… Eigentum ohne Anfangsinvestition gewünscht ist",
    },
  },
  {
    k: "contracting",
    name: "Contracting",
    voll: "Anlagen-Contracting",
    icon: Handshake,
    kurz: "Ein Contractor errichtet und betreibt die Anlage auf Ihrem Dach – Sie zahlen ein Entgelt statt zu investieren.",
    profil: [0, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15],
    merkmale: { invest: "keine", eigentum: "nein", steuer: "nein", betrieb: "nein" },
    zeilen: {
      Eigentum: "Beim Contractor bzw. Anlagenbetreiber",
      "Bilanz (UGB)": "Nicht in Ihrer Bilanz – Sie kaufen Strom oder Leistung",
      Liquidität: "Keine Investition, Entgelt je kWh oder Monat",
      Steuer: "Entgelt als Betriebsausgabe",
      Investitionsfreibetrag: "Beim Contractor",
      "EAG-Investitionszuschuss": "Contractor als Förderwerber",
      "Betrieb & Wartung": "Beim Contractor",
      "Passt, wenn …": "… keine Investition und kein Betriebsaufwand gewünscht sind",
    },
  },
  {
    k: "ppa",
    name: "On-site-PPA",
    voll: "On-site-PPA",
    icon: Sun,
    kurz: "Sie kaufen den Solarstrom vom eigenen Dach zu einem vereinbarten Preis je kWh – ohne Investition.",
    profil: [0, 0.08, 0.2, 0.26, 0.2, 0.08, 0.08, 0.2, 0.26, 0.2],
    saisonal: true,
    merkmale: { invest: "keine", eigentum: "nein", steuer: "nein", betrieb: "nein" },
    zeilen: {
      Eigentum: "Beim Anlagenbetreiber",
      "Bilanz (UGB)": "Nicht in Ihrer Bilanz – Sie kaufen Strom",
      Liquidität: "Keine Investition, Preis je kWh Solarstrom",
      Steuer: "Entgelt als Betriebsausgabe",
      Investitionsfreibetrag: "Beim Betreiber",
      "EAG-Investitionszuschuss": "Betreiber als Förderwerber",
      "Betrieb & Wartung": "Beim Betreiber",
      "Passt, wenn …": "… keine Investition und kein Betriebsaufwand gewünscht sind",
    },
  },
];

const MERKMALE = [
  { k: "invest", label: "Investition zu Beginn", icon: Banknote },
  { k: "eigentum", label: "Eigentum bei Ihnen", icon: Building2 },
  { k: "steuer", label: "AfA & IFB bei Ihnen", icon: Receipt },
  { k: "betrieb", label: "Betrieb & Wartung bei Ihnen", icon: Wrench },
];

// „Trifft zu“-Logik: ja · teilweise/je nach Vertrag · nein
function status(k, v) {
  if (k === "invest") return v === "hoch" ? "ja" : v === "mittel" ? "teil" : "nein";
  if (v === "ja") return "ja";
  if (v === "option" || v === "am ende" || v === "meist nein") return "teil";
  return "nein";
}

const CHIP = { ja: "bg-navy-950 text-white", teil: "bg-sun-300/70 text-navy-950", nein: "bg-ink-200 text-ink-700" };

export default function FinanzModelle() {
  const [wahl, setWahl] = useState("leasing");
  const m = MODELLE.find((x) => x.k === wahl) || MODELLE[0];

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      {/* Auswahl */}
      <div className="border-b border-ink-100 p-4 sm:p-6">
        <div role="group" aria-label="Finanzierungsweg wählen" className="ov-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {MODELLE.map((x) => {
            const an = x.k === wahl;
            return (
              <button
                key={x.k}
                type="button"
                aria-pressed={an}
                onClick={() => setWahl(x.k)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-left transition-all duration-300",
                  an ? "bg-navy-950 text-white shadow-lg" : "bg-sand-50 text-ink-800 ring-1 ring-ink-200/70 hover:ring-ov-300"
                )}
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", an ? "bg-ov-500 text-white" : "bg-white text-ov-600 ring-1 ring-ink-200/70")}>
                  <x.icon aria-hidden="true" className="h-4.5 w-4.5" />
                </span>
                <span className="whitespace-nowrap font-display text-[15px] font-bold">{x.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div key={m.k} className="sb-ein grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* Profil */}
        <div className="border-b border-ink-100 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">{m.voll}</p>
          <p className="mt-2 font-display text-[21px] font-extrabold leading-snug tracking-tight text-ink-900 md:text-[24px]">{m.kurz}</p>

          <dl className="mt-6 grid grid-cols-2 gap-2.5">
            {MERKMALE.map((mm) => {
              const v = m.merkmale[mm.k];
              return (
                <div key={mm.k} className="rounded-2xl bg-sand-50 p-3.5 ring-1 ring-ink-200/60">
                  <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
                    <mm.icon aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                    {mm.label}
                  </dt>
                  <dd className="mt-2">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-semibold first-letter:uppercase", CHIP[status(mm.k, v)])}>{v}</span>
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* Zahlungsprofil (schematisch) */}
          <div className="mt-6 rounded-2xl bg-navy-950 p-5 text-white">
            <p className="flex items-center justify-between text-[12.5px] text-white/60">
              <span className="font-semibold uppercase tracking-[0.14em] text-ov-300">Zahlungsprofil</span>
              <span>schematisch, ohne Beträge</span>
            </p>
            <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden="true">
              {m.profil.map((h, i) => (
                <span key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-ov-600 to-ov-400 transition-all duration-500" style={{ height: `${Math.max(h * 100, h > 0 ? 6 : 2)}%`, opacity: h > 0 ? 1 : 0.25 }} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11.5px] text-white/45">
              <span>Start</span>
              <span>{m.saisonal ? "Zahlung folgt der Solarstrom-Menge" : "Laufzeit"}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 md:p-8">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
            <Scale aria-hidden="true" className="h-4 w-4" />
            Bilanz, Steuer, Förderung
          </p>
          <dl className="mt-4 divide-y divide-ink-100">
            {Object.entries(m.zeilen).map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] sm:gap-4">
                <dt className="text-[13.5px] font-semibold text-ink-500">{k}</dt>
                <dd className={cn("text-[15px] leading-snug", k === "Passt, wenn …" ? "font-semibold text-ov-700" : "text-ink-800")}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Mini-Matrix aller Wege */}
      <div className="overflow-x-auto border-t border-ink-100 bg-sand-50">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <caption className="sr-only">Finanzierungswege im Überblick</caption>
          <thead>
            <tr className="text-ink-500">
              <th scope="col" className="px-6 py-3 font-medium">Überblick</th>
              {MODELLE.map((x) => (
                <th key={x.k} scope="col" className={cn("px-2 py-3 text-center font-semibold", x.k === wahl ? "text-ink-900" : "")}>
                  {x.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MERKMALE.map((mm) => (
              <tr key={mm.k} className="border-t border-ink-200/60">
                <th scope="row" className="px-6 py-2.5 font-medium text-ink-700">
                  {mm.label}
                </th>
                {MODELLE.map((x) => {
                  const v = x.merkmale[mm.k];
                  const st = status(mm.k, v);
                  return (
                    <td key={x.k} className={cn("px-2 py-2.5 text-center", x.k === wahl && "bg-white")}>
                      <span className="sr-only">{v}</span>
                      {st === "ja" ? (
                        <Check aria-hidden="true" className="mx-auto h-4 w-4 text-navy-700" strokeWidth={3} />
                      ) : st === "teil" ? (
                        <span aria-hidden="true" className="mx-auto block h-2.5 w-2.5 rounded-full bg-sun-400" />
                      ) : (
                        <Minus aria-hidden="true" className="mx-auto h-4 w-4 text-ink-400" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500">
        Überblick: ✓ trifft zu · ● teilweise bzw. je nach Vertrag · – trifft nicht zu (Zeile „Investition zu Beginn“: ✓ hoch, ● Eigenmittelanteil). Orientierung, Stand September 2026. Keine Steuer-, Rechts- oder Finanzierungsberatung – maßgeblich sind Vertrag, UGB/IFRS und Ihre Steuerberatung. Leasing kann je nach Gestaltung auch
        beim Leasingnehmer bilanziert werden.
      </p>
    </div>
  );
}
