import { buildAuthView } from "./auth-view.js";
import { buildDashboardView } from "./dashboard-view.js";
import { buildVentasView } from "./ventas-view.js";
import {
  buildCajaView,
  buildClientesView,
  buildMediosPagoView,
  buildProductosView,
  buildUsuariosView
} from "./management-views.js";
import { buildConfiguracionView, buildReportesView } from "./settings-reportes-views.js";

function buildAppView() {
  return `
    <div id="appView" class="app-shell hidden">
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="sidebar-brand">
            <span class="brand-mark">SV</span>
            <div>
              <strong>Servicio Ventas</strong>
              <small>POS profesional</small>
            </div>
          </div>

          <button id="mobileMenuClose" class="icon-btn mobile-only" type="button" aria-label="Cerrar menu">×</button>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-link active" data-view="dashboard">Dashboard</button>
          <button class="nav-link" data-view="ventas">Ventas</button>
          <button class="nav-link" data-view="productos">Productos</button>
          <button class="nav-link" data-view="caja">Caja</button>
          <button class="nav-link" data-view="clientes">Clientes</button>
          <button class="nav-link" data-view="usuarios">Usuarios</button>
          <button class="nav-link" data-view="mediosPago">Medios de Pago</button>
          <button class="nav-link" data-view="configuracion">Configuracion</button>
          <button class="nav-link" data-view="reportes">Reportes</button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <span class="label">Sesion</span>
            <strong id="sessionUserName">-</strong>
            <small id="sessionUserRole">-</small>
          </div>
          <button id="logoutButton" class="btn btn-secondary btn-block" type="button">Cerrar sesion</button>
        </div>
      </aside>

      <div id="mobileBackdrop" class="mobile-backdrop"></div>

      <main class="workspace">
        <header class="topbar">
          <div class="topbar-left">
            <button id="mobileMenuButton" class="icon-btn mobile-only" type="button" aria-label="Abrir menu">☰</button>
            <div>
              <span class="eyebrow" id="viewEyebrow">Panel</span>
              <h2 id="viewTitle">Dashboard</h2>
            </div>
          </div>

          <div class="topbar-right">
            <button class="theme-toggle" data-theme-toggle type="button" aria-label="Cambiar tema" aria-pressed="false" title="Cambiar tema"></button>
            <div class="status-pill">
              <span class="status-dot"></span>
              <span id="connectionStatus">API conectada</span>
            </div>
            <div class="status-meta" id="lastSyncLabel">Sincronizacion pendiente</div>
            <button id="refreshButton" class="btn btn-secondary" type="button">Actualizar</button>
          </div>
        </header>

        ${buildDashboardView()}
        ${buildVentasView()}
        ${buildProductosView()}
        ${buildCajaView()}
        ${buildClientesView()}
        ${buildUsuariosView()}
        ${buildMediosPagoView()}
        ${buildConfiguracionView()}
        ${buildReportesView()}
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
            <span class="eyebrow" id="confirmEyebrow">Confirmacion</span>
            <h3 id="confirmTitle">Confirmar accion</h3>
          </div>
          <button id="confirmCloseButton" class="icon-btn" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="confirm-body">
          <p id="confirmMessage">Esta accion no se puede deshacer.</p>
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
