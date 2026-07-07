"use client";

import React from "react";
import VELORAIntro from "@/components/VELORAIntro";
import Dashboard from "@/components/Dashboard";
import StoryReader from "@/components/StoryReader";
import { useReading } from "@/contexts/ReadingContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function Home() {
  const { view, setView, selectedStory, handleStartReading } = useReading();
  const { userName } = useSettings();

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      {view === "intro" && (
        <VELORAIntro
          userName={userName}
          onComplete={() => setView("dashboard")}
        />
      )}
      
      {view === "dashboard" && (
        <Dashboard
          onStartReading={handleStartReading}
        />
      )}
      
      {view === "reader" && selectedStory && (
        <StoryReader
          story={selectedStory}
          onBack={() => setView("dashboard")}
        />
      )}
    </main>
  );
}


