import { API_ENDPOINTS } from "../../config.js";
import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { saveJson } from "../../utils/storage.js";
import { rowSkeleton, setButtonLoading } from "../../utils/ui.js";

export const reportesMethods = {
  renderReportesView() {
    const fechaDesdeInput = this.els.reportesFilterForm.querySelector("[name='FechaDesde']");
    const fechaHastaInput = this.els.reportesFilterForm.querySelector("[name='FechaHasta']");
    fechaDesdeInput.value = this.state.reportFilters.fechaDesde || "";
    fechaHastaInput.value = this.state.reportFilters.fechaHasta || "";
    this.syncReportDateDisplays();
    this.syncReportPeriodTabs();

    const resumen = this.state.reportes.resumen;
    const cajaAbierta = Boolean(this.state.cajaActual?.Abierta);
    const cajaLabel = this.state.cajaActual?.Id ? `Caja ${this.state.cajaActual.Id}` : "Caja 1";
    const cards = [
      { label: "Total vendido", value: formatMoney(resumen?.TotalVendido || 0), meta: "Periodo seleccionado", tone: "is-money" },
      { label: "Cantidad ventas", value: formatNumber(resumen?.CantidadVentas || 0), meta: "Ventas registradas", tone: "is-sales" },
      { label: "Productos vendidos", value: formatNumber(resumen?.UnidadesVendidas || 0), meta: "Unidades vendidas", tone: "is-products" },
      { label: "Caja actual", value: cajaLabel, meta: cajaAbierta ? "Abierta" : "Cerrada", tone: "is-caja" }
    ];

    this.els.reportesStats.innerHTML = cards.map(card => `
      <article class="reportes-stat-card ${card.tone}">
        <span class="reportes-stat-icon" aria-hidden="true">${this.getReportStatIcon(card.tone)}</span>
        <div>
          <span>${card.label}</span>
          <strong>${card.value}</strong>
          <small>${card.meta}</small>
        </div>
      </article>
    `).join("");

    const maxCantidadVendida = Math.max(...this.state.reportes.topProductos.map(item => Number(item.CantidadVendida) || 0), 0);
    this.els.topProductosList.innerHTML = this.state.reportes.topProductos.length
      ? this.state.reportes.topProductos.map((item, index) => `
        <article class="reportes-product-row">
          <span class="reportes-rank-number">${index + 1}</span>
          <div class="reportes-product-main">
            <div>
              <h4>${escapeHtml(item.Nombre)}</h4>
              <small>${formatMoney(item.ImporteVendido)} vendidos</small>
            </div>
            <div class="reportes-progress" aria-hidden="true">
              <span style="width: ${this.getReportProgressWidth(item.CantidadVendida, maxCantidadVendida)}%"></span>
            </div>
          </div>
          <strong>${formatNumber(item.CantidadVendida)}</strong>
        </article>
      `).join("")
      : `<div class="empty-state">
          <strong>No hay productos vendidos en este período</strong>
          <small>Probá cambiar las fechas o registrar ventas para ver el ranking.</small>
        </div>`;

    this.els.reportesVentasTableBody.innerHTML = this.state.reportes.ventas.length
      ? this.state.reportes.ventas.map(venta => `
        <tr>
          <td data-label="Hora">${this.formatReportTime(venta.Fecha)}</td>
          <td data-label="Cajero">${escapeHtml(venta.UsuarioNombre)}</td>
          <td data-label="Total">${formatMoney(venta.Total)}</td>
          <td data-label="Medio de pago">
            <span class="reportes-payment-badge ${this.getPaymentTone(venta.MedioPagoNombre)}">
              ${this.getPaymentIcon(venta.MedioPagoNombre)}
              ${escapeHtml(venta.MedioPagoNombre || "Sin medio")}
            </span>
          </td>
        </tr>
      `).join("")
      : `
        <tr class="reportes-empty-row">
          <td colspan="4">
            <div class="reportes-empty-state">
              <span class="table-state-icon" aria-hidden="true"></span>
              <strong>No hay ventas para ese período</strong>
              <small>Ajustá el rango de fechas o registrá nuevas ventas para generar el reporte.</small>
            </div>
          </td>
        </tr>
      `;

    this.renderReportPaymentBreakdown();
    this.bindReportesQuickActions();
  },

  async handleReportFilter(event) {
    event.preventDefault();
    const submitButton = event.currentTarget.querySelector("button[type='submit']");
    const fechaDesdeInput = event.currentTarget.querySelector("[name='FechaDesde']");
    const fechaHastaInput = event.currentTarget.querySelector("[name='FechaHasta']");
    if (!fechaDesdeInput.value || !fechaHastaInput.value) {
      this.toast("Seleccioná fecha desde y fecha hasta para aplicar el reporte.", "error");
      this.showReportCustomDates();
      return;
    }

    if (this.isFutureReportDate(fechaDesdeInput.value) || this.isFutureReportDate(fechaHastaInput.value)) {
      this.toast("No se pueden consultar fechas futuras.", "error");
      this.showReportCustomDates();
      return;
    }

    if (fechaDesdeInput.value > fechaHastaInput.value) {
      this.toast("La fecha desde no puede ser posterior a la fecha hasta.", "error");
      this.showReportCustomDates();
      return;
    }

    this.state.reportFilters.fechaDesde = fechaDesdeInput.value;
    this.state.reportFilters.fechaHasta = fechaHastaInput.value;
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);
    setButtonLoading(submitButton, true, "Aplicando...");
    this.els.reportesVentasTableBody.innerHTML = rowSkeleton(4, 5);

    try {
      await this.loadReportes();
      this.renderReportesView();
      this.hideReportCustomDates();
      this.toast("Filtros de reportes aplicados.", "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Aplicar");
    }
  },

  async applyReportPreset(preset) {
    this.hideReportCustomDates();
    const buttonMap = {
      today: this.els.presetTodayButton,
      yesterday: this.els.presetYesterdayButton,
      week: this.els.presetWeekButton,
      month: this.els.presetMonthButton
    };
    const activeButton = buttonMap[preset];
    const today = new Date();
    let desde = new Date(today);

    if (preset === "yesterday") {
      desde.setDate(today.getDate() - 1);
    } else if (preset === "week") {
      desde.setDate(today.getDate() - 6);
    } else if (preset === "month") {
      desde = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    this.state.reportFilters.fechaDesde = this.toDateInputValue(desde);
    this.state.reportFilters.fechaHasta = this.toDateInputValue(preset === "yesterday" ? desde : today);
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);

    const fechaDesdeInput = this.els.reportesFilterForm.querySelector("[name='FechaDesde']");
    const fechaHastaInput = this.els.reportesFilterForm.querySelector("[name='FechaHasta']");
    fechaDesdeInput.value = this.state.reportFilters.fechaDesde;
    fechaHastaInput.value = this.state.reportFilters.fechaHasta;
    this.syncReportDateDisplays();

    setButtonLoading(activeButton, true, "Cargando...");
    this.els.reportesVentasTableBody.innerHTML = rowSkeleton(4, 5);

    try {
      await this.loadReportes();
      this.renderReportesView();
      const labels = { today: "hoy", yesterday: "ayer", week: "los últimos 7 días", month: "el mes actual" };
      this.toast(`Reporte actualizado para ${labels[preset]}.`, "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      const labels = { today: "Hoy", yesterday: "Ayer", week: "Esta semana", month: "Este mes" };
      setButtonLoading(activeButton, false, labels[preset]);
    }
  },

  exportVentasCsv() {
    if (!this.state.reportes.ventas.length) {
      this.toast("No hay ventas para exportar.", "info");
      return;
    }

    const rows = [
      ["Hora", "N° Ticket", "Cajero", "Total", "Ítems", "Medio de pago", "Cliente"],
      ...this.state.reportes.ventas.map(venta => [
        this.formatReportTime(venta.Fecha),
        this.formatReportTicketNumber(venta.VentaId),
        venta.UsuarioNombre || "",
        venta.Total,
        venta.CantidadItems,
        venta.MedioPagoNombre || "",
        venta.ClienteNombre || "-"
      ])
    ];

    this.downloadCsv(rows, this.getReportCsvFileName());
    this.toast("Reporte exportado en CSV.", "success");
  },

  exportReportSummaryCsv() {
    const resumen = this.state.reportes.resumen || {};
    const ventas = this.state.reportes.ventas || [];
    const productos = this.state.reportes.topProductos || [];
    const pagos = this.getReportPaymentSummary();
    const rows = [
      ["Reporte de ventas"],
      ["Periodo", `${this.formatReportDateLabel(this.state.reportFilters.fechaDesde)} - ${this.formatReportDateLabel(this.state.reportFilters.fechaHasta)}`],
      ["Cajero", this.getReportFilterLabel("usuarioId", this.getReportUsuarioOptions())],
      ["Medio de pago", this.getReportFilterLabel("medioPagoId", this.getReportMedioPagoOptions())],
      ["Cliente", this.getReportFilterLabel("clienteId", this.getReportClienteOptions())],
      ["Total mínimo", this.state.reportFilters.totalMinimo || "Sin mínimo"],
      ["Total máximo", this.state.reportFilters.totalMaximo || "Sin máximo"],
      [],
      ["Resumen"],
      ["Total vendido", resumen.TotalVendido || 0],
      ["Cantidad ventas", resumen.CantidadVentas || 0],
      ["Productos vendidos", resumen.UnidadesVendidas || 0],
      ["Ticket promedio", resumen.TicketPromedio || 0],
      ["Ganancia estimada", resumen.GananciaEstimada || 0],
      [],
      ["Métodos de pago"],
      ["Medio de pago", "Total", "Porcentaje"],
      ...pagos.map(item => [item.name, item.total, `${item.percent}%`]),
      [],
      ["Productos más vendidos"],
      ["Producto", "Cantidad", "Importe vendido", "Ganancia estimada"],
      ...productos.map(item => [
        item.Nombre,
        item.CantidadVendida,
        item.ImporteVendido,
        item.GananciaEstimada
      ]),
      [],
      ["Detalle de ventas"],
      ["Hora", "N° Ticket", "Cajero", "Total", "Ítems", "Medio de pago", "Cliente"],
      ...ventas.map(venta => [
        this.formatReportTime(venta.Fecha),
        this.formatReportTicketNumber(venta.VentaId),
        venta.UsuarioNombre || "",
        venta.Total,
        venta.CantidadItems,
        venta.MedioPagoNombre || "",
        venta.ClienteNombre || "-"
      ])
    ];

    this.downloadCsv(rows, this.getReportSummaryCsvFileName());
    this.toast("Resumen de reportes exportado en CSV.", "success");
  },

  renderReportPaymentBreakdown() {
    const donut = document.getElementById("reportesPaymentDonut");
    const list = document.getElementById("reportesPaymentList");
    const totalElement = document.getElementById("reportesPaymentTotal");
    if (!donut || !list || !totalElement) return;

    const colors = ["#2ca44f", "#2563eb", "#8b20ca", "#f97316", "#ef1717"];
    const grouped = new Map();
    this.state.reportes.ventas.forEach(venta => {
      const name = venta.MedioPagoNombre || "Sin medio";
      grouped.set(name, (grouped.get(name) || 0) + (Number(venta.Total) || 0));
    });

    const items = Array.from(grouped, ([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
    const total = items.reduce((sum, item) => sum + item.total, 0);
    totalElement.textContent = formatMoney(total);

    if (!items.length || total <= 0) {
      donut.style.background = "conic-gradient(#e6e1dc 0 100%)";
      list.innerHTML = `<div class="empty-state reportes-payment-empty">
        <strong>Sin medios de pago</strong>
        <small>Cuando registres ventas, vas a ver el desglose por medio.</small>
      </div>`;
      return;
    }

    let cursor = 0;
    const gradient = items.map((item, index) => {
      const start = cursor;
      const percent = (item.total / total) * 100;
      cursor += percent;
      return `${colors[index % colors.length]} ${start}% ${cursor}%`;
    }).join(", ");
    donut.style.background = `conic-gradient(${gradient})`;

    list.innerHTML = items.map((item, index) => {
      const percent = Math.round((item.total / total) * 100);
      return `
        <div class="reportes-payment-item">
          <span><i style="background:${colors[index % colors.length]}" aria-hidden="true"></i>${escapeHtml(item.name)}</span>
          <strong>${formatMoney(item.total)}</strong>
          <small>${percent}%</small>
        </div>
      `;
    }).join("");
  },

  getReportPaymentSummary() {
    const ventas = this.state.reportes.ventas || [];
    const grouped = new Map();
    ventas.forEach(venta => {
      const name = venta.MedioPagoNombre || "Sin medio";
      grouped.set(name, (grouped.get(name) || 0) + (Number(venta.Total) || 0));
    });

    const total = Array.from(grouped.values()).reduce((sum, value) => sum + value, 0);
    return Array.from(grouped, ([name, value]) => ({
      name,
      total: value,
      percent: total > 0 ? Math.round((value / total) * 100) : 0
    })).sort((a, b) => b.total - a.total);
  },

  bindReportesQuickActions() {
    document.querySelectorAll("[data-report-action]").forEach(button => {
      if (button.dataset.reportActionBound === "true") return;
      button.dataset.reportActionBound = "true";
      button.addEventListener("click", () => {
        if (button.dataset.reportAction === "show-sales-history") {
          this.showReportesSalesHistory();
          return;
        }
        if (button.dataset.reportAction === "show-full-products-ranking") {
          this.openFullProductsRankingModal(button);
          return;
        }
        if (button.dataset.reportAction === "hide-sales-history") {
          this.hideReportesSalesHistory();
          return;
        }
        if (button.dataset.reportAction === "toggle-history-dates") {
          this.toggleReportHistoryDates();
          return;
        }
        if (button.dataset.reportAction === "toggle-history-more-filters") {
          this.toggleReportHistoryMoreFilters();
          return;
        }
        if (button.dataset.reportAction === "apply-history-more-filters") {
          this.applyReportHistoryMoreFilters(button);
          return;
        }
        if (button.dataset.reportAction === "clear-history-more-filters") {
          this.clearReportHistoryMoreFilters(button);
          return;
        }
        if (button.dataset.reportAction === "apply-history-dates") {
          this.applyReportHistoryDates(button);
          return;
        }
        if (button.dataset.reportAction === "show-sale-detail") {
          this.openReportSaleDetailModal(Number(button.dataset.saleId), button);
          return;
        }
        if (button.dataset.reportAction === "export-summary-csv") {
          this.exportReportSummaryCsv();
          return;
        }
        if (button.dataset.reportAction === "export-sales-csv" || button.dataset.reportAction === "export-csv") {
          this.exportVentasCsv();
          return;
        }
        if (button.dataset.reportAction === "print-summary") {
          this.printReportSummary();
          return;
        }
        window.print();
      });
    });
  },

  printReportSummary() {
    const resumen = this.state.reportes.resumen || {};
    const pagos = this.getReportPaymentSummary();
    const productos = this.state.reportes.topProductos || [];
    const config = this.state.configuraciones?.[0] || {};
    const period = `${this.formatReportDateLabel(this.state.reportFilters.fechaDesde)} - ${this.formatReportDateLabel(this.state.reportFilters.fechaHasta)}`;
    const activeFilters = [
      `Cajero: ${this.getReportFilterLabel("usuarioId", this.getReportUsuarioOptions())}`,
      `Medio: ${this.getReportFilterLabel("medioPagoId", this.getReportMedioPagoOptions())}`,
      `Cliente: ${this.getReportFilterLabel("clienteId", this.getReportClienteOptions())}`,
      this.state.reportFilters.totalMinimo ? `Mínimo: ${formatMoney(Number(this.state.reportFilters.totalMinimo))}` : "",
      this.state.reportFilters.totalMaximo ? `Máximo: ${formatMoney(Number(this.state.reportFilters.totalMaximo))}` : ""
    ].filter(Boolean).join(" · ");
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      this.toast("No se pudo abrir la ventana de impresión.", "error");
      return;
    }

    const paymentRows = pagos.length
      ? pagos.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${formatMoney(item.total)}</td><td>${item.percent}%</td></tr>`).join("")
      : `<tr><td colspan="3">Sin medios de pago para el período.</td></tr>`;
    const productRows = productos.length
      ? productos.map((item, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(item.Nombre)}</td><td>${formatNumber(item.CantidadVendida)}</td><td>${formatMoney(item.ImporteVendido)}</td></tr>`).join("")
      : `<tr><td colspan="4">Sin productos vendidos para el período.</td></tr>`;

    printWindow.document.write(`
      <!doctype html>
      <html>
      <head>
        <title>Resumen de reportes</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 28px; color: #15130f; font-family: Arial, sans-serif; background: #fff; }
          header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 18px; border-bottom: 2px solid #27964a; }
          h1 { margin: 0; font-size: 24px; letter-spacing: 0; }
          h2 { margin: 24px 0 10px; font-size: 15px; }
          p { margin: 6px 0 0; color: #5f6b5f; font-size: 13px; }
          .brand { color: #27964a; font-weight: 800; text-align: right; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px; }
          .stat { padding: 12px; border: 1px solid #dfe7dd; border-radius: 8px; background: #f8fbf7; }
          .stat span { display: block; color: #667366; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .stat strong { display: block; margin-top: 7px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; text-align: left; }
          th { color: #334155; background: #f8fafc; font-size: 11px; text-transform: uppercase; }
          .meta { margin-top: 8px; color: #475569; font-size: 12px; }
          @media print { body { padding: 18px; } .stats { grid-template-columns: repeat(2, 1fr); } }
        </style>
      </head>
      <body>
        <header>
          <div>
            <h1>Resumen de ventas</h1>
            <p>${escapeHtml(config.NombreNegocio || "CajaGo")}</p>
            <div class="meta">Período: ${escapeHtml(period)}</div>
            <div class="meta">Filtros: ${escapeHtml(activeFilters)}</div>
          </div>
          <div class="brand">CajaGo POS<br><span>${formatDateTime(new Date())}</span></div>
        </header>
        <section class="stats">
          <div class="stat"><span>Total vendido</span><strong>${formatMoney(resumen.TotalVendido || 0)}</strong></div>
          <div class="stat"><span>Ventas</span><strong>${formatNumber(resumen.CantidadVentas || 0)}</strong></div>
          <div class="stat"><span>Productos</span><strong>${formatNumber(resumen.UnidadesVendidas || 0)}</strong></div>
          <div class="stat"><span>Ticket promedio</span><strong>${formatMoney(resumen.TicketPromedio || 0)}</strong></div>
        </section>
        <h2>Medios de pago</h2>
        <table><thead><tr><th>Medio</th><th>Total</th><th>%</th></tr></thead><tbody>${paymentRows}</tbody></table>
        <h2>Productos más vendidos</h2>
        <table><thead><tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Importe</th></tr></thead><tbody>${productRows}</tbody></table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 150);
  },

  async openFullProductsRankingModal(button) {
    const query = this.buildReportQuery();
    const separator = query ? "&" : "?";
    setButtonLoading(button, true, "Cargando...");

    try {
      const productos = await this.api.request(`${API_ENDPOINTS.reportesProductosMasVendidos}${query}${separator}top=2147483647`);
      this.renderFullProductsRankingModal(productos || []);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Ver ranking completo");
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 16-9 5-9-5" /><path d="m21 12-9 5-9-5" /><path d="m3 8 9-5 9 5-9 5-9-5Z" /></svg>
        Ver ranking completo
      `;
    }
  },

  renderFullProductsRankingModal(productos) {
    const totalUnidades = productos.reduce((sum, item) => sum + (Number(item.CantidadVendida) || 0), 0);
    const totalImporte = productos.reduce((sum, item) => sum + (Number(item.ImporteVendido) || 0), 0);
    const maxCantidad = Math.max(...productos.map(item => Number(item.CantidadVendida) || 0), 0);

    this.els.modalRoot.querySelector(".modal-card")?.classList.add("report-products-ranking-modal");
    this.els.modalEyebrow.textContent = "Reportes";
    this.els.modalTitle.textContent = "Ranking completo";
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="report-ranking-modal">
        <section class="report-ranking-summary">
          <div><span>Productos</span><strong>${formatNumber(productos.length)}</strong></div>
          <div><span>Unidades vendidas</span><strong>${formatNumber(totalUnidades)}</strong></div>
          <div><span>Importe vendido</span><strong>${formatMoney(totalImporte)}</strong></div>
        </section>
        <section class="report-ranking-list">
          ${productos.length ? productos.map((item, index) => `
            <article class="report-ranking-row ${index < 3 ? "is-top" : ""}">
              <span class="report-ranking-position">${index + 1}</span>
              <div>
                <div class="report-ranking-product-head">
                  <strong>${escapeHtml(item.Nombre)}</strong>
                  ${index < 3 ? `<em>Top ${index + 1}</em>` : ""}
                </div>
                <small>${formatMoney(item.ImporteVendido)} vendidos · Ganancia estimada ${formatMoney(item.GananciaEstimada || 0)}</small>
                <span class="report-ranking-progress"><i style="width:${this.getReportProgressWidth(item.CantidadVendida, maxCantidad)}%"></i></span>
              </div>
              <b>${formatNumber(item.CantidadVendida)}</b>
            </article>
          `).join("") : `
            <div class="empty-state">
              <strong>No hay productos vendidos en este período</strong>
              <small>Ajustá los filtros o registrá ventas para generar el ranking.</small>
            </div>
          `}
        </section>
      </div>
      <div class="modal-actions report-ranking-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cerrar</button>
      </div>
    `;
    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalRoot.classList.remove("hidden");
  },

  showReportesSalesHistory() {
    document.querySelector("#reportesView .reportes-page")?.classList.add("hidden");
    document.getElementById("reportesSalesHistoryView")?.classList.remove("hidden");
    this.state.reportesHistoryPageIndex = this.state.reportesHistoryPageIndex || 1;
    this.bindReportDatePickers();
    this.bindReportHistoryFilters();
    this.renderReportesSalesHistory();
  },

  hideReportesSalesHistory() {
    document.getElementById("reportesSalesHistoryView")?.classList.add("hidden");
    document.querySelector("#reportesView .reportes-page")?.classList.remove("hidden");
  },

  renderReportesSalesHistory() {
    const page = this.state.reportesVentasPage || { Items: [], PageIndex: 1, PageSize: 8, TotalItems: 0, TotalPages: 1 };
    const ventas = this.state.reportes.ventas || [];
    const items = page.Items || [];
    const totalItems = page.TotalItems || 0;
    const pageIndex = page.PageIndex || 1;
    const pageSize = page.PageSize || 8;
    const start = (pageIndex - 1) * pageSize;
    const resumen = this.state.reportes.resumen || {};
    const efectivo = ventas
      .filter(venta => String(venta.MedioPagoNombre || "").toLowerCase().includes("efectivo"))
      .reduce((sum, venta) => sum + (Number(venta.Total) || 0), 0);
    const total = Number(resumen.TotalVendido || 0);
    const efectivoPercent = total > 0 ? Math.round((efectivo / total) * 100) : 0;

    const periodLabel = document.getElementById("reportesHistoryPeriodLabel");
    if (periodLabel) {
      periodLabel.textContent = `${this.formatReportDateLabel(this.state.reportFilters.fechaDesde)} - ${this.formatReportDateLabel(this.state.reportFilters.fechaHasta)}`;
    }
    this.renderReportHistoryFilterDropdowns();

    const stats = document.getElementById("reportesHistoryStats");
    if (stats) {
      stats.innerHTML = [
        { label: "Total vendido", value: formatMoney(total), icon: "is-money", meta: "" },
        { label: "Cantidad ventas", value: formatNumber(resumen.CantidadVentas || totalItems), icon: "is-sales", meta: "" },
        { label: "Ticket promedio", value: formatMoney(resumen.TicketPromedio || 0), icon: "is-ticket", meta: "" },
        { label: "Efectivo", value: `${formatMoney(efectivo)} (${efectivoPercent}%)`, icon: "is-caja", meta: "" }
      ].map(card => `
        <article class="reportes-history-stat ${card.icon}">
          <span class="reportes-stat-icon" aria-hidden="true">${this.getReportHistoryIcon(card.icon)}</span>
          <div>
            <span>${card.label}</span>
            <strong>${card.value}</strong>
          </div>
        </article>
      `).join("");
    }

    const body = document.getElementById("reportesHistoryTableBody");
    if (body) {
      body.innerHTML = items.length
        ? items.map(venta => `
          <tr>
            <td data-label="Hora">${this.formatReportTime(venta.Fecha)}</td>
            <td data-label="N° Ticket">${this.formatReportTicketNumber(venta.VentaId)}</td>
            <td data-label="Cajero">${escapeHtml(venta.UsuarioNombre || "-")}</td>
            <td data-label="Total">${formatMoney(venta.Total)}</td>
            <td data-label="Ítems">${formatNumber(venta.CantidadItems || 0)}</td>
            <td data-label="Medio de pago">
              <span class="reportes-payment-badge ${this.getPaymentTone(venta.MedioPagoNombre)}">
                ${this.getPaymentIcon(venta.MedioPagoNombre)}
                ${escapeHtml(venta.MedioPagoNombre || "Sin medio")}
              </span>
            </td>
            <td data-label="Cliente">${escapeHtml(venta.ClienteNombre || "-")}</td>
            <td data-label="Acciones">
              <button class="reportes-detail-button" type="button" data-report-action="show-sale-detail" data-sale-id="${venta.VentaId}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
                Ver más detalles
              </button>
            </td>
          </tr>
        `).join("")
        : `
          <tr class="reportes-empty-row">
            <td colspan="8">
              <div class="reportes-empty-state">
                <span class="table-state-icon" aria-hidden="true"></span>
                <strong>No hay ventas para ese período</strong>
                <small>Ajustá el rango de fechas para ver el historial.</small>
              </div>
            </td>
          </tr>
        `;
    }

    const range = document.getElementById("reportesHistoryRangeLabel");
    if (range) {
      const from = totalItems ? start + 1 : 0;
      const to = Math.min(start + pageSize, totalItems);
      range.textContent = `Mostrando ${from} a ${to} de ${totalItems} ventas`;
    }

    this.renderPagination({
      page,
      container: document.getElementById("reportesHistoryPagination"),
      label: "ventas",
      actionPrefix: "reportes-history-",
      onChange: async nextPage => {
        this.state.reportesHistoryPageIndex = nextPage;
        await this.loadReportesVentasPage(nextPage);
        this.renderReportesSalesHistory();
      }
    });
    this.bindReportesQuickActions();
  },

  async openReportSaleDetailModal(saleId, button) {
    if (!Number.isFinite(saleId) || saleId <= 0) {
      this.toast("No se pudo identificar la venta seleccionada.", "error");
      return;
    }

    const originalButtonHtml = button?.innerHTML;
    setButtonLoading(button, true, "Cargando...");
    try {
      await Promise.all([
        this.state.mediosPago?.length ? Promise.resolve() : this.loadMediosPago(),
        this.state.clientes?.length ? Promise.resolve() : this.loadClientes()
      ]);

      const venta = await this.api.request(`${API_ENDPOINTS.ventas}/${saleId}`);
      const ventaReporte = (this.state.reportes.ventas || []).find(item => Number(item.VentaId) === saleId);
      const ventaDetalle = {
        ...venta,
        UsuarioNombre: ventaReporte?.UsuarioNombre || venta.UsuarioNombre,
        MedioPagoNombre: ventaReporte?.MedioPagoNombre || venta.MedioPagoNombre,
        ClienteNombre: ventaReporte?.ClienteNombre || venta.ClienteNombre
      };
      this.renderReportSaleDetailModal(ventaDetalle);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Ver más detalles");
      if (button && originalButtonHtml) {
        button.innerHTML = originalButtonHtml;
      }
    }
  },

  renderReportSaleDetailModal(venta) {
    const medioPago = this.state.mediosPago.find(item => item.Id === venta.MedioPagoId);
    const cliente = this.state.clientes.find(item => item.Id === venta.ClienteId);
    const medioPagoNombre = medioPago?.Nombre || venta.MedioPagoNombre || "-";
    const clienteNombre = cliente?.Nombre || venta.ClienteNombre || "Consumidor final";
    const cajeroNombre = venta.UsuarioNombre || this.state.session?.NombreUsuario || "-";
    const detalles = Array.isArray(venta.Detalles) ? venta.Detalles : [];

    this.els.modalRoot.querySelector(".modal-card")?.classList.add("report-sale-detail-modal");
    this.els.modalEyebrow.textContent = "Todas las ventas";
    this.els.modalTitle.textContent = `Venta ${this.formatReportTicketNumber(venta.Id)}`;
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="report-sale-detail">
        <section class="report-sale-detail-hero">
          <div>
            <span>Comprobante</span>
            <strong>${this.formatReportTicketNumber(venta.Id)}</strong>
            <small>${formatDateTime(venta.Fecha)}</small>
          </div>
          <div>
            <span>Total vendido</span>
            <strong>${formatMoney(venta.Total)}</strong>
            <small>${escapeHtml(medioPagoNombre)}</small>
          </div>
        </section>

        <section class="report-sale-detail-summary">
          <div><span>Cajero</span><strong>${escapeHtml(cajeroNombre)}</strong></div>
          <div><span>Medio de pago</span><strong>${escapeHtml(medioPagoNombre)}</strong></div>
          <div><span>Cliente</span><strong>${escapeHtml(clienteNombre)}</strong></div>
          <div><span>Estado</span><strong>Confirmada</strong></div>
        </section>

        <section class="report-sale-detail-products">
          <div class="report-sale-detail-head">
            <h4>Productos vendidos</h4>
            <span>${formatNumber(detalles.length)} ítems</span>
          </div>
          <div class="report-sale-detail-list">
            ${detalles.length ? detalles.map(detalle => `
              <article>
                <div>
                  <strong>${escapeHtml(detalle.ProductoNombre || "Producto")}</strong>
                  <small>${formatNumber(detalle.Cantidad)} x ${formatMoney(detalle.PrecioUnitario)}</small>
                </div>
                <b>${formatMoney(detalle.Subtotal)}</b>
              </article>
            `).join("") : `
              <div class="empty-state compact">Esta venta no tiene productos cargados.</div>
            `}
          </div>
        </section>

        <section class="report-sale-detail-totals">
          <div><span>Subtotal</span><strong>${formatMoney(venta.Subtotal)}</strong></div>
          <div><span>Descuento</span><strong>${formatNumber(venta.Descuento || 0)}%</strong></div>
          <div><span>Recargo</span><strong>${formatMoney(venta.Recargo || 0)}</strong></div>
          <div class="is-total"><span>Total</span><strong>${formatMoney(venta.Total)}</strong></div>
        </section>
      </div>
      <div class="modal-actions report-sale-detail-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cerrar</button>
        <button class="btn btn-primary" type="button" data-role="reprint-ticket">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>
          Reimprimir ticket
        </button>
      </div>
    `;

    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.querySelector("[data-role='reprint-ticket']").addEventListener("click", () => {
      this.closeModal();
      this.openTicketModal(venta, this.buildTicketItemsFromSale(venta));
    });
    this.els.modalRoot.classList.remove("hidden");
  },

  async reprintReportSaleTicket(saleId, button) {
    if (!Number.isFinite(saleId) || saleId <= 0) {
      this.toast("No se pudo identificar la venta seleccionada.", "error");
      return;
    }

    setButtonLoading(button, true, "Cargando...");
    try {
      await Promise.all([
        this.state.mediosPago?.length ? Promise.resolve() : this.loadMediosPago(),
        this.state.clientes?.length ? Promise.resolve() : this.loadClientes()
      ]);

      const venta = await this.api.request(`${API_ENDPOINTS.ventas}/${saleId}`);
      const ventaReporte = (this.state.reportes.ventas || []).find(item => Number(item.VentaId) === saleId);
      const ventaTicket = {
        ...venta,
        UsuarioNombre: ventaReporte?.UsuarioNombre || venta.UsuarioNombre,
        MedioPagoNombre: ventaReporte?.MedioPagoNombre || venta.MedioPagoNombre,
        ClienteNombre: ventaReporte?.ClienteNombre || venta.ClienteNombre
      };
      const ticketItems = (venta.Detalles || []).map(detalle => ({
        nombre: detalle.ProductoNombre || "Producto",
        cantidad: Number(detalle.Cantidad) || 0,
        precio: Number(detalle.PrecioUnitario) || 0
      }));

      if (!ticketItems.length) {
        this.toast("La venta no tiene detalle de productos para reimprimir.", "error");
        return;
      }

      this.openTicketModal(ventaTicket, ticketItems);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Reimprimir");
    }
  },

  buildTicketItemsFromSale(venta) {
    return (venta.Detalles || []).map(detalle => ({
      nombre: detalle.ProductoNombre || "Producto",
      cantidad: Number(detalle.Cantidad) || 0,
      precio: Number(detalle.PrecioUnitario) || 0
    }));
  },

  bindReportHistoryFilters() {
    document.querySelectorAll("#reportesSalesHistoryView [data-report-filter-trigger]").forEach(trigger => {
      if (trigger.dataset.reportFilterBound === "true") return;
      trigger.addEventListener("click", event => {
        event.preventDefault();
        const dropdown = trigger.closest("[data-report-filter]");
        const menu = dropdown?.querySelector("[data-report-filter-menu]");
        if (!dropdown || !menu) return;
        const wasOpen = !menu.classList.contains("hidden");
        this.closeReportHistoryFilterMenus();
        if (!wasOpen) {
          menu.classList.remove("hidden");
          dropdown.classList.add("is-open");
        }
      });
      trigger.dataset.reportFilterBound = "true";
    });

    if (this.reportHistoryFiltersOutsideBound) return;
    document.addEventListener("click", event => {
      if (!event.target?.closest?.("[data-report-filter]")) {
        this.closeReportHistoryFilterMenus();
      }
      if (
        !event.target?.closest?.("#reportesHistoryMoreFilters") &&
        !event.target?.closest?.("[data-report-action='toggle-history-more-filters']")
      ) {
        this.closeReportHistoryMoreFilters();
      }
    });
    this.reportHistoryFiltersOutsideBound = true;
  },

  closeReportHistoryFilterMenus() {
    document.querySelectorAll("#reportesSalesHistoryView [data-report-filter]").forEach(dropdown => {
      dropdown.classList.remove("is-open");
      dropdown.querySelector("[data-report-filter-menu]")?.classList.add("hidden");
    });
  },

  renderReportHistoryFilterDropdowns() {
    this.renderReportHistoryFilter("usuarioId", this.getReportUsuarioOptions());
    this.renderReportHistoryFilter("medioPagoId", this.getReportMedioPagoOptions());
    this.renderReportHistoryFilter("clienteId", this.getReportClienteOptions());
    this.syncReportHistoryMoreFilters();
  },

  renderReportHistoryFilter(filterName, options) {
    const dropdown = document.querySelector(`#reportesSalesHistoryView [data-report-filter='${filterName}']`);
    const menu = dropdown?.querySelector("[data-report-filter-menu]");
    const label = dropdown?.querySelector("[data-report-filter-label]");
    if (!dropdown || !menu || !label) return;

    const currentValue = String(this.state.reportFilters[filterName] || "");
    const currentOption = options.find(option => String(option.value) === currentValue) || options[0];
    label.textContent = currentOption?.label || "Todos";
    menu.innerHTML = options.map(option => {
      const value = String(option.value);
      const selected = value === currentValue ? "is-selected" : "";
      return `<button class="${selected}" type="button" data-report-filter-value="${escapeHtml(value)}">${escapeHtml(option.label)}</button>`;
    }).join("");

    menu.querySelectorAll("[data-report-filter-value]").forEach(button => {
      button.addEventListener("click", async () => {
        await this.applyReportHistoryFilter(filterName, button.dataset.reportFilterValue || "");
      });
    });
  },

  async applyReportHistoryFilter(filterName, value) {
    this.state.reportFilters[filterName] = value;
    this.state.reportesHistoryPageIndex = 1;
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);
    this.closeReportHistoryFilterMenus();

    try {
      await this.loadReportes();
      this.renderReportesView();
      this.showReportesSalesHistory();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    }
  },

  getReportUsuarioOptions() {
    const usuarios = (this.state.usuarios || [])
      .filter(usuario => usuario?.Id)
      .sort((a, b) => String(a.NombreUsuario || "").localeCompare(String(b.NombreUsuario || ""), "es"))
      .map(usuario => ({ value: usuario.Id, label: usuario.NombreUsuario || `Usuario ${usuario.Id}` }));
    return [{ value: "", label: "Todos" }, ...usuarios];
  },

  getReportMedioPagoOptions() {
    const medios = (this.state.mediosPago || [])
      .filter(medio => medio?.Id)
      .sort((a, b) => String(a.Nombre || "").localeCompare(String(b.Nombre || ""), "es"))
      .map(medio => ({ value: medio.Id, label: medio.Nombre || `Medio ${medio.Id}` }));
    return [{ value: "", label: "Todos" }, ...medios];
  },

  getReportClienteOptions() {
    const clientes = (this.state.clientes || [])
      .filter(cliente => cliente?.Id)
      .sort((a, b) => String(a.Nombre || "").localeCompare(String(b.Nombre || ""), "es"))
      .map(cliente => ({ value: cliente.Id, label: cliente.Nombre || `Cliente ${cliente.Id}` }));
    return [{ value: "", label: "Todos" }, ...clientes];
  },

  toggleReportHistoryMoreFilters() {
    document.getElementById("reportesHistoryMoreFilters")?.classList.toggle("hidden");
    this.syncReportHistoryMoreFilters();
  },

  closeReportHistoryMoreFilters() {
    document.getElementById("reportesHistoryMoreFilters")?.classList.add("hidden");
  },

  syncReportHistoryMoreFilters() {
    const panel = document.getElementById("reportesHistoryMoreFilters");
    if (!panel) return;
    const totalMinimo = panel.querySelector("[name='HistoryTotalMinimo']");
    const totalMaximo = panel.querySelector("[name='HistoryTotalMaximo']");
    if (totalMinimo) totalMinimo.value = this.state.reportFilters.totalMinimo || "";
    if (totalMaximo) totalMaximo.value = this.state.reportFilters.totalMaximo || "";
  },

  async applyReportHistoryMoreFilters(button) {
    const panel = document.getElementById("reportesHistoryMoreFilters");
    if (!panel) return;
    const totalMinimo = panel.querySelector("[name='HistoryTotalMinimo']")?.value?.trim() || "";
    const totalMaximo = panel.querySelector("[name='HistoryTotalMaximo']")?.value?.trim() || "";
    const min = totalMinimo ? Number(totalMinimo) : null;
    const max = totalMaximo ? Number(totalMaximo) : null;

    if ((totalMinimo && (!Number.isFinite(min) || min < 0)) || (totalMaximo && (!Number.isFinite(max) || max < 0))) {
      this.toast("Los importes deben ser números mayores o iguales a cero.", "error");
      return;
    }
    if (min !== null && max !== null && min > max) {
      this.toast("El total mínimo no puede ser mayor que el total máximo.", "error");
      return;
    }

    this.state.reportFilters.totalMinimo = totalMinimo;
    this.state.reportFilters.totalMaximo = totalMaximo;
    this.state.reportesHistoryPageIndex = 1;
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);
    setButtonLoading(button, true, "Aplicando...");
    try {
      await this.loadReportes();
      this.renderReportesView();
      this.renderReportesSalesHistory();
      this.toast("Filtros avanzados aplicados.", "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Aplicar filtros");
    }
  },

  async clearReportHistoryMoreFilters(button) {
    this.state.reportFilters.clienteId = "";
    this.state.reportFilters.totalMinimo = "";
    this.state.reportFilters.totalMaximo = "";
    this.state.reportesHistoryPageIndex = 1;
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);
    setButtonLoading(button, true, "Limpiando...");
    try {
      await this.loadReportes();
      this.renderReportesView();
      this.renderReportesSalesHistory();
      this.toast("Filtros avanzados limpiados.", "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Limpiar");
    }
  },

  bindReportDatePickers() {
    document.querySelectorAll("#reportesView [data-report-date-trigger]").forEach(trigger => {
      if (trigger.dataset.datePickerBound === "true") return;
      trigger.addEventListener("click", event => {
        event.preventDefault();
        this.toggleReportDatePicker(trigger);
      });
      trigger.dataset.datePickerBound = "true";
    });

    if (this.reportDatePickerOutsideBound) return;
    document.addEventListener("click", event => {
      if (!event.target?.closest?.("[data-report-date-picker]")) {
        this.closeReportDatePickers();
      }
    });
    this.reportDatePickerOutsideBound = true;
  },

  toggleReportDatePicker(trigger) {
    const picker = trigger.closest("[data-report-date-picker]");
    const field = trigger.dataset.reportDateField;
    if (!picker || !field) return;
    const isOpen = picker.classList.contains("is-open");
    this.closeReportDatePickers();
    if (isOpen) return;

    const input = picker.querySelector(`input[name='${field}']`);
    const selectedDate = this.parseReportDate(input?.value) || new Date();
    picker.dataset.viewYear = String(selectedDate.getFullYear());
    picker.dataset.viewMonth = String(selectedDate.getMonth());
    picker.classList.add("is-open");
    this.renderReportDatePicker(picker, field);
  },

  closeReportDatePickers() {
    document
      .querySelectorAll("#reportesView [data-report-date-picker].is-open")
      .forEach(picker => picker.classList.remove("is-open"));
  },

  renderReportDatePicker(picker, field) {
    let popover = picker.querySelector(".reportes-calendar");
    if (!popover) {
      popover = document.createElement("div");
      popover.className = "reportes-calendar";
      picker.appendChild(popover);
    }

    const year = Number(picker.dataset.viewYear || new Date().getFullYear());
    const month = Number(picker.dataset.viewMonth || new Date().getMonth());
    const input = picker.querySelector(`input[name='${field}']`);
    const selectedValue = input?.value || "";
    const monthLabel = new Date(year, month, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      cells.push(`<span class="reportes-calendar-empty"></span>`);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const value = this.toDateInputValue(new Date(year, month, day));
      const isFuture = this.isFutureReportDate(value);
      const classes = [
        value === selectedValue ? "is-selected" : "",
        isFuture ? "is-disabled" : ""
      ].filter(Boolean).join(" ");
      cells.push(`<button class="${classes}" type="button" data-report-date-value="${value}" ${isFuture ? "disabled" : ""}>${day}</button>`);
    }

    popover.innerHTML = `
      <div class="reportes-calendar-head">
        <button type="button" data-report-calendar-prev aria-label="Mes anterior">&lt;</button>
        <strong>${escapeHtml(this.capitalizeReportDateLabel(monthLabel))}</strong>
        <button type="button" data-report-calendar-next aria-label="Mes siguiente">&gt;</button>
      </div>
      <div class="reportes-calendar-weekdays">
        <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
      </div>
      <div class="reportes-calendar-grid">${cells.join("")}</div>
    `;

    popover.querySelector("[data-report-calendar-prev]").addEventListener("click", () => {
      const next = new Date(year, month - 1, 1);
      picker.dataset.viewYear = String(next.getFullYear());
      picker.dataset.viewMonth = String(next.getMonth());
      this.renderReportDatePicker(picker, field);
    });
    popover.querySelector("[data-report-calendar-next]").addEventListener("click", () => {
      const next = new Date(year, month + 1, 1);
      picker.dataset.viewYear = String(next.getFullYear());
      picker.dataset.viewMonth = String(next.getMonth());
      this.renderReportDatePicker(picker, field);
    });
    popover.querySelectorAll("[data-report-date-value]").forEach(button => {
      button.addEventListener("click", () => {
        if (input) input.value = button.dataset.reportDateValue || "";
        this.syncReportDateDisplays();
        this.closeReportDatePickers();
      });
    });
  },

  syncReportDateDisplays() {
    document.querySelectorAll("#reportesView [data-report-date-picker]").forEach(picker => {
      const input = picker.querySelector("input[name]");
      const value = picker.querySelector("[data-report-date-value]");
      if (!input || !value) return;
      value.textContent = input.value ? this.formatReportDateLabel(input.value) : "Seleccionar fecha";
      value.classList.toggle("is-placeholder", !input.value);
    });
  },

  toggleReportCustomDates() {
    const panel = this.els.reportesFilterForm.querySelector(".reportes-custom-dates");
    if (!panel) return;
    if (panel.classList.contains("is-open")) {
      this.hideReportCustomDates();
      this.syncReportPeriodTabs();
      return;
    }
    this.showReportCustomDates();
  },

  toggleReportHistoryDates() {
    const panel = document.getElementById("reportesHistoryCustomDates");
    if (!panel) return;
    const isOpen = !panel.classList.contains("hidden");
    if (isOpen) {
      panel.classList.add("hidden");
      this.closeReportDatePickers();
      return;
    }
    this.showReportHistoryDates();
  },

  showReportHistoryDates() {
    const panel = document.getElementById("reportesHistoryCustomDates");
    if (!panel) return;
    const desde = panel.querySelector("[name='HistoryFechaDesde']");
    const hasta = panel.querySelector("[name='HistoryFechaHasta']");
    if (desde) desde.value = this.state.reportFilters.fechaDesde || "";
    if (hasta) hasta.value = this.state.reportFilters.fechaHasta || "";
    panel.classList.remove("hidden");
    this.syncReportDateDisplays();
    panel.querySelector("[data-report-date-trigger]")?.focus();
  },

  async applyReportHistoryDates(button) {
    const panel = document.getElementById("reportesHistoryCustomDates");
    const fechaDesde = panel?.querySelector("[name='HistoryFechaDesde']")?.value || "";
    const fechaHasta = panel?.querySelector("[name='HistoryFechaHasta']")?.value || "";

    if (!fechaDesde || !fechaHasta) {
      this.toast("Seleccioná fecha desde y fecha hasta para aplicar el reporte.", "error");
      return;
    }
    if (this.isFutureReportDate(fechaDesde) || this.isFutureReportDate(fechaHasta)) {
      this.toast("No se pueden consultar fechas futuras.", "error");
      return;
    }
    if (fechaDesde > fechaHasta) {
      this.toast("La fecha desde no puede ser posterior a la fecha hasta.", "error");
      return;
    }

    this.state.reportFilters.fechaDesde = fechaDesde;
    this.state.reportFilters.fechaHasta = fechaHasta;
    saveJson(this.STORAGE_KEYS.reportFilters, this.state.reportFilters);
    this.els.reportesFilterForm.querySelector("[name='FechaDesde']").value = fechaDesde;
    this.els.reportesFilterForm.querySelector("[name='FechaHasta']").value = fechaHasta;
    this.syncReportDateDisplays();
    setButtonLoading(button, true, "Aplicando...");

    try {
      await this.loadReportes();
      this.renderReportesView();
      this.showReportesSalesHistory();
      panel?.classList.add("hidden");
      this.closeReportDatePickers();
      this.toast("Filtros de reportes aplicados.", "info");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Aplicar");
    }
  },

  showReportCustomDates() {
    const panel = this.els.reportesFilterForm.querySelector(".reportes-custom-dates");
    const customButton = this.els.reportesFilterForm.querySelector("[data-report-custom-toggle]");
    if (!panel || !customButton) return;
    panel.classList.add("is-open");
    customButton.classList.add("is-active");
    this.els.reportesFilterForm
      .querySelectorAll("[data-report-preset]")
      .forEach(button => button.classList.remove("is-active"));
    panel.querySelector("[data-report-date-trigger]")?.focus();
  },

  hideReportCustomDates() {
    const panel = this.els.reportesFilterForm.querySelector(".reportes-custom-dates");
    if (!panel) return;
    panel.classList.remove("is-open");
  },

  syncReportPeriodTabs() {
    const tabs = this.els.reportesFilterForm.querySelectorAll("[data-report-preset], [data-report-custom-toggle]");
    const customPanel = this.els.reportesFilterForm.querySelector(".reportes-custom-dates");
    if (customPanel?.classList.contains("is-open")) return;
    const activePreset = this.getActiveReportPreset();
    tabs.forEach(tab => {
      const isActive = tab.dataset.reportPreset
        ? tab.dataset.reportPreset === activePreset
        : activePreset === "custom";
      tab.classList.toggle("is-active", isActive);
    });
  },

  getActiveReportPreset() {
    const today = new Date();
    const fechaHasta = this.state.reportFilters.fechaHasta;
    const fechaDesde = this.state.reportFilters.fechaDesde;
    const todayValue = this.toDateInputValue(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayValue = this.toDateInputValue(yesterday);
    if (fechaDesde === yesterdayValue && fechaHasta === yesterdayValue) return "yesterday";
    if (fechaHasta !== todayValue) return "custom";

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    if (fechaDesde === todayValue) return "today";
    if (fechaDesde === this.toDateInputValue(weekStart)) return "week";
    if (fechaDesde === this.toDateInputValue(monthStart)) return "month";
    return "custom";
  },

  getReportStatIcon(tone) {
    const icons = {
      "is-money": `<svg class="reportes-money-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></svg>`,
      "is-sales": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" /></svg>`,
      "is-products": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 12 4 7.5" /><path d="m12 12 8-4.5" /><path d="M12 12v9" /></svg>`,
      "is-caja": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h12l1 4v7H5v-7l1-4Z" /><path d="M8 4h8l1 5H7l1-5Z" /><path d="M8 13h8" /><path d="M9 17h.01" /><path d="M15 17h.01" /></svg>`
    };
    return icons[tone] || "$";
  },

  getReportHistoryIcon(tone) {
    const icons = {
      "is-money": `<svg class="reportes-money-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></svg>`,
      "is-sales": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" /></svg>`,
      "is-ticket": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-2 8H8L6 3H3" /><path d="M8 14h11" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></svg>`,
      "is-caja": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h12l1 4v7H5v-7l1-4Z" /><path d="M8 4h8l1 5H7l1-5Z" /><path d="M8 13h8" /></svg>`
    };
    return icons[tone] || icons["is-sales"];
  },

  getPaymentIcon(name = "") {
    const normalized = name.toLowerCase();
    if (normalized.includes("efectivo")) {
      return `<svg class="reportes-payment-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2.5" /><circle cx="12" cy="12" r="3" /><path d="M7 10v4" /><path d="M17 10v4" /></svg>`;
    }
    if (normalized.includes("mercado") || normalized.includes("mp") || normalized.includes("transfer")) {
      return `<svg class="reportes-payment-icon reportes-payment-qr" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2h-2z" /><path d="M18 14h2v4h-2z" /><path d="M14 18h2v2h-2z" /><path d="M18 20h2" /></svg>`;
    }
    if (normalized.includes("tarjeta") || normalized.includes("credito") || normalized.includes("crédito") || normalized.includes("debito") || normalized.includes("débito")) {
      return `<svg class="reportes-payment-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /><path d="M7 15h3" /></svg>`;
    }
    return `<svg class="reportes-payment-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>`;
  },

  formatReportTicketNumber(id) {
    return `T-${String(id || 0).padStart(6, "0")}`;
  },

  getReportCsvFileName() {
    const desde = this.state.reportFilters.fechaDesde || "inicio";
    const hasta = this.state.reportFilters.fechaHasta || "hoy";
    return `ventas-${desde}-a-${hasta}.csv`;
  },

  getReportSummaryCsvFileName() {
    const desde = this.state.reportFilters.fechaDesde || "inicio";
    const hasta = this.state.reportFilters.fechaHasta || "hoy";
    return `reporte-${desde}-a-${hasta}.csv`;
  },

  getReportFilterLabel(filterName, options) {
    const currentValue = String(this.state.reportFilters[filterName] || "");
    return options.find(option => String(option.value) === currentValue)?.label || options[0]?.label || "Todos";
  },

  downloadCsv(rows, fileName) {
    const csv = rows
      .map(row => row.map(value => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  },

  getReportProgressWidth(value, maxValue) {
    if (!maxValue) return 0;
    return Math.max(8, Math.round((Number(value || 0) / maxValue) * 100));
  },

  formatReportTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  },

  getPaymentTone(name = "") {
    const normalized = name.toLowerCase();
    if (normalized.includes("efectivo")) return "is-cash";
    if (normalized.includes("tarjeta")) return "is-card";
    if (normalized.includes("transfer")) return "is-transfer";
    return "is-other";
  },

  parseReportDate(value) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  },

  formatReportDateLabel(value) {
    const date = this.parseReportDate(value);
    if (!date) return "Seleccionar fecha";
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  },

  capitalizeReportDateLabel(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  },

  isFutureReportDate(value) {
    if (!value) return false;
    return value > this.toDateInputValue(new Date());
  }
};
