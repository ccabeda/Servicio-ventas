export class ApiClient {
  constructor({ getToken, onUnauthorized }) {
    this.getToken = getToken;
    this.onUnauthorized = onUnauthorized;
  }

  async request(url, options = {}) {
    const isFormData = options.body instanceof FormData;
    const config = {
      method: options.method || "GET",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {})
      },
      ...options
    };

    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        this.onUnauthorized?.();
        throw new Error("Sesión vencida. Vuelve a iniciar sesión.");
      }

      const details = this.extractErrorMessage(data) || `${response.status} ${response.statusText}`.trim();
      throw new Error(details || "No se pudo completar la operación.");
    }

    return data;
  }

  extractErrorMessage(data) {
    if (!data) return "";

    const message = data.message || data.Message || "";
    const errors = data.errors || data.Errors || null;

    if (Array.isArray(errors) && errors.length) {
      const details = errors
        .map(error => {
          if (typeof error === "string") return error;
          const field = error.field || error.Field;
          const text = error.message || error.Message;
          return this.formatValidationError(field, text);
        })
        .filter(Boolean)
        .filter((detail, index, list) => this.shouldKeepValidationError(detail, index, list))
        .join(" ");

      return details || message;
    }

    if (errors && typeof errors === "object") {
      const details = Object.entries(errors)
        .flatMap(([field, values]) => Array.isArray(values)
          ? values.map(value => this.formatValidationError(field, value))
          : [this.formatValidationError(field, values)])
        .filter(Boolean)
        .filter((detail, index, list) => this.shouldKeepValidationError(detail, index, list))
        .join(" ");

      return details || message;
    }

    return message;
  }

  formatValidationError(field, text) {
    const rawText = String(text || "").trim();
    if (!rawText) return "";

    if (/^the .+ field is required\.$/i.test(rawText)) {
      return "";
    }

    const readableFields = {
      NombreUsuario: "Usuario",
      Password: "Contraseña",
      Rol: "Rol",
      Nombre: "Nombre",
      Precio: "Precio",
      Costo: "Costo",
      Stock: "Stock"
    };
    const label = readableFields[field] || field;

    if (!label) return rawText;
    if (rawText.toLowerCase().includes(String(label).toLowerCase())) {
      return rawText;
    }

    return `${label}: ${rawText}`;
  }

  shouldKeepValidationError(detail, index, list) {
    if (!detail) return false;
    if (list.indexOf(detail) !== index) return false;

    const withoutField = detail.replace(/^[^:]+:\s*/, "").trim();
    return !list.some((other, otherIndex) => otherIndex !== index && other.endsWith(withoutField));
  }
}
