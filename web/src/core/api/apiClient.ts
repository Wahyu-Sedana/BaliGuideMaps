import axios from "axios";
import { handleError } from "../error/errors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://composed-light-crayfish.ngrok-free.app/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    // Bypass ngrok browser-warning interstitial page
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach JWT from localStorage on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Map HTTP errors to domain errors
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status: number = error.response?.status ?? 0;
    const message: string = error.response?.data?.message ?? error.message;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    return Promise.reject(handleError(status, message));
  },
);
