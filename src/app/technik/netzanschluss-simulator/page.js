import { CalendarCheck2, Gauge, Scale } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import NetzanschlussSimulator from "@/components/Technik/NetzanschlussSimulator";
import { Hinweis, Punkte } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import QuellenKompakt from "@/components/ServiceAT/A/QuellenKompakt";

// /technik/netzanschluss-simulator (Paket B04) – vereinfachte Vorabschätzung der Spannungsänderung
// am Verknüpfungspunkt nach TOR D2. Ergebnis am Bildschirm frei (Lead-Gate-Regel Stufe 1, kein Export).

const PFAD = "/technik/netzanschluss-simulator";
const TITEL = "Netzanschluss-Simulator: Spannungsänderung nach TOR D2 | Ökovolt";
const BESCHREIBUNG =
  "Spannungsänderung Ihrer PV-Anlage am Verknüpfungspunkt vorab abschätzen: Δu ≈ S·cos(ψ+φ)/Sk, Ampel gegen 3 % (NS) bzw. 2 % (MS) nach TOR D2 und nötiger cos φ.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  keywords: ["Netzanschluss PV Österreich", "Spannungsänderung TOR D2", "Netzverträglichkeit Photovoltaik", "Kurzschlussleistung Verknüpfungspunkt", "cos phi Blindleistung PV", "Netzrückwirkungen"],
});

const QUELLEN = [
  { titel: "E-Control: Technische und Organisatorische Regeln (TOR), Übersicht", href: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", hinweis: "TOR D2 – Richtlinie zur Beurteilung von Netzrückwirkungen (Spannungsänderung NS 3 %, MS 2 %)" },
  {
    titel: "Swiss Economics / IAEW (RWTH Aachen) für die E-Control: Beurteilung des Netzanschlusses und der Netzanschlusskapazitäten in Österreich, Kurzbericht 2022",
    href: "https://www.e-control.at/documents/1785851/1811582/2022_SE_IAEW_Kurzbericht_E_Control_Netzanschlusskapazitaeten.pdf/",
    hinweis: "Vergleich der Netzanschlussprüfung von neun Verteilernetzbetreibern",
  },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, Version 1.4", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", hinweis: "Blindleistung cos φ 0,9" },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, Version 1.3", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", hinweis: "Blindleistungsbereich II, cos φ 0,925" },
  { titel: "D-A-CH-CZ: Technische Regeln zur Beurteilung von Netzrückwirkungen", hinweis: "Grundlage der TOR D2" },
];

export default function NetzanschlussSimulatorPage() {
  const schema = seitenSchema({
    pfad: PFAD,
    name: "Netzanschluss-Simulator: Spannungsänderung am Verknüpfungspunkt",
    beschreibung: BESCHREIBUNG,
    stand: "2026-10-12",
  });

  return (
    <div>
      <JsonLd daten={schema} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Technik", href: "/technik" }, { name: "Parkregler", href: "/technik/parkregler" }, { name: "Netzanschluss-Simulator" }]}
        eyebrow="Werkzeug für Planer und Betreiber"
        title={
          <>
            Netzanschluss-Simulator – <span className="ov-text-gradient-light">Spannungsänderung vorab abschätzen</span>
          </>
        }
        lead="Wie stark hebt Ihre PV-Anlage die Spannung am Verknüpfungspunkt an – und reicht cos φ = 1 oder braucht es Blindleistung? Eine vereinfachte Vorabschätzung nach TOR D2, verbindlich prüft der Netzbetreiber."
        actions={[
          { label: "Zum Simulator", href: "#simulator", icon: Gauge },
          { label: "Typ-Finder", href: "/technik/parkregler#anlagentypen", icon: Scale },
        ]}
        points={["Δu ≈ S·cos(ψ+φ)/Sk", "Ampel 3 % NS · 2 % MS", "Nötiger cos φ", "Zeigerdiagramm mit Textalternative"]}
      />

      <Section tone="sand" space="md" id="simulator" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Interaktiv" title="Spannungsänderung am Verknüpfungspunkt" />
          <p className="ov-lead text-ink-600 lg:pb-1">
            Kurzschlussleistung S<sub>k</sub> und Netzimpedanzwinkel ψ stehen im Anschlusskonzept oder kommen auf Anfrage vom Netzbetreiber. Die Beispielwerte sind neutral gewählt und als
            Beispielbereich gekennzeichnet.
          </p>
        </div>
        <NetzanschlussSimulator />
      </Section>

      <Section tone="white" space="md" id="so-rechnet-der-simulator" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Rechenweg" title="So rechnet der Simulator – und was er nicht kann" />
          <p className="ov-lead text-ink-600 lg:pb-1">Eine Formel, drei Eingaben vom Netzbetreiber, eine Grenze. Mehr ist es für die Vorabschätzung nicht – die Prüfung des Netzbetreibers geht deutlich weiter.</p>
        </div>
        <Punkte
          spalten={3}
          items={[
            { titel: "Spannungsänderung", tag: "TOR D2", text: "Δu ≈ S_A / S_kV · cos(ψ_kV + φ). Untererregter Betrieb (φ positiv) verkleinert den Kosinus und damit die Spannungsanhebung; übererregter Betrieb vergrößert sie." },
            { titel: "Grenze", tag: "3 % · 2 %", text: "Für die Summe aller Erzeugungsanlagen im ungestörten Betrieb: 3 % im Niederspannungsnetz, 2 % im Mittelspannungsnetz. Der Netzbetreiber kann abweichende Werte vorgeben." },
            { titel: "Nötiger cos φ", tag: "Blindleistung", text: "Der Simulator sucht den kleinsten untererregten Phasenwinkel, mit dem Δu die Grenze einhält, und prüft, ob er im TOR-Bereich liegt (Typ A cos φ 0,9, Typ B 0,925)." },
          ]}
        />
        <Hinweis ton="achtung" titel="Vereinfachte Vorabschätzung, verbindlich prüft der Netzbetreiber" className="mt-6">
          <p>
            Nicht berücksichtigt sind die Vorbelastung durch andere Anlagen am selben Netzstrang, Lastfluss und Stufensteller, die Impedanz Ihrer Kundenanlage sowie thermische Grenzen von Leitung und
            Transformator. Das Ergebnis ist ein Richtwert zur Orientierung (Stand 10/2026) und ersetzt weder die Netzverträglichkeitsprüfung noch den Netzanschlussvertrag.
          </p>
        </Hinweis>
      </Section>

      <QuellenKompakt items={QUELLEN} stand="Oktober 2026" />

      <CtaBand
        eyebrow="Netzanschluss & Regelung"
        title="Ergebnis knapp oder rot? Wir rechnen Ihren Netzanschluss gemeinsam durch."
        text="Mit den Daten Ihres Netzbetreibers prüfen wir Blindleistung, Einspeiselimit und Parkregler – und klären, was am Verknüpfungspunkt wirklich möglich ist."
        primary={{ label: "Projekt besprechen", href: "/termin?art=video" }}
        secondary={{ label: "Parkregler nach TOR", href: "/technik/parkregler", icon: CalendarCheck2 }}
      />
    </div>
  );
}
