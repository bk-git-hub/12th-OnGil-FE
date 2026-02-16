// ----------------------------------------------------------------------
// 1. 상품 목록 및 카드
// ----------------------------------------------------------------------
export { ProductList } from './product-list';
export { default as ProductCard } from './product-card';
export { ProductFilterBar } from './product-filter-bar';

// ----------------------------------------------------------------------
// 2. 상품 상세 - 핵심 정보 및 뷰
// ----------------------------------------------------------------------
export { ProductImageSlider } from './product-image-slider';
export { default as ProductInfo } from './product-info';
export { default as ProductTab } from './product-tab';
export { default as ProductDetailView } from './product-detail-view';

// ----------------------------------------------------------------------
// 3. 상품 상세 - 설명 및 레이아웃
// ----------------------------------------------------------------------
export { ProductStickyContainer } from './descriptions/product-sticky-container';
export { default as ProductDescription } from './descriptions/product-description';

// ----------------------------------------------------------------------
// 4. 상품 상세 - 고정 바, 헤더 및 부가 기능
// ----------------------------------------------------------------------
export { default as ProductHeader } from './product-header';
export { default as ProductBottomBar } from './product-bottom-bar';
export { ProductNotice } from './descriptions/product-notice';
export { default as RecommendedProductsCarousel } from './descriptions/recommended-products-carousel';

// ----------------------------------------------------------------------
// 5. 상태 관리
// ----------------------------------------------------------------------
export {
  ProductInteractionProvider,
  useProductInteraction,
} from './product-interaction-context';

// ----------------------------------------------------------------------
// 7. 사이즈 관련 컴포넌트
// ----------------------------------------------------------------------
export { ProductSizeContent } from './size/product-size-content';
export { MySize } from './size/my-size';
export { SimilarUserTable } from './size/similar-user-table';
export { SizeGuideSection } from './size/size-guide-section';
export { SizeInfo } from './size/size-info';
