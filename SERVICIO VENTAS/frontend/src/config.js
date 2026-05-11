export const STORAGE_KEYS = {
  token: "sv_token",
  session: "sv_session",
  currentView: "sv_current_view",
  reportFilters: "sv_report_filters",
  theme: "sv_theme"
};

export const VIEW_TITLES = {
  dashboard: { title: "Dashboard", eyebrow: "Panel" },
  ventas: { title: "Ventas", eyebrow: "Operacion" },
  productos: { title: "Productos", eyebrow: "Inventario" },
  caja: { title: "Caja", eyebrow: "Tesoreria" },
  clientes: { title: "Clientes", eyebrow: "Relacion comercial" },
  usuarios: { title: "Usuarios", eyebrow: "Seguridad" },
  mediosPago: { title: "Medios de Pago", eyebrow: "Cobro" },
  configuracion: { title: "Configuracion", eyebrow: "Negocio" },
  reportes: { title: "Reportes", eyebrow: "Analitica" }
};

export const ROLES = [
  { value: 1, label: "Admin" },
  { value: 2, label: "Cajero" }
];

export const MOVIMIENTO_TIPOS = [
  { value: 1, label: "Apertura" },
  { value: 2, label: "Venta" },
  { value: 3, label: "Ingreso" },
  { value: 4, label: "Egreso" },
  { value: 5, label: "Cierre" }
];

export const LOW_STOCK_THRESHOLD = 5;
