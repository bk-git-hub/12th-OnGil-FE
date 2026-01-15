import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById } from '@/components/product/product-service';
import { ProductImageSlider } from '@/components/product/product-image-slider';
import { ProductInfo } from '@/components/product/product-info';
import { ProductBottomBar } from '@/components/product/product-bottom-bar';
import { CompactProductHeader } from '@/components/product/compact-product-header';
import { ProductInteractionProvider } from '@/components/product/product-interaction-context';
import { ProductStickyContainer } from '@/components/product/descriptions/product-sticky-container';
import { ProductTab } from '@/components/product/product-tab';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ProductNotice } from '@/components/product/product-notice';
import { RecommendedProductsCarousel } from '@/components/product/recommended-products-carousel';
import { PRODUCTS } from '@/mocks/product-data';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return { title: '상품을 찾을 수 없습니다. | 온길' };

  return {
    title: `${product.name} | 온길`,
    description: `시니어 쇼핑몰 온길에서 ${product.name}을(를) 만나보세요.`,
    openGraph: {
      title: product.name,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  // 현재 상품 제외하고 6개 추천
  const recommendedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(
    0,
    6,
  );

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <ProductInteractionProvider>
        {/* 상단: 이미지 슬라이더 & 기본 정보 */}
        <ProductImageSlider imageUrl={product.imageUrl} />
        <ProductInfo product={product} />

        {/* 중단: Sticky 탭 & 가변 컨텐츠 */}
        <ProductStickyContainer
          // 스크롤시 축소되는 헤더와 항상 보이는 탭 바를 슬롯으로 전달
          headerSlot={<CompactProductHeader product={product} />}
          tabBarSlot={<ProductTab productId={product.id.toString()} />}
        >
          {/* 탭별 페이지가 렌더링되는 부분 => 설명/사이즈/문의/소재:리뷰 */}
          {children}

          {/* 하단 공통 영역 */}
          <div className="space-y-12 border-t border-gray-100 pt-10">
            <ProductNotice />
            <div className="pt-4">
              <RecommendedProductsCarousel products={recommendedProducts} />
            </div>
          </div>
        </ProductStickyContainer>

        {/* 플로팅 요소 */}
        <ProductBottomBar />
        <ScrollToTop />
      </ProductInteractionProvider>
    </div>
  );
}
