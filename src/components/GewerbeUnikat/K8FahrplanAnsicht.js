// src/components/GewerbeUnikat/K8FahrplanAnsicht.js
//
// K8 · Fahrplan als REINE Ansicht (ohne Hooks): dieselben Bausteine rendern den SSR-Platzhalter (K8Insel)
// und die Client-Bühne (K8FahrplanLinie) – gleiche Fläche, kein Springen beim Nachladen.
//
//  - QuerFahrplan (ab md): Tabelle „Wer macht was“ – Kopfzeile = 7 Stations-Knöpfe auf einer Linie, darunter
//    die Spuren „Ihr Beitrag / Wir / Beteiligt“, unter der Tabelle die Karte der gewählten Station.
//  - HochFahrplan (unter md): senkrechte Linie, Karten klappen unter der Station auf.
// Karteninhalte kommen als reine Daten vom Server (K8Daten.js → fahrplanDaten()) und werden hier gerendert.

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, FireExtinguisher, HardHat, Lock, PowerOff, Truck } from "lucide-react";
import { cn } from "@/components/ui/cn";

export const nn = (nr) => String(nr).padStart(2, "0");

/** Kreis einer Station (52 px quer, 44 px hoch). children ersetzt den Inhalt (Client: Schloss-Übergang). */
export function Knoten({ nr, aktiv = false, besucht = false, gesperrt = false, klein = false, ref, children }) {
  return (
    <span
      ref={ref}
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center rounded-full font-display font-extrabold transition-[background-color,color,box-shadow] duration-300",
        klein ? "h-11 w-11 text-[14px]" : "h-[52px] w-[52px] text-[15.5px]",
        aktiv
          ? "bg-white text-navy-950 shadow-[0_0_0_6px_rgba(255,255,255,0.08)]"
          : besucht
            ? "bg-navy-600 text-white group-hover:bg-navy-500"
            : "bg-navy-800 text-white/80 group-hover:bg-navy-700 group-hover:text-white"
      )}
    >
      {children ?? (gesperrt ? <Lock aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.2} /> : <span aria-hidden="true" className="ov-num">{nn(nr)}</span>)}
      {besucht && !aktiv && (
        <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ov-400 text-navy-950">
          <Check className="h-3 w-3" strokeWidth={3.2} />
        </span>
      )}
    </span>
  );
}

/** Unterzeile der Station 6: Schloss-Text bzw. nach dem Lösen die Bestätigung. */
export function SchlossZeile({ text, entsperrt, interaktiv, className }) {
  return (
    <span
      data-testid={interaktiv ? "schloss" : undefined}
      data-zustand={entsperrt ? "offen" : "zu"}
      className={cn("block text-[12.5px] leading-snug", entsperrt ? "text-ov-300" : "text-white/60", className)}
    >
      {entsperrt ? (
        <>
          <Check aria-hidden="true" className="mr-1 inline h-3.5 w-3.5 -translate-y-px" strokeWidth={3} />
          nach Netzzugang und Förderantrag
        </>
      ) : (
        text
      )}
    </span>
  );
}

const linkKlasse = "font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200";

function Facette({ titel, children, breit = false, betont = false }) {
  return (
    <div className={breit ? "sm:col-span-2" : undefined}>
      <dt className={cn("text-[12px] font-semibold uppercase tracking-[0.14em]", betont ? "text-ov-300" : "text-white/55")}>{titel}</dt>
      <dd className="mt-2.5 text-[15px] leading-relaxed text-white/80">{children}</dd>
    </div>
  );
}

function Liste({ punkte }) {
  return (
    <ul className="grid gap-2">
      {punkte.map((p) => (
        <li key={p} className="relative pl-4">
          <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-1 w-1.5 rounded-full bg-white/35" />
          {p}
        </li>
      ))}
    </ul>
  );
}

/** Station 4: Fördercall als Kalenderfakt und kommende Fristen – kein Countdown. */
function Kalender({ kalender }) {
  return (
    <div className="rounded-2xl bg-white/[0.045] p-5 sm:col-span-2">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">Im Kalender</p>
      <p className="mt-2.5 text-[15px] leading-relaxed text-white/85">
        {kalender.satz} Eingereicht wird im{" "}
        <a href={kalender.portal} target="_blank" rel="noopener noreferrer" className={linkKlasse}>
          Portal der EAG-Abwicklungsstelle
        </a>
        .
      </p>
      {kalender.fristen.length > 0 && (
        <ul className="mt-3 divide-y divide-white/[0.07] text-[14px]">
          {kalender.fristen.map((f) => (
            <li key={f.id} className="grid gap-x-3 py-2 sm:grid-cols-[minmax(0,7.4rem)_1fr]">
              <span className="ov-num text-white/60">{f.wann}</span>
              <span className="text-white/80">
                {f.titel}
                {f.voraussichtlich && <span className="text-white/55"> (voraussichtlich)</span>}{" "}
                <a
                  href={f.quelle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={f.quelle.label}
                  className="whitespace-nowrap text-white/55 underline decoration-white/25 underline-offset-2 hover:text-white"
                >
                  Quelle
                </a>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[13px] text-white/55">
        Alle Termine:{" "}
        <Link href="/forderungen/fristen" className="underline decoration-white/25 underline-offset-2 hover:text-white">
          Förderfristen-Kalender
        </Link>{" "}
        · Stand {kalender.stand}
      </p>
    </div>
  );
}

function StationBild({ className }) {
  return (
    <figure className={cn("mt-6 overflow-hidden rounded-2xl bg-white/[0.04]", className)}>
      <Image
        src="/Images/AT/ratgeber/photovoltaik-flachdach.jpg"
        alt="Photovoltaikanlage auf dem Flachdach einer Gewerbehalle in Dornbirn mit Bergpanorama"
        width={1280}
        height={720}
        loading="lazy"
        sizes="(min-width: 1280px) 440px, (min-width: 1024px) 36vw, 88vw"
        className="aspect-[16/9] h-auto w-full object-cover"
        style={{ objectPosition: "center 70%" }}
      />
      <figcaption className="px-4 py-2.5 text-[12px] leading-snug text-white/55">PV auf Industrie-Flachdach, Dornbirn (Symbolbild · Bildnachweis am Seitenende)</figcaption>
    </figure>
  );
}

/** Station 3: „Mieter der Halle?“ – Dachnutzungsvereinbarung (Zustimmung des Grundeigentümers). */
function MieterKarte({ m }) {
  return (
    <aside aria-label={m.frage} className="mt-7 rounded-2xl bg-white/[0.05] p-5 md:p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">{m.frage}</p>
      <p className="mt-2 font-display text-[17px] font-bold leading-snug text-white">{m.titel}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-white/75">{m.text}</p>
    </aside>
  );
}

const ASPEKTE = [
  { id: "kran", titel: "Kranstellplatz und Logistikwege", Icon: Truck },
  { id: "abschaltung", titel: "Abschaltungen", Icon: PowerOff },
  { id: "brandschutz", titel: "Brandschutz", Icon: FireExtinguisher },
  { id: "unterweisung", titel: "Sicherheitsunterweisung", Icon: HardHat },
];

/** Die vier Montage-Aspekte für ein Fenster (texte = MONTAGE_TEXTE[fenster]). */
export function MontageAspekte({ texte }) {
  return (
    <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {ASPEKTE.map(({ id, titel, Icon }) => (
        <li key={id} className="flex gap-3">
          <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/75">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span className="block text-[12.5px] font-semibold uppercase tracking-[0.1em] text-white/60">{titel}</span>
            <span className="mt-1 block text-[15px] leading-relaxed text-white/85">{texte[id]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Raster einer Karte: links Titel, „was passiert“, Links (und Foto bei Station 5); rechts die Facetten
 * „Was Sie liefern / Was wir tun / Rechtsgrundlage“ (Station 4 mit Kalender). `vorne` steht rechts über den
 * Facetten (Montagefenster), `oben` über der ganzen Karte (Schloss-Erklärung).
 */
export function KarteRaster({ s, kalender, oben, vorne }) {
  return (
    <>
      {oben}
      <div className="grid gap-7 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300 max-md:hidden">
            Station <span className="ov-num">{nn(s.nr)}</span> von 07
          </p>
          <h3 className="mt-3 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-white max-md:hidden">{s.titel}</h3>
          <p className="max-w-[54ch] text-[15.5px] leading-relaxed text-white/80 md:mt-3">{s.passiert}</p>
          {s.links.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
              {s.links.map((l) => (
                <Link key={l.href} href={l.href} className={linkKlasse}>
                  {l.label}
                </Link>
              ))}
            </p>
          )}
          {s.bild && <StationBild className="max-md:hidden" />}
        </div>
        <div className="lg:col-span-7">
          {vorne}
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Facette titel="Was Sie liefern" betont>
              <Liste punkte={s.sie} />
            </Facette>
            <Facette titel="Was wir tun">
              <Liste punkte={s.wir} />
            </Facette>
            <Facette titel="Rechtsgrundlage" breit>
              {s.recht}
            </Facette>
            {s.nr === 4 && kalender && <Kalender kalender={kalender} />}
          </dl>
          {s.mieter && <MieterKarte m={s.mieter} />}
          {s.bild && <StationBild className="md:hidden" />}
        </div>
      </div>
    </>
  );
}

/**
 * Quer (ab lg): Tabelle mit Knöpfen in der Kopfzeile.
 * knopfRef/knotenRef: (nr) => ref-Callback (Client), linie: SVG-Überlagerung, panel: Kartenbereich,
 * zwischen: Band zwischen Tabelle und Kartenfläche (Erkenntnis nach dem Lösen des Schlosses).
 */
export function QuerFahrplan({ stationen, spuren, aktiv, besucht = [], entsperrt, onWaehle, onTaste, knopfRef, knotenRef, kopfRef, linie, panel, zwischen, schlossKnoten, interaktiv = false }) {
  return (
    <div>
      {/* Tablet (md): schmalere Kopfspalte, kleinere Schrift und Silbentrennung – sonst laufen „unterschreiben“ oder
          „EAG-Abwicklungsstelle“ in die Nachbarspalte (Prüfung 768 px, 13.10.2026) */}
      <div ref={kopfRef} data-k8-kopf="" className="relative [--k8-kopf:76px] lg:[--k8-kopf:112px] xl:[--k8-kopf:128px]">
        {linie}
        <table className="relative w-full table-fixed border-separate border-spacing-0">
          <caption className="sr-only">Fahrplan in sieben Stationen: was passiert und wer jeweils beiträgt</caption>
          <colgroup>
            <col className="w-[var(--k8-kopf)]" />
            {stationen.map((s) => (
              <col key={s.nr} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="p-0 align-top font-normal">
                <span className="sr-only">Station</span>
              </th>
              {stationen.map((s) => {
                const ist = aktiv === s.nr;
                const gesperrt = !!s.schloss && !entsperrt;
                return (
                  <th key={s.nr} scope="col" className={cn("rounded-t-[22px] px-1 pb-4 pt-1 align-top font-normal transition-colors duration-300", ist && "bg-white/[0.04]")}>
                    <button
                      type="button"
                      ref={knopfRef?.(s.nr)}
                      id={interaktiv ? `k8-knopf-${s.nr}` : undefined}
                      data-testid={interaktiv ? `station-${s.nr}` : undefined}
                      aria-expanded={ist}
                      aria-controls={interaktiv ? `k8-karte-${s.nr}` : undefined}
                      onClick={onWaehle ? () => onWaehle(s.nr) : undefined}
                      onKeyDown={onTaste}
                      className="group flex w-full flex-col items-center gap-3 rounded-2xl px-1 pb-1 pt-2 text-center"
                    >
                      <Knoten nr={s.nr} aktiv={ist} besucht={besucht.includes(s.nr)} gesperrt={gesperrt} ref={knotenRef?.(s.nr)}>
                        {s.schloss && schlossKnoten ? schlossKnoten(ist) : undefined}
                      </Knoten>
                      <span className="hyphens-manual font-display text-[12.5px] font-bold leading-snug text-white lg:text-[13.5px] xl:text-[15px]">
                        <span className="sr-only">Station {nn(s.nr)}: </span>
                        {s.titel}
                      </span>
                      {s.schloss && <SchlossZeile text={s.schloss} entsperrt={entsperrt} interaktiv={interaktiv} className="-mt-1.5 px-1" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {spuren.map((sp, i) => {
              const letzte = i === spuren.length - 1;
              return (
                <tr key={sp.id}>
                  <th scope="row" className="border-t border-white/[0.08] py-3 pr-2 text-left align-top text-[10.5px] font-semibold uppercase leading-snug tracking-[0.1em] text-white/60 hyphens-auto lg:pr-3 lg:text-[11.5px] lg:tracking-[0.14em]">
                    {sp.label}
                  </th>
                  {stationen.map((s) => {
                    const ist = aktiv === s.nr;
                    return (
                      <td
                        key={s.nr}
                        className={cn(
                          "border-t border-white/[0.08] px-1 py-3 text-center align-top text-[12.5px] leading-snug transition-colors duration-300 hyphens-auto [overflow-wrap:break-word] lg:px-2 lg:text-[13.5px]",
                          sp.id === "sie" ? "font-semibold text-white" : "text-white/62",
                          ist && "bg-white/[0.04]",
                          ist && letzte && "rounded-b-[22px]"
                        )}
                      >
                        {s.beitrag[sp.id]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {zwischen}
      {panel}
    </div>
  );
}

/**
 * Hoch (unter lg): senkrechte Linie, Knöpfe volle Breite (≥ 64 px), Karte inline darunter.
 * karte(nr) liefert den Kartenbereich (Client: animiert); ohne karte() bleibt alles zu (Startzustand mobil).
 * nachKnopf(nr): Band direkt unter dem Stationsknopf (Erkenntnis nach dem Lösen des Schlosses).
 */
export function HochFahrplan({ stationen, aktiv, besucht = [], entsperrt, onWaehle, onTaste, knopfRef, knotenRef, listeRef, linie, karte, nachKnopf, schlossKnoten, interaktiv = false }) {
  return (
    <div ref={listeRef} className="relative">
      {linie}
      <ol className="relative">
        {stationen.map((s) => {
          const offen = aktiv === s.nr;
          const gesperrt = !!s.schloss && !entsperrt;
          return (
            <li key={s.nr} className="relative">
              <button
                type="button"
                ref={knopfRef?.(s.nr)}
                id={interaktiv ? `k8-knopf-${s.nr}` : undefined}
                data-testid={interaktiv ? `station-${s.nr}` : undefined}
                aria-expanded={offen}
                aria-controls={interaktiv ? `k8-karte-${s.nr}` : undefined}
                onClick={onWaehle ? () => onWaehle(s.nr) : undefined}
                onKeyDown={onTaste}
                className="group flex min-h-[52px] w-full items-center gap-3.5 rounded-2xl py-1 pr-1 text-left"
              >
                <Knoten nr={s.nr} klein aktiv={offen} besucht={besucht.includes(s.nr)} gesperrt={gesperrt} ref={knotenRef?.(s.nr)}>
                  {s.schloss && schlossKnoten ? schlossKnoten(offen) : undefined}
                </Knoten>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[16px] font-bold leading-snug text-white">
                    <span className="sr-only">Station {nn(s.nr)}: </span>
                    {s.titel}
                  </span>
                  {s.schloss ? (
                    <SchlossZeile text={s.schloss} entsperrt={entsperrt} interaktiv={interaktiv} className="mt-0.5" />
                  ) : (
                    <span className="mt-0.5 block text-[13px] leading-snug text-white/60">
                      Ihr Beitrag: <span className="font-semibold text-white/85">{s.beitrag.sie}</span>
                    </span>
                  )}
                </span>
                <ChevronDown aria-hidden="true" className={cn("h-5 w-5 shrink-0 text-white/60 transition-transform duration-300", offen && "rotate-180 text-white/80")} />
              </button>
              {nachKnopf ? nachKnopf(s.nr) : null}
              {karte ? karte(s.nr) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Statische Linien für den Platzhalter (der Client misst und zeichnet per SVG). */
function QuerSchiene() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-[38px] h-[2px] rounded-full bg-white/[0.12]"
      style={{ left: "calc(var(--k8-kopf) + (100% - var(--k8-kopf)) / 14)", right: "calc((100% - var(--k8-kopf)) / 14)" }}
    />
  );
}
function HochSchiene() {
  return <span aria-hidden="true" className="pointer-events-none absolute bottom-7 left-[21px] top-7 w-[2px] rounded-full bg-white/[0.12]" />;
}

/**
 * Platzhalter (SSR): Desktop zeigt Station 1 offen, mobil sind alle Stationen zu. Alle sieben Karten stehen
 * als HTML im Desktop-Bereich (sechs davon verborgen) – für Suchmaschinen und ohne JavaScript.
 */
export default function K8FahrplanAnsicht({ stationen, spuren, kalender, montage }) {
  const panel = (
    <div className="mt-6 min-h-[460px] rounded-[28px] bg-white/[0.04] p-6 lg:p-8 xl:p-10">
      {stationen.map((s) => (
        <div key={s.nr} hidden={s.nr !== 1}>
          <KarteRaster
            s={s}
            kalender={kalender}
            vorne={
              s.nr === 5 ? (
                <div className="mb-8">
                  <MontageAspekte texte={montage.offen} />
                </div>
              ) : null
            }
          />
        </div>
      ))}
    </div>
  );
  return (
    <div>
      {/* Sprungziel „Montagefenster“ bis die Bühne geladen ist (dort sitzt der Anker am Segment in Station 5) */}
      <span id="k8-montage" aria-hidden="true" className="block scroll-mt-28" />
      {/* quer ab md (Tablet: Zeitleiste statt Handy-Akkordeon, Jury 13.10.2026), darunter senkrecht */}
      <div className="max-md:hidden">
        <QuerFahrplan stationen={stationen} spuren={spuren} aktiv={1} besucht={[1]} entsperrt={false} linie={<QuerSchiene />} panel={panel} />
      </div>
      <div className="md:hidden">
        <HochFahrplan stationen={stationen} aktiv={null} entsperrt={false} linie={<HochSchiene />} />
      </div>
    </div>
  );
}
