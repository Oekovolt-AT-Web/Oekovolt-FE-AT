"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, BatteryCharging, Building, Building2, Check, CheckCircle2, Factory,
  Home, Loader2, Lock, PlugZap, ShieldCheck, Sun, Thermometer, Zap, Phone, Sparkles,
} from "lucide-react";

import { berechne, empfohlenerSpeicher } from "@/lib/solarrechner";
import { submitAnfrage } from "@/lib/api/anfrage/create_anfrage";

/* ------------------------------------------------------------------ */
/* Optionen                                                            */
/* ------------------------------------------------------------------ */

const VORHABEN = [
  { id: "pv", label: "Photovoltaikanlage", text: "Neue Solaranlage aufs Dach", icon: Sun },
  { id: "speicher", label: "Stromspeicher", text: "Neu oder nachrüsten", icon: BatteryCharging },
  { id: "wallbox", label: "Wallbox", text: "E-Auto mit Sonne laden", icon: PlugZap },
  { id: "waermepumpe", label: "Wärmepumpe", text: "Heizen mit Solarstrom", icon: Thermometer },
  { id: "notstrom", label: "Notstrom", text: "Versorgung bei Netzausfall", icon: Zap },
];

const GEBAEUDE = [
  { id: "Einfamilienhaus", icon: Home },
  { id: "Doppel-/Reihenhaus", icon: Building },
  { id: "Mehrfamilienhaus", icon: Building2 },
  { id: "Gewerbe / Landwirtschaft", icon: Factory },
];

const DAECHER = [
  { id: "Satteldach", pfad: "M6 34 L32 12 L58 34 Z", neigung: "mittel" },
  { id: "Flachdach", pfad: "M8 26 H56 V32 H8 Z", neigung: "flach" },
  { id: "Pultdach", pfad: "M8 34 L56 16 V34 Z", neigung: "mittel" },
  { id: "Sonstiges", pfad: "M8 34 L20 20 H44 L56 34 Z", neigung: "mittel" },
];

const AUSRICHTUNG = [
  { id: "sued", label: "Süd" },
  { id: "suedost", label: "Südost / Südwest" },
  { id: "ost-west", label: "Ost / West" },
  { id: "unbekannt", label: "Weiß ich nicht" },
];

const ZEITPLAN = ["So bald wie möglich", "In den nächsten 3 Monaten", "In 3–12 Monaten", "Ich informiere mich erst"];

const SCHRITTE = ["Vorhaben", "Gebäude", "Dach", "Verbrauch", "Kontakt"];
const SPEICHER_KEY = "ov_angebot_entwurf_v1";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

/* ------------------------------------------------------------------ */

export default function Konfigurator() {
  const params = useSearchParams();
  const [schritt, setSchritt] = useState(0);
  const [richtung, setRichtung] = useState(1);
  const [status, setStatus] = useState(null); // null | "senden" | "ok" | "fehler"
  const [fehler, setFehler] = useState({});
  const kopfRef = useRef(null);

  const [f, setF] = useState({
    vorhaben: ["pv", "speicher"],
    gebaeude: "Einfamilienhaus",
    eigentuemer: "yes",
    dach: "Satteldach",
    ausrichtung: "sued",
    verbrauch: 4500,
    personen: 4,
    zeitplan: ZEITPLAN[1],
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    plz: "",
    ort: "",
    agb: false,
  });

  // Vorbelegung aus Rechnern (?verbrauch=&kwp=&speicher=&wallbox=1&waermepumpe=1) oder Entwurf
  useEffect(() => {
    let entwurf = null;
    try {
      entwurf = JSON.parse(localStorage.getItem(SPEICHER_KEY) || "null");
    } catch {}
    const v = Number(params.get("verbrauch"));
    const extra = [];
    if (params.get("speicher") && Number(params.get("speicher")) > 0) extra.push("speicher");
    if (params.get("wallbox") === "1") extra.push("wallbox");
    if (params.get("waermepumpe") === "1") extra.push("waermepumpe");
    setF((alt) => ({
      ...alt,
      ...(entwurf || {}),
      agb: false,
      ...(v > 500 ? { verbrauch: Math.min(Math.max(Math.round(v / 250) * 250, 1500), 30000) } : {}),
      ...(extra.length ? { vorhaben: Array.from(new Set(["pv", ...extra])) } : {}),
    }));
  }, [params]);

  // Entwurf merken (ohne Einwilligung)
  useEffect(() => {
    if (status === "ok") return;
    try {
      const { agb, ...rest } = f;
      localStorage.setItem(SPEICHER_KEY, JSON.stringify(rest));
    } catch {}
  }, [f, status]);

  const setze = (k, v) => {
    setF((alt) => ({ ...alt, [k]: v }));
    setFehler((e) => ({ ...e, [k]: undefined }));
  };

  const toggleVorhaben = (id) =>
    setze("vorhaben", f.vorhaben.includes(id) ? f.vorhaben.filter((x) => x !== id) : [...f.vorhaben, id]);

  /* ---------------- Ersteinschätzung ---------------- */
  const schaetzung = useMemo(() => {
    const zusatz = (f.vorhaben.includes("waermepumpe") ? 3500 : 0) + (f.vorhaben.includes("wallbox") ? 2500 : 0);
    const gesamt = f.verbrauch + zusatz;
    const dach = DAECHER.find((d) => d.id === f.dach);
    const ausr = f.ausrichtung === "unbekannt" ? "suedost" : f.ausrichtung;
    const kwp = Math.min(Math.max(Math.round(((gesamt / 1000) * 1.4) * 2) / 2, 5), 30);
    const speicherKwh = f.vorhaben.includes("speicher") ? Math.min(empfohlenerSpeicher(gesamt), 15) : 0;
    const r = berechne({ kwp, ausrichtung: ausr, neigung: dach?.neigung || "mittel", verbrauch: gesamt, speicherKwh });
    return { kwp, speicherKwh, gesamt, zusatz, ...r };
  }, [f.vorhaben, f.verbrauch, f.dach, f.ausrichtung]);

  /* ---------------- Validierung & Navigation ---------------- */
  const pruefen = (s) => {
    const e = {};
    if (s === 0 && f.vorhaben.length === 0) e.vorhaben = "Bitte wählen Sie mindestens ein Vorhaben.";
    if (s === 4) {
      if (!f.vorname.trim()) e.vorname = "Bitte Vornamen angeben.";
      if (!f.nachname.trim()) e.nachname = "Bitte Nachnamen angeben.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Bitte gültige E-Mail-Adresse angeben.";
      if (!/^[\d\s+()/-]{6,}$/.test(f.telefon)) e.telefon = "Bitte Telefonnummer angeben.";
      if (!/^\d{5}$/.test(f.plz)) e.plz = "5-stellige PLZ";
      if (!f.ort.trim()) e.ort = "Bitte Ort angeben.";
      if (!f.agb) e.agb = "Bitte stimmen Sie zu, damit wir Sie kontaktieren dürfen.";
    }
    setFehler(e);
    return Object.keys(e).length === 0;
  };

  const gehe = (ziel) => {
    if (ziel > schritt && !pruefen(schritt)) return;
    setRichtung(ziel > schritt ? 1 : -1);
    setSchritt(ziel);
    requestAnimationFrame(() => {
      const top = kopfRef.current?.getBoundingClientRect().top;
      if (top !== undefined && (top < 80 || top > window.innerHeight * 0.5)) {
        window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
      }
      kopfRef.current?.focus({ preventScroll: true });
    });
  };

  const absenden = async () => {
    if (!pruefen(4)) return;
    setStatus("senden");
    const vorhabenText = f.vorhaben.map((id) => VORHABEN.find((v) => v.id === id)?.label).join(", ");
    const basis = {
      welche_dachform_hat_dein_haus: f.dach,
      bist_du_eigentümer_der_immobilie: f.eigentuemer === "yes" ? "Eigentümer" : "Nicht Eigentümer",
      wieviel_stromverbrauch_hast_du_im_jahr: `Jährlicher Stromverbrauch: ${f.verbrauch} kWh`,
      nachname: f.nachname.trim(),
      vorname: f.vorname.trim(),
      e_mail: f.email.trim(),
      telefonnummer: f.telefon.trim(),
      plz: f.plz.trim(),
      ort: f.ort.trim(),
      allgemeine_geschäftsbedingungen: 1,
    };
    const details =
      `Jährlicher Stromverbrauch: ${f.verbrauch} kWh | Vorhaben: ${vorhabenText} | Gebäude: ${f.gebaeude} | ` +
      `Ausrichtung: ${AUSRICHTUNG.find((a) => a.id === f.ausrichtung)?.label} | Zeitplan: ${f.zeitplan} | ` +
      `Richtwert: ${schaetzung.kwp} kWp${schaetzung.speicherKwh ? ` + ${schaetzung.speicherKwh} kWh Speicher` : ""} (Konfigurator)`;
    try {
      try {
        await submitAnfrage({ ...basis, wieviel_stromverbrauch_hast_du_im_jahr: details });
      } catch {
        // Falls das Backoffice-Feld die ausführliche Angabe nicht annimmt: Standardformat
        await submitAnfrage(basis);
      }
      setStatus("ok");
      try { localStorage.removeItem(SPEICHER_KEY); } catch {}
    } catch {
      setStatus("fehler");
    }
  };

  const fortschritt = status === "ok" ? 100 : ((schritt + 1) / SCHRITTE.length) * 100;

  /* ---------------- Render ---------------- */
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
        {/* Kopf mit Fortschritt */}
        <div className="border-b border-ink-100 px-6 pb-5 pt-6 md:px-10 md:pt-8">
          <div className="flex items-center justify-between gap-4 text-[13px] text-ink-500">
            <span className="font-semibold text-ov-700">
              {status === "ok" ? "Fertig" : `Schritt ${schritt + 1} von ${SCHRITTE.length}`}
            </span>
            <span className="flex items-center gap-1.5">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" /> Kostenlos & unverbindlich
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={Math.round(fortschritt)} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
            <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-700 ease-out" style={{ width: `${fortschritt}%` }} />
          </div>
          <ol className="mt-4 hidden gap-2 sm:flex">
            {SCHRITTE.map((s, i) => (
              <li key={s} className="flex-1">
                <button
                  type="button"
                  disabled={i > schritt || status === "ok"}
                  onClick={() => gehe(i)}
                  className={`w-full text-left text-[12.5px] font-medium transition-colors ${i === schritt ? "text-ink-900" : i < schritt ? "text-ov-700 hover:text-ov-800" : "text-ink-500"}`}
                >
                  {i < schritt && <Check aria-hidden="true" className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />}
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <h2 ref={kopfRef} tabIndex={-1} className="sr-only" aria-live="polite">
            {status === "ok" ? "Anfrage gesendet" : SCHRITTE[schritt]}
          </h2>

          {status === "ok" ? (
            <Erfolg vorname={f.vorname} schaetzung={schaetzung} />
          ) : (
            <div key={schritt} className={richtung > 0 ? "ov-step-vor" : "ov-step-zurueck"}>
              {schritt === 0 && (
                <Frage titel="Was möchten Sie umsetzen?" hinweis="Mehrfachauswahl möglich – alles wird aufeinander abgestimmt.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {VORHABEN.map((v) => (
                      <Kachel key={v.id} aktiv={f.vorhaben.includes(v.id)} onClick={() => toggleVorhaben(v.id)} icon={v.icon} titel={v.label} text={v.text} mehrfach />
                    ))}
                  </div>
                  <Fehler text={fehler.vorhaben} />
                </Frage>
              )}

              {schritt === 1 && (
                <Frage titel="Um welches Gebäude geht es?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {GEBAEUDE.map((g) => (
                      <Kachel key={g.id} aktiv={f.gebaeude === g.id} onClick={() => setze("gebaeude", g.id)} icon={g.icon} titel={g.id} />
                    ))}
                  </div>
                  <p id="ov-eigentuemer-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">Sind Sie Eigentümer der Immobilie?</p>
                  <Segment
                    optionen={[{ id: "yes", label: "Ja, Eigentümer" }, { id: "no", label: "Nein" }]}
                    wert={f.eigentuemer}
                    onChange={(v) => setze("eigentuemer", v)}
                    name="eigentuemer"
                  />
                </Frage>
              )}

              {schritt === 2 && (
                <Frage titel="Wie sieht Ihr Dach aus?" hinweis="Die Ausrichtung bestimmt den Ertrag – Ost/West ist heute oft sogar ideal für den Eigenverbrauch.">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {DAECHER.map((d) => {
                      const aktiv = f.dach === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          aria-pressed={aktiv}
                          onClick={() => setze("dach", d.id)}
                          className={`group flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300 ${aktiv ? "border-ov-500 bg-ov-50 shadow-md" : "border-ink-200 bg-white hover:border-ink-300"}`}
                        >
                          <svg viewBox="0 0 64 44" aria-hidden="true" className="h-14 w-20">
                            <rect x="12" y="32" width="40" height="10" rx="1" className={aktiv ? "fill-ov-200" : "fill-ink-200"} />
                            <path d={d.pfad} className={`transition-colors ${aktiv ? "fill-ov-500" : "fill-ink-400 group-hover:fill-ink-500"}`} />
                          </svg>
                          <span className={`text-[14.5px] font-semibold ${aktiv ? "text-ov-800" : "text-ink-700"}`}>{d.id}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p id="ov-ausrichtung-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">Ausrichtung der größten Dachfläche</p>
                  <Segment optionen={AUSRICHTUNG} wert={f.ausrichtung} onChange={(v) => setze("ausrichtung", v)} name="ausrichtung" umbrechen />
                </Frage>
              )}

              {schritt === 3 && (
                <Frage titel="Wie hoch ist Ihr Stromverbrauch?" hinweis="Steht auf Ihrer Jahresabrechnung. Schätzen genügt – wir prüfen das im Gespräch.">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {[
                      { p: 1, kwh: 1500 },
                      { p: 2, kwh: 2500 },
                      { p: 3, kwh: 3500 },
                      { p: 4, kwh: 4500 },
                      { p: 5, kwh: 5500 },
                    ].map((o) => (
                      <button
                        key={o.p}
                        type="button"
                        onClick={() => setF((a) => ({ ...a, personen: o.p, verbrauch: o.kwh }))}
                        className={`h-11 rounded-full px-4 text-[14px] font-semibold transition-all ${f.verbrauch === o.kwh ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200"}`}
                      >
                        {o.p}{o.p === 5 ? "+" : ""} {o.p === 1 ? "Person" : "Personen"}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-ink-100">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="ov-verbrauch" className="text-[15px] font-semibold text-ink-900">Jahresverbrauch (ohne neue Geräte)</label>
                      <output htmlFor="ov-verbrauch" className="ov-num font-display text-[28px] font-extrabold text-ink-900">
                        {f.verbrauch.toLocaleString("de-DE")} <span className="text-[16px] font-bold text-ink-600">kWh</span>
                      </output>
                    </div>
                    <input
                      id="ov-verbrauch"
                      type="range"
                      min={1500}
                      max={30000}
                      step={250}
                      value={f.verbrauch}
                      onChange={(e) => setze("verbrauch", Number(e.target.value))}
                      aria-valuetext={`${f.verbrauch.toLocaleString("de-DE")} Kilowattstunden pro Jahr`}
                      className="ov-range mt-5"
                      style={{ "--ov-fill": `${((f.verbrauch - 1500) / 28500) * 100}%` }}
                    />
                    <div className="mt-2 flex justify-between text-[12px] text-ink-600"><span>1.500</span><span>30.000 kWh</span></div>
                    {schaetzung.zusatz > 0 && (
                      <p className="mt-4 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-600">
                        <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                        Für {f.vorhaben.includes("waermepumpe") && "Wärmepumpe"}{f.vorhaben.includes("waermepumpe") && f.vorhaben.includes("wallbox") && " und "}{f.vorhaben.includes("wallbox") && "E-Auto"} rechnen wir zusätzlich rund {schaetzung.zusatz.toLocaleString("de-DE")} kWh ein.
                      </p>
                    )}
                  </div>
                  <p id="ov-zeitplan-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">Wann möchten Sie starten?</p>
                  <Segment optionen={ZEITPLAN.map((z) => ({ id: z, label: z }))} wert={f.zeitplan} onChange={(v) => setze("zeitplan", v)} name="zeitplan" umbrechen />
                </Frage>
              )}

              {schritt === 4 && (
                <Frage titel="Wohin dürfen wir Ihre Einschätzung schicken?" hinweis="Ein Energieberater meldet sich persönlich bei Ihnen – kein Callcenter, keine Weitergabe an Dritte.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <p className="text-[13px] text-ink-500 sm:col-span-2">
                      <span aria-hidden="true" className="text-red-700">*</span> Pflichtfeld
                    </p>
                    <Feld id="vorname" label="Vorname" wert={f.vorname} setze={setze} fehler={fehler.vorname} autoComplete="given-name" pflicht />
                    <Feld id="nachname" label="Nachname" wert={f.nachname} setze={setze} fehler={fehler.nachname} autoComplete="family-name" pflicht />
                    <Feld id="email" label="E-Mail" type="email" wert={f.email} setze={setze} fehler={fehler.email} autoComplete="email" pflicht />
                    <Feld id="telefon" label="Telefon" type="tel" wert={f.telefon} setze={setze} fehler={fehler.telefon} autoComplete="tel" pflicht />
                    <div className="grid grid-cols-[120px_1fr] gap-4 sm:col-span-2">
                      <Feld id="plz" label="PLZ" wert={f.plz} setze={setze} fehler={fehler.plz} autoComplete="postal-code" inputMode="numeric" maxLength={5} pflicht />
                      <Feld id="ort" label="Ort" wert={f.ort} setze={setze} fehler={fehler.ort} autoComplete="address-level2" pflicht />
                    </div>
                  </div>
                  <label className={`mt-6 flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition-colors ${fehler.agb ? "bg-red-50 ring-red-200" : "bg-sand-50 ring-ink-100"}`}>
                    <input type="checkbox" checked={f.agb} onChange={(e) => setze("agb", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#669933]" />
                    <span className="text-[13.5px] leading-relaxed text-ink-600">
                      Ich stimme zu, dass Ökovolt mich zu meiner Anfrage kontaktiert, und akzeptiere die{" "}
                      <Link href="/agb" target="_blank" className="font-medium text-ov-700 underline">AGB</Link> sowie die{" "}
                      <Link href="/datenschutz" target="_blank" className="font-medium text-ov-700 underline">Datenschutzerklärung</Link>.
                    </span>
                  </label>
                  <Fehler text={fehler.agb} />
                  {status === "fehler" && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-[14px] text-red-800">
                      Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an: <a href="tel:+498245967880" className="font-semibold underline">08245 96 788 0</a>
                    </p>
                  )}
                </Frage>
              )}
            </div>
          )}
        </div>

        {status !== "ok" && (
          <div className="flex items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-6 py-5 md:px-10">
            <button
              type="button"
              onClick={() => gehe(schritt - 1)}
              disabled={schritt === 0}
              className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:invisible"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Zurück
            </button>
            {schritt < SCHRITTE.length - 1 ? (
              <button type="button" onClick={() => gehe(schritt + 1)} className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-all hover:bg-ov-700 active:scale-[0.98]">
                Weiter <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button type="button" onClick={absenden} disabled={status === "senden"} className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-all hover:bg-ov-700 active:scale-[0.98] disabled:opacity-70">
                {status === "senden" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
                Kostenlose Einschätzung anfordern
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live-Ersteinschätzung */}
      <aside className="lg:sticky lg:top-28">
        <Einschaetzung s={schaetzung} vorhaben={f.vorhaben} />
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Frage({ titel, hinweis, children }) {
  return (
    <div>
      <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900">{titel}</p>
      {hinweis && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-500">{hinweis}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Kachel({ aktiv, onClick, icon: Icon, titel, text, mehrfach }) {
  return (
    <button
      type="button"
      aria-pressed={aktiv}
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${aktiv ? "border-ov-500 bg-ov-50 shadow-[0_10px_30px_-18px_rgba(102,153,51,0.9)]" : "border-ink-200 bg-white hover:-translate-y-0.5 hover:border-ink-300"}`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${aktiv ? "bg-ov-500 text-white" : "bg-ink-100 text-ink-600 group-hover:bg-ov-100 group-hover:text-ov-700"}`}>
        <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold text-ink-900">{titel}</span>
        {text && <span className={`block text-[13px] ${aktiv ? "text-ink-600" : "text-ink-500"}`}>{text}</span>}
      </span>
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center ${mehrfach ? "rounded-md" : "rounded-full"} border-2 transition-all ${aktiv ? "border-ov-500 bg-ov-500 text-white" : "border-ink-300 bg-white text-transparent"}`}>
        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

function Segment({ optionen, wert, onChange, name, umbrechen }) {
  return (
    <div role="group" aria-labelledby={`ov-${name}-frage`} className={`flex gap-2 ${umbrechen ? "flex-wrap" : ""}`}>
      {optionen.map((o) => {
        const aktiv = wert === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={aktiv}
            onClick={() => onChange(o.id)}
            className={`h-12 rounded-full border-2 px-5 text-[14.5px] font-semibold transition-all ${aktiv ? "border-ov-600 bg-ov-600 text-white shadow-md" : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Feld({ id, label, wert, setze, fehler, type = "text", pflicht = false, ...rest }) {
  return (
    <div>
      <label htmlFor={`ov-${id}`} className="mb-1.5 block text-[14px] font-semibold text-ink-800">
        {label}
        {pflicht && <span aria-hidden="true" className="text-red-700"> *</span>}
      </label>
      <input
        id={`ov-${id}`}
        type={type}
        value={wert}
        onChange={(e) => setze(id, e.target.value)}
        aria-required={pflicht || undefined}
        aria-invalid={!!fehler}
        aria-describedby={fehler ? `ov-${id}-fehler` : undefined}
        className={`h-12 w-full rounded-xl border-2 bg-white px-4 text-[16px] text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-ov-500 ${fehler ? "border-red-400" : "border-ink-200"}`}
        {...rest}
      />
      {fehler && <p id={`ov-${id}-fehler`} className="mt-1.5 text-[13px] text-red-700">{fehler}</p>}
    </div>
  );
}

function Fehler({ text }) {
  if (!text) return null;
  return <p role="alert" className="mt-3 text-[13.5px] font-medium text-red-700">{text}</p>;
}

function Einschaetzung({ s, vorhaben }) {
  const nurOhnePv = !vorhaben.includes("pv");
  return (
    <div className="ov-noise relative overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white shadow-2xl">
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ov-500/35 blur-3xl" />
      <div className="relative">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> Ihre Ersteinschätzung
        </p>
        {nurOhnePv ? (
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">
            Für Speicher, Wallbox, Wärmepumpe oder Notstrom an einer bestehenden Anlage prüfen wir Ihre Situation individuell – die Einschätzung erhalten Sie im Gespräch.
          </p>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Wert label="Anlagengröße" wert={`${s.kwp.toLocaleString("de-DE")} kWp`} />
              <Wert label="Speicher" wert={s.speicherKwh ? `${s.speicherKwh} kWh` : "–"} />
              <Wert label="Jahresertrag" wert={`${Math.round(s.jahresertrag).toLocaleString("de-DE")} kWh`} />
              <Wert label="Autarkie" wert={`${Math.round(s.autarkie * 100)} %`} />
            </div>
            <div className="mt-6 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <p className="text-[13px] text-white/60">Vorteil pro Jahr (Ersparnis + Einspeisung)</p>
              <p className="ov-num mt-1 font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-300 transition-all">{eur(s.nutzenProJahr)}</p>
              <p className="mt-3 text-[13px] text-white/60">
                Investition ca. <span className="ov-num text-white">{eur(s.investition * 0.9)} – {eur(s.investition * 1.15)}</span>
                {s.amortisationJahre && <> · Amortisation ~ <span className="ov-num text-white">{s.amortisationJahre.toFixed(0)} Jahre</span></>}
              </p>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-white/45">
              Richtwerte auf Basis unseres <Link href="/solarrechner" className="underline">Solarrechners</Link> ({s.gesamt.toLocaleString("de-DE")} kWh inkl. geplanter Verbraucher). Das verbindliche Angebot erstellen wir nach Prüfung Ihres Dachs.
            </p>
          </>
        )}
        <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-[14px] text-white/80">
          <li className="flex items-center gap-2.5"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-300" /> Fachbetrieb mit über 15 Jahren Erfahrung</li>
          <li className="flex items-center gap-2.5"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-ov-300" /> Planung, Montage & Anmeldung aus einer Hand</li>
          <li className="flex items-center gap-2.5"><Phone aria-hidden="true" className="h-4 w-4 text-ov-300" /> Lieber anrufen? <a href="tel:+498245967880" className="font-semibold text-white underline-offset-2 hover:underline">08245 96 788 0</a></li>
        </ul>
      </div>
    </div>
  );
}

function Wert({ label, wert }) {
  return (
    <div>
      <p className="text-[12.5px] text-white/55">{label}</p>
      <p className="ov-num mt-0.5 font-display text-[20px] font-extrabold tracking-tight">{wert}</p>
    </div>
  );
}

function Erfolg({ vorname, schaetzung }) {
  return (
    <div className="ov-step-vor py-6 text-center">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-ov-300/50 motion-reduce:animate-none" style={{ animationIterationCount: 2 }} />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-xl">
          <Check aria-hidden="true" className="h-10 w-10" strokeWidth={3} />
        </span>
      </div>
      <p className="mt-8 font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.2rem)] font-extrabold tracking-tight text-ink-900">
        Vielen Dank{vorname ? `, ${vorname}` : ""}!
      </p>
      <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-ink-600">
        Ihre Anfrage ist bei uns eingegangen. Ein Energieberater meldet sich persönlich bei Ihnen, um Ihr Dach und Ihre Wünsche im Detail zu besprechen.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-3">
        {["Rückruf & Bedarfsanalyse", "Dachprüfung & Planung", "Verbindliches Angebot"].map((t, i) => (
          <div key={t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-100">
            <p className="font-display text-[13px] font-extrabold text-ov-600">0{i + 1}</p>
            <p className="mt-1 text-[13.5px] font-semibold leading-snug text-ink-800">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/referenzen/projekte" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">Referenzen ansehen</Link>
        <Link href="/energie-live" className="inline-flex h-12 items-center justify-center rounded-full bg-ink-900 px-6 text-[15px] font-semibold text-white hover:bg-ink-800">Strompreis live verfolgen</Link>
      </div>
    </div>
  );
}
