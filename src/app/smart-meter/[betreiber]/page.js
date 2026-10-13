// src/app/smart-meter/[betreiber]/page.js
//
// „Smart Meter <Betreiber>: Viertelstundenwerte exportieren und auswerten“ – statische Seiten je
// Netzbetreiber, gleiche Struktur für alle (Neutralität). Inhalte und Quellen: src/data/smartmeter.js.
// Doorway-Schutz: Es gibt nur Seiten für Betreiber mit eigenem, belegtem Inhalt (Portal, Zugang,
// Viertelstunden-Aktivierung, Export, Opt-out, Quellen) – Lücken stehen sichtbar unter „Offen“.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarClock, Download, FileSpreadsheet, KeyRound, LogIn, Phone, ShieldOff, Timer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Checkliste, Hinweis, HowTo, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import LastgangUpload from "../LastgangUpload";
import {
  BETREIBER_SLUGS,
  HINWEIS_GEWAEHR,
  HINWEIS_KEIN_NETZBETREIBER,
  LASTGANG_PFAD,
  PFAD,
  PRUEF_ZYKLUS_TAGE,
  Q,
  RECHT,
  SMART_METER_BETREIBER,
  betreiberFaq,
  betreiberFuerSlug,
  betreiberHowTo,
  betreiberPfad,
  datumLabel,
  exportStatus,
  pruefungFaellig,
  tageSeit,
} from "@/data/smartmeter";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return BETREIBER_SLUGS.map((betreiber) => ({ betreiber }));
}

function titelFuer(b) {
  // Höchstens 60 Zeichen – sonst kürzt Google den Titel
  const varianten = [
    `Smart Meter ${b.kurz}: Viertelstundenwerte exportieren | Ökovolt`,
    `Smart Meter ${b.kurz}: Werte exportieren | Ökovolt`,
    `Smart Meter ${b.kurz} auslesen | Ökovolt`,
  ];
  return varianten.find((t) => t.length <= 60) || varianten[varianten.length - 1];
}

function beschreibungFuer(b) {
  const lang = `Smart Meter ${b.kurz} auslesen: ${b.portal.name}, Zugang, Viertelstundenwerte aktivieren, Export${exportStatus(b).belegt ? ` als ${exportStatus(b).label}` : ""}, Opt-out – Datei im Browser auswerten, ohne Upload. Geprüft am ${datumLabel(b.geprueftAm)}.`;
  return lang.length <= 160 ? lang : `Smart Meter ${b.kurz}: Portal, Opt-in, Export, Opt-out – Viertelstundenwerte ohne Upload auswerten. Stand ${datumLabel(b.geprueftAm)}.`;
}

export async function generateMetadata({ params }) {
  const { betreiber } = await params;
  const b = betreiberFuerSlug(betreiber);
  if (!b) notFound();
  const url = `${BASE_URL}${betreiberPfad(b.slug)}`;
  const title = titelFuer(b);
  const description = beschreibungFuer(b);
  return {
    title,
    description,
    keywords: [`Smart Meter ${b.kurz}`, `${b.kurz} Viertelstundenwerte`, `${b.kurz} ${b.portal.name}`, `${b.kurz} Smart Meter Opt-in`, `${b.kurz} Smart Meter Opt-out`, `Smart Meter auslesen ${b.bundesland}`, "Lastgang exportieren"],
    alternates: { canonical: url },
    openGraph: { type: "article", url, siteName: "Ökovolt Österreich", locale: "de_AT", title, description, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `Smart Meter ${b.kurz} auslesen` }] },
    twitter: { card: "summary_large_image", title, description, images: [`${BASE_URL}/og-image.jpg`] },
  };
}

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

function ExternerLink({ href, children, className = LINK }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (externer Link, neues Fenster)</span>
    </a>
  );
}

function Abschnitt({ icon: Icon, titel, children }) {
  return (
    <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
      <h3 className="flex items-center gap-3 font-display text-[19px] font-bold text-ink-900">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-50 text-ov-600 ring-1 ring-ink-200">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        {titel}
      </h3>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-700">{children}</div>
    </Reveal>
  );
}

export default async function SmartMeterBetreiberPage({ params }) {
  const { betreiber } = await params;
  const b = betreiberFuerSlug(betreiber);
  if (!b) notFound();

  const pfad = betreiberPfad(b.slug);
  const pageUrl = `${BASE_URL}${pfad}`;
  const stand = datumLabel(b.geprueftAm);
  const status = exportStatus(b);
  const howTo = betreiberHowTo(b);
  const faq = betreiberFaq(b);
  const faellig = pruefungFaellig(b);
  const andere = SMART_METER_BETREIBER.filter((x) => x.slug !== b.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: `Smart Meter ${b.kurz}: Viertelstundenwerte exportieren und auswerten`,
    description: beschreibungFuer(b),
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    about: { "@type": "Organization", name: b.name, url: new URL(b.portal.url).origin },
    dateModified: b.geprueftAm,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Smart Meter auslesen", href: PFAD }, { name: b.kurz }]}
        eyebrow={`${b.bundesland} · geprüft am ${stand}`}
        title={<>Smart Meter <span className="ov-text-gradient-light">{b.kurz}:</span> Viertelstundenwerte exportieren und auswerten</>}
        lead={`${b.portal.name}, Zugangsdaten, Viertelstundenwerte aktivieren, Export${status.belegt ? ` als ${status.label}` : ""} und Opt-out im Netz der ${b.name} – danach die Datei auf Ihrem Gerät auswerten, ohne Upload.`}
        points={[b.portal.name, `Export: ${status.label}`, b.viertelstundenAktivieren.schritte.length + " Schritte zu den Viertelstundenwerten", "Jede Angabe mit Quelle"]}
        actions={[
          { label: "Zur Anleitung", href: "#anleitung" },
          { label: "Datei auswerten", href: "#auswerten", variant: "outlineLight", icon: FileSpreadsheet },
        ]}
      />

      <KennzahlenBand
        items={[
          b.zaehlpunkte ? { value: b.zaehlpunkte, label: "Zählpunkte im Netz, Ende 2024 (E-Control)" } : { text: b.bundesland, label: "Netzgebiet" },
          { value: 15, suffix: " min", label: "Messintervall der Viertelstundenwerte" },
          { text: status.belegt ? status.label : "zu prüfen", label: "Dateiformat des Exports" },
        ]}
      />

      {faellig && (
        <Section tone="sand" space="sm">
          <Hinweis ton="warn" titel={`Angaben älter als ${PRUEF_ZYKLUS_TAGE} Tage`}>
            Letzte Prüfung vor {tageSeit(b.geprueftAm)} Tagen. Menünamen im Portal können sich geändert haben – maßgeblich sind die Anleitungen von {b.kurz}.
          </Hinweis>
        </Section>
      )}

      {/* Anleitung (HowTo-Schema) */}
      <Section tone="sand" space="md" id="anleitung" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Anleitung" title={`In vier Schritten zu Ihren Viertelstundenwerten bei ${b.kurz}`} lead={b.portal.hinweis} />
            <div className="mt-8 rounded-3xl bg-navy-950 p-6 text-white md:p-7">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Portal</p>
              <p className="mt-2 font-display text-[22px] font-extrabold leading-snug">{b.portal.name}</p>
              <p className="mt-2 break-all text-[14.5px] leading-relaxed text-white/70">{b.portal.url}</p>
              <ExternerLink href={b.portal.url} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14.5px] font-semibold text-navy-900 hover:bg-ov-50">
                Portal öffnen <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </ExternerLink>
              {b.portal.weitere?.length > 0 && (
                <ul className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-[14px]">
                  {b.portal.weitere.map((w) => (
                    <li key={w.url}>
                      <ExternerLink href={w.url} className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white">
                        {w.name}
                      </ExternerLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-4 text-[13px] text-ink-500">{HINWEIS_GEWAEHR}</p>
          </div>
          <HowTo name={howTo.name} beschreibung={howTo.beschreibung} schritte={howTo.schritte} />
        </div>
      </Section>

      {/* Upload */}
      <Section tone="white" space="md" id="auswerten" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <SectionHeading
            eyebrow="Schritt 4"
            title={`Export von ${b.kurz} auswerten – ohne Upload`}
            lead="Die Datei wird auf Ihrem Gerät gelesen und in der Lastgang-Analyse ausgewertet: Jahresverbrauch, Tagesgang, Grundlast, Spitzen, passende PV-Größe und Peak-Shaving-Speicher."
          >
            <p className="mt-5 text-[14.5px] text-ink-600">
              Gängige Portal-Exporte werden automatisch erkannt (Trennzeichen, Datumsformat, kWh oder kW). Excel-Dateien zuvor als CSV speichern.{" "}
              <Link href={LASTGANG_PFAD} className={LINK}>
                Zur Lastgang-Analyse
              </Link>
            </p>
          </SectionHeading>
          <LastgangUpload quelle={b.slug} name={b.kurz} />
        </div>
      </Section>

      {/* Details */}
      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Im Detail" title={`Portal, Zugang, Export und Opt-out bei ${b.kurz}`} lead={`Eigene Formulierungen auf Basis der Anleitungen von ${b.name}; Quellen am Seitenende.`} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Abschnitt icon={LogIn} titel="Zugang zum Portal">
            <p>{b.login.text}</p>
            <Checkliste items={b.login.angaben} />
            <p>
              <ExternerLink href={b.login.url}>Registrierung bei {b.kurz}</ExternerLink>
            </p>
          </Abschnitt>
          <Abschnitt icon={Timer} titel="Viertelstundenwerte aktivieren">
            <p>{b.viertelstundenAktivieren.standard}</p>
            <p>{b.viertelstundenAktivieren.text}</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              {b.viertelstundenAktivieren.schritte.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="text-[14px] text-ink-500">Verfügbarkeit: {b.datenVerfuegbar}</p>
          </Abschnitt>
          <Abschnitt icon={Download} titel="Export und Dateiformat">
            <p>{b.exportWeg.text}</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              {b.exportWeg.schritte.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p>
              <strong className="text-ink-900">Dateiformat:</strong> {b.dateiformat.text}
            </p>
            <p className="text-[14px] text-ink-500">Zeitraum: {b.exportWeg.zeitraum}</p>
          </Abschnitt>
          <Abschnitt icon={ShieldOff} titel="Widerspruch (Opt-out)">
            <p>{b.optOut.text}</p>
            <p>
              <strong className="text-ink-900">Weg:</strong> {b.optOut.weg}
            </p>
            <p>
              <strong className="text-ink-900">Folgen:</strong> {b.optOut.folgen}
            </p>
          </Abschnitt>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {b.kontakt?.length > 0 && (
            <Abschnitt icon={Phone} titel={`Kontakt ${b.kurz}`}>
              <ul className="space-y-1.5">
                {b.kontakt.map((k) => (
                  <li key={k.label}>
                    <span className="text-ink-500">{k.label}:</span> <span className="font-semibold text-ink-900">{k.wert}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[14px] text-ink-500">Für Fragen zu Portal und Zähler ist {b.kurz} zuständig – nicht Ökovolt.</p>
            </Abschnitt>
          )}
          <Abschnitt icon={KeyRound} titel="Offen – zum Prüfdatum nicht belegt">
            <ul className="space-y-1.5">
              {b.offen.map((o) => (
                <li key={o} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun-400" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </Abschnitt>
        </div>
      </Section>

      {/* Rechtsrahmen kurz */}
      <Section tone="white" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Gilt für alle Netzbetreiber" title="§ 54 ElWG: Viertelstundenwerte sind der Normalfall" lead={RECHT.kurz}>
            <StandPille className="mt-5">Gesetzestext geprüft am {stand}</StandPille>
            <p className="mt-4 text-[14.5px]">
              <Link href={PFAD} className={LINK}>
                Alle Regeln im Smart-Meter-Hub
              </Link>
            </p>
          </SectionHeading>
          <ul className="grid gap-4 sm:grid-cols-2">
            {RECHT.punkte.slice(0, 2).map((p) => (
              <li key={p.titel} className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ov-700">{p.norm}</p>
                <p className="mt-2 font-display text-[17px] font-bold text-ink-900">{p.titel}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Smart Meter ${b.kurz} – kurz beantwortet`} lead={HINWEIS_KEIN_NETZBETREIBER} />
          <Faq items={faq} />
        </div>
      </Section>

      {/* Andere Betreiber + Quellen */}
      <Section tone="white" space="md">
        <h2 className="ov-h3 text-ink-900">Andere Netzbetreiber</h2>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {andere.map((x) => (
            <li key={x.slug}>
              <Link href={betreiberPfad(x.slug)} className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 py-2 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200/70 hover:bg-ov-50 hover:text-ov-800">
                {x.kurz}
              </Link>
            </li>
          ))}
        </ul>
        <Quellen
          className="mt-10"
          quellen={[...b.quellen, ...RECHT.quellen, ...(b.zaehlpunkte ? [Q.smartMeterBericht] : [])].map((q) => ({ label: `${q.titel} (abgerufen ${q.abgerufen})`, url: q.url }))}
          stand={stand}
          hinweis={`Alle Angaben wurden an den öffentlichen Seiten und Anleitungen von ${b.name} geprüft. Prüfzyklus ${PRUEF_ZYKLUS_TAGE} Tage.`}
        />
        <p className="mt-5 flex items-center gap-2 text-[13px] text-ink-500">
          <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-600" /> Geprüft am {stand} · Ökovolt ist kein Netzbetreiber.
        </p>
      </Section>

      <Querverweise pfad={pfad} />
      <CtaBand
        eyebrow="Lastgang verstanden – und jetzt?"
        title="Aus Ihren Viertelstundenwerten wird ein Plan für Dach und Speicher."
        text={`Wir werten Ihren Lastgang aus dem ${b.portal.name} im Rahmen der Angebotserstellung aus und planen PV-Anlage, Speicher und Ladeinfrastruktur nach Ihrem echten Verbrauch – in ganz Österreich.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Zur Lastgang-Analyse", href: LASTGANG_PFAD }}
      />
    </div>
  );
}
