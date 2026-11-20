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
    }
}
