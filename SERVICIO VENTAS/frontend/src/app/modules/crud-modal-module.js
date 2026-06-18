import { API_ENDPOINTS, ROLES } from "../../config.js";
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
      this.toast("No tienes permisos para realizar esta acción.", "error");
      return;
    }

    const context = this.buildModalContext(entity, id);

    this.els.modalEyebrow.textContent = context.eyebrow;
    this.els.modalTitle.textContent = context.title;
    this.els.modalForm.noValidate = true;
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
    this.enhanceCustomSelects?.(this.els.modalForm);
  },

  closeModal() {
    if (this.passwordChangeRequired) {
      return;
    }

    if (this.pendingQuantityResolve) {
      const resolve = this.pendingQuantityResolve;
      this.pendingQuantityResolve = null;
      resolve(null);
    }
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.noValidate = false;
    this.els.modalForm.innerHTML = "";
    this.els.modalCloseButton.classList.remove("hidden");
    this.els.modalRoot.querySelector(".modal-card")?.classList.remove("marcas-manager-modal", "stock-modal");
    this.els.modalRoot.classList.add("hidden");
    this.productoDraft = null;
  },

  buildModalContext(entity, id) {
    const isEdit = Boolean(id);

    if (entity === "producto") {
      const producto = id
        ? this.state.productos.find(item => item.Id === id)
        : this.productoDraft || null;
      const categoriaOptions = [
        { value: "", label: "Sin categoría" },
        ...this.state.categoriasProducto.map(categoria => ({ value: categoria.Id, label: categoria.Nombre }))
      ];
      const marcaOptions = [
        { value: "", label: "Sin marca" },
        ...this.state.marcasProducto
          .filter(marca => marca.Activa || producto?.MarcaId === marca.Id)
          .map(marca => ({ value: marca.Id, label: marca.Nombre }))
      ];
      return {
        eyebrow: "Inventario",
        title: isEdit ? "Editar producto" : this.productoDraft ? "Duplicar producto" : "Nuevo producto",
        submitLabel: "Guardar producto",
        endpoint: isEdit ? `${API_ENDPOINTS.productos}/${id}` : API_ENDPOINTS.productos,
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", producto?.Nombre, true)}
            ${fieldHtml("Código de barra", "CodigoBarra", producto?.CodigoBarra)}
            ${fieldHtml("Código interno", "CodigoInterno", producto?.CodigoInterno)}
            ${selectHtml("Categoría", "CategoriaId", categoriaOptions, producto?.CategoriaId ?? "")}
            ${selectHtml("Marca", "MarcaId", marcaOptions, producto?.MarcaId ?? "")}
            ${fieldHtml("Precio", "Precio", producto?.Precio ?? 0, true, "number", "0.01")}
            ${fieldHtml("Costo", "Costo", producto?.Costo ?? 0, true, "number", "0.01")}
            ${!isEdit ? fieldHtml("Stock inicial", "Stock", producto?.Stock ?? 0, true, "number", "1") : ""}
            ${checkboxHtml("Activo", "Activo", producto ? producto.Activo : true)}
          </div>
        `,
        payload: form => {
          const payload = {
            Nombre: String(form.get("Nombre") || "").trim(),
            CodigoBarra: normalizeOptional(form.get("CodigoBarra")),
            CodigoInterno: normalizeOptional(form.get("CodigoInterno")),
            CategoriaId: form.get("CategoriaId") ? Number(form.get("CategoriaId")) : null,
            MarcaId: form.get("MarcaId") ? Number(form.get("MarcaId")) : null,
            Precio: Number(form.get("Precio") || 0),
            Costo: Number(form.get("Costo") || 0),
            Activo: form.get("Activo") === "on"
          };

          if (!isEdit) {
            payload.Stock = Number(form.get("Stock") || 0);
            if (!Number.isInteger(payload.Stock) || payload.Stock < 0) {
              throw new Error("El stock inicial debe ser un número entero mayor o igual a cero.");
            }
          }

          return payload;
        },
        refresh: async () => {
          await this.loadProductos();
          this.renderProductosTable();
          this.renderProductosVenta();
          this.renderDashboardStockAlerts();
        }
      };
    }

    if (entity === "categoriaProducto") {
      const categoria = this.state.categoriasProducto.find(item => item.Id === id);
      const iconOptions = [
        { value: "more", label: "Otros" },
        { value: "bottle", label: "Bebidas" },
        { value: "basket", label: "Almacén" },
        { value: "milk", label: "Lácteos" },
        { value: "cleaner", label: "Limpieza" },
        { value: "bread", label: "Panadería" },
        { value: "candy", label: "Golosinas" }
      ];
      return {
        eyebrow: "Inventario",
        title: isEdit ? "Editar categoría" : "Nueva categoría",
        submitLabel: "Guardar categoría",
        endpoint: isEdit ? `${API_ENDPOINTS.categoriasProducto}/${id}` : API_ENDPOINTS.categoriasProducto,
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", categoria?.Nombre, true)}
            ${selectHtml("Ícono", "Icono", iconOptions, categoria?.Icono || "more")}
            <div class="field color-field">
              <span>Color</span>
              <input name="Color" type="color" aria-label="Color de categoría" value="${categoria?.Color || "#ef0000"}">
            </div>
          </div>
        `,
        payload: form => ({
          Nombre: String(form.get("Nombre") || "").trim(),
          Icono: normalizeOptional(form.get("Icono")),
          Color: normalizeOptional(form.get("Color"))
        }),
        refresh: async () => {
          await this.loadCategoriasProducto();
          this.renderProductosTable();
        }
      };
    }

    if (entity === "marcaProducto") {
      const marca = this.state.marcasProducto.find(item => item.Id === id);
      return {
        eyebrow: "Inventario",
        title: isEdit ? "Editar marca" : "Nueva marca",
        submitLabel: "Guardar marca",
        endpoint: isEdit ? `${API_ENDPOINTS.marcasProducto}/${id}` : API_ENDPOINTS.marcasProducto,
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", marca?.Nombre, true)}
            ${checkboxHtml("Activa", "Activa", marca ? marca.Activa : true)}
          </div>
        `,
        payload: form => ({
          Nombre: String(form.get("Nombre") || "").trim(),
          Activa: form.get("Activa") === "on"
        }),
        refresh: async () => {
          await this.loadMarcasProducto();
          this.renderProductosTable();
        }
      };
    }

    if (entity === "cliente") {
      const cliente = this.state.clientes.find(item => item.Id === id);
      return {
        eyebrow: "Clientes",
        title: isEdit ? "Editar cliente" : "Nuevo cliente",
        submitLabel: "Guardar cliente",
        endpoint: isEdit ? `${API_ENDPOINTS.clientes}/${id}` : API_ENDPOINTS.clientes,
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre", "Nombre", cliente?.Nombre, true)}
            ${fieldHtml("Teléfono", "Telefono", cliente?.Telefono)}
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
          await this.renderClientesTable();
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
        endpoint: isEdit ? `${API_ENDPOINTS.usuarios}/${id}` : API_ENDPOINTS.usuarios,
        method: isEdit ? "PUT" : "POST",
        fieldsHtml: `
          <div class="modal-grid-2">
            ${fieldHtml("Nombre de usuario", "NombreUsuario", usuario?.NombreUsuario, true)}
            ${isEdit ? fieldHtml("Nueva contraseña", "Password", "", false, "password") : `
              <div class="password-required-panel">
                <strong>Contraseña inicial: 1234</strong>
                <p>El usuario deberá cambiarla al ingresar por primera vez.</p>
              </div>
            `}
            ${selectHtml("Rol", "Rol", ROLES, usuario?.Rol ?? 2, true)}
            ${checkboxHtml("Activo", "Activo", usuario ? usuario.Activo : true)}
            ${isEdit ? checkboxHtml("Debe cambiar contraseña", "DebeCambiarPassword", usuario ? usuario.DebeCambiarPassword : false) : ""}
          </div>
        `,
        payload: form => ({
          NombreUsuario: String(form.get("NombreUsuario") || "").trim(),
          Password: normalizeOptional(form.get("Password")),
          Rol: Number(form.get("Rol") || 2),
          Activo: form.get("Activo") === "on",
          DebeCambiarPassword: isEdit ? form.get("DebeCambiarPassword") === "on" : true
        }),
        refresh: async () => {
          await this.loadUsuarios();
          await this.renderUsuariosTable();
        }
      };
    }

    if (entity === "medioPago") {
      const medio = this.state.mediosPago.find(item => item.Id === id);
      return {
        eyebrow: "Cobro",
        title: isEdit ? "Editar medio de pago" : "Nuevo medio de pago",
        submitLabel: "Guardar medio",
        endpoint: isEdit ? `${API_ENDPOINTS.mediosPago}/${id}` : API_ENDPOINTS.mediosPago,
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
          await this.renderMediosPagoTable();
          this.renderVentaSelectors();
        }
      };
    }

    throw new Error("Tipo de entidad no soportado.");
  },

  async submitModalForm(context, formData) {
    const submitButton = this.els.modalForm.querySelector("button[type='submit']");
    const missingFields = this.getMissingModalFields();
    if (missingFields.length) {
      this.toast(`Completá ${missingFields.join(" y ")}.`, "error");
      return;
    }

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

  getMissingModalFields() {
    return Array.from(this.els.modalForm.querySelectorAll("input[required], select[required], textarea[required]"))
      .filter(control => !String(control.value || "").trim())
      .map(control => control.closest(".field")?.querySelector("span")?.textContent?.trim() || control.name)
      .filter(Boolean);
  },

  async deleteEntity(entity, id) {
    if (!this.canManageEntity(entity)) {
      this.toast("No tienes permisos para realizar esta acción.", "error");
      return;
    }

    const labels = {
      producto: "producto",
      categoriaProducto: "categoría",
      marcaProducto: "marca",
      cliente: "cliente",
      usuario: "usuario",
      medioPago: "medio de pago"
    };

    const confirmed = await this.requestConfirmation({
      eyebrow: "Eliminar",
      title: `Eliminar ${labels[entity]}`,
      message: entity === "categoriaProducto"
        ? "Se eliminará la categoría y los productos asociados quedarán sin categoría."
        : `Se desactivará el ${labels[entity]} y dejará de aparecer en los listados operativos.`,
      confirmLabel: "Eliminar"
    });

    if (!confirmed) {
      return;
    }

    const endpoints = {
      producto: `${API_ENDPOINTS.productos}/${id}`,
      categoriaProducto: `${API_ENDPOINTS.categoriasProducto}/${id}`,
      marcaProducto: `${API_ENDPOINTS.marcasProducto}/${id}`,
      cliente: `${API_ENDPOINTS.clientes}/${id}`,
      usuario: `${API_ENDPOINTS.usuarios}/${id}`,
      medioPago: `${API_ENDPOINTS.mediosPago}/${id}`
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
        categoriaProducto: async () => {
          if (String(this.els.productosCategoriaFilter.value) === String(id)) {
            this.els.productosCategoriaFilter.value = "";
          }
          await Promise.all([this.loadCategoriasProducto(), this.loadProductos()]);
          this.renderProductosTable();
          this.renderProductosVenta();
        },
        marcaProducto: async () => {
          if (String(this.els.productosMarcaFilter.value) === String(id)) {
            this.els.productosMarcaFilter.value = "";
          }
          await Promise.all([this.loadMarcasProducto(), this.loadProductos()]);
          this.renderProductosTable();
          this.renderProductosVenta();
        },
        cliente: async () => {
          await this.loadClientes();
          await this.renderClientesTable();
          this.renderVentaSelectors();
        },
        usuario: async () => {
          await this.loadUsuarios();
          await this.renderUsuariosTable();
        },
        medioPago: async () => {
          await this.loadMediosPago();
          await this.renderMediosPagoTable();
          this.renderVentaSelectors();
        }
      };

      await refreshMap[entity]();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    }
  }
};
