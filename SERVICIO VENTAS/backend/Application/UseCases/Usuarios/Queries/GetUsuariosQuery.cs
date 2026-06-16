namespace ServicioVentas.Application.UseCases.Usuarios.Queries;

public class GetUsuariosQuery
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public string? Search { get; set; }
    public string Estado { get; set; } = "activos";
}
