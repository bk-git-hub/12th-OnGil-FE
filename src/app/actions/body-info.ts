'use server';

import { api, ApiError } from '@/lib/api-client';
import { bodyInfoSchema, BodyInfoSchemaType } from '@/schemas/body-info';
import { SizeOptionsData } from '@/types/domain/size';
import { revalidatePath } from 'next/cache';

interface MyBodyInfoResponse {
  hasBodyInfo: boolean;
  height: number;
  weight: number;
  topSize: string;
  bottomSize: string;
  shoeSize: string;
}
export interface TermsData {
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
}

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

/**
 * [GET] 수집·이용 동의 약관 조회
 */
export async function getBodyInfoTermsAction(): Promise<{
  success: boolean;
  data?: TermsData;
  message?: string;
}> {
  try {
    const data = await api.get<TermsData>('/users/body-info/terms');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch terms:', error);
    return { success: false, message: '약관 정보를 불러오지 못했습니다.' };
  }
}

/**
 * [GET] 내 체형 정보 조회
 */
export async function getMyBodyInfoAction(): Promise<{
  success: boolean;
  data?: BodyInfoSchemaType & { hasBodyInfo: boolean };
  message?: string;
}> {
  try {
    const response = await api.get<MyBodyInfoResponse>('/users/me/body-info');

    if (!response || !response.hasBodyInfo) {
      return {
        success: true,
        data: {
          hasBodyInfo: false,
          height: 0,
          weight: 0,
          usualTopSize: '',
          usualBottomSize: '',
          usualShoeSize: '',
        },
      };
    }

    // 백엔드 필드명 -> 프론트엔드 필드명 매핑
    return {
      success: true,
      data: {
        hasBodyInfo: true,
        height: response.height,
        weight: response.weight,
        usualTopSize: response.topSize, // topSize -> usualTopSize
        usualBottomSize: response.bottomSize, // bottomSize -> usualBottomSize
        usualShoeSize: response.shoeSize, // shoeSize -> usualShoeSize
      },
    };
  } catch (error) {
    console.error('Failed to fetch my body info:', error);
    return { success: false, message: '내 정보를 불러오지 못했습니다.' };
  }
}

/**
 * [PUT] 체형 정보 저장 및 수정
 */
export async function updateBodyInfoAction(
  data: BodyInfoSchemaType,
  currentPath?: string,
): Promise<ActionResponse> {
  // 1. 유효성 검사
  const validation = bodyInfoSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: '입력 값이 올바르지 않습니다.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 2. API 요청 데이터 변환
  const { height, weight, usualTopSize, usualBottomSize, usualShoeSize } =
    validation.data;

  const payload = {
    height,
    weight,
    topSize: usualTopSize, // 매핑: usualTopSize -> topSize
    bottomSize: usualBottomSize, // 매핑: usualBottomSize -> bottomSize
    shoeSize: usualShoeSize, // 매핑: usualShoeSize -> shoeSize
    agreedToCollection: true, // 필수: 수집 동의 여부
  };

  try {
    // 3. 실제 API 호출 (PUT)
    // 응답값은 필요하다면 변수에 받아 처리할 수 있음
    await api.put('/users/me/body-info', payload);

    // 현재 보고 있는 페이지가 있다면 그 페이지를, 없다면 전체 상품 페이지 패턴을 갱신 => 최신 상태 유지
    if (currentPath) {
      revalidatePath(currentPath, 'page');
    }
    revalidatePath('/product/[id]', 'page');
    revalidatePath('/me', 'page');

    return { success: true, message: '체형 정보가 저장되었습니다.' };
  } catch (error) {
    console.error('Save Error:', error);

    // 백엔드 에러 처리
    if (error instanceof ApiError) {
      // 400 Bad Request 등의 구체적인 에러 메시지가 있다면 전달
      return {
        success: false,
        message: error.message || '입력 정보를 확인해주세요.',
      };
    }

    return { success: false, message: '서버 저장 중 문제가 발생했습니다.' };
  }
}

/**
 * [GET] 사이즈 옵션 목록 조회
 */
export async function getSizeOptionsAction(): Promise<{
  success: boolean;
  data?: SizeOptionsData;
  message?: string;
}> {
  try {
    const data = await api.get<SizeOptionsData>(
      '/users/body-info/size-options',
    );
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch size options:', error);
    return { success: false, message: '사이즈 정보를 불러오지 못했습니다.' };
  }
}
