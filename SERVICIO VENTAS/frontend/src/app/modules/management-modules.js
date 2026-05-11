import { cajaMethods } from "./caja-module.js";
import { entitiesMethods } from "./entities-module.js";
import { reportesMethods } from "./reportes-module.js";
import { ticketMethods } from "./ticket-module.js";

export const managementMethods = {
  ...cajaMethods,
  ...entitiesMethods,
  ...reportesMethods,
  ...ticketMethods
};
