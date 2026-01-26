import { notFound } from 'next/navigation';
import { getProductById } from '@/components/product/product-service';
import { fetchUserBodyInfo, fetchSizeAnalysis } from '@/mocks/size';
import { ProductDetailView } from '@/components/product/product-detail-view';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  // 1. 상품 데이터 가져오기
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  // 2. 사이즈 분석 데이터 가져오기
  const userInfo = await fetchUserBodyInfo();
  const analysisData = userInfo
    ? await fetchSizeAnalysis(id, userInfo.height, userInfo.weight)
    : null;

  // 3. 클라이언트 뷰에 데이터 전달하며 렌더링
  return (
    <ProductDetailView
      product={product}
      userInfo={userInfo}
      analysisData={analysisData}
    />
  );
}
