import { LOW_STOCK_THRESHOLD } from "../../config.js";
import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";

export const dashboardMethods = {
  renderDashboard() {
    const resumen = this.state.reportes.resumen;
    const stats = [
      { label: "Ventas de hoy", value: resumen ? resumen.CantidadVentas : 0 },
      { label: "Total vendido", value: formatMoney(resumen?.TotalVendido || 0) },
      { label: "Ticket promedio", value: formatMoney(resumen?.TicketPromedio || 0) },
      { label: "Ganancia estimada", value: formatMoney(resumen?.GananciaEstimada || 0) }
    ];

    this.els.dashboardStats.innerHTML = stats.map(item => `
      <article class="stat-card">
        <span class="eyebrow">${item.label}</span>
        <strong>${item.value}</strong>
      </article>
    `).join("");

    this.els.dashboardCaja.innerHTML = this.state.cajaActual
      ? `
        <div class="caja-card">
          <div class="summary-line"><span>Estado</span><strong>${this.state.cajaActual.Abierta ? "Abierta" : "Cerrada"}</strong></div>
          <div class="summary-line"><span>Apertura</span><strong>${formatDateTime(this.state.cajaActual.FechaApertura)}</strong></div>
          <div class="summary-line"><span>Monto inicial</span><strong>${formatMoney(this.state.cajaActual.MontoInicial)}</strong></div>
          <div class="summary-line"><span>Usuario</span><strong>#${this.state.cajaActual.UsuarioAperturaId}</strong></div>
        </div>
      `
      : `<div class="empty-state compact">No hay caja abierta en este momento.</div>`;

    const config = this.state.configuraciones[0];
    this.els.dashboardConfig.innerHTML = config
      ? `
        <div class="config-card">
          <div class="summary-line"><span>Negocio</span><strong>${escapeHtml(config.NombreNegocio)}</strong></div>
          <div class="summary-line"><span>Telefono</span><strong>${escapeHtml(config.Telefono || "-")}</strong></div>
          <div class="summary-line"><span>Ticket termico</span><strong>${config.UsaTicketTermico ? "Si" : "No"}</strong></div>
        </div>
      `
      : `<div class="empty-state compact">Aun no se cargo la configuracion del negocio.</div>`;

    this.renderDashboardRecentSales();
    this.renderDashboardStockAlerts();
  },

  renderDashboardRecentSales() {
    const ventas = this.getRecentVentas(5);
    this.els.dashboardVentasRecientes.innerHTML = ventas.length
      ? ventas.map(venta => `
        <article class="stack-row">
          <div>
            <strong>#${venta.Id}</strong>
            <div class="muted">${formatDateTime(venta.Fecha)}</div>
          </div>
          <div class="stack-row-meta">
            <span>${formatNumber(venta.Detalles?.length || 0)} item(s)</span>
            <strong>${formatMoney(venta.Total)}</strong>
          </div>
        </article>
      `).join("")
      : `<div class="empty-state compact">Todavia no hay ventas registradas.</div>`;
  },

  renderDashboardStockAlerts() {
    const criticos = this.state.productos
      .filter(producto => producto.Activo && Number(producto.Stock) <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => Number(a.Stock) - Number(b.Stock))
      .slice(0, 6);

    this.els.dashboardStockCritico.innerHTML = criticos.length
      ? criticos.map(producto => `
        <article class="stack-row">
          <div>
            <strong>${escapeHtml(producto.Nombre)}</strong>
            <div class="muted">${escapeHtml(producto.CodigoInterno || producto.CodigoBarra || "Sin codigo")}</div>
          </div>
          <div class="stack-row-meta">
            <span class="stock-pill low">${formatNumber(producto.Stock)}</span>
          </div>
        </article>
      `).join("")
      : `<div class="empty-state compact">No hay productos en nivel critico.</div>`;
  }
};
