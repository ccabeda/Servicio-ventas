export function buildDashboardView() {
  return `
    <section id="dashboardView" class="view-section">
      <div class="home-modern">
        <div class="home-modern-head">
          <div>
            <span class="home-kicker">Inicio</span>
            <h3 id="homeWelcomeTitle">Bienvenido</h3>
            <p>Selecciona una opción para comenzar</p>
          </div>
        </div>

        <div class="home-action-grid">
          <button class="home-action-card is-primary" data-nav="ventas" type="button">
            <span class="home-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6h15l-2 8H8L6 3H3" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg></span>
            <strong>Ventas</strong>
            <small>Ir al punto de venta</small>
            <span class="home-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
          </button>

          <button class="home-action-card" data-nav="productos" type="button">
            <span class="home-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 12l8-4.5" /><path d="M12 12v9" /><path d="M12 12L4 7.5" /></svg></span>
            <strong>Productos</strong>
            <small>Administrar productos</small>
            <span class="home-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
          </button>

          <button class="home-action-card" data-nav="configuracion" type="button">
            <span class="home-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 21V9l8-6 8 6v12" /><path d="M9 21v-7h6v7" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></svg></span>
            <strong>Datos de la empresa</strong>
            <small>Configuración del negocio y del ticket</small>
            <span class="home-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
          </button>

          <button class="home-action-card" data-nav="caja" type="button">
            <span class="home-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 10h12v9H6z" /><path d="M8 6h8l2 4H6l2-4Z" /><path d="M8 14h8" /><path d="M9 17h.01M12 17h.01M15 17h.01" /></svg></span>
            <strong>Caja</strong>
            <small>Apertura, cierre y movimientos</small>
            <span class="home-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
          </button>

          <button class="home-action-card" data-nav="reportes" type="button">
            <span class="home-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 19V9" /><path d="M12 19V5" /><path d="M19 19v-7" /><path d="M3 19h18" /></svg></span>
            <strong>Reportes</strong>
            <small>Ver ventas y estadísticas</small>
            <span class="home-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
          </button>

          <button class="home-action-card" data-nav="configuracion" type="button">
            <span class="home-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.87.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.64 8.94a1.7 1.7 0 0 0-.34-1.87l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.08A1.7 1.7 0 0 0 15.06 4.64a1.7 1.7 0 0 0 1.87-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.14.57.58 1.02 1.16 1.16H21a2 2 0 1 1 0 4h-.08A1.7 1.7 0 0 0 19.4 15Z" /></svg></span>
            <strong>Configuración</strong>
            <small>Ajustes generales del sistema</small>
            <span class="home-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></span>
          </button>
        </div>

        <div class="home-tip">
          <span aria-hidden="true">!</span>
          <strong>Consejo:</strong>
          <p>Presiona F1 para ir rápido a Ventas</p>
        </div>
      </div>
    </section>
  `;
}
