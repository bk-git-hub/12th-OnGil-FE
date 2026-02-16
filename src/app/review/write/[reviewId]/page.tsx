import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';

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
    <main className="mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-[#d9d9d9] bg-white py-4">
        <h1 className="text-3xl font-semibold">리뷰 작성</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href="/reviews" />
        </div>
      </header>

      <section className="border-b border-[#d9d9d9] px-5 py-4">
        <div className="flex gap-3">
          <div className="relative h-[88px] w-[88px] overflow-hidden rounded-md bg-[#f1f1f1]">
            <Image
              src={reviewDetail.product.thumbnailImageUrl}
              alt={reviewDetail.product.productName}
              fill
              sizes="88px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-black">
            <p className="truncate text-sm text-[#666666]">
              {reviewDetail.product.brandName}
            </p>
            <p className="line-clamp-2 text-base font-semibold">
              {reviewDetail.product.productName}
            </p>
            <p className="mt-1 text-sm text-[#444444]">
              {selectedOption || '옵션 정보 없음'}
            </p>
          </div>
        </div>
      </section>

      <ReviewWriteFlow
        reviewId={numericReviewId}
        clothingCategory={clothingCategory}
        initialStep1Answers={reviewDetail.initialFirstAnswers}
        initialRating={reviewDetail.rating}
      />
    </main>
  );
}
