// Regionalseiten /photovoltaik/[stadt] – je Stadt eine Datei mit eigenen, recherchierten Inhalten.
// Neue Stadt: Datei anlegen, hier eintragen, Koordinaten in scripts/regionen-pvgis.mjs ergänzen
// und `node scripts/regionen-pvgis.mjs` ausführen.

import memmingen from "./memmingen";
import augsburg from "./augsburg";
import kempten from "./kempten";
import ulm from "./ulm";
import muenchen from "./muenchen";
import garmischPartenkirchen from "./garmisch-partenkirchen";
import ingolstadt from "./ingolstadt";
import friedrichshafen from "./friedrichshafen";
import rosenheim from "./rosenheim";
import konstanz from "./konstanz";
import landshut from "./landshut";
import stuttgart from "./stuttgart";
import regensburg from "./regensburg";
import nuernberg from "./nuernberg";
import heilbronn from "./heilbronn";
import fuerth from "./fuerth";
import erlangen from "./erlangen";
import karlsruhe from "./karlsruhe";
import wuerzburg from "./wuerzburg";
import heidelberg from "./heidelberg";
import freiburg from "./freiburg";
import passau from "./passau";
import mannheim from "./mannheim";
import frankfurt from "./frankfurt";

export const REGIONEN = {
  memmingen,
  augsburg,
  kempten,
  ulm,
  muenchen,
  "garmisch-partenkirchen": garmischPartenkirchen,
  ingolstadt,
  friedrichshafen,
  rosenheim,
  konstanz,
  landshut,
  stuttgart,
  regensburg,
  nuernberg,
  heilbronn,
  fuerth,
  erlangen,
  karlsruhe,
  wuerzburg,
  heidelberg,
  freiburg,
  passau,
  mannheim,
  frankfurt,
};
