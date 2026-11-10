# Feladatlap – autókölcsönző backend

## Közös szabályok

Az AppDbContext.Rentals táblán dolgozz, EF Core LINQ segítségével.
A megoldandó fájlok:
- App/RentalQueryService.cs: a tíz metódus törzse;
- App/Controllers/RentalsController.cs: controller-/GET-attribútumok és actiontörzsek.

A domain, a DTO, a mintaadatok, az aláírások, a virtual módosítók és a DI adottak,
ezeket ne változtasd. A controller az injektált _service metódusát hívja, megfelelő
paraméterekkel, pontosan egyszer; a service eredményét Ok(...) válaszban adja tovább.
A controllerben ne írj külön adatbázis-lekérdezést, ne hozz létre új service-t.

A RentalsController örököljön a már adott ControllerBase-ből, legyen rajta:
- [ApiController]
- [Route("api/rentals")]

Minden endpoint GET, a lenti táblázat szerinti [HttpGet(...)] attribútummal.
Az adott Task<ActionResult<T>> action-aláírásokat tartsd meg. A sikeres válasz
mindig HTTP 200, listánál akár üres listával, számnál akár 0-val, riportnál nem null DTO-val.
Találat nélkül ne adj 404-et vagy 204-et.

Az időtartamok egész napok. Days a szerződéses időtartam, ActualDays a tényleges;
nem befejezett kölcsönzésnél ActualDays=0. Completed rekordnál lehet korai,
pontos vagy késői visszahozás. A pénzértékek decimal típusúak; a napidíj, extra díj
és költség nem negatív, de a profit lehet negatív. Az ExtraFee kölcsönzésenként
egyszeri díj. Pénzügyi számításokban a Days értéket használd, ne az ActualDays-t.

Minden statisztika üres vagy megfelelő találat nélküli halmazon 0.
Átlag és százalék double, kerekítés nélkül. A százalék skálája 0–100.
A kategóriaegyezés pontos, kis-/nagybetű- és szóközérzékeny:
Economy, economy és Economy szóközzel három eltérő érték.
Ne normalizáld a paramétert; az érvényességét viszont ellenőrizd a controllerben.

Használd a tanult Where, ToListAsync, CountAsync, SumAsync, MaxAsync, AverageAsync
műveleteket, szükség esetén nullable projekcióval és 0 alapértékkel.
Aggregáláshoz ne töltsd előre a teljes táblát memóriába. DTO több külön lekérdezéssel
is összeállítható. GroupBy, Any/All/Contains, rendezés, lapozás nem szükséges.
A listafeladat eredményének sorrendjét nem követeljük meg.
A lekérdezések adatot nem módosíthatnak, az eredmények nem lehetnek előre beírt állandók.

## Service és endpointok

A paraméter nélküli service-metódusoknál a zárójelek üresek.
Mindegyik service-metódus publikus, virtuális, és Task<T> visszatérésű, a starter szerint.

| # | Szint | Service-metódus | GET útvonal | Eredménytípus | Pont |
|---|---|---|---|---|---:|
| 01 | Beginner | GetActiveRentalsAsync() | /api/rentals/active | List<Rental> | 6 |
| 02 | Beginner | CountCompletedRentalsAsync() | /api/rentals/completed/count | int | 6 |
| 03 | Beginner | SumCompletedDaysAsync() | /api/rentals/completed/days/sum | int | 6 |
| 04 | Beginner | GetMaximumDailyRateAsync() | /api/rentals/daily-rate/max | decimal | 6 |
| 05 | Medium | GetPaidRevenueAsync() | /api/rentals/revenue/paid | decimal | 10 |
| 06 | Medium | GetAverageCompletedDaysAsync() | /api/rentals/completed/days/average | double | 10 |
| 07 | Medium | CountRentalsByCategoryAsync(string category, int minDays) | /api/rentals/by-category/count?category=Economy&minDays=3 | int | 10 |
| 08 | Advanced | GetLateReturnPercentageAsync() | /api/rentals/completed/late-percentage | double | 14 |
| 09 | Advanced | GetTotalProfitAsync() | /api/rentals/profit | decimal | 14 |
| 10 | Expert | GetCategoryReportAsync(string category) | /api/rentals/report?category=Economy | CategoryReportDto | 18 |

Az actionnevek a megfelelő service-metódusnevek Async végződés nélküli változatai.

## Beginner

### 01. Aktív kölcsönzések

Add vissza a Status == RentalStatus.Active rekordokat, minden eredeti mezővel.
A fizetettség nem feltétel. Üres találat: üres lista.

### 02. Befejezett kölcsönzések száma

Számold meg a Status == RentalStatus.Completed rekordokat.
A fizetettség nem feltétel; rekordokat számolj, ne napokat.

### 03. Befejezett napok összege

Összegezd a Completed rekordok szerződéses Days értékét.
Nem fizetett befejezett rekord is számít.

### 04. Legnagyobb napidíj

Add vissza minden rögzített kölcsönzés DailyRate értékének maximumát,
állapottól és fizetettségtől függetlenül. Üres adatbázis: 0.

## Medium

### 05. Tényleges bevétel

Csak Completed ÉS IsPaid rekordok:
Days * DailyRate + ExtraFee.
A kölcsönzésenkénti összegeket add össze; az extra díjat ne szorozd a napokkal.

### 06. Átlagos befejezett időtartam

A Completed rekordok Days értékének számtani átlaga.
Nem fizetett rekord is számít; az ActualDays értékét ne használd.

### 07. Paraméterezett darabszám

Számold meg azokat a rekordokat, ahol Category == category ÉS Days >= minDays.
Minden állapot és fizetettség számít. A minimum határa is beleszámít.
A service érvényes paramétereket kap.

A controller query paraméterként fogadja a category és minDays értékét:
- category kötelező, nem lehet üres vagy kizárólag szóköz;
- minDays >= 1;
- hibás vagy hiányzó értékre HTTP 400, service-hívás nélkül;
- érvényes, de nem létező kategóriára HTTP 200 és 0.

Példa: /api/rentals/by-category/count?category=SUV&minDays=3

## Advanced

### 08. Késő visszahozások százaléka

Csak a Completed rekordokon számolj.
Késő az a visszahozás, ahol ActualDays > Days; az egyenlőség nem késés.
Eredmény: 100.0 * késő Completed rekordok száma / összes Completed rekord száma.
Ha nincs befejezett rekord: 0. A fizetettség nem feltétel.

### 09. Összesített profit

Csak Completed ÉS IsPaid rekordok profitja számít:
(Days * DailyRate + ExtraFee) - Days * CostPerDay.
A veszteséges rekordokat és a negatív végeredményt is tartsd meg.

## Expert

### 10. Kategória összesítő riportja

Először szűrj Category == category feltétellel.
A visszaadott CategoryReportDto mezői:

| Mező | Jelentés |
|---|---|
| TotalCount | A kategória minden rekordjának száma. |
| CompletedCount | A kategória Completed rekordjainak száma. |
| PaidCompletedCount | A kategória Completed ÉS IsPaid rekordjainak száma. |
| RealizedRevenue | A kategória Completed ÉS IsPaid rekordjainak Days * DailyRate + ExtraFee összege. |
| AverageCompletedDays | A kategória minden Completed rekordjának Days átlaga. |
| LateReturnPercentage | A kategória Completed rekordjai közül az ActualDays > Days rekordok aránya, százalékban. |

Minden nevező a megfelelő kategórián belül értendő. Nulla nevezőnél a mező 0.
Nem létező kategóriára hat nulla mezőt tartalmazó DTO-t adj, ne null-t.

A controller category query paramétere kötelező és nem lehet kizárólag szóköz.
Hibás vagy hiányzó paraméter: HTTP 400, service-hívás nélkül.
Érvényes kategória: HTTP 200 és a teljes DTO.

## Mintaadatok ellenőrző eredményei

| Feladat | Eredmény |
|---|---|
| 01 | 1 és 8 azonosítójú rekordok, eredeti adataikkal |
| 02 | 6 |
| 03 | 13 |
| 04 | 500 |
| 05 | 1495 |
| 06 | 13 / 6 = 2,166666… |
| 07, Economy és minDays=3 | 2 |
| 08 | 100 / 3 = 33,333333… |
| 09 | 395 |
| 10, Economy | TotalCount=4; CompletedCount=2; PaidCompletedCount=2; RealizedRevenue=820; AverageCompletedDays=3; LateReturnPercentage=50 |

A tesztek nem kizárólag a mintaadatokat használják: más adatbázisokon is helyes
lekérdezést és a service eredményét valóban továbbító controllert várnak.
