# A szerver állapotának megjelenítése .NET 10-ben

Nyisd meg a kliensablakot. Az alsó állapotsor először a **Kapcsolat ellenőrzése…** feliratot mutatja. Sikeres válasznál megjelenik egy zöld pipa és **A szerver elérhető** szöveg. Hiba esetén figyelmeztető ikon, **A szerver nem érhető el** felirat és **Újrapróbálás** gomb jelenik meg.

Ehhez a leckéhez a DTO fogalmát már ismerned kell. A példán megtanulod, hogyan kér adatot egy kliensoldali service, hogyan változtatja meg az eredmény a ViewModel állapotát, és hogyan olvassa ezt a XAML. Először a WPF kliensen kövesd végig a láncot, utána nézd meg ugyanezeket a kötéseket MAUI-ban és WinUI-ban.

> Ablak betöltése → ViewModel parancsa → API-service → Web API → válasz DTO → ViewModel állapota → állapotsor

## 1. A backend visszaküldi a DTO-t

A **MyApp.Shared** projektben keresd meg a `HealthResponse` típust. A `Status` tulajdonságot a **MyApp.WebApi** projekt `HealthController.Get()` metódusa tölti ki. A `GET /api/health` válasz HTTP-státusza `200 OK`, a JSON-törzse `{"status":"ok"}`. A 200 a HTTP-hívás eredménye, az `ok` a válaszban érkező adat.

Indítsd el csak a backendet a **http** profillal, majd küldd el a kérést a mellékelt HTTP-fájlból vagy Swaggerből. Itt azt ellenőrzöd, hogy a végpont válaszol. A minta egy egyszerű életjel. [DTO](../src/shared/MyApp.Shared/Models/HealthResponse.cs) · [Controller](../src/backend/MyApp.WebApi/Controllers/HealthController.cs) · [HTTP-kérés](../src/backend/MyApp.WebApi/MyApp.WebApi.http)

## 2. A service elküldi a kérést

A **MyApp.Client** projekt `HealthApiService` osztálya a kliens HTTP-kapcsolatáért felel. A `HttpClient` alapcíme `http://localhost:5056/`, ehhez adódik az `api/health` útvonal. A közös kliens egyszer jön létre alkalmazásfolyamatonként, a kérés időkorlátja három másodperc.

Olvasd el a `GetHealthAsync()` metódust. A `GetFromJsonAsync<HealthResponse>()` elküldi a GET kérést, és a sikeres válasz JSON-törzséből DTO-t készít. A `Task<HealthResponse>` azt jelenti, hogy a DTO később érkezik meg. Az `await` után folytatódik a metódus, az ablak addig is reagál. [HealthApiService.cs](../src/shared/MyApp.Client/Services/HealthApiService.cs)

### Az API-hívás hibája

Kapcsolati hiba, sikertelen HTTP-válasz, időtúllépés vagy hibás JSON esetén a service elkapja a technikai kivételt, és `ApiServiceException` kivételt dob. Az eredeti ok az új kivétel `InnerException` tulajdonságában marad, így hibakereséskor visszanézhető. A ViewModelnek elég ezt az egy típust ismernie ahhoz, hogy jelezze a sikertelen ellenőrzést. [ApiServiceException.cs](../src/shared/MyApp.Client/Services/ApiServiceException.cs)

## 3. A ViewModel eldönti, mit lásson a felhasználó

A **MyApp.Client** projekt `HealthViewModel` osztálya a konstruktorában kapja meg a service-t. A `CheckConnectionAsync()` induláskor ellenőrzésre vált, meghívja a service-t, majd a válasz `Status` értéke alapján választ az elérhető és a sikertelen állapot között. Ha az `await` közben `ApiServiceException` érkezik, a `catch` ág sikertelen állapotra vált. Ekkor a XAML megjeleníti az **Újrapróbálás** gombot.

| Tulajdonság vagy parancs | Mire használja a nézet?                                         |
| ------------------------ | --------------------------------------------------------------- |
| `StatusMessage`          | Kiírja az aktuális állapot rövid szövegét.                      |
| `IsAvailable`            | Megjeleníti a sikeres ellenőrzést jelző pipát.                  |
| `HasConnectionError`     | Megjeleníti a figyelmeztetést és az Újrapróbálás gombot.        |
| `CheckConnectionCommand` | Elindítja ugyanazt az ellenőrzést betöltéskor és gombnyomáskor. |

Az `[ObservableProperty]` létrehozza a `State` tulajdonságot. Az `[NotifyPropertyChangedFor]` jelzi a felületnek, hogy állapotváltáskor a belőle számolt tulajdonságokat is olvassa újra. A `[RelayCommand]` az aszinkron metódusból hozza létre a gombhoz köthető parancsot. [HealthViewModel.cs](../src/shared/MyApp.Client/ViewModels/HealthViewModel.cs) · [Microsoft Learn – RelayCommand](https://learn.microsoft.com/dotnet/communitytoolkit/mvvm/generators/relaycommand)

## 4. A XAML megjeleníti az állapotot

A XAML-ben az elemek az ablak vezérlői, az attribútumok pedig a vezérlők beállításai. A `Text` lehet állandó felirat vagy kötés. A `Text="{Binding StatusMessage}"` a ViewModelből olvassa a megjelenítendő szöveget. A `Command` azt mondja meg, milyen parancs fusson a gomb megnyomásakor.

A gyökérelem `x:Class` attribútuma összekapcsolja a XAML-t a hozzá tartozó C# osztállyal. Az ablak vagy oldal konstruktorában az `InitializeComponent()` hozza létre a XAML-ben leírt vezérlőket. A C#-oldalon hozzuk létre a ViewModelt, a felirat elrendezését és a gomb kötését a XAML-ben adjuk meg.

### WPF

A `DockPanel` a `StatusBar` elemet az ablak aljához rögzíti a `DockPanel.Dock="Bottom"` beállítással. A `StatusBarItem` elemekben vannak a jelzések és a gomb. Az ablak C#-fájljában a `DataContext` kapja meg a ViewModel példányát. A `{Binding StatusMessage}` ezért annak a tulajdonságát keresi. Az ikonok és a gomb a `Visibility` tulajdonságukkal rejthetők el. A `BooleanToVisibilityConverter` a ViewModel igaz vagy hamis értékét alakítja át WPF láthatósággá. [WPF XAML](../src/frontend/client/wpf/MainWindow.xaml) · [WPF ablak C#](../src/frontend/client/wpf/MainWindow.xaml.cs)

### MAUI

A `Grid` két sora `*,Auto`. A csillag a fennmaradó helyet tölti ki, az `Auto` sor a tartalmához igazodik. A sorszámozás nulláról indul, ezért a `Grid.Row="1"` az alsó sorba teszi a `HorizontalStackLayout` elemet. A `Label` jeleníti meg a szöveget, az `IsVisible` közvetlenül a ViewModel logikai értékét kapja. A `BindingContext` adja a konkrét ViewModel példányát, az `x:DataType` a kötés ellenőrzéséhez megadja a típusát. [MAUI XAML](../src/frontend/client/maui/MainPage.xaml) · [MAUI oldal C#](../src/frontend/client/maui/MainPage.xaml.cs)

### WinUI

A kétsoros `Grid` alsó sorába egy `Border` kerül, benne vízszintes `StackPanel` rendezi az ikonokat, a szöveget és a gombot. Az `{x:Bind ViewModel.StatusMessage, Mode=OneWay}` az ablak C#-fájljában lévő `ViewModel` tulajdonságból indul. A `Mode=OneWay` miatt az állapot változásakor a felirat is frissül. A `BoolToVisibility()` függvény a logikai értéket alakítja `Visible` vagy `Collapsed` értékké. [WinUI XAML](../src/frontend/client/winui/MainWindow.xaml) · [WinUI ablak C#](../src/frontend/client/winui/MainWindow.xaml.cs) · [Microsoft Learn – függvényhívás x:Bind kötésben](https://learn.microsoft.com/en-us/windows/apps/develop/data-binding/function-bindings)

Mindhárom felület a `Loaded` eseménynél hívja meg a parancsot. Az eseménykezelő leválasztja magát, így egy adott ablak vagy oldal első betöltése indít automatikus ellenőrzést. Az újrapróbálást ugyanaz a ViewModel-parancs kezeli. A felirat az utolsó ellenőrzés eredményét mutatja.

## 5. Próbáld ki

A parancsokat az `src` mappából, külön terminálokban futtasd. Először indítsd a backendet és a WPF klienst.

```powershell
dotnet run --project backend/MyApp.WebApi --launch-profile http
dotnet run --project frontend/client/wpf
```

1. Futó backend mellett indítsd a WPF klienst. Az állapotsor végül pipát és **A szerver elérhető** feliratot mutasson.
2. Zárd be a klienst, állítsd le a backendet, majd indítsd újra a klienst. Meg kell jelennie a figyelmeztetésnek és az **Újrapróbálás** gombnak.
3. Hagyd nyitva a kliensablakot, indítsd vissza a backendet, majd kattints az **Újrapróbálás** gombra. A felirat és az ikon frissüljön, a gomb tűnjön el.
4. Ismételd meg WinUI-ban és MAUI-ban is. A WinUI az `x64` platformot használja. A MAUI-hoz a **Windows Machine** indítási cél és a `maui-windows` workload kell. [Projektbeállítások](tobbprojektes-megoldas.md)

```powershell
dotnet run --project frontend/client/winui -p:Platform=x64
dotnet build frontend/client/maui -t:Run -f net10.0-windows10.0.19041.0
```

**Gyakorlás.** Változtasd meg a sikeres állapot feliratát a ViewModelben, és ellenőrizd mindhárom kliensben. Melyik kötés olvassa ezt az értéket WPF-ben, MAUI-ban és WinUI-ban?
