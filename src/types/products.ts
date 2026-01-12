export interface Product {
  id: number;
  brand: string;
  productName: string;
  price: number;
  isOnSale: boolean;
  originalPrice?: number;
  imageUrl: string;
}

export interface SpecialPriceCardProps extends Product {
  reviewCount: number;
  saleRate: number;
}
