'use client';

import { useCartContext } from './cart-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';

export default function CartSummaryFooter() {
  const { optimisticCart, totalAmount, selectedIds, handleCartCheckout } =
    useCartContext();

  if (optimisticCart.length === 0) return null;

  const hasSelection = selectedIds.size > 0;
  const formattedPrice = formatPrice(totalAmount);

  return (
    <Button
      disabled={!hasSelection}
      onClick={handleCartCheckout}
      className={cn(
        'safe-area-pb fixed right-0 bottom-0 left-0 z-50 flex h-20 rounded-none transition-colors',
        'disabled:opacity-100',
        hasSelection ? 'bg-ongil-mint hover:bg-ongil-mint' : 'bg-[#C5C5C5]',
      )}
    >
      <span
        className={cn(
          'text-3xl leading-[18px] font-semibold',
          hasSelection ? 'text-black' : 'text-white',
        )}
      >
        {formattedPrice}원 구매하기
      </span>
    </Button>
  );
}
