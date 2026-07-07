"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSettings } from "../types";
import { useAuth } from "./AuthContext";
import { userService } from "../services/userService";

interface SettingsContextType {
  userName: string;
  setUserNameState: (name: string) => void;
  userSettings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  lang: "en",
  speed: 0.85,
  streak: 1,
  lastReadDate: null,
  history: [],
  favoriteCategory: "Archaeology"
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isOnline, setUserProfileState } = useAuth();
  const [userName, setUserName] = useState("Reader");
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Initialize from LocalStorage or active User profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("velora_user_name");
      if (savedName) setUserName(savedName);

      const savedSettings = localStorage.getItem("velora_user_settings");
      if (savedSettings) {
        try {
          setUserSettings(JSON.parse(savedSettings));
        } catch (e) {}
      }
    }
  }, []);

  // Update when user auth profile synchronizes
  useEffect(() => {
    if (user) {
      if (user.name) {
        setUserName(user.name);
        if (typeof window !== "undefined") {
          localStorage.setItem("velora_user_name", user.name);
        }
      }
      if (user.settings) {
        setUserSettings(user.settings);
        if (typeof window !== "undefined") {
          localStorage.setItem("velora_user_settings", JSON.stringify(user.settings));
        }
      }
    }
  }, [user]);

  const setUserNameState = (name: string) => {
    setUserName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("velora_user_name", name);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== "undefined") {
        localStorage.setItem("velora_user_settings", JSON.stringify(updated));
      }
      
      // Push async to server if connected
      if (isOnline && user) {
        userService.updateSettings(updated).then(profile => {
          if (profile) setUserProfileState(profile);
        }).catch(() => {});
      }
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{
      userName,
      setUserNameState,
      userSettings,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
