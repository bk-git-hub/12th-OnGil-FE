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
    <div className="mx-5 mt-4 rounded-lg border border-black px-5 py-5">
      <div className="text-center text-xl leading-normal font-medium">
        <p className="mb-1">
          {productName} 제품을
          <br />
          구매한지 한달이 지나셨네요!
        </p>
        <p className="mt-3 mb-4">
          한달 후 후기를 작성하고 {reviewPoints}p
          <br />
          받으러 가실까요?
        </p>
        <Link
          href={reviewId ? `/review/write/${reviewId}` : '/review/write'}
          className="bg-ongil-teal rounded-lg px-7 py-2 text-white"
        >
          <span>받으러가기</span>
        </Link>
      </div>
    </div>
  );
}
