using ServicioVentas.Application.DTOs.Respaldos;

namespace ServicioVentas.Application.UseCases.Respaldos.Commands;

public class CrearRespaldoCommand
{
    public CrearRespaldoDto Request { get; set; } = new();
}
