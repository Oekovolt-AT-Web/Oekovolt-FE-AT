"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, Check, Loader2, Share } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { PUSH_THEMEN } from "@/lib/kanaele/pushThemen";
import { pushAbbestellen, pushAbonnieren, pushSchluessel } from "@/app/push/actions";

const SPEICHER = "ov_push_themen";

function base64UrlZuUint8(wert) {
  const pad = "=".repeat((4 - (wert.length % 4)) % 4);
  const roh = atob((wert + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...roh].map((z) => z.charCodeAt(0)));
}

/**
 * Push-Benachrichtigungen ohne App (Web Push, auch iOS ab 16.4 als Home-Bildschirm-App).
 * thema: vorausgewähltes Thema (z. B. "news")
 */
export default function PushOptIn({ thema = "news", dunkel = false, className }) {
  const [unterstuetzt, setUnterstuetzt] = useState(null);
  const [iosHinweis, setIosHinweis] = useState(false);
  const [aktiv, setAktiv] = useState(false);
  const [offen, setOffen] = useState(false);
  const [themen, setThemen] = useState([thema]);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState("");
  const [serverAktiv, setServerAktiv] = useState(true);

  useEffect(() => {
    const ok = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    setIosHinweis(ios && !standalone);
    setUnterstuetzt(ok);
    if (!ok) return;
    try {
      const gespeichert = JSON.parse(localStorage.getItem(SPEICHER) || "null");
      if (Array.isArray(gespeichert) && gespeichert.length) setThemen(gespeichert);
    } catch {
      /* kein Speicher */
    }
    navigator.serviceWorker.getRegistration("/").then(async (reg) => {
      const abo = await reg?.pushManager.getSubscription();
      setAktiv(Boolean(abo) && Notification.permission === "granted");
    });
    pushSchluessel().then((s) => setServerAktiv(s.aktiv));
  }, []);

  async function aktivieren() {
    setLaeuft(true);
    setMeldung("");
    try {
      const { key, aktiv: bereit } = await pushSchluessel();
      if (!bereit || !key) throw new Error("Benachrichtigungen sind gerade nicht verfügbar.");
      const erlaubnis = await Notification.requestPermission();
      if (erlaubnis !== "granted") throw new Error("Benachrichtigungen wurden im Browser nicht erlaubt.");
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const abo = (await reg.pushManager.getSubscription()) || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlZuUint8(key) }));
      const r = await pushAbonnieren(abo.toJSON(), themen);
      if (!r.ok) throw new Error(r.fehler === "themen" ? "Bitte mindestens ein Thema wählen." : "Das Abo konnte nicht gespeichert werden.");
      try {
        localStorage.setItem(SPEICHER, JSON.stringify(r.themen));
      } catch {
        /* egal */
      }
      setAktiv(true);
      setOffen(false);
      setMeldung("Aktiviert – wir melden uns nur, wenn es wirklich etwas Neues gibt.");
    } catch (e) {
      setMeldung(e.message || "Das hat nicht geklappt.");
    } finally {
      setLaeuft(false);
    }
  }

  async function abbestellen() {
    setLaeuft(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const abo = await reg?.pushManager.getSubscription();
      if (abo) {
        await pushAbbestellen(abo.endpoint);
        await abo.unsubscribe();
      }
      setAktiv(false);
      setMeldung("Benachrichtigungen sind abbestellt.");
    } finally {
      setLaeuft(false);
    }
  }

  const leise = dunkel ? "text-white/70" : "text-ink-600";
  const chip = dunkel ? "bg-white/10 text-white ring-white/15" : "bg-white text-ink-800 ring-ink-200";

  if (unterstuetzt === null) return null;

  return (
    <div className={className}>
      <p className="flex items-center gap-2 text-[14px] font-semibold">
        <BellRing aria-hidden="true" className="h-4 w-4 text-sun-500" />
        Push-Benachrichtigungen
      </p>

      {!unterstuetzt ? (
        <p className={cn("mt-2 text-[13.5px] leading-relaxed", leise)}>
          {iosHinweis ? (
            <>
              Auf iPhone und iPad: Seite über <Share aria-hidden="true" className="inline h-3.5 w-3.5" /> „Zum Home-Bildschirm“ hinzufügen und dort öffnen – dann lassen sich Benachrichtigungen aktivieren.
            </>
          ) : (
            "Ihr Browser unterstützt keine Push-Benachrichtigungen."
          )}
        </p>
      ) : aktiv ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ov-600 px-3.5 text-[13px] font-semibold text-white">
            <Check aria-hidden="true" className="h-4 w-4" />
            Aktiv
          </span>
          <button type="button" onClick={() => setOffen((o) => !o)} className={cn("inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-inset", chip)}>
            Themen ändern
          </button>
          <button type="button" onClick={abbestellen} disabled={laeuft} className={cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-inset", chip)}>
            <BellOff aria-hidden="true" className="h-4 w-4" />
            Abbestellen
          </button>
        </div>
      ) : (
        <>
          <p className={cn("mt-2 text-[13.5px] leading-relaxed", leise)}>Ohne App: Wir benachrichtigen Sie auf Smartphone oder Computer – nur zu den Themen, die Sie wählen.</p>
          {!offen && (
            <button
              type="button"
              onClick={() => setOffen(true)}
              disabled={!serverAktiv}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-navy-950 px-4 text-[14px] font-semibold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Bell aria-hidden="true" className="h-4 w-4" />
              {serverAktiv ? "Benachrichtigungen aktivieren" : "Bald verfügbar"}
            </button>
          )}
        </>
      )}

      {offen && unterstuetzt && (
        <fieldset className="mt-4">
          <legend className="text-[13px] font-semibold">Worüber möchten Sie informiert werden?</legend>
          <div className="mt-2 grid gap-1.5">
            {PUSH_THEMEN.map((t) => (
              <label key={t.id} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={themen.includes(t.id)}
                  onChange={(e) => setThemen((alt) => (e.target.checked ? [...new Set([...alt, t.id])] : alt.filter((x) => x !== t.id)))}
                  className="h-4.5 w-4.5 accent-ov-600"
                />
                {t.label}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={aktivieren}
            disabled={laeuft || themen.length === 0}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-ov-600 px-4 text-[14px] font-semibold text-white transition hover:bg-ov-700 disabled:opacity-50"
          >
            {laeuft ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Bell aria-hidden="true" className="h-4 w-4" />}
            {aktiv ? "Themen speichern" : "Jetzt aktivieren"}
          </button>
          <p className={cn("mt-2 text-[12px] leading-relaxed", leise)}>
            Jederzeit abbestellbar. Details in der{" "}
            <a href="/datenschutz#push" className="underline underline-offset-2">
              Datenschutzerklärung
            </a>
            .
          </p>
        </fieldset>
      )}

      {meldung && (
        <p role="status" className={cn("mt-3 text-[13px] font-medium", dunkel ? "text-ov-300" : "text-ov-700")}>
          {meldung}
        </p>
      )}
    </div>
  );
}
