// Auth & User
export enum LoginType {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  GENERAL = 'GENERAL',
}

// Product
export enum ProductType {
  NORMAL = 'NORMAL', // 일반 상품
  SPECIAL_SALE = 'SPECIAL_SALE', // 특가 상품
}

export enum StockStatus {
  AVAILABLE = 'AVAILABLE', // 구매 가능
  SOLD_OUT = 'SOLD_OUT', // 품절
}

// Category
export enum CategoryType {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
}

// Order
export enum OrderStatus {
  ORDER_RECEIVED = 'ORDER_RECEIVED',
}

// Search Sort (Parameter Enum)
export enum ProductSortType {
  POPULAR = 'POPULAR',
  REVIEW = 'REVIEW',
  PRICE_HIGH = 'PRICE_HIGH',
  PRICE_LOW = 'PRICE_LOW',
}
