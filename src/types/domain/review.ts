// ----------------------------------------------------------------------
// 1. 공통 응답 래퍼 & 페이징 (Common)
// ----------------------------------------------------------------------

export interface ApiResponse<T> {
  status: string;
  timestamp: string;
  data: T;
}

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject[];
  unpaged: boolean;
}

export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: SortObject[];
  numberOfElements: number;
  empty: boolean;
}

// ----------------------------------------------------------------------
// 2. 리뷰 상세 데이터
// ----------------------------------------------------------------------

export interface ReviewerInfo {
  height: number;
  weight: number;
  usualTopSize: string;
  usualBottomSize: string;
  usualShoeSize: string;
}

export interface ReviewPurchaseOption {
  selectedColor: string;
  selectedSize: string;
}

export interface ReviewProductSimple {
  productId: number;
  productName: string;
  brandName: string;
  thumbnailImageUrl: string;
}

// 1차 설문 (필수)
export interface InitialFirstAnswers {
  sizeAnswer: string;
  colorAnswer: string;
  materialAnswer: string;
}

// 2차 설문 (선택)
export interface InitialSecondAnswers {
  fitIssueParts: string | null;
  materialFeatures: string | null;
}

// 한달 사용 답변
export interface OneMonthAnswers {
  overall: string | null;
  changes: string | null;
}

// UI에서 사용할 메인 리뷰 객체
export interface ReviewDetail {
  reviewId: number;
  reviewType: string;
  rating: number;
  helpfulCount: number;
  isHelpful: boolean;

  aiGeneratedReview: string | null;
  textReview: string;
  reviewImageUrls: string[];

  reviewer: ReviewerInfo;
  purchaseOption: ReviewPurchaseOption;
  product: ReviewProductSimple;

  initialFirstAnswers: InitialFirstAnswers;
  initialSecondAnswers: InitialSecondAnswers;
  oneMonthAnswers: OneMonthAnswers;

  createdAt: string;
  completedAt: string;
}

// 5. 리뷰 상세 조회
export type ReviewDetailResponse = ApiResponse<ReviewDetail>;

// ----------------------------------------------------------------------
// 3. 상품 정보
// ----------------------------------------------------------------------

export interface ProductWithReviewStats {
  id: number;
  name: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  thumbnailImageUrl: string;
  brandName: string;
  productType: string;
  viewCount: number;
  purchaseCount: number;
  reviewCount: number;
  reviewRating: number; // 리뷰 평점 추가.
}

// 2. 내가 작성한 리뷰 조회
export type MyReviewListResponse = ApiResponse<
  PageResponse<ProductWithReviewStats>
>;

// 6. 상품별 리뷰 목록 조회
export type ProductReviewListResponse = ApiResponse<
  PageResponse<ProductWithReviewStats>
>;

// ----------------------------------------------------------------------
// 4. 작성 가능한 리뷰
// ----------------------------------------------------------------------

export interface WritableReviewItem {
  orderItemId: number;
  availableReviewType: string;
  product: ReviewProductSimple;
  purchaseOption: string;
  orderedAt: string;
  reviewAvailableAt: string;
}

// 3. 작성 가능한 리뷰 조회
export type WritableReviewsResponse = ApiResponse<WritableReviewItem[]>;

// ----------------------------------------------------------------------
// 5. 리뷰 통계
// ----------------------------------------------------------------------

export interface ReviewStatDetail {
  label: string;
  count: number;
  percentage?: number;
}

export interface ReviewCategorySummary {
  category: string;
  totalCount: number;
  topAnswer: string | null;
  topAnswerCount: number | null;
  answerStats: ReviewStatDetail[];
}

export interface ReviewStatsData {
  averageRating: number;
  initialReviewCount: number;
  oneMonthReviewCount: number;

  sizeSummary: ReviewCategorySummary;
  colorSummary: ReviewCategorySummary;
  materialSummary: ReviewCategorySummary;
}

// 7. 리뷰 통계 요약 조회
export type ReviewStatsResponse = ApiResponse<ReviewStatsData>;

// ----------------------------------------------------------------------
// 6. 기타 액션
// ----------------------------------------------------------------------

// 1. 리뷰 도움돼요 토글
export interface ReviewHelpfulData {
  reviewId: number;
  isHelpful: boolean;
  helpfulCount: number;
}
export type ReviewHelpfulResponse = ApiResponse<ReviewHelpfulData>;

// 4. 미작성 리뷰 카운트
export interface PendingReviewCountData {
  pendingReviewCount: number;
}
export type PendingReviewCountResponse = ApiResponse<PendingReviewCountData>;

// ----------------------------------------------------------------------
// 7. UI 상태 관리용 타입 (State & Filter)
// ----------------------------------------------------------------------

// 필터 상태 (사이즈, 색상, 내 사이즈 보기 여부)
export interface FilterState {
  sizes: string[];
  colors: string[];
  mySize: boolean;
}

// 정렬 옵션 타입
export type SortOptionType = 'best' | 'newest' | 'highRating' | 'lowRating';

// 현재 로그인한 유저 정보 (내 사이즈 필터링용)
export interface CurrentUserType {
  height: number;
  weight: number;
}
