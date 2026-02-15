import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SheetFooterProps {
  hasItems: boolean;
  totalPrice: number;
  totalQuantity: number;
  recommendSize: string;
  isPending: boolean;
  onAction: (type: 'cart' | 'buy') => void;
}

export default function SheetFooter({
  hasItems,
  totalPrice,
  totalQuantity,
  recommendSize,
  isPending,
  onAction,
}: SheetFooterProps) {
  return (
    <div className="border-t bg-white p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {!hasItems ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 border-ongil-teal bg-ongil-mint/50 rounded-xl border p-4">
          <p className="text-center text-xl leading-tight">
            회원님에게 추천하는 사이즈는
            <span className="text-ongil-teal m-1 text-2xl font-bold">
              {recommendSize}
            </span>
            입니다.
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="mb-2 flex items-center justify-between p-2 text-xl leading-normal">
            <span className="font-medium text-gray-500">
              총 수량 {totalQuantity}개
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-700">
                총 금액
              </span>
              <span className="text-ongil-teal text-xl font-semibold">
                {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="h-14 flex-1 rounded-xl bg-gray-100 text-lg font-bold text-gray-700 hover:bg-gray-200"
              onClick={() => onAction('cart')}
              disabled={isPending}
            >
              {isPending ? '담는 중...' : '장바구니'}
            </Button>
            <Button
              className="bg-ongil-teal h-14 flex-1 rounded-xl text-lg font-bold text-white hover:bg-teal-600"
              onClick={() => onAction('buy')}
              disabled={isPending}
            >
              {isPending ? '처리 중...' : '구매하기'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
