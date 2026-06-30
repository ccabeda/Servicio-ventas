import { API_ENDPOINTS } from "../../config.js";
import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { setButtonLoading } from "../../utils/ui.js";

export const ventasMethods = {
  getVentasConfig() {
    const config = this.state.configuraciones[0] || {};
    return {
      confirmarEliminarItemCarrito: config.ConfirmarEliminarItemCarrito !== false,
      mantenerClienteAlFinalizarVenta: config.MantenerClienteAlFinalizarVenta !== false,
      mostrarStockEnBusquedaProductos: config.MostrarStockEnBusquedaProductos !== false,
      pedirCantidadAlAgregarProducto: Boolean(config.PedirCantidadAlAgregarProducto),
      descuentoMaximoPermitido: Number(config.DescuentoMaximoPermitido ?? 20),
      redondeoTotal: config.RedondeoTotal || "0.05"
    };
  },

  renderVentasView() {
    this.ventaProductosPageIndex = this.ventaProductosPageIndex || 1;
    this.ventaProductosPageSize = this.ventaProductosPageSize || 10;
    this.ventaCategoriaFiltro = this.ventaCategoriaFiltro || "";
    this.renderVentaSelectors();
    this.renderVentaCategorias();
    this.renderProductosVenta();
    this.renderCart();
    this.renderVentaCajaBadge();
    this.renderVentasRecientesTable();
    this.updateVentasActionState();
  },

  renderVentaSelectors() {
    const selectedCliente = this.els.ventaClienteSelect.value;
    const selectedMedioPago = this.els.ventaMedioPagoSelect.value;

    this.els.ventaClienteSelect.innerHTML = [
      `<option value="">Consumidor final</option>`,
      ...this.state.clientes
        .filter(cliente => cliente.Activo)
        .map(cliente => `<option value="${cliente.Id}">${escapeHtml(cliente.Nombre)}</option>`)
    ].join("");

    this.els.ventaMedioPagoSelect.innerHTML = this.state.mediosPago
      .filter(item => item.Activo)
      .map(item => `<option value="${item.Id}">${escapeHtml(item.Nombre)}</option>`)
      .join("");

    if (selectedCliente && this.state.clientes.some(item => String(item.Id) === selectedCliente && item.Activo)) {
      this.els.ventaClienteSelect.value = selectedCliente;
    }

    if (selectedMedioPago && this.state.mediosPago.some(item => String(item.Id) === selectedMedioPago && item.Activo)) {
      this.els.ventaMedioPagoSelect.value = selectedMedioPago;
    }

    if (!this.els.ventaMedioPagoSelect.value && this.state.mediosPago.some(item => item.Activo)) {
      this.els.ventaMedioPagoSelect.value = String(this.state.mediosPago.find(item => item.Activo).Id);
    }

    this.enhanceCustomSelects?.(this.els.ventaClienteSelect.closest(".ventas-client-select"));
    this.renderVentaMedioPagoButtons();
  },

  renderVentaCategorias() {
    if (!this.els.ventaCategoriasBar) return;

    const categorias = (this.state.categoriasProducto || []).filter(categoria => categoria.Activa !== false);
    const buttons = [
      { id: "", label: "Todos" },
      ...categorias.map(categoria => ({ id: String(categoria.Id), label: categoria.Nombre }))
    ];

    this.els.ventaCategoriasBar.innerHTML = buttons.map(item => `
      <button class="ventas-category-pill${String(this.ventaCategoriaFiltro || "") === item.id ? " is-active" : ""}" type="button" data-venta-category="${escapeHtml(item.id)}">
        ${escapeHtml(item.label)}
      </button>
    `).join("");

    this.els.ventaCategoriasBar.querySelectorAll("[data-venta-category]").forEach(button => {
      button.addEventListener("click", () => {
        this.ventaCategoriaFiltro = button.dataset.ventaCategory || "";
        this.ventaProductosPageIndex = 1;
        this.renderVentaCategorias();
        this.renderProductosVenta();
      });
    });
  },

  renderVentaMedioPagoButtons() {
    if (!this.els.ventaMediosPagoButtons) return;

    const selectedId = String(this.els.ventaMedioPagoSelect.value || "");
    const medios = this.state.mediosPago.filter(item => item.Activo);

    this.els.ventaMediosPagoButtons.innerHTML = medios.length
      ? medios.map(item => {
        const name = item.Nombre || "";
        const isCash = name.toLowerCase().includes("efectivo");
        return `
          <button class="ventas-payment-option${String(item.Id) === selectedId ? " is-active" : ""}" type="button" data-medio-pago="${item.Id}">
            <span class="ventas-payment-icon ${isCash ? "is-cash" : "is-transfer"}">${isCash ? "$" : "QR"}</span>
            <strong>${escapeHtml(name)}</strong>
          </button>
        `;
      }).join("")
      : `<div class="empty-state compact">No hay medios de pago activos.</div>`;

    this.els.ventaMediosPagoButtons.querySelectorAll("[data-medio-pago]").forEach(button => {
      button.addEventListener("click", () => {
        this.els.ventaMedioPagoSelect.value = button.dataset.medioPago;
        this.renderVentaMedioPagoButtons();
        this.updateVentasActionState();
      });
    });
  },

  renderVentaCajaBadge() {
    if (this.state.cajaActual?.Abierta) {
      this.els.ventaCajaBadge.textContent = `Caja #${this.state.cajaActual.Id} abierta`;
      this.els.ventaCajaBadge.className = "soft-badge success";
    } else {
      this.els.ventaCajaBadge.textContent = "Caja no abierta";
      this.els.ventaCajaBadge.className = "soft-badge warn";
    }
  },

  scheduleRenderProductosVenta() {
    window.clearTimeout(this.ventaProductosSearchTimer);
    this.ventaProductosSearchTimer = window.setTimeout(() => this.renderProductosVenta(), 180);
  },

  async handleVentaSearchKeydown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const term = this.els.ventaSearchInput.value.trim().toLowerCase();
    if (!term || !this.state.cajaActual?.Abierta) return;

    let match = this.state.productos.find(producto =>
      producto.Activo &&
      [producto.CodigoBarra, producto.CodigoInterno, producto.Nombre]
        .filter(Boolean)
        .some(value => value.toLowerCase() === term)
    );

    if (!match) {
      try {
        const page = await this.fetchVentaProductosPage({ term, pageIndex: 1, pageSize: 10 });
        match = (page.Items || []).find(producto =>
          producto.Activo &&
          [producto.CodigoBarra, producto.CodigoInterno, producto.Nombre]
            .filter(Boolean)
            .some(value => value.toLowerCase() === term)
        );
      } catch (error) {
        this.toast(this.getErrorMessage(error), "error");
        return;
      }
    }

    if (match) {
      this.addToCart(match.Id);
      this.els.ventaSearchInput.select();
      this.toast(`Agregado: ${match.Nombre}`, "info");
    } else {
      this.toast("No encontré una coincidencia exacta para agregar.", "error");
    }
  },

  async fetchVentaProductosPage({ term, pageIndex, pageSize }) {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize),
      estado: "activos"
    });

    if (term) params.set("search", term);
    if (this.ventaCategoriaFiltro) params.set("categoriaId", String(this.ventaCategoriaFiltro));

    const page = await this.api.request(`${API_ENDPOINTS.productosPaginado}?${params.toString()}`);
    const items = page.Items || [];
    const byId = new Map(this.state.productos.map(producto => [producto.Id, producto]));
    items.forEach(producto => byId.set(producto.Id, producto));
    this.state.productos = Array.from(byId.values());
    return page;
  },

  async renderProductosVenta() {
    if (!this.els.productosVentaList) return;

    const term = this.els.ventaSearchInput.value.trim().toLowerCase();
    if (this.ventaLastSearchTerm !== term) {
      this.ventaLastSearchTerm = term;
      this.ventaProductosPageIndex = 1;
    }

    const pageSize = this.ventaProductosPageSize || 10;
    const requestId = (this.ventaProductosRequestId || 0) + 1;
    this.ventaProductosRequestId = requestId;

    let productosPage;
    try {
      productosPage = await this.fetchVentaProductosPage({
        term,
        pageIndex: this.ventaProductosPageIndex || 1,
        pageSize
      });
    } catch (error) {
      if (requestId !== this.ventaProductosRequestId) return;
      this.els.productosVentaList.innerHTML = `
        <div class="empty-state">
          <strong>No se pudieron cargar productos</strong>
          <small>${escapeHtml(this.getErrorMessage(error))}</small>
        </div>
      `;
      this.renderVentaProductsPagination(0);
      return;
    }

    if (requestId !== this.ventaProductosRequestId) return;

    const productos = productosPage.Items || [];
    const totalItems = Number(productosPage.TotalItems || productos.length);
    const totalPages = Math.max(1, Number(productosPage.TotalPages || Math.ceil(totalItems / pageSize)));
    this.ventaProductosPageIndex = Math.min(Math.max(1, Number(productosPage.PageIndex || 1)), totalPages);

    this.els.ventaSearchHint.textContent = term
      ? `Resultados: ${formatNumber(totalItems)}. Presioná Enter para agregar una coincidencia exacta.`
      : "Escaneá un producto o buscá por nombre, código interno o código de barras.";

    if (!productos.length) {
      this.els.productosVentaList.innerHTML = `
        <div class="empty-state">
          <strong>No encontramos productos</strong>
          <small>Revisá el nombre, código interno o código de barras ingresado.</small>
        </div>
      `;
      this.renderVentaProductsPagination(0);
      return;
    }

    this.els.productosVentaList.innerHTML = productos.map(producto => {
      return `
        <article class="ventas-product-row">
          <button class="ventas-product-main" type="button" data-action="add-to-cart" data-id="${producto.Id}">
            <h4>${escapeHtml(producto.Nombre)}</h4>
            <div class="meta-line">${escapeHtml(producto.CodigoInterno || producto.CodigoBarra || "Sin código")}</div>
          </button>
          <strong>${formatMoney(producto.Precio)}</strong>
          <button class="ventas-add-button" type="button" data-action="add-to-cart" data-id="${producto.Id}">+</button>
        </article>
      `;
    }).join("");

    this.renderVentaProductsPagination(totalItems);

    this.els.productosVentaList.querySelectorAll("[data-action='add-to-cart']").forEach(button => {
      button.addEventListener("click", () => this.addToCart(Number(button.dataset.id)));
      button.disabled = !this.state.cajaActual?.Abierta;
    });
  },

  renderVentaProductsPagination(totalItems) {
    if (!this.els.ventaProductsPagination) return;

    if (!totalItems) {
      this.els.ventaProductsPagination.innerHTML = "";
      return;
    }

    const pageSize = this.ventaProductosPageSize || 10;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const pageIndex = Math.min(Math.max(1, this.ventaProductosPageIndex || 1), totalPages);
    const from = (pageIndex - 1) * pageSize + 1;
    const to = Math.min(pageIndex * pageSize, totalItems);

    this.els.ventaProductsPagination.innerHTML = `
      <span>Mostrando ${formatNumber(from)}-${formatNumber(to)} de ${formatNumber(totalItems)}</span>
      <div>
        <button type="button" data-venta-page="prev" ${pageIndex <= 1 ? "disabled" : ""}>Anterior</button>
        <strong>${formatNumber(pageIndex)} / ${formatNumber(totalPages)}</strong>
        <button type="button" data-venta-page="next" ${pageIndex >= totalPages ? "disabled" : ""}>Siguiente</button>
      </div>
    `;

    this.els.ventaProductsPagination.querySelector("[data-venta-page='prev']")?.addEventListener("click", () => {
      this.ventaProductosPageIndex = Math.max(1, pageIndex - 1);
      this.renderProductosVenta();
    });

    this.els.ventaProductsPagination.querySelector("[data-venta-page='next']")?.addEventListener("click", () => {
      this.ventaProductosPageIndex = Math.min(totalPages, pageIndex + 1);
      this.renderProductosVenta();
    });
  },

  async addToCart(productoId) {
    const producto = this.state.productos.find(item => item.Id === productoId);
    if (!producto) return;

    const existing = this.state.cart.find(item => item.productoId === productoId);
    const cantidad = this.getVentasConfig().pedirCantidadAlAgregarProducto
      ? await this.requestCartQuantity(producto, existing?.cantidad || 0)
      : 1;

    if (!cantidad) return;

    const nextQuantity = (existing?.cantidad || 0) + cantidad;

    if (nextQuantity > Number(producto.Stock)) {
      this.toast("No hay stock suficiente para seguir agregando ese producto.", "error");
      return;
    }

    if (existing) {
      existing.cantidad = nextQuantity;
    } else {
      this.state.cart.push({ productoId, cantidad, producto });
    }

    this.renderCart();
    this.updateVentasActionState();
  },

  requestCartQuantity(producto, cantidadActual = 0) {
    return new Promise(resolve => {
      this.pendingQuantityResolve = resolve;
      const disponible = Math.max(0, Number(producto.Stock) - Number(cantidadActual));
      this.els.modalEyebrow.textContent = "Ventas";
      this.els.modalTitle.textContent = "Cantidad a agregar";
      this.els.modalForm.noValidate = true;
      this.els.modalForm.innerHTML = `
        <label class="field">
          <span>${escapeHtml(producto.Nombre)}</span>
          <input name="Cantidad" type="number" min="1" max="${disponible}" step="1" inputmode="numeric" value="1" required>
        </label>
        <div class="helper-inline">Disponible: ${formatNumber(disponible)} unidad(es)</div>
        <div class="modal-actions">
          <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
          <button class="btn btn-primary" type="submit">Agregar</button>
        </div>
      `;

      this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
      this.els.modalForm.onsubmit = event => {
        event.preventDefault();
        const cantidadText = String(new FormData(this.els.modalForm).get("Cantidad") || "").trim();
        const cantidad = Number(cantidadText);
        if (!cantidadText) {
          this.toast("Ingresa una cantidad para agregar al carrito.", "error");
          return;
        }
        if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > disponible) {
          this.toast(`La cantidad debe ser un número entero entre 1 y ${formatNumber(disponible)}.`, "error");
          return;
        }
        this.pendingQuantityResolve = null;
        this.closeModal();
        resolve(cantidad);
      };

      this.els.modalRoot.classList.remove("hidden");
      this.els.modalForm.Cantidad.focus();
      this.els.modalForm.Cantidad.select();
    });
  },

  async changeCartQuantity(productoId, delta) {
    const item = this.state.cart.find(cartItem => cartItem.productoId === productoId);
    if (!item) return;

    const next = item.cantidad + delta;
    if (next <= 0) {
      if (this.getVentasConfig().confirmarEliminarItemCarrito) {
        const confirmed = await this.requestConfirmation({
          eyebrow: "Carrito",
          title: "Eliminar ítem",
          message: `Vas a quitar ${item.producto.Nombre} del carrito.`,
          confirmLabel: "Eliminar"
        });
        if (!confirmed) return;
      }

      this.state.cart = this.state.cart.filter(cartItem => cartItem.productoId !== productoId);
    } else if (next > Number(item.producto.Stock)) {
      this.toast("Stock insuficiente para esa cantidad.", "error");
      return;
    } else {
      item.cantidad = next;
    }

    this.renderCart();
    this.updateVentasActionState();
  },

  clearCart({ keepCliente = true } = {}) {
    this.state.cart = [];
    this.els.ventaDescuentoInput.value = "0";
    this.els.ventaRecargoInput.value = "0";
    this.els.ventaObservacionesInput.value = "";
    if (!keepCliente) {
      this.els.ventaClienteSelect.value = "";
    }
    this.renderCart();
    this.updateVentasActionState();
  },

  getCartSubtotal() {
    return this.state.cart.reduce((acc, item) => acc + item.cantidad * Number(item.producto.Precio), 0);
  },

  getCartDiscountPercent() {
    const max = this.getVentasConfig().descuentoMaximoPermitido;
    const value = Number(this.els.ventaDescuentoInput.value || 0);
    return Math.min(Math.max(value, 0), max);
  },

  getCartDiscountAmount() {
    return this.getCartSubtotal() * this.getCartDiscountPercent() / 100;
  },

  getCartTotal() {
    const total = this.getCartSubtotal()
      - this.getCartDiscountAmount()
      + Number(this.els.ventaRecargoInput.value || 0);
    return this.applyCartRounding(total);
  },

  applyCartRounding(total) {
    const step = this.getVentasConfig().redondeoTotal === "1.00"
      ? 1
      : this.getVentasConfig().redondeoTotal === "0.05"
        ? 0.05
        : 0;
    return step > 0 ? Math.round(total / step) * step : Math.round(total * 100) / 100;
  },

  getCartItemCount() {
    return this.state.cart.length;
  },

  getCartUnitCount() {
    return this.state.cart.reduce((acc, item) => acc + Number(item.cantidad), 0);
  },

  renderCart() {
    if (!this.state.cart.length) {
      this.els.cartItems.innerHTML = `
        <div class="empty-state ventas-empty-cart">
          <strong>Carrito vacío</strong>
          <small>Buscá un producto o escaneá su código para agregarlo a la venta.</small>
        </div>
      `;
    } else {
      this.els.cartItems.innerHTML = this.state.cart.map(item => `
        <article class="ventas-cart-row">
          <div class="ventas-cart-product">
            <h4>${escapeHtml(item.producto.Nombre)}</h4>
            <span>${escapeHtml(item.producto.CodigoInterno || item.producto.CodigoBarra || "Sin código")}</span>
          </div>
          <div class="ventas-qty-control">
            <button type="button" data-action="cart-dec" data-id="${item.productoId}">−</button>
            <span>${formatNumber(item.cantidad)}</span>
            <button type="button" data-action="cart-inc" data-id="${item.productoId}">+</button>
          </div>
          <strong>${formatMoney(item.producto.Precio)}</strong>
          <strong>${formatMoney(item.cantidad * item.producto.Precio)}</strong>
        </article>
      `).join("");

      this.els.cartItems.querySelectorAll("[data-action='cart-dec']").forEach(button => {
        button.addEventListener("click", () => this.changeCartQuantity(Number(button.dataset.id), -1));
      });

      this.els.cartItems.querySelectorAll("[data-action='cart-inc']").forEach(button => {
        button.addEventListener("click", () => this.changeCartQuantity(Number(button.dataset.id), 1));
      });
    }

    this.els.cartSubtotal.textContent = formatMoney(this.getCartSubtotal());
    this.els.cartTotal.textContent = formatMoney(this.getCartTotal());
    if (this.els.ventaChargeAmount) this.els.ventaChargeAmount.textContent = formatMoney(this.getCartTotal());
    this.els.ventaDescuentoInput.max = String(this.getVentasConfig().descuentoMaximoPermitido);
    this.els.cartSummaryMeta.textContent = this.state.cart.length
      ? `${this.getCartItemCount()} ítem(s) | ${formatNumber(this.getCartUnitCount())} unidad(es) | Descuento ${formatNumber(this.getCartDiscountPercent())}%`
      : "Carrito vacío.";
  },

  updateVentasActionState() {
    const canSell = Boolean(this.state.cajaActual?.Abierta);
    const canCheckout = canSell && this.state.cart.length > 0;

    this.els.confirmSaleButton.disabled = !canCheckout;
    this.els.ventaSearchInput.disabled = false;
    this.els.ventaClienteSelect.disabled = !canSell;
    this.els.ventaMedioPagoSelect.disabled = !canSell;
    this.els.ventaDescuentoInput.disabled = !canSell;
    this.els.ventaRecargoInput.disabled = !canSell;
    this.els.ventaObservacionesInput.disabled = !canSell;
    this.els.clearCartButton.disabled = !canSell;
    if (this.els.ventaScanButton) this.els.ventaScanButton.disabled = false;
    if (this.els.printLastTicketButton) this.els.printLastTicketButton.disabled = !this.state.ventas.length;
    this.els.ventaMediosPagoButtons?.querySelectorAll("button").forEach(button => {
      button.disabled = !canSell;
    });
  },

  toggleVentaNote() {
    if (!this.els.ventaNotaRow) return;
    this.els.ventaNotaRow.classList.toggle("hidden");
    if (!this.els.ventaNotaRow.classList.contains("hidden")) {
      this.els.ventaObservacionesInput.focus();
    }
  },

  async printLastVentaTicket() {
    const venta = this.getRecentVentas(1)[0];
    if (!venta) {
      this.toast("Todavía no hay una venta para reimprimir.", "error");
      return;
    }

    try {
      const ventaCompleta = await this.api.request(`/api/ventas/${venta.Id}`);
      const ticketItems = (ventaCompleta.Detalles || []).map(detalle => ({
        nombre: detalle.ProductoNombre || detalle.Producto?.Nombre || "Producto",
        cantidad: detalle.Cantidad,
        precio: detalle.PrecioUnitario
      }));

      this.openTicketModal(ventaCompleta, ticketItems);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    }
  },

  async submitVenta() {
    if (!this.state.cajaActual?.Abierta) {
      this.toast("Debes abrir caja antes de vender.", "error");
      return;
    }

    if (!this.state.cart.length) {
      this.toast("Agrega al menos un producto al carrito.", "error");
      return;
    }

    const medioPagoId = Number(this.els.ventaMedioPagoSelect.value);
    if (!medioPagoId) {
      this.toast("Selecciona un medio de pago.", "error");
      return;
    }

    const total = this.getCartTotal();
    if (total < 0) {
      this.toast("El total no puede ser negativo.", "error");
      return;
    }

    const descuento = this.getCartDiscountPercent();
    if (Number(this.els.ventaDescuentoInput.value || 0) > this.getVentasConfig().descuentoMaximoPermitido) {
      this.toast(`El descuento máximo permitido es ${formatNumber(this.getVentasConfig().descuentoMaximoPermitido)}%.`, "error");
      return;
    }

    const ticketItems = this.state.cart.map(item => ({
      nombre: item.producto.Nombre,
      cantidad: item.cantidad,
      precio: item.producto.Precio
    }));

    const payload = {
      MedioPagoId: medioPagoId,
      UsuarioId: this.state.session.UsuarioId,
      ClienteId: this.els.ventaClienteSelect.value ? Number(this.els.ventaClienteSelect.value) : null,
      Observaciones: this.els.ventaObservacionesInput.value.trim() || null,
      Descuento: descuento,
      Recargo: Number(this.els.ventaRecargoInput.value || 0),
      Detalles: this.state.cart.map(item => ({
        ProductoId: item.productoId,
        Cantidad: item.cantidad
      }))
    };

    setButtonLoading(this.els.confirmSaleButton, true, "Procesando...");

    try {
      const venta = await this.api.request("/api/ventas", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      this.toast(`Venta #${venta.Id} registrada.`, "success");
      this.openTicketModal(venta, ticketItems);
      this.clearCart({ keepCliente: this.getVentasConfig().mantenerClienteAlFinalizarVenta });
      await Promise.all([this.loadProductos(), this.loadCaja(), this.loadDashboard(), this.loadReportes(), this.loadVentas()]);
      this.renderVentasView();
      this.renderDashboard();
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(this.els.confirmSaleButton, false, "Cobrar");
      this.updateVentasActionState();
    }
  },

  renderVentasRecientesTable() {
    if (!this.els.ventasRecientesTableBody) return;

    const ventas = this.getRecentVentas(8);
    this.els.ventasRecientesTableBody.innerHTML = ventas.length
      ? ventas.map(venta => `
        <article class="ventas-recent-item">
          <div>
            <strong>#${venta.Id}</strong>
            <span>${formatDateTime(venta.Fecha)}</span>
          </div>
          <div>
            <span>${formatNumber(venta.Detalles?.length || 0)} ítem(s)</span>
            <strong>${formatMoney(venta.Total)}</strong>
          </div>
        </article>
      `).join("")
      : `<div class="empty-state compact">Todavía no hay ventas recientes.</div>`;
  }
};
