# Copyright (c) 2026, ÖKOVOLT
#
# Referenz-Freigabe (Welle A07): Vertrieb/Marketing legen den Datensatz an (Projekt, Firma,
# Ansprechperson, E-Mail). Beim Anlegen entsteht der Einmal-Link, der genau einmal angezeigt wird
# (Hinweis im Desk) – gespeichert bleibt nur der SHA-256-Hash. Die Häkchen setzt ausschließlich
# der Kunde über die Freigabeseite (website_api/freigabe.py); im Desk sind sie schreibgeschützt.

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime

from oekovolt_app.oekovolt_app.doctype.referenz_freigabe import freigabe_logik as L

CACHE_PRAEFIX = "oekovolt_app:freigaben:"


def website_basis():
	"""Basis-URL der Website für den Einmal-Link (site_config „oekovolt_website_url“)."""
	return (frappe.conf.get("oekovolt_website_url") or "https://www.oekovolt.com").rstrip("/")


def cache_leeren(*args, **kwargs):
	frappe.cache().delete_keys(CACHE_PRAEFIX)


class ReferenzFreigabe(Document):
	def validate(self):
		self.kunde_firma = L.sauber(self.kunde_firma, 140)
		self.ansprechperson = L.sauber(self.ansprechperson, 140)
		self.funktion = L.sauber(self.funktion, 140)
		self.email = L.sauber(self.email, 190).lower()
		if not L.email_gueltig(self.email):
			frappe.throw(_("Bitte eine gültige E-Mail-Adresse eintragen."))
		if self.freigabe_zitat and not (self.zitat_text or "").strip():
			frappe.throw(_("Zitat ist freigegeben, aber leer."))
		if not self.gueltig_bis:
			self.gueltig_bis = L.gueltig_bis(now_datetime())
		# Widerruf setzt alle Freigaben zurück – auch wenn er im Desk von Hand eingetragen wurde
		if self.widerrufen_am:
			for feld in L.SCHALTER:
				self.set(feld, 0)
		self.status = L.status(self.as_dict(), now_datetime())

	def after_insert(self):
		if not self.token_hash:
			self.neuen_link_erzeugen()

	def neuen_link_erzeugen(self):
		"""Neuer Einmal-Token (alter wird ungültig). Der Link wird genau einmal im Desk angezeigt."""
		token = L.token_erzeugen()
		self.db_set(
			{
				"token_hash": L.token_hash(token),
				"gueltig_bis": L.gueltig_bis(now_datetime()),
				"status": L.STATUS_OFFEN,
			},
			update_modified=True,
		)
		link = L.freigabe_url(website_basis(), token)
		frappe.msgprint(
			_("Einmal-Link für {0} (30 Tage gültig, wird nur jetzt angezeigt):<br><a href=\"{1}\">{1}</a>").format(
				frappe.utils.escape_html(self.kunde_firma), link
			),
			title=_("Freigabe-Link erzeugt"),
			indicator="green",
		)
		return link

	def on_update(self):
		cache_leeren()

	def on_trash(self):
		cache_leeren()
