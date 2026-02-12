'use client';

import { useRouter } from 'next/navigation';
import { BodyInfoForm } from '@/components/product/size/body-info-form';
import { UserBodyInfo } from '@/types/domain/size';

// 제출성공시 모달 닫기 + 뒤로가기 처리 래퍼 컴포넌트

export function BodyInfoFormWrapper({
  userInfo,
}: {
  userInfo: UserBodyInfo | null;
}) {
  const router = useRouter();

  return (
    <BodyInfoForm
      initialData={userInfo}
      onSuccess={() => {
        router.back();
      }}
    />
  );
}
