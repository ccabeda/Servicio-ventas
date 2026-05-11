export function buildVentasView() {
  return `
    <section id="ventasView" class="view-section hidden">
      <div class="ventas-layout">
        <article class="panel ventas-products">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Caja</span>
              <h3>Buscar producto</h3>
            </div>
            <div class="inline-badges">
              <span id="ventaCajaBadge" class="soft-badge">Caja no abierta</span>
            </div>
          </div>

          <div class="toolbar-stack">
            <label class="field grow">
              <span>Buscar por nombre, codigo interno o codigo de barras</span>
              <input id="ventaSearchInput" type="search" placeholder="Escanear o escribir producto">
            </label>

            <div id="ventaSearchHint" class="helper-inline">Escribe o escanea un codigo y presiona Enter para agregar rapido si hay una coincidencia exacta.</div>

            <div class="quick-meta">
              <label class="field">
                <span>Cliente</span>
                <select id="ventaClienteSelect"></select>
              </label>
              <label class="field">
                <span>Medio de pago</span>
                <select id="ventaMedioPagoSelect"></select>
              </label>
            </div>
          </div>

          <div id="productosVentaList" class="product-list"></div>
        </article>

        <article class="panel ventas-cart">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Cobro</span>
              <h3>Carrito actual</h3>
            </div>
            <button id="clearCartButton" class="btn btn-ghost" type="button">Vaciar</button>
          </div>

          <div id="cartItems" class="cart-items"></div>

          <div class="cart-meta">
            <label class="field">
              <span>Descuento</span>
              <input id="ventaDescuentoInput" type="number" min="0" step="0.01" value="0">
            </label>
            <label class="field">
              <span>Recargo</span>
              <input id="ventaRecargoInput" type="number" min="0" step="0.01" value="0">
            </label>
            <label class="field field-full">
              <span>Observaciones</span>
              <textarea id="ventaObservacionesInput" rows="2" placeholder="Detalle opcional para la venta"></textarea>
            </label>
          </div>

          <div class="cart-total-box">
            <div>
              <span>Subtotal</span>
              <strong id="cartSubtotal">$ 0,00</strong>
            </div>
            <div>
              <span>Total</span>
              <strong id="cartTotal">$ 0,00</strong>
            </div>
          </div>

          <div id="cartSummaryMeta" class="helper-inline">Carrito vacio.</div>

          <button id="confirmSaleButton" class="btn btn-primary btn-block btn-xl sticky-action" type="button">Cobrar</button>
        </article>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Seguimiento</span>
            <h3>Ultimas ventas</h3>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>ID</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody id="ventasRecientesTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}
