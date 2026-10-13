// src/components/GewerbeUnikat/K3Anlagengroesse.js
//
// Kapitel 03 · „Eigenverbrauch und Anlagengröße: wo die Sonne auf Ihre Schicht trifft“ (Anker #eigenverbrauch).
// SERVER-Hülle: Kopf, Instrument im Startzustand (K3Ansicht als SSR-Platzhalter in gleicher Höhe),
// figcaption mit Quellen, Wissensschublade mit Tabelle „Anlagengröße → Eigenverbrauch“ und Ausgang.
// Die Bühne (K3SonneSchicht: Knick-Kurve mit Wochenstreifen, Tagesbänder, E-Flotte, Marktwert) lädt
// K3Insel erst in Bildschirmnähe nach.
//
// Zahlen: beispielServer() (synthetischer Beispielbetrieb, Linz, Ost-West, Modell), k3Start() (K3Server.js:
// vollständige Knick-Kurve, Juniwoche, Betriebsurlaubstag, Anteil des Überschusses an Ruhetagen – dieselben
// Funktionen wie im Worker) und BEISPIEL_ERGEBNIS (Rechenbeispiel 14,64 ct). Marktwerte aus src/data/oemag.js
// (E-Control, OeMAG, EAG-Abwicklungsstelle), E-Flotte aus KLASSEN.transporter (src/lib/rechner/eflotte.js).

import Link from "next/link";
import { DatenTabelle, KapitelBuehne, KapitelKopf, QuellePille, Wissensschublade } from "./_bausteine";
import { KENNZEICHNUNG, STAND, zahl } from "./_tokens";
import { BEISPIEL_ERGEBNIS } from "./_beispiel";
import { beispielServer } from "./_server";
import { k3Start } from "./K3Server";
import { FLOTTE_STAND, KLASSEN } from "@/lib/rechner/eflotte";
import { GRUNDLAGE_TEXT, MARKTPRAEMIE, OEMAG_MONATE, OEMAG_REGELN, QUELLEN as MARKT_QUELLEN, REFERENZMARKTWERT_PV, AUSGLEICHSENERGIE_PV } from "@/data/oemag";
import { REGIONEN } from "@/data/regionen";
import { PVGIS_QUELLE } from "@/lib/lastgang/pv";
import K3Insel from "./K3Insel";
import K3Ansicht, { monatText } from "./K3Ansicht";
import K3Ausgang from "./K3Ausgang";
import K3Bildtext from "./K3Bildtext";
import { FLOTTE_MAX, MIN_KWP, MODELLHALLE_KWP, RECHENBEISPIEL_KWP, LADEN, bandAusStart, bandYMax, sprungmarken, startWerte, tagKurz, wocheYMax } from "./K3Modell";

/** Quellen-Pillen: mobil eine waagrechte Zeile, ab md umbrechend. */
const PILLE = "shrink-0 whitespace-nowrap md:shrink md:whitespace-normal";
const AUSRICHTUNG_TEXT = { ostwest: "Ost-West", sued: "Süd", flach: "Flachdach Süd" };

/** Monatsmarkt- und Weichen-Daten (serialisierbar, für SSR und Bühne). */
function marktDaten() {
  const monate = REFERENZMARKTWERT_PV.slice(-24).map(({ monat, ct }) => ({ monat, ct }));
  const om = OEMAG_MONATE[OEMAG_MONATE.length - 1];
  const mp = MARKTPRAEMIE;
  return {
    monate,
    eigenCt: BEISPIEL_ERGEBNIS.vermiedenCt,
    wege: [
      {
        id: "oemag",
        titel: "OeMAG-Marktpreis",
        wert: `${zahl(om.ct, 2)} ct/kWh`,
        text: `Abnahme zum Monatsmarktpreis für Anlagen unter ${zahl(OEMAG_REGELN.grenzeKwp)} kW Engpassleistung, Vertrag bis ${OEMAG_REGELN.vertragBis}.`,
        stand: `${monatText(om.monat)} (${GRUNDLAGE_TEXT[om.grundlage]}) · OeMAG, abgerufen ${MARKT_QUELLEN.oemag.abgerufen}`,
        kurz: `nur unter ${zahl(OEMAG_REGELN.grenzeKwp)} kW Engpassleistung`,
        standKurz: `${monatText(om.monat)} · OeMAG`,
        href: "/einspeisung-gewerbe",
        linkText: "Alle Monatswerte",
        grenzeKwp: OEMAG_REGELN.grenzeKwp,
      },
      {
        id: "marktpraemie",
        titel: "EAG-Marktprämie",
        wert: `bis ${zahl(mp.hoechstpreis2026Ct, 2)} ct/kWh`,
        text: `Ausschreibung für neue Anlagen über ${zahl(mp.mindestKwp)} kWp, ${mp.jahre} Jahre; nicht mit dem Investitionszuschuss kombinierbar.`,
        stand: `Höchstpreis 2026 · EAG-Abwicklungsstelle, Stand ${mp.zweiteAusschreibung.zuschlag}`,
        kurz: `Ausschreibung, über ${zahl(mp.mindestKwp)} kWp, ${mp.jahre} Jahre`,
        standKurz: "Höchstpreis 2026",
        href: "/forderungen/bundesfoerderung",
        linkText: "Förderwege",
      },
      {
        id: "energiegemeinschaft",
        titel: "Energiegemeinschaft",
        wert: "frei vereinbart",
        text: "Verkauf an Mitglieder im Nahbereich; deren Netz-Arbeitspreis sinkt für zugeordneten EEG-Strom (lokal −57 %).",
        stand: "Stand 2026 · ab 2027 neue Netzentgeltverordnung",
        kurz: "Verkauf an Mitglieder im Nahbereich",
        standKurz: "Stand 2026",
        href: "/energiegemeinschaften",
        linkText: "Modelle vergleichen",
      },
      {
        id: "ppa",
        titel: "Händler oder PPA",
        wert: "nach Vertrag",
        text: "Händler oder Liefervertrag mit einem Abnehmer – fix oder am Spotpreis; Voraussetzung für die Marktprämie.",
        stand: "Orientierung · Konditionen je Vertrag",
        kurz: "Direktvermarktung, fix oder am Spotpreis",
        standKurz: "Orientierung",
        href: "/service/direktvermarktung",
        linkText: "Direktvermarktung",
      },
    ],
  };
}

/**
 * Startzustand des Instruments (identisch für SSR-Platzhalter und Bühne vor dem Worker): dieselbe
 * 60-Punkte-Kurve wie im Worker, die Juniwoche (Wochenstreifen; Werktag und Samstag verweisen per
 * `wocheTag` darauf) und der Betriebsurlaubstag.
 */
function startDaten(k3) {
  const w = k3.woche;
  const wocheTag = (t) => (w ? w.tage.findIndex((x) => x.t === t) : -1);
  const juni = Date.UTC(2025, 5, 18);
  const samstag = Date.UTC(2025, 5, 21);
  return {
    empfKwp: k3.empfKwp,
    xMax: k3.xMax,
    punkte: k3.punkte,
    ertragMwhJeKwp: k3.ertragMwhJeKwp,
    ruheEmp: k3.ruheEmp,
    woche: w,
    baender: [
      { id: "juni", titel: "Werktag im Juni", datum: tagKurz(juni), wocheTag: wocheTag(juni) },
      { id: "samstag", titel: "Samstag im Juni", datum: tagKurz(samstag), wocheTag: wocheTag(samstag) },
      { id: "urlaub", titel: "Betriebsurlaub im August", datum: k3.urlaub?.datum ?? tagKurz(Date.UTC(2025, 7, 6)), L: k3.urlaub?.L ?? null, P1: k3.urlaub?.P1 ?? null },
    ],
    ortId: k3.ortId,
    ausrichtung: k3.ausrichtung,
  };
}

export default function K3Anlagengroesse() {
  const bs = beispielServer();
  const k = bs.kennzahlen;
  const k3 = k3Start();
  const start = startDaten(k3);
  const markt = marktDaten();
  const tr = KLASSEN.transporter;
  const flotteAnnahme = { km: tr.km, kwh100: tr.kwh };
  const ortNamen = Object.fromEntries(Object.entries(REGIONEN).map(([id, r]) => [id, r.name]));
  const ortLabel = `${ortNamen[start.ortId] || start.ortId} · ${AUSRICHTUNG_TEXT[start.ausrichtung] || ""}`;

  // Startbild
  const kwp = start.empfKwp;
  const max = Math.max(MIN_KWP + 10, Math.floor(Math.min(start.xMax, MODELLHALLE_KWP) / 5) * 5);
  const werte = startWerte(start, kwp);
  const baender = start.baender.map((b) => bandAusStart(b, kwp, start.woche));
  const ansicht = {
    modus: "ssr",
    mobil: null,
    stufeMarkt: null,
    idBasis: "k3ssr",
    quelle: "beispiel",
    ortLabel,
    rechnet: false,
    punkte: start.punkte,
    xMax: start.xMax,
    min: MIN_KWP,
    max,
    kwp,
    empfKwp: start.empfKwp,
    empfLabel: "Empfehlung",
    rbKwp: RECHENBEISPIEL_KWP,
    dachKwp: MODELLHALLE_KWP,
    dachAusK2: false,
    werte,
    knick: false,
    marken: sprungmarken(start.empfKwp, max, MODELLHALLE_KWP),
    woche: start.woche
      ? { woche: start.woche, yMax: wocheYMax(start.woche, max), jahr: { mwh: werte.ueberschussMwh, anteil: werte.ruhe, maxMwh: startWerte(start, max).ueberschussMwh } }
      : null,
    baender,
    tagAktiv: 0,
    yMax: bandYMax(baender),
    flotte: { n: 0, max: FLOTTE_MAX, annahme: flotteAnnahme, bedarfTag: null },
    markt,
    monat: null,
    monatZeiger: null,
  };

  // Zahlen für Text und Tabelle
  const g = (kwpWert) => bs.groessen.find((x) => x.kwp === kwpWert);
  const gEmp = g(kwp) || bs.groessen[2];
  const gRb = g(RECHENBEISPIEL_KWP);
  const gGross = bs.groessen[bs.groessen.length - 1];
  const g400 = g(400);
  const grenz400bis600 = g400 && gGross ? (gGross.eigenKwh - g400.eigenKwh) / (gGross.erzeugtKwh - g400.erzeugtKwh) : null;
  // Anteil des Überschusses an Ruhetagen – dieselbe Regel wie die Bühne (K3Modell.vorbereiten)
  const ruhe = Math.round(k3.ruheEmp * 100);
  const ruheGross = k3.ruheBei?.[gGross.kwp];
  const letzterRmw = markt.monate[markt.monate.length - 1];
  const apr = markt.monate.find((x) => x.monat === "2026-04");
  const jan = markt.monate.find((x) => x.monat === "2026-01");
  const zeilen = bs.groessen.map((x) => ({
    kwp: `${zahl(x.kwp)} kWp`,
    ev: `${zahl(x.evQuote * 100)} %`,
    aut: `${zahl(x.autarkie * 100)} %`,
    erz: `${zahl(x.erzeugtKwh / 1000)} MWh`,
    ein: `${zahl(x.einspeisungKwh / 1000)} MWh`,
    ruhe: Number.isFinite(k3.ruheBei?.[x.kwp]) ? `${zahl(k3.ruheBei[x.kwp] * 100)} %` : "–",
  }));
  const h3 = "mt-7 font-display text-[16px] font-bold text-white first:mt-0";
  const link = "font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-2 hover:decoration-ov-300";

  return (
    <KapitelBuehne id="k3" anker="eigenverbrauch" ton="dunkel" className="max-md:py-10">
      <KapitelKopf
        dunkel
        form="zitat"
        nummer="03"
        frage="Geschäftsführung fragt: Wie groß soll die Anlage sein – und was bringt mehr?"
        titel="Eigenverbrauch und Anlagengröße: wo die Sonne auf Ihre Schicht trifft"
        lead="Die sinnvolle Größe bestimmt der Lastgang, nicht die Dachfläche – hier sehen Sie, wo der Eigenverbrauch abknickt."
      />

      <figure className="mt-6 md:mt-14">
        <K3Insel platzhalter={<K3Ansicht {...ansicht} />} start={start} markt={markt} flotteAnnahme={flotteAnnahme} ortNamen={ortNamen} />
        <figcaption className="mt-5 max-w-[75ch] text-[12.5px] leading-relaxed text-white/70 md:mt-8 md:text-[13.5px]">
          <K3Bildtext ortNamen={ortNamen}>
            Synthetischer Beispielbetrieb ({zahl(k.jahresverbrauch / 1000)} MWh im Jahr, zwei Schichten, {ortLabel}): Bei {zahl(kwp)} kWp nutzt er {zahl(gEmp.evQuote * 100)} % des
            Solarstroms selbst und deckt {zahl(gEmp.autarkie * 100)} % seines Verbrauchs<span className="hidden sm:inline">
              ; schon bei {zahl(kwp)} kWp entsteht der Überschuss zu {ruhe} % an Wochenenden, Feiertagen und im Betriebsurlaub
            </span>
            .<span className="hidden sm:inline">
              {" "}
              Bei {zahl(gGross.kwp)} kWp sinkt der Eigenverbrauch auf {zahl(gGross.evQuote * 100)} %.
            </span>
          </K3Bildtext>
          <span role="group" aria-label="Quellen" className="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            <QuellePille dunkel className={PILLE}>
              PV:{" "}
              <a href={PVGIS_QUELLE.url} className="underline decoration-white/30 underline-offset-2 hover:decoration-white/70" target="_blank" rel="noopener noreferrer">
                {PVGIS_QUELLE.name}
              </a>{" "}
              · {KENNZEICHNUNG.richtwert}
            </QuellePille>
            <QuellePille dunkel className={PILLE}>
              Referenzmarktwert PV:{" "}
              <a href={MARKT_QUELLEN.ecRmw.url} className="underline decoration-white/30 underline-offset-2 hover:decoration-white/70" target="_blank" rel="noopener noreferrer">
                E-Control
              </a>
              , bis {monatText(letzterRmw.monat)} · abgerufen {MARKT_QUELLEN.ecRmw.abgerufen} · {KENNZEICHNUNG.richtwert}
            </QuellePille>
            <QuellePille dunkel className={PILLE}>
              Selbst genutzte kWh {zahl(markt.eigenCt, 2)} ct: Rechenbeispiel NE 6 Oberösterreich · {STAND.werte} · {KENNZEICHNUNG.richtwert}
            </QuellePille>
            <QuellePille dunkel className={PILLE}>E-Flotte: Annahmen wie E-Flotten-Rechner · Stand {FLOTTE_STAND}</QuellePille>
          </span>
        </figcaption>
      </figure>

      <Wissensschublade dunkel className="mt-6 md:mt-10" titel="Eigenverbrauch, Autarkie und Überschuss – Begriffe und Regeln">
        <div className="max-w-[70ch]">
          <h3 className={h3}>Eigenverbrauchsquote und Autarkie: gleicher Zähler, anderer Nenner</h3>
          <p className="mt-2">
            Beide Kennzahlen zählen den Solarstrom, den der Betrieb im selben Augenblick selbst verbraucht. Die <strong className="text-white">Eigenverbrauchsquote</strong> teilt ihn durch
            die Erzeugung der Anlage: Wie viel vom Solarstrom nutzt der Betrieb selbst? Die <strong className="text-white">Autarkie</strong> teilt ihn durch den gesamten Verbrauch: Wie viel
            des Strombedarfs deckt die Sonne? Wird die Anlage größer, sinkt die Quote und die Autarkie steigt – die Knick-Kurve zeigt beide über der Anlagengröße. Der{" "}
            <strong className="text-white">Grenz-Eigenverbrauch</strong> (gestrichelte Linie) sagt, wie viel von jeder zusätzlichen Kilowattstunde noch im Betrieb bleibt.
          </p>
          <DatenTabelle
            dunkel
            className="mt-5"
            caption="Anlagengröße und Eigenverbrauch im Beispielbetrieb (Linz, Ost-West, Modell)"
            spalten={[
              { key: "kwp", label: "Anlage" },
              { key: "ev", label: "Eigenverbrauch", rechts: true },
              { key: "aut", label: "Autarkie", rechts: true },
              { key: "erz", label: "Erzeugung", rechts: true },
              { key: "ein", label: "Einspeisung", rechts: true },
              { key: "ruhe", label: "Überschuss an Ruhetagen", rechts: true },
            ]}
            zeilen={zeilen}
          />
          <p className="mt-2 text-[13px] text-white/60">
            Ruhetage: Wochenenden, Feiertage und Betriebsurlaub. {KENNZEICHNUNG.synthetisch}. {KENNZEICHNUNG.pvModell}. Jahreswerte, {KENNZEICHNUNG.richtwert}.
          </p>

          <h3 className={h3}>Warum die Empfehlung bei 80 % Eigenverbrauch liegt</h3>
          <p className="mt-2">
            Die Empfehlung ist die größte Anlage, die noch mindestens 80 % ihres Stroms im Betrieb verbraucht – dieselbe Regel wie in der{" "}
            <Link href="/lastgang-analyse" className={link}>
              Lastgang-Analyse
            </Link>
            . Im Beispielbetrieb sind das {zahl(kwp)} kWp. Darüber wächst vor allem der Überschuss
            {grenz400bis600 != null && (
              <>
                : Zwischen {zahl(g400.kwp)} und {zahl(gGross.kwp)} kWp bleibt von jeder zusätzlichen Kilowattstunde nur noch rund {zahl(grenz400bis600 * 100)} % im Betrieb
              </>
            )}
            . Doppelte Anlage heißt deshalb nicht doppelte Ersparnis: Bei {zahl(gGross.kwp)} kWp sinkt der Eigenverbrauch auf {zahl(gGross.evQuote * 100)} %, und schon bei {zahl(kwp)} kWp
            entstehen {ruhe} % des Überschusses an Wochenenden, Feiertagen und im Betriebsurlaub
            {Number.isFinite(ruheGross) && (
              <>
                , bei {zahl(gGross.kwp)} kWp nur noch {zahl(ruheGross * 100)} % – dann bleibt auch werktags Sonne übrig
              </>
            )}
            . Ob sich eine größere Anlage trotzdem rechnet, entscheiden der Erlös für den Überschuss und
            ob sich Verbraucher – eine E-Flotte, Wärmepumpen, ein Speicher – in die Mittagsstunden legen lassen.
          </p>

          <h3 className={h3}>Rechenbeispiel und Stundenmodell – zwei offene Sichten</h3>
          <p className="mt-2">
            Das Rechenbeispiel rechnet vorsichtig mit 70 % Eigenverbrauch bei 300 kWp, das Stundenmodell des synthetischen Lastgangs ergibt {gRb ? zahl(gRb.evQuote * 100) : "79"} %. Das
            Rechenbeispiel (
            <a href="#wirtschaftlichkeit" className={link}>
              Kapitel 07
            </a>
            ) gilt für einen Standort im Innviertel mit 1.050 kWh/kWp und lässt Raum für Betriebe mit weniger Tagesverbrauch; das Stundenmodell rechnet Viertelstunde für Viertelstunde mit dem
            Beispielbetrieb in Linz (Ost-West, {zahl(k.pv?.jahresErtrag || 942)} kWh/kWp). Mit Ihrem Lastgang ersetzt die Auslegung beide Annahmen.
          </p>

          <h3 className={h3}>Was Überschuss wert ist: OeMAG, Marktprämie, Energiegemeinschaft, PPA</h3>
          <p className="mt-2">
            Sommerlicher Mittagsstrom ist am Markt wenig wert – selbst genutzt ist er am meisten wert. Der Referenzmarktwert Photovoltaik der E-Control (§ 13 EAG) ist der mit der
            österreichweiten PV-Einspeisung gewichtete Day-Ahead-Marktwert eines Monats: im {apr ? `April 2026 ${zahl(apr.ct, 2)} ct/kWh` : "Frühjahr wenige Cent"}, im{" "}
            {jan ? `Jänner 2026 ${zahl(jan.ct, 2)} ct/kWh` : "Winter deutlich mehr"}. Eine selbst genutzte Kilowattstunde spart im Rechenbeispiel {zahl(markt.eigenCt, 2)} ct – Energie,
            Netznutzung, Netzverlust und Elektrizitätsabgabe.
          </p>
          <p className="mt-3">
            <strong className="text-white">OeMAG:</strong> Für Anlagen unter {zahl(OEMAG_REGELN.grenzeKwp)} kW Engpassleistung nimmt die OeMAG Überschuss zum Marktpreis ab (§ 13 ÖSG 2012).
            Der Monatswert ist das mengengewichtete Day-Ahead-Mittel, begrenzt auf 60 bis 100 % des Quartalsmarktpreises der E-Control, seit 2026 abzüglich{" "}
            {zahl(AUSGLEICHSENERGIE_PV[2026], 3)} ct/kWh Ausgleichsenergie. Vertrag bis {OEMAG_REGELN.vertragBis}, Kündigung {OEMAG_REGELN.kuendigung}. Ausgenommen sind{" "}
            {OEMAG_REGELN.ausnahmen.join(", ")}.
          </p>
          <p className="mt-3">
            <strong className="text-white">EAG-Marktprämie:</strong> Neue oder erweiterte Anlagen über {zahl(MARKTPRAEMIE.mindestKwp)} kWp bewerben sich in einer Ausschreibung; die Prämie
            gleicht die Differenz zwischen Zuschlagswert und Referenzmarktwert aus, in der Regel {MARKTPRAEMIE.jahre} Jahre. Höchstpreis 2026: {zahl(MARKTPRAEMIE.hoechstpreis2026Ct, 2)}{" "}
            ct/kWh je Gebotstermin ({MARKTPRAEMIE.gebotstermine2026.join(", ")}). Marktprämie und Investitionszuschuss schließen einander für dieselbe Anlage aus.
          </p>
          <p className="mt-3">
            <strong className="text-white">Energiegemeinschaft und PPA:</strong> In einer{" "}
            <Link href="/energiegemeinschaften" className={link}>
              Energiegemeinschaft
            </Link>{" "}
            verkauft der Betrieb Überschuss an Mitglieder im Nahbereich zu einem frei vereinbarten Preis. Über einen Stromhändler oder einen Liefervertrag mit einem Abnehmer (PPA) wird der
            Überschuss{" "}
            <Link href="/service/direktvermarktung" className={link}>
              direkt vermarktet
            </Link>
            . Alle Monatswerte der OeMAG stehen unter{" "}
            <Link href="/einspeisung-gewerbe" className={link}>
              Einspeisung für Gewerbe
            </Link>
            .
          </p>

          <h3 className={h3}>E-Flotte im Modell</h3>
          <p className="mt-2">
            Annahme wie im{" "}
            <Link href="/rechner/e-flotte" className={link}>
              E-Flotten-Rechner
            </Link>
            : {zahl(tr.km)} km im Jahr und {zahl(tr.kwh)} kWh je 100 km, also {zahl((tr.km * tr.kwh) / 100)} kWh je Transporter. Geladen wird mit {zahl(LADEN.kw)} kW AC ab{" "}
            {String(LADEN.abStunde).padStart(2, "0")}:00 an Arbeitstagen (Montag bis Freitag ohne Feiertage und Betriebsurlaub), bis der Tagesbedarf gedeckt ist – ohne Lademanagement nach
            Sonnenüberschuss. Eine E-Flotte, die mittags lädt, macht aus Überschuss Eigenverbrauch; wie viel, hängt davon ab, ob werktags mittags überhaupt Überschuss entsteht. Ladepunkte
            und Lastmanagement plant die Seite{" "}
            <Link href="/ladeinfrastruktur" className={link}>
              Ladeinfrastruktur
            </Link>
            .
          </p>
          <p className="mt-4 text-[13px] text-white/60">
            {KENNZEICHNUNG.beispiel}. {KENNZEICHNUNG.keineBeratung}. Keine Ertragszusage – Erträge schwanken mit Wetter, Verschattung und Betrieb.
          </p>
        </div>
      </Wissensschublade>

      <K3Ausgang startKwp={kwp} />
    </KapitelBuehne>
  );
}
