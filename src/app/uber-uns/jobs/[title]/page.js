// src/app/uber-uns/jobs/[title]/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, CalendarDays, CheckCircle2, Euro, GraduationCap, Mail, MapPin, Phone, Send, Sparkles, Star, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Fliesstext from "@/components/Reusable/Fliesstext";
import Querverweise from "@/components/Reusable/Querverweise";
import KurzBewerbung from "@/components/JobDetails/KurzBewerbung";
import BewerbungsLeiste from "@/components/JobDetails/BewerbungsLeiste";
import { bewerbungsLink, fmtDatum, normalisiereJob } from "@/components/Jobs/jobDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { generateJobSlug } from "@/lib/slugify";

const JOBS_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;
const BASE_URL = "https://www.oekovolt.de";

async function fetchAllJobs() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return [];
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(JOBS_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 } // ISR
    });

    if (!res.ok) {
      let errorText = "";
      try {
        const errorData = await res.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await res.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${res.status}: ${errorText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data?.message) ? data.message : [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

const findeJob = (jobs, slug) => jobs.find((p) => generateJobSlug(p.name) === slug || generateJobSlug(p.title) === slug);

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const jobs = await fetchAllJobs();
    const job = findeJob(jobs, title);

    if (!job) {
      return {
        title: "Job nicht gefunden | Ökovolt",
        robots: { index: false }
      };
    }

    const j = normalisiereJob(job);
    const canonical = `${BASE_URL}/uber-uns/jobs/${title}`;
    const seitenTitel = `${j.titel} in ${j.ort} | Jobs Ökovolt`;
    const description = `Stellenangebot: ${j.titel}${j.anstellung ? ` (${j.anstellung})` : ""} bei Ökovolt in ${j.ort}. Aufgaben, Anforderungen & Vorteile – jetzt unkompliziert per E-Mail bewerben.`;

    return {
      title: seitenTitel,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        url: canonical,
        siteName: "Ökovolt Deutschland",
        title: seitenTitel,
        description,
        images: [{
          url: "https://www.oekovolt.de/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${j.titel} – Ökovolt`
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: seitenTitel,
        description,
        images: ["https://www.oekovolt.de/og-image.jpg"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Job nicht gefunden | Ökovolt",
      robots: { index: false }
    };
  }
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function JobDetailPage({ params }) {
  const { title } = await params;

  const jobs = await fetchAllJobs();
  const job = findeJob(jobs, title);

  if (!job) notFound();

  const j = normalisiereJob(job);
  const weitere = jobs.map(normalisiereJob).filter((x) => x.slug && x.slug !== j.slug).slice(0, 3);
  const canonicalUrl = `${BASE_URL}/uber-uns/jobs/${title}`;
  const mailLink = bewerbungsLink(j.titel);

  // Beschreibung für das Schema: Text + Listen als einfaches HTML
  const schemaBeschreibung =
    [
      j.beschreibung && `<p>${esc(j.beschreibung)}</p>`,
      j.aufgaben.length && `<h3>Ihre Aufgaben</h3><ul>${j.aufgaben.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`,
      j.qualifikationen.length && `<h3>Ihr Profil</h3><ul>${j.qualifikationen.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`,
      j.vorteile.length && `<h3>Ihre Vorteile</h3><ul>${j.vorteile.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`,
    ]
      .filter(Boolean)
      .join("") || job.description || `Stellenangebot bei Ökovolt Solartechnik: ${job.name}`;

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${canonicalUrl}/#jobposting`,
    title: j.titel,
    description: schemaBeschreibung,
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Ökovolt Deutschland",
      sameAs: BASE_URL,
      logo: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Schlingener Str. 1a",
        addressLocality: "Türkheim",
        postalCode: "86842",
        addressRegion: "Bayern",
        addressCountry: "DE",
      },
    },
    url: canonicalUrl,
    datePosted: job.creation ? new Date(String(job.creation).replace(" ", "T")).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    employmentType: j.anstellungSchema,
    directApply: true,
    applicantLocationRequirements: { "@type": "Country", name: "DE" },
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "EUR",
        value: {
          "@type": "QuantitativeValue",
          value: job.salary,
          unitText: "YEAR"
        }
      }
    }),
  };

  const fakten = [
    { icon: MapPin, label: "Arbeitsort", wert: j.ort },
    j.anstellung && { icon: Briefcase, label: "Anstellung", wert: j.anstellung },
    j.gehalt && { icon: Euro, label: "Vergütung", wert: j.gehalt },
    j.datum && { icon: CalendarDays, label: "Veröffentlicht", wert: fmtDatum(j.datum) },
  ].filter(Boolean);

  const listen = [
    { titel: "Ihre Aufgaben", icon: Briefcase, items: j.aufgaben },
    { titel: "Ihr Profil", icon: GraduationCap, items: j.qualifikationen },
    { titel: "Ihre Vorteile", icon: Star, items: j.vorteile },
  ].filter((l) => l.items.length);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns/team" }, { name: "Jobs", href: "/uber-uns/jobs" }, { name: j.titel }]}
        eyebrow="Stellenangebot · Ökovolt"
        title={j.titel}
        lead={`Werden Sie Teil unseres Teams in ${j.ort} und bringen Sie die Energiewende auf die Dächer der Region.`}
        points={[j.ort, j.anstellung, j.gehalt].filter(Boolean)}
        actions={[
          { label: "Jetzt bewerben", href: "#bewerben" },
          { label: "Alle Stellen", href: "/uber-uns/jobs", icon: ArrowLeft },
        ]}
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="min-w-0">
            {j.beschreibung && (
              <Reveal>
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Die Stelle</p>
                <h2 className="ov-h2 mt-3 text-ink-900">Worum es geht</h2>
                <Fliesstext text={j.beschreibung} className="ov-prose mt-6" />
              </Reveal>
            )}

            {listen.length > 0 && (
              <div className={`${j.beschreibung ? "mt-14" : ""} grid gap-5`}>
                {listen.map((l, i) => (
                  <Reveal key={l.titel} delay={i * 80} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
                    <h2 className="flex items-center gap-3 font-display text-[22px] font-extrabold tracking-tight text-ink-900">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500 text-white">
                        <l.icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      {l.titel}
                    </h2>
                    <ul className="mt-6 grid gap-3.5 md:grid-cols-2 md:gap-x-8">
                      {l.items.map((x) => (
                        <li key={x} className="flex gap-3 text-[16px] leading-relaxed text-ink-700">
                          <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ov-600" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal className="mt-14 rounded-3xl bg-navy-950 p-7 text-white md:p-9">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Über Ökovolt</p>
              <h2 className="mt-3 font-display text-[24px] font-extrabold tracking-tight">Photovoltaik aus einer Hand – seit über 15 Jahren</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                {j.firma ||
                  "Von unserem Firmensitz in Türkheim im Unterallgäu planen, montieren und melden wir Photovoltaikanlagen mit Speicher, Wallbox und Wärmepumpe an – für Einfamilienhäuser, Gewerbe und Landwirtschaft."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/uber-uns/team" variant="outlineLight" size="sm" icon={Users}>
                  Team kennenlernen
                </Button>
                <Button href="/referenzen/projekte" variant="outlineLight" size="sm" icon={Sparkles}>
                  Unsere Projekte
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Sticky Bewerbungs-Karte */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.4)] ring-1 ring-ink-200/70 md:p-7">
              <p className="font-display text-[19px] font-bold text-ink-900">Auf einen Blick</p>
              <dl className="mt-5 divide-y divide-ink-100">
                {fakten.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
                      <f.icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[12.5px] text-ink-500">{f.label}</dt>
                      <dd className="text-[15px] font-semibold text-ink-900">{f.wert}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-5 grid gap-2.5">
                <Button href="#bewerben" size="lg" pfeil className="w-full">
                  Jetzt bewerben
                </Button>
                <Button href={mailLink} variant="secondary" icon={Mail} className="w-full">
                  Direkt per E-Mail
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 border-t border-ink-100 pt-5 text-[14px] text-ink-600">
                <Phone aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Fragen vorab? <a href="tel:+498245967880" className="font-semibold text-ink-900 hover:text-ov-700">08245 96 788 0</a>
              </p>
            </div>
          </aside>
        </div>
      </Section>

      {/* Bewerbung */}
      <Section tone="sand" space="lg" id="bewerben" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Bewerbung"
              title={<>So einfach <span className="ov-text-gradient">bewerben Sie sich</span></>}
              lead="Kein Portal, kein Anschreiben-Marathon: Ein Lebenslauf und ein paar Sätze zu Ihnen reichen für den ersten Schritt."
            />
            <ol className="mt-10 space-y-5">
              {[
                { icon: Send, t: "E-Mail mit Lebenslauf senden", x: `An office@oekovolt.de mit dem Betreff „Bewerbung: ${j.titel}“.` },
                { icon: Phone, t: "Wir melden uns bei Ihnen", x: "Für ein erstes Gespräch – telefonisch oder persönlich." },
                { icon: Users, t: "Kennenlernen", x: "Sie lernen Team und Aufgaben kennen und stellen all Ihre Fragen." },
              ].map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 90} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ov-200">
                    <s.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[17px] font-bold text-ink-900">
                      <span className="mr-2 text-ov-500">{String(i + 1).padStart(2, "0")}</span>
                      {s.t}
                    </p>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-ink-600">{s.x}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal dir="scale" className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 md:p-9">
            <p className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Kurzbewerbung</p>
            <p className="mb-6 mt-1.5 text-[15px] text-ink-600">{j.titel}</p>
            <KurzBewerbung titel={j.titel} />
          </Reveal>
        </div>
      </Section>

      {weitere.length > 0 && (
        <Section tone="white" space="md">
          <SectionHeading eyebrow="Weitere Stellen" title="Das könnte auch passen" className="mb-8" />
          <ul className="grid gap-4 md:grid-cols-3">
            {weitere.map((w) => (
              <li key={w.slug}>
                <Link href={`/uber-uns/jobs/${w.slug}`} className="group ov-card-hover flex h-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 hover:bg-white">
                  <h3 className="font-display text-[18px] font-bold text-ink-900 group-hover:text-ov-700">{w.titel}</h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-ink-600">
                    <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    {w.ort}
                    {w.anstellung && ` · ${w.anstellung}`}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Querverweise pfad="/uber-uns/jobs" />
      <BewerbungsLeiste href={mailLink} titel={j.titel} />
    </div>
  );
}
