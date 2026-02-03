'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { DotNavigation } from '@/components/banner-carousel/dot-navigation';
import AnalysisContent from './analysis-content';
import { ReviewStatsData } from '@/types/domain/review';

// 리뷰 요약 섹션에서 자세히 버튼 눌렀을 때 보이는 요약 모달 컴포넌트.

interface ReviewSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: ReviewStatsData | null;
  availableOptions?: {
    sizes: string[];
    colors: string[];
  };
}

export function ReviewSummaryModal({
  isOpen,
  onClose,
  stats,
  availableOptions = { sizes: [], colors: [] },
}: ReviewSummaryModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (!stats) return null;

  const cards = [stats.sizeSummary, stats.colorSummary, stats.materialSummary];
  const count = cards.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="flex h-screen w-screen max-w-none flex-col justify-center bg-black/50">
          <div className="w-full rounded-3xl bg-white p-4">
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{ loop: true, align: 'start' }}
            >
              <CarouselContent>
                {cards.map((card, index) => {
                  let options: string[] = [];

                  if (card.category === '사이즈') {
                    options = availableOptions.sizes;
                  } else if (card.category === '색감') {
                    options = availableOptions.colors;
                  } else {
                    options = [];
                  }

                  return (
                    <CarouselItem key={index}>
                      <AnalysisContent
                        category={card.category}
                        stat={card}
                        filterOptions={options}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>

            {/* 인디케이터 */}
            <div className="relative flex justify-center py-6">
              <DotNavigation
                count={count}
                current={current}
                onDotClick={scrollTo}
                className="mt-4 p-0"
              />
            </div>

            {/* 닫기 버튼 */}
            <Button
              variant="outline"
              className="bg-ongil-teal w-full rounded-xl border-none py-6 text-base font-bold text-white hover:bg-teal-600 hover:text-white"
              onClick={() => onClose()}
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
