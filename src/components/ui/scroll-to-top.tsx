'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// 클릭시 맨 위로 스크롤되는 버튼 컴포넌트

export function ScrollToTop({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      inert={!isVisible}
      className={cn(
        // 기본 위치 및 스타일
        'fixed right-8 bottom-32 z-40 h-12 w-12 rounded-full border border-gray-200 bg-white shadow-lg',
        // 인터랙션 스타일
        'transition-all duration-300 hover:scale-110 hover:bg-gray-50 active:scale-95',
        // 가시성 제어 (null 리턴 대신 투명도 조절로 애니메이션 구현)
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
        className,
      )}
      aria-label="맨 위로 스크롤"
    >
      <ArrowUp className="h-5 w-5 text-gray-700" />
    </Button>
  );
}
