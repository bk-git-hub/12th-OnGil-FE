'use client';

import { useState, useEffect, useRef, useTransition } from 'react';

// 현재 보고 있는 카테고리 탭을 자동으로 활성화하고, 탭 클릭시 해당 섹션으로 이동하는 커스텀 훅 .

export function useScrollSpy(ids: string[]) {
  // ids가 비어있을 경우를 대비 하여 기본값 설정
  const [activeId, setActiveId] = useState<string>(ids[0] || '');
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 환경에 상관없이 setTimeout 반환 타입을 안전하게 추론 하도록 수정
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToId = (id: string) => {
    isClickScrolling.current = true;

    startTransition(() => {
      setActiveId(id);
    });

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000); // 모바일 스크롤 고려.
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || ids.length === 0) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        const visibleSection = entries.reduce(
          (max, entry) => {
            return entry.isIntersecting &&
              entry.intersectionRect.height > max.height
              ? { height: entry.intersectionRect.height, id: entry.target.id }
              : max;
          },
          { height: 0, id: '' },
        );

        if (visibleSection.id) {
          setActiveId((prev) =>
            prev === visibleSection.id ? prev : visibleSection.id,
          );
        }
      },
      {
        root: container,
        rootMargin: '-50px 0px -90% 0px',
        threshold: [0, 0.01, 0.1, 0.5],
      },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ids]);

  return { activeId, scrollToId, containerRef };
}
