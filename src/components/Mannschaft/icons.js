// src/components/Mannschaft/icons.js
//
// Auflösung der Icon-Namen aus src/data/mannschaft.js. Eigene Tabelle, damit die
// gemeinsame src/components/ui/icons.js unverändert bleibt.

import {
  Award, BadgeCheck, CalendarCheck2, Car, Circle, Construction, DraftingCompass, Forklift, HardHat, MonitorDot, Pickaxe,
  PlugZap, ScanSearch, ShieldCheck, SlidersHorizontal, Tractor, Truck, UserRoundCheck, Users, Warehouse,
} from "lucide-react";

const ICONS = {
  Award, BadgeCheck, CalendarCheck2, Car, Construction, DraftingCompass, Forklift, HardHat, MonitorDot, Pickaxe,
  PlugZap, ScanSearch, ShieldCheck, SlidersHorizontal, Tractor, Truck, UserRoundCheck, Users, Warehouse,
};

export function mannschaftIcon(name) {
  return ICONS[name] || Circle;
}
