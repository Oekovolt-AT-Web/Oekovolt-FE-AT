// service/versicherung/page.js – Österreich: PV-Versicherung (technische Beratung, Unterlagen, Schadenfall)
//
// WICHTIG: Ökovolt tritt NICHT als Versicherungsvermittler auf (keine Berechtigung nach § 137 GewO
// bekannt). Die Seite bietet technische Risikoberatung, Unterlagen und Schadensdokumentation.

import { Bird, CloudHail, FileCheck2, FileText, Flame, Lock, PhoneCall, Search, ShieldCheck, Snowflake, Wind, Wrench, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
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

const PFAD = "/service/versicherung";
const TITEL = "PV-Versicherung: Beratung & Unterlagen | Ökovolt";
const BESCHREIBUNG =
  "PV-Versicherung für Gewerbeanlagen in Österreich: Allgefahren, Ertragsausfall, Haftpflicht, Hagel, Schnee – technische Beratung, Nachweise und Schadenshilfe.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const SPARTEN = [
  ["Photovoltaik- bzw. Elektronikversicherung (Allgefahren)", "Sachschäden an Modulen, Wechselrichtern, Speicher, Verkabelung und Unterkonstruktion durch unvorhergesehene Ereignisse", "Hagel, Sturm, Schneedruck, Blitz und Überspannung, Kurzschluss, Bedienungsfehler, Diebstahl, Vandalismus, Tierbiss – je nach Bedingungen"],
  ["Ertragsausfall bzw. Betriebsunterbrechung", "Entgangene Einspeiseerlöse und Mehrkosten für Netzstrom, solange die Anlage nach einem Sachschaden steht", "Haftzeit und zeitlicher Selbstbehalt entscheiden über die Höhe"],
  ["Betreiberhaftpflicht", "Schäden Dritter, die von der Anlage ausgehen – etwa herabfallende Teile oder ein übergreifender Brand", "Oft über die Betriebshaftpflicht einschließbar; prüfen, ob Stromerzeugung und Einspeisung mitversichert sind"],
  ["Montageversicherung", "Schäden während der Errichtung bis zur Abnahme", "Zuständigkeit zwischen Errichter und Auftraggeber im Vertrag klären"],
  ["Gebäude- und Feuerversicherung", "Das Gebäude selbst; PV teils als Gebäudebestandteil mitversicherbar", "Die Errichtung kann eine anzeigepflichtige Gefahrerhöhung sein – Versicherer vorab informieren"],
];

const UNTERLAGEN = [
  "Anlagenleistung, Neuwert laut Rechnung, Inbetriebnahmedatum",
  "Datenblätter von Modulen, Wechselrichtern und Speicher – inkl. Hagelwiderstandsklasse und Prüflasten",
  "Statiknachweis und Auslegung für Schnee- und Windlast am Standort (eHORA)",
  "Prüfbefund nach OVE E 8101 und Messprotokolle nach OVE EN 62446-1",
  "Blitz- und Überspannungsschutzkonzept",
  "Brandschutz nach OVE R 11-1: Kennzeichnung, Feuerwehrplan, Abschaltkonzept",
  "Nachweis von Monitoring, Alarmierung und Wartungsvertrag",
  "Fotodokumentation der Anlage im Neuzustand",
];

const FAQ = [
  {
    q: "Ist die PV-Anlage in der Gebäude- oder Betriebsversicherung automatisch mitversichert?",
    a: "Nicht automatisch. Manche Gebäudeversicherungen schließen PV-Anlagen als Gebäudebestandteil ein, oft aber nur für bestimmte Gefahren wie Feuer, Sturm und Hagel und bis zu einer Summe. Klären Sie das vor der Errichtung schriftlich mit Ihrem Versicherer oder Makler – die Errichtung kann zudem eine anzeigepflichtige Gefahrerhöhung sein.",
  },
  {
    q: "Was ist der Unterschied zwischen Feuer- und Allgefahrendeckung?",
    a: "Die Feuer- oder Sturmversicherung zahlt nur für die ausdrücklich genannten Gefahren. Eine Allgefahren- bzw. Elektronikversicherung deckt grundsätzlich alle unvorhergesehenen Sachschäden – außer den im Vertrag ausgeschlossenen, typischerweise Verschleiß und Abnutzung. Für Gewerbeanlagen ist die Allgefahrendeckung üblich.",
  },
  {
    q: "Verkauft oder vermittelt Ökovolt Versicherungen?",
    a: "Nein. Ökovolt ist Elektrotechnik-Fachbetrieb, kein Versicherungsvermittler. Wir beraten technisch zu Risiken und Schutzmaßnahmen, stellen Unterlagen und Nachweise für Ihren Versicherer oder Makler zusammen und unterstützen im Schadenfall mit Begutachtung, Dokumentation und Reparatur.",
  },
  {
    q: "Welche Hagelwiderstandsklasse sollten Module haben?",
    a: "Das Hagelregister unterscheidet fünf Klassen: HW 1 bis HW 5 entsprechen Hagelkörnern von 1 bis 5 cm Durchmesser. Welche Klasse sinnvoll ist, hängt vom Standort ab. Wir prüfen die Hagelgefährdung und empfehlen Module, deren Prüfung im Register nachvollziehbar ist – manche Versicherer honorieren das.",
  },
  {
    q: "Was tun nach einem Hagelschaden?",
    a: "Nichts selbst auf dem Dach unternehmen. Den Schaden unverzüglich dem Versicherer melden, Fotos vom Boden aus machen und die Monitoring-Daten sichern. Wir dokumentieren den Schaden mit Sichtprüfung, Thermografie und bei Bedarf Elektrolumineszenz – denn Mikrorisse durch Hagel sind mit bloßem Auge oft nicht sichtbar – und erstellen einen Kostenvoranschlag für die Instandsetzung.",
  },
  {
    q: "Deckt die Versicherung Marderbiss an Kabeln?",
    a: "Viele Photovoltaik-Allgefahrenversicherungen schließen Tierbiss ein, teils mit Folgeschäden wie Kurzschluss. Prüfen Sie das in den Bedingungen. Technisch beugen Schutzrohre, geschlossene Kabelkanäle und saubere Leitungsführung vor.",
  },
  {
    q: "Warum verlangen Versicherer Wartung und Prüfbefunde?",
    a: "Versicherungsbedingungen enthalten Obliegenheiten: Die Anlage ist in ordnungsgemäßem Zustand zu halten, vorgeschriebene Prüfungen sind durchzuführen und Mängel zu beheben. Werden sie verletzt, kann der Versicherer nach § 6 VersVG – abhängig von Verschulden und Auswirkung – ganz oder teilweise leistungsfrei werden. Prüfbefund und Wartungsprotokoll sind Ihr Nachweis.",
  },
  {
    q: "Bietet die Österreichische Hagelversicherung PV-Deckungen an?",
    a: "Die Österreichische Hagelversicherung ist auf landwirtschaftliche Kulturen spezialisiert. PV-Anlagen – auch in der Landwirtschaft und bei Agri-PV – werden in der Regel über eine Sach- bzw. Photovoltaikversicherung abgesichert. Klären Sie bei Agri-PV zusätzlich, wie Kultur und Anlage getrennt versichert sind.",
  },
];

export default function VersicherungPage() {
  return (
    <div>
      <JsonLd
        daten={serviceSchema({
          pfad: PFAD,
          name: "Technische Beratung zur PV-Versicherung und Schadensdokumentation",
          beschreibung: BESCHREIBUNG,
          serviceType: "Technische Risikoberatung, Versicherungsunterlagen und Schadensbegutachtung für PV-Anlagen",
        })}
      />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "PV-Versicherung" }]}
        eyebrow="PV-Versicherung · technische Beratung"
        title={<>PV-Anlage richtig absichern – <span className="ov-text-gradient">mit den richtigen Nachweisen</span></>}
        lead="Hagel, Schneedruck, Überspannung, Diebstahl, Marder: Eine Gewerbeanlage braucht passenden Versicherungsschutz. Wir sind kein Versicherer und kein Vermittler – aber wir wissen, welche Risiken technisch zählen, welche Unterlagen Versicherer sehen wollen und was im Schadenfall zu tun ist."
        image={{ src: "/Images/Ratgeber/photovoltaik-im-winter.jpg", alt: "Photovoltaikmodule unter einer Schneedecke im Winter" }}
        points={["Allgefahren, Ertragsausfall, Haftpflicht", "Hagel- und Schneelast-Check", "Unterlagen für Versicherer & Makler", "Begutachtung im Schadenfall"]}
        actions={[
          { label: "Beratung anfragen", href: "#anfrage" },
          { label: "Schadenfall melden", href: "#schadenfall", icon: PhoneCall },
        ]}
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Versicherungsarten"
          title="Welche Versicherungen eine Gewerbe-PV-Anlage braucht"
          lead="Für eine Gewerbeanlage sind drei Deckungen Standard: eine Allgefahren- bzw. Elektronikversicherung für Sachschäden, eine Ertragsausfalldeckung und eine Betreiberhaftpflicht. Dazu kommen Montage- und Gebäudeversicherung."
          className="mb-10"
        />
        <Tabelle kopf={["Sparte", "Was sie abdeckt", "Worauf achten"]} zeilen={SPARTEN} kompakt quelle="Allgemeine Übersicht. Umfang, Ausschlüsse und Selbstbehalte regeln ausschließlich die Bedingungen Ihres Vertrags." />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Risiken in Österreich"
          title="Die Gefahren, gegen die sich PV-Betreiber absichern"
          lead="Die meisten Schäden lassen sich technisch vorbeugen – und genau das senkt das Risiko für Versicherer und Betreiber."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: CloudHail, title: "Hagel", text: "Module mit geprüfter Hagelwiderstandsklasse (HW 1–5 im Hagelregister) und dickerem Frontglas halten mehr aus. Nach Hagel zeigt die EL-Aufnahme verdeckte Zellbrüche." },
            { icon: Snowflake, title: "Schneedruck", text: "Modul und Unterkonstruktion müssen für die Schneelastzone nach ÖNORM B 1991-1-3 ausgelegt sein – besonders im alpinen Raum. eHORA zeigt die Zone Ihres Standorts." },
            { icon: Zap, title: "Blitz & Überspannung", text: "Überspannungsschutz auf DC- und AC-Seite und Trennungsabstände zum Blitzschutz verhindern Folgeschäden an Wechselrichtern." },
            { icon: Wind, title: "Sturm", text: "Ballast und Befestigung nach Windlast (ÖNORM B 1991-1-4), besonders an Rand- und Eckbereichen von Flachdächern." },
            { icon: Lock, title: "Diebstahl & Vandalismus", text: "Freiflächen brauchen Zaun, Beleuchtung oder Videoüberwachung und diebstahlhemmende Schrauben – Versicherer fragen danach." },
            { icon: Bird, title: "Marder & Tierbiss", text: "Geschützte Kabelführung in Rohren und geschlossenen Kanälen. Viele Allgefahrendeckungen schließen Tierbiss ein – Bedingungen prüfen." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Was Ökovolt tut" title="Technische Beratung, Unterlagen und Schadenshilfe" />
            <Reveal delay={80}>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Search, t: "Risikoberatung", x: "Hagelklasse, Schnee- und Windlast, Blitz- und Brandschutz – bei Planung und Bestand." },
                  { icon: FileText, t: "Unterlagen für Versicherer", x: "Anlagenpass, Datenblätter, Prüfbefund, Fotos und Schutzkonzepte gebündelt für Ihren Versicherer oder Makler." },
                  { icon: FileCheck2, t: "Obliegenheiten erfüllen", x: "Wartung und Prüfung im nötigen Intervall – dokumentiert und jederzeit vorlegbar." },
                  { icon: Wrench, t: "Schadenfall", x: "Begutachtung, Thermografie und EL, Kostenvoranschlag und Instandsetzung aus einer Hand." },
                ].map((k) => (
                  <li key={k.t} className="flex gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-600 text-white">
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
            <Hinweis ton="recht" titel="Keine Versicherungsvermittlung">
              <p>
                Ökovolt ist ein Elektrotechnik-Fachbetrieb und kein Versicherungsvermittler im Sinne der Gewerbeordnung. Wir bieten keine Versicherungsprodukte an, beraten nicht zu Tarifen
                und nehmen keine Anträge entgegen. Mit Versicherern und Maklern arbeiten wir auf technischer Ebene zusammen – bei Besichtigungen, Unterlagen und im Schadenfall.
              </p>
            </Hinweis>
            <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Checkliste</p>
              <h3 className="mt-2 font-display text-[19px] font-bold text-ink-900">Diese Unterlagen wollen Versicherer sehen</h3>
              <ul className="mt-5 space-y-2.5">
                {UNTERLAGEN.map((u) => (
                  <li key={u} className="flex gap-3 text-[15px] leading-relaxed text-ink-700">
                    <ShieldCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                    {u}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="navy" space="lg" id="schadenfall" className="scroll-mt-24 overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative">
          <SectionHeading dark eyebrow="Schadenfall" title="Nach Hagel, Sturm oder Brand: in dieser Reihenfolge" align="center" className="mb-14" />
          <Steps
            tone="dark"
            cols={4}
            items={[
              { icon: Flame, title: "Sichern", text: "Bei Brand oder Rauch Feuerwehr rufen. Nicht auf das Dach steigen; beschädigte Module können unter Spannung stehen." },
              { icon: PhoneCall, title: "Melden", text: "Schaden unverzüglich dem Versicherer melden – das ist eine Obliegenheit. Uns parallel informieren." },
              { icon: FileText, title: "Dokumentieren", text: "Fotos vom Boden aus, Monitoring-Daten und Wetterereignis sichern. Nichts entsorgen, bevor der Versicherer zustimmt." },
              { icon: Search, title: "Begutachten & Instandsetzen", text: "Sichtprüfung, Thermografie, EL und Messungen, Kostenvoranschlag – nach Freigabe Reparatur und Nachprüfung." },
            ]}
          />
        </div>
      </Section>

      <AnfrageSektion
        titel="Technische Beratung oder Schadensbegutachtung anfragen"
        lead="Ob neue Anlage, Bestandsanlage oder akuter Schaden – beschreiben Sie Ihr Anliegen, wir melden uns mit den nächsten Schritten."
        schritte={["Sie beschreiben Anlage und Anliegen.", "Wir klären, welche Unterlagen, Prüfungen oder Begutachtungen nötig sind.", "Sie erhalten Nachweise für Ihren Versicherer oder Makler bzw. einen Termin zur Begutachtung."]}
        formular={{
          betreff: "PV-Versicherung – technische Beratung / Schadenfall",
          thema: "Service & Wartung",
          titel: "Anfrage Versicherungsunterlagen & Schadenfall",
          absenden: "Anfrage senden",
          felder: [
            { name: "anliegen", label: "Anliegen", typ: "auswahl", pflicht: true, optionen: ["Unterlagen für ein Versicherungsangebot", "Risikoberatung Hagel, Schnee, Blitz, Brand", "Nachweis für Obliegenheiten (Prüfung, Wartung)", "Schadenfall – Begutachtung und Reparatur"] },
            { name: "anlagengroesse", label: "Anlagengröße", typ: "zahl", einheit: "kWp", placeholder: "z. B. 300" },
            { name: "baujahr", label: "Baujahr / Inbetriebnahme", typ: "zahl", placeholder: "z. B. 2021" },
            { name: "schaden", label: "Schadensart (falls zutreffend)", typ: "auswahl", optionen: ["Kein Schaden", "Hagel", "Sturm", "Schneedruck", "Blitz / Überspannung", "Brand", "Diebstahl / Vandalismus", "Tierbiss", "Sonstiges"] },
          ],
        }}
      />

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag", text: "Obliegenheiten erfüllen und nachweisen." },
            { href: "/service/e-check", art: "Service", titel: "E-Check & Prüfbefund", text: "Wiederkehrende Prüfung nach OVE E 8101." },
            { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie", text: "Schäden nach Hagel großflächig erfassen." },
            { href: "/standort-check", art: "Tool", titel: "Standort-Check mit eHORA", text: "Schneelast, Wind und Hagel für Ihre Adresse." },
            { href: "/ratgeber/photovoltaik-versicherung", art: "Ratgeber", titel: "Photovoltaik-Versicherung", text: "Deckungen, Ausschlüsse und Kosten in Österreich." },
            { href: "/ratgeber/hagel-photovoltaik", art: "Ratgeber", titel: "Hagel & Photovoltaik", text: "Hagelwiderstandsklassen und Hagelregister." },
            { href: "/ratgeber/schneelast-photovoltaik", art: "Ratgeber", titel: "Schneelast", text: "ÖNORM B 1991-1-3, Zonen und Prüflasten." },
            { href: "/ratgeber/photovoltaik-brandschutz", art: "Ratgeber", titel: "Brandschutz", text: "OVE R 11-1 und Anforderungen der Feuerwehr." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="PV-Versicherung – häufige Fragen" lead="Allgemeine Informationen, keine Versicherungs- oder Rechtsberatung." tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Sicherheit und Absicherung" />

      <Quellen
        items={[
          { titel: "Versicherungsvertragsgesetz (VersVG) § 6 – Obliegenheiten", href: "https://www.jusline.at/gesetz/versvg/paragraf/6" },
          { titel: "Hagelregister – Hagelwiderstandsklassen HW 1–5", href: "https://www.hagelregister.at/" },
          { titel: "VVO – Photovoltaik-Sicherheitsleitfaden", href: "https://vvonet.vvo.at/vvo/vvonet_website.nsf/sysPages/Photovolatik_Sicherheitsleitfaden.html/$file/PV_Sicherheitsleitfaden.pdf" },
          { titel: "OVE – Normen und Richtlinien für PV-Anlagen (u. a. OVE R 11-1)", href: "https://www.ove.at/ove-news/details/normen-und-richtlinien-fuer-photovoltaik-anlagen/" },
          { titel: "Österreichische Hagelversicherung – Position zu PV auf „toter Substanz“", href: "https://www.hagel.at/presseaussendungen/hagelversicherung-ja-zur-photovoltaik-auf-toter-substanz/" },
          { titel: "WKO – Tippgeber und Versicherungsvermittlung", href: "https://www.wko.at/oe/handel/versicherungsagenten/tippgeber", hinweis: "Abgrenzung zur Versicherungsvermittlung nach § 137 GewO" },
        ]}
      />

      <CtaBand
        eyebrow="PV-Versicherung"
        title="Gut versichert beginnt mit guter Technik und sauberen Nachweisen."
        text="Wir beraten technisch zu Hagel, Schnee, Blitz und Brand, stellen Unterlagen für Ihren Versicherer zusammen und helfen im Schadenfall – schnell und dokumentiert."
        primary={{ label: "Beratung anfragen", href: "#anfrage" }}
        secondary={{ label: "Wartung als Nachweis", href: "/service/wartung", icon: ShieldCheck }}
      />
    </div>
  );
}
