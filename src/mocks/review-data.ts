import {
  ReviewDetail,
  ReviewStatsData,
  ProductWithReviewStats,
  WritableReviewItem,
  ReviewCategorySummary,
  InitialFirstAnswers,
  ReviewerInfo,
} from '@/types//domain/review';

// ----------------------------------------------------------------------
// 1. 데이터 풀 (Data Pools)
// ----------------------------------------------------------------------
const NORMAL_CONTENTS = [
  '배송도 빠르고 상품도 마음에 들어요. 재질이 생각보다 더 좋네요.',
  '사이즈가 딱 맞아요! 색감도 화면이랑 똑같습니다. 추천해요.',
  '생각보다 얇긴 한데 여름에 입기엔 딱인 것 같아요. 잘 입겠습니다.',
  '가성비 최고입니다. 다른 색상으로 하나 더 구매하려고요.',
  '포장이 꼼꼼해서 기분이 좋았습니다. 옷 핏도 예쁘네요.',
  '화면에서 보던 것보다 색이 약간 어두운 감이 있지만 그래도 만족합니다.',
];

const MONTH_CONTENTS = [
  '한달 동안 입어봤는데 보풀도 안 생기고 짱짱합니다. 세탁해도 변형 없어요.',
  '몇 번 빨았더니 약간 줄어든 것 같기도 한데, 입는 데는 지장 없어요.',
  '색 빠짐이 걱정됐는데 한 달 내내 입어도 색감이 그대로라 좋아요.',
];

const AI_SUMMARIES = [
  '대체로 사이즈가 정사이즈이며 소재가 부드럽다는 평이 많습니다.',
  '화면보다 색감이 밝고 배송이 빠르다는 의견이 주를 이룹니다.',
  '한달 사용 후에도 변형이 적어 만족도가 높은 상품입니다.',
];

const IMAGES_POOL = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
  'https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=300&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80',
  'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=300&q=80',
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&q=80',
];

const COLORS = ['Black', 'Melange Grey', 'Navy', 'White', 'Beige'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const USUAL_SIZES = ['상의 44', '상의 55', '상의 66', '하의 26', '하의 28'];

// ----------------------------------------------------------------------
// 2. 리뷰 리스트 Mock (ReviewDetail[])
//    - JSON 5번(상세 조회) 구조를 리스트로 반환하도록 시뮬레이션
// ----------------------------------------------------------------------
export function generateMockReviews(count: number): ReviewDetail[] {
  const sizeAnswers = ['large', 'fit', 'small'];
  const colorAnswers = ['bright', 'exact', 'dark'];
  const materialAnswers = ['soft', 'normal', 'rough'];

  return Array.from({ length: count }).map((_, i) => {
    const isMonth = Math.random() < 0.3; // 30% 확률로 한달 리뷰
    const contentPool = isMonth ? MONTH_CONTENTS : NORMAL_CONTENTS;

    // 이미지 0~3장 랜덤
    const imgCount = Math.floor(Math.random() * 4);
    const reviewImageUrls = Array.from({ length: imgCount }).map(
      (_, idx) => IMAGES_POOL[(i + idx) % IMAGES_POOL.length],
    );

    // 1차 답변
    const initialFirstAnswers: InitialFirstAnswers = {
      sizeAnswer: sizeAnswers[Math.floor(Math.random() * sizeAnswers.length)],
      colorAnswer:
        colorAnswers[Math.floor(Math.random() * colorAnswers.length)],
      materialAnswer:
        materialAnswers[Math.floor(Math.random() * materialAnswers.length)],
    };

    // 작성자 정보
    const reviewer: ReviewerInfo = {
      height: 150 + Math.floor(Math.random() * 35),
      weight: 45 + Math.floor(Math.random() * 40),
      usualTopSize: USUAL_SIZES[Math.floor(Math.random() * USUAL_SIZES.length)],
      usualBottomSize: '27',
      usualShoeSize: '240mm',
    };

    return {
      reviewId: i + 1,
      reviewType: isMonth ? 'MONTH' : 'NORMAL',
      rating: 4 + (Math.random() > 0.8 ? 0 : 1), // 4점 또는 5점
      helpfulCount: Math.floor(Math.random() * 50),
      isHelpful: Math.random() < 0.2,

      aiGeneratedReview:
        Math.random() < 0.5 ? AI_SUMMARIES[i % AI_SUMMARIES.length] : null,
      textReview: contentPool[i % contentPool.length],
      reviewImageUrls,

      reviewer,
      purchaseOption: {
        selectedColor: COLORS[i % COLORS.length],
        selectedSize: SIZES[i % SIZES.length],
      },
      product: {
        productId: 100 + i,
        productName: '데일리 베이직 오버핏 셔츠',
        brandName: 'ONGIL',
        thumbnailImageUrl: IMAGES_POOL[0],
      },

      initialFirstAnswers,
      initialSecondAnswers: {
        fitIssueParts: Math.random() > 0.5 ? '소매가 조금 길어요' : null,
        materialFeatures: Math.random() > 0.5 ? '구김이 적어요' : null,
      },
      oneMonthAnswers: {
        overall: isMonth ? '만족스러워요' : null,
        changes: isMonth ? '보풀 없이 깨끗해요' : null,
      },

      createdAt: `2024-01-${10 + (i % 20)}`,
      completedAt: `2024-01-${10 + (i % 20)}`,
    };
  });
}

// ----------------------------------------------------------------------
// 3. 통계 데이터 Mock (ReviewStatsData)
//    - JSON 7번 기반 (answerStats 채워서 리턴)
// ----------------------------------------------------------------------
export function generateReviewStats(
  generalCount: number,
  monthCount: number,
  mode: 'GENERAL' | 'MONTH',
): ReviewStatsData {
  // 1. 현재 모드에 따라 기준이 되는 총 개수 설정
  // (일반 탭이면 generalCount 기준, 한달 탭이면 monthCount 기준으로 요약 통계 생성)
  const targetTotalCount = mode === 'GENERAL' ? generalCount : monthCount;

  // 2. 통계 요약 생성 헬퍼 (비율로 계산)
  const createSummary = (
    category: string,
    topAnswerLabel: string,
  ): ReviewCategorySummary => {
    // 리뷰가 0개면 통계도 0으로 리턴
    if (targetTotalCount === 0) {
      return {
        category,
        totalCount: 0,
        topAnswer: null,
        topAnswerCount: 0,
        answerStats: [],
      };
    }

    // 예: 약 60~80%가 1위 답변을 선택했다고 가정
    const ratio = 0.6 + Math.random() * 0.2;
    const topCount = Math.floor(targetTotalCount * ratio);
    const remainCount = targetTotalCount - topCount;

    return {
      category,
      totalCount: targetTotalCount, // 현재 탭의 총 개수
      topAnswer: topAnswerLabel,
      topAnswerCount: topCount, // 비율에 맞춰 계산된 인원 수
      answerStats: [
        {
          label: '아쉬워요',
          count: Math.floor(remainCount * 0.3),
          percentage: 0,
        }, // 퍼센트는 UI에서 계산하거나 여기서 대략 넣음
        { label: topAnswerLabel, count: topCount, percentage: 0 },
        {
          label: '보통이에요',
          count: remainCount - Math.floor(remainCount * 0.3),
          percentage: 0,
        },
      ],
    };
  };

  return {
    averageRating: mode === 'GENERAL' ? 4.7 : 4.8,

    // 상단에 표시될 총 개수는 항상 고정값 전달
    initialReviewCount: generalCount,
    oneMonthReviewCount: monthCount,

    // 하단 디테일 통계는 mode에 따라 텍스트와 숫자가 달라짐
    sizeSummary: createSummary('사이즈', '정사이즈예요'),

    colorSummary: createSummary(
      '색감',
      mode === 'GENERAL' ? '화면과 같아요' : '변색 없어요', // 탭에 따라 멘트 변경
    ),

    materialSummary: createSummary(
      '소재',
      mode === 'GENERAL' ? '부드러워요' : '변형 없어요', // 탭에 따라 멘트 변경
    ),
  };
}
// ----------------------------------------------------------------------
// 4. 상품 목록 (내가 쓴 리뷰용) Mock
//    - JSON 2번, 6번 기반
// ----------------------------------------------------------------------
export function generateMyReviews(count: number): ProductWithReviewStats[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: 300 + i,
    name: `프리미엄 울 카디건 ${i + 1}`,
    price: 89000,
    discountRate: 10,
    finalPrice: 80100,
    thumbnailImageUrl: IMAGES_POOL[(i + 2) % IMAGES_POOL.length],
    brandName: 'ONGIL Premium',
    productType: 'NORMAL',
    viewCount: 1200 + i * 10,
    purchaseCount: 300 + i,
    reviewCount: 45,
    reviewRating: 4.7,
  }));
}

// ----------------------------------------------------------------------
// 5. 작성 가능한 리뷰 목록 Mock
//    - JSON 3번 기반
// ----------------------------------------------------------------------
export function generateWritableReviews(count: number): WritableReviewItem[] {
  return Array.from({ length: count }).map((_, i) => ({
    orderItemId: 5000 + i,
    availableReviewType: i % 2 === 0 ? 'NORMAL' : 'MONTH',
    product: {
      productId: 200 + i,
      productName: `[가을신상] 에센셜 니트 베스트 ${i + 1}`,
      brandName: 'ONGIL Basic',
      thumbnailImageUrl: IMAGES_POOL[i % IMAGES_POOL.length],
    },
    purchaseOption: `${COLORS[i % COLORS.length]} / ${SIZES[i % SIZES.length]}`,
    orderedAt: '2024-01-15T10:00:00',
    reviewAvailableAt: '2024-01-17T10:00:00',
  }));
}
