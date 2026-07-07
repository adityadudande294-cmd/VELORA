import { api, BASE_URL } from "./api";
import { StoryDetail } from "../types";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  suspended: boolean;
  streak: number;
  achievements: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  banner: string;
  hidden: boolean;
  order: number;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface DashboardStats {
  totalStories: number;
  publishedStories: number;
  draftStories: number;
  totalCategories: number;
  totalAuthors: number;
  totalReaders: number;
  totalBookmarks: number;
  dailyActiveUsers: number;
  avgReadingTimeMins: number;
  topStories: Array<{ id: string; title: string; reads: number; bookmarks: number }>;
  trendingCategories: Array<{ name: string; value: number }>;
  recentActivity: Array<{ id: string; user: string; action: string; time: string }>;
  readershipTrend: Array<{ name: string; value: number }>;
  bookmarksTrend: Array<{ name: string; value: number }>;
}

async function handleResponse(res: Response) {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("velora_admin_token");
      localStorage.removeItem("velora_admin_user");
      window.location.reload();
    }
  }
}

export const adminService = {
  getHeaders() {
    const headers = api.getHeaders() as Record<string, string>;
    // Fetch token from admin-specific local storage
    if (typeof window !== "undefined") {
      const adminToken = localStorage.getItem("velora_admin_token");
      if (adminToken) {
        headers["Authorization"] = `Bearer ${adminToken}`;
      }
    }
    return headers as HeadersInit;
  },

  async adminLogin(email: string, password: string): Promise<{ user: any; token: string } | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      await handleResponse(res);
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("velora_admin_token", data.access_token);
          localStorage.setItem("velora_admin_user", JSON.stringify(data.user));
        }
        return { user: data.user, token: data.access_token };
      } else {
        const err = await res.json();
        throw new Error(err.detail || "Authentication failed");
      }
    } catch (e) {
      console.error("Admin Login Error:", e);
      throw e;
    }
  },

  async fetchDashboardStats(): Promise<DashboardStats | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
        headers: this.getHeaders()
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to fetch dashboard stats:", e);
    }
    return null;
  },

  async fetchAdminStories(): Promise<StoryDetail[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stories`, {
        headers: this.getHeaders()
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to fetch stories list:", e);
    }
    return [];
  },

  async createStory(story: Partial<StoryDetail>): Promise<StoryDetail | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stories`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(story)
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to create story:", e);
    }
    return null;
  },

  async updateStory(storyId: string, story: Partial<StoryDetail>): Promise<StoryDetail | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stories/${storyId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(story)
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to update story:", e);
    }
    return null;
  },

  async deleteStory(storyId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stories/${storyId}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      await handleResponse(res);
      return res.ok;
    } catch (e) {
      console.error("Failed to delete story:", e);
    }
    return false;
  },

  async duplicateStory(storyId: string): Promise<StoryDetail | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/stories/${storyId}/duplicate`, {
        method: "POST",
        headers: this.getHeaders()
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to duplicate story:", e);
    }
    return null;
  },

  async fetchCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: this.getHeaders()
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
    return [];
  },

  async createCategory(cat: Partial<Category>): Promise<Category | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(cat)
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to create category:", e);
    }
    return null;
  },

  async updateCategory(catId: string, cat: Partial<Category>): Promise<Category | null> {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${catId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(cat)
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to update category:", e);
    }
    return null;
  },

  async deleteCategory(catId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${catId}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      await handleResponse(res);
      return res.ok;
    } catch (e) {
      console.error("Failed to delete category:", e);
    }
    return false;
  },

  async fetchMedia(): Promise<MediaAsset[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/media`, {
        headers: this.getHeaders()
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to fetch media library:", e);
    }
    return [];
  },

  async uploadMedia(file: File): Promise<MediaAsset | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const headers = this.getHeaders() as Record<string, string>;
      // Remove content type so the browser formats boundaries automatically for multipart upload
      delete headers["Content-Type"];
      
      const res = await fetch(`${BASE_URL}/admin/media/upload`, {
        method: "POST",
        headers: headers as HeadersInit,
        body: formData
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to upload media asset:", e);
    }
    return null;
  },

  async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/admin/media/${mediaId}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      await handleResponse(res);
      return res.ok;
    } catch (e) {
      console.error("Failed to delete media asset:", e);
    }
    return false;
  },

  async fetchUsers(): Promise<AdminUser[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: this.getHeaders()
      });
      await handleResponse(res);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Failed to fetch users list:", e);
    }
    return [];
  },

  async updateUserRole(userId: string, role: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify({ role })
      });
      await handleResponse(res);
      return res.ok;
    } catch (e) {
      console.error("Failed to update user role:", e);
    }
    return false;
  },

  async toggleUserSuspend(userId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/suspend`, {
        method: "PUT",
        headers: this.getHeaders()
      });
      await handleResponse(res);
      return res.ok;
    } catch (e) {
      console.error("Failed to toggle user suspend state:", e);
    }
    return false;
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      await handleResponse(res);
      return res.ok;
    } catch (e) {
      console.error("Failed to delete user:", e);
    }
    return false;
  }
};
