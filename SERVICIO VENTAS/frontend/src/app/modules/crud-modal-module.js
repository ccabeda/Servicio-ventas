import { ROLES } from "../../config.js";
import { normalizeOptional } from "../../utils/html.js";
import { checkboxHtml, fieldHtml, selectHtml, setButtonLoading } from "../../utils/ui.js";

export const crudModalMethods = {
  bindCrudTableActions(entity) {
    document.querySelectorAll(`[data-action='edit-${entity}']`).forEach(button => {
      button.addEventListener("click", () => this.openEntityModal(entity, Number(button.dataset.id)));
    });

    document.querySelectorAll(`[data-action='delete-${entity}']`).forEach(button => {
      button.addEventListener("click", () => this.deleteEntity(entity, Number(button.dataset.id)));
    });
  },

  openEntityModal(entity, id = null) {
    if (!this.canManageEntity(entity)) {
      this.toast("No tienes permisos para realizar esta accion.", "error");
      return;
    }

    const context = this.buildModalContext(entity, id);

    this.els.modalEyebrow.textContent = context.eyebrow;
    this.els.modalTitle.textContent = context.title;
    this.els.modalForm.innerHTML = `
      ${context.fieldsHtml}
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" type="submit">${context.submitLabel}</button>
      </div>
    `;

    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      await this.submitModalForm(context, new FormData(this.els.modalForm));
    };

    this.els.modalRoot.classList.remove("hidden");
  },

  closeModal() {
    this.els.modalForm.innerHTML = "";
    this.els.modalRoot.classList.add("hidden");
  },

  buildModalContext(entity, id) {
    const isEdit = Boolean(id);

    if (entity === "producto") {
      const producto = this.state.productos.find(item => item.Id === id);
      return {
        eyebrow: "Inventario",
        title: isEdit ? "Editar producto" : "Nuevo producto",
        submitLabel: "Guardar producto",
        endpoint: isEdit ? `/api/productos/${id}` : "/api/productos",
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", producto?.Nombre, true)}
            ${fieldHtml("Codigo de barra", "CodigoBarra", producto?.CodigoBarra)}
            ${fieldHtml("Codigo interno", "CodigoInterno", producto?.CodigoInterno)}
            ${fieldHtml("Precio", "Precio", producto?.Precio ?? 0, true, "number", "0.01")}
            ${fieldHtml("Costo", "Costo", producto?.Costo ?? 0, true, "number", "0.01")}
            ${fieldHtml("Stock", "Stock", producto?.Stock ?? 0, true, "number", "0.01")}
            ${checkboxHtml("Activo", "Activo", producto ? producto.Activo : true)}
          </div>
        `,
        payload: form => ({
          Nombre: String(form.get("Nombre") || "").trim(),
          CodigoBarra: normalizeOptional(form.get("CodigoBarra")),
          CodigoInterno: normalizeOptional(form.get("CodigoInterno")),
          Precio: Number(form.get("Precio") || 0),
          Costo: Number(form.get("Costo") || 0),
          Stock: Number(form.get("Stock") || 0),
          Activo: form.get("Activo") === "on"
        }),
        refresh: async () => {
          await this.loadProductos();
          this.renderProductosTable();
          this.renderProductosVenta();
          this.renderDashboardStockAlerts();
        }
      };
    }

    if (entity === "cliente") {
      const cliente = this.state.clientes.find(item => item.Id === id);
      return {
        eyebrow: "Clientes",
        title: isEdit ? "Editar cliente" : "Nuevo cliente",
        submitLabel: "Guardar cliente",
        endpoint: isEdit ? `/api/clientes/${id}` : "/api/clientes",
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", cliente?.Nombre, true)}
            ${fieldHtml("Telefono", "Telefono", cliente?.Telefono)}
            ${fieldHtml("Deuda", "Deuda", cliente?.Deuda ?? 0, true, "number", "0.01")}
            ${checkboxHtml("Activo", "Activo", cliente ? cliente.Activo : true)}
          </div>
        `,
        payload: form => ({
          Nombre: String(form.get("Nombre") || "").trim(),
          Telefono: normalizeOptional(form.get("Telefono")),
          Deuda: Number(form.get("Deuda") || 0),
          Activo: form.get("Activo") === "on"
        }),
        refresh: async () => {
          await this.loadClientes();
          this.renderClientesTable();
          this.renderVentaSelectors();
        }
      };
    }

    if (entity === "usuario") {
      const usuario = this.state.usuarios.find(item => item.Id === id);
      return {
        eyebrow: "Seguridad",
        title: isEdit ? "Editar usuario" : "Nuevo usuario",
        submitLabel: "Guardar usuario",
        endpoint: isEdit ? `/api/usuarios/${id}` : "/api/usuarios",
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre de usuario", "NombreUsuario", usuario?.NombreUsuario, true)}
            ${fieldHtml(isEdit ? "Nueva contrasena" : "Contrasena", "Password", "", !isEdit, "password")}
            ${selectHtml("Rol", "Rol", ROLES, usuario?.Rol ?? 2, true)}
            ${checkboxHtml("Activo", "Activo", usuario ? usuario.Activo : true)}
            ${checkboxHtml("Debe cambiar password", "DebeCambiarPassword", usuario ? usuario.DebeCambiarPassword : true)}
          </div>
        `,
        payload: form => ({
          NombreUsuario: String(form.get("NombreUsuario") || "").trim(),
          Password: normalizeOptional(form.get("Password")),
          Rol: Number(form.get("Rol") || 2),
          Activo: form.get("Activo") === "on",
          DebeCambiarPassword: form.get("DebeCambiarPassword") === "on"
        }),
        refresh: async () => {
          await this.loadUsuarios();
          this.renderUsuariosTable();
        }
      };
    }

    if (entity === "medioPago") {
      const medio = this.state.mediosPago.find(item => item.Id === id);
      return {
        eyebrow: "Cobro",
        title: isEdit ? "Editar medio de pago" : "Nuevo medio de pago",
        submitLabel: "Guardar medio",
        endpoint: isEdit ? `/api/mediospago/${id}` : "/api/mediospago",
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", medio?.Nombre, true)}
            ${checkboxHtml("Activo", "Activo", medio ? medio.Activo : true)}
          </div>
        `,
        payload: form => ({
          Nombre: String(form.get("Nombre") || "").trim(),
          Activo: form.get("Activo") === "on"
        }),
        refresh: async () => {
          await this.loadMediosPago();
          this.renderMediosPagoTable();
          this.renderVentaSelectors();
        }
      };
    }

    throw new Error("Tipo de entidad no soportado.");
  },

  async submitModalForm(context, formData) {
    const submitButton = this.els.modalForm.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, "Guardando...");

    try {
      await this.api.request(context.endpoint, {
        method: context.method,
        body: JSON.stringify(context.payload(formData))
      });

      this.toast("Registro guardado correctamente.", "success");
      this.closeModal();
      await context.refresh();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, context.submitLabel);
    }
  },

  async deleteEntity(entity, id) {
    if (!this.canManageEntity(entity)) {
      this.toast("No tienes permisos para realizar esta accion.", "error");
      return;
    }

    const labels = {
      producto: "producto",
      cliente: "cliente",
      usuario: "usuario",
      medioPago: "medio de pago"
    };

    const confirmed = await this.requestConfirmation({
      eyebrow: "Eliminar",
      title: `Eliminar ${labels[entity]}`,
      message: `Se desactivara el ${labels[entity]} y dejara de aparecer en los listados operativos.`,
      confirmLabel: "Eliminar"
    });

    if (!confirmed) {
      return;
    }

    const endpoints = {
      producto: `/api/productos/${id}`,
      cliente: `/api/clientes/${id}`,
      usuario: `/api/usuarios/${id}`,
      medioPago: `/api/mediospago/${id}`
    };

    try {
      await this.api.request(endpoints[entity], { method: "DELETE" });
      this.toast("Registro eliminado.", "success");

      const refreshMap = {
        producto: async () => {
          await this.loadProductos();
          this.renderProductosTable();
          this.renderProductosVenta();
          this.renderDashboardStockAlerts();
        },
        cliente: async () => {
          await this.loadClientes();
          this.renderClientesTable();
          this.renderVentaSelectors();
        },
        usuario: async () => {
          await this.loadUsuarios();
          this.renderUsuariosTable();
        },
        medioPago: async () => {
          await this.loadMediosPago();
          this.renderMediosPagoTable();
          this.renderVentaSelectors();
        }
      };

      await refreshMap[entity]();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    }
  }
};
