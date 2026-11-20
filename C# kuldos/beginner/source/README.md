# 01. Alapok – a Web API-tól a kliens állapotszövegéig

[A mintaprojekt mappájának megnyitása](./)

Másold a teljes mintamappát a saját munkamappádba, majd nyisd meg a `src/MyApp.slnx` fájlt Visual Studióban.

- [Tananyag: A szerver állapotának megjelenítése WPF-ben, MAUI-ban és WinUI-ban](doc/szerver-allapota.md)
- [Tananyag: Többprojektes .NET 10 megoldás létrehozása Visual Studio 2026-ban](doc/tobbprojektes-megoldas.md)

Mindhárom felhasználói kliensben az **Ellenőrzés** gomb hívja meg a `GET /api/health` végpontot a ViewModel parancsán keresztül. A felületen egyetlen szöveg jelenik meg: **A szerver működik** vagy **A szerver nem működik**. Az adminfelületek a későbbi gyakorlatokhoz üres kiinduló projektek.

A backend a `http://localhost:5056` címen fut a **http** indítási profillal. Fejlesztői környezetben a Swagger UI az `/swagger`, az OpenAPI-leírás az `/openapi/v1.json` címen érhető el. A két MAUI-projekt kizárólag Windowst céloz.

A teljes fordítást az `src` mappából indítsd a `dotnet build MyApp.slnx -m:1 -p:Platform=x64` paranccsal. A kipróbálási parancsokat és a két eredmény ellenőrzését a tananyag végén találod. Visual Studióban a **Web API** indítási profillal a backend, a **Web API + összes felület** profillal a backend és mind a hat alkalmazás indul.

[Következő lépés – állapotjelzés és újrapróbálás](../../../html/health-medium.html)

[React-kliens indítása és tananyaga](../../../../html_react/health-beginner.html)
