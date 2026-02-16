'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ProductOption } from '@/types/domain/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

import useProductOption from './use-product-option';
import OptionSelectors from './option-selectors';
import SelectedItemList from './selected-item-list';
import SheetFooter from './sheet-footer';

interface ProductOptionSheetProps {
  productId: number;
  productName: string;
  price: number;
  options: ProductOption[];
  trigger?: React.ReactNode;
  recommendSize?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ProductOptionSheet({
  productId,
  productName,
  price,
  options = [],
  trigger,
  recommendSize = 'L',
  isOpen,
  onOpenChange,
}: ProductOptionSheetProps) {
  const { state, actions } = useProductOption({
    productId,
    price,
    options,
    open: isOpen,
    onOpenChange,
  });

  return (
    <>
      <Sheet open={state.isOpen} onOpenChange={actions.setIsOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

        <SheetContent
          side="bottom"
          className="flex max-h-[85vh] flex-col rounded-t-[20px] px-0 pt-6 pb-0"
        >
          <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pb-6">
            <SheetHeader className="mb-6 space-y-1 text-left">
              <SheetTitle className="line-clamp-1 text-lg font-bold">
                {productName}
              </SheetTitle>
            </SheetHeader>

            <OptionSelectors
              colors={state.availableColors}
              sizes={state.availableSizes}
              currentColor={state.currentColor}
              currentSize={state.currentSize}
              onColorChange={(val) => {
                actions.setCurrentColor(val);
                actions.setCurrentSize('');
              }}
              onSizeChange={actions.setCurrentSize}
            />

            <SelectedItemList
              items={state.selectedItems}
              onUpdateQuantity={actions.updateQuantity}
              onRemove={actions.removeItem}
            />
          </div>

          <SheetFooter
            hasItems={state.selectedItems.length > 0}
            totalPrice={state.totalPrice}
            totalQuantity={state.selectedItems.reduce(
              (acc, i) => acc + i.quantity,
              0,
            )}
            recommendSize={recommendSize}
            isPending={state.isPending}
            onAction={actions.handleAction}
          />
        </SheetContent>
      </Sheet>

      <Dialog
        open={state.isSuccessModalOpen}
        onOpenChange={actions.setIsSuccessModalOpen}
      >
        <DialogContent className="rounded-xl sm:max-w-sm">
          <DialogHeader className="flex flex-col items-center justify-center space-y-3 pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="text-ongil-teal h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              장바구니에 상품을 담았습니다
            </DialogTitle>
            <DialogDescription className="text-center">
              선택하신 상품이 장바구니에 안전하게 보관되었습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
            <Button
              className="bg-ongil-teal h-12 w-full rounded-xl text-lg font-bold hover:bg-teal-600"
              onClick={() => {
                actions.setIsSuccessModalOpen(false);
                actions.navigateToCart();
              }}
            >
              담은 상품 보러가기
            </Button>
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="h-12 w-full rounded-xl bg-gray-100 text-base font-medium text-gray-700 hover:bg-gray-200"
              >
                쇼핑 계속하기
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
