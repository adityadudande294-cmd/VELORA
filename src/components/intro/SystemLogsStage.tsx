"use client";

import React from "react";

interface SystemLogsStageProps {
  loadingPercent: number;
  logList: string[];
  logIndex: number;
}

export default function SystemLogsStage({ loadingPercent, logList, logIndex }: SystemLogsStageProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-40 bg-[#050505]/80 backdrop-blur-[2px]">
      <div className="w-full max-w-md flex flex-col items-center gap-10">
        
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="#0088ff"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={2 * Math.PI * 54 * (1 - loadingPercent / 100)}
              className="transition-all duration-500 ease-out"
              style={{
                filter: "drop-shadow(0px 0px 8px rgba(0, 136, 255, 0.8))",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extralight tracking-wider text-white">
              {loadingPercent}%
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#0088ff] font-medium mt-1">
              Syncing
            </span>
          </div>
        </div>

        <div className="w-full bg-black/40 border border-white/5 rounded-xl p-6 h-48 overflow-hidden flex flex-col justify-end gap-1.5 font-mono text-[11px] text-white/50 shadow-inner">
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 scrollbar-none pr-1">
            {logList.map((log, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  i === logIndex
                    ? "text-[#e5c158] translate-x-1"
                    : "text-white/40"
                }`}
              >
                <span className="text-[#0088ff] font-bold">▶</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
