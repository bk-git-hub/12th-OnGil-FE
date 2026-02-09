'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WishlistItem } from '@/types/domain/wishlist';
import { useWishlist } from '@/hooks/use-wishlist';

interface WishlistCardProps {
  item: WishlistItem;
}

export default function WishlistCard({ item }: WishlistCardProps) {
  const { isLiked, isPending, toggle } = useWishlist({
    productId: item.productId,
    initialIsLiked: true,
    initialWishlistId: item.wishlistId,
  });

  if (!isLiked) {
    return null;
  }

  return (
    <div className="font-pretendard relative flex w-full flex-col gap-1">
      <Link href={`/product/${item.productId}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={item.thumbnailImageUrl}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        </div>
        <div className="mt-2">
          <span className="text-sm font-extrabold">{item.brandName}</span>
          <p className="line-clamp-2 h-12 text-base font-medium">
            {item.productName}
          </p>
          <div className="flex items-center gap-2 text-lg font-bold">
            {item.discountRate > 0 && (
              <span className="text-ongil-teal">{item.discountRate}%</span>
            )}
            <span>{item.finalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </Link>

      <button
        onClick={toggle}
        disabled={isPending}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity hover:opacity-80 disabled:opacity-50"
        aria-label="찜 취소"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-200"
          style={{ fill: '#FF0000', stroke: '#FF0000' }}
        >
          <path
            d="M15.0121 7.50143C8.12458 1.25018 1.24958 10.0002 7.22708 16.2514L15.0133 25.0002L22.8008 16.2502C28.7496 10.0002 21.8746 1.24893 15.0121 7.50143Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
