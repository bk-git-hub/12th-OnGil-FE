'use server';

import { api } from '@/lib/api-client';
import type { ProductDetail } from '@/types/domain/product';

/** 상품 상세 조회 */
export async function getProductDetail(
  productId: number,
): Promise<ProductDetail> {
  try {
    const product = await api.get<ProductDetail>(`/products/${productId}`);
    return product;
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('상품 상세 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '상품 상세 조회에 실패했습니다.',
    );
  }
}
