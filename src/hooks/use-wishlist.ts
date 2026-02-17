'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { addToWishlist, deleteFromWishlist } from '@/app/actions/wishlist';

interface WishlistState {
  isLiked: boolean;
  wishlistId?: number;
}

interface UseWishlistOptions {
  productId: number;
  initialIsLiked: boolean;
  initialWishlistId?: number;
  onAddSuccess?: (wishlistId: number) => void;
}

export function useWishlist({
  productId,
  initialIsLiked,
  initialWishlistId,
  onAddSuccess,
}: UseWishlistOptions) {
  const [isPending, startTransition] = useTransition();

  const [committedState, setCommittedState] = useState<WishlistState>({
    isLiked: initialIsLiked,
    wishlistId: initialWishlistId,
  });

  const [optimisticState, setOptimisticState] = useOptimistic<
    WishlistState,
    Partial<WishlistState>
  >(
    committedState,
    (state, update) => ({ ...state, ...update }),
  );

  const toggle = () => {
    if (isPending) return;
    const nextIsLiked = !committedState.isLiked;

    startTransition(async () => {
      setOptimisticState({ isLiked: nextIsLiked });

      try {
        if (nextIsLiked) {
          const response = await addToWishlist(productId);
          if (response.success && response.data?.wishlistId) {
            setCommittedState({ isLiked: true, wishlistId: response.data.wishlistId });
            onAddSuccess?.(response.data.wishlistId);
          }
        } else if (committedState.wishlistId) {
          const response = await deleteFromWishlist(committedState.wishlistId);
          if (response.success) {
            setCommittedState({ isLiked: false, wishlistId: undefined });
          }
        }
      } catch {
        // committedState unchanged → useOptimistic reverts to it automatically
      }
    });
  };

  return {
    isLiked: optimisticState.isLiked,
    wishlistId: optimisticState.wishlistId,
    isPending,
    toggle,
  };
}
