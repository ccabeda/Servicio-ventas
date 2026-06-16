import { API_ENDPOINTS, LOW_STOCK_THRESHOLD } from "../../config.js";
import { formatMoney, formatNumber } from "../../utils/formatters.js";
import { escapeHtml, normalizeOptional } from "../../utils/html.js";
import { rowEmpty, rowSkeleton, rowState, setButtonLoading } from "../../utils/ui.js";

export const inventoryMethods = {
  async renderProductosTable() {
    if (!this.els.productosTableBody) return;

    const canManageProductos = this.canManageEntity("producto");
    this.renderProductosFilters();
    this.renderProductosCategoriesBar();

    const requestId = Symbol("productos-page");
    this.productosPageRequestId = requestId;
    if (!this.els.productosTableBody.children.length) {
      this.els.productosTableBody.innerHTML = rowSkeleton(9, 6);
    }

    try {
      await this.loadProductosPage();
    } catch (error) {
      if (this.productosPageRequestId !== requestId) return;
      this.state.productosPage = this.createEmptyPage(20, this.state.productosPage.PageIndex || 1);
      this.els.productosTableBody.innerHTML = rowState({
        title: "No pudimos cargar los productos",
        description: this.getErrorMessage(error),
        type: "error",
        colspan: 9
      });
      this.renderProductosPagination();
      return;
    }

    if (this.productosPageRequestId !== requestId) return;

    const productos = this.state.productosPage.Items || [];

    if (!productos.length) {
      const hasFilters = Boolean(
        this.els.productosFilterInput.value
        || this.els.productosCategoriaFilter.value
        || this.els.productosMarcaFilter.value
        || this.els.productosEstadoFilter.value !== "activos"
      );
      this.els.productosTableBody.innerHTML = rowState({
        title: hasFilters ? "No encontramos productos con esos filtros" : "Todavía no hay productos cargados",
        description: hasFilters ? "Probá limpiar la búsqueda, cambiar categoría, marca o estado." : "Creá el primer producto o importá un archivo CSV para empezar a vender.",
        colspan: 9
      });
      this.renderProductosPagination();
      return;
    }

    this.els.productosTableBody.innerHTML = productos.map(producto => `
      <tr>
        <td data-label="Producto">
          <div class="product-name-cell">
            <span class="product-thumb">${this.getProductInitial(producto.Nombre)}</span>
            <strong>${escapeHtml(producto.Nombre)}</strong>
          </div>
        </td>
        <td data-label="Código interno">${escapeHtml(producto.CodigoInterno || "-")}</td>
        <td data-label="Código de barras">${escapeHtml(producto.CodigoBarra || "-")}</td>
        <td data-label="Marca">${escapeHtml(producto.Marca || "-")}</td>
        <td data-label="Categoría"><span class="category-pill">${escapeHtml(producto.Categoria || "Sin categoría")}</span></td>
        <td data-label="Precio">${formatMoney(producto.Precio)}</td>
        <td data-label="Stock"><span class="${Number(producto.Stock) <= LOW_STOCK_THRESHOLD ? "stock-pill low" : "stock-pill"}">${formatNumber(producto.Stock)}</span></td>
        <td data-label="Estado"><span class="${producto.Activo ? "status-badge active" : "status-badge inactive"}">${producto.Activo ? "Activo" : "Inactivo"}</span></td>
        <td data-label="Acciones" class="actions-cell">${canManageProductos
          ? `
            <button class="icon-btn product-action-btn" type="button" data-action="edit-producto" data-id="${producto.Id}" aria-label="Editar producto">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
            </button>
            <button class="icon-btn product-action-btn stock-text-btn" type="button" data-action="stock-producto" data-id="${producto.Id}" aria-label="Ajustar stock">Stock</button>
            <button class="icon-btn product-action-btn" type="button" data-action="product-menu" data-id="${producto.Id}" aria-label="Más opciones del producto">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12h.01" /><path d="M12 5h.01" /><path d="M12 19h.01" /></svg>
            </button>
          `
          : `<span class="muted">Solo lectura</span>`}
        </td>
      </tr>
    `).join("");

    this.els.newProductoButton.classList.toggle("hidden", !canManageProductos);
    this.els.importProductosButton.classList.toggle("hidden", !canManageProductos);
    this.els.manageMarcasButton.classList.toggle("hidden", !canManageProductos);
    this.renderProductosPagination();

    if (canManageProductos) {
      this.bindCrudTableActions("producto");
      this.bindProductOptionsActions();
    }
  },

  openMarcasManagerModal() {
    if (!this.canManageEntity("marcaProducto")) {
      this.toast("No tienes permisos para gestionar marcas.", "error");
      return;
    }

    this.els.modalEyebrow.textContent = "Inventario";
    this.els.modalTitle.textContent = "Gestionar marcas";
    this.els.modalRoot.querySelector(".modal-card")?.classList.add("marcas-manager-modal");
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.innerHTML = `
      <div class="modal-toolbar">
        <button class="btn btn-primary" type="button" data-action="new-marca-producto">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
          Nueva marca
        </button>
      </div>
      <div class="table-wrap marcas-manager-table">
        <table class="data-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.state.marcasProducto.length
              ? this.state.marcasProducto.map(marca => `
                <tr>
                  <td><strong>${escapeHtml(marca.Nombre)}</strong></td>
                  <td><span class="${marca.Activa ? "status-badge active" : "status-badge inactive"}">${marca.Activa ? "Activa" : "Inactiva"}</span></td>
                  <td class="actions-cell">
                    <button class="icon-btn product-action-btn" type="button" data-action="edit-marca-producto" data-id="${marca.Id}" aria-label="Editar marca">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                    </button>
                    <button class="icon-btn product-action-btn" type="button" data-action="delete-marca-producto" data-id="${marca.Id}" aria-label="Desactivar marca" ${marca.Activa ? "" : "disabled"}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                    </button>
                  </td>
                </tr>
              `).join("")
              : rowEmpty("No hay marcas cargadas.", 3)}
          </tbody>
        </table>
      </div>
      <div class="helper-inline">Las marcas inactivas no aparecen para nuevos productos ni para importar CSV.</div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cerrar</button>
      </div>
    `;

    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.querySelector("[data-action='new-marca-producto']").addEventListener("click", () => this.openEntityModal("marcaProducto"));
    this.els.modalForm.querySelectorAll("[data-action='edit-marca-producto']").forEach(button => {
      button.addEventListener("click", () => this.openEntityModal("marcaProducto", Number(button.dataset.id)));
    });
    this.els.modalForm.querySelectorAll("[data-action='delete-marca-producto']").forEach(button => {
      button.addEventListener("click", () => this.deleteEntity("marcaProducto", Number(button.dataset.id)));
    });
    this.els.modalRoot.classList.remove("hidden");
  },

  openImportProductosFilePicker() {
    if (!this.canManageEntity("producto")) {
      this.toast("No tienes permisos para importar productos.", "error");
      return;
    }

    this.els.importProductosInput.value = "";
    this.els.importProductosInput.click();
  },

  async handleImportProductosFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      this.toast("Selecciona un archivo CSV.", "error");
      return;
    }

    setButtonLoading(this.els.importProductosButton, true, "Importando...");

    try {
      const text = await file.text();
      const rows = this.parseProductosCsv(text);
      const result = await this.importProductosRows(rows);
      await Promise.all([this.loadProductos(), this.loadCategoriasProducto(), this.loadMarcasProducto()]);
      this.renderProductosTable();
      this.renderProductosVenta();
      this.renderDashboardStockAlerts();
      this.showImportProductosResult(result);
    } catch (error) {
      this.toast(this.getErrorMessage(error), "error");
    } finally {
      setButtonLoading(this.els.importProductosButton, false, "Importar productos");
      event.target.value = "";
    }
  },

  parseProductosCsv(text) {
    const lines = this.parseCsvText(text).filter(row => row.some(cell => String(cell).trim()));
    if (lines.length < 2) {
      throw new Error("El CSV debe incluir encabezados y al menos un producto.");
    }

    const headers = lines[0].map(header => this.normalizeCsvKey(header));
    const requiredHeaders = ["nombre", "precio", "costo", "stock"];
    const missing = requiredHeaders.filter(header => !headers.includes(header));
    if (missing.length) {
      throw new Error(`Faltan columnas obligatorias: ${missing.join(", ")}.`);
    }

    return lines.slice(1).map((cells, index) => {
      const row = {};
      headers.forEach((header, cellIndex) => {
        row[header] = String(cells[cellIndex] ?? "").trim();
      });
      row.__line = index + 2;
      return row;
    });
  },

  parseCsvText(text) {
    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === "\"") {
        if (insideQuotes && next === "\"") {
          value += "\"";
          index += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        row.push(value);
        value = "";
      } else if ((char === "\n" || char === "\r") && !insideQuotes) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      } else {
        value += char;
      }
    }

    row.push(value);
    rows.push(row);
    return rows;
  },

  normalizeCsvKey(value) {
    return String(value || "")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  },

  normalizeLookupText(value) {
    return String(value || "")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  },

  parseCsvNumber(value, fieldName, line) {
    const text = String(value || "").trim();
    if (!text) {
      throw new Error(`Línea ${line}: ${fieldName} es obligatorio.`);
    }

    const clean = text
      .replace(/\s/g, "")
      .replace(/\$/g, "");
    const lastComma = clean.lastIndexOf(",");
    const lastDot = clean.lastIndexOf(".");
    let normalized = clean;

    if (lastComma > -1 && lastDot > -1) {
      normalized = lastComma > lastDot
        ? clean.replace(/\./g, "").replace(",", ".")
        : clean.replace(/,/g, "");
    } else if (lastComma > -1) {
      normalized = clean.replace(/\./g, "").replace(",", ".");
    } else if ((clean.match(/\./g) || []).length > 1) {
      normalized = clean.replace(/\./g, "");
    }

    const number = Number(normalized);
    if (!Number.isFinite(number) || number < 0) {
      throw new Error(`Línea ${line}: ${fieldName} no es válido.`);
    }

    return number;
  },

  parseCsvInteger(value, fieldName, line) {
    const number = this.parseCsvNumber(value, fieldName, line);
    if (!Number.isInteger(number)) {
      throw new Error(`Línea ${line}: ${fieldName} debe ser un número entero.`);
    }

    return number;
  },

  getCsvBoolean(value) {
    const normalized = this.normalizeLookupText(value);
    if (!normalized) return true;
    return !["false", "no", "0", "inactivo", "inactiva"].includes(normalized);
  },

  findCsvEntityId(value, items, idKey = "id") {
    const text = String(value || "").trim();
    if (!text) return null;

    const numeric = Number(text);
    if (Number.isInteger(numeric) && items.some(item => Number(item.Id) === numeric)) {
      return numeric;
    }

    const normalized = this.normalizeLookupText(text);
    const match = items.find(item => this.normalizeLookupText(item.Nombre) === normalized);
    if (!match) {
      throw new Error(`${idKey} "${text}" no existe.`);
    }

    return match.Id;
  },

  buildProductoPayloadFromCsvRow(row) {
    const line = row.__line;
    const nombre = String(row.nombre || "").trim();
    if (!nombre) {
      throw new Error(`Línea ${line}: nombre es obligatorio.`);
    }

    let categoriaId = null;
    let marcaId = null;

    try {
      categoriaId = row.categoriaid
        ? this.findCsvEntityId(row.categoriaid, this.state.categoriasProducto, "CategoriaId")
        : this.findCsvEntityId(row.categoria, this.state.categoriasProducto, "Categoria");
      marcaId = row.marcaid
        ? this.findCsvEntityId(row.marcaid, this.state.marcasProducto.filter(marca => marca.Activa), "MarcaId")
        : this.findCsvEntityId(row.marca, this.state.marcasProducto.filter(marca => marca.Activa), "Marca");
    } catch (error) {
      throw new Error(`Línea ${line}: ${error.message}`);
    }

    return {
      Nombre: nombre,
      CodigoBarra: normalizeOptional(row.codigobarra),
      CodigoInterno: normalizeOptional(row.codigointerno),
      CategoriaId: categoriaId,
      MarcaId: marcaId,
      Precio: this.parseCsvNumber(row.precio, "precio", line),
      Costo: this.parseCsvNumber(row.costo, "costo", line),
      Stock: this.parseCsvInteger(row.stock, "stock", line),
      Activo: this.getCsvBoolean(row.activo)
    };
  },

  async importProductosRows(rows) {
    const result = {
      imported: 0,
      failed: 0,
      errors: []
    };

    for (const row of rows) {
      try {
        const payload = this.buildProductoPayloadFromCsvRow(row);
        await this.api.request(API_ENDPOINTS.productos, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        result.imported += 1;
      } catch (error) {
        result.failed += 1;
        result.errors.push(this.getErrorMessage(error));
      }
    }

    return result;
  },

  showImportProductosResult(result) {
    if (!result.failed) {
      this.toast(`Importación completa: ${result.imported} producto(s).`, "success");
      return;
    }

    this.els.modalEyebrow.textContent = "Importación CSV";
    this.els.modalTitle.textContent = "Resultado de importación";
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.innerHTML = `
      <div class="helper-inline">Importados: ${result.imported} | Con error: ${result.failed}</div>
      <div class="import-errors-list">
        ${result.errors.slice(0, 10).map(error => `<p>${escapeHtml(error)}</p>`).join("")}
        ${result.errors.length > 10 ? `<p>${result.errors.length - 10} error(es) más.</p>` : ""}
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cerrar</button>
      </div>
    `;
    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalRoot.classList.remove("hidden");
  },

  bindProductOptionsActions() {
    this.els.productosTableBody.querySelectorAll("[data-action='stock-producto']").forEach(button => {
      button.addEventListener("click", () => this.openStockProductoModal(Number(button.dataset.id)));
    });

    this.els.productosTableBody.querySelectorAll("[data-action='product-menu']").forEach(button => {
      button.addEventListener("click", event => {
        event.stopPropagation();
        const rect = button.getBoundingClientRect();
        this.openProductoContextMenu(Number(button.dataset.id), rect.right, rect.bottom + 6);
      });
    });
  },

  resetProductosPageAndRender() {
    this.state.productosPage.PageIndex = 1;
    this.renderProductosTable();
  },

  renderProductosPagination() {
    [
      { container: this.els.productosPaginationTop, prefix: "productos-top-" },
      { container: this.els.productosPagination, prefix: "productos-bottom-" }
    ].filter(item => item.container).forEach(({ container, prefix }) => {
      this.renderPagination({
        page: this.state.productosPage,
        container,
        label: "productos",
        pageSizeFallback: 20,
        actionPrefix: prefix,
        onChange: pageIndex => {
          this.state.productosPage.PageIndex = pageIndex;
          this.renderProductosTable();
        }
      });
    });
  },

  getProductInitial(name) {
    return escapeHtml(String(name || "P").trim().charAt(0).toUpperCase() || "P");
  },

  renderProductosFilters() {
    const selectedCategoria = this.els.productosCategoriaFilter.value || "";
    const selectedMarca = this.els.productosMarcaFilter.value || "";
    const selectedCategoriaItem = this.state.categoriasProducto.find(categoria => String(categoria.Id) === selectedCategoria);
    const selectedMarcaItem = this.state.marcasProducto.find(marca => String(marca.Id) === selectedMarca);

    if (document.activeElement !== this.els.productosCategoriaSearch) {
      this.els.productosCategoriaSearch.value = selectedCategoriaItem?.Nombre || "";
    }

    if (document.activeElement !== this.els.productosMarcaSearch) {
      this.els.productosMarcaSearch.value = selectedMarcaItem?.Nombre || "";
    }

    this.renderProductFilterOptions(
      this.els.productosCategoriaSearch,
      this.els.productosCategoriaOptions,
      this.els.productosCategoriaFilter,
      this.getOrderedCategoriasProducto(),
      "Todas las categorías");
    this.renderProductFilterOptions(
      this.els.productosMarcaSearch,
      this.els.productosMarcaOptions,
      this.els.productosMarcaFilter,
      this.state.marcasProducto,
      "Todas las marcas");
  },

  bindProductFilterCombobox(input, optionsElement, hiddenInput, getItems, emptyLabel) {
    if (!input || !optionsElement || !hiddenInput || input.dataset.boundCombobox) return;

    input.dataset.boundCombobox = "true";

    const render = () => {
      this.renderProductFilterOptions(input, optionsElement, hiddenInput, getItems(), emptyLabel);
      optionsElement.classList.remove("hidden");
    };

    input.addEventListener("input", () => {
      if (!input.value.trim() && hiddenInput.value) {
        hiddenInput.value = "";
        hiddenInput.dispatchEvent(new Event("change"));
      }
      render();
    });

    input.addEventListener("focus", render);

    input.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        optionsElement.classList.add("hidden");
      }
    });

    document.addEventListener("click", event => {
      if (!input.parentElement?.contains(event.target)) {
        optionsElement.classList.add("hidden");
      }
    });
  },

  renderProductFilterOptions(input, optionsElement, hiddenInput, items, emptyLabel) {
    if (!input || !optionsElement || !hiddenInput) return;

    const query = this.normalizeLookupText(input.value);
    const filteredItems = items
      .filter(item => !query || this.normalizeLookupText(item.Nombre).includes(query))
      .slice(0, 20);

    optionsElement.innerHTML = `
      <button class="${hiddenInput.value ? "" : "active"}" type="button" data-filter-value="">${escapeHtml(emptyLabel)}</button>
      ${filteredItems.length
        ? filteredItems.map(item => `
          <button class="${String(item.Id) === String(hiddenInput.value) ? "active" : ""}" type="button" data-filter-value="${item.Id}">
            ${escapeHtml(item.Nombre)}
          </button>
        `).join("")
        : `<div class="filter-combobox-empty">Sin resultados</div>`}
    `;

    optionsElement.querySelectorAll("[data-filter-value]").forEach(button => {
      button.addEventListener("click", () => {
        const value = button.dataset.filterValue || "";
        const selected = items.find(item => String(item.Id) === value);
        hiddenInput.value = value;
        input.value = selected?.Nombre || "";
        optionsElement.classList.add("hidden");
        hiddenInput.dispatchEvent(new Event("change"));
      });
    });
  },

  renderProductosCategoriesBar() {
    const selectedCategoria = this.els.productosCategoriaFilter.value || "";
    const canManageProductos = this.canManageEntity("producto");
    const categoriasHtml = this.getOrderedCategoriasProducto().map(categoria => `
      <button class="${String(categoria.Id) === selectedCategoria ? "active" : ""}" type="button" data-category-id="${categoria.Id}">
        <span class="category-icon" style="color:${escapeHtml(categoria.Color || "var(--brand)")}" aria-hidden="true">${this.getCategoryIconSvg(categoria.Icono)}</span>
        ${escapeHtml(categoria.Nombre)}
      </button>
    `).join("");

    this.els.productosCategoriesBar.innerHTML = `
      <button class="${selectedCategoria ? "" : "active"}" type="button" data-category-id="">Todas</button>
      ${categoriasHtml}
      ${canManageProductos ? `<button class="products-new-category" type="button" data-action="new-categoria-producto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Nueva categoría</button>` : ""}
    `;

    this.els.productosCategoriesBar.querySelectorAll("[data-category-id]").forEach(button => {
      button.addEventListener("click", () => {
        this.els.productosCategoriaFilter.value = button.dataset.categoryId || "";
        this.resetProductosPageAndRender();
      });

      if (button.dataset.categoryId) {
        button.addEventListener("contextmenu", event => {
          event.preventDefault();
          this.openCategoriaContextMenu(Number(button.dataset.categoryId), event.clientX, event.clientY);
        });
      }
    });

    this.els.productosCategoriesBar.querySelector("[data-action='new-categoria-producto']")?.addEventListener("click", () => {
      this.openEntityModal("categoriaProducto");
    });
  },

  syncProductsCategoryBar() {
    this.renderProductosCategoriesBar();
  },

  getOrderedCategoriasProducto() {
    const preferredOrder = ["Bebidas", "Almacén", "Lácteos", "Limpieza", "Panadería", "Golosinas", "Otros"];
    return this.state.categoriasProducto.slice().sort((a, b) => {
      const orderA = this.getCategoriaSortOrder(a.Nombre, preferredOrder);
      const orderB = this.getCategoriaSortOrder(b.Nombre, preferredOrder);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.Nombre.localeCompare(b.Nombre);
    });
  },

  getCategoriaSortOrder(nombre, preferredOrder) {
    const order = preferredOrder.indexOf(nombre);
    if (nombre === "Otros") return preferredOrder.length + 1;
    if (order === -1) return preferredOrder.length;
    return order;
  },

  openCategoriaContextMenu(categoriaId, x, y) {
    this.closeCategoriaContextMenu();
    const categoria = this.state.categoriasProducto.find(item => item.Id === categoriaId);
    if (!categoria || !this.canManageEntity("categoriaProducto")) return;

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.innerHTML = `
      <button type="button" data-action="edit">Editar categoría</button>
      <button type="button" data-action="delete">Eliminar categoría</button>
    `;
    document.body.appendChild(menu);

    const menuRect = menu.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - menuRect.width - 12);
    const top = Math.min(y, window.innerHeight - menuRect.height - 12);
    menu.style.left = `${Math.max(12, left)}px`;
    menu.style.top = `${Math.max(12, top)}px`;

    const closeOnClick = event => {
      if (!menu.contains(event.target)) {
        this.closeCategoriaContextMenu();
      }
    };

    const closeOnEscape = event => {
      if (event.key === "Escape") {
        this.closeCategoriaContextMenu();
      }
    };

    menu.querySelector("[data-action='edit']").addEventListener("click", () => {
      this.closeCategoriaContextMenu();
      this.openEntityModal("categoriaProducto", categoriaId);
    });

    menu.querySelector("[data-action='delete']").addEventListener("click", () => {
      this.closeCategoriaContextMenu();
      this.deleteEntity("categoriaProducto", categoriaId);
    });

    this.categoryContextMenu = { element: menu, closeOnClick, closeOnEscape };
    window.setTimeout(() => document.addEventListener("click", closeOnClick), 0);
    document.addEventListener("keydown", closeOnEscape);
  },

  closeCategoriaContextMenu() {
    if (!this.categoryContextMenu) return;
    document.removeEventListener("click", this.categoryContextMenu.closeOnClick);
    document.removeEventListener("keydown", this.categoryContextMenu.closeOnEscape);
    this.categoryContextMenu.element.remove();
    this.categoryContextMenu = null;
  },

  openProductoContextMenu(productoId, x, y) {
    this.closeProductoContextMenu();
    const producto = this.findProductoForActions(productoId);
    if (!producto || !this.canManageEntity("producto")) return;

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.innerHTML = `
      <button type="button" data-action="detail">Ver detalle</button>
      <button type="button" data-action="stock">Ajustar stock</button>
      <button type="button" data-action="duplicate">Duplicar producto</button>
      <button type="button" data-action="delete">Eliminar producto</button>
    `;
    document.body.appendChild(menu);

    const menuRect = menu.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - menuRect.width - 12);
    const top = Math.min(y, window.innerHeight - menuRect.height - 12);
    menu.style.left = `${Math.max(12, left)}px`;
    menu.style.top = `${Math.max(12, top)}px`;

    const closeOnClick = event => {
      if (!menu.contains(event.target)) {
        this.closeProductoContextMenu();
      }
    };

    const closeOnEscape = event => {
      if (event.key === "Escape") {
        this.closeProductoContextMenu();
      }
    };

    menu.querySelector("[data-action='detail']").addEventListener("click", () => {
      this.closeProductoContextMenu();
      this.openProductoDetailModal(productoId);
    });

    menu.querySelector("[data-action='stock']").addEventListener("click", () => {
      this.closeProductoContextMenu();
      this.openStockProductoModal(productoId);
    });

    menu.querySelector("[data-action='duplicate']").addEventListener("click", () => {
      this.closeProductoContextMenu();
      this.openDuplicateProductoModal(productoId);
    });

    menu.querySelector("[data-action='delete']").addEventListener("click", () => {
      this.closeProductoContextMenu();
      this.deleteEntity("producto", productoId);
    });

    this.productContextMenu = { element: menu, closeOnClick, closeOnEscape };
    window.setTimeout(() => document.addEventListener("click", closeOnClick), 0);
    document.addEventListener("keydown", closeOnEscape);
  },

  closeProductoContextMenu() {
    if (!this.productContextMenu) return;
    document.removeEventListener("click", this.productContextMenu.closeOnClick);
    document.removeEventListener("keydown", this.productContextMenu.closeOnEscape);
    this.productContextMenu.element.remove();
    this.productContextMenu = null;
  },

  findProductoForActions(productoId) {
    return this.state.productosPage.Items?.find(item => item.Id === productoId)
      || this.state.productos.find(item => item.Id === productoId)
      || null;
  },

  openProductoDetailModal(productoId) {
    const producto = this.findProductoForActions(productoId);
    if (!producto) {
      this.toast("Producto no encontrado.", "error");
      return;
    }

    const margen = Number(producto.Precio || 0) - Number(producto.Costo || 0);
    const margenPorcentaje = Number(producto.Precio) > 0
      ? `${((margen / Number(producto.Precio)) * 100).toFixed(1)}%`
      : "-";
    const fechaCreacion = producto.FechaCreacion
      ? new Date(producto.FechaCreacion).toLocaleString("es-AR")
      : "-";
    const fechaActualizacion = producto.FechaActualizacion
      ? new Date(producto.FechaActualizacion).toLocaleString("es-AR")
      : "-";

    this.els.modalEyebrow.textContent = "Inventario";
    this.els.modalTitle.textContent = "Detalle del producto";
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.innerHTML = `
      <div class="detail-grid">
        <div><span>Producto</span><strong>${escapeHtml(producto.Nombre)}</strong></div>
        <div><span>Estado</span><strong>${producto.Activo ? "Activo" : "Inactivo"}</strong></div>
        <div><span>Código interno</span><strong>${escapeHtml(producto.CodigoInterno || "-")}</strong></div>
        <div><span>Código de barras</span><strong>${escapeHtml(producto.CodigoBarra || "-")}</strong></div>
        <div><span>Categoría</span><strong>${escapeHtml(producto.Categoria || "Sin categoría")}</strong></div>
        <div><span>Marca</span><strong>${escapeHtml(producto.Marca || "Sin marca")}</strong></div>
        <div><span>Precio venta</span><strong>${formatMoney(producto.Precio)}</strong></div>
        <div><span>Costo</span><strong>${formatMoney(producto.Costo)}</strong></div>
        <div><span>Margen</span><strong>${formatMoney(margen)} (${margenPorcentaje})</strong></div>
        <div><span>Stock</span><strong>${formatNumber(producto.Stock)}</strong></div>
        <div><span>Creado</span><strong>${escapeHtml(fechaCreacion)}</strong></div>
        <div><span>Actualizado</span><strong>${escapeHtml(fechaActualizacion)}</strong></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cerrar</button>
        <button class="btn btn-primary" type="button" data-role="modal-edit">Editar</button>
      </div>
    `;
    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.querySelector("[data-role='modal-edit']").addEventListener("click", () => {
      this.closeModal();
      this.openEntityModal("producto", productoId);
    });
    this.els.modalRoot.classList.remove("hidden");
  },

  async openStockProductoModal(productoId) {
    const producto = this.findProductoForActions(productoId);
    if (!producto) {
      this.toast("Producto no encontrado.", "error");
      return;
    }

    let movimientos = [];
    try {
      const movimientosPage = await this.api.request(`${API_ENDPOINTS.productos}/${productoId}/stock/movimientos/paginado?pageIndex=1&pageSize=6`);
      movimientos = movimientosPage.Items || [];
    } catch {
      movimientos = [];
    }

    this.els.modalRoot.querySelector(".modal-card")?.classList.add("stock-modal");
    this.els.modalEyebrow.textContent = "Inventario";
    this.els.modalTitle.textContent = "Ajustar stock";
    this.els.modalForm.onsubmit = null;
    this.els.modalForm.noValidate = true;
    this.els.modalForm.innerHTML = `
      <div class="stock-adjust-summary">
        <div>
          <span>Producto</span>
          <strong>${escapeHtml(producto.Nombre)}</strong>
        </div>
        <div>
          <span>Stock actual</span>
          <strong>${formatNumber(producto.Stock)}</strong>
        </div>
      </div>
      <div class="modal-grid-2">
        <label class="field">
          <span>Tipo de movimiento</span>
          <select name="Tipo" required>
            <option value="1">Ingreso</option>
            <option value="2">Salida</option>
            <option value="3">Ajuste manual</option>
          </select>
        </label>
        <label class="field">
          <span>Cantidad</span>
          <input name="Cantidad" type="number" min="1" step="1" inputmode="numeric" required>
        </label>
        <label class="field">
          <span>Motivo</span>
          <select name="Motivo" required>
            <option value="Compra / reposición">Compra / reposición</option>
            <option value="Rotura">Rotura</option>
            <option value="Vencimiento">Vencimiento</option>
            <option value="Error de carga">Error de carga</option>
            <option value="Uso interno">Uso interno</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label class="field">
          <span>Observación</span>
          <input name="Observacion" type="text" maxlength="250" placeholder="Opcional">
        </label>
      </div>
      <div class="stock-history">
        <span class="eyebrow">Últimos movimientos</span>
        ${movimientos.length
          ? movimientos.map(movimiento => `
            <div class="stock-history-row">
              <div>
                <strong>${escapeHtml(this.getStockMovementLabel(movimiento.Tipo))}</strong>
                <span>${escapeHtml(movimiento.Motivo || "-")}</span>
              </div>
              <div>
                <strong>${formatNumber(movimiento.StockAnterior)} -> ${formatNumber(movimiento.StockNuevo)}</strong>
                <span>${escapeHtml(this.formatStockMovementDate(movimiento.Fecha))}</span>
              </div>
            </div>
          `).join("")
          : `<div class="empty-state compact">Todavía no hay movimientos de stock.</div>`}
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-role="modal-cancel">Cancelar</button>
        <button class="btn btn-primary" type="submit">Guardar movimiento</button>
      </div>
    `;

    this.enhanceCustomSelects(this.els.modalForm);
    this.els.modalForm.querySelector("[data-role='modal-cancel']").addEventListener("click", () => this.closeModal());
    this.els.modalForm.onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(this.els.modalForm);
      const cantidadText = String(form.get("Cantidad") || "").trim();
      const motivo = String(form.get("Motivo") || "").trim();
      const payload = {
        Tipo: Number(form.get("Tipo")),
        Cantidad: Number(cantidadText),
        Motivo: motivo,
        Observacion: normalizeOptional(form.get("Observacion"))
      };

      if (!cantidadText) {
        this.toast("Ingresa una cantidad para modificar el stock.", "error");
        return;
      }

      if (!Number.isInteger(payload.Cantidad) || payload.Cantidad <= 0) {
        this.toast("La cantidad debe ser un número entero mayor o igual a 1.", "error");
        return;
      }

      if (!motivo) {
        this.toast("Selecciona un motivo para el movimiento de stock.", "error");
        return;
      }

      try {
        await this.api.request(`${API_ENDPOINTS.productos}/${productoId}/stock`, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        await this.loadProductos();
        await this.renderProductosTable();
        this.renderProductosVenta();
        this.renderDashboardStockAlerts();
        this.closeModal();
        this.toast("Stock actualizado.", "success");
      } catch (error) {
        this.toast(this.getErrorMessage(error), "error");
      }
    };

    this.els.modalRoot.classList.remove("hidden");
  },

  getStockMovementLabel(tipo) {
    const labels = {
      1: "Ingreso",
      2: "Salida",
      3: "Ajuste manual",
      4: "Venta",
      Ingreso: "Ingreso",
      Salida: "Salida",
      Ajuste: "Ajuste manual",
      Venta: "Venta"
    };
    return labels[tipo] || tipo || "-";
  },

  formatStockMovementDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("es-AR");
  },

  openDuplicateProductoModal(productoId) {
    const producto = this.findProductoForActions(productoId);
    if (!producto) {
      this.toast("Producto no encontrado.", "error");
      return;
    }

    this.productoDraft = {
      ...producto,
      Id: null,
      Nombre: `${producto.Nombre} copia`,
      CodigoBarra: "",
      CodigoInterno: "",
      Stock: 0,
      Activo: true
    };
    this.openEntityModal("producto");
  },

  getCategoryIconSvg(iconName) {
    const icons = {
      bottle: `<svg viewBox="0 0 24 24"><path d="M9 2h6" /><path d="M10 2v5l-2 3v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V10l-2-3V2" /><path d="M9 14h6" /></svg>`,
      basket: `<svg viewBox="0 0 24 24"><path d="M4 10h16l-2 10H6L4 10Z" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M9 14h6" /></svg>`,
      milk: `<svg viewBox="0 0 24 24"><path d="M9 2h6l1 5v13a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7l1-5Z" /><path d="M8 9h8" /><path d="M10 13h4" /></svg>`,
      cleaner: `<svg viewBox="0 0 24 24"><path d="M10 2h4l1 5H9l1-5Z" /><path d="M9 7h6l2 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L9 7Z" /><path d="M10 13h4" /></svg>`,
      bread: `<svg viewBox="0 0 24 24"><path d="M4 14c2-5 8-8 14-6 3 1 4 4 2 6-3 4-11 5-16 0Z" /><path d="M8 13c2 1 6 1 9-1" /><path d="M12 8c0 2 2 3 4 3" /></svg>`,
      candy: `<svg viewBox="0 0 24 24"><path d="m5 8 3-3 11 11-3 3L5 8Z" /><path d="m4 12 4-4" /><path d="m16 20 4-4" /><path d="M9 9h.01" /><path d="M13 13h.01" /></svg>`,
      more: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>`
    };

    return icons[iconName] || icons.more;
  }
};
