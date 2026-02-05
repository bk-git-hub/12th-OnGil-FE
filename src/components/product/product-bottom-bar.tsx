'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ViewCountToast } from '../ui/view-count-toast';
import ProductOptionSheet from '@/components/product-option-sheet/product-option-sheet';
import { ProductOption } from '@/types/domain/product';

interface BottomBarProduct {
  id: number;
  name: string;
  finalPrice: number;
  options?: ProductOption[];
}

interface ProductBottomBarProps {
  product: BottomBarProduct;
  recommendSize?: string;
}

export default function ProductBottomBar({
  product,
  recommendSize = 'L',
}: ProductBottomBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLike = () => {
    alert('찜하기 완료!');
  };

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="font-pretendard pb-safe-bottom fixed right-0 bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#c3c3c3] bg-white py-2 text-sm font-medium shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="pointer-events-none absolute right-0 bottom-full left-0 flex justify-center pb-2">
          <ViewCountToast />
        </div>

        {/* 찜하기 버튼 */}
        <Button
          variant="ghost"
          onClick={handleLike}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image src="/icons/heart.svg" alt="찜하기" width={36} height={36} />
          찜하기
        </Button>

        {/* 구매하기 버튼 */}
        <Button
          variant="ghost"
          onClick={handleOpenSheet}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image src="/icons/tag.svg" alt="구매하기" width={36} height={36} />
          구매하기
        </Button>

        {/* 장바구니 버튼 */}
        <Button
          variant="ghost"
          onClick={handleOpenSheet}
          className="flex h-auto flex-col items-center gap-1 hover:bg-gray-50"
        >
          <Image src="/icons/cart.svg" alt="장바구니" width={36} height={36} />
          장바구니
        </Button>
      </div>

      {/* 옵션 시트 */}
      <ProductOptionSheet
        productId={product.id}
        productName={product.name}
        price={product.finalPrice}
        options={product.options || []}
        recommendSize={recommendSize}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
