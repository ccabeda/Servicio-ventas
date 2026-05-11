import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { saveJson } from "../../utils/storage.js";
import { rowEmpty, setButtonLoading } from "../../utils/ui.js";

export const reportesMethods = {
  renderReportesView() {
    const fechaDesdeInput = this.els.reportesFilterForm.querySelector("[name='FechaDesde']");
    const fechaHastaInput = this.els.reportesFilterForm.querySelector("[name='FechaHasta']");
    fechaDesdeInput.value = this.state.reportFilters.fechaDesde || "";
    fechaHastaInput.value = this.state.reportFilters.fechaHasta || "";

    const resumen = this.state.reportes.resumen;
    const cards = [
      { label: "Total vendido", value: formatMoney(resumen?.TotalVendido || 0) },
      { label: "Ventas", value: String(resumen?.CantidadVentas || 0) },
      { label: "Unidades vendidas", value: formatNumber(resumen?.UnidadesVendidas || 0) },
      { label: "Ganancia estimada", value: formatMoney(resumen?.GananciaEstimada || 0) }
    ];

    this.els.reportesStats.innerHTML = cards.map(card => `
      <article class="stat-card">
        <span class="eyebrow">${card.label}</span>
        <strong>${card.value}</strong>
      </article>
    `).join("");

    this.els.topProductosList.innerHTML = this.state.reportes.topProductos.length
      ? this.state.reportes.topProductos.map((item, index) => `
        <article class="ranking-row">
          <span class="rank-number">${index + 1}</span>
          <div>
            <h4>${escapeHtml(item.Nombre)}</h4>
            <small>${formatNumber(item.CantidadVendida)} unidades | ${formatMoney(item.ImporteVendido)}</small>
          </div>
          <strong>${formatMoney(item.GananciaEstimada)}</strong>
        </article>
      `).join("")
      : `<div class="empty-state">No hay datos para ese periodo.</div>`;

    this.els.reportesVentasTableBody.innerHTML = this.state.reportes.ventas.length
      ? this.state.reportes.ventas.map(venta => `
        <tr>
          <td>${formatDateTime(venta.Fecha)}</td>
          <td>${escapeHtml(venta.UsuarioNombre)}</td>
          <td>${escapeHtml(venta.MedioPagoNombre)}</td>
          <td>${formatNumber(venta.UnidadesVendidas)}</td>
          <td>${formatMoney(venta.Total)}</td>
        </tr>
      `).join("")
      : rowEmpty("No hay ventas para ese periodo.", 5);
  },

  async handleReportFilter(event) {
    event.preventDefault();
    const submitButton = event.currentTarget.querySelector("button[type='submit']");
    const fechaDesdeInput = event.currentTarget.querySelector("[name='FechaDesde']");
    const fechaHastaInput = event.currentTarget.querySelector("[name='FechaHasta']");
    this.state.reportFilters.fechaDesde = fechaDesdeInput.value;
    this.state.reportFilters.fechaHasta = fechaHastaInput.value;
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);
    setButtonLoading(submitButton, true, "Aplicando...");

    try {
      await this.loadReportes();
      this.renderReportesView();
      this.toast("Filtros de reportes aplicados.", "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Aplicar");
    }
  },

  async applyReportPreset(preset) {
    const buttonMap = {
      today: this.els.presetTodayButton,
      week: this.els.presetWeekButton,
      month: this.els.presetMonthButton
    };
    const activeButton = buttonMap[preset];
    const today = new Date();
    let desde = new Date(today);

    if (preset === "week") {
      desde.setDate(today.getDate() - 6);
    } else if (preset === "month") {
      desde = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    this.state.reportFilters.fechaDesde = this.toDateInputValue(desde);
    this.state.reportFilters.fechaHasta = this.toDateInputValue(today);
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);

    const fechaDesdeInput = this.els.reportesFilterForm.querySelector("[name='FechaDesde']");
    const fechaHastaInput = this.els.reportesFilterForm.querySelector("[name='FechaHasta']");
    fechaDesdeInput.value = this.state.reportFilters.fechaDesde;
    fechaHastaInput.value = this.state.reportFilters.fechaHasta;

    setButtonLoading(activeButton, true, "Cargando...");

    try {
      await this.loadReportes();
      this.renderReportesView();
      const labels = { today: "hoy", week: "los ultimos 7 dias", month: "el mes actual" };
      this.toast(`Reporte actualizado para ${labels[preset]}.`, "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      const labels = { today: "Hoy", week: "7 dias", month: "Mes" };
      setButtonLoading(activeButton, false, labels[preset]);
    }
  },

  exportVentasCsv() {
    if (!this.state.reportes.ventas.length) {
      this.toast("No hay ventas para exportar.", "info");
      return;
    }

    const rows = [
      ["Fecha", "VentaId", "Usuario", "MedioPago", "Cliente", "Items", "Unidades", "Total"],
      ...this.state.reportes.ventas.map(venta => [
        formatDateTime(venta.Fecha),
        venta.VentaId,
        venta.UsuarioNombre,
        venta.MedioPagoNombre,
        venta.ClienteNombre || "",
        venta.CantidadItems,
        venta.UnidadesVendidas,
        venta.Total
      ])
    ];

    const csv = rows
      .map(row => row.map(value => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reporte-ventas.csv";
    link.click();
    URL.revokeObjectURL(url);
    this.toast("Reporte exportado en CSV.", "success");
  }
};
