import { makeObservable, observable, action, runInAction } from "mobx";
import * as SecureStore from "expo-secure-store";
import apiClient from "../../core/api/apiClient";
import { AuthResponse, User } from "../../domain/entities";

const TOKEN_KEY = "jwt_token";
const USER_KEY = "auth_user";

export class AuthStore {
  isAuthenticated: boolean = false;
  user: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      isAuthenticated: observable,
      user: observable,
      loading: observable,
      error: observable,
      login: action,
      register: action,
      logout: action,
      checkAuth: action,
      clearError: action,
    });
  }

  async checkAuth(): Promise<void> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      console.log("[AuthStore] checkAuth token:", token ? "found" : "null");
      if (token && userJson) {
        apiClient.setToken(token);
        runInAction(() => {
          this.isAuthenticated = true;
          this.user = JSON.parse(userJson);
        });
      }
    } catch (e) {
      console.warn("[AuthStore] checkAuth error:", e);
    }
  }

  private async saveSession(token: string, user: { id: string; name: string; email: string }) {
    apiClient.setToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  }

  async login(email: string, password: string): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await apiClient.post<AuthResponse>("/auth/login", { email, password });
      await this.saveSession(data.token, { id: data.id, name: data.name, email: data.email });
      runInAction(() => {
        this.isAuthenticated = true;
        this.user = { id: data.id, name: data.name, email: data.email, created_at: "", updated_at: "" };
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message || "Login gagal";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await apiClient.post<AuthResponse>("/auth/register", { name, email, password });
      await this.saveSession(data.token, { id: data.id, name: data.name, email: data.email });
      runInAction(() => {
        this.isAuthenticated = true;
        this.user = { id: data.id, name: data.name, email: data.email, created_at: "", updated_at: "" };
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message || "Registrasi gagal";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async logout(): Promise<void> {
    apiClient.clearToken();
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      // ignore
    }
    runInAction(() => {
      this.isAuthenticated = false;
      this.user = null;
    });
  }

  clearError(): void {
    this.error = null;
  }
}
