'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: ReviewTab = tabParam === 'written' ? 'written' : 'writable';

  const handleTabChange = (tab: ReviewTab) => {
    if (tabParam === tab) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('tab', tab);
    const nextSearch = nextParams.toString();
    const nextHref = nextSearch ? `${pathname}?${nextSearch}` : pathname;

    router.replace(nextHref, { scroll: false });
  };

  return (
    <section className="px-5 py-6">
      <ReviewStatusTabs
        writableCount={pendingReviews.length}
        writtenCount={writtenTotalCount}
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
