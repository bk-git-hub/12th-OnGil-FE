'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useProductInteraction } from '@/components/product/product-interaction-context';

interface ProductStickyContainerProps {
  children: React.ReactNode;
  headerSlot: React.ReactNode; // 헤더 슬롯
  tabBarSlot: React.ReactNode; // 탭 바 슬롯
}

export function ProductStickyContainer({
  children,
  headerSlot,
  tabBarSlot,
}: ProductStickyContainerProps) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // 2. 탭 클릭 시 스크롤 이동 (URL 변경 + 사용자 클릭 시에만 동작)
  useEffect(() => {
    if (shouldScrollToTab && sentinelRef.current) {
      const elementRect = sentinelRef.current.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;

      // 헤더 높이(약 64px) 등을 고려해 조금 더 위(-60)로 조정하면 보기가 좋습니다.
      window.scrollTo({ top: absoluteElementTop, behavior: 'smooth' });
      resetScroll();
    }
  }, [pathname, shouldScrollToTab, resetScroll]);

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
          'sticky top-0 z-50 w-full bg-white transition-shadow duration-300',
          isSticky ? 'shadow-md' : 'shadow-none',
        )}
      >
        <div
          className={cn(
            'overflow-hidden bg-white transition-[height,opacity] duration-300',
            isSticky
              ? 'h-16 border-b border-gray-100 opacity-100'
              : 'h-0 opacity-0',
          )}
        >
          {/* 헤더 슬롯, 스크롤 시 축소되는 영역 */}
          {headerSlot}
        </div>
        {/* 탭 바 슬롯, 항상 보이는 영역 */}
        {tabBarSlot}
      </div>

      <div className="min-h-screen px-4 py-8">{children}</div>
    </div>
  );
}
