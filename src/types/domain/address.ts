/** 배송지 목록 조회 아이템 */
export interface AddressItem {
  addressId: number;
  recipientName: string;
  recipientPhone: string;
  baseAddress: string;
  detailAddress: string;
  postalCode: string;
  isDefault: boolean;
  deliveryRequest?: string;
}

/** 배송지 등록/수정 요청 데이터 */
export interface AddressRequest {
  recipientName: string;
  baseAddress: string;
  detailAddress: string;
  postalCode: string;
  phone: string;
  deliveryRequest?: string;
}

/** 배송지 상세 정보  */
export interface AddressDetail {
  addressId: number;
  recipientName: string;
  address: string;
  postalCode: string;
  phone: string;
  deliveryRequest?: string;
}

/** 배송지 등록/수정/조회 응답 래퍼 */
export interface AddressResponseData {
  hasShippingInfo: boolean;
  shippingDetail: AddressDetail;
}

/** 주문 배송지 변경 요청 */
export interface ChangeOrderAddressRequest {
  addressId: number;
}

export interface ApiStatusResponse {
  status: string;
  timestamp: string;
  data: string;
}
