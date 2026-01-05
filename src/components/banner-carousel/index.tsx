'use client';

import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useCarouselDots } from './use-carousel-dots';
import { DotNavigation } from './dot-navigation';

export function CarouselWithDots() {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count, scrollTo } = useCarouselDots(api);

  return (
    <div className="w-screen">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <div className="bg-card text-card-foreground flex aspect-380/275 h-full w-full items-center justify-center border-4">
                <span className="text-4xl font-bold">{i + 1}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <DotNavigation count={count} current={current} onDotClick={scrollTo} />
    </div>
  );
}
