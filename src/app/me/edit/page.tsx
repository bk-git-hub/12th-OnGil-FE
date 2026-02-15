import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '/auth';
import ShippingInfoCardFetcher from '@/components/address/shipping-info-card-fetcher';
import EditProfilePhotoSheet from '@/components/mypage/edit-profile-photo-sheet';
import { CloseButton } from '@/components/ui/close-button';
import { getMyBodyInfoAction } from '@/app/actions/body-info';

export default async function MyEditPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const bodyInfoResult = await getMyBodyInfoAction();
  const bodyInfo =
    bodyInfoResult.success && bodyInfoResult.data?.hasBodyInfo
      ? bodyInfoResult.data
      : null;

  const userName = session.user.nickName || '사용자';

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-[#d9d9d9] bg-white py-4">
        <h1 className="text-3xl font-semibold">내 정보 관리</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href="/me" replace={true} />
        </div>
      </header>

      <div className="space-y-7 px-5 py-7 pb-20">
        <EditProfilePhotoSheet
          imageUrl={session.user.profileUrl}
          userName={`${userName}님`}
        />

        <ShippingInfoCardFetcher
          actionHref="/address?mode=manage"
          actionLabel="배송지 수정하기"
        />

        <section>
          <h2 className="mb-3 text-2xl">내 체형 정보</h2>
          <div className="rounded-xl border border-[#cfcfcf] bg-white p-4">
            {bodyInfo ? (
              <div className="mb-5 flex flex-col gap-4 text-3xl leading-normal text-black">
                <p>키: {bodyInfo.height ? `${bodyInfo.height}cm` : '-'}</p>
                <p>몸무게: {bodyInfo.weight ? `${bodyInfo.weight}kg` : '-'}</p>
                <p>상의: {bodyInfo.usualTopSize || '-'}</p>
                <p>하의: {bodyInfo.usualBottomSize || '-'}</p>
                <p>신발 사이즈: {bodyInfo.usualShoeSize || '-'}</p>
              </div>
            ) : (
              <div className="mb-5 flex min-h-[180px] items-center justify-center">
                <p className="text-2xl text-[#9a9a9a]">
                  등록된 체형 정보가 없습니다
                </p>
              </div>
            )}

            <Link
              href="/me/edit/body-info"
              className="bg-ongil-teal mx-auto flex h-14 w-[260px] items-center justify-center rounded-xl px-5 text-xl font-medium text-white"
            >
              내 정보 수정하기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
