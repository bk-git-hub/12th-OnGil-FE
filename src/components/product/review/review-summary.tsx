'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSummaryModal } from './review-summary-modal';
import { ReviewStatsData, ReviewCategorySummary } from '@/types/domain/review';

// 리뷰 요약 섹션 컴포넌트
interface ReviewStatItemProps {
  stat: ReviewCategorySummary;
}

// 개별 리뷰 통계 항목 컴포넌트
function ReviewStatItem({ stat }: ReviewStatItemProps) {
  return (
    <div className="flex flex-col gap-4 text-center text-2xl leading-normal font-medium">
      <div className="flex flex-col items-start justify-center gap-4 p-3">
        <span className="font-semibold">{stat.category}</span>
      </div>
      <div className="flex justify-between px-3">
        <span>{stat.topAnswer || '정보 없음'}</span>
        <span className="font-bold">
          {stat.topAnswerCount ? `${stat.topAnswerCount}명` : '-'}
        </span>
      </div>
    </div>
  );
}

interface ReviewSummarySectionProps {
  stats: ReviewStatsData;
  reviewCount: number;
  availableOptions?: {
    sizes: string[];
    colors: string[];
  };
}

export function ReviewSummarySection({
  stats,
  reviewCount,
  availableOptions = { sizes: [], colors: [] },
}: ReviewSummarySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  if (!stats) return null;

  // 데이터 배열 정의
  const summaryItems = [
    stats.sizeSummary,
    stats.colorSummary,
    stats.materialSummary,
  ];

  return (
    <div className="flex flex-col gap-7 px-4 py-6">
      {/* 1. 평점 및 리뷰 수 */}
      <div className="mb-6 flex items-center gap-6 px-4">
        <Image src="/icons/star.svg" alt="Star Icon" width={54} height={54} />
        <div className="flex items-center gap-24 text-3xl font-bold text-gray-900">
          <span>{stats.averageRating.toFixed(1)}/5</span>
          <span>{reviewCount}개</span>
        </div>
      </div>

      {/* 2. 리뷰 요약 리스트 */}
      <div className="mb-4 flex flex-col gap-[22px]">
        {summaryItems.map((stat) => (
          <ReviewStatItem key={stat.category} stat={stat} />
        ))}
      </div>

      {/* 3. 자세히 보기 버튼 */}
      <Button
        variant="outline"
        className="bg-ongil-teal mt-6 w-full rounded-xl border-gray-300 py-7 text-base font-bold text-white hover:bg-[#00252a] hover:text-white"
        onClick={handleToggleModal}
        aria-expanded={isModalOpen}
      >
        {isModalOpen ? '접기' : '자세히 보기'}
        {isModalOpen ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </Button>

      {/* 4. 팝업 모달 */}
      <ReviewSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stats={stats}
        availableOptions={availableOptions}
      />
    </div>
  );
}
