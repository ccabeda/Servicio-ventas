export function buildAuthView() {
  return `
    <div id="authView" class="auth-shell">
      <section class="auth-panel auth-brand">
        <div class="brand-badge">POS local</div>
        <h1>Servicio Ventas</h1>
        <p>Panel de caja y gestion para comercios pequenos, con foco en velocidad operativa y uso en red local.</p>

        <ul class="auth-points">
          <li>Ventas rapidas con carrito y cobro inmediato</li>
          <li>Control de stock, caja y usuarios</li>
          <li>Reportes operativos listos para el negocio</li>
        </ul>
      </section>

      <section class="auth-panel auth-form-panel">
        <div class="auth-form-header">
          <div class="auth-form-topbar">
            <div>
              <span class="eyebrow">Ingreso seguro</span>
              <h2>Acceder al sistema</h2>
              <p>Usa tu usuario para entrar al POS web.</p>
            </div>
            <button class="theme-toggle" data-theme-toggle type="button" aria-label="Cambiar tema" aria-pressed="false" title="Cambiar tema"></button>
          </div>
        </div>

        <form id="loginForm" class="auth-form">
          <label class="field">
            <span>Usuario</span>
            <input id="loginUser" name="NombreUsuario" type="text" placeholder="admin" autocomplete="username" required>
          </label>

          <label class="field">
            <span>Contrasena</span>
            <input id="loginPassword" name="Password" type="password" placeholder="••••" autocomplete="current-password" required>
          </label>

          <button id="loginButton" type="submit" class="btn btn-primary btn-block">Ingresar</button>
        </form>

        <div class="auth-help">
          <span>Usuario inicial:</span>
          <strong>admin / 1234</strong>
        </div>
      </section>
    </div>
  `;
}
