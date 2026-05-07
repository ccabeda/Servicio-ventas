using ServicioVentas.Application.DTOs.Clientes;

namespace ServicioVentas.Application.UseCases.Clientes.Commands;

public class CreateClienteCommand
{
    public CreateClienteDto Cliente { get; set; } = null!;
}
