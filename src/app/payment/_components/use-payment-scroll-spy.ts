'use client';

import { useState, useEffect, useRef, useTransition } from 'react';

const HEADER_HEIGHT = 220;

// 특정 섹션 ID 배열을 받아 스크롤 스파이 기능을 제공하는 훅(use-scroll-spy 훅 기반)

export default function usePaymentScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] || '');
  const [, startTransition] = useTransition();

  const isClickScrolling = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToId = (id: string) => {
    isClickScrolling.current = true;

    startTransition(() => {
      setActiveId(id);
    });

    const element = document.getElementById(id);
    if (element) {
      const top =
        element.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (ids.length === 0) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_HEIGHT + 40) {
          current = id;
        }
      }

      startTransition(() => {
        setActiveId((prev) => (prev === current ? prev : current));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ids]);

  return { activeId, scrollToId };
}
