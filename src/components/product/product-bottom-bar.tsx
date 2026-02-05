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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
          onClick={() => setIsSheetOpen(true)}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image src="/icons/tag.svg" alt="구매하기" width={36} height={36} />
          구매하기
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsSheetOpen(true)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>찜 목록에 추가되었습니다</DialogTitle>
            <DialogDescription>찜 목록으로 이동하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button
              variant="secondary"
              className="flex-1 sm:flex-none"
              onClick={() => setIsWishlistModalOpen(false)}
            >
              쇼핑 계속하기
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              onClick={() => {
                setIsWishlistModalOpen(false);
                router.push('/me/wishlist');
              }}
            >
              찜 목록 보기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
