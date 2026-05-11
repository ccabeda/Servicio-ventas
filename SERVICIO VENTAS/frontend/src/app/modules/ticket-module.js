import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";

export const ticketMethods = {
  openTicketModal(venta, ticketItems) {
    const config = this.state.configuraciones[0];
    const medioPago = this.state.mediosPago.find(item => item.Id === venta.MedioPagoId);
    const cliente = this.state.clientes.find(item => item.Id === venta.ClienteId);
    const details = ticketItems.map(item => `
      <div class="ticket-row">
        <span>${escapeHtml(item.nombre)} x${formatNumber(item.cantidad)}</span>
        <strong>${formatMoney(item.cantidad * item.precio)}</strong>
      </div>
    `).join("");

    this.els.ticketContent.innerHTML = `
      <div class="ticket-header">
        <h4>${escapeHtml(config?.NombreNegocio || "Servicio Ventas POS")}</h4>
        <div>${escapeHtml(config?.Direccion || "")}</div>
        <div>${escapeHtml(config?.Telefono || "")}</div>
      </div>
      <div class="ticket-row"><span>Venta</span><strong>#${venta.Id}</strong></div>
      <div class="ticket-row"><span>Fecha</span><strong>${formatDateTime(venta.Fecha)}</strong></div>
      <div class="ticket-row"><span>Cajero</span><strong>${escapeHtml(this.state.session?.NombreUsuario || "")}</strong></div>
      <div class="ticket-row"><span>Pago</span><strong>${escapeHtml(medioPago?.Nombre || "-")}</strong></div>
      <div class="ticket-row"><span>Cliente</span><strong>${escapeHtml(cliente?.Nombre || "Consumidor final")}</strong></div>
      <hr>
      ${details}
      <hr>
      <div class="ticket-row"><span>Subtotal</span><strong>${formatMoney(venta.Subtotal)}</strong></div>
      <div class="ticket-row"><span>Descuento</span><strong>${formatMoney(venta.Descuento)}</strong></div>
      <div class="ticket-row"><span>Recargo</span><strong>${formatMoney(venta.Recargo)}</strong></div>
      <div class="ticket-row"><span>Total</span><strong>${formatMoney(venta.Total)}</strong></div>
      ${config?.MensajeTicket ? `<hr><div>${escapeHtml(config.MensajeTicket)}</div>` : ""}
    `;

    this.els.ticketModal.classList.remove("hidden");
  },

  closeTicketModal() {
    this.els.ticketModal.classList.add("hidden");
  }
};
