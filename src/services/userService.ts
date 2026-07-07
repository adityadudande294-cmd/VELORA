import { api, BASE_URL } from "./api";
import { UserProfile, BookmarkData, UserSettings } from "../types";

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${BASE_URL}/users/profile`, { headers: api.getHeaders() });
    if (!res.ok) {
      throw new Error("Failed to load user profile");
    }
    const profile = await res.json();
    api.user = profile;
    return profile;
  },

  async syncBookmarks(bookmarks: BookmarkData): Promise<BookmarkData> {
    const online = await api.checkHealth();
    if (online && api.token) {
      try {
        const res = await fetch(`${BASE_URL}/bookmarks`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify(bookmarks)
        });
        if (res.ok) {
          const data = await res.json();
          const currUser = api.user;
          if (currUser) {
            currUser.bookmarks = data;
            api.user = currUser;
          }
          return data;
        }
      } catch (e) {
        console.error("Failed to sync bookmarks to server:", e);
      }
    }
    return bookmarks;
  },

  async saveProgress(storyId: string, isCompleted: boolean): Promise<UserProfile | null> {
    const online = await api.checkHealth();
    if (online && api.token) {
      try {
        const res = await fetch(`${BASE_URL}/history/progress`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ storyId, isCompleted })
        });
        if (res.ok) {
          const userProfile = await res.json();
          api.user = userProfile;
          return userProfile;
        }
      } catch (e) {
        console.error("Failed to save progress to server:", e);
      }
    }
    return api.user;
  },

  async updateSettings(settings: UserSettings): Promise<UserProfile | null> {
    const online = await api.checkHealth();
    if (online && api.token) {
      try {
        const res = await fetch(`${BASE_URL}/users/profile`, {
          method: "PUT",
          headers: api.getHeaders(),
          body: JSON.stringify({ settings })
        });
        if (res.ok) {
          const userProfile = await res.json();
          api.user = userProfile;
          return userProfile;
        }
      } catch (e) {
        console.error("Failed to update settings on server:", e);
      }
    }
    return api.user;
  }
};
