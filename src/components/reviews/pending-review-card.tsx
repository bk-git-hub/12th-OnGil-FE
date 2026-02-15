import Image from 'next/image';
import Link from 'next/link';

import { WritableReviewItem } from '@/types/domain/review';

interface PendingReviewCardProps {
  review: WritableReviewItem;
}

function getPurchaseOptionLabel(review: WritableReviewItem) {
  const productWithOption = review.product as WritableReviewItem['product'] & {
    selectedColor?: string;
    selectedSize?: string;
  };

  if (productWithOption.selectedColor && productWithOption.selectedSize) {
    return `${productWithOption.selectedColor} / ${productWithOption.selectedSize}`;
  }

  if (review.purchaseOption) {
    return review.purchaseOption;
  }

  return '옵션 정보 없음';
}

export default function PendingReviewCard({ review }: PendingReviewCardProps) {
  return (
    <li className="rounded-[16px] border border-black/50 bg-white p-5">
      <div className="flex h-[110px] gap-3">
        <div className="relative w-[110px] overflow-hidden rounded-sm bg-[#f1f1f1]">
          <Image
            src={review.product.thumbnailImageUrl}
            alt={review.product.productName}
            fill
            sizes="110px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between text-lg font-medium text-black">
          <p className="truncate">{review.product.brandName}</p>
          <p className="line-clamp-2">{review.product.productName}</p>
          <p>{getPurchaseOptionLabel(review)}</p>
        </div>
      </div>

      <Link
        href={`/review/write/${review.orderItemId}`}
        className="mt-4 block rounded-lg bg-[#005b5e] py-2 text-center text-lg font-semibold text-white"
      >
        리뷰 쓰기
      </Link>
    </li>
  );
}
