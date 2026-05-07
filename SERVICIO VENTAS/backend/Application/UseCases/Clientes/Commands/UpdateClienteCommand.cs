using ServicioVentas.Application.DTOs.Clientes;

namespace ServicioVentas.Application.UseCases.Clientes.Commands;

public class UpdateClienteCommand
{
    public int Id { get; set; }
    public UpdateClienteDto Cliente { get; set; } = null!;
}
