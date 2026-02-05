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
    <div className="border-t bg-white p-5 pb-8 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {!hasItems ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-center">
          <div className="text-ongil-teal mb-1 flex items-center justify-center gap-1.5">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI 사이즈 분석</span>
          </div>
          <p className="text-sm text-gray-600">
            회원님에게 추천하는 사이즈는{' '}
            <span className="text-ongil-teal mx-1 text-xl font-bold">
              {recommendSize}
            </span>{' '}
            입니다.
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              총 수량 {totalQuantity}개
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">총 금액</span>
              <span className="text-ongil-teal text-xl font-bold">
                {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-ongil-teal text-ongil-teal h-14 flex-1 rounded-xl text-lg font-bold hover:bg-teal-50"
              onClick={() => onAction('cart')}
              disabled={isPending}
            >
              {isPending ? '담는 중...' : '장바구니'}
            </Button>
            <Button
              className="h-14 flex-1 rounded-xl bg-black text-lg font-bold text-white hover:bg-gray-800"
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
