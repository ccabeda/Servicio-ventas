using System.Globalization;
using System.IO.Compression;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using ServicioVentas.Application.DTOs.Common;
using ServicioVentas.Application.DTOs.Respaldos;
using ServicioVentas.Application.Services;
using ServicioVentas.Domain.Models;
using ServicioVentas.Infrastructure.Persistence;

namespace ServicioVentas.API.Services;

public class RespaldoService(
    ServicioVentasDbContext context,
    IWebHostEnvironment environment) : IRespaldoService
{
    private const string BackupSettingsFileName = "backup-settings.json";
    private static readonly string[] ManifestTables =
    [
        "productos",
        "categorias-producto",
        "marcas-producto",
        "clientes",
        "usuarios",
        "medios-pago",
        "configuracion-negocio",
        "configuracion-ticket",
        "impresoras",
        "cajas",
        "movimientos-caja",
        "movimientos-stock",
        "ventas",
        "venta-detalles"
    ];

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        ReferenceHandler = ReferenceHandler.IgnoreCycles
    };

    public async Task<RespaldoConfiguracionDto> GetConfiguracionAsync()
    {
        return await GetBackupConfigurationAsync();
    }

    public async Task<RespaldoConfiguracionDto> UpdateConfiguracionAsync(UpdateRespaldoConfiguracionDto request)
    {
        var currentSettings = await ReadBackupSettingsAsync();
        var directory = NormalizeBackupDirectory(request.Directorio ?? currentSettings.Directorio);
        var frecuencia = NormalizeBackupFrequency(request.Frecuencia ?? currentSettings.Frecuencia);
        var hora = NormalizeBackupTime(request.Hora ?? currentSettings.Hora);
        var diaSemana = NormalizeBackupWeekday(request.DiaSemana ?? currentSettings.DiaSemana);
        var diaMes = NormalizeBackupMonthDay(request.DiaMes ?? currentSettings.DiaMes);
        Directory.CreateDirectory(directory);

        var settingsPath = GetBackupSettingsPath();
        Directory.CreateDirectory(Path.GetDirectoryName(settingsPath)!);

        var settings = new BackupSettings
        {
            Directorio = directory,
            Frecuencia = frecuencia,
            Hora = hora,
            DiaSemana = diaSemana,
            DiaMes = diaMes,
            UltimoAutomaticoUtc = currentSettings.UltimoAutomaticoUtc
        };
        await File.WriteAllTextAsync(settingsPath, JsonSerializer.Serialize(settings, JsonOptions));

        return new RespaldoConfiguracionDto
        {
            Directorio = GetVisibleBackupDirectory(directory),
            DirectorioVisible = GetVisibleBackupDirectory(directory),
            UsaUbicacionPredeterminada = IsDefaultBackupDirectory(directory),
            Frecuencia = frecuencia,
            Hora = hora,
            DiaSemana = diaSemana,
            DiaMes = diaMes,
            ProximoRespaldo = GetProximoVencimiento(DateTimeOffset.Now, frecuencia, hora, diaSemana ?? 1, diaMes ?? 1)
        };
    }

    public async Task<RespaldoDto> CrearAsync(CrearRespaldoDto request)
    {
        var fecha = DateTime.UtcNow;
        var fileName = BuildBackupFileName(request.Nombre, fecha);
        var wwwroot = GetWwwroot();
        var backupsDirectory = await GetBackupDirectoryAsync();
        Directory.CreateDirectory(backupsDirectory);

        var fullPath = Path.Combine(backupsDirectory, fileName);

        await using (var fileStream = new FileStream(fullPath, FileMode.CreateNew, FileAccess.ReadWrite, FileShare.None))
        using (var archive = new ZipArchive(fileStream, ZipArchiveMode.Create))
        {
            await AddJsonEntry(archive, "manifest.json", new
            {
                Aplicacion = "CajaGo POS",
                Version = "1.0.0",
                FechaUtc = fecha,
                Formato = "json+uploads",
                Tablas = ManifestTables
            });

            await AddJsonEntry(archive, "data/productos.json", await context.Productos.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/categorias-producto.json", await context.CategoriasProducto.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/marcas-producto.json", await context.MarcasProducto.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/clientes.json", await context.Clientes.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/usuarios.json", await context.Usuarios.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/medios-pago.json", await context.MediosPago.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/configuracion-negocio.json", await context.ConfiguracionesNegocio.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/configuracion-ticket.json", await context.ConfiguracionesTicket.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/impresoras.json", await context.Impresoras.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/cajas.json", await context.Cajas.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/movimientos-caja.json", await context.MovimientosCaja.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/movimientos-stock.json", await context.MovimientosStock.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/ventas.json", await context.Ventas.AsNoTracking().ToListAsync());
            await AddJsonEntry(archive, "data/venta-detalles.json", await context.VentaDetalles.AsNoTracking().ToListAsync());

            AddUploads(archive, Path.Combine(wwwroot, "uploads"));
        }

        var fileInfo = new FileInfo(fullPath);
        return new RespaldoDto
        {
            NombreArchivo = fileName,
            Fecha = fecha,
            TamanoBytes = fileInfo.Length,
            UrlDescarga = BuildDownloadUrl(fileName)
        };
    }

    public async Task<RespaldoDto?> CrearAutomaticoPendienteAsync(DateTimeOffset ahora)
    {
        var settings = await ReadBackupSettingsAsync();
        var frecuencia = NormalizeBackupFrequency(settings.Frecuencia);
        var hora = NormalizeBackupTime(settings.Hora);
        var diaSemana = NormalizeBackupWeekday(settings.DiaSemana) ?? 1;
        var diaMes = NormalizeBackupMonthDay(settings.DiaMes) ?? 1;
        var vencimiento = GetUltimoVencimiento(ahora, frecuencia, hora, diaSemana, diaMes);

        if (settings.UltimoAutomaticoUtc.HasValue && settings.UltimoAutomaticoUtc.Value >= vencimiento.UtcDateTime)
        {
            return null;
        }

        var respaldo = await CrearAsync(new CrearRespaldoDto
        {
            Nombre = $"automatico-{GetBackupFrequencyName(frecuencia)}"
        });

        settings.Directorio = NormalizeBackupDirectory(settings.Directorio);
        settings.Frecuencia = frecuencia;
        settings.Hora = hora;
        settings.DiaSemana = diaSemana;
        settings.DiaMes = diaMes;
        settings.UltimoAutomaticoUtc = vencimiento.UtcDateTime;
        await WriteBackupSettingsAsync(settings);

        return respaldo;
    }

    public Task<PagedResultDto<RespaldoDto>> ListarPaginadoAsync(int pageIndex, int pageSize)
    {
        var respaldos = GetBackups();
        var totalItems = respaldos.Count;
        var items = respaldos
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Task.FromResult(new PagedResultDto<RespaldoDto>
        {
            Items = items,
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalItems == 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize)
        });
    }

    public async Task<RespaldoArchivoDto> DescargarAsync(string nombreArchivo)
    {
        var safeFileName = Path.GetFileName(nombreArchivo);
        if (string.IsNullOrWhiteSpace(safeFileName) || !safeFileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Archivo de respaldo inválido.");
        }

        var filePath = await FindBackupFileAsync(safeFileName);
        if (filePath is null)
        {
            throw new KeyNotFoundException("Respaldo no encontrado.");
        }

        return new RespaldoArchivoDto
        {
            NombreArchivo = safeFileName,
            RutaFisica = filePath,
            ContentType = "application/zip"
        };
    }

    public async Task<RespaldoRestauradoDto> RestaurarAsync(ApplicationFile? archivo)
    {
        if (archivo is null || archivo.Length == 0)
        {
            throw new InvalidOperationException("Selecciona un archivo de respaldo válido.");
        }

        if (!archivo.FileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("El respaldo debe ser un archivo .zip generado por CajaGo.");
        }

        await using var uploadStream = archivo.OpenReadStream();
        using var archive = new ZipArchive(uploadStream, ZipArchiveMode.Read, leaveOpen: false);
        await ValidarManifest(archive);

        var usuarios = await ReadJsonEntry<Usuario>(archive, "data/usuarios.json");
        var categorias = await ReadJsonEntry<CategoriaProducto>(archive, "data/categorias-producto.json");
        var marcas = await ReadJsonEntry<MarcaProducto>(archive, "data/marcas-producto.json");
        var clientes = await ReadJsonEntry<Cliente>(archive, "data/clientes.json");
        var mediosPago = await ReadJsonEntry<MedioPago>(archive, "data/medios-pago.json");
        var configuracionesNegocio = await ReadJsonEntry<ConfiguracionNegocio>(archive, "data/configuracion-negocio.json");
        var impresoras = await ReadJsonEntry<Impresora>(archive, "data/impresoras.json");
        var configuracionesTicket = await ReadJsonEntry<ConfiguracionTicket>(archive, "data/configuracion-ticket.json");
        var productos = await ReadJsonEntry<Producto>(archive, "data/productos.json");
        var cajas = await ReadJsonEntry<Caja>(archive, "data/cajas.json");
        var movimientosCaja = await ReadJsonEntry<MovimientoCaja>(archive, "data/movimientos-caja.json");
        var movimientosStock = await ReadJsonEntry<MovimientoStock>(archive, "data/movimientos-stock.json");
        var ventas = await ReadJsonEntry<Venta>(archive, "data/ventas.json");
        var ventaDetalles = await ReadJsonEntry<VentaDetalle>(archive, "data/venta-detalles.json");
        var uploadsDirectory = Path.Combine(GetWwwroot(), "uploads");
        ValidarUploads(archive, uploadsDirectory);

        await using var transaction = await context.Database.BeginTransactionAsync();

        await LimpiarDatosAsync();

        await AddWithIdentityInsert("USUARIO", usuarios);
        await AddWithIdentityInsert("CATEGORIA_PRODUCTO", categorias);
        await AddWithIdentityInsert("MARCA_PRODUCTO", marcas);
        await AddWithIdentityInsert("CLIENTE", clientes);
        await AddWithIdentityInsert("MEDIO_PAGO", mediosPago);
        await AddWithIdentityInsert("CONFIGURACION_NEGOCIO", configuracionesNegocio);
        await AddWithIdentityInsert("IMPRESORA", impresoras);
        await AddWithIdentityInsert("CONFIGURACION_TICKET", configuracionesTicket);
        await AddWithIdentityInsert("PRODUCTO", productos);
        await AddWithIdentityInsert("CAJA", cajas);
        await AddWithIdentityInsert("MOVIMIENTO_CAJA", movimientosCaja);
        await AddWithIdentityInsert("MOVIMIENTO_STOCK", movimientosStock);
        await AddWithIdentityInsert("VENTA", ventas);
        await AddWithIdentityInsert("VENTA_DETALLE", ventaDetalles);

        await transaction.CommitAsync();
        RestaurarUploads(archive, uploadsDirectory);

        return new RespaldoRestauradoDto
        {
            NombreArchivo = Path.GetFileName(archivo.FileName),
            Fecha = DateTime.UtcNow,
            Mensaje = "Respaldo restaurado correctamente."
        };
    }

    private static async Task AddJsonEntry<T>(ZipArchive archive, string entryName, T data)
    {
        var entry = archive.CreateEntry(entryName, CompressionLevel.Optimal);
        await using var entryStream = entry.Open();
        await JsonSerializer.SerializeAsync(entryStream, data, JsonOptions);
    }

    private static async Task ValidarManifest(ZipArchive archive)
    {
        var manifest = archive.GetEntry("manifest.json")
            ?? throw new InvalidOperationException("El archivo no parece ser un respaldo de CajaGo.");

        await using var stream = manifest.Open();
        using var document = await JsonDocument.ParseAsync(stream);

        if (!document.RootElement.TryGetProperty("Aplicacion", out var aplicacion)
            || aplicacion.GetString() != "CajaGo POS")
        {
            throw new InvalidOperationException("El archivo no corresponde a un respaldo válido de CajaGo.");
        }
    }

    private static async Task<List<T>> ReadJsonEntry<T>(ZipArchive archive, string entryName)
    {
        var entry = archive.GetEntry(entryName);
        if (entry is null) return [];

        await using var stream = entry.Open();
        return await JsonSerializer.DeserializeAsync<List<T>>(stream, JsonOptions) ?? [];
    }

    private async Task LimpiarDatosAsync()
    {
        context.AuditoriaEventos.RemoveRange(await context.AuditoriaEventos.ToListAsync());
        context.VentaDetalles.RemoveRange(await context.VentaDetalles.ToListAsync());
        context.Ventas.RemoveRange(await context.Ventas.ToListAsync());
        context.MovimientosStock.RemoveRange(await context.MovimientosStock.ToListAsync());
        context.MovimientosCaja.RemoveRange(await context.MovimientosCaja.ToListAsync());
        context.Cajas.RemoveRange(await context.Cajas.ToListAsync());
        context.ConfiguracionesTicket.RemoveRange(await context.ConfiguracionesTicket.ToListAsync());
        context.Productos.RemoveRange(await context.Productos.ToListAsync());
        context.Impresoras.RemoveRange(await context.Impresoras.ToListAsync());
        context.CategoriasProducto.RemoveRange(await context.CategoriasProducto.ToListAsync());
        context.MarcasProducto.RemoveRange(await context.MarcasProducto.ToListAsync());
        context.Clientes.RemoveRange(await context.Clientes.ToListAsync());
        context.MediosPago.RemoveRange(await context.MediosPago.ToListAsync());
        context.ConfiguracionesNegocio.RemoveRange(await context.ConfiguracionesNegocio.ToListAsync());
        context.Usuarios.RemoveRange(await context.Usuarios.ToListAsync());

        await context.SaveChangesAsync();
        context.ChangeTracker.Clear();
    }

    private async Task AddWithIdentityInsert<T>(string tableName, IReadOnlyCollection<T> items) where T : class
    {
        if (items.Count == 0) return;

        await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [" + tableName + "] ON");
        try
        {
            context.Set<T>().AddRange(items);
            await context.SaveChangesAsync();
        }
        finally
        {
            await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [" + tableName + "] OFF");
            context.ChangeTracker.Clear();
        }
    }

    private static void RestaurarUploads(ZipArchive archive, string uploadsDirectory)
    {
        if (Directory.Exists(uploadsDirectory))
        {
            Directory.Delete(uploadsDirectory, recursive: true);
        }

        Directory.CreateDirectory(uploadsDirectory);
        var uploadsRoot = Path.GetFullPath(uploadsDirectory);

        foreach (var entry in archive.Entries.Where(entry => entry.FullName.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase)))
        {
            if (string.IsNullOrWhiteSpace(entry.Name)) continue;

            var relativePath = entry.FullName["uploads/".Length..].Replace('/', Path.DirectorySeparatorChar);
            var destinationPath = Path.GetFullPath(Path.Combine(uploadsDirectory, relativePath));

            if (!destinationPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("El respaldo contiene una ruta de archivo no válida.");
            }

            Directory.CreateDirectory(Path.GetDirectoryName(destinationPath)!);
            entry.ExtractToFile(destinationPath, overwrite: true);
        }
    }

    private static void ValidarUploads(ZipArchive archive, string uploadsDirectory)
    {
        var uploadsRoot = Path.GetFullPath(uploadsDirectory);

        foreach (var entry in archive.Entries.Where(entry => entry.FullName.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase)))
        {
            if (string.IsNullOrWhiteSpace(entry.Name)) continue;

            var relativePath = entry.FullName["uploads/".Length..].Replace('/', Path.DirectorySeparatorChar);
            var destinationPath = Path.GetFullPath(Path.Combine(uploadsDirectory, relativePath));

            if (!destinationPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("El respaldo contiene una ruta de archivo no válida.");
            }
        }
    }

    private string GetWwwroot()
    {
        return environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot");
    }

    private List<RespaldoDto> GetBackups()
    {
        return GetBackupDirectories()
            .SelectMany(directory =>
            {
                Directory.CreateDirectory(directory);
                return Directory.EnumerateFiles(directory, "*.zip", SearchOption.TopDirectoryOnly);
            })
            .GroupBy(path => Path.GetFileName(path), StringComparer.OrdinalIgnoreCase)
            .Select(group => group
                .Select(path => new FileInfo(path))
                .OrderByDescending(file => file.CreationTimeUtc)
                .First())
            .Select(path =>
            {
                return new RespaldoDto
                {
                    NombreArchivo = path.Name,
                    Fecha = path.CreationTimeUtc,
                    TamanoBytes = path.Length,
                    UrlDescarga = BuildDownloadUrl(path.Name)
                };
            })
            .OrderByDescending(respaldo => respaldo.Fecha)
            .ToList();
    }

    private string GetDefaultBackupDirectory()
    {
        var documents = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        var userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        var root = !string.IsNullOrWhiteSpace(documents)
            ? documents
            : !string.IsNullOrWhiteSpace(userProfile)
                ? Path.Combine(userProfile, "Documents")
                : Path.Combine(environment.ContentRootPath, "App_Data");

        return Path.Combine(root, "CajaGo", "Respaldos");
    }

    private string GetBackupSettingsPath()
    {
        return Path.Combine(environment.ContentRootPath, "App_Data", BackupSettingsFileName);
    }

    private async Task<RespaldoConfiguracionDto> GetBackupConfigurationAsync()
    {
        var settings = await ReadBackupSettingsAsync();
        var directory = NormalizeBackupDirectory(settings.Directorio);
        var frecuencia = NormalizeBackupFrequency(settings.Frecuencia);
        var hora = NormalizeBackupTime(settings.Hora);
        var diaSemana = NormalizeBackupWeekday(settings.DiaSemana);
        var diaMes = NormalizeBackupMonthDay(settings.DiaMes);

        return new RespaldoConfiguracionDto
        {
            Directorio = GetVisibleBackupDirectory(directory),
            DirectorioVisible = GetVisibleBackupDirectory(directory),
            UsaUbicacionPredeterminada = IsDefaultBackupDirectory(directory),
            Frecuencia = frecuencia,
            Hora = hora,
            DiaSemana = diaSemana,
            DiaMes = diaMes,
            ProximoRespaldo = GetProximoVencimiento(DateTimeOffset.Now, frecuencia, hora, diaSemana ?? 1, diaMes ?? 1)
        };
    }

    private async Task<string> GetBackupDirectoryAsync()
    {
        return await ReadConfiguredBackupDirectoryAsync();
    }

    private string GetBackupDirectory()
    {
        var settingsPath = GetBackupSettingsPath();
        if (!File.Exists(settingsPath)) return GetDefaultBackupDirectory();

        var json = File.ReadAllText(settingsPath);
        var settings = JsonSerializer.Deserialize<BackupSettings>(json, JsonOptions);
        return NormalizeBackupDirectory(settings?.Directorio);
    }

    private List<string> GetBackupDirectories()
    {
        return new[] { GetBackupDirectory() }
            .Select(Path.GetFullPath)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private async Task<string?> FindBackupFileAsync(string safeFileName)
    {
        var configuredDirectory = await GetBackupDirectoryAsync();
        var directories = new[] { configuredDirectory }
            .Select(Path.GetFullPath)
            .Distinct(StringComparer.OrdinalIgnoreCase);

        return directories
            .Select(directory => Path.Combine(directory, safeFileName))
            .FirstOrDefault(File.Exists);
    }

    private async Task<string> ReadConfiguredBackupDirectoryAsync()
    {
        var settings = await ReadBackupSettingsAsync();
        return NormalizeBackupDirectory(settings.Directorio);
    }

    private async Task<BackupSettings> ReadBackupSettingsAsync()
    {
        var settingsPath = GetBackupSettingsPath();
        if (!File.Exists(settingsPath)) return new BackupSettings();

        var json = await File.ReadAllTextAsync(settingsPath);
        return JsonSerializer.Deserialize<BackupSettings>(json, JsonOptions) ?? new BackupSettings();
    }

    private async Task WriteBackupSettingsAsync(BackupSettings settings)
    {
        var settingsPath = GetBackupSettingsPath();
        Directory.CreateDirectory(Path.GetDirectoryName(settingsPath)!);
        await File.WriteAllTextAsync(settingsPath, JsonSerializer.Serialize(settings, JsonOptions));
    }

    private string NormalizeBackupDirectory(string? directory)
    {
        return string.IsNullOrWhiteSpace(directory)
            ? GetDefaultBackupDirectory()
            : Path.GetFullPath(directory.Trim());
    }

    private bool IsDefaultBackupDirectory(string directory)
    {
        return string.Equals(
            Path.GetFullPath(directory),
            Path.GetFullPath(GetDefaultBackupDirectory()),
            StringComparison.OrdinalIgnoreCase);
    }

    private string GetVisibleBackupDirectory(string directory)
    {
        return IsDefaultBackupDirectory(directory)
            ? @"Documentos\CajaGo\Respaldos"
            : directory;
    }

    private static string NormalizeBackupFrequency(string? frequency)
    {
        var normalized = frequency?.Trim().ToLowerInvariant();
        return normalized is "daily" or "weekly" or "monthly" ? normalized : "daily";
    }

    private static string NormalizeBackupTime(string? time)
    {
        if (TimeOnly.TryParse(time, out var parsed))
        {
            return parsed.ToString("HH:mm", CultureInfo.InvariantCulture);
        }

        return "03:00";
    }

    private static int? NormalizeBackupWeekday(int? weekday)
    {
        return weekday is >= 0 and <= 6 ? weekday : 1;
    }

    private static int? NormalizeBackupMonthDay(int? monthDay)
    {
        return monthDay is 0 or >= 1 and <= 28 ? monthDay : 1;
    }

    private static DateTimeOffset GetUltimoVencimiento(DateTimeOffset ahora, string frecuencia, string hora, int diaSemana, int diaMes)
    {
        var horario = TimeOnly.Parse(hora, CultureInfo.InvariantCulture);
        return frecuencia switch
        {
            "weekly" => GetUltimoVencimientoSemanal(ahora, horario, diaSemana),
            "monthly" => GetUltimoVencimientoMensual(ahora, horario, diaMes),
            _ => GetUltimoVencimientoDiario(ahora, horario)
        };
    }

    private static DateTimeOffset GetProximoVencimiento(DateTimeOffset ahora, string frecuencia, string hora, int diaSemana, int diaMes)
    {
        var horario = TimeOnly.Parse(hora, CultureInfo.InvariantCulture);
        return frecuencia switch
        {
            "weekly" => GetProximoVencimientoSemanal(ahora, horario, diaSemana),
            "monthly" => GetProximoVencimientoMensual(ahora, horario, diaMes),
            _ => GetProximoVencimientoDiario(ahora, horario)
        };
    }

    private static DateTimeOffset GetUltimoVencimientoDiario(DateTimeOffset ahora, TimeOnly horario)
    {
        var candidato = new DateTimeOffset(DateOnly.FromDateTime(ahora.Date).ToDateTime(horario), ahora.Offset);
        return candidato <= ahora ? candidato : candidato.AddDays(-1);
    }

    private static DateTimeOffset GetProximoVencimientoDiario(DateTimeOffset ahora, TimeOnly horario)
    {
        var candidato = new DateTimeOffset(DateOnly.FromDateTime(ahora.Date).ToDateTime(horario), ahora.Offset);
        return candidato > ahora ? candidato : candidato.AddDays(1);
    }

    private static DateTimeOffset GetUltimoVencimientoSemanal(DateTimeOffset ahora, TimeOnly horario, int diaSemana)
    {
        var diasDesdeVencimiento = ((int)ahora.DayOfWeek - diaSemana + 7) % 7;
        var fecha = DateOnly.FromDateTime(ahora.Date).AddDays(-diasDesdeVencimiento);
        var candidato = new DateTimeOffset(fecha.ToDateTime(horario), ahora.Offset);
        return candidato <= ahora ? candidato : candidato.AddDays(-7);
    }

    private static DateTimeOffset GetProximoVencimientoSemanal(DateTimeOffset ahora, TimeOnly horario, int diaSemana)
    {
        var diasHastaVencimiento = (diaSemana - (int)ahora.DayOfWeek + 7) % 7;
        var fecha = DateOnly.FromDateTime(ahora.Date).AddDays(diasHastaVencimiento);
        var candidato = new DateTimeOffset(fecha.ToDateTime(horario), ahora.Offset);
        return candidato > ahora ? candidato : candidato.AddDays(7);
    }

    private static DateTimeOffset GetUltimoVencimientoMensual(DateTimeOffset ahora, TimeOnly horario, int diaMes)
    {
        var candidato = GetVencimientoMensual(ahora.Year, ahora.Month, horario, diaMes, ahora.Offset);
        if (candidato <= ahora) return candidato;

        var mesAnterior = new DateTime(ahora.Year, ahora.Month, 1).AddMonths(-1);
        return GetVencimientoMensual(mesAnterior.Year, mesAnterior.Month, horario, diaMes, ahora.Offset);
    }

    private static DateTimeOffset GetProximoVencimientoMensual(DateTimeOffset ahora, TimeOnly horario, int diaMes)
    {
        var candidato = GetVencimientoMensual(ahora.Year, ahora.Month, horario, diaMes, ahora.Offset);
        if (candidato > ahora) return candidato;

        var mesSiguiente = new DateTime(ahora.Year, ahora.Month, 1).AddMonths(1);
        return GetVencimientoMensual(mesSiguiente.Year, mesSiguiente.Month, horario, diaMes, ahora.Offset);
    }

    private static DateTimeOffset GetVencimientoMensual(int year, int month, TimeOnly horario, int diaMes, TimeSpan offset)
    {
        var ultimoDia = DateTime.DaysInMonth(year, month);
        var dia = diaMes == 0 ? ultimoDia : Math.Min(diaMes, ultimoDia);
        var fecha = new DateOnly(year, month, dia);
        return new DateTimeOffset(fecha.ToDateTime(horario), offset);
    }

    private static string GetBackupFrequencyName(string frecuencia)
    {
        return frecuencia switch
        {
            "weekly" => "semanal",
            "monthly" => "mensual",
            _ => "diario"
        };
    }

    private static string BuildDownloadUrl(string fileName)
    {
        return $"/api/respaldos/descargar/{Uri.EscapeDataString(fileName)}";
    }

    private static string BuildBackupFileName(string? customName, DateTime fecha)
    {
        var timestamp = fecha.ToString("yyyyMMdd-HHmmss", CultureInfo.InvariantCulture);
        var sanitizedName = SanitizeBackupName(customName);
        return string.IsNullOrWhiteSpace(sanitizedName)
            ? $"cajago-backup-{timestamp}.zip"
            : $"{sanitizedName}-{timestamp}.zip";
    }

    private static string SanitizeBackupName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name)) return string.Empty;

        var invalidChars = Path.GetInvalidFileNameChars();
        var sanitizedChars = name.Trim()
            .Select(character => invalidChars.Contains(character) ? '-' : character)
            .Select(character => char.IsWhiteSpace(character) ? '-' : char.ToLowerInvariant(character))
            .Where(character => char.IsLetterOrDigit(character) || character is '-' or '_')
            .ToArray();

        var sanitized = string.Join("", sanitizedChars)
            .Trim('-')
            .Replace("--", "-");

        return sanitized.Length <= 60 ? sanitized : sanitized[..60].Trim('-');
    }

    private sealed class BackupSettings
    {
        public string? Directorio { get; set; }
        public string? Frecuencia { get; set; }
        public string? Hora { get; set; }
        public int? DiaSemana { get; set; }
        public int? DiaMes { get; set; }
        public DateTime? UltimoAutomaticoUtc { get; set; }
    }

    private static void AddUploads(ZipArchive archive, string uploadsDirectory)
    {
        if (!Directory.Exists(uploadsDirectory)) return;

        foreach (var filePath in Directory.EnumerateFiles(uploadsDirectory, "*", SearchOption.AllDirectories))
        {
            var relativePath = Path.GetRelativePath(uploadsDirectory, filePath).Replace('\\', '/');
            if (relativePath.StartsWith("backups/", StringComparison.OrdinalIgnoreCase)) continue;

            archive.CreateEntryFromFile(filePath, $"uploads/{relativePath}", CompressionLevel.Optimal);
        }
    }
}
