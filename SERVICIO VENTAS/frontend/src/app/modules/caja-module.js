import { formatDateTime, formatMoney, formatMovimientoTipo } from "../../utils/formatters.js";
import { API_ENDPOINTS, MOVIMIENTO_TIPOS } from "../../config.js";
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

  getCajaResumenValores({ caja = this.state.cajaActual, movimientos = null, montoContado = null, observacion = null, backendResumen = this.state.cajaResumen } = {}) {
    const resumenCaja = backendResumen?.Caja?.Id === caja?.Id || backendResumen?.Caja?.Id === caja?.Id
      ? backendResumen
      : null;
    const resolvedMovimientos = movimientos ?? resumenCaja?.Movimientos ?? this.state.movimientosCaja ?? [];
    const tipoMovimiento = label => MOVIMIENTO_TIPOS.find(item => item.label === label)?.value;
    const sumaPorTipo = tipo => resolvedMovimientos
      .filter(movimiento => Number(movimiento.Tipo) === tipo)
      .reduce((total, movimiento) => total + Number(movimiento.Monto || 0), 0);
    const ventasPorMedioPago = resumenCaja?.VentasPorMedioPago ?? [];
    const ventasEfectivo = Number(resumenCaja?.VentasEfectivo ?? sumaPorTipo(tipoMovimiento("Venta")));
    const ingresosManuales = sumaPorTipo(tipoMovimiento("Ingreso"));
    const egresos = sumaPorTipo(tipoMovimiento("Egreso"));
    const montoInicial = Number(resumenCaja?.MontoInicial ?? caja?.MontoInicial ?? 0);
    const saldoEsperado = Number(resumenCaja?.TotalEsperado ?? caja?.SaldoSistema ?? (montoInicial + ventasEfectivo + ingresosManuales - egresos));
    const montoContadoRaw = String(this.els.cerrarCajaForm?.MontoFinal?.value || "").trim();
    const resolvedMontoContado = montoContado ?? resumenCaja?.MontoContado ?? (montoContadoRaw ? Number(montoContadoRaw) : 0);
    const diferencia = resumenCaja?.Diferencia ?? (resolvedMontoContado - saldoEsperado);

    return {
      movimientos: resolvedMovimientos,
      ventasPorMedioPago,
      ventasEfectivo,
      totalVentas: Number(resumenCaja?.TotalVentas ?? ventasPorMedioPago.reduce((total, medio) => total + Number(medio.Total || 0), 0)),
      ingresosManuales,
      egresos,
      montoInicial,
      saldoEsperado,
      montoContado: resolvedMontoContado,
      diferencia,
      observacion: observacion ?? String(this.els.cerrarCajaForm?.MotivoCierre?.value || resumenCaja?.Observacion || caja?.MotivoCierre || "").trim()
    };
  },

  renderCajaView() {
    const cajaConfig = this.getCajaConfig();
    const cajaOpenCard = document.getElementById("cajaOpenCard");
    const cajaCloseWorkspace = document.getElementById("cajaCloseWorkspace");
    const cajaResumenCard = document.getElementById("cajaResumenCard");
    const cajaMediosPagoCard = document.getElementById("cajaMediosPagoCard");
    const diferenciaPreview = document.getElementById("cajaDiferenciaPreview");
    const cajaMovimientosCard = document.getElementById("cajaMovimientosCard");
    const cajaHistorialCard = document.getElementById("cajaHistorialCard");
    const motivoInput = this.els.cerrarCajaForm?.MotivoCierre;
    if (this.els.motivoCierreField && motivoInput) {
      this.els.motivoCierreField.classList.toggle("hidden", !cajaConfig.pedirMotivoCerrarCaja);
      motivoInput.required = cajaConfig.pedirMotivoCerrarCaja;
    }
    if (this.els.abrirCajaForm?.MontoInicial) {
      this.els.abrirCajaForm.MontoInicial.min = String(cajaConfig.montoMinimoAperturaCaja);
    }

    const cajaAbierta = this.state.cajaActual;
    const {
      ventasEfectivo,
      ventasPorMedioPago,
      totalVentas,
      ingresosManuales,
      egresos,
      montoInicial,
      saldoEsperado
    } = this.getCajaResumenValores();

    cajaOpenCard?.classList.toggle("hidden", Boolean(cajaAbierta));
    cajaCloseWorkspace?.classList.toggle("hidden", !cajaAbierta);
    cajaMovimientosCard?.classList.toggle("hidden", !cajaAbierta);
    cajaHistorialCard?.classList.toggle("hidden", Boolean(cajaAbierta));

    this.els.cajaActualCard.innerHTML = this.state.cajaActual
      ? `
        <div class="caja-session-item">
          <span>Caja</span>
          <strong>Caja #${this.state.cajaActual.Id}</strong>
        </div>
        <div class="caja-session-item">
          <span>Usuario</span>
          <strong>${escapeHtml(this.state.session?.NombreUsuario || "Admin")}</strong>
        </div>
        <div class="caja-session-item">
          <span>Apertura</span>
          <strong>${formatDateTime(this.state.cajaActual.FechaApertura)}</strong>
        </div>
        <div class="caja-session-warning">
          <strong>Una vez cerrada,</strong>
          <span>no se puede modificar.</span>
        </div>
      `
      : this.state.lastClosedCaja
        ? `
          <div class="caja-session-item">
            <span>Última caja</span>
            <strong>Caja #${this.state.lastClosedCaja.Id}</strong>
          </div>
          <div class="caja-session-item">
            <span>Estado</span>
            <strong>Cerrada</strong>
          </div>
          <div class="caja-session-item">
            <span>Cierre</span>
            <strong>${formatDateTime(this.state.lastClosedCaja.FechaCierre)}</strong>
          </div>
          <div class="caja-session-warning is-neutral">
            <strong>${this.getCajaDifferenceLabel(this.state.lastClosedCaja.Diferencia)}</strong>
            <span>${formatMoney(this.state.lastClosedCaja.Diferencia)}</span>
          </div>
        `
        : `<div class="caja-session-empty">
            <strong>No hay caja abierta</strong>
            <span>Abrí una caja con monto inicial para comenzar.</span>
          </div>`;

    if (cajaResumenCard) {
      cajaResumenCard.innerHTML = `
        <div class="caja-card-head">
          <h4>Resumen de la caja</h4>
        </div>
        <div class="caja-summary-list">
          <div><span>Monto inicial</span><strong>${formatMoney(montoInicial)}</strong></div>
          <div><span>Ventas en efectivo</span><strong>${formatMoney(ventasEfectivo)}</strong></div>
          <div><span>Ingresos manuales</span><strong class="difference-success">${formatMoney(ingresosManuales)}</strong></div>
          <div><span>Egresos</span><strong class="difference-danger">${formatMoney(egresos)}</strong></div>
        </div>
        <div class="caja-summary-total">
          <span>Total esperado en caja</span>
          <strong>${formatMoney(saldoEsperado)}</strong>
        </div>
        <div class="caja-info-note">Este total incluye únicamente dinero en efectivo y movimientos manuales.</div>
      `;
    }

    if (cajaMediosPagoCard) {
      const mediosRows = ventasPorMedioPago.length
        ? ventasPorMedioPago.map(medio => `
          <div>
            <span>${escapeHtml(medio.MedioPagoNombre || "Sin medio")}</span>
            <strong>${formatMoney(medio.Total)}</strong>
          </div>
        `).join("")
        : `<div><span>Sin ventas registradas</span><strong>${formatMoney(0)}</strong></div>`;
      cajaMediosPagoCard.innerHTML = `
        <div class="caja-card-head">
          <h4>Ventas por medio de pago</h4>
        </div>
        <div class="caja-summary-list">
          ${mediosRows}
        </div>
        <div class="caja-summary-total compact">
          <span>Total ventas del día</span>
          <strong>${formatMoney(totalVentas)}</strong>
        </div>
        <div class="caja-info-note">Solo los medios marcados como efectivo impactan en el dinero físico esperado.</div>
      `;
    }

    const updateDifferencePreview = () => {
      if (!diferenciaPreview) return;
      const montoContado = Number(this.els.cerrarCajaForm?.MontoFinal?.value || 0);
      const diferencia = montoContado - saldoEsperado;
      const tone = saldoEsperado < 0 ? "warning" : this.getCajaDifferenceTone(diferencia);
      const differenceTitle = saldoEsperado < 0 ? "Desvío de caja" : "Diferencia";
      const differenceMessage = saldoEsperado < 0
        ? `El sistema esperaba ${formatMoney(saldoEsperado)}. Revisá los egresos antes de cerrar.`
        : diferencia < 0
          ? "Faltante de caja respecto del total esperado."
          : diferencia > 0
            ? "Sobrante de caja respecto del total esperado."
            : "El monto contado coincide con el esperado.";
      diferenciaPreview.className = `caja-difference-preview is-${tone}`;
      diferenciaPreview.innerHTML = `
        <div>
          <strong>${differenceTitle}</strong>
          <small>${differenceMessage}</small>
        </div>
        <b>${formatMoney(diferencia)}</b>
      `;
    };
    if (this.els.cerrarCajaForm?.MontoFinal) {
      this.els.cerrarCajaForm.MontoFinal.oninput = updateDifferencePreview;
      updateDifferencePreview();
    }

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
          <td data-label="Acciones">
            <button class="btn btn-secondary caja-history-action" type="button" data-caja-print-summary="${caja.Id}">Resumen</button>
          </td>
        </tr>
      `).join("")
      : rowState({
        title: "Todavía no hay cierres de caja",
        description: "Cuando cierres una caja, el historial quedará disponible para control y comparación.",
        colspan: 9
      });
    this.els.historialCajasTableBody
      .querySelectorAll("[data-caja-print-summary]")
      .forEach(button => {
        button.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          this.printCajaResumenHistorial(Number(button.dataset.cajaPrintSummary), button);
        });
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

  openCajaResumenPrintWindow({ caja, resumen, estado }) {
    try {
      if (!caja?.Id) {
        this.toast("No se encontró la caja para imprimir.", "error");
        return false;
      }

      const diferenciaTone = this.getCajaDifferenceTone(resumen.diferencia);
      const movimientos = Array.isArray(resumen.movimientos) ? resumen.movimientos : [];
      const medios = Array.isArray(resumen.ventasPorMedioPago) ? resumen.ventasPorMedioPago : [];
      const movimientosRows = movimientos.length
        ? movimientos.map(movimiento => `
            <tr>
              <td>${escapeHtml(formatDateTime(movimiento.Fecha))}</td>
              <td>${escapeHtml(formatMovimientoTipo(movimiento.Tipo))}</td>
              <td>${escapeHtml(movimiento.Concepto || "-")}</td>
              <td class="amount">${escapeHtml(formatMoney(movimiento.Monto))}</td>
            </tr>
          `).join("")
        : `<tr><td colspan="4" class="empty">No hay movimientos registrados.</td></tr>`;
      const mediosRows = medios.length
        ? medios.map(medio => `
            <div class="row">
              <span>${escapeHtml(medio.MedioPagoNombre || "Sin medio")}</span>
              <strong>${escapeHtml(formatMoney(medio.Total))}</strong>
            </div>
          `).join("")
        : `<div class="row"><span>Sin ventas registradas</span><strong>${escapeHtml(formatMoney(0))}</strong></div>`;
      const printWindow = window.open("", "_blank", "width=900,height=720");
      if (!printWindow) {
        this.toast("No se pudo abrir la vista de impresión. Revisá el bloqueo de ventanas emergentes.", "error");
        return false;
      }

      const html = `
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Resumen de caja #${escapeHtml(caja.Id)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 28px;
            background: #f4f6f8;
            color: #101828;
            font-family: Inter, Arial, sans-serif;
          }
          .sheet {
            max-width: 820px;
            margin: 0 auto;
            padding: 28px;
            border: 1px solid #e3e8f2;
            border-radius: 8px;
            background: #ffffff;
          }
          header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding-bottom: 18px;
            border-bottom: 2px solid #101828;
          }
          h1 { margin: 0; font-size: 24px; }
          .print-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            max-width: 820px;
            margin: 0 auto 14px;
          }
          .print-actions button {
            min-height: 38px;
            padding: 0 16px;
            border: 1px solid #d0d5dd;
            border-radius: 8px;
            background: #ffffff;
            color: #101828;
            font: 700 13px Inter, Arial, sans-serif;
            cursor: pointer;
          }
          .print-actions button.primary {
            border-color: #e30613;
            background: #e30613;
            color: #ffffff;
          }
          .muted { color: #667085; font-size: 13px; }
          .meta {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 18px 0;
          }
          .box {
            padding: 12px;
            border: 1px solid #e3e8f2;
            border-radius: 8px;
            background: #f8fafc;
          }
          .box span, .row span { display: block; color: #667085; font-size: 12px; font-weight: 700; }
          .box strong { display: block; margin-top: 5px; font-size: 14px; }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .card {
            padding: 16px;
            border: 1px solid #e3e8f2;
            border-radius: 8px;
          }
          h2 { margin: 0 0 14px; font-size: 17px; }
          .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 9px 0;
            border-bottom: 1px solid #eef2f7;
          }
          .row:last-child { border-bottom: 0; }
          .row strong { font-size: 14px; }
          .total {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 2px solid #101828;
          }
          .total strong { font-size: 20px; }
          .difference {
            border-color: ${diferenciaTone === "danger" ? "#fecaca" : diferenciaTone === "success" ? "#bbf7d0" : "#cfe0ff"};
            background: ${diferenciaTone === "danger" ? "#fff1f2" : diferenciaTone === "success" ? "#f0fdf4" : "#eef5ff"};
          }
          .difference strong { font-size: 22px; }
          .danger { color: #b42318; }
          .success { color: #067647; }
          table {
            width: 100%;
            margin-top: 18px;
            border-collapse: collapse;
            overflow: hidden;
            border: 1px solid #e3e8f2;
            border-radius: 8px;
          }
          th, td {
            padding: 10px 12px;
            border-bottom: 1px solid #e3e8f2;
            font-size: 12px;
            text-align: left;
          }
          th { background: #f8fafc; color: #344054; font-weight: 800; }
          .amount { text-align: right; font-weight: 800; }
          .empty { text-align: center; color: #667085; }
          .note {
            min-height: 72px;
            margin-top: 14px;
            padding: 12px;
            border: 1px solid #e3e8f2;
            border-radius: 8px;
            color: #344054;
            font-size: 13px;
          }
          footer {
            margin-top: 18px;
            color: #667085;
            font-size: 11px;
            text-align: center;
          }
          @media print {
            body { padding: 0; background: #ffffff; }
            .print-actions { display: none; }
            .sheet { max-width: none; border: 0; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-actions">
          <button type="button" onclick="window.close()">Cerrar</button>
          <button class="primary" type="button" onclick="window.print()">Imprimir</button>
        </div>
        <main class="sheet">
          <header>
            <div>
              <h1>Resumen de cierre de caja</h1>
              <p class="muted">Caja #${escapeHtml(caja.Id)} · ${escapeHtml(formatDateTime(new Date()))}</p>
            </div>
            <div>
              <strong>Cajago POS</strong>
              <p class="muted">Control de tesorería</p>
            </div>
          </header>

          <section class="meta">
            <div class="box"><span>Usuario</span><strong>${escapeHtml(this.state.session?.NombreUsuario || "Usuario")}</strong></div>
            <div class="box"><span>Apertura</span><strong>${escapeHtml(formatDateTime(caja.FechaApertura))}</strong></div>
            <div class="box"><span>Estado</span><strong>${escapeHtml(estado)}</strong></div>
          </section>

          <section class="grid">
            <article class="card">
              <h2>Resumen</h2>
              <div class="row"><span>Monto inicial</span><strong>${escapeHtml(formatMoney(resumen.montoInicial))}</strong></div>
              <div class="row"><span>Ventas en efectivo</span><strong>${escapeHtml(formatMoney(resumen.ventasEfectivo))}</strong></div>
              <div class="row"><span>Ingresos manuales</span><strong class="success">${escapeHtml(formatMoney(resumen.ingresosManuales))}</strong></div>
              <div class="row"><span>Egresos</span><strong class="danger">${escapeHtml(formatMoney(resumen.egresos))}</strong></div>
              <div class="row total"><span>Total esperado</span><strong>${escapeHtml(formatMoney(resumen.saldoEsperado))}</strong></div>
            </article>

            <article class="card difference">
              <h2>Conteo</h2>
              <div class="row"><span>Monto contado</span><strong>${escapeHtml(formatMoney(resumen.montoContado))}</strong></div>
              <div class="row total"><span>${escapeHtml(this.getCajaDifferenceLabel(resumen.diferencia))}</span><strong>${escapeHtml(formatMoney(resumen.diferencia))}</strong></div>
            </article>
          </section>

          <section>
            <h2 style="margin-top: 20px;">Ventas por medio de pago</h2>
            <article class="card">
              ${mediosRows}
              <div class="row total"><span>Total ventas</span><strong>${escapeHtml(formatMoney(resumen.totalVentas))}</strong></div>
            </article>
          </section>

          <section>
            <h2 style="margin-top: 20px;">Movimientos</h2>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Concepto</th>
                  <th class="amount">Monto</th>
                </tr>
              </thead>
              <tbody>${movimientosRows}</tbody>
            </table>
          </section>

          <section>
            <h2 style="margin-top: 20px;">Observación</h2>
            <div class="note">${resumen.observacion ? escapeHtml(resumen.observacion) : "Sin observaciones."}</div>
          </section>

          <footer>Documento generado desde Cajago POS.</footer>
        </main>
      </body>
      </html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      return true;
    } catch {
      this.toast("No se pudo generar el resumen de caja.", "error");
      return false;
    }
  },

  async printCajaResumen() {
    if (!this.state.cajaActual?.Id) {
      this.toast("No hay caja abierta para imprimir.", "error");
      return;
    }

    const button = this.els.printCajaResumenButton;
    setButtonLoading(button, true, "Abriendo...");
    try {
      const backendResumen = await this.api.request(API_ENDPOINTS.cajaResumen(this.state.cajaActual.Id));
      this.openCajaResumenPrintWindow({
        caja: this.state.cajaActual,
        resumen: this.getCajaResumenValores({ backendResumen }),
        estado: "Pre-cierre"
      });
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Imprimir resumen");
    }
  },

  async printCajaResumenHistorial(cajaId, button) {
    const caja = this.state.historialCajas.find(item => Number(item.Id) === Number(cajaId));
    if (!caja) {
      this.toast("No se encontró la caja seleccionada.", "error");
      return;
    }

    setButtonLoading(button, true, "Abriendo...");
    try {
      const backendResumen = await this.api.request(API_ENDPOINTS.cajaResumen(caja.Id));
      const resumen = this.getCajaResumenValores({
        caja,
        backendResumen,
        montoContado: Number(caja.MontoFinal || 0),
        observacion: caja.MotivoCierre || ""
      });
      this.openCajaResumenPrintWindow({
        caja,
        resumen,
        estado: caja.Abierta ? "Abierta" : "Cerrada"
      });
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Resumen");
    }
  },

  async handleAbrirCaja(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const montoInicialRaw = String(form.get("MontoInicial") || "").trim();
    const montoInicial = Number(montoInicialRaw);
    if (!montoInicialRaw) {
      this.toast("Ingresá el monto inicial de la caja.", "error");
      return;
    }

    if (!Number.isFinite(montoInicial) || montoInicial < 0 || !Number.isInteger(montoInicial)) {
      this.toast("El monto inicial debe ser un número entero igual o mayor a 0.", "error");
      return;
    }

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
    const montoFinalRaw = String(form.get("MontoFinal") || "").trim();
    const montoFinal = Number(montoFinalRaw);
    if (!montoFinalRaw) {
      this.toast("Ingresá el monto contado en efectivo.", "error");
      return;
    }

    if (!Number.isFinite(montoFinal) || montoFinal < 0 || !Number.isInteger(montoFinal)) {
      this.toast("El monto contado debe ser un número entero igual o mayor a 0.", "error");
      return;
    }

    const motivoCierre = String(form.get("MotivoCierre") || "").trim();
    if (this.getCajaConfig().pedirMotivoCerrarCaja && !motivoCierre) {
      this.toast("Ingresá una observación para cerrar la caja.", "error");
      return;
    }

    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Cerrando...");

    try {
      const cajaCerrada = await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/cerrar`, {
        method: "POST",
        body: JSON.stringify({
          MontoFinal: montoFinal,
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
    const tipo = Number(form.get("Tipo"));
    const concepto = String(form.get("Concepto") || "").trim();
    const montoRaw = String(form.get("Monto") || "").trim();
    const monto = Number(montoRaw);
    if (!Number.isFinite(tipo)) {
      this.toast("Seleccioná el tipo de movimiento.", "error");
      return;
    }

    if (!concepto) {
      this.toast("Ingresá el concepto del movimiento.", "error");
      return;
    }

    if (!montoRaw) {
      this.toast("Ingresá el monto del movimiento.", "error");
      return;
    }

    if (!Number.isFinite(monto) || monto < 1 || !Number.isInteger(monto)) {
      this.toast("El monto del movimiento debe ser un número entero igual o mayor a 1.", "error");
      return;
    }

    const submitButton = formElement.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Registrando...");

    try {
      await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/movimientos`, {
        method: "POST",
        body: JSON.stringify({
          Tipo: tipo,
          Concepto: concepto,
          Monto: monto
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
