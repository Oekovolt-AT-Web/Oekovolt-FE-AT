"use client";

// src/components/Verkauf/KostenDesWartens.js
//
// „Was Warten kostet – nüchtern gerechnet.“ (Welle A, Paket A03)
// Drei Zeilen: (a) nicht gesparte Stromkosten je Monat aus den Eingaben, (b) Öko-IFB-Differenz
// 22 % → 15 % bis 31.12.2026 (nur bei Betrieben, mit 1-Mio.-Deckel und Rechtsform-Hinweis),
// (c) Status des EAG-Fördercalls – als ruhiger Satz, ohne Countdown und ohne Blinken.
// Beim ersten Sichtbarwerden: ereignis("kosten_warten_gesehen").
//
// Props: { ersparnisJahr, investitionNetto, rechtsform = "kapitalgesellschaft",
//          quelle = "eingaben" | "beispiel", beispielText?, rahmen? }
// quelle="beispiel": Werte stammen aus einem Rechenbeispiel der Seite, nicht aus Eingaben des
// Besuchers – der Text sagt dann „im Rechenbeispiel …“ statt „aus Ihren Eingaben“/„bei Ihrer
// Investition“ (keine Scheinpersonalisierung). rahmen (true oder Ton von <Section>): eigener
// Seitenabschnitt mit ov-container – für Seiten, die die Karte nicht selbst in eine Section setzen.
// Ohne gültige ersparnisJahr UND ohne gültige Investition: null.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { IFB, RECHTSFORMEN, datumText, frist, ifbSteuerwirkung, istIfbAktiv, monatsErsparnis } from "@/data/fristen";
import { FOERDERCALL, callPhase } from "@/lib/foerdercall";
import { zahlText } from "@/data/kennzahlen";
import { ereignis } from "@/lib/statistik";
import { cn } from "@/components/ui/cn";
import Section from "@/components/ui/Section";

const CALL_TEXTE = {
  vor: `EAG-Fördercall ${FOERDERCALL.nr}/${FOERDERCALL.jahr}: Ticketziehung ab 08.10.2026, 17 Uhr – Unterlagen jetzt vorbereiten.`,
  ticket: `EAG-Fördercall ${FOERDERCALL.nr}/${FOERDERCALL.jahr} läuft: Ticketziehung offen, Antragseinreichung ab 09.10.2026, 8 Uhr.`,
  einreichung: `EAG-Fördercall ${FOERDERCALL.nr}/${FOERDERCALL.jahr} läuft: Anträge bis 22.10.2026, 23:59 Uhr.`,
  nach: `Der ${FOERDERCALL.nr}. EAG-Fördercall ${FOERDERCALL.jahr} ist geschlossen; den nächsten Termin veröffentlicht die EAG-Abwicklungsstelle – wir bereiten Ihr Projekt schon jetzt vor.`,
};

// Geschütztes Leerzeichen zwischen Zahl und €, damit „1.000.000 €“ nicht umbricht.
const euro = (n) => `${zahlText(Math.round(n))}\u00a0€`;

export default function KostenDesWartens({
  ersparnisJahr,
  investitionNetto,
  rechtsform = "kapitalgesellschaft",
  quelle = "eingaben",
  beispielText = "im Rechenbeispiel dieser Seite",
  rahmen,
  className,
}) {
  const [form, setForm] = useState(RECHTSFORMEN.some((r) => r.id === rechtsform) ? rechtsform : "kapitalgesellschaft");
  const [grenzsteuersatz, setGrenzsteuersatz] = useState(IFB.grenzsteuersatzStandard);
  // Datum erst nach dem Mounten prüfen – Server und erster Client-Render sind damit identisch.
  const [ifbAktiv, setIfbAktiv] = useState(true);
  const [phase, setPhase] = useState(null);
  const wurzel = useRef(null);
  const gemeldet = useRef(false);

  useEffect(() => {
    setIfbAktiv(istIfbAktiv(Date.now()));
    setPhase(callPhase(Date.now()));
  }, []);

  useEffect(() => {
    const el = wurzel.current;
    if (!el || gemeldet.current) return undefined;
    const melden = () => {
      if (gemeldet.current) return;
      gemeldet.current = true;
      ereignis("kosten_warten_gesehen", { rechtsform: form });
    };
    if (typeof IntersectionObserver === "undefined") {
      melden();
      return undefined;
    }
    const io = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          melden();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
    // nur einmal beim Mounten beobachten
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monat = monatsErsparnis(ersparnisJahr);
  const inv = Number(investitionNetto);
  const hatInvestition = Number.isFinite(inv) && inv > 0;
  if (!monat && !hatInvestition) return null;

  const ifb = frist("ifb");
  const zeigeIfb = ifbAktiv && hatInvestition && ifb;
  const wirkung = zeigeIfb ? ifbSteuerwirkung(inv, { rechtsform: form, grenzsteuersatz }) : null;
  const istKapGes = form === "kapitalgesellschaft";
  const ausBeispiel = quelle === "beispiel";

  const karte = (
    <section ref={wurzel} id="kosten-des-wartens" aria-labelledby="kosten-des-wartens-titel" className={cn("rounded-3xl bg-navy-950 p-6 text-white ring-1 ring-white/10 md:p-8", className)}>
      <h2 id="kosten-des-wartens-titel" className="font-display text-[22px] font-extrabold leading-tight tracking-tight md:text-[26px]">
        Was Warten kostet – nüchtern gerechnet.
      </h2>

      <ol className="mt-5 space-y-4 text-[15px] leading-relaxed text-white/80">
        {monat > 0 && (
          <li className="flex gap-3">
            <span aria-hidden="true" className="ov-num mt-0.5 w-5 shrink-0 font-display text-[13px] font-bold text-ov-300">a</span>
            <span>
              Jeder Monat ohne Anlage: ca. <strong className="ov-num text-white">{euro(monat)}</strong> nicht gesparte Stromkosten{ausBeispiel ? ` – ${beispielText}, Richtwert.` : " (aus Ihren Eingaben, Richtwert)."}
            </span>
          </li>
        )}

        {zeigeIfb && (
          <li className="flex gap-3">
            <span aria-hidden="true" className="ov-num mt-0.5 w-5 shrink-0 font-display text-[13px] font-bold text-ov-300">b</span>
            <div className="min-w-0 flex-1">
              <p>
                Öko-IFB {IFB.satzBis}&nbsp;% für Wirtschaftsgüter, die bis {datumText(ifb.ende)} angeschafft bzw. fertiggestellt werden (maßgeblich ist die Übergabe, nicht die Bestellung), danach {String(ifb.danach).replace(" ", " ")} – Differenz{" "}
                {ausBeispiel ? beispielText : "bei Ihrer Investition"}: ca. <strong className="ov-num text-white">{euro(wirkung.wirkung)}</strong> Steuerwirkung
                {istKapGes ? ` (KöSt ${IFB.koest} %)` : ` bei ${wirkung.satz} % – abhängig vom Grenzsteuersatz`}.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Rechtsform für die IFB-Rechnung">
                {RECHTSFORMEN.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={form === r.id}
                    onClick={() => setForm(r.id)}
                    className={cn(
                      "min-h-11 rounded-full px-3.5 text-[13.5px] font-semibold ring-1 ring-inset transition-colors",
                      form === r.id ? "bg-white text-navy-950 ring-white" : "bg-white/5 text-white/80 ring-white/25 hover:bg-white/10"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
                {!istKapGes && (
                  <label className="inline-flex min-h-11 items-center gap-2 text-[13.5px] text-white/80">
                    Grenzsteuersatz
                    <select
                      value={grenzsteuersatz}
                      onChange={(e) => setGrenzsteuersatz(Number(e.target.value))}
                      className="h-11 rounded-full bg-white/10 px-3 text-[13.5px] font-semibold text-white ring-1 ring-inset ring-white/25"
                    >
                      {IFB.grenzsteuersaetze.map((s) => (
                        <option key={s} value={s} className="text-ink-900">
                          {s} %
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>

              <ul className="mt-3 list-disc space-y-1 pl-5 text-[13.5px] text-white/70">
                <li>Bemessungsgrundlage höchstens {euro(IFB.deckel)} je Wirtschaftsjahr{wirkung.gedeckelt ? ` – ${ausBeispiel ? beispielText : "bei Ihrer Investition"} greift der Deckel` : ""}.</li>
                <li>Nicht bei pauschalierter Gewinnermittlung.</li>
              </ul>
              <p className="mt-3 text-[13.5px] text-white/70">
                Ein Gewerbeprojekt braucht von Anfrage bis Inbetriebnahme meist mehrere Monate; ob 2026 noch erreichbar ist, klären wir im Erstgespräch – darauf verlassen sollten Sie sich nicht. Die
                steuerliche Zuordnung klären Sie mit Ihrer Steuerberatung.{" "}
                <a href={ifb.quelle} target="_blank" rel="noopener noreferrer" className="underline decoration-ov-300/60 underline-offset-2 hover:text-white">
                  Quelle: WKO, Stand {datumText(ifb.stand)}
                </a>
              </p>
            </div>
          </li>
        )}

        {phase && (
          <li className="flex gap-3">
            <span aria-hidden="true" className="ov-num mt-0.5 w-5 shrink-0 font-display text-[13px] font-bold text-ov-300">{zeigeIfb ? "c" : "b"}</span>
            <span>
              {CALL_TEXTE[phase]}{" "}
              <Link href="/forderungen/eag-foerdercall" className="inline-flex items-center gap-1 font-semibold text-ov-300 underline-offset-2 hover:underline">
                Zum Fördercall
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </span>
          </li>
        )}
      </ol>
    </section>
  );

  if (!rahmen) return karte;
  return (
    <Section as="div" tone={typeof rahmen === "string" ? rahmen : "white"} space="md">
      {karte}
    </Section>
  );
}
