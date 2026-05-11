import { removeKey, saveJson, saveString } from "../../utils/storage.js";
import { setButtonLoading } from "../../utils/ui.js";

export const authDataMethods = {
  async handleLogin(event) {
    event.preventDefault();
    const payload = {
      NombreUsuario: this.els.loginUser.value.trim(),
      Password: this.els.loginPassword.value
    };

    if (!payload.NombreUsuario || !payload.Password) {
      this.toast("Completa usuario y contrasena.", "error");
      return;
    }

    setButtonLoading(this.els.loginButton, true, "Ingresando...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "No se pudo iniciar sesion.");
      }

      this.state.token = data.Token;
      this.state.session = {
        UsuarioId: data.UsuarioId,
        NombreUsuario: data.NombreUsuario,
        Rol: data.Rol
      };

      saveString(this.STORAGE_KEYS.token, this.state.token);
      saveJson(this.STORAGE_KEYS.session, this.state.session);

      this.syncAuthView();
      this.toast(`Sesion iniciada como ${data.NombreUsuario}.`, "success");
      await this.initializeApp();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(this.els.loginButton, false, "Ingresar");
    }
  },

  logout(showMessage = true) {
    this.setAppLoading(false);
    this.state.token = "";
    this.state.session = null;
    this.state.cart = [];

    removeKey(this.STORAGE_KEYS.token);
    removeKey(this.STORAGE_KEYS.session);
    this.syncAuthView();

    this.els.loginPassword.value = "";
    this.els.loginUser.focus();

    if (showMessage) {
      this.toast("Sesion cerrada.", "info");
    }
  },

  async loadDashboard() {
    const today = new Date();
    const fechaDesde = this.toApiDateTime(this.startOfDay(today));
    const fechaHasta = this.toApiDateTime(this.endOfDay(today));
    this.state.reportes.resumen = await this.api.request(`/api/reportes/resumen-ventas?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  },

  async loadProductos() {
    this.state.productos = await this.api.request("/api/productos");
  },

  async loadClientes() {
    this.state.clientes = await this.api.request("/api/clientes");
  },

  async loadUsuarios() {
    if (!this.isAdmin()) {
      this.state.usuarios = [];
      return;
    }

    this.state.usuarios = await this.api.request("/api/usuarios");
  },

  async loadMediosPago() {
    this.state.mediosPago = await this.api.request("/api/mediospago");
  },

  async loadVentas() {
    this.state.ventas = await this.api.request("/api/ventas");
  },

  async loadCaja() {
    this.state.cajaActual = await this.api.request("/api/cajas/actual");
    this.state.movimientosCaja = this.state.cajaActual?.Id
      ? await this.api.request(`/api/cajas/${this.state.cajaActual.Id}/movimientos`)
      : [];

    if (this.state.cajaActual?.Abierta) {
      this.state.lastClosedCaja = null;
    }
  },

  async loadHistorialCajas() {
    this.state.historialCajas = await this.api.request("/api/cajas");
  },

  async loadConfiguracion() {
    this.state.configuraciones = await this.api.request("/api/configuracionesnegocio");
  },

  async loadReportes() {
    const query = this.buildReportQuery();
    const [resumen, ventas, topProductos] = await Promise.all([
      this.api.request(`/api/reportes/resumen-ventas${query}`),
      this.api.request(`/api/reportes/ventas${query}`),
      this.api.request(`/api/reportes/productos-mas-vendidos${query}${query ? "&" : "?"}top=8`)
    ]);

    this.state.reportes = { resumen, ventas, topProductos };
  }
};
