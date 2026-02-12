'use server';

import { api } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { redirect, notFound } from 'next/navigation';
import { rethrowNextError } from '@/lib/server-action-utils';
import {
  OrderFromCartRequest,
  OrderFromProductRequest,
  OrderDetail,
  OrderListResponse,
  OrderListParams,
  OrderCancelRequest,
  OrderCancelResponse,
  OrderRefundInfoResponse,
} from '@/types/domain/order';
import type { PaymentDisplayItem } from '@/app/payment/_components/order-items';
import { getCartItems } from '@/app/actions/cart';
import { getProductDetail } from '@/app/actions/product';

/** 장바구니 주문 생성 */
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
    rethrowNextError(error);
    console.error('장바구니 상품 주문 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '장바구니 상품 주문에 실패했습니다.',
    );
  }
}

/** 상품 직접 주문 생성 */
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
    rethrowNextError(error);
    console.error('상품 직접 주문 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '상품 직접 주문에 실패했습니다.',
    );
  }
}

/** 장바구니 주문 아이템 조회 */
export async function fetchCartOrderItems(
  params: Record<string, string | string[] | undefined>,
): Promise<PaymentDisplayItem[]> {
  const rawIds = params.items;
  const cartItemIds = (
    typeof rawIds === 'string' ? rawIds.split(',') : (rawIds ?? [])
  )
    .map(Number)
    .filter((id) => !isNaN(id));

  if (cartItemIds.length === 0) redirect('/cart');

  const cartItems = await getCartItems();
  const selected = cartItems.filter((c) => cartItemIds.includes(c.cartId));

  if (selected.length === 0) redirect('/cart');

  return selected.map((c) => ({
    productId: c.productId,
    productName: c.productName,
    brandName: c.brandName,
    thumbnailImageUrl: c.thumbnailImageUrl,
    selectedSize: c.selectedSize,
    selectedColor: c.selectedColor,
    quantity: c.quantity,
    originalPrice: c.price,
    price: c.price,
    totalPrice: c.totalPrice,
    cartItemId: c.cartId,
  }));
}

/** 바로 구매 아이템 조회 */
export async function fetchDirectOrderItems(
  params: Record<string, string | string[] | undefined>,
): Promise<PaymentDisplayItem[]> {
  const productId = Number(params.productId);
  if (!productId || isNaN(productId)) notFound();

  let selections: { color: string; size: string; quantity: number }[];
  try {
    const raw = Array.isArray(params.selections)
      ? params.selections[0]
      : params.selections;
    selections = JSON.parse(raw || '[]');
  } catch {
    notFound();
  }

  if (selections.length === 0) notFound();

  const product = await getProductDetail(productId);

  return selections.map((sel) => ({
    productId: product.id,
    productName: product.name,
    brandName: product.brandName,
    thumbnailImageUrl: product.thumbnailImageUrl,
    selectedSize: sel.size,
    selectedColor: sel.color,
    quantity: sel.quantity,
    originalPrice: product.price,
    price: product.finalPrice,
    totalPrice: product.finalPrice * sel.quantity,
  }));
}

/** 주문 내역 조회 */
export async function getOrders(
  params?: OrderListParams,
): Promise<OrderListResponse> {
  try {
    const response = await api.get<OrderListResponse>('/orders', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('주문 내역 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '주문 내역 조회에 실패했습니다.',
    );
  }
}

/** 환불 정보 조회 */
export async function getRefundInfo(
  orderId: number,
): Promise<OrderRefundInfoResponse> {
  try {
    const response = await api.get<OrderRefundInfoResponse>(
      `/orders/${orderId}/cancel/refund-info`,
    );
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('환불 정보 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '환불 정보 조회에 실패했습니다.',
    );
  }
}

/** 주문 취소 */
export async function cancelOrder(
  orderId: number,
  data: OrderCancelRequest,
): Promise<OrderCancelResponse> {
  try {
    const response = await api.post<OrderCancelResponse, OrderCancelRequest>(
      `/orders/${orderId}/cancel`,
      data,
    );
    revalidatePath('/orders');
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('주문 취소 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '주문 취소에 실패했습니다.',
    );
  }
}

/** 주문 상세 조회 */
export async function getOrderDetail(orderId: number): Promise<OrderDetail> {
  try {
    const orderDetail = await api.get<OrderDetail>(`/orders/${orderId}`);
    return orderDetail;
  } catch (error) {
    rethrowNextError(error);
    console.error('주문 상세 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '주문 상세 조회에 실패했습니다.',
    );
  }
}

/** 주문 내역 삭제 */
export async function deleteOrder(orderId: number): Promise<void> {
  try {
    await api.delete(`/orders/${orderId}`);
    revalidatePath('/orders');
  } catch (error) {
    rethrowNextError(error);
    console.error('주문 내역 삭제 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '주문 내역 삭제에 실패했습니다.',
    );
  }
}
