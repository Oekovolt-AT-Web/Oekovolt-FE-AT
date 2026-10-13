"use client";

// src/app/referenzen/freigabe/[token]/FreigabeFormular.js
//
// Formular der Referenz-Freigabe (Welle A07) → POST /api/referenz-freigabe.
// Getrennte, nicht vorangekreuzte Häkchen je Inhalt; Pflicht nur die Vertretungsbefugnis.
// modus "widerruf": Widerruf per Klick (Link aus der Bestätigungsmail).

import { useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Camera, FileBarChart2, Image as ImageIcon, MessageSquareQuote, Radio, ShieldCheck, Type, Undo2 } from "lucide-react";
import { Erfolg, Fehler, Feld, SendeFehler, SendenKnopf, fokusErsterFehler, sende, useFormular } from "@/components/Partner/Formularteile";
import Link from "next/link";
import { BASE_URL, FIRMA } from "@/lib/site";

const ID = "freigabe";

// Website-Adresse ohne Protokoll und „www.“ (aus BASE_URL, nicht hartkodiert)
const WEBSITE = BASE_URL.replace(/^https?:\/\//, "").replace(/^www\./, "");

const LEER = {
  name: false,
  logo: false,
  zitat: false,
  zitat_text: "",
  zitat_person_funktion: "",
  fotos_anlage: false,
  plakette: false,
  livedaten: false,
  messwerte: false,
  vertretungsbefugnis_bestaetigt: false,
};

const PUNKTE = [
  { name: "name", icon: Type, titel: "Firmenname nennen", text: "Ihr Firmenwortlaut erscheint auf der Projektseite, in der Projektliste und in den Vorschaubildern. Ohne diese Freigabe beschreiben wir das Projekt nur mit Branche und Ort." },
  { name: "logo", icon: ImageIcon, titel: "Firmenlogo zeigen", text: "Ihr Logo neben dem Kundenporträt. Die Logodatei erhalten wir von Ihnen; wir verändern sie nicht." },
  { name: "zitat", icon: MessageSquareQuote, titel: "Zitat veröffentlichen", text: "Ein bis zwei Sätze in Ihren Worten, mit Name und Funktion der zitierten Person." },
  { name: "fotos_anlage", icon: Camera, titel: "Fotos der Anlage", text: "Aufnahmen von Anlage und Gebäude, die wir bei der Errichtung gemacht haben – nur Anlage und Gebäude, ohne erkennbare Personen." },
  { name: "plakette", icon: BadgeCheck, titel: "Projekt-Plakette", text: "Eine sachliche Plakette „Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH · Jahr · kWp“, die Sie auf Ihrer eigenen Website einbinden können. Kein Siegel, keine Bewertung." },
  { name: "livedaten", icon: Radio, titel: "Live-Daten der Anlage", text: "Aktuelle Leistung und Tagesertrag aus dem Monitoring auf der Projektseite (sobald wir diese Funktion anbieten)." },
  { name: "messwerte", icon: FileBarChart2, titel: "Messwerte (Jahresertrag)", text: "Der gemessene Jahresertrag Ihrer Anlage statt eines Richtwerts – etwa für Plakette, ESG-Kurzbericht und CO₂-Angaben mit Zeitraum und Rechenweg." },
];

function pruefe(w) {
  const f = {};
  if (!w.vertretungsbefugnis_bestaetigt) f.vertretungsbefugnis_bestaetigt = "Bitte bestätigen Sie, dass Sie diese Erklärung für das Unternehmen abgeben dürfen.";
  if (w.zitat && String(w.zitat_text || "").trim().length < 10) f.zitat_text = "Bitte tragen Sie den Wortlaut des Zitats ein (mindestens 10 Zeichen) oder nehmen Sie das Häkchen heraus.";
  if (w.zitat && !String(w.zitat_person_funktion || "").trim()) f.zitat_person_funktion = "Bitte Name und Funktion der zitierten Person angeben.";
  return f;
}

function Schalter({ name, icon: Icon, titel, text, wert, setze, children }) {
  const fid = `${ID}-${name}`;
  return (
    <li className={`rounded-3xl p-4 ring-1 transition-colors md:p-5 ${wert ? "bg-ov-50 ring-ov-300" : "bg-white ring-ink-200/70"}`}>
      <label htmlFor={fid} className="flex cursor-pointer items-start gap-4">
        <input
          id={fid}
          type="checkbox"
          name={name}
          checked={wert}
          onChange={(e) => setze(name, e.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600"
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-2 font-display text-[16.5px] font-bold text-ink-900">
            <Icon aria-hidden="true" className="mt-[3px] h-[18px] w-[18px] shrink-0 text-ov-700" />
            <span className="min-w-0">{titel}</span>
          </span>
          <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-600">{text}</span>
        </span>
      </label>
      {children}
    </li>
  );
}

export default function FreigabeFormular({ token, modus = "freigabe", daten = null, textVersion = "", test = false }) {
  const { werte, setze, fehler, setFehler } = useFormular(LEER);
  const [status, setStatus] = useState("bereit");
  const [meldung, setMeldung] = useState("");
  const formRef = useRef(null);
  const p = { id: ID, setze };

  const absenden = async (e) => {
    e.preventDefault();
    const f = pruefe(werte);
    if (Object.keys(f).length) {
      setFehler(f);
      fokusErsterFehler(formRef.current, f, ["zitat_text", "zitat_person_funktion", "vertretungsbefugnis_bestaetigt"]);
      return;
    }
    setStatus("sendet");
    setMeldung("");
    try {
      await sende("/api/referenz-freigabe", { token, aktion: "speichern", auswahl: werte, text_version: textVersion });
      setStatus("erfolg");
    } catch (err) {
      if (err.felder) setFehler(err.felder);
      setMeldung(err.message);
      setStatus("fehler");
    }
  };

  const widerrufen = async () => {
    setStatus("sendet");
    setMeldung("");
    try {
      await sende("/api/referenz-freigabe", { token, aktion: "widerrufen" });
      setStatus("erfolg");
    } catch (err) {
      setMeldung(err.message);
      setStatus("fehler");
    }
  };

  const testHinweis = test && (
    <p role="status" className="mb-6 rounded-2xl bg-sun-50 px-4 py-3 text-[13.5px] font-semibold text-ink-800 ring-1 ring-sun-300">
      Testansicht mit Beispieldaten – es wird nichts gespeichert.
    </p>
  );

  if (modus === "widerruf") {
    if (status === "erfolg") {
      return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-10">
          <Erfolg titel="Ihre Freigabe ist widerrufen." text="Wir entfernen die betroffenen Inhalte innerhalb weniger Werktage von unserer Website. Vielen Dank für Ihre Rückmeldung." />
        </div>
      );
    }
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          widerrufen();
        }}
        className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-10"
      >
        {testHinweis}
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700">
          <Undo2 aria-hidden="true" className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-[26px] font-extrabold tracking-tight text-ink-900">Referenz-Freigabe widerrufen</h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
          Mit einem Klick auf den Knopf widerrufen Sie Ihre gesamte Freigabe (Firmenname, Logo, Zitat, Fotos, Plakette, Live-Daten, Messwerte). Wir nehmen die Inhalte dann von unserer Website. Das Öffnen dieser Seite allein ändert nichts.
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">
          Möchten Sie nur einzelne Inhalte zurücknehmen? Dann schreiben Sie uns kurz an {FIRMA.email} – das genügt.
        </p>
        {status === "fehler" && (
          <div className="mt-6">
            <SendeFehler meldung={meldung} />
          </div>
        )}
        <div className="mt-8">
          <SendenKnopf sendet={status === "sendet"} className="bg-ink-900 hover:bg-ink-800">
            Freigabe jetzt widerrufen
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </SendenKnopf>
        </div>
      </form>
    );
  }

  if (status === "erfolg") {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-10">
        <Erfolg
          titel="Vielen Dank – Ihre Freigabe ist bei uns."
          text="Sie erhalten eine Bestätigung per E-Mail mit einer Kopie Ihrer Erklärung und einem Widerrufslink. Wir setzen nur um, was Sie angekreuzt haben."
          schritte={[
            ["Bestätigung", "mit Kopie der Erklärung und Widerrufslink per E-Mail."],
            ["Umsetzung", "der freigegebenen Inhalte auf der Projektseite innerhalb weniger Werktage."],
            ["Widerruf", "jederzeit über den Link oder formlos per E-Mail."],
          ]}
        />
      </div>
    );
  }

  const d = daten || {};
  const pr = d.projekt || {};
  const projektText = [pr.titel, pr.ort, pr.jahr, pr.kwp ? `${pr.kwp.toLocaleString("de-AT")} kWp` : ""].filter(Boolean).join(" · ");

  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-10">
      {testHinweis}
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Referenz-Freigabe</p>
      <h1 className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] font-extrabold leading-tight tracking-tight text-ink-900">
        Was dürfen wir über Ihr Projekt zeigen, {d.kunde_firma || "liebe Kundin, lieber Kunde"}?
      </h1>
      <p className="mt-4 text-[15.5px] leading-relaxed text-ink-600">
        Guten Tag{d.ansprechperson ? ` ${d.ansprechperson}` : ""}
        {d.funktion ? ` (${d.funktion})` : ""}. Wir stellen Ihre Photovoltaikanlage auf {WEBSITE} als Referenzprojekt vor
        {projektText ? <> – <strong className="text-ink-800">{projektText}</strong></> : ""}. Bitte entscheiden Sie für jeden Punkt einzeln. Nichts ist vorausgewählt; ohne Häkchen zeigen wir den jeweiligen Inhalt nicht.
      </p>

      <ul className="mt-8 space-y-3">
        {PUNKTE.map((pt) => (
          <Schalter key={pt.name} {...pt} wert={werte[pt.name]} setze={setze}>
            {pt.name === "zitat" && werte.zitat && (
              <div className="mt-4 grid gap-4 border-t border-ov-200 pt-4">
                <Feld
                  {...p}
                  name="zitat_text"
                  label="Wortlaut des Zitats"
                  art="textarea"
                  wert={werte.zitat_text}
                  fehler={fehler.zitat_text}
                  pflicht
                  placeholder="z. B. „Die Anlage deckt tagsüber den Großteil unseres Strombedarfs – die Zusammenarbeit war unkompliziert.“"
                />
                <Feld {...p} name="zitat_person_funktion" label="Zitierte Person und Funktion" wert={werte.zitat_person_funktion} fehler={fehler.zitat_person_funktion} pflicht placeholder="z. B. Maria Muster, Geschäftsführung" />
              </div>
            )}
          </Schalter>
        ))}
      </ul>

      <div className="mt-8 space-y-3 rounded-3xl bg-sand-50 p-5 text-[14px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60 md:p-6">
        <p>
          <strong className="text-ink-900">Personen auf Fotos:</strong> Fotos mit erkennbaren Personen veröffentlichen wir nur mit deren eigener Einwilligung. Diese Freigabe bezieht sich ausschließlich auf Anlage und Gebäude.
        </p>
        <p>
          <strong className="text-ink-900">Laufzeit und Widerruf:</strong> Die Freigabe gilt, solange das Projekt auf {WEBSITE} als Referenz veröffentlicht ist. Sie können sie jederzeit ganz oder teilweise widerrufen – über den Link in der Bestätigungsmail oder formlos an {FIRMA.email}. Wir entfernen die Inhalte dann innerhalb weniger Werktage; bereits gedruckte oder von Dritten geteilte Inhalte können wir nicht zurückholen.
        </p>
        <p>
          <strong className="text-ink-900">Keine Gegenleistung:</strong> Die Freigabe ist freiwillig. Es gibt dafür keine Vergütung, keinen Rabatt und keine sonstige Gegenleistung; sie hat keinen Einfluss auf Ihren Auftrag oder Service.
        </p>
        <p>
          <strong className="text-ink-900">Datenschutz:</strong> Name und Funktion der Ansprechperson sowie – bei einem Zitat – der zitierten Person verarbeiten wir nur zu diesem Zweck (Art. 6 Abs. 1 lit. a DSGVO). Zum Nachweis speichern wir Datum, Textfassung und eine gekürzte IP-Adresse. Mehr in unserer{" "}
          <Link href="/datenschutz" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>

      <div className={`mt-6 rounded-3xl p-5 ring-1 md:p-6 ${werte.vertretungsbefugnis_bestaetigt ? "bg-ov-50 ring-ov-300" : "bg-white ring-ink-200/70"}`}>
        <label htmlFor={`${ID}-vertretungsbefugnis_bestaetigt`} className="flex cursor-pointer items-start gap-4">
          <input
            id={`${ID}-vertretungsbefugnis_bestaetigt`}
            type="checkbox"
            name="vertretungsbefugnis_bestaetigt"
            checked={werte.vertretungsbefugnis_bestaetigt}
            onChange={(e) => setze("vertretungsbefugnis_bestaetigt", e.target.checked)}
            aria-invalid={fehler.vertretungsbefugnis_bestaetigt ? true : undefined}
            aria-describedby={fehler.vertretungsbefugnis_bestaetigt ? `${ID}-vertretungsbefugnis_bestaetigt-fehler` : undefined}
            className="mt-1 h-6 w-6 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-start gap-2 font-display text-[16.5px] font-bold text-ink-900">
              <ShieldCheck aria-hidden="true" className="mt-[3px] h-[18px] w-[18px] shrink-0 text-ov-700" />
              <span className="min-w-0">
                Ich bin berechtigt, diese Erklärung für das Unternehmen abzugeben.{"\u00a0"}
                <span className="text-ov-700" aria-hidden="true">*</span>
              </span>
            </span>
            <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">Pflichtangabe. Etwa als Geschäftsführung, Prokura oder mit entsprechender Vollmacht.</span>
          </span>
        </label>
        {fehler.vertretungsbefugnis_bestaetigt && <Fehler id={`${ID}-vertretungsbefugnis_bestaetigt-fehler`}>{fehler.vertretungsbefugnis_bestaetigt}</Fehler>}
      </div>

      {status === "fehler" && (
        <div className="mt-6">
          <SendeFehler meldung={meldung} />
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-4 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-ink-500">
          Dieser Link ist einmalig gültig{d.gueltig_bis ? ` (bis ${d.gueltig_bis.split("-").reverse().join(".")})` : ""} · Textfassung {textVersion}
        </p>
        <SendenKnopf sendet={status === "sendet"}>
          Freigabe absenden
          <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </SendenKnopf>
      </div>
    </form>
  );
}
