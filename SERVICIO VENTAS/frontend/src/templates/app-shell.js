import { buildAuthView } from "./auth-view.js";
import { buildDashboardView } from "./dashboard-view.js";
import { buildVentasView } from "./ventas-view.js";
import {
  buildCajaView,
  buildMediosPagoView,
  buildProductosView
} from "./management-views.js";
import { buildConfiguracionView, buildReportesView } from "./settings-reportes-views.js";

function buildAppView() {
  return `
    <div id="appView" class="app-shell hidden">
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="sidebar-brand">
            <span class="sidebar-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M21 15h-2.5c-.398 0-.779.158-1.061.439-.281.281-.439.663-.439 1.061s.158.779.439 1.061c.281.281.663.439 1.061.439h1c.398 0 .779.158 1.061.439.281.281.439.663.439 1.061s-.158.779-.439 1.061c-.281.281-.663.439-1.061.439H17" />
                <path d="M19 21v1m0-8v1" />
                <path d="M13 21H6c-.53 0-1.039-.211-1.414-.586C4.211 20.039 4 19.53 4 19V9c0-.53.211-1.039.586-1.414C4.961 7.211 5.47 7 6 7h2m12 3.12V9c0-.53-.211-1.039-.586-1.414C19.039 7.211 18.53 7 18 7h-2" />
                <path d="M16 10V4c0-.53-.211-1.039-.586-1.414C15.039 2.211 14.53 2 14 2h-4c-.53 0-1.039.211-1.414.586C8.211 2.961 8 3.47 8 4v6m8 0H8m8 0h1m-9 0H7" />
                <path d="M8 14v.01" />
                <path d="M8 17v.01" />
                <path d="M12 13.99v.01" />
                <path d="M12 17v.01" />
              </svg>
            </span>
            <strong>Caja<span>Go</span></strong>
          </div>

          <button id="mobileMenuClose" class="icon-btn mobile-only" type="button" aria-label="Cerrar menu">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-link active" data-view="dashboard">
            <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg></span>
            <span>Inicio</span>
          </button>
          <button class="nav-link" data-view="ventas">
            <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6h15l-2 8H8L6 3H3" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg></span>
            <span>Ventas</span>
          </button>
          <button class="nav-link" data-view="productos">
            <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 12l8-4.5" /><path d="M12 12v9" /><path d="M12 12L4 7.5" /></svg></span>
            <span>Productos</span>
          </button>
          <button class="nav-link" data-view="caja">
            <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 10h12v9H6z" /><path d="M8 6h8l2 4H6l2-4Z" /><path d="M8 14h8" /><path d="M9 17h.01M12 17h.01M15 17h.01" /></svg></span>
            <span>Caja</span>
          </button>
          <button class="nav-link" data-view="reportes">
            <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 19V9" /><path d="M12 19V5" /><path d="M19 19v-7" /><path d="M3 19h18" /></svg></span>
            <span>Reportes</span>
          </button>
          <button class="nav-link" data-view="configuracion">
            <span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.87.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.64 8.94a1.7 1.7 0 0 0-.34-1.87l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.08A1.7 1.7 0 0 0 15.06 4.64a1.7 1.7 0 0 0 1.87-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.14.57.58 1.02 1.16 1.16H21a2 2 0 1 1 0 4h-.08A1.7 1.7 0 0 0 19.4 15Z" /></svg></span>
            <span>Configuración</span>
          </button>
          <div class="config-subnav" aria-label="Submenú de configuración">
            <button class="active" type="button" data-settings-tab="negocio">Datos del negocio</button>
            <button type="button" data-settings-tab="ticket">Ticket</button>
            <button type="button" data-settings-tab="impresoras">Impresoras</button>
            <button type="button">Impuestos</button>
            <button type="button" data-settings-tab="usuarios">Usuarios</button>
            <button type="button" data-settings-tab="preferencias">Preferencias</button>
            <button type="button" data-settings-tab="respaldo">Respaldo</button>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="help-card">
            <div class="help-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 14v-1a8 8 0 1 1 16 0v1" /><path d="M18 19c0 1.1-.9 2-2 2h-3" /><path d="M4 14a3 3 0 0 0 3 3h1v-6H7a3 3 0 0 0-3 3Z" /><path d="M20 14a3 3 0 0 1-3 3h-1v-6h1a3 3 0 0 1 3 3Z" /></svg>
            </div>
            <div>
              <strong>¿Necesitás ayuda?</strong>
              <span class="help-link">Centro de ayuda <span aria-hidden="true">↗</span></span>
            </div>
          </div>
          <button id="sidebarLogoutButton" class="sidebar-logout" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-6" /></svg>
            <span>Cerrar sesión</span>
          </button>
          <div class="sidebar-version">CajaGo POS v1.0.0</div>
        </div>
      </aside>

      <div id="mobileBackdrop" class="mobile-backdrop"></div>

      <main class="workspace">
        <header class="topbar">
          <div class="topbar-left">
            <button id="mobileMenuButton" class="icon-btn mobile-only" type="button" aria-label="Abrir menu">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>
            </button>
            <div>
              <h2 id="topbarGreeting">Hola, Usuario</h2>
              <span id="topbarDateTime">Sincronizando hora</span>
            </div>
          </div>

          <div class="topbar-right">
            <div class="topbar-pill status-pill">
              <span class="status-dot"></span>
              <span id="connectionStatus">API conectada</span>
            </div>
            <button class="topbar-pill topbar-select" type="button">
              <span id="topbarCajaLabel">Caja 1</span>
              <span aria-hidden="true">⌄</span>
            </button>
            <div class="user-menu">
              <button id="userMenuButton" class="topbar-pill topbar-user" type="button" aria-haspopup="true" aria-expanded="false">
                <span class="topbar-user-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg></span>
                <span id="sessionUserName">-</span>
                <span aria-hidden="true">⌄</span>
              </button>
              <div id="userMenuDropdown" class="user-menu-dropdown hidden">
                <button id="refreshButton" type="button">Actualizar</button>
                <button id="logoutButton" type="button">Cerrar sesión</button>
              </div>
            </div>
            <button class="theme-toggle" data-theme-toggle type="button" aria-label="Cambiar tema" aria-pressed="false" title="Cambiar tema"></button>
          </div>
        </header>
        <div class="hidden" id="sessionUserRole">-</div>
        <div class="hidden" id="lastSyncLabel">Sincronización pendiente</div>

        ${buildDashboardView()}
        ${buildVentasView()}
        ${buildProductosView()}
        ${buildCajaView()}
        ${buildMediosPagoView()}
        ${buildConfiguracionView()}
        ${buildReportesView()}

        <footer class="app-footer">
          <p>© 2026 CajaGo. Todos los derechos reservados. El acceso está reservado para usuarios autorizados del punto de venta.</p>
        </footer>
      </main>
    </div>
  `;
}

function buildModalRoots() {
  return `
    <div id="modalRoot" class="modal-root hidden">
      <div class="modal-backdrop"></div>
      <div class="modal-card">
        <div class="modal-head">
          <div>
            <span class="eyebrow" id="modalEyebrow">Formulario</span>
            <h3 id="modalTitle">Nuevo registro</h3>
          </div>
          <button id="modalCloseButton" class="icon-btn" type="button" aria-label="Cerrar">×</button>
        </div>
        <form id="modalForm" class="modal-form"></form>
      </div>
    </div>

    <div id="confirmModal" class="modal-root hidden">
      <div class="modal-backdrop"></div>
      <div class="modal-card confirm-card">
        <div class="modal-head">
          <div>
            <span class="eyebrow" id="confirmEyebrow">Confirmación</span>
            <h3 id="confirmTitle">Confirmar acción</h3>
          </div>
          <button id="confirmCloseButton" class="icon-btn" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="confirm-body">
          <p id="confirmMessage">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-actions">
          <button id="confirmCancelButton" class="btn btn-secondary" type="button">Cancelar</button>
          <button id="confirmActionButton" class="btn btn-danger" type="button">Eliminar</button>
        </div>
      </div>
    </div>

    <div id="ticketModal" class="modal-root hidden">
      <div class="modal-backdrop"></div>
      <div class="modal-card ticket-card">
        <div class="modal-head">
          <div>
            <span class="eyebrow">Venta confirmada</span>
            <h3>Comprobante</h3>
          </div>
          <button id="ticketCloseButton" class="icon-btn" type="button" aria-label="Cerrar">×</button>
        </div>
        <div id="ticketContent" class="ticket-content"></div>
        <div class="modal-actions">
          <button id="printTicketButton" class="btn btn-primary" type="button">Imprimir</button>
          <button id="ticketDoneButton" class="btn btn-secondary" type="button">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}

export function renderAppShell(root) {
  root.innerHTML = `
    <div class="app-background"></div>

    <div id="toastContainer" class="toast-container" aria-live="polite"></div>

    <div id="appLoader" class="app-loader hidden" aria-live="polite" aria-hidden="true">
      <div class="app-loader-card">
        <span class="spinner spinner-lg" aria-hidden="true"></span>
        <strong id="appLoaderLabel">Cargando sistema</strong>
        <small>Sincronizando datos del POS.</small>
      </div>
    </div>

    ${buildAuthView()}
    ${buildAppView()}
    ${buildModalRoots()}
  `;
}
