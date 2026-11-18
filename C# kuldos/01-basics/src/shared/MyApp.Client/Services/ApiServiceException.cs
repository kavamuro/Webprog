namespace MyApp.Client.Services;

public sealed class ApiServiceException(string message, Exception innerException)
    : Exception(message, innerException)
{
}
