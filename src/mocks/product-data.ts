import { ProductType, StockStatus } from '@/types/enums';
import { MaterialDescription, Product } from '@/types/domain/product';

export interface MockProduct extends Omit<Product, 'id' | 'categoryId'> {
  id: string | number;
  categoryId: string;
  stockStatus: StockStatus;
  materialDescription?: MaterialDescription;
  originalPrice?: number;
  materialOriginal?: string;
}

const REAL_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80',
];

// 랜덤 혼용률 데이터셋
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
    advantages: [
      '통기성이 뛰어나 여름철에도 시원해요.',
      '구김이 잘 가지 않아 관리가 편해요.',
      '신축성이 좋아 활동하기 좋습니다.',
      '피부에 닿는 촉감이 부드러워요.',
    ],
    disadvantages: [
      '물에 젖으면 무거워질 수 있어요.',
      '고온 건조 시 수축될 수 있어요.',
    ],
    care: [
      '30도 이하의 미지근한 물에서 중성세제로 세탁해주세요.',
      '표백제 사용은 피해주세요.',
      '그늘에서 자연 건조하는 것을 추천해요.',
    ],
  },
  {
    advantages: [
      '보온성이 뛰어나 겨울철 필수 아이템이에요.',
      '내구성이 강해 오래 입을 수 있어요.',
      '가벼운 무게감으로 착용감이 좋아요.',
    ],
    disadvantages: [
      '보풀이 생길 수 있으니 주의해주세요.',
      '정전기가 발생할 수 있어요.',
    ],
    care: [
      '드라이클리닝을 권장해요.',
      '손세탁 시 비비지 말고 가볍게 눌러 빨아주세요.',
    ],
  },
  {
    advantages: [
      '땀 흡수가 빨라 쾌적함을 유지해요.',
      '천연 소재로 피부 자극이 적어요.',
      '세탁 후 건조가 빨라요.',
    ],
    disadvantages: [
      '주름이 잘 생길 수 있어요.',
      '초기 세탁 시 약간의 물빠짐이 있을 수 있어요.',
    ],
    care: [
      '찬물 세탁을 권장해요.',
      '세탁망을 사용하면 옷감을 보호할 수 있어요.',
    ],
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

      reviewCount: Math.floor(Math.random() * 100),
      viewCount: Math.floor(Math.random() * 1000),
      purchaseCount: Math.floor(Math.random() * 500),
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
