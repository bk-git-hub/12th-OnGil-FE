'use client';

import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useCarouselDots } from './use-carousel-dots';
import { DotNavigation } from './dot-navigation';
import Autoplay from 'embla-carousel-autoplay';

export function CarouselWithDots() {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count, scrollTo } = useCarouselDots(api);

  return (
    <div className="w-screen max-w-200">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent className="max-h-125 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <div className="bg-card text-card-foreground flex aspect-380/275 h-full w-full items-center justify-center border-4">
                <span className="text-4xl font-bold">{i + 1}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <DotNavigation count={count} current={current} onDotClick={scrollTo} />
    </div>
  );
}
