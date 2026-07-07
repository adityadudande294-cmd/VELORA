"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft, Settings, 
  BookOpen, Sparkles, Send, Check, Bookmark, Share2, HelpCircle, 
  Clock, ArrowRight, Award, Compass, Moon, Sun, AlignJustify, 
  Minimize2, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Heart, HelpCircle as QuestionIcon, X
} from "lucide-react";
import { 
  getStoryDetail, 
  generateStoryText, 
  answerStoryQuestion, 
  getRecommendations,
  StoryDetail 
} from "../utils/storyEngine";
import { UserSettings, BookmarkData } from "../app/page";
import { apiClient } from "../services/apiClient";

interface StoryReaderProps {
  story: StoryDetail;
  onBack: () => void;
  userSettings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  bookmarks: BookmarkData;
  updateBookmarks: (updater: (prev: BookmarkData) => BookmarkData) => void;
}

type ReaderTheme = "dark" | "amoled" | "paper" | "sepia" | "contrast";
type ExplanationMode = "normal" | "eli10" | "simple" | "detailed" | "academic" | "revision";

export default function StoryReader({ 
  story, 
  onBack, 
  userSettings, 
  updateSettings, 
  bookmarks, 
  updateBookmarks 
}: StoryReaderProps) {
  // Reading Phase Stage: "loading" | "cover" | "reading" | "completed"
  const [readStage, setReadStage] = useState<"loading" | "cover" | "reading" | "completed">("loading");
  
  // Custom Settings States
  const [theme, setTheme] = useState<ReaderTheme>("dark");
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>("normal");
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [showSettings, setShowSettings] = useState(false);
  const [activeNoteInput, setActiveNoteInput] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  // AI Narrator States
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Timeline state
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // AI Summary Tab State
  const [activeSummaryTab, setActiveSummaryTab] = useState<"takeaways" | "dates" | "places" | "people" | "30s" | "2m">("takeaways");
  const [showAISummary, setShowAISummary] = useState(false);

  // Ask AI Chat Panel States
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);

  // Audio Ambient soundtrack refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const backgroundPadRef = useRef<any[]>([]);
  const currentSpeechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Progress tracking
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const lang = userSettings.lang;
  const isBookmarked = bookmarks.bookmarkedIds.includes(story.id);

  // Dynamically load story paragraphs based on lang and explanation mode
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  
  useEffect(() => {
    const loadText = async () => {
      if (explanationMode === "normal") {
        setParagraphs(generateStoryText(story, lang, "normal"));
      } else {
        try {
          const expText = await apiClient.explainAI(story.id, explanationMode, lang);
          setParagraphs(expText.split("\n\n").filter(p => p.trim()));
        } catch (e) {
          setParagraphs(generateStoryText(story, lang, explanationMode));
        }
      }
    };
    loadText();
  }, [story.id, lang, explanationMode]);
  
  // Split paragraphs into individual sentences for highlighting
  const allSentences = paragraphs.flatMap((p) => {
    // Split sentences but keep the delimiters
    return p.match(/[^.!?।]+[.!?।]+(\s|$)/g) || [p];
  }).map(s => s.trim());

  // Reset Chat Messages when story or language changes
  useEffect(() => {
    const greetingText = {
      en: `Greetings, traveler. I am the VELORA Knowledge Archive. You may ask me any questions about the ${story.title.en} story, its archaeological findings, or scientific evidence.`,
      hi: `प्रणाम, पाठक। मैं वेलोरा ज्ञान संग्रह हूँ। आप मुझसे ${story.title.hi || story.title.en} कहानी, इसके पुरातात्विक निष्कर्षों, या वैज्ञानिक प्रमाणों के बारे में कोई भी प्रश्न पूछ सकते हैं।`,
      mr: `नमस्कार, वाचक. मी वेलोरा ज्ञान संग्रह आहे. आपण मला ${story.title.mr || story.title.en} च्या इतिहासाबद्दल किंवा पुराव्यांबद्दल कोणताही प्रश्न विचारू शकता.`
    };
    setChatMessages([
      { sender: "ai", text: greetingText[lang] || greetingText.en }
    ]);
  }, [story.id, lang]);

  // 1. STORY INITIAL TRANSITION TIMER (2.2s)
  useEffect(() => {
    initTransitionAudio();

    const timer = setTimeout(() => {
      setReadStage("cover");
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // 2. BACKGROUND AMBIENT SOUNDTRACK
  useEffect(() => {
    if (readStage === "reading" || readStage === "cover") {
      startCategoryAmbient();
    }
    return () => {
      cleanupAmbient();
    };
  }, [readStage]);

  // Handle ambient volume adjustments
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(userSettings.speed * 0.15, audioContextRef.current.currentTime + 0.1);
    }
  }, [userSettings.speed]);

  // Handle voices loading and dynamic language matching
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        setVoices(list);
        
        // Match voice to current settings language (en, hi, mr)
        const bestVoice = list.find(v => 
          v.lang.startsWith(lang) && 
          (v.name.toLowerCase().includes("natural") || 
           v.name.toLowerCase().includes("google") || 
           v.name.toLowerCase().includes("premium"))
        ) || list.find(v => v.lang.startsWith(lang)) || list.find(v => v.lang.startsWith("en"));
        
        if (bestVoice) {
          setSelectedVoice(bestVoice.name);
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [lang]);

  // Update read progress percentage as user scrolls
  const handleScrollProgress = () => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const totalHeight = element.scrollHeight - element.clientHeight;
    if (totalHeight <= 0) return;
    const scrolled = (element.scrollTop / totalHeight) * 100;
    setReadingProgress(Math.min(Math.round(scrolled), 100));

    // If reached bottom, complete the story
    if (scrolled > 97 && readStage === "reading") {
      setTimeout(() => {
        setReadStage("completed");
        playCompletionSound();
        if (apiClient.isOnline && apiClient.user) {
          apiClient.saveProgress(story.id, true).catch(() => {});
        }
      }, 500);
    }
  };

  // Transition Sound
  const initTransitionAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 1.8);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch(e) {}
  };

  // Play ambient music
  const startCategoryAmbient = () => {
    try {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.08, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Resonant pads based on category
      const playOscNode = (freq: number, type: OscillatorType = "sine", vol = 0.25) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.value = freq;
        filter.type = "lowpass";
        filter.frequency.value = 200;
        gainNode.gain.setValueAtTime(vol, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(master);

        osc.start();
        backgroundPadRef.current.push(osc);
      };

      if (story.category === "Space & Science") {
        playOscNode(65.41, "triangle", 0.5); // C2
        playOscNode(98.00, "sine", 0.45); // G2
      } else {
        // Mysterious/Historical D minor
        playOscNode(73.42, "triangle", 0.6);  // D2
        playOscNode(110.00, "sine", 0.4);     // A2
        playOscNode(146.83, "sine", 0.3);     // D3
      }
    } catch(e) {}
  };

  const cleanupAmbient = () => {
    backgroundPadRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    backgroundPadRef.current = [];
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch(e) {}
      audioContextRef.current = null;
    }
  };

  const playClickSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  };

  const playCompletionSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const chimes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      
      chimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 2.0);
      });
    } catch(e) {}
  };

  // --- NARRATOR AI VOICE CONTROLLER ---
  const startNarratorSpeaking = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingTTS) {
      window.speechSynthesis.pause();
      setIsPlayingTTS(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlayingTTS(true);
      return;
    }

    const startIdx = currentSentenceIdx === -1 ? 0 : currentSentenceIdx;
    speakSentenceAtIdx(startIdx);
  };

  const speakSentenceAtIdx = (idx: number) => {
    if (!window.speechSynthesis || idx >= allSentences.length) {
      setIsPlayingTTS(false);
      setCurrentSentenceIdx(-1);
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentSentenceIdx(idx);
    setIsPlayingTTS(true);

    const txt = allSentences[idx];
    const utterance = new SpeechSynthesisUtterance(txt);
    currentSpeechUtteranceRef.current = utterance;

    const activeVoice = voices.find(v => v.name === selectedVoice);
    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    utterance.pitch = 0.95;
    utterance.rate = userSettings.speed;
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (isPlayingTTS) {
        const nextIdx = idx + 1;
        if (nextIdx < allSentences.length) {
          const targetEl = document.getElementById(`sentence-${nextIdx}`);
          if (targetEl && contentRef.current) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          speakSentenceAtIdx(nextIdx);
        } else {
          setIsPlayingTTS(false);
          setCurrentSentenceIdx(-1);
        }
      }
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis error:", e);
      setIsPlayingTTS(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopNarrator = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      setCurrentSentenceIdx(-1);
    }
  };

  const handleSkipSentence = (direction: "prev" | "next") => {
    if (direction === "prev") {
      const prevIdx = Math.max(0, currentSentenceIdx - 1);
      speakSentenceAtIdx(prevIdx);
    } else {
      const nextIdx = Math.min(allSentences.length - 1, currentSentenceIdx + 1);
      speakSentenceAtIdx(nextIdx);
    }
  };

  // --- ASK AI Assistant ---
  const handleAskAIQuery = async () => {
    if (chatInput.trim() === "") return;
    playClickSound();

    const userQuery = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userQuery }]);
    setChatInput("");

    try {
      const answer = await apiClient.askAI(story.id, userQuery, lang);
      setChatMessages(prev => [...prev, { sender: "ai", text: answer }]);
    } catch (e) {
      const answer = answerStoryQuestion(story, userQuery, lang);
      setChatMessages(prev => [...prev, { sender: "ai", text: answer }]);
    }
  };

  // Font adjustments
  const handleFontAdjustment = (type: "inc" | "dec") => {
    playClickSound();
    setFontSize(prev => {
      if (type === "inc") return Math.min(prev + 2, 28);
      return Math.max(prev - 2, 14);
    });
  };

  const handleLineHeightAdjustment = (type: "inc" | "dec") => {
    playClickSound();
    setLineHeight(prev => {
      if (type === "inc") return Math.min(prev + 0.2, 2.2);
      return Math.max(prev - 0.2, 1.4);
    });
  };

  // Bookmark toggler
  const toggleBookmark = () => {
    playClickSound();
    updateBookmarks(prev => {
      const isCurrentlyBookmarked = prev.bookmarkedIds.includes(story.id);
      const bookmarkedIds = isCurrentlyBookmarked
        ? prev.bookmarkedIds.filter(id => id !== story.id)
        : [...prev.bookmarkedIds, story.id];
      return { ...prev, bookmarkedIds };
    });
  };

  // Text Highlighting Helper
  const toggleSentenceHighlight = (idx: number) => {
    playClickSound();
    updateBookmarks(prev => {
      const storyHighlights = prev.highlights[story.id] || [];
      const updatedHighlights = storyHighlights.includes(idx)
        ? storyHighlights.filter(i => i !== idx)
        : [...storyHighlights, idx];
      return {
        ...prev,
        highlights: {
          ...prev.highlights,
          [story.id]: updatedHighlights
        }
      };
    });
    // Open note input on highlight
    setActiveNoteInput(idx);
  };

  // Save personal notes
  const saveNoteForSentence = (idx: number) => {
    playClickSound();
    if (noteText.trim()) {
      updateBookmarks(prev => {
        const storyNotes = prev.notes[story.id] || {};
        return {
          ...prev,
          notes: {
            ...prev.notes,
            [story.id]: {
              ...storyNotes,
              [idx]: noteText
            }
          }
        };
      });
    }
    setActiveNoteInput(null);
    setNoteText("");
  };

  const getThemeClasses = (): string => {
    switch (theme) {
      case "amoled":
        return "bg-black text-[#f4f4f5]";
      case "paper":
        return "bg-[#fcf8ef] text-[#2b2b2b]";
      case "sepia":
        return "bg-[#f5ebd6] text-[#3c2f1f]";
      case "contrast":
        return "bg-black text-white border-2 border-white";
      case "dark":
      default:
        return "bg-[#050508] text-[#e4e4e7]";
    }
  };

  const storyHighlights = bookmarks.highlights[story.id] || [];
  const storyNotes = bookmarks.notes[story.id] || [];

  return (
    <div className={`relative w-full h-screen overflow-hidden ${getThemeClasses()} flex flex-col z-50 transition-colors duration-500`}>

      {/* STAGE 1: CINEMATIC OPENING RETRIEVAL OVERLAY */}
      {readStage === "loading" && (
        <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="space-y-6 max-w-sm scale-up-entry">
            <div className="w-12 h-12 rounded-full border-t-2 border-[#e5c158] border-r border-white/5 animate-spin mx-auto shadow-[0_0_15px_rgba(229,193,88,0.25)]" />
            <div className="space-y-2.5 pt-4 font-light tracking-[0.25em] text-sm text-[#e5c158]">
              <p className="animate-pulse">Opening Story Engine...</p>
              <p className="text-[10px] text-zinc-500 delay-500 animate-pulse">Analyzing Sources & Timelines...</p>
              <p className="text-[9px] text-zinc-600 delay-1000 animate-pulse">Synthesizing Narrative Structure...</p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: KEN BURNS COVER REVEAL */}
      {readStage === "cover" && (
        <div className="absolute inset-0 z-40 bg-black flex flex-col justify-end p-8 md:p-16 select-none overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={story.image || "/images/roopkund.png"}
              alt={story.title.en}
              fill
              priority
              className="object-cover scale-105 brightness-[0.3] animate-ken-burns"
              style={{
                animation: "kenburns 8s ease-in-out forwards",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6 scale-up-entry text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#e5c158]/10 border border-[#e5c158]/30 text-[#e5c158] text-[10px] tracking-[0.2em] px-3.5 py-1 rounded-full font-bold uppercase">
                {story.category}
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock size={11} /> {story.duration} read
              </span>
              <span className="text-[11px] text-zinc-400">
                Difficulty: {story.difficulty}
              </span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-wide leading-tight"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {story.title[lang] || story.title.en}
            </h1>

            <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed max-w-2xl">
              {story.synopsis[lang] || story.synopsis.en}
            </p>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl max-w-md text-xs font-light text-zinc-400 backdrop-blur-md">
              <span className="text-[#e5c158] font-bold block mb-1">FACT CHECK STATUS</span>
              {story.factLabel} • {story.factStatus}
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={() => { setReadStage("reading"); playClickSound(); }}
                className="bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black font-semibold text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-full hover:shadow-[0_0_20px_rgba(229,193,88,0.3)] transition-all active:scale-95 flex items-center gap-2"
              >
                Begin Reading <ArrowRight size={14} />
              </button>
              <button
                onClick={onBack}
                className="bg-white/5 border border-white/10 text-white text-xs tracking-wider px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: INTERACTIVE READER */}
      {readStage === "reading" && (
        <>
          {/* TOP BAR LAYOUT CONTROLS */}
          <header className={`sticky top-0 z-30 px-6 py-3.5 border-b flex items-center justify-between transition-colors shadow-md ${
            theme === "paper" ? "bg-[#fcf8ef] border-zinc-200 text-black" :
            theme === "sepia" ? "bg-[#f5ebd6] border-[#e4d8c0] text-[#3c2f1f]" :
            theme === "amoled" ? "bg-black border-zinc-900 text-white" : "bg-[#050508] border-white/5 text-white"
          }`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { stopNarrator(); onBack(); }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-light text-zinc-500 uppercase tracking-widest leading-none">
                  Docu-Story
                </span>
                <span className="text-sm font-semibold tracking-wide leading-normal truncate max-w-[180px] sm:max-w-xs" style={{ 
                  fontFamily: "Cinzel, serif",
                }}>
                  {story.title[lang] || story.title.en}
                </span>
              </div>
            </div>

            {/* Controls HUD */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                title="Formatting Settings"
              >
                <Settings size={16} />
              </button>

              <button 
                onClick={toggleBookmark}
                className={`p-2 rounded-full hover:bg-white/5 transition-all ${isBookmarked ? "text-[#e5c158]" : "text-zinc-400 hover:text-white"}`}
                title="Bookmark Page"
              >
                <Bookmark size={16} className={isBookmarked ? "fill-[#e5c158]" : ""} />
              </button>
            </div>

            {/* Floating Settings Dropdown Panel */}
            {showSettings && (
              <div className="absolute top-14 right-6 w-72 bg-[#0c0d14] border border-white/10 p-5 rounded-2xl shadow-2xl z-40 backdrop-blur-2xl animate-fade-in text-left text-zinc-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Settings</span>
                  <button onClick={() => setShowSettings(false)}>
                    <X size={14} className="text-zinc-500 hover:text-white" />
                  </button>
                </div>
                
                {/* Language support */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Language</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: "en", name: "English" },
                      { code: "hi", name: "Hindi" },
                      { code: "mr", name: "Marathi" }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          updateSettings({ lang: l.code as any });
                          playClickSound();
                        }}
                        className={`text-[9px] uppercase font-semibold py-1.5 rounded-lg border text-center transition-all ${
                          lang === l.code 
                            ? "bg-[#e5c158] border-[#e5c158] text-[#050505]" 
                            : "bg-white/5 border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explanation style modes */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Explanation Style</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { mode: "normal", label: "Normal" },
                      { mode: "eli10", label: "Explain Like I'm 10" },
                      { mode: "simple", label: "Simple English" },
                      { mode: "detailed", label: "Detailed" },
                      { mode: "academic", label: "Academic" },
                      { mode: "revision", label: "Quick Revision" }
                    ].map((m) => (
                      <button
                        key={m.mode}
                        onClick={() => {
                          setExplanationMode(m.mode as any);
                          playClickSound();
                        }}
                        className={`text-[9px] uppercase font-semibold py-1.5 rounded-lg border text-center transition-all ${
                          explanationMode === m.mode
                            ? "bg-[#0088ff] border-[#0088ff] text-white" 
                            : "bg-white/5 border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Themes */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Themes</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["dark", "amoled", "paper", "sepia", "contrast"] as ReaderTheme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`text-[9px] uppercase font-semibold py-1.5 rounded-lg border text-center transition-all ${
                          theme === t 
                            ? "bg-[#e5c158] border-[#e5c158] text-[#050505]" 
                            : "bg-white/5 border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Adjust */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    <ZoomIn size={13} /> Size
                  </span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleFontAdjustment("dec")} className="p-1 rounded bg-white/5 border border-white/10 text-white/80"><ZoomOut size={12} /></button>
                    <span className="text-xs font-semibold text-white">{fontSize}px</span>
                    <button onClick={() => handleFontAdjustment("inc")} className="p-1 rounded bg-white/5 border border-white/10 text-white/80"><ZoomIn size={12} /></button>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* AUDIO NARRATOR HUD BAR */}
          <div className="bg-[#0b0c12] border-b border-white/5 py-3 px-6 flex flex-wrap items-center justify-between gap-4 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={startNarratorSpeaking}
                className="bg-[#0088ff] text-white p-2.5 rounded-full hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                title={isPlayingTTS ? "Pause Voice" : "Listen Story"}
              >
                {isPlayingTTS ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>
              {currentSentenceIdx !== -1 && (
                <button
                  onClick={stopNarrator}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Stop Narration"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              
              <div className="text-xs text-left">
                {currentSentenceIdx !== -1 ? (
                  <span className="font-light text-zinc-400">
                    Speaking Sentence <strong className="text-white">{currentSentenceIdx + 1}</strong> of {allSentences.length}
                  </span>
                ) : (
                  <span className="font-light text-zinc-500">
                    Premium Documentarian narration engine ready
                  </span>
                )}
              </div>
            </div>

            {/* Narrator settings speed & voice */}
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              {currentSentenceIdx !== -1 && (
                <div className="flex items-center gap-1.5 mr-2">
                  <button onClick={() => handleSkipSentence("prev")} className="p-1 hover:text-white">◀</button>
                  <button onClick={() => handleSkipSentence("next")} className="p-1 hover:text-white">▶</button>
                </div>
              )}
              
              <span className="hidden sm:inline font-light">Rate</span>
              <select
                value={userSettings.speed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateSettings({ speed: val });
                  if (isPlayingTTS) {
                    speakSentenceAtIdx(currentSentenceIdx);
                  }
                }}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 focus:outline-none"
              >
                <option value="0.75">0.75x</option>
                <option value="0.85">0.85x</option>
                <option value="1.0">1.0x</option>
                <option value="1.15">1.15x</option>
              </select>

              <span className="hidden md:inline font-light font-sans">Voice</span>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  if (isPlayingTTS) {
                    speakSentenceAtIdx(currentSentenceIdx);
                  }
                }}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 max-w-[120px] truncate focus:outline-none"
              >
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* MAIN READER BODY CONTAINER */}
          <div 
            ref={contentRef}
            onScroll={handleScrollProgress}
            className="flex-1 overflow-y-auto px-6 py-10 md:py-16 md:px-12 flex flex-col items-center"
          >
            <div className="w-full max-w-2xl space-y-12">
              
              {/* Cover Header */}
              <div className="text-center space-y-4">
                <span className="text-xs uppercase tracking-[0.25em] text-[#e5c158] font-bold">
                  {story.category} • Document Document
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-white" style={{ 
                  fontFamily: "Cinzel, serif" 
                }}>
                  {story.title[lang] || story.title.en}
                </h1>
                <p className="text-xs text-zinc-500 font-light">{story.subtitle[lang] || story.subtitle.en}</p>
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#e5c158]/50 to-transparent mx-auto pt-3" />
              </div>

              {/* RENDER NARRATIVE SECTIONS WITH CLICK HIGHLIGHTING & NOTES */}
              <article 
                className="space-y-8 font-light text-left leading-relaxed break-words"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: lineHeight,
                  fontFamily: theme === "paper" || theme === "sepia" ? "Georgia, serif" : "var(--font-inter)" 
                }}
              >
                {explanationMode !== "normal" ? (
                  // Simple text view for Summarized styles
                  <div className="space-y-4">
                    {paragraphs.map((p, idx) => (
                      <p key={idx} className="indent-8 text-zinc-300">{p}</p>
                    ))}
                  </div>
                ) : (
                  // Full structured template view for default normal story mode
                  <>
                    {/* Introduction */}
                    <div className="space-y-4">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#e5c158] font-bold block border-b border-white/5 pb-1">Introduction</span>
                      <p className="indent-8">
                        {allSentences.slice(0, 3).map((s, idx) => {
                          const absIdx = idx;
                          const isSpeaking = absIdx === currentSentenceIdx;
                          const isHighlighted = storyHighlights.includes(absIdx);
                          const hasNote = !!storyNotes[absIdx];
                          return (
                            <span
                              key={absIdx}
                              id={`sentence-${absIdx}`}
                              onClick={() => toggleSentenceHighlight(absIdx)}
                              className={`transition-all duration-300 rounded cursor-pointer ${
                                isSpeaking 
                                  ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-0088ff/40" 
                                  : isHighlighted 
                                  ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                                  : "hover:bg-white/5"
                              } ${hasNote ? "border-dotted border-b border-amber-500" : ""}`}
                              title={hasNote ? `Note: ${storyNotes[absIdx]}` : "Click to highlight / add notes"}
                            >
                              {s}{" "}
                            </span>
                          );
                        })}
                      </p>
                    </div>

                    {/* Historical Background */}
                    <div className="space-y-4 pt-4">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#e5c158] font-bold block border-b border-white/5 pb-1">Historical Background</span>
                      <p>
                        {allSentences.slice(3, 7).map((s, idx) => {
                          const absIdx = idx + 3;
                          const isSpeaking = absIdx === currentSentenceIdx;
                          const isHighlighted = storyHighlights.includes(absIdx);
                          const hasNote = !!storyNotes[absIdx];
                          return (
                            <span
                              key={absIdx}
                              id={`sentence-${absIdx}`}
                              onClick={() => toggleSentenceHighlight(absIdx)}
                              className={`transition-all duration-300 rounded cursor-pointer ${
                                isSpeaking 
                                  ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-0088ff/40" 
                                  : isHighlighted 
                                  ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                                  : "hover:bg-white/5"
                              } ${hasNote ? "border-dotted border-b border-amber-500" : ""}`}
                            >
                              {s}{" "}
                            </span>
                          );
                        })}
                      </p>
                    </div>

                    {/* INTERACTIVE DYNAMIC TIMELINE WIDGET */}
                    <section className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Sparkles size={16} className="text-[#e5c158]" />
                        <h3 className="text-sm font-semibold tracking-wide text-white uppercase" style={{ fontFamily: "Cinzel, serif" }}>
                          Chronology of Events
                        </h3>
                      </div>

                      <div className="relative pl-6 border-l border-white/10 space-y-6 text-left">
                        {story.timeline.map((event, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#e5c158] border-2 border-[#050508]" />
                            <div 
                              onClick={() => {
                                setExpandedEvent(expandedEvent === idx ? null : idx);
                                playClickSound();
                              }}
                              className="bg-black/35 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-blue-500/20 transition-all select-none"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-wider text-[#e5c158] font-bold">
                                  {event.year}
                                </span>
                                <span className="text-[9px] text-zinc-500">
                                  {expandedEvent === idx ? "Collapse ▲" : "Expand ▼"}
                                </span>
                              </div>
                              <h4 className="text-xs font-semibold text-white mt-1">
                                {event.title[lang] || event.title.en}
                              </h4>
                              {expandedEvent === idx && (
                                <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed animate-fade-in border-t border-white/5 pt-2 font-sans font-light">
                                  {event.details[lang] || event.details.en}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Main Narrative & Evidence Card */}
                    <div className="space-y-4 pt-4">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#e5c158] font-bold block border-b border-white/5 pb-1">Main Narrative</span>
                      <p>
                        {allSentences.slice(7, 12).map((s, idx) => {
                          const absIdx = idx + 7;
                          const isSpeaking = absIdx === currentSentenceIdx;
                          const isHighlighted = storyHighlights.includes(absIdx);
                          const hasNote = !!storyNotes[absIdx];
                          return (
                            <span
                              key={absIdx}
                              id={`sentence-${absIdx}`}
                              onClick={() => toggleSentenceHighlight(absIdx)}
                              className={`transition-all duration-300 rounded cursor-pointer ${
                                isSpeaking 
                                  ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-0088ff/40" 
                                  : isHighlighted 
                                  ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                                  : "hover:bg-white/5"
                              } ${hasNote ? "border-dotted border-b border-amber-500" : ""}`}
                            >
                              {s}{" "}
                            </span>
                          );
                        })}
                      </p>

                      {/* Evidence Highlight Card */}
                      <section className="bg-gradient-to-br from-blue-950/20 to-transparent border border-blue-500/10 p-5 rounded-2xl space-y-2 mt-6">
                        <div className="text-xs uppercase text-blue-400 font-semibold tracking-wider flex items-center gap-2">
                          <BookOpen size={13} />
                          <span>Scientific Evidence Analysis</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans font-light">
                          {story.narrative[lang]?.evidence?.[0] || story.narrative.en.evidence?.[0] || ""}
                        </p>
                      </section>
                    </div>

                    {/* Perspectives grid */}
                    <section className="bg-[#0b0c11] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 pt-4">
                      <div className="border-b border-white/5 pb-2">
                        <h3 className="text-xs font-semibold tracking-wide text-white uppercase" style={{ fontFamily: "Cinzel, serif" }}>
                          Multi-Perspective Analysis
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                        <div className="bg-white/5 p-4 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-green-400 font-bold">Verified Fact</span>
                          <p className="text-[11px] text-zinc-400 leading-normal font-light">
                            {story.narrative[lang]?.facts?.[0] || story.narrative.en.facts?.[0] || ""}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold">Scientific View</span>
                          <p className="text-[11px] text-zinc-400 leading-normal font-light">
                            {story.narrative[lang]?.scientific?.[0] || story.narrative.en.scientific?.[0] || ""}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">Local Legend</span>
                          <p className="text-[11px] text-zinc-400 leading-normal font-light">
                            {story.narrative[lang]?.legends?.[0] || "No major supernatural warnings documented; local folklore aligns with natural hazards."}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold">Unanswered Questions</span>
                          <p className="text-[11px] text-zinc-400 leading-normal font-light">
                            {story.narrative[lang]?.conclusion?.[0] || story.narrative.en.conclusion?.[0] || ""}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Conclusion sentences */}
                    <div className="space-y-4 pt-4">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#e5c158] font-bold block border-b border-white/5 pb-1">Conclusion</span>
                      <p>
                        {allSentences.slice(12).map((s, idx) => {
                          const absIdx = idx + 12;
                          const isSpeaking = absIdx === currentSentenceIdx;
                          const isHighlighted = storyHighlights.includes(absIdx);
                          const hasNote = !!storyNotes[absIdx];
                          return (
                            <span
                              key={absIdx}
                              id={`sentence-${absIdx}`}
                              onClick={() => toggleSentenceHighlight(absIdx)}
                              className={`transition-all duration-300 rounded cursor-pointer ${
                                isSpeaking 
                                  ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-0088ff/40" 
                                  : isHighlighted 
                                  ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                                  : "hover:bg-white/5"
                              } ${hasNote ? "border-dotted border-b border-amber-500" : ""}`}
                            >
                              {s}{" "}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  </>
                )}
              </article>

              {/* Personal notes creator HUD */}
              {activeNoteInput !== null && (
                <div className="bg-[#0b0c11] border border-[#e5c158]/40 p-4 rounded-2xl shadow-xl animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-[10px] uppercase text-[#e5c158] font-bold">Add Research Note to Sentence #{activeNoteInput + 1}</span>
                    <button onClick={() => setActiveNoteInput(null)}><X size={12} className="text-zinc-500 hover:text-white" /></button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your research analysis or notes..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none flex-1 text-white focus:border-[#e5c158]/50"
                    />
                    <button 
                      onClick={() => saveNoteForSentence(activeNoteInput)}
                      className="bg-[#e5c158] hover:bg-[#d4af37] text-black text-xs font-semibold px-4 py-2 rounded-xl"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* REFERENCES CITED SECTION */}
              <footer className="border-t border-white/10 pt-6 mt-12 text-left space-y-3 text-xs text-zinc-500 font-light">
                <span className="font-semibold text-zinc-400 uppercase tracking-widest block">References & Trusted Sources</span>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  {story.references.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </footer>

              {/* INTERACTIVE TOGGLES: AI SUMMARY & ASK AI BUTTONS */}
              <div className="flex flex-wrap gap-3 justify-center pt-8 border-t border-white/5">
                <button
                  onClick={() => { setShowAISummary(!showAISummary); if (showAIChat) setShowAIChat(false); playClickSound(); }}
                  className="bg-white/5 border border-white/10 hover:border-[#e5c158] px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-[#e5c158]" /> AI Story Summary
                </button>
                <button
                  onClick={() => { setShowAIChat(!showAIChat); if (showAISummary) setShowAISummary(false); playClickSound(); }}
                  className="bg-white/5 border border-white/10 hover:border-[#0088ff] px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <QuestionIcon size={13} className="text-[#0088ff]" /> Ask AI Assistant
                </button>
              </div>

              {/* AI STORY SUMMARY PANEL */}
              {showAISummary && (
                <div className="bg-[#0b0c11] border border-white/10 p-5 rounded-2xl shadow-xl animate-fade-in text-left">
                  
                  {/* Summary tabs: Takeaways, dates, places, people */}
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
                        className={`text-[10px] font-semibold uppercase py-1 relative shrink-0 ${
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
                        {story.narrative[lang]?.intro[0]} {story.narrative[lang]?.evidence?.[0] || story.narrative.en.evidence?.[0] || ""} {story.narrative[lang]?.conclusion?.[0] || story.narrative.en.conclusion?.[0] || ""}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ASK AI INTERACTIVE CHAT PANEL */}
              {showAIChat && (
                <div className="bg-[#0b0c11] border border-white/10 p-5 rounded-2xl shadow-xl animate-fade-in flex flex-col gap-4 text-left">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Sparkles size={13} className="text-[#0088ff] animate-pulse" />
                    <span>Ask AI Assistant</span>
                  </div>

                  <div className="space-y-3 h-44 overflow-y-auto pr-1 border border-white/5 p-3 rounded-lg bg-black/20 text-xs font-sans">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        <span className={`text-[9px] uppercase tracking-wider ${msg.sender === "user" ? "text-zinc-500" : "text-[#0088ff] font-bold"}`}>
                          {msg.sender === "user" ? "You" : "VELORA AI"}
                        </span>
                        <div className={`p-2.5 rounded-xl max-w-[85%] font-light leading-relaxed ${
                          msg.sender === "user" 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none"
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
                        className="bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:border-[#0088ff] hover:text-white transition-colors"
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
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl active:scale-95 transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* FLOATING READING PROGRESS HUD BAR */}
          <footer className="bg-black/60 border-t border-white/5 py-2.5 px-6 flex items-center justify-between text-xs text-zinc-500 z-20 shadow-2xl backdrop-blur-md font-sans">
            <span>Chapter 1 of 1</span>
            <div className="flex items-center gap-4">
              <span>{Math.round(Number(story.duration.replace(" mins", "")) * (1 - readingProgress/100))} mins remaining</span>
              <div className="w-24 bg-white/10 rounded-full h-1 relative overflow-hidden">
                <div className="bg-[#e5c158] h-1 rounded-full animate-pulse" style={{ width: `${readingProgress}%` }} />
              </div>
              <span>{readingProgress}% read</span>
            </div>
          </footer>
        </>
      )}

      {/* STAGE 4: COMPLETION SCREEN */}
      {readStage === "completed" && (
        <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
          <div className="space-y-6 max-w-xl scale-up-entry py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e5c158] to-amber-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(229,193,88,0.3)] animate-bounce">
              <Check size={28} className="text-black font-bold" />
            </div>

            <div className="space-y-2">
              <span className="text-[#e5c158] text-xs font-bold uppercase tracking-[0.3em]">
                Journey Complete
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide leading-tight" style={{ fontFamily: "Cinzel, serif" }}>
                Congratulations, Reader.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed pt-1 font-sans">
                You have successfully expounded the mysteries of {story.title.en}.
              </p>
            </div>

            {/* Earned metrics */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 max-w-sm mx-auto grid grid-cols-2 gap-4 font-sans">
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Read Duration</span>
                <span className="text-lg font-light text-white mt-1 block">{story.duration}</span>
              </div>
              <div className="text-center border-l border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Knowledge Power</span>
                <span className="text-lg font-light text-[#e5c158] mt-1 block flex items-center justify-center gap-1">
                  <Award size={14} /> +15 KP
                </span>
              </div>
            </div>

            <div className="h-[1px] w-24 bg-white/10 mx-auto my-6" />

            {/* You May Also Like Recommendations */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Recommended Next Reads</span>
              <div className="flex flex-wrap justify-center gap-4">
                {getRecommendations(story.id, userSettings.history).map(rec => (
                  <div 
                    key={rec.id}
                    onClick={() => {
                      const storyObj = getStoryDetail(rec.id);
                      onBack();
                      onBack(); // reset double overlays if any
                      // We will reload the new story by sending start reading to home page
                      setTimeout(() => {
                        window.location.reload(); // simple trigger or fallback handle on dashboard
                      }, 200);
                    }}
                    className="bg-white/5 border border-white/5 hover:border-blue-500/30 p-3 rounded-xl cursor-pointer text-left w-48 transition-colors group font-sans"
                  >
                    <span className="text-[8px] uppercase text-blue-400 font-bold block">{rec.category}</span>
                    <h4 className="text-xs font-semibold text-white mt-0.5 truncate group-hover:text-[#e5c158] transition-colors">
                      {rec.title[lang] || rec.title.en}
                    </h4>
                    <p className="text-[9px] text-zinc-500 mt-1">{rec.duration} read</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { stopNarrator(); onBack(); }}
              className="mt-8 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 hover:border-white/30 text-white font-semibold text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              Continue Exploring <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
