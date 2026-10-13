// src/components/GewerbeUnikat/Hero.js
//
// Erstes Kapitel der Unikat-Seite /gewerbe: „Eine Woche Ihres Betriebs“ (Konzept GEWERBE-UNIKAT.md, „hero“).
// Seit der Entscheidung des Inhabers (12.10.2026, 23:55) steht darüber der Standard-Seitenkopf (PageHero in
// src/app/gewerbe/page.js mit Breadcrumbs, H1, Unterzeile und CTAs wie auf allen Lösungsseiten); diese
// Komponente rendert deshalb KEINE H1 mehr, sondern die dunkle Bühne direkt darunter.
// SERVER-Komponente. Der Wochen-Puls (SVG) wird hier aus beispielServer().puls gerechnet und als HTML
// ausgeliefert; vier kleine Client-Inseln ohne Animationsbibliothek ergänzen Fadenkreuz, Rollen-Weiche,
// mobile Daumenleiste und Kapitel-Schiene. Alle Texte stehen ohne JS.
//
// Daten: synthetischer Beispielbetrieb (src/lib/lastgang/beispiel.js), PV 280 kWp Ost-West Linz (PVGIS-
// Monatssummen, Tagesverlauf aus Sonnenstand, Wetter synthetisch) – offen gekennzeichnet. Kurzantwort aus
// dem Rechenbeispiel BEISPIEL_ERGEBNIS (300 kWp, Netzebene 6, OÖ). Keine Zahl ist fest im Code.

import { ArrowRight } from "lucide-react";
import { BEISPIEL_ERGEBNIS } from "./_beispiel";
import { Kennzeichnung, QuellePille } from "./_bausteine";
import { beispielServer } from "./_server";
import { KENNZEICHNUNG, STAND, zahl } from "./_tokens";
import { pulsGeometrie } from "./HeroGeometrie";
import { pulsStarten } from "./HeroStart";
import HeroPuls from "./HeroPuls";
import HeroRollen from "./HeroRollen";
import DaumenLeiste from "./DaumenLeiste";
import KapitelSchiene from "./KapitelSchiene";
import s from "./Hero.module.css";

const BEREICH_NAME = { ooe: "Oberösterreich", sbg: "Salzburg", wien: "Wien", noe: "Niederösterreich", stmk: "Steiermark", ktn: "Kärnten", tirol: "Tirol", vbg: "Vorarlberg", bgld: "Burgenland" };
const BEREICH_KURZ = { ooe: "OÖ", sbg: "Sbg.", wien: "Wien", noe: "NÖ", stmk: "Stmk.", ktn: "Ktn.", tirol: "Tirol", vbg: "Vbg.", bgld: "Bgld." };
const AUSRICHTUNG = { ostwest: "Ost-West", sued: "Süd", flach: "flach aufgeständert" };
const ORT = { linz: "Linz" };
const MONAT = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Seitenweit: Auf /gewerbe ersetzt die DaumenLeiste die globale mobile Handlungsleiste (MobileCta).
// DaumenLeiste setzt body[data-gewerbe-daumen] nur, solange sie eingebunden ist – ohne sie greift nichts.
// Der Rückruf-Knopf bleibt links neben der Leiste sichtbar (die globale Regel blendet ihn sonst aus,
// solange MobileCta „sichtbar“ ist); bei fokussiertem Formularfeld tritt er weiter zurück.
// Sprungziele: html hat global scroll-padding-top 7rem (112 px), die Kopfzeile ist beim Scrollen 68 px hoch.
// Die Bühnen (KapitelBuehne, geteilt) tragen zusätzlich scroll-mt-24 – zusammen 208 px, das Ziel wirkte
// verfehlt. Auf dieser Seite beginnt eine Bühne direkt unter der Kopfzeile (112 − 44 = 68 px); ihr eigener
// Innenabstand oben (64–96 px) bleibt die Luft (QA 13.10.2026; an die Verantwortlichen von _bausteine.js gemeldet).
// Ab md (Tablet) steht die DaumenLeiste nicht (die Kopfzeile trägt dort den CTA, Jury 13.10.2026) – die globale
// MobileCta bleibt bis lg trotzdem aus, damit es nicht zwei CTAs gibt; „Nach oben“ tritt nur unter md zurück.
const SEITEN_CSS = `@media (max-width:1023px){body[data-gewerbe-daumen] .ov-mobile-cta{display:none!important}body[data-gewerbe-daumen].ov-cta-sichtbar:not(:has(:is(input,textarea,select):focus)) .ov-rueckruf-launcher.opacity-100{opacity:1!important;pointer-events:auto!important}}@media (max-width:767px){body[data-gewerbe-daumen=sichtbar] button[aria-label="Nach oben"]{opacity:0!important;pointer-events:none!important}}[data-seite="gewerbe-unikat"] section[data-kapitel]{scroll-margin-top:-2.75rem}`;

// Startet die Aufbau-Animation des Wochen-Pulses erst, wenn die Grafik zu ~35 % sichtbar ist (läuft beim
// Parsen, vor der Hydrierung; ohne JS bzw. bei reduzierter Bewegung bleibt das Endbild stehen).
const PULS_START = `(${pulsStarten.toString()})(document.getElementById("hero-puls"))`;

const MWh = (kwh) => zahl(kwh / 1000, 1);
/** CSS-Variablen für die Beschriftungen: Zahlen werden zu Prozent der Grafikfläche. */
const lage = (o) => Object.fromEntries(Object.entries(o).map(([k, w]) => [`--${k}`, typeof w === "number" ? `${w}%` : w]));

export default function Hero({ v }) {
  const { puls, kennzahlen, ueberschussRuhe: ruheAnteil } = beispielServer();
  const geo = puls ? pulsGeometrie(puls, kennzahlen.grundlast) : null;

  // Vorbelegung der Rollen-Weiche aus der Zielgruppen-Variante (nur Markierung, kein Scrollen)
  const vorschlag = ["cfo", "leistungspreis"].includes(v.id) ? "cfo" : ["speicher", "halle"].includes(v.id) ? "technik" : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SEITEN_CSS }} />
      {/* Erstes eigenes Kapitel direkt unter dem Standard-Seitenkopf (PageHero in page.js, Entscheidung des
          Inhabers vom 12.10.2026): Breadcrumbs, H1, Unterzeile und Haupt-CTA stehen dort wie auf allen
          Lösungsseiten. Diese Bühne schließt dunkel an den Seitenkopf an und trägt Wochen-Puls und Rollen-Weiche. */}
      <section id="start" data-kapitel="hero" data-ton="dunkel" aria-labelledby="hero-puls-titel" className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div aria-hidden="true" className={`${s.licht} pointer-events-none absolute inset-0 -z-10`} />

        <div className="ov-container relative pb-12 pt-10 md:pb-20 md:pt-14">
          {geo && <WochenPuls geo={geo} puls={puls} kennzahlen={kennzahlen} ruheAnteil={ruheAnteil} />}
          {geo && <script dangerouslySetInnerHTML={{ __html: PULS_START }} />}

          <HeroRollen vorschlag={vorschlag} />
        </div>
      </section>

      <Kurzantwort />

      <DaumenLeiste />
      <KapitelSchiene />
    </>
  );
}

/* ---------------------------------------------------------------------------------------------------
   Wochen-Puls (SVG serverseitig, Client-Insel HeroPuls nur für Fadenkreuz, Tastatur und Sonne-Schalter)
   --------------------------------------------------------------------------------------------------- */

function LegendenEintrag({ klasse, farbe, label, wert }) {
  // Mobil: kleine Kachel (Farbe + Wert, darunter das Wort), ab sm: gefüllte Pille in einer Zeile
  return (
    <li className={`${klasse} flex min-w-0 flex-col justify-center rounded-xl bg-white/[0.07] px-2.5 py-2 text-[12px] leading-tight text-white/75 sm:min-h-9 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:px-3 sm:py-0 sm:text-[13px]`}>
      <span className="flex items-center gap-1.5 sm:order-2">
        <span className="inline-flex sm:hidden">{farbe}</span>
        <span className="ov-num font-semibold text-white">
          {wert}
          <span className="ml-0.5 text-[0.85em] font-medium text-white/60"> MWh</span>
        </span>
      </span>
      <span className="mt-1 flex items-center gap-2 sm:order-1 sm:mt-0">
        <span className="hidden sm:inline-flex">{farbe}</span>
        {label}
      </span>
    </li>
  );
}

function WochenPuls({ geo, puls, kennzahlen, ruheAnteil }) {
  const { pfade, marken, tage, summen, rasterKw } = geo;
  const pvInfo = kennzahlen.pv;
  const ort = ORT[pvInfo?.ortId] || "Linz";
  const ausrichtung = AUSRICHTUNG[pvInfo?.ausrichtung] || "Ost-West";
  const kwp = zahl(puls.kwp);
  const spitzeKw = zahl(marken.spitze.kw);
  const grundKw = zahl(kennzahlen.grundlast);
  const d0 = tage[0];
  const d6 = tage[tage.length - 1];
  const start = new Date(puls.tage[0].t);
  const monat = MONAT[start.getUTCMonth()];
  const zeitraum = `${d0.kurz} ${d0.datum.split(".")[0]}. – ${d6.kurz} ${d6.datum.split(".")[0]}. ${monat} ${start.getUTCFullYear()}`;
  const spitzeZeit = marken.spitze.text.split(" ")[1];

  const kopf = (
    <div className="min-w-0 xl:flex-1">
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{`Wochen-Puls · ${zahl(puls.last.length)} Viertelstunden`}</p>
      {/* Signatur-Moment der Seite: Überschrift in Kapitelgröße (ov-h2), nicht kleiner als die Kapitel (Jury 13.10.2026) */}
      <h2 id="hero-puls-titel" className="ov-h2 mt-3 text-balance text-white">Eine Woche Ihres Betriebs</h2>
      <p className="mt-3 max-w-[72ch] text-[14.5px] leading-snug text-white/65 md:mt-4 md:text-[15.5px]">
        <strong className="font-semibold text-white">Wir legen nach diesen Werten aus, nicht nach der Dachfläche.</strong>
        {` Hier: synthetischer Beispielbetrieb, ${zeitraum}, Sonne ${kwp} kWp ${ausrichtung} in ${ort}.`}
      </p>
    </div>
  );

  const legende = (
    <ul className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2 xl:shrink-0 xl:flex-nowrap" aria-label="Legende mit Wochensummen">
      <LegendenEintrag
        key="last"
        klasse={s.chipLast}
        label="Verbrauch"
        wert={MWh(summen.verbrauch)}
        farbe={
          <span aria-hidden="true" className="relative h-3 w-4 shrink-0 rounded-[3px] bg-navy-500/50">
            <span className="absolute inset-x-0 top-0 h-[2px] rounded bg-white" />
          </span>
        }
      />
      <LegendenEintrag key="genutzt" klasse={`${s.chipGenutzt} ${s.chipSonne}`} label="Sonne genutzt" wert={MWh(summen.genutzt)} farbe={<span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[3px] bg-ov-400" />} />
      <LegendenEintrag key="uebrig" klasse={`${s.chipUebrig} ${s.chipSonne}`} label="Sonne übrig" wert={MWh(summen.uebrig)} farbe={<span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[3px] bg-sun-300" />} />
    </ul>
  );

  const grafik = (
    <div className="absolute inset-0">
      {/* (a) Raster, Ruhetage */}
      <svg aria-hidden="true" focusable="false" className={s.ebene} viewBox="0 0 672 320" preserveAspectRatio="none">
        {geo.ruhe.map((d) => (
          <rect key={d} x={d * puls.slots} y="0" width={puls.slots} height="300" fill="#ffffff" fillOpacity="0.025" />
        ))}
        <path d={pfade.raster} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
        <path d={pfade.tage} stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
        <path d="M0 300H672" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
      {/* (a) Lastfläche – wird mit der Linie „geschrieben“ */}
      <svg aria-hidden="true" focusable="false" className={`${s.ebene} ${s.schreiben}`} viewBox="0 0 672 320" preserveAspectRatio="none">
        <path className={s.lastFlaeche} d={pfade.flaeche} fill="#1f5aa1" fillOpacity="0.22" />
      </svg>
      {/* (b) Sonne genutzt, (c) Sonne übrig – die Sonne wischt danach über die Woche */}
      <svg aria-hidden="true" focusable="false" className={`${s.ebene} ${s.sonne} ${s.wisch}`} viewBox="0 0 672 320" preserveAspectRatio="none">
        <path className={s.genutzt} d={pfade.genutzt} fill="#8cba58" fillOpacity="0.85" />
        <path className={s.uebrig} d={pfade.uebrig} fill="#ffd873" fillOpacity="0.9" />
      </svg>
      {/* Grundlast-Bezug + (d) Lastlinie */}
      <svg aria-hidden="true" focusable="false" className={`${s.ebene}`} viewBox="0 0 672 320" preserveAspectRatio="none">
        <path className="hidden md:inline" d={pfade.grundlast} stroke="#ffffff" strokeOpacity="0.38" strokeWidth="1" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
      <svg aria-hidden="true" focusable="false" className={`${s.ebene} ${s.schreiben}`} viewBox="0 0 672 320" preserveAspectRatio="none">
        <path d={pfade.linie} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
      <div aria-hidden="true" className={`${s.kante} ${s.stift}`} />
      <div aria-hidden="true" className={s.kante} />

      {/* Achse (kW) – mobil nur der mittlere Wert: oben hängt die Feiertags-Marke, unten rechts die Sonntagssonne */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {rasterKw.map((r, i) => (
          <span
            key={r.kw}
            className={`${s.achse} ov-num px-1 text-[11px] font-medium text-white/60 md:text-[11.5px] ${i === Math.floor((rasterKw.length - 1) / 2) ? "" : "max-md:hidden"}`}
            style={lage({ y: r.y })}
          >
            {`${zahl(r.kw)}\u00a0kW`}
          </span>
        ))}
      </div>

      {/* Direktbeschriftungen ①, ③, ④ (HTML über der Grafik; mobil nur ①). ② – die Feiertags-Frage –
          ist ein Knopf und steht deshalb in der Client-Insel HeroPuls. */}
      <div className={`${s.marken} pointer-events-none absolute inset-0`}>
        <span aria-hidden="true" className={`${s.punkt} ${s.marke} h-2.5 w-2.5 rounded-full bg-sun-500 ring-2 ring-white`} style={lage({ x: marken.spitze.x, y: marken.spitze.y })} />
        <span className={`${s.labelSpitze} max-w-[46%] md:max-w-none`} style={lage({ x: marken.spitze.x, y: marken.spitze.y })}>
          <span className={`${s.marke} block text-[11.5px] font-semibold leading-tight text-white md:whitespace-nowrap md:text-[13px]`} style={{ "--i": 0 }}>
            <span className="max-md:block">{marken.spitze.text}</span>
            <span className="max-md:hidden"> · </span>
            <span className="text-sun-500">{`Anlaufspitze ${spitzeKw} kW`}</span>
          </span>
        </span>

        <span className={`${s.labelGrund} hidden md:block`} style={lage({ x: marken.grundlast.x, labelY: marken.grundlast.labelY })}>
          <span className={`${s.marke} block text-center text-[12px] font-medium leading-tight text-white/75`} style={{ "--i": 2 }}>
            <span className="block">Grundlast</span>
            <span className="ov-num block whitespace-nowrap">{`≈ ${grundKw} kW`}</span>
          </span>
        </span>

        {marken.schicht && (
          <span className={`${s.sonnenMarke} hidden lg:block`}>
            <span aria-hidden="true" className={`${s.leitlinieSchicht} ${s.marke}`} style={{ ...lage({ x: marken.schicht.x, y: marken.schicht.y, labelY: marken.schicht.labelY }), "--i": 3 }} />
            <span aria-hidden="true" className={`${s.punkt} ${s.marke} h-2 w-2 rounded-full bg-ov-300 ring-2 ring-navy-950`} style={{ ...lage({ x: marken.schicht.x, y: marken.schicht.y }), "--i": 3 }} />
            <span className={s.labelSchicht} style={lage({ x: marken.schicht.x, labelY: marken.schicht.labelY })}>
              <span className={`${s.marke} block whitespace-nowrap text-[13px] font-semibold text-ov-300`} style={{ "--i": 3 }}>
                Sonne trifft Schicht
              </span>
            </span>
          </span>
        )}
      </div>
    </div>
  );

  const tagesleiste = (
    <ol aria-label="Tage der Woche" className="mt-2 grid grid-cols-7 text-center text-[11.5px] leading-tight md:text-[12.5px]">
      {tage.map((t) => (
        <li key={t.datum} className={t.ruhe ? "text-white/50" : "text-white/75"}>
          <span className="font-semibold">{t.kurz}</span> <span className="ov-num max-sm:hidden">{t.datum}</span>
          <span className="ov-num sm:hidden">{t.datum.split(".")[0]}.</span>
          {t.name && (
            <span className="mt-0.5 block">
              <span className="relative left-1/2 inline-block -translate-x-1/2 whitespace-nowrap font-semibold text-sun-300">{t.name}</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );

  const caption = (
    <figcaption id="hero-puls-text" className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="max-w-[78ch] text-[13.5px] leading-relaxed text-white/60">
        {`Eine ${monat}woche im synthetischen Beispielbetrieb (2 Schichten Mo–Fr): werktags Anlaufspitze um ${spitzeZeit} (bis ${spitzeKw} kW), mittags deckt eine ${ausrichtung}-Anlage mit ${kwp} kWp einen Großteil der Last; am Feiertag und am Wochenende bleibt Sonne übrig. Grundlast ≈ ${grundKw} kW.`}
      </div>
      <div className="grid gap-1.5">
        <Kennzeichnung key="synthetisch" dunkel>
          {KENNZEICHNUNG.synthetischKurz}
        </Kennzeichnung>
        <Kennzeichnung key="pv" dunkel>
          {KENNZEICHNUNG.pvModell}
        </Kennzeichnung>
      </div>
    </figcaption>
  );

  const ariaLabel = `Wochen-Puls: Verbrauch und Sonne des synthetischen Beispielbetriebs, ${zeitraum}. Pfeiltasten links und rechts verschieben die Ablesung um eine Stunde, mit Umschalttaste um einen Tag, Pos1 und Ende springen an Anfang und Ende, Esc blendet die Ablesung aus.`;

  return (
    <HeroPuls
      daten={geo.kodiert}
      oben={geo.oben}
      start={puls.spitze.i}
      slots={puls.slots}
      tage={tage.map((t) => ({ kurz: t.kurz, datum: t.datum, name: t.name, ruhe: t.ruhe }))}
      feiertag={marken.feiertag}
      ruheAnteil={ruheAnteil}
      ariaLabel={ariaLabel}
      className="min-w-0"
      kopf={kopf}
      legende={legende}
      tagesleiste={tagesleiste}
      caption={caption}
    >
      {grafik}
    </HeroPuls>
  );
}

/* ---------------------------------------------------------------------------------------------------
   Kurzantwort (Antwortblock für Snippets und KI-Antworten)
   --------------------------------------------------------------------------------------------------- */

function Kurzantwort() {
  const e = BEISPIEL_ERGEBNIS;
  const a = e.eingaben;
  const jahr = zahl(Math.round(e.jahr / 10) * 10);
  const amort = zahl(e.amortisation, 1);
  const ifb = zahl(Math.round(e.ifbWirkung / 100) * 100);
  const ct = zahl(e.vermiedenCt, 2);
  const faktor = zahl(e.faktor, 1);
  const ifbProzent = zahl(a.ifbSatz * 100);
  const bereich = BEREICH_NAME[a.bereich] || a.bereich;
  const kacheln = [
    { wert: `≈\u00a0${jahr}`, einheit: "€", proJahr: true, label: "Überschuss vor Steuern" },
    { wert: `≈\u00a0${amort}`, einheit: "Jahre", label: "statische Amortisation" },
    { wert: `≈\u00a0${ifb}`, einheit: "€", label: `Steuerwirkung Öko-IFB ${ifbProzent}\u00a0%` },
  ];
  const rechenweg = (
    <a href="#wirtschaftlichkeit" className="group inline-flex items-center gap-1.5 font-semibold text-ov-700 underline-offset-4 hover:text-ov-800 hover:underline">
      Rechenweg prüfen
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );

  return (
    <section id="kurzantwort" data-kapitel="kurzantwort" data-ton="sand" aria-labelledby="kurzantwort-titel" className="relative bg-sand-50 py-8 text-ink-900 md:py-20">
      <div className="ov-container grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-x-16 lg:gap-y-8">
        <div className="min-w-0">
          <h2 id="kurzantwort-titel" className="ov-h2 max-w-[24ch] text-balance text-ink-900 max-sm:text-[24px]! max-[359px]:text-[22px]!">
            Kurz beantwortet: Lohnt sich Photovoltaik für Ihren Betrieb?
          </h2>
          <p className="mt-3 max-w-[65ch] text-[15px] leading-[1.5] text-ink-700 max-[359px]:text-[14.5px] max-[359px]:leading-[1.45] md:mt-6 md:text-[16.5px] md:leading-relaxed">
            <strong className="font-semibold text-ink-900">Ja, wenn Ihr Betrieb tagsüber Strom braucht.</strong> Jede selbst genutzte Kilowattstunde spart Energiepreis,
            Netz-Arbeitsentgelt, Netzverlust und Elektrizitätsabgabe – im Rechenbeispiel ({zahl(a.kwp)} kWp, Netzebene {a.ne}, {bereich}){" "}
            <span className="ov-num whitespace-nowrap">{`${ct} ct`}</span> netto, rund <span className="whitespace-nowrap"><span className="ov-num">{faktor}</span>-mal</span> so viel wie eine
            eingespeiste. Daraus ergeben sich <span className="ov-num whitespace-nowrap">{`≈ ${jahr} €`}</span> Überschuss im Jahr und{" "}
            <span className="ov-num whitespace-nowrap">{`≈ ${amort} Jahre`}</span> statische Amortisation; der Öko-Investitionsfreibetrag von <span className="whitespace-nowrap">{`${ifbProzent}\u00a0%`}</span> wirkt mit{" "}
            <span className="ov-num whitespace-nowrap">{`≈ ${ifb} €`}</span> (Anschaffung bis 31.12.2026). Die Größe folgt dem Lastgang, nicht der Dachfläche – den Leistungspreis
            senken planbar Speicher und Lastmanagement.<span className="sm:hidden"> {rechenweg}</span>
          </p>
        </div>

        <dl className="grid min-w-0 grid-cols-3 gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:grid-cols-1 lg:gap-0 lg:self-start">
          {kacheln.map((k) => (
            <div key={k.label} className="flex min-w-0 flex-col lg:border-t lg:border-ink-900/[0.08] lg:py-5 lg:first:border-t-0 lg:first:pt-1">
              <dt className="order-2 mt-1.5 text-[12px] leading-snug text-ink-600 md:text-[13.5px]">
                {k.proJahr ? (
                  <>
                    <span className="sm:hidden">Überschuss pro Jahr</span>
                    <span className="max-sm:hidden">{k.label}</span>
                  </>
                ) : (
                  k.label
                )}
              </dt>
              <dd className="order-1 whitespace-nowrap font-display proportional-nums text-[18px] font-extrabold leading-none tracking-[-0.03em] text-ink-900 sm:text-[26px] lg:text-[34px]">
                {k.wert}
                <span className="ml-1 text-[0.55em] font-bold text-ink-500">
                  {k.einheit}
                  {k.proJahr && <span className="max-sm:hidden">/Jahr</span>}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 lg:col-start-1 lg:row-start-2">
          <QuellePille>{`Beispiel · ${zahl(a.kwp)} kWp · Netzebene ${a.ne} · ${BEREICH_KURZ[a.bereich] || a.bereich} · ${STAND.werte} · kein Angebot`}</QuellePille>
          <span className="hidden min-h-11 items-center text-[14.5px] sm:inline-flex">{rechenweg}</span>
        </div>
      </div>
    </section>
  );
}
