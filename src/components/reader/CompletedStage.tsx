"use client";

import React from "react";
import Image from "next/image";
import { Check, Star, ArrowRight } from "lucide-react";
import { StoryDetail } from "../../types";

interface CompletedStageProps {
  story: StoryDetail;
  recommendations: StoryDetail[];
  onBack: () => void;
  onSelectStory: (s: StoryDetail) => void;
  playClickSound: () => void;
}

export default function CompletedStage({
  story,
  recommendations,
  onBack,
  onSelectStory,
  playClickSound
}: CompletedStageProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black z-40 overflow-y-auto select-none">
      <div className="max-w-2xl w-full text-center space-y-8 py-10 scale-up-entry">
        
        {/* Success badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <Check className="text-emerald-400 w-8 h-8" />
        </div>

        <div className="space-y-3">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono">Journey Completed</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white" style={{ fontFamily: "Cinzel, serif" }}>
            You've Unlocked the Archive
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-md mx-auto">
            Your knowledge of the mystery has been successfully expanded. Streak days and achievements have been logged in the cloud databases.
          </p>
        </div>

        {/* Dynamic recommendation card list */}
        <div className="space-y-4 pt-6 border-t border-white/5 text-left">
          <h3 className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-1">Recommended Next Journeys</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                onClick={() => { onSelectStory(rec); playClickSound(); }}
                className="bg-[#0b0c11] border border-white/5 hover:border-[#e5c158]/30 rounded-2xl p-4 flex gap-4 cursor-pointer transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={rec.image} alt={rec.title.en} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{rec.category}</span>
                    <h4 className="text-xs font-semibold text-white group-hover:text-[#e5c158] truncate transition-colors">
                      {rec.title.en}
                    </h4>
                  </div>
                  <span className="text-[9px] text-[#e5c158] font-semibold flex items-center gap-1">
                    Explore <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-8 px-8 py-3 rounded-full border border-white/10 hover:border-white/30 text-xs font-light tracking-[0.2em] uppercase text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
