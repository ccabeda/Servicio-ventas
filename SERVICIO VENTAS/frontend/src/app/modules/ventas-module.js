import { formatDateTime, formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { rowEmpty, setButtonLoading } from "../../utils/ui.js";

export const ventasMethods = {
  renderVentasView() {
    this.renderVentaSelectors();
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

  handleVentaSearchKeydown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const term = this.els.ventaSearchInput.value.trim().toLowerCase();
    if (!term || !this.state.cajaActual?.Abierta) return;

    const match = this.state.productos.find(producto =>
      producto.Activo &&
      [producto.CodigoBarra, producto.CodigoInterno, producto.Nombre]
        .filter(Boolean)
        .some(value => value.toLowerCase() === term)
    );

    if (match) {
      this.addToCart(match.Id);
      this.els.ventaSearchInput.select();
      this.toast(`Agregado: ${match.Nombre}`, "info");
    }
  },

  renderProductosVenta() {
    const term = this.els.ventaSearchInput.value.trim().toLowerCase();
    const filtered = this.state.productos
      .filter(producto => producto.Activo)
      .filter(producto => {
        if (!term) return true;
        return [producto.Nombre, producto.CodigoBarra, producto.CodigoInterno]
          .filter(Boolean)
          .some(value => value.toLowerCase().includes(term));
      });

    this.els.ventaSearchHint.textContent = term
      ? `Resultados: ${filtered.length}. Presiona Enter para agregar una coincidencia exacta.`
      : "Escribe o escanea un codigo y presiona Enter para agregar rapido si hay una coincidencia exacta.";

    if (!filtered.length) {
      this.els.productosVentaList.innerHTML = `<div class="empty-state">No hay productos que coincidan con la busqueda.</div>`;
      return;
    }

    this.els.productosVentaList.innerHTML = filtered.map(producto => `
      <article class="product-card">
        <div>
          <h4>${escapeHtml(producto.Nombre)}</h4>
          <div class="meta-line">Stock: ${formatNumber(producto.Stock)} | Precio: ${formatMoney(producto.Precio)}</div>
          <div class="meta-line">${escapeHtml(producto.CodigoInterno || producto.CodigoBarra || "Sin codigo")}</div>
        </div>
        <div class="product-actions">
          <button class="btn btn-secondary" type="button" data-action="add-to-cart" data-id="${producto.Id}">Agregar</button>
        </div>
      </article>
    `).join("");

    this.els.productosVentaList.querySelectorAll("[data-action='add-to-cart']").forEach(button => {
      button.addEventListener("click", () => this.addToCart(Number(button.dataset.id)));
      button.disabled = !this.state.cajaActual?.Abierta;
    });
  },

  addToCart(productoId) {
    const producto = this.state.productos.find(item => item.Id === productoId);
    if (!producto) return;

    const existing = this.state.cart.find(item => item.productoId === productoId);
    const nextQuantity = (existing?.cantidad || 0) + 1;

    if (nextQuantity > Number(producto.Stock)) {
      this.toast("No hay stock suficiente para seguir agregando ese producto.", "error");
      return;
    }

    if (existing) {
      existing.cantidad = nextQuantity;
    } else {
      this.state.cart.push({ productoId, cantidad: 1, producto });
    }

    this.renderCart();
    this.updateVentasActionState();
  },

  changeCartQuantity(productoId, delta) {
    const item = this.state.cart.find(cartItem => cartItem.productoId === productoId);
    if (!item) return;

    const next = item.cantidad + delta;
    if (next <= 0) {
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

  clearCart() {
    this.state.cart = [];
    this.els.ventaDescuentoInput.value = "0";
    this.els.ventaRecargoInput.value = "0";
    this.els.ventaObservacionesInput.value = "";
    this.renderCart();
    this.updateVentasActionState();
  },

  getCartSubtotal() {
    return this.state.cart.reduce((acc, item) => acc + item.cantidad * Number(item.producto.Precio), 0);
  },

  getCartTotal() {
    return this.getCartSubtotal()
      - Number(this.els.ventaDescuentoInput.value || 0)
      + Number(this.els.ventaRecargoInput.value || 0);
  },

  getCartItemCount() {
    return this.state.cart.length;
  },

  getCartUnitCount() {
    return this.state.cart.reduce((acc, item) => acc + Number(item.cantidad), 0);
  },

  renderCart() {
    if (!this.state.cart.length) {
      this.els.cartItems.innerHTML = `<div class="empty-state">Todavia no agregaste productos al carrito.</div>`;
    } else {
      this.els.cartItems.innerHTML = this.state.cart.map(item => `
        <article class="cart-item">
          <div>
            <h4>${escapeHtml(item.producto.Nombre)}</h4>
            <div class="meta-line">${formatMoney(item.producto.Precio)} c/u</div>
          </div>
          <div class="cart-line">
            <div class="cart-actions">
              <button class="icon-btn" type="button" data-action="cart-dec" data-id="${item.productoId}">−</button>
              <span class="qty-chip">${formatNumber(item.cantidad)}</span>
              <button class="icon-btn" type="button" data-action="cart-inc" data-id="${item.productoId}">+</button>
            </div>
            <strong>${formatMoney(item.cantidad * item.producto.Precio)}</strong>
          </div>
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
    this.els.cartSummaryMeta.textContent = this.state.cart.length
      ? `${this.getCartItemCount()} item(s) | ${formatNumber(this.getCartUnitCount())} unidad(es)`
      : "Carrito vacio.";
  },

  updateVentasActionState() {
    const canSell = Boolean(this.state.cajaActual?.Abierta);
    const canCheckout = canSell && this.state.cart.length > 0;

    this.els.confirmSaleButton.disabled = !canCheckout;
    this.els.ventaSearchInput.disabled = !canSell;
    this.els.ventaClienteSelect.disabled = !canSell;
    this.els.ventaMedioPagoSelect.disabled = !canSell;
    this.els.ventaDescuentoInput.disabled = !canSell;
    this.els.ventaRecargoInput.disabled = !canSell;
    this.els.ventaObservacionesInput.disabled = !canSell;
    this.els.clearCartButton.disabled = !canSell;
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
      Descuento: Number(this.els.ventaDescuentoInput.value || 0),
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
      this.clearCart();
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
    const ventas = this.getRecentVentas(8);
    this.els.ventasRecientesTableBody.innerHTML = ventas.length
      ? ventas.map(venta => `
        <tr>
          <td>${formatDateTime(venta.Fecha)}</td>
          <td>#${venta.Id}</td>
          <td>${formatNumber(venta.Detalles?.length || 0)}</td>
          <td>${formatMoney(venta.Total)}</td>
        </tr>
      `).join("")
      : rowEmpty("No hay ventas recientes.", 4);
  }
};
