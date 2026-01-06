export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  imageUrl: string;
  categoryId: string;
  isSoldOut?: boolean;
};

// 브랜드, 가격, 할인율, 품절 여부 등이 무작위로 설정된 테스트용 상품 목업 데이터를 자동 생성하는 코드
const REAL_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80',
];

function getRandomImage() {
  return REAL_PRODUCT_IMAGES[
    Math.floor(Math.random() * REAL_PRODUCT_IMAGES.length)
  ];
}

function generateDummyProducts(
  categoryId: string,
  count: number,
  baseName: string,
): Product[] {
  return Array.from({ length: count }).map((_, i) => {
    const isDiscount = Math.random() > 0.4;
    const price = Math.floor(Math.random() * 20 + 3) * 10000 - 100; // 29,900 ~

    return {
      id: `${categoryId}-${i}`,
      name: `${baseName} 에센셜 아이템 ${i + 1}`,
      brand: ['MUSINSA STANDARD', 'NIKE', 'ADIDAS', 'LEE', 'COVERNAT'][
        Math.floor(Math.random() * 5)
      ],
      price: price,
      originalPrice: isDiscount ? Math.floor(price * 1.3) : undefined,
      discountRate: isDiscount
        ? Math.floor(Math.random() * 30 + 10)
        : undefined,
      imageUrl: getRandomImage(),
      categoryId: categoryId,
      isSoldOut: Math.random() > 0.9,
    };
  });
}

export const PRODUCTS: Product[] = [
  ...generateDummyProducts('top-1', 15, '프리미엄 니트'),
  ...generateDummyProducts('top-2', 12, '오버핏 후드'),
  ...generateDummyProducts('outer-1', 10, '캐시미어 코트'),
  ...generateDummyProducts('outer-3', 10, '덕다운 패딩'),
  ...generateDummyProducts('pants-1', 15, '와이드 데님'),
  ...generateDummyProducts('shoes-1', 12, '데일리 스니커즈'),
  ...generateDummyProducts('bag-1', 8, '미니 크로스백'),
  ...generateDummyProducts('hat-1', 10, '베이직 캡'),
];
