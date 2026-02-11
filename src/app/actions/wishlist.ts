'use server';

import { revalidatePath } from 'next/cache';
import { api } from '@/lib/api-client';
import { WishlistItem } from '@/types/domain/wishlist';

/**
 * 찜하기 (POST)
 */
export async function addToWishlist(productId: number) {
  try {
    const data = await api.post<WishlistItem>(
      `/wishlists/products/${productId}`,
      {},
    );

    revalidatePath('/me');
    revalidatePath(`/product/${productId}`);

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('Add to wishlist error:', error);
    return { success: false, error: '찜하기에 실패했습니다.' };
  }
}

/**
 * 찜 취소하기 (DELETE)
 */
export async function deleteFromWishlist(wishlistId: number) {
  try {
    await api.delete<string>(`/wishlists/${wishlistId}`);

    revalidatePath('/me');

    return { success: true, wishlistId };
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('Delete from wishlist error:', error);
    return { success: false, error: '찜 취소에 실패했습니다.' };
  }
}

/**
 * 내 찜 목록 조회 (GET)
 */
export async function getMyWishlist(categoryId?: number) {
  try {
    const params = categoryId ? { categoryId } : undefined;
    const data = await api.get<WishlistItem[]>('/wishlists', { params });

    return data;
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('Get wishlist error:', error);
    return [];
  }
}
