// service/repowering/page.js – Österreich: Repowering und Erweiterung von PV-Bestandsanlagen (Ziel: Repowering-Check)
//
// Statische AT-Inhalte statt der deutschen CMS-Texte (EEG, Ü20, Marktstammdatenregister).

import { BadgeEuro, BatteryCharging, CalendarClock, ClipboardCheck, Cpu, Gauge, LayoutGrid, LineChart, Maximize2, Recycle, RefreshCw, Share2, ShieldCheck, SlidersHorizontal, Sun, TrendingDown, Wrench, Zap } from "lucide-react";

import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import VorherNachher from "@/components/Repowering/VorherNachher";
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
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import { SERVICE_FREMDMARKEN } from "@/components/Hersteller/partner";

const PFAD = "/service/repowering";
const TITEL = "Repowering: PV-Bestandsanlagen modernisieren | Ökovolt";
const BESCHREIBUNG =
  "Repowering in Österreich: Module und Wechselrichter tauschen, Anlage erweitern, Speicher nachrüsten – nach dem OeMAG-Tarif, mit EAG-Förderung für Erweiterungen.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const OPTIONEN = [
  { icon: Zap, t: "Weiter einspeisen", x: "Nach Ende des Tarifvertrags zum OeMAG-Marktpreis oder über einen Stromhändler verkaufen", g: "Minimaler Aufwand; Erlös schwankt mit dem Marktpreis" },
  { icon: RefreshCw, t: "Auf Überschusseinspeisung umstellen", x: "Volleinspeiser nutzen den Strom künftig selbst und speisen nur den Überschuss ein – Zähler- und Messkonzept mit dem Netzbetreiber umstellen", g: "Jede selbst genutzte kWh ersetzt teuren Netzbezug" },
  { icon: BatteryCharging, t: "Speicher nachrüsten", x: "Überschüsse in den Abend verschieben, Lastspitzen kappen, auf Wunsch Ersatzstrom", g: "EAG-Speicherförderung nur zusammen mit PV-Neuerrichtung oder -Erweiterung" },
  { icon: Maximize2, t: "Erweitern", x: "Freie Dach- oder Parkplatzflächen belegen, zusätzliche Leistung als Erweiterung", g: "Erweiterung nach § 56 EAG förderfähig" },
  { icon: Sun, t: "Repowering", x: "Module und Wechselrichter tauschen, Unterkonstruktion prüfen, Anlage auf Stand der Technik bringen", g: "Deutlich mehr Leistung auf derselben Fläche, neue Garantien" },
  { icon: Share2, t: "In eine Energiegemeinschaft", x: "Überschuss in einer Erneuerbare-Energie-Gemeinschaft an Nachbarn, Gemeinde oder KMU liefern", g: "Lokaler Absatz, reduzierte Netzentgelte für Teilnehmer" },
];

const FOERDERUNG = [
  ["Kategorie A", "bis 10 kWp", "150 €/kWp (fixer Fördersatz)"],
  ["Kategorie B", "über 10 bis 20 kWp", "140 €/kWp (fixer Fördersatz)"],
  ["Kategorie C", "über 20 bis 100 kWp", "bis 130 €/kWp (höchstzulässig, Reihung)"],
  ["Kategorie D", "über 100 kWp bis 1.000 kWp je Anlage", "bis 120 €/kWp (höchstzulässig, Reihung)"],
  ["Stromspeicher", "mindestens 0,5 kWh je kWp, höchstens 50 kWh", "150 €/kWh – nur mit PV; Speichererweiterungen nicht förderbar"],
];

const FAQ = [
  {
    q: "Wann lohnt sich Repowering einer PV-Anlage in Österreich?",
    a: "Typische Anlässe sind das Ende des OeMAG-Tarifvertrags, ein Wechselrichter am Ende seiner Lebensdauer, sinkende Erträge durch Defekte oder Degradation, eine anstehende Dachsanierung oder ein gestiegener Strombedarf durch E-Flotte, Wärmepumpe oder Produktion. Weil moderne Module auf gleicher Fläche deutlich mehr Leistung bringen als Module von vor zehn bis zwanzig Jahren, rechnet sich der Tausch oft – vor allem bei hohem Eigenverbrauch.",
  },
  {
    q: "Was passiert nach Ende des OeMAG-Tarifs?",
    a: "Anlagen mit Tarifförderung nach dem Ökostromgesetz 2012 hatten einen Vertrag über 13 Jahre. Danach kann der Strom zum OeMAG-Marktpreis oder an einen Stromhändler verkauft werden. Wirtschaftlich attraktiver ist meist, den Strom selbst zu nutzen – Volleinspeiser müssen dafür das Messkonzept mit dem Netzbetreiber umstellen.",
  },
  {
    q: "Wird die Erweiterung einer bestehenden Anlage gefördert?",
    a: "Ja. Nach § 56 Erneuerbaren-Ausbau-Gesetz können Neuerrichtung und Erweiterung von PV-Anlagen bis 1.000 kWp je Anlage mit einem Investitionszuschuss gefördert werden. Gefördert wird die zusätzliche Engpassleistung; das Förderansuchen muss in einem OeMAG-Fördercall und vor Inbetriebnahme gestellt werden. Ein reiner Modultausch ohne Leistungszuwachs ist in der Regel keine Erweiterung – das prüfen wir im Einzelfall.",
  },
  {
    q: "Wie lange hält ein Wechselrichter?",
    a: "Wechselrichter sind meist das erste Bauteil, das getauscht werden muss – häufig nach zehn bis fünfzehn Jahren. Neue Geräte müssen die TOR Erzeuger erfüllen und sollten in der österreichischen Wechselrichterliste geführt sein. Sie bieten besseres Monitoring und sind oft für Speicher und Ersatzstrom vorbereitet.",
  },
  {
    q: "Was muss bei der Unterkonstruktion beachtet werden?",
    a: "Neue Module sind größer und oft schwerer. Unterkonstruktion, Klemmbereiche und Dachstatik müssen für die Schnee- und Windlast am Standort nach ÖNORM B 1991-1-3 und B 1991-1-4 nachgewiesen sein. Bei älteren Hallendächern prüfen wir zusätzlich Dachhaut, Durchdringungen und Brandschutz nach OVE R 11-1.",
  },
  {
    q: "Was passiert mit den alten Modulen?",
    a: "Photovoltaikmodule sind Elektroaltgeräte im Sinne der Elektroaltgeräteverordnung und werden über die dafür vorgesehenen Sammel- und Verwertungssysteme recycelt. Glas, Aluminium und Silizium lassen sich großteils wiederverwerten. Funktionsfähige Module können unter Umständen weiterverwendet werden. Rückbau und Entsorgung organisieren wir.",
  },
  {
    q: "Muss die Anlage nach dem Repowering neu geprüft und gemeldet werden?",
    a: "Ja. Ein Repowering ist eine wesentliche Änderung: Die Anlage wird neu geprüft (OVE E 8101, OVE EN 62446-1), das Anlagenbuch aktualisiert und die Änderung beim Netzbetreiber gemeldet. Bei laufenden Förder- oder Tarifverträgen informieren wir auch die OeMAG.",
  },
];

export default function RepoweringPage() {
  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Repowering und Erweiterung von Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "PV-Repowering, Erweiterung und Speichernachrüstung" })} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Repowering" }]}
        eyebrow="Repowering · Erweiterung · Speicher"
        title={
          <>
            Bestandsanlage, <span className="ov-text-gradient-light">neue Leistung</span>
          </>
        }
        lead="Viele PV-Anlagen in Österreich stammen aus der Zeit der OeMAG-Tarife. Heute bringen neue Module auf derselben Fläche deutlich mehr Leistung, Wechselrichter erreichen ihr Lebensende und Eigenverbrauch ist mehr wert als Einspeisung. Wir prüfen Ihre Anlage und rechnen Tausch, Erweiterung und Speicher ehrlich durch."
        image={{ src: "/Images/AT/service-b/module-montage-dach.jpg", alt: "Monteur mit Helm montiert Solarmodule auf einem großen Flachdach" }}
        points={["Nach Ende des OeMAG-Tarifs", "Module & Wechselrichter tauschen", "Erweiterung mit EAG-Förderung", "Speicher nachrüsten"]}
        actions={[
          { label: "Repowering-Check anfragen", href: "#anfrage" },
          { label: "Leistung vergleichen", href: "#vergleich", icon: Gauge },
        ]}
        aside={
          <div className="ov-glass sb-schweben hidden max-w-xs rounded-3xl p-6 lg:ml-auto lg:block">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500 text-white">
              <Sun aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-[26px] font-extrabold leading-tight text-white">mehr kWp</p>
            <p className="mt-1 text-[14px] leading-snug text-white/70">auf derselben Dachfläche mit aktuellen Modulen – rechnen Sie es unten nach.</p>
          </div>
        }
      />

      <Kennzahlen
        frage="Wann lohnt sich Repowering einer PV-Anlage in Österreich?"
        zahlen={[
          { value: 13, suffix: " Jahre", label: "liefen OeMAG-Tarifverträge nach dem Ökostromgesetz 2012" },
          { text: "10–15 J.", label: "typische Lebensdauer von Wechselrichtern" },
          { text: "1.000 kWp", label: "je Anlage: Obergrenze für den EAG-Investitionszuschuss" },
          { value: 30, suffix: " %", label: "der förderfähigen Kosten höchstens gefördert", hinweis: "§ 56 EAG" },
        ]}
      >
        <p>
          <strong>Wenn mehrere Anlässe zusammenkommen</strong> – etwa Tarifende, Wechselrichtertausch und gestiegener Strombedarf durch E-Flotte, Wärmepumpe oder Produktion. Moderne Module
          bringen auf gleicher Fläche deutlich mehr Leistung als Module von vor zehn bis zwanzig Jahren; bei hohem Eigenverbrauch rechnet sich der Tausch oft.
        </p>
      </Kennzahlen>

      {/* Vorher/Nachher */}
      <Dunkel id="vergleich">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Vorher / Nachher"
            title={
              <>
                Was steckt noch in <span className="ov-text-gradient-light">Ihrem Dach</span>?
              </>
            }
          />
          <Reveal delay={100}>
            <p className="ov-lead text-white/70">
              Wählen Sie Baujahr und belegte Fläche Ihrer Anlage und ziehen Sie den Regler über das Dach. Die Rechnung ist eine vereinfachte Orientierung – den tatsächlichen Wert ermitteln wir
              beim Anlagencheck.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale" className="mt-12">
          <VorherNachher />
        </Reveal>
      </Dunkel>

      {/* Anlässe */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Anlässe"
          title="Fünf Gründe, eine Bestandsanlage jetzt anzugehen"
          lead="Repowering lohnt sich, wenn mehrere Anlässe zusammenkommen – etwa Tarifende, Wechselrichtertausch und gestiegener Strombedarf."
          className="mb-12"
        />
        <FotoBento
          items={[
            {
              bild: { src: "/Images/AT/service-b/alte-pv-module.jpg", alt: "Ältere polykristalline Photovoltaikmodule an einer Fassade" },
              icon: CalendarClock,
              tag: "häufigster Anlass",
              titel: "Tarifende",
              text: "OeMAG-Tarifverträge nach dem Ökostromgesetz 2012 liefen 13 Jahre. Danach entscheidet der Eigenverbrauch über die Wirtschaftlichkeit.",
            },
            { bild: { src: "/Images/AT/ratgeber/eza-regler-parkregler.jpg", alt: "Wechselrichter und Regelungstechnik" }, icon: Cpu, titel: "Wechselrichter am Lebensende", text: "Nach zehn bis fünfzehn Jahren steigen Ausfälle – der ideale Moment für einen Gesamtcheck." },
            { bild: { src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Drohnenaufnahme einer Photovoltaikanlage bei der Inspektion" }, icon: TrendingDown, titel: "Ertrag sinkt", text: "Degradation, PID, Hotspots – Thermografie und Kennlinie zeigen, was noch geht." },
            { bild: { src: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg", alt: "Solarcarport mit Ladepunkten" }, icon: LineChart, titel: "Mehr Strombedarf", text: "E-Flotte, Wärmepumpe, neue Maschinen: mehr Leistung vom selben Dach." },
            { bild: { src: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Monteur mit Modul auf einem Dach" }, icon: Wrench, titel: "Dachsanierung", text: "Müssen die Module ohnehin herunter, sind neue kaum teurer als die Wiedermontage." },
          ]}
        />
      </Section>

      {/* Optionen */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Nach dem OeMAG-Tarif"
          title="Sechs Optionen für Ihre Bestandsanlage"
          lead="Welche Option passt, hängt von Zustand, Verbrauch und Dach ab. Oft ist eine Kombination am wirtschaftlichsten – etwa Überschusseinspeisung mit Speicher und Erweiterung."
          className="mb-12"
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {OPTIONEN.map((o, i) => (
            <Reveal as="li" key={o.t} delay={i * 60} className="ov-card-hover flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                <o.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-[18.5px] font-bold text-ink-900">{o.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{o.x}</p>
              <p className="mt-auto flex gap-2 border-t border-ink-100 pt-4 text-[14px] font-medium leading-snug text-ov-700">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {o.g}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Förderung & Technik */}
      <Section tone="white" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Förderung & Technik"
              title="Investitionszuschuss für die Erweiterung – und was technisch zählt"
              lead="Nach § 56 Erneuerbaren-Ausbau-Gesetz können Neuerrichtung und Erweiterung von PV-Anlagen bis 1.000 kWp je Anlage gefördert werden – mit höchstens 30 % der förderfähigen Kosten."
            />
            <Reveal delay={120} className="mt-8 flex items-start gap-3 rounded-2xl bg-ov-50 p-4 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ov-200/70">
              <BadgeEuro aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              <span>
                Repowering ohne großen Mittelabfluss? Leasing und Kredit organisieren wir mit Partnern –{" "}
                <Link href="/service/finanzierung" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                  Finanzierung & Leasing
                </Link>
                .
              </span>
            </Reveal>
          </div>
          <Fachdetails
            items={[
              {
                titel: "EAG-Investitionszuschuss – Fördersätze 2026",
                kurz: "Kategorien A bis D und Stromspeicher",
                icon: BadgeEuro,
                offen: true,
                inhalt: (
                  <Tabelle
                    caption="EAG-Investitionszuschuss Photovoltaik – Fördersätze 2026"
                    kopf={["Kategorie", "Engpassleistung", "Fördersatz"]}
                    zeilen={FOERDERUNG}
                    kompakt
                    quelle="Quelle: EAG-Abwicklungsstelle, Stand Fördercalls 2026. Abschläge bzw. Zuschläge je nach Standort (z. B. Freifläche, Agri-PV) nach § 56 EAG. Budgets je Call begrenzt."
                  />
                ),
              },
              {
                titel: "Was als Erweiterung zählt – und welche Fristen gelten",
                kurz: "Zusätzliche Engpassleistung, Ansuchen vor Inbetriebnahme",
                icon: CalendarClock,
                inhalt: (
                  <div className="space-y-4">
                    <Hinweis ton="info" titel="Was als Erweiterung zählt">
                      <p>
                        Gefördert wird die zusätzliche Engpassleistung. Ein reiner Modultausch ohne Leistungszuwachs ist in der Regel keine Erweiterung. Erhöht der Tausch die Leistung, kann der
                        Zuwachs förderfähig sein – wir klären das vor dem Ansuchen mit den Unterlagen der EAG-Abwicklungsstelle.
                      </p>
                    </Hinweis>
                    <Hinweis ton="achtung" titel="Fristen beachten">
                      <p>
                        Das Förderansuchen muss in einem der OeMAG-Fördercalls und vor Inbetriebnahme gestellt werden. Zusätzlich kann der Öko-Investitionsfreibetrag genutzt werden – befristet
                        22 % für Anschaffungen bis Ende 2026.
                      </p>
                    </Hinweis>
                  </div>
                ),
              },
              {
                titel: "Worauf es beim Repowering technisch ankommt",
                kurz: "Module, Wechselrichter, Statik, Brandschutz, Regelung",
                icon: SlidersHorizontal,
                inhalt: (
                  <>
                    <p className="mb-4 text-[15.5px] leading-relaxed text-ink-700">
                      Repowering ist mehr als ein Modultausch. Damit die erneuerte Anlage wieder zwanzig Jahre und länger zuverlässig läuft, prüfen wir das Gesamtsystem.
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["Module", "Aktuelle Glas-Glas- oder Glas-Folie-Module mit geprüfter Hagel- und Schneelast"],
                        ["Wechselrichter", "TOR-Erzeuger-konform, in der Wechselrichterliste geführt, speicher- und ersatzstromfähig"],
                        ["Unterkonstruktion & Statik", "Nachweis für Schnee- und Windlast nach ÖNORM B 1991-1-3/-4"],
                        ["Brandschutz & Kabel", "OVE R 11-1, Leitungsführung, Steckverbinder, Freischaltstelle"],
                        ["Regelung", "EZA-Regler bzw. Parkregler, Einspeiselimit und Blindleistung nach Vorgabe des Netzbetreibers"],
                        ["Netz & Regelung", "Neue Wechselrichter nach TOR Erzeuger, bei größeren Anlagen EZA-Regler – für stabile Einspeisung und weniger Abregelung"],
                      ].map(([t, x]) => (
                        <li key={t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                          <p className="font-display text-[15.5px] font-bold text-ink-900">{t}</p>
                          <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{x}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                      Welche Wechselrichter wir bei Erweiterung und Erneuerung einsetzen und wie wir sie auslegen, zeigt die Seite{" "}
                      <Link href="/produkte/wechselrichter" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                        Wechselrichter
                      </Link>
                      .
                    </p>
                  </>
                ),
              },
            ]}
          />
        </div>
      </Section>

      {/* Service für Wechselrichter anderer Hersteller: nur nach Entscheidung E4 (partner.js, derzeit nicht freigegeben) */}
      {SERVICE_FREMDMARKEN.freigegeben && (
        <Section tone="sand" space="md" id="alle-hersteller" className="scroll-mt-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="Hersteller" title={SERVICE_FREMDMARKEN.titel} />
            <p className="mt-5 text-[16px] leading-relaxed text-ink-600">{SERVICE_FREMDMARKEN.text}</p>
          </div>
        </Section>
      )}

      {/* Ablauf */}
      <Dunkel space="md" glow="rechts">
        <SectionHeading dark eyebrow="Ablauf" title="So läuft Ihr Repowering ab" align="center" className="mb-14" />
        <Steps
          tone="dark"
          items={[
            { icon: ClipboardCheck, title: "Anlagencheck", text: "Ertragsdaten, Thermografie, Messungen, Dach, Unterkonstruktion und Verträge (OeMAG, Netzbetreiber)." },
            { icon: LayoutGrid, title: "Varianten", text: "Tausch, Erweiterung, Speicher oder Kombination – mit Wirtschaftlichkeit, Förderung und Finanzierung." },
            { icon: Recycle, title: "Umbau", text: "Rückbau, Montage, fachgerechte Verwertung der Altmodule, Prüfung und Anlagenbuch." },
            { icon: ShieldCheck, title: "Meldung & Betrieb", text: "Netzbetreiber, OeMAG und Förderstelle, danach Monitoring und Wartung." },
          ]}
        />
      </Dunkel>

      <AnfrageSektion
        titel="Repowering-Check anfragen"
        lead="Senden Sie uns die Eckdaten Ihrer Bestandsanlage. Wir melden uns mit Rückfragen und einem Termin für den Anlagencheck."
        schritte={["Sie senden Anlagendaten und Vertragsstatus.", "Anlagencheck vor Ort mit Messung und Thermografie.", "Varianten mit Wirtschaftlichkeit, Förderung und Angebot."]}
        formular={{
          betreff: "Repowering-Check",
          thema: "Photovoltaik",
          titel: "Anfrage Repowering-Check",
          absenden: "Check anfragen",
          felder: [
            { name: "anlagengroesse", label: "Bestehende Leistung", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 150" },
            { name: "baujahr", label: "Baujahr / Inbetriebnahme", typ: "zahl", pflicht: true, placeholder: "z. B. 2012" },
            { name: "wechselrichter", label: "Wechselrichter (Hersteller, Anzahl)", placeholder: "z. B. 6 Geräte, Hersteller und Typ laut Typenschild", breit: true },
            { name: "vertrag", label: "Vermarktung heute", typ: "auswahl", optionen: ["OeMAG-Tarif läuft noch", "OeMAG-Tarif ausgelaufen / Marktpreis", "Stromhändler", "Überschusseinspeisung mit Eigenverbrauch", "Unbekannt"] },
            { name: "ziel", label: "Ziel", typ: "auswahl", optionen: ["Mehr Ertrag auf gleicher Fläche", "Erweiterung", "Speicher nachrüsten", "Wechselrichter defekt", "Dachsanierung geplant", "Bitte beraten"] },
          ],
        }}
      />

      <FaqSektion items={FAQ} titel="Repowering – kurz & ehrlich beantwortet" tone="white" />

      <Querverweise pfad={PFAD} />

      <Abschluss
        links={[
          { href: "/ratgeber/photovoltaik-nach-20-jahren", art: "Ratgeber", titel: "Photovoltaik nach Tarifende" },
          { href: "/ratgeber/oemag-marktpreis", art: "Ratgeber", titel: "OeMAG-Marktpreis" },
          { href: "/ratgeber/eag-investitionszuschuss", art: "Ratgeber", titel: "EAG-Investitionszuschuss" },
          { href: "/ratgeber/energiegemeinschaft-gewerbe", art: "Ratgeber", titel: "Energiegemeinschaft für Betriebe" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/service/finanzierung", art: "Service", titel: "Finanzierung & Leasing" },
          { href: "/technik/parkregler", art: "Technik", titel: "Parkregler (EZA-Regler)" },
          { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher" },
          { href: "/produkte/wechselrichter", art: "Produkt", titel: "Wechselrichter" },
          { href: "/ratgeber/photovoltaik-angebot-vergleichen#pv-firma-pruefen", art: "Ratgeber", titel: "Checkliste „PV-Firma prüfen“" },
        ]}
        quellen={[
          { titel: "Erneuerbaren-Ausbau-Gesetz § 56 – Investitionszuschüsse Photovoltaik", href: "https://www.jusline.at/gesetz/eag/paragraf/56" },
          { titel: "EAG-Abwicklungsstelle – Investitionszuschuss Photovoltaik & Speicher", href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
          { titel: "OeMAG – Marktpreis", href: "https://www.oem-ag.at/marktpreis" },
          { titel: "Oesterreichs Energie – Wechselrichterliste TOR Erzeuger Typ A", href: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/wechselrichterliste-tor-erzeuger-typ-a" },
          { titel: "WKO – Investitionsfreibetrag", href: "https://www.wko.at/steuern/investitionsfreibetrag" },
        ]}
      />

      <CtaBand
        eyebrow="Repowering"
        title="Holen Sie aus Ihrem Dach wieder das Maximum heraus."
        text="Wir prüfen Ihre Bestandsanlage, rechnen Tausch, Erweiterung und Speicher ehrlich durch – mit EAG-Förderung und Finanzierung – und setzen die beste Variante aus einer Hand um."
        primary={{ label: "Repowering-Check anfragen", href: "#anfrage" }}
        secondary={{ label: "Speicher nachrüsten", href: "/gewerbespeicher", icon: BatteryCharging }}
      />
    </div>
  );
}
