import { API_ENDPOINTS } from "../../config.js";
import { removeKey, saveJson, saveString } from "../../utils/storage.js";
import { setDateFormatPreferences } from "../../utils/formatters.js";
import { setButtonLoading } from "../../utils/ui.js";

export const authDataMethods = {
  async handleLogin(event) {
    event.preventDefault();
    const payload = {
      NombreUsuario: this.els.loginUser.value.trim(),
      Password: this.els.loginPassword.value
    };

    if (!payload.NombreUsuario || !payload.Password) {
      this.toast("Completa usuario y contraseña.", "error");
      return;
    }

    setButtonLoading(this.els.loginButton, true, "Ingresando...");

    try {
      const response = await fetch(API_ENDPOINTS.authLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(this.api.extractErrorMessage(data) || "No se pudo iniciar sesión.");
      }

      this.state.token = data.Token;
      this.state.session = {
        UsuarioId: data.UsuarioId,
        NombreUsuario: data.NombreUsuario,
        Rol: data.Rol,
        DebeCambiarPassword: Boolean(data.DebeCambiarPassword),
        Permisos: data.Permisos || []
      };

      saveString(this.STORAGE_KEYS.token, this.state.token);
      saveJson(this.STORAGE_KEYS.session, this.state.session);
      if (this.els.rememberUserCheckbox.checked) {
        this.state.rememberedUser = payload.NombreUsuario;
        saveString(this.STORAGE_KEYS.rememberedUser, payload.NombreUsuario);
      } else {
        this.state.rememberedUser = "";
        removeKey(this.STORAGE_KEYS.rememberedUser);
      }

      this.syncAuthView();
      this.toast(`Sesión iniciada como ${data.NombreUsuario}.`, "success");
      if (this.state.session.DebeCambiarPassword) {
        await this.openRequiredPasswordChange();
      }
      await this.initializeApp();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(this.els.loginButton, false, "Ingresar");
    }
  },

  logout(showMessage = true) {
    this.setAppLoading(false);
    this.stopClock();
    this.state.token = "";
    this.state.session = null;
    this.state.cart = [];
    this.passwordChangeRequired = false;
    this.pendingPasswordChangeResolve = null;
    this.pendingPasswordChangePromise = null;

    removeKey(this.STORAGE_KEYS.token);
    removeKey(this.STORAGE_KEYS.session);
    this.syncAuthView();

    this.els.loginPassword.value = "";
    this.restoreRememberedUser();
    this.els.loginUser.focus();

    if (showMessage) {
      this.toast("Sesión cerrada.", "info");
    }
  },

  async loadDashboard() {
    const today = new Date();
    const fechaDesde = this.toApiDateTime(this.startOfDay(today));
    const fechaHasta = this.toApiDateTime(this.endOfDay(today));
    this.state.reportes.resumen = await this.api.request(`/api/reportes/resumen-ventas?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  },

  openRequiredPasswordChange() {
    if (this.passwordChangeRequired && this.pendingPasswordChangePromise) {
      return this.pendingPasswordChangePromise;
    }

    this.passwordChangeRequired = true;
    window.history.pushState({ passwordChangeRequired: true }, "", window.location.href);
    this.els.modalEyebrow.textContent = "Seguridad";
    this.els.modalTitle.textContent = "Cambiar contraseña";
    this.els.modalCloseButton.classList.add("hidden");
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="password-required-panel">
        <strong>Primer ingreso</strong>
        <p>Por seguridad, definí una contraseña para continuar usando el sistema.</p>
      </div>
      <div class="modal-grid-2">
        <label class="field">
          <span>Nueva contraseña</span>
          <input name="NuevaPassword" type="password" autocomplete="new-password" required>
        </label>
        <label class="field">
          <span>Confirmar contraseña</span>
          <input name="ConfirmarPassword" type="password" autocomplete="new-password" required>
        </label>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="submit">Guardar contraseña</button>
      </div>
    `;

    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      await this.submitRequiredPasswordChange();
    };
    this.els.modalRoot.classList.remove("hidden");
    this.els.modalForm.querySelector("input[name='NuevaPassword']")?.focus();

    this.pendingPasswordChangePromise = new Promise(resolve => {
      this.pendingPasswordChangeResolve = resolve;
    });

    return this.pendingPasswordChangePromise;
  },

  async submitRequiredPasswordChange() {
    const formData = new FormData(this.els.modalForm);
    const nuevaPassword = String(formData.get("NuevaPassword") || "").trim();
    const confirmarPassword = String(formData.get("ConfirmarPassword") || "").trim();
    const submitButton = this.els.modalForm.querySelector("button[type='submit']");

    if (!nuevaPassword || !confirmarPassword) {
      this.toast("Completá la nueva contraseña y su confirmación.", "error");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      this.toast("Las contraseñas no coinciden.", "error");
      return;
    }

    setButtonLoading(submitButton, true, "Guardando...");

    try {
      const session = await this.api.request(API_ENDPOINTS.authCambiarPassword, {
        method: "POST",
        body: JSON.stringify({ NuevaPassword: nuevaPassword })
      });
      this.state.session = {
        UsuarioId: session.UsuarioId,
        NombreUsuario: session.NombreUsuario,
        Rol: session.Rol,
        DebeCambiarPassword: Boolean(session.DebeCambiarPassword),
        Permisos: session.Permisos || []
      };
      saveJson(this.STORAGE_KEYS.session, this.state.session);
      this.passwordChangeRequired = false;
      this.closeModal();
      this.pendingPasswordChangeResolve?.();
      this.pendingPasswordChangeResolve = null;
      this.pendingPasswordChangePromise = null;
      this.toast("Contraseña actualizada.", "success");
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(submitButton, false, "Guardar contraseña");
    }
  },

  async loadProductos() {
    this.state.productos = await this.api.request(API_ENDPOINTS.productos);
  },

  async loadProductosPage() {
    const params = new URLSearchParams({
      pageIndex: String(this.state.productosPage.PageIndex || 1),
      pageSize: "20",
      estado: this.els.productosEstadoFilter.value || "activos"
    });
    const search = this.els.productosFilterInput.value.trim();
    const categoriaId = this.els.productosCategoriaFilter.value;
    const marcaId = this.els.productosMarcaFilter.value;

    if (search) params.set("search", search);
    if (categoriaId) params.set("categoriaId", categoriaId);
    if (marcaId) params.set("marcaId", marcaId);

    this.state.productosPage = await this.api.request(`${API_ENDPOINTS.productosPaginado}?${params.toString()}`);
  },

  async loadCategoriasProducto() {
    this.state.categoriasProducto = await this.api.request(API_ENDPOINTS.categoriasProducto);
  },

  async loadMarcasProducto() {
    this.state.marcasProducto = await this.api.request(API_ENDPOINTS.marcasProducto);
  },

  async loadClientes() {
    this.state.clientes = await this.api.request(API_ENDPOINTS.clientes);
  },

  async loadClientesPage() {
    const params = new URLSearchParams({
      pageIndex: String(this.state.clientesPage.PageIndex || 1),
      pageSize: String(this.state.clientesPage.PageSize || 20),
      estado: this.els.clientesEstadoFilter?.value || "activos"
    });
    const search = this.els.clientesFilterInput?.value?.trim() || "";
    if (search) params.set("search", search);

    this.state.clientesPage = await this.api.request(`${API_ENDPOINTS.clientesPaginado}?${params.toString()}`);
  },

  async loadUsuarios() {
    if (!this.canManageEntity("usuario")) {
      this.state.usuarios = [];
      return;
    }

    this.state.usuarios = await this.api.request(API_ENDPOINTS.usuarios);
  },

  async loadUsuariosPage() {
    if (!this.canManageEntity("usuario")) {
      this.state.usuariosPage = this.createEmptyPage(this.state.usuariosPage.PageSize || 20);
      return;
    }

    const params = new URLSearchParams({
      pageIndex: String(this.state.usuariosPage.PageIndex || 1),
      pageSize: String(this.state.usuariosPage.PageSize || 20),
      estado: this.els.usuariosEstadoFilter.value || "activos"
    });
    const search = this.els.usuariosFilterInput.value.trim();
    if (search) params.set("search", search);

    this.state.usuariosPage = await this.api.request(`${API_ENDPOINTS.usuariosPaginado}?${params.toString()}`);
  },

  async loadMediosPago() {
    this.state.mediosPago = await this.api.request(API_ENDPOINTS.mediosPago);
  },

  async loadMediosPagoPage() {
    const params = new URLSearchParams({
      pageIndex: String(this.state.mediosPagoPage.PageIndex || 1),
      pageSize: String(this.state.mediosPagoPage.PageSize || 20),
      estado: this.els.mediosPagoEstadoFilter.value || "activos"
    });
    const search = this.els.mediosPagoFilterInput.value.trim();
    if (search) params.set("search", search);

    this.state.mediosPagoPage = await this.api.request(`${API_ENDPOINTS.mediosPagoPaginado}?${params.toString()}`);
  },

  async loadVentas() {
    const params = new URLSearchParams({
      pageIndex: String(this.state.ventasPage.PageIndex || 1),
      pageSize: String(this.state.ventasPage.PageSize || 8)
    });

    this.state.ventasPage = await this.api.request(`${API_ENDPOINTS.ventasPaginado}?${params.toString()}`);
    this.state.ventas = this.state.ventasPage.Items || [];
  },

  async loadCaja() {
    this.state.cajaActual = await this.api.request(API_ENDPOINTS.cajaActual);
    this.state.cajaResumen = null;
    await this.loadMovimientosCajaPage();
    if (this.state.cajaActual?.Id) {
      this.state.cajaResumen = await this.api.request(API_ENDPOINTS.cajaResumen(this.state.cajaActual.Id));
    }

    if (this.state.cajaActual?.Abierta) {
      this.state.lastClosedCaja = null;
    }
  },

  async loadMovimientosCajaPage() {
    if (!this.state.cajaActual?.Id) {
      this.state.movimientosCajaPage = this.createEmptyPage(this.state.movimientosCajaPage.PageSize || 10);
      this.state.movimientosCaja = [];
      return;
    }

    const params = new URLSearchParams({
      pageIndex: String(this.state.movimientosCajaPage.PageIndex || 1),
      pageSize: String(this.state.movimientosCajaPage.PageSize || 10)
    });

    this.state.movimientosCajaPage = await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/movimientos/paginado?${params.toString()}`);
    this.state.movimientosCaja = this.state.movimientosCajaPage.Items || [];
  },

  async loadHistorialCajas() {
    const params = new URLSearchParams({
      pageIndex: String(this.state.historialCajasPage.PageIndex || 1),
      pageSize: String(this.state.historialCajasPage.PageSize || 10)
    });

    this.state.historialCajasPage = await this.api.request(`${API_ENDPOINTS.cajasPaginado}?${params.toString()}`);
    this.state.historialCajas = this.state.historialCajasPage.Items || [];
  },

  async loadConfiguracion() {
    const [configuraciones, configuracionTicket] = await Promise.all([
      this.api.request(API_ENDPOINTS.configuracionesNegocio),
      this.api.request(API_ENDPOINTS.configuracionTicketPrincipal)
    ]);

    this.state.configuraciones = configuraciones;
    this.state.configuracionTicket = configuracionTicket;
    await this.loadImpresoras();
    await this.loadImpuestos();
    setDateFormatPreferences(this.state.configuraciones[0]);
    this.applyBrandColor(this.state.configuraciones[0]?.ColorPrincipal);
    this.applyVisualPreferences();
  },

  async loadImpuestos() {
    try {
      const [impuestos, resumen] = await Promise.all([
        this.api.request(API_ENDPOINTS.impuestos),
        this.api.request(API_ENDPOINTS.impuestosResumen)
      ]);

      this.state.impuestos = impuestos;
      this.state.impuestosResumen = resumen;
      this.state.impuestosError = "";
      await this.loadImpuestosListPage();
    } catch (error) {
      this.state.impuestos = [];
      this.state.impuestosResumen = null;
      this.state.impuestosListPage = this.createEmptyPage(5);
      this.state.impuestosError = this.getErrorMessage(error);
    }
  },

  async loadImpuestosListPage() {
    const params = new URLSearchParams({
      pageIndex: String(this.state.impuestosListPage?.PageIndex || 1),
      pageSize: String(this.state.impuestosListPage?.PageSize || 5),
      estado: this.state.impuestosEstado || "activos"
    });

    this.state.impuestosListPage = await this.api.request(`${API_ENDPOINTS.impuestosPaginado}?${params.toString()}`);
  },

  async loadImpresoras() {
    try {
      this.state.impresoras = await this.api.request(API_ENDPOINTS.impresoras);
      this.state.impresorasError = "";
    } catch (error) {
      this.state.impresoras = [];
      this.state.impresorasError = this.getErrorMessage(error);
    }
  },

  async loadReportes() {
    const query = this.buildReportQuery();
    const [resumen, ventas, topProductos] = await Promise.all([
      this.api.request(`${API_ENDPOINTS.reportesResumenVentas}${query}`),
      this.api.request(`${API_ENDPOINTS.reportesVentas}${query}`),
      this.api.request(`${API_ENDPOINTS.reportesProductosMasVendidos}${query}${query ? "&" : "?"}top=8`)
    ]);

    this.state.reportes = { resumen, ventas, topProductos };
    await this.loadReportesVentasPage(1);
  },

  async loadReportesVentasPage(pageIndex = this.state.reportesVentasPage?.PageIndex || 1) {
    const query = this.buildReportQuery();
    const separator = query ? "&" : "?";
    this.state.reportesVentasPage = await this.api.request(
      `${API_ENDPOINTS.reportesVentasPaginado}${query}${separator}pageIndex=${pageIndex}&pageSize=8`
    );
  }
};
