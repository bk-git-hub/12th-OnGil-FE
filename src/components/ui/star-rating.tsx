'use client';

import { StarHalf, Star } from 'lucide-react'; // 빈 별 표현을 위해 Star 아이콘 추가
import { cn } from '@/lib/utils';
import Image from 'next/image';

// 별점 표시 컴포넌트

interface StarRatingProps {
  rating: number; // 1.0 ~ 5.0 점수
  max?: number; // 별 최대 개수
  size?: number; // 아이콘 크기
  className?: string; // 추가 스타일
}

/**
 * 별점을 표시하는 컴포넌트
 * @param {StarRatingProps} props - 컴포넌트 props
 * @param {number} props.rating - 1.0 ~ 5.0 점수
 * @param {number} [props.max=5] - 별 최대 개수
 * @param {number} [props.size=16] - 아이콘 크기
 * @param {string} [props.className] - 추가 스타일 클래스
 * @returns {JSX.Element} 별점 컴포넌트
 */
export default function StarRating({
  rating,
  max = 5,
  size = 16,
  className,
}: StarRatingProps) {
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      aria-label={`${max}점 만점에 ${rating}점`}
    >
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
            <StarHalf
              key={i}
              size={size}
              className="fill-yellow-400 text-yellow-400"
            />
          );
        }
        return (
          <Image
            key={i}
            src="/icons/star-gray.svg"
            alt="star-empty"
            width={size}
            height={size}
          />
        );
      })}
    </div>
  );
}
