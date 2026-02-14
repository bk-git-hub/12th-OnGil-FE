import { getMyBodyInfoAction } from '@/app/actions/body-info';
import BodyInfoForm from '@/components/product/size/body-info-form';
import { CloseButton } from '../../components/ui/close-button';

// 내 신체 정보 수정 페이지(마이페이지용)

export default async function BodyInfoPage() {
  const result = await getMyBodyInfoAction();
  const userInfo =
    result.success && result.data?.hasBodyInfo ? result.data : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col overscroll-none bg-white">
      <header className="flex h-16 shrink-0 items-center gap-6 border-b border-[#d9d9d9] px-5">
        <CloseButton />
        <h1 className="flex-1 pr-10 text-center text-2xl font-semibold">
          내 체형 정보 수정
        </h1>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden pt-8">
        <BodyInfoForm initialData={userInfo} />
      </div>
    </main>
  );
}
