#!/usr/bin/env python3
# Copyright (c) 2026, ÖKOVOLT
#
# Ablauf-Test Lead-Gate mit E-Mail-Bestätigung (Welle A11, Spezifikation #17–#19) OHNE Frappe-Installation:
#   python tests/test_rechner_lead.py        (aus apps/oekovolt_app)
#
# Eine kleine Frappe-Attrappe (Speicher, Mails, Drossel, Zeit) prüft website_api/rechner.py durchgehend:
# submit_rechner_lead -> Bestätigungsmail mit Token (nur Hash gespeichert) -> bestaetige_lead -> Ergebnis-Mail,
# einmal verwendbar, Ablauf nach 24 h, „Erneut senden“ (60 s, Abgleich E-Mail), Honeypot, Drossel, Löschjob.
# Die reinen Funktionen (Scoring, PLZ, Mails, Token) prüft tests/pruefe_vertrag.py.

import importlib
import re
import sys
import types
import unittest
from datetime import datetime, timedelta
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(APP))


class _Dict(dict):
	__getattr__ = dict.get
	__setattr__ = dict.__setitem__


class _Fehler(Exception):
	pass


class _Zuviel(_Fehler):
	pass


class Attrappe:
	"""Gerade so viel Frappe, wie rechner.py und helfer.py brauchen."""

	def __init__(self):
		self.jetzt = datetime(2026, 10, 12, 9, 0)
		self.daten = {}          # name -> dict
		self.mails = []
		self.zaehler = {}
		self.nummer = 0
		self.conf = _Dict()
		self.form_dict = _Dict()
		self.rollen = ["Website API"]
		self.geloescht = []

	# ---- Modul bauen
	def module(self):
		fr = types.ModuleType("frappe")
		a = self
		fr.conf = a.conf
		fr.form_dict = a.form_dict
		fr.session = _Dict(user="website-api@oekovolt.com")
		fr.PermissionError = type("PermissionError", (_Fehler,), {})
		fr.TooManyRequestsError = _Zuviel
		fr.ValidationError = _Fehler
		fr._ = lambda t: t
		fr.whitelist = lambda **kw: (lambda fn: fn)
		fr.get_roles = lambda: list(a.rollen)

		def throw(text, exc=None, title=None):
			raise (exc or _Fehler)(text)

		fr.throw = throw
		fr.log_error = lambda **kw: None
		fr.logger = lambda *x, **k: _Dict(info=lambda t: a.mails.append({"log": t}))

		class Cache:
			def make_key(self, k):
				return k

			def incr(self, k):
				a.zaehler[k] = a.zaehler.get(k, 0) + 1
				return a.zaehler[k]

			def expire(self, k, s):
				pass

		fr.cache = lambda: Cache()
		fr.sendmail = lambda **kw: a.mails.append(kw)

		class Doc:
			def __init__(self, werte):
				object.__setattr__(self, "werte", dict(werte))
				object.__setattr__(self, "flags", _Dict())

			def __getattr__(self, k):
				return self.werte.get(k)

			def __setattr__(self, k, v):
				self.werte[k] = v

			def as_dict(self):
				return _Dict(self.werte)

			def get(self, k, d=None):
				return self.werte.get(k, d)

			def insert(self, ignore_permissions=False):
				a.nummer += 1
				self.werte["name"] = f"RL-2026-{a.nummer:05d}"
				self.werte["creation"] = a.jetzt
				self.werte.setdefault("bestaetigt", 0)  # Check-Standardwert wie in Frappe
				a.daten[self.werte["name"]] = dict(self.werte)
				a.letzte_flags = dict(self.flags)
				return self

			def reload(self):
				self.werte.update(a.daten[self.werte["name"]])

		def get_doc(arg, name=None):
			if isinstance(arg, dict):
				return Doc(arg)
			return Doc(a.daten[name])

		fr.get_doc = get_doc

		def passt(row, filters):
			for k, v in (filters or {}).items():
				if isinstance(v, list) and v[0] == "<":
					if not row.get(k) < v[1]:
						return False
				elif row.get(k) != v:
					return False
			return True

		def get_all(doctype, filters=None, fields=None, pluck=None, limit=None):
			if doctype != "Rechner Lead":
				return []
			rows = [r for r in a.daten.values() if passt(r, filters)]
			if pluck:
				return [r[pluck] for r in rows]
			return [_Dict({f: r.get(f) for f in fields}) for r in rows][: limit or None]

		fr.get_all = get_all
		fr.delete_doc = lambda dt, name, **kw: (a.geloescht.append(name), a.daten.pop(name, None))

		class Db:
			def get_value(self, dt, name, felder, as_dict=False):
				row = a.daten.get(name)
				if row is None:
					return None
				if isinstance(felder, str):
					return row.get(felder)
				return _Dict({f: row.get(f) for f in felder})

			def set_value(self, dt, name, werte, update_modified=True):
				a.daten[name].update(werte)

			def commit(self):
				pass

			def rollback(self):
				pass

			def delete(self, *args):
				pass

			def exists(self, *args):
				return False

		fr.db = Db()

		utils = types.ModuleType("frappe.utils")
		utils.cint = lambda v: int(float(v or 0))
		utils.now_datetime = lambda: a.jetzt
		utils.add_days = lambda d, n: d + timedelta(days=n)
		utils.getdate = lambda d=None: (d or a.jetzt).date() if isinstance(d or a.jetzt, datetime) else d
		utils.validate_email_address = lambda e: e
		fr.utils = utils
		rl = types.ModuleType("frappe.rate_limiter")
		rl.rate_limit = lambda **kw: (lambda fn: fn)
		return {"frappe": fr, "frappe.utils": utils, "frappe.rate_limiter": rl}


BODY = {
	"kennung": "gewerbe-pv", "aktion": "pdf", "vorname": "Lena", "nachname": "Gruber", "email": "lena@gruber.at",
	"telefon": "0664 1112223", "kontakt_ok": 1, "plz": "5121", "firma": "Gruber Metall GmbH",
	"ergebnis": {"kwp": 420}, "ergebnis_text": "420 kWp", "ergebnis_link": "/rechner/gewerbe-pv?r=abc",
	"rueckkehr": "/rechner/gewerbe-pv", "bestaetigung": "double-opt-in", "ip_adresse": "203.0.113.5", "website": "",
}


class LeadGateAblauf(unittest.TestCase):
	def setUp(self):
		self.a = Attrappe()
		self.alt = {k: sys.modules.get(k) for k in ("frappe", "frappe.utils", "frappe.rate_limiter")}
		sys.modules.update(self.a.module())
		for name in ("oekovolt_app.website_api.helfer", "oekovolt_app.website_api.rechner"):
			sys.modules.pop(name, None)
		self.r = importlib.import_module("oekovolt_app.website_api.rechner")

	def tearDown(self):
		for k, v in self.alt.items():
			if v is None:
				sys.modules.pop(k, None)
			else:
				sys.modules[k] = v
		for name in ("oekovolt_app.website_api.helfer", "oekovolt_app.website_api.rechner"):
			sys.modules.pop(name, None)

	def aufruf(self, fn, **body):
		self.a.form_dict.clear()
		self.a.form_dict.update(body)
		return fn()

	def token_aus_mail(self, mail):
		m = re.search(r"/freischalten\?token=([A-Za-z0-9_-]+)", mail["message"])
		self.assertIsNotNone(m, "Bestätigungslink fehlt in der Mail")
		return m.group(1)

	# ---------------------------------------------------------------- Tests

	def test_double_opt_in_komplett(self):
		antwort = self.aufruf(self.r.submit_rechner_lead, **BODY)
		self.assertEqual(antwort, {"ok": True, "lead_id": "RL-2026-00001", "bestaetigung": "gesendet"})
		lead = self.a.daten["RL-2026-00001"]
		self.assertEqual(lead["telefon"], "+436641112223")
		self.assertTrue(self.a.letzte_flags.get("lead_eingang_aufschieben"), "Aufschub-Flag für lead_eingang (A06)")
		self.assertEqual(len(self.a.mails), 1)
		mail = self.a.mails[0]
		self.assertEqual(mail["recipients"], ["lena@gruber.at"])
		self.assertIn("bestätigen", mail["subject"])
		token = self.token_aus_mail(mail)
		self.assertNotIn(token, str(lead), "Klartext-Token darf nicht gespeichert werden")
		self.assertEqual(len(lead["bestaetigungs_token"]), 64)
		self.assertEqual(lead["token_gueltig_bis"], self.a.jetzt + timedelta(hours=24))
		self.assertNotIn("Gruber Metall", mail["message"], "kein Freitext in der Kundenmail")

		self.a.jetzt += timedelta(hours=23)
		ok = self.aufruf(self.r.bestaetige_lead, token=token, ip_adresse="203.0.113.5")
		self.assertEqual(ok, {"ok": True, "lead_id": "RL-2026-00001", "kennung": "gewerbe-pv", "rueckkehr": "/rechner/gewerbe-pv"})
		self.assertEqual(self.a.daten["RL-2026-00001"]["bestaetigt"], 1)
		ergebnis = self.a.mails[-1]
		self.assertIn("Gewerbe-PV-Rechner", ergebnis["subject"])
		self.assertIn("RL-2026-00001", ergebnis["subject"])
		self.assertIn("https://www.oekovolt.com/rechner/gewerbe-pv?r=abc", ergebnis["message"])

		zweit = self.aufruf(self.r.bestaetige_lead, token=token)
		self.assertFalse(zweit["ok"])
		self.assertEqual(zweit["grund"], "verwendet")
		self.assertEqual(zweit["rueckkehr"], "/rechner/gewerbe-pv")
		self.assertEqual(len(self.a.mails), 2, "zweiter Klick verschickt nichts")

	def test_website_token_wird_uebernommen(self):
		# Integration Welle A: die Website signiert den Token selbst (leadGateServer.js) und prüft ihn auf /freischalten
		web = "eyJ0IjoibGcxIiwiayI6Imdld2VyYmUtcHYifQ." + "a" * 64
		antwort = self.aufruf(self.r.submit_rechner_lead, **BODY, bestaetigungs_link=f"https://phish.example/freischalten?token={web}")
		self.assertTrue(antwort["ok"])
		mail = self.a.mails[0]["message"]
		self.assertIn(f"/freischalten?token={web}", mail)
		self.assertNotIn("phish.example", mail, "Link-Basis kommt immer aus oekovolt_website_url")
		ok = self.aufruf(self.r.bestaetige_lead, token=web)
		self.assertTrue(ok["ok"])
		self.assertEqual(self.a.daten["RL-2026-00001"]["bestaetigt"], 1)

	def test_ablauf_nach_24_stunden(self):
		self.aufruf(self.r.submit_rechner_lead, **BODY)
		token = self.token_aus_mail(self.a.mails[0])
		self.a.jetzt += timedelta(hours=24, seconds=1)
		antwort = self.aufruf(self.r.bestaetige_lead, token=token)
		self.assertEqual((antwort["ok"], antwort["grund"]), (False, "abgelaufen"))
		self.assertNotIn("lead_id", antwort)
		self.assertEqual(self.a.daten["RL-2026-00001"].get("bestaetigt"), 0)

	def test_ungueltige_tokens(self):
		self.aufruf(self.r.submit_rechner_lead, **BODY)
		for token in ("", "abc", "x" * 43, "' OR 1=1 --" * 4):
			antwort = self.aufruf(self.r.bestaetige_lead, token=token)
			self.assertEqual((antwort["ok"], antwort["grund"]), (False, "ungueltig"), token)

	def test_erneut_senden(self):
		self.aufruf(self.r.submit_rechner_lead, **BODY)
		alt = self.token_aus_mail(self.a.mails[0])
		zu_frueh = self.aufruf(self.r.sende_bestaetigung, lead="RL-2026-00001", email="lena@gruber.at")
		self.assertEqual(zu_frueh, {"ok": True, "gesendet": False})
		self.a.jetzt += timedelta(seconds=61)
		fremd = self.aufruf(self.r.sende_bestaetigung, lead="RL-2026-00001", email="angreifer@example.at")
		self.assertEqual(fremd, {"ok": True, "gesendet": False}, "fremde E-Mail: nichts senden, nichts verraten")
		unbekannt = self.aufruf(self.r.sende_bestaetigung, lead="RL-2026-99999", email="lena@gruber.at")
		self.assertEqual(unbekannt, {"ok": True, "gesendet": False})
		ok = self.aufruf(self.r.sende_bestaetigung, lead="RL-2026-00001", email="Lena@Gruber.at")
		self.assertEqual(ok, {"ok": True, "gesendet": True})
		neu = self.token_aus_mail(self.a.mails[-1])
		self.assertNotEqual(alt, neu)
		self.assertEqual(self.aufruf(self.r.bestaetige_lead, token=alt)["grund"], "ungueltig", "altes Token ist ersetzt")
		self.assertTrue(self.aufruf(self.r.bestaetige_lead, token=neu)["ok"])
		danach = self.aufruf(self.r.sende_bestaetigung, lead="RL-2026-00001", email="lena@gruber.at")
		self.assertEqual(danach, {"ok": True, "gesendet": False, "bestaetigt": True})

	def test_ohne_bestaetigung_sofort_ergebnis(self):
		antwort = self.aufruf(self.r.submit_rechner_lead, **{**BODY, "bestaetigung": "", "kontakt_ok": 0})
		self.assertEqual(antwort["bestaetigung"], "nicht_noetig")
		self.assertEqual(len(self.a.mails), 1)
		self.assertIn("Ihr Ergebnis", self.a.mails[0]["subject"])
		self.assertEqual(self.a.daten["RL-2026-00001"]["telefon"], "", "ohne kontakt_ok kein Telefon gespeichert")
		self.assertFalse(self.a.letzte_flags.get("lead_eingang_aufschieben"))

	def test_honeypot_und_rollen(self):
		antwort = self.aufruf(self.r.submit_rechner_lead, **{**BODY, "website": "http://spam"})
		self.assertEqual(antwort["lead_id"], None)
		self.assertEqual(self.a.daten, {})
		self.a.rollen = ["Guest"]
		with self.assertRaises(_Fehler):
			self.aufruf(self.r.submit_rechner_lead, **BODY)

	def test_ungueltige_eingabe_zaehlt_nicht_zur_drossel(self):
		for _ in range(10):
			with self.assertRaises(_Fehler):
				self.aufruf(self.r.submit_rechner_lead, **{**BODY, "email": "kaputt"})
		self.assertEqual(self.a.zaehler, {}, "abgelehnte Anfragen zählen nicht")
		for _ in range(5):
			self.aufruf(self.r.submit_rechner_lead, **{**BODY, "bestaetigung": ""})
		with self.assertRaises(_Zuviel):
			self.aufruf(self.r.submit_rechner_lead, **{**BODY, "bestaetigung": ""})
		self.assertTrue(all("lena" not in k for k in self.a.zaehler), "Drossel je E-Mail ohne Klartext im Schlüssel")

	def test_keine_kundenmail_schalter(self):
		self.a.conf.update(oekovolt_keine_kundenmail=1, developer_mode=1)
		antwort = self.aufruf(self.r.submit_rechner_lead, **BODY)
		self.assertEqual(antwort["bestaetigung"], "aus")
		self.assertTrue(all("recipients" not in m for m in self.a.mails))
		self.assertTrue(any("freischalten?token=" in m.get("log", "") for m in self.a.mails), "Link im Entwicklermodus nur im Log")

	def test_unbestaetigte_nach_30_tagen_loeschen(self):
		self.aufruf(self.r.submit_rechner_lead, **BODY)                                  # RL-1: unbestätigt
		self.aufruf(self.r.submit_rechner_lead, **{**BODY, "bestaetigung": ""})          # RL-2: ohne DOI
		self.aufruf(self.r.submit_rechner_lead, **{**BODY, "email": "zwei@gruber.at"})   # RL-3: wird bestätigt
		self.aufruf(self.r.bestaetige_lead, token=self.token_aus_mail(self.a.mails[-1]))
		self.a.jetzt += timedelta(days=29)
		self.r.unbestaetigte_loeschen()
		self.assertEqual(self.a.geloescht, [])
		self.a.jetzt += timedelta(days=2)
		self.r.unbestaetigte_loeschen()
		self.assertEqual(self.a.geloescht, ["RL-2026-00001"])


if __name__ == "__main__":
	unittest.main(verbosity=1)
