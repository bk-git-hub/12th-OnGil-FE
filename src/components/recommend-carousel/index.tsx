import { ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Category } from '@/mocks/categories';

interface RecommendCarouselProps {
  heading: string;
  children: ReactNode;
}

export function RecommendCarousel({
  heading,
  children,
}: RecommendCarouselProps) {
  return (
    <div className="w-full px-4">
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
          containScroll: 'trimSnaps',
        }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="mb-4 flex items-center justify-between px-1">
          <CarouselPrevious className="static h-9 w-9 translate-y-0" />
          <h2 className="font-pretendard text-xl font-bold">{heading}</h2>
          <CarouselNext className="static h-9 w-9 translate-y-0" />
        </div>

        <CarouselContent className="-ml-4">{children}</CarouselContent>
      </Carousel>
    </div>
  );
}

interface RecommendCarouselItemProps {
  children: ReactNode;
  width?: number | string;
  className?: string;
}

export function RecommendCarouselItem({
  children,
  width = 222,
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

interface CategoryCarouselCardProps {
  category: Category;
}

export function CategoryCarouselCard({ category }: CategoryCarouselCardProps) {
  let categorySquare;
  if (category.imageUrl !== null) {
    categorySquare = (
      <img
        src={category.imageUrl}
        alt={category.name}
        width={200}
        height={200}
        className="rounded-[28px]"
      />
    );
  } else {
    categorySquare = (
      <div className="bg-ongil-teal flex aspect-square w-full items-center justify-center rounded-[28px]">
        <span className="text-2xl text-white">{category.name}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {categorySquare}
      <span className="font-pretendard text-[32px] font-bold">
        {category.name}
      </span>
    </div>
  );
}
