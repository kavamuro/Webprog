using System.Windows;
using MyApp.Client.Services;
using MyApp.Client.ViewModels;

namespace MyApp.Client.Wpf;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = new HealthViewModel(new HealthApiService());
        Loaded += CheckConnectionOnLoad;
    }

    private async void CheckConnectionOnLoad(object sender, RoutedEventArgs e)
    {
        Loaded -= CheckConnectionOnLoad;
        var viewModel = (HealthViewModel)DataContext;
        await viewModel.CheckConnectionCommand.ExecuteAsync(null);
    }
}
