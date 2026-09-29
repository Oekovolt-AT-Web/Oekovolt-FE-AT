// service/versicherung/page.js – Österreich: PV-Versicherung (technische Beratung, Unterlagen, Schadenfall)
//
// WICHTIG: Ökovolt tritt NICHT als Versicherungsvermittler auf (keine Berechtigung nach § 137 GewO
// bekannt). Die Seite bietet technische Risikoberatung, Unterlagen und Schadensdokumentation.

import { FileCheck2, FileText, Flame, Gavel, PhoneCall, Scale, Search, ShieldCheck, Sprout, Wrench } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import FotoBento from "@/components/ServiceAT/B/FotoBento";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import RisikoMatrix from "@/components/ServiceAT/B/RisikoMatrix";
import { FIRMA } from "@/lib/site";

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
      <Stil />
      <JsonLd
        daten={serviceSchema({
          pfad: PFAD,
          name: "Technische Beratung zur PV-Versicherung und Schadensdokumentation",
          beschreibung: BESCHREIBUNG,
          serviceType: "Technische Risikoberatung, Versicherungsunterlagen und Schadensbegutachtung für PV-Anlagen",
        })}
      />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "PV-Versicherung" }]}
        eyebrow="PV-Versicherung · technische Beratung"
        title={
          <>
            PV-Anlage richtig absichern – <span className="ov-text-gradient-light">mit den richtigen Nachweisen</span>
          </>
        }
        lead="Hagel, Schneedruck, Überspannung, Diebstahl, Marder: Eine Gewerbeanlage braucht passenden Versicherungsschutz. Wir sind kein Versicherer und kein Vermittler – aber wir wissen, welche Risiken technisch zählen, welche Unterlagen Versicherer sehen wollen und was im Schadenfall zu tun ist."
        image={{ src: "/Images/AT/service-b/hagel-unwetter.jpg", alt: "Dunkle Gewitterfront mit Böenwalze über flachem Land" }}
        points={["Allgefahren, Ertragsausfall, Haftpflicht", "Hagel- und Schneelast-Check", "Unterlagen für Versicherer & Makler", "Begutachtung im Schadenfall"]}
        actions={[
          { label: "Beratung anfragen", href: "#anfrage" },
          { label: "Schadenfall melden", href: "#schadenfall", icon: PhoneCall },
        ]}
      />

      <Kennzahlen
        frage="Welche Versicherungen braucht eine Gewerbe-PV-Anlage?"
        zahlen={[
          { value: 3, label: "Standard-Deckungen: Allgefahren, Ertragsausfall, Haftpflicht", hinweis: "dazu Montage- und Gebäudeversicherung" },
          { text: "HW 1–5", label: "Hagelwiderstandsklassen im Hagelregister", hinweis: "Hagelkörner von 1 bis 5 cm" },
          { text: "§ 6", label: "VersVG: Obliegenheiten wie Wartung und Prüfung", hinweis: "Verletzung kann Leistungsfreiheit auslösen" },
          { value: 4, label: "Schritte im Schadenfall: sichern, melden, dokumentieren, begutachten", hinweis: "Reihenfolge siehe unten" },
        ]}
      >
        <p>
          <strong>Für Gewerbeanlagen sind drei Deckungen Standard:</strong> eine Allgefahren- bzw. Elektronikversicherung für Sachschäden, eine Ertragsausfalldeckung und eine
          Betreiberhaftpflicht. Dazu kommen Montage- und Gebäudeversicherung. Welche Deckung bei welchem Risiko greift, zeigt die Matrix unten.
        </p>
      </Kennzahlen>

      {/* Risiko-Matrix */}
      <Dunkel id="risiken">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Risiko-Matrix Österreich"
            title={
              <>
                Hagel, Schnee, Blitz, Brand: <span className="ov-text-gradient-light">welche Deckung greift?</span>
              </>
            }
          />
          <Reveal delay={100}>
            <p className="ov-lead text-white/70">
              Wählen Sie ein Risiko – die Matrix zeigt, welche Sparte typischerweise zuständig ist, wie Sie technisch vorbeugen und welche Nachweise Ihr Versicherer sehen will.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale" className="mt-12">
          <RisikoMatrix />
        </Reveal>
      </Dunkel>

      {/* Was Ökovolt tut */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Was Ökovolt tut"
          title="Technische Beratung, Unterlagen und Schadenshilfe"
          lead="Die meisten Schäden lassen sich technisch vorbeugen – und genau das senkt das Risiko für Versicherer und Betreiber. Mit Versicherern und Maklern arbeiten wir auf technischer Ebene zusammen."
          className="mb-12"
        />
        <FotoBento
          items={[
            {
              bild: { src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Drohnenaufnahme von Technikern auf einer Photovoltaikanlage" },
              icon: Search,
              tag: "Planung & Bestand",
              titel: "Risikoberatung",
              text: "Hagelklasse, Schnee- und Windlast, Blitz- und Brandschutz – bei Planung und Bestand, mit Blick auf den Standort.",
            },
            { bild: { src: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Techniker mit Absturzsicherung auf einem Dach" }, icon: FileCheck2, titel: "Obliegenheiten erfüllen", text: "Wartung und Prüfung im nötigen Intervall – dokumentiert und jederzeit vorlegbar." },
            { bild: { src: "/Images/AT/ratgeber/photovoltaik-brandschutz.jpg", alt: "Photovoltaikanlage mit Brandschutzkennzeichnung" }, icon: Wrench, titel: "Schadenfall", text: "Begutachtung, Thermografie und EL, Kostenvoranschlag und Instandsetzung aus einer Hand." },
            { icon: FileText, ton: "gruen", titel: "Unterlagen für Versicherer", text: "Anlagenpass, Datenblätter, Prüfbefund, Fotos und Schutzkonzepte gebündelt für Ihren Versicherer oder Makler." },
          ]}
        />
      </Section>

      {/* Schadenfall */}
      <Dunkel id="schadenfall" space="lg" glow="links">
        <div className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHeading dark eyebrow="Schadenfall" title="Nach Hagel, Sturm oder Brand: in dieser Reihenfolge" />
          <Reveal delay={80} className="ov-glass rounded-3xl p-5 md:p-6">
            <p className="text-[13px] text-white/60">Schaden an Ihrer Anlage? Rufen Sie uns an.</p>
            <a href={FIRMA.telefonHref} className="mt-1 flex items-center gap-3 font-display text-[22px] font-extrabold tracking-tight text-white hover:text-ov-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ov-500">
                <PhoneCall aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              {FIRMA.telefon}
            </a>
          </Reveal>
        </div>
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
      </Dunkel>

      {/* Fachdetails */}
      <Section tone="white" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Für Technik & Einkauf"
              title="Sparten, Obliegenheiten, Sonderfälle"
              lead="Die Details für Ihren Makler, die Geschäftsführung und den Einkauf – kompakt und mit Quellen."
            />
            <Reveal delay={120} className="mt-8">
              <Button href="/standort-check" variant="navy" icon={ShieldCheck}>
                Standort-Check mit eHORA
              </Button>
            </Reveal>
          </div>
          <Fachdetails
            items={[
              {
                titel: "Diese Unterlagen wollen Versicherer sehen",
                kurz: "Checkliste für Antrag und Schadenfall",
                icon: FileCheck2,
                inhalt: (
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {UNTERLAGEN.map((u) => (
                      <li key={u} className="flex gap-2.5 rounded-2xl bg-sand-50 p-3.5 text-[14.5px] leading-snug text-ink-700 ring-1 ring-ink-200/60">
                        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                        {u}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                titel: "Welche Versicherungen eine Gewerbe-PV-Anlage braucht",
                kurz: "Fünf Sparten im Überblick",
                icon: ShieldCheck,
                inhalt: (
                  <Tabelle
                    kopf={["Sparte", "Was sie abdeckt", "Worauf achten"]}
                    zeilen={SPARTEN}
                    kompakt
                    quelle="Allgemeine Übersicht. Umfang, Ausschlüsse und Selbstbehalte regeln ausschließlich die Bedingungen Ihres Vertrags."
                  />
                ),
              },
              {
                titel: "Obliegenheiten nach § 6 VersVG",
                kurz: "Warum Wartung und Prüfbefund zählen",
                icon: Gavel,
                inhalt: (
                  <p className="text-[15.5px] leading-relaxed text-ink-700">
                    Versicherungsbedingungen enthalten Obliegenheiten: Die Anlage ist in ordnungsgemäßem Zustand zu halten, vorgeschriebene Prüfungen sind durchzuführen und Mängel zu
                    beheben. Werden sie verletzt, kann der Versicherer nach § 6 VersVG – abhängig von Verschulden und Auswirkung – ganz oder teilweise leistungsfrei werden. Prüfbefund nach
                    OVE E 8101 und Wartungsprotokoll sind Ihr Nachweis.
                  </p>
                ),
              },
              {
                titel: "Landwirtschaft, Agri-PV und Hagelversicherung",
                kurz: "Kultur und Anlage getrennt betrachten",
                icon: Sprout,
                inhalt: (
                  <p className="text-[15.5px] leading-relaxed text-ink-700">
                    Die Österreichische Hagelversicherung ist auf landwirtschaftliche Kulturen spezialisiert. PV-Anlagen – auch in der Landwirtschaft und bei Agri-PV – werden in der Regel
                    über eine Sach- bzw. Photovoltaikversicherung abgesichert. Klären Sie bei Agri-PV zusätzlich, wie Kultur und Anlage getrennt versichert sind.
                  </p>
                ),
              },
              {
                titel: "Abgrenzung: technische Beratung statt Vermittlung",
                kurz: "Was wir tun – und was nicht",
                icon: Scale,
                inhalt: (
                  <p className="text-[15.5px] leading-relaxed text-ink-700">
                    Ökovolt ist ein Elektrotechnik-Fachbetrieb und kein Versicherungsvermittler im Sinne der Gewerbeordnung. Wir bieten keine Versicherungsprodukte an, beraten nicht zu
                    Tarifen und nehmen keine Anträge entgegen. Mit Versicherern und Maklern arbeiten wir auf technischer Ebene zusammen – bei Besichtigungen, Unterlagen und im Schadenfall.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <AnfrageSektion
        titel="Beratung oder Begutachtung anfragen"
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

      <FaqSektion items={FAQ} titel="PV-Versicherung – häufige Fragen" lead="Allgemeine Informationen, keine Versicherungs- oder Rechtsberatung." tone="white" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Sicherheit und Absicherung" />

      <Abschluss
        links={[
          { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag" },
          { href: "/service/e-check", art: "Service", titel: "E-Check & Prüfbefund" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/standort-check", art: "Tool", titel: "Standort-Check mit eHORA" },
          { href: "/ratgeber/photovoltaik-versicherung", art: "Ratgeber", titel: "Photovoltaik-Versicherung" },
          { href: "/ratgeber/hagel-photovoltaik", art: "Ratgeber", titel: "Hagel & Photovoltaik" },
          { href: "/ratgeber/schneelast-photovoltaik", art: "Ratgeber", titel: "Schneelast" },
          { href: "/ratgeber/photovoltaik-brandschutz", art: "Ratgeber", titel: "Brandschutz" },
        ]}
        quellen={[
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
