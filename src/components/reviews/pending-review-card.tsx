import Image from 'next/image';
import Link from 'next/link';

import { WritableReviewItem } from '@/types/domain/review';

interface PendingReviewCardProps {
  review: WritableReviewItem;
}

function toReviewTypeLabel(type: string) {
  return type === 'MONTH' ? '?쒕떖 ?꾧린' : '?쇰컲 ?꾧린';
}

export default function PendingReviewCard({ review }: PendingReviewCardProps) {
  return (
    <li className="rounded-2xl border border-[#cfcfcf] bg-white p-4">
      <div className="flex gap-3">
        <div className="relative h-[88px] w-[66px] overflow-hidden rounded-sm bg-[#f1f1f1]">
          <Image
            src={review.product.thumbnailImageUrl}
            alt={review.product.productName}
            fill
            sizes="66px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 pt-1 text-lg">
          <p className="truncate font-semibold text-black">{review.product.brandName}</p>
          <p className="mt-1 line-clamp-2 text-[#111111]">{review.product.productName}</p>
          <p className="mt-1 text-[#111111]">蹂꾩젏 / 5</p>
          <p className="mt-1 text-sm font-medium text-[#666666]">
            {toReviewTypeLabel(review.availableReviewType)}
          </p>
        </div>
      </div>

      <Link
        href={`/review/write/${review.orderItemId}`}
        className="mt-4 block rounded-lg bg-[#005b5e] py-2 text-center text-lg font-semibold text-white"
      >
        由щ럭 ?곌린
      </Link>
    </li>
  );
}
