'use client';

import { useState } from 'react';

import {
  ProductWithReviewStats,
  WritableReviewItem,
} from '@/types/domain/review';
import PendingReviewList from './pending-review-list';
import ReviewStatusTabs, { ReviewTab } from './review-status-tabs';
import WrittenReviewList from './written-review-list';

interface ReviewManagementContentProps {
  pendingReviews: WritableReviewItem[];
  writtenReviews: ProductWithReviewStats[];
  writtenTotalCount: number;
}

export default function ReviewManagementContent({
  pendingReviews,
  writtenReviews,
  writtenTotalCount,
}: ReviewManagementContentProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>('writable');

  return (
    <section className="px-5 py-6">
      <ReviewStatusTabs
        writableCount={pendingReviews.length}
        writtenCount={writtenTotalCount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'writable' ? (
        pendingReviews.length === 0 ? (
          <p className="mt-8 text-center text-xl text-[#9a9a9a]">
            작성 가능한 리뷰가 없습니다.
          </p>
        ) : (
          <PendingReviewList pendingReviews={pendingReviews} />
        )
      ) : writtenReviews.length === 0 ? (
        <p className="mt-8 text-center text-xl text-[#9a9a9a]">
          작성한 리뷰가 없습니다.
        </p>
      ) : (
        <WrittenReviewList writtenReviews={writtenReviews} />
      )}
    </section>
  );
}
