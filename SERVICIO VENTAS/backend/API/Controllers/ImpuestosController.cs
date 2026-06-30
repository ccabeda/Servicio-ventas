using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Impuestos;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.UseCases.Impuestos.Commands;
using ServicioVentas.Application.UseCases.Impuestos.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ImpuestosController(
    ICreateImpuestoHandler createHandler,
    IUpdateImpuestoHandler updateHandler,
    IDeleteImpuestoHandler deleteHandler,
    IGetImpuestosHandler getAllHandler,
    IGetImpuestoByIdHandler getByIdHandler,
    IGetImpuestoResumenHandler resumenHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ImpuestoDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetImpuestosQuery()));

    [HttpGet("paginado")]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int pageIndex = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string estado = "activos")
    {
        return Ok(await getAllHandler.HandlePaged(new GetImpuestosQuery
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            Search = search,
            Estado = estado
        }));
    }

    [HttpGet("resumen")]
    public async Task<ActionResult<ImpuestoResumenDto>> GetResumen() => Ok(await resumenHandler.Handle(new GetImpuestoResumenQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ImpuestoDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetImpuestoByIdQuery { Id = id }));
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpPost]
    public async Task<ActionResult<ImpuestoDto>> Create([FromBody] CreateImpuestoDto request)
    {
        var impuesto = await createHandler.Handle(new CreateImpuestoCommand { Impuesto = request });
        return CreatedAtAction(nameof(GetById), new { id = impuesto.Id }, impuesto);
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ImpuestoDto>> Update(int id, [FromBody] UpdateImpuestoDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateImpuestoCommand { Id = id, Impuesto = request }));
    }

    [Authorize(Policy = PermisosSistema.ConfiguracionGestionar)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteImpuestoCommand { Id = id });
        return NoContent();
    }
}
