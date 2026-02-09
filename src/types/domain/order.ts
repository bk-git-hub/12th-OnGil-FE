export interface OrderFromCartRequest {
  cartItemIds: number[];
  usedPoints: number;
  recipient: string;
  recipientPhone: string;
  deliveryAddress: string;
  detailAddress: string;
  postalCode: string;
  deliveryMessage: string;
}

export interface OrderItemRequest {
  productId: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface OrderFromProductRequest {
  items: OrderItemRequest[];
  usedPoints: number;
  recipient: string;
  recipientPhone: string;
  deliveryAddress: string;
  detailAddress: string;
  postalCode: string;
  deliveryMessage: string;
}

export interface OrderItem {
  productId: number;
  brandName: string;
  productName: string;
  imageUrl: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  priceAtOrder: number;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  orderItems: OrderItem[];
  totalAmount: number;
  recipient: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryMessage: string;
  createdAt: string;
}
