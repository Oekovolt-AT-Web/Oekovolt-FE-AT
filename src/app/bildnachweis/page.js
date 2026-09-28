// src/app/bildnachweis/page.js
//
// Zentraler Bildnachweis. Liest beim Build alle Quellendateien
// (public/Images/AT/QUELLEN-*.md und public/Images/Ratgeber/QUELLEN.md) ein –
// wer ein Bild ergänzt und dort dokumentiert, muss hier nichts ändern.
// CC-BY- und CC-BY-SA-Lizenzen verlangen die Namensnennung; diese Seite erfüllt
// das zusätzlich zu den Nachweisen direkt auf den Seiten.

import fs from "node:fs";
import path from "node:path";
import LegalShell from "@/components/Reusable/LegalShell";
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

const WURZEL = path.join(process.cwd(), "public", "Images");

function quellenDateien() {
  const dateien = [];
  const at = path.join(WURZEL, "AT");
  try {
    for (const f of fs.readdirSync(at).sort()) if (/^QUELLEN-.*\.md$/.test(f)) dateien.push(path.join(at, f));
  } catch {
    /* Ordner fehlt – dann eben nur die übrigen Nachweise */
  }
  const ratgeber = path.join(WURZEL, "Ratgeber", "QUELLEN.md");
  if (fs.existsSync(ratgeber)) dateien.push(ratgeber);
  return dateien.map((d) => ({ name: path.basename(d), text: fs.readFileSync(d, "utf8") }));
}

/** Text mit URLs, `code` und **fett** in React-Knoten zerlegen – ohne HTML. */
function Inline({ text }) {
  const teile = String(text).split(/(https?:\/\/[^\s)|>]+|`[^`]+`|\*\*[^*]+\*\*)/g);
  return teile.map((t, i) => {
    if (/^https?:\/\//.test(t)) {
      return (
        <a key={i} href={t} target="_blank" rel="noopener noreferrer nofollow" className="break-all">
          {t}
        </a>
      );
    }
    if (/^`[^`]+`$/.test(t)) return <code key={i}>{t.slice(1, -1)}</code>;
    if (/^\*\*[^*]+\*\*$/.test(t)) return <strong key={i}>{t.slice(2, -2)}</strong>;
    return t;
  });
}

/** Minimaler Markdown-Leser für die Quellendateien: Überschriften, Tabellen, Listen, Absätze. */
function Markdown({ text }) {
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
      bloecke.push(<Tag key={i}><Inline text={h[2]} /></Tag>);
      i++;
      continue;
    }
    if (z.trim().startsWith("|")) {
      const reihen = [];
      while (i < zeilen.length && zeilen[i].trim().startsWith("|")) reihen.push(zeilen[i++]);
      const zellen = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const [kopf, , ...rest] = reihen;
      bloecke.push(
        <div key={i} className="overflow-x-auto">
          <table>
            <thead>
              <tr>{zellen(kopf).map((c, k) => <th key={k}><Inline text={c} /></th>)}</tr>
            </thead>
            <tbody>
              {rest.map((r, k) => (
                <tr key={k}>{zellen(r).map((c, m) => <td key={m}><Inline text={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
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
      bloecke.push(
        <ul key={i}>
          {punkte.map((p, k) => <li key={k}><Inline text={p} /></li>)}
        </ul>
      );
      continue;
    }
    const absatz = [];
    while (i < zeilen.length && zeilen[i].trim() && !/^(#|\||\s*[-*]\s)/.test(zeilen[i])) absatz.push(zeilen[i++].trim());
    bloecke.push(<p key={i}><Inline text={absatz.join(" ")} /></p>);
  }
  return bloecke;
}

export default function BildnachweisPage() {
  const dateien = quellenDateien();
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
      {dateien.map((d) => (
        <section key={d.name} className="mt-10">
          <Markdown text={d.text} />
        </section>
      ))}
    </LegalShell>
  );
}
