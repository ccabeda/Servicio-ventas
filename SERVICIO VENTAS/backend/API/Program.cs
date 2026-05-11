using FluentValidation;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using ServicioVentas.Application;
using ServicioVentas.Application.ISecurity;
using ServicioVentas.API.Middleware;
using ServicioVentas.API.Security;
using ServicioVentas.Domain.Enums;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure;
using ServicioVentas.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ServicioVentas API",
        Version = "v1"
    });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresar token JWT en formato: Bearer {token}",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = JwtBearerDefaults.AuthenticationScheme
        }
    };

    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme,
            Array.Empty<string>()
        }
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddValidatorsFromAssemblyContaining<ServicioVentas.Application.Validations.Productos.CreateProductoDtoValidator>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key no configurado.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer no configurado.");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience no configurado.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalNetworkPolicy", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ServicioVentasDbContext>();
    if (!await dbContext.Usuarios.AnyAsync())
    {
        var admin = new Usuario
        {
            NombreUsuario = "admin",
            Rol = RolUsuario.Admin,
            Activo = true,
            DebeCambiarPassword = true,
            FechaCreacion = DateTime.UtcNow
        };

        var passwordHasher = new PasswordHasher<Usuario>();
        admin.PasswordHash = passwordHasher.HashPassword(admin, "1234");

        dbContext.Usuarios.Add(admin);
        await dbContext.SaveChangesAsync();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("LocalNetworkPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
