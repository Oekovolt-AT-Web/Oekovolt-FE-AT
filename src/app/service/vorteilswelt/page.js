// service/vorteilswelt/page.js – Österreich: Ökovolt Vorteilswelt (Empfehlungsprogramm, PV Award, Solensa, Partner)
//
// Kein Prämienbetrag im Code: Höhe und Bedingungen der Empfehlungsprämie für
// Österreich regeln die Teilnahmebedingungen (offener Punkt im Bericht).

import { Clapperboard, Gift, Handshake, HeartHandshake, Link2, Send, Trophy, UserPlus, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import PraemienRechner from "@/components/Vorteilswelt/PraemienRechner";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import { SOLENSA } from "@/lib/site";

const PFAD = "/service/vorteilswelt";
const TITEL = "Ökovolt Vorteilswelt für Kunden & Partner | Ökovolt";
const BESCHREIBUNG =
  "Die Ökovolt Vorteilswelt: Empfehlungsprogramm für Unternehmen, Landwirtschaft und Gemeinden, PV Award, Nachhaltigkeitsmarketing mit Solensa und Partnerprogramm.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const SCHRITTE = [
  { icon: UserPlus, title: "Registrieren", text: "Melden Sie sich über das Formular als Empfehlungsgeber an. Sie erhalten Ihren persönlichen Empfehlungslink und die Teilnahmebedingungen." },
  { icon: Send, title: "Teilen", text: "Senden Sie den Link per E-Mail, WhatsApp oder LinkedIn – mit unserem Textvorschlag für Unternehmen, Landwirtschaft, Gemeinden oder Privat." },
  { icon: Link2, title: "Zuordnen", text: "Nimmt jemand über Ihren Link Kontakt auf, wird die Anfrage Ihrer Empfehlung zugeordnet." },
  { icon: Gift, title: "Prämie erhalten", text: "Entsteht daraus ein Vertrag mit Ökovolt, erhalten Sie die Prämie gemäß Teilnahmebedingungen. Wir informieren Sie über die Gutschrift." },
];

const FAQ = [
  {
    q: "Was ist die Ökovolt Vorteilswelt?",
    a: "Die Vorteilswelt bündelt, was Kundinnen, Kunden und Partner von Ökovolt über die eigene Anlage hinaus nutzen können: das Empfehlungsprogramm, den jährlichen Ökovolt PV Award, Nachhaltigkeitsmarketing mit der Solensa GmbH sowie Programme für Elektro-Partner und Sponsoring.",
  },
  {
    q: "Wer kann am Empfehlungsprogramm teilnehmen?",
    a: "Alle, die Ökovolt aus eigener Erfahrung weiterempfehlen möchten – vor allem Unternehmen, landwirtschaftliche Betriebe, Gemeinden und Privatkunden mit einer Ökovolt-Anlage. Die genauen Voraussetzungen stehen in den Teilnahmebedingungen, die Sie bei der Registrierung erhalten.",
  },
  {
    q: "Wie hoch ist die Empfehlungsprämie?",
    a: "Höhe, Voraussetzungen und Auszahlung der Prämie regeln die aktuellen Teilnahmebedingungen für Österreich. Sie erhalten sie mit der Registrierung. Eine Empfehlung gilt als erfolgreich, wenn über Ihren Link ein Vertrag mit Ökovolt entsteht.",
  },
  {
    q: "Können auch Unternehmen andere Unternehmen empfehlen?",
    a: "Ja, gerade Empfehlungen zwischen Betrieben sind wertvoll: Wer eine Gewerbeanlage mit Ökovolt umgesetzt hat, kann Geschäftspartnern, Kunden oder Nachbarbetrieben aus erster Hand berichten. Der Textvorschlag für Unternehmen hilft dabei.",
  },
  {
    q: "Wie nehme ich am Ökovolt PV Award teil?",
    a: "Mit dem PV Award zeichnen wir jährlich Kundinnen und Kunden für die besten Anlagen und Nachhaltigkeitsinvestitionen aus. Informationen zu Kategorien und Einreichung finden Sie auf der Seite zum PV Award.",
  },
  {
    q: "Ich bin Elektrotechniker – kann ich mit Ökovolt zusammenarbeiten?",
    a: "Ja. Über das Elektro-Partnerprogramm können sich Elektrotechnikbetriebe als Subunternehmer registrieren. Ökovolt ist dabei die zentrale Plattform für Projekte in ganz Österreich.",
  },
];

export default function VorteilsweltPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "In vier Schritten Ökovolt weiterempfehlen",
    step: SCHRITTE.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
  };

  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Ökovolt Vorteilswelt – Empfehlungsprogramm und Kundenvorteile", beschreibung: BESCHREIBUNG, serviceType: "Kunden- und Empfehlungsprogramm" })} />
      <JsonLd daten={howToSchema} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Vorteilswelt" }]}
        eyebrow="Ökovolt Vorteilswelt · für Kunden & Partner"
        title={<>Gute Anlagen sprechen sich herum. <span className="ov-text-gradient">Wir sagen Danke.</span></>}
        lead="Sie sind mit Ihrer Anlage zufrieden? Dann empfehlen Sie Ökovolt weiter – an Geschäftspartner, Nachbarbetriebe, Ihre Gemeinde oder Bekannte. Dazu gehören in der Vorteilswelt der Ökovolt PV Award, Nachhaltigkeitsmarketing mit Solensa und das Partnerprogramm für Elektrotechnikbetriebe."
        image={{ src: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-02-11-14-15-57-utc.jpg", alt: "Zwei Techniker montieren Solarmodule auf einer großen PV-Anlage" }}
        points={["Empfehlungsprogramm mit Prämie", "Textvorschläge für Betriebe & Gemeinden", "Ökovolt PV Award", "Nachhaltigkeitsmarketing mit Solensa"]}
        actions={[
          { label: "Als Empfehlungsgeber registrieren", href: "#anmelden" },
          { label: "Text zum Teilen", href: "#baukasten", icon: Send },
        ]}
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vorteilswelt"
          title="Mehr als eine Anlage: was Ökovolt-Kunden zusätzlich nutzen können"
          lead="Die Vorteilswelt verbindet Kundinnen, Kunden und Partner, die die Energiewende in Österreich mit uns umsetzen."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Gift, title: "Empfehlungsprogramm", text: "Empfehlen Sie Ökovolt weiter und erhalten Sie eine Prämie, wenn daraus ein Vertrag entsteht – gemäß Teilnahmebedingungen.", href: "#anmelden" },
            { icon: Trophy, title: "Ökovolt PV Award", text: "Jährliche Auszeichnung für die besten Anlagen und Nachhaltigkeitsinvestitionen unserer Kundinnen und Kunden.", href: "/pv-award" },
            { icon: Clapperboard, title: "Nachhaltigkeitsmarketing", text: `Video, Imagespot und ESG-Kennzahlen zu Ihrer Anlage – umgesetzt von der ${SOLENSA.name}.`, href: "/service/nachhaltigkeitsmarketing" },
            { icon: Wrench, title: "Service für Bestandskunden", text: "Wartungsvertrag, Anlagenprüfung, Repowering-Check und Speicher-Nachrüstung aus einer Hand.", href: "/service/wartung" },
            { icon: Handshake, title: "Elektro-Partnerprogramm", text: "Für Elektrotechnikbetriebe: als Subunternehmer registrieren und an Projekten in ganz Österreich mitarbeiten.", href: "/partner" },
            { icon: HeartHandshake, title: "Sponsoring", text: "Vereine, Kultur und Nachwuchs in der Region – Anfragen über das Sponsoring-Formular.", href: "/sponsoring" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Empfehlungsprogramm" title="In vier Schritten weiterempfehlen" align="center" className="mb-14" />
        <Steps items={SCHRITTE} />
        <Hinweis ton="info" titel="Prämie und Teilnahmebedingungen" className="mx-auto mt-12 max-w-3xl">
          <p>
            Höhe, Voraussetzungen und Auszahlung der Empfehlungsprämie regeln die aktuellen Teilnahmebedingungen für Österreich. Sie erhalten sie zusammen mit Ihrem persönlichen
            Empfehlungslink nach der Registrierung.
          </p>
        </Hinweis>
      </Section>

      <Section id="baukasten" tone="navy" space="lg" className="scroll-mt-24 overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[480px] w-[480px] rounded-full bg-ov-500/25 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            align="center"
            eyebrow="Empfehlungs-Baukasten"
            title={<>Die passenden Worte – <span className="ov-text-gradient-light">für jede Empfehlung</span></>}
            lead="Wählen Sie, wem Sie Ökovolt empfehlen, und teilen Sie den Textvorschlag direkt. Ersetzen Sie den Link durch Ihren persönlichen Empfehlungslink."
            className="mb-12"
          />
          <Reveal dir="scale">
            <PraemienRechner />
          </Reveal>
        </div>
      </Section>

      <AnfrageSektion
        id="anmelden"
        tone="white"
        eyebrow="Registrierung"
        titel="Als Empfehlungsgeber registrieren"
        lead="Nach der Registrierung erhalten Sie Ihren persönlichen Empfehlungslink und die Teilnahmebedingungen per E-Mail."
        schritte={["Formular ausfüllen – Angaben zu Ihrer Ökovolt-Anlage genügen.", "Wir prüfen die Registrierung und senden Link und Teilnahmebedingungen.", "Sie teilen den Link – wir kümmern uns um den Rest."]}
        formular={{
          betreff: "Registrierung Empfehlungsprogramm (Vorteilswelt)",
          thema: "Sonstiges",
          titel: "Registrierung Vorteilswelt",
          absenden: "Registrieren",
          nachrichtLabel: "Anmerkungen",
          nachrichtPlaceholder: "z. B. wen Sie empfehlen möchten oder Fragen zum Programm",
          felder: [
            { name: "rolle", label: "Ich bin", typ: "auswahl", pflicht: true, optionen: ["Kunde mit Ökovolt-Anlage (Unternehmen)", "Kunde mit Ökovolt-Anlage (Landwirtschaft)", "Kunde mit Ökovolt-Anlage (Gemeinde)", "Kunde mit Ökovolt-Anlage (Privat)", "Geschäftspartner", "Sonstiges"] },
            { name: "interesse", label: "Interesse an", typ: "auswahl", optionen: ["Empfehlungsprogramm", "Ökovolt PV Award", "Nachhaltigkeitsmarketing mit Solensa", "Alles davon"] },
            { name: "projekt", label: "Projekt / Anlage (falls bekannt)", placeholder: "z. B. Kundennummer oder Inbetriebnahmejahr", breit: true },
          ],
        }}
      />

      <FaqSektion items={FAQ} titel="Vorteilswelt – kurz erklärt" tone="sand" />

      <Querverweise pfad={PFAD} />

      <CtaBand
        eyebrow="Vorteilswelt"
        title="Empfehlen, teilen, Danke sagen lassen."
        text="Registrieren Sie sich als Empfehlungsgeber – Ihren persönlichen Link und die Teilnahmebedingungen erhalten Sie per E-Mail. Oder reichen Sie Ihre Anlage beim Ökovolt PV Award ein."
        primary={{ label: "Jetzt registrieren", href: "#anmelden" }}
        secondary={{ label: "Zum PV Award", href: "/pv-award", icon: Trophy }}
      />
    </div>
  );
}
