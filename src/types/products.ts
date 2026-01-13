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

export interface SortInfo {
  direction: string;
  nullHandling: string;
}

export interface SpecialPriceCardProps extends Product {
  reviewCount: number;
  saleRate: number;
}

export interface ProductListReturnType {
  status: string;
  timestamp: string;
}
export interface ProductListDataType {
  totalPages: number;
  totalElements: number;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableInfo {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortInfo[];
  unpaged: boolean;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoImageUrl: string;
}

export interface PaginatedData {
  totalPages: number;
  totalElements: number;
  pageable: PageableInfo;
  first: boolean;
  last: boolean;
  size: number;
  content: Product[];
  number: number;
  sort: SortInfo[];
  numberOfElements: number;
  empty: boolean;
}

export interface ProductListResponse {
  status: string;
  timestamp: string;
  data: PaginatedData;
}
