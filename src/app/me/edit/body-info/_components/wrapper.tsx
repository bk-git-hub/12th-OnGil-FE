'use client';

import { useRouter } from 'next/navigation';
import BodyInfoForm from '@/components/product/size/body-info-form';
import { UserBodyInfo } from '@/types/domain/size';

export function MyEditBodyInfoFormWrapper({
  userInfo,
}: {
  userInfo: UserBodyInfo | null;
}) {
  const router = useRouter();

  return (
    <BodyInfoForm
      initialData={userInfo}
      onSuccess={() => {
        router.replace('/me/edit');
      }}
    />
  );
}
