# scripts/schneelast-raster-erzeugen.py
#
# Erzeugt data/schneelast/sk50-at.bin + sk50-at.json (Schneelast-Richtwert für den Standort-Check).
# Datenbasis: GeoSphere Austria, SNOWGRID-CL v2.1, Tageswerte swe_tot 1961–heute, 1-km-Raster
# (EPSG:3416), Lizenz CC BY 4.0, https://data.hub.geosphere.at/dataset/snowgrid_cl-v2-1d-1km
# HORA/eHORA wird NICHT verwendet (automatisierte Abrufe dort untersagt).
#
# Ablauf (einmalig, ca. 0,9 GB Download, Rechenzeit ~2 Min.):
#   1. Jahresdateien laden nach ./swe/:
#      for j in $(seq 1961 2026); do curl -s -o swe/SNOWGRID-CL_swe_tot_$j.nc \
#        "https://public.hub.geosphere.at/datahub/resources/snowgrid_cl-v2-1d-1km/filelisting/swe_tot/SNOWGRID-CL_swe_tot_$j.nc"; done
#   2. python -m venv venv && venv/Scripts/python -m pip install numpy h5py
#   3. venv/Scripts/python scripts/schneelast-raster-erzeugen.py   (im Ordner mit swe/ ausführen)
#   4. export/sk50-at.* nach data/schneelast/ kopieren, danach node scripts/schneelast-raster.test.mjs
#
# Methode: Winterjahr 1.8.–31.7. (wie Schneelast.Reform), Jahresmaxima je Zelle, GEV über L-Momente
# (Hosking), Wiederkehr 50 Jahre, SWE kg/m² × 9,81/1000 = kN/m². Zellen mit ganzjähriger Schneedecke
# (Gletscher/Firn: in >50 % der Winter kein Ausapern) bleiben leer. Über 2.000 m blendet die API
# (src/app/api/standort/route.js) den Richtwert aus. Kalibrierfaktor: "kalibrierung" in der JSON.
# 50-jährliche Schneelast je 1-km-Zelle aus SNOWGRID-CL (GeoSphere Austria, CC BY 4.0)
# Winterjahr 1.8.–31.7. (wie Schneelast.Reform), GEV über L-Momente (Hosking), T = 50.
import glob, math, h5py, numpy as np
from datetime import date, timedelta

T = 50
KN = 9.81 / 1000
dateien = sorted(glob.glob("swe/SNOWGRID-CL_swe_tot_*.nc"))
maxima = {}  # winterjahr -> 2D-Maximum
minima = {}  # winterjahr -> 2D-Minimum (ganzjährige Schneedecke erkennen)
lat = lon = None
for pfad in dateien:
    with h5py.File(pfad, "r") as f:
        if lat is None:
            lat, lon = f["lat"][:], f["lon"][:]
        zeit = f["time"][:]
        daten = f["swe_tot"][:]  # ganzes Jahr auf einmal (Chunks über 122 Tage)
    tage = [date(1961, 1, 1) + timedelta(days=int(t)) for t in zeit]
    wj = np.array([t.year if t.month >= 8 else t.year - 1 for t in tage])
    for w in np.unique(wj):
        tw = daten[wj == w]
        mn = tw.min(axis=0).astype(np.float32)
        mn[mn < 0] = np.nan
        minima[w] = mn if w not in minima else np.fmin(minima[w], mn)
        m = tw.max(axis=0).astype(np.float32)
        m[m < 0] = np.nan
        if w in maxima:
            np.fmax(maxima[w], m, out=maxima[w])
        else:
            maxima[w] = m
    print(pfad, flush=True)

winter = [w for w in sorted(maxima) if 1961 <= w <= 2025]  # nur vollständige Winter
X = np.stack([maxima[w] for w in winter])  # (n, ny, nx) kg/m²
n = X.shape[0]
print("Winter:", winter[0], "-", winter[-1], "n =", n)

gueltig = np.all(np.isfinite(X), axis=0)
# Ganzjährige Schneedecke (Gletscher/Firn): in mehr als der Hälfte der Winter schmilzt der Schnee nie ganz ab.
# Dort summiert sich SWE über Jahre auf – kein sinnvoller Richtwert für Dächer.
MN = np.stack([minima[w] for w in winter])
perenn = (MN > 0).mean(axis=0) > 0.5
print("Zellen mit ganzjähriger Schneedecke:", int((perenn & gueltig).sum()))
gueltig = gueltig & ~perenn
S = np.sort(np.where(gueltig, X, 0), axis=0)
i = np.arange(n, dtype=np.float64)[:, None, None]
b0 = S.mean(axis=0)
b1 = (i / (n - 1) * S).mean(axis=0)
b2 = (i * (i - 1) / ((n - 1) * (n - 2)) * S).mean(axis=0)
l1, l2, l3 = b0, 2 * b1 - b0, 6 * b2 - 6 * b1 + b0
with np.errstate(divide="ignore", invalid="ignore"):
    t3 = np.where(l2 > 0, l3 / l2, 0)
    c = 2 / (3 + t3) - math.log(2) / math.log(3)
    k = np.clip(7.859 * c + 2.9554 * c * c, -0.5, 0.5)
    k = np.where(np.abs(k) < 1e-6, 1e-6, k)
    g = np.vectorize(math.gamma)(1 + k)
    alpha = l2 * k / ((1 - 2.0 ** (-k)) * g)
    xi = l1 - alpha * (1 - g) / k
    y = -math.log(1 - 1 / T)
    rw = xi + alpha / k * (1 - y ** k)
rw = np.where(gueltig & (l2 > 0), rw, np.where(gueltig, l1, np.nan))
sk = np.maximum(rw, 0) * KN
beob = np.where(gueltig, X.max(axis=0), np.nan) * KN

np.savez_compressed("sk50_roh.npz", sk=sk.astype(np.float32), beob=beob.astype(np.float32), lat=lat, lon=lon)
print("Zellen gültig:", int(gueltig.sum()), " sk min/median/max:", np.nanmin(sk), np.nanmedian(sk), np.nanmax(sk))

# Export im Format von src/lib/standort/schneelastRaster.js (Zeilen Süd→Nord, Uint16 = sk*100, 65535 = leer)
import json, os
os.makedirs("export", exist_ok=True)
roh = np.where(np.isfinite(sk), np.round(sk * 100), 65535)
roh = np.clip(roh, 0, 65535).astype("<u2")
roh.tofile("export/sk50-at.bin")
meta = {"nx": int(sk.shape[1]), "ny": int(sk.shape[0]), "x0": 112500, "y0": 258500, "dx": 1000, "crs": "EPSG:3416",
        "skala": 100, "leer": 65535, "quelle": "GeoSphere Austria, SNOWGRID-CL v2.1 (CC BY 4.0)",
        "zeitraum": f"Winter {winter[0]}/{str(winter[0]+1)[2:]}–{winter[-1]}/{str(winter[-1]+1)[2:]}",
        "methode": "GEV (L-Momente), 50-jährlich", "kalibrierung": 1.0, "stand": "2026-09-30"}
json.dump(meta, open("export/sk50-at.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("Export:", meta["zeitraum"], os.path.getsize("export/sk50-at.bin"), "Bytes")
