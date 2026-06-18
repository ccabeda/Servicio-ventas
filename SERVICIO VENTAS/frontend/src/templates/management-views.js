export function buildProductosView() {
  return `
    <section id="productosView" class="view-section hidden">
      <div class="products-page">
        <div class="products-head">
          <div>
            <h3>Productos</h3>
            <p>Gestiona tu inventario de productos.</p>
          </div>
          <div class="products-actions">
            <button id="importProductosButton" class="btn btn-secondary" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
              Importar productos
            </button>
            <input id="importProductosInput" class="hidden" type="file" accept=".csv,text/csv">
            <button id="manageMarcasButton" class="btn btn-secondary" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
              Gestionar marcas
            </button>
            <button id="newProductoButton" class="btn btn-primary" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
              Nuevo producto
            </button>
          </div>
        </div>

        <div class="products-filters">
          <label class="field products-search">
            <span>Buscar</span>
            <input id="productosFilterInput" type="search" placeholder="Buscar por nombre, código o código de barras...">
          </label>
          <label class="field filter-combobox">
            <span>Categoría</span>
            <input id="productosCategoriaSearch" type="search" placeholder="Buscar categoría...">
            <input id="productosCategoriaFilter" type="hidden">
            <div id="productosCategoriaOptions" class="filter-combobox-options hidden"></div>
          </label>
          <label class="field filter-combobox">
            <span>Marca</span>
            <input id="productosMarcaSearch" type="search" placeholder="Buscar marca...">
            <input id="productosMarcaFilter" type="hidden">
            <div id="productosMarcaOptions" class="filter-combobox-options hidden"></div>
          </label>
          <label class="field">
            <span>Estado</span>
            <select id="productosEstadoFilter">
              <option value="activos">Activos</option>
              <option value="todos">Todos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </label>
        </div>

        <div id="productosCategoriesBar" class="products-categories" aria-label="Categorías de productos">
        </div>

        <div class="products-table-card">
          <div id="productosPaginationTop" class="table-pagination table-pagination-top"></div>
          <div class="table-wrap">
            <table class="data-table products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código interno</th>
                  <th>Código de barras</th>
                  <th>Marca</th>
                  <th>Categoría</th>
                  <th>Precio venta</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="productosTableBody"></tbody>
            </table>
          </div>
          <div id="productosPagination" class="table-pagination"></div>
        </div>

        <div class="products-help home-tip">
          <span aria-hidden="true">!</span>
          <strong>Consejo:</strong>
          <p>Podés importar productos desde un archivo CSV o crearlos manualmente.</p>
        </div>
      </div>
    </section>
  `;
}

export function buildCajaView() {
  return `
    <section id="cajaView" class="view-section hidden">
      <div class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Operación</span>
              <h3>Caja actual</h3>
            </div>
          </div>
          <div id="cajaActualCard" class="empty-state compact">Sin caja abierta.</div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Acciones</span>
              <h3>Gestión de caja</h3>
            </div>
          </div>

          <div class="split-forms">
            <form id="abrirCajaForm" class="stack-form">
              <h4>Abrir caja</h4>
              <label class="field">
                <span>Monto inicial</span>
                <input name="MontoInicial" type="number" min="0" step="0.01" required>
              </label>
              <button class="btn btn-primary" type="submit">Abrir caja</button>
            </form>

            <form id="cerrarCajaForm" class="stack-form">
              <h4>Cerrar caja</h4>
              <label class="field">
                <span>Monto final</span>
                <input name="MontoFinal" type="number" min="0" step="0.01" required>
              </label>
              <label class="field" id="motivoCierreField">
                <span>Motivo de cierre</span>
                <textarea name="MotivoCierre" rows="2" maxlength="300" placeholder="Ej: cierre de turno"></textarea>
              </label>
              <button class="btn btn-secondary" type="submit">Cerrar caja</button>
            </form>
          </div>
        </article>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Movimientos</span>
            <h3>Registro manual y listado</h3>
          </div>
        </div>

        <form id="movimientoCajaForm" class="toolbar-row toolbar-form">
          <label class="field">
            <span>Tipo</span>
            <select name="Tipo" id="movimientoTipoSelect"></select>
          </label>
          <label class="field grow">
            <span>Concepto</span>
            <input name="Concepto" type="text" required placeholder="Ej: gasto insumos">
          </label>
          <label class="field">
            <span>Monto</span>
            <input name="Monto" type="number" min="0" step="0.01" required>
          </label>
          <button class="btn btn-primary align-end" type="submit">Registrar</button>
        </form>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody id="movimientosCajaTableBody"></tbody>
          </table>
        </div>
        <div id="movimientosCajaPagination" class="table-pagination"></div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Historial</span>
            <h3>Cajas registradas</h3>
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Caja</th>
                <th>Estado</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Inicial</th>
                <th>Final</th>
                <th>Esperado</th>
                <th>Diferencia</th>
              </tr>
            </thead>
            <tbody id="historialCajasTableBody"></tbody>
          </table>
        </div>
        <div id="historialCajasPagination" class="table-pagination"></div>
      </div>
    </section>
  `;
}

export function buildMediosPagoView() {
  return `
    <section id="mediosPagoView" class="view-section hidden">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Cobro</span>
            <h3>Medios de pago</h3>
          </div>
          <button id="newMedioPagoButton" class="btn btn-primary" type="button">Nuevo medio</button>
        </div>

        <div class="toolbar-row toolbar-form">
          <label class="field grow">
            <span>Buscar</span>
            <input id="mediosPagoFilterInput" type="search" placeholder="Buscar por nombre...">
          </label>
          <label class="field">
            <span>Estado</span>
            <select id="mediosPagoEstadoFilter">
              <option value="activos">Activos</option>
              <option value="todos">Todos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </label>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="mediosPagoTableBody"></tbody>
          </table>
        </div>
        <div id="mediosPagoPagination" class="table-pagination"></div>
      </div>
    </section>
  `;
}
