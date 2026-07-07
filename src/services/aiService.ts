import { api, BASE_URL } from "./api";
import { getStoryDetail, answerStoryQuestion } from "../utils/storyEngine";
import { StoryDetail } from "../types";

export const aiService = {
  async askAI(storyId: string, question: string, lang: string): Promise<string> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/qa`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ storyId, question, lang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.answer;
        }
      } catch (e) {
        console.error("Failed to call AI Q&A endpoint:", e);
      }
    }
    const story = getStoryDetail(storyId);
    return answerStoryQuestion(story, question, lang as any);
  },

  async explainAI(storyId: string, mode: string, lang: string): Promise<string> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/explain`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ storyId, mode, lang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.text;
        }
      } catch (e) {
        console.error("Failed to call AI explanation endpoint:", e);
      }
    }
    const story = getStoryDetail(storyId);
    const modeExp = story.explanations[mode as keyof typeof story.explanations] || story.explanations.simple;
    return modeExp[lang as keyof typeof modeExp] || modeExp.en;
  },

  async askChatAI(storyId: string, message: string, history: Array<{ sender: "user" | "ai"; text: string }>, lang: string): Promise<string> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const formattedHistory = history.map(h => ({
          role: h.sender === "user" ? "user" : "model",
          text: h.text
        }));
        const res = await fetch(`${BASE_URL}/ai/chat`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ storyId, message, history: formattedHistory, lang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.answer;
        }
      } catch (e) {
        console.error("Failed to call AI chat endpoint:", e);
      }
    }
    return this.askAI(storyId, message, lang);
  },

  async fetchSummaryAI(storyId: string, lang: string): Promise<any> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/summary`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ storyId, lang })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.error("Failed to fetch AI story summary:", e);
      }
    }
    return null;
  },

  async translateTextAI(text: string, targetLang: string): Promise<string> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/translate`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ text, target_lang: targetLang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.translated_text;
        }
      } catch (e) {
        console.error("Failed to translate text via AI:", e);
      }
    }
    return text;
  },

  async fetchQuizQuestions(storyId: string, lang: string): Promise<any[]> {
    const online = await api.checkHealth();
    if (online) {
      try {
        const res = await fetch(`${BASE_URL}/ai/questions`, {
          method: "POST",
          headers: api.getHeaders(),
          body: JSON.stringify({ storyId, lang })
        });
        if (res.ok) {
          const data = await res.json();
          return data.questions;
        }
      } catch (e) {
        console.error("Failed to fetch AI quiz questions:", e);
      }
    }
    return [];
  }
};
