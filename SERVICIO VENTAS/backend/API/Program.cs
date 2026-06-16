using ServicioVentas.API;
using ServicioVentas.Application;
using ServicioVentas.Infrastructure;
using ServicioVentas.Infrastructure.Persistence.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

await app.Services.SeedDatabaseAsync();
app.UseApiPipeline();

app.Run();

public partial class Program;
