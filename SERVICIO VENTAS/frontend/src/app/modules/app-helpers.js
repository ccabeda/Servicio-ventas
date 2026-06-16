import { ENTITY_PERMISSIONS, STORAGE_KEYS, VIEW_PERMISSIONS } from "../../config.js";
import { formatDateTime, formatHeaderDateTime } from "../../utils/formatters.js";
import { saveString } from "../../utils/storage.js";
import { showToast } from "../../utils/ui.js";

export const appHelperMethods = {
  getRoutePath(view) {
    const map = {
      login: "/login",
      dashboard: "/inicio",
      ventas: "/ventas",
      productos: "/productos",
      caja: "/caja",
      clientes: "/clientes",
      usuarios: "/usuarios",
      mediosPago: "/medios-pago",
      configuracion: "/configuracion",
      reportes: "/reportes"
    };

    return map[view] || "/inicio";
  },

  setRoutePath(view) {
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
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
    const cajaAbierta = Boolean(this.state.cajaActual?.Abierta);
    const syncText = isConnected ? `Actualizado ${formatDateTime(new Date())}` : "Error de sincronización";
    this.els.connectionStatus.textContent = isConnected
      ? (cajaAbierta ? "Caja abierta" : "Caja cerrada")
      : "Sin conexión";
    this.els.connectionStatus.previousElementSibling?.classList.toggle("is-open", isConnected && cajaAbierta);
    this.els.connectionStatus.previousElementSibling?.classList.toggle("is-closed", isConnected && !cajaAbierta);
    this.els.connectionStatus.previousElementSibling?.classList.toggle("is-offline", !isConnected);
    this.els.topbarCajaLabel.textContent = this.state.cajaActual?.Id ? `Caja ${this.state.cajaActual.Id}` : "Caja 1";
    this.els.lastSyncLabel.textContent = syncText;
    this.updateTopbarMeta();
  },

  updateTopbarMeta() {
    const name = this.state.session?.NombreUsuario || "Usuario";
    this.els.topbarGreeting.textContent = `Hola, ${name}`;
    this.els.topbarDateTime.textContent = formatHeaderDateTime(new Date());
  },

  startClock() {
    this.stopClock();
    this.updateTopbarMeta();
    this.clockTimer = window.setInterval(() => this.updateTopbarMeta(), 30000);
  },

  initCustomSelects() {
    window.requestAnimationFrame(() => this.enhanceCustomSelects(document));

    if (!this.customSelectDocumentHandler) {
      this.customSelectDocumentHandler = event => {
        if (!event.target?.closest?.(".custom-select")) {
          this.closeCustomSelects();
        }
      };
      document.addEventListener("click", this.customSelectDocumentHandler);
    }
  },

  enhanceCustomSelects(root = document) {
    root.querySelectorAll(".field select, .pagination-size select, .business-hours-range select").forEach(select => {
      if (select.dataset.customSelectReady) {
        this.syncCustomSelect(select);
        return;
      }

      select.dataset.customSelectReady = "true";
      select.classList.add("native-select-hidden");

      const wrapper = document.createElement("div");
      wrapper.className = "custom-select";

      const trigger = document.createElement("button");
      trigger.className = "custom-select-trigger";
      trigger.type = "button";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");

      const value = document.createElement("span");
      value.className = "custom-select-value";
      const chevron = document.createElement("span");
      chevron.className = "custom-select-chevron";
      chevron.setAttribute("aria-hidden", "true");

      const menu = document.createElement("div");
      menu.className = "custom-select-menu hidden";
      menu.setAttribute("role", "listbox");

      trigger.append(value, chevron);
      wrapper.append(trigger, menu);
      select.insertAdjacentElement("afterend", wrapper);

      trigger.addEventListener("click", event => {
        event.stopPropagation();
        const isOpen = !menu.classList.contains("hidden");
        this.closeCustomSelects(wrapper);

        if (!isOpen) {
          this.renderCustomSelectMenu(select, wrapper);
          wrapper.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          menu.classList.remove("hidden");
        }
      });

      select.addEventListener("change", () => this.syncCustomSelect(select));
      this.syncCustomSelect(select);
    });
  },

  syncCustomSelect(select) {
    const wrapper = select.nextElementSibling?.classList?.contains("custom-select")
      ? select.nextElementSibling
      : null;
    const valueElement = wrapper?.querySelector(".custom-select-value");
    if (!valueElement) return;

    const selected = select.options[select.selectedIndex];
    valueElement.textContent = selected?.textContent || "Seleccionar";
  },

  renderCustomSelectMenu(select, wrapper) {
    const menu = wrapper.querySelector(".custom-select-menu");
    if (!menu) return;

    menu.innerHTML = "";
    const options = Array.from(select.options);

    if (!options.length) {
      const empty = document.createElement("div");
      empty.className = "custom-select-empty";
      empty.textContent = "Sin opciones";
      menu.append(empty);
      return;
    }

    options.forEach(option => {
      const button = document.createElement("button");
      button.className = option.selected ? "custom-select-option is-selected" : "custom-select-option";
      button.type = "button";
      button.role = "option";
      button.textContent = option.textContent;
      button.setAttribute("aria-selected", String(option.selected));
      button.addEventListener("click", event => {
        event.stopPropagation();
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        this.closeCustomSelects();
      });
      menu.append(button);
    });
  },

  closeCustomSelects(except = null) {
    document.querySelectorAll(".custom-select").forEach(wrapper => {
      if (wrapper === except) return;
      wrapper.classList.remove("is-open");
      wrapper.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
      wrapper.querySelector(".custom-select-menu")?.classList.add("hidden");
    });
  },

  stopClock() {
    if (!this.clockTimer) return;
    window.clearInterval(this.clockTimer);
    this.clockTimer = null;
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

  normalizeBrandColor(color) {
    return /^#[0-9a-f]{6}$/i.test(color || "") ? color.toLowerCase() : "#ef0000";
  },

  hexToRgbString(color) {
    const normalized = this.normalizeBrandColor(color).slice(1);
    const value = Number.parseInt(normalized, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `${red}, ${green}, ${blue}`;
  },

  applyBrandColor(color = "#ef0000") {
    const normalized = this.normalizeBrandColor(color);
    document.documentElement.style.setProperty("--brand", normalized);
    document.documentElement.style.setProperty("--brand-rgb", this.hexToRgbString(normalized));
  },

  getTicketConfig() {
    return this.state.configuracionTicket || {};
  },

  applyVisualPreferences(config = this.state.configuraciones[0]) {
    const ticketConfig = this.getTicketConfig();
    document.body.classList.toggle("ticket-large", Boolean(ticketConfig?.LetraGrandePantallaTactil));
    document.body.classList.toggle("hide-help-messages", config?.MostrarMensajesAyuda === false);
  },

  restoreRememberedUser() {
    if (!this.state.rememberedUser) return;

    this.els.loginUser.value = this.state.rememberedUser;
    this.els.rememberUserCheckbox.checked = true;
  },

  togglePasswordVisibility() {
    const showPassword = this.els.loginPassword.type === "password";
    this.els.loginPassword.type = showPassword ? "text" : "password";
    this.els.passwordToggleButton.textContent = showPassword ? "Ocultar" : "Ver";
    this.els.passwordToggleButton.setAttribute("aria-label", showPassword ? "Ocultar contraseña" : "Mostrar contraseña");
  },

  toggleMenu(open) {
    this.els.appShell.classList.toggle("menu-open", open);
  },

  toggleUserMenu() {
    const willOpen = this.els.userMenuDropdown.classList.contains("hidden");
    this.els.userMenuDropdown.classList.toggle("hidden", !willOpen);
    this.els.userMenuButton.setAttribute("aria-expanded", String(willOpen));
  },

  closeUserMenu() {
    this.els.userMenuDropdown.classList.add("hidden");
    this.els.userMenuButton.setAttribute("aria-expanded", "false");
  },

  toast(message, type = "info") {
    showToast(this.els.toastContainer, message, type);
  },

  requestConfirmation({
    eyebrow = "Confirmación",
    title = "Confirmar acción",
    message = "Esta acción no se puede deshacer.",
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

  renderPagination({ page, container, label, onChange, pageSizeFallback = 20, actionPrefix = "" }) {
    if (!container) return;

    const current = page.PageIndex || 1;
    const totalPages = page.TotalPages || 0;
    const totalItems = page.TotalItems || 0;
    const pageSize = page.PageSize || pageSizeFallback;
    const from = totalItems === 0 ? 0 : ((current - 1) * pageSize) + 1;
    const to = Math.min(current * pageSize, totalItems);
    const prevAction = `${actionPrefix}prev-page`;
    const nextAction = `${actionPrefix}next-page`;

    container.innerHTML = `
      <div class="pagination-summary">${from}-${to} de ${totalItems} ${label}</div>
      <div class="pagination-controls">
        <button class="icon-btn" type="button" data-action="${prevAction}" ${current <= 1 ? "disabled" : ""} aria-label="Página anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span class="pagination-page">${totalPages ? current : 0} / ${totalPages}</span>
        <button class="icon-btn" type="button" data-action="${nextAction}" ${current >= totalPages ? "disabled" : ""} aria-label="Página siguiente">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    `;

    container.querySelector(`[data-action='${prevAction}']`).addEventListener("click", () => {
      if (current <= 1) return;
      onChange(current - 1);
    });

    container.querySelector(`[data-action='${nextAction}']`).addEventListener("click", () => {
      if (current >= totalPages) return;
      onChange(current + 1);
    });
  },

  createEmptyPage(pageSize = 20, pageIndex = 1) {
    return {
      Items: [],
      PageIndex: pageIndex,
      PageSize: pageSize,
      TotalItems: 0,
      TotalPages: 0,
      HasPreviousPage: false,
      HasNextPage: false
    };
  },

  isAdmin() {
    return this.state.session?.Rol === "Admin";
  },

  getPermissions() {
    return Array.isArray(this.state.session?.Permisos) ? this.state.session.Permisos : [];
  },

  hasPermission(permission) {
    return !permission || this.isAdmin() || this.getPermissions().includes(permission);
  },

  canAccessView(view) {
    return this.hasPermission(VIEW_PERMISSIONS[view]);
  },

  canManageEntity(entity) {
    return this.hasPermission(ENTITY_PERMISSIONS[entity]);
  },

  ensureAllowedView(view) {
    if (!view || !Object.prototype.hasOwnProperty.call(this.VIEW_TITLES, view)) {
      return "dashboard";
    }

    return this.canAccessView(view) ? view : "dashboard";
  },

  applyRoleVisibility() {
    this.els.navLinks.forEach(link => {
      link.classList.toggle("hidden", !this.canAccessView(link.dataset.view));
    });

    document.querySelectorAll("[data-nav]").forEach(button => {
      button.classList.toggle("hidden", !this.canAccessView(button.dataset.nav));
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
    return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
  }
};
