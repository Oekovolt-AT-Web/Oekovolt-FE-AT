/**
 * Kostenaufteilung einer schlüsselfertigen PV-Anlage als gestapelter Balken
 * mit Legende. Anteile sind typische Marktwerte (Orientierung), der Betrag
 * je Position wird aus dem Gesamtpreis abgeleitet. Modulanteile orientieren
 * sich an der BMWET-Marktstatistik 2024 (Moduleinkaufspreis je kWp im
 * Verhältnis zum Systempreis: 10 kWp ≈ 14 %, 30–50 kWp ≈ 23 %).
 */

const VARIANTEN = {
  privat: {
    titel: "Beispiel 10 kWp Einfamilienhaus",
    hinweis:
      "Typische Verteilung bei Einfamilienhäusern, Orientierung – je nach Dach, Zählerplatz und Gerüstbedarf verschieben sich die Anteile.",
    posten: [
      { titel: "Montage & Gerüst", anteil: 0.26, farbe: "#669933", text: "Arbeitszeit auf dem Dach, Gerüst, Anfahrt – weitgehend fix." },
      { titel: "Elektroinstallation", anteil: 0.18, farbe: "#1f5aa1", text: "Verkabelung, Überspannungsschutz, Zählerplatz." },
      { titel: "Module", anteil: 0.14, farbe: "#436621", text: "Seit dem Preisverfall 2023/24 nur noch ein kleiner Teil des Preises." },
      { titel: "Wechselrichter", anteil: 0.14, farbe: "#8cba58", text: "Wird meist einmal in der Laufzeit getauscht." },
      { titel: "Unterkonstruktion", anteil: 0.1, farbe: "#7fa7d6", text: "Passend zu Eindeckung, Schnee- und Windlast – hier nie sparen." },
      { titel: "Planung, Netz & Förderung", anteil: 0.08, farbe: "#c4cad5", text: "Auslegung, Netzzugangsantrag, Fertigstellungsmeldung, OeMAG." },
      { titel: "Gemeinkosten & Gewährleistung", anteil: 0.1, farbe: "#9aa3b2", text: "Lager, Fahrzeuge, Gewährleistungsrücklage, Verwaltung." },
    ],
  },
  gewerbe: {
    titel: "Beispiel 100 kWp Hallendach",
    hinweis:
      "Typische Verteilung bei Gewerbe-Flachdächern, Orientierung – Kran, Statik, Netzanschluss und Brandschutzauflagen können die Anteile deutlich verschieben.",
    posten: [
      { titel: "Module", anteil: 0.23, farbe: "#436621", text: "Glas-Glas oder Glas-Folie, Hagel- und Schneelastklasse bestimmen den Preis." },
      { titel: "Montage & Logistik", anteil: 0.17, farbe: "#669933", text: "Kran, Absturzsicherung, Materiallogistik auf dem Dach." },
      { titel: "DC-/AC-Elektrotechnik", anteil: 0.16, farbe: "#1f5aa1", text: "Kabel, Überspannungsschutz, Unterverteilung, Zählerplatz." },
      { titel: "Unterkonstruktion & Ballast", anteil: 0.13, farbe: "#7fa7d6", text: "Aufständerung passend zu Dachstatik, Windsog und Schneelast." },
      { titel: "Wechselrichter", anteil: 0.09, farbe: "#8cba58", text: "String-Wechselrichter, bei großen Anlagen mehrere Geräte." },
      { titel: "Planung, Statik & Netz", anteil: 0.08, farbe: "#c4cad5", text: "Lastgang, Statiknachweis, Netzzugang, Förderansuchen." },
      { titel: "Monitoring & Regelung", anteil: 0.04, farbe: "#2f7d8c", text: "Datenlogger, Fernwartung, bei Bedarf EZA-/Parkregler." },
      { titel: "Gemeinkosten & Gewährleistung", anteil: 0.1, farbe: "#9aa3b2", text: "Projektleitung, Dokumentation, Gewährleistungsrücklage." },
    ],
  },
};

export default function KostenAufteilung({ gesamt, variante = "privat", titel }) {
  const v = VARIANTEN[variante] || VARIANTEN.privat;
  const eur = (n) => (Math.round(n / 50) * 50).toLocaleString("de-DE") + " €";
  return (
    <figure className="my-8 rounded-3xl bg-white p-5 ring-1 ring-ink-200/80 md:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-[16.5px] font-bold text-ink-900">{titel || v.titel}</p>
        <p className="ov-num font-display text-[20px] font-extrabold text-ink-900">{eur(gesamt)}</p>
      </div>
      <div
        className="mt-4 flex h-5 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`Kostenaufteilung: ${v.posten.map((p) => `${p.titel} ${Math.round(p.anteil * 100)} Prozent`).join(", ")}`}
      >
        {v.posten.map((p) => (
          <span key={p.titel} className="h-full border-r-2 border-white last:border-r-0" style={{ width: `${p.anteil * 100}%`, background: p.farbe }} />
        ))}
      </div>
      <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {v.posten.map((p) => (
          <li key={p.titel} className="flex gap-3">
            <span aria-hidden="true" className="mt-1.5 h-3 w-3 shrink-0 rounded-[4px]" style={{ background: p.farbe }} />
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-semibold text-ink-900">{p.titel}</span>
                <span className="ov-num whitespace-nowrap text-[14px] text-ink-600">
                  {Math.round(p.anteil * 100)} % · <span className="font-semibold text-ink-900">{eur(gesamt * p.anteil)}</span>
                </span>
              </p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-ink-500">{p.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-5 border-t border-ink-100 pt-4 text-[12.5px] leading-relaxed text-ink-500">{v.hinweis}</figcaption>
    </figure>
  );
}
