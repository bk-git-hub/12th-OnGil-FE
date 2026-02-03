'use server';

import { api } from '@/lib/api-client';
import {
  CartCreateRequest,
  CartResponse,
  CartUpdateRequest,
} from '@/types/domain/cart';
import { revalidatePath } from 'next/cache';

/** 내 장바구니 목록 조회 */
export async function getCartItems(): Promise<CartResponse[]> {
  try {
    const cartItems = await api.get<CartResponse[]>('/carts');
    return cartItems;
  } catch (error) {
    console.error('장바구니 조회 실패:', error);
    return [];
  }
}

/** 장바구니 담기 */
export async function addToCart(data: CartCreateRequest) {
  try {
    await api.post<CartResponse, CartCreateRequest>('/carts', data);
    revalidatePath('/cart');
    return { success: true, message: '장바구니에 상품을 담았습니다.' };
  } catch (error: any) {
    console.error('장바구니 담기 실패:', error);
    return {
      success: false,
      message: error.message || '장바구니 담기에 실패했습니다.',
    };
  }
}

/** 장바구니 아이템 수정 */
export async function updateCartItem(cartId: number, data: CartUpdateRequest) {
  try {
    await api.patch(`/carts/${cartId}`, data);
    revalidatePath('/cart');
    return { success: true, message: '장바구니가 수정되었습니다.' };
  } catch (error: any) {
    console.error('장바구니 수정 실패:', error);
    return { success: false, message: error.message || '수정에 실패했습니다.' };
  }
}

/** 장바구니 개별 삭제 */
export async function deleteCartItem(cartId: number) {
  try {
    await api.delete(`/carts/${cartId}`);
    revalidatePath('/cart');
    return { success: true, message: '상품이 삭제되었습니다.' };
  } catch (error: any) {
    console.error('장바구니 삭제 실패:', error);
    return { success: false, message: error.message || '삭제에 실패했습니다.' };
  }
}

/** 장바구니 선택 삭제 */
export async function deleteCartItems(cartIds: number[]) {
  try {
    if (cartIds.length === 0)
      return { success: false, message: '삭제할 상품을 선택해주세요.' };

    await api.delete('/carts', {
      params: { ids: cartIds.join(',') },
    });

    revalidatePath('/cart');
    return { success: true, message: '선택한 상품이 삭제되었습니다.' };
  } catch (error: any) {
    console.error('장바구니 일괄 삭제 실패:', error);
    return { success: false, message: error.message || '삭제에 실패했습니다.' };
  }
}

/** 장바구니 개수 조회 (뱃지용) */
export async function getCartCount(): Promise<number> {
  try {
    const count = await api.get<number>('/carts/count');
    return count;
  } catch (error) {
    console.error('장바구니 개수 조회 실패:', error);
    return 0;
  }
}
