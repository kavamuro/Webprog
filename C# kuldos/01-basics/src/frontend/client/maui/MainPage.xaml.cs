using MyApp.Client.Services;
using MyApp.Client.ViewModels;

namespace MyApp.Client.Maui;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();
        BindingContext = new HealthViewModel(new HealthApiService());
        Loaded += CheckConnectionOnLoad;
    }

    private async void CheckConnectionOnLoad(object? sender, EventArgs e)
    {
        Loaded -= CheckConnectionOnLoad;
        var viewModel = (HealthViewModel)BindingContext;
        await viewModel.CheckConnectionCommand.ExecuteAsync(null);
    }
}
