"use client";

import React, { createContext, useContext, useState } from "react";
import { StoryDetail } from "../types";
import { useAuth } from "./AuthContext";
import { useSettings } from "./SettingsContext";
import { userService } from "../services/userService";

interface ReadingContextType {
  view: "intro" | "dashboard" | "reader";
  setView: (view: "intro" | "dashboard" | "reader") => void;
  selectedStory: StoryDetail | null;
  setSelectedStory: (story: StoryDetail | null) => void;
  handleStartReading: (story: StoryDetail) => Promise<void>;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const ReadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline, user } = useAuth();
  const { userSettings, updateSettings } = useSettings();
  const [view, setView] = useState<"intro" | "dashboard" | "reader">("intro");
  const [selectedStory, setSelectedStory] = useState<StoryDetail | null>(null);

  const handleStartReading = async (story: StoryDetail) => {
    setSelectedStory(story);
    // Add to history list
    if (!userSettings.history.includes(story.id)) {
      const newHistory = [...userSettings.history, story.id];
      await updateSettings({ history: newHistory });
      
      if (isOnline && user) {
        userService.saveProgress(story.id, false).catch(() => {});
      }
    }
    setView("reader");
  };

  return (
    <ReadingContext.Provider value={{
      view,
      setView,
      selectedStory,
      setSelectedStory,
      handleStartReading
    }}>
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) throw new Error("useReading must be used within ReadingProvider");
  return context;
};
