using Microsoft.EntityFrameworkCore;
using RentalStatisticsExam;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("rental-statistics-exam"));
builder.Services.AddScoped<RentalQueryService>();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
    SampleData.Seed(scope.ServiceProvider.GetRequiredService<AppDbContext>());
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.Run();

public partial class Program;
