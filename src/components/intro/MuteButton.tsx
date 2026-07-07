"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MuteButtonProps {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export default function MuteButton({ isMuted, setIsMuted, volume, setVolume }: MuteButtonProps) {
  return (
    <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg transition-opacity duration-500 z-50">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="text-white/80 hover:text-white transition-colors focus:outline-none"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
      />
    </div>
  );
}
