"use client";

// src/components/Award/AwardEinreichung.js
//
// Einreichungsformular für den Ökovolt PV Award → /api/award.
// Mehrstufig: 1 Kategorie · 2 Projekt · 3 Kennzahlen · 4 Kontakt & Einwilligung.
// Jeder Schritt wird vor dem Weitergehen geprüft; gesendet wird dieselbe
// Nutzlast wie bisher (Feldnamen unverändert, Server-Validierung in /api/award).
// Nur für Kundinnen und Kunden von Ökovolt; Einwilligung zur Veröffentlichung
// ist Teilnahmevoraussetzung.

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, ClipboardList, LayoutGrid, UserRound } from "lucide-react";
import {
  DatenschutzText,
  EMAIL_RE,
  Erfolg,
  Feld,
  Fehler,
  Haken,
  Honeypot,
  SendeFehler,
  SendenKnopf,
  fokusErsterFehler,
  sende,
  telefonOk,
  urlOk,
  useFormular,
} from "@/components/Partner/Formularteile";
import { BUNDESLAENDER } from "@/components/Partner/partnerDaten";
import { iconFor } from "@/components/ui/icons";
import { AWARD_NAME, KATEGORIEN } from "./awardDaten";

const ID = "award";

const LEER = {
  kategorie: "",
  projektname: "",
  betreiber: "",
  plz: "",
  ort: "",
  bundesland: "",
  inbetriebnahme: "",
  leistung: "",
  speicher: "",
  ertrag: "",
  eigenverbrauch: "",
  beschreibung: "",
  fotolink: "",
  projektnummer: "",
  vorname: "",
  nachname: "",
  funktion: "",
  email: "",
  telefon: "",
  kunde: false,
  veroeffentlichung: false,
  monitoring: false,
  datenschutz: false,
};

const SCHRITTE = [
  { titel: "Kategorie", kopf: "In welcher Kategorie tritt Ihre Anlage an?", icon: LayoutGrid, felder: ["kategorie"] },
  { titel: "Projekt", kopf: "Das Projekt", icon: ClipboardList, felder: ["projektname", "betreiber", "plz", "ort", "bundesland", "inbetriebnahme"] },
  { titel: "Kennzahlen", kopf: "Kennzahlen & Geschichte", icon: BarChart3, felder: ["leistung", "speicher", "ertrag", "eigenverbrauch", "beschreibung", "fotolink", "projektnummer"] },
  { titel: "Kontakt", kopf: "Ansprechperson & Einwilligung", icon: UserRound, felder: ["vorname", "nachname", "funktion", "email", "telefon", "kunde", "veroeffentlichung", "monitoring", "datenschutz"] },
];

const zahl = (w) => Number(String(w).replace(",", "."));

function pruefe(w) {
  const f = {};
  const t = (k) => String(w[k] || "").trim();
  if (!t("kategorie")) f.kategorie = "Bitte wählen Sie eine Kategorie.";
  if (!t("projektname")) f.projektname = "Bitte geben Sie dem Projekt einen Namen.";
  if (!t("betreiber")) f.betreiber = "Bitte geben Sie Unternehmen, Betrieb oder Gemeinde an.";
  if (!/^\d{4}$/.test(t("plz"))) f.plz = "Bitte die Postleitzahl des Anlagenstandorts (4 Ziffern) angeben.";
  if (!t("ort")) f.ort = "Bitte den Ort des Anlagenstandorts angeben.";
  if (!t("bundesland")) f.bundesland = "Bitte das Bundesland wählen.";
  if (!/^\d{4}-\d{2}$/.test(t("inbetriebnahme"))) f.inbetriebnahme = "Bitte Monat und Jahr der Inbetriebnahme angeben.";
  if (!(zahl(w.leistung) > 0 && zahl(w.leistung) < 100000)) f.leistung = "Bitte die Leistung in kWp angeben.";
  if (t("speicher") && !(zahl(w.speicher) >= 0)) f.speicher = "Bitte eine Zahl in kWh angeben.";
  if (t("ertrag") && !(zahl(w.ertrag) >= 0)) f.ertrag = "Bitte eine Zahl in kWh angeben.";
  if (t("eigenverbrauch") && !(zahl(w.eigenverbrauch) >= 0 && zahl(w.eigenverbrauch) <= 100)) f.eigenverbrauch = "Bitte einen Wert zwischen 0 und 100 angeben.";
  if (t("beschreibung").length < 80) f.beschreibung = "Bitte beschreiben Sie das Projekt in mindestens 80 Zeichen.";
  if (t("fotolink") && !urlOk(t("fotolink"))) f.fotolink = "Bitte einen vollständigen Link angeben, z. B. https://…";
  if (!t("vorname")) f.vorname = "Bitte den Vornamen angeben.";
  if (!t("nachname")) f.nachname = "Bitte den Nachnamen angeben.";
  if (!EMAIL_RE.test(t("email"))) f.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (!telefonOk(t("telefon"))) f.telefon = "Bitte eine Telefonnummer für Rückfragen angeben.";
  if (!w.kunde) f.kunde = "Der Award steht nur Kundinnen und Kunden von Ökovolt offen.";
  if (!w.veroeffentlichung) f.veroeffentlichung = "Die Einwilligung zur Veröffentlichung ist Teilnahmevoraussetzung.";
  if (!w.datenschutz) f.datenschutz = "Bitte bestätigen Sie die Datenschutzhinweise.";
  return f;
}

export default function AwardEinreichung() {
  const { werte, setze, fehler, setFehler, zuruecksetzen } = useFormular(LEER);
  const [schritt, setSchritt] = useState(0);
  const [richtung, setRichtung] = useState("vor");
  const [status, setStatus] = useState("bereit");
  const [meldung, setMeldung] = useState("");
  const formRef = useRef(null);
  const kopfRef = useRef(null);
  const website = useRef(null);

  const fehlerIn = (idx, alle) => Object.fromEntries(SCHRITTE[idx].felder.filter((k) => alle[k]).map((k) => [k, alle[k]]));

  const geheZu = (idx) => {
    setRichtung(idx > schritt ? "vor" : "zurueck");
    setSchritt(idx);
    requestAnimationFrame(() => {
      kopfRef.current?.focus({ preventScroll: true });
      const top = formRef.current?.getBoundingClientRect().top;
      if (top != null && top < 80) window.scrollBy({ top: top - 110, behavior: "smooth" });
    });
  };

  const weiter = () => {
    const f = fehlerIn(schritt, pruefe(werte));
    setFehler(f);
    if (Object.keys(f).length) {
      fokusErsterFehler(formRef.current, f, SCHRITTE[schritt].felder);
      return;
    }
    geheZu(schritt + 1);
  };

  const absenden = async (e) => {
    e.preventDefault();
    if (schritt < SCHRITTE.length - 1) {
      weiter();
      return;
    }
    const alle = pruefe(werte);
    if (Object.keys(alle).length) {
      setFehler(alle);
      const idx = SCHRITTE.findIndex((s) => s.felder.some((k) => alle[k]));
      if (idx !== schritt) geheZu(idx);
      else fokusErsterFehler(formRef.current, alle, SCHRITTE[idx].felder);
      return;
    }
    setStatus("sendet");
    setMeldung("");
    try {
      await sende("/api/award", { ...werte, quelle: window.location.pathname, website: website.current?.value || "" });
      setStatus("erfolg");
      import("@/lib/konfetti").then((m) => m.konfetti()).catch(() => {});
    } catch (err) {
      if (err.felder) {
        setFehler(err.felder);
        const idx = SCHRITTE.findIndex((s) => s.felder.some((k) => err.felder[k]));
        if (idx >= 0 && idx !== schritt) geheZu(idx);
      }
      setMeldung(err.message);
      setStatus("fehler");
    }
  };

  if (status === "erfolg") {
    return (
      <Erfolg
        titel="Ihr Projekt ist eingereicht!"
        text={`Danke für Ihre Einreichung zum ${AWARD_NAME}. Wir melden uns bei Ihnen, sobald die Vorprüfung abgeschlossen ist.`}
        schritte={[
          ["Vorprüfung", "von Teilnahmeberechtigung und Anlagendaten."],
          ["Rückfragen", "zu Kennzahlen oder Fotos, falls nötig."],
          ["Jury", "bewertet alle nominierten Projekte je Kategorie."],
        ]}
        zurueck={() => {
          zuruecksetzen();
          setSchritt(0);
          setStatus("bereit");
        }}
      />
    );
  }

  const p = { id: ID, setze };
  const aktiv = SCHRITTE[schritt];
  const fortschritt = ((schritt + 1) / SCHRITTE.length) * 100;
  const zeichen = String(werte.beschreibung || "").trim().length;

  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="relative">
      {/* Fortschritt */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 text-[13px] font-semibold">
          <span className="text-ink-500">
            Schritt <span className="ov-num text-ink-900">{schritt + 1}</span> von {SCHRITTE.length}
          </span>
          <span className="ov-num text-sun-500">{Math.round(fortschritt)} %</span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
          <div className="h-full rounded-full bg-gradient-to-r from-sun-300 via-sun-400 to-sun-500 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${fortschritt}%` }} />
        </div>
        <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Schritte der Einreichung">
          {SCHRITTE.map((s, i) => {
            const erledigt = i < schritt;
            const jetzt = i === schritt;
            return (
              <li key={s.titel} aria-current={jetzt ? "step" : undefined}>
                <button
                  type="button"
                  onClick={() => (i < schritt ? geheZu(i) : undefined)}
                  disabled={i > schritt}
                  className={`flex w-full flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 text-center text-[12.5px] font-semibold transition-colors sm:flex-row sm:px-3 sm:text-left ${
                    jetzt ? "bg-navy-950 text-white" : erledigt ? "text-ink-800 hover:bg-sand-100" : "text-ink-400"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      jetzt ? "bg-sun-400 text-navy-950" : erledigt ? "bg-ov-500 text-white" : "bg-white ring-1 ring-ink-200"
                    }`}
                  >
                    {erledigt ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> : <s.icon aria-hidden="true" className="h-4 w-4" />}
                  </span>
                  <span className="truncate">{s.titel}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div key={schritt} className={richtung === "vor" ? "ov-step-vor" : "ov-step-zurueck"}>
        <h3 ref={kopfRef} tabIndex={-1} className="mb-6 font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.6rem)] font-extrabold tracking-tight text-ink-900 outline-none">
          {aktiv.kopf}
        </h3>

        {schritt === 0 && (
          <fieldset className="min-w-0" aria-describedby={fehler.kategorie ? `${ID}-kategorie-fehler` : undefined}>
            <legend className="sr-only">Kategorie</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {KATEGORIEN.map((k, i) => {
                const Icon = iconFor(k.icon);
                const breit = i === KATEGORIEN.length - 1 && KATEGORIEN.length % 2 === 1;
                const an = werte.kategorie === k.titel;
                return (
                  <label
                    key={k.id}
                    className={`group relative flex cursor-pointer items-center gap-4 rounded-3xl p-3.5 pr-10 transition-all focus-within:ring-2 focus-within:ring-sun-400 ${breit ? "sm:col-span-2" : ""} ${
                      an ? "bg-navy-950 text-white shadow-[0_18px_40px_-20px_rgba(3,18,43,0.8)]" : "bg-sand-50 ring-1 ring-ink-200/70 hover:-translate-y-0.5 hover:ring-sun-300"
                    }`}
                  >
                    <input type="radio" name="kategorie" value={k.titel} checked={an} onChange={() => setze("kategorie", k.titel)} className="sr-only" />
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${an ? "bg-sun-400 text-navy-950" : "bg-white text-sun-500 ring-1 ring-sun-300/60"}`}>
                      {Icon && <Icon aria-hidden="true" className="h-5 w-5" />}
                    </span>
                    <span className="min-w-0">
                      <span className={`block font-display text-[15.5px] font-bold leading-snug ${an ? "text-white" : "text-ink-900"}`}>{k.titel}</span>
                      <span className={`mt-0.5 line-clamp-1 text-[12.5px] leading-snug ${an ? "text-white/65" : "text-ink-500"}`}>{k.text}</span>
                    </span>
                    {an && (
                      <span className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-sun-400 text-navy-950">
                        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {fehler.kategorie && <Fehler id={`${ID}-kategorie-fehler`}>{fehler.kategorie}</Fehler>}
            <p className="mt-4 text-[13px] text-ink-500">Die Jury kann ein Projekt in eine passendere Kategorie verschieben.</p>
          </fieldset>
        )}

        {schritt === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Feld {...p} name="projektname" label="Projektname" wert={werte.projektname} fehler={fehler.projektname} pflicht placeholder="z. B. Hallendach Logistikzentrum" />
            <Feld {...p} name="betreiber" label="Unternehmen, Betrieb oder Gemeinde" wert={werte.betreiber} fehler={fehler.betreiber} pflicht autoComplete="organization" />
            <Feld {...p} name="plz" label="PLZ Anlagenstandort" wert={werte.plz} fehler={fehler.plz} pflicht inputMode="numeric" />
            <Feld {...p} name="ort" label="Ort Anlagenstandort" wert={werte.ort} fehler={fehler.ort} pflicht />
            <Feld {...p} name="bundesland" label="Bundesland" art="select" optionen={BUNDESLAENDER} wert={werte.bundesland} fehler={fehler.bundesland} pflicht />
            <Feld {...p} name="inbetriebnahme" label="Inbetriebnahme" type="month" wert={werte.inbetriebnahme} fehler={fehler.inbetriebnahme} pflicht />
          </div>
        )}

        {schritt === 2 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Feld {...p} name="leistung" label="Leistung in kWp" inputMode="decimal" wert={werte.leistung} fehler={fehler.leistung} pflicht placeholder="z. B. 250" />
              <Feld {...p} name="speicher" label="Speicher in kWh" inputMode="decimal" wert={werte.speicher} fehler={fehler.speicher} />
              <Feld {...p} name="ertrag" label="Jahresertrag in kWh" inputMode="decimal" wert={werte.ertrag} fehler={fehler.ertrag} />
              <Feld {...p} name="eigenverbrauch" label="Eigenverbrauchsanteil in %" inputMode="decimal" wert={werte.eigenverbrauch} fehler={fehler.eigenverbrauch} />
            </div>
            <Feld
              {...p}
              name="beschreibung"
              label="Was macht das Projekt besonders?"
              art="textarea"
              hinweis={zeichen >= 80 ? `${zeichen} Zeichen ✓` : `${zeichen} / mind. 80 Zeichen`}
              wert={werte.beschreibung}
              fehler={fehler.beschreibung}
              pflicht
              placeholder="Ziele, Lösung, Ergebnis: z. B. Eigenverbrauch durch Speicher erhöht, Kühlhaus tagsüber mit Solarstrom, Energiegemeinschaft mit Nachbarn …"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Feld {...p} name="fotolink" label="Link zu Fotos oder Unterlagen" type="url" inputMode="url" hinweis="z. B. Cloud-Ordner" wert={werte.fotolink} fehler={fehler.fotolink} placeholder="https://" />
              <Feld {...p} name="projektnummer" label="Ökovolt-Projekt- oder Kundennummer" wert={werte.projektnummer} fehler={fehler.projektnummer} />
            </div>
          </div>
        )}

        {schritt === 3 && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Feld {...p} name="vorname" label="Vorname" wert={werte.vorname} fehler={fehler.vorname} pflicht autoComplete="given-name" />
              <Feld {...p} name="nachname" label="Nachname" wert={werte.nachname} fehler={fehler.nachname} pflicht autoComplete="family-name" />
              <Feld {...p} name="funktion" label="Funktion" wert={werte.funktion} fehler={fehler.funktion} autoComplete="organization-title" />
              <Feld {...p} name="email" label="E-Mail-Adresse" type="email" inputMode="email" wert={werte.email} fehler={fehler.email} pflicht autoComplete="email" />
              <Feld {...p} name="telefon" label="Telefonnummer" type="tel" inputMode="tel" wert={werte.telefon} fehler={fehler.telefon} pflicht autoComplete="tel" />
            </div>
            <div className="space-y-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
              <Haken {...p} name="kunde" wert={werte.kunde} fehler={fehler.kunde}>
                Die Anlage wurde von der Ökovolt Solartechnik GmbH errichtet, erweitert oder wird von ihr betreut, und ich bin berechtigt, sie einzureichen. <span className="text-ov-600" aria-hidden="true">*</span>
              </Haken>
              <Haken {...p} name="veroeffentlichung" wert={werte.veroeffentlichung} fehler={fehler.veroeffentlichung}>
                Ich willige ein, dass Projektname, Betreiber, Standort (Ort), Beschreibung, Fotos und Kennzahlen im Rahmen des {AWARD_NAME} auf oekovolt.com, in sozialen Medien und in Pressemitteilungen veröffentlicht werden. Widerruf bis zur Jurysitzung möglich. <span className="text-ov-600" aria-hidden="true">*</span>
              </Haken>
              <Haken {...p} name="monitoring" wert={werte.monitoring} fehler={fehler.monitoring}>
                Ökovolt darf für die Bewertung Betriebsdaten der Anlage aus Monitoring und Fernwartung heranziehen (optional).
              </Haken>
              <Haken {...p} name="datenschutz" wert={werte.datenschutz} fehler={fehler.datenschutz}>
                <DatenschutzText zweck="zur Durchführung des PV Award (Prüfung, Jurybewertung, Kontaktaufnahme)" />
              </Haken>
            </div>
            {werte.kategorie && (
              <p className="flex flex-wrap items-center gap-2 text-[13.5px] text-ink-600">
                Ihre Einreichung:
                <span className="rounded-full bg-navy-950 px-3 py-1 font-semibold text-white">{werte.kategorie}</span>
                {werte.projektname && <span className="rounded-full bg-sand-100 px-3 py-1 font-semibold text-ink-800">{werte.projektname}</span>}
                {werte.leistung && <span className="rounded-full bg-sand-100 px-3 py-1 font-semibold text-ink-800">{werte.leistung} kWp</span>}
              </p>
            )}
          </div>
        )}
      </div>

      <Honeypot refObj={website} />

      {status === "fehler" && (
        <div className="mt-6">
          <SendeFehler meldung={meldung} />
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {schritt > 0 ? (
          <button
            type="button"
            onClick={() => geheZu(schritt - 1)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Zurück
          </button>
        ) : (
          <span className="text-[13px] text-ink-500">Pflichtfelder sind mit * markiert.</span>
        )}
        {schritt < SCHRITTE.length - 1 ? (
          <button
            type="button"
            onClick={weiter}
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-navy-950 px-8 text-[16px] font-semibold text-white shadow-[0_10px_28px_-12px_rgba(3,18,43,0.8)] transition-all hover:bg-navy-900"
          >
            Weiter: {SCHRITTE[schritt + 1].titel}
            <ArrowRight aria-hidden="true" className="h-5 w-5 text-sun-300 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <SendenKnopf sendet={status === "sendet"}>
            Projekt einreichen
            <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </SendenKnopf>
        )}
      </div>
    </form>
  );
}
