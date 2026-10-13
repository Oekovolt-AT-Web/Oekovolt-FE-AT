# Tests der reinen Freigabe-Logik (ohne Frappe/Bench):
#   python oekovolt_app/oekovolt_app/doctype/referenz_freigabe/test_freigabe_logik.py   (im Ordner apps/oekovolt_app)

import importlib.util
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path

_PFAD = Path(__file__).resolve().parent / "freigabe_logik.py"
_spec = importlib.util.spec_from_file_location("freigabe_logik", _PFAD)
L = importlib.util.module_from_spec(_spec)
sys.modules["freigabe_logik"] = L
_spec.loader.exec_module(L)

JETZT = datetime(2026, 10, 11, 12, 0)


class Token(unittest.TestCase):
	def test_token_form_und_hash(self):
		t = L.token_erzeugen()
		self.assertTrue(L.token_gueltig(t))
		self.assertEqual(len(t), 43)
		self.assertEqual(len(L.token_hash(t)), 64)
		self.assertNotEqual(L.token_erzeugen(), t)
		for schlecht in ("", None, "abc", "x" * 44, "ä" * 43, "a b" + "c" * 40):
			self.assertFalse(L.token_gueltig(schlecht), repr(schlecht))

	def test_links(self):
		self.assertEqual(L.freigabe_url("https://www.oekovolt.com/", "abc"), "https://www.oekovolt.com/referenzen/freigabe/abc")
		self.assertEqual(L.widerruf_url("https://www.oekovolt.com", "abc"), "https://www.oekovolt.com/referenzen/freigabe/abc?widerruf=1")
		self.assertEqual(L.gueltig_bis(JETZT), JETZT + timedelta(days=30))


class Eingaben(unittest.TestCase):
	def test_ip_kuerzel(self):
		self.assertEqual(L.ip_kuerzel("193.80.12.77"), "193.80.12.0")
		self.assertEqual(L.ip_kuerzel("2a02:8388:1a40:abcd::1"), "2a02:8388:1a40::")
		self.assertEqual(L.ip_kuerzel("kaputt"), "")
		self.assertEqual(L.ip_kuerzel(""), "")

	def test_auswahl_pflicht_vertretungsbefugnis(self):
		with self.assertRaises(L.EingabeFehler):
			L.auswahl_pruefen({"name": True})
		with self.assertRaises(L.EingabeFehler):
			L.auswahl_pruefen("kein json")
		with self.assertRaises(L.EingabeFehler):
			L.auswahl_pruefen("[1,2]")

	def test_auswahl_nichts_vorangekreuzt(self):
		d = L.auswahl_pruefen({"vertretungsbefugnis_bestaetigt": True})
		for feld in L.SCHALTER:
			self.assertEqual(d[feld], 0, feld)
		self.assertEqual(d["zitat_text"], "")
		self.assertEqual(d["vertretungsbefugnis_bestaetigt"], 1)

	def test_auswahl_einzeln(self):
		d = L.auswahl_pruefen('{"vertretungsbefugnis_bestaetigt":"1","plakette":true,"messwerte":"ja","name":0,"text_version":"2026-10-11-v1"}')
		self.assertEqual(d["freigabe_plakette"], 1)
		self.assertEqual(d["freigabe_messwerte"], 1)
		self.assertEqual(d["freigabe_name"], 0)
		self.assertEqual(d["freigabe_logo"], 0)
		self.assertEqual(d["text_version"], "2026-10-11-v1")

	def test_zitat_braucht_text_und_person(self):
		basis = {"vertretungsbefugnis_bestaetigt": True, "zitat": True}
		with self.assertRaises(L.EingabeFehler):
			L.auswahl_pruefen({**basis, "zitat_text": "kurz"})
		with self.assertRaises(L.EingabeFehler):
			L.auswahl_pruefen({**basis, "zitat_text": "Die Anlage läuft seit dem ersten Tag zuverlässig."})
		d = L.auswahl_pruefen({**basis, "zitat_text": "  Die Anlage läuft\x00 seit dem ersten Tag zuverlässig.  ", "zitat_person_funktion": "M. Muster, Geschäftsführung"})
		self.assertEqual(d["freigabe_zitat"], 1)
		self.assertEqual(d["zitat_text"], "Die Anlage läuft seit dem ersten Tag zuverlässig.")
		self.assertEqual(d["zitat_person_funktion"], "M. Muster, Geschäftsführung")
		# ohne Zitat-Häkchen wird ein mitgeschickter Text verworfen
		d2 = L.auswahl_pruefen({"vertretungsbefugnis_bestaetigt": True, "zitat_text": "Trotzdem geschickt, aber nicht freigegeben."})
		self.assertEqual(d2["zitat_text"], "")

	def test_email(self):
		self.assertTrue(L.email_gueltig("m.muster@firma.at"))
		self.assertFalse(L.email_gueltig("muster@firma"))
		self.assertFalse(L.email_gueltig(""))


class Status(unittest.TestCase):
	def doc(self, **w):
		d = {"token_hash": "abc", "gueltig_bis": JETZT + timedelta(days=1), "freigegeben_am": None, "widerrufen_am": None}
		d.update(w)
		return d

	def test_status_reihenfolge(self):
		self.assertEqual(L.status(self.doc(), JETZT), L.STATUS_OFFEN)
		self.assertEqual(L.status(self.doc(gueltig_bis=JETZT - timedelta(minutes=1)), JETZT), L.STATUS_ABGELAUFEN)
		self.assertEqual(L.status(self.doc(token_hash=None), JETZT), L.STATUS_EINGELOEST)
		self.assertEqual(L.status(self.doc(token_hash=None, freigegeben_am=JETZT), JETZT), L.STATUS_FREIGEGEBEN)
		self.assertEqual(L.status(self.doc(freigegeben_am=JETZT, widerrufen_am=JETZT), JETZT), L.STATUS_WIDERRUFEN)
		self.assertEqual(L.status(self.doc(gueltig_bis="2026-10-12 10:00:00"), JETZT), L.STATUS_OFFEN)

	def test_link_offen_und_wirksam(self):
		self.assertTrue(L.link_offen(self.doc(), JETZT))
		self.assertFalse(L.link_offen(self.doc(freigegeben_am=JETZT), JETZT))
		self.assertFalse(L.link_offen(self.doc(gueltig_bis=JETZT - timedelta(days=1)), JETZT))
		self.assertTrue(L.ist_wirksam(self.doc(token_hash=None, freigegeben_am=JETZT), JETZT))
		self.assertFalse(L.ist_wirksam(self.doc(token_hash=None, freigegeben_am=JETZT, widerrufen_am=JETZT), JETZT))
		self.assertFalse(L.ist_wirksam(self.doc(), JETZT))


class Antworten(unittest.TestCase):
	def test_fuer_seite_ohne_email(self):
		doc = {
			"email": "geheim@firma.at",
			"token_hash": "abc",
			"kunde_firma": "Muster GmbH",
			"ansprechperson": "M. Muster",
			"funktion": "GF",
			"gueltig_bis": JETZT + timedelta(days=3),
			"text_version": "",
		}
		a = L.fuer_seite(doc, {"projekt_name": "Halle", "ort": "Linz", "jahr": 2025, "leistung": 120.5, "projekt_website_name": "halle"}, JETZT)
		self.assertNotIn("email", a)
		self.assertNotIn("token_hash", a)
		self.assertEqual(a["status"], "offen")
		self.assertEqual(a["gueltig_bis"], "2026-10-14")
		self.assertEqual(a["projekt"], {"titel": "Halle", "ort": "Linz", "jahr": 2025, "kwp": 120.5, "slug": "halle"})
		self.assertEqual(L.fuer_seite({**doc, "token_hash": None, "freigegeben_am": JETZT}, None, JETZT)["status"], "freigegeben")

	def test_fuer_website_ohne_email_und_zitat_nur_mit_freigabe(self):
		doc = {
			"email": "geheim@firma.at",
			"token_hash": None,
			"ip_kuerzel": "1.2.3.0",
			"freigabe_name": 1,
			"freigabe_logo": 0,
			"freigabe_zitat": 0,
			"freigabe_fotos_anlage": 1,
			"freigabe_plakette": 1,
			"freigabe_livedaten": 0,
			"freigabe_messwerte": 1,
			"zitat_text": "Nicht freigegebenes Zitat",
			"zitat_person_funktion": "X",
			"freigegeben_am": JETZT,
			"text_version": "2026-10-11-v1",
		}
		e = L.fuer_website(doc, "halle")
		self.assertEqual(e["projekt_website_name"], "halle")
		for verboten in ("email", "token_hash", "ip_kuerzel", "widerruf_token_hash"):
			self.assertNotIn(verboten, e)
		self.assertEqual(e["freigabe_name"], 1)
		self.assertEqual(e["freigabe_plakette"], 1)
		self.assertEqual(e["zitat_text"], "")
		self.assertEqual(e["freigegeben_am"], "2026-10-11")
		mit = L.fuer_website({**doc, "freigabe_zitat": 1}, "halle")
		self.assertEqual(mit["zitat_text"], "Nicht freigegebenes Zitat")

	def test_mails(self):
		daten = {"ansprechperson": "M. <Muster>", "kunde_firma": "Muster & Co", "funktion": "GF", "freigabe_zitat": 1, "zitat_text": "Läuft.", "zitat_person_funktion": "M. Muster", "freigegeben_am": JETZT, "text_version": "v1"}
		betreff, html = L.bestaetigung_mail(daten, "https://www.oekovolt.com/referenzen/freigabe/t?widerruf=1", "Halle")
		self.assertIn("Halle", betreff)
		self.assertIn("M. &lt;Muster&gt;", html)
		self.assertIn("?widerruf=1", html)
		self.assertIn("ohne Gegenleistung", html)
		self.assertIn("Zitat: <b>ja</b>", html)
		self.assertIn("Firmenlogo: <b>nein</b>", html)
		b2, h2 = L.team_mail(daten, "Halle", "https://backoffice/app/referenz-freigabe/RF-1")
		self.assertIn("Muster &amp; Co", h2)
		b3, h3 = L.widerruf_mail(daten, "Halle", "https://backoffice/app/referenz-freigabe/RF-1")
		self.assertIn("WIDERRUFEN", b3)


if __name__ == "__main__":
	unittest.main(verbosity=1)
