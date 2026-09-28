"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeEuro, Clock3, Moon, PiggyBank, TrendingDown, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import useEnergyLive, { fmtUhr } from "@/components/ui/useEnergyLive";
import { Auswahl, Gruppe, Kennzahl, Regler, Tooltip, Zahl, useBreite } from "./bausteine";
import { MobilKurz } from "./StromspeicherRechner";
import { rechneDynamisch, wienTag, PROFILE } from "@/lib/rechner/dynamischerTarif";
import { fmt, fmtEur } from "@/lib/rechner/annahmen";
import { angebotUrl } from "@/lib/rechner/angebot";

const FARBE = { linie: "#1f5aa1", guenstig: "#669933", teuer: "#f5a70f", fest: "#151a24", raster: "#eef0f4", last: "#b2cbe9", lastVerschoben: "#669933" };
const ct = (v, s = 1) => `${fmt(v, s)} ct`;

/**
 * @param {object} props
 * @param {object} props.start     { stand, preis: { quelle, aufloesungMin, punkte } } – serverseitiger Snapshot
 *                                 der Gebotszone Österreich (getEnergySnapshot aus @/lib/energy)
 * @param {object} props.annahmen  TARIF_ANNAHMEN aus @/lib/energy (Österreich)
 */
export default function DynamischerTarifRechner({ start, annahmen }) {
  // Live-Aktualisierung über den gemeinsamen Endpunkt /api/energie/live (Gebotszone AT,
  // serverseitig gecacht) – so kommen auch die Preise für morgen ohne Neuladen an.
  const live = useEnergyLive({ voll: true });
  const daten = live?.preis?.punkte?.length ? live : start;
  const preis = daten?.preis || { punkte: [], aufloesungMin: 15 };

  const [jetzt, setJetzt] = useState(() => new Date(start?.stand || 0).getTime());
  useEffect(() => {
    setJetzt(Date.now());
    const t = setInterval(() => setJetzt(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const [profilId, setProfilId] = useState("eauto");
  const [haushalt, setHaushalt] = useState(4000);
  const [km, setKm] = useState(15000);
  const [wpKwh, setWpKwh] = useState(4000);
  const [verschiebbar, setVerschiebbar] = useState(60);
  const [festpreis, setFestpreis] = useState(annahmen.festpreisCt);
  const [tagWahl, setTagWahl] = useState("heute");
  const [fenster, setFenster] = useState(3);

  const heute = wienTag(jetzt);
  const morgen = wienTag(jetzt + 86400000);
  const hatMorgen = preis.punkte.some((p) => wienTag(p.t) === morgen);
  const tag = tagWahl === "morgen" && hatMorgen ? morgen : heute;

  const profil = {
    haushaltKwh: haushalt,
    km: profilId === "eauto" ? km : 0,
    wpKwh: profilId === "wp" ? wpKwh : 0,
  };

  const r = useMemo(
    () =>
      rechneDynamisch({
        punkte: preis.punkte,
        aufloesungMin: preis.aufloesungMin,
        tag,
        profil,
        verschiebbarkeit: verschiebbar / 100,
        festpreisCt: festpreis,
        annahmen,
        fensterStunden: fenster,
        jetzt: tag === heute ? jetzt : 0,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preis.punkte, preis.aufloesungMin, tag, haushalt, km, wpKwh, profilId, verschiebbar, festpreis, fenster, tag === heute ? Math.floor(jetzt / 900000) : 0]
  );

  const href = angebotUrl({ verbrauch: haushalt, wallbox: profilId === "eauto", waermepumpe: profilId === "wp" });
  const guenstiger = r ? r.dynamischMit < r.fest : false;
  const tageLabel = tag === heute ? "heute" : "morgen";

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,410px)_1fr]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          {r && (
            <MobilKurz
              werte={[
                ["Festpreis", <Zahl key="f" wert={r.fest} stellen={2} suffix=" €" />],
                ["Dynamisch", <Zahl key="d" wert={r.dynamischMit} stellen={2} suffix=" €" />],
                ["Ø je kWh", <Zahl key="c" wert={r.mittelCtEffektiv} stellen={1} suffix=" ct" />],
              ]}
            />
          )}

          <div className="space-y-8">
            <Gruppe titel="Verbrauchsprofil">
              <Auswahl
                wert={profilId}
                onChange={setProfilId}
                klein
                optionen={Object.values(PROFILE).map((p) => ({ id: p.id, label: p.label, sub: p.sub }))}
              />
              <Regler label="Haushaltsstrom" wert={haushalt} min={1500} max={8000} step={100} format={(v) => `${fmt(v)} kWh/Jahr`} minLabel="1.500" maxLabel="8.000 kWh" onChange={setHaushalt} />
              {profilId === "eauto" && <Regler label="E-Auto Fahrleistung" wert={km} min={5000} max={40000} step={1000} format={(v) => `${fmt(v)} km/Jahr`} minLabel="5.000" maxLabel="40.000 km" onChange={setKm} />}
              {profilId === "wp" && <Regler label="Strom Wärmepumpe" wert={wpKwh} min={1500} max={9000} step={100} format={(v) => `${fmt(v)} kWh/Jahr`} minLabel="1.500" maxLabel="9.000 kWh" onChange={setWpKwh} />}
            </Gruppe>

            <Gruppe titel="Flexibilität & Tarif">
              <Regler
                label="Verschiebbarkeit"
                wert={verschiebbar}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v} %`}
                onChange={setVerschiebbar}
                hinweis={
                  profilId === "eauto"
                    ? "Anteil des Ladens, der in die günstigsten Stunden wandert (Energiemanager/Timer)."
                    : profilId === "wp"
                      ? "Wärmepumpe: bis zur Hälfte verschiebbar (Speicher im Haus, Warmwasser)."
                      : "Haushalt: nur Waschmaschine, Trockner, Spülmaschine – max. 15 % verschiebbar."
                }
              />
              <Regler label="Ihr Festpreis" wert={festpreis} min={24} max={48} step={0.5} format={(v) => `${fmt(v, v % 1 ? 1 : 0)} ct/kWh`} minLabel="24 ct" maxLabel="48 ct" onChange={setFestpreis} hinweis="Arbeitspreis brutto laut Stromrechnung" />
            </Gruppe>

            <Gruppe titel="Ladefenster">
              <Auswahl
                legende="Länge des Zeitfensters"
                wert={fenster}
                onChange={setFenster}
                klein
                optionen={[1, 2, 3, 4].map((h) => ({ id: h, label: `${h} h` }))}
              />
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">
              Ihre Stromkosten {tageLabel}
            </h2>
            <div role="group" aria-label="Tag" className="inline-flex rounded-full bg-ink-100 p-1">
              {[
                { id: "heute", l: "Heute" },
                { id: "morgen", l: "Morgen", aus: !hatMorgen },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={tagWahl === o.id && !o.aus}
                  disabled={o.aus}
                  onClick={() => setTagWahl(o.id)}
                  title={o.aus ? "Preise für morgen erscheinen ab ca. 13 Uhr" : undefined}
                  className={cn(
                    "h-10 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45",
                    (tagWahl === o.id && !o.aus) || (o.id === "heute" && tagWahl === "morgen" && !hatMorgen) ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
                  )}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {!r ? (
            <div className="mt-6 rounded-3xl bg-ink-50 p-8 text-center">
              <p className="font-display text-[18px] font-bold text-ink-900">Börsenpreise gerade nicht verfügbar</p>
              <p className="mt-2 text-[14.5px] text-ink-600">Die Daten werden automatisch neu geladen. Bitte versuchen Sie es in wenigen Minuten erneut.</p>
            </div>
          ) : (
            <>
              <p className="sr-only" aria-live="polite">
                {`Festpreis ${fmt(r.fest, 2)} Euro, dynamischer Tarif ${fmt(r.dynamischMit, 2)} Euro ${tageLabel}`}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kennzahl icon={BadgeEuro} label="Festpreis" zusatz={`${fmt(r.kwh, 1)} kWh zu ${ct(festpreis, festpreis % 1 ? 1 : 0)}`}>
                  <Zahl wert={r.fest} stellen={2} suffix=" €" />
                </Kennzahl>
                <Kennzahl ton="navy" icon={Zap} label="Dynamisch" zusatz={`Ø ${ct(r.mittelCtEffektiv)} je kWh`}>
                  <Zahl wert={r.dynamischMit} stellen={2} suffix=" €" />
                </Kennzahl>
                <Kennzahl ton={guenstiger ? "gruen" : "sand"} icon={PiggyBank} label={guenstiger ? "Ersparnis" : "Mehrkosten"} zusatz={`≈ ${fmtEur(Math.abs(r.ersparnisTag) * 30)} im Monat bei Preisen wie ${tageLabel}`}>
                  <Zahl wert={Math.abs(r.ersparnisTag)} stellen={2} suffix=" €" />
                </Kennzahl>
                <Kennzahl icon={TrendingDown} label="Durch Verschieben" zusatz="gegenüber festem Verbrauchsmuster">
                  <Zahl wert={r.verschiebeVorteil} stellen={2} prefix="− " suffix=" €" />
                </Kennzahl>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {r.fenster && (
                  <div className="flex items-center gap-4 rounded-3xl bg-ov-50 p-4 ring-1 ring-ov-200 md:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                      <Clock3 aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-ov-700">Günstigstes {fenster}-h-Fenster {tag === heute ? "(ab jetzt)" : ""}</p>
                      <p className="ov-num font-display text-[20px] font-extrabold leading-tight text-ink-900">
                        {fmtUhr(r.fenster.startT)}–{fmtUhr(r.fenster.endeT)} Uhr
                      </p>
                      <p className="ov-num text-[12.5px] text-ink-600">Ø {ct(r.fenster.avgCt)}/kWh brutto</p>
                    </div>
                  </div>
                )}
                {r.teuer && (
                  <div className="flex items-center gap-4 rounded-3xl bg-sand-50 p-4 ring-1 ring-sun-300/60 md:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun-400 text-navy-950">
                      <Moon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-ink-600">Teuerstes {fenster}-h-Fenster – meiden</p>
                      <p className="ov-num font-display text-[20px] font-extrabold leading-tight text-ink-900">
                        {fmtUhr(r.teuer.startT)}–{fmtUhr(r.teuer.endeT)} Uhr
                      </p>
                      <p className="ov-num text-[12.5px] text-ink-600">Ø {ct(r.teuer.avgCt)}/kWh brutto</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-7 rounded-3xl ring-1 ring-ink-200/70">
                <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 md:px-6">
                  <h3 className="font-display text-[17px] font-bold text-ink-900">Endkundenpreis {tageLabel} (brutto)</h3>
                  <p className="ov-num text-[12.5px] text-ink-500">
                    {ct(r.min.ct)} bis {ct(r.max.ct)} · {fmt(r.guenstigerAlsFest, r.guenstigerAlsFest % 1 ? 1 : 0)} h unter Festpreis
                  </p>
                </div>
                <PreisChart r={r} festpreis={festpreis} jetzt={tag === heute ? jetzt : null} fenster={fenster} />
              </div>

              <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
                Datenquelle: Day-Ahead-Preise der Gebotszone Österreich (AT) von{" "}
                <a href="https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=AT" target="_blank" rel="noopener noreferrer" className="font-medium text-ink-700 underline decoration-ink-300 underline-offset-2 hover:decoration-current">
                  Energy-Charts (Fraunhofer ISE)
                </a>
                , Daten: Bundesnetzagentur | SMARD.de, Lizenz CC BY 4.0{preis.quelle && !String(preis.quelle).includes("Energy-Charts") ? ` · ersatzweise ${preis.quelle}` : ""} · Stand {fmtUhr(new Date(daten?.stand || jetzt).getTime())} Uhr.
                Endpreis = (Börsenpreis + {fmt(annahmen.aufschlagCt, 1)} ct Netzentgelte, Abgaben & Lieferantenaufschlag) × {fmt(1 + annahmen.mwst, 2)} (20 % USt.). Grundpauschalen sind nicht enthalten.
              </p>
            </>
          )}

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Mit PV-Anlage, Speicher und Energiemanager nutzen Sie günstige Stunden automatisch. Orientierung, kein Tarifangebot.
            </p>
            <Button href={href} size="lg" pfeil className="shrink-0">
              Angebot mit diesen Werten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreisChart({ r, festpreis, jetzt, fenster }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 250 : 300;
  const LAST_H = 52;
  const P = { l: 44, r: 12, t: 26, b: 28 + LAST_H + 10 };
  const slots = r.slots;
  const n = slots.length;
  const minCt = Math.min(...slots.map((s) => s.ct));
  const maxCt = Math.max(festpreis, ...slots.map((s) => s.ct));
  const oben = Math.ceil((maxCt + 2) / 10) * 10;
  // Ohne negative Preise nicht bei 0 beginnen – sonst wirkt der Tagesverlauf flach
  const unten = minCt < 0 ? Math.floor(minCt / 10) * 10 : Math.max(0, Math.floor((Math.min(minCt, festpreis) - 6) / 10) * 10);
  const plotB = H - P.b;
  const x = (i) => Math.round((P.l + (i / n) * (W - P.l - P.r)) * 10) / 10;
  const y = (v) => Math.round((P.t + ((oben - v) / (oben - unten)) * (plotB - P.t)) * 10) / 10;
  const ticks = [];
  const schritt = oben - unten > 60 ? 20 : 10;
  for (let v = unten; v <= oben; v += schritt) ticks.push(v);

  // Stufenlinie
  let linie = "";
  slots.forEach((s, i) => {
    linie += `${i ? "L" : "M"}${x(i)},${y(s.ct)} L${x(i + 1)},${y(s.ct)} `;
  });
  const yFest = y(festpreis);
  const flaeche = `${linie} L${x(n)},${yFest} L${x(0)},${yFest} Z`;

  // Last je Slot (verschoben) für den Streifen unten
  const last = slots.map((_, i) => r.verschoben.haushalt[i] + r.verschoben.eauto[i] + r.verschoben.wp[i]);
  const lastOrig = slots.map((_, i) => r.last.haushalt[i] + r.last.eauto[i] + r.last.wp[i]);
  const maxLast = Math.max(...last, ...lastOrig, 0.01);
  const lastY0 = H - 28;

  const jetztIdx = jetzt ? slots.findIndex((s) => s.t <= jetzt && jetzt < s.t + s.dauerH * 3600000) : -1;
  const aktiv = hover != null ? slots[hover] : null;
  const stundenTicks = schmal ? [0, 6, 12, 18] : [0, 3, 6, 9, 12, 15, 18, 21];

  const ausZeiger = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(n - 1, Math.floor(((px - P.l) / (W - P.l - P.r)) * n)));
  };

  return (
    <div ref={ref} className="relative px-2 pb-4 pt-2 md:px-3">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block touch-pan-y select-none"
        role="img"
        aria-label={`Strompreis im Tagesverlauf: günstigster Zeitpunkt ${fmtUhr(r.min.t)} Uhr mit ${fmt(r.min.ct, 1)} Cent, teuerster ${fmtUhr(r.max.t)} Uhr mit ${fmt(r.max.ct, 1)} Cent je Kilowattstunde brutto.`}
      >
        <defs>
          <clipPath id="ov-dyn-teuer">
            <rect x={0} y={0} width={W} height={Math.max(yFest, 0)} />
          </clipPath>
          <clipPath id="ov-dyn-guenstig">
            <rect x={0} y={yFest} width={W} height={Math.max(plotB - yFest, 0)} />
          </clipPath>
        </defs>

        {ticks.map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? "#c4cad5" : FARBE.raster} />
            <text x={P.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">{v}</text>
          </g>
        ))}
        <text x={4} y={P.t - 12} className="fill-ink-500 text-[10px]">ct/kWh</text>

        {/* Günstigstes Fenster */}
        {r.fenster && (
          <g>
            <rect x={x(r.fenster.von)} y={P.t - 6} width={x(r.fenster.bis + 1) - x(r.fenster.von)} height={plotB - P.t + 6} fill={FARBE.guenstig} opacity="0.1" rx="6" />
            <text x={(x(r.fenster.von) + x(r.fenster.bis + 1)) / 2} y={P.t - 12} textAnchor="middle" className="fill-ov-700 text-[11px] font-semibold">
              {schmal ? `${fenster} h` : `günstigste ${fenster} h`}
            </text>
          </g>
        )}

        <path d={flaeche} fill={FARBE.teuer} opacity="0.2" clipPath="url(#ov-dyn-teuer)" />
        <path d={flaeche} fill={FARBE.guenstig} opacity="0.18" clipPath="url(#ov-dyn-guenstig)" />
        <line x1={P.l} x2={W - P.r} y1={yFest} y2={yFest} stroke={FARBE.fest} strokeWidth="1.25" strokeDasharray="5 4" />
        <text x={W - P.r} y={yFest - 6} textAnchor="end" stroke="#fff" strokeWidth="3" paintOrder="stroke" strokeLinejoin="round" className="fill-ink-800 text-[11px] font-semibold">
          Festpreis {fmt(festpreis, festpreis % 1 ? 1 : 0)} ct
        </text>
        <path d={linie} fill="none" stroke={FARBE.linie} strokeWidth="2" strokeLinejoin="round" />

        {/* Vergangenheit abdunkeln + Jetzt-Marke */}
        {jetztIdx > 0 && (
          <g pointerEvents="none">
            <rect x={P.l} y={P.t - 6} width={x(jetztIdx) - P.l} height={plotB - P.t + 6} fill="#fff" opacity="0.55" />
            <line x1={x(jetztIdx)} x2={x(jetztIdx)} y1={P.t - 6} y2={plotB} stroke="#151a24" strokeWidth="1" />
            <circle cx={x(jetztIdx)} cy={y(slots[jetztIdx].ct)} r="4.5" fill={FARBE.linie} stroke="#fff" strokeWidth="2" />
          </g>
        )}

        {/* Lastgang-Streifen */}
        <text x={P.l - 8} y={lastY0 - LAST_H / 2 + 4} textAnchor="end" className="fill-ink-500 text-[10px]">kWh</text>
        {slots.map((s, i) => {
          const bw = Math.max(x(i + 1) - x(i) - (n > 48 ? 0.6 : 1.5), 0.8);
          const h = (last[i] / maxLast) * LAST_H;
          const hOrig = (lastOrig[i] / maxLast) * LAST_H;
          return (
            <g key={s.t}>
              <rect x={x(i)} y={lastY0 - hOrig} width={bw} height={hOrig} fill={FARBE.last} opacity="0.55" />
              <rect x={x(i)} y={lastY0 - h} width={bw} height={h} fill={last[i] > lastOrig[i] + 1e-6 ? FARBE.lastVerschoben : "#4a7cbd"} opacity="0.9" />
            </g>
          );
        })}
        <line x1={P.l} x2={W - P.r} y1={lastY0} y2={lastY0} stroke="#c4cad5" />

        {stundenTicks.map((h) => {
          const i = slots.findIndex((s) => s.stunde === h);
          if (i < 0) return null;
          return (
            <text key={h} x={x(i)} y={H - 10} textAnchor={h === 0 ? "start" : "middle"} className="fill-ink-500 text-[11px]">
              {`${String(h).padStart(2, "0")}:00`}
            </text>
          );
        })}

        {aktiv && (
          <g pointerEvents="none">
            <line x1={x(hover) + (x(hover + 1) - x(hover)) / 2} x2={x(hover) + (x(hover + 1) - x(hover)) / 2} y1={P.t - 6} y2={lastY0} stroke="#97a0b0" strokeDasharray="2 3" />
            <circle cx={x(hover) + (x(hover + 1) - x(hover)) / 2} cy={y(aktiv.ct)} r="4.5" fill="#fff" stroke={FARBE.linie} strokeWidth="2" />
          </g>
        )}

        <rect
          x={P.l}
          y={0}
          width={W - P.l - P.r}
          height={H}
          fill="transparent"
          onPointerMove={(e) => setHover(ausZeiger(e))}
          onPointerDown={(e) => setHover(ausZeiger(e))}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {aktiv && (
        <Tooltip x={x(hover) + 8} y={Math.max(y(aktiv.ct) - 80, 0)} breite={W}>
          <p className="font-semibold">
            {fmtUhr(aktiv.t)}–{fmtUhr(aktiv.t + aktiv.dauerH * 3600000)} Uhr
          </p>
          <p className="text-white/70">
            Endpreis <span className="ov-num font-semibold text-white">{ct(aktiv.ct)}</span>
          </p>
          <p className="text-white/70">
            Börse <span className="ov-num font-semibold text-white">{ct(aktiv.eurMwh / 10)}</span> netto
          </p>
          <p className={cn("ov-num font-semibold", aktiv.ct < festpreis ? "text-ov-300" : "text-sun-300")}>
            {aktiv.ct < festpreis ? "−" : "+"}
            {ct(Math.abs(aktiv.ct - festpreis))} ggü. Festpreis
          </p>
        </Tooltip>
      )}

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-navy-500" aria-hidden="true" />Dynamischer Endpreis</li>
        <li className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-ink-900" aria-hidden="true" />Ihr Festpreis</li>
        <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[3px] bg-ov-500/15 ring-1 ring-ov-200" aria-hidden="true" />Günstigstes Fenster</li>
        <li className="flex items-center gap-2"><span className="h-3 w-2 rounded-[2px] bg-ov-500" aria-hidden="true" />Verschobener Verbrauch</li>
      </ul>
    </div>
  );
}
