# Pontozó – service és controller

## Futtatás

A feladat gyökérkönyvtárából:

~~~powershell
dotnet run --project Tests -- --no-submit
~~~

Ez csak helyi pontozás. Beküldéshez:

~~~powershell
dotnet run --project Tests
~~~

A TaskChecker.Submitter NuGet-csomag első alkalommal bekéri az azonosítót, nevet
és osztályt, majd a Tests/TaskChecker/adataim.json fájlba menti.
A beküldési előnézet a futtatott program könyvtárába kerül:
Tests/bin/Debug/net8.0/submission-preview.json.
Ezek személyes adatot tartalmazhatnak, a .gitignore kizárja őket.

Feladatazonosító: backend-rental-statistics-exam.
Verzió: 1.0.0. API: https://taskchecker.gysoft.hu.
A részletes diagnosztika bekapcsolt: minden ellenőrzésnek külön azonosítója,
pontértéke, elvárt/kapott eredménye és magyarázata van.
A submissionMode=Basic biztonsági mód, nem a részletességet jelöli.

A program alapértelmezésben a TaskCheckerbe is beküld. Az éles feladatregisztráció
szerveroldali műveletét a tesztprojekt nem végzi el.
Fejlesztői API-felülbírálás: .taskchecker.local.json vagy TASKCHECKER_API_BASE_URL.

Kilépési kódok: 0 = teljes pont és (ha kért) sikeres beküldés;
1 = részleges/hibás megoldás; 2 = használati vagy beküldési hiba.

## Mit vizsgál?

1. Service: külön, minden tesztnél friss EF Core InMemory adatbázison futtatja a valódi service-t.
   Vegyes állapotokkal, fizetett/nem fizetett rekordokkal, határértékekkel,
   törtszámokkal, üres adatbázissal és találat nélküli szűréssel ellenőriz.
2. Controller-attribútumok: ApiController, api/rentals alapútvonal,
   előírt action és HttpGet útvonal.
3. Service-delegálás: a controller helyettesítő service-t kap, és annak eltérő
   próbaeredményét kell Ok(...) válaszban továbbadnia. Ellenőrizzük a pontos
   metódust, hívásszámot és paramétereket. Így a controller ezen pontjai akkor is
   megszerezhetők, ha a valódi service még nincs megírva.
4. HTTP-integráció: a Microsoft.AspNetCore.TestHost tesztszerver valódi routingot,
   paraméterkötést, DI-t és JSON-választ ellenőriz a tényleges service-szel és EF-fel.
   A pontokhoz a service és controller együttműködése is szükséges.
5. A paraméterezett endpointok hibás bemenetére 400-at és nulla service-hívást várunk.

Nincs szükség külön elindított App-ra, éles adatbázisra vagy internetre a helyi
pontozáshoz a NuGet-csomagok első visszaállítása után.
A tesztszerver nem nyit nyilvános hálózati portot.

## Pontozási terv

| # | Service-részpontok | Service | Controller | Összesen |
|---|---|---:|---:|---:|
| 01 | Vegyes adatok 2; nincs találat 1; üres 1 | 4 | 2 | 6 |
| 02 | Vegyes adatok 2; nincs találat 1; üres 1 | 4 | 2 | 6 |
| 03 | Összeg és szűrés 2; egy rekord 1; üres 1 | 4 | 2 | 6 |
| 04 | Maximum minden állapotból 2; tört díj 1; üres 1 | 4 | 2 | 6 |
| 05 | Szűrés 2; képlet 2; tört pénz 1; nincs találat 0,5; üres 0,5 | 6 | 4 | 10 |
| 06 | Szűrés 2; tört átlag 2; fizetettség független 1; nincs találat 0,5; üres 0,5 | 6 | 4 | 10 |
| 07 | Kategória 2; minimumhatár 2; más paraméterek 1; nincs találat 0,5; üres 0,5 | 6 | 4 | 10 |
| 08 | Nevező 3; szigorú késésfeltétel 2; tört százalék 2; nincs találat 1; üres 1 | 9 | 5 | 14 |
| 09 | Szűrés 2; képlet 3; negatív profit 1; vegyes profit 1; tört pénz 1; nincs találat 0,5; üres 0,5 | 9 | 5 | 14 |
| 10 | Teljes DTO 4; más kategória 2; üres 1; nincs kategóriatalálat 1; nincs Completed 1; nem fizetett Completed 1; törtek 2 | 12 | 6 | 18 |
| **Összesen** | | **64** | **36** | **100** |

Controller-részpontok:
- Beginner: attribútumok és útvonal 0,5; service-delegálás 0,5; HTTP-adatok 0,5; HTTP-üres esetek 0,5.
- Medium 05–06: attribútumok és útvonal 1; delegálás 1; HTTP-adatok 1; HTTP-üres esetek 1.
- Medium 07: attribútumok és útvonal 1; delegálás 1; paraméterellenőrzés 1;
  HTTP-adatok 0,5; HTTP-üres esetek 0,5.
- Advanced: attribútumok és útvonal 1; delegálás 2; HTTP-adatok 1; HTTP-üres esetek 1.
- Expert: attribútumok és útvonal 1; delegálás 2; paraméterellenőrzés 1;
  HTTP-adatok 1; HTTP-üres esetek 1.

A HTTP-adatok és HTTP-üres csoportok több külön kérést tartalmaznak.
A csoport pontja az összes felsorolt kérés teljesítésekor jár, az elvárt és kapott
értékek kérésenként megjelennek a konzolon és a diagnosztikában.
A kész konstruktorra és osztályvázra nincs külön pont.

## Összehasonlítás és hibakezelés

- int és decimal: pontos egyezés.
- double: legfeljebb 0,000001 abszolút eltérés; NaN és végtelen hibás.
- Lista: az összes mező és rekord számít, a sorrend nem.
- DTO: mind a hat mező ellenőrzött, double mezőknél tűréssel.
- Nulla/üres service-eredményre csak legalább egy sikeres nem nulla service-teszt után jár pont.
- HTTP-üres esetekre a nem nulla HTTP-tesztek sikeres teljesítése után jár pont.
- A service adatmódosítása az adott service-metódus teljes pontszámát nullázza.
- Egy service-/action-kivétel teszthibává válik, a többi feladat pontozása folytatódik.
- Egy hívásra 5 másodperc időkorlát van; a tesztek nem rosszindulatú programok izolálására szolgálnak.
- A le nem forduló App projektet a tesztek indítása előtt javítani kell.

Az automatikus pontozás működési vizsgálat. Az EF Core InMemory provider nem igazolja
egy SQL-provider fordíthatóságát vagy az aggregálások adatbázisoldali végrehajtását.
Az előírt aszinkron EF-műveletek, a korai materializálás kerülése és a változatlan
aláírások kézi szakmai ellenőrzés tárgyai. Ez a projekt nem pontozza az adott infrastruktúrát.

