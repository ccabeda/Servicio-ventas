export function buildDashboardView() {
  return `
    <section id="dashboardView" class="view-section">
      <div class="hero-panel">
        <div>
          <span class="eyebrow">Centro operativo</span>
          <h3>Vista general del negocio</h3>
          <p>Resumen del estado actual de caja, ventas y configuracion del punto de venta.</p>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" data-nav="ventas" type="button">Ir a ventas</button>
          <button class="btn btn-secondary" data-nav="reportes" type="button">Ver reportes</button>
        </div>
      </div>

      <div class="stats-grid" id="dashboardStats"></div>

      <div class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Caja actual</span>
              <h3>Estado de caja</h3>
            </div>
          </div>
          <div id="dashboardCaja" class="empty-state compact">Sin datos de caja.</div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Configuracion</span>
              <h3>Negocio activo</h3>
            </div>
          </div>
          <div id="dashboardConfig" class="empty-state compact">Sin configuracion cargada.</div>
        </article>
      </div>

      <div class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Actividad</span>
              <h3>Ventas recientes</h3>
            </div>
          </div>
          <div id="dashboardVentasRecientes" class="stack-list empty-state compact">Sin ventas recientes.</div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Stock</span>
              <h3>Productos criticos</h3>
            </div>
          </div>
          <div id="dashboardStockCritico" class="stack-list empty-state compact">Sin alertas de stock.</div>
        </article>
      </div>
    </section>
  `;
}
