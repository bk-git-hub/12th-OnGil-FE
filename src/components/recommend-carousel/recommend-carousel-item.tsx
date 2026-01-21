import { CarouselItem } from '../ui/carousel';
import { cn } from '@/lib/utils';
interface RecommendCarouselItemProps {
  children: React.ReactNode;
  width?: number | string;
  className?: string;
}

export function RecommendCarouselItem({
  children,
  width = 260,
  className,
}: RecommendCarouselItemProps) {
  const flexBasis = typeof width === 'number' ? `${width}px` : width;

  return (
    <CarouselItem
      className={cn('flex-none pl-5.5', className)}
      style={{ flexBasis }}
    >
      {children}
    </CarouselItem>
  );
}
