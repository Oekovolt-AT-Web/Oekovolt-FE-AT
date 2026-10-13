// src/components/GewerbeUnikat/K5Leistungspreis.js
//
// K5 · „Leistungspreis senken: die teuerste Viertelstunde des Monats“ – SERVER-Hülle (Ton dunkel,
// Anker #leistungspreis). Rendert Kopf, die vollständige Ansicht im Startzustand als Platzhalter (SSR,
// pixelgleich mit der Bühne), figcaption mit den Werten des synthetischen Beispielbetriebs, die
// Wissensschublade (Regeln 2026/2027, Speicherauslegung, Tabellen) und den Kapitel-Ausgang.
// Zahlen kommen aus beispielServer() (./_server.js) – dieselben Funktionen wie im Web Worker.

import Link from "next/link";
import pvgis from "@/data/regionen-pvgis.json";
import { REGIONEN } from "@/data/regionen";
import { PEAK_ANNAHMEN } from "@/lib/lastgang/peak";
import { PVGIS_QUELLE, SONNE_QUELLE } from "@/lib/lastgang/pv";
import { NETZ_QUELLE, psParams } from "@/lib/rechner/peakshaving";
import { beispielServer } from "./_server";
import { DatenTabelle, KapitelBuehne, KapitelKopf, Kennzeichnung, QuellePille, Wissensschublade } from "./_bausteine";
import { KENNZEICHNUNG, QUELLE, STAND, euroRund, zahl } from "./_tokens";
import { MONATE_LANG, NB, ansichtModell, euroText, leistungspreis, monatsPlaetze, sonnenboegen, startDeckel } from "./K5Rechnen";
import K5Ansicht from "./K5Ansicht";
import K5Ausgang from "./K5Ausgang";
import K5Bildtext from "./K5Bildtext";
import K5Insel from "./K5Insel";

const ELWOG = { titel: "ElWOG 2010, §§ 17 und 52 (RIS)", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007045" };

/** Ort-Id → [Name, lat, lon] für die Sonnenbögen (K2 kann den Ort wechseln). */
const ORTE = Object.fromEntries(Object.entries(pvgis.orte).map(([id, o]) => [id, [REGIONEN[id]?.name ?? id, o.lat, o.lon]]));

let cache = null;
function startWerte() {
  if (cache) return cache;
  const b = beispielServer();
  const kz = b.kennzahlen;
  const monate = kz.monate.map((m) => ({ monat: m.monat, jahr: m.jahr, spitzeKw: m.spitzeKw, spitzeT: m.spitzeT }));
  const plaetze = monatsPlaetze(monate);
  let aktiv = 0;
  plaetze.forEach((m, i) => {
    if (m && !(plaetze[aktiv]?.spitzeKw >= m.spitzeKw)) aktiv = i;
  });
  const ortId = ORTE[kz.pv?.ortId] ? kz.pv.ortId : "linz";
  const start = {
    monate,
    jahr: monate[0]?.jahr ?? 2025,
    aktiv,
    spitzeKw: kz.spitzeKw,
    mittelKw: kz.jahresverbrauch / 8760,
    jahresverbrauch: kz.jahresverbrauch,
    kwp: b.monatsspitzenMitPv.kwp,
    mitPv: { kwp: b.monatsspitzenMitPv.kwp, mittel: b.monatsspitzenMitPv.mittel, spitzen: b.monatsspitzenMitPv.spitzen.map((x) => (Number.isFinite(x) ? x : null)) },
    kappung: b.kappung,
    ortId,
    bereichId: "ooe",
    ne: 6,
  };
  const [name, lat, lon] = ORTE[ortId];
  const daten = {
    plaetze,
    boegen: sonnenboegen(lat, lon, start.jahr),
    ort: { name, lat, lon },
    kwp: start.kwp,
    spitzeKw: start.spitzeKw,
    mittelKw: start.mittelKw,
    pvKw: null,
    mitPv: start.mitPv,
    zeilen: start.kappung,
    kappBereich: null,
    vollstaendig: false,
    bereichId: start.bereichId,
    ne: start.ne,
    quelle: "beispiel",
  };
  const deckel = startDeckel(start.spitzeKw);
  const v = ansichtModell(daten, { monat: aktiv, deckel, sonne: false, modus: "2026", staffel: "gleichzeitig" });
  const zeile = start.kappung.find((z) => z.schwelle === deckel) || null;
  const { lp } = leistungspreis(start.bereichId, start.ne);
  const sekundaer = `/rechner/peak-shaving?${psParams({
    verbrauch: start.jahresverbrauch,
    spitzen: plaetze.map((m) => m?.spitzeKw ?? 0),
    kappung: deckel,
    schichten: 2,
    art: "anlauf",
    bereich: start.bereichId,
    ne: start.ne,
    kwp: start.kwp,
    speicher: zeile?.moeglich ? zeile.nennKwh : null,
    lp,
  })}`;
  cache = { b, start, v, deckel, zeile, lp, sekundaer };
  return cache;
}

const WOCHENTAG = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

/** Eröffnung von K5: die teuerste Viertelstunde des Beispieljahres als große Uhrzeit (Text, kein Bild). */
function SpitzenZeit({ spitzeT, spitzeKw, uhrzeiten, alle }) {
  const d = new Date(spitzeT);
  const zeit = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  const tag = `${WOCHENTAG[d.getUTCDay()]} ${d.getUTCDate()}. ${MONATE_LANG[d.getUTCMonth()]}`;
  return (
    <div className="lg:pl-10">
      <p className="flex items-end gap-4">
        <span className="ov-num font-display text-[clamp(3.75rem,2.6rem+7.5vw,9rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-sun-500">{zeit}</span>
        <span className="pb-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/60 md:pb-3">Uhr</span>
      </p>
      {/* mobil eine Zeile – das Fazit unter der Spitzen-Uhr sagt den Rest */}
      <p className="ov-num mt-3 text-[13px] leading-snug text-white/70 md:hidden">
        <span className="font-semibold text-white">{`${tag} · ${zahl(spitzeKw)} kW`}</span> · {alle} Monatsspitzen um {uhrzeiten} Uhr · synthetisch
      </p>
      <p className="mt-4 max-w-[40ch] text-[14px] leading-snug text-white/70 max-md:hidden">
        <span className="ov-num font-semibold text-white">{`${tag} · ${zahl(spitzeKw)} kW`}</span> – die teuerste Viertelstunde des Beispieljahres. {`${alle.charAt(0).toUpperCase()}${alle.slice(1)}`}{" "}
        Monatsspitzen liegen um <span className="ov-num">{uhrzeiten}</span> Uhr, beim Schichtbeginn.
      </p>
      <Kennzeichnung dunkel className="mt-2 max-md:hidden">
        {KENNZEICHNUNG.synthetischKurz}
      </Kennzeichnung>
    </div>
  );
}

export default function K5Leistungspreis() {
  const { b, start, v, zeile, lp, sekundaer } = startWerte();
  const uhrzeiten = v.alleUhrzeiten.join("/");
  const alle = v.anzahlMonate === 12 ? "alle 12" : `${zahl(v.anzahlMonate)}`;
  const unterHorizont = v.monate.filter((m) => !m.leer && m.hoehe <= 0).length;
  const lpText = `${zahl(lp, 2)} €`;

  const monatsZeilen = v.monate
    .filter((m) => !m.leer)
    .map((m) => ({
      monat: MONATE_LANG[m.i],
      spitze: `${zahl(m.kw, 1)} kW`,
      wann: `${m.tag} ${m.uhr}`,
      sonne: m.sonneTabelle,
      mitPv: Number.isFinite(start.mitPv.spitzen[m.i]) ? `${zahl(start.mitPv.spitzen[m.i], 1)} kW` : "–",
    }));
  const kappZeilen = b.kappung.map((z) => ({
    deckel: `${zahl(z.schwelle)} kW`,
    leistung: z.moeglich ? `${zahl(z.leistungKw)} kW` : "–",
    kapazitaet: z.moeglich ? `${zahl(z.nennKwh)} kWh` : "nicht möglich",
    tage: zahl(z.tage),
    senkung: `${zahl(z.senkungKw, 1)} kW`,
    euro: `≈ ${euroRund(z.euro)}`,
  }));

  return (
    <KapitelBuehne id="k5" anker="leistungspreis" ton="dunkel">
      <KapitelKopf
        dunkel
        form="uhr"
        zier={<SpitzenZeit spitzeT={b.kennzahlen.spitzeT} spitzeKw={b.kennzahlen.spitzeKw} uhrzeiten={uhrzeiten} alle={alle} />}
        nummer="05"
        frage="Finanzen fragt: Warum senkt die PV unseren Leistungspreis kaum?"
        titel="Leistungspreis senken: die teuerste Viertelstunde des Monats"
        lead="Sie zahlen für die teuerste Viertelstunde jedes Monats. Liegt sie beim Schichtbeginn, hilft die Sonne kaum – ein kleiner Speicher schon."
        rechts={
          <QuellePille dunkel className="mt-4 max-md:hidden">
            <span>
              Leistungspreis 2026, Netzebene 6, Oberösterreich: <span className="ov-num font-semibold text-white">{lpText}</span> je kW und Jahr · SNE-V 2018 – Novelle 2026 · {STAND.werte}
            </span>
          </QuellePille>
        }
      />

      <figure className="mt-6 md:mt-16">
        <K5Insel
          start={start}
          orte={ORTE}
          platzhalter={
            <div inert>
              <K5Ansicht v={v} />
            </div>
          }
        />
        <figcaption className="mt-5 max-w-3xl border-t border-white/[0.08] pt-4 text-[13.5px] leading-relaxed text-white/70 md:mt-12 md:pt-6 md:text-[15px]">
          <K5Bildtext lp={lp}>
          {/* mobil steht dieser Satz schon in der Eröffnung (06:15) direkt darüber */}
          <span className="max-md:sr-only">Im synthetischen Beispielbetrieb liegen {alle} Monatsspitzen um {uhrzeiten}{NB}Uhr. </span> Eine {zahl(b.monatsspitzenMitPv.kwp)}-kWp-Anlage senkt ihr Mittel nur von{" "}
          <span className="ov-num">{zahl(b.kennzahlen.mittelMonatsspitze, 1)}</span> auf <span className="ov-num whitespace-nowrap">{`${zahl(b.monatsspitzenMitPv.mittel, 1)}${NB}kW`}</span>; ein Speicher mit{" "}
          <span className="ov-num whitespace-nowrap">{`${zahl(zeile?.leistungKw ?? 0)}${NB}kW / ${zahl(zeile?.nennKwh ?? 0)}${NB}kWh`}</span> senkt es um{" "}
          <span className="ov-num whitespace-nowrap">{`${zahl(zeile?.senkungKw ?? 0, 1)}${NB}kW`}</span> <span className="whitespace-nowrap">({`${euroText(zeile?.euro ?? 0)}/Jahr`}</span> bei Netzebene 6, OÖ).
          </K5Bildtext>
        </figcaption>
      </figure>

      <div className="mt-4 flex flex-col gap-2 md:mt-5">
        <Kennzeichnung dunkel>
          {/* mobil gesammelt: PV-Modell und Speicher-Simulation (am Desktop direkt an Uhr und Türmen) */}
          <span className="md:hidden">
            {KENNZEICHNUNG.pvModell} · Speicher je Deckel aus allen Viertelstunden simuliert – {KENNZEICHNUNG.richtwert}, ohne Speicherpreise ·{" "}
          </span>
          {KENNZEICHNUNG.beispiel} · {KENNZEICHNUNG.keineBeratung}
        </Kennzeichnung>
      </div>

      <Wissensschublade dunkel className="mt-8 md:mt-10" titel="Leistungspreis in Österreich: Regeln 2026/2027 und Speicher">
        <div className="grid gap-8">
          <div className="max-w-[68ch]">
            <h3 className="font-display text-[17px] font-bold text-white">Bis Ende 2026: Mittel der zwölf Monatsspitzen</h3>
            <p className="mt-2">
              Wird Ihre Leistung gemessen – Pflicht ab mehr als 100.000 kWh Jahresverbrauch oder mehr als 50 kW –, verrechnet der Netzbetreiber nach § 52 ElWOG 2010 und der
              Systemnutzungsentgelte-Verordnung (SNE-V 2018, Novelle 2026) den Mittelwert der zwölf höchsten Viertelstunden der Kalendermonate × Jahresleistungspreis. Auf
              Netzebene 6 im Netzbereich Oberösterreich sind das 2026 <span className="ov-num">{lpText}</span> je kW und Jahr. Ein Kilowatt weniger in allen zwölf Monaten spart den
              vollen Jahressatz, ein Kilowatt weniger in nur einem Monat ein Zwölftel davon. Kleinere Kunden auf Netzebene 7 ohne Leistungsmessung zahlen 2026 eine Pauschale von
              54 € im Jahr.
            </p>
          </div>
          <div className="max-w-[68ch]">
            <h3 className="font-display text-[17px] font-bold text-white">Ab 2027: jeder Monat einzeln (Entwurf)</h3>
            <p className="mt-2">
              Ab 1. Jänner 2027 gilt das Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025). Laut Begutachtungsentwurf der Systemnutzungsentgelte-Grundsätze-Verordnung
              (SNE-G-V, {QUELLE.sneEntwurf.stand}) wird dann das Monatsmaximum mit einem Monatsleistungspreis verrechnet. Der Leistungspreis gilt auch auf Netzebene 7, dort mit zwei
              Preisstufen (bis 10 kW und darüber), und wird mit mindestens 20 % der vereinbarten netzwirksamen Leistung bemessen (mindestens 2 kW). Peak Shaving muss deshalb in
              jedem Monat wirken – ein Ausreißer kostet genau diesen Monat.
            </p>
            <Kennzeichnung dunkel className="mt-3">
              {KENNZEICHNUNG.entwurf2027}
            </Kennzeichnung>
          </div>
          <div className="max-w-[68ch]">
            <h3 className="font-display text-[17px] font-bold text-white">Warum die Photovoltaik die Spitze kaum senkt</h3>
            <p className="mt-2">
              Die Monatsspitze eines Schichtbetriebs entsteht beim Anlauf der Maschinen – im synthetischen Beispielbetrieb in {alle} Monaten um {uhrzeiten} Uhr. In{" "}
              {zahl(unterHorizont)} von 12 Monaten steht die Sonne zu dieser Zeit noch unter dem Horizont, in den übrigen sehr tief im Osten. Eine{" "}
              {zahl(b.monatsspitzenMitPv.kwp)}-kWp-Anlage (Ost-West, Linz) senkt das Mittel der Monatsspitzen deshalb nur um{" "}
              <span className="ov-num">{zahl(b.kennzahlen.mittelMonatsspitze - b.monatsspitzenMitPv.mittel, 1)} kW</span> (≈{" "}
              {euroRund((b.kennzahlen.mittelMonatsspitze - b.monatsspitzenMitPv.mittel) * lp)}/Jahr). Planbar kappt die Spitze ein Speicher, der vor Schichtbeginn voll ist – oder ein
              gestaffelter Maschinenstart, der gar nichts kostet.
            </p>
          </div>
          <div className="max-w-[68ch]">
            <h3 className="font-display text-[17px] font-bold text-white">Speicher auslegen: Leistung und Kapazität</h3>
            <p className="mt-2">
              Die Leistung des Speichers muss die größte Überschreitung des Deckels decken (Jahresspitze minus Deckel), die Kapazität die Energie über dem Deckel. Wir simulieren dafür
              alle Viertelstunden des Jahres: Der Speicher entlädt, sobald die Last über dem Deckel liegt, und lädt darunter nach, ohne den Deckel zu überschreiten. Auf die kleinste
              ausreichende Kapazität kommen wie im Peak-Shaving-Rechner eine Reserve von × {zahl(PEAK_ANNAHMEN.reserve, 2)} für Prognosefehler, eine Restkapazität von{" "}
              {zahl(PEAK_ANNAHMEN.sohEnde, 1)} am Lebensende und ein Wirkungsgrad für Laden und Entladen von {zahl(PEAK_ANNAHMEN.eta, 1)}. Liegt der Deckel zu nahe an der Dauerlast,
              müsste der Speicher über Tage entladen, ohne nachzuladen – dann hilft kein Speicher allein.
            </p>
            <p className="mt-3 font-semibold text-white">Speicherpreise nennen wir hier bewusst nicht – sie hängen stark von Größe, Leistung und Projekt ab.</p>
          </div>

          <DatenTabelle
            dunkel
            caption={`Deckel → Speicher → Ersparnis im synthetischen Beispielbetrieb (Leistungspreis Netzebene 6, Oberösterreich, ${zahl(lp, 2)} €/kW und Jahr, ${STAND.werte}, ${KENNZEICHNUNG.richtwert})`}
            spalten={[
              { key: "deckel", label: "Deckel" },
              { key: "leistung", label: "Speicher-Leistung", rechts: true },
              { key: "kapazitaet", label: "Nennkapazität", rechts: true },
              { key: "tage", label: "Tage mit Eingriff", rechts: true },
              { key: "senkung", label: "Mittel der Spitzen", rechts: true },
              { key: "euro", label: "Ersparnis pro Jahr", rechts: true },
            ]}
            zeilen={kappZeilen}
          />
          <DatenTabelle
            dunkel
            caption={`Monatsspitzen des synthetischen Beispielbetriebs ${start.jahr} – Uhrzeit, Sonnenstand in Linz und Spitze des Netzbezugs mit ${zahl(start.kwp)} kWp Photovoltaik (${KENNZEICHNUNG.richtwert})`}
            spalten={[
              { key: "monat", label: "Monat" },
              { key: "spitze", label: "Monatsspitze", rechts: true },
              { key: "wann", label: "Wann" },
              { key: "sonne", label: "Sonne zur Spitze" },
              { key: "mitPv", label: "Spitze mit PV", rechts: true },
            ]}
            zeilen={monatsZeilen}
          />

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
            <Link href="/gewerbespeicher" className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200">
              Gewerbespeicher und Peak Shaving
            </Link>
            <Link href="/ratgeber/peak-shaving-leistungspreis" className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200">
              Ratgeber: Leistungspreis in Österreich senken
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { titel: NETZ_QUELLE.name, href: NETZ_QUELLE.url },
              ELWOG,
              QUELLE.elwg,
              { titel: `${QUELLE.sneEntwurf.titel} (${QUELLE.sneEntwurf.stand})`, href: QUELLE.sneEntwurf.href },
              { titel: PVGIS_QUELLE.name, href: PVGIS_QUELLE.url },
              { titel: SONNE_QUELLE.name, href: SONNE_QUELLE.url },
            ].map((q) => (
              <QuellePille key={q.href} dunkel>
                <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                  {q.titel}
                </a>
              </QuellePille>
            ))}
            <QuellePille dunkel>Stand {STAND.geprueft}</QuellePille>
          </div>
        </div>
      </Wissensschublade>

      <K5Ausgang sekundaerStart={sekundaer} />
    </KapitelBuehne>
  );
}
