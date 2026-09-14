"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, ExternalLink, FileText, Gauge, Home, Loader2, Lock, Smartphone, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";

const KACHELN = [
  { feld: "zaehler", label: "Stromzähler", icon: Gauge, pflicht: true },
  { feld: "rechnung", label: "Stromrechnung", icon: FileText, pflicht: true },
  { feld: "schaltschrank", label: "Zählerschrank", icon: Zap },
  { feld: "dach", label: "Haus & Dach", icon: Home },
];

const de = (n) => Number(n).toLocaleString("de-DE", { maximumFractionDigits: 1 });

/**
 * Fortsetzen-Seite aus der Erinnerungs-E-Mail. Öffnen ändert nichts – erst „Weiter“
 * erzeugt einen neuen Handy-Code. Auf dem Smartphone geht es direkt zur Foto-Seite,
 * am Computer erscheint der QR-Code.
 */
export default function Fortsetzen({ token, info }) {
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");
  const [sitzung, setSitzung] = useState(null);
  const [mobil, setMobil] = useState(false);
  const qrTitel = useRef(null);

  useEffect(() => {
    setMobil(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (sitzung) qrTitel.current?.focus();
  }, [sitzung]);

  const fotos = info.fotos || {};
  const naechste = KACHELN.find((k) => k.pflicht && !fotos[k.feld])?.feld;
  const werte = [
    info.kwp && { l: "Anlage", w: `${de(info.kwp)} kWp` },
    info.verbrauch && { l: "Verbrauch", w: `${de(info.verbrauch)} kWh` },
    info.speicher_kwh ? { l: "Speicher", w: `${de(info.speicher_kwh)} kWh` } : null,
  ].filter(Boolean);

  async function weiter() {
    setLaeuft(true);
    setFehler("");
    try {
      const r = await fetch("/api/scan/fortsetzen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.fehler || "backend");
      ereignis("scan_fortgesetzt", { geraet: mobil ? "mobil" : "computer" });
      if (mobil) {
        window.location.assign(d.url);
        return;
      }
      setSitzung(d);
    } catch (e) {
      setFehler(
        e.message === "abgelaufen"
          ? "Dieser Link ist nicht mehr gültig. Bitte starten Sie im Solarrechner neu."
          : e.message === "zu_viele"
            ? "Zu viele Versuche – bitte in einigen Minuten erneut."
            : "Das hat nicht geklappt. Bitte erneut versuchen oder rufen Sie uns an: 08245 96 788 0."
      );
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-10">
      {!sitzung ? (
        <>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ov-700">Fast geschafft</p>
          <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[34px]">
            {info.vorname ? `Hallo ${info.vorname}, ` : ""}hier machen Sie weiter.
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
            Ihre Angaben aus dem Solarrechner sind hinterlegt. Es fehlen nur noch die Fotos – danach erstellt Ihr Berater ein genaues Angebot.
          </p>

          {werte.length > 0 && (
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {werte.map((x) => (
                <div key={x.l} className="rounded-2xl bg-sand-50 p-3 ring-1 ring-ink-200/60">
                  <dt className="text-[12.5px] text-ink-600">{x.l}</dt>
                  <dd className="mt-0.5 font-display text-[18px] font-extrabold text-ink-900">{x.w}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {KACHELN.map((k) => {
              const da = fotos[k.feld];
              const hervor = k.feld === naechste;
              return (
                <li key={k.feld} className={cn("flex items-center gap-3 rounded-2xl p-3.5 ring-1", da ? "bg-ov-50 ring-ov-200" : hervor ? "bg-white ring-2 ring-ov-500 shadow-[0_8px_24px_-12px_rgba(93,143,46,0.6)]" : "bg-white ring-ink-200/70")}>
                  {da ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-ov-700" /> : <k.icon aria-hidden="true" className={cn("h-5 w-5", hervor ? "text-ov-700" : "text-ink-500")} />}
                  <span className={cn("text-[15px]", da || hervor ? "font-semibold text-ink-900" : "text-ink-600")}>
                    {k.label}
                    {!k.pflicht && <span className="font-normal text-ink-500"> (optional)</span>}
                  </span>
                  <span className={cn("ml-auto text-[12.5px] font-semibold", da ? "text-ov-700" : hervor ? "text-ov-700" : "text-ink-500")}>{da ? "erhalten" : hervor ? "als Nächstes" : ""}</span>
                </li>
              );
            })}
          </ul>

          {fehler && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[14px] text-red-700 ring-1 ring-red-200">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {fehler}
            </p>
          )}

          <button type="button" onClick={weiter} disabled={laeuft} className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ov-600 text-[16px] font-semibold text-white hover:bg-ov-700 disabled:opacity-60">
            {laeuft ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : <Smartphone aria-hidden="true" className="h-5 w-5" />}
            {mobil ? "Jetzt fotografieren" : "Weiter zum Smartphone-Upload"}
            {!laeuft && <ArrowRight aria-hidden="true" className="h-5 w-5" />}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-ink-600">
            <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            Persönlicher Link · keine App nötig · Fotos ohne Standortdaten
          </p>
        </>
      ) : (
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div className="mx-auto w-full max-w-[250px] rounded-3xl bg-white p-4 shadow-[0_20px_50px_-20px_rgba(3,18,43,0.45)] ring-1 ring-ink-200 [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: sitzung.qrSvg }} />
          <div aria-live="polite">
            <h1 ref={qrTitel} tabIndex={-1} className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 outline-none">
              Scannen Sie den Code mit Ihrem Smartphone.
            </h1>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">Kamera-App öffnen, auf den Code richten und den Link antippen. Dann Zähler und Rechnung fotografieren – fertig.</p>
            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-ink-600">
              <Clock aria-hidden="true" className="h-4 w-4" />
              Code gültig {sitzung.gueltigMinuten} Minuten
            </p>
            <a href={sitzung.url} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 underline underline-offset-2">
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Stattdessen an diesem Computer hochladen
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
