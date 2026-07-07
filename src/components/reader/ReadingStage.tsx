"use client";

import React, { useRef, useEffect } from "react";
import { Bookmark, Sparkles, Send, Check, AlertCircle } from "lucide-react";
import { StoryDetail, BookmarkData } from "../../types";
import { gsap } from "gsap";

interface ReadingStageProps {
  story: StoryDetail;
  lang: "en" | "hi" | "mr";
  paragraphs: string[];
  allSentences: string[];
  currentSentenceIdx: number;
  speakSentenceAtIdx: (idx: number) => void;
  activeNoteInput: number | null;
  setActiveNoteInput: (idx: number | null) => void;
  noteText: string;
  setNoteText: (val: string) => void;
  saveNoteForSentence: (idx: number) => void;
  fontSize: number;
  lineHeight: number;
  theme: string;
  bookmarks: BookmarkData;
  toggleSentenceHighlight: (idx: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  playClickSound: () => void;
  currentChapter: number;
  onNextChapter: () => void;
  onPrevChapter: () => void;
}

export default function ReadingStage({
  story,
  lang,
  paragraphs,
  allSentences,
  currentSentenceIdx,
  speakSentenceAtIdx,
  activeNoteInput,
  setActiveNoteInput,
  noteText,
  setNoteText,
  saveNoteForSentence,
  fontSize,
  lineHeight,
  theme,
  bookmarks,
  toggleSentenceHighlight,
  containerRef,
  handleScroll,
  playClickSound,
  currentChapter,
  onNextChapter,
  onPrevChapter
}: ReadingStageProps) {
  const expandedEventRef = useRef<number | null>(null);
  const [expandedEvent, setExpandedEvent] = React.useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Clear active animation states
      gsap.killTweensOf(contentRef.current);
      
      // Page Flip Entrance animation: Rotate, Scale, Blur, Fade
      gsap.set(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        filter: "blur(8px)",
        transformPerspective: 1200,
        rotationY: 12,
        transformOrigin: "left center"
      });

      gsap.to(contentRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        rotationY: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [currentChapter]);

  const getThemeClasses = (): string => {
    switch (theme) {
      case "amoled":
        return "bg-black text-zinc-100";
      case "paper":
        return "bg-[#faf6ee] text-[#1c1b19] border-zinc-200";
      case "sepia":
        return "bg-[#f4ecd8] text-[#433422] border-amber-900/10";
      case "contrast":
        return "bg-black text-yellow-400";
      default:
        return "bg-[#050505] text-zinc-300";
    }
  };

  const getHighlightStyle = (idx: number): string => {
    const isCurrent = currentSentenceIdx === idx;
    const storyHighlights = bookmarks.highlights[story.id] || [];
    const isHighlighted = storyHighlights.includes(idx);

    if (isCurrent) {
      return theme === "contrast" 
        ? "bg-yellow-400 text-black px-1 rounded font-semibold scale-100"
        : "bg-blue-600/30 text-white border-l-2 border-[#0088ff] pl-1 font-medium";
    }
    if (isHighlighted) {
      return "bg-[#e5c158]/20 border-b border-[#e5c158]/50 cursor-pointer";
    }
    return "hover:bg-white/5 transition-colors cursor-pointer";
  };

  // Re-build paragraphs mapping from global flat sentences array
  let sentenceCounter = 0;

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className={`absolute inset-0 overflow-y-auto px-6 py-24 md:py-28 select-text scroll-smooth ${getThemeClasses()}`}
    >
      <div ref={contentRef} className="max-w-2xl mx-auto space-y-8 pb-32">
        {/* Story details header */}
        {(() => {
          const CHAPTER_TITLES = [
            { en: "Introduction", hi: "प्रस्तावना", mr: "प्रस्तावना" },
            { en: "Background", hi: "पृष्ठभूमि", mr: "पार्श्वभूमी" },
            { en: "Historical Timeline", hi: "ऐतिहासिक समयरेखा", mr: "कालक्रमानुसार" },
            { en: "Main Events", hi: "मुख्य घटनाएं", mr: "मुख्य घटना" },
            { en: "Scientific Analysis", hi: "वैज्ञानिक विश्लेषण", mr: "वैज्ञानिक विश्लेषण" },
            { en: "Evidence", hi: "पुरावा और साक्ष्य", mr: "पुरावे" },
            { en: "Current Status", hi: "वर्तमान स्थिति", mr: "सद्यस्थिती" },
            { en: "Conclusion", hi: "निष्कर्ष", mr: "निष्कर्ष" },
            { en: "Interesting Facts", hi: "रोचक तथ्य", mr: "मनोरंजक तथ्य" },
            { en: "References", hi: "संदर्भ और स्रोत", mr: "संदर्भ आणि स्रोत" }
          ];
          const currentTitle = CHAPTER_TITLES[currentChapter]
            ? (CHAPTER_TITLES[currentChapter][lang] || CHAPTER_TITLES[currentChapter].en)
            : "";
          return (
            <div className="space-y-3 text-left border-b border-white/5 pb-6 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase text-[#e5c158] font-bold tracking-[0.2em]">{story.category}</span>
                <span className="text-[9px] uppercase text-zinc-500 font-mono tracking-wider font-bold">Chapter {currentChapter + 1} of 10</span>
              </div>
              <h2 className="text-3xl font-light tracking-wide text-white animate-fade-in" style={{ fontFamily: "Cinzel, serif" }}>
                {story.title[lang] || story.title.en}
              </h2>
              <p className="text-xs text-zinc-400 font-light italic">
                {currentTitle} — {story.subtitle[lang] || story.subtitle.en}
              </p>
            </div>
          );
        })()}

        {/* Dynamic sentences paragraphs */}
        <div 
          className="text-left font-light leading-relaxed font-sans space-y-6"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          {paragraphs.map((p, pIdx) => {
            const matches = p.match(/[^.!?।]+[.!?।]+(\s|$)/g) || [p];
            return (
              <p key={pIdx} className="indent-4">
                {matches.map((sText) => {
                  const currentIdx = sentenceCounter++;
                  const noteContent = bookmarks.notes[story.id]?.[currentIdx];
                  const highlights = bookmarks.highlights[story.id] || [];
                  const isHighlighted = highlights.includes(currentIdx);

                  return (
                    <span key={currentIdx} className="relative inline">
                      <span
                        id={`sentence-${currentIdx}`}
                        onClick={() => {
                          speakSentenceAtIdx(currentIdx);
                        }}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          toggleSentenceHighlight(currentIdx);
                        }}
                        className={`inline transition-all duration-200 mx-0.5 ${getHighlightStyle(currentIdx)}`}
                        title="Double-click to highlight & annotate"
                      >
                        {sText.trim()}{" "}
                      </span>

                      {/* Notes floating bubble indicator */}
                      {noteContent && (
                        <span 
                          onClick={() => { setActiveNoteInput(currentIdx); playClickSound(); }}
                          className="bg-[#e5c158] text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded-full inline-block cursor-pointer mx-1 select-none animate-pulse"
                          title={`Note: "${noteContent}"`}
                        >
                          ✎
                        </span>
                      )}

                      {/* Sentence specific dynamic overlay popup editor */}
                      {activeNoteInput === currentIdx && (
                        <div className="absolute top-8 left-0 z-50 bg-[#0c0d14] border border-white/10 p-4 rounded-xl shadow-2xl w-72 flex flex-col gap-3 scale-up-entry font-sans text-xs">
                          <div className="flex justify-between items-center text-zinc-500 pb-1 border-b border-white/5">
                            <span className="text-[9px] uppercase font-bold text-blue-400">Research Note Entry</span>
                            <button onClick={() => { setActiveNoteInput(null); setNoteText(""); }} className="hover:text-white cursor-pointer">✕</button>
                          </div>
                          <textarea
                            placeholder="Type a research note or observation..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#e5c158]/50 h-20 font-light leading-normal resize-none"
                            autoFocus
                          />
                          <div className="flex justify-between gap-2.5">
                            <button
                              onClick={() => {
                                toggleSentenceHighlight(currentIdx);
                                setActiveNoteInput(null);
                              }}
                              className="text-red-400 hover:text-red-300 font-medium px-2 py-1 text-[10px] cursor-pointer"
                            >
                              {isHighlighted ? "Remove Highlight" : "Discard"}
                            </button>
                            <button
                              onClick={() => saveNoteForSentence(currentIdx)}
                              className="bg-[#0088ff] text-white font-semibold tracking-wider text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Send size={9} /> Save
                            </button>
                          </div>
                        </div>
                      )}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>

        {/* Chronological Archive Timeline - Rendered only on Chapter 3 */}
        {currentChapter === 2 && story.timeline && story.timeline.length > 0 && (
          <div className="mt-16 space-y-6 pt-12 border-t border-white/5 text-left max-w-2xl mx-auto font-sans">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#e5c158]">Chronological Archive Timeline</h3>
            <div className="relative border-l border-white/10 pl-6 space-y-8 my-4">
              {story.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-[#0088ff] border border-[#050505] group-hover:scale-125 transition-transform" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#0088ff] font-bold block">{event.year}</span>
                    <h4 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors">{event.title[lang] || event.title.en}</h4>
                    <p className="text-[11px] text-zinc-400 leading-normal font-light">{event.details[lang] || event.details.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Navigation Controls */}
        <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-16 max-w-2xl mx-auto font-sans select-none pb-8">
          <button
            disabled={currentChapter === 0}
            onClick={() => { playClickSound(); onPrevChapter(); }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all hover:bg-white/10"
          >
            ← {lang === "hi" ? "पिछला अध्याय" : lang === "mr" ? "मागील प्रकरण" : "Prev Chapter"}
          </button>
          
          <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">
            {lang === "hi" ? `अध्याय ${currentChapter + 1} / 10` : lang === "mr" ? `प्रकरण ${currentChapter + 1} / १०` : `Chapter ${currentChapter + 1} of 10`}
          </span>

          <button
            onClick={() => { playClickSound(); onNextChapter(); }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#e5c158] text-[#050505] hover:bg-[#f6d270] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all font-bold shadow-lg"
          >
            {currentChapter === 9 
              ? (lang === "hi" ? "पूर्ण करें" : lang === "mr" ? "पूर्ण करा" : "Finish")
              : (lang === "hi" ? "अगला अध्याय →" : lang === "mr" ? "पुढील प्रकरण →" : "Next Chapter →")}
          </button>
        </div>
      </div>
    </div>
  );
}
