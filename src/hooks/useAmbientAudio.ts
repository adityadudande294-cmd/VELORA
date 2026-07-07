"use client";

import { useState, useEffect, useRef } from "react";
import { AmbientTheme } from "../types";

export function useAmbientAudio() {
  const [ambientTheme, setAmbientTheme] = useState<AmbientTheme>("library");
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const themeIntervalRef = useRef<any>(null);

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
    osc.stop(ctx.currentTime + 0.16);
  };

  const playPageFlipSound = () => {
    let ctx = audioContextRef.current;
    if (!ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        ctx = new AudioContextClass();
        audioContextRef.current = ctx;
      }
    }
    if (!ctx || isMuted) return;

    try {
      const noiseNode = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const bufferSize = Math.floor(0.28 * ctx.sampleRate);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseNode.buffer = buffer;

      filter.type = "bandpass";
      filter.Q.setValueAtTime(3.0, ctx.currentTime);
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start();
      noiseNode.stop(ctx.currentTime + 0.28);
    } catch (e) {
      // Fallback to normal tick sound
      playClickSound();
    }
  };

  return {
    ambientTheme,
    setAmbientTheme,
    isMuted,
    setIsMuted,
    volume,
    setVolume,
    playClickSound,
    playPageFlipSound
  };
}
