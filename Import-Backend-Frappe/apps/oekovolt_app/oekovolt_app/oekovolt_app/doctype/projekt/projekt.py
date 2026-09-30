# Copyright (c) 2026, ÖKOVOLT

import frappe
from frappe import _
from frappe.model.document import Document

from oekovolt_app.website_api import format as fmt


class Projekt(Document):
	def validate(self):
		self.projekt_name = fmt.sauber(self.projekt_name, 140)
		if not fmt.slug(self.projekt_name):
			frappe.throw(_("Der Projektname muss Buchstaben oder Ziffern enthalten (daraus entsteht die URL)."))

		# Schlüssel für get_projekt: klein, ohne Umlaute/Leerzeichen („Haydu 2“ -> „haydu-2“)
		if self.projekt_website_name:
			self.projekt_website_name = fmt.slug(self.projekt_website_name)[:140] or None

		# Anzeigetext der Leistung: leer -> berechnen; war er automatisch erzeugt und ändert sich
		# die Leistung -> neu berechnen; von Hand gepflegte Texte bleiben stehen
		vorher = self.get_doc_before_save()
		if not self.leistung_label:
			self.leistung_label = fmt.leistung_label(self.leistung)
		elif vorher and vorher.leistung != self.leistung and vorher.leistung_label == fmt.leistung_label(vorher.leistung):
			self.leistung_label = fmt.leistung_label(self.leistung)

		if self.objekt and self.objekt not in fmt.OBJEKTE:
			frappe.throw(_("Objekt muss Gewerbe, Landwirtschaft oder Einfamilienhaus sein."))
		if self.latitude and not -90 <= self.latitude <= 90:
			frappe.throw(_("Der Breitengrad muss zwischen -90 und 90 liegen."))
		if self.longitude and not -180 <= self.longitude <= 180:
			frappe.throw(_("Der Längengrad muss zwischen -180 und 180 liegen."))

		# Kundenbühne: Website und Social-Media-Profile nur als https://-Adresse
		for feld in fmt.URL_FELDER:
			self.set(feld, fmt.sauber(self.get(feld), 500))
		fehler = fmt.projekt_url_fehler(self.as_dict())
		if fehler:
			frappe.throw(fehler)
		self.portraet_quellen = "\n".join(fmt.quellen_liste(self.portraet_quellen))
		if self.freigabe_zitat and not (self.zitat or "").strip():
			frappe.throw(_("Zitat ist freigegeben, aber leer. Bitte ein Zitat eintragen oder die Freigabe entfernen."))
		if self.freigabe_logo and not self.logo:
			frappe.throw(_("Logo ist freigegeben, aber es ist kein Logo hochgeladen."))

		self._bilder_oeffentlich()
		self._slug_eindeutig()

	def _bilder_oeffentlich(self):
		"""Die Website lädt Bilder ohne Anmeldung über /files/… – private Dateien gingen ins Leere."""
		pfade = [self.bild, self.logo] + [b.bild for b in self.get("bilder") or []]
		if any(p and not fmt.ist_oeffentlich(p) for p in pfade):
			frappe.throw(_("Projektbilder und Kundenlogo müssen öffentlich sein. Bitte die Datei erneut hochladen und „Privat“ nicht anhaken."))

	def _slug_eindeutig(self):
		"""Die URL der Detailseite entsteht aus dem Projektnamen – gleiche URLs nur als Warnung melden."""
		if not self.veroeffentlicht:
			return
		eigener = fmt.slug(self.projekt_name)
		andere = frappe.get_all(
			"Projekt",
			filters={"veroeffentlicht": 1, "name": ["!=", self.name or ""]},
			fields=["name", "projekt_name"],
		)
		gleich = [a.name for a in andere if fmt.slug(a.projekt_name) == eigener]
		if gleich:
			frappe.msgprint(
				_("Achtung: {0} ergibt dieselbe Website-Adresse /referenzen/projekte/{1}. Bitte den Projektnamen unterscheidbar machen (z. B. „{2} 2“).").format(
					", ".join(gleich), eigener, self.projekt_name
				),
				indicator="orange",
				alert=True,
			)

	def on_update(self):
		_cache_leeren()

	def on_trash(self):
		_cache_leeren()

	def after_rename(self, old, new, merge=False):
		_cache_leeren()


def _cache_leeren():
	from oekovolt_app.website_api.projekte import cache_leeren

	cache_leeren()
