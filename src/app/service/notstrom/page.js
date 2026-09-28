// service/notstrom/page.js – Österreich: Notstrom, Ersatzstrom und Blackout-Vorsorge (Ziel: Vorsorge-Konzept)

import { BatteryCharging, Building, Cable, ClipboardCheck, Droplets, Fuel, Landmark, Mountain, Plug, Power, Radio, ServerCog, ShieldAlert, Thermometer, TriangleAlert, Users, Warehouse } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import Weiterlesen from "@/components/ServiceAT/Weiterlesen";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Quellen from "@/components/ServiceAT/Quellen";

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

export default function NotstromPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Notstrom, Ersatzstrom und Blackout-Vorsorge mit Photovoltaik und Speicher", beschreibung: BESCHREIBUNG, serviceType: "Ersatzstromversorgung und Blackout-Vorsorge", zielgruppe: "Unternehmen, Landwirtschaft, Gemeinden, Hotellerie" })} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Notstrom & Blackout-Vorsorge" }]}
        eyebrow="Blackout-Vorsorge · Ersatzstrom"
        title={<>Wenn das Netz ausfällt, <span className="ov-text-gradient">läuft Ihr Betrieb weiter</span></>}
        lead="Mit schwarzstartfähigem Speicher, PV-Nachladung und – wo nötig – Aggregat versorgen Sie kritische Verbraucher auch im Blackout. Wir planen Ersatzstrom für Unternehmen, Landwirtschaft, Gemeinden und Chalets – mit sicherer Netztrennung und abgestimmt mit dem Netzbetreiber."
        image={{ src: "/Images/Ratgeber/notstrom-photovoltaik.jpg", alt: "Stromspeicher-System an einer Hauswand als Ersatzstromversorgung" }}
        points={["Ersatzstrom statt Stillstand", "Schwarzstartfähige Speicher", "Aggregat-Kombination", "Abstimmung mit dem Netzbetreiber"]}
        actions={[
          { label: "Vorsorge-Konzept anfragen", href: "#anfrage" },
          { label: "Checklisten", href: "#checklisten", icon: ClipboardCheck },
        ]}
      />

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Blackout-Szenario Österreich"
              title="Ein Blackout dauert länger als der Stromausfall"
              lead="Ein Blackout ist ein großflächiger, länger andauernder Stromausfall. Das Bundesheer zählt ihn zu den größten Risiken für Österreich, der Zivilschutzverband empfiehlt, sich für bis zu 14 Tage selbst versorgen zu können."
            />
            <Reveal delay={100} className="mt-8 space-y-4 text-[15.5px] leading-relaxed text-white/70">
              <p>
                Den Netzwiederaufbau koordiniert die Austrian Power Grid (APG) mit schwarzstartfähigen Kraftwerken – in Österreich vor allem Speicherkraftwerke. Selbst wenn der Strom nach
                einem Tag zurückkommt, laufen Telekommunikation, Zahlungsverkehr und Lieferketten erst Tage später wieder normal.
              </p>
              <p>Am 28. April 2025 fiel in Spanien und Portugal großflächig der Strom aus – ein Beleg, dass auch das europäische Verbundnetz nicht unverwundbar ist.</p>
            </Reveal>
          </div>
          <div className="space-y-3">
            {PHASEN.map((p, i) => (
              <Reveal key={p[0]} dir="right" delay={i * 90} className="rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-[19px] font-bold text-white">{p[0]}</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-ov-300">{p[1]}</span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{p[2]}</p>
              </Reveal>
            ))}
            <p className="text-[13px] text-white/50">Vereinfachtes Phasenmodell nach Herbert Saurugg; Zeitangaben als Größenordnung.</p>
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Begriffe"
          title="Ersatzstrom, Notstrom, USV, Inselbetrieb – der Unterschied"
          lead="Die Begriffe werden oft verwechselt. Für die Planung ist die Unterscheidung entscheidend, weil unterschiedliche Normen, Auflagen und Technik gelten."
          className="mb-10"
        />
        <Tabelle kopf={["Begriff", "Aufgabe", "Technik & Regeln"]} zeilen={BEGRIFFE} kompakt />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Technik" title="Was eine sichere Ersatzstromanlage braucht" />
            <Reveal delay={80}>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Cable, t: "Allpolige Netztrennung", x: "Umschalteinrichtung mit mechanischer und elektrischer Verriegelung; im TT-System vierpolig. Rückspeisung ins Netz muss ausgeschlossen sein." },
                  { icon: Power, t: "Netzbildender Wechselrichter", x: "Baut im Inselbetrieb Spannung und Frequenz auf und regelt PV-Wechselrichter über die Frequenz ab, wenn der Speicher voll ist." },
                  { icon: BatteryCharging, t: "Schwarzstartfähiger Speicher", x: "Startet ohne Netz; eine Reservekapazität bleibt im Normalbetrieb unangetastet." },
                  { icon: Fuel, t: "Aggregat-Kombination", x: "Für lange Ausfälle und den Winter: Das Aggregat lädt den Speicher, der Speicher glättet Lastspitzen." },
                  { icon: ShieldAlert, t: "Schutz im Inselbetrieb", x: "Fehlerstromschutz, Erdung und Neutralleiterführung müssen auch ohne Netz wirksam sein – nach OVE E 8101." },
                  { icon: Plug, t: "Lastmanagement", x: "Kritische Verbraucher priorisieren, andere automatisch abwerfen – so reicht eine kleinere Anlage." },
                ].map((k) => (
                  <li key={k.t} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/60">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                      <k.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-display text-[17px] font-bold text-ink-900">{k.t}</span>
                      <span className="mt-1 block text-[15px] leading-relaxed text-ink-600">{k.x}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="space-y-5 self-start">
            <Hinweis ton="recht" titel="Netzbetreiber und TOR Erzeuger">
              <p>
                Ersatzstromanlagen dürfen nicht netzparallel betrieben werden. Netzbetreiber verlangen vor der Ausführung eine Genehmigung und nach Fertigstellung Nachweise über die
                Schutzmaßnahmen. Die TOR Erzeuger fordern zudem, dass die Netzstützung der Wechselrichter (FRT-Fähigkeit) durch externe Netztrenneinrichtungen nicht unterbunden wird.
                Eingesetzte Wechselrichter sollten in der Wechselrichterliste von Oesterreichs Energie geführt sein.
              </p>
            </Hinweis>
            <Hinweis ton="achtung" titel="Keine Bastellösungen">
              <p>
                Ein Aggregat „einfach an die Steckdose“ oder eine nicht verriegelte Umschaltung gefährdet Menschen im Netz, Ihre Anlage und Ihren Versicherungsschutz. Ersatzstrom gehört in
                die Hand eines konzessionierten Elektrotechnikbetriebs.
              </p>
            </Hinweis>
            <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Kritische Verbraucher</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ServerCog, t: "IT, Server, Kommunikation" },
                  { icon: Thermometer, t: "Kühlung und Heizung" },
                  { icon: Droplets, t: "Wasser- und Abwasserpumpen" },
                  { icon: Warehouse, t: "Tierhaltung: Lüftung, Melken, Tränken" },
                  { icon: Building, t: "Tore, Zutritt, Alarmanlage" },
                  { icon: Radio, t: "Funk und Krisenkommunikation" },
                ].map((k) => (
                  <p key={k.t} className="flex items-center gap-2.5 text-[14.5px] text-ink-700">
                    <k.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
                    {k.t}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg" id="checklisten" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Checklisten"
          title="Blackout-Vorsorge: was Unternehmen, Gemeinden und Chalets tun sollten"
          lead="Technik ist nur ein Teil der Vorsorge. Genauso wichtig sind Zuständigkeiten, Abläufe und Übung."
          className="mb-12"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { icon: Warehouse, t: "Unternehmen & Landwirtschaft", liste: CHECK_UNTERNEHMEN },
            { icon: Landmark, t: "Gemeinden", liste: CHECK_GEMEINDE },
            { icon: Mountain, t: "Chalets & Hotellerie alpin", liste: CHECK_CHALET },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 80} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-600 text-white">
                <c.icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-[19px] font-bold text-ink-900">{c.t}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.liste.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-700">
                    <ClipboardCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="green" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Risiko zum getesteten Ersatzstromkonzept" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Users, title: "Analyse", text: "Kritische Verbraucher, Leistung, Anlaufströme und nötige Dauer – gemessen, nicht geschätzt." },
            { icon: BatteryCharging, title: "Konzept", text: "Speicher, PV-Nachladung, Aggregat, Lastabwurf und Umschaltung – mit Varianten und Wirtschaftlichkeit." },
            { icon: ShieldAlert, title: "Netzbetreiber", text: "Genehmigung, Schutzkonzept und Nachweise – wir übernehmen die Abstimmung." },
            { icon: TriangleAlert, title: "Umsetzung & Test", text: "Installation, Prüfung und Umschalttest unter Last; danach regelmäßige Tests im Wartungsvertrag." },
          ]}
        />
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

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher", text: "Peak Shaving, Eigenverbrauch und Ersatzstrom in einem System." },
            { href: "/kommunen", art: "Lösung", titel: "Gemeinden & Länder", text: "Wasserversorgung, Bauhof und Krisenstab absichern." },
            { href: "/chalets", art: "Lösung", titel: "Luxus-Chalets & Alpin", text: "Autarkie, Schneelast und Concierge-Wartung." },
            { href: "/technik/fernwartung", art: "Technik", titel: "Fernwartung", text: "Speicherstand, Reserve und Umschaltung im Blick." },
            { href: "/ratgeber/notstrom-photovoltaik", art: "Ratgeber", titel: "Notstrom mit Photovoltaik", text: "Ersatzstrom, Inselbetrieb und Netzbetreiber-Anforderungen." },
            { href: "/ratgeber/blackout-vorsorge-unternehmen", art: "Ratgeber", titel: "Blackout-Vorsorge für Unternehmen", text: "Krisenplan, Notstrom und Zivilschutz." },
            { href: "/ratgeber/tor-erzeuger-netzanschluss", art: "Ratgeber", titel: "TOR Erzeuger & Netzanschluss", text: "Typ A bis D, Netzebenen, Nachweise." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="Notstrom & Blackout – häufige Fragen" tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Speicher und Versorgungssicherheit" />

      <Quellen
        items={[
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
        secondary={{ label: "Gewerbespeicher ansehen", href: "/gewerbespeicher", icon: BatteryCharging }}
      />
    </div>
  );
}
