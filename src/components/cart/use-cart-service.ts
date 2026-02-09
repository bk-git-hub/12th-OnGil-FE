'use client';

import { useOptimistic, startTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type CartResponse } from '@/types/domain/cart';
import {
  updateCartItem,
  deleteCartItem,
  deleteCartItems,
} from '@/app/actions/cart';
import { createOrderFromCart } from '@/app/actions/order';
import { useCartStore } from '@/store/cart';
import { placeholderOrderData } from '@/mocks/order-data';

type CartAction =
  | { type: 'UPDATE'; payload: { cartId: number; quantity: number } }
  | { type: 'DELETE'; payload: { cartId: number } }
  | { type: 'DELETE_MANY'; payload: { ids: number[] } };

function cartOptimisticReducer(
  state: CartResponse[],
  action: CartAction,
): CartResponse[] {
  switch (action.type) {
    case 'UPDATE':
      return state.map((item) =>
        item.cartId === action.payload.cartId
          ? {
              ...item,
              quantity: action.payload.quantity,
              totalPrice: item.price * action.payload.quantity,
            }
          : item,
      );
    case 'DELETE':
      return state.filter((item) => item.cartId !== action.payload.cartId);
    case 'DELETE_MANY':
      return state.filter((item) => !action.payload.ids.includes(item.cartId));
    default:
      return state;
  }
}

export function useCartService(initialCartItems: CartResponse[]) {
  const { fetchCount } = useCartStore();
  const router = useRouter();

  // 초기 로드 시 '전체 선택' 상태로 시작
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    return new Set(initialCartItems.map((item) => item.cartId));
  });

  // 서버 데이터(initialCartItems)가 갱신되어도 사용자의 선택 상태 유지
  useEffect(() => {
    if (initialCartItems.length === 0) {
      // 장바구니가 비워지면 선택 목록도 초기화
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      const currentIdSet = new Set(initialCartItems.map((item) => item.cartId));

      // 현재 서버 데이터에 없는 ID는 선택 목록에서 제거
      next.forEach((id) => {
        if (!currentIdSet.has(id)) {
          next.delete(id);
        }
      });

      // 새로운 아이템 추가 시 추가된 아이템 자동 선택 로직 추가해야함.

      return next;
    });
  }, [initialCartItems]);

  const [optimisticCart, addOptimisticAction] = useOptimistic(
    initialCartItems,
    cartOptimisticReducer,
  );

  const handleQuantity = async (cartId: number, newQuantity: number) => {
    startTransition(() => {
      addOptimisticAction({
        type: 'UPDATE',
        payload: { cartId, quantity: newQuantity },
      });
    });
    await updateCartItem(cartId, { quantity: newQuantity });
  };

  const handleDelete = async (cartId: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    startTransition(() => {
      addOptimisticAction({ type: 'DELETE', payload: { cartId } });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(cartId);
        return next;
      });
    });

    await deleteCartItem(cartId);
    fetchCount();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`선택한 ${selectedIds.size}개 상품을 삭제하시겠습니까?`))
      return;

    const ids = Array.from(selectedIds);

    startTransition(() => {
      addOptimisticAction({ type: 'DELETE_MANY', payload: { ids } });
      setSelectedIds(new Set());
    });

    await deleteCartItems(ids);
    fetchCount();
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(optimisticCart.map((i) => i.cartId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleItem = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleCartCheckout = async () => {
    if (selectedIds.size === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }

    const orderData = {
      cartItemIds: Array.from(selectedIds),
      ...placeholderOrderData,
    };

    try {
      const orderId = await createOrderFromCart(orderData);
      alert(`주문이 성공적으로 완료되었습니다! 주문 ID: ${orderId}`);
      fetchCount();
      router.push(`/orders/${orderId}`);
    } catch (error: unknown) {
      console.error('Checkout failed:', error);
      const message =
        error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`결제 처리 중 오류가 발생했습니다: ${message}`);
    }
  };

  const totalAmount = optimisticCart
    .filter((item) => selectedIds.has(item.cartId))
    .reduce((acc, item) => acc + item.totalPrice, 0);

  return {
    optimisticCart,
    selectedIds,
    totalAmount,
    toggleAll,
    toggleItem,
    handleQuantity,
    handleDelete,
    handleDeleteSelected,
    handleCartCheckout,
  };
}
