"use client";

import React from "react";
import Image from "next/image";
import { Search, X, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useStorySearch } from "../../hooks/useStorySearch";
import { StoryDetail } from "../../types";

interface DashboardHeaderProps {
  activeMenu: string;
  setActiveMenu: (m: string) => void;
  setSelectedCategoryFilter: (c: string | null) => void;
  setSelectedCollectionFilter: (c: string | null) => void;
  setSelectedStory: (s: StoryDetail | null) => void;
  playClickSound: () => void;
  isScrolled: boolean;
  setShowAuthModal: (open: boolean) => void;
}

export default function DashboardHeader({
  activeMenu,
  setActiveMenu,
  setSelectedCategoryFilter,
  setSelectedCollectionFilter,
  setSelectedStory,
  playClickSound,
  isScrolled,
  setShowAuthModal
}: DashboardHeaderProps) {
  const { user, logout, isOnline } = useAuth();
  const { userSettings, userName } = useSettings();
  const {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    searchResults
  } = useStorySearch();

  const isCloudSynced = isOnline && !!user;

  const handleSignOut = () => {
    logout();
    window.location.reload();
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${
        isScrolled 
          ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center gap-8">
        <div 
          onClick={() => { setActiveMenu("home"); playClickSound(); }}
          className="flex flex-col items-start cursor-pointer group"
        >
          <span 
            className="text-2xl font-light tracking-[0.2em] text-white group-hover:text-[#e5c158] transition-colors select-none"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            VELORA
          </span>
          <span className="text-[8px] uppercase tracking-[0.15em] text-[#e5c158] font-semibold -mt-1 opacity-80 select-none">
            AI Story Engine
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-[13px] font-light text-zinc-400">
          {["home", "discover", "categories", "trending", "collections", "bookmarks", "AI Assistant"].map((item) => (
            <button
              key={item}
              onClick={() => { 
                setActiveMenu(item); 
                setSelectedCategoryFilter(null);
                setSelectedCollectionFilter(null);
                playClickSound(); 
              }}
              className={`hover:text-white transition-colors capitalize py-1 relative cursor-pointer ${
                activeMenu === item ? "text-white font-medium" : ""
              }`}
            >
              {item === "home" ? "Home Feed" : item}
              {activeMenu === item && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#e5c158]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Search bar */}
        <div className="relative">
          <div 
            className={`flex items-center bg-white/5 border rounded-full py-1.5 px-3.5 transition-all duration-500 ease-out shadow-inner ${
              isSearchFocused || searchQuery 
                ? "w-64 md:w-72 border-[#e5c158]/50 bg-white/10" 
                : "w-40 md:w-48 border-white/10"
            }`}
          >
            <Search className="text-zinc-500 mr-2 shrink-0 animate-pulse" size={13} />
            <input
              type="text"
              placeholder="Search Forts, Science, temples..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs font-light text-white placeholder-zinc-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="cursor-pointer">
                <X size={12} className="text-zinc-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {(isSearchFocused || searchQuery) && searchResults.length > 0 && (
            <div className="absolute right-0 top-11 w-80 bg-[#090a10] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-fade-in flex flex-col gap-2 max-h-[300px] overflow-y-auto z-50">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-2 pb-1 border-b border-white/5">
                Knowledge Archives ({searchResults.length})
              </span>
              {searchResults.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    playClickSound();
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={story.image}
                      alt={story.title.en}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-light text-white truncate group-hover:text-[#e5c158] transition-colors">
                      {story.title[userSettings.lang] || story.title.en}
                    </h4>
                    <p className="text-[9px] text-zinc-400 mt-0.5 truncate">
                      {story.era} • {story.category}
                    </p>
                  </div>
                  <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-zinc-400 group-hover:border-[#e5c158] group-hover:text-white transition-all shrink-0">
                    Explore
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3">
          {isCloudSynced ? (
            <div className="flex items-center gap-2 select-none">
              <span className="text-[10px] text-[#e5c158] hidden sm:inline font-mono">
                {userName}
              </span>
              <div 
                onClick={handleSignOut}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-950/40 to-emerald-900/40 border border-emerald-500/30 flex items-center justify-center cursor-pointer hover:border-red-500/50 transition-colors"
                title="Sign Out / Disconnect Cloud"
              >
                <User size={12} className="text-emerald-400 hover:text-red-400 transition-colors" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowAuthModal(true); playClickSound(); }}
              className="bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black font-semibold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full hover:shadow-[0_0_10px_rgba(229,193,88,0.2)] transition-all flex items-center gap-1 cursor-pointer"
              title="Connect Cloud Sync"
            >
              Sync to Cloud
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
