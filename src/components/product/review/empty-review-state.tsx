'use client';
import Image from 'next/image';

/**
 * 리뷰가 없을 때 표시되는 빈 상태 컴포넌트
 * @returns {JSX.Element} 빈 리뷰 상태 컴포넌트
 */
export default function EmptyReviewState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-2xl leading-normal font-semibold not-italic">
      <span>아직 작성된 리뷰가 없습니다</span>
      <span className="mb-9">첫번째 리뷰를 작성해주세요</span>
      <Image
        src="/icons/review-empty.svg"
        alt="리뷰 없음 이미지"
        width={54}
        height={51}
        className="mb-[30px]"
      />
      <span className="text-ongil-teal text-xl font-normal">
        리뷰 쓰면 최대 2000원 적립!
      </span>
    </div>
  );
}
