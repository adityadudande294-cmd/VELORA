"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { StoryDetail } from "../../types";

interface AISummaryPanelProps {
  story: StoryDetail;
  lang: "en" | "hi" | "mr";
  activeSummaryTab: "takeaways" | "dates" | "places" | "people" | "30s" | "2m";
  setActiveSummaryTab: (tab: "takeaways" | "dates" | "places" | "people" | "30s" | "2m") => void;
  playClickSound: () => void;
}

export default function AISummaryPanel({
  story,
  lang,
  activeSummaryTab,
  setActiveSummaryTab,
  playClickSound
}: AISummaryPanelProps) {
  return (
    <div className="bg-[#0b0c11] border border-white/10 p-5 rounded-2xl shadow-xl animate-fade-in text-left">
      <div className="flex items-center gap-3 border-b border-white/5 pb-2 mb-4 overflow-x-auto">
        {[
          { code: "takeaways", label: "Key Takeaways" },
          { code: "dates", label: "Important Dates" },
          { code: "places", label: "Places" },
          { code: "people", label: "People" },
          { code: "30s", label: "30s Summary" },
          { code: "2m", label: "2m Summary" }
        ].map((tab) => (
          <button
            key={tab.code}
            onClick={() => { setActiveSummaryTab(tab.code as any); playClickSound(); }}
            className={`text-[10px] font-semibold uppercase py-1 relative shrink-0 cursor-pointer ${
              activeSummaryTab === tab.code ? "text-[#e5c158]" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {activeSummaryTab === tab.code && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#e5c158]" />
            )}
          </button>
        ))}
      </div>

      <div className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
        {activeSummaryTab === "takeaways" && (
          <ul className="list-disc pl-4 space-y-2">
            {(story.narrative[lang]?.takeaways || story.narrative.en.takeaways || []).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
        {activeSummaryTab === "dates" && (
          <ul className="list-disc pl-4 space-y-2">
            {story.timeline.map((event, i) => (
              <li key={i}><strong>{event.year}:</strong> {event.title[lang] || event.title.en}</li>
            ))}
          </ul>
        )}
        {activeSummaryTab === "places" && (
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Location Area:</strong> {story.title[lang] || story.title.en} primary site coordinates.</li>
            <li><strong>Referenced Nodes:</strong> Surrounding geological terrain and museum archives.</li>
          </ul>
        )}
        {activeSummaryTab === "people" && (
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Discoverers:</strong> Mentioned in initial archaeological timelines.</li>
            <li><strong>Scientists:</strong> Forensics teams and carbon dating physicists.</li>
          </ul>
        )}
        {activeSummaryTab === "30s" && (
          <p className="italic">
            {story.synopsis[lang] || story.synopsis.en}
          </p>
        )}
        {activeSummaryTab === "2m" && (
          <p>
            {story.narrative[lang]?.intro?.[0]} {story.narrative[lang]?.evidence?.[0] || story.narrative.en.evidence?.[0] || ""} {story.narrative[lang]?.conclusion?.[0] || story.narrative.en.conclusion?.[0] || ""}
          </p>
        )}
      </div>
    </div>
  );
}
