import { MOVIMIENTO_TIPOS, ROLES } from "../config.js";

export function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

export function formatNumber(value) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

export function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatRol(value) {
  return ROLES.find(role => role.value === Number(value))?.label || String(value);
}

export function formatMovimientoTipo(value) {
  return MOVIMIENTO_TIPOS.find(item => item.value === Number(value))?.label || String(value);
}

export function toApiDateTime(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}

export function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function startOfLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function endOfLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}
