export function buildConfiguracionView() {
  return `
    <section id="configuracionView" class="view-section hidden">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Identidad del negocio</span>
            <h3>Configuracion del POS</h3>
          </div>
        </div>

        <form id="configuracionForm" class="config-grid">
          <label class="field">
            <span>Nombre del negocio</span>
            <input name="NombreNegocio" type="text" required>
          </label>
          <label class="field">
            <span>Telefono</span>
            <input name="Telefono" type="text">
          </label>
          <label class="field field-full">
            <span>Direccion</span>
            <input name="Direccion" type="text">
          </label>
          <label class="field">
            <span>Logo URL</span>
            <input name="LogoUrl" type="text">
          </label>
          <label class="field">
            <span>Impresora ticket</span>
            <input name="ImpresoraTicket" type="text">
          </label>
          <label class="field field-full">
            <span>Mensaje de ticket</span>
            <textarea name="MensajeTicket" rows="3"></textarea>
          </label>
          <label class="check-field field-full">
            <input name="UsaTicketTermico" type="checkbox">
            <span>Usa ticket termico</span>
          </label>
          <button class="btn btn-primary" type="submit">Guardar configuracion</button>
        </form>
      </div>
    </section>
  `;
}

export function buildReportesView() {
  return `
    <section id="reportesView" class="view-section hidden">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Analitica operativa</span>
            <h3>Reportes</h3>
          </div>
        </div>

        <form id="reportesFilterForm" class="reportes-toolbar">
          <div class="reportes-toolbar-group reportes-toolbar-filters">
            <label class="field">
              <span>Fecha desde</span>
              <input name="FechaDesde" type="date">
            </label>
            <label class="field">
              <span>Fecha hasta</span>
              <input name="FechaHasta" type="date">
            </label>
            <button class="btn btn-primary reportes-apply-btn" type="submit">Aplicar</button>
          </div>

          <div class="reportes-toolbar-group reportes-toolbar-presets">
            <span class="label">Atajos</span>
            <div class="reportes-preset-buttons">
              <button id="presetTodayButton" class="btn btn-secondary" type="button">Hoy</button>
              <button id="presetWeekButton" class="btn btn-secondary" type="button">7 dias</button>
              <button id="presetMonthButton" class="btn btn-secondary" type="button">Mes</button>
            </div>
          </div>

          <div class="reportes-toolbar-group reportes-toolbar-export">
            <span class="label">Salida</span>
            <button id="exportVentasCsvButton" class="btn btn-secondary reportes-export-btn" type="button">Exportar CSV</button>
          </div>
        </form>

        <div id="reportesStats" class="stats-grid"></div>
      </div>

      <div class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Top ventas</span>
              <h3>Productos mas vendidos</h3>
            </div>
          </div>
          <div id="topProductosList" class="ranking-list"></div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Ultimos movimientos</span>
              <h3>Ventas del periodo</h3>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Medio</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="reportesVentasTableBody"></tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  `;
}
