import {
  getProductsByCategoryId,
  getCategoryTitle,
} from '@/components/product/product-service';
import { ProductList } from '@/components/product/product-list';

interface PageProps {
  params: { id: string };
}

// 상품 데이터와 페이지 제목을 조회한 뒤, UI 컴포넌트(ProductList)에 완성된 데이터만 전달하는 목록 페이지.

export default async function ProductListPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  // 서비스 함수 호출
  const [products, title] = await Promise.all([
    getProductsByCategoryId(resolvedParams.id),
    getCategoryTitle(resolvedParams.id),
  ]);

  return <ProductList products={products} title={title} />;
}
