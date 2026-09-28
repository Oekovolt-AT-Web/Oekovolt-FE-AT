// Mehrseitige PV-Analyse als PDF (serverseitig mit @react-pdf/renderer).
// Schriften: Inter & Manrope (SIL Open Font License), lokal eingebunden.

import path from "node:path";
import { Document, Font, G, Image, Line, Page, Rect, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

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
Font.registerHyphenationCallback((wort) => [wort]);

const C = { navy: "#03122b", navy2: "#0b2147", gruen: "#558227", gruenHell: "#8cc152", sand: "#f7f5ef", sand2: "#efece2", ink: "#1b2330", ink6: "#4b5563", ink4: "#6b7280", linie: "#e3e6ea", sonne: "#f5b700" };

const eur = (v) => `${Math.round(v).toLocaleString("de-DE")}\u00a0€`;
const kwh = (v) => `${Math.round(v).toLocaleString("de-DE")}\u00a0kWh`;
const pct = (v) => `${Math.round(v * 100)}\u00a0%`;
const jahreText = (v) => (v == null ? "über 20 Jahre" : `${v.toLocaleString("de-DE", { maximumFractionDigits: 1 })} Jahre`);

const s = StyleSheet.create({
  seite: { fontFamily: "Inter", fontSize: 9.5, color: C.ink, paddingTop: 42, paddingBottom: 56, paddingHorizontal: 42, backgroundColor: "#ffffff" },
  fuss: { position: "absolute", bottom: 22, left: 42, right: 42, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: C.ink4, borderTopWidth: 0.6, borderTopColor: C.linie, paddingTop: 8 },
  eyebrow: { fontSize: 8, fontWeight: 700, letterSpacing: 1.6, color: C.gruen, textTransform: "uppercase" },
  h1: { fontFamily: "Manrope", fontWeight: 800, fontSize: 30, lineHeight: 1.12, color: "#ffffff" },
  h2: { fontFamily: "Manrope", fontWeight: 800, fontSize: 18, color: C.ink, marginTop: 4, marginBottom: 10 },
  h3: { fontFamily: "Manrope", fontWeight: 700, fontSize: 11.5, color: C.ink, marginBottom: 6 },
  text: { fontSize: 9.5, lineHeight: 1.55, color: C.ink6 },
  karte: { backgroundColor: C.sand, borderRadius: 10, padding: 14 },
  zeile: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottomWidth: 0.6, borderBottomColor: C.linie },
  zeileLabel: { color: C.ink6 },
  zeileWert: { fontWeight: 600, color: C.ink },
});

function Fuss({ referenz }) {
  return (
    <View style={s.fuss} fixed>
      <Text>Ökovolt · Persönliche Photovoltaik-Analyse · {referenz}</Text>
      <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
    </View>
  );
}

function Kpi({ wert, label, hell = false }) {
  return (
    <View style={{ width: "31.5%", backgroundColor: hell ? "rgba(255,255,255,0.08)" : C.sand, borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <Text style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 17, color: hell ? "#ffffff" : C.ink }}>{wert}</Text>
      <Text style={{ fontSize: 8, marginTop: 3, color: hell ? "#b9c2d0" : C.ink6 }}>{label}</Text>
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

function MonatsChart({ monate }) {
  const B = 500;
  const H = 150;
  const max = Math.max(...monate.map((m) => Math.max(m.pv, m.bedarf))) * 1.1;
  const breite = B / 12;
  return (
    <View>
      <Svg width={B} height={H + 18}>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <Line key={t} x1={0} x2={B} y1={H - H * t} y2={H - H * t} stroke={C.linie} strokeWidth={0.6} />
        ))}
        {monate.map((m, i) => {
          const hPv = (m.pv / max) * H;
          const hB = (m.bedarf / max) * H;
          const x = i * breite + 6;
          return (
            <G key={m.monat}>
              <Rect x={x} y={H - hPv} width={breite * 0.42} height={hPv} fill={C.sonne} />
              <Rect x={x + breite * 0.44} y={H - hB} width={breite * 0.42} height={hB} fill={C.navy2} />
            </G>
          );
        })}
      </Svg>
      <View style={{ flexDirection: "row", marginTop: -14 }}>
        {monate.map((m) => (
          <Text key={m.monat} style={{ width: breite, fontSize: 7, color: C.ink4, textAlign: "center" }}>
            {m.monat}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: "row", marginTop: 8, gap: 14 }}>
        <Legende farbe={C.sonne} text="Solarertrag" />
        <Legende farbe={C.navy2} text="Stromverbrauch" />
      </View>
    </View>
  );
}

function Legende({ farbe, text }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ width: 8, height: 8, backgroundColor: farbe, borderRadius: 2, marginRight: 4 }} />
      <Text style={{ fontSize: 8, color: C.ink6 }}>{text}</Text>
    </View>
  );
}

function CashflowChart({ cashflow }) {
  const B = 500;
  const H = 170;
  const werte = cashflow.map((c) => c.kumuliert);
  const min = Math.min(...werte);
  const max = Math.max(...werte, 0);
  const spanne = max - min || 1;
  const y = (v) => H - ((v - min) / spanne) * H;
  const breite = B / cashflow.length;
  return (
    <View>
      <Svg width={B} height={H + 4}>
        <Line x1={0} x2={B} y1={y(0)} y2={y(0)} stroke={C.ink4} strokeWidth={0.8} />
        {cashflow.map((c, i) => {
          const oben = Math.min(y(0), y(c.kumuliert));
          const hoehe = Math.max(Math.abs(y(c.kumuliert) - y(0)), 0.8);
          return <Rect key={c.jahr} x={i * breite + 2} y={oben} width={breite - 4} height={hoehe} fill={c.kumuliert >= 0 ? C.gruen : "#c2410c"} />;
        })}
      </Svg>
      <View style={{ flexDirection: "row", marginTop: 4 }}>
        {cashflow.map((c) => (
          <Text key={c.jahr} style={{ width: breite, fontSize: 6.5, color: C.ink4, textAlign: "center" }}>
            {c.jahr % 5 === 0 ? c.jahr : ""}
          </Text>
        ))}
      </View>
      <Text style={{ fontSize: 7.5, color: C.ink4, marginTop: 2 }}>Kumulierter Überschuss in Euro nach Jahren (Jahr 0 = Investition)</Text>
    </View>
  );
}

export default function AnalysePdf({ daten, kontakt, referenz, datum, logoPfad, qrPng }) {
  const { eingaben: e, ergebnis: r, vergleich, monate, szenarien, labels, annahmen } = daten;
  const cf = r.cashflow;
  const tabelleJahre = [1, 5, 10, 15, 20].filter((j) => cf[j]);

  return (
    <Document title={`Photovoltaik-Analyse ${referenz}`} author="Ökovolt Solartechnik GmbH" subject="Unverbindliche Photovoltaik-Ersteinschätzung" language="de-AT" creator="oekovolt.com">
      {/* ------------------------------------------------ Seite 1: Titel */}
      <Page size="A4" style={[s.seite, { paddingTop: 0, paddingHorizontal: 0 }]}>
        <View style={{ backgroundColor: C.navy, paddingHorizontal: 42, paddingTop: 36, paddingBottom: 34 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf-Image kennt kein alt */}
          <Image src={logoPfad} style={{ width: 150 }} />
          <Text style={[s.eyebrow, { color: C.gruenHell, marginTop: 38 }]}>Persönliche Photovoltaik-Analyse</Text>
          <Text style={[s.h1, { marginTop: 8 }]}>{kontakt.name ? `Ihre Solaranlage, ${kontakt.name.split(" ")[0]}.` : "Ihre Solaranlage in Zahlen."}</Text>
          <Text style={{ color: "#b9c2d0", fontSize: 10.5, marginTop: 10, lineHeight: 1.5 }}>
            {e.kwp.toLocaleString("de-DE")} kWp{e.speicherKwh > 0 ? ` mit ${e.speicherKwh.toLocaleString("de-DE")} kWh Speicher` : " ohne Speicher"} · {kwh(e.verbrauch)} Jahresverbrauch
            {kontakt.plz ? ` · PLZ ${kontakt.plz}` : ""}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 24 }}>
            <Kpi hell wert={kwh(r.jahresertrag)} label="Solarertrag pro Jahr" />
            <Kpi hell wert={pct(r.autarkie)} label="Autarkie (Anteil eigener Strom)" />
            <Kpi hell wert={eur(r.nutzenProJahr)} label="Nutzen im ersten Jahr" />
            <Kpi hell wert={eur(r.investition)} label="Investition (Richtwert)" />
            <Kpi hell wert={jahreText(r.amortisationJahre)} label="Amortisation" />
            <Kpi hell wert={eur(r.ertrag20Jahre)} label="Überschuss nach 20 Jahren" />
          </View>
        </View>

        <View style={{ paddingHorizontal: 42, paddingTop: 26 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "58%" }}>
              <Text style={s.h3}>Das Wichtigste in Kürze</Text>
              {[
                `Ihre Anlage erzeugt rund ${kwh(r.jahresertrag)} Solarstrom im Jahr – etwa ${Math.round((r.jahresertrag / e.verbrauch) * 100)} % Ihres Jahresverbrauchs.`,
                `Rund ${kwh(r.eigenverbrauch)} nutzen Sie selbst und sparen damit etwa ${eur(r.ersparnis)} Stromkosten im ersten Jahr.`,
                `Den Überschuss von ${kwh(r.eingespeist)} vergütet der Netzbetreiber mit ${r.satzCt.toLocaleString("de-DE")} ct/kWh – rund ${eur(r.einspeiseErloes)} pro Jahr, 20 Jahre fest.`,
                `Die Anlage spart jährlich etwa ${(r.co2ProJahr / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} t CO2 gegenüber dem deutschen Strommix.`,
              ].map((t) => (
                <View key={t} style={{ flexDirection: "row", marginBottom: 6 }}>
                  <Text style={{ color: C.gruen, fontWeight: 700, marginRight: 6 }}>•</Text>
                  <Text style={[s.text, { flex: 1 }]}>{t}</Text>
                </View>
              ))}
            </View>
            <View style={[s.karte, { width: "38%" }]}>
              <Text style={s.eyebrow}>Erstellt für</Text>
              <Text style={{ fontWeight: 700, fontSize: 11, marginTop: 5 }}>{kontakt.name || "–"}</Text>
              <Text style={[s.text, { marginTop: 2 }]}>{kontakt.email}</Text>
              <Text style={[s.eyebrow, { marginTop: 12 }]}>Datum · Referenz</Text>
              <Text style={{ fontWeight: 600, marginTop: 5 }}>{datum}</Text>
              <Text style={s.text}>{referenz}</Text>
            </View>
          </View>
          <View style={{ marginTop: 18, borderLeftWidth: 3, borderLeftColor: C.sonne, paddingLeft: 10 }}>
            <Text style={[s.text, { fontSize: 8.5 }]}>
              Unverbindliche Ersteinschätzung auf Basis Ihrer Angaben und typischer Werte für Süddeutschland – kein Angebot. Ein verbindliches Angebot erstellen wir nach Prüfung von
              Dach, Statik, Verschattung und Zählerschrank.
            </Text>
          </View>
        </View>
        <Fuss referenz={referenz} />
      </Page>

      {/* ------------------------------------------------ Seite 2: Anlage & Energie */}
      <Page size="A4" style={s.seite}>
        <Text style={s.eyebrow}>Anlage & Energiefluss</Text>
        <Text style={s.h2}>So arbeitet Ihre Solaranlage</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={s.h3}>Ihre Angaben</Text>
            <Zeile label="Anlagengröße" wert={`${e.kwp.toLocaleString("de-DE")} kWp`} />
            <Zeile label="Benötigte Dachfläche" wert={`ca. ${Math.round(r.benoetigteFlaeche)} m²`} />
            <Zeile label="Ausrichtung" wert={labels.ausrichtung} />
            <Zeile label="Dachneigung" wert={labels.neigung} />
            <Zeile label="Jahresstromverbrauch" wert={kwh(e.verbrauch)} />
            <Zeile label="Batteriespeicher" wert={e.speicherKwh > 0 ? `${e.speicherKwh.toLocaleString("de-DE")} kWh` : "keiner"} />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={s.h3}>Energiebilanz im ersten Jahr</Text>
            <Zeile label="Spezifischer Ertrag" wert={`${Math.round(r.spezifischerErtrag).toLocaleString("de-DE")} kWh/kWp`} />
            <Zeile label="Solarertrag" wert={kwh(r.jahresertrag)} />
            <Zeile label="Selbst genutzt" wert={`${kwh(r.eigenverbrauch)} (${pct(r.eigenverbrauchsquote)})`} />
            <Zeile label="Eingespeist" wert={kwh(r.eingespeist)} />
            <Zeile label="Restbezug aus dem Netz" wert={kwh(r.netzbezug)} />
            <Zeile label="Autarkiegrad" wert={pct(r.autarkie)} />
          </View>
        </View>

        <View style={[s.karte, { marginTop: 18 }]}>
          <Text style={s.h3}>Woher Ihr Strom künftig kommt</Text>
          <View style={{ flexDirection: "row", height: 16, borderRadius: 8, overflow: "hidden", marginTop: 4 }}>
            <View style={{ width: `${Math.round(r.autarkie * 100)}%`, backgroundColor: C.gruen }} />
            <View style={{ flex: 1, backgroundColor: C.navy2 }} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 6, gap: 14 }}>
            <Legende farbe={C.gruen} text={`Eigener Solarstrom ${pct(r.autarkie)}`} />
            <Legende farbe={C.navy2} text={`Netzstrom ${pct(1 - r.autarkie)}`} />
          </View>
        </View>

        <Text style={[s.h3, { marginTop: 22 }]}>Solarertrag und Verbrauch im Jahresverlauf</Text>
        <MonatsChart monate={monate} />
        <Text style={[s.text, { marginTop: 10, fontSize: 8.5 }]}>
          Im Sommer erzeugt die Anlage deutlich mehr Strom als Sie verbrauchen, im Winter weniger. Ein Speicher verschiebt Überschüsse vom Tag in den Abend; eine Wärmepumpe oder ein
          E-Auto erhöhen den Eigenverbrauch zusätzlich.
        </Text>
        <Fuss referenz={referenz} />
      </Page>

      {/* ------------------------------------------------ Seite 3: Wirtschaftlichkeit */}
      <Page size="A4" style={s.seite}>
        <Text style={s.eyebrow}>Wirtschaftlichkeit</Text>
        <Text style={s.h2}>Was sich über 20 Jahre rechnet</Text>
        <CashflowChart cashflow={cf} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 18 }}>
          <View style={{ width: "48%" }}>
            <Text style={s.h3}>Investition (Richtwerte)</Text>
            <Zeile label={`Photovoltaikanlage ${e.kwp.toLocaleString("de-DE")} kWp`} wert={eur(r.anlagenpreis)} />
            {r.speicherpreis > 0 && <Zeile label={`Speicher ${e.speicherKwh.toLocaleString("de-DE")} kWh`} wert={eur(r.speicherpreis)} />}
            <Zeile label="Gesamt (0 % USt. für Privathaushalte)" wert={eur(r.investition)} />
            <Text style={[s.h3, { marginTop: 14 }]}>Jahr 1</Text>
            <Zeile label="Ersparnis Strombezug" wert={eur(r.ersparnis)} />
            <Zeile label="Einspeisevergütung" wert={eur(r.einspeiseErloes)} />
            <Zeile label="Betriebskosten" wert={`– ${eur(r.betriebskosten)}`} />
            <Zeile label="Nutzen gesamt" wert={eur(r.nutzenProJahr)} />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={s.h3}>Entwicklung</Text>
            <View style={[s.zeile, { borderBottomColor: C.ink4 }]}>
              <Text style={{ fontWeight: 700, width: "25%" }}>Jahr</Text>
              <Text style={{ fontWeight: 700, width: "35%", textAlign: "right" }}>Nutzen</Text>
              <Text style={{ fontWeight: 700, width: "40%", textAlign: "right" }}>kumuliert</Text>
            </View>
            {tabelleJahre.map((j) => (
              <View key={j} style={s.zeile}>
                <Text style={{ width: "25%" }}>{j}</Text>
                <Text style={{ width: "35%", textAlign: "right" }}>{eur(cf[j].netto)}</Text>
                <Text style={{ width: "40%", textAlign: "right", fontWeight: 600, color: cf[j].kumuliert >= 0 ? C.gruen : "#c2410c" }}>{eur(cf[j].kumuliert)}</Text>
              </View>
            ))}
            <Text style={[s.h3, { marginTop: 14 }]}>Strompreis-Szenarien</Text>
            {szenarien.map((x) => (
              <Zeile key={x.steigerung} label={`${Math.round(x.steigerung * 100)} % Preissteigerung/Jahr`} wert={`${jahreText(x.amortisation)} · ${eur(x.ertrag20)}`} />
            ))}
          </View>
        </View>

        <View style={[s.karte, { marginTop: 18 }]}>
          <Text style={s.h3}>Mit oder ohne Speicher?</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {[
              { t: "Ohne Speicher", v: vergleich.ohneSpeicher },
              { t: `Mit ${vergleich.mitSpeicher.kwh.toLocaleString("de-DE")} kWh Speicher`, v: vergleich.mitSpeicher },
            ].map((x) => (
              <View key={x.t} style={{ width: "48%" }}>
                <Text style={{ fontWeight: 700, marginBottom: 4 }}>{x.t}</Text>
                <Zeile label="Autarkie" wert={pct(x.v.autarkie)} />
                <Zeile label="Investition" wert={eur(x.v.investition)} />
                <Zeile label="Amortisation" wert={jahreText(x.v.amortisation)} />
                <Zeile label="Überschuss nach 20 Jahren" wert={eur(x.v.ertrag20)} />
              </View>
            ))}
          </View>
        </View>
        <Fuss referenz={referenz} />
      </Page>

      {/* ------------------------------------------------ Seite 4: Nächste Schritte */}
      <Page size="A4" style={s.seite}>
        <Text style={s.eyebrow}>Nächste Schritte</Text>
        <Text style={s.h2}>Vom Rechenbeispiel zu Ihrer Anlage</Text>
        {[
          { t: "Beratung", x: "Wir besprechen Ihre Ziele, den Verbrauch und die Optionen – telefonisch, per Video oder vor Ort." },
          { t: "Dach-Check & Planung", x: "Dachfläche, Statik, Verschattung und Zählerschrank werden geprüft; daraus entsteht die exakte Auslegung." },
          { t: "Verbindliches Angebot", x: "Sie erhalten ein transparentes Angebot mit Wirtschaftlichkeitsrechnung und Komponenten namhafter Hersteller." },
          { t: "Montage & Anmeldung", x: "Installation, Inbetriebnahme sowie Anmeldung bei Netzbetreiber und Marktstammdatenregister aus einer Hand." },
        ].map((k, i) => (
          <View key={k.t} style={{ flexDirection: "row", marginBottom: 12 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.gruen, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
              <Text style={{ color: "#ffffff", fontWeight: 700 }}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 700, fontSize: 10.5 }}>{k.t}</Text>
              <Text style={s.text}>{k.x}</Text>
            </View>
          </View>
        ))}

        <View style={{ flexDirection: "row", backgroundColor: C.navy, borderRadius: 12, padding: 18, marginTop: 10, alignItems: "center" }}>
          <View style={{ flex: 1, paddingRight: 14 }}>
            <Text style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 16, color: "#ffffff" }}>Kostenlosen Beratungstermin buchen</Text>
            <Text style={{ color: "#b9c2d0", marginTop: 6, lineHeight: 1.45 }}>QR-Code scannen oder www.oekovolt.com/termin – telefonisch unter {"08245\u00a096\u00a0788\u00a00"} oder per E-Mail an office@oekovolt.com.</Text>
            <Text style={{ color: C.gruenHell, marginTop: 8, fontWeight: 600 }}>Bitte Referenz {referenz} angeben.</Text>
          </View>
          {qrPng && (
            <View style={{ backgroundColor: "#ffffff", padding: 6, borderRadius: 8 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf-Image kennt kein alt */}
              <Image src={qrPng} style={{ width: 86, height: 86 }} />
            </View>
          )}
        </View>

        <Text style={[s.h3, { marginTop: 22 }]}>Annahmen dieser Berechnung</Text>
        <Text style={[s.text, { fontSize: 8.3 }]}>
          Spezifischer Ertrag {annahmen.ertragProKwpSued.toLocaleString("de-DE")} kWh/kWp bei Südausrichtung (Süddeutschland), korrigiert um Ausrichtung und Neigung; Strompreis{" "}
          {Math.round(annahmen.strompreis * 100)} ct/kWh mit {Math.round(e.preissteigerung * 100)} % jährlicher Steigerung; Einspeisevergütung nach EEG ({r.satzCt.toLocaleString("de-DE")} ct/kWh
          Teileinspeisung, {annahmen.garantieJahre} Jahre fest); Moduldegradation {(annahmen.degradation * 100).toLocaleString("de-DE")} % pro Jahr; Betriebskosten{" "}
          {annahmen.betriebskostenProKwp.toLocaleString("de-DE")} €/kWp pro Jahr; Speicher {annahmen.speicherPreisProKwh.toLocaleString("de-DE")} €/kWh. Eigenverbrauch und Autarkie sind
          Näherungswerte aus Erfahrungskurven; die tatsächlichen Werte hängen von Lastprofil, Verschattung, Wetter und Anlagentechnik ab.
        </Text>
        <Text style={[s.text, { fontSize: 8.3, marginTop: 8 }]}>
          Diese Analyse ist eine unverbindliche Ersteinschätzung und stellt weder ein Angebot noch eine Steuer-, Rechts- oder Finanzberatung dar. Preise sind Richtwerte inklusive
          Montage (0 % Umsatzsteuer nach § 12 Abs. 3 UStG für Anlagen auf oder nahe Wohngebäuden).
        </Text>
        <View style={{ marginTop: 22, borderTopWidth: 0.6, borderTopColor: C.linie, paddingTop: 10 }}>
          <Text style={{ fontWeight: 700 }}>ÖKOVOLT GmbH Solartechnik</Text>
          <Text style={s.text}>Schlingener Straße 1a · 86842 Türkheim · 08245 96 788 0 · office@oekovolt.com · www.oekovolt.com</Text>
        </View>
        <Fuss referenz={referenz} />
      </Page>
    </Document>
  );
}
