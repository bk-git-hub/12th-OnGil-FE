/**
 * 인터페이스 정의
 */
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoImageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  originalPrice?: number;
  discountRate?: number;
  discountPrice?: number;
  finalPrice: number;
  thumbnailImageUrl: string;
  brandName: string;
  productType: 'NORMAL' | 'AUCTION' | string;
  productTypeDescription: string;
  viewCount: number;
  purchaseCount: number;
  reviewCount: number;
}

/**
 * [1] 브랜드 배열 (유효한 이미지 URL 포함)
 * 고해상도 로고 이미지를 위해 Unsplash 소스를 사용했습니다.
 */
export const BRANDS: Brand[] = [
  {
    id: 'br-01',
    name: 'Nike',
    description: 'World-class sportswear and equipment',
    logoImageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'br-02',
    name: 'Apple',
    description: 'Premium electronics and software',
    logoImageUrl:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'br-03',
    name: 'Aesop',
    description: 'Skincare, haircare and body care',
    logoImageUrl:
      'https://images.unsplash.com/photo-1608528577221-9085ff33588a?q=80&w=200&auto=format&fit=crop',
  },
];

/**
 * [2] 제품 데이터 생성 로직
 */
export const MOCK_PRODUCTS: Product[] = BRANDS.flatMap((brand, brandIndex) => {
  return Array.from({ length: 6 }, (_, i): Product => {
    const id = brandIndex * 10 + (i + 1);
    const originalPrice = 50000 + Math.floor(Math.random() * 20) * 10000; // 5만~25만 원
    const hasDiscount = Math.random() > 0.3; // 70% 확률로 할인 적용
    const discountRate = hasDiscount
      ? [10, 15, 20, 30][Math.floor(Math.random() * 4)]
      : 0;
    const discountPrice = (originalPrice * discountRate) / 100;
    const finalPrice = originalPrice - discountPrice;

    // 각 브랜드와 인덱스에 따라 다른 제품 이미지를 보여주기 위해 picsum 사용
    const thumbnailImageUrl = `https://picsum.photos/seed/${brand.id}-${i}/400/400`;

    return {
      id,
      name: `${brand.name} ${['Premium', 'Essential', 'Limited', 'Signature'][i % 4]} Edition Vol.${i + 1}`,
      originalPrice,
      discountRate: discountRate || undefined,
      discountPrice: discountPrice || undefined,
      finalPrice,
      thumbnailImageUrl,
      brandName: brand.name,
      productType: i === 0 ? 'AUCTION' : 'NORMAL', // 브랜드당 첫 번째 아이템은 경매
      productTypeDescription: i === 0 ? '한정판 경매 상품' : '정식 출시 상품',
      viewCount: Math.floor(Math.random() * 10000),
      purchaseCount: Math.floor(Math.random() * 1000),
      reviewCount: Math.floor(Math.random() * 500),
    };
  });
});

// 데이터 확인
console.log(`Total Brands: ${BRANDS.length}`);
console.log(`Total Products: ${MOCK_PRODUCTS.length}`);
