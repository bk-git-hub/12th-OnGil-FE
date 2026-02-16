import { notFound } from 'next/navigation';
import { getProductDetail, getSimilarProducts } from '@/app/actions/product';
import { getMyBodyInfoAction } from '@/app/actions/body-info';
import { getProductReviewsSummaryAction } from '@/app/actions/review';
import { fetchSizeAnalysis } from '@/mocks/size';
import ProductDetailView from '@/components/product/product-detail-view';
import { getMyWishlist } from '@/app/actions/wishlist';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const backHref = Array.isArray(resolvedSearchParams.from)
    ? resolvedSearchParams.from[0]
    : resolvedSearchParams.from;
  const productId = Number(id);

  // 1. 상품 상세 + 부가 데이터 병렬 조회
  let product;
  try {
    product = await getProductDetail(productId);
  } catch {
    notFound();
  }

  const [bodyInfoResult, wishlist, similarProducts, reviewSummaryResult] =
    await Promise.allSettled([
      getMyBodyInfoAction(),
      getMyWishlist(),
      getSimilarProducts(productId),
      getProductReviewsSummaryAction(productId),
    ]);

  const resolvedBodyInfo =
    bodyInfoResult.status === 'fulfilled'
      ? bodyInfoResult.value
      : { success: false };
  const resolvedWishlist =
    wishlist.status === 'fulfilled' ? wishlist.value : [];
  const resolvedSimilarProducts =
    similarProducts.status === 'fulfilled' ? similarProducts.value : [];
  const reviewSummary =
    reviewSummaryResult.status === 'fulfilled'
      ? reviewSummaryResult.value
      : undefined;

  const userInfo =
    resolvedBodyInfo.success && resolvedBodyInfo.data?.hasBodyInfo
      ? resolvedBodyInfo.data
      : null;

  const analysisData = userInfo
    ? await fetchSizeAnalysis(id, userInfo.height, userInfo.weight)
    : null;

  // 2. 찜 목록에서 현재 상품이 있는지 확인
  const wishlistItem = resolvedWishlist.find(
    (item) => item.productId === productId,
  );
  const isLiked = !!wishlistItem;
  const wishlistId = wishlistItem?.wishlistId;

  // 3. 클라이언트 뷰에 데이터 전달하며 렌더링
  return (
    <ProductDetailView
      product={product}
      similarProducts={resolvedSimilarProducts}
      userInfo={userInfo}
      analysisData={analysisData}
      backHref={backHref}
      isLiked={isLiked}
      wishlistId={wishlistId}
      productReviewSummary={reviewSummary}
    />
  );
}
