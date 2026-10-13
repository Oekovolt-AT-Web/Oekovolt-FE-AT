// src/components/GewerbeUnikat/K4KwhWert.js
//
// K4 · „Was eine Kilowattstunde vom Dach wert ist – nach Netzbereich und Netzebene“ (Röntgen der
// Stromrechnung). SERVER-KOMPONENTE (Hülle): Kopf, Bühne als Insel (SSR-Platzhalter = derselbe Aufbau im
// Startzustand: Jahresrechnung des synthetischen Beispielbetriebs, Röntgenbild geschlossen), gestreamte
// Börsenzeile, Wissensschublade mit der Jahresrechnung (was der Solarstrom streicht) und den Netzentgelten
// aller 13 Netzbereiche (SNE-V-Novelle 2026), Einwand „Strompreise fallen wieder“ und Kapitel-Ausgang.
//
// Ton weiß, Anker #kwh-wert (zusätzlich leerer Anker #stromrechnung für alte Links), data-kapitel="k4".
// Konzept: docs/projekt-doku/anhang/wellen/GEWERBE-UNIKAT.md, Abschnitt 7 (K4).

import Link from "next/link";
import { Suspense } from "react";
import pvgis from "@/data/regionen-pvgis.json";
import { einwaendeFuer } from "@/data/einwaende";
import { FOERDER_FRISTEN } from "@/data/foerderFristen";
import { NETZBEREICHE, NETZ_QUELLE, PS_ANNAHMEN, netzpreise } from "@/lib/rechner/peakshaving";
import { projiziereAT } from "@/components/Region/oesterreichKarte";
import { standortGruppen } from "@/components/RechnerGewerbe/standorte";
import { BEISPIEL, BEISPIEL_ERGEBNIS } from "./_beispiel.js";
import { DatenTabelle, KapitelAusgang, KapitelBuehne, KapitelKopf, Kennzeichnung, QuellePille, Wissensschublade } from "./_bausteine.js";
import { HAUPT_CTA, HAUPT_HREF } from "./_cta.js";
import { beispielServer } from "./_server.js";
import { KENNZEICHNUNG, QUELLE, STAND, zahl } from "./_tokens.js";
import K4Boerse from "./K4Boerse.js";
import K4Insel from "./K4Insel.js";
import { K4Bild, K4Film } from "./K4Bild.js";
import { K4KarteRahmen, K4Legende, K4Pult, K4StadtPillen } from "./K4Pult.js";
import { ABGABE, ANLAGE_BEISPIEL, K4Gerippe, K4Knopf, K4Rechnung, TEILE, euroZahl, k4Jahr, k4Werte } from "./K4Rechnung.js";

const STADTNETZE = ["linz", "graz", "klagenfurt", "innsbruck"];

/** Netzentgelte je Bereich und Netzebene – jede Zahl über netzpreise() (SNE-V-Novelle 2026). */
const NETZ = NETZBEREICHE.map((b) => ({
  id: b.id,
  label: b.label,
  betreiber: b.betreiber,
  stadt: STADTNETZE.includes(b.id),
  ne: Object.fromEntries(
    [5, 6, 7].map((n) => {
      const p = netzpreise(b.id, n);
      return [n, { lp: p.lp, ap: p.ap, nv: p.nv }];
    })
  ),
  ne7n: b.ne7n,
}));

/** Stadtnetze als Punkte auf der Karte (lat/lon aus regionen-pvgis.json, viewBox 0 0 1000 535). */
const STAEDTE = STADTNETZE.map((id) => {
  const o = pvgis.orte[id];
  const p = projiziereAT(o.lat, o.lon);
  return { id, x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
});

const ABGABE_FRIST = FOERDER_FRISTEN.find((f) => f.id === "elektrizitaetsabgabe-2026-12-31");
const ABGABE_HINWEIS = {
  text: "Verlängerung offen – Finanzausschuss vertagt am 29.09.2026",
  quelle: ABGABE_FRIST?.quelle ? { label: ABGABE_FRIST.quelle.label, url: ABGABE_FRIST.quelle.url } : null,
};

const QUELLE_NETZ = { name: NETZ_QUELLE.name, url: NETZ_QUELLE.url };

/** Ortsnamen je PVGIS-Schlüssel (für den Hinweis zum Stundenmodell). */
const ORTE_NAMEN = Object.fromEntries(standortGruppen().flatMap((g) => g.orte.map((o) => [o.slug, o.name])));

/** Betrieb und Stundenmodell aus dem synthetischen Beispiel-Lastgang (einmal je Server-Prozess gerechnet). */
function betriebAusBeispiel() {
  const k = beispielServer().kennzahlen;
  return {
    verbrauchKwh: Math.round(k.jahresverbrauch),
    lpKw: Math.round(k.mittelMonatsspitze * 10) / 10,
    modell: {
      kwp: k.pv?.empfehlung?.kwp ?? 280,
      evQuote: Math.round((k.pv?.empfehlung?.evQuote ?? 0.8) * 1000) / 1000,
      ertrag: Math.round(k.pv?.jahresErtrag ?? 942),
      ortId: k.pv?.ortId ?? "linz",
      ausrichtung: k.pv?.ausrichtung ?? "ostwest",
    },
  };
}

const link = "font-medium text-ink-900 underline decoration-ink-300 underline-offset-2 hover:decoration-ink-900";

function NetzZelle({ p }) {
  return (
    <>
      <span className="block whitespace-nowrap">LP {zahl(p.lp, 2)} €</span>
      <span className="block whitespace-nowrap">AP {zahl(p.ap, 2)} ct</span>
      <span className="block whitespace-nowrap">NV {zahl(p.nv, 3)} ct</span>
    </>
  );
}

const SPALTEN = [
  { key: "bereich", label: "Netzbereich (Betreiber)" },
  { key: "ne5", label: "Netzebene 5" },
  { key: "ne6", label: "Netzebene 6" },
  { key: "ne7", label: "Netzebene 7" },
  { key: "ne7n", label: "NE 7 ohne Leistungsmessung" },
];

const ZEILEN = NETZ.map((b) => ({
  bereich: (
    <>
      <span className="block">{b.label}</span>
      <span className="block text-[12.5px] font-normal text-ink-500">{b.betreiber}</span>
    </>
  ),
  ne5: <NetzZelle p={b.ne[5]} />,
  ne6: <NetzZelle p={b.ne[6]} />,
  ne7: <NetzZelle p={b.ne[7]} />,
  ne7n: (
    <>
      <span className="block whitespace-nowrap">AP {zahl(b.ne7n, 2)} ct</span>
      <span className="block whitespace-nowrap">NV {zahl(b.ne[7].nv, 3)} ct</span>
      <span className="block whitespace-nowrap">+ {PS_ANNAHMEN.pauschaleNe7} € je Jahr</span>
    </>
  ),
}));

export default function K4KwhWert() {
  const start = k4Werte({ netz: NETZ, bereich: BEISPIEL.bereich, ne: BEISPIEL.ne, energieCt: BEISPIEL.energieCt, abgabeCt: ABGABE.befristet });
  const betrieb = betriebAusBeispiel();
  const jahr = k4Jahr(start, { verbrauchKwh: betrieb.verbrauchKwh, lpKw: betrieb.lpKw, anlage: ANLAGE_BEISPIEL });
  const r = BEISPIEL_ERGEBNIS;
  const einwand = einwaendeFuer("gewerbe", ["strompreise"])[0];

  // Anlage im Startzustand: Rechenbeispiel (wie Kurzantwort und K7); Modell = Empfehlung aus dem Lastgang (K3)
  const anlageStart = {
    wert: "beispiel",
    optionen: [
      { id: "beispiel", label: `Beispiel ${zahl(ANLAGE_BEISPIEL.kwp)} kWp`, sr: " – Rechenbeispiel der Seite" },
      { id: "modell", label: `Modell ${zahl(betrieb.modell.kwp)} kWp`, sr: " – Stundenmodell aus Kapitel 03" },
    ],
    lang: `${zahl(ANLAGE_BEISPIEL.kwp)} kWp × ${zahl(ANLAGE_BEISPIEL.ertrag)} kWh/kWp × ${zahl(ANLAGE_BEISPIEL.evQuote * 100)} % – Rechenbeispiel wie Kapitel 07`,
    kurz: `${zahl(ANLAGE_BEISPIEL.ertrag)} kWh/kWp · ${zahl(ANLAGE_BEISPIEL.evQuote * 100)} %`,
  };

  // SSR-Platzhalter = Startzustand der Bühne (gleiches Raster, gleiche Höhen → kein Layout-Sprung).
  // Film (Handy) und großes Röntgenbild (ab Tablet) stehen beide da und werden per CSS gewählt.
  const platzhalter = (
    <K4Gerippe
      rechnung={
        <K4Rechnung
          werte={start}
          jahr={jahr}
          betrieb={{ eigen: false }}
          abgabeCt={ABGABE.befristet}
          film={
            <div className="lg:hidden">
              <K4Film werte={start} jahr={jahr} anlage={{ ...anlageStart, name: "k4-anlage-film" }} quelle={QUELLE_NETZ} />
            </div>
          }
          knopf={<K4Knopf />}
        />
      }
      bild={<K4Bild werte={start} jahr={jahr} anlage={{ ...anlageStart, name: "k4-anlage-bild" }} quelle={QUELLE_NETZ} />}
      karte={
        <K4KarteRahmen legende={<K4Legende netz={NETZ} ne={start.ne} bereich={start.b.id} />} pillen={<K4StadtPillen netz={NETZ} bereich={start.b.id} />}>
          <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-sand-100/70" />
        </K4KarteRahmen>
      }
      pult={
        <K4Pult
          netz={NETZ}
          werte={start}
          bereich={start.b.id}
          ne={start.ne}
          energieCt={start.teile[0].wert}
          abgabeCt={ABGABE.befristet}
          abgabeHinweis={ABGABE_HINWEIS}
        />
      }
    />
  );

  // Jahresrechnung als HTML-Tabelle (Textalternative zum Röntgenbild, SEO)
  const jahrSpalten = [
    { key: "posten", label: "Posten" },
    { key: "satz", label: "Satz", rechts: true },
    { key: "jahr", label: "Rechnung je Jahr", rechts: true },
    { key: "solar", label: "davon gestrichen durch Solarstrom", rechts: true },
    { key: "danach", label: "danach", rechts: true },
  ];
  const jahrZeilen = [
    ...TEILE.map((t, i) => ({
      posten: t.label,
      satz: `${zahl(start.teile[i].wert, t.stellen)} ct/kWh`,
      jahr: `${euroZahl(jahr.zeilen[i].euro)} €`,
      solar: `−${euroZahl(jahr.zeilen[i].gestrichen)} €`,
      danach: `${euroZahl(jahr.zeilen[i].rest)} €`,
    })),
    {
      posten: "Leistungspreis (Mittel der Monatsspitzen)",
      satz: `${zahl(jahr.lp.kw, 1)} kW × ${zahl(jahr.lp.satz, 2)} €`,
      jahr: `${euroZahl(jahr.lp.euro)} €`,
      solar: "bleibt",
      danach: `${euroZahl(jahr.lp.euro)} €`,
    },
    {
      posten: <strong className="text-ink-900">Summe netto</strong>,
      satz: `${zahl(start.summe, 2)} ct/kWh`,
      jahr: <strong className="text-ink-900">{euroZahl(jahr.summe)} €</strong>,
      solar: <strong className="text-ov-700">−{euroZahl(jahr.gestrichen)} €</strong>,
      danach: <strong className="text-ink-900">{euroZahl(jahr.summeNach)} €</strong>,
    },
  ];

  return (
    <KapitelBuehne id="k4" anker="kwh-wert" ton="hell">
      {/* alter Anker der bisherigen Seite (Abschnitt „Stromrechnung verstehen“) */}
      <span id="stromrechnung" aria-hidden="true" className="pointer-events-none absolute -top-16 left-0 h-px w-px scroll-mt-24 md:-top-24" />

      <KapitelKopf
        form="beleg"
        nummer="04"
        zier={
          <div>
            <ul aria-label="Die vier Teile der Stromrechnung" className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 text-[13px] font-semibold text-ink-800 md:text-[13.5px]">
              {[
                { t: "Energiepreis", pv: true },
                { t: "Netz-Arbeitspreis", pv: true },
                { t: "Netzverlust", pv: true },
                { t: "Elektrizitätsabgabe", pv: true },
                { t: "Leistungspreis", pv: false },
              ].map((x) => (
                <li key={x.t} className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 ${x.pv ? "bg-ov-50" : "bg-sun-500/25"}`}>
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${x.pv ? "bg-ov-600" : "bg-sun-500"}`} />
                  {x.t}
                  <span className="sr-only">{x.pv ? " – senkt jede selbst genutzte Kilowattstunde" : " – senken Speicher und Lastmanagement, Kapitel 05"}</span>
                </li>
              ))}
            </ul>
            <p aria-hidden="true" className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[12.5px] text-ink-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ov-600" /> senkt jede selbst genutzte kWh
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sun-500" /> senken Speicher und Lastmanagement (Kapitel 05)
              </span>
            </p>
          </div>
        }
        frage="Finanzen fragt: Was spart eine selbst genutzte Kilowattstunde wirklich?"
        titel="Was eine Kilowattstunde vom Dach wert ist – nach Netzbereich und Netzebene"
        lead={
          <>
            Sie spart Energiepreis, Netzentgelte und Elektrizitätsabgabe
            <span className="max-sm:hidden"> – wie viel, hängt von Netzbereich und Netzebene ab</span>.
          </>
        }
      />

      <div className="mt-8 md:mt-14">
        <K4Insel
          platzhalter={platzhalter}
          netz={NETZ}
          staedte={STAEDTE}
          abgabeHinweis={ABGABE_HINWEIS}
          quelle={QUELLE_NETZ}
          betrieb={betrieb}
          orteNamen={ORTE_NAMEN}
        />
      </div>

      <Suspense fallback={null}>
        <K4Boerse start={{ energieCt: BEISPIEL.energieCt, nebenCt: r.vermiedenCt - BEISPIEL.energieCt }} />
      </Suspense>

      <div className="mt-6 grid gap-3 md:mt-12">
        <Wissensschublade titel="Netzentgelte 2026 und Rechnung" id="netzentgelte-2026">
          <div className="max-w-[68ch] space-y-4">
            <p>
              <strong className="text-ink-900">Was der Solarstrom von der Jahresrechnung streicht.</strong> Der synthetische Beispielbetrieb (zwei
              Schichten, <span className="ov-num whitespace-nowrap">{zahl(Math.round(betrieb.verbrauchKwh / 1000))} MWh</span> im Jahr, Mittel der
              Monatsspitzen <span className="ov-num whitespace-nowrap">{zahl(betrieb.lpKw, 1)} kW</span>) zahlt in Oberösterreich auf Netzebene{" "}
              {BEISPIEL.ne} rund <span className="ov-num whitespace-nowrap">{euroZahl(jahr.summe)} €</span> netto im Jahr. Die Anlage des
              Rechenbeispiels ({zahl(BEISPIEL.kwp)} kWp, {zahl(BEISPIEL.ertragKwhKwp)} kWh/kWp, {zahl(BEISPIEL.evQuote * 100)} % selbst genutzt)
              deckt <span className="ov-num whitespace-nowrap">{zahl(Math.round(jahr.eigenKwh))} kWh</span> davon selbst – das kürzt jede
              Arbeitspreis-Zeile um denselben Anteil ({zahl(jahr.anteil * 100, 1)} %), zusammen{" "}
              <span className="ov-num whitespace-nowrap">{euroZahl(jahr.gestrichen)} €</span> im Jahr. Mit dem Erlös für den eingespeisten Strom (
              <span className="ov-num whitespace-nowrap">{euroZahl(jahr.erloes)} €</span>) und abzüglich Betrieb und Wartung (
              <span className="ov-num whitespace-nowrap">{euroZahl(jahr.betrieb)} €</span>) ergibt das die{" "}
              <span className="ov-num whitespace-nowrap">{euroZahl(jahr.ueberschuss)} €</span> im Jahr aus Kurzantwort und{" "}
              <a href="#wirtschaftlichkeit" className={link}>
                Kapitel 07
              </a>
              . Den Leistungspreis senkt die Photovoltaik kaum – er bleibt.
            </p>
          </div>
          <DatenTabelle
            className="mt-4"
            caption={`Jahresrechnung des Beispielbetriebs (synthetisch, Oberösterreich, Netzebene ${BEISPIEL.ne}) und was der Solarstrom des Rechenbeispiels davon streicht – netto, Richtwert`}
            spalten={jahrSpalten}
            zeilen={jahrZeilen}
          />
          <Kennzeichnung className="mt-3">{KENNZEICHNUNG.synthetisch}</Kennzeichnung>

          <div className="mt-7 max-w-[68ch] space-y-4">
            <p>
              <strong className="text-ink-900">Was eine selbst genutzte Kilowattstunde vermeidet.</strong> Der Arbeitspreis, den ein Betrieb für
              Netzstrom zahlt, besteht aus mehreren Teilen – und fast alle entfallen für Solarstrom, den Sie selbst verbrauchen: der Energiepreis
              aus Ihrem Liefervertrag, das Netznutzungsentgelt (Arbeitspreis), das Netzverlustentgelt und die Elektrizitätsabgabe. Selbst erzeugter
              und verbrauchter Strom aus erneuerbaren Quellen ist nach § 2 Elektrizitätsabgabegesetz ohne Mengengrenze von der Abgabe befreit. Im
              Rechenbeispiel (Oberösterreich, Netzebene {BEISPIEL.ne}) spart jede selbst genutzte kWh{" "}
              <span className="ov-num whitespace-nowrap">{zahl(r.vermiedenCt, 2)} ct</span> –{" "}
              <span className="ov-num">{zahl(r.faktor, 1)}</span>-mal so viel wie eine eingespeiste (Überschusserlös{" "}
              <span className="ov-num whitespace-nowrap">{zahl(BEISPIEL.ueberschussCt, 1)} ct</span>).
            </p>
          </div>

          <p className="mt-6 max-w-[68ch] text-[13px] leading-snug text-ink-600">
            LP = Leistungspreis in € je kW und Jahr · AP = Netznutzungsentgelt-Arbeitspreis in ct/kWh · NV = Netzverlustentgelt in ct/kWh · alle
            Werte netto, gültig 1.1.–31.12.2026.
          </p>
          <DatenTabelle
            className="mt-3"
            caption={`Netzentgelte 2026 je Netzbereich und Netzebene – Rechenbeispiel: Oberösterreich, Netzebene ${BEISPIEL.ne}`}
            spalten={SPALTEN}
            zeilen={ZEILEN}
          />
          <div className="mt-3">
            <QuellePille>
              Quelle:{" "}
              <a href={NETZ_QUELLE.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                {NETZ_QUELLE.name}
              </a>{" "}
              · {STAND.werte} · Richtwert
            </QuellePille>
          </div>

          <div className="mt-7 max-w-[68ch] space-y-4">
            <p>
              <strong className="text-ink-900">Leistungspreis.</strong> Ab einem Jahresverbrauch über{" "}
              <span className="ov-num whitespace-nowrap">{zahl(PS_ANNAHMEN.messpflichtKwh)} kWh</span> oder einer Leistung über{" "}
              <span className="ov-num whitespace-nowrap">{PS_ANNAHMEN.messpflichtKw} kW</span> wird die Leistung gemessen. Bis Ende 2026 verrechnet
              der Netzbetreiber dann den Mittelwert der zwölf monatlichen Viertelstundenmaxima mal Leistungspreis (§ 52 ElWOG 2010). Ohne
              Leistungsmessung gilt auf Netzebene 7 ein höherer Arbeitspreis plus eine Pauschale von{" "}
              <span className="ov-num whitespace-nowrap">{PS_ANNAHMEN.pauschaleNe7} €</span> im Jahr. Photovoltaik senkt den Leistungspreis nur
              anteilig – wie ein Speicher die teuerste Viertelstunde kappt, zeigt{" "}
              <a href="#leistungspreis" className={link}>
                Kapitel 05
              </a>
              , ausführlich die Seite{" "}
              <Link href="/gewerbespeicher" className={link}>
                Gewerbespeicher und Peak Shaving
              </Link>{" "}
              und der Ratgeber{" "}
              <Link href="/ratgeber/peak-shaving-leistungspreis" className={link}>
                Leistungspreis in Österreich senken
              </Link>
              .
            </p>
            <p>
              <strong className="text-ink-900">Elektrizitätsabgabe.</strong> 2026 beträgt die Abgabe für Unternehmen befristet{" "}
              <span className="ov-num whitespace-nowrap">{zahl(ABGABE.befristet, 2)} ct/kWh</span>, regulär{" "}
              <span className="ov-num whitespace-nowrap">{zahl(ABGABE.regulaer, 1)} ct/kWh</span>. Die Senkung läuft mit 31.12.2026 aus; der
              Finanzausschuss hat den Antrag auf Verlängerung am 29.09.2026 vertagt – die Verlängerung ist offen
              {ABGABE_HINWEIS.quelle && (
                <>
                  {" "}
                  (
                  <a href={ABGABE_HINWEIS.quelle.url} target="_blank" rel="noopener noreferrer" className={link}>
                    Parlamentskorrespondenz
                  </a>
                  )
                </>
              )}
              . Für selbst erzeugten und verbrauchten Solarstrom fällt sie in keinem Fall an.
            </p>
            <p>
              <strong className="text-ink-900">Ab 2027.</strong> Das ElWG (
              <a href={QUELLE.elwg.href} target="_blank" rel="noopener noreferrer" className={link}>
                BGBl. I Nr. 91/2025
              </a>
              ) ordnet die Netzentgelte neu. Der Begutachtungsentwurf der E-Control zur Systemnutzungsentgelte-Grundsatzverordnung (
              <a href={QUELLE.sneEntwurf.href} target="_blank" rel="noopener noreferrer" className={link}>
                SNE-G-V, {QUELLE.sneEntwurf.stand}
              </a>
              ) sieht ab 1. Jänner 2027 einen Monatsleistungspreis auf Basis des höchsten Viertelstundenwerts je Kalendermonat vor – grundsätzlich
              für jeden Entnehmer, auf Netzebene 7 zweistufig ab 10 kW – und als Zielwert binnen drei Jahren je 50 % Arbeits- und Leistungsanteil.
              Die Beträge legt die Tarifverordnung fest, die noch aussteht.
            </p>
            <Kennzeichnung>{KENNZEICHNUNG.entwurf2027}</Kennzeichnung>
            <p>
              <strong className="text-ink-900">Nicht eingerechnet</strong> sind weitere verbrauchsabhängige Bestandteile wie Förderbeiträge oder eine
              Gebrauchsabgabe; sie hängen von Netzbereich und Vertrag ab. Netzbereich und Netzebene stehen auf Ihrer Netzrechnung – die Netzebene
              legt der Netzbetreiber fest (mehr in{" "}
              <a href="#netzanschluss" className={link}>
                Kapitel 06
              </a>
              ). Den Lastgang in Viertelstundenwerten bekommen Sie über das Kundenportal Ihres Netzbetreibers:{" "}
              <Link href="/smart-meter" className={link}>
                Smart Meter und Lastgang abrufen
              </Link>
              .
            </p>
            <Kennzeichnung>{KENNZEICHNUNG.keineBeratung}</Kennzeichnung>
          </div>
        </Wissensschublade>

        {einwand && (
          <Wissensschublade titel={`Einwand: „${einwand.einwand}“`}>
            <p className="max-w-[68ch]">{einwand.antwort}</p>
            <p className="mt-3 max-w-[68ch] text-[14px] text-ink-600">
              <strong className="text-ink-900">Beleg:</strong> {einwand.beleg}
            </p>
            <p className="mt-4">
              <Link
                href={einwand.schritt.href}
                className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-[14px] font-semibold text-ink-900 transition-colors hover:bg-ink-50"
              >
                {einwand.schritt.label} →
              </Link>
            </p>
          </Wissensschublade>
        )}
      </div>

      <KapitelAusgang
        primaer={{ label: HAUPT_CTA, href: HAUPT_HREF }}
        sekundaer={{ label: "Weiter: der Leistungspreis", href: "#leistungspreis" }}
        hinweis={<span className="max-sm:hidden">Mit Ihrer Netzrechnung bekommen Sie die vier Teile in Euro je Jahr zurück.</span>}
      />
    </KapitelBuehne>
  );
}
