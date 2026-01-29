'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

// 이미지 클릭시 나오는 모달 컴포넌트

interface ReviewImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrls: string[];
  initialSlide: number;
}

export function ReviewImageModal({
  isOpen,
  onClose,
  imageUrls,
  initialSlide,
}: ReviewImageModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex h-screen w-screen max-w-none flex-col rounded-none border-none bg-black/80 p-0"
        aria-label="이미지 전체 화면 보기"
      >
        <div className="pointer-events-none absolute top-0 left-0 z-[100] flex w-full items-start justify-between p-4">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-md">
            {current} / {count}
          </div>
          <button
            onClick={onClose}
            className="pointer-events-auto ml-auto rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-full w-full flex-1 items-center justify-center overflow-hidden">
          <Carousel
            setApi={setApi}
            className="grid h-full w-full space-x-2 py-0"
            opts={{ startIndex: initialSlide, loop: true }}
          >
            <CarouselContent className="m-0 flex h-full">
              {imageUrls.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="flex h-full basis-full items-center justify-center gap-2 p-0 pl-0"
                >
                  <div className="relative h-full min-h-0 w-full">
                    <Image
                      src={src}
                      alt={`전체 화면 리뷰 이미지 ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority={index === initialSlide}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {imageUrls.length > 1 && (
              <>
                <CarouselPrevious className="left-4 z-[100] h-12 w-12 border-none bg-white/10 text-white hover:bg-white/30 [&_svg]:h-8 [&_svg]:w-8" />
                <CarouselNext className="right-4 z-[100] h-12 w-12 border-none bg-white/10 text-white hover:bg-white/30 [&_svg]:h-8 [&_svg]:w-8" />
              </>
            )}
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
