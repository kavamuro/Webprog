using MyApp.Client.Services;
using MyApp.Client.ViewModels;

namespace MyApp.Client.Maui;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();
        BindingContext = new HealthViewModel(new HealthApiService());
    }
}
