# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Reine Logik der Heatmap – OHNE Frappe-Import, damit sie mit `python -m unittest` testbar ist.
# Validieren/Kürzen wie die Website, Runden, deterministische Schlüssel (Hash),
# Monats-Rechnung und Scroll-Kumulierung. Die Datenbankzugriffe stehen in api.py.

import hashlib
import json
import math
import re
from datetime import date, timedelta
from urllib.parse import quote

GERAETE = ("mobil", "tablet", "desktop")
MAX_PFAD = 200
MAX_SELEKTOR = 200
MAX_KLICKS = 100
MAX_PFADE_JE_MONAT = 2000  # je Gerät und Monat; weitere neue Pfade werden verworfen
PFAD_ZEICHEN = re.compile(r"[a-z0-9/._-]+")
RASTER = 0.05  # rx/ry werden auf 0,05 gerundet
SCROLL_STUFE = 10  # Scrolltiefe in 10er-Schritten
SCROLL_TIEFEN = tuple(range(10, 101, 10))
AUFBEWAHRUNG_MONATE = 14
STANDARD_TAGE = 30
MAX_TAGE = 31 * AUFBEWAHRUNG_MONATE


def _ohne_steuerzeichen(text):
	return "".join(z for z in text if ord(z) >= 32 and ord(z) != 127)


def _zahl(wert):
	"""float oder None – lehnt bool, NaN und ±Unendlich ab."""
	if isinstance(wert, bool) or wert is None:
		return None
	try:
		zahl = float(wert)
	except (TypeError, ValueError):
		return None
	return zahl if math.isfinite(zahl) else None


def _mathe_round(x):
	"""Rundung wie JavaScript Math.round (x.5 → aufwärts)."""
	return math.floor(x + 0.5)


# ---------------------------------------------------------------- Eingaben

def pfad_pruefen(pfad):
	"""Seitenpfad normalisieren: ohne Query/Fragment, Kleinbuchstaben, beginnt mit „/“,
	ohne abschließenden „/“, ≤ 200 Zeichen, nur [a-z0-9/._-] – sonst None (Schutz vor Müll-Pfaden)."""
	if not isinstance(pfad, str):
		return None
	p = _ohne_steuerzeichen(pfad).strip().split("#", 1)[0].split("?", 1)[0].lower()
	if not p.startswith("/") or p.startswith("//"):
		return None
	p = p[:MAX_PFAD]
	if len(p) > 1:
		p = p.rstrip("/") or "/"
	return p if PFAD_ZEICHEN.fullmatch(p) else None


def neuer_pfad_erlaubt(anzahl_pfade_im_monat):
	"""Plausibilitätsschutz: je Gerät und Monat höchstens MAX_PFADE_JE_MONAT verschiedene Pfade."""
	return int(anzahl_pfade_im_monat or 0) < MAX_PFADE_JE_MONAT


def geraet_pruefen(geraet):
	g = geraet.strip().lower() if isinstance(geraet, str) else ""
	return g if g in GERAETE else None


def selektor_pruefen(selektor):
	if not isinstance(selektor, str):
		return None
	s = _ohne_steuerzeichen(selektor).strip()[:MAX_SELEKTOR].strip()
	return s or None


def koordinate_runden(wert):
	"""0..1 begrenzen und auf 0,05 runden (Ergebnis mit 2 Nachkommastellen)."""
	zahl = _zahl(wert)
	if zahl is None:
		return None
	zahl = min(max(zahl, 0.0), 1.0)
	return round(_mathe_round(zahl / RASTER) * RASTER, 2)


def scroll_runden(wert):
	"""0..100 begrenzen und auf 10 runden."""
	zahl = _zahl(wert)
	if zahl is None:
		return None
	zahl = min(max(zahl, 0.0), 100.0)
	return int(_mathe_round(zahl / SCROLL_STUFE) * SCROLL_STUFE)


def klicks_bereinigen(klicks):
	"""Liste {sel, rx, ry} → Liste (sel, rx, ry). Höchstens 100 Einträge, ungültige werden verworfen."""
	if isinstance(klicks, str):
		try:
			klicks = json.loads(klicks)
		except ValueError:
			return []
	if not isinstance(klicks, (list, tuple)):
		return []
	ergebnis = []
	for k in list(klicks)[:MAX_KLICKS]:
		if not isinstance(k, dict):
			continue
		sel = selektor_pruefen(k.get("sel"))
		rx = koordinate_runden(k.get("rx"))
		ry = koordinate_runden(k.get("ry"))
		if sel is None or rx is None or ry is None:
			continue
		ergebnis.append((sel, rx, ry))
	return ergebnis


def klicks_zaehlen(klicks):
	"""Gleiche Zellen zusammenfassen → sortierte Liste (sel, rx, ry, anzahl)."""
	zaehler = {}
	for schluessel in klicks:
		zaehler[schluessel] = zaehler.get(schluessel, 0) + 1
	return sorted((sel, rx, ry, n) for (sel, rx, ry), n in zaehler.items())


def erfassung_vorbereiten(daten):
	"""Body von „erfassen“ prüfen. Wirft ValueError bei ungültigem pfad/geraet.
	Rückgabe: {pfad, geraet, klicks: [(sel, rx, ry, anzahl)], scroll: int|None}"""
	daten = daten or {}
	pfad = pfad_pruefen(daten.get("pfad"))
	if not pfad:
		raise ValueError("pfad")
	geraet = geraet_pruefen(daten.get("geraet"))
	if not geraet:
		raise ValueError("geraet")
	return {
		"pfad": pfad,
		"geraet": geraet,
		"klicks": klicks_zaehlen(klicks_bereinigen(daten.get("klicks"))),
		"scroll": scroll_runden(daten.get("scroll")),
	}


# ---------------------------------------------------------------- Schlüssel

def _hash(*teile):
	return hashlib.sha256("\x1f".join(str(t) for t in teile).encode("utf-8")).hexdigest()


def name_zelle(pfad, geraet, selektor, rx, ry, monat):
	return _hash("zelle", pfad, geraet, selektor, f"{float(rx):.2f}", f"{float(ry):.2f}", monat)


def name_scroll(pfad, geraet, tiefe, monat):
	return _hash("scroll", pfad, geraet, int(tiefe), monat)


def name_seite(pfad, geraet, monat):
	return _hash("seite", pfad, geraet, monat)


# ---------------------------------------------------------------- Monate

def monat_von(datum):
	return f"{datum.year:04d}-{datum.month:02d}"


def monat_pruefen(monat):
	if not isinstance(monat, str) or len(monat) != 7 or monat[4] != "-":
		return None
	jahr, mon = monat[:4], monat[5:]
	if not (jahr.isdigit() and mon.isdigit()) or not 1 <= int(mon) <= 12:
		return None
	return monat


def monat_verschieben(monat, delta):
	jahr, mon = int(monat[:4]), int(monat[5:])
	index = jahr * 12 + (mon - 1) + delta
	return f"{index // 12:04d}-{index % 12 + 1:02d}"


def tage_begrenzen(tage):
	zahl = _zahl(tage)
	if zahl is None:
		return STANDARD_TAGE
	return int(min(max(zahl, 1), MAX_TAGE))


def monate_fuer_tage(heute, tage):
	"""Zeitraum „letzte n Tage“ → (von_monat, bis_monat). Gespeichert wird monatsweise,
	daher umfasst die Auswertung ganze Monate (bei 30 Tagen meist Vor- und aktueller Monat)."""
	start = heute - timedelta(days=tage_begrenzen(tage) - 1)
	return monat_von(start), monat_von(heute)


def loesch_grenze(heute, monate=AUFBEWAHRUNG_MONATE):
	"""Ältester Monat, der behalten wird: aktueller Monat + (monate − 1) Vormonate.
	Alles mit monat < Grenze wird gelöscht – kein Datensatz ist älter als 14 Monate."""
	return monat_verschieben(monat_von(heute), -(monate - 1))


# ---------------------------------------------------------------- Auswertung

def scroll_kumulieren(zeilen):
	"""(tiefe, anzahl) je MAXIMAL erreichter Tiefe → [{tiefe, anzahl}] für 10..100,
	anzahl = Aufrufe, die mindestens diese Tiefe erreichten."""
	je_tiefe = {}
	for tiefe, anzahl in zeilen or []:
		t = int(tiefe)
		je_tiefe[t] = je_tiefe.get(t, 0) + int(anzahl or 0)
	return [{"tiefe": t, "anzahl": sum(n for tt, n in je_tiefe.items() if tt >= t)} for t in SCROLL_TIEFEN]


def klicks_zusammenfassen(zeilen, limit=None):
	"""(sel, rx, ry, anzahl) → [{sel, rx, ry, anzahl}] absteigend nach anzahl (Duplikate addiert)."""
	summe = {}
	for sel, rx, ry, anzahl in zeilen or []:
		schluessel = (sel, round(float(rx), 2), round(float(ry), 2))
		summe[schluessel] = summe.get(schluessel, 0) + int(anzahl or 0)
	liste = [{"sel": s, "rx": x, "ry": y, "anzahl": n} for (s, x, y), n in summe.items()]
	liste.sort(key=lambda k: (-k["anzahl"], k["sel"], k["ry"], k["rx"]))
	return liste[:limit] if limit else liste


def top_elemente(zeilen, aufrufe, limit=100):
	"""(selektor, klicks) → [{selektor, klicks, anteil}] – anteil = Klicks je 100 Aufrufe (%)."""
	summe = {}
	for sel, klicks in zeilen or []:
		summe[sel] = summe.get(sel, 0) + int(klicks or 0)
	liste = [
		{"selektor": s, "klicks": n, "anteil": round(100.0 * n / aufrufe, 1) if aufrufe else 0.0}
		for s, n in summe.items()
	]
	liste.sort(key=lambda z: (-z["klicks"], z["selektor"]))
	return liste[:limit]


def scroll_anteile(kumuliert, aufrufe):
	"""Kumulierte Scrollwerte → Prozent der Aufrufe (für das Diagramm)."""
	return [round(100.0 * z["anzahl"] / aufrufe, 1) if aufrufe else 0.0 for z in kumuliert]


def ansicht_link(basis, pfad, token, geraet):
	"""Link zur visuellen Heatmap auf der Website."""
	g = geraet_pruefen(geraet) or "desktop"
	return f"{basis.rstrip('/')}{quote(pfad, safe='/-_.~%')}?heatmap={quote(token, safe='')}&geraet={g}"


if __name__ == "__main__":  # pragma: no cover
	print(erfassung_vorbereiten({"pfad": "/gewerbe/", "geraet": "Mobil", "klicks": [{"sel": "a.cta", "rx": 0.37, "ry": 0.5}], "scroll": 67}))
	print(loesch_grenze(date(2026, 9, 30)))
