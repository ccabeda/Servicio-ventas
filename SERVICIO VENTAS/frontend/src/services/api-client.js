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
        throw new Error("Sesion vencida. Vuelve a iniciar sesion.");
      }

      const details = data?.message || `${response.status} ${response.statusText}`.trim();
      throw new Error(`Error API en ${url}: ${details || "respuesta no valida"}.`);
    }

    return data;
  }
}
