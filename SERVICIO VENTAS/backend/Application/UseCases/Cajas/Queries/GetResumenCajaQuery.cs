namespace ServicioVentas.Application.UseCases.Cajas.Queries;

public class GetResumenCajaQuery
{
    public int CajaId { get; set; }
    public int UsuarioId { get; set; }
    public bool EsAdmin { get; set; }
}
