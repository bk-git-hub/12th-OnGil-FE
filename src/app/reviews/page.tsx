import { Suspense } from 'react';

import PendingReviewContainer from '@/components/reviews/pending-review-container';
import { CloseButton } from '@/components/ui/close-button';

export default function ReviewsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-[#d9d9d9] bg-white py-4">
        <h1 className="text-3xl font-semibold">리뷰 관리</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href="/me" />
        </div>
      </header>

      <Suspense
        fallback={
          <section className="px-5 py-8">
            <p className="text-center text-xl text-[#9a9a9a]">
              작성 가능한 리뷰를 불러오는 중...
            </p>
          </section>
        }
      >
        <PendingReviewContainer />
      </Suspense>
    </main>
  );
}
