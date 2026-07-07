"use client";

import React from "react";
import { X, Type, AlignLeft, SunMoon } from "lucide-react";

interface ReaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (t: string) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  lineHeight: number;
  setLineHeight: (h: number) => void;
  explanationMode: "normal" | "summary" | "timeline";
  setExplanationMode: (m: "normal" | "summary" | "timeline") => void;
}

export default function ReaderSettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  explanationMode,
  setExplanationMode
}: ReaderSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans text-xs">
      <div className="bg-[#0b0c12] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl space-y-6 text-left text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] text-[#e5c158] uppercase font-bold tracking-widest block">Format Settings</span>
          <h3 className="text-lg font-light tracking-wide uppercase" style={{ fontFamily: "Cinzel, serif" }}>
            Reader Preferences
          </h3>
        </div>

        {/* Themes Selection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
            <SunMoon size={12} /> Color Workspace Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: "dark", label: "Midnight" },
              { code: "amoled", label: "AMOLED" },
              { code: "sepia", label: "Sepia Warm" },
              { code: "paper", label: "Paper Book" },
              { code: "contrast", label: "High Contrast" }
            ].map((t) => (
              <button
                key={t.code}
                onClick={() => setTheme(t.code)}
                className={`py-2 px-1 rounded-xl border text-[10px] font-semibold text-center transition-all cursor-pointer ${
                  theme === t.code 
                    ? "bg-[#e5c158] border-[#e5c158] text-[#050505]"
                    : "bg-white/5 border-white/5 hover:border-white/10 text-zinc-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Sizes & Spacing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
              <Type size={12} /> Text Sizing
            </label>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setFontSize(Math.max(12, fontSize - 2))} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center font-bold cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-mono">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(Math.min(28, fontSize + 2))} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <label className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
              <AlignLeft size={12} /> Line Spacing
            </label>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setLineHeight(Math.max(1.4, lineHeight - 0.1))} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center font-bold cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-mono">{lineHeight.toFixed(1)}</span>
              <button 
                onClick={() => setLineHeight(Math.min(2.2, lineHeight + 0.1))} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Text Presentation Format style */}
        <div className="space-y-2 border-t border-white/5 pt-4">
          <label className="text-[10px] uppercase font-bold text-zinc-500 block">AI Reading Mode</label>
          <div className="flex bg-black border border-white/10 p-1 rounded-xl gap-1">
            {[
              { code: "normal", label: "Full Text" },
              { code: "summary", label: "Key Summary" }
            ].map((mode) => (
              <button
                key={mode.code}
                onClick={() => setExplanationMode(mode.code as any)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-center transition-all cursor-pointer ${
                  explanationMode === mode.code 
                    ? "bg-[#0088ff] text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
