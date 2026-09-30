// src/app/netzanmeldung/page.js
//
// Übersicht „PV-Anlage beim Netzbetreiber anmelden“: Wer ist mein Netzbetreiber,
// die fünf größten Verteilernetzbetreiber, allgemeiner Ablauf, Einspeisezählpunkt
// (Engpass beim EAG-Fördercall 08.–22.10.2026), Checkliste, ElWG, FAQ, Quellen.
// Daten und Quellen: src/data/netzbetreiber.js (Stand 30.09.2026).

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, FileSearch, Hash, PlugZap, Receipt, Scale, Search, Send, Sun, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Bildnachweis, Fachdetails, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Checkliste, Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import BetreiberKarten from "@/components/Netzanmeldung/BetreiberKarten";
import NetzCheckliste from "@/components/Netzanmeldung/NetzCheckliste";
import ZaehlpunktPruefer from "@/components/Netzanmeldung/ZaehlpunktPruefer";
import { ABLAUF, AUSWAHL, CHECKLISTE, DRUCK_PFAD, EAG_BEZUG, ELWG, FAQ, HINWEIS_GEWAEHR, NETZBETREIBER, PFAD, Q, STAND, ZAEHLPUNKT, betreiberPfad } from "@/data/netzbetreiber";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITLE = "PV-Anlage beim Netzbetreiber anmelden 2026 | Ökovolt";
const DESCRIPTION = "PV-Anlage in Österreich anmelden: Netzbetreiber finden, Ablauf, Unterlagen und Einspeisezählpunkt für den EAG-Fördercall – bei den 5 größten Netzbetreibern.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["PV-Anlage anmelden Netzbetreiber", "Netzanmeldung Photovoltaik Österreich", "Einspeisezählpunkt beantragen", "Netzzugangsantrag PV", "Balkonkraftwerk anmelden Österreich", "Einspeisezählpunkt EAG Fördercall", "Wer ist mein Netzbetreiber"],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "PV-Anlage beim Netzbetreiber anmelden" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";
const ICONS = [<Search key="1" />, <Sun key="2" />, <Send key="3" />, <Hash key="4" />, <Receipt key="5" />, <Wrench key="6" />, <Zap key="7" />];
const zahl = (n) => n.toLocaleString("de-DE");

const WEGE = [
  { icon: Receipt, titel: "Auf der Stromrechnung", text: "Netzbetreiber und Stromlieferant sind zwei verschiedene Unternehmen. Der Netzbetreiber steht bei den Netzkosten – auch bei getrennten Rechnungen." },
  { icon: Hash, titel: "In der Zählpunktbezeichnung", text: "Die Stellen 3 bis 8 Ihres Zählpunkts sind die Nummer Ihres Netzbetreibers. Den Zählpunkt finden Sie auf Rechnung oder Vertrag." },
  { icon: FileSearch, titel: "Bei der E-Control", text: "Die Regulierungsbehörde listet im Tarifkalkulator alle österreichischen Netzbetreiber samt Kontaktdaten." },
];

export default function NetzanmeldungPage() {
  const maxAnzahl = AUSWAHL.rangliste[0].anzahl;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "PV-Anlage beim Netzbetreiber anmelden",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
    hasPart: NETZBETREIBER.map((b) => ({ "@type": "WebPage", name: `PV-Anlage bei ${b.kurz} anmelden`, url: `${BASE_URL}${betreiberPfad(b.slug)}` })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Netzanmeldung" }]}
        eyebrow={`Netzanmeldung · Stand ${STAND.label}`}
        title={<>PV-Anlage beim Netzbetreiber <span className="ov-text-gradient-light">anmelden</span></>}
        lead="Ohne Einspeisezählpunkt kein Ticket im EAG-Fördercall am 08.10.2026. Hier sehen Sie, wer Ihr Netzbetreiber ist, wie die Anmeldung bei den fünf größten Netzbetreibern Österreichs abläuft und welche Unterlagen Sie brauchen."
        image={{ src: "/Images/AT/ratgeber/hochspannungsleitung-molln.jpg", alt: "Hochspannungsleitung über einer Wiese bei Molln in Oberösterreich", position: "center 40%" }}
        points={["5 Netzbetreiber im Vergleich", "Einspeisezählpunkt vor dem Bau", "Checkliste zum Ausdrucken", "Jede Angabe mit Quelle"]}
        actions={[
          { label: "Netzanmeldung übergeben", href: "/angebot?objekt=gewerbe" },
          { label: "Zum Netzbetreiber", href: "#netzbetreiber", icon: PlugZap },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: 33, suffix: " Stellen", label: "hat jede Zählpunktbezeichnung, beginnend mit AT" },
          { value: 20, suffix: " kW", label: "Anzeige statt Antrag nach § 96 ElWG" },
          { value: 4, suffix: " Wochen", label: "Frist des Netzbetreibers bei Anlagen bis 20 kW" },
          { text: "08.10.", label: "Ticketziehung im EAG-Fördercall, ab 17 Uhr" },
        ]}
      />

      {/* Wer ist mein Netzbetreiber? */}
      <Section tone="white" space="md" id="wer" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Schritt 1"
              title={<>Wer ist mein <span className="ov-text-gradient">Netzbetreiber?</span></>}
              lead="Angemeldet wird die PV-Anlage bei dem Verteilernetzbetreiber, an dessen Netz Ihr Standort hängt – nicht beim Stromlieferanten. In Österreich gibt es über hundert davon, von landesweiten Netzgesellschaften bis zu kleinen Gemeinde-E-Werken."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={Q.econtrolSuche.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-950 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-navy-800"
              >
                Netzbetreiber-Suche der E-Control
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">(externer Link, neues Fenster)</span>
              </a>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">Offizielle Übersicht der Regulierungsbehörde E-Control; wir verlinken nur und übernehmen keine Daten.</p>
          </div>
          <ul className="grid gap-3">
            {WEGE.map((w, i) => {
              const Icon = w.icon;
              return (
                <Reveal as="li" key={w.titel} delay={i * 80} className="flex gap-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-700 ring-1 ring-ov-100">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[17px] font-bold text-ink-900">{w.titel}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{w.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Die fünf Netzbetreiber */}
      <Section tone="sand" space="md" id="netzbetreiber" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Die fünf größten Netzbetreiber"
            title="Anmeldung Schritt für Schritt – je Netzbetreiber"
            lead="Portal, Unterlagen, Fristen, Kosten und wann der Einspeisezählpunkt kommt. Gleich aufgebaut für alle fünf, jede Angabe mit Quelle beim Netzbetreiber."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Geprüft am {STAND.label}</StandPille>
        </div>
        <BetreiberKarten betreiber={NETZBETREIBER} />
        <p className="mt-6 text-[14px] leading-relaxed text-ink-600">
          Ihr Netzbetreiber ist nicht dabei – etwa KNG-Kärnten Netz, TINETZ, LINZ NETZ oder ein Stadtwerk? Der Ablauf ist ähnlich; Details nennt die{" "}
          <a href={Q.econtrolSuche.url} target="_blank" rel="noopener noreferrer" className={LINK}>
            Übersicht der E-Control
          </a>
          . Für unsere Projekte übernehmen wir die Anmeldung beim jeweils zuständigen Netzbetreiber.
        </p>
      </Section>

      {/* Auswahl – dunkle Kontrast-Sektion */}
      <Section tone="navy" space="md" id="auswahl" className="ov-noise isolate scroll-mt-24 overflow-hidden">
        <Glow />
        <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <SectionHeading dark eyebrow="Warum diese fünf" title="Gemessen an den Zählpunkten im Netz" lead={AUSWAHL.text} />
          <div className="ov-glass rounded-3xl p-5 md:p-7">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/55">Zählpunkte je Netzbetreiber, Ende 2024</p>
            <ol className="mt-5 space-y-3">
              {AUSWAHL.rangliste.map((r, i) => {
                const breite = Math.max(4, Math.round((r.anzahl / maxAnzahl) * 100));
                const drin = !!r.slug;
                return (
                  <li key={r.name} className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 sm:grid-cols-[1.5rem_11rem_minmax(0,1fr)]">
                    <span className={`ov-num text-right text-[13px] font-bold ${drin ? "text-ov-300" : "text-white/35"}`}>{i + 1}</span>
                    <span className={`truncate text-[14px] font-semibold ${drin ? "text-white" : "text-white/45"}`}>{r.name}</span>
                    <span className="col-start-2 flex items-center gap-3 sm:col-start-3">
                      <span aria-hidden="true" className="block h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <span className={`block h-full rounded-full ${drin ? "bg-gradient-to-r from-ov-300 to-ov-500" : "bg-white/25"}`} style={{ width: `${breite}%` }} />
                      </span>
                      <span className={`ov-num w-[5.5rem] shrink-0 text-right text-[13px] ${drin ? "text-white/80" : "text-white/40"}`}>{zahl(r.anzahl)}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-[12.5px] leading-relaxed text-white/50">
              Quelle:{" "}
              <a href={AUSWAHL.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                {AUSWAHL.quelle.titel}
              </a>
              . Österreich gesamt: {zahl(AUSWAHL.gesamt)} Zählpunkte.
            </p>
          </div>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="md" id="ablauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Allgemeiner Ablauf"
          title="Von der Anmeldung bis zur Freigabe"
          lead="Die Schritte sind bei allen Netzbetreibern ähnlich – Portale, Zuständigkeiten und Fristen unterscheiden sich. Die Details stehen auf den Seiten der einzelnen Netzbetreiber."
          className="mb-10 md:mb-12"
        />
        <Prozess
          name="PV-Anlage beim Netzbetreiber in Österreich anmelden"
          beschreibung={`Allgemeiner Ablauf der Netzanmeldung einer Photovoltaikanlage, Stand ${STAND.label}.`}
          schritte={ABLAUF.map((s, i) => ({ icon: ICONS[i], name: s.titel, text: s.text }))}
        />
      </Section>

      {/* Einspeisezählpunkt & EAG */}
      <Section tone="sand" space="md" id="zaehlpunkt" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading eyebrow="Einspeisezählpunkt" title={<>Der Engpass vor dem <span className="ov-text-gradient">Fördercall</span></>} lead={EAG_BEZUG.text} />
            <Checkliste className="mt-7" items={EAG_BEZUG.punkte} />
            <Link href="/forderungen/eag-foerdercall" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alles zum EAG-Fördercall Oktober 2026
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <ZaehlpunktPruefer />
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="font-display text-[17px] font-bold text-ink-900">Gut zu wissen</p>
              <ul className="mt-4 space-y-2.5 text-[14.5px] leading-relaxed text-ink-700">
                {ZAEHLPUNKT.punkte.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[12.5px] text-ink-500">
                Aufbau laut{" "}
                <a href={Q.torZaehler.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                  TOR Stromzähler der E-Control
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Checkliste */}
      <Section tone="white" space="md" id="checkliste" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Checkliste"
          title="Alles für die Netzanmeldung beisammen?"
          lead="Sechzehn Punkte von der Vorbereitung bis zur Freigabe. Haken Sie ab, was erledigt ist – der Stand bleibt nur in Ihrem Browser. Die Druckversion lässt sich auch als PDF speichern."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <NetzCheckliste gruppen={CHECKLISTE} druckHref={DRUCK_PFAD} />
        </Reveal>
      </Section>

      {/* ElWG */}
      <Section tone="sand" space="md" id="elwg" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Elektrizitätswirtschaftsgesetz" title="Was das ElWG regelt – und was noch offen ist" lead={ELWG.kurz} />
          <StandPille className="shrink-0 self-start md:self-auto">Gesetzestext geprüft am {STAND.label}</StandPille>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <ul className="grid gap-3 sm:grid-cols-2">
            {ELWG.belegt.map((p, i) => (
              <Reveal as="li" key={p.titel} delay={(i % 2) * 70} className="flex flex-col rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
                <p className="flex items-start justify-between gap-3">
                  <span className="font-display text-[16.5px] font-bold leading-snug text-ink-900">{p.titel}</span>
                  <span className="shrink-0 rounded-full bg-ov-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-ov-700 ring-1 ring-ov-100">{p.norm}</span>
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{p.text}</p>
              </Reveal>
            ))}
          </ul>
          <div className="rounded-3xl bg-navy-950 p-6 text-white md:p-7">
            <p className="flex items-center gap-2 font-display text-[18px] font-bold">
              <Scale aria-hidden="true" className="h-5 w-5 text-sun-400" />
              Noch offen
            </p>
            <ul className="mt-5 space-y-4">
              {ELWG.offen.map((o) => (
                <li key={o.titel}>
                  <p className="text-[14.5px] font-semibold text-white">{o.titel}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-white/65">{o.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Hinweis titel="Bis 20 kW: Anzeige statt Antrag" className="mt-8">
          Äußert sich der Netzbetreiber binnen vier Wochen nach vollständiger Anzeige nicht, ist die Anlage anzuschließen (§ 96 Abs. 2 ElWG). Das ersetzt aber nicht die Fertigmeldung und die Freigabe vor dem ersten Einspeisen. Mehr zu Normen und TOR Erzeuger unter{" "}
          <Link href="/forderungen/richtlinien" className={LINK}>Richtlinien & Netzanschluss</Link>.
        </Hinweis>
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Netzanmeldung – kurz beantwortet" lead={`Stand ${STAND.label}. ${HINWEIS_GEWAEHR}`}>
            <ul className="mt-6 space-y-2">
              {NETZBETREIBER.map((b) => (
                <li key={b.slug}>
                  <Link href={betreiberPfad(b.slug)} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                    PV-Anlage bei {b.kurz} anmelden
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Fachdetails className="mt-12" titel="Für Technik & Einkauf: Netzebenen und Typ-B-Anlagen" untertitel="Was sich mit wachsender Leistung ändert">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-display text-[17px] font-bold text-ink-900">Netzebene nach netzwirksamer Leistung (§ 97 ElWG)</p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-ink-700">
                <li><strong className="text-ink-900">bis 100 kW:</strong> Netzebene 7</li>
                <li><strong className="text-ink-900">über 100 bis 400 kW:</strong> Netzebene 6 – Trafostation</li>
                <li><strong className="text-ink-900">über 400 kW bis 5 MW:</strong> Netzebene 5</li>
                <li><strong className="text-ink-900">über 5 MW bis 200 MW:</strong> Netzebene 4 oder 3</li>
              </ul>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">Abweichungen sind aus technischen Gründen oder im Einvernehmen möglich; einzelne Netzbetreiber nennen eigene Schwellen.</p>
            </div>
            <div>
              <p className="font-display text-[17px] font-bold text-ink-900">Ab 250 kW (TOR Erzeuger Typ B)</p>
              <Checkliste
                className="mt-3"
                items={["Anlagenkonzept vorab mit dem Netzbetreiber abstimmen", "Konformitätserklärung bzw. Nachweise nach TOR, bei großen Anlagen Simulationen", "Fernwirk- bzw. Leitsystemanbindung – je nach Netzbetreiber mit Pauschale", "Parkregler für Blind- und Wirkleistung am Netzanschlusspunkt"]}
              />
              <Link href="/technik/parkregler" className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                Parkregler (EZA-Regler) von Ökovolt
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Fachdetails>
        <Quellen
          klappbar
          className="mt-6"
          stand={STAND.label}
          quellen={[AUSWAHL.quelle, Q.econtrolSuche, Q.econtrolTarifkalkulator, Q.torZaehler, ...ELWG.quellen, ...EAG_BEZUG.quellen].map((q) => ({ label: q.titel, url: q.url }))}
          hinweis={`${HINWEIS_GEWAEHR} Die Quellen der einzelnen Netzbetreiber stehen auf deren Seiten. Orientierung ohne Gewähr, keine Rechtsberatung.`}
        />
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Netzanmeldung aus einer Hand"
        title="Wir übernehmen die Netzanmeldung für Ihre Anlage."
        text="Von der Netzanfrage über den Einspeisezählpunkt bis zur Fertigmeldung: Unsere Elektrofachkräfte stellen Antrag und Nachweise beim zuständigen Netzbetreiber und bereiten die Unterlagen für den EAG-Fördercall vor – in ganz Österreich."
        primary={{ label: "Anlage anfragen", href: "/angebot?objekt=gewerbe" }}
        secondary={{ label: "Beratungstermin buchen", href: "/termin?thema=gewerbe", icon: CalendarClock }}
      />
      <Bildnachweis
        items={[
          { motiv: "Hochspannungsleitung bei Molln, Oberösterreich", urheber: "Naturpuur", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Gradau_Hochspannungsleitung,_Marktgemeinde_Molln.jpg" },
          ...NETZBETREIBER.map((b) => ({ motiv: b.bild.motiv, urheber: b.bild.urheber, lizenz: b.bild.lizenz, href: b.bild.href })),
        ]}
      />
    </div>
  );
}

