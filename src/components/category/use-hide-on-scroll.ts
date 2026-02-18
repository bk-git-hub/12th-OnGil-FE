'use client';

import { useEffect, useRef, useState } from 'react';

interface UseHideOnScrollOptions {
  topOffset?: number;
  scrollDelta?: number;
  initialVisible?: boolean;
}

export default function useHideOnScroll(options: UseHideOnScrollOptions = {}) {
  const { topOffset = 24, scrollDelta = 10, initialVisible = true } = options;

  const [isVisible, setIsVisible] = useState(initialVisible);
  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(initialVisible);
  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const updateVisibility = () => {
      tickingRef.current = false;
      const currentY = Math.max(window.scrollY, 0);
      const diff = currentY - lastScrollYRef.current;

      if (currentY <= topOffset) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollYRef.current = currentY;
        return;
      }

      if (Math.abs(diff) < scrollDelta) return;

      const nextVisible = diff < 0;
      if (nextVisible !== isVisibleRef.current) {
        isVisibleRef.current = nextVisible;
        setIsVisible(nextVisible);
      }

      lastScrollYRef.current = currentY;
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafIdRef.current = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [topOffset, scrollDelta]);

  return isVisible;
}
