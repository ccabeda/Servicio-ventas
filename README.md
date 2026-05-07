# Servicio Ventas

Sistema POS web local para pequenos comercios, orientado a ventas rapidas, control de stock, manejo de caja y uso en red local.

## Stack actual

- Backend en ASP.NET Core 8
- Entity Framework Core
- SQL Server
- Autenticacion JWT
- Arquitectura por capas: API, Application, Domain, Infrastructure

## Modulos implementados

- Auth
- Productos
- Ventas
- Cajas
- Clientes
- Usuarios
- Medios de pago
- Configuracion del negocio
- Reportes

## Estructura del proyecto

- `SERVICIO VENTAS/backend/API`: API REST principal
- `SERVICIO VENTAS/backend/Application`: casos de uso, DTOs, handlers, validaciones
- `SERVICIO VENTAS/backend/Domain`: entidades y enums del dominio
- `SERVICIO VENTAS/backend/Infrastructure`: persistencia, repositorios, EF Core

## Endpoints principales

- `api/auth`
- `api/productos`
- `api/ventas`
- `api/cajas`
- `api/clientes`
- `api/usuarios`
- `api/mediospago`
- `api/configuracionesnegocio`
- `api/reportes`

## Requisitos

- .NET 8 SDK
- SQL Server o SQL Server Express

## Configuracion

La configuracion principal de la API esta en:

- `SERVICIO VENTAS/backend/API/appsettings.json`

Actualmente incluye:

- cadena de conexion a SQL Server
- configuracion JWT

## Ejecucion

Desde la carpeta del proyecto:

```powershell
cd "SERVICIO VENTAS"
dotnet build "SERVICIO VENTAS.sln"
dotnet run --project "backend/API/ServicioVentas.API.csproj"
```

## Notas

- El frontend todavia no esta implementado en este repositorio.
- En la raiz hay PDF y DOCX con definicion funcional, flujo POS y referencia visual para el futuro front.
