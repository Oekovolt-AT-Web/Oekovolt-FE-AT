// src/components/GewerbeUnikat/K7Wirtschaftlichkeit.js
//
// K7 · „Wirtschaftlichkeit: Amortisation, Öko-IFB 22 % und EAG-Förderung – mit Rechenweg“ (Pult und
// Stresstest). SERVER-KOMPONENTE (Hülle): Kopf, Bühne als Insel (SSR-Platzhalter = derselbe Aufbau im
// Startzustand: Rechenweg-Tabelle als echtes HTML mit Caption und Fußtext wörtlich, Saldo, Prüfstand,
// Fächer als SVG mit Tabelle), Wissensschublade „Steuer, Förderung und Annahmen“, die fünf Einwände im
// Wortlaut und der Kapitel-Ausgang.
//
// Ton weiß, Anker #wirtschaftlichkeit (Rechenweg zusätzlich #beispielrechnung), data-kapitel="k7".
// Konzept: docs/projekt-doku/anhang/wellen/GEWERBE-UNIKAT.md, Abschnitt K7.
// Server importiert nur _tokens, _beispiel, _bausteine, _server und reine K7-Dateien.

import Link from "next/link";
import { einwaendeFuer } from "@/data/einwaende";
import { ANNAHMEN } from "@/data/solarrechner";
import { standortGruppen } from "@/components/RechnerGewerbe/standorte";
import { eagKategorie, spezifischerErtrag } from "@/lib/rechner/gewerbepv";
import { NETZBEREICHE, NETZ_QUELLE, netzpreise } from "@/lib/rechner/peakshaving";
import { beispielServer } from "./_server.js";
import { BEISPIEL } from "./_beispiel.js";
import { DatenTabelle, KapitelBuehne, KapitelKopf, Kennzeichnung, QuellePille, Wissensschublade } from "./_bausteine.js";
import { KENNZEICHNUNG, STAND, zahl } from "./_tokens.js";
import K7Ansicht, {
  AnsichtTabs,
  Dock,
  FaecherBereich,
  FaecherTabelle,
  FeldRegler,
  Lesespalte,
  MappePlatzhalter,
  MappeRahmen,
  Pruefstand,
  ReglerInhalt,
  Saldo,
  UnterTabelle,
  Warte,
  faecherAnnahmen,
  modellUnterzeile,
} from "./K7Ansicht.js";
import K7Tabelle, { TABELLE_FUSS } from "./K7Tabelle.js";
import { FAECHER, FaecherSvg, faecherGeo, faecherPfade } from "./K7Faecher.js";
import { GRENZEN, MODELL_START, PRUEFUNGEN, euro10, euro100, jahre1, pultRechnen, pultStart, richtwertInvest, tsd } from "./K7Rechnen.js";
import { MODELL_ANNAHMEN, dachartLabel, modellRechnen } from "./K7Modell.js";
import { Ableseleiste } from "./K7Regler.js";
import { KurveStatisch } from "./K7Kurve.js";
import K7Insel from "./K7Insel.js";
import K7Ausgang from "./K7Ausgang.js";

const LINK = "font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900";
const klemmen = (v, g) => Math.min(g.max, Math.max(g.min, v));

/** Netztabelle (je Bereich: Label, Betreiber, AP/NV je Netzebene) – jede Zahl über netzpreise(). */
const NETZ = Object.fromEntries(
  NETZBEREICHE.map((b) => [
    b.id,
    {
      label: b.label,
      betreiber: b.betreiber,
      ne: Object.fromEntries(
        [5, 6, 7].map((n) => {
          const x = netzpreise(b.id, n);
          return [n, { ap: x.ap, nv: x.nv }];
        })
      ),
    },
  ])
);

/** Ortsliste (PVGIS je Ort) als Prop – nur die Zahlen, die das Stundenmodell braucht. */
const ORTE = Object.fromEntries(
  standortGruppen().flatMap((g) => g.orte.map((o) => [o.slug, { name: o.name, landName: o.landName, sued35: o.sued35, ostwest15: o.ostwest15, flach10: o.flach10 }]))
);

const QUELLE_NETZ = { name: NETZ_QUELLE.name, url: NETZ_QUELLE.url };
const EINWAND_IDS = PRUEFUNGEN.map((x) => x.id);

let cache = null;
function startWerte() {
  if (cache) return cache;
  const p = pultStart(true);
  const r = pultRechnen(p, NETZ);
  const modell = modellRechnen(
    {
      kwp: p.kwp,
      ...MODELL_START,
      ortId: ORTE[MODELL_START.ortId] ? MODELL_START.ortId : Object.keys(ORTE)[0],
      arbeitspreisCt: Math.round(r.vermiedenCt * 1000) / 1000,
      einspeiseCt: p.ueberschussCt,
      eag: p.eagKwp > 0,
    },
    ORTE
  );
  const emp = beispielServer().kennzahlen.pv?.empfehlung ?? { kwp: 280, evQuote: 0.8 };
  const empfehlung = { kwp: emp.kwp, evQuote: emp.evQuote };
  const ort = ORTE[modell.ortId];
  const dach = dachartLabel(MODELL_START.dachart);
  const quellen = {
    k3Kwp: klemmen(Math.round(empfehlung.kwp / 5) * 5, GRENZEN.kwp),
    k3Ev: klemmen(Math.round(empfehlung.evQuote * 100) / 100, GRENZEN.evQuote),
    k2Ertrag: klemmen(spezifischerErtrag(MODELL_START.dachart, ort), GRENZEN.ertragKwhKwp),
    k2Label: `${ort.name}, ${dach.kurz}`,
    k4Energie: null,
    k4Netz: null,
  };
  const einwaende = einwaendeFuer("gewerbe", EINWAND_IDS).map((e) => ({ id: e.id, einwand: e.einwand, antwort: e.antwort, beleg: e.beleg, belegHref: e.belegHref, schritt: e.schritt }));
  cache = { p, r, modell, empfehlung, quellen, einwaende, info: { ortName: ort.name, dachart: dach.kurz, verbrauchKwh: MODELL_START.verbrauchKwh, schichten: MODELL_START.schichten } };
  return cache;
}

/**
 * Fächer im Startzustand – nur die Desktop-Fassung: Mobil steht im Startzustand die Ansicht „Rechenweg“, der
 * Stresstest ist dort verborgen (K7Ansicht, max-md:hidden); die Bühne zeichnet die mobile Fassung erst beim
 * Wechsel auf „Stresstest“. Spart ≈ 10 KB HTML und ebenso viel RSC-Payload (Jury 13.10.2026).
 */
function FaecherStatisch({ modell }) {
  const label = `Fächer des kumulierten Cashflows über 25 Jahre: konservativ ${tsd(modell.reihen.k[25])}, erwartet ${tsd(modell.reihen.e[25])}, günstig ${tsd(modell.reihen.g[25])} Tausend Euro nach 25 Jahren.`;
  return (
    <>
      {[{ g: FAECHER.desktop, klasse: "max-md:hidden" }].map(({ g, klasse }) => {
        const geo = faecherGeo(modell.reihen, modell.amort, g);
        return (
          <div key={klasse} className={`relative w-full ${klasse}`} style={{ aspectRatio: `${g.w} / ${g.h}` }}>
            <FaecherSvg geo={geo} pfade={faecherPfade(geo)} role="img" aria-label={label} />
          </div>
        );
      })}
    </>
  );
}

export default function K7Wirtschaftlichkeit() {
  const { p, r, modell, empfehlung, quellen, einwaende, info } = startWerte();
  const richtwert = richtwertInvest(p.kwp);
  const eagText = eagKategorie(p.kwp).text;
  const kat = Object.fromEntries(ANNAHMEN.eagInvestitionszuschuss.kategorien.map((k) => [k.id, k.eurProKwp]));
  const statisch = (gruppe) => <ReglerInhalt gruppe={gruppe} p={p} r={r} start={p} quellen={quellen} richtwert={richtwert} eagText={eagText} />;
  const konservativ = modell.laeufe.find((l) => l.id === "konservativ");
  const erwartet = modell.laeufe.find((l) => l.id === "erwartet");

  // SSR-Platzhalter = Startzustand der Bühne (gleiche Bausteine → kein Layout-Sprung)
  const platzhalter = (
    <K7Ansicht
      tabs={
        <div inert>
          <AnsichtTabs ansicht="rechenweg" />
        </div>
      }
      saldo={<Saldo r={r} r0={r} geaendert={false} uebernehmenText="Werte aus Kapitel 02–03 übernehmen" kurve={<KurveStatisch r={r} r0={r} />} />}
      tabelle={
        <K7Tabelle
          r={r}
          p={p}
          geaendert={new Set()}
          offen="anlage"
          reglerZeile={(gruppe) =>
            gruppe === "anlage" ? (
              <tr className="max-md:hidden">
                <td colSpan={3} className="p-0">
                  <div className="bg-sand-50 px-4 pb-5 pt-4 md:px-5" inert>
                    {statisch("anlage")}
                  </div>
                </td>
              </tr>
            ) : null
          }
        />
      }
      unterTabelle={<UnterTabelle fuss={TABELLE_FUSS} geaendert={false} quelleNetz={QUELLE_NETZ} />}
      dock={
        <div inert>
          <Dock feld="kwp" inhalt={<FeldRegler feld="kwp" p={p} r={r} start={p} quellen={quellen} richtwert={richtwert} eagText={eagText} kompakt />} r={r} />
        </div>
      }
      pruefstand={<Pruefstand />}
      warte={<Warte monate={0} jahr={r.jahr} mobilZu />}
      weiter={
        <span className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-ink-100 px-5 text-left text-[14px] font-semibold text-ink-900">
          Weiter: Stresstest über 25 Jahre
          <span aria-hidden="true">→</span>
        </span>
      }
      faecher={
        <FaecherBereich
          unterzeile={modellUnterzeile(modell, info)}
          annahmen={faecherAnnahmen(MODELL_ANNAHMEN)}
          grafik={<FaecherStatisch modell={modell} />}
          leiste={<Ableseleiste jahr={25} />}
          lese={<Lesespalte mod={modell} jahr={null} />}
          unten={<FaecherTabelle mod={modell} />}
        />
      }
      mappe={<MappeRahmen kinder={<MappePlatzhalter />} />}
    />
  );

  return (
    <KapitelBuehne id="k7" anker="wirtschaftlichkeit" ton="hell">
      <KapitelKopf
        form="spalte"
        nummer="07"
        frage="Finanzen fragt: Hält die Rechnung auch im schlechten Fall?"
        titel="Wirtschaftlichkeit: Amortisation, Öko-IFB 22 % und EAG-Förderung – mit Rechenweg"
        lead={
          <>
            <span className="md:hidden">Der Rechenweg als Pult – und der schlechte Fall gleich daneben.</span>
            <span className="max-md:hidden">
              Die Beispielrechnung als Pult: Jede Annahme ist verstellbar, jede Zeile nachrechenbar – und der schlechte Fall steht gleich daneben.
            </span>
          </>
        }
      />

      <div className="mt-8 md:mt-14">
        <K7Insel
          platzhalter={platzhalter}
          netz={NETZ}
          orte={ORTE}
          start={{ empfehlung, modell }}
          einwaende={einwaende}
          quelleNetz={QUELLE_NETZ}
        />
      </div>

      <div className="mt-6 grid gap-3 md:mt-14">
        <Wissensschublade titel="Steuer, Förderung und Annahmen" id="steuer-foerderung">
          <div className="max-w-[68ch] space-y-4">
            <p>
              <strong className="text-ink-900">Steuerlich</strong> gilt die Anlage als abnutzbares Wirtschaftsgut mit linearer oder degressiver
              Abschreibung über die Nutzungsdauer. Für Anschaffungen von November 2025 bis 31. Dezember 2026 ist der ökologische
              Investitionsfreibetrag auf 22 % erhöht (ab 2027 wieder 15 %); begünstigt sind neben PV-Anlagen auch Stromspeicher, E-Ladestationen und
              emissionsfreie Fahrzeuge. Die Bemessungsgrundlage beträgt höchstens 1 Mio. Euro je Wirtschaftsjahr, die Behaltedauer vier Jahre;
              maßgeblich ist die Anschaffung bzw. Übergabe, nicht die Bestellung. Im Rechenbeispiel wirkt der Freibetrag mit 23 %
              Körperschaftsteuer: <span className="ov-num whitespace-nowrap">{euro100(r.investition)} €</span> ×{" "}
              <span className="ov-num">22 %</span> × <span className="ov-num">23 %</span> ≈{" "}
              <span className="ov-num whitespace-nowrap font-semibold text-ink-900">{euro100(r.ifbWirkung)} €</span> Steuerwirkung; mit 15 % wären es{" "}
              <span className="ov-num whitespace-nowrap">≈ {euro100(r.ifbWirkung - r.ifbFakt)} €</span>. Details im Ratgeber{" "}
              <Link href="/ratgeber/investitionsfreibetrag-photovoltaik" className={LINK}>
                Investitionsfreibetrag für Photovoltaik
              </Link>{" "}
              und unter{" "}
              <Link href="/forderungen/steuerlich" className={LINK}>
                steuerliche Vorteile
              </Link>
              .
            </p>
            <p>
              <strong className="text-ink-900">Förderung:</strong> Der{" "}
              <Link href="/ratgeber/eag-investitionszuschuss" className={LINK}>
                EAG-Investitionszuschuss
              </Link>{" "}
              fördert 2026 Anlagen bis 1.000 kWp; in den Kategorien C und D wird nach dem beantragten Fördersatz gereiht, maximal{" "}
              <span className="ov-num">{kat.C}</span> bzw. <span className="ov-num">{kat.D}</span> € je kWp. Wer weniger beantragt, wird besser
              gereiht – und erhält weniger. Vergeben wird nur im Fördercall nach Budget, ein Rechtsanspruch besteht nicht; der Antrag muss vor der
              Inbetriebnahme gestellt sein (Termine auf der Seite{" "}
              <Link href="/forderungen/eag-foerdercall" className={LINK}>
                EAG-Fördercall
              </Link>
              ). Speicher fördert der Zuschuss mit <span className="ov-num">{ANNAHMEN.eagInvestitionszuschuss.speicherEurProKwh} €</span> je kWh
              bis <span className="ov-num">{ANNAHMEN.eagInvestitionszuschuss.speicherMaxKwh} kWh</span>, ab{" "}
              <span className="ov-num">{zahl(ANNAHMEN.eagInvestitionszuschuss.speicherMinKwhJeKwp, 1)} kWh</span> je kWp. Anlagen über 10 kWp können
              alternativ an den Ausschreibungen für die Marktprämie teilnehmen (Höchstpreis 2026: 7,77 ct/kWh).
            </p>
            <p className="font-semibold text-ink-900">Förderungen können die Bemessungsgrundlage des IFB mindern – bitte mit der Steuerberatung abstimmen.</p>
            <p>
              <strong className="text-ink-900">Planbarkeit:</strong> Ein großer Teil der Stromkosten ist für 25 Jahre und mehr kalkulierbar –
              unabhängig vom Spotpreis. Wer nicht aus der Liquidität investiert, vergleicht Kauf, Kredit und Leasing im{" "}
              <Link href="/rechner/finanzierung" className={LINK}>
                Finanzierungsrechner
              </Link>
              ; Rendite und Cashflow je Eingabe rechnet der{" "}
              <Link href="/rechner/gewerbe-pv" className={LINK}>
                Gewerbe-PV-Rechner
              </Link>
              .
            </p>
          </div>

          <DatenTabelle
            className="mt-6"
            caption={`Annahmen des Rechenbeispiels (${BEISPIEL.kwp} kWp, Netzebene ${BEISPIEL.ne}, Oberösterreich) – ${STAND.werte}`}
            spalten={[
              { key: "annahme", label: "Annahme" },
              { key: "wert", label: "Wert", rechts: true },
              { key: "quelle", label: "Herkunft" },
            ]}
            zeilen={[
              { annahme: "Spezifischer Ertrag", wert: `${zahl(BEISPIEL.ertragKwhKwp)} kWh/kWp`, quelle: `${BEISPIEL.ort}, Richtwert nach PVGIS` },
              { annahme: "Eigenverbrauch", wert: `${zahl(BEISPIEL.evQuote * 100)} %`, quelle: "Zweischichtbetrieb, Annahme" },
              { annahme: "Energiepreis Liefervertrag", wert: `${zahl(BEISPIEL.energieCt, 2)} ct/kWh`, quelle: "netto, Annahme" },
              { annahme: "Netznutzung + Netzverlust", wert: `${zahl(BEISPIEL.netzApCt, 2)} + ${zahl(BEISPIEL.netzverlustCt, 3)} ct/kWh`, quelle: "SNE-V-Novelle 2026, NE 6 OÖ" },
              { annahme: "Elektrizitätsabgabe", wert: `${zahl(BEISPIEL.abgabeCt, 2)} ct/kWh`, quelle: "Unternehmen 2026 befristet, regulär 1,5 ct" },
              { annahme: "Überschusserlös", wert: `${zahl(BEISPIEL.ueberschussCt, 1)} ct/kWh`, quelle: "Rechensatz, konstant" },
              { annahme: "Betrieb, Wartung, Versicherung", wert: `${zahl(BEISPIEL.betriebAnteil * 100, 1)} %/Jahr`, quelle: "der Investition" },
              { annahme: "Investition", wert: `${zahl(BEISPIEL.investKwp)} €/kWp`, quelle: `Marktannahme; Richtwert Marktstatistik ${zahl(richtwert)} €/kWp` },
              { annahme: "EAG-Zuschuss", wert: `${zahl(BEISPIEL.eagKwp)} €/kWp`, quelle: `nur bei Zuschlag, Höchstsatz Kategorie D ${kat.D} €/kWp` },
              { annahme: "Öko-IFB", wert: "22 %", quelle: "Übergabe bis 31.12.2026, KöSt 23 %" },
            ]}
          />

          <div className="mt-6 max-w-[68ch] space-y-4">
            <p>
              <strong className="text-ink-900">Zwei Sichten, offen benannt.</strong> Der Rechenweg oben ist statisch: ein Jahr, feste Preise, keine
              Alterung – nachrechenbar mit dem Taschenrechner. Der Fächer rechnet das Stundenmodell des Gewerbe-PV-Rechners (8.760 Stunden,
              PVGIS-Ertrag für {info.ortName}, Lastprofil nach Schichten) über {MODELL_ANNAHMEN.jahre} Jahre: mit{" "}
              {zahl(MODELL_ANNAHMEN.degradation * 100, 1)} % Modulalterung und {zahl(MODELL_ANNAHMEN.preissteigerung * 100)} % Preissteigerung pro
              Jahr, Betriebskosten +{zahl(MODELL_ANNAHMEN.betriebskostenSteigerung * 100)} % und der Investition laut Marktstatistik-Richtwert. Im
              erwarteten Fall amortisiert sich das Modell nach{" "}
              <span className="ov-num whitespace-nowrap">{jahre1(erwartet?.amortisation)} Jahren</span>, im konservativen Fall (Strompreis und
              Einspeiseerlös −30 %, Ertrag −10 %, keine Preissteigerung) nach{" "}
              <span className="ov-num whitespace-nowrap">{jahre1(konservativ?.amortisation)} Jahren</span>.
            </p>
            <p>
              <strong className="text-ink-900">Nicht enthalten</strong> sind der Leistungspreiseffekt (wie ein Speicher die teuerste Viertelstunde
              senkt, zeigt{" "}
              <a href="#leistungspreis" className={LINK}>
                Kapitel 05
              </a>
              ), Finanzierungskosten und Steuern auf den Ertrag. Mit Ihrem Lastgang, Ihrer Netzrechnung und Ihrem Liefervertrag wird aus dem Beispiel
              Ihre Rechnung.
            </p>
            <div className="flex flex-wrap gap-2">
              <QuellePille>
                Investition: Marktentwicklung 2024 (BMIMI) und IEA PVPS Austria 2024 · {STAND.werte} · Richtwert
              </QuellePille>
              <QuellePille>
                EAG-IZV 2026, BGBl. II Nr. 12/2026 · {STAND.werte}
              </QuellePille>
              <QuellePille>
                <a href="https://www.wko.at/steuern/investitionsfreibetrag" target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                  IFB laut WKO
                </a>{" "}
                · Stand 10/2026
              </QuellePille>
            </div>
            <Kennzeichnung>{KENNZEICHNUNG.keineBeratung}</Kennzeichnung>
          </div>
        </Wissensschublade>

        <Wissensschublade
          titel={
            <>
              <span className="md:hidden">Einwände und Antworten</span>
              <span className="max-md:hidden">Fünf Einwände – und was wir antworten</span>
            </>
          }
          id="einwaende-wirtschaftlichkeit"
        >
          <div className="max-w-[72ch] space-y-2">
            {einwaende.map((e) => (
              <details key={e.id} className="group/e rounded-2xl bg-white/70">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-2 font-semibold text-ink-900 hover:bg-white [&::-webkit-details-marker]:hidden">
                  <span>„{e.einwand}“</span>
                  <span aria-hidden="true" className="text-ov-700 transition-transform duration-300 group-open/e:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-1">
                  <p>{e.antwort}</p>
                  <p className="mt-2 text-[14px] text-ink-600">
                    <strong className="text-ink-900">Beleg:</strong> {e.beleg}
                  </p>
                  <p className="mt-3">
                    <Link
                      href={e.schritt.href}
                      className="inline-flex min-h-11 items-center rounded-full bg-ink-100 px-4 text-[14px] font-semibold text-ink-900 transition-colors hover:bg-ink-200"
                    >
                      {e.schritt.label} →
                    </Link>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Wissensschublade>
      </div>

      <K7Ausgang />
    </KapitelBuehne>
  );
}
