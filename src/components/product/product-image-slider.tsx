'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

// 기능명세서 [8.1 상품 정보 표시] => 스와이프시 다음 이미지로 넘어가는 슬라이더.

interface ProductImageSliderProps {
  imageUrl: string;
}

export function ProductImageSlider({ imageUrl }: ProductImageSliderProps) {
  const images = Array(5).fill(imageUrl);

  // Carousel 상태 관리
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // 카운터 업데이트 로직
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full bg-white">
      <div className="sticky top-0 z-40 flex items-center justify-center border-b border-gray-200 bg-white py-6">
        <span className="text-2xl font-bold text-black">상품 정보</span>
      </div>

      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index} className="relative aspect-square w-full">
              <Image
                src={src}
                alt={`상품 이미지 ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 이미지 카운터 (우측 하단) */}
      <div className="absolute right-4 bottom-4 z-10">
        <div className="flex items-center justify-center rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {current} / {count}
        </div>
      </div>
    </div>
  );
}
