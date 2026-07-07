import { api, BASE_URL } from "./api";
import { UserProfile } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<UserProfile> {
    const online = await api.checkHealth();
    
    if (online) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }
      const data = await res.json();
      api.token = data.access_token;
      api.user = data.user;
      return data.user;
    } else {
      // Offline fallback login (dummy login matching email)
      console.log("Offline login fallback activated.");
      const dummyUser: UserProfile = {
        id: "offline-reader-id",
        name: email.split("@")[0].toUpperCase(),
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        settings: {
          lang: "en",
          speed: 1.0,
          streak: 1,
          lastReadDate: null,
          history: [],
          favoriteCategory: "Archaeology"
        },
        bookmarks: {
          bookmarkedIds: [],
          highlights: {},
          notes: {}
        },
        streak: 1,
        achievements: ["Offline Explorer"]
      };
      api.user = dummyUser;
      return dummyUser;
    }
  },

  async register(name: string, email: string, password: string): Promise<UserProfile> {
    const online = await api.checkHealth();
    
    if (online) {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed");
      }
      const data = await res.json();
      api.token = data.access_token;
      api.user = data.user;
      return data.user;
    } else {
      throw new Error("Cannot register new users while backend server is offline.");
    }
  },

  async googleLogin(email: string): Promise<UserProfile> {
    const online = await api.checkHealth();
    
    if (online) {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "google-oauth-placeholder" })
      });
      if (!res.ok) {
        throw new Error("Google Authentication failed");
      }
      const data = await res.json();
      api.token = data.access_token;
      api.user = data.user;
      return data.user;
    } else {
      return this.login(email, "google-pass");
    }
  },

  logout(): void {
    api.token = null;
    api.user = null;
  }
};
