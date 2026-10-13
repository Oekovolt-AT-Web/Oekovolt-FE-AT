"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, BarChart3, FileCheck2, Landmark, Leaf, ListChecks, Scale, TrendingUp } from "lucide-react";
import { Kennzahl } from "@/components/Rechner/bausteine";
import { cn } from "@/components/ui/cn";
import { HAFTUNG, VARIANTEN, euro, prozent, zahl } from "@/lib/dossier/rechnung";

/**
 * Darstellung der Dossier-Rechnung (src/lib/dossier/rechnung.js) auf dem Bildschirm – für
 * /dossier (Varianten GF/CFO, Bank, Gemeinderat) und /rechner/investitionsantrag.
 * `beispiel` kennzeichnet die Vorschau vor dem Lead-Gate (Beispielwerte, keine Auswertung).
 */
export default function DossierAuswertung({ rechnung: r, beispiel = false, kompakt = false }) {
  const v = VARIANTEN.find((x) => x.id === r.variante) || VARIANTEN[0];
  const cf = r.cashflow;

  const Abschnitt = ({ id, icon: Icon, titel, unter, children }) => (
    <section aria-labelledby={`${id}-titel`} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-50 text-ov-600 ring-1 ring-ink-200/70">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 id={`${id}-titel`} className="font-display text-[19px] font-extrabold tracking-tight text-ink-900 md:text-[21px]">
            {titel}
          </h3>
          {unter && <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{unter}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );

  const kennzahlen = (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {r.kennzahlen.map((k, i) => (
        <Kennzahl key={k.label} label={k.label} zusatz={k.hinweis} ton={i === 0 ? "gruen" : "sand"}>
          {k.wert}
        </Kennzahl>
      ))}
    </div>
  );

  const entscheidung = (
    <Abschnitt id="entscheidung" icon={FileCheck2} titel="Entscheidungsvorlage" unter={`${zahl(cf.eingaben.kwp)} kWp · Investition ${euro(cf.anlagenpreis)} netto · Eigenverbrauch ${prozent(cf.eingaben.eigenverbrauchsquote)} · Stand ${r.stand.label}`}>
      {kennzahlen}
      <ul className="mt-5 space-y-2 text-[14.5px] leading-relaxed text-ink-700">
        <li>
          Die Anlage erzeugt im ersten Jahr rund <strong className="ov-num text-ink-900">{zahl(cf.jahr1.erzeugung)} kWh</strong>; der Betrieb nutzt {zahl(cf.jahr1.ev)} kWh selbst und spart damit {euro(cf.jahr1.ersparnis)}; der Überschuss bringt {euro(cf.jahr1.erloes)} Einspeiseerlös.
        </li>
        <li>
          Über 25 Jahre ergibt sich bei {prozent(cf.eingaben.kalkulationszins, 1)} Kalkulationszins ein Kapitalwert von <strong className="ov-num text-ink-900">{euro(cf.kapitalwert)}</strong>
          {cf.ifb.aktiv ? ` (inkl. IFB-Steuereffekt ${euro(cf.ifb.effekt)} im Jahr 1)` : ""}.
        </li>
        {cf.kredit && (
          <li>
            Kreditvariante: {prozent(cf.eingaben.kredit.fremdkapitalAnteil)} Fremdkapital, Annuität {euro(cf.kredit.rate)} über {cf.kredit.jahre} Jahre – Schuldendienstdeckung mindestens <strong className="ov-num text-ink-900">{zahl(cf.kredit.dscr.min, 2)}</strong>.
          </li>
        )}
        <li>
          Größter Hebel: <strong className="text-ink-900">{r.sens.zeilen[0].label}</strong> ({r.sens.zeilen[0].text}) mit {euro(r.sens.zeilen[0].spanne)} Spanne im Kapitalwert.
        </li>
      </ul>
    </Abschnitt>
  );

  const annahmen = (
    <Abschnitt id="dossier-annahmen" icon={ListChecks} titel="Annahmen" unter="Jede Zahl mit Quelle und Stand – Richtwerte, die Sie durch Angebot und Lastgang ersetzen.">
      <dl className="divide-y divide-ink-100 text-[14px]">
        {r.annahmen.map(([l, w]) => (
          <div key={l} className="grid gap-1 py-2.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] sm:gap-4">
            <dt className="font-semibold text-ink-800">{l}</dt>
            <dd className="text-ink-600">{w}</dd>
          </div>
        ))}
      </dl>
    </Abschnitt>
  );

  const cashflow = (
    <Abschnitt id="cashflow" icon={BarChart3} titel="Cashflow über 25 Jahre" unter="Kauf mit Eigenkapital: Netto je Jahr und kumuliert (Jahr 0 = Investition). Netto, vor Ertragsteuern.">
      <CashflowBalken reihe={cf.reihe} investition={cf.investition} />
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-ink-500">
              <th className="py-2 pr-3 font-semibold">Jahr</th>
              <th className="py-2 pr-3 text-right font-semibold">Erzeugung</th>
              <th className="py-2 pr-3 text-right font-semibold">Ersparnis</th>
              <th className="py-2 pr-3 text-right font-semibold">Erlös</th>
              <th className="py-2 pr-3 text-right font-semibold">Betrieb</th>
              <th className="py-2 pr-3 text-right font-semibold">{cf.kredit ? "Schuldendienst" : "IFB-Effekt"}</th>
              <th className="py-2 pr-3 text-right font-semibold">Netto</th>
              <th className="py-2 text-right font-semibold">Kumuliert</th>
            </tr>
          </thead>
          <tbody className="ov-num divide-y divide-ink-100 text-ink-800">
            {[1, 2, 3, 5, 10, 15, 20, 25].map((j) => {
              const z = cf.reihe[j - 1];
              return (
                <tr key={j}>
                  <td className="py-2 pr-3 font-semibold">{j}</td>
                  <td className="py-2 pr-3 text-right">{zahl(z.erzeugung)} kWh</td>
                  <td className="py-2 pr-3 text-right">{euro(z.ersparnis)}</td>
                  <td className="py-2 pr-3 text-right">{euro(z.erloes)}</td>
                  <td className="py-2 pr-3 text-right">{euro(z.betrieb)}</td>
                  <td className="py-2 pr-3 text-right">{cf.kredit ? euro(z.schuldendienst) : euro(z.ifb)}</td>
                  <td className="py-2 pr-3 text-right">{euro(z.netto)}</td>
                  <td className={cn("py-2 text-right font-semibold", z.kumuliert >= 0 ? "text-ov-700" : "text-ink-900")}>{euro(z.kumuliert)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Abschnitt>
  );

  const risiken = (
    <Abschnitt id="risiken" icon={AlertTriangle} titel="Risiken und Sensitivität" unter="Tornado: Wie stark bewegt jede Einflussgröße den Kapitalwert? Größter Hebel oben.">
      <Tornado sens={r.sens} />
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {r.risiken.map((x) => (
          <li key={x.id} className="rounded-2xl bg-sand-50 p-4 text-[13.5px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60">
            {x.text}
          </li>
        ))}
      </ul>
      {cf.kredit && (
        <p className="mt-4 text-[13.5px] leading-relaxed text-ink-600">
          Schuldendienstdeckung (DSCR) der Kreditvariante: Minimum <strong className="ov-num text-ink-900">{zahl(cf.kredit.dscr.min, 2)}</strong>, Mittel {zahl(cf.kredit.dscr.mittel, 2)} über {cf.kredit.dscr.jahreMitSchuldendienst} Jahre
          {cf.kredit.dscr.unterEins > 0 ? ` – in ${cf.kredit.dscr.unterEins} Jahr(en) unter 1,0: Eigenkapital oder Laufzeit anpassen.` : " – in keinem Jahr unter 1,0."}
        </p>
      )}
    </Abschnitt>
  );

  const modell = (
    <Abschnitt id="modell" icon={Scale} titel="Modellvergleich: kaufen, finanzieren, leasen, Contracting, PPA oder Pacht" unter={`Neutral über ${r.modell.jahre} Jahre – Eingaben je Modell offengelegt, keine Anbieter, keine Konditionen.`}>
      <ModellTabelle modell={r.modell} />
    </Abschnitt>
  );

  const bank = (
    <Abschnitt id="bank" icon={Landmark} titel="Für den Finanzierungspartner" unter="Schuldendienstdeckung, Ertragsprognose mit Methode und Unterlagenliste.">
      {cf.kredit ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead>
              <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-ink-500">
                {["Jahr", "CFADS", "Zinsen", "Tilgung", "Schuldendienst", "DSCR", "Restschuld"].map((h, i) => (
                  <th key={h} className={cn("py-2 pr-3 font-semibold", i > 0 && "text-right")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="ov-num divide-y divide-ink-100 text-ink-800">
              {cf.reihe
                .filter((z) => z.schuldendienst > 0)
                .map((z) => (
                  <tr key={z.t}>
                    <td className="py-1.5 pr-3 font-semibold">{z.t}</td>
                    <td className="py-1.5 pr-3 text-right">{euro(z.cfads)}</td>
                    <td className="py-1.5 pr-3 text-right">{euro(z.zinsen)}</td>
                    <td className="py-1.5 pr-3 text-right">{euro(z.tilgung)}</td>
                    <td className="py-1.5 pr-3 text-right">{euro(z.schuldendienst)}</td>
                    <td className={cn("py-1.5 pr-3 text-right font-semibold", z.cfads / z.schuldendienst < 1 ? "text-red-700" : "text-ov-700")}>{zahl(z.cfads / z.schuldendienst, 2)}</td>
                    <td className="py-1.5 text-right">{euro(z.restschuld)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[14px] text-ink-600">Ohne Kreditvariante gerechnet – Fremdkapitalanteil in den Eingaben setzen, um den DSCR auszuweisen.</p>
      )}
      <h4 className="mt-6 font-display text-[16px] font-bold text-ink-900">Ertragsprognose – Methode</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink-700">
        <li>Spezifischer Ertrag {zahl(cf.eingaben.ertragProKwp)} kWh/kWp (Marktstatistik 2024: 1.000 Volllaststunden; IEA PVPS NSR Austria 2024: 1.050 kWh/kWp); standortgenau per PVGIS im Standort-Check.</li>
        <li>Degradation {prozent(cf.eingaben.degradation, 2)} je Jahr, Betriebskosten {euro(cf.eingaben.betriebskosten)} (+{prozent(cf.eingaben.betriebskostenSteigerung)} p. a.), Strompreis {zahl(cf.eingaben.strompreisCt, 1)} ct/kWh netto (+{prozent(cf.eingaben.strompreisSteigerung)} p. a.).</li>
        <li>Eigenverbrauchsquote {prozent(cf.eingaben.eigenverbrauchsquote)} als Annahme – vor der Kreditentscheidung mit Viertelstunden-Lastgang belegen.</li>
      </ul>
      <h4 className="mt-6 font-display text-[16px] font-bold text-ink-900">Unterlagenliste</h4>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {r.unterlagen.map((u) => (
          <li key={u} className="rounded-2xl bg-sand-50 p-3 text-[13.5px] leading-snug text-ink-700 ring-1 ring-ink-200/60">
            {u}
          </li>
        ))}
      </ul>
    </Abschnitt>
  );

  const gemeinderat = r.vergabe && (
    <Abschnitt id="vergabe" icon={Landmark} titel="Vergabehinweise für den Gemeinderat" unter={`BVergG 2018 idF Vergaberechtsgesetz 2026 · Schwellenwerte Stand ${r.vergabe.stand.label} · geschätzter Auftragswert ${euro(cf.anlagenpreis)} netto`}>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Als Bauauftrag", r.vergabe.bau],
          ["Als Liefer-/Dienstleistungsauftrag", r.vergabe.lieferDl],
        ].map(([t, w]) => (
          <div key={t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
            <p className="font-semibold text-ink-900">{t}</p>
            <p className="mt-1 text-[14px] text-ink-700">{w.kurz}</p>
            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-ink-600">
              {w.wege
                .filter((x) => x.zulaessig)
                .map((x) => (
                  <li key={x.id}>
                    <strong className="text-ink-800">{x.name}</strong> ({x.norm}) – {x.text}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-ink-700">
        {[...new Set([...r.vergabe.bau.pflichten, ...r.vergabe.lieferDl.pflichten])].map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-ink-500">
        Ob die PV-Errichtung als Bau- oder Lieferauftrag einzuordnen ist, entscheidet der Auftraggeber sachkundig (§ 13). Orientierung, keine Rechtsberatung – Details im{" "}
        <Link href="/kommunen/vergabe-foerderung" className="font-semibold text-ov-700 underline underline-offset-2">
          Vergabe-Wegweiser
        </Link>
        .
      </p>
    </Abschnitt>
  );

  const co2 = (
    <Abschnitt id="co2" icon={Leaf} titel={`CO₂-Textbaustein für den Nachhaltigkeitsbericht (Berichtsjahr ${r.eingaben.berichtsjahr})`} unter="GHG Protocol Scope 2, standort- und marktbasiert; Planwerte, nach Inbetriebnahme mit Messdaten bestätigen.">
      <blockquote className="rounded-2xl bg-sand-50 p-4 text-[14px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60">{r.co2Text}</blockquote>
      <p className="mt-2 text-[12.5px] text-ink-500">Strombezug {zahl(r.eingaben.strombezugKwh)} kWh/a (Eingabe), Faktor {zahl(r.co2.faktoren.lokG, 1)} g CO₂e/kWh standortbasiert (Strommix AT 2024, BMIMI Marktentwicklung 2024).</p>
    </Abschnitt>
  );

  const schritte = (
    <Abschnitt id="schritte" icon={TrendingUp} titel="Nächste Schritte" unter="Vom Dossier zum Beschluss.">
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {r.schritte.map((x, i) => (
          <li key={x.t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-display text-[13px] font-extrabold text-ov-600 ring-1 ring-ov-200">{i + 1}</span>
            <p className="mt-2.5 font-semibold text-ink-900">{x.t}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{x.x}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/angebot?objekt=gewerbe" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white hover:bg-ov-700">
          Angebot anfragen <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link href="/service/finanzierung" className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
          Finanzierung für Unternehmen
        </Link>
      </div>
    </Abschnitt>
  );

  const reihenfolge =
    v.id === "investitionsantrag"
      ? [entscheidung, annahmen, cashflow, risiken, co2, schritte]
      : v.id === "bank"
        ? [entscheidung, bank, cashflow, annahmen, schritte]
        : v.id === "gemeinderat"
          ? [entscheidung, gemeinderat, cashflow, annahmen, schritte]
          : [entscheidung, risiken, cashflow, modell, annahmen, schritte];

  return (
    <div className={cn("relative space-y-5", kompakt && "space-y-4")}>
      {beispiel && (
        <div className="sticky top-2 z-10 flex items-center gap-2 rounded-full bg-sun-400 px-4 py-2 text-[13.5px] font-semibold text-navy-950 shadow-md">
          <AlertTriangle aria-hidden="true" className="h-4 w-4" /> Beispiel – Vorschau mit Beispielwerten ({zahl(r.cashflow.eingaben.kwp)} kWp), nicht Ihre Auswertung
        </div>
      )}
      {reihenfolge.map((a, i) => (
        <div key={i}>{a}</div>
      ))}
      <p className="text-[12.5px] leading-relaxed text-ink-500">
        {HAFTUNG} Daten Stand {r.stand.label}. Quellen: {r.quellen.map((q) => q.titel).join(" · ")}.
      </p>
    </div>
  );
}

/** Kumulierter Cashflow als Balken (SVG, Jahr 0–25) */
function CashflowBalken({ reihe, investition }) {
  const daten = [{ jahr: 0, kumuliert: -investition }, ...reihe.map((r) => ({ jahr: r.t, kumuliert: r.kumuliert }))];
  const B = 720;
  const H = 180;
  const min = Math.min(...daten.map((d) => d.kumuliert), 0);
  const max = Math.max(...daten.map((d) => d.kumuliert), 0);
  const spanne = max - min || 1;
  const y = (v) => H - ((v - min) / spanne) * H;
  const breite = B / daten.length;
  return (
    <figure>
      <svg viewBox={`0 0 ${B} ${H + 22}`} className="h-auto w-full" role="img" aria-label={`Kumulierter Überschuss: Jahr 0 ${euro(-investition)}, Jahr 10 ${euro(daten[10]?.kumuliert ?? 0)}, Jahr 25 ${euro(daten[daten.length - 1].kumuliert)}`}>
        <line x1={0} x2={B} y1={r2(y(0))} y2={r2(y(0))} stroke="#6b7280" strokeWidth={1} />
        {daten.map((d, i) => {
          const oben = Math.min(y(0), y(d.kumuliert));
          const hoehe = Math.max(Math.abs(y(d.kumuliert) - y(0)), 1);
          return <rect key={d.jahr} x={r2(i * breite + 2)} y={r2(oben)} width={r2(breite - 4)} height={r2(hoehe)} rx={2} className={d.kumuliert >= 0 ? "fill-ov-500" : "fill-navy-600"} />;
        })}
        {daten
          .filter((d) => d.jahr % 5 === 0)
          .map((d) => (
            <text key={d.jahr} x={r2(d.jahr * breite + breite / 2)} y={H + 16} textAnchor="middle" className="fill-ink-500 text-[11px]">
              {d.jahr}
            </text>
          ))}
      </svg>
      <figcaption className="mt-1 text-[12.5px] text-ink-500">Kumulierter Überschuss in Euro nach Jahren (Jahr 0 = Investition).</figcaption>
    </figure>
  );
}

/** Rundet SVG-Koordinaten auf 2 Nachkommastellen, damit Server (Node) und Browser (z. B. WebKit) identische Attribute erzeugen (Hydration). */
const r2 = (x) => Math.round(x * 100) / 100;

/** Tornado-Diagramm: Abweichung des Kapitalwerts vom Basiswert je Einflussgröße (Mobil als HTML-Liste, ab sm als SVG) */
function Tornado({ sens }) {
  const B = 720;
  const zeile = 34;
  const H = zeile * sens.zeilen.length + 8;
  const links = 230;
  const maxAbw = Math.max(1, ...sens.zeilen.map((z) => Math.max(Math.abs(z.niedrig.delta), Math.abs(z.hoch.delta))));
  const mitte = links + (B - links) / 2;
  const skala = (B - links) / 2 / maxAbw;
  const labelBreite = 84;
  const anteil = (d) => `${r2(Math.min(100, (Math.abs(d) / maxAbw) * 100))}%`;
  return (
    <figure>
      {/* Mobil: Liste mit HTML-Balken, damit die Beschriftung lesbar bleibt */}
      <ul className="space-y-3 sm:hidden" aria-label="Sensitivität des Kapitalwerts">
        {sens.zeilen.map((z) => (
          <li key={z.id}>
            <p className="text-[13.5px] font-semibold text-ink-800">
              {z.label} <span className="font-normal text-ink-500">({z.text})</span>
            </p>
            <div aria-hidden="true" className="mt-1.5 space-y-px">
              {[z.niedrig, z.hoch].map((s, j) => (
                <div key={j} className="grid grid-cols-2">
                  <div className="flex h-3 justify-end">{s.delta < 0 && <span className={cn("h-3 rounded-l-sm", j === 0 ? "bg-navy-600" : "bg-ov-500")} style={{ width: anteil(s.delta) }} />}</div>
                  <div className="flex h-3 border-l border-ink-500">{s.delta >= 0 && <span className={cn("h-3 rounded-r-sm", j === 0 ? "bg-navy-600" : "bg-ov-500")} style={{ width: anteil(s.delta) }} />}</div>
                </div>
              ))}
            </div>
            <p className="ov-num mt-1 text-[12.5px] text-ink-600">
              niedrig {euro(z.niedrig.kapitalwert)} · hoch {euro(z.hoch.kapitalwert)}
            </p>
          </li>
        ))}
        <li className="text-[12.5px] text-ink-500">Basis {euro(sens.basis)}</li>
      </ul>
      <svg viewBox={`0 0 ${B} ${H + 20}`} className="hidden h-auto w-full sm:block" role="img" aria-label={`Sensitivität: ${sens.zeilen.map((z) => `${z.label} ${euro(z.niedrig.kapitalwert)} bis ${euro(z.hoch.kapitalwert)}`).join("; ")}`}>
        <line x1={r2(mitte)} x2={r2(mitte)} y1={0} y2={H} stroke="#6b7280" strokeWidth={1} />
        {sens.zeilen.map((z, i) => {
          const y = 6 + i * zeile;
          const balken = (d, klasse) => {
            const w = Math.abs(d) * skala;
            return <rect x={r2(d < 0 ? mitte - w : mitte)} y={y} width={r2(Math.max(w, 1))} height={18} rx={3} className={klasse} />;
          };
          // Wertbeschriftung außerhalb des längeren Balkens auf der Seite des niedrigen Werts; reicht der Platz nicht, im Balken (weiß)
          const d = z.niedrig.delta;
          const seiteW = Math.max(0, ...[z.niedrig.delta, z.hoch.delta].filter((x) => (d < 0 ? x < 0 : x >= 0)).map((x) => Math.abs(x) * skala));
          const aussen = d < 0 ? mitte - seiteW - 4 - labelBreite >= links : mitte + seiteW + 4 + labelBreite <= B;
          const lx = d < 0 ? (aussen ? mitte - seiteW - 4 : mitte - Math.abs(d) * skala + 6) : aussen ? mitte + seiteW + 4 : mitte + Math.abs(d) * skala - 6;
          const anker = d < 0 ? (aussen ? "end" : "start") : aussen ? "start" : "end";
          return (
            <g key={z.id}>
              <text x={0} y={y + 13} className="fill-ink-800 text-[13px] font-semibold">
                {z.label} ({z.text})
              </text>
              {balken(z.niedrig.delta, "fill-navy-600")}
              {balken(z.hoch.delta, "fill-ov-500")}
              <text x={r2(lx)} y={y + 13} textAnchor={anker} className={cn("text-[11px] font-semibold", aussen ? "fill-ink-600" : "fill-white")}>
                {euro(z.niedrig.kapitalwert)}
              </text>
            </g>
          );
        })}
        <text x={r2(mitte)} y={H + 14} textAnchor="middle" className="fill-ink-500 text-[11px]">
          Basis {euro(sens.basis)}
        </text>
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-4 text-[12.5px] text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-navy-600" /> niedriger Wert der Einflussgröße
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-ov-500" /> hoher Wert
        </span>
      </figcaption>
    </figure>
  );
}

/** Tabelle der sechs Modelle mit offengelegten Eingaben (Mobil als Karten je Modell) */
export function ModellTabelle({ modell, zeigeEingaben = true }) {
  const plakette = <span className="mt-1 inline-block w-fit whitespace-nowrap rounded-full bg-ov-600 px-2 py-0.5 text-[11px] font-semibold text-white">höchster Kapitalwert</span>;
  return (
    <div>
      <ul className="space-y-3 sm:hidden">
        {modell.modelle.map((m) => {
          const best = modell.besteIds.includes(m.id);
          return (
            <li key={m.id} className={cn("rounded-2xl p-4 ring-1 ring-ink-200/70", best ? "bg-ov-50/60" : "bg-white")}>
              <p className="flex flex-col font-semibold text-ink-900">
                <span>
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.farbe }} aria-hidden="true" />
                  {m.name}
                </span>
                {best && plakette}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[13.5px]">
                <div>
                  <dt className="text-[12px] text-ink-500">Kapitalwert</dt>
                  <dd className="ov-num font-semibold text-ink-900">{euro(m.kapitalwert)}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-500">Liquidität Jahr 1</dt>
                  <dd className={cn("ov-num font-semibold", m.liquiditaetJahr1 < 0 ? "text-ink-900" : "text-ov-700")}>{euro(m.liquiditaetJahr1)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[12px] text-ink-500">Eigentum am Ende</dt>
                  <dd className="text-[13px] text-ink-700">
                    <strong className={m.eigentumEnde ? "text-ov-700" : "text-ink-900"}>{m.eigentumEnde ? "Ja" : "Nein"}</strong> – {m.eigentum}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[12px] text-ink-500">IFB / AfA</dt>
                  <dd className="text-[13px] text-ink-700">{m.ifbAfa}</dd>
                </div>
                {zeigeEingaben && (
                  <div className="col-span-2">
                    <dt className="text-[12px] text-ink-500">Eingaben (offen)</dt>
                    <dd className="text-[12.5px] text-ink-600">{m.eingaben.map(([l, w]) => `${l}: ${w}`).join(" · ")}</dd>
                  </div>
                )}
              </dl>
            </li>
          );
        })}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] text-[13.5px]">
          <thead>
            <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-ink-500">
              <th className="py-2 pr-3 font-semibold">Modell</th>
              <th className="py-2 pr-3 text-right font-semibold">Kapitalwert</th>
              <th className="py-2 pr-3 text-right font-semibold">Liquidität Jahr 1</th>
              <th className="py-2 pr-3 font-semibold">Eigentum am Ende</th>
              <th className="py-2 pr-3 font-semibold">IFB / AfA</th>
              {zeigeEingaben && <th className="py-2 font-semibold">Eingaben (offen)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 align-top text-ink-800">
            {modell.modelle.map((m) => {
              const best = modell.besteIds.includes(m.id);
              return (
                <tr key={m.id} className={cn(best && "bg-ov-50/60")}>
                  <td className="py-2.5 pr-3 font-semibold text-ink-900">
                    <span className="flex flex-col">
                      <span>
                        <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.farbe }} aria-hidden="true" />
                        {m.name}
                      </span>
                      {best && plakette}
                    </span>
                  </td>
                  <td className="ov-num py-2.5 pr-3 text-right font-semibold">{euro(m.kapitalwert)}</td>
                  <td className={cn("ov-num py-2.5 pr-3 text-right", m.liquiditaetJahr1 < 0 ? "text-ink-900" : "text-ov-700")}>{euro(m.liquiditaetJahr1)}</td>
                  <td className="py-2.5 pr-3 text-[13px] text-ink-700">
                    <strong className={m.eigentumEnde ? "text-ov-700" : "text-ink-900"}>{m.eigentumEnde ? "Ja" : "Nein"}</strong> – {m.eigentum}
                  </td>
                  <td className="py-2.5 pr-3 text-[13px] text-ink-700">{m.ifbAfa}</td>
                  {zeigeEingaben && <td className="py-2.5 text-[12.5px] text-ink-600">{m.eingaben.map(([l, w]) => `${l}: ${w}`).join(" · ")}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 space-y-1 text-[12.5px] leading-relaxed text-ink-500">
        {modell.hinweise.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
