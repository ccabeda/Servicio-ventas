export function buildConfiguracionView() {
  return `
    <section id="configuracionView" class="view-section hidden">
      <div class="settings-page">
        <header class="settings-head">
          <h3 id="settingsSectionTitle">Datos del negocio</h3>
          <p id="settingsSectionDescription">Administra la información principal que identifica a tu comercio dentro del sistema.</p>
        </header>

        <nav class="settings-tabs" aria-label="Secciones de configuración">
          <button class="active" type="button" data-settings-tab="negocio">Datos del negocio</button>
          <button type="button" data-settings-tab="ticket">Ticket</button>
          <button type="button" data-settings-tab="impresoras">Impresoras</button>
          <button type="button" data-settings-tab="impuestos">Impuestos</button>
          <button type="button" data-settings-tab="usuarios">Usuarios</button>
          <button type="button" data-settings-tab="preferencias">Preferencias</button>
          <button type="button" data-settings-tab="respaldo">Respaldo</button>
        </nav>

        <form id="configuracionForm" class="settings-form" novalidate>
          <div class="business-settings-layout" data-settings-panel="negocio">
            <section class="settings-card business-main-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 21V9l8-6 8 6v12" /><path d="M9 21v-7h6v7" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg></span>
                <div>
                  <h4>Identidad comercial</h4>
                  <p>Datos principales del comercio que se muestran dentro del sistema.</p>
                </div>
              </div>

              <div class="business-form-grid">
                <label class="field field-full">
                  <span>Nombre del negocio</span>
                  <input name="NombreNegocio" type="text" placeholder="Ej: CajaGo Market" required>
                </label>
                <label class="field field-full">
                  <span>Teléfono</span>
                  <input name="Telefono" type="text" placeholder="Ej: 11 2345-6789">
                </label>
                <label class="field field-full">
                  <span>Email</span>
                  <input name="Email" type="email" placeholder="contacto@tungocio.com">
                </label>
                <label class="field field-full">
                  <span>Dirección</span>
                  <input name="Direccion" type="text" placeholder="Ej: Av. Principal 123, Buenos Aires">
                </label>
                <input name="DiasAtencion" type="hidden">
                <input name="HorarioApertura" type="hidden">
                <input name="HorarioCierre" type="hidden">
              </div>
            </section>

            <section class="settings-card business-hours-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                <div>
                  <h4>Horarios de atención</h4>
                  <p id="businessHoursMeta">Sin horarios configurados.</p>
                </div>
              </div>
              <div class="business-hours-summary">
                <strong id="businessHoursSummaryText">Configura los días y rangos horarios del negocio.</strong>
                <button id="businessHoursEditButton" class="btn btn-secondary" type="button">Editar horarios</button>
              </div>
            </section>

            <div class="business-tip home-tip">
              <span aria-hidden="true">!</span>
              <strong>Consejo:</strong>
              <p>Mantené estos datos actualizados para que el ticket y la información del punto de venta salgan completos.</p>
            </div>

            <aside class="business-side-panel">
              <section class="settings-card business-preview-card">
                <div class="business-preview-logo" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M21 15h-2.5c-.398 0-.779.158-1.061.439-.281.281-.439.663-.439 1.061s.158.779.439 1.061c.281.281.663.439 1.061.439h1c.398 0 .779.158 1.061.439.281.281.439.663.439 1.061s-.158.779-.439 1.061c-.281.281-.663.439-1.061.439H17" /><path d="M19 21v1m0-8v1" /><path d="M13 21H6c-.53 0-1.039-.211-1.414-.586C4.211 20.039 4 19.53 4 19V9c0-.53.211-1.039.586-1.414C4.961 7.211 5.47 7 6 7h2m12 3.12V9c0-.53-.211-1.039-.586-1.414C19.039 7.211 18.53 7 18 7h-2" /><path d="M16 10V4c0-.53-.211-1.039-.586-1.414C15.039 2.211 14.53 2 14 2h-4c-.53 0-1.039.211-1.414.586C8.211 2.961 8 3.47 8 4v6m8 0H8m8 0h1m-9 0H7" /><path d="M8 14v.01" /><path d="M8 17v.01" /><path d="M12 13.99v.01" /><path d="M12 17v.01" /></svg>
                </div>
                <div>
                  <span class="label">Perfil del negocio</span>
                  <h4 id="businessSummaryName">Caja<span>Go</span></h4>
                  <p id="businessSummaryStatus">Completa los datos principales para mantener el perfil del negocio actualizado.</p>
                </div>
              </section>

              <section class="settings-card business-quality-card">
                <div class="settings-card-head">
                  <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /><path d="M15 6h5v5" /></svg></span>
                  <div>
                    <h4>Datos recomendados</h4>
                    <p>Completa nombre, teléfono y dirección para mantener una ficha comercial clara.</p>
                  </div>
                </div>
                <div class="business-checklist">
                  <span data-business-check="nombre">Nombre comercial</span>
                  <span data-business-check="contacto">Contacto visible</span>
                  <span data-business-check="direccion">Dirección operativa</span>
                  <span data-business-check="horarios">Horarios de atención</span>
                </div>
              </section>

              <section class="settings-card business-summary-card">
                <div class="business-summary-row">
                  <span>Teléfono</span>
                  <strong id="businessSummaryPhone">Sin cargar</strong>
                </div>
                <div class="business-summary-row">
                  <span>Email</span>
                  <strong id="businessSummaryEmail">Sin cargar</strong>
                </div>
                <div class="business-summary-row">
                  <span>Dirección</span>
                  <strong id="businessSummaryAddress">Sin cargar</strong>
                </div>
              </section>

              <div class="settings-actions business-save-actions">
                <button class="btn btn-primary" type="submit">Guardar cambios</button>
              </div>
            </aside>

            <div class="settings-hidden-business">
              <input name="LogoUrl" type="text">
              <input name="ImpresoraTicket" type="text">
              <textarea name="MensajeTicket"></textarea>
              <input name="UsaTicketTermico" type="checkbox" checked>
              <input name="ImprimirFechaHoraTicket" type="checkbox" checked>
              <input name="ImprimirCajeroTicket" type="checkbox" checked>
              <input name="ImprimirNumeroTicket" type="checkbox" checked>
            </div>
          </div>

          <div id="businessHoursModal" class="modal-root hidden">
            <div class="modal-backdrop" data-hours-action="close-modal"></div>
            <div class="modal-card business-hours-modal-card">
              <div class="modal-head">
                <div>
                  <span class="eyebrow">Datos del negocio</span>
                  <h3>Horarios de atención</h3>
                </div>
                <button id="businessHoursCloseButton" class="icon-btn" type="button" aria-label="Cerrar">×</button>
              </div>
              <div id="businessHoursEditor" class="business-hours-editor business-hours-modal-editor"></div>
              <div class="modal-actions">
                <button id="businessHoursCancelButton" class="btn btn-secondary" type="button">Cerrar</button>
                <button id="businessHoursDoneButton" class="btn btn-primary" type="button">Aplicar horarios</button>
              </div>
            </div>
          </div>

            <div class="ticket-settings-page hidden" data-settings-panel="ticket">
            <section class="settings-card ticket-settings-card">
              <div class="settings-card-head">
                <div>
                  <h4>Impresora de ticket principal</h4>
                  <p>Seleccioná la impresora que se utilizará para imprimir los tickets de venta.</p>
                </div>
              </div>

              <div class="ticket-settings-stack">
                <label class="field ticket-select-field">
                  <span>Impresora</span>
                  <select data-ticket-field="ImpresoraTicket">
                    <option value="">Impresora predeterminada</option>
                  </select>
                  <small id="ticketPrinterStatus">Buscando impresoras instaladas...</small>
                </label>
                <button class="btn btn-secondary ticket-test-button" type="button" data-action="test-ticket-printer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V4h12v5" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>
                  Probar impresión
                </button>
                <label class="field ticket-select-field">
                  <span>Ancho del ticket</span>
                  <small>Seleccioná el ancho del papel que utiliza tu impresora.</small>
                  <select data-ticket-field="TicketWidth">
                    <option value="80">80 mm</option>
                    <option value="58">58 mm</option>
                    <option value="custom">Personalizado</option>
                  </select>
                  <input class="ticket-custom-width hidden" data-ticket-field="TicketCustomWidth" type="number" min="40" max="120" step="1" value="80" placeholder="Ancho en mm">
                  <small class="field-error hidden" id="ticketWidthError">El ancho personalizado debe estar entre 40 y 120 mm.</small>
                </label>
              </div>

            </section>

            <section class="settings-card ticket-message-card">
              <div class="settings-card-head">
                <div>
                  <h4>Mensaje en el pie del ticket</h4>
                  <p>Texto que aparecerá al final de cada ticket.</p>
                </div>
              </div>
              <div class="ticket-settings-stack">
                <label class="field">
                  <textarea data-ticket-field="MensajeTicket" rows="7" maxlength="240" placeholder="Ej: ¡Gracias por tu compra!"></textarea>
                  <small class="ticket-counter"><span id="ticketMessageCount">0</span> / 240</small>
                </label>
                <div class="ticket-logo-upload">
                  <div>
                    <strong>Logo del negocio <span>(opcional)</span></strong>
                    <p>El logo se imprimirá en el encabezado del ticket.</p>
                  </div>
                  <button class="ticket-upload-box" type="button">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V9l8-6 8 6v12" /><path d="M9 21v-7h6v7" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg>
                    <span>Subir logo</span>
                    <small>PNG o JPG (máx. 5MB)</small>
                  </button>
                  <input id="ticketLogoInput" class="hidden" type="file" accept="image/png,image/jpeg">
                </div>
              </div>
            </section>

            <section class="settings-card ticket-preview-panel">
              <div class="settings-card-head">
                <div>
                  <h4>Vista previa y datos visibles</h4>
                  <p>Revisá cómo se verá el comprobante y qué información se incluirá.</p>
                </div>
              </div>

                <div class="ticket-preview-layout">
                  <div class="ticket-preview-receipt">
                    <div class="ticket-preview-top">
                      <img id="ticketPreviewLogo" class="ticket-preview-logo hidden" alt="Logo del negocio">
                      <strong id="ticketPreviewBusiness">CajaGo</strong>
                      <div id="ticketPreviewBusinessData" class="ticket-preview-business-data" aria-live="polite" data-ticket-preview-option="datos-negocio">
                        <span id="ticketPreviewAddress" data-ticket-preview-business="Direccion"></span>
                      </div>
                      <span>Comprobante de venta</span>
                    </div>
                    <div class="ticket-preview-meta">
                      <div data-ticket-preview-option="fecha"><span>Fecha</span><strong>Hoy 17:30</strong></div>
                      <div data-ticket-preview-option="numero"><span>Ticket</span><strong>#000125</strong></div>
                      <div data-ticket-preview-option="cajero"><span>Cajero</span><strong>Admin</strong></div>
                      <div data-ticket-preview-option="medio"><span>Pago</span><strong>Efectivo</strong></div>
                    </div>
                    <hr>
                    <div class="ticket-preview-row">
                      <span>Producto ejemplo x2</span>
                      <strong>$ 2.500,00</strong>
                    </div>
                    <div class="ticket-preview-row muted" data-ticket-preview-option="subtotal">
                      <span>Subtotal</span>
                      <strong>$ 2.500,00</strong>
                    </div>
                    <div class="ticket-preview-row muted" data-ticket-preview-option="impuestos">
                      <span>Neto gravado</span>
                      <strong>$ 2.066,12</strong>
                    </div>
                    <div class="ticket-preview-row muted" data-ticket-preview-option="impuestos">
                      <span>IVA 21%</span>
                      <strong>$ 433,88</strong>
                    </div>
                    <div class="ticket-preview-total" data-ticket-preview-option="total">
                      <span>Total</span>
                      <strong>$ 2.500,00</strong>
                    </div>
                    <div class="ticket-preview-row muted hidden" data-ticket-preview-option="descuento-recargo">
                      <span>Descuento</span>
                      <strong>-$ 0,00</strong>
                    </div>
                    <div class="ticket-preview-row muted" data-ticket-preview-option="cliente">
                      <span>Cliente</span>
                      <strong>Consumidor Final</strong>
                    </div>
                    <p id="ticketPreviewMessage" data-ticket-preview-option="mensaje">Gracias por tu compra.</p>
                  </div>
                  <div class="ticket-preview-options">
                    <strong>Opciones de impresión</strong>
                    <div class="ticket-option-boxes">
                      <div class="ticket-option-box">
                        <div class="ticket-option-list">
                          <label class="settings-check"><input name="ImprimirDatosNegocioTicket" data-ticket-field="ImprimirDatosNegocioTicket" type="checkbox" checked><span>Imprimir dirección en cabecera</span></label>
                          <label class="settings-check"><input name="ImprimirFechaHoraTicket" data-ticket-field="ImprimirFechaHoraTicket" type="checkbox" checked><span>Imprimir fecha y hora</span></label>
                          <label class="settings-check"><input name="ImprimirCajeroTicket" data-ticket-field="ImprimirCajeroTicket" type="checkbox" checked><span>Imprimir nombre del cajero</span></label>
                          <label class="settings-check"><input name="ImprimirNumeroTicket" data-ticket-field="ImprimirNumeroTicket" type="checkbox" checked><span>Imprimir número de ticket</span></label>
                          <label class="settings-check"><input name="ImprimirMedioPagoTicket" data-ticket-field="ImprimirMedioPagoTicket" type="checkbox" checked><span>Imprimir medio de pago</span></label>
                        </div>
                      </div>
                      <div class="ticket-option-box">
                        <div class="ticket-option-list">
                          <label class="settings-check"><input name="ImprimirSubtotalTotalTicket" data-ticket-field="ImprimirSubtotalTotalTicket" type="checkbox" checked><span>Imprimir subtotal y total</span></label>
                          <label class="settings-check"><input name="ImprimirDescuentoRecargoTicket" data-ticket-field="ImprimirDescuentoRecargoTicket" type="checkbox" checked><span>Imprimir descuento y recargo</span></label>
                          <label class="settings-check"><input name="ImprimirClienteTicket" data-ticket-field="ImprimirClienteTicket" type="checkbox" checked><span>Imprimir cliente cuando esté cargado</span></label>
                          <label class="settings-check"><input name="ImprimirMensajeCierreTicket" data-ticket-field="ImprimirMensajeCierreTicket" type="checkbox" checked><span>Imprimir mensaje de cierre</span></label>
                          <label class="settings-check"><input name="UsaTicketTermico" data-ticket-field="UsaTicketTermico" type="checkbox" checked><span>Corte automático del papel</span></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
          </div>

          <div id="settingsPrintersPanel" class="printers-settings-page hidden" data-settings-panel="impresoras">
            <section class="settings-card printers-list-card">
              <div class="settings-card-head printers-card-head">
                <div>
                  <h4>Impresoras configuradas</h4>
                  <p>Administra las impresoras que utiliza tu sistema.</p>
                </div>
                <button class="btn btn-primary" type="button" data-printer-action="refresh">
                  Actualizar impresoras
                </button>
              </div>
              <div id="settingsPrintersList" class="printers-list"></div>
            </section>

            <aside class="settings-card printer-detail-card">
              <div class="settings-card-head">
                <div>
                  <h4>Detalle de la impresora</h4>
                  <p>Revisa el estado y la configuración principal.</p>
                </div>
              </div>
              <div id="settingsPrinterDetail" class="printer-detail"></div>
            </aside>
          </div>

          <div id="settingsTaxesPanel" class="taxes-settings-page hidden" data-settings-panel="impuestos">
            <section class="settings-card taxes-main-card">
              <div class="settings-card-head taxes-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 19h16" /><path d="M8 17V9" /><path d="M12 17V5" /><path d="M16 17v-6" /><path d="M6 9h4" /><path d="M10 5h4" /><path d="M14 11h4" /></svg></span>
                <div>
                  <h4>Panel fiscal</h4>
                  <p>Controla tasas, cálculo y visualización fiscal de las ventas.</p>
                </div>
              </div>

              <div class="taxes-status-grid">
                <article class="taxes-status-card is-primary">
                  <span>Impuesto predeterminado</span>
                  <strong id="taxDefaultSummary">Cargando...</strong>
                  <small>Aplicado si el producto o categoría no define otra tasa.</small>
                </article>
                <article class="taxes-status-card">
                  <span>Tasas activas</span>
                  <strong id="taxActiveSummary">-</strong>
                  <small>Disponibles para ventas y asignaciones.</small>
                </article>
                <article class="taxes-status-card">
                  <span>Usan predeterminada</span>
                  <strong id="taxProductsWithoutRateSummary">-</strong>
                  <small>Sin tasa propia ni tasa configurada en su categoría.</small>
                </article>
              </div>

              <div class="taxes-rules-panel">
                <div class="taxes-rules-copy">
                  <span class="taxes-eyebrow">Criterios de cálculo</span>
                  <h5>Precios finales con impuesto incluido</h5>
                  <p>El sistema conserva el total visible al cliente y calcula el neto fiscal desde ese importe.</p>
                </div>
                <div class="taxes-control-grid">
                  <label class="taxes-toggle-card">
                    <input name="AplicarImpuestosEnVentas" type="checkbox" checked>
                    <span>
                      <strong>Aplicar impuestos en ventas</strong>
                      <small>Cálculo automático al confirmar.</small>
                    </span>
                  </label>
                  <label class="taxes-toggle-card">
                    <input name="ImprimirDesgloseImpuestosTicket" data-ticket-field="ImprimirDesgloseImpuestosTicket" type="checkbox" checked>
                    <span>
                      <strong>Mostrar desglose en ticket</strong>
                      <small>Visible en comprobantes.</small>
                    </span>
                  </label>
                </div>
              </div>

              <div class="taxes-settings-grid">
                <label class="field">
                  <span>Impuesto predeterminado</span>
                  <select id="taxDefaultSelect">
                    <option value="">Cargando impuestos...</option>
                  </select>
                </label>
                <div class="field tax-fixed-field">
                  <span>Redondeo fiscal</span>
                  <div class="tax-fixed-value">
                    <strong>2 decimales</strong>
                    <small>Criterio estándar para importes monetarios y comprobantes.</small>
                  </div>
                </div>
              </div>

              <section class="taxes-table-section">
                <div class="settings-card-head taxes-inline-head">
                  <div class="taxes-inline-title">
                    <h4>Tasas configuradas</h4>
                    <p>Listado de alícuotas disponibles para ventas y categorías.</p>
                  </div>
                  <div class="taxes-inline-actions">
                    <span id="taxRatesCount">0 activas</span>
                    <select id="taxRatesStatusFilter" aria-label="Filtrar tasas por estado">
                      <option value="activos">Activas</option>
                      <option value="todos">Todas</option>
                      <option value="inactivos">Inactivas</option>
                    </select>
                    <button class="taxes-new-rate-btn" type="button">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                      Nueva tasa
                    </button>
                  </div>
                </div>
                <div id="taxRatesList" class="taxes-rate-list"></div>
                <div id="taxRatesPagination" class="tax-rates-pagination"></div>
              </section>
            </section>

            <aside class="taxes-side-column">
              <section class="settings-card taxes-preview-card">
                <div class="settings-card-head">
                  <div>
                    <h4>Simulación fiscal</h4>
                    <p>Venta ejemplo con precio final de $ 1.000,00.</p>
                  </div>
                </div>
                <div id="taxSimulationPreview" class="tax-ticket-preview">
                  <div><span>Precio final</span><strong>$ 1.000,00</strong></div>
                  <div><span>Neto gravado</span><strong>-</strong></div>
                  <div><span>Impuesto</span><strong>-</strong></div>
                  <hr>
                  <div class="tax-ticket-total"><span>Total</span><strong>$ 1.000,00</strong></div>
                  <small>El total no cambia porque el impuesto está incluido.</small>
                </div>
              </section>

              <section class="settings-card taxes-category-card">
                <div class="settings-card-head">
                  <div>
                    <h4>Asignación por categoría</h4>
                    <p>Aplicación rápida para no configurar producto por producto.</p>
                  </div>
                </div>
                <div id="taxCategoryList" class="tax-category-list"></div>
                <div class="tax-category-actions">
                  <span id="taxCategoryMoreText"></span>
                  <button id="taxCategoryManageButton" class="btn btn-secondary" type="button">Gestionar categorías</button>
                </div>
              </section>

              <section class="settings-card taxes-note-card">
                <div class="settings-card-head">
                  <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12l2 2 4-4" /></svg></span>
                  <div>
                    <h4>Criterio recomendado</h4>
                    <p>Usar IVA 21% como predeterminado y ajustar solo categorías especiales.</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <div id="settingsUsersPanel" class="users-settings-page hidden" data-settings-panel="usuarios">
            <section class="settings-card users-main-card">
              <div class="settings-card-head users-card-head">
                <div>
                  <h4>Usuarios del sistema</h4>
                  <p>Administra accesos, roles y estado de los usuarios autorizados.</p>
                </div>
                <button id="newUsuarioButton" class="btn btn-primary" type="button">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" /></svg>
                  Nuevo usuario
                </button>
              </div>

              <div class="users-toolbar">
                <label class="field users-search-field">
                  <span>Buscar</span>
                  <input id="usuariosFilterInput" type="search" placeholder="Buscar por usuario...">
                </label>
                <label class="field users-status-field">
                  <span>Estado</span>
                  <select id="usuariosEstadoFilter">
                    <option value="activos">Activos</option>
                    <option value="todos">Todos</option>
                    <option value="inactivos">Inactivos</option>
                  </select>
                </label>
              </div>

              <div class="users-table-card">
                <div class="table-wrap">
                  <table class="data-table users-table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Contraseña</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="usuariosTableBody"></tbody>
                  </table>
                </div>
                <div id="usuariosPagination" class="table-pagination"></div>
              </div>
            </section>

            <aside class="settings-card users-side-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg></span>
                <div>
                  <h4>Resumen de accesos</h4>
                  <p>Estado general de usuarios y permisos.</p>
                </div>
              </div>
              <div class="users-summary-grid">
                <div class="users-summary-item">
                  <span>Total</span>
                  <strong id="usuariosSummaryTotal">0</strong>
                </div>
                <div class="users-summary-item">
                  <span>Activos</span>
                  <strong id="usuariosSummaryActive">0</strong>
                </div>
                <div class="users-summary-item">
                  <span>Admins</span>
                  <strong id="usuariosSummaryAdmins">0</strong>
                </div>
              </div>
              <div class="users-role-note">
                <strong>Roles disponibles</strong>
                <p><b>Admin</b> puede gestionar configuración, usuarios, stock e impresión. <b>Cajero</b> opera ventas y caja según permisos definidos.</p>
              </div>
              <div class="business-tip home-tip users-tip">
                <span aria-hidden="true">!</span>
                <strong>Consejo:</strong>
                <p>Usá usuarios separados para cada persona. Así ventas, caja y movimientos quedan asociados a quien los realizó.</p>
              </div>
              <div class="settings-actions users-save-actions">
                <button class="btn btn-primary" type="submit">Guardar cambios</button>
              </div>
            </aside>
          </div>

          <div class="settings-layout hidden" data-settings-panel="preferencias">
            <section class="settings-card settings-card-wide">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H4z" /><path d="M8 21h8" /><path d="M12 16v5" /></svg></span>
                <div>
                  <h4>Apariencia</h4>
                  <p>Personaliza la apariencia del sistema.</p>
                </div>
              </div>
              <div class="settings-split">
                <div class="settings-option-group">
                  <span class="settings-label">Color principal</span>
                  <div class="color-swatches">
                    <button class="color-swatch active" type="button" data-color="#ef0000" style="--swatch:#ef0000" aria-label="Rojo"></button>
                    <button class="color-swatch" type="button" data-color="#1558d6" style="--swatch:#1558d6" aria-label="Azul"></button>
                    <button class="color-swatch" type="button" data-color="#16a34a" style="--swatch:#16a34a" aria-label="Verde"></button>
                    <button class="color-swatch" type="button" data-color="#7e22ce" style="--swatch:#7e22ce" aria-label="Violeta"></button>
                    <button class="color-swatch" type="button" data-color="#f97316" style="--swatch:#f97316" aria-label="Naranja"></button>
                    <button class="color-swatch" type="button" data-color="#4b5563" style="--swatch:#4b5563" aria-label="Gris"></button>
                    <label class="color-swatch color-swatch-custom" aria-label="Elegir color personalizado">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4.5 19.5 10" /><path d="M13.5 5 5 13.5c-1 1-1 2.6 0 3.6l1.9 1.9c1 1 2.6 1 3.6 0L19 10.5" /><path d="M4 20c1.8 0 3.3-.5 4.4-1.6" /></svg>
                      <input name="ColorPersonalizado" type="color" value="#ef0000">
                    </label>
                  </div>
                  <input name="ColorPrincipal" type="hidden" value="#ef0000">
                </div>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 9V4h12v5" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg></span>
                <div>
                  <h4>Impresión y visualización</h4>
                  <p>Opciones de impresión y visualización de datos.</p>
                </div>
              </div>
              <div class="settings-checks">
                <label class="settings-check"><input name="VistaPreviaAntesImprimir" type="checkbox" checked><span>Vista previa antes de imprimir</span></label>
                <label class="settings-check"><input name="ImprimirCopiaTicket" type="checkbox"><span>Imprimir copia del ticket</span></label>
                <label class="settings-check"><input name="LetraGrandePantallaTactil" type="checkbox"><span>Letra grande en tickets</span></label>
              </div>
            </section>

            <section class="settings-card settings-card-wide">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m20 10-8 8-8-8 8-8 8 8Z" /><path d="M12 18v4" /><path d="M8 22h8" /></svg></span>
                <div>
                  <h4>Ventas</h4>
                  <p>Configuraciones relacionadas al proceso de venta.</p>
                </div>
              </div>
              <div class="settings-split">
                <div class="settings-checks">
                  <label class="settings-check"><input name="ConfirmarEliminarItemCarrito" type="checkbox" checked><span>Confirmar al eliminar un ítem del carrito</span></label>
                  <label class="settings-check"><input name="MantenerClienteAlFinalizarVenta" type="checkbox" checked><span>Mantener el cliente en pantalla al finalizar venta</span></label>
                  <label class="settings-check"><input name="PedirCantidadAlAgregarProducto" type="checkbox"><span>Pedir cantidad al agregar producto</span></label>
                  <label class="settings-check"><input name="MostrarStockEnBusquedaProductos" type="checkbox" checked><span>Mostrar stock en la búsqueda de productos</span></label>
                </div>
                <div class="settings-fields-stack">
                  <label class="field">
                    <span>Descuento máximo permitido (%)</span>
                    <input name="DescuentoMaximoPermitido" type="number" value="20" min="0" max="100" step="0.01">
                    <small class="field-error" data-field-error="DescuentoMaximoPermitido"></small>
                  </label>
                  <label class="field">
                    <span>Redondeo en el total</span>
                    <select name="RedondeoTotal">
                      <option value="0.05">A 0.05 (recomendado)</option>
                      <option value="0">Sin redondeo</option>
                      <option value="1.00">A 1.00</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></svg></span>
                <div>
                  <h4>Idioma y regional</h4>
                  <p>Configuraciones regionales y de idioma.</p>
                </div>
              </div>
              <div class="settings-fields-grid">
                <label class="field"><span>Idioma del sistema</span><select><option>Español</option></select></label>
                <label class="field">
                  <span>Formato de fecha</span>
                  <select name="FormatoFecha">
                    <option value="dd/MM/yyyy">26/05/2025 (dd/mm/aaaa)</option>
                    <option value="MM/dd/yyyy">05/26/2025 (mm/dd/aaaa)</option>
                    <option value="yyyy-MM-dd">2025-05-26 (aaaa-mm-dd)</option>
                  </select>
                </label>
                <label class="field">
                  <span>Formato de hora</span>
                  <select name="FormatoHora">
                    <option value="24">24 horas</option>
                    <option value="12">12 horas AM/PM</option>
                  </select>
                </label>
              </div>
            </section>

            <section class="settings-card settings-card-wide">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 10h12v9H6z" /><path d="M8 6h8l2 4H6l2-4Z" /><path d="M8 14h8" /></svg></span>
                <div>
                  <h4>Caja</h4>
                  <p>Opciones relacionadas a la apertura y cierre de caja.</p>
                </div>
              </div>
              <div class="settings-split">
                <div class="settings-checks">
                  <label class="settings-check"><input name="PedirMotivoCerrarCaja" type="checkbox" checked><span>Pedir motivo al cerrar caja</span></label>
                  <label class="settings-check"><input name="ImprimirResumenCerrarCaja" type="checkbox" checked><span>Imprimir resumen al cerrar caja</span></label>
                </div>
                <label class="field">
                  <span>Monto mínimo para apertura de caja</span>
                  <input name="MontoMinimoAperturaCaja" type="number" value="0.00" min="0" step="0.01">
                </label>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h.01" /><path d="M12 12h.01" /><path d="M19 12h.01" /></svg></span>
                <div>
                  <h4>Otros</h4>
                  <p>Otras preferencias del sistema.</p>
                </div>
              </div>
              <div class="settings-checks">
                <label class="settings-check"><input name="MostrarMensajesAyuda" type="checkbox" checked><span>Mostrar mensajes de ayuda</span></label>
                <label class="settings-check"><input name="EnviarEstadisticasAnonimas" type="checkbox" disabled><span>Enviar estadísticas anónimas para mejorar CajaGo</span></label>
              </div>
            </section>
          </div>

          <div id="settingsBackupPanel" class="backup-settings-page hidden" data-settings-panel="respaldo">
            <section class="settings-card backup-main-card">
              <div class="settings-card-head backup-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg></span>
                <div>
                  <h4>Respaldo de datos</h4>
                  <p>Protege la información del punto de venta con copias de seguridad controladas.</p>
                </div>
              </div>

              <div class="backup-hero">
                <div>
                  <span class="backup-eyebrow">Estado actual</span>
                  <h5 id="backupStatusTitle">Sin respaldo reciente</h5>
                  <p id="backupStatusText">Cuando generes una copia, acá vas a ver la última copia creada, su tamaño y el resultado del proceso.</p>
                </div>
                <span id="backupStatusBadge" class="backup-state-badge is-pending">Pendiente</span>
              </div>

              <div class="backup-actions-grid">
                <button id="backupCreateButton" class="backup-action-card" type="button" data-backup-action="create">
                  <span class="backup-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg></span>
                  <strong>Crear respaldo ahora</strong>
                  <small>Genera una copia completa de datos y archivos importantes.</small>
                </button>
                <button class="backup-action-card" type="button" data-backup-action="restore">
                  <span class="backup-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /><path d="M12 7v5l3 2" /></svg></span>
                  <strong>Restaurar respaldo</strong>
                  <small>Recupera el sistema desde una copia anterior confirmada.</small>
                </button>
                <button class="backup-action-card" type="button" data-backup-action="folder">
                  <span class="backup-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h4" /></svg></span>
                  <strong>Ubicación de copias</strong>
                  <small>Define dónde se guardarán los respaldos automáticos.</small>
                </button>
              </div>
              <input id="backupRestoreInput" class="hidden" type="file" accept=".zip,application/zip,application/x-zip-compressed">

              <section class="backup-history">
                <div class="backup-current-path-inline">
                  <span>Ruta actual:</span>
                  <strong id="backupHistoryCurrentPath">Documentos\\CajaGo\\Respaldos</strong>
                </div>
                <div class="settings-card-head">
                  <div>
                    <h4>Historial de respaldos</h4>
                    <p>Últimas copias generadas por el sistema.</p>
                  </div>
                </div>
                <div class="backup-history-list">
                  <div id="backupHistoryList" class="backup-history-empty">
                    <strong>No hay respaldos generados</strong>
                    <span>Usá “Crear respaldo ahora” para generar la primera copia.</span>
                  </div>
                  <div id="backupHistoryPagination" class="table-pagination backup-history-table-pagination"></div>
                </div>
              </section>
            </section>

            <aside class="settings-card backup-side-card">
              <div class="settings-card-head">
                <span class="settings-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12l2 2 4-4" /></svg></span>
                <div>
                  <h4>Plan de respaldo</h4>
                  <p>Configura la frecuencia recomendada.</p>
                </div>
              </div>

              <div class="backup-frequency-list">
                <label class="backup-frequency-option is-selected">
                  <input name="BackupFrequency" type="radio" value="daily" checked>
                  <span>
                    <strong>Diario</strong>
                    <small>Recomendado para uso continuo.</small>
                  </span>
                </label>
                <label class="backup-frequency-option">
                  <input name="BackupFrequency" type="radio" value="weekly">
                  <span>
                    <strong>Semanal</strong>
                    <small>Útil si el volumen de ventas es bajo.</small>
                  </span>
                </label>
                <label class="backup-frequency-option">
                  <input name="BackupFrequency" type="radio" value="monthly">
                  <span>
                    <strong>Mensual</strong>
                    <small>Para negocios con pocos cambios de datos.</small>
                  </span>
                </label>
              </div>

              <div class="backup-plan-fields">
                <label class="field">
                  <span>Hora de respaldo</span>
                  <select id="backupPlanTime" name="BackupPlanTime"></select>
                </label>
                <label class="field" id="backupPlanWeekdayField">
                  <span>Día semanal</span>
                  <select id="backupPlanWeekday" name="BackupPlanWeekday">
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                    <option value="6">Sábado</option>
                    <option value="0">Domingo</option>
                  </select>
                </label>
                <label class="field" id="backupPlanMonthdayField">
                  <span>Día mensual</span>
                  <select id="backupPlanMonthday" name="BackupPlanMonthday">
                    <option value="1">Día 1</option>
                    <option value="2">Día 2</option>
                    <option value="3">Día 3</option>
                    <option value="4">Día 4</option>
                    <option value="5">Día 5</option>
                    <option value="6">Día 6</option>
                    <option value="7">Día 7</option>
                    <option value="8">Día 8</option>
                    <option value="9">Día 9</option>
                    <option value="10">Día 10</option>
                    <option value="11">Día 11</option>
                    <option value="12">Día 12</option>
                    <option value="13">Día 13</option>
                    <option value="14">Día 14</option>
                    <option value="15">Día 15</option>
                    <option value="16">Día 16</option>
                    <option value="17">Día 17</option>
                    <option value="18">Día 18</option>
                    <option value="19">Día 19</option>
                    <option value="20">Día 20</option>
                    <option value="21">Día 21</option>
                    <option value="22">Día 22</option>
                    <option value="23">Día 23</option>
                    <option value="24">Día 24</option>
                    <option value="25">Día 25</option>
                    <option value="26">Día 26</option>
                    <option value="27">Día 27</option>
                    <option value="28">Día 28</option>
                    <option value="0">Último día del mes</option>
                  </select>
                </label>
              </div>

              <div class="backup-summary-card">
                <div>
                  <span>Último respaldo</span>
                  <strong id="backupLastDate">Sin datos</strong>
                </div>
                <div>
                  <span>Plan actual</span>
                  <strong id="backupCurrentPlan">Diario · 03:00</strong>
                </div>
                <div>
                  <span>Próximo respaldo</span>
                  <strong id="backupNextRun">Pendiente</strong>
                </div>
                <div>
                  <span>Último archivo</span>
                  <strong id="backupLastFile">Sin datos</strong>
                </div>
                <div>
                  <span>Ubicación</span>
                  <strong id="backupCurrentPath">Predeterminada</strong>
                </div>
              </div>

              <div class="settings-actions backup-save-actions">
                <button id="backupSavePlanButton" class="btn btn-primary" type="button">Guardar plan</button>
              </div>
            </aside>
          </div>

          <div class="settings-actions preferences-save-actions">
            <button class="btn btn-primary" type="submit">Guardar cambios</button>
          </div>
        </form>
        <footer class="settings-footer">
          <p>© 2026 CajaGo. Todos los derechos reservados. El acceso está reservado para usuarios autorizados del punto de venta.</p>
        </footer>
      </div>
    </section>
  `;
}

export function buildReportesView() {
  return `
    <section id="reportesView" class="view-section hidden">
      <div class="reportes-page">
        <div class="reportes-header">
          <div>
            <h3>Reportes</h3>
            <p>Consulta las ventas y el rendimiento de tu negocio.</p>
          </div>
        </div>

        <form id="reportesFilterForm" class="reportes-period-bar">
          <div class="reportes-period-tabs">
            <button id="presetTodayButton" class="reportes-period-tab" type="button" data-report-preset="today">Hoy</button>
            <button id="presetYesterdayButton" class="reportes-period-tab" type="button" data-report-preset="yesterday">Ayer</button>
            <button id="presetWeekButton" class="reportes-period-tab" type="button" data-report-preset="week">Esta semana</button>
            <button id="presetMonthButton" class="reportes-period-tab" type="button" data-report-preset="month">Este mes</button>
            <button class="reportes-period-tab is-custom" type="button" data-report-custom-toggle>
              Personalizado
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
            </button>
          </div>
          <div class="reportes-custom-dates">
            <label class="field">
              <span>Fecha desde</span>
              <span class="reportes-date-input" data-report-date-picker>
                <input name="FechaDesde" type="hidden">
                <button class="reportes-date-trigger" type="button" data-report-date-trigger data-report-date-field="FechaDesde">
                  <span data-report-date-value>Seleccionar fecha</span>
                </button>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
              </span>
            </label>
            <label class="field">
              <span>Fecha hasta</span>
              <span class="reportes-date-input" data-report-date-picker>
                <input name="FechaHasta" type="hidden">
                <button class="reportes-date-trigger" type="button" data-report-date-trigger data-report-date-field="FechaHasta">
                  <span data-report-date-value>Seleccionar fecha</span>
                </button>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
              </span>
            </label>
            <button class="btn btn-primary reportes-apply-btn" type="submit">Aplicar</button>
          </div>
          <div class="reportes-header-actions">
            <button id="exportVentasCsvButton" class="btn btn-secondary reportes-export-btn" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
              Exportar CSV
            </button>
          </div>
        </form>

        <div id="reportesStats" class="reportes-stats-grid"></div>

        <div class="reportes-content-grid">
          <article class="reportes-card reportes-sales-card">
            <div class="reportes-card-head">
              <h4>Ventas recientes</h4>
            </div>
            <div class="table-wrap reportes-table-wrap">
              <table class="data-table reportes-sales-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Cajero</th>
                    <th>Total</th>
                    <th>Medio de pago</th>
                  </tr>
                </thead>
                <tbody id="reportesVentasTableBody"></tbody>
              </table>
            </div>
            <button class="reportes-card-link" type="button" data-report-action="show-sales-history">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></svg>
              Ver todas las ventas
            </button>
          </article>

          <article class="reportes-card reportes-products-card">
            <div class="reportes-card-head">
              <h4>Productos más vendidos</h4>
            </div>
            <div id="topProductosList" class="reportes-products-list"></div>
            <button class="reportes-card-link" type="button" data-report-action="show-full-products-ranking">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 16-9 5-9-5" /><path d="m21 12-9 5-9-5" /><path d="m3 8 9-5 9 5-9 5-9-5Z" /></svg>
              Ver ranking completo
            </button>
          </article>

          <aside class="reportes-side-column">
            <article class="reportes-card reportes-payments-card">
              <div class="reportes-card-head">
                <h4>Métodos de pago</h4>
              </div>
              <div class="reportes-payments-layout">
                <div id="reportesPaymentDonut" class="reportes-donut" aria-hidden="true"></div>
                <div id="reportesPaymentList" class="reportes-payment-list"></div>
              </div>
              <div class="reportes-payment-total">
                <span>Total</span>
                <strong id="reportesPaymentTotal">$ 0,00</strong>
              </div>
            </article>

            <article class="reportes-card reportes-actions-card">
              <div class="reportes-card-head">
                <h4>Acciones rápidas</h4>
              </div>
              <button class="reportes-action-row" type="button" data-report-action="print-summary">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V4h12v5" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>
                <span><strong>Imprimir resumen</strong><small>Imprime un resumen del período</small></span>
                <b>&gt;</b>
              </button>
              <button class="reportes-action-row" type="button" data-report-action="export-summary-csv">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
                <span><strong>Exportar detalle</strong><small>Descarga el detalle de ventas</small></span>
                <b>&gt;</b>
              </button>
            </article>
          </aside>
        </div>

        <div class="reportes-info-tip">
          <span aria-hidden="true">i</span>
          <p>Los reportes se generan en base a las ventas registradas en la caja seleccionada.</p>
        </div>
      </div>

      <div id="reportesSalesHistoryView" class="reportes-history-page hidden">
        <div class="reportes-history-titlebar">
          <button class="reportes-history-back" type="button" data-report-action="hide-sales-history" aria-label="Volver a reportes">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          </button>
          <div>
            <h3>Todas las ventas <button type="button" data-report-action="hide-sales-history">← Volver a reportes</button></h3>
            <p>Consulta el detalle de todas las ventas realizadas.</p>
          </div>
        </div>

        <div class="reportes-history-filters">
          <label class="field">
            <span>Período</span>
            <button class="reportes-history-filter-button" type="button" data-report-action="toggle-history-dates">
              <strong id="reportesHistoryPeriodLabel">Periodo seleccionado</strong>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
            </button>
          </label>
          <label class="field">
            <span>Cajero</span>
            <div class="reportes-history-filter-dropdown" data-report-filter="usuarioId">
              <button class="reportes-history-filter-button" type="button" data-report-filter-trigger>
                <strong data-report-filter-label>Todos</strong><b>⌄</b>
              </button>
              <div class="reportes-history-filter-menu hidden" data-report-filter-menu></div>
            </div>
          </label>
          <label class="field">
            <span>Medio de pago</span>
            <div class="reportes-history-filter-dropdown" data-report-filter="medioPagoId">
              <button class="reportes-history-filter-button" type="button" data-report-filter-trigger>
                <strong data-report-filter-label>Todos</strong><b>⌄</b>
              </button>
              <div class="reportes-history-filter-menu hidden" data-report-filter-menu></div>
            </div>
          </label>
          <button class="reportes-history-filter-button reportes-history-more" type="button" data-report-action="toggle-history-more-filters">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18" /><path d="M6 12h12" /><path d="M10 19h4" /></svg>
            Más filtros
          </button>
          <button class="reportes-history-export" type="button" data-report-action="export-sales-csv">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
            Exportar CSV
          </button>
          <div id="reportesHistoryCustomDates" class="reportes-history-custom-dates hidden">
            <label class="field">
              <span>Fecha desde</span>
              <span class="reportes-date-input" data-report-date-picker>
                <input name="HistoryFechaDesde" type="hidden">
                <button class="reportes-date-trigger" type="button" data-report-date-trigger data-report-date-field="HistoryFechaDesde">
                  <span data-report-date-value>Seleccionar fecha</span>
                </button>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
              </span>
            </label>
            <label class="field">
              <span>Fecha hasta</span>
              <span class="reportes-date-input" data-report-date-picker>
                <input name="HistoryFechaHasta" type="hidden">
                <button class="reportes-date-trigger" type="button" data-report-date-trigger data-report-date-field="HistoryFechaHasta">
                  <span data-report-date-value>Seleccionar fecha</span>
                </button>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
              </span>
            </label>
            <button class="btn btn-primary reportes-apply-btn" type="button" data-report-action="apply-history-dates">Aplicar</button>
          </div>
          <div id="reportesHistoryMoreFilters" class="reportes-history-custom-dates reportes-history-more-panel hidden">
            <label class="field">
              <span>Cliente</span>
              <div class="reportes-history-filter-dropdown" data-report-filter="clienteId">
                <button class="reportes-history-filter-button" type="button" data-report-filter-trigger>
                  <strong data-report-filter-label>Todos</strong><b>⌄</b>
                </button>
                <div class="reportes-history-filter-menu hidden" data-report-filter-menu></div>
              </div>
            </label>
            <label class="field">
              <span>Total mínimo</span>
              <input name="HistoryTotalMinimo" type="number" min="0" step="0.01" placeholder="$ 0,00">
            </label>
            <label class="field">
              <span>Total máximo</span>
              <input name="HistoryTotalMaximo" type="number" min="0" step="0.01" placeholder="$ 0,00">
            </label>
            <button class="btn btn-primary reportes-apply-btn" type="button" data-report-action="apply-history-more-filters">Aplicar filtros</button>
            <button class="btn btn-secondary reportes-apply-btn" type="button" data-report-action="clear-history-more-filters">Limpiar</button>
          </div>
        </div>

        <div id="reportesHistoryStats" class="reportes-history-stats"></div>

        <article class="reportes-history-table-card">
          <div class="table-wrap reportes-history-table-wrap">
            <table class="data-table reportes-history-table">
              <thead>
                <tr>
                  <th>Hora ↕</th>
                  <th>N° Ticket</th>
                  <th>Cajero</th>
                  <th>Total</th>
                  <th>Ítems</th>
                  <th>Medio de pago</th>
                  <th>Cliente (si aplica)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="reportesHistoryTableBody"></tbody>
            </table>
          </div>
          <div class="reportes-history-footer">
            <span id="reportesHistoryRangeLabel">Mostrando 0 ventas</span>
            <div id="reportesHistoryPagination" class="table-pagination"></div>
          </div>
        </article>
      </div>
    </section>
  `;
}
