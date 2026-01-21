import SizeInfo from '@/components/product/size/size-info';
import SizeGuideSection from '@/components/product/size/size-guide-section';
import { fetchUserBodyInfo, fetchSizeAnalysis } from '@/mocks/size';

interface ProductSizePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductSizePage({
  params,
}: ProductSizePageProps) {
  const { id: productId } = await params;
  const productType = 'top';
  const userInfo = await fetchUserBodyInfo();
  const analysisData = userInfo
    ? await fetchSizeAnalysis(productId, userInfo.height, userInfo.weight)
    : null;

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
