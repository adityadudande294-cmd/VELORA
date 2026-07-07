"use client";

import React from "react";
import Image from "next/image";
import { StoryDetail } from "../../types";
import { useBookmarks } from "../../contexts/BookmarksContext";
import { useSettings } from "../../contexts/SettingsContext";
import { getStoryDetail } from "../../utils/storyEngine";


interface SavedTabProps {
  setSelectedStory: (s: StoryDetail | null) => void;
  deleteNote: (storyId: string, idx: number) => void;
  exportNotes: () => void;
  playClickSound: () => void;
}

export default function SavedTab({
  setSelectedStory,
  deleteNote,
  exportNotes,
  playClickSound
}: SavedTabProps) {
  const { bookmarks } = useBookmarks();
  const { userSettings } = useSettings();

  return (
    <div className="space-y-10 text-left scale-up-entry">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Bookmark Intelligence</h2>
          <p className="text-xs text-zinc-400 font-light">Your saved records, custom highlights, and personal research notes.</p>
        </div>
        {Object.keys(bookmarks.notes).length > 0 && (
          <button
            onClick={exportNotes}
            className="bg-white/5 border border-white/10 hover:border-[#e5c158] text-[11px] font-semibold tracking-wider text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Export Research Notes
          </button>
        )}
      </div>

      {/* Bookmarked stories */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Bookmarked Journeys</h3>
        {bookmarks.bookmarkedIds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.bookmarkedIds.map(storyId => {
              const story = getStoryDetail(storyId);
              return (
                <div
                  key={story.id}
                  onClick={() => { setSelectedStory(story); playClickSound(); }}
                  className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div>
                      <h3 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                        {story.title[userSettings.lang] || story.title.en}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-light truncate">{story.subtitle.en}</p>
                    </div>
                    <span className="text-[9px] text-[#e5c158] block pt-1">{story.factLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic font-light">No bookmarked stories yet. Open a story and click the bookmark icon to save it.</p>
        )}
      </div>

      {/* Notes list */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Personal Research Notes</h3>
        {Object.keys(bookmarks.notes).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(bookmarks.notes).map(([storyId, notesObj]) => {
              const story = getStoryDetail(storyId);
              return (
                <div key={storyId} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-[#e5c158]">{story.title.en}</span>
                    <span className="text-[9px] text-zinc-500 font-light">{story.category}</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(notesObj).map(([idx, noteText]) => (
                      <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-start gap-4">
                        <div className="space-y-1 text-xs">
                          <span className="text-[9px] text-blue-400 font-semibold">Sentence #{Number(idx) + 1} Note</span>
                          <p className="text-zinc-300 font-light">"{noteText}"</p>
                        </div>
                        <button 
                          onClick={() => deleteNote(storyId, Number(idx))}
                          className="text-zinc-500 hover:text-red-400 transition-colors text-[10px] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic font-light">No saved notes. Double-click or click sentences inside the reader to write notes.</p>
        )}
      </div>
    </div>
  );
}
