namespace ServicioVentas.Application.UseCases.Cajas.Queries;

public class GetHistorialCajasQuery
{
    public int UsuarioId { get; set; }
    public bool EsAdmin { get; set; }
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
}
