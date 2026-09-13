import Image from "next/image";
import { Mail, Phone } from "lucide-react";

/** Aufbereitung eines Eintrags aus doctype "Team" */
export function normalisiereMitglied(person) {
  return {
    name: person?.vorname || person?.name1 || person?.name || "",
    email: person?.e_mail || "",
    telefon: person?.telefon || "",
    bild: person?.bild_anhagen ? `/api/image?path=${person.bild_anhagen}` : null,
    rolle: person?.rolle || "",
    bio: person?.bio || "",
  };
}

const initialen = (name) =>
  name
    .split(/\s+/)
    .map((t) => t[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function TeamKarte({ m }) {
  return (
    <article className="group ov-card-hover flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-ov-100 to-sand-100">
        {m.bild ? (
          <Image src={m.bild} alt={`${m.name}${m.rolle ? `, ${m.rolle}` : ""} bei Ökovolt`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-[64px] font-extrabold text-ov-600/40">
            {initialen(m.name)}
          </span>
        )}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/40 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[20px] font-bold leading-tight text-ink-900">{m.name}</h3>
        {m.rolle && <p className="mt-1 text-[14.5px] font-medium text-ov-700">{m.rolle}</p>}
        {m.bio && <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-ink-600">{m.bio}</p>}
        {(m.telefon || m.email) && (
          <div className="mt-auto flex gap-2 pt-5">
            {m.telefon && (
              <a href={`tel:${m.telefon.replace(/\s+/g, "")}`} aria-label={`${m.name} anrufen`} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 text-ink-700 ring-1 ring-ink-200 transition hover:bg-ov-500 hover:text-white hover:ring-ov-500">
                <Phone aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
            {m.email && (
              <a href={`mailto:${m.email}`} aria-label={`E-Mail an ${m.name}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 text-ink-700 ring-1 ring-ink-200 transition hover:bg-ov-500 hover:text-white hover:ring-ov-500">
                <Mail aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
