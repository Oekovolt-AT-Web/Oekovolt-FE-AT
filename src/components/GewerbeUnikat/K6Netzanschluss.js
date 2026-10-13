// src/components/GewerbeUnikat/K6Netzanschluss.js
//
// K6 · Schwellen-Lineal · „Netzanschluss: Netzebene 7, 6 oder 5 – TOR Typ A oder B und Parkregler“ –
// SERVER-Hülle (Ton sand, Anker #netzanschluss). Rendert Kopf, die vollständige Ansicht im Startzustand
// (280 kWp, NE 6, ohne Speicher → TOR Typ A, knapp) als Platzhalter mit statischem Einlinienschaltbild,
// figcaption, die Wissensschublade (Netzebenen, TOR-Typen, Netzzugang, OeMAG/EAG), den Einwand
// „Unser Netz ist voll“ und den Ausgang. Die Bühne (K6Lineal: motion, d3-scale) lädt K6Insel in Nähe.
//
// Recht: Parkregler-Text nur als PARKREGLER_SATZ (src/data/marke.js); Netzebene als Richtwert („legt der
// Netzbetreiber fest“); keine Aussage über freie Netzkapazität.

import Link from "next/link";
import { einwaendeFuer } from "@/data/einwaende";
import { PARKREGLER_SATZ } from "@/data/marke";
import { OEMAG_REGELN, QUELLEN as OEMAG_QUELLEN } from "@/data/oemag";
import { DECKEL, FOERDERCALL, KATEGORIEN, MAX_KWP } from "@/lib/foerdercall";
import { DC_AC_VORSCHLAG, KNAPP_BAND, TOR_GRENZEN, TYPEN } from "@/components/Technik/torTypen";
import { DatenTabelle, Kennzeichnung, KapitelBuehne, KapitelKopf, QuellePille, Wissensschublade } from "./_bausteine";
import { KENNZEICHNUNG, QUELLE, STAND, zahl } from "./_tokens";
import { beispielServer } from "./_server";
import { START, ansichtModell, einlinie } from "./K6Modell";
import K6Ansicht from "./K6Ansicht";
import K6Insel from "./K6Insel";
import K6Ausgang from "./K6Ausgang";

/** Netzebenen-Tabelle – wörtlich aus der bisherigen src/app/gewerbe/page.js übernommen. */
const NETZEBENEN = [
  { ne: "Netzebene 7", ort: "Niederspannung 400 V, Hausanschluss oder eigener Anschlusskasten", groesse: "bis etwa 100–250 kWp, je nach Netzsituation", tor: "Typ A (bis < 250 kW)" },
  { ne: "Netzebene 6", ort: "Anschluss an der Trafostation des Netzbetreibers (Niederspannungsseite)", groesse: "etwa 150 kWp bis 1 MWp", tor: "Typ A oder B" },
  { ne: "Netzebene 5", ort: "Mittelspannung, meist kundeneigene Trafostation mit Mittelspannungsschaltanlage", groesse: "etwa 0,5 bis 10 MWp", tor: "Typ B (250 kW bis < 35 MW)" },
];

/** Primärquellen (aus src/app/technik/parkregler/page.js übernommen, dort geprüft). */
const TOR_QUELLEN = [
  {
    titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, V1.4",
    href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735",
  },
  {
    titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, V1.3",
    href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128",
  },
  { titel: "Oesterreichs Energie: Erläuterungen zur TOR-Umsetzung (RfG-Schwellenwert-V)", href: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/erlaeuterungen-zur-tor-umsetzung" },
  { titel: "BMWET: Spitzenkappung – Infos zum ElWG", href: "https://www.bmwet.gv.at/Services/Infos-FAQ/elwg-infos/spitzenkappung.html" },
];

const a = "font-semibold text-ov-700 underline decoration-ov-700/30 underline-offset-4 hover:text-ov-800";

let cache = null;
function startWerte() {
  if (cache) return cache;
  const b = beispielServer();
  const zeile = b.kappung.find((z) => z.schwelle === 230 && z.moeglich);
  const speicherKw = Math.round(zeile?.leistungKw ?? 85);
  const zustand = { kwp: START.kwp, wrEigen: null, speicherKw: 0, bestandKw: 0, ne: START.ne };
  const v = ansichtModell(zustand);
  const e = einlinie(v);
  const mitSpeicher = ansichtModell({ ...zustand, speicherKw });
  cache = { v, e, speicherKw, speicherKwh: zeile ? Math.round(zeile.nennKwh) : null, mitSpeicher, kwpEmpfehlung: b.monatsspitzenMitPv.kwp };
  return cache;
}

/**
 * Eröffnung von K6: die eine Schwelle, um die es geht (250 kW AC → TOR Typ B), und wo der Beispielbetrieb
 * liegt – ohne Speicher knapp darunter, mit Speicher-Wechselrichter darüber. Lineare Skala 150–400 kW.
 */
function Schwelle({ ohne, mit, speicherKw, kwp }) {
  const MIN = 150;
  const MAX = 400;
  const x = (kw) => `${Math.max(0, Math.min(100, ((kw - MIN) / (MAX - MIN)) * 100))}%`;
  const grenze = TOR_GRENZEN.B;
  const label = `Schwelle TOR Typ B bei ${zahl(grenze)} kW AC am Netzanschlusspunkt. Beispiel: ${zahl(kwp)} kWp ergeben ≈ ${zahl(ohne)} kVA (Typ A); mit ${zahl(speicherKw)} kW Speicher-Wechselrichter ≈ ${zahl(mit)} kW (Typ B).`;
  return (
    <div role="img" aria-label={label} className="relative select-none">
      <div className="relative h-[92px] md:h-[104px]">
        {/* Bereich Typ B rechts der Schwelle */}
        <div aria-hidden="true" className="absolute inset-y-[38px] right-0 rounded-r-full bg-sun-500/20 md:inset-y-[44px]" style={{ left: x(grenze) }} />
        <div aria-hidden="true" className="absolute inset-x-0 top-[46px] h-px bg-ink-900/20 md:top-[52px]" />
        {/* Schwelle */}
        <div aria-hidden="true" className="absolute top-0 h-full w-[2px] -translate-x-1/2 bg-ink-900" style={{ left: x(grenze) }} />
        <span aria-hidden="true" className="ov-num absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-3 py-1 font-display text-[13px] font-extrabold text-white md:text-[14px]" style={{ left: x(grenze) }}>
          {zahl(grenze)} kW · Typ B
        </span>
        {/* Beispiel ohne / mit Speicher */}
        {[
          { kw: ohne, text: `≈ ${zahl(ohne)} kVA`, unter: "PV allein", fill: "bg-ov-600" },
          { kw: mit, text: `≈ ${zahl(mit)} kW`, unter: "+ Speicher-WR", fill: "bg-sun-500" },
        ].map((p, i) => (
          <span key={p.unter} aria-hidden="true" className="absolute top-[40px] -translate-x-1/2 md:top-[46px]" style={{ left: x(p.kw) }}>
            <span className={`block h-3.5 w-3.5 rounded-full ring-4 ring-sand-50 ${p.fill}`} />
            <span className={`ov-num absolute top-5 whitespace-nowrap text-[12.5px] font-semibold leading-tight text-ink-800 md:text-[13px] ${i === 0 ? "right-0 text-right" : "left-0"}`}>
              {p.text}
              <span className="block font-medium text-ink-600">{p.unter}</span>
            </span>
          </span>
        ))}
      </div>
      <p aria-hidden="true" className="mt-2 flex justify-between text-[11.5px] font-medium text-ink-500">
        <span className="ov-num">{zahl(MIN)} kW</span>
        <span className="max-sm:hidden">AC am Netzanschlusspunkt · Beispielbetrieb, {KENNZEICHNUNG.richtwert}</span>
        <span className="sm:hidden">AC · Beispiel, {KENNZEICHNUNG.richtwert}</span>
        <span className="ov-num">{zahl(MAX)} kW</span>
      </p>
    </div>
  );
}

export default function K6Netzanschluss() {
  const { v, e, speicherKw, speicherKwh, mitSpeicher } = startWerte();
  const einwand = einwaendeFuer("gewerbe", ["netz-voll"])[0];
  const katZeilen = KATEGORIEN.map((k) => ({
    kat: `Kategorie ${k.id}`,
    leistung: k.leistung,
    satz: `${zahl(k.satz)} €/kWp`,
    reihung: k.reihung,
  }));
  const torZeilen = ["A", "B", "C", "D"].map((t) => ({ typ: `Typ ${t}`, grenze: TYPEN[t].grenze, netz: TYPEN[t].netz, regelwerk: TYPEN[t].regelwerk }));
  return (
    <KapitelBuehne id="k6" anker="netzanschluss" ton="sand">
      <KapitelKopf
        form="lineal"
        zier={<Schwelle ohne={Math.round(v.ac)} mit={Math.round(v.ac) + speicherKw} speicherKw={speicherKw} kwp={v.kwp} />}
        nummer="06"
        frage="Technik fragt: Ab wann wird der Netzanschluss aufwendig?"
        titel="Netzanschluss: Netzebene 7, 6 oder 5 – TOR Typ A oder B und Parkregler"
        lead="Ob der Anschluss aufwendig wird, entscheidet die AC-Leistung am Netzanschlusspunkt – nicht die kWp auf dem Dach."
        rechts={
          <QuellePille className="mt-4 max-md:hidden">
            TOR-Grenzen nach RfG-Schwellenwert-V (E-Control) · {STAND.werte} · {KENNZEICHNUNG.richtwert}
          </QuellePille>
        }
      />

      <figure className="mt-8 md:mt-14">
        <K6Insel
          beispielSpeicherKw={speicherKw}
          beispielSpeicherKwh={speicherKwh}
          platzhalter={
            <div inert>
              <K6Ansicht v={v} e={e} f={{ wr: String(v.wr), sp: "0", bestand: "0" }} chip={{ kw: speicherKw, text: `Speicher-WR aus Kapitel 05 (Beispiel): ${zahl(speicherKw)} kW`, kurz: `+ ${zahl(speicherKw)} kW Speicher-WR (Beispiel, Kap. 05)` }} statisch />
            </div>
          }
        />
        {/* mobil ohne sichtbare Bildunterschrift: die Schwelle im Kapitelkopf zeigt dort dieselbe Pointe (Text bleibt im HTML) */}
        <figcaption className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-600 max-md:sr-only md:mt-8 md:text-[15px]">
          Startzustand: <span className="ov-num">{zahl(v.kwp)}</span> kWp, Wechselrichter <span className="ov-num">{zahl(v.wr)}</span> kVA, Netzebene {v.ne} – {v.typText},
          knapp. Mit <span className="ov-num">{zahl(speicherKw)}</span> kW Speicher-Wechselrichter aus Kapitel 05: <span className="ov-num">{zahl(mitSpeicher.ac)}</span> kW,{" "}
          {mitSpeicher.typText}, in der Regel mit Parkregler. {KENNZEICHNUNG.richtwert}e, {KENNZEICHNUNG.keineBeratung.replace("Orientierung, k", "k")}.
        </figcaption>
      </figure>

      {/* grid-cols-[minmax(0,1fr)]: sonst bläht die Mindestbreite der Tabellen (480 px) die auto-Spur auf
          und die Schublade läuft mobil rechts aus dem Bild (QA 12.10.) – so scrollen die Tabellen in sich. */}
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-3 md:mt-10">
        <Wissensschublade titel="Netzebenen, TOR-Typen und Netzzugang">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
            <div>
              <h3 className="font-display text-[17px] font-bold text-ink-900">Netzebenen für gewerbliche PV-Anlagen in Österreich</h3>
              <DatenTabelle
                className="mt-3"
                caption="Netzebenen für gewerbliche PV-Anlagen in Österreich"
                spalten={[
                  { key: "ne", label: "Netzebene" },
                  { key: "ort", label: "Anschlusspunkt" },
                  { key: "groesse", label: "Typische Anlagengröße" },
                  { key: "tor", label: "TOR Erzeuger" },
                ]}
                zeilen={NETZEBENEN}
              />
              <p className="mt-3 max-w-[72ch] text-[13.5px] leading-snug text-ink-600">
                Richtwerte – die Netzebene legt der Netzbetreiber fest. Typen nach TOR Erzeuger (E-Control): Typ A ≥ {zahl(TOR_GRENZEN.A, 1)} kW bis &lt; {zahl(TOR_GRENZEN.B)} kW, Typ
                B {zahl(TOR_GRENZEN.B)} kW bis &lt; {zahl(TOR_GRENZEN.C / 1000)} MW, Typ C {zahl(TOR_GRENZEN.C / 1000)} bis &lt; {zahl(TOR_GRENZEN.D / 1000)} MW, Typ D ≥{" "}
                {zahl(TOR_GRENZEN.D / 1000)} MW oder Anschluss ≥ 110 kV.
              </p>
            </div>

            <DatenTabelle
              caption={`TOR-Typen A bis D nach der AC-Maximalkapazität am Netzanschlusspunkt (RfG-Schwellenwert-V, ${STAND.werte})`}
              spalten={[
                { key: "typ", label: "Typ" },
                { key: "grenze", label: "AC-Maximalkapazität" },
                { key: "netz", label: "Netz" },
                { key: "regelwerk", label: "Regelwerk" },
              ]}
              zeilen={torZeilen}
            />

            <div className="max-w-[68ch]">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Was zählt: AC-Leistung am Netzanschlusspunkt</h3>
              <p className="mt-2">
                Für die Einstufung zählt die Summe der AC-Maximalkapazitäten am Netzanschlusspunkt: Wechselrichter der neuen Anlage, Speicher-Wechselrichter und bestehende Erzeugung
                am selben Anschluss. Die Modulleistung in kWp zählt nicht direkt. Wir schlagen die Wechselrichterleistung mit kWp ÷ {zahl(DC_AC_VORSCHLAG, 2)} vor (Annahme). So
                ergeben {zahl(v.kwp)} kWp rund {zahl(v.wr)} kVA – {v.typText}, knapp. Mit {zahl(speicherKw)} kW Speicher-Wechselrichter sind es {zahl(mitSpeicher.ac)} kW und damit{" "}
                {mitSpeicher.typText}. Zwischen {zahl(KNAPP_BAND.von)} und {zahl(KNAPP_BAND.bis)} kW lohnt es sich, die Auslegung bewusst zu prüfen: Ein knapper bemessener
                Wechselrichter hält die Anlage unter {zahl(TOR_GRENZEN.B)} kW, kappt aber an wenigen sonnigen Mittagen etwas Ertrag.
              </p>
            </div>

            <div className="max-w-[68ch]">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Was TOR Typ B verlangt – und wer es regelt</h3>
              <p className="mt-2">
                Ab {zahl(TOR_GRENZEN.B)} kW gilt {TYPEN.B.regelwerk}. Verlangt sind unter anderem ein Blindleistungsbereich mit cos φ 0,925 unter- bis übererregt, eine
                Wirkleistungsvorgabe in bis zu vier Stufen (unter 1 MW) mit Sollwert in einer Minute sowie ab 1 MW eine Fernwirkschnittstelle nach Wahl des Netzbetreibers mit
                Online-Sollwerten. TOR Typ B schreibt diese Fähigkeiten vor, kein bestimmtes Gerät – in der Praxis übernimmt sie in der Regel ein Parkregler (EZA-Regler) am
                Netzanschlusspunkt: Er misst dort Wirk- und Blindleistung und gibt den Wechselrichtern und dem Speicher ihre Sollwerte. {PARKREGLER_SATZ}
              </p>
            </div>

            <div className="max-w-[68ch]">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Netzverträglichkeit und Netzzugang</h3>
              <p className="mt-2">
                Ob und mit welcher Leistung Ihre Anlage einspeisen darf, prüft verbindlich der Netzbetreiber – im Netzzugangsverfahren mit Netzverträglichkeitsprüfung. Er legt auch
                Netzebene und Netzanschlusspunkt fest. Die Lineale oben zeigen Richtwerte und sagen nichts über freie Netzkapazität an Ihrem Standort. Bei neu angeschlossenen oder
                erweiterten PV-Anlagen darf der Netzbetreiber die Einspeiseleistung nach § 101 ElWG auf bis zu 70 % der Modulspitzenleistung begrenzen (Spitzenkappung); ausgenommen
                sind Anlagen bis 7 kW netzwirksamer Leistung. Was über den Eigenverbrauch hinausgeht, begrenzt dann der Parkregler am Netzanschlusspunkt.
              </p>
            </div>

            <div className="max-w-[68ch]">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Überschuss und Förderung nach Anlagengröße</h3>
              <p className="mt-2">
                Die OeMAG nimmt Überschuss zum Marktpreis nur von Anlagen unter {zahl(OEMAG_REGELN.grenzeKwp)} kW Engpassleistung ab (§ 13 ÖSG 2012), Vertrag bis{" "}
                {OEMAG_REGELN.vertragBis}, Kündigung {OEMAG_REGELN.kuendigung}. Ausgenommen sind {OEMAG_REGELN.ausnahmen.join(", ")}. Darüber verkaufen Sie den Überschuss über
                einen Stromhändler oder Direktvermarkter. Den EAG-Investitionszuschuss gibt es anteilig bis {zahl(MAX_KWP)} kWp und höchstens für {zahl(DECKEL * 100)} % der
                Investition; ab Kategorie C wird nach dem niedrigsten Förderbedarf gereiht. Der {FOERDERCALL.nr}. Fördercall {FOERDERCALL.jahr} läuft von {FOERDERCALL.zeitraum}.
              </p>
            </div>
            <DatenTabelle
              caption={`EAG-Investitionszuschuss Photovoltaik – Kategorien und Höchstsätze (${FOERDERCALL.nr}. Fördercall ${FOERDERCALL.jahr}, Stand ${FOERDERCALL.stand.label}, ${KENNZEICHNUNG.richtwert})`}
              spalten={[
                { key: "kat", label: "Kategorie" },
                { key: "leistung", label: "Leistung" },
                { key: "satz", label: "Höchstsatz", rechts: true },
                { key: "reihung", label: "Reihung" },
              ]}
              zeilen={katZeilen}
            />

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
              <Link href="/netzanmeldung" className={a}>
                Netzanmeldung vorbereiten
              </Link>
              <Link href="/ratgeber/tor-erzeuger-netzanschluss" className={a}>
                Ratgeber: TOR Erzeuger und Netzanschluss
              </Link>
              <Link href="/forderungen/richtlinien" className={a}>
                Richtlinien und Normen
              </Link>
              <Link href="/technik/parkregler" className={a}>
                Parkregler und Leittechnik
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[...TOR_QUELLEN, QUELLE.elwg, { titel: OEMAG_QUELLEN.oemag.label, href: OEMAG_QUELLEN.oemag.url }, { titel: "EAG-Abwicklungsstelle (OeMAG)", href: FOERDERCALL.abwicklungsstelle }].map((q) => (
                <QuellePille key={q.href}>
                  <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                    {q.titel}
                  </a>
                </QuellePille>
              ))}
              <QuellePille>Stand {STAND.geprueft}</QuellePille>
            </div>
            <Kennzeichnung>{KENNZEICHNUNG.keineBeratung}</Kennzeichnung>
          </div>
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

      <K6Ausgang />
    </KapitelBuehne>
  );
}
