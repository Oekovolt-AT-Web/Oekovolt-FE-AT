# Aktivizimi i Hinweisgebersystem-it të vet (dhe heqja e IntegrityLine)

Ky dokument përshkruan si kalohet nga **IntegrityLine** (kanali aktual i sinjalizimeve) te
**Hinweisgebersystem-i i vet** i faqes, që ruan të dhënat në backoffice (Frappe).
Instalimi i backend-it përshkruhet te [README.md](README.md) në të njëjtën dosje.

---

## 0. Gjendja aktuale (shtator 2026)

| Pjesa | Gjendja |
|---|---|
| Kanali zyrtar i sinjalizimeve | **IntegrityLine** – `https://oekovolt.integrityline.com/` |
| Footer, Datenschutz, `llms.txt` | Lidhen me IntegrityLine |
| `/hinweisgebersystem`, `/hinweisgebersystem/postfach` | Ridrejtim **i përkohshëm (307)** te IntegrityLine (`next.config.mjs`) |
| API e sistemit të vet (`/api/hinweis`, `/api/hinweis/postfach`, `/api/hinweis/health`) | **E çaktivizuar** – kthen `503 nicht_konfiguriert`, sepse mungon `HINWEIS_INTERN=1` |
| Kodi i sistemit të vet (faqet, formulari, Postfach, backend) | I plotë dhe i testuar, gati për aktivizim |
| Backoffice | DocType „Hinweis", rolet „Hinweis Meldestelle" dhe „Hinweis Webformular" dhe puna e fshirjes pas 3 vjetësh ekzistojnë |

> ⚠️ Te `README.md` shkruhet që IntegrityLine është **„gekündigt"** (kontrata e ndërprerë).
> Verifikoni **datën kur IntegrityLine ndalon së punuari**. Sistemi i vet duhet të jetë aktiv
> **para** kësaj date. Ndryshe firma mbetet pa kanal sinjalizimi, dhe kjo mund të sjellë gjobë
> deri në 20.000 € sipas § 40 HinSchG.

---

## 1. Parakushtet – para se të prekni kodin

Këto janë pika organizative dhe ligjore. Pa to **mos** e aktivizoni sistemin.

### 1.1 Meldestelle (personat që i trajtojnë sinjalizimet)
- [ ] Të paktën **një person i vërtetë** ka rolin **„Hinweis Meldestelle"** te backoffice (jo `Administrator`, sepse kodi e përjashton nga njoftimet).
- [ ] Ka **një zëvendës**, për pushime ose sëmundje, edhe ai me të njëjtin rol.
- [ ] Personat janë të paanshëm dhe kanë njohuritë e duhura (§ 15 HinSchG).
- [ ] Asnjë përdorues tjetër nuk ka leje leximi te DocType „Hinweis".

### 1.2 Njoftimet me email (kontrolli më i rëndësishëm)
Kur vjen një sinjalizim i ri, Meldestelle merr një email pa përmbajtje („Neue Meldung eingegangen").
Në kontrollin e shtatorit 2026, radha e emaileve te backoffice (**Email Queue**) ishte **krejt bosh**,
që do të thotë se Frappe nuk dërgonte asnjë email.
- [ ] Te **Email Account** ekziston një llogari me *Enable Outgoing* dhe funksionon.
- [ ] Te `site_config.json` **nuk** është vendosur `"mute_emails": 1`.
- [ ] Prova: dërgoni një sinjalizim TEST (shih pikën 4). Meldestelle duhet ta marrë emailin brenda pak minutave.

Pa email, një sinjalizim mund të mbetet pa u parë, dhe humbasin afatet ligjore:
**7 ditë** për konfirmimin e marrjes dhe **3 muaj** për përgjigjen (§ 17 HinSchG).

### 1.3 Përdorues i veçantë API për faqen
Sot faqja përdor çelësin e përgjithshëm (`API_KEY`). Për sinjalizimet rekomandohet një përdorues më vete:
- [ ] Te backoffice krijoni një përdorues p.sh. `hinweis-web@oekovolt.de` **vetëm** me rolin **„Hinweis Webformular"** (pa qasje në Desk).
- [ ] Gjeneroni për të *API Key* dhe *API Secret* (User → Settings → API Access).
- [ ] Kontrolloni që ky çelës **nuk** mund t'i lexojë sinjalizimet: `GET /api/resource/Hinweis` duhet të kthejë **403**.

### 1.4 Kalimi nga IntegrityLine
- [ ] Të gjitha sinjalizimet e hapura te IntegrityLine përfundohen ose transferohen.
- [ ] Dokumentimi i sinjalizimeve të IntegrityLine eksportohet dhe ruhet **3 vjet pas mbylljes** (§ 11 Abs. 5 HinSchG). Kjo bëhet para se të mbyllet llogaria.
- [ ] Punonjësit informohen për kanalin e ri (email, intranet, tabelë njoftimesh), me datën nga e cila vlen.
- [ ] Rregullorja e brendshme ose udhëzimi për sinjalizimet përditësohet (adresa e re: `https://www.oekovolt.de/hinweisgebersystem`).
- [ ] Sinjalizuesit **anonimë** te IntegrityLine njoftohen para mbylljes, përmes Postfach-ut të tyre atje, se si vazhdon kontakti.
- [ ] Jurist ose zyrtari i përputhshmërisë e ka miratuar ndërrimin dhe tekstin e Datenschutz.

### 1.5 Kanali me gojë dhe dokumentet e mbrojtjes së të dhënave
- [ ] **Telefoni i Meldestelle** (§ 16 Abs. 3 HinSchG kërkon edhe sinjalizim me gojë). Te `src/data/hinweisgeber.js` → `MELDESTELLE`
      vendosni `telefon` dhe `telefonzeiten`. Sot janë `null`, prandaj faqja nuk tregon numër telefoni.
      Pasi të vendosen, faqja e shfaq vetë.
- [ ] **Regjistri i përpunimit (VVT)** – `docs/datenschutz/VVT-Hinweisgebersystem.md` ka 26 pika `[OFFEN]`
      (personat e Meldestelle dhe zëvendësi, numri i punonjësve, hosting-u, dërguesi i emaileve, 2FA, backup …).
- [ ] **Vlerësimi i ndikimit (DSFA)** – `docs/datenschutz/DSFA-Hinweisgebersystem.md` ka 16 pika `[OFFEN]`.
      Duhet plotësuar dhe nënshkruar para aktivizimit.
- [ ] **2FA** (verifikim me dy hapa) te backoffice për të gjitha llogaritë me rolin „Hinweis Meldestelle" dhe „System Manager".
- [ ] **Informimi i punonjësve** – draft gati: `docs/datenschutz/Beschaeftigteninformation-HinSchG.md`.
- [ ] **Doracaku i Meldestelle** – `docs/datenschutz/Meldestelle-Handbuch.md`, t'u jepet personave të Meldestelle.

---

## 2. Ndryshimet në kod (`Oekovolt-Web-DE`)

Kodi i sistemit të vet ekziston. Duhen kthyer vetëm lidhjet dhe duhet hequr ridrejtimi.

### 2.1 `next.config.mjs` – hiqni ridrejtimin
Fshini këto rreshta te `redirects()`:
```js
      // Hinweisgebersystem: vorerst IntegrityLine (wie bisher). …
      { source: "/hinweisgebersystem", destination: "https://oekovolt.integrityline.com/", permanent: false },
      { source: "/hinweisgebersystem/:path*", destination: "https://oekovolt.integrityline.com/", permanent: false },
```
Pasi ta keni vendosur live, **mos shtoni ridrejtim nga IntegrityLine te faqja**. Domeni `integrityline.com` nuk është i yni.

### 2.2 `src/components/Reusable/footer.js`
```jsx
// tani
<li><a href="https://oekovolt.integrityline.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Hinweisgebersystem</a></li>
// pas aktivizimit
<li><Link href="/hinweisgebersystem" className="transition-colors hover:text-white">Hinweisgebersystem</Link></li>
```

### 2.3 `src/components/Datenschutz/datenschutz.js`
Seksionin `<h2 …>Hinweisgebersystem</h2>` e zëvendësoni me:
```jsx
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl text-gray-800 mb-4">Hinweisgebersystem</h2>
        <p className="mb-4">
          Über unser internes Hinweisgebersystem nach dem Hinweisgeberschutzgesetz (HinSchG) können Verstöße vertraulich
          und auf Wunsch anonym gemeldet werden. Die Verarbeitung erfolgt zur Entgegennahme, Prüfung und Dokumentation von
          Meldungen sowie zur Ergreifung von Folgemaßnahmen auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit
          §§ 10, 12 und 17 HinSchG. Zugriff haben ausschließlich die Personen der internen Meldestelle. Beim Absenden einer
          Meldung werden keine IP-Adressen gespeichert; die Dokumentation wird drei Jahre nach Abschluss des Verfahrens
          gelöscht (§ 11 Abs. 5 HinSchG).
        </p>
        <p>
          Ausführliche Informationen nach Art. 13 und 14 DSGVO – auch für Personen, die in einer Meldung genannt werden –
          finden Sie in den{" "}
          <a href="/hinweisgebersystem#datenschutz" className="text-[#669933] hover:underline">
            Datenschutzhinweisen zum Hinweisgebersystem
          </a>
          .
        </p>
      </section>
```
Te seksioni `id="ip-adresse"`, në fund të paragrafit të parë (pas „…und den Zeitpunkt des Absendens."), shtoni:
```
Für Meldungen über das Hinweisgebersystem gilt das ausdrücklich nicht (siehe unten).
```

### 2.4 `src/app/sitemap.js`
Te `STATIC_PAGES`, pas rreshtit `/wissen/lexikon`, shtoni:
```js
  { path: "/hinweisgebersystem", changeFrequency: "yearly", priority: 0.3, lastModified: UPDATED_2026_09 },
```

### 2.5 `public/llms.txt`
```md
- [Hinweisgebersystem (HinSchG, anonym möglich)](https://www.oekovolt.de/hinweisgebersystem)
```

### 2.6 `src/app/barrierefreiheit/page.js`
Te lista e pjesëve të faqes, pas „Kontaktformular und Kurzbewerbung", shtoni:
```jsx
          <li>Hinweisgebersystem nach dem Hinweisgeberschutzgesetz</li>
```

### 2.7 Pa ndryshim
Këto e kanë tashmë `/hinweisgebersystem` dhe mbeten siç janë:
`RueckrufWidget.js` (widget-i fshihet në këtë faqe për konfidencialitet) dhe `MobileCta.js`.

### 2.8 Kontrolli dhe ruajtja
```bash
cd ~/Oekovolt-Web-DE
npx eslint src/components/Reusable/footer.js src/components/Datenschutz/datenschutz.js src/app/sitemap.js src/app/barrierefreiheit/page.js
grep -rn "integrityline" src public next.config.mjs   # duhet të mos gjejë asgjë
git add -A && git commit -m "Hinweisgebersystem: eigenes System aktiv, IntegrityLine entfernt" && git push origin main
```

---

## 3. Aktivizimi në serverin live

Te `.env.production` e dosjes live (**jo** te dosja e zhvillimit) shtoni:
```env
HINWEIS_INTERN=1
HINWEIS_API_KEY=<API Key i përdoruesit hinweis-web>
HINWEIS_API_SECRET=<API Secret i përdoruesit hinweis-web>
```
Pa `HINWEIS_API_KEY/SECRET` sistemi funksionon me çelësin e përgjithshëm, por **nuk rekomandohet**.

Pastaj:
```bash
cd ~/Oekovolt-Web-DE-live          # dosja nga e cila punon faqja live
git pull origin main
npm ci
npm run build
pm2 restart oekovolt-web-de --update-env
```

---

## 4. Kontrolli pas aktivizimit

| # | Prova | Rezultati i pritur |
|---|---|---|
| 1 | `curl -sI https://www.oekovolt.de/hinweisgebersystem` | `200` (jo më `307`) |
| 2 | `curl -s https://www.oekovolt.de/api/hinweis/health` | `{"ok":true}` |
| 3 | Footer-i në faqe | „Hinweisgebersystem" çon te `/hinweisgebersystem` |
| 4 | Dërgoni një sinjalizim **TEST** në faqe (betreff „TEST – bitte löschen") | Shfaqet numri i rastit dhe çelësi i qasjes |
| 5 | Email te Meldestelle | Mbërrin „Hinweisgebersystem: Neue Meldung eingegangen (HW-…)" |
| 6 | Te backoffice → Hinweis | Rasti TEST është aty. Meldestelle shkruan një përgjigje prove. |
| 7 | Te `/hinweisgebersystem/postfach` me numrin dhe çelësin e rastit | Përgjigja e Meldestelle shfaqet |
| 8 | Fshini rastin TEST te backoffice | – |
| 9 | `grep -rn integrityline` në projekt | Asgjë |

Vetëm pasi të kalojnë të gjitha provat, informoni punonjësit dhe mbyllni IntegrityLine (pika 1.4).

---

## 5. Kthimi mbrapa (nëse del problem)

Te serveri live:
1. Te `.env.production` hiqni `HINWEIS_INTERN=1`, ose vendoseni `0`. API refuzon menjëherë sinjalizimet e reja pas rinisjes.
2. Kthejeni ndryshimin në kod: `git revert <commit-i i pikës 2.8>`, pastaj `npm run build` dhe `pm2 restart oekovolt-web-de --update-env`.
3. Nëse IntegrityLine është ende aktiv, lidhjet dhe ridrejtimi kthehen atje. Nëse jo, duhet menjëherë një kanal zëvendësues (p.sh. adresë email e Meldestelle), sepse ligji kërkon që kanali të funksionojë pa ndërprerje.

---

## 6. Detyrat e përhershme të Meldestelle (pas aktivizimit)

- **Brenda 7 ditëve:** konfirmimi i marrjes. Te rasti, te tabela *Nachrichten*, shtoni një rresht me absender `Meldestelle` dhe vendosni statusin `Eingang bestätigt`.
- **Brenda 3 muajve:** përgjigje te sinjalizuesi për masat e marra.
- Sinjalizimet me gojë ose takimet personale regjistrohen edhe ato te backoffice (§ 16 Abs. 3 HinSchG).
- Fshirja pas 3 vjetësh bëhet automatikisht çdo ditë (`loesche_abgelaufene_hinweise`).

Hapat e detajuar për Meldestelle janë te [README.md](README.md), pikat „4. Arbeitsweise der Meldestelle" dhe „4a. Meldungen per Post, Telefon oder Gespräch". Lista e sigurisë para aktivizimit është te pika „5. Sicherheit – Checkliste vor Go-live".
