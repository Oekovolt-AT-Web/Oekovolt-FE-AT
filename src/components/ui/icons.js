// Auflösung der Icon-Namen aus src/data/navigation.js
import {
  Sun, BatteryCharging, HousePlug, Building2, Thermometer, PlugZap, Gauge, Factory,
  Wrench, Cpu, RefreshCw, TrendingUp, Wallet, Zap, Gift, Calculator, Sparkles, BadgeEuro,
  Activity, Map, Percent, Landmark, FileCheck2, Images, MapPin, BookOpen, Library, Euro,
  HelpCircle, Users, Briefcase, MessageCircle, CalendarDays, Newspaper, Rss, Circle,
} from "lucide-react";

const ICONS = {
  Sun, BatteryCharging, HousePlug, Building2, Thermometer, PlugZap, Gauge, Factory,
  Wrench, Cpu, RefreshCw, TrendingUp, Wallet, Zap, Gift, Calculator, Sparkles, BadgeEuro,
  Activity, Map, Percent, Landmark, FileCheck2, Images, MapPin, BookOpen, Library, Euro,
  HelpCircle, Users, Briefcase, MessageCircle,
};

export function iconFor(name) {
  return ICONS[name] || Circle;
}
