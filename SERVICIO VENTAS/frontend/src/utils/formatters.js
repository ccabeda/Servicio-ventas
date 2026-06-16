import { MOVIMIENTO_TIPOS, ROLES } from "../config.js";

const datePreferences = {
  formatoFecha: "dd/MM/yyyy",
  formatoHora: "24"
};

export function setDateFormatPreferences({ FormatoFecha, FormatoHora } = {}) {
  datePreferences.formatoFecha = ["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"].includes(FormatoFecha)
    ? FormatoFecha
    : "dd/MM/yyyy";
  datePreferences.formatoHora = FormatoHora === "12" ? "12" : "24";
}

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
  const date = new Date(value);
  const datePart = formatDatePart(date);
  const timePart = formatTimePart(date);
  return `${datePart} ${timePart}`;
}

export function formatHeaderDateTime(value) {
  const date = new Date(value);
  const weekday = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date);
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${formatDatePart(date)}, ${formatTimePart(date)}`;
}

function formatDatePart(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (datePreferences.formatoFecha === "MM/dd/yyyy") {
    return `${month}/${day}/${year}`;
  }
  if (datePreferences.formatoFecha === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`;
  }
  return `${day}/${month}/${year}`;
}

function formatTimePart(date) {
  if (datePreferences.formatoHora === "12") {
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date);
  }

  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
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
