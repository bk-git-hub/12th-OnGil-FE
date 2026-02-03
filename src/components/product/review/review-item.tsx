'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ThumbsUp } from 'lucide-react';
import { ReviewDetail } from '@/types/domain/review';
import { StarRating } from '@/components/ui/star-rating';
import { ReviewDetailModal } from './review-detail-modal';
import { ReviewImageModal } from './review-image-modal';
import { EVALUATION_MAP, EVALUATION_CONFIG } from './review-constants';

// 단일 리뷰 아이템 컴포넌트(하나의 리뷰 정보를 표시)

interface ReviewItemProps {
  review: ReviewDetail;
  isAccessory?: boolean;
}

export function ReviewItem({ review, isAccessory = false }: ReviewItemProps) {
  const [isHelpful, setIsHelpful] = useState(review.isHelpful);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  /**
   * 도움돼요 버튼 클릭 핸들러
   * 상태를 원자적으로 업데이트하여 일관성을 유지합니다.
   */
  const toggleHelpful = () => {
    setIsHelpful((prevIsHelpful) => {
      const next = !prevIsHelpful;
      setHelpfulCount((prevCount) => (next ? prevCount + 1 : prevCount - 1));
      return next;
    });
  };

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsImageModalOpen(true);
  };

  const formattedDate = review.createdAt.replace(/-/g, '.');
  const sizeValue = review.initialFirstAnswers.sizeAnswer;
  const sizeText = EVALUATION_MAP[sizeValue] || sizeValue;

  return (
    <div className="border-b py-6 last:border-none">
      {/* 1. 별점 및 날짜 */}
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

      {/* 2. 유저 정보 */}
      <div className="mb-4 flex flex-col gap-1 rounded-lg py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-normal font-normal text-[#0000008C]">
            구매 옵션:{' '}
          </span>
          <span className="text-xl leading-normal font-normal text-[#0000008C]">
            {review.purchaseOption.selectedColor} /{' '}
            {review.purchaseOption.selectedSize}
          </span>
        </div>

        {!isAccessory && (
          <div className="flex items-center gap-2 text-xl leading-normal font-normal text-[#0000008C]">
            {review.reviewer.height}cm {review.reviewer.weight}kg
            <span>|</span>
            {review.reviewer.usualTopSize}
          </div>
        )}
      </div>

      {/* 4. 후기 텍스트 */}
      <p className="mb-6 text-xl leading-normal font-normal">
        {review.textReview}
      </p>

      {/* 3. 사진 (썸네일 리스트) */}
      {review.reviewImageUrls && review.reviewImageUrls.length > 0 && (
        <div className="mb-4 w-full">
          <div className="scrollbar-hide flex w-full gap-2.5 overflow-x-auto pb-2">
            {review.reviewImageUrls.map((src, index) => (
              <div
                key={index}
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
            ))}
          </div>
        </div>
      )}

      {/* 5. 상세 평가 정보 (클릭 시 팝업 오픈) */}
      <button
        type="button"
        className="mb-4 flex w-full cursor-pointer flex-col gap-4 text-left"
        onClick={() => setIsDetailPopupOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDetailPopupOpen(true);
          }
        }}
        aria-label="상세 평가 정보 보기"
        tabIndex={0}
      >
        {EVALUATION_CONFIG.map(({ label, key }) => {
          const value = review.initialFirstAnswers[key];
          const text = EVALUATION_MAP[value] || value;
          return (
            <div
              key={key}
              className="flex h-[120px] flex-col gap-4 border-b border-black text-xl"
            >
              <span className="min-w-[30px] text-2xl font-bold">{label}</span>
              <ul className="list-disc gap-2 pl-5">
                <li>{text}</li>
              </ul>
            </div>
          );
        })}
      </button>

      {/* 6. 선택지 태그 더보기 버튼 */}
      <div className="mb-5 flex items-center justify-between">
        <div className="border-ongil-teal w-[262px] rounded-lg border-3 bg-white px-[14px] py-[11px]">
          <span className="font-internal text-xl leading-normal font-normal">
            {sizeText}
          </span>
        </div>
        <button
          onClick={() => setIsDetailPopupOpen(true)}
          className="h-[40px] w-[85px] rounded-xl border border-black px-2 text-xl font-semibold text-gray-900 transition-colors"
        >
          더보기
        </button>
      </div>

      {/* 7. 도움돼요 버튼 */}
      <button
        onClick={toggleHelpful}
        className={cn(
          'border-ongil-teal flex w-48 items-center gap-2 rounded-xl border bg-white py-2 pl-[11px] text-xl font-medium transition-colors',
          isHelpful ? 'bg-ongil-mint' : 'bg-white',
        )}
      >
        도움돼요 <span>({helpfulCount}명)</span>
        <ThumbsUp className={cn('h-5 w-5', isHelpful && 'fill-current')} />
      </button>

      <ReviewDetailModal
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        answers={review.initialFirstAnswers}
      />

      <ReviewImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrls={review.reviewImageUrls || []}
        initialSlide={initialSlide}
      />
    </div>
  );
}
