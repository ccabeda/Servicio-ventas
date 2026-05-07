using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace ServicioVentas.Infrastructure.Persistence;

public class ServicioVentasDbContextFactory : IDesignTimeDbContextFactory<ServicioVentasDbContext>
{
    public ServicioVentasDbContext CreateDbContext(string[] args)
    {
        var apiPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "API"));

        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiPath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection no configurado.");

        var optionsBuilder = new DbContextOptionsBuilder<ServicioVentasDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new ServicioVentasDbContext(optionsBuilder.Options);
    }
}
