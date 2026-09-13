"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Gift, Leaf, PiggyBank, RotateCcw, Sun, Thermometer } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Tooltip, Zahl, useBreite } from "./bausteine";
import { MobilKurz } from "./StromspeicherRechner";
import { rechneWaermepumpe } from "@/lib/rechner/waermepumpe";
import { WAERMEPUMPE as W, fmt, fmtEur } from "@/lib/rechner/annahmen";
import { angebotUrl } from "@/lib/rechner/angebot";
import { MONATE_LANG } from "@/lib/rechner/profile";

const FARBE = { solar: "#669933", netz: "#7fa7d6", raster: "#eef0f4" };

export default function WaermepumpeRechner() {
  const [modus, setModus] = useState("schaetzen");
  const [flaeche, setFlaeche] = useState(150);
  const [standardIdx, setStandardIdx] = useState(2);
  const [heizung, setHeizung] = useState("gas");
  const [gasKwh, setGasKwh] = useState(18000);
  const [oelLiter, setOelLiter] = useState(1800);
  const [gasPreis, setGasPreis] = useState(W.heizungen.gas.preisStandard);
  const [oelPreis, setOelPreis] = useState(W.heizungen.oel.preisStandard);
  const [jazManuell, setJazManuell] = useState(null);
  const [wpTarif, setWpTarif] = useState(W.wpTarifCt);
  const [pv, setPv] = useState("pv");
  const [kwp, setKwp] = useState(10);

  const standard = W.standards[standardIdx];
  const jaz = jazManuell ?? standard.jaz;
  const eingaben = {
    flaeche,
    standard: standard.id,
    verbrauchBekannt: modus === "bekannt",
    verbrauchWert: heizung === "oel" ? oelLiter : gasKwh,
    heizung,
    preis: heizung === "oel" ? oelPreis : gasPreis,
    jaz,
    wpTarifCt: wpTarif,
    pv,
    kwp,
  };
  const dVerbrauch = eingaben.verbrauchWert;
  const r = useMemo(
    () => rechneWaermepumpe({ ...eingaben, verbrauchWert: dVerbrauch }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eingaben.flaeche, eingaben.standard, eingaben.verbrauchBekannt, dVerbrauch, heizung, eingaben.preis, jaz, wpTarif, pv, eingaben.kwp]
  );
  // Was eine 10-kWp-Anlage beitragen würde – als Hinweis, wenn noch keine PV geplant ist
  const moeglich = useMemo(
    () => (pv === "keine" ? rechneWaermepumpe({ ...eingaben, verbrauchWert: dVerbrauch, pv: "pv", kwp: 10 }).solar : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pv, r]
  );

  const best = r.solar || r.netz;
  const fossilLabel = heizung === "oel" ? "Ölheizung" : "Gasheizung";
  const href = angebotUrl({ kwp: pv !== "keine" ? kwp : undefined, speicher: pv === "pvSpeicher" ? W.speicherMitPv : undefined, waermepumpe: true });

  const zeilen = [
    { id: "fossil", label: fossilLabel, icon: Flame, teile: [{ k: "energie", v: r.fossil.brennstoff, farbe: "bg-ink-400", l: heizung === "oel" ? "Heizöl" : "Gas" }, { k: "neben", v: r.fossil.nebenkosten, farbe: "bg-ink-200", l: "Grundpreis & Wartung" }], summe: r.fossil.summe, co2: r.fossil.co2 },
    { id: "netz", label: "Wärmepumpe · Netzstrom", icon: Thermometer, teile: [{ k: "energie", v: r.netz.strom, farbe: "bg-navy-400", l: "Netzstrom" }, { k: "neben", v: r.netz.nebenkosten, farbe: "bg-navy-100", l: "Wartung" }], summe: r.netz.summe, co2: r.netz.co2 },
  ];
  if (r.solar) {
    zeilen.push({
      id: "solar",
      label: `Wärmepumpe · ${Math.round(r.solar.anteil * 100)} % Solarstrom`,
      icon: Sun,
      teile: [
        { k: "energie", v: r.solar.reststrom * (wpTarif / 100), farbe: "bg-navy-400", l: "Netzstrom" },
        { k: "solar", v: r.solar.solarKwh * (r.solar.satzCt / 100), farbe: "bg-ov-500", l: "Solarstrom (entgangene Vergütung)" },
        { k: "neben", v: r.solar.nebenkosten, farbe: "bg-navy-100", l: "Wartung" },
      ],
      summe: r.solar.summe,
      co2: r.solar.co2,
      bestes: true,
    });
  } else {
    zeilen[1].bestes = true;
  }
  const maxSumme = Math.max(...zeilen.map((z) => z.summe));

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,410px)_1fr]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Heute", <Zahl key="h" wert={Math.round(r.fossil.summe)} suffix=" €" />],
              ["Wärmepumpe", <Zahl key="w" wert={Math.round(best.summe)} suffix=" €" />],
              [r.ersparnisBest >= 0 ? "Ersparnis" : "Mehrkosten", <Zahl key="e" wert={Math.abs(Math.round(r.ersparnisBest))} suffix=" €" />],
            ]}
          />

          <div className="space-y-8">
            <Gruppe titel="Gebäude">
              <Auswahl
                wert={modus}
                onChange={setModus}
                optionen={[
                  { id: "schaetzen", label: "Bedarf schätzen" },
                  { id: "bekannt", label: "Verbrauch bekannt" },
                ]}
              />
              {modus === "schaetzen" ? (
                <>
                  <Regler label="Wohnfläche" wert={flaeche} min={60} max={350} step={5} einheit="m²" onChange={setFlaeche} />
                  <Regler
                    label="Baujahr / Dämmstandard"
                    wert={standardIdx}
                    min={0}
                    max={W.standards.length - 1}
                    step={1}
                    format={(i) => W.standards[i].kurz}
                    minLabel="Altbau"
                    maxLabel="Neubau"
                    onChange={(i) => setStandardIdx(i)}
                    hinweis={`${standard.label}: ca. ${standard.kwhProQm} kWh Wärme je m² (inkl. Warmwasser)`}
                  />
                </>
              ) : heizung === "oel" ? (
                <Regler label="Heizölverbrauch" wert={oelLiter} min={400} max={6000} step={50} format={(v) => `${fmt(v)} l`} onChange={setOelLiter} hinweis="Durchschnitt der letzten Jahre laut Tankrechnungen" />
              ) : (
                <Regler label="Gasverbrauch" wert={gasKwh} min={4000} max={60000} step={500} format={(v) => `${fmt(v)} kWh`} onChange={setGasKwh} hinweis="Steht auf Ihrer Gas-Jahresabrechnung" />
              )}
            </Gruppe>

            <Gruppe titel="Heizung heute">
              <Auswahl
                wert={heizung}
                onChange={setHeizung}
                optionen={[
                  { id: "gas", label: "Gas" },
                  { id: "oel", label: "Heizöl" },
                ]}
              />
              {heizung === "oel" ? (
                <Regler label="Heizölpreis" wert={oelPreis} min={60} max={180} step={1} format={(v) => `${fmt(v)} €/100 l`} minLabel="60 €" maxLabel="180 €" onChange={setOelPreis} />
              ) : (
                <Regler label="Gaspreis" wert={gasPreis} min={6} max={20} step={0.1} format={(v) => `${fmt(v, 1)} ct/kWh`} minLabel="6 ct" maxLabel="20 ct" onChange={setGasPreis} />
              )}
            </Gruppe>

            <Gruppe titel="Wärmepumpe">
              <div>
                <Regler
                  label="Jahresarbeitszahl (JAZ)"
                  wert={jaz}
                  min={2.5}
                  max={5}
                  step={0.1}
                  stellen={1}
                  onChange={setJazManuell}
                  hinweis={jazManuell == null ? `Automatisch passend zum Gebäude – Luft-Wasser-Wärmepumpe.` : undefined}
                />
                {jazManuell != null && (
                  <button type="button" onClick={() => setJazManuell(null)} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-ov-700 hover:text-ov-800">
                    <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> Empfehlung für Ihr Gebäude ({fmt(standard.jaz, 1)})
                  </button>
                )}
              </div>
              <Regler label="Strompreis Wärmepumpe" wert={wpTarif} min={18} max={40} step={0.5} format={(v) => `${fmt(v, 1)} ct/kWh`} minLabel="18 ct" maxLabel="40 ct" onChange={setWpTarif} hinweis="Wärmepumpentarif oder Haushaltsstrom mit § 14a-Reduzierung" />
            </Gruppe>

            <Gruppe titel="Photovoltaik">
              <Auswahl
                wert={pv}
                onChange={setPv}
                klein
                optionen={[
                  { id: "keine", label: "Keine" },
                  { id: "pv", label: "PV" },
                  { id: "pvSpeicher", label: "PV + Speicher" },
                ]}
              />
              {pv !== "keine" && <Regler label="Anlagengröße" wert={kwp} min={3} max={25} step={0.5} stellen={kwp % 1 ? 1 : 0} einheit="kWp" minLabel="3 kWp" maxLabel="25 kWp" onChange={setKwp} />}
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`Heizkosten heute ${Math.round(r.fossil.summe)} Euro, mit Wärmepumpe ${Math.round(best.summe)} Euro pro Jahr`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihre Heizkosten im Vergleich</h2>
            <span className="ov-num rounded-full bg-ink-100 px-3 py-1 text-[12.5px] font-semibold text-ink-600">
              Wärmebedarf ≈ {fmt(Math.round(r.bedarf / 100) * 100)} kWh/Jahr
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl icon={Flame} label={`${fossilLabel} heute`} zusatz={heizung === "oel" ? `${fmt(Math.round(r.fossil.menge / 10) * 10)} l Öl` : `${fmt(Math.round(r.fossil.menge / 100) * 100)} kWh Gas`}>
              <Zahl wert={Math.round(r.fossil.summe)} suffix=" €" />
            </Kennzahl>
            <Kennzahl icon={Thermometer} label="Mit Wärmepumpe" zusatz={`${fmt(Math.round(r.wpStrom / 10) * 10)} kWh Strom`}>
              <Zahl wert={Math.round(best.summe)} suffix=" €" />
            </Kennzahl>
            <Kennzahl ton={r.ersparnisBest >= 0 ? "gruen" : "sand"} icon={PiggyBank} label={r.ersparnisBest >= 0 ? "Ersparnis/Jahr" : "Mehrkosten/Jahr"} zusatz={r.ersparnisBest >= 0 ? `${Math.round((r.ersparnisBest / r.fossil.summe) * 100)} % weniger` : "JAZ oder Strompreis prüfen"}>
              <Zahl wert={Math.abs(Math.round(r.ersparnisBest))} suffix=" €" />
            </Kennzahl>
            <Kennzahl ton="navy" icon={Leaf} label="CO₂ weniger" zusatz={`${Math.round(r.co2Anteil * 100)} % weniger Emissionen`}>
              <Zahl wert={r.co2Ersparnis / 1000} stellen={1} suffix=" t" />
            </Kennzahl>
          </div>

          {/* Kostenvergleich */}
          <div className="mt-5 space-y-4 rounded-3xl bg-ink-50 p-5 md:p-6">
            <h3 className="font-display text-[16px] font-bold text-ink-900">Jährliche Heizkosten</h3>
            {zeilen.map((z) => (
              <div key={z.id}>
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[13.5px]">
                  <span className={cn("flex items-center gap-1.5 font-semibold", z.bestes ? "text-ov-700" : "text-ink-800")}>
                    <z.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    <span>{z.label}</span>
                  </span>
                  <span className="ov-num shrink-0 text-ink-500">
                    {fmt(z.co2 / 1000, 1)} t CO₂ · <strong className="text-[15px] text-ink-900">{fmtEur(z.summe)}</strong>
                  </span>
                </div>
                <div
                  className="flex h-4 overflow-hidden rounded-full bg-white ring-1 ring-ink-200/60"
                  role="img"
                  aria-label={`${z.label}: ${fmtEur(z.summe)} pro Jahr, davon ${z.teile.map((t) => `${t.l} ${fmtEur(t.v)}`).join(", ")}`}
                >
                  {z.teile.map((t) => (
                    <span
                      key={t.k}
                      title={`${t.l}: ${fmtEur(t.v)}`}
                      className={cn("h-full motion-safe:transition-[width] motion-safe:duration-500", t.farbe)}
                      style={{ width: `${(t.v / maxSumme) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[12px] text-ink-500">
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ink-400" aria-hidden="true" />Brennstoff</li>
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-navy-400" aria-hidden="true" />Netzstrom</li>
              {r.solar && <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ov-500" aria-hidden="true" />Solarstrom ({fmt(r.solar.satzCt, 1)} ct entgangene Vergütung)</li>}
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ink-200" aria-hidden="true" />Grundpreis, Wartung</li>
            </ul>
          </div>

          <div className="mt-7 rounded-3xl ring-1 ring-ink-200/70">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 md:px-6">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Strombedarf der Wärmepumpe je Monat</h3>
              <p className="text-[12.5px] text-ink-500">
                {r.solar ? `${fmt(Math.round(r.solar.solarKwh / 10) * 10)} kWh vom eigenen Dach` : "ohne Photovoltaik"}
              </p>
            </div>
            <MonatsChart monate={r.monate} mitPv={!!r.solar} />
            {moeglich && (
              <p className="mx-5 mb-5 rounded-2xl bg-ov-50 px-4 py-3 text-[13.5px] leading-relaxed text-ink-700 ring-1 ring-ov-100 md:mx-6">
                <Sun aria-hidden="true" className="mr-1.5 inline h-4 w-4 -translate-y-px text-ov-600" />
                Mit einer 10-kWp-PV-Anlage käme rund <strong>{Math.round(moeglich.anteil * 100)} %</strong> des Wärmepumpenstroms vom eigenen Dach.{" "}
                <button type="button" onClick={() => setPv("pv")} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                  Durchrechnen
                </button>
              </p>
            )}
          </div>

          <div className="mt-5 flex gap-4 rounded-3xl bg-navy-950 p-5 text-white md:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500">
              <Gift aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[16.5px] font-bold">
                BEG-Förderung: <span className="ov-num">{fmtEur(r.foerderung.min)}</span> bis <span className="ov-num">{fmtEur(r.foerderung.max)}</span> Zuschuss möglich
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/70">
                KfW 458: {W.foerderung.grundProzent} % Grundförderung, mit Klimageschwindigkeits- und Einkommensbonus bis {W.foerderung.maxProzent} % – bei
                max. {fmtEur(W.foerderung.kostenDeckelErsteWe)} förderfähigen Kosten (erste Wohneinheit). Antrag vor Vertragsabschluss.{" "}
                <Link href="/foerdercheck" className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-2 hover:decoration-current">
                  Förder-Check
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Orientierung ohne Heizlastberechnung – kein Angebot. Wir prüfen Heizkörper, Vorlauftemperatur und Aufstellort vor Ort.
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

function MonatsChart({ monate, mitPv }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 220 : 260;
  const P = { l: 46, r: 8, t: 26, b: 30 };
  const maxWert = Math.max(...monate.map((m) => m.wp), 1);
  const skala = maxWert > 600 ? Math.ceil(maxWert / 250) * 250 : Math.ceil(maxWert / 100) * 100;
  const bw = (W - P.l - P.r) / 12;
  const y = (v) => Math.round((P.t + (1 - v / skala) * (H - P.t - P.b)) * 10) / 10;
  const ticks = [0, skala / 2, skala];
  const aktiv = hover != null ? monate[hover] : null;

  return (
    <div ref={ref} className="relative px-2 pb-4 pt-2 md:px-3">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={`Monatlicher Strombedarf der Wärmepumpe, höchster Wert im Januar mit ${fmt(Math.round(monate[0].wp))} kWh${mitPv ? `, davon ${fmt(Math.round(monate[0].solar))} kWh Solarstrom` : ""}.`}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={FARBE.raster} />
            <text x={P.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">{fmt(v)}</text>
          </g>
        ))}
        <text x={P.l - 8} y={P.t - 14} textAnchor="end" className="fill-ink-500 text-[10px]">kWh</text>
        {monate.map((m, i) => {
          const x = P.l + i * bw;
          const breite = Math.max(bw * (schmal ? 0.62 : 0.56), 6);
          const x0 = Math.round((x + (bw - breite) / 2) * 10) / 10;
          const netz = m.wp - m.solar;
          return (
            <g key={m.name} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} onClick={() => setHover(i)}>
              <rect x={x} y={P.t} width={bw} height={H - P.t - P.b} fill={hover === i ? "#f7f8fa" : "transparent"} />
              <rect x={x0} y={y(m.wp)} width={breite} height={Math.max(y(m.solar) - y(m.wp), 0)} rx="3" fill={FARBE.netz} className="motion-safe:transition-all motion-safe:duration-500" />
              {m.solar > 0 && <rect x={x0} y={y(m.solar)} width={breite} height={Math.max(y(0) - y(m.solar), 0)} rx="3" fill={FARBE.solar} className="motion-safe:transition-all motion-safe:duration-500" />}
              <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="fill-ink-500 text-[11px]">
                {schmal ? m.name.slice(0, 1) : m.name}
              </text>
              <title>{`${m.name}: ${fmt(Math.round(m.wp))} kWh, davon ${fmt(Math.round(m.solar))} kWh Solar, ${fmt(Math.round(netz))} kWh Netz`}</title>
            </g>
          );
        })}
      </svg>
      {aktiv && (
        <Tooltip x={P.l + hover * bw + bw / 2 + 8} y={20} breite={W}>
          <p className="font-semibold">{MONATE_LANG[hover]}</p>
          <p className="text-white/70">Wärmepumpe <span className="ov-num font-semibold text-white">{fmt(Math.round(aktiv.wp))} kWh</span></p>
          {mitPv && (
            <p className="text-white/70">
              Solar <span className="ov-num font-semibold text-ov-300">{fmt(Math.round(aktiv.solar))} kWh</span> · {Math.round((aktiv.solar / Math.max(aktiv.wp, 1)) * 100)} %
            </p>
          )}
          <p className="text-white/70">Netz <span className="ov-num font-semibold text-white">{fmt(Math.round(aktiv.wp - aktiv.solar))} kWh</span></p>
        </Tooltip>
      )}
      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        {mitPv && <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" aria-hidden="true" />Solarstrom vom Dach</li>}
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-navy-300" aria-hidden="true" />Netzstrom</li>
      </ul>
    </div>
  );
}

