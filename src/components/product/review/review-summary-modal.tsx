'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { DotNavigation } from '@/components/banner-carousel/dot-navigation';
import { getReviewDetailAction } from '@/app/actions/review';
import AnalysisContent from './analysis-content';
import { MONTH_REVIEW_QUESTIONS } from './review-constants';
import { fetchAllProductReviews } from './review-fetch-utils';
import { buildCategorySummaryFromReviews } from './review-summary-utils';
import {
  ProductReviewListItem,
  ReviewCategorySummary,
  ReviewStatsData,
} from '@/types/domain/review';

// 리뷰 요약 섹션에서 자세히 버튼 눌렀을 때 보이는 요약 모달 컴포넌트.

interface ReviewSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  reviewType: 'INITIAL' | 'ONE_MONTH';
  recommendedSize?: string;
  stats?: ReviewStatsData | null;
  availableOptions?: {
    sizes: string[];
    colors: string[];
  };
}

export default function ReviewSummaryModal({
  isOpen,
  onClose,
  productId,
  reviewType,
  recommendedSize,
  stats,
  availableOptions = { sizes: [], colors: [] },
}: ReviewSummaryModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [baseMonthSizeStat, setBaseMonthSizeStat] =
    useState<ReviewCategorySummary | null>(null);
  const [baseMonthColorStat, setBaseMonthColorStat] =
    useState<ReviewCategorySummary | null>(null);
  const [sizeStat, setSizeStat] = useState<ReviewCategorySummary | null>(null);
  const [colorStat, setColorStat] = useState<ReviewCategorySummary | null>(
    null,
  );
  const [isSizeLoading, setIsSizeLoading] = useState(false);
  const [isColorLoading, setIsColorLoading] = useState(false);
  const initialAnswerCacheRef = useRef<
    Map<number, ProductReviewListItem['initialFirstAnswers'] | null>
  >(new Map());
  const availableSizeKey = availableOptions.sizes.join('|');
  const sizeCategory = stats?.sizeSummary.category ?? '사이즈';
  const colorCategory = stats?.colorSummary.category ?? '색감';
  const sizeSummaryKey =
    reviewType === 'ONE_MONTH'
      ? MONTH_REVIEW_QUESTIONS[0].summaryKey
      : 'sizeAnswer';
  const colorSummaryKey =
    reviewType === 'ONE_MONTH'
      ? MONTH_REVIEW_QUESTIONS[1].summaryKey
      : 'colorAnswer';

  const hydrateInitialAnswers = useCallback(
    async (reviews: ProductReviewListItem[]) => {
      if (reviewType !== 'INITIAL') {
        return reviews;
      }

      const targets = reviews.filter((review) => {
        const answers = review.initialFirstAnswers ?? review.answers;
        return (
          !answers?.sizeAnswer &&
          !answers?.colorAnswer &&
          !answers?.materialAnswer
        );
      });

      if (targets.length === 0) {
        return reviews;
      }

      const uncachedTargets = targets.filter(
        (review) => !initialAnswerCacheRef.current.has(review.reviewId),
      );

      if (uncachedTargets.length > 0) {
        const hydratedEntries = await Promise.allSettled(
          uncachedTargets.slice(0, 30).map(async (review) => {
            const detail = await getReviewDetailAction(review.reviewId);
            return {
              reviewId: review.reviewId,
              initialFirstAnswers: detail?.initialFirstAnswers ?? null,
            };
          }),
        );

        hydratedEntries.forEach((entry) => {
          if (entry.status === 'fulfilled') {
            initialAnswerCacheRef.current.set(
              entry.value.reviewId,
              entry.value.initialFirstAnswers,
            );
          }
        });
      }

      const answerById = new Map<
        number,
        ProductReviewListItem['initialFirstAnswers']
      >();
      targets.forEach((review) => {
        const cached = initialAnswerCacheRef.current.get(review.reviewId);
        if (cached) {
          answerById.set(review.reviewId, cached);
        }
      });

      if (answerById.size === 0) {
        return reviews;
      }

      return reviews.map((review) => {
        const initialFirstAnswers = answerById.get(review.reviewId);
        return initialFirstAnswers
          ? { ...review, initialFirstAnswers }
          : review;
      });
    },
    [reviewType],
  );

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

  useEffect(() => {
    if (!isOpen) return;
    setSelectedSize('all');
    setSelectedColor('all');
    setSizeStat(null);
    setColorStat(null);
  }, [isOpen, reviewType, recommendedSize, availableSizeKey]);

  useEffect(() => {
    if (!isOpen || reviewType !== 'ONE_MONTH' || !stats) return;

    let isMounted = true;
    setIsColorLoading(true);

    fetchAllProductReviews(productId, {
      reviewType: 'ONE_MONTH',
      sort: 'BEST',
    })
      .then((allReviews) => {
        if (!isMounted) return;
        const derivedOverall = buildCategorySummaryFromReviews(
          sizeCategory,
          allReviews,
          'overall',
        );
        const derivedChanges = buildCategorySummaryFromReviews(
          colorCategory,
          allReviews,
          'changes',
        );

        setBaseMonthSizeStat(derivedOverall);
        setBaseMonthColorStat(derivedChanges);
      })
      .catch((error) => {
        console.error('월간 기본 통계 조회 실패:', error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsColorLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    isOpen,
    reviewType,
    productId,
    stats,
    sizeCategory,
    colorCategory,
  ]);

  useEffect(() => {
    if (reviewType !== 'ONE_MONTH') return;
    if (selectedSize !== 'all') return;
    setSizeStat(baseMonthSizeStat);
  }, [reviewType, selectedSize, baseMonthSizeStat]);

  useEffect(() => {
    if (reviewType !== 'ONE_MONTH') return;
    if (selectedColor !== 'all') return;
    setColorStat(baseMonthColorStat);
  }, [reviewType, selectedColor, baseMonthColorStat]);

  const fetchSizeStat = useCallback(
    async (value: string) => {
      if (!sizeSummaryKey) {
        setSizeStat(null);
        return;
      }
      const nextSize = value === 'all' ? undefined : value;
      const nextColor = selectedColor === 'all' ? undefined : selectedColor;
      const hasAnyFilter = Boolean(nextSize || nextColor);

      if (!hasAnyFilter) {
        setSizeStat(null);
        return;
      }

      setIsSizeLoading(true);
      try {
        const reviews = await fetchAllProductReviews(productId, {
          reviewType,
          size: nextSize,
          color: nextColor,
          sort: 'BEST',
        });
        const hydratedReviews = await hydrateInitialAnswers(reviews);
        setSizeStat(
          buildCategorySummaryFromReviews(
            sizeCategory,
            hydratedReviews,
            sizeSummaryKey,
          ),
        );
      } catch (error) {
        console.error('사이즈 통계 필터 조회 실패:', error);
      } finally {
        setIsSizeLoading(false);
      }
    },
    [
      productId,
      reviewType,
      sizeSummaryKey,
      sizeCategory,
      selectedColor,
      hydrateInitialAnswers,
    ],
  );

  const fetchColorStat = useCallback(
    async (value: string) => {
      if (!colorSummaryKey) {
        setColorStat(null);
        return;
      }
      const nextColor = value === 'all' ? undefined : value;
      const nextSize = selectedSize === 'all' ? undefined : selectedSize;
      const hasAnyFilter = Boolean(nextSize || nextColor);

      if (!hasAnyFilter) {
        setColorStat(null);
        return;
      }

      setIsColorLoading(true);
      try {
        const reviews = await fetchAllProductReviews(productId, {
          reviewType,
          size: nextSize,
          color: nextColor,
          sort: 'BEST',
        });
        const hydratedReviews = await hydrateInitialAnswers(reviews);
        setColorStat(
          buildCategorySummaryFromReviews(
            colorCategory,
            hydratedReviews,
            colorSummaryKey,
          ),
        );
      } catch (error) {
        console.error('색감 통계 필터 조회 실패:', error);
      } finally {
        setIsColorLoading(false);
      }
    },
    [
      productId,
      reviewType,
      colorSummaryKey,
      colorCategory,
      selectedSize,
      hydrateInitialAnswers,
    ],
  );

  const handleSizeChange = useCallback(
    (value: string) => {
      setSelectedSize(value);
      fetchSizeStat(value);
    },
    [fetchSizeStat],
  );

  const handleColorChange = useCallback(
    (value: string) => {
      setSelectedColor(value);
      fetchColorStat(value);
    },
    [fetchColorStat],
  );

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (!stats) return null;

  const cards =
    reviewType === 'ONE_MONTH'
      ? [
          sizeStat ?? baseMonthSizeStat ?? stats.sizeSummary,
          colorStat ?? baseMonthColorStat ?? stats.colorSummary,
        ]
      : [
          sizeStat ?? stats.sizeSummary,
          colorStat ?? stats.colorSummary,
          stats.materialSummary,
        ];
  const questionTitles =
    reviewType === 'ONE_MONTH'
      ? MONTH_REVIEW_QUESTIONS.map((item) => item.title)
      : null;
  const questionSubtitles =
    reviewType === 'ONE_MONTH' ? cards.map((card) => card.category) : null;
  const count = cards.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-screen w-screen max-w-none items-center justify-center border-none bg-black/50 p-4">
        <DialogTitle className="sr-only">리뷰 요약 상세</DialogTitle>
        <div className="flex w-full max-w-[390px] flex-col rounded-[24px] bg-white px-4 pt-6 pb-5">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ loop: true, align: 'start' }}
          >
            <CarouselContent>
              {cards.map((card, index) => {
                const isSizeCard = index === 0;
                const isColorCard = index === 1;
                const options = isSizeCard
                  ? availableOptions.sizes
                  : isColorCard
                    ? availableOptions.colors
                    : [];

                return (
                  <CarouselItem key={index}>
                    <AnalysisContent
                      category={card.category}
                      title={
                        questionTitles?.[index] ?? card.category
                      }
                      subtitle={
                        questionSubtitles?.[index]
                      }
                      stat={card}
                      maxItems={isColorCard ? 3 : 5}
                      emptyMessageVariant={
                        isSizeCard ? 'size' : isColorCard ? 'color' : 'default'
                      }
                      selectedOption={
                        isSizeCard
                          ? selectedSize
                          : isColorCard
                            ? selectedColor
                            : 'all'
                      }
                      filterOptions={options}
                      isLoading={
                        isSizeCard
                          ? isSizeLoading
                          : isColorCard
                            ? isColorLoading
                            : false
                      }
                      onOptionChange={
                        isSizeCard
                          ? handleSizeChange
                          : isColorCard
                            ? handleColorChange
                            : undefined
                      }
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          <div className="relative flex justify-center py-5">
            <DotNavigation
              count={count}
              current={current}
              onDotClick={scrollTo}
              className="p-0"
            />
          </div>

          <Button
            variant="outline"
            className="bg-ongil-teal h-[54px] w-full rounded-[12px] border-none text-[24px] font-bold text-white hover:bg-teal-700 hover:text-white"
            onClick={() => onClose()}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
