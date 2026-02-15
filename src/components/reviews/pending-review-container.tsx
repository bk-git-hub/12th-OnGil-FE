import { api } from '@/lib/api-client';
import { WritableReviewItem } from '@/types/domain/review';
import PendingReviewList from './pending-review-list';
import ReviewStatusTabs from './review-status-tabs';

export default async function PendingReviewContainer() {
  const pendingReviews = await api.get<WritableReviewItem[]>(
    '/users/me/reviews/pending',
  );

  if (pendingReviews.length === 0) {
    return (
      <section className="px-5 py-8">
        <ReviewStatusTabs writableCount={0} writtenCount={0} />
        <p className="mt-8 text-center text-xl text-[#9a9a9a]">
          작성 가능한 리뷰가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="px-5 py-6">
      <ReviewStatusTabs writableCount={pendingReviews.length} writtenCount={0} />
      <PendingReviewList pendingReviews={pendingReviews} />
    </section>
  );
}
