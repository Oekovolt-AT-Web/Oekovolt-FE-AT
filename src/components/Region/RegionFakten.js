import { ArrowUpRight, Building2, Gauge, HandCoins, Landmark, LifeBuoy, Map, Mountain, Target } from "lucide-react";
import { BUNDESLAENDER } from "@/data/bundeslaender";

const LAND_KEY = { Bayern: "bayern", "Baden-Württemberg": "baden-wuerttemberg", Hessen: "hessen" };
const host = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Quelle";
  }
};

function Quelle({ url }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
      {host(url)}
      <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
      <span className="sr-only">(öffnet neues Fenster)</span>
    </a>
  );
}

function Karte({ icon: Icon, titel, children }) {
  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
      <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ov-700">
        <Icon aria-hidden="true" className="h-4 w-4" />
        {titel}
      </p>
      <div className="mt-3 text-[15px] leading-relaxed text-ink-700">{children}</div>
    </div>
  );
}

/** Belegte Fakten zur Stadt – jede Angabe mit Quelle. Fehlende Angaben werden weggelassen. */
export default function RegionFakten({ region }) {
  const f = region.fakten;
  const land = BUNDESLAENDER[LAND_KEY[region.bundesland]];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {f.netzbetreiber?.name && (
        <Karte icon={Gauge} titel="Netzbetreiber">
          <p className="font-semibold text-ink-900">{f.netzbetreiber.name}</p>
          {f.netzbetreiber.hinweis && <p className="mt-1 text-[14px] text-ink-600">{f.netzbetreiber.hinweis}</p>}
          <p className="mt-2 text-[14px] text-ink-600">Die Anmeldung Ihrer Anlage beim Netzbetreiber und im Marktstammdatenregister übernehmen wir für Sie.</p>
          <Quelle url={f.netzbetreiber.anmeldung_url || f.netzbetreiber.url} />
        </Karte>
      )}

      <Karte icon={HandCoins} titel="Förderung vor Ort">
        {f.foerderprogramme?.length ? (
          <ul className="space-y-3">
            {f.foerderprogramme.map((p) => (
              <li key={p.name}>
                <p className="font-semibold text-ink-900">{p.name}</p>
                <p className="text-[14px] text-ink-600">
                  {p.traeger}
                  {p.gegenstand ? ` · ${p.gegenstand}` : ""}
                  {p.konditionen ? ` · ${p.konditionen}` : ""}
                </p>
                {p.status && <p className="text-[13px] font-medium text-ink-700">Status: {p.status}</p>}
                <Quelle url={p.url} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Ein kommunales Zuschussprogramm für private Photovoltaik haben wir für {region.name} zum Stand {f.stand ? new Date(f.stand).toLocaleDateString("de-DE") : "der Recherche"} nicht gefunden.</p>
        )}
        {land?.landesprogramm?.kurz && <p className="mt-3 border-t border-ink-100 pt-3 text-[14px] text-ink-600">{land.landesprogramm.kurz}</p>}
      </Karte>

      {f.solarkataster?.length > 0 && (
        <Karte icon={Map} titel="Solarkataster">
          <ul className="space-y-3">
            {f.solarkataster.map((k) => (
              <li key={k.url}>
                <p className="font-semibold text-ink-900">{k.name}</p>
                <p className="text-[14px] text-ink-600">{k.traeger}</p>
                <Quelle url={k.url} />
              </li>
            ))}
          </ul>
        </Karte>
      )}

      {f.energieberatung?.name && (
        <Karte icon={LifeBuoy} titel="Neutrale Energieberatung">
          <p className="font-semibold text-ink-900">{f.energieberatung.name}</p>
          <p className="mt-1 text-[14px] text-ink-600">Unabhängige Erstberatung – eine gute Ergänzung zu jedem Angebot, auch zu unserem.</p>
          <Quelle url={f.energieberatung.url} />
        </Karte>
      )}

      {f.klimaziel?.text && (
        <Karte icon={Target} titel="Klimaziel der Stadt">
          <p>{f.klimaziel.text}</p>
          <Quelle url={f.klimaziel.url} />
        </Karte>
      )}

      {f.schneelastzone?.zone && (
        <Karte icon={Mountain} titel="Statik & Schneelast">
          <p>
            Schneelastzone <strong className="text-ink-900">{f.schneelastzone.zone}</strong>
            {f.gelaendehoehe_m?.wert ? ` bei rund ${Number(f.gelaendehoehe_m.wert).toLocaleString("de-DE")} m Geländehöhe` : ""}. Befestigung und Modulauswahl legen wir nach
            der für das Gebäude maßgeblichen Schneelast aus.
          </p>
          <Quelle url={f.schneelastzone.url} />
        </Karte>
      )}

      {f.ortsbild?.map((o) => (
        <Karte key={o.text} icon={Landmark} titel="Ortsbild & Denkmalschutz">
          <p>{o.text}</p>
          <Quelle url={o.url} />
        </Karte>
      ))}

      {f.besonderheiten?.map((b) => (
        <Karte key={b.text} icon={Building2} titel="Gut zu wissen">
          <p>{b.text}</p>
          <Quelle url={b.url} />
        </Karte>
      ))}
    </div>
  );
}
