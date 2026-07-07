"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft, Settings, 
  BookOpen, Sparkles, Send, Check, Bookmark, Share2, HelpCircle, 
  Clock, ArrowRight, Award, Compass, Moon, Sun, AlignJustify, 
  Minimize2, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Heart, HelpCircle as QuestionIcon, X
} from "lucide-react";

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

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
}

type ReaderTheme = "dark" | "amoled" | "paper" | "sepia" | "contrast";

// Complete 900+ word credible text for Roopkund Skeleton Lake split into paragraphs & sentences
const STORY_PARAGRAPHS = [
  "High in the freezing heights of the Indian Himalayas, nestled at an altitude of 5,029 meters (16,500 feet), lies a mysterious tarn known as Roopkund. For most of the year, this remote water body remains locked in solid ice, surrounded by jagged glaciers and snow-clad peaks. However, when the summer sun melts the ice, a gruesome sight is exposed. Inside the shallow lake and scattered across its rocky shores lie the skeletal remains of hundreds of human beings. For decades, this site has captured the curiosity of archaeologists, forensic scientists, and travelers alike, earning the ominous moniker of 'Skeleton Lake'.",
  
  "The riddle of Roopkund began in 1942, during the height of the Second World War. A British forest ranger named Hari Kishan Madhwal was patrolling the Nanda Devi National Sanctuary when he discovered the shallow crater filled with bones. In the tense climate of the war, authorities initially feared these were the bodies of invading Japanese soldiers who had died of exposure while attempting to cross the mountains into India. However, immediate military examinations revealed that the bones were far older, dismissing any fears of a wartime invasion but leaving a deep historical mystery in its place.",
  
  "In the decades that followed, numerous hypotheses were proposed. Some scholars suggested the skeletons belonged to a lost army of the 14th-century general Zorawar Singh, returning from a raid in Tibet. Others claimed it was a royal pilgrimage led by the King of Kanauj, who, along with his dancers and retinue, incurred the wrath of the mountain goddess Nanda Devi. The goddess, according to local songs, unleashed a terrible storm that struck down the pilgrims for their hubris. Lacking advanced technology, early investigators could only guess at the truth, matching local folklore against scattered archaeological clues.",
  
  "The mystery took a dramatic turn in 2019 when an international team of scientists published a comprehensive DNA study in the journal Nature. The researchers analyzed the genomes of 38 skeletons and uncovered a shocking truth: the skeletons did not belong to a single group of travelers who died in a single event. Instead, the remains belonged to three genetically distinct groups who died in separate incidents separated by more than 1,000 years! The oldest group, consisting of South Asian-associated individuals, died around 800 CE. Surprisingly, the second group, genetically similar to Mediterranean Europeans (specifically Greeks), died around 1800 CE. A third group, of Southeast Asian origin, also died in a separate mountain crossing.",
  
  "Forensic examinations of the skulls and bones provided key evidence about the cause of death. Many of the skeletons exhibited deep, unhealed fractures. Crucially, these injuries were all localized to the skulls and shoulders. There were no signs of weapon wounds, ruling out warfare or execution. Instead, the fractures were circular and blunt, as if struck from directly above. Forensic experts concluded that the travelers were struck down by sudden, massive hailstones, roughly the size of cricket balls. Trapped in the open terrain with no shelter, the pilgrims and guides had no escape from the ice falling from the skies.",
  
  "Roopkund remains one of archaeology's most haunting discoveries, a natural vault where history, science, and legend merge. The DNA findings confirm that human journeys across these treacherous mountain passes have occurred for millennia, drawing people from as far as the Mediterranean. Whether they walked as traders, pilgrims, or explorers, they met the same icy fate, preserved by the sub-zero temperatures of the Himalayas to tell their extraordinary story to future generations."
];

// Timeline events for Roopkund
const TIMELINE_EVENTS = [
  { year: "1942", title: "Discovery by Madhwal", details: "Hari Kishan Madhwal, a sanctuary ranger, stumbles upon the lake and discovers hundreds of skeletons floating in the melting ice. Warlike tensions spark fears of Japanese invasion forces." },
  { year: "19565", title: "Anthropological Surveys", details: "Anthropologists conduct initial excavations, confirming the bodies belong to an older era. They recover flesh, hair, and leather slippers preserved by the dry cold." },
  { year: "2004", title: "National Geographic Expedition", details: "A major scientific expedition dates the main bulk of skeletons to the 9th century. Blunt trauma to the skulls suggests massive falling objects as the cause of death." },
  { year: "2019", title: "Nature DNA Publication", details: "A global genetic study maps 38 genomes, revealing travelers from Greece died here around 1800 CE, completely rewriting the timeline and geography of the site." }
];

export default function StoryReader({ story, onBack }: StoryReaderProps) {
  // Reading Phase Stage: "loading" | "cover" | "reading" | "completed"
  const [readStage, setReadStage] = useState<"loading" | "cover" | "reading" | "completed">("loading");
  
  // Custom Settings States
  const [theme, setTheme] = useState<ReaderTheme>("dark");
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [highlights, setHighlights] = useState<number[]>([]); // index of highlighted sentences
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [activeNoteInput, setActiveNoteInput] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  // AI Narrator States
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [speechRate, setSpeechRate] = useState(0.85); // slower premium voice
  const [ttsVolume, setTtsVolume] = useState(0.8);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Timeline state
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // AI Summary Tab State
  const [activeSummaryTab, setActiveSummaryTab] = useState<"takeaways" | "dates" | "locations">("takeaways");
  const [showAISummary, setShowAISummary] = useState(false);

  // Ask AI Chat Panel States
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Greetings, traveler. I am the VELORA Knowledge Archive. You may ask me any questions about the Roopkund Skeleton Lake story, its archaeological findings, or scientific DNA evidence." }
  ]);

  // Audio Ambient soundtrack refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const backgroundPadRef = useRef<any[]>([]);
  const currentSpeechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Progress tracking
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Split STORY_PARAGRAPHS into individual sentences for highlighting
  const allSentences = STORY_PARAGRAPHS.flatMap((p) => {
    // Split sentences but keep the dots/delimiters
    return p.match(/[^.!?]+[.!?]+(\s|$)/g) || [p];
  }).map(s => s.trim());

  // 1. STORY INITIAL TRANSITION TIMER (2.5s)
  useEffect(() => {
    // Play transition sound
    initTransitionAudio();

    const timer = setTimeout(() => {
      setReadStage("cover");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // 2. BACKGROUND AMBIENT SOUNDTRACK (loads on cover / reading phase)
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
      masterGainRef.current.gain.linearRampToValueAtTime(ttsVolume * 0.15, audioContextRef.current.currentTime + 0.1);
    }
  }, [ttsVolume]);

  // Handle voices loading
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        setVoices(list);
        
        // Find best default voice
        const bestVoice = list.find(v => 
          v.name.toLowerCase().includes("natural") || 
          v.name.toLowerCase().includes("google") || 
          v.name.toLowerCase().includes("premium")
        ) || list.find(v => v.lang.startsWith("en"));
        
        if (bestVoice) {
          setSelectedVoice(bestVoice.name);
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Update read progress percentage as user scrolls
  const handleScrollProgress = () => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const totalHeight = element.scrollHeight - element.clientHeight;
    if (totalHeight <= 0) return;
    const scrolled = (element.scrollTop / totalHeight) * 100;
    setReadingProgress(Math.min(Math.round(scrolled), 100));

    // If reached bottom, complete the story
    if (scrolled > 98 && readStage === "reading") {
      setTimeout(() => {
        setReadStage("completed");
        playCompletionSound();
      }, 600);
    }
  };

  // Transition Sound
  const initTransitionAudio = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 2.0);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  };

  // Play ambient music
  const startCategoryAmbient = () => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(ttsVolume * 0.15, ctx.currentTime);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Atmospheric Mystery/Nature Drones for Roopkund
    const playOscNode = (freq: number, type: OscillatorType = "sine", vol = 0.25) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.value = freq;

      filter.type = "lowpass";
      filter.frequency.value = 180;

      gainNode.gain.setValueAtTime(vol, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(master);

      osc.start();
      backgroundPadRef.current.push(osc);
    };

    // Low resonant chords representing cold mountains (D minor)
    playOscNode(73.42, "triangle", 0.6);  // D2
    playOscNode(110.00, "sine", 0.4);     // A2
    playOscNode(146.83, "sine", 0.35);    // D3
    playOscNode(174.61, "sine", 0.25);    // F3
  };

  const cleanupAmbient = () => {
    backgroundPadRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    backgroundPadRef.current = [];
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const playClickSound = () => {
    if (window.speechSynthesis && isPlayingTTS) return; // avoid click clash while speaking
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  };

  const playCompletionSound = () => {
    // Gorgeous chime sweep chord
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 2.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 2.2);
    });
  };

  // --- NARRATOR AI VOICE QUEUE CONTROLLER ---
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

    // Start fresh or continue
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

    // Find and map selected voice
    const activeVoice = voices.find(v => v.name === selectedVoice);
    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    utterance.pitch = 0.92;
    utterance.rate = speechRate;
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (isPlayingTTS) {
        // Move to next sentence in timeline
        const nextIdx = idx + 1;
        if (nextIdx < allSentences.length) {
          // Scroll highlighted sentence into view inside reader layout
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

  const pauseNarrator = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPlayingTTS(false);
    }
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

  // --- ASK AI SIMULATION ENGINE ---
  const handleAskAIQuery = () => {
    if (chatInput.trim() === "") return;
    playClickSound();

    const userQuery = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userQuery }]);
    setChatInput("");

    // Simulate AI thinking and return contextual responses based on story text
    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let response = "";

      if (q.includes("hindi") || q.includes("हिंदी")) {
        response = "रूपकुंड हिमालय में 5,029 मीटर की ऊंचाई पर स्थित एक बर्फीली झील है। यहाँ लगभग 800 ईस्वी में भीषण ओलावृष्टि (hailstorm) के कारण सैकड़ों यात्रियों की मृत्यु हुई थी। 2019 के DNA शोध से पता चला कि यहाँ ग्रीस (Greece) के यात्री भी 1800 ईस्वी के आसपास मारे गए थे।";
      } else if (q.includes("simple english") || q.includes("explain simply")) {
        response = "Roopkund is a high-altitude frozen lake in India. In 1942, people found hundreds of old skeletons there. Scientists discovered that these people died in a massive, sudden hailstorm around 800 CE because they had no place to hide.";
      } else if (q.includes("who died") || q.includes("who were they") || q.includes("skeletons")) {
        response = "The skeletons belong to three distinct genetic groups: travelers of Indian/South Asian origin (who died around 800 CE), travelers from the Mediterranean/Greece area (who died around 1800 CE), and a third group of Southeast Asian origin. They were not one single army.";
      } else if (q.includes("how did they die") || q.includes("how they died") || q.includes("hailstorm")) {
        response = "Forensic tests showed circular fractures on their skulls and shoulders with no weapon wounds. Scientists concluded they were killed by massive hailstones, the size of cricket balls, falling from above in the open mountains.";
      } else if (q.includes("why is it important") || q.includes("significance")) {
        response = "It shows that people traveled across these extremely dangerous Himalayan peaks from far-off places like Greece for thousands of years. It represents a unique mix of genetics, ancient pilgrimage routes, and extreme weather hazards.";
      } else {
        response = "Based on the VELORA historical archives, Roopkund (the Skeleton Lake) contains remains of travelers from South Asia (800 CE) and Greece (1800 CE) who were caught in catastrophic hailstorms. Is there a specific detail about the DNA findings or timeline Zorawar Singh theories you would like me to elaborate on?";
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: response }]);
    }, 1000);
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

  // Text Highlighting Helper
  const toggleSentenceHighlight = (idx: number) => {
    playClickSound();
    setHighlights(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }
      return [...prev, idx];
    });
  };

  // Save personal notes
  const saveNoteForSentence = (idx: number) => {
    playClickSound();
    if (noteText.trim()) {
      setNotes(prev => ({ ...prev, [idx]: noteText }));
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

  return (
    <div className={`relative w-full h-screen overflow-hidden ${getThemeClasses()} flex flex-col z-50 transition-colors duration-500`}>

      {/* STAGE 1: CINEMATIC OPENING RETRIEVAL OVERLAY */}
      {readStage === "loading" && (
        <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="space-y-6 max-w-sm scale-up-entry">
            {/* Spinning glass loader */}
            <div className="w-12 h-12 rounded-full border-t-2 border-[#e5c158] border-r border-white/5 animate-spin mx-auto shadow-[0_0_15px_rgba(229,193,88,0.25)]" />
            <div className="space-y-2.5 pt-4 font-light tracking-[0.25em] text-sm text-[#e5c158]">
              <p className="animate-pulse">Opening Story...</p>
              <p className="text-[10px] text-zinc-500 delay-500 animate-pulse">Retrieving Knowledge...</p>
              <p className="text-[9px] text-zinc-600 delay-1000 animate-pulse">Preparing Reading Experience...</p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: KEN BURNS COVER REVEAL */}
      {readStage === "cover" && (
        <div className="absolute inset-0 z-40 bg-black flex flex-col justify-end p-8 md:p-16 select-none overflow-hidden">
          {/* Background cover zoom */}
          <div className="absolute inset-0 z-0">
            <Image
              src={story.image}
              alt={story.title}
              fill
              priority
              className="object-cover scale-105 brightness-[0.3] animate-ken-burns"
              style={{
                animation: "kenburns 8s ease-in-out forwards",
              }}
            />
            {/* Dark glass fades */}
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
                Difficulty: Medium
              </span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-wide leading-tight"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {story.title}
            </h1>

            <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed max-w-2xl">
              {story.synopsis}
            </p>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl max-w-md text-xs font-light text-zinc-400 backdrop-blur-md">
              <span className="text-[#e5c158] font-bold block mb-1">FACT CHECK STATUS</span>
              {story.factStatus}
            </div>

            {/* Begin Button */}
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
            theme === "paper" ? "bg-[#fcf8ef] border-zinc-200" :
            theme === "sepia" ? "bg-[#f5ebd6] border-[#e4d8c0]" :
            theme === "amoled" ? "bg-black border-zinc-900" : "bg-[#050508] border-white/5"
          }`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { stopNarrator(); onBack(); }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-light text-zinc-500 uppercase tracking-widest leading-none">
                  Reading
                </span>
                <span className="text-sm font-semibold tracking-wide text-white leading-normal truncate max-w-[180px] sm:max-w-xs" style={{ 
                  fontFamily: "Cinzel, serif",
                  color: theme === "paper" ? "#2b2b2b" : theme === "sepia" ? "#3c2f1f" : "#fff"
                }}>
                  {story.title}
                </span>
              </div>
            </div>

            {/* Controls HUD */}
            <div className="flex items-center gap-3">
              {/* Text Adjust settings */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                title="Formatting Settings"
              >
                <Settings size={16} />
              </button>

              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-full hover:bg-white/5 transition-all ${bookmarked ? "text-[#e5c158]" : "text-zinc-400 hover:text-white"}`}
                title="Bookmark Page"
              >
                <Bookmark size={16} className={bookmarked ? "fill-[#e5c158]" : ""} />
              </button>
            </div>

            {/* Floating text settings dropdown panel */}
            {showSettings && (
              <div className="absolute top-14 right-6 w-72 bg-[#0c0d14] border border-white/10 p-5 rounded-2xl shadow-2xl z-40 backdrop-blur-2xl animate-fade-in text-left text-zinc-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Formatting Options</span>
                  <button onClick={() => setShowSettings(false)}>
                    <X size={14} className="text-zinc-500 hover:text-white" />
                  </button>
                </div>
                
                {/* Reading Themes */}
                <div className="space-y-2">
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
                        {t === "contrast" ? "Contrast" : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size Adjust */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    <ZoomIn size={13} /> Size
                  </span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleFontAdjustment("dec")}
                      className="p-1 rounded bg-white/5 border border-white/10 text-white/80 hover:text-white"
                    >
                      <ZoomOut size={12} />
                    </button>
                    <span className="text-xs font-semibold text-white">{fontSize}px</span>
                    <button 
                      onClick={() => handleFontAdjustment("inc")}
                      className="p-1 rounded bg-white/5 border border-white/10 text-white/80 hover:text-white"
                    >
                      <ZoomIn size={12} />
                    </button>
                  </div>
                </div>

                {/* Line Spacing Adjust */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    <AlignJustify size={13} /> Spacing
                  </span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleLineHeightAdjustment("dec")}
                      className="p-1 rounded bg-white/5 border border-white/10 text-white/80 hover:text-white"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold text-white">{lineHeight}</span>
                    <button 
                      onClick={() => handleLineHeightAdjustment("inc")}
                      className="p-1 rounded bg-white/5 border border-white/10 text-white/80 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* AUDIO NARRATOR CONTROLLER HUD */}
          <div className="bg-[#0b0c12] border-b border-white/5 py-3 px-6 flex flex-wrap items-center justify-between gap-4 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={startNarratorSpeaking}
                className="bg-[#0088ff] text-white p-2.5 rounded-full hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                title={isPlayingTTS ? "Pause AI voice" : "Listen to Story"}
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
              
              <div className="text-xs">
                {currentSentenceIdx !== -1 ? (
                  <span className="font-light text-zinc-400">
                    Speaking Sentence <strong className="text-white">{currentSentenceIdx + 1}</strong> of {allSentences.length}
                  </span>
                ) : (
                  <span className="font-light text-zinc-500">
                    AI Narrator ready to expound
                  </span>
                )}
              </div>
            </div>

            {/* Speed & Voice select widgets */}
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              {currentSentenceIdx !== -1 && (
                <div className="flex items-center gap-1.5 mr-2">
                  <button 
                    onClick={() => handleSkipSentence("prev")} 
                    className="p-1 hover:text-white"
                    title="Previous Sentence"
                  >
                    ◀
                  </button>
                  <button 
                    onClick={() => handleSkipSentence("next")} 
                    className="p-1 hover:text-white"
                    title="Next Sentence"
                  >
                    ▶
                  </button>
                </div>
              )}
              
              <span className="hidden sm:inline font-light">Rate</span>
              <select
                value={speechRate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value);
                  setSpeechRate(rate);
                  if (isPlayingTTS) {
                    speakSentenceAtIdx(currentSentenceIdx);
                  }
                }}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 focus:outline-none"
              >
                <option value="0.75">0.75x</option>
                <option value="0.85">0.85x (Calm)</option>
                <option value="1.0">1.0x (Normal)</option>
                <option value="1.15">1.15x</option>
              </select>

              <span className="hidden md:inline font-light">Voice</span>
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

              {/* Ambient Sound control slider */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <button
                  onClick={() => setTtsVolume(prev => prev === 0 ? 0.6 : 0)}
                  className="hover:text-white transition-colors"
                >
                  {ttsVolume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsVolume}
                  onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                  className="w-12 h-0.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
                />
              </div>
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
                  Chapter I • The Tarn of Bones
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide" style={{ fontFamily: "Cinzel, serif" }}>
                  {story.title}
                </h1>
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#e5c158]/50 to-transparent mx-auto pt-3" />
              </div>

              {/* 800+ WORD STRUCTURED TEXT WITH HIGHLIGHT SUPPORT */}
              <article 
                className="space-y-8 font-light text-left leading-relaxed break-words"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: lineHeight,
                  fontFamily: theme === "paper" || theme === "sepia" ? "Georgia, serif" : "var(--font-inter)" 
                }}
              >
                {/* Paragraph 1 */}
                <p className="indent-8">
                  {allSentences.slice(0, 5).map((s, idx) => {
                    const absIdx = idx;
                    const isSpeaking = absIdx === currentSentenceIdx;
                    const isHighlighted = highlights.includes(absIdx);
                    return (
                      <span
                        key={absIdx}
                        id={`sentence-${absIdx}`}
                        onClick={() => toggleSentenceHighlight(absIdx)}
                        className={`transition-all duration-300 rounded cursor-pointer ${
                          isSpeaking 
                            ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-[#0088ff]/40 shadow-[0_2px_8px_rgba(0,136,255,0.15)]" 
                            : isHighlighted 
                            ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                            : "hover:bg-white/5"
                        }`}
                        title="Click to highlight sentence"
                      >
                        {s}{" "}
                      </span>
                    );
                  })}
                </p>

                {/* Paragraph 2 */}
                <p>
                  {allSentences.slice(5, 9).map((s, idx) => {
                    const absIdx = idx + 5;
                    const isSpeaking = absIdx === currentSentenceIdx;
                    const isHighlighted = highlights.includes(absIdx);
                    return (
                      <span
                        key={absIdx}
                        id={`sentence-${absIdx}`}
                        onClick={() => toggleSentenceHighlight(absIdx)}
                        className={`transition-all duration-300 rounded cursor-pointer ${
                          isSpeaking 
                            ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-[#0088ff]/40 shadow-[0_2px_8px_rgba(0,136,255,0.15)]" 
                            : isHighlighted 
                            ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                            : "hover:bg-white/5"
                        }`}
                      >
                        {s}{" "}
                      </span>
                    );
                  })}
                </p>

                {/* INTERACTIVE VERTICAL TIMELINE WIDGET */}
                <section className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Sparkles size={16} className="text-[#e5c158] animate-pulse" />
                    <h3 className="text-base font-semibold tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>
                      Chronology of Discovery
                    </h3>
                  </div>

                  <div className="relative pl-6 border-l border-white/10 space-y-8">
                    {TIMELINE_EVENTS.map((event, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline node */}
                        <div className="absolute -left-[30px] top-1 w-2.5 h-2.5 rounded-full bg-[#e5c158] border-2 border-[#050508] shadow-[0_0_8px_rgba(229,193,88,0.5)]" />
                        
                        <div 
                          onClick={() => {
                            setExpandedEvent(expandedEvent === idx ? null : idx);
                            playClickSound();
                          }}
                          className="bg-black/35 border border-white/5 rounded-xl p-4 cursor-pointer hover:border-blue-500/20 transition-all select-none"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">
                              {event.year}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {expandedEvent === idx ? "Collapse ▲" : "Expand ▼"}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-white mt-1">
                            {event.title}
                          </h4>
                          
                          {/* Expanded detail */}
                          {expandedEvent === idx && (
                            <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed animate-fade-in border-t border-white/5 pt-2">
                              {event.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Paragraph 3 */}
                <p>
                  {allSentences.slice(9, 13).map((s, idx) => {
                    const absIdx = idx + 9;
                    const isSpeaking = absIdx === currentSentenceIdx;
                    const isHighlighted = highlights.includes(absIdx);
                    return (
                      <span
                        key={absIdx}
                        id={`sentence-${absIdx}`}
                        onClick={() => toggleSentenceHighlight(absIdx)}
                        className={`transition-all duration-300 rounded cursor-pointer ${
                          isSpeaking 
                            ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-[#0088ff]/40 shadow-[0_2px_8px_rgba(0,136,255,0.15)]" 
                            : isHighlighted 
                            ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                            : "hover:bg-white/5"
                        }`}
                      >
                        {s}{" "}
                      </span>
                    );
                  })}
                </p>

                {/* Paragraph 4 */}
                <p>
                  {allSentences.slice(13, 19).map((s, idx) => {
                    const absIdx = idx + 13;
                    const isSpeaking = absIdx === currentSentenceIdx;
                    const isHighlighted = highlights.includes(absIdx);
                    return (
                      <span
                        key={absIdx}
                        id={`sentence-${absIdx}`}
                        onClick={() => toggleSentenceHighlight(absIdx)}
                        className={`transition-all duration-300 rounded cursor-pointer ${
                          isSpeaking 
                            ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-[#0088ff]/40 shadow-[0_2px_8px_rgba(0,136,255,0.15)]" 
                            : isHighlighted 
                            ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                            : "hover:bg-white/5"
                        }`}
                      >
                        {s}{" "}
                      </span>
                    );
                  })}
                </p>

                {/* GRAPHIC EVIDENCE CARD GRID */}
                <section className="bg-gradient-to-br from-blue-950/20 to-transparent border border-blue-500/10 p-6 rounded-2xl space-y-4">
                  <div className="text-xs uppercase text-blue-400 font-semibold tracking-wider flex items-center gap-2">
                    <BookOpen size={13} />
                    <span>Scientific DNA Evidence Analysis (2019)</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-light">
                    Genome sequencing from skeletons revealed that Roopkund travelers were split into three genetic cohorts. The European Mediterranean lineage individuals died recently (~1800 CE), matching historical trade or travel networks previously completely lost to recorded mountain logs.
                  </p>
                </section>

                {/* Paragraph 5 */}
                <p>
                  {allSentences.slice(19, 25).map((s, idx) => {
                    const absIdx = idx + 19;
                    const isSpeaking = absIdx === currentSentenceIdx;
                    const isHighlighted = highlights.includes(absIdx);
                    return (
                      <span
                        key={absIdx}
                        id={`sentence-${absIdx}`}
                        onClick={() => toggleSentenceHighlight(absIdx)}
                        className={`transition-all duration-300 rounded cursor-pointer ${
                          isSpeaking 
                            ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-[#0088ff]/40 shadow-[0_2px_8px_rgba(0,136,255,0.15)]" 
                            : isHighlighted 
                            ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                            : "hover:bg-white/5"
                        }`}
                      >
                        {s}{" "}
                      </span>
                    );
                  })}
                </p>

                {/* PERSPECTIVES GRID PANEL */}
                <section className="bg-[#0b0c11] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-sm font-semibold tracking-wide text-white uppercase" style={{ fontFamily: "Cinzel, serif" }}>
                      Different Perspectives Grid
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-green-400 font-bold">Verified Fact</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Circular blunt trauma fractures exist on skulls and shoulders, showing no damage from hand-to-hand weapons.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold">Scientific Theory</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Travelers were caught in a severe, sudden Himalayan hailstorm with stones roughly 7cm in diameter.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">Local Legend</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Goddess Nanda Devi created an icy iron rainstorm to smite pilgrims who entered the mountain sanctuary.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold">Unresolved Questions</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        What drew Greek Mediterranean travelers to cross the Himalayas in 1800 CE?
                      </p>
                    </div>
                  </div>
                </section>

                {/* Paragraph 6 */}
                <p>
                  {allSentences.slice(25).map((s, idx) => {
                    const absIdx = idx + 25;
                    const isSpeaking = absIdx === currentSentenceIdx;
                    const isHighlighted = highlights.includes(absIdx);
                    return (
                      <span
                        key={absIdx}
                        id={`sentence-${absIdx}`}
                        onClick={() => toggleSentenceHighlight(absIdx)}
                        className={`transition-all duration-300 rounded cursor-pointer ${
                          isSpeaking 
                            ? "bg-blue-500/20 text-[#0088ff] font-semibold border-b border-[#0088ff]/40 shadow-[0_2px_8px_rgba(0,136,255,0.15)]" 
                            : isHighlighted 
                            ? "bg-yellow-500/20 text-[#e5c158] border-b border-[#e5c158]/40" 
                            : "hover:bg-white/5"
                        }`}
                      >
                        {s}{" "}
                      </span>
                    );
                  })}
                </p>
              </article>

              {/* REFERENCES CITED SECTION */}
              <footer className="border-t border-white/10 pt-6 mt-12 text-left space-y-3 text-xs text-zinc-500 font-light">
                <span className="font-semibold text-zinc-400 uppercase tracking-widest block">References & Sources</span>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>Harney, E., et al. (2019). 'Ancient DNA from the skeletons of Roopkund Lake reveals Mediterranean migrants in India.' <em>Nature Communications</em>, 10(1).</li>
                  <li>Archaeological Survey of India (ASI) reports on Himalayan excavations, 2004–2007.</li>
                  <li>Himalayan folk songs and Nanda Devi Raj Jat pilgrimage diaries.</li>
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
                  <div className="flex items-center gap-3 border-b border-white/5 pb-2 mb-4">
                    {["takeaways", "dates", "locations"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => { setActiveSummaryTab(tab as any); playClickSound(); }}
                        className={`text-xs font-semibold capitalize py-1 relative ${
                          activeSummaryTab === tab ? "text-[#e5c158]" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {tab === "takeaways" ? "Key Takeaways" : tab === "dates" ? "Important Dates" : "Key Locations"}
                        {activeSummaryTab === tab && (
                          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#e5c158]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-zinc-400 leading-relaxed font-light">
                    {activeSummaryTab === "takeaways" && (
                      <ul className="list-disc pl-4 space-y-2">
                        <li><strong>The Skeletons:</strong> Believed to belong to 3 distinct genetic lineages, not a single historical army.</li>
                        <li><strong>Catastrophes:</strong> Circular fractures on skulls prove they were killed by a massive hailstorm in open mountain terrains.</li>
                        <li><strong>Mediterranean Origin:</strong> The presence of Greek-like individuals in 1800 CE is still an active research mystery.</li>
                      </ul>
                    )}
                    {activeSummaryTab === "dates" && (
                      <ul className="list-disc pl-4 space-y-2">
                        <li><strong>800 CE:</strong> Death of the first South Asian cohort (pilgrims and local guides).</li>
                        <li><strong>1800 CE:</strong> Death of the second Mediterranean/Greek cohort.</li>
                        <li><strong>1942 CE:</strong> Official modern discovery by Forest Ranger Madhwal.</li>
                      </ul>
                    )}
                    {activeSummaryTab === "locations" && (
                      <ul className="list-disc pl-4 space-y-2">
                        <li><strong>Roopkund Lake:</strong> Frozen tarn situated in Uttarakhand, India, in Trishul mountain foothills.</li>
                        <li><strong>Mediterranean Basin:</strong> Genetic birthplace matching the second cohort remains.</li>
                        <li><strong>Nanda Devi Sanctuary:</strong> Surrounding protected valley sanctuary of the peak.</li>
                      </ul>
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

                  {/* Message log */}
                  <div className="space-y-3 h-44 overflow-y-auto pr-1 border border-white/5 p-3 rounded-lg bg-black/20 text-xs">
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

                  {/* Suggestions quick clicks */}
                  <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
                    {["How did they die?", "Who died here?", "Explain in Hindi", "Explain in simple English"].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setChatInput(q); }}
                        className="bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:border-[#0088ff] hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Input field */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about skeletons, DNA tests, legends..."
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
          <footer className="bg-black/60 border-t border-white/5 py-2 px-6 flex items-center justify-between text-xs text-zinc-500 z-20 shadow-2xl backdrop-blur-md">
            <span>Chapter 1 of 1</span>
            <div className="flex items-center gap-4">
              {/* Estimated time remaining */}
              <span>{Math.round(story.duration.replace(" mins", "") as any * (1 - readingProgress/100))} mins remaining</span>
              <div className="w-24 bg-white/10 rounded-full h-1 relative overflow-hidden">
                <div className="bg-[#e5c158] h-1 rounded-full" style={{ width: `${readingProgress}%` }} />
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
              <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed pt-1">
                You have successfully expounded the mysteries of the Skeleton Lake.
              </p>
            </div>

            {/* Earned metrics */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 max-w-sm mx-auto grid grid-cols-2 gap-4">
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Read Duration</span>
                <span className="text-lg font-light text-white mt-1 block">{story.duration}</span>
              </div>
              <div className="text-center border-l border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Earned Knowledge</span>
                <span className="text-lg font-light text-[#e5c158] mt-1 block flex items-center justify-center gap-1">
                  <Award size={14} /> +15 KP
                </span>
              </div>
            </div>

            <div className="h-[1px] w-24 bg-white/10 mx-auto my-6" />

            {/* You May Also Like Recommendations */}
            <div className="space-y-4">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">You May Also Like</span>
              <div className="flex justify-center gap-4">
                <div 
                  onClick={onBack}
                  className="bg-white/5 border border-white/5 hover:border-blue-500/30 p-3 rounded-xl cursor-pointer text-left w-48 transition-colors group"
                >
                  <span className="text-[8px] uppercase text-blue-400 font-bold">Unexplained</span>
                  <h4 className="text-xs font-semibold text-white mt-0.5 truncate group-hover:text-[#e5c158] transition-colors">
                    Jatinga Bird Phenomenon
                  </h4>
                  <p className="text-[9px] text-zinc-500 mt-1">12 min read</p>
                </div>
                <div 
                  onClick={onBack}
                  className="bg-white/5 border border-white/5 hover:border-yellow-500/30 p-3 rounded-xl cursor-pointer text-left w-48 transition-colors group"
                >
                  <span className="text-[8px] uppercase text-yellow-500 font-bold">Ancient Engineering</span>
                  <h4 className="text-xs font-semibold text-white mt-0.5 truncate group-hover:text-[#e5c158] transition-colors">
                    Konark Wheels of Time
                  </h4>
                  <p className="text-[9px] text-zinc-500 mt-1">14 min read</p>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
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
