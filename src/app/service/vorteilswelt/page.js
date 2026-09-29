// service/vorteilswelt/page.js – Österreich: Ökovolt Vorteilswelt (Empfehlungsprogramm, PV Award, Solensa, Partner)
//
// Kein Prämienbetrag im Code: Höhe und Bedingungen der Empfehlungsprämie für
// Österreich regeln die Teilnahmebedingungen (offener Punkt im Bericht).

import { Clapperboard, Gift, Handshake, HeartHandshake, Link2, Send, Trophy, UserPlus, Wrench } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Querverweise from "@/components/Reusable/Querverweise";
import PraemienRechner from "@/components/Vorteilswelt/PraemienRechner";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import FotoBento from "@/components/ServiceAT/B/FotoBento";
import Bildband from "@/components/ServiceAT/B/Bildband";
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
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Ökovolt Vorteilswelt – Empfehlungsprogramm und Kundenvorteile", beschreibung: BESCHREIBUNG, serviceType: "Kunden- und Empfehlungsprogramm" })} />
      <JsonLd daten={howToSchema} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Vorteilswelt" }]}
        eyebrow="Ökovolt Vorteilswelt · für Kunden & Partner"
        title={
          <>
            Gute Anlagen sprechen sich herum. <span className="ov-text-gradient-light">Wir sagen Danke.</span>
          </>
        }
        lead="Sie sind mit Ihrer Anlage zufrieden? Dann empfehlen Sie Ökovolt weiter – an Geschäftspartner, Nachbarbetriebe, Ihre Gemeinde oder Bekannte. Dazu gehören in der Vorteilswelt der Ökovolt PV Award, Nachhaltigkeitsmarketing mit Solensa und das Partnerprogramm für Elektrotechnikbetriebe."
        image={{ src: "/Images/AT/service-b/handschlag-partner.jpg", alt: "Handschlag zweier Geschäftspartner" }}
        points={["Empfehlungsprogramm mit Prämie", "Textvorschläge für Betriebe & Gemeinden", "Ökovolt PV Award", "Nachhaltigkeitsmarketing mit Solensa"]}
        actions={[
          { label: "Als Empfehlungsgeber registrieren", href: "#anmelden" },
          { label: "Text zum Teilen", href: "#baukasten", icon: Send },
        ]}
      />

      <Kennzahlen
        zahlen={[
          { value: 4, label: "Schritte vom Link bis zur Prämie", hinweis: "gemäß Teilnahmebedingungen" },
          { value: 6, label: "Vorteile für Kunden und Partner", hinweis: "Empfehlung, Award, Marketing, Service, Partner, Sponsoring" },
          { value: 9, label: "Bundesländer – Projekte in ganz Österreich" },
          { text: "seit 2012", label: "Ökovolt in Österreich, Gruppe seit 2010" },
        ]}
      />

      {/* Vorteile */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vorteilswelt"
          title="Mehr als eine Anlage: was Ökovolt-Kunden zusätzlich nutzen können"
          lead="Die Vorteilswelt verbindet Kundinnen, Kunden und Partner, die die Energiewende in Österreich mit uns umsetzen."
          className="mb-12"
        />
        <FotoBento
          items={[
            {
              bild: { src: "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg", alt: "Photovoltaik-Freiflächenanlage in Kärnten" },
              icon: Gift,
              tag: "Empfehlungsprogramm",
              titel: "Empfehlen und Danke sagen lassen",
              text: "Empfehlen Sie Ökovolt weiter und erhalten Sie eine Prämie, wenn daraus ein Vertrag entsteht – gemäß Teilnahmebedingungen.",
              href: "#anmelden",
            },
            { bild: { src: "/Images/AT/loesungen/agri-pv-vertikal-bifazial.jpg", alt: "Vertikale Agri-PV-Anlage" }, icon: Trophy, titel: "Ökovolt PV Award", text: "Jährliche Auszeichnung für die besten Anlagen und Nachhaltigkeitsinvestitionen.", href: "/pv-award" },
            { bild: { src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg", alt: "Luftaufnahme eines Hotels mit Photovoltaik" }, icon: Clapperboard, titel: "Nachhaltigkeitsmarketing", text: `Video, Imagespot und ESG-Kennzahlen – umgesetzt von der ${SOLENSA.name}.`, href: "/service/nachhaltigkeitsmarketing" },
            { bild: { src: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Techniker bei der Wartung einer PV-Anlage" }, icon: Wrench, titel: "Service für Bestandskunden", text: "Wartung, Anlagenprüfung, Repowering-Check und Speicher-Nachrüstung.", href: "/service/wartung" },
            { bild: { src: "/Images/Jobs/jobs4.jpg", alt: "Elektrotechniker vor einer Photovoltaikanlage" }, icon: Handshake, titel: "Elektro-Partnerprogramm", text: "Als Subunternehmer registrieren und an Projekten in ganz Österreich mitarbeiten.", href: "/partner" },
            { icon: HeartHandshake, ton: "gruen", titel: "Sponsoring", text: "Vereine, Kultur und Nachwuchs in der Region – Anfragen über das Sponsoring-Formular.", href: "/sponsoring" },
          ]}
        />
      </Section>

      {/* Empfehlungsprogramm + Baukasten */}
      <Dunkel id="baukasten">
        <SectionHeading dark eyebrow="Empfehlungsprogramm" title="In vier Schritten weiterempfehlen" align="center" className="mb-14" />
        <Steps tone="dark" items={SCHRITTE} />
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <SectionHeading
            dark
            align="center"
            eyebrow="Empfehlungs-Baukasten"
            title={
              <>
                Die passenden Worte – <span className="ov-text-gradient-light">für jede Empfehlung</span>
              </>
            }
            lead="Wählen Sie, wem Sie Ökovolt empfehlen, und teilen Sie den Textvorschlag direkt. Ersetzen Sie den Link durch Ihren persönlichen Empfehlungslink."
          />
        </div>
        <Reveal dir="scale" className="mt-12">
          <PraemienRechner />
        </Reveal>
        <p className="mx-auto mt-8 max-w-3xl text-center text-[14px] leading-relaxed text-white/60">
          Höhe, Voraussetzungen und Auszahlung der Empfehlungsprämie regeln die aktuellen Teilnahmebedingungen für Österreich. Sie erhalten sie zusammen mit Ihrem persönlichen
          Empfehlungslink nach der Registrierung.
        </p>
      </Dunkel>

      {/* PV Award */}
      <Bildband
        bild={{ src: "/Images/AT/loesungen/tourismus-pv-skigebiet-wildkogel.jpg", alt: "Photovoltaikanlage in einem alpinen Skigebiet" }}
        eyebrow="Ökovolt PV Award"
        titel="Die besten Anlagen des Jahres verdienen eine Bühne"
        text="Mit dem PV Award zeichnen wir jährlich Kundinnen und Kunden für besonders gelungene Anlagen und Nachhaltigkeitsinvestitionen aus. Ein Video oder eine gute Projektdokumentation – etwa mit der Solensa GmbH – ist eine starke Grundlage für die Einreichung."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/pv-award" icon={Trophy}>
            Zum PV Award
          </Button>
          <Button href="/service/nachhaltigkeitsmarketing" variant="outlineLight" icon={Clapperboard}>
            Nachhaltigkeitsmarketing
          </Button>
        </div>
      </Bildband>

      <AnfrageSektion
        id="anmelden"
        tone="sand"
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

      <FaqSektion items={FAQ} titel="Vorteilswelt – kurz erklärt" tone="white" />

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
