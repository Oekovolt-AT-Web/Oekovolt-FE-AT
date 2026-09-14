import Link from "next/link";
import { Clock } from "lucide-react";
import Fortsetzen from "@/components/Scan/Fortsetzen";
import { fortsetzenInfo, tokenGueltig } from "@/lib/scan/backend";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Anfrage fortsetzen | Ökovolt",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default async function FortsetzenSeite({ params }) {
  const { token } = await params;
  const info = tokenGueltig(token) ? await fortsetzenInfo(token).catch(() => null) : null;

  return (
    <div className="min-h-[70vh] bg-sand-50 px-4 py-14 md:py-24">
      <div className="mx-auto max-w-2xl">
        {info ? (
          <Fortsetzen token={token} info={info} />
        ) : (
          <div className="rounded-4xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-200/70 md:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700">
              <Clock aria-hidden="true" className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-[26px] font-extrabold tracking-tight text-ink-900">Dieser Link ist nicht mehr gültig.</h1>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
              Entweder sind Ihre Unterlagen schon bei uns eingegangen, oder der Link ist abgelaufen (er gilt 72 Stunden). Sie können jederzeit neu starten oder uns anrufen.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/solarrechner" className="inline-flex h-12 items-center justify-center rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
                Zum Solarrechner
              </Link>
              <a href="tel:+498245967880" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200">
                08245 96 788 0
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
