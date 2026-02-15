import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface OptionSelectorsProps {
  colors: string[];
  sizes: string[];
  currentColor: string;
  currentSize: string;
  onColorChange: (val: string) => void;
  onSizeChange: (val: string) => void;
}

export default function OptionSelectors({
  colors,
  sizes,
  currentColor,
  currentSize,
  onColorChange,
  onSizeChange,
}: OptionSelectorsProps) {
  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-600">색상</span>
          <Select value={currentColor} onValueChange={onColorChange}>
            <SelectTrigger className="h-14 w-full rounded-xl border-gray-300 bg-white px-4 text-base font-medium focus:ring-0">
              <SelectValue placeholder="색상을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem
                  key={color}
                  value={color}
                  className="cursor-pointer text-base"
                >
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          currentColor
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-2 pt-2">
            <span className="text-sm font-medium text-gray-600">사이즈</span>
            <Select
              value={currentSize}
              onValueChange={onSizeChange}
              disabled={!currentColor}
            >
              <SelectTrigger className="h-14 w-full rounded-xl border-gray-300 bg-white px-4 text-base font-medium focus:ring-0">
                <SelectValue placeholder="사이즈를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={size}
                    className="cursor-pointer text-base"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
