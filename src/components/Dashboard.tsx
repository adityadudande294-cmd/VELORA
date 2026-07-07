"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Play, BookOpen, Search, Clock, Sparkles, Volume2, VolumeX, User, 
  ChevronRight, X, Headphones, Globe, ArrowRight, Settings, Bell, 
  Flame, Award, Compass, Heart, Bookmark, Eye, HelpCircle, Star, Music 
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
  progress?: number; // percentage completed
  timeLeft?: string; // time left for continue reading
}

const ALL_STORIES: Story[] = [
  {
    id: "dwarka",
    title: "Dwarka: Undersea Secrets",
    category: "Archaeology",
    duration: "18 mins",
    image: "/images/dwarka.png",
    tags: ["Ancient India", "Submerged City", "Legends"],
    synopsis: "Deep beneath the Gulf of Khambhat lie the stone remains of a colossal grid-like city. Is this the legendary city of Dwarka spoken of in ancient Sanskrit epics? Join marine archaeologists as they map massive stone walls, anchors, and artifacts to uncover a lost chapter of human civilization dating back thousands of years.",
    archaeologicalNotes: "Carbon dating of wood samples recovered from the site suggests the area could be over 9,000 years old, challenging current timelines of urban development.",
    era: "c. 7500 BCE",
    factStatus: "90% Archaeological Evidence, 10% Epic Folklore",
    popularity: "9.8",
    progress: 65,
    timeLeft: "6 mins left"
  },
  {
    id: "roopkund",
    title: "Roopkund: The Skeleton Lake",
    category: "Indian Mysteries",
    duration: "15 mins",
    image: "/images/roopkund.png",
    tags: ["Himalayas", "Archaeology", "Unexplained"],
    synopsis: "High in the freezing peaks of the Himalayas, Roopkund Lake holds the bones of hundreds of ancient travelers. DNA analysis reveals a shocking truth: these people died in a single event, separated by centuries and originating from entirely different parts of the world. What drew them to this desolate altitude, and how did they meet their end?",
    archaeologicalNotes: "Recent genetic studies published in Nature show that the skeleton remains belong to three distinct genetic groups, including Mediterranean Europeans, who died in a sudden hailstorm around 800 CE.",
    era: "c. 800 CE",
    factStatus: "95% DNA Verified, 5% Mountain Legend",
    popularity: "9.7",
    progress: 25,
    timeLeft: "11 mins left"
  },
  {
    id: "antikythera",
    title: "The Antikythera Mechanism",
    category: "Ancient Science",
    duration: "16 mins",
    image: "/images/antikythera.png",
    tags: ["Ancient Computers", "Astronomy", "Greek Shipwrecks"],
    synopsis: "Discovered in a Roman shipwreck off Greece, a lump of corroded bronze lay ignored until researchers exposed a maze of interlocking gears. Rebuild the world's oldest analog computer, built to track eclipses, planetary movements, and the quadrennial cycle of the Olympic games.",
    archaeologicalNotes: "X-ray imaging has revealed over 30 gearwheels and thousands of Greek characters inscribed on the device's bronze plates, indicating a level of technology that did not reappear for another 1,500 years.",
    era: "c. 150 BCE",
    factStatus: "100% Scientific Record",
    popularity: "9.6"
  },
  {
    id: "jatinga",
    title: "Jatinga: The Bird Phenomenon",
    category: "Unexplained Phenomena",
    duration: "12 mins",
    image: "/images/jatinga.png",
    tags: ["Assam", "Ornithology", "Atmosphere"],
    synopsis: "In a small valley in Assam, during foggy monsoon nights, hundreds of migratory birds plunge from the sky, disoriented and crashing into lights and buildings. Explore the atmospheric anomalies, electromagnetic sweeps, and behavioral biology behind this tragic bird phenomenon.",
    archaeologicalNotes: "Scientists suggest that high-velocity winds, combined with heavy fog and light sources in the village, disorient the birds, causing them to fly towards the lights in search of shelter.",
    era: "Ongoing",
    factStatus: "75% Scientific Hypothesis, 25% Local Lore",
    popularity: "9.4"
  },
  {
    id: "konark",
    title: "Konark: Wheels of Time",
    category: "Ancient Engineering",
    duration: "14 mins",
    image: "/images/konark.png",
    tags: ["Odisha", "Solar Alignment", "Sun Temple"],
    synopsis: "The Sun Temple of Konark is built as a colossal stone chariot with 24 intricately carved wheels. Discover how these wheels act as highly accurate sundials, calculating time down to the exact minute by the shadow cast by the hub.",
    archaeologicalNotes: "The temple is aligned so that the first rays of the sun strike the main entrance, highlighting sophisticated astronomical calculation in 13th-century Indian architecture.",
    era: "c. 1250 CE",
    factStatus: "100% Historical Monuments Record",
    popularity: "9.5"
  },
  {
    id: "blackhole",
    title: "Accretion: Inside Black Holes",
    category: "Space & Science",
    duration: "22 mins",
    image: "/images/blackhole.png",
    tags: ["Astrophysics", "General Relativity", "Cosmos"],
    synopsis: "Peer beyond the event horizon where space and time warp into an infinite singularity. Track the searing plasma of accretion disks, light bending in cosmic lenses, and Hawking radiation slowly bleeding heat from the universe's most absolute monsters.",
    archaeologicalNotes: "First direct visual proof of black holes was captured in 2019 by the Event Horizon Telescope, confirming Einstein's general relativity models with extreme precision.",
    era: "Universal",
    factStatus: "100% Astrophysical Consensus",
    popularity: "9.9"
  },
  {
    id: "bhangarh",
    title: "Bhangarh: The Cursed Ruins",
    category: "Indian Mysteries",
    duration: "14 mins",
    image: "/images/bhangarh.png",
    tags: ["History", "Folklore", "Haunted"],
    synopsis: "Within the Sariska Tiger Reserve sits the 17th-century Bhangarh Fort. Abandoned overnight, locals believe a wizard's curse keeps the city barren. Walk through the empty markets, the majestic royal palace, and temples to explore the tragic history and legends of the most haunted place in India.",
    archaeologicalNotes: "The Archaeological Survey of India (ASI) has placed a sign forbidding entry between sunset and sunrise, a rare governmental acknowledgment of local folklore.",
    era: "1613 CE",
    factStatus: "40% Historical Fact, 60% Local Myth",
    popularity: "9.5"
  }
];

const CATEGORIES = [
  { name: "Indian Mysteries", count: 18, color: "from-amber-600/30 to-[#e5c158]/5 border-amber-500/20" },
  { name: "Ancient India", count: 24, color: "from-yellow-600/30 to-[#e5c158]/5 border-yellow-500/20" },
  { name: "History", count: 32, color: "from-blue-600/30 to-[#0088ff]/5 border-blue-500/20" },
  { name: "Archaeology", count: 15, color: "from-indigo-600/30 to-indigo-500/5 border-indigo-500/20" },
  { name: "Science & Space", count: 28, color: "from-sky-600/30 to-[#0088ff]/5 border-sky-500/20" },
  { name: "Civilizations", count: 19, color: "from-cyan-600/30 to-cyan-500/5 border-cyan-500/20" },
  { name: "Legends & Folklore", count: 22, color: "from-red-600/30 to-red-500/5 border-red-500/20" },
  { name: "Unexplained", count: 11, color: "from-purple-600/30 to-purple-500/5 border-purple-500/20" }
];

const COLLECTIONS = [
  { name: "Hidden India", desc: "Secrets buried in the jungles, forts, and ruins of the subcontinent.", cover: "/images/bhangarh.png" },
  { name: "Lost Kingdoms", desc: "Metropolises and royal centers swallowed by oceans and desert sands.", cover: "/images/dwarka.png" },
  { name: "Mysteries of Nature", desc: "Phenomena that defy standard geological and biological consensus.", cover: "/images/jatinga.png" },
  { name: "Ancient Engineering", desc: "Colossal structures built with technologies lost to time.", cover: "/images/konark.png" }
];

type AmbientTheme = "library" | "space" | "ancient" | "calm";

interface DashboardProps {
  onStartReading: (story: Story) => void;
}

export default function Dashboard({ onStartReading }: DashboardProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  // Navigation & Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  
  // Search Experience
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Story[]>([]);
  
  // Stats State
  const [statStories, setStatStories] = useState(0);
  const [statHours, setStatHours] = useState(0.0);
  const [statStreak, setStatStreak] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // Audio Synthesis States & Refs
  const [ambientTheme, setAmbientTheme] = useState<AmbientTheme>("library");
  const [isMuted, setIsMuted] = useState(true); // Default muted to let user trigger
  const [volume, setVolume] = useState(0.6);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const themeIntervalRef = useRef<any>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

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
            // If the stats section is intersected, animate stats counter
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
    const storiesEnd = 24;
    const hoursEnd = 15.8;
    const streakEnd = 7;
    const duration = 2000; // 2 seconds
    const steps = 60;
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
  }, [statsAnimated]);

  // Search Suggestion logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = ALL_STORIES.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  // Handle ambient theme synthesis initialization & transition
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
      const volVal = isMuted ? 0 : volume * 0.15; // soft overall volume scale
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
      // 1. Cozy Wind Sweep
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

      // Low LFO to sweep wind
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06; // super slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 180;
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();
      activeNodesRef.current.push(lfo);

      // 2. Vinyl/Paper Crackle node
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

      // Random impulse sweeps representing crackles
      const crackleLFO = ctx.createOscillator();
      crackleLFO.type = "sawtooth";
      crackleLFO.frequency.value = 8;
      const crackleLFOGain = ctx.createGain();
      crackleLFOGain.gain.value = 0.02;
      crackleLFO.connect(crackleLFOGain);
      crackleLFOGain.connect(crackleGain.gain);
      crackleLFO.start();
      activeNodesRef.current.push(crackleLFO);

      // 3. Periodic Clock tick
      themeIntervalRef.current = setInterval(() => {
        playTick(480, 0.02);
      }, 2000);

    } else if (ambientTheme === "space") {
      // 1. Deep Celestial Sub Bass Pad
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 45; // F#1

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 45.4; // detune beat

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

      // 2. Space Sweeping Pad
      const spaceOsc = ctx.createOscillator();
      spaceOsc.type = "triangle";
      spaceOsc.frequency.value = 135; // C#3
      
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

      // Sweep Space filter with LFO
      const spaceLFO = ctx.createOscillator();
      spaceLFO.frequency.value = 0.08;
      const spaceLFOGain = ctx.createGain();
      spaceLFOGain.gain.value = 120;
      spaceLFO.connect(spaceLFOGain);
      spaceLFOGain.connect(spaceFilter.frequency);
      spaceLFO.start();
      activeNodesRef.current.push(spaceLFO);

      // 3. Random Space Sparkles
      themeIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.4) {
          const notes = [587.33, 659.25, 783.99, 880.00, 1046.50]; // D5, E5, G5, A5, C6
          const randomNote = notes[Math.floor(Math.random() * notes.length)];
          playSineSparkle(randomNote, 0.04);
        }
      }, 2500);

    } else if (ambientTheme === "ancient") {
      // 1. Resonant Deep Cave Air
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

      // Slow drift LFO
      const caveLFO = ctx.createOscillator();
      caveLFO.frequency.value = 0.05;
      const caveLFOGain = ctx.createGain();
      caveLFOGain.gain.value = 80;
      caveLFO.connect(caveLFOGain);
      caveLFOGain.connect(caveFilter.frequency);
      caveLFO.start();
      activeNodesRef.current.push(caveLFO);

      // 2. Distant Woodwind/Flute Drone Melodies
      themeIntervalRef.current = setInterval(() => {
        const pentatonicScale = [220.00, 246.94, 261.63, 293.66, 329.63, 392.00]; // A3, B3, C4, D4, E4, G4
        const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
        playAncientFlute(note);
      }, 4000);

    } else if (ambientTheme === "calm") {
      // 1. Ocean Shore Waves crashing (Periodically swept noise filter)
      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = "lowpass";
      waveFilter.frequency.value = 350;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.05; // start low

      const noise = createNoiseNode();
      noise.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(master);
      noise.start();
      activeNodesRef.current.push(noise);

      // LFO sweeping wave amplitude (crashing waves at ~0.08Hz, 12s period)
      const waveLFO = ctx.createOscillator();
      waveLFO.frequency.value = 0.08;
      const waveLFOGain = ctx.createGain();
      waveLFOGain.gain.value = 0.16; // sweep range
      waveLFO.connect(waveLFOGain);
      waveLFOGain.connect(waveGain.gain);
      waveLFO.start();
      activeNodesRef.current.push(waveLFO);

      // Sweep filter cutoff alongside wave intensity
      const waveFilterLFOGain = ctx.createGain();
      waveFilterLFOGain.gain.value = 250;
      waveLFO.connect(waveFilterLFOGain);
      waveFilterLFOGain.connect(waveFilter.frequency);

      // 2. High Pure Bells
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

    // delay loop
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
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.8); // slow attack
    gain.gain.setValueAtTime(0.06, ctx.currentTime + 2.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0); // slow decay

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

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex flex-col selection:bg-[#e5c158]/30 selection:text-white pb-16 relative">
      
      {/* Background Animated Motion Overlay (Floating Constellation Dust Parallax) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Spheres */}
        <div className="absolute top-[8%] left-[15%] w-[450px] h-[450px] bg-blue-900/10 rounded-full blur-[120px] opacity-80" />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-[75%] left-[25%] w-[380px] h-[380px] bg-amber-900/5 rounded-full blur-[110px] opacity-60" />
        
        {/* Stars Particle field (HTML/CSS simulated parallax) */}
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,rgba(255,255,255,0.15),transparent_100%),radial-gradient(1px_1px_at_80px_140px,rgba(255,255,255,0.1),transparent_100%),radial-gradient(1.5px_1.5px_at_140px_70px,rgba(229,193,88,0.15),transparent_100%)] opacity-70 bg-[size:200px_200px]" />
      </div>

      {/* DYNAMIC HEADER NAVIGATION BAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${
          isScrolled 
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-8">
          {/* Logo */}
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
              World of Stories
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-light text-zinc-400">
            {["home", "discover", "categories", "trending", "collections", "library", "bookmarks", "AI Assistant"].map((item) => (
              <button
                key={item}
                onClick={() => { setActiveMenu(item); playClickSound(); }}
                className={`hover:text-white transition-colors capitalize py-1 relative ${
                  activeMenu === item ? "text-white font-medium" : ""
                }`}
              >
                {item === "bookmarks" ? "Bookmarks" : item}
                {activeMenu === item && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#e5c158]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-4 relative">
          
          {/* Expanding Search Input with Suggestion Dropdown */}
          <div className="relative">
            <div 
              className={`flex items-center bg-white/5 border rounded-full py-1.5 px-3.5 transition-all duration-500 ease-out shadow-inner ${
                isSearchFocused || searchQuery 
                  ? "w-64 md:w-72 border-[#e5c158]/50 bg-white/10" 
                  : "w-40 md:w-48 border-white/10"
              }`}
            >
              <Search className="text-zinc-500 mr-2 shrink-0 animate-pulse" size={13} />
              <input
                type="text"
                placeholder="Search mysteries, space, temples..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // delay to allow clicks
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
              <div className="absolute top-11 right-0 w-80 bg-[#090a10] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-fade-in flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-2 pb-1 border-b border-white/5">
                  Suggestions ({searchResults.length})
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
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-light text-white truncate group-hover:text-[#e5c158] transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-[9px] text-zinc-400 mt-0.5 truncate">
                        {story.era} • {story.category}
                      </p>
                    </div>
                    <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-zinc-400 group-hover:border-[#e5c158] group-hover:text-white transition-all shrink-0">
                      Read
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Notifications panel mockup */}
          <button className="text-zinc-400 hover:text-white transition-colors relative" title="Notifications">
            <Bell size={16} />
            <span className="absolute -top-1.5 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span className="absolute -top-1.5 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {/* Settings button mockup */}
          <button className="text-zinc-400 hover:text-white transition-colors" title="Settings">
            <Settings size={16} />
          </button>

          {/* User profile */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a2540] to-blue-900 border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#e5c158] transition-colors shrink-0">
            <User size={14} className="text-zinc-300" />
          </div>

        </div>
      </header>

      {/* FULL-HEIGHT HERO BANNER WITH PARALLAX & CONSTELLATIONS */}
      <section className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-12 z-10 pt-20">
        
        {/* Parallax Hero Visual Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/blackhole.png"
            alt="Hero Cinematic Accretion"
            fill
            priority
            className="object-cover scale-[1.05] brightness-[0.35]"
            style={{
              filter: "contrast(1.1) brightness(0.38)",
            }}
          />
          {/* Subtle gold grid/ocean filter overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
          
          {/* Parallax grid dots */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(229,193,88,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl space-y-6 scale-up-entry">
          <div className="flex items-center gap-3">
            <span className="bg-[#e5c158]/10 border border-[#e5c158]/30 px-3.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#e5c158] font-bold">
              Immersive Space Explorer
            </span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Globe size={11} className="text-[#0088ff] animate-spin" style={{ animationDuration: "12s" }} /> 22 min journey
            </span>
          </div>

          <h1 
            className="text-5xl md:text-7xl font-extralight tracking-wide text-white leading-[1.1] text-gradient"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Discover Stories <br className="hidden sm:inline" />
            That Changed History
          </h1>

          <p className="text-sm md:text-base font-light text-zinc-300 leading-relaxed max-w-xl">
            Explore real mysteries, historical legends, astronomical findings, and deep-sea archaeological excavations from India and around the world, presented in stunning cinematic formats.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedStory(ALL_STORIES.find((s) => s.id === "blackhole") || ALL_STORIES[0]);
                playClickSound();
              }}
              className="bg-gradient-to-b from-[#e5c158] to-[#c29e37] hover:from-[#f3cf65] hover:to-[#d4af37] text-[#050505] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full flex items-center gap-2.5 active:scale-95 transition-all shadow-[0_4px_25px_rgba(229,193,88,0.3)]"
            >
              <Play size={14} fill="currentColor" /> Read Now
            </button>
            <button
              onClick={() => {
                setActiveMenu("categories");
                document.getElementById("categories-grid")?.scrollIntoView({ behavior: "smooth" });
                playClickSound();
              }}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <Compass size={14} /> Explore Collection
            </button>
            <button
              onClick={() => {
                playClickSound();
                alert("Playing AI Story Preview: Full 3D fly-through space particle trailer initiating...");
              }}
              className="bg-blue-950/20 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-900/10 text-[#0088ff] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full flex items-center gap-2 backdrop-blur-sm transition-all"
            >
              <Headphones size={14} /> Watch AI Preview
            </button>
          </div>
        </div>

        {/* Small Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-60">
          <span className="text-[10px] uppercase tracking-[0.25em] font-light text-zinc-500">
            Scroll to discover
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#e5c158]/80 to-transparent animate-pulse" />
        </div>
      </section>

      {/* FLOATING AMBIENT AUDIO THEMES SELECTOR */}
      <div className="fixed bottom-6 right-6 z-40 bg-[#0c0d14]/85 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex flex-col gap-3 min-w-[200px] animate-fade-in hover:border-[#e5c158]/30 transition-colors">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Music size={13} className="text-[#e5c158] animate-bounce" />
            <span>Ambient Themes</span>
          </div>
          <button
            onClick={() => { setIsMuted(!isMuted); playClickSound(); }}
            className={`p-1.5 rounded-full focus:outline-none transition-all ${
              isMuted 
                ? "bg-red-950/40 border border-red-500/25 text-red-400" 
                : "bg-blue-950/40 border border-blue-500/25 text-blue-400"
            }`}
            title={isMuted ? "Unmute Ambient" : "Mute Ambient"}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>

        {/* Theme select buttons */}
        <div className="grid grid-cols-2 gap-2">
          {(["library", "space", "ancient", "calm"] as AmbientTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => {
                if (isMuted) setIsMuted(false);
                setAmbientTheme(theme);
                playClickSound();
              }}
              className={`text-[10px] uppercase font-semibold tracking-wider py-2 px-2.5 rounded-lg border text-center transition-all ${
                ambientTheme === theme && !isMuted
                  ? "bg-[#e5c158] border-[#e5c158] text-[#050505] shadow-[0_0_10px_rgba(229,193,88,0.25)]"
                  : "bg-white/5 border-white/5 hover:border-white/15 text-zinc-400 hover:text-white"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Master volume slider */}
        <div className="flex items-center gap-2.5 pt-1.5">
          <span className="text-[10px] text-zinc-500">Vol</span>
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

      {/* CONTINUOUS MAIN CONTENT FEED */}
      <main className="space-y-24 mt-12 relative z-10">

        {/* 1. DAILY HIGHLIGHT (STORY OF THE DAY) */}
        <section className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 
              className="text-2xl md:text-3xl font-light tracking-wider"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Story of the Day
            </h2>
            
            <div 
              onClick={() => {
                setSelectedStory(ALL_STORIES.find(s => s.id === "roopkund") || ALL_STORIES[0]);
                playClickSound();
              }}
              className="relative w-full min-h-[380px] bg-[#0c0d14] rounded-3xl overflow-hidden border border-white/5 hover:border-[#e5c158]/30 flex flex-col md:flex-row justify-end shadow-2xl group cursor-pointer transition-all duration-500"
            >
              <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0 overflow-hidden">
                <Image
                  src="/images/roopkund.png"
                  alt="Roopkund Skeleton Lake Daily highlight"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-50 md:brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d14] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0c0d14]/80 md:to-[#0c0d14]" />
              </div>

              <div className="relative w-full md:w-1/2 p-8 md:p-12 z-10 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold">
                    Indian Mysteries
                  </span>
                  <span className="text-[10px] text-zinc-400">15 min read</span>
                </div>

                <h3 
                  className="text-3xl md:text-4xl font-light text-white tracking-wide leading-tight group-hover:text-[#e5c158] transition-colors"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  Roopkund: The Skeleton Lake
                </h3>

                <p className="text-xs md:text-sm font-light text-zinc-300 leading-relaxed">
                  In 1942, a forest ranger stumbled upon a frozen lake in the high Himalayas. Inside lay hundreds of human skeletons. Modern forensic DNA scans reveal a baffling twist: the remains belong to multiple groups from Greece and India, killed centuries apart. How did they die, and why did they walk to this remote peak?
                </p>

                {/* Fact Status Badge */}
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 backdrop-blur-md">
                  <span className="text-[9px] uppercase text-[#e5c158] tracking-widest font-bold flex items-center gap-1.5">
                    <Sparkles size={11} /> Fact Status Check
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    95% DNA Verified Scientific Fact, 5% Local Himalayan Mountain Legends.
                  </p>
                </div>

                <span className="text-xs text-[#e5c158] font-semibold tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300 pt-2">
                  Begin Journey <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CONTINUE READING ROW */}
        <section className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 
              className="text-2xl md:text-3xl font-light tracking-wider"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Continue Reading
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ALL_STORIES.filter(s => s.progress).map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    playClickSound();
                  }}
                  className="bg-[#0b0c11] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-blue-500/30 group cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-blue-400 font-semibold">
                        {story.category}
                      </span>
                      <h3 className="text-sm font-semibold tracking-wide text-white group-hover:text-[#e5c158] transition-colors leading-snug">
                        {story.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500">{story.timeLeft}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-[#e5c158] h-1 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                          style={{ width: `${story.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-zinc-500">
                        <span>{story.progress}% Completed</span>
                        <span>Read Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. TRENDING STORIES CAROUSEL */}
        <section className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 
                className="text-2xl md:text-3xl font-light tracking-wider"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Trending Stories
              </h2>
              <span className="text-xs text-zinc-500 hover:text-white flex items-center gap-0.5 cursor-pointer font-light transition-colors">
                View All <ChevronRight size={14} />
              </span>
            </div>

            {/* Carousel horizontal row */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none pr-4 snap-x">
              {ALL_STORIES.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    playClickSound();
                  }}
                  className="min-w-[280px] md:min-w-[320px] bg-[#0b0c11] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e5c158]/40 group cursor-pointer transition-all duration-300 snap-start"
                >
                  <div className="relative w-full h-48 bg-zinc-950">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c11] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#0088ff]/10 backdrop-blur-md border border-[#0088ff]/30 text-[#0088ff] text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold">
                        {story.category}
                      </span>
                    </div>

                    {/* Popularity score badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 text-[10px] text-white">
                      <Star size={9} className="text-[#e5c158] fill-[#e5c158]" />
                      <span className="font-semibold">{story.popularity}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-light tracking-wide text-white group-hover:text-[#e5c158] transition-colors leading-tight">
                      {story.title}
                    </h3>
                    <p className="text-xs font-light text-zinc-400 line-clamp-2 leading-normal">
                      {story.synopsis}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-white/5 pt-3">
                      <span className="font-semibold">{story.era}</span>
                      <span className="flex items-center gap-1.5 font-light">
                        <Clock size={10} /> {story.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CATEGORIES TILE GRID */}
        <section id="categories-grid" className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 
              className="text-2xl md:text-3xl font-light tracking-wider"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Explore Categories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={playClickSound}
                  className={`bg-gradient-to-br ${cat.color} border p-5 rounded-2xl flex flex-col justify-between min-h-[120px] group cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-md`}
                >
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                    {cat.count} Stories
                  </span>
                  <h3 className="text-base font-light text-white tracking-wide group-hover:text-[#e5c158] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. AI RECOMMENDATIONS CONTEXT PANEL */}
        <section className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-transparent border border-blue-500/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-900/5 rounded-full blur-[80px]" />
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-xs text-[#0088ff] font-semibold tracking-wider uppercase">
                  <Sparkles size={14} className="animate-spin" style={{ animationDuration: "8s" }} />
                  <span>AI Narrator Recommendation</span>
                </div>
                <h3 className="text-xl md:text-2xl font-light text-white tracking-wide">
                  Tailored For Your Curiosity
                </h3>
                <p className="text-xs md:text-sm font-light text-zinc-300 max-w-xl leading-relaxed">
                  "If you enjoyed the frozen secrets of <strong className="text-white">Roopkund Skeleton Lake</strong>, you may also like the disorienting monsoon occurrences of <strong className="text-white">Jatinga Bird Phenomenon</strong>."
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedStory(ALL_STORIES.find((s) => s.id === "jatinga") || ALL_STORIES[0]);
                  playClickSound();
                }}
                className="bg-white/5 border border-white/10 hover:border-[#0088ff] hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full backdrop-blur-md transition-all shrink-0 relative z-10"
              >
                Read Jatinga Story
              </button>
            </div>
          </div>
        </section>

        {/* 6. FEATURED PREMIUM COLLECTIONS */}
        <section className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 
              className="text-2xl md:text-3xl font-light tracking-wider"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Featured Collections
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLLECTIONS.map((col, idx) => (
                <div
                  key={idx}
                  onClick={playClickSound}
                  className="bg-[#0b0c11] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e5c158]/30 group cursor-pointer transition-all duration-300 shadow-lg"
                >
                  <div className="relative w-full h-44 bg-zinc-950">
                    <Image
                      src={col.cover}
                      alt={col.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c11] via-transparent to-transparent" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-light tracking-wide text-white group-hover:text-[#e5c158] transition-colors leading-tight">
                      {col.name}
                    </h3>
                    <p className="text-[11px] font-light text-zinc-400 leading-normal">
                      {col.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. READING STATISTICS PANEL */}
        <section id="stats-panel" ref={statsSectionRef} className="px-6 md:px-12 reveal-on-scroll">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#0c0d14] border border-white/5 rounded-3xl p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">
                  Stories Read
                </span>
                <span className="text-3xl sm:text-4xl font-extralight text-white block">
                  {statStories}
                </span>
                <span className="text-[9px] text-[#e5c158] font-semibold tracking-wider flex items-center justify-center gap-1">
                  <Award size={10} /> Knowledge Base
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">
                  Hours Expounded
                </span>
                <span className="text-3xl sm:text-4xl font-extralight text-white block">
                  {statHours} hrs
                </span>
                <span className="text-[9px] text-[#0088ff] font-semibold tracking-wider flex items-center justify-center gap-1">
                  <Clock size={10} /> Active Reading
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">
                  Favorite Sphere
                </span>
                <span className="text-sm sm:text-base font-light text-white tracking-wide py-1 block">
                  Archaeology
                </span>
                <span className="text-[9px] text-zinc-500 font-light block">
                  Based on recent histories
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest block">
                  Reading Streak
                </span>
                <span className="text-3xl sm:text-4xl font-extralight text-[#e5c158] block">
                  {statStreak} Days
                </span>
                <span className="text-[9px] text-zinc-500 font-semibold flex items-center justify-center gap-1">
                  <Flame size={10} className="text-amber-500 animate-pulse" /> Keep it going
                </span>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs font-light">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-light tracking-widest text-zinc-400" style={{ fontFamily: "Cinzel, serif" }}>
            VELORA
          </span>
          <span>© 2026 VELORA Story Engine. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-5">
          {["About", "Privacy", "Terms", "Contact", "Community", "GitHub"].map((link, idx) => (
            <span key={idx} className="hover:text-white cursor-pointer transition-colors">
              {link}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#0088ff] rounded-full animate-pulse" />
          <span>Version 0.2.0 (Part 2)</span>
        </div>
      </footer>

      {/* STORY DETAIL OVERLAY MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#090a10] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(229,193,88,0.15)] flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => { setSelectedStory(null); playClickSound(); }}
              className="absolute top-4 right-4 z-50 bg-black/50 border border-white/10 text-zinc-300 hover:text-white p-2 rounded-full backdrop-blur-md"
            >
              <X size={16} />
            </button>

            {/* Left Column: Image & Basic Info */}
            <div className="relative w-full md:w-5/12 h-60 md:h-auto min-h-[250px] bg-zinc-950">
              <Image
                src={selectedStory.image}
                alt={selectedStory.title}
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
                  {selectedStory.title}
                </h2>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 pt-1">
                  <span>{selectedStory.era}</span>
                  <span>•</span>
                  <span>{selectedStory.duration}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto space-y-6">
              
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase text-[#e5c158] font-bold tracking-[0.2em]">
                  Synopsis
                </h4>
                <p className="text-zinc-300 text-sm font-light leading-relaxed">
                  {selectedStory.synopsis}
                </p>
              </div>

              {/* Fact Status */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                <div className="text-xs text-[#e5c158] font-medium">
                  Fact Status Analysis
                </div>
                <p className="text-zinc-400 text-xs font-light">
                  {selectedStory.factStatus}
                </p>
              </div>

              {/* Research Notes */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#0088ff] font-medium">
                  <Sparkles size={14} />
                  <span>Archaeological & Historical Evidence</span>
                </div>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  {selectedStory.archaeologicalNotes}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedStory.tags.map((tag, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 text-zinc-400 text-[10px] px-2.5 py-1 rounded-md font-light">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-medium text-white flex items-center gap-1.5">
                      <Headphones size={13} className="text-[#0088ff]" />
                      <span>Select AI Narrator Voice</span>
                    </h5>
                    <p className="text-[10px] text-zinc-500 font-light mt-0.5">
                      Premium spatial text-to-speech engine
                    </p>
                  </div>
                  <select className="bg-white/5 border border-white/10 rounded-md text-xs font-light text-zinc-300 px-3 py-1.5 focus:outline-none">
                    <option value="calm">Calm & Warm (Male)</option>
                    <option value="aria">Aria Premium (Female)</option>
                    <option value="mysterious">Narrator Sage (Deep)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    onStartReading(selectedStory);
                    setSelectedStory(null); // close modal
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

    </div>
  );
}
