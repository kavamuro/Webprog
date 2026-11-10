# 01 Exam – autókölcsönző lekérdezései és statisztikái

.NET 8 / ASP.NET Core Web API / EF Core InMemory, egyetlen közös domainnel.
A feladatsor a 06-01-where-count-task és a 06-02-statistics-task tananyagára épül.
Négy beginner, három medium, két advanced és egy expert feladat.

**A diáknak a service-ben ÉS a controllerben kell dolgoznia.**
A részletes specifikáció: [FELADATOK.md](FELADATOK.md).
Pontozás és tesztfuttatás: [Tests/README.md](Tests/README.md).

## Indítás

A feladat gyökérkönyvtárában:

~~~powershell
dotnet restore Exam.sln
dotnet run --project App
~~~

Swagger: http://localhost:5086/swagger (a megadott launch profillal).
A kezdeti, hiányos controlleren még nincsenek GET-attribútumok: a Swaggerben
az endpointok a feladat megoldásával jelennek meg.

~~~powershell
dotnet run --project Tests -- --no-submit
~~~

Ez helyben pontoz, nem kér személyes adatot és nem küld eredményt.

~~~powershell
dotnet run --project Tests
~~~

Ez helyben pontoz, majd TaskCheckerbe küld. Első alkalommal bekéri a diák
azonosítóját, nevét és osztályát. A beküldés részletes teszteredményeket is tartalmaz.

## Fájlszerkezet

- App/Domain.cs: adott modell, enum, DTO és DbContext.
- App/SampleData.cs: tíz változatos mintaadat; a tesztek saját adathalmazokkal is dolgoznak.
- App/RentalQueryService.cs: a tíz megírandó service-metódus.
- App/Controllers/RentalsController.cs: megírandó actiontörzsek és attribútumok.
- App/Program.cs: kész DI, EF Core, Swagger és controller-regisztráció.
- Tests: kész, NuGet-alapú pontozó, külön service-, controller- és HTTP-tesztekkel.

A starter fordul; a service Task.FromResult(...) segítségével üres listát, 0-t vagy nullázott DTO-t ad vissza, a controller
501-et ad vissza. Ez szándékos: az üres váz nem kaphat pontot.

## Pontelosztás

| Szint | Feladatok | Service | Controller | Összesen |
|---|---|---:|---:|---:|
| Beginner | 01–04, egyenként 6 pont | 16 | 8 | 24 |
| Medium | 05–07, egyenként 10 pont | 18 | 12 | 30 |
| Advanced | 08–09, egyenként 14 pont | 18 | 10 | 28 |
| Expert | 10, 18 pont | 12 | 6 | 18 |
| **Összesen** | **10 feladat** | **64** | **36** | **100** |

Csak a diák által megírandó működés és attribútumok pontozottak.
Az adott osztálynevekért, öröklésért, DTO-kért és konstruktorért nem jár önálló pont.

## Tananyag

- [Where és Count](../../06-01-where-count-task/tananyag/README.md)
- [Statisztikai műveletek](../../06-02-statistics-task/tananyag/README.md)

