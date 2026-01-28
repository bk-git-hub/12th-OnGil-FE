'use client';

import { useState } from 'react';
import { ProductDetail } from '@/types/domain/product';
import { AiMaterialCarousel } from '@/components/product/review/ai-material-carousel';
import {
  ReviewTabs,
  ReviewTabType,
} from '@/components/product/review/review-tabs';

interface ProductReviewContentProps {
  product: ProductDetail & {
    reviewCount?: number;
    monthReviewCount?: number;
    materialOriginal?: string;
  };
}

export function ProductReviewContent({ product }: ProductReviewContentProps) {
  const [activeReviewTab, setActiveReviewTab] = useState<ReviewTabType>('all');

  const reviewCount = product.reviewCount || 0;
  const monthReviewCount = product.monthReviewCount || 0;

  return (
    <div className="flex flex-col gap-6 space-y-0 pb-10">
      {/* 1. AI 소재 설명 & 혼용률 */}
      <div className="px-4 py-6">
        <AiMaterialCarousel
          materialDescription={product.materialDescription}
          materialName={product.materialOriginal}
        />
      </div>

      <div className="not-itatlic mt-[51px] px-4 leading-normal font-semibold">
        <span className="text-3xl">리뷰 </span>
      </div>

      {/* 2. 리뷰 탭 */}
      <ReviewTabs
        activeTab={activeReviewTab}
        onTabChange={setActiveReviewTab}
        reviewCount={reviewCount}
        monthReviewCount={monthReviewCount}
      />

      {/* 3. 리뷰 리스트 영역 */}
      <div className="px-4 py-6">
        {activeReviewTab === 'all' ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3 rounded-lg bg-gray-50 py-10 text-center text-gray-500">
            <p className="font-medium text-gray-900">전체 리뷰</p>
            <p className="text-sm">작성된 모든 리뷰가 이곳에 표시됩니다.</p>
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3 rounded-lg bg-gray-50 py-10 text-center text-gray-500">
            <p className="font-medium text-gray-900">한달 후 리뷰 </p>
            <p className="text-sm">
              구매 후 한 달이 지난 사용자들의 리뷰입니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
