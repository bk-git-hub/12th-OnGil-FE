'use client';

import { useCartContext } from './cart-context';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';

// ----------------------------------------------------------------------
// [1] 상단 컨트롤 바 (전체 선택 / 선택 삭제)
// ----------------------------------------------------------------------
export function CartHeaderControl() {
  const { optimisticCart, selectedIds, toggleAll, handleDeleteSelected } =
    useCartContext();

  if (optimisticCart.length === 0) return null;

  const isAllSelected = selectedIds.size === optimisticCart.length;
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="sticky top-24 z-10 flex items-center justify-between bg-white px-9 py-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="all-select"
          checked={isAllSelected}
          onCheckedChange={(checked) => toggleAll(!!checked)}
          className="data-[state=checked]:text-ongil-mint data-[state=checked]:bg-ongil-teal h-7 w-7 rounded border-black"
        />
        <label htmlFor="all-select" className="cursor-pointer select-none">
          전체 선택 ({selectedIds.size}/{optimisticCart.length})
        </label>
      </div>

      <button
        type="button"
        onClick={handleDeleteSelected}
        disabled={!hasSelection}
        className={cn(
          'bg-ongil-teal rounded-2xl p-3 font-normal text-white transition-colors',
          !hasSelection && 'cursor-not-allowed bg-[#D9D9D9]',
        )}
      >
        <span>선택 삭제</span>
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// [2] 상품 리스트 (빈 화면 포함)
// ----------------------------------------------------------------------

function EmptyCartView() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-gray-400">
      <p>장바구니가 비어있습니다.</p>
    </div>
  );
}

export function CartItemList() {
  const {
    optimisticCart,
    selectedIds,
    toggleItem,
    handleQuantity,
    handleDelete,
  } = useCartContext();

  if (optimisticCart.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="mt-4 flex flex-col gap-[30px] bg-white px-[21px] pb-32">
      {optimisticCart.map((item) => (
        <CartItem
          key={item.cartId}
          item={item}
          isChecked={selectedIds.has(item.cartId)}
          onToggleCheck={(checked) => toggleItem(item.cartId, checked)}
          onQuantityChange={(qty) => handleQuantity(item.cartId, qty)}
          onDelete={() => handleDelete(item.cartId)}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// [3] 하단 결제 바
// ----------------------------------------------------------------------
export function CartSummaryFooter() {
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
