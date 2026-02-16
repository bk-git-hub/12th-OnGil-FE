'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ViewCountToast } from '../ui/view-count-toast';
import ProductOptionSheet from '@/components/product-option-sheet/product-option-sheet';
import { ProductOption } from '@/types/domain/product';
import { useWishlist } from '@/hooks/use-wishlist';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface BottomBarProduct {
  id: number;
  name: string;
  finalPrice: number;
  options?: ProductOption[];
}

interface ProductBottomBarProps {
  product: BottomBarProduct;
  recommendSize?: string;
  initialIsLiked: boolean;
  initialWishlistId?: number;
}

export default function ProductBottomBar({
  product,
  recommendSize = 'L',
  initialIsLiked,
  initialWishlistId,
}: ProductBottomBarProps) {
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

  const { isLiked, isPending, toggle } = useWishlist({
    productId: product.id,
    initialIsLiked,
    initialWishlistId,
    onAddSuccess: () => setIsWishlistModalOpen(true),
  });
  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="font-pretendard pb-safe-bottom fixed right-0 bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#c3c3c3] bg-white py-2 text-sm font-medium shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="pointer-events-none absolute right-0 bottom-full left-0 flex justify-center pb-2">
          <ViewCountToast />
        </div>

        <Button
          variant="ghost"
          onClick={toggle}
          disabled={isPending}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image
            src={isLiked ? '/icons/heart-filled.svg' : '/icons/heart.svg'}
            alt="찜하기"
            width={36}
            height={36}
          />
          찜하기
        </Button>

        <Button
          variant="ghost"
          onClick={handleOpenSheet}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image src="/icons/tag.svg" alt="구매하기" width={36} height={36} />
          구매하기
        </Button>

        <Button
          variant="ghost"
          onClick={handleOpenSheet}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image src="/icons/cart.svg" alt="장바구니" width={36} height={36} />
          장바구니
        </Button>
      </div>

      <ProductOptionSheet
        productId={product.id}
        productName={product.name}
        price={product.finalPrice}
        options={product.options || []}
        recommendSize={recommendSize}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      <Dialog open={isWishlistModalOpen} onOpenChange={setIsWishlistModalOpen}>
        <DialogContent className="rounded-xl sm:max-w-sm">
          <DialogHeader className="flex flex-col items-center justify-center space-y-3 pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="text-ongil-teal h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              찜 목록에 추가되었습니다
            </DialogTitle>
            <DialogDescription className="text-center">
              선택하신 상품을 찜 목록에 저장했어요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
            <Button
              className="bg-ongil-teal h-12 w-full rounded-xl text-lg font-bold hover:bg-teal-600"
              onClick={() => {
                setIsWishlistModalOpen(false);
                router.push('/me/wishlist');
              }}
            >
              찜 목록 보기
            </Button>
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="h-12 w-full rounded-xl bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300"
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
