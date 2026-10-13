// src/app/smart-meter/page.js
//
// Smart-Meter-Hub: Viertelstundenwerte je Netzbetreiber exportieren und im Browser auswerten.
// Daten und Quellen: src/data/smartmeter.js · Upload-Feld: ./LastgangUpload.js (Datei bleibt im Browser).
// Ökovolt ist kein Netzbetreiber – keine Logos, keine Wertung der Portale.

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Activity, CalendarClock, FileSpreadsheet, Gauge, Scale, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Hinweis, HowTo, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import LastgangUpload from "./LastgangUpload";
import {
  ALLGEMEINE_SCHRITTE,
  FAQ,
  HINWEIS_GEWAEHR,
  HINWEIS_KEIN_NETZBETREIBER,
  LASTGANG_PFAD,
  PFAD,
  PRUEF_ZYKLUS_TAGE,
  Q,
  RECHT,
  SMART_METER_BETREIBER,
  STAND,
  WARUM,
  betreiberPfad,
  datumLabel,
  exportStatus,
  pruefungFaellig,
} from "@/data/smartmeter";
import { BASE_URL } from "@/lib/site";

// Prüfhinweis (35-Tage-Zyklus) täglich neu bewerten
export const revalidate = 86400;

const SEITE_URL = `${BASE_URL}${PFAD}`;
const TITLE = "Smart Meter auslesen je Netzbetreiber | Ökovolt";
const DESCRIPTION =
  "Smart Meter auslesen: Portal, Opt-in, Export und Dateiformat je Netzbetreiber in Österreich – Viertelstundenwerte danach im Browser auswerten, ohne Upload.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Smart Meter auslesen", "Viertelstundenwerte exportieren", "Smart Meter Opt-in", "Smart Meter Portal Netzbetreiber", "Lastgang CSV Netzbetreiber", "Smart Meter Wiener Netze", "Smart Meter EVN Netz NÖ"],
  alternates: { canonical: SEITE_URL },
  openGraph: { type: "website", locale: "de_AT", url: SEITE_URL, siteName: "Ökovolt Österreich", title: TITLE, description: DESCRIPTION, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Smart Meter auslesen" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const WARUM_ICONS = [Gauge, Activity, Users];

export default function SmartMeterHub() {
  const jetzt = Date.now();
  const faellig = SMART_METER_BETREIBER.filter((b) => pruefungFaellig(b, jetzt));
  const mitFormat = SMART_METER_BETREIBER.filter((b) => exportStatus(b).belegt).length;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SEITE_URL}/#webpage`,
        url: SEITE_URL,
        name: "Smart Meter auslesen: Viertelstundenwerte je Netzbetreiber",
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        dateModified: STAND.iso,
      },
      {
        "@type": "ItemList",
        "@id": `${SEITE_URL}/#betreiber`,
        name: "Smart-Meter-Anleitungen je Netzbetreiber",
        itemListElement: SMART_METER_BETREIBER.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: `Smart Meter ${b.kurz}`, url: `${BASE_URL}${betreiberPfad(b.slug)}` })),
      },
    ],
  };

  const quellen = [
    ...RECHT.quellen,
    Q.smartMeterBericht,
    Q.econtrolSuche,
    ...SMART_METER_BETREIBER.map((b) => b.quellen[0]),
  ].map((q) => ({ label: q.titel, url: q.url }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Smart Meter auslesen" }]}
        eyebrow={`Smart-Meter-Hub · geprüft am ${STAND.label}`}
        title={<>Smart Meter auslesen: <span className="ov-text-gradient-light">Viertelstundenwerte</span> exportieren und auswerten</>}
        lead="Für jeden großen Netzbetreiber Österreichs: Welches Portal, welche Zugangsdaten, wie Sie die Viertelstundenwerte aktivieren und exportieren – und wie Sie die Datei danach in Sekunden auswerten, ohne sie hochzuladen."
        points={[`${SMART_METER_BETREIBER.length} Netzbetreiber, jede Angabe mit Quelle`, "Datei bleibt im Browser", `Prüfzyklus ${PRUEF_ZYKLUS_TAGE} Tage`, "Ökovolt ist kein Netzbetreiber"]}
        actions={[
          { label: "Netzbetreiber wählen", href: "#betreiber" },
          { label: "Datei direkt auswerten", href: "#auswerten", variant: "outlineLight", icon: FileSpreadsheet },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: SMART_METER_BETREIBER.length, label: "Netzbetreiber mit eigener Anleitung" },
          { value: mitFormat, label: "davon mit belegtem Exportformat" },
          { value: 15, suffix: " min", label: "Messintervall nach § 54 ElWG" },
          { text: "0 Upload", label: "Auswertung vollständig auf Ihrem Gerät" },
        ]}
      />

      {/* Betreiber-Auswahl */}
      <Section tone="white" space="md" id="betreiber" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Ihr Netzbetreiber"
          title="Anleitung je Netzbetreiber wählen"
          lead="Reihenfolge nach Zählpunkten laut E-Control (Ende 2024). Der Netzbetreiber steht auf Ihrer Netz- oder Stromrechnung – er ist nicht Ihr Stromlieferant."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SMART_METER_BETREIBER.map((b, i) => {
            const status = exportStatus(b);
            return (
              <Reveal as="li" key={b.slug} delay={i * 50} className="flex">
                <Link
                  href={betreiberPfad(b.slug)}
                  className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 hover:bg-white"
                >
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{b.bundesland}</span>
                  <span className="mt-2 font-display text-[19px] font-bold leading-snug text-ink-900">Smart Meter {b.kurz}</span>
                  <span className="mt-2 text-[14px] leading-relaxed text-ink-600">
                    {b.portal.name} · {b.viertelstundenAktivieren.schritte.length} Schritte bis zu den Viertelstundenwerten
                  </span>
                  <span className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px]">
                    <span className={status.belegt ? "rounded-full bg-ov-100 px-2.5 py-1 font-semibold text-ov-800" : "rounded-full bg-ink-100 px-2.5 py-1 font-semibold text-ink-700"}>
                      Export: {status.label}
                    </span>
                    <span className="text-ink-500">geprüft {datumLabel(b.geprueftAm)}</span>
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 group-hover:text-ov-800">
                    Zur Anleitung <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Hinweis titel="Ökovolt ist kein Netzbetreiber">{HINWEIS_KEIN_NETZBETREIBER}</Hinweis>
          <Hinweis titel="Ihr Netzbetreiber fehlt?">
            Kleinere Stadt- und Gemeindewerke haben eigene Portale. Die{" "}
            <a href={Q.econtrolSuche.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
              Netzbetreiber-Suche der E-Control
            </a>{" "}
            nennt den zuständigen Betreiber je Adresse. Die allgemeinen Schritte unten gelten sinngemäß auch dort.
          </Hinweis>
        </div>
      </Section>

      {/* Upload */}
      <Section tone="sand" space="md" id="auswerten" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <SectionHeading
            eyebrow="Schon exportiert?"
            title="Datei auswählen – Auswertung startet sofort"
            lead="Die Lastgang-Analyse liest Ihre Export-Datei direkt auf Ihrem Gerät: Jahresverbrauch, Tagesgang, Grundlast, Lastspitzen, passende PV-Größe und Peak-Shaving-Speicher. Ohne Upload, ohne Konto."
          >
            <p className="mt-5 text-[14.5px] text-ink-600">
              Lieber ohne eigene Datei starten?{" "}
              <Link href={LASTGANG_PFAD} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                Lastgang-Analyse mit Beispieldatei öffnen
              </Link>
            </p>
          </SectionHeading>
          <LastgangUpload quelle="unbekannt" />
        </div>
      </Section>

      {/* Warum + Ablauf */}
      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Warum Viertelstundenwerte" title="Tageswerte verstecken, was Geld kostet" />
            <ul className="mt-8 space-y-5">
              {WARUM.map((w, i) => {
                const Icon = WARUM_ICONS[i] || Activity;
                return (
                  <li key={w.titel} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand-50 text-ov-600 ring-1 ring-ink-200">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-[17px] font-bold text-ink-900">{w.titel}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{w.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="So geht es bei jedem Netzbetreiber" title="Fünf Schritte vom Zähler zur Auswertung" />
            <HowTo
              className="mt-8"
              name="Smart Meter auslesen und Viertelstundenwerte auswerten"
              beschreibung="Allgemeiner Ablauf für Österreich; die Details je Netzbetreiber stehen auf den Unterseiten."
              schritte={ALLGEMEINE_SCHRITTE}
            />
          </div>
        </div>
      </Section>

      {/* Vergleich */}
      <Section tone="sand" space="md">
        <SectionHeading
          eyebrow="Auf einen Blick"
          title="Portale, Zugangsdaten und Exportformat im Vergleich"
          lead="Was die Netzbetreiber öffentlich dokumentieren – Lücken sind als „zu prüfen“ markiert, nicht geraten."
        />
        <Tabelle
          className="mt-10"
          dicht
          caption="Smart-Meter-Portale der Netzbetreiber im Vergleich"
          spalten={[
            { key: "betreiber", label: "Netzbetreiber", breite: "w-[22%]" },
            { key: "portal", label: "Portal" },
            { key: "login", label: "Zugang" },
            { key: "format", label: "Export" },
            { key: "stand", label: "Geprüft", breite: "w-[11%]" },
          ]}
          zeilen={SMART_METER_BETREIBER.map((b) => {
            const status = exportStatus(b);
            return {
              betreiber: (
                <Link href={betreiberPfad(b.slug)} className="text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  {b.kurz}
                </Link>
              ),
              portal: b.portal.name,
              login: b.login.angaben.slice(0, 2).join(", "),
              format: status.belegt ? status.label : <span className="text-ink-500">zu prüfen</span>,
              stand: datumLabel(b.geprueftAm),
            };
          })}
        />
        <p className="mt-4 text-[13px] text-ink-500">{HINWEIS_GEWAEHR}</p>
      </Section>

      {/* Rechtsrahmen */}
      <Section tone="white" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Rechtsrahmen" title="Was § 54 ElWG für alle Netzbetreiber regelt" lead={RECHT.kurz}>
            <StandPille className="mt-5">Gesetzestext geprüft am {STAND.label}</StandPille>
          </SectionHeading>
          <ul className="grid gap-4 sm:grid-cols-2">
            {RECHT.punkte.map((p) => (
              <li key={p.titel} className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ov-700">
                  <Scale aria-hidden="true" className="h-3.5 w-3.5" /> {p.norm}
                </p>
                <p className="mt-2 font-display text-[17px] font-bold text-ink-900">{p.titel}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Prüfhinweis */}
      {faellig.length > 0 && (
        <Section tone="sand" space="sm">
          <Hinweis ton="warn" titel={`Angaben älter als ${PRUEF_ZYKLUS_TAGE} Tage`}>
            Für {faellig.map((b) => b.kurz).join(", ")} liegt die letzte Prüfung länger zurück. Bitte prüfen Sie die Schritte im jeweiligen Portal – wir aktualisieren die Seiten im {PRUEF_ZYKLUS_TAGE}-Tage-Zyklus.
          </Hinweis>
        </Section>
      )}

      {/* FAQ */}
      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Smart Meter auslesen – kurz beantwortet" lead="Allgemeine Fragen; betreiberspezifische Antworten stehen auf den Unterseiten." />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="white" space="md">
        <Quellen
          quellen={quellen}
          stand={STAND.label}
          klappbar
          hinweis={`Jede Betreiberseite führt ihre eigenen Quellen mit Abrufdatum. Prüfzyklus ${PRUEF_ZYKLUS_TAGE} Tage.`}
        />
        <p className="mt-6 flex items-center gap-2 text-[13px] text-ink-500">
          <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-600" />
          Nächste planmäßige Prüfung: {datumLabel(naechstePruefung(STAND.iso))}
          <Link href="/ratgeber/smart-meter-pflicht" className="ml-auto inline-flex items-center gap-1 font-semibold text-ov-700 hover:text-ov-800">
            Ratgeber Smart-Meter-Pflicht <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </p>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Lastgang verstanden – und jetzt?"
        title="Aus Ihren Viertelstundenwerten wird ein Plan für Dach und Speicher."
        text="Wir werten Ihren Lastgang im Rahmen der Angebotserstellung aus und planen PV-Anlage, Speicher und Ladeinfrastruktur nach Ihrem echten Verbrauch – für Betriebe, Höfe, Gemeinden und Haushalte in ganz Österreich."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Zur Lastgang-Analyse", href: LASTGANG_PFAD }}
      />
    </div>
  );
}

function naechstePruefung(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + PRUEF_ZYKLUS_TAGE);
  return d.toISOString().slice(0, 10);
}
