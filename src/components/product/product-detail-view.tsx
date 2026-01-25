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
import { ProductDescription } from '@/components/product/descriptions/product-description';
import { ProductSizeContent } from '@/components/product/size/product-size-content';

const ProductInquiryContent = () => (
  <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
    <p>문의 영역입니다.</p>
    <p className="mt-2 text-sm">이곳에 문의 리스트 컴포넌트가 들어갑니다.</p>
  </div>
);

// 추후 리뷰관련 컴포넌트로 분리.
const ProductReviewContent = () => (
  <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
    <p>리뷰 영역입니다.</p>
    <p className="mt-2 text-sm">이곳에 리뷰 리스트 컴포넌트가 들어갑니다.</p>
  </div>
);

interface ProductDetailViewProps {
  product: any;
  userInfo: any;
  analysisData: any;
}

export function ProductDetailView({
  product,
  userInfo,
  analysisData,
}: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState('desc');

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <ProductInteractionProvider key={product.id}>
        <ProductHeader categoryID={product.categoryId} />

        {/* 상단: 이미지 슬라이더 & 기본 정보 */}
        <ProductImageSlider imageUrl={product.imageUrl} />
        <ProductInfo product={product} />

        {/* 중단: Sticky 탭 & 가변 컨텐츠
        스크롤시 축소되는 헤더와 항상 보이는 탭 바를 슬롯으로 전달 */}
        <ProductStickyContainer
          headerSlot={<CompactProductHeader product={product} />}
          tabBarSlot={
            <ProductTab activateTab={activeTab} onTabChange={setActiveTab} />
          }
        >
          {/* 탭 상태에 따른 조건부 렌더링 */}
          <div className="min-h-[500px]">
            {activeTab === 'desc' && <ProductDescription product={product} />}
            {activeTab === 'size' && (
              <ProductSizeContent
                userInfo={userInfo}
                analysisData={analysisData}
              />
            )}
            {activeTab === 'inquiry' && <ProductInquiryContent />}
            {activeTab === 'review' && <ProductReviewContent />}
          </div>
        </ProductStickyContainer>

        {/* 플로팅 요소 */}
        <ProductBottomBar />
        <ScrollToTop />
      </ProductInteractionProvider>
    </div>
  );
}
