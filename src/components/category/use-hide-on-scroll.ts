'use client';

import { useEffect, useRef, useState } from 'react';

interface UseHideOnScrollOptions {
  topOffset?: number;
  hideDelta?: number;
  showDelta?: number;
  freezeAfterToggleMs?: number;
  initialVisible?: boolean;
}

export default function useHideOnScroll(options: UseHideOnScrollOptions = {}) {
  const {
    topOffset = 24,
    hideDelta = 12,
    showDelta = 28,
    freezeAfterToggleMs = 340,
    initialVisible = true,
  } = options;

  const [isVisible, setIsVisible] = useState(initialVisible);
  const anchorYRef = useRef(0);
  const isVisibleRef = useRef(initialVisible);
  const tickingRef = useRef(false);
  const scrollRafIdRef = useRef<number | null>(null);
  const anchorSyncRafIdRef = useRef<number | null>(null);
  const lockUntilRef = useRef(0);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const safeHideDelta = Math.max(hideDelta, 0);
    const safeShowDelta = Math.max(showDelta, 0);
    const safeFreezeAfterToggleMs = Math.max(freezeAfterToggleMs, 0);

    anchorYRef.current = Math.max(window.scrollY, 0);

    const toggleVisibility = (nextVisible: boolean) => {
      if (nextVisible === isVisibleRef.current) return;

      isVisibleRef.current = nextVisible;
      setIsVisible(nextVisible);
      lockUntilRef.current = performance.now() + safeFreezeAfterToggleMs;

      if (anchorSyncRafIdRef.current !== null) {
        window.cancelAnimationFrame(anchorSyncRafIdRef.current);
      }
      anchorSyncRafIdRef.current = window.requestAnimationFrame(() => {
        anchorYRef.current = Math.max(window.scrollY, 0);
      });
    };

    const updateVisibility = () => {
      tickingRef.current = false;
      const currentY = Math.max(window.scrollY, 0);

      if (currentY <= topOffset) {
        anchorYRef.current = currentY;
        toggleVisibility(true);
        return;
      }

      if (performance.now() < lockUntilRef.current) {
        anchorYRef.current = currentY;
        return;
      }

      const distanceFromAnchor = currentY - anchorYRef.current;
      if (isVisibleRef.current) {
        if (distanceFromAnchor >= safeHideDelta) {
          toggleVisibility(false);
        }
        return;
      }

      if (distanceFromAnchor <= -safeShowDelta) {
        toggleVisibility(true);
      }
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      scrollRafIdRef.current = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafIdRef.current !== null) {
        window.cancelAnimationFrame(scrollRafIdRef.current);
      }
      if (anchorSyncRafIdRef.current !== null) {
        window.cancelAnimationFrame(anchorSyncRafIdRef.current);
      }
    };
  }, [topOffset, hideDelta, showDelta, freezeAfterToggleMs]);

  return isVisible;
}
