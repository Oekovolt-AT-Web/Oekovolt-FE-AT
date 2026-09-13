"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Download, EyeOff, KeyRound, Loader2, Lock, ShieldCheck, UserRound,
} from "lucide-react";
import { KATEGORIEN, BEZIEHUNG, EXTERNE_MELDESTELLE_URL } from "@/data/hinweisgeber";

const SCHRITTE = ["Thema", "Sachverhalt", "Identität", "Absenden"];


export default function MeldeFormular() {
  const [schritt, setSchritt] = useState(0);
  const [richtung, setRichtung] = useState(1);
  const [status, setStatus] = useState(null); // null | senden | ok | fehler
  const [fehler, setFehler] = useState({});
  const [ergebnis, setErgebnis] = useState(null);
  const start = useRef(Date.now());
  const kopf = useRef(null);

  const [f, setF] = useState({
    kategorie: "",
    beziehung: "Keine Angabe",
    betreff: "",
    beschreibung: "",
    zeitraum: "",
    ort: "",
    beteiligte: "",
    bereitsGemeldet: "Nein",
    anonym: true,
    name: "",
    email: "",
    telefon: "",
    datenschutz: false,
    website: "", // Honeypot
  });

  // Bewusst KEIN Zwischenspeichern im Browser: Auf gemeinsam genutzten
  // Geräten könnte sonst jemand den Entwurf einer Meldung finden.
  useEffect(() => {
    const warnen = (e) => {
      if (status !== "ok" && (f.beschreibung.length > 20 || f.betreff.length > 5)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warnen);
    return () => window.removeEventListener("beforeunload", warnen);
  }, [f.beschreibung, f.betreff, status]);

  const setze = (k, v) => {
    setF((a) => ({ ...a, [k]: v }));
    setFehler((e) => ({ ...e, [k]: undefined }));
  };

  const pruefen = (s) => {
    const e = {};
    if (s === 0 && !f.kategorie) e.kategorie = "Bitte wählen Sie ein Thema.";
    if (s === 1) {
      if (f.betreff.trim().length < 5) e.betreff = "Bitte geben Sie einen kurzen Betreff an (mind. 5 Zeichen).";
      if (f.beschreibung.trim().length < 30) e.beschreibung = "Bitte beschreiben Sie den Sachverhalt etwas ausführlicher (mind. 30 Zeichen).";
    }
    if (s === 2 && !f.anonym) {
      if (!f.name.trim() && !f.email.trim() && !f.telefon.trim()) e.name = "Bitte geben Sie mindestens eine Kontaktmöglichkeit an – oder melden Sie anonym.";
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Bitte prüfen Sie die E-Mail-Adresse.";
    }
    if (s === 3 && !f.datenschutz) e.datenschutz = "Bitte bestätigen Sie die Datenschutzhinweise.";
    setFehler(e);
    return Object.keys(e).length === 0;
  };

  const gehe = (ziel) => {
    if (ziel > schritt && !pruefen(schritt)) return;
    setRichtung(ziel > schritt ? 1 : -1);
    setSchritt(ziel);
    requestAnimationFrame(() => {
      const top = kopf.current?.getBoundingClientRect().top;
      if (top !== undefined && (top < 80 || top > window.innerHeight * 0.5)) window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
      kopf.current?.focus({ preventScroll: true });
    });
  };

  const absenden = async () => {
    if (!pruefen(3)) return;
    setStatus("senden");
    try {
      const res = await fetch("/api/hinweis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, dauer: Date.now() - start.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.referenz) throw new Error(json.fehler || "fehler");
      setErgebnis(json);
      setStatus("ok");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("fehler");
    }
  };

  if (status === "ok" && ergebnis) return <Bestaetigung ergebnis={ergebnis} />;

  const fortschritt = ((schritt + 1) / SCHRITTE.length) * 100;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="border-b border-ink-100 px-6 pb-5 pt-6 md:px-10 md:pt-8">
        <div className="flex items-center justify-between gap-4 text-[13px] text-ink-500">
          <span className="font-semibold text-ov-700">Schritt {schritt + 1} von {SCHRITTE.length}</span>
          <span className="flex items-center gap-1.5"><Lock aria-hidden="true" className="h-3.5 w-3.5" /> Verschlüsselt übertragen</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={Math.round(fortschritt)} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
          <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-700" style={{ width: `${fortschritt}%` }} />
        </div>
        <ol className="mt-4 hidden gap-2 sm:flex">
          {SCHRITTE.map((s, i) => (
            <li key={s} className="flex-1">
              <button type="button" disabled={i > schritt} onClick={() => gehe(i)} className={`w-full text-left text-[12.5px] font-medium ${i === schritt ? "text-ink-900" : i < schritt ? "text-ov-700" : "text-ink-400"}`}>
                {i < schritt && <Check aria-hidden="true" className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />}
                {s}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        <h2 ref={kopf} tabIndex={-1} className="sr-only" aria-live="polite">{SCHRITTE[schritt]}</h2>
        {/* Honeypot – für Menschen unsichtbar */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setze("website", e.target.value)} /></label>
        </div>

        <div key={schritt} className={richtung > 0 ? "ov-step-vor" : "ov-step-zurueck"}>
          {schritt === 0 && (
            <Frage titel="Worum geht es?" hinweis="Wählen Sie das Thema, das am besten passt. Die Meldestelle ordnet den Hinweis bei Bedarf neu zu.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {KATEGORIEN.map((k) => {
                  const aktiv = f.kategorie === k.id;
                  return (
                    <button key={k.id} type="button" aria-pressed={aktiv} onClick={() => setze("kategorie", k.id)}
                      className={`rounded-2xl border-2 p-4 text-left transition-all duration-300 ${aktiv ? "border-ov-500 bg-ov-50 shadow-md" : "border-ink-200 bg-white hover:-translate-y-0.5 hover:border-ink-300"}`}>
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[15px] font-semibold text-ink-900">{k.label}</span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${aktiv ? "border-ov-500 bg-ov-500 text-white" : "border-ink-300"}`}>
                          {aktiv && <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />}
                        </span>
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-ink-500">{k.text}</span>
                    </button>
                  );
                })}
              </div>
              <Fehler text={fehler.kategorie} />
              <label htmlFor="hw-beziehung" className="mb-2 mt-8 block text-[15px] font-semibold text-ink-900">In welcher Beziehung stehen Sie zu Ökovolt? <span className="font-normal text-ink-400">(optional)</span></label>
              <select id="hw-beziehung" value={f.beziehung} onChange={(e) => setze("beziehung", e.target.value)} className="h-12 w-full max-w-sm rounded-xl border-2 border-ink-200 bg-white px-4 text-[16px] text-ink-900 outline-none focus:border-ov-500">
                {BEZIEHUNG.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Frage>
          )}

          {schritt === 1 && (
            <Frage titel="Was ist passiert?" hinweis="Beschreiben Sie den Sachverhalt so konkret wie möglich: Was, wann, wo, wer? Nennen Sie nur Informationen, die Sie zur Aufklärung für notwendig halten.">
              <div className="grid gap-5">
                <Feld id="betreff" label="Betreff" wert={f.betreff} setze={setze} fehler={fehler.betreff} maxLength={140} />
                <div>
                  <label htmlFor="hw-beschreibung" className="mb-1.5 block text-[14px] font-semibold text-ink-800">Beschreibung</label>
                  <textarea id="hw-beschreibung" rows={8} value={f.beschreibung} maxLength={20000} onChange={(e) => setze("beschreibung", e.target.value)}
                    aria-invalid={!!fehler.beschreibung}
                    className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-[16px] leading-relaxed text-ink-900 outline-none focus:border-ov-500 ${fehler.beschreibung ? "border-red-400" : "border-ink-200"}`} />
                  <div className="mt-1 flex justify-between text-[12.5px]">
                    <Fehler text={fehler.beschreibung} klein />
                    <span className="ml-auto text-ink-400">{f.beschreibung.length.toLocaleString("de-DE")} / 20.000</span>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Feld id="zeitraum" label="Wann? (optional)" wert={f.zeitraum} setze={setze} placeholder="z. B. seit März 2026" maxLength={140} />
                  <Feld id="ort" label="Wo? (optional)" wert={f.ort} setze={setze} placeholder="z. B. Baustelle, Abteilung" maxLength={140} />
                </div>
                <div>
                  <label htmlFor="hw-beteiligte" className="mb-1.5 block text-[14px] font-semibold text-ink-800">Beteiligte Personen oder Bereiche <span className="font-normal text-ink-400">(optional)</span></label>
                  <textarea id="hw-beteiligte" rows={3} value={f.beteiligte} maxLength={2000} onChange={(e) => setze("beteiligte", e.target.value)} className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-3 text-[16px] text-ink-900 outline-none focus:border-ov-500" />
                </div>
                <div>
                  <p className="mb-2 text-[14px] font-semibold text-ink-800">Haben Sie den Verstoß bereits an anderer Stelle gemeldet?</p>
                  <Segment optionen={["Nein", "Ja, intern", "Ja, extern / bei einer Behörde"]} wert={f.bereitsGemeldet} onChange={(v) => setze("bereitsGemeldet", v)} />
                </div>
                <p className="flex gap-2 rounded-2xl bg-sand-50 p-4 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-100">
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
                  Wenn Sie anonym bleiben möchten, vermeiden Sie Angaben, die Rückschlüsse auf Ihre Person zulassen (z. B. „wie ich meinem Vorgesetzten gesagt habe“).
                </p>
              </div>
            </Frage>
          )}

          {schritt === 2 && (
            <Frage titel="Möchten Sie anonym bleiben?" hinweis="Beides ist möglich. Auch bei anonymer Meldung können Sie über Ihr persönliches Postfach mit der Meldestelle kommunizieren.">
              <div className="grid gap-3 sm:grid-cols-2">
                <WahlKarte aktiv={f.anonym} onClick={() => setze("anonym", true)} icon={EyeOff} titel="Anonym melden" text="Keine Angaben zu Ihrer Person. Kontakt ausschließlich über Ihr Postfach mit Fall-Nummer und Schlüssel." empfohlen />
                <WahlKarte aktiv={!f.anonym} onClick={() => setze("anonym", false)} icon={UserRound} titel="Mit Kontaktdaten" text="Die Meldestelle kann Sie direkt erreichen. Ihre Identität wird vertraulich behandelt (§ 8 HinSchG)." />
              </div>
              {!f.anonym && (
                <div className="ov-step-vor mt-8 grid gap-4 sm:grid-cols-2">
                  <Feld id="name" label="Name" wert={f.name} setze={setze} fehler={fehler.name} autoComplete="name" />
                  <Feld id="email" label="E-Mail" type="email" wert={f.email} setze={setze} fehler={fehler.email} autoComplete="email" />
                  <Feld id="telefon" label="Telefon (optional)" type="tel" wert={f.telefon} setze={setze} autoComplete="tel" />
                </div>
              )}
            </Frage>
          )}

          {schritt === 3 && (
            <Frage titel="Prüfen und absenden" hinweis="Nach dem Absenden erhalten Sie Ihre Fall-Nummer und Ihren Zugangsschlüssel.">
              <dl className="divide-y divide-ink-100 rounded-2xl bg-sand-50 px-5 ring-1 ring-ink-100">
                {[
                  ["Thema", KATEGORIEN.find((k) => k.id === f.kategorie)?.label],
                  ["Betreff", f.betreff],
                  ["Beschreibung", f.beschreibung.length > 220 ? f.beschreibung.slice(0, 220) + " …" : f.beschreibung],
                  ["Zeitraum / Ort", [f.zeitraum, f.ort].filter(Boolean).join(" · ") || "–"],
                  ["Identität", f.anonym ? "Anonym" : [f.name, f.email, f.telefon].filter(Boolean).join(" · ")],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <dt className="text-[13px] font-semibold text-ink-500">{k}</dt>
                    <dd className="whitespace-pre-line break-words text-[14.5px] text-ink-800">{v}</dd>
                  </div>
                ))}
              </dl>
              <label className={`mt-6 flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 ${fehler.datenschutz ? "bg-red-50 ring-red-200" : "bg-white ring-ink-200"}`}>
                <input type="checkbox" checked={f.datenschutz} onChange={(e) => setze("datenschutz", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#669933]" />
                <span className="text-[13.5px] leading-relaxed text-ink-600">
                  Ich habe die <Link href="#datenschutz" className="font-medium text-ov-700 underline">Datenschutzhinweise zum Hinweisgebersystem</Link> gelesen. Meine Angaben mache ich nach bestem Wissen und Gewissen.
                </span>
              </label>
              <Fehler text={fehler.datenschutz} />
              {status === "fehler" && (
                <div role="alert" className="mt-5 rounded-2xl bg-red-50 p-5 text-[14px] leading-relaxed text-red-900 ring-1 ring-red-200">
                  <p className="font-semibold">Die Meldung konnte gerade nicht übermittelt werden.</p>
                  <p className="mt-1">Ihre Eingaben sind noch da – bitte versuchen Sie es in einigen Minuten erneut. Alternativ erreichen Sie die Meldestelle auf den <a href="#meldewege" className="font-semibold underline">weiteren Meldewegen</a> (z. B. per Post) oder wenden sich an die <a href={EXTERNE_MELDESTELLE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">externe Meldestelle des Bundes</a>.</p>
                </div>
              )}
            </Frage>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-6 py-5 md:px-10">
        <button type="button" onClick={() => gehe(schritt - 1)} disabled={schritt === 0} className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 disabled:invisible">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Zurück
        </button>
        {schritt < SCHRITTE.length - 1 ? (
          <button type="button" onClick={() => gehe(schritt + 1)} className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-500 px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] hover:bg-ov-600">
            Weiter <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button type="button" onClick={absenden} disabled={status === "senden"} className="inline-flex h-12 items-center gap-2 rounded-full bg-navy-700 px-7 text-[15px] font-semibold text-white hover:bg-navy-800 disabled:opacity-70">
            {status === "senden" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ShieldCheck aria-hidden="true" className="h-4 w-4" />}
            Meldung sicher absenden
          </button>
        )}
      </div>
    </div>
  );
}

function Bestaetigung({ ergebnis }) {
  const [kopiert, setKopiert] = useState(false);
  const [gesichert, setGesichert] = useState(false);
  const text = `Ökovolt Hinweisgebersystem\nFall-Nummer: ${ergebnis.referenz}\nZugangsschlüssel: ${ergebnis.zugangsschluessel}\nPostfach: https://www.oekovolt.de/hinweisgebersystem/postfach\n\nBewahren Sie diese Daten sicher und für andere unzugänglich auf.`;

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(`Fall-Nummer: ${ergebnis.referenz}\nZugangsschlüssel: ${ergebnis.zugangsschluessel}`);
      setKopiert(true);
      setGesichert(true);
      setTimeout(() => setKopiert(false), 2500);
    } catch {}
  };
  const herunterladen = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `oekovolt-hinweis-${ergebnis.referenz}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setGesichert(true);
  };

  return (
    <div className="ov-step-vor overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="px-6 py-10 text-center md:px-12 md:py-14">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-xl">
          <CheckCircle2 aria-hidden="true" className="h-10 w-10" />
        </span>
        <h2 className="ov-h2 mt-7 text-ink-900">Ihre Meldung ist eingegangen.</h2>
        <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-ink-600">
          Vielen Dank für Ihren Mut. Die Meldestelle bestätigt den Eingang spätestens innerhalb von 7 Tagen in Ihrem Postfach.
        </p>

        <div className="mx-auto mt-9 max-w-xl rounded-3xl bg-navy-950 p-6 text-left text-white md:p-8">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-sun-300">
            <KeyRound aria-hidden="true" className="h-4 w-4" /> Jetzt sichern – wird nur einmal angezeigt
          </p>
          <dl className="mt-5 grid gap-4">
            <div>
              <dt className="text-[13px] text-white/55">Fall-Nummer</dt>
              <dd className="ov-num mt-1 select-all font-mono text-[24px] font-bold tracking-wider">{ergebnis.referenz}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-white/55">Zugangsschlüssel</dt>
              <dd className="mt-1 select-all break-all font-mono text-[19px] font-bold tracking-wide text-ov-300">{ergebnis.zugangsschluessel}</dd>
            </div>
          </dl>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={kopieren} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 text-[14.5px] font-semibold ring-1 ring-white/15 hover:bg-white/15">
              {kopiert ? <Check aria-hidden="true" className="h-4 w-4 text-ov-300" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
              {kopiert ? "Kopiert" : "Kopieren"}
            </button>
            <button type="button" onClick={herunterladen} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 text-[14.5px] font-semibold ring-1 ring-white/15 hover:bg-white/15">
              <Download aria-hidden="true" className="h-4 w-4" /> Als Datei sichern
            </button>
          </div>
          <p className="mt-5 text-[13px] leading-relaxed text-white/60">
            Ohne diese Daten ist kein Zugriff auf Ihr Postfach möglich. Aus Gründen der Anonymität können wir sie nicht wiederherstellen.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/hinweisgebersystem/postfach" aria-disabled={!gesichert}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold ${gesichert ? "bg-ov-500 text-white hover:bg-ov-600" : "pointer-events-none bg-ink-100 text-ink-400"}`}>
            Zum Postfach <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">Zur Startseite</Link>
        </div>
        {!gesichert && <p className="mt-3 text-[13px] text-ink-500">Bitte zuerst Fall-Nummer und Schlüssel sichern.</p>}
      </div>
    </div>
  );
}

function Frage({ titel, hinweis, children }) {
  return (
    <div>
      <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900">{titel}</p>
      {hinweis && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">{hinweis}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function WahlKarte({ aktiv, onClick, icon: Icon, titel, text, empfohlen }) {
  return (
    <button type="button" aria-pressed={aktiv} onClick={onClick}
      className={`relative flex gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300 ${aktiv ? "border-ov-500 bg-ov-50 shadow-md" : "border-ink-200 bg-white hover:border-ink-300"}`}>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${aktiv ? "bg-ov-500 text-white" : "bg-ink-100 text-ink-600"}`}>
        <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <span>
        <span className="flex items-center gap-2 text-[16px] font-semibold text-ink-900">
          {titel}
          {empfohlen && <span className="rounded-full bg-navy-950 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">Standard</span>}
        </span>
        <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-500">{text}</span>
      </span>
    </button>
  );
}

function Segment({ optionen, wert, onChange }) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {optionen.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={wert === o} onClick={() => onChange(o)}
          className={`h-11 rounded-full border-2 px-4 text-[14px] font-semibold transition-all ${wert === o ? "border-ov-500 bg-ov-500 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Feld({ id, label, wert, setze, fehler, type = "text", ...rest }) {
  return (
    <div>
      <label htmlFor={`hw-${id}`} className="mb-1.5 block text-[14px] font-semibold text-ink-800">{label}</label>
      <input id={`hw-${id}`} type={type} value={wert} onChange={(e) => setze(id, e.target.value)} aria-invalid={!!fehler}
        className={`h-12 w-full rounded-xl border-2 bg-white px-4 text-[16px] text-ink-900 outline-none placeholder:text-ink-400 focus:border-ov-500 ${fehler ? "border-red-400" : "border-ink-200"}`} {...rest} />
      <Fehler text={fehler} klein />
    </div>
  );
}

function Fehler({ text, klein }) {
  if (!text) return null;
  return <p role="alert" className={`${klein ? "mt-1.5 text-[13px]" : "mt-3 text-[13.5px]"} font-medium text-red-700`}>{text}</p>;
}
