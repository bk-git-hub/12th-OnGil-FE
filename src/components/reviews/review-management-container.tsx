import { api } from '@/lib/api-client';
import {
  ProductWithReviewStats,
  WritableReviewItem,
} from '@/types/domain/review';
import ReviewManagementContent from './review-management-content';

interface MyReviewsFallbackResponse {
  content?: ProductWithReviewStats[];
  page?: {
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
  };
  data?: MyReviewsFallbackResponse;
}

export default async function ReviewManagementContainer() {
  const [pendingReviews, writtenReviewsPage] = await Promise.all([
    api.get<WritableReviewItem[]>('/users/me/reviews/pending'),
    api.get<MyReviewsFallbackResponse | ProductWithReviewStats[]>(
      '/users/me/reviews',
      {
        params: {
          page: 0,
          pageSize: 10,
        },
      },
    ),
  ]);

  const writtenResponse =
    !Array.isArray(writtenReviewsPage) &&
    writtenReviewsPage &&
    typeof writtenReviewsPage === 'object' &&
    writtenReviewsPage.data &&
    typeof writtenReviewsPage.data === 'object'
      ? writtenReviewsPage.data
      : writtenReviewsPage;
  console.log(
    '[reviews] written response=',
    JSON.stringify(writtenResponse, null, 2),
  );

  const writtenReviews = Array.isArray(writtenResponse)
    ? []
    : Array.isArray(writtenResponse.content)
      ? writtenResponse.content
      : [];

  const writtenTotalCount =
    !Array.isArray(writtenResponse) &&
    typeof writtenResponse.page?.totalElements === 'number'
      ? writtenResponse.page.totalElements
      : undefined;

  if (writtenTotalCount === undefined) {
    throw new Error(
      '[reviews] /users/me/reviews 응답에 page.totalElements가 없습니다.',
    );
  }

  console.log('[reviews] pendingCount=', pendingReviews.length);
  console.log('[reviews] written rawResponse=', writtenReviewsPage);
  console.log(
    '[reviews] written responseType=',
    Array.isArray(writtenResponse) ? 'array' : 'object',
  );
  console.log(
    '[reviews] written responseKeys=',
    Array.isArray(writtenResponse)
      ? ['(array)']
      : Object.keys(writtenResponse || {}),
  );
  console.log(
    '[reviews] written page.totalElements=',
    Array.isArray(writtenResponse)
      ? undefined
      : writtenResponse.page?.totalElements,
  );
  console.log(
    '[reviews] written fallback totalElements=',
    undefined,
  );
  console.log(
    '[reviews] written fallback numberOfElements=',
    undefined,
  );
  console.log(
    '[reviews] written fallback totalCount=',
    undefined,
  );
  console.log('[reviews] written contentLength=', writtenReviews.length);
  console.log('[reviews] written resolvedTotalCount=', writtenTotalCount);

  return (
    <ReviewManagementContent
      pendingReviews={pendingReviews}
      writtenReviews={writtenReviews}
      writtenTotalCount={writtenTotalCount}
    />
  );
}
