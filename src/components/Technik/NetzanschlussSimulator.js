"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Info, Waves } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { BEISPIELBEREICHE, COS_PHI_MIN, bewerte } from "@/lib/technik/netzvertraeglichkeit";

/**
 * Netzanschluss-Simulator (Paket B04): vereinfachte Vorabschätzung der Spannungsänderung
 * Δu ≈ S·cos(ψ+φ)/Sk am Verknüpfungspunkt mit Ampel gegen 3 % (NS) bzw. 2 % (MS) laut TOR D2
 * und dem nötigen cos φ. Sk und ψ gibt der Nutzer ein (Auskunft des Netzbetreibers); die
 * Beispielbereiche sind neutral und als solche gekennzeichnet. Ergebnis bleibt am Bildschirm
 * frei (Lead-Gate-Regel Stufe 1; hier gibt es keinen Export).
 */

const zahl = (n, s = 2) => (Number.isFinite(n) ? n.toLocaleString("de-AT", { minimumFractionDigits: s, maximumFractionDigits: s }) : "–");

const AMPEL = {
  gruen: { label: "Grenze eingehalten", kurz: "grün", box: "bg-ov-500/15 text-ov-200 ring-ov-400/30", punkt: "bg-ov-400", icon: CheckCircle2 },
  gelb: { label: "Knapp an der Grenze", kurz: "gelb", box: "bg-sun-400/10 text-sun-300 ring-sun-400/30", punkt: "bg-sun-300", icon: AlertTriangle },
  rot: { label: "Grenze überschritten", kurz: "rot", box: "bg-red-500/15 text-red-200 ring-red-400/30", punkt: "bg-red-400", icon: AlertTriangle },
  unbekannt: { label: "Eingaben prüfen", kurz: "ohne Bewertung", box: "bg-white/[0.06] text-white/70 ring-white/10", punkt: "bg-white/40", icon: Info },
};

function Eingabe({ id, label, wert, onChange, min, max, step, einheit, anzeige, hinweis, marken }) {
  const [text, setText] = useState(String(wert).replace(".", ","));
  const [fokus, setFokus] = useState(false);
  const angezeigt = fokus ? text : String(wert).replace(".", ",");
  const fill = ((wert - min) / (max - min)) * 100;
  const uebernehmen = (t) => {
    const n = Number(String(t).trim().replace(/\./g, "").replace(",", "."));
    if (Number.isFinite(n) && String(t).trim() !== "") onChange(Math.min(max, Math.max(min, n)));
  };
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={`${id}-r`} className="min-w-0 text-[14px] font-medium text-ink-700">
          {label}
        </label>
        <span className="flex shrink-0 items-center gap-2">
          <input
            id={`${id}-t`}
            aria-label={`${label} in ${einheit}`}
            inputMode="decimal"
            value={angezeigt}
            onFocus={() => {
              setText(String(wert).replace(".", ","));
              setFokus(true);
            }}
            onBlur={() => setFokus(false)}
            onChange={(e) => {
              setText(e.target.value);
              uebernehmen(e.target.value);
            }}
            className="ov-num h-11 w-24 rounded-xl sm:w-28 bg-white px-3 text-right font-display text-[18px] font-extrabold text-ink-900 ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500"
          />
          {einheit && <span className="w-9 text-[14px] font-semibold text-ink-500">{einheit}</span>}
        </span>
      </div>
      <input
        id={`${id}-r`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        aria-valuetext={anzeige ? anzeige(wert) : `${zahl(wert, step < 1 ? 2 : 0)} ${einheit}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range mt-4 block cursor-pointer"
        style={{ "--ov-fill": `${Math.max(0, Math.min(100, fill))}%` }}
      />
      {marken && (
        <div className="mt-2 flex justify-between text-[11.5px] text-ink-500" aria-hidden="true">
          {marken.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
      {hinweis && <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">{hinweis}</p>}
    </div>
  );
}

/** Farben der Zeiger (Diagramm und Legende). */
const FARBEN = { un: "#7fa7d6", du: "#ffc53d", vp: "#8cba58", i: "#ffffff" };

/** Zeigerdiagramm: U_N (Netz), ΔU über der Netzimpedanz, U_VP am Verknüpfungspunkt, Strom I. */
function Zeigerdiagramm({ z, deltaU, cosPhi, erregung, id }) {
  const W = 420;
  const H = 300;
  const ox = 54;
  const oy = H / 2 + 20;
  // Überhöhung der Spannungsänderung, damit sie sichtbar bleibt (Faktor im Diagramm angegeben)
  const faktor = z ? Math.max(1, Math.min(40, 0.12 / Math.max(1e-4, Math.hypot(z.deltaRe, z.deltaIm)))) : 1;
  const L = 250; // Länge U_N in px
  const p = (re, im) => [ox + re * L, oy - im * L];
  const un = p(1, 0);
  const d = z ? [z.deltaRe * faktor, z.deltaIm * faktor] : [0, 0];
  const uvp = p(1 + d[0], d[1]);
  // Stromzeiger (skaliert auf 0,55·L), Bezug: U_N
  const iL = 0.55 * L;
  const ip = z ? [ox + z.strom.re * iL, oy - z.strom.im * iL] : [ox, oy];
  const phi = z ? z.strom.phiGrad : 0;
  const stromAufAchse = Math.abs(ip[1] - oy) < 18;
  const senkt = Number.isFinite(deltaU) && deltaU < 0;
  const text = z
    ? `Zeigerdiagramm: Die Netzspannung U_N liegt auf der reellen Achse. Der Strom der Anlage ${cosPhi >= 0.999 ? "liegt in Phase mit der Spannung (cos φ = 1)" : `ist um ${zahl(Math.abs(phi), 1)} Grad gegen die Spannung verschoben (${erregung === "untererregt" ? "untererregt, die Anlage nimmt Blindleistung auf" : "übererregt, die Anlage gibt Blindleistung ab"})`}. Der Spannungsfall über der Netzimpedanz ${senkt ? "senkt" : "hebt"} die Spannung am Verknüpfungspunkt um etwa ${zahl(Math.abs(deltaU), 2)} Prozent ${senkt ? "ab" : "an"} (Längsanteil, im Diagramm ${zahl(faktor, 0)}-fach überhöht).`
    : "Zeigerdiagramm ohne gültige Eingaben.";
  const pfeil = (k) => `url(#${id}-pf-${k})`;
  const legende = [
    { k: "un", kurz: "U_N", l: "Netzspannung ohne Anlage" },
    { k: "vp", kurz: "U_VP", l: "Spannung am Verknüpfungspunkt mit Anlage" },
    { k: "du", kurz: "ΔU", l: `Spannungsänderung (${zahl(faktor, 0)}-fach überhöht)` },
    { k: "i", kurz: "I", l: cosPhi < 0.999 ? `Anlagenstrom, φ = ${zahl(Math.abs(phi), 1)}° ${erregung === "untererregt" ? "untererregt" : "übererregt"}` : "Anlagenstrom, cos φ = 1" },
  ];
  return (
    <figure className="mt-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby={`${id}-zt`} aria-describedby={`${id}-zd`}>
        <title id={`${id}-zt`}>Zeigerdiagramm Spannung und Strom am Verknüpfungspunkt</title>
        <desc id={`${id}-zd`}>{text}</desc>
        <defs>
          {/* Je Farbe ein eigener Marker: currentColor des Pfeils wird nicht an den Marker vererbt */}
          {Object.entries(FARBEN).map(([k, f]) => (
            <marker key={k} id={`${id}-pf-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill={f} />
            </marker>
          ))}
        </defs>
        {/* Achsen */}
        <line x1={ox - 30} x2={W - 10} y1={oy} y2={oy} stroke="rgba(255,255,255,0.14)" />
        <line x1={ox} x2={ox} y1={30} y2={H - 20} stroke="rgba(255,255,255,0.14)" />
        <text x={W - 12} y={oy + 18} textAnchor="end" fontSize="12" fill="rgba(255,255,255,0.6)">
          Re
        </text>
        <text x={ox + 8} y={40} fontSize="12" fill="rgba(255,255,255,0.6)">
          Im
        </text>
        {/* U_N */}
        <line x1={ox} y1={oy} x2={un[0]} y2={un[1]} stroke={FARBEN.un} strokeWidth="3" markerEnd={pfeil("un")} />
        <text x={un[0] - 4} y={oy + 20} textAnchor="end" fontSize="13" fontWeight="700" fill={FARBEN.un}>
          U_N
        </text>
        {/* U_VP */}
        {z && (
          <>
            <line x1={ox} y1={oy} x2={uvp[0]} y2={uvp[1]} stroke={FARBEN.vp} strokeWidth="2.5" strokeDasharray="6 4" markerEnd={pfeil("vp")} />
            <text x={uvp[0] - 12} y={Math.min(uvp[1], oy) - 12} textAnchor="end" fontSize="13" fontWeight="700" fill={FARBEN.vp}>
              U_VP
            </text>
          </>
        )}
        {/* ΔU */}
        {z && (
          <>
            <line x1={uvp[0]} y1={uvp[1]} x2={uvp[0]} y2={oy} stroke={FARBEN.du} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1={un[0]} y1={un[1]} x2={uvp[0]} y2={uvp[1]} stroke={FARBEN.du} strokeWidth="2.5" markerEnd={pfeil("du")} />
            <text x={Math.max(un[0], uvp[0]) + 8} y={uvp[1] + (uvp[1] > oy ? 16 : -6)} fontSize="13" fontWeight="700" fill={FARBEN.du}>
              ΔU
            </text>
          </>
        )}
        {/* Strom */}
        {z && (
          <>
            <line x1={ox} y1={oy} x2={ip[0]} y2={ip[1]} stroke={FARBEN.i} strokeWidth="2" markerEnd={pfeil("i")} opacity="0.9" />
            <text x={stromAufAchse ? ip[0] - 4 : ip[0] + 8} y={stromAufAchse ? oy + 20 : ip[1] + (ip[1] > oy ? 16 : -4)} textAnchor={stromAufAchse ? "end" : "start"} fontSize="13" fontWeight="700" fill={FARBEN.i}>
              I
            </text>
          </>
        )}
        <text x={ox - 30} y={H - 4} fontSize="11.5" fill="rgba(255,255,255,0.6)">
          ΔU im Diagramm {zahl(faktor, 0)}-fach überhöht · Strom nicht maßstäblich
        </text>
      </svg>
      <ul className="mt-3 grid gap-1.5 text-[12.5px] leading-snug text-white/70 sm:grid-cols-2" aria-label="Legende Zeigerdiagramm">
        {legende.map((l) => (
          <li key={l.k} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-[6px] h-[3px] w-4 shrink-0 rounded-full" style={{ background: FARBEN[l.k] }} />
            <span>
              <strong className="font-semibold" style={{ color: FARBEN[l.k] }}>
                {l.kurz}
              </strong>{" "}
              {l.l}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-[12.5px] leading-relaxed text-white/60">
        <span className="font-semibold text-white/80">Textalternative:</span> {text}
      </figcaption>
    </figure>
  );
}

export default function NetzanschlussSimulator() {
  const id = useId();
  const [netzebene, setNetzebene] = useState("NS");
  const [sKva, setSKva] = useState(200);
  const [skMva, setSkMva] = useState(5);
  const [psiGrad, setPsiGrad] = useState(45);
  const [cosPhi, setCosPhi] = useState(1);
  const [erregung, setErregung] = useState("untererregt");
  const [typ, setTyp] = useState("A");

  const e = useMemo(() => ({ sKva, skMva, psiGrad, cosPhi, erregung, netzebene, typ }), [sKva, skMva, psiGrad, cosPhi, erregung, netzebene, typ]);
  const r = useMemo(() => bewerte(e), [e]);
  const a = AMPEL[r.ampel.stufe] ?? AMPEL.unbekannt;
  const AIcon = a.icon;
  const bsp = BEISPIELBEREICHE[netzebene];

  const beispielSetzen = (ebene) => {
    const b = BEISPIELBEREICHE[ebene];
    setNetzebene(ebene);
    setSkMva(ebene === "NS" ? 5 : 100);
    setPsiGrad(ebene === "NS" ? 45 : 75);
    setSKva(ebene === "NS" ? 200 : 2000);
    setTyp(ebene === "NS" ? "A" : "B");
    return b;
  };

  // Reglergrenzen je Netzebene (Schrittweiten so, dass die Beispielwerte genau erreichbar sind)
  const GRENZ = {
    NS: { s: [5, 1000, 5], sk: [0.5, 50, 0.5] },
    MS: { s: [50, 20000, 50], sk: [10, 1000, 10] },
  };
  const klemmen = (v, [min, max, step]) => {
    const n = Math.min(max, Math.max(min, Number(v)));
    return Math.round((min + Math.round((n - min) / step) * step) * 1000) / 1000;
  };
  // Beim Ebenenwechsel Werte an die neuen Reglergrenzen anpassen, damit Anzeige und Rechnung übereinstimmen
  const ebeneWechseln = (ebene) => {
    if (ebene === netzebene) return;
    setNetzebene(ebene);
    setSKva((v) => klemmen(v, GRENZ[ebene].s));
    setSkMva((v) => klemmen(v, GRENZ[ebene].sk));
  };
  const g = GRENZ[netzebene];

  const grenzKva = r.maxKvaCosPhi1;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Eingabe */}
        <div className="flex min-w-0 flex-col gap-7 p-5 sm:p-6 md:p-9">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Netzanschluss-Simulator</p>
            <h3 className="ov-h3 mt-2 text-ink-900">Wie stark hebt Ihre Anlage die Spannung am Verknüpfungspunkt?</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
              Kurzschlussleistung S<sub>k</sub> und Netzimpedanzwinkel ψ bekommen Sie vom Netzbetreiber (Anschlusskonzept oder Auskunft). Die Beispielwerte sind neutral und ersetzen
              diese Auskunft nicht.
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 text-[14px] font-medium text-ink-700">Netzebene am Verknüpfungspunkt</legend>
            <div className="inline-flex gap-1 rounded-full bg-sand-50 p-1 ring-1 ring-ink-200/70">
              {[
                { k: "NS", l: "Niederspannung", g: "3 %" },
                { k: "MS", l: "Mittelspannung", g: "2 %" },
              ].map((o) => (
                <button
                  key={o.k}
                  type="button"
                  aria-pressed={netzebene === o.k}
                  onClick={() => ebeneWechseln(o.k)}
                  className={cn("min-h-11 whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold transition-colors", netzebene === o.k ? "bg-navy-950 text-white" : "text-ink-700 hover:text-ink-900")}
                >
                  <span className="sm:hidden">{o.k}</span>
                  <span className="hidden sm:inline">{o.l}</span> · {o.g}
                </button>
              ))}
            </div>
          </fieldset>

          <Eingabe id={`${id}-s`} label="Anschlussscheinleistung der Anlage" wert={sKva} onChange={setSKva} min={g.s[0]} max={g.s[1]} step={g.s[2]} einheit="kVA" marken={netzebene === "NS" ? ["5", "500", "1000"] : ["50", "10.000", "20.000"]} hinweis="Summe der Wechselrichter-Scheinleistung (AC) am Verknüpfungspunkt, inklusive Speicher." />
          <Eingabe
            id={`${id}-sk`}
            label="Kurzschlussleistung Sk am Verknüpfungspunkt"
            wert={skMva}
            onChange={setSkMva}
            min={g.sk[0]}
            max={g.sk[1]}
            step={g.sk[2]}
            einheit="MVA"
            marken={netzebene === "NS" ? ["0,5", "25", "50"] : ["10", "500", "1000"]}
            hinweis={`Beispielbereich ${netzebene}: ${zahl(bsp.skMva[0], 0)}–${zahl(bsp.skMva[1], 0)} MVA (${bsp.hinweis}) – Richtwert, nicht Ihr Netz.`}
          />
          <Eingabe id={`${id}-psi`} label="Netzimpedanzwinkel ψ" wert={psiGrad} onChange={setPsiGrad} min={0} max={90} step={1} einheit="°" marken={["0°", "45°", "90°"]} hinweis={`Beispielbereich ${netzebene}: ${bsp.psiGrad[0]}–${bsp.psiGrad[1]}° – je größer ψ, desto kleiner die Spannungsanhebung bei cos φ = 1.`} />

          <div>
            <Eingabe id={`${id}-cos`} label="Verschiebungsfaktor cos φ der Anlage" wert={cosPhi} onChange={setCosPhi} min={0.9} max={1} step={0.005} einheit="" anzeige={(v) => `cos φ ${zahl(v, 3)}`} marken={["0,90", "0,95", "1,00"]} />
            <div className="mt-3 inline-flex gap-1 rounded-full bg-sand-50 p-1 ring-1 ring-ink-200/70">
              {[
                { k: "untererregt", l: "untererregt", z: "senkt U" },
                { k: "uebererregt", l: "übererregt", z: "hebt U" },
              ].map((o) => (
                <button key={o.k} type="button" aria-pressed={erregung === o.k} onClick={() => setErregung(o.k)} disabled={cosPhi >= 0.999} className={cn("min-h-11 whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold transition-colors disabled:opacity-50", erregung === o.k ? "bg-navy-950 text-white" : "text-ink-700 hover:text-ink-900")}>
                  {o.l}
                  <span className="hidden sm:inline"> ({o.z})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold text-ink-500">Beispielwerte (neutral):</span>
            <button type="button" onClick={() => beispielSetzen("NS")} className="min-h-11 rounded-full bg-white px-3.5 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200/70 hover:ring-ov-300">
              NS: 200 kVA · 5 MVA · 45°
            </button>
            <button type="button" onClick={() => beispielSetzen("MS")} className="min-h-11 rounded-full bg-white px-3.5 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200/70 hover:ring-ov-300">
              MS: 2 MVA · 100 MVA · 75°
            </button>
          </div>
        </div>

        {/* Ergebnis */}
        <div aria-live="polite" className="relative min-w-0 overflow-hidden bg-navy-950 p-5 text-white sm:p-6 md:p-9">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
          <div className="relative min-w-0">
            <p className="text-[13px] text-white/60">Spannungsänderung am Verknüpfungspunkt (Δu ≈ S·cos(ψ+φ)/S<sub>k</sub>)</p>
            <p className="ov-num mt-1 font-display text-[48px] font-extrabold leading-none tracking-tight md:text-[56px]">
              {Number.isFinite(r.deltaUProzent) ? `${r.deltaUProzent >= 0 ? "+" : ""}${zahl(r.deltaUProzent, 2)} %` : "–"}
            </p>
            <p className={cn("mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[15px] font-semibold ring-1", a.box)}>
              <AIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                Ampel {a.kurz}: {a.label}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/70">
                  Grenze {r.grenze.grenzeProzent} % in der {r.grenze.netz} laut TOR D2 · Auslastung {Number.isFinite(r.ampel.auslastung) ? `${zahl(r.ampel.auslastung * 100, 0)} %` : "–"} · Summe aller Erzeugungsanlagen zählt
                </span>
              </span>
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="text-[12.5px] text-white/60">Nötiger cos φ (untererregt)</p>
                <p className="ov-num mt-1 font-display text-[24px] font-extrabold tracking-tight text-sun-300">{r.cosPhi.noetig ? zahl(r.cosPhi.cosPhi, 3) : "nicht nötig"}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
                  {r.cosPhi.noetig ? (r.cosPhi.imBereich ? `φ ≈ ${zahl(r.cosPhi.phiGrad, 1)}°, innerhalb Typ ${typ} (cos φ ≥ ${zahl(COS_PHI_MIN[typ], 3)})` : `Außerhalb des TOR-Bereichs Typ ${typ} (cos φ ≥ ${zahl(COS_PHI_MIN[typ], 3)}) – Blindleistung allein reicht nicht.`) : "cos φ = 1 hält die Grenze ein."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="text-[12.5px] text-white/60">Max. Scheinleistung bei cos φ = 1</p>
                <p className="ov-num mt-1 font-display text-[24px] font-extrabold tracking-tight">{Number.isFinite(grenzKva) ? `${zahl(grenzKva, 0)} kVA` : "–"}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">An diesem Verknüpfungspunkt bis zur Grenze von {r.grenze.grenzeProzent} %.</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/70">
              <span className="text-white/60">Blindleistungsbereich nach TOR für</span>
              <div className="inline-flex gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10" role="group" aria-label="Anlagentyp">
                {["A", "B"].map((t) => (
                  <button key={t} type="button" aria-pressed={typ === t} onClick={() => setTyp(t)} className={cn("min-h-11 min-w-[3.5rem] rounded-full px-3.5 text-[12.5px] font-semibold transition-colors", typ === t ? "bg-white text-navy-950" : "text-white/70 hover:text-white")}>
                    Typ {t}
                  </button>
                ))}
              </div>
            </div>

            <Zeigerdiagramm z={r.zeiger} deltaU={r.deltaUProzent} cosPhi={cosPhi} erregung={erregung} id={id.replace(/[^a-zA-Z0-9]/g, "")} />

            <p className="mt-5 flex items-start gap-2 rounded-xl bg-white/[0.06] px-3.5 py-3 text-[13px] leading-relaxed text-white/80 ring-1 ring-white/10">
              <Waves aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
              <span>
                <strong className="text-white">Vereinfachte Vorabschätzung, verbindlich prüft der Netzbetreiber.</strong> Die Formel vernachlässigt die Vorbelastung durch andere Anlagen, Lastfluss, Stufensteller und die Impedanz Ihrer
                Kundenanlage. Richtwert/Orientierung, Stand 10/2026.
              </span>
            </p>
            <Link href="/termin?art=video" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-300 hover:text-ov-200">
              Netzanschluss mit uns durchrechnen
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-3.5 text-[12.5px] leading-relaxed text-ink-500 md:px-9">
        Formel und Grenzwerte: TOR D2 (E-Control, Richtlinie zur Beurteilung von Netzrückwirkungen, auf Basis der D-A-CH-CZ-Regeln); Einordnung der Netzanschlussprüfung: Swiss Economics/IAEW für die E-Control, „Beurteilung des Netzanschlusses und der
        Netzanschlusskapazitäten in Österreich“ (2022). Blindleistungsbereiche: TOR Typ A V1.4 (cos φ 0,9), Typ B V1.3 Bereich II (cos φ 0,925). Der Netzbetreiber kann abweichende Grenzwerte vorgeben.
      </p>
    </div>
  );
}
