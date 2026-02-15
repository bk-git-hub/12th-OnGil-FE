import { api } from '@/lib/api-client';
import {
  PageResponse,
  ProductWithReviewStats,
  WritableReviewItem,
} from '@/types/domain/review';
import ReviewManagementContent from './review-management-content';

export default async function ReviewManagementContainer() {
  const [pendingReviews, writtenReviewsPage] = await Promise.all([
    api.get<WritableReviewItem[]>('/users/me/reviews/pending'),
    api.get<PageResponse<ProductWithReviewStats>>('/users/me/reviews', {
      params: {
        page: 0,
        pageSize: 10,
      },
    }),
  ]);

  return (
    <ReviewManagementContent
      pendingReviews={pendingReviews}
      writtenReviews={writtenReviewsPage.content}
      writtenTotalCount={writtenReviewsPage.totalElements}
    />
  );
}
