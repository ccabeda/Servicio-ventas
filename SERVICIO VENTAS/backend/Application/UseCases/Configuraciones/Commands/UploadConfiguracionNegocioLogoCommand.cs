using ServicioVentas.Application.Services;

namespace ServicioVentas.Application.UseCases.Configuraciones.Commands;

public class UploadConfiguracionNegocioLogoCommand
{
    public int Id { get; set; }
    public ApplicationFile? Archivo { get; set; }
    public CancellationToken CancellationToken { get; set; }
}
