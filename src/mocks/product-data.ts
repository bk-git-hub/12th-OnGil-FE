import { ProductType, StockStatus } from '@/types/enums';
import { Product, MaterialDescription } from '@/types/domain/product';
import { generateReviewStats } from '@/mocks/review-data';
import { ReviewStatsData } from '@/types/domain/review';

export interface MockProduct extends Omit<Product, 'materialDescription'> {
  categoryId: string;
  stockStatus: StockStatus;

  materialDescription?: MaterialDescription;

  originalPrice?: number;
  materialOriginal?: string;
  monthReviewCount?: number;

  reviewSummary?: ReviewStatsData;
  monthReviewSummary?: ReviewStatsData;

  reviewCount: number;
  viewCount: number;
  purchaseCount: number;
}

const REAL_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80',
];

const MATERIAL_COMPOSITIONS = [
  '면 100%',
  '폴리에스터 100%',
  '면 58%, 폴리 36%, 나일론 6%',
  '울 80%, 아크릴 20%',
  '나일론 100%',
  '면 60%, 모달 40%',
  '레이온 95%, 스판 5%',
];

const MATERIAL_DESCRIPTIONS: MaterialDescription[] = [
  {
    advantages: ['통기성 우수', '부드러운 촉감', '땀 흡수력 좋음'],
    disadvantages: ['세탁 시 수축 주의', '주름 발생 가능'],
    care: ['찬물 세탁', '중성세제 사용', '자연 건조'],
  },
  {
    advantages: ['구김 적음', '내구성 강함', '신축성 좋음'],
    disadvantages: ['고온 건조 주의', '정전기 발생 가능'],
    care: ['미지근한 물 세탁', '건조기 사용 자제'],
  },
  {
    advantages: ['뛰어난 보온성', '고급스러운 광택', '가벼운 착용감'],
    disadvantages: ['보풀 주의', '습기에 약함'],
    care: ['드라이클리닝 필수', '전용 브러쉬 사용'],
  },
];

function getImageByIndex(index: number) {
  return REAL_PRODUCT_IMAGES[index % REAL_PRODUCT_IMAGES.length];
}

function generateDummyProducts(
  categoryId: string,
  count: number,
  baseName: string,
  startId: number, // 추가
): MockProduct[] {
  return Array.from({ length: count }).map((_, i) => {
    const isDiscount = i % 3 !== 0;

    const basePrice = (3 + (i % 5)) * 10000 - 100;
    const originalPrice = isDiscount ? Math.floor(basePrice * 1.3) : basePrice;
    const finalPrice = basePrice;
    const discountRate = isDiscount ? 10 + (i % 5) * 5 : 0;

    const materialDesc =
      MATERIAL_DESCRIPTIONS[i % MATERIAL_DESCRIPTIONS.length];
    const materialComposition =
      MATERIAL_COMPOSITIONS[i % MATERIAL_COMPOSITIONS.length];

    const isSoldOut = i % 10 === 9;
    const isSpecial = i % 5 === 0;

    const reviewCount = ((startId + i) * 37 + 13) % 200;
    const reviewRating = parseFloat(
      ((((startId + i) * 53 + 7) % 50) / 10).toFixed(1),
    );
    const monthReviewCount = Math.floor(reviewCount * 0.3);

    return {
      id: startId + i, // 문자열 -> 숫자 ID로 변경
      name: `${baseName} 에센셜 아이템 ${i + 1}`,
      brandName: ['MUSINSA STANDARD', 'NIKE', 'ADIDAS', 'LEE', 'COVERNAT'][
        i % 5
      ],
      price: originalPrice,
      finalPrice: finalPrice,
      discountRate: discountRate,
      thumbnailImageUrl: getImageByIndex(i),
      categoryId: categoryId,
      stockStatus: isSoldOut ? StockStatus.SOLD_OUT : StockStatus.AVAILABLE,
      productType: isSpecial ? ProductType.SPECIAL_SALE : ProductType.NORMAL,

      materialDescription: materialDesc,
      materialOriginal: materialComposition,
      monthReviewCount: monthReviewCount,

      reviewCount: reviewCount,
      viewCount: ((startId + i) * 71 + 29) % 1000,
      purchaseCount: ((startId + i) * 43 + 17) % 500,
      reviewRating: reviewRating,

      reviewSummary: generateReviewStats(
        reviewCount,
        monthReviewCount,
        'GENERAL',
      ),

      monthReviewSummary: generateReviewStats(
        reviewCount,
        monthReviewCount,
        'MONTH',
      ),
    };
  });
}

const productConfigs = [
  { categoryId: 'top-1', count: 15, baseName: '프리미엄 니트' },
  { categoryId: 'top-2', count: 12, baseName: '오버핏 후드' },
  { categoryId: 'outer-1', count: 10, baseName: '캐시미어 코트' },
  { categoryId: 'outer-3', count: 10, baseName: '덕다운 패딩' },
  { categoryId: 'pants-1', count: 15, baseName: '와이드 데님' },
  { categoryId: 'shoes-1', count: 12, baseName: '데일리 스니커즈' },
  { categoryId: 'bag-1', count: 8, baseName: '미니 크로스백' },
  { categoryId: 'hat-1', count: 10, baseName: '베이직 캡' },
];

export const PRODUCTS: MockProduct[] = productConfigs.reduce<MockProduct[]>(
  (acc, config) => [
    ...acc,
    ...generateDummyProducts(
      config.categoryId,
      config.count,
      config.baseName,
      acc.length,
    ),
  ],
  [],
);
