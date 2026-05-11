import { inventoryMethods } from "./inventory-module.js";
import { peopleSettingsMethods } from "./people-settings-module.js";
import { crudModalMethods } from "./crud-modal-module.js";

export const entitiesMethods = {
  ...inventoryMethods,
  ...peopleSettingsMethods,
  ...crudModalMethods
};
