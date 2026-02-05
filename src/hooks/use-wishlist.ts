'use client';

import { useOptimistic, useTransition } from 'react';
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

  const [optimisticState, setOptimisticState] = useOptimistic<
    WishlistState,
    Partial<WishlistState>
  >(
    { isLiked: initialIsLiked, wishlistId: initialWishlistId },
    (state, update) => ({ ...state, ...update }),
  );

  const toggle = () => {
    const previousState = optimisticState;
    const nextIsLiked = !previousState.isLiked;

    startTransition(async () => {
      setOptimisticState({ isLiked: nextIsLiked });

      try {
        if (nextIsLiked) {
          const response = await addToWishlist(productId);
          if (response.success && response.data?.wishlistId) {
            setOptimisticState({
              isLiked: true,
              wishlistId: response.data.wishlistId,
            });
            onAddSuccess?.(response.data.wishlistId);
          } else {
            setOptimisticState(previousState);
          }
        } else if (previousState.wishlistId) {
          const response = await deleteFromWishlist(previousState.wishlistId);
          if (!response.success) {
            setOptimisticState(previousState);
          }
        }
      } catch {
        setOptimisticState(previousState);
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
