"use client";

// src/components/Rechner/PeerToPeerRechner.js
//
// Peer-to-Peer-Rechner: Erlös des Erzeugers bei einem P2P-Preis gegenüber dem OeMAG-Marktpreis,
// Ersparnis des Abnehmers, Netzentgelte nur als Eingabe (Abschlag erst nach Verordnung).
// Logik: ./peerToPeerRechnung.js (Test: node scripts/peer-to-peer.test.mjs).
//
// Export über das Lead-Gate (Kennung "peer-to-peer"): Das Ergebnis ist frei sichtbar; CSV-Export und
// Zusammenfassung gibt es erst nach Name + E-Mail (Telefon optional nach Häkchen) UND Bestätigung des
// Links aus der Mail (Double-Opt-in, Inhaber 11.10.2026). Das zentrale Gate aus Paket A09
// (LeadGate/useLeadGate) lag beim Bau noch nicht vor – hier eine schlanke eigene Lösung gegen dieselben
// Schnittstellen (/api/rechner_lead, /api/lead-gate/status); Übergabe in docs/projekt-doku/anhang/wellen/C07.md.

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BadgeEuro, Check, Copy, Download, Handshake, Lock, MailCheck, RefreshCw, Scale, Sun, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import useFokusFalle from "@/components/ui/useFokusFalle";
import { Auswahl, Gruppe, Kennzahl, Regler } from "./bausteine";
import { Hinweis, Zahlfeld } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { fmt } from "@/lib/rechner/annahmen";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";
import { GRENZEN, OEMAG_REFERENZEN, STAND, STANDARD, csvExport, rechnePeerToPeer } from "./peerToPeerRechnung";

const GATE_KENNUNG = "peer-to-peer";
const eur = (n) => `${n < 0 ? "−" : ""}${fmt(Math.abs(Math.round(n)))} €`;
const ct = (n, s = 2) => `${fmt(n, s)} ct`;

export default function PeerToPeerRechner() {
  const [ueberschuss, setUeberschuss] = useState(STANDARD.ueberschussKwh);
  const [gleichzeitigkeit, setGleichzeitigkeit] = useState(Math.round(STANDARD.gleichzeitigkeit * 100));
  const [p2pPreis, setP2pPreis] = useState(STANDARD.p2pPreisCt);
  const [referenz, setReferenz] = useState(STANDARD.referenz);
  const [energiepreis, setEnergiepreis] = useState(STANDARD.energiepreisCt);
  const [abschlag, setAbschlag] = useState(STANDARD.netzentgeltAbschlagCt);
  const [kwp, setKwp] = useState(STANDARD.anlageKwp);
  const [erzeugerTyp, setErzeugerTyp] = useState(STANDARD.erzeugerTyp);

  const r = useMemo(
    () =>
      rechnePeerToPeer({
        ueberschussKwh: ueberschuss,
        gleichzeitigkeit: gleichzeitigkeit / 100,
        p2pPreisCt: p2pPreis,
        referenz,
        energiepreisCt: energiepreis,
        netzentgeltAbschlagCt: abschlag,
        anlageKwp: kwp,
        erzeugerTyp,
      }),
    [ueberschuss, gleichzeitigkeit, p2pPreis, referenz, energiepreis, abschlag, kwp, erzeugerTyp]
  );
  useRechnerErgebnis(GATE_KENNUNG, r);

  // Balken: Erlöse des Erzeugers und Ersparnis des Abnehmers im Verhältnis
  const maxBalken = Math.max(r.erloesOhne, r.erloesMit, 1);

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,410px)_1fr]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="space-y-8">
            <Gruppe titel="Erzeuger">
              <Auswahl
                legende="Wer erzeugt?"
                wert={erzeugerTyp}
                onChange={setErzeugerTyp}
                klein
                optionen={[
                  { id: "sonst", label: "Betrieb, Hof, Gemeinde", sub: "Pflichten ab 100 kW" },
                  { id: "haushalt", label: "Haushalt", sub: "Pflichten ab 30 kW" },
                ]}
              />
              <Regler
                label="PV-Überschuss"
                wert={ueberschuss}
                min={GRENZEN.ueberschussKwh.min}
                max={GRENZEN.ueberschussKwh.max}
                step={1000}
                format={(v) => `${fmt(v)} kWh/Jahr`}
                minLabel="1.000"
                maxLabel="500.000 kWh"
                onChange={setUeberschuss}
                hinweis="Strom, der nicht selbst verbraucht wird – aus der Lastgang-Analyse oder der Einspeiseabrechnung."
              />
              <Zahlfeld label="Anlagenleistung" wert={kwp} onChange={setKwp} einheit="kWp" min={GRENZEN.anlageKwp.min} max={GRENZEN.anlageKwp.max} />
            </Gruppe>

            <Gruppe titel="Vertrag">
              <Regler
                label="P2P-Preis"
                wert={p2pPreis}
                min={GRENZEN.p2pPreisCt.min}
                max={GRENZEN.p2pPreisCt.max}
                step={0.5}
                format={(v) => `${fmt(v, v % 1 ? 1 : 0)} ct/kWh`}
                minLabel="0 ct"
                maxLabel="30 ct"
                onChange={setP2pPreis}
                hinweis={`Netto je geteilter kWh. Fairer Mittelwert hier: ${ct(r.fairerPreisCt)}.`}
              />
              <Regler
                label="Gleichzeitigkeit"
                wert={gleichzeitigkeit}
                min={Math.round(GRENZEN.gleichzeitigkeit.min * 100)}
                max={100}
                step={5}
                format={(v) => `${v} %`}
                onChange={setGleichzeitigkeit}
                hinweis="Anteil des Überschusses, den der Abnehmer in derselben Viertelstunde verbraucht – Richtwert, am besten mit dem Lastgang beider Seiten prüfen."
              />
              <Auswahl
                legende="Vergleich: OeMAG-Marktpreis"
                wert={referenz}
                onChange={setReferenz}
                klein
                optionen={OEMAG_REFERENZEN.map((o) => ({ id: o.id, label: o.label, sub: `${fmt(o.ct, 2)} ct` }))}
              />
            </Gruppe>

            <Gruppe titel="Abnehmer">
              <Regler
                label="Energiepreis des Lieferanten"
                wert={energiepreis}
                min={GRENZEN.energiepreisCt.min}
                max={GRENZEN.energiepreisCt.max}
                step={0.5}
                format={(v) => `${fmt(v, v % 1 ? 1 : 0)} ct/kWh`}
                minLabel="5 ct"
                maxLabel="40 ct"
                onChange={setEnergiepreis}
                hinweis="Nur der Energieanteil netto laut Stromrechnung – ohne Netz, Abgaben, Umsatzsteuer."
              />
              <Zahlfeld
                label="Netzentgelt-Abschlag (Eingabe, ct/kWh)"
                wert={abschlag}
                onChange={setAbschlag}
                einheit="ct/kWh"
                min={GRENZEN.netzentgeltAbschlagCt.min}
                max={GRENZEN.netzentgeltAbschlagCt.max}
                step={0.1}
              />
              <p className="-mt-2 text-[12.5px] leading-relaxed text-ink-500">
                Für P2P im Nahebereich sind reduzierte Netzentgelte vorgesehen – die Höhe legt erst eine Verordnung der E-Control fest. Bis dahin 0 lassen oder einen eigenen Annahmewert eintragen.
              </p>
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ergebnis je Jahr</h2>
            <p className="text-[12.5px] text-ink-500">Richtwert · OeMAG-Stand {STAND.label}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Kennzahl label="Mehrerlös Erzeuger" icon={Sun} ton={r.mehrerloes >= 0 ? "gruen" : "sand"} zusatz={`${fmt(r.geteilteKwh)} kWh geteilt`}>
              {eur(r.mehrerloes)}
            </Kennzahl>
            <Kennzahl label="Ersparnis Abnehmer" icon={BadgeEuro} ton={r.ersparnisAbnehmer >= 0 ? "navy" : "sand"} zusatz={r.ersparnisNetz > 0 ? `davon Netz ${eur(r.ersparnisNetz)}` : "Energieanteil"}>
              {eur(r.ersparnisAbnehmer)}
            </Kennzahl>
            <Kennzahl label="Fairer Preis (Mitte)" icon={Handshake} zusatz={`zwischen ${ct(r.oemagCt)} und ${ct(r.eingaben.energiepreisCt)}`}>
              {ct(r.fairerPreisCt)}
            </Kennzahl>
          </div>

          {/* Vergleich Erzeuger */}
          <div className="mt-8 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">Erlös des Erzeugers</p>
            <dl className="mt-4 space-y-4">
              {[
                { k: "Alles an die OeMAG", v: r.erloesOhne, teil: null, farbe: "bg-ink-400" },
                { k: `P2P ${ct(r.eingaben.p2pPreisCt)} + Rest OeMAG`, v: r.erloesMit, teil: r.erloesP2p, farbe: "bg-ov-600" },
              ].map((z) => (
                <div key={z.k}>
                  <div className="flex items-baseline justify-between gap-3 text-[14px]">
                    <dt className="text-ink-700">{z.k}</dt>
                    <dd className="ov-num font-semibold text-ink-900">{eur(z.v)}</dd>
                  </div>
                  <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white ring-1 ring-ink-200/70">
                    <div className={cn("h-full rounded-full transition-all duration-500", z.farbe)} style={{ width: `${Math.max(2, (z.v / maxBalken) * 100)}%` }} />
                  </div>
                  {z.teil !== null && (
                    <p className="mt-1 text-[12.5px] text-ink-500">
                      davon P2P {eur(z.teil)} für {fmt(r.geteilteKwh)} kWh, OeMAG {eur(r.erloesRest)} für {fmt(r.restKwh)} kWh
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 space-y-3">
            {r.preisUnterOemag && (
              <Hinweis ton="warn" titel="P2P-Preis unter dem OeMAG-Marktpreis">
                Der Erzeuger verdient weniger als mit der OeMAG-Abnahme ({ct(r.oemagCt)}). Sinnvoll nur, wenn andere Gründe zählen – etwa ein Vertrag mit Nachbarn oder innerhalb einer Firmengruppe.
              </Hinweis>
            )}
            {r.preisUeberEnergiepreis && (
              <Hinweis ton="warn" titel="P2P-Preis über dem Energiepreis des Abnehmers">
                Der Abnehmer zahlt mehr als bei seinem Lieferanten – ohne Netzentgelt-Abschlag bringt der Vertrag ihm nichts.
              </Hinweis>
            )}
            <Hinweis ton={r.lieferantenpflicht.trifft ? "recht" : "info"} titel="Lieferantenpflichten nach § 69 ElWG">
              {r.lieferantenpflicht.text}
            </Hinweis>
          </div>

          <ExportBereich ergebnis={r} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export über das Lead-Gate mit E-Mail-Bestätigung (Double-Opt-in, Inhaber 11.10.2026)
//
// Ablauf: Name + E-Mail (Telefon optional nach Häkchen) → POST /api/rechner_lead (A09) →
// Wartezustand „Bitte E-Mail bestätigen“ → Klick auf den Link setzt das Freischalt-Cookie
// (/freischalten, /api/lead-gate/bestaetigen, A09) → /api/lead-gate/status meldet „frei“ → Export.
// Keine Freischaltung im Browser-Speicher. Ohne Backend (Entwicklung) gibt es einen sichtbar
// gekennzeichneten Simulations-Knopf, damit die QA den Ablauf prüfen kann – nie in Produktion.
// ---------------------------------------------------------------------------

const STATUS_URL = `/api/lead-gate/status?kennung=${encodeURIComponent(GATE_KENNUNG)}`;
const ENTWICKLUNG = process.env.NODE_ENV !== "production";
const ERNEUT_NACH_S = 60;

/** Fragt das Freischalt-Cookie serverseitig ab; akzeptiert die gängigen Antwortfelder. */
async function statusAbfragen() {
  try {
    const res = await fetch(STATUS_URL, { cache: "no-store", credentials: "same-origin" });
    if (!res.ok) return { frei: false, erreichbar: false };
    const j = await res.json().catch(() => ({}));
    const frei =
      j?.freigegeben === true || j?.frei === true || j?.status === "bestaetigt" || (Array.isArray(j?.kennungen) && j.kennungen.includes(GATE_KENNUNG));
    return { frei, erreichbar: true };
  } catch {
    return { frei: false, erreichbar: false };
  }
}

/** Legt den Rechner-Lead an; das Backend verschickt die Bestätigungsmail. */
async function leadSenden({ name, email, telefon, kontaktOk, ergebnis }) {
  const [vorname, ...rest] = name.split(/\s+/);
  try {
    const res = await fetch("/api/rechner_lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kennung: GATE_KENNUNG,
        rechner: GATE_KENNUNG,
        aktion: "export",
        name,
        vorname,
        nachname: rest.join(" "),
        email,
        telefon: kontaktOk ? telefon : "",
        kontakt_ok: kontaktOk ? 1 : 0,
        eingaben: ergebnis.eingaben,
        kennzahlen: { mehrerloes: Math.round(ergebnis.mehrerloes), ersparnisAbnehmer: Math.round(ergebnis.ersparnisAbnehmer), fairerPreisCt: ergebnis.fairerPreisCt },
        rueckkehr: typeof window !== "undefined" ? `${window.location.pathname}#ergebnis-export` : "",
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

function ExportBereich({ ergebnis }) {
  // zu | dialog | wartet | frei
  const [stufe, setStufe] = useState("zu");
  const [kontakt, setKontakt] = useState(null); // { name, email, telefon, kontaktOk }
  const [versand, setVersand] = useState(null); // { ok, status, zeit }
  const [backend, setBackend] = useState(true);
  const [kopiert, setKopiert] = useState(false);

  // Beim Laden (z. B. Rückkehr vom Bestätigungslink) das Cookie prüfen
  useEffect(() => {
    let aktiv = true;
    statusAbfragen().then((s) => {
      if (!aktiv) return;
      setBackend(s.erreichbar);
      if (s.frei) setStufe("frei");
    });
    return () => {
      aktiv = false;
    };
  }, []);

  // Im Wartezustand regelmäßig und bei Rückkehr in den Tab nachsehen
  useEffect(() => {
    if (stufe !== "wartet") return undefined;
    const pruefen = async () => {
      const s = await statusAbfragen();
      setBackend(s.erreichbar);
      if (s.frei) setStufe("frei");
    };
    const t = setInterval(pruefen, 5000);
    const sicht = () => document.visibilityState === "visible" && pruefen();
    document.addEventListener("visibilitychange", sicht);
    window.addEventListener("focus", pruefen);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", sicht);
      window.removeEventListener("focus", pruefen);
    };
  }, [stufe]);

  const csvLaden = () => {
    const csv = csvExport(ergebnis);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peer-to-peer-rechner-stand-${STAND.geprueftAm || STAND.iso || "export"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const kopieren = async () => {
    const r = ergebnis;
    const text = [
      `Peer-to-Peer-Rechner Ökovolt (Richtwert, Stand ${STAND.label})`,
      `Überschuss ${fmt(r.eingaben.ueberschussKwh)} kWh/Jahr, Gleichzeitigkeit ${fmt(r.eingaben.gleichzeitigkeit * 100)} %, P2P-Preis ${fmt(r.eingaben.p2pPreisCt, 2)} ct/kWh`,
      `Erzeuger: ${eur(r.erloesOhne)} (alles OeMAG, ${fmt(r.oemagCt, 3)} ct) → ${eur(r.erloesMit)} mit P2P, Mehrerlös ${eur(r.mehrerloes)}`,
      `Abnehmer: Ersparnis ${eur(r.ersparnisAbnehmer)} (Energiepreis ${fmt(r.eingaben.energiepreisCt, 2)} ct, Netzentgelt-Abschlag ${fmt(r.eingaben.netzentgeltAbschlagCt, 2)} ct als Eingabe)`,
      `Fairer Preis (Mitte): ${fmt(r.fairerPreisCt, 2)} ct/kWh · ${r.lieferantenpflicht.text}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2200);
    } catch {
      window.prompt("Zusammenfassung kopieren:", text);
    }
  };

  const absenden = async (daten) => {
    const v = await leadSenden({ ...daten, ergebnis });
    setKontakt(daten);
    setVersand({ ...v, zeit: Date.now() });
    setStufe("wartet");
  };

  return (
    <div id="ergebnis-export" className="mt-8 scroll-mt-28 border-t border-ink-100 pt-6">
      {stufe === "frei" ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" className="min-h-11" icon={Download} onClick={csvLaden} type="button">
            Ergebnis als CSV
          </Button>
          <Button variant="secondary" size="sm" className="min-h-11" icon={kopiert ? Check : Copy} onClick={kopieren} type="button">
            {kopiert ? "Kopiert" : "Zusammenfassung kopieren"}
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11" href="/angebot?objekt=gewerbe" pfeil>
            Beratung anfragen
          </Button>
        </div>
      ) : stufe === "wartet" ? (
        <Wartezustand
          kontakt={kontakt}
          versand={versand}
          backend={backend}
          onErneut={() => kontakt && absenden(kontakt)}
          onAendern={() => setStufe("dialog")}
          onSimulieren={() => setStufe("frei")}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" className="min-h-11" icon={Lock} onClick={() => setStufe("dialog")} type="button">
            Ergebnis exportieren
          </Button>
          <p className="min-w-0 flex-1 basis-56 text-[13px] leading-relaxed text-ink-500">
            CSV und Zusammenfassung nach Name, E-Mail und Bestätigung per Link. Das Ergebnis oben bleibt frei.
          </p>
          <Button variant="ghost" size="sm" className="min-h-11" href="/angebot?objekt=gewerbe" pfeil>
            Beratung anfragen
          </Button>
        </div>
      )}
      {stufe === "dialog" && <GateDialog vorgabe={kontakt} onAbsenden={absenden} onSchliessen={() => setStufe(kontakt ? "wartet" : "zu")} />}
    </div>
  );
}

function Wartezustand({ kontakt, versand, backend, onErneut, onAendern, onSimulieren }) {
  const [jetzt, setJetzt] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setJetzt(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const rest = Math.max(0, ERNEUT_NACH_S - Math.floor((jetzt - (versand?.zeit || 0)) / 1000));
  const ohneBackend = !versand?.ok || !backend;

  return (
    <div role="status" aria-live="polite" className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
      <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
        <MailCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600" />
        Bitte E-Mail bestätigen
      </p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-700">
        Link gesendet an <strong className="break-all text-ink-900">{kontakt?.email}</strong>. Nach dem Klick auf den Link (24 Stunden gültig) ist der Export hier freigeschaltet – diese Seite
        prüft das automatisch. Keine Mail da? Bitte auch im Spam-Ordner nachsehen.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" className="min-h-11" icon={RefreshCw} onClick={onErneut} type="button" disabled={rest > 0}>
          {rest > 0 ? `Erneut senden (in ${rest} s)` : "Erneut senden"}
        </Button>
        <button type="button" onClick={onAendern} className="min-h-11 text-[13.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
          E-Mail-Adresse ändern
        </button>
      </div>
      {ohneBackend && ENTWICKLUNG && (
        <div className="mt-4 rounded-2xl bg-white p-4 text-[13px] leading-relaxed text-ink-600 ring-1 ring-ink-200">
          <p>
            <strong className="text-ink-800">Entwicklungsmodus:</strong> Lead-Gate-Backend (A09) nicht erreichbar
            {versand?.status ? ` (HTTP ${versand.status})` : ""}. Die Bestätigung lässt sich hier nur zum Testen simulieren.
          </p>
          <button type="button" onClick={onSimulieren} className="mt-2 min-h-11 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            Bestätigung simulieren
          </button>
        </div>
      )}
      {ohneBackend && !ENTWICKLUNG && (
        <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
          Falls keine Mail ankommt, schreiben Sie uns über das{" "}
          <a href="/kontakt" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-800">
            Kontaktformular
          </a>{" "}
          – wir senden Ihnen das Ergebnis.
        </p>
      )}
    </div>
  );
}

function GateDialog({ vorgabe, onAbsenden, onSchliessen }) {
  const [name, setName] = useState(vorgabe?.name || "");
  const [email, setEmail] = useState(vorgabe?.email || "");
  const [kontaktOk, setKontaktOk] = useState(Boolean(vorgabe?.kontaktOk));
  const [telefon, setTelefon] = useState(vorgabe?.telefon || "");
  const [fehler, setFehler] = useState("");
  const [sendet, setSendet] = useState(false);
  const idName = useId();
  const idMail = useId();
  const idTel = useId();
  const idKontakt = useId();
  const idTitel = useId();
  const erstesFeld = useRef(null);
  const dialogRef = useRef(null);
  const [bereit, setBereit] = useState(false);

  // Erst nach dem Mount an <body> hängen (Portal braucht document)
  useEffect(() => setBereit(true), []);

  // Fokusfalle (WCAG 2.1.2/2.4.3): Start im Feld Name, Tab bleibt im Dialog, Escape schließt,
  // danach geht der Fokus an den auslösenden Knopf („Ergebnis exportieren“) zurück.
  useFokusFalle(bereit, dialogRef, { beiEscape: onSchliessen, startRef: erstesFeld });

  // Seite dahinter nicht mitscrollen lassen, solange der Dialog offen ist
  useEffect(() => {
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorher;
    };
  }, []);

  const absenden = async (e) => {
    e.preventDefault();
    const n = name.trim().replace(/\s+/g, " ");
    const m = email.trim();
    const t = telefon.trim();
    if (n.length < 2) return setFehler("Bitte geben Sie Ihren Namen an.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) return setFehler("Bitte geben Sie eine gültige E-Mail-Adresse an.");
    if (kontaktOk && t && !/^\+?[\d\s/()-]{6,}$/.test(t)) return setFehler("Die Telefonnummer sieht unvollständig aus – oder lassen Sie das Feld leer.");
    setFehler("");
    setSendet(true);
    try {
      await onAbsenden({ name: n, email: m, telefon: kontaktOk ? t : "", kontaktOk });
    } finally {
      setSendet(false);
    }
  };

  const feld = "h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 ring-1 ring-ink-200 outline-none focus:ring-2 focus:ring-ov-500";

  if (!bereit) return null;

  // Portal an <body> und z-[9700] wie LeadGateDialog (A09): Kopfzeile (z-[100]) und mobile CTA-Leiste
  // (z-[9000]) liegen sonst über Dialog und Abdunklung und verdecken Schließen-X bzw. „Link anfordern“.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitel}
      tabIndex={-1}
      className="fixed inset-0 z-[9700] flex items-end justify-center bg-navy-950/60 p-3 outline-none sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onSchliessen()}
    >
      <form onSubmit={absenden} noValidate className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-ink-200 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Export freischalten</p>
            <h3 id={idTitel} className="mt-1 font-display text-[20px] font-bold text-ink-900">
              Wohin dürfen wir den Freischalt-Link schicken?
            </h3>
          </div>
          <button type="button" onClick={onSchliessen} aria-label="Schließen" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 hover:bg-ink-200">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor={idName} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
              Name <span className="text-ov-700">*</span>
            </label>
            <input ref={erstesFeld} id={idName} name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={feld} />
          </div>
          <div>
            <label htmlFor={idMail} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
              E-Mail <span className="text-ov-700">*</span>
            </label>
            <input id={idMail} name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={feld} />
          </div>
          <label htmlFor={idKontakt} className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink-700">
            <input
              id={idKontakt}
              type="checkbox"
              checked={kontaktOk}
              onChange={(e) => setKontaktOk(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-ink-300 text-ov-600 focus:ring-ov-500"
            />
            <span>Die Ökovolt Solartechnik GmbH darf mich zu diesem Ergebnis kontaktieren – per E-Mail und, wenn ich eine Nummer angebe, telefonisch. (freiwillig)</span>
          </label>
          {kontaktOk && (
            <div>
              <label htmlFor={idTel} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
                Telefon <span className="font-normal text-ink-500">(optional)</span>
              </label>
              <input id={idTel} name="telefon" type="tel" autoComplete="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className={feld} />
            </div>
          )}
          {fehler && (
            <p role="alert" className="rounded-xl bg-sun-300/25 px-3 py-2 text-[13.5px] text-ink-800 ring-1 ring-sun-400/50">
              {fehler}
            </p>
          )}
          <p className="text-[12.5px] leading-relaxed text-ink-500">
            Wir senden Ihnen einen Bestätigungslink an diese Adresse; erst danach wird der Export freigeschaltet. Ihre Angaben nutzen wir zur Bereitstellung des Ergebnisses und für Rückfragen
            dazu (Art. 6 Abs. 1 lit. b DSGVO). Kein Newsletter, keine Weitergabe. Details in der{" "}
            <a href="/datenschutz" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-800">
              Datenschutzerklärung
            </a>
            .
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" size="md" icon={Scale} disabled={sendet}>
            {sendet ? "Wird gesendet …" : "Link anfordern"}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onSchliessen}>
            Abbrechen
          </Button>
          <p className="w-full text-[12px] text-ink-500">Verschlüsselte Übertragung · * Pflichtfeld</p>
        </div>
      </form>
    </div>,
    document.body
  );
}
