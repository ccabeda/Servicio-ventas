import { LOW_STOCK_THRESHOLD } from "../../config.js";
import { formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml } from "../../utils/html.js";
import { rowEmpty } from "../../utils/ui.js";

export const inventoryMethods = {
  renderProductosTable() {
    const term = this.els.productosFilterInput.value.trim().toLowerCase();
    const canManageProductos = this.canManageEntity("producto");
    const productos = this.state.productos.filter(producto => {
      if (!term) return true;
      return [producto.Nombre, producto.CodigoBarra, producto.CodigoInterno]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(term));
    });

    if (!productos.length) {
      this.els.productosTableBody.innerHTML = rowEmpty("No hay productos para mostrar.", 8);
      return;
    }

    this.els.productosTableBody.innerHTML = productos.map(producto => `
      <tr>
        <td>${escapeHtml(producto.Nombre)}</td>
        <td>${escapeHtml(producto.CodigoBarra || "-")}</td>
        <td>${escapeHtml(producto.CodigoInterno || "-")}</td>
        <td>${formatMoney(producto.Precio)}</td>
        <td>${formatMoney(producto.Costo)}</td>
        <td><span class="${Number(producto.Stock) <= LOW_STOCK_THRESHOLD ? "stock-pill low" : "stock-pill"}">${formatNumber(producto.Stock)}</span></td>
        <td>${producto.Activo ? "Activo" : "Inactivo"}</td>
        <td class="actions-cell">${canManageProductos
          ? `
            <button class="btn btn-secondary" type="button" data-action="edit-producto" data-id="${producto.Id}">Editar</button>
            <button class="btn btn-danger" type="button" data-action="delete-producto" data-id="${producto.Id}">Eliminar</button>
          `
          : `<span class="muted">Solo lectura</span>`}
        </td>
      </tr>
    `).join("");

    this.els.newProductoButton.classList.toggle("hidden", !canManageProductos);

    if (canManageProductos) {
      this.bindCrudTableActions("producto");
    }
  }
};
