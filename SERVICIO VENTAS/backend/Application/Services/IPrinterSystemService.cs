using ServicioVentas.Application.DTOs.Configuraciones;

namespace ServicioVentas.Application.Services;

public interface IPrinterSystemService
{
    List<ImpresoraDetectadaDto> GetDetectedPrinters();
    void EnsureTicketPrinterIsAvailable(string printerName);
    void PrintTestTicket(string? printerName, TicketPruebaImpresoraRequest request);
}
