// src/app/netzanmeldung/[betreiber]/page.js
//
// „PV-Anlage bei <Netzbetreiber> anmelden“ – statische Seiten für zehn
// Verteilernetzbetreiber in allen neun Bundesländern. Gleiche Struktur für alle
// (Neutralität): Ablauf, Unterlagen, Fristen, Kosten, Sonderfälle, Energiegemeinschaft,
// Peer-to-Peer, Balkonkraftwerk, EAG-Bezug. Inhalte und Quellen: src/data/netzbetreiber.js.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CalendarClock, CircleHelp, Clock, Coins, ExternalLink, FileCheck2, FileText, Hash, Mail, Phone, PlugZap, Power, Receipt, Send, Sun, Users, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Bildnachweis, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Checkliste, Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import BetreiberKarten from "@/components/Netzanmeldung/BetreiberKarten";
import { BETREIBER_SLUGS, DRUCK_PFAD, EAG_BEZUG, EEG_PFAD, HINWEIS_GEWAEHR, KAPAZITAET_PFAD, NETZBETREIBER, PFAD, ZAEHLPUNKT_PFAD, betreiberFaq, betreiberFuerSlug, betreiberPfad, datumLabel } from "@/data/netzbetreiber";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return BETREIBER_SLUGS.map((betreiber) => ({ betreiber }));
}

function titelFuer(b) {
  // Höchstens 60 Zeichen (QA N1) – sonst kürzt Google den Titel in der Trefferliste
  const varianten = [
    `PV-Anlage bei ${b.kurz} anmelden: Ablauf & Unterlagen 2026 | Ökovolt`,
    `PV bei ${b.kurz} anmelden: Ablauf & Unterlagen 2026 | Ökovolt`,
    `PV-Anlage bei ${b.kurz} anmelden 2026 | Ökovolt`,
  ];
  return varianten.find((t) => t.length <= 60) || `PV bei ${b.kurz} anmelden 2026 | Ökovolt`;
}

function beschreibungFuer(b) {
  const lang = `PV-Anlage bei ${b.kurz} anmelden: Portal, Ablauf, Unterlagen, Fristen, Kosten und Einspeisezählpunkt für den EAG-Fördercall – geprüft am ${datumLabel(b.geprueftAm)}.`;
  return lang.length <= 160 ? lang : `PV bei ${b.kurz} anmelden: Portal, Ablauf, Unterlagen, Fristen, Kosten, Einspeisezählpunkt – Stand ${datumLabel(b.geprueftAm)}.`;
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
    keywords: [`PV-Anlage anmelden ${b.kurz}`, `${b.kurz} Photovoltaik Anmeldung`, `${b.kurz} Einspeisezählpunkt`, `${b.kurz} Netzzugangsantrag`, `Balkonkraftwerk anmelden ${b.bundesland}`, `Energiegemeinschaft ${b.kurz} Datenfreigabe`, `Peer-to-Peer ${b.kurz}`, "Einspeisezählpunkt EAG Fördercall"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Ökovolt Österreich",
      locale: "de_AT",
      title,
      description,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `PV-Anlage bei ${b.kurz} anmelden` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${BASE_URL}/og-image.jpg`] },
  };
}

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";
// Tap-Ziel mindestens 44 px hoch (Touch), ohne das Fließtext-Layout zu sprengen.
const TAP = "inline-block py-3";
const SCHRITT_ICONS = [<Send key="1" />, <FileCheck2 key="2" />, <Hash key="3" />, <Wrench key="4" />, <Receipt key="5" />, <Power key="6" />, <Zap key="7" />];

function ExternerLink({ href, children, className }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (externer Link, neues Fenster)</span>
    </a>
  );
}

export default async function NetzbetreiberPage({ params }) {
  const { betreiber } = await params;
  const b = betreiberFuerSlug(betreiber);
  if (!b) notFound();

  const pfad = betreiberPfad(b.slug);
  const pageUrl = `${BASE_URL}${pfad}`;
  const stand = datumLabel(b.geprueftAm);
  const faq = betreiberFaq(b);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: `PV-Anlage bei ${b.kurz} anmelden`,
    description: beschreibungFuer(b),
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    about: { "@type": "Organization", name: b.name, url: new URL(b.quellen[0].url).origin },
    dateModified: b.geprueftAm,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Netzanmeldung", href: PFAD }, { name: b.kurz }]}
        eyebrow={`Netzanmeldung ${b.bundesland} · geprüft am ${stand}`}
        title={<>PV-Anlage bei <span className="ov-text-gradient-light">{b.kurz}</span> anmelden</>}
        lead={`Portal, Ablauf, Unterlagen, Fristen und Kosten für Photovoltaikanlagen im Netz der ${b.name} – und wann Sie den Einspeisezählpunkt für den EAG-Fördercall bekommen.`}
        image={{ src: b.bild.src, alt: b.bild.alt, position: "center 55%" }}
        points={[b.portal.name, `Einspeisezählpunkt ${b.eckdaten.zaehlpunkt}`, b.eckdaten.gueltigkeit, "Jede Angabe mit Quelle"]}
        actions={[
          { label: "Netzanmeldung übergeben", href: "/angebot?objekt=gewerbe" },
          { label: "Zum Ablauf", href: "#ablauf", icon: PlugZap },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: b.zaehlpunkte, label: "Zählpunkte im Netz, Ende 2024 (E-Control)" },
          { text: "vor dem Bau", label: b.eckdaten.zaehlpunktLabel },
          { value: 20, suffix: " kW", label: "Anzeige statt Antrag nach § 96 ElWG" },
        ]}
      />

      {/* Auf einen Blick */}
      <Section tone="white" space="md" id="ueberblick" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Auf einen Blick" title="Wo und von wem die Anmeldung gestellt wird" lead={b.wer} />
            <div className="mt-8 rounded-3xl bg-navy-950 p-6 text-white md:p-7">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Portal für den Netzzugang</p>
              <p className="mt-2 font-display text-[22px] font-extrabold leading-snug">{b.portal.name}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{b.portal.fuer}</p>
              <ExternerLink href={b.portalUrl} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ov-500 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-600">
                Zum Portal von {b.kurz}
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </ExternerLink>
            </div>
            {b.weiterePortale?.length > 0 && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {b.weiterePortale.map((p, i, alle) => (
                  <li key={p.url} className={`flex ${alle.length % 2 === 1 && i === alle.length - 1 ? "sm:col-span-2" : ""}`}>
                    <ExternerLink href={p.url} className="group flex w-full flex-col rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 transition-colors hover:bg-white hover:ring-ov-200">
                      <span className="flex items-center justify-between gap-3 text-[15px] font-semibold text-ink-900">
                        {p.name}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-hover:rotate-45 group-hover:text-ov-600" />
                      </span>
                      <span className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{p.fuer}</span>
                    </ExternerLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="font-display text-[17px] font-bold text-ink-900">Netzgebiet</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{b.gebiet}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="font-display text-[17px] font-bold text-ink-900">Kontakt beim Netzbetreiber</p>
              <ul className="mt-4 space-y-3">
                {b.kontakt.map((k) => {
                  const Icon = k.href.startsWith("tel:") ? Phone : k.href.startsWith("mailto:") ? Mail : ExternalLink;
                  const extern = k.href.startsWith("http");
                  return (
                    <li key={k.label} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-700 ring-1 ring-ov-100">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] font-semibold uppercase tracking-wider text-ink-500">{k.label}</span>
                        {extern ? (
                          <ExternerLink href={k.href} className="inline-block break-all py-3 text-[15px] font-semibold leading-snug text-ink-900 underline decoration-ink-200 underline-offset-2 hover:text-ov-700">{k.wert}</ExternerLink>
                        ) : (
                          <a href={k.href} className="inline-block break-all py-3 text-[15px] font-semibold leading-snug text-ink-900 underline decoration-ink-200 underline-offset-2 hover:text-ov-700">{k.wert}</a>
                        )}
                        {k.hinweis && <span className="block text-[13px] text-ink-500">{k.hinweis}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 border-t border-dashed border-ink-200 pt-4 text-[12.5px] leading-relaxed text-ink-500">Offizielle Kontaktdaten laut Website des Netzbetreibers, Stand {stand}. Ökovolt ist nicht der Netzbetreiber – Fragen zu Ihrem Netzanschluss richten Sie direkt an diese Stellen.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="navy" space="md" id="ablauf" className="ov-noise isolate scroll-mt-24 overflow-hidden">
        <Glow />
        <div className="relative">
          <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
            <SectionHeading dark eyebrow="Ablauf Schritt für Schritt" title={`Netzanmeldung bei ${b.kurz}`} lead="So beschreibt der Netzbetreiber den Weg von der Anfrage bis zur Freigabe – in eigenen Worten zusammengefasst." />
            <StandPille dark className="shrink-0 self-start md:self-auto">Geprüft am {stand}</StandPille>
          </div>
          <Prozess
            ton="dark"
            name={`PV-Anlage bei ${b.name} anmelden`}
            beschreibung={`Ablauf der Netzanmeldung einer Photovoltaikanlage bei ${b.name}, Stand ${stand}.`}
            schritte={b.schritte.map((s, i) => ({ icon: SCHRITT_ICONS[i], name: s.titel, text: s.text }))}
          />
        </div>
      </Section>

      {/* Unterlagen, Fristen, Kosten */}
      <Section tone="sand" space="md" id="unterlagen" className="scroll-mt-24">
        <SectionHeading eyebrow="Unterlagen, Fristen, Kosten" title="Was Sie brauchen – und was es kostet" lead="Nur, was der Netzbetreiber offiziell nennt. Wo keine Frist oder kein Betrag veröffentlicht ist, steht das dabei." className="mb-10" />
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
            <p className="flex items-center gap-2 font-display text-[19px] font-bold text-ink-900">
              <FileText aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Unterlagen
            </p>
            <Checkliste className="mt-5" items={b.unterlagen} />
            <Link href={DRUCK_PFAD} className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              Allgemeine Checkliste zum Ausdrucken
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-5">
            <Reveal delay={80} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
              <p className="flex items-center gap-2 font-display text-[19px] font-bold text-ink-900">
                <Clock aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Fristen
              </p>
              <dl className="mt-4 space-y-3">
                {b.fristen.map((f) => (
                  <div key={f.titel}>
                    <dt className="text-[14.5px] font-semibold text-ink-900">{f.titel}</dt>
                    <dd className="text-[14px] leading-relaxed text-ink-600">{f.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={140} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
              <p className="flex items-center gap-2 font-display text-[19px] font-bold text-ink-900">
                <Coins aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Kosten & Entgelte
              </p>
              <dl className="mt-4 space-y-3">
                {b.kosten.map((k) => (
                  <div key={k.titel}>
                    <dt className="text-[14.5px] font-semibold text-ink-900">{k.titel}</dt>
                    <dd className="text-[14px] leading-relaxed text-ink-600">{k.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Sonderfälle */}
      <Section tone="white" space="md" id="sonderfaelle" className="scroll-mt-24">
        <SectionHeading eyebrow="Sonderfälle" title="Balkonkraftwerk, Großanlage, Speicher, Erweiterung" lead="Von der Kleinsterzeugungsanlage bis 0,8 kW bis zur Typ-B-Anlage ab 250 kW gelten eigene Regeln." className="mb-10" />
        <ul className="grid gap-4 sm:grid-cols-2">
          {b.sonderfaelle.map((s, i) => (
            <Reveal as="li" key={s.titel} delay={(i % 2) * 80} className={`flex flex-col rounded-3xl p-6 ring-1 ${i === 0 ? "bg-ov-50 ring-ov-100" : "bg-sand-50 ring-ink-200/60"}`}>
              <p className="font-display text-[18px] font-bold leading-snug text-ink-900">{s.titel}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{s.text}</p>
            </Reveal>
          ))}
        </ul>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
            <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
              <Power aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Fertigmeldung und Inbetriebnahme
            </p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{b.inbetriebnahme}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
            <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
              <CircleHelp aria-hidden="true" className="h-5 w-5 text-ov-600" />
              ElWG beim Netzbetreiber
            </p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
              {b.elwg} Was das Gesetz selbst regelt und was noch offen ist, steht in der{" "}
              <Link href={`${PFAD}#elwg`} className={LINK}>Übersicht zur Netzanmeldung</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* Energiegemeinschaft, Peer-to-Peer, Balkonkraftwerk */}
      <Section tone="sand" space="md" id="energiegemeinschaft" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Gemeinsame Energienutzung und Kleinstanlagen" title={`Energiegemeinschaft, Peer-to-Peer und Balkonkraftwerk bei ${b.kurz}`} lead="Datenfreigabe für Energiegemeinschaften, der Anmeldeweg für Peer-to-Peer-Verträge nach ElWG und die vereinfachte Meldung von Kleinsterzeugungsanlagen bis 800 W – so beschreibt es der Netzbetreiber." />
          <StandPille className="shrink-0 self-start md:self-auto">Geprüft am {stand}</StandPille>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <p className="flex items-center gap-2 font-display text-[19px] font-bold text-ink-900">
              <Users aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Energiegemeinschaft
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{b.energiegemeinschaft?.datenfreigabe || "Die Datenfreigabe beschreibt der Netzbetreiber nicht öffentlich."}</p>
            <dl className="mt-4 space-y-2.5 text-[14px]">
              {b.energiegemeinschaft?.formular && (
                <div>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Datenfreigabe</dt>
                  <dd>
                    <ExternerLink href={b.energiegemeinschaft.formular.url} className={`${LINK} ${TAP}`}>{b.energiegemeinschaft.formular.name}</ExternerLink>
                  </dd>
                </div>
              )}
              {b.energiegemeinschaft?.nahbereich && (
                <div>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Nahbereich prüfen</dt>
                  <dd>
                    <ExternerLink href={b.energiegemeinschaft.nahbereich.url} className={`${LINK} ${TAP}`}>{b.energiegemeinschaft.nahbereich.name}</ExternerLink>
                  </dd>
                </div>
              )}
              {b.energiegemeinschaft?.kontakt && (
                <div>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">Kontakt</dt>
                  <dd>
                    <a href={b.energiegemeinschaft.kontakt.href} className="inline-block break-all py-3 font-semibold text-ink-900 underline decoration-ink-200 underline-offset-2 hover:text-ov-700">{b.energiegemeinschaft.kontakt.wert}</a>
                  </dd>
                </div>
              )}
            </dl>
            <Link href={`${EEG_PFAD}#anmeldewege`} className="mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              Anmeldewege aller Netzbetreiber vergleichen
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={80} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <p id="peer-to-peer" className="flex scroll-mt-28 items-center gap-2 font-display text-[19px] font-bold text-ink-900">
              <Zap aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Peer-to-Peer
            </p>
            {b.p2p?.offen && <span className="mt-2 inline-flex w-fit rounded-full bg-sun-300/35 px-2.5 py-0.5 text-[12px] font-semibold text-ink-800">Beim Netzbetreiber zu prüfen</span>}
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{b.p2p?.anmeldeweg || "Den Peer-to-Peer-Anmeldeweg beschreibt der Netzbetreiber nicht öffentlich."}</p>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">Rahmen nach ElWG: neue Modelle ab 05.10.2026 innerhalb eines Netzbetreibers, netzübergreifend voraussichtlich ab April 2027; reduzierte Netzentgelte erst nach der neuen Entgeltverordnung.</p>
            <Link href={`${EEG_PFAD}#anmeldewege`} className="mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              Peer-to-Peer bei allen Netzbetreibern
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={140} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <p id="balkonkraftwerk" className="flex scroll-mt-28 items-center gap-2 font-display text-[19px] font-bold text-ink-900">
              <Sun aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Balkonkraftwerk bis 800 W
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{b.kleinsterzeugung?.text || b.sonderfaelle[0].text}</p>
            {b.kleinsterzeugung?.formular && (
              <p className="mt-4 text-[14px]">
                <span className="block text-[12px] font-semibold uppercase tracking-wider text-ink-500">Meldung</span>
                <ExternerLink href={b.kleinsterzeugung.formular.url} className={`${LINK} ${TAP}`}>{b.kleinsterzeugung.formular.name}</ExternerLink>
              </p>
            )}
            <Link href={`${PFAD}#balkonkraftwerk`} className="mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              Was für alle Netzbetreiber gilt
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href={KAPAZITAET_PFAD} className="group flex items-start gap-4 rounded-3xl bg-navy-950 p-6 text-white transition-colors hover:bg-navy-800">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
              <PlugZap aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-[17px] font-bold">Kapazitäts-Wegweiser: Ist im Netz von {b.kurz} Platz?</span>
              <span className="mt-1 block text-[14px] leading-relaxed text-white/70">Was freie Netzkapazität bedeutet, wo {b.kurz} sie veröffentlicht und warum der Trafo vor Ort entscheidet.</span>
            </span>
            <ArrowRight aria-hidden="true" className="ml-auto mt-1 h-5 w-5 shrink-0 text-ov-300 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href={ZAEHLPUNKT_PFAD} className="group flex items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 transition-colors hover:ring-ov-200">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100">
              <Hash aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-[17px] font-bold text-ink-900">Zählpunkt prüfen</span>
              <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">33 Stellen zerlegen, Netzbetreiber-Kennung erkennen und wissen, warum für den EAG-Antrag nur der Einspeisezählpunkt zählt – nur im Browser.</span>
            </span>
            <ArrowRight aria-hidden="true" className="ml-auto mt-1 h-5 w-5 shrink-0 text-ov-600 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Section>

      {/* EAG-Bezug */}
      <Section tone="green" space="md" id="eag" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading eyebrow="EAG-Fördercall 08.–22.10.2026" title={<>Einspeisezählpunkt bei <span className="ov-text-gradient">{b.kurz}</span></>} lead={b.zaehlpunkt} />
            <Link href="/forderungen/eag-foerdercall" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-navy-950 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-navy-800">
              Zum EAG-Fördercall Oktober 2026
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ov-100 md:p-7">
            <p className="font-display text-[18px] font-bold text-ink-900">{EAG_BEZUG.titel}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{EAG_BEZUG.text}</p>
            <Checkliste className="mt-5" items={EAG_BEZUG.punkte} />
          </div>
        </div>
      </Section>

      {/* Weitere Netzbetreiber */}
      <Section tone="white" space="md" id="weitere" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading eyebrow="Andere Netzgebiete" title="Weitere Netzbetreiber in allen Bundesländern" />
          <Link href={PFAD} className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Übersicht Netzanmeldung
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <BetreiberKarten betreiber={NETZBETREIBER} aktiv={b.slug} kompakt className="lg:grid-cols-5" />
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="sand" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Netzanmeldung bei ${b.kurz} – kurz beantwortet`} lead={`Stand ${stand}. ${HINWEIS_GEWAEHR}`} />
          <Faq items={faq} />
        </div>
        {b.offen?.length > 0 && (
          <Hinweis ton="warn" titel="Nicht eindeutig belegt" className="mt-12">
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {b.offen.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Hinweis>
        )}
        <Quellen
          klappbar
          className="mt-6"
          stand={stand}
          quellen={b.quellen.map((q) => ({ label: q.titel, url: q.url }))}
          hinweis={`${HINWEIS_GEWAEHR} Zusammenfassung in eigenen Worten nach den öffentlich zugänglichen Unterlagen der ${b.name}; Änderungen durch den Netzbetreiber sind jederzeit möglich. Keine Rechtsberatung.`}
        />
      </Section>

      <Querverweise pfad={pfad} />
      <CtaBand
        eyebrow={`Netzanmeldung bei ${b.kurz}`}
        title="Wir übernehmen die Netzanmeldung für Ihre Anlage."
        text={`Antrag, Nachweise, Einspeisezählpunkt und Fertigmeldung – unsere Elektrofachkräfte erledigen die Netzanmeldung bei ${b.kurz} für Sie und bereiten die Unterlagen für den EAG-Fördercall vor.`}
        primary={{ label: "Anlage anfragen", href: "/angebot?objekt=gewerbe" }}
        secondary={{ label: "Beratungstermin buchen", href: "/termin?thema=gewerbe", icon: CalendarClock }}
      />
      <Bildnachweis items={[{ motiv: b.bild.motiv, urheber: b.bild.urheber, lizenz: b.bild.lizenz, href: b.bild.href }]} />
    </div>
  );
}
