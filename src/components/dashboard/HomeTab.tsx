"use client";

import React from "react";
import Image from "next/image";
import { Clock, Star, Award, Flame, ChevronRight } from "lucide-react";
import { StoryDetail } from "../../types";
import { useSettings } from "../../contexts/SettingsContext";
import { KNOWLEDGE_DATABASE } from "../../data/knowledgeDatabase";
import { getStoryDetail } from "../../utils/storyEngine";


interface HomeTabProps {
  daily: any;
  onStartReading: (s: StoryDetail) => void;
  setSelectedStory: (s: StoryDetail | null) => void;
  playClickSound: () => void;
  statsSectionRef: React.RefObject<HTMLDivElement | null>;
  statStories: number;
  statHours: number;
  statStreak: number;
}

export default function HomeTab({
  daily,
  onStartReading,
  setSelectedStory,
  playClickSound,
  statsSectionRef,
  statStories,
  statHours,
  statStreak
}: HomeTabProps) {
  const { userSettings } = useSettings();
  const lang = userSettings.lang;

  return (
    <div className="space-y-20">
      {/* Hero Spotlight Story */}
      {daily && daily.storyOfTheDay && (
        <section 
          onClick={() => { setSelectedStory(daily.storyOfTheDay); playClickSound(); }}
          className="relative w-full min-h-[420px] rounded-3xl overflow-hidden border border-white/5 hover:border-[#e5c158]/30 flex flex-col justify-end p-8 md:p-12 shadow-2xl group cursor-pointer transition-all duration-500 scale-up-entry text-left"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={daily.storyOfTheDay.image}
              alt={daily.storyOfTheDay.title.en}
              fill
              priority
              className="object-cover scale-[1.03] group-hover:scale-105 transition-transform duration-10000 brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="bg-[#e5c158]/10 border border-[#e5c158]/30 text-[#e5c158] text-[9px] uppercase tracking-[0.25em] px-3.5 py-1 rounded-full font-bold">
                {daily.storyOfTheDay.category}
              </span>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Clock size={11} /> {daily.storyOfTheDay.duration} Read
              </span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-light text-white tracking-wide"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {daily.storyOfTheDay.title[lang] || daily.storyOfTheDay.title.en}
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
              {daily.storyOfTheDay.synopsis[lang] || daily.storyOfTheDay.synopsis.en}
            </p>
            <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl max-w-sm text-[11px] text-zinc-400">
              <span className="text-[#e5c158] font-bold uppercase tracking-wider block text-[9px]">FACT CLASSIFICATION</span>
              {daily.storyOfTheDay.factLabel} ({daily.storyOfTheDay.factStatus})
            </div>
          </div>
        </section>
      )}

      {/* Daily Event / Science Discoveries Banner Row */}
      {daily && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-950/20 to-transparent border border-indigo-500/10 p-5 rounded-2xl text-left space-y-2">
            <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">Historical Event of the Day</span>
            <h4 className="text-xs font-semibold text-white">{daily.eventOfTheDay.title}</h4>
            <p className="text-[11px] text-zinc-400 leading-normal font-light">{daily.eventOfTheDay.event}</p>
          </div>

          <div className="bg-gradient-to-br from-sky-950/20 to-transparent border border-sky-500/10 p-5 rounded-2xl text-left space-y-2">
            <span className="text-[10px] text-sky-400 uppercase tracking-wider font-bold">Science Discovery of the Day</span>
            <h4 className="text-xs font-semibold text-white">{daily.scienceOfTheDay.topic}</h4>
            <p className="text-[11px] text-zinc-400 leading-normal font-light">{daily.scienceOfTheDay.text}</p>
          </div>

          <div 
            onClick={() => { setSelectedStory(daily.randomMystery); playClickSound(); }}
            className="bg-gradient-to-br from-amber-950/20 to-transparent border border-amber-500/10 p-5 rounded-2xl text-left space-y-2 cursor-pointer hover:border-amber-500/40 transition-colors"
          >
            <span className="text-[10px] text-[#e5c158] uppercase tracking-wider font-bold">Spotlight Random Mystery</span>
            <h4 className="text-xs font-semibold text-white">{daily.randomMystery.title[lang] || daily.randomMystery.title.en}</h4>
            <p className="text-[11px] text-zinc-400 truncate font-light">{daily.randomMystery.subtitle.en}</p>
            <span className="text-[9px] text-[#e5c158] flex items-center gap-1 font-semibold pt-1">Explore Now <ChevronRight size={10} /></span>
          </div>
        </section>
      )}

      {/* Continue Reading Section */}
      {userSettings.history.length > 0 && (
        <section className="space-y-4 text-left">
          <h2 className="text-xl font-light uppercase tracking-widest text-zinc-300 animate-fade-in" style={{ fontFamily: "Cinzel, serif" }}>
            Continue Journeys
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSettings.history.slice(0, 2).map((storyId) => {
              const story = getStoryDetail(storyId);
              return (
                <div
                  key={story.id}
                  onClick={() => { onStartReading(story); playClickSound(); }}
                  className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{story.category}</span>
                      <h3 className="text-xs font-semibold text-white truncate group-hover:text-[#e5c158] transition-colors">
                        {story.title[lang] || story.title.en}
                      </h3>
                      <p className="text-[10px] text-zinc-500">{story.era}</p>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-[#e5c158] h-1 rounded-full w-2/3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Primary Knowledge Feed */}
      <section className="space-y-6 text-left">
        <h2 className="text-2xl font-light tracking-wider" style={{ fontFamily: "Cinzel, serif" }}>
          Primary Knowledge Feed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(KNOWLEDGE_DATABASE).map((story) => (
            <div
              key={story.id}
              onClick={() => { setSelectedStory(story); playClickSound(); }}
              className="bg-[#0b0c11] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e5c158]/40 group cursor-pointer transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-40 bg-zinc-950">
                <Image src={story.image} alt={story.title.en} fill className="object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] uppercase tracking-wider text-white">
                  {story.category}
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] text-white flex items-center gap-1">
                  <Star size={9} className="text-[#e5c158] fill-[#e5c158]" /> {story.factLabel}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                    {story.title[lang] || story.title.en}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-light line-clamp-2 leading-relaxed">
                    {story.synopsis[lang] || story.synopsis.en}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-white/5 pt-2">
                  <span>{story.era}</span>
                  <span>{story.duration} Read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading Stats Section */}
      <section id="stats-panel" ref={statsSectionRef} className="reveal-on-scroll">
        <div className="bg-[#0c0d14] border border-white/5 rounded-3xl p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Journeys Explored</span>
            <span className="text-3xl sm:text-4xl font-extralight text-white block">{statStories}</span>
            <span className="text-[9px] text-[#e5c158] font-semibold tracking-wider flex items-center justify-center gap-1">
              <Award size={10} /> Knowledge Base
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Hours Invested</span>
            <span className="text-3xl sm:text-4xl font-extralight text-white block">{statHours} hrs</span>
            <span className="text-[9px] text-[#0088ff] font-semibold tracking-wider flex items-center justify-center gap-1">
              <Clock size={10} /> Active Reading
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Preferred Domain</span>
            <span className="text-sm sm:text-base font-light text-white tracking-wide py-1 block">
              {userSettings.favoriteCategory}
            </span>
            <span className="text-[9px] text-zinc-500 font-light block">Calculated from history</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Reading Streak</span>
            <span className="text-3xl sm:text-4xl font-extralight text-[#e5c158] block">{statStreak} Days</span>
            <span className="text-[9px] text-zinc-500 font-semibold flex items-center justify-center gap-1">
              <Flame size={10} className="text-amber-500" /> Keep it going!
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
