import { formatDateTime, formatMoney, formatMovimientoTipo } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { rowState, setButtonLoading } from "../../utils/ui.js";

export const cajaMethods = {
  getCajaConfig() {
    const config = this.state.configuraciones[0] || {};
    return {
      pedirMotivoCerrarCaja: config.PedirMotivoCerrarCaja !== false,
      imprimirResumenCerrarCaja: config.ImprimirResumenCerrarCaja !== false,
      montoMinimoAperturaCaja: Number(config.MontoMinimoAperturaCaja || 0)
    };
  },

  getCajaDifferenceTone(value) {
    const amount = Number(value || 0);
    if (amount > 0) return "success";
    if (amount < 0) return "danger";
    return "neutral";
  },

  getCajaDifferenceLabel(value) {
    const amount = Number(value || 0);
    if (amount > 0) return "Sobrante";
    if (amount < 0) return "Faltante";
    return "Sin diferencia";
  },

  renderCajaView() {
    const cajaConfig = this.getCajaConfig();
    const motivoInput = this.els.cerrarCajaForm?.MotivoCierre;
    if (this.els.motivoCierreField && motivoInput) {
      this.els.motivoCierreField.classList.toggle("hidden", !cajaConfig.pedirMotivoCerrarCaja);
      motivoInput.required = cajaConfig.pedirMotivoCerrarCaja;
    }
    if (this.els.abrirCajaForm?.MontoInicial) {
      this.els.abrirCajaForm.MontoInicial.min = String(cajaConfig.montoMinimoAperturaCaja);
    }

    this.els.cajaActualCard.innerHTML = this.state.cajaActual
      ? `
        <div class="caja-card">
          <div class="summary-line"><span>Caja</span><strong>#${this.state.cajaActual.Id}</strong></div>
          <div class="summary-line"><span>Estado</span><strong>${this.state.cajaActual.Abierta ? "Abierta" : "Cerrada"}</strong></div>
          <div class="summary-line"><span>Apertura</span><strong>${formatDateTime(this.state.cajaActual.FechaApertura)}</strong></div>
          <div class="summary-line"><span>Monto inicial</span><strong>${formatMoney(this.state.cajaActual.MontoInicial)}</strong></div>
          <div class="summary-line"><span>Saldo esperado</span><strong>${formatMoney(this.state.cajaActual.SaldoSistema ?? this.state.cajaActual.MontoInicial)}</strong></div>
        </div>
      `
      : this.state.lastClosedCaja
        ? `
          <div class="caja-card">
            <div class="summary-line"><span>Ultima caja</span><strong>#${this.state.lastClosedCaja.Id}</strong></div>
            <div class="summary-line"><span>Cierre</span><strong>${formatDateTime(this.state.lastClosedCaja.FechaCierre)}</strong></div>
            <div class="summary-line"><span>Monto final</span><strong>${formatMoney(this.state.lastClosedCaja.MontoFinal)}</strong></div>
            <div class="summary-line"><span>Saldo esperado</span><strong>${formatMoney((this.state.lastClosedCaja.MontoFinal ?? 0) - (this.state.lastClosedCaja.Diferencia ?? 0))}</strong></div>
            ${this.state.lastClosedCaja.MotivoCierre ? `<div class="summary-line"><span>Motivo</span><strong>${escapeHtml(this.state.lastClosedCaja.MotivoCierre)}</strong></div>` : ""}
            <div class="summary-line">
              <span>${this.getCajaDifferenceLabel(this.state.lastClosedCaja.Diferencia)}</span>
              <strong class="difference-${this.getCajaDifferenceTone(this.state.lastClosedCaja.Diferencia)}">
                ${formatMoney(this.state.lastClosedCaja.Diferencia)}
              </strong>
            </div>
          </div>
        `
        : `<div class="empty-state compact">
            <strong>No hay caja abierta</strong>
            <small>Abre una caja con monto inicial para comenzar a registrar ventas y movimientos.</small>
          </div>`;

    this.els.movimientosCajaTableBody.innerHTML = this.state.movimientosCaja.length
      ? this.state.movimientosCaja
          .map(movimiento => `
            <tr>
              <td data-label="Fecha">${formatDateTime(movimiento.Fecha)}</td>
              <td data-label="Tipo">${formatMovimientoTipo(movimiento.Tipo)}</td>
              <td data-label="Concepto">${escapeHtml(movimiento.Concepto)}</td>
              <td data-label="Monto">${formatMoney(movimiento.Monto)}</td>
            </tr>
          `).join("")
      : rowState({
        title: "No hay movimientos registrados",
        description: this.state.cajaActual ? "Los ingresos, egresos y ajustes de caja aparecerán en esta tabla." : "Cuando abras una caja vas a poder registrar movimientos.",
        colspan: 4
      });
    this.renderPagination({
      page: this.state.movimientosCajaPage,
      container: this.els.movimientosCajaPagination,
      label: "movimientos",
      pageSizeFallback: 10,
      onChange: async pageIndex => {
        this.state.movimientosCajaPage.PageIndex = pageIndex;
        await this.loadMovimientosCajaPage();
        this.renderCajaView();
      }
    });

    this.els.historialCajasTableBody.innerHTML = this.state.historialCajas.length
      ? this.state.historialCajas.map(caja => `
        <tr>
          <td data-label="Caja">#${caja.Id}</td>
          <td data-label="Estado">${caja.Abierta ? "Abierta" : "Cerrada"}</td>
          <td data-label="Apertura">${formatDateTime(caja.FechaApertura)}</td>
          <td data-label="Cierre">${formatDateTime(caja.FechaCierre)}</td>
          <td data-label="Monto inicial">${formatMoney(caja.MontoInicial)}</td>
          <td data-label="Monto final">${formatMoney(caja.MontoFinal)}</td>
          <td data-label="Saldo sistema">${formatMoney(caja.SaldoSistema)}</td>
          <td data-label="Diferencia"><span class="difference-${this.getCajaDifferenceTone(caja.Diferencia)}">${formatMoney(caja.Diferencia)}</span></td>
        </tr>
      `).join("")
      : rowState({
        title: "Todavía no hay cierres de caja",
        description: "Cuando cierres una caja, el historial quedará disponible para control y comparación.",
        colspan: 8
      });
    this.renderPagination({
      page: this.state.historialCajasPage,
      container: this.els.historialCajasPagination,
      label: "cajas",
      pageSizeFallback: 10,
      onChange: async pageIndex => {
        this.state.historialCajasPage.PageIndex = pageIndex;
        await this.loadHistorialCajas();
        this.renderCajaView();
      }
    });
  },

  async handleAbrirCaja(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const montoInicial = Number(form.get("MontoInicial"));
    const montoMinimo = this.getCajaConfig().montoMinimoAperturaCaja;
    if (montoInicial < montoMinimo) {
      this.toast(`El monto inicial mínimo es ${formatMoney(montoMinimo)}.`, "error");
      return;
    }

    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Abriendo...");

    try {
      await this.api.request("/api/cajas/abrir", {
        method: "POST",
        body: JSON.stringify({
          MontoInicial: montoInicial
        })
      });

      formElement.reset();
      this.state.lastClosedCaja = null;
      this.state.movimientosCajaPage.PageIndex = 1;
      this.state.historialCajasPage.PageIndex = 1;
      this.toast("Caja abierta correctamente.", "success");
      await Promise.all([this.loadCaja(), this.loadHistorialCajas(), this.loadDashboard()]);
      this.renderCajaView();
      this.renderVentasView();
      this.renderDashboard();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Abrir caja");
    }
  },

  async handleCerrarCaja(event) {
    event.preventDefault();
    if (!this.state.cajaActual?.Id) {
      this.toast("No hay caja abierta para cerrar.", "error");
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const motivoCierre = String(form.get("MotivoCierre") || "").trim();
    if (this.getCajaConfig().pedirMotivoCerrarCaja && !motivoCierre) {
      this.toast("Ingresa el motivo de cierre de caja.", "error");
      return;
    }

    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Cerrando...");

    try {
      const cajaCerrada = await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/cerrar`, {
        method: "POST",
        body: JSON.stringify({
          MontoFinal: Number(form.get("MontoFinal")),
          MotivoCierre: motivoCierre || null
        })
      });

      formElement.reset();
      this.state.lastClosedCaja = cajaCerrada;
      this.state.movimientosCajaPage.PageIndex = 1;
      this.state.historialCajasPage.PageIndex = 1;
      this.toast("Caja cerrada.", "success");
      await Promise.all([this.loadCaja(), this.loadHistorialCajas(), this.loadDashboard()]);
      this.renderCajaView();
      this.renderVentasView();
      this.renderDashboard();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Cerrar caja");
    }
  },

  async handleMovimientoCaja(event) {
    event.preventDefault();
    if (!this.state.cajaActual?.Id) {
      this.toast("Debes abrir caja antes de registrar movimientos.", "error");
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Registrando...");

    try {
      await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/movimientos`, {
        method: "POST",
        body: JSON.stringify({
          Tipo: Number(form.get("Tipo")),
          Concepto: String(form.get("Concepto") || "").trim(),
          Monto: Number(form.get("Monto"))
        })
      });

      formElement.reset();
      this.state.movimientosCajaPage.PageIndex = 1;
      this.state.historialCajasPage.PageIndex = 1;
      this.toast("Movimiento registrado.", "success");
      await Promise.all([this.loadCaja(), this.loadHistorialCajas()]);
      this.renderCajaView();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Registrar");
    }
  }
};
