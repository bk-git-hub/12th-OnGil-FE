import { ProductType, StockStatus } from '@/types/enums';
import { Product, MaterialDescription } from '@/types/domain/product';
import { generateReviewStats } from '@/mocks/review-data';
import { ReviewStatsData } from '@/types/domain/review';

export interface MockProduct extends Omit<
  Product,
  'id' | 'materialDescription'
> {
  id: string | number;
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

    const reviewCount = Math.floor(Math.random() * 200);
    const monthReviewCount = Math.floor(reviewCount * 0.3);

    return {
      id: `${categoryId}-${i}`,
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
      viewCount: Math.floor(Math.random() * 1000),
      purchaseCount: Math.floor(Math.random() * 500),

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

export const PRODUCTS: MockProduct[] = [
  ...generateDummyProducts('top-1', 15, '프리미엄 니트'),
  ...generateDummyProducts('top-2', 12, '오버핏 후드'),
  ...generateDummyProducts('outer-1', 10, '캐시미어 코트'),
  ...generateDummyProducts('outer-3', 10, '덕다운 패딩'),
  ...generateDummyProducts('pants-1', 15, '와이드 데님'),
  ...generateDummyProducts('shoes-1', 12, '데일리 스니커즈'),
  ...generateDummyProducts('bag-1', 8, '미니 크로스백'),
  ...generateDummyProducts('hat-1', 10, '베이직 캡'),
];
