"use client";

import React, { useState } from "react";
import VELORAIntro from "@/components/VELORAIntro";
import Dashboard from "@/components/Dashboard";
import StoryReader from "@/components/StoryReader";

interface Story {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  tags: string[];
  synopsis: string;
  archaeologicalNotes: string;
  era: string;
  factStatus: string;
  popularity: string;
}

export default function Home() {
  const [view, setView] = useState<"intro" | "dashboard" | "reader">("intro");
  const [userName, setUserName] = useState("Reader");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleStartReading = (story: any) => {
    setSelectedStory(story);
    setView("reader");
  };

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      {view === "intro" && (
        <VELORAIntro
          userName={userName}
          onComplete={() => setView("dashboard")}
        />
      )}
      
      {view === "dashboard" && (
        <Dashboard onStartReading={handleStartReading} />
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
