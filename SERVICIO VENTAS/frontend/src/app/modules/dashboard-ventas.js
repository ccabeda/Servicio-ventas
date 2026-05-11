import { dashboardMethods } from "./dashboard-module.js";
import { ventasMethods } from "./ventas-module.js";

export const dashboardVentasMethods = {
  ...dashboardMethods,
  ...ventasMethods
};
