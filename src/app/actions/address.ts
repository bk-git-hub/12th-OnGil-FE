'use server';

import { api } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { rethrowNextError } from '@/lib/server-action-utils';
import {
  ApiStatusResponse,
  AddressItem,
  AddressRequest,
  AddressResponseData,
  ChangeOrderAddressRequest,
} from '@/types/domain/address';

/** * 내 배송지 목록 조회 */
export async function getAddresses(): Promise<AddressItem[]> {
  try {
    const response = await api.get<AddressItem[]>('/addresses');
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('배송지 목록 조회 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '배송지 목록 조회에 실패했습니다.',
    );
  }
}

/** * 현재 사용자의 기본 배송지/상세 조회 */
export async function getMyAddress(): Promise<AddressResponseData> {
  try {
    const response = await api.get<AddressResponseData>('/addresses/me');
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('내 배송지 조회 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '배송지 정보를 불러오는데 실패했습니다.',
    );
  }
}

/** * 배송지 등록 */
export async function registerAddress(
  data: AddressRequest,
): Promise<AddressResponseData> {
  try {
    const response = await api.post<AddressResponseData, AddressRequest>(
      '/addresses',
      data,
    );
    revalidatePath('/address');
    revalidatePath('/orders', 'layout');
    revalidatePath('/orders/checkout');
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('배송지 등록 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '배송지 등록에 실패했습니다.',
    );
  }
}

/** * 배송지 수정 */
export async function updateAddress(
  addressId: number,
  data: AddressRequest,
): Promise<AddressResponseData> {
  try {
    const response = await api.patch<AddressResponseData, AddressRequest>(
      `/addresses/${addressId}`,
      data,
    );
    revalidatePath('/address');
    revalidatePath('/orders', 'layout');
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('배송지 수정 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '배송지 수정에 실패했습니다.',
    );
  }
}

/** * 배송지 삭제 */
export async function deleteAddress(addressId: number): Promise<void> {
  try {
    await api.delete(`/addresses/${addressId}`);
    revalidatePath('/address');
    revalidatePath('/orders', 'layout');
  } catch (error) {
    rethrowNextError(error);
    console.error('배송지 삭제 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '배송지 삭제에 실패했습니다.',
    );
  }
}

/** * 기본 배송지 설정 */
export async function setAsDefaultAddress(
  addressId: number,
): Promise<ApiStatusResponse> {
  try {
    const response = await api.patch<ApiStatusResponse, Record<string, never>>(
      `/addresses/${addressId}/default`,
      {},
    );
    revalidatePath('/address');
    revalidatePath('/orders', 'layout');
    return response;
  } catch (error) {
    rethrowNextError(error);
    console.error('기본 배송지 설정 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '기본 배송지 설정에 실패했습니다.',
    );
  }
}

/** * 주문 배송지 변경 (주문 접수 상태일 때만 가능) */
export async function changeOrderShippingAddress(
  orderId: number,
  addressId: number,
): Promise<void> {
  try {
    await api.patch<void, ChangeOrderAddressRequest>(
      `/orders/${orderId}/delivery-address`,
      { addressId },
    );
  } catch (error) {
    rethrowNextError(error);
    console.error('주문 배송지 변경 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '주문 배송지 변경에 실패했습니다.',
    );
  }
}
