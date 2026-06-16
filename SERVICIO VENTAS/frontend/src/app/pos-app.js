import { API_ENDPOINTS, STORAGE_KEYS, VIEW_TITLES, MOVIMIENTO_TIPOS } from "../config.js";
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
      rememberedUser: loadString(STORAGE_KEYS.rememberedUser, ""),
      productos: [],
      productosPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 20,
        TotalItems: 0,
        TotalPages: 0
      },
      categoriasProducto: [],
      marcasProducto: [],
      clientes: [],
      clientesPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 20,
        TotalItems: 0,
        TotalPages: 0
      },
      usuarios: [],
      usuariosPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 20,
        TotalItems: 0,
        TotalPages: 0
      },
      mediosPago: [],
      mediosPagoPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 20,
        TotalItems: 0,
        TotalPages: 0
      },
      ventas: [],
      ventasPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 8,
        TotalItems: 0,
        TotalPages: 0
      },
      movimientosCaja: [],
      movimientosCajaPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 10,
        TotalItems: 0,
        TotalPages: 0
      },
      historialCajas: [],
      historialCajasPage: {
        Items: [],
        PageIndex: 1,
        PageSize: 10,
        TotalItems: 0,
        TotalPages: 0
      },
      cajaActual: null,
      lastClosedCaja: null,
      configuraciones: [],
      configuracionTicket: null,
      impresoras: [],
      impresorasError: "",
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
    this.pendingQuantityResolve = null;
    this.clockTimer = null;
  }

  async init() {
    this.applyTheme();
    this.restoreRememberedUser();
    this.bindEvents();
    this.populateStaticSelectors();
    this.syncAuthView();
    this.initCustomSelects();

    if (this.state.token) {
      await this.initializeApp();
    } else {
      this.stopClock();
      this.setAppLoading(false);
      this.els.loginUser.focus();
    }
  }

  bindEvents() {
    this.els.loginForm.addEventListener("submit", event => this.handleLogin(event));
    this.els.passwordToggleButton.addEventListener("click", () => this.togglePasswordVisibility());
    this.els.themeToggleButtons.forEach(button => {
      button.addEventListener("click", () => this.toggleTheme());
    });
    this.els.logoutButton.addEventListener("click", () => {
      this.closeUserMenu();
      this.logout();
    });
    this.els.sidebarLogoutButton.addEventListener("click", () => this.logout());
    this.els.userMenuButton.addEventListener("click", event => {
      event.stopPropagation();
      this.toggleUserMenu();
    });
    document.addEventListener("click", () => this.closeUserMenu());
    document.addEventListener("keydown", event => {
      if (event.key === "F1") {
        event.preventDefault();
        this.setCurrentView("ventas");
      }
    });
    this.els.refreshButton.addEventListener("click", () => {
      this.closeUserMenu();
      this.refreshCurrentView();
    });
    this.els.clearCartButton.addEventListener("click", () => this.clearCart());
    this.els.confirmSaleButton.addEventListener("click", () => this.submitVenta());
    this.els.productosFilterInput.addEventListener("input", () => this.resetProductosPageAndRender());
    this.bindProductFilterCombobox(
      this.els.productosCategoriaSearch,
      this.els.productosCategoriaOptions,
      this.els.productosCategoriaFilter,
      () => this.getOrderedCategoriasProducto(),
      "Todas las categorías");
    this.els.productosCategoriaFilter.addEventListener("change", () => {
      this.syncProductsCategoryBar();
      this.resetProductosPageAndRender();
    });
    this.bindProductFilterCombobox(
      this.els.productosMarcaSearch,
      this.els.productosMarcaOptions,
      this.els.productosMarcaFilter,
      () => this.state.marcasProducto,
      "Todas las marcas");
    this.els.productosMarcaFilter.addEventListener("change", () => this.resetProductosPageAndRender());
    this.els.productosEstadoFilter.addEventListener("change", () => this.resetProductosPageAndRender());
    this.els.clientesFilterInput.addEventListener("input", () => this.resetClientesPageAndRender());
    this.els.clientesEstadoFilter.addEventListener("change", () => this.resetClientesPageAndRender());
    this.els.usuariosFilterInput.addEventListener("input", () => this.resetUsuariosPageAndRender());
    this.els.usuariosEstadoFilter.addEventListener("change", () => this.resetUsuariosPageAndRender());
    this.els.mediosPagoFilterInput.addEventListener("input", () => this.resetMediosPagoPageAndRender());
    this.els.mediosPagoEstadoFilter.addEventListener("change", () => this.resetMediosPagoPageAndRender());
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
    this.els.printTicketButton.addEventListener("click", () => this.printTicket());
    this.els.importProductosButton.addEventListener("click", () => this.openImportProductosFilePicker());
    this.els.importProductosInput.addEventListener("change", event => this.handleImportProductosFile(event));
    this.els.manageMarcasButton.addEventListener("click", () => this.openMarcasManagerModal());
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
    document.body.classList.toggle("auth-active", !authenticated);
    this.els.authView.classList.toggle("hidden", authenticated);
    this.els.appView.classList.toggle("hidden", !authenticated);
    this.setRoutePath(authenticated ? this.state.currentView : "login");

    this.els.sessionUserName.textContent = this.state.session?.NombreUsuario || "-";
    this.els.sessionUserRole.textContent = this.state.session?.Rol || "-";
    this.updateTopbarMeta?.();
  }

  async initializeApp() {
    this.setAppLoading(true, "Cargando sistema");

    try {
      await this.ensureSession();
      this.applyRoleVisibility();
      this.syncAuthView();
      await this.loadBootstrapData();
      this.startClock();
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
    if (this.state.session?.UsuarioId && Array.isArray(this.state.session.Permisos)) return;
    this.state.session = await this.api.request(API_ENDPOINTS.authMe);
    saveJson(STORAGE_KEYS.session, this.state.session);
  }

  async loadBootstrapData() {
    const tasks = [
      { label: "productos", run: () => this.loadProductos() },
      { label: "categorias", run: () => this.loadCategoriasProducto() },
      { label: "marcas", run: () => this.loadMarcasProducto() },
      { label: "clientes", run: () => Promise.all([this.loadClientes(), this.loadClientesPage()]) },
      { label: "medios de pago", run: () => Promise.all([this.loadMediosPago(), this.loadMediosPagoPage()]) },
      { label: "ventas", run: () => this.loadVentas() },
      { label: "caja", run: () => this.loadCaja() },
      { label: "historial de cajas", run: () => this.loadHistorialCajas() },
      { label: "configuracion", run: () => this.loadConfiguracion() },
      { label: "dashboard", run: () => this.loadDashboard() },
      { label: "reportes", run: () => this.loadReportes() }
    ];

    if (this.canManageEntity("usuario")) {
      tasks.push({ label: "usuarios", run: () => Promise.all([this.loadUsuarios(), this.loadUsuariosPage()]) });
    } else {
      this.state.usuarios = [];
    }

    const results = await Promise.allSettled(tasks.map(task => task.run()));
    const firstFailure = results.find(result => result.status === "rejected");

    if (firstFailure) {
      const index = results.indexOf(firstFailure);
      throw new Error(`Falló la carga de ${tasks[index].label}: ${this.getErrorMessage(firstFailure.reason)}`);
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
          await Promise.all([this.loadProductos(), this.loadCategoriasProducto(), this.loadMarcasProducto()]);
          this.renderProductosTable();
          break;
        case "caja":
          await Promise.all([this.loadCaja(), this.loadHistorialCajas()]);
          this.renderCajaView();
          break;
        case "clientes":
          await Promise.all([this.loadClientes(), this.loadClientesPage()]);
          await this.renderClientesTable();
          break;
        case "usuarios":
          await Promise.all([this.loadUsuarios(), this.loadUsuariosPage()]);
          await this.renderUsuariosTable();
          break;
        case "mediosPago":
          await Promise.all([this.loadMediosPago(), this.loadMediosPagoPage()]);
          await this.renderMediosPagoTable();
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
          await Promise.all([this.loadCaja(), this.loadConfiguracion(), this.loadDashboard(), this.loadVentas(), this.loadProductos(), this.loadCategoriasProducto(), this.loadMarcasProducto()]);
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
    this.setRoutePath(allowedView);

    this.els.navLinks.forEach(link => link.classList.toggle("active", link.dataset.view === allowedView));
    this.els.appShell.classList.toggle("config-active", allowedView === "configuracion");
    this.els.viewSections.forEach(section => section.classList.toggle("hidden", section.id !== `${allowedView}View`));

    const currentMeta = VIEW_TITLES[allowedView] || VIEW_TITLES.dashboard;
    if (this.els.viewTitle) this.els.viewTitle.textContent = currentMeta.title;
    if (this.els.viewEyebrow) this.els.viewEyebrow.textContent = currentMeta.eyebrow;

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
