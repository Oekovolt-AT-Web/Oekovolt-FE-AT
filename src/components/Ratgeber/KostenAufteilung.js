/**
 * Kostenaufteilung einer schlüsselfertigen PV-Anlage als gestapelter Balken
 * mit Legende. Anteile sind typische Marktwerte (Orientierung), der Betrag
 * je Position wird aus dem Gesamtpreis abgeleitet.
 */

const POSTEN = [
  { titel: "Module", anteil: 0.3, farbe: "#436621", text: "Wirkungsgrad, Garantie und Degradation machen den Unterschied." },
  { titel: "Montage & Gerüst", anteil: 0.22, farbe: "#669933", text: "Arbeitszeit auf dem Dach, Gerüst, Anfahrt – weitgehend fix." },
  { titel: "Wechselrichter", anteil: 0.15, farbe: "#8cba58", text: "Wird meist einmal in der Laufzeit getauscht." },
  { titel: "Elektroinstallation", anteil: 0.13, farbe: "#1f5aa1", text: "Verkabelung, Überspannungsschutz, Zählerplatz." },
  { titel: "Unterkonstruktion", anteil: 0.12, farbe: "#7fa7d6", text: "Passend zu Eindeckung und Statik – hier nie sparen." },
  { titel: "Planung & Anmeldung", anteil: 0.08, farbe: "#c4cad5", text: "Auslegung, Netzbetreiber, Marktstammdatenregister." },
];

export default function KostenAufteilung({ gesamt }) {
  const eur = (n) => (Math.round(n / 50) * 50).toLocaleString("de-DE") + " €";
  return (
    <figure className="my-8 rounded-3xl bg-white p-5 ring-1 ring-ink-200/80 md:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-[16.5px] font-bold text-ink-900">Beispiel 10 kWp</p>
        <p className="ov-num font-display text-[20px] font-extrabold text-ink-900">{eur(gesamt)}</p>
      </div>
      <div
        className="mt-4 flex h-5 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`Kostenaufteilung: ${POSTEN.map((p) => `${p.titel} ${Math.round(p.anteil * 100)} Prozent`).join(", ")}`}
      >
        {POSTEN.map((p) => (
          <span key={p.titel} className="h-full border-r-2 border-white last:border-r-0" style={{ width: `${p.anteil * 100}%`, background: p.farbe }} />
        ))}
      </div>
      <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {POSTEN.map((p) => (
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
      <figcaption className="mt-5 border-t border-ink-100 pt-4 text-[12.5px] leading-relaxed text-ink-500">
        Typische Verteilung bei Einfamilienhäusern, Orientierung – je nach Dach und Elektroinstallation verschieben sich die Anteile.
      </figcaption>
    </figure>
  );
}
