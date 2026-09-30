# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
# Controller des DocTypes "Hinweis" – setzt die Fristen des österreichischen HSchG automatisch.
#
# Fristen laut HSchG, BGBl. I Nr. 6/2023 (RIS, Fassung vom 30.09.2026; §§ 8, 9 und 13 seit 25.02.2023 unverändert):
#  - § 9 Abs. 1: Eingang schriftlicher Hinweise „unverzüglich, spätestens jedoch nach sieben Kalendertagen“ bestätigen
#    (außer bei ausdrücklichem Verzicht oder wenn die Bestätigung die Identität gefährden würde).
#  - § 13 Abs. 9: Rückmeldung „spätestens drei Monate nach Entgegennahme eines Hinweises“ – die Frist läuft also ab
#    EINGANG, nicht ab der Eingangsbestätigung (anders als Art. 9 Abs. 1 lit. f der Richtlinie (EU) 2019/1937).
#  - § 8 Abs. 11: Aufbewahrung fünf Jahre ab letztmaliger Verarbeitung oder Übermittlung (hier: Abschluss).
# Website-Texte dazu: src/data/hinweisgeber.js (ABLAUF, FAQ_INFO, FRISTEN_TEXT) – bei Änderungen beide anpassen.

import frappe
from frappe.model.document import Document
from frappe.utils import add_days, add_months, add_years, getdate, now_datetime


def fristen_ab_eingang(eingang):
	"""(Eingangsbestätigung fällig, Rückmeldung fällig) als Datum – beide ab Eingang des Hinweises.

	§ 9 Abs. 1 HSchG: Bestätigung spätestens nach 7 Kalendertagen.
	§ 13 Abs. 9 HSchG: Rückmeldung spätestens 3 Monate nach Entgegennahme (Monatsende wird von add_months begrenzt,
	z. B. 30.11. + 3 Monate = 28./29.02.)."""
	tag = getdate(eingang)
	return add_days(tag, 7), add_months(tag, 3)


class Hinweis(Document):
	def before_insert(self):
		# Von der Meldestelle manuell angelegte Fälle (Post, Telefon, Gespräch)
		# bekommen ebenfalls eine Fall-Nummer. Einen Postfach-Zugang gibt es
		# dafür nicht – die Kommunikation läuft über den vereinbarten Weg.
		if not self.referenz:
			from oekovoltdeutchland.oekovoltdeutchland.doctype.hinweis.api import _neue_referenz

			self.referenz = _neue_referenz()
		if not self.quelle:
			self.quelle = "Website"
		jetzt = now_datetime()
		self.eingegangen_am = jetzt
		self.status = self.status or "Eingegangen"
		self.bestaetigung_faellig, self.rueckmeldung_faellig = fristen_ab_eingang(jetzt)

	def validate(self):
		jetzt = now_datetime()

		if self.status != "Eingegangen" and not self.eingang_bestaetigt_am:
			self.eingang_bestaetigt_am = jetzt

		# Fristen immer aus dem Eingang ableiten (§ 9 Abs. 1, § 13 Abs. 9 HSchG). Korrigiert auch Fälle, bei denen
		# eine frühere Version die Rückmeldefrist ab der Bestätigung (bzw. Eingang + 3 Monate + 7 Tage) gesetzt hat.
		if self.eingegangen_am:
			self.bestaetigung_faellig, self.rueckmeldung_faellig = fristen_ab_eingang(self.eingegangen_am)

		if self.status == "Abgeschlossen":
			if not self.abgeschlossen_am:
				self.abgeschlossen_am = jetzt
			# § 8 Abs. 11 HSchG: Aufbewahrung 5 Jahre ab letztmaliger Verarbeitung (hier: Abschluss),
			# darüber hinaus nur für laufende Verfahren (→ „Aufbewahrung verlängert“)
			self.loeschung_faellig = add_years(getdate(self.abgeschlossen_am), 5)

		# Nachrichten der Meldestelle ohne Zeitstempel ergänzen
		for n in self.nachrichten or []:
			if not n.zeitpunkt:
				n.zeitpunkt = jetzt
			if not n.absender:
				n.absender = "Meldestelle"
			if n.absender == "Meldestelle" and not n.intern:
				self.ungelesen = 0
