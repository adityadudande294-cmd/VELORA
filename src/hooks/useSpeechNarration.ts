"use client";

import { useState, useEffect, useRef } from "react";

interface SpeechNarrationProps {
  sentences: string[];
  lang: string;
  speed: number;
  onSentenceChange?: (idx: number) => void;
  onPlaybackEnd?: () => void;
}

export function useSpeechNarration({
  sentences,
  lang,
  speed,
  onSentenceChange,
  onPlaybackEnd
}: SpeechNarrationProps) {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const currentSpeechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices and select voice matching the lang
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      
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
    
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [lang]);

  const speakSentenceAtIdx = (idx: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis || idx >= sentences.length) {
      setIsPlayingTTS(false);
      setCurrentSentenceIdx(-1);
      if (onPlaybackEnd) onPlaybackEnd();
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentSentenceIdx(idx);
    setIsPlayingTTS(true);
    if (onSentenceChange) {
      onSentenceChange(idx);
    }

    const txt = sentences[idx];
    const utterance = new SpeechSynthesisUtterance(txt);
    currentSpeechUtteranceRef.current = utterance;

    const activeVoice = voices.find(v => v.name === selectedVoice);
    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    utterance.pitch = 0.95;
    utterance.rate = speed;
    utterance.volume = 1.0;

    // Use local references to execute next sentence playbacks correctly
    utterance.onend = () => {
      const nextIdx = idx + 1;
      if (nextIdx < sentences.length) {
        speakSentenceAtIdx(nextIdx);
      } else {
        setIsPlayingTTS(false);
        setCurrentSentenceIdx(-1);
        if (onPlaybackEnd) onPlaybackEnd();
      }
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis error:", e);
      setIsPlayingTTS(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startNarratorSpeaking = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

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

  const stopNarrator = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
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
      const nextIdx = Math.min(sentences.length - 1, currentSentenceIdx + 1);
      speakSentenceAtIdx(nextIdx);
    }
  };

  // Stop synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isPlayingTTS,
    setIsPlayingTTS,
    currentSentenceIdx,
    setCurrentSentenceIdx,
    voices,
    selectedVoice,
    setSelectedVoice,
    startNarratorSpeaking,
    stopNarrator,
    handleSkipSentence,
    speakSentenceAtIdx
  };
}
