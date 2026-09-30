// src/lib/llms.js
//
// llms.txt (https://llmstxt.org) für KI-Suchmaschinen und Antwortmaschinen.
// Wird aus denselben Quellen erzeugt wie Navigation, Ratgeber und Regionen –
// neue Seiten erscheinen automatisch, nichts muss von Hand nachgepflegt werden.
// Die ausführliche Fassung mit Kernaussagen aller Fachartikel: /llms-full.txt

import { NAVIGATION } from "@/data/navigation";
import { alleArtikel, artikelPfad, KATEGORIEN } from "@/lib/ratgeber";
import { REGIONEN } from "@/data/regionen";
import { BASE_URL, FIRMA, SCHWESTER } from "@/lib/site";
// Eigenes Hinweisgebersystem nur verlinken, wenn aktiv (HINWEIS_INTERN=1) – sonst leitet
// /hinweisgebersystem auf IntegrityLine um. Siehe src/data/hinweisgeber.js.
import { HINWEIS_INTERN } from "@/data/hinweisgeber";
import { KENNZAHLEN_SATZ } from "@/data/kennzahlen";

const link = (name, pfad, text) => `- [${name}](${BASE_URL}${pfad})${text ? `: ${text}` : ""}`;

// AN-Zustand: Informationsseite und eigenes Meldesystem getrennt nennen.
const HINWEIS_LINKS_INTERN = [
  link("Hinweisgeberschutz (HSchG): Informationen, Fristen, externe Stelle BAK", "/hinweisgeberschutz"),
  link("Hinweisgebersystem (HSchG, anonym möglich)", "/hinweisgebersystem"),
].join("\n");

export function kopf() {
  const gesellschafter = FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(", ");
  return `# Ökovolt Österreich – ${FIRMA.name}

> Photovoltaik für Gewerbe, Industrie, Landwirtschaft, Tourismus und die öffentliche Hand in ganz Österreich. Dach- und Freiflächenanlagen, Agri-PV, Gewerbespeicher, Ladeinfrastruktur und Energiegemeinschaften – mit eigenem Parkregler (EZA-Regler), eigener Fernwartung und eigenem SCADA-System. Planung, Bau, Netzanschluss, Betrieb und Wartung aus einer Hand, seit 2012.

## Fakten zum Unternehmen

- Firma: ${FIRMA.name} (Rechtsform GmbH)
- Sitz: ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.bundesland}, ${FIRMA.land}
- Firmenbuch: ${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht} · EUID ${FIRMA.euid} · UID ${FIRMA.uid} · GISA ${FIRMA.gisa}
- Gewerbe: ${FIRMA.gewerbe}, Mitglied der ${FIRMA.kammer}
- Gegründet: 16.02.2012 · Geschäftsführer: ${FIRMA.geschaeftsfuehrer}
- Gesellschafter: ${gesellschafter}
- Kontakt: ${FIRMA.telefon} · ${FIRMA.email} · ${BASE_URL}
- Einzugsgebiet: ganz Österreich (alle neun Bundesländer)
- Unternehmensgruppe: Stammhaus der ÖKOVOLT-Gruppe ist die deutsche Schwestergesellschaft ${SCHWESTER.name}, ${SCHWESTER.ort} (seit 2010, ${SCHWESTER.register}). Sie ist Inhaberin der Marke ÖKOVOLT und der Rechte an dieser Website; die österreichische GmbH ist rechtlich selbstständig.
- Kennzahlen (laut Ökovolt Österreich): ${KENNZAHLEN_SATZ}.
- Einordnung: 2021 errichtete die österreichische Gesellschaft PV-Anlagen mit 30 MWp und zählte zu den drei größten IPC-Errichtern (Integrierter Photovoltaik-Contractor) Österreichs; seit 2021 ist die Salzburg AG mit 49 % beteiligt. Die Gründer betreiben seit 2012 eigene Solarparks.
- Zitierhinweis: Unternehmensangaben bitte als „laut Ökovolt“ kennzeichnen; Registerdaten sind im österreichischen Firmenbuch und bei WKO Firmen A–Z überprüfbar.

`;
}

export function seiten() {
  const bereiche = NAVIGATION.map((n) => {
    const zeilen = n.groups.flatMap((g) => g.items).map((i) => link(i.name, i.href, i.text));
    return `### ${n.title}\n\n${n.intro}\n\n${zeilen.join("\n")}`;
  }).join("\n\n");
  return `## Seiten\n\n${bereiche}\n`;
}

export function ratgeber() {
  const artikel = alleArtikel();
  const gruppen = [...KATEGORIEN, ...new Set(artikel.map((a) => a.kategorie).filter((k) => !KATEGORIEN.includes(k)))]
    .map((k) => {
      const liste = artikel.filter((a) => a.kategorie === k);
      if (!liste.length) return "";
      return `### ${k}\n\n${liste.map((a) => link(a.title, artikelPfad(a.slug), a.excerpt || a.description)).join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");
  return `## Ratgeber – Fachartikel für Österreich (mit Quellen, Rechenbeispielen, FAQ)\n\n${gruppen}\n`;
}

export function regionen() {
  const eintraege = Object.entries(REGIONEN || {}).map(([slug, r]) => {
    const name = r?.name || r?.stadt || r?.ort || slug;
    return link(`Photovoltaik ${name}`, `/photovoltaik/${slug}`);
  });
  return `## Regionen in Österreich\n\n${link("Übersicht Einzugsgebiet", "/photovoltaik")}\n${eintraege.join("\n")}\n`;
}

export function fuss() {
  return `## Werkzeuge, Feeds & Rechtliches

${link("Standort-Check: Schneelast, Wind, Hagel & Ertrag (eHORA, ÖNORM B 1991-1-3, PVGIS)", "/standort-check")}
${link("Solarrechner", "/solarrechner")}
${link("Alle Rechner", "/rechner")}
${link("Förder-Check Österreich", "/foerdercheck")}
${link("Energie live – Day-Ahead-Preis Gebotszone Österreich", "/energie-live")}
${link("Photovoltaik-Lexikon", "/wissen/lexikon")}
${link("FAQ", "/faqs")}
${link("RSS: alle Neuigkeiten und Fachartikel", "/rss.xml")}
${link("Impressum", "/impressum")}
${link("Datenschutz", "/datenschutz")}
${link("AGB", "/agb")}
${HINWEIS_INTERN ? HINWEIS_LINKS_INTERN : link("Hinweisgebersystem (HSchG)", "/hinweisgeberschutz")}
${link("Sitemap (XML)", "/sitemap.xml")}
${link("Ausführliche Fassung für KI-Systeme", "/llms-full.txt")}
`;
}
