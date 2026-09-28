import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { slugPfad } from "@/lib/kanaele/veroeffentlichungen";

export const datumDe = (iso) => (iso ? new Date(iso).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Vienna" }) : "");

export default function MeldungKarte({ m, gross = false }) {
  return (
    <Link
      href={slugPfad(m.slug)}
      className={cn("group ov-card-hover flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-300", gross && "xl:flex-row")}
    >
      <div className={cn("relative aspect-[16/9] shrink-0 overflow-hidden bg-sand-100", gross && "xl:aspect-auto xl:w-[52%]")}>
        {m.bild ? (
          <Image src={m.bild} alt={m.bildAlt} fill sizes={gross ? "(min-width:1024px) 640px, 100vw" : "(min-width:1024px) 400px, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-navy-900 to-ov-700" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[12.5px] font-semibold text-ink-900 shadow-sm">{m.kategorie}</span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6", gross && "md:p-8 xl:p-10")}>
        <p className="inline-flex items-center gap-1.5 text-[13px] text-ink-600">
          <CalendarDays aria-hidden="true" className="h-4 w-4 text-ov-600" />
          <time dateTime={m.datum}>{datumDe(m.datum)}</time>
        </p>
        <h3 className={cn("mt-3 font-display font-extrabold tracking-tight text-ink-900 transition-colors group-hover:text-ov-700", gross ? "text-[24px] leading-tight md:text-[30px]" : "text-[19px] leading-snug")}>{m.titel}</h3>
        {m.teaser && <p className={cn("mt-3 text-ink-600", gross ? "line-clamp-4 text-[16.5px] leading-relaxed" : "line-clamp-3 text-[15px] leading-relaxed")}>{m.teaser}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14.5px] font-semibold text-ov-700">
          Weiterlesen
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
