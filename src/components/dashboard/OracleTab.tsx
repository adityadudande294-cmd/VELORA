"use client";

import React from "react";
import { Sparkles, Send } from "lucide-react";
import { StoryDetail } from "../../types";
import { getStoryDetail } from "../../utils/storyEngine";


interface OracleTabProps {
  assistantMessages: Array<{ sender: "user" | "ai"; text: string; actionStoryId?: string }>;
  assistantInput: string;
  setAssistantInput: (val: string) => void;
  handleAssistantSend: () => void;
  onStartReading: (s: StoryDetail) => void;
  playClickSound: () => void;
}

export default function OracleTab({
  assistantMessages,
  assistantInput,
  setAssistantInput,
  handleAssistantSend,
  onStartReading,
  playClickSound
}: OracleTabProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left scale-up-entry">
      <div className="space-y-2 border-b border-white/5 pb-4">
        <h2 className="text-3xl font-light tracking-wide text-white flex items-center gap-2" style={{ fontFamily: "Cinzel, serif" }}>
          <Sparkles className="text-[#0088ff] animate-pulse" />
          <span>VELORA Knowledge Assistant</span>
        </h2>
        <p className="text-xs text-zinc-400 font-light">
          Ask about historical timelines, scientific views, local legends, or write a custom topic to generate a documentary on it!
        </p>
      </div>

      {/* Conversational Box */}
      <div className="bg-[#0c0d14] border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 h-[420px]">
        
        {/* Message log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
          {assistantMessages.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <span className={`text-[9px] uppercase tracking-wider ${msg.sender === "user" ? "text-zinc-500" : "text-[#0088ff] font-bold"}`}>
                {msg.sender === "user" ? "You" : "VELORA ORACLE"}
              </span>
              <div className={`p-3 rounded-2xl max-w-[85%] font-light leading-relaxed text-xs ${
                msg.sender === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none shadow-md" 
                  : "bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none shadow-md"
              }`}>
                {msg.text}
                
                {msg.actionStoryId && (
                  <button
                    onClick={() => {
                      const storyObj = getStoryDetail(msg.actionStoryId!);
                      onStartReading(storyObj);
                      playClickSound();
                    }}
                    className="mt-3 bg-gradient-to-r from-[#e5c158] to-[#c29e37] text-black font-bold uppercase tracking-wider text-[9px] px-4 py-2 rounded-lg block hover:shadow-[0_2px_10px_rgba(229,193,88,0.3)] transition-all cursor-pointer"
                  >
                    Begin Cinematic Reading
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat input widgets */}
        <div className="flex gap-2.5 border-t border-white/5 pt-4">
          <input
            type="text"
            placeholder="Ask a question or type 'Generate Taj Mahal Secrets'..."
            value={assistantInput}
            onChange={(e) => setAssistantInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAssistantSend(); }}
            className="bg-white/5 border border-white/10 focus:border-[#0088ff]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none flex-1 shadow-inner font-light"
          />
          <button
            onClick={handleAssistantSend}
            className="bg-[#0088ff] hover:bg-blue-600 text-white p-3 rounded-xl active:scale-[0.98] transition-all cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
