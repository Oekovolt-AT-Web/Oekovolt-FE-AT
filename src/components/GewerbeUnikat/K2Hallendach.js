// src/components/GewerbeUnikat/K2Hallendach.js
//
// K2 · Dach-Labor · „Hallendach und Flachdach: Ost-West, Süd, Trapezblech oder Shed?“ – SERVER-Hülle.
// Rendert Kopf, den vollständigen Startzustand des Instruments als SSR-HTML (K2Pult mit Iso-SVG, alle
// Zahlen), die Wissensschublade mit Tabellen, den Einwand „Unser Dach ist alt“ und den Ausgang.
// Die interaktive Bühne (K2DachLabor, three.js nur bei WebGL) lädt K2Insel erst in Bildschirmnähe.
//
// Daten: Standorte aus standortGruppen() (src/components/RechnerGewerbe/standorte.js), Koordinaten aus
// src/data/regionen-pvgis.json, spezifischer Ertrag je Dachart aus spezifischerErtrag() (gewerbepv.js),
// Flächenbedarf aus GEWERBE_PV.dacharten, Abzüge aus DACH_ABZUEGE (flaeche.js). Keine Schneelastwerte
// auf /gewerbe (kein Rasterzugriff, HORA nie) – es bleibt beim Link zum Standort-Check.

import Link from "next/link";
import pvgis from "@/data/regionen-pvgis.json";
import { einwaendeFuer } from "@/data/einwaende";
import { GEWERBE_PV, spezifischerErtrag } from "@/lib/rechner/gewerbepv";
import { DACH_ABZUEGE } from "@/lib/rechner/flaeche";
import { PVGIS_QUELLE, SONNE_QUELLE } from "@/lib/lastgang/pv";
import { standortGruppen } from "@/components/RechnerGewerbe/standorte";
import { DatenTabelle, KapitelBuehne, KapitelKopf, Kennzeichnung, QuellePille, Wissensschublade } from "./_bausteine";
import { KENNZEICHNUNG, STAND, zahl } from "./_tokens";
import { beispielServer } from "./_server";
import { DACH_INFO, START, bildunterschrift, dachPlan, kennwerte } from "./K2Modell";
import { sonneAm, tagesBogen, tageskurve } from "./K2Sonne";
import K2Pult, { ErkenntnisPlatz } from "./K2Pult";
import K2IsoSvg from "./K2IsoSvg";
import K2Insel from "./K2Insel";
import K2Ausgang from "./K2Ausgang";

/** Standorte mit Koordinaten und spezifischem Ertrag je Dachart (serialisierbar, ≈ 4 KB). */
function orteMitErtrag() {
  return standortGruppen()
    .map((g) => ({
      land: g.land,
      name: g.name,
      orte: g.orte
        .map((o) => {
          const p = pvgis.orte[o.slug];
          const st = { sued35: o.sued35, ostwest15: o.ostwest15, flach10: o.flach10 };
          return {
            slug: o.slug,
            name: o.name,
            lat: p?.lat,
            lon: p?.lon,
            ertrag: Object.fromEntries(GEWERBE_PV.dacharten.map((d) => [d.id, spezifischerErtrag(d.id, st)])),
          };
        })
        .filter((o) => Number.isFinite(o.lat) && Number.isFinite(o.lon)),
    }))
    .filter((g) => g.orte.length > 0);
}

const p = "mt-3 max-w-[68ch]";
const a = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

export default function K2Hallendach() {
  const orte = orteMitErtrag();
  const alle = orte.flatMap((g) => g.orte);
  const ort = alle.find((o) => o.slug === START.ortId) || alle[0];
  const dacharten = GEWERBE_PV.dacharten.map((d) => ({ id: d.id, label: d.label, sub: d.sub, qmProKwp: d.qmProKwp }));
  const qm = Object.fromEntries(dacharten.map((d) => [d.id, d.qmProKwp]));

  // Startzustand (= SSR): Halle 60 × 100 m, Ost-West, Linz, 21. Juni 10:00
  const proDachart = Object.fromEntries(dacharten.map((d) => [d.id, kennwerte({ ...START, qmProKwp: d.qmProKwp, spez: ort.ertrag[d.id] })]));
  const w = proDachart[START.dachart];
  const plan = dachPlan({ ...START, qmProKwp: qm[START.dachart], module: w.module });
  const sonne = sonneAm(START.tag, START.zeitMin, ort.lat, ort.lon);
  const kurve = tageskurve(START.tag, ort.lat, ort.lon);
  const bogen = tagesBogen(START.tag, ort.lat, ort.lon, kurve);
  const caption = bildunterschrift({ ...START, netto: w.netto, kwp: w.kwp, spez: w.spez, ortName: ort.name });
  const ow = proDachart["ost-west"];
  const sued = proDachart.sued;

  const bsp = beispielServer();
  const empfehlungKwp = bsp.kennzahlen.pv?.empfehlung?.kwp ?? null;
  const pvgisKurz = { name: `PVGIS v5.3 (EU JRC) · abgerufen ${pvgis.abgerufen.split("-").reverse().join(".")}`, url: PVGIS_QUELLE.url };

  const platzhalter = (
    <K2Pult
      z={START}
      w={w}
      proDachart={Object.fromEntries(Object.entries(proDachart).map(([id, v]) => [id, { kwp: v.kwp, mwh: v.mwh }]))}
      dacharten={dacharten}
      orte={orte}
      ort={ort}
      sonne={sonne}
      kurve={kurve}
      caption={caption}
      pvgis={pvgisKurz}
      erkenntnis={<ErkenntnisPlatz />}
      szene={<K2IsoSvg plan={plan} dachart={START.dachart} sonne={sonne} bogen={bogen} qmProKwp={qm[START.dachart]} className="absolute inset-0 h-full w-full" />}
    />
  );

  const einwand = einwaendeFuer("gewerbe", ["dach-alt"])[0];

  return (
    <KapitelBuehne id="k2" anker="hallendach" ton="sand">
      <KapitelKopf
        form="umgekehrt"
        nummer="02"
        frage="Technik fragt: Was passt auf unsere Halle – und wie viel davon ist sinnvoll?"
        titel="Hallendach und Flachdach: Ost-West, Süd, Trapezblech oder Shed?"
        lead={
          <>
            Die Dachart entscheidet, wie viel Leistung auf dieselbe Halle passt<span className="max-md:hidden"> – und wie viel jedes Modul erntet</span>. Gerechnet mit
            PVGIS-Erträgen für {alle.length} Orte.
          </>
        }
      />

      <K2Insel platzhalter={platzhalter} dacharten={dacharten} orte={orte} pvgis={pvgisKurz} empfehlungKwp={empfehlungKwp} />

      <div className="mt-8 grid gap-3 md:mt-12">
        <Wissensschublade titel="Dacharten, Statik, Brandschutz">
          <p className="max-w-[68ch]">
            Wie viel Leistung ein Hallendach trägt, ergibt sich aus der Nutzfläche und dem Flächenbedarf je kWp. Der Flächenbedarf enthält Modulfläche, Wartungsgänge und
            – bei Süd-Aufständerung – die Reihenabstände gegen Eigenverschattung. Den spezifischen Ertrag liefert PVGIS für den Standort und die Ausrichtung der Dachart.
            Alle Werte sind Richtwerte des{" "}
            <Link href="/rechner/gewerbe-pv" className={a}>
              Gewerbe-PV-Rechners
            </Link>
            ; die Belegung plant erst das Aufmaß.
          </p>
          <DatenTabelle
            className="mt-6"
            caption={`Dacharten im Vergleich – Halle ${zahl(START.breiteM)} × ${zahl(START.laengeM)} m in ${ort.name}, Rand ${DACH_ABZUEGE.rand.standard} %, Hindernisse ${DACH_ABZUEGE.hindernisse.standard} % (Richtwerte, ${STAND.werte})`}
            spalten={[
              { key: "dachart", label: "Dachart" },
              { key: "montage", label: "Montage" },
              { key: "qm", label: "m²/kWp", rechts: true },
              { key: "basis", label: "Ertragsbasis PVGIS" },
              { key: "kwp", label: "max. kWp", rechts: true },
              { key: "spez", label: "kWh/kWp", rechts: true },
              { key: "mwh", label: "MWh/Jahr", rechts: true },
            ]}
            zeilen={GEWERBE_PV.dacharten.map((d) => {
              const k = proDachart[d.id];
              return {
                dachart: `${d.label} (${d.sub})`,
                montage: DACH_INFO[d.id].montage,
                qm: zahl(d.qmProKwp),
                basis: DACH_INFO[d.id].basis,
                kwp: `≈ ${zahl(k.kwp)}`,
                spez: zahl(k.spez),
                mwh: `≈ ${zahl(k.mwh)}`,
              };
            })}
          />
          <DatenTabelle
            className="mt-6"
            caption={`Abzüge vom Bruttodach (Annahmen Ökovolt Österreich, Stand ${DACH_ABZUEGE.stand.split("-").reverse().join("/")}, Richtwerte)`}
            spalten={[
              { key: "abzug", label: "Abzug" },
              { key: "standard", label: "Standard", rechts: true },
              { key: "spanne", label: "Spanne im Modell", rechts: true },
              { key: "inhalt", label: "Was darin steckt" },
            ]}
            zeilen={[
              {
                abzug: "Randabstand",
                standard: `${DACH_ABZUEGE.rand.standard} %`,
                spanne: `${DACH_ABZUEGE.rand.min}–${DACH_ABZUEGE.rand.max} %`,
                inhalt: "Randstreifen für Brandschutz und Wartung, Attika-Verschattung – Anteil der Bruttofläche",
              },
              {
                abzug: "Lichtkuppeln, Technik, Freihaltezonen",
                standard: `${DACH_ABZUEGE.hindernisse.standard} %`,
                spanne: `${DACH_ABZUEGE.hindernisse.min}–${DACH_ABZUEGE.hindernisse.max} %`,
                inhalt: "Lichtkuppeln, RWA, Lüftungsgeräte, Wartungswege und Brandschutz-Freihaltezonen (OVE R 11-1) – Anteil der Restfläche",
              },
            ]}
          />

          <h3 className="mt-8 font-display text-[17px] font-bold text-ink-900">Ost-West oder Süd?</h3>
          <p className={p}>
            Gleiche Halle: Ost-West bringt ≈ {zahl(ow.kwp)} statt {zahl(sued.kwp)} kWp aufs Dach und ≈ {zahl(ow.mwh)} statt {zahl(sued.mwh)} MWh im Jahr – jedes Modul
            erntet weniger, das Dach mehr. Ost-West-Anlagen stehen in A-Paaren dicht beieinander und liefern einen breiteren, flacheren Tagesverlauf; Süd-Reihen brauchen
            Abstand, damit sich die Reihen bei tiefer Sonne nicht gegenseitig verschatten.
            {empfehlungKwp ? (
              <>
                {" "}
                Sinnvoll ist, was der Lastgang braucht – im Beispiel {zahl(empfehlungKwp)} kWp (
                <a href="#eigenverbrauch" className={a}>
                  Kapitel 03
                </a>
                ).
              </>
            ) : null}
          </p>

          <h3 className="mt-6 font-display text-[17px] font-bold text-ink-900">Trapezblech und Sheddach</h3>
          <p className={p}>
            Auf Trapezblech liegen die Module dachparallel – ohne Ballast und mit der dichtesten Belegung ({zahl(qm.trapez)} m² je kWp im Rechner). Entscheidend sind
            Dachhaut, Befestigung und die Tragreserve der Konstruktion. Beim Sheddach belegen wir nur die südgeneigten Flächen; die Nordverglasung bleibt frei. Der
            Rechner setzt dafür PVGIS Süd 35° mit 3 % Abschlag für die Verschattung durch den Nachbar-Shed an.
          </p>

          <h3 className="mt-6 font-display text-[17px] font-bold text-ink-900">Statik, Schnee und Wind</h3>
          <p className={p}>
            Beim Dach zählen Statik und Schnee. Wir bemessen nach ÖNORM B 1991-1-3 (Schneelast) und B 1991-1-4 (Wind) und prüfen die Schneelast Ihres Standorts – schnell
            vorab mit dem{" "}
            <Link href="/standort-check" className={a}>
              Standort-Check
            </Link>
            ; Hintergründe zu den Lastzonen unter{" "}
            <Link href="/schneelast" className={a}>
              Schneelast
            </Link>
            . Aufgeständerte Systeme werden ballastiert oder mechanisch befestigt – nach Statik, Schneelast, Dachhaut und Brandabschnitten. Für die Planung brauchen wir
            Dachpläne und Statikunterlagen.
          </p>

          <h3 className="mt-6 font-display text-[17px] font-bold text-ink-900">Brandschutz und Gewerberecht</h3>
          <p className={p}>
            Den Brandschutz planen wir nach OVE-Richtlinie R 11-1 mit Freihaltezonen, Abschaltkonzept und Feuerwehrplan. Im Modell stecken Lichtkuppeln, Technik und
            Freihaltezonen im Hindernis-Abzug; die tatsächlichen Abstände legt die Planung am Objekt fest. Gewerberecht: Überschusseinspeiser sind Teil der
            Betriebsanlage; laut Erlass des Wirtschaftsministeriums vom 1. März 2021 im Regelfall ohne eigene Genehmigung – außer bei Sonderfällen wie Fluchtwegen,
            Ex-Zonen oder Blendung. Die Bauordnungen der Länder im Überblick unter{" "}
            <Link href="/forderungen/baurecht" className={a}>
              Baurecht der Bundesländer
            </Link>
            .
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <QuellePille>
              <a href={PVGIS_QUELLE.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2">
                {PVGIS_QUELLE.name}
              </a>
            </QuellePille>
            <QuellePille>
              <a href={SONNE_QUELLE.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2">
                Sonnenstand: {SONNE_QUELLE.name}
              </a>
            </QuellePille>
            <QuellePille>
              Flächenbedarf: Annahmen Gewerbe-PV-Rechner · {STAND.werte} · {KENNZEICHNUNG.richtwert}
            </QuellePille>
          </div>
          <Kennzeichnung className="mt-3">{KENNZEICHNUNG.keineBeratung}</Kennzeichnung>
        </Wissensschublade>

        {einwand && (
          <details className="group rounded-2xl bg-sand-100/70">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-3 text-[14.5px] text-ink-800 hover:bg-sand-100 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="font-semibold text-ink-500">Einwand: </span>
                <span className="font-display font-bold text-ink-900">„{einwand.einwand.replace(/\.$/, "")}“</span>
              </span>
              <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-ov-600">
                <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded bg-current" />
                <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300 group-open:scale-y-0" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 text-[15px] leading-relaxed text-ink-700">
              <p className="max-w-[68ch]">{einwand.antwort}</p>
              <p className="mt-3 max-w-[68ch] text-[14px] text-ink-600">
                <span className="font-semibold text-ink-800">Beleg: </span>
                <Link href={einwand.belegHref} className={a}>
                  {einwand.beleg}
                </Link>
              </p>
              <p className="mt-2 text-[14px]">
                <Link href={einwand.schritt.href} className={a}>
                  {einwand.schritt.label} →
                </Link>
              </p>
            </div>
          </details>
        )}
      </div>

      <K2Ausgang startNetto={Math.round(w.netto)} />
    </KapitelBuehne>
  );
}
