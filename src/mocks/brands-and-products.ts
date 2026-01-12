import { Product } from '@/types/products';

const BRANDS = ['Nike', 'Apple', 'Sony'] as const;

export const MOCK_PRODUCTS: Product[] = BRANDS.flatMap((brand, index) =>
  Array.from({ length: 6 }, (_, i): Product => {
    const id = (index + 1) * 1000 + i;
    const basePrice = (i + 1) * 50000;
    const saleDiscount = 0.2;
    const isOnSale = i % 2 === 0;

    return {
      id,
      brand,
      productName: `${brand} Alpha-Series Edition ${id}`,
      price: isOnSale ? basePrice * (1 - saleDiscount) : basePrice,
      isOnSale,
      originalPrice: isOnSale ? basePrice : undefined,
      imageUrl: `https://picsum.photos/seed/${brand}-${id}/400/400`,
    };
  }),
);
