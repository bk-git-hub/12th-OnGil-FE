import { ProductType } from '@/types/enums';
import type { Product } from '@/types/domain/product';
import type { Brand } from '@/types/domain/brand';

/**
 * [1] 브랜드 배열 (유효한 이미지 URL 포함)
 * 고해상도 로고 이미지를 위해 Unsplash 소스를 사용했습니다.
 */
export const BRANDS: Brand[] = [
  {
    id: 1,
    name: 'Nike',
    description: 'World-class sportswear and equipment',
    logoImageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Apple',
    description: 'Premium electronics and software',
    logoImageUrl:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 3,
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
    const price = 50000 + Math.floor(Math.random() * 20) * 10000; // 5만~25만 원
    const hasDiscount = Math.random() > 0.3; // 70% 확률로 할인 적용
    const discountRate = hasDiscount
      ? [10, 15, 20, 30][Math.floor(Math.random() * 4)]
      : 0;
    const discountPrice = (price * discountRate) / 100;
    const finalPrice = price - discountPrice;

    // 각 브랜드와 인덱스에 따라 다른 제품 이미지를 보여주기 위해 picsum 사용
    const thumbnailImageUrl = `https://picsum.photos/seed/${brand.id}-${i}/400/400`;

    return {
      id,
      name: `${brand.name} ${['Premium', 'Essential', 'Limited', 'Signature'][i % 4]} Edition Vol.${i + 1}`,
      price,
      discountRate: discountRate || 0,
      finalPrice,
      thumbnailImageUrl,
      brandName: brand.name,
      productType: i === 0 ? ProductType.SPECIAL_SALE : ProductType.NORMAL, // 브랜드당 첫 번째 아이템은 경매
      viewCount: Math.floor(Math.random() * 10000),
      purchaseCount: Math.floor(Math.random() * 1000),
      reviewCount: Math.floor(Math.random() * 500),
    };
  });
});
