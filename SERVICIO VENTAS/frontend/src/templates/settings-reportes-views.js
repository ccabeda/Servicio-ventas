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
          <button type="button">Impresoras</button>
          <button type="button">Impuestos</button>
          <button type="button">Usuarios</button>
          <button type="button" data-settings-tab="preferencias">Preferencias</button>
          <button type="button">Respaldo</button>
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
                    <small>PNG o JPG (máx. 2MB)</small>
                  </button>
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
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Analítica operativa</span>
            <h3>Reportes</h3>
          </div>
        </div>

        <form id="reportesFilterForm" class="reportes-toolbar">
          <div class="reportes-toolbar-group reportes-toolbar-filters">
            <label class="field">
              <span>Fecha desde</span>
              <input name="FechaDesde" type="date">
            </label>
            <label class="field">
              <span>Fecha hasta</span>
              <input name="FechaHasta" type="date">
            </label>
            <button class="btn btn-primary reportes-apply-btn" type="submit">Aplicar</button>
          </div>

          <div class="reportes-toolbar-group reportes-toolbar-presets">
            <span class="label">Atajos</span>
            <div class="reportes-preset-buttons">
              <button id="presetTodayButton" class="btn btn-secondary" type="button">Hoy</button>
              <button id="presetWeekButton" class="btn btn-secondary" type="button">7 días</button>
              <button id="presetMonthButton" class="btn btn-secondary" type="button">Mes</button>
            </div>
          </div>

          <div class="reportes-toolbar-group reportes-toolbar-export">
            <span class="label">Salida</span>
            <button id="exportVentasCsvButton" class="btn btn-secondary reportes-export-btn" type="button">Exportar CSV</button>
          </div>
        </form>

        <div id="reportesStats" class="stats-grid"></div>
      </div>

      <div class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Top ventas</span>
              <h3>Productos más vendidos</h3>
            </div>
          </div>
          <div id="topProductosList" class="ranking-list"></div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Últimos movimientos</span>
              <h3>Ventas del periodo</h3>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Medio</th>
                  <th>Ítems</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="reportesVentasTableBody"></tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  `;
}
