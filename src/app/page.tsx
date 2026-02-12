import BannerCarouselContainer from '@/components/banner-carousel';
import MainHeader from '@/components/layout/main-header';
import MainNavBar from '@/components/layout/main-nav-bar';
import RecommendedBrandContainer from '@/components/recommend-brand/recommended-brand-container';
import RecommendCategoryContainer from '@/components/recommend-carousel/recommend-category-container';
import { Suspense } from 'react';
import RecommendProductContainer from '@/components/recommend-carousel/recommend-product-container';

export default async function Home() {

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

      <Suspense fallback={<div>Loading...</div>}>
        <RecommendedBrandContainer />
      </Suspense>

      <MainNavBar />
    </div>
  );
}
