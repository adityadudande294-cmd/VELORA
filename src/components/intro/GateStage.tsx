"use client";

import React from "react";

interface GateStageProps {
  onStart: () => void;
  fontFam: string;
}

export default function GateStage({ onStart, fontFam }: GateStageProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] px-6 text-center z-50">
      <div className="space-y-6 max-w-lg scale-up-entry">
        <h1
          className="text-5xl sm:text-6xl font-light tracking-[0.25em] text-white/95"
          style={{ fontFamily: fontFam }}
        >
          VELORA
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase text-[#e5c158]/80 font-medium">
          Every Story Has a Truth Waiting to Be Discovered.
        </p>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#e5c158]/50 to-transparent mx-auto my-6" />
        <p className="text-white/40 text-xs tracking-wider max-w-sm mx-auto leading-relaxed">
          This experience features highly atmospheric audio, spatial 3D effects, and immersive narration. Please wear headphones for the optimal journey.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-3 rounded-full border border-[#e5c158]/40 bg-gradient-to-b from-white/5 to-white/0 hover:border-[#e5c158] hover:bg-white/10 active:scale-95 transition-all duration-300 font-light tracking-[0.2em] uppercase text-sm text-[#e5c158] shadow-[0_0_15px_rgba(229,193,88,0.1)] hover:shadow-[0_0_25px_rgba(229,193,88,0.25)]"
        >
          Begin Journey
        </button>
      </div>
    </div>
  );
}
