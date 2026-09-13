// faqs/page.js
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import CtaBand from "@/components/ui/CtaBand";
import FaqExplorer from "@/components/Faqs/FaqExplorer";
import { FAQ_ERGAENZUNG, FAQ_KATEGORIEN } from "@/data/faqs";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.faqs_page.api.get_faqs_page`;
const PAGE_URL = "https://www.oekovolt.de/faqs";

async function fetchFaqsData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await fetchFaqsData();

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "FAQ Photovoltaik: Häufige Fragen & Antworten | Ökovolt",
      description: "Antworten auf die häufigsten Fragen zu Photovoltaik: Kosten, Förderung, Installation, Wartung und Service – klar und verständlich erklärt von Ökovolt.",
      keywords: ["Photovoltaik FAQ", "Solaranlagen Fragen", "PV-Anlage Antworten", "Solarenergie Fragen", "Solar Förderung FAQ"],
      alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "FAQ: Häufige Fragen zu Photovoltaik & Solaranlagen | Ökovolt",
        description: "Antworten auf die häufigsten Fragen zu Photovoltaik: Kosten, Förderung, Installation, Wartung und Service – klar und verständlich erklärt von Ökovolt.",
        images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt FAQ" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "FAQ: Häufige Fragen zu Photovoltaik & Solaranlagen | Ökovolt",
        description: "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik.",
        images: ["https://www.oekovolt.de/og-image.jpg"]
      },
    };
  }

  const defaultKeywords = ["Photovoltaik FAQ", "Solaranlagen Fragen", "PV-Anlage Antworten", "Solarenergie Fragen", "Solar Förderung FAQ"];
  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = "FAQ Photovoltaik: Häufige Fragen & Antworten | Ökovolt";
  const description = "Antworten auf die häufigsten Fragen zu Photovoltaik: Kosten, Förderung, Installation, Wartung und Service – klar und verständlich erklärt von Ökovolt.";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt FAQ" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt FAQ" }],
    },
  };
}

// Nummerierung aus dem Backoffice ("1. Was ...") entfernen – die Reihenfolge ergibt sich aus der Liste.
const ohneNummer = (t = "") => t.replace(/^\s*\d+\.\s*/, "").trim();

export default async function FaqsPage() {
  const data = await fetchFaqsData();

  // Backoffice-Fragen den Themen zuordnen und um redaktionelle Antworten ergänzen.
  const gruppen = FAQ_KATEGORIEN.map((k) => {
    const api = (k.apiFeld && data?.[k.apiFeld]) || [];
    const ausApi = api.filter((it) => it?.question && it?.answer).map((it) => ({ q: ohneNummer(it.question), a: it.answer.trim() }));
    const bekannt = new Set(ausApi.map((it) => it.q.toLowerCase()));
    const ergaenzt = (FAQ_ERGAENZUNG[k.id] || []).filter((it) => !bekannt.has(it.q.toLowerCase()));
    return { id: k.id, label: k.label, items: k.apiZuerst ? [...ausApi, ...ergaenzt] : [...ergaenzt, ...ausApi] };
  }).filter((g) => g.items.length > 0);

  const alle = gruppen.flatMap((g) => g.items);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}/#faqpage`,
    url: PAGE_URL,
    name: "Häufige Fragen zu Photovoltaik, Speicher und Installation",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    mainEntity: alle.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  // Escape "<" so injected JSON can never break out of the script tag
  const toJsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Wissen", href: "/ratgeber" }, { name: "FAQs" }]}
        eyebrow="Hilfe & Antworten"
        title={
          <>
            Häufige Fragen zu <span className="ov-text-gradient-light">Photovoltaik</span>
          </>
        }
        lead={
          data?.first_card_description?.trim() ||
          "Kosten, Förderung, Speicher, Anmeldung und Service: Hier beantworten wir die Fragen, die uns in der Beratung am häufigsten gestellt werden – ehrlich, verständlich und mit Stand 2026."
        }
        stats={[
          { value: alle.length, label: "Antworten" },
          { value: gruppen.length, label: "Themen" },
          { value: 15, suffix: "+", label: "Jahre Erfahrung" },
        ]}
      >
        <nav
          aria-label="Themen der häufigen Fragen"
          className="ov-hero-in absolute top-[200px] hidden w-[360px] xl:block"
          style={{ "--ov-delay": "300ms", right: "max(2rem, calc((100vw - 80rem) / 2 + 2rem))" }}
        >
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-ov-500/20 blur-3xl" />
          <div className="ov-glass relative rounded-[2rem] p-3">
            <p className="px-4 pb-2 pt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Direkt zum Thema</p>
            <ul>
              {gruppen.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white">
                    {g.label}
                    <span className="ov-num flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-[12px] text-white/70 group-hover:bg-ov-500 group-hover:text-white">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </PageHero>

      <Section tone="sand" space="md" className="md:pt-16">
        <FaqExplorer gruppen={gruppen} />
      </Section>

      <Querverweise pfad="/faqs" />
      <CtaBand
        title="Noch Fragen? Wir nehmen uns Zeit dafür."
        text="Im persönlichen Gespräch klären wir alles rund um Ihr Dach, Ihren Verbrauch und die passende Technik – kostenlos und unverbindlich."
        primary={{ label: "Beratung anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
