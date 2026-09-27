# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik

import re
import unicodedata

import frappe
from frappe.model.document import Document
from frappe.utils import get_datetime, now_datetime


def slugify(text):
	text = text.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
	text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
	return re.sub(r"[^a-z0-9]+", "-", text).strip("-")[:80]


class Veroeffentlichung(Document):
	def before_insert(self):
		if not self.slug:
			basis = slugify(self.titel)
			slug, i = basis, 2
			while frappe.db.exists("Veroeffentlichung", slug):
				slug, i = f"{basis}-{i}", i + 1
			self.slug = slug

	def validate(self):
		self.slug = slugify(self.slug or self.titel)
		if self.teaser and len(self.teaser) > 400:
			frappe.throw("Der Teaser darf höchstens 400 Zeichen lang sein.")
		if self.bild and not self.bild_alt:
			frappe.throw("Bitte eine Bildbeschreibung (Alt-Text) angeben – wichtig für Barrierefreiheit.")
		if self.status == "Veröffentlicht" and not self.veroeffentlicht_am:
			self.veroeffentlicht_am = now_datetime()
		if self.status == "Geplant" and not self.veroeffentlicht_am:
			frappe.throw("Für „Geplant“ bitte „Veröffentlichen am“ setzen.")
		if self.tv_dauer_sekunden and not 6 <= int(self.tv_dauer_sekunden) <= 120:
			frappe.throw("Anzeigedauer bitte zwischen 6 und 120 Sekunden wählen.")
		if self.im_fediverse and not self.is_new() and self.has_value_changed("slug") and frappe.db.exists("Verteilprotokoll", {"objekt_id": f"oekovolt:{self.get_doc_before_save().slug}"}):
			frappe.throw("Das URL-Kürzel wurde bereits im Fediverse verteilt und kann nicht mehr geändert werden.")


def geplante_veroeffentlichen():
	"""Scheduler (alle 5 Minuten): geplante Beiträge freischalten."""
	faellig = frappe.get_all("Veroeffentlichung", filters={"status": "Geplant", "veroeffentlicht_am": ["<=", now_datetime()]}, pluck="name")
	for name in faellig:
		frappe.db.set_value("Veroeffentlichung", name, "status", "Veröffentlicht")
	if faellig:
		frappe.db.commit()
		from oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api import website_anstossen

		website_anstossen()
