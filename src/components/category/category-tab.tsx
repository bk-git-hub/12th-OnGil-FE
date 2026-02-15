import { cn } from '@/lib/utils';

// 카테고리 선택용 탭 버튼 컴포넌트(활성/비활성)
interface CategoryTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  label: string;
}

export default function CategoryTab({
  isActive,
  label,
  className,
  ...props
}: CategoryTabProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-36 w-full cursor-pointer items-center justify-center border-b border-gray-300 bg-gray-100 px-3 text-2xl font-semibold transition-colors duration-200',

        isActive
          ? 'text-red-500'
          : 'text-gray-700 hover:bg-gray-200',
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}
