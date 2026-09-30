# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Unit-Tests der reinen Heatmap-Logik (ohne Frappe/Datenbank).
# Lokal:  cd …/doctype/heatmap_zelle && python -m unittest test_heatmap_logik -v
# Bench:  bench --site <site> run-tests --module oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.test_heatmap_logik

import unittest
from datetime import date

try:
	from . import heatmap_logik as L
except ImportError:  # direkt im Ordner ausgeführt
	import heatmap_logik as L


class TestEingaben(unittest.TestCase):
	def test_pfad(self):
		self.assertEqual(L.pfad_pruefen("/gewerbe"), "/gewerbe")
		self.assertEqual(L.pfad_pruefen(" /gewerbe/?utm_source=x#top "), "/gewerbe")
		self.assertEqual(L.pfad_pruefen("/"), "/")
		self.assertEqual(L.pfad_pruefen("/a\n/b"), "/a/b")
		self.assertIsNone(L.pfad_pruefen("gewerbe"))
		self.assertIsNone(L.pfad_pruefen("//evil.example"))
		self.assertIsNone(L.pfad_pruefen("https://www.oekovolt.com/x"))
		self.assertIsNone(L.pfad_pruefen(None))
		self.assertIsNone(L.pfad_pruefen(123))
		self.assertEqual(len(L.pfad_pruefen("/" + "a" * 500)), 200)
		# nur [a-z0-9/._-] nach Kleinschreibung
		self.assertEqual(L.pfad_pruefen("/Gewerbe/PV-Anlage_2.0"), "/gewerbe/pv-anlage_2.0")
		self.assertIsNone(L.pfad_pruefen("/gewerbe%20x"))
		self.assertIsNone(L.pfad_pruefen("/förderung"))
		self.assertIsNone(L.pfad_pruefen("/a b"))
		self.assertIsNone(L.pfad_pruefen("/<script>"))
		self.assertIsNone(L.pfad_pruefen("/a;drop"))

	def test_pfad_limit(self):
		self.assertTrue(L.neuer_pfad_erlaubt(0))
		self.assertTrue(L.neuer_pfad_erlaubt(None))
		self.assertTrue(L.neuer_pfad_erlaubt(L.MAX_PFADE_JE_MONAT - 1))
		self.assertFalse(L.neuer_pfad_erlaubt(L.MAX_PFADE_JE_MONAT))
		self.assertEqual(L.MAX_PFADE_JE_MONAT, 2000)

	def test_geraet(self):
		self.assertEqual(L.geraet_pruefen("mobil"), "mobil")
		self.assertEqual(L.geraet_pruefen(" Desktop "), "desktop")
		self.assertIsNone(L.geraet_pruefen("handy"))
		self.assertIsNone(L.geraet_pruefen(None))

	def test_selektor(self):
		self.assertEqual(L.selektor_pruefen("  main > a.cta  "), "main > a.cta")
		self.assertEqual(len(L.selektor_pruefen("x" * 300)), 200)
		self.assertIsNone(L.selektor_pruefen("   "))
		self.assertIsNone(L.selektor_pruefen(["a"]))

	def test_koordinate(self):
		self.assertEqual(L.koordinate_runden(0.35), 0.35)
		self.assertEqual(L.koordinate_runden(0.37), 0.35)
		self.assertEqual(L.koordinate_runden(0.38), 0.4)
		self.assertEqual(L.koordinate_runden(0.025), 0.05)  # halb → aufwärts (wie Math.round)
		self.assertEqual(L.koordinate_runden("0.5"), 0.5)
		self.assertEqual(L.koordinate_runden(-3), 0.0)
		self.assertEqual(L.koordinate_runden(7), 1.0)
		self.assertIsNone(L.koordinate_runden(float("nan")))
		self.assertIsNone(L.koordinate_runden(float("inf")))
		self.assertIsNone(L.koordinate_runden(True))
		self.assertIsNone(L.koordinate_runden("abc"))
		for i in range(0, 101):
			w = L.koordinate_runden(i / 100)
			self.assertAlmostEqual(w * 20, round(w * 20), places=9)
			self.assertEqual(w, round(w, 2))

	def test_scroll(self):
		self.assertEqual(L.scroll_runden(70), 70)
		self.assertEqual(L.scroll_runden(64), 60)
		self.assertEqual(L.scroll_runden(65), 70)
		self.assertEqual(L.scroll_runden(4), 0)
		self.assertEqual(L.scroll_runden(250), 100)
		self.assertEqual(L.scroll_runden(-5), 0)
		self.assertIsNone(L.scroll_runden(None))
		self.assertIsNone(L.scroll_runden("x"))

	def test_klicks_bereinigen(self):
		roh = [{"sel": "a", "rx": 0.36, "ry": 0.5}, {"sel": "", "rx": 0.1, "ry": 0.1}, {"sel": "b", "rx": "x", "ry": 0}, "kaputt", {"sel": "c", "rx": 1.4, "ry": -1}]
		self.assertEqual(L.klicks_bereinigen(roh), [("a", 0.35, 0.5), ("c", 1.0, 0.0)])
		self.assertEqual(L.klicks_bereinigen('[{"sel": "a", "rx": 0.1, "ry": 0.2}]'), [("a", 0.1, 0.2)])
		self.assertEqual(L.klicks_bereinigen("kein json"), [])
		self.assertEqual(L.klicks_bereinigen(None), [])
		viele = [{"sel": f"s{i}", "rx": 0.5, "ry": 0.5} for i in range(150)]
		self.assertEqual(len(L.klicks_bereinigen(viele)), 100)

	def test_erfassung_vorbereiten(self):
		e = L.erfassung_vorbereiten({
			"pfad": "/gewerbe/", "geraet": "Mobil", "scroll": 67,
			"klicks": [{"sel": "a", "rx": 0.36, "ry": 0.5}, {"sel": "a", "rx": 0.34, "ry": 0.52}, {"sel": "b", "rx": 0, "ry": 0}],
		})
		self.assertEqual(e["pfad"], "/gewerbe")
		self.assertEqual(e["geraet"], "mobil")
		self.assertEqual(e["scroll"], 70)
		self.assertEqual(e["klicks"], [("a", 0.35, 0.5, 2), ("b", 0.0, 0.0, 1)])
		with self.assertRaises(ValueError):
			L.erfassung_vorbereiten({"pfad": "x", "geraet": "mobil"})
		with self.assertRaises(ValueError):
			L.erfassung_vorbereiten({"pfad": "/", "geraet": "tv"})
		self.assertEqual(L.erfassung_vorbereiten({"pfad": "/", "geraet": "tablet"})["klicks"], [])


class TestSchluessel(unittest.TestCase):
	def test_deterministisch(self):
		a = L.name_zelle("/x", "mobil", "a", 0.35, 0.5, "2026-09")
		self.assertEqual(a, L.name_zelle("/x", "mobil", "a", 0.350000001, 0.5, "2026-09"))
		self.assertEqual(len(a), 64)
		self.assertNotEqual(a, L.name_zelle("/x", "mobil", "a", 0.35, 0.5, "2026-10"))
		self.assertNotEqual(a, L.name_zelle("/x", "desktop", "a", 0.35, 0.5, "2026-09"))
		self.assertEqual(L.name_scroll("/x", "mobil", 70, "2026-09"), L.name_scroll("/x", "mobil", "70", "2026-09"))
		self.assertNotEqual(L.name_seite("/x", "mobil", "2026-09"), L.name_scroll("/x", "mobil", 0, "2026-09"))

	def test_keine_verwechslung_durch_trenner(self):
		self.assertNotEqual(L.name_seite("/a", "mobil", "2026-09"), L.name_seite("/a\x1fmobil", "", "2026-09"))


class TestMonate(unittest.TestCase):
	def test_monat(self):
		self.assertEqual(L.monat_von(date(2026, 1, 5)), "2026-01")
		self.assertEqual(L.monat_verschieben("2026-01", -1), "2025-12")
		self.assertEqual(L.monat_verschieben("2025-12", 1), "2026-01")
		self.assertEqual(L.monat_verschieben("2026-09", -13), "2025-08")
		self.assertEqual(L.monat_pruefen("2026-09"), "2026-09")
		self.assertIsNone(L.monat_pruefen("2026-13"))
		self.assertIsNone(L.monat_pruefen("26-09"))
		self.assertIsNone(L.monat_pruefen(None))

	def test_tage(self):
		self.assertEqual(L.monate_fuer_tage(date(2026, 9, 30), 30), ("2026-09", "2026-09"))
		self.assertEqual(L.monate_fuer_tage(date(2026, 9, 15), 30), ("2026-08", "2026-09"))
		self.assertEqual(L.monate_fuer_tage(date(2026, 9, 15), None), ("2026-08", "2026-09"))
		self.assertEqual(L.monate_fuer_tage(date(2026, 9, 15), 0), ("2026-09", "2026-09"))
		self.assertEqual(L.monate_fuer_tage(date(2026, 9, 15), 100000)[0], "2025-07")

	def test_loeschgrenze(self):
		# 14 Monate behalten: 2025-08 … 2026-09, 2025-07 wird gelöscht
		self.assertEqual(L.loesch_grenze(date(2026, 9, 30)), "2025-08")
		self.assertTrue("2025-07" < L.loesch_grenze(date(2026, 9, 1)) <= "2025-08")
		self.assertEqual(L.loesch_grenze(date(2026, 1, 1)), "2024-12")


class TestAuswertung(unittest.TestCase):
	def test_scroll_kumulieren(self):
		k = L.scroll_kumulieren([(30, 2), (100, 1), (70, 3), (30, 1)])
		self.assertEqual([z["tiefe"] for z in k], list(range(10, 101, 10)))
		werte = {z["tiefe"]: z["anzahl"] for z in k}
		self.assertEqual(werte[10], 7)
		self.assertEqual(werte[30], 7)
		self.assertEqual(werte[40], 4)
		self.assertEqual(werte[70], 4)
		self.assertEqual(werte[80], 1)
		self.assertEqual(werte[100], 1)
		self.assertEqual(L.scroll_kumulieren([]), [{"tiefe": t, "anzahl": 0} for t in range(10, 101, 10)])
		# monoton fallend
		self.assertEqual([z["anzahl"] for z in k], sorted([z["anzahl"] for z in k], reverse=True))

	def test_klicks_zusammenfassen(self):
		zeilen = [("a", 0.35, 0.5, 2), ("b", 0.1, 0.1, 5), ("a", "0.35", "0.50", 1)]
		self.assertEqual(L.klicks_zusammenfassen(zeilen), [
			{"sel": "b", "rx": 0.1, "ry": 0.1, "anzahl": 5},
			{"sel": "a", "rx": 0.35, "ry": 0.5, "anzahl": 3},
		])
		self.assertEqual(len(L.klicks_zusammenfassen(zeilen, limit=1)), 1)

	def test_top_elemente(self):
		t = L.top_elemente([("a", 5), ("b", 20)], 40)
		self.assertEqual(t[0], {"selektor": "b", "klicks": 20, "anteil": 50.0})
		self.assertEqual(t[1]["anteil"], 12.5)
		self.assertEqual(L.top_elemente([("a", 5)], 0)[0]["anteil"], 0.0)

	def test_scroll_anteile(self):
		self.assertEqual(L.scroll_anteile([{"tiefe": 10, "anzahl": 3}, {"tiefe": 20, "anzahl": 1}], 4), [75.0, 25.0])
		self.assertEqual(L.scroll_anteile([{"tiefe": 10, "anzahl": 3}], 0), [0.0])

	def test_ansicht_link(self):
		self.assertEqual(
			L.ansicht_link("https://www.oekovolt.com/", "/gewerbe", "ab c&d", "mobil"),
			"https://www.oekovolt.com/gewerbe?heatmap=ab%20c%26d&geraet=mobil",
		)
		self.assertTrue(L.ansicht_link("https://www.oekovolt.com", "/", "t", None).endswith("/?heatmap=t&geraet=desktop"))


if __name__ == "__main__":
	unittest.main()
