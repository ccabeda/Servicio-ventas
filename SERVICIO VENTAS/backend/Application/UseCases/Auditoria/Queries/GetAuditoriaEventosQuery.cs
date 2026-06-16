namespace ServicioVentas.Application.UseCases.Auditoria.Queries;

public class GetAuditoriaEventosQuery
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public int? UsuarioId { get; set; }
    public string? Modulo { get; set; }
    public string? Accion { get; set; }
    public string? Search { get; set; }
}
