"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Regler from "./Regler";
import { WALLBOX } from "@/data/wallbox";

/**
 * Mini-Rechner: Jahresstrecke → kWh → Ladekosten im Vergleich
 * (öffentliche Ladesäule, Wallbox mit Netzstrom, Wallbox mit Solarstrom).
 * Alle Annahmen stehen sichtbar unter dem Rechner.
 */

// Preisannahmen Österreich (Richtwerte, Stand 09/2026) aus @/data/wallbox
const NETZ_CT = WALLBOX.preiseAt.netzstromCt;
const SOLAR_CT = WALLBOX.preiseAt.marktpreisCt; // entgangener Erlös aus der Einspeisung
const OEFFENTLICH_CT = WALLBOX.preiseAt.oeffentlichCt;

const eur = (n) => `${Math.round(n).toLocaleString("de-DE")} €`;

export default function Laderechner() {
  const [kmJahr, setKmJahr] = useState(15000);
  const [verbrauch, setVerbrauch] = useState(WALLBOX.verbrauchProHundert);
  const [solar, setSolar] = useState(40);

  const kwh = (kmJahr * verbrauch) / 100;
  const mixCt = (solar / 100) * SOLAR_CT + (1 - solar / 100) * NETZ_CT;
  const zeilen = [
    { k: "oeffentlich", l: "Öffentliche Ladesäule", ct: OEFFENTLICH_CT, farbe: "bg-ink-300" },
    { k: "netz", l: "Wallbox mit Netzstrom", ct: NETZ_CT, farbe: "bg-navy-500" },
    { k: "solar", l: `Wallbox mit ${solar} % Solarstrom`, ct: mixCt, farbe: "bg-ov-500" },
  ].map((z) => ({ ...z, eur: (kwh * z.ct) / 100 }));
  const max = zeilen[0].eur;
  const ersparnisNetz = zeilen[1].eur - zeilen[2].eur;
  const ersparnisOeff = zeilen[0].eur - zeilen[2].eur;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 border-b border-ink-100 p-6 md:p-8 lg:border-b-0 lg:border-r">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Ladekosten-Rechner</p>
        <Regler
          id="lr-km"
          label="Fahrleistung pro Jahr"
          wert={kmJahr}
          min={5000}
          max={40000}
          step={500}
          onChange={setKmJahr}
          anzeige={`${kmJahr.toLocaleString("de-DE")} km`}
          hinweis={`≈ ${Math.round(kmJahr / 365)} km pro Tag`}
        />
        <Regler
          id="lr-verbrauch"
          label="Verbrauch des E-Autos"
          wert={verbrauch}
          min={14}
          max={28}
          step={1}
          onChange={setVerbrauch}
          anzeige={`${verbrauch} kWh/100 km`}
          hinweis="Kompaktwagen ca. 15–18, SUV ca. 20–25 kWh"
        />
        <Regler
          id="lr-solar"
          label="Anteil Solarstrom an der Ladung"
          wert={solar}
          min={0}
          max={80}
          step={5}
          onChange={setSolar}
          anzeige={`${solar} %`}
          hinweis={
            solar <= 15
              ? "Das Auto steht tagsüber selten zu Hause."
              : solar <= 50
                ? "Typisch mit Überschussladen, wenn das Auto öfter tagsüber da ist."
                : "Realistisch mit Homeoffice, großer Anlage oder Speicher."
          }
        />
      </div>

      <div className="flex flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] text-ink-500">Strombedarf pro Jahr</p>
            <p className="ov-num font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink-900">
              {Math.round(kwh).toLocaleString("de-DE")} kWh
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[13px] text-ink-500">Ersparnis ggü. Netzstrom</p>
            <p className="ov-num font-display text-[30px] font-extrabold leading-tight tracking-tight text-ov-600">{eur(ersparnisNetz)}</p>
          </div>
        </div>

        <ul className="mt-7 space-y-5">
          {zeilen.map((z) => (
            <li key={z.k}>
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="font-medium text-ink-700">{z.l}</span>
                <span className="ov-num whitespace-nowrap text-ink-500">
                  {z.ct.toLocaleString("de-DE", { maximumFractionDigits: 1 })} ct/kWh ·{" "}
                  <strong className="font-display text-[16px] font-extrabold text-ink-900">{eur(z.eur)}</strong>
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink-100">
                <div className={`h-full rounded-full ${z.farbe} transition-all duration-700`} style={{ width: `${Math.round((z.eur / max) * 1000) / 10}%` }} />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 rounded-2xl bg-ov-50 p-4 text-[14px] leading-relaxed text-ink-700">
          Gegenüber der öffentlichen Ladesäule sparen Sie rund <strong className="ov-num text-ink-900">{eur(ersparnisOeff)}</strong> im Jahr. Ihre Ladekosten liegen damit bei{" "}
          <strong className="ov-num text-ink-900">{((zeilen[2].eur / kmJahr) * 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong> je 100 km.
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] leading-snug text-ink-500">
            Orientierung, kein Angebot: Netzstrom {NETZ_CT} ct, Solarstrom {SOLAR_CT.toLocaleString("de-DE")} ct (entgangener Marktpreis bei Einspeisung), öffentlich {OEFFENTLICH_CT} ct je kWh · Richtwerte Österreich, Stand 2026
          </p>
          <Link href="/rechner/wallbox" className="group inline-flex h-11 shrink-0 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Ausführlich rechnen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
