import { getMyBodyInfoAction } from '@/app/actions/body-info';
import { CloseButton } from '@/components/ui/close-button';
import { MyEditBodyInfoFormWrapper } from './_components/wrapper';

export default async function MyEditBodyInfoPage() {
  const result = await getMyBodyInfoAction();
  const userInfo =
    result.success && result.data?.hasBodyInfo ? result.data : null;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center overscroll-none bg-gray-50">
      <div className="flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white shadow-lg sm:rounded-2xl">
        <div className="flex h-16 shrink-0 items-center gap-6 px-5">
          <CloseButton href="/me/edit" />
          <h1 className="flex-1 pr-10 text-center text-2xl font-semibold">
            내 체형 정보 수정
          </h1>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden pt-8">
          <MyEditBodyInfoFormWrapper userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
}
