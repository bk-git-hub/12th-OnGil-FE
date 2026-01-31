'use client';

import { Button } from '@/components/ui/button';
import { UserBodyInfo } from '@/mocks/size';
import Link from 'next/link';

interface MySizeProps {
  userInfo: UserBodyInfo;
  productType: 'top' | 'bottom' | 'shoes';
  onEdit: () => void;
}

// 자세히보기 버튼 눌렀을 때 나오는 내 사이즈 정보 컴포넌트

export function MySize({ userInfo, productType, onEdit }: MySizeProps) {
  // 제품 유형에 따른 유저 사이즈 텍스트 반환
  const getUserSizeText = () => {
    switch (productType) {
      case 'top':
        return userInfo.usualTopSize;
      case 'bottom':
        return userInfo.usualBottomSize;
      case 'shoes':
        return userInfo.usualShoeSize;
      default:
        return '';
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-12 text-center text-2xl leading-6 font-semibold not-italic">
      <span>내 사이즈 정보</span>
      <span>
        {userInfo.height}cm / {userInfo.weight}kg / {getUserSizeText()}
      </span>

      <Button
        variant="ghost"
        className="bg-ongil-teal h-[55px] w-[239px] rounded-xl px-5 py-4 text-white"
      >
        <Link href="/body-info" scroll={false}>
          <span className="text-center text-xl leading-normal font-semibold not-italic">
            내 정보 수정하기
          </span>
        </Link>
      </Button>
    </div>
  );
}
