import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Postfach from "@/components/Hinweisgeber/Postfach";

export const metadata = {
  title: "Postfach – Hinweisgebersystem | Ökovolt",
  description: "Anonymes Postfach des Ökovolt-Hinweisgebersystems: Bearbeitungsstand verfolgen und Rückfragen der Meldestelle beantworten.",
  alternates: { canonical: "https://www.oekovolt.de/hinweisgebersystem/postfach" },
  robots: { index: false, follow: false },
};

export default function PostfachPage() {
  return (
    <div>
      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Hinweisgebersystem", href: "/hinweisgebersystem" }, { name: "Postfach" }]}
        eyebrow="Anonymes Postfach"
        title="Ihr sicheres Postfach"
        lead="Verfolgen Sie den Stand Ihrer Meldung und tauschen Sie sich vertraulich mit der Meldestelle aus."
      />
      <div className="bg-sand-50">
        <div className="ov-container py-12 md:py-16">
          <Postfach />
          <p className="mt-8 text-center text-[14px] text-ink-500">
            Noch keine Meldung abgegeben? <Link href="/hinweisgebersystem#meldung" className="font-semibold text-ov-700 underline">Jetzt Meldung abgeben</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
