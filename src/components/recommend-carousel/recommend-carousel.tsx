'use client';

import { useState } from 'react';
import { Carousel, CarouselContent, type CarouselApi } from '../ui/carousel';
import { useCarouselDots } from '@/components/banner-carousel/use-carousel-dots';
import { DotNavigation } from '@/components/banner-carousel/dot-navigation';

interface RecommendCarouselProps {
  heading: string;
  children: React.ReactNode;
  showDots?: boolean;
}

export function RecommendCarousel({
  heading,
  children,
  showDots = false,
}: RecommendCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count, scrollTo } = useCarouselDots(api);

  return (
    <div className="flex w-full flex-col items-center gap-7.5 px-4">
      <h2 className="font-pretendard text-2xl font-bold">{heading}</h2>

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          dragFree: true,
          containScroll: 'trimSnaps',
        }}
        className="mx-auto w-full max-w-5xl"
      >
        <CarouselContent className="-ml-4">{children}</CarouselContent>
      </Carousel>
      {showDots && (
        <DotNavigation
          count={count}
          current={current}
          onDotClick={scrollTo}
          className="pt-1 pb-0"
        />
      )}
    </div>
  );
}
