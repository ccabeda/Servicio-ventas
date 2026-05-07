using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Reportes;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.Reportes.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportesController(
    IGetResumenVentasHandler getResumenVentasHandler,
    IGetVentasPorPeriodoHandler getVentasPorPeriodoHandler,
    IGetProductosMasVendidosHandler getProductosMasVendidosHandler) : ControllerBase
{
    [HttpGet("resumen-ventas")]
    public async Task<ActionResult<ResumenVentasDto>> GetResumenVentas([FromQuery] DateTime? fechaDesde, [FromQuery] DateTime? fechaHasta)
    {
        var reporte = await getResumenVentasHandler.Handle(new GetResumenVentasQuery
        {
            FechaDesde = fechaDesde,
            FechaHasta = fechaHasta
        });

        return Ok(reporte);
    }

    [HttpGet("ventas")]
    public async Task<ActionResult<List<VentaReporteDto>>> GetVentasPorPeriodo(
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] int? cajaId,
        [FromQuery] int? usuarioId,
        [FromQuery] int? medioPagoId)
    {
        var reporte = await getVentasPorPeriodoHandler.Handle(new GetVentasPorPeriodoQuery
        {
            FechaDesde = fechaDesde,
            FechaHasta = fechaHasta,
            CajaId = cajaId,
            UsuarioId = usuarioId,
            MedioPagoId = medioPagoId
        });

        return Ok(reporte);
    }

    [HttpGet("productos-mas-vendidos")]
    public async Task<ActionResult<List<ProductoMasVendidoDto>>> GetProductosMasVendidos(
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] int top = 10)
    {
        var reporte = await getProductosMasVendidosHandler.Handle(new GetProductosMasVendidosQuery
        {
            FechaDesde = fechaDesde,
            FechaHasta = fechaHasta,
            Top = top
        });

        return Ok(reporte);
    }
}
