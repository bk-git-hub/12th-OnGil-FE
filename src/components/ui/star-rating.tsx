'use client';

import { StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// 별점 표시 컴포넌트

interface StarRatingProps {
  rating: number; // 1.0 ~ 5.0 점수
  max?: number; // 별 최대 개수
  size?: number; // 아이콘 크기
  className?: string; // 추가 스타일
}

export function StarRating({
  rating,
  max = 5,
  size = 20,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const index = i + 1;
        if (rating >= index) {
          return (
            <Image
              key={i}
              src="/icons/star.svg"
              alt="star-full"
              width={size}
              height={size}
            />
          );
        }
        // 추후 피그마에 반별 아이콘 업로드시 교체 예정
        if (rating >= index - 0.5) {
          return (
            <StarHalf key={i} size={size} className="fill-yellow text-black" />
          );
        }

        return (
          <Image
            key={i}
            src="/icons/star.svg"
            alt="star-full"
            width={size}
            height={size}
          />
        );
      })}
    </div>
  );
}
