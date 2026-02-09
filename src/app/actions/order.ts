'use server';

import { api } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import {
  OrderFromCartRequest,
  OrderFromProductRequest,
  OrderDetail,
} from '@/types/domain/order';

export async function createOrderFromCart(
  data: OrderFromCartRequest,
): Promise<number> {
  try {
    const orderId = await api.post<number, OrderFromCartRequest>(
      '/orders/cart',
      data,
    );
    revalidatePath('/cart');
    return orderId;
  } catch (error) {
    console.error('장바구니 상품 주문 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '장바구니 상품 주문에 실패했습니다.',
    );
  }
}

export async function createOrderFromProduct(
  data: OrderFromProductRequest,
): Promise<number> {
  try {
    const orderId = await api.post<number, OrderFromProductRequest>(
      '/orders',
      data,
    );
    return orderId;
  } catch (error) {
    console.error('상품 직접 주문 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '상품 직접 주문에 실패했습니다.',
    );
  }
}

export async function getOrderDetail(orderId: number): Promise<OrderDetail> {
  try {
    const orderDetail = await api.get<OrderDetail>(`/orders/${orderId}`);
    return orderDetail;
  } catch (error) {
    console.error('주문 상세 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '주문 상세 조회에 실패했습니다.',
    );
  }
}
