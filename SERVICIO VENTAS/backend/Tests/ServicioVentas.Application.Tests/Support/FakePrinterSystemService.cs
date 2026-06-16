using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.Services;

namespace ServicioVentas.Application.Tests.Support;

internal class FakePrinterSystemService : IPrinterSystemService
{
    public bool ThrowOnEnsure { get; set; }
    public List<string> EnsuredPrinters { get; } = [];
    public List<string?> PrintedPrinters { get; } = [];

    public List<ImpresoraDetectadaDto> GetDetectedPrinters() => [];

    public void EnsureTicketPrinterIsAvailable(string printerName)
    {
        EnsuredPrinters.Add(printerName);
        if (ThrowOnEnsure)
        {
            throw new InvalidOperationException("Impresora no disponible.");
        }
    }

    public void PrintTestTicket(string? printerName, TicketPruebaImpresoraRequest request)
    {
        PrintedPrinters.Add(printerName);
    }
}
