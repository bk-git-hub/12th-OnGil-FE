import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import ReviewWriteFlow from './_components/review-write-flow';
import { CloseButton } from '@/components/ui/close-button';
import { api } from '@/lib/api-client';
import { ReviewDetail } from '@/types/domain/review';
import { auth } from '/auth';

export const metadata: Metadata = {
  title: '리뷰 작성 | OnGil',
  description: '리뷰 작성 페이지입니다.',
};

interface ReviewWritePageProps {
  params: Promise<{ reviewId: string }>;
}

export default async function ReviewWritePage({ params }: ReviewWritePageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { reviewId } = await params;
  const numericReviewId = Number(reviewId);

  if (!Number.isFinite(numericReviewId)) {
    notFound();
  }

  let reviewDetail: ReviewDetail;
  try {
    reviewDetail = await api.get<ReviewDetail>(`/reviews/${numericReviewId}/details`);
  } catch {
    notFound();
  }

  console.log(
    '[review-write] review detail product=',
    JSON.stringify(reviewDetail.product, null, 2),
  );

  const selectedOption = [
    reviewDetail.purchaseOption.selectedColor,
    reviewDetail.purchaseOption.selectedSize,
  ]
    .filter(Boolean)
    .join(' / ');
  const clothingCategory = reviewDetail.product.clothingCategory ?? 'TOP';

  return (
    <main className="font-pretendard mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-[#d9d9d9] bg-white py-4">
        <h1 className="text-3xl font-semibold">리뷰 작성</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href="/reviews" />
        </div>
      </header>

      <ReviewWriteFlow
        reviewId={numericReviewId}
        clothingCategory={clothingCategory}
        productThumbnailImageUrl={reviewDetail.product.thumbnailImageUrl}
        productName={reviewDetail.product.productName}
        productBrandName={reviewDetail.product.brandName}
        selectedOptionText={selectedOption || '옵션 정보 없음'}
        initialStep1Answers={reviewDetail.initialFirstAnswers}
        initialRating={reviewDetail.rating}
      />
    </main>
  );
}
