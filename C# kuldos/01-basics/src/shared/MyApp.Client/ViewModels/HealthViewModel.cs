using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MyApp.Client.Services;

namespace MyApp.Client.ViewModels;

public partial class HealthViewModel(HealthApiService healthApiService) : ObservableObject
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(StatusMessage))]
    [NotifyPropertyChangedFor(nameof(IsAvailable))]
    [NotifyPropertyChangedFor(nameof(HasConnectionError))]
    private ConnectionState state = ConnectionState.Checking;

    public bool IsAvailable => State == ConnectionState.Available;
    public bool HasConnectionError => State == ConnectionState.Unavailable;

    public string StatusMessage => State switch
    {
        ConnectionState.Available => "A szerver elérhető",
        ConnectionState.Unavailable => "A szerver nem érhető el",
        _ => "Kapcsolat ellenőrzése…"
    };

    [RelayCommand]
    private async Task CheckConnectionAsync()
    {
        State = ConnectionState.Checking;

        try
        {
            var response = await healthApiService.GetHealthAsync();
            State = response.Status == "ok" ? ConnectionState.Available : ConnectionState.Unavailable;
        }
        catch (ApiServiceException)
        {
            State = ConnectionState.Unavailable;
        }
    }
}

public enum ConnectionState
{
    Checking,
    Available,
    Unavailable
}
