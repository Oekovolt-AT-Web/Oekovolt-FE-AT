// src/components/Presse/PresseKontakt.js
//
// Pressekontakt mit Foto (Server-Komponente). Das Foto liefert Ökovolt nach:
//   public/Images/AT/team/isabell-taubinger.jpg  (Hochformat oder quadratisch, ≥ 800 px)
// Fehlt die Datei, erscheinen die Initialen. Veröffentlichung von Name und Foto nur mit
// Einwilligung der Person (DSGVO, § 78 UrhG) – vom Auftraggeber bereitgestellt am 30.09.2026.

import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { FIRMA } from "@/lib/site";

export const PRESSEKONTAKT = {
  name: "Isabell Taubinger",
  rolle: "Presse & Kommunikation",
  foto: "/Images/AT/team/isabell-taubinger.jpg",
  // Eigene Durchwahl/E-Mail vom Auftraggeber bestätigen; bis dahin die zentralen Kontaktdaten.
  email: FIRMA.email,
  telefon: FIRMA.telefon,
  telefonHref: FIRMA.telefonHref,
};

const fotoVorhanden = () => {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", PRESSEKONTAKT.foto));
  } catch {
    return false;
  }
};

const initialen = (name) =>
  name
    .split(" ")
    .map((t) => t[0])
    .join("")
    .slice(0, 2);

/** JSON-LD-Knoten (Person) für die Presseseite */
export function pressekontaktSchema(baseUrl) {
  return {
    "@type": "Person",
    name: PRESSEKONTAKT.name,
    jobTitle: PRESSEKONTAKT.rolle,
    email: PRESSEKONTAKT.email,
    telephone: PRESSEKONTAKT.telefon,
    worksFor: { "@id": `${baseUrl}/#organization` },
    ...(fotoVorhanden() ? { image: `${baseUrl}${PRESSEKONTAKT.foto}` } : {}),
  };
}

export default function PresseKontakt() {
  const k = PRESSEKONTAKT;
  const foto = fotoVorhanden();
  return (
    <figure className="flex flex-col gap-6 overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 sm:flex-row sm:items-center md:p-8">
      <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-ov-500 to-navy-700 ring-4 ring-ov-100 sm:mx-0 md:h-44 md:w-44">
        {foto ? (
          <Image src={k.foto} alt={`${k.name}, ${k.rolle} bei Ökovolt`} fill sizes="176px" className="object-cover object-top" />
        ) : (
          <span aria-hidden="true" className="grid h-full w-full place-items-center font-display text-[44px] font-extrabold text-white">
            {initialen(k.name)}
          </span>
        )}
      </div>
      <figcaption className="text-center sm:text-left">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Ihre Ansprechpartnerin für Medien</p>
        <p className="mt-2 font-display text-[26px] font-extrabold leading-tight text-ink-900">{k.name}</p>
        <p className="mt-1 text-[15px] text-ink-600">{k.rolle}</p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-600">
          Für Interviews, Projektfotos, Zahlen und Hintergründe zu Photovoltaik in Österreich.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a href={`mailto:${k.email}?subject=Presseanfrage`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700">
            <Mail aria-hidden="true" className="h-4 w-4" /> {k.email}
          </a>
          <a href={k.telefonHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-ink-200 transition-colors hover:ring-ov-300">
            <Phone aria-hidden="true" className="h-4 w-4 text-ov-600" /> {k.telefon}
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
