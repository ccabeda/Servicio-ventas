import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";

export const ticketMethods = {
  openTicketModal(venta, ticketItems) {
    const config = this.state.configuraciones[0] || {};
    const ticketConfig = this.getTicketConfig();
    const fechaHora = ticketConfig?.ImprimirFechaHoraTicket !== false ? formatDateTime(venta.Fecha) : "";
    const medioPago = this.state.mediosPago.find(item => item.Id === venta.MedioPagoId);
    const cliente = this.state.clientes.find(item => item.Id === venta.ClienteId);
    const showBusinessData = ticketConfig?.ImprimirDatosNegocioTicket !== false;
    const showMedioPago = ticketConfig?.ImprimirMedioPagoTicket !== false;
    const showCliente = ticketConfig?.ImprimirClienteTicket !== false;
    const showMensajeCierre = ticketConfig?.ImprimirMensajeCierreTicket !== false;
    const logoUrl = config?.LogoUrl || "";
    const businessLines = [config?.Direccion].filter(Boolean);
    const details = ticketItems.map(item => `
      <div class="ticket-row">
        <span>${escapeHtml(item.nombre)} x${formatNumber(item.cantidad)}</span>
        <strong>${formatMoney(item.cantidad * item.precio)}</strong>
      </div>
    `).join("");

    const showSubtotalTotal = ticketConfig?.ImprimirSubtotalTotalTicket !== false;
    const summaryRows = [
      showSubtotalTotal ? `<div class="ticket-row"><span>Subtotal</span><strong>${formatMoney(venta.Subtotal)}</strong></div>` : "",
      ticketConfig?.ImprimirDescuentoRecargoTicket !== false ? `<div class="ticket-row"><span>Descuento</span><strong>${formatNumber(venta.Descuento)}%</strong></div>` : "",
      ticketConfig?.ImprimirDescuentoRecargoTicket !== false ? `<div class="ticket-row"><span>Recargo</span><strong>${formatMoney(venta.Recargo)}</strong></div>` : "",
      showSubtotalTotal ? `<div class="ticket-row"><span>Total</span><strong>${formatMoney(venta.Total)}</strong></div>` : ""
    ].filter(Boolean).join("");

    const saleMetaRows = [
      fechaHora ? `<div class="ticket-row"><span>Fecha</span><strong>${fechaHora}</strong></div>` : "",
      ticketConfig?.ImprimirNumeroTicket !== false ? `<div class="ticket-row"><span>Venta</span><strong>#${venta.Id}</strong></div>` : "",
      ticketConfig?.ImprimirCajeroTicket !== false ? `<div class="ticket-row"><span>Cajero</span><strong>${escapeHtml(this.state.session?.NombreUsuario || "")}</strong></div>` : ""
    ].join("");

    const ticketHtml = `
      <div class="ticket-header">
        <div class="ticket-header-main">
          <!-- Pendiente: para impresoras térmicas reales, el logo debe convertirse a comandos ESC/POS desde backend. -->
          ${logoUrl ? `<img class="ticket-logo" src="${escapeHtml(logoUrl)}" alt="Logo del negocio">` : ""}
          <h4>${escapeHtml(config?.NombreNegocio || "CajaGo")}</h4>
          ${showBusinessData && businessLines.length ? `<div>${businessLines.map(line => escapeHtml(line)).join("<br>")}</div>` : ""}
        </div>
      </div>
      ${saleMetaRows}
      ${showMedioPago ? `<div class="ticket-row"><span>Pago</span><strong>${escapeHtml(medioPago?.Nombre || "-")}</strong></div>` : ""}
      ${showCliente ? `<div class="ticket-row"><span>Cliente</span><strong>${escapeHtml(cliente?.Nombre || "Consumidor final")}</strong></div>` : ""}
      <hr>
      ${details}
      ${summaryRows ? `<hr>${summaryRows}` : ""}
      ${showMensajeCierre && ticketConfig?.MensajeTicket ? `<hr><div>${escapeHtml(ticketConfig.MensajeTicket)}</div>` : ""}
    `;

    this.els.ticketContent.innerHTML = ticketConfig?.ImprimirCopiaTicket
      ? `
        <section class="ticket-copy">
          <div class="ticket-copy-label">Original</div>
          ${ticketHtml}
        </section>
        <section class="ticket-copy">
          <div class="ticket-copy-label">Copia</div>
          ${ticketHtml}
        </section>
      `
      : ticketHtml;

    this.els.ticketModal.classList.remove("hidden");

    if (ticketConfig?.VistaPreviaAntesImprimir === false) {
      window.setTimeout(() => this.printTicket({ closeAfterPrint: true }), 80);
    }
  },

  printTicket({ closeAfterPrint = false } = {}) {
    if (closeAfterPrint) {
      const close = () => {
        window.removeEventListener("afterprint", close);
        this.closeTicketModal();
      };
      window.addEventListener("afterprint", close);
    }
    window.print();
  },

  closeTicketModal() {
    this.els.ticketModal.classList.add("hidden");
  }
};
