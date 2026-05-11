import { STORAGE_KEYS } from "../../config.js";
import { formatDateTime } from "../../utils/formatters.js";
import { saveString } from "../../utils/storage.js";
import { showToast } from "../../utils/ui.js";

export const appHelperMethods = {
  getAdminOnlyViews() {
    return ["usuarios", "configuracion"];
  },

  getAdminManagedEntities() {
    return ["producto", "cliente", "usuario", "medioPago"];
  },

  buildReportQuery() {
    const params = new URLSearchParams();
    if (this.state.reportFilters.fechaDesde) {
      params.set("fechaDesde", this.toApiDateTime(this.startOfLocalDate(this.state.reportFilters.fechaDesde)));
    }
    if (this.state.reportFilters.fechaHasta) {
      params.set("fechaHasta", this.toApiDateTime(this.endOfLocalDate(this.state.reportFilters.fechaHasta)));
    }
    const query = params.toString();
    return query ? `?${query}` : "";
  },

  setConnection(isConnected) {
    this.els.connectionStatus.textContent = isConnected ? "API conectada" : "Sin conexion";
    this.els.lastSyncLabel.textContent = isConnected
      ? `Actualizado ${formatDateTime(new Date())}`
      : "Error de sincronizacion";
  },

  setAppLoading(isLoading, label = "Cargando sistema") {
    this.els.appLoader.classList.toggle("hidden", !isLoading);
    this.els.appLoader.setAttribute("aria-hidden", String(!isLoading));
    this.els.appLoaderLabel.textContent = label;
  },

  toggleTheme() {
    this.state.theme = this.state.theme === "dark" ? "light" : "dark";
    saveString(STORAGE_KEYS.theme, this.state.theme);
    this.applyTheme();
  },

  applyTheme() {
    const isDark = this.state.theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);

    this.els.themeToggleButtons.forEach(button => {
      button.classList.toggle("is-dark", isDark);
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      button.title = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    });

    if (this.els.themeColorMeta) {
      this.els.themeColorMeta.setAttribute("content", isDark ? "#14181f" : "#f4f1e8");
    }
  },

  toggleMenu(open) {
    this.els.appShell.classList.toggle("menu-open", open);
  },

  toast(message, type = "info") {
    showToast(this.els.toastContainer, message, type);
  },

  requestConfirmation({
    eyebrow = "Confirmacion",
    title = "Confirmar accion",
    message = "Esta accion no se puede deshacer.",
    confirmLabel = "Confirmar"
  }) {
    this.els.confirmEyebrow.textContent = eyebrow;
    this.els.confirmTitle.textContent = title;
    this.els.confirmMessage.textContent = message;
    this.els.confirmActionButton.textContent = confirmLabel;
    this.els.confirmModal.classList.remove("hidden");

    return new Promise(resolve => {
      this.pendingConfirmResolve = resolve;
    });
  },

  resolveConfirmation(confirmed) {
    this.els.confirmModal.classList.add("hidden");

    if (!this.pendingConfirmResolve) {
      return;
    }

    const resolve = this.pendingConfirmResolve;
    this.pendingConfirmResolve = null;
    resolve(confirmed);
  },

  isAdmin() {
    return this.state.session?.Rol === "Admin";
  },

  canAccessView(view) {
    return this.isAdmin() || !this.getAdminOnlyViews().includes(view);
  },

  canManageEntity(entity) {
    return this.isAdmin() || !this.getAdminManagedEntities().includes(entity);
  },

  ensureAllowedView(view) {
    if (!view || !Object.prototype.hasOwnProperty.call(this.VIEW_TITLES, view)) {
      return "dashboard";
    }

    return this.canAccessView(view) ? view : "dashboard";
  },

  applyRoleVisibility() {
    this.els.navLinks.forEach(link => {
      if (this.getAdminOnlyViews().includes(link.dataset.view)) {
        link.classList.toggle("hidden", !this.isAdmin());
      }
    });
  },

  getRecentVentas(limit) {
    return this.state.ventas
      .slice()
      .sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha))
      .slice(0, limit);
  },

  toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  getErrorMessage(error) {
    return error instanceof Error ? error.message : "Ocurrio un error inesperado.";
  }
};
