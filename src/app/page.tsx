import BannerCarouselContainer from '@/components/banner-carousel';
import {
  RecommendedCategoryCard,
  RecommendCarousel,
  RecommendCarouselItem,
  RecommendedProductCard,
} from '@/components/recommend-carousel';
import { MAIN_CATEGORIES } from '@/mocks/categories';
import MainHeader from '@/components/layout/main-header';
import MainNavBar from '@/components/layout/main-nav-bar';

import { BRANDS, MOCK_PRODUCTS } from '@/mocks/brands-and-products';
import RecommendedBrandContainer from '@/components/recommend-brand/recommended-brand-container';
import RecommendCategoryContainer from '@/components/recommend-carousel/recommend-category-container';
import { Suspense } from 'react';
import RecommendProductContainer from '@/components/recommend-carousel/recommend-product-container';
// import { api } from '@/lib/api-client';
// import { Advertisement } from '@/types/domain/etc';
// import { Category } from '@/types/domain/category';

export default async function Home() {
  const p1 = MOCK_PRODUCTS.slice(0, 6);
  const p2 = MOCK_PRODUCTS.slice(6, 12);
  const p3 = MOCK_PRODUCTS.slice(12, 18);
  // TODO: 카테고리 데이터를 UI에 연결
  // const categories = await api.get<Category[]>('/categories');

  return (
    <div className="flex flex-col items-center">
      <MainHeader />

      <Suspense fallback={<div>Loading...</div>}>
        <BannerCarouselContainer />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <RecommendCategoryContainer />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <RecommendProductContainer
          endpoint="/products/special-sale"
          heading="특가 상품"
        />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <RecommendProductContainer
          endpoint="/products/recommend"
          heading="추천 상품"
        />
      </Suspense>

      <RecommendedBrandContainer brands={BRANDS} productLists={[p1, p2, p3]} />

      <MainNavBar />
    </div>
  );
}
