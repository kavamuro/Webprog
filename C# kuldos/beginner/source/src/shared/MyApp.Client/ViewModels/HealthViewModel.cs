using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MyApp.Client.Services;

namespace MyApp.Client.ViewModels;

public partial class HealthViewModel(HealthApiService healthApiService) : ObservableObject
{
    [ObservableProperty]
    private string statusMessage = string.Empty;

    [RelayCommand]
    private async Task CheckConnectionAsync()
    {
        try
        {
            var response = await healthApiService.GetHealthAsync();
            StatusMessage = response.Status == "ok" ? "A szerver működik" : "A szerver nem működik";
        }
        catch (ApiServiceException)
        {
            StatusMessage = "A szerver nem működik";
        }
    }
}
