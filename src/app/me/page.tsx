import ProfileSection from '@/components/mypage/profile-section';
import PointSection from '@/components/mypage/point-section';
import ReviewRequestCard from '@/components/mypage/review-request-card';
import QuickMenuSection from '@/components/mypage/quick-menu-section';
import MyShoppingSection from '@/components/mypage/my-shopping-section';
import PaymentSection from '@/components/mypage/payment-section';
import CustomerServiceSection from '@/components/mypage/customer-service-section';
import SettingsSection from '@/components/mypage/settings-section';
import MainNavBar from '@/components/layout/main-nav-bar';
import { api } from '@/lib/api-client';
import type { WritableReviewItem } from '@/types/domain/review';

export default async function MyPage() {
  const pendingReviews = await api.get<WritableReviewItem[]>(
    '/users/me/reviews/pending',
  );
  const writableReviewCount = pendingReviews.length;

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 flex h-20 items-center justify-center bg-white">
        <h1 className="text-3xl leading-normal font-semibold">마이페이지</h1>
      </header>
      <div>
        {/* 프로필 섹션 */}
        <ProfileSection />

        {/* 포인트 섹션 */}
        <PointSection />

        {/* 리뷰 요청 카드 */}
        <ReviewRequestCard writableReviewCount={writableReviewCount} />

        {/* 빠른 메뉴 */}
        <QuickMenuSection />

        {/* 내 쇼핑 */}
        <MyShoppingSection />

        {/* 결제 및 할인 */}
        <PaymentSection />

        {/* 고객센터 */}
        <CustomerServiceSection />

        {/* 설정 */}
        <SettingsSection />
      </div>

      <div className="fixed bottom-0 w-full">
        <MainNavBar />
      </div>
    </main>
  );
}
