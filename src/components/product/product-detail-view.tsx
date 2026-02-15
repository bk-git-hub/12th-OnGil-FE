'use client';

import { useState } from 'react';
import {
  ProductImageSlider,
  ProductInfo,
  ProductBottomBar,
  CompactProductHeader,
  ProductTab,
  ProductInteractionProvider,
  ProductStickyContainer,
  ProductHeader,
} from '@/components/product';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import ProductDescription from '@/components/product/descriptions/product-description';
import { ProductSizeContent } from '@/components/product/size/product-size-content';
import ProductReviewContent from '@/components/product/review/review-section';

import {
  Product,
  MaterialDescription,
  ProductOption,
} from '@/types/domain/product';
import { ReviewStatsData } from '@/types/domain/review';
import { UserBodyInfo, SizeAnalysisResult } from '@/types/domain/size';

const ProductInquiryContent = () => (
  <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
    <p>문의 영역입니다.</p>
    <p className="mt-2 text-sm">이곳에 문의 리스트 컴포넌트가 들어갑니다.</p>
  </div>
);

interface ProductDetailProps extends Omit<
  Product,
  'viewCount' | 'purchaseCount' | 'reviewCount'
> {
  viewCount?: number;
  purchaseCount?: number;
  reviewCount?: number;
  materialDescription?: MaterialDescription;
  materialOriginal?: string;
  reviewSummary?: ReviewStatsData;
  monthReviewSummary?: ReviewStatsData;
  categoryId?: string | number;
  options?: ProductOption[];
  imageUrls?: string[];
}

interface ProductDetailViewProps {
  product: ProductDetailProps;
  similarProducts: Product[];
  userInfo: UserBodyInfo | null;
  analysisData: SizeAnalysisResult | null;
  backHref?: string;
  isLiked?: boolean;
  wishlistId?: number;
}

export default function ProductDetailView({
  product,
  similarProducts,
  userInfo,
  analysisData,
  backHref,
  isLiked = false,
  wishlistId,
}: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState('desc');

  // 리뷰 섹션에 전달할 상품 정보 구성
  const reviewProductInfo = {
    productId: Number(product.id),
    name: product.name,
    materialDescription: product.materialDescription,
    materialName: product.materialOriginal,
    availableOptions: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy', 'Gray', 'Beige'],
    },
  };

  // 리뷰 통계 데이터 (없을 경우 기본값 설정)
  const reviewStats = product.reviewSummary || {
    averageRating: 0,
    initialReviewCount: 0,
    oneMonthReviewCount: 0,
    sizeSummary: {
      category: '사이즈',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
    colorSummary: {
      category: '색감',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
    materialSummary: {
      category: '소재',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
  };

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <ProductInteractionProvider key={product.id}>
        <ProductHeader categoryID={product.categoryId} backHref={backHref} />

        {/* 상단: 이미지 슬라이더 & 기본 정보 */}
        <ProductImageSlider
          imageUrls={product.imageUrls ?? [product.thumbnailImageUrl]}
        />
        <ProductInfo product={product} />

        {/* 중단: Sticky 탭 & 가변 컨텐츠 
        스크롤시 축소되는 헤더와 항상 보이는 탭 바를 슬롯으로 전달 */}
        <ProductStickyContainer
          headerSlot={<CompactProductHeader product={product} />}
          tabBarSlot={
            <ProductTab
              activateTab={activeTab}
              onTabChange={setActiveTab}
              reviewCount={product.reviewCount ?? 0}
            />
          }
        >
          {/* 탭 상태에 따른 조건부 렌더링 */}
          <div className="min-h-[500px]">
            {activeTab === 'desc' && (
              <ProductDescription
                product={product}
                similarProducts={similarProducts}
              />
            )}
            {activeTab === 'size' && (
              <ProductSizeContent
                userInfo={userInfo}
                analysisData={analysisData}
              />
            )}
            {activeTab === 'inquiry' && <ProductInquiryContent />}
            {activeTab === 'review' && (
              <ProductReviewContent
                productInfo={reviewProductInfo}
                stats={reviewStats}
                monthStats={product.monthReviewSummary}
              />
            )}
          </div>
        </ProductStickyContainer>

        {/* 플로팅 요소 */}
        <ProductBottomBar
          product={product}
          initialIsLiked={isLiked}
          initialWishlistId={wishlistId}
        />
        <ScrollToTop />
      </ProductInteractionProvider>
    </div>
  );
}
