import Link from 'next/link';

interface ReviewRequestCardProps {
  writableReviewCount?: number;
}

export default function ReviewRequestCard({
  writableReviewCount = 0,
}: ReviewRequestCardProps) {
  const reviewPoints = writableReviewCount * 500;

  return (
    <div className="mx-5 mt-4 rounded-lg border border-black px-5 py-5">
      <div className="text-center text-xl leading-normal font-medium">
        <p className="mb-1">
          작성 가능한 리뷰가
          <br />
          {writableReviewCount}개 있어요!
        </p>
        <p className="mt-3 mb-4">
          리뷰를 작성하고 {reviewPoints.toLocaleString()}p
          <br />
          받으러 가실까요?
        </p>
        <Link
          href={'/reviews'}
          className="bg-ongil-teal inline-block rounded-lg px-7 py-2 text-white"
        >
          받으러가기
        </Link>
      </div>
    </div>
  );
}
