using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.API.IntegrationTests.Support;

public class ApiTestFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"ServicioVentasIntegrationTests-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<ServicioVentasDbContext>>();
            services.AddDbContext<ServicioVentasDbContext>(options =>
                options.UseInMemoryDatabase(_databaseName));

            using var provider = services.BuildServiceProvider();
            using var scope = provider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ServicioVentasDbContext>();
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
            SeedAdmin(dbContext);
        });
    }

    private static void SeedAdmin(ServicioVentasDbContext dbContext)
    {
        var admin = new Usuario
        {
            NombreUsuario = "admin",
            Rol = RolUsuario.Admin,
            Activo = true,
            DebeCambiarPassword = true,
            FechaCreacion = DateTime.UtcNow
        };

        admin.PasswordHash = new PasswordHasher<Usuario>().HashPassword(admin, "1234");
        dbContext.Usuarios.Add(admin);
        dbContext.SaveChanges();
    }
}
