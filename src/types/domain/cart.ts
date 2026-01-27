export interface CartCreateRequest {
  productId: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface CartUpdateRequest {
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
}

export interface CartResponse {
  cartId: number;
  productId: number;
  productName: string;
  brandName: string;
  thumbnailImageUrl: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  price: number; // 개당 가격
  totalPrice: number; // 총 가격
}
