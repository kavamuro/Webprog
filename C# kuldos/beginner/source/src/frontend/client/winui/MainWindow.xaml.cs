using Microsoft.UI.Xaml;
using MyApp.Client.Services;
using MyApp.Client.ViewModels;

namespace MyApp.Client.WinUI;

public sealed partial class MainWindow : Window
{
    public HealthViewModel ViewModel { get; } = new(new HealthApiService());

    public MainWindow()
    {
        InitializeComponent();
    }
}
