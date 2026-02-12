import { getMyBodyInfoAction } from '@/app/actions/body-info';
import { BodyInfoModal } from '@/components/ui/body-info-modal';
import { BodyInfoFormWrapper } from './_components/wrapper';
import { CloseButton } from '@/components/ui/close-button';

// 사이즈 탭에서 '내 신체 정보 수정' 클릭 시 나타나는 인터셉트 모달 페이지

export default async function InterceptedBodyInfoPage() {
  const result = await getMyBodyInfoAction();
  const userInfo =
    result.success && result.data?.hasBodyInfo ? result.data : null;

  return (
    <BodyInfoModal>
      <div className="flex h-full flex-col overflow-hidden bg-white">
        {/* 1. 상단 헤더 영역 */}
        <div className="flex h-16 items-center gap-6 px-5">
          <CloseButton />
          <span className="flex-1 pr-10 text-center text-2xl leading-4 font-semibold">
            내 체형 정보 수정
          </span>
        </div>

        {/* 2. 컨텐츠 영역 */}
        <div className="flex-1 overflow-hidden pt-8">
          <BodyInfoFormWrapper userInfo={userInfo} />
        </div>
      </div>
    </BodyInfoModal>
  );
}
