# Tests der reinen Termin-Logik (ohne Frappe/Bench):
#   python tests/test_termin_logik.py        (im Ordner apps/oekovolt_app)
#   python -m unittest discover -s tests -v

import importlib.util
import sys
import unittest
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

_PFAD = Path(__file__).resolve().parents[1] / "oekovolt_app" / "website_api" / "termin_logik.py"
_spec = importlib.util.spec_from_file_location("termin_logik", _PFAD)
L = importlib.util.module_from_spec(_spec)
sys.modules["termin_logik"] = L
_spec.loader.exec_module(L)


def einstellungen(**werte):
	return L.einstellungen_normalisieren(werte or None)


def tag(ymd, art=L.TELEFON, e=None, belegungen=(), jetzt=datetime(2026, 9, 30, 7, 0)):
	return L.tag_berechnen(date.fromisoformat(ymd), art, e or einstellungen(), list(belegungen), jetzt)


def belegung(ymd, von, bis, pool="buero"):
	d = date.fromisoformat(ymd)
	h1, m1 = map(int, von.split(":"))
	h2, m2 = map(int, bis.split(":"))
	return {"start": datetime(d.year, d.month, d.day, h1, m1), "ende": datetime(d.year, d.month, d.day, h2, m2), "pool": pool}


class Feiertage(unittest.TestCase):
	def test_ostersonntag(self):
		self.assertEqual(L.ostersonntag(2024), date(2024, 3, 31))
		self.assertEqual(L.ostersonntag(2025), date(2025, 4, 20))
		self.assertEqual(L.ostersonntag(2026), date(2026, 4, 5))
		self.assertEqual(L.ostersonntag(2027), date(2027, 3, 28))

	def test_bewegliche_feiertage_2026(self):
		f = L.feiertage(2026)
		self.assertEqual(f[date(2026, 4, 6)], "Ostermontag")
		self.assertEqual(f[date(2026, 5, 14)], "Christi Himmelfahrt")
		self.assertEqual(f[date(2026, 5, 25)], "Pfingstmontag")
		self.assertEqual(f[date(2026, 6, 4)], "Fronleichnam")

	def test_feste_feiertage_2026(self):
		f = L.feiertage(2026)
		for m, t in ((1, 1), (1, 6), (5, 1), (8, 15), (10, 26), (11, 1), (12, 8), (12, 25), (12, 26)):
			self.assertIn(date(2026, m, t), f)
		self.assertEqual(len(f), 13)
		self.assertNotIn(date(2026, 4, 3), f)  # Karfreitag kein allgemeiner Feiertag
		self.assertNotIn(date(2026, 12, 24), f)

	def test_betriebsruhe(self):
		f = L.feiertage(2026, betriebsruhe=True)
		self.assertEqual(len(f), 15)
		self.assertEqual(f[date(2026, 12, 24)], "Heiliger Abend")
		self.assertEqual(f[date(2026, 12, 31)], "Silvester")


class Zeit(unittest.TestCase):
	def test_label(self):
		self.assertEqual(L.tag_label(date(2026, 10, 2)), "Fr, 2.10.")
		self.assertEqual(L.tag_label(date(2026, 9, 28)), "Mo, 28.9.")

	def test_datum_lang(self):
		self.assertEqual(L.datum_lang(datetime(2026, 10, 2, 9, 0)), "Freitag, 2. Oktober 2026 um 09:00 Uhr")

	def test_zeit_zu_minuten(self):
		self.assertEqual(L.zeit_zu_minuten("08:30"), 510)
		self.assertEqual(L.zeit_zu_minuten("8:30:00"), 510)
		self.assertEqual(L.zeit_zu_minuten(timedelta(hours=16)), 960)
		with self.assertRaises(ValueError):
			L.zeit_zu_minuten("8.30")

	def test_wien_ohne_tzdata(self):
		# Regelbasierte Umrechnung (EU-Sommerzeit), unabhängig von installierten Zeitzonendaten
		utc = timezone.utc
		self.assertEqual(L.utc_zu_wien(datetime(2026, 10, 2, 7, 0, tzinfo=utc), zone=None), datetime(2026, 10, 2, 9, 0))
		self.assertEqual(L.utc_zu_wien(datetime(2026, 12, 1, 8, 0, tzinfo=utc), zone=None), datetime(2026, 12, 1, 9, 0))
		# Umstellung 2026: 29.3. 01:00 UTC und 25.10. 01:00 UTC
		self.assertEqual(L.utc_zu_wien(datetime(2026, 3, 29, 0, 59, tzinfo=utc), zone=None), datetime(2026, 3, 29, 1, 59))
		self.assertEqual(L.utc_zu_wien(datetime(2026, 3, 29, 1, 0, tzinfo=utc), zone=None), datetime(2026, 3, 29, 3, 0))
		self.assertEqual(L.utc_zu_wien(datetime(2026, 10, 25, 1, 0, tzinfo=utc), zone=None), datetime(2026, 10, 25, 2, 0))
		self.assertEqual(L.wien_zu_utc(datetime(2026, 10, 2, 9, 0), zone=None), datetime(2026, 10, 2, 7, 0, tzinfo=utc))
		self.assertEqual(L.wien_zu_utc(datetime(2026, 1, 15, 9, 0), zone=None), datetime(2026, 1, 15, 8, 0, tzinfo=utc))

	def test_loeschstichtag(self):
		self.assertEqual(L.loeschstichtag(date(2026, 9, 30)), date(2024, 9, 30))
		self.assertEqual(L.loeschstichtag(date(2028, 2, 29)), date(2026, 2, 28))
		self.assertEqual(L.monate_zurueck(date(2026, 3, 31), 1), date(2026, 2, 28))


class Slots(unittest.TestCase):
	def test_raster(self):
		self.assertEqual(L.raster([(480, 540)], 30, 20), [480, 510])
		self.assertEqual(L.raster([(480, 540)], 30, 60), [480])
		self.assertEqual(L.raster([(480, 600), (660, 720)], 30, 30), [480, 510, 540, 570, 660, 690])

	def test_freitag_08_13(self):
		t = tag("2026-10-02")  # Fr
		self.assertEqual(t["status"], "frei")
		self.assertEqual(t["label"], "Fr, 2.10.")
		self.assertEqual(t["freie_slots"][0], "08:00")
		self.assertEqual(t["freie_slots"][-1], "12:30")  # 12:30 + 20 Min. <= 13:00
		self.assertEqual(len(t["freie_slots"]), 10)
		self.assertEqual(t["belegte_slots"], [])

	def test_montag_bis_donnerstag_08_16(self):
		t = tag("2026-10-01")  # Do
		self.assertEqual(len(t["freie_slots"]), 16)
		self.assertEqual(t["freie_slots"][-1], "15:30")
		vor_ort = tag("2026-10-08", L.VOR_ORT)
		self.assertEqual(vor_ort["freie_slots"][-1], "15:00")  # 60 Min.

	def test_eigene_zeitfenster_und_raster(self):
		e = einstellungen(
			slot_minuten=15,
			zeitfenster=[
				{"terminart": "Alle", "wochentag": "Montag", "beginn": "09:00:00", "ende": "10:00:00"},
				{"terminart": L.VIDEO, "wochentag": "Montag", "beginn": timedelta(hours=14), "ende": timedelta(hours=15)},
			],
		)
		self.assertEqual(tag("2026-10-05", L.TELEFON, e)["freie_slots"], ["09:00", "09:15", "09:30"])
		self.assertEqual(tag("2026-10-05", L.VIDEO, e)["freie_slots"], ["14:00", "14:15", "14:30"])
		self.assertEqual(tag("2026-10-06", L.TELEFON, e)["status"], "geschlossen")  # Di ohne Fenster

	def test_standard_ohne_zeilen(self):
		e = einstellungen()
		self.assertEqual(e["slot_minuten"], 30)
		self.assertEqual(e["vorlauf_minuten"], 120)
		self.assertEqual(len(e["zeitfenster"]), 5)


class Status(unittest.TestCase):
	def test_wochenende_feiertag_sperrtag(self):
		self.assertEqual(tag("2026-10-03")["status"], "geschlossen")  # Sa
		self.assertEqual(tag("2026-10-04")["status"], "geschlossen")  # So
		self.assertEqual(tag("2026-10-26")["status"], "geschlossen")  # Nationalfeiertag (Mo)
		e = einstellungen(sperrtage=[{"datum": "2026-10-07", "bis": "2026-10-08", "grund": "Messe"}])
		self.assertEqual(tag("2026-10-07", e=e)["status"], "geschlossen")
		self.assertEqual(tag("2026-10-08", e=e)["status"], "geschlossen")
		self.assertEqual(tag("2026-10-09", e=e)["status"], "frei")
		g = tag("2026-10-03")
		self.assertEqual((g["freie_slots"], g["belegte_slots"]), ([], []))

	def test_teilweise(self):
		t = tag("2026-10-02", belegungen=[belegung("2026-10-02", "09:00", "09:20")])
		self.assertEqual(t["status"], "teilweise")
		self.assertEqual(t["belegte_slots"], ["09:00"])
		self.assertNotIn("09:00", t["freie_slots"])
		# Video teilt sich das Büro: 09:00 belegt, 08:30 (bis 09:00) frei
		v = tag("2026-10-02", L.VIDEO, belegungen=[belegung("2026-10-02", "09:00", "09:20")])
		self.assertEqual(v["belegte_slots"], ["09:00"])
		self.assertIn("08:30", v["freie_slots"])
		# Vor-Ort (Außendienst) ist davon unberührt
		self.assertEqual(tag("2026-10-02", L.VOR_ORT, belegungen=[belegung("2026-10-02", "09:00", "09:20")])["status"], "frei")

	def test_kapazitaet(self):
		e = einstellungen(kapazitaet_buero=2)
		b = [belegung("2026-10-02", "09:00", "09:20")]
		self.assertEqual(tag("2026-10-02", e=e, belegungen=b)["status"], "frei")
		b.append(belegung("2026-10-02", "09:00", "09:30"))
		self.assertEqual(tag("2026-10-02", e=e, belegungen=b)["belegte_slots"], ["09:00"])

	def test_berater_kalender_blockiert_alle(self):
		b = [belegung("2026-10-08", "10:00", "11:00", pool=None)]
		self.assertIn("10:30", tag("2026-10-08", L.TELEFON, belegungen=b)["belegte_slots"])
		self.assertIn("10:00", tag("2026-10-08", L.VOR_ORT, belegungen=b)["belegte_slots"])

	def test_vor_ort_puffer(self):
		b = [belegung("2026-10-08", "10:00", "11:00", pool="aussendienst")]
		t = tag("2026-10-08", L.VOR_ORT, belegungen=b)
		self.assertIn("08:00", t["freie_slots"])  # endet 09:00 < 09:15
		for z in ("08:30", "09:00", "10:00", "11:00", "11:30"):
			self.assertIn(z, t["belegte_slots"])
		self.assertIn("12:00", t["freie_slots"])  # beginnt nach 11:45

	def test_ausgebucht(self):
		b = [belegung("2026-10-02", "08:00", "13:00")]
		t = tag("2026-10-02", belegungen=b)
		self.assertEqual(t["status"], "ausgebucht")
		self.assertEqual(t["freie_slots"], [])
		self.assertEqual(len(t["belegte_slots"]), 10)

	def test_vorlauf(self):
		jetzt = datetime(2026, 10, 2, 10, 15)  # frühestens 12:15
		t = tag("2026-10-02", jetzt=jetzt)
		self.assertEqual(t["freie_slots"], ["12:30"])
		self.assertEqual(t["status"], "frei")
		self.assertEqual(tag("2026-10-02", jetzt=datetime(2026, 10, 2, 12, 0))["status"], "geschlossen")
		self.assertEqual(tag("2026-10-01", jetzt=jetzt)["status"], "geschlossen")  # Vergangenheit

	def test_vor_ort_fruehestens_uebermorgen(self):
		jetzt = datetime(2026, 9, 30, 7, 0)
		self.assertEqual(tag("2026-10-01", L.VOR_ORT, jetzt=jetzt)["status"], "geschlossen")
		self.assertEqual(tag("2026-10-02", L.VOR_ORT, jetzt=jetzt)["status"], "frei")
		self.assertEqual(tag("2026-10-01", L.TELEFON, jetzt=jetzt)["status"], "frei")

	def test_max_tage(self):
		e = einstellungen(max_tage=7)
		self.assertEqual(tag("2026-10-07", e=e)["status"], "frei")
		self.assertEqual(tag("2026-10-08", e=e)["status"], "geschlossen")

	def test_kalender_jeder_tag(self):
		k = L.kalender(L.TELEFON, date(2026, 9, 29), date(2026, 10, 29), einstellungen(), [], datetime(2026, 9, 29, 6, 0))
		self.assertEqual(len(k), 31)
		self.assertEqual([t["datum"] for t in k[:2]], ["2026-09-29", "2026-09-30"])
		self.assertEqual(set(k[0]), {"datum", "label", "status", "freie_slots", "belegte_slots"})
		k60 = L.kalender(L.TELEFON, date(2026, 10, 1), date(2027, 3, 1), einstellungen(), [], datetime(2026, 9, 29, 6, 0))
		self.assertEqual(len(k60), 60)
		with self.assertRaises(ValueError):
			L.bereich_begrenzen(date(2026, 10, 2), date(2026, 10, 1))


class Buchung(unittest.TestCase):
	BODY = {
		"terminart": "Video-Beratung",
		"datum": "2026-10-02",
		"uhrzeit": "09:00",
		"name_komplett": "Maria Muster",
		"email": "maria@example.at",
		"telefon": "+436641234567",
		"plz": "5121",
		"thema": "Gewerbe & Industrie",
		"nachricht": "Unternehmen/Organisation: Muster GmbH\n\nHallendach 2.000 m²\n\n—\n[Herkunft] Kanal: Anzeige · Quelle: google",
		"einwilligung": 1,
		"quelle": "/termin",
		"ip_adresse": "203.0.113.7",
		"website": "",
	}

	def pruefen(self, **aenderung):
		return L.buchung_pruefen({**self.BODY, **aenderung})

	def test_gueltig(self):
		b = self.pruefen()
		self.assertEqual(b["anfrageart"], "Termin")
		self.assertEqual(b["start"], datetime(2026, 10, 2, 9, 0))
		self.assertEqual(b["ende"], datetime(2026, 10, 2, 9, 30))
		self.assertEqual(b["nachricht"], "Unternehmen/Organisation: Muster GmbH\n\nHallendach 2.000 m²")
		self.assertEqual(b["herkunft"], "Kanal: Anzeige · Quelle: google")
		self.assertEqual(b["firma"], "Muster GmbH")
		self.assertEqual(b["ip_adresse"], "203.0.113.7")

	def test_rueckruf_erkennung(self):
		b = self.pruefen(terminart=L.TELEFON, quelle="/leistungen/gewerbe")
		self.assertTrue(b["rueckruf"])
		self.assertEqual(b["anfrageart"], "Rückruf")
		self.assertEqual(b["ende"] - b["start"], timedelta(minutes=15))
		self.assertFalse(self.pruefen(terminart=L.TELEFON, quelle="/termin")["rueckruf"])
		self.assertFalse(self.pruefen(terminart=L.VIDEO, quelle="/")["rueckruf"])
		self.assertTrue(L.ist_rueckruf(L.TELEFON, "/"))

	def test_vor_ort_adresse(self):
		b = self.pruefen(terminart=L.VOR_ORT, nachricht="Adresse: Gewerbegebiet 10, 5121 Ostermiething")
		self.assertEqual(b["adresse"], "Gewerbegebiet 10, 5121 Ostermiething")

	def test_fehler(self):
		faelle = {
			"terminart": "Beratung",
			"datum": "2026-02-30",
			"uhrzeit": "9:00",
			"name_komplett": " ",
			"email": "keine-mail",
			"telefon": "+1555123456",
			"plz": "12",
			"einwilligung": 0,
		}
		for feld, wert in faelle.items():
			with self.subTest(feld=feld), self.assertRaises(L.EingabeFehler) as fehler:
				self.pruefen(**{feld: wert})
			self.assertNotIn("nicht mehr verfügbar", str(fehler.exception))

	def test_telefon(self):
		self.assertEqual(L.telefon_normalisieren("0664 123 45 67"), "+436641234567")
		self.assertEqual(L.telefon_normalisieren("0049 89 1234567"), "+49891234567")
		self.assertIsNone(L.telefon_normalisieren("+43900123456"))  # Mehrwertnummer
		self.assertIsNone(L.telefon_normalisieren("+33123456789"))  # Frankreich

	def test_einwilligung_varianten(self):
		for w in (1, "1", True, "true", "on"):
			self.assertTrue(L.einwilligung_gegeben(w))
		for w in (0, "0", False, "", None):
			self.assertFalse(L.einwilligung_gegeben(w))

	def test_ungueltige_ip_wird_leer(self):
		self.assertEqual(self.pruefen(ip_adresse="nicht-ip")["ip_adresse"], "")


class Ics(unittest.TestCase):
	def termin(self, **x):
		t = {
			"referenz": "T-2026-000123",
			"terminart": L.TELEFON,
			"rueckruf": False,
			"start": datetime(2026, 10, 2, 9, 0),
			"ende": datetime(2026, 10, 2, 9, 20),
			"telefon": "+436641234567",
			"plz": "5121",
			"adresse": "",
			"thema": "Gewerbe & Industrie",
			"nachricht": "Dach; 2.000 m², Süd\n\n—\n[Herkunft] Kanal: Anzeige · Kampagne: herbst",
		}
		t.update(x)
		return L.termin_ics(t, datetime(2026, 9, 30, 10, 0, tzinfo=timezone.utc))

	def test_aufbau(self):
		ics = self.termin()
		self.assertTrue(ics.startswith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n"))
		self.assertTrue(ics.endswith("END:VCALENDAR\r\n"))
		self.assertNotIn("\n", ics.replace("\r\n", ""))
		for zeile in (
			"BEGIN:VTIMEZONE",
			"TZID:Europe/Vienna",
			"BEGIN:VEVENT",
			"UID:T-2026-000123@oekovolt.com",
			"DTSTAMP:20260930T100000Z",
			"DTSTART;TZID=Europe/Vienna:20261002T090000",
			"DTEND;TZID=Europe/Vienna:20261002T092000",
			"STATUS:CONFIRMED",
			"END:VEVENT",
		):
			self.assertIn(zeile + "\r\n", ics)
		self.assertEqual(ics.count("BEGIN:VEVENT"), 1)

	def test_ohne_herkunft_und_escaped(self):
		ics = self.termin()
		entfaltet = ics.replace("\r\n ", "")
		self.assertNotIn("[Herkunft]", entfaltet)
		self.assertNotIn("herbst", entfaltet)
		self.assertIn("Dach\\; 2.000 m²\\, Süd", entfaltet)
		self.assertIn("Buchungsnummer: T-2026-000123", entfaltet)

	def test_zeilen_max_75_oktette(self):
		ics = self.termin(nachricht="Ä" * 200)
		for zeile in ics.split("\r\n"):
			self.assertLessEqual(len(zeile.encode("utf-8")), 75, zeile)
		self.assertIn("Ä" * 200, ics.replace("\r\n ", ""))

	def test_orte(self):
		self.assertIn("LOCATION:Video-Beratung", self.termin(terminart=L.VIDEO))
		vor_ort = self.termin(terminart=L.VOR_ORT, adresse="Gewerbegebiet 10, 5121 Ostermiething").replace("\r\n ", "")
		self.assertIn("LOCATION:Gewerbegebiet 10\\, 5121 Ostermiething", vor_ort)
		self.assertIn("SUMMARY:Rückruf von Ökovolt", self.termin(rueckruf=True))

	def test_nachricht_zerlegen(self):
		self.assertEqual(L.nachricht_zerlegen("[Herkunft] Kanal: Direkt"), ("", "Kanal: Direkt"))
		self.assertEqual(L.nachricht_zerlegen("Hallo\n\n—\n[Herkunft] Kanal: Direkt"), ("Hallo", "Kanal: Direkt"))
		self.assertEqual(L.nachricht_zerlegen("Hallo"), ("Hallo", ""))

	def test_referenz_format(self):
		self.assertEqual(L.referenz_format(2026, 123), "T-2026-000123")


if __name__ == "__main__":
	unittest.main(verbosity=2)
