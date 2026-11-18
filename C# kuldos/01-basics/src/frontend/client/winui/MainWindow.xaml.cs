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

    public static Visibility BoolToVisibility(bool isVisible) =>
        isVisible ? Visibility.Visible : Visibility.Collapsed;

    private async void CheckConnectionOnLoad(object sender, RoutedEventArgs e)
    {
        ((FrameworkElement)sender).Loaded -= CheckConnectionOnLoad;
        await ViewModel.CheckConnectionCommand.ExecuteAsync(null);
    }
}
