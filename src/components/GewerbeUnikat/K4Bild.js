// src/components/GewerbeUnikat/K4Bild.js
//
// K4 · Röntgenbild – REINE Komponenten (ohne Hooks), SSR-Startzustand und Client:
//
//  K4Bild (ab lg, 1024 px): gestapelter Balken „Selbst genutzt – von der Rechnung gestrichen“ in Euro je Jahr,
//    daneben der dünne Balken „Eingespeist – Erlös“, Haarlinien-Raster, Direktbeschriftung mit Führungslinien,
//    darunter der Rechenweg (kWh × ct) und die Kilowattstunde im Vergleich (ct, Faktor). Im SSR der
//    Startzustand (schraffierter Balken mit „?“), im Client mit den fliegenden Scheiben (Render-Funktion
//    `segment`).
//    Breite Fläche (Container ≥ 36rem): Ergebnis als große Zahl im Bild, Beschriftung einzeilig.
//    Schmalere Fläche (lg-Spalte bei 1024 px): Ergebnis im Kopf, Beschriftung zweizeilig.
//
//  K4Film (Handy und Tablet hochkant, < 1024 px): derselbe Inhalt als waagrechter Streifen IN der Rechnung,
//    direkt unter den vier Zeilen – die Scheiben fliegen nur wenige Zentimeter nach unten, Zeilen und Ziel
//    passen zusammen auf den Bildschirm.
//
//  Beide tragen die Wahl der Anlage (Rechenbeispiel | Stundenmodell) – die Ursache steht neben der Wirkung.

import { QuellePille } from "./_bausteine.js";
import { BEWEGUNG, FARBE, STAND, zahl } from "./_tokens.js";
import { K4Auswahl } from "./K4Pult.js";
import { TEILE, euroZahl } from "./K4Rechnung.js";
import { cn } from "@/components/ui/cn";

/** Rasterschritt der Euro-Skala: 10.000 € bis 60.000 €, darüber 20.000 € (höchstens 6 Linien). */
export const euroSchritt = (max) => (max > 60000 ? 20000 : 10000);
/** Obergrenze der Euro-Skala: Vielfaches des Rasterschritts mit 12 % Luft, mindestens 20.000 €. */
export function euroMax(v) {
  const roh = v * 1.12;
  const s = roh > 60000 ? 20000 : 10000;
  return Math.max(20000, Math.ceil(roh / s) * s);
}
/** Obergrenze der ct-Skala (Vergleich je kWh): nächste 5er-Stufe mit 2,5 ct Luft, mindestens 20. */
export const ctMax = (summe) => Math.max(20, Math.ceil((summe + 2.5) / 5) * 5);

/** Höhe der Zeichenfläche in px (Startwert; gemessen wird per ResizeObserver – h-[250px] / @xl:h-[290px]). */
export const PLOT_PX = { schmal: 250, breit: 290 };

/**
 * Lage der Direktbeschriftungen (in % von unten): Mitte des Segments, bei Enge nach oben/unten
 * verschoben (Mindestabstand in px), innerhalb der Zeichenfläche.
 */
export function beschriftungsLagen(werte, max, plotPx, abstandPx) {
  let summe = 0;
  const mitte = werte.map((w) => {
    const m = ((summe + w / 2) / max) * plotPx;
    summe += w;
    return m;
  });
  const lage = [...mitte];
  for (let i = 1; i < lage.length; i++) lage[i] = Math.max(lage[i], lage[i - 1] + abstandPx);
  const oben = plotPx - abstandPx / 2;
  if (lage[lage.length - 1] > oben) {
    lage[lage.length - 1] = oben;
    for (let i = lage.length - 2; i >= 0; i--) lage[i] = Math.min(lage[i], lage[i + 1] - abstandPx);
  }
  const unten = abstandPx / 2;
  if (lage[0] < unten) {
    lage[0] = unten;
    for (let i = 1; i < lage.length; i++) lage[i] = Math.max(lage[i], lage[i - 1] + abstandPx);
  }
  return { mitte: mitte.map((px) => (px / plotPx) * 100), lage: lage.map((px) => (px / plotPx) * 100) };
}

/** Text für Screenreader (role="img" der Zeichenfläche bzw. des Films). */
export function bildBeschreibung(werte, jahr, roentgen) {
  if (!roentgen)
    return `Röntgenbild noch geschlossen. Der Knopf „Rechnung röntgen“ zeigt, was der selbst genutzte Solarstrom jedes Jahr von der Rechnung streicht.`;
  const teile = TEILE.map((t, i) => `${t.label} ${euroZahl(jahr.zeilen[i].gestrichen)} Euro`).join(", ");
  return `Röntgenbild: Der selbst genutzte Solarstrom streicht jedes Jahr ${euroZahl(jahr.gestrichen)} Euro von der Rechnung (${teile}). Die Einspeisung bringt ${euroZahl(jahr.erloes)} Euro. Je Kilowattstunde: ${zahl(werte.summe, 2)} Cent selbst genutzt gegenüber ${zahl(werte.ueberschussCt, 1)} Cent eingespeist, Faktor ${zahl(werte.faktor, 1)}.`;
}

const EASE = BEWEGUNG.css.aus;
const SCHRAFFUR = "repeating-linear-gradient(135deg, rgba(21,26,36,0.09) 0 1.5px, transparent 1.5px 7px)";

/** Rechenweg-Zeile: „220.500 kWh × 14,64 ct“ */
const rechenweg = (kwh, ct, stellen) => `${zahl(Math.round(kwh / 100) * 100)} kWh × ${zahl(ct, stellen)} ct`;

/**
 * Die Kilowattstunde im Vergleich (ct): selbst genutzt (gestapelt aus den vier Teilen) gegenüber eingespeist,
 * Faktor rechts. Statisch – die Zahlen ändern sich mit dem Pult.
 */
function JeKwh({ werte, faktorAnzeige, sicht, ruhig }) {
  const max = ctMax(werte.summe);
  const pct = (v) => `${(v / max) * 100}%`;
  return (
    <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-t border-ink-900/[0.08] pt-3.5">
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Je Kilowattstunde</p>
        <div className="mt-2.5 grid grid-cols-[6.6rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 text-[13px] text-ink-600">
          <span>selbst genutzt</span>
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="flex h-2.5 overflow-hidden rounded-[3px]" style={{ width: pct(werte.summe), transition: ruhig ? "none" : `width 0.32s ${EASE}` }}>
              {TEILE.map((t, i) => (
                <span key={t.id} className="block h-full" style={{ width: `${(werte.teile[i].wert / werte.summe) * 100}%`, background: t.farbe }} />
              ))}
            </span>
            <span className="ov-num shrink-0 whitespace-nowrap font-display text-[15px] font-bold text-ink-900">
              {zahl(werte.summe, 2)}
              <span className="ml-0.5 text-[0.62em] text-ink-500">ct</span>
            </span>
          </span>
          <span>eingespeist</span>
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="block h-2.5 rounded-[3px] bg-sun-400" style={{ width: pct(werte.ueberschussCt) }} />
            <span className="ov-num shrink-0 whitespace-nowrap font-display text-[15px] font-bold text-ink-900">
              {zahl(werte.ueberschussCt, 1)}
              <span className="ml-0.5 text-[0.62em] text-ink-500">ct</span>
            </span>
          </span>
        </div>
      </div>
      <div className="text-right" style={{ opacity: sicht, transition: ruhig ? "none" : `opacity 0.45s ${EASE} 0.2s` }}>
        <p className="ov-num font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] text-ov-700">
          <span className="mr-0.5 text-[0.62em]">×</span>
          {faktorAnzeige ?? zahl(werte.faktor, 1)}
        </p>
        <p className="mt-1 max-w-[9rem] text-[12px] leading-snug text-ink-500">so viel mehr wert als eingespeist</p>
      </div>
    </div>
  );
}

/**
 * werte          Ergebnis von k4Werte()
 * jahr           Ergebnis von k4Jahr()
 * anlage         { wert, optionen, lang, name? } – Wahl der Anlage im Kopf; onAnlage(id) (ohne: deaktiviert, SSR)
 * roentgen       false = Startzustand (schraffierter Balken mit „?“)
 * gezeigt        true = gelandet (Ergebnis-Zahl und Faktor sichtbar)
 * plotPx         gemessene Höhe der Zeichenfläche (Client); bestimmt Beschriftungsabstand
 * zielRef        Ref auf die Zeichenfläche (Messung, Auslösen)
 * segment        (teil, i, { unten, hoehe }) => Knoten – fliegende Scheiben (nur Client, nur im Röntgen-Zustand)
 * gestrichenAnzeige / faktorAnzeige  Knoten (Client: gleitend)
 * aktiv/onAktiv  Hervorhebung Segment ↔ Rechnungszeile
 * ruhig          reduzierte Bewegung: keine Übergänge
 * quelle         { name, url } der Netzentgelte (NETZ_QUELLE)
 */
export function K4Bild({
  werte,
  jahr,
  anlage,
  onAnlage,
  roentgen = false,
  gezeigt = false,
  plotPx = PLOT_PX.breit,
  zielRef,
  segment,
  gestrichenAnzeige,
  faktorAnzeige,
  aktiv,
  onAktiv,
  ruhig = false,
  quelle,
  eigen = false,
}) {
  const max = euroMax(Math.max(jahr.gestrichen, jahr.erloes));
  const breit = plotPx >= 290;
  const betraege = jahr.zeilen.map((z) => z.gestrichen);
  const { mitte, lage } = beschriftungsLagen(betraege, max, plotPx, breit ? 24 : 32);
  const pct = (v) => (v / max) * 100;
  const summeP = pct(jahr.gestrichen);
  const einP = pct(jahr.erloes);
  const schritt = euroSchritt(max);
  const ticks = [];
  for (let v = 0; v <= max; v += schritt) ticks.push(v);
  let lauf = 0;
  const geo = betraege.map((b) => {
    const g = { unten: pct(lauf), hoehe: pct(b) };
    lauf += b;
    return g;
  });

  const lageUebergang = ruhig ? "none" : `bottom ${BEWEGUNG.dauer.mittel}s ${EASE}, height ${BEWEGUNG.dauer.mittel}s ${EASE}, opacity 0.4s ${EASE}`;
  const einblenden = (verzoegerung) => (ruhig ? "none" : `opacity 0.45s ${EASE} ${roentgen ? verzoegerung : 0}s, bottom ${BEWEGUNG.dauer.mittel}s ${EASE}`);
  const sicht = roentgen ? 1 : 0;
  const ergebnis = gestrichenAnzeige ?? euroZahl(jahr.gestrichen);
  const minus = `${zahl(jahr.minus * 100, 1)} %`;

  return (
    <figure className="@container/bild relative m-0" aria-labelledby="k4-bild-titel">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1 basis-[15rem]">
          <p id="k4-bild-titel" className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            Röntgenbild · je Jahr
          </p>
          <p className="mt-1 text-[13px] leading-snug text-ink-600 @xl/bild:text-[13.5px]">Was der selbst genutzte Solarstrom von der Rechnung streicht</p>
        </div>
        {/* schmalere Fläche: Ergebnis im Kopf */}
        <div className="shrink-0 text-right @xl/bild:hidden" style={{ opacity: sicht, transition: einblenden(1.0) }} aria-hidden="true">
          <p className="ov-num font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] text-ov-700">
            −{ergebnis}
            <span className="ml-0.5 text-[0.55em]">€</span>
          </p>
          <p className="mt-1 text-[11.5px] leading-tight text-ink-500">je Jahr · −{minus}</p>
        </div>
        {anlage && (
          <div className="w-full @xl/bild:order-none @xl/bild:w-auto">
            <K4Auswahl
              name={anlage.name || "k4-anlage"}
              label="Anlage auf dem Dach"
              legendeVersteckt
              testid="anlage"
              wert={anlage.wert}
              optionen={anlage.optionen}
              onWahl={onAnlage}
            />
          </div>
        )}
        <p className="w-full text-[12.5px] leading-snug text-ink-500 @xl/bild:-mt-1">
          {werte.b.label}, NE {werte.ne} · {anlage?.lang}
        </p>
      </div>

      <div ref={zielRef} role="img" aria-label={bildBeschreibung(werte, jahr, roentgen)} className="relative mt-6 h-[250px] touch-pan-y select-none @xl/bild:mt-8 @xl/bild:h-[290px]">
        {/* Raster */}
        {ticks.map((v) => (
          <div key={v} aria-hidden="true" className="absolute inset-x-0" style={{ bottom: `${pct(v)}%`, transition: lageUebergang }}>
            <span className={cn("absolute left-[46px] right-0 h-px @xl/bild:left-[60px]", v === 0 ? "bg-ink-900/30" : "bg-ink-900/[0.08]")} />
            <span className="ov-num absolute left-0 w-[40px] -translate-y-1/2 text-right text-[11px] leading-none text-ink-500 @xl/bild:w-[52px]">
              {zahl(v)}
              {v === max && <span className="hidden text-[0.9em] @xl/bild:inline"> €</span>}
            </span>
          </div>
        ))}

        {/* Balken „Selbst genutzt“ */}
        <div className="absolute inset-y-0 left-[46px] w-[64px] @xl/bild:left-[60px] @xl/bild:w-[92px]">
          {/* Startzustand: schraffierter Platzhalter */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-t-[4px] bg-ink-50"
            style={{
              height: `${summeP}%`,
              backgroundImage: SCHRAFFUR,
              opacity: roentgen ? 0 : 1,
              transition: ruhig ? "none" : `opacity 0.35s ${EASE} ${roentgen ? 0.35 : 0.3}s, height ${BEWEGUNG.dauer.mittel}s ${EASE}`,
            }}
          >
            <span className="font-display text-[26px] font-extrabold text-ink-500">?</span>
          </div>
          {roentgen && segment && TEILE.map((t, i) => segment(t, i, geo[i]))}
        </div>

        {/* Summe über dem Balken */}
        <p
          aria-hidden="true"
          className="ov-num absolute left-[78px] -translate-x-1/2 whitespace-nowrap font-display text-[15px] font-extrabold leading-none tracking-[-0.02em] text-ink-900 @xl/bild:hidden"
          style={{ bottom: `calc(${summeP}% + 8px)`, opacity: sicht, transition: einblenden(0.95) }}
        >
          {euroZahl(jahr.gestrichen)}
          <span className="ml-0.5 text-[0.62em] font-bold text-ink-500">€</span>
        </p>

        {/* Startzustand: Frage neben dem leeren Balken (Hintergrund deckt die Haarlinien) */}
        <p
          aria-hidden="true"
          className="absolute left-[122px] right-[64px] rounded-md bg-white/95 px-2 py-1 text-[13.5px] leading-snug text-ink-600 @xl/bild:left-[170px] @xl/bild:right-[220px] @xl/bild:text-[14.5px]"
          style={{ bottom: `${summeP / 2}%`, transform: "translateY(50%)", opacity: roentgen ? 0 : 1, transition: ruhig ? "none" : `opacity 0.3s ${EASE}` }}
        >
          Was streicht der Solarstrom jedes Jahr von der Rechnung? Das Röntgenbild zeigt es Zeile für Zeile.
        </p>

        {/* Summen-Niveau gestrichelt bis zur Ergebnis-Zahl (nur breit) */}
        <div
          aria-hidden="true"
          className="absolute left-[152px] right-[196px] hidden border-t border-dashed border-ov-700/45 @xl/bild:block"
          style={{ bottom: `${summeP}%`, opacity: sicht, transition: einblenden(1.05) }}
        />

        {/* Führungslinien Segment → Beschriftung */}
        <svg
          aria-hidden="true"
          viewBox="0 0 10 100"
          preserveAspectRatio="none"
          className="absolute inset-y-0 left-[112px] h-full w-[8px] overflow-visible @xl/bild:left-[154px] @xl/bild:w-[14px]"
          style={{ opacity: sicht, transition: einblenden(0.75) }}
        >
          {TEILE.map((t, i) => (
            <polyline
              key={t.id}
              points={`0,${100 - mitte[i]} 10,${100 - lage[i]}`}
              fill="none"
              stroke="rgba(21,26,36,0.35)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ transition: ruhig ? "none" : `all ${BEWEGUNG.dauer.mittel}s ${EASE}` }}
            />
          ))}
        </svg>

        {/* Direktbeschriftung */}
        {TEILE.map((t, i) => (
          <div
            key={t.id}
            aria-hidden="true"
            onPointerEnter={onAktiv ? (e) => e.pointerType === "mouse" && onAktiv(t.id) : undefined}
            onPointerLeave={onAktiv ? () => onAktiv(null) : undefined}
            className="absolute left-[122px] -ml-1 whitespace-nowrap rounded bg-white/95 px-1 @xl/bild:left-[170px]"
            style={{
              bottom: `${lage[i]}%`,
              transform: "translateY(50%)",
              opacity: roentgen ? (aktiv && aktiv !== t.id ? 0.35 : 1) : 0,
              transition: einblenden(0.62 + i * 0.18),
            }}
          >
            <span className="block text-[12px] leading-tight text-ink-600 @xl/bild:inline @xl/bild:text-[13.5px]">{t.kurz}</span>
            <span className="ov-num block font-display text-[14px] font-bold leading-tight text-ink-900 @xl/bild:ml-2 @xl/bild:inline @xl/bild:text-[15px]">
              {euroZahl(jahr.zeilen[i].gestrichen)}
              <span className="ml-0.5 text-[0.62em] text-ink-500">€</span>
            </span>
          </div>
        ))}

        {/* Balken „Eingespeist“ (Amber = Überschuss/Einspeisung, als Fläche) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[calc(100%-44px)] w-[18px] rounded-t-[3px] bg-sun-400 @xl/bild:left-[calc(100%-250px)] @xl/bild:w-[22px]"
          style={{ height: `${einP}%`, transition: lageUebergang }}
        />
        <p
          aria-hidden="true"
          className="ov-num absolute left-[calc(100%-35px)] -translate-x-1/2 whitespace-nowrap font-display text-[14px] font-bold leading-none text-ink-900 @xl/bild:left-[calc(100%-239px)] @xl/bild:text-[15px]"
          style={{ bottom: `calc(${einP}% + 8px)`, transition: lageUebergang }}
        >
          +{euroZahl(jahr.erloes)}
          <span className="ml-0.5 text-[0.62em] text-ink-500">€</span>
        </p>

        {/* Ergebnis als große Zahl auf Höhe der Summe (nur breit) */}
        <div
          aria-hidden="true"
          className="absolute right-0 hidden w-[188px] @xl/bild:block"
          style={{ bottom: `${Math.min(summeP, 78)}%`, transform: "translateY(50%)", opacity: gezeigt ? 1 : 0, transition: einblenden(0.05) }}
        >
          <p className="ov-num whitespace-nowrap font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] text-ov-700">
            −{ergebnis}
            <span className="ml-1 text-[0.5em]">€</span>
          </p>
          <p className="mt-2 text-[12.5px] leading-snug text-ink-600 [hyphens:manual]">
            weniger auf der Rechnung, jedes Jahr · <span className="ov-num whitespace-nowrap">−{minus}</span>
          </p>
        </div>
      </div>

      {/* Achsenbeschriftung mit Rechenweg */}
      <div aria-hidden="true" className="relative h-[46px] text-[12px] leading-tight @xl/bild:text-[12.5px]">
        <div className="absolute left-[46px] top-2 @xl/bild:left-[60px] @xl/bild:top-2.5">
          <span className="block font-semibold text-ink-900">Selbst genutzt</span>
          <span className="ov-num block whitespace-nowrap text-ink-500">{rechenweg(jahr.eigenKwh, werte.summe, 2)}</span>
        </div>
        <div className="absolute right-0 top-2 text-right @xl/bild:right-auto @xl/bild:left-[calc(100%-239px)] @xl/bild:top-2.5 @xl/bild:-translate-x-1/2 @xl/bild:text-center">
          <span className="block whitespace-nowrap font-semibold text-ink-900">Eingespeist</span>
          <span className="ov-num block whitespace-nowrap text-ink-500">{rechenweg(jahr.einspeisKwh, werte.ueberschussCt, 1)}</span>
        </div>
      </div>

      <JeKwh werte={werte} faktorAnzeige={faktorAnzeige} sicht={gezeigt ? 1 : 0} ruhig={ruhig} />

      <figcaption className="mt-3.5 flex flex-wrap gap-2">
        <QuellePille>
          Netz:{" "}
          {quelle?.url ? (
            <a href={quelle.url} target="_blank" rel="noopener noreferrer" title={quelle.name} className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
              SNE-V-Novelle 2026
            </a>
          ) : (
            "SNE-V-Novelle 2026"
          )}{" "}
          · {STAND.werte} · Richtwert
        </QuellePille>
        <QuellePille>
          {eigen ? "Verbrauch aus Ihrem Lastgang" : "Verbrauch: synthetischer Lastgang"} · Energiepreis, Einspeisung: Annahmen
        </QuellePille>
      </figcaption>
    </figure>
  );
}

/**
 * Röntgenfilm für das Handy: waagrechter Streifen in der Rechnung (unter den vier Zeilen).
 * Die Zeilen der Rechnung tragen die Einzelbeträge („− 24.255 €“) – der Film zeigt Summe, Anteile und Erlös.
 * Darunter die Wahl der Anlage (Ursache direkt neben der Wirkung) mit dem Rechenweg.
 * anlage: { wert, optionen, kurz, name } · onAnlage(id) (ohne: deaktiviert, SSR)
 */
export function K4Film({ werte, jahr, roentgen = false, gezeigt = false, zielRef, segment, gestrichenAnzeige, ruhig = false, anlage, onAnlage, quelle }) {
  const max = euroMax(Math.max(jahr.gestrichen, jahr.erloes));
  const pct = (v) => (v / max) * 100;
  let lauf = 0;
  const geo = jahr.zeilen.map((z) => {
    const g = { links: pct(lauf), breite: pct(z.gestrichen) };
    lauf += z.gestrichen;
    return g;
  });
  const schritt = euroSchritt(max);
  const ticks = [];
  for (let v = schritt; v < max; v += schritt) ticks.push(v);
  const sicht = gezeigt ? 1 : 0;
  const ueber = ruhig ? "none" : `opacity 0.45s ${EASE}`;

  return (
    <figure aria-labelledby="k4-film-titel" className="m-0 mt-2 rounded-2xl bg-white px-3.5 pb-2.5 pt-2.5 shadow-[0_1px_2px_rgba(21,26,36,0.05)]">
      <div className="flex items-end justify-between gap-3">
        <p id="k4-film-titel" className="text-[11.5px] font-semibold uppercase leading-tight tracking-[0.14em] text-ov-700">
          Röntgenbild
          <span className="mt-0.5 block text-[12.5px] font-normal normal-case tracking-normal text-ink-600">Solarstrom streicht je Jahr</span>
        </p>
        <p aria-hidden="true" className="ov-num whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-[-0.02em] text-ov-700" style={{ opacity: sicht, transition: ueber }}>
          −{gestrichenAnzeige ?? euroZahl(jahr.gestrichen)}
          <span className="ml-0.5 text-[0.6em]">€</span>
        </p>
      </div>

      <div ref={zielRef} role="img" aria-label={bildBeschreibung(werte, jahr, roentgen)} className="relative mt-2.5 h-7 touch-pan-y select-none">
        <div aria-hidden="true" className="absolute inset-0 rounded-[5px] bg-ink-50" />
        {ticks.map((v) => (
          <span key={v} aria-hidden="true" className="absolute inset-y-0 w-px bg-ink-900/[0.08]" style={{ left: `${pct(v)}%` }} />
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 flex items-center justify-center rounded-[5px] bg-ink-50"
          style={{
            width: `${pct(jahr.gestrichen)}%`,
            backgroundImage: SCHRAFFUR,
            opacity: roentgen ? 0 : 1,
            transition: ruhig ? "none" : `opacity 0.35s ${EASE} ${roentgen ? 0.35 : 0.3}s, width ${BEWEGUNG.dauer.mittel}s ${EASE}`,
          }}
        >
          <span className="rounded bg-white/90 px-1.5 font-display text-[15px] font-extrabold leading-tight text-ink-500">?</span>
        </div>
        {roentgen && segment && TEILE.map((t, i) => segment(t, i, geo[i]))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span aria-hidden="true" className="block h-2.5 shrink-0 rounded-[3px] bg-sun-400" style={{ width: `${pct(jahr.erloes)}%`, transition: ruhig ? "none" : `width 0.32s ${EASE}` }} />
        <span className="ov-num whitespace-nowrap text-[12px] font-semibold text-ink-700">+{euroZahl(jahr.erloes)} € Einspeisung</span>
      </div>
      {anlage ? (
        <div className="mt-2 border-t border-ink-900/[0.07] pt-2">
          <K4Auswahl
            name={anlage.name || "k4-anlage"}
            label="Anlage auf dem Dach"
            legendeVersteckt
            voll
            testid="anlage"
            wert={anlage.wert}
            optionen={anlage.optionen}
            onWahl={onAnlage}
          />
          <p className="ov-num mt-1.5 text-[11px] leading-snug text-ink-500 @md/rechnung:text-[12px]">
            {anlage.kurz} → <span className="whitespace-nowrap">{rechenweg(jahr.eigenKwh, werte.summe, 2)}</span>
          </p>
        </div>
      ) : (
        <p className="ov-num mt-1.5 text-[11.5px] leading-snug text-ink-500">{rechenweg(jahr.eigenKwh, werte.summe, 2)} selbst genutzt</p>
      )}
      <figcaption className="mt-2">
        <QuellePille className="px-2.5 text-[11.5px]">
          {quelle?.url ? (
            <a href={quelle.url} target="_blank" rel="noopener noreferrer" title={quelle.name} className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
              SNE-V 2026
            </a>
          ) : (
            "SNE-V 2026"
          )}{" "}
          · {STAND.werte} · Richtwert
        </QuellePille>
      </figcaption>
    </figure>
  );
}

/** Farbe eines Teils (für Client-Segmente). */
export const teilFarbe = (id) => TEILE.find((t) => t.id === id)?.farbe ?? FARBE.ink500;
