'use client';

import { useState } from 'react';
import type { CategorySimple } from '@/types/domain/category';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../ui/carousel';
import { useCarouselDots } from '../banner-carousel/use-carousel-dots';
import { DotNavigation } from '../banner-carousel/dot-navigation';

interface CategoryMainRecommendProps {
  items: CategorySimple[];
  parentLookup: Record<number, number>;
  isVisible: boolean;
  userName: string;
}

export default function CategoryMainRecommend({
  items,
  parentLookup,
  isVisible,
  userName,
}: CategoryMainRecommendProps) {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count, scrollTo } = useCarouselDots(api);

  return (
    <section
      className={`overflow-hidden border-b border-gray-200 bg-white transition-[max-height,opacity] duration-300 ${
        isVisible ? 'max-h-[280px] opacity-100' : 'max-h-0 opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="px-4 py-5">
        <h2 className="mb-4 text-2xl leading-normal font-bold">
          {userName}님을 위한 추천
        </h2>

        <Carousel
          setApi={setApi}
          opts={{ align: 'start', containScroll: 'trimSnaps' }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 pb-1">
            {items.map((item) => {
              const parentId = parentLookup[item.categoryId];
              const href = parentId
                ? `/category/${parentId}/${item.categoryId}`
                : '/category';

              return (
                <CarouselItem key={item.categoryId} className="basis-auto pl-4">
                  <Link
                    href={href}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="relative h-[96px] w-[96px] overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={item.iconUrl || '/icons/star.svg'}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <span className="w-full text-center text-xl leading-normal font-semibold">
                      {item.name}
                    </span>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        <DotNavigation
          count={count}
          current={current}
          onDotClick={scrollTo}
          className="pt-3 pb-0"
        />
      </div>
    </section>
  );
}
