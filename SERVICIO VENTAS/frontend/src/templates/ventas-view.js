export function buildVentasView() {
  return `
    <section id="ventasView" class="view-section hidden">
      <div class="ventas-v2-head">
        <div>
          <h2>Ventas</h2>
          <p>Buscá productos, agregá la cantidad y cobrá.</p>
        </div>
        <span id="ventaCajaBadge" class="soft-badge">Caja no abierta</span>
      </div>

      <div class="ventas-v2-layout">
        <article class="ventas-v2-panel ventas-v2-products">
          <div class="ventas-search-row">
            <label class="ventas-search-field">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"></path>
              </svg>
              <input id="ventaSearchInput" type="search" placeholder="Buscar producto por nombre, código o escanear...">
            </label>
            <button id="ventaScanButton" class="btn btn-secondary ventas-scan-button" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M8 7v10M12 7v10M16 7v10"></path>
              </svg>
              Escanear
            </button>
          </div>

          <div id="ventaCategoriasBar" class="ventas-category-bar"></div>

          <div class="ventas-table-head">
            <span>Producto</span>
            <span>Precio</span>
            <span></span>
          </div>

          <div id="productosVentaList" class="product-list"></div>
          <div id="ventaProductsPagination" class="ventas-products-pagination"></div>
          <div id="ventaSearchHint" class="helper-inline ventas-tip-inline">Escaneá o buscá por nombre, código interno o código de barras.</div>
        </article>

        <article class="ventas-v2-panel ventas-cart">
          <div class="ventas-cart-header">
            <h3>Venta actual</h3>
            <button id="clearCartButton" class="ventas-clear-button" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M6 6l1 14h10l1-14"></path>
              </svg>
              Vaciar venta
            </button>
          </div>

          <div id="cartItems" class="cart-items"></div>

          <button id="ventaNotaToggle" class="ventas-note-button" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 1 1 17 0Z"></path>
            </svg>
            Agregar nota (opcional)
          </button>

          <div class="ventas-note-row hidden" id="ventaNotaRow">
            <textarea id="ventaObservacionesInput" rows="2" placeholder="Detalle opcional para la venta"></textarea>
          </div>

          <div class="cart-total-box ventas-totals-box">
            <div>
              <span>Subtotal</span>
              <strong id="cartSubtotal">$ 0,00</strong>
            </div>
            <label>
              <span>Descuento</span>
              <input id="ventaDescuentoInput" type="number" min="0" max="100" step="0.01" value="0">
            </label>
            <label>
              <span>Recargo</span>
              <input id="ventaRecargoInput" type="number" min="0" step="0.01" value="0">
            </label>
            <div>
              <span>TOTAL</span>
              <strong id="cartTotal">$ 0,00</strong>
            </div>
          </div>

          <label class="ventas-client-select">
            <span>Cliente</span>
            <select id="ventaClienteSelect"></select>
          </label>

          <div class="ventas-payment-block">
            <span>Cobrar con</span>
            <select id="ventaMedioPagoSelect" class="hidden"></select>
            <div id="ventaMediosPagoButtons" class="ventas-payment-grid"></div>
          </div>

          <div id="cartSummaryMeta" class="helper-inline">Carrito vacío.</div>

          <button id="confirmSaleButton" class="btn btn-primary btn-block ventas-charge-button" type="button">
            <span>COBRAR</span>
            <strong id="ventaChargeAmount">$ 0,00</strong>
          </button>
        </article>
      </div>

      <div class="ventas-bottom-grid">
        <div class="ventas-tip-card">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17v-6M12 7h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
          </svg>
          <div>
            <strong>Tip: escaneá un producto o buscá por nombre o código.</strong>
            <span>Podés ajustar la cantidad con + y - desde la venta actual.</span>
          </div>
        </div>
        <button id="printLastTicketButton" class="ventas-print-last-button" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"></path>
          </svg>
          Imprimir último ticket
        </button>
      </div>
    </section>
  `;
}
