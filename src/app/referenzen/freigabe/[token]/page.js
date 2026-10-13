// src/app/referenzen/freigabe/[token]/page.js
//
// Referenz-Freigabe per Einmal-Link (Welle A07). Der Kunde entscheidet einzeln und ohne
// Vorankreuzung, was wir auf der Projektseite zeigen dürfen: Firmenname, Logo, Zitat, Fotos
// der Anlage, Projekt-Plakette, Live-Daten, Messwerte. Pflicht: Vertretungsbefugnis.
// noindex/nofollow, keine Speicherung im Cache (force-dynamic → no-store), kein Referrer.
// ?widerruf=1 (Link aus der Bestätigungsmail): Widerruf per Klick, der Aufruf allein ändert nichts.
// Der Token „test-token“ zeigt die Seite mit Beispieldaten für die QA – es wird nichts gespeichert.

import Link from "next/link";
import { headers } from "next/headers";
import { Clock, ShieldCheck } from "lucide-react";
import FreigabeFormular from "./FreigabeFormular";
import { FREIGABE_TEXT_VERSION, TEST_TOKEN, freigabeLesen, tokenGueltig } from "@/lib/kundenbuehneServer";
import { ipAdresse } from "@/lib/ipAdresse";
import { FIRMA } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Referenz-Freigabe | Ökovolt",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
  referrer: "no-referrer",
};

function Karte({ icon: Icon, titel, children }) {
  return (
    <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-ink-200/70 md:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-[26px] font-extrabold tracking-tight text-ink-900">{titel}</h1>
      <div className="mt-3 text-[15.5px] leading-relaxed text-ink-600">{children}</div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={`mailto:${FIRMA.email}`} className="inline-flex h-12 items-center justify-center rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
          {FIRMA.email}
        </a>
        <a href={FIRMA.telefonHref} className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200">
          {FIRMA.telefon}
        </a>
      </div>
    </div>
  );
}

export default async function FreigabeSeite({ params, searchParams }) {
  const [{ token }, sp, kopf] = await Promise.all([params, searchParams, headers()]);
  const widerruf = sp?.widerruf === "1";
  const ip = ipAdresse({ headers: kopf });
  const gueltigeForm = token === TEST_TOKEN || tokenGueltig(token);

  let inhalt;
  if (!gueltigeForm) {
    inhalt = (
      <Karte icon={Clock} titel="Dieser Link ist nicht gültig.">
        Bitte prüfen Sie, ob der Link vollständig kopiert wurde, oder antworten Sie uns einfach per E-Mail. Wir schicken Ihnen gern einen neuen Link.
      </Karte>
    );
  } else if (widerruf) {
    inhalt = (
      <FreigabeFormular token={token} modus="widerruf" test={token === TEST_TOKEN} />
    );
  } else {
    const daten = await freigabeLesen(token, ip);
    if (!daten) {
      inhalt = (
        <Karte icon={Clock} titel="Dieser Link ist nicht mehr gültig.">
          Entweder haben Sie Ihre Freigabe bereits erteilt, oder der Link ist abgelaufen (er gilt 30 Tage). Schreiben Sie uns kurz – wir schicken Ihnen einen neuen Link.
        </Karte>
      );
    } else if (daten.status === "offline") {
      inhalt = (
        <Karte icon={Clock} titel="Die Freigabeseite ist gerade nicht erreichbar.">
          Bitte versuchen Sie es in einigen Minuten erneut oder antworten Sie uns per E-Mail.
        </Karte>
      );
    } else if (daten.status !== "offen") {
      const texte = {
        freigegeben: ["Vielen Dank – Ihre Freigabe ist bereits bei uns.", "Sie haben diese Erklärung schon abgegeben. Eine Kopie mit Widerrufslink haben Sie per E-Mail erhalten. Änderungen oder ein Widerruf sind jederzeit formlos per E-Mail möglich."],
        widerrufen: ["Diese Freigabe wurde widerrufen.", "Wir zeigen die betroffenen Inhalte nicht mehr. Wenn Sie erneut freigeben möchten, schicken wir Ihnen gern einen neuen Link."],
        abgelaufen: ["Dieser Link ist abgelaufen.", "Freigabe-Links gelten 30 Tage. Schreiben Sie uns kurz – wir schicken Ihnen einen neuen."],
        link_verbraucht: ["Dieser Link wurde bereits verwendet.", "Eine Kopie Ihrer Erklärung haben Sie per E-Mail erhalten. Bei Fragen melden Sie sich gern."],
      };
      const [titel, text] = texte[daten.status] || texte.link_verbraucht;
      inhalt = (
        <Karte icon={ShieldCheck} titel={titel}>
          {text}
        </Karte>
      );
    } else {
      inhalt = <FreigabeFormular token={token} modus="freigabe" daten={daten} textVersion={FREIGABE_TEXT_VERSION} test={!!daten.test} />;
    }
  }

  return (
    <div className="min-h-[70vh] bg-sand-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        {inhalt}
        <p className="mt-8 text-center text-[13px] leading-relaxed text-ink-500">
          {FIRMA.name} · {FIRMA.strasse} · {FIRMA.plz} {FIRMA.ort} ·{" "}
          <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink-800">
            Datenschutz
          </Link>{" "}
          ·{" "}
          <Link href="/impressum" className="underline underline-offset-2 hover:text-ink-800">
            Impressum
          </Link>
        </p>
      </div>
    </div>
  );
}
