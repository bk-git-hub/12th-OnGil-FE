import { Page } from '../common';
import { ProductType, StockStatus } from '../enums';

export interface Product {
  id: number;
  name: string;
  brandName: string;
  thumbnailImageUrl: string;
  price: number; // 정가
  discountRate: number; // 할인율
  finalPrice: number; // 최종가
  productType: ProductType;
  viewCount: number;
  purchaseCount: number;
  reviewCount: number;
  reviewRating: number;
}

export interface MaterialDescription {
  advantages: string[];
  disadvantages: string[];
  care: string[];
}

export interface ProductOption {
  optionId: number;
  size: string;
  color: string;
  stock: number;
  stockStatus: StockStatus;
}

export interface ProductDetail extends Omit<
  Product,
  'viewCount' | 'purchaseCount' | 'reviewCount'
> {
  description: string;
  materialOriginal?: string;
  materialDescription?: MaterialDescription;
  options: ProductOption[];
  imageUrls: string[];
  brandId: number;
  categoryId: number;
  categoryName: string;
  onSale: boolean;
}

export interface ProductSearchResult {
  products: Page<Product>;
  alternatives: string[]; // 검색 결과 없을 때 추천 검색어
  hasResult: boolean;
}

export interface VoiceSearchResponse {
  extractedKeyword: string;
  searchResult: ProductSearchResult;
}

export interface SizeGuide {
  recommendedSizes: string[];
  sizeStatistics: SizeStatistic[];
  similarCustomers: SimilarCustomer[];
  userBodyInfo: import('./user').UserBodyInfo; // 순환 참조 방지 또는 import 사용
}

export interface SizeStatistic {
  size: string;
  purchaseCount: number;
}

export interface SimilarCustomer {
  height: number;
  weight: number;
  purchasedSize: string;
}
