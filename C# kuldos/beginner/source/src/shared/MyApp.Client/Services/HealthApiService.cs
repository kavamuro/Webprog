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
