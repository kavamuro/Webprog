# Pontozó – service és controller

## Futtatás a feladat mappájában

~~~powershell
dotnet run --project Tests -- --no-submit
~~~

Csak helyi pontozás, személyes adat és beküldés nélkül.

~~~powershell
dotnet run --project Tests
~~~

Pontozás és TaskChecker-beküldés. Az első beküldéskor a NuGet-csomag bekéri
az azonosítót, nevet és osztályt, és a Tests/TaskChecker/adataim.json fájlba menti.
A beküldési JSON-előnézet a futtatott program könyvtárába kerül, például
Tests/bin/Debug/net8.0/submission-preview.json. A .gitignore kizárja ezeket a személyes fájlokat.

Feladatazonosító: backend-catering-statistics-exam. Verzió: 1.0.0.
API: https://taskchecker.gysoft.hu.
A GradingDetailMode.Diagnostics részletes ellenőrzésenkénti beküldést jelent:
azonosító, cím, pontérték, eredmény, elvárt/kapott érték és magyarázat.
A submissionMode=Basic ettől független biztonsági beállítás.

NuGet-csomagok: TaskChecker.Grading 2.1.1, TaskChecker.Submitter 1.1.3,
Microsoft.AspNetCore.TestHost 8.0.22.
A projekt nem végez szerveroldali feladatregisztrációt.
Fejlesztői API-felülbírálás: .taskchecker.local.json vagy TASKCHECKER_API_BASE_URL.

Kilépési kód: 0 = 100 pont és (ha kért) sikeres beküldés;
1 = részleges/hibás megoldás; 2 = használati/beküldési hiba.

## Tesztelési mód

- A valódi service minden tesztben friss EF Core InMemory adatbázist kap.
- A controller-attribútumokat és GET-útvonalakat külön vizsgáljuk.
- Helyettesítő service ellenőrzi a controller pontos, egyszeri metódushívását,
  paramétereit és Ok(...) válaszát. Ezek a pontok hibás valódi service mellett is megszerezhetők.
- A valódi ASP.NET Core HTTP-tesztek routingot, query-paraméterkötést, DI-t,
  JSON-választ, a tényleges service-t és EF-lekérdezéseket együtt ellenőriznek.
- Hibás paraméternél 400 szükséges, service-hívás nélkül.

A konzol feladatonként és rétegenként csoportosít. Minden teszt mellett jelzi,
mi volt a követelmény, mennyi pont jár érte, mi az elvárt és mi a kapott eredmény.
A HTTP-csoportok minden egyes kérésének eredménye külön sorban szerepel.
Külön App-indítás és valódi adatbázis nem szükséges.
Az első NuGet-visszaállítás után a --no-submit pontozáshoz internet sem kell.

## Pontozás – 88 ellenőrzés, 100 pont

| # | Service-részpontok | Service | Controller | Összesen |
|---|---|---:|---:|---:|
| 01 | Vegyes állapotok 2; nincs találat 1; üres 1 | 4 | 2 | 6 |
| 02 | Vegyes állapotok 2; nincs találat 1; üres 1 | 4 | 2 | 6 |
| 03 | Szűrés és adagösszeg 2; egy rekord 1; üres 1 | 4 | 2 | 6 |
| 04 | Maximum minden állapotból 2; tört ár 1; üres 1 | 4 | 2 | 6 |
| 05 | Szűrés 2; képlet kedvezménnyel 2; tört pénz 1; nincs találat 0,5; üres 0,5 | 6 | 4 | 10 |
| 06 | Tényleges idő szűrt átlaga 2; tört átlag 2; fizetettség független 1; nincs találat 0,5; üres 0,5 | 6 | 4 | 10 |
| 07 | Körzet 2; minimumhatár 2; más paraméterek 1; nincs találat 0,5; üres 0,5 | 6 | 4 | 10 |
| 08 | Nevező 3; szigorú késésfeltétel 2; tört százalék 2; nincs találat 1; üres 1 | 9 | 5 | 14 |
| 09 | Szűrés 2; képlet 3; negatív profit 1; vegyes profit 1; tört pénz 1; nincs találat 0,5; üres 0,5 | 9 | 5 | 14 |
| 10 | Teljes DTO 4; más körzet 2; üres 1; nincs körzettalálat 1; nincs kézbesített 1; nem fizetett kézbesített 1; törtek 2 | 12 | 6 | 18 |
| **Összesen** | | **64** | **36** | **100** |

Controller-részpontok:
- Beginner: attribútumok és útvonal 0,5; delegálás 0,5; HTTP-adatok 0,5; HTTP-üres esetek 0,5.
- Medium 05–06: attribútumok és útvonal 1; delegálás 1; HTTP-adatok 1; HTTP-üres esetek 1.
- Medium 07: attribútumok és útvonal 1; delegálás 1; validáció 1; HTTP-adatok 0,5; HTTP-üres esetek 0,5.
- Advanced: attribútumok és útvonal 1; delegálás 2; HTTP-adatok 1; HTTP-üres esetek 1.
- Expert: attribútumok és útvonal 1; delegálás 2; validáció 1; HTTP-adatok 1; HTTP-üres esetek 1.

A HTTP-adatok és HTTP-üres csoportok pontja az összes felsorolt kérés teljesítésekor jár.
A service-ellenőrzések önálló részpontozási egységek.
A meglevő infrastruktúráért, konstruktorért és osztályvázért nincs önálló pont.

## Értékelési szabályok

- int és decimal: pontos egyezés.
- double: 0,000001 abszolút tűrés; NaN/végtelen hibás.
- Lista: minden rekord és mező ellenőrzött; sorrend nincs előírva.
- DTO: mind a hat mező ellenőrzött, double mezőknél tűréssel.
- Nulla/üres service-tesztre csak sikeres nem nulla service-teszt után jár pont.
- HTTP-üres tesztcsoporthoz a nem nulla HTTP-tesztcsoport teljesítése szükséges.
- Adatmódosítás az érintett service-metódus teljes pontszámát nullázza.
- Egy metódus kivétele teszthiba, a többi feladat pontozása folytatódik.
- Hívásonként 5 másodperc időkorlát. A teszt nem rosszindulatú programok izolálására szolgál.
- Fordítási hibát a pontozás előtt javítani kell.

Az automatikus vizsgálat működési követelményeket pontoz. Az InMemory provider
nem igazolja az SQL-provider fordíthatóságát vagy az adatbázisoldali aggregálást.
Az aszinkron EF-használat, a korai materializálás kerülése és a változatlan
aláírások kézi szakmai ellenőrzés tárgyai.
