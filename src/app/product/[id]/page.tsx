import { notFound } from 'next/navigation';
import { getProductDetail } from '@/app/actions/product';
import { getMyBodyInfoAction } from '@/app/actions/body-info';
import { fetchSizeAnalysis } from '@/mocks/size';
import ProductDetailView from '@/components/product/product-detail-view';
import { getMyWishlist } from '@/app/actions/wishlist';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  // 1. 상품 상세 + 부가 데이터 병렬 조회
  let product;
  try {
    product = await getProductDetail(productId);
  } catch {
    notFound();
  }

  const [bodyInfoResult, wishlist] = await Promise.all([
    getMyBodyInfoAction(),
    getMyWishlist(),
  ]);

  const userInfo =
    bodyInfoResult.success && bodyInfoResult.data?.hasBodyInfo
      ? bodyInfoResult.data
      : null;

  const analysisData = userInfo
    ? await fetchSizeAnalysis(id, userInfo.height, userInfo.weight)
    : null;

  // 2. 찜 목록에서 현재 상품이 있는지 확인
  const wishlistItem = wishlist.find((item) => item.productId === productId);
  const isLiked = !!wishlistItem;
  const wishlistId = wishlistItem?.wishlistId;

  // 3. 클라이언트 뷰에 데이터 전달하며 렌더링
  return (
    <ProductDetailView
      product={product}
      userInfo={userInfo}
      analysisData={analysisData}
      isLiked={isLiked}
      wishlistId={wishlistId}
    />
  );
}
