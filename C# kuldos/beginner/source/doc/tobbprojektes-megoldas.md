# Többprojektes .NET 10 megoldás létrehozása Visual Studio 2026-ban

A gyakorlat végére egy solutionben lesz egy Web API, két közös könyvtár és hat felület. Összehasonlításhoz másold ki a teljes [kiinduló `src` mappát](../src/), és a másolatból nyisd meg a `MyApp.slnx` fájlt Visual Studióban.

A Visual Studio Installerben legyen elérhető az ASP.NET, a .NET asztali, a MAUI és a WinUI fejlesztési támogatás. A gyakorlat a **10.0.403 SDK**-hoz igazodik. A [minta global.json fájljával](../src/global.json) válaszd ki az SDK-t, majd az `src` mappából futtasd a `dotnet --version` parancsot. [Microsoft Learn – SDK és Visual Studio verziók](https://learn.microsoft.com/dotnet/core/porting/versioning-sdk-msbuild-vs)

## 1. Készítsd elő a mappákat és a solutiont

Hozz létre egy munkamappát, benne `src` és `doc` almappával. A solution és a fordítandó kód az `src`, a leírások a `doc` mappába kerülnek. A kódon belül a `backend`, `shared` és `frontend` mappa a szervert, a közös kódot és a felületeket csoportosítja. A felületeken belül először a szerepkör (`admin` vagy `client`), utána a technológia alapján tájékozódhatsz.

A **Blank Solution** sablonnal hozz létre egy `MyApp` nevű solutiont közvetlenül az `src` mappában. A Visual Studio `.slnx` formátuma is használható, a minta `.sln` fájlt tartalmaz. A **Solution Explorer** nézetben a solutionön jobb kattintással válaszd az **Add → New Project** parancsot. A **Location** mező a lemezen lévő helyet adja meg. A solutionmappák a Visual Studio fájában jelenítik meg ugyanezt a csoportosítást.

## 2. Hozd létre a közös könyvtárakat és a backendet

| Projekt | Sablon | Hely az `src` alatt | Szerepe |
| --- | --- | --- | --- |
| `MyApp.Shared` | Class Library (C#) | `shared/MyApp.Shared` | Közös kérés- és válaszmodellek, azaz DTO-k. |
| `MyApp.Client` | Class Library (C#) | `shared/MyApp.Client` | A felületek közös API-kliensének és ViewModeljeinek helye. |
| `MyApp.WebApi` | ASP.NET Core Web API | `backend/MyApp.WebApi` | HTTP-végpontok, később üzleti logika és adatkezelés. |

A két könyvtárnál válaszd a **.NET 10.0** keretrendszert és a `shared` szülőmappát. Törölheted a sablon `Class1.cs` fájlját. A `MyApp.Client` NuGet-csomagjaihoz add hozzá a `CommunityToolkit.Mvvm` csomagot. A mintában a verziója `8.4.0`.

A Web API-nál a **Location** a `backend` mappa legyen. Válaszd a **.NET 10.0** keretrendszert, állítsd az **Authentication type** értékét **None**-ra, és jelöld be a **Use controllers** és **Enable OpenAPI support** opciót. Állítsd a backendet indítóprojektnek, futtasd a `http` profillal, majd nyisd meg a terminálban megjelenő címen a `/weatherforecast` útvonalat. Ugyanezen a címen az `/openapi/v1.json` az API JSON-leírását adja fejlesztői környezetben. A mintában a port `5287`, a saját projektedben eltérhet. [Microsoft Learn – OpenAPI az ASP.NET Core-ban](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0)

## 3. Add hozzá a felületeket

Kezdd a kliens WPF-felületével, és próbáld ki, hogy megnyílik az ablaka. Utána hozd létre az admin WPF-et, majd a két MAUI- és a két WinUI-projektet.

| Sablon | Projektek | Szerepe |
| --- | --- | --- |
| **WPF Application** (C#) | `MyApp.Client.Wpf`, `MyApp.Admin.Wpf` | XAML-alapú Windows asztali felület. |
| **.NET MAUI App** | `MyApp.Client.Maui`, `MyApp.Admin.Maui` | MAUI felület, ebben a gyakorlatban Windows-céllal. |
| **WinUI Blank App (Packaged)** (C#) | `MyApp.Client.WinUI`, `MyApp.Admin.WinUI` | WinUI 3 asztali felület, csomagolatlan futtatásra beállítva. |

- **Hely.** A **Location** mezőben az `src/frontend/client` vagy az `src/frontend/admin` szülőmappát add meg. Ha a varázsló a projektnévvel hozza létre az almappát, a hivatkozások beállítása előtt vedd ki a projektet a solutionből (**Remove**). Nevezd át a lemezen a mappát `wpf`, `maui` vagy `winui` névre, majd az **Add → Existing Project** paranccsal add vissza a benne lévő `.csproj` fájlt. A fájl neve maradjon például `MyApp.Client.Wpf.csproj`.
- **WPF.** Válaszd a .NET 10.0 keretrendszert.
- **MAUI.** Ha a Windows-workload hiányzik, az `src` mappából futtasd a `dotnet workload install maui-windows` parancsot. A sablon `TargetFrameworks` sorait váltsd ki egyetlen `<TargetFramework>net10.0-windows10.0.19041.0</TargetFramework>` sorral. A csomagolatlan futtatáshoz állítsd be a `<WindowsPackageType>None</WindowsPackageType>` értéket, majd válaszd a **Windows Machine** indítási célt. A minta `Microsoft.Maui.Controls` verziója `10.0.110`. [Minta projektfájlja](../src/frontend/client/maui/MyApp.Client.Maui.csproj) · [Microsoft Learn – MAUI Windows-beállítások](https://learn.microsoft.com/en-us/dotnet/maui/windows/setup)
- **WinUI.** A célkeretrendszer legyen `net10.0-windows10.0.19041.0`. A mintához állítsd be a `<WindowsPackageType>None</WindowsPackageType>` és a `<WindowsAppSDKSelfContained>true</WindowsAppSDKSelfContained>` értéket. Válaszd az **x64** platformot és az **Unpackaged** indítási profilt. A mintában a csomagolatlan profil `commandName` értéke `Project`. [Minta projektfájlja](../src/frontend/client/winui/MyApp.Client.WinUI.csproj) · [Microsoft Learn – csomagolatlan WinUI](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/unpackage-winui-app)

## 4. Kapcsold össze a projekteket

A solution összefogja a projekteket. A **projekthivatkozás** megadja, hogy egy projekt melyik másik projekt publikus típusait használhatja. A fordító ebből a függőségből tudja a fordítási sorrendet is.

1. A **Solution Explorer** nézetben a **hivatkozó** `MyApp.Client` projekt **Dependencies** csomópontján kattints jobb gombbal.
2. Válaszd az **Add Project Reference** parancsot. A **Projects → Solution** listában pipáld be a **hivatkozott** `MyApp.Shared` projektet, majd kattints az **OK** gombra. [Microsoft Learn – projekthivatkozás hozzáadása](https://learn.microsoft.com/en-us/visualstudio/ide/how-to-add-or-remove-references-by-using-the-reference-manager)
3. Nyisd meg a `MyApp.Client.csproj` fájlt. A hivatkozás a hivatkozó projektfájl mappájához képest adja meg az útvonalat.

```xml
<ItemGroup>
  <ProjectReference Include="..\MyApp.Shared\MyApp.Shared.csproj" />
</ItemGroup>
```

| Hivatkozó projekt | Hivatkozott projekt | Miért? |
| --- | --- | --- |
| `MyApp.Client` | `MyApp.Shared` | Az API-kliens a közös DTO-kat használja. |
| `MyApp.WebApi` | `MyApp.Shared` | A backend is ugyanazokat a kérés- és válaszmodelleket használhatja. |
| Mind a hat frontend | `MyApp.Client` | A felületek közösen használhatják az API-klienst és a ViewModeleket. |

A frontend később futás közben HTTP-n éri el a backendet. A fenti hivatkozások a kód fordítási függőségeit írják le.

## 5. Ellenőrizd a megoldást

- A **Build → Build Solution** fordítsa le mind a kilenc projektet. A táblázatban szereplő hivatkozások jelenjenek meg a **Dependencies → Projects** alatt.
- Futtasd a Web API-t, és ellenőrizd a `/weatherforecast` és az `/openapi/v1.json` választ. A mellékelt kiinduló projektben a mintavégpont a `/api/health`, a port pedig 5056. Ezután próbáld ki egy frontend indítását is. [A szerver állapotának megjelenítése](szerver-allapota.md)
- Ellenőrizd, hogy a solution az `src`, a tananyag a `doc` mappában található.
