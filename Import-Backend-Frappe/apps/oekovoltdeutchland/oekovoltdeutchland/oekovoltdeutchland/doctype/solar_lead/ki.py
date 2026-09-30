# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# KI-Auswertung eines Solar Leads mit Claude (Anthropic) – läuft als Hintergrundjob (RQ, Queue "long").
# Nur, wenn der Kunde auf dem Smartphone ausdrücklich eingewilligt hat.
#
# Voraussetzungen:
#   bench pip install anthropic pillow-heif
#   bench --site <site> set-config anthropic_api_key "sk-ant-..."
#   optional: bench --site <site> set-config anthropic_model "claude-sonnet-5"

import base64
import io
import json

import frappe
from frappe.utils import cint, cstr, flt, getdate, now_datetime

MODELL_STANDARD = "claude-sonnet-5"
MAX_KANTE = 1568  # empfohlene maximale Bildkante für Claude

WERKZEUG = {
	"name": "lead_daten_speichern",
	"description": "Speichert die aus Stromrechnung, Zählerfoto, Zählerschrank- und Hausfoto erkannten Daten für ein Photovoltaik-Angebot.",
	"input_schema": {
		"type": "object",
		"properties": {
			"jahresverbrauch_kwh": {"type": ["number", "null"], "description": "Verbrauch im Abrechnungszeitraum, auf 12 Monate hochgerechnet, in kWh"},
			"arbeitspreis_ct_brutto": {"type": ["number", "null"], "description": "Arbeitspreis je kWh inkl. MwSt. in Cent"},
			"grundpreis_eur_jahr_brutto": {"type": ["number", "null"], "description": "Grundpreis pro Jahr inkl. MwSt. in Euro"},
			"abschlag_eur_monat": {"type": ["number", "null"]},
			"anbieter": {"type": ["string", "null"]},
			"tarif": {"type": ["string", "null"]},
			"abrechnung_von": {"type": ["string", "null"], "description": "YYYY-MM-DD"},
			"abrechnung_bis": {"type": ["string", "null"], "description": "YYYY-MM-DD"},
			"zaehlernummer": {"type": ["string", "null"]},
			"zaehlerstand_foto_kwh": {"type": ["number", "null"], "description": "Auf dem Zählerfoto abgelesener Stand (Bezug, OBIS 1.8.0) in kWh"},
			"zaehlerschrank_hinweis": {"type": ["string", "null"], "description": "Sachliche Beschreibung des Zählerschranks: Zählertyp, sichtbare freie Plätze, erkennbarer Zustand/Alter, Auffälligkeiten. Keine Diagnose."},
			"dach_hinweis": {"type": ["string", "null"], "description": "Dachform, Eindeckung, grobe Ausrichtung falls erkennbar, Verschattung (Bäume, Gauben, Kamine)."},
			"sicherheit": {"type": "number", "description": "Gesamtsicherheit der Erkennung 0 bis 1"},
			"hinweise": {"type": ["string", "null"], "description": "Unklarheiten, z. B. unleserliche Stellen oder Hinweise auf Nachtstrom/Wärmepumpentarif"},
		},
		"required": ["sicherheit"],
	},
}

ANWEISUNG = """Du wertest Unterlagen für ein Photovoltaik-Angebot eines österreichischen Fachbetriebs aus.
Regeln:
- Übernimm nur Werte, die in den Bildern/Dokumenten eindeutig lesbar sind. Unsicheres → null und in "hinweise" erwähnen.
- Jahresverbrauch: Wenn der Abrechnungszeitraum nicht 12 Monate umfasst, rechne auf 365 Tage hoch.
- Preise brutto (inkl. MwSt.). Bei mehreren Preisstufen den aktuell gültigen Arbeitspreis nehmen.
- Keine Bankverbindung, keine Kundennummer, keine Geburtsdaten oder sonstigen personenbezogenen Daten übernehmen.
- Zählerschrank und Dach nur beschreiben, keine verbindliche technische Bewertung.
Rufe am Ende genau einmal das Werkzeug lead_daten_speichern auf."""


def _block(file_url, bezeichnung):
	"""Anhang → Content-Block für die Messages API (Bilder verkleinert, HEIC konvertiert)."""
	datei = frappe.get_doc("File", {"file_url": file_url})
	inhalt = datei.get_content()
	if isinstance(inhalt, str):
		inhalt = inhalt.encode()
	if file_url.lower().endswith(".pdf"):
		return [
			{"type": "text", "text": bezeichnung},
			{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": base64.b64encode(inhalt).decode()}},
		]

	from PIL import Image, ImageOps

	try:
		import pillow_heif

		pillow_heif.register_heif_opener()
	except ImportError:
		pass
	bild = ImageOps.exif_transpose(Image.open(io.BytesIO(inhalt))).convert("RGB")
	bild.thumbnail((MAX_KANTE, MAX_KANTE))
	puffer = io.BytesIO()
	bild.save(puffer, format="JPEG", quality=88)
	return [
		{"type": "text", "text": bezeichnung},
		{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": base64.b64encode(puffer.getvalue()).decode()}},
	]


def _datum(wert):
	try:
		return getdate(wert) if wert else None
	except Exception:
		return None


def analysieren(name):
	doc = frappe.get_doc("Solar Lead", name)
	if not cint(doc.ki_einwilligung) or doc.ki_status not in ("wartet", "fehler"):
		return
	schluessel = frappe.conf.get("anthropic_api_key")
	if not schluessel:
		frappe.db.set_value("Solar Lead", name, "ki_status", "keine")
		return

	frappe.db.set_value("Solar Lead", name, "ki_status", "laeuft", update_modified=False)
	frappe.db.commit()

	try:
		import anthropic

		inhalt = []
		for feld, bezeichnung in [
			("rechnung_foto", "Stromrechnung:"),
			("rechnung_foto_2", "Stromrechnung, weitere Seite:"),
			("zaehler_foto", "Foto des Stromzählers:"),
			("schaltschrank_foto", "Foto des geöffneten Zählerschranks:"),
			("dach_foto", "Foto von Haus und Dach:"),
		]:
			if doc.get(feld):
				inhalt.extend(_block(doc.get(feld), bezeichnung))
		inhalt.append({"type": "text", "text": ANWEISUNG})

		modell = frappe.conf.get("anthropic_model") or MODELL_STANDARD
		client = anthropic.Anthropic(api_key=schluessel, max_retries=2, timeout=120)
		antwort = client.messages.create(
			model=modell,
			max_tokens=2000,
			tools=[WERKZEUG],
			tool_choice={"type": "tool", "name": WERKZEUG["name"]},
			messages=[{"role": "user", "content": inhalt}],
		)
		daten = next((b.input for b in antwort.content if getattr(b, "type", "") == "tool_use"), None)
		if not isinstance(daten, dict):
			raise ValueError("Keine strukturierte Antwort")

		doc.reload()
		doc.update({
			"jahresverbrauch": flt(daten.get("jahresverbrauch_kwh")) or None,
			"arbeitspreis_ct": flt(daten.get("arbeitspreis_ct_brutto")) or None,
			"grundpreis_eur_jahr": flt(daten.get("grundpreis_eur_jahr_brutto")) or None,
			"abschlag_eur_monat": flt(daten.get("abschlag_eur_monat")) or None,
			"anbieter": cstr(daten.get("anbieter"))[:140] or None,
			"tarif": cstr(daten.get("tarif"))[:140] or None,
			"abrechnung_von": _datum(daten.get("abrechnung_von")),
			"abrechnung_bis": _datum(daten.get("abrechnung_bis")),
			"zaehlernummer": cstr(daten.get("zaehlernummer"))[:40] or None,
			"zaehlerschrank_hinweis": cstr(daten.get("zaehlerschrank_hinweis"))[:2000] or None,
			"dach_hinweis": cstr(daten.get("dach_hinweis"))[:2000] or None,
			"ki_hinweise": "\n".join(
				filter(None, [
					cstr(daten.get("hinweise")),
					f"Zählerstand laut Foto: {daten.get('zaehlerstand_foto_kwh')} kWh" if daten.get("zaehlerstand_foto_kwh") else "",
				])
			)[:2000] or None,
			"ki_sicherheit": round(flt(daten.get("sicherheit")) * 100),
			"ki_rohdaten": json.dumps(daten, ensure_ascii=False, indent=1),
			"ki_modell": modell,
			"ki_status": "fertig",
			"ki_analysiert_am": now_datetime(),
		})
		doc.save(ignore_permissions=True)
		frappe.db.commit()
	except Exception:
		frappe.db.rollback()
		frappe.db.set_value("Solar Lead", name, "ki_status", "fehler", update_modified=False)
		frappe.db.commit()
		frappe.log_error(title=f"KI-Auswertung {name} fehlgeschlagen")
