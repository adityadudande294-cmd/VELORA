"use client";

import React, { useState, useEffect } from "react";
import VELORAIntro from "@/components/VELORAIntro";
import Dashboard from "@/components/Dashboard";
import StoryReader from "@/components/StoryReader";
import { StoryDetail } from "@/data/knowledgeDatabase";
import { apiClient } from "@/services/apiClient";

export interface UserSettings {
  lang: "en" | "hi" | "mr";
  speed: number;
  streak: number;
  lastReadDate: string | null;
  history: string[];
  favoriteCategory: string;
}

export interface BookmarkData {
  bookmarkedIds: string[];
  highlights: Record<string, number[]>; // storyId -> sentenceIndices[]
  notes: Record<string, Record<number, string>>; // storyId -> { sentenceIndex -> noteText }
}

export default function Home() {
  const [view, setView] = useState<"intro" | "dashboard" | "reader">("intro");
  const [userName, setUserName] = useState("Reader");
  const [selectedStory, setSelectedStory] = useState<StoryDetail | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Global User Settings State
  const [userSettings, setUserSettings] = useState<UserSettings>({
    lang: "en",
    speed: 0.85,
    streak: 1,
    lastReadDate: null,
    history: [],
    favoriteCategory: "Archaeology"
  });

  // Global Bookmarks, Notes, and Highlights State
  const [bookmarks, setBookmarks] = useState<BookmarkData>({
    bookmarkedIds: [],
    highlights: {},
    notes: {}
  });

  // 1. Initialize States from LocalStorage / Server
  useEffect(() => {
    const initApp = async () => {
      // 1. First load local storage values as instantaneous fallback
      if (typeof window !== "undefined") {
        const savedName = localStorage.getItem("velora_user_name");
        if (savedName) setUserName(savedName);

        const savedSettings = localStorage.getItem("velora_user_settings");
        if (savedSettings) {
          try {
            setUserSettings(JSON.parse(savedSettings));
          } catch (e) {}
        }
        
        const savedBookmarks = localStorage.getItem("velora_bookmarks");
        if (savedBookmarks) {
          try {
            setBookmarks(JSON.parse(savedBookmarks));
          } catch (e) {}
        }
      }

      // 2. Probe API Backend health & load synced profile if available
      const online = await apiClient.checkHealth();
      setIsOnline(online);
      
      if (online && apiClient.user) {
        try {
          const profile = await apiClient.getProfile();
          setUserName(profile.name);
          setUserSettings(profile.settings);
          setBookmarks(profile.bookmarks);
          
          // Keep localStorage up-to-date with server profile
          if (typeof window !== "undefined") {
            localStorage.setItem("velora_user_name", profile.name);
            localStorage.setItem("velora_user_settings", JSON.stringify(profile.settings));
            localStorage.setItem("velora_bookmarks", JSON.stringify(profile.bookmarks));
          }
        } catch (e) {
          console.log("Could not load server profile (token expired or database error), staying in local mode.");
        }
      }
    };
    
    initApp();
  }, []);

  // Sync settings helper
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== "undefined") {
        localStorage.setItem("velora_user_settings", JSON.stringify(updated));
      }
      
      // Push async to server if connected
      if (isOnline && apiClient.user) {
        apiClient.updateSettings(updated).catch(() => {});
      }
      return updated;
    });
  };

  // Sync bookmarks helper
  const updateBookmarks = async (updater: (prev: BookmarkData) => BookmarkData) => {
    setBookmarks(prev => {
      const updated = updater(prev);
      if (typeof window !== "undefined") {
        localStorage.setItem("velora_bookmarks", JSON.stringify(updated));
      }
      
      // Push async to server if connected
      if (isOnline && apiClient.user) {
        apiClient.syncBookmarks(updated).catch(() => {});
      }
      return updated;
    });
  };

  const handleStartReading = async (story: StoryDetail) => {
    setSelectedStory(story);
    // Add to history list
    if (!userSettings.history.includes(story.id)) {
      const newHistory = [...userSettings.history, story.id];
      updateSettings({ history: newHistory });
      
      if (isOnline && apiClient.user) {
        apiClient.saveProgress(story.id, false).catch(() => {});
      }
    }
    setView("reader");
  };

  // Callback to sync client profile state after auth actions
  const handleAuthSync = (syncedUser: any) => {
    setUserName(syncedUser.name);
    setUserSettings(syncedUser.settings);
    setBookmarks(syncedUser.bookmarks);
    setIsOnline(true);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("velora_user_name", syncedUser.name);
      localStorage.setItem("velora_user_settings", JSON.stringify(syncedUser.settings));
      localStorage.setItem("velora_bookmarks", JSON.stringify(syncedUser.bookmarks));
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      {view === "intro" && (
        <VELORAIntro
          userName={userName}
          onComplete={() => setView("dashboard")}
        />
      )}
      
      {view === "dashboard" && (
        <Dashboard
          onStartReading={handleStartReading}
          userName={userName}
          userSettings={userSettings}
          updateSettings={updateSettings}
          bookmarks={bookmarks}
          updateBookmarks={updateBookmarks}
          onAuthSuccess={handleAuthSync}
        />
      )}
      
      {view === "reader" && selectedStory && (
        <StoryReader
          story={selectedStory}
          onBack={() => setView("dashboard")}
          userSettings={userSettings}
          updateSettings={updateSettings}
          bookmarks={bookmarks}
          updateBookmarks={updateBookmarks}
        />
      )}
    </main>
  );
}
