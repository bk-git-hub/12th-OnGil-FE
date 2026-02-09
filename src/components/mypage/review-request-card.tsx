import Link from 'next/link';

interface ReviewRequestCardProps {
  productName?: string;
  reviewPoints?: number;
  reviewId?: number;
}

export default function ReviewRequestCard({
  productName = '심플 스티치 롱 원피스',
  reviewPoints = 70,
  reviewId,
}: ReviewRequestCardProps) {
  return (
    <div className="mx-5 mt-4 rounded-lg border border-gray-200 px-5 py-5">
      <div className="text-center">
        <p className="mb-1 text-sm text-gray-700">
          {productName} 제품을
          <br />
          구매한지 한달이 지나셨네요!
        </p>
        <p className="mb-4 mt-3 text-sm text-gray-700">
          한달 후 후기를 작성하고 {reviewPoints}p
          <br />
          받으러 가실까요?
        </p>
        <Link
          href={reviewId ? `/review/write/${reviewId}` : '/review/write'}
          className="inline-flex items-center justify-center rounded-full bg-ongil-teal px-6 py-2 text-sm font-medium text-white"
        >
          받으러 가기
        </Link>
      </div>
    </div>
  );
}
