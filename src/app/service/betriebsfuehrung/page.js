// service/betriebsfuehrung/page.js – Betriebsführung und Anlagenübernahme (Paket C05)
//
// „Errichter nicht mehr erreichbar?“ – Ablauf der Übernahme ohne Preise und SLAs, solange keine
// Leistungsstufe in src/data/betriebsfuehrung.js freigegeben ist. Keine Nennung von Firmen.

import Link from "next/link";
import { AlertTriangle, ClipboardCheck, FileSearch, FolderOpen, Handshake, Radar, ScanSearch, ShieldCheck, Wrench, Zap } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import { FIRMA } from "@/lib/site";
import { ABLAUF, QUELLEN, STAND, freigegebeneStufen } from "@/data/betriebsfuehrung";
import UebernahmeFormular from "./UebernahmeFormular";

const PFAD = "/service/betriebsfuehrung";
const TITEL = "Betriebsführung & Anlagenübernahme PV | Ökovolt";
const BESCHREIBUNG =
  "Errichter nicht mehr erreichbar? Wir übernehmen Betrieb und Wartung Ihrer PV-Anlage in Österreich: Unterlagen, E-Check nach OVE E 8101, Thermografie, SCADA, Parkregler.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const ICONS = { unterlagen: FolderOpen, "e-check": ClipboardCheck, thermografie: ScanSearch, scada: Radar, angebot: Handshake };

const SOFORT = [
  { icon: Zap, t: "Läuft die Anlage?", x: "Wechselrichter-Display oder App ansehen, Meldung notieren. Nichts öffnen, nichts abklemmen – bei Lichtbogen- oder Isolationsmeldungen nicht quittieren." },
  { icon: FolderOpen, t: "Unterlagen sichern", x: "Anlagenbuch, Prüfbefund, Stringpläne, Netzzugangs- und OeMAG-Vertrag, Rechnungen, Zugang zum Monitoring-Portal. Was fehlt, holen wir nach." },
  { icon: FileSearch, t: "Portal-Zugang klären", x: "Monitoring-Portale laufen oft auf den Zugang des Errichters. Beim Hersteller lässt sich die Anlage meist auf den Betreiber übertragen – wir helfen dabei." },
  { icon: ShieldCheck, t: "Garantien prüfen", x: "Produkt- und Leistungsgarantien der Module und Wechselrichter gelten gegenüber dem Hersteller weiter – unabhängig vom Errichter. Seriennummern bereithalten." },
];

const FAQ = [
  {
    q: "Mein PV-Errichter ist nicht mehr erreichbar – wer wartet jetzt meine Anlage?",
    a: "Jeder konzessionierte Elektrotechnik-Fachbetrieb darf eine bestehende PV-Anlage prüfen, warten und instand setzen – eine Bindung an den Errichter gibt es nicht. Wir übernehmen Anlagen in ganz Österreich: zuerst Unterlagen und Zustandsaufnahme mit Prüfbefund, dann Monitoring, Wartung und Störungsdienst.",
  },
  {
    q: "Was kostet die Übernahme einer PV-Anlage?",
    a: "Die Zustandsaufnahme (Unterlagen, E-Check nach OVE E 8101, Thermografie) bieten wir nach Anlagengröße an; Umfang und Konditionen der laufenden Betriebsführung nennen wir erst nach der Aufnahme, weil Zustand und Technik den Aufwand bestimmen. Preise und Reaktionszeiten veröffentlichen wir auf dieser Seite nur nach Freigabe – derzeit auf Anfrage.",
  },
  {
    q: "Gelten Garantien weiter, wenn der Errichter weg ist?",
    a: "Produkt- und Leistungsgarantien der Hersteller von Modulen, Wechselrichtern und Speichern bestehen gegenüber dem Hersteller weiter. Die Gewährleistung des Errichters für seine Arbeit ist dagegen an ihn gebunden. Wir prüfen anhand der Seriennummern, welche Garantien noch laufen, und wickeln Garantiefälle mit den Herstellern ab.",
  },
  {
    q: "Was ist ein E-Check nach OVE E 8101 und warum bei der Übernahme?",
    a: "Die OVE E 8101 regelt die Prüfung elektrischer Niederspannungsanlagen – Besichtigen, Erproben, Messen mit Prüfbefund. Bei der Übernahme dokumentiert der Befund den Zustand, bevor wir Verantwortung übernehmen: Isolationswiderstand, Schutzleiter, Stringströme, Schutzeinrichtungen. Für Arbeitgeber ist die wiederkehrende Prüfung nach Elektroschutzverordnung 2012 ohnehin Pflicht.",
  },
  {
    q: "Was passiert mit OeMAG-Vertrag und Netzzugang bei einem Betreiberwechsel?",
    a: "Wechselt der Betreiber (z. B. nach Kauf der Liegenschaft), müssen Netzzugangsvertrag und OeMAG- bzw. Fördervertrag auf den neuen Betreiber übertragen werden. Wir bereiten die Meldungen vor und stimmen Messkonzept und Zählpunkte mit dem Netzbetreiber ab.",
  },
  {
    q: "Brauche ich einen Parkregler?",
    a: "Das hängt vom Netzzugangsvertrag ab. Netzbetreiber verlangen nach TOR Erzeuger ab bestimmten Leistungen ein Einspeisemanagement mit Wirk- und Blindleistungsvorgaben. Fehlt es, kann der Netzbetreiber die Anlage begrenzen oder abschalten. Wir prüfen die Vorgabe und rüsten – falls nötig – einen EZA-Regler nach.",
  },
];

export default function BetriebsfuehrungPage() {
  const stufen = freigegebeneStufen();
  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Betriebsführung und Anlagenübernahme für Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "Technische Betriebsführung, Anlagenübernahme, Wartung" })} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Betriebsführung" }]}
        eyebrow="Betriebsführung · Anlagenübernahme · Bestand"
        title={
          <>
            Errichter nicht mehr erreichbar? <span className="ov-text-gradient-light">Wir übernehmen Betrieb und Wartung</span> Ihrer Anlage.
          </>
        }
        lead="Insolvenz, Betriebsaufgabe, kein Rückruf mehr: Viele Betreiber stehen mit einer laufenden Anlage ohne Ansprechpartner da. Wir nehmen den Zustand auf, bringen Unterlagen und Technik in Ordnung und führen die Anlage weiter – mit eigener Elektrofachkraft, Drohne und Fernüberwachung."
        image={{ src: "/Images/AT/service-b/schaltschrank-messung.jpg", alt: "Elektrofachkraft misst in einem Schaltschrank einer Photovoltaikanlage" }}
        points={["Unterlagen & Verträge prüfen", "E-Check mit Prüfbefund", "Thermografie aus der Luft", "SCADA & Parkregler"]}
        actions={[
          { label: "Übernahme anfragen", href: "#anfrage" },
          { label: "Ablauf ansehen", href: "#ablauf", icon: ClipboardCheck },
        ]}
        aside={
          <div className="ov-glass sb-schweben hidden max-w-xs rounded-3xl p-6 lg:ml-auto lg:block">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-600 text-white">
              <Wrench aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-[22px] font-extrabold leading-tight text-white">Erst prüfen, dann übernehmen</p>
            <p className="mt-1 text-[14px] leading-snug text-white/70">Umfang und Konditionen der Betriebsführung nennen wir nach der Zustandsaufnahme – nicht vorher.</p>
          </div>
        }
      />

      <Kennzahlen
        frage="Wer wartet meine PV-Anlage, wenn der Errichter nicht mehr erreichbar ist?"
        zahlen={[
          { text: "OVE E 8101", label: "Prüfung bei der Übernahme – mit Prüfbefund" },
          { text: "TOR Erzeuger", label: "Regler-Nachrüstung nach Vorgabe des Netzbetreibers" },
          { value: ABLAUF.length, suffix: " Schritte", label: "von den Unterlagen bis zum Angebot" },
          { text: "1 Partner", label: "für Netzbetreiber, OeMAG und Förderstelle" },
        ]}
        fussnote={`Angaben ${FIRMA.kurz} Österreich · Stand ${STAND.label}`}
      >
        <p>
          <strong>Jeder konzessionierte Elektrotechnik-Fachbetrieb darf Ihre Anlage prüfen, warten und instand setzen</strong> – eine Bindung an den Errichter gibt es nicht. Wir übernehmen
          Bestandsanlagen in ganz Österreich in fünf Schritten: Unterlagen, E-Check, Thermografie, Fernüberwachung mit Regler, danach ein Angebot für Wartung und Direktvermarktung.
        </p>
      </Kennzahlen>

      {/* Ablauf */}
      <Section tone="white" space="lg" id="ablauf" className="scroll-mt-24">
        <SectionHeading eyebrow="Ablauf" title="Fünf Schritte von der Übernahme zum laufenden Betrieb" lead="Jeder Schritt stützt sich auf eine Norm oder Regel – und keiner enthält ein Versprechen, das wir vor der Zustandsaufnahme nicht halten könnten." className="mb-12" />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {ABLAUF.map((s, i) => {
            const Icon = ICONS[s.id] || ClipboardCheck;
            return (
              <Reveal as="li" key={s.id} delay={i * 70} className="ov-card-hover flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-600 text-white">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[13px] font-bold text-ink-500">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-[17.5px] font-bold leading-snug text-ink-900">{s.titel}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{s.text}</p>
                <p className="mt-auto pt-4 text-[12.5px] font-medium leading-snug text-ov-700">{s.norm}</p>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* Sofort */}
      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Bis wir da sind" title="Vier Dinge, die Sie jetzt selbst tun können" lead="Ohne Werkzeug, ohne Risiko – und jede davon spart bei der Übernahme Zeit." />
            <Hinweis ton="achtung" titel="Nichts öffnen, nichts abklemmen" className="mt-8">
              <p>
                Auf der Gleichstromseite liegt Spannung an, solange Licht auf die Module fällt – auch bei abgeschaltetem Wechselrichter. Arbeiten an DC-Leitungen, Steckverbindern, Sicherungen und im Gerät
                sind Elektrofachkräften vorbehalten. Meldungen am Wechselrichter erklärt unser{" "}
                <Link href="/service/stoerung/codes" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  Fehlercode-Hub
                </Link>
                .
              </p>
            </Hinweis>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {SOFORT.map((s, i) => (
              <Reveal as="li" key={s.t} delay={i * 60} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
                  <s.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-[17px] font-bold text-ink-900">{s.t}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{s.x}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Leistungsstufen – nur mit Freigabe */}
      {stufen.length > 0 ? (
        <Section tone="white" space="lg" id="leistungen" className="scroll-mt-24">
          <SectionHeading eyebrow="Leistungsstufen" title="Betriebsführung nach Anlage und Bedarf" className="mb-12" />
          <ul className="grid gap-4 md:grid-cols-3">
            {stufen.map((s) => (
              <li key={s.id} className="flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <h3 className="font-display text-[19px] font-bold text-ink-900">{s.name}</h3>
                <p className="mt-1 text-[14.5px] text-ink-600">{s.kurz}</p>
                <ul className="mt-4 space-y-2 text-[14.5px] text-ink-700">
                  {s.enthalten.map((e) => (
                    <li key={e} className="flex gap-2">
                      <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                      {e}
                    </li>
                  ))}
                </ul>
                {s.reaktionszeit && <p className="mt-4 text-[14px] font-medium text-ink-800">Reaktionszeit: {s.reaktionszeit}</p>}
                {s.preisHinweis && <p className="mt-1 text-[14px] text-ink-600">{s.preisHinweis}</p>}
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Dunkel space="md" glow="links">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <SectionHeading dark eyebrow="Leistungsumfang" title="Wartung, Störungsdienst, Direktvermarktung – passend zur Anlage" />
            <Reveal delay={100} className="space-y-4 text-[16px] leading-relaxed text-white/75">
              <p>
                Was die laufende Betriebsführung umfasst – Monitoring, wiederkehrende Prüfung, Störungsdienst mit Vor-Ort-Einsatz, Ersatzteil- und Garantieabwicklung, Kontakt zu Netzbetreiber, OeMAG
                und Förderstelle, auf Wunsch Direktvermarktung – legen wir nach der Zustandsaufnahme fest.
              </p>
              <p className="flex gap-3 rounded-2xl bg-white/[0.06] p-4 text-[14.5px] text-white/80 ring-1 ring-white/10">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-300" />
                Reaktionszeiten und Preise veröffentlichen wir erst nach interner Freigabe. Bis dahin: Angebot auf Anfrage, ohne Verpflichtung.
              </p>
            </Reveal>
          </div>
        </Dunkel>
      )}

      {/* Anfrage */}
      <Section id="anfrage" tone="sand" space="lg" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Anfrage" title="Anlagenübernahme anfragen" lead="Senden Sie uns die Eckdaten – auch wenn Unterlagen fehlen. Wir melden uns mit Rückfragen oder direkt mit einem Termin für die Zustandsaufnahme." />
            <Reveal delay={100}>
              <ol className="mt-8 space-y-3">
                {["Sie senden Eckdaten und den Stand der Unterlagen.", "Wir sichten Verträge und Portal-Zugang, dann Termin vor Ort.", "Prüfbefund, Thermografie und Angebot für den laufenden Betrieb."].map((s, i) => (
                  <li key={s} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/60">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
                    <span className="text-[15px] leading-snug text-ink-700">{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={160} className="mt-8 space-y-1 text-[15px] text-ink-700">
              <p className="font-semibold text-ink-900">Lieber direkt?</p>
              <a href={FIRMA.telefonHref} className="block hover:text-ov-700">
                {FIRMA.telefon}
              </a>
              <a href={`mailto:${FIRMA.email}`} className="block hover:text-ov-700">
                {FIRMA.email}
              </a>
            </Reveal>
          </div>
          <Reveal dir="right" className="min-w-0">
            <UebernahmeFormular />
          </Reveal>
        </div>
      </Section>

      <FaqSektion items={FAQ} titel="Anlagenübernahme – kurz beantwortet" tone="white" />

      <Querverweise pfad={PFAD} />

      <Abschluss
        stand={STAND.label}
        links={[
          { href: "/service/stoerung/codes", art: "Service", titel: "Fehlercode-Hub Wechselrichter" },
          { href: "/service/anlagen-check", art: "Service", titel: "Anlagen-Check mit Monatserträgen" },
          { href: "/service/e-check", art: "Service", titel: "E-Check & Prüfbefund" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag" },
          { href: "/service/repowering", art: "Service", titel: "Repowering & Tarifauslauf" },
          { href: "/service/direktvermarktung", art: "Service", titel: "Direktvermarktung" },
          { href: "/technik/parkregler", art: "Technik", titel: "Parkregler (EZA-Regler)" },
          { href: "/ratgeber/photovoltaik-wartungsvertrag", art: "Ratgeber", titel: "Wartungsvertrag – was drin sein muss" },
          { href: "/ratgeber/e-check-photovoltaik", art: "Ratgeber", titel: "E-Check Photovoltaik" },
        ]}
        quellen={QUELLEN}
      />

      <CtaBand
        eyebrow="Anlagenübernahme"
        title="Ihre Anlage braucht einen Ansprechpartner. Ab jetzt sind wir das."
        text="Zustandsaufnahme mit Prüfbefund, Thermografie und Fernüberwachung – danach ein ehrliches Angebot für Wartung und Direktvermarktung. In ganz Österreich."
        primary={{ label: "Übernahme anfragen", href: "#anfrage" }}
        secondary={{ label: "Anlagen-Check starten", href: "/service/anlagen-check", icon: ClipboardCheck }}
      />
    </div>
  );
}
