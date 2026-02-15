import { ProductWithReviewStats } from '@/types/domain/review';
import WrittenReviewCard from './written-review-card';

interface WrittenReviewListProps {
  writtenReviews: ProductWithReviewStats[];
}

export default function WrittenReviewList({
  writtenReviews,
}: WrittenReviewListProps) {
  return (
    <ul className="mt-5 space-y-4">
      {writtenReviews.map((review, index) => (
        <WrittenReviewCard key={`${review.id}-${index}`} review={review} />
      ))}
    </ul>
  );
}
