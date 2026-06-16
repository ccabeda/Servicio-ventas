export function buildAuthView() {
  return `
    <div id="authView" class="auth-shell">
      <div class="auth-theme-control">
        <button class="theme-toggle" data-theme-toggle type="button" aria-label="Cambiar tema" aria-pressed="false" title="Cambiar tema"></button>
      </div>

      <section class="auth-panel auth-brand">
        <div class="auth-brand-main">
          <div class="cajago-logo" aria-label="CajaGo">
            <span class="cajago-mark-badge" aria-hidden="true">
              <svg class="cajago-mark" viewBox="0 0 24 24" focusable="false">
                <path d="M21 15h-2.5c-.398 0-.779.158-1.061.439-.281.281-.439.663-.439 1.061s.158.779.439 1.061c.281.281.663.439 1.061.439h1c.398 0 .779.158 1.061.439.281.281.439.663.439 1.061s-.158.779-.439 1.061c-.281.281-.663.439-1.061.439H17" />
                <path d="M19 21v1m0-8v1" />
                <path d="M13 21H6c-.53 0-1.039-.211-1.414-.586C4.211 20.039 4 19.53 4 19V9c0-.53.211-1.039.586-1.414C4.961 7.211 5.47 7 6 7h2m12 3.12V9c0-.53-.211-1.039-.586-1.414C19.039 7.211 18.53 7 18 7h-2" />
                <path d="M16 10V4c0-.53-.211-1.039-.586-1.414C15.039 2.211 14.53 2 14 2h-4c-.53 0-1.039.211-1.414.586C8.211 2.961 8 3.47 8 4v6m8 0H8m8 0h1m-9 0H7" />
                <path d="M8 14v.01" />
                <path d="M8 17v.01" />
                <path d="M12 13.99v.01" />
                <path d="M12 17v.01" />
              </svg>
            </span>
            <strong>Caja<span>Go</span></strong>
          </div>

          <h1>Vende <span>rápido.</span><br>Controla <span>fácil.</span></h1>
          <p>El POS simple para vender, controlar stock y manejar tu caja sin complicaciones.</p>
        </div>

        <div class="auth-feature-grid">
          <article class="auth-feature">
            <div class="auth-feature-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <path d="M13 14h22a3 3 0 0 1 3 3v13H10V17a3 3 0 0 1 3-3Z" />
                <path d="M8 30h32v5a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-5Z" />
                <path d="M17 20h6M28 20h5M17 25h16" />
                <path d="M33 8h6v6" />
                <path d="m39 8-9 9" />
              </svg>
            </div>
            <strong>Ventas rapidas</strong>
            <span>Escanea productos y cobra en segundos.</span>
          </article>
          <article class="auth-feature">
            <div class="auth-feature-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <path d="M10 18h28v20H10V18Z" />
                <path d="M14 10h20l4 8H10l4-8Z" />
                <path d="M24 10v28M10 26h28" />
              </svg>
            </div>
            <strong>Stock claro</strong>
            <span>Cada venta descuenta productos automaticamente.</span>
          </article>
          <article class="auth-feature">
            <div class="auth-feature-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <path d="M11 20h26v18H11V20Z" />
                <path d="M17 14h14v6H17v-6Z" />
                <path d="M16 27h16M16 33h4M23 33h4M30 33h4" />
              </svg>
            </div>
            <strong>Caja controlada</strong>
            <span>Apertura, cierre y movimientos en un solo lugar.</span>
          </article>
        </div>
      </section>

      <section class="auth-panel auth-form-panel">
        <div class="auth-form-header">
          <h2>Ingresar a <span>CajaGo</span></h2>
          <p>Accede a tu punto de venta</p>
        </div>

        <form id="loginForm" class="auth-form">
          <label class="field">
            <span>Usuario</span>
            <span class="auth-input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
              <input id="loginUser" name="NombreUsuario" type="text" placeholder="Ingresa tu usuario" autocomplete="username" required>
            </span>
          </label>

          <label class="field">
            <span>Contraseña</span>
            <span class="auth-input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <input id="loginPassword" name="Password" type="password" placeholder="Ingresa tu contraseña" autocomplete="current-password" required>
              <button id="passwordToggleButton" class="password-toggle" type="button" aria-label="Mostrar contraseña">Ver</button>
            </span>
          </label>

          <label class="auth-remember">
            <input id="rememberUserCheckbox" type="checkbox">
            <span>Recordar usuario</span>
          </label>

          <button id="loginButton" type="submit" class="btn btn-primary btn-block">Ingresar</button>
        </form>

        <div class="auth-help">
          <svg class="auth-help-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          <div>
            <strong>Primer ingreso</strong>
            <span>Usuario: admin&nbsp;&nbsp;|&nbsp;&nbsp;Contraseña: 1234</span>
          </div>
        </div>
      </section>
    </div>
  `;
}
