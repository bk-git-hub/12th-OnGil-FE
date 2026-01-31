'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { getMyBodyInfoAction } from '@/app/actions/body-info';
import { BodyInfoSchemaType } from '@/schemas/body-info';

interface MySizeProps {
  productType: 'top' | 'bottom' | 'shoes';
}

// 자세히보기 버튼 눌렀을 때 나오는 내 사이즈 정보 컴포넌트
export function MySize({ productType }: MySizeProps) {
  const [userInfo, setUserInfo] = useState<BodyInfoSchemaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const result = await getMyBodyInfoAction();
        if (result.success && result.data && result.data.hasBodyInfo) {
          setUserInfo(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  // 제품 유형에 따른 유저 사이즈 텍스트 반환
  const getUserSizeText = () => {
    if (!userInfo) return '-';
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
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center gap-4 py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="text-sm text-gray-400">정보를 불러오는 중...</span>
      </div>
    );
  }

  // 정보가 없을 경우
  if (!userInfo) {
    return (
      <div className="mt-8 flex flex-col items-center gap-8 text-center">
        <span className="text-lg font-medium text-gray-600">
          등록된 사이즈 정보가 없습니다.
        </span>
        <Button
          variant="ghost"
          className="bg-ongil-teal h-[55px] w-[239px] rounded-xl px-5 py-4 text-white"
        >
          <Link href="/body-info" scroll={false}>
            <span className="text-center text-xl leading-normal font-semibold not-italic">
              내 정보 등록하기
            </span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-12 text-center text-2xl leading-6 font-semibold not-italic">
      <span>내 사이즈 정보</span>
      <span>
        {userInfo.height}cm / {userInfo.weight}kg / {getUserSizeText()}
      </span>

      <Button
        variant="ghost"
        className="bg-ongil-teal hover:bg-ongil-mint h-[55px] w-[239px] rounded-xl px-5 py-4 text-white"
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
