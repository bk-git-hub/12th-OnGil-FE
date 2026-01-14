import { notFound } from 'next/navigation';
import { getProductById } from '@/components/product/product-service';
import { ProductDetail } from '@/components/product/product-detail';

// id 파라미터를 받아 서버 사이드에서 상품 데이터를 조회하고, 결과를 UI 컴포넌트(ProductDetail)에 전달하는 상품 상세 페이지
interface PageProps {
  params: Promise<{ id: string }>;
}

// URL 파라미터 처리, 데이터 페칭, 메타데이터 생성
export default async function ProductDetailPage({ params }: PageProps) {
  // params 비동기 처리
  const { id } = await Promise.resolve(params);

  // 백엔드 연동 시 getProductById 내부만 fetch로 변경.
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }
  return <ProductDetail product={product} />;
}
