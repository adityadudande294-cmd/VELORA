"use client";

import React from "react";
import { Volume2, VolumeX, Headphones, Music } from "lucide-react";
import { AmbientTheme } from "../../types";

interface AmbientControlsProps {
  ambientTheme: AmbientTheme;
  setAmbientTheme: (t: AmbientTheme) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}

export default function AmbientControls({
  ambientTheme,
  setAmbientTheme,
  isMuted,
  setIsMuted,
  volume,
  setVolume
}: AmbientControlsProps) {
  return (
    <div className="bg-[#0c0d14] border border-white/5 p-6 rounded-3xl space-y-5 text-left">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <Headphones className="text-[#0088ff] animate-pulse w-5 h-5" />
        <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Atmospheric Soundtrack</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <label className="text-zinc-400 font-light flex items-center gap-1.5">
            <Music size={13} className="text-[#e5c158]" /> Select Ambient Atmosphere
          </label>
          <select
            value={ambientTheme}
            onChange={(e) => setAmbientTheme(e.target.value as AmbientTheme)}
            className="bg-[#050505] border border-white/10 rounded-xl text-xs font-light text-zinc-300 px-3 py-2 focus:outline-none"
          >
            <option value="library">Distant Library & Whispers</option>
            <option value="space">Deep Space Synthesizer Pads</option>
            <option value="ancient">Resonant Cave & Flute</option>
            <option value="calm">Calm Sea Shore Drones</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors focus:outline-none text-xs"
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="text-zinc-500" />
                <span>Ambient is Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-[#e5c158]" />
                <span>Ambient is Active</span>
              </>
            )}
          </button>
          
          {!isMuted && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
              />
              <span className="text-[10px] text-zinc-500 font-mono w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
