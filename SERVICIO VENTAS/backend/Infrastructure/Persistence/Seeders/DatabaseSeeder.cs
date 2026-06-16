using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;

namespace ServicioVentas.Infrastructure.Persistence.Seeders;

public static class DatabaseSeeder
{
    public static async Task SeedDatabaseAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ServicioVentasDbContext>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        await SeedAdminUserAsync(dbContext, configuration);
    }

    private static async Task SeedAdminUserAsync(ServicioVentasDbContext dbContext, IConfiguration configuration)
    {
        if (await dbContext.Usuarios.AnyAsync())
        {
            return;
        }

        var enabled = GetBool(configuration, "SeedAdmin:Enabled", true);
        if (!enabled)
        {
            return;
        }

        var userName = configuration["SeedAdmin:UserName"] ?? "admin";
        var password = configuration["SeedAdmin:Password"] ?? "1234";
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException("SeedAdmin:Password no puede estar vacío cuando SeedAdmin:Enabled está activo.");
        }

        var admin = new Usuario
        {
            NombreUsuario = userName.Trim(),
            Rol = RolUsuario.Admin,
            Activo = true,
            DebeCambiarPassword = GetBool(configuration, "SeedAdmin:DebeCambiarPassword", true),
            FechaCreacion = DateTime.UtcNow
        };

        var passwordHasher = new PasswordHasher<Usuario>();
        admin.PasswordHash = passwordHasher.HashPassword(admin, password);

        dbContext.Usuarios.Add(admin);
        await dbContext.SaveChangesAsync();
    }

    private static bool GetBool(IConfiguration configuration, string key, bool defaultValue)
    {
        var value = configuration[key];
        return bool.TryParse(value, out var parsed) ? parsed : defaultValue;
    }
}
