"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowDownRight, ArrowUpRight, Calculator, Clock, Sparkles } from "lucide-react";
import useEnergyLive from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";
import { dynamischBrutto, TARIF_ANNAHMEN } from "@/lib/energy";

/**
 * Live-Börsenstrompreis (Day-Ahead, Gebotszone AT) für heute und – sobald veröffentlicht –
 * morgen, stündlich gemittelt. Hebt das günstigste 3-Stunden-Fenster hervor.
 * Server liefert einen Startwert (SEO, kein leerer Zustand), der Client aktualisiert.
 */

const TZ = "Europe/Vienna";
const fmtTag = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ });
const fmtStunde = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" });
const fmtDatum = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
const fmtUhrzeit = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const FENSTER = 3;

const ct = (n, s = 1) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

/** Punkte (15 min) -> Stundenwerte je Kalendertag (österreichische Zeit) */
function stundenJeTag(punkte) {
  const tage = new Map();
  for (const p of punkte) {
    const tag = fmtTag.format(new Date(p.t));
    const std = Number(fmtStunde.formatToParts(new Date(p.t)).find((x) => x.type === "hour")?.value) % 24;
    if (!tage.has(tag)) tage.set(tag, new Map());
    const m = tage.get(tag);
    // Schlüssel mit Startzeit, damit die doppelte Stunde bei Zeitumstellung getrennt bleibt
    const schluessel = `${std}-${Math.floor(p.t / 3600000)}`;
    if (!m.has(schluessel)) m.set(schluessel, { std, t: Math.floor(p.t / 3600000) * 3600000, summe: 0, n: 0 });
    const e = m.get(schluessel);
    e.summe += p.eurMwh;
    e.n += 1;
  }
  const aus = {};
  for (const [tag, m] of tage) {
    aus[tag] = [...m.values()].sort((a, b) => a.t - b.t).map((e) => ({ std: e.std, t: e.t, eurMwh: e.summe / e.n }));
  }
  return aus;
}

function guenstigstesFenster(stunden) {
  if (stunden.length < FENSTER) return null;
  let best = null;
  for (let i = 0; i <= stunden.length - FENSTER; i++) {
    const s = stunden.slice(i, i + FENSTER).reduce((a, b) => a + b.eurMwh, 0) / FENSTER;
    if (!best || s < best.avg) best = { start: i, avg: s };
  }
  return best;
}

function schoeneTicks(min, max) {
  const spanne = max - min || 1;
  const roh = spanne / 4;
  const basis = Math.pow(10, Math.floor(Math.log10(roh)));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * basis).find((s) => spanne / s <= 5) || basis * 10;
  const t = [];
  for (let v = Math.floor(min / schritt) * schritt; v <= max + 1e-9; v += schritt) t.push(Math.round(v * 100) / 100);
  return t;
}

export default function BoersenpreisChart({ initial }) {
  const live = useEnergyLive({ voll: true, intervall: 10 * 60000 });
  const preis = live?.preis?.punkte?.length ? live.preis : initial;
  const stand = live?.stand || initial?.stand;

  const [tagWahl, setTagWahl] = useState("heute");
  const [modus, setModus] = useState("boerse"); // boerse | endpreis
  const [hover, setHover] = useState(null);
  const [jetzt, setJetzt] = useState(null);
  const [schmal, setSchmal] = useState(false);

  // Auf schmalen Bildschirmen eigenes Seitenverhältnis – sonst werden Balken und Beschriftung winzig
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const setzen = () => setSchmal(mq.matches);
    setzen();
    mq.addEventListener("change", setzen);
    return () => mq.removeEventListener("change", setzen);
  }, []);

  // "Jetzt" erst im Browser setzen – verhindert Hydration-Abweichungen
  useEffect(() => {
    setJetzt(Date.now());
    const t = setInterval(() => setJetzt(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const tage = useMemo(() => stundenJeTag(preis?.punkte || []), [preis]);
  const tagSchluessel = Object.keys(tage).sort();
  // Heute = Tag des Datenstands (Server) bzw. Browserzeit, sobald bekannt
  const heuteKey = fmtTag.format(new Date(jetzt || (stand ? Date.parse(stand) : Date.now())));
  const morgenKey = tagSchluessel.find((k) => k > heuteKey) || null;
  const hatMorgen = !!(morgenKey && tage[morgenKey]?.length >= 20);
  const aktiverKey = tagWahl === "morgen" && hatMorgen ? morgenKey : tage[heuteKey] ? heuteKey : tagSchluessel[0];
  const stunden = aktiverKey ? tage[aktiverKey] : [];

  const wert = (eurMwh) => (modus === "endpreis" ? dynamischBrutto(eurMwh) : eurMwh / 10);
  const werte = stunden.map((s) => wert(s.eurMwh));
  const fenster = guenstigstesFenster(stunden);
  const imFenster = (i) => fenster && i >= fenster.start && i < fenster.start + FENSTER;

  const statistik = stunden.length
    ? (() => {
        const minI = werte.indexOf(Math.min(...werte));
        const maxI = werte.indexOf(Math.max(...werte));
        return {
          avg: werte.reduce((a, b) => a + b, 0) / werte.length,
          min: werte[minI],
          minStd: stunden[minI].std,
          max: werte[maxI],
          maxStd: stunden[maxI].std,
        };
      })()
    : null;

  const aktuellIdx = jetzt != null && aktiverKey === heuteKey ? stunden.findIndex((s) => jetzt >= s.t && jetzt < s.t + 3600000) : -1;
  const aktuellWert = aktuellIdx >= 0 ? werte[aktuellIdx] : null;

  // Geometrie
  const W = schmal ? 380 : 720, H = schmal ? 250 : 270, PL = schmal ? 34 : 64, PR = schmal ? 4 : 10, PT = 18, PB = schmal ? 28 : 36;
  const beschriftung = schmal ? "ov-num fill-ink-500 text-[14px]" : "ov-num fill-ink-500 text-[12px]";
  const festpreis = TARIF_ANNAHMEN.festpreisCt;
  const maxRoh = Math.max(...werte, modus === "endpreis" ? festpreis : 0, 1);
  const minRoh = Math.min(0, ...werte);
  const ticks = schoeneTicks(minRoh, maxRoh * 1.08);
  const yMin = Math.min(ticks[0], minRoh);
  const yMax = Math.max(ticks[ticks.length - 1], maxRoh);
  const y = (v) => PT + (H - PT - PB) * (1 - (v - yMin) / (yMax - yMin));
  const n = Math.max(stunden.length, 1);
  const bw = (W - PL - PR) / n;
  const aktiv = hover != null ? stunden[hover] : null;

  const fensterText = fenster
    ? `${String(stunden[fenster.start].std).padStart(2, "0")}–${String((stunden[fenster.start].std + FENSTER) % 24).padStart(2, "0")} Uhr`
    : "–";

  const einheit = modus === "endpreis" ? "ct/kWh brutto (ca.)" : "ct/kWh netto";
  const quelleText = preis?.quelle?.startsWith("Energy-Charts")
    ? "Fraunhofer ISE Energy-Charts (CC BY 4.0)"
    : preis?.quelle || "Fraunhofer ISE Energy-Charts (CC BY 4.0)";

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      {/* Kopf */}
      <div className="flex flex-col gap-5 border-b border-ink-100 p-6 md:p-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
            <LiveDot className="bg-ov-500" /> Live · Day-Ahead-Börse Österreich
          </p>
          <h3 className="ov-h3 mt-2 text-ink-900">
            Börsenstrompreis {aktiverKey ? <span className="text-ink-500">– {fmtDatum.format(new Date(stunden[0]?.t || Date.now()))}</span> : null}
          </h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div role="group" aria-label="Tag" className="inline-flex rounded-full bg-ink-100 p-1">
            {[
              { v: "heute", l: "Heute", ok: true },
              { v: "morgen", l: "Morgen", ok: hatMorgen },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                aria-pressed={tagWahl === o.v || (o.v === "heute" && tagWahl === "morgen" && !hatMorgen)}
                disabled={!o.ok}
                title={!o.ok ? "Die Preise für morgen werden ab ca. 13 Uhr veröffentlicht" : undefined}
                onClick={() => setTagWahl(o.v)}
                className={`h-10 flex-1 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${
                  (tagWahl === o.v && (o.v === "heute" || hatMorgen)) || (o.v === "heute" && !hatMorgen && tagWahl === "morgen")
                    ? "bg-white text-ink-900 shadow-md"
                    : "text-ink-600 hover:text-ink-800"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Preisbasis" className="inline-flex rounded-full bg-ink-100 p-1">
            {[
              { v: "boerse", l: "Börsenpreis" },
              { v: "endpreis", l: "Endpreis ca." },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                aria-pressed={modus === o.v}
                onClick={() => setModus(o.v)}
                className={`h-10 flex-1 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-all duration-300 ${
                  modus === o.v ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        {/* Diagramm */}
        <div className="relative p-4 md:p-6">
          {!stunden.length ? (
            <div className="flex h-[260px] items-center justify-center rounded-2xl bg-ink-50 text-[14px] text-ink-500">
              Die Börsendaten sind gerade nicht erreichbar. Bitte versuchen Sie es in Kürze erneut.
            </div>
          ) : (
            <>
              <p className="px-1 text-[12.5px] text-ink-500">{einheit} · je Stunde gemittelt</p>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="mt-2 h-auto w-full touch-pan-y"
                role="img"
                aria-label={`Stündlicher Strompreis ${aktiverKey === heuteKey ? "heute" : "morgen"}: Durchschnitt ${ct(statistik.avg)} ${einheit}, günstigstes 3-Stunden-Fenster ${fensterText}`}
                onMouseLeave={() => setHover(null)}
              >
                {ticks.map((t) => (
                  <g key={t}>
                    <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#9aa3b2" : "#eef0f4"} strokeWidth="1" />
                    <text x={PL - (schmal ? 6 : 10)} y={y(t) + 4} textAnchor="end" className={beschriftung}>{ct(t, t % 1 ? 1 : 0)}</text>
                  </g>
                ))}

                {/* Günstigstes Fenster als Hintergrundband */}
                {fenster && (
                  <g>
                    <rect x={PL + fenster.start * bw} y={PT} width={bw * FENSTER} height={H - PT - PB} rx="8" fill="#669933" opacity="0.08" />
                  </g>
                )}

                {modus === "endpreis" && (
                  <g>
                    <line x1={PL} x2={W - PR} y1={y(festpreis)} y2={y(festpreis)} stroke="#003473" strokeWidth="1.5" strokeDasharray="5 5" />
                    <text x={W - PR - 4} y={y(festpreis) - 8} textAnchor="end" className="fill-navy-700 text-[12px] font-semibold">
                      Festpreis ca. {ct(festpreis, 0)} ct
                    </text>
                  </g>
                )}

                {stunden.map((s, i) => {
                  const v = werte[i];
                  const x = PL + i * bw;
                  const top = y(Math.max(v, 0));
                  const bottom = y(Math.min(v, 0));
                  const gruen = imFenster(i);
                  const jetztBalken = i === aktuellIdx;
                  return (
                    <g key={s.t} onMouseEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
                      <rect x={x} y={PT} width={bw} height={H - PT - PB} fill={hover === i ? "#f4f6f9" : "transparent"} />
                      <rect
                        x={x + 2}
                        y={top}
                        width={Math.max(bw - 4, 1)}
                        height={Math.max(bottom - top, 1)}
                        rx="3"
                        fill={gruen ? "#669933" : jetztBalken ? "#003473" : "#c4cad5"}
                        style={{ transition: "y 450ms cubic-bezier(.22,1,.36,1), height 450ms cubic-bezier(.22,1,.36,1), fill 300ms" }}
                      />
                      {s.std % (schmal ? 6 : 3) === 0 && (
                        <text x={x + bw / 2} y={H - (schmal ? 8 : 10)} textAnchor="middle" className={beschriftung}>
                          {String(s.std).padStart(2, "0")}
                        </text>
                      )}
                    </g>
                  );
                })}

                {aktuellIdx >= 0 && (
                  <g pointerEvents="none">
                    <line x1={PL + aktuellIdx * bw + bw / 2} x2={PL + aktuellIdx * bw + bw / 2} y1={PT} y2={H - PB} stroke="#003473" strokeWidth="1" strokeDasharray="2 3" />
                  </g>
                )}
              </svg>

              {aktiv && (
                <div
                  className="pointer-events-none absolute top-14 z-10 rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl"
                  style={{ left: `clamp(12px, calc(${((PL + hover * bw) / W) * 100}% - 70px), calc(100% - 200px))` }}
                >
                  <p className="font-semibold">
                    {String(aktiv.std).padStart(2, "0")}:00–{String((aktiv.std + 1) % 24).padStart(2, "0")}:00 Uhr
                  </p>
                  <p className="mt-1 text-white/70">
                    Börse <span className="ov-num text-white">{ct(aktiv.eurMwh / 10)} ct/kWh</span>
                  </p>
                  <p className="text-white/70">
                    Endpreis ca. <span className="ov-num text-white">{ct(dynamischBrutto(aktiv.eurMwh))} ct/kWh</span>
                  </p>
                  {imFenster(hover) && <p className="mt-1 font-semibold text-ov-300">Günstigstes Fenster</p>}
                </div>
              )}

              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-1 text-[13px] text-ink-600">
                <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" />Günstigstes 3-Stunden-Fenster</li>
                <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ink-300" />Übrige Stunden</li>
                {aktuellIdx >= 0 && <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-navy-700" />Aktuelle Stunde</li>}
                {modus === "endpreis" && <li className="flex items-center gap-2"><span className="h-0 w-4 border-t-2 border-dashed border-navy-700" />Durchschnittlicher Festpreis</li>}
              </ul>
              {!hatMorgen && (
                <p className="mt-2 px-1 text-[12.5px] text-ink-500">Die Preise für morgen veröffentlicht die Börse täglich ab ca. 13 Uhr.</p>
              )}
            </>
          )}
        </div>

        {/* Kennzahlen */}
        {statistik && (
          <div className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100 lg:grid-cols-1 lg:border-l lg:border-t-0">
            <Kennzahl
              icon={Sparkles}
              label="Günstigstes Fenster"
              wert={fensterText}
              zusatz={`Ø ${ct(wert(fenster.avg))} ct/kWh`}
              akzent
            />
            <Kennzahl
              icon={Clock}
              label={aktuellWert != null ? "Jetzt" : "Tagesdurchschnitt"}
              wert={`${ct(aktuellWert != null ? aktuellWert : statistik.avg)} ct`}
              zusatz={aktuellWert != null ? `Ø heute ${ct(statistik.avg)} ct` : einheit}
            />
            <Kennzahl icon={ArrowDownRight} label="Tiefstwert" wert={`${ct(statistik.min)} ct`} zusatz={`um ${String(statistik.minStd).padStart(2, "0")} Uhr`} />
            <Kennzahl icon={ArrowUpRight} label="Höchstwert" wert={`${ct(statistik.max)} ct`} zusatz={`um ${String(statistik.maxStd).padStart(2, "0")} Uhr`} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-ink-100 px-6 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[12.5px] leading-relaxed text-ink-500">
          Datenquelle: {quelleText}, Day-Ahead-Auktion Gebotszone AT
          {stand ? `, Stand ${fmtUhrzeit.format(new Date(stand))} Uhr` : ""}. Endpreis = Börsenpreis + ca. {ct(TARIF_ANNAHMEN.aufschlagCt)} ct Netzentgelte, Abgaben &amp; Lieferantenaufschlag + {Math.round(TARIF_ANNAHMEN.mwst * 100)} % USt. – grobe Orientierung, je nach Netzgebiet und Anbieter verschieden.
        </p>
        <div className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold">
          <Link href="/energie-live" className="inline-flex items-center gap-1.5 text-ov-700 hover:text-ov-800">
            <Activity aria-hidden="true" className="h-4 w-4" /> Live-Dashboard
          </Link>
          <Link href="/rechner/dynamischer-stromtarif" className="inline-flex items-center gap-1.5 text-ov-700 hover:text-ov-800">
            <Calculator aria-hidden="true" className="h-4 w-4" /> Tarif-Rechner
          </Link>
        </div>
      </div>
    </div>
  );
}

function Kennzahl({ icon: Icon, label, wert, zusatz, akzent }) {
  return (
    <div className={`p-5 md:p-6 ${akzent ? "bg-ov-50" : "bg-white"}`}>
      <p className="flex items-center gap-2 text-[13px] text-ink-500">
        <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
        {label}
      </p>
      <p className="ov-num mt-1.5 font-display text-[22px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[26px]">{wert}</p>
      {zusatz && <p className="ov-num mt-0.5 text-[12.5px] text-ink-500">{zusatz}</p>}
    </div>
  );
}
