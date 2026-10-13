// src/app/kommunen/eignung/page.js
//
// Eignungsseite für Gemeinden (Welle B, Paket B09): Registerdaten (GISA, Firmenbuch, Gewerbe
// Elektrotechnik) aus FIRMA, was die Gemeinde bei der Direktvergabe prüft, Referenzliste mit kWp
// (ohne Kundennamen, solange keine Freigabe vorliegt) und CTA „Preisauskunft für Direktvergabe“.
//
// Regeln (Inhaber): Gütesiegel, Haftpflicht und ANKÖ nur mit belegt:true in src/data/eignung.js
// (Start: alles false → nicht sichtbar). Keine Aussagen zu Gesellschaftern. Kennzahlen nur mit
// „Angaben Ökovolt Österreich · Stand …“.

import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Building2, CircleAlert, FileSearch, Landmark, ShieldCheck } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { Hinweis, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { EIGNUNG_PRUEFUNG, EIGNUNG_STAND, QUELLEN, bundeslandAusOrt, nachweiseBelegt } from "@/data/eignung";
import { PROJEKTE, PROJEKTE_STAND } from "@/data/projekte";
import { KUNDEN } from "@/data/kunden";
import { anonymeBezeichnung } from "@/data/branchenZuordnung";
import { zahlText } from "@/data/kennzahlen";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/kommunen/eignung";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Eignung für die Direktvergabe – PV für Gemeinden | Ökovolt";
const BESCHREIBUNG = "Eignungsnachweise für Gemeinden: Gewerbeberechtigung Elektrotechnik (GISA), Firmenbuch, Referenzen mit kWp – und Preisauskunft für die Direktvergabe anfordern.";
const PREISAUSKUNFT = "/angebot?objekt=gemeinde&thema=preisauskunft";
const STAND = EIGNUNG_STAND;
const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Eignungsnachweis Photovoltaik Gemeinde", "Direktvergabe Photovoltaik Preisauskunft", "GISA Elektrotechnik", "PV Errichter Gemeinde Referenzen"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Eignungsnachweise Ökovolt für Gemeinden" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}/og-image.jpg`] },
};

const datum = (iso) => iso.split("-").reverse().join(".");

/** Referenzliste: nur Leistung, Branche und Bundesland – Namen erst mit Freigabe (kunden.js). */
function referenzen() {
  return PROJEKTE.filter((p) => Number(p.leistung) > 0)
    .map((p) => {
      const slug = p.projekt_website_name;
      const k = KUNDEN[slug];
      const name = k?.freigabe?.name === true ? k.firma || p.projekt_name : null;
      return { slug, name, bezeichnung: name || anonymeBezeichnung(slug), land: bundeslandAusOrt(k?.ort), kwp: Number(p.leistung) };
    })
    .sort((a, b) => b.kwp - a.kwp);
}

const kwpText = (x) => `${zahlText(Math.round(x))} kWp`;
const MOBIL_SICHTBAR = 15;

/** Eine kompakte Zeile der Referenzliste (Mobil). */
function RefZeile({ nr, r }) {
  return (
    <li className="flex items-baseline gap-3 px-4 py-2.5">
      <span className="ov-num w-6 shrink-0 text-right text-[12.5px] font-semibold text-ink-500">{nr}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-snug text-ink-900">{r.bezeichnung}</span>
        <span className="block text-[12.5px] leading-snug text-ink-600">{r.land}</span>
      </span>
      <span className="ov-num shrink-0 text-[14px] font-semibold text-ink-900">{kwpText(r.kwp)}</span>
    </li>
  );
}

export default function EignungSeite() {
  const liste = referenzen();
  const summe = liste.reduce((s, r) => s + r.kwp, 0);
  const ab100 = liste.filter((r) => r.kwp >= 100).length;
  const belegt = nachweiseBelegt();
  const standRef = datum(PROJEKTE_STAND);

  const register = [
    { icon: Building2, titel: "Firmenwortlaut und Sitz", wert: FIRMA.name, zusatz: `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.bundesland}` },
    {
      icon: FileSearch,
      titel: "Firmenbuch",
      wert: FIRMA.firmenbuch,
      zusatz: FIRMA.firmenbuchgericht,
      link: { label: "Firmenbuch – Justiz", href: "https://www.justiz.gv.at/service/firmenbuch.5a8.de.html" },
    },
    {
      icon: BadgeCheck,
      titel: "Gewerbeberechtigung",
      wert: `GISA-Zahl ${FIRMA.gisa}`,
      zusatz: `${FIRMA.gewerbe} · ${FIRMA.behoerde}`,
      link: { label: "Abfrage im GISA", href: "https://www.gisa.gv.at/" },
    },
    { icon: Landmark, titel: "Umsatzsteuer-Identifikation", wert: FIRMA.uid, zusatz: `EUID ${FIRMA.euid}` },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Eignungsnachweise für die Direktvergabe von Photovoltaik",
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    audience: { "@type": "Audience", audienceType: "Gemeinden, Gemeindeverbände, Stadtwerke" },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Gemeinden, Länder & Stadtwerke", href: "/kommunen" }, { name: "Eignung" }]}
        eyebrow={`Für Amtsleitung, Bauamt & Vergabestelle · Stand ${STAND.label}`}
        title={
          <>
            Eignung prüfen, <span className="ov-text-gradient-light">Preisauskunft einholen</span>
          </>
        }
        lead="Bei der Direktvergabe prüft die Gemeinde Befugnis, Zuverlässigkeit und Leistungsfähigkeit des Unternehmens. Hier finden Sie unsere Registerdaten zum Selbstprüfen und eine Referenzliste mit Anlagenleistung."
        actions={[
          { label: "Preisauskunft anfordern", href: PREISAUSKUNFT },
          { label: "Registerdaten", href: "#register" },
        ]}
        points={["Gewerbe Elektrotechnik (GISA)", "Firmenbuch", "Referenzen mit kWp", "Preisauskunft für die Direktvergabe"]}
      />

      <Section tone="white" space="md" id="register" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Befugnis & Registerdaten" title="Öffentlich prüfbar" lead="Diese Angaben können Sie in den amtlichen Registern selbst abfragen – ohne Unterlagen von uns." />
          <StandPille className="shrink-0 self-start md:self-auto">Stand {STAND.label}</StandPille>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {register.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.titel} className="flex flex-col rounded-3xl bg-sand-50 p-6">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ov-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{r.titel}</p>
                <p className="ov-num mt-1 font-display text-[19px] font-bold leading-snug text-ink-900">{r.wert}</p>
                <p className="mt-1 flex-1 text-[14px] leading-relaxed text-ink-600">{r.zusatz}</p>
                {r.link && (
                  <a href={r.link.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                    {r.link.label}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(externer Link, neues Fenster)</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {belegt.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-[19px] font-bold text-ink-900">Weitere Nachweise</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {belegt.map((n) => (
                <li key={n.id} className="flex gap-3 rounded-3xl bg-ov-50 p-5">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-700" />
                  <span>
                    <span className="block font-semibold text-ink-900">{n.titel}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">{n.text}</span>
                    {n.stand && <span className="mt-1 block text-[12.5px] text-ink-500">Stand {datum(n.stand)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section tone="sand" space="md" id="pruefung" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Eignungsprüfung bei der Direktvergabe"
          title="Was die Gemeinde üblicherweise prüft"
          lead="Bei der Direktvergabe genügt es, die Eignung spätestens zum Zeitpunkt der Leistungserbringung festzustellen – Art und Umfang bestimmt der Auftraggeber (§ 20 BVergG)."
          className="mb-10"
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {EIGNUNG_PRUEFUNG.map((p, i) => (
            <li key={p.id} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
              <span className="ov-num font-display text-[13px] font-bold text-ov-700">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-[19px] font-bold text-ink-900">{p.titel}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{p.text}</p>
            </li>
          ))}
        </ol>
        <Hinweis ton="warn" titel="Keine Rechtsberatung" className="mt-8">
          Welche Nachweise verlangt werden, legt die Gemeinde als Auftraggeberin fest. Unterlagen wie Firmenbuchauszug, Unbedenklichkeitsbescheinigungen oder Referenzbestätigungen stimmen wir mit der
          Preisauskunft für das konkrete Vorhaben ab. Überblick zum Verfahren:{" "}
          <Link href="/kommunen/vergabe-foerderung" className={LINK}>
            Vergabe & Förderung für Gemeinden
          </Link>
          .
        </Hinweis>
      </Section>

      <Section tone="white" space="md" id="referenzen" className="scroll-mt-24">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Technische Leistungsfähigkeit"
            title="Referenzliste mit Anlagenleistung"
            lead="Errichtete Anlagen aus unserem Referenzarchiv, sortiert nach Leistung. Kundennamen nennen wir erst mit Freigabe – bis dahin Branche und Bundesland."
          />
          <div>
            <dl className="grid grid-cols-3 gap-3">
              {[
                { k: "Anlagen im Archiv mit kWp-Angabe", v: zahlText(liste.length) },
                { k: "davon ab 100 kWp", v: zahlText(ab100) },
                { k: "Summe der Leistung", v: kwpText(summe) },
              ].map((x) => (
                <div key={x.k} className="flex flex-col-reverse justify-end rounded-2xl bg-navy-950 p-4 text-white">
                  <dt className="mt-1 text-[12px] leading-snug text-white/70">{x.k}</dt>
                  <dd className="ov-num font-display text-[18px] font-extrabold leading-tight sm:text-[24px]">{x.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[12.5px] text-ink-500">Angaben Ökovolt Österreich · Stand {standRef} · Referenzarchiv der bisherigen Website</p>
          </div>
        </div>
        <Tabelle
          dicht
          className="hidden md:block"
          caption="Referenzanlagen nach Leistung (ohne Kundennamen ohne Freigabe)"
          spalten={[
            { key: "nr", label: "Nr.", breite: "w-[10%]" },
            { key: "bezeichnung", label: "Branche / Objekt" },
            { key: "land", label: "Bundesland", breite: "w-[24%]" },
            { key: "kwp", label: "Leistung", breite: "w-[22%]" },
          ]}
          zeilen={liste.map((r, i) => ({ nr: String(i + 1), bezeichnung: r.bezeichnung, land: r.land, kwp: kwpText(r.kwp) }))}
        />
        {/* Mobil: kompakte Zeilen statt 57 Karten – die ersten 15, der Rest aufklappbar */}
        <div className="md:hidden">
          <p className="sr-only">Referenzanlagen nach Leistung (ohne Kundennamen ohne Freigabe)</p>
          <ol className="divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/70">
            {liste.slice(0, MOBIL_SICHTBAR).map((r, i) => (
              <RefZeile key={r.slug} nr={i + 1} r={r} />
            ))}
          </ol>
          {liste.length > MOBIL_SICHTBAR && (
            <details className="group mt-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-full bg-sand-100 px-5 text-[14.5px] font-semibold text-ink-900 hover:bg-ink-100 [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Alle {zahlText(liste.length)} Anlagen anzeigen</span>
                <span className="hidden group-open:inline">Weniger anzeigen</span>
              </summary>
              <ol start={MOBIL_SICHTBAR + 1} className="mt-3 divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/70">
                {liste.slice(MOBIL_SICHTBAR).map((r, i) => (
                  <RefZeile key={r.slug} nr={MOBIL_SICHTBAR + i + 1} r={r} />
                ))}
              </ol>
            </details>
          )}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
          Quelle: Referenzprojekte der bisherigen Website oekovolt.com (übernommen 30.09.2026, src/data/projekte.js); Branche und Bundesland laut Unternehmenswebsites der Kunden. Leistung wie
          veröffentlicht, auf ganze kWp gerundet. Jahr und Standort werden ergänzt, sobald sie im Backoffice gepflegt sind.
        </p>
      </Section>

      <Section tone="sand" space="md" id="preisauskunft" className="scroll-mt-24">
        <div className="grid items-center gap-8 rounded-[2rem] bg-white p-6 shadow-[0_40px_90px_-60px_rgba(3,18,43,0.55)] sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Direktvergabe vorbereiten</p>
            <h2 className="mt-2 font-display text-[26px] font-extrabold leading-tight text-ink-900 md:text-[32px]">Preisauskunft für Ihre Direktvergabe</h2>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-600">
              Über 50.000 € netto bemüht sich die Gemeinde um mindestens drei Angebote oder Preisauskünfte (§ 46 Abs. 4 BVergG). Nennen Sie Liegenschaft, Dachfläche und Verbrauch – Sie erhalten eine
              Preisauskunft auf Grundlage Ihrer Leistungsbeschreibung, gern nach unserem herstellerneutralen{" "}
              <Link href="/kommunen/liegenschafts-check#vorlagen" className={LINK}>
                Muster
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={PREISAUSKUNFT} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition hover:bg-ov-700">
              Preisauskunft für Direktvergabe anfordern
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/kommunen/liegenschafts-check"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sand-100 px-6 text-[15px] font-semibold text-ink-900 transition hover:bg-ink-100"
            >
              Erst Liegenschaften vergleichen
            </Link>
          </div>
        </div>
        <Quellen
          className="mt-12"
          stand={STAND.label}
          quellen={QUELLEN}
          hinweis="Orientierung ohne Gewähr, keine Rechtsberatung. Registerdaten laut Impressum; maßgeblich sind die amtlichen Register."
        />
        <p className="mt-6 flex max-w-4xl gap-2 text-[13px] leading-relaxed text-ink-500">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          <span>Die Auswahl des Auftragnehmers trifft allein die Gemeinde im Vergabeverfahren. Diese Seite ist keine Zusage zu Preis, Termin oder Eignung im Einzelfall.</span>
        </p>
      </Section>

      <CtaBand
        eyebrow="Für Gemeinden, Verbände & Stadtwerke"
        title="Fragen zur Vergabe? Wir liefern die technischen Unterlagen."
        text="Dachbewertung, Ertragsprognose, Kostenrahmen und Netzauskunft – als Grundlage für Amtsvortrag, Leistungsbeschreibung und Förderantrag."
        primary={{ label: "Preisauskunft anfordern", href: PREISAUSKUNFT }}
        secondary={{ label: "Video-Termin vereinbaren", href: "/termin?art=video&thema=gemeinde" }}
      />
    </div>
  );
}
