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
      <div class="caja-page">
        <section class="caja-title-block">
          <h3>Cierre de caja</h3>
          <p>Revisá los totales, ingresá el dinero contado y cerrá tu caja.</p>
        </section>

        <section class="caja-session-strip" id="cajaActualCard"></section>

        <section class="caja-open-card" id="cajaOpenCard">
          <div>
            <span class="eyebrow">Apertura</span>
            <h4>Abrir caja</h4>
            <p>Ingresá el monto inicial para empezar a registrar ventas y movimientos.</p>
          </div>
          <form id="abrirCajaForm" class="caja-open-form" novalidate>
            <label class="field">
              <span>Monto inicial</span>
              <input name="MontoInicial" type="number" min="0" step="1" inputmode="numeric">
            </label>
            <button class="btn btn-primary" type="submit">Abrir caja</button>
          </form>
        </section>

        <section class="caja-close-workspace" id="cajaCloseWorkspace">
          <div class="caja-left-column">
            <article class="caja-summary-card" id="cajaResumenCard"></article>

            <article class="caja-summary-card" id="cajaMediosPagoCard"></article>

            <article class="caja-summary-card caja-movement-card">
              <div class="caja-card-head">
                <span>Movimiento manual</span>
                <h4>Registrar ingreso o egreso</h4>
              </div>
              <form id="movimientoCajaForm" class="caja-action-form caja-movement-form" novalidate>
                <label class="field">
                  <span>Tipo</span>
                  <select name="Tipo" id="movimientoTipoSelect"></select>
                </label>
                <label class="field">
                  <span>Concepto</span>
                  <input name="Concepto" type="text" placeholder="Ej: gasto insumos">
                </label>
                <label class="field">
                  <span>Monto</span>
                  <input name="Monto" type="number" min="1" step="1" inputmode="numeric">
                </label>
                <button class="btn btn-primary" type="submit">Registrar</button>
              </form>
            </article>
          </div>

          <article class="caja-count-card">
            <div class="caja-card-head">
              <span>Conteo de efectivo</span>
              <h4>Dinero contado</h4>
              <p>Contá el efectivo que hay en caja y comparalo con el total esperado.</p>
            </div>
            <form id="cerrarCajaForm" class="caja-close-form" novalidate>
              <label class="field">
                <span>Monto contado en efectivo</span>
                <input name="MontoFinal" type="number" min="0" step="1" inputmode="numeric">
              </label>
              <div class="caja-difference-preview" id="cajaDiferenciaPreview">
                <div>
                  <strong>Diferencia</strong>
                  <small>Ingresá el monto contado para calcularla.</small>
                </div>
                <b>$ 0,00</b>
              </div>
              <label class="field" id="motivoCierreField">
                <span>Observación</span>
                <textarea name="MotivoCierre" rows="4" maxlength="300" placeholder="Escribí una observación sobre el cierre de caja..."></textarea>
              </label>
              <div class="caja-close-actions">
                <button id="printCajaResumenButton" class="btn btn-secondary" type="button">Imprimir resumen</button>
                <button class="btn btn-danger" type="submit">Cerrar caja</button>
              </div>
              <p class="caja-close-note">Se cerrará la caja y no podrá modificarse.</p>
            </form>
          </article>
        </section>

        <section class="caja-table-card" id="cajaMovimientosCard">
          <div class="caja-table-head">
            <div>
              <span class="eyebrow">Movimientos del día</span>
              <h3>Actividad registrada</h3>
            </div>
            <button class="btn btn-secondary" type="button">Ver todos</button>
          </div>
          <div class="table-wrap caja-table-wrap">
            <table class="data-table caja-table">
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
        </section>

        <section class="caja-table-card caja-history-card hidden" id="cajaHistorialCard">
          <div class="caja-table-head">
            <div>
              <span class="eyebrow">Historial</span>
              <h3>Cajas registradas</h3>
            </div>
          </div>
          <div class="table-wrap caja-table-wrap">
            <table class="data-table caja-table">
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="historialCajasTableBody"></tbody>
            </table>
          </div>
          <div id="historialCajasPagination" class="table-pagination"></div>
        </section>
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
