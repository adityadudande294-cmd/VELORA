"use client";

import { useState, useEffect } from "react";
import { StoryDetail } from "../types";
import { storyService } from "../services/storyService";
import { naturalLanguageSearch } from "../utils/storyEngine";

export function useStorySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<StoryDetail[]>([]);
  const [customSearchTopic, setCustomSearchTopic] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await storyService.searchStories(searchQuery);
        setSearchResults(results);
      } catch (e) {
        setSearchResults(naturalLanguageSearch(searchQuery));
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    searchResults,
    setSearchResults,
    customSearchTopic,
    setCustomSearchTopic,
    isSearching
  };
}
