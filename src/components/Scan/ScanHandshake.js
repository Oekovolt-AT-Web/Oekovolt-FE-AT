"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Camera, Check, CheckCircle2, Clock, ExternalLink, FileText, Gauge, Home, Loader2, Lock, QrCode, Smartphone, Sparkles, X, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import useFokusFalle from "@/components/ui/useFokusFalle";
import { herkunft } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";

const SCHRITTE = [
  { feld: "zaehler", label: "Stromzähler", icon: Gauge },
  { feld: "rechnung", label: "Stromrechnung", icon: FileText },
  { feld: "schaltschrank", label: "Zählerschrank (optional)", icon: Zap },
  { feld: "dach", label: "Haus & Dach (optional)", icon: Home },
];

const FEHLER = {
  name: "Bitte geben Sie Ihren Namen an.",
  email: "Bitte eine gültige E-Mail-Adresse angeben.",
  telefon: "Bitte eine gültige Telefonnummer angeben.",
  plz: "Bitte eine gültige Postleitzahl angeben.",
  einwilligung: "Bitte stimmen Sie der Verarbeitung zu.",
  zu_viele: "Zu viele Anfragen – bitte versuchen Sie es in einigen Minuten erneut.",
  nicht_konfiguriert: "Diese Funktion ist gerade nicht verfügbar. Rufen Sie uns gern an: 08245 96 788 0.",
  backend: "Das hat nicht geklappt. Bitte erneut versuchen.",
};

/**
 * „Präzises Angebot anfordern“ – Desktop-Seite des Handshakes:
 * Kontaktdaten → QR-Code → Live-Status vom Smartphone → automatischer Abschluss.
 * rechner:        { kwp, verbrauch, speicherKwh, ausrichtung, neigung } (optional)
 * beiKiErgebnis:  (ki) => void – z. B. erkannten Verbrauch in den Rechner übernehmen
 */
export default function ScanHandshake({ rechner, quelle = "Solarrechner", beiKiErgebnis, label = "Präzises Angebot anfordern", className, knopfKlasse }) {
  const [offen, setOffen] = useState(false);
  const [schritt, setSchritt] = useState("form"); // form | qr | fertig | abgelaufen
  const [werte, setWerte] = useState({ name: "", email: "", telefon: "", plz: "" });
  const [einwilligung, setEinwilligung] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");
  const [sitzung, setSitzung] = useState(null);
  const [status, setStatus] = useState(null);
  const [rest, setRest] = useState(0);
  const dialog = useRef(null);
  const start = useRef(0);
  const website = useRef(null);
  const quelleRef = useRef(null);

  const schliessen = useCallback(() => {
    quelleRef.current?.close();
    setOffen(false);
  }, []);
  useFokusFalle(offen, dialog, { beiEscape: schliessen });

  useEffect(() => {
    if (!offen) return undefined;
    start.current = Date.now();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [offen]);

  // Live-Status per Server-Sent Events
  useEffect(() => {
    if (!sitzung || schritt !== "qr") return undefined;
    const es = new EventSource(`/api/scan/${sitzung.token}/status?stream=1`);
    quelleRef.current = es;
    es.addEventListener("status", (e) => {
      const s = JSON.parse(e.data);
      setStatus(s);
      if (s.phase === "eingegangen") {
        setSchritt("fertig");
        ereignis("scan_unterlagen_eingegangen", { quelle });
      }
    });
    es.addEventListener("ende", (e) => {
      const { grund } = JSON.parse(e.data);
      if (grund === "abgelaufen") setSchritt("abgelaufen");
      es.close();
    });
    return () => es.close();
  }, [sitzung, schritt, quelle]);

  // Nach Eingang weiter auf das KI-Ergebnis horchen
  useEffect(() => {
    if (!sitzung || schritt !== "fertig" || !["wartet", "laeuft"].includes(status?.ki?.status)) return undefined;
    const es = new EventSource(`/api/scan/${sitzung.token}/status?stream=1`);
    es.addEventListener("status", (e) => setStatus(JSON.parse(e.data)));
    es.addEventListener("ende", () => es.close());
    return () => es.close();
  }, [sitzung, schritt, status?.ki?.status]);

  // Countdown der Gültigkeit
  useEffect(() => {
    if (!sitzung || schritt !== "qr") return undefined;
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((sitzung.gueltigBis - Date.now()) / 1000));
      setRest(r);
      if (r === 0) setSchritt("abgelaufen");
    }, 1000);
    return () => clearInterval(t);
  }, [sitzung, schritt]);

  async function starten(e) {
    e?.preventDefault();
    if (werte.name.trim().length < 2) return setFehler(FEHLER.name);
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(werte.email.trim())) return setFehler(FEHLER.email);
    if (!einwilligung) return setFehler(FEHLER.einwilligung);
    setFehler("");
    setLaeuft(true);
    try {
      const r = await fetch("/api/scan/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...werte, einwilligung, rechner, quelle, website: website.current?.value || "", dauer: Date.now() - start.current, seite: window.location.pathname, herkunft: herkunft() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.fehler || "backend");
      setSitzung(d);
      setStatus({ phase: "offen", fotos: {}, gueltig: true });
      setSchritt("qr");
      ereignis("scan_qr_erzeugt", { quelle });
    } catch (err) {
      setFehler(FEHLER[err.message] || FEHLER.backend);
    } finally {
      setLaeuft(false);
    }
  }

  const feld =
    "h-12 w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500";
  const verbunden = status && status.phase !== "offen";
  const ki = status?.ki;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOffen(true);
          if (schritt === "abgelaufen") setSchritt("form");
        }}
        className={cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold transition", knopfKlasse || "h-12 bg-ov-600 px-6 text-[15px] text-white hover:bg-ov-700", className)}
      >
        <Smartphone aria-hidden="true" className="h-5 w-5" />
        <span className="whitespace-nowrap">{label}</span>
      </button>

      {offen && (
        <div className="fixed inset-0 z-[9700] flex items-end justify-center bg-navy-950/65 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && schliessen()}>
          <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="scan-titel" tabIndex={-1} className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-[1.75rem] bg-white shadow-2xl sm:rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 md:px-8">
              <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-ov-700">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                Präzises Angebot in 3 Minuten
              </p>
              <button type="button" onClick={schliessen} aria-label="Schließen" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-50 text-ink-700 hover:bg-ink-100">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {/* ---------------- Schritt 1: Kontakt */}
            {schritt === "form" && (
              <form onSubmit={starten} noValidate className="grid gap-8 p-6 md:grid-cols-[1fr_1.1fr] md:p-8">
                <div>
                  <h2 id="scan-titel" className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink-900">
                    Statt abtippen: einfach fotografieren.
                  </h2>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
                    Scannen Sie gleich einen QR-Code mit Ihrem Smartphone und fotografieren Sie Zähler und Stromrechnung – ohne App. Ihr Berater hat dann alle Daten für ein
                    genaues Angebot.
                  </p>
                  <ol className="mt-6 space-y-3">
                    {["Kontaktdaten eingeben", "QR-Code mit dem Handy scannen", "Zähler & Rechnung fotografieren – fertig"].map((t, i) => (
                      <li key={t} className="flex items-center gap-3 text-[15px] text-ink-800">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-50 text-[14px] font-bold text-ov-700">{i + 1}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="grid content-start gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">Name *</span>
                    <input className={feld} autoComplete="name" value={werte.name} onChange={(e) => setWerte({ ...werte, name: e.target.value })} aria-required="true" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">E-Mail *</span>
                    <input className={feld} type="email" inputMode="email" autoComplete="email" value={werte.email} onChange={(e) => setWerte({ ...werte, email: e.target.value })} aria-required="true" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">Telefon</span>
                      <input className={feld} type="tel" inputMode="tel" autoComplete="tel" value={werte.telefon} onChange={(e) => setWerte({ ...werte, telefon: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[14px] font-semibold text-ink-900">PLZ</span>
                      <input className={feld} inputMode="numeric" autoComplete="postal-code" value={werte.plz} onChange={(e) => setWerte({ ...werte, plz: e.target.value })} />
                    </label>
                  </div>
                  <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                  <label className="mt-1 flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-ov-600" />
                    <span className="text-[13.5px] leading-relaxed text-ink-600">
                      Ökovolt darf meine Angaben zur Angebotserstellung verarbeiten und mich kontaktieren.{" "}
                      <Link href="/datenschutz#unterlagen" className="font-semibold text-ov-700 underline underline-offset-2">
                        Datenschutz
                      </Link>{" "}
                      * Pflichtfeld
                    </span>
                  </label>
                  {fehler && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[14px] text-red-700 ring-1 ring-red-200">
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      {fehler}
                    </p>
                  )}
                  <button type="submit" disabled={laeuft} className="mt-1 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ov-600 py-3.5 text-[16px] font-semibold text-white hover:bg-ov-700 disabled:opacity-60">
                    {laeuft ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <QrCode aria-hidden="true" className="h-5 w-5" />}
                    QR-Code erzeugen
                  </button>
                </div>
              </form>
            )}

            {/* ---------------- Schritt 2: QR-Code + Live-Status */}
            {schritt === "qr" && sitzung && (
              <div className="grid gap-8 p-6 md:grid-cols-[auto_1fr] md:p-8">
                <div className="mx-auto w-full max-w-[280px]">
                  <div className="relative rounded-[1.75rem] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(3,18,43,0.45)] ring-1 ring-ink-200">
                    <div className={cn("transition-all duration-500 [&_svg]:h-auto [&_svg]:w-full", verbunden && "opacity-30")} dangerouslySetInnerHTML={{ __html: sitzung.qrSvg }} />
                    {verbunden && (
                      <div className="absolute inset-4 flex flex-col items-center justify-center rounded-2xl bg-white/85 text-center backdrop-blur-[2px]">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ov-600 text-white shadow-lg">
                          <Smartphone aria-hidden="true" className="h-8 w-8" />
                        </span>
                        <p className="mt-3 font-display text-[18px] font-extrabold text-ink-900">Verbunden</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-ink-600">
                    <Clock aria-hidden="true" className="h-4 w-4" />
                    gültig noch {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")} Min.
                  </p>
                  <a href={sitzung.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-ov-700 underline underline-offset-2 md:hidden">
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    Auf diesem Gerät öffnen
                  </a>
                </div>

                <div aria-live="polite">
                  <h2 id="scan-titel" className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink-900">
                    {verbunden ? "Ihr Smartphone ist verbunden." : "Scannen Sie den QR-Code mit Ihrem Smartphone."}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                    {verbunden ? "Fotografieren Sie jetzt Zähler und Rechnung – dieses Fenster aktualisiert sich automatisch." : "Kamera-App öffnen, auf den Code richten und den Link antippen. Keine App-Installation nötig."}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    <li className={cn("flex items-center gap-3 rounded-2xl p-3 ring-1", verbunden ? "bg-ov-50 ring-ov-200" : "bg-sand-50 ring-ink-200/70")}>
                      {verbunden ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-ov-700" /> : <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-ink-500" />}
                      <span className="text-[15px] font-semibold text-ink-900">Smartphone verbunden</span>
                    </li>
                    {SCHRITTE.map((s) => {
                      const da = status?.fotos?.[s.feld];
                      return (
                        <li key={s.feld} className={cn("flex items-center gap-3 rounded-2xl p-3 ring-1 transition", da ? "bg-ov-50 ring-ov-200" : "bg-white ring-ink-200/70")}>
                          {da ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-ov-700" /> : <s.icon aria-hidden="true" className="h-5 w-5 text-ink-500" />}
                          <span className={cn("text-[15px]", da ? "font-semibold text-ink-900" : "text-ink-600")}>{s.label}</span>
                          {da && <span className="ml-auto text-[12.5px] font-semibold text-ov-700">empfangen</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-5 flex items-center gap-1.5 text-[12.5px] text-ink-600">
                    <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                    Einmal-Code, nach 45 Minuten ungültig · Fotos ohne Standortdaten
                  </p>
                </div>
              </div>
            )}

            {/* ---------------- Schritt 3: Fertig */}
            {schritt === "fertig" && (
              <div className="p-6 text-center md:p-12" role="status">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ov-600 text-white shadow-[0_14px_34px_-12px_rgba(85,130,39,0.8)]">
                  <Check aria-hidden="true" className="h-10 w-10" strokeWidth={3} />
                </span>
                <h2 id="scan-titel" className="mt-6 font-display text-[28px] font-extrabold tracking-tight text-ink-900">
                  Vielen Dank! Ihre Daten wurden übermittelt.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-600">
                  Ihr Ökovolt-Berater prüft Zähler, Rechnung{status?.fotos?.schaltschrank ? ", Zählerschrank" : ""}
                  {status?.fotos?.dach ? " und Dach" : ""} und meldet sich mit Ihrem Angebot bei {werte.email}.
                </p>

                {ki && ["wartet", "laeuft"].includes(ki.status) && (
                  <p className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-sand-50 p-4 text-[14.5px] text-ink-700 ring-1 ring-ink-200/70">
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-ov-700" />
                    Ihre Rechnung wird ausgelesen …
                  </p>
                )}
                {ki?.status === "fertig" && ki.jahresverbrauch && (
                  <div className="mx-auto mt-6 max-w-md rounded-2xl bg-ov-50 p-5 text-left ring-1 ring-ov-200">
                    <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ov-700">
                      <Sparkles aria-hidden="true" className="h-4 w-4" />
                      Aus Ihrer Rechnung erkannt
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <dt className="text-[13px] text-ink-600">Jahresverbrauch</dt>
                        <dd className="font-display text-[22px] font-extrabold text-ink-900">{Math.round(ki.jahresverbrauch).toLocaleString("de-DE")} kWh</dd>
                      </div>
                      {ki.arbeitspreis_ct && (
                        <div>
                          <dt className="text-[13px] text-ink-600">Arbeitspreis</dt>
                          <dd className="font-display text-[22px] font-extrabold text-ink-900">{Number(ki.arbeitspreis_ct).toLocaleString("de-DE", { maximumFractionDigits: 2 })} ct</dd>
                        </div>
                      )}
                    </dl>
                    {beiKiErgebnis && (
                      <button type="button" onClick={() => (beiKiErgebnis(ki), schliessen())} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ov-600 text-[15px] font-semibold text-white hover:bg-ov-700">
                        Werte in den Rechner übernehmen
                      </button>
                    )}
                    <p className="mt-2 text-[12px] text-ink-600">Automatisch ausgelesen – Ihr Berater prüft die Werte.</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/termin?art=video" onClick={schliessen} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-950 px-6 text-[15px] font-semibold text-white">
                    <Camera aria-hidden="true" className="h-4 w-4" />
                    Video-Beratung buchen
                  </Link>
                  <button type="button" onClick={schliessen} className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-700 ring-1 ring-inset ring-ink-200">
                    Schließen
                  </button>
                </div>
              </div>
            )}

            {schritt === "abgelaufen" && (
              <div className="p-8 text-center">
                <h2 id="scan-titel" className="font-display text-[24px] font-extrabold text-ink-900">
                  Der QR-Code ist abgelaufen.
                </h2>
                <p className="mt-2 text-[15px] text-ink-600">Aus Sicherheitsgründen gilt jeder Code nur 45 Minuten.</p>
                <button type="button" onClick={() => starten()} className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white">
                  <QrCode aria-hidden="true" className="h-5 w-5" />
                  Neuen Code erzeugen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
