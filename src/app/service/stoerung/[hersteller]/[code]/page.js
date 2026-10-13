// service/stoerung/[hersteller]/[code]/page.js – Detailseite eines Fehlercodes (Paket C05)
//
// generateStaticParams enthält NUR Einträge mit freigabe_elektrofachkraft:true (dynamicParams
// false → alles andere 404). Jede Seite trägt den Sicherheitshinweis; bei Netzspannungs-Codes
// zusätzlich die Q(U)-Erklärung. Keine Anleitungen zu Arbeiten auf der DC-Seite.

import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, Eye, Wrench } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { JsonLd, serviceMetadata } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import { BASE_URL } from "@/lib/site";
import { DRINGLICHKEIT, HERSTELLER, QU_ERKLAERUNG, SICHERHEITSHINWEIS, STAND, datumDe, stoerungFuer, stoerungPfad, stoerungStaticParams } from "@/data/stoerungen";

export const dynamicParams = false;

export function generateStaticParams() {
  return stoerungStaticParams();
}

function titelFuer(e, h) {
  const varianten = [
    `${h.name} ${e.code}: ${e.titel} – Bedeutung & Ursachen | Ökovolt`,
    `${h.name} ${e.code}: ${e.titel} | Ökovolt`,
    `${h.name} Code ${e.code} erklärt | Ökovolt`,
  ];
  return varianten.find((t) => t.length <= 60) || varianten[varianten.length - 1];
}

export async function generateMetadata({ params }) {
  const { hersteller, code } = await params;
  const e = stoerungFuer(hersteller, code);
  if (!e) notFound();
  const h = HERSTELLER[e.hersteller];
  return serviceMetadata({
    pfad: stoerungPfad(e),
    titel: titelFuer(e, h),
    beschreibung: `${h.name} ${e.code} „${e.titel}“ in eigenen Worten: ${e.bedeutung.slice(0, 90).trim()}… Was Betreiber prüfen dürfen und wann die Elektrofachkraft kommt.`.slice(0, 160),
  });
}

export default async function StoerungCodePage({ params }) {
  const { hersteller, code } = await params;
  const e = stoerungFuer(hersteller, code);
  if (!e) notFound();
  const h = HERSTELLER[e.hersteller];
  const d = DRINGLICHKEIT[e.dringlichkeit] || DRINGLICHKEIT.normal;
  const pfad = stoerungPfad(e);
  const url = `${BASE_URL}${pfad}`;

  const faq = [
    {
      q: `Was bedeutet ${h.name} Code ${e.code}?`,
      a: `${e.titel}: ${e.bedeutung}`,
    },
    {
      q: `Muss bei ${h.name} ${e.code} eine Elektrofachkraft kommen?`,
      a: e.elektrofachkraft_noetig
        ? `Ja. ${d.text} Als Betreiber prüfen Sie nur, was ohne Werkzeug und ohne Öffnen von Gehäusen erkennbar ist; die Ursache klärt die Elektrofachkraft.`
        : `In vielen Fällen nicht sofort: ${d.text} Bleibt die Meldung bestehen oder wiederholt sie sich, prüft eine Elektrofachkraft die Anlage.`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#artikel`,
        headline: `${h.name} ${e.code}: ${e.titel}`,
        description: e.bedeutung,
        inLanguage: "de-AT",
        url,
        dateModified: STAND.geprueftAm,
        author: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        about: `Statusmeldung ${e.code} eines ${h.name}-Wechselrichters`,
        citation: { "@type": "CreativeWork", name: e.quelle.titel, url: e.quelle.url },
      },
    ],
  };

  return (
    <div>
      <JsonLd daten={schema} />

      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[120px]" />
        <div className="ov-container pb-14 pt-8 md:pb-20 md:pt-10">
          <Breadcrumbs items={[{ name: "Service" }, { name: "Störung", href: "/service/stoerung/codes" }, { name: "Fehlercodes", href: "/service/stoerung/codes" }, { name: `${h.name} ${e.code}` }]} dark className="mb-10 md:mb-14" />
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
            {h.name} · Statusmeldung · geprüft von Elektrofachkraft
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-extrabold leading-[1.05] tracking-tight">
            <span className="ov-num text-ov-300">{e.code}</span> – {e.titel}
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75">{e.bedeutung}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={`inline-flex h-9 items-center rounded-full px-4 text-[13.5px] font-semibold ${e.dringlichkeit === "sofort" ? "bg-sun-400 text-navy-950" : e.dringlichkeit === "bald" ? "bg-white text-navy-900" : "bg-white/15 text-white"}`}>{d.label}</span>
            <span className="text-[14px] text-white/70">{d.text}</span>
          </div>
        </div>
      </section>

      <Section tone="white" space="md">
        <Hinweis ton="achtung" titel={SICHERHEITSHINWEIS.titel}>
          <p>{SICHERHEITSHINWEIS.text}</p>
        </Hinweis>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-display text-[19px] font-bold text-ink-900">Typische Ursachen</h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-700">
              {e.ursachen.map((u) => (
                <li key={u} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />
                  {u}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
              <Eye aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-display text-[19px] font-bold text-ink-900">Das dürfen Sie prüfen</h2>
            <p className="mt-1 text-[13px] text-ink-500">Ohne Werkzeug, ohne Öffnen, ohne Schalten an der DC-Seite.</p>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-700">
              {e.darf_betreiber_pruefen.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={160} className="rounded-3xl bg-navy-950 p-6 text-white md:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
              <Wrench aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-display text-[19px] font-bold">Das macht die Elektrofachkraft</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              {e.elektrofachkraft_noetig
                ? "Messung an Strings und AC-Anschluss, Prüfung von Isolation, Klemmstellen, Schutzeinrichtungen und Geräteeinstellungen (Netzprofil, Länderkennung). Danach Prüfbefund und – falls nötig – Instandsetzung oder Garantieabwicklung."
                : "Bleibt die Meldung trotz passender Aufstellung und freier Lüftung bestehen, prüft die Elektrofachkraft Lüfter, Montageort und Gerät und klärt einen Garantiefall mit dem Hersteller."}
            </p>
            <Link href="/service/betriebsfuehrung#anfrage" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white hover:bg-ov-700">
              Störung melden
            </Link>
          </Reveal>
        </div>
      </Section>

      {e.qu && (
        <Section tone="white" space="lg">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <SectionHeading eyebrow="Netzspannung" title={QU_ERKLAERUNG.titel} />
            <Reveal delay={100} className="space-y-5">
              <p className="text-[16px] leading-relaxed text-ink-700">{QU_ERKLAERUNG.text}</p>
              <ol className="space-y-3">
                {QU_ERKLAERUNG.massnahmen.map((m, i) => (
                  <li key={m} className="flex gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
                    <span className="text-[15px] leading-snug text-ink-700">{m}</span>
                  </li>
                ))}
              </ol>
              <p className="text-[13px] text-ink-500">
                Quelle:{" "}
                <a href={QU_ERKLAERUNG.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                  {QU_ERKLAERUNG.quelle.titel}
                </a>
              </p>
            </Reveal>
          </div>
        </Section>
      )}

      <Section tone={e.qu ? "sand" : "white"} space="md">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Quelle dieses Eintrags</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
            Beschreibung in eigenen Worten auf Basis von{" "}
            <a href={e.quelle.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
              {e.quelle.titel}
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            , {e.quelle.version}, abgerufen am {datumDe(e.quelle.abgerufen)}. Hersteller- und Produktnamen dienen der Beschreibung; eine Partnerschaft, Zertifizierung oder Freigabe durch den Hersteller ist damit
            nicht verbunden. Fachlich geprüft von einer Elektrofachkraft der Ökovolt Solartechnik GmbH, Stand {STAND.label}.
          </p>
          <Link href="/service/stoerung/codes" className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ink-800 hover:text-ov-700">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Alle Codes
          </Link>
        </div>
      </Section>

      <FaqSektion items={faq} titel={`${h.name} ${e.code} – kurz beantwortet`} tone={e.qu ? "white" : "sand"} />

      <Abschluss
        stand={STAND.label}
        links={[
          { href: "/service/stoerung/codes", art: "Service", titel: "Fehlercode-Hub" },
          { href: "/service/betriebsfuehrung", art: "Service", titel: "Betriebsführung & Anlagenübernahme" },
          { href: "/service/anlagen-check", art: "Service", titel: "Anlagen-Check" },
          { href: "/service/e-check", art: "Service", titel: "E-Check & Prüfbefund" },
          { href: "/ratgeber/wechselrichter-photovoltaik", art: "Ratgeber", titel: "Wechselrichter erklärt" },
        ]}
        quellen={[{ titel: e.quelle.titel, href: e.quelle.url, hinweis: `${e.quelle.version}, abgerufen am ${datumDe(e.quelle.abgerufen)}` }, ...(e.qu ? [{ titel: QU_ERKLAERUNG.quelle.titel, href: QU_ERKLAERUNG.quelle.url }] : [])]}
      />

      <CtaBand eyebrow="Störungsdienst" title="Meldung notiert? Wir kümmern uns um die Ursache." text="Fernanalyse, Vor-Ort-Einsatz mit Elektrofachkraft, Prüfbefund und Garantieabwicklung – auch für Anlagen, die wir nicht gebaut haben." primary={{ label: "Störung melden", href: "/service/betriebsfuehrung#anfrage" }} secondary={{ label: "Alle Codes", href: "/service/stoerung/codes", icon: ArrowLeft }} />
    </div>
  );
}
