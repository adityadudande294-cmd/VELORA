"use client";

import { useState, useRef, useEffect } from "react";

interface ScrollTrackingProps {
  onReachEnd?: () => void;
  active: boolean;
}

export function useScrollTracking({ onReachEnd, active }: ScrollTrackingProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredRef = useRef(false);

  const handleScroll = () => {
    if (!containerRef.current || !active) return;
    const element = containerRef.current;
    const totalHeight = element.scrollHeight - element.clientHeight;
    if (totalHeight <= 0) return;
    const scrolled = (element.scrollTop / totalHeight) * 100;
    
    const progressVal = Math.min(Math.round(scrolled), 100);
    setReadingProgress(progressVal);

    if (progressVal > 97 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      if (onReachEnd) {
        onReachEnd();
      }
    }
  };

  // Reset trigger state when reading toggled off/on
  useEffect(() => {
    if (!active) {
      hasTriggeredRef.current = false;
      setReadingProgress(0);
    }
  }, [active]);

  return {
    readingProgress,
    containerRef,
    handleScroll,
    setReadingProgress
  };
}
