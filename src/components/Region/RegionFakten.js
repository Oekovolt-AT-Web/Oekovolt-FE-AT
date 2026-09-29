import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Gauge, HandCoins, Landmark, LifeBuoy, Mountain, Route, Scale, Target } from "lucide-react";

const host = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Quelle";
  }
};

function Quelle({ url, label }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
      {label || host(url)}
      <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
      <span className="sr-only">(öffnet neues Fenster)</span>
    </a>
  );
}

function Intern({ href, children }) {
  return (
    <Link href={href} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
      {children}
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
    </Link>
  );
}

function Karte({ icon: Icon, titel, children }) {
  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
      <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ov-700">
        <Icon aria-hidden="true" className="h-4 w-4" />
        {titel}
      </h3>
      <div className="mt-3 text-[15px] leading-relaxed text-ink-700">{children}</div>
    </div>
  );
}

const E_CONTROL = "https://www.e-control.at/tarifkalkulator";

const fahrzeit = (min) => [Math.floor(min / 60) && `${Math.floor(min / 60)} h`, min % 60 && `${min % 60} min`].filter(Boolean).join(" ");

/** Belegte Fakten zum Ort – jede Angabe mit Quelle. Fehlende Angaben werden weggelassen. */
export default function RegionFakten({ region, ohne = [] }) {
  const f = region.fakten;
  const land = region.landDaten;
  const p = region.pvgis;
  const name = region.kurzname || region.name;

  return (
    // Mauerwerk-Layout: Karten unterschiedlicher Höhe ohne Lücken und ohne verwaiste Einzelkarte
    <div className="gap-4 md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">

      {f.netzbetreiber?.name && !ohne.includes("netz") && (
        <Karte icon={Gauge} titel="Verteilnetzbetreiber">
          <p className="font-semibold text-ink-900">{f.netzbetreiber.name}</p>
          {f.netzbetreiber.hinweis && <p className="mt-1 text-[14px] text-ink-600">{f.netzbetreiber.hinweis}</p>}
          <p className="mt-2 text-[14px] text-ink-600">
            Netzanfrage, Netzzugangsantrag und Fertigstellungsmeldung übernehmen wir. Die Bestätigung des Netzbetreibers brauchen Sie auch für das Förderansuchen bei der OeMAG.
          </p>
          <div className="flex flex-wrap gap-x-4">
            <Quelle url={f.netzbetreiber.url} />
            <Quelle url={E_CONTROL} label="E-Control Tarifkalkulator (PLZ-Abfrage)" />
          </div>
        </Karte>
      )}

      <Karte icon={HandCoins} titel="Förderung">
        <p>
          Bundesweit gibt es für PV-Anlagen und Stromspeicher den EAG-Investitionszuschuss, vergeben in Fördercalls der OeMAG. Das Förderansuchen muss vor der Inbetriebnahme gestellt werden.
        </p>
        {f.foerderprogramme?.map((pr) => (
          <div key={pr.name} className="mt-3 border-t border-ink-100 pt-3">
            <p className="font-semibold text-ink-900">{pr.name}</p>
            <p className="text-[14px] text-ink-600">
              {pr.traeger}
              {pr.gegenstand ? ` · ${pr.gegenstand}` : ""}
            </p>
            <Quelle url={pr.url} />
          </div>
        ))}
        <Intern href={region.foerderHref}>Landesförderungen {region.bundesland}</Intern>
      </Karte>

      {land?.bauordnung && (
        <Karte icon={Scale} titel={`Baurecht ${region.bundesland}`}>
          <p>{land.bauordnung.text}</p>
          <Quelle url={land.bauordnung.url} />
        </Karte>
      )}

      {f.ortsbild?.map((o) => (
        <Karte key={o.text} icon={Landmark} titel="Ortsbild & Denkmalschutz">
          <p>{o.text}</p>
          <Quelle url={o.url} />
        </Karte>
      ))}

      {region.alpin && (
        <Karte icon={Mountain} titel="Schneelast & Statik">
          <p>
            {name} liegt auf rund {Number(p.hoehe_m).toLocaleString("de-DE")} m Seehöhe. Die charakteristische Schneelast nach ÖNORM B 1991-1-3 hängt von Lastzone und Seehöhe ab und liegt
            im alpinen Raum deutlich über Flachlandwerten. {region.schnee || "Unterkonstruktion, Modulwahl und Befestigung legen wir nach dem Wert für die genaue Adresse aus und prüfen vorher die Tragreserven des Dachs."}
          </p>
          <Quelle url="https://hora.gv.at/" label="HORA – Naturgefahren & Schneelast" />
          <Intern href="/standort-check">Standort-Check mit Schneelast</Intern>
        </Karte>
      )}

      {!ohne.includes("anfahrt") && (
      <Karte icon={Route} titel="Einsatz ab Ostermiething">
        {region.heimat ? (
          <p>Hier sitzen wir: Planung, Lager, Montage-Teams und Service starten im Gewerbegebiet Ostermiething.</p>
        ) : (
          <p>
            Rund {p.strasse_km ? `${Number(p.strasse_km).toLocaleString("de-DE")} km Straße` : `${p.luftlinie_km} km Luftlinie`}
            {p.fahrzeit_min ? ` bzw. etwa ${fahrzeit(p.fahrzeit_min)} Fahrzeit ohne Verkehr` : ""} ab unserem
            Firmensitz. {region.anfahrt || ""}
          </p>
        )}
      </Karte>
      )}

      {land?.energieberatung && (
        <Karte icon={LifeBuoy} titel="Neutrale Energieberatung">
          <p className="font-semibold text-ink-900">{land.energieberatung.name}</p>
          <p className="mt-1 text-[14px] text-ink-600">Unabhängige Beratung des Landes – eine gute Ergänzung zu jedem Angebot, auch zu unserem.</p>
          <Quelle url={land.energieberatung.url} />
        </Karte>
      )}

      {f.klimaziel?.text && (
        <Karte icon={Target} titel="Klima & Energie vor Ort">
          <p>{f.klimaziel.text}</p>
          <Quelle url={f.klimaziel.url} />
        </Karte>
      )}

      {f.besonderheiten?.map((b) => (
        <Karte key={b.text} icon={Building2} titel="Gut zu wissen">
          <p>{b.text}</p>
          <Quelle url={b.url} />
        </Karte>
      ))}
    </div>
  );
}
