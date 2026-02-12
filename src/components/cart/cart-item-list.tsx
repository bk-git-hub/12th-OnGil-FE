'use client';

import { useState } from 'react';
import { useCartContext } from './cart-context';
import CartItem from './cart-item';
import CartOptionChangeSheet from './cart-option-change-sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CartResponse } from '@/types/domain/cart';

function EmptyCartView() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-gray-400">
      <p>장바구니가 비어있습니다.</p>
    </div>
  );
}

export default function CartItemList() {
  const {
    optimisticCart,
    selectedIds,
    toggleItem,
    handleQuantity,
    handleDelete,
    handleOptionChange,
  } = useCartContext();

  const [editingItem, setEditingItem] = useState<CartResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async (cartId: number, color: string, size: string) => {
    const result = await handleOptionChange(cartId, color, size);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  if (optimisticCart.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="mt-4 flex flex-col gap-[30px] bg-white px-[21px] pb-32">
      {optimisticCart.map((item) => (
        <CartItem
          key={item.cartId}
          item={item}
          isChecked={selectedIds.has(item.cartId)}
          onToggleCheck={(checked) => toggleItem(item.cartId, checked)}
          onQuantityChange={async (qty) => {
            const result = await handleQuantity(item.cartId, qty);
            if (!result.success) {
              setErrorMessage(result.message);
            }
          }}
          onDelete={() => handleDelete(item.cartId)}
          onOptionChange={() => setEditingItem(item)}
        />
      ))}

      <CartOptionChangeSheet
        item={editingItem}
        onConfirm={handleConfirm}
        onClose={() => setEditingItem(null)}
      />

      <Dialog
        open={errorMessage !== null}
        onOpenChange={(open) => {
          if (!open) setErrorMessage(null);
        }}
      >
        <DialogContent className="rounded-xl sm:max-w-sm">
          <DialogHeader className="flex flex-col items-center justify-center space-y-3 pt-4">
            <DialogTitle className="text-center text-xl font-bold">
              장바구니 수정 실패
            </DialogTitle>
            <DialogDescription className="text-center">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button className="bg-ongil-teal h-12 w-full rounded-xl text-lg font-bold hover:bg-teal-600">
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
