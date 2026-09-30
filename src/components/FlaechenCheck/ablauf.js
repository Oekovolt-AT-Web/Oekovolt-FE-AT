// Ablauf von der Fläche zur Widmung – gemeinsam für /flaechen-check und die Widmungsseiten.
import { Cable, FileSignature, HardHat, SearchCheck } from "lucide-react";

export const ABLAUF = [
  { icon: SearchCheck, title: "Fläche prüfen", text: "Widmung, Landeszonen und Ausschlussgründe wie Wald, Schutz- oder Gefahrenzonen klären; dazu Größe, Hang und Zufahrt." },
  { icon: Cable, title: "Netz anfragen", text: "Beim Verteilernetzbetreiber Anschlusspunkt, Netzebene und freie Kapazität erfragen – ohne Netz ist die beste Fläche wertlos." },
  { icon: FileSignature, title: "Gemeinde gewinnen", text: "Der Gemeinderat ändert den Flächenwidmungsplan, die Landesregierung genehmigt. Oft braucht es Gutachten zu Naturschutz und Landschaftsbild." },
  { icon: HardHat, title: "Bewilligen & bauen", text: "Elektrizitäts-, Naturschutz- und Baurecht je nach Land und Größe; danach Förderung oder PPA, Bau, Netzanschluss und Betrieb." },
];
