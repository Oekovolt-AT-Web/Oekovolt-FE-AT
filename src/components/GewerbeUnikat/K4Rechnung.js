// src/components/GewerbeUnikat/K4Rechnung.js
//
// K4 · Röntgen der Stromrechnung – REINE Bausteine (ohne Hooks, ohne "use client"):
//  - Rechenhilfen: k4Werte() (die vier Arbeitspreis-Teile je kWh), k4Jahr() (Jahresrechnung des Betriebs und
//    was der selbst genutzte Solarstrom davon streicht), anlageWerte(), imBereich() (Präposition je Netzbereich)
//  - K4Rechnung: die Jahresrechnung als Papierkarte – Zeilen mit ct/kWh, Balken und Euro je Jahr, darunter der
//    Leistungspreis („bleibt – Kapitel 05“) und die Jahressumme vorher/nachher. Im SSR als Startzustand, im
//    Client mit fliegenden Scheiben (der Solaranteil jeder Zeile hebt ab und fliegt ins Röntgenbild).
//  - K4Gerippe: Raster der Bühne (Rechnung | Röntgenbild | Karte | Pult) – SSR-Platzhalter und Client benutzen
//    DASSELBE Raster, damit beim Nachladen nichts springt (CLS 0).
//
// Netzentgelte kommen als Tabelle aus der Server-Hülle (netzpreise() aus src/lib/rechner/peakshaving.js je
// Bereich und Netzebene) – so landet peakshaving.js nicht im Client-Bündel.

import { RotateCcw, ScanLine } from "lucide-react";
import { BEISPIEL } from "./_beispiel.js";
import { FARBE, STAND, zahl } from "./_tokens.js";
import { cn } from "@/components/ui/cn";

/** Elektrizitätsabgabe Unternehmen (ct/kWh): 2026 befristet gesenkt, regulär 1,5. */
export const ABGABE = { befristet: BEISPIEL.abgabeCt, regulaer: 1.5 };

/** Energiepreis-Regler (ct/kWh netto). */
export const ENERGIE = { min: 6, max: 25, schritt: 0.1, start: BEISPIEL.energieCt };

/**
 * Die vier Teile in Stapel-Reihenfolge (unten → oben).
 * Farben: Energie = ov (Wert der selbst genutzten kWh), Netz = Blau-Familie (Netzbezug), Abgabe = ink-500
 * (neutral: Staat, weder Netz noch Energie). Amber bleibt seitenweit für Überschuss/Einspeisung reserviert –
 * der dünne Balken „Eingespeist“ steht direkt daneben. ink-500 hebt sich von navy-300 (Netzverlust) in der
 * Helligkeit deutlich ab und hat auf Weiß 5,3:1.
 */
export const TEILE = [
  { id: "energie", label: "Energiepreis (Liefervertrag)", kurz: "Energiepreis", farbe: FARBE.ov500, stellen: 2 },
  { id: "netz", label: "Netznutzungsentgelt Arbeitspreis", kurz: "Netznutzung", farbe: FARBE.navy500, stellen: 2 },
  { id: "verlust", label: "Netzverlustentgelt", kurz: "Netzverlust", farbe: FARBE.navy300, stellen: 3 },
  { id: "abgabe", label: "Elektrizitätsabgabe", kurz: "Elektrizitäts­abgabe", farbe: FARBE.ink500, stellen: 2 },
];

/** Netzebenen mit Kurzbeschreibung (wie bisher in src/app/gewerbe/page.js, NETZEBENEN). */
export const NETZEBENEN_K4 = [
  { id: 5, label: "NE 5", text: "Mittelspannung, meist kundeneigene Trafostation", kurz: "Mittelspannung" },
  { id: 6, label: "NE 6", text: "Anschluss an der Trafostation des Netzbetreibers (Niederspannungsseite)", kurz: "Trafostation des Netzbetreibers" },
  { id: 7, label: "NE 7", text: "Niederspannung 400 V, Hausanschluss oder eigener Anschlusskasten", kurz: "Niederspannung 400 V" },
];

export const netzEintrag = (netz, id) => netz.find((b) => b.id === id) || netz.find((b) => b.id === BEISPIEL.bereich) || netz[0];

/** Präposition + Artikel je Netzbereich: „in der Steiermark“, „im Burgenland“, „im Stadtnetz Graz“, „in Tirol“. */
const IM_BEREICH = { steiermark: "in der Steiermark", burgenland: "im Burgenland" };
export const imBereich = (b) => IM_BEREICH[b.id] || (b.stadt ? `im Stadtnetz ${b.label}` : `in ${b.label}`);
/** Satzanfang groß: „In der Steiermark …“ */
export const ImBereich = (b) => {
  const t = imBereich(b);
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Euro ganzzahlig mit Tausenderpunkt (ohne Zeichen). */
export const euroZahl = (n) => zahl(Math.round(n));

/**
 * Werte des Röntgenbilds je kWh.
 * @param {{ netz: object[], bereich: string, ne: number, energieCt: number, abgabeCt: number, ueberschussCt?: number }} p
 */
export function k4Werte({ netz, bereich, ne, energieCt, abgabeCt, ueberschussCt = BEISPIEL.ueberschussCt }) {
  const b = netzEintrag(netz, bereich);
  const ebene = [5, 6, 7].includes(Number(ne)) ? Number(ne) : BEISPIEL.ne;
  const p = b.ne[ebene] || b.ne[6];
  const teile = [
    { id: "energie", wert: energieCt },
    { id: "netz", wert: p.ap },
    { id: "verlust", wert: p.nv },
    { id: "abgabe", wert: abgabeCt },
  ];
  const summe = teile.reduce((s, t) => s + t.wert, 0);
  return { b, ne: ebene, teile, summe, faktor: ueberschussCt > 0 ? summe / ueberschussCt : null, ueberschussCt, lp: p.lp, ap: p.ap, nv: p.nv };
}

/** Anlage des Rechenbeispiels (300 kWp, 1.050 kWh/kWp Innviertel, 70 % Eigenverbrauch). */
export const ANLAGE_BEISPIEL = Object.freeze({ id: "beispiel", kwp: BEISPIEL.kwp, ertrag: BEISPIEL.ertragKwhKwp, evQuote: BEISPIEL.evQuote });

/** Erzeugung, Eigenverbrauch, Einspeisung (kWh/Jahr) und Betriebskosten (€/Jahr, Marktannahme 800 €/kWp × 1,5 %). */
export function anlageWerte(a) {
  const erzeugtKwh = a.kwp * a.ertrag;
  return {
    ...a,
    erzeugtKwh,
    eigenKwh: erzeugtKwh * a.evQuote,
    einspeisKwh: erzeugtKwh * (1 - a.evQuote),
    betriebEuro: a.kwp * BEISPIEL.investKwp * BEISPIEL.betriebAnteil,
  };
}

/**
 * Jahresrechnung des Betriebs und was der selbst genutzte Solarstrom davon streicht – in ganzen Euro;
 * Summen sind Summen der gerundeten Zeilen (die Spalten gehen auf).
 * @param {ReturnType<typeof k4Werte>} werte
 * @param {{ verbrauchKwh: number, lpKw: number, anlage: { kwp:number, ertrag:number, evQuote:number } }} p
 */
export function k4Jahr(werte, { verbrauchKwh, lpKw, anlage }) {
  const a = anlageWerte(anlage);
  const eigen = Math.max(0, Math.min(a.eigenKwh, verbrauchKwh));
  const anteil = verbrauchKwh > 0 ? eigen / verbrauchKwh : 0;
  const zeilen = werte.teile.map((t) => {
    const euro = Math.round((verbrauchKwh * t.wert) / 100);
    const gestrichen = Math.round((eigen * t.wert) / 100);
    return { id: t.id, ct: t.wert, euro, gestrichen, rest: euro - gestrichen };
  });
  const lpEuro = Math.round(werte.lp * lpKw);
  const arbeit = zeilen.reduce((s, z) => s + z.euro, 0);
  const gestrichen = zeilen.reduce((s, z) => s + z.gestrichen, 0);
  const summe = arbeit + lpEuro;
  const erloes = Math.round((a.einspeisKwh * werte.ueberschussCt) / 100);
  const betrieb = Math.round(a.betriebEuro);
  return {
    anlage: a,
    verbrauchKwh,
    eigenKwh: eigen,
    einspeisKwh: a.einspeisKwh,
    anteil,
    zeilen,
    lp: { kw: lpKw, satz: werte.lp, euro: lpEuro, ct: verbrauchKwh > 0 ? (lpEuro * 100) / verbrauchKwh : 0 },
    summe,
    summeNach: summe - gestrichen,
    gestrichen,
    minus: summe > 0 ? gestrichen / summe : 0,
    erloes,
    betrieb,
    ueberschuss: gestrichen + erloes - betrieb,
    gedeckelt: a.eigenKwh > verbrauchKwh,
  };
}

/** Maßstab der Zeilenbalken (ct, die den Balkenplatz ganz füllen): mindestens 16 ct, sonst die größte Zeile. */
export const balkenSkala = (werte, jahr) => Math.max(16, ...werte.teile.map((t) => t.wert), jahr.lp.ct);
/** Breite des Rechnungsbalkens in % des Balkenplatzes. */
export const balkenBreite = (ct, skala) => Math.max(0, Math.min(100, (ct / skala) * 100));

function unterzeile(id, werte, abgabeCt) {
  if (id === "energie") return "Ihr Liefervertrag · Annahme";
  if (id === "netz") return `SNE-V 2026 · ${werte.b.betreiber}`;
  if (id === "verlust") return "SNE-V 2026 · § 6";
  return abgabeCt < ABGABE.regulaer ? "ElAbgG · 2026 befristet gesenkt" : "ElAbgG · regulärer Satz";
}

/** Statische Solar-Scheibe am Ende des Zeilenbalkens (SSR, Startzustand). */
function ScheibeStatisch({ teil, breite }) {
  return <span className="ml-[1.5px] block h-2 min-w-[3px] rounded-r-full" style={{ width: `${breite}%`, background: teil.farbe }} />;
}

/** Schraffur „bleibt“ (Leistungspreis) – hell, damit sie nicht wie ein Rechnungsteil im Röntgenbild aussieht. */
const SCHRAFFUR = "repeating-linear-gradient(135deg, rgba(21,26,36,0.32) 0 1.5px, rgba(21,26,36,0.08) 1.5px 4.5px)";

/**
 * Jahresrechnung als Papierkarte. Werte stehen als <dl> (Textalternative zum Röntgenbild).
 *
 * werte         Ergebnis von k4Werte()
 * jahr          Ergebnis von k4Jahr()
 * betrieb       { eigen: boolean } – eigener Lastgang (nach Gate in K1) oder synthetischer Beispielbetrieb
 * abgabeCt      gewählter Abgabesatz (für die Unterzeile)
 * roentgen      true = die Solar-Scheiben sind ins Röntgenbild geflogen (im Balken bleibt ein Abdruck)
 * gezeigt       true = gelandet: Zeilen zeigen den Rest und „− x €“, die Summe vorher/nachher
 * scheibe       (teil, i, breite) => Knoten – Client: m.span mit layoutId; ohne: statische Scheibe
 * euroAnzeige   (wert) => Knoten – Client: gleitende Zahl; ohne: Text
 * film          Knoten unter den vier Zeilen (Röntgenbild schmal, nur Handy)
 * knopf         Knoten unter der Rechnung (Röntgen-Knopf)
 * strahl        Knoten über den Zeilen (Röntgen-Strahl)
 * zeilenRef     Ref auf die vier Zeilen (Auslösen erst, wenn Zeilen und Ziel im Bild sind)
 * aktiv/onAktiv Hervorhebung Zeile ↔ Segment
 */
export function K4Rechnung({
  werte,
  jahr,
  betrieb,
  abgabeCt,
  roentgen = false,
  gezeigt = false,
  scheibe,
  euroAnzeige,
  ctSummeAnzeige,
  film,
  knopf,
  strahl,
  zeilenRef,
  aktiv,
  onAktiv,
  ruhig = false,
}) {
  const skala = balkenSkala(werte, jahr);
  const rest = 1 - jahr.anteil;
  const sicht = gezeigt ? 1 : 0;
  const ueber = ruhig ? "none" : "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
  const euro = (v) => (euroAnzeige ? euroAnzeige(v) : euroZahl(v));
  const mwh = zahl(jahr.verbrauchKwh / 1000);

  return (
    <article
      aria-labelledby="k4-rechnung-titel"
      className="@container/rechnung relative rounded-[22px] bg-sand-50 px-4 pb-4 pt-4 shadow-[0_1px_2px_rgba(21,26,36,0.06),0_22px_44px_-22px_rgba(21,26,36,0.32)] @2xs/rechnung:px-5 @md/rechnung:px-7 @md/rechnung:pb-6 @md/rechnung:pt-6"
    >
      <header className="relative">
        <div className="min-w-0 pr-16">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">{betrieb?.eigen ? "Ihr Lastgang" : "Beispielbetrieb"}</p>
          <h3 id="k4-rechnung-titel" className="mt-1 font-display text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink-900 @md/rechnung:text-[19px]">
            Stromrechnung für ein Jahr
          </h3>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-ink-600">
          <span className="ov-num whitespace-nowrap">{mwh} MWh</span>
          {betrieb?.eigen ? " aus Ihrem Lastgang" : " synthetisch"} · {werte.b.label}, <span className="whitespace-nowrap">NE {werte.ne}</span>
          <span className="hidden @md/rechnung:inline"> · netto</span>
        </p>
        <span className="absolute right-0 top-0 -rotate-3 rounded-md bg-ink-100 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-500">
          Muster<span className="sr-only">rechnung, Beispiel</span>
        </span>
      </header>

      <div className="relative mt-3 @md/rechnung:mt-4">
        {strahl}
        <dl ref={zeilenRef}>
          {TEILE.map((t, i) => {
            const z = jahr.zeilen[i];
            const breite = balkenBreite(z.ct, skala);
            return (
              <div
                key={t.id}
                data-teil={t.id}
                onPointerEnter={onAktiv ? (e) => e.pointerType === "mouse" && onAktiv(t.id) : undefined}
                onPointerLeave={onAktiv ? () => onAktiv(null) : undefined}
                className={cn(
                  "-mx-2 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5 rounded-lg px-2 py-1 transition-colors duration-200 @2xs/rechnung:gap-x-3 @md/rechnung:gap-x-4 @md/rechnung:py-2.5",
                  i > 0 && "border-t border-ink-900/[0.07]",
                  aktiv === t.id && "bg-white"
                )}
              >
                <dt className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-snug text-ink-900 [hyphens:manual] @md/rechnung:text-[14.5px]">
                    <span className="@md/rechnung:hidden">{t.kurz}</span>
                    <span className="hidden @md/rechnung:inline">{t.label}</span>
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-ink-500">
                    <span className="ov-num font-semibold text-ink-700">{zahl(z.ct, t.stellen)} ct</span>
                    <span>/kWh</span>
                    <span className="hidden @md/rechnung:inline"> · {unterzeile(t.id, werte, abgabeCt)}</span>
                  </span>
                </dt>
                <dd aria-hidden="true" className="flex h-2 w-11 items-center @2xs/rechnung:w-[64px] @md/rechnung:w-28">
                  <span
                    className="block h-2 min-w-[2px] rounded-l-full"
                    style={{ width: `${breite * rest}%`, background: t.farbe, transition: ruhig ? "none" : "width 320ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                  {roentgen ? (
                    <span className="ml-[1.5px] block h-2 min-w-[3px] rounded-r-full bg-ink-900/[0.08]" style={{ width: `${breite * jahr.anteil}%` }} />
                  ) : scheibe ? (
                    scheibe(t, i, breite * jahr.anteil)
                  ) : (
                    <ScheibeStatisch teil={t} breite={breite * jahr.anteil} />
                  )}
                </dd>
                <dd className="min-w-[4.6rem] text-right @md/rechnung:min-w-[5.6rem]">
                  <span className="ov-num block whitespace-nowrap font-display text-[15.5px] font-bold leading-tight tracking-[-0.01em] text-ink-900 @md/rechnung:text-[16.5px]">
                    {euro(gezeigt ? z.rest : z.euro)}
                    <span className="ml-0.5 text-[0.62em] font-bold text-ink-500">€</span>
                  </span>
                  <span className="ov-num block h-4 whitespace-nowrap text-[12px] font-semibold leading-4 text-ov-700" style={{ opacity: sicht, transition: ueber }}>
                    <span className="sr-only">{gezeigt ? ", davon gestrichen durch Solarstrom " : ""}</span>
                    {gezeigt && z.gestrichen > 0 ? "−" : ""}
                    {euroZahl(z.gestrichen)} €
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {film}

      <dl className="mt-1 border-t border-ink-900/[0.07]">
        <div className="-mx-2 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5 px-2 py-1 @2xs/rechnung:gap-x-3 @md/rechnung:gap-x-4 @md/rechnung:py-2.5">
          <dt className="min-w-0">
            <span className="block text-[14px] font-semibold leading-snug text-ink-600 @md/rechnung:text-[14.5px]">Leistungspreis</span>
            <span className="ov-num mt-0.5 block text-[12px] leading-snug text-ink-500">
              {zahl(jahr.lp.kw, 1)} kW × {zahl(jahr.lp.satz, 2)} €<span className="hidden @md/rechnung:inline">/kW · Ø Monatsspitze</span>
            </span>
          </dt>
          <dd aria-hidden="true" className="flex h-2 w-11 items-center @2xs/rechnung:w-[64px] @md/rechnung:w-28">
            <span className="block h-2 min-w-[3px] rounded-full" style={{ width: `${balkenBreite(jahr.lp.ct, skala)}%`, backgroundImage: SCHRAFFUR }} />
          </dd>
          <dd className="min-w-[4.6rem] text-right @md/rechnung:min-w-[5.6rem]">
            <span className="ov-num block whitespace-nowrap font-display text-[15.5px] font-bold leading-tight tracking-[-0.01em] text-ink-600 @md/rechnung:text-[16.5px]">
              {euroZahl(jahr.lp.euro)}
              <span className="ml-0.5 text-[0.62em] font-bold text-ink-500">€</span>
            </span>
            <a
              href="#leistungspreis"
              className="relative block h-4 whitespace-nowrap text-[12px] font-semibold leading-4 text-ink-600 underline decoration-ink-300 underline-offset-2 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-ink-900"
            >
              bleibt<span className="hidden @2xs/rechnung:inline"> – Kap. 05</span>
              <span className="sr-only"> – wie ein Speicher ihn senkt, zeigt Kapitel 05</span>
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-0.5 border-t border-ink-900/40 pt-2.5 @md/rechnung:pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[14px] font-semibold text-ink-900">
            Jahr netto<span className="sr-only">, Summe der Stromrechnung</span>
          </p>
          <p className="ov-num whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-[-0.02em] text-ink-900" data-testid="k4-jahr-summe">
            <span
              className="mr-2 hidden align-[0.12em] text-[14px] font-bold text-ink-500 line-through decoration-ink-400 @2xs/rechnung:inline"
              style={{ opacity: sicht, transition: ueber }}
              aria-hidden={!gezeigt}
            >
              <span className="sr-only">vorher </span>
              {euroZahl(jahr.summe)} €
            </span>
            {gezeigt && <span className="sr-only">mit Solarstrom </span>}
            {euro(gezeigt ? jahr.summeNach : jahr.summe)}
            <span className="ml-1 text-[0.55em] font-bold text-ink-500">€</span>
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[12.5px] leading-snug">
          <p className="text-ink-500">
            Arbeitspreise{" "}
            <span className="ov-num whitespace-nowrap font-semibold text-ink-900" data-testid="kwh-summe">
              {ctSummeAnzeige ?? zahl(werte.summe, 2)} ct
            </span>
            /kWh
          </p>
          <p className="ov-num whitespace-nowrap font-semibold text-ov-700" style={{ opacity: sicht, transition: ueber }} aria-hidden={!gezeigt}>
            −{euroZahl(jahr.gestrichen)} € · −{zahl(jahr.minus * 100, 1)} %
          </p>
        </div>
      </div>

      {knopf}
    </article>
  );
}

/**
 * Röntgen-Knopf unter der Rechnung. Ohne onClick (SSR-Platzhalter) deaktiviert, gleiche Größe.
 */
export function K4Knopf({ roentgen = false, onClick }) {
  return (
    <div className="mt-3 @md/rechnung:mt-5">
      <button
        type="button"
        data-testid="roentgen"
        onClick={onClick}
        disabled={!onClick}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[15px] font-semibold transition-colors duration-200 max-sm:w-full",
          roentgen ? "bg-ink-100 text-ink-900 hover:bg-ink-200" : "bg-navy-950 text-white hover:bg-navy-800",
          !onClick && "cursor-default"
        )}
      >
        {roentgen ? (
          <RotateCcw aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
        ) : (
          <ScanLine aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
        )}
        {roentgen ? "Zurück zur Rechnung" : "Rechnung röntgen"}
      </button>
    </div>
  );
}

/**
 * Raster der Bühne – identisch im SSR-Platzhalter und im Client.
 * Handy (< md): Rechnung (mit Röntgenfilm darin) → Karte → Erkenntnis (live, zugleich Ergebnis über den
 *   Reglern) → Pult. Das große Röntgenbild entfällt – der Film in der Rechnung ist seine Hochkant-Variante.
 * Tablet hochkant (md, < lg): Rechnung mit Film → Erkenntnis → Karte | Pult.
 * Ab lg: links Rechnung, Karte, Pult (Eingaben); rechts Röntgenbild und Erkenntnis, beim Scrollen stehend.
 * Die rechte Spalte ist unter lg `display: contents`, damit ihre Teile getrennt einsortiert werden.
 */
export function K4Gerippe({ rechnung, bild, erkenntnis, karte, pult }) {
  return (
    // overflow-anchor: none – WebKit springt sonst beim Tausch Platzhalter → Bühne um bis zu 900 px (Scroll-Anker im ersetzten Raster)
    <div className="grid grid-cols-1 gap-y-4 [overflow-anchor:none] md:grid-cols-2 md:gap-y-6 md:gap-x-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-x-14 lg:gap-y-10">
      <div className="order-1 min-w-0 md:col-span-2 lg:order-none lg:col-span-1 lg:col-start-1 lg:row-start-1">{rechnung}</div>
      {/* stehend nur, wenn die rechte Spalte ganz in den Bildschirm passt (≈ 800 px unter dem Seitenkopf) */}
      <div className="contents lg:top-24 lg:z-10 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:block lg:self-start lg:[@media(min-height:900px)]:sticky">
        <div className="order-2 hidden min-w-0 lg:block">{bild}</div>
        {/* fester Platz für den Erkenntnis-Satz: erscheint nach dem ersten Röntgen ohne Layout-Sprung */}
        <div className="order-4 min-h-[104px] min-w-0 md:order-3 md:col-span-2 md:min-h-[92px] lg:mt-6 lg:min-h-[124px]">{erkenntnis}</div>
      </div>
      <div className="order-3 min-w-0 md:order-4 lg:order-none lg:col-start-1 lg:row-start-2">{karte}</div>
      <div className="order-5 min-w-0 lg:order-none lg:col-start-1 lg:row-start-3">{pult}</div>
    </div>
  );
}

/** Kurzform für Stand-Hinweise im Kapitel. */
export const K4_STAND = `${STAND.werte} · Richtwert`;
