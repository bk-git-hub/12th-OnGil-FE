'use client';

import { useOptimistic, startTransition, useState, useEffect } from 'react';
import { CartResponse } from '@/types/domain/cart';
import {
  updateCartItem,
  deleteCartItem,
  deleteCartItems,
} from '@/app/actions/cart';
import { useCartStore } from '@/store/cart';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface CartListProps {
  initialCartItems: CartResponse[];
}

export function CartList({ initialCartItems }: CartListProps) {
  const { fetchCount } = useCartStore();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 초기 진입 시 '전체 선택'

  useEffect(() => {
    if (initialCartItems.length > 0) {
      setSelectedIds(new Set(initialCartItems.map((item) => item.cartId)));
    }
  }, [initialCartItems]);

  const [optimisticCart, addOptimisticAction] = useOptimistic(
    initialCartItems,

    (state, action: { type: string; payload: any }) => {
      switch (action.type) {
        case 'UPDATE':
          return state.map((item) =>
            item.cartId === action.payload.cartId
              ? {
                  ...item,

                  ...action.payload.data,

                  totalPrice: item.price * action.payload.data.quantity,
                }
              : item,
          );

        case 'DELETE':
          return state.filter((item) => item.cartId !== action.payload.cartId);

        case 'DELETE_MANY':
          return state.filter(
            (item) => !action.payload.ids.includes(item.cartId),
          );

        default:
          return state;
      }
    },
  );

  const handleQuantity = async (cartId: number, newQuantity: number) => {
    // 1. 화면 즉시 갱신

    startTransition(() => {
      addOptimisticAction({
        type: 'UPDATE',

        payload: { cartId, data: { quantity: newQuantity } },
      });
    });

    // 2. 서버 요청

    await updateCartItem(cartId, { quantity: newQuantity });
  };

  const handleDelete = async (cartId: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    // 1. 화면 즉시 갱신 (리스트에서 제거 및 선택 해제)

    startTransition(() => {
      addOptimisticAction({ type: 'DELETE', payload: { cartId } });

      const next = new Set(selectedIds);

      next.delete(cartId);

      setSelectedIds(next);
    });

    // 2. 서버 요청 및 뱃지 갱신

    await deleteCartItem(cartId);

    fetchCount();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`선택한 ${selectedIds.size}개 상품을 삭제하시겠습니까?`))
      return;

    const ids = Array.from(selectedIds);

    // 1. 화면 즉시 갱신

    startTransition(() => {
      addOptimisticAction({ type: 'DELETE_MANY', payload: { ids } });

      setSelectedIds(new Set());
    });

    // 2. 서버 요청 및 뱃지 갱신

    await deleteCartItems(ids);

    fetchCount();
  };

  // 전체 선택/해제 토글

  const toggleAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(optimisticCart.map((i) => i.cartId)));
    else setSelectedIds(new Set());
  };

  // 개별 선택/해제 토글

  const toggleItem = (id: number, checked: boolean) => {
    const next = new Set(selectedIds);

    if (checked) next.add(id);
    else next.delete(id);

    setSelectedIds(next);
  };

  // 총 결제 금액 계산

  const totalAmount = optimisticCart

    .filter((item) => selectedIds.has(item.cartId))

    .reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="relative pb-32 text-xl leading-[18px] font-medium">
      {optimisticCart.length > 0 ? (
        <>
          {/* 전체 선택 바 */}

          <div className="sticky top-24 z-10 flex items-center justify-between bg-white px-9 py-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="all"
                checked={selectedIds.size === optimisticCart.length}
                onCheckedChange={(c) => toggleAll(!!c)}
                className="data-[state=checked]:text-ongil-mint data-[state=checked]:bg-ongil-teal h-7 w-7 rounded border-black"
              />

              <label htmlFor="all" className="cursor-pointer">
                전체 선택 ({selectedIds.size}/{optimisticCart.length})
              </label>
            </div>

            <button
              onClick={handleDeleteSelected}
              className={cn(
                'bg-ongil-teal rounded-2xl p-3 font-normal text-white',

                selectedIds.size === 0 && 'bg-[#D9D9D9]',
              )}
            >
              <span>선택 삭제</span>
            </button>
          </div>

          {/* 리스트 */}

          <div className="mt-4 flex flex-col gap-[30px] bg-white px-[21px]">
            {optimisticCart.map((item) => (
              <CartItem
                key={item.cartId}
                item={item}
                isChecked={selectedIds.has(item.cartId)}
                onToggleCheck={(c) => toggleItem(item.cartId, c)}
                onQuantityChange={(q) => handleQuantity(item.cartId, q)}
                onDelete={() => handleDelete(item.cartId)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center text-gray-400">
          <p>장바구니가 비어있습니다.</p>
        </div>
      )}

      <Button
        className={cn(
          'safe-area-pb fixed right-0 bottom-0 left-0 z-50 flex h-20 rounded-none bg-[#C5C5C5] transition-colors',

          'disabled:opacity-100',

          selectedIds.size > 0 &&
            'bg-ongil-mint hover:bg-ongil-mint text-black',
        )}
        disabled={selectedIds.size === 0}
      >
        <span
          className={cn(
            'text-3xl leading-[18px] font-semibold text-white',

            selectedIds.size > 0 && 'text-black',
          )}
        >
          {totalAmount.toLocaleString()}원
        </span>
      </Button>
    </div>
  );
}
