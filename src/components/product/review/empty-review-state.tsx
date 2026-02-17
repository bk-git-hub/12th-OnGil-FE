'use client';
import Image from 'next/image';

type EmptyReviewStateVariant = 'default' | 'month';

interface EmptyReviewStateProps {
  variant?: EmptyReviewStateVariant;
}

/**
 * 리뷰가 없을 때 표시되는 빈 상태 컴포넌트
 * @returns {JSX.Element} 빈 리뷰 상태 컴포넌트
 */
export default function EmptyReviewState({
  variant = 'default',
}: EmptyReviewStateProps) {
  const description =
    variant === 'month'
      ? '한달 후 리뷰가 아직 없습니다. 첫번째 리뷰를 작성해주세요. 리뷰 쓰면 최대 2000원 적립!'
      : '아직 작성된 리뷰가 없습니다. 첫번째 리뷰를 작성해주세요. 리뷰 쓰면 최대 2000원 적립!';

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-2xl leading-normal font-semibold not-italic">
      <span className="mb-9">{description}</span>
      <Image
        src="/icons/review-empty.svg"
        alt="리뷰 없음 이미지"
        width={54}
        height={51}
        className="mb-[30px]"
      />
    </div>
  );
}
