"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Play, BookOpen, Search, Clock, Sparkles, Volume2, VolumeX, User, 
  ChevronRight, X, Headphones, Globe, ArrowRight, Settings, Bell, 
  Flame, Award, Compass, Heart, Bookmark, Eye, HelpCircle, Star, Music, Send
} from "lucide-react";
import { 
  getStoryDetail, 
  naturalLanguageSearch, 
  getDailyFeatures, 
  groupIntoCollections,
  getRecommendations,
  generateCustomStory,
  StoryDetail
} from "../utils/storyEngine";
import { KNOWLEDGE_DATABASE } from "../data/knowledgeDatabase";
import { UserSettings, BookmarkData } from "../app/page";
import { apiClient } from "../services/apiClient";

type AmbientTheme = "library" | "space" | "ancient" | "calm";

interface DashboardProps {
  onStartReading: (story: StoryDetail) => void;
  userName: string;
  userSettings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  bookmarks: BookmarkData;
  updateBookmarks: (updater: (prev: BookmarkData) => BookmarkData) => void;
  onAuthSuccess?: (syncedUser: any) => void;
}

const CATEGORIES = [
  { name: "Indian Mysteries", count: 18, color: "from-amber-600/30 to-[#e5c158]/5 border-amber-500/20" },
  { name: "Ancient India", count: 24, color: "from-yellow-600/30 to-[#e5c158]/5 border-yellow-500/20" },
  { name: "History", count: 32, color: "from-blue-600/30 to-[#0088ff]/5 border-blue-500/20" },
  { name: "Archaeology", count: 15, color: "from-indigo-600/30 to-indigo-500/5 border-indigo-500/20" },
  { name: "Space & Science", count: 28, color: "from-sky-600/30 to-[#0088ff]/5 border-sky-500/20" },
  { name: "Civilizations", count: 19, color: "from-cyan-600/30 to-cyan-500/5 border-cyan-500/20" },
  { name: "Legends & Folklore", count: 22, color: "from-red-600/30 to-red-500/5 border-red-500/20" },
  { name: "Unexplained Phenomena", count: 11, color: "from-purple-600/30 to-purple-500/5 border-purple-500/20" }
];

const COLLECTIONS_METADATA = [
  { name: "Hidden India", desc: "Secrets buried in the jungles, forts, and ruins of the subcontinent.", cover: "/images/bhangarh.png" },
  { name: "Lost Kingdoms", desc: "Metropolises and royal centers swallowed by oceans and desert sands.", cover: "/images/dwarka.png" },
  { name: "Mysteries of Nature", desc: "Phenomena that defy standard geological and biological consensus.", cover: "/images/jatinga.png" },
  { name: "Ancient Engineering", desc: "Colossal structures built with technologies lost to time.", cover: "/images/konark.png" }
];

export default function Dashboard({ 
  onStartReading, 
  userName, 
  userSettings, 
  updateSettings, 
  bookmarks, 
  updateBookmarks,
  onAuthSuccess
}: DashboardProps) {
  const [selectedStory, setSelectedStory] = useState<StoryDetail | null>(null);
  
  // Navigation & Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  
  // Search Experience
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<StoryDetail[]>([]);
  const [customSearchTopic, setCustomSearchTopic] = useState("");

  // AI Assistant Tab States
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: "user" | "ai"; text: string; actionStoryId?: string }>>([
    { sender: "ai", text: `Greetings, ${userName}. I am the VELORA Knowledge Oracle. Ask me any historical mystery, space fact, or type a custom topic to generate a fresh premium documentary on-the-fly!` }
  ]);

  // Selected Category/Collection filter in Sub-Views
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | null>(null);
  
  // Daily Features State
  const [daily, setDaily] = useState<any>(null);

  // Stats State
  const [statStories, setStatStories] = useState(0);
  const [statHours, setStatHours] = useState(0.0);
  const [statStreak, setStatStreak] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // Cloud Sync Auth States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  useEffect(() => {
    setIsCloudSynced(apiClient.isOnline && !!apiClient.user);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      let profile;
      if (authMode === "login") {
        profile = await apiClient.login(authEmail, authPassword);
      } else {
        profile = await apiClient.register(authName, authEmail, authPassword);
      }
      setIsCloudSynced(true);
      if (onAuthSuccess) {
        onAuthSuccess(profile);
      }
      setShowAuthModal(false);
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    apiClient.logout();
    setIsCloudSynced(false);
    window.location.reload();
  };

  // Audio Synthesis States & Refs
  const [ambientTheme, setAmbientTheme] = useState<AmbientTheme>("library");
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const themeIntervalRef = useRef<any>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  // Load Daily Features on Mount
  useEffect(() => {
    setDaily(getDailyFeatures());
  }, []);

  // Listen for scroll to toggle navbar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            if (entry.target.id === "stats-panel") {
              setStatsAnimated(true);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const scrollElements = document.querySelectorAll(".reveal-on-scroll");
    scrollElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Stats counting animation loop
  useEffect(() => {
    if (!statsAnimated) return;

    let start = 0;
    const storiesEnd = userSettings.history.length || 6;
    const hoursEnd = Number((storiesEnd * 0.25).toFixed(1)) || 1.5;
    const streakEnd = userSettings.streak || 1;
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStatStories(Math.floor(storiesEnd * progress));
      setStatHours(parseFloat((hoursEnd * progress).toFixed(1)));
      setStatStreak(Math.floor(streakEnd * progress));

      if (step >= steps) {
        setStatStories(storiesEnd);
        setStatHours(hoursEnd);
        setStatStreak(streakEnd);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [statsAnimated, userSettings.history, userSettings.streak]);

  // Search Suggestion logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await apiClient.searchStories(searchQuery);
        setSearchResults(results);
      } catch (e) {
        setSearchResults(naturalLanguageSearch(searchQuery));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Audio mute/theme handling
  useEffect(() => {
    if (isMuted) {
      cleanupAudioNodes();
      return;
    }
    
    initAudioContext();
    startAmbientSynthesis();

    return () => {
      cleanupAudioNodes();
    };
  }, [ambientTheme, isMuted]);

  // Adjust volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const volVal = isMuted ? 0 : volume * 0.15;
      masterGainRef.current.gain.linearRampToValueAtTime(volVal, audioContextRef.current.currentTime + 0.1);
    }
  }, [volume, isMuted]);

  const initAudioContext = () => {
    if (audioContextRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;
  };

  const cleanupAudioNodes = () => {
    if (themeIntervalRef.current) {
      clearInterval(themeIntervalRef.current);
      themeIntervalRef.current = null;
    }
    activeNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  const startAmbientSynthesis = () => {
    cleanupAudioNodes();
    initAudioContext();

    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ambientTheme === "library") {
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "bandpass";
      windFilter.Q.value = 1.8;
      windFilter.frequency.value = 380;
      
      const windGain = ctx.createGain();
      windGain.gain.value = 0.45;

      const noise = createNoiseNode();
      noise.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(master);
      noise.start();
      activeNodesRef.current.push(noise);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 180;
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();
      activeNodesRef.current.push(lfo);

      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = "highpass";
      crackleFilter.frequency.value = 1000;
      
      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0.08;

      const crackleNoise = createNoiseNode();
      crackleNoise.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(master);
      crackleNoise.start();
      activeNodesRef.current.push(crackleNoise);

      themeIntervalRef.current = setInterval(() => {
        playTick(480, 0.02);
      }, 2000);

    } else if (ambientTheme === "space") {
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 45;

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 45.4;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 75;

      const padGain = ctx.createGain();
      padGain.gain.value = 0.8;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(padGain);
      padGain.connect(master);
      
      osc1.start();
      osc2.start();
      activeNodesRef.current.push(osc1, osc2);

      const spaceOsc = ctx.createOscillator();
      spaceOsc.type = "triangle";
      spaceOsc.frequency.value = 135;
      
      const spaceFilter = ctx.createBiquadFilter();
      spaceFilter.type = "bandpass";
      spaceFilter.Q.value = 3.5;
      spaceFilter.frequency.value = 250;

      const spaceGain = ctx.createGain();
      spaceGain.gain.value = 0.15;

      spaceOsc.connect(spaceFilter);
      spaceFilter.connect(spaceGain);
      spaceGain.connect(master);
      spaceOsc.start();
      activeNodesRef.current.push(spaceOsc);

      themeIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.4) {
          const notes = [587.33, 659.25, 783.99, 880.00, 1046.50];
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
          playSineSparkle(randomNote, 0.04);
        }
      }, 2500);

    } else if (ambientTheme === "ancient") {
      const caveFilter = ctx.createBiquadFilter();
      caveFilter.type = "bandpass";
      caveFilter.Q.value = 7.0;
      caveFilter.frequency.value = 160;

      const caveGain = ctx.createGain();
      caveGain.gain.value = 0.65;

      const noise = createNoiseNode();
      noise.connect(caveFilter);
      caveFilter.connect(caveGain);
      caveGain.connect(master);
      noise.start();
      activeNodesRef.current.push(noise);

      themeIntervalRef.current = setInterval(() => {
        const pentatonicScale = [220.00, 246.94, 261.63, 293.66, 329.63, 392.00];
        const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
        playAncientFlute(note);
      }, 4000);

    } else if (ambientTheme === "calm") {
      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = "lowpass";
      waveFilter.frequency.value = 350;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.05;

      const noise = createNoiseNode();
      noise.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(master);
      noise.start();
      activeNodesRef.current.push(noise);

      themeIntervalRef.current = setInterval(() => {
        const randomBell = 900 + Math.random() * 800;
        playSineSparkle(randomBell, 0.02);
      }, 3500);
    }
  };

  const createNoiseNode = () => {
    const ctx = audioContextRef.current;
    if (!ctx) throw new Error("No context");
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  };

  const playTick = (freq: number, vol: number) => {
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  const playSineSparkle = (freq: number, vol: number) => {
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const delay = ctx.createDelay();
    const feedback = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

    delay.delayTime.value = 0.4;
    feedback.gain.value = 0.3;

    osc.connect(gain);
    gain.connect(master);

    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 2.2);
  };

  const playAncientFlute = (freq: number) => {
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.value = 380;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.06, ctx.currentTime + 2.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 4.2);
  };

  const playClickSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx || isMuted) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  // Generate Custom Story from search / oracle input
  const triggerCustomStoryGen = async (topicStr: string) => {
    if (!topicStr.trim()) return;
    playClickSound();
    try {
      const customStory = await apiClient.synthesizeCustomStory(topicStr);
      KNOWLEDGE_DATABASE[customStory.id] = customStory;
      onStartReading(customStory);
    } catch (e) {
      const customStory = generateCustomStory(topicStr);
      KNOWLEDGE_DATABASE[customStory.id] = customStory;
      onStartReading(customStory);
    }
  };

  // Oracle Chat assistant query handler
  const handleAssistantSend = async () => {
    if (!assistantInput.trim()) return;
    const userQuery = assistantInput;
    setAssistantMessages(prev => [...prev, { sender: "user", text: userQuery }]);
    setAssistantInput("");
    playClickSound();

    const q = userQuery.toLowerCase();
    let reply = "";
    let actionStoryId = undefined;

    try {
      if (q.includes("generate") || q.includes("write about") || q.includes("tell me about")) {
        const topic = userQuery.replace(/generate|write about|tell me about|story/gi, "").trim();
        if (topic) {
          const customStory = await apiClient.synthesizeCustomStory(topic);
          KNOWLEDGE_DATABASE[customStory.id] = customStory;
          reply = `I have successfully compiled the story for "${topic}" on the backend server. Click below to begin the cinematic documentary immediately.`;
          actionStoryId = customStory.id;
        } else {
          reply = "Please specify the topic or mystery you would like me to generate.";
        }
      } else {
        const searchHits = await apiClient.searchStories(userQuery);
        if (searchHits.length > 0) {
          const topStory = searchHits[0];
          reply = `I found a matching story in my archives: "${topStory.title.en}". It covers the period of ${topStory.era} with a fact status of ${topStory.factStatus}. Would you like to read this story?`;
          actionStoryId = topStory.id;
        } else {
          reply = `I couldn't find an exact record for "${userQuery}" in my pre-loaded files. I have dynamically synthesized a new documentary on this mystery on the server! Click below to compile it now.`;
          const customStory = await apiClient.synthesizeCustomStory(userQuery);
          KNOWLEDGE_DATABASE[customStory.id] = customStory;
          actionStoryId = customStory.id;
        }
      }
    } catch (e) {
      if (q.includes("generate") || q.includes("write about") || q.includes("tell me about")) {
        const topic = userQuery.replace(/generate|write about|tell me about|story/gi, "").trim();
        const customStory = generateCustomStory(topic || "Unknown");
        KNOWLEDGE_DATABASE[customStory.id] = customStory;
        reply = `[Offline Mode] Compiled the story for "${topic || "Unknown"}" locally. Click below to read.`;
        actionStoryId = customStory.id;
      } else {
        reply = "I had a connection error querying the archives. Let me check my offline logs...";
      }
    }

    setAssistantMessages(prev => [...prev, { sender: "ai", text: reply, actionStoryId }]);
  };

  // Sync highlighting, notes deletes
  const deleteNote = (storyId: string, idx: number) => {
    updateBookmarks(prev => {
      const nextNotes = { ...prev.notes };
      if (nextNotes[storyId]) {
        delete nextNotes[storyId][idx];
        if (Object.keys(nextNotes[storyId]).length === 0) {
          delete nextNotes[storyId];
        }
      }
      return { ...prev, notes: nextNotes };
    });
  };

  const exportNotes = () => {
    const allNotesText = Object.entries(bookmarks.notes).map(([storyId, notesObj]) => {
      const story = getStoryDetail(storyId);
      const notesLines = Object.entries(notesObj).map(([idx, text]) => `- Sentence #${Number(idx) + 1}: "${text}"`).join("\n");
      return `### ${story.title.en}\n${notesLines}`;
    }).join("\n\n");
    
    const blob = new Blob([`# VELORA Reading Notes\n\n${allNotesText || "No saved notes yet."}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "velora_reading_notes.txt";
    a.click();
    URL.revokeObjectURL(url);
    playClickSound();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex flex-col selection:bg-[#e5c158]/30 selection:text-white pb-16 relative">
      
      {/* Background Animated Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[15%] w-[450px] h-[450px] bg-blue-900/10 rounded-full blur-[120px] opacity-80" />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-[75%] left-[25%] w-[380px] h-[380px] bg-amber-900/5 rounded-full blur-[110px] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,rgba(255,255,255,0.15),transparent_100%),radial-gradient(1px_1px_at_80px_140px,rgba(255,255,255,0.1),transparent_100%),radial-gradient(1.5px_1.5px_at_140px_70px,rgba(229,193,88,0.15),transparent_100%)] opacity-70 bg-[size:200px_200px]" />
      </div>

      {/* NAVIGATION BAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${
          isScrolled 
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-8">
          <div 
            onClick={() => { setActiveMenu("home"); playClickSound(); }}
            className="flex flex-col items-start cursor-pointer group"
          >
            <span 
              className="text-2xl font-light tracking-[0.2em] text-white group-hover:text-[#e5c158] transition-colors"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              VELORA
            </span>
            <span className="text-[8px] uppercase tracking-[0.15em] text-[#e5c158] font-semibold -mt-1 opacity-80">
              AI Story Engine
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-light text-zinc-400">
            {["home", "discover", "categories", "trending", "collections", "bookmarks", "AI Assistant"].map((item) => (
              <button
                key={item}
                onClick={() => { 
                  setActiveMenu(item); 
                  setSelectedCategoryFilter(null);
                  setSelectedCollectionFilter(null);
                  playClickSound(); 
                }}
                className={`hover:text-white transition-colors capitalize py-1 relative ${
                  activeMenu === item ? "text-white font-medium" : ""
                }`}
              >
                {item === "home" ? "Home Feed" : item}
                {activeMenu === item && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#e5c158]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 relative">
          
          {/* Natural Language Search bar */}
          <div className="relative">
            <div 
              className={`flex items-center bg-white/5 border rounded-full py-1.5 px-3.5 transition-all duration-500 ease-out shadow-inner ${
                isSearchFocused || searchQuery 
                  ? "w-64 md:w-72 border-[#e5c158]/50 bg-white/10" 
                  : "w-40 md:w-48 border-white/10"
              }`}
            >
              <Search className="text-zinc-500 mr-2 shrink-0" size={13} />
              <input
                type="text"
                placeholder="Search Forts, Science, temples..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs font-light text-white placeholder-zinc-500 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={12} className="text-zinc-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {(isSearchFocused || searchQuery) && searchResults.length > 0 && (
              <div className="absolute top-11 right-0 w-80 bg-[#090a10] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-fade-in flex flex-col gap-2 max-h-[300px] overflow-y-auto z-50">
                <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-2 pb-1 border-b border-white/5">
                  Knowledge Archives ({searchResults.length})
                </span>
                {searchResults.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => {
                      setSelectedStory(story);
                      playClickSound();
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={story.image}
                        alt={story.title.en}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-light text-white truncate group-hover:text-[#e5c158] transition-colors">
                        {story.title[userSettings.lang] || story.title.en}
                      </h4>
                      <p className="text-[9px] text-zinc-400 mt-0.5 truncate">
                        {story.era} • {story.category}
                      </p>
                    </div>
                    <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-zinc-400 group-hover:border-[#e5c158] group-hover:text-white transition-all shrink-0">
                      Explore
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cloud Sync Auth Controls */}
          <div className="flex items-center gap-3">
            {isCloudSynced ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#e5c158] hidden sm:inline font-mono">
                  {userName}
                </span>
                <div 
                  onClick={handleSignOut}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-950/40 to-emerald-900/40 border border-emerald-500/30 flex items-center justify-center cursor-pointer hover:border-red-500/50 transition-colors"
                  title="Sign Out / Disconnect Cloud"
                >
                  <User size={12} className="text-emerald-400 hover:text-red-400 transition-colors" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setShowAuthModal(true); playClickSound(); }}
                className="bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black font-semibold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full hover:shadow-[0_0_10px_rgba(229,193,88,0.2)] transition-all flex items-center gap-1"
                title="Connect Cloud Sync"
              >
                Sync to Cloud
              </button>
            )}
          </div>

        </div>
      </header>

      {/* AMBIENT SOUNDS HUD */}
      <div className="fixed bottom-6 right-6 z-40 bg-[#0c0d14]/85 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex flex-col gap-3 min-w-[200px] hover:border-[#e5c158]/30 transition-colors">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Music size={13} className="text-[#e5c158]" />
            <span>Atmospheric Sound</span>
          </div>
          <button
            onClick={() => { setIsMuted(!isMuted); playClickSound(); }}
            className={`p-1.5 rounded-full focus:outline-none transition-all ${
              isMuted 
                ? "bg-red-950/40 border border-red-500/25 text-red-400" 
                : "bg-blue-950/40 border border-blue-500/25 text-blue-400"
            }`}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["library", "space", "ancient", "calm"] as AmbientTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => {
                if (isMuted) setIsMuted(false);
                setAmbientTheme(theme);
                playClickSound();
              }}
              className={`text-[10px] uppercase font-semibold tracking-wider py-1.5 rounded-lg border text-center transition-all ${
                ambientTheme === theme && !isMuted
                  ? "bg-[#e5c158] border-[#e5c158] text-[#050505]"
                  : "bg-white/5 border-white/5 hover:border-white/15 text-zinc-400"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[9px] text-zinc-500">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
          />
        </div>
      </div>

      {/* DYNAMIC VIEWS CONTROLLER */}
      <main className="flex-1 mt-24 px-6 md:px-12 w-full max-w-7xl mx-auto z-10 relative">

        {/* 1. HOME TAB */}
        {activeMenu === "home" && (
          <div className="space-y-20">
            
            {/* HERO HERO HERO */}
            {daily && daily.storyOfTheDay && (
              <section 
                onClick={() => { setSelectedStory(daily.storyOfTheDay); playClickSound(); }}
                className="relative w-full min-h-[420px] rounded-3xl overflow-hidden border border-white/5 hover:border-[#e5c158]/30 flex flex-col justify-end p-8 md:p-12 shadow-2xl group cursor-pointer transition-all duration-500 scale-up-entry"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={daily.storyOfTheDay.image}
                    alt={daily.storyOfTheDay.title.en}
                    fill
                    priority
                    className="object-cover scale-[1.03] group-hover:scale-105 transition-transform duration-10000 brightness-[0.35]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 max-w-2xl space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#e5c158]/10 border border-[#e5c158]/30 text-[#e5c158] text-[9px] uppercase tracking-[0.25em] px-3.5 py-1 rounded-full font-bold">
                      {daily.storyOfTheDay.category}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Clock size={11} /> {daily.storyOfTheDay.duration} Read
                    </span>
                  </div>
                  <h1 
                    className="text-4xl md:text-5xl font-light text-white tracking-wide"
                    style={{ fontFamily: "Cinzel, serif" }}
                  >
                    {daily.storyOfTheDay.title[userSettings.lang] || daily.storyOfTheDay.title.en}
                  </h1>
                  <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
                    {daily.storyOfTheDay.synopsis[userSettings.lang] || daily.storyOfTheDay.synopsis.en}
                  </p>
                  <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl max-w-sm text-[11px] text-zinc-400">
                    <span className="text-[#e5c158] font-bold uppercase tracking-wider block text-[9px]">FACT CLASSIFICATION</span>
                    {daily.storyOfTheDay.factLabel} ({daily.storyOfTheDay.factStatus})
                  </div>
                </div>
              </section>
            )}

            {/* DAILY FEATURES BANNER ROW */}
            {daily && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Event of Day */}
                <div className="bg-gradient-to-br from-indigo-950/20 to-transparent border border-indigo-500/10 p-5 rounded-2xl text-left space-y-2">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">Historical Event of the Day</span>
                  <h4 className="text-xs font-semibold text-white">{daily.eventOfTheDay.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-normal font-light">{daily.eventOfTheDay.event}</p>
                </div>

                {/* Science Discovery of Day */}
                <div className="bg-gradient-to-br from-sky-950/20 to-transparent border border-sky-500/10 p-5 rounded-2xl text-left space-y-2">
                  <span className="text-[10px] text-sky-400 uppercase tracking-wider font-bold">Science Discovery of the Day</span>
                  <h4 className="text-xs font-semibold text-white">{daily.scienceOfTheDay.topic}</h4>
                  <p className="text-[11px] text-zinc-400 leading-normal font-light">{daily.scienceOfTheDay.text}</p>
                </div>

                {/* Random Mystery */}
                <div 
                  onClick={() => { setSelectedStory(daily.randomMystery); playClickSound(); }}
                  className="bg-gradient-to-br from-amber-950/20 to-transparent border border-amber-500/10 p-5 rounded-2xl text-left space-y-2 cursor-pointer hover:border-amber-500/40 transition-colors"
                >
                  <span className="text-[10px] text-[#e5c158] uppercase tracking-wider font-bold">Spotlight Random Mystery</span>
                  <h4 className="text-xs font-semibold text-white">{daily.randomMystery.title[userSettings.lang] || daily.randomMystery.title.en}</h4>
                  <p className="text-[11px] text-zinc-400 truncate font-light">{daily.randomMystery.subtitle.en}</p>
                  <span className="text-[9px] text-[#e5c158] flex items-center gap-1 font-semibold pt-1">Explore Now <ChevronRight size={10} /></span>
                </div>

              </section>
            )}

            {/* CONTINUE READING */}
            {userSettings.history.length > 0 && (
              <section className="space-y-4 text-left">
                <h2 className="text-xl font-light uppercase tracking-widest text-zinc-300" style={{ fontFamily: "Cinzel, serif" }}>
                  Continue Journeys
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userSettings.history.slice(0, 2).map((storyId) => {
                    const story = getStoryDetail(storyId);
                    return (
                      <div
                        key={story.id}
                        onClick={() => { onStartReading(story); playClickSound(); }}
                        className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                          <div className="space-y-0.5">
                            <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{story.category}</span>
                            <h3 className="text-xs font-semibold text-white truncate group-hover:text-[#e5c158] transition-colors">
                              {story.title[userSettings.lang] || story.title.en}
                            </h3>
                            <p className="text-[10px] text-zinc-500">{story.era}</p>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-[#e5c158] h-1 rounded-full w-2/3" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ALL STORIES FEED */}
            <section className="space-y-6 text-left">
              <h2 className="text-2xl font-light tracking-wider" style={{ fontFamily: "Cinzel, serif" }}>
                Primary Knowledge Feed
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(KNOWLEDGE_DATABASE).map((story) => (
                  <div
                    key={story.id}
                    onClick={() => { setSelectedStory(story); playClickSound(); }}
                    className="bg-[#0b0c11] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e5c158]/40 group cursor-pointer transition-all duration-300 flex flex-col"
                  >
                    <div className="relative w-full h-40 bg-zinc-950">
                      <Image src={story.image} alt={story.title.en} fill className="object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] uppercase tracking-wider text-white">
                        {story.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] text-white flex items-center gap-1">
                        <Star size={9} className="text-[#e5c158] fill-[#e5c158]" /> {story.factLabel}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                          {story.title[userSettings.lang] || story.title.en}
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-light line-clamp-2 leading-relaxed">
                          {story.synopsis[userSettings.lang] || story.synopsis.en}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-white/5 pt-2">
                        <span>{story.era}</span>
                        <span>{story.duration} Read</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* READING STATISTICS PANEL */}
            <section id="stats-panel" ref={statsSectionRef} className="reveal-on-scroll">
              <div className="bg-[#0c0d14] border border-white/5 rounded-3xl p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Journeys Explored</span>
                  <span className="text-3xl sm:text-4xl font-extralight text-white block">{statStories}</span>
                  <span className="text-[9px] text-[#e5c158] font-semibold tracking-wider flex items-center justify-center gap-1">
                    <Award size={10} /> Knowledge Base
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Hours Invested</span>
                  <span className="text-3xl sm:text-4xl font-extralight text-white block">{statHours} hrs</span>
                  <span className="text-[9px] text-[#0088ff] font-semibold tracking-wider flex items-center justify-center gap-1">
                    <Clock size={10} /> Active Reading
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Preferred Domain</span>
                  <span className="text-sm sm:text-base font-light text-white tracking-wide py-1 block">
                    {userSettings.favoriteCategory}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-light block">Calculated from history</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">Reading Streak</span>
                  <span className="text-3xl sm:text-4xl font-extralight text-[#e5c158] block">{statStreak} Days</span>
                  <span className="text-[9px] text-zinc-500 font-semibold flex items-center justify-center gap-1">
                    <Flame size={10} className="text-amber-500" /> Keep it going!
                  </span>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* 2. DISCOVER TAB */}
        {activeMenu === "discover" && (
          <div className="space-y-10 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Search & Synthesis Hub</h2>
              <p className="text-xs text-zinc-400 font-light max-w-xl leading-relaxed">
                Query our structured databases with natural language (e.g. "Mysteries in Rajasthan") or input a custom topic to generate a premium original documentary on-the-fly.
              </p>
            </div>

            {/* Custom Story Gen Input Block */}
            <div className="bg-[#0c0d14] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles size={16} className="text-[#e5c158] animate-pulse" />
                <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Create Custom Documentary Story</h3>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-zinc-400 font-light">
                  Type any historical mystery, space paradox, or landmark (e.g. "Taj Mahal secrets", "Bermuda Triangle", "The Great Pyramids") and watch the AI synthesize a 1000-word structured documentary.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter custom topic name..."
                    value={customSearchTopic}
                    onChange={(e) => setCustomSearchTopic(e.target.value)}
                    className="bg-white/5 border border-white/10 focus:border-[#e5c158]/40 px-4 py-3 rounded-xl text-xs text-white focus:outline-none flex-1"
                  />
                  <button
                    onClick={() => triggerCustomStoryGen(customSearchTopic)}
                    className="bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(229,193,88,0.25)] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    Generate Story <Sparkles size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions buttons */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Natural Queries Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {["Mysteries in Rajasthan", "Ancient temples", "Indian archaeological discoveries", "Black holes explained simply"].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSearchQuery(q); setActiveMenu("discover"); }}
                    className="bg-white/5 border border-white/10 hover:border-[#e5c158] text-xs font-light px-3 py-1.5 rounded-lg hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom search query search feed */}
            {searchQuery && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-400 block font-light">Search Results for "{searchQuery}":</span>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResults.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => { setSelectedStory(story); playClickSound(); }}
                        className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-[#e5c158]/30 group cursor-pointer transition-colors"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{story.category}</span>
                            <h4 className="text-xs font-semibold text-white group-hover:text-[#e5c158] truncate">
                              {story.title[userSettings.lang] || story.title.en}
                            </h4>
                            <p className="text-[10px] text-zinc-400 font-light truncate">{story.subtitle.en}</p>
                          </div>
                          <span className="text-[9px] text-[#e5c158] font-bold block pt-1">{story.factLabel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center space-y-4">
                    <p className="text-xs text-zinc-400 font-light">No matching pre-loaded stories found in the files.</p>
                    <button
                      onClick={() => triggerCustomStoryGen(searchQuery)}
                      className="bg-white/5 border border-white/10 hover:border-[#e5c158]/50 text-white text-xs px-4 py-2 rounded-xl"
                    >
                      Synthesize original story for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. CATEGORIES TAB */}
        {activeMenu === "categories" && (
          <div className="space-y-10 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Knowledge Domains</h2>
              <p className="text-xs text-zinc-400 font-light max-w-xl">
                Filter and browse stories by specific educational disciplines.
              </p>
            </div>

            {/* Categories Selection list */}
            {!selectedCategoryFilter ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedCategoryFilter(cat.name); playClickSound(); }}
                    className={`bg-gradient-to-br ${cat.color} border p-5 rounded-2xl flex flex-col justify-between min-h-[120px] group cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-md`}
                  >
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400">Sphere</span>
                    <h3 className="text-base font-light text-white tracking-wide group-hover:text-[#e5c158] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedCategoryFilter(null)} 
                    className="text-xs text-zinc-500 hover:text-white"
                  >
                    ◀ All Categories
                  </button>
                  <span className="text-sm font-semibold text-white">/ {selectedCategoryFilter}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(KNOWLEDGE_DATABASE).filter(s => s.category === selectedCategoryFilter).map(story => (
                    <div
                      key={story.id}
                      onClick={() => { setSelectedStory(story); playClickSound(); }}
                      className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                        <div>
                          <h3 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                            {story.title[userSettings.lang] || story.title.en}
                          </h3>
                          <p className="text-[10px] text-zinc-400 font-light truncate">{story.subtitle.en}</p>
                        </div>
                        <span className="text-[9px] text-[#e5c158] block pt-1">{story.factLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. TRENDING TAB */}
        {activeMenu === "trending" && (
          <div className="space-y-8 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Trending Narratives</h2>
              <p className="text-xs text-zinc-400 font-light">
                Popular historical investigations currently trending among the readers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(KNOWLEDGE_DATABASE).map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => { setSelectedStory(story); playClickSound(); }}
                  className="bg-[#0b0c11] border border-white/5 rounded-3xl overflow-hidden hover:border-[#e5c158]/30 group cursor-pointer transition-all duration-300 flex"
                >
                  <div className="relative w-1/3 min-h-[160px] bg-zinc-950 shrink-0">
                    <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">{story.category}</span>
                        <span className="text-[12px] font-bold text-white/20">#0{idx+1}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                        {story.title[userSettings.lang] || story.title.en}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {story.synopsis[userSettings.lang] || story.synopsis.en}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-white/5 pt-2">
                      <span>{story.era}</span>
                      <span className="text-[#e5c158] font-bold">{story.factLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. COLLECTIONS TAB */}
        {activeMenu === "collections" && (
          <div className="space-y-10 text-left scale-up-entry">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Curated Collections</h2>
              <p className="text-xs text-zinc-400 font-light">
                Thematic groupings of stories spanning civilizations, space, and legends.
              </p>
            </div>

            {!selectedCollectionFilter ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {COLLECTIONS_METADATA.map((col, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedCollectionFilter(col.name); playClickSound(); }}
                    className="bg-[#0b0c11] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e5c158]/30 group cursor-pointer transition-all duration-300 shadow-lg"
                  >
                    <div className="relative w-full h-36 bg-zinc-950">
                      <Image src={col.cover} alt={col.name} fill className="object-cover brightness-[0.7]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c11] via-transparent to-transparent" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-light tracking-wide text-white group-hover:text-[#e5c158] transition-colors leading-tight">
                        {col.name}
                      </h3>
                      <p className="text-[10px] font-light text-zinc-400 leading-normal">
                        {col.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedCollectionFilter(null)} 
                    className="text-xs text-zinc-500 hover:text-white"
                  >
                    ◀ All Collections
                  </button>
                  <span className="text-sm font-semibold text-white">/ {selectedCollectionFilter}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(KNOWLEDGE_DATABASE).filter(s => {
                    // Simple collection mapping check
                    if (selectedCollectionFilter === "Hidden India") return s.id === "dwarka" || s.id === "bhangarh" || s.id === "roopkund";
                    if (selectedCollectionFilter === "Lost Kingdoms") return s.id === "dwarka" || s.id === "konark";
                    if (selectedCollectionFilter === "Mysteries of Nature") return s.id === "jatinga" || s.id === "roopkund";
                    if (selectedCollectionFilter === "Ancient Engineering") return s.id === "konark" || s.id === "antikythera";
                    return true;
                  }).map(story => (
                    <div
                      key={story.id}
                      onClick={() => { setSelectedStory(story); playClickSound(); }}
                      className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                        <div>
                          <h3 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                            {story.title[userSettings.lang] || story.title.en}
                          </h3>
                          <p className="text-[10px] text-zinc-400 font-light truncate">{story.subtitle.en}</p>
                        </div>
                        <span className="text-[9px] text-[#e5c158] block pt-1">{story.factLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. BOOKMARKS & NOTES TAB */}
        {activeMenu === "bookmarks" && (
          <div className="space-y-10 text-left scale-up-entry">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-light tracking-wide text-white" style={{ fontFamily: "Cinzel, serif" }}>Bookmark Intelligence</h2>
                <p className="text-xs text-zinc-400 font-light">Your saved records, custom highlights, and personal research notes.</p>
              </div>
              {Object.keys(bookmarks.notes).length > 0 && (
                <button
                  onClick={exportNotes}
                  className="bg-white/5 border border-white/10 hover:border-[#e5c158] text-[11px] font-semibold tracking-wider text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition-all"
                >
                  Export Research Notes
                </button>
              )}
            </div>

            {/* Bookmarked stories */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Bookmarked Journeys</h3>
              {bookmarks.bookmarkedIds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarks.bookmarkedIds.map(storyId => {
                    const story = getStoryDetail(storyId);
                    return (
                      <div
                        key={story.id}
                        onClick={() => { setSelectedStory(story); playClickSound(); }}
                        className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <Image src={story.image} alt={story.title.en} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                          <div>
                            <h3 className="text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors truncate">
                              {story.title[userSettings.lang] || story.title.en}
                            </h3>
                            <p className="text-[10px] text-zinc-400 font-light truncate">{story.subtitle.en}</p>
                          </div>
                          <span className="text-[9px] text-[#e5c158] block pt-1">{story.factLabel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No bookmarked stories yet. Open a story and click the bookmark icon to save it.</p>
              )}
            </div>

            {/* Notes list */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Personal Research Notes</h3>
              {Object.keys(bookmarks.notes).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(bookmarks.notes).map(([storyId, notesObj]) => {
                    const story = getStoryDetail(storyId);
                    return (
                      <div key={storyId} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-[#e5c158]">{story.title.en}</span>
                          <span className="text-[9px] text-zinc-500 font-light">{story.category}</span>
                        </div>
                        <div className="space-y-3">
                          {Object.entries(notesObj).map(([idx, noteText]) => (
                            <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-start gap-4">
                              <div className="space-y-1 text-xs">
                                <span className="text-[9px] text-blue-400 font-semibold">Sentence #{Number(idx) + 1} Note</span>
                                <p className="text-zinc-300 font-light">"{noteText}"</p>
                              </div>
                              <button 
                                onClick={() => deleteNote(storyId, Number(idx))}
                                className="text-zinc-500 hover:text-red-400 transition-colors text-[10px]"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No saved notes. Double-click or click sentences inside the reader to write notes.</p>
              )}
            </div>

          </div>
        )}

        {/* 7. AI ASSISTANT ORACLE TAB */}
        {activeMenu === "AI Assistant" && (
          <div className="max-w-3xl mx-auto space-y-6 text-left scale-up-entry">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <h2 className="text-3xl font-light tracking-wide text-white flex items-center gap-2" style={{ fontFamily: "Cinzel, serif" }}>
                <Sparkles className="text-[#0088ff] animate-pulse" />
                <span>VELORA Knowledge Assistant</span>
              </h2>
              <p className="text-xs text-zinc-400 font-light">
                Ask about historical timelines, scientific views, local legends, or write a custom topic to generate a documentary on it!
              </p>
            </div>

            {/* Conversational Box */}
            <div className="bg-[#0c0d14] border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 h-[420px]">
              
              {/* Message log */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
                {assistantMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <span className={`text-[9px] uppercase tracking-wider ${msg.sender === "user" ? "text-zinc-500" : "text-[#0088ff] font-bold"}`}>
                      {msg.sender === "user" ? "You" : "VELORA ORACLE"}
                    </span>
                    <div className={`p-3 rounded-2xl max-w-[85%] font-light leading-relaxed text-xs ${
                      msg.sender === "user" 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none shadow-md"
                    }`}>
                      {msg.text}
                      
                      {/* Interactive dynamic generation start reading trigger button */}
                      {msg.actionStoryId && (
                        <button
                          onClick={() => {
                            const storyObj = getStoryDetail(msg.actionStoryId!);
                            onStartReading(storyObj);
                            playClickSound();
                          }}
                          className="mt-3 bg-gradient-to-r from-[#e5c158] to-[#c29e37] text-black font-bold uppercase tracking-wider text-[9px] px-4 py-2 rounded-lg block hover:shadow-[0_2px_10px_rgba(229,193,88,0.3)] transition-all"
                        >
                          Begin Cinematic Reading
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input widgets */}
              <div className="flex gap-2.5 border-t border-white/5 pt-4">
                <input
                  type="text"
                  placeholder="Ask a question or type 'Generate Taj Mahal Secrets'..."
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAssistantSend(); }}
                  className="bg-white/5 border border-white/10 focus:border-[#0088ff]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none flex-1 shadow-inner"
                />
                <button
                  onClick={handleAssistantSend}
                  className="bg-[#0088ff] hover:bg-blue-600 text-white p-3 rounded-xl active:scale-[0.98] transition-all"
                >
                  <Send size={15} />
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* STORY DETAILS OVERLAY MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#090a10] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(229,193,88,0.15)] flex flex-col md:flex-row max-h-[90vh]">
            
            <button
              onClick={() => { setSelectedStory(null); playClickSound(); }}
              className="absolute top-4 right-4 z-50 bg-black/50 border border-white/10 text-zinc-300 hover:text-white p-2 rounded-full backdrop-blur-md"
            >
              <X size={16} />
            </button>

            {/* Image banner */}
            <div className="relative w-full md:w-5/12 h-60 md:h-auto min-h-[250px] bg-zinc-950">
              <Image
                src={selectedStory.image || "/images/roopkund.png"}
                alt={selectedStory.title.en}
                fill
                className="object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#090a10]/60 md:to-[#090a10]" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-2 md:bottom-12 md:left-8">
                <span className="bg-[#e5c158]/20 border border-[#e5c158]/40 text-[#e5c158] text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                  {selectedStory.category}
                </span>
                <h2 
                  className="text-2xl sm:text-3xl font-light text-white leading-tight pt-1"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {selectedStory.title[userSettings.lang] || selectedStory.title.en}
                </h2>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 pt-1">
                  <span>{selectedStory.era}</span>
                  <span>•</span>
                  <span>{selectedStory.duration}</span>
                </div>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase text-[#e5c158] font-bold tracking-[0.2em]">Synopsis</h4>
                <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
                  {selectedStory.synopsis[userSettings.lang] || selectedStory.synopsis.en}
                </p>
              </div>

              {/* Fact Classification */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                <div className="text-xs text-[#e5c158] font-medium flex items-center gap-2">
                  <Star size={12} className="fill-[#e5c158]" />
                  <span>Fact Check Label: {selectedStory.factLabel}</span>
                </div>
                <p className="text-zinc-400 text-xs font-light">
                  Status: {selectedStory.factStatus}
                </p>
              </div>

              {/* Reading Insights */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2 text-xs">
                <span className="text-[#0088ff] font-bold uppercase tracking-wider text-[9px] block">AI Reading Insights</span>
                <div className="grid grid-cols-2 gap-3 font-light text-zinc-400">
                  <div><strong>Difficulty Level:</strong> {selectedStory.difficulty}</div>
                  <div><strong>Knowledge Level:</strong> {selectedStory.knowledgeLevel}</div>
                  <div className="col-span-2">
                    <strong>Learning Objectives:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                      {selectedStory.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj[userSettings.lang] || obj.en}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Topics & tags */}
              <div className="flex flex-wrap gap-2">
                {selectedStory.relatedTopics.map((tag, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 text-zinc-400 text-[10px] px-2.5 py-1 rounded-md font-light">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Voice select and Start reading button */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-white flex items-center gap-1.5">
                      <Headphones size={13} className="text-[#0088ff]" />
                      <span>Preferred Reader Language</span>
                    </h5>
                  </div>
                  <select 
                    value={userSettings.lang}
                    onChange={(e) => updateSettings({ lang: e.target.value as any })}
                    className="bg-[#050505] border border-white/10 rounded-md text-xs font-light text-zinc-300 px-3 py-1.5 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    onStartReading(selectedStory);
                    setSelectedStory(null);
                  }}
                  className="w-full bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-black text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_5px_15px_rgba(229,193,88,0.3)] transition-all active:scale-[0.99]"
                >
                  <Play size={14} fill="currentColor" /> Start Cinematic Reading
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CLOUD SYNC AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#0b0c12] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl space-y-6 text-left">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-[#e5c158] uppercase font-bold tracking-widest block">Secure Connect</span>
              <h3 className="text-xl font-light text-white tracking-wide uppercase" style={{ fontFamily: "Cinzel, serif" }}>
                {authMode === "login" ? "Welcome back" : "Create Account"}
              </h3>
              <p className="text-xs text-zinc-500 font-light">
                {authMode === "login" ? "Sign in to synchronize your reading streaks & notes" : "Register to back up your personal library in the cloud"}
              </p>
            </div>

            {authError && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs px-3 py-2.5 rounded-xl font-light">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-zinc-300">
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#e5c158]/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-white"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e5c158]/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e5c158]/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-white"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#0088ff] hover:bg-blue-500 disabled:bg-zinc-700 text-white text-xs font-semibold py-3 rounded-xl shadow-lg transition-colors pt-2.5"
              >
                {authLoading ? "Synchronizing..." : authMode === "login" ? "Sign In & Sync" : "Create Account & Sync"}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthError("");
                }}
                className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider"
              >
                {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
