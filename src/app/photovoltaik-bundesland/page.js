// /photovoltaik-bundesland ohne Land: Die Übersicht aller Bundesländer steht auf /photovoltaik.
import { permanentRedirect } from "next/navigation";

export default function BundeslandUebersicht() {
  permanentRedirect("/photovoltaik#bundeslaender");
}
