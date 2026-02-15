import { WritableReviewItem } from '@/types/domain/review';
import PendingReviewCard from './pending-review-card';

interface PendingReviewListProps {
  pendingReviews: WritableReviewItem[];
}

export default function PendingReviewList({
  pendingReviews,
}: PendingReviewListProps) {
  return (
    <ul className="mt-5 space-y-4">
      {pendingReviews.map((review) => (
        <PendingReviewCard key={review.orderItemId} review={review} />
      ))}
    </ul>
  );
}
