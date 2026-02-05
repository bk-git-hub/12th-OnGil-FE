'use client';

import { WishlistItem } from '@/types/domain/wishlist';
import WishlistCard from './wishlist-card';

interface WishlistGridProps {
  items: WishlistItem[];
}

export default function WishlistGrid({ items }: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          width="64"
          height="64"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4 text-gray-300"
          style={{ fill: 'none', stroke: 'currentColor' }}
        >
          <path
            d="M15.0121 7.50143C8.12458 1.25018 1.24958 10.0002 7.22708 16.2514L15.0133 25.0002L22.8008 16.2502C28.7496 10.0002 21.8746 1.24893 15.0121 7.50143Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-lg text-gray-500">찜한 상품이 없습니다</p>
        <p className="mt-1 text-sm text-gray-400">
          마음에 드는 상품을 찾아보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <WishlistCard key={item.wishlistId} item={item} />
      ))}
    </div>
  );
}
