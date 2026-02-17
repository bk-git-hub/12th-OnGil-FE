'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewSummaryModal from './review-summary-modal';
import { EVALUATION_MAP, MONTH_REVIEW_QUESTIONS } from './review-constants';
import { fetchAllProductReviews } from './review-fetch-utils';
import { buildCategorySummaryFromReviews } from './review-summary-utils';
import { ReviewStatsData, ReviewCategorySummary } from '@/types/domain/review';

// 리뷰 요약 섹션 컴포넌트
interface ReviewStatItemProps {
  stat: ReviewCategorySummary;
  title?: string;
  subtitle?: string;
}

// 개별 리뷰 통계 항목 컴포넌트
function ReviewStatItem({ stat, title, subtitle }: ReviewStatItemProps) {
  const topAnswerText = stat.topAnswer
    ? (EVALUATION_MAP[stat.topAnswer] ?? stat.topAnswer)
    : '정보 없음';

  return (
    <div className="flex flex-col gap-4 text-center text-2xl leading-normal font-medium">
      <div className="flex flex-col items-start justify-center gap-4 p-3">
        <span className="font-semibold">{title ?? stat.category}</span>
        {subtitle && (
          <span className="text-sm font-medium text-gray-500">{subtitle}</span>
        )}
      </div>
      <div className="flex justify-between px-3">
        <span>{topAnswerText}</span>
        <span className="font-bold">
          {stat.topAnswerCount ? `${stat.topAnswerCount}명` : '-'}
        </span>
      </div>
    </div>
  );
}

interface ReviewSummarySectionProps {
  productId: number;
  reviewType: 'INITIAL' | 'ONE_MONTH';
  recommendedSize?: string;
  stats: ReviewStatsData;
  reviewCount: number;
  availableOptions?: {
    sizes: string[];
    colors: string[];
  };
}

/**
 * 리뷰 요약 섹션 컴포넌트
 * @param {ReviewSummarySectionProps} props - 컴포넌트 props
 * @param {ReviewStatsData} props.stats - 리뷰 통계 데이터
 * @param {number} props.reviewCount - 리뷰 개수
 * @param {{ sizes: string[]; colors: string[] }} [props.availableOptions] - 사용 가능한 옵션
 * @returns {JSX.Element} 리뷰 요약 섹션 컴포넌트
 */
export default function ReviewSummarySection({
  productId,
  reviewType,
  recommendedSize,
  stats,
  reviewCount,
  availableOptions = { sizes: [], colors: [] },
}: ReviewSummarySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [monthQuestionSummaries, setMonthQuestionSummaries] = useState<
    ReviewCategorySummary[] | null
  >(null);

  const handleToggleModal = useCallback(() => {
    if (!isModalOpen) {
      setModalKey((prev) => prev + 1);
    }
    setIsModalOpen((prev) => !prev);
  }, [isModalOpen]);

  useEffect(() => {
    if (!stats || reviewType !== 'ONE_MONTH' || reviewCount === 0) return;

    let isMounted = true;

    fetchAllProductReviews(productId, {
      reviewType: 'ONE_MONTH',
      sort: 'BEST',
    })
      .then((response) => {
        if (!isMounted) return;
        const first = buildCategorySummaryFromReviews(
          stats.sizeSummary.category,
          response,
          'overall',
        );
        const second = buildCategorySummaryFromReviews(
          stats.colorSummary.category,
          response,
          'changes',
        );
        setMonthQuestionSummaries([first, second]);
      })
      .catch((error) => {
        console.error('한달 후 리뷰 요약 조회 실패:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [reviewType, reviewCount, productId, stats]);

  if (!stats) return null;

  // 데이터 배열 정의
  const isMonthReview = reviewType === 'ONE_MONTH';
  const effectiveMonthSummaries = isMonthReview ? monthQuestionSummaries : null;
  const summaryItems = isMonthReview
    ? (effectiveMonthSummaries ?? [stats.sizeSummary, stats.colorSummary])
    : [stats.sizeSummary, stats.colorSummary, stats.materialSummary];

  return (
    <div className="flex flex-col gap-7 px-4 py-6">
      {/* 1. 상단 요약 */}
      {isMonthReview ? (
        <div className="mb-6 px-4">
          <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
            <span>한달 후 리뷰 요약</span>
            <span>{reviewCount}개</span>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-6 px-4">
          <Image src="/icons/star.svg" alt="Star Icon" width={54} height={54} />
          <div className="flex items-center gap-24 text-3xl font-bold text-gray-900">
            <span>{stats.averageRating.toFixed(1)}/5</span>
            <span>{reviewCount}개</span>
          </div>
        </div>
      )}

      {/* 2. 리뷰 요약 리스트 */}
      <div className="mb-4 flex flex-col gap-[22px]">
        {summaryItems.map((stat, index) => (
          <ReviewStatItem
            key={`${stat.category}-${index}`}
            stat={stat}
            title={
              isMonthReview
                ? MONTH_REVIEW_QUESTIONS[index]?.title ?? stat.category
                : stat.category
            }
            subtitle={isMonthReview ? stat.category : undefined}
          />
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
        key={modalKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        reviewType={reviewType}
        recommendedSize={recommendedSize}
        stats={stats}
        initialMonthSummaries={monthQuestionSummaries ?? undefined}
        availableOptions={availableOptions}
      />
    </div>
  );
}
