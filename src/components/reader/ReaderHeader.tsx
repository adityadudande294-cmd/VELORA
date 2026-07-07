"use client";

import React from "react";
import { ArrowLeft, Settings, Play, Pause, ChevronLeft, ChevronRight, Headphones, Volume2, VolumeX } from "lucide-react";

interface ReaderHeaderProps {
  onBack: () => void;
  title: string;
  readingProgress: number;
  isPlayingTTS: boolean;
  onStartTTS: () => void;
  onStopTTS: () => void;
  onSkipTTS: (dir: "prev" | "next") => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  voices: SpeechSynthesisVoice[];
}

export default function ReaderHeader({
  onBack,
  title,
  readingProgress,
  isPlayingTTS,
  onStartTTS,
  onStopTTS,
  onSkipTTS,
  showSettings,
  setShowSettings,
  isMuted,
  setIsMuted,
  selectedVoice,
  setSelectedVoice,
  voices
}: ReaderHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between text-left">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <span 
          className="text-sm font-semibold tracking-wider text-white truncate max-w-[200px] sm:max-w-sm"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {title}
        </span>
      </div>

      {/* TTS Audio controls */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs">
          <Headphones size={12} className="text-[#0088ff]" />
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="bg-transparent border-none text-[10px] text-zinc-300 focus:outline-none max-w-[120px] truncate"
          >
            {voices.map((v, i) => (
              <option key={i} value={v.name} className="bg-zinc-950 text-white">
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 text-zinc-400">
          <button 
            onClick={() => onSkipTTS("prev")} 
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Previous Sentence"
          >
            <ChevronLeft size={14} />
          </button>
          
          <button 
            onClick={onStartTTS}
            className="p-1.5 bg-[#0088ff] text-white hover:bg-blue-600 rounded-full active:scale-95 transition-all cursor-pointer"
            title={isPlayingTTS ? "Pause Narration" : "Start Narration"}
          >
            {isPlayingTTS ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
          </button>

          <button 
            onClick={() => onSkipTTS("next")}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Next Sentence"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-full border transition-all cursor-pointer ${
            isMuted 
              ? "bg-red-950/40 border-red-500/25 text-red-400" 
              : "bg-blue-950/40 border-blue-500/25 text-blue-400"
          }`}
          title={isMuted ? "Unmute Ambient" : "Mute Ambient"}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          title="Reader Preferences"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Floating progress bar */}
      <div className="absolute bottom-0 left-0 h-[1.5px] bg-[#e5c158] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
    </header>
  );
}
