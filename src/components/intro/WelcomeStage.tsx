"use client";

import React from "react";

interface WelcomeStageProps {
  userName: string;
  fontFam: string;
}

export default function WelcomeStage({ userName, fontFam }: WelcomeStageProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-40 bg-[#050505]/90 scale-up-entry">
      <div className="space-y-4 max-w-xl">
        <p className="text-white/40 text-xs tracking-[0.25em] uppercase">
          Connection Successful
        </p>
        <h2
          className="text-4xl sm:text-5xl font-light tracking-[0.15em] text-[#e5c158]"
          style={{ fontFamily: fontFam }}
        >
          Welcome, {userName}.
        </h2>
        <p className="text-white/85 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto pt-2">
          Today is a perfect day to discover something extraordinary.
        </p>
        <div className="pt-8">
          <div className="w-1.5 h-1.5 bg-[#e5c158] rounded-full mx-auto animate-ping" />
        </div>
      </div>
    </div>
  );
}
