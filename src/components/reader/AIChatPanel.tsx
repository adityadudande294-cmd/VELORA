"use client";

import React from "react";
import { Sparkles, Send } from "lucide-react";

interface AIChatPanelProps {
  chatMessages: Array<{ sender: "user" | "ai"; text: string }>;
  chatInput: string;
  setChatInput: (val: string) => void;
  handleAskAIQuery: () => void;
}

export default function AIChatPanel({
  chatMessages,
  chatInput,
  setChatInput,
  handleAskAIQuery
}: AIChatPanelProps) {
  return (
    <div className="bg-[#0b0c11] border border-white/10 p-5 rounded-2xl shadow-xl animate-fade-in flex flex-col gap-4 text-left font-sans">
      <div className="text-xs font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
        <Sparkles size={13} className="text-[#0088ff] animate-pulse" />
        <span>Ask AI Assistant</span>
      </div>

      <div className="space-y-3 h-44 overflow-y-auto pr-1 border border-white/5 p-3 rounded-lg bg-black/20 text-xs scrollbar-none">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <span className={`text-[9px] uppercase tracking-wider ${msg.sender === "user" ? "text-zinc-500" : "text-[#0088ff] font-bold"}`}>
              {msg.sender === "user" ? "You" : "VELORA AI"}
            </span>
            <div className={`p-2.5 rounded-xl max-w-[85%] font-light leading-relaxed ${
              msg.sender === "user" 
                ? "bg-blue-600 text-white rounded-tr-none shadow-md" 
                : "bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none shadow-md"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion clicks */}
      <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
        {["How did they die?", "Who discovered this?", "Is this scientifically verified?", "What evidence exists?"].map((q, idx) => (
          <button
            key={idx}
            onClick={() => { setChatInput(q); }}
            className="bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:border-[#0088ff] hover:text-white transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about dates, discoveries, evidence, curses..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAskAIQuery(); }}
          className="bg-white/5 border border-white/10 focus:border-[#0088ff]/50 rounded-xl px-3 py-2 text-xs font-light text-white focus:outline-none flex-1 shadow-inner"
        />
        <button
          onClick={handleAskAIQuery}
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl active:scale-95 transition-all cursor-pointer"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
