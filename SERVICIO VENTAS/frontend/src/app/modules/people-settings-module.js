import { API_ENDPOINTS } from "../../config.js";
import { formatDateTime, formatMoney, formatRol } from "../../utils/formatters.js";
import { escapeHtml, normalizeOptional } from "../../utils/html.js";
import { rowSkeleton, rowState, setButtonLoading } from "../../utils/ui.js";

export const peopleSettingsMethods = {
  getFormCheckboxControl(form, field) {
    if (!form) return null;

    const byName = form[field];
    if (byName) {
      return byName instanceof RadioNodeList ? byName[0] : byName;
    }

    return form.querySelector?.(`[name="${field}"]`) || null;
  },

  getFormCheckboxValue(form, field) {
    return Boolean(this.getFormCheckboxControl(form, field)?.checked);
  },

  syncFormCheckboxControl(form, field, value) {
    const control = this.getFormCheckboxControl(form, field);
    if (control?.type === "checkbox") {
      control.checked = Boolean(value);
    }

    document.querySelectorAll(`[data-ticket-field="${field}"]`).forEach(linkedControl => {
      if (linkedControl?.type === "checkbox") {
        linkedControl.checked = Boolean(value);
      }
    });
  },

  syncTicketCheckboxFromForm(form, field) {
    const control = this.getFormCheckboxControl(form, field);
    let value = control?.type === "checkbox" ? control.checked : undefined;

    if (typeof value !== "boolean") {
      const visibleSource = document.querySelector(`[data-ticket-field="${field}"]`);
      value = visibleSource?.type === "checkbox" ? visibleSource.checked : false;
    }

    document.querySelectorAll(`[data-ticket-field="${field}"]`).forEach(control => {
      if (control && control.type === "checkbox") {
        control.checked = value;
      }
    });

    return value;
  },

  async renderClientesTable() {
    if (!this.els.clientesTableBody) return;
    const canManageClientes = this.canManageEntity("cliente");

    if (!this.els.clientesTableBody.children.length) {
      this.els.clientesTableBody.innerHTML = rowSkeleton(5, 4);
    }

    try {
      await this.loadClientesPage();
    } catch (error) {
      this.state.clientesPage = this.createEmptyPage(20);
      this.els.clientesTableBody.innerHTML = rowState({
        title: "No pudimos cargar los clientes",
        description: this.getErrorMessage(error),
        type: "error",
        colspan: 5
      });
      this.renderPagination({
        page: this.state.clientesPage,
        container: this.els.clientesPagination,
        label: "clientes",
        onChange: async pageIndex => {
          this.state.clientesPage.PageIndex = pageIndex;
          await this.renderClientesTable();
        }
      });
      return;
    }

    const clientes = this.state.clientesPage.Items || [];
    this.els.clientesTableBody.innerHTML = clientes.length
      ? clientes.map(cliente => `
        <tr>
          <td data-label="Cliente">${escapeHtml(cliente.Nombre)}</td>
          <td data-label="Teléfono">${escapeHtml(cliente.Telefono || "-")}</td>
          <td data-label="Deuda">${formatMoney(cliente.Deuda)}</td>
          <td data-label="Estado">${cliente.Activo ? "Activo" : "Inactivo"}</td>
          <td data-label="Acciones" class="actions-cell">${canManageClientes
            ? `
              <button class="btn btn-secondary" type="button" data-action="edit-cliente" data-id="${cliente.Id}">Editar</button>
              <button class="btn btn-danger" type="button" data-action="delete-cliente" data-id="${cliente.Id}">Eliminar</button>
            `
            : `<span class="muted">Solo lectura</span>`}
          </td>
        </tr>
      `).join("")
      : rowState({
        title: "Todavía no hay clientes cargados",
        description: "Cuando registres clientes van a aparecer acá con su estado y deuda.",
        colspan: 5
      });

    this.els.newClienteButton.classList.toggle("hidden", !canManageClientes);
    this.renderPagination({
      page: this.state.clientesPage,
      container: this.els.clientesPagination,
      label: "clientes",
      onChange: async pageIndex => {
        this.state.clientesPage.PageIndex = pageIndex;
        await this.renderClientesTable();
      }
    });

    if (canManageClientes) {
      this.bindCrudTableActions("cliente");
    }
  },

  async renderUsuariosTable() {
    if (!this.canManageEntity("usuario")) {
      this.els.newUsuarioButton.classList.add("hidden");
      this.els.usuariosTableBody.innerHTML = rowState({
        title: "No tienes permisos para gestionar usuarios",
        description: "Un administrador puede habilitarte el acceso a esta sección.",
        type: "error",
        colspan: 6
      });
      return;
    }

    this.renderUsuariosSummary();

    if (!this.els.usuariosTableBody.children.length) {
      this.els.usuariosTableBody.innerHTML = rowSkeleton(6, 4);
    }

    try {
      await this.loadUsuariosPage();
    } catch (error) {
      this.state.usuariosPage = this.createEmptyPage(20);
      this.els.usuariosTableBody.innerHTML = rowState({
        title: "No pudimos cargar los usuarios",
        description: this.getErrorMessage(error),
        type: "error",
        colspan: 6
      });
      this.renderPagination({
        page: this.state.usuariosPage,
        container: this.els.usuariosPagination,
        label: "usuarios",
        onChange: async pageIndex => {
          this.state.usuariosPage.PageIndex = pageIndex;
          await this.renderUsuariosTable();
        }
      });
      return;
    }

    const usuarios = this.state.usuariosPage.Items || [];
    this.renderUsuariosSummary();
    this.els.newUsuarioButton.classList.remove("hidden");
    this.els.usuariosTableBody.innerHTML = usuarios.length
      ? usuarios.map(usuario => `
        <tr>
          <td data-label="Usuario">
            <div class="user-name-cell">
              <span class="user-avatar">${escapeHtml(String(usuario.NombreUsuario || "?").slice(0, 1).toUpperCase())}</span>
              <div>
                <strong>${escapeHtml(usuario.NombreUsuario)}</strong>
              </div>
            </div>
          </td>
          <td data-label="Rol"><span class="user-role-badge">${formatRol(usuario.Rol)}</span></td>
          <td data-label="Estado"><span class="user-status-badge ${usuario.Activo ? "is-active" : "is-inactive"}">${usuario.Activo ? "Activo" : "Inactivo"}</span></td>
          <td data-label="Contraseña">${usuario.DebeCambiarPassword ? "Cambio requerido" : "Sin cambio pendiente"}</td>
          <td data-label="Creación" class="user-created-cell">${formatDateTime(usuario.FechaCreacion)}</td>
          <td data-label="Acciones" class="actions-cell users-actions-cell">
            <button class="user-action-btn" type="button" data-action="edit-usuario" data-id="${usuario.Id}" aria-label="Editar usuario" title="Editar usuario">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
            </button>
            <button class="user-action-btn is-danger" type="button" data-action="delete-usuario" data-id="${usuario.Id}" aria-label="Eliminar usuario" title="Eliminar usuario">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
            </button>
          </td>
        </tr>
      `).join("")
      : rowState({
        title: "Todavía no hay usuarios cargados",
        description: "Agregá usuarios para definir quién puede operar el sistema.",
        colspan: 6
      });

    this.renderPagination({
      page: this.state.usuariosPage,
      container: this.els.usuariosPagination,
      label: "usuarios",
      onChange: async pageIndex => {
        this.state.usuariosPage.PageIndex = pageIndex;
        await this.renderUsuariosTable();
      }
    });
    this.bindCrudTableActions("usuario");
  },

  renderUsuariosSummary() {
    const usuarios = Array.isArray(this.state.usuarios) ? this.state.usuarios : [];
    const total = this.state.usuariosPage?.TotalItems || usuarios.length || 0;
    const active = usuarios.filter(usuario => usuario.Activo !== false).length;
    const admins = usuarios.filter(usuario => formatRol(usuario.Rol) === "Admin").length;

    const totalEl = document.getElementById("usuariosSummaryTotal");
    const activeEl = document.getElementById("usuariosSummaryActive");
    const adminsEl = document.getElementById("usuariosSummaryAdmins");

    if (totalEl) totalEl.textContent = String(total);
    if (activeEl) activeEl.textContent = String(active);
    if (adminsEl) adminsEl.textContent = String(admins);
  },

  async renderMediosPagoTable() {
    if (!this.els.mediosPagoTableBody) return;
    const canManageMediosPago = this.canManageEntity("medioPago");

    if (!this.els.mediosPagoTableBody.children.length) {
      this.els.mediosPagoTableBody.innerHTML = rowSkeleton(3, 4);
    }

    try {
      await this.loadMediosPagoPage();
    } catch (error) {
      this.state.mediosPagoPage = this.createEmptyPage(20);
      this.els.mediosPagoTableBody.innerHTML = rowState({
        title: "No pudimos cargar los medios de pago",
        description: this.getErrorMessage(error),
        type: "error",
        colspan: 3
      });
      this.renderPagination({
        page: this.state.mediosPagoPage,
        container: this.els.mediosPagoPagination,
        label: "medios",
        onChange: async pageIndex => {
          this.state.mediosPagoPage.PageIndex = pageIndex;
          await this.renderMediosPagoTable();
        }
      });
      return;
    }

    const mediosPago = this.state.mediosPagoPage.Items || [];
    this.els.mediosPagoTableBody.innerHTML = mediosPago.length
      ? mediosPago.map(medio => `
        <tr>
          <td data-label="Medio de pago">${escapeHtml(medio.Nombre)}</td>
          <td data-label="Estado">${medio.Activo ? "Activo" : "Inactivo"}</td>
          <td data-label="Acciones" class="actions-cell">${canManageMediosPago
            ? `
              <button class="btn btn-secondary" type="button" data-action="edit-medioPago" data-id="${medio.Id}">Editar</button>
              <button class="btn btn-danger" type="button" data-action="delete-medioPago" data-id="${medio.Id}">Eliminar</button>
            `
            : `<span class="muted">Solo lectura</span>`}
          </td>
        </tr>
      `).join("")
      : rowState({
        title: "Todavía no hay medios de pago cargados",
        description: "Agregá efectivo, transferencia, tarjetas u otros medios para registrar ventas.",
        colspan: 3
      });

    this.els.newMedioPagoButton.classList.toggle("hidden", !canManageMediosPago);
    this.renderPagination({
      page: this.state.mediosPagoPage,
      container: this.els.mediosPagoPagination,
      label: "medios",
      onChange: async pageIndex => {
        this.state.mediosPagoPage.PageIndex = pageIndex;
        await this.renderMediosPagoTable();
      }
    });

    if (canManageMediosPago) {
      this.bindCrudTableActions("medioPago");
    }
  },

  resetClientesPageAndRender() {
    this.state.clientesPage.PageIndex = 1;
    this.renderClientesTable();
  },

  resetUsuariosPageAndRender() {
    this.state.usuariosPage.PageIndex = 1;
    this.renderUsuariosTable();
  },

  resetMediosPagoPageAndRender() {
    this.state.mediosPagoPage.PageIndex = 1;
    this.renderMediosPagoTable();
  },

  renderConfiguracionView() {
    const configuracion = this.state.configuraciones[0];
    const ticketConfig = this.getTicketConfig();
    const form = this.els.configuracionForm;
    this.bindConfiguracionTabs(form);
    this.bindColorSwatches(form);
    this.bindConfiguracionFieldLimits(form);

    if (!configuracion) {
      form.reset();
      form.dataset.id = "";
    this.syncColorSwatches(form, "#ef0000");
    this.businessHours = this.getBusinessWeekTemplate();
    this.renderBusinessHoursEditor(form, { DiasAtencion: "" });
    this.bindBusinessSummary(form);
    this.bindTicketSettings(form);
    this.applyTicketConfigToForm(form, ticketConfig);
    this.updateBusinessSummary(form);
    this.syncTicketSettings(form);
    this.renderImpresorasSettingsPanel();
    this.syncFormCheckboxControl(form, "AplicarImpuestosEnVentas", true);
    return;
    }

    const colorPrincipal = this.normalizeBrandColor(configuracion.ColorPrincipal);
    form.dataset.id = configuracion.Id;
    form.NombreNegocio.value = configuracion.NombreNegocio || "";
    form.Telefono.value = configuracion.Telefono || "";
    form.Email.value = configuracion.Email || "";
    form.Direccion.value = configuracion.Direccion || "";
    form.DiasAtencion.value = configuracion.DiasAtencion || "";
    form.HorarioApertura.value = configuracion.HorarioApertura || "";
    form.HorarioCierre.value = configuracion.HorarioCierre || "";
    this.renderBusinessHoursEditor(form, configuracion);
    form.LogoUrl.value = configuracion.LogoUrl || "";
    this.applyTicketConfigToForm(form, ticketConfig);
    this.syncFormCheckboxControl(form, "ConfirmarEliminarItemCarrito", configuracion.ConfirmarEliminarItemCarrito !== false);
    this.syncFormCheckboxControl(form, "MantenerClienteAlFinalizarVenta", configuracion.MantenerClienteAlFinalizarVenta !== false);
    this.syncFormCheckboxControl(form, "MostrarStockEnBusquedaProductos", configuracion.MostrarStockEnBusquedaProductos !== false);
    this.syncFormCheckboxControl(form, "PedirCantidadAlAgregarProducto", Boolean(configuracion.PedirCantidadAlAgregarProducto));
    this.syncFormCheckboxControl(form, "AplicarImpuestosEnVentas", configuracion.AplicarImpuestosEnVentas !== false);
    form.DescuentoMaximoPermitido.value = configuracion.DescuentoMaximoPermitido ?? 20;
    form.RedondeoTotal.value = configuracion.RedondeoTotal || "0.05";
    this.syncFormCheckboxControl(form, "PedirMotivoCerrarCaja", configuracion.PedirMotivoCerrarCaja !== false);
    this.syncFormCheckboxControl(form, "ImprimirResumenCerrarCaja", configuracion.ImprimirResumenCerrarCaja !== false);
    form.MontoMinimoAperturaCaja.value = configuracion.MontoMinimoAperturaCaja ?? 0;
    form.FormatoFecha.value = configuracion.FormatoFecha || "dd/MM/yyyy";
    form.FormatoHora.value = configuracion.FormatoHora || "24";
    this.syncFormCheckboxControl(form, "MostrarMensajesAyuda", configuracion.MostrarMensajesAyuda !== false);
    this.syncFormCheckboxControl(form, "EnviarEstadisticasAnonimas", Boolean(configuracion.EnviarEstadisticasAnonimas));
    this.syncColorSwatches(form, colorPrincipal);
    this.bindBusinessSummary(form);
    this.bindTicketSettings(form);
    this.updateBusinessSummary(form);
    this.syncTicketSettings(form);
    this.renderImpresorasSettingsPanel();
  },

  applyTicketConfigToForm(form, ticketConfig = {}) {
    const getTicketFlag = (field, fallback = false) => {
      if (Object.prototype.hasOwnProperty.call(ticketConfig, field)) {
        return Boolean(ticketConfig[field]);
      }

      return this.getFormCheckboxValue(form, field) ?? fallback;
    };

    form.ImpresoraTicket.value = ticketConfig.ImpresoraNombreSistema || ticketConfig.ImpresoraTicket || "";
    form.MensajeTicket.value = ticketConfig.MensajeTicket || "";
    this.syncFormCheckboxControl(form, "ImprimirDatosNegocioTicket", getTicketFlag("ImprimirDatosNegocioTicket", true));
    this.syncFormCheckboxControl(form, "UsaTicketTermico", Object.prototype.hasOwnProperty.call(ticketConfig, "CorteAutomatico") || Object.prototype.hasOwnProperty.call(ticketConfig, "UsaTicketTermico")
      ? (ticketConfig.CorteAutomatico ?? ticketConfig.UsaTicketTermico ?? false)
      : getTicketFlag("UsaTicketTermico", true));
    this.syncFormCheckboxControl(form, "ImprimirFechaHoraTicket", getTicketFlag("ImprimirFechaHoraTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirCajeroTicket", getTicketFlag("ImprimirCajeroTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirNumeroTicket", getTicketFlag("ImprimirNumeroTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirMedioPagoTicket", getTicketFlag("ImprimirMedioPagoTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirDesgloseImpuestosTicket", getTicketFlag("ImprimirDesgloseImpuestosTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirSubtotalTotalTicket", getTicketFlag("ImprimirSubtotalTotalTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirDescuentoRecargoTicket", getTicketFlag("ImprimirDescuentoRecargoTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirClienteTicket", getTicketFlag("ImprimirClienteTicket", true));
    this.syncFormCheckboxControl(form, "ImprimirMensajeCierreTicket", getTicketFlag("ImprimirMensajeCierreTicket", true));
    this.syncFormCheckboxControl(form, "VistaPreviaAntesImprimir", getTicketFlag("VistaPreviaAntesImprimir", true));
    this.syncFormCheckboxControl(form, "ImprimirCopiaTicket", getTicketFlag("ImprimirCopiaTicket"));
    this.syncFormCheckboxControl(form, "LetraGrandePantallaTactil", getTicketFlag("LetraGrandePantallaTactil"));

    const widthControl = document.querySelector('[data-ticket-field="TicketWidth"]');
    const customWidthControl = document.querySelector('[data-ticket-field="TicketCustomWidth"]');
    const width = Number(ticketConfig.AnchoPapelMm || 80);
    const useCustomWidth = Boolean(ticketConfig.UsaAnchoPersonalizado) || ![58, 80].includes(width);

    if (widthControl) {
      widthControl.value = useCustomWidth ? "custom" : String(width);
    }

    if (customWidthControl) {
      customWidthControl.value = String(width);
    }
  },

  bindConfiguracionTabs(form) {
    if (form.dataset.settingsTabsBound === "true") {
      this.setConfiguracionSection(this.currentSettingsSection || "negocio");
      return;
    }

    document.querySelectorAll("[data-settings-tab]").forEach(button => {
      button.addEventListener("click", () => this.setConfiguracionSection(button.dataset.settingsTab));
    });

    form.dataset.settingsTabsBound = "true";
    this.setConfiguracionSection(this.currentSettingsSection || "negocio");
  },

  setConfiguracionSection(section) {
    const meta = {
      negocio: {
        title: "Datos del negocio",
        description: "Administra la información principal que identifica a tu comercio dentro del sistema."
      },
      ticket: {
        title: "Ticket",
        description: "Personaliza el comprobante que se entrega al finalizar cada venta."
      },
      impresoras: {
        title: "Configuración de impresoras",
        description: "Administra y configura las impresoras de tickets y documentos."
      },
      impuestos: {
        title: "Impuestos",
        description: "Configura tasas, criterios de cálculo y visualización fiscal para ventas y tickets."
      },
      usuarios: {
        title: "Usuarios",
        description: "Gestiona accesos, roles y usuarios autorizados del punto de venta."
      },
      preferencias: {
        title: "Preferencias",
        description: "Personaliza el comportamiento general del sistema segun las necesidades de tu negocio."
      },
      respaldo: {
        title: "Respaldo",
        description: "Administra copias de seguridad y restauración de datos del sistema."
      }
    };
    const selected = meta[section] ? section : "negocio";
    this.currentSettingsSection = selected;
    this.els.appShell?.classList.remove("settings-negocio", "settings-ticket", "settings-impresoras", "settings-impuestos", "settings-usuarios", "settings-preferencias", "settings-respaldo");
    this.els.appShell?.classList.add(`settings-${selected}`);

    document.querySelectorAll("[data-settings-tab]").forEach(button => {
      button.classList.toggle("active", button.dataset.settingsTab === selected);
    });

    document.querySelectorAll("[data-settings-panel]").forEach(panel => {
      panel.classList.toggle("hidden", panel.dataset.settingsPanel !== selected);
    });

    const title = document.getElementById("settingsSectionTitle");
    const description = document.getElementById("settingsSectionDescription");
    if (title) title.textContent = meta[selected].title;
    if (description) description.textContent = meta[selected].description;

    if (selected === "impresoras") {
      this.renderImpresorasSettingsPanel();
    }

    if (selected === "impuestos") {
      this.renderImpuestosSettingsPanel();
    }

    if (selected === "usuarios") {
      this.renderUsuariosTable();
    }

    if (selected === "respaldo") {
      this.bindBackupSettingsActions();
      this.loadBackupConfiguration();
      this.loadBackupHistory();
    }
  },

  async renderImpuestosSettingsPanel() {
    const panel = document.querySelector('[data-settings-panel="impuestos"]');
    if (!panel) return;

    const ratesList = document.getElementById("taxRatesList");
    if (ratesList && !ratesList.children.length) {
      ratesList.innerHTML = `
        <article class="tax-rate-row tax-rate-row-loading">
          <div><strong>Cargando tasas...</strong><span>Consultando configuración fiscal.</span></div>
          <b>-</b>
          <em>...</em>
          <span></span>
        </article>
      `;
    }

    if (!Array.isArray(this.state.impuestos) || !this.state.impuestos.length) {
      await this.loadImpuestos();
    } else {
      await this.loadImpuestosListPage();
    }

    this.renderTaxSummary();
    this.renderTaxDefaultSelect();
    this.renderTaxRatesList();
    this.renderTaxCategoryPreview();
    this.bindTaxSettingsActions();
    this.bindTaxCategoryActions();
    this.enhanceCustomSelects?.(panel);
  },

  renderTaxSummary() {
    const resumen = this.state.impuestosResumen;
    const defaultTax = resumen?.Predeterminado || this.state.impuestos.find(impuesto => impuesto.EsPredeterminado);

    const defaultEl = document.getElementById("taxDefaultSummary");
    const activeEl = document.getElementById("taxActiveSummary");
    const withoutRateEl = document.getElementById("taxProductsWithoutRateSummary");

    if (this.state.impuestosError) {
      if (defaultEl) defaultEl.textContent = "Error";
      if (activeEl) activeEl.textContent = "-";
      if (withoutRateEl) withoutRateEl.textContent = "-";
      return;
    }

    if (defaultEl) defaultEl.textContent = defaultTax ? this.formatTaxLabel(defaultTax) : "Sin definir";
    if (activeEl) activeEl.textContent = String(resumen?.TasasActivas ?? this.state.impuestos.filter(impuesto => impuesto.Activo !== false).length);
    if (withoutRateEl) withoutRateEl.textContent = String(resumen?.ProductosSinTasa ?? 0);
  },

  renderTaxDefaultSelect() {
    const select = document.getElementById("taxDefaultSelect");
    if (!select) return;

    if (this.state.impuestosError) {
      select.innerHTML = `<option value="">No se pudieron cargar las tasas</option>`;
      this.renderTaxSimulation(null);
      return;
    }

    const impuestos = this.state.impuestos.filter(impuesto => impuesto.Activo !== false);
    if (!impuestos.length) {
      select.innerHTML = `<option value="">Sin tasas configuradas</option>`;
      this.renderTaxSimulation(null);
      return;
    }

    select.innerHTML = impuestos.map(impuesto => `
      <option value="${impuesto.Id}" ${impuesto.EsPredeterminado ? "selected" : ""}>${escapeHtml(this.formatTaxLabel(impuesto))}</option>
    `).join("");

    const selectedTax = impuestos.find(impuesto => String(impuesto.Id) === select.value) || impuestos[0];
    this.renderTaxSimulation(selectedTax);
  },

  renderTaxRatesList() {
    const list = document.getElementById("taxRatesList");
    const count = document.getElementById("taxRatesCount");
    if (!list) return;

    const activeRates = this.state.impuestos.filter(impuesto => impuesto.Activo !== false);
    if (count) count.textContent = `${activeRates.length} ${activeRates.length === 1 ? "activa" : "activas"}`;
    this.syncTaxRatesStatusFilter();

    if (this.state.impuestosError) {
      list.innerHTML = `
        <article class="tax-rate-row tax-rate-row-empty">
          <div>
            <strong>No pudimos cargar las tasas</strong>
            <span>${escapeHtml(this.state.impuestosError)}</span>
          </div>
          <b>-</b>
          <em>Error</em>
          <span></span>
        </article>
      `;
      return;
    }

    const pageItems = this.state.impuestosListPage?.Items || [];
    if (!pageItems.length) {
      list.innerHTML = `
        <article class="tax-rate-row tax-rate-row-empty">
          <div>
            <strong>No hay tasas para este filtro</strong>
            <span>Cambiá el estado del filtro o creá una nueva tasa.</span>
          </div>
          <b>-</b>
          <em>Vacío</em>
          <span></span>
        </article>
      `;
      return;
    }

    list.innerHTML = pageItems.map(impuesto => `
      <article class="tax-rate-row ${impuesto.EsPredeterminado ? "is-default" : ""}">
        <div>
          <strong>${escapeHtml(impuesto.Nombre)}</strong>
          <span>${impuesto.EsPredeterminado ? "Predeterminado" : "Disponible para asignar"} · ${impuesto.Porcentaje === 0 ? "sin impuesto" : "precio final incluido"}</span>
        </div>
        <b>${this.formatTaxPercent(impuesto.Porcentaje)}</b>
        <em class="${impuesto.Activo ? "is-active" : "is-inactive"}">${impuesto.Activo ? "Activo" : "Inactivo"}</em>
        <button class="tax-rate-action" type="button" data-tax-action="edit" data-id="${impuesto.Id}" aria-label="Editar ${escapeHtml(impuesto.Nombre)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></button>
      </article>
    `).join("");

    this.renderTaxRatesPagination();
  },

  renderTaxRatesPagination() {
    const pagination = document.getElementById("taxRatesPagination");
    if (!pagination) return;

    const page = this.state.impuestosListPage || this.createEmptyPage(5);
    const pageIndex = page.PageIndex || 1;
    const totalPages = page.TotalPages || 0;
    pagination.innerHTML = totalPages > 1
      ? `
        <button class="btn btn-secondary" type="button" data-tax-page="prev" ${pageIndex <= 1 ? "disabled" : ""}>Anterior</button>
        <span>Página ${pageIndex} de ${totalPages}</span>
        <button class="btn btn-secondary" type="button" data-tax-page="next" ${pageIndex >= totalPages ? "disabled" : ""}>Siguiente</button>
      `
      : "";

    pagination.querySelectorAll("[data-tax-page]").forEach(button => {
      button.addEventListener("click", async () => {
        this.state.impuestosListPage.PageIndex += button.dataset.taxPage === "next" ? 1 : -1;
        await this.loadImpuestosListPage();
        this.renderTaxRatesList();
        this.bindTaxSettingsActions();
      });
    });
  },

  syncTaxRatesStatusFilter() {
    const filter = document.getElementById("taxRatesStatusFilter");
    if (!filter) return;

    filter.value = this.state.impuestosEstado || "activos";
    this.enhanceCustomSelects?.(filter.parentElement || document);
  },

  renderTaxSimulation(impuesto) {
    const preview = document.getElementById("taxSimulationPreview");
    if (!preview) return;

    const total = 1000;
    const percent = Number(impuesto?.Porcentaje || 0);
    const net = percent > 0 ? total / (1 + percent / 100) : total;
    const taxAmount = total - net;
    const taxName = impuesto?.Nombre || "Impuesto";

    preview.innerHTML = `
      <div><span>Precio final</span><strong>${formatMoney(total)}</strong></div>
      <div><span>Neto gravado</span><strong>${formatMoney(net)}</strong></div>
      <div><span>${escapeHtml(taxName)} ${this.formatTaxPercent(percent)}</span><strong>${formatMoney(taxAmount)}</strong></div>
      <hr>
      <div class="tax-ticket-total"><span>Total</span><strong>${formatMoney(total)}</strong></div>
      <small>El total no cambia porque el impuesto está incluido.</small>
    `;
  },

  renderTaxCategoryPreview() {
    const list = document.getElementById("taxCategoryList");
    const moreText = document.getElementById("taxCategoryMoreText");
    if (!list) return;

    const defaultTax = this.state.impuestosResumen?.Predeterminado || this.state.impuestos.find(impuesto => impuesto.EsPredeterminado);
    const categorias = (this.state.categoriasProducto || []).slice(0, 4);
    const remaining = Math.max(0, (this.state.categoriasProducto || []).length - categorias.length);

    if (!categorias.length) {
      list.innerHTML = `<div><span>Categorías</span><strong>${defaultTax ? this.formatTaxLabel(defaultTax) : "Sin tasa"}</strong></div>`;
      if (moreText) moreText.textContent = "";
      return;
    }

    list.innerHTML = categorias.map(categoria => `
      <div>
        <span>${escapeHtml(categoria.Nombre)}</span>
        <strong>${escapeHtml(this.getCategoryTaxLabel(categoria, defaultTax))}</strong>
      </div>
    `).join("");
    if (moreText) {
      moreText.textContent = remaining ? `+ ${remaining} categoría${remaining === 1 ? "" : "s"} más` : "";
    }
  },

  getCategoryTaxLabel(categoria, defaultTax = null) {
    const impuesto = this.state.impuestos.find(item => item.Id === categoria.ImpuestoId);
    if (impuesto) {
      return this.formatTaxLabel(impuesto);
    }

    return "Predeterminada";
  },

  bindTaxCategoryActions() {
    const button = document.getElementById("taxCategoryManageButton");
    if (!button || button.dataset.taxCategoryBound === "true") return;

    button.addEventListener("click", () => this.openTaxCategoryAssignmentsModal());
    button.dataset.taxCategoryBound = "true";
  },

  openTaxCategoryAssignmentsModal() {
    const defaultTax = this.state.impuestosResumen?.Predeterminado || this.state.impuestos.find(impuesto => impuesto.EsPredeterminado);
    const taxOptions = [
      `<option value="">Predeterminada${defaultTax ? ` (${escapeHtml(this.formatTaxLabel(defaultTax))})` : ""}</option>`,
      ...this.state.impuestos
        .filter(impuesto => impuesto.Activo !== false)
        .map(impuesto => `<option value="${impuesto.Id}">${escapeHtml(this.formatTaxLabel(impuesto))}</option>`)
    ].join("");

    this.els.modalEyebrow.textContent = "Impuestos";
    this.els.modalTitle.textContent = "Asignación por categoría";
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="tax-category-modal-intro">
        <p>Definí qué tasa usa cada categoría. Los productos sin tasa propia tomarán esta configuración.</p>
      </div>
      <div class="tax-category-assignment-list">
        ${(this.state.categoriasProducto || []).map(categoria => `
          <label class="tax-category-assignment-row">
            <span>${escapeHtml(categoria.Nombre)}</span>
            <select name="categoria-${categoria.Id}" data-category-tax-select data-category-id="${categoria.Id}" data-original-value="${categoria.ImpuestoId ?? ""}">
              ${taxOptions}
            </select>
          </label>
        `).join("") || `<div class="tax-category-empty">No hay categorías cargadas.</div>`}
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" type="submit">Guardar asignaciones</button>
      </div>
    `;

    this.els.modalForm.querySelectorAll("[data-category-tax-select]").forEach(select => {
      const categoria = this.state.categoriasProducto.find(item => String(item.Id) === select.dataset.categoryId);
      select.value = categoria?.ImpuestoId ?? "";
    });
    this.els.modalRoot.querySelector(".modal-card")?.classList.add("tax-category-modal");
    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      await this.submitTaxCategoryAssignments();
    };
    this.els.modalRoot.classList.remove("hidden");
    this.enhanceCustomSelects?.(this.els.modalForm);
  },

  async submitTaxCategoryAssignments() {
    const submitButton = this.els.modalForm.querySelector("button[type='submit']");
    const changes = Array.from(this.els.modalForm.querySelectorAll("[data-category-tax-select]"))
      .map(select => {
        const categoria = this.state.categoriasProducto.find(item => String(item.Id) === select.dataset.categoryId);
        const nextValue = select.value ? Number(select.value) : null;
        const currentValue = categoria?.ImpuestoId ?? null;
        return { categoria, nextValue, currentValue };
      })
      .filter(item => item.categoria && item.nextValue !== item.currentValue);

    if (!changes.length) {
      this.toast("No hay cambios para guardar.", "info");
      this.closeModal();
      return;
    }

    setButtonLoading(submitButton, true, "Guardando...");

    try {
      await Promise.all(changes.map(({ categoria, nextValue }) => this.api.request(`${API_ENDPOINTS.categoriasProducto}/${categoria.Id}`, {
        method: "PUT",
        body: JSON.stringify({
          Nombre: categoria.Nombre,
          Icono: categoria.Icono,
          Color: categoria.Color,
          ImpuestoId: nextValue
        })
      })));

      this.toast("Asignaciones guardadas.", "success");
      this.closeModal();
      await Promise.all([this.loadCategoriasProducto(), this.loadProductos(), this.loadImpuestos()]);
      this.renderTaxSummary();
      this.renderTaxCategoryPreview();
      this.renderProductosTable();
      this.renderProductosVenta();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Guardar asignaciones");
    }
  },

  bindTaxSettingsActions() {
    const select = document.getElementById("taxDefaultSelect");
    if (select && select.dataset.taxBound !== "true") {
      select.addEventListener("change", () => {
        const selectedTax = this.state.impuestos.find(impuesto => String(impuesto.Id) === select.value);
        this.renderTaxSimulation(selectedTax);
        this.updateTicketTaxPreviewRows();
      });
      select.dataset.taxBound = "true";
    }

    const newRateButton = document.querySelector(".taxes-new-rate-btn");
    if (newRateButton && newRateButton.dataset.taxBound !== "true") {
      newRateButton.addEventListener("click", () => this.openTaxRateModal());
      newRateButton.dataset.taxBound = "true";
    }

    const statusFilter = document.getElementById("taxRatesStatusFilter");
    if (statusFilter && statusFilter.dataset.taxBound !== "true") {
      statusFilter.addEventListener("change", async () => {
        this.state.impuestosEstado = statusFilter.value || "activos";
        this.state.impuestosListPage.PageIndex = 1;
        await this.loadImpuestosListPage();
        this.renderTaxRatesList();
        this.bindTaxSettingsActions();
      });
      statusFilter.dataset.taxBound = "true";
    }

    document.querySelectorAll("[data-tax-action='edit']").forEach(button => {
      if (button.dataset.taxBound === "true") return;

      button.addEventListener("click", () => this.openTaxRateModal(Number(button.dataset.id)));
      button.dataset.taxBound = "true";
    });
  },

  openTaxRateModal(id = null) {
    const impuesto = id ? this.state.impuestos.find(item => item.Id === id) : null;
    const isEdit = Boolean(impuesto);

    this.els.modalEyebrow.textContent = "Impuestos";
    this.els.modalTitle.textContent = isEdit ? "Editar tasa" : "Nueva tasa";
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="modal-grid-2 tax-rate-modal-grid">
        <label class="field field-full">
          <span>Nombre</span>
          <input name="Nombre" type="text" maxlength="80" required placeholder="Ej: IVA General" value="${escapeHtml(impuesto?.Nombre || "")}">
        </label>
        <label class="field">
          <span>Porcentaje</span>
          <input name="Porcentaje" type="number" min="0" max="100" step="0.01" required placeholder="21" value="${impuesto?.Porcentaje ?? ""}">
        </label>
        <label class="settings-check tax-rate-modal-check">
          <input name="Activo" type="checkbox" ${impuesto?.Activo === false ? "" : "checked"}>
          <span>Tasa activa</span>
        </label>
        <label class="settings-check tax-rate-modal-check">
          <input name="EsPredeterminado" type="checkbox" ${impuesto?.EsPredeterminado ? "checked" : ""}>
          <span>Usar como predeterminada</span>
        </label>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" type="submit">${isEdit ? "Guardar tasa" : "Crear tasa"}</button>
      </div>
    `;

    this.els.modalRoot.querySelector(".modal-card")?.classList.add("tax-rate-modal");
    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      await this.submitTaxRateModal(id);
    };
    this.els.modalRoot.classList.remove("hidden");
    this.els.modalForm.querySelector("[name='Nombre']")?.focus();
  },

  async submitTaxRateModal(id = null) {
    const submitButton = this.els.modalForm.querySelector("button[type='submit']");
    const formData = new FormData(this.els.modalForm);
    const nombre = String(formData.get("Nombre") || "").trim();
    const porcentaje = Number(formData.get("Porcentaje"));
    const activo = formData.get("Activo") === "on";
    const esPredeterminado = formData.get("EsPredeterminado") === "on";

    if (!nombre) {
      this.toast("Ingresá el nombre de la tasa.", "error");
      this.els.modalForm.querySelector("[name='Nombre']")?.focus();
      return;
    }

    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      this.toast("El porcentaje debe estar entre 0 y 100.", "error");
      this.els.modalForm.querySelector("[name='Porcentaje']")?.focus();
      return;
    }

    if (!activo && esPredeterminado) {
      this.toast("La tasa predeterminada debe estar activa.", "error");
      return;
    }

    const payload = {
      Nombre: nombre,
      Porcentaje: porcentaje,
      Activo: activo,
      EsPredeterminado: esPredeterminado
    };

    setButtonLoading(submitButton, true, "Guardando...");

    try {
      await this.api.request(id ? `${API_ENDPOINTS.impuestos}/${id}` : API_ENDPOINTS.impuestos, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });

      this.toast("Tasa guardada correctamente.", "success");
      this.closeModal();
      await this.loadImpuestos();
      this.state.impuestosListPage.PageIndex = 1;
      await this.loadImpuestosListPage();
      this.renderTaxSummary();
      this.renderTaxDefaultSelect();
      this.renderTaxRatesList();
      this.renderTaxCategoryPreview();
      this.bindTaxSettingsActions();
      this.updateTicketTaxPreviewRows();
      this.enhanceCustomSelects?.(document.querySelector('[data-settings-panel="impuestos"]') || document);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, id ? "Guardar tasa" : "Crear tasa");
    }
  },

  updateSelectedDefaultTaxRequest() {
    const select = document.getElementById("taxDefaultSelect");
    const selectedTax = this.state.impuestos.find(impuesto => String(impuesto.Id) === select?.value);

    if (!selectedTax || selectedTax.EsPredeterminado) {
      return null;
    }

    return this.api.request(`${API_ENDPOINTS.impuestos}/${selectedTax.Id}`, {
      method: "PUT",
      body: JSON.stringify({
        Nombre: selectedTax.Nombre,
        Porcentaje: selectedTax.Porcentaje,
        Activo: selectedTax.Activo !== false,
        EsPredeterminado: true
      })
    });
  },

  formatTaxPercent(value) {
    const number = Number(value || 0);
    return `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(number)}%`;
  },

  formatTaxLabel(impuesto) {
    return `${impuesto.Nombre} ${this.formatTaxPercent(impuesto.Porcentaje)}`;
  },

  bindBackupSettingsActions() {
    document.querySelectorAll("[data-backup-action]").forEach(button => {
      if (button.dataset.backupBound === "true") return;

      button.addEventListener("click", async () => {
        const action = button.dataset.backupAction;
        if (action === "create") {
          this.openCreateBackupModal(button);
          return;
        }

        if (action === "restore") {
          document.getElementById("backupRestoreInput")?.click();
          return;
        }

        if (action === "folder") {
          this.openBackupLocationModal();
          return;
        }

        this.toast("Esta opción de respaldo queda preparada para la próxima etapa.", "info");
      });
      button.dataset.backupBound = "true";
    });

    const restoreInput = document.getElementById("backupRestoreInput");
    if (restoreInput && restoreInput.dataset.backupRestoreBound !== "true") {
      restoreInput.addEventListener("change", event => this.handleRestoreBackupFile(event));
      restoreInput.dataset.backupRestoreBound = "true";
    }

    this.renderBackupTimeOptions();
    this.enhanceCustomSelects?.(document.querySelector('[data-settings-panel="respaldo"]') || document);

    const savePlanButton = document.getElementById("backupSavePlanButton");
    if (savePlanButton && savePlanButton.dataset.backupPlanBound !== "true") {
      savePlanButton.addEventListener("click", async () => {
        await this.saveBackupPlan(savePlanButton);
      });
      savePlanButton.dataset.backupPlanBound = "true";
    }

    document.querySelectorAll(".backup-frequency-option input").forEach(input => {
      if (input.dataset.backupFrequencyBound === "true") return;

      input.addEventListener("change", () => {
        this.syncBackupPlanControls();
      });
      input.dataset.backupFrequencyBound = "true";
    });

    ["backupPlanTime", "backupPlanWeekday", "backupPlanMonthday"].forEach(id => {
      const input = document.getElementById(id);
      if (!input || input.dataset.backupPlanFieldBound === "true") return;
      input.addEventListener("change", () => this.syncBackupPlanControls());
      input.dataset.backupPlanFieldBound = "true";
    });
  },

  renderBackupTimeOptions() {
    const select = document.getElementById("backupPlanTime");
    if (!select || select.dataset.backupTimeOptionsReady === "true") return;

    const options = [];
    for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
      const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
      const mins = String(minutes % 60).padStart(2, "0");
      const value = `${hours}:${mins}`;
      options.push(`<option value="${value}" ${value === "03:00" ? "selected" : ""}>${value}</option>`);
    }

    select.innerHTML = options.join("");
    select.dataset.backupTimeOptionsReady = "true";
  },

  openCreateBackupModal(triggerButton) {
    this.els.modalEyebrow.textContent = "Respaldo";
    this.els.modalTitle.textContent = "Crear respaldo";
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="backup-create-modal">
        <label class="field">
          <span>Nombre del respaldo</span>
          <input id="backupCustomNameInput" name="Nombre" type="text" maxlength="60" placeholder="Ej: cierre de caja, antes de actualizar...">
        </label>
        <div class="password-required-panel">
          <strong>Nombre opcional</strong>
          <p>Si lo dejás vacío, se usará el nombre predeterminado del sistema. La fecha y hora se agregan siempre para identificar cada copia.</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
        <button class="btn btn-secondary" type="button" data-backup-default-name>Usar predeterminado</button>
        <button class="btn btn-primary" type="submit">Crear respaldo</button>
      </div>
    `;

    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.querySelector("[data-backup-default-name]").addEventListener("click", async event => {
      await this.handleCreateBackup(triggerButton, "", event.currentTarget);
    });
    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      const name = this.els.modalForm.Nombre?.value?.trim() || "";
      await this.handleCreateBackup(triggerButton, name, this.els.modalForm.querySelector("button[type='submit']"));
    };

    this.els.modalRoot.classList.remove("hidden");
    this.els.modalForm.Nombre?.focus();
  },

  async handleCreateBackup(button, nombre = "", feedbackButton = button) {
    button.disabled = true;
    button.classList.add("is-loading");
    button.setAttribute("aria-busy", "true");
    setButtonLoading(feedbackButton, true, "Creando...");

    try {
      const backup = await this.api.request(API_ENDPOINTS.respaldosCrear, {
        method: "POST",
        body: JSON.stringify({ Nombre: nombre || null })
      });
      this.state.lastBackup = backup;
      this.updateSidebarBackupCard?.();
      this.state.backupsPage = {
        Items: [backup],
        PageIndex: 1,
        PageSize: 4,
        TotalItems: 1,
        TotalPages: 1
      };
      this.renderBackupHistory(this.state.backupsPage);
      await this.loadBackupHistory(1);
      this.toast("Respaldo creado correctamente.", "success");
      this.closeModal();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      button.disabled = false;
      button.classList.remove("is-loading");
      button.setAttribute("aria-busy", "false");
      setButtonLoading(feedbackButton, false, feedbackButton?.dataset.backupDefaultName !== undefined ? "Usar predeterminado" : "Crear respaldo");
    }
  },

  async loadBackupHistory(pageIndex = this.state.backupsPage?.PageIndex || 1) {
    const requestId = (this.backupHistoryRequestId || 0) + 1;
    this.backupHistoryRequestId = requestId;

    try {
      const params = new URLSearchParams({
        pageIndex: String(pageIndex),
        pageSize: "4"
      });
      const page = await this.api.request(`${API_ENDPOINTS.respaldosPaginado}?${params.toString()}`);
      if (requestId !== this.backupHistoryRequestId) return;

      this.state.backupsPage = page;
      this.renderBackupHistory(this.state.backupsPage);
    } catch (error) {
      if (requestId !== this.backupHistoryRequestId) return;
      this.toast(this.getErrorMessage(error), "error");
    }
  },

  async loadBackupConfiguration(options = {}) {
    const { silent = false } = options;
    try {
      const config = await this.api.request(API_ENDPOINTS.respaldosConfiguracion);
      this.state.backupConfiguration = config;
      this.renderBackupConfiguration(config);
    } catch (error) {
      this.updateSidebarBackupCard?.();
      if (!silent) this.toast(this.getErrorMessage(error), "error");
    }
  },

  renderBackupConfiguration(config = {}) {
    const pathElement = document.getElementById("backupCurrentPath");
    const historyPathElement = document.getElementById("backupHistoryCurrentPath");
    const visiblePath = config.DirectorioVisible || config.Directorio || "Documentos\\CajaGo\\Respaldos";
    const frequency = this.normalizeBackupFrequency(config.Frecuencia);
    const time = config.Hora || "03:00";
    const weekday = Number.isInteger(config.DiaSemana) ? config.DiaSemana : 1;
    const monthday = Number.isInteger(config.DiaMes) ? config.DiaMes : 1;

    if (pathElement) {
      pathElement.textContent = visiblePath;
      pathElement.title = visiblePath;
    }

    if (historyPathElement) {
      historyPathElement.textContent = visiblePath;
      historyPathElement.title = visiblePath;
    }

    document.querySelectorAll("input[name='BackupFrequency']").forEach(input => {
      input.checked = input.value === frequency;
    });

    const timeInput = document.getElementById("backupPlanTime");
    if (timeInput) {
      if (![...timeInput.options].some(option => option.value === time)) {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeInput.append(option);
      }
      timeInput.value = time;
      this.syncCustomSelect?.(timeInput);
    }

    const weekdayInput = document.getElementById("backupPlanWeekday");
    if (weekdayInput) {
      weekdayInput.value = String(weekday);
      this.syncCustomSelect?.(weekdayInput);
    }

    const monthdayInput = document.getElementById("backupPlanMonthday");
    if (monthdayInput) {
      monthdayInput.value = String(monthday);
      this.syncCustomSelect?.(monthdayInput);
    }

    this.syncBackupPlanControls();
    this.updateSidebarBackupCard?.();
  },

  syncBackupPlanControls() {
    const frequency = this.getSelectedBackupFrequency();
    const time = document.getElementById("backupPlanTime")?.value || "03:00";
    const weekday = Number(document.getElementById("backupPlanWeekday")?.value || 1);
    const monthday = Number(document.getElementById("backupPlanMonthday")?.value || 1);
    const weekdayField = document.getElementById("backupPlanWeekdayField");
    const monthdayField = document.getElementById("backupPlanMonthdayField");
    const currentPlan = document.getElementById("backupCurrentPlan");
    const nextRun = document.getElementById("backupNextRun");
    const savedConfig = this.state.backupConfiguration || {};
    const savedFrequency = this.normalizeBackupFrequency(savedConfig.Frecuencia);
    const savedTime = savedConfig.Hora || "03:00";
    const savedWeekday = Number.isInteger(savedConfig.DiaSemana) ? savedConfig.DiaSemana : 1;
    const savedMonthday = Number.isInteger(savedConfig.DiaMes) ? savedConfig.DiaMes : 1;
    const isSavedPlan = savedFrequency === frequency
      && savedTime === time
      && savedWeekday === weekday
      && savedMonthday === monthday;

    document.querySelectorAll(".backup-frequency-option").forEach(option => {
      option.classList.toggle("is-selected", option.querySelector("input")?.checked);
    });

    if (weekdayField) {
      weekdayField.classList.toggle("is-muted", frequency !== "weekly");
      weekdayField.classList.toggle("hidden", frequency !== "weekly");
    }
    if (monthdayField) {
      monthdayField.classList.toggle("is-muted", frequency !== "monthly");
      monthdayField.classList.toggle("hidden", frequency !== "monthly");
    }

    const label = this.formatBackupPlanLabel(frequency, time, weekday, monthday);
    if (currentPlan) currentPlan.textContent = label;
    if (nextRun) {
      nextRun.textContent = isSavedPlan && savedConfig.ProximoRespaldo
        ? formatDateTime(savedConfig.ProximoRespaldo)
        : "Guardar plan";
    }
  },

  getSelectedBackupFrequency() {
    return this.normalizeBackupFrequency(document.querySelector("input[name='BackupFrequency']:checked")?.value);
  },

  normalizeBackupFrequency(frequency) {
    return ["daily", "weekly", "monthly"].includes(frequency) ? frequency : "daily";
  },

  formatBackupPlanLabel(frequency, time, weekday, monthday = 1) {
    const weekdayLabels = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    if (frequency === "monthly") return `Mensual · ${monthday === 0 ? "Último día" : `Día ${monthday}`} ${time}`;
    if (frequency === "weekly") return `Semanal · ${weekdayLabels[weekday] || "Lunes"} ${time}`;
    return `Diario · ${time}`;
  },

  async saveBackupPlan(button) {
    const frequency = this.getSelectedBackupFrequency();
    const time = document.getElementById("backupPlanTime")?.value || "03:00";
    const weekday = Number(document.getElementById("backupPlanWeekday")?.value || 1);
    const monthday = Number(document.getElementById("backupPlanMonthday")?.value || 1);

    setButtonLoading(button, true, "Guardando...");
    try {
      const config = await this.api.request(API_ENDPOINTS.respaldosConfiguracion, {
        method: "PUT",
        body: JSON.stringify({
          Frecuencia: frequency,
          Hora: time,
          DiaSemana: weekday,
          DiaMes: monthday
        })
      });
      this.state.backupConfiguration = config;
      this.renderBackupConfiguration(config);
      this.toast("Plan de respaldo guardado.", "success");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Guardar plan");
    }
  },

  openBackupLocationModal() {
    const config = this.state.backupConfiguration || {};
    const visiblePath = config.DirectorioVisible || config.Directorio || "Documentos\\CajaGo\\Respaldos";
    this.els.modalEyebrow.textContent = "Respaldo";
    this.els.modalTitle.textContent = "Ubicación de copias";
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="backup-location-modal">
        <div class="backup-location-current">
          <span>Ubicación recomendada</span>
          <div class="backup-location-path-row">
            <strong id="backupLocationModalPath">${escapeHtml(visiblePath)}</strong>
            <button class="btn btn-secondary" type="button" data-backup-copy-path>Copiar ruta</button>
          </div>
        </div>
        <div class="password-required-panel">
          <strong>Importante</strong>
          <p>La API guardará las copias en una carpeta estable dentro de Documentos. Más adelante, en la app de escritorio, podremos usar un selector real de carpetas.</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" type="submit">Usar ubicación recomendada</button>
      </div>
    `;

    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.querySelector("[data-backup-copy-path]").addEventListener("click", () => {
      this.copyBackupPath(visiblePath);
    });
    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      await this.saveBackupLocation();
    };

    this.els.modalRoot.classList.remove("hidden");
  },

  async copyBackupPath(path) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(path);
      } else {
        const input = document.createElement("textarea");
        input.value = path;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      this.toast("Ruta copiada.", "success");
    } catch {
      this.toast("No se pudo copiar la ruta.", "error");
    }
  },

  async saveBackupLocation() {
    const submitButton = this.els.modalForm.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Guardando...");

    try {
      const config = await this.api.request(API_ENDPOINTS.respaldosConfiguracion, {
        method: "PUT",
        body: JSON.stringify({
          Directorio: ""
        })
      });
      this.state.backupConfiguration = config;
      this.renderBackupConfiguration(config);
      await this.loadBackupHistory(1);
      this.toast("Ubicación de copias actualizada.", "success");
      this.closeModal();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Usar ubicación recomendada");
    }
  },

  async handleRestoreBackupFile(event) {
    const input = event.currentTarget;
    const file = input.files?.[0] || null;
    input.value = "";

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      this.toast("Selecciona un archivo .zip de respaldo.", "error");
      return;
    }

    const confirmed = await this.requestConfirmation({
      eyebrow: "Restaurar respaldo",
      title: "Restaurar datos del sistema",
      message: `Se reemplazarán los datos actuales con el respaldo "${file.name}". Esta acción no se puede deshacer.`,
      confirmLabel: "Restaurar"
    });

    if (!confirmed) return;

    const formData = new FormData();
    formData.append("archivo", file);

    this.setAppLoading(true, "Restaurando respaldo");
    try {
      const restored = await this.api.request(API_ENDPOINTS.respaldosRestaurar, {
        method: "POST",
        body: formData
      });
      this.toast(restored.Mensaje || "Respaldo restaurado correctamente. Inicia sesión nuevamente.", "success");
      this.logout(false);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      this.setAppLoading(false);
    }
  },

  renderBackupHistory(page = this.createEmptyPage(4)) {
    const list = Array.isArray(page.Items) ? page.Items : [];
    const latest = list[0] || null;
    const title = document.getElementById("backupStatusTitle");
    const text = document.getElementById("backupStatusText");
    const badge = document.getElementById("backupStatusBadge");
    const lastDate = document.getElementById("backupLastDate");
    const lastFile = document.getElementById("backupLastFile");
    const history = document.getElementById("backupHistoryList");
    const pagination = document.getElementById("backupHistoryPagination");

    if (!latest) {
      if (title) title.textContent = "Sin respaldo reciente";
      if (text) text.textContent = "Cuando generes una copia, acá vas a ver la última copia creada, su tamaño y el resultado del proceso.";
      if (badge) {
        badge.textContent = "Pendiente";
        badge.classList.add("is-pending");
        badge.classList.remove("is-success");
      }
      if (lastDate) lastDate.textContent = "Sin datos";
      if (lastFile) lastFile.textContent = "Sin datos";
      if (history) {
        history.className = "backup-history-empty";
        history.innerHTML = `
          <strong>No hay respaldos generados</strong>
          <span>Usá “Crear respaldo ahora” para generar la primera copia.</span>
        `;
      }
      if (pagination) pagination.innerHTML = "";
      return;
    }

    const formattedDate = formatDateTime(latest.Fecha);
    const size = this.formatFileSize(latest.TamanoBytes);

    if (title) title.textContent = "Respaldo creado";
    if (text) text.textContent = `${latest.NombreArchivo} · ${size}`;
    if (badge) {
      badge.textContent = "Correcto";
      badge.classList.remove("is-pending");
      badge.classList.add("is-success");
    }
    if (lastDate) lastDate.textContent = formattedDate;
    if (lastFile) lastFile.textContent = latest.NombreArchivo;
    if (history) {
      history.className = "backup-history-list";
      history.innerHTML = list.map(backup => `
        <div class="backup-history-item">
          <div>
            <strong>${escapeHtml(backup.NombreArchivo)}</strong>
            <span>${escapeHtml(formatDateTime(backup.Fecha))} · ${escapeHtml(this.formatFileSize(backup.TamanoBytes))}</span>
          </div>
          <a class="btn btn-secondary" href="${escapeHtml(backup.UrlDescarga)}" download>
            Descargar
          </a>
        </div>
      `).join("");
    }

    this.renderPagination({
      page,
      container: pagination,
      label: "respaldos",
      pageSizeFallback: 4,
      actionPrefix: "backup-",
      onChange: async pageIndex => {
        await this.loadBackupHistory(pageIndex);
      }
    });
    if (pagination) {
      pagination.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", async () => {
          const action = button.dataset.action;
          const current = page.PageIndex || 1;
          if (action === "backup-prev-page") await this.loadBackupHistory(current - 1);
          if (action === "backup-next-page") await this.loadBackupHistory(current + 1);
        });
      });
    }
  },

  formatFileSize(bytes) {
    const value = Number(bytes || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / 1024 / 1024).toFixed(1)} MB`;
  },

  renderImpresorasSettingsPanel() {
    const list = document.getElementById("settingsPrintersList");
    const detail = document.getElementById("settingsPrinterDetail");
    if (!list || !detail) return;

    const impresorasConfiguradas = Array.isArray(this.state.impresoras) ? this.state.impresoras : [];
    const impresoras = impresorasConfiguradas.length ? impresorasConfiguradas : this.getDemoPrinters();
    if (this.state.impresorasError) {
      list.innerHTML = `
        <div class="printer-empty-state">
          <strong>No se pudieron cargar las impresoras</strong>
          <p>${escapeHtml(this.state.impresorasError)}</p>
        </div>
      `;
      detail.innerHTML = this.renderPrinterDetailEmpty("No hay detalle disponible.");
      return;
    }

    const selectedId = this.selectedImpresoraId && impresoras.some(impresora => impresora.Id === this.selectedImpresoraId)
      ? this.selectedImpresoraId
      : (impresoras.find(impresora => impresora.EsPredeterminada)?.Id || impresoras[0].Id);
    this.selectedImpresoraId = selectedId;
    const selected = impresoras.find(impresora => impresora.Id === selectedId) || impresoras[0];
    const selectedIndex = impresoras.findIndex(impresora => impresora.Id === selected.Id);

    list.innerHTML = impresoras.map((impresora, index) => this.renderPrinterItem(impresora, impresora.Id === selected.Id, index)).join("");
    detail.innerHTML = this.renderPrinterDetail(selected, Math.max(selectedIndex, 0));
    this.bindImpresorasSettingsActions();
  },

  getDemoPrinters() {
    return [
      {
        Id: -1,
        Nombre: "Impresora Ticket Principal (EJEMPLO)",
        NombreSistema: "DEMO_TICKET_PRINCIPAL",
        Modelo: "EPSON TM-T20III",
        Conexion: "USB002",
        Puerto: "USB002",
        Tipo: "Ticket",
        AnchoPapelMm: 80,
        CorteAutomatico: true,
        DensidadImpresion: "Media",
        EsPredeterminada: true,
        Activa: true,
        EsDemo: true,
        ImagenUrl: "/assets/printers/ticket-principal.png"
      },
      {
        Id: -2,
        Nombre: "Impresora Ticket Secundaria (EJEMPLO)",
        NombreSistema: "DEMO_TICKET_SECUNDARIA",
        Modelo: "Xprinter XP-58IIH",
        Conexion: "USB003",
        Puerto: "USB003",
        Tipo: "Ticket",
        AnchoPapelMm: 80,
        CorteAutomatico: false,
        DensidadImpresion: "Media",
        EsPredeterminada: false,
        Activa: false,
        EsDemo: true,
        ImagenUrl: "/assets/printers/ticket-secundaria.png"
      },
      {
        Id: -3,
        Nombre: "Impresora A4 / Informes (EJEMPLO)",
        NombreSistema: "DEMO_LASER_INFORMES",
        Modelo: "HP LaserJet 107w",
        Conexion: "Red 192.168.1.45",
        Puerto: "Red 192.168.1.45",
        Tipo: "Láser",
        AnchoPapelMm: 210,
        CorteAutomatico: false,
        DensidadImpresion: "Media",
        EsPredeterminada: false,
        Activa: true,
        EsDemo: true,
        ImagenUrl: "/assets/printers/laser-informes.png"
      }
    ];
  },

  renderPrinterItem(impresora, selected, index = 0) {
    const online = impresora.Activa !== false;
    const paperLabel = impresora.Tipo === "Láser" ? "Tipo:" : "Ancho de papel:";
    const paperValue = impresora.Tipo === "Láser" ? "Láser" : `${escapeHtml(String(impresora.AnchoPapelMm || 80))} mm`;
    return `
      <article class="printer-item ${selected ? "is-selected" : ""}" data-printer-id="${impresora.Id}" data-printer-action="select">
        <div class="printer-visual" aria-hidden="true">${this.renderPrinterImage(impresora, index)}</div>
        <div class="printer-item-main">
          <div class="printer-badges">
            ${impresora.EsPredeterminada ? `<span class="printer-default-badge">${this.renderCheckIcon()} Predeterminada</span>` : ""}
          </div>
          <h5>${escapeHtml(impresora.Nombre)}</h5>
          <div class="printer-meta">
            <span><strong>Modelo:</strong> ${escapeHtml(impresora.Modelo || "-")}</span>
            <span><strong>Conexión:</strong> ${escapeHtml(impresora.Conexion || impresora.Puerto || "-")}</span>
            <span><strong>${paperLabel}</strong> ${paperValue}</span>
          </div>
        </div>
        <div class="printer-item-actions">
          <div class="printer-actions-top">
            <span class="printer-item-status ${online ? "" : "is-offline"}">${online ? "En línea" : "Desconectada"}</span>
            <button class="printer-menu-btn" type="button" data-printer-action="configure" data-printer-id="${impresora.Id}" aria-label="Más opciones">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8h.01" /><path d="M12 12h.01" /><path d="M12 16h.01" /></svg>
            </button>
          </div>
          <button class="btn btn-secondary" type="button" data-printer-action="test" data-printer-id="${impresora.Id}">
            ${this.renderPrinterButtonIcon()}
            Probar impresión
          </button>
          <button class="btn btn-secondary" type="button" data-printer-action="configure" data-printer-id="${impresora.Id}">
            ${this.renderGearIcon()}
            Configurar
          </button>
        </div>
      </article>
    `;
  },

  renderPrinterDetail(impresora, index = 0) {
    const online = impresora.Activa !== false;
    return `
      <div class="printer-detail-top">
        <div class="printer-detail-visual" aria-hidden="true">${this.renderPrinterImage(impresora, index)}</div>
        ${impresora.EsPredeterminada ? `<span class="printer-default-badge">${this.renderCheckIcon()} Predeterminada</span>` : ""}
      </div>
      <div class="printer-detail-grid">
        ${this.renderPrinterDetailRow("Nombre", impresora.Nombre)}
        ${this.renderPrinterDetailRow("Modelo", impresora.Modelo || "-")}
        ${this.renderPrinterDetailRow("Conexión", impresora.Conexion || "-")}
        <div class="printer-detail-row">
          <span>Estado</span>
          <strong class="printer-detail-status ${online ? "" : "is-offline"}">${online ? "En línea" : "Desconectada"}</strong>
        </div>
        ${this.renderPrinterDetailRow("Ancho de papel", `${impresora.AnchoPapelMm || 80} mm`)}
        ${this.renderPrinterDetailRow("Corte automático", impresora.CorteAutomatico ? "Habilitado" : "Deshabilitado")}
        ${this.renderPrinterDetailRow("Densidad de impresión", impresora.DensidadImpresion || "Media")}
        ${this.renderPrinterDetailRow("Puerto", impresora.Puerto || impresora.NombreSistema || "-")}
      </div>
      <button class="btn btn-secondary" type="button" data-printer-action="configure" data-printer-id="${impresora.Id}">
        ${this.renderGearIcon()}
        Configurar opciones avanzadas
      </button>
      <div class="printer-info-note">
        <strong>Información</strong>
        <p>${impresora.EsDemo
          ? "Esta impresora es solo una referencia visual hasta que conectes o configures una impresora real de Windows."
          : "Esta impresora se utilizará para imprimir tickets en el punto de venta cuando esté seleccionada como principal."}</p>
      </div>
    `;
  },

  renderPrinterDetailRow(label, value) {
    return `
      <div class="printer-detail-row">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  },

  renderPrinterDetailEmpty(message) {
    return `
      <div class="printer-empty-state">
        <strong>Detalle de la impresora</strong>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  },

  renderPrinterImage(impresora, index = 0) {
    const printerImages = [
      "/assets/printers/ticket-principal.png",
      "/assets/printers/ticket-secundaria.png",
      "/assets/printers/laser-informes.png"
    ];
    const normalizedType = String(impresora.Tipo || "").toLowerCase();
    const fallback = normalizedType.includes("láser") || normalizedType.includes("laser") || normalizedType.includes("informe")
      ? "/assets/printers/laser-informes.png"
      : printerImages[Math.abs(index) % printerImages.length];
    return `<img src="${escapeHtml(impresora.ImagenUrl || fallback)}" alt="">`;
  },

  renderCheckIcon() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>`;
  },

  renderPrinterButtonIcon() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V4h12v5" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>`;
  },

  renderGearIcon() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" /><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.5 1.27V21a2 2 0 1 1-4 0v-.09A1.8 1.8 0 0 0 8 19.4a1.8 1.8 0 0 0-1.98.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.27-.5H2.6a2 2 0 1 1 0-4h.09A1.8 1.8 0 0 0 4.6 8a1.8 1.8 0 0 0-.36-1.98l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .5-1.27V2.6a2 2 0 1 1 4 0v.09A1.8 1.8 0 0 0 16 4.6a1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.8 1.8 0 0 0 19.4 9c.06.35.25.67.6 1 .36.34.8.5 1.27.5h.13a2 2 0 1 1 0 4h-.09A1.8 1.8 0 0 0 19.4 15Z" /></svg>`;
  },

  renderPrinterIcon(tipo = "Ticket") {
    if (tipo === "Informes") {
      return `<svg viewBox="0 0 24 24"><path d="M6 9V4h12v5" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>`;
    }

    return `<svg viewBox="0 0 24 24"><path d="M7 8V4h10v4" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v7H7z" /><path d="M9 17h6" /><path d="M17 11h.01" /></svg>`;
  },

  bindImpresorasSettingsActions() {
    document.querySelectorAll("[data-printer-action]").forEach(element => {
      if (element.dataset.printerBound === "true") return;

      element.addEventListener("click", event => this.handleImpresorasSettingsAction(event));
      element.dataset.printerBound = "true";
    });
  },

  async handleImpresorasSettingsAction(event) {
    event.stopPropagation();
    const target = event.currentTarget;
    const action = target.dataset.printerAction;
    const printerId = Number(target.dataset.printerId);

    if (action === "select" && Number.isFinite(printerId)) {
      this.selectedImpresoraId = printerId;
      this.renderImpresorasSettingsPanel();
      return;
    }

    if (action === "add" || action === "refresh") {
      await this.loadImpresoras();
      this.renderImpresorasSettingsPanel();
      this.syncTicketSettings(this.els.configuracionForm);
      this.toast(action === "add"
        ? "Se actualizaron las impresoras disponibles. La carga avanzada queda para la próxima etapa."
        : "Impresoras actualizadas.", "success");
      return;
    }

    if (action === "configure") {
      this.toast("La gestión avanzada de impresoras queda preparada para la próxima etapa.", "info");
      return;
    }

    if (action === "test" && Number.isFinite(printerId)) {
      await this.handleSettingsPrinterTest(target, printerId);
    }
  },

  async handleSettingsPrinterTest(button, printerId) {
    const form = this.els.configuracionForm;
    const configuracion = this.state.configuraciones[0] || {};
    const printer = this.state.impresoras.find(impresora => impresora.Id === printerId);
    const ticketWidth = this.getSelectedTicketWidth?.() || printer?.AnchoPapelMm || 80;

    if (!printer) {
      this.toast("La impresora de ejemplo es solo visual. Conecta una impresora real para probar impresión.", "info");
      return;
    }

    setButtonLoading(button, true, "Enviando...");

    try {
      await this.api.request(`${API_ENDPOINTS.impresoras}/${printerId}/ticket-prueba`, {
        method: "POST",
        body: JSON.stringify({
          ImpresoraNombre: null,
          NombreNegocio: normalizeOptional(form?.NombreNegocio?.value || configuracion.NombreNegocio),
          Mensaje: normalizeOptional(form?.MensajeTicket?.value || this.state.configuracionTicket?.MensajeTicket),
          AnchoMm: ticketWidth,
          ImprimirFechaHora: this.getFormCheckboxValue(form, "ImprimirFechaHoraTicket"),
          ImprimirCajero: this.getFormCheckboxValue(form, "ImprimirCajeroTicket"),
          ImprimirNumero: this.getFormCheckboxValue(form, "ImprimirNumeroTicket"),
          CorteAutomatico: this.getFormCheckboxValue(form, "UsaTicketTermico")
        })
      });
      this.toast("Ticket de prueba enviado a la impresora.", "success");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Probar impresión");
    }
  },

  bindBusinessSummary(form) {
    if (form.dataset.businessSummaryBound === "true") return;

    ["NombreNegocio", "Telefono", "Email", "Direccion"].forEach(name => {
      form[name]?.addEventListener("input", () => this.updateBusinessSummary(form));
    });

    form.dataset.businessSummaryBound = "true";
  },

  bindTicketSettings(form) {
    if (form.dataset.ticketSettingsBound === "true") return;

    document.querySelectorAll("[data-ticket-field]").forEach(control => {
      control.addEventListener("input", () => this.syncTicketField(form, control));
      control.addEventListener("change", () => this.syncTicketField(form, control));
    });
    document.querySelector("[data-action='test-ticket-printer']")
      ?.addEventListener("click", event => this.handleTicketPrinterTest(event, form));
    document.querySelector(".ticket-upload-box")
      ?.addEventListener("click", () => document.getElementById("ticketLogoInput")?.click());
    document.getElementById("ticketLogoInput")
      ?.addEventListener("change", event => this.handleTicketLogoUpload(event, form));
    ["NombreNegocio", "Telefono", "Email", "Direccion"].forEach(name => {
      form[name]?.addEventListener("input", () => this.updateTicketPreview(form));
    });

    form.dataset.ticketSettingsBound = "true";
  },

  syncTicketSettings(form) {
    const impresoraControl = document.querySelector('[data-ticket-field="ImpresoraTicket"]');
    const messageControl = document.querySelector('[data-ticket-field="MensajeTicket"]');
    const counter = document.getElementById("ticketMessageCount");

    if (impresoraControl) {
      this.renderTicketPrinterOptions(impresoraControl, form.ImpresoraTicket?.value || "");
      const value = form.ImpresoraTicket?.value || "";
      if (value && !Array.from(impresoraControl.options).some(option => option.value === value)) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = `${value} (no detectada)`;
        impresoraControl.append(option);
      }
      impresoraControl.value = value;
    }

    if (messageControl) {
      messageControl.value = form.MensajeTicket?.value || "";
      if (counter) counter.textContent = String(messageControl.value.length);
    }

    [
      "UsaTicketTermico",
      "ImprimirDatosNegocioTicket",
      "ImprimirFechaHoraTicket",
      "ImprimirCajeroTicket",
      "ImprimirNumeroTicket",
      "ImprimirMedioPagoTicket",
      "ImprimirDesgloseImpuestosTicket",
      "ImprimirSubtotalTotalTicket",
      "ImprimirDescuentoRecargoTicket",
      "ImprimirClienteTicket",
      "ImprimirMensajeCierreTicket",
      "VistaPreviaAntesImprimir"
    ].forEach(field => {
      this.syncTicketCheckboxFromForm(form, field);
    });

    this.syncTicketWidthControls();
    this.enhanceCustomSelects?.(document.querySelector('[data-settings-panel="ticket"]') || document);
    this.updateTicketPreview(form);
  },

  renderTicketPrinterOptions(select, selectedValue = "") {
    const status = document.getElementById("ticketPrinterStatus");
    const printers = Array.isArray(this.state.impresoras) ? this.state.impresoras : [];
    const defaultPrinter = printers.find(printer => printer.EsPredeterminada);
    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultPrinter
      ? `Predeterminada: ${defaultPrinter.Nombre}`
      : "Seleccionar impresora";
    select.append(defaultOption);

    printers.forEach(printer => {
      const option = document.createElement("option");
      option.value = printer.NombreSistema;
      option.dataset.printerId = String(printer.Id);
      option.textContent = printer.EsPredeterminada ? `${printer.Nombre} (predeterminada)` : printer.Nombre;
      select.append(option);
    });

    if (status) {
      if (this.state.impresorasError) {
        status.textContent = "No se pudieron consultar las impresoras configuradas.";
        status.classList.add("is-error");
      } else if (!printers.length) {
        status.textContent = "No hay impresoras configuradas. Agregalas desde Configuración > Impresoras.";
        status.classList.add("is-error");
      } else {
        status.textContent = `${printers.length} impresora${printers.length === 1 ? "" : "s"} configurada${printers.length === 1 ? "" : "s"}.`;
        status.classList.remove("is-error");
      }
    }

    select.value = selectedValue;
  },

  syncTicketField(form, control) {
    const field = control.dataset.ticketField;
    if (field === "ImpresoraTicket" && form.ImpresoraTicket) {
      form.ImpresoraTicket.value = control.value;
      return;
    }

    if (field === "MensajeTicket" && form.MensajeTicket) {
      form.MensajeTicket.value = control.value;
      const counter = document.getElementById("ticketMessageCount");
      if (counter) counter.textContent = String(control.value.length);
      this.updateTicketPreview(form);
      return;
    }

    if ([
      "UsaTicketTermico",
      "ImprimirDatosNegocioTicket",
      "ImprimirFechaHoraTicket",
      "ImprimirCajeroTicket",
      "ImprimirNumeroTicket",
      "ImprimirMedioPagoTicket",
      "ImprimirDesgloseImpuestosTicket",
      "ImprimirSubtotalTotalTicket",
      "ImprimirDescuentoRecargoTicket",
      "ImprimirClienteTicket",
      "ImprimirMensajeCierreTicket",
      "VistaPreviaAntesImprimir"
    ].includes(field) && form[field]) {
      this.syncFormCheckboxControl(form, field, control.checked);
      document.querySelectorAll(`[data-ticket-field="${field}"]`).forEach(linkedControl => {
        if (linkedControl !== control && linkedControl.type === "checkbox") {
          linkedControl.checked = control.checked;
        }
      });
      this.updateTicketPreview(form);
    }

    if (field === "TicketWidth" || field === "TicketCustomWidth") {
      this.syncTicketWidthControls();
    }
  },

  syncTicketWidthControls() {
    const widthControl = document.querySelector('[data-ticket-field="TicketWidth"]');
    const customWidthControl = document.querySelector('[data-ticket-field="TicketCustomWidth"]');
    const error = document.getElementById("ticketWidthError");
    const testButton = document.querySelector("[data-action='test-ticket-printer']");
    const isCustom = widthControl?.value === "custom";
    const width = Number(customWidthControl?.value || 0);
    const isValid = !isCustom || (Number.isFinite(width) && width >= 40 && width <= 120);

    customWidthControl?.classList.toggle("hidden", !isCustom);
    error?.classList.toggle("hidden", isValid);
    customWidthControl?.classList.toggle("is-invalid", !isValid);
    if (testButton) {
      testButton.disabled = !isValid;
    }

    return isValid;
  },

  getSelectedTicketWidth() {
    const widthControl = document.querySelector('[data-ticket-field="TicketWidth"]');
    const customWidthControl = document.querySelector('[data-ticket-field="TicketCustomWidth"]');
    if (widthControl?.value !== "custom") {
      return Number(widthControl?.value || 80);
    }

    const width = Number(customWidthControl?.value || 0);
    if (!Number.isFinite(width) || width < 40 || width > 120) {
      this.syncTicketWidthControls();
      return null;
    }

    return width;
  },

  buildConfiguracionTicketPayload(form) {
    const widthControl = document.querySelector('[data-ticket-field="TicketWidth"]');
    const impresoraControl = document.querySelector('[data-ticket-field="ImpresoraTicket"]');
    const selectedOption = impresoraControl?.options[impresoraControl.selectedIndex];
    const printerId = selectedOption?.dataset.printerId ? Number(selectedOption.dataset.printerId) : null;
    const ticketWidth = this.getSelectedTicketWidth() || 80;
    const corteAutomatico = this.getFormCheckboxValue(form, "UsaTicketTermico");

    return {
      ImpresoraId: Number.isFinite(printerId) ? printerId : null,
      ImpresoraNombreSistema: normalizeOptional(form.ImpresoraTicket.value),
      MensajeTicket: normalizeOptional(form.MensajeTicket.value),
      AnchoPapelMm: ticketWidth,
      UsaAnchoPersonalizado: widthControl?.value === "custom",
      UsaTicketTermico: corteAutomatico,
      VistaPreviaAntesImprimir: this.getFormCheckboxValue(form, "VistaPreviaAntesImprimir"),
      ImprimirCopiaTicket: this.getFormCheckboxValue(form, "ImprimirCopiaTicket"),
      LetraGrandePantallaTactil: this.getFormCheckboxValue(form, "LetraGrandePantallaTactil"),
      ImprimirDatosNegocioTicket: this.getFormCheckboxValue(form, "ImprimirDatosNegocioTicket"),
      ImprimirFechaHoraTicket: this.getFormCheckboxValue(form, "ImprimirFechaHoraTicket"),
      ImprimirCajeroTicket: this.getFormCheckboxValue(form, "ImprimirCajeroTicket"),
      ImprimirNumeroTicket: this.getFormCheckboxValue(form, "ImprimirNumeroTicket"),
      ImprimirMedioPagoTicket: this.getFormCheckboxValue(form, "ImprimirMedioPagoTicket"),
      ImprimirDesgloseImpuestosTicket: this.getFormCheckboxValue(form, "ImprimirDesgloseImpuestosTicket"),
      ImprimirSubtotalTotalTicket: this.getFormCheckboxValue(form, "ImprimirSubtotalTotalTicket"),
      ImprimirDescuentoRecargoTicket: this.getFormCheckboxValue(form, "ImprimirDescuentoRecargoTicket"),
      ImprimirClienteTicket: this.getFormCheckboxValue(form, "ImprimirClienteTicket"),
      ImprimirMensajeCierreTicket: this.getFormCheckboxValue(form, "ImprimirMensajeCierreTicket"),
      CorteAutomatico: corteAutomatico
    };
  },

  async handleTicketPrinterTest(event, form) {
    const button = event.currentTarget;
    const impresoraControl = document.querySelector('[data-ticket-field="ImpresoraTicket"]');
    if (!impresoraControl?.value) {
      this.toast("Seleccioná una impresora configurada para probar la impresión.", "error");
      return;
    }

    const ticketWidth = this.getSelectedTicketWidth();
    if (!ticketWidth) return;
    const selectedOption = impresoraControl.options[impresoraControl.selectedIndex];
    const printerId = selectedOption?.dataset.printerId;
    const endpoint = printerId ? `${API_ENDPOINTS.impresoras}/${printerId}/ticket-prueba` : `${API_ENDPOINTS.impresoras}/ticket-prueba`;

    setButtonLoading(button, true, "Enviando...");

    try {
      await this.api.request(endpoint, {
        method: "POST",
        body: JSON.stringify({
          ImpresoraNombre: impresoraControl?.value || null,
          NombreNegocio: normalizeOptional(form.NombreNegocio?.value),
          Mensaje: normalizeOptional(form.MensajeTicket?.value),
          AnchoMm: ticketWidth,
          ImprimirFechaHora: this.getFormCheckboxValue(form, "ImprimirFechaHoraTicket"),
          ImprimirCajero: this.getFormCheckboxValue(form, "ImprimirCajeroTicket"),
          ImprimirNumero: this.getFormCheckboxValue(form, "ImprimirNumeroTicket"),
          CorteAutomatico: this.getFormCheckboxValue(form, "UsaTicketTermico")
        })
      });
      this.toast("Ticket de prueba enviado a la impresora.", "success");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Probar impresión");
    }
  },

  async handleTicketLogoUpload(event, form) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!form.dataset.id) {
      this.toast("Guarda los datos del negocio antes de subir el logo.", "error");
      input.value = "";
      return;
    }

    const uploadButton = document.querySelector(".ticket-upload-box");
    const uploadLabel = uploadButton?.querySelector("span");
    const previousLabel = uploadLabel?.textContent || "Subir logo";
    const data = new FormData();
    data.append("archivo", file);

    if (uploadButton) {
      uploadButton.disabled = true;
      uploadButton.classList.add("is-loading");
    }
    if (uploadLabel) uploadLabel.textContent = "Subiendo...";

    try {
      const configuracion = await this.api.request(API_ENDPOINTS.configuracionNegocioLogo(form.dataset.id), {
        method: "POST",
        body: data
      });

      this.state.configuraciones[0] = configuracion;
      form.LogoUrl.value = configuracion.LogoUrl || "";
      this.updateTicketPreview(form);
      this.toast("Logo actualizado.", "success");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      input.value = "";
      if (uploadButton) {
        uploadButton.disabled = false;
        uploadButton.classList.remove("is-loading");
      }
      if (uploadLabel) uploadLabel.textContent = previousLabel;
    }
  },

  updateTicketPreview(form) {
    const businessElement = document.getElementById("ticketPreviewBusiness");
    const messageElement = document.getElementById("ticketPreviewMessage");
    const logoElement = document.getElementById("ticketPreviewLogo");
    const fechaElement = document.querySelector('[data-ticket-preview-option="fecha"] strong');
    this.updateTicketTaxPreviewRows();
    const previewOptions = {
      "datos-negocio": this.getFormCheckboxValue(form, "ImprimirDatosNegocioTicket"),
      fecha: this.getFormCheckboxValue(form, "ImprimirFechaHoraTicket"),
      cajero: this.getFormCheckboxValue(form, "ImprimirCajeroTicket"),
      numero: this.getFormCheckboxValue(form, "ImprimirNumeroTicket"),
      medio: this.getFormCheckboxValue(form, "ImprimirMedioPagoTicket"),
      impuestos: this.getFormCheckboxValue(form, "ImprimirDesgloseImpuestosTicket"),
      subtotal: this.getFormCheckboxValue(form, "ImprimirSubtotalTotalTicket"),
      total: this.getFormCheckboxValue(form, "ImprimirSubtotalTotalTicket"),
      "descuento-recargo": this.getFormCheckboxValue(form, "ImprimirDescuentoRecargoTicket"),
      cliente: this.getFormCheckboxValue(form, "ImprimirClienteTicket"),
      mensaje: this.getFormCheckboxValue(form, "ImprimirMensajeCierreTicket")
    };
    if (businessElement) {
      businessElement.textContent = form.NombreNegocio?.value.trim() || "CajaGo";
    }
    if (messageElement) {
      messageElement.textContent = form.MensajeTicket?.value.trim() || "Gracias por tu compra.";
    }
    if (logoElement) {
      const logoUrl = form.LogoUrl?.value.trim() || "";
      logoElement.classList.toggle("hidden", !logoUrl);
      if (logoUrl) {
        logoElement.src = logoUrl;
      } else {
        logoElement.removeAttribute("src");
      }
    }
    if (fechaElement) {
      fechaElement.textContent = previewOptions.fecha ? formatDateTime(new Date()) : "";
    }
    const businessDataVisible = this.getFormCheckboxValue(form, "ImprimirDatosNegocioTicket");
    const businessDataNodes = {
      Direccion: form.Direccion?.value?.trim() || ""
    };

    Object.entries(businessDataNodes).forEach(([key, value]) => {
      const node = document.querySelector(`[data-ticket-preview-business="${key}"]`);
      if (!node) return;

      if (!value || !businessDataVisible) {
        node.classList.add("hidden");
        node.textContent = "";
        return;
      }

      node.classList.remove("hidden");
      node.textContent = value;
    });

    Object.entries(previewOptions).forEach(([key, visible]) => {
      document.querySelectorAll(`[data-ticket-preview-option="${key}"]`).forEach(element => {
        element.classList.toggle("hidden", !visible);
      });
    });
  },

  updateTicketTaxPreviewRows() {
    const taxRows = document.querySelectorAll('[data-ticket-preview-option="impuestos"]');
    if (taxRows.length < 2) return;

    const select = document.getElementById("taxDefaultSelect");
    const selectedTax = this.state.impuestos.find(impuesto => String(impuesto.Id) === select?.value)
      || this.state.impuestosResumen?.Predeterminado
      || this.state.impuestos.find(impuesto => impuesto.EsPredeterminado);
    const total = 2500;
    const percent = Number(selectedTax?.Porcentaje || 0);
    const neto = percent > 0 ? total / (1 + percent / 100) : total;
    const impuesto = total - neto;
    const taxName = selectedTax?.Nombre || "Impuesto";

    taxRows[0].querySelector("strong").textContent = formatMoney(neto);
    taxRows[1].querySelector("span").textContent = `${taxName} ${this.formatTaxPercent(percent)}`;
    taxRows[1].querySelector("strong").textContent = formatMoney(impuesto);
  },

  parseBusinessHours(configuracion = {}) {
    const raw = configuracion.DiasAtencion || "";
    const template = this.getBusinessWeekTemplate();

    if (raw.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.days)) {
          return template.map(day => {
            const saved = parsed.days.find(item => item.key === day.key);
            const ranges = Array.isArray(saved?.ranges)
              ? saved.ranges
                  .map(range => ({ from: range.from || "", to: range.to || "" }))
                  .filter(range => range.from || range.to)
              : day.ranges;
            return {
              ...day,
              open: Boolean(saved?.open),
              ranges: ranges.length ? ranges : [{ from: "", to: "" }]
            };
          });
        }
      } catch {
        return template;
      }
    }

    if (configuracion.HorarioApertura && configuracion.HorarioCierre) {
      const normalizedDays = raw.toLowerCase();
      return template.map(day => ({
        ...day,
        open: normalizedDays ? normalizedDays.includes(day.label.toLowerCase()) : false,
        ranges: [{ from: configuracion.HorarioApertura, to: configuracion.HorarioCierre }]
      }));
    }

    return template;
  },

  renderBusinessHoursEditor(form, configuracion = {}) {
    const editor = document.getElementById("businessHoursEditor");

    this.businessHours = this.businessHours?.length ? this.businessHours : this.parseBusinessHours(configuracion);
    if (configuracion.DiasAtencion !== undefined) {
      this.businessHours = this.parseBusinessHours(configuracion);
    }

    this.renderBusinessHoursSummary();

    if (!editor) {
      this.syncBusinessHoursFields(form);
      return;
    }

    editor.innerHTML = this.businessHours.map((day, dayIndex) => `
      <div class="business-hours-day ${day.open ? "is-open" : ""}" data-day-index="${dayIndex}">
        <div class="business-hours-day-head">
          <label class="business-hours-toggle">
            <input type="checkbox" ${day.open ? "checked" : ""} data-hours-action="toggle-day" data-day-index="${dayIndex}">
            <span>${escapeHtml(day.label)}</span>
          </label>
          <button class="btn btn-secondary business-hours-add" type="button" data-hours-action="add-range" data-day-index="${dayIndex}" ${day.open ? "" : "disabled"}>Agregar horario</button>
        </div>
        <div class="business-hours-ranges">
          ${day.open ? day.ranges.map((range, rangeIndex) => `
            <div class="business-hours-range">
              <label>
                <span>Desde</span>
                <select data-hours-action="range-from" data-day-index="${dayIndex}" data-range-index="${rangeIndex}">
                  ${this.getBusinessTimeOptions(range.from)}
                </select>
              </label>
              <label>
                <span>Hasta</span>
                <select data-hours-action="range-to" data-day-index="${dayIndex}" data-range-index="${rangeIndex}">
                  ${this.getBusinessTimeOptions(range.to)}
                </select>
              </label>
              <button class="icon-btn business-hours-remove" type="button" aria-label="Quitar horario" data-hours-action="remove-range" data-day-index="${dayIndex}" data-range-index="${rangeIndex}" ${day.ranges.length <= 1 ? "disabled" : ""}>×</button>
            </div>
          `).join("") : `<div class="business-hours-closed">Cerrado</div>`}
        </div>
      </div>
    `).join("");

    if (editor.dataset.bound !== "true") {
      editor.addEventListener("click", event => this.handleBusinessHoursClick(event, form));
      editor.addEventListener("input", event => this.handleBusinessHoursInput(event, form));
      editor.addEventListener("change", event => this.handleBusinessHoursInput(event, form));
      editor.dataset.bound = "true";
    }

    this.bindBusinessHoursModal(form);
    this.enhanceCustomSelects?.(editor);
    this.syncBusinessHoursFields(form);
  },

  bindBusinessHoursModal(form) {
    if (form.dataset.businessHoursModalBound === "true") return;

    document.getElementById("businessHoursEditButton")?.addEventListener("click", () => {
      this.renderBusinessHoursEditor(form);
      document.getElementById("businessHoursModal")?.classList.remove("hidden");
    });

    ["businessHoursCloseButton", "businessHoursCancelButton"].forEach(id => {
      document.getElementById(id)?.addEventListener("click", () => {
        this.syncBusinessHoursFields(form);
        document.getElementById("businessHoursModal")?.classList.add("hidden");
      });
    });

    document.getElementById("businessHoursDoneButton")?.addEventListener("click", () => {
      this.syncBusinessHoursFields(form);
      const validationMessage = this.validateBusinessHours();
      if (validationMessage) {
        this.toast(validationMessage, "error");
        return;
      }
      document.getElementById("businessHoursModal")?.classList.add("hidden");
    });

    document.querySelector("#businessHoursModal .modal-backdrop")?.addEventListener("click", () => {
      this.syncBusinessHoursFields(form);
      document.getElementById("businessHoursModal")?.classList.add("hidden");
    });

    form.dataset.businessHoursModalBound = "true";
  },

  renderBusinessHoursSummary() {
    const metaElement = document.getElementById("businessHoursMeta");
    const summaryElement = document.getElementById("businessHoursSummaryText");
    if (!metaElement || !summaryElement) return;

    const openDays = (this.businessHours || []).filter(day => day.open);
    const validRanges = openDays.flatMap(day =>
      day.ranges
        .filter(range => range.from && range.to)
        .map(range => ({ label: day.label.slice(0, 3), from: range.from, to: range.to }))
    );

    if (!openDays.length || !validRanges.length) {
      metaElement.textContent = "Sin horarios configurados.";
      summaryElement.textContent = "Configura los días y rangos horarios del negocio.";
      return;
    }

    metaElement.textContent = `${openDays.length} días abiertos · ${validRanges.length} rangos horarios`;
    summaryElement.textContent = validRanges
      .slice(0, 3)
      .map(range => `${range.label} ${range.from}-${range.to}`)
      .join(" · ") + (validRanges.length > 3 ? "..." : "");
  },

  handleBusinessHoursClick(event, form) {
    const source = event.target;
    const target = source instanceof Element
      ? source.closest("[data-hours-action]")
      : source?.parentElement?.closest?.("[data-hours-action]");
    if (!target || !target.dataset.hoursAction) return;
    if (!target.closest?.("#businessHoursEditor")) return;
    if (target.hasAttribute("disabled")) return;

    const action = target.dataset.hoursAction;
    if (!action) return;

    const dayIndex = Number.parseInt(target.dataset.dayIndex, 10);
    const rangeIndex = Number.isNaN(Number.parseInt(target.dataset.rangeIndex, 10))
      ? null
      : Number.parseInt(target.dataset.rangeIndex, 10);
    const day = this.businessHours?.[dayIndex];
    if (!day) return;

    if (action === "add-range") {
      day.ranges.push({ from: "", to: "" });
      this.renderBusinessHoursEditor(form);
      return;
    }

    if (action === "remove-range" && day.ranges.length > 1) {
      if (rangeIndex === null) return;
      day.ranges.splice(rangeIndex, 1);
      this.renderBusinessHoursEditor(form);
    }
  },

  handleBusinessHoursInput(event, form) {
    const source = event.target;
    const target = source instanceof Element
      ? source.closest("[data-hours-action]")
      : source?.parentElement?.closest?.("[data-hours-action]");
    if (!target || !target.dataset.hoursAction) return;

    const action = target.dataset.hoursAction;
    if (!action) return;

    const dayIndex = Number.parseInt(target.dataset.dayIndex, 10);
    const rangeIndex = Number.parseInt(target.dataset.rangeIndex, 10);
    const day = this.businessHours?.[dayIndex];
    if (!day) return;

    if (action === "toggle-day") {
      day.open = event.target.checked;
      if (day.open && !day.ranges.length) {
        day.ranges = [{ from: "", to: "" }];
      }
      this.renderBusinessHoursEditor(form);
      return;
    }

    if (Number.isNaN(rangeIndex)) return;

    if (action === "range-from") {
      day.ranges[rangeIndex].from = event.target.value;
    }

    if (action === "range-to") {
      day.ranges[rangeIndex].to = event.target.value;
    }

    this.syncBusinessHoursFields(form);
  },

  syncBusinessHoursFields(form) {
    const hours = this.businessHours || this.getBusinessWeekTemplate();
    const openDays = hours.filter(day => day.open);
    const firstRange = openDays.flatMap(day => day.ranges).find(range => range.from && range.to);
    const payload = {
      version: 1,
      days: hours.map(day => ({
        key: day.key,
        label: day.label,
        open: day.open,
        ranges: day.open ? day.ranges.map(range => ({ from: range.from, to: range.to })) : []
      }))
    };

    form.DiasAtencion.value = JSON.stringify(payload);
    form.HorarioApertura.value = firstRange?.from || "";
    form.HorarioCierre.value = firstRange?.to || "";
    this.renderBusinessHoursSummary();
    this.updateBusinessSummary(form);
  },

  formatBusinessHoursSummary(raw) {
    if (!raw) return "";

    if (!raw.trim().startsWith("{")) return raw;

    try {
      const parsed = JSON.parse(raw);
      const openDays = Array.isArray(parsed.days) ? parsed.days.filter(day => day.open) : [];
      if (!openDays.length) return "";

      return openDays
        .map(day => {
          const ranges = Array.isArray(day.ranges)
            ? day.ranges.filter(range => range.from && range.to).map(range => `${range.from}-${range.to}`).join(", ")
            : "";
          return `${day.label}: ${ranges || "sin horario"}`;
        })
        .join(" · ");
    } catch {
      return raw;
    }
  },

  updateBusinessSummary(form) {
    const values = {
      nombre: form.NombreNegocio?.value.trim() || "",
      telefono: form.Telefono?.value.trim() || "",
      email: form.Email?.value.trim() || "",
      direccion: form.Direccion?.value.trim() || "",
      dias: this.formatBusinessHoursSummary(form.DiasAtencion?.value.trim() || ""),
      apertura: form.HorarioApertura?.value || "",
      cierre: form.HorarioCierre?.value || ""
    };
    const hasContacto = Boolean(values.telefono || values.email);
    const hasHorarios = Boolean(values.dias);
    const completed = [Boolean(values.nombre), hasContacto, Boolean(values.direccion), hasHorarios].filter(Boolean).length;

    const nameElement = document.getElementById("businessSummaryName");
    const statusElement = document.getElementById("businessSummaryStatus");
    const phoneElement = document.getElementById("businessSummaryPhone");
    const emailElement = document.getElementById("businessSummaryEmail");
    const addressElement = document.getElementById("businessSummaryAddress");

    if (nameElement) {
      nameElement.innerHTML = values.nombre ? escapeHtml(values.nombre) : `Caja<span>Go</span>`;
    }
    if (statusElement) {
      statusElement.textContent = completed === 4
        ? "Perfil completo. Los datos del negocio estan listos para usarse en el sistema."
        : `Perfil incompleto: ${completed}/4 datos principales cargados.`;
    }
    if (phoneElement) phoneElement.textContent = values.telefono || "Sin cargar";
    if (emailElement) emailElement.textContent = values.email || "Sin cargar";
    if (addressElement) addressElement.textContent = values.direccion || "Sin cargar";

    const checkState = {
      nombre: Boolean(values.nombre),
      contacto: hasContacto,
      direccion: Boolean(values.direccion),
      horarios: hasHorarios
    };

    Object.entries(checkState).forEach(([key, active]) => {
      document.querySelector(`[data-business-check="${key}"]`)?.classList.toggle("is-complete", active);
    });
  },

  bindColorSwatches(form) {
    if (form.dataset.colorSwatchesBound === "true") return;

    form.querySelectorAll(".color-swatch").forEach(button => {
      if (button.classList.contains("color-swatch-custom")) return;

      button.addEventListener("click", () => {
        this.syncColorSwatches(form, button.dataset.color);
      });
    });

    form.ColorPersonalizado?.addEventListener("input", event => {
      this.syncColorSwatches(form, event.target.value);
    });

    form.dataset.colorSwatchesBound = "true";
  },

  syncColorSwatches(form, color) {
    const selectedColor = this.normalizeBrandColor(color);
    form.ColorPrincipal.value = selectedColor;
    if (form.ColorPersonalizado) {
      form.ColorPersonalizado.value = selectedColor;
    }
    form.querySelectorAll(".color-swatch").forEach(button => {
      const isCustom = button.classList.contains("color-swatch-custom");
      const isPreset = this.normalizeBrandColor(button.dataset.color) === selectedColor;
      const matchesPreset = Array.from(form.querySelectorAll(".color-swatch:not(.color-swatch-custom)"))
        .some(preset => this.normalizeBrandColor(preset.dataset.color) === selectedColor);
      button.classList.toggle("active", isCustom ? !matchesPreset : isPreset);
    });
    this.applyBrandColor(selectedColor);
  },

  bindConfiguracionFieldLimits(form) {
    if (form.dataset.fieldLimitsBound === "true") return;

    form.DescuentoMaximoPermitido?.addEventListener("input", event => {
      const input = event.target;
      const value = Number(input.value);
      const errorElement = form.querySelector('[data-field-error="DescuentoMaximoPermitido"]');

      if (errorElement) {
        errorElement.textContent = "";
      }

      if (input.value === "") return;

      if (Number.isFinite(value) && value > 100) {
        input.value = "100";
        if (errorElement) {
          errorElement.textContent = "El descuento máximo permitido es 100%.";
        }
      }

      if (Number.isFinite(value) && value < 0) {
        input.value = "0";
        if (errorElement) {
          errorElement.textContent = "El descuento mínimo permitido es 0%.";
        }
      }
    });

    form.MontoMinimoAperturaCaja?.addEventListener("input", event => {
      const input = event.target;
      const value = Number(input.value);

      if (input.value !== "" && Number.isFinite(value) && value < 0) {
        input.value = "0";
      }
    });

    form.dataset.fieldLimitsBound = "true";
  },

  async handleConfiguracion(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = event.submitter || form.querySelector("button[type='submit']");
    this.syncBusinessHoursFields(form);
    const validationMessage = this.validateConfiguracionForm(form);

    if (validationMessage) {
      this.toast(validationMessage, "error");
      return;
    }

    const payload = {
      NombreNegocio: form.NombreNegocio.value.trim(),
      Telefono: normalizeOptional(form.Telefono.value),
      Email: normalizeOptional(form.Email.value),
      Direccion: normalizeOptional(form.Direccion.value),
      DiasAtencion: normalizeOptional(form.DiasAtencion.value),
      HorarioApertura: normalizeOptional(form.HorarioApertura.value),
      HorarioCierre: normalizeOptional(form.HorarioCierre.value),
      LogoUrl: normalizeOptional(form.LogoUrl.value),
      ColorPrincipal: this.normalizeBrandColor(form.ColorPrincipal.value),
      ConfirmarEliminarItemCarrito: form.ConfirmarEliminarItemCarrito.checked,
      MantenerClienteAlFinalizarVenta: form.MantenerClienteAlFinalizarVenta.checked,
      MostrarStockEnBusquedaProductos: form.MostrarStockEnBusquedaProductos.checked,
      PedirCantidadAlAgregarProducto: form.PedirCantidadAlAgregarProducto.checked,
      AplicarImpuestosEnVentas: this.getFormCheckboxValue(form, "AplicarImpuestosEnVentas"),
      DescuentoMaximoPermitido: Number(form.DescuentoMaximoPermitido.value || 0),
      RedondeoTotal: form.RedondeoTotal.value || "0.05",
      PedirMotivoCerrarCaja: form.PedirMotivoCerrarCaja.checked,
      ImprimirResumenCerrarCaja: form.ImprimirResumenCerrarCaja.checked,
      MontoMinimoAperturaCaja: Number(form.MontoMinimoAperturaCaja.value || 0),
      FormatoFecha: form.FormatoFecha.value || "dd/MM/yyyy",
      FormatoHora: form.FormatoHora.value || "24",
      MostrarMensajesAyuda: form.MostrarMensajesAyuda.checked,
      EnviarEstadisticasAnonimas: Boolean(form.EnviarEstadisticasAnonimas?.checked)
    };

    setButtonLoading(submitButton, true, "Guardando...");

    try {
      const ticketPayload = this.buildConfiguracionTicketPayload(form);
      let ticketId = this.state.configuracionTicket?.Id;

      if (!ticketId) {
        this.state.configuracionTicket = await this.api.request(API_ENDPOINTS.configuracionTicketPrincipal);
        ticketId = this.state.configuracionTicket?.Id;
      }

      const requests = [];

      if (form.dataset.id) {
        requests.push(this.api.request(`${API_ENDPOINTS.configuracionesNegocio}/${form.dataset.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        }));
      } else {
        requests.push(this.api.request(API_ENDPOINTS.configuracionesNegocio, {
          method: "POST",
          body: JSON.stringify(payload)
        }));
      }

      if (ticketId) {
        requests.push(this.api.request(`${API_ENDPOINTS.configuracionesTicket}/${ticketId}`, {
          method: "PUT",
          body: JSON.stringify(ticketPayload)
        }));
      }

      const defaultTaxRequest = this.updateSelectedDefaultTaxRequest();
      if (defaultTaxRequest) {
        requests.push(defaultTaxRequest);
      }

      await Promise.all(requests);

      this.toast("Configuración guardada.", "success");
      await Promise.all([this.loadConfiguracion(), this.loadDashboard()]);
      this.renderConfiguracionView();
      this.applyVisualPreferences();
      this.updateTopbarMeta();
      this.renderDashboard();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Guardar cambios");
    }
  },

  validateConfiguracionForm(form) {
    const nombreNegocio = form.NombreNegocio.value.trim();
    const email = form.Email.value.trim();
    const hoursValidation = this.validateBusinessHours();
    const descuentoMaximo = Number(form.DescuentoMaximoPermitido.value);
    const montoMinimoCaja = Number(form.MontoMinimoAperturaCaja.value);

    if (!nombreNegocio) {
      form.NombreNegocio.focus();
      return "Ingresa el nombre del negocio antes de guardar.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.Email.focus();
      return "Ingresa un email válido.";
    }

    if (hoursValidation) {
      return hoursValidation;
    }

    if (!Number.isFinite(descuentoMaximo)) {
      form.DescuentoMaximoPermitido.focus();
      return "Ingresa un descuento máximo válido.";
    }

    if (descuentoMaximo < 0 || descuentoMaximo > 100) {
      form.DescuentoMaximoPermitido.focus();
      return "El descuento máximo debe estar entre 0% y 100%.";
    }

    if (!Number.isFinite(montoMinimoCaja) || montoMinimoCaja < 0) {
      form.MontoMinimoAperturaCaja.focus();
      return "El monto mínimo para apertura de caja no puede ser negativo.";
    }

    if (!this.syncTicketWidthControls()) {
      return "El ancho personalizado del ticket debe estar entre 40 y 120 mm.";
    }

    return "";
  },

  validateBusinessHours() {
    const hours = this.businessHours || [];
    for (const day of hours) {
      if (!day.open) continue;

      for (const range of day.ranges) {
        if (!range.from || !range.to) {
          return `Completa todos los horarios de ${day.label} o marca el día como cerrado.`;
        }

        if (range.from >= range.to) {
          return `En ${day.label}, la hora de cierre debe ser posterior a la de apertura.`;
        }
      }

      const sortedRanges = day.ranges
        .filter(range => range.from && range.to)
        .map(range => ({ from: range.from, to: range.to }))
        .sort((a, b) => a.from.localeCompare(b.from));

      for (let index = 1; index < sortedRanges.length; index += 1) {
        const previous = sortedRanges[index - 1];
        const current = sortedRanges[index];
        if (current.from < previous.to) {
          return `En ${day.label}, hay horarios superpuestos. Ajusta ${previous.from}-${previous.to} y ${current.from}-${current.to}.`;
        }
      }
    }

    return "";
  }
};
