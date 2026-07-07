"use client";

import React from "react";
import Image from "next/image";
import { Play, Award, Clock, Star } from "lucide-react";
import { StoryDetail } from "../../types";

interface CoverStageProps {
  story: StoryDetail;
  lang: "en" | "hi" | "mr";
  onBegin: () => void;
}

export default function CoverStage({ story, lang, onBegin }: CoverStageProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10 text-left bg-black select-none">
      <div className="absolute inset-0 z-0">
        <Image
          src={story.image}
          alt={story.title.en}
          fill
          priority
          className="object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-[#e5c158]/10 border border-[#e5c158]/30 text-[#e5c158] text-[9px] uppercase tracking-[0.25em] px-3.5 py-1 rounded-full font-bold">
            {story.category}
          </span>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <Clock size={11} /> {story.duration} Read
          </span>
        </div>

        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-wide"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {story.title[lang] || story.title.en}
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
          {story.synopsis[lang] || story.synopsis.en}
        </p>

        {/* Fact check & learning insights */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex-1 text-xs">
            <span className="text-[#e5c158] font-bold uppercase tracking-wider block text-[9px] mb-1">FACT CHECK STATUS</span>
            <span className="text-zinc-300 font-light">{story.factLabel} ({story.factStatus})</span>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex-1 text-xs">
            <span className="text-[#0088ff] font-bold uppercase tracking-wider block text-[9px] mb-1">LEARNING OBJECTIVES</span>
            <ul className="list-disc pl-4 mt-0.5 text-[10px] text-zinc-400 font-light space-y-0.5">
              {story.learningObjectives.slice(0, 2).map((obj, i) => (
                <li key={i}>{obj[lang] || obj.en}</li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onBegin}
          className="mt-4 bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black font-semibold text-sm tracking-wider uppercase px-8 py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(229,193,88,0.3)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play size={14} fill="currentColor" /> Begin Reading Journey
        </button>
      </div>
    </div>
  );
}
