export function buildProductosView() {
  return `
    <section id="productosView" class="view-section hidden">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Inventario</span>
            <h3>Productos</h3>
          </div>
          <button id="newProductoButton" class="btn btn-primary" type="button">Nuevo producto</button>
        </div>

        <div class="toolbar-row">
          <label class="field grow">
            <span>Filtrar</span>
            <input id="productosFilterInput" type="search" placeholder="Buscar producto">
          </label>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cod. barra</th>
                <th>Cod. interno</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Stock</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="productosTableBody"></tbody>
          </table>
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
              <span class="eyebrow">Operacion</span>
              <h3>Caja actual</h3>
            </div>
          </div>
          <div id="cajaActualCard" class="empty-state compact">Sin caja abierta.</div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Acciones</span>
              <h3>Gestion de caja</h3>
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
      </div>
    </section>
  `;
}

export function buildClientesView() {
  return `
    <section id="clientesView" class="view-section hidden">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Relacion comercial</span>
            <h3>Clientes</h3>
          </div>
          <button id="newClienteButton" class="btn btn-primary" type="button">Nuevo cliente</button>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Deuda</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="clientesTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function buildUsuariosView() {
  return `
    <section id="usuariosView" class="view-section hidden">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Seguridad</span>
            <h3>Usuarios</h3>
          </div>
          <button id="newUsuarioButton" class="btn btn-primary" type="button">Nuevo usuario</button>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Cambio password</th>
                <th>Creado</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="usuariosTableBody"></tbody>
          </table>
        </div>
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
      </div>
    </section>
  `;
}
