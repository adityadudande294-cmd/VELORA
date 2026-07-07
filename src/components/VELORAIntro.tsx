"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Volume2, VolumeX } from "lucide-react";

interface VELORAIntroProps {
  userName?: string;
  onComplete: () => void;
}

type Stage =
  | "gate"
  | "ambient-dark"
  | "particles-fadein"
  | "energy-ring"
  | "logo-assemble"
  | "narration"
  | "logo-fade"
  | "prep-loading"
  | "welcome"
  | "library-transition"
  | "finished";

export default function VELORAIntro({ userName = "Reader", onComplete }: VELORAIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);
  
  // Sequence and Subtitles State
  const [stage, setStage] = useState<Stage>("gate");
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

  // Constants
  const fontFam = "Cinzel, Cormorant Garamond, Georgia, serif";
  const systemLogs = [
    "Initializing Story Engine...",
    "Loading Knowledge Archive...",
    "Preparing Reading Experience...",
    "Loading AI Narrator...",
    "Synchronizing Story Collections...",
    "Building Personalized Library...",
    "Preparing Discovery Feed...",
    "Archive Ready."
  ];

  // Percent sequence for loader
  const percentSequence = [0, 12, 28, 46, 63, 81, 100];

  // AI Voice Script with pauses
  const narrationScript = [
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

    // 1. Synth Wind Noise (Atmospheric Ambient)
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
    windGain.gain.setValueAtTime(0.0, ctx.currentTime); // Start silent
    windGainRef.current = windGain;

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    noiseSource.start();

    // LFO to modulate wind frequency (gusts)
    const windLFO = ctx.createOscillator();
    windLFO.frequency.setValueAtTime(0.08, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime); // Sweep amplitude

    windLFO.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    windLFO.start();

    // 2. Deep Cinematic Bass Drone
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(55.4, ctx.currentTime); // Beating detuned

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.setValueAtTime(80, ctx.currentTime);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.0, ctx.currentTime); // Start silent
    droneGainRef.current = droneGain;

    // Waveshaper for subtle warm distortion
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

    // Crystalline Chime
    const playBell = (freq: number, delay: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(vol * 0.15, ctx.currentTime + delay + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 2.5);
      
      // Delay effect
      const feedback = ctx.createGain();
      feedback.gain.value = 0.4;
      const delayNode = ctx.createDelay();
      delayNode.delayTime.value = 0.35;
      
      gainNode.connect(masterGain);
      
      // Feed to delay
      gainNode.connect(delayNode);
      delayNode.connect(feedback);
      feedback.connect(delayNode);
      delayNode.connect(masterGain);
      
      osc.connect(gainNode);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 3.0);
    };

    // Beautiful chord (A minor 9: A4, C5, E5, B5)
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

    // Simulate paper rustle with noise burst & bandpass sweep
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
    
    // Wind sweeps in over 4s
    windGainRef.current.gain.cancelScheduledValues(now);
    windGainRef.current.gain.setValueAtTime(0, now);
    windGainRef.current.gain.linearRampToValueAtTime(0.18, now + 4.0);
    
    // Drone rolls in over 6s
    droneGainRef.current.gain.cancelScheduledValues(now);
    droneGainRef.current.gain.setValueAtTime(0, now);
    droneGainRef.current.gain.linearRampToValueAtTime(0.35, now + 6.0);
  };

  // Adjust volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const v = isMuted ? 0 : volume;
      masterGainRef.current.gain.linearRampToValueAtTime(v, audioContextRef.current.currentTime + 0.1);
    }
  }, [volume, isMuted]);

  // --- THREE.JS GRAPHICS SETUP ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Dynamic blue point lights
    const blueLight = new THREE.PointLight(0x0055ff, 2, 40);
    blueLight.position.set(0, 0, 2);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xffaa00, 0, 30);
    goldLight.position.set(0, 0, 5);
    scene.add(goldLight);

    // Particle Texture Generator (Smooth round glowing circle)
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.2, "rgba(100, 180, 255, 0.8)");
        grad.addColorStop(0.5, "rgba(0, 50, 200, 0.2)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };
    const particleTex = createParticleTexture();

    // 1. Starfield / Particles System
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randomSpeeds = new Float32Array(particleCount);
    
    // Distribute randomly in space
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;     // x
      positions[i + 1] = (Math.random() - 0.5) * 35; // y
      positions[i + 2] = (Math.random() - 0.5) * 20; // z
      randomSpeeds[i / 3] = 0.05 + Math.random() * 0.15;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.0, // Start hidden
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // 2. Central Energy Ring
    const ringGeo = new THREE.TorusGeometry(3.5, 0.05, 8, 80);
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.0,
        wireframe: true,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(ringMesh);
    
    const ringLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(ringGeo),
      new THREE.LineBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(ringLines);
    ringRef.current = ringLines;

    // 3. Lens Flare mesh passing across the screen
    const flareGeo = new THREE.PlaneGeometry(12, 1);
    
    const createFlareTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 16, 256, 16);
        grad.addColorStop(0, "rgba(255, 230, 150, 0)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.6, "rgba(255, 255, 255, 0.4)");
        grad.addColorStop(1, "rgba(255, 230, 150, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };
    
    const flareMat = new THREE.MeshBasicMaterial({
      map: createFlareTexture(),
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const flare = new THREE.Mesh(flareGeo, flareMat);
    flare.position.set(-15, 0, 2.5);
    scene.add(flare);
    lensFlareRef.current = flare;

    // 4. Procedural 3D Library Scene
    const libraryGroup = new THREE.Group();
    scene.add(libraryGroup);
    libraryGroupRef.current = libraryGroup;

    const buildLibraryScene = () => {
      const shelfWidth = 60; // Z depth
      
      const buildShelf = (xPos: number) => {
        const shelfGrp = new THREE.Group();
        shelfGrp.position.set(xPos, 0, 0);

        const borderMat = new THREE.MeshStandardMaterial({
          color: 0x071122,
          roughness: 0.8,
          metalness: 0.1,
        });

        for (let y = -4; y <= 4; y += 3) {
          const plank = new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, shelfWidth), borderMat);
          plank.position.y = y;
          shelfGrp.add(plank);

          const bookColors = [0x0e1b30, 0x1d3557, 0x457b9d, 0xd4af37, 0x3d3425, 0x5e503f, 0x8a1c14];
          const bookDensity = 0.5;
          
          for (let z = -shelfWidth / 2 + 1; z < shelfWidth / 2 - 1; z += bookDensity + Math.random() * 0.2) {
            const bookCount = Math.floor(Math.random() * 3) + 1;
            const tilt = Math.random() > 0.85 ? (Math.random() - 0.5) * 0.3 : 0;
            
            for (let b = 0; b < bookCount; b++) {
              const bookHeight = 0.9 + Math.random() * 0.7;
              const bookWidth = 0.12 + Math.random() * 0.15;
              const bookDepth = 1.0 + Math.random() * 0.4;
              
              const bMat = new THREE.MeshStandardMaterial({
                color: bookColors[Math.floor(Math.random() * bookColors.length)],
                roughness: 0.6,
                metalness: 0.15,
              });

              if (Math.random() > 0.8) {
                bMat.emissive = new THREE.Color(0xd4af37);
                bMat.emissiveIntensity = 0.25;
              }

              const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth), bMat);
              bookMesh.position.set(0, y + bookHeight / 2 + 0.08, z);
              if (tilt !== 0) {
                bookMesh.rotation.z = tilt;
                bookMesh.position.x += tilt * 0.2;
              }
              shelfGrp.add(bookMesh);
            }
          }
        }
        
        libraryGroup.add(shelfGrp);
      };

      buildShelf(-7.5);
      buildShelf(7.5);

      // Add floating pages (sketches, diagrams)
      const pageCount = 35;
      
      const createPageTexture = (idx: number) => {
        const pCanvas = document.createElement("canvas");
        pCanvas.width = 128;
        pCanvas.height = 128;
        const pCtx = pCanvas.getContext("2d");
        if (pCtx) {
          pCtx.fillStyle = "#fff8e7";
          pCtx.fillRect(0, 0, 128, 128);
          pCtx.strokeStyle = "rgba(100, 50, 0, 0.4)";
          pCtx.lineWidth = 1.5;
          
          if (idx % 3 === 0) {
            pCtx.beginPath();
            pCtx.arc(64, 64, 40, 0, Math.PI * 2);
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.arc(64, 64, 20, 0, Math.PI * 2);
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.moveTo(24, 64); pCtx.lineTo(104, 64);
            pCtx.moveTo(64, 24); pCtx.lineTo(64, 104);
            pCtx.stroke();
          } else if (idx % 3 === 1) {
            pCtx.beginPath();
            pCtx.moveTo(20, 20); pCtx.quadraticCurveTo(50, 40, 70, 20);
            pCtx.quadraticCurveTo(90, 80, 110, 50);
            pCtx.stroke();
            pCtx.fillStyle = "rgba(150, 50, 0, 0.3)";
            pCtx.font = "8px serif";
            pCtx.fillText("TERRA", 40, 80);
          } else {
            pCtx.font = "6px serif";
            pCtx.fillStyle = "rgba(20, 20, 20, 0.6)";
            for (let l = 15; l < 115; l += 8) {
              pCtx.fillText("Lorem ipsum dolor sit amet, cosectetur.", 10, l);
            }
          }
        }
        return new THREE.CanvasTexture(pCanvas);
      };

      for (let i = 0; i < pageCount; i++) {
        const pageMat = new THREE.MeshStandardMaterial({
          map: createPageTexture(i),
          roughness: 0.9,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0,
        });

        const pageMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), pageMat);
        
        pageMesh.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 45 - 5
        );
        pageMesh.rotation.set(
          Math.random() * Math.PI * 0.2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 0.1
        );
        
        libraryGroup.add(pageMesh);
      }

      // Constellation Wireframes in background
      const constellationGrp = new THREE.Group();
      const points = [];
      for (let i = 0; i < 20; i++) {
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          -45 + (Math.random() - 0.5) * 10
        ));
      }

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });

      const lineGeometry = new THREE.BufferGeometry();
      const linePositions: number[] = [];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (points[i].distanceTo(points[j]) < 12) {
            linePositions.push(points[i].x, points[i].y, points[i].z);
            linePositions.push(points[j].x, points[j].y, points[j].z);
          }
        }
      }
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      const lines = new THREE.LineSegments(lineGeometry, lineMat);
      constellationGrp.add(lines);

      const dotGeo = new THREE.BufferGeometry();
      const dotPositions = new Float32Array(points.length * 3);
      points.forEach((pt, k) => {
        dotPositions[k * 3] = pt.x;
        dotPositions[k * 3 + 1] = pt.y;
        dotPositions[k * 3 + 2] = pt.z;
      });
      dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
      const dotMat = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.25,
        map: particleTex,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dots = new THREE.Points(dotGeo, dotMat);
      constellationGrp.add(dots);

      libraryGroup.add(constellationGrp);
      libraryGroup.position.z = -10;
    };

    buildLibraryScene();

    // RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (particles.material instanceof THREE.PointsMaterial) {
        particles.rotation.y = elapsedTime * 0.008;
        particles.rotation.x = elapsedTime * 0.004;
      }

      ringMesh.rotation.z = elapsedTime * 0.15;
      ringMesh.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
      
      ringLines.rotation.z = -elapsedTime * 0.22;
      ringLines.rotation.x = Math.cos(elapsedTime * 0.1) * 0.1;

      libraryGroup.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.rotation.y = Math.sin(elapsedTime * 0.05) * 0.02;
        } else if (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) {
          child.position.y += Math.sin(elapsedTime * 0.8 + child.position.x) * 0.0015;
          child.rotation.y += Math.cos(elapsedTime * 0.4 + child.position.z) * 0.0008;
        }
      });

      blueLight.intensity = 1.5 + Math.sin(elapsedTime * 1.5) * 0.4;
      goldLight.intensity = Math.max(0, Math.cos(elapsedTime * 0.8) * 0.8);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // --- LOGO EXTRACTION ---
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

  // --- MAIN TIMELINE TIMING & TRANSITIONS ---
  const startSequence = async () => {
    setStage("ambient-dark");
    initAudio();
    startAmbientFades();

    // 1. Black dark start with ambient audio (0-3s)
    setTimeout(() => {
      // 2. Stars slowly fade in (3-6s)
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
      // 3. Central Blue Energy Ring Appears (6-9s)
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
      // 4. Logo forms from light particles (9-12s)
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

    // 6. AI Narration Script (12.5s - 25.5s)
    setTimeout(() => {
      setStage("narration");
      playNarrationTimeline();
    }, 12500);
  };

  const playNarrationTimeline = async () => {
    let currentIdx = 0;

    const speakNext = () => {
      if (currentIdx >= narrationScript.length) {
        setTimeout(() => {
          triggerLogoFadeStage();
        }, 1500);
        return;
      }

      const scriptItem = narrationScript[currentIdx];
      setSubtitle(scriptItem.text);
      setSubtitleActive(true);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(scriptItem.text.replace(/\.\.\./g, ""));
        
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(v => 
          v.name.toLowerCase().includes("natural") || 
          v.name.toLowerCase().includes("google") || 
          v.name.toLowerCase().includes("premium") ||
          v.name.toLowerCase().includes("aria")
        );
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
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

    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = speakNext;
    }
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
      if (logIdx < systemLogs.length) {
        setLogList((prev) => [...prev, systemLogs[logIdx]]);
        setLogIndex(logIdx);
        playPageFlipSynth();
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 450);

    let pIdx = 0;
    const progressInterval = setInterval(() => {
      if (pIdx < percentSequence.length) {
        setLoadingPercent(percentSequence[pIdx]);
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
      
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block z-0"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.2)_0%,#050505_90%)] pointer-events-none z-10" />

      {stage !== "gate" && (
        <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg transition-opacity duration-500 z-50">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/80 hover:text-white transition-colors focus:outline-none"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e5c158]"
          />
        </div>
      )}

      {stage === "gate" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] px-6 text-center z-50">
          <div className="space-y-6 max-w-lg scale-up-entry">
            <h1
              className="text-5xl sm:text-6xl font-light tracking-[0.25em] text-white/95"
              style={{ fontFamily: fontFam }}
            >
              VELORA
            </h1>
            <p className="text-sm tracking-[0.3em] uppercase text-[#e5c158]/80 font-medium">
              Every Story Has a Truth Waiting to Be Discovered.
            </p>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#e5c158]/50 to-transparent mx-auto my-6" />
            <p className="text-white/40 text-xs tracking-wider max-w-sm mx-auto leading-relaxed">
              This experience features highly atmospheric audio, spatial 3D effects, and immersive narration. Please wear headphones for the optimal journey.
            </p>
            <button
              onClick={startSequence}
              className="mt-8 px-8 py-3 rounded-full border border-[#e5c158]/40 bg-gradient-to-b from-white/5 to-white/0 hover:border-[#e5c158] hover:bg-white/10 active:scale-95 transition-all duration-300 font-light tracking-[0.2em] uppercase text-sm text-[#e5c158] shadow-[0_0_15px_rgba(229,193,88,0.1)] hover:shadow-[0_0_25px_rgba(229,193,88,0.25)]"
            >
              Begin Journey
            </button>
          </div>
        </div>
      )}

      {stage === "narration" && (
        <div className="absolute bottom-24 inset-x-0 flex justify-center px-8 z-30 pointer-events-none">
          <p
            className={`text-lg sm:text-xl md:text-2xl font-light text-center leading-relaxed tracking-wide text-white max-w-3xl transition-opacity duration-300 ${
              subtitleActive ? "opacity-90 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)", fontFamily: fontFam }}
          >
            {subtitle}
          </p>
        </div>
      )}

      {stage === "prep-loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-40 bg-[#050505]/80 backdrop-blur-[2px]">
          <div className="w-full max-w-md flex flex-col items-center gap-10">
            
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="#0088ff"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - loadingPercent / 100)}
                  className="transition-all duration-500 ease-out"
                  style={{
                    filter: "drop-shadow(0px 0px 8px rgba(0, 136, 255, 0.8))",
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extralight tracking-wider text-white">
                  {loadingPercent}%
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#0088ff] font-medium mt-1">
                  Syncing
                </span>
              </div>
            </div>

            <div className="w-full bg-black/40 border border-white/5 rounded-xl p-6 h-48 overflow-hidden flex flex-col justify-end gap-1.5 font-mono text-[11px] text-white/50 shadow-inner">
              <div className="flex-1 overflow-y-auto flex flex-col gap-2 scrollbar-none pr-1">
                {logList.map((log, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      i === logIndex
                        ? "text-[#e5c158] translate-x-1"
                        : "text-white/40"
                    }`}
                  >
                    <span className="text-[#0088ff] font-bold">▶</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {stage === "welcome" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-40 bg-[#050505]/90 scale-up-entry">
          <div className="space-y-4 max-w-xl">
            <p className="text-white/40 text-xs tracking-[0.25em] uppercase">
              Connection Successful
            </p>
            <h2
              className="text-4xl sm:text-5xl font-light tracking-[0.15em] text-[#e5c158]"
              style={{ fontFamily: fontFam }}
            >
              Welcome, {userName}.
            </h2>
            <p className="text-white/85 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto pt-2">
              Today is a perfect day to discover something extraordinary.
            </p>
            <div className="pt-8">
              <div className="w-1.5 h-1.5 bg-[#e5c158] rounded-full mx-auto animate-ping" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
