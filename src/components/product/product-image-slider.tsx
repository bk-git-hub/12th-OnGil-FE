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

    // 상태 업데이트 함수
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    // 초기화 로직
    setCount(api.scrollSnapList().length);
    onSelect(); // 초기값 설정을 위해 한 번 호출

    // 이벤트 리스너 등록
    api.on('select', onSelect);

    // 클린업 함수
    // 컴포넌트가 사라지거나 api가 변경될 때 이벤트를 해제
    return () => {
      api.off('select', onSelect);
    };
  }, [api, setCount, setCurrent]);

  return (
    <div className="relative w-full bg-white">
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
