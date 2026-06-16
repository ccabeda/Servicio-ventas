namespace ServicioVentas.Application.UseCases.Ventas.Queries;

public class GetVentasQuery
{
    public int? UsuarioId { get; set; }
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
}
