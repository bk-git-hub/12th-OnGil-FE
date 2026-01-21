'use client';

import { Ruler, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserBodyInfo } from '@/mocks/size';

interface MySizeProps {
  userInfo: UserBodyInfo;
  productType: 'top' | 'bottom' | 'shoes';
}

// 자세히보기 버튼 눌렀을 때 나오는 내 사이즈 정보 컴포넌트

export default function MySize({ userInfo, productType }: MySizeProps) {
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
    <div className="mt-8 flex flex-col gap-12">
      <h3 className="text-center text-xl font-bold text-gray-900">
        내 사이즈 정보
      </h3>
      <Card className="border border-gray-100 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-12">
            <div className="bg-ongil-mint flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Ruler className="h-5 w-5" />
            </div>
            <div className="text-xl font-bold text-gray-900">
              {userInfo.height}cm / {userInfo.weight}kg / {getUserSizeText()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="bg-ongil-teal w-full rounded-xl border-gray-300 py-7 text-base font-bold text-white hover:bg-[#00252a] hover:text-white"
        onClick={() => alert('내 정보 수정 페이지로 이동')}
      >
        <Edit2 className="mr-2 h-5 w-5" />내 정보 수정하기
      </Button>
    </div>
  );
}
