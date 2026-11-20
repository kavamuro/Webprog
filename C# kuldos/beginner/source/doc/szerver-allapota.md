# A szerver állapotának megjelenítése .NET 10-ben

**Gombnyomás → ViewModel-parancs → Web API → válasz → felirat**

Az **Ellenőrzés** gomb megnyomása után az ablak egy feliratban mutatja az eredményt.

## 1. Gombnyomás

A WPF konstruktorában a `DataContext` a `HealthViewModel` példányát kapja. A gomb `Command="{Binding CheckConnectionCommand}"` kötése a ViewModel parancsát indítja. [WPF XAML](../src/frontend/client/wpf/MainWindow.xaml) · [A konstruktor](../src/frontend/client/wpf/MainWindow.xaml.cs)

## 2. ViewModel-parancs

Az `[RelayCommand]` a `CheckConnectionAsync()` metódusból hozza létre a `CheckConnectionCommand` parancsot. A metódus a `HealthApiService`-tól kér adatot. Sikeres válasznál a `Status` értéke, sikertelen kéréskor az `ApiServiceException` alapján állítja be az állapotszöveget. [ViewModel](../src/shared/MyApp.Client/ViewModels/HealthViewModel.cs) · [HTTP-service](../src/shared/MyApp.Client/Services/HealthApiService.cs)

### A HTTP-service elküldi a kérést

A `HealthApiService` a `MyApp.Client` projekt `Services` mappájában van. A ViewModel a `GetHealthAsync()` metódust hívja.

```csharp
using System.Net.Http.Json;
using System.Text.Json;
using MyApp.Shared.Models;

namespace MyApp.Client.Services;

public sealed class HealthApiService
{
    private static readonly HttpClient HttpClient = new()
    {
        BaseAddress = new Uri("http://localhost:5056/"),
        Timeout = TimeSpan.FromSeconds(3)
    };

    public async Task<HealthResponse> GetHealthAsync()
    {
        try
        {
            return await HttpClient.GetFromJsonAsync<HealthResponse>("api/health")
                ?? throw new ApiServiceException("A szerver üres állapotválaszt adott.");
        }
        catch (Exception exception)
        {
            throw new ApiServiceException("A szerver állapotát nem sikerült lekérdezni.", exception);
        }
    }
}
```

1. A service példányai közösen használják a `static readonly` mezőben tárolt `HttpClient`-et.
2. A `BaseAddress` és az `api/health` útvonal együtt adja a `http://localhost:5056/api/health` címet. A várakozás időkorlátja három másodperc.
3. A `GetFromJsonAsync<HealthResponse>()` elküldi a GET kérést, és a JSON-ból `HealthResponse` objektumot készít. Ezt a ViewModel az `await` után kapja meg.
4. A `?? throw` kivételt dob, ha a beolvasott érték `null`. A `catch` `ApiServiceException`-ként továbbítja a hibát a ViewModelnek. Az eredeti kivétel az `InnerException`-ben marad.

## 3. Web API

A `[Route("api/health")]` megadja az útvonalat, a `[HttpGet]` a GET metódust. A `Get()` metódus `IActionResult` típusú eredményt ad. Az `Ok(new HealthResponse { Status = "ok" })` HTTP 200-as választ küld. [Controller](../src/backend/MyApp.WebApi/Controllers/HealthController.cs)

## 4. Válasz

A `{"status":"ok"}` JSON-t a kliens `HealthResponse` objektummá alakítja. A `Status` egy olvasható és beállítható tulajdonság (`get; set;`), kezdetben üres szöveggel. [HealthResponse](../src/shared/MyApp.Shared/Models/HealthResponse.cs)

## 5. Felirat

A felület egyetlen `StatusMessage` feliratban mutatja, hogy **A szerver működik** vagy **A szerver nem működik**. A szöveg az első gombnyomásig üres. Az `[ObservableProperty]` létrehozza a tulajdonságot és a változás értesítését a kötés számára. [MAUI nézet](../src/frontend/client/maui/MainPage.xaml) · [WinUI nézet](../src/frontend/client/winui/MainWindow.xaml)

## Ellenőrzés

A parancsokat az `src` mappából futtasd, külön PowerShell-ablakokban.

### 1. Kérdezd le a backendet parancssorból

```powershell
dotnet run --project backend/MyApp.WebApi --launch-profile http
```

```powershell
curl.exe -i http://localhost:5056/api/health
```

A végpont válasza `200 OK` és `{"status":"ok"}`.

### 2. Próbáld ki a gombot

```powershell
dotnet run --project frontend/client/wpf
```

Futó API mellett kattints az **Ellenőrzés** gombra. Állítsd le a backendet, és kattints ismét ugyanabban a kliensablakban. Indítsd vissza a backendet, és ellenőrizd a sikeres feliratot még egyszer.

[Részletes HTML-tananyag](../../../../html/health-beginner.html) · [Következő lecke: medium](../../../../html/health-medium.html)
