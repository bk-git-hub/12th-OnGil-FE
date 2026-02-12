'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import OptionSelectors from '@/components/product-option-sheet/option-selectors';
import { getProductOptions } from '@/app/actions/product';
import type { CartResponse } from '@/types/domain/cart';
import type { ProductOption } from '@/types/domain/product';

interface CartOptionChangeSheetProps {
  item: CartResponse | null;
  onConfirm: (
    cartId: number,
    color: string,
    size: string,
  ) => void | Promise<void>;
  onClose: () => void;
}

export default function CartOptionChangeSheet({
  item,
  onConfirm,
  onClose,
}: CartOptionChangeSheetProps) {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const [currentColor, setCurrentColor] = useState('');
  const [currentSize, setCurrentSize] = useState('');

  const isOpen = item !== null;

  // 시트가 열릴 때 옵션을 가져오고 현재 값으로 초기화
  useEffect(() => {
    if (!item) return;

    setCurrentColor(item.selectedColor);
    setCurrentSize(item.selectedSize);

    startTransition(async () => {
      const fetched = await getProductOptions(item.productId);
      setOptions(fetched);
    });
  }, [item]);

  const colors = [...new Set(options.map((o) => o.color))];
  const sizes = options
    .filter((o) => o.color === currentColor)
    .map((o) => o.size);

  const isChanged =
    item !== null &&
    (currentColor !== item.selectedColor || currentSize !== item.selectedSize);

  const canConfirm = isChanged && currentColor !== '' && currentSize !== '';

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[85vh] flex-col rounded-t-[20px] px-0 pt-6 pb-0"
      >
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <SheetHeader className="mb-6 space-y-1 text-left">
            <SheetTitle className="line-clamp-1 text-lg font-bold">
              {item?.productName}
            </SheetTitle>
          </SheetHeader>

          {isPending ? (
            <div className="flex h-32 items-center justify-center text-gray-400">
              옵션을 불러오는 중...
            </div>
          ) : (
            <OptionSelectors
              colors={colors}
              sizes={sizes}
              currentColor={currentColor}
              currentSize={currentSize}
              onColorChange={(val) => {
                setCurrentColor(val);
                setCurrentSize('');
              }}
              onSizeChange={setCurrentSize}
            />
          )}
        </div>

        <div className="p-4">
          <Button
            disabled={!canConfirm}
            onClick={async () => {
              if (item) {
                await onConfirm(item.cartId, currentColor, currentSize);
                onClose();
              }
            }}
            className="bg-ongil-teal hover:bg-ongil-teal h-14 w-full rounded-xl text-lg font-bold text-white disabled:opacity-50"
          >
            변경하기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
