'use client';

import Image from 'next/image';
import { CartResponse } from '@/types/domain/cart';
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

export function CartItem({
  item,
  isChecked,
  onToggleCheck,
  onQuantityChange,
  onDelete,
}: CartItemProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ko-KR').format(price);

  return (
    <Card
      className={cn(
        'flex flex-col gap-0 border-black p-0 text-xl leading-[18px] font-medium shadow-none',
        item.quantity === 0 && 'opacity-50',
      )}
    >
      <div className="border-b border-black py-5">
        <p className="text-center">{item.brandName}</p>
      </div>

      <div className="p-4">
        <div className="mt-5 flex items-center gap-3">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => onToggleCheck(checked as boolean)}
            className="data-[state=checked]:text-ongil-mint data-[state=checked]:bg-ongil-teal h-7 w-7 rounded border-black"
          />
          <span>제품 선택</span>
        </div>

        {/* 상품 정보 */}
        <div className="mt-11 flex gap-2">
          <Image
            src={item.thumbnailImageUrl}
            alt={item.productName}
            width={110}
            height={110}
            className="object-cover"
          />
          <div className="flex flex-col gap-[29px]">
            <span>{item.productName}</span>
            <span>
              {item.selectedColor} / {item.selectedSize}
            </span>
            <span>{item.quantity}개</span>
          </div>
        </div>

        {/* 수량 조절 및 가격 */}
        <div className="mt-[10px] flex items-center justify-between">
          <div className="flex items-center gap-1 rounded border border-black px-1">
            <button
              className="flex h-8 w-8 items-center justify-center"
              onClick={() => onQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className="flex h-8 w-8 items-center justify-center text-gray-600"
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              +
            </button>
          </div>
          <span>{formatPrice(item.totalPrice)}원</span>
        </div>

        {/* 버튼 그룹 */}
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
