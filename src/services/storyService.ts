import { api, BASE_URL } from "./api";
import { StoryDetail } from "../types";
import { KNOWLEDGE_DATABASE } from "../data/knowledgeDatabase";
import { getStoryDetail, generateCustomStory } from "../utils/storyEngine";

export const storyService = {
  async fetchStories(): Promise<StoryDetail[]> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/stories`, { headers: api.getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error("Failed to fetch stories from server:", e);
      }
    }
    console.log("Offline mode: Fetching stories from local database files.");
    return Object.values(KNOWLEDGE_DATABASE);
  },

  async fetchStoryDetail(id: string): Promise<StoryDetail> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/stories/${id}`, { headers: api.getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error("Failed to fetch story details from server:", e);
      }
    }
    return getStoryDetail(id);
  },

  async searchStories(query: string): Promise<StoryDetail[]> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: api.getHeaders() });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error("Failed to search stories on server:", e);
      }
    }
    const q = query.toLowerCase().trim();
    if (!q) return Object.values(KNOWLEDGE_DATABASE);
    return Object.values(KNOWLEDGE_DATABASE).filter(s => 
      s.title.en.toLowerCase().includes(q) || 
      s.category.toLowerCase().includes(q) || 
      s.subtitle.en.toLowerCase().includes(q)
    );
  },

  async synthesizeCustomStory(topic: string): Promise<StoryDetail> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/stories/generate`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ topic })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error("Failed to generate custom story on server:", e);
      }
    }
    return generateCustomStory(topic);
  }
};
