'use client';

import { startTransition, useEffect, useOptimistic, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { toggleReviewHelpfulAction } from '@/app/actions/review';
import { ProductReviewListItem } from '@/types/domain/review';
import StarRating from '@/components/ui/star-rating';
import ReviewImageModal from './review-image-modal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { EVALUATION_MAP, REVIEW_CONTENT_CONFIG } from './review-constants';

interface ReviewItemProps {
  review: ProductReviewListItem;
  isAccessory?: boolean;
}

interface HelpfulState {
  isHelpful: boolean;
  helpfulCount: number;
}

const DEFAULT_ANSWERS = {
  sizeAnswer: '',
  colorAnswer: '',
  materialAnswer: '',
} as const;

function normalizeToList(value?: string[] | string | null): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

export default function ReviewItem({
  review,
  isAccessory = false,
}: ReviewItemProps) {
  const [confirmedState, setConfirmedState] = useState<HelpfulState>({
    isHelpful: review.isHelpful,
    helpfulCount: Math.max(review.helpfulCount, 0),
  });

  const [optimisticState, setOptimisticState] = useOptimistic(
    confirmedState,
    (state, newState: HelpfulState) => newState,
  );

  const [isPending, setIsPending] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  useEffect(() => {
    setConfirmedState({
      isHelpful: review.isHelpful,
      helpfulCount: Math.max(review.helpfulCount, 0),
    });
  }, [review.isHelpful, review.helpfulCount]);

  const toggleHelpful = async () => {
    if (isPending) return;

    const nextIsHelpful = !optimisticState.isHelpful;
    const nextCount = Math.max(
      optimisticState.helpfulCount + (nextIsHelpful ? 1 : -1),
      0,
    );

    setIsPending(true);

    startTransition(() => {
      setOptimisticState({
        isHelpful: nextIsHelpful,
        helpfulCount: nextCount,
      });
    });

    try {
      const result = await toggleReviewHelpfulAction(review.reviewId);

      if (result.success && result.data) {
        setConfirmedState({
          isHelpful: result.data.isHelpful,
          helpfulCount: Math.max(result.data.helpfulCount, 0),
        });
      } else {
        setConfirmedState(confirmedState);
      }
    } catch (error) {
      console.error('도움돼요 토글 실패:', {
        error,
        reviewId: review.reviewId,
      });
      setConfirmedState(confirmedState);
    } finally {
      setIsPending(false);
    }
  };

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsImageModalOpen(true);
  };

  const createdAtDate = new Date(review.createdAt);
  const formattedDate = Number.isNaN(createdAtDate.getTime())
    ? review.createdAt
    : createdAtDate.toISOString().slice(0, 10).replace(/-/g, '.');
  const answers =
    review.initialFirstAnswers ?? review.answers ?? DEFAULT_ANSWERS;
  const colorText =
    EVALUATION_MAP[answers.colorAnswer] || answers.colorAnswer || '정보 없음';
  const fitIssueParts = normalizeToList(
    review.initialSecondAnswers?.fitIssueParts,
  );
  const materialFeatures = normalizeToList(
    review.initialSecondAnswers?.materialFeatures,
  );
  const reviewTextByKey = {
    sizeReview: review.sizeReview?.[0],
    materialReview: review.materialReview?.[0],
    textReview: review.textReview,
  } as const;

  return (
    <div className="border-b py-6 last:border-none">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/smile.svg"
            alt="smile-icon"
            width={30}
            height={30}
          />
          <StarRating rating={review.rating} size={30} />
          <span className="pt-0.5 text-base leading-none font-bold text-gray-900">
            {review.rating}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      <div className="mb-4 flex flex-col gap-1 rounded-lg py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-normal font-normal text-[#0000008C]">
            구매 옵션:{' '}
          </span>
          <span className="text-xl leading-normal font-normal text-[#0000008C]">
            {review.purchaseOption?.selectedColor ?? '-'} /{' '}
            {review.purchaseOption?.selectedSize ?? '-'}
          </span>
        </div>

        {!isAccessory && (
          <div className="flex items-center gap-2 text-xl leading-normal font-normal text-[#0000008C]">
            {review.reviewer?.height ?? '-'}cm {review.reviewer?.weight ?? '-'}
            kg
            <span>|</span>
            {review.reviewer?.usualTopSize ?? review.reviewer?.usualSize ?? '-'}
          </div>
        )}
      </div>

      {review.reviewImageUrls && review.reviewImageUrls.length > 0 && (
        <Carousel
          opts={{
            dragFree: true,
            loop: false,
          }}
          className="mb-4 w-full"
        >
          <CarouselContent className="-ml-8">
            {review.reviewImageUrls.map((src, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div
                  className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-50 transition-transform active:scale-95"
                  onClick={() => handleImageClick(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`리뷰 이미지 ${index + 1} 확대보기`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleImageClick(index);
                    }
                  }}
                >
                  <Image
                    src={src}
                    alt={`리뷰 썸네일 ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <div className="mb-4 flex flex-col gap-4">
        {REVIEW_CONTENT_CONFIG.filter((item) => item.key !== 'textReview').map(
          ({ label, key }) => {
            const text = reviewTextByKey[key];

            return (
              <div key={key} className="flex flex-col gap-4 text-xl">
                <span className="min-w-[30px] text-2xl font-bold">{label}</span>
                <ul className="list-disc gap-2 pl-10">
                  <li className="mb-3">{text || '정보 없음'}</li>
                </ul>
              </div>
            );
          },
        )}

        <div className="flex flex-col gap-4 text-xl">
          <span className="min-w-[30px] text-2xl font-bold">색감</span>
          <ul className="list-disc gap-2 pl-10">
            <li className="mb-3">{colorText}</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 text-xl">
          <span className="min-w-[30px] text-2xl font-bold">기타</span>
          <div className="mb-3 flex items-center gap-2 pl-3">
            <MessageCircle className="text-ongil-teal h-6 w-6" />
            <p>{review.textReview || '정보 없음'}</p>
          </div>
        </div>

        {fitIssueParts.length > 0 && (
          <div className="flex flex-col gap-4 text-xl">
            <span className="min-w-[30px] text-2xl font-bold">불편 부위</span>
            <ul className="list-disc gap-2 pl-10">
              <li className="mb-3">{fitIssueParts.join(', ')}</li>
            </ul>
          </div>
        )}

        {materialFeatures.length > 0 && (
          <div className="flex flex-col gap-4 text-xl">
            <span className="min-w-[30px] text-2xl font-bold">소재 특징</span>
            <ul className="list-disc gap-2 pl-10">
              <li className="mb-3">{materialFeatures.join(', ')}</li>
            </ul>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={toggleHelpful}
        disabled={isPending}
        className={cn(
          'border-ongil-teal flex w-48 items-center gap-2 rounded-xl border bg-white py-2 pl-[11px] text-xl font-medium transition-colors',
          optimisticState.isHelpful ? 'bg-ongil-mint' : 'bg-white',
          isPending && 'cursor-not-allowed opacity-70',
        )}
      >
        도움돼요 <span>({optimisticState.helpfulCount}명)</span>
        <ThumbsUp
          className={cn('h-5 w-5', optimisticState.isHelpful && 'fill-current')}
        />
      </button>

      <ReviewImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrls={review.reviewImageUrls || []}
        initialSlide={initialSlide}
      />
    </div>
  );
}
