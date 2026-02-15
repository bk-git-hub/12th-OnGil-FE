import Image from 'next/image';
import Link from 'next/link';

import { ProductWithReviewStats } from '@/types/domain/review';

interface WrittenReviewCardProps {
  review: ProductWithReviewStats;
}

export default function WrittenReviewCard({ review }: WrittenReviewCardProps) {
  const safeRating =
    typeof review.reviewRating === 'number' ? review.reviewRating : 0;
  const safeReviewCount =
    typeof review.reviewCount === 'number' ? review.reviewCount : 0;

  return (
    <li className="rounded-[16px] border border-black/50 bg-white p-5">
      <div className="flex h-[110px] gap-3">
        <div className="relative w-[110px] overflow-hidden rounded-sm bg-[#f1f1f1]">
          <Image
            src={review.thumbnailImageUrl}
            alt={review.name}
            fill
            sizes="110px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between text-lg font-medium text-black">
          <p className="truncate">{review.brandName}</p>
          <p className="line-clamp-2">{review.name}</p>
          <p className="text-base text-[#444444]">
            평점 {safeRating.toFixed(1)} · 리뷰 {safeReviewCount}개
          </p>
        </div>
      </div>

      <Link
        href={`/product/${review.id}`}
        className="mt-4 block w-full rounded-lg bg-[#005b5e] py-2 text-center text-base font-semibold text-white"
      >
        상품 보기
      </Link>
    </li>
  );
}
