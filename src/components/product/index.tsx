// ----------------------------------------------------------------------
// 1. 상품 목록 및 카드
// ----------------------------------------------------------------------
export { ProductList } from './product-list';
export { ProductCard } from './product-card';
export { ProductGrid } from './product-grid';

// ----------------------------------------------------------------------
// 2. 상품 상세 - 핵심 정보
// ----------------------------------------------------------------------
export { ProductImageSlider } from './product-image-slider';
export { ProductInfo } from './product-info';
export { ProductTab } from './product-tab';

// ----------------------------------------------------------------------
// 3. 상품 상세 - 설명 및 레이아웃
// ----------------------------------------------------------------------
export { ProductStickyContainer } from './descriptions/product-sticky-container';
export { ProductDescription } from './descriptions/product-description';
export { CompactProductHeader } from './compact-product-header';

// ----------------------------------------------------------------------
// 4. 상품 상세 - 고정 바 및 부가 기능
// ----------------------------------------------------------------------
export { ProductBottomBar } from './product-bottom-bar';
export { ProductNotice } from './product-notice';
export { RecommendedProductsCarousel } from './recommended-products-carousel';

// ----------------------------------------------------------------------
// 5. 상태 관리
// ----------------------------------------------------------------------
export {
  ProductInteractionProvider,
  useProductInteraction,
} from './product-interaction-context';

// ----------------------------------------------------------------------
// 6. 데이터 비즈니스 로직
// ----------------------------------------------------------- -----------
export {
  getProductsByCategoryId,
  getProductById,
  getCategoryTitle,
} from './product-service';
