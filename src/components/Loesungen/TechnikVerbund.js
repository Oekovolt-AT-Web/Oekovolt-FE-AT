import { MonitorDot, Radio, SlidersHorizontal } from "lucide-react";
import FeatureGrid from "@/components/ui/FeatureGrid";

/**
 * Verweis auf die eigenen Systeme (Parkregler, Fernwartung, SCADA) –
 * je Seite mit eigenem, zum Anwendungsfall passenden Text.
 * texte: { parkregler, fernwartung, scada }
 */
export default function TechnikVerbund({ texte = {}, className }) {
  return (
    <FeatureGrid
      cols={3}
      className={className}
      items={[
        {
          icon: SlidersHorizontal,
          title: "Eigener Parkregler (EZA-Regler)",
          text: texte.parkregler || "Regelt Wirk- und Blindleistung am Netzverknüpfungspunkt nach den Vorgaben des Netzbetreibers und der TOR Erzeuger.",
          href: "/technik/parkregler",
        },
        {
          icon: Radio,
          title: "Eigene Fernwartung",
          text: texte.fernwartung || "Gesicherter Fernzugriff auf Wechselrichter, Regler und Zähler – Störungen erkennen und beheben, oft ohne Anfahrt.",
          href: "/technik/fernwartung",
        },
        {
          icon: MonitorDot,
          title: "Eigenes SCADA",
          text: texte.scada || "Erzeugung, Verbrauch, Speicher und Netzvorgaben in einer Leitwarte – mit Berichten für Controlling und Nachhaltigkeit.",
          href: "/technik/scada",
        },
      ]}
    />
  );
}
