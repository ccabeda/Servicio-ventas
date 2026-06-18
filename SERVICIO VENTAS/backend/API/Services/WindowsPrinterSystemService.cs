using System.Runtime.InteropServices;
using System.Text;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.Services;

namespace ServicioVentas.API.Services;

public class WindowsPrinterSystemService(IClock clock) : IPrinterSystemService
{
    private const int PrinterEnumLocal = 0x00000002;
    private const int PrinterEnumConnections = 0x00000004;
    private static readonly byte[] CutPaperCommand = [0x1D, 0x56, 0x00];

    public List<ImpresoraDetectadaDto> GetDetectedPrinters()
    {
        var defaultPrinter = GetDefaultPrinterName();
        return GetInstalledPrinters()
            .Where(IsTicketPrinterCandidate)
            .Select(name => new ImpresoraDetectadaDto
            {
                Nombre = name,
                Predeterminada = name.Equals(defaultPrinter, StringComparison.OrdinalIgnoreCase)
            })
            .OrderByDescending(printer => printer.Predeterminada)
            .ThenBy(printer => printer.Nombre)
            .ToList();
    }

    public void EnsureTicketPrinterIsAvailable(string printerName)
    {
        if (string.IsNullOrWhiteSpace(printerName))
            throw new InvalidOperationException("Selecciona una impresora detectada por Windows.");

        if (!IsTicketPrinterCandidate(printerName))
            throw new InvalidOperationException("Esa impresora es virtual y no sirve para tickets.");

        if (!GetInstalledPrinters().Any(name => name.Equals(printerName.Trim(), StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException("La impresora seleccionada no está instalada o no está disponible en Windows.");
    }

    public void PrintTestTicket(string? printerName, TicketPruebaImpresoraRequest request)
    {
        var resolvedPrinterName = string.IsNullOrWhiteSpace(printerName)
            ? GetDefaultPrinterName()
            : printerName.Trim();

        if (string.IsNullOrWhiteSpace(resolvedPrinterName))
            throw new InvalidOperationException("No hay una impresora predeterminada configurada en Windows.");

        EnsureTicketPrinterIsAvailable(resolvedPrinterName);
        PrintRaw(resolvedPrinterName, BuildRawTicketBytes(BuildTestTicket(request, clock.LocalNow), request.CorteAutomatico));
    }

    private static string BuildTestTicket(TicketPruebaImpresoraRequest request, DateTime now)
    {
        var businessName = string.IsNullOrWhiteSpace(request.NombreNegocio) ? "CajaGo" : request.NombreNegocio.Trim();
        var message = string.IsNullOrWhiteSpace(request.Mensaje) ? "Gracias por tu compra." : request.Mensaje.Trim();
        var width = request.AnchoMm == 58 ? 32 : 42;
        var line = new string('-', width);

        return string.Join(Environment.NewLine, new[]
        {
            Center(businessName, width),
            Center("Ticket de prueba", width),
            line,
            request.ImprimirFechaHora ? $"Fecha: {now:dd/MM/yyyy HH:mm}" : "",
            request.ImprimirNumero ? "Ticket: #000125" : "",
            request.ImprimirCajero ? "Cajero: Admin" : "",
            line,
            FitLine("Producto ejemplo x1", "$ 1.000,00", width),
            FitLine("Descuento", "$ 0,00", width),
            line,
            FitLine("TOTAL", "$ 1.000,00", width),
            line,
            Center(message, width),
            "",
            "",
            ""
        });
    }

    private static string Center(string value, int width)
    {
        if (value.Length >= width) return value[..width];
        var left = (width - value.Length) / 2;
        return new string(' ', left) + value;
    }

    private static string FitLine(string left, string right, int width)
    {
        if (right.Length >= width) return right[..width];
        var availableLeft = width - right.Length - 1;
        var normalizedLeft = left.Length > availableLeft ? left[..availableLeft] : left;
        return normalizedLeft.PadRight(width - right.Length) + right;
    }

    private static List<string> GetInstalledPrinters()
    {
        var flags = PrinterEnumLocal | PrinterEnumConnections;
        _ = EnumPrinters(flags, null, 4, IntPtr.Zero, 0, out var needed, out var returned);
        if (needed == 0)
        {
            return [];
        }

        var buffer = Marshal.AllocHGlobal(needed);
        try
        {
            if (!EnumPrinters(flags, null, 4, buffer, needed, out _, out returned))
            {
                throw new InvalidOperationException("No se pudieron consultar las impresoras instaladas en Windows.");
            }

            var printers = new List<string>();
            var structSize = Marshal.SizeOf<PrinterInfo4>();
            for (var index = 0; index < returned; index += 1)
            {
                var current = IntPtr.Add(buffer, index * structSize);
                var info = Marshal.PtrToStructure<PrinterInfo4>(current);
                var name = Marshal.PtrToStringAuto(info.PrinterName);
                if (!string.IsNullOrWhiteSpace(name))
                {
                    printers.Add(name);
                }
            }

            return printers.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        }
        finally
        {
            Marshal.FreeHGlobal(buffer);
        }
    }

    private static string? GetDefaultPrinterName()
    {
        var builder = new StringBuilder(256);
        var size = builder.Capacity;
        return GetDefaultPrinter(builder, ref size) ? builder.ToString() : null;
    }

    private static bool IsTicketPrinterCandidate(string printerName)
    {
        return !printerName.Equals("Microsoft Print to PDF", StringComparison.OrdinalIgnoreCase)
            && !printerName.Equals("Microsoft XPS Document Writer", StringComparison.OrdinalIgnoreCase)
            && !printerName.Equals("OneNote for Windows 10", StringComparison.OrdinalIgnoreCase)
            && !printerName.Contains("PDF", StringComparison.OrdinalIgnoreCase)
            && !printerName.Contains("XPS", StringComparison.OrdinalIgnoreCase);
    }

    private static byte[] BuildRawTicketBytes(string content, bool cutPaper)
    {
        var contentBytes = Encoding.UTF8.GetBytes(content);
        if (!cutPaper)
        {
            return contentBytes;
        }

        return [.. contentBytes, .. CutPaperCommand];
    }

    private static void PrintRaw(string printerName, byte[] bytes)
    {
        if (!OpenPrinter(printerName, out var printerHandle, IntPtr.Zero))
        {
            throw new InvalidOperationException($"No se pudo abrir la impresora '{printerName}'.");
        }

        try
        {
            var document = new DocInfo
            {
                DocumentName = "CajaGo - Ticket de prueba",
                DataType = "RAW"
            };

            if (!StartDocPrinter(printerHandle, 1, document))
            {
                throw new InvalidOperationException("No se pudo iniciar el documento de impresion.");
            }

            try
            {
                if (!StartPagePrinter(printerHandle))
                {
                    throw new InvalidOperationException("No se pudo iniciar la pagina de impresion.");
                }

                if (!WritePrinter(printerHandle, bytes, bytes.Length, out var written) || written != bytes.Length)
                {
                    throw new InvalidOperationException("No se pudo enviar el ticket completo a la impresora.");
                }

                EndPagePrinter(printerHandle);
            }
            finally
            {
                EndDocPrinter(printerHandle);
            }
        }
        finally
        {
            ClosePrinter(printerHandle);
        }
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    private struct PrinterInfo4
    {
        public IntPtr PrinterName;
        public IntPtr ServerName;
        public uint Attributes;
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    private class DocInfo
    {
        [MarshalAs(UnmanagedType.LPTStr)]
        public string DocumentName = string.Empty;

        [MarshalAs(UnmanagedType.LPTStr)]
        public string? OutputFile;

        [MarshalAs(UnmanagedType.LPTStr)]
        public string DataType = "RAW";
    }

    [DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool EnumPrinters(
        int flags,
        string? name,
        int level,
        IntPtr printerInfo,
        int bufferSize,
        out int bytesNeeded,
        out int printersReturned);

    [DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool GetDefaultPrinter(StringBuilder printerName, ref int bufferSize);

    [DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool OpenPrinter(string printerName, out IntPtr printerHandle, IntPtr defaults);

    [DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool ClosePrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool StartDocPrinter(IntPtr printerHandle, int level, [In] DocInfo documentInfo);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndDocPrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool StartPagePrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndPagePrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool WritePrinter(IntPtr printerHandle, byte[] data, int count, out int written);
}
