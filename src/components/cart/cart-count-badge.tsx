'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';

interface CartCountBadgeProps {
  className?: string;
}

export function CartCountBadge({ className }: CartCountBadgeProps) {
  const { count } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || count <= 0) return null;

  return (
    <span
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded-full bg-[#FF0004] text-sm font-bold text-white',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
