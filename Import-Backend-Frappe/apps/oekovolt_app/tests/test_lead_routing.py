# Tests Speed-to-Lead II (Welle A06) – reine Funktionen aus website_api/lead_eingang.py und sla.py,
# OHNE Frappe/Bench lauffähig:
#   python tests/test_lead_routing.py        (im Ordner apps/oekovolt_app)
#   python -m unittest discover -s tests -v
#
# Geschäftszeiten und Feiertage kommen ausschließlich aus termin_logik.py (Mo–Do 08–16, Fr 08–13,
# Feiertage Österreich inkl. 24./31.12.). Die Module importieren frappe nur, wenn es vorhanden ist.

import importlib
import json
import sys
import unittest
from datetime import date, datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from oekovolt_app.website_api import lead_eingang as E  # noqa: E402
from oekovolt_app.website_api import sla as S  # noqa: E402
from oekovolt_app.website_api import termin_logik as L  # noqa: E402


def dt(text):
	return datetime.fromisoformat(text)


# ================================================================ SLA / Geschäftsminuten


class Geschaeftsminuten(unittest.TestCase):
	def test_innerhalb_eines_tages(self):
		# Mittwoch 01.10.2026 (Werktag)
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-01T09:00"), 60), dt("2026-10-01T10:00"))

	def test_vor_oeffnung_beginnt_bei_oeffnung(self):
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-01T06:15"), 30), dt("2026-10-01T08:30"))

	def test_freitag_1130_plus_60_bleibt_freitag(self):
		# Fr 08–13 laut termin_logik: 11:30 + 60 = 12:30 (noch vor Schluss)
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-02T11:30"), 60), dt("2026-10-02T12:30"))

	def test_freitag_1230_plus_60_ist_montag_0830(self):
		# 30 Minuten bis Freitag 13:00, Rest 30 Minuten ab Montag 08:00 -> Montag 08:30 (Wochenende übersprungen)
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-02T12:30"), 60), dt("2026-10-05T08:30"))

	def test_nach_schluss_beginnt_naechster_werktag(self):
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-02T15:00"), 15), dt("2026-10-05T08:15"))

	def test_feiertag_wird_uebersprungen(self):
		# Nationalfeiertag Montag 26.10.2026: Freitag 23.10. 12:45 + 30 -> 15 Min. Freitag, Rest Dienstag 27.10. 08:15
		self.assertTrue(L.feiertag_am(date(2026, 10, 26)))
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-23T12:45"), 30), dt("2026-10-27T08:15"))

	def test_wochenende_und_feiertag_hintereinander(self):
		# Sa 24.10., So 25.10., Mo 26.10. (Feiertag): Eingang Samstag -> Dienstag 09:00
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-10-24T10:00"), 60), dt("2026-10-27T09:00"))

	def test_betriebsruhe_24_12(self):
		# 24.12.2026 ist Donnerstag, Betriebsruhe laut termin_logik; 25./26.12. Feiertage; 28.12. Montag
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-12-23T15:30"), 60), dt("2026-12-28T08:30"))

	def test_sperrtag_aus_termin_einstellungen(self):
		e = L.einstellungen_normalisieren({"sperrtage": [{"datum": "2026-10-01", "bis": "2026-10-02", "grund": "Betriebsausflug"}]})
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-09-30T15:30"), 60), dt("2026-10-01T08:30"))
		self.assertEqual(S.geschaeftsminuten_addieren(dt("2026-09-30T15:30"), 60, e), dt("2026-10-05T08:30"))

	def test_zwischen(self):
		self.assertEqual(S.geschaeftsminuten_zwischen(dt("2026-10-01T09:00"), dt("2026-10-01T09:45")), 45)
		self.assertEqual(S.geschaeftsminuten_zwischen(dt("2026-10-02T12:30"), dt("2026-10-05T08:30")), 60)
		self.assertEqual(S.geschaeftsminuten_zwischen(dt("2026-10-03T10:00"), dt("2026-10-04T18:00")), 0)
		self.assertEqual(S.geschaeftsminuten_zwischen(dt("2026-10-01T18:00"), dt("2026-10-02T07:00")), 0)
		self.assertEqual(S.geschaeftsminuten_zwischen(dt("2026-10-01T15:00"), dt("2026-10-02T09:00")), 120)
		self.assertEqual(S.geschaeftsminuten_zwischen(dt("2026-10-01T10:00"), dt("2026-10-01T09:00")), 0)

	def test_zwischen_ist_umkehrung_von_addieren(self):
		for start, minuten in ((dt("2026-10-02T12:30"), 60), (dt("2026-10-23T12:45"), 30), (dt("2026-10-01T09:00"), 240)):
			ziel = S.geschaeftsminuten_addieren(start, minuten)
			self.assertEqual(S.geschaeftsminuten_zwischen(start, ziel), minuten)


class SlaFristen(unittest.TestCase):
	def test_klasse_a_60_geschaeftsminuten(self):
		self.assertEqual(S.sla_frist("A", dt("2026-10-02T12:30")), dt("2026-10-05T08:30"))

	def test_klasse_b_4_geschaeftsstunden(self):
		# Donnerstag 14:00 + 240: 120 bis 16:00, Rest 120 ab Freitag 08:00 -> 10:00
		self.assertEqual(S.sla_frist("B", dt("2026-10-01T14:00")), dt("2026-10-02T10:00"))

	def test_klasse_c_naechster_werktag_10_uhr(self):
		self.assertEqual(S.sla_frist("C", dt("2026-10-01T09:00")), dt("2026-10-02T10:00"))
		self.assertEqual(S.sla_frist("C", dt("2026-10-02T09:00")), dt("2026-10-05T10:00"))  # Freitag -> Montag
		self.assertEqual(S.sla_frist("C", dt("2026-10-23T09:00")), dt("2026-10-27T10:00"))  # vor Nationalfeiertag
		self.assertEqual(S.sla_frist("", dt("2026-10-01T09:00")), dt("2026-10-02T10:00"))  # unbekannt = C

	def test_eskalationsstufen(self):
		self.assertEqual(S.eskalationsstufe(0), 0)
		self.assertEqual(S.eskalationsstufe(14), 0)
		self.assertEqual(S.eskalationsstufe(15), 1)
		self.assertEqual(S.eskalationsstufe(59), 1)
		self.assertEqual(S.eskalationsstufe(60), 2)
		self.assertEqual(S.eskalationsstufe(600), 2)

	def test_jede_stufe_nur_einmal(self):
		self.assertEqual(S.faellige_stufen(20, []), [1])
		self.assertEqual(S.faellige_stufen(20, ["Eskalation Stufe 1: 17 Geschäftsminuten …"]), [])
		self.assertEqual(S.faellige_stufen(75, ["Eskalation Stufe 1: 17 …"]), [2])
		self.assertEqual(S.faellige_stufen(75, []), [1, 2])
		self.assertEqual(S.faellige_stufen(75, ["Eskalation Stufe 1 …", "Eskalation Stufe 2 …"]), [])
		self.assertEqual(S.eskaliert_bis(["irgendein Kommentar", None]), 0)

	def test_erstreaktion_erkannt(self):
		self.assertTrue(S.erstreaktion_erkannt("Neu", "Kontaktversuch"))
		self.assertTrue(S.erstreaktion_erkannt("Neu", "In Bearbeitung"))
		self.assertTrue(S.erstreaktion_erkannt("Neu", "Bestätigt"))
		self.assertFalse(S.erstreaktion_erkannt("Neu", "Neu"))
		self.assertFalse(S.erstreaktion_erkannt("Neu", "Spam"))
		self.assertFalse(S.erstreaktion_erkannt("Kontaktversuch", "Qualifiziert"))

	def test_reaktionszeit(self):
		self.assertEqual(S.reaktionszeit(dt("2026-10-02T12:30"), dt("2026-10-05T08:45")), 75)


# ================================================================ Routing / Vertretung


def regel(**w):
	basis = {
		"name": "LRR-001", "aktiv": 1, "reihenfolge": 100, "doctype_filter": "", "segment": "", "bundesland": "",
		"plz_von": "", "plz_bis": "", "mindest_klasse": "", "benutzer": "anna@oekovolt.at",
		"vertretung": "bernd@oekovolt.at", "rolle_fallback": "Vertrieb",
	}
	basis.update(w)
	return basis


LEAD = {"doctype": "Angebotsanfrage", "segment": "Gewerbe & Industrie", "bundesland": "Salzburg", "plz": "5121", "lead_klasse": "A"}


class Routing(unittest.TestCase):
	def test_leere_filter_passen_immer(self):
		self.assertTrue(E.regel_passt(regel(), LEAD))
		self.assertTrue(E.regel_passt(regel(), {**LEAD, "segment": "Privat", "lead_klasse": "C", "plz": None}))

	def test_inaktive_regel(self):
		self.assertFalse(E.regel_passt(regel(aktiv=0), LEAD))

	def test_filter(self):
		self.assertTrue(E.regel_passt(regel(doctype_filter="Angebotsanfrage"), LEAD))
		self.assertFalse(E.regel_passt(regel(doctype_filter="Kontaktanfrage"), LEAD))
		self.assertTrue(E.regel_passt(regel(segment="Gewerbe & Industrie"), LEAD))
		self.assertFalse(E.regel_passt(regel(segment="Landwirtschaft"), LEAD))
		self.assertTrue(E.regel_passt(regel(bundesland="Salzburg"), LEAD))
		self.assertFalse(E.regel_passt(regel(bundesland="Tirol"), LEAD))

	def test_plz_bereich(self):
		self.assertTrue(E.regel_passt(regel(plz_von="5000", plz_bis="5999"), LEAD))
		self.assertFalse(E.regel_passt(regel(plz_von="6000", plz_bis="6999"), LEAD))
		self.assertFalse(E.regel_passt(regel(plz_von="5000", plz_bis="5999"), {**LEAD, "plz": ""}))
		self.assertTrue(E.regel_passt(regel(plz_von="5121", plz_bis="5121"), LEAD))

	def test_mindest_klasse(self):
		self.assertTrue(E.klasse_erfuellt("A", "B"))
		self.assertTrue(E.klasse_erfuellt("B", "B"))
		self.assertFalse(E.klasse_erfuellt("C", "B"))
		self.assertTrue(E.klasse_erfuellt("C", ""))
		self.assertTrue(E.klasse_erfuellt("C", "C"))
		self.assertFalse(E.regel_passt(regel(mindest_klasse="A"), {**LEAD, "lead_klasse": "B"}))

	def test_erste_passende_nach_reihenfolge(self):
		regeln = [
			regel(name="LRR-003", reihenfolge=300),
			regel(name="LRR-002", reihenfolge=200, segment="Landwirtschaft"),
			regel(name="LRR-001", reihenfolge=100, bundesland="Tirol"),
			regel(name="LRR-004", reihenfolge=200, benutzer="carla@oekovolt.at"),
		]
		gewaehlt = E.regel_waehlen(regeln, LEAD)
		self.assertEqual(gewaehlt["name"], "LRR-004")  # 200 vor 300, Landwirtschaft passt nicht, Tirol passt nicht
		self.assertIsNone(E.regel_waehlen([regel(aktiv=0)], LEAD))

	def test_abwesenheit_einschliesslich(self):
		heute = date(2026, 10, 12)
		self.assertTrue(E.ist_abwesend(date(2026, 10, 12), heute))
		self.assertTrue(E.ist_abwesend("2026-10-20", heute))
		self.assertTrue(E.ist_abwesend(datetime(2026, 10, 15, 8), heute))
		self.assertFalse(E.ist_abwesend(date(2026, 10, 11), heute))
		self.assertFalse(E.ist_abwesend(None, heute))
		self.assertFalse(E.ist_abwesend("kein-datum", heute))

	def test_vertretung_bei_abwesenheit(self):
		heute = date(2026, 10, 12)
		r = regel()
		wahl = E.zustaendige_bestimmen(r, {}, heute)
		self.assertEqual((wahl["zustaendig"], wahl["vertretung"], wahl["rolle"]), ("anna@oekovolt.at", "bernd@oekovolt.at", None))

		wahl = E.zustaendige_bestimmen(r, {"anna@oekovolt.at": date(2026, 10, 16)}, heute)
		self.assertEqual((wahl["zustaendig"], wahl["vertretung"], wahl["rolle"]), ("bernd@oekovolt.at", None, None))
		self.assertIn("Vertretung", wahl["grund"])

		wahl = E.zustaendige_bestimmen(r, {"anna@oekovolt.at": date(2026, 10, 16), "bernd@oekovolt.at": "2026-10-12"}, heute)
		self.assertEqual((wahl["zustaendig"], wahl["vertretung"], wahl["rolle"]), (None, None, "Vertrieb"))

		# Abwesenheit abgelaufen -> wieder der Zuständige
		wahl = E.zustaendige_bestimmen(r, {"anna@oekovolt.at": date(2026, 10, 11)}, heute)
		self.assertEqual(wahl["zustaendig"], "anna@oekovolt.at")

	def test_regel_ohne_benutzer_nur_rolle(self):
		wahl = E.zustaendige_bestimmen(regel(benutzer="", vertretung=""), {}, date(2026, 10, 12))
		self.assertEqual((wahl["zustaendig"], wahl["rolle"]), (None, "Vertrieb"))


# ================================================================ Dubletten


def kandidat(name, creation, status="Neu", email="max@firma.at", telefon="0664 1234567", zustaendig=None, doctype="Kontaktanfrage"):
	return {"doctype": doctype, "name": name, "creation": creation, "status": status, "email": email, "telefon": telefon, "zustaendig": zustaendig}


class Dubletten(unittest.TestCase):
	JETZT = dt("2026-10-12T10:00")

	def test_fenster_30_tage(self):
		kandidaten = [
			kandidat("KA-2026-00001", self.JETZT - timedelta(days=31)),  # außerhalb
			kandidat("KA-2026-00002", self.JETZT - timedelta(days=29)),  # innerhalb
			kandidat("KA-2026-00003", self.JETZT - timedelta(days=1), email="anders@firma.at", telefon="0699 999"),
			kandidat("KA-2026-00009", self.JETZT - timedelta(hours=1)),
		]
		treffer = E.dubletten_finden(kandidaten, "max@firma.at", "+436641234567", "KA-2026-00009", self.JETZT)
		self.assertEqual([t["name"] for t in treffer], ["KA-2026-00002"])

	def test_telefon_e164_gleich_trotz_schreibweise(self):
		kandidaten = [
			kandidat("AA-2026-00005", self.JETZT - timedelta(days=3), email="privat@gmx.at", telefon="+43 664 123 45 67", doctype="Angebotsanfrage"),
			kandidat("AA-2026-00006", self.JETZT - timedelta(days=2), email="privat@gmx.at", telefon="0043664/1234567", doctype="Angebotsanfrage"),
		]
		treffer = E.dubletten_finden(kandidaten, "max@firma.at", "+436641234567", "KA-2026-00010", self.JETZT)
		self.assertEqual([t["name"] for t in treffer], ["AA-2026-00005", "AA-2026-00006"])  # älteste zuerst

	def test_email_schluessel_gross_klein(self):
		kandidaten = [kandidat("KA-2026-00007", self.JETZT - timedelta(days=5), email="Max@Firma.AT", telefon="")]
		treffer = E.dubletten_finden(kandidaten, E.lead_schluessel("max@firma.at"), None, "KA-2026-00011", self.JETZT)
		self.assertEqual(len(treffer), 1)

	def test_ohne_schluessel_und_telefon_keine_treffer(self):
		kandidaten = [kandidat("KA-2026-00007", self.JETZT - timedelta(days=5), email="", telefon="")]
		self.assertEqual(E.dubletten_finden(kandidaten, None, None, "KA-2026-00011", self.JETZT), [])

	def test_creation_als_text(self):
		kandidaten = [kandidat("KA-2026-00008", "2026-10-10 09:15:00.123456")]
		treffer = E.dubletten_finden(kandidaten, "max@firma.at", None, "x", self.JETZT)
		self.assertEqual(treffer[0]["creation"], dt("2026-10-10T09:15:00"))

	def test_offener_erst_lead(self):
		treffer = [
			kandidat("KA-1", self.JETZT - timedelta(days=20), status="Verloren"),
			kandidat("KA-2", self.JETZT - timedelta(days=10), status="In Bearbeitung", zustaendig="anna@oekovolt.at"),
			kandidat("KA-3", self.JETZT - timedelta(days=1)),
		]
		self.assertEqual(E.offener_erst_lead(treffer)["name"], "KA-2")
		self.assertIsNone(E.offener_erst_lead([kandidat("KA-1", self.JETZT, status="Spam")]))

	def test_fruehere_anfragen_text_und_html(self):
		treffer = E.dubletten_finden(
			[kandidat("KA-2026-00002", dt("2026-09-20T08:00"), status="In Bearbeitung", zustaendig="anna@oekovolt.at")],
			"max@firma.at", None, "x", self.JETZT,
		)
		text = E.fruehere_anfragen_text(treffer)
		self.assertEqual(text, "Kontaktanfrage KA-2026-00002 · 20.09.2026 · Status In Bearbeitung · zuständig anna@oekovolt.at")
		html = E.fruehere_anfragen_html(treffer, lambda d, n: f"https://backoffice/app/{d}/{n}")
		self.assertIn("Frühere Anfragen", html)
		self.assertIn("https://backoffice/app/Kontaktanfrage/KA-2026-00002", html)
		self.assertEqual(E.fruehere_anfragen_html([], lambda d, n: ""), "")


# ================================================================ Segment, Betreff, Empfänger


class SegmentUndMail(unittest.TestCase):
	def test_segment_bleibt_wenn_gesetzt(self):
		self.assertEqual(E.segment_ableiten({"segment": "Landwirtschaft", "thema": "Bewerbung"}), "Landwirtschaft")

	def test_segment_aus_thema(self):
		self.assertEqual(E.segment_ableiten({"thema": "Bewerbung als Monteur"}), "Bewerbung")
		self.assertEqual(E.segment_ableiten({"thema": "Presseanfrage"}), "Presse")
		self.assertEqual(E.segment_ableiten({"thema": "Störung an bestehender Anlage"}), "Service")
		self.assertEqual(E.segment_ableiten({"thema": "Lieferant/Partner"}), "Partner")
		self.assertEqual(E.segment_ableiten({"gebaeudetyp": "Gewerbe"}), "Gewerbe & Industrie")
		self.assertEqual(E.segment_ableiten({"gebaeudetyp": "Landwirtschaft"}), "Landwirtschaft")
		self.assertEqual(E.segment_ableiten({"gebaeudetyp": "Einfamilienhaus"}), "Privat")
		self.assertEqual(E.segment_ableiten({"rechner": "gewerbe-pv"}), "Gewerbe & Industrie")
		self.assertEqual(E.segment_ableiten({"thema": "Gemeinde Fuschl"}), "Gemeinde & öffentliche Hand")
		self.assertEqual(E.segment_ableiten({"thema": "Agri-PV am Hof"}), "Freifläche/Agri-PV")
		self.assertEqual(E.segment_ableiten({}), "Sonstiges")

	def test_eigene_spuren(self):
		self.assertEqual(E.eigene_spur("Service"), "Service")
		self.assertEqual(E.eigene_spur("Bewerbung"), "Personal")
		self.assertEqual(E.eigene_spur("Presse"), "Marketing")
		self.assertIsNone(E.eigene_spur("Gewerbe & Industrie"))

	def test_betreff(self):
		self.assertEqual(E.betreff_mit_klasse("A", "Angebotsanfrage: Gewerbe – Muster GmbH"), "[A] Angebotsanfrage: Gewerbe – Muster GmbH")
		self.assertEqual(E.betreff_mit_klasse("", "Kontaktanfrage: x"), "Kontaktanfrage: x")
		self.assertEqual(E.betreff_mit_klasse("X", "Kontaktanfrage: x"), "Kontaktanfrage: x")

	def test_empfaenger(self):
		self.assertEqual(E.sammelpostfach("vertrieb@oekovolt.at"), ["vertrieb@oekovolt.at"])
		self.assertEqual(E.sammelpostfach(["a@x.at", "", None]), ["a@x.at"])
		self.assertEqual(E.sammelpostfach(None), [])
		self.assertEqual(
			E.empfaenger_zusammenstellen("anna@oekovolt.at", "anna@oekovolt.at", ["vertrieb@oekovolt.at", "anna@oekovolt.at", ""]),
			["anna@oekovolt.at", "vertrieb@oekovolt.at"],
		)
		self.assertEqual(E.empfaenger_zusammenstellen(None, None, []), [])


# ================================================================ Alarm ohne Personendaten


class Alarm(unittest.TestCase):
	LEAD = {
		"doctype": "Angebotsanfrage", "name": "AA-2026-00042", "lead_klasse": "A", "segment": "Gewerbe & Industrie",
		"bundesland": "Oberösterreich", "plz": "5121", "sla_bis": dt("2026-10-12T11:00"),
		# Personendaten, die NICHT in der Nutzlast landen dürfen
		"vorname": "Max", "nachname": "Mustermann", "firma": "Muster Metall GmbH", "email": "max@muster-metall.at",
		"telefon": "+436641234567", "strasse_hausnummer": "Gewerbestraße 1", "ort": "Ostermiething",
		"nachricht": "Bitte um Angebot für 300 kWp", "ip_adresse": "203.0.113.7",
	}

	def test_nutzlast_ohne_personendaten(self):
		nutzlast = E.alarm_nutzlast(self.LEAD, "https://backoffice.oekovolt.com/app/angebotsanfrage/AA-2026-00042")
		self.assertTrue(E.nutzlast_ohne_personendaten(nutzlast, self.LEAD))
		roh = json.dumps(nutzlast, ensure_ascii=False).lower()
		for wert in ("max", "mustermann", "muster metall", "max@muster-metall.at", "436641234567", "gewerbestraße", "ostermiething", "203.0.113.7", "300 kwp"):
			self.assertNotIn(wert, roh, wert)
		for feld in E.PERSONENFELDER:
			self.assertNotIn(feld, nutzlast)
		self.assertEqual(set(nutzlast), {"text", "klasse", "segment", "bezirk", "doctype", "name", "link", "sla_bis"})
		self.assertEqual(nutzlast["klasse"], "A")
		self.assertEqual(nutzlast["bezirk"], "Oberösterreich · PLZ-Gebiet 51xx")
		self.assertIn("Erstreaktion bis 12.10. 11:00", nutzlast["text"])
		self.assertIn("AA-2026-00042", nutzlast["text"])

	def test_schutz_erkennt_personendaten(self):
		nutzlast = E.alarm_nutzlast(self.LEAD, "https://backoffice/app/x")
		self.assertFalse(E.nutzlast_ohne_personendaten({**nutzlast, "email": "max@muster-metall.at"}, self.LEAD))
		self.assertFalse(E.nutzlast_ohne_personendaten({**nutzlast, "text": "Lead von Max Mustermann"}, self.LEAD))

	def test_bezirk_text(self):
		self.assertEqual(E.bezirk_text("Salzburg", "5020"), "Salzburg · PLZ-Gebiet 50xx")
		self.assertEqual(E.bezirk_text(None, "5020"), "PLZ-Gebiet 50xx")
		self.assertEqual(E.bezirk_text("Tirol", ""), "Tirol")
		self.assertEqual(E.bezirk_text("", ""), "ohne Ortsangabe")


# ================================================================ Konfiguration / Fixtures


class KonfigurationUndFixtures(unittest.TestCase):
	APP = Path(__file__).resolve().parents[1] / "oekovolt_app"

	def test_hooks_fixtures_filtern_auf_genaue_namen(self):
		text = (self.APP / "hooks.py").read_text(encoding="utf-8")
		ns = {}
		exec(compile(text, "hooks.py", "exec"), ns)  # hooks.py ist reine Konfiguration ohne Frappe-Import
		rollen = json.loads((self.APP / "fixtures" / "role.json").read_text(encoding="utf-8"))
		self.assertEqual(sorted(r["name"] for r in rollen), sorted(ns["ROLLEN_FIXTURE"]))
		for pflicht in ("Vertrieb", "Vertriebsleitung", "Service", "Personal", "Einkauf", "Marketing", "Geschäftsführung", "Monitoring"):
			self.assertIn(pflicht, ns["ROLLEN_FIXTURE"])
		scripts = json.loads((self.APP / "fixtures" / "client_script.json").read_text(encoding="utf-8"))
		self.assertEqual(sorted(s["name"] for s in scripts), sorted(ns["CLIENT_SCRIPTS_FIXTURE"]))
		self.assertEqual(sorted(s["dt"] for s in scripts), sorted(E.LEAD_DOCTYPES))
		for s in scripts:
			self.assertIn("oekovolt_app.website_api.sla.angerufen", s["script"])
			self.assertIn(f"frappe.ui.form.on('{s['dt']}'", s["script"])
		felder = json.loads((self.APP / "fixtures" / "custom_field.json").read_text(encoding="utf-8"))
		self.assertEqual([(f["name"], f["dt"], f["fieldname"], f["fieldtype"]) for f in felder], [("User-abwesend_bis", "User", "abwesend_bis", "Date")])
		for eintrag in ns["fixtures"]:
			self.assertEqual(eintrag["filters"][0][:2], ["name", "in"])
		for dt_ in E.LEAD_DOCTYPES:
			self.assertEqual(ns["doc_events"][dt_]["after_insert"], "oekovolt_app.website_api.lead_eingang.after_insert")
			self.assertEqual(ns["doc_events"][dt_]["on_update"], "oekovolt_app.website_api.sla.erstreaktion_setzen")
		self.assertEqual(ns["scheduler_events"]["cron"]["*/5 * * * *"], ["oekovolt_app.website_api.sla.pruefen"])

	def test_doctype_lead_routing_regel(self):
		pfad = self.APP / "oekovolt_app" / "doctype" / "lead_routing_regel" / "lead_routing_regel.json"
		dt_ = json.loads(pfad.read_text(encoding="utf-8"))
		felder = {f["fieldname"] for f in dt_["fields"]}
		for pflicht in ("aktiv", "reihenfolge", "doctype_filter", "segment", "bundesland", "plz_von", "plz_bis", "mindest_klasse", "benutzer", "vertretung", "rolle_fallback"):
			self.assertIn(pflicht, felder)
		rechte = {p["role"]: p for p in dt_["permissions"]}
		self.assertEqual(rechte["Vertriebsleitung"].get("write"), 1)
		self.assertEqual(rechte["Vertrieb"].get("read"), 1)
		self.assertFalse(rechte["Vertrieb"].get("write"))
		self.assertEqual(dt_["module"], "Oekovolt App")


# ================================================================ Ablauf after_insert mit Frappe-Attrappe
#
# Prüft den ganzen Eingangsablauf (lead_eingang._verarbeiten) ohne Bench: Eine kleine Attrappe des
# Pakets `frappe` wird nur eingehängt, wenn das echte Frappe fehlt. Abnahme: Ohne oekovolt_routing_aktiv
# geht die Team-Mail wie bisher an die Rolle (ohne feste Empfängerliste); mit Schalter an Zuständigen,
# Vertretung und Sammelpostfach; Dubletten lösen keine zweite Team-Mail aus; A-Leads lösen den Alarm aus.

import types


def _werfen(msg, *a, **k):
	raise Exception(msg)


def _frappe_attrappe():
	"""Minimales `frappe`-Paket für lead_eingang/sla/helfer/termin (nur die genutzten Aufrufe)."""
	fr = types.ModuleType("frappe")
	fr.protokoll = {"set_value": [], "get_doc": [], "enqueue": [], "log_error": [], "assign": []}
	fr.daten = {"get_all": {}, "get_value": {}, "felder": set(), "exists": set()}
	fr.conf = {}
	fr.session = types.SimpleNamespace(user="anna@oekovolt.at")
	fr.request = None
	fr.PermissionError = type("PermissionError", (Exception,), {})
	fr.TooManyRequestsError = type("TooManyRequestsError", (Exception,), {})
	fr.ValidationError = type("ValidationError", (Exception,), {})
	fr._ = lambda t: t
	fr.whitelist = lambda *a, **k: (lambda f: f)
	fr.throw = _werfen
	fr.log_error = lambda title=None, message=None: fr.protokoll["log_error"].append(title)
	fr.get_roles = lambda *a: ["Vertrieb"]
	fr.cache = lambda: None
	fr.enqueue = lambda fn, **kw: fr.protokoll["enqueue"].append((getattr(fn, "__name__", fn), kw))
	fr.has_permission = lambda *a, **k: True
	fr.sendmail = lambda **kw: None

	class Meta:
		def __init__(self, doctype):
			self.doctype = doctype

		def has_field(self, feld):
			if self.doctype == "User":
				return feld == "abwesend_bis" and "User.abwesend_bis" in fr.daten["felder"]
			return feld in fr.daten["felder"]

		def get_field(self, feld):
			return types.SimpleNamespace(options="Neu\nKontaktversuch\nQualifiziert")

	fr.get_meta = lambda doctype: Meta(doctype)
	fr.get_cached_doc = lambda *a, **k: _werfen("kein Dokument")

	class Doc(dict):
		def insert(self, **kw):
			fr.protokoll["get_doc"].append(dict(self))
			return self

	fr.get_doc = lambda d: Doc(d)

	def get_all(doctype, filters=None, fields=None, pluck=None, limit=None, order_by=None):
		zeilen = list(fr.daten["get_all"].get(doctype, []))
		if pluck:
			return [z.get(pluck) for z in zeilen]
		return [_Dict(z) for z in zeilen]

	fr.get_all = get_all

	db = types.SimpleNamespace()
	db.exists = lambda doctype, name=None: (name if name else doctype) in fr.daten["exists"]
	db.get_value = lambda doctype, name, feld=None, **k: fr.daten["get_value"].get((doctype, name, feld))
	db.get_single_value = lambda doctype, feld: fr.daten["get_value"].get((doctype, doctype, feld))
	db.set_value = lambda doctype, name, werte, *a, **k: fr.protokoll["set_value"].append((doctype, name, werte))
	db.commit = lambda: None
	db.rollback = lambda: None
	fr.db = db

	utils = types.ModuleType("frappe.utils")
	utils.cint = lambda v: int(v or 0)
	utils.now_datetime = lambda: fr.jetzt
	utils.get_datetime = lambda v: v if isinstance(v, datetime) else datetime.fromisoformat(str(v)[:19])
	utils.getdate = lambda v=None: fr.jetzt.date()
	utils.add_days = lambda d, n: d + timedelta(days=n)
	utils.get_system_timezone = lambda: "Europe/Vienna"
	utils.get_url_to_form = lambda doctype, name: f"https://backoffice.test/app/{doctype.lower().replace(' ', '-')}/{name}"
	utils.cstr = lambda v: "" if v is None else str(v)
	utils.escape_html = lambda v: str(v)
	utils.validate_email_address = lambda v, throw=False: v if "@" in str(v) else None
	fr.utils = utils

	rl = types.ModuleType("frappe.rate_limiter")
	rl.rate_limit = lambda **kw: (lambda f: f)
	desk = types.ModuleType("frappe.desk")
	form = types.ModuleType("frappe.desk.form")
	assign_to = types.ModuleType("frappe.desk.form.assign_to")
	assign_to.add = lambda args: fr.protokoll["assign"].append(args)
	return fr, {"frappe": fr, "frappe.utils": utils, "frappe.rate_limiter": rl, "frappe.desk": desk, "frappe.desk.form": form, "frappe.desk.form.assign_to": assign_to}


class _Dict(dict):
	"""frappe._dict-Ersatz: Attribut- und Schlüsselzugriff."""

	def __getattr__(self, k):
		return self.get(k)


class _Lead:
	"""Document-Ersatz."""

	def __init__(self, doctype, name, **felder):
		self.doctype, self.name = doctype, name
		self.creation = felder.pop("creation", datetime(2026, 10, 12, 9, 0))
		self.felder = felder

	def get(self, k, d=None):
		return self.felder.get(k, d)

	def as_dict(self):
		return {"doctype": self.doctype, "name": self.name, "creation": self.creation, **self.felder}

	def update(self, werte):
		self.felder.update(werte)


@unittest.skipIf(E.frappe is not None, "echtes Frappe vorhanden – Attrappe nicht nötig")
class AblaufMitFrappeAttrappe(unittest.TestCase):
	FELDER = {
		"segment", "bundesland", "lead_score", "lead_klasse", "score_gruende", "lead_schluessel", "eingang_am",
		"fruehere_anfragen", "sla_bis", "zustaendig", "erstreaktion_am", "reaktionszeit_min", "status", "User.abwesend_bis",
	}

	def setUp(self):
		self.fr, module = _frappe_attrappe()
		self.fr.jetzt = datetime(2026, 10, 12, 9, 0)  # Montag 09:00 Wien
		self.fr.daten["felder"] = set(self.FELDER)
		self.fr.daten["exists"] = {"Kontaktanfrage", "Angebotsanfrage", "Lead Routing Regel", "User", "anna@oekovolt.at", "bernd@oekovolt.at"}
		self._alt = {k: sys.modules.get(k) for k in module}
		sys.modules.update(module)
		for name in ("oekovolt_app.website_api.helfer", "oekovolt_app.website_api.termin"):
			sys.modules.pop(name, None)
		E.frappe, S.frappe = self.fr, self.fr
		# importlib statt `from … import helfer`: Letzteres gäbe das alte Paket-Attribut zurück, nicht den Neuimport
		helfer = importlib.import_module("oekovolt_app.website_api.helfer")
		importlib.import_module("oekovolt_app.website_api.termin")

		self.mails = []
		helfer.team_benachrichtigen = lambda betreff, html, doctype, name, reply_to=None, rolle="Vertrieb", empfaenger=None: self.mails.append(
			{"betreff": betreff, "html": html, "doctype": doctype, "name": name, "rolle": rolle, "empfaenger": empfaenger}
		)
		self.alt_score = E.lead_score
		E.lead_score = lambda daten, quelle: (82, "A", ["Segment B2B", f"Quelle {quelle}"])

	def tearDown(self):
		E.lead_score = self.alt_score
		E.frappe, S.frappe = None, None
		for k, v in self._alt.items():
			if v is None:
				sys.modules.pop(k, None)
			else:
				sys.modules[k] = v
		for name in ("oekovolt_app.website_api.helfer", "oekovolt_app.website_api.termin"):
			sys.modules.pop(name, None)

	def lead(self, **felder):
		basis = {"status": "Neu", "vorname": "Max", "nachname": "Mustermann", "email": "max@muster-metall.at",
			"telefon": "0664 1234567", "plz": "5121", "ort": "Ostermiething", "gebaeudetyp": "Gewerbe", "vorhaben": "[]",
			"nachricht": "Bitte um Angebot"}
		basis.update(felder)
		return _Lead("Angebotsanfrage", "AA-2026-00042", **basis)

	def gesetzt(self):
		werte = {}
		for _dt, _name, w in self.fr.protokoll["set_value"]:
			werte.update(w)
		return werte

	def test_ohne_schalter_wie_bisher(self):
		"""Abnahme: oekovolt_routing_aktiv fehlt -> Team-Mail an die Rolle, keine Empfängerliste, keine Zuweisung."""
		self.fr.daten["get_all"]["Lead Routing Regel"] = [regel()]
		doc = self.lead()
		E.after_insert(doc)
		self.assertEqual(self.fr.protokoll["log_error"], [])
		self.assertEqual(len(self.mails), 1)
		mail = self.mails[0]
		self.assertIsNone(mail["empfaenger"])
		self.assertEqual(mail["rolle"], "Vertrieb")
		self.assertTrue(mail["betreff"].startswith("[A] Angebotsanfrage:"), mail["betreff"])
		self.assertIn("Lead-Klasse", mail["html"])
		self.assertNotIn("Frühere Anfragen", mail["html"])
		self.assertEqual(self.fr.protokoll["assign"], [])
		werte = self.gesetzt()
		self.assertEqual(werte["segment"], "Gewerbe & Industrie")
		self.assertEqual((werte["lead_score"], werte["lead_klasse"]), (82, "A"))
		self.assertEqual(werte["lead_schluessel"], "max@muster-metall.at")
		self.assertEqual(werte["eingang_am"], self.fr.jetzt)
		self.assertEqual(werte["sla_bis"], datetime(2026, 10, 12, 10, 0))  # A: 60 Geschäftsminuten
		self.assertNotIn("zustaendig", werte)
		# Alarm: Webhook nur, wenn konfiguriert
		self.assertEqual(self.fr.protokoll["enqueue"], [])

	def test_mit_schalter_routing_und_alarm(self):
		self.fr.conf.update({"oekovolt_routing_aktiv": 1, "oekovolt_benachrichtigung_an": ["vertrieb@oekovolt.at"],
			"oekovolt_alarm_webhook": "https://hooks.example/teams"})
		self.fr.daten["get_all"]["Lead Routing Regel"] = [regel(bundesland="", plz_von="5000", plz_bis="5999", mindest_klasse="B")]
		doc = self.lead()
		E.after_insert(doc)
		self.assertEqual(self.fr.protokoll["log_error"], [])
		self.assertEqual(self.mails[0]["empfaenger"], ["anna@oekovolt.at", "bernd@oekovolt.at", "vertrieb@oekovolt.at"])
		self.assertEqual(self.gesetzt()["zustaendig"], "anna@oekovolt.at")
		self.assertEqual(self.fr.protokoll["assign"][0]["assign_to"], ["anna@oekovolt.at"])
		self.assertEqual(self.fr.protokoll["assign"][0]["priority"], "High")
		fn, kw = self.fr.protokoll["enqueue"][0]
		self.assertEqual(fn, "webhook_senden")
		self.assertEqual(kw["url"], "https://hooks.example/teams")
		self.assertTrue(E.nutzlast_ohne_personendaten(kw["nutzlast"], doc.as_dict()))
		self.assertNotIn("Mustermann", json.dumps(kw["nutzlast"]))

	def test_mit_schalter_vertretung_bei_abwesenheit(self):
		self.fr.conf.update({"oekovolt_routing_aktiv": 1})
		self.fr.daten["get_all"]["Lead Routing Regel"] = [regel()]
		self.fr.daten["get_value"][("User", "anna@oekovolt.at", "abwesend_bis")] = date(2026, 10, 20)
		E.after_insert(self.lead())
		self.assertEqual(self.gesetzt()["zustaendig"], "bernd@oekovolt.at")
		self.assertEqual(self.mails[0]["empfaenger"], ["bernd@oekovolt.at"])

	def test_dublette_keine_zweite_mail(self):
		self.fr.conf.update({"oekovolt_routing_aktiv": 1})
		self.fr.daten["get_all"]["Kontaktanfrage"] = [{
			"name": "KA-2026-00007", "creation": datetime(2026, 10, 5, 10, 0), "status": "In Bearbeitung",
			"email": "MAX@muster-metall.at", "telefon": "", "zustaendig": "carla@oekovolt.at",
		}]
		E.after_insert(self.lead())
		self.assertEqual(self.fr.protokoll["log_error"], [])
		self.assertEqual(self.mails, [])  # nicht doppelt benachrichtigen
		werte = self.gesetzt()
		self.assertEqual(werte["zustaendig"], "carla@oekovolt.at")  # gleiche Zuständigkeit
		self.assertIn("Kontaktanfrage KA-2026-00007", werte["fruehere_anfragen"])
		kommentare = [d for d in self.fr.protokoll["get_doc"] if d.get("doctype") == "Comment"]
		self.assertEqual((kommentare[0]["reference_doctype"], kommentare[0]["reference_name"]), ("Kontaktanfrage", "KA-2026-00007"))
		glocken = [d for d in self.fr.protokoll["get_doc"] if d.get("doctype") == "Notification Log"]
		self.assertEqual(glocken[0]["for_user"], "carla@oekovolt.at")

	def test_abgeschlossener_erst_lead_ist_keine_dublette(self):
		self.fr.daten["get_all"]["Kontaktanfrage"] = [{
			"name": "KA-2026-00001", "creation": datetime(2026, 10, 1, 10, 0), "status": "Verloren",
			"email": "max@muster-metall.at", "telefon": "", "zustaendig": None,
		}]
		E.after_insert(self.lead())
		self.assertEqual(len(self.mails), 1)
		self.assertIn("Frühere Anfragen", self.mails[0]["html"])
		self.assertIn("KA-2026-00001", self.mails[0]["html"])

	def test_eigene_spur_ohne_alarm(self):
		self.fr.conf.update({"oekovolt_routing_aktiv": 1, "oekovolt_alarm_webhook": "https://hooks.example/teams"})
		self.fr.daten["get_all"]["Lead Routing Regel"] = [regel()]
		doc = _Lead("Kontaktanfrage", "KA-2026-00099", status="Neu", vorname="Eva", nachname="Beispiel",
			email="eva@example.at", telefon="", plz="4020", thema="Bewerbung als Monteurin", nachricht="Lebenslauf anbei")
		E.after_insert(doc)
		self.assertEqual(self.fr.protokoll["log_error"], [])
		self.assertEqual(self.mails[0]["rolle"], "Personal")
		self.assertIsNone(self.mails[0]["empfaenger"])
		self.assertEqual(self.fr.protokoll["assign"], [])
		self.assertEqual(self.fr.protokoll["enqueue"], [])
		self.assertNotIn("sla_bis", self.gesetzt())

	def test_erstreaktion_ueber_statuswechsel(self):
		doc = self.lead(status="Kontaktversuch", eingang_am=datetime(2026, 10, 12, 8, 30))
		doc.get_doc_before_save = lambda: _Dict({"status": "Neu"})
		S.erstreaktion_setzen(doc)
		werte = self.gesetzt()
		self.assertEqual(werte["erstreaktion_am"], self.fr.jetzt)
		self.assertEqual(werte["reaktionszeit_min"], 30)
		# zweiter Aufruf ändert nichts mehr
		anzahl = len(self.fr.protokoll["set_value"])
		doc.get_doc_before_save = lambda: _Dict({"status": "Kontaktversuch"})
		S.erstreaktion_setzen(doc)
		self.assertEqual(len(self.fr.protokoll["set_value"]), anzahl)

	def test_eskalation_nur_vertriebsspur_und_einmal(self):
		self.fr.conf.update({"oekovolt_eskalation_an": ["gf@oekovolt.at"]})
		self.fr.daten["exists"] |= {"Rechner Lead", "Solarrechner Anfrage", "Website Termin"}
		self.fr.daten["get_all"]["Angebotsanfrage"] = [
			{"name": "AA-1", "eingang_am": datetime(2026, 10, 12, 7, 30), "status": "Neu", "segment": "Gewerbe & Industrie",
				"zustaendig": "anna@oekovolt.at", "bundesland": "Salzburg", "plz": "5020", "lead_klasse": "A"},
			{"name": "AA-2", "eingang_am": datetime(2026, 10, 12, 7, 30), "status": "Neu", "segment": "Service",
				"zustaendig": None, "bundesland": "", "plz": "", "lead_klasse": "A"},
		]
		S.pruefen()  # jetzt 09:00 -> 60 Geschäftsminuten seit 08:00 -> Stufe 1 und 2
		self.assertEqual(self.fr.protokoll["log_error"], [])
		self.assertEqual([m["name"] for m in self.mails], ["AA-1", "AA-1"])
		self.assertIn("Stufe 1", self.mails[0]["betreff"])
		self.assertIn("gf@oekovolt.at", self.mails[1]["empfaenger"])
		marker = [d["content"] for d in self.fr.protokoll["get_doc"] if d.get("doctype") == "Comment"]
		self.assertEqual(len(marker), 2)
		self.assertEqual(S.faellige_stufen(60, marker), [])


if __name__ == "__main__":
	unittest.main(verbosity=2)
