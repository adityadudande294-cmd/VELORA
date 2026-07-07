"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { SettingsProvider } from "./SettingsContext";
import { BookmarksProvider } from "./BookmarksContext";
import { ReadingProvider } from "./ReadingContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BookmarksProvider>
          <ReadingProvider>
            {children}
          </ReadingProvider>
        </BookmarksProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};
export { useAuth } from "./AuthContext";
export { useSettings } from "./SettingsContext";
export { useBookmarks } from "./BookmarksContext";
export { useReading } from "./ReadingContext";
