'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useProductInteraction } from '@/components/product';

interface ProductStickyContainerProps {
  children: React.ReactNode;
  tabBarSlot: React.ReactNode; // 탭 바 슬롯
}

export function ProductStickyContainer({
  children,
  tabBarSlot,
}: ProductStickyContainerProps) {
  const HEADER_HEIGHT = 90;
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { shouldScrollToTab, resetScroll } = useProductInteraction();

  // 1. 스크롤 감지 (Sticky UI 토글)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. 탭 클릭 시 스크롤 이동 (사용자 클릭 시에만 동작)
  useEffect(() => {
    if (shouldScrollToTab && sentinelRef.current) {
      const elementRect = sentinelRef.current.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;

      window.scrollTo({
        top: Math.max(absoluteElementTop - HEADER_HEIGHT, 0),
        behavior: 'smooth',
      });
      resetScroll();
    }
  }, [shouldScrollToTab, resetScroll]);

  return (
    <div className="relative">
      {/* 감지용 Sentinel */}
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute -top-1 h-1 w-full"
      />

      {/* Sticky 영역 */}
      <div
        className={cn(
          'sticky top-[90px] z-40 w-full bg-white transition-shadow duration-300',
          isSticky ? 'shadow-md' : 'shadow-none',
        )}
      >
        {/* 탭 바 슬롯, 항상 보이는 영역 */}
        {tabBarSlot}
      </div>

      <div className="min-h-screen px-4 py-8">{children}</div>
    </div>
  );
}
