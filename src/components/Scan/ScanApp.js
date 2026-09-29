"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, Check, CheckCircle2, FileText, Gauge, Home, Loader2, Lock, Plus, RotateCcw, ScanLine, Send, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { bildVorbereiten, hochladen, zaehlerstandErkennen } from "./bild";

const KACHELN = [
  { feld: "zaehler", titel: "Stromzähler", text: "Display mit Zählerstand", icon: Gauge, pflicht: true, farbe: "from-[#f5b700]/25" },
  { feld: "rechnung", titel: "Stromrechnung", text: "Seite mit Verbrauch & Preis", icon: FileText, pflicht: true, pdf: true, farbe: "from-[#8cc152]/25" },
  { feld: "schaltschrank", titel: "Zählerschrank", text: "Geöffnet, von vorne", icon: Zap, farbe: "from-[#6aa9ff]/20" },
  { feld: "dach", titel: "Haus & Dach", text: "Außenansicht", icon: Home, farbe: "from-[#c084fc]/20" },
];

const FEHLER = {
  sitzung: "Diese Sitzung ist abgelaufen. Bitte am PC einen neuen QR-Code erzeugen.",
  zu_gross: "Die Datei ist zu groß (max. 8 MB).",
  dateityp: "Dieses Dateiformat wird nicht unterstützt.",
  zu_viele: "Zu viele Uploads – bitte kurz warten.",
  netz: "Keine Verbindung. Bitte erneut versuchen.",
  pflicht: "Bitte Stromzähler und Stromrechnung fotografieren.",
};

export default function ScanApp({ token, start }) {
  const [status] = useState(start);
  const [fotos, setFotos] = useState({}); // feld -> { zustand: laedt|ok|fehler, fortschritt, vorschau, fehler }
  const [zaehlerstand, setZaehlerstand] = useState("");
  const [ocr, setOcr] = useState({ laeuft: false, wert: "" });
  const [blatt, setBlatt] = useState(null); // null | "zaehler" | "senden"
  const [einwilligung, setEinwilligung] = useState(false);
  const [kiEinwilligung, setKiEinwilligung] = useState(false);
  const [senden, setSenden] = useState(false);
  const [fertig, setFertig] = useState(start?.phase === "eingegangen");
  const [meldung, setMeldung] = useState("");
  const eingaben = useRef({});

  // Desktop signalisieren: Smartphone ist verbunden
  useEffect(() => {
    fetch(`/api/scan/${token}/verbunden`, { method: "POST" }).catch(() => {});
  }, [token]);

  // Bereits hochgeladene Fotos (z. B. nach Neuladen) übernehmen
  useEffect(() => {
    if (!status?.fotos) return;
    setFotos((alt) => {
      const neu = { ...alt };
      for (const [f, da] of Object.entries(status.fotos)) if (da && !neu[f]) neu[f] = { zustand: "ok" };
      return neu;
    });
  }, [status]);

  async function aufnehmen(feld, datei) {
    if (!datei) return;
    setMeldung("");
    setFotos((a) => ({ ...a, [feld]: { zustand: "laedt", fortschritt: 0 } }));
    const { blob, vorschau, canvas } = await bildVorbereiten(datei);
    setFotos((a) => ({ ...a, [feld]: { ...a[feld], vorschau, pdf: datei.type === "application/pdf" } }));

    // OCR parallel zum Upload – bleibt komplett auf dem Gerät
    if (feld === "zaehler" && canvas) {
      setOcr({ laeuft: true, wert: "" });
      setBlatt("zaehler");
      zaehlerstandErkennen(canvas)
        .then((wert) => {
          setOcr({ laeuft: false, wert: wert || "" });
          if (wert) setZaehlerstand((z) => z || wert);
        })
        .catch(() => setOcr({ laeuft: false, wert: "" }));
    }

    const fd = new FormData();
    fd.append("feld", feld);
    fd.append("datei", blob, `${feld}.${blob.type === "application/pdf" ? "pdf" : "jpg"}`);
    try {
      await hochladen(`/api/scan/${token}/foto`, fd, (p) => setFotos((a) => ({ ...a, [feld]: { ...a[feld], fortschritt: p } })));
      setFotos((a) => ({ ...a, [feld]: { ...a[feld], zustand: "ok", fortschritt: 1 } }));
      if (navigator.vibrate) navigator.vibrate(18);
    } catch (e) {
      setFotos((a) => ({ ...a, [feld]: { ...a[feld], zustand: "fehler", fehler: FEHLER[e.message] || "Upload fehlgeschlagen." } }));
      if (e.message === "sitzung") setMeldung(FEHLER.sitzung);
    }
  }

  async function absenden() {
    setSenden(true);
    setMeldung("");
    try {
      const r = await fetch(`/api/scan/${token}/abschliessen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zaehlerstand, zaehlerstandOcr: ocr.wert, einwilligung, kiEinwilligung }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.fehler || "backend");
      setBlatt(null);
      setFertig(true);
      if (navigator.vibrate) navigator.vibrate([20, 60, 20]);
    } catch (e) {
      setMeldung(FEHLER[e.message] || "Das Senden hat nicht geklappt. Bitte erneut versuchen.");
    } finally {
      setSenden(false);
    }
  }

  const pflichtOk = fotos.zaehler?.zustand === "ok" && fotos.rechnung?.zustand === "ok";
  const anzahl = Object.values(fotos).filter((f) => f.zustand === "ok").length;
  const laedt = Object.values(fotos).some((f) => f.zustand === "laedt");

  // ------------------------------------------------ ungültig / abgelaufen
  if (!status || !status.gueltig) {
    return (
      <Rahmen>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
            <RotateCcw aria-hidden="true" className="h-7 w-7 text-[#f5b700]" />
          </span>
          <h1 className="mt-6 text-[24px] font-extrabold">Sitzung abgelaufen</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">Aus Sicherheitsgründen ist jeder QR-Code nur 45 Minuten gültig. Bitte am PC einen neuen Code erzeugen.</p>
        </div>
      </Rahmen>
    );
  }

  // ------------------------------------------------ fertig
  if (fertig) {
    return (
      <Rahmen>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="relative flex h-24 w-24 items-center justify-center">
            <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-[#8cc152]/30 [animation-iteration-count:2] motion-reduce:hidden" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#558227]">
              <Check aria-hidden="true" className="h-12 w-12" strokeWidth={3} />
            </span>
          </span>
          <h1 className="mt-8 text-[28px] font-extrabold leading-tight">Geschafft!</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-white/75">Ihre Unterlagen sind sicher bei uns angekommen. Sie können das Smartphone weglegen – am PC geht es weiter.</p>
          <p className="mt-8 flex items-center gap-2 text-[13px] text-white/60">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#8cc152]" />
            Verschlüsselt übertragen · sicher gespeichert
          </p>
        </div>
      </Rahmen>
    );
  }

  // ------------------------------------------------ Kacheln
  return (
    <Rahmen>
      <header className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-oekovolt-weiss.png" alt="Ökovolt" className="h-8 w-auto" />
        <span className="flex items-center gap-1.5 rounded-full bg-[#8cc152]/15 px-3 py-1 text-[12px] font-semibold text-[#b5e07f]">
          <span className="h-2 w-2 rounded-full bg-[#8cc152] motion-safe:animate-pulse" aria-hidden="true" />
          Mit PC verbunden
        </span>
      </header>

      <div className="px-5 pt-4">
        <h1 className="text-[22px] font-extrabold leading-tight">Unterlagen fotografieren</h1>
        <p className="mt-1 text-[14px] text-white/65">
          {anzahl} von 4 · Pflicht: Zähler & Rechnung
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div className="h-full rounded-full bg-[#8cc152] transition-all duration-500" style={{ width: `${(anzahl / 4) * 100}%` }} />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 px-5 py-4">
        {KACHELN.map((k) => {
          const f = fotos[k.feld];
          const Icon = k.icon;
          return (
            <div key={k.feld} className={`relative flex min-h-0 flex-col overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${k.farbe} to-white/[0.04] ring-1 ring-white/10`}>
              {f?.vorschau && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.vorschau} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
              )}
              <label className="relative flex flex-1 cursor-pointer flex-col justify-between p-3.5 transition active:scale-[0.97]">
                <input
                  ref={(el) => (eingaben.current[k.feld] = el)}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => aufnehmen(k.feld, e.target.files?.[0])}
                />
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/30 backdrop-blur">
                    {f?.zustand === "ok" ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-[#8cc152]" /> : f?.zustand === "laedt" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <Icon aria-hidden="true" className="h-5 w-5" />}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${k.pflicht ? "bg-white text-[#03122b]" : "bg-black/30 text-white/80"}`}>{k.pflicht ? "Pflicht" : "Optional"}</span>
                </div>
                <div>
                  <p className="text-[16px] font-bold leading-tight">{k.titel}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-white/70">{f?.zustand === "fehler" ? f.fehler : f?.zustand === "ok" ? "Erledigt – antippen zum Ersetzen" : k.text}</p>
                  {f?.zustand === "laedt" ? (
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full bg-white transition-all" style={{ width: `${Math.round((f.fortschritt || 0) * 100)}%` }} />
                    </div>
                  ) : (
                    !f && (
                      <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#f5b700]">
                        <Camera aria-hidden="true" className="h-4 w-4" />
                        Foto aufnehmen
                      </span>
                    )
                  )}
                </div>
              </label>
              {k.feld === "zaehler" && f?.zustand === "ok" && (
                <button type="button" onClick={() => setBlatt("zaehler")} className="relative mx-3.5 mb-3 flex items-center justify-between rounded-xl bg-black/35 px-3 py-1.5 text-[12.5px] backdrop-blur">
                  <span className="text-white/70">Stand</span>
                  <span className="font-bold tabular-nums">{zaehlerstand ? `${zaehlerstand} kWh` : "eintragen"}</span>
                </button>
              )}
              {k.pdf && (
                <div className="relative mx-3.5 mb-3 flex gap-1.5">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-black/35 px-2 py-1.5 text-[11.5px] font-semibold backdrop-blur">
                    <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => aufnehmen("rechnung", e.target.files?.[0])} />
                    PDF
                  </label>
                  {f?.zustand === "ok" && (
                    <label className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-black/35 px-2 py-1.5 text-[11.5px] font-semibold backdrop-blur">
                      <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => aufnehmen("rechnung_2", e.target.files?.[0])} />
                      {fotos.rechnung_2?.zustand === "ok" ? <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#8cc152]" /> : <Plus aria-hidden="true" className="h-3.5 w-3.5" />}
                      <span className="whitespace-nowrap">2. Seite</span>
                    </label>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {meldung && (
        <p role="alert" className="mx-5 mb-2 flex items-start gap-2 rounded-xl bg-red-500/15 p-3 text-[13.5px] text-red-100 ring-1 ring-red-400/30">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {meldung}
        </p>
      )}

      <footer className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!pflichtOk || laedt}
          onClick={() => setBlatt("senden")}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#558227] text-[17px] font-bold shadow-[0_12px_30px_-10px_rgba(102,153,51,0.8)] transition active:scale-[0.98] disabled:bg-white/10 disabled:text-white/60 disabled:shadow-none"
        >
          {laedt ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <Send aria-hidden="true" className="h-5 w-5" />}
          {laedt ? "Wird hochgeladen …" : pflichtOk ? "Daten an PC senden" : "Zähler & Rechnung fehlen"}
        </button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-white/55">
          <Lock aria-hidden="true" className="h-3 w-3" />
          Fotos werden verschlüsselt übertragen und ohne Standortdaten gespeichert
        </p>
      </footer>

      {/* ------------------------------------------------ Bottom Sheets */}
      {blatt && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setBlatt(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="blatt-titel" className="w-full rounded-t-[1.75rem] bg-[#0b1a33] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 ring-1 ring-white/10">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" aria-hidden="true" />
            {blatt === "zaehler" ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 id="blatt-titel" className="text-[20px] font-extrabold">Zählerstand</h2>
                  <button type="button" onClick={() => setBlatt(null)} aria-label="Schließen" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 flex items-center gap-2 text-[13.5px] text-white/65">
                  {ocr.laeuft ? (
                    <>
                      <ScanLine aria-hidden="true" className="h-4 w-4 animate-pulse text-[#f5b700]" />
                      Wird direkt auf Ihrem Handy erkannt …
                    </>
                  ) : ocr.wert ? (
                    <>
                      <Sparkles aria-hidden="true" className="h-4 w-4 text-[#8cc152]" />
                      Erkannt: {ocr.wert} – bitte prüfen
                    </>
                  ) : (
                    "Nicht sicher erkannt – bitte vom Display abtippen (optional)"
                  )}
                </p>
                <label className="mt-4 block">
                  <span className="sr-only">Zählerstand in kWh</span>
                  <div className="flex items-center rounded-2xl bg-white/10 px-4 ring-1 ring-white/15 focus-within:ring-2 focus-within:ring-[#8cc152]">
                    <input
                      inputMode="decimal"
                      value={zaehlerstand}
                      onChange={(e) => setZaehlerstand(e.target.value.replace(/[^\d.,]/g, "").slice(0, 12))}
                      placeholder="z. B. 48213"
                      className="h-14 w-full bg-transparent text-[24px] font-bold tabular-nums text-white placeholder:text-white/35 focus:outline-none"
                    />
                    <span className="text-[15px] font-semibold text-white/60">kWh</span>
                  </div>
                </label>
                <button type="button" onClick={() => setBlatt(null)} className="mt-4 flex h-13 w-full items-center justify-center rounded-2xl bg-white py-3.5 text-[16px] font-bold text-[#03122b]">
                  Übernehmen
                </button>
              </>
            ) : (
              <>
                <h2 id="blatt-titel" className="text-[20px] font-extrabold">Fast fertig</h2>
                <p className="mt-1 text-[14px] text-white/65">{anzahl} Unterlagen werden an Ihren Ökovolt-Berater übermittelt.</p>
                <label className="mt-5 flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#558227]" />
                  <span className="text-[13.5px] leading-relaxed text-white/80">
                    Ökovolt darf die Fotos und Angaben zur Erstellung meines Angebots speichern und auswerten. <span className="text-white/60">(Pflicht)</span>{" "}
                    <a href="/datenschutz#unterlagen" target="_blank" className="font-semibold underline underline-offset-2">
                      Datenschutz
                    </a>
                  </span>
                </label>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <input type="checkbox" checked={kiEinwilligung} onChange={(e) => setKiEinwilligung(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#558227]" />
                  <span className="text-[13px] leading-relaxed text-white/75">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <Sparkles aria-hidden="true" className="h-4 w-4 text-[#f5b700]" />
                      Rechnung automatisch auslesen (optional)
                    </span>
                    Verbrauch, Arbeits- und Grundpreis werden per KI (Anthropic Claude, USA) aus der Rechnung gelesen – das beschleunigt Ihr Angebot. Ohne Haken prüft ein Berater
                    die Rechnung manuell.
                  </span>
                </label>
                {meldung && <p className="mt-3 text-[13px] text-red-200">{meldung}</p>}
                <button
                  type="button"
                  onClick={absenden}
                  disabled={!einwilligung || senden}
                  className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#558227] text-[17px] font-bold transition active:scale-[0.98] disabled:opacity-50"
                >
                  {senden ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <Send aria-hidden="true" className="h-5 w-5" />}
                  Jetzt senden
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Rahmen>
  );
}

function Rahmen({ children }) {
  return (
    <div className="fixed inset-0 z-[2147483000] flex h-[100dvh] select-none flex-col overflow-hidden bg-[#03122b] text-white" style={{ WebkitTapHighlightColor: "transparent" }}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#669933]/25 blur-3xl" />
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
