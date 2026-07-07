import { KNOWLEDGE_DATABASE, StoryDetail } from "../data/knowledgeDatabase";
import { getStoryDetail, answerStoryQuestion, generateStoryText } from "../utils/storyEngine";
import { UserSettings, BookmarkData } from "../types";


const BASE_URL = "http://localhost:8000/api";

// Check if window is defined (for server-side rendering safety)
const isBrowser = typeof window !== "undefined";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  settings: UserSettings;
  bookmarks: BookmarkData;
  streak: number;
  achievements: string[];
}

class ApiClient {
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

  // Probe server health to choose route
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/health`, { 
        method: "GET",
        signal: AbortSignal.timeout(1200) // fast timeout
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

  get token(): string | null {
    return this._token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this._token) {
      headers["Authorization"] = `Bearer ${this._token}`;
    }
    return headers;
  }

  // --- AUTH SERVICES ---
  async login(email: string, password: string): Promise<UserProfile> {
    const online = await this.checkHealth();
    
    if (online) {
      try {
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
        this._token = data.access_token;
        this._user = data.user;
        if (isBrowser) {
          localStorage.setItem("velora_auth_token", data.access_token);
          localStorage.setItem("velora_user_profile", JSON.stringify(data.user));
        }
        return data.user;
      } catch (e: any) {
        console.error("Server login failed:", e);
        throw e;
      }
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
      this._user = dummyUser;
      if (isBrowser) {
        localStorage.setItem("velora_user_profile", JSON.stringify(dummyUser));
      }
      return dummyUser;
    }
  }

  async register(name: string, email: string, password: string): Promise<UserProfile> {
    const online = await this.checkHealth();
    
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
      this._token = data.access_token;
      this._user = data.user;
      if (isBrowser) {
        localStorage.setItem("velora_auth_token", data.access_token);
        localStorage.setItem("velora_user_profile", JSON.stringify(data.user));
      }
      return data.user;
    } else {
      throw new Error("Cannot register new users while backend server is offline.");
    }
  }

  async googleLogin(email: string): Promise<UserProfile> {
    const online = await this.checkHealth();
    
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
      this._token = data.access_token;
      this._user = data.user;
      if (isBrowser) {
        localStorage.setItem("velora_auth_token", data.access_token);
        localStorage.setItem("velora_user_profile", JSON.stringify(data.user));
      }
      return data.user;
    } else {
      return this.login(email, "google-pass");
    }
  }

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${BASE_URL}/users/profile`, { headers: this.getHeaders() });
    if (!res.ok) {
      throw new Error("Failed to load user profile");
    }
    const profile = await res.json();
    this._user = profile;
    if (isBrowser) {
      localStorage.setItem("velora_user_profile", JSON.stringify(profile));
    }
    return profile;
  }

  logout() {
    this._token = null;
    this._user = null;
    if (isBrowser) {
      localStorage.removeItem("velora_auth_token");
      localStorage.removeItem("velora_user_profile");
    }
  }

  // --- STORY SERVICES ---
  async fetchStories(): Promise<StoryDetail[]> {
    const online = await this.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/stories`, { headers: this.getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // Offline Fallback
    console.log("Offline mode: Fetching stories from local database files.");
    return Object.values(KNOWLEDGE_DATABASE);
  }

  async fetchStoryDetail(id: string): Promise<StoryDetail> {
    const online = await this.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/stories/${id}`, { headers: this.getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // Offline Fallback
    return getStoryDetail(id);
  }

  async searchStories(query: string): Promise<StoryDetail[]> {
    const online = await this.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: this.getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // Offline Fallback: simulate keyword matching locally
    const q = query.toLowerCase().trim();
    if (!q) return Object.values(KNOWLEDGE_DATABASE);
    return Object.values(KNOWLEDGE_DATABASE).filter(s => 
      s.title.en.toLowerCase().includes(q) || 
      s.category.toLowerCase().includes(q) || 
      s.subtitle.en.toLowerCase().includes(q)
    );
  }

  async synthesizeCustomStory(topic: string): Promise<StoryDetail> {
    const online = await this.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/stories/generate`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ topic })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // Offline Fallback: compile client-side custom story
    const { generateCustomStory } = require("../utils/storyEngine");
    return generateCustomStory(topic);
  }

  // --- USER PROFILE & BOOKMARKS SYNC ---
  async syncBookmarks(bookmarks: BookmarkData): Promise<BookmarkData> {
    const online = await this.checkHealth();
    if (online && this._token) {
      try {
        const res = await fetch(`${BASE_URL}/bookmarks`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(bookmarks)
        });
        if (res.ok) {
          const data = await res.json();
          // Update local profile representation
          if (this._user) {
            this._user.bookmarks = data;
            if (isBrowser) localStorage.setItem("velora_user_profile", JSON.stringify(this._user));
          }
          return data;
        }
      } catch (e) {}
    }
    return bookmarks;
  }

  async saveProgress(storyId: string, isCompleted: boolean): Promise<UserProfile | null> {
    const online = await this.checkHealth();
    if (online && this._token) {
      try {
        const res = await fetch(`${BASE_URL}/history/progress`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ storyId, isCompleted })
        });
        if (res.ok) {
          const userProfile = await res.json();
          this._user = userProfile;
          if (isBrowser) localStorage.setItem("velora_user_profile", JSON.stringify(userProfile));
          return userProfile;
        }
      } catch (e) {}
    }
    return this._user;
  }

  async updateSettings(settings: UserSettings): Promise<UserProfile | null> {
    const online = await this.checkHealth();
    if (online && this._token) {
      try {
        const res = await fetch(`${BASE_URL}/users/profile`, {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify({ settings })
        });
        if (res.ok) {
          const userProfile = await res.json();
          this._user = userProfile;
          if (isBrowser) localStorage.setItem("velora_user_profile", JSON.stringify(userProfile));
          return userProfile;
        }
      } catch (e) {}
    }
    return this._user;
  }

  // --- AI INTEGRATION SERVICES ---
  async askAI(storyId: string, question: string, lang: string): Promise<string> {
    const online = await this.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/qa`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ storyId, question, lang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.answer;
        }
      } catch (e) {}
    }
    // Offline Fallback: call local Q&A engine
    const story = getStoryDetail(storyId);
    return answerStoryQuestion(story, question, lang as any);
  }

  async explainAI(storyId: string, mode: string, lang: string): Promise<string> {
    const online = await this.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/explain`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ storyId, mode, lang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.text;
        }
      } catch (e) {}
    }
    // Offline Fallback: lookup explanations block
    const story = getStoryDetail(storyId);
    const modeExp = story.explanations[mode as keyof typeof story.explanations] || story.explanations.simple;
    return modeExp[lang as keyof typeof modeExp] || modeExp.en;
  }
}

export const apiClient = new ApiClient();
