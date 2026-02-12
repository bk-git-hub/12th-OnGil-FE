'use client';

import { useCartContext } from './cart-context';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function CartHeaderControl() {
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
