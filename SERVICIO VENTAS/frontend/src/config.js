export const STORAGE_KEYS = {
  token: "sv_token",
  session: "sv_session",
  currentView: "sv_current_view",
  reportFilters: "sv_report_filters",
  theme: "sv_theme",
  rememberedUser: "sv_remembered_user"
};

export const VIEW_TITLES = {
  dashboard: { title: "Dashboard", eyebrow: "Panel" },
  ventas: { title: "Ventas", eyebrow: "Operación" },
  productos: { title: "Productos", eyebrow: "Inventario" },
  caja: { title: "Caja", eyebrow: "Tesorería" },
  usuarios: { title: "Usuarios", eyebrow: "Seguridad" },
  mediosPago: { title: "Medios de Pago", eyebrow: "Cobro" },
  configuracion: { title: "Configuración", eyebrow: "Negocio" },
  reportes: { title: "Reportes", eyebrow: "Analítica" }
};

export const VIEW_PERMISSIONS = {
  dashboard: null,
  ventas: "Ventas.Crear",
  productos: "Productos.Ver",
  caja: "Caja.Operar",
  usuarios: "Usuarios.Gestionar",
  mediosPago: "MediosPago.Gestionar",
  configuracion: "Configuracion.Gestionar",
  reportes: "Reportes.Ver"
};

export const PERMISSIONS = {
  productosVer: "Productos.Ver",
  productosGestionar: "Productos.Gestionar",
  stockAjustar: "Stock.Ajustar",
  cajaOperar: "Caja.Operar",
  ventasCrear: "Ventas.Crear",
  ventasVer: "Ventas.Ver",
  clientesGestionar: "Clientes.Gestionar",
  mediosPagoGestionar: "MediosPago.Gestionar",
  usuariosGestionar: "Usuarios.Gestionar",
  configuracionGestionar: "Configuracion.Gestionar",
  impresorasGestionar: "Impresoras.Gestionar",
  reportesVer: "Reportes.Ver",
  auditoriaVer: "Auditoria.Ver"
};

export const ENTITY_PERMISSIONS = {
  producto: PERMISSIONS.productosGestionar,
  categoriaProducto: PERMISSIONS.productosGestionar,
  marcaProducto: PERMISSIONS.productosGestionar,
  cliente: PERMISSIONS.clientesGestionar,
  usuario: PERMISSIONS.usuariosGestionar,
  medioPago: PERMISSIONS.mediosPagoGestionar,
  stock: PERMISSIONS.stockAjustar,
  configuracion: PERMISSIONS.configuracionGestionar,
  impresora: PERMISSIONS.impresorasGestionar
};

export const API_ENDPOINTS = {
  authLogin: "/api/auth/login",
  authMe: "/api/auth/me",
  authCambiarPassword: "/api/auth/cambiar-password",
  productos: "/api/productos",
  productosPaginado: "/api/productos/paginado",
  categoriasProducto: "/api/categoriasproducto",
  marcasProducto: "/api/marcasproducto",
  clientes: "/api/clientes",
  clientesPaginado: "/api/clientes/paginado",
  usuarios: "/api/usuarios",
  usuariosPaginado: "/api/usuarios/paginado",
  mediosPago: "/api/mediospago",
  mediosPagoPaginado: "/api/mediospago/paginado",
  ventas: "/api/ventas",
  ventasPaginado: "/api/ventas/paginado",
  cajaActual: "/api/cajas/actual",
  cajaResumen: id => `/api/cajas/${id}/resumen`,
  cajasPaginado: "/api/cajas/paginado",
  configuracionesNegocio: "/api/configuracionesnegocio",
  configuracionNegocioLogo: id => `/api/configuracionesnegocio/${id}/logo`,
  configuracionTicketPrincipal: "/api/configuracionesticket/principal",
  configuracionesTicket: "/api/configuracionesticket",
  impuestos: "/api/impuestos",
  impuestosPaginado: "/api/impuestos/paginado",
  impuestosResumen: "/api/impuestos/resumen",
  impresoras: "/api/impresoras",
  respaldosConfiguracion: "/api/respaldos/configuracion",
  respaldosPaginado: "/api/respaldos/paginado",
  respaldosCrear: "/api/respaldos/crear",
  respaldosRestaurar: "/api/respaldos/restaurar",
  reportesResumenVentas: "/api/reportes/resumen-ventas",
  reportesVentas: "/api/reportes/ventas",
  reportesVentasPaginado: "/api/reportes/ventas/paginado",
  reportesProductosMasVendidos: "/api/reportes/productos-mas-vendidos"
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
