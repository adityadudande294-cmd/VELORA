"use client";

import React, { useState, useEffect } from "react";
import { StoryDetail } from "../types";
import { useSettings } from "../contexts/SettingsContext";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useAmbientAudio } from "../hooks/useAmbientAudio";
import { useSpeechNarration } from "../hooks/useSpeechNarration";
import { useScrollTracking } from "../hooks/useScrollTracking";
import { generateStoryText, getChapterText, answerStoryQuestion, getRecommendations } from "../utils/storyEngine";
import { apiClient } from "../services/apiClient";
import ReaderHeader from "./reader/ReaderHeader";
import CoverStage from "./reader/CoverStage";
import ReadingStage from "./reader/ReadingStage";
import CompletedStage from "./reader/CompletedStage";
import AISummaryPanel from "./reader/AISummaryPanel";
import AIChatPanel from "./reader/AIChatPanel";
import ReaderSettingsModal from "./reader/ReaderSettingsModal";

interface StoryReaderProps {
  story: StoryDetail;
  onBack: () => void;
}

export default function StoryReader({ story, onBack }: StoryReaderProps) {
  const { userSettings, updateSettings } = useSettings();
  const { bookmarks, updateBookmarks } = useBookmarks();
  const lang = userSettings.lang;

  // Reading phase stage: "loading" | "cover" | "reading" | "completed"
  const [readStage, setReadStage] = useState<"loading" | "cover" | "reading" | "completed">("loading");

  // Format preferences
  const [theme, setTheme] = useState<string>("dark");
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [explanationMode, setExplanationMode] = useState<"normal" | "summary" | "timeline">("normal");
  const [showSettings, setShowSettings] = useState(false);
  const [activeNoteInput, setActiveNoteInput] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  // Chapter Pagination state (0 to 9)
  const [currentChapter, setCurrentChapter] = useState(0);

  // Sound track settings hook
  const {
    ambientTheme,
    setAmbientTheme,
    isMuted,
    setIsMuted,
    volume,
    setVolume,
    playClickSound,
    playPageFlipSound
  } = useAmbientAudio();

  // Summary and Chat toggles
  const [showAISummary, setShowAISummary] = useState(false);
  const [activeSummaryTab, setActiveSummaryTab] = useState<"takeaways" | "dates" | "places" | "people" | "30s" | "2m">("takeaways");
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);

  // Dynamically load story paragraphs for the current chapter
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  
  // Load saved reading chapter progress on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem(`velora_progress_${story.id}`);
      if (savedProgress) {
        setCurrentChapter(Number(savedProgress));
      }
    }
  }, [story.id]);

  useEffect(() => {
    const loadText = async () => {
      const chParagraphs = getChapterText(story, currentChapter, lang, explanationMode);
      setParagraphs(chParagraphs);
    };
    loadText();
    
    // Auto save reading progress
    if (typeof window !== "undefined") {
      localStorage.setItem(`velora_progress_${story.id}`, String(currentChapter));
    }
  }, [story.id, lang, explanationMode, currentChapter]);

  const allSentences = paragraphs.flatMap((p) => {
    return p.match(/[^.!?।]+[.!?।]+(\s|$)/g) || [p];
  }).map(s => s.trim());

  // Setup Chat responses
  useEffect(() => {
    const greetingText = {
      en: `Greetings, traveler. I am the VELORA Knowledge Archive. You may ask me any questions about the ${story.title.en} story, its findings, or scientific evidence.`,
      hi: `प्रणाम, पाठक। मैं वेलोरा ज्ञान संग्रह हूँ। आप मुझसे ${story.title.hi || story.title.en} कहानी, इसके पुरातात्विक निष्कर्षों, या वैज्ञानिक प्रमाणों के बारे में कोई भी प्रश्न पूछ सकते हैं।`,
      mr: `नमस्कार, वाचक. मी वेलोरा ज्ञान संग्रह आहे. आपण मला ${story.title.mr || story.title.en} च्या इतिहासाबद्दल किंवा पुराव्यांबद्दल कोणताही प्रश्न विचारू शकता.`
    };
    setChatMessages([
      { sender: "ai", text: greetingText[lang] || greetingText.en }
    ]);
  }, [story.id, lang]);

  // Initial cinematic transition delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setReadStage("cover");
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Scroll and completed stages triggers
  const handleReachEnd = () => {
    // End stage only triggered if user finishes final chapter
    if (currentChapter === 9) {
      setReadStage("completed");
      updateSettings({ streak: (userSettings.streak || 1) + 1 });
      apiClient.saveProgress(story.id, true).catch(() => {});
    }
  };

  const { readingProgress, containerRef, handleScroll } = useScrollTracking({
    onReachEnd: handleReachEnd,
    active: readStage === "reading"
  });

  const handleNextChapter = () => {
    playPageFlipSound();
    stopNarrator();
    if (currentChapter < 9) {
      setCurrentChapter(prev => prev + 1);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    } else {
      setReadStage("completed");
      updateSettings({ streak: (userSettings.streak || 1) + 1 });
      apiClient.saveProgress(story.id, true).catch(() => {});
    }
  };

  const handlePrevChapter = () => {
    playPageFlipSound();
    stopNarrator();
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  };


  // TTS Narrator bindings
  const {
    isPlayingTTS,
    currentSentenceIdx,
    selectedVoice,
    setSelectedVoice,
    voices,
    speakSentenceAtIdx,
    startNarratorSpeaking,
    stopNarrator,
    handleSkipSentence
  } = useSpeechNarration({
    sentences: allSentences,
    lang,
    speed: userSettings.speed || 0.85,
    onPlaybackEnd: handleReachEnd
  });

  const toggleSentenceHighlight = (idx: number) => {
    playClickSound();
    updateBookmarks(prev => {
      const highlights = { ...prev.highlights };
      const list = highlights[story.id] || [];
      const index = list.indexOf(idx);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(idx);
        setActiveNoteInput(idx);
      }
      highlights[story.id] = list;
      return { ...prev, highlights };
    });
  };

  const saveNoteForSentence = (idx: number) => {
    playClickSound();
    updateBookmarks(prev => {
      const notes = { ...prev.notes };
      const storyNotes = notes[story.id] || {};
      if (noteText.trim()) {
        storyNotes[idx] = noteText.trim();
      } else {
        delete storyNotes[idx];
      }
      notes[story.id] = storyNotes;
      return { ...prev, notes };
    });
    setActiveNoteInput(null);
    setNoteText("");
  };

  const handleAskAIQuery = async () => {
    if (!chatInput.trim()) return;
    playClickSound();
    const query = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: query }]);
    setChatInput("");

    try {
      const ans = await answerStoryQuestion(story, query, lang);
      setChatMessages(prev => [...prev, { sender: "ai", text: ans }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { sender: "ai", text: "Error loading AI response." }]);
    }
  };

  if (readStage === "loading") {
    return (
      <div className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-2 border-[#e5c158]/30 border-t-[#e5c158] rounded-full animate-spin" />
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 animate-pulse">Syncing Knowledge archives...</span>
      </div>
    );
  }

  const handleSelectStory = (rec: StoryDetail) => {
    window.location.reload();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] text-zinc-100 flex flex-col selection:bg-[#e5c158]/30 selection:text-white pb-16">
      
      {readStage === "cover" && (
        <CoverStage
          story={story}
          lang={lang}
          onBegin={() => { playClickSound(); setReadStage("reading"); }}
        />
      )}

      {readStage === "reading" && (
        <>
          <ReaderHeader
            onBack={() => { stopNarrator(); onBack(); }}
            title={story.title[lang] || story.title.en}
            readingProgress={readingProgress}
            isPlayingTTS={isPlayingTTS}
            onStartTTS={() => { if (isPlayingTTS) stopNarrator(); else startNarratorSpeaking(); }}
            onStopTTS={stopNarrator}
            onSkipTTS={handleSkipSentence}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            voices={voices}
          />

          <main className="flex-1 relative overflow-hidden flex flex-col">
            <ReadingStage
              story={story}
              lang={lang}
              paragraphs={paragraphs}
              allSentences={allSentences}
              currentSentenceIdx={currentSentenceIdx}
              speakSentenceAtIdx={speakSentenceAtIdx}
              activeNoteInput={activeNoteInput}
              setActiveNoteInput={setActiveNoteInput}
              noteText={noteText}
              setNoteText={setNoteText}
              saveNoteForSentence={saveNoteForSentence}
              fontSize={fontSize}
              lineHeight={lineHeight}
              theme={theme}
              bookmarks={bookmarks}
              toggleSentenceHighlight={toggleSentenceHighlight}
              containerRef={containerRef}
              handleScroll={handleScroll}
              playClickSound={playClickSound}
              currentChapter={currentChapter}
              onNextChapter={handleNextChapter}
              onPrevChapter={handlePrevChapter}
            />

            {/* Bottom utility panels */}
            <div className="absolute bottom-16 inset-x-0 z-40 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto w-full max-w-2xl mx-auto rounded-t-3xl">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => { setShowAISummary(!showAISummary); if (showAIChat) setShowAIChat(false); playClickSound(); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    showAISummary ? "bg-[#e5c158] text-[#050505]" : "bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
                  }`}
                >
                  AI Story Summary
                </button>
                <button
                  onClick={() => { setShowAIChat(!showAIChat); if (showAISummary) setShowAISummary(false); playClickSound(); }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    showAIChat ? "bg-[#0088ff] text-white" : "bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
                  }`}
                >
                  Ask AI Assistant
                </button>
              </div>

              {showAISummary && (
                <AISummaryPanel
                  story={story}
                  lang={lang}
                  activeSummaryTab={activeSummaryTab}
                  setActiveSummaryTab={setActiveSummaryTab}
                  playClickSound={playClickSound}
                />
              )}

              {showAIChat && (
                <AIChatPanel
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleAskAIQuery={handleAskAIQuery}
                />
              )}
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-black/60 border-t border-white/5 py-2.5 px-6 flex items-center justify-between text-xs text-zinc-500 z-20 shadow-2xl backdrop-blur-md font-sans select-none">
            <span>Chapter {currentChapter + 1} of 10</span>
            <div className="flex items-center gap-4">
              <span>{Math.round(Number(story.duration.replace(" mins", "")) * (1 - (currentChapter / 9)))} mins remaining</span>
              <div className="w-24 bg-white/10 rounded-full h-1 relative overflow-hidden">
                <div className="bg-[#e5c158] h-1 rounded-full animate-pulse" style={{ width: `${(currentChapter / 9) * 100}%` }} />
              </div>
              <span>{Math.round((currentChapter / 9) * 100)}% read</span>
            </div>
          </footer>

          <ReaderSettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            explanationMode={explanationMode}
            setExplanationMode={setExplanationMode}
          />
        </>
      )}

      {readStage === "completed" && (
        <CompletedStage
          story={story}
          recommendations={getRecommendations(story.id, userSettings.history)}
          onBack={() => { stopNarrator(); onBack(); }}
          onSelectStory={handleSelectStory}
          playClickSound={playClickSound}
        />
      )}
    </div>
  );
}
