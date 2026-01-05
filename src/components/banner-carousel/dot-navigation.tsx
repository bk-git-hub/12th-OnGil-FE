// components/ui/carousel-dots.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

interface DotNavigationProps {
  count: number;
  current: number;
  onDotClick: (index: number) => void;
  className?: string;
}

export function DotNavigation({
  count,
  current,
  onDotClick,
  className,
}: DotNavigationProps) {
  if (count <= 1) return null;

  return (
    <div className={cn('flex justify-center gap-2 py-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={current === index}
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => onDotClick(index)}
          className={cn(
            'h-3 w-3 rounded-full transition-all duration-300',
            current === index
              ? 'bg-ongil-mint border-ongil-teal border-2'
              : 'bg-black/50',
          )}
        />
      ))}
    </div>
  );
}
