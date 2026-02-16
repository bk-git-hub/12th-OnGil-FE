'use client';

import { useState } from 'react';
import { MaterialDescription } from '@/types/domain/product';
import {
  ReviewStatsData,
  FilterState,
  SortOptionType,
} from '@/types/domain/review';

import AiMaterialCarousel from './ai-material-carousel';
import ReviewTabs, { ReviewTabType } from './review-tabs';
import ReviewSummarySection from './review-summary';
import ReviewList from './review-list';
import ReviewOptionSheet from './review-option-sheet';
import ReviewSortSheet from './review-sort-sheet';
import EmptyReviewState from './empty-review-state';

import { Switch } from '@/components/ui/switch';
import Label from '@/components/ui/label';

// 상품 리뷰 섹션 컴포넌트, 리뷰 탭, 필터, 정렬, 리뷰 리스트 포함
// 리뷰 관련 모든 UI와 상태 관리를 담당

interface ProductReviewContentProps {
  productInfo: {
    productId: number;
    name: string;
    materialDescription?: MaterialDescription;
    materialName?: string;
    availableOptions: {
      sizes: string[];
      colors: string[];
    };
    recommendedSize?: string;
  };
  stats: ReviewStatsData;
  monthStats?: ReviewStatsData;
}

function createEmptyStats(oneMonthReviewCount: number): ReviewStatsData {
  return {
    averageRating: 0,
    initialReviewCount: 0,
    oneMonthReviewCount,
    sizeSummary: {
      category: '사이즈',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
    colorSummary: {
      category: '색감',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
    materialSummary: {
      category: '소재',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
  };
}

/**
 * 상품 리뷰 섹션 컴포넌트, 리뷰 탭, 필터, 정렬, 리뷰 리스트 포함
 * 리뷰 관련 모든 UI와 상태 관리를 담당
 * @param {ProductReviewContentProps} props - 컴포넌트 props
 * @param {Object} props.productInfo - 상품 정보
 * @param {number} props.productInfo.productId - 상품 ID
 * @param {string} props.productInfo.name - 상품 이름
 * @param {MaterialDescription} [props.productInfo.materialDescription] - 소재 설명
 * @param {string} [props.productInfo.materialName] - 소재 이름
 * @param {Object} props.productInfo.availableOptions - 사용 가능한 옵션
 * @param {string[]} props.productInfo.availableOptions.sizes - 사이즈 목록
 * @param {string[]} props.productInfo.availableOptions.colors - 색상 목록
 * @param {ReviewStatsData} props.stats - 일반 리뷰 통계
 * @param {ReviewStatsData} [props.monthStats] - 한달 후 리뷰 통계
 * @returns {JSX.Element} 상품 리뷰 컨텐츠 컴포넌트
 */
export default function ProductReviewContent({
  productInfo,
  stats,
  monthStats,
}: ProductReviewContentProps) {
  const [activeReviewTab, setActiveReviewTab] =
    useState<ReviewTabType>('general');
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    colors: [],
    mySize: false,
  });
  const [sortOption, setSortOption] = useState<SortOptionType>('best');

  // 현재 탭에 맞는 통계 데이터 선택
  const currentDisplayStats =
    activeReviewTab === 'month'
      ? (monthStats ?? createEmptyStats(stats.oneMonthReviewCount))
      : stats;

  // 현재 탭에 맞는 리뷰 총 개수
  const currentTotalCount =
    activeReviewTab === 'month'
      ? stats.oneMonthReviewCount
      : stats.initialReviewCount;

  // 리뷰가 아예 없는지 여부
  const isTotallyEmpty =
    stats.initialReviewCount + stats.oneMonthReviewCount === 0;
  const isMonthTabEmpty =
    activeReviewTab === 'month' && stats.oneMonthReviewCount === 0;

  // 탭 변경 시 필터 초기화
  const handleTabChange = (tab: ReviewTabType) => {
    setActiveReviewTab(tab);
    setFilters((prev) => ({
      ...prev,
      sizes: [],
      colors: [],
    }));
  };

  // 내 사이즈만 보기 토글
  const handleMySizeToggle = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, mySize: checked }));
  };

  // 옵션 필터 적용
  const handleApplyFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (isTotallyEmpty) return <EmptyReviewState />;

  return (
    <div className="flex flex-col gap-6 space-y-0 pb-10">
      {/* 1. 상단 AI 소재 분석 캐러셀 */}
      <div className="px-4 py-6">
        <AiMaterialCarousel
          materialDescription={productInfo.materialDescription}
          materialName={productInfo.materialName || 'Unknown Material'}
        />
      </div>

      <div className="h-2 w-full bg-gray-100" />

      {/* 2. 리뷰 타이틀 및 개수 */}
      <div className="mt-[20px] px-4 leading-normal font-semibold not-italic">
        <span className="text-3xl">리뷰 </span>
        <span className="text-ongil-teal text-3xl">
          {stats.initialReviewCount + stats.oneMonthReviewCount}
        </span>
      </div>

      {/* 3. 탭 (전체 / 한달 사용) */}
      <ReviewTabs
        activeTab={activeReviewTab}
        onTabChange={handleTabChange}
        generalCount={stats.initialReviewCount}
        monthCount={stats.oneMonthReviewCount}
      />

      <>
        {isMonthTabEmpty ? (
          <EmptyReviewState variant="month" />
        ) : (
          <>
            {/* 통계 요약 섹션 */}
            <ReviewSummarySection
              productId={productInfo.productId}
              reviewType={activeReviewTab === 'month' ? 'ONE_MONTH' : 'INITIAL'}
              recommendedSize={productInfo.recommendedSize}
              stats={currentDisplayStats}
              reviewCount={currentTotalCount}
              availableOptions={productInfo.availableOptions}
            />

            {/* Sticky 필터/정렬 바 */}
            <div className="sticky top-[188px] z-20 flex flex-col gap-3 bg-white px-4 py-3 transition-all">
              {/* 내 사이즈 보기 스위치 */}
              <div className="flex justify-end space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="my-size-mode"
                    checked={filters.mySize}
                    onCheckedChange={handleMySizeToggle}
                    className="data-[state=checked]:bg-[#34C759]"
                  />
                  <Label
                    htmlFor="my-size-mode"
                    className="cursor-pointer text-2xl leading-normal font-medium not-italic"
                  >
                    내 사이즈만 보기
                  </Label>
                </div>
              </div>
              <div className="border-ongil-teal flex items-center justify-between border-y py-[10px]">
                <ReviewOptionSheet
                  availableSizes={productInfo.availableOptions.sizes}
                  availableColors={productInfo.availableOptions.colors}
                  filters={filters}
                  onApply={handleApplyFilters}
                />
                <ReviewSortSheet
                  currentSort={sortOption}
                  onSortChange={setSortOption}
                />
              </div>
            </div>

            {/* 리뷰 리스트 */}
            <ReviewList
              productId={productInfo.productId}
              activeTab={activeReviewTab}
              filters={filters}
              sortOption={sortOption}
            />
          </>
        )}
      </>
    </div>
  );
}
