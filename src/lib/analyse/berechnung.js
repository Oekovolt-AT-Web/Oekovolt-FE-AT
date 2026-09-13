// Aufbereitung der PV-Analyse für das PDF – nutzt exakt den Rechenkern des Solarrechners.

import { berechne, empfohlenerSpeicher } from "@/lib/solarrechner";
import { ANNAHMEN, AUSRICHTUNGEN, NEIGUNGEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";
import { MONATE, PV_MONAT, HAUSHALT_MONAT } from "@/lib/rechner/profile";

const zahl = (v, min, max, standard) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : standard;
};

/** Eingaben aus dem Browser prüfen und begrenzen. */
export function eingabenPruefen(e = {}) {
  return {
    kwp: Math.round(zahl(e.kwp, 1, 100, 10) * 10) / 10,
    ausrichtung: AUSRICHTUNGEN.some((a) => a.id === e.ausrichtung) ? e.ausrichtung : "sued",
    neigung: NEIGUNGEN.some((n) => n.id === e.neigung) ? e.neigung : "mittel",
    verbrauch: Math.round(zahl(e.verbrauch, 500, 200000, 4500)),
    speicherKwh: Math.round(zahl(e.speicherKwh, 0, 200, 0) * 10) / 10,
    preissteigerung: zahl(e.preissteigerung, 0, 0.08, ANNAHMEN.strompreisSteigerung),
  };
}

export function analyse(eingaben) {
  const e = eingabenPruefen(eingaben);
  const r = berechne(e);
  const ohneSpeicher = e.speicherKwh > 0 ? berechne({ ...e, speicherKwh: 0 }) : r;
  const mitEmpfehlung = e.speicherKwh > 0 ? r : berechne({ ...e, speicherKwh: empfohlenerSpeicher(e.verbrauch) });

  const monate = MONATE.map((m, i) => {
    const pv = r.jahresertrag * PV_MONAT[i];
    const bedarf = e.verbrauch * HAUSHALT_MONAT[i];
    return { monat: m, pv, bedarf };
  });

  const szenarien = [0, 0.02, 0.04].map((s) => {
    const x = berechne({ ...e, preissteigerung: s });
    return { steigerung: s, amortisation: x.amortisationJahre, ertrag20: x.ertrag20Jahre };
  });

  return {
    eingaben: e,
    ergebnis: r,
    vergleich: {
      ohneSpeicher: { autarkie: ohneSpeicher.autarkie, investition: ohneSpeicher.investition, amortisation: ohneSpeicher.amortisationJahre, ertrag20: ohneSpeicher.ertrag20Jahre },
      mitSpeicher: { kwh: e.speicherKwh || empfohlenerSpeicher(e.verbrauch), autarkie: mitEmpfehlung.autarkie, investition: mitEmpfehlung.investition, amortisation: mitEmpfehlung.amortisationJahre, ertrag20: mitEmpfehlung.ertrag20Jahre },
    },
    monate,
    szenarien,
    labels: {
      ausrichtung: AUSRICHTUNGEN.find((a) => a.id === e.ausrichtung)?.label,
      neigung: NEIGUNGEN.find((n) => n.id === e.neigung)?.label,
    },
    annahmen: {
      strompreis: ANNAHMEN.strompreis,
      ertragProKwpSued: ANNAHMEN.ertragProKwpSued,
      degradation: ANNAHMEN.degradationProJahr,
      betriebskostenProKwp: ANNAHMEN.betriebskostenProKwp,
      speicherPreisProKwh: ANNAHMEN.speicherPreisProKwh,
      garantieJahre: VERGUETUNG.garantieJahre,
      verguetungStand: VERGUETUNG.stand || VERGUETUNG.gueltigAb || "",
    },
  };
}
