import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { api } from '@/lib/api-client';
import { ReviewDetail } from '@/types/domain/review';
import { CloseButton } from '@/components/ui/close-button';
import { auth } from '/auth';

export const metadata: Metadata = {
  title: '리뷰 상세보기 | OnGil',
  description: '리뷰 상세보기 페이지입니다.',
};

interface ReviewDetailJsonPageProps {
  params: Promise<{ reviewId: string }>;
  searchParams: Promise<{ productId?: string }>;
}

export default async function ReviewDetailJsonPage({
  params,
  searchParams,
}: ReviewDetailJsonPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { reviewId } = await params;
  const query = await searchParams;
  const numericReviewId = Number(reviewId);
  const numericProductId = query.productId ? Number(query.productId) : NaN;

  if (!Number.isFinite(numericReviewId)) {
    notFound();
  }

  let resolvedReviewId = numericReviewId;
  let reviewDetail: ReviewDetail | null = null;

  try {
    reviewDetail = await api.get<ReviewDetail>(
      `/reviews/${resolvedReviewId}/details`,
    );
  } catch (error) {
    // 목록의 id가 productId인 경우를 대비해 productId -> reviewId 매핑 재시도
    if (Number.isFinite(numericProductId)) {
      interface WrittenReviewLookupItem {
        id: number;
        reviewId?: number;
      }
      interface WrittenReviewLookupResponse {
        content?: WrittenReviewLookupItem[];
        data?: WrittenReviewLookupResponse;
      }

      const writtenReviewsResponse = await api.get<WrittenReviewLookupResponse>(
        '/users/me/reviews',
        {
          params: {
            page: 0,
            pageSize: 100,
          },
        },
      );

      const unwrappedResponse = writtenReviewsResponse.data ?? writtenReviewsResponse;
      const writtenReviews = Array.isArray(unwrappedResponse.content)
        ? unwrappedResponse.content
        : [];

      const matchedReview = writtenReviews.find(
        (item) =>
          item.id === numericProductId && typeof item.reviewId === 'number',
      );

      if (matchedReview?.reviewId) {
        resolvedReviewId = matchedReview.reviewId;
        reviewDetail = await api.get<ReviewDetail>(
          `/reviews/${resolvedReviewId}/details`,
        );
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-[#d9d9d9] bg-white py-4">
        <h1 className="text-2xl font-semibold">리뷰 상세보기</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href="/reviews" />
        </div>
      </header>

      <section className="px-5 py-6">
        <pre className="overflow-x-auto rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] p-4 text-sm leading-relaxed text-black">
          {JSON.stringify(reviewDetail, null, 2)}
        </pre>
      </section>
    </main>
  );
}
