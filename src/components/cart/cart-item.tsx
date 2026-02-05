'use client';

import Image from 'next/image';
import type { CartResponse } from '@/types/domain/cart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartResponse;
  isChecked: boolean;
  onToggleCheck: (checked: boolean) => void;
  onQuantityChange: (newQuantity: number) => void;
  onDelete: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ko-KR').format(price);

export function CartItem({
  item,
  isChecked,
  onToggleCheck,
  onQuantityChange,
  onDelete,
}: CartItemProps) {
  const {
    brandName,
    productName,
    thumbnailImageUrl,
    selectedColor,
    selectedSize,
    quantity,
    totalPrice,
  } = item;

  const handleDecrease = () => {
    if (quantity > 1) onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <Card
      className={cn(
        'flex flex-col gap-0 border-black p-0 text-xl leading-[18px] font-medium shadow-none',
        quantity === 0 && 'opacity-50',
      )}
    >
      <div className="border-b border-black py-5">
        <p className="text-center">{brandName}</p>
      </div>

      <div className="p-4">
        <div className="mt-5 flex items-center gap-3">
          <Checkbox
            id={`check-${item.cartId}`}
            checked={isChecked}
            onCheckedChange={(c) => onToggleCheck(!!c)}
            className="data-[state=checked]:text-ongil-mint data-[state=checked]:bg-ongil-teal h-7 w-7 rounded border-black"
          />
          <label htmlFor={`check-${item.cartId}`} className="cursor-pointer">
            제품 선택
          </label>
        </div>

        {/* 상품 정보 (이미지 + 텍스트) */}
        <div className="mt-11 flex gap-2">
          <Image
            src={thumbnailImageUrl}
            alt={productName}
            width={110}
            height={110}
            className="object-cover"
          />
          <div className="flex flex-col gap-[29px]">
            <span>{productName}</span>
            <span>
              {selectedColor} / {selectedSize}
            </span>
            <span>{quantity}개</span>
          </div>
        </div>

        {/* 수량 조절 및 가격 */}
        <div className="mt-[10px] flex items-center justify-between">
          <div className="flex items-center gap-1 rounded border border-black px-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label="수량 감소"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="flex h-8 w-8 items-center justify-center text-gray-600"
              onClick={handleIncrease}
              aria-label="수량 증가"
            >
              +
            </button>
          </div>
          <span>{formatPrice(totalPrice)}원</span>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            onClick={onDelete}
            className="h-[57px] rounded-full bg-gray-200 font-bold text-black"
          >
            <span className="text-xl leading-[18px] font-bold">삭제</span>
          </Button>
          <Button
            variant="ghost"
            className="bg-ongil-teal h-[57px] rounded-full font-bold text-white"
            onClick={() => alert('구현 예정')}
          >
            <span className="text-xl leading-[18px] font-bold">옵션 변경</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
