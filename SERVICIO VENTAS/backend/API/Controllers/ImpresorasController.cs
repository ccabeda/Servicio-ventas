using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicioVentas.Application.DTOs.Configuraciones;
using ServicioVentas.Application.IHandlers;
using ServicioVentas.Application.Security;
using ServicioVentas.Application.Services;
using ServicioVentas.Application.UseCases.Configuraciones.Commands;
using ServicioVentas.Application.UseCases.Configuraciones.Queries;

namespace ServicioVentas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = PermisosSistema.ImpresorasGestionar)]
public class ImpresorasController(
    ICreateImpresoraHandler createHandler,
    IUpdateImpresoraHandler updateHandler,
    IDeleteImpresoraHandler deleteHandler,
    IGetImpresorasHandler getAllHandler,
    IGetImpresoraByIdHandler getByIdHandler,
    IPrintTicketPruebaImpresoraHandler printTestHandler,
    IPrinterSystemService printerSystem) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ImpresoraDto>>> GetAll()
    {
        return Ok(await getAllHandler.Handle(new GetImpresorasQuery()));
    }

    [HttpGet("detectadas")]
    public ActionResult<List<ImpresoraDetectadaDto>> GetDetected()
    {
        return Ok(printerSystem.GetDetectedPrinters());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ImpresoraDto>> GetById(int id)
    {
        return Ok(await getByIdHandler.Handle(new GetImpresoraByIdQuery { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<ImpresoraDto>> Create([FromBody] CreateImpresoraDto request)
    {
        var impresora = await createHandler.Handle(new CreateImpresoraCommand { Impresora = request });
        return CreatedAtAction(nameof(GetById), new { id = impresora.Id }, impresora);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ImpresoraDto>> Update(int id, [FromBody] UpdateImpresoraDto request)
    {
        return Ok(await updateHandler.Handle(new UpdateImpresoraCommand { Id = id, Impresora = request }));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.Handle(new DeleteImpresoraCommand { Id = id });
        return NoContent();
    }

    [HttpPost("{id:int}/ticket-prueba")]
    public async Task<IActionResult> PrintConfiguredTestTicket(int id, [FromBody] TicketPruebaImpresoraRequest request)
    {
        await printTestHandler.Handle(new PrintTicketPruebaImpresoraCommand
        {
            ImpresoraId = id,
            Request = request
        });
        return Ok(new { message = "Ticket de prueba enviado a la impresora." });
    }

    [HttpPost("ticket-prueba")]
    public async Task<IActionResult> PrintTestTicket([FromBody] TicketPruebaImpresoraRequest request)
    {
        await printTestHandler.Handle(new PrintTicketPruebaImpresoraCommand { Request = request });
        return Ok(new { message = "Ticket de prueba enviado a la impresora." });
    }
}
