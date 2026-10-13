// service/stoerung/codes/page.js – Übersicht des Fehlercode-Hubs (Paket C05)
//
// Zeigt nur Einträge mit freigabe_elektrofachkraft:true aus src/data/stoerungen.js. Ohne Freigabe
// erscheint je Hersteller nur die Zahl der Codes „in Prüfung“. Herstellernamen rein beschreibend.

import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, Cpu, ExternalLink, Gauge, ShieldAlert, Wrench } from "lucide-react";
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
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import { DRINGLICHKEIT, HERSTELLER, HERSTELLER_SLUGS, QU_ERKLAERUNG, SICHERHEITSHINWEIS, STAND, STOERUNGEN, datumDe, freigegebeneStoerungen, stoerungPfad, stoerungZaehler } from "@/data/stoerungen";

const PFAD = "/service/stoerung/codes";
const TITEL = "Wechselrichter-Fehlercodes: Fronius & Huawei | Ökovolt";
const BESCHREIBUNG =
  "Statusmeldungen von Fronius- und Huawei-Wechselrichtern in eigenen Worten: Bedeutung, Ursachen, was Betreiber prüfen dürfen und wann die Elektrofachkraft kommen muss. Mit Sicherheitshinweis.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const GRUPPEN = [
  { t: "Netz", x: "Spannung oder Frequenz außerhalb des Bands, Netzausfall, Inselerkennung – meist Netzereignis oder Einstellung, selten Defekt.", icon: Gauge },
  { t: "Isolation & Fehlerstrom", x: "Feuchte Stecker, beschädigte Leitungen, Modulfehler – sicherheitsrelevant, gehört zur Elektrofachkraft.", icon: ShieldAlert },
  { t: "DC-Seite", x: "String zu schwach, verpolt, Rückstrom, Lichtbogen – von der Dämmerungsmeldung bis zur Brandgefahr.", icon: Cpu },
  { t: "Gerät & Temperatur", x: "Übertemperatur, Kommunikation, Relais, Selbsttest – Standort, Lüftung oder Service.", icon: Wrench },
];

const FAQ = [
  {
    q: "Mein Wechselrichter zeigt eine Fehlermeldung – was darf ich selbst tun?",
    a: "Ansehen, notieren, nicht öffnen. Lesen Sie Code, Uhrzeit und Wetter ab, prüfen Sie die Stellung der Schutzschalter im Zählerkasten nur mit dem Auge und schauen Sie, ob andere Verbraucher im Gebäude Strom haben. Arbeiten an Gleichstromleitungen, Steckverbindern, Sicherungen und im Gerät sind Elektrofachkräften vorbehalten. Bei Lichtbogen-, Isolations- oder Fehlerstrommeldungen die Anlage nicht quittieren und nicht neu starten.",
  },
  {
    q: "Warum meldet der Wechselrichter „Netzspannung zu hoch“, obwohl nichts kaputt ist?",
    a: "Beim Einspeisen hebt die Anlage die Spannung am Anschlusspunkt an. Überschreitet sie das zulässige Band, muss der Wechselrichter nach TOR Erzeuger zuerst Blindleistung stellen (Q(U)), dann die Wirkleistung senken (P(U)) und zuletzt trennen. Das ist eine Schutzfunktion. Ursachen sind ein schwaches Netz, lange AC-Leitungen oder ein falsches Netzprofil. Leitungen und Geräteeinstellung prüft die Elektrofachkraft, die Spannungsqualität am Anschlusspunkt der Netzbetreiber.",
  },
  {
    q: "Ist die Dämmerungsmeldung „zu wenig Leistung“ ein Fehler?",
    a: "Morgens, abends, bei Schnee oder dichten Wolken reicht die Modulspannung nicht zum Einspeisen – das ist normal. Erscheint die Meldung mittags bei Sonne, fehlt Leistung aus dem Modulfeld: Verschattung, Verschmutzung, ein unterbrochener String oder ein Modulfehler. Dann hilft ein Blick in die Stringwerte des Portals und bei Bedarf eine Thermografie.",
  },
  {
    q: "Warum stehen hier nicht alle Codes?",
    a: "Wir veröffentlichen nur Einträge, die eine Elektrofachkraft von Ökovolt fachlich geprüft und freigegeben hat, und nur zu Herstellern, die wir nachweislich verbauen – derzeit Fronius und Huawei. Die Texte sind in eigenen Worten geschrieben; die Dokumentation der Hersteller ist als Quelle verlinkt.",
  },
];

export default function StoerungCodesPage() {
  const zaehler = stoerungZaehler();
  const frei = freigegebeneStoerungen();
  const gesamt = STOERUNGEN.length;

  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Fehlercode-Hub für Wechselrichter", beschreibung: BESCHREIBUNG, serviceType: "Störungsdienst und Fehlerdiagnose Photovoltaik", zielgruppe: "Betreiber von Photovoltaikanlagen" })} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Störung" }, { name: "Fehlercodes" }]}
        eyebrow="Fehlercode-Hub · Fronius · Huawei"
        title={
          <>
            Was Ihr Wechselrichter <span className="ov-text-gradient-light">wirklich meldet</span>
          </>
        }
        lead="Statusmeldungen in eigenen Worten: Was bedeutet der Code, welche Ursachen sind typisch, was dürfen Sie als Betreiber prüfen – und wann muss die Elektrofachkraft kommen. Keine Anleitung zu Arbeiten an der Anlage."
        image={{ src: "/Images/AT/service-b/blitz-gewitter.jpg", alt: "Gewitter über einer Landschaft mit Hochspannungsleitung" }}
        points={["In eigenen Worten", "Herstellerquellen verlinkt", "Sicherheitshinweis auf jeder Seite", "Veröffentlichung nach Prüfung durch Elektrofachkraft"]}
        actions={[
          { label: "Störungsdienst anfragen", href: "/service/betriebsfuehrung#anfrage" },
          { label: "Codes ansehen", href: "#codes", icon: BookOpen },
        ]}
      />

      <Kennzahlen
        frage="Mein Wechselrichter zeigt eine Meldung – ist das schlimm?"
        zahlen={[
          { value: gesamt, label: "Statusmeldungen erfasst (Fronius, Huawei)" },
          { value: frei.length, label: "davon fachlich freigegeben und veröffentlicht" },
          { text: "Q(U) · P(U)", label: "Netzspannung: Schutzfunktion nach TOR Erzeuger, kein Defekt" },
          { text: "0 Anleitungen", label: "zu Arbeiten an Gleichstromleitungen oder im Gerät" },
        ]}
        fussnote={`Angaben Ökovolt Österreich · Stand ${STAND.label}`}
      >
        <p>
          <strong>Meist nicht – aber es kommt auf die Art der Meldung an.</strong> Netzmeldungen (Spannung, Frequenz) sind in der Regel Schutzfunktionen; Dämmerungsmeldungen sind normal. Lichtbogen-,
          Isolations- und Fehlerstrommeldungen sind sicherheitsrelevant: nicht quittieren, nicht neu starten, Elektrofachkraft verständigen.
        </p>
      </Kennzahlen>

      <Section tone="white" space="md">
        <Hinweis ton="achtung" titel={SICHERHEITSHINWEIS.titel}>
          <p>{SICHERHEITSHINWEIS.text}</p>
        </Hinweis>
      </Section>

      {/* Hersteller & Codes */}
      <Section tone="sand" space="lg" id="codes" className="scroll-mt-24">
        <SectionHeading eyebrow="Codes" title="So lesen Sie die Meldung – je Hersteller" lead="Herstellernamen nennen wir, weil wir diese Geräte verbauen und betreuen. Das sagt nichts über eine Partnerschaft oder Freigabe durch den Hersteller aus." className="mb-10" />
        <div className="grid gap-6 lg:grid-cols-2">
          {HERSTELLER_SLUGS.map((slug, i) => {
            const h = HERSTELLER[slug];
            const z = zaehler.find((x) => x.hersteller === slug);
            const eigene = frei.filter((e) => e.hersteller === slug);
            return (
              <Reveal key={slug} delay={i * 80} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
                <h3 className="font-display text-[22px] font-extrabold text-ink-900">{h.name}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{h.beschreibung}</p>
                <dl className="mt-5 grid gap-3 text-[14px] sm:grid-cols-2">
                  <div className="rounded-2xl bg-sand-50 p-4">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Codeformat</dt>
                    <dd className="mt-1 text-ink-800">{h.codeFormat}</dd>
                  </div>
                  <div className="rounded-2xl bg-sand-50 p-4">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Wo Sie den Code sehen</dt>
                    <dd className="mt-1 text-ink-800">{h.anzeige}</dd>
                  </div>
                </dl>

                {eigene.length > 0 ? (
                  <ul className="mt-6 divide-y divide-ink-100">
                    {eigene.map((e) => (
                      <li key={e.code}>
                        <Link href={stoerungPfad(e)} className="group flex items-center gap-4 py-3 hover:text-ov-700">
                          <span className="ov-num w-16 shrink-0 font-display text-[15px] font-bold text-ink-900">{e.code}</span>
                          <span className="min-w-0 flex-1 text-[15px] text-ink-800 group-hover:text-ov-700">{e.titel}</span>
                          <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold sm:inline-flex ${e.dringlichkeit === "sofort" ? "bg-navy-700 text-white" : e.dringlichkeit === "bald" ? "bg-sun-300/50 text-navy-950" : "bg-ov-50 text-ov-700"}`}>
                            {DRINGLICHKEIT[e.dringlichkeit].label}
                          </span>
                          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-ov-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 flex gap-3 rounded-2xl bg-ov-50 p-4 text-[14px] leading-relaxed text-ink-700 ring-1 ring-ov-200/70">
                    <ClipboardCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                    <span>
                      <strong className="text-ink-900">{z.gesamt} Codes in fachlicher Prüfung.</strong> Wir veröffentlichen jeden Eintrag erst nach Freigabe durch unsere Elektrofachkraft. Bis dahin: Code und Uhrzeit notieren und uns anrufen.
                    </span>
                  </p>
                )}
                {z.gesamt > eigene.length && eigene.length > 0 && <p className="mt-3 text-[13px] text-ink-500">{z.gesamt - eigene.length} weitere Codes in fachlicher Prüfung.</p>}

                <p className="mt-auto pt-5 text-[13px] leading-relaxed text-ink-500">
                  Quelle:{" "}
                  <a href={h.quelle.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                    {h.quelle.titel}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                  {" · "}
                  {h.quelle.version} · abgerufen am {datumDe(h.quelle.abgerufen)}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Gruppen & Dringlichkeit */}
      <Section tone="white" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Vier Gruppen" title="Fast jede Meldung gehört in eine dieser Gruppen" className="mb-8" />
            <ul className="space-y-3">
              {GRUPPEN.map((g, i) => (
                <Reveal as="li" key={g.t} delay={i * 60} className="flex gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200/70">
                    <g.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[16px] font-bold text-ink-900">{g.t}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{g.x}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Dringlichkeit" title="Drei Stufen – so ordnen wir jede Meldung ein" className="mb-8" />
            <ul className="space-y-3">
              {Object.entries(DRINGLICHKEIT).map(([k, d], i) => (
                <Reveal as="li" key={k} delay={i * 60} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
                  <span className={`inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold ${k === "sofort" ? "bg-navy-700 text-white" : k === "bald" ? "bg-sun-300/50 text-navy-950" : "bg-ov-50 text-ov-700"}`}>{d.label}</span>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{d.text}</p>
                </Reveal>
              ))}
            </ul>
            <Hinweis ton="info" titel={QU_ERKLAERUNG.titel} className="mt-6">
              <p>{QU_ERKLAERUNG.text}</p>
              <p className="text-[13px] text-ink-500">
                Quelle:{" "}
                <a href={QU_ERKLAERUNG.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                  {QU_ERKLAERUNG.quelle.titel}
                </a>
              </p>
            </Hinweis>
          </div>
        </div>
      </Section>

      <FaqSektion items={FAQ} titel="Fehlercodes – kurz beantwortet" tone="sand" />

      <Querverweise pfad={PFAD} />

      <Abschluss
        stand={STAND.label}
        links={[
          { href: "/service/betriebsfuehrung", art: "Service", titel: "Betriebsführung & Anlagenübernahme" },
          { href: "/service/anlagen-check", art: "Service", titel: "Anlagen-Check mit Monatserträgen" },
          { href: "/service/e-check", art: "Service", titel: "E-Check & Prüfbefund" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/produkte/wechselrichter", art: "Produkt", titel: "Wechselrichter" },
          { href: "/ratgeber/wechselrichter-photovoltaik", art: "Ratgeber", titel: "Wechselrichter erklärt" },
          { href: "/ratgeber/tor-erzeuger-netzanschluss", art: "Ratgeber", titel: "TOR Erzeuger & Netzanschluss" },
          { href: "/ratgeber/photovoltaik-brandschutz", art: "Ratgeber", titel: "Brandschutz Photovoltaik" },
        ]}
        quellen={[
          { titel: HERSTELLER.fronius.quelle.titel, href: HERSTELLER.fronius.quelle.url, hinweis: `${HERSTELLER.fronius.quelle.version}, abgerufen am ${datumDe(HERSTELLER.fronius.quelle.abgerufen)}` },
          { titel: HERSTELLER.huawei.quelle.titel, href: HERSTELLER.huawei.quelle.url, hinweis: `${HERSTELLER.huawei.quelle.version}, abgerufen am ${datumDe(HERSTELLER.huawei.quelle.abgerufen)}` },
          { titel: QU_ERKLAERUNG.quelle.titel, href: QU_ERKLAERUNG.quelle.url },
          { titel: "OVE E 8101 – Errichtung von elektrischen Niederspannungsanlagen", href: "https://www.ove.at/standardisierung/ove-e-8101" },
          { titel: "Elektrotechnikgesetz 1992 (ETG) – Arbeiten an elektrischen Anlagen", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10011808" },
        ]}
      />

      <CtaBand
        eyebrow="Störungsdienst"
        title="Code notiert? Wir übernehmen den Rest."
        text="Fernanalyse über das Portal, Vor-Ort-Einsatz mit Elektrofachkraft, Thermografie und Prüfbefund – auch für Anlagen, die wir nicht gebaut haben."
        primary={{ label: "Störung melden", href: "/service/betriebsfuehrung#anfrage" }}
        secondary={{ label: "Anlagen-Check", href: "/service/anlagen-check", icon: AlertTriangle }}
      />
    </div>
  );
}
