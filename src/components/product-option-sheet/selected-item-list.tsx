import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectedItem } from './use-product-option';

interface SelectedItemListProps {
  items: SelectedItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function SelectedItemList({
  items,
  onUpdateQuantity,
  onRemove,
}: SelectedItemListProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 pt-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="animate-in slide-in-from-top-2 fade-in relative rounded-xl border border-gray-100 bg-gray-50 p-4 pr-10 duration-300"
        >
          <div className="mb-2 text-sm text-gray-700">
            <span className="font-medium text-black">{item.color}</span> /{' '}
            {item.size}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0 rounded-lg border bg-white shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="h-8 w-8 text-gray-400 hover:text-black"
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center text-sm font-bold">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="h-8 w-8 text-gray-400 hover:text-black"
              >
                <Plus size={14} />
              </Button>
            </div>
            <span className="font-bold">
              {new Intl.NumberFormat('ko-KR').format(
                item.price * item.quantity,
              )}
              원
            </span>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
