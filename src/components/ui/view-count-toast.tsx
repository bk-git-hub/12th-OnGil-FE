'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// 토스트 알림 컴포넌트 (8초 후 사라짐)
// 디자인 나오면 수정 필요.

export function ViewCountToast() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    // 컴포넌트가 사라지거나 언마운트될 때 타이머를 초기화
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-none absolute -top-12 left-1/2 flex w-full -translate-x-1/2 justify-center transition-opacity duration-500 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-black/80 px-3 py-1.5 text-[11px] text-white opacity-90 shadow-md">
        👀 12명이 보고있어요
      </div>
    </div>
  );
}
