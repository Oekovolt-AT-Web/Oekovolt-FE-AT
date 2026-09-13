import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Nur Aussagen, die sich aus Ökovolts eigenen Texten belegen lassen –
// keine erfundenen Zahlen im wichtigsten Blickfeld der Seite.
const VERTRAUEN = [
  "Über 15 Jahre Erfahrung",
  "Eigenes Montageteam",
  "Planung bis Netzanmeldung",
];

const PhotovoltaikanlageBannerSection = ({
  data,
  // Die Smarthome-Seite nutzt denselben Hero mit eigenen Texten.
  dachzeile = ["Photovoltaik vom Fachbetrieb", "Allgäu & Bayern"],
  titelFallback = "Photovoltaik vom Fachbetrieb im Allgäu",
  textFallback = "Planung, Installation und Service für PV-Anlagen in Bayern und im Allgäu – alles aus einer Hand.",
  cta = { href: "/kontakt", label: "Kostenloses Angebot" },
  zweitCta = { href: "/solarrechner", label: "Ertrag berechnen" },
  vertrauen = VERTRAUEN,
}) => {
  return (
    // min-h statt fester Höhe: längerer Backoffice-Text wurde sonst oben und
    // unten abgeschnitten. Der Banner wächst mit dem Inhalt.
    <section className="relative isolate w-full overflow-hidden bg-[#0a1e35]">
      <div className="absolute inset-0 -z-10">
        <Image
          src={data?.image ? `/api/image?path=${data.image}` : "/Images/Jobs/jobs3.jpg"}
          alt={data?.alt_image || ""}
          fill
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Mobil gleichmäßig abgedunkelt, ab lg ein Verlauf von links –
            der Text steht dort in der linken Hälfte. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/60 lg:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-black/90 via-black/65 to-black/10 lg:block"
        />
      </div>

      <div className="mx-auto flex min-h-[460px] max-w-7xl items-center px-6 py-14 md:px-12 lg:min-h-[560px] lg:py-20">
        <div className="max-w-[680px] text-white">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#a7e255] sm:text-[13px]">
            {/* Mobil sauber zweizeilig statt Umbruch mitten in "Allgäu & Bayern". */}
            <span className="block sm:inline">{dachzeile[0]}</span>
            {dachzeile[1] && (
              <>
                <span aria-hidden="true" className="hidden sm:inline"> · </span>
                <span className="block sm:inline">{dachzeile[1]}</span>
              </>
            )}
          </p>

          {/* H1 bleibt aus dem Backoffice – dort wird es gepflegt. */}
          <h1 className="text-pretty text-[28px] sm:text-balance font-semibold leading-[1.15] tracking-tight sm:text-[36px] lg:text-[46px]">
            {data?.title || titelFallback}
          </h1>

          <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/85 sm:text-[18px]">
            {data?.description || textFallback}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#558822]"
              style={{ backgroundColor: "#669933" }}
            >
              {cta.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href={zweitCta.href}
              className="inline-flex items-center justify-center rounded-md border border-white/70 px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
            >
              {zweitCta.label}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6">
            {vertrauen.map((v) => (
              <li key={v} className="flex items-center gap-2 text-[14px] text-white/90">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#a7e255]" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikanlageBannerSection;
