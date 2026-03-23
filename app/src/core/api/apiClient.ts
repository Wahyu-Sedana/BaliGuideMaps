import axios, { AxiosInstance, AxiosError } from "axios";

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor(
    baseURL: string = "https://composed-light-crayfish.ngrok-free.app/api/v1",
  ) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach in-memory JWT token to every request
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Clear token on 401
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.token = null;
        }
        return Promise.reject(error);
      },
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async get<T>(url: string, params?: any) {
    try {
      console.log("[API] GET", this.instance.defaults.baseURL + url, params);
      const response = await this.instance.get<T>(url, { params });
      console.log("[API] Response", url, JSON.stringify(response.data).slice(0, 200));
      return response.data;
    } catch (error: any) {
      console.error("[API] Error", url, error?.message, error?.code);
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any) {
    try {
      console.log("[API] POST", this.instance.defaults.baseURL + url, JSON.stringify(data));
      const response = await this.instance.post<T>(url, data);
      console.log("[API] POST Response", url, JSON.stringify(response.data).slice(0, 200));
      return response.data;
    } catch (error: any) {
      console.error("[API] POST Error", url, error?.response?.status, error?.response?.data, error?.message);
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any) {
    try {
      const response = await this.instance.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string) {
    try {
      const response = await this.instance.delete<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      return new Error(message);
    }
    return error;
  }
}

export default new ApiClient();
