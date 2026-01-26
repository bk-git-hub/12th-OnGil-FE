import { SizeInfo } from '@/components/product/size/size-info';
import { SizeGuideSection } from '@/components/product/size/size-guide-section';
import { fetchUserBodyInfo, fetchSizeAnalysis } from '@/mocks/size';

interface ProductSizeContentProps {
  userInfo: any;
  analysisData: any;
}

// 사이즈 탭 콘텐츠 컴포넌트

export function ProductSizeContent({
  userInfo,
  analysisData,
}: ProductSizeContentProps) {
  const productType = 'top';

  return (
    <div className="font-pretendard flex flex-col gap-10 px-4 py-8 pb-20">
      {/* 상단 실측 정보 */}
      <SizeInfo />

      <hr className="border-gray-100" />

      {/* 사이즈 가이드 섹션 */}
      <section className="space-y-4">
        <SizeGuideSection
          productType={productType}
          userInfo={userInfo}
          analysisData={analysisData}
        />
      </section>
    </div>
  );
}
