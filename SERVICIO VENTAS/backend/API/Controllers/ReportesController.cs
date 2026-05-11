using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
            FechaHasta = fechaHasta,
            UsuarioId = EsAdmin() ? null : GetCurrentUserId()
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
            UsuarioId = EsAdmin() ? usuarioId : GetCurrentUserId(),
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
            UsuarioId = EsAdmin() ? null : GetCurrentUserId(),
            Top = top
        });

        return Ok(reporte);
    }

    private int GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

        if (!int.TryParse(userIdValue, out var userId))
            throw new UnauthorizedAccessException("Token invalido.");

        return userId;
    }

    private bool EsAdmin() => User.IsInRole("Admin");
}
