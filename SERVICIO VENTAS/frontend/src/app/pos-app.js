import { STORAGE_KEYS, VIEW_TITLES, MOVIMIENTO_TIPOS } from "../config.js";
import { getElements } from "../dom/elements.js";
import { ApiClient } from "../services/api-client.js";
import { renderAppShell } from "../templates/app-shell.js";
import { endOfDay, endOfLocalDate, startOfDay, startOfLocalDate, toApiDateTime } from "../utils/formatters.js";
import { loadJson, loadString, saveJson, saveString } from "../utils/storage.js";
import { setButtonLoading } from "../utils/ui.js";
import { authDataMethods } from "./modules/auth-data.js";
import { dashboardVentasMethods } from "./modules/dashboard-ventas.js";
import { managementMethods } from "./modules/management-modules.js";
import { appHelperMethods } from "./modules/app-helpers.js";

export class PosApp {
  constructor() {
    renderAppShell(document.getElementById("root"));
    this.els = getElements();
    this.STORAGE_KEYS = STORAGE_KEYS;
    this.VIEW_TITLES = VIEW_TITLES;
    this.startOfDay = startOfDay;
    this.endOfDay = endOfDay;
    this.toApiDateTime = toApiDateTime;
    this.startOfLocalDate = startOfLocalDate;
    this.endOfLocalDate = endOfLocalDate;
    this.state = {
      token: loadString(STORAGE_KEYS.token, ""),
      session: loadJson(STORAGE_KEYS.session, null),
      currentView: loadString(STORAGE_KEYS.currentView, "dashboard"),
      theme: loadString(STORAGE_KEYS.theme, "light"),
      productos: [],
      clientes: [],
      usuarios: [],
      mediosPago: [],
      ventas: [],
      movimientosCaja: [],
      historialCajas: [],
      cajaActual: null,
      lastClosedCaja: null,
      configuraciones: [],
      reportes: {
        resumen: null,
        ventas: [],
        topProductos: []
      },
      cart: [],
      reportFilters: loadJson(STORAGE_KEYS.reportFilters, { fechaDesde: "", fechaHasta: "" })
    };

    this.api = new ApiClient({
      getToken: () => this.state.token,
      onUnauthorized: () => this.logout(false)
    });
    this.pendingConfirmResolve = null;
  }

  async init() {
    this.applyTheme();
    this.bindEvents();
    this.populateStaticSelectors();
    this.syncAuthView();

    if (this.state.token) {
      await this.initializeApp();
    } else {
      this.setAppLoading(false);
      this.els.loginUser.focus();
    }
  }

  bindEvents() {
    this.els.loginForm.addEventListener("submit", event => this.handleLogin(event));
    this.els.themeToggleButtons.forEach(button => {
      button.addEventListener("click", () => this.toggleTheme());
    });
    this.els.logoutButton.addEventListener("click", () => this.logout());
    this.els.refreshButton.addEventListener("click", () => this.refreshCurrentView());
    this.els.clearCartButton.addEventListener("click", () => this.clearCart());
    this.els.confirmSaleButton.addEventListener("click", () => this.submitVenta());
    this.els.productosFilterInput.addEventListener("input", () => this.renderProductosTable());
    this.els.ventaSearchInput.addEventListener("input", () => this.renderProductosVenta());
    this.els.ventaSearchInput.addEventListener("keydown", event => this.handleVentaSearchKeydown(event));
    this.els.ventaDescuentoInput.addEventListener("input", () => this.renderCart());
    this.els.ventaRecargoInput.addEventListener("input", () => this.renderCart());
    this.els.mobileMenuButton.addEventListener("click", () => this.toggleMenu(true));
    this.els.mobileMenuClose.addEventListener("click", () => this.toggleMenu(false));
    this.els.mobileBackdrop.addEventListener("click", () => this.toggleMenu(false));
    this.els.modalCloseButton.addEventListener("click", () => this.closeModal());
    this.els.confirmCloseButton.addEventListener("click", () => this.resolveConfirmation(false));
    this.els.confirmCancelButton.addEventListener("click", () => this.resolveConfirmation(false));
    this.els.confirmActionButton.addEventListener("click", () => this.resolveConfirmation(true));
    this.els.ticketCloseButton.addEventListener("click", () => this.closeTicketModal());
    this.els.ticketDoneButton.addEventListener("click", () => this.closeTicketModal());
    this.els.printTicketButton.addEventListener("click", () => window.print());
    this.els.newProductoButton.addEventListener("click", () => this.openEntityModal("producto"));
    this.els.newClienteButton.addEventListener("click", () => this.openEntityModal("cliente"));
    this.els.newUsuarioButton.addEventListener("click", () => this.openEntityModal("usuario"));
    this.els.newMedioPagoButton.addEventListener("click", () => this.openEntityModal("medioPago"));
    this.els.presetTodayButton.addEventListener("click", () => this.applyReportPreset("today"));
    this.els.presetWeekButton.addEventListener("click", () => this.applyReportPreset("week"));
    this.els.presetMonthButton.addEventListener("click", () => this.applyReportPreset("month"));
    this.els.exportVentasCsvButton.addEventListener("click", () => this.exportVentasCsv());

    this.els.navLinks.forEach(link => {
      link.addEventListener("click", () => {
        this.setCurrentView(link.dataset.view);
        this.toggleMenu(false);
      });
    });

    document.querySelectorAll("[data-nav]").forEach(button => {
      button.addEventListener("click", () => this.setCurrentView(button.dataset.nav));
    });

    this.els.abrirCajaForm.addEventListener("submit", event => this.handleAbrirCaja(event));
    this.els.cerrarCajaForm.addEventListener("submit", event => this.handleCerrarCaja(event));
    this.els.movimientoCajaForm.addEventListener("submit", event => this.handleMovimientoCaja(event));
    this.els.configuracionForm.addEventListener("submit", event => this.handleConfiguracion(event));
    this.els.reportesFilterForm.addEventListener("submit", event => this.handleReportFilter(event));

    this.els.modalRoot.querySelector(".modal-backdrop").addEventListener("click", () => this.closeModal());
    this.els.confirmModal.querySelector(".modal-backdrop").addEventListener("click", () => this.resolveConfirmation(false));
    this.els.ticketModal.querySelector(".modal-backdrop").addEventListener("click", () => this.closeTicketModal());
  }

  populateStaticSelectors() {
    this.els.movimientoTipoSelect.innerHTML = MOVIMIENTO_TIPOS
      .filter(item => ![1, 2, 5].includes(item.value))
      .map(item => `<option value="${item.value}">${item.label}</option>`)
      .join("");
  }

  syncAuthView() {
    const authenticated = Boolean(this.state.token);
    this.els.authView.classList.toggle("hidden", authenticated);
    this.els.appView.classList.toggle("hidden", !authenticated);

    this.els.sessionUserName.textContent = this.state.session?.NombreUsuario || "-";
    this.els.sessionUserRole.textContent = this.state.session?.Rol || "-";
  }

  async initializeApp() {
    this.setAppLoading(true, "Cargando sistema");

    try {
      await this.ensureSession();
      this.applyRoleVisibility();
      this.syncAuthView();
      await this.loadBootstrapData();
      this.setCurrentView(this.state.currentView, { silentRedirect: true });
      this.setConnection(true);
    } catch (error) {
      this.setConnection(false);
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      this.setAppLoading(false);
    }
  }

  async ensureSession() {
    if (this.state.session?.UsuarioId) return;
    this.state.session = await this.api.request("/api/auth/me");
    saveJson(STORAGE_KEYS.session, this.state.session);
  }

  async loadBootstrapData() {
    const tasks = [
      { label: "productos", run: () => this.loadProductos() },
      { label: "clientes", run: () => this.loadClientes() },
      { label: "medios de pago", run: () => this.loadMediosPago() },
      { label: "ventas", run: () => this.loadVentas() },
      { label: "caja", run: () => this.loadCaja() },
      { label: "historial de cajas", run: () => this.loadHistorialCajas() },
      { label: "configuracion", run: () => this.loadConfiguracion() },
      { label: "dashboard", run: () => this.loadDashboard() },
      { label: "reportes", run: () => this.loadReportes() }
    ];

    if (this.isAdmin()) {
      tasks.push({ label: "usuarios", run: () => this.loadUsuarios() });
    } else {
      this.state.usuarios = [];
    }

    const results = await Promise.allSettled(tasks.map(task => task.run()));
    const firstFailure = results.find(result => result.status === "rejected");

    if (firstFailure) {
      const index = results.indexOf(firstFailure);
      throw new Error(`Fallo la carga de ${tasks[index].label}: ${this.getErrorMessage(firstFailure.reason)}`);
    }
  }

  async refreshCurrentView() {
    setButtonLoading(this.els.refreshButton, true, "Actualizando...");
    this.setAppLoading(true, "Actualizando datos");

    try {
      switch (this.state.currentView) {
        case "ventas":
          await Promise.all([this.loadProductos(), this.loadClientes(), this.loadMediosPago(), this.loadCaja(), this.loadVentas()]);
          this.renderVentasView();
          break;
        case "productos":
          await this.loadProductos();
          this.renderProductosTable();
          break;
        case "caja":
          await Promise.all([this.loadCaja(), this.loadHistorialCajas()]);
          this.renderCajaView();
          break;
        case "clientes":
          await this.loadClientes();
          this.renderClientesTable();
          break;
        case "usuarios":
          await this.loadUsuarios();
          this.renderUsuariosTable();
          break;
        case "mediosPago":
          await this.loadMediosPago();
          this.renderMediosPagoTable();
          break;
        case "configuracion":
          await this.loadConfiguracion();
          this.renderConfiguracionView();
          break;
        case "reportes":
          await Promise.all([this.loadReportes(), this.loadVentas()]);
          this.renderReportesView();
          break;
        default:
          await Promise.all([this.loadCaja(), this.loadConfiguracion(), this.loadDashboard(), this.loadVentas(), this.loadProductos()]);
          this.renderDashboard();
          break;
      }

      this.toast("Vista actualizada.", "info");
      this.setConnection(true);
    } catch (error) {
      this.setConnection(false);
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(this.els.refreshButton, false, "Actualizar");
      this.setAppLoading(false);
    }
  }

  setCurrentView(view, options = {}) {
    const allowedView = this.ensureAllowedView(view);
    const redirected = allowedView !== view;
    const { silentRedirect = false } = options;

    this.state.currentView = allowedView;
    saveString(STORAGE_KEYS.currentView, allowedView);

    this.els.navLinks.forEach(link => link.classList.toggle("active", link.dataset.view === allowedView));
    this.els.viewSections.forEach(section => section.classList.toggle("hidden", section.id !== `${allowedView}View`));

    const currentMeta = VIEW_TITLES[allowedView] || VIEW_TITLES.dashboard;
    this.els.viewTitle.textContent = currentMeta.title;
    this.els.viewEyebrow.textContent = currentMeta.eyebrow;

    const renderMap = {
      dashboard: () => this.renderDashboard(),
      ventas: () => this.renderVentasView(),
      productos: () => this.renderProductosTable(),
      caja: () => this.renderCajaView(),
      clientes: () => this.renderClientesTable(),
      usuarios: () => this.renderUsuariosTable(),
      mediosPago: () => this.renderMediosPagoTable(),
      configuracion: () => this.renderConfiguracionView(),
      reportes: () => this.renderReportesView()
    };

    renderMap[allowedView]?.();

    if (redirected && !silentRedirect) {
      this.toast("No tienes permisos para acceder a esa vista.", "error");
    }
  }
}

Object.assign(
  PosApp.prototype,
  appHelperMethods,
  authDataMethods,
  dashboardVentasMethods,
  managementMethods
);
