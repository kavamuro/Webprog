# 02 Exam – ételkiszállító konyha lekérdezései és statisztikái

.NET 8 / ASP.NET Core Web API / EF Core InMemory.
Négy beginner, három medium, két advanced és egy expert feladat a
06-01-where-count-task és 06-02-statistics-task tananyagára építve.

**A service és a controller megírása is a diák feladata.**

- [Részletes feladatlap](FELADATOK.md)
- [Pontozó használata és értékelési terv](Tests/README.md)
- [A pontozó ellenőrzése](Tests/VERIFICATION.md)

## Indítás a feladat mappájában

~~~powershell
dotnet restore Exam.sln
dotnet run --project App
~~~

Swagger: http://localhost:5087/swagger, a mellékelt launch profillal.
A kezdőcontrollerből hiányoznak az attribútumok: a végpontok a megoldás során jelennek meg.

Helyi pontozás, személyes adatok és beküldés nélkül:

~~~powershell
dotnet run --project Tests -- --no-submit
~~~

Pontozás és TaskChecker-beküldés, azonosító, név és osztály bekérésével:

~~~powershell
dotnet run --project Tests
~~~

## Tartalom

- App/Domain.cs: FoodOrder, OrderStatus, ZoneReportDto, AppDbContext.
- App/SampleData.cs: tíz különböző rendelés.
- App/FoodOrderQueryService.cs: tíz megírandó service-metódus.
- App/Controllers/OrdersController.cs: megírandó actiontörzsek és attribútumok.
- App/Program.cs: kész EF, dependency injection és Swagger.
- Tests: NuGet-alapú pontozó, service-, controller- és valódi HTTP-tesztekkel.

A váz lefordul. A service kezdetben Task.FromResult(...) segítségével üres listát, 0-t vagy nullázott DTO-t ad vissza,
a controller 501 választ ad; a kiinduló projekt 0/100 pont.

| Szint | Feladat | Service | Controller | Összesen |
|---|---|---:|---:|---:|
| Beginner | 01–04 | 16 | 8 | 24 |
| Medium | 05–07 | 18 | 12 | 30 |
| Advanced | 08–09 | 18 | 10 | 28 |
| Expert | 10 | 12 | 6 | 18 |
| **Összesen** | **10** | **64** | **36** | **100** |

A kapott konstruktorért, DTO-ért, modellért és osztályvázért nem jár önálló pont.
A pontozó a megírandó működést és attribútumokat értékeli.

Kapcsolódó tananyag:
- [EF Where és Count](../../06-01-where-count-task/tananyag/README.md)
- [EF statisztika](../../06-02-statistics-task/tananyag/README.md)

