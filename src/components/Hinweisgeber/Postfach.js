"use client";

import { useState } from "react";
import { KeyRound, Loader2, LogOut, Lock, Send, ShieldCheck } from "lucide-react";

const STATUS_TEXT = {
  Eingegangen: "Ihre Meldung ist eingegangen und wartet auf die Eingangsbestätigung.",
  "Eingang bestätigt": "Die Meldestelle hat den Eingang bestätigt.",
  "In Prüfung": "Die Meldestelle prüft den Sachverhalt.",
  Folgemaßnahmen: "Es werden Folgemaßnahmen ergriffen.",
  Abgeschlossen: "Das Verfahren ist abgeschlossen.",
};
const STATUS_REIHE = ["Eingegangen", "Eingang bestätigt", "In Prüfung", "Folgemaßnahmen", "Abgeschlossen"];

const fmt = (t) => {
  if (!t) return "";
  const d = new Date(String(t).replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? String(t) : d.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
};

/**
 * Anonymes Postfach: Anmeldung mit Fall-Nummer + Zugangsschlüssel.
 * Zugangsdaten bleiben ausschließlich im Arbeitsspeicher der Seite – kein
 * localStorage, kein Cookie. Nach dem Schließen des Tabs ist man abgemeldet.
 */
export default function Postfach() {
  const [zugang, setZugang] = useState({ referenz: "", schluessel: "" });
  const [fall, setFall] = useState(null);
  const [laden, setLaden] = useState(false);
  const [meldung, setMeldung] = useState(null);
  const [antwort, setAntwort] = useState("");
  const [senden, setSenden] = useState(false);

  const anfrage = async (body) => {
    const res = await fetch("/api/hinweis/postfach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = new Error(json.fehler || "fehler");
      e.code = json.fehler;
      throw e;
    }
    return json;
  };

  const anmelden = async (ev) => {
    ev.preventDefault();
    setLaden(true);
    setMeldung(null);
    try {
      setFall(await anfrage({ aktion: "abrufen", ...zugang }));
    } catch (e) {
      setMeldung(e.code === "zugang" ? "Fall-Nummer oder Zugangsschlüssel stimmen nicht." : e.code === "zu_viele" ? "Zu viele Versuche. Bitte warten Sie einige Minuten." : "Das Postfach ist gerade nicht erreichbar. Bitte versuchen Sie es später erneut.");
    } finally {
      setLaden(false);
    }
  };

  const schicken = async (ev) => {
    ev.preventDefault();
    if (antwort.trim().length < 2) return;
    setSenden(true);
    try {
      setFall(await anfrage({ aktion: "antworten", ...zugang, nachricht: antwort }));
      setAntwort("");
    } catch {
      setMeldung("Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.");
    } finally {
      setSenden(false);
    }
  };

  const abmelden = () => {
    setFall(null);
    setZugang({ referenz: "", schluessel: "" });
    setAntwort("");
    setMeldung(null);
  };

  if (!fall) {
    return (
      <form onSubmit={anmelden} className="mx-auto max-w-xl overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70 md:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-950 text-ov-300">
          <KeyRound aria-hidden="true" className="h-6 w-6" />
        </span>
        <h2 className="ov-h3 mt-5 text-ink-900">Postfach öffnen</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-500">Geben Sie die Fall-Nummer und den Zugangsschlüssel ein, die Sie nach Ihrer Meldung erhalten haben.</p>
        <div className="mt-7 grid gap-4">
          <div>
            <label htmlFor="pf-ref" className="mb-1.5 block text-[14px] font-semibold text-ink-800">Fall-Nummer</label>
            <input id="pf-ref" value={zugang.referenz} onChange={(e) => setZugang((z) => ({ ...z, referenz: e.target.value.toUpperCase() }))} placeholder="HW-XXXX-XXXX" autoComplete="off" spellCheck={false}
              className="h-12 w-full rounded-xl border-2 border-ink-200 px-4 font-mono text-[16px] tracking-wider text-ink-900 outline-none focus:border-ov-500" />
          </div>
          <div>
            <label htmlFor="pf-key" className="mb-1.5 block text-[14px] font-semibold text-ink-800">Zugangsschlüssel</label>
            <input id="pf-key" type="password" value={zugang.schluessel} onChange={(e) => setZugang((z) => ({ ...z, schluessel: e.target.value.trim() }))} autoComplete="off" spellCheck={false}
              className="h-12 w-full rounded-xl border-2 border-ink-200 px-4 font-mono text-[16px] text-ink-900 outline-none focus:border-ov-500" />
          </div>
        </div>
        {meldung && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[14px] text-red-800">{meldung}</p>}
        <button type="submit" disabled={laden || !zugang.referenz || !zugang.schluessel} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-500 text-[15px] font-semibold text-white hover:bg-ov-600 disabled:opacity-60">
          {laden ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Lock aria-hidden="true" className="h-4 w-4" />}
          Sicher anmelden
        </button>
        <p className="mt-4 text-center text-[12.5px] text-ink-400">Ihre Zugangsdaten werden nicht im Browser gespeichert.</p>
      </form>
    );
  }

  const stufe = Math.max(0, STATUS_REIHE.indexOf(fall.status));

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-[2rem] bg-navy-950 p-6 text-white lg:sticky lg:top-28">
        <p className="text-[12.5px] text-white/55">Fall-Nummer</p>
        <p className="mt-1 font-mono text-[20px] font-bold tracking-wider">{fall.referenz}</p>
        <p className="mt-1 text-[13px] text-white/55">gemeldet am {fmt(fall.eingegangen_am)}</p>
        <ol className="mt-7 space-y-3.5">
          {STATUS_REIHE.map((s, i) => (
            <li key={s} className="flex items-center gap-3 text-[14px]">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${i <= stufe ? "bg-ov-500 text-white" : "bg-white/10 text-white/40"}`}>{i + 1}</span>
              <span className={i <= stufe ? "text-white" : "text-white/40"}>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-2xl bg-white/[0.06] p-4 text-[13.5px] leading-relaxed text-white/75">{STATUS_TEXT[fall.status] || fall.status}</p>
        <button type="button" onClick={abmelden} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold ring-1 ring-white/20 hover:bg-white/10">
          <LogOut aria-hidden="true" className="h-4 w-4" /> Abmelden
        </button>
      </aside>

      <section className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
        <div className="border-b border-ink-100 px-6 py-5 md:px-8">
          <h2 className="ov-h3 text-ink-900">Nachrichten</h2>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-500"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" /> Vertraulich zwischen Ihnen und der Meldestelle</p>
        </div>
        <ul className="space-y-4 px-6 py-6 md:px-8">
          {(fall.nachrichten || []).length === 0 && (
            <li className="rounded-2xl bg-sand-50 p-5 text-[14.5px] text-ink-500">Noch keine Nachrichten. Die Meldestelle meldet sich hier.</li>
          )}
          {(fall.nachrichten || []).map((n, i) => {
            const eigene = n.absender === "Meldende Person";
            return (
              <li key={i} className={`flex ${eigene ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-3xl px-5 py-4 ${eigene ? "rounded-br-lg bg-ov-500 text-white" : "rounded-bl-lg bg-ink-100 text-ink-900"}`}>
                  <p className={`text-[12px] font-semibold ${eigene ? "text-white/75" : "text-ink-500"}`}>{eigene ? "Sie" : "Meldestelle"} · {fmt(n.zeitpunkt)}</p>
                  <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed">{n.nachricht}</p>
                </div>
              </li>
            );
          })}
        </ul>
        {fall.status !== "Abgeschlossen" && (
          <form onSubmit={schicken} className="border-t border-ink-100 bg-ink-50/60 p-5 md:p-6">
            <label htmlFor="pf-antwort" className="sr-only">Nachricht an die Meldestelle</label>
            <textarea id="pf-antwort" rows={4} maxLength={10000} value={antwort} onChange={(e) => setAntwort(e.target.value)} placeholder="Nachricht an die Meldestelle …"
              className="w-full rounded-2xl border-2 border-ink-200 bg-white px-4 py-3 text-[16px] text-ink-900 outline-none focus:border-ov-500" />
            {meldung && <p role="alert" className="mt-2 text-[13.5px] text-red-700">{meldung}</p>}
            <div className="mt-3 flex justify-end">
              <button type="submit" disabled={senden || antwort.trim().length < 2} className="inline-flex h-11 items-center gap-2 rounded-full bg-ov-500 px-6 text-[14.5px] font-semibold text-white hover:bg-ov-600 disabled:opacity-60">
                {senden ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Send aria-hidden="true" className="h-4 w-4" />}
                Senden
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
