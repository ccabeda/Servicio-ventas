using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.MediosPago;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.UseCases.MediosPago.Commands;
using ServicioVentas.Application.UseCases.MediosPago.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediosPagoController(
    ICreateMedioPagoHandler createHandler,
    IUpdateMedioPagoHandler updateHandler,
    IDeleteMedioPagoHandler deleteHandler,
    IGetMediosPagoHandler getAllHandler,
    IGetMedioPagoByIdHandler getByIdHandler) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MedioPagoDto>>> GetAll() => Ok(await getAllHandler.Handle(new GetMediosPagoQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MedioPagoDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetMedioPagoByIdQuery { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<MedioPagoDto>> Create([FromBody] CreateMedioPagoDto request)
    {
        var medioPago = await createHandler.Handle(new CreateMedioPagoCommand { MedioPago = request });
        return CreatedAtAction(nameof(GetById), new { id = medioPago.Id }, medioPago);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MedioPagoDto>> Update(int id, [FromBody] UpdateMedioPagoDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateMedioPagoCommand { Id = id, MedioPago = request }));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteMedioPagoCommand { Id = id });
        return NoContent();
    }
}
