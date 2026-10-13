"use client";

// src/components/KommunenVergabe/AmtsvortragGenerator.js
//
// Amtsvortrag-Generator (Welle B, Paket B09): Angaben links, neutraler Entwurf rechts – Sachverhalt,
// Rechtsgrundlage, Antrag, Beilagen. Der Entwurf auf dem Bildschirm ist frei; Download (HTML),
// Druck und Kopieren laufen über das Lead-Gate (Kennung „gemeinderat-vorlage“, Stufe 1 der Regel).
// Logik: ./amtsvortrag.js (ohne React, getestet in scripts/kommunen-werkzeuge.test.mjs).
//
// Übernahme aus dem Liegenschafts-Check über URL-Parameter:
//   ?av_liegenschaften=Volksschule|Bauhof&av_kwp=120&av_ertrag=125000&av_speicher=0#amtsvortrag
// Keine Eingabe verlässt den Browser, außer Kontaktdaten und Kennzahlen im Gate.

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Check, ClipboardCopy, Download, FileText, Lock, Printer, Quote, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { zahlText } from "@/data/kennzahlen";
import { ARTEN, AUFTRAGGEBER, betragLesen } from "@/lib/kommunen/vergabe";
import KommunenGate, { useGateFreigabe } from "./KommunenGate";
import { AMTSVORTRAG_STAND, BEDECKUNGEN, EEG_ROLLEN, ELWG_68_6, GATE_KENNUNG, ORGANE, PROGRAMME, amtsvortragErzeugen, amtsvortragHtml, amtsvortragText, foerderungenAktiv } from "./amtsvortrag";

const EINGABE = "h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500";
const LEGENDE = "text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500";

const START = {
  gemeinde: "",
  liegenschaften: "",
  kwp: "",
  speicherKwh: "",
  ertragKwh: "",
  auftragswert: "",
  auftraggeber: "klassisch",
  art: "bau",
  verfahrenId: "",
  organ: "gemeinderat",
  bedeckung: "voranschlag",
  bedeckungText: "",
  foerderungen: ["kig"],
  eegRolle: "keine",
};

const dateiName = (gemeinde) =>
  `amtsvortrag-pv-${
    String(gemeinde || "gemeinde")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "gemeinde"
  }.html`;

function Feld({ id, label, hilfe, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-semibold text-ink-800">
        {label}
      </label>
      {children}
      {hilfe && <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{hilfe}</p>}
    </div>
  );
}

function Wahl({ legende, name, optionen, wert, setWert, spalten = "sm:grid-cols-2" }) {
  return (
    <fieldset>
      <legend className={LEGENDE}>{legende}</legend>
      <div className={cn("mt-2 grid gap-2", spalten)}>
        {optionen.map((o) => {
          const an = o.id === wert;
          return (
            <label
              key={o.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-semibold transition focus-within:ring-2 focus-within:ring-ov-500",
                an ? "bg-ov-100 text-ink-900 shadow-sm" : "bg-sand-50 text-ink-700 hover:bg-sand-100",
              )}
            >
              <input type="radio" name={name} value={o.id} checked={an} onChange={() => setWert(o.id)} className="sr-only" />
              <span aria-hidden="true" className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2", an ? "bg-ov-600 ring-ov-600" : "bg-white ring-ink-300")}>
                {an && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="leading-snug">{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function AmtsvortragGenerator({ className }) {
  const id = useId();
  const [e, setE] = useState(START);
  const [heute, setHeute] = useState(AMTSVORTRAG_STAND.iso);
  const [frei, freischalten] = useGateFreigabe(GATE_KENNUNG);
  const [gate, setGate] = useState(null); // null | "download" | "druck" | "kopieren"
  const [meldung, setMeldung] = useState("");
  const [uebernommen, setUebernommen] = useState(false);

  const setze = (k) => (v) => setE((x) => ({ ...x, [k]: v && v.target ? v.target.value : v }));

  // Stichtag = heutiges Datum (nach dem Laden, hydrationssicher) und Übernahme aus dem Liegenschafts-Check
  useEffect(() => {
    const d = new Date();
    setHeute(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    try {
      const q = new URLSearchParams(window.location.search);
      const l = q.get("av_liegenschaften");
      const kwp = Number(q.get("av_kwp"));
      if (l || kwp > 0) {
        setE((x) => ({
          ...x,
          liegenschaften: l
            ? l
                .split("|")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 15)
                .join("\n")
            : x.liegenschaften,
          kwp: kwp > 0 ? String(Math.round(kwp)) : x.kwp,
          ertragKwh: Number(q.get("av_ertrag")) > 0 ? String(Math.round(Number(q.get("av_ertrag")))) : x.ertragKwh,
          speicherKwh: Number(q.get("av_speicher")) > 0 ? String(Math.round(Number(q.get("av_speicher")))) : x.speicherKwh,
        }));
        setUebernommen(true);
      }
    } catch {
      /* ohne Übernahme */
    }
  }, []);

  const aktivIds = useMemo(() => foerderungenAktiv(PROGRAMME, heute).map((p) => p.id), [heute]);
  const wert = betragLesen(e.auftragswert);

  const doc = useMemo(
    () => amtsvortragErzeugen({ ...e, auftragswert: wert ?? 0, foerderungen: e.foerderungen.filter((f) => aktivIds.includes(f)) }, { heute, programme: PROGRAMME }),
    [e, wert, heute, aktivIds],
  );

  const zulaessig = doc.vergabe?.zulaessig || [];
  const zusammenfassung = {
    Werkzeug: "Amtsvortrag-Generator",
    Liegenschaften: e.liegenschaften.split("\n").filter(Boolean).length || "–",
    kWp: e.kwp || "–",
    Auftragswert: wert ? `${zahlText(wert)} €` : "–",
    Verfahren: doc.vergabe?.verfahren?.name || "–",
    EEG: EEG_ROLLEN.find((r) => r.id === e.eegRolle)?.label || "–",
  };

  const ausfuehren = useCallback(
    (aktion) => {
      const html = amtsvortragHtml(doc);
      if (aktion === "download") {
        const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = dateiName(e.gemeinde);
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setMeldung("Entwurf als HTML-Datei gespeichert – in Word oder im Browser öffnen und bearbeiten.");
      } else if (aktion === "druck") {
        const rahmen = document.createElement("iframe");
        rahmen.setAttribute("aria-hidden", "true");
        rahmen.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
        rahmen.srcdoc = html;
        rahmen.onload = () => {
          rahmen.contentWindow?.focus();
          rahmen.contentWindow?.print();
          setTimeout(() => rahmen.remove(), 4000);
        };
        document.body.appendChild(rahmen);
        setMeldung("Druckdialog geöffnet – als PDF speichern oder drucken.");
      } else if (aktion === "kopieren") {
        navigator.clipboard
          ?.writeText(amtsvortragText(doc))
          .then(() => setMeldung("Text in die Zwischenablage kopiert."))
          .catch(() => setMeldung("Kopieren nicht möglich – bitte den Download verwenden."));
      }
    },
    [doc, e.gemeinde],
  );

  const anfordern = (aktion) => {
    if (frei) ausfuehren(aktion);
    else setGate(aktion);
  };

  const nachFreigabe = useCallback(() => {
    freischalten();
    const aktion = gate;
    setGate(null);
    if (aktion) ausfuehren(aktion);
  }, [freischalten, gate, ausfuehren]);

  const toggleFoerderung = (pid) => setE((x) => ({ ...x, foerderungen: x.foerderungen.includes(pid) ? x.foerderungen.filter((f) => f !== pid) : [...x.foerderungen, pid] }));

  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70", className)}>
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Eingaben */}
        <form className="space-y-7 p-5 sm:p-8" onSubmit={(ev) => ev.preventDefault()} aria-label="Angaben für den Amtsvortrag">
          {uebernommen && (
            <p className="flex gap-2 rounded-2xl bg-ov-50 p-3 text-[13.5px] leading-snug text-ov-900">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              Liegenschaften und Leistung aus dem Liegenschafts-Check übernommen – bitte prüfen.
            </p>
          )}

          <div className="space-y-4">
            <p className={LEGENDE}>1 · Vorhaben</p>
            <Feld id={`${id}-gem`} label="Gemeinde">
              <input id={`${id}-gem`} className={EINGABE} value={e.gemeinde} onChange={setze("gemeinde")} placeholder="z. B. Marktgemeinde Musterdorf" autoComplete="off" />
            </Feld>
            <Feld id={`${id}-lieg`} label="Liegenschaft(en)" hilfe="Eine pro Zeile – z. B. Volksschule, Bauhof.">
              <textarea id={`${id}-lieg`} rows={3} className={cn(EINGABE, "h-auto py-2.5")} value={e.liegenschaften} onChange={setze("liegenschaften")} placeholder={"Volksschule\nBauhof"} />
            </Feld>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Feld id={`${id}-kwp`} label="Leistung kWp">
                <input id={`${id}-kwp`} inputMode="decimal" className={cn(EINGABE, "ov-num")} value={e.kwp} onChange={setze("kwp")} placeholder="120" />
              </Feld>
              <Feld id={`${id}-sp`} label="Speicher kWh">
                <input id={`${id}-sp`} inputMode="decimal" className={cn(EINGABE, "ov-num")} value={e.speicherKwh} onChange={setze("speicherKwh")} placeholder="0" />
              </Feld>
              <Feld id={`${id}-er`} label="Ertrag kWh/Jahr" className="col-span-2 sm:col-span-1">
                <input id={`${id}-er`} inputMode="decimal" className={cn(EINGABE, "ov-num")} value={e.ertragKwh} onChange={setze("ertragKwh")} placeholder="optional" />
              </Feld>
            </div>
          </div>

          <div className="space-y-4">
            <p className={LEGENDE}>2 · Vergabe</p>
            <Feld
              id={`${id}-wert`}
              label="Geschätzter Auftragswert netto (€)"
              hilfe={e.auftragswert && wert == null ? "Bitte einen Betrag eingeben, z. B. 180.000." : "Gesamtwert inkl. Optionen, ohne USt. (§ 13 BVergG)."}
            >
              <input
                id={`${id}-wert`}
                inputMode="decimal"
                className={cn(EINGABE, "ov-num")}
                value={e.auftragswert}
                onChange={setze("auftragswert")}
                onBlur={() => wert != null && setE((x) => ({ ...x, auftragswert: zahlText(wert) }))}
                placeholder="z. B. 150.000"
                aria-invalid={Boolean(e.auftragswert) && wert == null}
              />
            </Feld>
            <Wahl legende="Auftraggeber" name={`${id}-ag`} optionen={AUFTRAGGEBER} wert={e.auftraggeber} setWert={setze("auftraggeber")} />
            <Wahl legende="Bau- oder Lieferauftrag" name={`${id}-art`} optionen={ARTEN} wert={e.art} setWert={setze("art")} />
            {zulaessig.length > 1 && (
              <Feld id={`${id}-vf`} label="Gewähltes Verfahren">
                <select id={`${id}-vf`} className={EINGABE} value={doc.vergabe?.verfahren?.id || ""} onChange={setze("verfahrenId")}>
                  {zulaessig.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.norm})
                    </option>
                  ))}
                </select>
              </Feld>
            )}
            {doc.vergabe && (
              <p className="flex gap-2 rounded-2xl bg-sand-50 p-3 text-[13.5px] leading-snug text-ink-700">
                <Scale aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-700" />
                <span>{doc.vergabe.kurz}</span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <p className={LEGENDE}>3 · Beschluss und Bedeckung</p>
            <Feld id={`${id}-organ`} label="Beschlussorgan" hilfe="Zuständigkeit und Wertgrenze regelt die Gemeindeordnung – im Entwurf als Platzhalter.">
              <select id={`${id}-organ`} className={EINGABE} value={e.organ} onChange={setze("organ")}>
                {ORGANE.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Feld>
            <Feld id={`${id}-bed`} label="Bedeckung">
              <select id={`${id}-bed`} className={EINGABE} value={e.bedeckung} onChange={setze("bedeckung")}>
                {BEDECKUNGEN.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </Feld>
            <Feld id={`${id}-bedt`} label="Ergänzung zur Bedeckung (optional)">
              <input id={`${id}-bedt`} className={EINGABE} value={e.bedeckungText} onChange={setze("bedeckungText")} placeholder="z. B. Ansatz 1/8530-0500" autoComplete="off" />
            </Feld>
          </div>

          <fieldset className="space-y-2">
            <legend className={LEGENDE}>4 · Förderplan – nur laufende Fristen</legend>
            {PROGRAMME.map((p) => {
              const laeuft = aktivIds.includes(p.id);
              const an = laeuft && e.foerderungen.includes(p.id);
              return (
                <label key={p.id} className={cn("flex gap-3 rounded-2xl p-3 transition", laeuft ? "cursor-pointer bg-sand-50 hover:bg-sand-100" : "cursor-not-allowed bg-ink-50 opacity-70")}>
                  <input type="checkbox" disabled={!laeuft} checked={an} onChange={() => toggleFoerderung(p.id)} className="mt-0.5 h-5 w-5 shrink-0 accent-ov-600" />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold leading-snug text-ink-900">{p.titel}</span>
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-600">{laeuft ? p.kurz : "Frist derzeit nicht offen – nicht im Entwurf"}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="space-y-3">
            <Feld id={`${id}-eeg`} label="Rolle in einer Energiegemeinschaft">
              <select id={`${id}-eeg`} className={EINGABE} value={e.eegRolle} onChange={setze("eegRolle")}>
                {EEG_ROLLEN.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Feld>
            {(e.eegRolle === "betreiberin" || e.eegRolle === "gruenderin") && (
              <figure className="rounded-2xl bg-navy-950 p-4 text-white">
                <Quote aria-hidden="true" className="h-4 w-4 text-ov-300" />
                <blockquote className="mt-2 text-[13px] leading-relaxed text-white/80">{ELWG_68_6.zitat}</blockquote>
                <figcaption className="mt-2 text-[12px] text-white/60">
                  {ELWG_68_6.norm}, gilt {ELWG_68_6.gilt} · Wortlaut geprüft {ELWG_68_6.geprueft} ·{" "}
                  <a href={ELWG_68_6.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                    Quelle
                  </a>
                </figcaption>
              </figure>
            )}
          </div>
        </form>

        {/* Entwurf */}
        <div className="border-t border-ink-100 bg-sand-50 p-4 sm:p-8 lg:border-l lg:border-t-0">
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-800">
                <FileText aria-hidden="true" className="h-4 w-4" />
                Entwurf · Vorschau
              </p>
              <p className="text-[12.5px] text-ink-500">
                <span className="ov-num">{doc.platzhalter}</span> Platzhalter [__] auszufüllen
              </p>
            </div>

            <article
              aria-label="Vorschau Amtsvortrag"
              className="mt-3 max-h-[70vh] overflow-y-auto rounded-2xl bg-white p-5 font-serif text-[14.5px] leading-relaxed text-ink-900 shadow-[0_20px_50px_-35px_rgba(3,18,43,0.5)] sm:p-7"
            >
              <h3 className="font-serif text-[19px] font-bold leading-snug">{doc.titel}</h3>
              <p className="mt-1 text-[13px] text-ink-600">{doc.untertitel}</p>
              {doc.abschnitte.map((a) => (
                <section key={a.id} className="mt-5">
                  <h4 className="border-b border-ink-200 pb-1 font-serif text-[15.5px] font-bold">{a.titel}</h4>
                  {a.absaetze.map((p) => (
                    <p key={p} className="mt-2">
                      {p}
                    </p>
                  ))}
                  {a.liste &&
                    (a.nummeriert ? (
                      <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                        {a.liste.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="mt-2 list-disc space-y-1.5 pl-5">
                        {a.liste.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                    ))}
                </section>
              ))}
              <div className="mt-6 border-t border-ink-200 pt-3 font-sans text-[12.5px] leading-relaxed text-ink-600">
                <p className="font-semibold text-ink-800">Hinweise – keine Rechtsberatung</p>
                <ul className="mt-1 list-disc space-y-1 pl-4">
                  {doc.hinweise.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </article>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => anfordern("download")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white transition hover:bg-ov-700"
              >
                {frei ? <Download aria-hidden="true" className="h-4 w-4" /> : <Lock aria-hidden="true" className="h-4 w-4" />}
                Herunterladen
              </button>
              <button
                type="button"
                onClick={() => anfordern("druck")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 shadow-sm transition hover:bg-ink-50"
              >
                <Printer aria-hidden="true" className="h-4 w-4" />
                Drucken / PDF
              </button>
              <button
                type="button"
                onClick={() => anfordern("kopieren")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 shadow-sm transition hover:bg-ink-50"
              >
                <ClipboardCopy aria-hidden="true" className="h-4 w-4" />
                Text kopieren
              </button>
            </div>
            <p className="mt-2 text-[12.5px] leading-snug text-ink-500" aria-live="polite">
              {meldung || (frei ? "Download freigeschaltet." : "Vorschau frei. Download, Druck und Kopie nach kurzer Bestätigung Ihrer E-Mail-Adresse.")}
            </p>
          </div>
        </div>
      </div>

      {gate && (
        <KommunenGate
          aktion={gate === "druck" ? "pdf" : gate === "kopieren" ? "export" : "download"}
          kennung={GATE_KENNUNG}
          anker="amtsvortrag"
          titel="Amtsvortrag als Datei für Ihre Sitzungsvorlage"
          text="Wir senden Ihnen einen Bestätigungslink. Danach laden Sie den Entwurf als HTML-Datei herunter, drucken ihn als PDF oder kopieren den Text – Ihre Eingaben bleiben im Browser. Rückfragen beantworten wir per E-Mail (Art. 6 Abs. 1 lit. b DSGVO). Kein Newsletter."
          zusammenfassung={zusammenfassung}
          onFrei={nachFreigabe}
          onSchliessen={() => setGate(null)}
        />
      )}
    </div>
  );
}
