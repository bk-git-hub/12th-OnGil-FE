import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// 하위 카테고리 아이템 컴포넌트.

interface SubCategoryItemProps {
  label: string;
  imageUrl: string;
  href: string;
  className?: string;
}

export default function SubCategoryItem({
  label,
  imageUrl,
  href,
  className,
}: SubCategoryItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50',
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 shadow-sm">
        <Image
          src={imageUrl}
          alt={label}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 33vw, 20vw"
          loading="lazy"
        />
      </div>
      <span className="text-center text-xs font-medium break-keep text-gray-700">
        {label}
      </span>
    </Link>
  );
}
