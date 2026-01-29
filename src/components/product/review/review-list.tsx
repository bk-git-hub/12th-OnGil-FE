'use client';

import { generateMockReviews } from '@/mocks/review-data';
import { ReviewItem } from './review-item';
import { ReviewTabType } from './review-tabs';
import {
  FilterState,
  SortOptionType,
  CurrentUserType,
  ReviewDetail,
} from '@/types/domain/review';
import { Button } from '@/components/ui/button';

// 리뷰 리스트 컴포넌트, 필터링 및 정렬 기능 포함

interface ReviewListProps {
  activeTab: ReviewTabType;
  totalCount: number;
  filters: FilterState;
  sortOption: SortOptionType;
  currentUser: CurrentUserType;
}
// 리뷰 정렬 함수

function sortReviews(reviews: ReviewDetail[], option: SortOptionType) {
  return [...reviews].sort((a, b) => {
    switch (option) {
      case 'newest':
        return b.createdAt.localeCompare(a.createdAt);
      case 'highRating':
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.createdAt.localeCompare(a.createdAt);
      case 'lowRating':
        if (a.rating !== b.rating) return a.rating - b.rating;
        return b.createdAt.localeCompare(a.createdAt);
      case 'best':
      default:
        return b.helpfulCount - a.helpfulCount;
    }
  });
}

// 메인 컴포넌트
export function ReviewList({
  activeTab,
  totalCount,
  filters,
  sortOption,
  currentUser,
}: ReviewListProps) {
  // 1. Mock 데이터 생성
  const rawReviews = generateMockReviews(totalCount);

  // 2. 필터링 로직
  const filteredReviews = rawReviews.filter((review) => {
    // 2-1. 탭 필터 (일반 vs 한달사용)
    const targetType = activeTab === 'month' ? 'MONTH' : 'NORMAL';
    if (review.reviewType !== targetType) return false;

    // 2-2. 내 사이즈 필터
    if (filters.mySize) {
      const heightDiff = Math.abs(review.reviewer.height - currentUser.height);
      const weightDiff = Math.abs(review.reviewer.weight - currentUser.weight);
      if (heightDiff > 5 || weightDiff > 5) return false;
    }

    // 2-3. 옵션(사이즈) 필터
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.includes(review.purchaseOption.selectedSize)
    ) {
      return false;
    }

    // 2-4. 옵션(색상) 필터
    if (
      filters.colors.length > 0 &&
      !filters.colors.includes(review.purchaseOption.selectedColor)
    ) {
      return false;
    }

    return true;
  });

  // 3. 정렬 적용
  const processedReviews = sortReviews(filteredReviews, sortOption);

  if (processedReviews.length === 0) {
    const hasActiveFilters =
      filters.mySize || filters.sizes.length > 0 || filters.colors.length > 0;

    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500">조건에 맞는 리뷰가 없습니다.</p>
        {hasActiveFilters && (
          <p className="mt-2 text-sm text-gray-400">
            필터 조건을 변경해 보세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="px-4">
      {processedReviews.map((review) => (
        <ReviewItem key={review.reviewId} review={review} />
      ))}

      <div className="mt-4 pb-8 text-center">
        <Button
          variant="outline"
          className="h-12 w-full rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black"
          onClick={() => alert('더 많은 리뷰를 불러옵니다.')}
        >
          리뷰 더보기
        </Button>
      </div>
    </div>
  );
}
