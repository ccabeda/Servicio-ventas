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
    this.els.newUsuarioButton.classList.remove("hidden");
    this.els.usuariosTableBody.innerHTML = usuarios.length
      ? usuarios.map(usuario => `
        <tr>
          <td data-label="Usuario">${escapeHtml(usuario.NombreUsuario)}</td>
          <td data-label="Rol">${formatRol(usuario.Rol)}</td>
          <td data-label="Activo">${usuario.Activo ? "Sí" : "No"}</td>
          <td data-label="Cambio de clave">${usuario.DebeCambiarPassword ? "Sí" : "No"}</td>
          <td data-label="Creación">${formatDateTime(usuario.FechaCreacion)}</td>
          <td data-label="Acciones" class="actions-cell">
            <button class="btn btn-secondary" type="button" data-action="edit-usuario" data-id="${usuario.Id}">Editar</button>
            <button class="btn btn-danger" type="button" data-action="delete-usuario" data-id="${usuario.Id}">Eliminar</button>
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
      preferencias: {
        title: "Preferencias",
        description: "Personaliza el comportamiento general del sistema segun las necesidades de tu negocio."
      }
    };
    const selected = meta[section] ? section : "negocio";
    this.currentSettingsSection = selected;
    this.els.appShell?.classList.remove("settings-negocio", "settings-ticket", "settings-preferencias");
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
          ImprimirFechaHora: form.ImprimirFechaHoraTicket?.checked !== false,
          ImprimirCajero: form.ImprimirCajeroTicket?.checked !== false,
          ImprimirNumero: form.ImprimirNumeroTicket?.checked !== false
        })
      });
      this.toast("Ticket de prueba enviado a la impresora.", "success");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(button, false, "Probar impresión");
    }
  },

  updateTicketPreview(form) {
    const businessElement = document.getElementById("ticketPreviewBusiness");
    const messageElement = document.getElementById("ticketPreviewMessage");
    const fechaElement = document.querySelector('[data-ticket-preview-option="fecha"] strong');
    const previewOptions = {
      "datos-negocio": form.ImprimirDatosNegocioTicket?.checked !== false,
      fecha: form.ImprimirFechaHoraTicket?.checked !== false,
      cajero: form.ImprimirCajeroTicket?.checked !== false,
      numero: form.ImprimirNumeroTicket?.checked !== false,
      medio: form.ImprimirMedioPagoTicket?.checked !== false,
      subtotal: form.ImprimirSubtotalTotalTicket?.checked !== false,
      total: form.ImprimirSubtotalTotalTicket?.checked !== false,
      "descuento-recargo": form.ImprimirDescuentoRecargoTicket?.checked !== false,
      cliente: form.ImprimirClienteTicket?.checked !== false,
      mensaje: form.ImprimirMensajeCierreTicket?.checked !== false
    };
    if (businessElement) {
      businessElement.textContent = form.NombreNegocio?.value.trim() || "CajaGo";
    }
    if (messageElement) {
      messageElement.textContent = form.MensajeTicket?.value.trim() || "Gracias por tu compra.";
    }
    if (fechaElement) {
      fechaElement.textContent = previewOptions.fecha ? formatDateTime(new Date()) : "";
    }
    const businessDataVisible = form.ImprimirDatosNegocioTicket?.checked !== false;
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
      document.querySelector(`[data-ticket-preview-option="${key}"]`)?.classList.toggle("hidden", !visible);
    });
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
