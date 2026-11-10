# Feladatlap – ételkiszállító konyha backendje

Egy konyha megrendeléseit az AppDbContext.Orders tárolja.
A FoodOrder és a mintaadatok adottak. EF Core service-lekérdezéseket és az azokat
publikáló REST API-t kell készítened.

## Hol dolgozz?

1. App/FoodOrderQueryService.cs: a tíz metódus törzse.
2. App/Controllers/OrdersController.cs: az attribútumok és az actiontörzsek.

Az aláírásokat, virtual módosítókat, domaint, DTO-t és az adott infrastruktúrát
ne változtasd. A controller az injektált _service megfelelő metódusát hívja,
pontosan egyszer, változatlan paraméterekkel, és annak eredményét adja tovább
Ok(...) válaszban. Ne példányosíts új service-t, és a controllerben ne írj EF-lekérdezést.

A controller kapja meg az [ApiController] és [Route("api/orders")] attribútumokat.
Minden action GET, a táblázat szerinti [HttpGet] útvonallal.
Tartsd meg az adott Task<ActionResult<T>> visszatérési típusokat.

A sikeres válasz HTTP 200. Üres találat esetén üres listát, 0 számértéket,
illetve nem null, nullázott DTO-t adj; ne 204-et vagy 404-et.

## A domain értelmezése

| Mező | Jelentés |
|---|---|
| Status | Received: beérkezett; Preparing: előkészítés alatt; Delivered: kézbesített; Cancelled: törölt. |
| DeliveryZone | Pontosan összehasonlítandó kiszállítási körzet. |
| Portions | Rendelésben szereplő adagok száma, legalább 1. |
| PlannedPrepMinutes | Tervezett elkészítési idő percben, pozitív egész. |
| ActualPrepMinutes | Tényleges elkészítési idő; Delivered esetén pozitív, más állapotnál 0. |
| UnitPrice | Egy adag ára. |
| DeliveryFee | Rendelésenként egyszer felszámított kiszállítási díj. |
| DiscountAmount | Rendelésenként egyszer levonandó fix pénzösszeg, nem százalék és nem adagonkénti érték. |
| CostPerPortion | Egy adag becsült költsége. |
| IsPaid | A rendelés kifizetettsége, a Status értékétől függetlenül. |

A pénzadatok decimal típusúak, nem negatívak. A kedvezmény legfeljebb az adagok
árának összege lehet; a kiszállítási díj ilyenkor is megmarad. Profit lehet negatív.
A pénzügyi képletben adagszám szerepel, nem elkészítési idő.

A körzetegyezés kis-/nagybetű- és szóközérzékeny:
Center, center és Center szóközzel eltérő érték.
Az érvényesség ellenőrzése után a paramétert változtatás nélkül add tovább.

Minden összeg, maximum, átlag és arány üres vagy megfelelő rekord nélküli
halmazon 0. Átlag és százalék double, kerekítés nélkül; a százalék 0–100-as skálán.

## Tanult eszközök

Használd az EF Core Where, ToListAsync, CountAsync, SumAsync, MaxAsync,
AverageAsync műveleteket. Üres átlaghoz/maximumhoz nullable projekció és 0
alapérték is használható. Aggregáláshoz ne materializáld előre a teljes táblát.
A DTO több külön lekérdezéssel is elkészíthető.
GroupBy, Any/All/Contains, rendezés és lapozás nem szükséges.
Listánál a sorrend nem előírás. A lekérdezések adatot nem módosíthatnak.

## Service és endpointok

Minden service-metódus publikus, virtuális, Task<T> visszatérésű.
Az actionnév a service-metódus neve Async nélkül.

| # | Szint | Service | GET útvonal | T | Pont |
|---|---|---|---|---|---:|
| 01 | Beginner | GetPreparingOrdersAsync() | /api/orders/preparing | List<FoodOrder> | 6 |
| 02 | Beginner | CountDeliveredOrdersAsync() | /api/orders/delivered/count | int | 6 |
| 03 | Beginner | SumDeliveredPortionsAsync() | /api/orders/delivered/portions/sum | int | 6 |
| 04 | Beginner | GetMaximumUnitPriceAsync() | /api/orders/unit-price/max | decimal | 6 |
| 05 | Medium | GetPaidRevenueAsync() | /api/orders/revenue/paid | decimal | 10 |
| 06 | Medium | GetAverageDeliveredPrepMinutesAsync() | /api/orders/delivered/prep-minutes/average | double | 10 |
| 07 | Medium | CountOrdersByZoneAsync(string zone, int minPortions) | /api/orders/by-zone/count?zone=Center&minPortions=3 | int | 10 |
| 08 | Advanced | GetLatePreparationPercentageAsync() | /api/orders/delivered/late-percentage | double | 14 |
| 09 | Advanced | GetTotalProfitAsync() | /api/orders/profit | decimal | 14 |
| 10 | Expert | GetZoneReportAsync(string zone) | /api/orders/report?zone=Center | ZoneReportDto | 18 |

## Beginner

### 01. Előkészítés alatt álló rendelések

Add vissza a Status == OrderStatus.Preparing rekordokat, teljes eredeti adataikkal.
A fizetettség nem feltétel. Találat nélkül üres lista.

### 02. Kézbesített rendelések száma

Számold meg a Delivered rekordokat, fizetettségtől függetlenül.
Rekordokat számolj, ne adagokat.

### 03. Kézbesített adagok összege

A Delivered rekordok Portions értékeit add össze.
A nem fizetett kézbesített rendelések is számítanak.

### 04. Legnagyobb adagonkénti ár

Az összes rendelés UnitPrice maximumát add vissza, minden állapotból.
Üres adatbázison 0.

## Medium

### 05. Tényleges kedvezményes bevétel

Kizárólag Delivered ÉS IsPaid rendeléseken számolj.
Rendelésenként: Portions * UnitPrice + DeliveryFee - DiscountAmount.
Ezeket az értékeket add össze. A díj és a kedvezmény is egyszeri.
Példa: 2 * 1000 + 200 - 100 = 2100.

### 06. Átlagos tényleges elkészítési idő

Minden Delivered rendelés ActualPrepMinutes értékének egyszerű számtani átlaga.
A fizetettség nem feltétel. Ne a tervezett idővel és ne az adagszámmal számolj.
Nincs kézbesített rendelés: 0.

### 07. Körzet és minimum adagszám szerinti darabszám

A DeliveryZone == zone ÉS Portions >= minPortions rekordok darabszáma kell.
Minden állapot és fizetettség számít. A minimum határa is beleszámít.

A controller query paramétereket fogad:
- zone kötelező, nem üres és nem csak szóköz;
- minPortions kötelező, legalább 1;
- hibás vagy hiányzó érték: HTTP 400, service-hívás nélkül;
- érvényes, nem létező körzet: HTTP 200 és 0.

A service csak érvényes paramétereket kap.

## Advanced

### 08. Késői elkészítések százaléka

Csak a Delivered rendelések körében számolj.
Késői az elkészítés, ha ActualPrepMinutes > PlannedPrepMinutes.
Pontos vagy korai elkészítés nem késés.
Eredmény: 100.0 * késői Delivered rendelések száma / összes Delivered rendelés száma.
A fizetettség nem feltétel. Nulla nevező esetén 0.

### 09. Összesített profit

Csak Delivered ÉS IsPaid rekordok:
Portions * UnitPrice + DeliveryFee - DiscountAmount - Portions * CostPerPortion.
A veszteséges rekordokat és a negatív végeredményt is vedd figyelembe.
Példa: 2 * 1000 + 200 - 100 - 2 * 400 = 1300.

## Expert

### 10. Kiszállítási körzet összesítő riportja

Először pontos DeliveryZone == zone feltétellel szűrj.
A ZoneReportDto mind a hat mezője ezen a körzeten belül értendő:

| Mező | Számítás |
|---|---|
| TotalCount | Minden körzetbeli rendelés darabszáma. |
| DeliveredCount | A körzet Delivered rendeléseinek száma. |
| PaidDeliveredCount | A körzet Delivered ÉS IsPaid rendeléseinek száma. |
| RealizedRevenue | A körzet Delivered ÉS IsPaid rendeléseinek kedvezményes bevétele, az 05. képlet szerint. |
| AveragePrepMinutes | A körzet összes Delivered rendelésének ActualPrepMinutes átlaga. |
| LatePreparationPercentage | A körzet Delivered rendelései közül a késői elkészítések százaléka, a 08. képlet szerint. |

Nulla nevezőnél a mező 0. Nem létező körzetre mind a hat mező 0, a DTO nem null.
A controller zone query paramétere kötelező, nem lehet üres vagy csak szóköz.
Hibás/hiányzó paraméter: HTTP 400 service-hívás nélkül.
Érvényes paraméter: HTTP 200 és teljes DTO.

## Mintaadatok referenciaeredményei

| Feladat | Eredmény |
|---|---|
| 01 | 1 és 8 azonosítójú rendelés, eredeti adataikkal |
| 02 | 6 |
| 03 | 13 |
| 04 | 5000 |
| 05 | 14250 |
| 06 | 193 / 6 = 32,166666… |
| 07, Center és minPortions=3 | 2 |
| 08 | 100 / 3 = 33,333333… |
| 09 | 3250 |
| 10, Center | TotalCount=4; DeliveredCount=2; PaidDeliveredCount=2; RealizedRevenue=7600; AveragePrepMinutes=40; LatePreparationPercentage=50 |

A tesztek saját adathalmazokkal is dolgoznak, ezért az eredményeket ne írd be állandóként.
