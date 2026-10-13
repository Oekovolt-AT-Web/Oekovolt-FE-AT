// src/components/GewerbeUnikat/K1Lastgang.js
//
// K1 · „Lastgang verstehen: 35.040 Viertelstunden sind der Fingerabdruck Ihres Betriebs“ (Server-Hülle).
// Konzept: docs/projekt-doku/anhang/wellen/GEWERBE-UNIKAT.md, Abschnitt 7 (K1).
//
// Server rendert: Kopf, SSR-Platzhalter der Teppich-Bühne (gleiche Maße), figcaption und Kennzahlen mit den
// Zahlen des synthetischen Beispielbetriebs (beispielServer), Wissensschublade mit Monats-Tabelle (Text-
// Alternative, SEO) und den Kapitel-Ausgang. Interaktiv (Client, in Bildschirmnähe nachgeladen):
// K1Teppich (Canvas, fünf Linsen, Fadenkreuz) und K1EigenerLastgang (Upload hinter Lead-Gate Stufe 2).

import Link from "next/link";
import { REGIONEN } from "@/data/regionen";
import { HINWEIS_DATENSCHUTZ, SMART_METER_BETREIBER, betreiberPfad } from "@/data/smartmeter";
import { PS_ANNAHMEN } from "@/lib/rechner/peakshaving";
import { DatenTabelle, KapitelAusgang, KapitelBuehne, KapitelKopf, QuellePille, Wissensschublade } from "./_bausteine";
import { beispielServer } from "./_server";
import { HAUPT_CTA, HAUPT_HREF, mitThema } from "./_cta";
import { KENNZEICHNUNG, QUELLE, STAND, prozent, zahl } from "./_tokens";
import K1Insel, { K1UploadInsel } from "./K1Insel";
import { K1Bildtext, K1Folgen, K1Kennzahlen } from "./K1Live";
import { EIGEN_ANKER, MONATE_KURZ, MONATE_LANG, PanelPlatzhalter, TeppichPlatzhalter, datumSatz, datumTM, minutenVon, uhrzeit } from "./K1Gestell";

const LINK = "font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200";

export default function K1Lastgang() {
  const bsp = beispielServer();
  const k = bsp.kennzahlen;
  const start = {
    quelle: "beispiel",
    jahresverbrauch: k.jahresverbrauch,
    spitzeKw: k.spitzeKw,
    spitzeT: k.spitzeT,
    grundlast: k.grundlast,
    benutzungsdauer: k.benutzungsdauer,
    mittelMonatsspitze: k.mittelMonatsspitze,
    anteilFrei: k.anteilFrei,
    hochgerechnet: false,
  };
  const minuten = k.monate.map((m) => minutenVon(m.spitzeT));
  const von = uhrzeit(Math.min(...minuten));
  const bis = uhrzeit(Math.max(...minuten));
  const spitzeZeit = uhrzeit(minutenVon(k.spitzeT));
  const ueber90 = zahl(k.stundenUeber90, 1);
  const mitPv = bsp.monatsspitzenMitPv;

  // „Was daraus folgt“ – Brücke zu Kapitel 03 und 05 (nur Beispielbetrieb, Werte aus dem Modell)
  const folgen = [
    {
      kopf: "Leistungspreis",
      text: `Alle ${k.monate.length} Monatsspitzen fallen auf ${von}/${bis} Uhr, wenn die Sonne kaum liefert. PV mit ${zahl(mitPv.kwp)} kWp senkt ihr Mittel nur von ${zahl(k.mittelMonatsspitze, 1)} auf ${zahl(mitPv.mittel, 1)} kW.`,
      href: "#leistungspreis",
      link: "Kapitel 05 · Leistungspreis senken",
    },
    {
      kopf: "Grundlast",
      text: `Die Grundlast von ≈ ${zahl(k.grundlast)} kW nimmt an jedem Tag Sonnenstrom auf – auch am Wochenende und im Betriebsurlaub.`,
      href: "#eigenverbrauch",
      link: "Kapitel 03 · Anlagengröße",
    },
    {
      kopf: "Freie Tage",
      text: `${prozent(k.anteilFrei)} des Stroms fließen an freien Tagen. Bei ${zahl(mitPv.kwp)} kWp fallen ${prozent(bsp.ueberschussRuhe)} des Überschusses an, wenn der Betrieb ruht.`,
      href: "#eigenverbrauch",
      link: "Kapitel 03 · Eigenverbrauch",
    },
  ];

  // Mobil kurz (Spalte ≈ 295 px breit, die Pointe 06:00/06:15 muss ohne Wischen sichtbar sein), ab md lang
  const kurzLang = (kurz, lang) => (
    <>
      <span className="md:hidden">{kurz}</span>
      <span className="hidden md:inline">{lang}</span>
    </>
  );
  const zeilen = k.monate.map((m) => {
    const d = new Date(m.spitzeT);
    return {
      monat: kurzLang(MONATE_KURZ[m.monat], `${MONATE_LANG[m.monat]} ${m.jahr}`),
      mwh: zahl(m.kwh / 1000, 1),
      spitze: zahl(m.spitzeKw, 1),
      zeit: kurzLang(`${d.getUTCDate()}.${d.getUTCMonth() + 1}. ${uhrzeit(minutenVon(m.spitzeT))}`, `${datumTM(m.spitzeT)} · ${uhrzeit(minutenVon(m.spitzeT))}`),
    };
  });

  const beispielKurz = "365 Tage × 96 Viertelstunden – je heller die Zelle, desto höher die Leistung.";
  const beispielText = `Lastgang-Teppich des synthetischen Beispielbetriebs (2 Schichten Mo–Fr, Samstagvormittag, Betriebsurlaub im August und zum Jahreswechsel): 365 Tage × 96 Viertelstunden des Jahres 2025 – je heller die Zelle, desto höher die Leistung. Jahresverbrauch ${zahl(k.jahresverbrauch / 1000)} MWh, Jahresspitze ${zahl(k.spitzeKw)} kW am ${datumTM(k.spitzeT)} um ${spitzeZeit}, Grundlast ≈ ${zahl(k.grundlast)} kW; alle ${k.monate.length} Monatsspitzen liegen zwischen ${von} und ${bis} Uhr, ${prozent(k.anteilFrei)} des Stroms fließen an Samstagen, Sonn- und Feiertagen. Alle Monatswerte stehen in der Tabelle unter „Lastgang lesen“.`;

  const saetze = [
    `Jahresspitze ${zahl(k.spitzeKw)} kW am ${datumSatz(k.spitzeT)} um ${spitzeZeit} – beim Schichtbeginn.`,
    `Alle ${k.monate.length} Monatsspitzen liegen zwischen ${von} und ${bis} Uhr; nur ${ueber90} Stunden im Jahr liegen über 90 % der Spitze.`,
    `${prozent(k.anteilFrei)} des Stroms fließen an Samstagen, Sonn- und Feiertagen.`,
    `Nachts läuft der Betrieb nie auf null: Grundlast ≈ ${zahl(k.grundlast)} kW (im Beispiel IT, Kühlung, Druckluft).`,
    "Sonne und Schicht treffen sich werktags mittags – an Wochenenden, Feiertagen und im Betriebsurlaub bleibt Sonne übrig.",
  ];

  const betreiber = SMART_METER_BETREIBER.map((b) => ({ slug: b.slug, kurz: b.kurz, bundesland: b.bundesland, pfad: betreiberPfad(b.slug) }));
  const ortNamen = Object.fromEntries(Object.entries(REGIONEN).map(([slug, r]) => [slug, r.name]));

  return (
    <KapitelBuehne id="k1" anker="lastgang" ton="dunkel">
      <KapitelKopf
        dunkel
        form="ziffer"
        nummer="01"
        frage="Technik fragt: Wann braucht unser Betrieb den Strom wirklich?"
        titel="Lastgang verstehen: 35.040 Viertelstunden sind der Fingerabdruck Ihres Betriebs"
        lead="Ein Lastgang zeigt jede Viertelstunde eines Jahres. Darin steckt, was die Anlage später entscheidet: Schichtbeginn, Pausen, Wochenenden, Betriebsurlaub und Grundlast."
        zier={
          <div aria-hidden="true" className="max-md:hidden">
            <p className="ov-num font-display text-[clamp(4.25rem,2.4rem+8vw,10rem)] font-extrabold leading-[0.82] tracking-[-0.055em] text-white">35.040</p>
            <p className="mt-3 flex items-center gap-3 text-[13.5px] leading-snug text-white/60">
              <span className="h-px w-8 bg-ov-400" />
              Viertelstunden in einem Jahr – 365 Tage × 96 Messwerte
            </p>
          </div>
        }
      />

      <figure className="mt-6 md:mt-14">
        <K1Insel platzhalter={<TeppichPlatzhalter herkunft={KENNZEICHNUNG.synthetischKurz} />} ortNamen={ortNamen} />
        <K1Bildtext start={start} beispielText={beispielText} beispielKurz={beispielKurz} />
      </figure>

      <div className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:gap-10 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-14">
        <div className="min-w-0">
          <K1Kennzahlen start={start} />
          {/* nur ab xl: füllt die Spalte neben dem Panel; die Werte stehen mobil in Schublade und Kapiteln 03/05 */}
          <K1Folgen beispiel={folgen} beispielPille={`Beispielbetrieb (synthetisch) · PV im Modell: Linz, Ost-West · ${STAND.werte} · ${KENNZEICHNUNG.richtwert}`} linkKlasse={LINK} />
        </div>
        <div id={EIGEN_ANKER} className="min-w-0">
          <K1UploadInsel platzhalter={<PanelPlatzhalter hinweis={HINWEIS_DATENSCHUTZ} />} betreiber={betreiber} hinweisDatenschutz={HINWEIS_DATENSCHUTZ} />
        </div>
      </div>

      <Wissensschublade dunkel className="mt-6 md:mt-12" titel="Lastgang lesen – Begriffe, Regeln und die Werte des Beispielbetriebs">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-[65ch] space-y-4">
            <h3 className="font-display text-[17px] font-bold text-white">Was ein Lastgang ist</h3>
            <p>
              Ein Lastgang ist die Leistung am Zählpunkt in festen Abständen – in Österreich als Viertelstundenwerte: 96 Werte je Tag, 35.040 je Jahr (im Schaltjahr
              35.136). Jede Zelle des Teppichs ist ein solcher Wert.
            </p>
            <p>
              Betriebe mit mehr als {zahl(PS_ANNAHMEN.messpflichtKwh)} kWh Jahresverbrauch oder über {PS_ANNAHMEN.messpflichtKw} kW Anschlussleistung werden in der Regel mit
              Lastprofilzähler gemessen (Leistungsmessung). Dann liegt der Lastgang beim Netzbetreiber vor, meist als Export im Kundenportal. Mit Smart Meter gibt es
              Viertelstundenwerte, sobald sie aktiviert sind –{" "}
              <Link href="/smart-meter" className={LINK}>
                Anleitungen je Netzbetreiber
              </Link>
              .
            </p>
            {/* Interne Links je Netzbetreiber (SEO-Plan: /smart-meter/<betreiber>) – auch ohne JS im HTML */}
            <p className="text-[14px] leading-relaxed">
              Lastgang-Export beim Netzbetreiber:{" "}
              {betreiber.map((b, i) => (
                <span key={b.slug}>
                  {i > 0 && " · "}
                  <Link href={b.pfad} className={LINK}>
                    {b.kurz}
                  </Link>
                </span>
              ))}
            </p>
            <h3 className="pt-2 font-display text-[17px] font-bold text-white">Begriffe</h3>
            <dl className="space-y-3">
              <div>
                <dt className="font-semibold text-white">Grundlast</dt>
                <dd>Das 5-%-Quantil aller Viertelstundenwerte: Diese Leistung fließt fast immer – nachts, am Wochenende, im Betriebsurlaub. Einzelne Ausreißer verfälschen sie nicht.</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Jahresspitze und Monatsspitze</dt>
                <dd>Die höchste Viertelstunde des Jahres bzw. des Monats.</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Mittel der Monatsspitzen</dt>
                <dd>
                  Darauf beruht bei Leistungsmessung bis Ende 2026 der Leistungspreis des Netzentgelts. Was sich ab 2027 ändern soll, zeigt{" "}
                  <a href="#leistungspreis" className={LINK}>
                    Kapitel 05
                  </a>
                  .
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Benutzungsdauer</dt>
                <dd>Jahresverbrauch ÷ Jahresspitze in Stunden. Hoch heißt gleichmäßige Last, niedrig heißt kurze, hohe Spitzen.</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Tagtypen</dt>
                <dd>
                  Werktag (Mo–Fr), Samstag, Sonn- und Feiertag. Gesetzliche Feiertage nach{" "}
                  <a href={QUELLE.arg.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {QUELLE.arg.titel}
                  </a>
                  .
                </dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0 space-y-5">
            <h3 className="font-display text-[17px] font-bold text-white">Was der Teppich des Beispielbetriebs zeigt</h3>
            <ul className="space-y-2.5">
              {saetze.map((s) => (
                <li key={s} className="relative pl-5">
                  <span aria-hidden="true" className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-ov-400" />
                  {s}
                </li>
              ))}
            </ul>
            <DatenTabelle
              dunkel
              className="[&_table]:min-w-0"
              caption="Monatsverbrauch und Monatsspitzen des Beispielbetriebs 2025"
              spalten={[
                { key: "monat", label: "Monat" },
                { key: "mwh", label: "MWh", rechts: true },
                { key: "spitze", label: kurzLang("kW", "Spitze kW"), rechts: true },
                { key: "zeit", label: kurzLang("Zeit", "Zeitpunkt"), rechts: true },
              ]}
              zeilen={zeilen}
            />
            <QuellePille dunkel>
              Synthetischer Beispiel-Lastgang 2025 (keine Messdaten) · eigene Auswertung · {STAND.werte} · {KENNZEICHNUNG.richtwert}
            </QuellePille>
          </div>
        </div>
      </Wissensschublade>

      <KapitelAusgang
        dunkel
        primaer={{ label: HAUPT_CTA, href: mitThema(HAUPT_HREF, "lastgang") }}
        sekundaer={{ label: "Lastgang selbst analysieren", href: "/lastgang-analyse" }}
        hinweis="Mit oder ohne Lastgang: Ohne Datei reichen Jahresverbrauch und Netzrechnung für die erste Einschätzung."
      />
    </KapitelBuehne>
  );
}
