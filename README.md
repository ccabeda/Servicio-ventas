# Servicio Ventas

Sistema POS web local para pequenos comercios, orientado a ventas rapidas, control de stock, manejo de caja y uso en red local.

## Stack actual

- Backend en ASP.NET Core 8
- Frontend en Vite + HTML + CSS + JavaScript
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

## Reglas de acceso

- `Admin`: gestion completa de usuarios, productos, clientes, medios de pago y configuracion
- `Cajero`: ventas, caja, lectura operativa y reportes acotados a su usuario

## Funcionalidad destacada

- Login con JWT
- Caja con apertura, cierre, movimientos e historial
- Ventas con carrito, cliente, medio de pago y ticket
- Baja logica para entidades administrativas
- Reportes con filtros por fecha y exportacion CSV

## Estructura del proyecto

- `SERVICIO VENTAS/frontend`: frontend web separado, ejecutable con `npm run dev`
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

## Notas

- El frontend consume los endpoints reales del backend mediante `/api/...`.
- En la raiz hay PDF y DOCX locales con definicion funcional y referencia visual, pero estan ignorados por Git.
- La solucion activa esta en `SERVICIO VENTAS/backend/*`; los archivos template de ASP.NET de la raiz del proyecto ya fueron removidos.
