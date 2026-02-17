'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ProductWithReviewStats, ReviewDetail } from '@/types/domain/review';

interface WrittenReviewCardProps {
  review: ProductWithReviewStats;
}

const sizeAnswerLabelMap: Record<string, string> = {
  TIGHT_IMMEDIATELY: '숨막히게 답답',
  TIGHT_WHEN_MOVING: '살짝 답답',
  COMFORTABLE: '편함',
  LOOSE: '헐렁함',
  TOO_BIG_NEED_ALTERATION: '너무 큼',
};

const colorAnswerLabelMap: Record<string, string> = {
  BRIGHTER_THAN_SCREEN: '화면보다 밝음',
  SAME_AS_SCREEN: '화면과 똑같음',
  DARKER_THAN_SCREEN: '어두움',
};

const materialAnswerLabelMap: Record<string, string> = {
  VERY_GOOD: '너무 좋음',
  GOOD: '좋음',
  NORMAL: '무난함',
  BAD: '아쉬움',
  VERY_BAD: '너무 아쉬움',
};

function toList(value: string[] | string | null | undefined): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function WrittenReviewCard({ review }: WrittenReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [reviewDetail, setReviewDetail] = useState<ReviewDetail | null>(null);

  const safeRating =
    typeof review.reviewRating === 'number' ? review.reviewRating : 0;
  const roundedRating = Math.max(0, Math.min(5, Math.round(safeRating)));
  const resolvedReviewId =
    typeof review.reviewId === 'number' ? review.reviewId : review.id;
  const thumbnailSrc =
    typeof review.thumbnailImageUrl === 'string' &&
    review.thumbnailImageUrl.trim().length > 0
      ? review.thumbnailImageUrl
      : '/icons/icon-192.png';
  const productImageAlt =
    typeof review.name === 'string' && review.name.trim().length > 0
      ? review.name
      : '상품 이미지';
  const purchaseOptionLabel =
    typeof review.purchaseOption === 'string' && review.purchaseOption.trim().length > 0
      ? review.purchaseOption
      : '옵션 정보 없음';

  const handleToggleDetail = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);
    if (reviewDetail || isLoading) return;

    setIsLoading(true);
    setDetailError('');

    try {
      const response = await fetch(`/api/reviews/${resolvedReviewId}/details`, {
        method: 'GET',
      });
      const payload = (await response.json()) as ReviewDetail & { message?: string };

      if (!response.ok) {
        setDetailError(payload.message || '리뷰 상세를 불러오지 못했습니다.');
        return;
      }

      setReviewDetail(payload);
    } catch {
      setDetailError('리뷰 상세를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fitIssueParts = toList(reviewDetail?.initialSecondAnswers?.fitIssueParts);
  const materialFeatures = toList(reviewDetail?.initialSecondAnswers?.materialFeatures);
  const reviewText = reviewDetail?.textReview || reviewDetail?.aiGeneratedReview || '';
  const sizeReviewItems = Array.isArray(reviewDetail?.sizeReview)
    ? reviewDetail.sizeReview.filter((item) => typeof item === 'string' && item.trim().length > 0)
    : [];
  const materialReviewItems = Array.isArray(reviewDetail?.materialReview)
    ? reviewDetail.materialReview.filter(
        (item) => typeof item === 'string' && item.trim().length > 0,
      )
    : [];
  const sizeAnswerLabel = reviewDetail?.initialFirstAnswers?.sizeAnswer
    ? sizeAnswerLabelMap[reviewDetail.initialFirstAnswers.sizeAnswer] ??
      reviewDetail.initialFirstAnswers.sizeAnswer
    : '-';
  const colorAnswerLabel = reviewDetail?.initialFirstAnswers?.colorAnswer
    ? colorAnswerLabelMap[reviewDetail.initialFirstAnswers.colorAnswer] ??
      reviewDetail.initialFirstAnswers.colorAnswer
    : '-';
  const materialAnswerLabel = reviewDetail?.initialFirstAnswers?.materialAnswer
    ? materialAnswerLabelMap[reviewDetail.initialFirstAnswers.materialAnswer] ??
      reviewDetail.initialFirstAnswers.materialAnswer
    : '-';

  return (
    <li className="rounded-[16px] border border-black/50 bg-white p-5">
      <div className="flex h-[110px] gap-3">
        <div className="relative w-[110px] overflow-hidden rounded-sm bg-[#f1f1f1]">
          <Image
            src={thumbnailSrc}
            alt={productImageAlt}
            fill
            sizes="110px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between text-black">
          <p className="truncate text-base text-[#666]">{review.brandName}</p>
          <p className="line-clamp-2 text-lg font-semibold">{review.name}</p>
          <p className="text-sm text-[#444]">{purchaseOptionLabel}</p>
          <p className="flex items-center gap-1 text-sm text-[#444]">
            {[1, 2, 3, 4, 5].map((value) => (
              <Image
                key={`rating-star-${review.id}-${value}`}
                src={value <= roundedRating ? '/icons/star.svg' : '/icons/star-gray.svg'}
                alt=""
                width={14}
                height={14}
              />
            ))}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/product/${review.id}`}
          className="block w-full rounded-lg border border-[#005b5e] py-2 text-center text-base font-semibold text-[#005b5e]"
        >
          상품 보기
        </Link>
        <button
          type="button"
          onClick={handleToggleDetail}
          className="block w-full rounded-lg bg-[#005b5e] py-2 text-center text-base font-semibold text-white"
        >
          {isExpanded ? '닫기' : '상세보기'}
        </button>
      </div>

      {isExpanded ? (
        <section className="mt-4 space-y-3 rounded-lg border border-[#d9d9d9] bg-[#fafafa] p-4">
          {isLoading ? <p className="text-sm text-[#666]">불러오는 중...</p> : null}
          {detailError ? <p className="text-sm text-red-600">{detailError}</p> : null}

          {!isLoading && !detailError && reviewDetail ? (
            <>
              <div className="space-y-1 text-sm text-[#333]">
                <p>사이즈: {sizeAnswerLabel}</p>
                <p>색상: {colorAnswerLabel}</p>
                <p>소재: {materialAnswerLabel}</p>
              </div>

              {fitIssueParts.length > 0 ? (
                <p className="text-sm text-[#333]">
                  불편 부위: {fitIssueParts.join(', ')}
                </p>
              ) : null}

              {materialFeatures.length > 0 ? (
                <p className="text-sm text-[#333]">
                  소재 특징: {materialFeatures.join(', ')}
                </p>
              ) : null}

              {sizeReviewItems.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#333]">사이즈리뷰</p>
                  <ul className="space-y-1">
                    {sizeReviewItems.map((item, index) => (
                      <li key={`size-review-item-${index}`} className="text-sm text-[#333]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {materialReviewItems.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#333]">소재 리뷰</p>
                  <ul className="space-y-1">
                    {materialReviewItems.map((item, index) => (
                      <li key={`material-review-item-${index}`} className="text-sm text-[#333]">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {reviewText ? (
                <p className="text-sm text-[#222]">기타 리뷰: {reviewText}</p>
              ) : null}

              {reviewDetail.reviewImageUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {reviewDetail.reviewImageUrls.map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="relative h-20 overflow-hidden rounded-md bg-[#f1f1f1]"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${productImageAlt} 리뷰 이미지 ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}
    </li>
  );
}
