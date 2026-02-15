import { api } from '@/lib/api-client';
import { WritableReviewItem } from '@/types/domain/review';

export default async function PendingReviewContainer() {
  const pendingReviews = await api.get<WritableReviewItem[]>(
    '/users/me/reviews/pending',
  );

  if (pendingReviews.length === 0) {
    return (
      <section className="px-5 py-8">
        <p className="text-center text-xl text-[#9a9a9a]">
          작성 가능한 리뷰가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="px-5 py-6">
      <ul className="space-y-3">
        {pendingReviews.map((review) => (
          <li
            key={review.orderItemId}
            className="rounded-xl border border-[#d9d9d9] bg-white p-4"
          >
            <p className="text-sm text-[#767676]">{review.availableReviewType}</p>
            <p className="mt-1 text-lg font-semibold text-black">
              {review.product.productName}
            </p>
            <p className="text-sm text-[#767676]">{review.product.brandName}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
