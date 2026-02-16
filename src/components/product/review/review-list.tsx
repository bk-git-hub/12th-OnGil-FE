'use client';

import { useEffect, useState } from 'react';
import { getProductReviewsAction } from '@/app/actions/review';
import { ReviewItem } from './review-item';
import { ReviewTabType } from './review-tabs';
import {
  FilterState,
  SortOptionType,
  ProductReviewListItem,
} from '@/types/domain/review';
import { Button } from '@/components/ui/button';

interface ReviewListProps {
  productId: number;
  activeTab: ReviewTabType;
  filters: FilterState;
  sortOption: SortOptionType;
}

function resolvePageNumber(response: {
  number?: number;
  pageable?: { pageNumber?: number };
}) {
  if (typeof response.number === 'number' && Number.isFinite(response.number)) {
    return response.number;
  }
  if (
    typeof response.pageable?.pageNumber === 'number' &&
    Number.isFinite(response.pageable.pageNumber)
  ) {
    return response.pageable.pageNumber;
  }
  return 0;
}

function resolveHasMore(response: {
  last?: boolean;
  totalPages?: number;
  number?: number;
  pageable?: { pageNumber?: number };
}) {
  if (typeof response.last === 'boolean') {
    return !response.last;
  }
  const currentPage = resolvePageNumber(response);
  const totalPages = response.totalPages ?? 0;
  return totalPages > currentPage + 1;
}

function toApiSort(sortOption: SortOptionType) {
  switch (sortOption) {
    case 'newest':
      return 'RECENT';
    case 'highRating':
      return 'RATING_HIGH';
    case 'lowRating':
      return 'RATING_LOW';
    case 'best':
    default:
      return 'BEST';
  }
}

function buildEmptyMessage(filters: FilterState) {
  if (filters.mySize) {
    return '유사 체형 구매 정보가 충분하지 않아요';
  }

  const selectedOptions = [...filters.colors, ...filters.sizes];
  if (selectedOptions.length > 0) {
    return `아직 "${selectedOptions.join('/')}" 옵션을 고른 분들의 후기가 없어요`;
  }

  return '조건에 맞는 리뷰가 없습니다.';
}

export default function ReviewList({
  productId,
  activeTab,
  filters,
  sortOption,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ProductReviewListItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeReviewType = activeTab === 'month' ? 'ONE_MONTH' : 'INITIAL';
  const selectedSizes = filters.sizes.length > 0 ? filters.sizes : undefined;
  const selectedColors = filters.colors.length > 0 ? filters.colors : undefined;

  useEffect(() => {
    const fetchFirstPage = async () => {
      setIsLoading(true);
      try {
        const response = await getProductReviewsAction(productId, {
          reviewType: activeReviewType,
          size: selectedSizes,
          color: selectedColors,
          sort: toApiSort(sortOption),
          mySizeOnly: filters.mySize,
          page: 0,
          pageSize: 10,
        });

        setReviews(response.content);
        setPage(resolvePageNumber(response));
        setHasMore(resolveHasMore(response));
      } catch (error) {
        console.error('리뷰 목록 조회 실패:', error);
        setReviews([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFirstPage();
  }, [
    productId,
    activeReviewType,
    selectedSizes,
    selectedColors,
    sortOption,
    filters.mySize,
  ]);

  const hasActiveFilters =
    filters.mySize || filters.sizes.length > 0 || filters.colors.length > 0;

  if (!isLoading && reviews.length === 0) {
    const emptyMessage = buildEmptyMessage(filters);

    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
        {hasActiveFilters && (
          <p className="mt-2 text-sm text-gray-400">
            필터 조건을 변경해 보세요.
          </p>
        )}
      </div>
    );
  }

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    const nextPage = Number.isFinite(page) ? page + 1 : 1;

    const fetchNextPage = async () => {
      setIsLoading(true);
      try {
        const response = await getProductReviewsAction(productId, {
          reviewType: activeReviewType,
          size: selectedSizes,
          color: selectedColors,
          sort: toApiSort(sortOption),
          mySizeOnly: filters.mySize,
          page: nextPage,
          pageSize: 10,
        });

        setReviews((prev) => [...prev, ...response.content]);
        setPage(resolvePageNumber(response));
        setHasMore(resolveHasMore(response));
      } catch (error) {
        console.error('리뷰 목록 추가 조회 실패:', {
          error,
          query: {
            productId,
            reviewType: activeReviewType,
            size: selectedSizes,
            color: selectedColors,
            sort: toApiSort(sortOption),
            mySizeOnly: filters.mySize,
            page: nextPage,
            pageSize: 10,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextPage();
  };

  return (
    <div className="px-4">
      {reviews.map((review) => (
        <ReviewItem key={review.reviewId} review={review} />
      ))}

      {isLoading && (
        <div className="py-6 text-center text-sm text-gray-500">
          리뷰를 불러오는 중...
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="mt-4 pb-8 text-center">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black"
            onClick={handleLoadMore}
          >
            리뷰 더보기
          </Button>
        </div>
      )}
    </div>
  );
}
