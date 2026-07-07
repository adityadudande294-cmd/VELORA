"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Star, Headphones, Settings, LogOut, Award, Flame, Clock, VolumeX, Volume2, X, ChevronRight } from "lucide-react";

import { StoryDetail, AmbientTheme } from "../types";

import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useAmbientAudio } from "../hooks/useAmbientAudio";
import { storyService } from "../services/storyService";
import { KNOWLEDGE_DATABASE } from "../data/knowledgeDatabase";
import { getStoryDetail, getDailyFeatures } from "../utils/storyEngine";
import DashboardHeader from "./dashboard/DashboardHeader";


import AuthModal from "./dashboard/AuthModal";
import HomeTab from "./dashboard/HomeTab";
import SearchTab from "./dashboard/SearchTab";
import OracleTab from "./dashboard/OracleTab";
import SavedTab from "./dashboard/SavedTab";
import AmbientControls from "./dashboard/AmbientControls";

interface DashboardProps {
  onStartReading: (story: StoryDetail) => void;
}

const CATEGORIES = [
  { name: "Indian Mysteries", color: "from-amber-600/30 to-[#e5c158]/5 border-amber-500/20" },
  { name: "Ancient India", color: "from-yellow-600/30 to-[#e5c158]/5 border-yellow-500/20" },
  { name: "History", color: "from-blue-600/30 to-[#0088ff]/5 border-blue-500/20" },
  { name: "Archaeology", color: "from-indigo-600/30 to-indigo-500/5 border-indigo-500/20" },
  { name: "Space & Science", color: "from-sky-600/30 to-[#0088ff]/5 border-sky-500/20" },
  { name: "Civilizations", color: "from-cyan-600/30 to-cyan-500/5 border-cyan-500/20" },
  { name: "Legends & Folklore", color: "from-red-600/30 to-red-500/5 border-red-500/20" },
  { name: "Unexplained Phenomena", color: "from-purple-600/30 to-purple-500/5 border-purple-500/20" }
];

const COLLECTIONS_METADATA = [
  { name: "Hidden India", desc: "Secrets buried in the jungles, forts, and ruins of the subcontinent.", cover: "/images/bhangarh.png" },
  { name: "Lost Kingdoms", desc: "Metropolises and royal centers swallowed by oceans and desert sands.", cover: "/images/dwarka.png" },
  { name: "Mysteries of Nature", desc: "Phenomena that defy standard geological and biological consensus.", cover: "/images/jatinga.png" },
  { name: "Ancient Engineering", desc: "Colossal structures built with technologies lost to time.", cover: "/images/konark.png" }
];

export default function Dashboard({ onStartReading }: DashboardProps) {
  const { isOnline, user, logout } = useAuth();
  const { userSettings, updateSettings, userName, setUserNameState } = useSettings();
  const { bookmarks, updateBookmarks } = useBookmarks();

  const {
    ambientTheme,
    setAmbientTheme,
    isMuted,
    setIsMuted,
    volume,
    setVolume,
    playClickSound
  } = useAmbientAudio();

  const [selectedStory, setSelectedStory] = useState<StoryDetail | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filter Selectors
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | null>(null);
  
  // Daily Feeds
  const [daily, setDaily] = useState<any>(null);

  // Stats counting states
  const [statStories, setStatStories] = useState(0);
  const [statHours, setStatHours] = useState(0.0);
  const [statStreak, setStatStreak] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // Oracle message logs
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: "user" | "ai"; text: string; actionStoryId?: string }>>([]);

  useEffect(() => {
    setDaily(getDailyFeatures());
    setAssistantMessages([
      { sender: "ai", text: `Greetings, ${userName}. I am the VELORA Knowledge Oracle. Ask me any historical mystery, space fact, or type a custom topic to generate a fresh premium documentary on-the-fly!` }
    ]);
  }, [userName]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stats Counting animation
  useEffect(() => {
    if (!statsAnimated) return;
    const storiesEnd = userSettings.history.length || 6;
    const hoursEnd = Number((storiesEnd * 0.25).toFixed(1)) || 1.5;
    const streakEnd = userSettings.streak || 1;
    const steps = 40;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setStatStories(Math.floor(storiesEnd * progress));
      setStatHours(parseFloat((hoursEnd * progress).toFixed(1)));
      setStatStreak(Math.floor(streakEnd * progress));

      if (step >= steps) {
        setStatStories(storiesEnd);
        setStatHours(hoursEnd);
        setStatStreak(streakEnd);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [statsAnimated, userSettings.history, userSettings.streak]);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            if (entry.target.id === "stats-panel") {
              setStatsAnimated(true);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const scrollElements = document.querySelectorAll(".reveal-on-scroll");
    scrollElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const triggerCustomStoryGen = async (topic: string) => {
    if (!topic.trim()) return;
    playClickSound();
    try {
      const customStory = await storyService.synthesizeCustomStory(topic);
      KNOWLEDGE_DATABASE[customStory.id] = customStory;
      setSelectedStory(customStory);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssistantSend = async () => {
    if (!assistantInput.trim()) return;
    playClickSound();
    const query = assistantInput;
    setAssistantMessages(prev => [...prev, { sender: "user", text: query }]);
    setAssistantInput("");

    let reply = "";
    let actionStoryId = "";

    try {
      const isGenerate = query.toLowerCase().includes("generate") || query.toLowerCase().includes("write");
      if (isGenerate) {
        const topic = query.replace(/generate|write about|tell me about|story/gi, "").trim();
        const customStory = await storyService.synthesizeCustomStory(topic || "Unknown");
        KNOWLEDGE_DATABASE[customStory.id] = customStory;
        reply = `I have dynamically generated a new cinematic documentary for "${topic || "Unknown"}"! Click the button below to start reading it.`;
        actionStoryId = customStory.id;
      } else {
        // Mock fallback query
        reply = "That is an intriguing historical enigma. According to archaeological databases, scientific measurements (like carbon dating) have challenged classical legends regarding it, though research is ongoing.";
      }
    } catch (e) {
      reply = "Connection error. Please try again.";
    }

    setAssistantMessages(prev => [...prev, { sender: "ai", text: reply, actionStoryId }]);
  };

  const deleteNote = (storyId: string, idx: number) => {
    updateBookmarks(prev => {
      const nextNotes = { ...prev.notes };
      if (nextNotes[storyId]) {
        delete nextNotes[storyId][idx];
        if (Object.keys(nextNotes[storyId]).length === 0) {
          delete nextNotes[storyId];
        }
      }
      return { ...prev, notes: nextNotes };
    });
  };

  const exportNotes = () => {
    const allNotesText = Object.entries(bookmarks.notes).map(([storyId, notesObj]) => {
      const story = getStoryDetail(storyId);
      const notesLines = Object.entries(notesObj).map(([idx, text]) => `- Sentence #${Number(idx) + 1}: "${text}"`).join("\n");
      return `### ${story.title.en}\n${notesLines}`;
    }).join("\n\n");
    
    const blob = new Blob([`# VELORA Reading Notes\n\n${allNotesText || "No saved notes yet."}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "velora_reading_notes.txt";
    a.click();
    URL.revokeObjectURL(url);
    playClickSound();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex flex-col selection:bg-[#e5c158]/30 selection:text-white pb-16 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[15%] w-[450px] h-[450px] bg-blue-900/10 rounded-full blur-[120px] opacity-80" />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-[75%] left-[25%] w-[380px] h-[380px] bg-amber-900/5 rounded-full blur-[110px] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,rgba(255,255,255,0.15),transparent_100%),radial-gradient(1px_1px_at_80px_140px,rgba(255,255,255,0.1),transparent_100%),radial-gradient(1.5px_1.5px_at_140px_70px,rgba(229,193,88,0.15),transparent_100%)] opacity-70 bg-[size:200px_200px]" />
      </div>

      <DashboardHeader
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        setSelectedCollectionFilter={setSelectedCollectionFilter}
        setSelectedStory={setSelectedStory}
        playClickSound={playClickSound}
        isScrolled={isScrolled}
        setShowAuthModal={setShowAuthModal}
      />

      <main className="flex-1 mt-24 px-6 md:px-12 w-full max-w-7xl mx-auto z-10 relative">
        {activeMenu === "home" && (
          <HomeTab
            daily={daily}
            onStartReading={onStartReading}
            setSelectedStory={setSelectedStory}
            playClickSound={playClickSound}
            statsSectionRef={statsSectionRef}
            statStories={statStories}
            statHours={statHours}
            statStreak={statStreak}
          />
        )}

        {activeMenu === "discover" && (
          <SearchTab
            setSelectedStory={setSelectedStory}
            triggerCustomStoryGen={triggerCustomStoryGen}
            playClickSound={playClickSound}
          />
        )}

        {activeMenu === "categories" && (
          <div className="space-y-10 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Knowledge Domains</h2>
              <p className="text-xs text-zinc-400 font-light max-w-xl">Filter and browse stories by specific disciplines.</p>
            </div>

            {!selectedCategoryFilter ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedCategoryFilter(cat.name); playClickSound(); }}
                    className={`bg-gradient-to-br ${cat.color} border p-5 rounded-2xl flex flex-col justify-between min-h-[120px] group cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-md`}
                  >
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400">Sphere</span>
                    <h3 className="text-base font-light text-white tracking-wide group-hover:text-[#e5c158] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedCategoryFilter(null)} className="text-xs text-zinc-500 hover:text-white cursor-pointer">◀ All Categories</button>
                  <span className="text-sm font-semibold text-white">/ {selectedCategoryFilter}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(KNOWLEDGE_DATABASE).filter(s => s.category === selectedCategoryFilter).map(story => (
                    <div
                      key={story.id}
                      onClick={() => { setSelectedStory(story); playClickSound(); }}
                      className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-[#e5c158]/30 group cursor-pointer transition-colors"
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMenu === "trending" && (
          <div className="space-y-8 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Trending Narratives</h2>
              <p className="text-xs text-zinc-400 font-light">Popular historical investigations currently trending among the readers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(KNOWLEDGE_DATABASE).map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => { setSelectedStory(story); playClickSound(); }}
                  className="bg-[#0b0c11] border border-white/5 rounded-3xl overflow-hidden hover:border-[#e5c158]/30 group cursor-pointer transition-all duration-300 flex"
                >
                  <div className="relative w-1/3 min-h-[160px] bg-zinc-950 shrink-0">
                    <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{story.category}</span>
                        <span className="text-[12px] font-bold text-white/20">#0{idx+1}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                        {story.title[userSettings.lang] || story.title.en}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {story.synopsis[userSettings.lang] || story.synopsis.en}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-white/5 pt-2">
                      <span>{story.era}</span>
                      <span className="text-[#e5c158] font-bold">{story.factLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === "collections" && (
          <div className="space-y-10 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Curated Collections</h2>
              <p className="text-xs text-zinc-400 font-light">Thematic groupings of stories spanning civilizations, space, and legends.</p>
            </div>

            {!selectedCollectionFilter ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {COLLECTIONS_METADATA.map((col, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedCollectionFilter(col.name); playClickSound(); }}
                    className="bg-[#0b0c11] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e5c158]/30 group cursor-pointer transition-all duration-300 shadow-lg"
                  >
                    <div className="relative w-full h-36 bg-zinc-950">
                      <Image src={col.cover} alt={col.name} fill className="object-cover brightness-[0.7]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c11] via-transparent to-transparent" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-light tracking-wide text-white group-hover:text-[#e5c158] transition-colors leading-tight">{col.name}</h3>
                      <p className="text-[10px] font-light text-zinc-400 leading-normal">{col.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedCollectionFilter(null)} className="text-xs text-zinc-500 hover:text-white cursor-pointer">◀ All Collections</button>
                  <span className="text-sm font-semibold text-white">/ {selectedCollectionFilter}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(KNOWLEDGE_DATABASE).filter(s => {
                    if (selectedCollectionFilter === "Hidden India") return s.id === "dwarka" || s.id === "bhangarh" || s.id === "roopkund";
                    if (selectedCollectionFilter === "Lost Kingdoms") return s.id === "dwarka" || s.id === "konark";
                    if (selectedCollectionFilter === "Mysteries of Nature") return s.id === "jatinga" || s.id === "roopkund";
                    if (selectedCollectionFilter === "Ancient Engineering") return s.id === "konark" || s.id === "antikythera";
                    return true;
                  }).map(story => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMenu === "bookmarks" && (
          <SavedTab
            setSelectedStory={setSelectedStory}
            deleteNote={deleteNote}
            exportNotes={exportNotes}
            playClickSound={playClickSound}
          />
        )}

        {activeMenu === "AI Assistant" && (
          <OracleTab
            assistantMessages={assistantMessages}
            assistantInput={assistantInput}
            setAssistantInput={setAssistantInput}
            handleAssistantSend={handleAssistantSend}
            onStartReading={onStartReading}
            playClickSound={playClickSound}
          />
        )}

        {/* PROFILE/SETTINGS TAB */}
        {activeMenu === "profile" && (
          <div className="max-w-xl mx-auto bg-[#0c0d14] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 text-left scale-up-entry">
            <h2 className="text-3xl font-light tracking-wide text-white uppercase" style={{ fontFamily: "Cinzel, serif" }}>Reader Profile</h2>
            <div className="h-[1px] w-full bg-white/5 my-4" />
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserNameState(e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-[#e5c158]/50 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Preferred Language</label>
                <select
                  value={userSettings.lang}
                  onChange={(e) => updateSettings({ lang: e.target.value as any })}
                  className="bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-light text-zinc-300 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500">AI Speech Narration Speed ({userSettings.speed}x)</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={userSettings.speed}
                  onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
                />
              </div>
              {isOnline && user && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 border border-red-500/30 bg-red-950/20 text-red-400 text-xs px-4 py-2 rounded-xl hover:bg-red-950/40 transition-all cursor-pointer"
                  >
                    <LogOut size={13} /> Disconnect Account
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Ambient Sounds HUD */}
      <div className="fixed bottom-6 right-6 z-40 bg-[#0c0d14]/85 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex flex-col gap-3 min-w-[200px] hover:border-[#e5c158]/30 transition-colors">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Headphones size={13} className="text-[#e5c158]" />
            <span>Atmosphere Sound</span>
          </div>
          <button
            onClick={() => { setIsMuted(!isMuted); playClickSound(); }}
            className={`p-1.5 rounded-full focus:outline-none transition-all cursor-pointer ${
              isMuted 
                ? "bg-red-950/40 border border-red-500/25 text-red-400" 
                : "bg-blue-950/40 border border-blue-500/25 text-blue-400"
            }`}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["library", "space", "ancient", "calm"] as AmbientTheme[]).map((themeName) => (
            <button
              key={themeName}
              onClick={() => {
                if (isMuted) setIsMuted(false);
                setAmbientTheme(themeName);
                playClickSound();
              }}
              className={`text-[10px] uppercase font-semibold tracking-wider py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                ambientTheme === themeName && !isMuted
                  ? "bg-[#e5c158] border-[#e5c158] text-[#050505]"
                  : "bg-white/5 border-white/5 hover:border-white/15 text-zinc-400"
              }`}
            >
              {themeName}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[9px] text-zinc-500">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
          />
        </div>
      </div>

      {/* Details Overlay Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#090a10] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(229,193,88,0.15)] flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => { setSelectedStory(null); playClickSound(); }}
              className="absolute top-4 right-4 z-50 bg-black/50 border border-white/10 text-zinc-300 hover:text-white p-2 rounded-full backdrop-blur-md cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>

            <div className="relative w-full md:w-5/12 h-60 md:h-auto min-h-[250px] bg-zinc-950">
              <Image
                src={selectedStory.image || "/images/roopkund.png"}
                alt={selectedStory.title.en}
                fill
                className="object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#090a10]/60 md:to-[#090a10]" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2 md:bottom-12 md:left-8">
                <span className="bg-[#e5c158]/20 border border-[#e5c158]/40 text-[#e5c158] text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                  {selectedStory.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-white leading-tight pt-1" style={{ fontFamily: "Cinzel, serif" }}>
                  {selectedStory.title[userSettings.lang] || selectedStory.title.en}
                </h2>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 pt-1">
                  <span>{selectedStory.era}</span>
                  <span>•</span>
                  <span>{selectedStory.duration}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase text-[#e5c158] font-bold tracking-[0.2em]">Synopsis</h4>
                <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
                  {selectedStory.synopsis[userSettings.lang] || selectedStory.synopsis.en}
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                <div className="text-xs text-[#e5c158] font-medium flex items-center gap-2">
                  <Star size={12} className="fill-[#e5c158]" />
                  <span>Fact Check Label: {selectedStory.factLabel}</span>
                </div>
                <p className="text-zinc-400 text-xs font-light">Status: {selectedStory.factStatus}</p>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2 text-xs">
                <span className="text-[#0088ff] font-bold uppercase tracking-wider text-[9px] block">AI Reading Insights</span>
                <div className="grid grid-cols-2 gap-3 font-light text-zinc-400">
                  <div><strong>Difficulty Level:</strong> {selectedStory.difficulty}</div>
                  <div><strong>Knowledge Level:</strong> {selectedStory.knowledgeLevel}</div>
                  <div className="col-span-2">
                    <strong>Learning Objectives:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                      {selectedStory.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj[userSettings.lang] || obj.en}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedStory.relatedTopics.map((tag, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 text-zinc-400 text-[10px] px-2.5 py-1 rounded-md font-light">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <button
                  onClick={() => {
                    playClickSound();
                    onStartReading(selectedStory);
                    setSelectedStory(null);
                  }}
                  className="w-full bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_5px_15px_rgba(229,193,88,0.3)] transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Play size={14} fill="currentColor" /> Start Cinematic Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
