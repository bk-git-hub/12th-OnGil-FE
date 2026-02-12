'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useCarouselDots } from './use-carousel-dots';
import { DotNavigation } from './dot-navigation';
import Autoplay from 'embla-carousel-autoplay';
import { Advertisement } from '@/types/domain/advertisement';

interface CarouselWithDotsProps {
  advertisements: Advertisement[];
}

export function CarouselWithDots({ advertisements }: CarouselWithDotsProps) {
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
        <CarouselContent className="m-0 max-h-125 w-full">
          {advertisements.map((item) => (
            <CarouselItem key={item.id} className="p-0">
              <div className="relative aspect-380/275 h-full w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-black break-keep">
                    {item.title}
                  </h3>
                  <p className="text-lg font-medium break-keep opacity-90">
                    {item.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <DotNavigation count={count} current={current} onDotClick={scrollTo} />
    </div>
  );
}
