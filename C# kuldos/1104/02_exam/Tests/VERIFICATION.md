# A pontozó ellenőrzése

A feladatsor 88 stabil azonosítójú ellenőrzést tartalmaz:
46 service- és 42 controller-ellenőrzést. A HTTP-ellenőrzések több külön kérést
tartalmaznak. Minden service- és HTTP-adathalmaz elkülönített adatbázist kap.

Az elkülönített ellenőrző projekt eredményei:

| Változat | Service / 64 | Controller / 36 | Összesen / 100 |
|---|---:|---:|---:|
| Helyes megoldás | 64 | 36 | 100 |
| Minden service-metódus kivételt dob | 0 | 21 | 21 |
| Működő service, 501-es controller a sikeres kérésekre | 64 | 10 | 74 |
| Működő service, előre beírt alapértékeket visszaadó controller | 64 | 10 | 74 |
| Hiányzó kézi paraméterellenőrzés | 64 | 35 | 99 |
| NaN értékű skalár átlag és százalék | 49 | 32 | 81 |
| Végtelen skalár átlag és százalék | 49 | 32 | 81 |
| Fizetettségi feltétel kihagyása | 59 | 32 | 91 |
| Kedvezmény kihagyása a bevételből | 61 | 34 | 95 |
| Kedvezmény hibás felszorzása az adagszámmal | 61 | 34 | 95 |
| Kiszállítási díj hibás felszorzása az adagszámmal | 61 | 34 | 95 |
| Tervezett idő átlaga a tényleges idő helyett | 58 | 34 | 92 |
| Egészre csonkolt időátlag | 62 | 34 | 96 |
| Kizáró minimumhatár | 58 | 35 | 93 |
| Hibás százaléknevező | 61 | 34 | 95 |
| Veszteséges rekordok nullázása | 62 | 34 | 96 |
| Körzetszűrés nélküli riport | 57 | 34 | 91 |
| Adatot módosító service | 0 | 35 | 35 |

A kiosztható, megoldatlan service/controller váz 0/100 pontot kap.
Mind a tíz publikált mintaeredmény egyezik az elkülönített helyes megoldással.

A teljes NuGet-alapú beküldés localhost tesztszerverrel is ellenőrzött:
- helyes backend-catering-statistics-exam feladatazonosító;
- húsz rétegenkénti eredmény, 88 ellenőrzés, összesen 100 pont;
- elvárt/kapott értékek és diagnosztikai részpontok;
- kitalált tesztdiák-azonosító és JSON-előnézet.

A kiosztható feladat nem tartalmaz kész megoldást vagy személyes adatot.
Az ellenőrzés nem küldött eredményt az éles TaskCheckerbe.
Az InMemory működési tesztek korlátait lásd a Tests/README.md leírásában.
