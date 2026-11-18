# 01. Alapok – a Web API-tól a kliens állapotsoráig

- [Megoldás megnyitása](src/MyApp.slnx)
- [Tananyag: A szerver állapotának megjelenítése WPF-ben, MAUI-ban és WinUI-ban](doc/szerver-allapota.md)
- [Tananyag: Többprojektes .NET 10 megoldás létrehozása Visual Studio 2026-ban](doc/tobbprojektes-megoldas.md)

A három felhasználói kliens induláskor ellenőrzi a `GET /api/health` végpontot, és az állapotsorban mutatja az eredményt. Sikertelen ellenőrzés után az **Újrapróbálás** gomb ismét elküldi a kérést. Az adminfelületek a későbbi gyakorlatokhoz üres kiinduló projektek.

A backend a `http://localhost:5056` címen fut a **http** indítási profillal. Fejlesztői környezetben a Swagger UI az `/swagger`, az OpenAPI-leírás az `/openapi/v1.json` címen érhető el. A két MAUI-projekt kizárólag Windowst céloz.

A teljes fordítást az `src` mappából indítsd a `dotnet build MyApp.slnx -m:1 -p:Platform=x64` paranccsal. A kipróbálási parancsokat és a három állapot ellenőrzését a tananyag végén találod. Visual Studióban a **Web API** indítási profillal a backend, a **Web API + összes felület** profillal a backend és mind a hat alkalmazás indul.

[Következő lépés – közös állapot és három nyelv](../02-shared-state-and-localization/README.md)
