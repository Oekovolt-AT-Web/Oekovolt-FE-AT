// src/app/bildnachweis/page.js
//
// Zentraler Bildnachweis. Liest beim Build alle Quellendateien
// (public/Images/AT/QUELLEN-*.md und public/Images/Ratgeber/QUELLEN.md) ein –
// wer ein Bild ergänzt und dort dokumentiert, muss hier nichts ändern.
// CC-BY- und CC-BY-SA-Lizenzen verlangen die Namensnennung; diese Seite erfüllt
// das zusätzlich zu den Nachweisen direkt auf den Seiten (z. B. unter jedem
// Ratgeber-Titelbild). Zu jedem Nachweis wird – falls vorhanden – eine
// Vorschau des Bildes gezeigt, damit Nachweis und Motiv eindeutig zuordenbar sind.

import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import LegalShell from "@/components/Reusable/LegalShell";
import { pfadAus, quellenDateien, standardOrdner } from "@/components/Ratgeber/bildnachweise";
import { BASE_URL, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/bildnachweis`;
const TITEL = "Bildnachweis | Ökovolt";
const BESCHREIBUNG =
  "Bildnachweis der Website oekovolt.com: Urheber, Quelle und Lizenz aller frei lizenzierten Fotos (Wikimedia Commons, Unsplash, Pexels) sowie Partnerbilder.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
  openGraph: { type: "website", locale: LOCALE, url: PAGE_URL, siteName: SITE_NAME, title: TITEL, description: BESCHREIBUNG },
};

const PUBLIC = path.join(process.cwd(), "public");
const BILD = /([\w.-]+\.(?:jpe?g|png|webp|avif))/i;

/** Vorschaupfad zu einer Nachweiszeile – nur wenn die Datei wirklich existiert. */
function vorschau(text, ordner) {
  const sauber = String(text).replace(/`/g, "");
  const datei = sauber.match(BILD)?.[1];
  if (!datei) return null;
  const pfad = pfadAus(sauber, datei, ordner);
  return fs.existsSync(path.join(PUBLIC, pfad)) ? pfad : null;
}

function Vorschau({ src, klein = false }) {
  if (!src) return null;
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-xl bg-ink-100 ring-1 ring-ink-200/70 ${klein ? "h-12 w-16" : "h-16 w-24"}`}>
      <Image src={src} alt="" fill sizes="96px" className="object-cover" />
    </span>
  );
}

/** Lange URLs lesbar anzeigen: Domain + letzter Pfadteil (Link führt auf die volle Adresse). */
function kurzUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const teile = u.pathname.split("/").filter(Boolean);
    let letzter = teile.length ? decodeURIComponent(teile[teile.length - 1]).replace(/_/g, " ") : "";
    if (letzter.length > 48) letzter = letzter.slice(0, 46) + "…";
    return letzter ? `${host} › ${letzter}` : host;
  } catch {
    return url;
  }
}

/** Text mit URLs, `code` und **fett** in React-Knoten zerlegen – ohne HTML. */
function Inline({ text }) {
  const teile = String(text).split(/(https?:\/\/[^\s)|>]+|`[^`]+`|\*\*[^*]+\*\*)/g);
  return teile.map((t, i) => {
    if (/^https?:\/\//.test(t)) {
      return (
        <a key={i} href={t} target="_blank" rel="noopener noreferrer nofollow" className="break-words" title={t}>
          {kurzUrl(t)}
        </a>
      );
    }
    if (/^`[^`]+`$/.test(t)) return <code key={i}>{t.slice(1, -1)}</code>;
    if (/^\*\*[^*]+\*\*$/.test(t)) return <strong key={i}>{t.slice(2, -2)}</strong>;
    return t;
  });
}

/** Minimaler Markdown-Leser für die Quellendateien: Überschriften, Tabellen, Listen, Absätze – mit Bildvorschau. */
function Markdown({ name, text }) {
  const ordner = standardOrdner(name, text);
  const bloecke = [];
  const zeilen = text.replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < zeilen.length) {
    const z = zeilen[i];
    if (!z.trim()) {
      i++;
      continue;
    }
    const h = z.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const Tag = h[1].length === 1 ? "h2" : "h3";
      bloecke.push(
        <Tag key={i}>
          <Inline text={h[2]} />
        </Tag>
      );
      i++;
      continue;
    }
    if (z.trim().startsWith("|")) {
      const reihen = [];
      while (i < zeilen.length && zeilen[i].trim().startsWith("|")) reihen.push(zeilen[i++]);
      const zellen = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const [kopf, , ...rest] = reihen;
      const k = zellen(kopf);
      const iDatei = k.findIndex((c) => /datei/i.test(c));
      // Tabellen als Karten: je Bild eine Karte mit Vorschau und allen Angaben (lesbar auch mobil)
      bloecke.push(
        <ul key={i} className="!my-6 grid !list-none gap-3 !pl-0 md:grid-cols-2">
          {rest.map((r, n) => {
            const c = zellen(r);
            const titelSpalte = iDatei >= 0 ? iDatei : 0;
            return (
              <li key={n} className="!m-0 flex flex-col rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                <div className="flex items-start gap-3">
                  {iDatei >= 0 && <Vorschau src={vorschau(c[iDatei], ordner)} klein />}
                  <p className="!m-0 min-w-0 break-words text-[14px] font-semibold leading-snug text-ink-900">
                    <Inline text={c[titelSpalte]} />
                  </p>
                </div>
                <dl className="mt-3 grid gap-1.5 text-[13.5px] leading-snug">
                  {c.map((x, m) =>
                    m === titelSpalte || !x ? null : (
                      <div key={m} className="grid grid-cols-[88px_minmax(0,1fr)] gap-2">
                        <dt className="text-ink-500">{k[m]}</dt>
                        <dd className="!m-0 min-w-0 break-words text-ink-700">
                          <Inline text={x} />
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </li>
            );
          })}
        </ul>
      );
      continue;
    }
    if (/^\s*[-*]\s+/.test(z)) {
      const punkte = [];
      while (i < zeilen.length && (/^\s*[-*]\s+/.test(zeilen[i]) || (/^\s{2,}\S/.test(zeilen[i]) && punkte.length))) {
        if (/^\s*[-*]\s+/.test(zeilen[i])) punkte.push(zeilen[i].replace(/^\s*[-*]\s+/, ""));
        else punkte[punkte.length - 1] += " " + zeilen[i].trim();
        i++;
      }
      const mitBild = punkte.map((p) => vorschau(p, ordner));
      bloecke.push(
        mitBild.some(Boolean) ? (
          <ul key={i} className="!list-none !pl-0">
            {punkte.map((p, n) => (
              <li key={n} className="flex items-start gap-4 border-b border-ink-100 py-3 last:border-b-0">
                {mitBild[n] ? <Vorschau src={mitBild[n]} /> : <span className="h-16 w-24 shrink-0" aria-hidden="true" />}
                <span className="min-w-0 text-[15px]">
                  <Inline text={p} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul key={i}>
            {punkte.map((p, n) => (
              <li key={n}>
                <Inline text={p} />
              </li>
            ))}
          </ul>
        )
      );
      continue;
    }
    const absatz = [];
    while (i < zeilen.length && zeilen[i].trim() && !/^(#|\||\s*[-*]\s)/.test(zeilen[i])) absatz.push(zeilen[i++].trim());
    bloecke.push(
      <p key={i}>
        <Inline text={absatz.join(" ")} />
      </p>
    );
  }
  return bloecke;
}

export default function BildnachweisPage() {
  // Je Quellendatei: Titel aus der ersten Überschrift, Rest als Inhalt, Anzahl Bilddateien
  const dateien = quellenDateien().map((d) => {
    const zeilen = d.text.replace(/\r/g, "").split("\n");
    const iTitel = zeilen.findIndex((z) => /^#\s+/.test(z));
    const titel = iTitel >= 0 ? zeilen[iTitel].replace(/^#\s+/, "").replace(/`/g, "") : d.name;
    const rest = iTitel >= 0 ? zeilen.filter((_, n) => n !== iTitel).join("\n") : d.text;
    const bilder = new Set((d.text.match(/[\w.-]+\.(?:jpe?g|png|webp|avif)/gi) || []).map((b) => b.toLowerCase())).size;
    return { ...d, id: d.name.replace(/\.md$/, "").toLowerCase(), titel, rest, bilder };
  });
  return (
    <LegalShell
      titel="Bildnachweis"
      pfad="/bildnachweis"
      lead="Urheberinnen und Urheber, Quellen und Lizenzen der auf dieser Website verwendeten frei lizenzierten Bilder und Partnerfotos."
    >
      <p>
        Die Nachweise sind nach Bereichen der Website gegliedert. Lizenzbedingungen: CC BY 4.0 (creativecommons.org/licenses/by/4.0),
        CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0), CC0 (gemeinfrei) sowie die Lizenzen von Unsplash und Pexels.
        Partnerbilder werden mit Freigabe der jeweiligen Hersteller verwendet.
      </p>
      <p className="mt-4 text-[14px] text-ink-500">
        {dateien.length} Bereiche · {dateien.reduce((s, d) => s + d.bilder, 0)} dokumentierte Bilddateien. Öffnen Sie einen Bereich, um alle Angaben zu sehen.
      </p>
      <div className="mt-6 space-y-3">
        {dateien.map((d) => (
          <details key={d.name} id={d.id} className="group scroll-mt-28 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/70 open:ring-ov-200">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-sand-50 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block font-display text-[16.5px] font-bold leading-snug text-ink-900 [overflow-wrap:anywhere]">{d.titel}</span>
                <span className="mt-0.5 block text-[13px] text-ink-500">{d.bilder} {d.bilder === 1 ? "Bilddatei" : "Bilddateien"}</span>
              </span>
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[18px] font-bold leading-none text-ink-700 transition-all duration-300 group-open:rotate-45 group-open:bg-ov-500 group-open:text-white">
                +
              </span>
            </summary>
            <div className="border-t border-ink-100 px-5 pb-6 pt-2">
              <Markdown name={d.name} text={d.rest} />
            </div>
          </details>
        ))}
      </div>
    </LegalShell>
  );
}
