# A pontozó fejlesztői ellenőrzése

A feladatsorhoz 88 stabil azonosítójú ellenőrzés tartozik:
42 controller-ellenőrzés és 46 service-ellenőrzés.
A HTTP-ellenőrzések több külön kérést tartalmaznak.

Elkülönített ellenőrző projektben végzett futtatások:

| Megoldásváltozat | Service / 64 | Controller / 36 | Összesen / 100 |
|---|---:|---:|---:|
| Helyes megoldás | 64 | 36 | 100 |
| Minden service-metódus kivételt dob | 0 | 21 | 21 |
| Működő service, a controller 501 választ ad a sikeres kérésekre | 64 | 10 | 74 |
| Működő service, a controller előre beírt alapértékeket ad | 64 | 10 | 74 |
| Hiányzó kézi paraméterellenőrzés | 64 | 35 | 99 |
| A fizetettségi feltétel kihagyása | 59 | 32 | 91 |
| Extra díj kihagyása a bevételből | 61 | 34 | 95 |
| Egészre csonkolt átlag | 62 | 34 | 96 |
| Kizáró minimumhatár használata | 58 | 35 | 93 |
| Hibás százaléknevező | 61 | 34 | 95 |
| Veszteséges rekordok nullázása | 62 | 34 | 96 |
| Kategóriaszűrés nélküli riport | 57 | 34 | 91 |
| Adatot módosító service | 0 | 35 | 35 |

A valódi kiinduló projekt is ellenőrzött: a megoldatlan service és controller
együtt 0/100 pontot kap. A pontozási terv összege és a diagnosztikai részpontok
összege automatikusan ellenőrzött.

A feladatokban használt referenciaeredmények és a teljes kész megoldás
mind a service-, mind a valódi HTTP-teszteken megfeleltek.

A TaskChecker.Submitter NuGet-csomag teljes HTTP-beküldését localhost
tesztszerver fogadta, kitalált diákadatokkal:
- helyes backend-rental-statistics-exam feladatazonosító és 1.0.0 verzió;
- 20 eredmény, külön service és controller bontással;
- 88 ellenőrzés, elvárt/kapott értékekkel és részpontokkal;
- 100 pont és beküldési JSON-előnézet.

Éles TaskChecker-beküldés nem történt.
A kiosztható feladat nem tartalmaz kész megoldást, diákadatot vagy próbabeadást.

