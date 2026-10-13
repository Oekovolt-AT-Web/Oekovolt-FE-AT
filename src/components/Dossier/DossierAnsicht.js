"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Copy, Download, FileText, FolderOpen, Loader2, Lock, MapPin, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { DOSSIER_EREIGNIS, DOSSIER_MAX, dossierEntfernen, dossierLeeren, dossierLesen } from "@/lib/dossier/ablage";
import { HAFTUNG, STANDARD_EINGABEN, VARIANTEN, beispielRechnung, dossierRechnung, eingabenAlsUrl, eingabenLesen, gateKennung } from "@/lib/dossier/rechnung";
import { projektCashflow } from "@/lib/rechner/investition";
import DossierAuswertung from "./DossierAuswertung";
import DossierEingaben, { pdfHerunterladen } from "./DossierEingaben";
import LeadGateSchlank, { gateFreiGelesen, gateKontaktGelesen } from "./LeadGateSchlank";

/**
 * Business-Case-Dossier (/dossier) und Investitionsantrag (/rechner/investitionsantrag).
 *
 * Lead-Gate Stufe 2 (Inhaber-Regel 11.10.2026): Eingaben und die Liste der gesammelten
 * Ergebnisse sind frei; die Auswertung (Kapitalwert, Sensitivität, DSCR, Modellvergleich …)
 * startet erst nach bestätigter E-Mail. Davor nur eine klar gekennzeichnete Beispiel-Vorschau.
 * PDF ebenfalls erst danach (Server prüft das Freischalt-Cookie).
 *
 * modus: "dossier" (Varianten GF/CFO, Bank, Gemeinderat) | "antrag" (Gliederung Investitionsantrag,
 * Eingaben per URL aus den Gewerbe-Rechnern).
 */

/** Felder aus `eingaben` der Dossier-Einträge, die die Rechnung übernimmt (älteste zuerst, neueste gewinnt). */
const UEBERNEHMBAR = Object.keys(STANDARD_EINGABEN);

function eingabenAusEintraegen(eintraege) {
  const e = {};
  for (const x of [...eintraege].reverse()) {
    for (const [k, v] of Object.entries(x.eingaben || {})) if (UEBERNEHMBAR.includes(k) && (typeof v === "number" || typeof v === "boolean")) e[k] = v;
  }
  return e;
}

const QUELLEN_LINKS = [
  { href: "/standort-check", titel: "Standort-Check", text: "PVGIS-Ertrag, Schnee- und Windlast für Ihre Adresse" },
  { href: "/foerdercheck", titel: "Förder-Check", text: "Passende Bundes- und Landesprogramme mit Antragszeitpunkt" },
  { href: "/rechner/gewerbe-pv", titel: "Gewerbe-PV-Rechner", text: "Größe, Eigenverbrauch und Amortisation Ihres Hallendachs" },
  { href: "/service/finanzierung#modellvergleich", titel: "Modellvergleich", text: "Kauf, Kredit, Leasing, Contracting, PPA und Pacht neutral" },
];

export default function DossierAnsicht({ modus = "dossier" }) {
  const antrag = modus === "antrag";
  const [eintraege, setEintraege] = useState([]);
  const [geladen, setGeladen] = useState(false);
  const [variante, setVariante] = useState(antrag ? "investitionsantrag" : "cfo");
  const [eingaben, setEingaben] = useState(STANDARD_EINGABEN);
  const [frei, setFrei] = useState(false);
  const [kontakt, setKontakt] = useState(null);
  const [pdf, setPdf] = useState({ status: "bereit", text: "" });
  const [kopiert, setKopiert] = useState(false);
  const kennung = gateKennung(antrag ? "investitionsantrag" : "cfo");

  // Ablage lesen, Eingaben vorbelegen (Dossier: aus den Einträgen; Antrag: aus der URL)
  useEffect(() => {
    const liste = dossierLesen();
    setEintraege(liste);
    let start = { ...STANDARD_EINGABEN, ...eingabenAusEintraegen(liste) };
    if (antrag) {
      try {
        const p = Object.fromEntries(new URLSearchParams(window.location.search));
        if (Object.keys(p).length) start = { ...start, ...eingabenLesen(p, { ausUrl: true }) };
      } catch {
        /* ungültiger Link – Standardwerte */
      }
    }
    setEingaben(eingabenLesen(start));
    if (gateFreiGelesen(kennung)) {
      setFrei(true);
      setKontakt(gateKontaktGelesen());
    }
    setGeladen(true);
    const neu = () => setEintraege(dossierLesen());
    window.addEventListener(DOSSIER_EREIGNIS, neu);
    return () => window.removeEventListener(DOSSIER_EREIGNIS, neu);
  }, [antrag, kennung]);

  const rechnung = useMemo(() => (frei ? dossierRechnung(eingaben, { variante }) : null), [frei, eingaben, variante]);
  const beispiel = useMemo(() => (frei ? null : beispielRechnung(variante)), [frei, variante]);
  const richtwertInvestition = useMemo(() => projektCashflow({ kwp: eingaben.kwp }).anlagenpreis, [eingaben.kwp]);

  const aufFrei = useCallback(
    ({ kontakt: k } = {}) => {
      setFrei(true);
      setKontakt(k || gateKontaktGelesen());
      ereignis("dossier_auswertung", { modus, variante });
    },
    [modus, variante]
  );

  const herunterladen = async () => {
    setPdf({ status: "laeuft", text: "" });
    try {
      const name = await pdfHerunterladen({ variante, eingaben, eintraege, kontakt });
      setPdf({ status: "fertig", text: name });
    } catch (err) {
      const grund = String(err?.message || "");
      setPdf({
        status: "fehler",
        text: grund === "gate" ? "Die Freischaltung ist abgelaufen oder fehlt – bitte E-Mail-Bestätigung erneut anfordern." : grund === "zu_viele" ? "Zu viele PDFs in kurzer Zeit – bitte in einigen Minuten noch einmal." : "Das PDF konnte nicht erstellt werden. Bitte später noch einmal versuchen.",
      });
      if (grund === "gate") setFrei(false);
    }
  };

  const linkKopieren = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${eingabenAlsUrl(eingaben)}`);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const entfernen = (id) => setEintraege(dossierEntfernen(id));
  const leeren = () => setEintraege(dossierLeeren());
  const leer = geladen && eintraege.length === 0;

  return (
    <div className="space-y-6">
      {/* ================= Gesammelte Ergebnisse ================= */}
      {!antrag && (
        <section aria-labelledby="sammlung-titel" className="rounded-3xl bg-white p-5 shadow-[0_24px_60px_-28px_rgba(3,18,43,0.35)] ring-1 ring-ink-200/70 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Schritt 1 · Ergebnisse sammeln</p>
              <h2 id="sammlung-titel" className="mt-1 font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">
                Ihre gesammelten Ergebnisse {geladen && <span className="ov-num text-ink-500">({eintraege.length}/{DOSSIER_MAX})</span>}
              </h2>
            </div>
            {eintraege.length > 0 && (
              <button type="button" onClick={leeren} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold text-ink-600 hover:bg-ink-50 hover:text-ink-900">
                <Trash2 aria-hidden="true" className="h-4 w-4" /> Alle entfernen
              </button>
            )}
          </div>

          {!geladen && (
            <p className="mt-5 inline-flex items-center gap-2 text-[14px] text-ink-500">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Dossier wird geladen …
            </p>
          )}

          {leer && (
            <div className="mt-5 rounded-2xl bg-sand-50 p-5 md:p-6">
              <p className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                <FolderOpen aria-hidden="true" className="h-5 w-5 text-ov-600" /> Noch leer – so füllen Sie Ihr Dossier
              </p>
              <ol className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  { t: "Werkzeug öffnen", x: "Standort-Check, Förder-Check, Gewerbe-PV-Rechner oder Modellvergleich durchrechnen." },
                  { t: "„Zum Dossier hinzufügen“", x: "Unter dem Ergebnis legt der Knopf die Kennzahlen hier ab – höchstens zehn, nur in diesem Browser-Tab." },
                  { t: "Variante wählen", x: "Für Geschäftsführung, Bank oder Gemeinderat aufbereiten – Auswertung und PDF nach E-Mail-Bestätigung." },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-display text-[13px] font-extrabold text-ov-600 ring-1 ring-ov-200">{i + 1}</span>
                    <span>
                      <span className="block font-semibold text-ink-900">{s.t}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-relaxed text-ink-600">{s.x}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {QUELLEN_LINKS.map((q) => (
                  <li key={q.href}>
                    <Link href={q.href} className="group flex h-full items-start justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 transition-colors hover:bg-ov-50/40">
                      <span>
                        <span className="block font-semibold text-ink-900">{q.titel}</span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-ink-600">{q.text}</span>
                      </span>
                      <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-relaxed text-ink-500">Ohne gesammelte Ergebnisse rechnet das Dossier mit den Eingaben unten (Richtwerte, änderbar).</p>
            </div>
          )}

          {eintraege.length > 0 && (
            <ul className="mt-5 grid gap-4 lg:grid-cols-2">
              {eintraege.map((x) => (
                <li key={x.id} className="flex flex-col rounded-2xl bg-sand-50 p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-ink-900">{x.titel}</p>
                      <p className="mt-0.5 text-[12.5px] text-ink-500">
                        <Link href={x.quelle} className="font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
                          {x.quelle}
                        </Link>
                        {x.stand ? ` · Stand ${x.stand}` : ""}
                      </p>
                    </div>
                    <button type="button" onClick={() => entfernen(x.id)} aria-label={`${x.titel} aus dem Dossier entfernen`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-white hover:text-ink-900">
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                  {x.kennzahlen.length > 0 && (
                    <dl className="mt-3 grid grid-cols-2 gap-2">
                      {x.kennzahlen.slice(0, 6).map((k) => (
                        <div key={k.label} className="rounded-xl bg-white p-2.5">
                          <dt className="text-[11.5px] leading-snug text-ink-500">{k.label}</dt>
                          <dd className="ov-num mt-0.5 text-[15px] font-bold text-ink-900">
                            {k.wert}
                            {k.einheit ? ` ${k.einheit}` : ""}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {x.annahmen.length > 0 && (
                    <details className="mt-3 text-[13px] text-ink-600">
                      <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-ink-700">Annahmen ({x.annahmen.length})</summary>
                      <ul className="mt-2 space-y-1">
                        {x.annahmen.map((a, i) => (
                          <li key={i}>{Array.isArray(a) ? `${a[0]}: ${a[1]}` : a}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">Die Ablage bleibt in diesem Browser-Tab (sessionStorage) und wird erst beim PDF-Export an unseren Server geschickt.</p>
        </section>
      )}

      {/* ================= Variante + Eingaben ================= */}
      <section aria-labelledby="eingaben-titel" className={cn("rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-8", antrag && "shadow-[0_24px_60px_-28px_rgba(3,18,43,0.35)]")}>
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{antrag ? "Schritt 1 · Eingaben" : "Schritt 2 · Variante und Eingaben"}</p>
        <h2 id="eingaben-titel" className="mt-1 font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">
          {antrag ? "Eckdaten der Investition" : "Für wen ist das Dossier?"}
        </h2>
        {!antrag && (
          <div role="group" aria-label="Variante des Dossiers" className="mt-4 grid gap-2 sm:grid-cols-3">
            {VARIANTEN.filter((v) => v.id !== "investitionsantrag").map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={variante === v.id}
                onClick={() => setVariante(v.id)}
                className={cn("rounded-2xl p-4 text-left transition-colors", variante === v.id ? "bg-navy-950 text-white" : "bg-sand-50 text-ink-900 hover:bg-ink-100/70")}
              >
                <span className="block font-semibold">{v.label}</span>
                <span className={cn("mt-1 block text-[13px] leading-snug", variante === v.id ? "text-white/75" : "text-ink-600")}>{v.text}</span>
              </button>
            ))}
          </div>
        )}
        {antrag && <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">{VARIANTEN.find((v) => v.id === "investitionsantrag").text} Werte aus dem Gewerbe-PV-Rechner kommen per Link mit; alles bleibt änderbar.</p>}
        <div className="mt-6">
          <DossierEingaben e={eingaben} onChange={(e) => setEingaben(eingabenLesen(e))} mitCo2={antrag} richtwertInvestition={richtwertInvestition} />
        </div>
        {antrag && (
          <button type="button" onClick={linkKopieren} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-100/80 px-4 text-[13.5px] font-semibold text-ink-800 hover:bg-ink-100">
            {kopiert ? <Check aria-hidden="true" className="h-4 w-4 text-ov-600" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            {kopiert ? "Link kopiert" : "Link mit diesen Eingaben kopieren"}
          </button>
        )}
      </section>

      {/* ================= Auswertung (Stufe 2) ================= */}
      {frei && rechnung ? (
        <section aria-labelledby="auswertung-titel" className="space-y-5">
          <div className="flex flex-col gap-4 rounded-3xl bg-navy-950 p-5 text-white md:flex-row md:items-center md:justify-between md:p-7">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">{antrag ? "Schritt 2 · Ihr Investitionsantrag" : "Schritt 3 · Ihre Auswertung"}</p>
              <h2 id="auswertung-titel" className="mt-1 font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
                {VARIANTEN.find((v) => v.id === variante)?.label}
              </h2>
              <p className="mt-1 text-[13.5px] text-white/70">
                {kontakt?.name ? `Für ${kontakt.name}${kontakt.firma ? `, ${kontakt.firma}` : ""} · ` : ""}Stand {rechnung.stand.label} · Richtwerte/Orientierung
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <button type="button" onClick={herunterladen} disabled={pdf.status === "laeuft"} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:opacity-60">
                {pdf.status === "laeuft" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Download aria-hidden="true" className="h-4 w-4" />}
                PDF herunterladen
              </button>
              <p className="text-[12.5px] text-white/70" aria-live="polite">
                {pdf.status === "fertig" ? `Gespeichert: ${pdf.text}` : pdf.status === "fehler" ? pdf.text : "Mit Dokumenttitel, Stand und Haftungshinweis"}
              </p>
            </div>
          </div>
          <DossierAuswertung rechnung={rechnung} />
          {!antrag && (
            <p className="flex flex-wrap items-center gap-2 text-[14px] text-ink-600">
              <FileText aria-hidden="true" className="h-4 w-4 text-ov-600" /> Für den formalen Beschluss:{" "}
              <Link href={eingabenAlsUrl(eingaben)} className="font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
                Investitionsantrag mit diesen Eingaben öffnen
              </Link>
            </p>
          )}
        </section>
      ) : (
        <section aria-labelledby="vorschau-titel" className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
          <div className="min-w-0 xl:sticky xl:top-24">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{antrag ? "Schritt 2 · Auswertung freischalten" : "Schritt 3 · Auswertung freischalten"}</p>
            <h2 id="vorschau-titel" className="mt-1 font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">
              Ihre Auswertung startet nach der E-Mail-Bestätigung
            </h2>
            <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-ink-700">
              {(antrag
                ? ["Entscheidungsvorlage mit Kapitalwert, IRR und Amortisation", "Annahmen mit Quelle und Stand", "Cashflow über 25 Jahre", "Risiken und Sensitivität (Tornado)", "CO₂-Textbaustein mit Berichtsjahr", "Nächste Schritte und PDF"]
                : ["Kapitalwert, IRR, Amortisation und Cashflow über 25 Jahre", "Sensitivität: Strompreis ±30 %, Eigenverbrauch ±10 Pp., Investition ±15 %, Degradation", "DSCR und Unterlagenliste für die Bank", "Modellvergleich und Vergabehinweise", "PDF mit Dokumenttitel und Stand"]
              ).map((t) => (
                <li key={t} className="flex gap-2">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                  {t}
                </li>
              ))}
            </ul>
            <LeadGateSchlank
              className="mt-5"
              aktion="auswertung"
              kennung={kennung}
              onFrei={aufFrei}
              segment="gewerbe"
              kennzahlen={{ variante, kwp: eingaben.kwp, eintraege: eintraege.length }}
              titel={antrag ? "Investitionsantrag freischalten" : "Dossier-Auswertung freischalten"}
              text="Die Auswertung rechnen wir mit Ihren Eingaben. Dafür brauchen wir Ihren Namen und eine E-Mail-Adresse; nach dem Klick auf den Bestätigungslink erscheint sie hier, danach auch als PDF."
            />
          </div>
          <div className="relative min-w-0">
            <p className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold text-ink-700">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-sun-500" /> So sieht die Auswertung aus – Beispiel mit Beispielwerten
            </p>
            <div className="relative max-h-[1100px] overflow-hidden rounded-3xl" aria-label="Beispiel-Vorschau, nicht Ihre Auswertung">
              {beispiel && <DossierAuswertung rechnung={beispiel} beispiel kompakt />}
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-sand-50 via-sand-50/90 to-transparent" />
              <p className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2 text-[14px] font-semibold text-ink-700">
                <Lock aria-hidden="true" className="h-4 w-4" /> Ihre eigene Auswertung nach der Bestätigung
              </p>
            </div>
          </div>
        </section>
      )}

      <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
        {antrag ? <ClipboardList aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> : <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />}
        <span>{HAFTUNG}</span>
      </p>
    </div>
  );
}
