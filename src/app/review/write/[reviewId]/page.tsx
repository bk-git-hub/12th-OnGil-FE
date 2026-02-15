import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import ReviewWriteFlow from './_components/review-write-flow';
import { CloseButton } from '@/components/ui/close-button';
import { auth } from '/auth';

export const metadata: Metadata = {
  title: '리뷰 작성 | OnGil',
  description: '리뷰 작성 페이지입니다.',
};

interface ReviewWritePageProps {
  params: Promise<{ reviewId: string }>;
  searchParams: Promise<{ orderItemId?: string; productId?: string }>;
}

export default async function ReviewWritePage({
  params,
  searchParams,
}: ReviewWritePageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { reviewId } = await params;
  const query = await searchParams;
  const numericReviewId = Number(reviewId);
  const orderItemId = query.orderItemId ? Number(query.orderItemId) : undefined;
  const productId = query.productId ? Number(query.productId) : undefined;

  if (!Number.isFinite(numericReviewId)) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-[#d9d9d9] bg-white py-4">
        <h1 className="text-3xl font-semibold">리뷰 작성</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href="/reviews" />
        </div>
      </header>

      <ReviewWriteFlow
        reviewId={numericReviewId}
        orderItemId={Number.isFinite(orderItemId) ? orderItemId : undefined}
        productId={Number.isFinite(productId) ? productId : undefined}
      />
    </main>
  );
}
