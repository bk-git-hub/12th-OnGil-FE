'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function ViewCountToast() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        // 위치: 중앙 정렬 및 너비 설정
        'pointer-events-none absolute -top-14 left-0 flex h-14 w-full justify-center px-12 transition-all duration-500 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      )}
    >
      {/* 내부 디자인: w-full로 설정하여 부모 너비(화면 너비)에 맞춤 */}
      <div className="bg-ongil-mint flex w-full items-center rounded-lg shadow-lg backdrop-blur-sm">
        <Image
          src="/icons/fire.svg"
          alt="fire"
          width={25}
          height={34}
          className="mr-3 ml-3 h-auto w-auto"
        />
        <span className="text-2xl font-normal text-black">
          현재 <span className="font-bold">12명</span>이 보고있어요
        </span>
      </div>
    </div>
  );
}
