using AutoMapper;
using ServicioVentas.Application.DTOs.Cajas;
using ServicioVentas.Application.Exceptions;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.IRepository.IQuery;
using ServicioVentas.Application.UseCases.Cajas.Queries;
using ServicioVentas.Domain.Enums;

namespace ServicioVentas.Application.UseCases.Cajas.Handlers;

public class GetResumenCajaHandler(IMapper mapper, ICajaRepositoryQuery cajaRepositoryQuery) : IGetResumenCajaHandler
{
    public async Task<CajaResumenDto> Handle(GetResumenCajaQuery query)
    {
        var caja = await cajaRepositoryQuery.GetByIdAsync(query.CajaId)
            ?? throw new KeyNotFoundException("Caja no encontrada.");

        if (!query.EsAdmin && caja.UsuarioAperturaId != query.UsuarioId)
            throw new ForbiddenAccessException("No tienes permisos para ver el resumen de esa caja.");

        var movimientos = await cajaRepositoryQuery.GetMovimientosByCajaIdAsync(caja.Id);
        var ventasPorMedioPago = await cajaRepositoryQuery.GetVentasPorMedioPagoByCajaIdAsync(caja.Id);
        var ventasEfectivo = ventasPorMedioPago
            .Where(x => x.EsEfectivo)
            .Sum(x => x.Total);
        var ingresosManuales = movimientos
            .Where(x => x.Tipo == TipoMovimientoCaja.Ingreso)
            .Sum(x => x.Monto);
        var egresos = movimientos
            .Where(x => x.Tipo == TipoMovimientoCaja.Egreso)
            .Sum(x => x.Monto);
        var totalEsperado = caja.MontoInicial + ventasEfectivo + ingresosManuales - egresos;
        var diferencia = caja.MontoFinal.HasValue
            ? caja.MontoFinal.Value - totalEsperado
            : (decimal?)null;
        var cajaDto = mapper.Map<CajaDto>(caja);
        cajaDto.SaldoSistema = totalEsperado;
        cajaDto.Diferencia = diferencia;

        return new CajaResumenDto
        {
            Caja = cajaDto,
            Movimientos = mapper.Map<List<MovimientoCajaDto>>(movimientos),
            VentasPorMedioPago = ventasPorMedioPago,
            MontoInicial = caja.MontoInicial,
            VentasEfectivo = ventasEfectivo,
            TotalVentas = ventasPorMedioPago.Sum(x => x.Total),
            IngresosManuales = ingresosManuales,
            Egresos = egresos,
            TotalEsperado = totalEsperado,
            MontoContado = caja.MontoFinal,
            Diferencia = diferencia,
            Observacion = caja.MotivoCierre
        };
    }
}
