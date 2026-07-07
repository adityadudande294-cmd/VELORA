"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BookmarkData } from "../types";
import { useAuth } from "./AuthContext";
import { userService } from "../services/userService";

interface BookmarksContextType {
  bookmarks: BookmarkData;
  updateBookmarks: (updater: (prev: BookmarkData) => BookmarkData) => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

const DEFAULT_BOOKMARKS: BookmarkData = {
  bookmarkedIds: [],
  highlights: {},
  notes: {}
};

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isOnline, setUserProfileState } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkData>(DEFAULT_BOOKMARKS);

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBookmarks = localStorage.getItem("velora_bookmarks");
      if (savedBookmarks) {
        try {
          setBookmarks(JSON.parse(savedBookmarks));
        } catch (e) {}
      }
    }
  }, []);

  // Update when user auth profile synchronizes
  useEffect(() => {
    if (user && user.bookmarks) {
      setBookmarks(user.bookmarks);
      if (typeof window !== "undefined") {
        localStorage.setItem("velora_bookmarks", JSON.stringify(user.bookmarks));
      }
    }
  }, [user]);

  const updateBookmarks = async (updater: (prev: BookmarkData) => BookmarkData) => {
    setBookmarks(prev => {
      const updated = updater(prev);
      if (typeof window !== "undefined") {
        localStorage.setItem("velora_bookmarks", JSON.stringify(updated));
      }
      
      // Push async to server if connected
      if (isOnline && user) {
        userService.syncBookmarks(updated).then(synced => {
          // Sync client profile state
          const currUser = { ...user, bookmarks: synced };
          setUserProfileState(currUser);
        }).catch(() => {});
      }
      return updated;
    });
  };

  return (
    <BookmarksContext.Provider value={{
      bookmarks,
      updateBookmarks
    }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error("useBookmarks must be used within BookmarksProvider");
  return context;
};
