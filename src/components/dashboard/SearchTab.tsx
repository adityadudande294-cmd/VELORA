"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { StoryDetail } from "../../types";
import { useSettings } from "../../contexts/SettingsContext";
import { useStorySearch } from "../../hooks/useStorySearch";

interface SearchTabProps {
  setSelectedStory: (s: StoryDetail | null) => void;
  triggerCustomStoryGen: (topic: string) => void;
  playClickSound: () => void;
}

export default function SearchTab({
  setSelectedStory,
  triggerCustomStoryGen,
  playClickSound
}: SearchTabProps) {
  const { userSettings } = useSettings();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    customSearchTopic,
    setCustomSearchTopic,
    isSearching
  } = useStorySearch();

  return (
    <div className="space-y-10 text-left scale-up-entry">
      <div className="space-y-2">
        <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Search & Synthesis Hub</h2>
        <p className="text-xs text-zinc-400 font-light max-w-xl leading-relaxed">
          Query our structured databases with natural language (e.g. "Mysteries in Rajasthan") or input a custom topic to generate a premium original documentary on-the-fly.
        </p>
      </div>

      {/* Custom Story Gen Input Block */}
      <div className="bg-[#0c0d14] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Sparkles size={16} className="text-[#e5c158] animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Create Custom Documentary Story</h3>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-zinc-400 font-light">
            Type any historical mystery, space paradox, or landmark (e.g. "Taj Mahal secrets", "Bermuda Triangle", "The Great Pyramids") and watch the AI synthesize a 1000-word structured documentary.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter custom topic name..."
              value={customSearchTopic}
              onChange={(e) => setCustomSearchTopic(e.target.value)}
              className="bg-white/5 border border-white/10 focus:border-[#e5c158]/40 px-4 py-3 rounded-xl text-xs text-white focus:outline-none flex-1 font-light"
            />
            <button
              onClick={() => triggerCustomStoryGen(customSearchTopic)}
              className="bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(229,193,88,0.25)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              Generate Story <Sparkles size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions buttons */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Natural Queries Suggestions</span>
        <div className="flex flex-wrap gap-2">
          {["Mysteries in Rajasthan", "Ancient temples", "Indian archaeological discoveries", "Black holes explained simply"].map((q, idx) => (
            <button
              key={idx}
              onClick={() => { setSearchQuery(q); }}
              className="bg-white/5 border border-white/10 hover:border-[#e5c158] text-xs font-light px-3 py-1.5 rounded-lg hover:text-white transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Custom search query search feed */}
      {searchQuery && (
        <div className="space-y-4">
          <span className="text-xs text-zinc-400 block font-light">
            {isSearching ? "Searching Knowledge Base..." : `Search Results for "${searchQuery}":`}
          </span>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((story) => (
                <div
                  key={story.id}
                  onClick={() => { setSelectedStory(story); playClickSound(); }}
                  className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-[#e5c158]/30 group cursor-pointer transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{story.category}</span>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#e5c158] truncate transition-colors">
                        {story.title[userSettings.lang] || story.title.en}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-light truncate">{story.subtitle.en}</p>
                    </div>
                    <span className="text-[9px] text-[#e5c158] font-bold block pt-1">{story.factLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isSearching && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center space-y-4">
                <p className="text-xs text-zinc-400 font-light">No matching pre-loaded stories found in the files.</p>
                <button
                  onClick={() => triggerCustomStoryGen(searchQuery)}
                  className="bg-white/5 border border-white/10 hover:border-[#e5c158]/50 text-white text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  Synthesize original story for "{searchQuery}"
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
