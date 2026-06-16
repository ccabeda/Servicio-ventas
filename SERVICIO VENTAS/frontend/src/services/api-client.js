export class ApiClient {
  constructor({ getToken, onUnauthorized }) {
    this.getToken = getToken;
    this.onUnauthorized = onUnauthorized;
  }

  async request(url, options = {}) {
    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
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
          return field ? `${field}: ${text}` : text;
        })
        .filter(Boolean)
        .join(" ");

      return details || message;
    }

    if (errors && typeof errors === "object") {
      const details = Object.entries(errors)
        .flatMap(([field, values]) => Array.isArray(values)
          ? values.map(value => `${field}: ${value}`)
          : [`${field}: ${values}`])
        .join(" ");

      return details || message;
    }

    return message;
  }
}
