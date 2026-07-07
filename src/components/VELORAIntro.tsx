"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import IntroCanvas from "./intro/IntroCanvas";
import GateStage from "./intro/GateStage";
import SystemLogsStage from "./intro/SystemLogsStage";
import WelcomeStage from "./intro/WelcomeStage";
import MuteButton from "./intro/MuteButton";
import { IntroStage } from "../types";

interface VELORAIntroProps {
  userName?: string;
  onComplete: () => void;
}

const NARRATION_SCRIPT = [
  { text: "Welcome...", pause: 1200 },
  { text: "Welcome to VELORA.", pause: 1800 },
  { text: "Every civilization...", pause: 1200 },
  { text: "...every mystery...", pause: 1200 },
  { text: "...every forgotten place...", pause: 1500 },
  { text: "...every scientific discovery...", pause: 1800 },
  { text: "...and every remarkable story...", pause: 1800 },
  { text: "...has something to teach us.", pause: 2000 },
  { text: "Tonight...", pause: 1500 },
  { text: "You begin a journey through knowledge, curiosity, and imagination.", pause: 2800 },
  { text: "Welcome to the World of Stories.", pause: 3000 }
];

const SYSTEM_LOGS = [
  "Initializing Story Engine...",
  "Loading Knowledge Archive...",
  "Preparing Reading Experience...",
  "Loading AI Narrator...",
  "Synchronizing Story Collections...",
  "Building Personalized Library...",
  "Preparing Discovery Feed...",
  "Archive Ready."
];

const PERCENT_SEQUENCE = [0, 12, 28, 46, 63, 81, 100];
const FONT_FAMILY = "Cinzel, Cormorant Garamond, Georgia, serif";

export default function VELORAIntro({ userName = "Reader", onComplete }: VELORAIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);
  
  // Sequence and Subtitles State
  const [stage, setStage] = useState<IntroStage>("gate");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleActive, setSubtitleActive] = useState(false);
  
  // Loader UI state
  const [logIndex, setLogIndex] = useState(-1);
  const [logList, setLogList] = useState<string[]>([]);
  const [loadingPercent, setLoadingPercent] = useState(0);
  
  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ringRef = useRef<THREE.LineSegments | null>(null);
  const libraryGroupRef = useRef<THREE.Group | null>(null);
  const lensFlareRef = useRef<THREE.Mesh | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Safe loading of voices inside effect
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const handleVoicesChanged = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };

    handleVoicesChanged();
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const v = isMuted ? 0 : volume;
      masterGainRef.current.gain.linearRampToValueAtTime(v, audioContextRef.current.currentTime + 0.1);
    }
  }, [volume, isMuted]);

  // Clean up Audio Context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // --- AUDIO SYNTHESIS ENGINE ---
  const initAudio = () => {
    if (audioContextRef.current) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;
    
    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 1. Synth Wind Noise
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.Q.setValueAtTime(2.0, ctx.currentTime);
    windFilter.frequency.setValueAtTime(350, ctx.currentTime);
    windFilterRef.current = windFilter;

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.0, ctx.currentTime);
    windGainRef.current = windGain;

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    noiseSource.start();

    // LFO to modulate wind frequency (gusts)
    const windLFO = ctx.createOscillator();
    windLFO.frequency.setValueAtTime(0.08, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime);

    windLFO.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    windLFO.start();

    // 2. Deep Cinematic Bass Drone
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(55, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(55.4, ctx.currentTime);

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.setValueAtTime(80, ctx.currentTime);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0, ctx.currentTime);
    droneGainRef.current = droneGain;

    const dist = ctx.createWaveShaper();
    const makeDistortionCurve = (amount = 20) => {
      const k = typeof amount === "number" ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    };
    dist.curve = makeDistortionCurve(15);
    dist.oversample = "4x";

    osc1.connect(droneFilter);
    osc2.connect(droneFilter);
    droneFilter.connect(dist);
    dist.connect(droneGain);
    droneGain.connect(masterGain);

    osc1.start();
    osc2.start();
  };

  const playChime = () => {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    const playBell = (freq: number, delay: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(vol * 0.15, ctx.currentTime + delay + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 2.5);
      
      const feedback = ctx.createGain();
      feedback.gain.value = 0.4;
      const delayNode = ctx.createDelay();
      delayNode.delayTime.value = 0.35;
      
      gainNode.connect(masterGain);
      gainNode.connect(delayNode);
      delayNode.connect(feedback);
      feedback.connect(delayNode);
      delayNode.connect(masterGain);
      
      osc.connect(gainNode);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 3.0);
    };

    playBell(440, 0, 0.8);
    playBell(523.25, 0.15, 0.6);
    playBell(659.25, 0.3, 0.6);
    playBell(987.77, 0.45, 0.5);
  };

  const playTransitionWhoosh = () => {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 3.0);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(150, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 3.0);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 3.0);
  };

  const playPageFlipSynth = () => {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    const bufferSize = 0.4 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 8;
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start();
  };

  const startAmbientFades = () => {
    const ctx = audioContextRef.current;
    if (!ctx || !windGainRef.current || !droneGainRef.current) return;
    
    const now = ctx.currentTime;
    
    windGainRef.current.gain.cancelScheduledValues(now);
    windGainRef.current.gain.setValueAtTime(0, now);
    windGainRef.current.gain.linearRampToValueAtTime(0.18, now + 4.0);
    
    droneGainRef.current.gain.cancelScheduledValues(now);
    droneGainRef.current.gain.setValueAtTime(0, now);
    droneGainRef.current.gain.linearRampToValueAtTime(0.35, now + 6.0);
  };

  const fetchLogoCoordinates = (): THREE.Vector3[] => {
    const width = 600;
    const height = 150;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 80px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VELORA", width / 2, height / 2);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const points: THREE.Vector3[] = [];
    const density = 4;

    for (let y = 0; y < height; y += density) {
      for (let x = 0; x < width; x += density) {
        const idx = (y * width + x) * 4;
        const red = data[idx];
        if (red > 128) {
          const px = (x - width / 2) * 0.024;
          const py = -(y - height / 2) * 0.024;
          const pz = 1.0;
          points.push(new THREE.Vector3(px, py, pz));
        }
      }
    }
    return points;
  };

  const startSequence = async () => {
    setStage("ambient-dark");
    initAudio();
    startAmbientFades();

    setTimeout(() => {
      setStage("particles-fadein");
      if (particlesRef.current) {
        gsap.to(particlesRef.current.material, {
          opacity: 0.6,
          duration: 3.0,
          ease: "power2.inOut",
        });
      }
    }, 2800);

    setTimeout(() => {
      setStage("energy-ring");
      if (ringRef.current) {
        gsap.to(ringRef.current.material, {
          opacity: 0.85,
          duration: 2.5,
          ease: "sine.inOut",
        });
        
        if (particlesRef.current) {
          const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
          const posArray = posAttr.array as Float32Array;
          const count = posAttr.count;

          for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const originalX = posArray[idx];
            const originalY = posArray[idx+1];
            const originalZ = posArray[idx+2];
            
            gsap.to(posArray, {
              [idx]: originalX * 0.25,
              [idx+1]: originalY * 0.25,
              [idx+2]: originalZ * 0.25,
              duration: 3.0,
              ease: "power3.inOut",
              onUpdate: () => {
                posAttr.needsUpdate = true;
              }
            });
          }
        }
      }
    }, 6000);

    setTimeout(() => {
      setStage("logo-assemble");
      const logoPoints = fetchLogoCoordinates();
      if (particlesRef.current && logoPoints.length > 0) {
        const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const count = posAttr.count;
        
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const target = logoPoints[i % logoPoints.length];
          
          gsap.to(posArray, {
            [idx]: target.x,
            [idx+1]: target.y,
            [idx+2]: target.z + (Math.random() - 0.5) * 0.05,
            duration: 3.5,
            ease: "power4.inOut",
            onUpdate: () => {
              posAttr.needsUpdate = true;
            }
          });
        }

        if (ringRef.current) {
          gsap.to(ringRef.current.scale, {
            x: 1.8,
            y: 1.8,
            z: 1.8,
            duration: 2.0,
            ease: "power2.out",
          });
          gsap.to(ringRef.current.material, {
            opacity: 0,
            duration: 2.2,
            ease: "power2.out",
          });
        }

        playChime();

        if (lensFlareRef.current) {
          const flare = lensFlareRef.current;
          gsap.timeline()
            .to(flare.material, { opacity: 0.85, duration: 0.5 })
            .to(flare.position, { x: 15, duration: 2.8, ease: "power1.inOut" })
            .to(flare.material, { opacity: 0.0, duration: 0.5 }, "-=0.5");
        }
      }
    }, 9200);

    setTimeout(() => {
      setStage("narration");
      playNarrationTimeline();
    }, 12500);
  };

  const playNarrationTimeline = () => {
    let currentIdx = 0;

    const speakNext = () => {
      if (currentIdx >= NARRATION_SCRIPT.length) {
        setTimeout(() => {
          triggerLogoFadeStage();
        }, 1500);
        return;
      }

      const scriptItem = NARRATION_SCRIPT[currentIdx];
      setSubtitle(scriptItem.text);
      setSubtitleActive(true);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(scriptItem.text.replace(/\.\.\./g, ""));
        
        let selectedVoice = availableVoices.find(v => 
          v.name.toLowerCase().includes("natural") || 
          v.name.toLowerCase().includes("google") || 
          v.name.toLowerCase().includes("premium") ||
          v.name.toLowerCase().includes("aria")
        );
        if (!selectedVoice && availableVoices.length > 0) {
          selectedVoice = availableVoices.find(v => v.lang.startsWith("en")) || availableVoices[0];
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.pitch = 0.9;
        utterance.rate = 0.82;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
      }

      if (particlesRef.current) {
        const mat = particlesRef.current.material as THREE.PointsMaterial;
        gsap.timeline()
          .to(mat, { size: 0.16, opacity: 0.95, duration: 0.3 })
          .to(mat, { size: 0.12, opacity: 0.6, duration: 0.8 });
      }

      setTimeout(() => {
        setSubtitleActive(false);
        setTimeout(() => {
          currentIdx++;
          speakNext();
        }, 300);
      }, scriptItem.pause);
    };

    speakNext();
  };

  const triggerLogoFadeStage = () => {
    setStage("logo-fade");
    if (particlesRef.current) {
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const count = posAttr.count;

      gsap.timeline()
        .to(mat, { size: 0.22, opacity: 0.9, duration: 0.8, ease: "power2.out" })
        .to(mat, {
          opacity: 0,
          size: 0.05,
          duration: 2.2,
          ease: "power2.inOut",
          onStart: () => {
            for (let i = 0; i < count; i++) {
              const idx = i * 3;
              gsap.to(posArray, {
                [idx]: posArray[idx] + (Math.random() - 0.5) * 8,
                [idx+1]: posArray[idx+1] + (Math.random() - 0.5) * 8,
                [idx+2]: posArray[idx+2] - Math.random() * 15,
                duration: 2.5,
                ease: "power1.in",
                onUpdate: () => {
                  posAttr.needsUpdate = true;
                }
              });
            }
          },
          onComplete: () => {
            triggerPrepLoadingStage();
          }
        });
    } else {
      triggerPrepLoadingStage();
    }
  };

  const triggerPrepLoadingStage = () => {
    setStage("prep-loading");

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < SYSTEM_LOGS.length) {
        setLogList((prev) => [...prev, SYSTEM_LOGS[logIdx]]);
        setLogIndex(logIdx);
        playPageFlipSynth();
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 450);

    let pIdx = 0;
    const progressInterval = setInterval(() => {
      if (pIdx < PERCENT_SEQUENCE.length) {
        setLoadingPercent(PERCENT_SEQUENCE[pIdx]);
        pIdx++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          triggerWelcomeStage();
        }, 800);
      }
    }, 600);
  };

  const triggerWelcomeStage = () => {
    setStage("welcome");
    setTimeout(() => {
      playChime();
    }, 200);

    setTimeout(() => {
      triggerLibraryTransition();
    }, 3200);
  };

  const triggerLibraryTransition = () => {
    setStage("library-transition");

    if (libraryGroupRef.current) {
      libraryGroupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.children.forEach((mesh) => {
            if (mesh instanceof THREE.Mesh && mesh.material instanceof THREE.Material) {
              gsap.to(mesh.material, { opacity: 1.0, duration: 2.5 });
            }
          });
        }
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          gsap.to(child.material, { opacity: 0.8, duration: 2.5 });
        }
        if (child instanceof THREE.Group) {
          child.children.forEach((mesh) => {
            if (mesh instanceof THREE.Points && mesh.material instanceof THREE.Material) {
              gsap.to(mesh.material, { opacity: 0.7, duration: 2.5 });
            }
            if (mesh instanceof THREE.LineSegments && mesh.material instanceof THREE.Material) {
              gsap.to(mesh.material, { opacity: 0.4, duration: 2.5 });
            }
          });
        }
      });
    }

    playTransitionWhoosh();

    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        z: -25,
        duration: 4.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (cameraRef.current && Math.abs(cameraRef.current.position.z % 4) < 0.1) {
            playPageFlipSynth();
          }
        },
        onComplete: () => {
          setStage("finished");
          
          const ctx = audioContextRef.current;
          if (ctx && windGainRef.current && droneGainRef.current) {
            windGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
            droneGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
          }
          
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] text-white select-none">
      <IntroCanvas
        canvasRef={canvasRef}
        sceneRef={sceneRef}
        cameraRef={cameraRef}
        rendererRef={rendererRef}
        particlesRef={particlesRef}
        ringRef={ringRef}
        libraryGroupRef={libraryGroupRef}
        lensFlareRef={lensFlareRef}
        ambientLightRef={ambientLightRef}
      />

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.2)_0%,#050505_90%)] pointer-events-none z-10" />

      {stage !== "gate" && (
        <MuteButton
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      {stage === "gate" && (
        <GateStage
          onStart={startSequence}
          fontFam={FONT_FAMILY}
        />
      )}

      {stage === "narration" && (
        <div className="absolute bottom-24 inset-x-0 flex justify-center px-8 z-30 pointer-events-none">
          <p
            className={`text-lg sm:text-xl md:text-2xl font-light text-center leading-relaxed tracking-wide text-white max-w-3xl transition-opacity duration-300 ${
              subtitleActive ? "opacity-90 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)", fontFamily: FONT_FAMILY }}
          >
            {subtitle}
          </p>
        </div>
      )}

      {stage === "prep-loading" && (
        <SystemLogsStage
          loadingPercent={loadingPercent}
          logList={logList}
          logIndex={logIndex}
        />
      )}

      {stage === "welcome" && (
        <WelcomeStage
          userName={userName}
          fontFam={FONT_FAMILY}
        />
      )}

      {prefersReducedMotion && (
        <button
          onClick={onComplete}
          className="absolute bottom-6 right-6 z-50 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-xs font-semibold text-white transition backdrop-blur-md cursor-pointer"
        >
          Skip Cinematic Intro
        </button>
      )}
    </div>
  );
}
