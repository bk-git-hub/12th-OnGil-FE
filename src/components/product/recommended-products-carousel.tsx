'use client';

import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useCarouselDots } from '@/components/banner-carousel/use-carousel-dots';
import { DotNavigation } from '@/components/banner-carousel/dot-navigation';
import { ProductCard } from './product-card';
import { type Product } from '@/mocks/product-data';
import Autoplay from 'embla-carousel-autoplay';

interface RecommendedProductsCarouselProps {
  products: Product[];
  isLoading?: boolean;
}

// 추천 상품 캐러셀 컴포넌트, 유사 상품들을 가로 스크롤 형식으로 표시

export function RecommendedProductsCarousel({
  products,
}: RecommendedProductsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count, scrollTo } = useCarouselDots(api);

  // 데이터가 빈 배열일 경우 렌더링 안 함
  if (products.length === 0) return null;

  return (
    <div className="w-full pt-4">
      <h3 className="mb-6 px-1 text-lg font-bold">해당 제품과 비슷한 상품</h3>

      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: 'start',
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product, i) => (
            <CarouselItem
              // key에 product.id가 없으면 인덱스 사용
              key={product.id || i}
              className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <DotNavigation
        count={count}
        current={current}
        onDotClick={scrollTo}
        className="mt-6"
      />
    </div>
  );
}
