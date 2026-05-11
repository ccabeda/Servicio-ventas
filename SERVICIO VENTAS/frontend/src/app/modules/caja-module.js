import { formatDateTime, formatMoney, formatMovimientoTipo } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { rowEmpty, setButtonLoading } from "../../utils/ui.js";

export const cajaMethods = {
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
            <div class="summary-line">
              <span>${this.getCajaDifferenceLabel(this.state.lastClosedCaja.Diferencia)}</span>
              <strong class="difference-${this.getCajaDifferenceTone(this.state.lastClosedCaja.Diferencia)}">
                ${formatMoney(this.state.lastClosedCaja.Diferencia)}
              </strong>
            </div>
          </div>
        `
        : `<div class="empty-state compact">No hay caja abierta. Puedes abrir una nueva con monto inicial.</div>`;

    this.els.movimientosCajaTableBody.innerHTML = this.state.movimientosCaja.length
      ? this.state.movimientosCaja
          .slice()
          .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha))
          .map(movimiento => `
            <tr>
              <td>${formatDateTime(movimiento.Fecha)}</td>
              <td>${formatMovimientoTipo(movimiento.Tipo)}</td>
              <td>${escapeHtml(movimiento.Concepto)}</td>
              <td>${formatMoney(movimiento.Monto)}</td>
            </tr>
          `).join("")
      : rowEmpty("No hay movimientos registrados.", 4);

    this.els.historialCajasTableBody.innerHTML = this.state.historialCajas.length
      ? this.state.historialCajas.map(caja => `
        <tr>
          <td>#${caja.Id}</td>
          <td>${caja.Abierta ? "Abierta" : "Cerrada"}</td>
          <td>${formatDateTime(caja.FechaApertura)}</td>
          <td>${formatDateTime(caja.FechaCierre)}</td>
          <td>${formatMoney(caja.MontoInicial)}</td>
          <td>${formatMoney(caja.MontoFinal)}</td>
          <td>${formatMoney(caja.SaldoSistema)}</td>
          <td><span class="difference-${this.getCajaDifferenceTone(caja.Diferencia)}">${formatMoney(caja.Diferencia)}</span></td>
        </tr>
      `).join("")
      : rowEmpty("No hay cajas registradas.", 8);
  },

  async handleAbrirCaja(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Abriendo...");

    try {
      await this.api.request("/api/cajas/abrir", {
        method: "POST",
        body: JSON.stringify({
          MontoInicial: Number(form.get("MontoInicial"))
        })
      });

      formElement.reset();
      this.state.lastClosedCaja = null;
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
    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Cerrando...");

    try {
      const cajaCerrada = await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/cerrar`, {
        method: "POST",
        body: JSON.stringify({
          MontoFinal: Number(form.get("MontoFinal"))
        })
      });

      formElement.reset();
      this.state.lastClosedCaja = cajaCerrada;
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
