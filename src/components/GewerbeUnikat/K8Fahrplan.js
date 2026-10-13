// src/components/GewerbeUnikat/K8Fahrplan.js
//
// K8 · „Ablauf und Genehmigung: vom Lastgang zur laufenden Anlage – mit Ihrem Projektsteckbrief“ –
// SERVER-Hülle (Ton dunkel, Anker #fahrplan, data-kapitel="k8").
//
//  A · Fahrplan: sieben Stationen auf einer Linie (Client-Insel K8FahrplanLinie, Platzhalter = dieselbe Ansicht
//      im Startzustand). Abhängigkeits-Schloss an Station 6, Montagefenster an Station 5. Karten-Inhalte
//      kommen als Daten aus K8Daten.js (fahrplanDaten) und werden in K8FahrplanAnsicht.js gerendert.
//  B · Projektsteckbrief: Deckblatt aus allen Entscheidungen der Seite (Client-Insel K8Steckbrief).
//  Dazu: Einwände (kompakte <details>) und Rechtliches (voller Text, SEO) als Schubladen; die Karte
//  „Mieter der Halle?“ steht in Station 3 (Netzzugang braucht die Zustimmung des Grundeigentümers).
//
// Recht: keine Dauern, Fördercall nur als Kalenderfakt, Parkregler nur als PARKREGLER_SATZ, keine
// personenbezogenen Daten im Steckbrief, „Orientierung, keine Rechtsberatung“.

import Link from "next/link";
import pvgis from "@/data/regionen-pvgis.json";
import { REGIONEN } from "@/data/regionen";
import { einwaendeFuer } from "@/data/einwaende";
import { FOERDERCALL } from "@/lib/foerdercall";
import { NETZBEREICHE } from "@/lib/rechner/peakshaving";
import { DatenTabelle, KapitelBuehne, KapitelKopf, Kennzeichnung, QuellePille, Wissensschublade } from "./_bausteine";
import { KENNZEICHNUNG, QUELLE, STAND } from "./_tokens";
import { EINWAND_IDS, FENSTER, RECHT, SCHLOSS_TEXT, SPUREN, VERFAHREN, fahrplanDaten, steckbriefBeispiel } from "./K8Daten";
import K8Insel, { K8SteckbriefInsel } from "./K8Insel";

const linkKlasse = "font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200";

/** Namen je Ort-Kennung (nur die Orte mit PVGIS-Daten – dieselben wie in Kapitel 02). */
const ORTE = Object.fromEntries(Object.keys(pvgis.orte).map((id) => [id, REGIONEN[id]?.name ?? id]));
const BEREICHE = Object.fromEntries(NETZBEREICHE.map((b) => [b.id, b.label]));

function PlusMinus() {
  return (
    <span aria-hidden="true" className="relative h-3.5 w-3.5 shrink-0 text-ov-300">
      <span className="absolute left-0 top-1/2 h-[2px] w-3.5 -translate-y-1/2 rounded bg-current" />
      <span className="absolute left-1/2 top-0 h-3.5 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300 group-open/einwand:scale-y-0" />
    </span>
  );
}

export default function K8Fahrplan() {
  const inhalt = fahrplanDaten();
  const einwaende = einwaendeFuer("gewerbe", EINWAND_IDS);
  const beispiel = steckbriefBeispiel();

  return (
    <KapitelBuehne id="k8" anker="fahrplan" ton="dunkel">
      <KapitelKopf
        dunkel
        form="weg"
        nummer="08"
        frage="Geschäftsführung fragt: Was passiert wann – und was müssen wir beitragen?"
        titel="Ablauf und Genehmigung: vom Lastgang zur laufenden Anlage"
        lead="Sieben Stationen, eine Ansprechperson: was passiert, was Sie liefern und was wir übernehmen."
        rechts={
          <QuellePille dunkel className="mt-4 max-md:hidden">
            {KENNZEICHNUNG.keineBeratung} · {STAND.werte}
          </QuellePille>
        }
      />

      {/* A · Fahrplan */}
      <div id="k8-stationen" className="mt-10 scroll-mt-24 md:mt-14">
        <K8Insel stationen={inhalt.stationen} spuren={SPUREN} kalender={inhalt.kalender} montage={inhalt.montage} fenster={FENSTER} schlossText={SCHLOSS_TEXT} />
      </div>

      {/* Einwände (kompakt) und Rechtliches (voller Text) als Schubladen */}
      <div className="mt-10 grid gap-3 md:mt-16">
        <Wissensschublade dunkel titel="Einwände – und unsere Antworten">
          <div className="-mt-1">
            {einwaende.map((e) => (
              <details key={e.id} data-testid={`einwand-${e.id}`} className="group/einwand border-t border-white/[0.08] first:border-t-0">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[15px] font-semibold leading-snug text-white hover:text-white/90 [&::-webkit-details-marker]:hidden">
                  <span>{e.einwand}</span>
                  <PlusMinus />
                </summary>
                <div className="pb-5 text-[15px] leading-relaxed text-white/75">
                  <p className="max-w-[68ch]">{e.antwort}</p>
                  <p className="mt-2 text-[14px] text-white/60">
                    Beleg:{" "}
                    <Link href={e.belegHref} className="underline decoration-white/30 underline-offset-2 hover:text-white">
                      {e.beleg}
                    </Link>
                  </p>
                  <p className="mt-2 text-[14px]">
                    <Link href={e.schritt.href} className={linkKlasse}>
                      {e.schritt.label}
                    </Link>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Wissensschublade>

        <Wissensschublade dunkel titel="Genehmigung und Recht in Österreich">
        <div className="grid gap-8">
          <p className="max-w-[68ch]">
            Für eine Dachanlage im Betrieb sind in Österreich meist wenige Verfahren nötig – aber die richtigen, in der richtigen Reihenfolge. Entscheidend
            ist der Einspeisezählpunkt aus dem Netzzugang: Ohne ihn gibt es keinen EAG-Antrag, und ohne gestellten Antrag darf die Anlage nicht in Betrieb
            gehen, wenn sie gefördert werden soll.
          </p>
          <ul className="grid gap-x-10 gap-y-4 xl:grid-cols-2">
            {RECHT.map((r) => (
              <li key={r.titel} className="max-w-[68ch]">
                <strong className="font-semibold text-white">{r.titel}:</strong> {r.text}
                {r.link && (
                  <>
                    {" "}
                    Überblick unter{" "}
                    <Link href={r.link.href} className={linkKlasse}>
                      {r.link.label}
                    </Link>
                    .
                  </>
                )}
              </li>
            ))}
          </ul>
          <DatenTabelle
            dunkel
            caption={`Verfahren für eine gewerbliche Dachanlage in Österreich – Reihenfolge statt Dauer (${STAND.werte})`}
            spalten={[
              { key: "verfahren", label: "Verfahren" },
              { key: "wer", label: "Zuständig" },
              { key: "wann", label: "Zeitpunkt" },
              { key: "grundlage", label: "Grundlage" },
            ]}
            zeilen={VERFAHREN}
          />
          <p className="max-w-[68ch]">
            Ausführlich im Ratgeber{" "}
            <Link href="/ratgeber/photovoltaik-genehmigung" className={linkKlasse}>
              Photovoltaik-Genehmigung in Österreich
            </Link>{" "}
            und unter{" "}
            <Link href="/forderungen/richtlinien" className={linkKlasse}>
              Richtlinien &amp; Netzanschluss
            </Link>
            . Die Unterlagen für den Netzbetreiber stehen in der{" "}
            <Link href="/netzanmeldung/checkliste" className={linkKlasse}>
              Checkliste Netzanmeldung
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[QUELLE.elwg, { titel: "EAG-Förderabwicklungsstelle (OeMAG)", href: FOERDERCALL.abwicklungsstelle }].map((q) => (
              <QuellePille key={q.href} dunkel>
                <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                  {q.titel}
                </a>
              </QuellePille>
            ))}
            <QuellePille dunkel>Stand {STAND.geprueft}</QuellePille>
          </div>
          <p className="max-w-[68ch] text-[14px] text-white/60">
            Landesrecht, Förderbedingungen und Netzentgelte ändern sich regelmäßig; wir prüfen sie für Ihr Projekt.
          </p>
        </div>
        </Wissensschublade>
      </div>
      <Kennzeichnung dunkel className="mt-4">
        {KENNZEICHNUNG.keineBeratung} · {STAND.werte} · keine Dauern<span className="max-md:hidden"> – sie hängen von Netzbetreiber, Fördercall und Betrieb ab</span>
      </Kennzeichnung>

      {/* B · Projektsteckbrief */}
      <section
        id="projektsteckbrief"
        data-steckbrief
        data-testid="steckbrief"
        aria-labelledby="k8-steckbrief-titel"
        className="mt-12 scroll-mt-24 md:mt-24"
      >
        <div className="mx-auto max-w-[760px]">
          <h3 id="k8-steckbrief-titel" className="font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-white md:text-[34px]">
            Ihr Projektsteckbrief
          </h3>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-white/72 md:text-[15.5px]">
            Fertig ausgefüllt mit dem Beispielbetrieb – jede Entscheidung auf dieser Seite macht eine Zeile zu Ihrer.
            <span className="max-md:hidden"> Zahlen ändern Sie direkt im Blatt.</span>
          </p>
          <div className="mt-5 md:mt-10">
            <K8SteckbriefInsel orte={ORTE} bereiche={BEREICHE} beispiel={beispiel} />
          </div>
        </div>
      </section>
    </KapitelBuehne>
  );
}
