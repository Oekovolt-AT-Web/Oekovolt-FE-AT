"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderPlus, Info } from "lucide-react";
import { Kennzahl } from "@/components/Rechner/bausteine";
import { Zahlfeld } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { FINANZIERUNG } from "@/lib/rechner/finanzierung";
import { MODELLVERGLEICH, STAND_MODELLVERGLEICH, euro, rechneModellvergleich } from "@/lib/rechner/modellvergleich";
import ZumDossierKnopf from "./ZumDossierKnopf";
import { ModellTabelle } from "./DossierAuswertung";

/**
 * „Kaufen, leasen oder pachten? Neutral gerechnet“ – interaktiver Modellvergleich für
 * /service/finanzierung (Lead-Gate Stufe 1: Ergebnis auf dem Bildschirm frei, keine Downloads).
 * Sechs Modelle für dieselbe Anlage, Eingaben statt Anbieterwerten, keine Anbieternamen.
 */

const START = {
  kwp: FINANZIERUNG.kwp,
  eigenverbrauch: Math.round(FINANZIERUNG.eigenverbrauchsquote * 100),
  strompreisCt: FINANZIERUNG.strompreisCt,
  kreditZins: FINANZIERUNG.kredit.zins * 100,
  leasingFaktor: FINANZIERUNG.leasing.faktor,
  contractingCt: FINANZIERUNG.contracting.preisCt,
  ppaCt: FINANZIERUNG.ppa.preisCt,
  pacht: MODELLVERGLEICH.pacht.eurProKwpJahr,
};

export default function ModellvergleichInteraktiv() {
  const [w, setW] = useState(START);
  const set = (k) => (v) => setW((x) => ({ ...x, [k]: v }));

  const r = useMemo(
    () =>
      rechneModellvergleich({
        kwp: w.kwp,
        eigenverbrauchsquote: w.eigenverbrauch / 100,
        strompreisCt: w.strompreisCt,
        kredit: { zins: w.kreditZins / 100 },
        leasing: { faktor: w.leasingFaktor },
        contracting: { preisCt: w.contractingCt },
        ppa: { preisCt: w.ppaCt },
        pacht: { eurProKwpJahr: w.pacht },
      }),
    [w]
  );

  const bester = r.modelle.find((m) => m.id === r.besterId);
  const ohneInvestition = r.modelle.filter((m) => m.eigenkapital <= 0);
  const besterOhne = ohneInvestition.reduce((a, b) => (b.kapitalwert > a.kapitalwert ? b : a), ohneInvestition[0]);

  const dossierEintrag = () => ({
    id: "modellvergleich",
    quelle: "/service/finanzierung",
    titel: `Modellvergleich ${w.kwp} kWp`,
    art: "modellvergleich",
    kennzahlen: r.modelle.map((m) => ({ label: `Kapitalwert ${m.kurz}`, wert: euro(m.kapitalwert) })),
    annahmen: [
      ["Anlage", `${w.kwp} kWp, Eigenverbrauch ${w.eigenverbrauch} %, Strompreis ${w.strompreisCt} ct/kWh`],
      ["Beispielkonditionen", `Kredit ${w.kreditZins} %, Leasingfaktor ${w.leasingFaktor} %/Monat, Contracting ${w.contractingCt} ct, PPA ${w.ppaCt} ct, Pacht ${w.pacht} €/kWp`],
      `Betrachtung ${r.jahre} Jahre, Kalkulationszins ${Math.round(r.basis.kalkulationszins * 1000) / 10} % – Richtwert/Orientierung, keine Finanzberatung.`,
    ],
    stand: STAND_MODELLVERGLEICH.label,
    eingaben: { kwp: w.kwp, eigenverbrauchsquote: w.eigenverbrauch / 100, strompreisCt: w.strompreisCt, kreditZins: w.kreditZins / 100 },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-7">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Ihre Anlage</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Zahlfeld label="Anlagenleistung" wert={w.kwp} onChange={set("kwp")} einheit="kWp" min={10} max={5000} step={10} />
          <Zahlfeld label="Eigenverbrauchsquote" wert={w.eigenverbrauch} onChange={set("eigenverbrauch")} einheit="%" min={0} max={100} step={1} />
          <Zahlfeld label="Vermiedener Strompreis netto" wert={w.strompreisCt} onChange={set("strompreisCt")} einheit="ct/kWh" min={3} max={60} step={0.5} />
        </div>
        <p className="mt-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Konditionen aus Ihren Angeboten (Beispielwerte, keine Anbieterwerte)</p>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Zahlfeld label="Kreditzins" wert={w.kreditZins} onChange={set("kreditZins")} einheit="% p. a." min={0} max={15} step={0.25} />
          <Zahlfeld label="Leasingfaktor" wert={w.leasingFaktor} onChange={set("leasingFaktor")} einheit="%/Mon." min={0.5} max={2} step={0.05} />
          <Zahlfeld label="Contracting-Preis" wert={w.contractingCt} onChange={set("contractingCt")} einheit="ct/kWh" min={0} max={40} step={0.5} />
          <Zahlfeld label="PPA-Preis" wert={w.ppaCt} onChange={set("ppaCt")} einheit="ct/kWh" min={0} max={40} step={0.5} />
          <Zahlfeld label="Dachpacht" wert={w.pacht} onChange={set("pacht")} einheit="€/kWp·a" min={0} max={40} step={0.5} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kennzahl ton="gruen" label="Höchster Kapitalwert" zusatz={`${bester.name}, ${r.jahre} Jahre`}>
          {euro(bester.kapitalwert)}
        </Kennzahl>
        <Kennzahl ton="sand" label="Bestes Modell ohne Investition" zusatz={besterOhne ? besterOhne.name : "–"}>
          {besterOhne ? euro(besterOhne.kapitalwert) : "–"}
        </Kennzahl>
        <Kennzahl ton="sand" label="Investition bei Kauf (Richtwert)" zusatz="netto, Marktstatistik 2024">
          {euro(r.basis.investition)}
        </Kennzahl>
      </div>

      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-7">
        <ModellTabelle modell={r} />
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-white/70 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <p className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-600">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
          <span>
            Richtwerte zur Orientierung, Stand {STAND_MODELLVERGLEICH.label} – keine Steuer- oder Finanzberatung. Ökovolt nennt hier weder Anbieter noch eigene Finanzierungs-, Contracting- oder Pachtangebote. Kapitalwert und Liquidität
            ersetzen Sie mit echten Angeboten; Bilanz- und Steuerwirkung klärt Ihre Steuerberatung.
          </span>
        </p>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ZumDossierKnopf eintrag={dossierEintrag} stand={JSON.stringify(w)} klein />
          <Link href="/dossier" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            <FolderPlus aria-hidden="true" className="h-4 w-4" /> Business-Case-Dossier <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
