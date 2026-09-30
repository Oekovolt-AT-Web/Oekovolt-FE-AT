"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Building2, Factory, Home, Landmark, Plus, Scale3d, Share2, Sun, Tractor, Trash2, Users, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { fmt } from "@/lib/rechner/annahmen";
import { NETZBEREICHE } from "@/lib/rechner/peakshaving";
import {
  EG_ANNAHMEN,
  EG_PRESETS,
  MARKTPREIS_AKTUELL,
  MARKTPREIS_CT,
  MODELLE,
  NETZEBENEN_EG,
  TYPEN,
  egAusParams,
  egBilanz,
  egParams,
  egWirtschaft,
  lastprofil,
  verbrauchVon,
} from "@/lib/rechner/energiegemeinschaft";
import { Anteilsbalken, DiagrammKarte, GewerbeStil, Hinweis, Karte, Liste, LogRegler, Vorlagen, Zahlfeld, euro, menge, useStartAusUrl } from "./GewerbeBausteine";
import { EGFluss, EGMonate, EGPreisleiter } from "./EGDiagramme";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";
import RechnerTeilen from "@/components/RechnerTeilen/RechnerTeilen";

const PFAD = "/rechner/energiegemeinschaft";
const ICON = { gemeinde: Landmark, betrieb: Factory, landwirtschaft: Tractor, haushalte: Home };
const NEU = {
  gemeinde: { typ: "gemeinde", name: "Gemeindegebäude", verbrauch: 60000, kwp: 50, ne: "7" },
  betrieb: { typ: "betrieb", name: "Betrieb", verbrauch: 100000, kwp: 0, ne: "7", schichten: 1, gross: false },
  landwirtschaft: { typ: "landwirtschaft", name: "Hof", verbrauch: 40000, kwp: 80, ne: "7" },
  haushalte: { typ: "haushalte", name: "Haushalte", anzahl: 20, verbrauch: EG_ANNAHMEN.haushaltKwh, kwp: 0, ne: "7n" },
};
const MAX_TEILNEHMER = 8;
let zaehler = 0;
const mitId = (t) => ({ ...t, id: `t${++zaehler}` });
const START = EG_PRESETS[0];

export default function EGRechner() {
  const [vorlage, setVorlage] = useState(START.id);
  const [modell, setModell] = useState(START.modell);
  const [bereich, setBereich] = useState(START.bereich);
  const [teilnehmer, setTeilnehmer] = useState(() => START.teilnehmer.map(mitId));
  const [energiepreis, setEnergiepreis] = useState(EG_ANNAHMEN.energiepreisCt);
  const [egPreisWahl, setEgPreisWahl] = useState(null); // null = Win-win-Mitte
  const [offen, setOffen] = useState(0);

  const marktpreis = MARKTPREIS_CT;
  const mitte = Math.round(((energiepreis + marktpreis) / 2) * 100) / 100;
  const egPreis = egPreisWahl == null ? mitte : Math.min(Math.max(egPreisWahl, marktpreis), energiepreis);

  const ladeVorlage = (v) => {
    setVorlage(v.id);
    setModell(v.modell);
    setBereich(v.bereich);
    setTeilnehmer(v.teilnehmer.map(mitId));
    setEgPreisWahl(null);
    setOffen(0);
  };
  useStartAusUrl(egAusParams, (e) => {
    setVorlage(null);
    setModell(e.modell);
    setBereich(NETZBEREICHE.some((b) => b.id === e.bereich) ? e.bereich : "ooe");
    setTeilnehmer(e.teilnehmer.map(mitId));
    setEnergiepreis(e.energiepreisCt);
    setEgPreisWahl(e.egPreisCt);
  });

  const aendern = (id, feld, wert) => {
    setVorlage(null);
    setTeilnehmer((l) => l.map((t) => (t.id === id ? { ...t, [feld]: wert } : t)));
  };
  const hinzufuegen = (typ) => {
    if (teilnehmer.length >= MAX_TEILNEHMER) return;
    setVorlage(null);
    setTeilnehmer((l) => [...l, mitId(NEU[typ])]);
    setOffen(teilnehmer.length);
  };
  const entfernen = (id) => {
    setVorlage(null);
    setTeilnehmer((l) => l.filter((t) => t.id !== id));
  };

  // Lastprofile nur bei Änderung von Verbrauch/Typ/Schichten neu rechnen
  const t = useDeferredValue(teilnehmer);
  const lastKey = t.map((x) => `${x.typ}.${verbrauchVon(x)}.${x.schichten || 1}`).join("|");
  const lasten = useMemo(
    () => t.map(lastprofil),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastKey]
  );
  const bilanzKey = `${lastKey}#${t.map((x) => `${x.kwp}.${x.ne}.${x.gross ? 1 : 0}`).join("|")}#${modell}`;
  const bilanz = useMemo(
    () => egBilanz(t, modell, lasten.length === t.length ? lasten : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bilanzKey, lasten]
  );
  const w = useMemo(() => egWirtschaft(bilanz, { teilnehmer: t, modell, bereich, energiepreisCt: energiepreis, marktpreisCt: marktpreis, egPreisCt: egPreis }), [bilanz, t, modell, bereich, energiepreis, marktpreis, egPreis]);

  const ausgeschlossen = w.zeilen.map((z, i) => ({ ...z, name: t[i]?.name })).filter((z) => !z.ok);
  const grosse = teilnehmer.some((x) => x.gross);
  const query = egParams({ teilnehmer, modell, bereich, energiepreisCt: energiepreis, egPreisCt: egPreis });
  const summeErz = Math.max(0, energiepreis - marktpreis);
  useRechnerErgebnis("energiegemeinschaft", w);

  // Druckbericht – wird erst beim Klick auf „Als PDF“ berechnet
  const modellLabel = MODELLE.find((x) => x.id === modell)?.label || modell;
  const bereichInfo = NETZBEREICHE.find((b) => b.id === bereich);
  const neLabel = (id) => {
    const n = NETZEBENEN_EG.find((x) => x.id === id);
    return n ? `${n.label} (${n.sub})` : id;
  };
  const bericht = () => ({
    untertitel: `${modellLabel} · ${teilnehmer.length} Teilnehmende · Netzbereich ${bereichInfo?.label || bereich}`,
    kennzahlen: [
      ["Gemeinschaftsstrom", menge(bilanz.geteilt), `${fmt(bilanz.quoteUeberschuss * 100)} % des PV-Überschusses`],
      ["Vorteil gesamt/Jahr", euro(w.gesamt), "Erzeuger + Verbraucher, netto"],
      ["Netzentgelt gespart", euro(w.netz), modell === "beg" ? "BEG: keine Reduktion 2026" : `Arbeitspreis −${modell === "lokal" ? "57" : "28/64"} %`],
      ["Mehrerlös Erzeuger", euro(w.erzeuger), `vs. OeMAG-Marktpreis ${fmt(marktpreis, 2)} ct`],
    ],
    eingaben: [
      {
        titel: "Gemeinschaft",
        zeilen: [
          ["Form & Nahebereich", modellLabel],
          ["Netzbereich", bereichInfo ? `${bereichInfo.label} · ${bereichInfo.betreiber}` : bereich],
        ],
      },
      {
        titel: "Teilnehmende",
        zeilen: teilnehmer.map((x) => [
          `${x.name} (${TYPEN[x.typ]?.label || x.typ})`,
          `${menge(verbrauchVon(x))}${x.kwp > 0 ? ` · PV ${fmt(x.kwp)} kWp` : ""}`,
          [x.typ === "haushalte" ? `${fmt(x.anzahl || 0)} Haushalte` : "", neLabel(x.ne), x.typ === "betrieb" ? `${x.schichten || 1} Schicht(en)${x.gross ? ", großes Unternehmen" : ""}` : ""].filter(Boolean).join(" · "),
        ]),
      },
      {
        titel: "Preise (netto)",
        zeilen: [
          ["Energiepreis beim Lieferanten", `${fmt(energiepreis, 1)} ct/kWh`],
          ["Preis in der Gemeinschaft", `${fmt(egPreis, 2)} ct/kWh`, egPreisWahl == null ? "Win-win-Mitte" : "eigene Eingabe"],
          ["Marktpreis-Referenz (OeMAG)", `${fmt(marktpreis, 2)} ct/kWh`, "Mittel der letzten 12 Monate"],
        ],
      },
    ],
    ergebnisse: [
      {
        titel: "Energie pro Jahr",
        zeilen: [
          ["Gemeinschaftsstrom (geteilt)", menge(bilanz.geteilt)],
          ["PV-Überschuss gesamt", menge(bilanz.ueberschuss)],
          ["Restbedarf aus dem Netz", menge(bilanz.restbedarf)],
        ],
      },
      {
        titel: "Vorteil je Teilnehmer pro Jahr",
        zeilen: w.zeilen.map((z, i) => t[i] && [t[i].name, z.ok ? euro(z.vorteil) : "–", z.ok ? "" : "nicht teilnahmeberechtigt"]),
      },
      {
        titel: "Zusammensetzung",
        zeilen: [
          ["Günstigere Energie (Verbraucher)", euro(w.energie)],
          ["Netzentgelt-Reduktion", euro(w.netz)],
          ["Elektrizitätsabgabe entfällt", modell === "beg" ? "– (nur EEG)" : euro(w.abgabe)],
          ["Mehrerlös Erzeuger vs. OeMAG", euro(w.erzeuger)],
          ["Vorteil gesamt", euro(w.gesamt)],
        ],
      },
    ],
    hinweise: [
      ...ausgeschlossen.map((z) => `${z.name}: ${z.grund}`),
      "Große Unternehmen dürfen nicht an EEG teilnehmen, nur an Bürgerenergiegemeinschaften und Peer-to-Peer-Modellen (höchstens 6 MW).",
      "Die Reduktion von 57 % (lokal) bzw. 28 %/64 % (regional) gilt bis 31.12.2026. Danach gelten Abschläge je genutzter Netzinfrastruktur; die Sätze legt die noch ausstehende Tarifverordnung fest.",
    ],
    annahmen: [
      "Typische Lastprofile in Stundenwerten über 8.760 Stunden, dynamische Aufteilung nach aktuellem Bedarf – keine gemessenen Viertelstundenwerte.",
      "Netz-Arbeitspreise laut SNE-V 2026 für den gewählten Netzbereich; Reduktion nach Modell und Netzebene.",
      `Marktpreis-Referenz: Mittel der letzten 12 veröffentlichten OeMAG-Monatspreise (${fmt(marktpreis, 2)} ct/kWh, zuletzt ${MARKTPREIS_AKTUELL.zeitraum}).`,
      modell !== "beg" && "In der EEG entfällt zusätzlich der Erneuerbaren-Förderbeitrag auf den Gemeinschaftsstrom – hier nicht beziffert.",
      "Kosten für Organisation und Abrechnung der Gemeinschaft sind nicht abgezogen.",
    ],
  });

  return (
    <Karte>
      <GewerbeStil />
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Geteilt/Jahr", <Zahl key="g" wert={bilanz.geteilt / 1000} stellen={bilanz.geteilt >= 100000 ? 0 : 1} suffix=" MWh" />],
              ["Vorteil/Jahr", <Zahl key="v" wert={Math.round(w.gesamt)} suffix=" €" />],
              ["Netzentgelt", <Zahl key="n" wert={Math.round(w.netz)} suffix=" €" />],
            ]}
          />
          <div className="space-y-8">
            <Vorlagen vorlagen={EG_PRESETS} aktiv={vorlage} onWahl={ladeVorlage} />

            <Gruppe titel="Gemeinschaft">
              <Auswahl
                legende="Form & Nahebereich"
                wert={modell}
                onChange={(v) => {
                  setModell(v);
                  setVorlage(null);
                }}
                optionen={MODELLE}
              />
              <Liste
                label="Netzbereich"
                wert={bereich}
                onChange={(v) => {
                  setBereich(v);
                  setVorlage(null);
                }}
                optionen={NETZBEREICHE.map((b) => ({ id: b.id, label: `${b.label} · ${b.betreiber}` }))}
                hinweis="Bestimmt den Arbeitspreis der Netznutzung (SNE-V 2026), auf den die Reduktion wirkt."
              />
            </Gruppe>

            <Gruppe titel={`Teilnehmende (${teilnehmer.length})`}>
              <ul className="space-y-2.5">
                {teilnehmer.map((x, i) => (
                  <TeilnehmerKarte
                    key={x.id}
                    t={x}
                    offen={offen === i}
                    onOffen={() => setOffen(offen === i ? -1 : i)}
                    onAendern={(f, v) => aendern(x.id, f, v)}
                    onEntfernen={teilnehmer.length > 1 ? () => entfernen(x.id) : null}
                    zeile={w.zeilen[i]}
                    modell={modell}
                  />
                ))}
              </ul>
              {teilnehmer.length < MAX_TEILNEHMER && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                  {Object.keys(NEU).map((typ) => {
                    const Icon = ICON[typ];
                    return (
                      <button
                        key={typ}
                        type="button"
                        onClick={() => hinzufuegen(typ)}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-dashed ring-ink-300 transition hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-300"
                      >
                        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                        <Icon aria-hidden="true" className="h-4 w-4" />
                        {TYPEN[typ].label}
                      </button>
                    );
                  })}
                </div>
              )}
            </Gruppe>

            <Gruppe titel="Preise (netto)">
              <Regler
                label="Energiepreis beim Lieferanten"
                wert={energiepreis}
                min={8}
                max={30}
                step={0.5}
                stellen={1}
                einheit="ct/kWh"
                onChange={setEnergiepreis}
                hinweis="Nur der Energieanteil, ohne Netz und Abgaben – steht auf Ihrer Lieferantenrechnung."
              />
              <Regler
                label="Preis in der Gemeinschaft"
                wert={egPreis}
                min={marktpreis}
                max={energiepreis}
                step={0.05}
                stellen={2}
                einheit="ct"
                minLabel={`Marktpreis ${fmt(marktpreis, 2)}`}
                maxLabel={`Lieferant ${fmt(energiepreis, 1)}`}
                onChange={setEgPreisWahl}
              />
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-sun-300/70">
                <p className="text-[13.5px] leading-snug text-ink-700">
                  Win-win-Preis (Mitte): <strong className="ov-num text-ink-900">{fmt(mitte, 2)} ct/kWh</strong>
                </p>
                {Math.abs(egPreis - mitte) > 0.001 && (
                  <button type="button" onClick={() => setEgPreisWahl(null)} className="h-9 shrink-0 rounded-full bg-ink-900 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-ov-600">
                    Übernehmen
                  </button>
                )}
              </div>
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`Geteilte Energie ${fmt(bilanz.geteilt)} Kilowattstunden pro Jahr, Vorteil gesamt ${Math.round(w.gesamt)} Euro, davon Netzentgelt ${Math.round(w.netz)} Euro.`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihr Ergebnis</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ov-500 motion-reduce:animate-none" aria-hidden="true" />
              8.760 Stunden · {teilnehmer.length} Teilnehmende
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl ton="navy" icon={Share2} label="Gemeinschaftsstrom" zusatz={`${fmt(bilanz.quoteUeberschuss * 100)} % des PV-Überschusses`}>
              <Zahl wert={bilanz.geteilt / 1000} stellen={bilanz.geteilt >= 100000 ? 0 : 1} suffix=" MWh" />
            </Kennzahl>
            <Kennzahl ton="gruen" icon={Users} label="Vorteil gesamt/Jahr" zusatz="Erzeuger + Verbraucher, netto">
              <Zahl wert={Math.round(w.gesamt)} suffix=" €" />
            </Kennzahl>
            <Kennzahl icon={Zap} label="Netzentgelt gespart" zusatz={modell === "beg" ? "BEG: keine Reduktion 2026" : `Arbeitspreis −${modell === "lokal" ? "57" : "28/64"} %`}>
              <Zahl wert={Math.round(w.netz)} suffix=" €" />
            </Kennzahl>
            <Kennzahl icon={Sun} label="Mehrerlös Erzeuger" zusatz={`vs. OeMAG-Marktpreis ${fmt(marktpreis, 2)} ct`}>
              <Zahl wert={Math.round(w.erzeuger)} suffix=" €" />
            </Kennzahl>
          </div>

          {ausgeschlossen.length > 0 && (
            <Hinweis ton="warn" titel="Nicht alle können in diesem Modell teilnehmen" className="mt-4">
              {ausgeschlossen.map((z) => (
                <span key={z.name} className="block">
                  <strong>{z.name}:</strong> {z.grund}
                </span>
              ))}
            </Hinweis>
          )}

          <DiagrammKarte className="mt-6" titel="Energiefluss in der Gemeinschaft" unter="Jahreswerte, Aufteilung dynamisch nach aktuellem Bedarf">
            <EGFluss teilnehmer={t} zeilen={w.zeilen} geteilt={bilanz.geteilt} ueberschuss={bilanz.ueberschuss} restbedarf={bilanz.restbedarf} />
          </DiagrammKarte>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <DiagrammKarte titel="Win-win-Preis" unter="Beide Seiten gewinnen gegenüber Markt und Lieferant">
              <div className="px-5 pb-5 md:px-6">
                <EGPreisleiter marktpreis={marktpreis} egPreis={egPreis} energiepreis={energiepreis} />
                <Anteilsbalken
                  label={`Energie-Vorteil: Erzeuger ${fmt(egPreis - marktpreis, 2)} ct, Verbraucher ${fmt(energiepreis - egPreis, 2)} ct je kWh`}
                  teile={[
                    { id: "e", wert: egPreis - marktpreis, klasse: "bg-sun-400" },
                    { id: "v", wert: energiepreis - egPreis, klasse: "bg-ov-500" },
                  ]}
                />
                <div className="mt-2.5 flex justify-between gap-3 text-[12.5px]">
                  <span className="text-ink-600">
                    Erzeuger <strong className="ov-num whitespace-nowrap text-ink-900">+{fmt(egPreis - marktpreis, 2)} ct</strong>
                  </span>
                  <span className="text-right text-ink-600">
                    Verbraucher <strong className="ov-num whitespace-nowrap text-ink-900">−{fmt(energiepreis - egPreis, 2)} ct</strong>
                    {modell !== "beg" && <span className="block text-ink-500">+ Netzentgelt & Elektrizitätsabgabe</span>}
                  </span>
                </div>
                {summeErz <= 0 && <p className="mt-3 text-[12.5px] text-ink-500">Energiepreis unter dem Marktpreis – dann bringt der Preis in der Gemeinschaft keinem Vorteil.</p>}
              </div>
            </DiagrammKarte>
            <DiagrammKarte titel="Wann geteilt wird" unter="Monatlich: Überschuss und zeitgleiche Nutzung">
              <EGMonate monat={bilanz.monat} />
            </DiagrammKarte>
          </div>

          <div className="mt-5 rounded-3xl bg-ink-50 p-5 md:p-6">
            <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
              <Scale3d aria-hidden="true" className="h-4 w-4 text-ov-600" /> Vorteil je Teilnehmer pro Jahr
            </h3>
            <ul className="mt-3 divide-y divide-ink-200/70">
              {w.zeilen.map((z, i) => {
                const x = t[i];
                if (!x) return null;
                const Icon = ICON[x.typ];
                return (
                  <li key={x.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 py-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1", z.ok ? "bg-white text-ov-600 ring-ink-200" : "bg-ink-100 text-ink-400 ring-ink-200")}>
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-ink-900">{x.name}</p>
                      <p className="ov-num text-[12.5px] leading-snug text-ink-500">
                        {z.geliefert > 0.5 && `liefert ${menge(z.geliefert)} · `}
                        {z.bezogen > 0.5 && `bezieht ${menge(z.bezogen)} · `}
                        {z.ok ? `Netz ${fmt(z.ap, 2)} ct × ${fmt(z.reduktion * 100)} %` : "nicht teilnahmeberechtigt"}
                      </p>
                    </div>
                    <p className={cn("ov-num text-right font-display text-[16px] font-extrabold", z.vorteil > 0 ? "text-ov-700" : "text-ink-400")}>{euro(z.vorteil)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-2 grid gap-x-6 gap-y-1 border-t border-ink-200 pt-3 text-[13px] sm:grid-cols-2">
              <Posten k="Günstigere Energie (Verbraucher)" v={euro(w.energie)} />
              <Posten k="Netzentgelt-Reduktion" v={euro(w.netz)} />
              <Posten k="Elektrizitätsabgabe entfällt" v={modell === "beg" ? "– (nur EEG)" : euro(w.abgabe)} />
              <Posten k="Mehrerlös Erzeuger vs. OeMAG" v={euro(w.erzeuger)} />
            </dl>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Hinweis ton="recht" titel="Ab 1. Jänner 2027 neue Netzentgelt-Abschläge">
              Die Reduktion von 57 % (lokal) bzw. 28 %/64 % (regional) gilt bis 31.12.2026. Danach gelten Abschläge je genutzter Netzinfrastruktur für alle Modelle im Nahebereich – die Sätze legt die Tarifverordnung fest, die noch aussteht.
            </Hinweis>
            <Hinweis ton={grosse ? "warn" : "info"} titel="Große Unternehmen nur in der BEG">
              Große Unternehmen dürfen nicht an EEG teilnehmen, nur an Bürgerenergiegemeinschaften und Peer-to-Peer-Modellen (höchstens 6 MW). Alternative: Dach an eine EEG verpachten.
            </Hinweis>
          </div>
          {modell !== "beg" && (
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
              In der EEG entfällt zusätzlich der Erneuerbaren-Förderbeitrag auf den Gemeinschaftsstrom. Er wird als prozentualer Aufschlag auf die Netzentgelte verrechnet und ist hier nicht beziffert. Kosten für Organisation und Abrechnung sind nicht abgezogen.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Typische Lastprofile in Stundenwerten – kein Angebot. Mit echten Viertelstundenwerten der Teilnehmenden planen wir die Gemeinschaft genau.
            </p>
            <Button href="/energiegemeinschaften" size="lg" pfeil className="shrink-0">
              Gemeinschaft planen
            </Button>
          </div>
          <RechnerTeilen
            className="mt-4"
            rechner="energiegemeinschaft"
            name="Energiegemeinschafts-Rechner"
            pfad={PFAD}
            query={query}
            titel="Energiegemeinschafts-Rechner: geteilter Solarstrom"
            text="So viel bringt eine Energiegemeinschaft bei diesen Teilnehmenden – gerechnet mit dem Ökovolt Energiegemeinschafts-Rechner."
            kampagne="rechner_energiegemeinschaft"
            bericht={bericht}
          />
        </div>
      </div>
    </Karte>
  );
}

function Posten({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-ink-600">{k}</dt>
      <dd className="ov-num font-semibold text-ink-900">{v}</dd>
    </div>
  );
}

function TeilnehmerKarte({ t, offen, onOffen, onAendern, onEntfernen, zeile, modell }) {
  const Icon = ICON[t.typ] || Building2;
  const ok = !zeile || zeile.ok;
  const kurz = t.typ === "haushalte" ? `${t.anzahl} × ${fmt(t.verbrauch)} kWh` : menge(t.verbrauch);
  return (
    <li className={cn("rounded-2xl bg-white ring-1 transition-colors", offen ? "ring-ov-300" : ok ? "ring-ink-200" : "ring-sun-400/60")}>
      <div className="flex items-center gap-2 pr-2">
        <button type="button" onClick={onOffen} aria-expanded={offen} className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3.5 py-2 text-left">
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors", offen ? "bg-ov-500 text-white" : "bg-ink-100 text-ink-600")}>
            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14.5px] font-semibold text-ink-800">{t.name}</span>
            <span className="ov-num block truncate text-[12.5px] text-ink-500">
              {kurz}
              {t.kwp > 0 ? ` · ${fmt(t.kwp)} kWp PV` : ""} · {NETZEBENEN_EG.find((n) => n.id === t.ne)?.label}
              {t.gross ? " · groß" : ""}
            </span>
          </span>
        </button>
        {onEntfernen && (
          <button type="button" onClick={onEntfernen} aria-label={`${t.name} entfernen`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-800">
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
      {offen && (
        <div className="space-y-4 border-t border-ink-100 px-3.5 pb-4 pt-3">
          <NameFeld wert={t.name} onChange={(v) => onAendern("name", v)} />
          {t.typ === "haushalte" ? (
            <div className="grid grid-cols-2 gap-3">
              <Zahlfeld klein label="Anzahl Haushalte" wert={t.anzahl} min={1} max={500} onChange={(v) => onAendern("anzahl", Math.round(v))} />
              <Zahlfeld klein label="je Haushalt" wert={t.verbrauch} min={500} max={20000} step={100} einheit="kWh" onChange={(v) => onAendern("verbrauch", Math.round(v))} />
            </div>
          ) : (
            <LogRegler label="Jahresverbrauch" wert={Math.max(t.verbrauch, 5000)} min={5000} max={5000000} format={menge} raster={(v) => (v < 5e4 ? 500 : v < 5e5 ? 5000 : 50000)} onChange={(v) => onAendern("verbrauch", v)} />
          )}
          <Regler label="PV-Anlage" wert={t.kwp} min={0} max={t.typ === "haushalte" ? 400 : 1000} step={5} format={(v) => (v === 0 ? "keine" : `${fmt(v)} kWp`)} minLabel="0" maxLabel={t.typ === "haushalte" ? "400 kWp" : "1.000 kWp"} onChange={(v) => onAendern("kwp", v)} />
          {t.typ !== "haushalte" && (
            <Auswahl
              legende="Netzebene"
              klein
              wert={t.ne}
              onChange={(v) => onAendern("ne", v)}
              optionen={NETZEBENEN_EG.map((n) => ({ ...n, sub: n.id === "5" && modell === "lokal" ? "nur regional" : n.sub }))}
            />
          )}
          {t.typ === "betrieb" && (
            <>
              <Auswahl
                legende="Betriebszeit"
                klein
                wert={t.schichten || 1}
                onChange={(v) => onAendern("schichten", v)}
                optionen={[
                  { id: 1, label: "1 Schicht" },
                  { id: 2, label: "2 Schichten" },
                  { id: 3, label: "24/7" },
                ]}
              />
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[13.5px] text-ink-700">
                <input type="checkbox" checked={Boolean(t.gross)} onChange={(e) => onAendern("gross", e.target.checked)} className="h-5 w-5 accent-ov-600" />
                Großes Unternehmen (ab 250 Beschäftigte und &gt; 50 Mio. € Umsatz bzw. &gt; 43 Mio. € Bilanzsumme)
              </label>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function NameFeld({ wert, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-ink-700">Bezeichnung</span>
      <input
        type="text"
        value={wert}
        maxLength={40}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl bg-white px-3 text-[14px] font-semibold text-ink-900 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500"
      />
    </label>
  );
}
