// src/components/GewerbeUnikat/K7Tabelle.js
//
// K7 · Rechenweg-Tabelle (die Beispielrechnung als Instrument). REINE Komponente (keine Hooks, kein
// "use client"): Die Server-Hülle rendert sie im Startzustand (SSR, ohne JS lesbar, = bisherige
// Beispieltabelle), die Bühne (K7Pult) rendert DIESELBE Tabelle mit Live-Werten, klickbaren Annahme-Werten
// und – am Desktop – einer Regler-Zeile direkt unter der Zeile, deren Annahme gerade verstellt wird.
//
// Aufbau wie ein Rechenblatt: Haarlinien, tabellarische Ziffern, Zwischensumme mit Linie darüber, Ergebnis
// mit Doppelstrich darunter. Echte <table> mit caption, th scope="col"/"row". Mobil zwei Spalten
// (Position | Ergebnis), die Annahme steht als Unterzeile unter der Position.

import { Fragment } from "react";
import { eagKategorie } from "@/lib/rechner/gewerbepv";
import { cn } from "@/components/ui/cn";
import { zahl } from "./_tokens.js";
import { euro10, euro100, jahre1, pz } from "./K7Rechnen.js";

/** Fußtext der bisherigen Beispieltabelle – wörtlich. */
export const TABELLE_FUSS =
  "Beispiel, Stand 09/2026. Annahmen: Standort Innviertel (spezifischer Ertrag 1.050 kWh/kWp, Richtwert nach PVGIS), Netzebene 6 im Netzbereich Oberösterreich, Energiepreis 11 ct/kWh netto, Überschusserlös 6 ct/kWh, Investition 800 €/kWp netto (Marktannahme, kein Ökovolt-Preis), EAG-Zuschuss nur bei Zuschlag. Nicht enthalten: Leistungspreiseffekt, Degradation, Preissteigerungen, Finanzierung. Förderungen können die Bemessungsgrundlage des IFB mindern – bitte mit der Steuerberatung abstimmen.";

/** Caption: im Startzustand wörtlich wie bisher. */
export function tabellenCaption(p, istStart) {
  return istStart
    ? "Beispielrechnung Wirtschaftlichkeit einer 300-kWp-PV-Anlage auf Netzebene 6"
    : `Rechenweg Wirtschaftlichkeit einer ${zahl(p.kwp)}-kWp-PV-Anlage auf Netzebene ${p.ne} – mit Ihren Annahmen`;
}

/** ct-Wert mit 1 Stelle, wenn genau darstellbar, sonst 2. */
const ct = (v) => zahl(v, Math.abs(Math.round(v * 10) - v * 10) < 1e-6 ? 1 : 2);

/** Gruppen (Regler-Zeilen) und welche Felder dazugehören. */
export const GRUPPEN = {
  anlage: ["kwp", "ertragKwhKwp"],
  eigen: ["evQuote"],
  preis: ["energieCt", "abgabeCt", "netz"],
  erloes: ["ueberschussCt"],
  invest: ["investKwp"],
  eag: ["eagKwp"],
  ifb: ["ifbSatz"],
};
export const GRUPPE_VON = Object.fromEntries(Object.entries(GRUPPEN).flatMap(([g, felder]) => felder.map((f) => [f, g])));

const PILLE =
  "ov-num inline-flex min-h-[26px] items-center gap-1 rounded-md px-1.5 align-baseline text-[13px] font-semibold leading-none transition-colors duration-200 md:min-h-[30px] md:rounded-lg md:px-2 md:text-[14.5px]";

/** Statischer Wert (Server) – Live-Variante reicht die Bühne als `Wert` herein (gleitende Zahl). */
function WertStatisch({ wert, format }) {
  return <span className="ov-num">{format(wert)}</span>;
}

/**
 * @param {object} t
 * @param {object} t.r        Ergebnis von pultRechnen()
 * @param {object} t.p        Pult-Annahmen
 * @param {Set<string>} t.geaendert  Felder, die vom Rechenbeispiel abweichen
 * @param {string|null} [t.offen]    Gruppe, deren Regler-Zeile offen ist (Desktop)
 * @param {{ pille:(feld:string, e:any)=>void, fokus:(gruppe:string)=>void }} [t.aktionen]  nur Bühne
 * @param {(gruppe:string)=>any} [t.reglerZeile]  Regler-Zeile unter der Gruppe (Desktop)
 * @param {any} [t.Wert]      Komponente für Ergebniswerte ({ wert, format })
 * @param {boolean} [t.live]  testids und <output> nur in der Bühne
 */
export default function K7Tabelle({ r, p, geaendert, offen = null, aktionen, reglerZeile, Wert = WertStatisch, live = false, istStart = true }) {
  const an = (f) => geaendert.has(f);
  const zelleAn = (gruppe) => GRUPPEN[gruppe]?.some((f) => an(f));
  const kat = eagKategorie(p.kwp);

  /** Annahme-Wert als Knopf (Bühne) bzw. als gleich aussehender Text (Server). */
  const pille = (feld, text, label) => {
    const gruppe = GRUPPE_VON[feld];
    const aktiv = offen === gruppe;
    const klasse = cn(
      PILLE,
      aktiv ? "bg-navy-950 text-white" : an(feld) ? "bg-ov-100 text-ov-800 hover:bg-ov-200" : "bg-ink-100 text-ink-900 hover:bg-ink-200"
    );
    const symbol = (
      <svg aria-hidden="true" viewBox="0 0 10 12" className="h-[0.7em] w-[0.6em] opacity-60 max-md:hidden">
        <path d="M2 4.5 5 1.5l3 3M2 7.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    if (!aktionen)
      return (
        <span className={klasse}>
          {text}
          {symbol}
        </span>
      );
    return (
      <button
        type="button"
        className={cn(klasse, "cursor-pointer")}
        aria-expanded={aktiv}
        aria-controls={`k7-regler-${gruppe}`}
        aria-label={`${label}: ${text} – Annahme verstellen`}
        onClick={(e) => aktionen.pille(feld, e)}
        onFocus={() => aktionen.fokus(gruppe)}
      >
        {text}
        {symbol}
      </button>
    );
  };
  const nur = (feld, text) => <span className={cn("ov-num", an(feld) && "font-semibold text-ov-800")}>{text}</span>;

  const ueb = 1 - p.evQuote;
  const Z = [
    {
      id: "anlage",
      gruppe: "anlage",
      pos: "Anlage und Jahresertrag",
      annahme: (
        <>
          {pille("kwp", `${zahl(p.kwp)} kWp`, "Anlagengröße")} × {pille("ertragKwhKwp", `${zahl(p.ertragKwhKwp)} kWh/kWp`, "Spezifischer Ertrag")}
        </>
      ),
      wert: r.ertrag,
      format: (v) => `${zahl(Math.round(v))} kWh`,
    },
    {
      id: "eigen",
      gruppe: "eigen",
      pos: `Eigenverbrauch (${pz(p.evQuote)} %)`,
      annahme: <>{pille("evQuote", `${pz(p.evQuote)} %`, "Eigenverbrauch")} des Ertrags im Zweischichtbetrieb</>,
      kurz: <>{pille("evQuote", `${pz(p.evQuote)} %`, "Eigenverbrauch")} des Ertrags</>,
      wert: r.eigen,
      format: (v) => `${zahl(Math.round(v))} kWh`,
    },
    {
      id: "preis",
      gruppe: "preis",
      pos: "Vermiedene Kosten je kWh",
      annahme: (
        <>
          Energie {pille("energieCt", zahl(p.energieCt, 2), "Energiepreis in Cent je kWh")} + Netznutzung {nur("netz", zahl(r.netz.ap, 2))} + Netzverlust{" "}
          {nur("netz", zahl(r.netz.nv, 3))} + Elektrizitätsabgabe {pille("abgabeCt", zahl(p.abgabeCt, 2), "Elektrizitätsabgabe in Cent je kWh")} ct
        </>
      ),
      kurz: (
        <>
          Energie {pille("energieCt", zahl(p.energieCt, 2), "Energiepreis in Cent je kWh")} + Netz {nur("netz", `${zahl(r.netz.ap, 2)} + ${zahl(r.netz.nv, 3)}`)} + Abgabe{" "}
          {pille("abgabeCt", zahl(p.abgabeCt, 2), "Elektrizitätsabgabe in Cent je kWh")} ct
        </>
      ),
      wert: r.vermiedenCt,
      format: (v) => `${zahl(v, 2)} ct/kWh`,
    },
    {
      id: "ersparnis",
      pos: "Ersparnis Eigenverbrauch",
      annahme: (
        <span className="ov-num">
          {zahl(Math.round(r.eigen))} kWh × {zahl(r.vermiedenCt, 2)} ct
        </span>
      ),
      wert: r.ersparnis,
      format: (v) => `≈ ${euro10(v)} €/Jahr`,
    },
    {
      id: "erloes",
      gruppe: "erloes",
      pos: `Erlös Überschuss (${pz(ueb)} %)`,
      annahme: (
        <>
          <span className="ov-num">{zahl(Math.round(r.ueberschuss))} kWh</span> × {pille("ueberschussCt", `${ct(p.ueberschussCt)} ct`, "Überschusserlös")}
        </>
      ),
      wert: r.erloes,
      format: (v) => `≈ ${euro10(v)} €/Jahr`,
    },
    {
      id: "betrieb",
      pos: "Betrieb, Wartung, Versicherung",
      annahme: "1,5 % der Investition",
      wert: r.betrieb,
      format: (v) => `− ${euro10(v)} €/Jahr`,
    },
    {
      id: "jahr",
      pos: "Jährlicher Überschuss",
      annahme: "vor Steuern, ohne Leistungspreiseffekt",
      kurz: "vor Steuern, ohne Leistungspreis",
      wert: r.jahr,
      format: (v) => `≈ ${euro10(v)} €/Jahr`,
      summe: true,
      testid: "pult-jahr",
    },
    {
      id: "invest",
      gruppe: "invest",
      pos: "Investition",
      annahme: <>Annahme {pille("investKwp", `${zahl(p.investKwp)} €/kWp`, "Investition je kWp")} netto</>,
      wert: r.investitionBrutto,
      format: (v) => `${euro100(v)} €`,
      trenner: true,
    },
    {
      id: "eag",
      gruppe: "eag",
      pos: "EAG-Investitionszuschuss",
      annahme:
        p.eagKwp > 0 ? (
          <>
            Annahme: Zuschlag bei {pille("eagKwp", `${zahl(p.eagKwp)} €/kWp`, "EAG-Zuschuss je kWp")} (Kategorie {kat.id})
          </>
        ) : (
          <>Annahme: kein Zuschlag – {pille("eagKwp", "0 €/kWp", "EAG-Zuschuss je kWp")}</>
        ),
      kurz:
        p.eagKwp > 0 ? (
          <>
            Kat. {kat.id}, Zuschlag {pille("eagKwp", `${zahl(p.eagKwp)} €/kWp`, "EAG-Zuschuss je kWp")}
          </>
        ) : (
          <>kein Zuschlag {pille("eagKwp", "0 €/kWp", "EAG-Zuschuss je kWp")}</>
        ),
      wert: r.zuschuss,
      format: (v) => (v > 0 ? `− ${euro100(v)} €` : "0 €"),
    },
    {
      id: "amort",
      pos: "Statische Amortisation",
      annahme: (
        <span className="ov-num">
          {euro100(r.investition)} € ÷ {euro10(r.jahr)} €/Jahr
        </span>
      ),
      wert: r.amortisation ?? NaN,
      format: (v) => (r.amortisation == null ? "keine – Überschuss ≤ 0" : `≈ ${jahre1(v)} Jahre`),
      summe: true,
      testid: "pult-amortisation",
    },
    {
      id: "ifb",
      gruppe: "ifb",
      pos: (
        <>
          Öko-IFB<span className="max-md:hidden">
            {" "}
            {pz(p.ifbSatz)} % (Anschaffung {p.ifbSatz > 0.2 ? "bis 31.12.2026" : "ab 2027"})
          </span>
          <span className="md:hidden"> (KöSt 23 %)</span>
        </>
      ),
      kurz: (
        <>
          {pille("ifbSatz", `${pz(p.ifbSatz)} %`, "Satz des Öko-Investitionsfreibetrags")} Übergabe {p.ifbSatz > 0.2 ? "bis 31.12.2026" : "ab 2027"}
        </>
      ),
      annahme: (
        <>
          Freibetrag {pille("ifbSatz", `${pz(p.ifbSatz)} %`, "Satz des Öko-Investitionsfreibetrags")} auf <span className="ov-num">{euro100(Math.min(r.investition, 1_000_000))} €</span>,
          Körperschaftsteuer 23 %
        </>
      ),
      wert: r.ifbWirkung,
      format: (v) => `≈ ${euro100(v)} € Steuerwirkung`,
      trenner: true,
      testid: "pult-ifb",
    },
  ];

  return (
    <table data-testid={live ? "pult-tabelle" : undefined} className="w-full border-collapse text-left text-[14.5px] md:text-[15px]">
      <caption className="mb-4 text-left font-display text-[15px] font-bold leading-snug text-ink-900 md:text-[16px]">{tabellenCaption(p, istStart)}</caption>
      <thead>
        <tr className="text-[12px] uppercase tracking-[0.12em] text-ink-500">
          <th scope="col" className="w-[61%] pb-2 pr-2 font-semibold md:w-[30%] md:pr-3">
            Position
          </th>
          <th scope="col" className="pb-2 pr-3 font-semibold max-md:hidden">
            Annahme / Rechnung
          </th>
          <th scope="col" className="w-[39%] pb-2 text-right font-semibold md:w-[21%]">
            Ergebnis
          </th>
        </tr>
      </thead>
      <tbody>
        {Z.map((z) => {
          const markiert = z.gruppe && zelleAn(z.gruppe);
          const aktiv = z.gruppe && offen === z.gruppe;
          const ergebnis = <Wert wert={z.wert} format={z.format} />;
          return (
            <Fragment key={z.id}>
            <tr
              data-zeile={z.id}
              className={cn(
                "align-top",
                z.summe ? "border-t border-ink-900/60" : z.trenner ? "border-t border-ink-900/20" : "border-t border-ink-900/[0.08]"
              )}
            >
              <th scope="row" className={cn("py-2 pr-2 text-[14px] font-medium text-ink-900 md:py-3 md:pr-3 md:text-[15px]", z.summe && "font-bold", aktiv && "md:bg-sand-50")}>
                <span className="block leading-snug">{z.pos}</span>
                {/* Mobil: Annahme als Unterzeile (Kurzform, wo die volle Form umbricht) */}
                <span className={cn("-mx-1.5 mt-1 block rounded-lg px-1.5 text-[12.5px] font-normal leading-[1.85] text-ink-600 transition-colors duration-300 md:hidden", markiert && "bg-ov-50 text-ink-700")}>{z.kurz ?? z.annahme}</span>
              </th>
              <td
                className={cn(
                  "py-3 pr-3 leading-[1.9] text-ink-600 transition-colors duration-300 max-md:hidden",
                  markiert ? "bg-ov-50" : aktiv ? "bg-sand-50" : null,
                  markiert && "text-ink-700",
                  aktionen && z.gruppe && "cursor-pointer",
                  aktionen && z.gruppe && !markiert && !aktiv && "hover:bg-sand-50/70"
                )}
                // Klick in die Zelle (neben die Werte) öffnet ebenfalls die Regler-Zeile – die Tastatur nutzt die Wert-Knöpfe
                onClick={aktionen && z.gruppe ? (e) => !e.target.closest("button,a") && aktionen.fokus(z.gruppe) : undefined}
              >
                {z.annahme}
              </td>
              <td className={cn("py-2 text-right align-top md:py-3", aktiv && "md:bg-sand-50")}>
                {live ? (
                  <output
                    aria-live="off"
                    data-testid={z.testid}
                    className={cn(
                      "ov-num inline-block font-display font-bold leading-snug text-ink-900",
                      z.summe ? "border-b-[3px] border-double border-ink-900/70 pb-0.5 text-[16px] font-extrabold md:text-[18px]" : "text-[14.5px] md:text-[15.5px]"
                    )}
                  >
                    {ergebnis}
                  </output>
                ) : (
                  <span
                    className={cn(
                      "ov-num inline-block font-display font-bold leading-snug text-ink-900",
                      z.summe ? "border-b-[3px] border-double border-ink-900/70 pb-0.5 text-[16px] font-extrabold md:text-[18px]" : "text-[14.5px] md:text-[15.5px]"
                    )}
                  >
                    {ergebnis}
                  </span>
                )}
              </td>
            </tr>
            {z.gruppe && reglerZeile ? reglerZeile(z.gruppe, z.id) : null}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
