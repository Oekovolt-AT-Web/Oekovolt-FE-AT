import { CalendarCheck2, FileClock } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import PruefplanGenerator from "@/components/Technik/PruefplanGenerator";
import { Hinweis, Tabelle } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import QuellenKompakt from "@/components/ServiceAT/A/QuellenKompakt";
import { DATENBLATT, FREIGEGEBENE_WERTE, reglerBezeichnung } from "@/data/parkreglerDatenblatt";
import { PARKREGLER_RECHTE_GEKLAERT, PARKREGLER_SATZ } from "@/data/marke";

// /technik/parkregler/datenblatt (Paket B04) – Fachplaner-Datenblatt.
// Werte NUR aus src/data/parkreglerDatenblatt.js mit Freigabe (FREIGEGEBENE_WERTE). Solange nichts
// freigegeben ist: „Datenblatt in Vorbereitung“ + Inbetriebnahme-Prüfplan (Druck über Lead-Gate).

const PFAD = "/technik/parkregler/datenblatt";
const TITEL = "Parkregler-Datenblatt & Inbetriebnahme-Prüfplan | Ökovolt";
const BESCHREIBUNG =
  "Für Fachplaner: Funktionsumfang, Protokolle und Normbezug des Parkreglers nach TOR – plus Inbetriebnahme-Prüfplan mit Sollwertsprüngen, Q-Verfahren-Test und Rückfallwert.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  keywords: ["Parkregler Datenblatt", "Inbetriebnahme Parkregler Prüfplan", "TOR Typ B Konformitätsnachweis", "Sollwertsprung Prüfung", "Q(U) Prüfung"],
});

const QUELLEN = [
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, Version 1.4", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", hinweis: "Kap. 5.1.4, 5.3.3–5.3.4, 6.2" },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, Version 1.3", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", hinweis: "Kap. 5.1.4, 5.3.3–5.3.4, 5.4.1, 6.2, 8" },
  { titel: "Oesterreichs Energie: RKS-AT Typ B, Version 1.1", href: "https://oesterreichsenergie.at/fileadmin/user_upload/Oesterreichs_Energie/Publikationsdatenbank/Diverses/2022/RKS-AT_Typ_B_v1.1.pdf", hinweis: "Konformitätsnachweis" },
  { titel: "ÖVE/ÖNORM EN 62446-1", hinweis: "Prüfung, Dokumentation und Instandhaltung netzgekoppelter PV-Systeme" },
];

const frei = DATENBLATT.freigegeben === true && FREIGEGEBENE_WERTE.length > 0;

export default function ParkreglerDatenblattPage() {
  const bezeichnung = reglerBezeichnung(PARKREGLER_RECHTE_GEKLAERT);
  const schema = seitenSchema({ pfad: PFAD, name: "Parkregler-Datenblatt und Inbetriebnahme-Prüfplan", beschreibung: BESCHREIBUNG, stand: "2026-10-12" });

  return (
    <div>
      <JsonLd daten={schema} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Technik", href: "/technik" }, { name: "Parkregler", href: "/technik/parkregler" }, { name: "Datenblatt" }]}
        eyebrow="Für Fachplaner, Gutachter und Netzbetreiber"
        title={
          <>
            Parkregler-Datenblatt <span className="ov-text-gradient-light">und Inbetriebnahme-Prüfplan</span>
          </>
        }
        lead={`${PARKREGLER_SATZ} Hier stehen Funktionsumfang, Protokolle und Normbezug – sobald sie freigegeben sind – und ein Prüfplan für die Inbetriebnahme nach TOR.`}
        actions={[{ label: "Zum Prüfplan", href: "#pruefplan" }]}
        points={["Sollwertsprünge 100/60/30/0 %", "Q-Verfahren-Test", "Rückfallwert", "Druck nach E-Mail-Bestätigung"]}
      />

      <Section tone="white" space="md" id="datenblatt" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow={bezeichnung} title={frei ? "Funktionsumfang, Protokolle und Normbezug" : "Datenblatt in Vorbereitung"} />
          <p className="ov-lead text-ink-600 lg:pb-1">
            {frei
              ? `Freigegeben am ${DATENBLATT.freigegeben_am}. Werte gelten für den genannten Stand; verbindlich sind Projektunterlagen und Parameterauszug.`
              : "Die Produktwerte veröffentlichen wir, sobald sie mit unserem Technologiepartner abgestimmt und freigegeben sind. Bis dahin sehen Sie, welche Punkte das Datenblatt belegen wird – und können den Prüfplan nutzen."}
          </p>
        </div>

        {frei ? (
          <div className="grid gap-6">
            {DATENBLATT.gruppen.map((g) => {
              const zeilen = FREIGEGEBENE_WERTE.filter((z) => z.gruppe === g.id).map((z) => [z.merkmal, String(z.wert), z.torBezug]);
              if (!zeilen.length) return null;
              return <Tabelle key={g.id} caption={g.titel} kopf={["Merkmal", "Wert", "Bezug"]} zeilen={zeilen} kompakt minBreite={720} quelle={`Angaben Ökovolt Österreich · Stand ${DATENBLATT.stand}`} />;
            })}
          </div>
        ) : (
          <div className="grid gap-6">
            <Hinweis ton="info" titel="Was das Datenblatt belegen wird">
              <p>
                Die Liste zeigt den Anforderungsrahmen der TOR, nicht die Produktwerte. Projektbezogene Unterlagen (Signalliste, Parameterauszug) erhalten Planer und Netzbetreiber weiterhin im
                Projekt.
              </p>
            </Hinweis>
            <div className="grid gap-5 lg:grid-cols-3">
              {DATENBLATT.gruppen.map((g) => (
                <div key={g.id} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                  <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                    <FileClock aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    {g.titel}
                  </p>
                  <ul className="mt-4 grid gap-3">
                    {g.zeilen.map((z) => (
                      <li key={z.id} className="text-[14px] leading-relaxed">
                        <span className="font-semibold text-ink-800">{z.merkmal}</span>
                        <span className="mt-0.5 block text-[12.5px] text-ink-500">{z.torBezug} · Wert: in Vorbereitung</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section tone="sand" space="md" id="pruefplan-abschnitt" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Inbetriebnahme" title="Prüfplan für den Parkregler erstellen" />
          <p className="ov-lead text-ink-600 lg:pb-1">
            Aus Pmax, Q-Verfahren und Rückfallwert entsteht ein Prüfablauf nach den Standardwerten der TOR. Am Bildschirm frei; zum Drucken oder Speichern als PDF bestätigen Sie kurz Ihre E-Mail-Adresse.
          </p>
        </div>
        <PruefplanGenerator />
      </Section>

      <QuellenKompakt items={QUELLEN} stand="Oktober 2026" />

      <CtaBand
        eyebrow="Fachplaner-Paket"
        title="Sie planen eine Anlage mit Parkregler? Wir stimmen Signalliste und Prüfung mit Ihnen ab."
        text="Projektbezogen erhalten Sie Funktionsbeschreibung, Signalliste und Prüfprotokoll-Vorlagen – abgestimmt auf Ihren Netzbetreiber."
        primary={{ label: "Projekt besprechen", href: "/termin?art=video" }}
        secondary={{ label: "Zurück zum Parkregler", href: "/technik/parkregler", icon: CalendarCheck2 }}
      />
    </div>
  );
}
