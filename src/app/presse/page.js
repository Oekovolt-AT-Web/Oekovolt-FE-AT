import Link from "next/link";
import { Building2, Download, Mail, Newspaper, Phone, Rss } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import MeldungKarte from "@/components/Kanaele/MeldungKarte";
import { actorId } from "@/lib/kanaele/activitypub";
import { KATEGORIEN, BASE_URL, veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";
import { FIRMA, SCHWESTER } from "@/lib/site";

export const revalidate = 300;

const PAGE_URL = `${BASE_URL}/presse`;
const TITEL = "Presse & Neuigkeiten | Newsroom | Ökovolt";
const BESCHREIBUNG = "Pressemitteilungen, News und Projekte der Ökovolt Solartechnik GmbH aus Ostermiething – Photovoltaik in Österreich. Mit RSS-Feed, Push und Fediverse.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: {
    canonical: PAGE_URL,
    types: {
      "application/rss+xml": [{ url: "/presse/rss.xml", title: "Ökovolt – Presse & Neuigkeiten" }],
      "application/feed+json": [{ url: "/presse/feed.json", title: "Ökovolt – Presse & Neuigkeiten (JSON)" }],
      "application/activity+json": [{ url: actorId("oekovolt"), title: "@oekovolt@oekovolt.com" }],
    },
  },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Newsroom" }] },
  other: { "fediverse:creator": "@oekovolt@oekovolt.com" },
};

export default async function PressePage({ searchParams }) {
  const p = await searchParams;
  const kategorie = KATEGORIEN.some((k) => k.id === p?.kategorie) ? p.kategorie : "";
  const tag = String(p?.tag || "").slice(0, 40);
  const alle = await veroeffentlichungen({ kanal: "website", limit: 60 });
  const liste = alle.filter((m) => (!kategorie || m.kategorie === kategorie) && (!tag || m.hashtags.some((h) => h.toLowerCase() === tag.toLowerCase())));
  const [top, ...rest] = liste;
  const vorhandene = KATEGORIEN.filter((k) => alle.some((m) => m.kategorie === k.id));

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: "Ökovolt Newsroom",
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    mainEntity: { "@type": "ItemList", itemListElement: liste.slice(0, 20).map((m, i) => ({ "@type": "ListItem", position: i + 1, url: m.url, name: m.titel })) },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Presse & Neuigkeiten" }]}
        eyebrow="Newsroom"
        title={<>Neuigkeiten aus der <span className="ov-text-gradient-light">Energiewende.</span></>}
        lead="Pressemitteilungen, Projekte und Unternehmensnews von Ökovolt Österreich – Photovoltaik für Gewerbe, Landwirtschaft und Gemeinden. Als RSS-Feed, Push-Benachrichtigung oder direkt im Fediverse, zum Beispiel über Mastodon oder Threads."
        actions={[
          { label: "Presse-Kontakt", href: "#kontakt", icon: Mail },
          { label: "RSS-Feed", href: "/presse/rss.xml", icon: Rss },
        ]}
      />

      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div className="min-w-0">
            {vorhandene.length > 1 && (
              <nav aria-label="Kategorien" className="mb-8 flex flex-wrap gap-2">
                {[{ id: "", plural: "Alle" }, ...vorhandene].map((k) => (
                  <Link
                    key={k.id || "alle"}
                    href={k.id ? `/presse?kategorie=${encodeURIComponent(k.id)}` : "/presse"}
                    aria-current={kategorie === k.id ? "page" : undefined}
                    className={
                      kategorie === k.id
                        ? "inline-flex h-10 items-center rounded-full bg-navy-950 px-4 text-[14px] font-semibold text-white"
                        : "inline-flex h-10 items-center rounded-full bg-white px-4 text-[14px] font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
                    }
                  >
                    {k.plural}
                  </Link>
                ))}
              </nav>
            )}
            {tag && (
              <p className="mb-6 text-[15px] text-ink-600">
                Beiträge mit <strong className="text-ink-900">#{tag}</strong> ·{" "}
                <Link href="/presse" className="font-semibold text-ov-700 underline underline-offset-2">
                  alle anzeigen
                </Link>
              </p>
            )}

            {liste.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-8 text-center ring-1 ring-ink-200/70 md:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-ov-600">
                  <Newspaper aria-hidden="true" className="h-7 w-7" />
                </span>
                <h2 className="mt-5 font-display text-[24px] font-extrabold text-ink-900">Die nächsten Meldungen folgen in Kürze.</h2>
                <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-ink-600">Abonnieren Sie den Newsroom – dann verpassen Sie keine Pressemitteilung, kein Projekt und keine Neuigkeit.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {top && <MeldungKarte m={top} gross />}
                {rest.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {rest.map((m) => (
                      <MeldungKarte key={m.slug} m={m} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <FolgenBox konten={["oekovolt"]} pushThema="news" />
          </aside>
        </div>
      </Section>

      <Section tone="white" space="lg" id="kontakt" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="Für Redaktionen"
            title="Presse-Kontakt & Material"
            lead="Sie berichten über Photovoltaik in Betrieben, Agri-PV, Energiegemeinschaften, die Energiewende in Gemeinden oder über ein Projekt von uns? Wir liefern Zahlen, Bilder und Ansprechpartner – schnell und unkompliziert."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={`mailto:${FIRMA.email}?subject=Presseanfrage`} className="group rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 transition hover:bg-white hover:ring-ov-300">
              <Mail aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <p className="mt-4 text-[16px] font-semibold text-ink-900">Presseanfragen</p>
              <p className="mt-1 text-[14.5px] text-ink-600">{FIRMA.email}</p>
            </a>
            <a href={FIRMA.telefonHref} className="group rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 transition hover:bg-white hover:ring-ov-300">
              <Phone aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <p className="mt-4 text-[16px] font-semibold text-ink-900">Telefon</p>
              <p className="mt-1 text-[14.5px] text-ink-600">{FIRMA.telefon}</p>
            </a>
            <a href="/Logo-Oekovolt-Gruen-mit-Weiss.webp" download className="group rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 transition hover:bg-white hover:ring-ov-300">
              <Download aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <p className="mt-4 text-[16px] font-semibold text-ink-900">Logo herunterladen</p>
              <p className="mt-1 text-[14.5px] text-ink-600">WebP, für Web und Präsentationen</p>
            </a>
            <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <Building2 aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <p className="mt-4 text-[16px] font-semibold text-ink-900">Unternehmen</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">
                {FIRMA.name} · {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort} · {FIRMA.firmenbuch}, {FIRMA.firmenbuchgericht}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                Gesellschafter: {FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(", ")}. Deutsche Schwestergesellschaft und Markeninhaberin: {SCHWESTER.name}, {SCHWESTER.ort} ({SCHWESTER.land}).
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
