// Regionalseiten /photovoltaik/[stadt] – je Ort eine Datei mit eigenen, recherchierten Inhalten.
// Neuer Ort: Koordinaten in scripts/regionen-pvgis.mjs ergänzen, `node scripts/regionen-pvgis.mjs`
// ausführen, Datei anlegen und hier eintragen. Landesweite Angaben: ./laender.js

import ostermiething from "./ostermiething";
import linz from "./linz";
import wels from "./wels";
import steyr from "./steyr";
import braunau from "./braunau";
import riedImInnkreis from "./ried-im-innkreis";
import voecklabruck from "./voecklabruck";
import gmunden from "./gmunden";
import salzburg from "./salzburg";
import hallein from "./hallein";
import bischofshofen from "./bischofshofen";
import zellAmSee from "./zell-am-see";
import innsbruck from "./innsbruck";
import kufstein from "./kufstein";
import woergl from "./woergl";
import kitzbuehel from "./kitzbuehel";
import lienz from "./lienz";
import bregenz from "./bregenz";
import dornbirn from "./dornbirn";
import feldkirch from "./feldkirch";
import klagenfurt from "./klagenfurt";
import villach from "./villach";
import wolfsberg from "./wolfsberg";
import graz from "./graz";
import leoben from "./leoben";
import kapfenberg from "./kapfenberg";
import weiz from "./weiz";
import hartberg from "./hartberg";
import eisenstadt from "./eisenstadt";
import neusiedlAmSee from "./neusiedl-am-see";
import wien from "./wien";
import stPoelten from "./st-poelten";
import wienerNeustadt from "./wiener-neustadt";
import amstetten from "./amstetten";
import krems from "./krems";
import tulln from "./tulln";
import moedling from "./moedling";

export const REGIONEN = {
  ostermiething,
  linz,
  wels,
  steyr,
  braunau,
  "ried-im-innkreis": riedImInnkreis,
  voecklabruck,
  gmunden,
  salzburg,
  hallein,
  bischofshofen,
  "zell-am-see": zellAmSee,
  innsbruck,
  kufstein,
  woergl,
  kitzbuehel,
  lienz,
  bregenz,
  dornbirn,
  feldkirch,
  klagenfurt,
  villach,
  wolfsberg,
  graz,
  leoben,
  kapfenberg,
  weiz,
  hartberg,
  eisenstadt,
  "neusiedl-am-see": neusiedlAmSee,
  wien,
  "st-poelten": stPoelten,
  "wiener-neustadt": wienerNeustadt,
  amstetten,
  krems,
  tulln,
  moedling,
};
