import { OrderStatus } from '../enums';

// --- 주문 내역 조회 (GET /orders) ---

export interface OrderListItem {
  productId: number;
  productName: string;
  productImage: string;
  brandName: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  orderDate: string;
  items: OrderListItem[];
}

export interface OrderListResponse {
  content: OrderSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface OrderListParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// --- 주문 생성 ---

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

// --- 주문 취소 ---

export interface OrderCancelRequest {
  cancelReason: string;
  cancelDetail?: string;
  addToCart?: boolean;
}

export interface RefundInfo {
  productAmount: number;
  shippingFee: number;
  usedPoints: number;
  refundAmount: number;
}

export interface OrderRefundInfoResponse {
  orderItems: OrderItem[];
  refundInfo: RefundInfo;
}

export interface OrderCancelResponse {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  canceledAt: string;
  cancelReason: string;
  cancelDetail: string;
  orderItems: OrderItem[];
  refundInfo: RefundInfo;
  deliveryAddress: string;
  recipient: string;
  recipientPhone: string;
  deliveryMessage: string;
  createdAt: string;
}
