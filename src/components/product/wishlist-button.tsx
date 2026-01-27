'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// In a real app, you would import a hook for mutations, e.g., from react-query or SWR
// import { useToggleWishlist } from '@/hooks/use-wishlist';

interface WishlistButtonProps {
  productId: number | string;
  initialIsLiked?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  initialIsLiked = false,
  className,
}: WishlistButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  // const { mutate, isPending } = useToggleWishlist(); // Example with a real hook

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update of the UI
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    // In a real app, you would call the mutation here to update the backend
    // mutate({ productId, isLiked: newIsLiked });
    console.log(
      `Toggling wishlist for product ${productId}. New state: ${
        newIsLiked ? 'liked' : 'unliked'
      }. (API call would happen here)`,
    );
  };

  return (
    <button
      onClick={handleToggle}
      // disabled={isPending} // Example: Disable button while the request is in flight
      className={cn(
        'z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 p-1.5 shadow-md',
        className,
      )}
      aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 30 30"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-200"
        style={{
          fill: isLiked ? '#FF0000' : 'none',
          stroke: isLiked ? '#FF0000' : '#888888',
        }}
      >
        <path
          d="M15.0121 7.50143C8.12458 1.25018 1.24958 10.0002 7.22708 16.2514L15.0133 25.0002L22.8008 16.2502C28.7496 10.0002 21.8746 1.24893 15.0121 7.50143Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
