import { formatDateTime, formatMoney, formatRol } from "../../utils/formatters.js";
import { escapeHtml, normalizeOptional } from "../../utils/html.js";
import { rowEmpty, setButtonLoading } from "../../utils/ui.js";

export const peopleSettingsMethods = {
  renderClientesTable() {
    const canManageClientes = this.canManageEntity("cliente");
    this.els.clientesTableBody.innerHTML = this.state.clientes.length
      ? this.state.clientes.map(cliente => `
        <tr>
          <td>${escapeHtml(cliente.Nombre)}</td>
          <td>${escapeHtml(cliente.Telefono || "-")}</td>
          <td>${formatMoney(cliente.Deuda)}</td>
          <td>${cliente.Activo ? "Activo" : "Inactivo"}</td>
          <td class="actions-cell">${canManageClientes
            ? `
              <button class="btn btn-secondary" type="button" data-action="edit-cliente" data-id="${cliente.Id}">Editar</button>
              <button class="btn btn-danger" type="button" data-action="delete-cliente" data-id="${cliente.Id}">Eliminar</button>
            `
            : `<span class="muted">Solo lectura</span>`}
          </td>
        </tr>
      `).join("")
      : rowEmpty("No hay clientes cargados.", 5);

    this.els.newClienteButton.classList.toggle("hidden", !canManageClientes);

    if (canManageClientes) {
      this.bindCrudTableActions("cliente");
    }
  },

  renderUsuariosTable() {
    if (!this.isAdmin()) {
      this.els.newUsuarioButton.classList.add("hidden");
      this.els.usuariosTableBody.innerHTML = rowEmpty("No tienes permisos para gestionar usuarios.", 6);
      return;
    }

    this.els.newUsuarioButton.classList.remove("hidden");
    this.els.usuariosTableBody.innerHTML = this.state.usuarios.length
      ? this.state.usuarios.map(usuario => `
        <tr>
          <td>${escapeHtml(usuario.NombreUsuario)}</td>
          <td>${formatRol(usuario.Rol)}</td>
          <td>${usuario.Activo ? "Si" : "No"}</td>
          <td>${usuario.DebeCambiarPassword ? "Si" : "No"}</td>
          <td>${formatDateTime(usuario.FechaCreacion)}</td>
          <td class="actions-cell">
            <button class="btn btn-secondary" type="button" data-action="edit-usuario" data-id="${usuario.Id}">Editar</button>
            <button class="btn btn-danger" type="button" data-action="delete-usuario" data-id="${usuario.Id}">Eliminar</button>
          </td>
        </tr>
      `).join("")
      : rowEmpty("No hay usuarios cargados.", 6);

    this.bindCrudTableActions("usuario");
  },

  renderMediosPagoTable() {
    const canManageMediosPago = this.canManageEntity("medioPago");
    this.els.mediosPagoTableBody.innerHTML = this.state.mediosPago.length
      ? this.state.mediosPago.map(medio => `
        <tr>
          <td>${escapeHtml(medio.Nombre)}</td>
          <td>${medio.Activo ? "Activo" : "Inactivo"}</td>
          <td class="actions-cell">${canManageMediosPago
            ? `
              <button class="btn btn-secondary" type="button" data-action="edit-medioPago" data-id="${medio.Id}">Editar</button>
              <button class="btn btn-danger" type="button" data-action="delete-medioPago" data-id="${medio.Id}">Eliminar</button>
            `
            : `<span class="muted">Solo lectura</span>`}
          </td>
        </tr>
      `).join("")
      : rowEmpty("No hay medios de pago cargados.", 3);

    this.els.newMedioPagoButton.classList.toggle("hidden", !canManageMediosPago);

    if (canManageMediosPago) {
      this.bindCrudTableActions("medioPago");
    }
  },

  renderConfiguracionView() {
    const configuracion = this.state.configuraciones[0];
    if (!configuracion) {
      this.els.configuracionForm.reset();
      this.els.configuracionForm.dataset.id = "";
      return;
    }

    this.els.configuracionForm.dataset.id = configuracion.Id;
    this.els.configuracionForm.NombreNegocio.value = configuracion.NombreNegocio || "";
    this.els.configuracionForm.Telefono.value = configuracion.Telefono || "";
    this.els.configuracionForm.Direccion.value = configuracion.Direccion || "";
    this.els.configuracionForm.LogoUrl.value = configuracion.LogoUrl || "";
    this.els.configuracionForm.ImpresoraTicket.value = configuracion.ImpresoraTicket || "";
    this.els.configuracionForm.MensajeTicket.value = configuracion.MensajeTicket || "";
    this.els.configuracionForm.UsaTicketTermico.checked = Boolean(configuracion.UsaTicketTermico);
  },

  async handleConfiguracion(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector("button[type='submit']");
    const payload = {
      NombreNegocio: form.NombreNegocio.value.trim(),
      Telefono: normalizeOptional(form.Telefono.value),
      Direccion: normalizeOptional(form.Direccion.value),
      LogoUrl: normalizeOptional(form.LogoUrl.value),
      ImpresoraTicket: normalizeOptional(form.ImpresoraTicket.value),
      MensajeTicket: normalizeOptional(form.MensajeTicket.value),
      UsaTicketTermico: form.UsaTicketTermico.checked
    };

    setButtonLoading(submitButton, true, "Guardando...");

    try {
      if (form.dataset.id) {
        await this.api.request(`/api/configuracionesnegocio/${form.dataset.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await this.api.request("/api/configuracionesnegocio", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      this.toast("Configuracion guardada.", "success");
      await Promise.all([this.loadConfiguracion(), this.loadDashboard()]);
      this.renderConfiguracionView();
      this.renderDashboard();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Guardar configuracion");
    }
  }
};
