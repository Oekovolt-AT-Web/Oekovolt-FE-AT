// service/notstrom/page.js – Österreich: Notstrom, Ersatzstrom und Blackout-Vorsorge (Ziel: Vorsorge-Konzept)

import {
  BatteryCharging,
  BookOpen,
  Building,
  Cable,
  ClipboardCheck,
  Droplets,
  Landmark,
  Mountain,
  Power,
  Radio,
  Scale,
  ServerCog,
  ShieldAlert,
  Thermometer,
  TriangleAlert,
  Users,
  Warehouse,
} from "lucide-react";

import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import FotoBento from "@/components/ServiceAT/B/FotoBento";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Tabs from "@/components/ServiceAT/B/Tabs";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import BlackoutTimeline from "@/components/ServiceAT/B/BlackoutTimeline";

const PFAD = "/service/notstrom";
const TITEL = "Notstrom & Blackout-Vorsorge mit PV-Speicher | Ökovolt";
const BESCHREIBUNG =
  "Blackout-Vorsorge für Unternehmen, Gemeinden und Chalets in Österreich: Ersatzstrom mit PV und schwarzstartfähigem Speicher, Aggregat und sicherer Netztrennung.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const BEGRIFFE = [
  ["Notstrom (Sicherheitsstromversorgung)", "Versorgt vorgeschriebene Sicherheitseinrichtungen: Notbeleuchtung, Brandmelde- und Rauchabzugsanlagen, Feuerwehraufzüge", "Eigene Normen und behördliche Auflagen; ein PV-Speicher ersetzt sie in der Regel nicht"],
  ["Ersatzstrom (Netzersatzbetrieb)", "Versorgt ausgewählte Verbraucher, solange das Netz ausfällt – nach allpoliger Trennung vom Netz", "Speicher, Aggregat oder beides; Umschaltung dauert Millisekunden bis Sekunden"],
  ["USV (unterbrechungsfreie Stromversorgung)", "Überbrückt ohne Unterbrechung, meist für Minuten, IT und Steuerungen", "Norm EN 62040; ideal als erste Stufe vor Ersatzstrom"],
  ["Inselbetrieb", "Lokales Netz ohne Verbindung zum öffentlichen Netz – dauerhaft oder im Ersatzstromfall mit PV-Nachladung", "Setzt netzbildenden, schwarzstartfähigen Wechselrichter voraus"],
  ["Notstromsteckdose am Wechselrichter", "Einzelne Steckdose oder Phase für wenige Geräte", "Für Gewerbe meist zu knapp"],
];

const PHASEN = [
  ["Phase 1 – Stromausfall", "Stunden bis Tage", "Netzwiederaufbau durch APG und Verteilnetzbetreiber; die geübten Konzepte zielen auf eine Wiederversorgung binnen rund 24 Stunden – bei europaweiten Störungen kann es länger dauern"],
  ["Phase 2 – Infrastruktur läuft wieder an", "Tage", "Mobilfunk, Internet, Zahlungsverkehr und Logistik brauchen länger als der Strom; Notstrom der Telekom-Standorte ist oft nur für 48–72 Stunden ausgelegt"],
  ["Phase 3 – Versorgung normalisiert sich", "Wochen", "Lieferketten, Produktion und Warenverfügbarkeit erholen sich schrittweise"],
];

const TECHNIK = [
  { t: "Allpolige Netztrennung", x: "Umschalteinrichtung mit mechanischer und elektrischer Verriegelung; im TT-System vierpolig. Rückspeisung ins Netz muss ausgeschlossen sein." },
  { t: "Netzbildender Wechselrichter", x: "Baut im Inselbetrieb Spannung und Frequenz auf und regelt PV-Wechselrichter über die Frequenz ab, wenn der Speicher voll ist." },
  { t: "Schwarzstartfähiger Speicher", x: "Startet ohne Netz; eine Reservekapazität bleibt im Normalbetrieb unangetastet." },
  { t: "Aggregat-Kombination", x: "Für lange Ausfälle und den Winter: Das Aggregat lädt den Speicher, der Speicher glättet Lastspitzen." },
  { t: "Schutz im Inselbetrieb", x: "Fehlerstromschutz, Erdung und Neutralleiterführung müssen auch ohne Netz wirksam sein – nach OVE E 8101." },
  { t: "Lastmanagement", x: "Kritische Verbraucher priorisieren, andere automatisch abwerfen – so reicht eine kleinere Anlage." },
];

const CHECK_UNTERNEHMEN = [
  "Kritische Verbraucher erfassen: Leistung, Anlaufströme, notwendige Dauer",
  "Produktion und Prozesse sicher herunterfahren können – ohne Schäden an Anlagen und Material",
  "Kühlketten, Server und Kommunikation priorisieren; USV für IT als erste Stufe",
  "Tore, Zutritt, Alarmanlage und Beleuchtung im Ersatzstromkreis vorsehen",
  "Treibstoff für Aggregate lagern und rotieren",
  "Krisenplan mit Zuständigkeiten, Treffpunkt und Kommunikation ohne Mobilfunk",
  "Umschaltung regelmäßig unter Last testen und dokumentieren",
];

const CHECK_GEMEINDE = [
  "Krisenstab mit Stellvertretung, Einsatzleitung im ersatzstromversorgten Amtshaus oder Feuerwehrhaus",
  "Wasserversorgung: Pumpwerke, Hochbehälter und Aufbereitung mit Ersatzstrom",
  "Abwasser: Pumpstationen und Kläranlage absichern",
  "Anlaufstellen für die Bevölkerung mit Strom, Wärme und Information",
  "Kommunikation über Funk, Aushänge und Lautsprecher planen",
  "Treibstoffversorgung für Feuerwehr, Bauhof und Aggregate sichern",
];

const CHECK_CHALET = [
  "Heizung, Umwälzpumpen und Brunnen- oder Druckerhöhungspumpe versorgen",
  "Kühlung, Kommunikation und Alarmanlage sichern",
  "Garagentore, Zufahrt und Beleuchtung bei Schnee und Dunkelheit",
  "Speicher so bemessen, dass lange Winternächte überbrückt werden",
  "Fernüberwachung, damit Störungen auch bei Abwesenheit auffallen",
];

const FAQ = [
  {
    q: "Liefert eine PV-Anlage bei Stromausfall Strom?",
    a: "Eine normale netzgekoppelte PV-Anlage nicht. Der Netz- und Anlagenschutz schaltet den Wechselrichter bei Netzausfall sofort ab, damit niemand an einer vermeintlich spannungslosen Leitung gefährdet wird. Erst mit Ersatzstromfunktion – netzbildendem Wechselrichter, Speicher und allpoliger Netztrennung – versorgt die Anlage Ihre Verbraucher im Inselbetrieb.",
  },
  {
    q: "Was bedeutet schwarzstartfähig?",
    a: "Ein schwarzstartfähiger Speicher kann ohne Netz hochfahren und selbst ein stabiles Inselnetz bilden. PV-Wechselrichter können sich daran synchronisieren und den Speicher tagsüber nachladen. Wichtig ist eine Reservekapazität, die im Normalbetrieb nicht entladen wird – sonst ist der Speicher im Ernstfall leer.",
  },
  {
    q: "Wie lange reicht ein Speicher im Blackout?",
    a: "Das hängt vom Verhältnis zwischen Speichergröße und Leistung der versorgten Verbraucher ab. Mit PV-Nachladung können Speicher im Sommer über Tage reichen, im Winter nur Stunden. Für lange Ausfälle kombinieren wir den Speicher mit einem Aggregat: Der Speicher übernimmt schnell und leise, das Aggregat lädt bei Bedarf nach.",
  },
  {
    q: "Braucht eine Ersatzstromanlage die Zustimmung des Netzbetreibers?",
    a: "Ja. Netzbetreiber verlangen, dass Ersatzstromanlagen nicht netzparallel betrieben werden und eine sichere, verriegelte Umschaltung haben. Netz Oberösterreich etwa fordert eine schriftliche Genehmigung vor Ausführung und eine Fertigstellungsmeldung mit Nachweis der Schutzmaßnahmen. Wir übernehmen die Abstimmung.",
  },
  {
    q: "Wie wahrscheinlich ist ein Blackout in Österreich?",
    a: "Niemand kann einen Blackout vorhersagen. Das Bundesheer zählt ihn in seinem Risikobild zu den größten Risiken für Österreich. Dass es auch in Europa passieren kann, zeigte der großflächige Stromausfall in Spanien und Portugal am 28. April 2025. Vorsorge ist deshalb Teil eines ordentlichen Risikomanagements.",
  },
  {
    q: "Ersetzt ein PV-Speicher die Notbeleuchtung oder die Sicherheitsstromversorgung?",
    a: "In der Regel nicht. Sicherheitsstromversorgungen für Notbeleuchtung, Brandschutz- und Rauchabzugsanlagen unterliegen eigenen Normen und behördlichen Auflagen. Der PV-Speicher ergänzt sie als Ersatzstrom für den Betrieb – etwa für Kühlung, Heizung, IT oder Wasserversorgung.",
  },
  {
    q: "Wie oft sollte man die Ersatzstromversorgung testen?",
    a: "Mindestens einmal jährlich unter realer Last, besser halbjährlich, und nach jeder Änderung an der Anlage. Der Test zeigt, ob Umschaltung, Lastabwurf und Nachladung funktionieren – und ob alle wissen, was zu tun ist. Im Wartungsvertrag planen wir den Test fest ein.",
  },
  {
    q: "Welche Leistung braucht ein Betrieb für Ersatzstrom?",
    a: "Nicht die volle Anschlussleistung, sondern die der kritischen Verbraucher. Wir messen oder berechnen sie gemeinsam mit Ihnen – inklusive Anlaufströmen von Motoren, Pumpen und Kompressoren. Oft reicht ein Bruchteil der Anschlussleistung, wenn Verbraucher priorisiert werden.",
  },
];

function Checkliste({ liste }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-8">
      <ul className="grid content-start gap-3 sm:grid-cols-2">
        {liste.map((p, i) => (
          <li
            key={p}
            className={`flex gap-3 rounded-2xl bg-white p-4 text-[15px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60 ${i === liste.length - 1 && liste.length % 2 === 1 ? "sm:col-span-2" : ""}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[13px] font-bold text-white">{i + 1}</span>
            {p}
          </li>
        ))}
      </ul>
      <KritischeVerbraucher />
    </div>
  );
}

function KritischeVerbraucher() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-navy-950 p-6 text-white md:p-8">
      <Image src="/Images/AT/service-b/notstromaggregat.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 35vw" className="-z-20 object-cover opacity-45" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/70 via-navy-950/85 to-navy-950" />
      <p className="relative text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Kritische Verbraucher</p>
      <ul className="relative mt-5 grid gap-3">
        {[
          { icon: ServerCog, t: "IT, Server, Kommunikation" },
          { icon: Thermometer, t: "Kühlung und Heizung" },
          { icon: Droplets, t: "Wasser- und Abwasserpumpen" },
          { icon: Warehouse, t: "Tierhaltung: Lüftung, Melken, Tränken" },
          { icon: Building, t: "Tore, Zutritt, Alarmanlage" },
          { icon: Radio, t: "Funk und Krisenkommunikation" },
        ].map((k) => (
          <li key={k.t} className="flex items-center gap-3 text-[15px] text-white/85">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <k.icon aria-hidden="true" className="h-4 w-4 text-ov-300" />
            </span>
            {k.t}
          </li>
        ))}
      </ul>
      <p className="relative mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-[13.5px] text-white/60">
        <ClipboardCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300" />
        Umschaltung mindestens jährlich unter Last testen
      </p>
    </div>
  );
}

export default function NotstromPage() {
  return (
    <div>
      <Stil />
      <JsonLd
        daten={serviceSchema({
          pfad: PFAD,
          name: "Notstrom, Ersatzstrom und Blackout-Vorsorge mit Photovoltaik und Speicher",
          beschreibung: BESCHREIBUNG,
          serviceType: "Ersatzstromversorgung und Blackout-Vorsorge",
          zielgruppe: "Unternehmen, Landwirtschaft, Gemeinden, Hotellerie",
        })}
      />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Notstrom & Blackout-Vorsorge" }]}
        eyebrow="Blackout-Vorsorge · Ersatzstrom"
        title={
          <>
            Wenn das Netz ausfällt, <span className="ov-text-gradient-light">läuft Ihr Betrieb weiter</span>
          </>
        }
        lead="Mit schwarzstartfähigem Speicher, PV-Nachladung und – wo nötig – Aggregat versorgen Sie kritische Verbraucher auch im Blackout. Wir planen Ersatzstrom für Unternehmen, Landwirtschaft, Gemeinden und Chalets – mit sicherer Netztrennung und abgestimmt mit dem Netzbetreiber."
        image={{ src: "/Images/AT/service-b/notstrom-container-nacht.jpg", alt: "Notstromaggregat im Container bei Nacht vor einem Betriebsgebäude", position: "70% center" }}
        ton="tief"
        points={["Ersatzstrom statt Stillstand", "Schwarzstartfähige Speicher", "Aggregat-Kombination", "Abstimmung mit dem Netzbetreiber"]}
        actions={[
          { label: "Vorsorge-Konzept anfragen", href: "#anfrage" },
          { label: "Blackout durchspielen", href: "#simulation", icon: Power },
        ]}
      />

      <Kennzahlen
        frage="Liefert meine PV-Anlage bei einem Blackout Strom?"
        zahlen={[
          { value: 14, suffix: " Tage", label: "Selbstversorgung empfiehlt der Zivilschutzverband", hinweis: "Zivilschutz Österreich" },
          { text: "≈ 24 h", label: "Ziel geübter Konzepte für den Netzwiederaufbau", hinweis: "bei europaweiten Störungen länger" },
          { text: "48–72 h", label: "Auslegung vieler Telekom-Notstromanlagen", hinweis: "Phasenmodell nach H. Saurugg" },
          { text: "ms–s", label: "Umschaltung auf Speicher im Ersatzstromfall", hinweis: "je nach Technik" },
        ]}
      >
        <p>
          <strong>Eine normale netzgekoppelte PV-Anlage nicht</strong> – der Netz- und Anlagenschutz schaltet sie bei Netzausfall sofort ab. Erst mit netzbildendem Wechselrichter,
          schwarzstartfähigem Speicher und allpoliger Netztrennung versorgt sie Ihre kritischen Verbraucher im Inselbetrieb und lädt tagsüber nach.
        </p>
      </Kennzahlen>

      {/* Interaktive Zeitleiste */}
      <Dunkel id="simulation">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Blackout-Simulation"
            title={
              <>
                Stunde 0 bis 48: <span className="ov-text-gradient-light">Stillstand oder Inselbetrieb</span>
              </>
            }
          />
          <Reveal delay={100}>
            <p className="ov-lead text-white/70">
              Ein Blackout dauert länger als der Stromausfall. Spielen Sie durch, wie ein Beispielbetrieb die ersten zwei Tage erlebt – ohne Ersatzstrom und mit Speicher, PV-Nachladung und
              Aggregat.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale" className="mt-12">
          <BlackoutTimeline />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PHASEN.map((p, i) => (
            <Reveal key={p[0]} delay={i * 90} className="ov-glass rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[17px] font-bold text-white">{p[0]}</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11.5px] font-semibold uppercase tracking-wider text-ov-300">{p[1]}</span>
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{p[2]}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-white/50">
          Vereinfachtes Phasenmodell nach Herbert Saurugg; Zeitangaben als Größenordnung. Am 28. April 2025 fiel in Spanien und Portugal großflächig der Strom aus – auch das europäische
          Verbundnetz ist nicht unverwundbar.
        </p>
      </Dunkel>

      {/* Einsatzbereiche */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Kritische Verbraucher"
          title="Was im Ernstfall weiterlaufen muss"
          lead="Ersatzstrom versorgt nicht den ganzen Betrieb, sondern das, was Schaden verhindert und Handlungsfähigkeit sichert. Genau dafür wird die Anlage ausgelegt."
          className="mb-12"
        />
        <FotoBento
          items={[
            {
              bild: { src: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg", alt: "Batteriespeicher-Container neben einer Gewerbehalle" },
              icon: BatteryCharging,
              tag: "Unternehmen",
              titel: "Produktion sicher herunterfahren, Kühlketten halten",
              text: "Schwarzstartfähiger Gewerbespeicher mit Lastmanagement: Server, Kühlung, Tore und Beleuchtung laufen weiter, Maschinen fahren geordnet herunter.",
            },
            { bild: { src: "/Images/AT/technik/serverraum-racks.jpg", alt: "Serverschränke in einem Rechenzentrum" }, icon: ServerCog, titel: "IT & Kommunikation", text: "USV als erste Stufe, Ersatzstrom für Stunden bis Tage." },
            { bild: { src: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg", alt: "Photovoltaik auf einem Gemeindegebäude" }, icon: Droplets, titel: "Wasser & Abwasser", text: "Pumpwerke, Hochbehälter und Kläranlage der Gemeinde." },
            { bild: { src: "/Images/AT/loesungen/agri-pv-obstbau.jpg", alt: "Landwirtschaftlicher Betrieb mit Photovoltaik" }, icon: Warehouse, titel: "Tierhaltung", text: "Lüftung, Melken, Tränken – hier entscheiden Minuten." },
            { bild: { src: "/Images/AT/chalets/chalets-alpin-winter-mittelberg.jpg", alt: "Verschneite Chalets in den Alpen" }, icon: Thermometer, titel: "Chalets & Hotellerie", text: "Heizung, Brunnenpumpe und Zufahrt in langen Winternächten." },
          ]}
        />
      </Section>

      {/* Checklisten */}
      <Section tone="white" space="lg" id="checklisten" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Checklisten"
          title="Blackout-Vorsorge: was Unternehmen, Gemeinden und Chalets tun sollten"
          lead="Technik ist nur ein Teil der Vorsorge. Genauso wichtig sind Zuständigkeiten, Abläufe und Übung."
          className="mb-10"
        />
        <Tabs
          label="Checkliste wählen"
          tabs={[
            { id: "unternehmen", label: "Unternehmen & Landwirtschaft", icon: <Warehouse />, inhalt: <Checkliste liste={CHECK_UNTERNEHMEN} /> },
            { id: "gemeinde", label: "Gemeinden", icon: <Landmark />, inhalt: <Checkliste liste={CHECK_GEMEINDE} /> },
            { id: "chalet", label: "Chalets & Hotellerie alpin", icon: <Mountain />, inhalt: <Checkliste liste={CHECK_CHALET} /> },
          ]}
        />
      </Section>

      {/* Ablauf */}
      <Dunkel space="md" glow="rechts">
        <SectionHeading dark eyebrow="Ablauf" title="Vom Risiko zum getesteten Ersatzstromkonzept" align="center" className="mb-14" />
        <Steps
          tone="dark"
          items={[
            { icon: Users, title: "Analyse", text: "Kritische Verbraucher, Leistung, Anlaufströme und nötige Dauer – gemessen, nicht geschätzt." },
            { icon: BatteryCharging, title: "Konzept", text: "Speicher, PV-Nachladung, Aggregat, Lastabwurf und Umschaltung – mit Varianten und Wirtschaftlichkeit." },
            { icon: ShieldAlert, title: "Netzbetreiber", text: "Genehmigung, Schutzkonzept und Nachweise – wir übernehmen die Abstimmung." },
            { icon: TriangleAlert, title: "Umsetzung & Test", text: "Installation, Prüfung und Umschalttest unter Last; danach regelmäßige Tests im Wartungsvertrag." },
          ]}
        />
      </Dunkel>

      {/* Fachdetails */}
      <Section tone="white" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Für Technik & Einkauf"
            title="Begriffe, Netzbetreiber, Normen"
            lead="Notstrom, Ersatzstrom, USV und Inselbetrieb werden oft verwechselt. Für die Planung ist die Unterscheidung entscheidend, weil unterschiedliche Normen, Auflagen und Technik gelten."
          />
          <Fachdetails
            items={[
              {
                titel: "Ersatzstrom, Notstrom, USV, Inselbetrieb – der Unterschied",
                kurz: "Fünf Begriffe, fünf Aufgaben",
                icon: BookOpen,
                inhalt: <Tabelle kopf={["Begriff", "Aufgabe", "Technik & Regeln"]} zeilen={BEGRIFFE} kompakt />,
              },
              {
                titel: "Netzbetreiber und TOR Erzeuger",
                kurz: "Genehmigung, Verriegelung, FRT-Fähigkeit",
                icon: Scale,
                inhalt: (
                  <p className="text-[15.5px] leading-relaxed text-ink-700">
                    Ersatzstromanlagen dürfen nicht netzparallel betrieben werden. Netzbetreiber verlangen vor der Ausführung eine Genehmigung und nach Fertigstellung Nachweise über die
                    Schutzmaßnahmen. Die TOR Erzeuger fordern zudem, dass die Netzstützung der Wechselrichter (FRT-Fähigkeit) durch externe Netztrenneinrichtungen nicht unterbunden wird.
                    Eingesetzte Wechselrichter sollten in der Wechselrichterliste von Oesterreichs Energie geführt sein.
                  </p>
                ),
              },
              {
                titel: "Keine Bastellösungen",
                kurz: "Ersatzstrom gehört in die Hand eines konzessionierten Elektrotechnikbetriebs",
                icon: TriangleAlert,
                inhalt: (
                  <Hinweis ton="achtung" titel="Sicherheit vor Improvisation">
                    <p>
                      Ein Aggregat „einfach an die Steckdose“ oder eine nicht verriegelte Umschaltung gefährdet Menschen im Netz, Ihre Anlage und Ihren Versicherungsschutz. Ersatzstrom gehört
                      in die Hand eines konzessionierten Elektrotechnikbetriebs.
                    </p>
                  </Hinweis>
                ),
              },
              {
                titel: "Speicher, Aggregat, PV – so greifen die Komponenten ineinander",
                kurz: "Allpolige Trennung, Inselnetz, Nachladung",
                icon: Cable,
                inhalt: (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {TECHNIK.map((k) => (
                      <li key={k.t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                        <p className="font-display text-[15.5px] font-bold text-ink-900">{k.t}</p>
                        <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{k.x}</p>
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <AnfrageSektion
        titel="Vorsorge-Konzept anfragen"
        lead="Beschreiben Sie Objekt und kritische Verbraucher. Wir melden uns mit Rückfragen und einem Vorschlag für Analyse und Konzept."
        schritte={["Sie beschreiben Objekt, vorhandene Technik und Ziel.", "Wir analysieren Verbraucher und Lastgang – bei Bedarf mit Messung vor Ort.", "Sie erhalten ein Konzept mit Varianten, Netzbetreiber-Anforderungen und Angebot."]}
        formular={{
          betreff: "Notstrom / Blackout-Vorsorge",
          thema: "Stromspeicher",
          titel: "Anfrage Ersatzstrom & Blackout-Vorsorge",
          absenden: "Konzept anfragen",
          felder: [
            { name: "objekt", label: "Objekt", typ: "auswahl", pflicht: true, optionen: ["Unternehmen / Produktion", "Landwirtschaft / Tierhaltung", "Gemeinde / Wasserversorgung", "Hotel / Tourismus", "Chalet / Premium-Wohnobjekt"] },
            { name: "leistung", label: "Leistung der kritischen Verbraucher (geschätzt)", typ: "zahl", einheit: "kW", placeholder: "z. B. 40" },
            { name: "dauer", label: "Gewünschte Überbrückung", typ: "auswahl", optionen: ["bis 4 Stunden", "bis 24 Stunden", "mehrere Tage", "noch offen"] },
            { name: "pv", label: "Vorhandene PV-Leistung", typ: "zahl", einheit: "kWp", placeholder: "0 wenn keine" },
            { name: "bestand", label: "Vorhanden", typ: "auswahl", optionen: ["Nichts davon", "Speicher", "Aggregat", "Speicher und Aggregat", "USV"] },
          ],
        }}
      />

      <FaqSektion items={FAQ} titel="Notstrom & Blackout – häufige Fragen" tone="white" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Speicher und Versorgungssicherheit" />

      <Abschluss
        links={[
          { href: "/rechner/blackout", art: "Rechner", titel: "Blackout-Rechner" },
          { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher" },
          { href: "/kommunen", art: "Lösung", titel: "Gemeinden & Länder" },
          { href: "/chalets", art: "Lösung", titel: "Luxus-Chalets & Alpin" },
          { href: "/technik/fernwartung", art: "Technik", titel: "Fernwartung" },
          { href: "/ratgeber/notstrom-photovoltaik", art: "Ratgeber", titel: "Notstrom mit Photovoltaik" },
          { href: "/ratgeber/blackout-vorsorge-unternehmen", art: "Ratgeber", titel: "Blackout-Vorsorge für Unternehmen" },
          { href: "/ratgeber/tor-erzeuger-netzanschluss", art: "Ratgeber", titel: "TOR Erzeuger & Netzanschluss" },
        ]}
        quellen={[
          { titel: "Netz Oberösterreich – Ausführungsbestimmungen: Ersatzstromversorgung", href: "https://www.ooe-ausfuehrungsbestimmungen.at/de/367/" },
          { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.3.pdf" },
          { titel: "Wiener Netze – Erläuterungsdokument NC RfG / TOR Erzeuger", href: "https://www.wienernetze.at/o/document/2023-04-24_erlaeuterungsdokument-_nc_rfg_tor_erz_v9-0" },
          { titel: "Oesterreichs Energie – Wechselrichterliste TOR Erzeuger Typ A", href: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/wechselrichterliste-tor-erzeuger-typ-a" },
          { titel: "Zivilschutz Österreich – Ratgeber Blackout", href: "https://www.zivilschutz.at/wp-content/uploads/2022/09/Blackout-Ratgeber_Web.pdf" },
          { titel: "Herbert Saurugg – Risiko eines Strom-Blackouts", href: "https://www.saurugg.net/blackout/risiko-eines-strom-blackouts" },
          { titel: "Herbert Saurugg – Schwarzstart & Netzwiederaufbau", href: "https://www.saurugg.net/blackout/schwarzstart-netzwiederaufbau" },
          { titel: "GfKV – Leitfaden für die Blackout-Vorsorge in Unternehmen und Organisationen", href: "https://gfkv.org/wp-content/uploads/2024/03/GfKV-Leitfaden-fuer-die-Blackout-Vorsorge-in-Unternehmen-und-Organisationen.pdf" },
        ]}
      />

      <CtaBand
        eyebrow="Blackout-Vorsorge"
        title="Vorsorge ist billiger als Stillstand."
        text="Wir analysieren Ihre kritischen Verbraucher und planen Ersatzstrom mit Speicher, PV und Aggregat – sicher getrennt vom Netz, abgestimmt mit dem Netzbetreiber, regelmäßig getestet."
        primary={{ label: "Vorsorge-Konzept anfragen", href: "#anfrage" }}
        secondary={{ label: "Blackout-Rechner", href: "/rechner/blackout", icon: Power }}
      />
    </div>
  );
}
