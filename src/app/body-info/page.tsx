import { fetchUserBodyInfo } from '@/mocks/size';
import { BodyInfoForm } from '@/components/product/size/body-info-form';
import { CloseButton } from '../../components/ui/close-button';

// 내 신체 정보 수정 페이지(마이페이지용)

export default async function BodyInfoPage() {
  const userInfo = await fetchUserBodyInfo();

  return (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <div className="flex h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-lg sm:h-200 sm:rounded-2xl">
        <div className="flex h-16 items-center gap-6 px-5">
          <CloseButton />
          <h1 className="flex-1 pr-10 text-center text-2xl font-semibold">
            내 체형 정보 수정
          </h1>
        </div>
        <div className="flex-1 overflow-hidden pt-8">
          <BodyInfoForm initialData={userInfo} />
        </div>
      </div>
    </div>
  );
}
