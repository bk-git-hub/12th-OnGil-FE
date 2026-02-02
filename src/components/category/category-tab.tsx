import { cn } from '@/lib/utils';

// 카테고리 선택용 탭 버튼 컴포넌트(활성/비활성)
interface CategoryTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  label: string;
}

export function CategoryTab({
  isActive,
  label,
  className,
  ...props
}: CategoryTabProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h- w-full flex-1 cursor-pointer items-center justify-center text-sm transition-colors duration-200',

        isActive
          ? 'text-ongil-teal bg-white font-bold'
          : 'bg-gray-300/50 text-gray-500 hover:bg-gray-100/50',
      )}
      {...props}
    >
      {label}
    </button>
  );
}
