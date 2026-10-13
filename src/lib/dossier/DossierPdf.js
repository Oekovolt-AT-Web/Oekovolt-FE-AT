// Business-Case-Dossier / Investitionsantrag als PDF (serverseitig mit @react-pdf/renderer).
// Varianten: cfo · bank · gemeinderat · investitionsantrag (siehe src/lib/dossier/rechnung.js).
// Dokumenttitel, Sprache de-AT, lineare Lesereihenfolge (Überschrift → Text → Tabelle),
// jede Zahl mit Quelle/Stand und Richtwert-Hinweis, Haftungshinweis auf jeder Seite.
// Schriften: Inter & Manrope (SIL Open Font License), lokal aus src/lib/analyse/fonts.

import path from "node:path";
import React from "react";
import { Document, Font, Image, Line, Page, Rect, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import { FIRMA, BASE_URL } from "../site.js";
import { HAFTUNG, VARIANTEN, euro, prozent, zahl } from "./rechnung.js";

const FONTS = path.join(process.cwd(), "src/lib/analyse/fonts");
Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(FONTS, "inter-latin-400-normal.woff"), fontWeight: 400 },
    { src: path.join(FONTS, "inter-latin-600-normal.woff"), fontWeight: 600 },
    { src: path.join(FONTS, "inter-latin-700-normal.woff"), fontWeight: 700 },
  ],
});
Font.register({
  family: "Manrope",
  fonts: [
    { src: path.join(FONTS, "manrope-latin-700-normal.woff"), fontWeight: 700 },
    { src: path.join(FONTS, "manrope-latin-800-normal.woff"), fontWeight: 800 },
  ],
});
// Keine Silbentrennung. „[wort, ""]“ statt „[wort]“: Mit nur einem Teil zerlegt der Zeilenumbruch
// lange Absätze sonst mitten im Wort (react-pdf, geprüft am 12.10.2026 mit dem CO₂-Textbaustein).
Font.registerHyphenationCallback((wort) => [wort, ""]);

const C = { navy: "#03122b", gruen: "#558227", gruenHell: "#8cc152", sand: "#f7f5ef", ink: "#1b2330", ink6: "#4b5563", ink5: "#6b7280", linie: "#e3e6ea", rot: "#b91c1c", sonne: "#f5b700" };

const s = StyleSheet.create({
  seite: { fontFamily: "Inter", fontSize: 9.5, color: C.ink, paddingTop: 42, paddingBottom: 64, paddingHorizontal: 42, backgroundColor: "#ffffff" },
  fuss: { position: "absolute", bottom: 20, left: 42, right: 42, fontSize: 7, color: C.ink5, borderTopWidth: 0.6, borderTopColor: C.linie, paddingTop: 6 },
  eyebrow: { fontSize: 8, fontWeight: 700, letterSpacing: 1.6, color: C.gruen, textTransform: "uppercase" },
  h1: { fontFamily: "Manrope", fontWeight: 800, fontSize: 26, lineHeight: 1.12, color: "#ffffff" },
  h2: { fontFamily: "Manrope", fontWeight: 800, fontSize: 16, color: C.ink, marginTop: 6, marginBottom: 8 },
  h3: { fontFamily: "Manrope", fontWeight: 700, fontSize: 11, color: C.ink, marginBottom: 5, marginTop: 8 },
  text: { fontSize: 9.5, lineHeight: 1.55, color: C.ink6 },
  klein: { fontSize: 7.5, lineHeight: 1.45, color: C.ink5 },
  karte: { backgroundColor: C.sand, borderRadius: 8, padding: 12, marginBottom: 8 },
  zeile: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 0.6, borderBottomColor: C.linie },
  zeileLabel: { color: C.ink6, flex: 1, paddingRight: 8 },
  zeileWert: { fontWeight: 600, color: C.ink, textAlign: "right", flex: 1 },
  tabKopf: { flexDirection: "row", backgroundColor: C.navy, color: "#ffffff", paddingVertical: 4, paddingHorizontal: 4, fontSize: 7.5, fontWeight: 700 },
  tabZeile: { flexDirection: "row", paddingVertical: 3.5, paddingHorizontal: 4, fontSize: 8, borderBottomWidth: 0.5, borderBottomColor: C.linie },
});

/**
 * Zeichen, die der lokale Inter-/Manrope-Latin-Schnitt nicht enthält, für das PDF ersetzen
 * (sonst erscheinen leere Kästchen): tiefgestellte Ziffern, Pfeile, Vergleichszeichen.
 */
const ERSATZ = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "→": "–", "←": "–", "≥": "mind.", "≤": "höchstens", "≈": "ca." };
const pdfText = (t) => String(t).replace(/[₀₁₂₃→←≥≤≈]/g, (z) => ERSATZ[z]);
function pdfTauglich(wert) {
  if (typeof wert === "string") return pdfText(wert);
  if (Array.isArray(wert)) return wert.map(pdfTauglich);
  if (wert && typeof wert === "object" && Object.getPrototypeOf(wert) === Object.prototype) return Object.fromEntries(Object.entries(wert).map(([k, v]) => [k, pdfTauglich(v)]));
  return wert;
}

const kw = (v) => `${zahl(Math.round(v / 100) * 100)} €`;

function Fuss({ referenz, stand }) {
  return (
    <View style={s.fuss} fixed>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>
          {FIRMA.kurz} · Business-Case-Dossier · {referenz} · Stand {stand}
        </Text>
        <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
      </View>
      <Text style={{ marginTop: 2 }}>Richtwerte/Orientierung – keine Steuer-, Rechts- oder Finanzberatung.</Text>
    </View>
  );
}

function Kpi({ wert, label, hell = false }) {
  return (
    <View style={{ width: "31.5%", backgroundColor: hell ? "rgba(255,255,255,0.08)" : C.sand, borderRadius: 8, padding: 10, marginBottom: 8 }}>
      <Text style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 15, color: hell ? "#ffffff" : C.ink }}>{wert}</Text>
      <Text style={{ fontSize: 7.5, marginTop: 3, color: hell ? "#b9c2d0" : C.ink6 }}>{label}</Text>
    </View>
  );
}

function Zeile({ label, wert }) {
  return (
    <View style={s.zeile}>
      <Text style={s.zeileLabel}>{label}</Text>
      <Text style={s.zeileWert}>{wert}</Text>
    </View>
  );
}

function Tabelle({ kopf, zeilen, breiten }) {
  const b = breiten || kopf.map(() => `${100 / kopf.length}%`);
  return (
    <View>
      <View style={s.tabKopf}>
        {kopf.map((k, i) => (
          <Text key={k} style={{ width: b[i], textAlign: i === 0 ? "left" : "right" }}>
            {k}
          </Text>
        ))}
      </View>
      {zeilen.map((z, i) => (
        <View key={i} style={s.tabZeile} wrap={false}>
          {z.map((v, j) => (
            <Text key={j} style={{ width: b[j], textAlign: j === 0 ? "left" : "right", color: j === 0 ? C.ink6 : C.ink }}>
              {v}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function Punkte({ liste }) {
  return (
    <View>
      {liste.map((t, i) => (
        <View key={i} style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ color: C.gruen, fontWeight: 700, marginRight: 6 }}>•</Text>
          <Text style={[s.text, { flex: 1 }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

/** Kumulierter Cashflow als Balkendiagramm (Jahr 0–25). */
function CashflowChart({ reihe, investition }) {
  const B = 500;
  const H = 140;
  const daten = [{ jahr: 0, kumuliert: -investition }, ...reihe.map((r) => ({ jahr: r.t, kumuliert: r.kumuliert }))];
  const min = Math.min(...daten.map((d) => d.kumuliert), 0);
  const max = Math.max(...daten.map((d) => d.kumuliert), 0);
  const spanne = max - min || 1;
  const y = (v) => H - ((v - min) / spanne) * H;
  const breite = B / daten.length;
  return (
    <View>
      <Svg width={B} height={H + 4}>
        <Line x1={0} x2={B} y1={y(0)} y2={y(0)} stroke={C.ink5} strokeWidth={0.8} />
        {daten.map((d, i) => {
          const oben = Math.min(y(0), y(d.kumuliert));
          const hoehe = Math.max(Math.abs(y(d.kumuliert) - y(0)), 0.8);
          return <Rect key={d.jahr} x={i * breite + 1.5} y={oben} width={breite - 3} height={hoehe} fill={d.kumuliert >= 0 ? C.gruen : "#c2410c"} />;
        })}
      </Svg>
      <View style={{ flexDirection: "row", marginTop: 3 }}>
        {daten.map((d) => (
          <Text key={d.jahr} style={{ width: breite, fontSize: 6.5, color: C.ink5, textAlign: "center" }}>
            {d.jahr % 5 === 0 ? d.jahr : ""}
          </Text>
        ))}
      </View>
      <Text style={[s.klein, { marginTop: 2 }]}>Kumulierter Überschuss in Euro nach Jahren (Jahr 0 = Investition, netto, vor Ertragsteuern, Kauf mit Eigenkapital).</Text>
    </View>
  );
}

/** Tornado: Abweichung des Kapitalwerts je Einflussgröße (niedrig/hoch). */
function Tornado({ sens }) {
  const B = 500;
  const H = 22 * sens.zeilen.length + 10;
  const maxAbw = Math.max(1, ...sens.zeilen.map((z) => Math.max(Math.abs(z.niedrig.delta), Math.abs(z.hoch.delta))));
  const mitte = 170 + (B - 170) / 2;
  const skala = (B - 170) / 2 / maxAbw;
  return (
    <View>
      <Svg width={B} height={H}>
        <Line x1={mitte} x2={mitte} y1={0} y2={H - 6} stroke={C.ink5} strokeWidth={0.8} />
        {sens.zeilen.map((z, i) => {
          const y = 6 + i * 22;
          const balken = (d, farbe) => {
            const w = Math.abs(d) * skala;
            return <Rect x={d < 0 ? mitte - w : mitte} y={y} width={Math.max(w, 0.5)} height={12} fill={farbe} />;
          };
          return (
            <React.Fragment key={z.id}>
              {balken(z.niedrig.delta, C.navy)}
              {balken(z.hoch.delta, C.gruenHell)}
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        {sens.zeilen.map((z, i) => (
          <Text key={z.id} style={{ position: "absolute", top: 6 + i * 22 + 1, left: 0, width: 165, fontSize: 7.5, color: C.ink }}>
            {z.label} ({z.text})
          </Text>
        ))}
      </View>
      <View style={{ marginTop: 4 }}>
        {sens.zeilen.map((z) => (
          <Text key={z.id} style={s.klein}>
            {z.label}: niedrig {kw(z.niedrig.kapitalwert)} · hoch {kw(z.hoch.kapitalwert)} (Spanne {kw(z.spanne)})
          </Text>
        ))}
      </View>
    </View>
  );
}

function Eintraege({ eintraege }) {
  if (!eintraege?.length) return null;
  return (
    <View>
      <Text style={s.h2} minPresenceAhead={90}>Gesammelte Ergebnisse aus den Ökovolt-Werkzeugen</Text>
      {eintraege.map((e, i) => (
        <View key={i} style={s.karte} wrap={false}>
          <Text style={{ fontWeight: 700, fontSize: 10 }}>{e.titel}</Text>
          <Text style={s.klein}>
            Quelle: {BASE_URL}
            {e.quelle}
            {e.stand ? ` · Stand ${e.stand}` : ""}
          </Text>
          {e.kennzahlen.map((k, j) => (
            <Zeile key={j} label={k.label} wert={`${k.wert}${k.einheit ? ` ${k.einheit}` : ""}`} />
          ))}
          {e.annahmen?.length ? <Text style={[s.klein, { marginTop: 4 }]}>Annahmen: {e.annahmen.map((a) => (Array.isArray(a) ? `${a[0]}: ${a[1]}` : a)).join(" · ")}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export default function DossierPdf({ rechnung, eintraege: eintraegeRoh = [], kontakt = {}, referenz, datum, logoPfad }) {
  const r = pdfTauglich(rechnung);
  const eintraege = pdfTauglich(eintraegeRoh);
  const v = VARIANTEN.find((x) => x.id === r.variante) || VARIANTEN[0];
  const cf = r.cashflow;
  const tabelleJahre = [1, 2, 3, 5, 10, 15, 20, 25].filter((j) => cf.reihe[j - 1]);
  const titelText = v.id === "investitionsantrag" ? "Investitionsantrag Photovoltaik" : `Business-Case-Dossier Photovoltaik – ${v.label}`;
  const stand = r.stand.label;

  return (
    <Document title={`${titelText} ${referenz}`} author={FIRMA.name} subject={`${titelText} – Richtwerte, keine Steuer- oder Finanzberatung`} language="de-AT" creator="oekovolt.com">
      {/* Seite 1: Titel + Entscheidungsvorlage */}
      <Page size="A4" style={[s.seite, { paddingTop: 0, paddingHorizontal: 0 }]}>
        <View style={{ backgroundColor: C.navy, paddingHorizontal: 42, paddingTop: 34, paddingBottom: 30 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf-Image kennt kein alt */}
          <Image src={logoPfad} style={{ width: 140 }} />
          <Text style={[s.eyebrow, { color: C.gruenHell, marginTop: 30 }]}>{v.id === "investitionsantrag" ? "Investitionsantrag" : `Business-Case-Dossier · ${v.kurz}`}</Text>
          <Text style={[s.h1, { marginTop: 8 }]}>{v.id === "investitionsantrag" ? "Entscheidungsvorlage Photovoltaik" : "Photovoltaik als Investition – neutral gerechnet."}</Text>
          <Text style={{ color: "#b9c2d0", fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
            {zahl(cf.eingaben.kwp)} kWp · Investition {euro(cf.anlagenpreis)} netto · Eigenverbrauch {prozent(cf.eingaben.eigenverbrauchsquote)} · {kontakt.firma ? `${kontakt.firma} · ` : ""}
            {datum}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20 }}>
            {r.kennzahlen.map((k) => (
              <Kpi key={k.label} hell wert={k.wert} label={`${k.label} – ${k.hinweis}`} />
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 42, paddingTop: 22 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "60%" }}>
              <Text style={s.h3}>Entscheidungsvorlage in Kürze</Text>
              <Punkte
                liste={[
                  `Die Anlage mit ${zahl(cf.eingaben.kwp)} kWp erzeugt im ersten Jahr rund ${zahl(cf.jahr1.erzeugung)} kWh; davon nutzt der Betrieb ${zahl(cf.jahr1.ev)} kWh selbst (${prozent(cf.eingaben.eigenverbrauchsquote)}).`,
                  `Nutzen im ersten Jahr: ${euro(cf.jahr1.cfads)} (Ersparnis ${euro(cf.jahr1.ersparnis)}, Einspeiseerlös ${euro(cf.jahr1.erloes)}, Betriebskosten ${euro(cf.jahr1.betrieb)}).`,
                  `Kapitalwert über 25 Jahre bei ${prozent(cf.eingaben.kalkulationszins, 1)} Kalkulationszins: ${euro(cf.kapitalwert)}; interner Zinsfuß ${cf.irr == null ? "–" : prozent(cf.irr, 1)}; Amortisation ${cf.amortisation == null ? "über 25 Jahre" : `${zahl(cf.amortisation, 1)} Jahre`}.`,
                  cf.kredit ? `Kreditvariante (${prozent(cf.eingaben.kredit.fremdkapitalAnteil)} Fremdkapital, ${prozent(cf.eingaben.kredit.zins, 2)}, ${cf.eingaben.kredit.jahre} J.): Schuldendienstdeckung mindestens ${zahl(cf.kredit.dscr.min, 2)}, im Mittel ${zahl(cf.kredit.dscr.mittel, 2)}.` : "Ohne Kreditvariante gerechnet.",
                  `Größter Hebel laut Sensitivität: ${r.sens.zeilen[0].label} (${r.sens.zeilen[0].text}) mit ${kw(r.sens.zeilen[0].spanne)} Spanne im Kapitalwert.`,
                ]}
              />
            </View>
            <View style={[s.karte, { width: "36%" }]}>
              <Text style={s.eyebrow} minPresenceAhead={120}>Erstellt für</Text>
              <Text style={{ fontWeight: 700, fontSize: 10.5, marginTop: 4 }}>{kontakt.name || "–"}</Text>
              {kontakt.firma ? <Text style={s.text}>{kontakt.firma}</Text> : null}
              <Text style={[s.text, { marginTop: 1 }]}>{kontakt.email || ""}</Text>
              <Text style={[s.eyebrow, { marginTop: 10 }]}>Datum · Referenz · Stand</Text>
              <Text style={[s.text, { marginTop: 3 }]}>
                {datum} · {referenz} · Daten {stand}
              </Text>
              <Text style={[s.eyebrow, { marginTop: 10 }]}>Hinweis</Text>
              <Text style={[s.klein, { marginTop: 3 }]}>{HAFTUNG}</Text>
            </View>
          </View>

        </View>
        <Fuss referenz={referenz} stand={stand} />
      </Page>

      {/* Ab Seite 2 fließend: Annahmen → Cashflow → Risiken → variantenspezifisch → nächste Schritte */}
      <Page size="A4" style={s.seite}>
        <Text style={s.eyebrow} minPresenceAhead={120}>Annahmen</Text>
        <Text style={s.h2} minPresenceAhead={90}>Annahmen (mit Quelle und Stand)</Text>
        {r.annahmen.map(([l, w]) => (
          <View key={l} wrap={false}>
            <Zeile label={l} wert={w} />
          </View>
        ))}

        <View wrap={false} style={{ marginTop: 16 }}>
          <Text style={s.eyebrow} minPresenceAhead={120}>Cashflow</Text>
          <Text style={s.h2} minPresenceAhead={90}>Cashflow über 25 Jahre (Kauf mit Eigenkapital)</Text>
          <CashflowChart reihe={cf.reihe} investition={cf.investition} />
        </View>
        <View style={{ marginTop: 10 }}>
          <Tabelle
            kopf={["Jahr", "Erzeugung kWh", "Ersparnis", "Erlös", "Betrieb", "Netto", cf.kredit ? "Schuldendienst" : "IFB-Effekt", "Kumuliert"]}
            breiten={["8%", "14%", "13%", "12%", "12%", "13%", "14%", "14%"]}
            zeilen={tabelleJahre.map((j) => {
              const z = cf.reihe[j - 1];
              return [String(j), zahl(z.erzeugung), euro(z.ersparnis), euro(z.erloes), euro(z.betrieb), euro(z.netto), cf.kredit ? euro(z.schuldendienst) : euro(z.ifb), euro(z.kumuliert)];
            })}
          />
          <Text style={[s.klein, { marginTop: 4 }]}>Netto = Ersparnis + Erlös − Betrieb (+ IFB-Steuereffekt im Jahr 1). Richtwerte auf Basis Marktstatistik 2024 (BMIMI), IEA PVPS NSR Austria 2024, Eurostat; Stand {stand}.</Text>
        </View>

        <View wrap={false} style={{ marginTop: 14 }}>
          <Text style={s.eyebrow} minPresenceAhead={120}>Risiken</Text>
          <Text style={s.h2} minPresenceAhead={90}>Sensitivität des Kapitalwerts (Tornado)</Text>
          <Tornado sens={r.sens} />
        </View>
        <View style={{ marginTop: 8, marginBottom: 14 }}>
          {r.risiken.map((x) => (
            <Text key={x.id} style={[s.text, { marginBottom: 3 }]} wrap={false}>
              {x.text}
            </Text>
          ))}
        </View>

        {(v.id === "cfo" || v.id === "investitionsantrag") && (
          <View>
            <Text style={s.eyebrow} minPresenceAhead={120}>Modellvergleich</Text>
            <Text style={s.h2} minPresenceAhead={90}>Kaufen, finanzieren, leasen, Contracting, PPA oder Pacht – neutral über 20 Jahre</Text>
            <Tabelle
              kopf={["Modell", "Kapitalwert", "Liquidität Jahr 1", "Eigentum am Ende", "IFB/AfA"]}
              breiten={["20%", "16%", "16%", "24%", "24%"]}
              zeilen={r.modell.modelle.map((m) => [m.name, kw(m.kapitalwert), euro(m.liquiditaetJahr1), m.eigentumEnde ? "Ja" : "Nein", m.ifbAfa.split(";")[0]])}
            />
            <Text style={[s.klein, { marginTop: 4 }]}>Eingaben je Modell (Beispielwerte, durch Angebote ersetzen): {r.modell.modelle.map((m) => `${m.kurz}: ${m.eingaben.map(([l, w]) => `${l} ${w}`).join(", ")}`).join(" · ")}</Text>
            {r.modell.hinweise.map((h) => (
              <Text key={h} style={[s.klein, { marginTop: 2 }]}>
                {h}
              </Text>
            ))}
          </View>
        )}

        {v.id === "bank" && (
          <View>
            <Text style={s.eyebrow} minPresenceAhead={120}>Für den Finanzierungspartner</Text>
            <Text style={s.h2} minPresenceAhead={90}>Schuldendienstdeckung (DSCR) der Kreditvariante</Text>
            {cf.kredit ? (
              <View>
                <Tabelle
                  kopf={["Jahr", "CFADS", "Zinsen", "Tilgung", "Schuldendienst", "DSCR", "Restschuld"]}
                  breiten={["8%", "16%", "15%", "15%", "16%", "12%", "18%"]}
                  zeilen={cf.reihe
                    .filter((z) => z.schuldendienst > 0)
                    .map((z) => [String(z.t), euro(z.cfads), euro(z.zinsen), euro(z.tilgung), euro(z.schuldendienst), zahl(z.dscr ?? z.cfads / z.schuldendienst, 2), euro(z.restschuld)])}
                />
                <Text style={[s.klein, { marginTop: 4 }]}>
                  DSCR = Cashflow vor Schuldendienst ÷ (Zins + Tilgung). Minimum {zahl(cf.kredit.dscr.min, 2)}, Mittel {zahl(cf.kredit.dscr.mittel, 2)}; Kreditbetrag {euro(cf.kredit.betrag)}, Annuität {euro(cf.kredit.rate)} (Beispielzins {prozent(cf.eingaben.kredit.zins, 2)} – keine Bankkondition).
                </Text>
              </View>
            ) : (
              <Text style={s.text}>Ohne Kreditvariante gerechnet – Fremdkapitalanteil im Dossier setzen, um den DSCR auszuweisen.</Text>
            )}
            <Text style={s.h3}>Ertragsprognose – Methode</Text>
            <Punkte
              liste={[
                `Spezifischer Ertrag ${zahl(cf.eingaben.ertragProKwp)} kWh/kWp und Jahr (Marktstatistik 2024: 1.000 Volllaststunden; IEA PVPS NSR Austria 2024: 1.050 kWh/kWp im Mittel aller Anlagen); standortgenau per PVGIS im Standort-Check.`,
                `Degradation ${prozent(cf.eingaben.degradation, 2)} je Jahr, Betriebskosten ${euro(cf.eingaben.betriebskosten)} (+${prozent(cf.eingaben.betriebskostenSteigerung)} p. a.), Strompreis ${zahl(cf.eingaben.strompreisCt, 1)} ct/kWh netto (+${prozent(cf.eingaben.strompreisSteigerung)} p. a.).`,
                `Eigenverbrauchsquote ${prozent(cf.eingaben.eigenverbrauchsquote)} als Annahme des Betriebs – vor Kreditentscheidung mit Lastgang (Viertelstundenwerte) belegen.`,
                "Alle Werte netto, vor Ertragsteuern; Zuschüsse nur, wenn im Fördercall zugesagt.",
              ]}
            />
            <Text style={s.h3}>Unterlagenliste</Text>
            <Punkte liste={r.unterlagen} />
          </View>
        )}

        {v.id === "gemeinderat" && r.vergabe && (
          <View>
            <Text style={s.eyebrow} minPresenceAhead={120}>Für den Gemeinderat</Text>
            <Text style={s.h2} minPresenceAhead={90}>Vergabehinweise (BVergG 2018 idF Vergaberechtsgesetz 2026)</Text>
            <Text style={s.text}>
              Geschätzter Auftragswert (netto, ohne Optionen): {euro(cf.anlagenpreis)}. Ob die PV-Errichtung als Bau- oder als Liefer-/Dienstleistungsauftrag einzuordnen ist, entscheidet der Auftraggeber sachkundig (§ 13 BVergG).
            </Text>
            {[
              ["Als Bauauftrag", r.vergabe.bau],
              ["Als Liefer-/Dienstleistungsauftrag", r.vergabe.lieferDl],
            ].map(([t, w]) => (
              <View key={t} style={s.karte}>
                <Text style={{ fontWeight: 700, fontSize: 10 }}>
                  {t}: {w.kurz}
                </Text>
                {w.wege
                  .filter((x) => x.zulaessig)
                  .map((x) => (
                    <Text key={x.id} style={[s.klein, { marginTop: 2 }]}>
                      {x.name} ({x.norm}) – {x.text}
                    </Text>
                  ))}
              </View>
            ))}
            <Text style={s.h3}>Pflichten</Text>
            <Punkte liste={[...new Set([...r.vergabe.bau.pflichten, ...r.vergabe.lieferDl.pflichten])]} />
            <Text style={s.klein}>Stand der Vergabe-Schwellenwerte: {r.vergabe.stand.label}. Orientierung, keine Rechtsberatung – die Wahl des Verfahrens verantwortet der Auftraggeber.</Text>
          </View>
        )}

        {v.id === "investitionsantrag" && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.eyebrow} minPresenceAhead={120}>Nachhaltigkeitsbericht</Text>
            <Text style={s.h2} minPresenceAhead={90}>CO2-Textbaustein (Berichtsjahr {String(r.eingaben.berichtsjahr)})</Text>
            <Text style={s.text}>{r.co2Text}</Text>
          </View>
        )}

        <Text style={[s.eyebrow, { marginTop: 14 }]} minPresenceAhead={120}>Nächste Schritte</Text>
        <Text style={s.h2} minPresenceAhead={90}>Vom Dossier zum Beschluss</Text>
        {r.schritte.map((x, i) => (
          <View key={x.t} style={{ flexDirection: "row", marginBottom: 4 }} wrap={false}>
            <Text style={{ color: C.gruen, fontWeight: 700, width: 16 }}>{i + 1}.</Text>
            <Text style={[s.text, { flex: 1 }]}>
              <Text style={{ fontWeight: 700, color: C.ink }}>{x.t}: </Text>
              {x.x}
            </Text>
          </View>
        ))}
        <Fuss referenz={referenz} stand={stand} />
      </Page>

      {/* Seite 4: gesammelte Ergebnisse + Quellen */}
      <Page size="A4" style={s.seite}>
        <Eintraege eintraege={eintraege} />
        <Text style={s.h2} minPresenceAhead={90}>Quellen und Stand</Text>
        {r.quellen.map((q) => (
          <Text key={q.titel} style={[s.klein, { marginBottom: 2 }]}>
            {q.titel} – {q.href}
          </Text>
        ))}
        <Text style={[s.klein, { marginTop: 10 }]}>
          {FIRMA.name}, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort} · {FIRMA.telefon} · {FIRMA.email} · {BASE_URL}. {HAFTUNG} Alle Kennzahlen sind Richtwerte zur Orientierung (Stand {stand}); Angaben zu Anbietern, Konditionen oder Förderzusagen enthält dieses Dokument nicht.
        </Text>
        <Fuss referenz={referenz} stand={stand} />
      </Page>
    </Document>
  );
}
