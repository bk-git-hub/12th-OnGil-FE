'use client';

import { useOptimistic, startTransition, useState, useEffect } from 'react';
import { type CartResponse } from '@/types/domain/cart';
import {
  updateCartItem,
  deleteCartItem,
  deleteCartItems,
} from '@/app/actions/cart';
import { useCartStore } from '@/store/cart';

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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialCartItems.length > 0) {
      setSelectedIds(new Set(initialCartItems.map((item) => item.cartId)));
    }
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
  };
}
