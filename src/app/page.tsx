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

      <Suspense
        fallback={
          <div className="h-[420px] w-full animate-pulse bg-gray-100 md:h-[520px]" />
        }
      >
        <BannerCarouselContainer />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-[120px] w-full animate-pulse bg-gray-50 px-5 py-4" />
        }
      >
        <RecommendCategoryContainer />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[360px] w-full animate-pulse bg-gray-50 px-5 py-4" />
        }
      >
        <RecommendProductContainer
          endpoint="/products/special-sale"
          heading="특가 상품"
        />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[360px] w-full animate-pulse bg-gray-50 px-5 py-4" />
        }
      >
        <RecommendProductContainer
          endpoint="/products/recommend"
          heading="추천 상품"
        />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-[460px] w-full animate-pulse bg-gray-50 px-5 py-4" />
        }
      >
        <RecommendedBrandContainer />
      </Suspense>

      <MainNavBar />
    </div>
  );
}
