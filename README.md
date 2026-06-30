# Servicio Ventas

Sistema POS web local para pequeños comercios, orientado a ventas rapidas, control de stock, manejo de caja y uso en red local.

## Stack actual

- Backend en ASP.NET Core 8
- Frontend en Vite + HTML + CSS + JavaScript
- Entity Framework Core
- SQL Server
- Autenticacion JWT
- Tests unitarios y tests de integracion con xUnit
- Arquitectura por capas: API, Application, Domain, Infrastructure
- SDK fijado con `global.json`
- Analyzers, NuGet Audit y warnings como errores configurados en `Directory.Build.props`

## Modulos implementados

- Auth
- Productos
- Ventas
- Cajas
- Clientes
- Usuarios
- Medios de pago
- Configuracion del negocio
- Configuracion de ticket
- Configuracion de impresoras
- Impuestos
- Respaldos
- Reportes
- Auditoria

## Reglas de acceso

- `Admin`: gestion completa de usuarios, productos, clientes, medios de pago y configuracion
- `Cajero`: ventas, caja, lectura operativa y reportes acotados a su usuario
- El backend ya emite permisos granulares en el JWT mediante claims `permission`.
- Por ahora los permisos se asignan por rol en codigo: `Admin` recibe todos los permisos.
- No se usa ASP.NET Identity completo. Se usa entidad propia `Usuario`, JWT propio y `PasswordHasher<Usuario>` solo para hashear/verificar passwords.

## Funcionalidad destacada

- Login con JWT
- Caja con apertura, cierre, movimientos e historial
- Ventas con carrito, cliente, medio de pago y ticket
- Impuestos aplicados en ventas y desglose configurable en ticket
- Baja logica para entidades administrativas mediante `Activo` / `Activa`
- Reportes con filtros por fecha y exportacion CSV
- Respaldo y restauracion de datos
- Paginado backend con `PagedResultDto`
- Auditoria backend para acciones sensibles
- Respuestas de error estandarizadas con `message`, `success` y `errors`
- Configuracion de ticket e impresoras termicas
- Resumen de caja imprimible en formato A4/PDF desde navegador

## Estructura del proyecto

- `SERVICIO VENTAS/frontend`: frontend web separado, ejecutable con `npm run dev`
- `SERVICIO VENTAS/backend/API`: API REST principal
- `SERVICIO VENTAS/backend/Application`: casos de uso, DTOs, handlers, validaciones
- `SERVICIO VENTAS/backend/Domain`: entidades y enums del dominio
- `SERVICIO VENTAS/backend/Infrastructure`: persistencia, repositorios, EF Core
- `SERVICIO VENTAS/backend/Tests/ServicioVentas.Application.Tests`: tests unitarios de casos de uso
- `SERVICIO VENTAS/backend/Tests/ServicioVentas.API.IntegrationTests`: tests de integracion de endpoints

## Endpoints principales

- `api/auth`
- `api/auditoria`
- `api/productos`
- `api/categoriasproducto`
- `api/marcasproducto`
- `api/ventas`
- `api/cajas`
- `api/clientes`
- `api/usuarios`
- `api/mediospago`
- `api/configuracionesnegocio`
- `api/configuracionesticket`
- `api/impresoras`
- `api/impuestos`
- `api/reportes`
- `api/respaldos`

## Requisitos

- .NET SDK 9.0.308 o compatible con `global.json`
- Node.js 20 o superior
- SQL Server o SQL Server Express

## Configuracion

La configuracion principal de la API esta en:

- `SERVICIO VENTAS/backend/API/appsettings.json`

Actualmente incluye:

- cadena de conexion a SQL Server
- configuracion JWT

Al iniciar la API, si no existen usuarios, se crea un usuario inicial:

- `admin / 1234`

## Ejecucion en desarrollo

Desde la carpeta del proyecto:

```powershell
cd "SERVICIO VENTAS"
dotnet build "SERVICIO VENTAS.sln"
dotnet run --project "backend/API/ServicioVentas.API.csproj"
```

En otra terminal:

```powershell
cd "SERVICIO VENTAS/frontend"
npm install
npm run dev
```

Frontend dev server:

- `http://localhost:5173`

API backend:

- `http://localhost:5272`

El frontend usa proxy de Vite para redirigir `/api` al backend.

## Verificacion del proyecto

Desde la raiz del repositorio:

```powershell
.\scripts\check.ps1
```

Ese comando ejecuta:

- `dotnet format --verify-no-changes`
- `dotnet build`
- `dotnet test`
- `npm run build` del frontend

## Tests

Desde `SERVICIO VENTAS`:

```powershell
dotnet test "SERVICIO VENTAS.sln"
```

Actualmente se ejecutan:

- tests unitarios de `Application`
- tests de integracion de la API en memoria

## Migraciones EF Core

Crear una migracion:

```powershell
dotnet ef migrations add NombreMigracion --project "backend/Infrastructure/ServicioVentas.Infrastructure.csproj" --startup-project "backend/API/ServicioVentas.API.csproj"
```

Aplicar migraciones:

```powershell
dotnet ef database update --project "backend/Infrastructure/ServicioVentas.Infrastructure.csproj" --startup-project "backend/API/ServicioVentas.API.csproj"
```

## Convenciones backend

- Controllers livianos: reciben request y delegan en handlers.
- La logica de negocio vive en `Application/UseCases`.
- Las validaciones de campos viven en FluentValidation.
- Las reglas de negocio se validan en handlers/services.
- EF Core y repositorios viven en `Infrastructure`.
- Las tablas usan nombres en mayuscula y snake case.
- Las respuestas paginadas usan `PagedResultDto`.
- Los errores controlados usan respuesta estandar `ApiErrorDto`.

## Calidad automatizada

- `global.json` fija el SDK usado por el equipo.
- `Directory.Build.props` activa analyzers, NuGet Audit y warnings como errores.
- `lefthook.yml` ejecuta formato antes del commit y el check completo antes del push.
- `scripts/check.ps1` es el comando unico recomendado antes de subir cambios.

## Notas

- El frontend consume los endpoints reales del backend mediante `/api/...`.
- En la raiz hay PDF y DOCX locales con definicion funcional y referencia visual, pero estan ignorados por Git.
- La solucion activa esta en `SERVICIO VENTAS/SERVICIO VENTAS.sln`.
