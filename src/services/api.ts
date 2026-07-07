import { UserProfile } from "../types";

export const BASE_URL = "http://localhost:8000/api";
export const isBrowser = typeof window !== "undefined";

class BaseApi {
  private _isOnline: boolean = false;
  private _token: string | null = null;
  private _user: UserProfile | null = null;

  constructor() {
    if (isBrowser) {
      this._token = localStorage.getItem("velora_auth_token");
      const savedUser = localStorage.getItem("velora_user_profile");
      if (savedUser) {
        try {
          this._user = JSON.parse(savedUser);
        } catch (e) {
          this._user = null;
        }
      }
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/health`, { 
        method: "GET",
        signal: AbortSignal.timeout(1200)
      });
      if (res.ok) {
        this._isOnline = true;
        return true;
      }
    } catch (e) {}
    this._isOnline = false;
    return false;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  get user(): UserProfile | null {
    return this._user;
  }

  set user(u: UserProfile | null) {
    this._user = u;
    if (isBrowser) {
      if (u) {
        localStorage.setItem("velora_user_profile", JSON.stringify(u));
      } else {
        localStorage.removeItem("velora_user_profile");
      }
    }
  }

  get token(): string | null {
    return this._token;
  }

  set token(t: string | null) {
    this._token = t;
    if (isBrowser) {
      if (t) {
        localStorage.setItem("velora_auth_token", t);
      } else {
        localStorage.removeItem("velora_auth_token");
      }
    }
  }

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this._token) {
      headers["Authorization"] = `Bearer ${this._token}`;
    }
    return headers;
  }
}

export const api = new BaseApi();
