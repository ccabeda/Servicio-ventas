using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ServicioVentas.API.IntegrationTests.Support;

namespace ServicioVentas.API.IntegrationTests;

public class AuthEndpointsTests(ApiTestFactory factory) : IClassFixture<ApiTestFactory>
{
    [Fact]
    public async Task Login_ConCredencialesValidas_DevuelveTokenYPermisos()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            NombreUsuario = "admin",
            Password = "1234"
        });

        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.False(string.IsNullOrWhiteSpace(payload.GetProperty("Token").GetString()));
        Assert.Equal("Admin", payload.GetProperty("Rol").GetString());
        Assert.True(payload.GetProperty("Permisos").GetArrayLength() > 0);
    }

    [Fact]
    public async Task Me_SinToken_DevuelveUnauthorized()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_ConToken_DevuelveUsuarioActual()
    {
        var client = factory.CreateClient();
        var login = await client.PostAsJsonAsync("/api/auth/login", new
        {
            NombreUsuario = "admin",
            Password = "1234"
        });
        login.EnsureSuccessStatusCode();

        var payload = await login.Content.ReadFromJsonAsync<JsonElement>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", payload.GetProperty("Token").GetString());

        var response = await client.GetAsync("/api/auth/me");

        response.EnsureSuccessStatusCode();
        var me = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("admin", me.GetProperty("NombreUsuario").GetString());
        Assert.Equal("Admin", me.GetProperty("Rol").GetString());
    }
}
