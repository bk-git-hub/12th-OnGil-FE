import { getProductById } from '@/components/product/product-service';
import { ProductDetail } from '@/components/product/product-detail';

// id 파라미터를 받아 서버 사이드에서 상품 데이터를 조회하고, 결과를 UI 컴포넌트(ProductDetail)에 전달하는 상품 상세 페이지
interface PageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const product = await getProductById(resolvedParams.id);

  return <ProductDetail product={product} />;
}
