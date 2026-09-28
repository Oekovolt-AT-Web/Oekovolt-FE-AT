"use client";

import { useMemo, useState } from "react";
import { CarFront, Fuel, Leaf, PiggyBank, PlugZap, Sun } from "lucide-react";
import Button from "@/components/ui/Button";
import { Auswahl, Gruppe, Kennzahl, Regler, Tooltip, Zahl, useBreite } from "./bausteine";
import { MobilKurz } from "./StromspeicherRechner";
import { rechneWallbox } from "@/lib/rechner/wallbox";
import { ALLGEMEIN, WALLBOX as WB, fmt, fmtEur } from "@/lib/rechner/annahmen";
import { angebotUrl } from "@/lib/rechner/angebot";

const SEGMENTE = {
  kraftstoff: { farbe: "#97a0b0", label: "Kraftstoff" },
  zuhause: { farbe: "#4a7cbd", label: "Netzstrom zu Hause" },
  solar: { farbe: "#669933", label: "Solarstrom (entgangener Einspeiseerlös)" },
  oeffentlich: { farbe: "#b2cbe9", label: "Öffentlich laden" },
};

export default function WallboxRechner() {
  const [km, setKm] = useState(15000);
  const [verbrauch, setVerbrauch] = useState(18);
  const [zuhause, setZuhause] = useState(80);
  const [pvAnteil, setPvAnteil] = useState(40);
  const [kraftstoff, setKraftstoff] = useState("benzin");
  const [liter, setLiter] = useState({ benzin: WB.kraftstoffe.benzin.verbrauch, diesel: WB.kraftstoffe.diesel.verbrauch });
  const [preis, setPreis] = useState({ benzin: WB.kraftstoffe.benzin.preis, diesel: WB.kraftstoffe.diesel.preis });
  const [strompreis, setStrompreis] = useState(ALLGEMEIN.strompreis * 100);

  const r = useMemo(
    () =>
      rechneWallbox({
        km,
        verbrauch,
        anteilZuhause: zuhause / 100,
        anteilPv: pvAnteil / 100,
        kraftstoff,
        kraftstoffPreis: preis[kraftstoff],
        kraftstoffVerbrauch: liter[kraftstoff],
        strompreisCt: strompreis,
      }),
    [km, verbrauch, zuhause, pvAnteil, kraftstoff, preis, liter, strompreis]
  );

  const kLabel = WB.kraftstoffe[kraftstoff].label;
  const fahrzeug = WB.kraftstoffe[kraftstoff].fahrzeug;
  const href = angebotUrl({ wallbox: true });

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,410px)_1fr]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              [fahrzeug, <Zahl key="v" wert={Math.round(r.verbrenner.summe)} suffix=" €" />],
              ["E-Auto", <Zahl key="e" wert={Math.round(r.solar.summe)} suffix=" €" />],
              [r.ersparnisSolar >= 0 ? "Ersparnis" : "Mehrkosten", <Zahl key="s" wert={Math.abs(Math.round(r.ersparnisSolar))} suffix=" €" />],
            ]}
          />

          <div className="space-y-8">
            <Gruppe titel="Fahrprofil">
              <Regler label="Fahrleistung pro Jahr" wert={km} min={5000} max={50000} step={500} format={(v) => `${fmt(v)} km`} minLabel="5.000" maxLabel="50.000 km" onChange={setKm} />
              <Regler
                label="Verbrauch E-Auto"
                wert={verbrauch}
                min={12}
                max={28}
                step={0.5}
                format={(v) => `${fmt(v, v % 1 ? 1 : 0)} kWh/100 km`}
                minLabel="12"
                maxLabel="28 kWh"
                onChange={setVerbrauch}
                hinweis="Inkl. Ladeverluste. Kompaktwagen ca. 16, SUV ca. 20–22 kWh/100 km."
              />
            </Gruppe>

            <Gruppe titel="Laden">
              <Regler label="Anteil zu Hause geladen" wert={zuhause} min={0} max={100} step={5} format={(v) => `${v} %`} onChange={setZuhause} hinweis={`Rest öffentlich zu ca. ${WB.oeffentlichCt} ct/kWh`} />
              <Regler
                label="Davon mit PV-Überschuss"
                wert={pvAnteil}
                min={0}
                max={90}
                step={5}
                format={(v) => `${v} %`}
                onChange={setPvAnteil}
                hinweis="Ohne Steuerung ca. 20–30 %, mit Überschussladen und Homeoffice 50–70 %."
              />
              <Regler label="Strompreis zu Hause" wert={strompreis} min={20} max={45} step={0.5} format={(v) => `${fmt(v, v % 1 ? 1 : 0)} ct/kWh`} minLabel="20 ct" maxLabel="45 ct" onChange={setStrompreis} />
            </Gruppe>

            <Gruppe titel="Vergleichsfahrzeug">
              <Auswahl
                wert={kraftstoff}
                onChange={setKraftstoff}
                optionen={[
                  { id: "benzin", label: "Benzin" },
                  { id: "diesel", label: "Diesel" },
                ]}
              />
              <Regler
                label={`Verbrauch ${kLabel}`}
                wert={liter[kraftstoff]}
                min={3}
                max={12}
                step={0.1}
                format={(v) => `${fmt(v, 1)} l/100 km`}
                minLabel="3"
                maxLabel="12 l"
                onChange={(v) => setLiter((l) => ({ ...l, [kraftstoff]: v }))}
              />
              <Regler
                label={`${kLabel}preis`}
                wert={preis[kraftstoff]}
                min={1.5}
                max={2.8}
                step={0.01}
                format={(v) => `${fmt(v, 2)} €/l`}
                minLabel="1,50 €"
                maxLabel="2,80 €"
                onChange={(v) => setPreis((p) => ({ ...p, [kraftstoff]: v }))}
              />
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`${kLabel} ${Math.round(r.verbrenner.summe)} Euro, E-Auto mit Solarstrom ${Math.round(r.solar.summe)} Euro pro Jahr`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihre Energiekosten pro Jahr</h2>
            <span className="ov-num rounded-full bg-ink-100 px-3 py-1 text-[12.5px] font-semibold text-ink-600">{fmt(Math.round(r.kwhGesamt / 10) * 10)} kWh Ladestrom</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl icon={Fuel} label={fahrzeug} zusatz={`${fmt(r.verbrenner.je100, 2)} € je 100 km`}>
              <Zahl wert={Math.round(r.verbrenner.summe)} suffix=" €" />
            </Kennzahl>
            <Kennzahl icon={CarFront} label="E-Auto mit PV" zusatz={`${fmt(r.solar.je100, 2)} € je 100 km`}>
              <Zahl wert={Math.round(r.solar.summe)} suffix=" €" />
            </Kennzahl>
            <Kennzahl ton={r.ersparnisSolar >= 0 ? "gruen" : "sand"} icon={PiggyBank} label={r.ersparnisSolar >= 0 ? "Ersparnis/Jahr" : "Mehrkosten/Jahr"} zusatz={`in 10 Jahren ≈ ${fmtEur(Math.abs(Math.round((r.ersparnisSolar * 10) / 100) * 100))}`}>
              <Zahl wert={Math.abs(Math.round(r.ersparnisSolar))} suffix=" €" />
            </Kennzahl>
            <Kennzahl ton="navy" icon={Leaf} label="CO₂ weniger" zusatz="im Betrieb pro Jahr">
              <Zahl wert={r.co2Ersparnis / 1000} stellen={1} suffix=" t" />
            </Kennzahl>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-3xl bg-ink-200/70 ring-1 ring-ink-200/70">
            {[
              [PlugZap, "Zu Hause", r.kwhZuhause - r.kwhSolar, "Netz"],
              [Sun, "Vom Dach", r.kwhSolar, "Solar"],
              [CarFront, "Unterwegs", r.kwhOeffentlich, "öffentlich"],
            ].map(([Icon, l, v, s]) => (
              <div key={l} className="bg-ink-50 px-3 py-3.5 sm:px-5">
                <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
                  <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                  {l}
                </p>
                <p className="ov-num mt-0.5 font-display text-[16px] font-bold text-ink-900 sm:text-[18px]">
                  {fmt(Math.round(v / 10) * 10)} <span className="text-[12px] font-semibold text-ink-500">kWh</span>
                </p>
                <p className="sr-only">{s}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-3xl ring-1 ring-ink-200/70">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 md:px-6">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Kosten pro Jahr im Vergleich</h3>
              <p className="text-[12.5px] text-ink-500">Solarstrom spart zusätzlich {fmtEur(r.solarVorteil)}</p>
            </div>
            <KostenChart r={r} fahrzeug={fahrzeug} />
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Nur Energiekosten – ohne Anschaffung, Steuer, Versicherung und Wartung. Orientierung, kein Angebot.
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

function KostenChart({ r, fahrzeug }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const reihen = [
    { id: "verbrenner", label: fahrzeug, teile: [["kraftstoff", r.verbrenner.summe]], summe: r.verbrenner.summe, je100: r.verbrenner.je100 },
    { id: "netz", label: "E-Auto · Netzstrom", teile: [["zuhause", r.netz.zuhause], ["oeffentlich", r.netz.oeffentlich]], summe: r.netz.summe, je100: r.netz.je100 },
    { id: "solar", label: "E-Auto · mit PV", teile: [["solar", r.solar.solar], ["zuhause", r.solar.zuhause], ["oeffentlich", r.solar.oeffentlich]], summe: r.solar.summe, je100: r.solar.je100 },
  ];
  const max = Math.max(...reihen.map((x) => x.summe), 1);
  const schritt = max > 3000 ? 1000 : max > 1200 ? 500 : 250;
  const skala = Math.ceil(max / schritt) * schritt;
  const P = { l: schmal ? 12 : 150, r: schmal ? 12 : 72, t: 10, b: 28 };
  const zeile = schmal ? 62 : 52;
  const balken = 22;
  const H = P.t + reihen.length * zeile + P.b;
  const x = (v) => Math.round((P.l + (v / skala) * (W - P.l - P.r)) * 10) / 10;
  const alleTicks = Array.from({ length: Math.floor(skala / schritt) + 1 }, (_, i) => i * schritt);
  // Auf schmalen Bildschirmen nur jede zweite Beschriftung
  const ticks = schmal && alleTicks.length > 4 ? [0, skala / 2, skala] : alleTicks;

  return (
    <div ref={ref} className="relative px-2 pb-4 pt-3 md:px-3">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={reihen.map((z) => `${z.label}: ${fmtEur(z.summe)} pro Jahr`).join(", ")}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={P.t} y2={H - P.b} stroke="#eef0f4" />
            <text x={x(t)} y={H - 8} textAnchor={t === 0 ? "start" : t === skala ? "end" : "middle"} className="fill-ink-500 text-[11px]">
              {t === skala ? `${fmt(t)} €` : fmt(t)}
            </text>
          </g>
        ))}
        {reihen.map((z, i) => {
          const yZeile = P.t + i * zeile;
          const yBalken = schmal ? yZeile + 26 : yZeile + (zeile - balken) / 2;
          let basis = 0;
          return (
            <g key={z.id}>
              <text x={schmal ? P.l : P.l - 12} y={schmal ? yZeile + 16 : yBalken + 15} textAnchor={schmal ? "start" : "end"} className="fill-ink-800 text-[13px] font-semibold">
                {z.label}
              </text>
              {schmal && (
                <text x={W - P.r} y={yZeile + 16} textAnchor="end" className="fill-ink-900 text-[13px] font-bold">
                  {fmtEur(z.summe)}
                </text>
              )}
              {z.teile.map(([k, v]) => {
                const x0 = x(basis);
                basis += v;
                const breite = Math.max(x(basis) - x0 - (v > 0 ? 1.5 : 0), 0);
                return (
                  <rect
                    key={k}
                    x={x0}
                    y={yBalken}
                    width={breite}
                    height={balken}
                    rx="4"
                    fill={SEGMENTE[k].farbe}
                    opacity={hover && (hover.zeile !== i || hover.k !== k) ? 0.45 : 1}
                    className="motion-safe:transition-all motion-safe:duration-500"
                    onPointerEnter={() => setHover({ zeile: i, k, v })}
                    onPointerLeave={() => setHover(null)}
                    onClick={() => setHover({ zeile: i, k, v })}
                  />
                );
              })}
              {!schmal && (
                <text x={x(z.summe) + 10} y={yBalken + 15} className="fill-ink-900 text-[13px] font-bold">
                  {fmtEur(z.summe)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover && (
        <Tooltip x={Math.min(x(reihen[hover.zeile].summe / 2), W - 40)} y={P.t + hover.zeile * zeile + 44} breite={W}>
          <p className="font-semibold">{reihen[hover.zeile].label}</p>
          <p className="text-white/70">
            {SEGMENTE[hover.k].label} <span className="ov-num font-semibold text-white">{fmtEur(hover.v)}</span>
          </p>
          <p className="text-white/70">
            Je 100 km <span className="ov-num font-semibold text-white">{fmt(reihen[hover.zeile].je100, 2)} €</span>
          </p>
        </Tooltip>
      )}
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        {Object.entries(SEGMENTE).map(([k, s]) => (
          <li key={k} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px]" style={{ background: s.farbe }} aria-hidden="true" />
            {k === "solar" ? `Solarstrom (${fmt(r.satzCt, 1)} ct entgangener Einspeiseerlös)` : s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
